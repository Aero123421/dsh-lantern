/**
 * The DSH Web theme as Lantern tokens. DSH keeps its palette, overrides and
 * font settings on <body> (`data-ds-dark-theme` marks dark), so the resolved
 * values are read from there and handed to every visual.
 */
import { themeCss } from '../frame/document.ts'

export interface ThemeSnapshot {
  readonly scheme: 'light' | 'dark'
  readonly css: string
}

const COLORS: ReadonlyArray<readonly [string, readonly string[]]> = [
  ['--lt-bg', ['--dsw-alias-bg-base']],
  ['--lt-surface', ['--dsw-alias-bg-layer-1']],
  ['--lt-surface-2', ['--dsw-alias-bg-layer-2']],
  ['--lt-fg', ['--dsw-alias-label-primary']],
  ['--lt-fg-2', ['--dsw-alias-label-secondary']],
  ['--lt-fg-3', ['--dsw-alias-label-tertiary']],
  ['--lt-border', ['--dsw-alias-border-l1']],
  ['--lt-border-strong', ['--dsw-alias-border-l2']],
  ['--lt-accent', ['--dsw-alias-brand-primary']],
  ['--lt-success', ['--dsw-alias-state-success-primary']],
  ['--lt-warning', ['--dsw-alias-state-warn-primary']],
  ['--lt-danger', ['--dsw-alias-state-error-primary']],
]

const SOFT: ReadonlyArray<readonly [string, string, number]> = [
  ['--lt-accent-soft', '--lt-accent', 14],
  ['--lt-success-soft', '--lt-success', 14],
  ['--lt-warning-soft', '--lt-warning', 16],
  ['--lt-danger-soft', '--lt-danger', 13],
]

function read(style: CSSStyleDeclaration, names: readonly string[]): string {
  for (const name of names) {
    const value = style.getPropertyValue(name).trim()
    if (value !== '') return value
  }
  return ''
}

let probe: HTMLSpanElement | undefined

/** Any CSS color as the browser resolves it (`rgb(…)`). */
function resolved(color: string): string {
  if (!probe) {
    probe = document.createElement('span')
    probe.style.display = 'none'
  }
  if (!probe.isConnected) document.body.appendChild(probe)
  probe.style.color = ''
  probe.style.color = color
  return getComputedStyle(probe).color
}

function sameColor(a: string, b: string): boolean {
  return a === b || resolved(a) === resolved(b)
}

/** Relative luminance (0–1) of any CSS color, resolved by the browser. */
function luminance(color: string): number {
  const match = /rgba?\(([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)/.exec(resolved(color))
  if (!match) return 0
  const [r, g, b] = [match[1], match[2], match[3]].map(value => {
    const c = Number(value) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }) as [number, number, number]
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function readTheme(): ThemeSnapshot {
  const body = document.body
  const scheme: 'light' | 'dark' = body?.hasAttribute('data-ds-dark-theme')
    || (!body && document.documentElement.style.colorScheme === 'dark') ? 'dark' : 'light'
  if (!body) return { scheme, css: '' }
  const style = getComputedStyle(body)
  const vars: Record<string, string> = {}
  for (const [token, sources] of COLORS) {
    const value = read(style, sources)
    if (value !== '') vars[token] = value
  }
  // DSH draws its light layers white on white (elevation comes from borders);
  // the kit's surfaces are fills (stats, progress tracks, code, soft cards),
  // so a layer that would vanish into the background becomes a light tint.
  const bg = vars['--lt-bg']
  const fg = vars['--lt-fg']
  if (bg !== undefined && fg !== undefined) {
    const flat = (value: string | undefined) => value === undefined || sameColor(value, bg)
    if (flat(vars['--lt-surface'])) vars['--lt-surface'] = `color-mix(in srgb, ${fg} 4%, ${bg})`
    if (flat(vars['--lt-surface-2']) || vars['--lt-surface-2'] === vars['--lt-surface']) vars['--lt-surface-2'] = `color-mix(in srgb, ${fg} 8%, ${bg})`
  }
  for (const [token, base, percent] of SOFT) {
    const value = vars[base]
    if (value !== undefined) vars[token] = `color-mix(in srgb, ${value} ${percent}%, transparent)`
  }
  const accent = vars['--lt-accent']
  if (accent !== undefined) vars['--lt-accent-fg'] = luminance(accent) > 0.55 ? '#111111' : '#ffffff'
  const text = read(style, ['--dsh-font-family-text', '--dsw-font-family'])
  if (text !== '') vars['--lt-font-sans'] = `${text}, system-ui, "Hiragino Sans", "Noto Sans JP", "Noto Sans CJK JP", sans-serif`
  const code = read(style, ['--dsh-font-family-code', '--ds-font-family-code'])
  if (code !== '') vars['--lt-font-mono'] = `${code}, ui-monospace, Menlo, Consolas, monospace`
  return { scheme, css: themeCss(vars) }
}

type Listener = (theme: ThemeSnapshot) => void

let current: ThemeSnapshot | undefined
const listeners = new Set<Listener>()
let observer: MutationObserver | undefined
let media: MediaQueryList | undefined
let queued = false

function refresh(): void {
  queued = false
  const next = readTheme()
  if (current && next.scheme === current.scheme && next.css === current.css) return
  current = next
  for (const listener of listeners) listener(next)
}

function schedule(): void {
  if (queued) return
  queued = true
  requestAnimationFrame(refresh)
}

export function theme(): ThemeSnapshot {
  if (current === undefined) current = readTheme()
  return current
}

export function onTheme(listener: Listener): () => void {
  listeners.add(listener)
  if (observer === undefined && typeof MutationObserver === 'function') {
    observer = new MutationObserver(schedule)
    if (document.body) observer.observe(document.body, { attributes: true, attributeFilter: ['data-ds-dark-theme', 'style', 'class'] })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['style', 'data-ds-theme-source', 'lang', 'class'] })
    media = window.matchMedia?.('(prefers-color-scheme: dark)')
    media?.addEventListener?.('change', schedule)
  }
  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) {
      observer?.disconnect()
      observer = undefined
      media?.removeEventListener?.('change', schedule)
      media = undefined
    }
  }
}
