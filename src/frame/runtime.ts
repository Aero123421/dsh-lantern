/**
 * The script that runs first inside every visual's iframe. It defines
 * `window.lantern`, wires the kit's declarative attributes, reports the
 * content height, routes links to DSH, and talks to DSH only through
 * `parent.postMessage`. The iframe has an opaque origin (sandbox without
 * allow-same-origin), so this channel is the only thing it can reach.
 *
 * The function below is serialized with `toString()` and inlined into the
 * iframe document, so it must stay self-contained: no imports, no references
 * to anything outside its own body.
 */

/** Marker carried by every message in both directions. */
export const MESSAGE_TAG = '__lantern'

export type VisualState = 'idle' | 'waiting' | 'answered' | 'dismissed' | 'timeout' | 'closed'

/** Data the parent embeds in the document for the runtime to read at start. */
export interface FrameBoot {
  readonly id: string
  readonly state: VisualState
  readonly response: unknown
  readonly scheme: 'light' | 'dark'
  readonly mode: 'inline' | 'panel'
  readonly widgetState: unknown
  /** Streaming preview: the parent sends partial markup; no model script runs. */
  readonly streaming: boolean
  /** UI language for the few built-in messages (BCP 47). */
  readonly lang?: string
  /** Tallest inline card in px; taller content scrolls inside the card. */
  readonly maxHeight?: number
}

/** Messages the iframe sends. */
export type FrameMessage =
  | { type: 'ready' }
  | { type: 'resize'; height: number }
  | { type: 'submit'; id: number; json: string }
  | { type: 'send'; id: number; text: string }
  | { type: 'expand' }
  | { type: 'open-link'; url: string }
  | { type: 'set-state'; json: string }
  | { type: 'error'; message: string }
  /** A wheel turn was kept from the visual's own handlers so the chat could scroll. */
  | { type: 'hint'; kind: 'wheel' }
  /** The browser took a WebGL context away (too many live contexts on the page), or gave it back. */
  | { type: 'gl'; lost: boolean }

/** Messages the parent sends. */
export type ParentMessage =
  | { type: 'state'; state: VisualState; response: unknown }
  | { type: 'theme'; css: string; scheme: 'light' | 'dark' }
  | { type: 'reply'; id: number; ok: boolean; error?: string }
  | { type: 'partial'; html: string }

export function frameRuntime(): void {
  const TAG = '__lantern'
  const MAX_JSON = 64 * 1024
  // Taken before any visual script runs. Later replacements of `URL` or
  // `String.prototype` must not be able to change this decision.
  const startsWith = Function.prototype.call.bind(String.prototype.startsWith) as (value: string, search: string) => boolean
  const SafeURL = URL
  const bootNode = document.getElementById('lantern-boot')
  const boot = JSON.parse((bootNode && bootNode.textContent) || '{}')
  // Chrome does not ship CSP `navigate-to`, and `window.location` cannot be
  // replaced. Give caged scripts (see cageScripts) a stand-in that only
  // follows links inside a workspace page's own folder. The check uses the
  // captured `URL` and `startsWith` above, and nothing else.
  const realLocation = location
  const realDocument = document
  function allowedTarget(url: unknown): string | undefined {
    if (typeof url !== 'string') return undefined
    if (realLocation.protocol !== 'http:' && realLocation.protocol !== 'https:') return undefined
    try {
      const next = new SafeURL(url, realLocation.href)
      if (next.protocol !== 'http:' && next.protocol !== 'https:') return undefined
      const dir = new SafeURL('./', realLocation.href).href
      return startsWith(next.href, dir) ? next.href : undefined
    } catch { return undefined }
  }
  const realAssign = realLocation.assign.bind(realLocation)
  const realReplace = realLocation.replace.bind(realLocation)
  const ltLoc = {
    assign(url: string) { const next = allowedTarget(url); if (next !== undefined) realAssign(next) },
    replace(url: string) { const next = allowedTarget(url); if (next !== undefined) realReplace(next) },
    reload() {},
    toString() { return realLocation.href },
    valueOf() { return realLocation.href },
  }
  for (const key of ['href', 'origin', 'protocol', 'host', 'hostname', 'port', 'pathname', 'search', 'hash']) {
    Object.defineProperty(ltLoc, key, {
      configurable: true, enumerable: true,
      get() { return (realLocation as unknown as Record<string, string>)[key] },
      set(value: string) { const next = allowedTarget(value); if (key === 'href' && next !== undefined) realAssign(next) },
    })
  }
  const ltWin: typeof window = new Proxy(window, {
    get(target, key) {
      if (key === 'location') return ltLoc
      if (key === 'document') return ltDoc
      if (key === 'top' || key === 'parent' || key === 'self' || key === 'frames' || key === 'globalThis') return ltWin
      const value = (target as unknown as Record<PropertyKey, unknown>)[key]
      return typeof value === 'function' ? (value as (...args: unknown[]) => unknown).bind(target) : value
    },
    set(target, key, value) {
      if (key === 'location') { const next = allowedTarget(value); if (next !== undefined) realAssign(next); return true }
      ;(target as unknown as Record<PropertyKey, unknown>)[key] = value
      return true
    },
  })
  function cageInline(html: string): string {
    return String(html).replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi, (full, attrs: string, body: string) => {
      if (/\bsrc\s*=/i.test(attrs) || /\btype\s*=\s*["']?module/i.test(attrs)) return full
      const wrapped = `(function(__ltLoc,__ltWin,__ltDoc){const location=__ltLoc,window=__ltWin,top=window,parent=window,self=window,globalThis=window,frames=window,document=__ltDoc;\n${body}\n}).call(globalThis.__ltWin,globalThis.__ltLoc,globalThis.__ltWin,globalThis.__ltDoc)`
      return `<script${attrs}>${wrapped}</script>`
    })
  }
  const ltDoc: Document = new Proxy(realDocument, {
    get(target, key) {
      if (key === 'location') return ltLoc
      if (key === 'defaultView') return ltWin
      const value = (target as unknown as Record<PropertyKey, unknown>)[key]
      if ((key === 'write' || key === 'writeln') && typeof value === 'function') {
        const write = value as (html: string) => void
        return (html: string) => write.call(target, cageInline(html))
      }
      return typeof value === 'function' ? (value as (...args: unknown[]) => unknown).bind(target) : value
    },
    set(target, key, value) {
      if (key === 'location') { const next = allowedTarget(value); if (next !== undefined) realAssign(next); return true }
      ;(target as unknown as Record<PropertyKey, unknown>)[key] = value
      return true
    },
  })
  ;(window as unknown as Record<string, unknown>).__ltLoc = ltLoc
  ;(window as unknown as Record<string, unknown>).__ltWin = ltWin
  ;(window as unknown as Record<string, unknown>).__ltDoc = ltDoc
  try {
    const owner = Object.getOwnPropertyDescriptor(Node.prototype, 'ownerDocument')
    if (owner && owner.configurable) Object.defineProperty(Node.prototype, 'ownerDocument', { configurable: true, get() { return ltDoc } })
  } catch { /* ignore */ }
  try {
    const view = Object.getOwnPropertyDescriptor(Document.prototype, 'defaultView')
    if (view && view.configurable) Object.defineProperty(Document.prototype, 'defaultView', { configurable: true, get() { return ltWin } })
  } catch { /* ignore */ }
  // Script-driven navigations (location, meta refresh where the browser
  // routes them here) may stay inside a workspace page's own folder.
  // Anything else — another host, or the rest of DSH — is cancelled.
  try {
    const nav = (window as unknown as { navigation?: { addEventListener: (type: string, listener: (event: { destination?: { url?: string }; cancelable?: boolean; preventDefault: () => undefined }) => undefined) => undefined } }).navigation
    if (nav && typeof nav.addEventListener === 'function') {
      nav.addEventListener('navigate', (event) => {
        const raw = event.destination && event.destination.url
        if (allowedTarget(raw) === undefined && event.cancelable) event.preventDefault()
      })
    }
  } catch { /* Navigation API missing */ }
  let state = boot.state || 'idle'
  let response = boot.response
  let scheme = boot.scheme || 'light'
  let widgetState = boot.widgetState === undefined ? null : boot.widgetState
  let nextId = 1
  const waits: Record<number, { resolve: (v: boolean) => void, reject: (e: Error) => void }> = {}

  function post(message: Record<string, unknown>) {
    message[TAG] = 1
    parent.postMessage(message, '*')
  }

  function call(type: string, payload: Record<string, unknown>): Promise<boolean> {
    const id = nextId++
    return new Promise((resolve, reject) => {
      waits[id] = { resolve, reject }
      const message: Record<string, unknown> = { type, id }
      for (const key of Object.keys(payload)) message[key] = payload[key]
      post(message)
    })
  }

  function toJson(value: unknown, what: string): string {
    let json: string | undefined
    try { json = JSON.stringify(value === undefined ? null : value) } catch { json = undefined }
    if (typeof json !== 'string') throw new TypeError('lantern.' + what + ': value is not JSON-serializable')
    if (json.length > MAX_JSON) throw new RangeError('lantern.' + what + ': value is larger than 64 KB')
    return json
  }

  function emit(name: string, detail: unknown) {
    window.dispatchEvent(new CustomEvent('lantern:' + name, { detail }))
  }

  function applyState() {
    document.documentElement.setAttribute('data-lt-state', state)
    // A visual that timed out still accepts a late answer (it reaches the
    // agent as a user message), so only settled answers lock the buttons.
    const locked = state === 'answered' || state === 'dismissed' || state === 'closed'
    document.querySelectorAll('[data-lt-submit], form[data-lt-form] button:not([type="button"]), form[data-lt-form] input[type="submit"]').forEach((el) => {
      const button = el as HTMLButtonElement
      if (locked) { button.disabled = true; button.setAttribute('data-lt-locked', '') }
      else if (button.hasAttribute('data-lt-locked')) { button.disabled = false; button.removeAttribute('data-lt-locked') }
    })
  }

  function readColors(): string[] {
    const style = getComputedStyle(document.documentElement)
    const out: string[] = []
    for (let i = 1; i <= 8; i++) out.push(style.getPropertyValue('--lt-series-' + i).trim())
    return out
  }

  let visible = true

  const lantern = {
    get id() { return boot.id as string },
    get state() { return state as string },
    get response() { return response as unknown },
    get theme() { return scheme as string },
    get mode() { return boot.mode as string },
    get visible() { return visible },
    submit(value: unknown) {
      try { return call('submit', { json: toJson(value, 'submit') }) } catch (error) { return Promise.reject(error) }
    },
    send(text: string) {
      if (typeof text !== 'string' || text.trim() === '') return Promise.reject(new TypeError('lantern.send: text must be a non-empty string'))
      return call('send', { text: text.slice(0, 4000) })
    },
    openLink(url: string) { post({ type: 'open-link', url: String(url) }) },
    expand() { post({ type: 'expand' }) },
    getState() { return widgetState as unknown },
    setState(value: unknown) {
      widgetState = value
      post({ type: 'set-state', json: toJson(value, 'setState') })
    },
    colors: readColors,
    on(name: string, handler: (detail: unknown) => void) {
      const listener = (event: Event) => handler((event as CustomEvent).detail)
      window.addEventListener('lantern:' + name, listener)
      return () => window.removeEventListener('lantern:' + name, listener)
    },
  }
  Object.defineProperty(window, 'lantern', { value: Object.freeze(lantern), configurable: false, writable: false, enumerable: true })

  window.addEventListener('message', (event) => {
    if (event.source !== parent) return
    const data = event.data
    if (!data || data[TAG] !== 1) return
    if (data.type === 'reply') {
      const wait = waits[data.id]
      if (!wait) return
      delete waits[data.id]
      if (data.ok) wait.resolve(true)
      else wait.reject(new Error(data.error || 'lantern: request failed'))
    } else if (data.type === 'state') {
      state = data.state
      response = data.response
      applyState()
      emit('state', { state, response })
    } else if (data.type === 'theme') {
      scheme = data.scheme
      document.documentElement.setAttribute('data-theme', scheme)
      const style = document.getElementById('lantern-theme')
      if (style) style.textContent = data.css
      emit('theme', { scheme })
    } else if (data.type === 'partial' && boot.streaming) {
      const root = document.getElementById('lantern-stream')
      if (root) root.innerHTML = data.html
    }
  })

  // Height: report the document's content height whenever it changes. An
  // inline card is as tall as its content, which sets two traps. A classic
  // scrollbar inside the frame (while the card catches up) narrows the page,
  // and anything sized by width then changes height again; the kit hides the
  // frame's own vertical scrollbar unless the content is taller than the
  // largest card (`data-lt-overflow`). And a page whose height follows the
  // frame's height (100vh, innerHeight, height:100%) would grow the card
  // forever, or stay as small as the frame happened to be; such a page gets a
  // fixed inline viewport instead (`pinned`).
  const root = document.documentElement
  const inline = boot.mode !== 'panel' && !boot.streaming
  const maxHeight = Number(boot.maxHeight) > 0 ? Number(boot.maxHeight) : 2400
  root.setAttribute('data-lt-mode', boot.mode === 'panel' ? 'panel' : 'inline')
  let reported = -1
  let queued = false
  let seenHeight = -1
  let seenViewport = -1
  let follows = 0
  let probing = false
  let pinned = 0
  let started = false
  function contentHeight(): number {
    const rect = root.getBoundingClientRect()
    return Math.ceil(Math.max(rect.height, document.body ? document.body.scrollHeight : 0))
  }
  function measure() {
    queued = false
    // A fullscreen visual fills the screen; its card keeps its size meanwhile.
    if (document.fullscreenElement) return
    const content = contentHeight()
    const viewport = window.innerHeight
    if (inline && !pinned && seenViewport > 0 && viewport !== seenViewport) {
      const followed = content >= viewport - 1 && Math.abs((content - seenHeight) - (viewport - seenViewport)) <= 1
      follows = followed ? follows + 1 : 0
      if (followed && (probing || follows >= 3)) pinned = Math.round(Math.min(540, Math.max(320, window.innerWidth * 0.62)))
      probing = false
    }
    seenHeight = content
    seenViewport = viewport
    const height = pinned || content
    // Until the page has run its scripts, only grow: it is not its real height yet.
    if (!pinned && !started && height <= viewport) return
    root.toggleAttribute('data-lt-overflow', boot.mode !== 'panel' && height > maxHeight)
    if (Math.abs(height - reported) < 2) return
    reported = height
    post({ type: 'resize', height })
  }
  function schedule() { if (!queued) { queued = true; requestAnimationFrame(measure) } }
  /**
   * Content exactly as tall as the frame may be sized by the frame itself
   * (an element of 100vh). Nudge the card 2 px taller once: if the content
   * grows with it, `measure` pins the card; if not, the card shrinks back.
   */
  function probe() {
    if (!inline || pinned || probing || document.fullscreenElement || !document.body) return
    const viewport = window.innerHeight
    if (Math.abs(contentHeight() - viewport) > 1) return
    const sized = Array.from(document.body.children).some((el) => Math.abs((el as HTMLElement).offsetHeight - viewport) <= 1)
    if (!sized) return
    probing = true
    reported = viewport + 2
    post({ type: 'resize', height: reported })
    setTimeout(() => { probing = false }, 1000)
  }
  if (typeof ResizeObserver === 'function') new ResizeObserver(schedule).observe(root)
  window.addEventListener('resize', schedule)
  window.addEventListener('load', () => { schedule(); setTimeout(probe, 300); setTimeout(probe, 1500) })
  document.addEventListener('fullscreenchange', () => { follows = 0; seenViewport = -1; schedule() })

  // Visibility: on screen (not scrolled away, not in a folded card) and in a
  // visible tab. Animation loops and timers can pause otherwise.
  let onScreen = true
  function updateVisible() {
    const next = onScreen && document.visibilityState !== 'hidden'
    if (next === visible) return
    visible = next
    emit('visibility', visible)
  }
  if (typeof IntersectionObserver === 'function') {
    new IntersectionObserver((entries) => {
      const last = entries[entries.length - 1]
      if (last) { onScreen = last.isIntersecting; updateVisible() }
    }).observe(root)
  }
  document.addEventListener('visibilitychange', updateVisible)

  // Wheel: an inline visual sits in a scrolling chat, and one that zooms on
  // the wheel (3D, maps, charts) would trap the page's scrolling. Its own
  // wheel handlers run only after the user clicks into it (until the pointer
  // leaves it) or with Ctrl/⌘ held (pinch zoom); otherwise the chat scrolls
  // and the card shows a short hint.
  if (inline) {
    const addListener = EventTarget.prototype.addEventListener
    const wheelTargets = new WeakSet<object>()
    EventTarget.prototype.addEventListener = function (this: EventTarget, type: string, listener: EventListenerOrEventListenerObject | null, options?: boolean | AddEventListenerOptions) {
      if (type === 'wheel' || type === 'mousewheel' || type === 'DOMMouseScroll') wheelTargets.add(this)
      return addListener.call(this, type, listener, options)
    }
    let engaged = false
    let lastHint = 0
    addListener.call(window, 'pointerdown', () => { engaged = true }, true)
    addListener.call(window, 'blur', () => { engaged = false })
    addListener.call(document, 'mouseout', (event) => { if (!(event as MouseEvent).relatedTarget) engaged = false }, true)
    addListener.call(window, 'wheel', (event) => {
      const wheel = event as WheelEvent
      if (engaged || wheel.ctrlKey || wheel.metaKey || document.fullscreenElement) return
      const handled = wheel.composedPath().some((node) => wheelTargets.has(node) || typeof (node as { onwheel?: unknown }).onwheel === 'function')
      if (!handled) return
      wheel.stopImmediatePropagation()
      const now = Date.now()
      if (now - lastHint > 2500) { lastHint = now; post({ type: 'hint', kind: 'wheel' }) }
    }, { capture: true, passive: true })
  }

  // WebGL: a page keeps about 16 live contexts and the browser drops the
  // oldest; the card then offers to restart the visual.
  window.addEventListener('webglcontextlost', (event) => { if ((event.target as Node).isConnected) post({ type: 'gl', lost: true }) }, true)
  window.addEventListener('webglcontextrestored', () => post({ type: 'gl', lost: false }), true)

  // Declarative helpers for the kit.
  function parseValue(raw: string | null): unknown {
    if (raw === null || raw === '') return null
    try { return JSON.parse(raw) } catch { return raw }
  }
  function formValue(form: HTMLFormElement): Record<string, unknown> {
    const out: Record<string, unknown> = {}
    new FormData(form).forEach((value, key) => {
      const text = typeof value === 'string' ? value : value.name
      if (key in out) out[key] = ([] as unknown[]).concat(out[key], text)
      else out[key] = text
    })
    form.querySelectorAll('input[type="checkbox"][name]').forEach((box) => {
      const input = box as HTMLInputElement
      if (!(input.name in out) && !form.querySelector('input[type="checkbox"][name="' + input.name + '"][value]:not([value="on"])')) out[input.name] = false
      else if (out[input.name] === 'on') out[input.name] = true
    })
    return out
  }
  function selection(group: Element): unknown {
    const picked: unknown[] = []
    group.querySelectorAll('[data-lt-choice]').forEach((el) => {
      if (el.getAttribute('aria-pressed') === 'true') picked.push(parseValue(el.getAttribute('data-lt-choice')))
    })
    return group.hasAttribute('data-lt-multi') ? picked : (picked.length ? picked[0] : null)
  }
  function scopeValue(button: Element): unknown {
    const form = button.closest('form')
    if (form) return formValue(form)
    let scope: Element | null = button.parentElement
    while (scope && scope !== document.body) {
      const group = scope.querySelector('[data-lt-choices]')
      if (group) return selection(group)
      scope = scope.parentElement
    }
    const any = document.querySelector('[data-lt-choices]')
    return any ? selection(any) : null
  }
  function showError(near: Element, message: string) {
    let box = near.parentElement && near.parentElement.querySelector('.lt-error[data-lt-auto]')
    if (!box && near.parentElement) {
      box = document.createElement('div')
      box.className = 'lt-error'
      box.setAttribute('data-lt-auto', '')
      near.parentElement.appendChild(box)
    }
    if (box) box.textContent = message
  }
  function emptyText() {
    const lang = String(boot.lang || 'en').toLowerCase()
    if (startsWith(lang, 'ja')) return '選んでから送ってください。'
    if (startsWith(lang, 'zh')) return '请先选择再提交。'
    return 'Pick an option first.'
  }
  function isEmpty(value: unknown) {
    return value === null || value === '' || (Array.isArray(value) && value.length === 0)
  }

  document.addEventListener('click', (event) => {
    const target = event.target as Element | null
    if (!target || !target.closest) return
    const choice = target.closest('[data-lt-choice]')
    if (choice) {
      const group = choice.closest('[data-lt-choices]')
      const multi = !!group && group.hasAttribute('data-lt-multi')
      const pressed = choice.getAttribute('aria-pressed') === 'true'
      if (group && !multi) group.querySelectorAll('[data-lt-choice]').forEach((el) => el.setAttribute('aria-pressed', 'false'))
      choice.setAttribute('aria-pressed', multi ? String(!pressed) : 'true')
      if (group) { emit('select', selection(group)); const box = group.parentElement && group.parentElement.querySelector('.lt-error[data-lt-auto]'); if (box) box.textContent = '' }
      if (group && group.hasAttribute('data-lt-instant') && !multi) {
        lantern.submit(selection(group)).catch(() => undefined)
      }
      return
    }
    const submit = target.closest('[data-lt-submit]')
    if (submit && !(submit as HTMLButtonElement).disabled) {
      event.preventDefault()
      const raw = submit.getAttribute('data-lt-submit')
      const value = raw ? parseValue(raw) : scopeValue(submit)
      if (!raw && isEmpty(value)) { showError(submit, submit.getAttribute('data-lt-empty') || emptyText()); return }
      showError(submit, '')
      lantern.submit(value).catch((error: Error) => showError(submit, error.message))
      return
    }
    const send = target.closest('[data-lt-send]')
    if (send) { event.preventDefault(); lantern.send(send.getAttribute('data-lt-send') || '').catch(() => undefined); return }
    const expand = target.closest('[data-lt-expand]')
    if (expand) { event.preventDefault(); lantern.expand(); return }
    const full = target.closest('[data-lt-fullscreen]')
    if (full) {
      event.preventDefault()
      const request = document.fullscreenElement ? document.exitFullscreen() : root.requestFullscreen()
      request.catch(() => undefined)
      return
    }
    const tab = target.closest('[role="tablist"] > [data-tab]')
    if (tab) {
      const tabs = tab.closest('[data-lt-tabs]')
      if (tabs) {
        const name = tab.getAttribute('data-tab')
        tabs.querySelectorAll('[role="tablist"] > [data-tab]').forEach((el) => el.setAttribute('aria-selected', String(el === tab)))
        tabs.querySelectorAll('[data-tab-panel]').forEach((el) => {
          if (el.getAttribute('data-tab-panel') === name) el.removeAttribute('data-lt-hidden')
          else el.setAttribute('data-lt-hidden', '')
        })
      }
      return
    }
    const move = target.closest('[data-lt-next],[data-lt-prev]')
    if (move) {
      const steps = move.closest('[data-lt-steps]')
      if (steps) stepTo(steps, Number(steps.getAttribute('data-index') || 0) + (move.hasAttribute('data-lt-next') ? 1 : -1))
      return
    }
    const anchor = target.closest('a[href]') as HTMLAnchorElement | null
    if (anchor && !event.defaultPrevented) {
      const href = anchor.getAttribute('href') || ''
      // A download link (say, a PNG made from a canvas as a blob: URL) saves a
      // file and does not navigate; the sandbox allows downloads.
      if (anchor.hasAttribute('download') && /^(blob|data):/i.test(anchor.href)) return
      if (startsWith(href, '#')) {
        event.preventDefault()
        const dest = document.getElementById(decodeURIComponent(href.slice(1)))
        if (dest) dest.scrollIntoView({ behavior: 'smooth' })
        return
      }
      // Workspace pages navigate between files in their own folder.
      // Same host is not enough: the rest of DSH must not be reachable.
      if (allowedTarget(anchor.href) !== undefined) return
      event.preventDefault()
      if (/^https?:\/\//i.test(anchor.href)) lantern.openLink(anchor.href)
    }
  }, false)

  document.addEventListener('submit', (event) => {
    const form = event.target as HTMLFormElement
    if (!form || !form.hasAttribute('data-lt-form')) return
    event.preventDefault()
    if (!form.checkValidity()) { form.reportValidity(); return }
    lantern.submit(formValue(form)).catch((error: Error) => showError(form.lastElementChild || form, error.message))
  })

  function stepTo(steps: Element, index: number) {
    const panes = steps.querySelectorAll('[data-step]')
    if (panes.length === 0) return
    const clamped = (index + panes.length) % panes.length
    steps.setAttribute('data-index', String(clamped))
    panes.forEach((el, i) => { if (i === clamped) el.removeAttribute('data-lt-hidden'); else el.setAttribute('data-lt-hidden', '') })
    const dots = steps.querySelector('[data-lt-dots]')
    if (dots) dots.innerHTML = Array.from(panes).map((_, i) => '<i class="' + (i === clamped ? 'on' : '') + '"></i>').join('')
    emit('step', clamped)
  }

  function init() {
    document.documentElement.setAttribute('data-theme', scheme)
    applyState()
    document.querySelectorAll('[data-lt-tabs]').forEach((tabs) => {
      const first = tabs.querySelector('[role="tablist"] > [data-tab][aria-selected="true"]') || tabs.querySelector('[role="tablist"] > [data-tab]')
      if (first) (first as HTMLElement).click()
    })
    document.querySelectorAll('[data-lt-steps]').forEach((steps) => stepTo(steps, 0))
    if (state === 'answered' && response !== undefined) {
      document.querySelectorAll('[data-lt-choices]').forEach((group) => {
        const wanted = ([] as unknown[]).concat(response as unknown)
        group.querySelectorAll('[data-lt-choice]').forEach((el) => {
          const value = parseValue(el.getAttribute('data-lt-choice'))
          if (wanted.some((w) => JSON.stringify(w) === JSON.stringify(value))) el.setAttribute('aria-pressed', 'true')
        })
      })
    }
    if (typeof ResizeObserver === 'function' && document.body) new ResizeObserver(schedule).observe(document.body)
    started = true
    schedule()
    post({ type: 'ready' })
  }

  let errors = 0
  window.addEventListener('error', (event) => {
    // Chrome reports a ResizeObserver callback that resized what it observes as an
    // error event; the notifications are only deferred to the next frame, nothing failed.
    if (/^ResizeObserver loop/.test(String(event.message))) return
    if (errors++ < 3) post({ type: 'error', message: String(event.message || 'Script error') })
  })
  window.addEventListener('unhandledrejection', (event) => {
    if (errors++ < 3) post({ type: 'error', message: String((event.reason && event.reason.message) || event.reason || 'Unhandled rejection') })
  })

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init)
  else init()
}
