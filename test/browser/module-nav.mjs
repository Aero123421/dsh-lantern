/**
 * Real DSH regression for issue #14.
 * A module script that navigates before the iframe's first load must be
 * put back, with scripts removed. A classic script and a module that stay
 * must keep running.
 *
 * Requires LANTERN_DSH_RUNTIME (official DSH plus Playwright). Uses port
 * 3096 unless LANTERN_PORT is set, so it can run beside test/browser/run.mjs.
 */
import { spawn, execFileSync } from 'node:child_process'
import { mkdtemp, mkdir, readFile, writeFile, symlink, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { createServer } from 'node:http'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const runtime = resolve(process.env.LANTERN_DSH_RUNTIME || '')
if (!runtime) throw new Error('Set LANTERN_DSH_RUNTIME to an isolated directory with DSH and Playwright')
const port = process.env.LANTERN_PORT || '3096'
const label = process.env.LANTERN_LABEL || 'dsh'
const output = resolve(process.env.LANTERN_E2E_OUTPUT || join(tmpdir(), `module-nav-${label}`))
const repo = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const require = createRequire(join(runtime, 'package.json'))
const { chromium } = require('playwright')
const cli = join(runtime, 'node_modules/@deepseek-ai/dsh/lib/bin.js')
const version = require(join(runtime, 'node_modules/@deepseek-ai/dsh/package.json')).version
const home = await mkdtemp(join(tmpdir(), 'lantern-nav-'))
await mkdir(output, { recursive: true })
const foreign = createServer((req, res) => {
  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' })
  res.end('<h1 id="foreign">FOREIGN</h1><form action="https://example.invalid/collect"><input name="secret" value="typed"></form>')
})
await new Promise(resolve => foreign.listen(0, '127.0.0.1', resolve))
const target = `http://127.0.0.1:${foreign.address().port}/landed`
const end = '</scr' + 'ipt>'
const nav = '<h1 id="original">ORIGINAL</h1><script type="module">location.href=' + JSON.stringify(target) + end
const stay = '<h1 id="original">KEPT</h1><p id="ran">no</p><script>document.getElementById("ran").textContent="yes"' + end
const moduleStay = '<h1 id="original">MODULE</h1><p id="ran">no</p><script type="module">document.getElementById("ran").textContent="yes"' + end
const fixtureSource = `
import { LlmAdapter } from '@deepseek-ai/dsh-llm'
const pages = { NAV: ${JSON.stringify(nav)}, KEPT: ${JSON.stringify(stay)}, MODULE: ${JSON.stringify(moduleStay)} }
const seen = new Map()
class Fixture extends LlmAdapter {
  providerInfo(provider){return {id:provider,name:'nav'}}
  async listModels(provider){return [{provider,id:'lantern-fixture',name:'nav'}]}
  async resolveModel(provider,model){return {provider,id:model,name:'nav',context:{contextWindow:8192},defaultMaxTokens:2048}}
  async *stream(options){
    if(options.purpose){yield {type:'block-start',index:0,blockType:'text'};yield {type:'text-delta',index:0,text:'t'};yield {type:'block-end',index:0,block:{type:'text',text:'t'}};yield {type:'finish',reason:{kind:'stop'}};return}
    const key=options.sessionId||'default'
    const count=seen.get(key)||0
    seen.set(key,count+1)
    const user=options.messages.filter(m=>m.role==='user').flatMap(m=>m.content||[]).map(b=>b.text||'').join('\\n')
    const kind=user.includes('NAV')?'NAV':user.includes('MODULE')?'MODULE':'KEPT'
    if(count===0){
      const id='nav-'+kind
      const args=JSON.stringify({title:kind,html:pages[kind]})
      yield {type:'block-start',index:1,blockType:'tool-call'}
      yield {type:'block-end',index:1,block:{type:'tool-call',id,name:'show_visual',arguments:args}}
      yield {type:'finish',reason:{kind:'tool-calls'}}
      return
    }
    yield {type:'block-start',index:0,blockType:'text'}
    yield {type:'text-delta',index:0,text:'shown'}
    yield {type:'block-end',index:0,block:{type:'text',text:'shown'}}
    yield {type:'finish',reason:{kind:'stop'}}
  }
}
export const name='lantern-e2e'
export const inject=['llm']
export function apply(ctx){ctx.llm.registerAdapter(['lantern-fixture'],new Fixture())}
`
const env = { ...process.env, DSH_HOME: home }
const redact = value => String(value).replace(/([?&]token=)[^\\s"'&]+/g, '$1[redacted]')
let server, browser, serverLog = ''
const report = { version, label, cases: {} }
try {
  execFileSync(process.execPath, [cli, '--profile', 'web', '--dump-config'], { env, cwd: repo, stdio: 'pipe' })
  const profile = join(home, 'profiles/web')
  const modules = join(runtime, 'node_modules')
  await symlink(modules, join(profile, 'node_modules'), 'dir')
  await rm(join(modules, 'dsh-lantern'), { recursive: true, force: true })
  await symlink(repo, join(modules, 'dsh-lantern'), 'dir')
  const fixture = join(modules, 'lantern-e2e')
  await rm(fixture, { recursive: true, force: true })
  await mkdir(fixture, { recursive: true })
  await writeFile(join(fixture, 'package.json'), JSON.stringify({ name: 'lantern-e2e', version: '0.0.0', type: 'module', main: 'index.mjs' }))
  await writeFile(join(fixture, 'index.mjs'), fixtureSource)
  const manifest = JSON.parse(await readFile(join(profile, 'package.json'), 'utf8'))
  manifest.dependencies['dsh-lantern'] = `file:${repo}`
  manifest.dependencies['lantern-e2e'] = `file:${fixture}`
  manifest.dsh.profile.bundles.push('dsh-lantern')
  await writeFile(join(profile, 'package.json'), JSON.stringify(manifest, null, 2))
  await writeFile(join(profile, 'cordis.patch.yml'), `- id: agent-default-model
  config:
    provider: lantern-fixture
    model: lantern-fixture
- id: session-title-llm
  disabled: true
- id: workspace-controller
  config:
    documentsDirectory: ${JSON.stringify(join(home, 'Documents'))}
- insert:
    - id: lantern-e2e
      name: lantern-e2e
`)
  server = spawn(process.execPath, [cli, 'web', '--no-open', '--host', '127.0.0.1', '--port', port], { env, cwd: repo, stdio: ['ignore', 'pipe', 'pipe'] })
  server.stdout.on('data', data => { serverLog += data })
  server.stderr.on('data', data => { serverLog += data })
  let url
  for (let attempt = 0; attempt < 200; attempt++) {
    url = serverLog.match(new RegExp('http://127\\.0\\.0\\.1:' + port + '/\\?token=\\S+'))?.[0]
    if (url) break
    if (server.exitCode !== null) throw new Error(redact(serverLog))
    await new Promise(r => setTimeout(r, 100))
  }
  if (!url) throw new Error('no url ' + redact(serverLog).slice(-1500))
  browser = await chromium.launch({ headless: true, args: ['--no-sandbox', '--enable-unsafe-swiftshader'] })
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, locale: 'en-US' })
  page.setDefaultTimeout(20000)
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 })
  await page.waitForTimeout(800)
  const cont = page.getByRole('button', { name: 'Continue', exact: true })
  if (await cont.count()) {
    await cont.click()
    await cont.waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {})
  }
  const close = page.getByRole('button', { name: /^close$/i })
  if (await close.count()) await close.first().click().catch(() => {})
  await page.locator('[role=presentation]').waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {})
  async function ask(text, name) {
    const fresh = page.getByRole('button', { name: 'New session', exact: true }).first()
    if (await page.locator('.lantern-card, .lantern-tail').count()) await fresh.click()
    const input = page.locator('[contenteditable="true"]').first()
    await input.waitFor({ state: 'visible', timeout: 30000 })
    await input.click()
    await input.fill('')
    await input.pressSequentially(text, { delay: 8 })
    await page.getByRole('button', { name: 'Send message', exact: true }).click()
    await page.getByText('shown', { exact: true }).last().waitFor({ state: 'visible', timeout: 30000 })
    const card = page.locator('.lantern-tail').last()
    await card.locator('iframe').waitFor({ state: 'visible', timeout: 30000 })
    await page.waitForTimeout(1200)
    const frame = card.frameLocator('iframe')
    let heading = 'unreadable'
    let ran = null
    try { heading = await frame.locator('h1').innerText({ timeout: 2000 }) } catch (error) { heading = String(error).split('\\n')[0] }
    try { ran = await frame.locator('#ran').innerText({ timeout: 1000 }) } catch { ran = null }
    const meta = await card.locator('iframe').evaluate(el => ({
      scripts: el.getAttribute('data-scripts'),
      sandbox: el.getAttribute('sandbox'),
    }))
    const note = await card.innerText()
    const result = { heading, ran, ...meta, navigated: note.includes('This page navigated') }
    report.cases[name] = result
    await page.screenshot({ path: join(output, `${label}-${name}.png`), fullPage: true })
    console.log(name, JSON.stringify(result))
  }
  await ask('Show a card that stays. KEPT', 'kept')
  await ask('Show a module that stays. MODULE', 'module')
  await ask('Show a module that leaves. NAV', 'nav')
  await writeFile(join(output, 'report.json'), JSON.stringify(report, null, 2))
  const { kept, module: stayed, nav: left } = report.cases
  if (kept.ran !== 'yes' || kept.scripts !== 'on' || kept.navigated) throw new Error('classic card was disturbed ' + JSON.stringify(kept))
  if (stayed.ran !== 'yes' || stayed.scripts !== 'on' || stayed.navigated) throw new Error('module card was disturbed ' + JSON.stringify(stayed))
  if (left.heading !== 'ORIGINAL' || left.scripts !== 'off' || !left.navigated || left.sandbox.includes('allow-scripts')) throw new Error('navigation was not restored ' + JSON.stringify(left))
  console.log('WROTE', join(output, 'report.json'))
} catch (error) {
  await writeFile(join(output, 'failure.txt'), redact(error.stack || error))
  console.error(redact(error.stack || error))
  process.exitCode = 1
} finally {
  await writeFile(join(output, 'server.log'), redact(serverLog))
  if (browser) await browser.close()
  if (server) { server.kill('SIGTERM'); await new Promise(resolve => { server.once('exit', resolve); setTimeout(resolve, 3000).unref() }) }
  foreign.close()
  await rm(home, { recursive: true, force: true })
}
