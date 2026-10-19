# window.lantern

Available in every visual, including workspace pages shown with `path`.

| Member | Meaning |
|---|---|
| `lantern.submit(value)` | Answer the visual. With `await_response: true` the JSON value (64 KB max) becomes your tool result. Otherwise it reaches you as the user's next message. Returns a Promise. |
| `lantern.send(text)` | Post `text` into the chat as the user's message (for follow-up buttons like "Explain step 2"). |
| `lantern.setState(value)` / `lantern.getState()` | Save and restore UI state (slider positions, current step) across reloads. JSON only. |
| `lantern.expand()` | Open this visual in the right sidebar. |
| `lantern.openLink(url)` | Open an http(s) link in a new tab (after a click). Plain `<a href>` does the same. |
| `lantern.state` | `idle`, `waiting`, `answered`, `dismissed`, `timeout` or `closed`. Also on `<html data-lt-state>`. After `timeout` the user can still answer; it reaches you as a message. |
| `lantern.response` | The submitted answer, once answered. |
| `lantern.theme` | `light` or `dark`. |
| `lantern.colors()` | The eight series colors for the current theme. |
| `lantern.visible` | `true` while the visual is on screen: not scrolled away, not in a folded card, tab visible. Pause animation loops and timers otherwise. |
| `lantern.mode` | `inline` or `panel`. Also on `<html data-lt-mode>`. |
| `lantern.on(name, fn)` | Events: `state`, `theme`, `select`, `step`, `visibility` (detail: `true`/`false`). Returns an unsubscribe function. |

Answers, sends, links and `expand` are accepted only right after the user clicks or types inside the visual; calls without a user action are refused. One answer per visual; `send` is limited to a few messages per visual.

## What the card does for you

- **Height.** An inline card follows its content's height (up to 2400 px) and shows no scrollbar of its own below that. A page sized by the frame itself (`100vh`, `innerHeight`) is pinned to a fixed height, so give inline stages explicit heights.
- **Wheel.** In inline cards, wheel events reach your handlers (zoom, pan) only after the user clicks into the visual, or with Ctrl/⌘ held. Otherwise the chat scrolls and the card shows a short hint. Panels get every wheel event.
- **WebGL.** If the browser drops the visual's WebGL context (too many live 3D cards on the page), the card shows a paused overlay with a resume button that starts the visual again from its saved state.
- **Downloads.** `<a download href="blob:…">` (or `data:`) saves a file; other links open in a new tab.
- **Pointer capture.** `setPointerCapture` keeps drags working when the pointer leaves the card.

## Declarative attributes (no script needed)

- `data-lt-choices` on a container, `data-lt-choice="value"` on its buttons: single selection (`aria-pressed`). Add `data-lt-multi` for multiple, or `data-lt-instant` to submit as soon as one is picked.
- `data-lt-submit` on a button: submits. With a value (`data-lt-submit='{"plan":"pro"}'`) it submits that value. Empty, it submits the enclosing form's fields, or the nearest `data-lt-choices` selection (an array with `data-lt-multi`). Empty selections show an inline error (text from `data-lt-empty`). After the answer, submit buttons disable themselves.
- `<form data-lt-form>`: native validation runs, then the form's fields are submitted as an object (checkboxes become booleans).
- `data-lt-send="text"`: sends that text as the user's next message.
- `data-lt-expand`: opens the visual in the sidebar.
- `data-lt-fullscreen`: toggles fullscreen for the visual; style it with `:root:fullscreen …`.
- Tabs: `<div class="lt-tabs" data-lt-tabs><div role="tablist"><button data-tab="a">A</button>…</div><section data-tab-panel="a">…</section>…</div>`
- Steps: `<div data-lt-steps><section data-step>…</section>…<div class="lt-dots" data-lt-dots></div><button data-lt-prev>Back</button><button data-lt-next>Next</button></div>`

When a visual is answered and later reloaded, buttons in `data-lt-choices` that match the answer are shown pressed again.
