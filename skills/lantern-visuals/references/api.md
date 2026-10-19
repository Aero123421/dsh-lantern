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
| `lantern.on(name, fn)` | Events: `state`, `theme`, `select`, `step`. Returns an unsubscribe function. |

Answers, sends, links and `expand` are accepted only right after the user clicks or types inside the visual; calls without a user action are refused. One answer per visual; `send` is limited to a few messages per visual.

## Declarative attributes (no script needed)

- `data-lt-choices` on a container, `data-lt-choice="value"` on its buttons: single selection (`aria-pressed`). Add `data-lt-multi` for multiple, or `data-lt-instant` to submit as soon as one is picked.
- `data-lt-submit` on a button: submits. With a value (`data-lt-submit='{"plan":"pro"}'`) it submits that value. Empty, it submits the enclosing form's fields, or the nearest `data-lt-choices` selection (an array with `data-lt-multi`). Empty selections show an inline error (text from `data-lt-empty`). After the answer, submit buttons disable themselves.
- `<form data-lt-form>`: native validation runs, then the form's fields are submitted as an object (checkboxes become booleans).
- `data-lt-send="text"`: sends that text as the user's next message.
- `data-lt-expand`: opens the visual in the sidebar.
- Tabs: `<div class="lt-tabs" data-lt-tabs><div role="tablist"><button data-tab="a">A</button>…</div><section data-tab-panel="a">…</section>…</div>`
- Steps: `<div data-lt-steps><section data-step>…</section>…<div class="lt-dots" data-lt-dots></div><button data-lt-prev>Back</button><button data-lt-next>Next</button></div>`

When a visual is answered and later reloaded, buttons in `data-lt-choices` that match the answer are shown pressed again.
