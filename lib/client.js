window.__ModuleLoader__.load({id:"dsh-lantern",factory(require){const module={exports:{}};const exports=module.exports;
"use strict";var ve=Object.defineProperty;var vt=Object.getOwnPropertyDescriptor;var wt=Object.getOwnPropertyNames;var xt=Object.prototype.hasOwnProperty;var kt=(e,t)=>{for(var n in t)ve(e,n,{get:t[n],enumerable:!0})},St=(e,t,n,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of wt(t))!xt.call(e,i)&&i!==n&&ve(e,i,{get:()=>t[i],enumerable:!(r=vt(t,i))||r.enumerable});return e};var Et=e=>St(ve({},"__esModule",{value:!0}),e);var on={};kt(on,{apply:()=>sn,inject:()=>an,name:()=>rn});module.exports=Et(on);var Be=`/* Card chrome inside DSH Web. Uses DSH's own tokens so it follows every theme. */
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
.lantern-body { display: block; }
.lantern-body[hidden] { display: none; }
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
.lantern-panel-body { flex: 1 1 auto; min-height: 0; display: flex; }
.lantern-panel-body > .lantern-frame { flex: 1 1 auto; height: 100%; }
.lantern-empty { padding: 24px; color: var(--dsw-alias-label-secondary, inherit); font-size: 13px; }
.lantern-tab { height: 100%; min-height: 0; display: flex; flex-direction: column; }
.lantern-tab > .lantern-panel { flex: 1 1 auto; }
`;var Tt={visual:"\u30D3\u30B8\u30E5\u30A2\u30EB",waiting:"\u56DE\u7B54\u5F85\u3061",answered:"\u56DE\u7B54\u6E08\u307F",dismissed:"\u30B9\u30AD\u30C3\u30D7",timeout:"\u6642\u9593\u5207\u308C",closed:"\u7D42\u4E86",error:"\u30A8\u30E9\u30FC",preparing:"\u4F5C\u6210\u4E2D\u2026",skip:"\u30B9\u30AD\u30C3\u30D7",openSidebar:"\u30B5\u30A4\u30C9\u30D0\u30FC\u3067\u958B\u304F",collapse:"\u6298\u308A\u305F\u305F\u3080",expand:"\u5C55\u958B\u3059\u308B",shownBelow:"\u56DE\u7B54\u306E\u4E0B\u306B\u8868\u793A\u3057\u3066\u3044\u307E\u3059",shownInSidebar:"\u30B5\u30A4\u30C9\u30D0\u30FC\u306B\u8868\u793A\u3057\u3066\u3044\u307E\u3059",answerInSidebar:"\u30B5\u30A4\u30C9\u30D0\u30FC\u3067\u56DE\u7B54\u3057\u3066\u304F\u3060\u3055\u3044",replaced:"\u65B0\u3057\u3044\u7248\u306B\u66F4\u65B0\u3057\u307E\u3057\u305F",showNew:"\u65B0\u3057\u3044\u7248\u3078",scriptError:"\u30D3\u30B8\u30E5\u30A2\u30EB\u5185\u306E\u30B9\u30AF\u30EA\u30D7\u30C8\u3067\u30A8\u30E9\u30FC",sendFailed:"\u9001\u4FE1\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F",missing:"\u3053\u306E\u30D3\u30B8\u30E5\u30A2\u30EB\u306E\u5185\u5BB9\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\u3002\u30C1\u30E3\u30C3\u30C8\u304B\u3089\u958B\u304D\u76F4\u3057\u3066\u304F\u3060\u3055\u3044\u3002",loading:"\u8AAD\u307F\u8FBC\u307F\u4E2D\u2026",fileError:"\u30D5\u30A1\u30A4\u30EB\u3092\u958B\u3051\u307E\u305B\u3093\u3067\u3057\u305F",answerPrefix:"\u56DE\u7B54",notWaiting:"\u30A8\u30FC\u30B8\u30A7\u30F3\u30C8\u306F\u3082\u3046\u5F85\u3063\u3066\u3044\u307E\u305B\u3093"},Rt={visual:"Visual",waiting:"Waiting for you",answered:"Answered",dismissed:"Skipped",timeout:"Timed out",closed:"Closed",error:"Error",preparing:"Building\u2026",skip:"Skip",openSidebar:"Open in sidebar",collapse:"Collapse",expand:"Expand",shownBelow:"Shown below the answer",shownInSidebar:"Shown in the sidebar",answerInSidebar:"Answer it in the sidebar",replaced:"Updated to a newer version",showNew:"Go to the new version",scriptError:"A script in the visual failed",sendFailed:"Could not send",missing:"This visual is not loaded. Open it again from the chat.",loading:"Loading\u2026",fileError:"Could not open the file",answerPrefix:"Answer",notWaiting:"The agent is no longer waiting"},At={visual:"\u53EF\u89C6\u5316",waiting:"\u7B49\u5F85\u56DE\u7B54",answered:"\u5DF2\u56DE\u7B54",dismissed:"\u5DF2\u8DF3\u8FC7",timeout:"\u5DF2\u8D85\u65F6",closed:"\u5DF2\u7ED3\u675F",error:"\u9519\u8BEF",preparing:"\u751F\u6210\u4E2D\u2026",skip:"\u8DF3\u8FC7",openSidebar:"\u5728\u4FA7\u8FB9\u680F\u6253\u5F00",collapse:"\u6536\u8D77",expand:"\u5C55\u5F00",shownBelow:"\u663E\u793A\u5728\u56DE\u7B54\u4E0B\u65B9",shownInSidebar:"\u663E\u793A\u5728\u4FA7\u8FB9\u680F",answerInSidebar:"\u8BF7\u5728\u4FA7\u8FB9\u680F\u4E2D\u56DE\u7B54",replaced:"\u5DF2\u66F4\u65B0\u4E3A\u65B0\u7248\u672C",showNew:"\u67E5\u770B\u65B0\u7248\u672C",scriptError:"\u53EF\u89C6\u5316\u4E2D\u7684\u811A\u672C\u51FA\u9519",sendFailed:"\u53D1\u9001\u5931\u8D25",missing:"\u672A\u52A0\u8F7D\u6B64\u53EF\u89C6\u5316\u5185\u5BB9\uFF0C\u8BF7\u4ECE\u5BF9\u8BDD\u4E2D\u91CD\u65B0\u6253\u5F00\u3002",loading:"\u52A0\u8F7D\u4E2D\u2026",fileError:"\u65E0\u6CD5\u6253\u5F00\u6587\u4EF6",answerPrefix:"\u56DE\u7B54",notWaiting:"\u667A\u80FD\u4F53\u5DF2\u4E0D\u518D\u7B49\u5F85"};function It(){return(typeof document<"u"&&document.documentElement.lang||typeof navigator<"u"&&navigator.language||"en").toLowerCase()}function ie(){let e=It();return e.startsWith("ja")?"ja":e.startsWith("zh")?"zh":typeof navigator<"u"&&navigator.languages?.some(t=>t.toLowerCase().startsWith("ja"))?"ja":"en"}function B(){let e=ie();return e==="ja"?Tt:e==="zh"?At:Rt}var He=require("react");function Se(e){if(!e)return;let t;try{t=JSON.parse(e)}catch{return}if(typeof t!="object"||t===null)return;let n=t,r=typeof n.html=="string"&&n.html!==""?n.html:void 0,i=typeof n.path=="string"&&n.path!==""?n.path:void 0;return{title:typeof n.title=="string"&&n.title.trim()!==""?n.title.trim():"",...r!==void 0?{html:r}:{},...i!==void 0?{path:i}:{},display:i!==void 0||n.display==="panel"?"panel":"inline",await:n.await_response===!0,...typeof n.replace=="string"&&n.replace.trim()!==""?{replace:n.replace.trim()}:{}}}function Ee(e){if(typeof e!="object"||e===null)return;let t=e,n=t.status;if(!(n!=="shown"&&n!=="answered"&&n!=="dismissed"&&n!=="timeout"&&n!=="closed"))return{status:n,...typeof t.response=="string"?{response:t.response}:{},...typeof t.path=="string"?{path:t.path}:{}}}var ae=new Map,ee=new Map,le=0,ke=new Set;function Ct(){le++;for(let e of ke)e()}function Lt(e){return ke.add(e),()=>{ke.delete(e)}}function se(e,t){let n=ae.get(e),r=n===void 0;for(let[l,c]of Object.entries(t)){if(c===void 0)continue;let g=n?.[l];g!==c&&(typeof c=="object"&&JSON.stringify(g)===JSON.stringify(c)||(r=!0))}if(!r)return;let i={...n,callId:e};for(let[l,c]of Object.entries(t))c!==void 0&&(i[l]=c);ae.set(e,i),de()}var we=!1;function de(){we||(we=!0,queueMicrotask(()=>{we=!1,Ct()}))}function X(e){return ae.get(e)}var xe;function Mt(){if(xe?.version===le)return xe.map;let e=new Map;for(let t of ae.values()){let n=t.args?.replace;if(n===void 0||n===t.callId||t.error)continue;let r=e.get(n);(r===void 0||(t.seq??0)>(ae.get(r)?.seq??0))&&e.set(n,t.callId)}return xe={version:le,map:e},e}function Ue(e){let t=Mt(),n,r=e;for(let i=0;i<20;i++){let l=t.get(r);if(l===void 0)break;n=l,r=l}return n}function Y(e){let t=(0,He.useSyncExternalStore)(Lt,()=>le);return e()}function We(e){return ee.set(e,(ee.get(e)??0)+1),de(),()=>{let t=(ee.get(e)??1)-1;t<=0?ee.delete(e):ee.set(e,t),de()}}function Ke(e){return ee.has(e)}var Ne="dsh-lantern:v1:",De=300;function H(e){try{let t=localStorage.getItem(Ne+e);return t?JSON.parse(t):{}}catch{return{}}}function Q(e,t){try{let n={...H(e),...t,at:Date.now()};localStorage.setItem(Ne+e,JSON.stringify(n)),Ot()}catch{}de()}function Ot(){let e=[];for(let t=0;t<localStorage.length;t++){let n=localStorage.key(t);if(!n?.startsWith(Ne))continue;let r=0;try{r=Number(JSON.parse(localStorage.getItem(n)??"{}").at)||0}catch{r=0}e.push([n,r])}if(!(e.length<=De)){e.sort((t,n)=>t[1]-n[1]);for(let[t]of e.slice(0,e.length-De))localStorage.removeItem(t)}}function _e(e){if(e!==void 0)try{return JSON.parse(e)}catch{return e}}function Ge(e,t){let n=H(e.callId),r=e.result;return r?.status==="answered"?{state:"answered",response:_e(r.response)}:n.answer!==void 0?{state:"answered",response:_e(n.answer)}:r?.status==="dismissed"?{state:"dismissed",response:void 0}:r?.status==="timeout"?{state:"timeout",response:void 0}:r?.status==="closed"?{state:"closed",response:void 0}:r===void 0&&e.args?.await&&t!=="preparing"?{state:"waiting",response:void 0}:{state:"idle",response:void 0}}var Ie="dsh-lantern/visual",Ce="lanternVisual",Re="dsh-resource://lantern-visual/",Ae,Xe;function Ye(e){Ae=e.sidebarRight,Xe=e.sessions}function Pt(e,t){return Re+encodeURIComponent(e)+"/"+encodeURIComponent(t)}function Le(e){if(!e||!e.startsWith(Re))return;let[t,n]=e.slice(Re.length).split("/");if(!(!t||!n))try{return{sessionId:decodeURIComponent(t),callId:decodeURIComponent(n)}}catch{return}}function ce(e,t){if(!(!Ae||!e))try{Ae.openResource(Pt(e,t),{kind:Ce})}catch(n){console.warn("[dsh-lantern] could not open the sidebar",n)}}async function Me(e,t){let n=await fetch(new URL(`api/${e}`,document.baseURI),{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(t),credentials:"same-origin"}),r;try{r=await n.json()}catch{r=void 0}if(!n.ok||!r?.ok)throw new Error(r?.error?.message??`HTTP ${n.status}`);return r.value}async function Oe(e,t){if(!e)throw new Error("no session");let r=Xe?.scope(e)?.get("conversation");if(!r)throw new Error("conversation service unavailable");await r.send(t)}function jt(e,t){let n=`${B().answerPrefix} \u2014 ${e||B().visual}`;return typeof t=="string"?`${n}: ${t}`:t&&typeof t=="object"&&!Array.isArray(t)&&Object.values(t).every(r=>r===null||typeof r!="object")?[n,...Object.entries(t).map(([r,i])=>`${r}: ${typeof i=="string"?i:JSON.stringify(i)}`)].join(`
`):`${n}: ${JSON.stringify(t)}`}var Te=new Set;async function Qe(e,t,n){let r=X(e),i=t??r?.sessionId;if(Te.has(e)||H(e).answer!==void 0||r?.result?.status==="answered")throw new Error("already answered");Te.add(e);try{if(r?.args?.await&&r.result===void 0){let{status:l}=await Me("lantern.respond",{sessionId:i,callId:e,response:n});if(l==="settled"){Q(e,{answer:JSON.stringify(n)});return}}await Oe(i,jt(r?.args?.title??"",n)),Q(e,{answer:JSON.stringify(n)})}finally{Te.delete(e)}}async function Ze(e,t){let{status:n}=await Me("lantern.dismiss",{sessionId:t??X(e)?.sessionId,callId:e});return se(e,{}),n==="settled"}async function et(e,t){let{url:n}=await Me("lantern.file",{sessionId:e,path:t});return new URL(n,document.baseURI).href}var L=require("react");var C=require("react");var x=require("react");var ue=`/*
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
`;var Pe="__lantern";function tt(){let e="__lantern",n=document.getElementById("lantern-boot"),r=JSON.parse(n&&n.textContent||"{}"),i=r.state||"idle",l=r.response,c=r.scheme||"light",g=r.widgetState===void 0?null:r.widgetState,p=1,b={};function S(a){a[e]=1,parent.postMessage(a,"*")}function M(a,s){let o=p++;return new Promise((f,T)=>{b[o]={resolve:f,reject:T};let G={type:a,id:o};for(let F of Object.keys(s))G[F]=s[F];S(G)})}function N(a,s){let o;try{o=JSON.stringify(a===void 0?null:a)}catch{o=void 0}if(typeof o!="string")throw new TypeError("lantern."+s+": value is not JSON-serializable");if(o.length>65536)throw new RangeError("lantern."+s+": value is larger than 64 KB");return o}function E(a,s){window.dispatchEvent(new CustomEvent("lantern:"+a,{detail:s}))}function A(){document.documentElement.setAttribute("data-lt-state",i);let a=i==="answered"||i==="dismissed"||i==="closed";document.querySelectorAll('[data-lt-submit], form[data-lt-form] button:not([type="button"]), form[data-lt-form] input[type="submit"]').forEach(s=>{let o=s;a?(o.disabled=!0,o.setAttribute("data-lt-locked","")):o.hasAttribute("data-lt-locked")&&(o.disabled=!1,o.removeAttribute("data-lt-locked"))})}function V(){let a=getComputedStyle(document.documentElement),s=[];for(let o=1;o<=8;o++)s.push(a.getPropertyValue("--lt-series-"+o).trim());return s}let w={get id(){return r.id},get state(){return i},get response(){return l},get theme(){return c},get mode(){return r.mode},submit(a){try{return M("submit",{json:N(a,"submit")})}catch(s){return Promise.reject(s)}},send(a){return typeof a!="string"||a.trim()===""?Promise.reject(new TypeError("lantern.send: text must be a non-empty string")):M("send",{text:a.slice(0,4e3)})},openLink(a){S({type:"open-link",url:String(a)})},expand(){S({type:"expand"})},getState(){return g},setState(a){g=a,S({type:"set-state",json:N(a,"setState")})},colors:V,on(a,s){let o=f=>s(f.detail);return window.addEventListener("lantern:"+a,o),()=>window.removeEventListener("lantern:"+a,o)}};Object.defineProperty(window,"lantern",{value:Object.freeze(w),configurable:!1,writable:!1,enumerable:!0}),window.addEventListener("message",a=>{if(a.source!==parent)return;let s=a.data;if(!(!s||s[e]!==1)){if(s.type==="reply"){let o=b[s.id];if(!o)return;delete b[s.id],s.ok?o.resolve(!0):o.reject(new Error(s.error||"lantern: request failed"))}else if(s.type==="state")i=s.state,l=s.response,A(),E("state",{state:i,response:l});else if(s.type==="theme"){c=s.scheme,document.documentElement.setAttribute("data-theme",c);let o=document.getElementById("lantern-theme");o&&(o.textContent=s.css),E("theme",{scheme:c})}else if(s.type==="partial"&&r.streaming){let o=document.getElementById("lantern-stream");o&&(o.innerHTML=s.html)}}});let h=-1,O=!1;function P(){O=!1;let a=document.documentElement.getBoundingClientRect(),s=Math.ceil(Math.max(a.height,document.body?document.body.scrollHeight:0));Math.abs(s-h)<2||(h=s,S({type:"resize",height:s}))}function J(){O||(O=!0,requestAnimationFrame(P))}function _(a){if(a===null||a==="")return null;try{return JSON.parse(a)}catch{return a}}function j(a){let s={};return new FormData(a).forEach((o,f)=>{let T=typeof o=="string"?o:o.name;f in s?s[f]=[].concat(s[f],T):s[f]=T}),a.querySelectorAll('input[type="checkbox"][name]').forEach(o=>{let f=o;!(f.name in s)&&!a.querySelector('input[type="checkbox"][name="'+f.name+'"][value]:not([value="on"])')?s[f.name]=!1:s[f.name]==="on"&&(s[f.name]=!0)}),s}function $(a){let s=[];return a.querySelectorAll("[data-lt-choice]").forEach(o=>{o.getAttribute("aria-pressed")==="true"&&s.push(_(o.getAttribute("data-lt-choice")))}),a.hasAttribute("data-lt-multi")?s:s.length?s[0]:null}function K(a){let s=a.closest("form");if(s)return j(s);let o=a.parentElement;for(;o&&o!==document.body;){let T=o.querySelector("[data-lt-choices]");if(T)return $(T);o=o.parentElement}let f=document.querySelector("[data-lt-choices]");return f?$(f):null}function m(a,s){let o=a.parentElement&&a.parentElement.querySelector(".lt-error[data-lt-auto]");!o&&a.parentElement&&(o=document.createElement("div"),o.className="lt-error",o.setAttribute("data-lt-auto",""),a.parentElement.appendChild(o)),o&&(o.textContent=s)}function D(){let a=String(r.lang||navigator.language||"en").toLowerCase();return a.startsWith("ja")?"\u9078\u3093\u3067\u304B\u3089\u9001\u3063\u3066\u304F\u3060\u3055\u3044\u3002":a.startsWith("zh")?"\u8BF7\u5148\u9009\u62E9\u518D\u63D0\u4EA4\u3002":"Pick an option first."}function I(a){return a===null||a===""||Array.isArray(a)&&a.length===0}document.addEventListener("click",a=>{let s=a.target;if(!s||!s.closest)return;let o=s.closest("[data-lt-choice]");if(o){let v=o.closest("[data-lt-choices]"),z=!!v&&v.hasAttribute("data-lt-multi"),q=o.getAttribute("aria-pressed")==="true";if(v&&!z&&v.querySelectorAll("[data-lt-choice]").forEach(oe=>oe.setAttribute("aria-pressed","false")),o.setAttribute("aria-pressed",z?String(!q):"true"),v){E("select",$(v));let oe=v.parentElement&&v.parentElement.querySelector(".lt-error[data-lt-auto]");oe&&(oe.textContent="")}v&&v.hasAttribute("data-lt-instant")&&!z&&w.submit($(v)).catch(()=>{});return}let f=s.closest("[data-lt-submit]");if(f&&!f.disabled){a.preventDefault();let v=f.getAttribute("data-lt-submit"),z=v?_(v):K(f);if(!v&&I(z)){m(f,f.getAttribute("data-lt-empty")||D());return}m(f,""),w.submit(z).catch(q=>m(f,q.message));return}let T=s.closest("[data-lt-send]");if(T){a.preventDefault(),w.send(T.getAttribute("data-lt-send")||"").catch(()=>{});return}if(s.closest("[data-lt-expand]")){a.preventDefault(),w.expand();return}let F=s.closest('[role="tablist"] > [data-tab]');if(F){let v=F.closest("[data-lt-tabs]");if(v){let z=F.getAttribute("data-tab");v.querySelectorAll('[role="tablist"] > [data-tab]').forEach(q=>q.setAttribute("aria-selected",String(q===F))),v.querySelectorAll("[data-tab-panel]").forEach(q=>{q.getAttribute("data-tab-panel")===z?q.removeAttribute("data-lt-hidden"):q.setAttribute("data-lt-hidden","")})}return}let ye=s.closest("[data-lt-next],[data-lt-prev]");if(ye){let v=ye.closest("[data-lt-steps]");v&&u(v,Number(v.getAttribute("data-index")||0)+(ye.hasAttribute("data-lt-next")?1:-1));return}let re=s.closest("a[href]");if(re&&!a.defaultPrevented){let v=re.getAttribute("href")||"";if(v.startsWith("#")){a.preventDefault();let q=document.getElementById(decodeURIComponent(v.slice(1)));q&&q.scrollIntoView({behavior:"smooth"});return}let z=!1;try{z=location.protocol.startsWith("http")&&new URL(re.href).origin===location.origin}catch{z=!1}if(z)return;a.preventDefault(),/^https?:\/\//i.test(re.href)&&w.openLink(re.href)}},!1),document.addEventListener("submit",a=>{let s=a.target;if(!(!s||!s.hasAttribute("data-lt-form"))){if(a.preventDefault(),!s.checkValidity()){s.reportValidity();return}w.submit(j(s)).catch(o=>m(s.lastElementChild||s,o.message))}});function u(a,s){let o=a.querySelectorAll("[data-step]");if(o.length===0)return;let f=(s+o.length)%o.length;a.setAttribute("data-index",String(f)),o.forEach((G,F)=>{F===f?G.removeAttribute("data-lt-hidden"):G.setAttribute("data-lt-hidden","")});let T=a.querySelector("[data-lt-dots]");T&&(T.innerHTML=Array.from(o).map((G,F)=>'<i class="'+(F===f?"on":"")+'"></i>').join("")),E("step",f)}function y(){if(document.documentElement.setAttribute("data-theme",c),A(),document.querySelectorAll("[data-lt-tabs]").forEach(a=>{let s=a.querySelector('[role="tablist"] > [data-tab][aria-selected="true"]')||a.querySelector('[role="tablist"] > [data-tab]');s&&s.click()}),document.querySelectorAll("[data-lt-steps]").forEach(a=>u(a,0)),i==="answered"&&l!==void 0&&document.querySelectorAll("[data-lt-choices]").forEach(a=>{let s=[].concat(l);a.querySelectorAll("[data-lt-choice]").forEach(o=>{let f=_(o.getAttribute("data-lt-choice"));s.some(T=>JSON.stringify(T)===JSON.stringify(f))&&o.setAttribute("aria-pressed","true")})}),typeof ResizeObserver=="function"){let a=new ResizeObserver(J);a.observe(document.documentElement),document.body&&a.observe(document.body)}window.addEventListener("load",J),J(),S({type:"ready"})}let k=0;window.addEventListener("error",a=>{k++<3&&S({type:"error",message:String(a.message||"Script error")})}),window.addEventListener("unhandledrejection",a=>{k++<3&&S({type:"error",message:String(a.reason&&a.reason.message||a.reason||"Unhandled rejection")})}),document.readyState==="loading"?document.addEventListener("DOMContentLoaded",y):y()}var qt="@layer lantern-kit, lantern-theme;",vn=ue.slice(0,Math.max(0,ue.indexOf("/* Base */"))),Vt="body{padding:var(--lt-pad,16px)}";function zt(e){return JSON.stringify(e===void 0?null:e).replace(/</g,"\\u003c").replace(/>/g,"\\u003e").replace(/&/g,"\\u0026").replace(/\u2028/g,"\\u2028").replace(/\u2029/g,"\\u2029")}function nt(e){let t=Object.entries(e).filter(([n,r])=>/^--lt-[a-z0-9-]+$/.test(n)&&r!==""&&!/[;{}<]/.test(r)).map(([n,r])=>`${n}:${r}`).join(";");return t===""?"":`@layer lantern-theme{:root{${t}}}`}var Jt=`(${tt.toString()})();`,Ft="connect-src data: blob:; form-action 'none'; base-uri 'none'";function Bt(e,t){return`<meta http-equiv="Content-Security-Policy" content="${Ft}"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><script type="application/json" id="lantern-boot">${zt(e)}<\/script><script>${Jt.replace(/<\/script/gi,"<\\/script")}<\/script><style id="lantern-kit">${qt}@layer lantern-kit{${ue}${Vt}}</style><style id="lantern-theme">${t}</style>`}function Dt(e){return e.replace(/<!--[\s\S]*?(-->|$)/g,t=>" ".repeat(t.length)).replace(/(<script\b[^>]*>)([\s\S]*?)(<\/script>|$)/gi,(t,n,r,i)=>n+" ".repeat(r.length)+i)}function pe(e,t){let n=new RegExp(`<${t}(\\s[^>]*)?>`,"i").exec(Dt(e));if(!n)return null;let r=[e.slice(n.index,n.index+n[0].length)];return r.index=n.index,r}function _t(e,t){let n=pe(e,"head");if(n)return e.slice(0,n.index+n[0].length)+t+e.slice(n.index+n[0].length);let r=pe(e,"html");if(r)return e.slice(0,r.index+r[0].length)+`<head>${t}</head>`+e.slice(r.index+r[0].length);let i=/^\s*<!doctype[^>]*>/i.exec(e);return i?i[0]+t+e.slice(i[0].length):t+e}var rt=/^\s*(?:<!--[\s\S]*?-->\s*)*(?:<!doctype[^>]*>|<html[\s>])/i;function at(e,t,n){let r=Bt(t,n),i=t.scheme==="dark"?"dark":"light";return t.streaming?`<!doctype html><html data-theme="${i}"><head>${r}</head><body><div id="lantern-stream"></div></body></html>`:rt.test(e)&&(pe(e,"head")||pe(e,"html"))?_t(e,r):`<!doctype html><html data-theme="${i}"><head>${r}</head><body>${e}</body></html>`}function je(e){let t=e,n=t.lastIndexOf("<");n>t.lastIndexOf(">")&&(t=t.slice(0,n)),t=t.replace(/<script[\s\S]*?(<\/script>|$)/gi,"").replace(/<\/?(?:iframe|object|embed|frame|frameset|meta|base|link|portal)\b[^>]*>/gi,"").replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi,"").replace(/(href|src|action|formaction|xlink:href)\s*=\s*("\s*javascript:[^"]*"|'\s*javascript:[^']*'|javascript:[^\s>]+)/gi,'$1=""');let r=/<body[^>]*>/i.exec(t);if(r)t=(t.slice(0,r.index).match(/<style[\s\S]*?<\/style>/gi)??[]).join("")+t.slice(r.index+r[0].length);else if(rt.test(t))return(t.match(/<style[\s\S]*?<\/style>/gi)??[]).join("");return t}var Ht=[["--lt-bg",["--dsw-alias-bg-base"]],["--lt-surface",["--dsw-alias-bg-layer-1"]],["--lt-surface-2",["--dsw-alias-bg-layer-2"]],["--lt-fg",["--dsw-alias-label-primary"]],["--lt-fg-2",["--dsw-alias-label-secondary"]],["--lt-fg-3",["--dsw-alias-label-tertiary"]],["--lt-border",["--dsw-alias-border-l1"]],["--lt-border-strong",["--dsw-alias-border-l2"]],["--lt-accent",["--dsw-alias-brand-primary"]],["--lt-success",["--dsw-alias-state-success-primary"]],["--lt-warning",["--dsw-alias-state-warn-primary"]],["--lt-danger",["--dsw-alias-state-error-primary"]]],Ut=[["--lt-accent-soft","--lt-accent",14],["--lt-success-soft","--lt-success",14],["--lt-warning-soft","--lt-warning",16],["--lt-danger-soft","--lt-danger",13]];function $e(e,t){for(let n of t){let r=e.getPropertyValue(n).trim();if(r!=="")return r}return""}var U;function Wt(e){U||(U=document.createElement("span"),U.style.display="none"),U.isConnected||document.body.appendChild(U),U.style.color="",U.style.color=e;let t=/rgba?\(([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)/.exec(getComputedStyle(U).color);if(!t)return 0;let[n,r,i]=[t[1],t[2],t[3]].map(l=>{let c=Number(l)/255;return c<=.03928?c/12.92:((c+.055)/1.055)**2.4});return .2126*n+.7152*r+.0722*i}function st(){let e=document.body,t=e?.hasAttribute("data-ds-dark-theme")||!e&&document.documentElement.style.colorScheme==="dark"?"dark":"light";if(!e)return{scheme:t,css:""};let n=getComputedStyle(e),r={};for(let[g,p]of Ht){let b=$e(n,p);b!==""&&(r[g]=b)}for(let[g,p,b]of Ut){let S=r[p];S!==void 0&&(r[g]=`color-mix(in srgb, ${S} ${b}%, transparent)`)}let i=r["--lt-accent"];i!==void 0&&(r["--lt-accent-fg"]=Wt(i)>.55?"#111111":"#ffffff");let l=$e(n,["--dsh-font-family-text","--dsw-font-family"]);l!==""&&(r["--lt-font-sans"]=`${l}, system-ui, "Hiragino Sans", "Noto Sans JP", "Noto Sans CJK JP", sans-serif`);let c=$e(n,["--dsh-font-family-code","--ds-font-family-code"]);return c!==""&&(r["--lt-font-mono"]=`${c}, ui-monospace, Menlo, Consolas, monospace`),{scheme:t,css:nt(r)}}var Z,ge=new Set,te,fe,Ve=!1;function Kt(){Ve=!1;let e=st();if(!(Z&&e.scheme===Z.scheme&&e.css===Z.css)){Z=e;for(let t of ge)t(e)}}function qe(){Ve||(Ve=!0,requestAnimationFrame(Kt))}function me(){return Z===void 0&&(Z=st()),Z}function ot(e){return ge.add(e),te===void 0&&typeof MutationObserver=="function"&&(te=new MutationObserver(qe),document.body&&te.observe(document.body,{attributes:!0,attributeFilter:["data-ds-dark-theme","style","class"]}),te.observe(document.documentElement,{attributes:!0,attributeFilter:["style","data-ds-theme-source","lang","class"]}),fe=window.matchMedia?.("(prefers-color-scheme: dark)"),fe?.addEventListener?.("change",qe)),()=>{ge.delete(e),ge.size===0&&(te?.disconnect(),te=void 0,fe?.removeEventListener?.("change",qe),fe=void 0)}}var ct=require("react/jsx-runtime"),Gt="allow-scripts allow-forms allow-downloads",it=64*1024,Xt=1500,Yt=6,dt=0,lt=!1;function Qt(){if(lt)return;lt=!0;let e=()=>{dt=performance.now()};window.addEventListener("pointerdown",e,!0),window.addEventListener("keydown",e,!0)}function ze(e,t){if(!e||document.activeElement!==e||t===0||dt>t)return!1;let n=navigator.userActivation;return n?n.isActive:!1}function Je(e){let{callId:t,mode:n,html:r,url:i,streaming:l=!1,state:c,response:g}=e,p=(0,x.useRef)(null),b=(0,x.useRef)(!1),[S,M]=(0,x.useState)(n==="inline"?120:0),N=(0,x.useRef)(e);N.current=e;let E=(0,x.useRef)(0),A=(0,x.useRef)(0),V=(0,x.useRef)(0),w=(0,x.useRef)(0),h=(0,x.useRef)(0),O=(0,x.useRef)(!1);(0,x.useEffect)(()=>{Qt();let m=()=>{document.activeElement===p.current&&(w.current=performance.now())};return window.addEventListener("blur",m),()=>window.removeEventListener("blur",m)},[]);let P=(0,x.useRef)({state:c,response:g}),J=(0,x.useMemo)(()=>{if(r===void 0)return;let m=H(t),D=null;if(m.state!==void 0)try{D=JSON.parse(m.state)}catch{D=null}let I=me(),u={id:t,state:P.current.state,response:P.current.response??null,scheme:I.scheme,mode:n,widgetState:D,streaming:l,lang:ie()};return at(l?"":r,u,I.css)},[l?"":r,l,t,n]),_=(0,x.useMemo)(()=>{if(i===void 0)return;let m=new URL(i);return m.searchParams.set("lt",t),m.searchParams.set("theme",me().scheme),m.searchParams.set("lang",ie()),m.href},[i,t]),j=m=>{p.current?.contentWindow?.postMessage({...m,[Pe]:1},"*")};(0,x.useEffect)(()=>{b.current=!1,h.current=0,O.current=!1;let m=D=>{let I=p.current?.contentWindow;if(!I||D.source!==I)return;let u=D.data;if(!u||u[Pe]!==1||typeof u.type!="string"||O.current)return;let y=N.current,k=(a,s,o)=>{typeof a=="number"&&j({type:"reply",id:a,ok:s,...o?{error:o}:{}})};switch(u.type){case"ready":{b.current=!0;let a=me();j({type:"theme",css:a.css,scheme:a.scheme}),j({type:"state",state:y.state,response:y.response??null}),y.streaming&&y.html!==void 0&&j({type:"partial",html:je(y.html)});return}case"resize":{if(y.mode!=="inline")return;let a=Number(u.height);Number.isFinite(a)&&M(Math.max(24,Math.min(Math.ceil(a),y.maxHeight??2400)));return}case"submit":case"send":{if(y.streaming){k(u.id,!1,"The visual is still being written.");return}if(!ze(p.current,w.current)){k(u.id,!1,"Only a user action inside the visual can do this.");return}let a=Date.now();if(a-E.current<400){k(u.id,!1,"Too fast.");return}if(u.type==="send"){if(a-A.current<Xt||V.current>=Yt){k(u.id,!1,"Too many messages from this visual.");return}A.current=a,V.current++}if(E.current=a,u.type==="submit"){if(typeof u.json!="string"||u.json.length>it){k(u.id,!1,"The answer is too large.");return}if(y.state==="answered"||y.state==="dismissed"||y.state==="closed"){k(u.id,!1,"This visual is already settled.");return}let s;try{s=JSON.parse(u.json)}catch{k(u.id,!1,"The answer is not JSON.");return}y.onSubmit(s).then(()=>k(u.id,!0),o=>k(u.id,!1,o.message))}else{if(typeof u.text!="string"||u.text.trim()===""){k(u.id,!1,"Empty message.");return}y.onSend(u.text.slice(0,4e3)).then(()=>k(u.id,!0),s=>k(u.id,!1,s.message))}return}case"expand":{if(y.streaming||!ze(p.current,w.current))return;let a=Date.now();if(a-E.current<1e3)return;E.current=a,y.onExpand?.();return}case"open-link":{if(y.streaming||!ze(p.current,w.current)||typeof u.url!="string")return;let a=Date.now();if(a-E.current<1e3)return;E.current=a;let s;try{s=new URL(u.url)}catch{return}if(s.protocol!=="http:"&&s.protocol!=="https:")return;window.open(s.href,"_blank","noopener,noreferrer");return}case"set-state":!y.streaming&&typeof u.json=="string"&&u.json.length<=it&&Q(y.callId,{state:u.json});return;case"error":typeof u.message=="string"&&y.onError?.(u.message.slice(0,300));return}};return window.addEventListener("message",m),()=>window.removeEventListener("message",m)},[J,_]),(0,x.useEffect)(()=>{b.current&&j({type:"state",state:c,response:g??null})},[c,JSON.stringify(g??null)]),(0,x.useEffect)(()=>ot(m=>{b.current&&j({type:"theme",css:m.css,scheme:m.scheme})}),[]);let $=(0,x.useRef)(void 0);(0,x.useEffect)(()=>{!l||r===void 0||$.current===void 0&&($.current=window.setTimeout(()=>{$.current=void 0;let m=N.current;b.current&&m.html!==void 0&&j({type:"partial",html:je(m.html)})},120))},[l,r]),(0,x.useEffect)(()=>()=>{$.current!==void 0&&clearTimeout($.current)},[]);let K=n==="inline"?{height:`${S}px`}:void 0;return(0,ct.jsx)("iframe",{ref:p,className:"lantern-frame","data-mode":n,title:t,sandbox:Gt,onLoad:()=>{h.current++,J!==void 0&&h.current>1&&(O.current=!0)},allow:"fullscreen; clipboard-write",referrerPolicy:"no-referrer",style:K,...J!==void 0?{srcDoc:J}:{src:_}})}var d=require("react/jsx-runtime");function W({name:e}){return(0,d.jsx)("svg",{className:"lantern-icon",viewBox:"0 0 16 16",width:"14",height:"14",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:{visual:(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)("rect",{x:"2.5",y:"3",width:"11",height:"10",rx:"2"}),(0,d.jsx)("path",{d:"M5 10l2-2.5 1.6 1.8L10.5 7 12 10"})]}),sidebar:(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)("rect",{x:"2.5",y:"3",width:"11",height:"10",rx:"2"}),(0,d.jsx)("path",{d:"M9.5 3v10"})]}),chevron:(0,d.jsx)("path",{d:"M4.5 6.5L8 10l3.5-3.5"}),skip:(0,d.jsx)("path",{d:"M4.5 4.5l7 7M11.5 4.5l-7 7"}),arrow:(0,d.jsx)("path",{d:"M4 8h8M8.5 4.5L12 8l-3.5 3.5"})}[e]})}function Zt(e){document.querySelector(`[data-lantern-id="${CSS.escape(e)}"]`)?.scrollIntoView({behavior:"smooth",block:"center"})}function be({record:e,sessionId:t,placement:n,phase:r,partialHtml:i}){let l=B(),c=e.callId,g=Y(()=>Ue(c)),p=Y(()=>H(c)),[b,S]=(0,C.useState)([]),[M,N]=(0,C.useState)(void 0),[E,A]=(0,C.useState)(!1),V=e.args,w=t??e.sessionId,{state:h,response:O}=e.error!==void 0?{state:"closed",response:void 0}:Ge(e,r),P=V?.title||l.visual,J=(e.result?.path??V?.path)!==void 0,_=V?.display??"inline",j=(0,C.useCallback)(async s=>{N(void 0);try{await Qe(c,w,s)}catch(o){throw N(`${l.sendFailed}: ${o.message}`),o}},[c,w]),$=(0,C.useCallback)(async s=>{N(void 0);try{await Oe(w,s)}catch(o){throw N(`${l.sendFailed}: ${o.message}`),o}},[w]),K=(0,C.useCallback)(()=>ce(w,c),[w,c]),m=(0,C.useCallback)(s=>S(o=>o.length>=3?o:[...o,s]),[]),D=(0,C.useCallback)(()=>{A(!0),Ze(c,w).then(s=>{s||N(l.notWaiting)},s=>N(`${l.sendFailed}: ${s.message}`)).finally(()=>A(!1))},[c,w]),I=r==="preparing"?l.preparing:e.error!==void 0?l.error:h==="waiting"?l.waiting:h==="answered"?l.answered:h==="dismissed"?l.dismissed:h==="timeout"?l.timeout:void 0,u=h==="waiting"&&e.result===void 0&&r!=="preparing";if(g!==void 0&&n!=="panel")return(0,d.jsxs)("div",{className:"lantern-row","data-lantern-id":c,"data-replaced":"",children:[(0,d.jsx)(W,{name:"visual"}),(0,d.jsx)("span",{className:"lantern-row-title",children:P}),(0,d.jsx)("span",{className:"lantern-muted",children:l.replaced}),(0,d.jsxs)("button",{type:"button",className:"lantern-link",onClick:()=>Zt(g),children:[l.showNew,(0,d.jsx)(W,{name:"arrow"})]})]});let y=u?(0,d.jsxs)("button",{type:"button",className:"lantern-action",onClick:D,disabled:E,title:l.skip,children:[(0,d.jsx)(W,{name:"skip"}),(0,d.jsx)("span",{children:l.skip})]}):null;if(n!=="panel"&&(_==="panel"||J))return(0,d.jsxs)("div",{className:"lantern-row","data-lantern-id":c,"data-state":h,children:[(0,d.jsx)(W,{name:"sidebar"}),(0,d.jsx)("span",{className:"lantern-row-title",children:P}),I&&(0,d.jsx)("span",{className:"lantern-badge","data-state":h,children:I}),(0,d.jsx)("span",{className:"lantern-muted",children:u?l.answerInSidebar:l.shownInSidebar}),(0,d.jsx)("span",{className:"lantern-spacer"}),y,r!=="preparing"&&(0,d.jsxs)("button",{type:"button",className:"lantern-action",onClick:K,title:l.openSidebar,children:[(0,d.jsx)(W,{name:"sidebar"}),(0,d.jsx)("span",{children:l.openSidebar})]}),e.error&&(0,d.jsx)("div",{className:"lantern-note","data-kind":"error",children:e.error})]});let k=n!=="panel"&&p.collapsed===!0,a=e.error!==void 0?(0,d.jsx)("div",{className:"lantern-note","data-kind":"error",children:e.error}):J?(0,d.jsx)(en,{record:e,sessionId:w,state:h,response:O,onSubmit:j,onSend:$,onError:m}):V?.html!==void 0||i!==void 0?(0,d.jsx)(Je,{callId:c,mode:n==="panel"?"panel":"inline",html:r==="preparing"?i??"":V?.html??"",streaming:r==="preparing",state:h,response:O,onSubmit:j,onSend:$,onExpand:n==="panel"?void 0:K,onError:m},r==="preparing"?"stream":"full"):(0,d.jsx)("div",{className:"lantern-note",children:l.preparing});return n==="panel"?(0,d.jsxs)("div",{className:"lantern-panel","data-lantern-panel":c,"data-state":h,children:[(u||M||b.length>0)&&(0,d.jsxs)("div",{className:"lantern-panel-bar",children:[I&&(0,d.jsx)("span",{className:"lantern-badge","data-state":h,children:I}),(0,d.jsx)("span",{className:"lantern-spacer"}),y]}),(0,d.jsx)(ut,{notice:M,errors:b}),(0,d.jsx)("div",{className:"lantern-panel-body",children:a})]}):(0,d.jsxs)("div",{className:"lantern-card","data-lantern-id":c,"data-state":h,"data-placement":n,children:[(0,d.jsxs)("div",{className:"lantern-head",children:[(0,d.jsx)(W,{name:"visual"}),(0,d.jsx)("span",{className:"lantern-title",children:P}),I&&(0,d.jsx)("span",{className:"lantern-badge","data-state":h,children:I}),(0,d.jsx)("span",{className:"lantern-spacer"}),y,r!=="preparing"&&(0,d.jsx)("button",{type:"button",className:"lantern-action icon",onClick:K,title:l.openSidebar,"aria-label":l.openSidebar,children:(0,d.jsx)(W,{name:"sidebar"})}),(0,d.jsx)("button",{type:"button",className:"lantern-action icon","data-collapsed":k?"":void 0,onClick:()=>Q(c,{collapsed:!k}),title:k?l.expand:l.collapse,"aria-label":k?l.expand:l.collapse,"aria-expanded":!k,children:(0,d.jsx)(W,{name:"chevron"})})]}),(0,d.jsx)("div",{className:"lantern-body",hidden:k,children:a}),(0,d.jsx)(ut,{notice:M,errors:b})]})}function ut({notice:e,errors:t}){let n=B();return!e&&t.length===0?null:(0,d.jsxs)("div",{className:"lantern-notes",children:[e&&(0,d.jsx)("div",{className:"lantern-note","data-kind":"error",children:e}),t.map((r,i)=>(0,d.jsxs)("div",{className:"lantern-note","data-kind":"warn",children:[n.scriptError,": ",r]},i))]})}function en(e){let t=B(),n=e.record.result?.path??e.record.args?.path,[r,i]=(0,C.useState)(void 0),[l,c]=(0,C.useState)(void 0);return(0,C.useEffect)(()=>{if(!n||!e.sessionId)return;let g=!0;return c(void 0),et(e.sessionId,n).then(p=>{g&&i(p)},p=>{g&&c(p.message)}),()=>{g=!1}},[n,e.sessionId]),l?(0,d.jsxs)("div",{className:"lantern-note","data-kind":"error",children:[t.fileError,": ",l]}):r?(0,d.jsx)(Je,{callId:e.record.callId,mode:"panel",url:r,state:e.state,response:e.response,onSubmit:e.onSubmit,onSend:e.onSend,onError:e.onError}):(0,d.jsx)("div",{className:"lantern-note",children:t.loading})}var R=require("react/jsx-runtime"),ne="show_visual",he="lanternVisuals";function Fe(e){return Array.isArray(e)?e.map(t=>t&&typeof t=="object"&&t.type==="text"?String(t.text??""):"").join(`
`).trim():""}var ft={kind:he,match:e=>e.type==="turn/start"?{id:String(e.data.turn),role:"start"}:e.type==="tool/call"&&e.data.name===ne?{id:String(e.data.turn),role:"update"}:e.type==="tool/result"?{id:String(e.data.turn),role:"update"}:null,start:(e,t)=>({turn:Number(t.event.data.turn),calls:[]}),update:(e,t)=>{let n=e.state,r=t.event;if(r.type==="tool/call"){let i=String(r.data.callId);return n.calls.some(l=>l.callId===i)?n:{...n,calls:[...n.calls,{callId:i,seq:r.seq,argsRaw:String(r.data.arguments??""),settled:!1,isError:!1}]}}if(r.type==="tool/result"){let i=String(r.data.message?.source?.callId??r.data.message?.toolCallId??""),l=n.calls.findIndex(b=>b.callId===i);if(l<0)return n;let c=r.data.message?.isError===!0,g={...n.calls[l],settled:!0,isError:c,meta:r.data.meta,...c?{errorText:Fe(r.data.message?.content)||String(r.data.error?.code??"error")}:{}},p=n.calls.slice();return p[l]=g,{...n,calls:p}}return n},buildLocationData:(e,t,n)=>t!=="turn"||e.state===void 0||e.state.calls.length===0?null:n?.kind==="turn"&&n.turn===e.state.turn&&n.key===he&&n.value===e.state.calls?n:{kind:"turn",turn:e.state.turn,key:he,value:e.state.calls}};function gt(e,t){return{sessionId:t,seq:e.seq,args:Se(e.argsRaw),result:e.settled&&!e.isError?Ee(e.meta):void 0,error:e.isError?e.errorText??"error":void 0}}var pt=new Set;function tn(e){if(!e?.has||!e.has("title"))return;let t={};for(let n of["title","html","path","display","replace"])e.has(n)&&(t[n]=e.text(n));return e.has("await_response")&&(t.await_response=e.value?.("await_response")===!0),JSON.stringify(t)}function mt(e){let{phase:t,block:n,callId:r,sessionId:i}=e,l=t==="start"?n.argsRaw:t==="result"?n.call?.argsRaw??void 0:void 0,c=(0,L.useMemo)(()=>l===void 0&&t==="result"?tn(n.args):void 0,[l,t,n.args]),g=(0,L.useMemo)(()=>Se(l??c),[l,c]),p=t==="preparing"?n.args:void 0,b=p?.has("title")?p.text("title"):"",S=p?.has("html")?p.text("html"):void 0,M=p?.has("path")||p?.has("display")&&p.text("display")==="panel",N=t==="result"&&n.isError===!0,E=N?Fe(n.content)||String(n.error?.code??"error"):void 0,A=t==="result"&&!N?Ee(n.meta):void 0;(0,L.useEffect)(()=>{se(r,{sessionId:i,...g?{args:g}:{},...A?{result:A}:{},...E?{error:E}:{},...typeof n.seq=="number"?{seq:n.seq}:{}})},[r,i,g,A?.status,A?.response,E]);let V=(0,L.useRef)(t!=="result");(0,L.useEffect)(()=>{t!=="preparing"&&V.current&&g?.display==="panel"&&!E&&!pt.has(r)&&(pt.add(r),queueMicrotask(()=>ce(i,r)))},[t,g?.display,E]);let w=Y(()=>Ke(r)),h=Y(()=>X(r)),O=B(),P={...h,callId:r,sessionId:i??h?.sessionId,args:g??h?.args??(t==="preparing"?{title:b,display:M?"panel":"inline",await:!1}:void 0),result:A??h?.result,error:E??h?.error};return w?(0,R.jsxs)("div",{className:"lantern-row lantern-row-quiet","data-tool":ne,children:[(0,R.jsx)("span",{className:"lantern-row-title",children:P.args?.title||O.visual}),(0,R.jsx)("span",{className:"lantern-muted",children:O.shownBelow})]}):t==="result"&&P.args===void 0&&!P.error?(0,R.jsx)("div",{className:"lantern-row lantern-row-quiet","data-tool":ne,children:(0,R.jsx)("span",{className:"lantern-muted",children:Fe(n.content)})}):(0,R.jsx)("div",{className:"lantern-tool","data-tool":ne,children:(0,R.jsx)(be,{record:P,sessionId:i,placement:"tool",phase:t,partialHtml:S})})}function bt(e){let t=e.turn.data.get(he)??[],n=t.filter(r=>r.seq<e.seq&&!r.isError);return(0,L.useEffect)(()=>{for(let r of t)se(r.callId,gt(r,e.sessionId))},[t,e.sessionId]),n.length===0?null:(0,R.jsx)("div",{className:"lantern-tail",children:n.map(r=>(0,R.jsx)(nn,{item:r,sessionId:e.sessionId},r.callId))})}function nn({item:e,sessionId:t}){(0,L.useEffect)(()=>We(e.callId),[e.callId]);let n={callId:e.callId,...gt(e,t)};return n.args===void 0?null:(0,R.jsx)(be,{record:n,sessionId:t,placement:"tail",phase:e.settled?"result":"replay"})}function ht(e){let{tab:t}=e.useTabInfo(),n=Le(t.navigation.address),r=Y(()=>n?X(n.callId):void 0),i=(0,L.useRef)(null),[l,c]=(0,L.useState)(!1);(0,L.useEffect)(()=>{let b=i.current;if(!b)return;let S=()=>c(b.getClientRects().length>0&&b.offsetWidth>0);S();let M=new ResizeObserver(S);return M.observe(b),()=>M.disconnect()},[]);let g=B(),p;return!n||!r?.args?p=(0,R.jsx)("div",{className:"lantern-empty",children:g.missing}):l&&(p=(0,R.jsx)(be,{record:r,sessionId:n.sessionId,placement:"panel",phase:r.result?"result":"start"})),(0,R.jsx)("div",{ref:i,className:"lantern-tab",children:p})}function yt(e){let t=Le(e);return(t?X(t.callId):void 0)?.args?.title||B().visual}var rn="dsh-lantern",an=["slots","uiConversation","sidebarRight","sidebarRightTabs","sessions"];function sn(e){let t=e;Ye({sidebarRight:t.sidebarRight,sessions:t.sessions}),t.effect(()=>{let n=document.createElement("style");return n.id="dsh-lantern-style",n.textContent=Be,document.head.appendChild(n),()=>n.remove()},"dsh-lantern: styles"),t.effect(()=>t.uiConversation.events.register(ft),"dsh-lantern: turn data"),t.slots.inject("tool.call.toolview",()=>t.slots.register({name:"tool.call.toolview",key:ne},mt)),t.slots.inject("conversation.chat.turnTail",()=>t.slots.register({name:"conversation.chat.turnTail",id:"dsh-lantern"},bt)),t.effect(()=>t.sidebarRightTabs.register({id:Ie,kind:Ce,patterns:["dsh-resource://lantern-visual/**"],keepMounted:!0,title:yt}),"dsh-lantern: sidebar tab type"),t.effect(()=>t.slots.inject("sidebar.right.pane.tab",()=>t.slots.register({name:"sidebar.right.pane.tab",key:Ie},ht)),"dsh-lantern: sidebar tab body")}

return module.exports;}});
