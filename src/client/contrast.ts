/** sRGB contrast helpers; artwork colors are never changed by these functions. */
export type RGB = readonly [number, number, number]
export function luminance(rgb: RGB): number {
  const linear = rgb.map(value => {
    const c = Math.max(0, Math.min(255, value)) / 255
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * linear[0]! + 0.7152 * linear[1]! + 0.0722 * linear[2]!
}
export function contrast(a: RGB, b: RGB): number {
  const x = luminance(a), y = luminance(b)
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)
}
export function foreground(background: RGB): '#000000' | '#ffffff' {
  return contrast([0, 0, 0], background) >= contrast([255, 255, 255], background) ? '#000000' : '#ffffff'
}
/** Preserve the hue where possible; only the text token, never its fill/series, is adjusted. */
export function readable(text: RGB, background: RGB, minimum = 4.5): RGB {
  if (contrast(text, background) >= minimum) return text
  const end = foreground(background) === '#000000' ? 0 : 255
  let low = 0, high = 1
  const mix = (fraction: number) => text.map(value => Math.round(value + (end - value) * fraction)) as [number, number, number]
  for (let i = 0; i < 20; i++) {
    const middle = (low + high) / 2
    if (contrast(mix(middle), background) >= minimum) high = middle
    else low = middle
  }
  return mix(high)
}
