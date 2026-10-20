# Patterns

Complete starting points. Adapt freely. For drag, canvas, loops, D3 and sortable answers, see `interaction.md`; for three.js and shaders, see `3d.md`.

## Ask: choice cards (with `await_response: true`)

```html
<div class="lt-stack">
  <h3>次はどれを学びますか？</h3>
  <div class="lt-choices" data-lt-choices>
    <button class="lt-choice" data-lt-choice="bst"><b>二分探索木</b><span>同じ考え方をデータ構造で</span></button>
    <button class="lt-choice" data-lt-choice="big-o"><b>計算量 (Big-O)</b><span>なぜ半分にすると速いのか</span></button>
    <button class="lt-choice" data-lt-choice="sort"><b>ソート</b><span>二分探索の前提を作る</span></button>
  </div>
  <div class="lt-row"><button class="primary" data-lt-submit>これにする</button></div>
</div>
```

## Ask: a short form

```html
<form class="lt-stack" data-lt-form>
  <label class="lt-field"><span>プロジェクト名</span><input name="name" required placeholder="my-app"></label>
  <label class="lt-field"><span>フレームワーク</span>
    <select name="framework"><option>React</option><option>Vue</option><option>Svelte</option></select></label>
  <label><input type="checkbox" name="typescript" checked> TypeScript を使う</label>
  <div class="lt-row"><button class="primary">作成</button></div>
</form>
```

## Ask: an answer built by interaction

When the answer comes from what the user did (a ranking, a drawn region, a configured product), submit it from script, and show it again when the card comes back answered (it is re-created under your final reply):

```html
<div id="app"></div>
<div class="lt-row"><button class="primary" id="send">この内容で決定</button></div>
<script>
  const answered = lantern.state === 'answered' && lantern.response
  let value = answered ? lantern.response : (lantern.getState() || { picked: [] })
  render(value)   // your UI; on every change: value = …; lantern.setState(value)
  const send = document.getElementById('send')
  send.addEventListener('click', () => lantern.submit(value).catch((e) => showError(e.message)))
  lantern.on('state', ({ state }) => { send.disabled = state === 'answered' })
  send.disabled = !!answered
</script>
```

Keep the value small and self-describing (`{ order: [...], sprint_titles: [...], points: 8 }`): you read it back as JSON. A complete drag-and-drop ranking is in `interaction.md`.

## Explain: an explorer with a slider

```html
<div class="lt-stack">
  <div class="lt-row"><span class="lt-muted">金利</span><input type="range" id="rate" min="1" max="15" value="5" step="1" style="flex:1"><b id="rate-out" class="lt-num">5%</b></div>
  <div class="lt-grid" style="--lt-grid-min:150px">
    <div class="lt-stat"><span>10 年後</span><span id="y10">—</span></div>
    <div class="lt-stat"><span>30 年後</span><span id="y30">—</span></div>
  </div>
</div>
<script>
  const rate = document.getElementById('rate')
  function draw() {
    const r = Number(rate.value) / 100
    document.getElementById('rate-out').textContent = rate.value + '%'
    document.getElementById('y10').textContent = Math.round(100 * (1 + r) ** 10).toLocaleString() + ' 万円'
    document.getElementById('y30').textContent = Math.round(100 * (1 + r) ** 30).toLocaleString() + ' 万円'
  }
  const saved = lantern.getState()
  if (saved && saved.rate) rate.value = saved.rate
  rate.addEventListener('input', draw)
  rate.addEventListener('change', () => lantern.setState({ rate: rate.value }))   // once, when the drag ends
  draw()
</script>
```

## Compare: a chart (Chart.js)

```html
<div style="position:relative;height:260px"><canvas id="c"></canvas></div>
<!-- Chart.js has to live in this page. A CDN script src is blocked. -->
<script>
  const css = getComputedStyle(document.documentElement)   // live: reflects theme changes
  const color = (n) => css.getPropertyValue(n).trim()
  function themeChart() {
    Chart.defaults.color = color('--lt-fg-2')
    Chart.defaults.borderColor = color('--lt-border')
    Chart.defaults.font.family = color('--lt-font')
  }
  themeChart()
  const [a, b] = lantern.colors()
  const chart = new Chart(document.getElementById('c'), {
    type: 'line',
    data: { labels: ['Q1', 'Q2', 'Q3', 'Q4'], datasets: [
      { label: '計画', data: [12, 15, 18, 22], borderColor: a, backgroundColor: a },
      { label: '実績', data: [11, 16, 17, 25], borderColor: b, backgroundColor: b },
    ] },
    options: { maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } },
  })
  lantern.on('theme', () => {
    themeChart()
    const c = lantern.colors()
    chart.data.datasets.forEach((d, i) => { d.borderColor = d.backgroundColor = c[i] })
    chart.update()
  })
</script>
```

Never reload the visual (`location.reload()`) to apply a theme: the card treats a reloaded document as gone. For linked views with brushing, use D3 (see `interaction.md`).

## Explain: a stepper

```html
<div class="lt-stack" data-lt-steps>
  <section data-step><h3>1. 真ん中と比べる</h3><p>並んだリストの真ん中の値を見ます。</p></section>
  <section data-step><h3>2. 半分を捨てる</h3><p>探す値の方が大きければ、右半分だけを残します。</p></section>
  <section data-step><h3>3. くり返す</h3><p>真ん中の値が探す値になったら終わりです。</p></section>
  <div class="lt-spread"><button data-lt-prev>戻る</button><div class="lt-dots" data-lt-dots></div><button class="primary" data-lt-next>次へ</button></div>
</div>
```

## Follow-ups that keep the conversation going

```html
<div class="lt-row">
  <button class="small" data-lt-send="手順 2 をもっと詳しく説明して">手順 2 を詳しく ↗</button>
  <button class="small" data-lt-send="練習問題を 3 問出して">練習問題 ↗</button>
</div>
```

Write the text from what the user did when that helps: `lantern.send(node.name + 'について、' + prereqs.join('・') + 'とのつながりも含めて説明して')` from a selected node, or a summary of the active filters from a dashboard.

## One visual, inline and in the sidebar

Any inline card can be opened in the sidebar. `<html data-lt-mode="inline">` or `"panel"` tells your CSS which one it is:

```css
.stage { height: 420px; }
:root[data-lt-mode="panel"] .stage { height: calc(100vh - 160px); }   /* fill the sidebar */
```

## A panel app (`display: "panel"`)

```html
<!doctype html><html><head><style>
  html, body { height: 100%; }
  body { padding: 0; display: flex; flex-direction: column; overflow: hidden; }
  header { padding: 14px 18px 10px; }
  .stage { position: relative; flex: 1 1 auto; min-height: 300px; margin: 0 18px; border-radius: 14px; overflow: hidden; border: 1px solid var(--lt-border-strong); }
  footer { padding: 12px 18px 16px; display: grid; gap: 8px; }
</style></head><body>
  <header><h1 style="font-size:17px;margin:0">太陽系オーラリー</h1></header>
  <div class="stage" id="stage"></div>
  <footer><input type="range" id="time" aria-label="日付"></footer>
</body></html>
```

A dashboard can let the body scroll instead (no `overflow: hidden`, no fixed heights).

## Explainer page in the sidebar (`display: "panel"`)

Write a full document with your own typography if you like (for example a serif body with `--lt-font: var(--lt-font-serif)`), `h2` sections, figures as inline SVG or small live explorers, and a short quiz at the end using `data-lt-choices` with `data-lt-instant`.
