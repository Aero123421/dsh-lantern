/** Real Tail/VisualCard/Frame in a mock host. No DSH service or model is called. */
import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { createRequire } from 'node:module'
import { once } from 'node:events'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from 'esbuild'

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const runtime = process.env.LANTERN_DSH_RUNTIME
if (!runtime) throw new Error('LANTERN_DSH_RUNTIME must contain Playwright and react-dom 18')
const require = createRequire(join(resolve(runtime), 'package.json'))
const localRequire = createRequire(join(repo, 'package.json'))
const { chromium } = require('playwright')
const output = resolve(process.env.LANTERN_E2E_OUTPUT || '/tmp/lantern-replacement-evidence')
await mkdir(output, { recursive: true })
const bundle = await build({
  stdin: { contents: `
    import React from 'react';
    import { createRoot } from 'react-dom/client';
    import { flushSync } from 'react-dom';
    import { Tail } from './src/client/views.tsx';
    import { VisualCard } from './src/client/Card.tsx';
    import { inTail, replacementOf } from './src/client/store.ts';
    import css from './src/client/style.css';
    document.head.appendChild(Object.assign(document.createElement('style'), {textContent:css}));
    const root = createRoot(document.getElementById('root'));
    const scroll = HTMLElement.prototype.scrollIntoView;
    window.scrollTargets = [];
    HTMLElement.prototype.scrollIntoView = function(options) {
      window.scrollTargets.push({id:this.dataset.lanternId,key:this.dataset.lanternKey,replaced:this.hasAttribute('data-replaced')});
      scroll.call(this, options);
    };
    window.fixture = {
      mount(sessionId, calls) {
        flushSync(() => root.render(<Tail turn={{turn:1}} seq={100000} sessionId={sessionId} useVisuals={() => calls}/>));
      },
      clear() { flushSync(() => root.render(null)); },
      panel(sessionId,record) { flushSync(() => root.render(<VisualCard record={record} sessionId={sessionId} placement="panel" phase="result"/>)); },
      inTail, replacementOf,
    };
  `, resolveDir: repo, loader: 'tsx' },
  bundle: true, write: false, format: 'iife', jsx: 'automatic',
  loader: { '.css': 'text' },
  alias: { react: dirname(localRequire.resolve('react/package.json')), 'react-dom': dirname(require.resolve('react-dom/package.json')) },
})
const html = `<!doctype html><html lang="en"><meta charset="utf-8"><title>Lantern replacement regression · mock DSH host</title>
<style>body{font:15px system-ui;margin:24px;background:#fff;color:#17181c}main{max-width:850px;margin:auto}h1{font-size:20px}button{font:inherit}#root{padding-bottom:100px}</style>
<main><h1>Lantern replacement regression · mock DSH host</h1><p>Actual Tail / VisualCard / Frame; synthetic conversation data.</p><div id="root"></div></main><script>${bundle.outputFiles[0].text.replaceAll('</script', '<\\/script')}</script></html>`
const server = createServer((_request, response) => { response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); response.end(html) })
let browser, page, failure
const checks = [], errors = [], diagnostics = []
const check = (name, value) => { assert.ok(value, name); checks.push(name) }
const call = (id, seq, replace, error) => ({ callId: id, seq, settled: true, isError: !!error, ...(error ? { errorText: error } : {}),
  argsRaw: JSON.stringify({ title: 'Revision ' + id, html: '<h2>Latest content: ' + id + '</h2>', ...(replace ? { replace } : {}) }), meta: { status: 'shown' } })
const chain = length => Array.from({length:length + 1}, (_, i) => call('r' + i, i, i ? 'r' + (i - 1) : undefined))
try {
  server.listen(0, '127.0.0.1'); await once(server, 'listening')
  browser = await chromium.launch({ headless: true, ...(process.env.LANTERN_CHROMIUM ? { executablePath: process.env.LANTERN_CHROMIUM } : {}), args: ['--no-sandbox'] })
  page = await browser.newPage({ viewport: {width:1100,height:850}, reducedMotion:'reduce' })
  page.on('pageerror', error => errors.push(String(error)))
  page.on('console', message => { if (message.type() === 'error' || message.type() === 'warning') diagnostics.push(message.text()) })
  await page.goto(`http://127.0.0.1:${server.address().port}`, {waitUntil:'domcontentloaded'})
  async function mount(session, calls) {
    await page.evaluate(({session,calls}) => fixture.mount(session,calls), {session,calls})
    await page.waitForFunction(({session,id}) => fixture.inTail(id,session), {session,id:calls[0].callId})
  }
  async function follow(session, target, name) {
    await page.locator('[data-lantern-id="r0"] button.lantern-link').click()
    const actual = await page.evaluate(() => scrollTargets.at(-1))
    check(name, actual?.id === target && actual.key === JSON.stringify([session,target]) && !actual.replaced)
    const latest = page.locator('[data-lantern-id="' + target + '"]')
    await page.waitForFunction(id => {
      const box = document.querySelector('[data-lantern-id="' + id + '"]').getBoundingClientRect()
      return box.top >= 0 && box.bottom <= innerHeight
    }, target)
    check(name + ': destination contains the latest iframe', await latest.locator('iframe').count() === 1)
    if (name === 'twenty-one replacements' || name === 'eighty replacements') {
      await latest.getByRole('button', {name:'Run',exact:true}).click()
      await latest.frameLocator('iframe').getByRole('heading', {name:'Latest content: ' + target,exact:true}).waitFor()
    }
    await page.screenshot({path:join(output, name.replaceAll(/[^a-z0-9]+/gi,'-') + '.png')})
  }
  await mount('normal',chain(1)); await follow('normal','r1','normal replacement')
  await mount('boundary',chain(21)); await follow('boundary','r21','twenty-one replacements')
  await mount('long',chain(80)); await follow('long','r80','eighty replacements')
  check('replaced cards have no duplicate frames', await page.locator('iframe').count() === 1)
  await page.setViewportSize({width:390,height:844})
  await follow('long','r80','mobile long chain')
  check('mobile layout stays within viewport', await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
  await page.setViewportSize({width:1100,height:850})
  await page.evaluate(() => fixture.clear())
  check('removing the conversation unmounts cards and clears tail ownership', await page.locator('[data-lantern-id]').count() === 0 && await page.evaluate(() => !fixture.inTail('r0','long') && !fixture.inTail('r80','long')))
  // Allow the existing script gate's unmount grace period to expire.
  await page.waitForTimeout(1600)
  await mount('long',chain(80)); await follow('long','r80','redisplayed conversation')
  check('redisplayed latest frame stays script-gated', await page.locator('[data-lantern-id="r80"] iframe').getAttribute('data-scripts') === 'off')
  await mount('fork',chain(22)); await follow('fork','r22','fork session isolation')
  await mount('long',chain(80)); await follow('long','r80','return to original session')
  const failed = [...chain(1),call('failed',2,'r1','Intentional fixture failure')]
  await mount('failure',failed); await follow('failure','r1','failed replacement keeps previous card')
  check('failed replacement shows its error', (await page.locator('[data-lantern-id="failed"]').innerText()).includes('Intentional fixture failure'))
  await mount('failure',[...failed,call('retry',3,'r1')]); await follow('failure','retry','successful replacement after failure')
  await mount('cycle',[call('a',1,'b'),call('b',2,'a')])
  check('cyclic input keeps both cards accessible without replacement links', await page.locator('[data-replaced]').count() === 0 && await page.locator('iframe').count() === 2)
  await page.screenshot({path:join(output,'cyclic-input.png')})
  await page.evaluate(() => fixture.clear())
  check('final unmount removes all frames', await page.locator('iframe').count() === 0)
  await page.route('**/api/lantern.file', route => route.fulfill({json:{ok:true,value:{url:'/mock-workspace.html'}}}))
  await page.route('**/mock-workspace.html*', route => route.fulfill({contentType:'text/html',body:'<h2>Mock workspace page</h2>'}))
  await page.evaluate(() => fixture.panel('workspace',{callId:'path-page',args:{title:'Workspace report',path:'report.html',display:'panel',await:false},result:{status:'shown'}}))
  await page.locator('iframe[title="Workspace report"]').waitFor()
  check('workspace iframe uses the human-readable visual title', await page.locator('iframe').getAttribute('title') === 'Workspace report')
  await page.evaluate(() => fixture.clear())
  check('workspace iframe is removed on unmount', await page.locator('iframe').count() === 0)
  await mount('closed', [{ callId: 'closed-card', seq: 1, settled: true, isError: false,
    argsRaw: JSON.stringify({ title: 'Done', html: '<p>done</p>', display: 'inline' }), meta: { status: 'closed' } }])
  check('closed visual shows the closed badge', await page.locator('[data-lantern-id="closed-card"] .lantern-badge').innerText() === 'Closed')
  await page.evaluate(() => { document.documentElement.lang = 'ja' })
  await mount('ja-error', [{ callId: 'bad', seq: 1, settled: true, isError: true,
    argsRaw: JSON.stringify({ title: 'Bad', html: '<p>x</p>', display: 'inline' }) }])
  check('empty tool error follows the page language', (await page.locator('[data-lantern-id="bad"]').innerText()).includes('エラー'))
  await page.evaluate(() => { document.documentElement.lang = 'en' })
  await mount('drift', [{ callId: 'drift', seq: 1, settled: true, isError: false, argsRaw: JSON.stringify({
    title: 'Drift', display: 'inline',
    html: '<button id="go" type="button">leave</button><script type="module">document.getElementById("go").addEventListener("click",()=>{location.href="about:blank"})<\/script>',
  }), meta: { status: 'shown' } }])
  await page.locator('[data-lantern-id="drift"]').getByRole('button', { name: 'Run', exact: true }).click()
  await page.frameLocator('[data-lantern-id="drift"] iframe').locator('#go').click()
  await page.locator('[data-lantern-id="drift"]').getByText('This page navigated', { exact: false }).waitFor()
  check('self-navigation explains that visual controls stopped', true)
  await page.screenshot({ path: join(output, 'navigated-notice.png') })
  check('no browser page errors', errors.length === 0)
  const unexpected = diagnostics.filter(message => !message.includes("Unrecognized Content-Security-Policy directive 'navigate-to'") && !message.includes("Blocked script execution in 'about:srcdoc'"))
  check('no unexpected console diagnostics', unexpected.length === 0)
  console.log(checks.length + ' mock-host replacement UI checks passed')
} catch(error) {
  failure = String(error)
  if (page) await page.screenshot({path:join(output,'replacement-failure.png')}).catch(()=>{})
  throw error
} finally {
  const scrollTargets = page ? await page.evaluate(() => window.scrollTargets).catch(() => []) : []
  await writeFile(join(output,'replacement-checks.json'),JSON.stringify({checks,errors,diagnostics,scrollTargets,...failure ? {failure} : {},scope:'mock DSH host; actual Tail/VisualCard/Frame; no DSH integration, account, or model'},null,2))
  if (browser) await browser.close()
  await new Promise(resolve => server.close(resolve))
}
