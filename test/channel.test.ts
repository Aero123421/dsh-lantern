import test from 'node:test'
import assert from 'node:assert/strict'
import { acceptConnect, childOrigin, readFrameMessage } from '../src/client/channel.ts'

const frame = { name: 'card-a' }
const other = { name: 'card-b' }
const bridge = 'bridge-a'

function connect(overrides: Record<string, unknown> = {}) {
  return acceptConnect({
    source: frame,
    origin: 'null',
    data: { __lantern: 1, type: 'connect', bridge },
    ports: [{}],
    ...overrides,
  }, { source: frame, bridge })
}

test('a port is accepted only from this frame, this bridge, and an opaque origin', () => {
  assert.equal(connect(), true)
  assert.equal(connect({ source: other }), false)
  assert.equal(connect({ origin: 'https://dsh.example' }), false)
  assert.equal(connect({ origin: '' }), false)
  assert.equal(connect({ ports: [] }), false)
  assert.equal(connect({ ports: [{}, {}] }), false)
  assert.equal(connect({ data: { __lantern: 1, type: 'connect', bridge: 'bridge-b' } }), false)
  assert.equal(connect({ data: { __lantern: 1, type: 'submit', bridge } }), false)
  assert.equal(acceptConnect({ source: frame, origin: 'null', data: { __lantern: 1, type: 'connect', bridge }, ports: [{}] }, { source: other, bridge }), false)
  assert.equal(acceptConnect({ source: null, origin: 'null', data: { __lantern: 1, type: 'connect', bridge }, ports: [{}] }, { source: undefined, bridge }), false)
})

test('the port accepts only known messages, and only an opaque child origin', () => {
  assert.equal(childOrigin('null'), true)
  assert.equal(childOrigin(''), true)
  assert.equal(childOrigin('https://dsh.example'), false)
  assert.deepEqual(readFrameMessage({ __lantern: 1, type: 'resize', height: 10 }), { type: 'resize', userAction: false })
  assert.deepEqual(readFrameMessage({ __lantern: 1, type: 'kept' }), { type: 'kept', userAction: false })
  assert.deepEqual(readFrameMessage({ __lantern: 1, type: 'submit', json: '1' }), { type: 'submit', userAction: true })
  assert.deepEqual(readFrameMessage({ __lantern: 1, type: 'send', text: 'hi' }), { type: 'send', userAction: true })
  assert.deepEqual(readFrameMessage({ __lantern: 1, type: 'expand' }), { type: 'expand', userAction: true })
  assert.deepEqual(readFrameMessage({ __lantern: 1, type: 'open-link', url: 'https://example.com' }), { type: 'open-link', userAction: true })
  assert.equal(readFrameMessage({ __lantern: 1, type: 'drive-host' }), undefined)
  assert.equal(readFrameMessage({ __lantern: 1, type: 'message-card', target: 'card-b' }), undefined)
  assert.equal(readFrameMessage({ type: 'submit' }), undefined)
  assert.equal(readFrameMessage(null), undefined)
})
