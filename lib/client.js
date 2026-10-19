window.__ModuleLoader__.load({id:"dsh-lantern",factory(require){const module={exports:{}};const exports=module.exports;
"use strict";var He=Object.defineProperty;var Gt=Object.getOwnPropertyDescriptor;var Kt=Object.getOwnPropertyNames;var Xt=Object.prototype.hasOwnProperty;var Yt=(e,t)=>{for(var n in t)He(e,n,{get:t[n],enumerable:!0})},Qt=(e,t,n,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of Kt(t))!Xt.call(e,o)&&o!==n&&He(e,o,{get:()=>t[o],enumerable:!(r=Gt(t,o))||r.enumerable});return e};var Zt=e=>Qt(He({},"__esModule",{value:!0}),e);var Dn={};Yt(Dn,{apply:()=>qn,inject:()=>Vn,name:()=>Hn});module.exports=Zt(Dn);var dt=`/* Card chrome inside DSH Web. Uses DSH's own tokens so it follows every theme. */
.lantern-tool { margin: 6px 0; }
.lantern-tail { display: flex; flex-direction: column; gap: 10px; margin: 4px 0 10px; }

.lantern-card {
  border: 1px solid var(--dsw-alias-border-l1, rgba(127,127,127,.25));
  border-radius: var(--dsw-radius-md, 12px);
  background: var(--dsw-alias-bg-base, transparent);
  overflow: hidden;
}
.lantern-head {
  display: flex; align-items: center; gap: 8px;
  min-height: 36px; padding: 0 6px 0 12px;
  border-bottom: 1px solid var(--dsw-alias-border-l1, rgba(127,127,127,.2));
  color: var(--dsw-alias-label-secondary, inherit);
  font-size: 13px;
}
.lantern-card:has(.lantern-body[hidden]) .lantern-head { border-bottom-color: transparent; }
.lantern-title {
  flex: 1 1 auto; min-width: 4.5em;
  color: var(--dsw-alias-label-primary, inherit); font-weight: 500;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.lantern-spacer { flex: 1 1 0; min-width: 0; }
.lantern-icon { flex: none; color: var(--dsw-alias-label-secondary, currentColor); }
.lantern-badge {
  flex: none; font-size: 11.5px; line-height: 18px; padding: 0 7px; border-radius: 999px;
  color: var(--dsw-alias-label-secondary, inherit);
  background: var(--dsw-alias-bg-layer-2, rgba(127,127,127,.12));
}
.lantern-badge[data-state="waiting"] {
  color: var(--dsw-alias-brand-primary, #4d6bfe);
  background: color-mix(in srgb, var(--dsw-alias-brand-primary, #4d6bfe) 12%, transparent);
}
.lantern-badge[data-state="answered"] {
  color: var(--dsw-alias-state-success-primary, #13865b);
  background: color-mix(in srgb, var(--dsw-alias-state-success-primary, #13865b) 12%, transparent);
}
.lantern-action {
  display: inline-flex; align-items: center; gap: 4px; flex: none;
  height: 26px; padding: 0 8px; border: 0; border-radius: 7px; background: transparent;
  color: var(--dsw-alias-label-secondary, inherit); font: inherit; font-size: 12.5px; cursor: pointer;
}
.lantern-action.icon { width: 26px; padding: 0; justify-content: center; }
.lantern-action:hover { background: var(--dsw-alias-interactive-bg-hover, rgba(127,127,127,.12)); color: var(--dsw-alias-label-primary, inherit); }
.lantern-action:disabled { opacity: .5; cursor: default; }
.lantern-action[data-collapsed] .lantern-icon { transform: rotate(-90deg); }
.lantern-action .lantern-icon { color: inherit; transition: transform .15s ease; }
.lantern-body { display: block; position: relative; }
.lantern-body[hidden] { display: none; }

/* Over the frame: the "click first" wheel hint and the paused (WebGL lost) state. */
.lantern-hint {
  position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
  max-width: calc(100% - 32px); padding: 7px 14px; border-radius: 999px; pointer-events: none;
  background: color-mix(in srgb, var(--dsw-alias-label-primary, #111) 84%, transparent);
  color: var(--dsw-alias-bg-base, #fff); font-size: 12.5px; line-height: 1.4; text-align: center;
  box-shadow: 0 4px 14px rgba(0, 0, 0, .18);
  animation: lantern-hint 2.2s ease both;
}
@keyframes lantern-hint { 0% { opacity: 0; } 10% { opacity: 1; } 80% { opacity: 1; } 100% { opacity: 0; } }
.lantern-paused {
  position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px;
  padding: 16px; text-align: center; font-size: 12.5px;
  color: var(--dsw-alias-label-secondary, inherit);
  background: color-mix(in srgb, var(--dsw-alias-bg-base, #fff) 88%, transparent);
  backdrop-filter: blur(2px);
}
.lantern-resume { border: 1px solid var(--dsw-alias-border-l2, rgba(127,127,127,.35)); padding: 0 14px; color: var(--dsw-alias-label-primary, inherit); }
@media (prefers-reduced-motion: reduce) { .lantern-hint { animation: none; } }
.lantern-frame { display: block; width: 100%; border: 0; background: transparent; color-scheme: normal; }
.lantern-frame[data-mode="inline"] { transition: height .12s ease; }

.lantern-row {
  display: flex; align-items: center; flex-wrap: wrap; gap: 8px; min-height: 32px; padding: 4px 6px 4px 12px;
  border: 1px solid var(--dsw-alias-border-l1, rgba(127,127,127,.25));
  border-radius: var(--dsw-radius-md, 12px);
  color: var(--dsw-alias-label-secondary, inherit); font-size: 13px;
}
.lantern-row-quiet { border-style: dashed; min-height: 28px; padding: 2px 12px; }
.lantern-row-title { color: var(--dsw-alias-label-primary, inherit); font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; max-width: 60%; }
.lantern-muted { color: var(--dsw-alias-label-tertiary, var(--dsw-alias-label-secondary, inherit)); font-size: 12.5px; }
.lantern-link {
  display: inline-flex; align-items: center; gap: 3px; border: 0; background: none; padding: 0 4px; cursor: pointer;
  color: var(--dsw-alias-link, var(--dsw-alias-brand-primary, #4d6bfe)); font: inherit; font-size: 12.5px;
}
.lantern-link .lantern-icon { color: inherit; }

.lantern-notes { display: flex; flex-direction: column; gap: 2px; padding: 6px 12px 8px; }
.lantern-note { font-size: 12.5px; color: var(--dsw-alias-label-secondary, inherit); padding: 10px 12px; }
.lantern-notes .lantern-note { padding: 0; }
.lantern-row .lantern-note { flex-basis: 100%; padding: 0 0 4px; }
.lantern-note[data-kind="error"] { color: var(--dsw-alias-state-error-primary, #c9372c); }
.lantern-note[data-kind="warn"] { color: var(--dsw-alias-state-warn-primary, #b45c00); }

.lantern-panel { display: flex; flex-direction: column; height: 100%; min-height: 0; }
.lantern-panel-bar {
  display: flex; align-items: center; gap: 8px; padding: 6px 8px 6px 12px;
  border-bottom: 1px solid var(--dsw-alias-border-l1, rgba(127,127,127,.2)); font-size: 13px;
}
.lantern-panel-body { flex: 1 1 auto; min-height: 0; display: flex; position: relative; }
.lantern-panel-body > .lantern-frame { flex: 1 1 auto; height: 100%; }
.lantern-empty { padding: 24px; color: var(--dsw-alias-label-secondary, inherit); font-size: 13px; }
.lantern-tab { height: 100%; min-height: 0; display: flex; flex-direction: column; }
.lantern-tab > .lantern-panel { flex: 1 1 auto; }
`;var tn={visual:"\u30D3\u30B8\u30E5\u30A2\u30EB",waiting:"\u56DE\u7B54\u5F85\u3061",answered:"\u56DE\u7B54\u6E08\u307F",dismissed:"\u30B9\u30AD\u30C3\u30D7",timeout:"\u6642\u9593\u5207\u308C",closed:"\u7D42\u4E86",error:"\u30A8\u30E9\u30FC",preparing:"\u4F5C\u6210\u4E2D\u2026",skip:"\u30B9\u30AD\u30C3\u30D7",openSidebar:"\u30B5\u30A4\u30C9\u30D0\u30FC\u3067\u958B\u304F",collapse:"\u6298\u308A\u305F\u305F\u3080",expand:"\u5C55\u958B\u3059\u308B",shownBelow:"\u56DE\u7B54\u306E\u4E0B\u306B\u8868\u793A\u3057\u3066\u3044\u307E\u3059",shownInSidebar:"\u30B5\u30A4\u30C9\u30D0\u30FC\u306B\u8868\u793A\u3057\u3066\u3044\u307E\u3059",answerInSidebar:"\u30B5\u30A4\u30C9\u30D0\u30FC\u3067\u56DE\u7B54\u3057\u3066\u304F\u3060\u3055\u3044",replaced:"\u65B0\u3057\u3044\u7248\u306B\u66F4\u65B0\u3057\u307E\u3057\u305F",showNew:"\u65B0\u3057\u3044\u7248\u3078",scriptError:"\u30D3\u30B8\u30E5\u30A2\u30EB\u5185\u306E\u30B9\u30AF\u30EA\u30D7\u30C8\u3067\u30A8\u30E9\u30FC",sendFailed:"\u9001\u4FE1\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F",missing:"\u3053\u306E\u30D3\u30B8\u30E5\u30A2\u30EB\u306E\u5185\u5BB9\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\u3002\u30C1\u30E3\u30C3\u30C8\u304B\u3089\u958B\u304D\u76F4\u3057\u3066\u304F\u3060\u3055\u3044\u3002",loading:"\u8AAD\u307F\u8FBC\u307F\u4E2D\u2026",fileError:"\u30D5\u30A1\u30A4\u30EB\u3092\u958B\u3051\u307E\u305B\u3093\u3067\u3057\u305F",answerPrefix:"\u56DE\u7B54",notWaiting:"\u30A8\u30FC\u30B8\u30A7\u30F3\u30C8\u306F\u3082\u3046\u5F85\u3063\u3066\u3044\u307E\u305B\u3093",wheelHint:"\u30AF\u30EA\u30C3\u30AF\u3059\u308B\u3068\u30DB\u30A4\u30FC\u30EB\u3067\u64CD\u4F5C\u3067\u304D\u307E\u3059",glLost:"3D \u8868\u793A\u3092\u4E00\u6642\u505C\u6B62\u3057\u307E\u3057\u305F\uFF08\u540C\u6642\u306B\u52D5\u304B\u305B\u308B\u6570\u306E\u4E0A\u9650\uFF09",resume:"\u518D\u958B",run:"\u5B9F\u884C",paused:"\u505C\u6B62\u4E2D\u3067\u3059\u3002\u5B9F\u884C\u3059\u308B\u307E\u3067\u30B9\u30AF\u30EA\u30D7\u30C8\u306F\u52D5\u304D\u307E\u305B\u3093\u3002"},nn={visual:"Visual",waiting:"Waiting for you",answered:"Answered",dismissed:"Skipped",timeout:"Timed out",closed:"Closed",error:"Error",preparing:"Building\u2026",skip:"Skip",openSidebar:"Open in sidebar",collapse:"Collapse",expand:"Expand",shownBelow:"Shown below the answer",shownInSidebar:"Shown in the sidebar",answerInSidebar:"Answer it in the sidebar",replaced:"Updated to a newer version",showNew:"Go to the new version",scriptError:"A script in the visual failed",sendFailed:"Could not send",missing:"This visual is not loaded. Open it again from the chat.",loading:"Loading\u2026",fileError:"Could not open the file",answerPrefix:"Answer",notWaiting:"The agent is no longer waiting",wheelHint:"Click the visual to use the scroll wheel in it",glLost:"The 3D view was paused (too many running at once)",resume:"Resume",run:"Run",paused:"Paused. Scripts stay off until you run it."},rn={visual:"\u53EF\u89C6\u5316",waiting:"\u7B49\u5F85\u56DE\u7B54",answered:"\u5DF2\u56DE\u7B54",dismissed:"\u5DF2\u8DF3\u8FC7",timeout:"\u5DF2\u8D85\u65F6",closed:"\u5DF2\u7ED3\u675F",error:"\u9519\u8BEF",preparing:"\u751F\u6210\u4E2D\u2026",skip:"\u8DF3\u8FC7",openSidebar:"\u5728\u4FA7\u8FB9\u680F\u6253\u5F00",collapse:"\u6536\u8D77",expand:"\u5C55\u5F00",shownBelow:"\u663E\u793A\u5728\u56DE\u7B54\u4E0B\u65B9",shownInSidebar:"\u663E\u793A\u5728\u4FA7\u8FB9\u680F",answerInSidebar:"\u8BF7\u5728\u4FA7\u8FB9\u680F\u4E2D\u56DE\u7B54",replaced:"\u5DF2\u66F4\u65B0\u4E3A\u65B0\u7248\u672C",showNew:"\u67E5\u770B\u65B0\u7248\u672C",scriptError:"\u53EF\u89C6\u5316\u4E2D\u7684\u811A\u672C\u51FA\u9519",sendFailed:"\u53D1\u9001\u5931\u8D25",missing:"\u672A\u52A0\u8F7D\u6B64\u53EF\u89C6\u5316\u5185\u5BB9\uFF0C\u8BF7\u4ECE\u5BF9\u8BDD\u4E2D\u91CD\u65B0\u6253\u5F00\u3002",loading:"\u52A0\u8F7D\u4E2D\u2026",fileError:"\u65E0\u6CD5\u6253\u5F00\u6587\u4EF6",answerPrefix:"\u56DE\u7B54",notWaiting:"\u667A\u80FD\u4F53\u5DF2\u4E0D\u518D\u7B49\u5F85",wheelHint:"\u70B9\u51FB\u540E\u5373\u53EF\u5728\u5176\u4E2D\u4F7F\u7528\u6EDA\u8F6E",glLost:"3D \u89C6\u56FE\u5DF2\u6682\u505C\uFF08\u540C\u65F6\u8FD0\u884C\u7684\u6570\u91CF\u5DF2\u8FBE\u4E0A\u9650\uFF09",resume:"\u7EE7\u7EED",run:"\u8FD0\u884C",paused:"\u5DF2\u6682\u505C\u3002\u70B9\u51FB\u8FD0\u884C\u524D\u4E0D\u4F1A\u6267\u884C\u811A\u672C\u3002"};function an(e){let t=e.toLowerCase();return t.startsWith("ja")?"ja":t.startsWith("zh")?"zh":"en"}function Se(){return an(typeof document<"u"?document.documentElement.lang:"")}function U(){let e=Se();return e==="ja"?tn:e==="zh"?rn:nn}var ut=require("react");function Je(e){if(!e)return;let t;try{t=JSON.parse(e)}catch{return}if(typeof t!="object"||t===null)return;let n=t,r=typeof n.html=="string"&&n.html!==""?n.html:void 0,o=typeof n.path=="string"&&n.path!==""?n.path:void 0;return{title:typeof n.title=="string"&&n.title.trim()!==""?n.title.trim():"",...r!==void 0?{html:r}:{},...o!==void 0?{path:o}:{},display:o!==void 0||n.display==="panel"?"panel":"inline",await:n.await_response===!0,...typeof n.replace=="string"&&n.replace.trim()!==""?{replace:n.replace.trim()}:{}}}function Be(e){if(typeof e!="object"||e===null)return;let t=e,n=t.status;if(!(n!=="shown"&&n!=="answered"&&n!=="dismissed"&&n!=="timeout"&&n!=="closed"))return{status:n,...typeof t.response=="string"?{response:t.response}:{},...typeof t.path=="string"?{path:t.path}:{}}}var Te=new Map,he=new Map,Ne=0,De=new Set;function A(e,t){return JSON.stringify([t??"",e])}function sn(){Ne++;for(let e of De)e()}function on(e){return De.add(e),()=>{De.delete(e)}}function _e(e,t){let n=A(e,t.sessionId),r=Te.get(n),o=r===void 0;for(let[d,p]of Object.entries(t)){if(p===void 0)continue;let b=r?.[d];b!==p&&(typeof p=="object"&&JSON.stringify(b)===JSON.stringify(p)||(o=!0))}if(!o)return;let i={...r,callId:e};for(let[d,p]of Object.entries(t))p!==void 0&&(i[d]=p);Te.set(n,i),Ie()}var Ve=!1;function Ie(){Ve||(Ve=!0,queueMicrotask(()=>{Ve=!1,sn()}))}function le(e,t){return Te.get(A(e,t))}var qe;function ln(){if(qe?.version===Ne)return qe.map;let e=new Map;for(let t of Te.values()){let n=t.args?.replace;if(n===void 0||n===t.callId||t.error)continue;let r=A(n,t.sessionId),o=e.get(r);(o===void 0||(t.seq??0)>(le(o,t.sessionId)?.seq??0))&&e.set(r,t.callId)}return qe={version:Ne,map:e},e}function pt(e,t){let n=ln(),r,o=e;for(let i=0;i<20;i++){let d=n.get(A(o,t));if(d===void 0)break;r=d,o=d}return r}function de(e){let t=(0,ut.useSyncExternalStore)(on,()=>Ne);return e()}function ft(e,t){let n=A(e,t);return he.set(n,(he.get(n)??0)+1),Ie(),()=>{let r=(he.get(n)??1)-1;r<=0?he.delete(n):he.set(n,r),Ie()}}function gt(e,t){return he.has(A(e,t))}var Ue="dsh-lantern:v1:",Fe=300,ye=new Map,Ee=new Set;function ne(e,t){let n=A(e,t),r=ye.get(n);if(Ee.has(n)&&r!==void 0)return r;try{let o=localStorage.getItem(Ue+n),i=o?JSON.parse(o):void 0;return i&&typeof i=="object"&&!Array.isArray(i)?i:{}}catch{return r??{}}}function ce(e,t,n){let r=A(e,n),o={...ne(e,n),...t,at:Date.now()};if(ye.delete(r),ye.set(r,o),ye.size>Fe){let d=ye.keys().next().value;ye.delete(d),Ee.delete(d)}let i=!1;try{localStorage.setItem(Ue+r,JSON.stringify(o)),i=!0,dn()}catch{}i?Ee.delete(r):Ee.add(r),Ie()}function dn(){let e=[];for(let t=0;t<localStorage.length;t++){let n=localStorage.key(t);if(!n?.startsWith(Ue))continue;let r=0;try{r=Number(JSON.parse(localStorage.getItem(n)??"{}").at)||0}catch{r=0}e.push([n,r])}if(!(e.length<=Fe)){e.sort((t,n)=>t[1]-n[1]);for(let[t]of e.slice(0,e.length-Fe))localStorage.removeItem(t)}}function ct(e){if(e!==void 0)try{return JSON.parse(e)}catch{return e}}function mt(e,t){let n=ne(e.callId,e.sessionId),r=e.result;return r?.status==="answered"?{state:"answered",response:ct(r.response)}:n.answer!==void 0?{state:"answered",response:ct(n.answer)}:r?.status==="dismissed"?{state:"dismissed",response:void 0}:r?.status==="timeout"?{state:"timeout",response:void 0}:r?.status==="closed"?{state:"closed",response:void 0}:r===void 0&&e.args?.await&&t!=="preparing"?{state:"waiting",response:void 0}:{state:"idle",response:void 0}}var Xe="dsh-lantern/visual",Ye="lanternVisual",Ge="dsh-resource://lantern-visual/",Ke,bt;function ht(e){Ke=e.sidebarRight,bt=e.sessions}function cn(e,t){return Ge+encodeURIComponent(e)+"/"+encodeURIComponent(t)}function Qe(e){if(!e||!e.startsWith(Ge))return;let[t,n]=e.slice(Ge.length).split("/");if(!(!t||!n))try{return{sessionId:decodeURIComponent(t),callId:decodeURIComponent(n)}}catch{return}}function Le(e,t){if(!(!Ke||!e))try{Ke.openResource(cn(e,t),{kind:Ye})}catch(n){console.warn("[dsh-lantern] could not open the sidebar",n)}}async function Ze(e,t){let n=await fetch(new URL(`api/${e}`,document.baseURI),{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(t),credentials:"same-origin"}),r;try{r=await n.json()}catch{r=void 0}if(!n.ok||!r?.ok)throw new Error(r?.error?.message??`HTTP ${n.status}`);return r.value}async function et(e,t){if(!e)throw new Error("no session");let r=bt?.scope(e)?.get("conversation");if(!r)throw new Error("conversation service unavailable");await r.send(t)}function un(e,t){let n=`${U().answerPrefix} \u2014 ${e||U().visual}`;return typeof t=="string"?`${n}: ${t}`:t&&typeof t=="object"&&!Array.isArray(t)&&Object.values(t).every(r=>r===null||typeof r!="object")?[n,...Object.entries(t).map(([r,o])=>`${r}: ${typeof o=="string"?o:JSON.stringify(o)}`)].join(`
`):`${n}: ${JSON.stringify(t)}`}var We=new Set;async function yt(e,t,n){let r=le(e,t),o=t??r?.sessionId,i=A(e,o);if(We.has(i)||ne(e,o).answer!==void 0||r?.result?.status==="answered")throw new Error("already answered");We.add(i);try{if(r?.args?.await&&r.result===void 0){let{status:d}=await Ze("lantern.respond",{sessionId:o,callId:e,response:n});if(d==="settled"){ce(e,{answer:JSON.stringify(n)},o);return}}await et(o,un(r?.args?.title??"",n)),ce(e,{answer:JSON.stringify(n)},o)}finally{We.delete(i)}}async function vt(e,t){let{status:n}=await Ze("lantern.dismiss",{sessionId:t,callId:e});return n==="settled"}async function wt(e,t){let{url:n}=await Ze("lantern.file",{sessionId:e,path:t});return new URL(n,document.baseURI).href}var $=require("react");var w=require("react");var E=require("react");var Re=`/*
 * Lantern kit: design tokens and a few components available in every visual.
 * Everything is a starting point. A visual may override any token on :root,
 * load its own fonts, or ignore the components entirely.
 */

:root {
  color-scheme: light;
  /* Typography */
  --lt-font-sans: system-ui, -apple-system, "Segoe UI", "Hiragino Sans", "Noto Sans JP", "Noto Sans CJK JP", "Yu Gothic UI", sans-serif;
  --lt-font-serif: "Noto Serif JP", "Hiragino Mincho ProN", "Yu Mincho", Georgia, serif;
  --lt-font-mono: ui-monospace, "SFMono-Regular", Menlo, Consolas, "Noto Sans Mono CJK JP", monospace;
  --lt-font: var(--lt-font-sans);
  --lt-text-xs: 12px;
  --lt-text-sm: 13px;
  --lt-text-md: 14px;
  --lt-text-lg: 16px;
  --lt-text-xl: 20px;
  --lt-text-2xl: 26px;
  --lt-text-3xl: 34px;
  --lt-leading: 1.65;
  --lt-weight-regular: 400;
  --lt-weight-strong: 600;

  /* Color: surfaces and text */
  --lt-bg: #ffffff;
  --lt-surface: #f6f7f9;
  --lt-surface-2: #eef0f4;
  --lt-fg: #1b1f27;
  --lt-fg-2: #5b6372;
  --lt-fg-3: #8a91a0;
  --lt-border: #e2e5eb;
  --lt-border-strong: #c9ced8;

  /* Color: roles */
  --lt-accent: #3b6cf0;
  --lt-accent-fg: #ffffff;
  --lt-accent-soft: rgba(59, 108, 240, .12);
  --lt-success: #13865b;
  --lt-success-soft: rgba(19, 134, 91, .13);
  --lt-warning: #b45c00;
  --lt-warning-soft: rgba(214, 138, 0, .15);
  --lt-danger: #c9372c;
  --lt-danger-soft: rgba(201, 55, 44, .12);

  /* Data series (charts, legends) */
  --lt-series-1: #3b6cf0;
  --lt-series-2: #1aa37a;
  --lt-series-3: #e08a1e;
  --lt-series-4: #d24d7a;
  --lt-series-5: #7a5af0;
  --lt-series-6: #1696b8;
  --lt-series-7: #8c9a2b;
  --lt-series-8: #8a6a52;

  /* Shape, space, depth, motion */
  --lt-radius-sm: 6px;
  --lt-radius: 10px;
  --lt-radius-lg: 14px;
  --lt-radius-full: 999px;
  --lt-space-1: 4px;
  --lt-space-2: 8px;
  --lt-space-3: 12px;
  --lt-space-4: 16px;
  --lt-space-5: 24px;
  --lt-space-6: 32px;
  --lt-space-7: 48px;
  --lt-shadow-sm: 0 1px 2px rgba(16, 24, 40, .06);
  --lt-shadow: 0 4px 16px rgba(16, 24, 40, .08);
  --lt-ease: cubic-bezier(.2, .7, .2, 1);
  --lt-dur: 180ms;
}

:root[data-theme="dark"] {
  color-scheme: dark;
  --lt-bg: #17181c;
  --lt-surface: #202228;
  --lt-surface-2: #2a2c33;
  --lt-fg: #e9ebf0;
  --lt-fg-2: #a3a9b5;
  --lt-fg-3: #767c88;
  --lt-border: #31343c;
  --lt-border-strong: #454953;
  --lt-accent: #6f95ff;
  --lt-accent-fg: #0d1220;
  --lt-accent-soft: rgba(111, 149, 255, .16);
  --lt-success: #3cc58b;
  --lt-success-soft: rgba(60, 197, 139, .15);
  --lt-warning: #f0b44c;
  --lt-warning-soft: rgba(240, 180, 76, .15);
  --lt-danger: #ff7a6e;
  --lt-danger-soft: rgba(255, 122, 110, .14);
  --lt-series-1: #6f95ff;
  --lt-series-2: #3cc58b;
  --lt-series-3: #f0a54c;
  --lt-series-4: #f07ba3;
  --lt-series-5: #a58cff;
  --lt-series-6: #4cc3e0;
  --lt-series-7: #bccb5a;
  --lt-series-8: #c49f84;
  --lt-shadow-sm: 0 1px 2px rgba(0, 0, 0, .3);
  --lt-shadow: 0 6px 20px rgba(0, 0, 0, .35);
}

/* Base */
*, *::before, *::after { box-sizing: border-box; }
html, body { margin: 0; }
/* An inline card is as tall as its content, so it never needs a scrollbar of its own. */
:root[data-lt-mode="inline"]:not([data-lt-overflow]) { overflow-y: hidden; }
body {
  background: var(--lt-bg);
  color: var(--lt-fg);
  font-family: var(--lt-font);
  font-size: var(--lt-text-md);
  line-height: var(--lt-leading);
  -webkit-font-smoothing: antialiased;
  overflow-wrap: anywhere;
}
h1, h2, h3, h4 { margin: 0 0 var(--lt-space-2); line-height: 1.3; font-weight: var(--lt-weight-strong); }
h1 { font-size: var(--lt-text-2xl); }
h2 { font-size: var(--lt-text-xl); }
h3 { font-size: var(--lt-text-lg); }
h4 { font-size: var(--lt-text-md); }
p { margin: 0 0 var(--lt-space-3); }
a { color: var(--lt-accent); text-decoration: none; }
a:hover { text-decoration: underline; }
small { font-size: var(--lt-text-sm); color: var(--lt-fg-2); }
hr { border: 0; border-top: 1px solid var(--lt-border); margin: var(--lt-space-4) 0; }
code, kbd, pre, samp { font-family: var(--lt-font-mono); font-size: .92em; }
code { background: var(--lt-surface-2); padding: .1em .35em; border-radius: var(--lt-radius-sm); }
pre { background: var(--lt-surface); border: 1px solid var(--lt-border); padding: var(--lt-space-3) var(--lt-space-4); border-radius: var(--lt-radius); overflow: auto; }
pre code { background: none; padding: 0; }
kbd { border: 1px solid var(--lt-border-strong); border-bottom-width: 2px; border-radius: var(--lt-radius-sm); padding: 0 .4em; background: var(--lt-surface); }
img, svg, canvas, video { max-width: 100%; }
table { border-collapse: collapse; width: 100%; font-size: var(--lt-text-sm); }
th, td { text-align: left; padding: var(--lt-space-2) var(--lt-space-3); border-bottom: 1px solid var(--lt-border); vertical-align: top; }
th { color: var(--lt-fg-2); font-weight: var(--lt-weight-strong); }
::selection { background: var(--lt-accent-soft); }

/* Form controls */
button, input, select, textarea { font: inherit; color: inherit; }
button, .lt-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: var(--lt-space-2);
  min-height: 34px; padding: 0 var(--lt-space-4);
  border: 1px solid var(--lt-border-strong); border-radius: var(--lt-radius);
  background: var(--lt-bg); color: var(--lt-fg); cursor: pointer;
  transition: background var(--lt-dur) var(--lt-ease), border-color var(--lt-dur) var(--lt-ease), transform 80ms ease;
}
button:hover, .lt-btn:hover { background: var(--lt-surface); }
button:active, .lt-btn:active { transform: scale(.98); }
button:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible, [tabindex]:focus-visible {
  outline: 2px solid var(--lt-accent); outline-offset: 2px;
}
button:disabled { opacity: .5; cursor: default; transform: none; }
.lt-btn.primary, button.primary { background: var(--lt-accent); border-color: var(--lt-accent); color: var(--lt-accent-fg); font-weight: var(--lt-weight-strong); }
.lt-btn.primary:hover, button.primary:hover { filter: brightness(1.06); }
.lt-btn.ghost, button.ghost { background: transparent; border-color: transparent; color: var(--lt-fg-2); }
.lt-btn.ghost:hover, button.ghost:hover { background: var(--lt-surface); color: var(--lt-fg); }
.lt-btn.danger, button.danger { color: var(--lt-danger); border-color: var(--lt-danger); background: transparent; }
.lt-btn.small, button.small { min-height: 28px; padding: 0 var(--lt-space-3); font-size: var(--lt-text-sm); }
input[type="text"], input[type="number"], input[type="email"], input[type="search"], input[type="url"], input[type="date"], input[type="time"], input:not([type]), select, textarea {
  width: 100%; min-height: 34px; padding: 6px var(--lt-space-3);
  border: 1px solid var(--lt-border-strong); border-radius: var(--lt-radius); background: var(--lt-bg);
}
textarea { min-height: 80px; resize: vertical; }
input[type="range"] { width: auto; flex: 1 1 8em; min-width: 0; max-width: 100%; accent-color: var(--lt-accent); }
input[type="checkbox"], input[type="radio"] { accent-color: var(--lt-accent); width: 16px; height: 16px; flex: none; }
label { display: inline-flex; align-items: center; gap: var(--lt-space-2); flex-wrap: nowrap; }

/* Layout */
.lt-stack { display: flex; flex-direction: column; gap: var(--lt-space-3); }
.lt-row { display: flex; align-items: center; gap: var(--lt-space-3); flex-wrap: wrap; }
.lt-spread { display: flex; align-items: center; justify-content: space-between; gap: var(--lt-space-3); }
.lt-grid { display: grid; gap: var(--lt-space-3); grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--lt-grid-min, 180px)), 1fr)); }
.lt-pad { padding: var(--lt-space-4); }
.lt-center { display: grid; place-items: center; }
.lt-muted { color: var(--lt-fg-2); }
.lt-faint { color: var(--lt-fg-3); }
.lt-mono { font-family: var(--lt-font-mono); }
.lt-serif { font-family: var(--lt-font-serif); }
.lt-num { font-variant-numeric: tabular-nums; }

/* Surfaces */
.lt-card { background: var(--lt-bg); border: 1px solid var(--lt-border); border-radius: var(--lt-radius-lg); padding: var(--lt-space-4); }
.lt-card.soft { background: var(--lt-surface); border-color: transparent; }
.lt-card.raised { box-shadow: var(--lt-shadow); border-color: transparent; }
.lt-divider { height: 1px; background: var(--lt-border); margin: var(--lt-space-3) 0; }

/* Labels */
.lt-badge { display: inline-flex; align-items: center; gap: 4px; padding: 1px 9px; border-radius: var(--lt-radius-full); font-size: var(--lt-text-xs); font-weight: var(--lt-weight-strong); background: var(--lt-surface-2); color: var(--lt-fg-2); }
.lt-badge.accent { background: var(--lt-accent-soft); color: var(--lt-accent); }
.lt-badge.ok { background: var(--lt-success-soft); color: var(--lt-success); }
.lt-badge.warn { background: var(--lt-warning-soft); color: var(--lt-warning); }
.lt-badge.bad { background: var(--lt-danger-soft); color: var(--lt-danger); }

/* Callouts */
.lt-callout { border-radius: var(--lt-radius); padding: var(--lt-space-3) var(--lt-space-4); background: var(--lt-surface); border: 1px solid var(--lt-border); }
.lt-callout.info { background: var(--lt-accent-soft); border-color: transparent; }
.lt-callout.ok { background: var(--lt-success-soft); border-color: transparent; }
.lt-callout.warn { background: var(--lt-warning-soft); border-color: transparent; }
.lt-callout.bad { background: var(--lt-danger-soft); border-color: transparent; }

/* Chips and choices: selection is shown with aria-pressed="true" or .selected */
.lt-chip { min-height: 30px; padding: 0 var(--lt-space-3); border-radius: var(--lt-radius-full); background: var(--lt-surface); border-color: var(--lt-border); font-size: var(--lt-text-sm); }
.lt-chip[aria-pressed="true"], .lt-chip.selected { background: var(--lt-accent-soft); border-color: var(--lt-accent); color: var(--lt-accent); font-weight: var(--lt-weight-strong); }
.lt-choices { display: grid; gap: var(--lt-space-2); grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--lt-choice-min, 170px)), 1fr)); }
.lt-choice {
  display: flex; flex-direction: column; align-items: flex-start; justify-content: flex-start; gap: 2px;
  text-align: left; min-height: 0; padding: var(--lt-space-3) var(--lt-space-4);
  border: 1px solid var(--lt-border); border-radius: var(--lt-radius-lg); background: var(--lt-bg);
}
.lt-choice b, .lt-choice strong { font-weight: var(--lt-weight-strong); }
.lt-choice span, .lt-choice small { color: var(--lt-fg-2); font-size: var(--lt-text-sm); line-height: 1.5; }
.lt-choice:hover { border-color: var(--lt-border-strong); background: var(--lt-surface); }
.lt-choice[aria-pressed="true"], .lt-choice.selected { border-color: var(--lt-accent); background: var(--lt-accent-soft); }
.lt-choice[aria-pressed="true"] b, .lt-choice.selected b { color: var(--lt-accent); }

/* Fields */
.lt-field { display: flex; flex-direction: column; align-items: stretch; gap: 6px; }
.lt-field > span:first-child, .lt-field > label:first-child { font-size: var(--lt-text-sm); color: var(--lt-fg-2); font-weight: var(--lt-weight-strong); }
.lt-error { color: var(--lt-danger); font-size: var(--lt-text-sm); min-height: 1em; }

/* Numbers */
.lt-stat { background: var(--lt-surface); border-radius: var(--lt-radius); padding: var(--lt-space-3) var(--lt-space-4); }
.lt-stat > :first-child { font-size: var(--lt-text-sm); color: var(--lt-fg-2); }
.lt-stat > :nth-child(2) { font-size: var(--lt-text-2xl); font-weight: var(--lt-weight-strong); font-variant-numeric: tabular-nums; line-height: 1.25; }
.lt-progress { height: 8px; border-radius: var(--lt-radius-full); background: var(--lt-surface-2); overflow: hidden; }
.lt-progress > i { display: block; height: 100%; width: var(--value, 0%); background: var(--lt-accent); border-radius: inherit; transition: width var(--lt-dur) var(--lt-ease); }
.lt-kv { display: grid; grid-template-columns: max-content 1fr; gap: 6px var(--lt-space-4); font-size: var(--lt-text-sm); }
.lt-kv > :nth-child(odd) { color: var(--lt-fg-2); }

/* Tabs (data-lt-tabs) and steps (data-lt-steps): panels are switched by the runtime */
.lt-tabs > [role="tablist"] { display: flex; gap: var(--lt-space-1); border-bottom: 1px solid var(--lt-border); margin-bottom: var(--lt-space-3); }
.lt-tabs > [role="tablist"] > button { border: 0; border-bottom: 2px solid transparent; border-radius: 0; background: transparent; color: var(--lt-fg-2); min-height: 34px; padding: 0 var(--lt-space-3); }
.lt-tabs > [role="tablist"] > button[aria-selected="true"] { color: var(--lt-fg); border-bottom-color: var(--lt-accent); font-weight: var(--lt-weight-strong); }
[data-lt-hidden] { display: none !important; }
.lt-dots { display: flex; gap: 6px; justify-content: center; }
.lt-dots > i { width: 7px; height: 7px; border-radius: 50%; background: var(--lt-border-strong); }
.lt-dots > i.on { background: var(--lt-accent); }

/* Motion */
@media (prefers-reduced-motion: no-preference) {
  .lt-fade-in { animation: lt-fade-in .3s var(--lt-ease) both; }
  @keyframes lt-fade-in { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { transition-duration: 0s !important; animation-duration: 0s !important; }
}
`;var tt="__lantern";function xt(){let e="__lantern",n=document.getElementById("lantern-boot"),r=JSON.parse(n&&n.textContent||"{}");try{let a=window.navigation;a&&typeof a.addEventListener=="function"&&a.addEventListener("navigate",l=>{let s=!1;try{let u=new URL(String(l.destination&&l.destination.url||""));if(location.protocol==="http:"||location.protocol==="https:"){let k=new URL("./",location.href);s=(u.protocol==="http:"||u.protocol==="https:")&&u.href.indexOf(k.href)===0}}catch{s=!1}!s&&l.cancelable&&l.preventDefault()})}catch{}let o=r.state||"idle",i=r.response,d=r.scheme||"light",p=r.widgetState===void 0?null:r.widgetState,b=1,x={};function m(a){a[e]=1,parent.postMessage(a,"*")}function y(a,l){let s=b++;return new Promise((u,k)=>{x[s]={resolve:u,reject:k};let q={type:a,id:s};for(let Q of Object.keys(l))q[Q]=l[Q];m(q)})}function W(a,l){let s;try{s=JSON.stringify(a===void 0?null:a)}catch{s=void 0}if(typeof s!="string")throw new TypeError("lantern."+l+": value is not JSON-serializable");if(s.length>65536)throw new RangeError("lantern."+l+": value is larger than 64 KB");return s}function D(a,l){window.dispatchEvent(new CustomEvent("lantern:"+a,{detail:l}))}function G(){document.documentElement.setAttribute("data-lt-state",o);let a=o==="answered"||o==="dismissed"||o==="closed";document.querySelectorAll('[data-lt-submit], form[data-lt-form] button:not([type="button"]), form[data-lt-form] input[type="submit"]').forEach(l=>{let s=l;a?(s.disabled=!0,s.setAttribute("data-lt-locked","")):s.hasAttribute("data-lt-locked")&&(s.disabled=!1,s.removeAttribute("data-lt-locked"))})}function P(){let a=getComputedStyle(document.documentElement),l=[];for(let s=1;s<=8;s++)l.push(a.getPropertyValue("--lt-series-"+s).trim());return l}let T=!0,L={get id(){return r.id},get state(){return o},get response(){return i},get theme(){return d},get mode(){return r.mode},get visible(){return T},submit(a){try{return y("submit",{json:W(a,"submit")})}catch(l){return Promise.reject(l)}},send(a){return typeof a!="string"||a.trim()===""?Promise.reject(new TypeError("lantern.send: text must be a non-empty string")):y("send",{text:a.slice(0,4e3)})},openLink(a){m({type:"open-link",url:String(a)})},expand(){m({type:"expand"})},getState(){return p},setState(a){p=a,m({type:"set-state",json:W(a,"setState")})},colors:P,on(a,l){let s=u=>l(u.detail);return window.addEventListener("lantern:"+a,s),()=>window.removeEventListener("lantern:"+a,s)}};Object.defineProperty(window,"lantern",{value:Object.freeze(L),configurable:!1,writable:!1,enumerable:!0}),window.addEventListener("message",a=>{if(a.source!==parent)return;let l=a.data;if(!(!l||l[e]!==1)){if(l.type==="reply"){let s=x[l.id];if(!s)return;delete x[l.id],l.ok?s.resolve(!0):s.reject(new Error(l.error||"lantern: request failed"))}else if(l.type==="state")o=l.state,i=l.response,G(),D("state",{state:o,response:i});else if(l.type==="theme"){d=l.scheme,document.documentElement.setAttribute("data-theme",d);let s=document.getElementById("lantern-theme");s&&(s.textContent=l.css),D("theme",{scheme:d})}else if(l.type==="partial"&&r.streaming){let s=document.getElementById("lantern-stream");s&&(s.innerHTML=l.html)}}});let C=document.documentElement,K=r.mode!=="panel"&&!r.streaming,H=Number(r.maxHeight)>0?Number(r.maxHeight):2400;C.setAttribute("data-lt-mode",r.mode==="panel"?"panel":"inline");let F=-1,M=!1,ee=-1,j=-1,O=0,V=!1,g=0,J=!1;function B(){let a=C.getBoundingClientRect();return Math.ceil(Math.max(a.height,document.body?document.body.scrollHeight:0))}function f(){if(M=!1,document.fullscreenElement)return;let a=B(),l=window.innerHeight;if(K&&!g&&j>0&&l!==j){let u=a>=l-1&&Math.abs(a-ee-(l-j))<=1;O=u?O+1:0,u&&(V||O>=3)&&(g=Math.round(Math.min(540,Math.max(320,window.innerWidth*.62)))),V=!1}ee=a,j=l;let s=g||a;!g&&!J&&s<=l||(C.toggleAttribute("data-lt-overflow",r.mode!=="panel"&&s>H),!(Math.abs(s-F)<2)&&(F=s,m({type:"resize",height:s})))}function h(){M||(M=!0,requestAnimationFrame(f))}function N(){if(!K||g||V||document.fullscreenElement||!document.body)return;let a=window.innerHeight;Math.abs(B()-a)>1||!Array.from(document.body.children).some(s=>Math.abs(s.offsetHeight-a)<=1)||(V=!0,F=a+2,m({type:"resize",height:F}),setTimeout(()=>{V=!1},1e3))}typeof ResizeObserver=="function"&&new ResizeObserver(h).observe(C),window.addEventListener("resize",h),window.addEventListener("load",()=>{h(),setTimeout(N,300),setTimeout(N,1500)}),document.addEventListener("fullscreenchange",()=>{O=0,j=-1,h()});let S=!0;function R(){let a=S&&document.visibilityState!=="hidden";a!==T&&(T=a,D("visibility",T))}if(typeof IntersectionObserver=="function"&&new IntersectionObserver(a=>{let l=a[a.length-1];l&&(S=l.isIntersecting,R())}).observe(C),document.addEventListener("visibilitychange",R),K){let a=EventTarget.prototype.addEventListener,l=new WeakSet;EventTarget.prototype.addEventListener=function(k,q,Q){return(k==="wheel"||k==="mousewheel"||k==="DOMMouseScroll")&&l.add(this),a.call(this,k,q,Q)};let s=!1,u=0;a.call(window,"pointerdown",()=>{s=!0},!0),a.call(window,"blur",()=>{s=!1}),a.call(document,"mouseout",k=>{k.relatedTarget||(s=!1)},!0),a.call(window,"wheel",k=>{let q=k;if(s||q.ctrlKey||q.metaKey||document.fullscreenElement||!q.composedPath().some(me=>l.has(me)||typeof me.onwheel=="function"))return;q.stopImmediatePropagation();let oe=Date.now();oe-u>2500&&(u=oe,m({type:"hint",kind:"wheel"}))},{capture:!0,passive:!0})}window.addEventListener("webglcontextlost",a=>{a.target.isConnected&&m({type:"gl",lost:!0})},!0),window.addEventListener("webglcontextrestored",()=>m({type:"gl",lost:!1}),!0);function X(a){if(a===null||a==="")return null;try{return JSON.parse(a)}catch{return a}}function ke(a){let l={};return new FormData(a).forEach((s,u)=>{let k=typeof s=="string"?s:s.name;u in l?l[u]=[].concat(l[u],k):l[u]=k}),a.querySelectorAll('input[type="checkbox"][name]').forEach(s=>{let u=s;!(u.name in l)&&!a.querySelector('input[type="checkbox"][name="'+u.name+'"][value]:not([value="on"])')?l[u.name]=!1:l[u.name]==="on"&&(l[u.name]=!0)}),l}function se(a){let l=[];return a.querySelectorAll("[data-lt-choice]").forEach(s=>{s.getAttribute("aria-pressed")==="true"&&l.push(X(s.getAttribute("data-lt-choice")))}),a.hasAttribute("data-lt-multi")?l:l.length?l[0]:null}function $e(a){let l=a.closest("form");if(l)return ke(l);let s=a.parentElement;for(;s&&s!==document.body;){let k=s.querySelector("[data-lt-choices]");if(k)return se(k);s=s.parentElement}let u=document.querySelector("[data-lt-choices]");return u?se(u):null}function fe(a,l){let s=a.parentElement&&a.parentElement.querySelector(".lt-error[data-lt-auto]");!s&&a.parentElement&&(s=document.createElement("div"),s.className="lt-error",s.setAttribute("data-lt-auto",""),a.parentElement.appendChild(s)),s&&(s.textContent=l)}function te(){let a=String(r.lang||navigator.language||"en").toLowerCase();return a.startsWith("ja")?"\u9078\u3093\u3067\u304B\u3089\u9001\u3063\u3066\u304F\u3060\u3055\u3044\u3002":a.startsWith("zh")?"\u8BF7\u5148\u9009\u62E9\u518D\u63D0\u4EA4\u3002":"Pick an option first."}function xe(a){return a===null||a===""||Array.isArray(a)&&a.length===0}document.addEventListener("click",a=>{let l=a.target;if(!l||!l.closest)return;let s=l.closest("[data-lt-choice]");if(s){let v=s.closest("[data-lt-choices]"),_=!!v&&v.hasAttribute("data-lt-multi"),z=s.getAttribute("aria-pressed")==="true";if(v&&!_&&v.querySelectorAll("[data-lt-choice]").forEach(be=>be.setAttribute("aria-pressed","false")),s.setAttribute("aria-pressed",_?String(!z):"true"),v){D("select",se(v));let be=v.parentElement&&v.parentElement.querySelector(".lt-error[data-lt-auto]");be&&(be.textContent="")}v&&v.hasAttribute("data-lt-instant")&&!_&&L.submit(se(v)).catch(()=>{});return}let u=l.closest("[data-lt-submit]");if(u&&!u.disabled){a.preventDefault();let v=u.getAttribute("data-lt-submit"),_=v?X(v):$e(u);if(!v&&xe(_)){fe(u,u.getAttribute("data-lt-empty")||te());return}fe(u,""),L.submit(_).catch(z=>fe(u,z.message));return}let k=l.closest("[data-lt-send]");if(k){a.preventDefault(),L.send(k.getAttribute("data-lt-send")||"").catch(()=>{});return}if(l.closest("[data-lt-expand]")){a.preventDefault(),L.expand();return}if(l.closest("[data-lt-fullscreen]")){a.preventDefault(),(document.fullscreenElement?document.exitFullscreen():C.requestFullscreen()).catch(()=>{});return}let oe=l.closest('[role="tablist"] > [data-tab]');if(oe){let v=oe.closest("[data-lt-tabs]");if(v){let _=oe.getAttribute("data-tab");v.querySelectorAll('[role="tablist"] > [data-tab]').forEach(z=>z.setAttribute("aria-selected",String(z===oe))),v.querySelectorAll("[data-tab-panel]").forEach(z=>{z.getAttribute("data-tab-panel")===_?z.removeAttribute("data-lt-hidden"):z.setAttribute("data-lt-hidden","")})}return}let me=l.closest("[data-lt-next],[data-lt-prev]");if(me){let v=me.closest("[data-lt-steps]");v&&ge(v,Number(v.getAttribute("data-index")||0)+(me.hasAttribute("data-lt-next")?1:-1));return}let ie=l.closest("a[href]");if(ie&&!a.defaultPrevented){let v=ie.getAttribute("href")||"";if(ie.hasAttribute("download")&&/^(blob|data):/i.test(ie.href))return;if(v.startsWith("#")){a.preventDefault();let z=document.getElementById(decodeURIComponent(v.slice(1)));z&&z.scrollIntoView({behavior:"smooth"});return}let _=!1;try{if(location.protocol==="http:"||location.protocol==="https:"){let z=new URL(ie.href),be=new URL("./",location.href);_=z.href.indexOf(be.href)===0}}catch{_=!1}if(_)return;a.preventDefault(),/^https?:\/\//i.test(ie.href)&&L.openLink(ie.href)}},!1),document.addEventListener("submit",a=>{let l=a.target;if(!(!l||!l.hasAttribute("data-lt-form"))){if(a.preventDefault(),!l.checkValidity()){l.reportValidity();return}L.submit(ke(l)).catch(s=>fe(l.lastElementChild||l,s.message))}});function ge(a,l){let s=a.querySelectorAll("[data-step]");if(s.length===0)return;let u=(l+s.length)%s.length;a.setAttribute("data-index",String(u)),s.forEach((q,Q)=>{Q===u?q.removeAttribute("data-lt-hidden"):q.setAttribute("data-lt-hidden","")});let k=a.querySelector("[data-lt-dots]");k&&(k.innerHTML=Array.from(s).map((q,Q)=>'<i class="'+(Q===u?"on":"")+'"></i>').join("")),D("step",u)}function Z(){document.documentElement.setAttribute("data-theme",d),G(),document.querySelectorAll("[data-lt-tabs]").forEach(a=>{let l=a.querySelector('[role="tablist"] > [data-tab][aria-selected="true"]')||a.querySelector('[role="tablist"] > [data-tab]');l&&l.click()}),document.querySelectorAll("[data-lt-steps]").forEach(a=>ge(a,0)),o==="answered"&&i!==void 0&&document.querySelectorAll("[data-lt-choices]").forEach(a=>{let l=[].concat(i);a.querySelectorAll("[data-lt-choice]").forEach(s=>{let u=X(s.getAttribute("data-lt-choice"));l.some(k=>JSON.stringify(k)===JSON.stringify(u))&&s.setAttribute("aria-pressed","true")})}),typeof ResizeObserver=="function"&&document.body&&new ResizeObserver(h).observe(document.body),J=!0,h(),m({type:"ready"})}let Y=0;window.addEventListener("error",a=>{/^ResizeObserver loop/.test(String(a.message))||Y++<3&&m({type:"error",message:String(a.message||"Script error")})}),window.addEventListener("unhandledrejection",a=>{Y++<3&&m({type:"error",message:String(a.reason&&a.reason.message||a.reason||"Unhandled rejection")})}),document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Z):Z()}var fn="@layer lantern-kit, lantern-theme;",Zn=Re.slice(0,Math.max(0,Re.indexOf("/* Base */"))),gn="body{padding:var(--lt-pad,16px)}";function mn(e){return JSON.stringify(e===void 0?null:e).replace(/</g,"\\u003c").replace(/>/g,"\\u003e").replace(/&/g,"\\u0026").replace(/\u2028/g,"\\u2028").replace(/\u2029/g,"\\u2029")}function kt(e){let t=Object.entries(e).filter(([n,r])=>/^--lt-[a-z0-9-]+$/.test(n)&&r!==""&&!/[;{}<]/.test(r)).map(([n,r])=>`${n}:${r}`).join(";");return t===""?"":`@layer lantern-theme{:root{${t}}}`}var bn=`(${xt.toString()})();`;function St(e){return["default-src 'none'",e?`script-src 'nonce-${e}'`:"script-src https: http: 'unsafe-inline' data: blob:","style-src 'unsafe-inline' data: blob:","img-src data: blob:","font-src data: blob:","connect-src data: blob:","media-src data: blob:","worker-src 'none'","frame-src 'none'","object-src 'none'","form-action 'none'","base-uri 'none'","navigate-to 'none'"].join("; ")}var er=St();function hn(e,t){let n=e.streaming?Array.from(crypto.getRandomValues(new Uint8Array(16)),o=>o.toString(16).padStart(2,"0")).join(""):void 0;return`<meta http-equiv="Content-Security-Policy" content="${St(n)}"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><script type="application/json" id="lantern-boot">${mn(e)}<\/script><script${n?` nonce="${n}"`:""}>${bn.replace(/<\/script/gi,"<\\/script")}<\/script><style id="lantern-kit">${fn}@layer lantern-kit{${Re}${gn}}</style><style id="lantern-theme">${t}</style>`}function yn(e){return e.replace(/<!--[\s\S]*?(-->|$)/g,t=>" ".repeat(t.length)).replace(/(<script\b[^>]*>)([\s\S]*?)(<\/script>|$)/gi,(t,n,r,o)=>n+" ".repeat(r.length)+o)}function Ae(e,t){let n=new RegExp(`<${t}(\\s[^>]*)?>`,"i").exec(yn(e));if(!n)return null;let r=[e.slice(n.index,n.index+n[0].length)];return r.index=n.index,r}function vn(e,t){let n=Ae(e,"head");if(n)return e.slice(0,n.index+n[0].length)+t+e.slice(n.index+n[0].length);let r=Ae(e,"html");if(r)return e.slice(0,r.index+r[0].length)+`<head>${t}</head>`+e.slice(r.index+r[0].length);let o=/^\s*<!doctype[^>]*>/i.exec(e);return o?o[0]+t+e.slice(o[0].length):t+e}var Et=/^\s*(?:<!--[\s\S]*?-->\s*)*(?:<!doctype[^>]*>|<html[\s>])/i;function Tt(e,t,n){let r=hn(t,n),o=t.scheme==="dark"?"dark":"light";return t.streaming?`<!doctype html><html data-theme="${o}"><head>${r}</head><body><div id="lantern-stream"></div></body></html>`:Et.test(e)&&(Ae(e,"head")||Ae(e,"html"))?vn(e,r):`<!doctype html><html data-theme="${o}"><head>${r}</head><body>${e}</body></html>`}function Ce(e){let t=e,n=t.lastIndexOf("<");n>t.lastIndexOf(">")&&(t=t.slice(0,n)),t=t.replace(/<script[\s\S]*?(<\/script>|$)/gi,"").replace(/<\/?(?:iframe|object|embed|frame|frameset|meta|base|link|portal)\b[^>]*>/gi,"").replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi,"").replace(/(href|src|action|formaction|xlink:href)\s*=\s*("\s*javascript:[^"]*"|'\s*javascript:[^']*'|javascript:[^\s>]+)/gi,'$1=""');let r=/<body[^>]*>/i.exec(t);if(r)t=(t.slice(0,r.index).match(/<style[\s\S]*?<\/style>/gi)??[]).join("")+t.slice(r.index+r[0].length);else if(Et.test(t))return(t.match(/<style[\s\S]*?<\/style>/gi)??[]).join("");return t}var wn=[["--lt-bg",["--dsw-alias-bg-base"]],["--lt-surface",["--dsw-alias-bg-layer-1"]],["--lt-surface-2",["--dsw-alias-bg-layer-2"]],["--lt-fg",["--dsw-alias-label-primary"]],["--lt-fg-2",["--dsw-alias-label-secondary"]],["--lt-fg-3",["--dsw-alias-label-tertiary"]],["--lt-border",["--dsw-alias-border-l1"]],["--lt-border-strong",["--dsw-alias-border-l2"]],["--lt-accent",["--dsw-alias-brand-primary"]],["--lt-success",["--dsw-alias-state-success-primary"]],["--lt-warning",["--dsw-alias-state-warn-primary"]],["--lt-danger",["--dsw-alias-state-error-primary"]]],xn=[["--lt-accent-soft","--lt-accent",14],["--lt-success-soft","--lt-success",14],["--lt-warning-soft","--lt-warning",16],["--lt-danger-soft","--lt-danger",13]];function nt(e,t){for(let n of t){let r=e.getPropertyValue(n).trim();if(r!=="")return r}return""}var re;function at(e){return re||(re=document.createElement("span"),re.style.display="none"),re.isConnected||document.body.appendChild(re),re.style.color="",re.style.color=e,getComputedStyle(re).color}function kn(e,t){return e===t||at(e)===at(t)}function Sn(e){let t=/rgba?\(([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)/.exec(at(e));if(!t)return 0;let[n,r,o]=[t[1],t[2],t[3]].map(i=>{let d=Number(i)/255;return d<=.03928?d/12.92:((d+.055)/1.055)**2.4});return .2126*n+.7152*r+.0722*o}function Nt(){let e=document.body,t=e?.hasAttribute("data-ds-dark-theme")||!e&&document.documentElement.style.colorScheme==="dark"?"dark":"light";if(!e)return{scheme:t,css:""};let n=getComputedStyle(e),r={};for(let[x,m]of wn){let y=nt(n,m);y!==""&&(r[x]=y)}let o=r["--lt-bg"],i=r["--lt-fg"];if(o!==void 0&&i!==void 0){let x=m=>m===void 0||kn(m,o);x(r["--lt-surface"])&&(r["--lt-surface"]=`color-mix(in srgb, ${i} 4%, ${o})`),(x(r["--lt-surface-2"])||r["--lt-surface-2"]===r["--lt-surface"])&&(r["--lt-surface-2"]=`color-mix(in srgb, ${i} 8%, ${o})`)}for(let[x,m,y]of xn){let W=r[m];W!==void 0&&(r[x]=`color-mix(in srgb, ${W} ${y}%, transparent)`)}let d=r["--lt-accent"];d!==void 0&&(r["--lt-accent-fg"]=Sn(d)>.55?"#111111":"#ffffff");let p=nt(n,["--dsh-font-family-text","--dsw-font-family"]);p!==""&&(r["--lt-font-sans"]=`${p}, system-ui, "Hiragino Sans", "Noto Sans JP", "Noto Sans CJK JP", sans-serif`);let b=nt(n,["--dsh-font-family-code","--ds-font-family-code"]);return b!==""&&(r["--lt-font-mono"]=`${b}, ui-monospace, Menlo, Consolas, monospace`),{scheme:t,css:kt(r)}}var ue,Oe=new Set,ve,Me,st=!1;function En(){st=!1;let e=Nt();if(!(ue&&e.scheme===ue.scheme&&e.css===ue.css)){ue=e;for(let t of Oe)t(e)}}function rt(){st||(st=!0,requestAnimationFrame(En))}function Pe(){return ue===void 0&&(ue=Nt()),ue}function It(e){return Oe.add(e),ve===void 0&&typeof MutationObserver=="function"&&(ve=new MutationObserver(rt),document.body&&ve.observe(document.body,{attributes:!0,attributeFilter:["data-ds-dark-theme","style","class"]}),ve.observe(document.documentElement,{attributes:!0,attributeFilter:["style","data-ds-theme-source","lang","class"]}),Me=window.matchMedia?.("(prefers-color-scheme: dark)"),Me?.addEventListener?.("change",rt)),()=>{Oe.delete(e),Oe.size===0&&(ve?.disconnect(),ve=void 0,Me?.removeEventListener?.("change",rt),Me=void 0)}}var Mt=require("react/jsx-runtime"),Tn="allow-scripts allow-forms allow-downloads",Lt=2400,Rt=64*1024,Nn=1500,In=6,Ct=0,At=!1;function Ln(){if(At)return;At=!0;let e=()=>{Ct=performance.now()};window.addEventListener("pointerdown",e,!0),window.addEventListener("keydown",e,!0)}function ot(e,t){if(!e||document.activeElement!==e||t===0||Ct>t)return!1;let n=navigator.userActivation;return n?n.isActive:!1}function it(e){let{callId:t,sessionId:n,mode:r,html:o,url:i,streaming:d=!1,paused:p=!1,state:b,response:x}=e,m=(0,E.useRef)(null),y=(0,E.useRef)(!1),[W,D]=(0,E.useState)(r==="inline"?p?220:120:0),G=(0,E.useRef)(e);G.current=e;let P=(0,E.useRef)(0),T=(0,E.useRef)(0),L=(0,E.useRef)(0),C=(0,E.useRef)(0),K=(0,E.useRef)(0),H=(0,E.useRef)(!1);(0,E.useEffect)(()=>{Ln();let g=()=>{document.activeElement===m.current&&(C.current=performance.now())};return window.addEventListener("blur",g),()=>window.removeEventListener("blur",g)},[]);let F=(0,E.useRef)({state:b,response:x}),M=(0,E.useMemo)(()=>{if(o===void 0)return;let g=ne(t,n),J=null;if(g.state!==void 0)try{J=JSON.parse(g.state)}catch{J=null}let B=Pe(),f=d&&!p,h={id:t,state:F.current.state,response:F.current.response??null,scheme:B.scheme,mode:r,widgetState:J,streaming:f,lang:Se(),...r==="inline"?{maxHeight:G.current.maxHeight??Lt}:{}},N=f?"":p?Ce(o):o;return Tt(N,h,B.css)},[o,d,p,t,n,r]),ee=(0,E.useMemo)(()=>{if(i===void 0)return;let g=new URL(i);return g.searchParams.set("lt",t),g.searchParams.set("theme",Pe().scheme),g.searchParams.set("lang",Se()),g.href},[i,t]),j=g=>{m.current?.contentWindow?.postMessage({...g,[tt]:1},"*")};(0,E.useEffect)(()=>{y.current=!1,K.current=0,H.current=!1;let g=J=>{let B=m.current?.contentWindow;if(!B||J.source!==B)return;let f=J.data;if(!f||f[tt]!==1||typeof f.type!="string"||H.current)return;let h=G.current,N=(S,R,X)=>{typeof S=="number"&&j({type:"reply",id:S,ok:R,...X?{error:X}:{}})};switch(f.type){case"ready":{y.current=!0;let S=Pe();j({type:"theme",css:S.css,scheme:S.scheme}),j({type:"state",state:h.state,response:h.response??null}),h.streaming&&h.html!==void 0&&j({type:"partial",html:Ce(h.html)});return}case"resize":{if(h.mode!=="inline")return;let S=Number(f.height);Number.isFinite(S)&&D(Math.max(24,Math.min(Math.ceil(S),h.maxHeight??Lt)));return}case"hint":h.mode==="inline"&&!h.streaming&&f.kind==="wheel"&&h.onWheelHint?.();return;case"gl":h.streaming||h.onGlLost?.(f.lost===!0);return;case"submit":case"send":{if(h.streaming){N(f.id,!1,"The visual is still being written.");return}if(!ot(m.current,C.current)){N(f.id,!1,"Only a user action inside the visual can do this.");return}let S=Date.now();if(S-P.current<400){N(f.id,!1,"Too fast.");return}if(f.type==="send"){if(S-T.current<Nn||L.current>=In){N(f.id,!1,"Too many messages from this visual.");return}T.current=S,L.current++}if(P.current=S,f.type==="submit"){if(typeof f.json!="string"||f.json.length>Rt){N(f.id,!1,"The answer is too large.");return}if(h.state==="answered"||h.state==="dismissed"||h.state==="closed"){N(f.id,!1,"This visual is already settled.");return}let R;try{R=JSON.parse(f.json)}catch{N(f.id,!1,"The answer is not JSON.");return}h.onSubmit(R).then(()=>N(f.id,!0),X=>N(f.id,!1,X.message))}else{if(typeof f.text!="string"||f.text.trim()===""){N(f.id,!1,"Empty message.");return}h.onSend(f.text.slice(0,4e3)).then(()=>N(f.id,!0),R=>N(f.id,!1,R.message))}return}case"expand":{if(h.streaming||!ot(m.current,C.current))return;let S=Date.now();if(S-P.current<1e3)return;P.current=S,h.onExpand?.();return}case"open-link":{if(h.streaming||!ot(m.current,C.current)||typeof f.url!="string")return;let S=Date.now();if(S-P.current<1e3)return;P.current=S;let R;try{R=new URL(f.url)}catch{return}if(R.protocol!=="http:"&&R.protocol!=="https:")return;window.open(R.href,"_blank","noopener,noreferrer");return}case"set-state":!h.streaming&&typeof f.json=="string"&&f.json.length<=Rt&&ce(h.callId,{state:f.json},h.sessionId);return;case"error":typeof f.message=="string"&&h.onError?.(f.message.slice(0,300));return}};return window.addEventListener("message",g),()=>window.removeEventListener("message",g)},[M,ee]),(0,E.useEffect)(()=>{y.current&&j({type:"state",state:b,response:x??null})},[b,JSON.stringify(x??null)]),(0,E.useEffect)(()=>It(g=>{y.current&&j({type:"theme",css:g.css,scheme:g.scheme})}),[]);let O=(0,E.useRef)(void 0);(0,E.useEffect)(()=>{!d||o===void 0||O.current===void 0&&(O.current=window.setTimeout(()=>{O.current=void 0;let g=G.current;y.current&&g.html!==void 0&&j({type:"partial",html:Ce(g.html)})},120))},[d,o]),(0,E.useEffect)(()=>()=>{O.current!==void 0&&clearTimeout(O.current)},[]);let V=r==="inline"?{height:`${W}px`}:void 0;return(0,Mt.jsx)("iframe",{ref:m,className:"lantern-frame","data-mode":r,title:t,sandbox:p?"allow-downloads":Tn,"data-scripts":p?"off":"on",onLoad:()=>{K.current++,M!==void 0&&K.current>1&&(H.current=!0)},allow:"fullscreen; clipboard-write",referrerPolicy:"no-referrer",style:V,...M!==void 0?{srcDoc:M}:{src:ee}})}function Rn(e,t,n){return e==="preparing"?!0:e==="replay"||t===void 0?!1:t>=n}var An=1500;function Cn(e=setTimeout,t=clearTimeout){let n=new Map,r=new Set,o=()=>{for(let i of r)i()};return{observe(i,d){return n.has(i)?!1:(n.set(i,{run:d,mounts:0,armed:!1}),!0)},poke(){o()},enabled(i){let d=n.get(i);return d!==void 0&&(d.run||d.armed)},arm(i){let d=n.get(i)??{run:!1,mounts:0,armed:!1};d.run=!0,d.armed=!0,n.set(i,d),o()},retain(i){let d=n.get(i);d&&(d.timer!==void 0&&(t(d.timer),d.timer=void 0),d.mounts++)},release(i){let d=n.get(i);d&&(d.mounts=Math.max(0,d.mounts-1),!(d.mounts>0||d.timer!==void 0)&&(d.timer=e(()=>{d.timer=void 0,d.mounts===0&&(d.run=!1,d.armed=!1,o())},An)))},subscribe(i){return r.add(i),()=>r.delete(i)}}}var Mn=Date.now(),pe=Cn();function Ot(e,t,n){return pe.observe(e,Rn(t,n,Mn))}function Pt(e){return pe.enabled(e)}function jt(e){pe.arm(e)}function zt(e){pe.retain(e)}function $t(e){pe.release(e)}function Ht(e){return pe.subscribe(e)}function Vt(){pe.poke()}var c=require("react/jsx-runtime");function ae({name:e}){return(0,c.jsx)("svg",{className:"lantern-icon",viewBox:"0 0 16 16",width:"14",height:"14",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:{visual:(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)("rect",{x:"2.5",y:"3",width:"11",height:"10",rx:"2"}),(0,c.jsx)("path",{d:"M5 10l2-2.5 1.6 1.8L10.5 7 12 10"})]}),sidebar:(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)("rect",{x:"2.5",y:"3",width:"11",height:"10",rx:"2"}),(0,c.jsx)("path",{d:"M9.5 3v10"})]}),chevron:(0,c.jsx)("path",{d:"M4.5 6.5L8 10l3.5-3.5"}),skip:(0,c.jsx)("path",{d:"M4.5 4.5l7 7M11.5 4.5l-7 7"}),arrow:(0,c.jsx)("path",{d:"M4 8h8M8.5 4.5L12 8l-3.5 3.5"})}[e]})}function On(e,t){document.querySelector(`[data-lantern-key="${CSS.escape(A(e,t))}"]`)?.scrollIntoView({behavior:"smooth",block:"center"})}function Pn(e){return(0,w.useSyncExternalStore)(Ht,()=>Pt(e),()=>!1)}function je({record:e,sessionId:t,placement:n,phase:r,partialHtml:o}){let i=U(),d=e.callId,p=t??e.sessionId,b=A(d,p),x=Pn(b);(0,w.useEffect)(()=>(zt(b),()=>$t(b)),[b]);let m=(0,w.useCallback)(()=>jt(b),[b]),y=de(()=>pt(d,p)),W=de(()=>ne(d,p)),[D,G]=(0,w.useState)([]),[P,T]=(0,w.useState)(void 0),[L,C]=(0,w.useState)(!1),[K,H]=(0,w.useState)(!1),[F,M]=(0,w.useState)(!1),[ee,j]=(0,w.useState)(0),O=(0,w.useRef)(void 0);(0,w.useEffect)(()=>()=>{O.current!==void 0&&clearTimeout(O.current)},[]);let V=e.args,{state:g,response:J}=e.error!==void 0?{state:"closed",response:void 0}:mt(e,r),B=V?.title||i.visual,f=(e.result?.path??V?.path)!==void 0,h=V?.display??"inline",N=(0,w.useCallback)(async s=>{T(void 0);try{await yt(d,p,s)}catch(u){throw T(`${i.sendFailed}: ${u.message}`),u}},[d,p]),S=(0,w.useCallback)(async s=>{T(void 0);try{await et(p,s)}catch(u){throw T(`${i.sendFailed}: ${u.message}`),u}},[p]),R=(0,w.useCallback)(()=>Le(p,d),[p,d]),X=(0,w.useCallback)(s=>G(u=>u.length>=3?u:[...u,s]),[]),ke=(0,w.useCallback)(()=>{H(!0),O.current!==void 0&&clearTimeout(O.current),O.current=window.setTimeout(()=>H(!1),2200)},[]),se=(0,w.useCallback)(s=>M(s),[]),$e=(0,w.useCallback)(()=>{M(!1),j(s=>s+1)},[]),fe=(0,w.useCallback)(()=>{C(!0),vt(d,p).then(s=>{s||T(i.notWaiting)},s=>T(`${i.sendFailed}: ${s.message}`)).finally(()=>C(!1))},[d,p]),te=r==="preparing"?i.preparing:e.error!==void 0?i.error:g==="waiting"?i.waiting:g==="answered"?i.answered:g==="dismissed"?i.dismissed:g==="timeout"?i.timeout:void 0,xe=g==="waiting"&&e.result===void 0&&r!=="preparing";if(y!==void 0&&n!=="panel")return(0,c.jsxs)("div",{className:"lantern-row","data-lantern-id":d,"data-lantern-key":b,"data-replaced":"",children:[(0,c.jsx)(ae,{name:"visual"}),(0,c.jsx)("span",{className:"lantern-row-title",children:B}),(0,c.jsx)("span",{className:"lantern-muted",children:i.replaced}),(0,c.jsxs)("button",{type:"button",className:"lantern-link",onClick:()=>On(y,p),children:[i.showNew,(0,c.jsx)(ae,{name:"arrow"})]})]});let ge=xe?(0,c.jsxs)("button",{type:"button",className:"lantern-action",onClick:fe,disabled:L,title:i.skip,children:[(0,c.jsx)(ae,{name:"skip"}),(0,c.jsx)("span",{children:i.skip})]}):null;if(n!=="panel"&&(h==="panel"||f))return(0,c.jsxs)("div",{className:"lantern-row","data-lantern-id":d,"data-lantern-key":b,"data-state":g,children:[(0,c.jsx)(ae,{name:"sidebar"}),(0,c.jsx)("span",{className:"lantern-row-title",children:B}),te&&(0,c.jsx)("span",{className:"lantern-badge","data-state":g,children:te}),(0,c.jsx)("span",{className:"lantern-muted",children:xe?i.answerInSidebar:i.shownInSidebar}),(0,c.jsx)("span",{className:"lantern-spacer"}),ge,r!=="preparing"&&(0,c.jsxs)("button",{type:"button",className:"lantern-action",onClick:R,title:i.openSidebar,children:[(0,c.jsx)(ae,{name:"sidebar"}),(0,c.jsx)("span",{children:i.openSidebar})]}),e.error&&(0,c.jsx)("div",{className:"lantern-note","data-kind":"error",children:e.error})]});let Z=n!=="panel"&&W.collapsed===!0,Y=r!=="preparing"&&!x,a=e.error!==void 0?(0,c.jsx)("div",{className:"lantern-note","data-kind":"error",children:e.error}):f?(0,c.jsx)(jn,{record:e,sessionId:p,state:g,response:J,onSubmit:N,onSend:S,onError:X,onGlLost:se,paused:Y},ee+(Y?":paused":":run")):V?.html!==void 0||o!==void 0?(0,c.jsx)(it,{callId:d,sessionId:p,mode:n==="panel"?"panel":"inline",html:r==="preparing"?o??"":V?.html??"",streaming:r==="preparing",paused:Y,state:g,response:J,onSubmit:N,onSend:S,onExpand:n==="panel"?void 0:R,onError:X,onWheelHint:ke,onGlLost:se},(r==="preparing"?"stream":"full")+ee+(Y?":paused":":run")):(0,c.jsx)("div",{className:"lantern-note",children:i.preparing}),l=(0,c.jsxs)(c.Fragment,{children:[Y&&e.error===void 0&&(V?.html!==void 0||f)&&(0,c.jsxs)("div",{className:"lantern-paused","data-kind":"hold",children:[(0,c.jsx)("span",{children:i.paused}),(0,c.jsx)("button",{type:"button",className:"lantern-action lantern-resume",onClick:m,children:i.run})]}),K&&!F&&!Y&&(0,c.jsx)("div",{className:"lantern-hint",role:"status",children:i.wheelHint}),F&&!Y&&(0,c.jsxs)("div",{className:"lantern-paused",children:[(0,c.jsx)("span",{children:i.glLost}),(0,c.jsx)("button",{type:"button",className:"lantern-action lantern-resume",onClick:$e,children:i.resume})]})]});return n==="panel"?(0,c.jsxs)("div",{className:"lantern-panel","data-lantern-panel":d,"data-state":g,children:[(xe||P||D.length>0)&&(0,c.jsxs)("div",{className:"lantern-panel-bar",children:[te&&(0,c.jsx)("span",{className:"lantern-badge","data-state":g,children:te}),(0,c.jsx)("span",{className:"lantern-spacer"}),ge]}),(0,c.jsx)(qt,{notice:P,errors:D}),(0,c.jsxs)("div",{className:"lantern-panel-body",children:[a,l]})]}):(0,c.jsxs)("div",{className:"lantern-card","data-lantern-id":d,"data-lantern-key":b,"data-state":g,"data-placement":n,children:[(0,c.jsxs)("div",{className:"lantern-head",children:[(0,c.jsx)(ae,{name:"visual"}),(0,c.jsx)("span",{className:"lantern-title",children:B}),te&&(0,c.jsx)("span",{className:"lantern-badge","data-state":g,children:te}),(0,c.jsx)("span",{className:"lantern-spacer"}),ge,r!=="preparing"&&(0,c.jsx)("button",{type:"button",className:"lantern-action icon",onClick:R,title:i.openSidebar,"aria-label":i.openSidebar,children:(0,c.jsx)(ae,{name:"sidebar"})}),(0,c.jsx)("button",{type:"button",className:"lantern-action icon","data-collapsed":Z?"":void 0,onClick:()=>ce(d,{collapsed:!Z},p),title:Z?i.expand:i.collapse,"aria-label":Z?i.expand:i.collapse,"aria-expanded":!Z,children:(0,c.jsx)(ae,{name:"chevron"})})]}),(0,c.jsxs)("div",{className:"lantern-body",hidden:Z,children:[a,l]}),(0,c.jsx)(qt,{notice:P,errors:D})]})}function qt({notice:e,errors:t}){let n=U();return!e&&t.length===0?null:(0,c.jsxs)("div",{className:"lantern-notes",children:[e&&(0,c.jsx)("div",{className:"lantern-note","data-kind":"error",children:e}),t.map((r,o)=>(0,c.jsxs)("div",{className:"lantern-note","data-kind":"warn",children:[n.scriptError,": ",r]},o))]})}function jn(e){let t=U(),n=e.record.result?.path??e.record.args?.path,[r,o]=(0,w.useState)(void 0),[i,d]=(0,w.useState)(void 0);return(0,w.useEffect)(()=>{if(!n||!e.sessionId)return;let p=!0;return d(void 0),wt(e.sessionId,n).then(b=>{p&&o(b)},b=>{p&&d(b.message)}),()=>{p=!1}},[n,e.sessionId]),i?(0,c.jsxs)("div",{className:"lantern-note","data-kind":"error",children:[t.fileError,": ",i]}):r?(0,c.jsx)(it,{callId:e.record.callId,sessionId:e.sessionId,mode:"panel",url:r,paused:e.paused,state:e.state,response:e.response,onSubmit:e.onSubmit,onSend:e.onSend,onError:e.onError,onGlLost:e.onGlLost}):(0,c.jsx)("div",{className:"lantern-note",children:t.loading})}var I=require("react/jsx-runtime"),we="show_visual",ze="lanternVisuals";function lt(e){return Array.isArray(e)?e.map(t=>t&&typeof t=="object"&&t.type==="text"?String(t.text??""):"").join(`
`).trim():""}var Ft={kind:ze,match:e=>e.type==="turn/start"?{id:String(e.data.turn),role:"start"}:e.type==="tool/call"&&e.data.name===we?{id:String(e.data.turn),role:"update"}:e.type==="tool/result"?{id:String(e.data.turn),role:"update"}:null,start:(e,t)=>({turn:Number(t.event.data.turn),calls:[]}),update:(e,t)=>{let n=e.state,r=t.event;if(r.type==="tool/call"){let o=String(r.data.callId);return n.calls.some(i=>i.callId===o)?n:{...n,calls:[...n.calls,{callId:o,seq:r.seq,argsRaw:String(r.data.arguments??""),settled:!1,isError:!1}]}}if(r.type==="tool/result"){let o=String(r.data.message?.source?.callId??r.data.message?.toolCallId??""),i=n.calls.findIndex(x=>x.callId===o);if(i<0)return n;let d=r.data.message?.isError===!0,p={...n.calls[i],settled:!0,isError:d,meta:r.data.meta,...d?{errorText:lt(r.data.message?.content)||String(r.data.error?.code??"error")}:{}},b=n.calls.slice();return b[i]=p,{...n,calls:b}}return n},buildLocationData:(e,t,n)=>t!=="turn"||e.state===void 0||e.state.calls.length===0?null:n?.kind==="turn"&&n.turn===e.state.turn&&n.key===ze&&n.value===e.state.calls?n:{kind:"turn",turn:e.state.turn,key:ze,value:e.state.calls}};function Jt(e,t){return{sessionId:t,seq:e.seq,args:Je(e.argsRaw),result:e.settled&&!e.isError?Be(e.meta):void 0,error:e.isError?e.errorText??"error":void 0}}var Dt=new Set;function zn(e){if(!e?.has||!e.has("title"))return;let t={};for(let n of["title","html","path","display","replace"])e.has(n)&&(t[n]=e.text(n));return e.has("await_response")&&(t.await_response=e.value?.("await_response")===!0),JSON.stringify(t)}function Bt(e){let{phase:t,block:n,callId:r,sessionId:o}=e,i=A(r,o),d=typeof n.time=="number"?n.time:typeof n.callTime=="number"?n.callTime:void 0,p=Ot(i,t,d);(0,$.useEffect)(()=>{p&&Vt()},[p,i]);let b=t==="start"?n.argsRaw:t==="result"?n.call?.argsRaw??void 0:void 0,x=(0,$.useMemo)(()=>b===void 0&&t==="result"?zn(n.args):void 0,[b,t,n.args]),m=(0,$.useMemo)(()=>Je(b??x),[b,x]),y=t==="preparing"?n.args:void 0,W=y?.has("title")?y.text("title"):"",D=y?.has("html")?y.text("html"):void 0,G=y?.has("path")||y?.has("display")&&y.text("display")==="panel",P=t==="result"&&n.isError===!0,T=P?lt(n.content)||String(n.error?.code??"error"):void 0,L=t==="result"&&!P?Be(n.meta):void 0;(0,$.useEffect)(()=>{_e(r,{sessionId:o,...m?{args:m}:{},...L?{result:L}:{},...T?{error:T}:{},...typeof n.seq=="number"?{seq:n.seq}:{}})},[r,o,m,L?.status,L?.response,T]);let C=(0,$.useRef)(t!=="result");(0,$.useEffect)(()=>{t!=="preparing"&&C.current&&m?.display==="panel"&&!T&&!Dt.has(i)&&(Dt.add(i),queueMicrotask(()=>Le(o,r)))},[t,m?.display,T,i,o]);let K=de(()=>gt(r,o)),H=de(()=>le(r,o)),F=U(),M={...H,callId:r,sessionId:o??H?.sessionId,args:m??H?.args??(t==="preparing"?{title:W,display:G?"panel":"inline",await:!1}:void 0),result:L??H?.result,error:T??H?.error};return K?(0,I.jsxs)("div",{className:"lantern-row lantern-row-quiet","data-tool":we,children:[(0,I.jsx)("span",{className:"lantern-row-title",children:M.args?.title||F.visual}),(0,I.jsx)("span",{className:"lantern-muted",children:F.shownBelow})]}):t==="result"&&M.args===void 0&&!M.error?(0,I.jsx)("div",{className:"lantern-row lantern-row-quiet","data-tool":we,children:(0,I.jsx)("span",{className:"lantern-muted",children:lt(n.content)})}):(0,I.jsx)("div",{className:"lantern-tool","data-tool":we,children:(0,I.jsx)(je,{record:M,sessionId:o,placement:"tool",phase:t,partialHtml:D},i)})}function _t(e){let t=e.turn.data.get(ze)??[],n=t.filter(r=>r.seq<e.seq);return(0,$.useEffect)(()=>{for(let r of t)_e(r.callId,Jt(r,e.sessionId))},[t,e.sessionId]),n.length===0?null:(0,I.jsx)("div",{className:"lantern-tail",children:n.map(r=>(0,I.jsx)($n,{item:r,sessionId:e.sessionId},A(r.callId,e.sessionId)))})}function $n({item:e,sessionId:t}){(0,$.useEffect)(()=>ft(e.callId,t),[e.callId,t]);let n={callId:e.callId,...Jt(e,t)};if(e.isError){let r=U();return(0,I.jsxs)("div",{className:"lantern-card","data-lantern-id":e.callId,"data-state":"error",children:[(0,I.jsxs)("div",{className:"lantern-head",children:[(0,I.jsx)("span",{className:"lantern-title",children:n.args?.title||r.error}),(0,I.jsx)("span",{className:"lantern-badge","data-state":"closed",children:r.error})]}),(0,I.jsx)("div",{className:"lantern-note","data-kind":"error",children:e.errorText||r.error})]})}return n.args===void 0?null:(0,I.jsx)(je,{record:n,sessionId:t,placement:"tail",phase:e.settled?"result":"replay"})}function Ut(e){let{tab:t}=e.useTabInfo(),n=Qe(t.navigation.address),r=de(()=>n?le(n.callId,n.sessionId):void 0),o=(0,$.useRef)(null),[i,d]=(0,$.useState)(!1);(0,$.useEffect)(()=>{let x=o.current;if(!x)return;let m=()=>d(x.getClientRects().length>0&&x.offsetWidth>0);m();let y=new ResizeObserver(m);return y.observe(x),()=>y.disconnect()},[]);let p=U(),b;return!n||!r?.args?b=(0,I.jsx)("div",{className:"lantern-empty",children:p.missing}):i&&(b=(0,I.jsx)(je,{record:r,sessionId:n.sessionId,placement:"panel",phase:r.result?"result":"start"},A(n.callId,n.sessionId))),(0,I.jsx)("div",{ref:o,className:"lantern-tab",children:b})}function Wt(e){let t=Qe(e);return(t?le(t.callId,t.sessionId):void 0)?.args?.title||U().visual}var Hn="dsh-lantern",Vn=["slots","uiConversation","sidebarRight","sidebarRightTabs","sessions"];function qn(e){let t=e;ht({sidebarRight:t.sidebarRight,sessions:t.sessions}),t.effect(()=>{let n=document.createElement("style");return n.id="dsh-lantern-style",n.textContent=dt,document.head.appendChild(n),()=>n.remove()},"dsh-lantern: styles"),t.effect(()=>t.uiConversation.events.register(Ft),"dsh-lantern: turn data"),t.slots.inject("tool.call.toolview",()=>t.slots.register({name:"tool.call.toolview",key:we},Bt)),t.slots.inject("conversation.chat.turnTail",()=>t.slots.register({name:"conversation.chat.turnTail",id:"dsh-lantern"},_t)),t.effect(()=>t.sidebarRightTabs.register({id:Xe,kind:Ye,patterns:["dsh-resource://lantern-visual/**"],keepMounted:!0,title:Wt}),"dsh-lantern: sidebar tab type"),t.effect(()=>t.slots.inject("sidebar.right.pane.tab",()=>t.slots.register({name:"sidebar.right.pane.tab",key:Xe},Ut)),"dsh-lantern: sidebar tab body")}

return module.exports;}});
