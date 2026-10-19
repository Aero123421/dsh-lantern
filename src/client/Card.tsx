/**
 * The chrome around a visual: title, status, actions and the frame. The same
 * card appears in the tool row while a turn runs, under the final answer once
 * the turn has ended, and in the sidebar.
 */
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { copy } from './i18n.ts'
import { Frame } from './Frame.tsx'
import { answer, dismiss, openInSidebar, sendAsUser, workspaceUrl } from './services.ts'
import { readLocal, replacementOf, useRegistry, visualKey, visualState, writeLocal, type VisualRecord } from './store.ts'

export type Placement = 'tool' | 'tail' | 'panel'

export interface CardProps {
  readonly record: VisualRecord
  readonly sessionId: string | undefined
  readonly placement: Placement
  readonly phase: 'preparing' | 'start' | 'result' | 'replay'
  /** Markup streamed so far, while the call is being written. */
  readonly partialHtml?: string
}

function Icon({ name }: { name: 'visual' | 'sidebar' | 'chevron' | 'skip' | 'arrow' }) {
  const paths: Record<typeof name, ReactNode> = {
    visual: <><rect x="2.5" y="3" width="11" height="10" rx="2" /><path d="M5 10l2-2.5 1.6 1.8L10.5 7 12 10" /></>,
    sidebar: <><rect x="2.5" y="3" width="11" height="10" rx="2" /><path d="M9.5 3v10" /></>,
    chevron: <path d="M4.5 6.5L8 10l3.5-3.5" />,
    skip: <path d="M4.5 4.5l7 7M11.5 4.5l-7 7" />,
    arrow: <path d="M4 8h8M8.5 4.5L12 8l-3.5 3.5" />,
  }
  return <svg className="lantern-icon" viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

function scrollToVisual(callId: string, sessionId: string | undefined): void {
  const target = document.querySelector(`[data-lantern-key="${CSS.escape(visualKey(callId, sessionId))}"]`)
  target?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

export function VisualCard({ record, sessionId, placement, phase, partialHtml }: CardProps) {
  const c = copy()
  const callId = record.callId
  const session = sessionId ?? record.sessionId
  const key = visualKey(callId, session)
  const replacedBy = useRegistry(() => replacementOf(callId, session))
  // Re-read per-browser state whenever the registry changes (answers, collapse).
  const local = useRegistry(() => readLocal(callId, session))
  const [errors, setErrors] = useState<readonly string[]>([])
  const [notice, setNotice] = useState<string | undefined>(undefined)
  const [skipping, setSkipping] = useState(false)
  // A short "click first" hint when the wheel was kept for the chat, and a
  // paused state when the browser dropped the visual's WebGL context.
  const [wheelHint, setWheelHint] = useState(false)
  const [glLost, setGlLost] = useState(false)
  const [generation, setGeneration] = useState(0)
  const hintTimer = useRef<number | undefined>(undefined)
  useEffect(() => () => { if (hintTimer.current !== undefined) clearTimeout(hintTimer.current) }, [])
  const args = record.args
  const { state, response } = record.error !== undefined ? { state: 'closed' as const, response: undefined } : visualState(record, phase)
  const title = args?.title || c.visual
  const isPath = (record.result?.path ?? args?.path) !== undefined
  const display = args?.display ?? 'inline'

  const onSubmit = useCallback(async (value: unknown) => {
    setNotice(undefined)
    try { await answer(callId, session, value) } catch (error) {
      setNotice(`${c.sendFailed}: ${(error as Error).message}`)
      throw error
    }
  }, [callId, session])
  const onSend = useCallback(async (text: string) => {
    setNotice(undefined)
    try { await sendAsUser(session, text) } catch (error) {
      setNotice(`${c.sendFailed}: ${(error as Error).message}`)
      throw error
    }
  }, [session])
  const onExpand = useCallback(() => openInSidebar(session, callId), [session, callId])
  const onError = useCallback((message: string) => setErrors(list => list.length >= 3 ? list : [...list, message]), [])
  const onWheelHint = useCallback(() => {
    setWheelHint(true)
    if (hintTimer.current !== undefined) clearTimeout(hintTimer.current)
    hintTimer.current = window.setTimeout(() => setWheelHint(false), 2200)
  }, [])
  const onGlLost = useCallback((lost: boolean) => setGlLost(lost), [])
  const restart = useCallback(() => { setGlLost(false); setGeneration(value => value + 1) }, [])
  const onSkip = useCallback(() => {
    setSkipping(true)
    dismiss(callId, session)
      .then(settled => { if (!settled) setNotice(c.notWaiting) }, (error: Error) => setNotice(`${c.sendFailed}: ${error.message}`))
      .finally(() => setSkipping(false))
  }, [callId, session])

  const badge = phase === 'preparing' ? c.preparing
    : record.error !== undefined ? c.error
    : state === 'waiting' ? c.waiting
    : state === 'answered' ? c.answered
    : state === 'dismissed' ? c.dismissed
    : state === 'timeout' ? c.timeout
    : undefined
  const waiting = state === 'waiting' && record.result === undefined && phase !== 'preparing'

  // Replaced: a stub that leads to the newer version.
  if (replacedBy !== undefined && placement !== 'panel') {
    return (
      <div className="lantern-row" data-lantern-id={callId} data-lantern-key={key} data-replaced="">
        <Icon name="visual" />
        <span className="lantern-row-title">{title}</span>
        <span className="lantern-muted">{c.replaced}</span>
        <button type="button" className="lantern-link" onClick={() => scrollToVisual(replacedBy, session)}>{c.showNew}<Icon name="arrow" /></button>
      </div>
    )
  }

  const skipButton = waiting
    ? <button type="button" className="lantern-action" onClick={onSkip} disabled={skipping} title={c.skip}><Icon name="skip" /><span>{c.skip}</span></button>
    : null

  // Panel visuals keep a compact row in the chat.
  if (placement !== 'panel' && (display === 'panel' || isPath)) {
    return (
      <div className="lantern-row" data-lantern-id={callId} data-lantern-key={key} data-state={state}>
        <Icon name="sidebar" />
        <span className="lantern-row-title">{title}</span>
        {badge && <span className="lantern-badge" data-state={state}>{badge}</span>}
        <span className="lantern-muted">{waiting ? c.answerInSidebar : c.shownInSidebar}</span>
        <span className="lantern-spacer" />
        {skipButton}
        {phase !== 'preparing' && <button type="button" className="lantern-action" onClick={onExpand} title={c.openSidebar}><Icon name="sidebar" /><span>{c.openSidebar}</span></button>}
        {record.error && <div className="lantern-note" data-kind="error">{record.error}</div>}
        <Notes notice={notice} errors={errors} />
      </div>
    )
  }

  const collapsed = placement !== 'panel' && local.collapsed === true
  const body = record.error !== undefined
    ? <div className="lantern-note" data-kind="error">{record.error}</div>
    : isPath
      ? <PathFrame key={generation} record={record} sessionId={session} state={state} response={response} onSubmit={onSubmit} onSend={onSend} onError={onError} onGlLost={onGlLost} />
      : args?.html !== undefined || partialHtml !== undefined
        ? <Frame key={(phase === 'preparing' ? 'stream' : 'full') + generation} callId={callId} sessionId={session} mode={placement === 'panel' ? 'panel' : 'inline'}
            html={phase === 'preparing' ? partialHtml ?? '' : args?.html ?? ''} streaming={phase === 'preparing'}
            state={state} response={response} onSubmit={onSubmit} onSend={onSend} onExpand={placement === 'panel' ? undefined : onExpand} onError={onError}
            onWheelHint={onWheelHint} onGlLost={onGlLost} />
        : <div className="lantern-note">{c.preparing}</div>
  const overlays = <>
    {wheelHint && !glLost && <div className="lantern-hint" role="status">{c.wheelHint}</div>}
    {glLost && (
      <div className="lantern-paused">
        <span>{c.glLost}</span>
        <button type="button" className="lantern-action lantern-resume" onClick={restart}>{c.resume}</button>
      </div>
    )}
  </>

  if (placement === 'panel') {
    return (
      <div className="lantern-panel" data-lantern-panel={callId} data-state={state}>
        {(waiting || notice || errors.length > 0) && (
          <div className="lantern-panel-bar">
            {badge && <span className="lantern-badge" data-state={state}>{badge}</span>}
            <span className="lantern-spacer" />
            {skipButton}
          </div>
        )}
        <Notes notice={notice} errors={errors} />
        <div className="lantern-panel-body">{body}{overlays}</div>
      </div>
    )
  }

  return (
    <div className="lantern-card" data-lantern-id={callId} data-lantern-key={key} data-state={state} data-placement={placement}>
      <div className="lantern-head">
        <Icon name="visual" />
        <span className="lantern-title">{title}</span>
        {badge && <span className="lantern-badge" data-state={state}>{badge}</span>}
        <span className="lantern-spacer" />
        {skipButton}
        {phase !== 'preparing' && <button type="button" className="lantern-action icon" onClick={onExpand} title={c.openSidebar} aria-label={c.openSidebar}><Icon name="sidebar" /></button>}
        <button type="button" className="lantern-action icon" data-collapsed={collapsed ? '' : undefined}
          onClick={() => writeLocal(callId, { collapsed: !collapsed }, session)} title={collapsed ? c.expand : c.collapse} aria-label={collapsed ? c.expand : c.collapse} aria-expanded={!collapsed}>
          <Icon name="chevron" />
        </button>
      </div>
      <div className="lantern-body" hidden={collapsed}>{body}{overlays}</div>
      <Notes notice={notice} errors={errors} />
    </div>
  )
}

function Notes({ notice, errors }: { notice: string | undefined; errors: readonly string[] }) {
  const c = copy()
  if (!notice && errors.length === 0) return null
  return (
    <div className="lantern-notes">
      {notice && <div className="lantern-note" data-kind="error">{notice}</div>}
      {errors.map((message, index) => <div key={index} className="lantern-note" data-kind="warn">{c.scriptError}: {message}</div>)}
    </div>
  )
}

function PathFrame(props: {
  record: VisualRecord
  sessionId: string | undefined
  state: Parameters<typeof Frame>[0]['state']
  response: unknown
  onSubmit: (value: unknown) => Promise<void>
  onSend: (text: string) => Promise<void>
  onError: (message: string) => void
  onGlLost: (lost: boolean) => void
}) {
  const c = copy()
  const path = props.record.result?.path ?? props.record.args?.path
  const [url, setUrl] = useState<string | undefined>(undefined)
  const [error, setError] = useState<string | undefined>(undefined)
  useEffect(() => {
    if (!path || !props.sessionId) return
    let live = true
    setUrl(undefined)
    setError(undefined)
    workspaceUrl(props.sessionId, props.record.callId).then(value => { if (live) setUrl(value) }, (failure: Error) => { if (live) setError(failure.message) })
    return () => { live = false }
  }, [path, props.sessionId, props.record.callId])
  if (error) return <div className="lantern-note" data-kind="error">{c.fileError}: {error}</div>
  if (!url) return <div className="lantern-note">{c.loading}</div>
  return <Frame callId={props.record.callId} sessionId={props.sessionId} mode="panel" url={url} state={props.state} response={props.response}
    onSubmit={props.onSubmit} onSend={props.onSend} onError={props.onError} onGlLost={props.onGlLost} />
}
