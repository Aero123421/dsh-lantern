import test from 'node:test'
import assert from 'node:assert/strict'
import { uiLangFrom } from '../src/client/i18n.ts'

test('Lantern follows only the document language', () => {
  assert.equal(uiLangFrom('en'), 'en')
  assert.equal(uiLangFrom('en-US'), 'en')
  assert.equal(uiLangFrom('ja'), 'ja')
  assert.equal(uiLangFrom('ja-JP'), 'ja')
  assert.equal(uiLangFrom('zh-CN'), 'zh')
  assert.equal(uiLangFrom('zh'), 'zh')
  assert.equal(uiLangFrom(''), 'en')
})
