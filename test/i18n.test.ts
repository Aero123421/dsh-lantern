import test from 'node:test'
import assert from 'node:assert/strict'
import { copy, uiLangFrom } from '../src/client/i18n.ts'

test('Lantern follows only the document language', () => {
  assert.equal(uiLangFrom('en'), 'en')
  assert.equal(uiLangFrom('en-US'), 'en')
  assert.equal(uiLangFrom('ja'), 'ja')
  assert.equal(uiLangFrom('ja-JP'), 'ja')
  assert.equal(uiLangFrom('zh-CN'), 'zh')
  assert.equal(uiLangFrom('zh'), 'zh')
  assert.equal(uiLangFrom(''), 'en')
})

test('run, badges and the permission line are real sentences in ja, en and zh-CN', () => {
  const previous = globalThis.document
  const cases = [
    ['ja', '実行', '回答待ち', '遷移'],
    ['en', 'Run', 'Waiting for you', 'navigat'],
    ['zh-CN', '运行', '等待回答', '跳转'],
  ] as const
  try {
    for (const [lang, run, waiting, leave] of cases) {
      globalThis.document = { documentElement: { lang } } as Document
      const text = copy()
      assert.equal(text.run, run)
      assert.equal(text.waiting, waiting)
      assert.match(text.leave, new RegExp(leave))
      assert.equal(text.paused.includes('.'), lang === 'en')
    }
  } finally {
    globalThis.document = previous
  }
})
