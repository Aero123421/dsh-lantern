/**
 * The three places a visual appears: the `show_visual` tool row, the turn
 * tail under the final answer, and a sidebar tab.
 */
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { VisualCard } from './Card.tsx'
import { copy, useCopy } from './i18n.ts'
import { holdScripts, notifyScripts, observeVisual } from './live.ts'
import { fetchVisual, openInSidebar, parseAddress } from './services.ts'
import { getRecord, inTail, markTail, parseArgs, parseMeta, upsert, useRegistry, visualKey, type VisualRecord } from './store.ts'

import { TOOL_NAME, textOf, type TurnCall } from './definition.ts'

export { TOOL_NAME, turnDefinition } from './definition.ts'

function recordFromCall(item: TurnCall, sessionId: string | undefined): Omit<VisualRecord, 'callId'> {
  return {
    sessionId,
    seq: item.seq,
    args: parseArgs(item.argsRaw),
    result: item.settled && !item.isError ? parseMeta(item.meta) : undefined,
    error: item.isError ? item.errorText || copy().error : undefined,
  }
}

// ── tool row ──────────────────────────────────────────────────────────────

interface PartialArgs { text(key: string): string; has(key: string): boolean; value?(key: string): unknown }
type Block = Record<string, any>
interface ToolViewProps {
  readonly phase: 'preparing' | 'start' | 'result'
  readonly block: Block
  readonly callId: string
  readonly sessionId?: string
}

const autoOpened = new Set<string>()

function rawFromPartial(args: PartialArgs | undefined): string | undefined {
  if (!args?.has || !args.has('title')) return undefined
  const out: Record<string, unknown> = {}
  for (const key of ['title', 'html', 'path', 'display', 'replace']) if (args.has(key)) out[key] = args.text(key)
  if (args.has('await_response')) out.await_response = args.value?.('await_response') === true
  return JSON.stringify(out)
}

export function ToolView(props: ToolViewProps) {
  const { phase, block, callId, sessionId } = props
  const key = visualKey(callId, sessionId)
  const bornAt = typeof block.time === 'number' ? block.time : typeof block.callTime === 'number' ? block.callTime : undefined
  const argsRaw: string | undefined = phase === 'start' ? block.argsRaw : phase === 'result' ? block.call?.argsRaw ?? undefined : undefined
  // When the call itself is outside the loaded history, the result still carries the parsed arguments.
  const fallbackRaw = useMemo(() => argsRaw === undefined && phase === 'result' ? rawFromPartial(block.args as PartialArgs | undefined) : undefined, [argsRaw, phase, block.args])
  const parsed = useMemo(() => parseArgs(argsRaw ?? fallbackRaw), [argsRaw, fallbackRaw])
  const partial = phase === 'preparing' ? block.args as PartialArgs | undefined : undefined
  const partialTitle = partial?.has('title') ? partial.text('title') : ''
  const partialHtml = partial?.has('html') ? partial.text('html') : undefined
  const partialPanel = partial?.has('path') || (partial?.has('display') && partial.text('display') === 'panel')
  // Decide during render, so a restored `start` (still waiting) is not treated as live.
  // Workspace pages stay paused until Run, even on the turn that created them.
  const pathVisual = Boolean(parsed?.path) || partial?.has('path') === true
  const fresh = observeVisual(key, phase, bornAt, !pathVisual)
  const held = pathVisual && holdScripts(key)
  useEffect(() => { if (fresh || held) notifyScripts() }, [fresh, held, key])
  const isError = phase === 'result' && block.isError === true
  const errorText = isError ? (textOf(block.content) || String(block.error?.code ?? copy().error)) : undefined
  const meta = phase === 'result' && !isError ? parseMeta(block.meta) : undefined

  useEffect(() => {
    upsert(callId, { sessionId, ...parsed ? { args: parsed } : {}, ...meta ? { result: meta } : {}, ...errorText ? { error: errorText } : {}, ...typeof block.seq === 'number' ? { seq: block.seq } : {} })
  }, [callId, sessionId, parsed, meta?.status, meta?.response, errorText])

  // A live panel visual opens the sidebar by itself, once.
  const sawLive = useRef(phase !== 'result')
  useEffect(() => {
    if (phase !== 'preparing' && sawLive.current && parsed?.display === 'panel' && !errorText && !autoOpened.has(key)) {
      autoOpened.add(key)
      // Let the registry learn the record first.
      queueMicrotask(() => openInSidebar(sessionId, callId))
    }
  }, [phase, parsed?.display, errorText, key, sessionId])

  const shownInTail = useRegistry(() => inTail(callId, sessionId))
  const stored = useRegistry(() => getRecord(callId, sessionId))
  const c = useCopy()

  const record: VisualRecord = {
    ...stored,
    callId,
    sessionId: sessionId ?? stored?.sessionId,
    args: parsed ?? stored?.args ?? (phase === 'preparing'
      ? { title: partialTitle, display: partialPanel ? 'panel' : 'inline', await: false }
      : undefined),
    result: meta ?? stored?.result,
    error: errorText ?? stored?.error,
  }

  if (shownInTail) {
    return (
      <div className="lantern-row lantern-row-quiet" data-tool={TOOL_NAME}>
        <span className="lantern-row-title">{record.args?.title || c.visual}</span>
        <span className="lantern-muted">{c.shownBelow}</span>
      </div>
    )
  }
  if (phase === 'result' && record.args === undefined && !record.error) {
    return <div className="lantern-row lantern-row-quiet" data-tool={TOOL_NAME}><span className="lantern-muted">{textOf(block.content)}</span></div>
  }
  return (
    <div className="lantern-tool" data-tool={TOOL_NAME}>
      <VisualCard key={key} record={record} sessionId={sessionId} placement="tool" phase={phase} partialHtml={partialHtml} />
    </div>
  )
}

// ── turn tail ─────────────────────────────────────────────────────────────

interface TailProps {
  readonly turn: { readonly turn: number }
  readonly seq: number
  readonly sessionId?: string
  readonly useVisuals: (turn: string) => readonly TurnCall[] | undefined
}

export function Tail(props: TailProps) {
  const calls = props.useVisuals(String(props.turn.turn)) ?? EMPTY_CALLS
  const visible = calls.filter(item => item.seq < props.seq)
  useEffect(() => {
    for (const item of calls) upsert(item.callId, recordFromCall(item, props.sessionId))
  }, [calls, props.sessionId])
  if (visible.length === 0) return null
  return (
    <div className="lantern-tail">
      {visible.map(item => <TailItem key={visualKey(item.callId, props.sessionId)} item={item} sessionId={props.sessionId} />)}
    </div>
  )
}

const EMPTY_CALLS: readonly TurnCall[] = []

function TailItem({ item, sessionId }: { item: TurnCall; sessionId: string | undefined }) {
  const record = useMemo<VisualRecord>(() => ({ callId: item.callId, ...recordFromCall(item, sessionId) }), [item, sessionId])
  useEffect(() => record.args === undefined ? undefined : markTail(item.callId, sessionId), [item.callId, sessionId, record.args])
  if (record.args === undefined) return null
  return <VisualCard record={record} sessionId={sessionId} placement="tail" phase={item.settled ? 'result' : 'replay'} />
}

// ── sidebar tab ───────────────────────────────────────────────────────────

interface TabProps {
  readonly sessionId?: string
  readonly useTabInfo: () => { tab: { navigation: { address?: string } } }
}

export function SidebarTab(props: TabProps) {
  const { tab } = props.useTabInfo()
  const target = parseAddress(tab.navigation.address)
  const record = useRegistry(() => target ? getRecord(target.callId, target.sessionId) : undefined)
  const targetKey = target ? visualKey(target.callId, target.sessionId) : undefined
  const hasArguments = record?.args !== undefined
  const [load, setLoad] = useState<{ key: string; error?: string } | undefined>(undefined)
  useEffect(() => {
    if (!target || !targetKey || hasArguments) return
    let live = true
    setLoad({ key: targetKey })
    fetchVisual(target.sessionId, target.callId).then(value => {
      if (!live) return
      const args = parseArgs(value.arguments)
      if (args === undefined) { setLoad({ key: targetKey, error: copy().missing }); return }
      upsert(target.callId, { sessionId: target.sessionId, args, seq: value.seq, result: parseMeta(value.meta), error: value.error })
    }, (error: Error) => { if (live) setLoad({ key: targetKey, error: error.message }) })
    return () => { live = false }
  }, [targetKey, hasArguments])
  const box = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)
  // DSH can keep a second, hidden copy of the sidebar; only a copy that is
  // actually on screen loads the page.
  useEffect(() => {
    const el = box.current
    if (!el) return
    const check = () => setShown(el.getClientRects().length > 0 && el.offsetWidth > 0)
    check()
    const observer = new ResizeObserver(check)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  const c = useCopy()
  let body: ReactNode
  if (!target) body = <div className="lantern-empty">{c.missing}</div>
  else if (!record?.args) body = load && load.key === targetKey && load.error
    ? <div className="lantern-empty" role="alert">{c.missing} {load.error}</div>
    : <div className="lantern-empty" role="status">{c.loading}</div>
  else if (shown) body = <VisualCard key={visualKey(target.callId, target.sessionId)} record={record} sessionId={target.sessionId} placement="panel" phase={record.result ? 'result' : 'start'} />
  return <div ref={box} className="lantern-tab">{body}</div>
}

export function tabTitle(address: string): string {
  const target = parseAddress(address)
  const record = target ? getRecord(target.callId, target.sessionId) : undefined
  return record?.args?.title || copy().visual
}
