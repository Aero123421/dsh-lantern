<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/banner-dark.svg">
    <img src="docs/banner-light.svg" alt="dsh-lantern — interactive visuals inside the DeepSeek Harness chat" width="100%">
  </picture>
</p>

<p align="center">
  <b>English</b> · <a href="README.ja.md">日本語</a> · <a href="README.zh.md">简体中文</a>
</p>

<p align="center">
  <img alt="DSH 0.2.x" src="https://img.shields.io/badge/DSH-0.2.x-4d6bfe?style=flat-square">
  <img alt="Web profile" src="https://img.shields.io/badge/profile-web-555?style=flat-square">
  <img alt="System prompt +0 tokens" src="https://img.shields.io/badge/system%20prompt-%2B0%20tokens-2ea44f?style=flat-square">
  <img alt="MIT" src="https://img.shields.io/badge/license-MIT-555?style=flat-square">
</p>

<p align="center">
  <img src="docs/molecule.gif" alt="Rotating a caffeine molecule and measuring a bond angle, right inside the chat" width="88%">
</p>

**Lantern lets the agent answer with something you can touch.** One tool, `show_visual`, turns HTML into a live card in the [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) Web chat: a 3D model you rotate, a simulation you poke, a chart you brush, a list you drag into order. When the agent asks a question this way, your click comes straight back to it as the answer.

## Why it feels different

- 🪟 **It lives in the conversation.** Cards render under the reply and stay there after the turn folds away. Reload the page and they come back, answers and slider positions included.
- 🔁 **Answers flow back.** With `await_response: true` the agent waits, and whatever the user picks, ranks or types returns as the tool result. Follow-up buttons post a message as the user.
- 🎨 **It looks like DSH.** The live DSH theme (light or dark, colours, fonts) flows into every visual and switches instantly, with no reload.
- 🧰 **A kit, not a cage.** Tokens and components are preloaded in CSS cascade layers, so a visual's own fonts, colours and layout always win. Three.js, D3, KaTeX and Chart.js load straight from a CDN.
- 🗂️ **Your HTML files, too.** Point `path` at a page in the workspace and it opens in the sidebar with its relative CSS, images, modules and JSON. It works wherever DSH Web does, including behind a Cloudflare Tunnel.
- 🪶 **Zero prompt tax.** Nothing is added to the system prompt. The design guide is a skill (`lantern-visuals`) that the model loads only when it needs it.

## Gallery

Eleven showcase visuals, each a single `show_visual` call. Click a picture to see its source; the screenshots follow your GitHub theme. They were written to show what Lantern can carry. Your own results depend on the model you run.

<table>
<tr>
<td width="50%" valign="top">
<a href="examples/molecule.html"><picture><source media="(prefers-color-scheme: dark)" srcset="docs/gallery/molecule-dark.jpg"><img src="docs/gallery/molecule-light.jpg" alt="Molecule viewer" width="100%"></picture></a><br>
<b>Molecule viewer</b> <sub>three.js · in the chat</sub><br>
<sub>Drag to rotate, click atoms to measure bond lengths and angles, switch ball-and-stick / space-filling. Six molecules up to C₆₀.</sub>
</td>
<td width="50%" valign="top">
<a href="examples/surface.html"><picture><source media="(prefers-color-scheme: dark)" srcset="docs/gallery/surface-dark.jpg"><img src="docs/gallery/surface-light.jpg" alt="3D function surface" width="100%"></picture></a><br>
<b>3D function surface</b> <sub>three.js · KaTeX · in the sidebar</sub><br>
<sub>Five functions with live formulas. Hover for the tangent plane and gradient, click to run gradient descent from that point.</sub>
</td>
</tr>
<tr>
<td width="50%" valign="top">
<a href="examples/solar.html"><picture><source media="(prefers-color-scheme: dark)" srcset="docs/gallery/solar-dark.jpg"><img src="docs/gallery/solar-light.jpg" alt="Orrery" width="100%"></picture></a><br>
<b>Orrery</b> <sub>three.js · in the sidebar</sub><br>
<sub>Planets placed from real orbital elements. Scrub the date, play at any speed, click a planet to follow it.</sub>
</td>
<td width="50%" valign="top">
<a href="examples/graph.html"><picture><source media="(prefers-color-scheme: dark)" srcset="docs/gallery/graph-dark.jpg"><img src="docs/gallery/graph-light.jpg" alt="Concept map" width="100%"></picture></a><br>
<b>Concept map</b> <sub>D3 · in the chat</sub><br>
<sub>Force-directed graph of ML concepts: drag to pin, search, filter, zoom. "Explain this concept" asks the agent.</sub>
</td>
</tr>
<tr>
<td width="50%" valign="top">
<a href="examples/pendulum.html"><picture><source media="(prefers-color-scheme: dark)" srcset="docs/gallery/pendulum-dark.jpg"><img src="docs/gallery/pendulum-light.jpg" alt="Double pendulum" width="100%"></picture></a><br>
<b>Double pendulum</b> <sub>canvas · in the chat</sub><br>
<sub>Drag the bobs to set the start. Three copies 0.001 rad apart drift into chaos, with a log-scale divergence chart.</sub>
</td>
<td width="50%" valign="top">
<a href="examples/pathfind.html"><picture><source media="(prefers-color-scheme: dark)" srcset="docs/gallery/pathfind-dark.jpg"><img src="docs/gallery/pathfind-light.jpg" alt="Pathfinding" width="100%"></picture></a><br>
<b>Pathfinding</b> <sub>canvas · in the chat</sub><br>
<sub>Draw walls and mud, then play, step or race BFS, Dijkstra, A* and greedy search. Includes a maze generator.</sub>
</td>
</tr>
<tr>
<td width="50%" valign="top">
<a href="examples/explorer.html"><picture><source media="(prefers-color-scheme: dark)" srcset="docs/gallery/explorer-dark.jpg"><img src="docs/gallery/explorer-light.jpg" alt="Linked dashboard" width="100%"></picture></a><br>
<b>Linked dashboard</b> <sub>D3 · in the sidebar</sub><br>
<sub>Brush the timeline or the scatter plot, click bars — every chart filters every other one.</sub>
</td>
<td width="50%" valign="top">
<a href="examples/matrix.html"><picture><source media="(prefers-color-scheme: dark)" srcset="docs/gallery/matrix-dark.jpg"><img src="docs/gallery/matrix-light.jpg" alt="Matrix explorer" width="100%"></picture></a><br>
<b>Matrix explorer</b> <sub>KaTeX · in the chat</sub><br>
<sub>Drag the basis vectors and watch the matrix, determinant and eigenvectors update live.</sub>
</td>
</tr>
<tr>
<td width="50%" valign="top">
<a href="examples/hanoi.html"><picture><source media="(prefers-color-scheme: dark)" srcset="docs/gallery/hanoi-dark.jpg"><img src="docs/gallery/hanoi-light.jpg" alt="Tower of Hanoi" width="100%"></picture></a><br>
<b>Tower of Hanoi</b> <sub>DOM · in the chat</sub><br>
<sub>Drag and drop the discs, or let auto-solve show the recursion move by move.</sub>
</td>
<td width="50%" valign="top">
<a href="examples/ranking.html"><picture><source media="(prefers-color-scheme: dark)" srcset="docs/gallery/ranking-dark.jpg"><img src="docs/gallery/ranking-light.jpg" alt="Drag-to-rank answer" width="100%"></picture></a><br>
<b>Drag-to-rank answer</b> <sub>await_response · in the chat</sub><br>
<sub>Sort the backlog against a capacity line. The final order returns to the agent as the tool result.</sub>
</td>
</tr>
<tr>
<td width="50%" valign="top">
<a href="examples/shader.html"><picture><source media="(prefers-color-scheme: dark)" srcset="docs/gallery/shader-dark.jpg"><img src="docs/gallery/shader-light.jpg" alt="Generative shader" width="100%"></picture></a><br>
<b>Generative shader</b> <sub>WebGL2 · in the chat</sub><br>
<sub>A flowing GPU pattern that swirls under the cursor and ripples on click. Switch palettes, save a PNG.</sub>
</td>
</tr>
</table>

<table>
<tr>
<td width="50%"><img src="docs/graph.gif" alt="Dragging nodes of a force-directed concept map"><br><sub>Drag a concept map, then ask the agent about a node.</sub></td>
<td width="50%"><img src="docs/pathfind.gif" alt="Drawing walls and watching A* search"><br><sub>Draw walls and watch A* find its way.</sub></td>
</tr>
<tr>
<td colspan="2"><img src="docs/ranking.gif" alt="Ranking items by dragging; the order returns to the agent"><br><sub>Rank by dragging, press the button, and the agent continues with your order.</sub></td>
</tr>
</table>

## Quick start

```sh
dsh plugin --profile web add github:Aero123421/dsh-lantern
# then restart `dsh web`
```

This needs DSH 0.2.1 or later (0.2.x) with the Web profile. A version tag publishes `dsh-lantern-<version>.tgz` and `SHA256SUMS` on the GitHub release (the archive is not published until that tag is pushed). Check the checksum, then install the archive:

```sh
sha256sum -c SHA256SUMS
dsh plugin --profile web add ./dsh-lantern-0.2.1.tgz
```

Check that it loaded with `dsh --profile web --dump-config | grep lantern`.

Then just ask. For example:

- *"How is caffeine shaped? Show me something I can rotate."*
- *"Explain gradient descent with a 3D surface I can play with."*
- *"Compare A\* and Dijkstra on a grid I can draw walls on."*
- *"Here are this sprint's tickets. Let me drag them into priority order."*
- *"Open `report/index.html` in the sidebar."*

## How it works

```mermaid
sequenceDiagram
    autonumber
    participant A as Agent
    participant H as DSH host · Lantern
    participant C as Chat card
    participant V as Visual (sandboxed iframe)
    A->>H: show_visual { title, html, await_response: true }
    H-->>C: tool row streams in, with a live preview
    C->>V: document + kit + current DSH theme
    Note over V: the user drags, rotates, picks…
    V->>C: lantern.submit(value), only right after a real user action
    C->>H: POST /api/lantern.respond (authenticated)
    H-->>A: tool result: "The user answered …"
    Note over C: the turn ends and the card moves under the final answer
```

## For the model: the `show_visual` tool

| Argument | |
|---|---|
| `title` | Card and tab title (required). |
| `html` | A fragment or a complete document. The kit and theme are preloaded. |
| `path` | A workspace `.html` file instead of `html`. It always opens in the sidebar. |
| `display` | `inline` (default) or `panel` (the right sidebar). |
| `await_response` | Wait for the user's answer and return it as the result. |
| `replace` | The `id` of an earlier visual that this one revises. The old card folds into a link to the new one. |

Inside a visual, `window.lantern` offers `submit`, `send`, `setState` / `getState`, `expand`, `openLink`, `colors()`, `visible` and events. Declarative attributes cover the common cases without script: `data-lt-choices`, `data-lt-submit`, `data-lt-form`, `data-lt-send`, `data-lt-fullscreen`, tabs and steps. The full guide (patterns, 3D, interaction) is in [`skills/lantern-visuals`](skills/lantern-visuals/SKILL.md).

<details>
<summary><b>Make it yours: the kit is only a starting point</b></summary>

Every token can be overridden, and your own styles always beat the kit:

```html
<style>
  :root {
    --lt-font: "Iowan Old Style", var(--lt-font-serif);
    --lt-accent: #e8590c;
    --lt-radius: 18px;
  }
  :root[data-theme="dark"] { --lt-accent: #ff922b; }
</style>
<div class="lt-card raised lt-stack">
  <h3>Your look, the kit's plumbing</h3>
  <button class="primary" data-lt-submit='"ok"'>Sounds good</button>
</div>
```

The tokens cover fonts, sizes, surfaces, text, borders, accent, success/warning/danger, eight series colours, radius, spacing, shadow and motion. See [`references/kit.md`](skills/lantern-visuals/references/kit.md).

</details>

## Workspace pages

`path: "report/index.html"` opens a real file from the working directory in a sidebar tab. It is served from a folder-scoped, expiring link, so relative `<link>`, `<img>`, `<script type="module">` and `fetch()` of files in that folder work as they would on a static server. Requests to any other site — `fetch`, XHR, images, CSS `url()`, forms, prefetch, WebSocket, `sendBeacon`, navigation — are refused. The page keeps its own look. It also gets `window.lantern` and the `--lt-*` theme tokens, and can opt into the kit's components with `<meta name="lantern-kit">`.

<img src="docs/workspace-page.png" alt="A workspace report page with relative CSS, image, module JS and JSON, open in the sidebar (dark)" width="100%">

## Safety

A visual is model-written code, so Lantern treats it as untrusted:

- **Isolated.** Visuals run in a sandboxed iframe (`allow-scripts allow-forms allow-downloads`, never `allow-same-origin`). They have an opaque origin and cannot reach DSH's cookies, DOM or API. The only way out is `postMessage` to the card, which checks the sender.
- **The user decides.** Answers, messages, links and sidebar requests are honoured only right after a real user action inside that visual. One answer per visual; follow-up messages are throttled and capped.
- **Nothing leaks out.** HTML visuals and workspace pages both refuse external `fetch`, XHR, `sendBeacon`, WebSockets, images, CSS `url()`, stylesheets, `<script src>`, prefetch/preload, form posts, `<base>`, and navigation. `data:` and `blob:` images still work. A CDN script is refused too, because allowing it also lets prefetch leave the page. Inline scripts cannot navigate the frame. The live preview strips scripts, event handlers, `javascript:` URLs and embedded frames.
- **Restored cards stay still.** Scripts run on their own only the first time a visual appears in the page that created it. Reopening a conversation, reloading, or a card that is still waiting after a reload shows the page paused until you press Run. A loop can still freeze that first view; reload brings DSH back and does not run the loop again.
- **Files stay scoped.** Workspace links are random, cover only the page's own folder, expire after 8 hours and are issued only through DSH's authenticated API. Symlinks are resolved and re-checked on the opened file, and hidden files and folders are refused.

## Configuration

Optional, in your profile's `cordis.patch.yml`:

```yaml
- id: dsh-lantern
  config:
    answerTimeoutMinutes: 15   # how long an awaited visual waits (default 15, max 1440)
    maxHtmlChars: 400000       # the largest html argument (default 400000)
```

## Development

```sh
npm install
npm run check                                       # typecheck, tests, build → lib/
dsh plugin --profile web add /path/to/dsh-lantern   # link your checkout
```

`lib/` is committed, so a GitHub install needs no build step. The host half is Node ESM. The browser half loads through DSH Web's module loader and shares DSH's React. Nothing from DSH is imported at runtime.

## Roadmap

- GIF and video capture for UI checks
- Rendering UIs from MCP Apps servers
- Two-finger gestures for 3D cards on touch screens

## License

MIT. Lantern is an unofficial community plugin and is not affiliated with DeepSeek.
