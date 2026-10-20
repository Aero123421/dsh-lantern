import test from 'node:test'
import assert from 'node:assert/strict'
import { turnDefinition } from '../src/client/definition.ts'

const args = { title: 'Pick a plan', html: '<p>Plans</p>', await_response: true }
const location = { turn: 7, rootCallId: 'python-1', parentCallId: 'nested-1' }

test('a nested PTC visual retains its resolved turn and call position when it settles', () => {
  // PTC events carry ancestry, but no turn number. DSH resolves the location.
  const start = { location, event: { type: 'tool/ptc-dispatch-start', seq: 42, data: {
    rootCallId: 'python-1', parentCallId: 'nested-1', subCallId: 'visual-1', name: 'show_visual', arguments: args,
  } } }
  const finish = { location, event: { type: 'tool/ptc-dispatch', seq: 49, data: {
    ...start.event.data, content: [{ type: 'text', text: 'answered' }], isError: false,
    meta: { status: 'answered', response: '"pro"' },
  } } }
  assert.deepEqual(turnDefinition.match(start.event), { id: 'visual-1', role: 'start' })
  assert.deepEqual(turnDefinition.match(finish.event), { id: 'visual-1', role: 'update' })
  const initial = turnDefinition.start({}, start)
  const state = turnDefinition.update({ state: initial }, finish)
  const node = turnDefinition.buildViewNode({ key: 'visual-key', kind: 'lanternVisuals', id: 'visual-1', start, matches: [start, finish], state })!
  assert.equal(node.target, 'chat')
  assert.equal(node.visibility, 'hidden')
  assert.equal(node.location, location)
  assert.equal(node.anchorSeq, 42)
  assert.equal(node.data.callId, 'visual-1')
  assert.deepEqual(JSON.parse(node.data.argsRaw), args)
  assert.equal(node.data.settled, true)
  assert.deepEqual(node.data.meta, { status: 'answered', response: '"pro"' })
})

test('a PTC settlement outside its start history window can still rebuild a tail visual', () => {
  const finish = { location, event: { type: 'tool/ptc-dispatch', seq: 55, data: {
    rootCallId: 'python-1', subCallId: 'old-visual', name: 'show_visual', arguments: args,
    content: [], isError: false, meta: { status: 'shown' },
  } } }
  const node = turnDefinition.buildViewNode({ key: 'old-key', kind: 'lanternVisuals', id: 'old-visual', matches: [finish] })!
  assert.deepEqual(JSON.parse(node.data.argsRaw), args)
  assert.equal(node.data.settled, true)
  assert.equal(node.location, location)
})

test('native results preserve their call arguments and expose errors to the tail filter', () => {
  const start = { location, event: { type: 'tool/call', seq: 10, data: {
    name: 'show_visual', callId: 'native', arguments: JSON.stringify(args),
  } } }
  const finish = { location, event: { type: 'tool/result', seq: 11, data: {
    message: { source: { callId: 'native' }, isError: true, content: [{ type: 'text', text: 'Missing file' }] },
  } } }
  assert.deepEqual(turnDefinition.match(finish.event), { id: 'native', role: 'update' })
  const initial = turnDefinition.start({}, start)
  const state = turnDefinition.update({ state: initial }, finish)
  assert.equal(state.argsRaw, JSON.stringify(args))
  assert.equal(state.isError, true)
  assert.equal(state.errorText, 'Missing file')
  // An unrelated result with no visual call never materializes a card.
  assert.equal(turnDefinition.buildViewNode({ key: 'other', kind: 'lanternVisuals', id: 'native', matches: [finish] }), null)
  assert.equal(turnDefinition.match({ ...start.event, data: { ...start.event.data, name: 'read_file' } }), null)
})
