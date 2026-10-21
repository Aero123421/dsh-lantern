---
name: lantern-visuals
disable-model-invocation: true
user-invocable: true
description: Optional advanced guide for rich show_visual scenes in DSH Web. Consult it for detailed Lantern kit examples, forms, charts, 3D scenes, simulations, draggable explorers, sortable answers or custom styling. Covers tokens, components, window.lantern and answers that return to the conversation. The tool description provides the essentials; loading this skill is not required before a show_visual call.
---

# Lantern visuals

This advanced guide is loaded only by an explicit user invocation such as `/lantern-visuals`. Ordinary visuals use the short system guidance and the tool description without this guide.

`show_visual` renders HTML in a sandboxed iframe at its native conversation position in the chat (`display: "inline"`) or in the right sidebar (`display: "panel"`). Use it when seeing or touching something beats reading about it: a process, a structure, data over time, a comparison, a parameter to explore, a choice the user should make.

## Workflow

1. Decide the job: explain (diagram, explorer), compare (cards, chart), or ask (choices, form). Keep one job per visual.
2. Pick the place. Inline for compact things (up to about one screen). Panel for long or wide pages such as explainer pages and dashboards.
3. Write the HTML. Start from the kit (`references/kit.md`) for speed, or write your own styles. Both are fine.
4. To get an answer, set `await_response: true` and give the user a control that calls `lantern.submit(value)` (or use `data-lt-submit`). The value comes back as the tool result.
5. To revise a visual, call `show_visual` again with `replace` set to its `id`. The old card folds into a link to the new one.
6. Keep the key answer and sources in your reply text. Use the visual for interaction and its necessary labels, units and instructions.

## Rules that keep visuals good

- Send a fragment or a full document. A fragment is wrapped for you with the kit loaded.
- Colors must work in light and dark: use the `--lt-*` variables, or define both schemes yourself with `:root[data-theme="dark"]`. For canvas and WebGL, resolve tokens in JS and redraw on `lantern.on('theme', …)`.
- No fixed positioning and no nested scroll areas in inline visuals; the card grows to fit the content. Give canvases and 3D stages an explicit height, never `100vh` or `innerHeight`.
- Interactive visuals: drag with pointer events and `setPointerCapture`, render only while something moves and `lantern.visible` is true, respect `prefers-reduced-motion`, and save what the user built with `lantern.setState`. Restore with `getState()` when the card is re-created. Storage is best effort in the same browser, without cross-device sync; always provide defaults.
- Round every number you display. Validate input before submitting and show inline errors.
- Do not load libraries, styles, images or fonts from a CDN. `fetch()`, XHR, `sendBeacon`, WebSockets, images, CSS `url()`, `<link>`, `<script src>`, prefetch and form posts toward another site are blocked. Put the library and the data in the page. A `<script src="https://…">` is refused on purpose: allowing it also lets `prefetch` leave the page.
- The visual cannot reach DSH, its files or its APIs. `http(s)` links open in a new browser tab only after a real click. An inline card cannot read the allowed folder or `/lantern/files/`. Do not rely on navigation being blocked for a workspace page: running its scripts lets the card send the contents of the allowed folder out by navigating itself.
- Scripts in `html` run on their own only the first time the card appears in the page that created it. After a reload, or when a past conversation is opened — including a card that is still waiting for an answer — the card stays paused until the user presses Run. Do not depend on scripts having run in a restored card. A tight loop on that first view can freeze that tab; other tabs stay usable.
- `path` shows an HTML file from the workspace in the sidebar instead of `html`. Its scripts do not run until the user presses Run. Relative images, styles, module scripts and `fetch()` of files in the page's folder and its subfolders load normally (not above it, and not hidden files). `fetch`, XHR, images, CSS `url()`, forms, prefetch, WebSocket and `sendBeacon` to other sites are blocked. Navigating the page itself is not: running scripts lets the card send the contents of the allowed folder out by navigating itself. The page keeps its own look; it gets `window.lantern` and the `--lt-*` tokens, and adds the kit's components with `<meta name="lantern-kit">`. In module scripts, fetch with `new URL('data.json', import.meta.url)`. The original directory is remembered only while it stays inside the session working directory; a saved folder outside that directory is refused. Path results from before 0.2.0 that stored only a relative path have no source and cannot be opened again. This skill is not model-invocable; the user loads it with `/lantern-visuals`.

## References

- `references/kit.md`: design tokens (fonts, colors, spacing, radius, series colors), components and how to override everything.
- `references/api.md`: `window.lantern` (submit, send, setState, events) and the declarative `data-lt-*` attributes.
- `references/patterns.md`: complete examples (choice card, form, an answer built by interaction, explorer with a slider, chart, stepper, follow-ups, panel app, explainer page).
- `references/interaction.md`: building blocks for things people drag and play with (sizing, theme colors in JS, canvas DPR, a loop that pauses offscreen, pointer drag, wheel, D3 drag/zoom/brush, a sortable list that answers, downloads, fullscreen).
- `references/3d.md`: three.js setup that follows the theme and its container, on-demand rendering, picking, DOM labels, camera state, WebGL limits, and plain WebGL2 shaders.

Read only the reference you need.
