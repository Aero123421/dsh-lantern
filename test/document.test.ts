import test from 'node:test'
import assert from 'node:assert/strict'
import { buildDocument, filePrelude, injectPrelude, partialMarkup, scriptJson, themeCss } from '../src/frame/document.ts'
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
  assert.match(html, /^<!doctype html><html lang="en"><head><meta http-equiv="Content-Security-Policy" content="connect-src data: blob:; form-action 'none'; base-uri 'none'"><meta charset="utf-8">/)
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
