import test from 'node:test'
import assert from 'node:assert/strict'
import { Config, INTERACTIVE_PROMPT, registerPrompt } from '../src/host/prompt.ts'

function enabled(value: unknown): boolean {
  return typeof value === 'object' && value !== null && 'get' in value ? Boolean((value as { get(): boolean }).get()) : value !== false
}

test('a 0.2.1 config keeps its numbers and defaults automatic visuals on', () => {
  const saved = Config({ answerTimeoutMinutes: 20, maxHtmlChars: 1000 })
  assert.equal(saved.answerTimeoutMinutes, 20)
  assert.equal(saved.maxHtmlChars, 1000)
  assert.equal(enabled(saved.automaticVisuals), true)
  assert.equal(enabled(Config({}).automaticVisuals), true)
  assert.equal(enabled(Config({ automaticVisuals: false }).automaticVisuals), false)
})

test('the prompt section is fixed text, registered once, and empty when the setting or the tool is gone', () => {
  const sections: Array<{ name: string; order: number; interpolate: false; text(context: { scope?: unknown }): string }> = []
  const ctx = {
    tools: { get(name: string) { return name === 'show_visual' ? {} : undefined } },
    systemPrompt: { section(section: typeof sections[number]) { sections.push(section); return () => {} } },
  }
  const on = Config({})
  registerPrompt(ctx, on)
  registerPrompt(ctx, on)
  assert.equal(sections.length, 1)
  const section = sections[0]!
  assert.equal(section.name, 'ui:lantern-interactive')
  assert.equal(section.order, 10110)
  assert.equal(section.interpolate, false)
  const scope = { html: '<script>secret</script>', path: '/tmp/secret.html' }
  assert.equal(section.text({ scope }), INTERACTIVE_PROMPT)
  assert.equal(section.text({ scope }).includes('secret'), false)
  assert.equal(section.text({ scope }).includes('<'), false)
  const off = {
    tools: ctx.tools,
    systemPrompt: ctx.systemPrompt,
  }
  registerPrompt(off, Config({ automaticVisuals: false }))
  assert.equal(sections.length, 2)
  assert.equal(sections[1]!.text({}), '')
  const uninstalled = {
    tools: { get() { return undefined } },
    systemPrompt: ctx.systemPrompt,
  }
  registerPrompt(uninstalled, Config({}))
  assert.equal(sections.at(-1)!.text({}), '')
})


test('model guidance does not prescribe an interleaved conversation layout', async () => {
  const { readFile } = await import('node:fs/promises')
  const { toolDescription } = await import('../src/host/description.ts')
  const guides = await Promise.all(['lantern-chat-ux', 'lantern-visuals'].map(name =>
    readFile(new URL(`../skills/${name}/SKILL.md`, import.meta.url), 'utf8')))
  for (const text of [INTERACTIVE_PROMPT, toolDescription(15), ...guides]) {
    assert.doesNotMatch(text, /tool.call position|native conversation (?:node|position)|before and after|explanation, visual, then|prose\s*→\s*visual|Markdown paragraph/i)
  }
})
