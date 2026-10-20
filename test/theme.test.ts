import test from 'node:test'
import assert from 'node:assert/strict'
import { onTheme, theme } from '../src/client/theme.ts'

test('returning to visuals reads theme changes made while no visual was mounted', t => {
  let dark = false
  const descriptors = new Map<string, PropertyDescriptor | undefined>()
  const globals: Record<string, unknown> = {
    document: { body: { hasAttribute: () => dark }, documentElement: {} },
    getComputedStyle: () => ({ getPropertyValue: () => '' }),
    MutationObserver: class { observe() {} disconnect() {} },
    window: {},
  }
  for (const [name, value] of Object.entries(globals)) {
    descriptors.set(name, Object.getOwnPropertyDescriptor(globalThis, name))
    Object.defineProperty(globalThis, name, { configurable: true, value })
  }
  t.after(() => {
    for (const [name, descriptor] of descriptors) {
      if (descriptor) Object.defineProperty(globalThis, name, descriptor)
      else Reflect.deleteProperty(globalThis, name)
    }
  })
  assert.equal(theme().scheme, 'light')
  const unmount = onTheme(() => {})
  unmount()
  dark = true
  assert.equal(theme().scheme, 'dark')
  // A change between render and the subscription effect is delivered too.
  dark = false
  const observed: string[] = []
  const stop = onTheme(value => observed.push(value.scheme))
  assert.deepEqual(observed, ['light'])
  stop()
})
