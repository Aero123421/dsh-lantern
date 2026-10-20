import test from 'node:test'
import assert from 'node:assert/strict'
import vm from 'node:vm'
import { frameRuntime, RESTORE_PREFIX, type FrameBoot } from '../src/frame/runtime.ts'

type Handler = (event: any) => void

function runtime(options: { name?: string; boot?: Partial<FrameBoot>; preDisabled?: boolean; active?: boolean } = {}) {
  const listeners = new Map<string, Handler[]>()
  const windowListeners = new Map<string, Handler[]>()
  const portListeners = new Map<string, Handler[]>()
  const posts: Record<string, unknown>[] = []
  const connections: Record<string, unknown>[] = []
  class ChannelMessage {
    #data: unknown
    constructor(data: unknown) { this.#data = data }
    get data() { return this.#data }
  }
  const boot: FrameBoot = { id: 'path-visual', state: 'waiting', response: null, widgetState: null, mode: 'panel', scheme: 'light', streaming: false, ...options.boot }
  const element = (attrs: Record<string, string> = {}) => ({
    disabled: false,
    getAttribute: (key: string) => attrs[key] ?? null,
    hasAttribute: (key: string) => Object.hasOwn(attrs, key),
    setAttribute: (key: string, value: string) => { attrs[key] = value },
    removeAttribute: (key: string) => { delete attrs[key] },
    toggleAttribute: (key: string, value: boolean) => { if (value) attrs[key] = ''; else delete attrs[key] },
    getBoundingClientRect: () => ({ height: 100 }),
  })
  const root = element()
  const group = {
    ...element({ 'data-lt-choices': '', 'data-lt-instant': '' }),
    parentElement: { querySelector: () => null },
    querySelectorAll: (_selector: string) => choices,
  }
  const choices = ['a', 'b'].map(value => ({
    ...element({ 'data-lt-choice': value, 'aria-pressed': 'false' }),
    closest: (selector: string): unknown => selector === '[data-lt-choice]' ? choices.find(item => item.getAttribute('data-lt-choice') === value) : selector === '[data-lt-choices]' ? group : null,
    parentElement: group,
  }))
  if (options.preDisabled) choices[1]!.disabled = true
  const parent = { postMessage: (message: Record<string, unknown>) => { connections.push(message) } }
  const location = {
    href: 'https://dsh.example/lantern/files/tok/page.html',
    origin: 'https://dsh.example', protocol: 'https:', host: 'dsh.example', hostname: 'dsh.example',
    port: '', pathname: '/lantern/files/tok/page.html', search: '', hash: '',
    assign() {}, replace() {},
  }
  const window = {
    name: options.name ?? '',
    innerHeight: 120, innerWidth: 500,
    addEventListener: (type: string, handler: Handler) => { windowListeners.set(type, [...windowListeners.get(type) ?? [], handler]) },
    removeEventListener: () => {}, dispatchEvent: () => {},
  }
  const bootNode = { textContent: JSON.stringify(boot), remove() { this.textContent = '' } }
  const document = {
    readyState: 'loading', documentElement: root, body: { scrollHeight: 100, children: [] },
    getElementById: (id: string) => id === 'lantern-boot' ? bootNode : null,
    querySelectorAll: (selector: string) => selector === '[data-lt-choices]' ? [group] : selector.startsWith('[data-lt-choice],') ? choices : [],
    addEventListener: (type: string, handler: Handler) => { listeners.set(type, [...listeners.get(type) ?? [], handler]) },
  }
  const context = vm.createContext({
    window, document, parent, location, URL, navigator: { language: 'en', userActivation: new class { get isActive() { return options.active ?? true } } },
    requestAnimationFrame: () => {}, setTimeout,
    CustomEvent: class { constructor(_type: string, _options: unknown) {} },
    MessageEvent: ChannelMessage,
    MessageChannel: class {
      port1 = {
        postMessage: (message: Record<string, unknown>) => { posts.push(message) },
        addEventListener: (type: string, handler: Handler) => { portListeners.set(type, [...portListeners.get(type) ?? [], handler]) },
        start() {},
      }
      port2 = {}
    },
  })
  vm.runInContext(`(${frameRuntime.toString()})()`, context)
  const lantern = (window as typeof window & { lantern: {
    readonly state: string; readonly response: unknown; getState(): unknown; setState(value: unknown): void; submit(value: unknown): Promise<boolean>; send(text: string): Promise<boolean>
  } }).lantern
  return {
    window, lantern, choices, posts, connections, bootNode,
    evaluate: (source: string) => vm.runInContext(source, context),
    init: () => { for (const handler of listeners.get('DOMContentLoaded') ?? []) handler({}) },
    click: (index: number) => { for (const handler of listeners.get('click') ?? []) handler({ target: choices[index], preventDefault() {} }) },
    state: (state: string, response?: unknown) => { for (const handler of portListeners.get('message') ?? []) handler(new ChannelMessage({ __lantern: 1, type: 'state', state, response })) },
  }
}

test('workspace state is available synchronously before app scripts and its bootstrap name is cleared', () => {
  const page = runtime({ name: RESTORE_PREFIX + JSON.stringify({ id: 'path-visual', bridge: 'parent-nonce', state: 'answered', response: 'a', widgetState: { step: 3, draft: 'こんにちは' } }) })
  assert.deepEqual(JSON.parse(JSON.stringify(page.lantern.getState())), { step: 3, draft: 'こんにちは' })
  assert.equal(page.lantern.state, 'answered')
  assert.equal(page.lantern.response, 'a')
  assert.equal(page.window.name, '')
  assert.equal(page.posts.length, 0) // No ready round trip was needed.
  assert.equal(page.connections.length, 1)
  assert.equal(page.connections[0]!.bridge, 'parent-nonce')
  assert.equal(page.bootNode.textContent, '')
})

test('public action methods reject a call without native activation inside the child', async () => {
  const page = runtime({ active: false })
  await assert.rejects(page.lantern.submit('forged'), /user action inside the visual/)
  await assert.rejects(page.lantern.send('forged'), /user action inside the visual/)
  assert.equal(page.posts.length, 0)
})

test('later prototype changes cannot forge activation or turn a state update into a user message', async () => {
  const page = runtime({ active: false })
  page.evaluate(`
    Object.defineProperty(Object.getPrototypeOf(navigator.userActivation), 'isActive', { get: () => true });
    Object.defineProperty(Object.prototype, '__lantern', { set(value) {
      this.type = 'send'; this.text = 'forged';
      Object.defineProperty(this, '__lantern', {value, enumerable:true});
    }});
    Object.keys = () => { throw new Error('model code intercepted Object.keys') };
    Object.defineProperty(MessageEvent.prototype, 'data', { get() { throw new Error('private endpoint exposed to a model getter') } });
    Promise = new Proxy(Promise, { construct() { throw new Error('private executor exposed to model code') } });
  `)
  page.lantern.setState({ saved: true })
  assert.equal(page.posts.length, 1)
  assert.equal(page.posts[0]!.type, 'set-state')
  assert.equal(page.posts[0]!.__lantern, 1)
  await assert.rejects(page.lantern.send('forged'), /user action inside the visual/)
  assert.equal(page.posts.length, 1)
  page.state('answered', 'a')
  assert.equal(page.lantern.state, 'answered')
})

test('workspace restoration rejects another invocation or damaged data and always consumes its name', () => {
  for (const raw of [JSON.stringify({ id: 'another-call', widgetState: { leaked: true } }), 'not json', 'x'.repeat(200_000)]) {
    const page = runtime({ name: RESTORE_PREFIX + raw, boot: { widgetState: { initial: true } } })
    assert.deepEqual(JSON.parse(JSON.stringify(page.lantern.getState())), { initial: true })
    assert.equal(page.lantern.state, 'waiting')
    assert.equal(page.window.name, '')
  }
})

test('settled instant choices keep the committed answer and update when another view answers', async () => {
  const page = runtime({ boot: { state: 'answered', response: 'a' } })
  page.init()
  assert.equal(page.choices[0]!.getAttribute('aria-pressed'), 'true')
  assert.equal(page.choices[1]!.getAttribute('aria-pressed'), 'false')
  assert.equal(page.choices[1]!.disabled, true)
  page.click(1)
  assert.equal(page.choices[0]!.getAttribute('aria-pressed'), 'true')
  assert.equal(page.choices[1]!.getAttribute('aria-pressed'), 'false')
  assert.equal(page.posts.some(post => post.type === 'submit'), false)
  await assert.rejects(page.lantern.submit('b'), /already settled/)
  page.state('answered', 'b')
  assert.equal(page.choices[0]!.getAttribute('aria-pressed'), 'false')
  assert.equal(page.choices[1]!.getAttribute('aria-pressed'), 'true')
})

test('a timeout allows a late choice without enabling controls disabled by the page', () => {
  const page = runtime({ boot: { state: 'closed' }, preDisabled: true })
  page.init()
  page.state('timeout')
  assert.equal(page.choices[0]!.disabled, false)
  assert.equal(page.choices[1]!.disabled, true)
  page.click(0)
  assert.equal(page.posts.some(post => post.type === 'submit' && post.json === '"a"'), true)
})

test('a rejected state value does not replace the last valid widget state', () => {
  const page = runtime({ boot: { widgetState: { valid: true } } })
  const circular: { self?: unknown } = {}
  circular.self = circular
  assert.throws(() => page.lantern.setState(circular), /not JSON-serializable/)
  assert.deepEqual(JSON.parse(JSON.stringify(page.lantern.getState())), { valid: true })
  assert.equal(page.posts.some(post => post.type === 'set-state'), false)
})
