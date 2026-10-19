import test from 'node:test'
import assert from 'node:assert/strict'
import { buildDocument, cageScripts, filePrelude, injectPrelude, partialMarkup, scriptJson, themeCss, visualCsp } from '../src/frame/document.ts'
import type { FrameBoot } from '../src/frame/runtime.ts'

const boot: FrameBoot = { id: 'c1', state: 'idle', response: null, scheme: 'dark', mode: 'inline', widgetState: null, streaming: false, lang: 'ja' }

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

test('inline scripts are caged and meta refresh is removed', () => {
  const html = cageScripts('<meta http-equiv="refresh" content="0;url=https://e.x"><script>location.href="https://e.x"</script><script type="module">import x from "./a.js"\nlocation.href=1</script><script type="application/json">{"a":1}</script>')
  assert.equal(/http-equiv\s*=\s*"refresh"/i.test(html), false)
  assert.match(html, /const location=__ltLoc/)
  assert.match(html, /import x from/)
  assert.match(html, /<script type="application\/json">\{"a":1\}<\/script>/)
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

test('a full document gets the prelude first in its head', () => {
  const html = buildDocument('<!doctype html><html lang="en"><head><title>x</title></head><body>b</body></html>', boot, '')
  assert.match(html, new RegExp('^<!doctype html><html lang="en"><head><meta http-equiv="Content-Security-Policy" content="' + visualCsp().replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '"><meta charset="utf-8">'))
  assert.match(visualCsp(), /img-src data: blob:;/ )
  assert.equal(visualCsp().includes('https:') && visualCsp().includes('img-src https:'), false)
  assert.match(visualCsp(), /connect-src data: blob:;/)
  assert.match(visualCsp(), /form-action 'none'; base-uri 'none'; navigate-to 'none'/)
  assert.ok(html.indexOf('lantern-kit') < html.indexOf('<title>'))
  const noHead = buildDocument('<html><body>b</body></html>', boot, '')
  assert.match(noHead, /^<html><head><meta http-equiv="Content-Security-Policy"/)
  // A <head> inside a comment or a script string is not the head.
  const tricky = buildDocument('<!doctype html><html><!-- <head> --><head><script>var s = "<head>"</script></head><body></body></html>', boot, '')
  assert.ok(tricky.startsWith('<!doctype html><html><!-- <head> --><head><meta http-equiv'))
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
  assert.equal(injectPrelude('<html><head><title>t</title></head></html>', 'P'), '<html><head>P<title>t</title></head></html>')
  assert.equal(injectPrelude('<!doctype html><p>x</p>', 'P'), '<!doctype html>P<p>x</p>')
  assert.equal(injectPrelude('<p>x</p>', 'P'), 'P<p>x</p>')
})

test('streaming previews authorize only their own runtime script', () => {
  const preview = () => buildDocument('', { ...boot, streaming: true }, '')
  const html = preview()
  const policy = /<meta http-equiv="Content-Security-Policy" content="([^"]+)"/.exec(html)![1]!
  const nonce = /script-src 'nonce-([^']+)'/.exec(policy)![1]!
  assert.match(html, new RegExp(`<script nonce="${nonce}">`))
  assert.equal(/script-src[^;]*'unsafe-inline'/.test(policy), false)
  assert.match(policy, /style-src 'unsafe-inline'/)
  assert.equal(preview().includes(nonce), false)
  // A slash can separate a tag name from an event handler in parsed HTML;
  // the regex filter misses it, so the document must block its execution.
  assert.match(partialMarkup('<svg/onload="alert(1)"></svg>'), /onload=/)
  // Encoded JavaScript URLs must also remain subject to the same policy.
  assert.match(partialMarkup('<a href="java&#x73;cript:alert(1)">link</a>'), /java&#x73;cript:/)
  const finished = buildDocument('<script>run()</script>', boot, '')
  assert.match(finished, /script-src 'unsafe-inline' data: blob:/)
  assert.equal(/script-src[^;]*https:/.test(finished), false)
  assert.match(finished, /img-src data: blob:;/)
  assert.match(finished, /const location=__ltLoc/)
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
  for (const marker of ["hasAttribute('download')", 'stopImmediatePropagation', 'IntersectionObserver', "type: 'gl'", 'data-lt-fullscreen', 'ResizeObserver loop', 'Function.prototype.call.bind(String.prototype.startsWith)', 'const SafeURL = URL']) {
    assert.ok(runtime.includes(marker), marker)
  }
  assert.equal(runtime.includes('.indexOf('), false)
  assert.equal(runtime.includes('new URL('), false)
  assert.equal(runtime.includes('navigator.language'), false)
  assert.doesNotThrow(() => new Function(runtime))
})
