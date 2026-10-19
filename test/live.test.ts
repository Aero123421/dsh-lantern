import test from 'node:test'
import assert from 'node:assert/strict'
import { createLiveScripts, isLiveBirth } from '../src/client/live.ts'

test('a restored call is not a live birth, even while it is still waiting', () => {
  const pageBorn = 1_000
  assert.equal(isLiveBirth('preparing', 500, pageBorn), true)
  assert.equal(isLiveBirth('start', 1_000, pageBorn), true)
  assert.equal(isLiveBirth('start', 999, pageBorn), false)
  assert.equal(isLiveBirth('result', 500, pageBorn), false)
  assert.equal(isLiveBirth('replay', 5_000, pageBorn), false)
  assert.equal(isLiveBirth('start', undefined, pageBorn), false)
})

test('only the first live display may run, and a later open stays paused', () => {
  const queued: Array<() => void> = []
  const gate = createLiveScripts(
    (fn) => { queued.push(fn); return queued.length },
    (id) => { queued[id - 1] = () => {} },
  )
  assert.equal(gate.observe('live', true), true)
  assert.equal(gate.enabled('live'), true)
  assert.equal(gate.observe('live', false), false)
  assert.equal(gate.enabled('live'), true)
  gate.retain('live')
  gate.release('live')
  queued[0]!()
  assert.equal(gate.enabled('live'), false)
  // Seeing it again, even with a live birth, does not start it.
  assert.equal(gate.observe('live', true), false)
  assert.equal(gate.enabled('live'), false)
  gate.arm('live')
  assert.equal(gate.enabled('live'), true)
})

test('a pending card restored as start does not run until Run', () => {
  const gate = createLiveScripts()
  assert.equal(gate.observe('pending', false), true)
  assert.equal(gate.enabled('pending'), false)
  assert.equal(gate.observe('pending', true), false)
  assert.equal(gate.enabled('pending'), false)
  gate.arm('pending')
  assert.equal(gate.enabled('pending'), true)
})
