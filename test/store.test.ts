import test from 'node:test'
import assert from 'node:assert/strict'
import { getRecord, inTail, markTail, readLocal, replacementOf, upsert, visualKey, visualState, watchLocalStorage, writeLocal } from '../src/client/store.ts'

const storageDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
test.afterEach(() => {
  if (storageDescriptor) Object.defineProperty(globalThis, 'localStorage', storageDescriptor)
  else Reflect.deleteProperty(globalThis, 'localStorage')
})

function setStorage(value: unknown): void {
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value })
}

const args = (title: string, replace?: string) => ({ title, html: '<p>x</p>', display: 'inline' as const, await: true, ...replace ? { replace } : {} })

test('replacement links reach the terminal revision beyond twenty hops in their session', async () => {
  for (const sessionId of ['chain-original', 'chain-fork']) {
    const length = sessionId === 'chain-original' ? 1000 : 22
    for (let i = 0; i <= length; i++) {
      upsert(`r${i}`, { sessionId, seq: i, args: args(`Revision ${i}`, i ? `r${i - 1}` : undefined), result: { status: 'shown' } })
    }
  }
  await Promise.resolve()
  for (const i of [0, 1, 19, 20, 21, 999]) assert.equal(replacementOf(`r${i}`, 'chain-original'), 'r1000')
  assert.equal(replacementOf('r0', 'chain-fork'), 'r22')
  assert.equal(replacementOf('r1000', 'chain-original'), undefined)
  assert.equal(replacementOf('r0', 'absent-session'), undefined)
})

test('two- and three-node cycles terminate without hiding their cards', async () => {
  upsert('a', { sessionId: 'cycle', args: args('A', 'b'), seq: 1 })
  upsert('b', { sessionId: 'cycle', args: args('B', 'a'), seq: 2 })
  upsert('self', { sessionId: 'cycle', args: args('Self', 'self') })
  await Promise.resolve()
  for (const id of ['a', 'b', 'self']) assert.equal(replacementOf(id, 'cycle'), undefined)
  upsert('c', { sessionId: 'cycle', args: args('C', 'b'), seq: 3 })
  upsert('a', { sessionId: 'cycle', args: args('A', 'c'), seq: 4 })
  await Promise.resolve()
  for (const id of ['a', 'b', 'c']) assert.equal(replacementOf(id, 'cycle'), undefined)
})

test('failed replacements leave the latest successful revision available', async () => {
  upsert('first', { sessionId: 'failed-chain', seq: 1, args: args('First') })
  upsert('second', { sessionId: 'failed-chain', seq: 2, args: args('Second', 'first'), result: { status: 'shown' } })
  upsert('failed', { sessionId: 'failed-chain', seq: 3, args: args('Failed', 'second'), error: 'fixture failure' })
  await Promise.resolve()
  assert.equal(replacementOf('first', 'failed-chain'), 'second')
  assert.equal(replacementOf('second', 'failed-chain'), undefined)
  upsert('third', { sessionId: 'failed-chain', seq: 4, args: args('Retry', 'second'), result: { status: 'shown' } })
  await Promise.resolve()
  assert.equal(replacementOf('first', 'failed-chain'), 'third')
})

test('forked sessions keep records, replacements and tail placement separate', async () => {
  const callId = 'copied-call'
  upsert(callId, { sessionId: 'original', args: args('Original'), seq: 1 })
  upsert(callId, { sessionId: 'fork', args: args('Fork'), seq: 1 })
  upsert('new-call', { sessionId: 'original', args: args('Revision', callId), seq: 2 })
  await Promise.resolve()
  assert.equal(getRecord(callId, 'original')?.args?.title, 'Original')
  assert.equal(getRecord(callId, 'fork')?.args?.title, 'Fork')
  assert.equal(replacementOf(callId, 'original'), 'new-call')
  assert.equal(replacementOf(callId, 'fork'), undefined)
  const unmount = markTail(callId, 'original')
  assert.equal(inTail(callId, 'original'), true)
  assert.equal(inTail(callId, 'fork'), false)
  unmount()
  assert.equal(inTail(callId, 'original'), false)
  assert.notEqual(visualKey('c', 'a:b'), visualKey('b:c', 'a'))
})

test('answers and widget state survive unavailable storage without crossing sessions', () => {
  setStorage({
    getItem() { throw new Error('Storage denied') },
    setItem() { throw new Error('Storage denied') },
  })
  const callId = 'blocked-storage'
  writeLocal(callId, { answer: '{"plan":"pro"}' }, 'original')
  writeLocal(callId, { state: '{"step":2}', collapsed: true }, 'original')
  assert.equal(readLocal(callId, 'original').answer, '{"plan":"pro"}')
  assert.equal(readLocal(callId, 'original').state, '{"step":2}')
  assert.equal(readLocal(callId, 'original').collapsed, true)
  assert.deepEqual(readLocal(callId, 'fork'), {})
  assert.deepEqual(visualState({ callId, sessionId: 'original', args: args('Pick') }, 'start'), {
    state: 'answered', response: { plan: 'pro' },
  })
  assert.equal(visualState({ callId, sessionId: 'fork', args: args('Pick') }, 'start').state, 'waiting')
})

test('a full storage quota does not restore stale widget state', () => {
  setStorage({
    getItem() { return '{"state":"old"}' },
    setItem() { throw new Error('Quota exceeded') },
  })
  writeLocal('full-storage', { state: 'new' }, 'session')
  assert.equal(readLocal('full-storage', 'session').state, 'new')
})

test('malformed stored JSON is ignored', () => {
  for (const raw of ['null', '[]', '42', '"text"', 'not json']) {
    setStorage({ getItem() { return raw } })
    assert.deepEqual(readLocal('invalid-storage', 'session'), {})
  }
})

test('available storage still picks up answers written by another tab', () => {
  const values = new Map<string, string>()
  setStorage({
    get length() { return values.size },
    key(index: number) { return [...values.keys()][index] ?? null },
    getItem(key: string) { return values.get(key) ?? null },
    setItem(key: string, value: string) { values.set(key, value) },
  })
  writeLocal('other-tab', { state: '{"step":1}' }, 'session')
  const key = [...values.keys()][0]!
  values.set(key, '{"state":"{\\"step\\":1}","answer":"true"}')
  assert.equal(readLocal('other-tab', 'session').answer, 'true')
})

test('storage events discard a superseded fallback and unsubscribe on plugin disposal', t => {
  let listener: ((event: { key: string | null }) => void) | undefined
  let removed = false
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'window')
  Object.defineProperty(globalThis, 'window', { configurable: true, value: {
    addEventListener: (_name: string, callback: typeof listener) => { listener = callback },
    removeEventListener: (_name: string, callback: typeof listener) => { removed = callback === listener },
  } })
  t.after(() => {
    if (descriptor) Object.defineProperty(globalThis, 'window', descriptor)
    else Reflect.deleteProperty(globalThis, 'window')
  })
  setStorage({ getItem() { throw new Error('denied') }, setItem() { throw new Error('denied') } })
  writeLocal('storage-event', { state: 'old' }, 'session')
  const stop = watchLocalStorage()
  listener!({ key: 'unrelated-plugin' })
  assert.equal(readLocal('storage-event', 'session').state, 'old')
  setStorage({ getItem() { return '{"state":"new","answer":"true"}' } })
  listener!({ key: 'dsh-lantern:v1:' + visualKey('storage-event', 'session') })
  assert.equal(readLocal('storage-event', 'session').state, 'new')
  assert.equal(readLocal('storage-event', 'session').answer, 'true')
  stop()
  assert.equal(removed, true)
})
