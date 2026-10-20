# Interactive visuals

Building blocks for visuals people drag, scrub and play with. Each one is taken from a visual that runs in a Lantern card. Plain JS, no build step.

## Size: inline or panel

- An inline card grows to its content, up to 2400 px. Give stages a fixed height (`height: 400px`) or an `aspect-ratio`. Never size inline content by the frame: no `100vh`, no `height: 100%` chains, no `window.innerHeight`. That is the card's own height. Lantern pins such pages to about 460 px, but they look cramped.
- A panel fills the sidebar. Use `html, body { height: 100% }` and a flex column, with the stage at `flex: 1 1 auto; min-height: 0`. Use `overflow: hidden` on `body` for app-like pages; a long dashboard can scroll.
- Keep inline visuals about one screen tall (400–600 px). Wide or long tools go in a panel.
- One document holds your fragment, so namespace your classes. A generic `.top` or `.active` collides with state classes you add from JS.

## Theme colors in JS

Canvas, WebGL and SVG attributes need concrete colors. A token may be `color-mix(…)` or `var(…)`, so let the browser resolve it:

```js
const probe = document.createElement('i'); probe.style.display = 'none'; document.body.append(probe)
const pix = document.createElement('canvas').getContext('2d', { willReadFrequently: true })
function token(name) {            // '--lt-fg' → '#rrggbb'
  probe.style.color = 'var(' + name + ')'
  pix.clearRect(0, 0, 1, 1); pix.fillStyle = getComputedStyle(probe).color; pix.fillRect(0, 0, 1, 1)
  const d = pix.getImageData(0, 0, 1, 1).data
  return '#' + [d[0], d[1], d[2]].map((v) => v.toString(16).padStart(2, '0')).join('')
}
const dark = () => document.documentElement.dataset.theme === 'dark'
lantern.on('theme', () => { /* re-read tokens, recolor, redraw */ })
```

`lantern.colors()` returns the 8 series colors as hex strings, ready for data. CSS-drawn parts (stages, overlays, labels) can stay in plain `var(--lt-*)` and follow the theme by themselves. In DSH, `--lt-accent` is black or white, so use the series colors for color.

## Canvas at device pixel ratio

```js
const canvas = document.getElementById('c'), ctx = canvas.getContext('2d')
let W = 0, H = 0
function fit() {
  const r = canvas.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2)
  canvas.width = Math.round(r.width * d); canvas.height = Math.round(r.height * d)
  ctx.setTransform(d, 0, 0, d, 0, 0)      // draw in CSS pixels from here on
  W = r.width; H = r.height
  draw()
}
new ResizeObserver(fit).observe(canvas)
matchMedia('(resolution: ' + devicePixelRatio + 'dppx)').addEventListener('change', fit)   // moved to another screen
```

Give the canvas its size in CSS (`width: 100%; height: 360px`); the backing store follows.

## An animation loop that rests

Run frames only while something moves and the card is on screen. `lantern.visible` is false when the card is scrolled away, folded or in a hidden tab. Clamp `dt`: after a pause, the first frame would otherwise jump.

```js
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
let raf = 0, last = performance.now(), playing = !reduced
function kick() { if (!raf && lantern.visible) raf = requestAnimationFrame(frame) }
function frame(now) {
  raf = 0
  const dt = Math.min(0.05, (now - last) / 1000); last = now
  const moving = step(dt)                // your update; true while it still changes
  draw()
  if (playing || moving) kick()
}
lantern.on('visibility', (v) => { if (v) { last = performance.now(); kick() } })
```

Call `kick()` from every input handler. Timers (`setInterval`) keep running offscreen, so check `lantern.visible` in them too. For physics, use a fixed substep (`dt / Math.ceil(dt / (1/480))`) with RK4 or Verlet so the result does not depend on the frame rate.

With `prefers-reduced-motion`, start paused, skip decorative motion (confetti, auto-rotate, easing) and keep everything the user drives.

## Pointer drag

Use pointer events with capture, so the drag keeps working when the pointer leaves the card. Treat a press as a click only if it barely moved.

```js
let drag = null
el.addEventListener('pointerdown', (e) => {
  drag = { x0: e.clientX, y0: e.clientY, moved: false }
  el.setPointerCapture(e.pointerId)
})
el.addEventListener('pointermove', (e) => {
  if (!drag) { el.style.cursor = hitTest(e) ? 'grab' : 'default'; return }
  if (!drag.moved && Math.hypot(e.clientX - drag.x0, e.clientY - drag.y0) < 4) return
  drag.moved = true
  moveTo(local(e))                            // local(e): e.clientX - rect.left, …
})
el.addEventListener('pointerup', (e) => {
  if (drag && !drag.moved) onClick(local(e))
  drag = null
  save()                                      // lantern.setState once, at the end of a gesture
})
```

- On a canvas or stage you drag on, set `touch-action: none`. Leave it at `auto` on everything else so touch scrolling still works.
- Hit areas of about 24 px around small handles. Show `grab` and `grabbing` cursors.
- Snap to clean values near them (`Math.abs(v - Math.round(v * 2) / 2) < 0.09`) so numbers read well.

## Wheel and scrolling

In an inline card, Lantern holds wheel events back from the visual's own handlers. They reach the visual after the user clicks into it (until the pointer leaves it), or while Ctrl/⌘ is held, which covers pinch zoom. Otherwise the chat scrolls and the card shows a short "click first" hint. OrbitControls, `d3.zoom` and map libraries just work. Don't build your own gating, and don't `preventDefault` wheel events on `window`. In a panel the wheel goes straight to the visual.

## Keyboard

Make the main controls reachable: give a stage `tabindex="0"`, handle keys there, and call `preventDefault()` for the keys you use (arrows otherwise scroll the chat). Announce changes in an `aria-live` region.

## D3: force graph, drag, zoom

```js
const sim = d3.forceSimulation(nodes)
  .force('link', d3.forceLink(links).id((d) => d.id).distance(60))
  .force('charge', d3.forceManyBody().strength(-220))
  .force('collide', d3.forceCollide().radius((d) => Math.max(d.r + 10, d.labelWidth / 2 + 4)))
  .stop()
for (let i = 0; i < 300; i++) sim.tick()     // settle before the first paint: no jumping on load
sim.on('tick', ticked)
node.call(d3.drag()
  .on('start', (e, d) => { if (!e.active) sim.alphaTarget(0.25).restart(); d.fx = d.x; d.fy = d.y })
  .on('drag', (e, d) => { d.fx = e.x; d.fy = e.y })
  .on('end', (e, d) => { if (!e.active) sim.alphaTarget(0) /* keep fx/fy: the node stays pinned */ }))
node.on('dblclick', (e, d) => { d.fx = d.fy = null; sim.alpha(0.3).restart() })
const zoom = d3.zoom().scaleExtent([0.4, 3]).on('zoom', (e) => root.attr('transform', e.transform))
svg.call(zoom).on('dblclick.zoom', null)
lantern.on('visibility', (v) => (v ? sim.alpha() > sim.alphaMin() && sim.restart() : sim.stop()))
```

- Measure labels (`text.getComputedTextLength()`) and include them in the collide radius.
- Seed the start positions (a small LCG instead of `Math.random`) so the same layout comes back after a reload.
- Dim on hover with `opacity` on links, not `stroke-opacity`, so arrow markers fade too.

Brushing: `d3.brushX()` or `d3.brush()` on top of a chart. With linked views, each view filters by every brush except its own. A view being brushed keeps its DOM (redrawing it would drop the brush); restore a saved range with `g.call(brush.move, [x0, x1])`.

## A sortable list that answers

Use pointer events, not HTML5 drag-and-drop (that has no touch support and fights the iframe). Keep everything in one array, render from it, and animate with transforms.

```js
let order = (lantern.state === 'answered' && lantern.response) ? lantern.response.order
  : (lantern.getState() || {}).order || ITEMS.map((x) => x.id)
let drag = null
list.addEventListener('pointerdown', (e) => {
  const row = e.target.closest('li'); if (!row || lantern.state === 'answered') return
  const rows = [...list.children]
  drag = { row, from: rows.indexOf(row), to: rows.indexOf(row), y0: e.clientY, rows, rects: rows.map((r) => r.getBoundingClientRect()) }
  row.setPointerCapture(e.pointerId)
})
list.addEventListener('pointermove', (e) => {
  if (!drag) return
  const { rows, rects, from } = drag, dy = e.clientY - drag.y0, mid = (rects[from].top + rects[from].bottom) / 2 + dy
  drag.row.style.transform = 'translateY(' + dy + 'px)'; drag.row.classList.add('lifted')
  let to = from
  rects.forEach((r, j) => { const c = (r.top + r.bottom) / 2; if (j < from && mid < c) to = Math.min(to, j); if (j > from && mid > c) to = Math.max(to, j) })
  const h = rects[from].height + 6                       // row height + gap
  rows.forEach((r, j) => { if (j !== from) r.style.transform = to > from && j > from && j <= to ? 'translateY(' + -h + 'px)' : to < from && j >= to && j < from ? 'translateY(' + h + 'px)' : '' })
  drag.to = to
})
list.addEventListener('pointerup', () => {
  if (!drag) return
  const { from, to } = drag; drag = null
  order.splice(to, 0, order.splice(from, 1)[0])
  render(); lantern.setState({ order })                    // render() rebuilds the rows without transforms
})
send.addEventListener('click', () => lantern.submit({ order }))   // with await_response: true
lantern.on('state', ({ state }) => { send.disabled = state === 'answered' })
```

Give the rows `transition: transform .2s`, and the lifted row `transition: none` with a shadow. Add a keyboard path: Space picks a row up, the arrows move it, Space drops it. When the card is shown again after the answer (under the final reply), render `lantern.response`, not the default order.

## Saving a file

A download link with a `blob:` URL saves a file; the sandbox allows downloads.

```js
canvas.toBlob((blob) => {
  const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: 'chart.png' })
  document.body.append(a); a.click(); a.remove()
  setTimeout(() => URL.revokeObjectURL(a.href), 4000)
}, 'image/png')
```

For WebGL, render a frame and call `toBlob` in the same task (the drawing buffer is not kept), or create the context with `preserveDrawingBuffer: true`.

## Fullscreen

`<button data-lt-fullscreen>⛶</button>` toggles fullscreen for the whole visual. Let the stage grow while it lasts:

```css
:root:fullscreen body { padding: 16px; }
:root:fullscreen .stage { height: calc(100vh - 120px); }
```

## State that survives

- Treat saved inputs as a convenience: storage is best effort in this browser, with no cross-device sync. Provide usable defaults if `getState()` is empty. Storage limits or clearing browser data may remove earlier state.
- Restore from `lantern.getState()` before the first render. Save at the end of a gesture (`pointerup`, OrbitControls `end`, the brush `end`), or throttled to about 4 per second. Never save on every `pointermove`.
- The card is created again when the turn ends (it moves under the final answer), on reload, and in the sidebar. Save what makes the view yours: selection, camera, filters, parameters. Leave out transient simulation state.
- After an answer, render from `lantern.response` and lock the inputs.

## Pitfalls

- A `ResizeObserver` callback that changes the layout of what it observes: redraw in `requestAnimationFrame`.
- Many SVG nodes (more than about 3000) or per-frame DOM rebuilds: switch to canvas.
- Very small text in canvases: draw at DPR and use the theme font (`getComputedStyle(document.body).fontFamily`).
- Use real data or say "サンプル" / "架空". Never present invented numbers as facts.
