/**
 * Builds the iframe document for an `html` visual: the runtime first, then
 * the kit and the DSH theme in cascade layers (so anything the visual writes
 * itself wins), then the model's markup.
 */
import kitCss from './kit.css'
import { frameRuntime, type FrameBoot } from './runtime.ts'

const LAYERS = '@layer lantern-kit, lantern-theme;'
/** The token half of the kit (everything before the element styles). */
const TOKENS = kitCss.slice(0, Math.max(0, kitCss.indexOf('/* Base */')))
const BASE = 'body{padding:var(--lt-pad,16px)}'

/** JSON safe to place inside a <script> element. */
export function scriptJson(value: unknown): string {
  return JSON.stringify(value === undefined ? null : value)
    .replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029')
}

/** The theme layer as CSS text from a map of `--lt-*` values. */
export function themeCss(vars: Readonly<Record<string, string>>): string {
  const body = Object.entries(vars)
    .filter(([name, value]) => /^--lt-[a-z0-9-]+$/.test(name) && value !== '' && !/[;{}<]/.test(value))
    .map(([name, value]) => `${name}:${value}`).join(';')
  return body === '' ? '' : `@layer lantern-theme{:root{${body}}}`
}

const RUNTIME_SOURCE = `(${frameRuntime.toString()})();`

/** The examples use npm packages on jsDelivr, including three.js modules. */
const LIBRARY_CDN = 'https://cdn.jsdelivr.net/npm/'

/**
 * Restrict subresource requests, not arbitrary JavaScript. Allowed CDNs
 * still receive requests, and CSP does not block a frame navigating itself.
 * Workspace documents additionally need their own origin for relative files.
 */
function contentPolicy(workspace: boolean, nonce?: string): string {
  const local = workspace ? "'self' " : ''
  const scripts = nonce ? `'nonce-${nonce}'` : `${local}'unsafe-inline' ${LIBRARY_CDN}`
  return [
    "default-src 'none'",
    `script-src ${scripts}`,
    `style-src ${local}'unsafe-inline' ${LIBRARY_CDN} https://fonts.googleapis.com`,
    `font-src ${local}data: blob: ${LIBRARY_CDN} https://fonts.gstatic.com`,
    `img-src ${local}data: blob:`,
    `media-src ${local}data: blob:`,
    `connect-src ${local}data: blob:`,
    "frame-src 'none'",
    "object-src 'none'",
    "worker-src 'none'",
    "form-action 'none'",
    "base-uri 'none'",
  ].join('; ')
}

export const VISUAL_CSP = contentPolicy(false)

function head(boot: FrameBoot, theme: string): string {
  // A preview needs our runtime, but must never execute model markup. A
  // fresh nonce also blocks encoded javascript: URLs and event handlers
  // that cannot be safely removed by the best-effort markup filter alone.
  const nonce = boot.streaming
    ? Array.from(crypto.getRandomValues(new Uint8Array(16)), value => value.toString(16).padStart(2, '0')).join('')
    : undefined
  const policy = nonce ? contentPolicy(false, nonce) : VISUAL_CSP
  return `<meta http-equiv="Content-Security-Policy" content="${policy}">`
    + '<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
    + '<meta name="referrer" content="no-referrer">'
    + `<script type="application/json" id="lantern-boot">${scriptJson(boot)}</script>`
    + `<script${nonce ? ` nonce="${nonce}"` : ''}>${RUNTIME_SOURCE.replace(/<\/script/gi, '<\\/script')}</script>`
    + `<style id="lantern-kit">${LAYERS}@layer lantern-kit{${kitCss}${BASE}}</style>`
    + `<style id="lantern-theme">${theme}</style>`
}

/**
 * Prelude for a workspace HTML file served from disk: the runtime and the
 * theme tokens. The kit's element styles are added only when the page asks
 * for them with `<meta name="lantern-kit">`, so existing pages keep their look.
 */
export function filePrelude(boot: FrameBoot, withKit: boolean): string {
  return `<meta http-equiv="Content-Security-Policy" content="${contentPolicy(true)}">`
    + '<meta charset="utf-8"><meta name="referrer" content="no-referrer">'
    + `<script type="application/json" id="lantern-boot">${scriptJson(boot)}</script>`
    + `<script>${RUNTIME_SOURCE.replace(/<\/script/gi, '<\\/script')}</script>`
    + `<style id="lantern-kit">${LAYERS}@layer lantern-kit{${withKit ? kitCss + BASE : TOKENS}}</style>`
    + '<style id="lantern-theme"></style>'
}

/**
 * Start with a trusted head before parsing any supplied markup. Searching
 * for a head tag is unsafe: a script can precede it, or a matching tag can
 * be inside raw text, a template, or an attribute. HTML parsing merges later
 * html attributes and head metadata into this document; a later doctype is
 * ignored. The fixed doctype also keeps fragments in standards mode.
 */
export function injectPrelude(html: string, prelude: string): string {
  return `<!doctype html><head>${prelude}</head>${html.replace(/^\uFEFF/, '')}`
}

const FULL_DOCUMENT =/^\s*(?:<!--[\s\S]*?-->\s*)*(?:<!doctype[^>]*>|<html[\s>])/i

/**
 * @param html - the model's markup: a fragment or a complete document.
 * @param boot - state handed to the runtime.
 * @param theme - CSS from {@link themeCss}.
 */
export function buildDocument(html: string, boot: FrameBoot, theme: string): string {
  const prelude = head(boot, theme)
  const scheme = boot.scheme === 'dark' ? 'dark' : 'light'
  if (boot.streaming) {
    return `<!doctype html><html data-theme="${scheme}"><head>${prelude}</head><body><div id="lantern-stream"></div></body></html>`
  }
  if (FULL_DOCUMENT.test(html)) return injectPrelude(html, prelude)
  return `<!doctype html><html data-theme="${scheme}"><head>${prelude}</head><body>${html}</body></html>`
}

/**
 * Markup that can be shown while the html argument is still streaming:
 * complete tags only, with nothing that can run: no scripts, event handler
 * attributes, `javascript:` URLs, embedded frames or meta refreshes.
 */
export function partialMarkup(html: string): string {
  let text = html
  const lastOpen = text.lastIndexOf('<')
  if (lastOpen > text.lastIndexOf('>')) text = text.slice(0, lastOpen)
  text = text
    .replace(/<script[\s\S]*?(<\/script>|$)/gi, '')
    .replace(/<\/?(?:iframe|object|embed|frame|frameset|meta|base|link|portal)\b[^>]*>/gi, '')
    .replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/(href|src|action|formaction|xlink:href)\s*=\s*("\s*javascript:[^"]*"|'\s*javascript:[^']*'|javascript:[^\s>]+)/gi, '$1=""')
  const bodyOpen = /<body[^>]*>/i.exec(text)
  if (bodyOpen) {
    const styles = (text.slice(0, bodyOpen.index).match(/<style[\s\S]*?<\/style>/gi) ?? []).join('')
    text = styles + text.slice(bodyOpen.index + bodyOpen[0].length)
  }
  else if (FULL_DOCUMENT.test(text)) {
    const styles = text.match(/<style[\s\S]*?<\/style>/gi) ?? []
    return styles.join('')
  }
  return text
}
