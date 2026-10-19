window.__ModuleLoader__.load({id:"dsh-lantern",factory(require){const module={exports:{}};const exports=module.exports;
"use strict";var qe=Object.defineProperty;var rn=Object.getOwnPropertyDescriptor;var an=Object.getOwnPropertyNames;var sn=Object.prototype.hasOwnProperty;var on=(e,t)=>{for(var n in t)qe(e,n,{get:t[n],enumerable:!0})},ln=(e,t,n,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let l of an(t))!sn.call(e,l)&&l!==n&&qe(e,l,{get:()=>t[l],enumerable:!(r=rn(t,l))||r.enumerable});return e};var dn=e=>ln(qe({},"__esModule",{value:!0}),e);var Yn={};on(Yn,{apply:()=>Xn,inject:()=>Kn,name:()=>Gn});module.exports=dn(Yn);var bt=`/* Card chrome inside DSH Web. Uses DSH's own tokens so it follows every theme. */
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
`;var un={visual:"\u30D3\u30B8\u30E5\u30A2\u30EB",waiting:"\u56DE\u7B54\u5F85\u3061",answered:"\u56DE\u7B54\u6E08\u307F",dismissed:"\u30B9\u30AD\u30C3\u30D7",timeout:"\u6642\u9593\u5207\u308C",closed:"\u7D42\u4E86",error:"\u30A8\u30E9\u30FC",preparing:"\u4F5C\u6210\u4E2D\u2026",skip:"\u30B9\u30AD\u30C3\u30D7",openSidebar:"\u30B5\u30A4\u30C9\u30D0\u30FC\u3067\u958B\u304F",collapse:"\u6298\u308A\u305F\u305F\u3080",expand:"\u5C55\u958B\u3059\u308B",shownBelow:"\u56DE\u7B54\u306E\u4E0B\u306B\u8868\u793A\u3057\u3066\u3044\u307E\u3059",shownInSidebar:"\u30B5\u30A4\u30C9\u30D0\u30FC\u306B\u8868\u793A\u3057\u3066\u3044\u307E\u3059",answerInSidebar:"\u30B5\u30A4\u30C9\u30D0\u30FC\u3067\u56DE\u7B54\u3057\u3066\u304F\u3060\u3055\u3044",replaced:"\u65B0\u3057\u3044\u7248\u306B\u66F4\u65B0\u3057\u307E\u3057\u305F",showNew:"\u65B0\u3057\u3044\u7248\u3078",scriptError:"\u30D3\u30B8\u30E5\u30A2\u30EB\u5185\u306E\u30B9\u30AF\u30EA\u30D7\u30C8\u3067\u30A8\u30E9\u30FC",sendFailed:"\u9001\u4FE1\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F",missing:"\u3053\u306E\u30D3\u30B8\u30E5\u30A2\u30EB\u306E\u5185\u5BB9\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\u3002\u30C1\u30E3\u30C3\u30C8\u304B\u3089\u958B\u304D\u76F4\u3057\u3066\u304F\u3060\u3055\u3044\u3002",loading:"\u8AAD\u307F\u8FBC\u307F\u4E2D\u2026",fileError:"\u30D5\u30A1\u30A4\u30EB\u3092\u958B\u3051\u307E\u305B\u3093\u3067\u3057\u305F",answerPrefix:"\u56DE\u7B54",notWaiting:"\u30A8\u30FC\u30B8\u30A7\u30F3\u30C8\u306F\u3082\u3046\u5F85\u3063\u3066\u3044\u307E\u305B\u3093",wheelHint:"\u30AF\u30EA\u30C3\u30AF\u3059\u308B\u3068\u30DB\u30A4\u30FC\u30EB\u3067\u64CD\u4F5C\u3067\u304D\u307E\u3059",glLost:"3D \u8868\u793A\u3092\u4E00\u6642\u505C\u6B62\u3057\u307E\u3057\u305F\uFF08\u540C\u6642\u306B\u52D5\u304B\u305B\u308B\u6570\u306E\u4E0A\u9650\uFF09",resume:"\u518D\u958B",run:"\u5B9F\u884C",paused:"\u505C\u6B62\u4E2D\u3067\u3059\u3002\u5B9F\u884C\u3059\u308B\u307E\u3067\u30B9\u30AF\u30EA\u30D7\u30C8\u306F\u52D5\u304D\u307E\u305B\u3093\u3002"},pn={visual:"Visual",waiting:"Waiting for you",answered:"Answered",dismissed:"Skipped",timeout:"Timed out",closed:"Closed",error:"Error",preparing:"Building\u2026",skip:"Skip",openSidebar:"Open in sidebar",collapse:"Collapse",expand:"Expand",shownBelow:"Shown below the answer",shownInSidebar:"Shown in the sidebar",answerInSidebar:"Answer it in the sidebar",replaced:"Updated to a newer version",showNew:"Go to the new version",scriptError:"A script in the visual failed",sendFailed:"Could not send",missing:"This visual is not loaded. Open it again from the chat.",loading:"Loading\u2026",fileError:"Could not open the file",answerPrefix:"Answer",notWaiting:"The agent is no longer waiting",wheelHint:"Click the visual to use the scroll wheel in it",glLost:"The 3D view was paused (too many running at once)",resume:"Resume",run:"Run",paused:"Paused. Scripts stay off until you run it."},fn={visual:"\u53EF\u89C6\u5316",waiting:"\u7B49\u5F85\u56DE\u7B54",answered:"\u5DF2\u56DE\u7B54",dismissed:"\u5DF2\u8DF3\u8FC7",timeout:"\u5DF2\u8D85\u65F6",closed:"\u5DF2\u7ED3\u675F",error:"\u9519\u8BEF",preparing:"\u751F\u6210\u4E2D\u2026",skip:"\u8DF3\u8FC7",openSidebar:"\u5728\u4FA7\u8FB9\u680F\u6253\u5F00",collapse:"\u6536\u8D77",expand:"\u5C55\u5F00",shownBelow:"\u663E\u793A\u5728\u56DE\u7B54\u4E0B\u65B9",shownInSidebar:"\u663E\u793A\u5728\u4FA7\u8FB9\u680F",answerInSidebar:"\u8BF7\u5728\u4FA7\u8FB9\u680F\u4E2D\u56DE\u7B54",replaced:"\u5DF2\u66F4\u65B0\u4E3A\u65B0\u7248\u672C",showNew:"\u67E5\u770B\u65B0\u7248\u672C",scriptError:"\u53EF\u89C6\u5316\u4E2D\u7684\u811A\u672C\u51FA\u9519",sendFailed:"\u53D1\u9001\u5931\u8D25",missing:"\u672A\u52A0\u8F7D\u6B64\u53EF\u89C6\u5316\u5185\u5BB9\uFF0C\u8BF7\u4ECE\u5BF9\u8BDD\u4E2D\u91CD\u65B0\u6253\u5F00\u3002",loading:"\u52A0\u8F7D\u4E2D\u2026",fileError:"\u65E0\u6CD5\u6253\u5F00\u6587\u4EF6",answerPrefix:"\u56DE\u7B54",notWaiting:"\u667A\u80FD\u4F53\u5DF2\u4E0D\u518D\u7B49\u5F85",wheelHint:"\u70B9\u51FB\u540E\u5373\u53EF\u5728\u5176\u4E2D\u4F7F\u7528\u6EDA\u8F6E",glLost:"3D \u89C6\u56FE\u5DF2\u6682\u505C\uFF08\u540C\u65F6\u8FD0\u884C\u7684\u6570\u91CF\u5DF2\u8FBE\u4E0A\u9650\uFF09",resume:"\u7EE7\u7EED",run:"\u8FD0\u884C",paused:"\u5DF2\u6682\u505C\u3002\u70B9\u51FB\u8FD0\u884C\u524D\u4E0D\u4F1A\u6267\u884C\u811A\u672C\u3002"};function gn(e){let t=e.toLowerCase();return t.startsWith("ja")?"ja":t.startsWith("zh")?"zh":"en"}function Ne(){return gn(typeof document<"u"?document.documentElement.lang:"")}function X(){let e=Ne();return e==="ja"?un:e==="zh"?fn:pn}var yt=require("react");function Ue(e){if(!e)return;let t;try{t=JSON.parse(e)}catch{return}if(typeof t!="object"||t===null)return;let n=t,r=typeof n.html=="string"&&n.html!==""?n.html:void 0,l=typeof n.path=="string"&&n.path!==""?n.path:void 0;return{title:typeof n.title=="string"&&n.title.trim()!==""?n.title.trim():"",...r!==void 0?{html:r}:{},...l!==void 0?{path:l}:{},display:l!==void 0||n.display==="panel"?"panel":"inline",await:n.await_response===!0,...typeof n.replace=="string"&&n.replace.trim()!==""?{replace:n.replace.trim()}:{}}}function Ge(e){if(typeof e!="object"||e===null)return;let t=e,n=t.status;if(!(n!=="shown"&&n!=="answered"&&n!=="dismissed"&&n!=="timeout"&&n!=="closed"))return{status:n,...typeof t.response=="string"?{response:t.response}:{},...typeof t.path=="string"?{path:t.path}:{}}}var Ie=new Map,ve=new Map,Ae=0,Be=new Set;function C(e,t){return JSON.stringify([t??"",e])}function mn(){Ae++;for(let e of Be)e()}function bn(e){return Be.add(e),()=>{Be.delete(e)}}function Ke(e,t){let n=C(e,t.sessionId),r=Ie.get(n),l=r===void 0;for(let[d,u]of Object.entries(t)){if(u===void 0)continue;let m=r?.[d];m!==u&&(typeof u=="object"&&JSON.stringify(m)===JSON.stringify(u)||(l=!0))}if(!l)return;let i={...r,callId:e};for(let[d,u]of Object.entries(t))u!==void 0&&(i[d]=u);Ie.set(n,i),Oe()}var Fe=!1;function Oe(){Fe||(Fe=!0,queueMicrotask(()=>{Fe=!1,mn()}))}function ue(e,t){return Ie.get(C(e,t))}var Je;function hn(){if(Je?.version===Ae)return Je.map;let e=new Map;for(let t of Ie.values()){let n=t.args?.replace;if(n===void 0||n===t.callId||t.error)continue;let r=C(n,t.sessionId),l=e.get(r);(l===void 0||(t.seq??0)>(ue(l,t.sessionId)?.seq??0))&&e.set(r,t.callId)}return Je={version:Ae,map:e},e}function wt(e,t){let n=hn(),r,l=e;for(let i=0;i<20;i++){let d=n.get(C(l,t));if(d===void 0)break;r=d,l=d}return r}function pe(e){let t=(0,yt.useSyncExternalStore)(bn,()=>Ae);return e()}function vt(e,t){let n=C(e,t);return ve.set(n,(ve.get(n)??0)+1),Oe(),()=>{let r=(ve.get(n)??1)-1;r<=0?ve.delete(n):ve.set(n,r),Oe()}}function xt(e,t){return ve.has(C(e,t))}var Xe="dsh-lantern:v1:",We=300,xe=new Map,Re=new Set;function ae(e,t){let n=C(e,t),r=xe.get(n);if(Re.has(n)&&r!==void 0)return r;try{let l=localStorage.getItem(Xe+n),i=l?JSON.parse(l):void 0;return i&&typeof i=="object"&&!Array.isArray(i)?i:{}}catch{return r??{}}}function fe(e,t,n){let r=C(e,n),l={...ae(e,n),...t,at:Date.now()};if(xe.delete(r),xe.set(r,l),xe.size>We){let d=xe.keys().next().value;xe.delete(d),Re.delete(d)}let i=!1;try{localStorage.setItem(Xe+r,JSON.stringify(l)),i=!0,yn()}catch{}i?Re.delete(r):Re.add(r),Oe()}function yn(){let e=[];for(let t=0;t<localStorage.length;t++){let n=localStorage.key(t);if(!n?.startsWith(Xe))continue;let r=0;try{r=Number(JSON.parse(localStorage.getItem(n)??"{}").at)||0}catch{r=0}e.push([n,r])}if(!(e.length<=We)){e.sort((t,n)=>t[1]-n[1]);for(let[t]of e.slice(0,e.length-We))localStorage.removeItem(t)}}function ht(e){if(e!==void 0)try{return JSON.parse(e)}catch{return e}}function kt(e,t){let n=ae(e.callId,e.sessionId),r=e.result;return r?.status==="answered"?{state:"answered",response:ht(r.response)}:n.answer!==void 0?{state:"answered",response:ht(n.answer)}:r?.status==="dismissed"?{state:"dismissed",response:void 0}:r?.status==="timeout"?{state:"timeout",response:void 0}:r?.status==="closed"?{state:"closed",response:void 0}:r===void 0&&e.args?.await&&t!=="preparing"?{state:"waiting",response:void 0}:{state:"idle",response:void 0}}var et="dsh-lantern/visual",tt="lanternVisual",Qe="dsh-resource://lantern-visual/",Ze,St;function Et(e){Ze=e.sidebarRight,St=e.sessions}function wn(e,t){return Qe+encodeURIComponent(e)+"/"+encodeURIComponent(t)}function nt(e){if(!e||!e.startsWith(Qe))return;let[t,n]=e.slice(Qe.length).split("/");if(!(!t||!n))try{return{sessionId:decodeURIComponent(t),callId:decodeURIComponent(n)}}catch{return}}function Ce(e,t){if(!(!Ze||!e))try{Ze.openResource(wn(e,t),{kind:tt})}catch(n){console.warn("[dsh-lantern] could not open the sidebar",n)}}async function rt(e,t){let n=await fetch(new URL(`api/${e}`,document.baseURI),{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(t),credentials:"same-origin"}),r;try{r=await n.json()}catch{r=void 0}if(!n.ok||!r?.ok)throw new Error(r?.error?.message??`HTTP ${n.status}`);return r.value}async function at(e,t){if(!e)throw new Error("no session");let r=St?.scope(e)?.get("conversation");if(!r)throw new Error("conversation service unavailable");await r.send(t)}function vn(e,t){let n=`${X().answerPrefix} \u2014 ${e||X().visual}`;return typeof t=="string"?`${n}: ${t}`:t&&typeof t=="object"&&!Array.isArray(t)&&Object.values(t).every(r=>r===null||typeof r!="object")?[n,...Object.entries(t).map(([r,l])=>`${r}: ${typeof l=="string"?l:JSON.stringify(l)}`)].join(`
`):`${n}: ${JSON.stringify(t)}`}var Ye=new Set;async function Tt(e,t,n){let r=ue(e,t),l=t??r?.sessionId,i=C(e,l);if(Ye.has(i)||ae(e,l).answer!==void 0||r?.result?.status==="answered")throw new Error("already answered");Ye.add(i);try{if(r?.args?.await&&r.result===void 0){let{status:d}=await rt("lantern.respond",{sessionId:l,callId:e,response:n});if(d==="settled"){fe(e,{answer:JSON.stringify(n)},l);return}}await at(l,vn(r?.args?.title??"",n)),fe(e,{answer:JSON.stringify(n)},l)}finally{Ye.delete(i)}}async function Lt(e,t){let{status:n}=await rt("lantern.dismiss",{sessionId:t,callId:e});return n==="settled"}async function Nt(e,t){let{url:n}=await rt("lantern.file",{sessionId:e,path:t});return new URL(n,document.baseURI).href}var z=require("react");var k=require("react");var E=require("react");var Me=`/*
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
`;var st="__lantern";function Rt(){let e="__lantern",n=document.getElementById("lantern-boot"),r=JSON.parse(n&&n.textContent||"{}"),l=location,i=document;function d(a){try{let s=new URL(String(a),l.href);if(l.protocol!=="http:"&&l.protocol!=="https:")return!1;let o=new URL("./",l.href);return(s.protocol==="http:"||s.protocol==="https:")&&s.href.indexOf(o.href)===0}catch{return!1}}let u=l.assign.bind(l),m=l.replace.bind(l),v={assign(a){d(a)&&u(a)},replace(a){d(a)&&m(a)},reload(){},toString(){return l.href},valueOf(){return l.href}};for(let a of["href","origin","protocol","host","hostname","port","pathname","search","hash"])Object.defineProperty(v,a,{configurable:!0,enumerable:!0,get(){return l[a]},set(s){a==="href"&&d(s)&&u(s)}});let h=new Proxy(window,{get(a,s){if(s==="location")return v;if(s==="document")return U;if(s==="top"||s==="parent"||s==="self"||s==="frames"||s==="globalThis")return h;let o=a[s];return typeof o=="function"?o.bind(a):o},set(a,s,o){return s==="location"?(d(String(o))&&u(String(o)),!0):(a[s]=o,!0)}});function S(a){return String(a).replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi,(s,o,p)=>{if(/\bsrc\s*=/i.test(o)||/\btype\s*=\s*["']?module/i.test(o)&&/(^|\n)\s*(import|export)\b/.test(p))return s;let y=`(function(__ltLoc,__ltWin,__ltDoc){const location=__ltLoc,window=__ltWin,top=window,parent=window,self=window,globalThis=window,frames=window,document=__ltDoc;
${p}
}).call(globalThis.__ltWin,globalThis.__ltLoc,globalThis.__ltWin,globalThis.__ltDoc)`;return`<script${o}>${y}<\/script>`})}let U=new Proxy(i,{get(a,s){if(s==="location")return v;if(s==="defaultView")return h;let o=a[s];if((s==="write"||s==="writeln")&&typeof o=="function"){let p=o;return y=>p.call(a,S(y))}return typeof o=="function"?o.bind(a):o},set(a,s,o){return s==="location"?(d(String(o))&&u(String(o)),!0):(a[s]=o,!0)}});window.__ltLoc=v,window.__ltWin=h,window.__ltDoc=U;try{let a=Object.getOwnPropertyDescriptor(Node.prototype,"ownerDocument");a&&a.configurable&&Object.defineProperty(Node.prototype,"ownerDocument",{configurable:!0,get(){return U}})}catch{}try{let a=Object.getOwnPropertyDescriptor(Document.prototype,"defaultView");a&&a.configurable&&Object.defineProperty(Document.prototype,"defaultView",{configurable:!0,get(){return h}})}catch{}try{let a=window.navigation;a&&typeof a.addEventListener=="function"&&a.addEventListener("navigate",s=>{let o=!1;try{let p=new URL(String(s.destination&&s.destination.url||""));if(location.protocol==="http:"||location.protocol==="https:"){let y=new URL("./",location.href);o=(p.protocol==="http:"||p.protocol==="https:")&&p.href.indexOf(y.href)===0}}catch{o=!1}!o&&s.cancelable&&s.preventDefault()})}catch{}let M=r.state||"idle",V=r.response,I=r.scheme||"light",A=r.widgetState===void 0?null:r.widgetState,G=1,F={};function T(a){a[e]=1,parent.postMessage(a,"*")}function j(a,s){let o=G++;return new Promise((p,y)=>{F[o]={resolve:p,reject:y};let q={type:a,id:o};for(let te of Object.keys(s))q[te]=s[te];T(q)})}function Y(a,s){let o;try{o=JSON.stringify(a===void 0?null:a)}catch{o=void 0}if(typeof o!="string")throw new TypeError("lantern."+s+": value is not JSON-serializable");if(o.length>65536)throw new RangeError("lantern."+s+": value is larger than 64 KB");return o}function O(a,s){window.dispatchEvent(new CustomEvent("lantern:"+a,{detail:s}))}function re(){document.documentElement.setAttribute("data-lt-state",M);let a=M==="answered"||M==="dismissed"||M==="closed";document.querySelectorAll('[data-lt-submit], form[data-lt-form] button:not([type="button"]), form[data-lt-form] input[type="submit"]').forEach(s=>{let o=s;a?(o.disabled=!0,o.setAttribute("data-lt-locked","")):o.hasAttribute("data-lt-locked")&&(o.disabled=!1,o.removeAttribute("data-lt-locked"))})}function Q(){let a=getComputedStyle(document.documentElement),s=[];for(let o=1;o<=8;o++)s.push(a.getPropertyValue("--lt-series-"+o).trim());return s}let P=!0,_={get id(){return r.id},get state(){return M},get response(){return V},get theme(){return I},get mode(){return r.mode},get visible(){return P},submit(a){try{return j("submit",{json:Y(a,"submit")})}catch(s){return Promise.reject(s)}},send(a){return typeof a!="string"||a.trim()===""?Promise.reject(new TypeError("lantern.send: text must be a non-empty string")):j("send",{text:a.slice(0,4e3)})},openLink(a){T({type:"open-link",url:String(a)})},expand(){T({type:"expand"})},getState(){return A},setState(a){A=a,T({type:"set-state",json:Y(a,"setState")})},colors:Q,on(a,s){let o=p=>s(p.detail);return window.addEventListener("lantern:"+a,o),()=>window.removeEventListener("lantern:"+a,o)}};Object.defineProperty(window,"lantern",{value:Object.freeze(_),configurable:!1,writable:!1,enumerable:!0}),window.addEventListener("message",a=>{if(a.source!==parent)return;let s=a.data;if(!(!s||s[e]!==1)){if(s.type==="reply"){let o=F[s.id];if(!o)return;delete F[s.id],s.ok?o.resolve(!0):o.reject(new Error(s.error||"lantern: request failed"))}else if(s.type==="state")M=s.state,V=s.response,re(),O("state",{state:M,response:V});else if(s.type==="theme"){I=s.scheme,document.documentElement.setAttribute("data-theme",I);let o=document.getElementById("lantern-theme");o&&(o.textContent=s.css),O("theme",{scheme:I})}else if(s.type==="partial"&&r.streaming){let o=document.getElementById("lantern-stream");o&&(o.innerHTML=s.html)}}});let g=document.documentElement,J=r.mode!=="panel"&&!r.streaming,Z=Number(r.maxHeight)>0?Number(r.maxHeight):2400;g.setAttribute("data-lt-mode",r.mode==="panel"?"panel":"inline");let f=-1,b=!1,L=-1,w=-1,N=0,B=!1,ie=0,Ee=!1;function Le(){let a=g.getBoundingClientRect();return Math.ceil(Math.max(a.height,document.body?document.body.scrollHeight:0))}function He(){if(b=!1,document.fullscreenElement)return;let a=Le(),s=window.innerHeight;if(J&&!ie&&w>0&&s!==w){let p=a>=s-1&&Math.abs(a-L-(s-w))<=1;N=p?N+1:0,p&&(B||N>=3)&&(ie=Math.round(Math.min(540,Math.max(320,window.innerWidth*.62)))),B=!1}L=a,w=s;let o=ie||a;!ie&&!Ee&&o<=s||(g.toggleAttribute("data-lt-overflow",r.mode!=="panel"&&o>Z),!(Math.abs(o-f)<2)&&(f=o,T({type:"resize",height:o})))}function W(){b||(b=!0,requestAnimationFrame(He))}function be(){if(!J||ie||B||document.fullscreenElement||!document.body)return;let a=window.innerHeight;Math.abs(Le()-a)>1||!Array.from(document.body.children).some(o=>Math.abs(o.offsetHeight-a)<=1)||(B=!0,f=a+2,T({type:"resize",height:f}),setTimeout(()=>{B=!1},1e3))}typeof ResizeObserver=="function"&&new ResizeObserver(W).observe(g),window.addEventListener("resize",W),window.addEventListener("load",()=>{W(),setTimeout(be,300),setTimeout(be,1500)}),document.addEventListener("fullscreenchange",()=>{N=0,w=-1,W()});let he=!0;function ne(){let a=he&&document.visibilityState!=="hidden";a!==P&&(P=a,O("visibility",P))}if(typeof IntersectionObserver=="function"&&new IntersectionObserver(a=>{let s=a[a.length-1];s&&(he=s.isIntersecting,ne())}).observe(g),document.addEventListener("visibilitychange",ne),J){let a=EventTarget.prototype.addEventListener,s=new WeakSet;EventTarget.prototype.addEventListener=function(y,q,te){return(y==="wheel"||y==="mousewheel"||y==="DOMMouseScroll")&&s.add(this),a.call(this,y,q,te)};let o=!1,p=0;a.call(window,"pointerdown",()=>{o=!0},!0),a.call(window,"blur",()=>{o=!1}),a.call(document,"mouseout",y=>{y.relatedTarget||(o=!1)},!0),a.call(window,"wheel",y=>{let q=y;if(o||q.ctrlKey||q.metaKey||document.fullscreenElement||!q.composedPath().some(ye=>s.has(ye)||typeof ye.onwheel=="function"))return;q.stopImmediatePropagation();let de=Date.now();de-p>2500&&(p=de,T({type:"hint",kind:"wheel"}))},{capture:!0,passive:!0})}window.addEventListener("webglcontextlost",a=>{a.target.isConnected&&T({type:"gl",lost:!0})},!0),window.addEventListener("webglcontextrestored",()=>T({type:"gl",lost:!1}),!0);function ee(a){if(a===null||a==="")return null;try{return JSON.parse(a)}catch{return a}}function Te(a){let s={};return new FormData(a).forEach((o,p)=>{let y=typeof o=="string"?o:o.name;p in s?s[p]=[].concat(s[p],y):s[p]=y}),a.querySelectorAll('input[type="checkbox"][name]').forEach(o=>{let p=o;!(p.name in s)&&!a.querySelector('input[type="checkbox"][name="'+p.name+'"][value]:not([value="on"])')?s[p.name]=!1:s[p.name]==="on"&&(s[p.name]=!0)}),s}function le(a){let s=[];return a.querySelectorAll("[data-lt-choice]").forEach(o=>{o.getAttribute("aria-pressed")==="true"&&s.push(ee(o.getAttribute("data-lt-choice")))}),a.hasAttribute("data-lt-multi")?s:s.length?s[0]:null}function $(a){let s=a.closest("form");if(s)return Te(s);let o=a.parentElement;for(;o&&o!==document.body;){let y=o.querySelector("[data-lt-choices]");if(y)return le(y);o=o.parentElement}let p=document.querySelector("[data-lt-choices]");return p?le(p):null}function H(a,s){let o=a.parentElement&&a.parentElement.querySelector(".lt-error[data-lt-auto]");!o&&a.parentElement&&(o=document.createElement("div"),o.className="lt-error",o.setAttribute("data-lt-auto",""),a.parentElement.appendChild(o)),o&&(o.textContent=s)}function tn(){let a=String(r.lang||navigator.language||"en").toLowerCase();return a.startsWith("ja")?"\u9078\u3093\u3067\u304B\u3089\u9001\u3063\u3066\u304F\u3060\u3055\u3044\u3002":a.startsWith("zh")?"\u8BF7\u5148\u9009\u62E9\u518D\u63D0\u4EA4\u3002":"Pick an option first."}function nn(a){return a===null||a===""||Array.isArray(a)&&a.length===0}document.addEventListener("click",a=>{let s=a.target;if(!s||!s.closest)return;let o=s.closest("[data-lt-choice]");if(o){let x=o.closest("[data-lt-choices]"),K=!!x&&x.hasAttribute("data-lt-multi"),D=o.getAttribute("aria-pressed")==="true";if(x&&!K&&x.querySelectorAll("[data-lt-choice]").forEach(we=>we.setAttribute("aria-pressed","false")),o.setAttribute("aria-pressed",K?String(!D):"true"),x){O("select",le(x));let we=x.parentElement&&x.parentElement.querySelector(".lt-error[data-lt-auto]");we&&(we.textContent="")}x&&x.hasAttribute("data-lt-instant")&&!K&&_.submit(le(x)).catch(()=>{});return}let p=s.closest("[data-lt-submit]");if(p&&!p.disabled){a.preventDefault();let x=p.getAttribute("data-lt-submit"),K=x?ee(x):$(p);if(!x&&nn(K)){H(p,p.getAttribute("data-lt-empty")||tn());return}H(p,""),_.submit(K).catch(D=>H(p,D.message));return}let y=s.closest("[data-lt-send]");if(y){a.preventDefault(),_.send(y.getAttribute("data-lt-send")||"").catch(()=>{});return}if(s.closest("[data-lt-expand]")){a.preventDefault(),_.expand();return}if(s.closest("[data-lt-fullscreen]")){a.preventDefault(),(document.fullscreenElement?document.exitFullscreen():g.requestFullscreen()).catch(()=>{});return}let de=s.closest('[role="tablist"] > [data-tab]');if(de){let x=de.closest("[data-lt-tabs]");if(x){let K=de.getAttribute("data-tab");x.querySelectorAll('[role="tablist"] > [data-tab]').forEach(D=>D.setAttribute("aria-selected",String(D===de))),x.querySelectorAll("[data-tab-panel]").forEach(D=>{D.getAttribute("data-tab-panel")===K?D.removeAttribute("data-lt-hidden"):D.setAttribute("data-lt-hidden","")})}return}let ye=s.closest("[data-lt-next],[data-lt-prev]");if(ye){let x=ye.closest("[data-lt-steps]");x&&ft(x,Number(x.getAttribute("data-index")||0)+(ye.hasAttribute("data-lt-next")?1:-1));return}let ce=s.closest("a[href]");if(ce&&!a.defaultPrevented){let x=ce.getAttribute("href")||"";if(ce.hasAttribute("download")&&/^(blob|data):/i.test(ce.href))return;if(x.startsWith("#")){a.preventDefault();let D=document.getElementById(decodeURIComponent(x.slice(1)));D&&D.scrollIntoView({behavior:"smooth"});return}let K=!1;try{if(location.protocol==="http:"||location.protocol==="https:"){let D=new URL(ce.href),we=new URL("./",location.href);K=D.href.indexOf(we.href)===0}}catch{K=!1}if(K)return;a.preventDefault(),/^https?:\/\//i.test(ce.href)&&_.openLink(ce.href)}},!1),document.addEventListener("submit",a=>{let s=a.target;if(!(!s||!s.hasAttribute("data-lt-form"))){if(a.preventDefault(),!s.checkValidity()){s.reportValidity();return}_.submit(Te(s)).catch(o=>H(s.lastElementChild||s,o.message))}});function ft(a,s){let o=a.querySelectorAll("[data-step]");if(o.length===0)return;let p=(s+o.length)%o.length;a.setAttribute("data-index",String(p)),o.forEach((q,te)=>{te===p?q.removeAttribute("data-lt-hidden"):q.setAttribute("data-lt-hidden","")});let y=a.querySelector("[data-lt-dots]");y&&(y.innerHTML=Array.from(o).map((q,te)=>'<i class="'+(te===p?"on":"")+'"></i>').join("")),O("step",p)}function gt(){document.documentElement.setAttribute("data-theme",I),re(),document.querySelectorAll("[data-lt-tabs]").forEach(a=>{let s=a.querySelector('[role="tablist"] > [data-tab][aria-selected="true"]')||a.querySelector('[role="tablist"] > [data-tab]');s&&s.click()}),document.querySelectorAll("[data-lt-steps]").forEach(a=>ft(a,0)),M==="answered"&&V!==void 0&&document.querySelectorAll("[data-lt-choices]").forEach(a=>{let s=[].concat(V);a.querySelectorAll("[data-lt-choice]").forEach(o=>{let p=ee(o.getAttribute("data-lt-choice"));s.some(y=>JSON.stringify(y)===JSON.stringify(p))&&o.setAttribute("aria-pressed","true")})}),typeof ResizeObserver=="function"&&document.body&&new ResizeObserver(W).observe(document.body),Ee=!0,W(),T({type:"ready"})}let mt=0;window.addEventListener("error",a=>{/^ResizeObserver loop/.test(String(a.message))||mt++<3&&T({type:"error",message:String(a.message||"Script error")})}),window.addEventListener("unhandledrejection",a=>{mt++<3&&T({type:"error",message:String(a.reason&&a.reason.message||a.reason||"Unhandled rejection")})}),document.readyState==="loading"?document.addEventListener("DOMContentLoaded",gt):gt()}var kn="@layer lantern-kit, lantern-theme;",dr=Me.slice(0,Math.max(0,Me.indexOf("/* Base */"))),Sn="body{padding:var(--lt-pad,16px)}";function En(e){return JSON.stringify(e===void 0?null:e).replace(/</g,"\\u003c").replace(/>/g,"\\u003e").replace(/&/g,"\\u0026").replace(/\u2028/g,"\\u2028").replace(/\u2029/g,"\\u2029")}function It(e){let t=Object.entries(e).filter(([n,r])=>/^--lt-[a-z0-9-]+$/.test(n)&&r!==""&&!/[;{}<]/.test(r)).map(([n,r])=>`${n}:${r}`).join(";");return t===""?"":`@layer lantern-theme{:root{${t}}}`}var Tn=`(${Rt.toString()})();`;function At(e){return["default-src 'none'",e?`script-src 'nonce-${e}'`:"script-src 'unsafe-inline' data: blob:","style-src 'unsafe-inline' data: blob:","img-src data: blob:","font-src data: blob:","connect-src data: blob:","media-src data: blob:","worker-src 'none'","frame-src 'none'","object-src 'none'","form-action 'none'","base-uri 'none'","navigate-to 'none'"].join("; ")}var cr=At();function Ln(e,t){let n=e.streaming?Array.from(crypto.getRandomValues(new Uint8Array(16)),l=>l.toString(16).padStart(2,"0")).join(""):void 0;return`<meta http-equiv="Content-Security-Policy" content="${At(n)}"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><script type="application/json" id="lantern-boot">${En(e)}<\/script><script${n?` nonce="${n}"`:""}>${Tn.replace(/<\/script/gi,"<\\/script")}<\/script><style id="lantern-kit">${kn}@layer lantern-kit{${Me}${Sn}}</style><style id="lantern-theme">${t}</style>`}function Nn(e){return e.replace(/<!--[\s\S]*?(-->|$)/g,t=>" ".repeat(t.length)).replace(/(<script\b[^>]*>)([\s\S]*?)(<\/script>|$)/gi,(t,n,r,l)=>n+" ".repeat(r.length)+l)}function Pe(e,t){let n=new RegExp(`<${t}(\\s[^>]*)?>`,"i").exec(Nn(e));if(!n)return null;let r=[e.slice(n.index,n.index+n[0].length)];return r.index=n.index,r}function Rn(e,t){let n=Pe(e,"head");if(n)return e.slice(0,n.index+n[0].length)+t+e.slice(n.index+n[0].length);let r=Pe(e,"html");if(r)return e.slice(0,r.index+r[0].length)+`<head>${t}</head>`+e.slice(r.index+r[0].length);let l=/^\s*<!doctype[^>]*>/i.exec(e);return l?l[0]+t+e.slice(l[0].length):t+e}var Ot=/^\s*(?:<!--[\s\S]*?-->\s*)*(?:<!doctype[^>]*>|<html[\s>])/i;function In(e){return e.replace(/<meta\b[^>]*>/gi,n=>/http-equiv\s*=\s*["']?\s*refresh/i.test(n)?"":n).replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi,(n,r,l)=>{let i=/\btype\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/i.exec(r),d=(i?.[1]||i?.[2]||i?.[3]||"").trim().toLowerCase();if(d!==""&&d!=="text/javascript"&&d!=="application/javascript"&&d!=="module"||/\bsrc\s*=/i.test(r)||d==="module"&&/(^|\n)\s*(import|export)\b/.test(l))return n;let u=d==="module"&&i?r.replace(i[0],'type="text/javascript"'):r,m=`(function(__ltLoc,__ltWin,__ltDoc){const location=__ltLoc,window=__ltWin,top=window,parent=window,self=window,globalThis=window,frames=window,document=__ltDoc;
${l}
}).call(globalThis.__ltWin,globalThis.__ltLoc,globalThis.__ltWin,globalThis.__ltDoc)`;return`<script${u}>${m.replace(/<\/script/gi,"<\\/script")}<\/script>`})}function Ct(e,t,n){let r=Ln(t,n),l=t.scheme==="dark"?"dark":"light";if(t.streaming)return`<!doctype html><html data-theme="${l}"><head>${r}</head><body><div id="lantern-stream"></div></body></html>`;let i=In(e);return Ot.test(i)&&(Pe(i,"head")||Pe(i,"html"))?Rn(i,r):`<!doctype html><html data-theme="${l}"><head>${r}</head><body>${i}</body></html>`}function _e(e){let t=e,n=t.lastIndexOf("<");n>t.lastIndexOf(">")&&(t=t.slice(0,n)),t=t.replace(/<script[\s\S]*?(<\/script>|$)/gi,"").replace(/<\/?(?:iframe|object|embed|frame|frameset|meta|base|link|portal)\b[^>]*>/gi,"").replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi,"").replace(/(href|src|action|formaction|xlink:href)\s*=\s*("\s*javascript:[^"]*"|'\s*javascript:[^']*'|javascript:[^\s>]+)/gi,'$1=""');let r=/<body[^>]*>/i.exec(t);if(r)t=(t.slice(0,r.index).match(/<style[\s\S]*?<\/style>/gi)??[]).join("")+t.slice(r.index+r[0].length);else if(Ot.test(t))return(t.match(/<style[\s\S]*?<\/style>/gi)??[]).join("");return t}var An=[["--lt-bg",["--dsw-alias-bg-base"]],["--lt-surface",["--dsw-alias-bg-layer-1"]],["--lt-surface-2",["--dsw-alias-bg-layer-2"]],["--lt-fg",["--dsw-alias-label-primary"]],["--lt-fg-2",["--dsw-alias-label-secondary"]],["--lt-fg-3",["--dsw-alias-label-tertiary"]],["--lt-border",["--dsw-alias-border-l1"]],["--lt-border-strong",["--dsw-alias-border-l2"]],["--lt-accent",["--dsw-alias-brand-primary"]],["--lt-success",["--dsw-alias-state-success-primary"]],["--lt-warning",["--dsw-alias-state-warn-primary"]],["--lt-danger",["--dsw-alias-state-error-primary"]]],On=[["--lt-accent-soft","--lt-accent",14],["--lt-success-soft","--lt-success",14],["--lt-warning-soft","--lt-warning",16],["--lt-danger-soft","--lt-danger",13]];function ot(e,t){for(let n of t){let r=e.getPropertyValue(n).trim();if(r!=="")return r}return""}var se;function lt(e){return se||(se=document.createElement("span"),se.style.display="none"),se.isConnected||document.body.appendChild(se),se.style.color="",se.style.color=e,getComputedStyle(se).color}function Cn(e,t){return e===t||lt(e)===lt(t)}function Mn(e){let t=/rgba?\(([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)/.exec(lt(e));if(!t)return 0;let[n,r,l]=[t[1],t[2],t[3]].map(i=>{let d=Number(i)/255;return d<=.03928?d/12.92:((d+.055)/1.055)**2.4});return .2126*n+.7152*r+.0722*l}function Mt(){let e=document.body,t=e?.hasAttribute("data-ds-dark-theme")||!e&&document.documentElement.style.colorScheme==="dark"?"dark":"light";if(!e)return{scheme:t,css:""};let n=getComputedStyle(e),r={};for(let[v,h]of An){let S=ot(n,h);S!==""&&(r[v]=S)}let l=r["--lt-bg"],i=r["--lt-fg"];if(l!==void 0&&i!==void 0){let v=h=>h===void 0||Cn(h,l);v(r["--lt-surface"])&&(r["--lt-surface"]=`color-mix(in srgb, ${i} 4%, ${l})`),(v(r["--lt-surface-2"])||r["--lt-surface-2"]===r["--lt-surface"])&&(r["--lt-surface-2"]=`color-mix(in srgb, ${i} 8%, ${l})`)}for(let[v,h,S]of On){let U=r[h];U!==void 0&&(r[v]=`color-mix(in srgb, ${U} ${S}%, transparent)`)}let d=r["--lt-accent"];d!==void 0&&(r["--lt-accent-fg"]=Mn(d)>.55?"#111111":"#ffffff");let u=ot(n,["--dsh-font-family-text","--dsw-font-family"]);u!==""&&(r["--lt-font-sans"]=`${u}, system-ui, "Hiragino Sans", "Noto Sans JP", "Noto Sans CJK JP", sans-serif`);let m=ot(n,["--dsh-font-family-code","--ds-font-family-code"]);return m!==""&&(r["--lt-font-mono"]=`${m}, ui-monospace, Menlo, Consolas, monospace`),{scheme:t,css:It(r)}}var ge,$e=new Set,ke,je,dt=!1;function Pn(){dt=!1;let e=Mt();if(!(ge&&e.scheme===ge.scheme&&e.css===ge.css)){ge=e;for(let t of $e)t(e)}}function it(){dt||(dt=!0,requestAnimationFrame(Pn))}function De(){return ge===void 0&&(ge=Mt()),ge}function Pt(e){return $e.add(e),ke===void 0&&typeof MutationObserver=="function"&&(ke=new MutationObserver(it),document.body&&ke.observe(document.body,{attributes:!0,attributeFilter:["data-ds-dark-theme","style","class"]}),ke.observe(document.documentElement,{attributes:!0,attributeFilter:["style","data-ds-theme-source","lang","class"]}),je=window.matchMedia?.("(prefers-color-scheme: dark)"),je?.addEventListener?.("change",it)),()=>{$e.delete(e),$e.size===0&&(ke?.disconnect(),ke=void 0,je?.removeEventListener?.("change",it),je=void 0)}}var zt=require("react/jsx-runtime"),_n="allow-scripts allow-forms allow-downloads",_t=2400,jt=64*1024,jn=1500,$n=6,Dt=0,$t=!1;function Dn(){if($t)return;$t=!0;let e=()=>{Dt=performance.now()};window.addEventListener("pointerdown",e,!0),window.addEventListener("keydown",e,!0)}function ct(e,t){if(!e||document.activeElement!==e||t===0||Dt>t)return!1;let n=navigator.userActivation;return n?n.isActive:!1}function ut(e){let{callId:t,sessionId:n,mode:r,html:l,url:i,streaming:d=!1,paused:u=!1,state:m,response:v}=e,h=(0,E.useRef)(null),S=(0,E.useRef)(!1),[U,M]=(0,E.useState)(r==="inline"?u?220:120:0),V=(0,E.useRef)(e);V.current=e;let I=(0,E.useRef)(0),A=(0,E.useRef)(0),G=(0,E.useRef)(0),F=(0,E.useRef)(0),T=(0,E.useRef)(0),j=(0,E.useRef)(!1);(0,E.useEffect)(()=>{Dn();let g=()=>{document.activeElement===h.current&&(F.current=performance.now())};return window.addEventListener("blur",g),()=>window.removeEventListener("blur",g)},[]);let Y=(0,E.useRef)({state:m,response:v}),O=(0,E.useMemo)(()=>{if(l===void 0)return;let g=ae(t,n),J=null;if(g.state!==void 0)try{J=JSON.parse(g.state)}catch{J=null}let Z=De(),f=d&&!u,b={id:t,state:Y.current.state,response:Y.current.response??null,scheme:Z.scheme,mode:r,widgetState:J,streaming:f,lang:Ne(),...r==="inline"?{maxHeight:V.current.maxHeight??_t}:{}},L=f?"":u?_e(l):l;return Ct(L,b,Z.css)},[l,d,u,t,n,r]),re=(0,E.useMemo)(()=>{if(i===void 0)return;let g=new URL(i);return g.searchParams.set("lt",t),g.searchParams.set("theme",De().scheme),g.searchParams.set("lang",Ne()),g.href},[i,t]),Q=g=>{h.current?.contentWindow?.postMessage({...g,[st]:1},"*")};(0,E.useEffect)(()=>{S.current=!1,T.current=0,j.current=!1;let g=J=>{let Z=h.current?.contentWindow;if(!Z||J.source!==Z)return;let f=J.data;if(!f||f[st]!==1||typeof f.type!="string"||j.current)return;let b=V.current,L=(w,N,B)=>{typeof w=="number"&&Q({type:"reply",id:w,ok:N,...B?{error:B}:{}})};switch(f.type){case"ready":{S.current=!0;let w=De();Q({type:"theme",css:w.css,scheme:w.scheme}),Q({type:"state",state:b.state,response:b.response??null}),b.streaming&&b.html!==void 0&&Q({type:"partial",html:_e(b.html)});return}case"resize":{if(b.mode!=="inline")return;let w=Number(f.height);Number.isFinite(w)&&M(Math.max(24,Math.min(Math.ceil(w),b.maxHeight??_t)));return}case"hint":b.mode==="inline"&&!b.streaming&&f.kind==="wheel"&&b.onWheelHint?.();return;case"gl":b.streaming||b.onGlLost?.(f.lost===!0);return;case"submit":case"send":{if(b.streaming){L(f.id,!1,"The visual is still being written.");return}if(!ct(h.current,F.current)){L(f.id,!1,"Only a user action inside the visual can do this.");return}let w=Date.now();if(w-I.current<400){L(f.id,!1,"Too fast.");return}if(f.type==="send"){if(w-A.current<jn||G.current>=$n){L(f.id,!1,"Too many messages from this visual.");return}A.current=w,G.current++}if(I.current=w,f.type==="submit"){if(typeof f.json!="string"||f.json.length>jt){L(f.id,!1,"The answer is too large.");return}if(b.state==="answered"||b.state==="dismissed"||b.state==="closed"){L(f.id,!1,"This visual is already settled.");return}let N;try{N=JSON.parse(f.json)}catch{L(f.id,!1,"The answer is not JSON.");return}b.onSubmit(N).then(()=>L(f.id,!0),B=>L(f.id,!1,B.message))}else{if(typeof f.text!="string"||f.text.trim()===""){L(f.id,!1,"Empty message.");return}b.onSend(f.text.slice(0,4e3)).then(()=>L(f.id,!0),N=>L(f.id,!1,N.message))}return}case"expand":{if(b.streaming||!ct(h.current,F.current))return;let w=Date.now();if(w-I.current<1e3)return;I.current=w,b.onExpand?.();return}case"open-link":{if(b.streaming||!ct(h.current,F.current)||typeof f.url!="string")return;let w=Date.now();if(w-I.current<1e3)return;I.current=w;let N;try{N=new URL(f.url)}catch{return}if(N.protocol!=="http:"&&N.protocol!=="https:")return;window.open(N.href,"_blank","noopener,noreferrer");return}case"set-state":!b.streaming&&typeof f.json=="string"&&f.json.length<=jt&&fe(b.callId,{state:f.json},b.sessionId);return;case"error":typeof f.message=="string"&&b.onError?.(f.message.slice(0,300));return}};return window.addEventListener("message",g),()=>window.removeEventListener("message",g)},[O,re]),(0,E.useEffect)(()=>{S.current&&Q({type:"state",state:m,response:v??null})},[m,JSON.stringify(v??null)]),(0,E.useEffect)(()=>Pt(g=>{S.current&&Q({type:"theme",css:g.css,scheme:g.scheme})}),[]);let P=(0,E.useRef)(void 0);(0,E.useEffect)(()=>{!d||l===void 0||P.current===void 0&&(P.current=window.setTimeout(()=>{P.current=void 0;let g=V.current;S.current&&g.html!==void 0&&Q({type:"partial",html:_e(g.html)})},120))},[d,l]),(0,E.useEffect)(()=>()=>{P.current!==void 0&&clearTimeout(P.current)},[]);let _=r==="inline"?{height:`${U}px`}:void 0;return(0,zt.jsx)("iframe",{ref:h,className:"lantern-frame","data-mode":r,title:t,sandbox:u?"allow-downloads":_n,"data-scripts":u?"off":"on",onLoad:()=>{T.current++,O!==void 0&&T.current>1&&(j.current=!0)},allow:"fullscreen; clipboard-write",referrerPolicy:"no-referrer",style:_,...O!==void 0?{srcDoc:O}:{src:re}})}function zn(e,t,n){return e==="preparing"?!0:e==="replay"||t===void 0?!1:t>=n}var Vn=1500;function Hn(e=setTimeout,t=clearTimeout){let n=new Map,r=new Set,l=()=>{for(let i of r)i()};return{observe(i,d){return n.has(i)?!1:(n.set(i,{run:d,mounts:0,armed:!1}),!0)},poke(){l()},enabled(i){let d=n.get(i);return d!==void 0&&(d.run||d.armed)},arm(i){let d=n.get(i)??{run:!1,mounts:0,armed:!1};d.run=!0,d.armed=!0,n.set(i,d),l()},retain(i){let d=n.get(i);d&&(d.timer!==void 0&&(t(d.timer),d.timer=void 0),d.mounts++)},release(i){let d=n.get(i);d&&(d.mounts=Math.max(0,d.mounts-1),!(d.mounts>0||d.timer!==void 0)&&(d.timer=e(()=>{d.timer=void 0,d.mounts===0&&(d.run=!1,d.armed=!1,l())},Vn)))},subscribe(i){return r.add(i),()=>r.delete(i)}}}var qn=Date.now(),me=Hn();function Vt(e,t,n){return me.observe(e,zn(t,n,qn))}function Ht(e){return me.enabled(e)}function qt(e){me.arm(e)}function Ft(e){me.retain(e)}function Jt(e){me.release(e)}function Bt(e){return me.subscribe(e)}function Wt(){me.poke()}var c=require("react/jsx-runtime");function oe({name:e}){return(0,c.jsx)("svg",{className:"lantern-icon",viewBox:"0 0 16 16",width:"14",height:"14",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:{visual:(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)("rect",{x:"2.5",y:"3",width:"11",height:"10",rx:"2"}),(0,c.jsx)("path",{d:"M5 10l2-2.5 1.6 1.8L10.5 7 12 10"})]}),sidebar:(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)("rect",{x:"2.5",y:"3",width:"11",height:"10",rx:"2"}),(0,c.jsx)("path",{d:"M9.5 3v10"})]}),chevron:(0,c.jsx)("path",{d:"M4.5 6.5L8 10l3.5-3.5"}),skip:(0,c.jsx)("path",{d:"M4.5 4.5l7 7M11.5 4.5l-7 7"}),arrow:(0,c.jsx)("path",{d:"M4 8h8M8.5 4.5L12 8l-3.5 3.5"})}[e]})}function Fn(e,t){document.querySelector(`[data-lantern-key="${CSS.escape(C(e,t))}"]`)?.scrollIntoView({behavior:"smooth",block:"center"})}function Jn(e){return(0,k.useSyncExternalStore)(Bt,()=>Ht(e),()=>!1)}function ze({record:e,sessionId:t,placement:n,phase:r,partialHtml:l}){let i=X(),d=e.callId,u=t??e.sessionId,m=C(d,u),v=Jn(m);(0,k.useEffect)(()=>(Ft(m),()=>Jt(m)),[m]);let h=(0,k.useCallback)(()=>qt(m),[m]),S=pe(()=>wt(d,u)),U=pe(()=>ae(d,u)),[M,V]=(0,k.useState)([]),[I,A]=(0,k.useState)(void 0),[G,F]=(0,k.useState)(!1),[T,j]=(0,k.useState)(!1),[Y,O]=(0,k.useState)(!1),[re,Q]=(0,k.useState)(0),P=(0,k.useRef)(void 0);(0,k.useEffect)(()=>()=>{P.current!==void 0&&clearTimeout(P.current)},[]);let _=e.args,{state:g,response:J}=e.error!==void 0?{state:"closed",response:void 0}:kt(e,r),Z=_?.title||i.visual,f=(e.result?.path??_?.path)!==void 0,b=_?.display??"inline",L=(0,k.useCallback)(async $=>{A(void 0);try{await Tt(d,u,$)}catch(H){throw A(`${i.sendFailed}: ${H.message}`),H}},[d,u]),w=(0,k.useCallback)(async $=>{A(void 0);try{await at(u,$)}catch(H){throw A(`${i.sendFailed}: ${H.message}`),H}},[u]),N=(0,k.useCallback)(()=>Ce(u,d),[u,d]),B=(0,k.useCallback)($=>V(H=>H.length>=3?H:[...H,$]),[]),ie=(0,k.useCallback)(()=>{j(!0),P.current!==void 0&&clearTimeout(P.current),P.current=window.setTimeout(()=>j(!1),2200)},[]),Ee=(0,k.useCallback)($=>O($),[]),Le=(0,k.useCallback)(()=>{O(!1),Q($=>$+1)},[]),He=(0,k.useCallback)(()=>{F(!0),Lt(d,u).then($=>{$||A(i.notWaiting)},$=>A(`${i.sendFailed}: ${$.message}`)).finally(()=>F(!1))},[d,u]),W=r==="preparing"?i.preparing:e.error!==void 0?i.error:g==="waiting"?i.waiting:g==="answered"?i.answered:g==="dismissed"?i.dismissed:g==="timeout"?i.timeout:void 0,be=g==="waiting"&&e.result===void 0&&r!=="preparing";if(S!==void 0&&n!=="panel")return(0,c.jsxs)("div",{className:"lantern-row","data-lantern-id":d,"data-lantern-key":m,"data-replaced":"",children:[(0,c.jsx)(oe,{name:"visual"}),(0,c.jsx)("span",{className:"lantern-row-title",children:Z}),(0,c.jsx)("span",{className:"lantern-muted",children:i.replaced}),(0,c.jsxs)("button",{type:"button",className:"lantern-link",onClick:()=>Fn(S,u),children:[i.showNew,(0,c.jsx)(oe,{name:"arrow"})]})]});let he=be?(0,c.jsxs)("button",{type:"button",className:"lantern-action",onClick:He,disabled:G,title:i.skip,children:[(0,c.jsx)(oe,{name:"skip"}),(0,c.jsx)("span",{children:i.skip})]}):null;if(n!=="panel"&&(b==="panel"||f))return(0,c.jsxs)("div",{className:"lantern-row","data-lantern-id":d,"data-lantern-key":m,"data-state":g,children:[(0,c.jsx)(oe,{name:"sidebar"}),(0,c.jsx)("span",{className:"lantern-row-title",children:Z}),W&&(0,c.jsx)("span",{className:"lantern-badge","data-state":g,children:W}),(0,c.jsx)("span",{className:"lantern-muted",children:be?i.answerInSidebar:i.shownInSidebar}),(0,c.jsx)("span",{className:"lantern-spacer"}),he,r!=="preparing"&&(0,c.jsxs)("button",{type:"button",className:"lantern-action",onClick:N,title:i.openSidebar,children:[(0,c.jsx)(oe,{name:"sidebar"}),(0,c.jsx)("span",{children:i.openSidebar})]}),e.error&&(0,c.jsx)("div",{className:"lantern-note","data-kind":"error",children:e.error})]});let ne=n!=="panel"&&U.collapsed===!0,ee=r!=="preparing"&&!v,Te=e.error!==void 0?(0,c.jsx)("div",{className:"lantern-note","data-kind":"error",children:e.error}):f?(0,c.jsx)(Bn,{record:e,sessionId:u,state:g,response:J,onSubmit:L,onSend:w,onError:B,onGlLost:Ee,paused:ee},re+(ee?":paused":":run")):_?.html!==void 0||l!==void 0?(0,c.jsx)(ut,{callId:d,sessionId:u,mode:n==="panel"?"panel":"inline",html:r==="preparing"?l??"":_?.html??"",streaming:r==="preparing",paused:ee,state:g,response:J,onSubmit:L,onSend:w,onExpand:n==="panel"?void 0:N,onError:B,onWheelHint:ie,onGlLost:Ee},(r==="preparing"?"stream":"full")+re+(ee?":paused":":run")):(0,c.jsx)("div",{className:"lantern-note",children:i.preparing}),le=(0,c.jsxs)(c.Fragment,{children:[ee&&e.error===void 0&&(_?.html!==void 0||f)&&(0,c.jsxs)("div",{className:"lantern-paused","data-kind":"hold",children:[(0,c.jsx)("span",{children:i.paused}),(0,c.jsx)("button",{type:"button",className:"lantern-action lantern-resume",onClick:h,children:i.run})]}),T&&!Y&&!ee&&(0,c.jsx)("div",{className:"lantern-hint",role:"status",children:i.wheelHint}),Y&&!ee&&(0,c.jsxs)("div",{className:"lantern-paused",children:[(0,c.jsx)("span",{children:i.glLost}),(0,c.jsx)("button",{type:"button",className:"lantern-action lantern-resume",onClick:Le,children:i.resume})]})]});return n==="panel"?(0,c.jsxs)("div",{className:"lantern-panel","data-lantern-panel":d,"data-state":g,children:[(be||I||M.length>0)&&(0,c.jsxs)("div",{className:"lantern-panel-bar",children:[W&&(0,c.jsx)("span",{className:"lantern-badge","data-state":g,children:W}),(0,c.jsx)("span",{className:"lantern-spacer"}),he]}),(0,c.jsx)(Ut,{notice:I,errors:M}),(0,c.jsxs)("div",{className:"lantern-panel-body",children:[Te,le]})]}):(0,c.jsxs)("div",{className:"lantern-card","data-lantern-id":d,"data-lantern-key":m,"data-state":g,"data-placement":n,children:[(0,c.jsxs)("div",{className:"lantern-head",children:[(0,c.jsx)(oe,{name:"visual"}),(0,c.jsx)("span",{className:"lantern-title",children:Z}),W&&(0,c.jsx)("span",{className:"lantern-badge","data-state":g,children:W}),(0,c.jsx)("span",{className:"lantern-spacer"}),he,r!=="preparing"&&(0,c.jsx)("button",{type:"button",className:"lantern-action icon",onClick:N,title:i.openSidebar,"aria-label":i.openSidebar,children:(0,c.jsx)(oe,{name:"sidebar"})}),(0,c.jsx)("button",{type:"button",className:"lantern-action icon","data-collapsed":ne?"":void 0,onClick:()=>fe(d,{collapsed:!ne},u),title:ne?i.expand:i.collapse,"aria-label":ne?i.expand:i.collapse,"aria-expanded":!ne,children:(0,c.jsx)(oe,{name:"chevron"})})]}),(0,c.jsxs)("div",{className:"lantern-body",hidden:ne,children:[Te,le]}),(0,c.jsx)(Ut,{notice:I,errors:M})]})}function Ut({notice:e,errors:t}){let n=X();return!e&&t.length===0?null:(0,c.jsxs)("div",{className:"lantern-notes",children:[e&&(0,c.jsx)("div",{className:"lantern-note","data-kind":"error",children:e}),t.map((r,l)=>(0,c.jsxs)("div",{className:"lantern-note","data-kind":"warn",children:[n.scriptError,": ",r]},l))]})}function Bn(e){let t=X(),n=e.record.result?.path??e.record.args?.path,[r,l]=(0,k.useState)(void 0),[i,d]=(0,k.useState)(void 0);return(0,k.useEffect)(()=>{if(!n||!e.sessionId)return;let u=!0;return d(void 0),Nt(e.sessionId,n).then(m=>{u&&l(m)},m=>{u&&d(m.message)}),()=>{u=!1}},[n,e.sessionId]),i?(0,c.jsxs)("div",{className:"lantern-note","data-kind":"error",children:[t.fileError,": ",i]}):r?(0,c.jsx)(ut,{callId:e.record.callId,sessionId:e.sessionId,mode:"panel",url:r,paused:e.paused,state:e.state,response:e.response,onSubmit:e.onSubmit,onSend:e.onSend,onError:e.onError,onGlLost:e.onGlLost}):(0,c.jsx)("div",{className:"lantern-note",children:t.loading})}var R=require("react/jsx-runtime"),Se="show_visual",Ve="lanternVisuals";function pt(e){return Array.isArray(e)?e.map(t=>t&&typeof t=="object"&&t.type==="text"?String(t.text??""):"").join(`
`).trim():""}var Kt={kind:Ve,match:e=>e.type==="turn/start"?{id:String(e.data.turn),role:"start"}:e.type==="tool/call"&&e.data.name===Se?{id:String(e.data.turn),role:"update"}:e.type==="tool/result"?{id:String(e.data.turn),role:"update"}:null,start:(e,t)=>({turn:Number(t.event.data.turn),calls:[]}),update:(e,t)=>{let n=e.state,r=t.event;if(r.type==="tool/call"){let l=String(r.data.callId);return n.calls.some(i=>i.callId===l)?n:{...n,calls:[...n.calls,{callId:l,seq:r.seq,argsRaw:String(r.data.arguments??""),settled:!1,isError:!1}]}}if(r.type==="tool/result"){let l=String(r.data.message?.source?.callId??r.data.message?.toolCallId??""),i=n.calls.findIndex(v=>v.callId===l);if(i<0)return n;let d=r.data.message?.isError===!0,u={...n.calls[i],settled:!0,isError:d,meta:r.data.meta,...d?{errorText:pt(r.data.message?.content)||String(r.data.error?.code??"error")}:{}},m=n.calls.slice();return m[i]=u,{...n,calls:m}}return n},buildLocationData:(e,t,n)=>t!=="turn"||e.state===void 0||e.state.calls.length===0?null:n?.kind==="turn"&&n.turn===e.state.turn&&n.key===Ve&&n.value===e.state.calls?n:{kind:"turn",turn:e.state.turn,key:Ve,value:e.state.calls}};function Xt(e,t){return{sessionId:t,seq:e.seq,args:Ue(e.argsRaw),result:e.settled&&!e.isError?Ge(e.meta):void 0,error:e.isError?e.errorText??"error":void 0}}var Gt=new Set;function Wn(e){if(!e?.has||!e.has("title"))return;let t={};for(let n of["title","html","path","display","replace"])e.has(n)&&(t[n]=e.text(n));return e.has("await_response")&&(t.await_response=e.value?.("await_response")===!0),JSON.stringify(t)}function Yt(e){let{phase:t,block:n,callId:r,sessionId:l}=e,i=C(r,l),d=typeof n.time=="number"?n.time:typeof n.callTime=="number"?n.callTime:void 0,u=Vt(i,t,d);(0,z.useEffect)(()=>{u&&Wt()},[u,i]);let m=t==="start"?n.argsRaw:t==="result"?n.call?.argsRaw??void 0:void 0,v=(0,z.useMemo)(()=>m===void 0&&t==="result"?Wn(n.args):void 0,[m,t,n.args]),h=(0,z.useMemo)(()=>Ue(m??v),[m,v]),S=t==="preparing"?n.args:void 0,U=S?.has("title")?S.text("title"):"",M=S?.has("html")?S.text("html"):void 0,V=S?.has("path")||S?.has("display")&&S.text("display")==="panel",I=t==="result"&&n.isError===!0,A=I?pt(n.content)||String(n.error?.code??"error"):void 0,G=t==="result"&&!I?Ge(n.meta):void 0;(0,z.useEffect)(()=>{Ke(r,{sessionId:l,...h?{args:h}:{},...G?{result:G}:{},...A?{error:A}:{},...typeof n.seq=="number"?{seq:n.seq}:{}})},[r,l,h,G?.status,G?.response,A]);let F=(0,z.useRef)(t!=="result");(0,z.useEffect)(()=>{t!=="preparing"&&F.current&&h?.display==="panel"&&!A&&!Gt.has(i)&&(Gt.add(i),queueMicrotask(()=>Ce(l,r)))},[t,h?.display,A,i,l]);let T=pe(()=>xt(r,l)),j=pe(()=>ue(r,l)),Y=X(),O={...j,callId:r,sessionId:l??j?.sessionId,args:h??j?.args??(t==="preparing"?{title:U,display:V?"panel":"inline",await:!1}:void 0),result:G??j?.result,error:A??j?.error};return T?(0,R.jsxs)("div",{className:"lantern-row lantern-row-quiet","data-tool":Se,children:[(0,R.jsx)("span",{className:"lantern-row-title",children:O.args?.title||Y.visual}),(0,R.jsx)("span",{className:"lantern-muted",children:Y.shownBelow})]}):t==="result"&&O.args===void 0&&!O.error?(0,R.jsx)("div",{className:"lantern-row lantern-row-quiet","data-tool":Se,children:(0,R.jsx)("span",{className:"lantern-muted",children:pt(n.content)})}):(0,R.jsx)("div",{className:"lantern-tool","data-tool":Se,children:(0,R.jsx)(ze,{record:O,sessionId:l,placement:"tool",phase:t,partialHtml:M},i)})}function Qt(e){let t=e.turn.data.get(Ve)??[],n=t.filter(r=>r.seq<e.seq);return(0,z.useEffect)(()=>{for(let r of t)Ke(r.callId,Xt(r,e.sessionId))},[t,e.sessionId]),n.length===0?null:(0,R.jsx)("div",{className:"lantern-tail",children:n.map(r=>(0,R.jsx)(Un,{item:r,sessionId:e.sessionId},C(r.callId,e.sessionId)))})}function Un({item:e,sessionId:t}){(0,z.useEffect)(()=>vt(e.callId,t),[e.callId,t]);let n={callId:e.callId,...Xt(e,t)};if(e.isError){let r=X();return(0,R.jsxs)("div",{className:"lantern-card","data-lantern-id":e.callId,"data-state":"error",children:[(0,R.jsxs)("div",{className:"lantern-head",children:[(0,R.jsx)("span",{className:"lantern-title",children:n.args?.title||r.error}),(0,R.jsx)("span",{className:"lantern-badge","data-state":"closed",children:r.error})]}),(0,R.jsx)("div",{className:"lantern-note","data-kind":"error",children:e.errorText||r.error})]})}return n.args===void 0?null:(0,R.jsx)(ze,{record:n,sessionId:t,placement:"tail",phase:e.settled?"result":"replay"})}function Zt(e){let{tab:t}=e.useTabInfo(),n=nt(t.navigation.address),r=pe(()=>n?ue(n.callId,n.sessionId):void 0),l=(0,z.useRef)(null),[i,d]=(0,z.useState)(!1);(0,z.useEffect)(()=>{let v=l.current;if(!v)return;let h=()=>d(v.getClientRects().length>0&&v.offsetWidth>0);h();let S=new ResizeObserver(h);return S.observe(v),()=>S.disconnect()},[]);let u=X(),m;return!n||!r?.args?m=(0,R.jsx)("div",{className:"lantern-empty",children:u.missing}):i&&(m=(0,R.jsx)(ze,{record:r,sessionId:n.sessionId,placement:"panel",phase:r.result?"result":"start"},C(n.callId,n.sessionId))),(0,R.jsx)("div",{ref:l,className:"lantern-tab",children:m})}function en(e){let t=nt(e);return(t?ue(t.callId,t.sessionId):void 0)?.args?.title||X().visual}var Gn="dsh-lantern",Kn=["slots","uiConversation","sidebarRight","sidebarRightTabs","sessions"];function Xn(e){let t=e;Et({sidebarRight:t.sidebarRight,sessions:t.sessions}),t.effect(()=>{let n=document.createElement("style");return n.id="dsh-lantern-style",n.textContent=bt,document.head.appendChild(n),()=>n.remove()},"dsh-lantern: styles"),t.effect(()=>t.uiConversation.events.register(Kt),"dsh-lantern: turn data"),t.slots.inject("tool.call.toolview",()=>t.slots.register({name:"tool.call.toolview",key:Se},Yt)),t.slots.inject("conversation.chat.turnTail",()=>t.slots.register({name:"conversation.chat.turnTail",id:"dsh-lantern"},Qt)),t.effect(()=>t.sidebarRightTabs.register({id:et,kind:tt,patterns:["dsh-resource://lantern-visual/**"],keepMounted:!0,title:en}),"dsh-lantern: sidebar tab type"),t.effect(()=>t.slots.inject("sidebar.right.pane.tab",()=>t.slots.register({name:"sidebar.right.pane.tab",key:et},Zt)),"dsh-lantern: sidebar tab body")}

return module.exports;}});
