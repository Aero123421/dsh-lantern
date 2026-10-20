// src/host/index.ts
import { readFile, realpath as realpath2 } from "node:fs/promises";
import { basename, dirname, isAbsolute as isAbsolute3, join, relative as relative2, resolve as resolve2, sep as sep2 } from "node:path";
import { fileURLToPath } from "node:url";

// src/host/description.ts
var TOOL_NAME = "show_visual";
var SKILL_NAME = "lantern-visuals";
function toolDescription(timeoutMinutes) {
  return [
    'Render HTML in DSH Web: inline in chat, or `display:"panel"` for more space. Pass exactly one of `html` or workspace `path` (HTML plus relative assets, always in the panel).',
    "The light/dark theme and CSS kit are preloaded: --lt-* tokens; lt-card, lt-stack, lt-row classes. Use native labeled controls and local JavaScript for live changes.",
    "window.lantern provides submit(JSON), send(text) for a follow-up message, setState(JSON)/getState() for saved inputs, and expand(). Submit/send require a user action.",
    "Embed data, images and libraries in html: external fetch, images and CDN scripts are blocked. A path page can fetch relative files in its own folder.",
    `A button can use data-lt-submit='"yes"'; a form with data-lt-form submits its named fields. Set await_response:true only to wait for the answer as this tool result.`,
    `Waiting expires after ${timeoutMinutes} minutes. Keep the conclusion and sources in prose. Use replace with an earlier visual id to revise it. No skill loading is needed.`
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
var kit_default = '/*\n * Lantern kit: design tokens and a few components available in every visual.\n * Everything is a starting point. A visual may override any token on :root,\n * load its own fonts, or ignore the components entirely.\n */\n\n:root {\n  color-scheme: light;\n  /* Typography */\n  --lt-font-sans: system-ui, -apple-system, "Segoe UI", "Hiragino Sans", "Noto Sans JP", "Noto Sans CJK JP", "Yu Gothic UI", sans-serif;\n  --lt-font-serif: "Noto Serif JP", "Hiragino Mincho ProN", "Yu Mincho", Georgia, serif;\n  --lt-font-mono: ui-monospace, "SFMono-Regular", Menlo, Consolas, "Noto Sans Mono CJK JP", monospace;\n  --lt-font: var(--lt-font-sans);\n  --lt-text-xs: 12px;\n  --lt-text-sm: 13px;\n  --lt-text-md: 14px;\n  --lt-text-lg: 16px;\n  --lt-text-xl: 20px;\n  --lt-text-2xl: 26px;\n  --lt-text-3xl: 34px;\n  --lt-leading: 1.65;\n  --lt-weight-regular: 400;\n  --lt-weight-strong: 600;\n\n  /* Color: surfaces and text */\n  --lt-bg: #ffffff;\n  --lt-surface: #f6f7f9;\n  --lt-surface-2: #eef0f4;\n  --lt-fg: #1b1f27;\n  --lt-fg-2: #5b6372;\n  --lt-fg-3: #8a91a0;\n  --lt-border: #e2e5eb;\n  --lt-border-strong: #c9ced8;\n\n  /* Color: roles */\n  --lt-accent: #3b6cf0;\n  --lt-accent-fg: #ffffff;\n  --lt-accent-soft: rgba(59, 108, 240, .12);\n  --lt-success: #13865b;\n  --lt-success-soft: rgba(19, 134, 91, .13);\n  --lt-warning: #b45c00;\n  --lt-warning-soft: rgba(214, 138, 0, .15);\n  --lt-danger: #c9372c;\n  --lt-danger-soft: rgba(201, 55, 44, .12);\n\n  /* Data series (charts, legends) */\n  --lt-series-1: #3b6cf0;\n  --lt-series-2: #1aa37a;\n  --lt-series-3: #e08a1e;\n  --lt-series-4: #d24d7a;\n  --lt-series-5: #7a5af0;\n  --lt-series-6: #1696b8;\n  --lt-series-7: #8c9a2b;\n  --lt-series-8: #8a6a52;\n\n  /* Shape, space, depth, motion */\n  --lt-radius-sm: 6px;\n  --lt-radius: 10px;\n  --lt-radius-lg: 14px;\n  --lt-radius-full: 999px;\n  --lt-space-1: 4px;\n  --lt-space-2: 8px;\n  --lt-space-3: 12px;\n  --lt-space-4: 16px;\n  --lt-space-5: 24px;\n  --lt-space-6: 32px;\n  --lt-space-7: 48px;\n  --lt-shadow-sm: 0 1px 2px rgba(16, 24, 40, .06);\n  --lt-shadow: 0 4px 16px rgba(16, 24, 40, .08);\n  --lt-ease: cubic-bezier(.2, .7, .2, 1);\n  --lt-dur: 180ms;\n}\n\n:root[data-theme="dark"] {\n  color-scheme: dark;\n  --lt-bg: #17181c;\n  --lt-surface: #202228;\n  --lt-surface-2: #2a2c33;\n  --lt-fg: #e9ebf0;\n  --lt-fg-2: #a3a9b5;\n  --lt-fg-3: #767c88;\n  --lt-border: #31343c;\n  --lt-border-strong: #454953;\n  --lt-accent: #6f95ff;\n  --lt-accent-fg: #0d1220;\n  --lt-accent-soft: rgba(111, 149, 255, .16);\n  --lt-success: #3cc58b;\n  --lt-success-soft: rgba(60, 197, 139, .15);\n  --lt-warning: #f0b44c;\n  --lt-warning-soft: rgba(240, 180, 76, .15);\n  --lt-danger: #ff7a6e;\n  --lt-danger-soft: rgba(255, 122, 110, .14);\n  --lt-series-1: #6f95ff;\n  --lt-series-2: #3cc58b;\n  --lt-series-3: #f0a54c;\n  --lt-series-4: #f07ba3;\n  --lt-series-5: #a58cff;\n  --lt-series-6: #4cc3e0;\n  --lt-series-7: #bccb5a;\n  --lt-series-8: #c49f84;\n  --lt-shadow-sm: 0 1px 2px rgba(0, 0, 0, .3);\n  --lt-shadow: 0 6px 20px rgba(0, 0, 0, .35);\n}\n\n/* Base */\n*, *::before, *::after { box-sizing: border-box; }\nhtml, body { margin: 0; }\n/* An inline card is as tall as its content, so it never needs a scrollbar of its own. */\n:root[data-lt-mode="inline"]:not([data-lt-overflow]) { overflow-y: hidden; }\nbody {\n  background: var(--lt-bg);\n  color: var(--lt-fg);\n  font-family: var(--lt-font);\n  font-size: var(--lt-text-md);\n  line-height: var(--lt-leading);\n  -webkit-font-smoothing: antialiased;\n  overflow-wrap: anywhere;\n}\nh1, h2, h3, h4 { margin: 0 0 var(--lt-space-2); line-height: 1.3; font-weight: var(--lt-weight-strong); }\nh1 { font-size: var(--lt-text-2xl); }\nh2 { font-size: var(--lt-text-xl); }\nh3 { font-size: var(--lt-text-lg); }\nh4 { font-size: var(--lt-text-md); }\np { margin: 0 0 var(--lt-space-3); }\na { color: var(--lt-accent); text-decoration: none; }\na:hover { text-decoration: underline; }\nsmall { font-size: var(--lt-text-sm); color: var(--lt-fg-2); }\nhr { border: 0; border-top: 1px solid var(--lt-border); margin: var(--lt-space-4) 0; }\ncode, kbd, pre, samp { font-family: var(--lt-font-mono); font-size: .92em; }\ncode { background: var(--lt-surface-2); padding: .1em .35em; border-radius: var(--lt-radius-sm); }\npre { background: var(--lt-surface); border: 1px solid var(--lt-border); padding: var(--lt-space-3) var(--lt-space-4); border-radius: var(--lt-radius); overflow: auto; }\npre code { background: none; padding: 0; }\nkbd { border: 1px solid var(--lt-border-strong); border-bottom-width: 2px; border-radius: var(--lt-radius-sm); padding: 0 .4em; background: var(--lt-surface); }\nimg, svg, canvas, video { max-width: 100%; }\ntable { border-collapse: collapse; width: 100%; font-size: var(--lt-text-sm); }\nth, td { text-align: left; padding: var(--lt-space-2) var(--lt-space-3); border-bottom: 1px solid var(--lt-border); vertical-align: top; }\nth { color: var(--lt-fg-2); font-weight: var(--lt-weight-strong); }\n::selection { background: var(--lt-accent-soft); }\n\n/* Form controls */\nbutton, input, select, textarea { font: inherit; color: inherit; }\nbutton, .lt-btn {\n  display: inline-flex; align-items: center; justify-content: center; gap: var(--lt-space-2);\n  min-height: 34px; padding: 0 var(--lt-space-4);\n  border: 1px solid var(--lt-border-strong); border-radius: var(--lt-radius);\n  background: var(--lt-bg); color: var(--lt-fg); cursor: pointer;\n  transition: background var(--lt-dur) var(--lt-ease), border-color var(--lt-dur) var(--lt-ease), transform 80ms ease;\n}\nbutton:hover, .lt-btn:hover { background: var(--lt-surface); }\nbutton:active, .lt-btn:active { transform: scale(.98); }\nbutton:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible, [tabindex]:focus-visible {\n  outline: 2px solid var(--lt-accent); outline-offset: 2px;\n}\nbutton:disabled { opacity: .5; cursor: default; transform: none; }\n.lt-btn.primary, button.primary { background: var(--lt-accent); border-color: var(--lt-accent); color: var(--lt-accent-fg); font-weight: var(--lt-weight-strong); }\n.lt-btn.primary:hover, button.primary:hover { filter: brightness(1.06); }\n.lt-btn.ghost, button.ghost { background: transparent; border-color: transparent; color: var(--lt-fg-2); }\n.lt-btn.ghost:hover, button.ghost:hover { background: var(--lt-surface); color: var(--lt-fg); }\n.lt-btn.danger, button.danger { color: var(--lt-danger); border-color: var(--lt-danger); background: transparent; }\n.lt-btn.small, button.small { min-height: 28px; padding: 0 var(--lt-space-3); font-size: var(--lt-text-sm); }\ninput[type="text"], input[type="number"], input[type="email"], input[type="search"], input[type="url"], input[type="date"], input[type="time"], input:not([type]), select, textarea {\n  width: 100%; min-height: 34px; padding: 6px var(--lt-space-3);\n  border: 1px solid var(--lt-border-strong); border-radius: var(--lt-radius); background: var(--lt-bg);\n}\ntextarea { min-height: 80px; resize: vertical; }\ninput[type="range"] { width: auto; flex: 1 1 8em; min-width: 0; max-width: 100%; accent-color: var(--lt-accent); }\ninput[type="checkbox"], input[type="radio"] { accent-color: var(--lt-accent); width: 16px; height: 16px; flex: none; }\nlabel { display: inline-flex; align-items: center; gap: var(--lt-space-2); flex-wrap: nowrap; }\n\n/* Layout */\n.lt-stack { display: flex; flex-direction: column; gap: var(--lt-space-3); }\n.lt-row { display: flex; align-items: center; gap: var(--lt-space-3); flex-wrap: wrap; }\n.lt-spread { display: flex; align-items: center; justify-content: space-between; gap: var(--lt-space-3); }\n.lt-grid { display: grid; gap: var(--lt-space-3); grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--lt-grid-min, 180px)), 1fr)); }\n.lt-pad { padding: var(--lt-space-4); }\n.lt-center { display: grid; place-items: center; }\n.lt-muted { color: var(--lt-fg-2); }\n.lt-faint { color: var(--lt-fg-3); }\n.lt-mono { font-family: var(--lt-font-mono); }\n.lt-serif { font-family: var(--lt-font-serif); }\n.lt-num { font-variant-numeric: tabular-nums; }\n\n/* Surfaces */\n.lt-card { background: var(--lt-bg); border: 1px solid var(--lt-border); border-radius: var(--lt-radius-lg); padding: var(--lt-space-4); }\n.lt-card.soft { background: var(--lt-surface); border-color: transparent; }\n.lt-card.raised { box-shadow: var(--lt-shadow); border-color: transparent; }\n.lt-divider { height: 1px; background: var(--lt-border); margin: var(--lt-space-3) 0; }\n\n/* Labels */\n.lt-badge { display: inline-flex; align-items: center; gap: 4px; padding: 1px 9px; border-radius: var(--lt-radius-full); font-size: var(--lt-text-xs); font-weight: var(--lt-weight-strong); background: var(--lt-surface-2); color: var(--lt-fg-2); }\n.lt-badge.accent { background: var(--lt-accent-soft); color: var(--lt-accent); }\n.lt-badge.ok { background: var(--lt-success-soft); color: var(--lt-success); }\n.lt-badge.warn { background: var(--lt-warning-soft); color: var(--lt-warning); }\n.lt-badge.bad { background: var(--lt-danger-soft); color: var(--lt-danger); }\n\n/* Callouts */\n.lt-callout { border-radius: var(--lt-radius); padding: var(--lt-space-3) var(--lt-space-4); background: var(--lt-surface); border: 1px solid var(--lt-border); }\n.lt-callout.info { background: var(--lt-accent-soft); border-color: transparent; }\n.lt-callout.ok { background: var(--lt-success-soft); border-color: transparent; }\n.lt-callout.warn { background: var(--lt-warning-soft); border-color: transparent; }\n.lt-callout.bad { background: var(--lt-danger-soft); border-color: transparent; }\n\n/* Chips and choices: selection is shown with aria-pressed="true" or .selected */\n.lt-chip { min-height: 30px; padding: 0 var(--lt-space-3); border-radius: var(--lt-radius-full); background: var(--lt-surface); border-color: var(--lt-border); font-size: var(--lt-text-sm); }\n.lt-chip[aria-pressed="true"], .lt-chip.selected { background: var(--lt-accent-soft); border-color: var(--lt-accent); color: var(--lt-accent); font-weight: var(--lt-weight-strong); }\n.lt-choices { display: grid; gap: var(--lt-space-2); grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--lt-choice-min, 170px)), 1fr)); }\n.lt-choice {\n  display: flex; flex-direction: column; align-items: flex-start; justify-content: flex-start; gap: 2px;\n  text-align: left; min-height: 0; padding: var(--lt-space-3) var(--lt-space-4);\n  border: 1px solid var(--lt-border); border-radius: var(--lt-radius-lg); background: var(--lt-bg);\n}\n.lt-choice b, .lt-choice strong { font-weight: var(--lt-weight-strong); }\n.lt-choice span, .lt-choice small { color: var(--lt-fg-2); font-size: var(--lt-text-sm); line-height: 1.5; }\n.lt-choice:hover { border-color: var(--lt-border-strong); background: var(--lt-surface); }\n.lt-choice[aria-pressed="true"], .lt-choice.selected { border-color: var(--lt-accent); background: var(--lt-accent-soft); }\n.lt-choice[aria-pressed="true"] b, .lt-choice.selected b { color: var(--lt-accent); }\n\n/* Fields */\n.lt-field { display: flex; flex-direction: column; align-items: stretch; gap: 6px; }\n.lt-field > span:first-child, .lt-field > label:first-child { font-size: var(--lt-text-sm); color: var(--lt-fg-2); font-weight: var(--lt-weight-strong); }\n.lt-error { color: var(--lt-danger); font-size: var(--lt-text-sm); min-height: 1em; }\n\n/* Numbers */\n.lt-stat { background: var(--lt-surface); border-radius: var(--lt-radius); padding: var(--lt-space-3) var(--lt-space-4); }\n.lt-stat > :first-child { font-size: var(--lt-text-sm); color: var(--lt-fg-2); }\n.lt-stat > :nth-child(2) { font-size: var(--lt-text-2xl); font-weight: var(--lt-weight-strong); font-variant-numeric: tabular-nums; line-height: 1.25; }\n.lt-progress { height: 8px; border-radius: var(--lt-radius-full); background: var(--lt-surface-2); overflow: hidden; }\n.lt-progress > i { display: block; height: 100%; width: var(--value, 0%); background: var(--lt-accent); border-radius: inherit; transition: width var(--lt-dur) var(--lt-ease); }\n.lt-kv { display: grid; grid-template-columns: max-content 1fr; gap: 6px var(--lt-space-4); font-size: var(--lt-text-sm); }\n.lt-kv > :nth-child(odd) { color: var(--lt-fg-2); }\n\n/* Tabs (data-lt-tabs) and steps (data-lt-steps): panels are switched by the runtime */\n.lt-tabs > [role="tablist"] { display: flex; gap: var(--lt-space-1); border-bottom: 1px solid var(--lt-border); margin-bottom: var(--lt-space-3); }\n.lt-tabs > [role="tablist"] > button { border: 0; border-bottom: 2px solid transparent; border-radius: 0; background: transparent; color: var(--lt-fg-2); min-height: 34px; padding: 0 var(--lt-space-3); }\n.lt-tabs > [role="tablist"] > button[aria-selected="true"] { color: var(--lt-fg); border-bottom-color: var(--lt-accent); font-weight: var(--lt-weight-strong); }\n[data-lt-hidden] { display: none !important; }\n.lt-dots { display: flex; gap: 6px; justify-content: center; }\n.lt-dots > i { width: 7px; height: 7px; border-radius: 50%; background: var(--lt-border-strong); }\n.lt-dots > i.on { background: var(--lt-accent); }\n\n/* Motion */\n@media (prefers-reduced-motion: no-preference) {\n  .lt-fade-in { animation: lt-fade-in .3s var(--lt-ease) both; }\n  @keyframes lt-fade-in { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }\n}\n@media (prefers-reduced-motion: reduce) {\n  *, *::before, *::after { transition-duration: 0s !important; animation-duration: 0s !important; }\n}\n';

// src/frame/runtime.ts
function frameRuntime() {
  "use strict";
  const TAG = "__lantern";
  const MAX_JSON = 64 * 1024;
  const startsWith = Function.prototype.call.bind(String.prototype.startsWith);
  const SafeURL = URL;
  const bootNode = document.getElementById("lantern-boot");
  const boot = JSON.parse(bootNode && bootNode.textContent || "{}");
  const realLocation = location;
  const realDocument = document;
  function allowedTarget(url) {
    if (typeof url !== "string") return void 0;
    if (realLocation.protocol !== "http:" && realLocation.protocol !== "https:") return void 0;
    try {
      const next = new SafeURL(url, realLocation.href);
      if (next.protocol !== "http:" && next.protocol !== "https:") return void 0;
      const dir = new SafeURL("./", realLocation.href).href;
      return startsWith(next.href, dir) ? next.href : void 0;
    } catch {
      return void 0;
    }
  }
  const realAssign = realLocation.assign.bind(realLocation);
  const realReplace = realLocation.replace.bind(realLocation);
  const ltLoc = {
    assign(url) {
      const next = allowedTarget(url);
      if (next !== void 0) realAssign(next);
    },
    replace(url) {
      const next = allowedTarget(url);
      if (next !== void 0) realReplace(next);
    },
    reload() {
    },
    toString() {
      return realLocation.href;
    },
    valueOf() {
      return realLocation.href;
    }
  };
  for (const key of ["href", "origin", "protocol", "host", "hostname", "port", "pathname", "search", "hash"]) {
    Object.defineProperty(ltLoc, key, {
      configurable: true,
      enumerable: true,
      get() {
        return realLocation[key];
      },
      set(value) {
        const next = allowedTarget(value);
        if (key === "href" && next !== void 0) realAssign(next);
      }
    });
  }
  const ltWin = new Proxy(window, {
    get(target, key) {
      if (key === "location") return ltLoc;
      if (key === "document") return ltDoc;
      if (key === "top" || key === "parent" || key === "self" || key === "frames" || key === "globalThis") return ltWin;
      const value = target[key];
      return typeof value === "function" ? value.bind(target) : value;
    },
    set(target, key, value) {
      if (key === "location") {
        const next = allowedTarget(value);
        if (next !== void 0) realAssign(next);
        return true;
      }
      ;
      target[key] = value;
      return true;
    }
  });
  function cageInline(html) {
    return String(html).replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi, (full, attrs, body) => {
      if (/\bsrc\s*=/i.test(attrs) || /\btype\s*=\s*["']?module/i.test(attrs)) return full;
      const wrapped = `(function(__ltLoc,__ltWin,__ltDoc){const location=__ltLoc,window=__ltWin,top=window,parent=window,self=window,globalThis=window,frames=window,document=__ltDoc;
${body}
}).call(globalThis.__ltWin,globalThis.__ltLoc,globalThis.__ltWin,globalThis.__ltDoc)`;
      return `<script${attrs}>${wrapped}</script>`;
    });
  }
  const ltDoc = new Proxy(realDocument, {
    get(target, key) {
      if (key === "location") return ltLoc;
      if (key === "defaultView") return ltWin;
      const value = target[key];
      if ((key === "write" || key === "writeln") && typeof value === "function") {
        const write = value;
        return (html) => write.call(target, cageInline(html));
      }
      return typeof value === "function" ? value.bind(target) : value;
    },
    set(target, key, value) {
      if (key === "location") {
        const next = allowedTarget(value);
        if (next !== void 0) realAssign(next);
        return true;
      }
      ;
      target[key] = value;
      return true;
    }
  });
  window.__ltLoc = ltLoc;
  window.__ltWin = ltWin;
  window.__ltDoc = ltDoc;
  try {
    const owner = Object.getOwnPropertyDescriptor(Node.prototype, "ownerDocument");
    if (owner && owner.configurable) Object.defineProperty(Node.prototype, "ownerDocument", { configurable: true, get() {
      return ltDoc;
    } });
  } catch {
  }
  try {
    const view = Object.getOwnPropertyDescriptor(Document.prototype, "defaultView");
    if (view && view.configurable) Object.defineProperty(Document.prototype, "defaultView", { configurable: true, get() {
      return ltWin;
    } });
  } catch {
  }
  try {
    const nav = window.navigation;
    if (nav && typeof nav.addEventListener === "function") {
      nav.addEventListener("navigate", (event) => {
        const raw = event.destination && event.destination.url;
        if (allowedTarget(raw) === void 0 && event.cancelable) event.preventDefault();
      });
    }
  } catch {
  }
  let bridge = boot.bridge;
  let state = boot.state || "idle";
  let response = boot.response;
  let scheme = boot.scheme || "light";
  let widgetState = boot.widgetState === void 0 ? null : boot.widgetState;
  const restorePrefix = "dsh-lantern:boot:";
  if (window.name.startsWith(restorePrefix)) {
    const raw = window.name.slice(restorePrefix.length);
    window.name = "";
    try {
      const saved = raw.length <= MAX_JSON * 3 ? JSON.parse(raw) : null;
      if (saved && saved.id === boot.id) {
        bridge = saved.bridge;
        if (["idle", "waiting", "answered", "dismissed", "timeout", "closed"].includes(saved.state)) state = saved.state;
        response = saved.response;
        widgetState = saved.widgetState === void 0 ? null : saved.widgetState;
      }
    } catch {
    }
  }
  let nextId = 1;
  const waits = /* @__PURE__ */ Object.create(null);
  const activation = navigator.userActivation;
  const activeGetter = activation && Object.getOwnPropertyDescriptor(Object.getPrototypeOf(activation), "isActive")?.get;
  const userIsActive = activeGetter?.bind(activation);
  const NativePromise = Promise;
  const rejectPromise = Promise.reject.bind(Promise);
  const readMessageData = Function.prototype.call.bind(Object.getOwnPropertyDescriptor(MessageEvent.prototype, "data").get);
  const channel = new MessageChannel();
  const sendMessage = channel.port1.postMessage.bind(channel.port1);
  const onMessage = channel.port1.addEventListener.bind(channel.port1);
  const startMessages = channel.port1.start.bind(channel.port1);
  const connect = parent.postMessage.bind(parent);
  connect({ [TAG]: 1, type: "connect", bridge }, "*", [channel.port2]);
  delete boot.bridge;
  if (bootNode) bootNode.textContent = "";
  bootNode?.remove();
  function post(message) {
    const envelope = { ...message, [TAG]: 1 };
    if (envelope.type === "submit" || envelope.type === "send" || envelope.type === "open-link" || envelope.type === "expand") requireUser();
    sendMessage(envelope);
  }
  function requireUser() {
    if (!userIsActive?.()) throw new Error("Only a user action inside the visual can do this.");
  }
  function call(type, payload) {
    const id = nextId++;
    return new NativePromise((resolve3, reject) => {
      waits[id] = { resolve: resolve3, reject };
      post({ type, id, ...payload });
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
    const locked = isLocked();
    document.querySelectorAll('[data-lt-choice], [data-lt-submit], form[data-lt-form] button:not([type="button"]), form[data-lt-form] input[type="submit"]').forEach((el) => {
      const button = el;
      if (locked && !button.disabled && button.getAttribute("aria-disabled") !== "true") {
        button.disabled = true;
        button.setAttribute("data-lt-locked", "");
        button.setAttribute("aria-disabled", "true");
      } else if (!locked && button.hasAttribute("data-lt-locked")) {
        button.disabled = false;
        button.removeAttribute("data-lt-locked");
        button.removeAttribute("aria-disabled");
      }
    });
    if (state === "answered" && response !== void 0) {
      const wanted = [].concat(response);
      document.querySelectorAll("[data-lt-choices]").forEach((group) => {
        group.querySelectorAll("[data-lt-choice]").forEach((el) => {
          const value = parseValue(el.getAttribute("data-lt-choice"));
          el.setAttribute("aria-pressed", String(wanted.some((item) => JSON.stringify(item) === JSON.stringify(value))));
        });
      });
    }
  }
  function isLocked() {
    return state === "answered" || state === "dismissed" || state === "closed";
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
      if (isLocked()) return rejectPromise(new Error("This visual is already settled."));
      try {
        requireUser();
        return call("submit", { json: toJson(value, "submit") });
      } catch (error) {
        return rejectPromise(error);
      }
    },
    send(text) {
      if (typeof text !== "string" || text.trim() === "") return rejectPromise(new TypeError("lantern.send: text must be a non-empty string"));
      try {
        requireUser();
        return call("send", { text: text.slice(0, 4e3) });
      } catch (error) {
        return rejectPromise(error);
      }
    },
    openLink(url) {
      if (userIsActive?.()) post({ type: "open-link", url: String(url) });
    },
    expand() {
      if (userIsActive?.()) post({ type: "expand" });
    },
    getState() {
      return widgetState;
    },
    setState(value) {
      const json2 = toJson(value, "setState");
      widgetState = value;
      post({ type: "set-state", json: json2 });
    },
    colors: readColors,
    on(name2, handler) {
      const listener = (event) => handler(event.detail);
      window.addEventListener("lantern:" + name2, listener);
      return () => window.removeEventListener("lantern:" + name2, listener);
    }
  };
  Object.defineProperty(window, "lantern", { value: Object.freeze(lantern), configurable: false, writable: false, enumerable: true });
  onMessage("message", (event) => {
    const message = event;
    const data = readMessageData(message);
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
  startMessages();
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
    const lang = String(boot.lang || "en").toLowerCase();
    if (startsWith(lang, "ja")) return "\u9078\u3093\u3067\u304B\u3089\u9001\u3063\u3066\u304F\u3060\u3055\u3044\u3002";
    if (startsWith(lang, "zh")) return "\u8BF7\u5148\u9009\u62E9\u518D\u63D0\u4EA4\u3002";
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
      if (isLocked() || choice.disabled || choice.getAttribute("aria-disabled") === "true") return;
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
        lantern.submit(selection(group)).catch((error) => showError(choice, error.message));
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
      if (startsWith(href, "#")) {
        event.preventDefault();
        const dest = document.getElementById(decodeURIComponent(href.slice(1)));
        if (dest) dest.scrollIntoView({ behavior: "smooth" });
        return;
      }
      if (allowedTarget(anchor.href) !== void 0) return;
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
function visualCsp(nonce) {
  const script = nonce ? `script-src 'nonce-${nonce}'` : "script-src 'unsafe-inline' data: blob:";
  return [
    "default-src 'none'",
    script,
    "style-src 'unsafe-inline' data: blob:",
    "img-src data: blob:",
    "font-src data: blob:",
    "connect-src data: blob:",
    "media-src data: blob:",
    "worker-src 'none'",
    "frame-src 'none'",
    "object-src 'none'",
    "form-action 'none'",
    "base-uri 'none'",
    "navigate-to 'none'"
  ].join("; ");
}
var VISUAL_CSP = visualCsp();
function filePrelude(boot, withKit) {
  return `<meta charset="utf-8"><meta name="referrer" content="no-referrer"><script type="application/json" id="lantern-boot">${scriptJson(boot)}</script><script>${RUNTIME_SOURCE.replace(/<\/script/gi, "<\\/script")}</script><style id="lantern-kit">${LAYERS}@layer lantern-kit{${withKit ? kit_default + BASE : TOKENS}}</style><style id="lantern-theme"></style>`;
}
function injectPrelude(html, prelude) {
  return `<!doctype html><head>${prelude}</head>${html.replace(/^\uFEFF/, "")}`;
}
function cageScripts(html) {
  const noRefresh = html.replace(/<meta\b[^>]*>/gi, (tag) => /http-equiv\s*=\s*["']?\s*refresh/i.test(tag) ? "" : tag);
  return noRefresh.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi, (full, attrs, body) => {
    const type = /\btype\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/i.exec(attrs);
    const kind = (type?.[1] || type?.[2] || type?.[3] || "").trim().toLowerCase();
    if (kind !== "" && kind !== "text/javascript" && kind !== "application/javascript" && kind !== "module") return full;
    if (/\bsrc\s*=/i.test(attrs) || kind === "module") return full;
    const cleaned = attrs;
    const wrapped = `(function(__ltLoc,__ltWin,__ltDoc){const location=__ltLoc,window=__ltWin,top=window,parent=window,self=window,globalThis=window,frames=window,document=__ltDoc;
${body}
}).call(globalThis.__ltWin,globalThis.__ltLoc,globalThis.__ltWin,globalThis.__ltDoc)`;
    return `<script${cleaned}>${wrapped.replace(/<\/script/gi, "<\\/script")}</script>`;
  });
}

// src/host/files.ts
function headerOne(value) {
  const raw = Array.isArray(value) ? value[0] : value;
  return (raw ?? "").split(",")[0].trim();
}
function requestOrigin(req) {
  const host = headerOne(req.headers?.host);
  if (host === "" || /[\s/"'<>;]/.test(host)) return void 0;
  const forwarded = headerOne(req.headers?.["x-forwarded-proto"]);
  const proto = forwarded === "https" ? "https" : "http";
  const origin = `${proto}://${host}`;
  return /^https?:\/\/[^/\s;"']+$/.test(origin) ? origin : void 0;
}
function fileContentSecurityPolicy(origin, token) {
  const prefix = /^https?:\/\/[^/\s;"']+$/.test(origin) && /^[\w-]+$/.test(token) ? `${origin}${FILE_ROUTE}/${token}/` : void 0;
  const self = prefix ?? "'none'";
  const extra = prefix ?? "'none'";
  return [
    `default-src ${self}`,
    `script-src ${extra} 'unsafe-inline'`,
    `style-src ${extra} 'unsafe-inline'`,
    `img-src ${extra} data: blob:`,
    `font-src ${extra} data:`,
    `connect-src ${extra}`,
    `media-src ${extra} data: blob:`,
    `worker-src 'none'`,
    `frame-src 'none'`,
    `object-src 'none'`,
    `form-action 'none'`,
    `base-uri 'none'`,
    `navigate-to 'none'`,
    "sandbox allow-scripts allow-forms allow-downloads"
  ].join("; ");
}
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
        setHeaders(res, type, requestOrigin(req), token);
        if (ext === ".html" || ext === ".htm") {
          if (opened.size > MAX_HTML_BYTES) return finish(res, 413, "File too large");
          const source = await handle.readFile("utf8");
          const id = url.searchParams.get("lt") ?? "";
          if (id.length > 200) return finish(res, 400, "Invalid visual id");
          const scheme = url.searchParams.get("theme") === "dark" ? "dark" : "light";
          const lang = (url.searchParams.get("lang") ?? "").replace(/[^\w-]/g, "").slice(0, 16);
          const withKit = /<meta\s+[^>]*name\s*=\s*["']?lantern-kit/i.test(source);
          const body2 = Buffer.from(injectPrelude(cageScripts(source), filePrelude({
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
function setHeaders(res, type, origin, token) {
  res.setHeader("Content-Type", type);
  res.setHeader("Cache-Control", "private, no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Content-Security-Policy", fileContentSecurityPolicy(origin ?? "", token));
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

// src/host/history.ts
import { isAbsolute as isAbsolute2 } from "node:path";
function object(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value) ? value : void 0;
}
function failure(data, message) {
  if (data.isError !== true && message?.isError !== true) return void 0;
  const reason = object(data.error)?.reason;
  if (typeof reason === "string") return reason;
  const content = message?.content ?? data.content;
  const text = Array.isArray(content) ? content.map((block) => {
    const item = object(block);
    return item?.type === "text" && typeof item.text === "string" ? item.text : "";
  }).filter(Boolean).join("\n") : "";
  return text || "The visual failed.";
}
function findVisual(events, callId) {
  let visual;
  for (const raw of events) {
    const event = object(raw);
    const data = object(event?.data);
    if (!event || !data) continue;
    if (event.type === "tool/call" && data.callId === callId && data.name === TOOL_NAME && typeof data.arguments === "string") {
      visual = { arguments: data.arguments, ...typeof event.seq === "number" ? { seq: event.seq } : {} };
    } else if ((event.type === "tool/ptc-dispatch-start" || event.type === "tool/ptc-dispatch") && data.subCallId === callId && data.name === TOOL_NAME) {
      visual ??= { arguments: JSON.stringify(data.arguments ?? {}), ...typeof event.seq === "number" ? { seq: event.seq } : {} };
      if (event.type === "tool/ptc-dispatch") {
        const error = failure(data, void 0);
        visual = { ...visual, ...data.meta !== void 0 ? { meta: data.meta } : {}, ...error !== void 0 ? { error } : {} };
      }
    } else if (event.type === "tool/result" && visual !== void 0) {
      const message = object(data.message);
      const resultId = typeof message?.toolCallId === "string" ? message.toolCallId : object(message?.source)?.callId;
      if (resultId !== callId) continue;
      const error = failure(data, message);
      visual = { ...visual, ...data.meta !== void 0 ? { meta: data.meta } : {}, ...error !== void 0 ? { error } : {} };
    }
  }
  return visual;
}
async function readRecordedVisual(ctx, sessionId, callId) {
  const query = ctx.get("sessionQuery");
  if (!query) return void 0;
  let observation;
  try {
    observation = await query.observeSession(sessionId, { projectionMode: "none" });
  } catch (error) {
    if (object(error)?.code === "SESSION_QUERY_SESSION_NOT_FOUND") return void 0;
    throw error;
  }
  try {
    return findVisual(observation.events, callId);
  } finally {
    observation[Symbol.dispose]();
  }
}
function visualMeta(meta, callId) {
  const value = object(meta);
  return value?.lantern === 1 && value.id === callId ? value : void 0;
}
function recordedSource(meta, callId) {
  const source = object(visualMeta(meta, callId)?.source);
  if (source?.kind !== "local" || typeof source.root !== "string" || !isAbsolute2(source.root) || typeof source.path !== "string" || source.path === "" || isAbsolute2(source.path)) return void 0;
  return { kind: "local", root: source.root, path: source.path };
}
function recordedStatus(visual, callId) {
  if (visual?.error !== void 0) return "closed";
  const status = visualMeta(visual?.meta, callId)?.status;
  return status === "answered" || status === "dismissed" || status === "timeout" || status === "closed" ? status : "unknown";
}

// src/host/pending.ts
var MAX_OUTCOMES = 256;
var PendingResponses = class {
  waiters = /* @__PURE__ */ new Map();
  outcomes = /* @__PURE__ */ new Map();
  closed = false;
  remember(callId, kind) {
    this.outcomes.delete(callId);
    this.outcomes.set(callId, kind);
    while (this.outcomes.size > MAX_OUTCOMES) {
      const oldest = this.outcomes.keys().next().value;
      if (oldest === void 0) break;
      this.outcomes.delete(oldest);
    }
  }
  /**
   * Wait until the visual is answered, dismissed, times out, or the call is
   * cancelled. Never rejects.
   */
  wait(callId, sessionId, signal, timeoutMs) {
    if (this.closed) {
      this.remember(callId, "closed");
      return Promise.resolve({ kind: "closed" });
    }
    this.settle(callId, { kind: "closed" });
    this.outcomes.delete(callId);
    return new Promise((resolve3) => {
      let done = false;
      const finish2 = (outcome) => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        signal.removeEventListener("abort", onAbort);
        if (this.waiters.get(callId)?.finish === finish2) this.waiters.delete(callId);
        this.remember(callId, outcome.kind);
        resolve3(outcome);
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
  /** Retain the terminal state so a second browser cannot submit the same answer again. */
  status(callId) {
    return this.waiters.has(callId) ? "waiting" : this.outcomes.get(callId) ?? "unknown";
  }
  /** Session that owns a waiting call, when known. */
  sessionOf(callId) {
    return this.waiters.get(callId)?.sessionId;
  }
  settle(callId, outcome) {
    const waiter = this.waiters.get(callId);
    if (waiter === void 0) return this.outcomes.get(callId) ?? "unknown";
    waiter.finish(outcome);
    return "settled";
  }
  /** Release every waiting call (plugin unload). */
  closeAll() {
    this.closed = true;
    for (const waiter of [...this.waiters.values()]) waiter.finish({ kind: "closed" });
    this.outcomes.clear();
    this.waiters.clear();
  }
};

// src/host/prompt.ts
import z from "@deepseek-ai/schemastery";
var Config = z.object({
  automaticVisuals: z.boolean().default(true).volatile(),
  answerTimeoutMinutes: z.number().min(1e-3).max(1440).default(15),
  maxHtmlChars: z.number().min(1).max(4e6).default(4e5)
});
var INTERACTIVE_PROMPT = "Use show_visual proactively when a visual or interaction helps explain, compare, explore, or decide. Prefer one compact inline card with a clear purpose; use the panel when more space helps. Keep the key answer and sources in prose. Use real data, labeled units, and explicit assumptions. Use the preloaded theme and semantic controls that work on mobile and by keyboard; respect reduced motion. Make exploration respond locally; send only a deliberate user submission. Use await_response only when an answer is needed to continue. Preserve inputs with lantern.setState/getState and revise with replace. Use plain text for simple answers. No skill loading is required.";
function registerPrompt(ctx, config) {
  ctx.systemPrompt.section({
    name: "ui:lantern-interactive",
    order: 10110,
    interpolate: false,
    text({ scope }) {
      const value = config.automaticVisuals;
      const enabled = typeof value === "object" && value !== null ? value.get() : value ?? true;
      return enabled && ctx.tools.get(TOOL_NAME, scope) !== void 0 ? INTERACTIVE_PROMPT : "";
    }
  });
}

// src/host/index.ts
var name = "dsh-lantern";
var inject = ["tools", "connection", "systemPrompt"];
var MAX_RESPONSE_CHARS = 64 * 1024;
var SKILL_DIR = new URL(import.meta.url.endsWith("/src/host/index.ts") ? "../../skills/lantern-visuals/" : "../skills/lantern-visuals/", import.meta.url);
function positive(value, fallback, what, max) {
  if (value === void 0) return fallback;
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0 || value > max) throw new Error(`dsh-lantern: ${what} must be a number between 0 and ${max}`);
  return value;
}
function waitKey(sessionId, callId) {
  return JSON.stringify([sessionId ?? "", callId]);
}
function apply(rawCtx, config = {}) {
  const ctx = rawCtx;
  registerPrompt(ctx, config);
  const timeoutMinutes = positive(config?.answerTimeoutMinutes, 15, "answerTimeoutMinutes", 24 * 60);
  const maxHtml = positive(config?.maxHtmlChars, 4e5, "maxHtmlChars", 4e6);
  const pending = new PendingResponses();
  const files = new FileServer();
  const sources = /* @__PURE__ */ new Map();
  const cwdBySession = /* @__PURE__ */ new Map();
  const MAX_TRACKED = 256;
  function remember(map, key, value) {
    map.delete(key);
    map.set(key, value);
    while (map.size > MAX_TRACKED) {
      const oldest = map.keys().next().value;
      if (oldest === void 0) break;
      map.delete(oldest);
    }
  }
  ctx.effect(() => () => {
    pending.closeAll();
    sources.clear();
    cwdBySession.clear();
  }, "dsh-lantern: release waiting visuals");
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
    if (wd && exec.agent) return wd.ensure(exec.agent, exec.signal);
    return exec.agent?.session?.header?.cwd;
  }
  function insideDirectory(root, cwd) {
    const rel = relative2(cwd, root);
    return rel === "" || rel !== ".." && !rel.startsWith(`..${sep2}`) && !isAbsolute3(rel);
  }
  async function localRoot(path) {
    const fs = ctx.get("fs");
    const mapped = fs?.processPathFromHostPath(path);
    if (mapped === void 0 || resolve2(mapped) !== resolve2(path)) {
      throw new FileRefusal("Workspace file visuals require a host-local filesystem. Use `html` for remote execution.", 403);
    }
    return realpath2(path).catch(() => {
      throw new FileRefusal("The original visual directory is not available.", 404);
    });
  }
  async function resolveSource(exec, path) {
    const cwd = await execCwd(exec);
    if (cwd === void 0) throw new Error("show_visual: no working directory for `path`; pass `html` instead.");
    const root = await localRoot(cwd);
    const entry = await resolveEntry(root, path);
    return { kind: "local", root, path: entry };
  }
  async function sourceOf(sessionId, callId) {
    const key = waitKey(sessionId, callId);
    const running = sources.get(key);
    if (running) return running;
    const visual = await readRecordedVisual(ctx, sessionId, callId);
    const source = visual?.error === void 0 ? recordedSource(visual?.meta, callId) : void 0;
    if (!source) throw new RouteError("no-source", "This visual has no saved local source. Create the visual again to open its file.");
    const resolved = Promise.resolve(source);
    remember(sources, key, resolved);
    return source;
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
          source: {
            type: "object",
            additionalProperties: false,
            properties: { kind: { type: "string", enum: ["local"] }, root: { type: "string" }, path: { type: "string" } },
            required: ["kind", "root", "path"]
          },
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
        if (sessionId === void 0) throw new Error("show_visual: workspace files require a session; pass `html` instead.");
        const key = waitKey(sessionId, exec.callId);
        const source = resolveSource(exec, args.path);
        remember(sources, key, source);
        try {
          base.source = await source;
          base.path = base.source.path;
          remember(cwdBySession, sessionId, base.source.root);
        } catch (error) {
          if (sources.get(key) === source) sources.delete(key);
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
    const { sessionId, callId, key } = callIdentity(payload);
    const response = payload.response;
    let json2;
    try {
      json2 = JSON.stringify(response === void 0 ? null : response);
    } catch {
      throw new RouteError("bad-response", "The answer is not JSON.");
    }
    if (json2.length > MAX_RESPONSE_CHARS) throw new RouteError("too-large", "The answer exceeds 65,536 JSON characters.");
    const status = pending.settle(key, { kind: "answered", response: json2 });
    return { status: status === "unknown" ? recordedStatus(await readRecordedVisual(ctx, sessionId, callId), callId) : status };
  });
  route(ctx, "lantern.dismiss", async (payload) => {
    const { sessionId, callId, key } = callIdentity(payload);
    const status = pending.settle(key, { kind: "dismissed" });
    return { status: status === "unknown" ? recordedStatus(await readRecordedVisual(ctx, sessionId, callId), callId) : status };
  });
  route(ctx, "lantern.waiting", async (payload) => {
    const { sessionId, callId, key } = callIdentity(payload);
    const current = pending.status(key);
    const status = current === "unknown" ? recordedStatus(await readRecordedVisual(ctx, sessionId, callId), callId) : current;
    return { waiting: status === "waiting", status };
  });
  route(ctx, "lantern.file", async (payload) => {
    const { sessionId, callId } = callIdentity(payload);
    let source;
    let rel;
    try {
      source = await sourceOf(sessionId, callId);
      const cwd = await sessionCwd(sessionId);
      if (cwd === void 0) throw new RouteError("no-session", "The session working directory is unknown.");
      const cwdReal = await localRoot(cwd);
      const rootReal = await localRoot(source.root);
      if (rootReal !== source.root) throw new FileRefusal("The original visual directory changed location.", 403);
      if (!insideDirectory(rootReal, cwdReal)) throw new FileRefusal("The saved folder is outside the session working directory.", 403);
      rel = await resolveEntry(rootReal, source.path);
    } catch (error) {
      if (error instanceof FileRefusal) throw new RouteError("refused", error.message);
      throw error;
    }
    const entry = join(source.root, rel);
    const token = files.grant(dirname(entry));
    return { url: `${FILE_ROUTE.slice(1)}/${token}/${encodeURIComponent(basename(entry))}`, path: rel };
  });
  route(ctx, "lantern.visual", async (payload) => {
    const { sessionId, callId } = callIdentity(payload);
    const visual = await readRecordedVisual(ctx, sessionId, callId);
    if (!visual) throw new RouteError("no-visual", "The visual was not found in this session.");
    return visual;
  });
  ctx.inject(["webServer"], (scope) => {
    const webServer = scope.webServer;
    scope.effect(() => webServer.register({ kind: "prefix", path: FILE_ROUTE, handler: files.handle }), "dsh-lantern: workspace files");
  });
  ctx.inject(["skills"], (scope) => {
    const skills = scope.skills;
    skills.registerProvider(() => skillProvider());
  });
  ctx.inject(["settings"], (scope) => {
    const settings = scope.settings;
    scope.effect(() => settings.configure({ auto: false }, ctx.fiber), "dsh-lantern: custom settings page");
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
function callIdentity(payload) {
  const sessionId = stringField(payload, "sessionId", 200);
  const callId = stringField(payload, "callId", 200);
  return { sessionId, callId, key: waitKey(sessionId, callId) };
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
    // Keep the advanced guide available through an explicit /lantern-visuals
    // gesture, without DSH's automatic skill catalog requiring it first.
    invocation: { modelInvocable: false, userInvocable: true },
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
  Config,
  apply,
  inject,
  name
};
