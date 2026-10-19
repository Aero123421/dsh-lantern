window.__ModuleLoader__.load({id:"dsh-lantern",factory(require){const module={exports:{}};const exports=module.exports;
"use strict";var $e=Object.defineProperty;var Vt=Object.getOwnPropertyDescriptor;var Ft=Object.getOwnPropertyNames;var Jt=Object.prototype.hasOwnProperty;var Dt=(e,t)=>{for(var n in t)$e(e,n,{get:t[n],enumerable:!0})},_t=(e,t,n,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let s of Ft(t))!Jt.call(e,s)&&s!==n&&$e(e,s,{get:()=>t[s],enumerable:!(r=Vt(t,s))||r.enumerable});return e};var Bt=e=>_t($e({},"__esModule",{value:!0}),e);var An={};Dt(An,{apply:()=>Nn,inject:()=>In,name:()=>Tn});module.exports=Bt(An);var lt=`/* Card chrome inside DSH Web. Uses DSH's own tokens so it follows every theme. */
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
  color: var(--dsw-alias-label-primary, inherit); font-weight: 500;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0;
}
.lantern-spacer { flex: 1 1 auto; }
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
`;var Wt={visual:"\u30D3\u30B8\u30E5\u30A2\u30EB",waiting:"\u56DE\u7B54\u5F85\u3061",answered:"\u56DE\u7B54\u6E08\u307F",dismissed:"\u30B9\u30AD\u30C3\u30D7",timeout:"\u6642\u9593\u5207\u308C",closed:"\u7D42\u4E86",error:"\u30A8\u30E9\u30FC",preparing:"\u4F5C\u6210\u4E2D\u2026",skip:"\u30B9\u30AD\u30C3\u30D7",openSidebar:"\u30B5\u30A4\u30C9\u30D0\u30FC\u3067\u958B\u304F",collapse:"\u6298\u308A\u305F\u305F\u3080",expand:"\u5C55\u958B\u3059\u308B",shownBelow:"\u56DE\u7B54\u306E\u4E0B\u306B\u8868\u793A\u3057\u3066\u3044\u307E\u3059",shownInSidebar:"\u30B5\u30A4\u30C9\u30D0\u30FC\u306B\u8868\u793A\u3057\u3066\u3044\u307E\u3059",answerInSidebar:"\u30B5\u30A4\u30C9\u30D0\u30FC\u3067\u56DE\u7B54\u3057\u3066\u304F\u3060\u3055\u3044",replaced:"\u65B0\u3057\u3044\u7248\u306B\u66F4\u65B0\u3057\u307E\u3057\u305F",showNew:"\u65B0\u3057\u3044\u7248\u3078",scriptError:"\u30D3\u30B8\u30E5\u30A2\u30EB\u5185\u306E\u30B9\u30AF\u30EA\u30D7\u30C8\u3067\u30A8\u30E9\u30FC",sendFailed:"\u9001\u4FE1\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F",missing:"\u3053\u306E\u30D3\u30B8\u30E5\u30A2\u30EB\u306E\u5185\u5BB9\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\u3002\u30C1\u30E3\u30C3\u30C8\u304B\u3089\u958B\u304D\u76F4\u3057\u3066\u304F\u3060\u3055\u3044\u3002",loading:"\u8AAD\u307F\u8FBC\u307F\u4E2D\u2026",fileError:"\u30D5\u30A1\u30A4\u30EB\u3092\u958B\u3051\u307E\u305B\u3093\u3067\u3057\u305F",answerPrefix:"\u56DE\u7B54",notWaiting:"\u30A8\u30FC\u30B8\u30A7\u30F3\u30C8\u306F\u3082\u3046\u5F85\u3063\u3066\u3044\u307E\u305B\u3093",wheelHint:"\u30AF\u30EA\u30C3\u30AF\u3059\u308B\u3068\u30DB\u30A4\u30FC\u30EB\u3067\u64CD\u4F5C\u3067\u304D\u307E\u3059",glLost:"3D \u8868\u793A\u3092\u4E00\u6642\u505C\u6B62\u3057\u307E\u3057\u305F\uFF08\u540C\u6642\u306B\u52D5\u304B\u305B\u308B\u6570\u306E\u4E0A\u9650\uFF09",resume:"\u518D\u958B"},Gt={visual:"Visual",waiting:"Waiting for you",answered:"Answered",dismissed:"Skipped",timeout:"Timed out",closed:"Closed",error:"Error",preparing:"Building\u2026",skip:"Skip",openSidebar:"Open in sidebar",collapse:"Collapse",expand:"Expand",shownBelow:"Shown below the answer",shownInSidebar:"Shown in the sidebar",answerInSidebar:"Answer it in the sidebar",replaced:"Updated to a newer version",showNew:"Go to the new version",scriptError:"A script in the visual failed",sendFailed:"Could not send",missing:"This visual is not loaded. Open it again from the chat.",loading:"Loading\u2026",fileError:"Could not open the file",answerPrefix:"Answer",notWaiting:"The agent is no longer waiting",wheelHint:"Click the visual to use the scroll wheel in it",glLost:"The 3D view was paused (too many running at once)",resume:"Resume"},Kt={visual:"\u53EF\u89C6\u5316",waiting:"\u7B49\u5F85\u56DE\u7B54",answered:"\u5DF2\u56DE\u7B54",dismissed:"\u5DF2\u8DF3\u8FC7",timeout:"\u5DF2\u8D85\u65F6",closed:"\u5DF2\u7ED3\u675F",error:"\u9519\u8BEF",preparing:"\u751F\u6210\u4E2D\u2026",skip:"\u8DF3\u8FC7",openSidebar:"\u5728\u4FA7\u8FB9\u680F\u6253\u5F00",collapse:"\u6536\u8D77",expand:"\u5C55\u5F00",shownBelow:"\u663E\u793A\u5728\u56DE\u7B54\u4E0B\u65B9",shownInSidebar:"\u663E\u793A\u5728\u4FA7\u8FB9\u680F",answerInSidebar:"\u8BF7\u5728\u4FA7\u8FB9\u680F\u4E2D\u56DE\u7B54",replaced:"\u5DF2\u66F4\u65B0\u4E3A\u65B0\u7248\u672C",showNew:"\u67E5\u770B\u65B0\u7248\u672C",scriptError:"\u53EF\u89C6\u5316\u4E2D\u7684\u811A\u672C\u51FA\u9519",sendFailed:"\u53D1\u9001\u5931\u8D25",missing:"\u672A\u52A0\u8F7D\u6B64\u53EF\u89C6\u5316\u5185\u5BB9\uFF0C\u8BF7\u4ECE\u5BF9\u8BDD\u4E2D\u91CD\u65B0\u6253\u5F00\u3002",loading:"\u52A0\u8F7D\u4E2D\u2026",fileError:"\u65E0\u6CD5\u6253\u5F00\u6587\u4EF6",answerPrefix:"\u56DE\u7B54",notWaiting:"\u667A\u80FD\u4F53\u5DF2\u4E0D\u518D\u7B49\u5F85",wheelHint:"\u70B9\u51FB\u540E\u5373\u53EF\u5728\u5176\u4E2D\u4F7F\u7528\u6EDA\u8F6E",glLost:"3D \u89C6\u56FE\u5DF2\u6682\u505C\uFF08\u540C\u65F6\u8FD0\u884C\u7684\u6570\u91CF\u5DF2\u8FBE\u4E0A\u9650\uFF09",resume:"\u7EE7\u7EED"};function Xt(){return(typeof document<"u"&&document.documentElement.lang||typeof navigator<"u"&&navigator.language||"en").toLowerCase()}function Se(){let e=Xt();return e.startsWith("ja")?"ja":e.startsWith("zh")?"zh":typeof navigator<"u"&&navigator.languages?.some(t=>t.toLowerCase().startsWith("ja"))?"ja":"en"}function K(){let e=Se();return e==="ja"?Wt:e==="zh"?Kt:Gt}var ct=require("react");function Fe(e){if(!e)return;let t;try{t=JSON.parse(e)}catch{return}if(typeof t!="object"||t===null)return;let n=t,r=typeof n.html=="string"&&n.html!==""?n.html:void 0,s=typeof n.path=="string"&&n.path!==""?n.path:void 0;return{title:typeof n.title=="string"&&n.title.trim()!==""?n.title.trim():"",...r!==void 0?{html:r}:{},...s!==void 0?{path:s}:{},display:s!==void 0||n.display==="panel"?"panel":"inline",await:n.await_response===!0,...typeof n.replace=="string"&&n.replace.trim()!==""?{replace:n.replace.trim()}:{}}}function Je(e){if(typeof e!="object"||e===null)return;let t=e,n=t.status;if(!(n!=="shown"&&n!=="answered"&&n!=="dismissed"&&n!=="timeout"&&n!=="closed"))return{status:n,...typeof t.response=="string"?{response:t.response}:{},...typeof t.path=="string"?{path:t.path}:{}}}var Te=new Map,ge=new Map,Ie=0,qe=new Set;function M(e,t){return JSON.stringify([t??"",e])}function Yt(){Ie++;for(let e of qe)e()}function Qt(e){return qe.add(e),()=>{qe.delete(e)}}function De(e,t){let n=M(e,t.sessionId),r=Te.get(n),s=r===void 0;for(let[c,u]of Object.entries(t)){if(u===void 0)continue;let m=r?.[c];m!==u&&(typeof u=="object"&&JSON.stringify(m)===JSON.stringify(u)||(s=!0))}if(!s)return;let l={...r,callId:e};for(let[c,u]of Object.entries(t))u!==void 0&&(l[c]=u);Te.set(n,l),Ne()}var ze=!1;function Ne(){ze||(ze=!0,queueMicrotask(()=>{ze=!1,Yt()}))}function ie(e,t){return Te.get(M(e,t))}var He;function Zt(){if(He?.version===Ie)return He.map;let e=new Map;for(let t of Te.values()){let n=t.args?.replace;if(n===void 0||n===t.callId||t.error)continue;let r=M(n,t.sessionId),s=e.get(r);(s===void 0||(t.seq??0)>(ie(s,t.sessionId)?.seq??0))&&e.set(r,t.callId)}return He={version:Ie,map:e},e}function ut(e,t){let n=Zt(),r,s=e;for(let l=0;l<20;l++){let c=n.get(M(s,t));if(c===void 0)break;r=c,s=c}return r}function le(e){let t=(0,ct.useSyncExternalStore)(Qt,()=>Ie);return e()}function pt(e,t){let n=M(e,t);return ge.set(n,(ge.get(n)??0)+1),Ne(),()=>{let r=(ge.get(n)??1)-1;r<=0?ge.delete(n):ge.set(n,r),Ne()}}function ft(e,t){return ge.has(M(e,t))}var _e="dsh-lantern:v1:",Ve=300,me=new Map,Ee=new Set;function ne(e,t){let n=M(e,t),r=me.get(n);if(Ee.has(n)&&r!==void 0)return r;try{let s=localStorage.getItem(_e+n),l=s?JSON.parse(s):void 0;return l&&typeof l=="object"&&!Array.isArray(l)?l:{}}catch{return r??{}}}function de(e,t,n){let r=M(e,n),s={...ne(e,n),...t,at:Date.now()};if(me.delete(r),me.set(r,s),me.size>Ve){let c=me.keys().next().value;me.delete(c),Ee.delete(c)}let l=!1;try{localStorage.setItem(_e+r,JSON.stringify(s)),l=!0,en()}catch{}l?Ee.delete(r):Ee.add(r),Ne()}function en(){let e=[];for(let t=0;t<localStorage.length;t++){let n=localStorage.key(t);if(!n?.startsWith(_e))continue;let r=0;try{r=Number(JSON.parse(localStorage.getItem(n)??"{}").at)||0}catch{r=0}e.push([n,r])}if(!(e.length<=Ve)){e.sort((t,n)=>t[1]-n[1]);for(let[t]of e.slice(0,e.length-Ve))localStorage.removeItem(t)}}function dt(e){if(e!==void 0)try{return JSON.parse(e)}catch{return e}}function gt(e,t){let n=ne(e.callId,e.sessionId),r=e.result;return r?.status==="answered"?{state:"answered",response:dt(r.response)}:n.answer!==void 0?{state:"answered",response:dt(n.answer)}:r?.status==="dismissed"?{state:"dismissed",response:void 0}:r?.status==="timeout"?{state:"timeout",response:void 0}:r?.status==="closed"?{state:"closed",response:void 0}:r===void 0&&e.args?.await&&t!=="preparing"?{state:"waiting",response:void 0}:{state:"idle",response:void 0}}var Ge="dsh-lantern/visual",Ke="lanternVisual",Ue="dsh-resource://lantern-visual/",We,mt;function ht(e){We=e.sidebarRight,mt=e.sessions}function tn(e,t){return Ue+encodeURIComponent(e)+"/"+encodeURIComponent(t)}function Xe(e){if(!e||!e.startsWith(Ue))return;let[t,n]=e.slice(Ue.length).split("/");if(!(!t||!n))try{return{sessionId:decodeURIComponent(t),callId:decodeURIComponent(n)}}catch{return}}function Ae(e,t){if(!(!We||!e))try{We.openResource(tn(e,t),{kind:Ke})}catch(n){console.warn("[dsh-lantern] could not open the sidebar",n)}}async function Ye(e,t){let n=await fetch(new URL(`api/${e}`,document.baseURI),{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(t),credentials:"same-origin"}),r;try{r=await n.json()}catch{r=void 0}if(!n.ok||!r?.ok)throw new Error(r?.error?.message??`HTTP ${n.status}`);return r.value}async function Qe(e,t){if(!e)throw new Error("no session");let r=mt?.scope(e)?.get("conversation");if(!r)throw new Error("conversation service unavailable");await r.send(t)}function nn(e,t){let n=`${K().answerPrefix} \u2014 ${e||K().visual}`;return typeof t=="string"?`${n}: ${t}`:t&&typeof t=="object"&&!Array.isArray(t)&&Object.values(t).every(r=>r===null||typeof r!="object")?[n,...Object.entries(t).map(([r,s])=>`${r}: ${typeof s=="string"?s:JSON.stringify(s)}`)].join(`
`):`${n}: ${JSON.stringify(t)}`}var Be=new Set;async function bt(e,t,n){let r=ie(e,t),s=t??r?.sessionId,l=M(e,s);if(Be.has(l)||ne(e,s).answer!==void 0||r?.result?.status==="answered")throw new Error("already answered");Be.add(l);try{if(r?.args?.await&&r.result===void 0){let{status:c}=await Ye("lantern.respond",{sessionId:s,callId:e,response:n});if(c==="settled"){de(e,{answer:JSON.stringify(n)},s);return}}await Qe(s,nn(r?.args?.title??"",n)),de(e,{answer:JSON.stringify(n)},s)}finally{Be.delete(l)}}async function yt(e,t){let{status:n}=await Ye("lantern.dismiss",{sessionId:t,callId:e});return n==="settled"}async function wt(e,t){let{url:n}=await Ye("lantern.file",{sessionId:e,path:t});return new URL(n,document.baseURI).href}var q=require("react");var E=require("react");var k=require("react");var Re=`/*
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
input[type="range"] { width: 100%; accent-color: var(--lt-accent); }
input[type="checkbox"], input[type="radio"] { accent-color: var(--lt-accent); width: 16px; height: 16px; }
label { display: inline-flex; align-items: center; gap: var(--lt-space-2); }

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
`;var Ze="__lantern";function vt(){let e="__lantern",n=document.getElementById("lantern-boot"),r=JSON.parse(n&&n.textContent||"{}"),s=r.state||"idle",l=r.response,c=r.scheme||"light",u=r.widgetState===void 0?null:r.widgetState,m=1,g={};function h(a){a[e]=1,parent.postMessage(a,"*")}function A(a,o){let i=m++;return new Promise((f,x)=>{g[i]={resolve:f,reject:x};let H={type:a,id:i};for(let X of Object.keys(o))H[X]=o[X];h(H)})}function W(a,o){let i;try{i=JSON.stringify(a===void 0?null:a)}catch{i=void 0}if(typeof i!="string")throw new TypeError("lantern."+o+": value is not JSON-serializable");if(i.length>65536)throw new RangeError("lantern."+o+": value is larger than 64 KB");return i}function R(a,o){window.dispatchEvent(new CustomEvent("lantern:"+a,{detail:o}))}function S(){document.documentElement.setAttribute("data-lt-state",s);let a=s==="answered"||s==="dismissed"||s==="closed";document.querySelectorAll('[data-lt-submit], form[data-lt-form] button:not([type="button"]), form[data-lt-form] input[type="submit"]').forEach(o=>{let i=o;a?(i.disabled=!0,i.setAttribute("data-lt-locked","")):i.hasAttribute("data-lt-locked")&&(i.disabled=!1,i.removeAttribute("data-lt-locked"))})}function J(){let a=getComputedStyle(document.documentElement),o=[];for(let i=1;i<=8;i++)o.push(a.getPropertyValue("--lt-series-"+i).trim());return o}let D=!0,O={get id(){return r.id},get state(){return s},get response(){return l},get theme(){return c},get mode(){return r.mode},get visible(){return D},submit(a){try{return A("submit",{json:W(a,"submit")})}catch(o){return Promise.reject(o)}},send(a){return typeof a!="string"||a.trim()===""?Promise.reject(new TypeError("lantern.send: text must be a non-empty string")):A("send",{text:a.slice(0,4e3)})},openLink(a){h({type:"open-link",url:String(a)})},expand(){h({type:"expand"})},getState(){return u},setState(a){u=a,h({type:"set-state",json:W(a,"setState")})},colors:J,on(a,o){let i=f=>o(f.detail);return window.addEventListener("lantern:"+a,i),()=>window.removeEventListener("lantern:"+a,i)}};Object.defineProperty(window,"lantern",{value:Object.freeze(O),configurable:!1,writable:!1,enumerable:!0}),window.addEventListener("message",a=>{if(a.source!==parent)return;let o=a.data;if(!(!o||o[e]!==1)){if(o.type==="reply"){let i=g[o.id];if(!i)return;delete g[o.id],o.ok?i.resolve(!0):i.reject(new Error(o.error||"lantern: request failed"))}else if(o.type==="state")s=o.state,l=o.response,S(),R("state",{state:s,response:l});else if(o.type==="theme"){c=o.scheme,document.documentElement.setAttribute("data-theme",c);let i=document.getElementById("lantern-theme");i&&(i.textContent=o.css),R("theme",{scheme:c})}else if(o.type==="partial"&&r.streaming){let i=document.getElementById("lantern-stream");i&&(i.innerHTML=o.html)}}});let N=document.documentElement,V=r.mode!=="panel"&&!r.streaming,_=Number(r.maxHeight)>0?Number(r.maxHeight):2400;N.setAttribute("data-lt-mode",r.mode==="panel"?"panel":"inline");let B=-1,Q=!1,j=-1,L=-1,I=0,b=!1,P=0,G=!1;function p(){let a=N.getBoundingClientRect();return Math.ceil(Math.max(a.height,document.body?document.body.scrollHeight:0))}function y(){if(Q=!1,document.fullscreenElement)return;let a=p(),o=window.innerHeight;if(V&&!P&&L>0&&o!==L){let f=a>=o-1&&Math.abs(a-j-(o-L))<=1;I=f?I+1:0,f&&(b||I>=3)&&(P=Math.round(Math.min(540,Math.max(320,window.innerWidth*.62)))),b=!1}j=a,L=o;let i=P||a;!P&&!G&&i<=o||(N.toggleAttribute("data-lt-overflow",r.mode!=="panel"&&i>_),!(Math.abs(i-B)<2)&&(B=i,h({type:"resize",height:i})))}function T(){Q||(Q=!0,requestAnimationFrame(y))}function v(){if(!V||P||b||document.fullscreenElement||!document.body)return;let a=window.innerHeight;Math.abs(p()-a)>1||!Array.from(document.body.children).some(i=>Math.abs(i.offsetHeight-a)<=1)||(b=!0,B=a+2,h({type:"resize",height:B}),setTimeout(()=>{b=!1},1e3))}typeof ResizeObserver=="function"&&new ResizeObserver(T).observe(N),window.addEventListener("resize",T),window.addEventListener("load",()=>{T(),setTimeout(v,300),setTimeout(v,1500)}),document.addEventListener("fullscreenchange",()=>{I=0,L=-1,T()});let C=!0;function Y(){let a=C&&document.visibilityState!=="hidden";a!==D&&(D=a,R("visibility",D))}if(typeof IntersectionObserver=="function"&&new IntersectionObserver(a=>{let o=a[a.length-1];o&&(C=o.isIntersecting,Y())}).observe(N),document.addEventListener("visibilitychange",Y),V){let a=EventTarget.prototype.addEventListener,o=new WeakSet;EventTarget.prototype.addEventListener=function(x,H,X){return(x==="wheel"||x==="mousewheel"||x==="DOMMouseScroll")&&o.add(this),a.call(this,x,H,X)};let i=!1,f=0;a.call(window,"pointerdown",()=>{i=!0},!0),a.call(window,"blur",()=>{i=!1}),a.call(document,"mouseout",x=>{x.relatedTarget||(i=!1)},!0),a.call(window,"wheel",x=>{let H=x;if(i||H.ctrlKey||H.metaKey||document.fullscreenElement||!H.composedPath().some(fe=>o.has(fe)||typeof fe.onwheel=="function"))return;H.stopImmediatePropagation();let se=Date.now();se-f>2500&&(f=se,h({type:"hint",kind:"wheel"}))},{capture:!0,passive:!0})}window.addEventListener("webglcontextlost",a=>{a.target.isConnected&&h({type:"gl",lost:!0})},!0),window.addEventListener("webglcontextrestored",()=>h({type:"gl",lost:!1}),!0);function ue(a){if(a===null||a==="")return null;try{return JSON.parse(a)}catch{return a}}function xe(a){let o={};return new FormData(a).forEach((i,f)=>{let x=typeof i=="string"?i:i.name;f in o?o[f]=[].concat(o[f],x):o[f]=x}),a.querySelectorAll('input[type="checkbox"][name]').forEach(i=>{let f=i;!(f.name in o)&&!a.querySelector('input[type="checkbox"][name="'+f.name+'"][value]:not([value="on"])')?o[f.name]=!1:o[f.name]==="on"&&(o[f.name]=!0)}),o}function pe(a){let o=[];return a.querySelectorAll("[data-lt-choice]").forEach(i=>{i.getAttribute("aria-pressed")==="true"&&o.push(ue(i.getAttribute("data-lt-choice")))}),a.hasAttribute("data-lt-multi")?o:o.length?o[0]:null}function Z(a){let o=a.closest("form");if(o)return xe(o);let i=a.parentElement;for(;i&&i!==document.body;){let x=i.querySelector("[data-lt-choices]");if(x)return pe(x);i=i.parentElement}let f=document.querySelector("[data-lt-choices]");return f?pe(f):null}function ee(a,o){let i=a.parentElement&&a.parentElement.querySelector(".lt-error[data-lt-auto]");!i&&a.parentElement&&(i=document.createElement("div"),i.className="lt-error",i.setAttribute("data-lt-auto",""),a.parentElement.appendChild(i)),i&&(i.textContent=o)}function ye(){let a=String(r.lang||navigator.language||"en").toLowerCase();return a.startsWith("ja")?"\u9078\u3093\u3067\u304B\u3089\u9001\u3063\u3066\u304F\u3060\u3055\u3044\u3002":a.startsWith("zh")?"\u8BF7\u5148\u9009\u62E9\u518D\u63D0\u4EA4\u3002":"Pick an option first."}function te(a){return a===null||a===""||Array.isArray(a)&&a.length===0}document.addEventListener("click",a=>{let o=a.target;if(!o||!o.closest)return;let i=o.closest("[data-lt-choice]");if(i){let w=i.closest("[data-lt-choices]"),U=!!w&&w.hasAttribute("data-lt-multi"),F=i.getAttribute("aria-pressed")==="true";if(w&&!U&&w.querySelectorAll("[data-lt-choice]").forEach(ke=>ke.setAttribute("aria-pressed","false")),i.setAttribute("aria-pressed",U?String(!F):"true"),w){R("select",pe(w));let ke=w.parentElement&&w.parentElement.querySelector(".lt-error[data-lt-auto]");ke&&(ke.textContent="")}w&&w.hasAttribute("data-lt-instant")&&!U&&O.submit(pe(w)).catch(()=>{});return}let f=o.closest("[data-lt-submit]");if(f&&!f.disabled){a.preventDefault();let w=f.getAttribute("data-lt-submit"),U=w?ue(w):Z(f);if(!w&&te(U)){ee(f,f.getAttribute("data-lt-empty")||ye());return}ee(f,""),O.submit(U).catch(F=>ee(f,F.message));return}let x=o.closest("[data-lt-send]");if(x){a.preventDefault(),O.send(x.getAttribute("data-lt-send")||"").catch(()=>{});return}if(o.closest("[data-lt-expand]")){a.preventDefault(),O.expand();return}if(o.closest("[data-lt-fullscreen]")){a.preventDefault(),(document.fullscreenElement?document.exitFullscreen():N.requestFullscreen()).catch(()=>{});return}let se=o.closest('[role="tablist"] > [data-tab]');if(se){let w=se.closest("[data-lt-tabs]");if(w){let U=se.getAttribute("data-tab");w.querySelectorAll('[role="tablist"] > [data-tab]').forEach(F=>F.setAttribute("aria-selected",String(F===se))),w.querySelectorAll("[data-tab-panel]").forEach(F=>{F.getAttribute("data-tab-panel")===U?F.removeAttribute("data-lt-hidden"):F.setAttribute("data-lt-hidden","")})}return}let fe=o.closest("[data-lt-next],[data-lt-prev]");if(fe){let w=fe.closest("[data-lt-steps]");w&&we(w,Number(w.getAttribute("data-index")||0)+(fe.hasAttribute("data-lt-next")?1:-1));return}let oe=o.closest("a[href]");if(oe&&!a.defaultPrevented){let w=oe.getAttribute("href")||"";if(oe.hasAttribute("download")&&/^(blob|data):/i.test(oe.href))return;if(w.startsWith("#")){a.preventDefault();let F=document.getElementById(decodeURIComponent(w.slice(1)));F&&F.scrollIntoView({behavior:"smooth"});return}let U=!1;try{U=location.protocol.startsWith("http")&&new URL(oe.href).origin===location.origin}catch{U=!1}if(U)return;a.preventDefault(),/^https?:\/\//i.test(oe.href)&&O.openLink(oe.href)}},!1),document.addEventListener("submit",a=>{let o=a.target;if(!(!o||!o.hasAttribute("data-lt-form"))){if(a.preventDefault(),!o.checkValidity()){o.reportValidity();return}O.submit(xe(o)).catch(i=>ee(o.lastElementChild||o,i.message))}});function we(a,o){let i=a.querySelectorAll("[data-step]");if(i.length===0)return;let f=(o+i.length)%i.length;a.setAttribute("data-index",String(f)),i.forEach((H,X)=>{X===f?H.removeAttribute("data-lt-hidden"):H.setAttribute("data-lt-hidden","")});let x=a.querySelector("[data-lt-dots]");x&&(x.innerHTML=Array.from(i).map((H,X)=>'<i class="'+(X===f?"on":"")+'"></i>').join("")),R("step",f)}function ve(){document.documentElement.setAttribute("data-theme",c),S(),document.querySelectorAll("[data-lt-tabs]").forEach(a=>{let o=a.querySelector('[role="tablist"] > [data-tab][aria-selected="true"]')||a.querySelector('[role="tablist"] > [data-tab]');o&&o.click()}),document.querySelectorAll("[data-lt-steps]").forEach(a=>we(a,0)),s==="answered"&&l!==void 0&&document.querySelectorAll("[data-lt-choices]").forEach(a=>{let o=[].concat(l);a.querySelectorAll("[data-lt-choice]").forEach(i=>{let f=ue(i.getAttribute("data-lt-choice"));o.some(x=>JSON.stringify(x)===JSON.stringify(f))&&i.setAttribute("aria-pressed","true")})}),typeof ResizeObserver=="function"&&document.body&&new ResizeObserver(T).observe(document.body),G=!0,T(),h({type:"ready"})}let $=0;window.addEventListener("error",a=>{/^ResizeObserver loop/.test(String(a.message))||$++<3&&h({type:"error",message:String(a.message||"Script error")})}),window.addEventListener("unhandledrejection",a=>{$++<3&&h({type:"error",message:String(a.reason&&a.reason.message||a.reason||"Unhandled rejection")})}),document.readyState==="loading"?document.addEventListener("DOMContentLoaded",ve):ve()}var an="@layer lantern-kit, lantern-theme;",Vn=Re.slice(0,Math.max(0,Re.indexOf("/* Base */"))),sn="body{padding:var(--lt-pad,16px)}";function on(e){return JSON.stringify(e===void 0?null:e).replace(/</g,"\\u003c").replace(/>/g,"\\u003e").replace(/&/g,"\\u0026").replace(/\u2028/g,"\\u2028").replace(/\u2029/g,"\\u2029")}function kt(e){let t=Object.entries(e).filter(([n,r])=>/^--lt-[a-z0-9-]+$/.test(n)&&r!==""&&!/[;{}<]/.test(r)).map(([n,r])=>`${n}:${r}`).join(";");return t===""?"":`@layer lantern-theme{:root{${t}}}`}var ln=`(${vt.toString()})();`,xt="connect-src data: blob:; form-action 'none'; base-uri 'none'";function dn(e,t){let n=e.streaming?Array.from(crypto.getRandomValues(new Uint8Array(16)),s=>s.toString(16).padStart(2,"0")).join(""):void 0;return`<meta http-equiv="Content-Security-Policy" content="${n?`${xt}; script-src 'nonce-${n}'`:xt}"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><script type="application/json" id="lantern-boot">${on(e)}<\/script><script${n?` nonce="${n}"`:""}>${ln.replace(/<\/script/gi,"<\\/script")}<\/script><style id="lantern-kit">${an}@layer lantern-kit{${Re}${sn}}</style><style id="lantern-theme">${t}</style>`}function cn(e){return e.replace(/<!--[\s\S]*?(-->|$)/g,t=>" ".repeat(t.length)).replace(/(<script\b[^>]*>)([\s\S]*?)(<\/script>|$)/gi,(t,n,r,s)=>n+" ".repeat(r.length)+s)}function Le(e,t){let n=new RegExp(`<${t}(\\s[^>]*)?>`,"i").exec(cn(e));if(!n)return null;let r=[e.slice(n.index,n.index+n[0].length)];return r.index=n.index,r}function un(e,t){let n=Le(e,"head");if(n)return e.slice(0,n.index+n[0].length)+t+e.slice(n.index+n[0].length);let r=Le(e,"html");if(r)return e.slice(0,r.index+r[0].length)+`<head>${t}</head>`+e.slice(r.index+r[0].length);let s=/^\s*<!doctype[^>]*>/i.exec(e);return s?s[0]+t+e.slice(s[0].length):t+e}var St=/^\s*(?:<!--[\s\S]*?-->\s*)*(?:<!doctype[^>]*>|<html[\s>])/i;function Et(e,t,n){let r=dn(t,n),s=t.scheme==="dark"?"dark":"light";return t.streaming?`<!doctype html><html data-theme="${s}"><head>${r}</head><body><div id="lantern-stream"></div></body></html>`:St.test(e)&&(Le(e,"head")||Le(e,"html"))?un(e,r):`<!doctype html><html data-theme="${s}"><head>${r}</head><body>${e}</body></html>`}function et(e){let t=e,n=t.lastIndexOf("<");n>t.lastIndexOf(">")&&(t=t.slice(0,n)),t=t.replace(/<script[\s\S]*?(<\/script>|$)/gi,"").replace(/<\/?(?:iframe|object|embed|frame|frameset|meta|base|link|portal)\b[^>]*>/gi,"").replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi,"").replace(/(href|src|action|formaction|xlink:href)\s*=\s*("\s*javascript:[^"]*"|'\s*javascript:[^']*'|javascript:[^\s>]+)/gi,'$1=""');let r=/<body[^>]*>/i.exec(t);if(r)t=(t.slice(0,r.index).match(/<style[\s\S]*?<\/style>/gi)??[]).join("")+t.slice(r.index+r[0].length);else if(St.test(t))return(t.match(/<style[\s\S]*?<\/style>/gi)??[]).join("");return t}var pn=[["--lt-bg",["--dsw-alias-bg-base"]],["--lt-surface",["--dsw-alias-bg-layer-1"]],["--lt-surface-2",["--dsw-alias-bg-layer-2"]],["--lt-fg",["--dsw-alias-label-primary"]],["--lt-fg-2",["--dsw-alias-label-secondary"]],["--lt-fg-3",["--dsw-alias-label-tertiary"]],["--lt-border",["--dsw-alias-border-l1"]],["--lt-border-strong",["--dsw-alias-border-l2"]],["--lt-accent",["--dsw-alias-brand-primary"]],["--lt-success",["--dsw-alias-state-success-primary"]],["--lt-warning",["--dsw-alias-state-warn-primary"]],["--lt-danger",["--dsw-alias-state-error-primary"]]],fn=[["--lt-accent-soft","--lt-accent",14],["--lt-success-soft","--lt-success",14],["--lt-warning-soft","--lt-warning",16],["--lt-danger-soft","--lt-danger",13]];function tt(e,t){for(let n of t){let r=e.getPropertyValue(n).trim();if(r!=="")return r}return""}var re;function rt(e){return re||(re=document.createElement("span"),re.style.display="none"),re.isConnected||document.body.appendChild(re),re.style.color="",re.style.color=e,getComputedStyle(re).color}function gn(e,t){return e===t||rt(e)===rt(t)}function mn(e){let t=/rgba?\(([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)/.exec(rt(e));if(!t)return 0;let[n,r,s]=[t[1],t[2],t[3]].map(l=>{let c=Number(l)/255;return c<=.03928?c/12.92:((c+.055)/1.055)**2.4});return .2126*n+.7152*r+.0722*s}function Tt(){let e=document.body,t=e?.hasAttribute("data-ds-dark-theme")||!e&&document.documentElement.style.colorScheme==="dark"?"dark":"light";if(!e)return{scheme:t,css:""};let n=getComputedStyle(e),r={};for(let[g,h]of pn){let A=tt(n,h);A!==""&&(r[g]=A)}let s=r["--lt-bg"],l=r["--lt-fg"];if(s!==void 0&&l!==void 0){let g=h=>h===void 0||gn(h,s);g(r["--lt-surface"])&&(r["--lt-surface"]=`color-mix(in srgb, ${l} 4%, ${s})`),(g(r["--lt-surface-2"])||r["--lt-surface-2"]===r["--lt-surface"])&&(r["--lt-surface-2"]=`color-mix(in srgb, ${l} 8%, ${s})`)}for(let[g,h,A]of fn){let W=r[h];W!==void 0&&(r[g]=`color-mix(in srgb, ${W} ${A}%, transparent)`)}let c=r["--lt-accent"];c!==void 0&&(r["--lt-accent-fg"]=mn(c)>.55?"#111111":"#ffffff");let u=tt(n,["--dsh-font-family-text","--dsw-font-family"]);u!==""&&(r["--lt-font-sans"]=`${u}, system-ui, "Hiragino Sans", "Noto Sans JP", "Noto Sans CJK JP", sans-serif`);let m=tt(n,["--dsh-font-family-code","--ds-font-family-code"]);return m!==""&&(r["--lt-font-mono"]=`${m}, ui-monospace, Menlo, Consolas, monospace`),{scheme:t,css:kt(r)}}var ce,Me=new Set,he,Ce,at=!1;function hn(){at=!1;let e=Tt();if(!(ce&&e.scheme===ce.scheme&&e.css===ce.css)){ce=e;for(let t of Me)t(e)}}function nt(){at||(at=!0,requestAnimationFrame(hn))}function Oe(){return ce===void 0&&(ce=Tt()),ce}function It(e){return Me.add(e),he===void 0&&typeof MutationObserver=="function"&&(he=new MutationObserver(nt),document.body&&he.observe(document.body,{attributes:!0,attributeFilter:["data-ds-dark-theme","style","class"]}),he.observe(document.documentElement,{attributes:!0,attributeFilter:["style","data-ds-theme-source","lang","class"]}),Ce=window.matchMedia?.("(prefers-color-scheme: dark)"),Ce?.addEventListener?.("change",nt)),()=>{Me.delete(e),Me.size===0&&(he?.disconnect(),he=void 0,Ce?.removeEventListener?.("change",nt),Ce=void 0)}}var Ct=require("react/jsx-runtime"),bn="allow-scripts allow-forms allow-downloads",Nt=2400,At=64*1024,yn=1500,wn=6,Lt=0,Rt=!1;function vn(){if(Rt)return;Rt=!0;let e=()=>{Lt=performance.now()};window.addEventListener("pointerdown",e,!0),window.addEventListener("keydown",e,!0)}function st(e,t){if(!e||document.activeElement!==e||t===0||Lt>t)return!1;let n=navigator.userActivation;return n?n.isActive:!1}function ot(e){let{callId:t,sessionId:n,mode:r,html:s,url:l,streaming:c=!1,state:u,response:m}=e,g=(0,k.useRef)(null),h=(0,k.useRef)(!1),[A,W]=(0,k.useState)(r==="inline"?120:0),R=(0,k.useRef)(e);R.current=e;let S=(0,k.useRef)(0),J=(0,k.useRef)(0),D=(0,k.useRef)(0),O=(0,k.useRef)(0),N=(0,k.useRef)(0),V=(0,k.useRef)(!1);(0,k.useEffect)(()=>{vn();let b=()=>{document.activeElement===g.current&&(O.current=performance.now())};return window.addEventListener("blur",b),()=>window.removeEventListener("blur",b)},[]);let _=(0,k.useRef)({state:u,response:m}),B=(0,k.useMemo)(()=>{if(s===void 0)return;let b=ne(t,n),P=null;if(b.state!==void 0)try{P=JSON.parse(b.state)}catch{P=null}let G=Oe(),p={id:t,state:_.current.state,response:_.current.response??null,scheme:G.scheme,mode:r,widgetState:P,streaming:c,lang:Se(),...r==="inline"?{maxHeight:R.current.maxHeight??Nt}:{}};return Et(c?"":s,p,G.css)},[c?"":s,c,t,n,r]),Q=(0,k.useMemo)(()=>{if(l===void 0)return;let b=new URL(l);return b.searchParams.set("lt",t),b.searchParams.set("theme",Oe().scheme),b.searchParams.set("lang",Se()),b.href},[l,t]),j=b=>{g.current?.contentWindow?.postMessage({...b,[Ze]:1},"*")};(0,k.useEffect)(()=>{h.current=!1,N.current=0,V.current=!1;let b=P=>{let G=g.current?.contentWindow;if(!G||P.source!==G)return;let p=P.data;if(!p||p[Ze]!==1||typeof p.type!="string"||V.current)return;let y=R.current,T=(v,C,Y)=>{typeof v=="number"&&j({type:"reply",id:v,ok:C,...Y?{error:Y}:{}})};switch(p.type){case"ready":{h.current=!0;let v=Oe();j({type:"theme",css:v.css,scheme:v.scheme}),j({type:"state",state:y.state,response:y.response??null}),y.streaming&&y.html!==void 0&&j({type:"partial",html:et(y.html)});return}case"resize":{if(y.mode!=="inline")return;let v=Number(p.height);Number.isFinite(v)&&W(Math.max(24,Math.min(Math.ceil(v),y.maxHeight??Nt)));return}case"hint":y.mode==="inline"&&!y.streaming&&p.kind==="wheel"&&y.onWheelHint?.();return;case"gl":y.streaming||y.onGlLost?.(p.lost===!0);return;case"submit":case"send":{if(y.streaming){T(p.id,!1,"The visual is still being written.");return}if(!st(g.current,O.current)){T(p.id,!1,"Only a user action inside the visual can do this.");return}let v=Date.now();if(v-S.current<400){T(p.id,!1,"Too fast.");return}if(p.type==="send"){if(v-J.current<yn||D.current>=wn){T(p.id,!1,"Too many messages from this visual.");return}J.current=v,D.current++}if(S.current=v,p.type==="submit"){if(typeof p.json!="string"||p.json.length>At){T(p.id,!1,"The answer is too large.");return}if(y.state==="answered"||y.state==="dismissed"||y.state==="closed"){T(p.id,!1,"This visual is already settled.");return}let C;try{C=JSON.parse(p.json)}catch{T(p.id,!1,"The answer is not JSON.");return}y.onSubmit(C).then(()=>T(p.id,!0),Y=>T(p.id,!1,Y.message))}else{if(typeof p.text!="string"||p.text.trim()===""){T(p.id,!1,"Empty message.");return}y.onSend(p.text.slice(0,4e3)).then(()=>T(p.id,!0),C=>T(p.id,!1,C.message))}return}case"expand":{if(y.streaming||!st(g.current,O.current))return;let v=Date.now();if(v-S.current<1e3)return;S.current=v,y.onExpand?.();return}case"open-link":{if(y.streaming||!st(g.current,O.current)||typeof p.url!="string")return;let v=Date.now();if(v-S.current<1e3)return;S.current=v;let C;try{C=new URL(p.url)}catch{return}if(C.protocol!=="http:"&&C.protocol!=="https:")return;window.open(C.href,"_blank","noopener,noreferrer");return}case"set-state":!y.streaming&&typeof p.json=="string"&&p.json.length<=At&&de(y.callId,{state:p.json},y.sessionId);return;case"error":typeof p.message=="string"&&y.onError?.(p.message.slice(0,300));return}};return window.addEventListener("message",b),()=>window.removeEventListener("message",b)},[B,Q]),(0,k.useEffect)(()=>{h.current&&j({type:"state",state:u,response:m??null})},[u,JSON.stringify(m??null)]),(0,k.useEffect)(()=>It(b=>{h.current&&j({type:"theme",css:b.css,scheme:b.scheme})}),[]);let L=(0,k.useRef)(void 0);(0,k.useEffect)(()=>{!c||s===void 0||L.current===void 0&&(L.current=window.setTimeout(()=>{L.current=void 0;let b=R.current;h.current&&b.html!==void 0&&j({type:"partial",html:et(b.html)})},120))},[c,s]),(0,k.useEffect)(()=>()=>{L.current!==void 0&&clearTimeout(L.current)},[]);let I=r==="inline"?{height:`${A}px`}:void 0;return(0,Ct.jsx)("iframe",{ref:g,className:"lantern-frame","data-mode":r,title:t,sandbox:bn,onLoad:()=>{N.current++,B!==void 0&&N.current>1&&(V.current=!0)},allow:"fullscreen; clipboard-write",referrerPolicy:"no-referrer",style:I,...B!==void 0?{srcDoc:B}:{src:Q}})}var d=require("react/jsx-runtime");function ae({name:e}){return(0,d.jsx)("svg",{className:"lantern-icon",viewBox:"0 0 16 16",width:"14",height:"14",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:{visual:(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)("rect",{x:"2.5",y:"3",width:"11",height:"10",rx:"2"}),(0,d.jsx)("path",{d:"M5 10l2-2.5 1.6 1.8L10.5 7 12 10"})]}),sidebar:(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)("rect",{x:"2.5",y:"3",width:"11",height:"10",rx:"2"}),(0,d.jsx)("path",{d:"M9.5 3v10"})]}),chevron:(0,d.jsx)("path",{d:"M4.5 6.5L8 10l3.5-3.5"}),skip:(0,d.jsx)("path",{d:"M4.5 4.5l7 7M11.5 4.5l-7 7"}),arrow:(0,d.jsx)("path",{d:"M4 8h8M8.5 4.5L12 8l-3.5 3.5"})}[e]})}function xn(e,t){document.querySelector(`[data-lantern-key="${CSS.escape(M(e,t))}"]`)?.scrollIntoView({behavior:"smooth",block:"center"})}function je({record:e,sessionId:t,placement:n,phase:r,partialHtml:s}){let l=K(),c=e.callId,u=t??e.sessionId,m=M(c,u),g=le(()=>ut(c,u)),h=le(()=>ne(c,u)),[A,W]=(0,E.useState)([]),[R,S]=(0,E.useState)(void 0),[J,D]=(0,E.useState)(!1),[O,N]=(0,E.useState)(!1),[V,_]=(0,E.useState)(!1),[B,Q]=(0,E.useState)(0),j=(0,E.useRef)(void 0);(0,E.useEffect)(()=>()=>{j.current!==void 0&&clearTimeout(j.current)},[]);let L=e.args,{state:I,response:b}=e.error!==void 0?{state:"closed",response:void 0}:gt(e,r),P=L?.title||l.visual,G=(e.result?.path??L?.path)!==void 0,p=L?.display??"inline",y=(0,E.useCallback)(async $=>{S(void 0);try{await bt(c,u,$)}catch(a){throw S(`${l.sendFailed}: ${a.message}`),a}},[c,u]),T=(0,E.useCallback)(async $=>{S(void 0);try{await Qe(u,$)}catch(a){throw S(`${l.sendFailed}: ${a.message}`),a}},[u]),v=(0,E.useCallback)(()=>Ae(u,c),[u,c]),C=(0,E.useCallback)($=>W(a=>a.length>=3?a:[...a,$]),[]),Y=(0,E.useCallback)(()=>{N(!0),j.current!==void 0&&clearTimeout(j.current),j.current=window.setTimeout(()=>N(!1),2200)},[]),ue=(0,E.useCallback)($=>_($),[]),xe=(0,E.useCallback)(()=>{_(!1),Q($=>$+1)},[]),pe=(0,E.useCallback)(()=>{D(!0),yt(c,u).then($=>{$||S(l.notWaiting)},$=>S(`${l.sendFailed}: ${$.message}`)).finally(()=>D(!1))},[c,u]),Z=r==="preparing"?l.preparing:e.error!==void 0?l.error:I==="waiting"?l.waiting:I==="answered"?l.answered:I==="dismissed"?l.dismissed:I==="timeout"?l.timeout:void 0,ee=I==="waiting"&&e.result===void 0&&r!=="preparing";if(g!==void 0&&n!=="panel")return(0,d.jsxs)("div",{className:"lantern-row","data-lantern-id":c,"data-lantern-key":m,"data-replaced":"",children:[(0,d.jsx)(ae,{name:"visual"}),(0,d.jsx)("span",{className:"lantern-row-title",children:P}),(0,d.jsx)("span",{className:"lantern-muted",children:l.replaced}),(0,d.jsxs)("button",{type:"button",className:"lantern-link",onClick:()=>xn(g,u),children:[l.showNew,(0,d.jsx)(ae,{name:"arrow"})]})]});let ye=ee?(0,d.jsxs)("button",{type:"button",className:"lantern-action",onClick:pe,disabled:J,title:l.skip,children:[(0,d.jsx)(ae,{name:"skip"}),(0,d.jsx)("span",{children:l.skip})]}):null;if(n!=="panel"&&(p==="panel"||G))return(0,d.jsxs)("div",{className:"lantern-row","data-lantern-id":c,"data-lantern-key":m,"data-state":I,children:[(0,d.jsx)(ae,{name:"sidebar"}),(0,d.jsx)("span",{className:"lantern-row-title",children:P}),Z&&(0,d.jsx)("span",{className:"lantern-badge","data-state":I,children:Z}),(0,d.jsx)("span",{className:"lantern-muted",children:ee?l.answerInSidebar:l.shownInSidebar}),(0,d.jsx)("span",{className:"lantern-spacer"}),ye,r!=="preparing"&&(0,d.jsxs)("button",{type:"button",className:"lantern-action",onClick:v,title:l.openSidebar,children:[(0,d.jsx)(ae,{name:"sidebar"}),(0,d.jsx)("span",{children:l.openSidebar})]}),e.error&&(0,d.jsx)("div",{className:"lantern-note","data-kind":"error",children:e.error})]});let te=n!=="panel"&&h.collapsed===!0,we=e.error!==void 0?(0,d.jsx)("div",{className:"lantern-note","data-kind":"error",children:e.error}):G?(0,d.jsx)(kn,{record:e,sessionId:u,state:I,response:b,onSubmit:y,onSend:T,onError:C,onGlLost:ue},B):L?.html!==void 0||s!==void 0?(0,d.jsx)(ot,{callId:c,sessionId:u,mode:n==="panel"?"panel":"inline",html:r==="preparing"?s??"":L?.html??"",streaming:r==="preparing",state:I,response:b,onSubmit:y,onSend:T,onExpand:n==="panel"?void 0:v,onError:C,onWheelHint:Y,onGlLost:ue},(r==="preparing"?"stream":"full")+B):(0,d.jsx)("div",{className:"lantern-note",children:l.preparing}),ve=(0,d.jsxs)(d.Fragment,{children:[O&&!V&&(0,d.jsx)("div",{className:"lantern-hint",role:"status",children:l.wheelHint}),V&&(0,d.jsxs)("div",{className:"lantern-paused",children:[(0,d.jsx)("span",{children:l.glLost}),(0,d.jsx)("button",{type:"button",className:"lantern-action lantern-resume",onClick:xe,children:l.resume})]})]});return n==="panel"?(0,d.jsxs)("div",{className:"lantern-panel","data-lantern-panel":c,"data-state":I,children:[(ee||R||A.length>0)&&(0,d.jsxs)("div",{className:"lantern-panel-bar",children:[Z&&(0,d.jsx)("span",{className:"lantern-badge","data-state":I,children:Z}),(0,d.jsx)("span",{className:"lantern-spacer"}),ye]}),(0,d.jsx)(Mt,{notice:R,errors:A}),(0,d.jsxs)("div",{className:"lantern-panel-body",children:[we,ve]})]}):(0,d.jsxs)("div",{className:"lantern-card","data-lantern-id":c,"data-lantern-key":m,"data-state":I,"data-placement":n,children:[(0,d.jsxs)("div",{className:"lantern-head",children:[(0,d.jsx)(ae,{name:"visual"}),(0,d.jsx)("span",{className:"lantern-title",children:P}),Z&&(0,d.jsx)("span",{className:"lantern-badge","data-state":I,children:Z}),(0,d.jsx)("span",{className:"lantern-spacer"}),ye,r!=="preparing"&&(0,d.jsx)("button",{type:"button",className:"lantern-action icon",onClick:v,title:l.openSidebar,"aria-label":l.openSidebar,children:(0,d.jsx)(ae,{name:"sidebar"})}),(0,d.jsx)("button",{type:"button",className:"lantern-action icon","data-collapsed":te?"":void 0,onClick:()=>de(c,{collapsed:!te},u),title:te?l.expand:l.collapse,"aria-label":te?l.expand:l.collapse,"aria-expanded":!te,children:(0,d.jsx)(ae,{name:"chevron"})})]}),(0,d.jsxs)("div",{className:"lantern-body",hidden:te,children:[we,ve]}),(0,d.jsx)(Mt,{notice:R,errors:A})]})}function Mt({notice:e,errors:t}){let n=K();return!e&&t.length===0?null:(0,d.jsxs)("div",{className:"lantern-notes",children:[e&&(0,d.jsx)("div",{className:"lantern-note","data-kind":"error",children:e}),t.map((r,s)=>(0,d.jsxs)("div",{className:"lantern-note","data-kind":"warn",children:[n.scriptError,": ",r]},s))]})}function kn(e){let t=K(),n=e.record.result?.path??e.record.args?.path,[r,s]=(0,E.useState)(void 0),[l,c]=(0,E.useState)(void 0);return(0,E.useEffect)(()=>{if(!n||!e.sessionId)return;let u=!0;return c(void 0),wt(e.sessionId,n).then(m=>{u&&s(m)},m=>{u&&c(m.message)}),()=>{u=!1}},[n,e.sessionId]),l?(0,d.jsxs)("div",{className:"lantern-note","data-kind":"error",children:[t.fileError,": ",l]}):r?(0,d.jsx)(ot,{callId:e.record.callId,sessionId:e.sessionId,mode:"panel",url:r,state:e.state,response:e.response,onSubmit:e.onSubmit,onSend:e.onSend,onError:e.onError,onGlLost:e.onGlLost}):(0,d.jsx)("div",{className:"lantern-note",children:t.loading})}var z=require("react/jsx-runtime"),be="show_visual",Pe="lanternVisuals";function it(e){return Array.isArray(e)?e.map(t=>t&&typeof t=="object"&&t.type==="text"?String(t.text??""):"").join(`
`).trim():""}var jt={kind:Pe,match:e=>e.type==="turn/start"?{id:String(e.data.turn),role:"start"}:e.type==="tool/call"&&e.data.name===be?{id:String(e.data.turn),role:"update"}:e.type==="tool/result"?{id:String(e.data.turn),role:"update"}:null,start:(e,t)=>({turn:Number(t.event.data.turn),calls:[]}),update:(e,t)=>{let n=e.state,r=t.event;if(r.type==="tool/call"){let s=String(r.data.callId);return n.calls.some(l=>l.callId===s)?n:{...n,calls:[...n.calls,{callId:s,seq:r.seq,argsRaw:String(r.data.arguments??""),settled:!1,isError:!1}]}}if(r.type==="tool/result"){let s=String(r.data.message?.source?.callId??r.data.message?.toolCallId??""),l=n.calls.findIndex(g=>g.callId===s);if(l<0)return n;let c=r.data.message?.isError===!0,u={...n.calls[l],settled:!0,isError:c,meta:r.data.meta,...c?{errorText:it(r.data.message?.content)||String(r.data.error?.code??"error")}:{}},m=n.calls.slice();return m[l]=u,{...n,calls:m}}return n},buildLocationData:(e,t,n)=>t!=="turn"||e.state===void 0||e.state.calls.length===0?null:n?.kind==="turn"&&n.turn===e.state.turn&&n.key===Pe&&n.value===e.state.calls?n:{kind:"turn",turn:e.state.turn,key:Pe,value:e.state.calls}};function Pt(e,t){return{sessionId:t,seq:e.seq,args:Fe(e.argsRaw),result:e.settled&&!e.isError?Je(e.meta):void 0,error:e.isError?e.errorText??"error":void 0}}var Ot=new Set;function Sn(e){if(!e?.has||!e.has("title"))return;let t={};for(let n of["title","html","path","display","replace"])e.has(n)&&(t[n]=e.text(n));return e.has("await_response")&&(t.await_response=e.value?.("await_response")===!0),JSON.stringify(t)}function $t(e){let{phase:t,block:n,callId:r,sessionId:s}=e,l=M(r,s),c=t==="start"?n.argsRaw:t==="result"?n.call?.argsRaw??void 0:void 0,u=(0,q.useMemo)(()=>c===void 0&&t==="result"?Sn(n.args):void 0,[c,t,n.args]),m=(0,q.useMemo)(()=>Fe(c??u),[c,u]),g=t==="preparing"?n.args:void 0,h=g?.has("title")?g.text("title"):"",A=g?.has("html")?g.text("html"):void 0,W=g?.has("path")||g?.has("display")&&g.text("display")==="panel",R=t==="result"&&n.isError===!0,S=R?it(n.content)||String(n.error?.code??"error"):void 0,J=t==="result"&&!R?Je(n.meta):void 0;(0,q.useEffect)(()=>{De(r,{sessionId:s,...m?{args:m}:{},...J?{result:J}:{},...S?{error:S}:{},...typeof n.seq=="number"?{seq:n.seq}:{}})},[r,s,m,J?.status,J?.response,S]);let D=(0,q.useRef)(t!=="result");(0,q.useEffect)(()=>{t!=="preparing"&&D.current&&m?.display==="panel"&&!S&&!Ot.has(l)&&(Ot.add(l),queueMicrotask(()=>Ae(s,r)))},[t,m?.display,S,l,s]);let O=le(()=>ft(r,s)),N=le(()=>ie(r,s)),V=K(),_={...N,callId:r,sessionId:s??N?.sessionId,args:m??N?.args??(t==="preparing"?{title:h,display:W?"panel":"inline",await:!1}:void 0),result:J??N?.result,error:S??N?.error};return O?(0,z.jsxs)("div",{className:"lantern-row lantern-row-quiet","data-tool":be,children:[(0,z.jsx)("span",{className:"lantern-row-title",children:_.args?.title||V.visual}),(0,z.jsx)("span",{className:"lantern-muted",children:V.shownBelow})]}):t==="result"&&_.args===void 0&&!_.error?(0,z.jsx)("div",{className:"lantern-row lantern-row-quiet","data-tool":be,children:(0,z.jsx)("span",{className:"lantern-muted",children:it(n.content)})}):(0,z.jsx)("div",{className:"lantern-tool","data-tool":be,children:(0,z.jsx)(je,{record:_,sessionId:s,placement:"tool",phase:t,partialHtml:A},l)})}function zt(e){let t=e.turn.data.get(Pe)??[],n=t.filter(r=>r.seq<e.seq&&!r.isError);return(0,q.useEffect)(()=>{for(let r of t)De(r.callId,Pt(r,e.sessionId))},[t,e.sessionId]),n.length===0?null:(0,z.jsx)("div",{className:"lantern-tail",children:n.map(r=>(0,z.jsx)(En,{item:r,sessionId:e.sessionId},M(r.callId,e.sessionId)))})}function En({item:e,sessionId:t}){(0,q.useEffect)(()=>pt(e.callId,t),[e.callId,t]);let n={callId:e.callId,...Pt(e,t)};return n.args===void 0?null:(0,z.jsx)(je,{record:n,sessionId:t,placement:"tail",phase:e.settled?"result":"replay"})}function Ht(e){let{tab:t}=e.useTabInfo(),n=Xe(t.navigation.address),r=le(()=>n?ie(n.callId,n.sessionId):void 0),s=(0,q.useRef)(null),[l,c]=(0,q.useState)(!1);(0,q.useEffect)(()=>{let g=s.current;if(!g)return;let h=()=>c(g.getClientRects().length>0&&g.offsetWidth>0);h();let A=new ResizeObserver(h);return A.observe(g),()=>A.disconnect()},[]);let u=K(),m;return!n||!r?.args?m=(0,z.jsx)("div",{className:"lantern-empty",children:u.missing}):l&&(m=(0,z.jsx)(je,{record:r,sessionId:n.sessionId,placement:"panel",phase:r.result?"result":"start"},M(n.callId,n.sessionId))),(0,z.jsx)("div",{ref:s,className:"lantern-tab",children:m})}function qt(e){let t=Xe(e);return(t?ie(t.callId,t.sessionId):void 0)?.args?.title||K().visual}var Tn="dsh-lantern",In=["slots","uiConversation","sidebarRight","sidebarRightTabs","sessions"];function Nn(e){let t=e;ht({sidebarRight:t.sidebarRight,sessions:t.sessions}),t.effect(()=>{let n=document.createElement("style");return n.id="dsh-lantern-style",n.textContent=lt,document.head.appendChild(n),()=>n.remove()},"dsh-lantern: styles"),t.effect(()=>t.uiConversation.events.register(jt),"dsh-lantern: turn data"),t.slots.inject("tool.call.toolview",()=>t.slots.register({name:"tool.call.toolview",key:be},$t)),t.slots.inject("conversation.chat.turnTail",()=>t.slots.register({name:"conversation.chat.turnTail",id:"dsh-lantern"},zt)),t.effect(()=>t.sidebarRightTabs.register({id:Ge,kind:Ke,patterns:["dsh-resource://lantern-visual/**"],keepMounted:!0,title:qt}),"dsh-lantern: sidebar tab type"),t.effect(()=>t.slots.inject("sidebar.right.pane.tab",()=>t.slots.register({name:"sidebar.right.pane.tab",key:Ge},Ht)),"dsh-lantern: sidebar tab body")}

return module.exports;}});
