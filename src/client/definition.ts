/** Replayable visual calls, including nested PTC dispatches, indexed by DSH's Chat target. */
export const TOOL_NAME = 'show_visual'
export const TURN_KEY = 'lanternVisuals'

export interface TurnCall {
  readonly callId: string
  readonly seq: number
  readonly time?: number
  readonly argsRaw: string
  readonly meta?: unknown
  readonly settled: boolean
  readonly isError: boolean
  readonly errorText?: string
}

interface ConvEvent {
  readonly type: string
  readonly seq: number
  readonly time?: number
  readonly data: Record<string, unknown>
}

interface Match {
  readonly event: ConvEvent
  readonly location: unknown
}

interface NodeContext {
  readonly key: string
  readonly kind: string
  readonly id: string
  readonly start?: Match
  readonly matches: readonly Match[]
  readonly state?: TurnCall
}

function object(value: unknown): Record<string, unknown> | undefined {
  return value !== null && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : undefined
}

export function textOf(content: unknown): string {
  if (!Array.isArray(content)) return ''
  return content.map(item => {
    const block = object(item)
    return block?.type === 'text' && typeof block.text === 'string' ? block.text : ''
  }).join('\n').trim()
}

function result(event: ConvEvent): { meta: unknown; isError: boolean; errorText?: string } {
  const payload = event.type === 'tool/result' ? object(event.data.message) : event.data
  const isError = payload?.isError === true
  return {
    meta: event.data.meta,
    isError,
    ...isError ? { errorText: textOf(payload?.content) || String(object(event.data.error)?.code ?? 'error') } : {},
  }
}

function call(event: ConvEvent): TurnCall | undefined {
  const native = event.type === 'tool/call'
  if (!native && event.type !== 'tool/ptc-dispatch-start' && event.type !== 'tool/ptc-dispatch') return undefined
  if (event.data.name !== TOOL_NAME) return undefined
  const callId = native ? event.data.callId : event.data.subCallId
  if (typeof callId !== 'string' || callId === '') return undefined
  const argsRaw = native ? event.data.arguments : JSON.stringify(event.data.arguments)
  if (typeof argsRaw !== 'string') return undefined
  const settled = event.type === 'tool/ptc-dispatch'
  return { callId, seq: event.seq, time: event.time, argsRaw, settled, ...settled ? result(event) : { isError: false } }
}

/** Each invocation keeps its engine-resolved Turn even when turn/start is outside the history window. */
export const turnDefinition = {
  kind: TURN_KEY,
  target: 'chat',
  match: (event: ConvEvent) => {
    if (event.type === 'tool/result') {
      const message = object(event.data.message)
      const callId = object(message?.source)?.callId ?? message?.toolCallId
      return typeof callId === 'string' && callId !== '' ? { id: callId, role: 'update' as const } : null
    }
    if (event.data.name !== TOOL_NAME) return null
    if (event.type === 'tool/call' && typeof event.data.callId === 'string') {
      return { id: event.data.callId, role: 'start' as const }
    }
    if ((event.type === 'tool/ptc-dispatch-start' || event.type === 'tool/ptc-dispatch') && typeof event.data.subCallId === 'string') {
      // A terminal PTC event is a complete checkpoint, including arguments.
      // Treat it as a start too so a paged history window can rebuild it.
      return { id: event.data.subCallId, role: 'start' as const }
    }
    return null
  },
  start: (_context: unknown, match: Match): TurnCall => {
    const value = call(match.event)
    if (value === undefined) throw new Error('dsh-lantern: invalid visual start event')
    return value
  },
  update: (context: { readonly state: TurnCall }, match: Match): TurnCall => {
    if (match.event.type !== 'tool/result' && match.event.type !== 'tool/ptc-dispatch') return context.state
    return { ...context.state, settled: true, ...result(match.event) }
  },
  buildViewNode: (context: NodeContext) => {
    const first = context.start ?? context.matches[0]
    const data = context.state ?? (first === undefined ? undefined : call(first.event))
    if (first === undefined || data === undefined) return null
    return {
      key: context.key, kind: TURN_KEY, id: context.id, target: 'chat',
      anchorSeq: data.seq, location: first.location, visibility: 'visible',
      // This is answer content, not a tool/process detail. Do not fold it away.
      groupTree: 'turn', data,
    }
  },
}
