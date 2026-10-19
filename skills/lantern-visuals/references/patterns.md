# Patterns

Complete, working starting points. Adapt freely.

## Ask: choice cards (with `await_response: true`)

```html
<div class="lt-stack">
  <h3>Which topic next?</h3>
  <div class="lt-choices" data-lt-choices>
    <button class="lt-choice" data-lt-choice="bst"><b>Binary search trees</b><span>The same idea as a data structure</span></button>
    <button class="lt-choice" data-lt-choice="big-o"><b>Big-O</b><span>Why halving is fast</span></button>
    <button class="lt-choice" data-lt-choice="sort"><b>Sorting</b><span>What binary search needs first</span></button>
  </div>
  <div class="lt-row"><button class="primary" data-lt-submit>Continue</button></div>
</div>
```

## Ask: a short form

```html
<form class="lt-stack" data-lt-form>
  <label class="lt-field"><span>Project name</span><input name="name" required placeholder="my-app"></label>
  <label class="lt-field"><span>Framework</span>
    <select name="framework"><option>React</option><option>Vue</option><option>Svelte</option></select></label>
  <label><input type="checkbox" name="typescript" checked> Use TypeScript</label>
  <div class="lt-row"><button class="primary">Create</button></div>
</form>
```

## Explain: an explorer with a slider

```html
<div class="lt-stack">
  <div class="lt-row"><span class="lt-muted">Rate</span><input type="range" id="rate" min="1" max="15" value="5" step="1" style="flex:1"><b id="rate-out" class="lt-num">5%</b></div>
  <div class="lt-grid" style="--lt-grid-min:150px">
    <div class="lt-stat"><span>After 10 years</span><span id="y10">—</span></div>
    <div class="lt-stat"><span>After 30 years</span><span id="y30">—</span></div>
  </div>
</div>
<script>
  const rate = document.getElementById('rate')
  function draw() {
    const r = Number(rate.value) / 100
    document.getElementById('rate-out').textContent = rate.value + '%'
    document.getElementById('y10').textContent = Math.round(100 * (1 + r) ** 10).toLocaleString() + ' 万円'
    document.getElementById('y30').textContent = Math.round(100 * (1 + r) ** 30).toLocaleString() + ' 万円'
    lantern.setState({ rate: rate.value })
  }
  const saved = lantern.getState()
  if (saved && saved.rate) rate.value = saved.rate
  rate.addEventListener('input', draw)
  draw()
</script>
```

## Compare: a chart (Chart.js)

```html
<div style="position:relative;height:260px"><canvas id="c"></canvas></div>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4"></script>
<script>
  const css = getComputedStyle(document.documentElement)
  const color = n => css.getPropertyValue(n).trim()
  const [a, b] = lantern.colors()
  Chart.defaults.color = color('--lt-fg-2')
  Chart.defaults.borderColor = color('--lt-border')
  Chart.defaults.font.family = color('--lt-font')
  new Chart(document.getElementById('c'), {
    type: 'line',
    data: { labels: ['Q1', 'Q2', 'Q3', 'Q4'], datasets: [
      { label: 'Plan', data: [12, 15, 18, 22], borderColor: a, backgroundColor: a },
      { label: 'Actual', data: [11, 16, 17, 25], borderColor: b, backgroundColor: b },
    ] },
    options: { maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } },
  })
</script>
```

## Explain: a stepper

```html
<div class="lt-stack" data-lt-steps>
  <section data-step><h3>1. Compare with the middle</h3><p>Look at the middle item of the sorted list.</p></section>
  <section data-step><h3>2. Drop half</h3><p>If the target is larger, keep only the right half.</p></section>
  <section data-step><h3>3. Repeat</h3><p>Stop when the middle item is the target.</p></section>
  <div class="lt-spread"><button data-lt-prev>Back</button><div class="lt-dots" data-lt-dots></div><button class="primary" data-lt-next>Next</button></div>
</div>
```

## Follow-ups that keep the conversation going

```html
<div class="lt-row">
  <button class="small" data-lt-send="Explain step 2 in more detail">Step 2 in detail ↗</button>
  <button class="small" data-lt-send="Give me three practice questions">Practice ↗</button>
</div>
```

## Explainer page in the sidebar (`display: "panel"`)

Write a full document with your own typography if you like (for example a serif body with `--lt-font: var(--lt-font-serif)`), sections with `h2`, figures as inline SVG, and a short quiz at the end using `data-lt-choices` with `data-lt-instant`.
