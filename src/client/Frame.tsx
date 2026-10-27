/**
 * One sandboxed iframe running a visual. The iframe has an opaque origin
 * (no `allow-same-origin`), so it cannot touch DSH's cookies, DOM or API;
 * the trusted prelude connects a private message port, and its native
 * activation check requires an action inside the iframe. The parent also
 * checks focus, lifecycle, message sizes and request rates.
 */
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { buildDocument, partialMarkup } from '../frame/document.ts'
import { MESSAGE_TAG, RESTORE_PREFIX, type FrameBoot, type VisualState } from '../frame/runtime.ts'
import { acceptConnect, childOrigin, readFrameMessage } from './channel.ts'
import { copy, uiLang } from './i18n.ts'
import { readLocal, writeLocal } from './store.ts'
import { onTheme, theme } from './theme.ts'

export interface FrameProps {
  readonly callId: string
  /** Human-readable accessible name, never the internal call id. */
  readonly title?: string
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
  /** An html document navigated itself; scripts were removed. */
  readonly onNavigated?: () => void
  readonly maxHeight?: number
}

// No popups and no same-origin: links leave through `open-link`, checked here.
const SANDBOX = 'allow-scripts allow-forms allow-downloads'
// Chromium fires the iframe load, and only then delivers the child load
// listener's port message (a 0ms timer still runs too early; 10ms was enough
// in a tight probe). Wait briefly so a real document can say it stayed.
const KEPT_GRACE_MS = 100
const MAX_INLINE_HEIGHT = 2400
const MAX_JSON = 64 * 1024
const SEND_INTERVAL_MS = 1500
const MAX_SENDS = 6

/**
 * Additional parent checks: the iframe holds focus and the page has fresh
 * activation. The private runtime separately checks native child activation.
 * Do not infer child focus from window blur: moving directly between two
 * iframes does not necessarily blur the parent window again.
 */
function userActed(frame: HTMLIFrameElement | null): boolean {
  if (!frame || document.activeElement !== frame) return false
  const activation = (navigator as Navigator & { userActivation?: { isActive: boolean } }).userActivation
  return activation ? activation.isActive : false
}

export function Frame(props: FrameProps) {
  const { callId, sessionId, mode, html, url, streaming = false, paused = false, state, response } = props
  const frame = useRef<HTMLIFrameElement>(null)
  const ready = useRef(false)
  const connection = useRef<MessagePort | undefined>(undefined)
  const [colorScheme, setColorScheme] = useState(() => theme().scheme)
  const [height, setHeight] = useState(mode === 'inline' ? (paused ? 220 : 120) : 0)
  const latest = useRef(props)
  latest.current = props
  const lastAction = useRef(0)
  const lastSend = useRef(0)
  const sends = useRef(0)
  const loads = useRef(0)
  const kept = useRef(false)
  const driftTimer = useRef<number | undefined>(undefined)
  const dead = useRef(false)
  // An html card that navigates away is showing some other document. Put the
  // card back and drop scripts, so that navigation cannot stay on a workspace
  // file or on /lantern/files/.
  const [drifted, setDrifted] = useState(false)
  const scriptsOff = paused || drifted

  // The document is built once per markup; state and theme changes travel by message.
  const initial = useRef({ state, response })
  const bridge = useMemo(() => Array.from(crypto.getRandomValues(new Uint8Array(16)), value => value.toString(16).padStart(2, '0')).join(''),
    [streaming ? '' : html, streaming, url, callId, sessionId, mode])
  const srcDoc = useMemo(() => {
    if (html === undefined) return undefined
    const local = readLocal(callId, sessionId)
    let widgetState: unknown = null
    if (local.state !== undefined) { try { widgetState = JSON.parse(local.state) } catch { widgetState = null } }
    const current = theme()
    const preview = streaming && !scriptsOff
    const boot: FrameBoot = {
      id: callId, bridge, state: initial.current.state, response: initial.current.response ?? null,
      scheme: current.scheme, mode, widgetState, streaming: preview, lang: uiLang(),
      ...mode === 'inline' ? { maxHeight: latest.current.maxHeight ?? MAX_INLINE_HEIGHT } : {},
    }
    // A paused card keeps the markup and CSS, with scripts and handlers removed
    // so a reload cannot run them even if the sandbox attribute is ignored.
    const source = preview ? '' : scriptsOff ? partialMarkup(html) : html
    return buildDocument(source, boot, current.css)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streaming ? '' : html, streaming, scriptsOff, callId, sessionId, mode, bridge])

  const src = useMemo(() => {
    if (url === undefined) return undefined
    const target = new URL(url)
    target.searchParams.set('lt', callId)
    target.searchParams.set('theme', theme().scheme)
    target.searchParams.set('lang', uiLang())
    return target.href
  }, [url, callId])

  // A workspace document is served by the host, but widget state belongs
  // to this browser. The trusted prelude consumes and clears this name
  // before the page's own scripts run, so getState() is synchronous there
  // just as it is for srcDoc visuals. No browser state goes in its URL.
  const restoreName = useMemo(() => {
    if (url === undefined) return undefined
    let widgetState: unknown = null
    const local = readLocal(callId, sessionId)
    if (local.state !== undefined) { try { widgetState = JSON.parse(local.state) } catch { /* ignore damaged storage */ } }
    return RESTORE_PREFIX + JSON.stringify({ id: callId, bridge, state: initial.current.state, response: initial.current.response ?? null, widgetState })
  }, [url, callId, sessionId, bridge])

  const post = (message: Record<string, unknown>) => {
    connection.current?.postMessage({ ...message, [MESSAGE_TAG]: 1 })
  }

  // Install before the browser can deliver the prelude's first connection
  // message. Only this port may carry requests; arbitrary model scripts
  // can call window.postMessage but cannot obtain the private endpoint.
  useLayoutEffect(() => {
    ready.current = false
    loads.current = 0
    kept.current = false
    if (driftTimer.current !== undefined) window.clearTimeout(driftTimer.current)
    driftTimer.current = undefined
    dead.current = false
    const onMessage = (event: MessageEvent) => {
      if (!childOrigin(event.origin)) return
      const kind = readFrameMessage(event.data)
      if (!kind) return
      const data = event.data as Record<string, unknown>
      // An html visual that navigated away is no longer the document we built.
      if (dead.current) return
      const p = latest.current
      const reply = (id: unknown, ok: boolean, error?: string) => {
        if (typeof id === 'number') post({ type: 'reply', id, ok, ...error ? { error } : {} })
      }
      switch (kind.type) {
        case 'kept':
          kept.current = true
          if (driftTimer.current !== undefined) window.clearTimeout(driftTimer.current)
          driftTimer.current = undefined
          return
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
          if (!userActed(frame.current)) { reply(data.id, false, 'Only a user action inside the visual can do this.'); return }
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
          if (p.streaming || !userActed(frame.current)) return
          const now = Date.now()
          if (now - lastAction.current < 1000) return
          lastAction.current = now
          p.onExpand?.()
          return
        }
        case 'open-link': {
          if (p.streaming || !userActed(frame.current) || typeof data.url !== 'string') return
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
    const connect = (event: MessageEvent) => {
      if (dead.current || connection.current !== undefined) return
      if (!acceptConnect(event, { source: frame.current?.contentWindow, bridge })) return
      const port = event.ports[0]!
      connection.current = port
      port.onmessage = message => { if (connection.current === port) onMessage(message) }
      port.start()
    }
    window.addEventListener('message', connect)
    return () => {
      window.removeEventListener('message', connect)
      if (driftTimer.current !== undefined) window.clearTimeout(driftTimer.current)
      driftTimer.current = undefined
      connection.current?.close()
      connection.current = undefined
      ready.current = false
    }
  }, [srcDoc, src, bridge])

  // State and theme changes after load.
  useEffect(() => {
    if (ready.current) post({ type: 'state', state, response: response ?? null })
  }, [state, JSON.stringify(response ?? null)])

  useEffect(() => onTheme(next => {
    setColorScheme(next.scheme)
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

  // Embedded and embedding used schemes must agree or Chromium paints an
  // opaque default canvas even when both CSS backgrounds are transparent.
  const style = { colorScheme, ...(mode === 'inline' ? { height: `${height}px` } : {}) }
  return (
    <iframe
      ref={frame}
      className="lantern-frame"
      data-mode={mode}
      title={props.title || copy().visual}
      sandbox={scriptsOff ? 'allow-downloads' : SANDBOX}
      data-scripts={scriptsOff ? 'off' : 'on'}
      onLoad={() => {
        // A built document loads once. Another load, or a first load that
        // never confirms itself, means an html card navigated away. Drop the
        // private port and restore the card with scripts removed so the other
        // document does not stay on screen.
        loads.current++
        if (srcDoc === undefined || dead.current || scriptsOff) return
        const restore = () => {
          if (dead.current) return
          dead.current = true
          if (driftTimer.current !== undefined) window.clearTimeout(driftTimer.current)
          driftTimer.current = undefined
          ready.current = false
          connection.current?.close()
          connection.current = undefined
          const node = frame.current
          if (node) {
            node.setAttribute('sandbox', 'allow-downloads')
            node.srcdoc = srcDoc.replace(/<script\b[\s\S]*?<\/script>/gi, '')
          }
          setDrifted(true)
          latest.current.onNavigated?.()
        }
        if (loads.current >= 2) { restore(); return }
        if (kept.current) return
        const stamp = loads.current
        driftTimer.current = window.setTimeout(() => {
          driftTimer.current = undefined
          if (dead.current || kept.current || loads.current !== stamp) return
          restore()
        }, KEPT_GRACE_MS)
      }}
      allow="fullscreen; clipboard-write"
      referrerPolicy="no-referrer"
      style={style}
      {...srcDoc !== undefined ? { srcDoc } : { src, name: restoreName }}
    />
  )
}
