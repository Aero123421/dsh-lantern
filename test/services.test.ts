import test from 'node:test'
import assert from 'node:assert/strict'
import { answer, bind } from '../src/client/services.ts'
import { readLocal, upsert } from '../src/client/store.ts'

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
