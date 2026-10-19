import test from 'node:test'
import assert from 'node:assert/strict'
import { PendingResponses } from '../src/host/pending.ts'

// Waiting timers are unref'd on purpose; keep the test process alive meanwhile.
const keepAlive = setInterval(() => {}, 1000)
test.after(() => clearInterval(keepAlive))

test('an answer settles the waiting call', async () => {
  const pending = new PendingResponses()
  const waiting = pending.wait('c1', 's1', new AbortController().signal, 60_000)
  assert.equal(pending.isWaiting('c1'), true)
  assert.equal(pending.sessionOf('c1'), 's1')
  assert.equal(pending.settle('c1', { kind: 'answered', response: '"a"' }), 'settled')
  assert.deepEqual(await waiting, { kind: 'answered', response: '"a"' })
  assert.equal(pending.isWaiting('c1'), false)
  assert.equal(pending.settle('c1', { kind: 'dismissed' }), 'answered')
  assert.equal(pending.status('c1'), 'answered')
  assert.equal(pending.status('missing'), 'unknown')
})

test('waiting ends with timeout', async () => {
  const pending = new PendingResponses()
  assert.deepEqual(await pending.wait('c2', undefined, new AbortController().signal, 10), { kind: 'timeout' })
  assert.equal(pending.isWaiting('c2'), false)
  assert.equal(pending.settle('c2', { kind: 'answered', response: 'late' }), 'timeout')
})

test('cancelling the call closes it', async () => {
  const pending = new PendingResponses()
  const abort = new AbortController()
  const waiting = pending.wait('c3', undefined, abort.signal, 60_000)
  abort.abort()
  assert.deepEqual(await waiting, { kind: 'closed' })
  const aborted = new AbortController()
  aborted.abort()
  assert.deepEqual(await pending.wait('c4', undefined, aborted.signal, 60_000), { kind: 'closed' })
})

test('a second wait for the same call closes the first; closeAll releases everything', async () => {
  const pending = new PendingResponses()
  const first = pending.wait('c5', undefined, new AbortController().signal, 60_000)
  const second = pending.wait('c5', undefined, new AbortController().signal, 60_000)
  assert.deepEqual(await first, { kind: 'closed' })
  const other = pending.wait('c6', undefined, new AbortController().signal, 60_000)
  pending.closeAll()
  assert.deepEqual(await second, { kind: 'closed' })
  assert.deepEqual(await other, { kind: 'closed' })
  assert.deepEqual(await pending.wait('after-unload', 's1', new AbortController().signal, 60_000), { kind: 'closed' })
  assert.equal(pending.status('after-unload'), 'closed')
  assert.equal(pending.isWaiting('after-unload'), false)
})
