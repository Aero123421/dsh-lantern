import assert from 'node:assert/strict'
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

/** Continue the real official DSH session; all interactions use the rendered UI. */
export async function scenarios({ page, context, output, capture, errors }) {
  const checks = []
  const check = (name, value) => { assert.ok(value, name); checks.push(name) }
  const visual = () => page.locator('.lantern-tail')
  const child = () => visual().frameLocator('iframe')
  const composer = () => page.locator('[contenteditable="true"]').first()
  async function send(text) {
    await composer().click()
    await composer().pressSequentially(text, { delay: 10 })
    await page.getByRole('button', { name: 'Send message', exact: true }).click()
  }
  async function completed() {
    await page.getByText('この図や入力は会話の中に残ります。', { exact: false }).first().waitFor({ state: 'visible', timeout: 30000 })
  }
  async function dimensions(name) {
    const values = await child().locator('body').evaluate(body => ({
      viewport: innerHeight, content: body.getBoundingClientRect().height,
      scroll: scrollY, width: body.clientWidth, scrollWidth: body.scrollWidth,
      rangeHeight: document.querySelector('input[type=range]')?.getBoundingClientRect().height,
      theme: document.documentElement.dataset.theme,
    }))
    await writeFile(join(output, name + '-dimensions.json'), JSON.stringify(values, null, 2))
    return values
  }
  try {
    const answer = page.getByText('この図や入力は会話の中に残ります。', { exact: false }).first()
    const tailBelowAnswer = await visual().evaluate(tail => {
      const answer = [...document.querySelectorAll('[data-chat-flow-kind="assistant-step"]')]
        .find(el => el.textContent.includes('この図や入力は会話の中に残ります。'))
      return !!answer && !!(answer.compareDocumentPosition(tail) & Node.DOCUMENT_POSITION_FOLLOWING)
    })
    check('visual appears below the final answer, not between assistant steps', tailBelowAnswer)
    check('the complete final explanation is visible without opening process details', await answer.isVisible())
    check('no standalone visual node is registered in the conversation flow', await page.locator('[data-chat-flow-kind="lanternVisuals"]').count() === 0)
    check('inline wrapper has no enclosing border', await visual().locator('.lantern-card').evaluate(el => getComputedStyle(el).borderTopWidth === '0px'))
    const size = await dimensions('dsh-light')
    check('normal content fits without clipped heading or internal focus scroll', size.scroll === 0 && size.content <= size.viewport + 1)
    check('range stays compact inside a vertical field', size.rangeHeight <= 40)
    await capture('dsh-light')

    await page.emulateMedia({ colorScheme: 'dark' })
    await child().locator('html[data-theme="dark"]').waitFor()
    check('DSH dark theme propagates into the iframe', true)
    check('embedding frame and document use the same dark scheme', await visual().locator('iframe').evaluate(el => getComputedStyle(el).colorScheme) === 'dark')
    await capture('dsh-dark')
    await page.setViewportSize({ width: 390, height: 844 })
    await visual().scrollIntoViewIfNeeded()
    await page.waitForTimeout(500)
    const mobile = await dimensions('dsh-mobile')
    check('390px layout has no horizontal overflow inside the visual', mobile.scrollWidth <= mobile.width + 1)
    await capture('dsh-mobile')
    await page.setViewportSize({ width: 1440, height: 1050 })
    await page.emulateMedia({ colorScheme: 'light' })
    await child().locator('html[data-theme="light"]').waitFor()

    await page.reload({ waitUntil: 'domcontentloaded' })
    await visual().locator('iframe[data-scripts="off"]').waitFor({ state: 'visible', timeout: 30000 })
    check('history reconstruction does not automatically execute scripts', await visual().count() === 1)
    await visual().getByRole('button', { name: 'Run', exact: true }).click()
    await child().locator('#gap').waitFor()
    check('explicit Run restores saved exploration state', await child().locator('#gap').inputValue() === '181')
    await visual().getByRole('button', { name: 'Open in sidebar', exact: true }).click()
    await page.locator('.lantern-panel iframe').waitFor({ state: 'visible' })
    check('sidebar expansion retains current slider state', await page.locator('.lantern-panel').frameLocator('iframe').locator('#gap').inputValue() === '181')
    await capture('dsh-expanded')
    await page.getByRole('button', { name: 'Collapse right sidebar', exact: true }).click()

    await page.getByRole('button', { name: 'New session', exact: true }).first().click()
    await send('Ask me using a form. FORM')
    const waiting = page.locator('.lantern-tool .lantern-card[data-state="waiting"]')
    const pendingForm = waiting.frameLocator('iframe')
    await pendingForm.locator('textarea').waitFor({ state: 'visible', timeout: 30000 })
    check('awaited form remains available in the tool row before the model continues', await waiting.count() === 1)
    const notes = pendingForm.locator('textarea')
    await notes.fill('図を中心に、日本語で説明してください。')
    await notes.press('End'); await notes.press('Enter'); await notes.pressSequentially('Extra detail')
    check('textarea newline does not submit the awaited form', await notes.isEnabled() && (await notes.inputValue()).includes('\n'))
    await pendingForm.locator('input[value="math"]').check()
    const submitted = await notes.inputValue()
    await capture('dsh-form-input')
    await pendingForm.getByRole('button', { name: 'この内容で続ける', exact: true }).click()
    await completed()
    await child().locator('textarea:disabled').waitFor()
    check('form answer reaches the real DSH waiting tool and resumes the model', await child().locator('textarea').inputValue() === submitted)
    check('form settlement moves to the final-answer tail without a duplicate tool frame', await visual().count() === 1 && await visual().locator('iframe').count() === 1 && await page.locator('.lantern-tool iframe').count() === 0)
    await capture('dsh-form-answered')
    await page.reload({ waitUntil: 'domcontentloaded' })
    await visual().locator('iframe[data-scripts="off"]').waitFor({ state: 'visible', timeout: 30000 })
    await visual().getByRole('button', { name: 'Run', exact: true }).click()
    await child().locator('textarea:disabled').waitFor()
    check('answered form reconstructs its text and selected option from DSH history', await child().locator('textarea').inputValue() === submitted && await child().locator('input[value="math"]').isChecked())

    await composer().click(); await composer().pressSequentially('/lantern-', { delay: 50 })
    await page.getByText('lantern-chat-ux', { exact: false }).first().waitFor()
    const menu = await page.locator('body').innerText()
    check('both bundled guides appear in the live DSH skill menu', menu.includes('lantern-chat-ux') && menu.includes('lantern-visuals'))
    await composer().press('Escape'); await composer().fill('')
    await page.getByRole('button', { name: 'Plugins', exact: true }).click()
    await page.getByText('dsh-lantern', { exact: true }).first().click()
    const automatic = page.getByRole('switch', { name: 'Use conversation visuals automatically', exact: true })
    const advanced = page.getByRole('switch', { name: 'Enable the advanced visual guide', exact: true })
    await automatic.waitFor()
    check('both guide switches start enabled', await automatic.getAttribute('aria-checked') === 'true' && await advanced.getAttribute('aria-checked') === 'true')
    await automatic.click()
    await page.waitForFunction(() => [...document.querySelectorAll('[role=switch]')].some(el => el.getAttribute('aria-checked') === 'false'))
    check('turning off chat guidance leaves the advanced guide enabled', await advanced.getAttribute('aria-checked') === 'true')
    await advanced.click()
    await page.waitForTimeout(500)
    await capture('dsh-settings-off')
    check('both guide settings can be turned off', await automatic.getAttribute('aria-checked') === 'false' && await advanced.getAttribute('aria-checked') === 'false')
    await page.getByRole('button', { name: 'New session', exact: true }).first().click()
    await composer().click(); await composer().pressSequentially('/lantern-', { delay: 50 })
    await page.waitForTimeout(500)
    const disabledMenu = await page.locator('body').innerText()
    check('disabled guides disappear from a new session skill catalog', !disabledMenu.includes('lantern-chat-ux') && !disabledMenu.includes('lantern-visuals'))
    await composer().press('Escape'); await composer().fill('')
    await send('Explicitly show the visual. WAVE')
    await child().locator('#gap').waitFor({ state: 'visible', timeout: 30000 })
    await completed()
    const requests = (await readFile(join(output, 'model.jsonl'), 'utf8')).trim().split('\n').map(line => JSON.parse(line))
    const latest = requests.at(-1)
    check('guides off removes automatic system guidance but leaves show_visual available', latest.automatic === false && latest.tools.includes('show_visual'))
    await capture('dsh-guides-off-runtime-on')
    // Chromium reports the inherited CSP directive and deliberately paused
    // historical boot scripts; preserve these diagnostics in the report.
    const expectedWarnings = [
      "Unrecognized Content-Security-Policy directive 'navigate-to'.",
      "Blocked script execution in 'about:srcdoc' because the document's frame is sandboxed and the 'allow-scripts' permission is not set.",
    ]
    const unexpected = errors.filter(message => !expectedWarnings.includes(message))
    check('no unexpected browser errors during the complete DSH flow', unexpected.length === 0)
  } finally {
    await writeFile(join(output, 'integration-checks.json'), JSON.stringify({ checks, errors, model: 'deterministic fixture, not a live model quality benchmark' }, null, 2))
  }
  console.log(`${checks.length} real DSH integration checks passed`)
}
