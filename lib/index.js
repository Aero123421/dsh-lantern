// src/host/index.ts
import { readFile, realpath as realpath2 } from "node:fs/promises";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// src/host/description.ts
var TOOL_NAME = "show_visual";
var SKILL_NAME = "lantern-visuals";
function toolDescription(timeoutMinutes) {
  return [
    "Show an HTML visual to the user in DSH Web, inline in the chat (default) or in the right sidebar.",
    "Use it when a diagram, chart, explorer, comparison, choice cards, a short form or an interactive tool (3D model, simulation, game, drag-to-rank answer) helps more than prose; keep explanations in your reply text.",
    `Load the \`${SKILL_NAME}\` skill before your first visual in a session: it has the kit (tokens, components), the \`window.lantern\` API and patterns.`,
    "Pass `html` (a fragment or a full document; the kit and the DSH light/dark theme are preloaded, and your own styles override them) or `path` (an HTML file in the workspace, shown in the sidebar with its relative files).",
    `Set \`await_response: true\` to wait for the user's answer (sent with \`lantern.submit\` or a \`data-lt-submit\` button); it returns as this tool's result. Waiting ends after about ${timeoutMinutes} minutes; a later answer arrives as a user message.`,
    "Pass `replace` with an earlier visual's `id` to show a revised version instead of a new card."
  ].join(" ");
}
var PARAMETERS = {
  type: "object",
  properties: {
    title: { type: "string", description: "Short title shown on the card and the sidebar tab." },
    html: { type: "string", description: "HTML to render: a fragment or a complete document. Omit when `path` is given." },
    path: { type: "string", description: "Workspace HTML file to show instead of `html`, relative to the working directory or absolute inside it." },
    display: { type: "string", enum: ["inline", "panel"], description: "`inline` (default) in the chat, or `panel` in the right sidebar. `path` visuals always open in the sidebar." },
    await_response: { type: "boolean", description: "Wait for the user's answer and return it as the result." },
    replace: { type: "string", description: "The `id` of an earlier visual this one revises." }
  },
  required: ["title"]
};

// src/host/files.ts
import { randomBytes } from "node:crypto";
import { open, realpath, stat } from "node:fs/promises";
import { extname, isAbsolute, relative, resolve, sep } from "node:path";

// src/frame/kit.css
var kit_default = '/*\n * Lantern kit: design tokens and a few components available in every visual.\n * Everything is a starting point. A visual may override any token on :root,\n * load its own fonts, or ignore the components entirely.\n */\n\n:root {\n  color-scheme: light;\n  /* Typography */\n  --lt-font-sans: system-ui, -apple-system, "Segoe UI", "Hiragino Sans", "Noto Sans JP", "Noto Sans CJK JP", "Yu Gothic UI", sans-serif;\n  --lt-font-serif: "Noto Serif JP", "Hiragino Mincho ProN", "Yu Mincho", Georgia, serif;\n  --lt-font-mono: ui-monospace, "SFMono-Regular", Menlo, Consolas, "Noto Sans Mono CJK JP", monospace;\n  --lt-font: var(--lt-font-sans);\n  --lt-text-xs: 12px;\n  --lt-text-sm: 13px;\n  --lt-text-md: 14px;\n  --lt-text-lg: 16px;\n  --lt-text-xl: 20px;\n  --lt-text-2xl: 26px;\n  --lt-text-3xl: 34px;\n  --lt-leading: 1.65;\n  --lt-weight-regular: 400;\n  --lt-weight-strong: 600;\n\n  /* Color: surfaces and text */\n  --lt-bg: #ffffff;\n  --lt-surface: #f6f7f9;\n  --lt-surface-2: #eef0f4;\n  --lt-fg: #1b1f27;\n  --lt-fg-2: #5b6372;\n  --lt-fg-3: #8a91a0;\n  --lt-border: #e2e5eb;\n  --lt-border-strong: #c9ced8;\n\n  /* Color: roles */\n  --lt-accent: #3b6cf0;\n  --lt-accent-fg: #ffffff;\n  --lt-accent-soft: rgba(59, 108, 240, .12);\n  --lt-success: #13865b;\n  --lt-success-soft: rgba(19, 134, 91, .13);\n  --lt-warning: #b45c00;\n  --lt-warning-soft: rgba(214, 138, 0, .15);\n  --lt-danger: #c9372c;\n  --lt-danger-soft: rgba(201, 55, 44, .12);\n\n  /* Data series (charts, legends) */\n  --lt-series-1: #3b6cf0;\n  --lt-series-2: #1aa37a;\n  --lt-series-3: #e08a1e;\n  --lt-series-4: #d24d7a;\n  --lt-series-5: #7a5af0;\n  --lt-series-6: #1696b8;\n  --lt-series-7: #8c9a2b;\n  --lt-series-8: #8a6a52;\n\n  /* Shape, space, depth, motion */\n  --lt-radius-sm: 6px;\n  --lt-radius: 10px;\n  --lt-radius-lg: 14px;\n  --lt-radius-full: 999px;\n  --lt-space-1: 4px;\n  --lt-space-2: 8px;\n  --lt-space-3: 12px;\n  --lt-space-4: 16px;\n  --lt-space-5: 24px;\n  --lt-space-6: 32px;\n  --lt-space-7: 48px;\n  --lt-shadow-sm: 0 1px 2px rgba(16, 24, 40, .06);\n  --lt-shadow: 0 4px 16px rgba(16, 24, 40, .08);\n  --lt-ease: cubic-bezier(.2, .7, .2, 1);\n  --lt-dur: 180ms;\n}\n\n:root[data-theme="dark"] {\n  color-scheme: dark;\n  --lt-bg: #17181c;\n  --lt-surface: #202228;\n  --lt-surface-2: #2a2c33;\n  --lt-fg: #e9ebf0;\n  --lt-fg-2: #a3a9b5;\n  --lt-fg-3: #767c88;\n  --lt-border: #31343c;\n  --lt-border-strong: #454953;\n  --lt-accent: #6f95ff;\n  --lt-accent-fg: #0d1220;\n  --lt-accent-soft: rgba(111, 149, 255, .16);\n  --lt-success: #3cc58b;\n  --lt-success-soft: rgba(60, 197, 139, .15);\n  --lt-warning: #f0b44c;\n  --lt-warning-soft: rgba(240, 180, 76, .15);\n  --lt-danger: #ff7a6e;\n  --lt-danger-soft: rgba(255, 122, 110, .14);\n  --lt-series-1: #6f95ff;\n  --lt-series-2: #3cc58b;\n  --lt-series-3: #f0a54c;\n  --lt-series-4: #f07ba3;\n  --lt-series-5: #a58cff;\n  --lt-series-6: #4cc3e0;\n  --lt-series-7: #bccb5a;\n  --lt-series-8: #c49f84;\n  --lt-shadow-sm: 0 1px 2px rgba(0, 0, 0, .3);\n  --lt-shadow: 0 6px 20px rgba(0, 0, 0, .35);\n}\n\n/* Base */\n*, *::before, *::after { box-sizing: border-box; }\nhtml, body { margin: 0; }\n/* An inline card is as tall as its content, so it never needs a scrollbar of its own. */\n:root[data-lt-mode="inline"]:not([data-lt-overflow]) { overflow-y: hidden; }\nbody {\n  background: var(--lt-bg);\n  color: var(--lt-fg);\n  font-family: var(--lt-font);\n  font-size: var(--lt-text-md);\n  line-height: var(--lt-leading);\n  -webkit-font-smoothing: antialiased;\n  overflow-wrap: anywhere;\n}\nh1, h2, h3, h4 { margin: 0 0 var(--lt-space-2); line-height: 1.3; font-weight: var(--lt-weight-strong); }\nh1 { font-size: var(--lt-text-2xl); }\nh2 { font-size: var(--lt-text-xl); }\nh3 { font-size: var(--lt-text-lg); }\nh4 { font-size: var(--lt-text-md); }\np { margin: 0 0 var(--lt-space-3); }\na { color: var(--lt-accent); text-decoration: none; }\na:hover { text-decoration: underline; }\nsmall { font-size: var(--lt-text-sm); color: var(--lt-fg-2); }\nhr { border: 0; border-top: 1px solid var(--lt-border); margin: var(--lt-space-4) 0; }\ncode, kbd, pre, samp { font-family: var(--lt-font-mono); font-size: .92em; }\ncode { background: var(--lt-surface-2); padding: .1em .35em; border-radius: var(--lt-radius-sm); }\npre { background: var(--lt-surface); border: 1px solid var(--lt-border); padding: var(--lt-space-3) var(--lt-space-4); border-radius: var(--lt-radius); overflow: auto; }\npre code { background: none; padding: 0; }\nkbd { border: 1px solid var(--lt-border-strong); border-bottom-width: 2px; border-radius: var(--lt-radius-sm); padding: 0 .4em; background: var(--lt-surface); }\nimg, svg, canvas, video { max-width: 100%; }\ntable { border-collapse: collapse; width: 100%; font-size: var(--lt-text-sm); }\nth, td { text-align: left; padding: var(--lt-space-2) var(--lt-space-3); border-bottom: 1px solid var(--lt-border); vertical-align: top; }\nth { color: var(--lt-fg-2); font-weight: var(--lt-weight-strong); }\n::selection { background: var(--lt-accent-soft); }\n\n/* Form controls */\nbutton, input, select, textarea { font: inherit; color: inherit; }\nbutton, .lt-btn {\n  display: inline-flex; align-items: center; justify-content: center; gap: var(--lt-space-2);\n  min-height: 34px; padding: 0 var(--lt-space-4);\n  border: 1px solid var(--lt-border-strong); border-radius: var(--lt-radius);\n  background: var(--lt-bg); color: var(--lt-fg); cursor: pointer;\n  transition: background var(--lt-dur) var(--lt-ease), border-color var(--lt-dur) var(--lt-ease), transform 80ms ease;\n}\nbutton:hover, .lt-btn:hover { background: var(--lt-surface); }\nbutton:active, .lt-btn:active { transform: scale(.98); }\nbutton:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible, [tabindex]:focus-visible {\n  outline: 2px solid var(--lt-accent); outline-offset: 2px;\n}\nbutton:disabled { opacity: .5; cursor: default; transform: none; }\n.lt-btn.primary, button.primary { background: var(--lt-accent); border-color: var(--lt-accent); color: var(--lt-accent-fg); font-weight: var(--lt-weight-strong); }\n.lt-btn.primary:hover, button.primary:hover { filter: brightness(1.06); }\n.lt-btn.ghost, button.ghost { background: transparent; border-color: transparent; color: var(--lt-fg-2); }\n.lt-btn.ghost:hover, button.ghost:hover { background: var(--lt-surface); color: var(--lt-fg); }\n.lt-btn.danger, button.danger { color: var(--lt-danger); border-color: var(--lt-danger); background: transparent; }\n.lt-btn.small, button.small { min-height: 28px; padding: 0 var(--lt-space-3); font-size: var(--lt-text-sm); }\ninput[type="text"], input[type="number"], input[type="email"], input[type="search"], input[type="url"], input[type="date"], input[type="time"], input:not([type]), select, textarea {\n  width: 100%; min-height: 34px; padding: 6px var(--lt-space-3);\n  border: 1px solid var(--lt-border-strong); border-radius: var(--lt-radius); background: var(--lt-bg);\n}\ntextarea { min-height: 80px; resize: vertical; }\ninput[type="range"] { width: 100%; accent-color: var(--lt-accent); }\ninput[type="checkbox"], input[type="radio"] { accent-color: var(--lt-accent); width: 16px; height: 16px; }\nlabel { display: inline-flex; align-items: center; gap: var(--lt-space-2); }\n\n/* Layout */\n.lt-stack { display: flex; flex-direction: column; gap: var(--lt-space-3); }\n.lt-row { display: flex; align-items: center; gap: var(--lt-space-3); flex-wrap: wrap; }\n.lt-spread { display: flex; align-items: center; justify-content: space-between; gap: var(--lt-space-3); }\n.lt-grid { display: grid; gap: var(--lt-space-3); grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--lt-grid-min, 180px)), 1fr)); }\n.lt-pad { padding: var(--lt-space-4); }\n.lt-center { display: grid; place-items: center; }\n.lt-muted { color: var(--lt-fg-2); }\n.lt-faint { color: var(--lt-fg-3); }\n.lt-mono { font-family: var(--lt-font-mono); }\n.lt-serif { font-family: var(--lt-font-serif); }\n.lt-num { font-variant-numeric: tabular-nums; }\n\n/* Surfaces */\n.lt-card { background: var(--lt-bg); border: 1px solid var(--lt-border); border-radius: var(--lt-radius-lg); padding: var(--lt-space-4); }\n.lt-card.soft { background: var(--lt-surface); border-color: transparent; }\n.lt-card.raised { box-shadow: var(--lt-shadow); border-color: transparent; }\n.lt-divider { height: 1px; background: var(--lt-border); margin: var(--lt-space-3) 0; }\n\n/* Labels */\n.lt-badge { display: inline-flex; align-items: center; gap: 4px; padding: 1px 9px; border-radius: var(--lt-radius-full); font-size: var(--lt-text-xs); font-weight: var(--lt-weight-strong); background: var(--lt-surface-2); color: var(--lt-fg-2); }\n.lt-badge.accent { background: var(--lt-accent-soft); color: var(--lt-accent); }\n.lt-badge.ok { background: var(--lt-success-soft); color: var(--lt-success); }\n.lt-badge.warn { background: var(--lt-warning-soft); color: var(--lt-warning); }\n.lt-badge.bad { background: var(--lt-danger-soft); color: var(--lt-danger); }\n\n/* Callouts */\n.lt-callout { border-radius: var(--lt-radius); padding: var(--lt-space-3) var(--lt-space-4); background: var(--lt-surface); border: 1px solid var(--lt-border); }\n.lt-callout.info { background: var(--lt-accent-soft); border-color: transparent; }\n.lt-callout.ok { background: var(--lt-success-soft); border-color: transparent; }\n.lt-callout.warn { background: var(--lt-warning-soft); border-color: transparent; }\n.lt-callout.bad { background: var(--lt-danger-soft); border-color: transparent; }\n\n/* Chips and choices: selection is shown with aria-pressed="true" or .selected */\n.lt-chip { min-height: 30px; padding: 0 var(--lt-space-3); border-radius: var(--lt-radius-full); background: var(--lt-surface); border-color: var(--lt-border); font-size: var(--lt-text-sm); }\n.lt-chip[aria-pressed="true"], .lt-chip.selected { background: var(--lt-accent-soft); border-color: var(--lt-accent); color: var(--lt-accent); font-weight: var(--lt-weight-strong); }\n.lt-choices { display: grid; gap: var(--lt-space-2); grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--lt-choice-min, 170px)), 1fr)); }\n.lt-choice {\n  display: flex; flex-direction: column; align-items: flex-start; justify-content: flex-start; gap: 2px;\n  text-align: left; min-height: 0; padding: var(--lt-space-3) var(--lt-space-4);\n  border: 1px solid var(--lt-border); border-radius: var(--lt-radius-lg); background: var(--lt-bg);\n}\n.lt-choice b, .lt-choice strong { font-weight: var(--lt-weight-strong); }\n.lt-choice span, .lt-choice small { color: var(--lt-fg-2); font-size: var(--lt-text-sm); line-height: 1.5; }\n.lt-choice:hover { border-color: var(--lt-border-strong); background: var(--lt-surface); }\n.lt-choice[aria-pressed="true"], .lt-choice.selected { border-color: var(--lt-accent); background: var(--lt-accent-soft); }\n.lt-choice[aria-pressed="true"] b, .lt-choice.selected b { color: var(--lt-accent); }\n\n/* Fields */\n.lt-field { display: flex; flex-direction: column; align-items: stretch; gap: 6px; }\n.lt-field > span:first-child, .lt-field > label:first-child { font-size: var(--lt-text-sm); color: var(--lt-fg-2); font-weight: var(--lt-weight-strong); }\n.lt-error { color: var(--lt-danger); font-size: var(--lt-text-sm); min-height: 1em; }\n\n/* Numbers */\n.lt-stat { background: var(--lt-surface); border-radius: var(--lt-radius); padding: var(--lt-space-3) var(--lt-space-4); }\n.lt-stat > :first-child { font-size: var(--lt-text-sm); color: var(--lt-fg-2); }\n.lt-stat > :nth-child(2) { font-size: var(--lt-text-2xl); font-weight: var(--lt-weight-strong); font-variant-numeric: tabular-nums; line-height: 1.25; }\n.lt-progress { height: 8px; border-radius: var(--lt-radius-full); background: var(--lt-surface-2); overflow: hidden; }\n.lt-progress > i { display: block; height: 100%; width: var(--value, 0%); background: var(--lt-accent); border-radius: inherit; transition: width var(--lt-dur) var(--lt-ease); }\n.lt-kv { display: grid; grid-template-columns: max-content 1fr; gap: 6px var(--lt-space-4); font-size: var(--lt-text-sm); }\n.lt-kv > :nth-child(odd) { color: var(--lt-fg-2); }\n\n/* Tabs (data-lt-tabs) and steps (data-lt-steps): panels are switched by the runtime */\n.lt-tabs > [role="tablist"] { display: flex; gap: var(--lt-space-1); border-bottom: 1px solid var(--lt-border); margin-bottom: var(--lt-space-3); }\n.lt-tabs > [role="tablist"] > button { border: 0; border-bottom: 2px solid transparent; border-radius: 0; background: transparent; color: var(--lt-fg-2); min-height: 34px; padding: 0 var(--lt-space-3); }\n.lt-tabs > [role="tablist"] > button[aria-selected="true"] { color: var(--lt-fg); border-bottom-color: var(--lt-accent); font-weight: var(--lt-weight-strong); }\n[data-lt-hidden] { display: none !important; }\n.lt-dots { display: flex; gap: 6px; justify-content: center; }\n.lt-dots > i { width: 7px; height: 7px; border-radius: 50%; background: var(--lt-border-strong); }\n.lt-dots > i.on { background: var(--lt-accent); }\n\n/* Motion */\n@media (prefers-reduced-motion: no-preference) {\n  .lt-fade-in { animation: lt-fade-in .3s var(--lt-ease) both; }\n  @keyframes lt-fade-in { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }\n}\n@media (prefers-reduced-motion: reduce) {\n  *, *::before, *::after { transition-duration: 0s !important; animation-duration: 0s !important; }\n}\n';

// src/frame/runtime.ts
function frameRuntime() {
  const TAG = "__lantern";
  const MAX_JSON = 64 * 1024;
  const bootNode = document.getElementById("lantern-boot");
  const boot = JSON.parse(bootNode && bootNode.textContent || "{}");
  let state = boot.state || "idle";
  let response = boot.response;
  let scheme = boot.scheme || "light";
  let widgetState = boot.widgetState === void 0 ? null : boot.widgetState;
  let nextId = 1;
  const waits = {};
  function post(message) {
    message[TAG] = 1;
    parent.postMessage(message, "*");
  }
  function call(type, payload) {
    const id = nextId++;
    return new Promise((resolve2, reject) => {
      waits[id] = { resolve: resolve2, reject };
      const message = { type, id };
      for (const key of Object.keys(payload)) message[key] = payload[key];
      post(message);
    });
  }
  function toJson(value, what) {
    let json2;
    try {
      json2 = JSON.stringify(value === void 0 ? null : value);
    } catch {
      json2 = void 0;
    }
    if (typeof json2 !== "string") throw new TypeError("lantern." + what + ": value is not JSON-serializable");
    if (json2.length > MAX_JSON) throw new RangeError("lantern." + what + ": value is larger than 64 KB");
    return json2;
  }
  function emit(name2, detail) {
    window.dispatchEvent(new CustomEvent("lantern:" + name2, { detail }));
  }
  function applyState() {
    document.documentElement.setAttribute("data-lt-state", state);
    const locked = state === "answered" || state === "dismissed" || state === "closed";
    document.querySelectorAll('[data-lt-submit], form[data-lt-form] button:not([type="button"]), form[data-lt-form] input[type="submit"]').forEach((el) => {
      const button = el;
      if (locked) {
        button.disabled = true;
        button.setAttribute("data-lt-locked", "");
      } else if (button.hasAttribute("data-lt-locked")) {
        button.disabled = false;
        button.removeAttribute("data-lt-locked");
      }
    });
  }
  function readColors() {
    const style = getComputedStyle(document.documentElement);
    const out = [];
    for (let i = 1; i <= 8; i++) out.push(style.getPropertyValue("--lt-series-" + i).trim());
    return out;
  }
  let visible = true;
  const lantern = {
    get id() {
      return boot.id;
    },
    get state() {
      return state;
    },
    get response() {
      return response;
    },
    get theme() {
      return scheme;
    },
    get mode() {
      return boot.mode;
    },
    get visible() {
      return visible;
    },
    submit(value) {
      try {
        return call("submit", { json: toJson(value, "submit") });
      } catch (error) {
        return Promise.reject(error);
      }
    },
    send(text) {
      if (typeof text !== "string" || text.trim() === "") return Promise.reject(new TypeError("lantern.send: text must be a non-empty string"));
      return call("send", { text: text.slice(0, 4e3) });
    },
    openLink(url) {
      post({ type: "open-link", url: String(url) });
    },
    expand() {
      post({ type: "expand" });
    },
    getState() {
      return widgetState;
    },
    setState(value) {
      widgetState = value;
      post({ type: "set-state", json: toJson(value, "setState") });
    },
    colors: readColors,
    on(name2, handler) {
      const listener = (event) => handler(event.detail);
      window.addEventListener("lantern:" + name2, listener);
      return () => window.removeEventListener("lantern:" + name2, listener);
    }
  };
  Object.defineProperty(window, "lantern", { value: Object.freeze(lantern), configurable: false, writable: false, enumerable: true });
  window.addEventListener("message", (event) => {
    if (event.source !== parent) return;
    const data = event.data;
    if (!data || data[TAG] !== 1) return;
    if (data.type === "reply") {
      const wait = waits[data.id];
      if (!wait) return;
      delete waits[data.id];
      if (data.ok) wait.resolve(true);
      else wait.reject(new Error(data.error || "lantern: request failed"));
    } else if (data.type === "state") {
      state = data.state;
      response = data.response;
      applyState();
      emit("state", { state, response });
    } else if (data.type === "theme") {
      scheme = data.scheme;
      document.documentElement.setAttribute("data-theme", scheme);
      const style = document.getElementById("lantern-theme");
      if (style) style.textContent = data.css;
      emit("theme", { scheme });
    } else if (data.type === "partial" && boot.streaming) {
      const root2 = document.getElementById("lantern-stream");
      if (root2) root2.innerHTML = data.html;
    }
  });
  const root = document.documentElement;
  const inline = boot.mode !== "panel" && !boot.streaming;
  const maxHeight = Number(boot.maxHeight) > 0 ? Number(boot.maxHeight) : 2400;
  root.setAttribute("data-lt-mode", boot.mode === "panel" ? "panel" : "inline");
  let reported = -1;
  let queued = false;
  let seenHeight = -1;
  let seenViewport = -1;
  let follows = 0;
  let probing = false;
  let pinned = 0;
  let started = false;
  function contentHeight() {
    const rect = root.getBoundingClientRect();
    return Math.ceil(Math.max(rect.height, document.body ? document.body.scrollHeight : 0));
  }
  function measure() {
    queued = false;
    if (document.fullscreenElement) return;
    const content = contentHeight();
    const viewport = window.innerHeight;
    if (inline && !pinned && seenViewport > 0 && viewport !== seenViewport) {
      const followed = content >= viewport - 1 && Math.abs(content - seenHeight - (viewport - seenViewport)) <= 1;
      follows = followed ? follows + 1 : 0;
      if (followed && (probing || follows >= 3)) pinned = Math.round(Math.min(540, Math.max(320, window.innerWidth * 0.62)));
      probing = false;
    }
    seenHeight = content;
    seenViewport = viewport;
    const height = pinned || content;
    if (!pinned && !started && height <= viewport) return;
    root.toggleAttribute("data-lt-overflow", boot.mode !== "panel" && height > maxHeight);
    if (Math.abs(height - reported) < 2) return;
    reported = height;
    post({ type: "resize", height });
  }
  function schedule() {
    if (!queued) {
      queued = true;
      requestAnimationFrame(measure);
    }
  }
  function probe() {
    if (!inline || pinned || probing || document.fullscreenElement || !document.body) return;
    const viewport = window.innerHeight;
    if (Math.abs(contentHeight() - viewport) > 1) return;
    const sized = Array.from(document.body.children).some((el) => Math.abs(el.offsetHeight - viewport) <= 1);
    if (!sized) return;
    probing = true;
    reported = viewport + 2;
    post({ type: "resize", height: reported });
    setTimeout(() => {
      probing = false;
    }, 1e3);
  }
  if (typeof ResizeObserver === "function") new ResizeObserver(schedule).observe(root);
  window.addEventListener("resize", schedule);
  window.addEventListener("load", () => {
    schedule();
    setTimeout(probe, 300);
    setTimeout(probe, 1500);
  });
  document.addEventListener("fullscreenchange", () => {
    follows = 0;
    seenViewport = -1;
    schedule();
  });
  let onScreen = true;
  function updateVisible() {
    const next = onScreen && document.visibilityState !== "hidden";
    if (next === visible) return;
    visible = next;
    emit("visibility", visible);
  }
  if (typeof IntersectionObserver === "function") {
    new IntersectionObserver((entries) => {
      const last = entries[entries.length - 1];
      if (last) {
        onScreen = last.isIntersecting;
        updateVisible();
      }
    }).observe(root);
  }
  document.addEventListener("visibilitychange", updateVisible);
  if (inline) {
    const addListener = EventTarget.prototype.addEventListener;
    const wheelTargets = /* @__PURE__ */ new WeakSet();
    EventTarget.prototype.addEventListener = function(type, listener, options) {
      if (type === "wheel" || type === "mousewheel" || type === "DOMMouseScroll") wheelTargets.add(this);
      return addListener.call(this, type, listener, options);
    };
    let engaged = false;
    let lastHint = 0;
    addListener.call(window, "pointerdown", () => {
      engaged = true;
    }, true);
    addListener.call(window, "blur", () => {
      engaged = false;
    });
    addListener.call(document, "mouseout", (event) => {
      if (!event.relatedTarget) engaged = false;
    }, true);
    addListener.call(window, "wheel", (event) => {
      const wheel = event;
      if (engaged || wheel.ctrlKey || wheel.metaKey || document.fullscreenElement) return;
      const handled = wheel.composedPath().some((node) => wheelTargets.has(node) || typeof node.onwheel === "function");
      if (!handled) return;
      wheel.stopImmediatePropagation();
      const now = Date.now();
      if (now - lastHint > 2500) {
        lastHint = now;
        post({ type: "hint", kind: "wheel" });
      }
    }, { capture: true, passive: true });
  }
  window.addEventListener("webglcontextlost", (event) => {
    if (event.target.isConnected) post({ type: "gl", lost: true });
  }, true);
  window.addEventListener("webglcontextrestored", () => post({ type: "gl", lost: false }), true);
  function parseValue(raw) {
    if (raw === null || raw === "") return null;
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  }
  function formValue(form) {
    const out = {};
    new FormData(form).forEach((value, key) => {
      const text = typeof value === "string" ? value : value.name;
      if (key in out) out[key] = [].concat(out[key], text);
      else out[key] = text;
    });
    form.querySelectorAll('input[type="checkbox"][name]').forEach((box) => {
      const input = box;
      if (!(input.name in out) && !form.querySelector('input[type="checkbox"][name="' + input.name + '"][value]:not([value="on"])')) out[input.name] = false;
      else if (out[input.name] === "on") out[input.name] = true;
    });
    return out;
  }
  function selection(group) {
    const picked = [];
    group.querySelectorAll("[data-lt-choice]").forEach((el) => {
      if (el.getAttribute("aria-pressed") === "true") picked.push(parseValue(el.getAttribute("data-lt-choice")));
    });
    return group.hasAttribute("data-lt-multi") ? picked : picked.length ? picked[0] : null;
  }
  function scopeValue(button) {
    const form = button.closest("form");
    if (form) return formValue(form);
    let scope = button.parentElement;
    while (scope && scope !== document.body) {
      const group = scope.querySelector("[data-lt-choices]");
      if (group) return selection(group);
      scope = scope.parentElement;
    }
    const any = document.querySelector("[data-lt-choices]");
    return any ? selection(any) : null;
  }
  function showError(near, message) {
    let box = near.parentElement && near.parentElement.querySelector(".lt-error[data-lt-auto]");
    if (!box && near.parentElement) {
      box = document.createElement("div");
      box.className = "lt-error";
      box.setAttribute("data-lt-auto", "");
      near.parentElement.appendChild(box);
    }
    if (box) box.textContent = message;
  }
  function emptyText() {
    const lang = String(boot.lang || navigator.language || "en").toLowerCase();
    if (lang.startsWith("ja")) return "\u9078\u3093\u3067\u304B\u3089\u9001\u3063\u3066\u304F\u3060\u3055\u3044\u3002";
    if (lang.startsWith("zh")) return "\u8BF7\u5148\u9009\u62E9\u518D\u63D0\u4EA4\u3002";
    return "Pick an option first.";
  }
  function isEmpty(value) {
    return value === null || value === "" || Array.isArray(value) && value.length === 0;
  }
  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!target || !target.closest) return;
    const choice = target.closest("[data-lt-choice]");
    if (choice) {
      const group = choice.closest("[data-lt-choices]");
      const multi = !!group && group.hasAttribute("data-lt-multi");
      const pressed = choice.getAttribute("aria-pressed") === "true";
      if (group && !multi) group.querySelectorAll("[data-lt-choice]").forEach((el) => el.setAttribute("aria-pressed", "false"));
      choice.setAttribute("aria-pressed", multi ? String(!pressed) : "true");
      if (group) {
        emit("select", selection(group));
        const box = group.parentElement && group.parentElement.querySelector(".lt-error[data-lt-auto]");
        if (box) box.textContent = "";
      }
      if (group && group.hasAttribute("data-lt-instant") && !multi) {
        lantern.submit(selection(group)).catch(() => void 0);
      }
      return;
    }
    const submit = target.closest("[data-lt-submit]");
    if (submit && !submit.disabled) {
      event.preventDefault();
      const raw = submit.getAttribute("data-lt-submit");
      const value = raw ? parseValue(raw) : scopeValue(submit);
      if (!raw && isEmpty(value)) {
        showError(submit, submit.getAttribute("data-lt-empty") || emptyText());
        return;
      }
      showError(submit, "");
      lantern.submit(value).catch((error) => showError(submit, error.message));
      return;
    }
    const send = target.closest("[data-lt-send]");
    if (send) {
      event.preventDefault();
      lantern.send(send.getAttribute("data-lt-send") || "").catch(() => void 0);
      return;
    }
    const expand = target.closest("[data-lt-expand]");
    if (expand) {
      event.preventDefault();
      lantern.expand();
      return;
    }
    const full = target.closest("[data-lt-fullscreen]");
    if (full) {
      event.preventDefault();
      const request = document.fullscreenElement ? document.exitFullscreen() : root.requestFullscreen();
      request.catch(() => void 0);
      return;
    }
    const tab = target.closest('[role="tablist"] > [data-tab]');
    if (tab) {
      const tabs = tab.closest("[data-lt-tabs]");
      if (tabs) {
        const name2 = tab.getAttribute("data-tab");
        tabs.querySelectorAll('[role="tablist"] > [data-tab]').forEach((el) => el.setAttribute("aria-selected", String(el === tab)));
        tabs.querySelectorAll("[data-tab-panel]").forEach((el) => {
          if (el.getAttribute("data-tab-panel") === name2) el.removeAttribute("data-lt-hidden");
          else el.setAttribute("data-lt-hidden", "");
        });
      }
      return;
    }
    const move = target.closest("[data-lt-next],[data-lt-prev]");
    if (move) {
      const steps = move.closest("[data-lt-steps]");
      if (steps) stepTo(steps, Number(steps.getAttribute("data-index") || 0) + (move.hasAttribute("data-lt-next") ? 1 : -1));
      return;
    }
    const anchor = target.closest("a[href]");
    if (anchor && !event.defaultPrevented) {
      const href = anchor.getAttribute("href") || "";
      if (anchor.hasAttribute("download") && /^(blob|data):/i.test(anchor.href)) return;
      if (href.startsWith("#")) {
        event.preventDefault();
        const dest = document.getElementById(decodeURIComponent(href.slice(1)));
        if (dest) dest.scrollIntoView({ behavior: "smooth" });
        return;
      }
      let sameSite = false;
      try {
        sameSite = location.protocol.startsWith("http") && new URL(anchor.href).origin === location.origin;
      } catch {
        sameSite = false;
      }
      if (sameSite) return;
      event.preventDefault();
      if (/^https?:\/\//i.test(anchor.href)) lantern.openLink(anchor.href);
    }
  }, false);
  document.addEventListener("submit", (event) => {
    const form = event.target;
    if (!form || !form.hasAttribute("data-lt-form")) return;
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    lantern.submit(formValue(form)).catch((error) => showError(form.lastElementChild || form, error.message));
  });
  function stepTo(steps, index) {
    const panes = steps.querySelectorAll("[data-step]");
    if (panes.length === 0) return;
    const clamped = (index + panes.length) % panes.length;
    steps.setAttribute("data-index", String(clamped));
    panes.forEach((el, i) => {
      if (i === clamped) el.removeAttribute("data-lt-hidden");
      else el.setAttribute("data-lt-hidden", "");
    });
    const dots = steps.querySelector("[data-lt-dots]");
    if (dots) dots.innerHTML = Array.from(panes).map((_, i) => '<i class="' + (i === clamped ? "on" : "") + '"></i>').join("");
    emit("step", clamped);
  }
  function init() {
    document.documentElement.setAttribute("data-theme", scheme);
    applyState();
    document.querySelectorAll("[data-lt-tabs]").forEach((tabs) => {
      const first = tabs.querySelector('[role="tablist"] > [data-tab][aria-selected="true"]') || tabs.querySelector('[role="tablist"] > [data-tab]');
      if (first) first.click();
    });
    document.querySelectorAll("[data-lt-steps]").forEach((steps) => stepTo(steps, 0));
    if (state === "answered" && response !== void 0) {
      document.querySelectorAll("[data-lt-choices]").forEach((group) => {
        const wanted = [].concat(response);
        group.querySelectorAll("[data-lt-choice]").forEach((el) => {
          const value = parseValue(el.getAttribute("data-lt-choice"));
          if (wanted.some((w) => JSON.stringify(w) === JSON.stringify(value))) el.setAttribute("aria-pressed", "true");
        });
      });
    }
    if (typeof ResizeObserver === "function" && document.body) new ResizeObserver(schedule).observe(document.body);
    started = true;
    schedule();
    post({ type: "ready" });
  }
  let errors = 0;
  window.addEventListener("error", (event) => {
    if (/^ResizeObserver loop/.test(String(event.message))) return;
    if (errors++ < 3) post({ type: "error", message: String(event.message || "Script error") });
  });
  window.addEventListener("unhandledrejection", (event) => {
    if (errors++ < 3) post({ type: "error", message: String(event.reason && event.reason.message || event.reason || "Unhandled rejection") });
  });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
}

// src/frame/document.ts
var LAYERS = "@layer lantern-kit, lantern-theme;";
var TOKENS = kit_default.slice(0, Math.max(0, kit_default.indexOf("/* Base */")));
var BASE = "body{padding:var(--lt-pad,16px)}";
function scriptJson(value) {
  return JSON.stringify(value === void 0 ? null : value).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
}
var RUNTIME_SOURCE = `(${frameRuntime.toString()})();`;
function filePrelude(boot, withKit) {
  return `<meta charset="utf-8"><script type="application/json" id="lantern-boot">${scriptJson(boot)}</script><script>${RUNTIME_SOURCE.replace(/<\/script/gi, "<\\/script")}</script><style id="lantern-kit">${LAYERS}@layer lantern-kit{${withKit ? kit_default + BASE : TOKENS}}</style><style id="lantern-theme"></style>`;
}
function masked(html) {
  return html.replace(/<!--[\s\S]*?(-->|$)/g, (match) => " ".repeat(match.length)).replace(/(<script\b[^>]*>)([\s\S]*?)(<\/script>|$)/gi, (_m, open2, body, close) => open2 + " ".repeat(body.length) + close);
}
function findTag(html, name2) {
  const match = new RegExp(`<${name2}(\\s[^>]*)?>`, "i").exec(masked(html));
  if (!match) return null;
  const found = [html.slice(match.index, match.index + match[0].length)];
  found.index = match.index;
  return found;
}
function injectPrelude(html, prelude) {
  const headOpen = findTag(html, "head");
  if (headOpen) return html.slice(0, headOpen.index + headOpen[0].length) + prelude + html.slice(headOpen.index + headOpen[0].length);
  const htmlOpen = findTag(html, "html");
  if (htmlOpen) return html.slice(0, htmlOpen.index + htmlOpen[0].length) + `<head>${prelude}</head>` + html.slice(htmlOpen.index + htmlOpen[0].length);
  const doctype = /^\s*<!doctype[^>]*>/i.exec(html);
  if (doctype) return doctype[0] + prelude + html.slice(doctype[0].length);
  return prelude + html;
}

// src/host/files.ts
var FILE_ROUTE = "/lantern/files";
var TOKEN_TTL_MS = 8 * 60 * 60 * 1e3;
var MAX_FILE_BYTES = 64 * 1024 * 1024;
var MAX_HTML_BYTES = 8 * 1024 * 1024;
var MIME = {
  ".html": "text/html; charset=utf-8",
  ".htm": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".md": "text/plain; charset=utf-8",
  ".csv": "text/csv; charset=utf-8",
  ".xml": "application/xml",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".bmp": "image/bmp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".wasm": "application/wasm",
  ".pdf": "application/pdf",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".ogg": "audio/ogg",
  ".glb": "model/gltf-binary",
  ".gltf": "model/gltf+json",
  ".stl": "model/stl",
  ".obj": "text/plain; charset=utf-8"
};
var FileRefusal = class extends Error {
  status;
  constructor(message, status) {
    super(message);
    this.status = status;
  }
};
function hiddenSegment(rel) {
  return rel.split(/[\\/]/).some((part) => part.startsWith(".") && part !== "." && part !== "..");
}
async function confine(root, target) {
  const realRoot = await realpath(root).catch(() => {
    throw new FileRefusal("The working directory is not available.", 404);
  });
  const wanted = isAbsolute(target) ? target : resolve(realRoot, target);
  const relWanted = relative(realRoot, resolve(wanted));
  if (relWanted.startsWith("..") || isAbsolute(relWanted)) throw new FileRefusal(`${target} is outside the working directory.`, 403);
  if (hiddenSegment(relWanted)) throw new FileRefusal(`${target} is inside a hidden file or folder.`, 403);
  const abs = await realpath(wanted).catch(() => {
    throw new FileRefusal(`${target} was not found.`, 404);
  });
  const rel = relative(realRoot, abs);
  if (rel.startsWith("..") || isAbsolute(rel)) throw new FileRefusal(`${target} points outside the working directory.`, 403);
  if (hiddenSegment(rel)) throw new FileRefusal(`${target} is inside a hidden file or folder.`, 403);
  const info = await stat(abs);
  if (!info.isFile()) throw new FileRefusal(`${target} is not a file.`, 404);
  return { abs, rel: rel.split(sep).join("/"), size: info.size, dev: info.dev, ino: info.ino };
}
async function resolveEntry(root, path) {
  const ext = extname(path).toLowerCase();
  if (ext !== ".html" && ext !== ".htm") throw new FileRefusal(`${path} is not an .html file.`, 400);
  const file = await confine(root, path);
  if (file.size > MAX_HTML_BYTES) throw new FileRefusal(`${path} is larger than 8 MB.`, 413);
  return file.rel;
}
var FileServer = class {
  grants = /* @__PURE__ */ new Map();
  /**
   * A token for one folder: the page's own folder, not the whole workspace,
   * so a page can read its neighbours and subfolders but nothing above them.
   * Tokens expire a fixed time after they are issued.
   */
  grant(root) {
    this.sweep();
    const token = randomBytes(24).toString("base64url");
    this.grants.set(token, { root, expires: Date.now() + TOKEN_TTL_MS });
    return token;
  }
  sweep() {
    const now = Date.now();
    for (const [token, grant] of this.grants) if (grant.expires < now) this.grants.delete(token);
  }
  /** The `/lantern/files` prefix route. */
  handle = async (req, res) => {
    try {
      if (req.method !== "GET" && req.method !== "HEAD") return finish(res, 405, "Method not allowed");
      const url = new URL(req.url ?? "/", "http://lantern.invalid");
      const rest = url.pathname.startsWith(FILE_ROUTE + "/") ? url.pathname.slice(FILE_ROUTE.length + 1) : "";
      const slash = rest.indexOf("/");
      const token = slash < 0 ? rest : rest.slice(0, slash);
      this.sweep();
      const grant = this.grants.get(token);
      if (grant === void 0) return finish(res, 404, "This link has expired. Open the visual again from the chat.");
      let rel;
      try {
        rel = decodeURIComponent(slash < 0 ? "" : rest.slice(slash + 1));
      } catch {
        return finish(res, 400, "Bad path");
      }
      if (rel === "" || rel.endsWith("/")) rel += "index.html";
      if (rel.includes("\0") || rel.split("/").includes("..")) return finish(res, 403, "Forbidden");
      const file = await confine(grant.root, rel);
      if (file.size > MAX_FILE_BYTES) return finish(res, 413, "File too large");
      const handle = await open(file.abs, "r");
      try {
        const opened = await handle.stat();
        if (opened.dev !== file.dev || opened.ino !== file.ino || !opened.isFile()) return finish(res, 403, "Forbidden");
        const ext = extname(file.abs).toLowerCase();
        const type = MIME[ext] ?? "application/octet-stream";
        setHeaders(res, type);
        if (ext === ".html" || ext === ".htm") {
          if (opened.size > MAX_HTML_BYTES) return finish(res, 413, "File too large");
          const source = await handle.readFile("utf8");
          const id = (url.searchParams.get("lt") ?? "").replace(/[^\w.:-]/g, "").slice(0, 128);
          const scheme = url.searchParams.get("theme") === "dark" ? "dark" : "light";
          const lang = (url.searchParams.get("lang") ?? "").replace(/[^\w-]/g, "").slice(0, 16);
          const withKit = /<meta\s+[^>]*name\s*=\s*["']?lantern-kit/i.test(source);
          const body2 = Buffer.from(injectPrelude(source, filePrelude({
            id,
            state: "idle",
            response: null,
            scheme,
            mode: "panel",
            widgetState: null,
            streaming: false,
            lang
          }, withKit)), "utf8");
          res.setHeader("Content-Length", body2.length);
          res.statusCode = 200;
          res.end(req.method === "HEAD" ? void 0 : body2);
          return;
        }
        res.setHeader("Content-Length", opened.size);
        res.statusCode = 200;
        if (req.method === "HEAD") {
          res.end();
          return;
        }
        const body = await handle.readFile();
        res.end(body);
      } finally {
        await handle.close();
      }
    } catch (error) {
      if (error instanceof FileRefusal) return finish(res, error.status, error.message);
      if (!res.headersSent) finish(res, 500, "Could not read the file");
      else res.destroy();
    }
  };
};
function setHeaders(res, type) {
  res.setHeader("Content-Type", type);
  res.setHeader("Cache-Control", "private, no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Content-Security-Policy", "sandbox allow-scripts allow-forms allow-downloads");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
}
function finish(res, status, message) {
  if (res.headersSent) {
    res.destroy();
    return;
  }
  res.statusCode = status;
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.end(message);
}

// src/host/pending.ts
var PendingResponses = class {
  waiters = /* @__PURE__ */ new Map();
  /**
   * Wait until the visual is answered, dismissed, times out, or the call is
   * cancelled. Never rejects.
   */
  wait(callId, sessionId, signal, timeoutMs) {
    this.settle(callId, { kind: "closed" });
    return new Promise((resolve2) => {
      let done = false;
      const finish2 = (outcome) => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        signal.removeEventListener("abort", onAbort);
        if (this.waiters.get(callId)?.finish === finish2) this.waiters.delete(callId);
        resolve2(outcome);
      };
      const onAbort = () => finish2({ kind: "closed" });
      const timer = setTimeout(() => finish2({ kind: "timeout" }), timeoutMs);
      timer.unref?.();
      if (signal.aborted) {
        finish2({ kind: "closed" });
        return;
      }
      signal.addEventListener("abort", onAbort, { once: true });
      this.waiters.set(callId, { sessionId, finish: finish2 });
    });
  }
  isWaiting(callId) {
    return this.waiters.has(callId);
  }
  /** Session that owns a waiting call, when known. */
  sessionOf(callId) {
    return this.waiters.get(callId)?.sessionId;
  }
  settle(callId, outcome) {
    const waiter = this.waiters.get(callId);
    if (waiter === void 0) return "not-waiting";
    waiter.finish(outcome);
    return "settled";
  }
  /** Release every waiting call (plugin unload). */
  closeAll() {
    for (const waiter of [...this.waiters.values()]) waiter.finish({ kind: "closed" });
  }
};

// src/host/index.ts
var name = "dsh-lantern";
var inject = ["tools", "connection"];
var MAX_RESPONSE_CHARS = 64 * 1024;
var SKILL_DIR = new URL(import.meta.url.endsWith("/src/host/index.ts") ? "../../skills/lantern-visuals/" : "../skills/lantern-visuals/", import.meta.url);
function positive(value, fallback, what, max) {
  if (value === void 0) return fallback;
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0 || value > max) throw new Error(`dsh-lantern: ${what} must be a number between 0 and ${max}`);
  return value;
}
function waitKey(sessionId, callId) {
  return `${sessionId ?? ""}\0${callId}`;
}
function apply(rawCtx, config = {}) {
  const ctx = rawCtx;
  const timeoutMinutes = positive(config?.answerTimeoutMinutes, 15, "answerTimeoutMinutes", 24 * 60);
  const maxHtml = positive(config?.maxHtmlChars, 4e5, "maxHtmlChars", 4e6);
  const pending = new PendingResponses();
  const files = new FileServer();
  const cwdBySession = /* @__PURE__ */ new Map();
  ctx.effect(() => () => pending.closeAll(), "dsh-lantern: release waiting visuals");
  async function sessionCwd(sessionId) {
    const known = cwdBySession.get(sessionId);
    if (known !== void 0) return known;
    const sessions = ctx.get("sessions");
    const live = sessions?.get(sessionId)?.header?.cwd;
    if (live) return live;
    const persistence = ctx.get("sessionPersistence");
    const stored = await persistence?.stat(sessionId).catch(() => void 0);
    return stored?.header?.cwd;
  }
  async function execCwd(exec) {
    const wd = ctx.get("workingDirectory");
    if (wd && exec.agent) {
      try {
        return await wd.ensure(exec.agent, exec.signal);
      } catch {
      }
    }
    return exec.agent?.session?.header?.cwd;
  }
  ctx.tools.register({
    name: TOOL_NAME,
    description: toolDescription(timeoutMinutes),
    parameters: PARAMETERS,
    output: {
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          id: { type: "string" },
          status: { type: "string", enum: ["shown", "answered", "dismissed", "timeout", "closed"] },
          display: { type: "string", enum: ["inline", "panel"] },
          title: { type: "string" },
          path: { type: "string" },
          replace: { type: "string" },
          response: { type: "string" }
        },
        required: ["id", "status", "display", "title"]
      },
      render: (_args, value) => [{ type: "text", text: resultText(value, timeoutMinutes) }],
      presentationMeta: (_args, value) => ({ lantern: 1, ...value })
    },
    async execute(rawArgs, exec) {
      const args = readArgs(rawArgs, maxHtml);
      const sessionId = exec.agent?.session?.id ?? exec.agent?.id;
      const base = {
        id: exec.callId,
        status: "shown",
        display: args.path !== void 0 ? "panel" : args.display,
        title: args.title,
        ...args.replace !== void 0 ? { replace: args.replace } : {}
      };
      if (args.path !== void 0) {
        const cwd = await execCwd(exec);
        if (cwd === void 0) throw new Error("show_visual: no working directory for `path`; pass `html` instead.");
        if (sessionId !== void 0) cwdBySession.set(sessionId, cwd);
        try {
          base.path = await resolveEntry(cwd, args.path);
        } catch (error) {
          if (error instanceof FileRefusal) throw new Error(`show_visual: ${error.message}`);
          throw error;
        }
      }
      if (!args.await) return base;
      const outcome = await pending.wait(waitKey(sessionId, exec.callId), sessionId, exec.signal, timeoutMinutes * 6e4);
      switch (outcome.kind) {
        case "answered":
          return { ...base, status: "answered", response: String(outcome.response) };
        case "dismissed":
          return { ...base, status: "dismissed" };
        case "timeout":
          return { ...base, status: "timeout" };
        case "closed":
          return { ...base, status: "closed" };
      }
    }
  });
  route(ctx, "lantern.respond", async (payload) => {
    const key = waitKey(optionalString(payload, "sessionId"), stringField(payload, "callId", 200));
    const response = payload.response;
    let json2;
    try {
      json2 = JSON.stringify(response === void 0 ? null : response);
    } catch {
      throw new RouteError("bad-response", "The answer is not JSON.");
    }
    if (json2.length > MAX_RESPONSE_CHARS) throw new RouteError("too-large", "The answer is larger than 64 KB.");
    return { status: pending.settle(key, { kind: "answered", response: json2 }) };
  });
  route(ctx, "lantern.dismiss", async (payload) => {
    const key = waitKey(optionalString(payload, "sessionId"), stringField(payload, "callId", 200));
    return { status: pending.settle(key, { kind: "dismissed" }) };
  });
  route(ctx, "lantern.waiting", async (payload) => {
    const key = waitKey(optionalString(payload, "sessionId"), stringField(payload, "callId", 200));
    return { waiting: pending.isWaiting(key) };
  });
  route(ctx, "lantern.file", async (payload) => {
    const sessionId = stringField(payload, "sessionId", 200);
    const path = stringField(payload, "path", 4096);
    const cwd = await sessionCwd(sessionId);
    if (cwd === void 0) throw new RouteError("no-session", "The session working directory is unknown.");
    let rel;
    try {
      rel = await resolveEntry(cwd, path);
    } catch (error) {
      if (error instanceof FileRefusal) throw new RouteError("refused", error.message);
      throw error;
    }
    const entry = join(await realpath2(cwd), rel);
    const token = files.grant(dirname(entry));
    return { url: `${FILE_ROUTE.slice(1)}/${token}/${encodeURIComponent(basename(entry))}`, path: rel };
  });
  ctx.inject(["webServer"], (scope) => {
    const webServer = scope.webServer;
    scope.effect(() => webServer.register({ kind: "prefix", path: FILE_ROUTE, handler: files.handle }), "dsh-lantern: workspace files");
  });
  ctx.inject(["skills"], (scope) => {
    const skills = scope.skills;
    skills.registerProvider(() => skillProvider());
  });
}
function resultText(value, timeoutMinutes) {
  const where = value.display === "panel" ? "in the right sidebar" : "inline in the chat";
  const what = value.path !== void 0 ? `Workspace file ${value.path}` : `Visual "${value.title}"`;
  switch (value.status) {
    case "shown":
      return `${what} is shown ${where} (id: ${value.id}). If the user answers inside it, the answer arrives as their next message.`;
    case "answered":
      return `The user answered visual ${value.id} ("${value.title}"):
${value.response ?? "null"}`;
    case "dismissed":
      return `The user skipped visual ${value.id} ("${value.title}") without answering. Continue without it.`;
    case "timeout":
      return `No answer to visual ${value.id} within ${timeoutMinutes} minutes. It stays on screen; a later answer arrives as a user message.`;
    case "closed":
      return `Visual ${value.id} was closed before the user answered.`;
  }
}
function readArgs(raw, maxHtml) {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) throw new Error("show_visual: arguments must be an object");
  const value = raw;
  const title = typeof value.title === "string" ? value.title.trim() : "";
  if (title === "") throw new Error("show_visual: `title` is required");
  const html = value.html === void 0 || value.html === null || value.html === "" ? void 0 : value.html;
  const path = value.path === void 0 || value.path === null || value.path === "" ? void 0 : value.path;
  if (html !== void 0 && typeof html !== "string") throw new Error("show_visual: `html` must be a string");
  if (path !== void 0 && typeof path !== "string") throw new Error("show_visual: `path` must be a string");
  if (html === void 0 === (path === void 0)) throw new Error("show_visual: pass exactly one of `html` or `path`");
  if (typeof html === "string" && html.length > maxHtml) throw new Error(`show_visual: \`html\` is longer than ${maxHtml} characters; write it to a file and pass \`path\``);
  const display = value.display === "panel" ? "panel" : "inline";
  if (value.display !== void 0 && value.display !== "panel" && value.display !== "inline") throw new Error('show_visual: `display` must be "inline" or "panel"');
  if (value.await_response !== void 0 && typeof value.await_response !== "boolean") throw new Error("show_visual: `await_response` must be a boolean");
  const replace = typeof value.replace === "string" && value.replace.trim() !== "" ? value.replace.trim().slice(0, 200) : void 0;
  return {
    title: title.slice(0, 200),
    ...typeof html === "string" ? { html } : {},
    ...typeof path === "string" ? { path } : {},
    display,
    await: value.await_response === true,
    ...replace !== void 0 ? { replace } : {}
  };
}
var RouteError = class extends Error {
  code;
  constructor(code, message) {
    super(message);
    this.code = code;
  }
};
function optionalString(payload, key) {
  const value = payload[key];
  return typeof value === "string" && value !== "" && value.length <= 200 ? value : void 0;
}
function stringField(payload, key, max) {
  const value = payload[key];
  if (typeof value !== "string" || value === "" || value.length > max) throw new RouteError("bad-request", `\`${key}\` is required.`);
  return value;
}
function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });
}
function route(ctx, method, run) {
  ctx.effect(() => ctx.connection.fetch.register({
    path: `/api/${method}`,
    methods: ["POST"],
    requestBody: "buffered",
    async fetch(request) {
      let payload;
      try {
        payload = await request.json();
      } catch {
        return json({ ok: false, error: { code: "bad-request", message: "Body must be JSON." } }, 400);
      }
      if (typeof payload !== "object" || payload === null || Array.isArray(payload)) {
        return json({ ok: false, error: { code: "bad-request", message: "Body must be a JSON object." } }, 400);
      }
      try {
        return json({ ok: true, value: await run(payload) });
      } catch (error) {
        if (error instanceof RouteError) return json({ ok: false, error: { code: error.code, message: error.message } }, 400);
        return json({ ok: false, error: { code: "internal", message: error instanceof Error ? error.message : String(error) } }, 500);
      }
    }
  }), `dsh-lantern: ${method}`);
}
async function readSkill() {
  const text = await readFile(new URL("SKILL.md", SKILL_DIR), "utf8");
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(text);
  const front = match?.[1] ?? "";
  const description = /^description:\s*(.+)$/m.exec(front)?.[1]?.trim() ?? "Design guide for the show_visual tool.";
  return { description: description.slice(0, 500), content: match ? text.slice(match[0].length) : text };
}
function skillProvider() {
  const summary = (description) => ({
    name: SKILL_NAME,
    description,
    invocation: { modelInvocable: true, userInvocable: true },
    provider: "dsh-lantern",
    source: "bundled",
    resourceBase: { kind: "directory", path: fileURLToPath(SKILL_DIR) }
  });
  return {
    name: "dsh-lantern",
    async list() {
      const { description } = await readSkill();
      return [{ ...summary(description), rank: 600, locator: SKILL_NAME }];
    },
    async get() {
      const { description, content } = await readSkill();
      return { ...summary(description), content };
    }
  };
}
export {
  apply,
  inject,
  name
};
