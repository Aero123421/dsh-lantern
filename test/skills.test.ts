import test from 'node:test'
import assert from 'node:assert/strict'
import { skillProvider } from '../src/host/skills.ts'
import { Config, INTERACTIVE_PROMPT, isEnabled, type Config as Configuration } from '../src/host/prompt.ts'

test('both guides are bundled but only the small chat guide is model-invocable', async () => {
  const provider = skillProvider()
  const guides = await provider.list()
  assert.deepEqual(guides.map(item => item.name), ['lantern-chat-ux', 'lantern-visuals'])
  assert.deepEqual(guides.map(item => item.invocation.modelInvocable), [true, false])
  assert.ok(guides.every(item => item.invocation.userInvocable && item.rank === 600))
  assert.ok(guides.every(item => !('content' in item)))
  const chat = await provider.get(guides[0]!)
  assert.ok(chat?.content.includes('No skill loading'))
  assert.ok(chat?.resourceBase.path.endsWith('skills/lantern-chat-ux/'))
  assert.ok(INTERACTIVE_PROMPT.length < 1400)
  assert.ok(INTERACTIVE_PROMPT.includes('No skill loading'))
})

test('guide switches are independent and stale candidates cannot load disabled guides', async () => {
  const config: Configuration = { automaticVisuals: true, advancedVisuals: true }
  const provider = skillProvider(config)
  const [chat, advanced] = await provider.list()
  config.automaticVisuals = false
  assert.equal(provider.refresh(), true)
  assert.equal(provider.refresh(), false)
  assert.deepEqual((await provider.list()).map(item => item.name), ['lantern-visuals'])
  assert.equal(await provider.get(chat!), undefined)
  assert.ok(await provider.get(advanced!))
  config.advancedVisuals = false
  assert.equal(provider.refresh(), true)
  assert.deepEqual(await provider.list(), [])
  assert.equal(await provider.get(advanced!), undefined)
  config.automaticVisuals = true
  assert.equal(provider.refresh(), true)
  assert.deepEqual((await provider.list()).map(item => item.name), ['lantern-chat-ux'])
})

test('volatile getters are read live; unrelated settings do not invalidate catalogs', async () => {
  let automatic = true
  const config: Configuration = { automaticVisuals: { get: () => automatic }, advancedVisuals: false }
  const provider = skillProvider(config)
  config.answerTimeoutMinutes = 10
  assert.equal(provider.refresh(), false)
  automatic = false
  assert.equal(provider.refresh(), true)
  assert.deepEqual(await provider.list(), [])
  for (const locator of ['../prompt.ts', 'unknown', '', 3, null]) {
    assert.equal(await provider.get({ locator }), undefined)
  }
})

test('existing configurations acquire a default-enabled advanced guide', () => {
  const config = Config({ automaticVisuals: false })
  assert.equal(isEnabled(config.automaticVisuals), false)
  assert.equal(isEnabled(config.advancedVisuals), true)
})
