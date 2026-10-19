window.__ModuleLoader__.load({id:"dsh-lantern",factory(require){const module={exports:{}};const exports=module.exports;
"use strict";var Je=Object.defineProperty;var pn=Object.getOwnPropertyDescriptor;var fn=Object.getOwnPropertyNames;var gn=Object.prototype.hasOwnProperty;var mn=(e,t)=>{for(var n in t)Je(e,n,{get:t[n],enumerable:!0})},bn=(e,t,n,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let d of fn(t))!gn.call(e,d)&&d!==n&&Je(e,d,{get:()=>t[d],enumerable:!(r=pn(t,d))||r.enumerable});return e};var hn=e=>bn(Je({},"__esModule",{value:!0}),e);var or={};mn(or,{apply:()=>sr,inject:()=>ar,name:()=>rr});module.exports=hn(or);var vt=`/* Card chrome inside DSH Web. Uses DSH's own tokens so it follows every theme. */
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
.lantern-paused-warn { max-width: 36em; font-size: 12px; line-height: 1.45; }
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
`;var xt=require("react"),wn={visual:"\u30D3\u30B8\u30E5\u30A2\u30EB",waiting:"\u56DE\u7B54\u5F85\u3061",answered:"\u56DE\u7B54\u6E08\u307F",dismissed:"\u30B9\u30AD\u30C3\u30D7",timeout:"\u6642\u9593\u5207\u308C",closed:"\u7D42\u4E86",error:"\u30A8\u30E9\u30FC",preparing:"\u4F5C\u6210\u4E2D\u2026",skip:"\u30B9\u30AD\u30C3\u30D7",openSidebar:"\u30B5\u30A4\u30C9\u30D0\u30FC\u3067\u958B\u304F",collapse:"\u6298\u308A\u305F\u305F\u3080",expand:"\u5C55\u958B\u3059\u308B",shownBelow:"\u56DE\u7B54\u306E\u4E0B\u306B\u8868\u793A\u3057\u3066\u3044\u307E\u3059",shownInSidebar:"\u30B5\u30A4\u30C9\u30D0\u30FC\u306B\u8868\u793A\u3057\u3066\u3044\u307E\u3059",answerInSidebar:"\u30B5\u30A4\u30C9\u30D0\u30FC\u3067\u56DE\u7B54\u3057\u3066\u304F\u3060\u3055\u3044",replaced:"\u65B0\u3057\u3044\u7248\u306B\u66F4\u65B0\u3057\u307E\u3057\u305F",showNew:"\u65B0\u3057\u3044\u7248\u3078",scriptError:"\u30D3\u30B8\u30E5\u30A2\u30EB\u5185\u306E\u30B9\u30AF\u30EA\u30D7\u30C8\u3067\u30A8\u30E9\u30FC",sendFailed:"\u9001\u4FE1\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F",missing:"\u3053\u306E\u30D3\u30B8\u30E5\u30A2\u30EB\u306E\u5185\u5BB9\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\u3002\u30C1\u30E3\u30C3\u30C8\u304B\u3089\u958B\u304D\u76F4\u3057\u3066\u304F\u3060\u3055\u3044\u3002",loading:"\u8AAD\u307F\u8FBC\u307F\u4E2D\u2026",fileError:"\u30D5\u30A1\u30A4\u30EB\u3092\u958B\u3051\u307E\u305B\u3093\u3067\u3057\u305F",answerPrefix:"\u56DE\u7B54",notWaiting:"\u30A8\u30FC\u30B8\u30A7\u30F3\u30C8\u306F\u3082\u3046\u5F85\u3063\u3066\u3044\u307E\u305B\u3093",wheelHint:"\u30AF\u30EA\u30C3\u30AF\u3059\u308B\u3068\u30DB\u30A4\u30FC\u30EB\u3067\u64CD\u4F5C\u3067\u304D\u307E\u3059",glLost:"3D \u8868\u793A\u3092\u4E00\u6642\u505C\u6B62\u3057\u307E\u3057\u305F\uFF08\u540C\u6642\u306B\u52D5\u304B\u305B\u308B\u6570\u306E\u4E0A\u9650\uFF09",resume:"\u518D\u958B",run:"\u5B9F\u884C",paused:"\u505C\u6B62\u4E2D\u3067\u3059\u3002\u5B9F\u884C\u3059\u308B\u307E\u3067\u30B9\u30AF\u30EA\u30D7\u30C8\u306F\u52D5\u304D\u307E\u305B\u3093\u3002",leave:"\u30B9\u30AF\u30EA\u30D7\u30C8\u3092\u8A31\u53EF\u3057\u305F\u30AB\u30FC\u30C9\u306F\u3001\u81EA\u5206\u306E\u9077\u79FB\u3067\u30C7\u30FC\u30BF\u3092\u5916\u3078\u9001\u308C\u307E\u3059\u3002"},kt={visual:"Visual",waiting:"Waiting for you",answered:"Answered",dismissed:"Skipped",timeout:"Timed out",closed:"Closed",error:"Error",preparing:"Building\u2026",skip:"Skip",openSidebar:"Open in sidebar",collapse:"Collapse",expand:"Expand",shownBelow:"Shown below the answer",shownInSidebar:"Shown in the sidebar",answerInSidebar:"Answer it in the sidebar",replaced:"Updated to a newer version",showNew:"Go to the new version",scriptError:"A script in the visual failed",sendFailed:"Could not send",missing:"This visual is not loaded. Open it again from the chat.",loading:"Loading\u2026",fileError:"Could not open the file",answerPrefix:"Answer",notWaiting:"The agent is no longer waiting",wheelHint:"Click the visual to use the scroll wheel in it",glLost:"The 3D view was paused (too many running at once)",resume:"Resume",run:"Run",paused:"Paused. Scripts stay off until you run it.",leave:"A card with scripts allowed can send data out by navigating itself."},vn={visual:"\u53EF\u89C6\u5316",waiting:"\u7B49\u5F85\u56DE\u7B54",answered:"\u5DF2\u56DE\u7B54",dismissed:"\u5DF2\u8DF3\u8FC7",timeout:"\u5DF2\u8D85\u65F6",closed:"\u5DF2\u7ED3\u675F",error:"\u9519\u8BEF",preparing:"\u751F\u6210\u4E2D\u2026",skip:"\u8DF3\u8FC7",openSidebar:"\u5728\u4FA7\u8FB9\u680F\u6253\u5F00",collapse:"\u6536\u8D77",expand:"\u5C55\u5F00",shownBelow:"\u663E\u793A\u5728\u56DE\u7B54\u4E0B\u65B9",shownInSidebar:"\u663E\u793A\u5728\u4FA7\u8FB9\u680F",answerInSidebar:"\u8BF7\u5728\u4FA7\u8FB9\u680F\u4E2D\u56DE\u7B54",replaced:"\u5DF2\u66F4\u65B0\u4E3A\u65B0\u7248\u672C",showNew:"\u67E5\u770B\u65B0\u7248\u672C",scriptError:"\u53EF\u89C6\u5316\u4E2D\u7684\u811A\u672C\u51FA\u9519",sendFailed:"\u53D1\u9001\u5931\u8D25",missing:"\u672A\u52A0\u8F7D\u6B64\u53EF\u89C6\u5316\u5185\u5BB9\uFF0C\u8BF7\u4ECE\u5BF9\u8BDD\u4E2D\u91CD\u65B0\u6253\u5F00\u3002",loading:"\u52A0\u8F7D\u4E2D\u2026",fileError:"\u65E0\u6CD5\u6253\u5F00\u6587\u4EF6",answerPrefix:"\u56DE\u7B54",notWaiting:"\u667A\u80FD\u4F53\u5DF2\u4E0D\u518D\u7B49\u5F85",wheelHint:"\u70B9\u51FB\u540E\u5373\u53EF\u5728\u5176\u4E2D\u4F7F\u7528\u6EDA\u8F6E",glLost:"3D \u89C6\u56FE\u5DF2\u6682\u505C\uFF08\u540C\u65F6\u8FD0\u884C\u7684\u6570\u91CF\u5DF2\u8FBE\u4E0A\u9650\uFF09",resume:"\u7EE7\u7EED",run:"\u8FD0\u884C",paused:"\u5DF2\u6682\u505C\u3002\u70B9\u51FB\u8FD0\u884C\u524D\u4E0D\u4F1A\u6267\u884C\u811A\u672C\u3002",leave:"\u5141\u8BB8\u811A\u672C\u7684\u5361\u7247\u53EF\u4EE5\u901A\u8FC7\u81EA\u8EAB\u8DF3\u8F6C\u628A\u6570\u636E\u9001\u51FA\u53BB\u3002"};function xn(e){let t=e.toLowerCase();return t.startsWith("ja")?"ja":t.startsWith("zh")?"zh":"en"}function Ae(){return xn(typeof document<"u"?document.documentElement.lang:"")}function ve(){let e=Ae();return e==="ja"?wn:e==="zh"?vn:kt}var We=new Set,Be;function kn(){Be!==void 0||typeof document>"u"||(Be=new MutationObserver(()=>{for(let e of We)e()}),Be.observe(document.documentElement,{attributes:!0,attributeFilter:["lang"]}))}function Sn(e){return kn(),We.add(e),()=>We.delete(e)}function se(){return(0,xt.useSyncExternalStore)(Sn,ve,()=>kt)}var Et=require("react");function Ye(e){if(!e)return;let t;try{t=JSON.parse(e)}catch{return}if(typeof t!="object"||t===null)return;let n=t,r=typeof n.html=="string"&&n.html!==""?n.html:void 0,d=typeof n.path=="string"&&n.path!==""?n.path:void 0;return{title:typeof n.title=="string"&&n.title.trim()!==""?n.title.trim():"",...r!==void 0?{html:r}:{},...d!==void 0?{path:d}:{},display:d!==void 0||n.display==="panel"?"panel":"inline",await:n.await_response===!0,...typeof n.replace=="string"&&n.replace.trim()!==""?{replace:n.replace.trim()}:{}}}function Qe(e){if(typeof e!="object"||e===null)return;let t=e,n=t.status;if(!(n!=="shown"&&n!=="answered"&&n!=="dismissed"&&n!=="timeout"&&n!=="closed"))return{status:n,...typeof t.response=="string"?{response:t.response}:{},...typeof t.path=="string"?{path:t.path}:{}}}var Me=new Map,xe=new Map,Oe=0,Ke=new Set;function P(e,t){return JSON.stringify([t??"",e])}function En(){Oe++;for(let e of Ke)e()}function Tn(e){return Ke.add(e),()=>{Ke.delete(e)}}function Ze(e,t){let n=P(e,t.sessionId),r=Me.get(n),d=r===void 0;for(let[l,u]of Object.entries(t)){if(u===void 0)continue;let g=r?.[l];g!==u&&(typeof u=="object"&&JSON.stringify(g)===JSON.stringify(u)||(d=!0))}if(!d)return;let o={...r,callId:e};for(let[l,u]of Object.entries(t))u!==void 0&&(o[l]=u);Me.set(n,o),Pe()}var Ue=!1;function Pe(){Ue||(Ue=!0,queueMicrotask(()=>{Ue=!1,En()}))}function fe(e,t){return Me.get(P(e,t))}var Ge;function Ln(){if(Ge?.version===Oe)return Ge.map;let e=new Map;for(let t of Me.values()){let n=t.args?.replace;if(n===void 0||n===t.callId||t.error)continue;let r=P(n,t.sessionId),d=e.get(r);(d===void 0||(t.seq??0)>(fe(d,t.sessionId)?.seq??0))&&e.set(r,t.callId)}return Ge={version:Oe,map:e},e}function Tt(e,t){let n=Ln(),r,d=e;for(let o=0;o<20;o++){let l=n.get(P(d,t));if(l===void 0)break;r=l,d=l}return r}function ge(e){let t=(0,Et.useSyncExternalStore)(Tn,()=>Oe);return e()}function Lt(e,t){let n=P(e,t);return xe.set(n,(xe.get(n)??0)+1),Pe(),()=>{let r=(xe.get(n)??1)-1;r<=0?xe.delete(n):xe.set(n,r),Pe()}}function Nt(e,t){return xe.has(P(e,t))}var et="dsh-lantern:v1:",Xe=300,ke=new Map,Ce=new Set;function oe(e,t){let n=P(e,t),r=ke.get(n);if(Ce.has(n)&&r!==void 0)return r;try{let d=localStorage.getItem(et+n),o=d?JSON.parse(d):void 0;return o&&typeof o=="object"&&!Array.isArray(o)?o:{}}catch{return r??{}}}function me(e,t,n){let r=P(e,n),d={...oe(e,n),...t,at:Date.now()};if(ke.delete(r),ke.set(r,d),ke.size>Xe){let l=ke.keys().next().value;ke.delete(l),Ce.delete(l)}let o=!1;try{localStorage.setItem(et+r,JSON.stringify(d)),o=!0,Nn()}catch{}o?Ce.delete(r):Ce.add(r),Pe()}function Nn(){let e=[];for(let t=0;t<localStorage.length;t++){let n=localStorage.key(t);if(!n?.startsWith(et))continue;let r=0;try{r=Number(JSON.parse(localStorage.getItem(n)??"{}").at)||0}catch{r=0}e.push([n,r])}if(!(e.length<=Xe)){e.sort((t,n)=>t[1]-n[1]);for(let[t]of e.slice(0,e.length-Xe))localStorage.removeItem(t)}}function St(e){if(e!==void 0)try{return JSON.parse(e)}catch{return e}}function It(e,t){let n=oe(e.callId,e.sessionId),r=e.result;return r?.status==="answered"?{state:"answered",response:St(r.response)}:n.answer!==void 0?{state:"answered",response:St(n.answer)}:r?.status==="dismissed"?{state:"dismissed",response:void 0}:r?.status==="timeout"?{state:"timeout",response:void 0}:r?.status==="closed"?{state:"closed",response:void 0}:r===void 0&&e.args?.await&&t!=="preparing"?{state:"waiting",response:void 0}:{state:"idle",response:void 0}}var at="dsh-lantern/visual",st="lanternVisual",nt="dsh-resource://lantern-visual/",rt,Rt;function At(e){rt=e.sidebarRight,Rt=e.sessions}function In(e,t){return nt+encodeURIComponent(e)+"/"+encodeURIComponent(t)}function ot(e){if(!e||!e.startsWith(nt))return;let[t,n]=e.slice(nt.length).split("/");if(!(!t||!n))try{return{sessionId:decodeURIComponent(t),callId:decodeURIComponent(n)}}catch{return}}function _e(e,t){if(!(!rt||!e))try{rt.openResource(In(e,t),{kind:st})}catch(n){console.warn("[dsh-lantern] could not open the sidebar",n)}}async function it(e,t){let n=await fetch(new URL(`api/${e}`,document.baseURI),{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(t),credentials:"same-origin"}),r;try{r=await n.json()}catch{r=void 0}if(!n.ok||!r?.ok)throw new Error(r?.error?.message??`HTTP ${n.status}`);return r.value}async function lt(e,t){if(!e)throw new Error("no session");let r=Rt?.scope(e)?.get("conversation");if(!r)throw new Error("conversation service unavailable");await r.send(t)}function Rn(e,t){let n=`${ve().answerPrefix} \u2014 ${e||ve().visual}`;return typeof t=="string"?`${n}: ${t}`:t&&typeof t=="object"&&!Array.isArray(t)&&Object.values(t).every(r=>r===null||typeof r!="object")?[n,...Object.entries(t).map(([r,d])=>`${r}: ${typeof d=="string"?d:JSON.stringify(d)}`)].join(`
`):`${n}: ${JSON.stringify(t)}`}var tt=new Set;async function Ct(e,t,n){let r=fe(e,t),d=t??r?.sessionId,o=P(e,d);if(tt.has(o)||oe(e,d).answer!==void 0||r?.result?.status==="answered")throw new Error("already answered");tt.add(o);try{if(r?.args?.await&&r.result===void 0){let{status:l}=await it("lantern.respond",{sessionId:d,callId:e,response:n});if(l==="settled"){me(e,{answer:JSON.stringify(n)},d);return}}await lt(d,Rn(r?.args?.title??"",n)),me(e,{answer:JSON.stringify(n)},d)}finally{tt.delete(o)}}async function Mt(e,t){let{status:n}=await it("lantern.dismiss",{sessionId:t,callId:e});return n==="settled"}async function Ot(e,t){let{url:n}=await it("lantern.file",{sessionId:e,path:t});return new URL(n,document.baseURI).href}var D=require("react");var x=require("react");var S=require("react");var je=`/*
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
`;var dt="__lantern";function Pt(){let e="__lantern",n=Function.prototype.call.bind(String.prototype.startsWith),r=URL,d=document.getElementById("lantern-boot"),o=JSON.parse(d&&d.textContent||"{}"),l=location,u=document;function g(a){if(typeof a=="string"&&!(l.protocol!=="http:"&&l.protocol!=="https:"))try{let s=new r(a,l.href);if(s.protocol!=="http:"&&s.protocol!=="https:")return;let i=new r("./",l.href).href;return n(s.href,i)?s.href:void 0}catch{return}}let b=l.assign.bind(l),y=l.replace.bind(l),E={assign(a){let s=g(a);s!==void 0&&b(s)},replace(a){let s=g(a);s!==void 0&&y(s)},reload(){},toString(){return l.href},valueOf(){return l.href}};for(let a of["href","origin","protocol","host","hostname","port","pathname","search","hash"])Object.defineProperty(E,a,{configurable:!0,enumerable:!0,get(){return l[a]},set(s){let i=g(s);a==="href"&&i!==void 0&&b(i)}});let q=new Proxy(window,{get(a,s){if(s==="location")return E;if(s==="document")return F;if(s==="top"||s==="parent"||s==="self"||s==="frames"||s==="globalThis")return q;let i=a[s];return typeof i=="function"?i.bind(a):i},set(a,s,i){if(s==="location"){let p=g(i);return p!==void 0&&b(p),!0}return a[s]=i,!0}});function te(a){return String(a).replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi,(s,i,p)=>{if(/\bsrc\s*=/i.test(i)||/\btype\s*=\s*["']?module/i.test(i)&&/(^|\n)\s*(import|export)\b/.test(p))return s;let w=`(function(__ltLoc,__ltWin,__ltDoc){const location=__ltLoc,window=__ltWin,top=window,parent=window,self=window,globalThis=window,frames=window,document=__ltDoc;
${p}
}).call(globalThis.__ltWin,globalThis.__ltLoc,globalThis.__ltWin,globalThis.__ltDoc)`;return`<script${i}>${w}<\/script>`})}let F=new Proxy(u,{get(a,s){if(s==="location")return E;if(s==="defaultView")return q;let i=a[s];if((s==="write"||s==="writeln")&&typeof i=="function"){let p=i;return w=>p.call(a,te(w))}return typeof i=="function"?i.bind(a):i},set(a,s,i){if(s==="location"){let p=g(i);return p!==void 0&&b(p),!0}return a[s]=i,!0}});window.__ltLoc=E,window.__ltWin=q,window.__ltDoc=F;try{let a=Object.getOwnPropertyDescriptor(Node.prototype,"ownerDocument");a&&a.configurable&&Object.defineProperty(Node.prototype,"ownerDocument",{configurable:!0,get(){return F}})}catch{}try{let a=Object.getOwnPropertyDescriptor(Document.prototype,"defaultView");a&&a.configurable&&Object.defineProperty(Document.prototype,"defaultView",{configurable:!0,get(){return q}})}catch{}try{let a=window.navigation;a&&typeof a.addEventListener=="function"&&a.addEventListener("navigate",s=>{let i=s.destination&&s.destination.url;g(i)===void 0&&s.cancelable&&s.preventDefault()})}catch{}let T=o.state||"idle",A=o.response,J=o.scheme||"light",M=o.widgetState===void 0?null:o.widgetState,B=1,U={};function N(a){a[e]=1,parent.postMessage(a,"*")}function _(a,s){let i=B++;return new Promise((p,w)=>{U[i]={resolve:p,reject:w};let H={type:a,id:i};for(let Z of Object.keys(s))H[Z]=s[Z];N(H)})}function G(a,s){let i;try{i=JSON.stringify(a===void 0?null:a)}catch{i=void 0}if(typeof i!="string")throw new TypeError("lantern."+s+": value is not JSON-serializable");if(i.length>65536)throw new RangeError("lantern."+s+": value is larger than 64 KB");return i}function I(a,s){window.dispatchEvent(new CustomEvent("lantern:"+a,{detail:s}))}function z(){document.documentElement.setAttribute("data-lt-state",T);let a=T==="answered"||T==="dismissed"||T==="closed";document.querySelectorAll('[data-lt-submit], form[data-lt-form] button:not([type="button"]), form[data-lt-form] input[type="submit"]').forEach(s=>{let i=s;a?(i.disabled=!0,i.setAttribute("data-lt-locked","")):i.hasAttribute("data-lt-locked")&&(i.disabled=!1,i.removeAttribute("data-lt-locked"))})}function X(){let a=getComputedStyle(document.documentElement),s=[];for(let i=1;i<=8;i++)s.push(a.getPropertyValue("--lt-series-"+i).trim());return s}let m=!0,O={get id(){return o.id},get state(){return T},get response(){return A},get theme(){return J},get mode(){return o.mode},get visible(){return m},submit(a){try{return _("submit",{json:G(a,"submit")})}catch(s){return Promise.reject(s)}},send(a){return typeof a!="string"||a.trim()===""?Promise.reject(new TypeError("lantern.send: text must be a non-empty string")):_("send",{text:a.slice(0,4e3)})},openLink(a){N({type:"open-link",url:String(a)})},expand(){N({type:"expand"})},getState(){return M},setState(a){M=a,N({type:"set-state",json:G(a,"setState")})},colors:X,on(a,s){let i=p=>s(p.detail);return window.addEventListener("lantern:"+a,i),()=>window.removeEventListener("lantern:"+a,i)}};Object.defineProperty(window,"lantern",{value:Object.freeze(O),configurable:!1,writable:!1,enumerable:!0}),window.addEventListener("message",a=>{if(a.source!==parent)return;let s=a.data;if(!(!s||s[e]!==1)){if(s.type==="reply"){let i=U[s.id];if(!i)return;delete U[s.id],s.ok?i.resolve(!0):i.reject(new Error(s.error||"lantern: request failed"))}else if(s.type==="state")T=s.state,A=s.response,z(),I("state",{state:T,response:A});else if(s.type==="theme"){J=s.scheme,document.documentElement.setAttribute("data-theme",J);let i=document.getElementById("lantern-theme");i&&(i.textContent=s.css),I("theme",{scheme:J})}else if(s.type==="partial"&&o.streaming){let i=document.getElementById("lantern-stream");i&&(i.innerHTML=s.html)}}});let j=document.documentElement,f=o.mode!=="panel"&&!o.streaming,h=Number(o.maxHeight)>0?Number(o.maxHeight):2400;j.setAttribute("data-lt-mode",o.mode==="panel"?"panel":"inline");let L=-1,k=!1,C=-1,W=-1,he=0,ae=!1,ce=0,Ne=!1;function ne(){let a=j.getBoundingClientRect();return Math.ceil(Math.max(a.height,document.body?document.body.scrollHeight:0))}function Te(){if(k=!1,document.fullscreenElement)return;let a=ne(),s=window.innerHeight;if(f&&!ce&&W>0&&s!==W){let p=a>=s-1&&Math.abs(a-C-(s-W))<=1;he=p?he+1:0,p&&(ae||he>=3)&&(ce=Math.round(Math.min(540,Math.max(320,window.innerWidth*.62)))),ae=!1}C=a,W=s;let i=ce||a;!ce&&!Ne&&i<=s||(j.toggleAttribute("data-lt-overflow",o.mode!=="panel"&&i>h),!(Math.abs(i-L)<2)&&(L=i,N({type:"resize",height:i})))}function Y(){k||(k=!0,requestAnimationFrame(Te))}function re(){if(!f||ce||ae||document.fullscreenElement||!document.body)return;let a=window.innerHeight;Math.abs(ne()-a)>1||!Array.from(document.body.children).some(i=>Math.abs(i.offsetHeight-a)<=1)||(ae=!0,L=a+2,N({type:"resize",height:L}),setTimeout(()=>{ae=!1},1e3))}typeof ResizeObserver=="function"&&new ResizeObserver(Y).observe(j),window.addEventListener("resize",Y),window.addEventListener("load",()=>{Y(),setTimeout(re,300),setTimeout(re,1500)}),document.addEventListener("fullscreenchange",()=>{he=0,W=-1,Y()});let Q=!0;function Le(){let a=Q&&document.visibilityState!=="hidden";a!==m&&(m=a,I("visibility",m))}if(typeof IntersectionObserver=="function"&&new IntersectionObserver(a=>{let s=a[a.length-1];s&&(Q=s.isIntersecting,Le())}).observe(j),document.addEventListener("visibilitychange",Le),f){let a=EventTarget.prototype.addEventListener,s=new WeakSet;EventTarget.prototype.addEventListener=function(w,H,Z){return(w==="wheel"||w==="mousewheel"||w==="DOMMouseScroll")&&s.add(this),a.call(this,w,H,Z)};let i=!1,p=0;a.call(window,"pointerdown",()=>{i=!0},!0),a.call(window,"blur",()=>{i=!1}),a.call(document,"mouseout",w=>{w.relatedTarget||(i=!1)},!0),a.call(window,"wheel",w=>{let H=w;if(i||H.ctrlKey||H.metaKey||document.fullscreenElement||!H.composedPath().some(we=>s.has(we)||typeof we.onwheel=="function"))return;H.stopImmediatePropagation();let ue=Date.now();ue-p>2500&&(p=ue,N({type:"hint",kind:"wheel"}))},{capture:!0,passive:!0})}window.addEventListener("webglcontextlost",a=>{a.target.isConnected&&N({type:"gl",lost:!0})},!0),window.addEventListener("webglcontextrestored",()=>N({type:"gl",lost:!1}),!0);function ye(a){if(a===null||a==="")return null;try{return JSON.parse(a)}catch{return a}}function $(a){let s={};return new FormData(a).forEach((i,p)=>{let w=typeof i=="string"?i:i.name;p in s?s[p]=[].concat(s[p],w):s[p]=w}),a.querySelectorAll('input[type="checkbox"][name]').forEach(i=>{let p=i;!(p.name in s)&&!a.querySelector('input[type="checkbox"][name="'+p.name+'"][value]:not([value="on"])')?s[p.name]=!1:s[p.name]==="on"&&(s[p.name]=!0)}),s}function V(a){let s=[];return a.querySelectorAll("[data-lt-choice]").forEach(i=>{i.getAttribute("aria-pressed")==="true"&&s.push(ye(i.getAttribute("data-lt-choice")))}),a.hasAttribute("data-lt-multi")?s:s.length?s[0]:null}function dn(a){let s=a.closest("form");if(s)return $(s);let i=a.parentElement;for(;i&&i!==document.body;){let w=i.querySelector("[data-lt-choices]");if(w)return V(w);i=i.parentElement}let p=document.querySelector("[data-lt-choices]");return p?V(p):null}function Ie(a,s){let i=a.parentElement&&a.parentElement.querySelector(".lt-error[data-lt-auto]");!i&&a.parentElement&&(i=document.createElement("div"),i.className="lt-error",i.setAttribute("data-lt-auto",""),a.parentElement.appendChild(i)),i&&(i.textContent=s)}function cn(){let a=String(o.lang||"en").toLowerCase();return n(a,"ja")?"\u9078\u3093\u3067\u304B\u3089\u9001\u3063\u3066\u304F\u3060\u3055\u3044\u3002":n(a,"zh")?"\u8BF7\u5148\u9009\u62E9\u518D\u63D0\u4EA4\u3002":"Pick an option first."}function un(a){return a===null||a===""||Array.isArray(a)&&a.length===0}document.addEventListener("click",a=>{let s=a.target;if(!s||!s.closest)return;let i=s.closest("[data-lt-choice]");if(i){let v=i.closest("[data-lt-choices]"),K=!!v&&v.hasAttribute("data-lt-multi"),ee=i.getAttribute("aria-pressed")==="true";if(v&&!K&&v.querySelectorAll("[data-lt-choice]").forEach(Re=>Re.setAttribute("aria-pressed","false")),i.setAttribute("aria-pressed",K?String(!ee):"true"),v){I("select",V(v));let Re=v.parentElement&&v.parentElement.querySelector(".lt-error[data-lt-auto]");Re&&(Re.textContent="")}v&&v.hasAttribute("data-lt-instant")&&!K&&O.submit(V(v)).catch(()=>{});return}let p=s.closest("[data-lt-submit]");if(p&&!p.disabled){a.preventDefault();let v=p.getAttribute("data-lt-submit"),K=v?ye(v):dn(p);if(!v&&un(K)){Ie(p,p.getAttribute("data-lt-empty")||cn());return}Ie(p,""),O.submit(K).catch(ee=>Ie(p,ee.message));return}let w=s.closest("[data-lt-send]");if(w){a.preventDefault(),O.send(w.getAttribute("data-lt-send")||"").catch(()=>{});return}if(s.closest("[data-lt-expand]")){a.preventDefault(),O.expand();return}if(s.closest("[data-lt-fullscreen]")){a.preventDefault(),(document.fullscreenElement?document.exitFullscreen():j.requestFullscreen()).catch(()=>{});return}let ue=s.closest('[role="tablist"] > [data-tab]');if(ue){let v=ue.closest("[data-lt-tabs]");if(v){let K=ue.getAttribute("data-tab");v.querySelectorAll('[role="tablist"] > [data-tab]').forEach(ee=>ee.setAttribute("aria-selected",String(ee===ue))),v.querySelectorAll("[data-tab-panel]").forEach(ee=>{ee.getAttribute("data-tab-panel")===K?ee.removeAttribute("data-lt-hidden"):ee.setAttribute("data-lt-hidden","")})}return}let we=s.closest("[data-lt-next],[data-lt-prev]");if(we){let v=we.closest("[data-lt-steps]");v&&ht(v,Number(v.getAttribute("data-index")||0)+(we.hasAttribute("data-lt-next")?1:-1));return}let pe=s.closest("a[href]");if(pe&&!a.defaultPrevented){let v=pe.getAttribute("href")||"";if(pe.hasAttribute("download")&&/^(blob|data):/i.test(pe.href))return;if(n(v,"#")){a.preventDefault();let K=document.getElementById(decodeURIComponent(v.slice(1)));K&&K.scrollIntoView({behavior:"smooth"});return}if(g(pe.href)!==void 0)return;a.preventDefault(),/^https?:\/\//i.test(pe.href)&&O.openLink(pe.href)}},!1),document.addEventListener("submit",a=>{let s=a.target;if(!(!s||!s.hasAttribute("data-lt-form"))){if(a.preventDefault(),!s.checkValidity()){s.reportValidity();return}O.submit($(s)).catch(i=>Ie(s.lastElementChild||s,i.message))}});function ht(a,s){let i=a.querySelectorAll("[data-step]");if(i.length===0)return;let p=(s+i.length)%i.length;a.setAttribute("data-index",String(p)),i.forEach((H,Z)=>{Z===p?H.removeAttribute("data-lt-hidden"):H.setAttribute("data-lt-hidden","")});let w=a.querySelector("[data-lt-dots]");w&&(w.innerHTML=Array.from(i).map((H,Z)=>'<i class="'+(Z===p?"on":"")+'"></i>').join("")),I("step",p)}function yt(){document.documentElement.setAttribute("data-theme",J),z(),document.querySelectorAll("[data-lt-tabs]").forEach(a=>{let s=a.querySelector('[role="tablist"] > [data-tab][aria-selected="true"]')||a.querySelector('[role="tablist"] > [data-tab]');s&&s.click()}),document.querySelectorAll("[data-lt-steps]").forEach(a=>ht(a,0)),T==="answered"&&A!==void 0&&document.querySelectorAll("[data-lt-choices]").forEach(a=>{let s=[].concat(A);a.querySelectorAll("[data-lt-choice]").forEach(i=>{let p=ye(i.getAttribute("data-lt-choice"));s.some(w=>JSON.stringify(w)===JSON.stringify(p))&&i.setAttribute("aria-pressed","true")})}),typeof ResizeObserver=="function"&&document.body&&new ResizeObserver(Y).observe(document.body),Ne=!0,Y(),N({type:"ready"})}let wt=0;window.addEventListener("error",a=>{/^ResizeObserver loop/.test(String(a.message))||wt++<3&&N({type:"error",message:String(a.message||"Script error")})}),window.addEventListener("unhandledrejection",a=>{wt++<3&&N({type:"error",message:String(a.reason&&a.reason.message||a.reason||"Unhandled rejection")})}),document.readyState==="loading"?document.addEventListener("DOMContentLoaded",yt):yt()}var Cn="@layer lantern-kit, lantern-theme;",yr=je.slice(0,Math.max(0,je.indexOf("/* Base */"))),Mn="body{padding:var(--lt-pad,16px)}";function On(e){return JSON.stringify(e===void 0?null:e).replace(/</g,"\\u003c").replace(/>/g,"\\u003e").replace(/&/g,"\\u0026").replace(/\u2028/g,"\\u2028").replace(/\u2029/g,"\\u2029")}function _t(e){let t=Object.entries(e).filter(([n,r])=>/^--lt-[a-z0-9-]+$/.test(n)&&r!==""&&!/[;{}<]/.test(r)).map(([n,r])=>`${n}:${r}`).join(";");return t===""?"":`@layer lantern-theme{:root{${t}}}`}var Pn=`(${Pt.toString()})();`;function jt(e){return["default-src 'none'",e?`script-src 'nonce-${e}'`:"script-src 'unsafe-inline' data: blob:","style-src 'unsafe-inline' data: blob:","img-src data: blob:","font-src data: blob:","connect-src data: blob:","media-src data: blob:","worker-src 'none'","frame-src 'none'","object-src 'none'","form-action 'none'","base-uri 'none'","navigate-to 'none'"].join("; ")}var wr=jt();function _n(e,t){let n=e.streaming?Array.from(crypto.getRandomValues(new Uint8Array(16)),d=>d.toString(16).padStart(2,"0")).join(""):void 0;return`<meta http-equiv="Content-Security-Policy" content="${jt(n)}"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><script type="application/json" id="lantern-boot">${On(e)}<\/script><script${n?` nonce="${n}"`:""}>${Pn.replace(/<\/script/gi,"<\\/script")}<\/script><style id="lantern-kit">${Cn}@layer lantern-kit{${je}${Mn}}</style><style id="lantern-theme">${t}</style>`}function jn(e){return e.replace(/<!--[\s\S]*?(-->|$)/g,t=>" ".repeat(t.length)).replace(/(<script\b[^>]*>)([\s\S]*?)(<\/script>|$)/gi,(t,n,r,d)=>n+" ".repeat(r.length)+d)}function $e(e,t){let n=new RegExp(`<${t}(\\s[^>]*)?>`,"i").exec(jn(e));if(!n)return null;let r=[e.slice(n.index,n.index+n[0].length)];return r.index=n.index,r}function $n(e,t){let n=$e(e,"head");if(n)return e.slice(0,n.index+n[0].length)+t+e.slice(n.index+n[0].length);let r=$e(e,"html");if(r)return e.slice(0,r.index+r[0].length)+`<head>${t}</head>`+e.slice(r.index+r[0].length);let d=/^\s*<!doctype[^>]*>/i.exec(e);return d?d[0]+t+e.slice(d[0].length):t+e}var $t=/^\s*(?:<!--[\s\S]*?-->\s*)*(?:<!doctype[^>]*>|<html[\s>])/i;function Dn(e){return e.replace(/<meta\b[^>]*>/gi,n=>/http-equiv\s*=\s*["']?\s*refresh/i.test(n)?"":n).replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi,(n,r,d)=>{let o=/\btype\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/i.exec(r),l=(o?.[1]||o?.[2]||o?.[3]||"").trim().toLowerCase();if(l!==""&&l!=="text/javascript"&&l!=="application/javascript"&&l!=="module"||/\bsrc\s*=/i.test(r)||l==="module"&&/(^|\n)\s*(import|export)\b/.test(d))return n;let u=l==="module"&&o?r.replace(o[0],'type="text/javascript"'):r,g=`(function(__ltLoc,__ltWin,__ltDoc){const location=__ltLoc,window=__ltWin,top=window,parent=window,self=window,globalThis=window,frames=window,document=__ltDoc;
${d}
}).call(globalThis.__ltWin,globalThis.__ltLoc,globalThis.__ltWin,globalThis.__ltDoc)`;return`<script${u}>${g.replace(/<\/script/gi,"<\\/script")}<\/script>`})}function Dt(e,t,n){let r=_n(t,n),d=t.scheme==="dark"?"dark":"light";if(t.streaming)return`<!doctype html><html data-theme="${d}"><head>${r}</head><body><div id="lantern-stream"></div></body></html>`;let o=Dn(e);return $t.test(o)&&($e(o,"head")||$e(o,"html"))?$n(o,r):`<!doctype html><html data-theme="${d}"><head>${r}</head><body>${o}</body></html>`}function De(e){let t=e,n=t.lastIndexOf("<");n>t.lastIndexOf(">")&&(t=t.slice(0,n)),t=t.replace(/<script[\s\S]*?(<\/script>|$)/gi,"").replace(/<\/?(?:iframe|object|embed|frame|frameset|meta|base|link|portal)\b[^>]*>/gi,"").replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi,"").replace(/(href|src|action|formaction|xlink:href)\s*=\s*("\s*javascript:[^"]*"|'\s*javascript:[^']*'|javascript:[^\s>]+)/gi,'$1=""');let r=/<body[^>]*>/i.exec(t);if(r)t=(t.slice(0,r.index).match(/<style[\s\S]*?<\/style>/gi)??[]).join("")+t.slice(r.index+r[0].length);else if($t.test(t))return(t.match(/<style[\s\S]*?<\/style>/gi)??[]).join("");return t}var zn=[["--lt-bg",["--dsw-alias-bg-base"]],["--lt-surface",["--dsw-alias-bg-layer-1"]],["--lt-surface-2",["--dsw-alias-bg-layer-2"]],["--lt-fg",["--dsw-alias-label-primary"]],["--lt-fg-2",["--dsw-alias-label-secondary"]],["--lt-fg-3",["--dsw-alias-label-tertiary"]],["--lt-border",["--dsw-alias-border-l1"]],["--lt-border-strong",["--dsw-alias-border-l2"]],["--lt-accent",["--dsw-alias-brand-primary"]],["--lt-success",["--dsw-alias-state-success-primary"]],["--lt-warning",["--dsw-alias-state-warn-primary"]],["--lt-danger",["--dsw-alias-state-error-primary"]]],Vn=[["--lt-accent-soft","--lt-accent",14],["--lt-success-soft","--lt-success",14],["--lt-warning-soft","--lt-warning",16],["--lt-danger-soft","--lt-danger",13]];function ct(e,t){for(let n of t){let r=e.getPropertyValue(n).trim();if(r!=="")return r}return""}var ie;function pt(e){return ie||(ie=document.createElement("span"),ie.style.display="none"),ie.isConnected||document.body.appendChild(ie),ie.style.color="",ie.style.color=e,getComputedStyle(ie).color}function Hn(e,t){return e===t||pt(e)===pt(t)}function qn(e){let t=/rgba?\(([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)/.exec(pt(e));if(!t)return 0;let[n,r,d]=[t[1],t[2],t[3]].map(o=>{let l=Number(o)/255;return l<=.03928?l/12.92:((l+.055)/1.055)**2.4});return .2126*n+.7152*r+.0722*d}function zt(){let e=document.body,t=e?.hasAttribute("data-ds-dark-theme")||!e&&document.documentElement.style.colorScheme==="dark"?"dark":"light";if(!e)return{scheme:t,css:""};let n=getComputedStyle(e),r={};for(let[b,y]of zn){let E=ct(n,y);E!==""&&(r[b]=E)}let d=r["--lt-bg"],o=r["--lt-fg"];if(d!==void 0&&o!==void 0){let b=y=>y===void 0||Hn(y,d);b(r["--lt-surface"])&&(r["--lt-surface"]=`color-mix(in srgb, ${o} 4%, ${d})`),(b(r["--lt-surface-2"])||r["--lt-surface-2"]===r["--lt-surface"])&&(r["--lt-surface-2"]=`color-mix(in srgb, ${o} 8%, ${d})`)}for(let[b,y,E]of Vn){let q=r[y];q!==void 0&&(r[b]=`color-mix(in srgb, ${q} ${E}%, transparent)`)}let l=r["--lt-accent"];l!==void 0&&(r["--lt-accent-fg"]=qn(l)>.55?"#111111":"#ffffff");let u=ct(n,["--dsh-font-family-text","--dsw-font-family"]);u!==""&&(r["--lt-font-sans"]=`${u}, system-ui, "Hiragino Sans", "Noto Sans JP", "Noto Sans CJK JP", sans-serif`);let g=ct(n,["--dsh-font-family-code","--ds-font-family-code"]);return g!==""&&(r["--lt-font-mono"]=`${g}, ui-monospace, Menlo, Consolas, monospace`),{scheme:t,css:_t(r)}}var be,Ve=new Set,Se,ze,ft=!1;function Fn(){ft=!1;let e=zt();if(!(be&&e.scheme===be.scheme&&e.css===be.css)){be=e;for(let t of Ve)t(e)}}function ut(){ft||(ft=!0,requestAnimationFrame(Fn))}function He(){return be===void 0&&(be=zt()),be}function Vt(e){return Ve.add(e),Se===void 0&&typeof MutationObserver=="function"&&(Se=new MutationObserver(ut),document.body&&Se.observe(document.body,{attributes:!0,attributeFilter:["data-ds-dark-theme","style","class"]}),Se.observe(document.documentElement,{attributes:!0,attributeFilter:["style","data-ds-theme-source","lang","class"]}),ze=window.matchMedia?.("(prefers-color-scheme: dark)"),ze?.addEventListener?.("change",ut)),()=>{Ve.delete(e),Ve.size===0&&(Se?.disconnect(),Se=void 0,ze?.removeEventListener?.("change",ut),ze=void 0)}}var Bt=require("react/jsx-runtime"),Jn="allow-scripts allow-forms allow-downloads",Ht=2400,qt=64*1024,Bn=1500,Wn=6,Jt=0,Ft=!1;function Un(){if(Ft)return;Ft=!0;let e=()=>{Jt=performance.now()};window.addEventListener("pointerdown",e,!0),window.addEventListener("keydown",e,!0)}function gt(e,t){if(!e||document.activeElement!==e||t===0||Jt>t)return!1;let n=navigator.userActivation;return n?n.isActive:!1}function mt(e){let{callId:t,sessionId:n,mode:r,html:d,url:o,streaming:l=!1,paused:u=!1,state:g,response:b}=e,y=(0,S.useRef)(null),E=(0,S.useRef)(!1),[q,te]=(0,S.useState)(r==="inline"?u?220:120:0),F=(0,S.useRef)(e);F.current=e;let T=(0,S.useRef)(0),A=(0,S.useRef)(0),J=(0,S.useRef)(0),M=(0,S.useRef)(0),B=(0,S.useRef)(0),U=(0,S.useRef)(!1);(0,S.useEffect)(()=>{Un();let m=()=>{document.activeElement===y.current&&(M.current=performance.now())};return window.addEventListener("blur",m),()=>window.removeEventListener("blur",m)},[]);let N=(0,S.useRef)({state:g,response:b}),_=(0,S.useMemo)(()=>{if(d===void 0)return;let m=oe(t,n),O=null;if(m.state!==void 0)try{O=JSON.parse(m.state)}catch{O=null}let j=He(),f=l&&!u,h={id:t,state:N.current.state,response:N.current.response??null,scheme:j.scheme,mode:r,widgetState:O,streaming:f,lang:Ae(),...r==="inline"?{maxHeight:F.current.maxHeight??Ht}:{}},L=f?"":u?De(d):d;return Dt(L,h,j.css)},[d,l,u,t,n,r]),G=(0,S.useMemo)(()=>{if(o===void 0)return;let m=new URL(o);return m.searchParams.set("lt",t),m.searchParams.set("theme",He().scheme),m.searchParams.set("lang",Ae()),m.href},[o,t]),I=m=>{y.current?.contentWindow?.postMessage({...m,[dt]:1},"*")};(0,S.useEffect)(()=>{E.current=!1,B.current=0,U.current=!1;let m=O=>{let j=y.current?.contentWindow;if(!j||O.source!==j)return;let f=O.data;if(!f||f[dt]!==1||typeof f.type!="string"||U.current)return;let h=F.current,L=(k,C,W)=>{typeof k=="number"&&I({type:"reply",id:k,ok:C,...W?{error:W}:{}})};switch(f.type){case"ready":{E.current=!0;let k=He();I({type:"theme",css:k.css,scheme:k.scheme}),I({type:"state",state:h.state,response:h.response??null}),h.streaming&&h.html!==void 0&&I({type:"partial",html:De(h.html)});return}case"resize":{if(h.mode!=="inline")return;let k=Number(f.height);Number.isFinite(k)&&te(Math.max(24,Math.min(Math.ceil(k),h.maxHeight??Ht)));return}case"hint":h.mode==="inline"&&!h.streaming&&f.kind==="wheel"&&h.onWheelHint?.();return;case"gl":h.streaming||h.onGlLost?.(f.lost===!0);return;case"submit":case"send":{if(h.streaming){L(f.id,!1,"The visual is still being written.");return}if(!gt(y.current,M.current)){L(f.id,!1,"Only a user action inside the visual can do this.");return}let k=Date.now();if(k-T.current<400){L(f.id,!1,"Too fast.");return}if(f.type==="send"){if(k-A.current<Bn||J.current>=Wn){L(f.id,!1,"Too many messages from this visual.");return}A.current=k,J.current++}if(T.current=k,f.type==="submit"){if(typeof f.json!="string"||f.json.length>qt){L(f.id,!1,"The answer is too large.");return}if(h.state==="answered"||h.state==="dismissed"||h.state==="closed"){L(f.id,!1,"This visual is already settled.");return}let C;try{C=JSON.parse(f.json)}catch{L(f.id,!1,"The answer is not JSON.");return}h.onSubmit(C).then(()=>L(f.id,!0),W=>L(f.id,!1,W.message))}else{if(typeof f.text!="string"||f.text.trim()===""){L(f.id,!1,"Empty message.");return}h.onSend(f.text.slice(0,4e3)).then(()=>L(f.id,!0),C=>L(f.id,!1,C.message))}return}case"expand":{if(h.streaming||!gt(y.current,M.current))return;let k=Date.now();if(k-T.current<1e3)return;T.current=k,h.onExpand?.();return}case"open-link":{if(h.streaming||!gt(y.current,M.current)||typeof f.url!="string")return;let k=Date.now();if(k-T.current<1e3)return;T.current=k;let C;try{C=new URL(f.url)}catch{return}if(C.protocol!=="http:"&&C.protocol!=="https:")return;window.open(C.href,"_blank","noopener,noreferrer");return}case"set-state":!h.streaming&&typeof f.json=="string"&&f.json.length<=qt&&me(h.callId,{state:f.json},h.sessionId);return;case"error":typeof f.message=="string"&&h.onError?.(f.message.slice(0,300));return}};return window.addEventListener("message",m),()=>window.removeEventListener("message",m)},[_,G]),(0,S.useEffect)(()=>{E.current&&I({type:"state",state:g,response:b??null})},[g,JSON.stringify(b??null)]),(0,S.useEffect)(()=>Vt(m=>{E.current&&I({type:"theme",css:m.css,scheme:m.scheme})}),[]);let z=(0,S.useRef)(void 0);(0,S.useEffect)(()=>{!l||d===void 0||z.current===void 0&&(z.current=window.setTimeout(()=>{z.current=void 0;let m=F.current;E.current&&m.html!==void 0&&I({type:"partial",html:De(m.html)})},120))},[l,d]),(0,S.useEffect)(()=>()=>{z.current!==void 0&&clearTimeout(z.current)},[]);let X=r==="inline"?{height:`${q}px`}:void 0;return(0,Bt.jsx)("iframe",{ref:y,className:"lantern-frame","data-mode":r,title:t,sandbox:u?"allow-downloads":Jn,"data-scripts":u?"off":"on",onLoad:()=>{B.current++,_!==void 0&&B.current>1&&(U.current=!0)},allow:"fullscreen; clipboard-write",referrerPolicy:"no-referrer",style:X,..._!==void 0?{srcDoc:_}:{src:G}})}function Gn(e,t,n){return e==="preparing"?!0:e==="replay"||t===void 0?!1:t>=n}var Kn=1500;function Xn(e=setTimeout,t=clearTimeout){let n=new Map,r=new Set,d=()=>{for(let o of r)o()};return{observe(o,l){return n.has(o)?!1:(n.set(o,{run:l,mounts:0,armed:!1}),!0)},hold(o){let l=n.get(o);return!l||l.armed||!l.run?!1:(l.run=!1,!0)},poke(){d()},enabled(o){let l=n.get(o);return l!==void 0&&(l.run||l.armed)},arm(o){let l=n.get(o)??{run:!1,mounts:0,armed:!1};l.run=!0,l.armed=!0,n.set(o,l),d()},retain(o){let l=n.get(o);l&&(l.timer!==void 0&&(t(l.timer),l.timer=void 0),l.mounts++)},release(o){let l=n.get(o);l&&(l.mounts=Math.max(0,l.mounts-1),!(l.mounts>0||l.timer!==void 0)&&(l.timer=e(()=>{l.timer=void 0,l.mounts===0&&(l.run=!1,l.armed=!1,d())},Kn)))},subscribe(o){return r.add(o),()=>r.delete(o)}}}var Yn=Date.now(),le=Xn();function Wt(e,t,n,r=!0){return le.observe(e,r&&Gn(t,n,Yn))}function Ut(e){return le.hold(e)}function Gt(e){return le.enabled(e)}function Kt(e){le.arm(e)}function Xt(e){le.retain(e)}function Yt(e){le.release(e)}function Qt(e){return le.subscribe(e)}function Zt(){le.poke()}var c=require("react/jsx-runtime");function de({name:e}){return(0,c.jsx)("svg",{className:"lantern-icon",viewBox:"0 0 16 16",width:"14",height:"14",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:{visual:(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)("rect",{x:"2.5",y:"3",width:"11",height:"10",rx:"2"}),(0,c.jsx)("path",{d:"M5 10l2-2.5 1.6 1.8L10.5 7 12 10"})]}),sidebar:(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)("rect",{x:"2.5",y:"3",width:"11",height:"10",rx:"2"}),(0,c.jsx)("path",{d:"M9.5 3v10"})]}),chevron:(0,c.jsx)("path",{d:"M4.5 6.5L8 10l3.5-3.5"}),skip:(0,c.jsx)("path",{d:"M4.5 4.5l7 7M11.5 4.5l-7 7"}),arrow:(0,c.jsx)("path",{d:"M4 8h8M8.5 4.5L12 8l-3.5 3.5"})}[e]})}function Qn(e,t){document.querySelector(`[data-lantern-key="${CSS.escape(P(e,t))}"]`)?.scrollIntoView({behavior:"smooth",block:"center"})}function Zn(e){return(0,x.useSyncExternalStore)(Qt,()=>Gt(e),()=>!1)}function qe({record:e,sessionId:t,placement:n,phase:r,partialHtml:d}){let o=se(),l=e.callId,u=t??e.sessionId,g=P(l,u),b=Zn(g);(0,x.useEffect)(()=>(Xt(g),()=>Yt(g)),[g]);let y=(0,x.useCallback)(()=>Kt(g),[g]),E=ge(()=>Tt(l,u)),q=ge(()=>oe(l,u)),[te,F]=(0,x.useState)([]),[T,A]=(0,x.useState)(void 0),[J,M]=(0,x.useState)(!1),[B,U]=(0,x.useState)(!1),[N,_]=(0,x.useState)(!1),[G,I]=(0,x.useState)(0),z=(0,x.useRef)(void 0);(0,x.useEffect)(()=>()=>{z.current!==void 0&&clearTimeout(z.current)},[]);let X=e.args,{state:m,response:O}=e.error!==void 0?{state:"closed",response:void 0}:It(e,r),j=X?.title||o.visual,f=(e.result?.path??X?.path)!==void 0,h=X?.display??"inline",L=(0,x.useCallback)(async $=>{A(void 0);try{await Ct(l,u,$)}catch(V){throw A(`${o.sendFailed}: ${V.message}`),V}},[l,u]),k=(0,x.useCallback)(async $=>{A(void 0);try{await lt(u,$)}catch(V){throw A(`${o.sendFailed}: ${V.message}`),V}},[u]),C=(0,x.useCallback)(()=>_e(u,l),[u,l]),W=(0,x.useCallback)($=>F(V=>V.length>=3?V:[...V,$]),[]),he=(0,x.useCallback)(()=>{U(!0),z.current!==void 0&&clearTimeout(z.current),z.current=window.setTimeout(()=>U(!1),2200)},[]),ae=(0,x.useCallback)($=>_($),[]),ce=(0,x.useCallback)(()=>{_(!1),I($=>$+1)},[]),Ne=(0,x.useCallback)(()=>{M(!0),Mt(l,u).then($=>{$||A(o.notWaiting)},$=>A(`${o.sendFailed}: ${$.message}`)).finally(()=>M(!1))},[l,u]),ne=r==="preparing"?o.preparing:e.error!==void 0?o.error:m==="waiting"?o.waiting:m==="answered"?o.answered:m==="dismissed"?o.dismissed:m==="timeout"?o.timeout:void 0,Te=m==="waiting"&&e.result===void 0&&r!=="preparing";if(E!==void 0&&n!=="panel")return(0,c.jsxs)("div",{className:"lantern-row","data-lantern-id":l,"data-lantern-key":g,"data-replaced":"",children:[(0,c.jsx)(de,{name:"visual"}),(0,c.jsx)("span",{className:"lantern-row-title",children:j}),(0,c.jsx)("span",{className:"lantern-muted",children:o.replaced}),(0,c.jsxs)("button",{type:"button",className:"lantern-link",onClick:()=>Qn(E,u),children:[o.showNew,(0,c.jsx)(de,{name:"arrow"})]})]});let Y=Te?(0,c.jsxs)("button",{type:"button",className:"lantern-action",onClick:Ne,disabled:J,title:o.skip,children:[(0,c.jsx)(de,{name:"skip"}),(0,c.jsx)("span",{children:o.skip})]}):null;if(n!=="panel"&&(h==="panel"||f))return(0,c.jsxs)("div",{className:"lantern-row","data-lantern-id":l,"data-lantern-key":g,"data-state":m,children:[(0,c.jsx)(de,{name:"sidebar"}),(0,c.jsx)("span",{className:"lantern-row-title",children:j}),ne&&(0,c.jsx)("span",{className:"lantern-badge","data-state":m,children:ne}),(0,c.jsx)("span",{className:"lantern-muted",children:Te?o.answerInSidebar:o.shownInSidebar}),(0,c.jsx)("span",{className:"lantern-spacer"}),Y,r!=="preparing"&&(0,c.jsxs)("button",{type:"button",className:"lantern-action",onClick:C,title:o.openSidebar,children:[(0,c.jsx)(de,{name:"sidebar"}),(0,c.jsx)("span",{children:o.openSidebar})]}),e.error&&(0,c.jsx)("div",{className:"lantern-note","data-kind":"error",children:e.error})]});let re=n!=="panel"&&q.collapsed===!0,Q=r!=="preparing"&&!b,Le=e.error!==void 0?(0,c.jsx)("div",{className:"lantern-note","data-kind":"error",children:e.error}):f?(0,c.jsx)(er,{record:e,sessionId:u,state:m,response:O,onSubmit:L,onSend:k,onError:W,onGlLost:ae,paused:Q},G+(Q?":paused":":run")):X?.html!==void 0||d!==void 0?(0,c.jsx)(mt,{callId:l,sessionId:u,mode:n==="panel"?"panel":"inline",html:r==="preparing"?d??"":X?.html??"",streaming:r==="preparing",paused:Q,state:m,response:O,onSubmit:L,onSend:k,onExpand:n==="panel"?void 0:C,onError:W,onWheelHint:he,onGlLost:ae},(r==="preparing"?"stream":"full")+G+(Q?":paused":":run")):(0,c.jsx)("div",{className:"lantern-note",children:o.preparing}),ye=(0,c.jsxs)(c.Fragment,{children:[Q&&e.error===void 0&&(X?.html!==void 0||f)&&(0,c.jsxs)("div",{className:"lantern-paused","data-kind":"hold",children:[(0,c.jsx)("span",{children:o.paused}),(0,c.jsx)("span",{className:"lantern-paused-warn",children:o.leave}),(0,c.jsx)("button",{type:"button",className:"lantern-action lantern-resume",onClick:y,children:o.run})]}),B&&!N&&!Q&&(0,c.jsx)("div",{className:"lantern-hint",role:"status",children:o.wheelHint}),N&&!Q&&(0,c.jsxs)("div",{className:"lantern-paused",children:[(0,c.jsx)("span",{children:o.glLost}),(0,c.jsx)("button",{type:"button",className:"lantern-action lantern-resume",onClick:ce,children:o.resume})]})]});return n==="panel"?(0,c.jsxs)("div",{className:"lantern-panel","data-lantern-panel":l,"data-state":m,children:[(Te||T||te.length>0)&&(0,c.jsxs)("div",{className:"lantern-panel-bar",children:[ne&&(0,c.jsx)("span",{className:"lantern-badge","data-state":m,children:ne}),(0,c.jsx)("span",{className:"lantern-spacer"}),Y]}),(0,c.jsx)(en,{notice:T,errors:te}),(0,c.jsxs)("div",{className:"lantern-panel-body",children:[Le,ye]})]}):(0,c.jsxs)("div",{className:"lantern-card","data-lantern-id":l,"data-lantern-key":g,"data-state":m,"data-placement":n,children:[(0,c.jsxs)("div",{className:"lantern-head",children:[(0,c.jsx)(de,{name:"visual"}),(0,c.jsx)("span",{className:"lantern-title",children:j}),ne&&(0,c.jsx)("span",{className:"lantern-badge","data-state":m,children:ne}),(0,c.jsx)("span",{className:"lantern-spacer"}),Y,r!=="preparing"&&(0,c.jsx)("button",{type:"button",className:"lantern-action icon",onClick:C,title:o.openSidebar,"aria-label":o.openSidebar,children:(0,c.jsx)(de,{name:"sidebar"})}),(0,c.jsx)("button",{type:"button",className:"lantern-action icon","data-collapsed":re?"":void 0,onClick:()=>me(l,{collapsed:!re},u),title:re?o.expand:o.collapse,"aria-label":re?o.expand:o.collapse,"aria-expanded":!re,children:(0,c.jsx)(de,{name:"chevron"})})]}),(0,c.jsxs)("div",{className:"lantern-body",hidden:re,children:[Le,ye]}),(0,c.jsx)(en,{notice:T,errors:te})]})}function en({notice:e,errors:t}){let n=se();return!e&&t.length===0?null:(0,c.jsxs)("div",{className:"lantern-notes",children:[e&&(0,c.jsx)("div",{className:"lantern-note","data-kind":"error",children:e}),t.map((r,d)=>(0,c.jsxs)("div",{className:"lantern-note","data-kind":"warn",children:[n.scriptError,": ",r]},d))]})}function er(e){let t=se(),n=e.record.result?.path??e.record.args?.path,[r,d]=(0,x.useState)(void 0),[o,l]=(0,x.useState)(void 0);return(0,x.useEffect)(()=>{if(!n||!e.sessionId)return;let u=!0;return l(void 0),Ot(e.sessionId,n).then(g=>{u&&d(g)},g=>{u&&l(g.message)}),()=>{u=!1}},[n,e.sessionId]),o?(0,c.jsxs)("div",{className:"lantern-note","data-kind":"error",children:[t.fileError,": ",o]}):r?(0,c.jsx)(mt,{callId:e.record.callId,sessionId:e.sessionId,mode:"panel",url:r,paused:e.paused,state:e.state,response:e.response,onSubmit:e.onSubmit,onSend:e.onSend,onError:e.onError,onGlLost:e.onGlLost}):(0,c.jsx)("div",{className:"lantern-note",children:t.loading})}var R=require("react/jsx-runtime"),Ee="show_visual",Fe="lanternVisuals";function bt(e){return Array.isArray(e)?e.map(t=>t&&typeof t=="object"&&t.type==="text"?String(t.text??""):"").join(`
`).trim():""}var nn={kind:Fe,match:e=>e.type==="turn/start"?{id:String(e.data.turn),role:"start"}:e.type==="tool/call"&&e.data.name===Ee?{id:String(e.data.turn),role:"update"}:e.type==="tool/result"?{id:String(e.data.turn),role:"update"}:null,start:(e,t)=>({turn:Number(t.event.data.turn),calls:[]}),update:(e,t)=>{let n=e.state,r=t.event;if(r.type==="tool/call"){let d=String(r.data.callId);return n.calls.some(o=>o.callId===d)?n:{...n,calls:[...n.calls,{callId:d,seq:r.seq,argsRaw:String(r.data.arguments??""),settled:!1,isError:!1}]}}if(r.type==="tool/result"){let d=String(r.data.message?.source?.callId??r.data.message?.toolCallId??""),o=n.calls.findIndex(b=>b.callId===d);if(o<0)return n;let l=r.data.message?.isError===!0,u={...n.calls[o],settled:!0,isError:l,meta:r.data.meta,...l?{errorText:bt(r.data.message?.content)||String(r.data.error?.code??"error")}:{}},g=n.calls.slice();return g[o]=u,{...n,calls:g}}return n},buildLocationData:(e,t,n)=>t!=="turn"||e.state===void 0||e.state.calls.length===0?null:n?.kind==="turn"&&n.turn===e.state.turn&&n.key===Fe&&n.value===e.state.calls?n:{kind:"turn",turn:e.state.turn,key:Fe,value:e.state.calls}};function rn(e,t){return{sessionId:t,seq:e.seq,args:Ye(e.argsRaw),result:e.settled&&!e.isError?Qe(e.meta):void 0,error:e.isError?e.errorText??"error":void 0}}var tn=new Set;function tr(e){if(!e?.has||!e.has("title"))return;let t={};for(let n of["title","html","path","display","replace"])e.has(n)&&(t[n]=e.text(n));return e.has("await_response")&&(t.await_response=e.value?.("await_response")===!0),JSON.stringify(t)}function an(e){let{phase:t,block:n,callId:r,sessionId:d}=e,o=P(r,d),l=typeof n.time=="number"?n.time:typeof n.callTime=="number"?n.callTime:void 0,u=t==="start"?n.argsRaw:t==="result"?n.call?.argsRaw??void 0:void 0,g=(0,D.useMemo)(()=>u===void 0&&t==="result"?tr(n.args):void 0,[u,t,n.args]),b=(0,D.useMemo)(()=>Ye(u??g),[u,g]),y=t==="preparing"?n.args:void 0,E=y?.has("title")?y.text("title"):"",q=y?.has("html")?y.text("html"):void 0,te=y?.has("path")||y?.has("display")&&y.text("display")==="panel",F=!!b?.path||y?.has("path")===!0,T=Wt(o,t,l,!F),A=F&&Ut(o);(0,D.useEffect)(()=>{(T||A)&&Zt()},[T,A,o]);let J=t==="result"&&n.isError===!0,M=J?bt(n.content)||String(n.error?.code??"error"):void 0,B=t==="result"&&!J?Qe(n.meta):void 0;(0,D.useEffect)(()=>{Ze(r,{sessionId:d,...b?{args:b}:{},...B?{result:B}:{},...M?{error:M}:{},...typeof n.seq=="number"?{seq:n.seq}:{}})},[r,d,b,B?.status,B?.response,M]);let U=(0,D.useRef)(t!=="result");(0,D.useEffect)(()=>{t!=="preparing"&&U.current&&b?.display==="panel"&&!M&&!tn.has(o)&&(tn.add(o),queueMicrotask(()=>_e(d,r)))},[t,b?.display,M,o,d]);let N=ge(()=>Nt(r,d)),_=ge(()=>fe(r,d)),G=se(),I={..._,callId:r,sessionId:d??_?.sessionId,args:b??_?.args??(t==="preparing"?{title:E,display:te?"panel":"inline",await:!1}:void 0),result:B??_?.result,error:M??_?.error};return N?(0,R.jsxs)("div",{className:"lantern-row lantern-row-quiet","data-tool":Ee,children:[(0,R.jsx)("span",{className:"lantern-row-title",children:I.args?.title||G.visual}),(0,R.jsx)("span",{className:"lantern-muted",children:G.shownBelow})]}):t==="result"&&I.args===void 0&&!I.error?(0,R.jsx)("div",{className:"lantern-row lantern-row-quiet","data-tool":Ee,children:(0,R.jsx)("span",{className:"lantern-muted",children:bt(n.content)})}):(0,R.jsx)("div",{className:"lantern-tool","data-tool":Ee,children:(0,R.jsx)(qe,{record:I,sessionId:d,placement:"tool",phase:t,partialHtml:q},o)})}function sn(e){let t=e.turn.data.get(Fe)??[],n=t.filter(r=>r.seq<e.seq);return(0,D.useEffect)(()=>{for(let r of t)Ze(r.callId,rn(r,e.sessionId))},[t,e.sessionId]),n.length===0?null:(0,R.jsx)("div",{className:"lantern-tail",children:n.map(r=>(0,R.jsx)(nr,{item:r,sessionId:e.sessionId},P(r.callId,e.sessionId)))})}function nr({item:e,sessionId:t}){(0,D.useEffect)(()=>Lt(e.callId,t),[e.callId,t]);let n=se(),r={callId:e.callId,...rn(e,t)};return e.isError?(0,R.jsxs)("div",{className:"lantern-card","data-lantern-id":e.callId,"data-state":"error",children:[(0,R.jsxs)("div",{className:"lantern-head",children:[(0,R.jsx)("span",{className:"lantern-title",children:r.args?.title||n.error}),(0,R.jsx)("span",{className:"lantern-badge","data-state":"closed",children:n.error})]}),(0,R.jsx)("div",{className:"lantern-note","data-kind":"error",children:e.errorText||n.error})]}):r.args===void 0?null:(0,R.jsx)(qe,{record:r,sessionId:t,placement:"tail",phase:e.settled?"result":"replay"})}function on(e){let{tab:t}=e.useTabInfo(),n=ot(t.navigation.address),r=ge(()=>n?fe(n.callId,n.sessionId):void 0),d=(0,D.useRef)(null),[o,l]=(0,D.useState)(!1);(0,D.useEffect)(()=>{let b=d.current;if(!b)return;let y=()=>l(b.getClientRects().length>0&&b.offsetWidth>0);y();let E=new ResizeObserver(y);return E.observe(b),()=>E.disconnect()},[]);let u=se(),g;return!n||!r?.args?g=(0,R.jsx)("div",{className:"lantern-empty",children:u.missing}):o&&(g=(0,R.jsx)(qe,{record:r,sessionId:n.sessionId,placement:"panel",phase:r.result?"result":"start"},P(n.callId,n.sessionId))),(0,R.jsx)("div",{ref:d,className:"lantern-tab",children:g})}function ln(e){let t=ot(e);return(t?fe(t.callId,t.sessionId):void 0)?.args?.title||ve().visual}var rr="dsh-lantern",ar=["slots","uiConversation","sidebarRight","sidebarRightTabs","sessions"];function sr(e){let t=e;At({sidebarRight:t.sidebarRight,sessions:t.sessions}),t.effect(()=>{let n=document.createElement("style");return n.id="dsh-lantern-style",n.textContent=vt,document.head.appendChild(n),()=>n.remove()},"dsh-lantern: styles"),t.effect(()=>t.uiConversation.events.register(nn),"dsh-lantern: turn data"),t.slots.inject("tool.call.toolview",()=>t.slots.register({name:"tool.call.toolview",key:Ee},an)),t.slots.inject("conversation.chat.turnTail",()=>t.slots.register({name:"conversation.chat.turnTail",id:"dsh-lantern"},sn)),t.effect(()=>t.sidebarRightTabs.register({id:at,kind:st,patterns:["dsh-resource://lantern-visual/**"],keepMounted:!0,title:ln}),"dsh-lantern: sidebar tab type"),t.effect(()=>t.slots.inject("sidebar.right.pane.tab",()=>t.slots.register({name:"sidebar.right.pane.tab",key:at},on)),"dsh-lantern: sidebar tab body")}

return module.exports;}});
