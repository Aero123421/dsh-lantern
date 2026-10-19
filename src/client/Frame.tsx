/**
 * One sandboxed iframe running a visual. The iframe has an opaque origin
 * (no `allow-same-origin`), so it cannot touch DSH's cookies, DOM or API;
 * everything it asks for arrives here as a postMessage and is checked:
 * the message must come from this iframe, and answers, messages and links
 * need a fresh user action inside it.
 */
import { useEffect, useMemo, useRef, useState } from 'react'
import { buildDocument, partialMarkup } from '../frame/document.ts'
import { MESSAGE_TAG, type FrameBoot, type VisualState } from '../frame/runtime.ts'
import { uiLang } from './i18n.ts'
import { readLocal, writeLocal } from './store.ts'
import { onTheme, theme } from './theme.ts'

export interface FrameProps {
  readonly callId: string
  readonly sessionId?: string
  readonly mode: 'inline' | 'panel'
  /** Markup for an `html` visual. */
  readonly html?: string
  /** URL of a workspace page (path visuals). */
  readonly url?: string
  /** Show `html` as a streaming preview: markup only, no scripts. */
  readonly streaming?: boolean
  /** Restored card: paint the markup, but do not run its scripts. */
  readonly paused?: boolean
  readonly state: VisualState
  readonly response: unknown
  readonly onSubmit: (value: unknown) => Promise<void>
  readonly onSend: (text: string) => Promise<void>
  readonly onExpand?: () => void
  readonly onError?: (message: string) => void
  /** The visual kept a wheel turn from its own handlers so the chat could scroll. */
  readonly onWheelHint?: () => void
  /** The visual's WebGL context was lost (true) or restored (false). */
  readonly onGlLost?: (lost: boolean) => void
  readonly maxHeight?: number
}

// No popups and no same-origin: links leave through `open-link`, checked here.
const SANDBOX = 'allow-scripts allow-forms allow-downloads'
const MAX_INLINE_HEIGHT = 2400
const MAX_JSON = 64 * 1024
const SEND_INTERVAL_MS = 1500
const MAX_SENDS = 6

// When did the user last press a key or a pointer in DSH itself (outside any
// visual)? Activation from that input must not count for a visual.
let lastHostInput = 0
let watchingHostInput = false
function watchHostInput(): void {
  if (watchingHostInput) return
  watchingHostInput = true
  const mark = () => { lastHostInput = performance.now() }
  window.addEventListener('pointerdown', mark, true)
  window.addEventListener('keydown', mark, true)
}

/**
 * True only right after the user acted inside this iframe: it holds focus,
 * it got focus after the user's last input in DSH itself, and the browser
 * reports a fresh user activation (activation inside a child frame also
 * activates the page that embeds it).
 */
function userActed(frame: HTMLIFrameElement | null, focusedAt: number): boolean {
  if (!frame || document.activeElement !== frame) return false
  if (focusedAt === 0 || lastHostInput > focusedAt) return false
  const activation = (navigator as Navigator & { userActivation?: { isActive: boolean } }).userActivation
  return activation ? activation.isActive : false
}

export function Frame(props: FrameProps) {
  const { callId, sessionId, mode, html, url, streaming = false, paused = false, state, response } = props
  const frame = useRef<HTMLIFrameElement>(null)
  const ready = useRef(false)
  const [height, setHeight] = useState(mode === 'inline' ? (paused ? 220 : 120) : 0)
  const latest = useRef(props)
  latest.current = props
  const lastAction = useRef(0)
  const lastSend = useRef(0)
  const sends = useRef(0)
  const focusedAt = useRef(0)
  const loads = useRef(0)
  const dead = useRef(false)

  // Remember when focus moved into this iframe (the page's window blurs then).
  useEffect(() => {
    watchHostInput()
    const onBlur = () => { if (document.activeElement === frame.current) focusedAt.current = performance.now() }
    window.addEventListener('blur', onBlur)
    return () => window.removeEventListener('blur', onBlur)
  }, [])

  // The document is built once per markup; state and theme changes travel by message.
  const initial = useRef({ state, response })
  const srcDoc = useMemo(() => {
    if (html === undefined) return undefined
    const local = readLocal(callId, sessionId)
    let widgetState: unknown = null
    if (local.state !== undefined) { try { widgetState = JSON.parse(local.state) } catch { widgetState = null } }
    const current = theme()
    const preview = streaming && !paused
    const boot: FrameBoot = {
      id: callId, state: initial.current.state, response: initial.current.response ?? null,
      scheme: current.scheme, mode, widgetState, streaming: preview, lang: uiLang(),
      ...mode === 'inline' ? { maxHeight: latest.current.maxHeight ?? MAX_INLINE_HEIGHT } : {},
    }
    // A paused card keeps the markup and CSS, with scripts and handlers removed
    // so a reload cannot run them even if the sandbox attribute is ignored.
    const source = preview ? '' : paused ? partialMarkup(html) : html
    return buildDocument(source, boot, current.css)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [html, streaming, paused, callId, sessionId, mode])

  const src = useMemo(() => {
    if (url === undefined) return undefined
    const target = new URL(url)
    target.searchParams.set('lt', callId)
    target.searchParams.set('theme', theme().scheme)
    target.searchParams.set('lang', uiLang())
    return target.href
  }, [url, callId])

  const post = (message: Record<string, unknown>) => {
    frame.current?.contentWindow?.postMessage({ ...message, [MESSAGE_TAG]: 1 }, '*')
  }

  // Messages from the iframe.
  useEffect(() => {
    ready.current = false
    loads.current = 0
    dead.current = false
    const onMessage = (event: MessageEvent) => {
      const win = frame.current?.contentWindow
      if (!win || event.source !== win) return
      const data = event.data as Record<string, unknown> | null
      if (!data || data[MESSAGE_TAG] !== 1 || typeof data.type !== 'string') return
      // An html visual that navigated away is no longer the document we built.
      if (dead.current) return
      const p = latest.current
      const reply = (id: unknown, ok: boolean, error?: string) => {
        if (typeof id === 'number') post({ type: 'reply', id, ok, ...error ? { error } : {} })
      }
      switch (data.type) {
        case 'ready': {
          ready.current = true
          const current = theme()
          post({ type: 'theme', css: current.css, scheme: current.scheme })
          post({ type: 'state', state: p.state, response: p.response ?? null })
          if (p.streaming && p.html !== undefined) post({ type: 'partial', html: partialMarkup(p.html) })
          return
        }
        case 'resize': {
          if (p.mode !== 'inline') return
          const value = Number(data.height)
          if (Number.isFinite(value)) setHeight(Math.max(24, Math.min(Math.ceil(value), p.maxHeight ?? MAX_INLINE_HEIGHT)))
          return
        }
        case 'hint':
          if (p.mode === 'inline' && !p.streaming && data.kind === 'wheel') p.onWheelHint?.()
          return
        case 'gl':
          if (!p.streaming) p.onGlLost?.(data.lost === true)
          return
        case 'submit':
        case 'send': {
          if (p.streaming) { reply(data.id, false, 'The visual is still being written.'); return }
          if (!userActed(frame.current, focusedAt.current)) { reply(data.id, false, 'Only a user action inside the visual can do this.'); return }
          const now = Date.now()
          if (now - lastAction.current < 400) { reply(data.id, false, 'Too fast.'); return }
          if (data.type === 'send') {
            if (now - lastSend.current < SEND_INTERVAL_MS || sends.current >= MAX_SENDS) { reply(data.id, false, 'Too many messages from this visual.'); return }
            lastSend.current = now
            sends.current++
          }
          lastAction.current = now
          if (data.type === 'submit') {
            if (typeof data.json !== 'string' || data.json.length > MAX_JSON) { reply(data.id, false, 'The answer is too large.'); return }
            if (p.state === 'answered' || p.state === 'dismissed' || p.state === 'closed') { reply(data.id, false, 'This visual is already settled.'); return }
            let value: unknown
            try { value = JSON.parse(data.json) } catch { reply(data.id, false, 'The answer is not JSON.'); return }
            p.onSubmit(value).then(() => reply(data.id, true), (error: Error) => reply(data.id, false, error.message))
          } else {
            if (typeof data.text !== 'string' || data.text.trim() === '') { reply(data.id, false, 'Empty message.'); return }
            p.onSend(data.text.slice(0, 4000)).then(() => reply(data.id, true), (error: Error) => reply(data.id, false, error.message))
          }
          return
        }
        case 'expand': {
          if (p.streaming || !userActed(frame.current, focusedAt.current)) return
          const now = Date.now()
          if (now - lastAction.current < 1000) return
          lastAction.current = now
          p.onExpand?.()
          return
        }
        case 'open-link': {
          if (p.streaming || !userActed(frame.current, focusedAt.current) || typeof data.url !== 'string') return
          const now = Date.now()
          if (now - lastAction.current < 1000) return
          lastAction.current = now
          let target: URL
          try { target = new URL(data.url) } catch { return }
          if (target.protocol !== 'http:' && target.protocol !== 'https:') return
          window.open(target.href, '_blank', 'noopener,noreferrer')
          return
        }
        case 'set-state':
          if (!p.streaming && typeof data.json === 'string' && data.json.length <= MAX_JSON) writeLocal(p.callId, { state: data.json }, p.sessionId)
          return
        case 'error':
          if (typeof data.message === 'string') p.onError?.(data.message.slice(0, 300))
          return
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [srcDoc, src])

  // State and theme changes after load.
  useEffect(() => {
    if (ready.current) post({ type: 'state', state, response: response ?? null })
  }, [state, JSON.stringify(response ?? null)])

  useEffect(() => onTheme(next => {
    if (ready.current) post({ type: 'theme', css: next.css, scheme: next.scheme })
  }), [])

  // Streaming preview: send complete tags only, at most every 120 ms.
  const partialTimer = useRef<number | undefined>(undefined)
  useEffect(() => {
    if (!streaming || html === undefined) return
    if (partialTimer.current !== undefined) return
    partialTimer.current = window.setTimeout(() => {
      partialTimer.current = undefined
      const p = latest.current
      if (ready.current && p.html !== undefined) post({ type: 'partial', html: partialMarkup(p.html) })
    }, 120)
  }, [streaming, html])
  useEffect(() => () => { if (partialTimer.current !== undefined) clearTimeout(partialTimer.current) }, [])

  const style = mode === 'inline' ? { height: `${height}px` } : undefined
  return (
    <iframe
      ref={frame}
      className="lantern-frame"
      data-mode={mode}
      title={callId}
      sandbox={paused ? 'allow-downloads' : SANDBOX}
      data-scripts={paused ? 'off' : 'on'}
      onLoad={() => {
        // A built document loads once; a second load means it navigated
        // itself somewhere else, so stop listening to it.
        loads.current++
        if (srcDoc !== undefined && loads.current > 1) dead.current = true
      }}
      allow="fullscreen; clipboard-write"
      referrerPolicy="no-referrer"
      style={style}
      {...srcDoc !== undefined ? { srcDoc } : { src }}
    />
  )
}
