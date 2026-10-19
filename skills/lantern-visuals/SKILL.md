---
name: lantern-visuals
description: Design guide for the show_visual tool. How to build inline diagrams, charts, explainer pages, choice cards, forms and interactive tools (3D scenes, simulations, draggable explorers, games, sortable answers) in DSH Web with the Lantern kit (tokens, components, the window.lantern API, answers that come back to you). Load it before your first show_visual call in a session, and whenever a visual needs forms, answers, charts, 3D, animation or custom styling.
---

# Lantern visuals

`show_visual` renders HTML in a sandboxed iframe in the chat (`display: "inline"`) or in the right sidebar (`display: "panel"`). Use it when seeing or touching something beats reading about it: a process, a structure, data over time, a comparison, a parameter to explore, a choice the user should make.

## Workflow

1. Decide the job: explain (diagram, explorer), compare (cards, chart), or ask (choices, form). Keep one job per visual.
2. Pick the place. Inline for compact things (up to about one screen). Panel for long or wide pages such as explainer pages and dashboards.
3. Write the HTML. Start from the kit (`references/kit.md`) for speed, or write your own styles. Both are fine.
4. To get an answer, set `await_response: true` and give the user a control that calls `lantern.submit(value)` (or use `data-lt-submit`). The value comes back as the tool result.
5. To revise a visual, call `show_visual` again with `replace` set to its `id`. The old card folds into a link to the new one.
6. Put explanations in your reply text, not inside the visual. The visual holds what text cannot.

## Rules that keep visuals good

- Send a fragment or a full document. A fragment is wrapped for you with the kit loaded.
- Colors must work in light and dark: use the `--lt-*` variables, or define both schemes yourself with `:root[data-theme="dark"]`. For canvas and WebGL, resolve tokens in JS and redraw on `lantern.on('theme', …)`.
- No fixed positioning and no nested scroll areas in inline visuals; the card grows to fit the content. Give canvases and 3D stages an explicit height, never `100vh` or `innerHeight`.
- Interactive visuals: drag with pointer events and `setPointerCapture`, render only while something moves and `lantern.visible` is true, respect `prefers-reduced-motion`, and save what the user built with `lantern.setState`. The card is re-created when the turn ends and on reload.
- Round every number you display. Validate input before submitting and show inline errors.
- Libraries load from any CDN with `<script src>` (Chart.js, D3, Mermaid, KaTeX, three.js). Load them before scripts that use them. Do not use `<link>` stylesheets, external images, or web fonts: `fetch()`, XHR, `sendBeacon`, WebSockets, images, CSS `url()`, prefetch and form posts are blocked in `html` visuals. Put the data in the page.
- The visual cannot reach DSH, its files or its APIs. `http(s)` links open in a new browser tab only after a real click.
- Scripts run on their own only the first time the card appears in the page that created it. After a reload, or when a past conversation is opened — including a card that is still waiting for an answer — the card stays paused until the user presses Run. Do not depend on scripts having run in a restored card.
- `path` shows an HTML file from the workspace in the sidebar instead of `html`. Relative images, styles, module scripts and `fetch()` of files in the page's folder and its subfolders load normally (not above it, and not hidden files). Requests to other sites are blocked. The page keeps its own look; it gets `window.lantern` and the `--lt-*` tokens, and adds the kit's components with `<meta name="lantern-kit">`. In module scripts, fetch with `new URL('data.json', import.meta.url)`.

## References

- `references/kit.md`: design tokens (fonts, colors, spacing, radius, series colors), components and how to override everything.
- `references/api.md`: `window.lantern` (submit, send, setState, events) and the declarative `data-lt-*` attributes.
- `references/patterns.md`: complete examples (choice card, form, an answer built by interaction, explorer with a slider, chart, stepper, follow-ups, panel app, explainer page).
- `references/interaction.md`: building blocks for things people drag and play with (sizing, theme colors in JS, canvas DPR, a loop that pauses offscreen, pointer drag, wheel, D3 drag/zoom/brush, a sortable list that answers, downloads, fullscreen).
- `references/3d.md`: three.js setup that follows the theme and its container, on-demand rendering, picking, DOM labels, camera state, WebGL limits, and plain WebGL2 shaders.

Read only the reference you need.
