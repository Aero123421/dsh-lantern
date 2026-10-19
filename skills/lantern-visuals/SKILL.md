---
name: lantern-visuals
description: Design guide for the show_visual tool. How to build inline diagrams, charts, explainer pages, choice cards, forms and small interactive tools in DSH Web with the Lantern kit (tokens, components, the window.lantern API, answers that come back to you). Load it before your first show_visual call in a session, and whenever a visual needs forms, answers, charts or custom styling.
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
- Colors must work in light and dark: use the `--lt-*` variables, or define both schemes yourself with `:root[data-theme="dark"]`.
- No fixed positioning and no nested scroll areas in inline visuals; the card grows to fit the content.
- Round every number you display. Validate input before submitting and show inline errors.
- Libraries load from any CDN with `<script src>` / `<link>` (Chart.js, D3, Mermaid, KaTeX, three.js). Load them before scripts that use them. `fetch()`, XHR and WebSockets are blocked in `html` visuals: put the data in the page.
- The visual cannot reach DSH, its files or its APIs. `http(s)` links open in a new browser tab.
- `path` shows an HTML file from the workspace in the sidebar instead of `html`. Relative images, styles, module scripts and `fetch()` of files in the page's folder and its subfolders load normally (not above it, and not hidden files). The page keeps its own look; it gets `window.lantern` and the `--lt-*` tokens, and adds the kit's components with `<meta name="lantern-kit">`. In module scripts, fetch with `new URL('data.json', import.meta.url)`.

## References

- `references/kit.md`: design tokens (fonts, colors, spacing, radius, series colors), components and how to override everything.
- `references/api.md`: `window.lantern` (submit, send, setState, events) and the declarative `data-lt-*` attributes.
- `references/patterns.md`: complete examples (choice card, form, explorer with a slider, chart, stepper, explainer page).

Read only the reference you need.
