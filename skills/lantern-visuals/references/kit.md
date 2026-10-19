# Lantern kit

Every inline or panel visual (not `path` files) starts with the kit stylesheet and the current DSH theme. The kit is a starting point: override any token on `:root` in your own `<style>`, load your own fonts, or ignore the components. Your styles always win over the kit, whatever their specificity.

## Tokens

Typography
- `--lt-font` (body font, defaults to `--lt-font-sans`), `--lt-font-sans`, `--lt-font-serif`, `--lt-font-mono`
- `--lt-text-xs` 12, `-sm` 13, `-md` 14 (body), `-lg` 16, `-xl` 20, `-2xl` 26, `-3xl` 34 (px)
- `--lt-leading` 1.65, `--lt-weight-regular` 400, `--lt-weight-strong` 600

Color (follows DSH light and dark automatically)
- Surfaces: `--lt-bg`, `--lt-surface`, `--lt-surface-2`
- Text: `--lt-fg`, `--lt-fg-2` (secondary), `--lt-fg-3` (hints)
- Lines: `--lt-border`, `--lt-border-strong`
- Roles: `--lt-accent`, `--lt-accent-fg` (text on accent), `--lt-accent-soft`, and `--lt-success`, `--lt-warning`, `--lt-danger`, each with `-soft`
- Data series: `--lt-series-1` … `--lt-series-8` (use in order for categories; `lantern.colors()` returns them as an array for chart libraries)

Shape, space, depth, motion
- `--lt-radius-sm` 6, `--lt-radius` 10, `--lt-radius-lg` 14, `--lt-radius-full`
- `--lt-space-1` 4, `-2` 8, `-3` 12, `-4` 16, `-5` 24, `-6` 32, `-7` 48
- `--lt-shadow-sm`, `--lt-shadow`, `--lt-ease`, `--lt-dur`

The document root carries `data-theme="light"` or `"dark"`. To define your own palette for both:

```html
<style>
  :root { --lt-accent: #c2410c; --lt-font: "Zen Maru Gothic", sans-serif; }
  :root[data-theme="dark"] { --lt-accent: #fb923c; }
</style>
<link href="https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@400;700&display=swap" rel="stylesheet">
```

## Base styles

`h1`–`h4`, `p`, `a`, `code`, `pre`, `kbd`, `table`, `hr`, `button`, `input`, `select`, `textarea`, range, checkbox and radio are styled already. Write bare tags.

## Components

| Class | Use |
|---|---|
| `lt-stack`, `lt-row`, `lt-spread`, `lt-grid` (`--lt-grid-min`), `lt-center`, `lt-pad` | layout |
| `lt-card` (`.soft`, `.raised`) | a bounded box |
| `lt-btn` / `button` (`.primary`, `.ghost`, `.danger`, `.small`) | buttons |
| `lt-badge` (`.accent`, `.ok`, `.warn`, `.bad`) | short status labels |
| `lt-callout` (`.info`, `.ok`, `.warn`, `.bad`) | notes and results |
| `lt-chip` | small toggles; selected with `aria-pressed="true"` |
| `lt-choices` + `lt-choice` | option cards (`<b>` title, `<span>` detail) |
| `lt-field`, `lt-error` | a labelled input and its error line |
| `lt-stat` | metric: label line, then a big number line |
| `lt-progress` | `<div class="lt-progress"><i style="--value:40%"></i></div>` |
| `lt-kv` | key-value list (alternate `<span>`s) |
| `lt-tabs` | tab set, see the api reference |
| `lt-dots` | step indicator for steppers |
| `lt-muted`, `lt-faint`, `lt-mono`, `lt-serif`, `lt-num`, `lt-fade-in` | text helpers |

Size guide for inline visuals: the card is about 640–760 px wide in the chat and the full sidebar width in a panel. Use `lt-grid` so layouts reflow.
