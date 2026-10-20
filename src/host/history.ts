/** Read a visual's own call and result through DSH's asynchronous Session observation API. */
import { isAbsolute } from 'node:path'
import { TOOL_NAME } from './description.ts'
import type { ResponseStatus } from './pending.ts'

/** The original host directory and entry, retained independently of later directory changes. */
export interface VisualSource {
  readonly kind: 'local'
  readonly root: string
  readonly path: string
}

/** The fields needed to restore a sidebar card without mounting its conversation turn. */
export interface RecordedVisual {
  readonly arguments: string
  readonly seq?: number
  readonly meta?: unknown
  readonly error?: string
}

interface QueryContext { get(name: string): unknown }
interface Observation {
  readonly events: readonly unknown[]
  [Symbol.dispose](): void
}
interface SessionQuery {
  observeSession(sessionId: string, options: { projectionMode: 'none' }): Promise<Observation>
}

function object(value: unknown): Record<string, unknown> | undefined {
  return typeof value === 'object' && value !== null && !Array.isArray(value) ? value as Record<string, unknown> : undefined
}

function failure(data: Record<string, unknown>, message: Record<string, unknown> | undefined): string | undefined {
  if (data.isError !== true && message?.isError !== true) return undefined
  const reason = object(data.error)?.reason
  if (typeof reason === 'string') return reason
  const content = message?.content ?? data.content
  const text = Array.isArray(content)
    ? content.map(block => { const item = object(block); return item?.type === 'text' && typeof item.text === 'string' ? item.text : '' }).filter(Boolean).join('\n')
    : ''
  return text || 'The visual failed.'
}

function findVisual(events: readonly unknown[], callId: string): RecordedVisual | undefined {
  let visual: RecordedVisual | undefined
  for (const raw of events) {
    const event = object(raw)
    const data = object(event?.data)
    if (!event || !data) continue
    if (event.type === 'tool/call' && data.callId === callId && data.name === TOOL_NAME && typeof data.arguments === 'string') {
      visual = { arguments: data.arguments, ...typeof event.seq === 'number' ? { seq: event.seq } : {} }
    } else if ((event.type === 'tool/ptc-dispatch-start' || event.type === 'tool/ptc-dispatch') && data.subCallId === callId && data.name === TOOL_NAME) {
      visual ??= { arguments: JSON.stringify(data.arguments ?? {}), ...typeof event.seq === 'number' ? { seq: event.seq } : {} }
      if (event.type === 'tool/ptc-dispatch') {
        const error = failure(data, undefined)
        visual = { ...visual, ...data.meta !== undefined ? { meta: data.meta } : {}, ...error !== undefined ? { error } : {} }
      }
    } else if (event.type === 'tool/result' && visual !== undefined) {
      const message = object(data.message)
      const resultId = typeof message?.toolCallId === 'string' ? message.toolCallId : object(message?.source)?.callId
      if (resultId !== callId) continue
      const error = failure(data, message)
      visual = { ...visual, ...data.meta !== undefined ? { meta: data.meta } : {}, ...error !== undefined ? { error } : {} }
    }
  }
  return visual
}

/** Observe one session at an immutable cut and release the observation after finding this call. */
export async function readRecordedVisual(ctx: QueryContext, sessionId: string, callId: string): Promise<RecordedVisual | undefined> {
  const query = ctx.get('sessionQuery') as SessionQuery | undefined
  if (!query) return undefined
  let observation: Observation
  try { observation = await query.observeSession(sessionId, { projectionMode: 'none' }) } catch (error) {
    if (object(error)?.code === 'SESSION_QUERY_SESSION_NOT_FOUND') return undefined
    throw error
  }
  try { return findVisual(observation.events, callId) } finally { observation[Symbol.dispose]() }
}

function visualMeta(meta: unknown, callId: string): Record<string, unknown> | undefined {
  const value = object(meta)
  return value?.lantern === 1 && value.id === callId ? value : undefined
}

/** Validate plugin-owned durable source metadata; old relative-only results are not guessed. */
export function recordedSource(meta: unknown, callId: string): VisualSource | undefined {
  const source = object(visualMeta(meta, callId)?.source)
  if (source?.kind !== 'local' || typeof source.root !== 'string' || !isAbsolute(source.root)
    || typeof source.path !== 'string' || source.path === '' || isAbsolute(source.path)) return undefined
  return { kind: 'local', root: source.root, path: source.path }
}

/** A recorded final outcome distinguishes a late answer from an already completed one. */
export function recordedStatus(visual: RecordedVisual | undefined, callId: string): Exclude<ResponseStatus, 'waiting'> {
  if (visual?.error !== undefined) return 'closed'
  const status = visualMeta(visual?.meta, callId)?.status
  return status === 'answered' || status === 'dismissed' || status === 'timeout' || status === 'closed' ? status : 'unknown'
}
