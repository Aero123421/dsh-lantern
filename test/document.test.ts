import test from 'node:test'
import assert from 'node:assert/strict'
import { buildDocument, filePrelude, injectPrelude, partialMarkup, scriptJson, themeCss } from '../src/frame/document.ts'
import type { FrameBoot } from '../src/frame/runtime.ts'

const boot: FrameBoot = { id: 'c1', state: 'idle', response: null, scheme: 'dark', mode: 'inline', widgetState: null, streaming: false, lang: 'ja' }

function policyDirectives(html: string): Map<string, string> {
  const match = /<meta http-equiv="Content-Security-Policy" content="([^"]+)"/.exec(html)
  assert.ok(match, 'a CSP must precede the supplied document')
  const directives = match[1]!.split('; ').map(part => {
    const space = part.indexOf(' ')
    return [part.slice(0, space), part.slice(space + 1)] as const
  })
  const result = new Map(directives)
  assert.equal(result.size, directives.length, 'duplicate directives silently ignore later restrictions')
  return result
}

test('scriptJson cannot close the script element', () => {
  const text = scriptJson({ html: '</script><script>alert(1)</script>', line: ' ' })
  assert.equal(text.includes('</script'), false)
  assert.equal(text.includes('<'), false)
  assert.deepEqual(JSON.parse(text), { html: '</script><script>alert(1)</script>', line: ' ' })
})

test('themeCss keeps only --lt-* names and safe values', () => {
  const css = themeCss({ '--lt-bg': '#fff', '--lt-fg': 'red;} body{display:none', 'color': 'blue', '--lt-accent': 'color-mix(in srgb, #000 10%, transparent)', '--lt-x': '<x>' })
  assert.equal(css, '@layer lantern-theme{:root{--lt-bg:#fff;--lt-accent:color-mix(in srgb, #000 10%, transparent)}}')
  assert.equal(themeCss({}), '')
})

test('a fragment is wrapped with the runtime, the kit layers and the theme', () => {
  const html = buildDocument('<p>hi</p>', boot, themeCss({ '--lt-bg': '#000' }))
  assert.match(html, /^<!doctype html><html data-theme="dark"><head><meta http-equiv="Content-Security-Policy"/)
  assert.match(html, /@layer lantern-kit, lantern-theme;/)
  assert.match(html, /id="lantern-boot">\{"id":"c1"/)
  assert.match(html, /<style id="lantern-theme">@layer lantern-theme\{:root\{--lt-bg:#000\}\}<\/style>/)
  assert.ok(html.endsWith('<body><p>hi</p></body></html>'))
  // The serialized runtime must not contain a literal closing script tag.
  const runtime = html.slice(html.indexOf('</script><script>') + 17, html.indexOf('</script><style id="lantern-kit">'))
  assert.equal(/<\/script/i.test(runtime), false)
})

test('a full document follows a trusted head without changing its markup', () => {
  const source = '<!doctype html><html lang="en"><head><title>x</title></head><body>b</body></html>'
  const html = buildDocument(source, boot, '')
  assert.match(html, /^<!doctype html><head><meta http-equiv="Content-Security-Policy"/)
  assert.ok(html.indexOf('lantern-kit') < html.indexOf('<title>'))
  assert.ok(html.endsWith(`</head>${source}`))
  const noHead = buildDocument('<html><body>b</body></html>', boot, '')
  assert.match(noHead, /^<!doctype html><head><meta http-equiv="Content-Security-Policy"/)
})

test('the policy and runtime precede early scripts and misleading head tags', () => {
  const sources = [
    '<!doctype html><html><script src="https://outside.invalid/early.js"></script><head></head></html>',
    '<!doctype html><script>fetch("https://outside.invalid/early")</script><html><head></head></html>',
    '<!doctype html><html><style>/* <head> */</style><head></head></html>',
    '<!doctype html><html><template><head></head></template><head></head></html>',
    '<!doctype html><html data-text="<head>"><head></head></html>',
    '<!doctype html><html><!-- <head> --><head><script>var s = "<head>"</script></head></html>',
    '\uFEFF<!doctype html><html><head></head><body>x</body></html>',
  ]
  for (const source of sources) {
    const normalized = source.replace(/^\uFEFF/, '')
    for (const html of [buildDocument(source, boot, ''), injectPrelude(source, filePrelude(boot, false))]) {
      assert.match(html, /^<!doctype html><head><meta http-equiv="Content-Security-Policy"/)
      assert.ok(html.endsWith(`</head>${normalized}`))
      const start = html.length - normalized.length
      assert.ok(html.indexOf('id="lantern-boot"') < start, 'bootstrap runs before user markup')
      assert.ok(html.indexOf('<style id="lantern-theme">') < start, 'the complete prelude precedes user markup')
    }
  }
})

test('visuals restrict subresources while allowing the bundled examples libraries', () => {
  const policy = policyDirectives(buildDocument('<p>x</p>', boot, ''))
  assert.equal(policy.get('default-src'), "'none'")
  assert.equal(policy.get('script-src'), "'unsafe-inline' https://cdn.jsdelivr.net/npm/")
  assert.equal(policy.get('style-src'), "'unsafe-inline' https://cdn.jsdelivr.net/npm/ https://fonts.googleapis.com")
  assert.equal(policy.get('font-src'), 'data: blob: https://cdn.jsdelivr.net/npm/ https://fonts.gstatic.com')
  for (const directive of ['connect-src', 'img-src', 'media-src']) assert.equal(policy.get(directive), 'data: blob:')
  for (const directive of ['frame-src', 'object-src', 'worker-src', 'form-action', 'base-uri']) assert.equal(policy.get(directive), "'none'")
  // Existing examples use these packages, including module imports and KaTeX fonts.
  for (const path of ['three@0.170.0/build/three.module.js', 'three@0.170.0/examples/jsm/controls/OrbitControls.js', 'd3@7.9.0/dist/d3.min.js', 'katex@0.16.11/dist/katex.min.js', 'chart.js@4.4.6/dist/chart.umd.js']) {
    assert.ok(`https://cdn.jsdelivr.net/npm/${path}`.startsWith(policy.get('script-src')!.split(' ').at(-1)!))
  }
})

test('the streaming preview shows complete tags only and never scripts', () => {
  assert.equal(partialMarkup('<p>one</p><div class="x'), '<p>one</p>')
  assert.equal(partialMarkup('<p>a</p><script>alert(1)</script><b>b</b>'), '<p>a</p><b>b</b>')
  assert.equal(partialMarkup('<p>a</p><script>alert('), '<p>a</p>')
  assert.equal(partialMarkup('<img src=x onerror="alert(1)"><a href="javascript:alert(1)">l</a><iframe src="https://e.x"></iframe>'), '<img src=x><a href="">l</a>')
  assert.equal(partialMarkup('<meta http-equiv="refresh" content="0;url=https://e.x"><p>x</p>'), '<p>x</p>')
  assert.equal(partialMarkup('<html><head><style>p{}</style></head><body><p>x</p>'), '<style>p{}</style><p>x</p>')
  const streaming = buildDocument('<p>x</p>', { ...boot, streaming: true }, '')
  assert.match(streaming, /<div id="lantern-stream"><\/div>/)
  assert.equal(streaming.includes('<p>x</p>'), false)
})

test('workspace pages get tokens only unless they ask for the kit', () => {
  const tokens = filePrelude({ ...boot, mode: 'panel' }, false)
  const kit = filePrelude({ ...boot, mode: 'panel' }, true)
  assert.match(tokens, /--lt-bg/)
  assert.equal(tokens.includes('.lt-card'), false)
  assert.ok(kit.includes('.lt-card'))
  assert.equal(injectPrelude('<html><head><title>t</title></head></html>', 'P'), '<!doctype html><head>P</head><html><head><title>t</title></head></html>')
  assert.equal(injectPrelude('<!doctype html><p>x</p>', 'P'), '<!doctype html><head>P</head><!doctype html><p>x</p>')
  assert.equal(injectPrelude('<p>x</p>', 'P'), '<!doctype html><head>P</head><p>x</p>')
})

test('workspace policies keep relative assets and fetch without permitting arbitrary external hosts', () => {
  const policy = policyDirectives(filePrelude({ ...boot, mode: 'panel' }, false))
  for (const directive of ['script-src', 'style-src', 'font-src', 'img-src', 'media-src', 'connect-src']) {
    assert.ok(policy.get(directive)!.split(' ').includes("'self'"), `${directive} must allow workspace files`)
  }
  assert.equal(policy.get('connect-src'), "'self' data: blob:")
  assert.equal(policy.get('img-src'), "'self' data: blob:")
  for (const directive of ['default-src', 'form-action', 'base-uri', 'frame-src', 'object-src', 'worker-src']) assert.equal(policy.get(directive), "'none'")
})

test('streaming previews authorize only their own runtime script', () => {
  const preview = () => buildDocument('', { ...boot, streaming: true }, '')
  const html = preview()
  const policy = /<meta http-equiv="Content-Security-Policy" content="([^"]+)"/.exec(html)![1]!
  const nonce = /script-src 'nonce-([^']+)'/.exec(policy)![1]!
  assert.match(html, new RegExp(`<script nonce="${nonce}">`))
  assert.equal(policyDirectives(html).get('script-src'), `'nonce-${nonce}'`)
  assert.equal(preview().includes(nonce), false)
  // A slash can separate a tag name from an event handler in parsed HTML;
  // the regex filter misses it, so the document must block its execution.
  assert.match(partialMarkup('<svg/onload="alert(1)"></svg>'), /onload=/)
  // Encoded JavaScript URLs must also remain subject to the same policy.
  assert.match(partialMarkup('<a href="java&#x73;cript:alert(1)">link</a>'), /java&#x73;cript:/)
  assert.ok(policyDirectives(buildDocument('<script>run()</script>', boot, '')).get('script-src')!.includes("'unsafe-inline'"))
})

test('inline cards never show a scrollbar of their own, unless taller than the largest card', () => {
  const html = buildDocument('<p>x</p>', { ...boot, maxHeight: 1800 }, '')
  // The rule lives in the kit layer, so a visual's own overflow styles still win.
  const kit = html.slice(html.indexOf('@layer lantern-kit{'), html.indexOf('</style>', html.indexOf('@layer lantern-kit{')))
  assert.match(kit, /:root\[data-lt-mode="inline"\]:not\(\[data-lt-overflow\]\) \{ overflow-y: hidden; \}/)
  assert.match(html, /"maxHeight":1800/)
  // Workspace pages are panels: only the tokens, no inline overflow rule.
  assert.equal(filePrelude({ ...boot, mode: 'panel' }, false).includes(':root[data-lt-mode="inline"]'), false)
})

test('the runtime keeps download links, wheel gating and visibility self-contained', () => {
  const html = buildDocument('<p>x</p>', boot, '')
  const runtime = html.slice(html.indexOf('</script><script>') + 17, html.indexOf('</script><style id="lantern-kit">'))
  // Serialized with toString(): everything it uses must be inside the function.
  for (const marker of ["hasAttribute('download')", 'stopImmediatePropagation', 'IntersectionObserver', "type: 'gl'", 'data-lt-fullscreen', 'ResizeObserver loop']) {
    assert.ok(runtime.includes(marker), marker)
  }
  assert.doesNotThrow(() => new Function(runtime))
})
