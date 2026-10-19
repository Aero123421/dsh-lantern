---
name: lantern-visuals
disable-model-invocation: true
user-invocable: true
description: Optional advanced guide for show_visual in DSH Web. Consult it for detailed Lantern kit examples, forms, charts, 3D scenes, simulations, draggable explorers, sortable answers or custom styling. Covers tokens, components, window.lantern and answers that return to the conversation. The tool description provides the essentials; loading this skill is not required before a show_visual call.
---

# Lantern visuals

This advanced guide is loaded only by an explicit user invocation such as `/lantern-visuals`. Ordinary visuals use the short system guidance and the tool description without this guide.

`show_visual` renders HTML in a sandboxed iframe in the chat (`display: "inline"`) or in the right sidebar (`display: "panel"`). Use it when seeing or touching something beats reading about it: a process, a structure, data over time, a comparison, a parameter to explore, a choice the user should make.

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
- Load pinned libraries from `https://cdn.jsdelivr.net/npm/` with `<script src>` / `<link>` (Chart.js, D3, Mermaid, KaTeX, three.js), before scripts that use them. Google Fonts styles and fonts are also allowed. Other external resources are blocked in `html` visuals: embed data and images with inline markup or `data:` / `blob:` URLs. External `fetch()`, XHR and WebSockets are blocked.
- Use `window.lantern` to communicate with the conversation. The opaque iframe origin prevents direct access to the host DOM, cookies and browser storage. This is not complete network isolation: allowed hosts still receive requests and the iframe can navigate itself. Route deliberate `http(s)` link actions through `lantern.openLink()` or a plain anchor.
- Pass exactly one of `html` or `path`. `path` shows an HTML file from the DSH host's local workspace in the sidebar. Remote execution filesystems need `html` instead. The original directory is retained, and reopening reads the live file rather than a snapshot. Relative images, styles, modules and `fetch()` work for the page's folder and subfolders through its expiring file link; hidden files and paths above that folder are refused. The page gets `window.lantern` and `--lt-*` tokens; add `<meta name="lantern-kit">` for kit components. In modules, fetch with `new URL('data.json', import.meta.url)`.

## References

- `references/kit.md`: design tokens (fonts, colors, spacing, radius, series colors), components and how to override everything.
- `references/api.md`: `window.lantern` (submit, send, setState, events) and the declarative `data-lt-*` attributes.
- `references/patterns.md`: complete examples (choice card, form, an answer built by interaction, explorer with a slider, chart, stepper, follow-ups, panel app, explainer page).
- `references/interaction.md`: building blocks for things people drag and play with (sizing, theme colors in JS, canvas DPR, a loop that pauses offscreen, pointer drag, wheel, D3 drag/zoom/brush, a sortable list that answers, downloads, fullscreen).
- `references/3d.md`: three.js setup that follows the theme and its container, on-demand rendering, picking, DOM labels, camera state, WebGL limits, and plain WebGL2 shaders.

Read only the reference you need.
