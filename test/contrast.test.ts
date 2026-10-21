import test from 'node:test'
import assert from 'node:assert/strict'
import { contrast, foreground, luminance, readable, type RGB } from '../src/client/contrast.ts'

test('sRGB contrast and luminance have the expected endpoints', () => {
  assert.equal(luminance([0, 0, 0]), 0)
  assert.equal(luminance([255, 255, 255]), 1)
  assert.equal(contrast([0, 0, 0], [255, 255, 255]), 21)
  assert.equal(contrast([90, 100, 110], [90, 100, 110]), 1)
})

test('button foreground chooses a readable pair, including the old mid-tone failure', () => {
  assert.equal(foreground([111, 149, 255]), '#000000')
  for (let r = 0; r <= 255; r += 17) for (let g = 0; g <= 255; g += 17) for (let b = 0; b <= 255; b += 17) {
    const background: RGB = [r, g, b]
    const value = foreground(background) === '#000000' ? 0 : 255
    assert.ok(contrast([value, value, value], background) >= 4.5)
  }
})

test('semantic text is readable without changing an already readable color', () => {
  const white: RGB = [255, 255, 255], black: RGB = [0, 0, 0]
  assert.equal(readable(black, white), black)
  for (const background of [white, black, [23, 24, 28], [100, 120, 150]] as RGB[]) {
    for (const text of [[111, 149, 255], [19, 134, 91], [240, 180, 76], [180, 180, 180]] as RGB[]) {
      const copy = [...text]
      assert.ok(contrast(readable(text, background), background) >= 4.5)
      assert.deepEqual(text, copy, 'artwork/fill token is not mutated')
    }
  }
})
