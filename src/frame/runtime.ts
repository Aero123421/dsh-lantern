/**
 * The script that runs first inside every visual's iframe. It defines
 * `window.lantern`, wires the kit's declarative attributes, reports the
 * content height, routes links to DSH, and connects a private message port
 * to DSH before model scripts run. The iframe has an opaque origin (sandbox without
 * allow-same-origin), so it cannot read the host DOM, cookies or storage.
 *
 * The function below is serialized with `toString()` and inlined into the
 * iframe document, so it must stay self-contained: no imports, no references
 * to anything outside its own body.
 */

/** Marker carried by every message in both directions. */
export const MESSAGE_TAG = '__lantern'
/** Temporary iframe name consumed by the trusted workspace-page prelude. */
export const RESTORE_PREFIX = 'dsh-lantern:boot:'

export type VisualState = 'idle' | 'waiting' | 'answered' | 'dismissed' | 'timeout' | 'closed'

/** Data the parent embeds in the document for the runtime to read at start. */
export interface FrameBoot {
  readonly id: string
  /** Per-document parent nonce, consumed before model scripts execute. */
  readonly bridge?: string
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
  'use strict'
  const TAG = '__lantern'
  const MAX_JSON = 64 * 1024
  const bootNode = document.getElementById('lantern-boot')
  const boot = JSON.parse((bootNode && bootNode.textContent) || '{}')
  bootNode?.remove()
  let bridge = boot.bridge
  let state = boot.state || 'idle'
  let response = boot.response
  let scheme = boot.scheme || 'light'
  let widgetState = boot.widgetState === undefined ? null : boot.widgetState
  // Workspace HTML is served without browser-local state. Its parent sets
  // a one-use browsing-context name before navigation; consume it before
  // any page script can call getState(), and do not carry it to later URLs.
  const restorePrefix = 'dsh-lantern:boot:'
  if (window.name.startsWith(restorePrefix)) {
    const raw = window.name.slice(restorePrefix.length)
    window.name = ''
    try {
      const saved = raw.length <= MAX_JSON * 3 ? JSON.parse(raw) : null
      if (saved && saved.id === boot.id) {
        bridge = saved.bridge
        if (['idle', 'waiting', 'answered', 'dismissed', 'timeout', 'closed'].includes(saved.state)) state = saved.state
        response = saved.response
        widgetState = saved.widgetState === undefined ? null : saved.widgetState
      }
    } catch { /* ignore stale or damaged restoration data */ }
  }
  let nextId = 1
  const waits: Record<number, { resolve: (v: boolean) => void, reject: (e: Error) => void }> = Object.create(null)

  // Capture native methods before model scripts can replace prototypes.
  // A parent click activates the parent, but not this opaque child; read
  // the child's native activation through a getter the page cannot replace.
  const activation = navigator.userActivation
  const activeGetter = activation && Object.getOwnPropertyDescriptor(Object.getPrototypeOf(activation), 'isActive')?.get
  const userIsActive = activeGetter?.bind(activation)
  const NativePromise = Promise
  const rejectPromise = Promise.reject.bind(Promise)
  const readMessageData = Function.prototype.call.bind(Object.getOwnPropertyDescriptor(MessageEvent.prototype, 'data')!.get!) as (event: MessageEvent) => any
  const channel = new MessageChannel()
  const sendMessage = channel.port1.postMessage.bind(channel.port1)
  const onMessage = channel.port1.addEventListener.bind(channel.port1)
  const startMessages = channel.port1.start.bind(channel.port1)
  const connect = parent.postMessage.bind(parent)
  connect({ [TAG]: 1, type: 'connect', bridge }, '*', [channel.port2])
  delete boot.bridge

  function post(message: Record<string, unknown>) {
    // Literal properties/spread define own properties without invoking a
    // setter a model script might later add to Object.prototype.
    const envelope: Record<string, unknown> = { ...message, [TAG]: 1 }
    // Keep authorization at the final send as well as the public method.
    if (envelope.type === 'submit' || envelope.type === 'send' || envelope.type === 'open-link' || envelope.type === 'expand') requireUser()
    sendMessage(envelope)
  }

  function requireUser(): void {
    if (!userIsActive?.()) throw new Error('Only a user action inside the visual can do this.')
  }

  function call(type: string, payload: Record<string, unknown>): Promise<boolean> {
    const id = nextId++
    return new NativePromise((resolve, reject) => {
      waits[id] = { resolve, reject }
      post({ type, id, ...payload })
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
    const locked = isLocked()
    document.querySelectorAll('[data-lt-choice], [data-lt-submit], form[data-lt-form] button:not([type="button"]), form[data-lt-form] input[type="submit"]').forEach((el) => {
      const button = el as HTMLButtonElement
      if (locked && !button.disabled && button.getAttribute('aria-disabled') !== 'true') {
        button.disabled = true
        button.setAttribute('data-lt-locked', '')
        button.setAttribute('aria-disabled', 'true')
      } else if (!locked && button.hasAttribute('data-lt-locked')) {
        button.disabled = false
        button.removeAttribute('data-lt-locked')
        button.removeAttribute('aria-disabled')
      }
    })
    if (state === 'answered' && response !== undefined) {
      const wanted = ([] as unknown[]).concat(response as unknown)
      document.querySelectorAll('[data-lt-choices]').forEach((group) => {
        group.querySelectorAll('[data-lt-choice]').forEach((el) => {
          const value = parseValue(el.getAttribute('data-lt-choice'))
          el.setAttribute('aria-pressed', String(wanted.some((item) => JSON.stringify(item) === JSON.stringify(value))))
        })
      })
    }
  }

  function isLocked() { return state === 'answered' || state === 'dismissed' || state === 'closed' }

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
      if (isLocked()) return rejectPromise(new Error('This visual is already settled.'))
      try { requireUser(); return call('submit', { json: toJson(value, 'submit') }) } catch (error) { return rejectPromise(error) }
    },
    send(text: string) {
      if (typeof text !== 'string' || text.trim() === '') return rejectPromise(new TypeError('lantern.send: text must be a non-empty string'))
      try { requireUser(); return call('send', { text: text.slice(0, 4000) }) } catch (error) { return rejectPromise(error) }
    },
    openLink(url: string) { if (userIsActive?.()) post({ type: 'open-link', url: String(url) }) },
    expand() { if (userIsActive?.()) post({ type: 'expand' }) },
    getState() { return widgetState as unknown },
    setState(value: unknown) {
      const json = toJson(value, 'setState')
      widgetState = value
      post({ type: 'set-state', json })
    },
    colors: readColors,
    on(name: string, handler: (detail: unknown) => void) {
      const listener = (event: Event) => handler((event as CustomEvent).detail)
      window.addEventListener('lantern:' + name, listener)
      return () => window.removeEventListener('lantern:' + name, listener)
    },
  }
  Object.defineProperty(window, 'lantern', { value: Object.freeze(lantern), configurable: false, writable: false, enumerable: true })

  onMessage('message', (event) => {
    const message = event as MessageEvent
    const data = readMessageData(message)
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
  startMessages()

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
    const lang = String(boot.lang || navigator.language || 'en').toLowerCase()
    if (lang.startsWith('ja')) return '選んでから送ってください。'
    if (lang.startsWith('zh')) return '请先选择再提交。'
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
      if (isLocked() || (choice as HTMLButtonElement).disabled || choice.getAttribute('aria-disabled') === 'true') return
      const group = choice.closest('[data-lt-choices]')
      const multi = !!group && group.hasAttribute('data-lt-multi')
      const pressed = choice.getAttribute('aria-pressed') === 'true'
      if (group && !multi) group.querySelectorAll('[data-lt-choice]').forEach((el) => el.setAttribute('aria-pressed', 'false'))
      choice.setAttribute('aria-pressed', multi ? String(!pressed) : 'true')
      if (group) { emit('select', selection(group)); const box = group.parentElement && group.parentElement.querySelector('.lt-error[data-lt-auto]'); if (box) box.textContent = '' }
      if (group && group.hasAttribute('data-lt-instant') && !multi) {
        lantern.submit(selection(group)).catch((error: Error) => showError(choice, error.message))
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
      if (href.startsWith('#')) {
        event.preventDefault()
        const dest = document.getElementById(decodeURIComponent(href.slice(1)))
        if (dest) dest.scrollIntoView({ behavior: 'smooth' })
        return
      }
      // Workspace pages (served from a real URL) navigate between their own
      // files normally; everything else leaves through DSH.
      let sameSite = false
      try { sameSite = location.protocol.startsWith('http') && new URL(anchor.href).origin === location.origin } catch { sameSite = false }
      if (sameSite) return
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
