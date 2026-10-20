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
    ['ja', '実行', '回答待ち', '許可したフォルダ'],
    ['en', 'Run', 'Waiting for you', 'allowed folder'],
    ['zh-CN', '运行', '等待回答', '文件夹'],
  ] as const
  try {
    for (const [lang, run, waiting, leave] of cases) {
      globalThis.document = { documentElement: { lang } } as Document
      const text = copy()
      assert.equal(text.run, run)
      assert.equal(text.waiting, waiting)
      assert.match(text.leave, new RegExp(leave))
      assert.equal(text.paused.includes('.'), lang === 'en')
      for (const [key, value] of Object.entries(text)) {
        assert.notEqual(value, key, key)
        assert.notEqual(value.trim(), '')
        // ja and zh must not leave the identifier in the sentence. English may use the same word.
        if (lang !== 'en') assert.equal(value.includes(key), false, key)
      }
    }
    const settings = copy('ja')
    assert.equal(settings.automaticVisuals, '会話内ビジュアルを自動で使う')
    assert.equal(copy('zh-CN').automaticVisuals, '自动使用对话可视化')
    assert.equal(copy('en-US').run, 'Run')
  } finally {
    globalThis.document = previous
  }
})
