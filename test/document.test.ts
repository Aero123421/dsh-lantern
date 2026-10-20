import test from 'node:test'
import assert from 'node:assert/strict'
import { buildDocument, cageScripts, filePrelude, injectPrelude, partialMarkup, scriptJson, themeCss, visualCsp } from '../src/frame/document.ts'
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

test('inline scripts are caged and meta refresh is removed', () => {
  const html = cageScripts('<meta http-equiv="refresh" content="0;url=https://e.x"><script>location.href="https://e.x"</script><script type="module">import x from "./a.js"\nlocation.href=1</script><script type="application/json">{"a":1}</script>')
  assert.equal(/http-equiv\s*=\s*"refresh"/i.test(html), false)
  assert.match(html, /const location=__ltLoc/)
  assert.match(html, /parent=window/)
  assert.match(html, /import x from/)
  assert.match(html, /<script type="application\/json">\{"a":1\}<\/script>/)
  const bare = cageScripts('<script type="module">await fetch("./data.json")</script>')
  assert.match(bare, /<script type="module">await fetch/)
  assert.equal(bare.includes('__ltLoc'), false)
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

test('a full document follows a trusted head and the strict visual policy', () => {
  const source = '<!doctype html><html lang="en"><head><title>x</title></head><body>b</body></html>'
  const html = buildDocument(source, boot, '')
  assert.match(html, new RegExp('^<!doctype html><head><meta http-equiv="Content-Security-Policy" content="' + visualCsp().replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '">'))
  assert.equal(visualCsp().includes('https:'), false)
  assert.match(visualCsp(), /img-src data: blob:;/)
  assert.match(visualCsp(), /connect-src data: blob:;/)
  assert.match(visualCsp(), /form-action 'none'; base-uri 'none'; navigate-to 'none'/)
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
    const html = buildDocument(source, boot, '')
    assert.match(html, /^<!doctype html><head><meta http-equiv="Content-Security-Policy"/)
    assert.equal(html.includes('cdn.jsdelivr.net'), false)
    const start = html.indexOf(normalized.includes('<script>') ? '<script>' : normalized)
    assert.ok(html.indexOf('id="lantern-boot"') < start, 'bootstrap runs before user markup')
    const folder = injectPrelude(source, filePrelude(boot, false))
    assert.equal(/<meta http-equiv="Content-Security-Policy"/.test(folder), false)
    assert.ok(folder.indexOf('id="lantern-boot"') < folder.indexOf(normalized.slice(0, 24)))
  }
})

test('html visuals refuse external images, scripts and CDNs', () => {
  const policy = policyDirectives(buildDocument('<p>x</p>', boot, ''))
  assert.equal(policy.get('default-src'), "'none'")
  assert.equal(policy.get('script-src'), "'unsafe-inline' data: blob:")
  assert.equal(policy.get('style-src'), "'unsafe-inline' data: blob:")
  assert.equal(policy.get('img-src'), 'data: blob:')
  assert.equal(policy.get('font-src'), 'data: blob:')
  assert.equal(policy.get('connect-src'), 'data: blob:')
  assert.equal(policy.get('navigate-to'), "'none'")
  for (const directive of ['frame-src', 'object-src', 'worker-src', 'form-action', 'base-uri']) assert.equal(policy.get(directive), "'none'")
  assert.equal(policy.get('script-src')!.includes('https:'), false)
  assert.equal(visualCsp().includes('/lantern/files'), false)
})

test('paused markup drops external subresources the CSP would also refuse', () => {
  const paused = partialMarkup('<img src="https://evil.example/a.png"><img src="data:image/gif;base64,xx"><link rel="stylesheet" href="https://evil.example/a.css"><link rel="prefetch" href="https://evil.example/p"><script src="https://evil.example/a.js"></script><style>b{background:url(https://evil.example/b.png)}</style><p>x</p>')
  assert.equal(paused.includes('evil.example'), false)
  assert.match(paused, /data:image/)
  assert.equal(paused.includes('<script'), false)
  assert.equal(paused.includes('<link'), false)
  const html = buildDocument(paused, { ...boot, streaming: false }, '')
  assert.match(html, /^<!doctype html><html[^>]*><head><meta http-equiv="Content-Security-Policy"/)
  assert.ok(html.indexOf('id="lantern-boot"') < html.indexOf('<p>x</p>'))
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

test('folder preludes do not add a self CSP that would miss the token prefix', () => {
  const html = filePrelude({ ...boot, mode: 'panel' }, false)
  assert.equal(/<meta http-equiv="Content-Security-Policy"/.test(html), false)
  assert.equal(html.includes('cdn.jsdelivr.net'), false)
})

test('streaming previews authorize only their own runtime script', () => {
  const preview = () => buildDocument('', { ...boot, streaming: true }, '')
  const html = preview()
  const policy = /<meta http-equiv="Content-Security-Policy" content="([^"]+)"/.exec(html)![1]!
  const nonce = /script-src 'nonce-([^']+)'/.exec(policy)![1]!
  assert.match(html, new RegExp(`<script nonce="${nonce}">`))
  assert.equal(/script-src[^;]*'unsafe-inline'/.test(policy), false)
  assert.equal(policyDirectives(html).get('script-src'), `'nonce-${nonce}'`)
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
