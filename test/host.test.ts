import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { apply, type VisualResult } from '../src/host/index.ts'

interface Tool {
  name: string
  description: string
  output: { render(args: unknown, value: VisualResult): { text: string }[]; presentationMeta(args: unknown, value: VisualResult): Record<string, unknown> }
  execute(args: unknown, exec: unknown): Promise<VisualResult>
}

function fakeHost() {
  const tools: Tool[] = []
  const routes = new Map<string, (request: Request) => Promise<Response>>()
  const providers: (() => unknown)[] = []
  const disposers: (() => unknown)[] = []
  const ctx = {
    tools: { register: (tool: Tool) => { tools.push(tool) } },
    connection: { fetch: { register: (route: { path: string; fetch: (r: Request) => Promise<Response> }) => { routes.set(route.path, route.fetch); return () => routes.delete(route.path) } } },
    get: () => undefined,
    inject(deps: string[], callback: (scope: unknown) => void) {
      if (deps[0] === 'skills') callback({ ...ctx, skills: { registerProvider: (factory: () => unknown) => providers.push(factory) } })
    },
    effect(execute: () => unknown) { const dispose = execute(); if (typeof dispose === 'function') disposers.push(dispose as () => unknown) },
    on() {},
  }
  apply(ctx, { answerTimeoutMinutes: 0.001 })
  const call = async (method: string, payload: unknown) => {
    const response = await routes.get(`/api/${method}`)!(new Request('http://x/api/' + method, { method: 'POST', body: JSON.stringify(payload), headers: { 'content-type': 'application/json' } }))
    return { status: response.status, body: await response.json() as { ok: boolean; value?: any; error?: { code: string } } }
  }
  return { tool: tools[0]!, call, providers, disposers }
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
  const shown = await tool.execute({ title: ' Chart ', html: '<p>x</p>', replace: 'old' }, exec('a'))
  assert.deepEqual(shown, { id: 'a', status: 'shown', display: 'inline', title: 'Chart', replace: 'old' })
  assert.match(tool.output.render({}, shown)[0]!.text, /shown inline in the chat \(id: a\)/)
  assert.equal(tool.output.presentationMeta({}, shown).lantern, 1)
})

test('an awaited visual returns the answer posted through the route', async () => {
  const { tool, call } = fakeHost()
  const running = tool.execute({ title: 'Pick', html: '<p>x</p>', await_response: true }, exec('b'))
  await new Promise(resolve => setTimeout(resolve, 5))
  assert.deepEqual((await call('lantern.waiting', { sessionId: 's1', callId: 'b' })).body.value, { waiting: true })
  assert.deepEqual((await call('lantern.respond', { sessionId: 's1', callId: 'b', response: { plan: 'pro' } })).body.value, { status: 'settled' })
  const result = await running
  assert.equal(result.status, 'answered')
  assert.equal(result.response, '{"plan":"pro"}')
  assert.match(tool.output.render({}, result)[0]!.text, /The user answered visual b/)
  assert.deepEqual((await call('lantern.respond', { sessionId: 's1', callId: 'b', response: 1 })).body.value, { status: 'not-waiting' })
  assert.equal((await call('lantern.respond', { response: 1 })).status, 400)
  assert.equal((await call('lantern.respond', { sessionId: 's1', callId: 'b', response: 'x'.repeat(70_000) })).body.error?.code, 'too-large')
})

test('skip and timeout end the wait', async () => {
  const { tool, call } = fakeHost()
  const skipped = tool.execute({ title: 'Pick', html: 'x', await_response: true }, exec('c'))
  await new Promise(resolve => setTimeout(resolve, 5))
  // Another session's call with the same id is not this one.
  assert.deepEqual((await call('lantern.dismiss', { sessionId: 'other', callId: 'c' })).body.value, { status: 'not-waiting' })
  await call('lantern.dismiss', { sessionId: 's1', callId: 'c' })
  assert.equal((await skipped).status, 'dismissed')
  const timedOut = await tool.execute({ title: 'Pick', html: 'x', await_response: true }, exec('d'))
  assert.equal(timedOut.status, 'timeout')
})

test('path visuals resolve inside the working directory and open in the panel', async () => {
  const base = await mkdtemp(join(tmpdir(), 'lantern-host-'))
  try {
    await mkdir(join(base, 'r'))
    await writeFile(join(base, 'r', 'index.html'), '<p>x</p>')
    const { tool, call } = fakeHost()
    const shown = await tool.execute({ title: 'Report', path: './r/index.html' }, exec('e', base))
    assert.deepEqual(shown, { id: 'e', status: 'shown', display: 'panel', title: 'Report', path: 'r/index.html' })
    await assert.rejects(tool.execute({ title: 'x', path: '../etc/x.html' }, exec('f', base)), /outside/)
    const file = await call('lantern.file', { sessionId: 's1', path: 'r/index.html' })
    assert.match(file.body.value.url, /^lantern\/files\/[\w-]+\/index\.html$/)
    assert.equal((await call('lantern.file', { sessionId: 'unknown', path: 'r/index.html' })).body.error?.code, 'no-session')
  } finally { await rm(base, { recursive: true, force: true }) }
})

test('the skill is served without its front matter', async () => {
  const { providers } = fakeHost()
  const provider = providers[0]!() as { list(): Promise<any[]>; get(): Promise<any> }
  const [candidate] = await provider.list()
  assert.equal(candidate.name, 'lantern-visuals')
  assert.ok(candidate.description.length <= 500)
  assert.equal(candidate.rank, 600)
  const skill = await provider.get()
  assert.ok(skill.content.startsWith('\n# Lantern visuals') || skill.content.startsWith('# Lantern visuals'))
  assert.equal(skill.resourceBase.kind, 'directory')
})
