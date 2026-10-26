/** Actual sandbox runtime in Chromium; no network or model required. */
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { join, resolve } from 'node:path'
import { mkdir, writeFile } from 'node:fs/promises'
import { buildDocument } from '../../src/frame/document.ts'

const runtime = process.env.LANTERN_DSH_RUNTIME
if (!runtime) throw new Error('LANTERN_DSH_RUNTIME must contain Playwright')
const require = createRequire(join(resolve(runtime), 'package.json'))
const { chromium } = require('playwright')
const output = resolve(process.env.LANTERN_E2E_OUTPUT || '/tmp/lantern-runtime-evidence')
await mkdir(output, { recursive: true })
const browser = await chromium.launch({ headless: true,
  ...(process.env.LANTERN_CHROMIUM ? { executablePath: process.env.LANTERN_CHROMIUM } : {}),
  args: ['--no-sandbox', '--enable-unsafe-swiftshader'],
})
const checks = []
const errors = []
const geometry = {}
let formRestoration
const page = await browser.newPage({ viewport: { width: 900, height: 900 } })
page.on('pageerror', error => errors.push(String(error)))
const check = (name, result) => { assert.ok(result, name); checks.push(name) }
const capture = name => page.screenshot({path:join(output,name + '.png'),fullPage:true})
const html = `<form data-lt-form data-lt-submit-key="mod-enter" class="lt-stack">
<h3>説明の条件</h3><label class="lt-field">追加の要望<textarea name="notes" required></textarea></label>
<div class="lt-choices"><label class="lt-choice"><strong><input type="radio" name="style" value="visual" checked>図で理解する</strong><small>内容を動かして確認する</small></label><label class="lt-choice"><strong><input type="radio" name="style" value="math">数式も使う</strong><small>仕組みを詳しく確かめる</small></label></div>
<label><input name="extra" type="checkbox">追加の図解</label>
<input name="__proto__" value="own-property"><input name="constructor" value="field-value">
<input type="password" name="secret" value=""><button type="submit" name="action" value="continue" class="primary">送信</button>
</form>`
const boot = { id: 'runtime-test', bridge: 'test-bridge', state: 'waiting', response: null, scheme: 'dark', mode: 'inline', widgetState: null, streaming: false, lang: 'ja' }
async function mount(overrides = {}, markup = html, autoResize = false) {
  const doc = buildDocument(markup, { ...boot, ...overrides }, '')
  await page.setContent('<main><p>説明文の前半</p><iframe title="説明の条件" style="width:100%;height:700px;border:0" sandbox="allow-scripts allow-forms allow-downloads"></iframe><p>説明文の後半</p></main>')
  await page.evaluate(({ source, autoResize }) => {
    window.requests = []; window.messages = []; window.failNext = true
    window.addEventListener('message', event => {
      if (event.data?.type !== 'connect' || event.data?.bridge !== 'test-bridge') return
      const port = event.ports[0]; window.testPort = port
      port.onmessage = event => {
        const message = event.data; window.messages.push(message)
        if (autoResize && message.type === 'resize') document.querySelector('iframe').style.height = Math.min(2400, Math.max(24, message.height)) + 'px'
        if (message.type !== 'submit') return
        window.requests.push(message)
        const fail = window.failNext; window.failNext = false
        setTimeout(() => {
          if (!fail) port.postMessage({ __lantern: 1, type: 'state', state: 'answered', response: JSON.parse(message.json) })
          port.postMessage({ __lantern: 1, type: 'reply', id: message.id, ok: !fail, error: fail ? '接続できません。もう一度送信してください。' : undefined })
        }, 600)
      }
      port.start()
    }, { once: true })
    const frame = document.querySelector('iframe')
    if (autoResize) { frame.style.height = '120px'; frame.style.transition = 'height .12s ease' }
    frame.srcdoc = source
  }, { source: doc, autoResize })
  const frame = page.frameLocator('iframe')
  await frame.locator('body').waitFor()
  return frame
}
try {
  let frame = await mount()
  await capture('runtime-form-empty')
  await frame.getByRole('button', { name: '送信', exact: true }).click()
  check('native required validation prevents empty submit', await page.evaluate(() => requests.length) === 0)
  const notes = frame.locator('textarea')
  await notes.fill('日本語の要望')
  await notes.press('End'); await notes.press('Enter'); await notes.pressSequentially('second line')
  check('textarea Enter inserts a newline without submitting', (await notes.inputValue()).includes('\n') && await page.evaluate(() => requests.length) === 0)
  await notes.dispatchEvent('compositionstart')
  await notes.press('Control+Enter')
  check('synthetic IME composition guard prevents modifier submit', await page.evaluate(() => requests.length) === 0)
  await notes.dispatchEvent('compositionend'); await page.waitForTimeout(20)
  const value = await notes.inputValue()
  await capture('runtime-form-japanese-draft')
  await frame.getByRole('button', { name: '送信', exact: true }).click()
  check('pending submission marks form busy', await frame.locator('form').getAttribute('aria-busy') === 'true')
  check('pending submission disables submit button', await frame.getByRole('button', { name: '送信', exact: true }).isDisabled())
  await capture('runtime-form-sending')
  await notes.press('Control+Enter')
  check('duplicate submission is suppressed', await page.evaluate(() => requests.length) === 1)
  await frame.locator('[data-lt-form-status][data-error]').waitFor()
  check('failure retains typed text and reenables retry', await notes.inputValue() === value && await frame.getByRole('button', { name: '送信', exact: true }).isEnabled())
  await capture('runtime-form-error-retained-input')
  await frame.getByRole('button', { name: '送信', exact: true }).click()
  await capture('runtime-form-retrying')
  await page.waitForFunction(() => requests.length === 2)
  await page.waitForTimeout(700)
  const result = JSON.parse(await page.evaluate(() => requests[1].json))
  check('native form serializes Japanese, radio, checkbox, and submitter', result.notes === value && result.style === 'visual' && result.extra === false && result.action === 'continue')
  check('special field names are ordinary own properties', result.__proto__ === 'own-property' && result.constructor === 'field-value')
  check('successful answer locks controls and reports success', await notes.isDisabled() && (await frame.locator('[data-lt-form-status]').innerText()).includes('送信しました'))
  check('drafts are not implicitly persisted', await page.evaluate(() => messages.every(m => m.type !== 'set-state')))
  await page.screenshot({ path: join(output, 'runtime-form-answered.png'), fullPage: true })
  frame = await mount({ state: 'answered', response: { ...result, secret: 'must-not-restore' } })
  check('committed form values reconstruct from history', await frame.locator('textarea').inputValue() === value && await frame.locator('textarea').isDisabled())
  check('password fields are not restored', await frame.locator('input[type=password]').inputValue() === '')
  const checkboxForm = `<form data-lt-form class="lt-stack"><h3>Committed checkbox choices</h3>
    <label><input id="single" type="checkbox" name="single" value="weekly" checked>Newsletter</label>
    <label><input id="none-a" type="checkbox" name="none" value="a" checked>Clear group A</label>
    <label><input id="none-b" type="checkbox" name="none" value="b" checked>Clear group B</label>
    <label><input id="partial-a" type="checkbox" name="partial" value="a" checked>Partial A</label>
    <label><input id="partial-b" type="checkbox" name="partial" value="b" checked>Partial B</label>
    <label><input id="partial-c" type="checkbox" name="partial" value="c">Partial C</label>
    <label><input id="one-a" type="checkbox" name="one" value="a" checked>Single selection A</label>
    <label><input id="one-b" type="checkbox" name="one" value="b" checked>Single selection B</label>
    <label><input id="mixed-on" type="checkbox" name="mixed" checked>Mixed default value</label>
    <label><input id="mixed-custom" type="checkbox" name="mixed" value="custom" checked>Mixed custom value</label>
    <label><input id="boolean" type="checkbox" name="boolean" checked>Boolean unchecked</label>
    <input type="hidden" name="fallback" value="no"><label><input id="fallback" type="checkbox" name="fallback" value="yes" checked>Hidden fallback</label>
    <label><input id="disabled" type="checkbox" name="disabled" value="untouched" checked disabled>Disabled default</label>
    <fieldset disabled><label><input id="fieldset-disabled" type="checkbox" name="fieldset" value="untouched" checked>Disabled fieldset</label></fieldset>
    <button type="submit">Commit choices</button></form>`
  frame = await mount({}, checkboxForm)
  await capture('runtime-checkbox-defaults')
  for (const id of ['single','none-a','none-b','partial-a','one-a','boolean','fallback']) await frame.locator('#' + id).uncheck()
  await frame.locator('#partial-c').check()
  await capture('runtime-checkbox-unchecked-draft')
  await page.evaluate(() => { window.failNext = false })
  await frame.getByRole('button', { name: 'Commit choices', exact: true }).click()
  await capture('runtime-checkbox-sending')
  await page.waitForFunction(() => requests.length === 1)
  await frame.locator('[data-lt-form-status]').filter({hasText:'送信しました'}).waitFor()
  const checkboxAnswer = JSON.parse(await page.evaluate(() => requests[0].json))
  const readChecks = () => frame.locator('input[type=checkbox]').evaluateAll(items => Object.fromEntries(items.map(input => [input.id,{checked:input.checked,disabled:input.matches(':disabled')} ])))
  const committedChecks = await readChecks()
  await capture('runtime-checkbox-committed')
  frame = await mount({state:'answered',response:checkboxAnswer},checkboxForm)
  const restoredChecks = await readChecks()
  formRestoration = {answer:checkboxAnswer,committed:committedChecks,restored:restoredChecks}
  await capture('runtime-checkbox-restored')
  check('unchecked custom checkbox and all-unchecked custom group keep native FormData omissions', !Object.hasOwn(checkboxAnswer,'single') && !Object.hasOwn(checkboxAnswer,'none'))
  check('same-name checkbox arrays, boolean false and hidden fallback keep their existing wire values', JSON.stringify(checkboxAnswer.partial) === '["b","c"]' && JSON.stringify(checkboxAnswer.mixed) === '["on","custom"]' && checkboxAnswer.boolean === false && checkboxAnswer.fallback === 'no')
  check('unchecked custom checkbox is cleared and locked on settlement and history restoration', [committedChecks,restoredChecks].every(items => !items.single.checked && items.single.disabled))
  check('all-unchecked custom checkbox group stays cleared and locked after history restoration', ['none-a','none-b'].every(id => !restoredChecks[id].checked && restoredChecks[id].disabled))
  check('partially selected and multiple selected checkbox groups reconstruct every choice', !restoredChecks['partial-a'].checked && ['partial-b','partial-c','mixed-on','mixed-custom'].every(id => restoredChecks[id].checked && restoredChecks[id].disabled))
  check('one selected custom checkbox in a same-name group keeps its scalar answer', checkboxAnswer.one === 'b' && !restoredChecks['one-a'].checked && restoredChecks['one-b'].checked && restoredChecks['one-a'].disabled && restoredChecks['one-b'].disabled)
  check('unchecked boolean checkbox and hidden fallback remain unchecked after history restoration', !restoredChecks.boolean.checked && !restoredChecks.fallback.checked)
  check('disabled checkbox defaults excluded from FormData remain unchanged', ['disabled','fieldset-disabled'].every(id => !Object.hasOwn(checkboxAnswer,id === 'disabled' ? 'disabled' : 'fieldset') && restoredChecks[id].checked && restoredChecks[id].disabled))
  check('settled and restored checkbox states match', JSON.stringify(committedChecks) === JSON.stringify(restoredChecks))
  frame = await mount({state:'answered',response:{}},checkboxForm)
  const emptyAnswerChecks = await readChecks()
  check('an empty committed object clears and locks every enabled checkbox', Object.entries(emptyAnswerChecks).filter(([id]) => !['disabled','fieldset-disabled'].includes(id)).every(([,item]) => !item.checked && item.disabled))
  formRestoration.emptyAnswer = emptyAnswerChecks
  await capture('runtime-checkbox-empty-answer')
  await page.setViewportSize({width:390,height:844})
  frame = await mount({state:'answered',response:checkboxAnswer,scheme:'light'},checkboxForm)
  await capture('runtime-checkbox-restored-mobile-light')
  frame = await mount({state:'answered',response:checkboxAnswer,scheme:'dark'},checkboxForm)
  await capture('runtime-checkbox-restored-mobile-dark')
  check('restored checkbox form fits mobile width in both themes', await frame.locator('body').evaluate(body => body.scrollWidth <= body.clientWidth))
  await page.setViewportSize({width:900,height:900})
  frame = await mount({state:'answered',response:{...result,secret:'must-not-restore'}})
  await page.setViewportSize({ width: 320, height: 900 })
  const content = await frame.locator('body').evaluate(body => ({ width: body.clientWidth, scroll: body.scrollWidth, border: getComputedStyle(body).backgroundColor }))
  check('form fits 320px viewport', content.scroll <= content.width + 1)
  check('inline body is transparent', content.border === 'rgba(0, 0, 0, 0)')
  const opaque = await frame.locator('body').evaluate(() => { try { void parent.document.body; return false } catch { return true } })
  check('sandbox still prevents access to parent DOM', opaque)
  await page.screenshot({ path: join(output, 'runtime-mobile-320.png'), fullPage: true })
  const natural = '<div class="lt-stack"><h3>見出しは切れない</h3><div style="height:300px">通常のコンテンツ</div><label class="lt-field">調整<input type="range" value="50"></label></div>'
  frame = await mount({ state: 'idle' }, natural, true)
  await page.waitForTimeout(2100)
  await frame.locator('input').press('ArrowRight')
  const sizing = await frame.locator('body').evaluate(body => ({ height: body.getBoundingClientRect().height, viewport: innerHeight, scroll: scrollY, range: document.querySelector('input').getBoundingClientRect().height }))
  check('auto-height does not mistake an ordinary flex stack for a viewport app', Math.abs(sizing.height - sizing.viewport) <= 1)
  check('focusing a slider does not scroll away the heading', sizing.scroll === 0)
  check('range height is independent of vertical flex basis', sizing.range === 32)
  frame = await mount({ state: 'idle' }, '<div id="margin-label" style="margin-top:150px;height:20px">Visible label below a collapsed margin</div>', true)
  await page.waitForTimeout(2100)
  geometry.collapsedMargin = await frame.locator('#margin-label').evaluate(el => ({ bottom: el.getBoundingClientRect().bottom, viewport: innerHeight, scroll: scrollY }))
  check('collapsed top margin remains inside the auto-sized frame', geometry.collapsedMargin.bottom <= geometry.collapsedMargin.viewport && geometry.collapsedMargin.scroll === 0)
  await page.screenshot({ path: join(output, 'runtime-collapsed-margin.png'), fullPage: true })
  frame = await mount({ state: 'idle' }, '<style>body{margin:80px 0 30px}</style><div id="body-margin-label" style="height:40px">Visible label below a body margin</div>', true)
  await page.waitForTimeout(2100)
  geometry.bodyMargin = await frame.locator('#body-margin-label').evaluate(el => ({ bottom: el.getBoundingClientRect().bottom, viewport: innerHeight, scroll: scrollY }))
  check('body top margin remains inside the auto-sized frame', geometry.bodyMargin.bottom <= geometry.bodyMargin.viewport && geometry.bodyMargin.scroll === 0)
  frame = await mount({ state: 'idle' }, '<div style="height:20px;margin-bottom:150px">Trailing space</div>', true)
  await page.waitForTimeout(2100)
  geometry.trailingMargin = await frame.locator('body').evaluate(() => ({ root: document.documentElement.getBoundingClientRect().height, viewport: innerHeight }))
  check('collapsed trailing margin is preserved without a viewport floor', geometry.trailingMargin.viewport >= 170 && Math.abs(geometry.trailingMargin.root - geometry.trailingMargin.viewport) <= 1)
  frame = await mount({ state: 'idle' }, '<div style="height:100vh">Viewport-sized application</div>', true)
  await page.waitForTimeout(2100)
  const viewportApp = await frame.locator('body').evaluate(() => innerHeight)
  check('intentional viewport-sized applications receive a bounded usable height', viewportApp >= 320 && viewportApp <= 540)
  const rich = `<style>body{background:rgb(12,20,36);padding:12px}.custom{color:rgb(255,190,90)}</style><h3 class="custom">自由な描画は、そのまま。</h3><svg width="220" height="70" role="img" aria-label="SVG diagram"><circle cx="35" cy="35" r="25" fill="cyan"/><path d="M70 35H190" stroke="white" stroke-width="3"/></svg><canvas id="rich" width="240" height="140"></canvas><output id="rendered">waiting</output><script>const c=document.getElementById('rich');const gl=c.getContext('webgl2',{preserveDrawingBuffer:true});if(gl){gl.clearColor(.2,.6,.9,1);gl.clear(gl.COLOR_BUFFER_BIT);const pixel=new Uint8Array(4);gl.readPixels(10,10,1,1,gl.RGBA,gl.UNSIGNED_BYTE,pixel);document.getElementById('rendered').textContent=JSON.stringify([...pixel]);}else document.getElementById('rendered').textContent='unavailable';</script>`
  frame = await mount({ state: 'idle' }, rich)
  await frame.locator('#rendered').filter({ hasNotText: 'waiting' }).waitFor()
  check('custom SVG survives the shared kit', await frame.locator('svg circle').count() === 1)
  const style = await frame.locator('body').evaluate(el => ({ background: getComputedStyle(el).backgroundColor, padding: getComputedStyle(el).padding }))
  check('custom styles override the low-priority default surface', style.background === 'rgb(12, 20, 36)' && style.padding === '12px')
  const rendered = await frame.locator('#rendered').innerText()
  const richRendering = rendered === 'unavailable' ? { webgl2: 'unavailable in this browser' } : { webgl2: 'rendered', pixel: JSON.parse(rendered) }
  if (rendered !== 'unavailable') {
    const [red, green, blue, alpha] = richRendering.pixel
    check('WebGL2 renders and reads back pixels inside the sandbox', Math.abs(red - 51) < 2 && Math.abs(green - 153) < 2 && Math.abs(blue - 230) < 2 && alpha === 255)
  }
  await page.screenshot({ path: join(output, 'runtime-rich.png'), fullPage: true })
  check('runtime emits no uncaught browser exceptions', errors.length === 0)
  await writeFile(join(output, 'runtime-checks.json'), JSON.stringify({ checks, errors, geometry, formRestoration, richRendering, note: 'IME events are synthetic; native OS candidate windows are not automated.' }, null, 2))
  console.log(`${checks.length} Chromium runtime checks passed`)
} catch (error) {
  await page.screenshot({ path: join(output, 'runtime-failure.png'), fullPage: true }).catch(() => {})
  await writeFile(join(output, 'runtime-checks.json'), JSON.stringify({ checks, errors, geometry, formRestoration, failure: String(error) }, null, 2))
  throw error
} finally { await browser.close() }
