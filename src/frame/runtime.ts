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

/** Messages the parent sends. */
export type ParentMessage =
  | { type: 'state'; state: VisualState; response: unknown }
  | { type: 'theme'; css: string; scheme: 'light' | 'dark' }
  | { type: 'reply'; id: number; ok: boolean; error?: string }
  | { type: 'partial'; html: string }

export function frameRuntime(): void {
  const TAG = '__lantern'
  const MAX_JSON = 64 * 1024
  const bootNode = document.getElementById('lantern-boot')
  const boot = JSON.parse((bootNode && bootNode.textContent) || '{}')
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

  const lantern = {
    get id() { return boot.id as string },
    get state() { return state as string },
    get response() { return response as unknown },
    get theme() { return scheme as string },
    get mode() { return boot.mode as string },
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

  // Height: report the document's content height whenever it changes.
  let lastHeight = -1
  let queued = false
  function measure() {
    queued = false
    const rect = document.documentElement.getBoundingClientRect()
    const height = Math.ceil(Math.max(rect.height, document.body ? document.body.scrollHeight : 0))
    if (Math.abs(height - lastHeight) < 2) return
    lastHeight = height
    post({ type: 'resize', height })
  }
  function schedule() { if (!queued) { queued = true; requestAnimationFrame(measure) } }

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
    if (state === 'answered' && response !== undefined) {
      document.querySelectorAll('[data-lt-choices]').forEach((group) => {
        const wanted = ([] as unknown[]).concat(response as unknown)
        group.querySelectorAll('[data-lt-choice]').forEach((el) => {
          const value = parseValue(el.getAttribute('data-lt-choice'))
          if (wanted.some((w) => JSON.stringify(w) === JSON.stringify(value))) el.setAttribute('aria-pressed', 'true')
        })
      })
    }
    if (typeof ResizeObserver === 'function') {
      const observer = new ResizeObserver(schedule)
      observer.observe(document.documentElement)
      if (document.body) observer.observe(document.body)
    }
    window.addEventListener('load', schedule)
    schedule()
    post({ type: 'ready' })
  }

  let errors = 0
  window.addEventListener('error', (event) => {
    if (errors++ < 3) post({ type: 'error', message: String(event.message || 'Script error') })
  })
  window.addEventListener('unhandledrejection', (event) => {
    if (errors++ < 3) post({ type: 'error', message: String((event.reason && event.reason.message) || event.reason || 'Unhandled rejection') })
  })

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init)
  else init()
}
