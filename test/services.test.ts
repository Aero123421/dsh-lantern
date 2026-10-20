import test from 'node:test'
import assert from 'node:assert/strict'
import { answer, bind, fetchVisual, workspaceUrl } from '../src/client/services.ts'
import { readLocal, upsert, writeLocal } from '../src/client/store.ts'

function replaceGlobal(t: test.TestContext, name: string, value: unknown): void {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, name)
  Object.defineProperty(globalThis, name, { configurable: true, value })
  t.after(() => {
    if (descriptor) Object.defineProperty(globalThis, name, descriptor)
    else Reflect.deleteProperty(globalThis, name)
  })
}

test('forks can answer copied call ids independently, with one answer per session', async () => {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    get() { throw new Error('Storage denied') },
  })
  try {
    const sent: { sessionId: string; text: string }[] = []
    const pending: (() => void)[] = []
    bind({ sessions: { scope: (sessionId: string) => ({
      get: () => ({ send: (text: string) => new Promise<void>(resolve => {
        sent.push({ sessionId, text })
        pending.push(resolve)
      }) }),
    }) } })
    for (const sessionId of ['original', 'fork']) {
      upsert('shared-answer', { sessionId, args: { title: sessionId, html: 'x', display: 'inline', await: false } })
    }
    const first = answer('shared-answer', 'original', 'one')
    const second = answer('shared-answer', 'fork', 'two')
    assert.deepEqual(sent.map(item => item.sessionId), ['original', 'fork'])
    assert.match(sent[0]!.text, /original: one$/)
    assert.match(sent[1]!.text, /fork: two$/)
    await assert.rejects(answer('shared-answer', 'original', 'duplicate'), /already answered/)
    for (const finish of pending) finish()
    await Promise.all([first, second])
    assert.equal(readLocal('shared-answer', 'original').answer, '"one"')
    assert.equal(readLocal('shared-answer', 'fork').answer, '"two"')
    await assert.rejects(answer('shared-answer', 'original', 'duplicate'), /already answered/)
    assert.equal(sent.length, 2)
  } finally {
    bind({})
    if (descriptor) Object.defineProperty(globalThis, 'localStorage', descriptor)
    else Reflect.deleteProperty(globalThis, 'localStorage')
  }
})

test('only a confirmed timeout turns a waiting answer into a user message', async t => {
  replaceGlobal(t, 'document', { baseURI: 'https://dsh.example/app/', documentElement: { lang: 'en' } })
  replaceGlobal(t, 'navigator', {})
  replaceGlobal(t, 'localStorage', { getItem() { return null }, setItem() { throw new Error('denied') } })
  let status = 'unknown'
  replaceGlobal(t, 'fetch', async () => ({ ok: true, json: async () => ({ ok: true, value: { status } }) }))
  const sent: string[] = []
  bind({ sessions: { scope: () => ({ get: () => ({ send: async (text: string) => { sent.push(text) } }) }) } })
  t.after(() => bind({}))
  for (status of ['answered', 'dismissed', 'closed', 'unknown', 'not-waiting', 'settled', 'timeout']) {
    const callId = 'terminal-' + status
    upsert(callId, { sessionId: 'terminal', args: { title: 'Pick', html: 'x', display: 'inline', await: true } })
    if (status === 'settled' || status === 'timeout') {
      await answer(callId, 'terminal', status)
      assert.equal(readLocal(callId, 'terminal').answer, JSON.stringify(status))
    } else {
      await assert.rejects(answer(callId, 'terminal', 'duplicate'), /already answered|no longer waiting/)
      assert.equal(readLocal(callId, 'terminal').answer, undefined)
    }
  }
  assert.equal(sent.length, 1)
  assert.match(sent[0]!, /Pick: timeout$/)
})

test('a tab rechecks the answer after acquiring its browser lock', async t => {
  let enter: (() => Promise<void>) | undefined
  let lockName = ''
  replaceGlobal(t, 'navigator', { locks: { request: (name: string, callback: () => Promise<void>) => {
    lockName = name
    return new Promise<void>((resolve, reject) => { enter = () => callback().then(resolve, reject) })
  } } })
  const values = new Map<string, string>()
  replaceGlobal(t, 'localStorage', {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value) },
  })
  let sends = 0
  bind({ sessions: { scope: () => ({ get: () => ({ send: async () => { sends++ } }) }) } })
  t.after(() => bind({}))
  upsert('locked', { sessionId: 'tabs', args: { title: 'Pick', html: 'x', display: 'inline', await: false } })
  const pending = answer('locked', 'tabs', 'second')
  const rejected = assert.rejects(pending, /already answered/)
  assert.match(lockName, /^dsh-lantern:answer:/)
  assert.equal(sends, 0)
  // The first tab commits its answer before this tab's lock is released.
  writeLocal('locked', { answer: '"first"' }, 'tabs')
  await enter!()
  await rejected
  assert.equal(sends, 0)
  assert.equal(readLocal('locked', 'tabs').answer, '"first"')
})

test('denied Web Locks retain the page-local fallback without retrying a failed send', async t => {
  replaceGlobal(t, 'localStorage', { getItem() { throw new Error('denied') }, setItem() { throw new Error('denied') } })
  const securityError = Object.assign(new Error('denied'), { name: 'SecurityError' })
  let allowed = false
  replaceGlobal(t, 'navigator', { locks: { request: async (_name: string, callback: () => Promise<void>) => {
    if (!allowed) throw securityError
    return callback()
  } } })
  let sends = 0
  bind({ sessions: { scope: () => ({ get: () => ({ send: async () => {
    sends++
    if (allowed) throw securityError
  } }) }) } })
  t.after(() => bind({}))
  for (const callId of ['denied-lock', 'failed-send']) upsert(callId, { sessionId: 'locks', args: { title: 'Pick', html: 'x', display: 'inline', await: false } })
  await answer('denied-lock', 'locks', 'saved in memory')
  assert.equal(readLocal('denied-lock', 'locks').answer, '"saved in memory"')
  allowed = true
  await assert.rejects(answer('failed-send', 'locks', 'failed'), /denied/)
  assert.equal(sends, 2)
})

test('workspace and history requests identify the recorded invocation without a caller-provided path', async t => {
  replaceGlobal(t, 'document', { baseURI: 'https://dsh.example/app/', documentElement: { lang: 'en' } })
  const calls: { url: string; data: unknown }[] = []
  replaceGlobal(t, 'fetch', async (url: URL, options: RequestInit) => {
    calls.push({ url: url.href, data: JSON.parse(String(options.body)) })
    return { ok: true, json: async () => ({ ok: true, value: url.pathname.endsWith('lantern.file')
      ? { url: '/lantern/entry/index.html' } : { arguments: '{"path":"original/index.html"}', seq: 5 } }) }
  })
  assert.equal(await workspaceUrl('session', 'call'), 'https://dsh.example/lantern/entry/index.html')
  assert.equal((await fetchVisual('session', 'call')).seq, 5)
  assert.deepEqual(calls.map(item => item.data), [{ sessionId: 'session', callId: 'call' }, { sessionId: 'session', callId: 'call' }])
  assert.match(calls[0]!.url, /api\/lantern.file$/)
  assert.match(calls[1]!.url, /api\/lantern.visual$/)
})
