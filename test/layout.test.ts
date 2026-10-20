import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

/** The rule body for `selector {`, treating parentheses so `rgba()` does not end the block. */
function rule(css: string, selector: string): string {
  const marker = `${selector} {`
  const start = css.indexOf(marker)
  assert.ok(start >= 0, selector)
  let depth = 1
  let paren = 0
  let i = start + marker.length
  while (i < css.length && depth > 0) {
    const ch = css[i++]!
    if (ch === '(') paren++
    else if (ch === ')' && paren > 0) paren--
    else if (paren === 0 && ch === '{') depth++
    else if (paren === 0 && ch === '}') depth--
  }
  return css.slice(start, i)
}

test('card chrome stays inside 320px and 390px widths', () => {
  const css = readFileSync(new URL('../src/client/style.css', import.meta.url), 'utf8')
  assert.match(rule(css, '.lantern-card'), /max-width:\s*100%/)
  assert.match(rule(css, '.lantern-tool'), /max-width:\s*100%/)
  assert.match(rule(css, '.lantern-row'), /max-width:\s*100%/)
  assert.match(rule(css, '.lantern-head'), /flex-wrap:\s*wrap/)
  const narrow = rule(css, '@media (max-width: 390px)')
  assert.match(narrow, /max-width:\s*100%/)
  assert.match(narrow, /white-space:\s*normal/)
  assert.match(narrow, /overflow-wrap:\s*anywhere/)
})
