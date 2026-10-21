/** Actual DSH integration; deterministic model, isolated home, no user accounts. */
import assert from 'node:assert/strict'
import { spawn, execFileSync } from 'node:child_process'
import { mkdtemp, mkdir, readFile, writeFile, copyFile, symlink, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const runtime = process.env.LANTERN_DSH_RUNTIME
if (!runtime) throw new Error('Set LANTERN_DSH_RUNTIME to a directory with DSH 0.2.1-rc.2 and Playwright installed')
const require = createRequire(join(resolve(runtime), 'package.json'))
const { chromium } = require('playwright')
const cli = join(resolve(runtime), 'node_modules/@deepseek-ai/dsh/lib/bin.js')
const home = await mkdtemp(join(tmpdir(), 'lantern-dsh-e2e-'))
const output = resolve(process.env.LANTERN_E2E_OUTPUT || join(tmpdir(), 'lantern-e2e-evidence'))
await mkdir(output, { recursive: true })
const env = { ...process.env, DSH_HOME: home, LANTERN_E2E_LOG: join(output, 'model.jsonl') }
const errors = []
let browser, server
let serverLog = ''
const redact = value => String(value).replace(/([?&]token=)[^\s"'&]+/g, '$1[redacted]')
try {
  execFileSync(process.execPath, [cli, '--profile', 'web', '--dump-config'], { env, cwd: repo, stdio: 'pipe' })
  const profile = join(home, 'profiles/web')
  const modules = join(resolve(runtime), 'node_modules')
  await symlink(modules, join(profile, 'node_modules'), 'dir')
  const plugin = join(modules, 'dsh-lantern')
  await rm(plugin, { recursive: true, force: true })
  await symlink(repo, plugin, 'dir')
  const fixture = join(modules, 'lantern-e2e')
  await mkdir(fixture, { recursive: true })
  await writeFile(join(fixture, 'package.json'), JSON.stringify({ name: 'lantern-e2e', version: '0.0.0', type: 'module', main: 'index.mjs' }))
  await copyFile(join(repo, 'test/browser/fixture.mjs'), join(fixture, 'index.mjs'))
  const manifest = JSON.parse(await readFile(join(profile, 'package.json'), 'utf8'))
  manifest.dependencies['dsh-lantern'] = `file:${repo}`
  manifest.dependencies['lantern-e2e'] = `file:${fixture}`
  manifest.dsh.profile.bundles.push('dsh-lantern')
  await writeFile(join(profile, 'package.json'), JSON.stringify(manifest, null, 2))
  await writeFile(join(profile, 'cordis.patch.yml'), `- id: agent-default-model\n  config:\n    provider: lantern-fixture\n    model: lantern-fixture\n- id: session-title-llm\n  disabled: true\n- insert:\n    - id: lantern-e2e\n      name: lantern-e2e\n`)
  server = spawn(process.execPath, [cli, 'web', '--no-open', '--host', '127.0.0.1', '--port', '3088'], { env, cwd: repo, stdio: ['ignore', 'pipe', 'pipe'] })
  server.stdout.on('data', data => { serverLog += data })
  server.stderr.on('data', data => { serverLog += data })
  let url
  for (let attempt = 0; attempt < 200; attempt++) {
    url = serverLog.match(/http:\/\/127\.0\.0\.1:3088\/\?token=[^\s]+/)?.[0]
    if (url) break
    if (server.exitCode !== null) throw new Error(`DSH exited: ${redact(serverLog)}`)
    await new Promise(r => setTimeout(r, 100))
  }
  assert.ok(url, `DSH did not start: ${redact(serverLog)}`)
  browser = await chromium.launch({ headless: true, args: ['--no-sandbox', '--enable-unsafe-swiftshader'] })
  const context = await browser.newContext({ viewport: { width: 1440, height: 1050 }, locale: 'en-US' })
  const page = await context.newPage()
  page.on('pageerror', error => errors.push(redact(error.stack || error.message)))
  page.on('console', message => { if (message.type() === 'error') errors.push(redact(message.text())) })
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForTimeout(2000)
  await page.screenshot({ path: join(output, 'dsh-initial.png'), fullPage: true })
  await writeFile(join(output, 'initial.txt'), await page.locator('body').innerText())
  await writeFile(join(output, 'controls.json'), JSON.stringify(await page.locator('button,input,textarea,[contenteditable],select').evaluateAll(items => items.map(el => ({ tag: el.tagName, role: el.getAttribute('role'), label: el.getAttribute('aria-label'), title: el.getAttribute('title'), placeholder: el.getAttribute('placeholder'), text: el.textContent?.slice(0,150), editable: el.getAttribute('contenteditable') }))), null, 2))
  console.log('DSH page:', await page.title(), redact(page.url()))
  console.log((await page.locator('body').innerText()).slice(0, 6000))
  await writeFile(join(output, 'errors.json'), JSON.stringify(errors, null, 2))
} finally {
  if (browser) await browser.close()
  if (server) { server.kill('SIGTERM'); await new Promise(resolve => { server.once('exit', resolve); setTimeout(resolve, 3000).unref() }) }
  await writeFile(join(output, 'server.log'), redact(serverLog))
  await rm(home, { recursive: true, force: true })
}
