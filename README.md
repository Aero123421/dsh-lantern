# dsh-lantern

Interactive HTML visuals in the [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (DSH) Web chat and sidebar, with answers that flow back to the agent. Unofficial plugin.

[日本語](README.ja.md)

![Inline visual in light and dark](docs/inline.png)

- **Inline in the chat.** Diagrams, explorers, charts, choice cards and short forms render in a sandboxed card. After the turn ends, the card stays under the final answer.
- **In the sidebar.** `display: "panel"` opens a visual as a sidebar tab. Any card can be expanded there too.
- **Workspace HTML.** `path` shows an `.html` file from the working directory in the sidebar. Relative images, CSS, module scripts and `fetch()` within the page's folder work, over the same address you already use for DSH Web (including a Cloudflare Tunnel).
- **Answers.** With `await_response: true` the agent waits and receives the user's answer as the tool result. Without it, an answer (or a follow-up button) arrives as the user's next message.
- **Follows DSH.** The light/dark theme, colors and fonts of DSH are handed to every visual and update live.
- **Made for interaction.** 3D scenes, simulations, draggable explorers and games work in a card. The wheel scrolls the chat until the user clicks into a visual. Cards never jitter with a scrollbar of their own, and a page sized by the viewport is pinned instead of growing forever. `lantern.visible` lets animations pause offscreen, a dropped WebGL context gets a resume button, and visuals can go fullscreen and save files.
- **A kit, not a cage.** Tokens and components are preloaded in CSS cascade layers, so anything a visual writes itself (fonts, colors, layout) wins.
- **A skill, not a system prompt.** The design guide ships as the `lantern-visuals` skill; the model loads it when needed. Nothing is added to the system prompt; the tool description is short.

![Waiting for an answer, then answered](docs/answer.png)

![A workspace page in the sidebar](docs/workspace-page.png)

## Showcase

![Rotating a molecule in the chat](docs/molecule.gif)

![A drag-to-rank answer flowing back to the agent](docs/ranking.gif)

![Eleven showcase visuals in dark mode](docs/showcase.png)

[`examples/`](examples) holds the eleven showcase visuals (three.js molecule viewer, 3D surface, orrery, double pendulum, D3 concept map, pathfinding, linked dashboard, matrix explorer, Tower of Hanoi, ranking answer, WebGL shader), written the way a model would pass them as `html`.

## Install

DSH 0.2.1 or later (0.2.x), Web profile.

```sh
dsh plugin --profile web add github:Aero123421/dsh-lantern#v0.2.0
# or from a downloaded package
dsh plugin --profile web add ./dsh-lantern-0.2.0.tgz
```

Restart `dsh web`. Check with `dsh --profile web --dump-config | grep lantern`.

Optional config (in your profile's `cordis.patch.yml`):

```yaml
- id: dsh-lantern
  config:
    answerTimeoutMinutes: 15   # how long an awaited visual waits (default 15)
    maxHtmlChars: 400000       # largest html argument (default 400000)
```

## The tool

`show_visual`

| Argument | |
|---|---|
| `title` | Card and tab title (required). |
| `html` | A fragment or a full document. |
| `path` | A workspace `.html` file instead of `html` (always shown in the sidebar). |
| `display` | `inline` (default) or `panel`. |
| `await_response` | Wait for the user's answer and return it. |
| `replace` | The `id` of an earlier visual this one revises; the old card folds into a link. |

Inside a visual, `window.lantern` offers `submit`, `send`, `setState`/`getState`, `expand`, `openLink`, `colors()`, `visible` and events, plus declarative attributes (`data-lt-choices`, `data-lt-submit`, `data-lt-form`, `data-lt-send`, `data-lt-fullscreen`, tabs, steps). See [`skills/lantern-visuals`](skills/lantern-visuals/SKILL.md).

## Safety

- Visuals run in an iframe with `sandbox="allow-scripts allow-forms allow-downloads"` and no `allow-same-origin`: an opaque origin with no access to DSH's cookies, DOM or API. Everything goes through `postMessage` to the card, which checks the sender.
- Answers, messages, links and sidebar requests are accepted only right after a real user action inside that visual (it has focus, got it after the user's last input in DSH, and the browser reports fresh user activation). One answer per visual; follow-up messages are throttled and capped.
- HTML visuals carry a CSP that blocks `fetch`/XHR/WebSockets, form posts and `<base>`, so input typed into a visual stays there. The streaming preview drops scripts, event-handler attributes, `javascript:` URLs and embedded frames.
- Workspace pages are served from `/lantern/files/<token>/…`. Each token is random, covers only the page's own folder and its subfolders, expires 8 hours after it is issued, and is issued only through DSH's authenticated API. Symlinks are resolved and re-checked on the opened file; hidden files and folders are refused. Responses carry `Content-Security-Policy: sandbox allow-scripts allow-forms allow-downloads` and `Referrer-Policy: no-referrer`.
- Answers are matched to the waiting call by session and call id.
- An HTML visual can load scripts from CDNs; it is still confined to its sandbox.

## Develop

```sh
npm install
npm run check      # typecheck, tests, build → lib/
dsh plugin --profile web add /path/to/dsh-lantern   # links the folder
```

`lib/` is committed so that GitHub installs need no build step.

## Not yet

GIF/video capture, MCP Apps UIs, port forwarding and a server-side browser are out of scope for 0.1.

## License

MIT
