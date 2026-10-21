import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, realpath, rm, symlink, writeFile } from 'node:fs/promises'
import { createServer, type Server } from 'node:http'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { apply, type VisualResult } from '../src/host/index.ts'
import { FileServer, FILE_ROUTE } from '../src/host/files.ts'

interface Tool {
  name: string
  description: string
  output: { render(args: unknown, value: VisualResult): { text: string }[]; presentationMeta(args: unknown, value: VisualResult): Record<string, unknown> }
  execute(args: unknown, exec: unknown): Promise<VisualResult>
}

function fakeHost(services: Record<string, unknown> = {}) {
  const tools: Tool[] = []
  const routes = new Map<string, (request: Request) => Promise<Response>>()
  const providers: (() => unknown)[] = []
  const disposers: (() => unknown)[] = []
  let fileHandler: FileServer['handle'] | undefined
  const ctx = {
    tools: { register: (tool: Tool) => { tools.push(tool) }, get: (name: string) => tools.find(tool => tool.name === name) },
    systemPrompt: { section: () => () => {} },
    connection: { fetch: { register: (route: { path: string; fetch: (r: Request) => Promise<Response> }) => { routes.set(route.path, route.fetch); return () => routes.delete(route.path) } } },
    get: (name: string) => ({ fs: { processPathFromHostPath: (path: string) => path }, ...services })[name],
    inject(deps: string[], callback: (scope: unknown) => void) {
      if (deps[0] === 'skills') callback({ ...ctx, skills: { registerProvider: (factory: () => unknown) => providers.push(factory) } })
      if (deps[0] === 'webServer') callback({ ...ctx, webServer: { register: (route: { handler: FileServer['handle'] }) => { fileHandler = route.handler; return () => { fileHandler = undefined } } } })
    },
    effect(execute: () => unknown) { const dispose = execute(); if (typeof dispose === 'function') disposers.push(dispose as () => unknown) },
    on() {},
  }
  apply(ctx, { answerTimeoutMinutes: 0.001 })
  const call = async (method: string, payload: unknown) => {
    const response = await routes.get(`/api/${method}`)!(new Request('http://x/api/' + method, { method: 'POST', body: JSON.stringify(payload), headers: { 'content-type': 'application/json' } }))
    return { status: response.status, body: await response.json() as { ok: boolean; value?: any; error?: { code: string } } }
  }
  const file = async (url: string) => {
    let text = ''
    const response = { statusCode: 200, headersSent: false, setHeader() {}, end(body: unknown) { text = String(body) }, destroy() {} }
    await fileHandler!({ method: 'GET', url: '/' + url } as never, response as never)
    return { status: response.statusCode, text }
  }
  return { tool: tools[0]!, call, file, providers, disposers }
}

const keepAlive = setInterval(() => {}, 1000)
test.after(() => clearInterval(keepAlive))

const exec = (callId: string, cwd?: string) => ({ callId, signal: new AbortController().signal, agent: { id: 's1', session: { id: 's1', header: { cwd } } } })

test('show_visual registers with a short description and validates its arguments', async () => {
  const { tool } = fakeHost()
  assert.equal(tool.name, 'show_visual')
  assert.ok(tool.description.length < 1200)
  await assert.rejects(tool.execute({ html: '<p>x</p>' }, exec('a')), /title/)
  await assert.rejects(tool.execute({ title: 't' }, exec('a')), /exactly one/)
  await assert.rejects(tool.execute({ title: 't', html: 'x', path: 'y.html' }, exec('a')), /exactly one/)
  await assert.rejects(tool.execute({ title: 't', html: 'x', display: 'side' }, exec('a')), /display/)
  await assert.rejects(tool.execute({ title: 't', html: 'x'.repeat(400_001) }, exec('huge')), /longer than 400000/)
  const shown = await tool.execute({ title: ' Chart ', html: '<p>x</p>', replace: 'old' }, exec('a'))
  assert.deepEqual(shown, { id: 'a', status: 'shown', display: 'inline', title: 'Chart', replace: 'old' })
  assert.match(tool.output.render({}, shown)[0]!.text, /shown inline in the chat \(id: a\)/)
  assert.equal(tool.output.presentationMeta({}, shown).lantern, 1)
})

test('an awaited visual returns the answer posted through the route', async () => {
  const { tool, call } = fakeHost()
  const running = tool.execute({ title: 'Pick', html: '<p>x</p>', await_response: true }, exec('b'))
  await new Promise(resolve => setTimeout(resolve, 5))
  assert.deepEqual((await call('lantern.waiting', { sessionId: 's1', callId: 'b' })).body.value, { waiting: true, status: 'waiting' })
  assert.deepEqual((await call('lantern.respond', { sessionId: 's1', callId: 'b', response: { plan: 'pro' } })).body.value, { status: 'settled' })
  const result = await running
  assert.equal(result.status, 'answered')
  assert.equal(result.response, '{"plan":"pro"}')
  assert.match(tool.output.render({}, result)[0]!.text, /The user answered visual b/)
  assert.deepEqual((await call('lantern.respond', { sessionId: 's1', callId: 'b', response: 1 })).body.value, { status: 'answered' })
  assert.equal((await call('lantern.respond', { response: 1 })).status, 400)
  assert.equal((await call('lantern.respond', { sessionId: 's1', callId: 'b', response: 'x'.repeat(70_000) })).body.error?.code, 'too-large')
})

test('skip and timeout end the wait', async () => {
  const { tool, call } = fakeHost()
  const skipped = tool.execute({ title: 'Pick', html: 'x', await_response: true }, exec('c'))
  await new Promise(resolve => setTimeout(resolve, 5))
  // Another session's call with the same id is not this one.
  assert.deepEqual((await call('lantern.dismiss', { sessionId: 'other', callId: 'c' })).body.value, { status: 'unknown' })
  await call('lantern.dismiss', { sessionId: 's1', callId: 'c' })
  assert.equal((await skipped).status, 'dismissed')
  assert.deepEqual((await call('lantern.respond', { sessionId: 's1', callId: 'c', response: 1 })).body.value, { status: 'dismissed' })
  const timedOut = await tool.execute({ title: 'Pick', html: 'x', await_response: true }, exec('d'))
  assert.equal(timedOut.status, 'timeout')
  assert.deepEqual((await call('lantern.respond', { sessionId: 's1', callId: 'd', response: 1 })).body.value, { status: 'timeout' })
})

test('path visuals resolve inside the working directory and open in the panel', async () => {
  const base = await mkdtemp(join(tmpdir(), 'lantern-host-'))
  try {
    await mkdir(join(base, 'r'))
    await writeFile(join(base, 'r', 'index.html'), '<p>x</p>')
    const { tool, call } = fakeHost()
    const shown = await tool.execute({ title: 'Report', path: './r/index.html' }, exec('e', base))
    assert.deepEqual(shown, { id: 'e', status: 'shown', display: 'panel', title: 'Report', path: 'r/index.html', source: { kind: 'local', root: await realpath(base), path: 'r/index.html' } })
    await assert.rejects(tool.execute({ title: 'x', path: '../etc/x.html' }, exec('f', base)), /outside/)
    const file = await call('lantern.file', { sessionId: 's1', callId: 'e' })
    assert.match(file.body.value.url, /^lantern\/files\/[\w-]+\/index\.html$/)
    assert.equal((await call('lantern.file', { sessionId: 'unknown', callId: 'e' })).body.error?.code, 'no-source')
  } finally { await rm(base, { recursive: true, force: true }) }
})

test('a saved folder is served only while it stays inside the session working directory', async () => {
  const base = await mkdtemp(join(tmpdir(), 'lantern-sources-'))
  try {
    const a = join(base, 'a'), b = join(base, 'b')
    await mkdir(a); await mkdir(b)
    await writeFile(join(a, 'report.html'), '<h1>Workspace A</h1>')
    await writeFile(join(b, 'report.html'), '<h1>Workspace B</h1>')
    await writeFile(join(base, 'secret.html'), '<h1>Outside</h1>')
    const rootA = await realpath(a)
    const rootB = await realpath(b)
    const outside = await realpath(base)
    let current = a
    const host = fakeHost({ workingDirectory: { ensure: async () => current } })
    const args = { title: 'Report', path: 'report.html' }
    const first = await host.tool.execute(args, exec('a', a))
    current = b
    const second = await host.tool.execute(args, exec('b', a))
    assert.equal(first.source?.root, rootA)
    assert.equal(second.source?.root, rootB)
    assert.equal((await host.call('lantern.file', { sessionId: 's1', callId: 'a' })).body.error?.code, 'refused')
    const currentLink = await host.call('lantern.file', { sessionId: 's1', callId: 'b' })
    assert.match((await host.file(currentLink.body.value.url)).text, /<h1>Workspace B<\/h1>/)

    const recorded = (callId: string, root: string, path = 'report.html') => [
      { type: 'tool/call', seq: 1, data: { callId, name: 'show_visual', arguments: JSON.stringify(args) } },
      { type: 'tool/result', seq: 2, data: { message: { toolCallId: callId }, meta: { lantern: 1, id: callId, status: 'shown', display: 'panel', title: 'Report', path, source: { kind: 'local', root, path } } } },
    ]
    let released = 0
    const sameDir = fakeHost({
      sessions: { get: () => ({ header: { cwd: rootA } }) },
      sessionQuery: { observeSession: async () => ({ events: recorded('a', rootA), [Symbol.dispose]() { released++ } }) },
    })
    const restored = await sameDir.call('lantern.file', { sessionId: 's1', callId: 'a' })
    assert.equal(restored.status, 200)
    assert.match((await sameDir.file(restored.body.value.url)).text, /<h1>Workspace A<\/h1>/)
    const card = await sameDir.call('lantern.visual', { sessionId: 's1', callId: 'a' })
    assert.equal(card.body.value.arguments, JSON.stringify(args))
    assert.equal(released, 2)

    const moved = fakeHost({
      sessions: { get: () => ({ header: { cwd: rootB } }) },
      sessionQuery: { observeSession: async () => ({ events: recorded('a', rootA), [Symbol.dispose]() {} }) },
    })
    assert.equal((await moved.call('lantern.file', { sessionId: 's1', callId: 'a' })).body.error?.code, 'refused')

    const crafted = fakeHost({
      sessions: { get: () => ({ header: { cwd: rootA } }) },
      sessionQuery: { observeSession: async () => ({ events: [
        { type: 'tool/call', seq: 1, data: { callId: 'evil', name: 'show_visual', arguments: JSON.stringify({ title: 'Report', path: 'secret.html' }) } },
        { type: 'tool/result', seq: 2, data: { message: { source: { callId: 'evil' } }, meta: { lantern: 1, id: 'evil', status: 'shown', display: 'panel', title: 'Report', path: 'secret.html', source: { kind: 'local', root: outside, path: 'secret.html' } } } },
      ], [Symbol.dispose]() {} }) },
    })
    assert.equal((await crafted.call('lantern.file', { sessionId: 's1', callId: 'evil' })).body.error?.code, 'refused')
  } finally { await rm(base, { recursive: true, force: true }) }
})

function recordedFolder(callId: string, root: string, path = 'index.html') {
  const args = { title: 'Report', path }
  return [
    { type: 'tool/call', seq: 1, data: { callId, name: 'show_visual', arguments: JSON.stringify(args) } },
    { type: 'tool/result', seq: 2, data: { message: { toolCallId: callId }, meta: { lantern: 1, id: callId, status: 'shown', display: 'panel', title: 'Report', path, source: { kind: 'local', root, path } } } },
  ]
}

test('a saved root that only shares a name prefix with the working directory is refused', async () => {
  const base = await mkdtemp(join(tmpdir(), 'lantern-prefix-'))
  try {
    const cwd = join(base, 'a', 'b')
    const sibling = join(base, 'a', 'bc')
    await mkdir(cwd, { recursive: true })
    await mkdir(sibling, { recursive: true })
    await writeFile(join(sibling, 'index.html'), 'sibling')
    const cwdReal = await realpath(cwd)
    const siblingReal = await realpath(sibling)
    const host = fakeHost({
      sessions: { get: () => ({ header: { cwd: cwdReal } }) },
      sessionQuery: { observeSession: async () => ({ events: recordedFolder('prefix', siblingReal), [Symbol.dispose]() {} }) },
    })
    assert.equal((await host.call('lantern.file', { sessionId: 's1', callId: 'prefix' })).body.error?.code, 'refused')
  } finally { await rm(base, { recursive: true, force: true }) }
})

test('a saved root that is a symlink pointing outside the working directory is refused', async () => {
  const base = await mkdtemp(join(tmpdir(), 'lantern-root-link-'))
  try {
    const cwd = join(base, 'work')
    const outside = join(base, 'outside')
    await mkdir(cwd)
    await mkdir(outside)
    await writeFile(join(outside, 'index.html'), 'out')
    const link = join(cwd, 'link')
    await symlink(outside, link)
    const cwdReal = await realpath(cwd)
    const host = fakeHost({
      sessions: { get: () => ({ header: { cwd: cwdReal } }) },
      sessionQuery: { observeSession: async () => ({ events: recordedFolder('root-link', link), [Symbol.dispose]() {} }) },
    })
    assert.equal((await host.call('lantern.file', { sessionId: 's1', callId: 'root-link' })).body.error?.code, 'refused')
  } finally { await rm(base, { recursive: true, force: true }) }
})

test('a saved folder is refused when the session working directory is unknown', async () => {
  const base = await mkdtemp(join(tmpdir(), 'lantern-no-session-'))
  try {
    const folder = join(base, 'site')
    await mkdir(folder)
    await writeFile(join(folder, 'index.html'), 'x')
    const root = await realpath(folder)
    const host = fakeHost({
      sessions: { get: () => undefined },
      sessionPersistence: { stat: async () => undefined },
      sessionQuery: { observeSession: async () => ({ events: recordedFolder('no-session', root), [Symbol.dispose]() {} }) },
    })
    assert.equal((await host.call('lantern.file', { sessionId: 's1', callId: 'no-session' })).body.error?.code, 'no-session')
  } finally { await rm(base, { recursive: true, force: true }) }
})

function serveFiles(): Promise<{ files: FileServer; get: (path: string) => Promise<Response>; close: () => void }> {
  const files = new FileServer()
  const server: Server = createServer((req, res) => { void files.handle(req, res) })
  return new Promise(resolve => {
    server.listen(0, '127.0.0.1', () => {
      const port = (server.address() as { port: number }).port
      resolve({
        files,
        get: (path: string) => fetch(`http://127.0.0.1:${port}${FILE_ROUTE}/${path}`),
        close: () => server.close(),
      })
    })
  })
}

test('replacing a granted folder with a symlink to an outside directory is refused', async () => {
  const base = await mkdtemp(join(tmpdir(), 'lantern-swap-'))
  const folder = join(base, 'site')
  const outside = join(base, 'outside')
  await mkdir(folder)
  await mkdir(outside)
  await writeFile(join(folder, 'index.html'), 'inside')
  await writeFile(join(outside, 'index.html'), 'outside')
  const served = await serveFiles()
  try {
    const token = served.files.grant(folder)
    assert.equal((await served.get(`${token}/index.html`)).status, 200)
    await rm(folder, { recursive: true })
    await symlink(outside, folder)
    const swapped = await served.get(`${token}/index.html`)
    assert.equal(swapped.status, 403)
    assert.equal((await swapped.text()).includes('outside'), false)
  } finally {
    served.close()
    await rm(base, { recursive: true, force: true })
  }
})

test('a symlink file inside a granted folder that points outside is refused over /lantern/files', async () => {
  const base = await mkdtemp(join(tmpdir(), 'lantern-file-link-'))
  const folder = join(base, 'site')
  await mkdir(folder)
  await writeFile(join(folder, 'style.css'), 'body{color:red}')
  await writeFile(join(base, 'secret.html'), 'secret')
  const served = await serveFiles()
  try {
    const token = served.files.grant(folder)
    await symlink(join(base, 'secret.html'), join(folder, 'leak.html'))
    const leaked = await served.get(`${token}/leak.html`)
    assert.equal(leaked.status, 403)
    assert.equal((await leaked.text()).includes('secret'), false)
    const css = await served.get(`${token}/style.css`)
    assert.equal(css.status, 200)
    assert.equal(await css.text(), 'body{color:red}')
  } finally {
    served.close()
    await rm(base, { recursive: true, force: true })
  }
})

test('an awaited workspace visual can load its source before the tool result exists', async () => {
  const base = await mkdtemp(join(tmpdir(), 'lantern-awaited-file-'))
  try {
    await writeFile(join(base, 'index.html'), '<h1>Choose a value</h1>')
    const host = fakeHost()
    const running = host.tool.execute({ title: 'Pick', path: 'index.html', await_response: true }, exec('waiting-file', base))
    const link = await host.call('lantern.file', { sessionId: 's1', callId: 'waiting-file' })
    assert.equal(link.status, 200)
    assert.match((await host.file(link.body.value.url)).text, /<h1>Choose a value<\/h1>/)
    assert.deepEqual((await host.call('lantern.respond', { sessionId: 's1', callId: 'waiting-file', response: 7 })).body.value, { status: 'settled' })
    assert.equal((await running).status, 'answered')
  } finally { await rm(base, { recursive: true, force: true }) }
})

test('PTC history restores the card and completed answers without guessing old path sources', async () => {
  const events = [
    { type: 'tool/ptc-dispatch-start', seq: 4, data: { subCallId: 'p:ptc:1', name: 'show_visual', arguments: { title: 'Pick', html: 'x', await_response: true } } },
    { type: 'tool/ptc-dispatch', seq: 5, data: { subCallId: 'p:ptc:1', name: 'show_visual', arguments: { title: 'Pick', html: 'x', await_response: true }, meta: { lantern: 1, id: 'p:ptc:1', status: 'answered', response: '1', path: 'old.html' } } },
  ]
  const host = fakeHost({ sessionQuery: { observeSession: async () => ({ events, [Symbol.dispose]() {} }) } })
  const restored = await host.call('lantern.visual', { sessionId: 's1', callId: 'p:ptc:1' })
  assert.equal(restored.body.value.seq, 4)
  assert.equal(JSON.parse(restored.body.value.arguments).await_response, true)
  assert.deepEqual((await host.call('lantern.respond', { sessionId: 's1', callId: 'p:ptc:1', response: 2 })).body.value, { status: 'answered' })
  assert.equal((await host.call('lantern.file', { sessionId: 's1', callId: 'p:ptc:1' })).body.error?.code, 'no-source')
})

test('unloading while a path resolves prevents a later answer wait', async () => {
  const base = await mkdtemp(join(tmpdir(), 'lantern-unload-'))
  try {
    await writeFile(join(base, 'index.html'), 'x')
    let finishDirectory!: (cwd: string) => void
    const directory = new Promise<string>(resolve => { finishDirectory = resolve })
    const host = fakeHost({ workingDirectory: { ensure: () => directory } })
    const running = host.tool.execute({ title: 'Pick', path: 'index.html', await_response: true }, exec('unload', base))
    for (const dispose of [...host.disposers].reverse()) dispose()
    finishDirectory(base)
    assert.equal((await running).status, 'closed')
  } finally { await rm(base, { recursive: true, force: true }) }
})

test('a second browser receives the existing answer state instead of a new submission', async () => {
  const { tool, call } = fakeHost()
  const running = tool.execute({ title: 'Pick', html: 'x', await_response: true }, exec('race'))
  const responses = await Promise.all([
    call('lantern.respond', { sessionId: 's1', callId: 'race', response: 'first' }),
    call('lantern.respond', { sessionId: 's1', callId: 'race', response: 'second' }),
  ])
  assert.deepEqual(responses.map(response => response.body.value.status), ['settled', 'answered'])
  assert.equal((await running).response, '"first"')
})

test('path rendering refuses remote or missing filesystem mappings and propagates directory cancellation', async () => {
  for (const fs of [undefined, { processPathFromHostPath: () => undefined }, { processPathFromHostPath: () => '/different/world' }]) {
    const { tool } = fakeHost({ fs })
    await assert.rejects(tool.execute({ title: 'File', path: 'index.html' }, exec('remote', '/workspace')), /host-local/)
    assert.equal((await tool.execute({ title: 'Inline', html: '<p>x</p>' }, exec('html'))).status, 'shown')
  }
  const { tool } = fakeHost({ workingDirectory: { ensure: async () => { throw new Error('directory resolution cancelled') } } })
  await assert.rejects(tool.execute({ title: 'File', path: 'index.html' }, exec('cancelled', '/workspace')), /directory resolution cancelled/)
})

test('the optional guide is user-invocable only and served without its front matter', async () => {
  const { providers } = fakeHost()
  const provider = providers[0]!() as { list(): Promise<any[]>; get(candidate: { locator: string }): Promise<any> }
  const candidates = await provider.list()
  assert.deepEqual(candidates.map(item => item.name), ['lantern-chat-ux', 'lantern-visuals'])
  const candidate = candidates.find(item => item.name === 'lantern-visuals')
  assert.equal(candidate.name, 'lantern-visuals')
  assert.ok(candidate.description.length <= 500)
  assert.equal(candidate.rank, 600)
  assert.deepEqual(candidate.invocation, { modelInvocable: false, userInvocable: true })
  const skill = await provider.get({ locator: 'lantern-visuals' })
  assert.deepEqual(skill.invocation, { modelInvocable: false, userInvocable: true })
  assert.ok(skill.content.startsWith('\n# Lantern visuals') || skill.content.startsWith('# Lantern visuals'))
  assert.equal(skill.resourceBase.kind, 'directory')
})
