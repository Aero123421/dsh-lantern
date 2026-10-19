import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, rm, symlink, writeFile } from 'node:fs/promises'
import { createServer, type Server } from 'node:http'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { confine, fileContentSecurityPolicy, FileRefusal, FileServer, FILE_ROUTE, requestOrigin, resolveEntry } from '../src/host/files.ts'
import type { IncomingMessage } from 'node:http'

async function workspace() {
  const base = await mkdtemp(join(tmpdir(), 'lantern-'))
  const root = join(base, 'ws')
  await mkdir(join(root, 'site', 'assets'), { recursive: true })
  await mkdir(join(root, '.secret'), { recursive: true })
  await writeFile(join(root, 'site', 'index.html'), '<!doctype html><html><head><title>t</title></head><body>hi</body></html>')
  await writeFile(join(root, 'site', 'kit.html'), '<html><head><meta name="lantern-kit"></head><body></body></html>')
  await writeFile(join(root, 'site', 'assets', 'app.js'), 'export const x = 1')
  await writeFile(join(root, '.secret', 'a.html'), 'secret')
  await writeFile(join(base, 'outside.html'), 'outside')
  await symlink(join(base, 'outside.html'), join(root, 'site', 'link.html'))
  return { base, root }
}

async function refused(promise: Promise<unknown>, status: number) {
  await assert.rejects(promise, (error: unknown) => error instanceof FileRefusal && error.status === status)
}

test('confine keeps reads inside the working directory', async () => {
  const { base, root } = await workspace()
  try {
    assert.equal((await confine(root, 'site/index.html')).rel, 'site/index.html')
    assert.equal((await confine(root, join(root, 'site/index.html'))).rel, 'site/index.html')
    await refused(confine(root, '../outside.html'), 403)
    await refused(confine(root, join(base, 'outside.html')), 403)
    await refused(confine(root, 'site/link.html'), 403)
    await refused(confine(root, '.secret/a.html'), 403)
    await refused(confine(root, 'site/missing.html'), 404)
    await refused(confine(root, 'site'), 404)
    assert.equal(await resolveEntry(root, 'site/index.html'), 'site/index.html')
    await refused(resolveEntry(root, 'site/assets/app.js'), 400)
  } finally { await rm(base, { recursive: true, force: true }) }
})

test('file CSP uses the request origin and the token prefix', () => {
  const req = { headers: { host: '192.168.1.20:8765', 'x-forwarded-proto': 'https' } } as unknown as IncomingMessage
  assert.equal(requestOrigin(req), 'https://192.168.1.20:8765')
  const policy = fileContentSecurityPolicy('https://192.168.1.20:8765', 'tok_en')
  assert.match(policy, /default-src https:\/\/192\.168\.1\.20:8765\/lantern\/files\/tok_en\//)
  assert.equal(policy.includes("'self'"), false)
  assert.match(policy, /navigate-to 'none'/)
  assert.equal(requestOrigin({ headers: { host: 'evil\r\nX' } } as unknown as IncomingMessage), undefined)
  assert.match(fileContentSecurityPolicy('not a url', 'tok'), /default-src 'none'/)
})

test('the file route serves a granted root with sandbox headers', async () => {
  const { base, root } = await workspace()
  const files = new FileServer()
  const server: Server = createServer((req, res) => { void files.handle(req, res) })
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve))
  const port = (server.address() as { port: number }).port
  const get = (path: string) => fetch(`http://127.0.0.1:${port}${FILE_ROUTE}/${path}`)
  try {
    const token = files.grant(root)
    assert.notEqual(files.grant(root), token)
    const page = await get(`${token}/site/index.html?lt=c1&theme=dark&lang=ja`)
    assert.equal(page.status, 200)
    const origin = `http://127.0.0.1:${port}`
    const policy = fileContentSecurityPolicy(origin, token)
    assert.equal(page.headers.get('content-security-policy'), policy)
    assert.equal(policy.includes("'self'"), false)
    assert.match(policy, new RegExp(`default-src ${origin}${FILE_ROUTE}/${token}/`))
    assert.match(policy, /form-action 'none'/)
    assert.match(policy, /base-uri 'none'/)
    assert.match(policy, /img-src [^;]*data: blob:/)
    assert.match(policy, /connect-src /)
    const script = await get(`${token}/site/assets/app.js`)
    assert.equal(script.headers.get('content-security-policy'), policy)
    assert.equal(page.headers.get('access-control-allow-origin'), '*')
    assert.equal(page.headers.get('referrer-policy'), 'no-referrer')
    const html = await page.text()
    assert.match(html, /<head><meta charset="utf-8"><script type="application\/json" id="lantern-boot">\{"id":"c1","state":"idle","response":null,"scheme":"dark"/)
    assert.equal(html.includes('.lt-card'), false)
    assert.ok((await (await get(`${token}/site/kit.html`)).text()).includes('.lt-card'))
    const js = script
    assert.equal(js.headers.get('content-type'), 'text/javascript; charset=utf-8')
    assert.equal(await js.text(), 'export const x = 1')
    assert.equal((await get(`${token}/.secret/a.html`)).status, 403)
    assert.equal((await get(`${token}/site/..%2F..%2Foutside.html`)).status, 403)
    assert.equal((await get(`${token}/site/link.html`)).status, 403)
    assert.equal((await get(`nope/site/index.html`)).status, 404)
    assert.equal((await fetch(`http://127.0.0.1:${port}${FILE_ROUTE}/${token}/site/index.html`, { method: 'POST' })).status, 405)
    // A token for a page's folder does not reach above it.
    const folder = files.grant(join(root, 'site'))
    assert.equal((await get(`${folder}/index.html`)).status, 200)
    assert.equal((await get(`${folder}/assets/app.js`)).status, 200)
    assert.equal((await get(`${folder}/..%2F.secret%2Fa.html`)).status, 403)
  } finally {
    server.close()
    await rm(base, { recursive: true, force: true })
  }
})
