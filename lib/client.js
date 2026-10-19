window.__ModuleLoader__.load({id:"dsh-lantern",factory(require){const module={exports:{}};const exports=module.exports;
"use strict";var Pe=Object.defineProperty;var zt=Object.getOwnPropertyDescriptor;var Ht=Object.getOwnPropertyNames;var $t=Object.prototype.hasOwnProperty;var qt=(e,t)=>{for(var n in t)Pe(e,n,{get:t[n],enumerable:!0})},Vt=(e,t,n,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of Ht(t))!$t.call(e,i)&&i!==n&&Pe(e,i,{get:()=>t[i],enumerable:!(r=zt(t,i))||r.enumerable});return e};var Ft=e=>Vt(Pe({},"__esModule",{value:!0}),e);var Tn={};qt(Tn,{apply:()=>En,inject:()=>Sn,name:()=>kn});module.exports=Ft(Tn);var at=`/* Card chrome inside DSH Web. Uses DSH's own tokens so it follows every theme. */
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
`;var Jt={visual:"\u30D3\u30B8\u30E5\u30A2\u30EB",waiting:"\u56DE\u7B54\u5F85\u3061",answered:"\u56DE\u7B54\u6E08\u307F",dismissed:"\u30B9\u30AD\u30C3\u30D7",timeout:"\u6642\u9593\u5207\u308C",closed:"\u7D42\u4E86",error:"\u30A8\u30E9\u30FC",preparing:"\u4F5C\u6210\u4E2D\u2026",skip:"\u30B9\u30AD\u30C3\u30D7",openSidebar:"\u30B5\u30A4\u30C9\u30D0\u30FC\u3067\u958B\u304F",collapse:"\u6298\u308A\u305F\u305F\u3080",expand:"\u5C55\u958B\u3059\u308B",shownBelow:"\u56DE\u7B54\u306E\u4E0B\u306B\u8868\u793A\u3057\u3066\u3044\u307E\u3059",shownInSidebar:"\u30B5\u30A4\u30C9\u30D0\u30FC\u306B\u8868\u793A\u3057\u3066\u3044\u307E\u3059",answerInSidebar:"\u30B5\u30A4\u30C9\u30D0\u30FC\u3067\u56DE\u7B54\u3057\u3066\u304F\u3060\u3055\u3044",replaced:"\u65B0\u3057\u3044\u7248\u306B\u66F4\u65B0\u3057\u307E\u3057\u305F",showNew:"\u65B0\u3057\u3044\u7248\u3078",scriptError:"\u30D3\u30B8\u30E5\u30A2\u30EB\u5185\u306E\u30B9\u30AF\u30EA\u30D7\u30C8\u3067\u30A8\u30E9\u30FC",sendFailed:"\u9001\u4FE1\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F",missing:"\u3053\u306E\u30D3\u30B8\u30E5\u30A2\u30EB\u306E\u5185\u5BB9\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\u3002\u30C1\u30E3\u30C3\u30C8\u304B\u3089\u958B\u304D\u76F4\u3057\u3066\u304F\u3060\u3055\u3044\u3002",loading:"\u8AAD\u307F\u8FBC\u307F\u4E2D\u2026",fileError:"\u30D5\u30A1\u30A4\u30EB\u3092\u958B\u3051\u307E\u305B\u3093\u3067\u3057\u305F",answerPrefix:"\u56DE\u7B54",notWaiting:"\u30A8\u30FC\u30B8\u30A7\u30F3\u30C8\u306F\u3082\u3046\u5F85\u3063\u3066\u3044\u307E\u305B\u3093",wheelHint:"\u30AF\u30EA\u30C3\u30AF\u3059\u308B\u3068\u30DB\u30A4\u30FC\u30EB\u3067\u64CD\u4F5C\u3067\u304D\u307E\u3059",glLost:"3D \u8868\u793A\u3092\u4E00\u6642\u505C\u6B62\u3057\u307E\u3057\u305F\uFF08\u540C\u6642\u306B\u52D5\u304B\u305B\u308B\u6570\u306E\u4E0A\u9650\uFF09",resume:"\u518D\u958B"},_t={visual:"Visual",waiting:"Waiting for you",answered:"Answered",dismissed:"Skipped",timeout:"Timed out",closed:"Closed",error:"Error",preparing:"Building\u2026",skip:"Skip",openSidebar:"Open in sidebar",collapse:"Collapse",expand:"Expand",shownBelow:"Shown below the answer",shownInSidebar:"Shown in the sidebar",answerInSidebar:"Answer it in the sidebar",replaced:"Updated to a newer version",showNew:"Go to the new version",scriptError:"A script in the visual failed",sendFailed:"Could not send",missing:"This visual is not loaded. Open it again from the chat.",loading:"Loading\u2026",fileError:"Could not open the file",answerPrefix:"Answer",notWaiting:"The agent is no longer waiting",wheelHint:"Click the visual to use the scroll wheel in it",glLost:"The 3D view was paused (too many running at once)",resume:"Resume"},Bt={visual:"\u53EF\u89C6\u5316",waiting:"\u7B49\u5F85\u56DE\u7B54",answered:"\u5DF2\u56DE\u7B54",dismissed:"\u5DF2\u8DF3\u8FC7",timeout:"\u5DF2\u8D85\u65F6",closed:"\u5DF2\u7ED3\u675F",error:"\u9519\u8BEF",preparing:"\u751F\u6210\u4E2D\u2026",skip:"\u8DF3\u8FC7",openSidebar:"\u5728\u4FA7\u8FB9\u680F\u6253\u5F00",collapse:"\u6536\u8D77",expand:"\u5C55\u5F00",shownBelow:"\u663E\u793A\u5728\u56DE\u7B54\u4E0B\u65B9",shownInSidebar:"\u663E\u793A\u5728\u4FA7\u8FB9\u680F",answerInSidebar:"\u8BF7\u5728\u4FA7\u8FB9\u680F\u4E2D\u56DE\u7B54",replaced:"\u5DF2\u66F4\u65B0\u4E3A\u65B0\u7248\u672C",showNew:"\u67E5\u770B\u65B0\u7248\u672C",scriptError:"\u53EF\u89C6\u5316\u4E2D\u7684\u811A\u672C\u51FA\u9519",sendFailed:"\u53D1\u9001\u5931\u8D25",missing:"\u672A\u52A0\u8F7D\u6B64\u53EF\u89C6\u5316\u5185\u5BB9\uFF0C\u8BF7\u4ECE\u5BF9\u8BDD\u4E2D\u91CD\u65B0\u6253\u5F00\u3002",loading:"\u52A0\u8F7D\u4E2D\u2026",fileError:"\u65E0\u6CD5\u6253\u5F00\u6587\u4EF6",answerPrefix:"\u56DE\u7B54",notWaiting:"\u667A\u80FD\u4F53\u5DF2\u4E0D\u518D\u7B49\u5F85",wheelHint:"\u70B9\u51FB\u540E\u5373\u53EF\u5728\u5176\u4E2D\u4F7F\u7528\u6EDA\u8F6E",glLost:"3D \u89C6\u56FE\u5DF2\u6682\u505C\uFF08\u540C\u65F6\u8FD0\u884C\u7684\u6570\u91CF\u5DF2\u8FBE\u4E0A\u9650\uFF09",resume:"\u7EE7\u7EED"};function Ut(){return(typeof document<"u"&&document.documentElement.lang||typeof navigator<"u"&&navigator.language||"en").toLowerCase()}function Se(){let e=Ut();return e.startsWith("ja")?"ja":e.startsWith("zh")?"zh":typeof navigator<"u"&&navigator.languages?.some(t=>t.toLowerCase().startsWith("ja"))?"ja":"en"}function G(){let e=Se();return e==="ja"?Jt:e==="zh"?Bt:_t}var it=require("react");function $e(e){if(!e)return;let t;try{t=JSON.parse(e)}catch{return}if(typeof t!="object"||t===null)return;let n=t,r=typeof n.html=="string"&&n.html!==""?n.html:void 0,i=typeof n.path=="string"&&n.path!==""?n.path:void 0;return{title:typeof n.title=="string"&&n.title.trim()!==""?n.title.trim():"",...r!==void 0?{html:r}:{},...i!==void 0?{path:i}:{},display:i!==void 0||n.display==="panel"?"panel":"inline",await:n.await_response===!0,...typeof n.replace=="string"&&n.replace.trim()!==""?{replace:n.replace.trim()}:{}}}function qe(e){if(typeof e!="object"||e===null)return;let t=e,n=t.status;if(!(n!=="shown"&&n!=="answered"&&n!=="dismissed"&&n!=="timeout"&&n!=="closed"))return{status:n,...typeof t.response=="string"?{response:t.response}:{},...typeof t.path=="string"?{path:t.path}:{}}}var ye=new Map,ue=new Map,Ee=0,He=new Set;function Wt(){Ee++;for(let e of He)e()}function Gt(e){return He.add(e),()=>{He.delete(e)}}function we(e,t){let n=ye.get(e),r=n===void 0;for(let[l,c]of Object.entries(t)){if(c===void 0)continue;let g=n?.[l];g!==c&&(typeof c=="object"&&JSON.stringify(g)===JSON.stringify(c)||(r=!0))}if(!r)return;let i={...n,callId:e};for(let[l,c]of Object.entries(t))c!==void 0&&(i[l]=c);ye.set(e,i),Te()}var je=!1;function Te(){je||(je=!0,queueMicrotask(()=>{je=!1,Wt()}))}function oe(e){return ye.get(e)}var ze;function Kt(){if(ze?.version===Ee)return ze.map;let e=new Map;for(let t of ye.values()){let n=t.args?.replace;if(n===void 0||n===t.callId||t.error)continue;let r=e.get(n);(r===void 0||(t.seq??0)>(ye.get(r)?.seq??0))&&e.set(n,t.callId)}return ze={version:Ee,map:e},e}function lt(e){let t=Kt(),n,r=e;for(let i=0;i<20;i++){let l=t.get(r);if(l===void 0)break;n=l,r=l}return n}function ie(e){let t=(0,it.useSyncExternalStore)(Gt,()=>Ee);return e()}function dt(e){return ue.set(e,(ue.get(e)??0)+1),Te(),()=>{let t=(ue.get(e)??1)-1;t<=0?ue.delete(e):ue.set(e,t),Te()}}function ct(e){return ue.has(e)}var Ve="dsh-lantern:v1:",st=300;function te(e){try{let t=localStorage.getItem(Ve+e);return t?JSON.parse(t):{}}catch{return{}}}function le(e,t){try{let n={...te(e),...t,at:Date.now()};localStorage.setItem(Ve+e,JSON.stringify(n)),Xt()}catch{}Te()}function Xt(){let e=[];for(let t=0;t<localStorage.length;t++){let n=localStorage.key(t);if(!n?.startsWith(Ve))continue;let r=0;try{r=Number(JSON.parse(localStorage.getItem(n)??"{}").at)||0}catch{r=0}e.push([n,r])}if(!(e.length<=st)){e.sort((t,n)=>t[1]-n[1]);for(let[t]of e.slice(0,e.length-st))localStorage.removeItem(t)}}function ot(e){if(e!==void 0)try{return JSON.parse(e)}catch{return e}}function ut(e,t){let n=te(e.callId),r=e.result;return r?.status==="answered"?{state:"answered",response:ot(r.response)}:n.answer!==void 0?{state:"answered",response:ot(n.answer)}:r?.status==="dismissed"?{state:"dismissed",response:void 0}:r?.status==="timeout"?{state:"timeout",response:void 0}:r?.status==="closed"?{state:"closed",response:void 0}:r===void 0&&e.args?.await&&t!=="preparing"?{state:"waiting",response:void 0}:{state:"idle",response:void 0}}var _e="dsh-lantern/visual",Be="lanternVisual",De="dsh-resource://lantern-visual/",Je,pt;function ft(e){Je=e.sidebarRight,pt=e.sessions}function Yt(e,t){return De+encodeURIComponent(e)+"/"+encodeURIComponent(t)}function Ue(e){if(!e||!e.startsWith(De))return;let[t,n]=e.slice(De.length).split("/");if(!(!t||!n))try{return{sessionId:decodeURIComponent(t),callId:decodeURIComponent(n)}}catch{return}}function Ne(e,t){if(!(!Je||!e))try{Je.openResource(Yt(e,t),{kind:Be})}catch(n){console.warn("[dsh-lantern] could not open the sidebar",n)}}async function We(e,t){let n=await fetch(new URL(`api/${e}`,document.baseURI),{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(t),credentials:"same-origin"}),r;try{r=await n.json()}catch{r=void 0}if(!n.ok||!r?.ok)throw new Error(r?.error?.message??`HTTP ${n.status}`);return r.value}async function Ge(e,t){if(!e)throw new Error("no session");let r=pt?.scope(e)?.get("conversation");if(!r)throw new Error("conversation service unavailable");await r.send(t)}function Qt(e,t){let n=`${G().answerPrefix} \u2014 ${e||G().visual}`;return typeof t=="string"?`${n}: ${t}`:t&&typeof t=="object"&&!Array.isArray(t)&&Object.values(t).every(r=>r===null||typeof r!="object")?[n,...Object.entries(t).map(([r,i])=>`${r}: ${typeof i=="string"?i:JSON.stringify(i)}`)].join(`
`):`${n}: ${JSON.stringify(t)}`}var Fe=new Set;async function gt(e,t,n){let r=oe(e),i=t??r?.sessionId;if(Fe.has(e)||te(e).answer!==void 0||r?.result?.status==="answered")throw new Error("already answered");Fe.add(e);try{if(r?.args?.await&&r.result===void 0){let{status:l}=await We("lantern.respond",{sessionId:i,callId:e,response:n});if(l==="settled"){le(e,{answer:JSON.stringify(n)});return}}await Ge(i,Qt(r?.args?.title??"",n)),le(e,{answer:JSON.stringify(n)})}finally{Fe.delete(e)}}async function mt(e,t){let{status:n}=await We("lantern.dismiss",{sessionId:t??oe(e)?.sessionId,callId:e});return we(e,{}),n==="settled"}async function ht(e,t){let{url:n}=await We("lantern.file",{sessionId:e,path:t});return new URL(n,document.baseURI).href}var D=require("react");var S=require("react");var k=require("react");var Ae=`/*
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
`;var Ke="__lantern";function bt(){let e="__lantern",n=document.getElementById("lantern-boot"),r=JSON.parse(n&&n.textContent||"{}"),i=r.state||"idle",l=r.response,c=r.scheme||"light",g=r.widgetState===void 0?null:r.widgetState,f=1,b={};function w(a){a[e]=1,parent.postMessage(a,"*")}function R(a,s){let o=f++;return new Promise((p,x)=>{b[o]={resolve:p,reject:x};let F={type:a,id:o};for(let K of Object.keys(s))F[K]=s[K];w(F)})}function N(a,s){let o;try{o=JSON.stringify(a===void 0?null:a)}catch{o=void 0}if(typeof o!="string")throw new TypeError("lantern."+s+": value is not JSON-serializable");if(o.length>65536)throw new RangeError("lantern."+s+": value is larger than 64 KB");return o}function E(a,s){window.dispatchEvent(new CustomEvent("lantern:"+a,{detail:s}))}function H(){document.documentElement.setAttribute("data-lt-state",i);let a=i==="answered"||i==="dismissed"||i==="closed";document.querySelectorAll('[data-lt-submit], form[data-lt-form] button:not([type="button"]), form[data-lt-form] input[type="submit"]').forEach(s=>{let o=s;a?(o.disabled=!0,o.setAttribute("data-lt-locked","")):o.hasAttribute("data-lt-locked")&&(o.disabled=!1,o.removeAttribute("data-lt-locked"))})}function Y(){let a=getComputedStyle(document.documentElement),s=[];for(let o=1;o<=8;o++)s.push(a.getPropertyValue("--lt-series-"+o).trim());return s}let $=!0,A={get id(){return r.id},get state(){return i},get response(){return l},get theme(){return c},get mode(){return r.mode},get visible(){return $},submit(a){try{return R("submit",{json:N(a,"submit")})}catch(s){return Promise.reject(s)}},send(a){return typeof a!="string"||a.trim()===""?Promise.reject(new TypeError("lantern.send: text must be a non-empty string")):R("send",{text:a.slice(0,4e3)})},openLink(a){w({type:"open-link",url:String(a)})},expand(){w({type:"expand"})},getState(){return g},setState(a){g=a,w({type:"set-state",json:N(a,"setState")})},colors:Y,on(a,s){let o=p=>s(p.detail);return window.addEventListener("lantern:"+a,o),()=>window.removeEventListener("lantern:"+a,o)}};Object.defineProperty(window,"lantern",{value:Object.freeze(A),configurable:!1,writable:!1,enumerable:!0}),window.addEventListener("message",a=>{if(a.source!==parent)return;let s=a.data;if(!(!s||s[e]!==1)){if(s.type==="reply"){let o=b[s.id];if(!o)return;delete b[s.id],s.ok?o.resolve(!0):o.reject(new Error(s.error||"lantern: request failed"))}else if(s.type==="state")i=s.state,l=s.response,H(),E("state",{state:i,response:l});else if(s.type==="theme"){c=s.scheme,document.documentElement.setAttribute("data-theme",c);let o=document.getElementById("lantern-theme");o&&(o.textContent=s.css),E("theme",{scheme:c})}else if(s.type==="partial"&&r.streaming){let o=document.getElementById("lantern-stream");o&&(o.innerHTML=s.html)}}});let O=document.documentElement,q=r.mode!=="panel"&&!r.streaming,Q=Number(r.maxHeight)>0?Number(r.maxHeight):2400;O.setAttribute("data-lt-mode",r.mode==="panel"?"panel":"inline");let J=-1,I=!1,L=-1,T=-1,y=0,P=!1,V=0,u=!1;function m(){let a=O.getBoundingClientRect();return Math.ceil(Math.max(a.height,document.body?document.body.scrollHeight:0))}function C(){if(I=!1,document.fullscreenElement)return;let a=m(),s=window.innerHeight;if(q&&!V&&T>0&&s!==T){let p=a>=s-1&&Math.abs(a-L-(s-T))<=1;y=p?y+1:0,p&&(P||y>=3)&&(V=Math.round(Math.min(540,Math.max(320,window.innerWidth*.62)))),P=!1}L=a,T=s;let o=V||a;!V&&!u&&o<=s||(O.toggleAttribute("data-lt-overflow",r.mode!=="panel"&&o>Q),!(Math.abs(o-J)<2)&&(J=o,w({type:"resize",height:o})))}function h(){I||(I=!0,requestAnimationFrame(C))}function M(){if(!q||V||P||document.fullscreenElement||!document.body)return;let a=window.innerHeight;Math.abs(m()-a)>1||!Array.from(document.body.children).some(o=>Math.abs(o.offsetHeight-a)<=1)||(P=!0,J=a+2,w({type:"resize",height:J}),setTimeout(()=>{P=!1},1e3))}typeof ResizeObserver=="function"&&new ResizeObserver(h).observe(O),window.addEventListener("resize",h),window.addEventListener("load",()=>{h(),setTimeout(M,300),setTimeout(M,1500)}),document.addEventListener("fullscreenchange",()=>{y=0,T=-1,h()});let X=!0;function ge(){let a=X&&document.visibilityState!=="hidden";a!==$&&($=a,E("visibility",$))}if(typeof IntersectionObserver=="function"&&new IntersectionObserver(a=>{let s=a[a.length-1];s&&(X=s.isIntersecting,ge())}).observe(O),document.addEventListener("visibilitychange",ge),q){let a=EventTarget.prototype.addEventListener,s=new WeakSet;EventTarget.prototype.addEventListener=function(x,F,K){return(x==="wheel"||x==="mousewheel"||x==="DOMMouseScroll")&&s.add(this),a.call(this,x,F,K)};let o=!1,p=0;a.call(window,"pointerdown",()=>{o=!0},!0),a.call(window,"blur",()=>{o=!1}),a.call(document,"mouseout",x=>{x.relatedTarget||(o=!1)},!0),a.call(window,"wheel",x=>{let F=x;if(o||F.ctrlKey||F.metaKey||document.fullscreenElement||!F.composedPath().some(ce=>s.has(ce)||typeof ce.onwheel=="function"))return;F.stopImmediatePropagation();let ae=Date.now();ae-p>2500&&(p=ae,w({type:"hint",kind:"wheel"}))},{capture:!0,passive:!0})}window.addEventListener("webglcontextlost",a=>{a.target.isConnected&&w({type:"gl",lost:!0})},!0),window.addEventListener("webglcontextrestored",()=>w({type:"gl",lost:!1}),!0);function me(a){if(a===null||a==="")return null;try{return JSON.parse(a)}catch{return a}}function ve(a){let s={};return new FormData(a).forEach((o,p)=>{let x=typeof o=="string"?o:o.name;p in s?s[p]=[].concat(s[p],x):s[p]=x}),a.querySelectorAll('input[type="checkbox"][name]').forEach(o=>{let p=o;!(p.name in s)&&!a.querySelector('input[type="checkbox"][name="'+p.name+'"][value]:not([value="on"])')?s[p.name]=!1:s[p.name]==="on"&&(s[p.name]=!0)}),s}function W(a){let s=[];return a.querySelectorAll("[data-lt-choice]").forEach(o=>{o.getAttribute("aria-pressed")==="true"&&s.push(me(o.getAttribute("data-lt-choice")))}),a.hasAttribute("data-lt-multi")?s:s.length?s[0]:null}function he(a){let s=a.closest("form");if(s)return ve(s);let o=a.parentElement;for(;o&&o!==document.body;){let x=o.querySelector("[data-lt-choices]");if(x)return W(x);o=o.parentElement}let p=document.querySelector("[data-lt-choices]");return p?W(p):null}function Z(a,s){let o=a.parentElement&&a.parentElement.querySelector(".lt-error[data-lt-auto]");!o&&a.parentElement&&(o=document.createElement("div"),o.className="lt-error",o.setAttribute("data-lt-auto",""),a.parentElement.appendChild(o)),o&&(o.textContent=s)}function ee(){let a=String(r.lang||navigator.language||"en").toLowerCase();return a.startsWith("ja")?"\u9078\u3093\u3067\u304B\u3089\u9001\u3063\u3066\u304F\u3060\u3055\u3044\u3002":a.startsWith("zh")?"\u8BF7\u5148\u9009\u62E9\u518D\u63D0\u4EA4\u3002":"Pick an option first."}function xe(a){return a===null||a===""||Array.isArray(a)&&a.length===0}document.addEventListener("click",a=>{let s=a.target;if(!s||!s.closest)return;let o=s.closest("[data-lt-choice]");if(o){let v=o.closest("[data-lt-choices]"),U=!!v&&v.hasAttribute("data-lt-multi"),_=o.getAttribute("aria-pressed")==="true";if(v&&!U&&v.querySelectorAll("[data-lt-choice]").forEach(ke=>ke.setAttribute("aria-pressed","false")),o.setAttribute("aria-pressed",U?String(!_):"true"),v){E("select",W(v));let ke=v.parentElement&&v.parentElement.querySelector(".lt-error[data-lt-auto]");ke&&(ke.textContent="")}v&&v.hasAttribute("data-lt-instant")&&!U&&A.submit(W(v)).catch(()=>{});return}let p=s.closest("[data-lt-submit]");if(p&&!p.disabled){a.preventDefault();let v=p.getAttribute("data-lt-submit"),U=v?me(v):he(p);if(!v&&xe(U)){Z(p,p.getAttribute("data-lt-empty")||ee());return}Z(p,""),A.submit(U).catch(_=>Z(p,_.message));return}let x=s.closest("[data-lt-send]");if(x){a.preventDefault(),A.send(x.getAttribute("data-lt-send")||"").catch(()=>{});return}if(s.closest("[data-lt-expand]")){a.preventDefault(),A.expand();return}if(s.closest("[data-lt-fullscreen]")){a.preventDefault(),(document.fullscreenElement?document.exitFullscreen():O.requestFullscreen()).catch(()=>{});return}let ae=s.closest('[role="tablist"] > [data-tab]');if(ae){let v=ae.closest("[data-lt-tabs]");if(v){let U=ae.getAttribute("data-tab");v.querySelectorAll('[role="tablist"] > [data-tab]').forEach(_=>_.setAttribute("aria-selected",String(_===ae))),v.querySelectorAll("[data-tab-panel]").forEach(_=>{_.getAttribute("data-tab-panel")===U?_.removeAttribute("data-lt-hidden"):_.setAttribute("data-lt-hidden","")})}return}let ce=s.closest("[data-lt-next],[data-lt-prev]");if(ce){let v=ce.closest("[data-lt-steps]");v&&be(v,Number(v.getAttribute("data-index")||0)+(ce.hasAttribute("data-lt-next")?1:-1));return}let se=s.closest("a[href]");if(se&&!a.defaultPrevented){let v=se.getAttribute("href")||"";if(se.hasAttribute("download")&&/^(blob|data):/i.test(se.href))return;if(v.startsWith("#")){a.preventDefault();let _=document.getElementById(decodeURIComponent(v.slice(1)));_&&_.scrollIntoView({behavior:"smooth"});return}let U=!1;try{U=location.protocol.startsWith("http")&&new URL(se.href).origin===location.origin}catch{U=!1}if(U)return;a.preventDefault(),/^https?:\/\//i.test(se.href)&&A.openLink(se.href)}},!1),document.addEventListener("submit",a=>{let s=a.target;if(!(!s||!s.hasAttribute("data-lt-form"))){if(a.preventDefault(),!s.checkValidity()){s.reportValidity();return}A.submit(ve(s)).catch(o=>Z(s.lastElementChild||s,o.message))}});function be(a,s){let o=a.querySelectorAll("[data-step]");if(o.length===0)return;let p=(s+o.length)%o.length;a.setAttribute("data-index",String(p)),o.forEach((F,K)=>{K===p?F.removeAttribute("data-lt-hidden"):F.setAttribute("data-lt-hidden","")});let x=a.querySelector("[data-lt-dots]");x&&(x.innerHTML=Array.from(o).map((F,K)=>'<i class="'+(K===p?"on":"")+'"></i>').join("")),E("step",p)}function j(){document.documentElement.setAttribute("data-theme",c),H(),document.querySelectorAll("[data-lt-tabs]").forEach(a=>{let s=a.querySelector('[role="tablist"] > [data-tab][aria-selected="true"]')||a.querySelector('[role="tablist"] > [data-tab]');s&&s.click()}),document.querySelectorAll("[data-lt-steps]").forEach(a=>be(a,0)),i==="answered"&&l!==void 0&&document.querySelectorAll("[data-lt-choices]").forEach(a=>{let s=[].concat(l);a.querySelectorAll("[data-lt-choice]").forEach(o=>{let p=me(o.getAttribute("data-lt-choice"));s.some(x=>JSON.stringify(x)===JSON.stringify(p))&&o.setAttribute("aria-pressed","true")})}),typeof ResizeObserver=="function"&&document.body&&new ResizeObserver(h).observe(document.body),u=!0,h(),w({type:"ready"})}let B=0;window.addEventListener("error",a=>{/^ResizeObserver loop/.test(String(a.message))||B++<3&&w({type:"error",message:String(a.message||"Script error")})}),window.addEventListener("unhandledrejection",a=>{B++<3&&w({type:"error",message:String(a.reason&&a.reason.message||a.reason||"Unhandled rejection")})}),document.readyState==="loading"?document.addEventListener("DOMContentLoaded",j):j()}var en="@layer lantern-kit, lantern-theme;",Hn=Ae.slice(0,Math.max(0,Ae.indexOf("/* Base */"))),tn="body{padding:var(--lt-pad,16px)}";function nn(e){return JSON.stringify(e===void 0?null:e).replace(/</g,"\\u003c").replace(/>/g,"\\u003e").replace(/&/g,"\\u0026").replace(/\u2028/g,"\\u2028").replace(/\u2029/g,"\\u2029")}function yt(e){let t=Object.entries(e).filter(([n,r])=>/^--lt-[a-z0-9-]+$/.test(n)&&r!==""&&!/[;{}<]/.test(r)).map(([n,r])=>`${n}:${r}`).join(";");return t===""?"":`@layer lantern-theme{:root{${t}}}`}var rn=`(${bt.toString()})();`,an="connect-src data: blob:; form-action 'none'; base-uri 'none'";function sn(e,t){return`<meta http-equiv="Content-Security-Policy" content="${an}"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><script type="application/json" id="lantern-boot">${nn(e)}<\/script><script>${rn.replace(/<\/script/gi,"<\\/script")}<\/script><style id="lantern-kit">${en}@layer lantern-kit{${Ae}${tn}}</style><style id="lantern-theme">${t}</style>`}function on(e){return e.replace(/<!--[\s\S]*?(-->|$)/g,t=>" ".repeat(t.length)).replace(/(<script\b[^>]*>)([\s\S]*?)(<\/script>|$)/gi,(t,n,r,i)=>n+" ".repeat(r.length)+i)}function Re(e,t){let n=new RegExp(`<${t}(\\s[^>]*)?>`,"i").exec(on(e));if(!n)return null;let r=[e.slice(n.index,n.index+n[0].length)];return r.index=n.index,r}function ln(e,t){let n=Re(e,"head");if(n)return e.slice(0,n.index+n[0].length)+t+e.slice(n.index+n[0].length);let r=Re(e,"html");if(r)return e.slice(0,r.index+r[0].length)+`<head>${t}</head>`+e.slice(r.index+r[0].length);let i=/^\s*<!doctype[^>]*>/i.exec(e);return i?i[0]+t+e.slice(i[0].length):t+e}var wt=/^\s*(?:<!--[\s\S]*?-->\s*)*(?:<!doctype[^>]*>|<html[\s>])/i;function vt(e,t,n){let r=sn(t,n),i=t.scheme==="dark"?"dark":"light";return t.streaming?`<!doctype html><html data-theme="${i}"><head>${r}</head><body><div id="lantern-stream"></div></body></html>`:wt.test(e)&&(Re(e,"head")||Re(e,"html"))?ln(e,r):`<!doctype html><html data-theme="${i}"><head>${r}</head><body>${e}</body></html>`}function Xe(e){let t=e,n=t.lastIndexOf("<");n>t.lastIndexOf(">")&&(t=t.slice(0,n)),t=t.replace(/<script[\s\S]*?(<\/script>|$)/gi,"").replace(/<\/?(?:iframe|object|embed|frame|frameset|meta|base|link|portal)\b[^>]*>/gi,"").replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi,"").replace(/(href|src|action|formaction|xlink:href)\s*=\s*("\s*javascript:[^"]*"|'\s*javascript:[^']*'|javascript:[^\s>]+)/gi,'$1=""');let r=/<body[^>]*>/i.exec(t);if(r)t=(t.slice(0,r.index).match(/<style[\s\S]*?<\/style>/gi)??[]).join("")+t.slice(r.index+r[0].length);else if(wt.test(t))return(t.match(/<style[\s\S]*?<\/style>/gi)??[]).join("");return t}var dn=[["--lt-bg",["--dsw-alias-bg-base"]],["--lt-surface",["--dsw-alias-bg-layer-1"]],["--lt-surface-2",["--dsw-alias-bg-layer-2"]],["--lt-fg",["--dsw-alias-label-primary"]],["--lt-fg-2",["--dsw-alias-label-secondary"]],["--lt-fg-3",["--dsw-alias-label-tertiary"]],["--lt-border",["--dsw-alias-border-l1"]],["--lt-border-strong",["--dsw-alias-border-l2"]],["--lt-accent",["--dsw-alias-brand-primary"]],["--lt-success",["--dsw-alias-state-success-primary"]],["--lt-warning",["--dsw-alias-state-warn-primary"]],["--lt-danger",["--dsw-alias-state-error-primary"]]],cn=[["--lt-accent-soft","--lt-accent",14],["--lt-success-soft","--lt-success",14],["--lt-warning-soft","--lt-warning",16],["--lt-danger-soft","--lt-danger",13]];function Ye(e,t){for(let n of t){let r=e.getPropertyValue(n).trim();if(r!=="")return r}return""}var ne;function Ze(e){return ne||(ne=document.createElement("span"),ne.style.display="none"),ne.isConnected||document.body.appendChild(ne),ne.style.color="",ne.style.color=e,getComputedStyle(ne).color}function un(e,t){return e===t||Ze(e)===Ze(t)}function pn(e){let t=/rgba?\(([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)/.exec(Ze(e));if(!t)return 0;let[n,r,i]=[t[1],t[2],t[3]].map(l=>{let c=Number(l)/255;return c<=.03928?c/12.92:((c+.055)/1.055)**2.4});return .2126*n+.7152*r+.0722*i}function xt(){let e=document.body,t=e?.hasAttribute("data-ds-dark-theme")||!e&&document.documentElement.style.colorScheme==="dark"?"dark":"light";if(!e)return{scheme:t,css:""};let n=getComputedStyle(e),r={};for(let[b,w]of dn){let R=Ye(n,w);R!==""&&(r[b]=R)}let i=r["--lt-bg"],l=r["--lt-fg"];if(i!==void 0&&l!==void 0){let b=w=>w===void 0||un(w,i);b(r["--lt-surface"])&&(r["--lt-surface"]=`color-mix(in srgb, ${l} 4%, ${i})`),(b(r["--lt-surface-2"])||r["--lt-surface-2"]===r["--lt-surface"])&&(r["--lt-surface-2"]=`color-mix(in srgb, ${l} 8%, ${i})`)}for(let[b,w,R]of cn){let N=r[w];N!==void 0&&(r[b]=`color-mix(in srgb, ${N} ${R}%, transparent)`)}let c=r["--lt-accent"];c!==void 0&&(r["--lt-accent-fg"]=pn(c)>.55?"#111111":"#ffffff");let g=Ye(n,["--dsh-font-family-text","--dsw-font-family"]);g!==""&&(r["--lt-font-sans"]=`${g}, system-ui, "Hiragino Sans", "Noto Sans JP", "Noto Sans CJK JP", sans-serif`);let f=Ye(n,["--dsh-font-family-code","--ds-font-family-code"]);return f!==""&&(r["--lt-font-mono"]=`${f}, ui-monospace, Menlo, Consolas, monospace`),{scheme:t,css:yt(r)}}var de,Ie=new Set,pe,Le,et=!1;function fn(){et=!1;let e=xt();if(!(de&&e.scheme===de.scheme&&e.css===de.css)){de=e;for(let t of Ie)t(e)}}function Qe(){et||(et=!0,requestAnimationFrame(fn))}function Ce(){return de===void 0&&(de=xt()),de}function kt(e){return Ie.add(e),pe===void 0&&typeof MutationObserver=="function"&&(pe=new MutationObserver(Qe),document.body&&pe.observe(document.body,{attributes:!0,attributeFilter:["data-ds-dark-theme","style","class"]}),pe.observe(document.documentElement,{attributes:!0,attributeFilter:["style","data-ds-theme-source","lang","class"]}),Le=window.matchMedia?.("(prefers-color-scheme: dark)"),Le?.addEventListener?.("change",Qe)),()=>{Ie.delete(e),Ie.size===0&&(pe?.disconnect(),pe=void 0,Le?.removeEventListener?.("change",Qe),Le=void 0)}}var At=require("react/jsx-runtime"),gn="allow-scripts allow-forms allow-downloads",St=2400,Et=64*1024,mn=1500,hn=6,Nt=0,Tt=!1;function bn(){if(Tt)return;Tt=!0;let e=()=>{Nt=performance.now()};window.addEventListener("pointerdown",e,!0),window.addEventListener("keydown",e,!0)}function tt(e,t){if(!e||document.activeElement!==e||t===0||Nt>t)return!1;let n=navigator.userActivation;return n?n.isActive:!1}function nt(e){let{callId:t,mode:n,html:r,url:i,streaming:l=!1,state:c,response:g}=e,f=(0,k.useRef)(null),b=(0,k.useRef)(!1),[w,R]=(0,k.useState)(n==="inline"?120:0),N=(0,k.useRef)(e);N.current=e;let E=(0,k.useRef)(0),H=(0,k.useRef)(0),Y=(0,k.useRef)(0),$=(0,k.useRef)(0),A=(0,k.useRef)(0),O=(0,k.useRef)(!1);(0,k.useEffect)(()=>{bn();let y=()=>{document.activeElement===f.current&&($.current=performance.now())};return window.addEventListener("blur",y),()=>window.removeEventListener("blur",y)},[]);let q=(0,k.useRef)({state:c,response:g}),Q=(0,k.useMemo)(()=>{if(r===void 0)return;let y=te(t),P=null;if(y.state!==void 0)try{P=JSON.parse(y.state)}catch{P=null}let V=Ce(),u={id:t,state:q.current.state,response:q.current.response??null,scheme:V.scheme,mode:n,widgetState:P,streaming:l,lang:Se(),...n==="inline"?{maxHeight:N.current.maxHeight??St}:{}};return vt(l?"":r,u,V.css)},[l?"":r,l,t,n]),J=(0,k.useMemo)(()=>{if(i===void 0)return;let y=new URL(i);return y.searchParams.set("lt",t),y.searchParams.set("theme",Ce().scheme),y.searchParams.set("lang",Se()),y.href},[i,t]),I=y=>{f.current?.contentWindow?.postMessage({...y,[Ke]:1},"*")};(0,k.useEffect)(()=>{b.current=!1,A.current=0,O.current=!1;let y=P=>{let V=f.current?.contentWindow;if(!V||P.source!==V)return;let u=P.data;if(!u||u[Ke]!==1||typeof u.type!="string"||O.current)return;let m=N.current,C=(h,M,X)=>{typeof h=="number"&&I({type:"reply",id:h,ok:M,...X?{error:X}:{}})};switch(u.type){case"ready":{b.current=!0;let h=Ce();I({type:"theme",css:h.css,scheme:h.scheme}),I({type:"state",state:m.state,response:m.response??null}),m.streaming&&m.html!==void 0&&I({type:"partial",html:Xe(m.html)});return}case"resize":{if(m.mode!=="inline")return;let h=Number(u.height);Number.isFinite(h)&&R(Math.max(24,Math.min(Math.ceil(h),m.maxHeight??St)));return}case"hint":m.mode==="inline"&&!m.streaming&&u.kind==="wheel"&&m.onWheelHint?.();return;case"gl":m.streaming||m.onGlLost?.(u.lost===!0);return;case"submit":case"send":{if(m.streaming){C(u.id,!1,"The visual is still being written.");return}if(!tt(f.current,$.current)){C(u.id,!1,"Only a user action inside the visual can do this.");return}let h=Date.now();if(h-E.current<400){C(u.id,!1,"Too fast.");return}if(u.type==="send"){if(h-H.current<mn||Y.current>=hn){C(u.id,!1,"Too many messages from this visual.");return}H.current=h,Y.current++}if(E.current=h,u.type==="submit"){if(typeof u.json!="string"||u.json.length>Et){C(u.id,!1,"The answer is too large.");return}if(m.state==="answered"||m.state==="dismissed"||m.state==="closed"){C(u.id,!1,"This visual is already settled.");return}let M;try{M=JSON.parse(u.json)}catch{C(u.id,!1,"The answer is not JSON.");return}m.onSubmit(M).then(()=>C(u.id,!0),X=>C(u.id,!1,X.message))}else{if(typeof u.text!="string"||u.text.trim()===""){C(u.id,!1,"Empty message.");return}m.onSend(u.text.slice(0,4e3)).then(()=>C(u.id,!0),M=>C(u.id,!1,M.message))}return}case"expand":{if(m.streaming||!tt(f.current,$.current))return;let h=Date.now();if(h-E.current<1e3)return;E.current=h,m.onExpand?.();return}case"open-link":{if(m.streaming||!tt(f.current,$.current)||typeof u.url!="string")return;let h=Date.now();if(h-E.current<1e3)return;E.current=h;let M;try{M=new URL(u.url)}catch{return}if(M.protocol!=="http:"&&M.protocol!=="https:")return;window.open(M.href,"_blank","noopener,noreferrer");return}case"set-state":!m.streaming&&typeof u.json=="string"&&u.json.length<=Et&&le(m.callId,{state:u.json});return;case"error":typeof u.message=="string"&&m.onError?.(u.message.slice(0,300));return}};return window.addEventListener("message",y),()=>window.removeEventListener("message",y)},[Q,J]),(0,k.useEffect)(()=>{b.current&&I({type:"state",state:c,response:g??null})},[c,JSON.stringify(g??null)]),(0,k.useEffect)(()=>kt(y=>{b.current&&I({type:"theme",css:y.css,scheme:y.scheme})}),[]);let L=(0,k.useRef)(void 0);(0,k.useEffect)(()=>{!l||r===void 0||L.current===void 0&&(L.current=window.setTimeout(()=>{L.current=void 0;let y=N.current;b.current&&y.html!==void 0&&I({type:"partial",html:Xe(y.html)})},120))},[l,r]),(0,k.useEffect)(()=>()=>{L.current!==void 0&&clearTimeout(L.current)},[]);let T=n==="inline"?{height:`${w}px`}:void 0;return(0,At.jsx)("iframe",{ref:f,className:"lantern-frame","data-mode":n,title:t,sandbox:gn,onLoad:()=>{A.current++,Q!==void 0&&A.current>1&&(O.current=!0)},allow:"fullscreen; clipboard-write",referrerPolicy:"no-referrer",style:T,...Q!==void 0?{srcDoc:Q}:{src:J}})}var d=require("react/jsx-runtime");function re({name:e}){return(0,d.jsx)("svg",{className:"lantern-icon",viewBox:"0 0 16 16",width:"14",height:"14",fill:"none",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:{visual:(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)("rect",{x:"2.5",y:"3",width:"11",height:"10",rx:"2"}),(0,d.jsx)("path",{d:"M5 10l2-2.5 1.6 1.8L10.5 7 12 10"})]}),sidebar:(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)("rect",{x:"2.5",y:"3",width:"11",height:"10",rx:"2"}),(0,d.jsx)("path",{d:"M9.5 3v10"})]}),chevron:(0,d.jsx)("path",{d:"M4.5 6.5L8 10l3.5-3.5"}),skip:(0,d.jsx)("path",{d:"M4.5 4.5l7 7M11.5 4.5l-7 7"}),arrow:(0,d.jsx)("path",{d:"M4 8h8M8.5 4.5L12 8l-3.5 3.5"})}[e]})}function yn(e){document.querySelector(`[data-lantern-id="${CSS.escape(e)}"]`)?.scrollIntoView({behavior:"smooth",block:"center"})}function Me({record:e,sessionId:t,placement:n,phase:r,partialHtml:i}){let l=G(),c=e.callId,g=ie(()=>lt(c)),f=ie(()=>te(c)),[b,w]=(0,S.useState)([]),[R,N]=(0,S.useState)(void 0),[E,H]=(0,S.useState)(!1),[Y,$]=(0,S.useState)(!1),[A,O]=(0,S.useState)(!1),[q,Q]=(0,S.useState)(0),J=(0,S.useRef)(void 0);(0,S.useEffect)(()=>()=>{J.current!==void 0&&clearTimeout(J.current)},[]);let I=e.args,L=t??e.sessionId,{state:T,response:y}=e.error!==void 0?{state:"closed",response:void 0}:ut(e,r),P=I?.title||l.visual,V=(e.result?.path??I?.path)!==void 0,u=I?.display??"inline",m=(0,S.useCallback)(async j=>{N(void 0);try{await gt(c,L,j)}catch(B){throw N(`${l.sendFailed}: ${B.message}`),B}},[c,L]),C=(0,S.useCallback)(async j=>{N(void 0);try{await Ge(L,j)}catch(B){throw N(`${l.sendFailed}: ${B.message}`),B}},[L]),h=(0,S.useCallback)(()=>Ne(L,c),[L,c]),M=(0,S.useCallback)(j=>w(B=>B.length>=3?B:[...B,j]),[]),X=(0,S.useCallback)(()=>{$(!0),J.current!==void 0&&clearTimeout(J.current),J.current=window.setTimeout(()=>$(!1),2200)},[]),ge=(0,S.useCallback)(j=>O(j),[]),me=(0,S.useCallback)(()=>{O(!1),Q(j=>j+1)},[]),ve=(0,S.useCallback)(()=>{H(!0),mt(c,L).then(j=>{j||N(l.notWaiting)},j=>N(`${l.sendFailed}: ${j.message}`)).finally(()=>H(!1))},[c,L]),W=r==="preparing"?l.preparing:e.error!==void 0?l.error:T==="waiting"?l.waiting:T==="answered"?l.answered:T==="dismissed"?l.dismissed:T==="timeout"?l.timeout:void 0,he=T==="waiting"&&e.result===void 0&&r!=="preparing";if(g!==void 0&&n!=="panel")return(0,d.jsxs)("div",{className:"lantern-row","data-lantern-id":c,"data-replaced":"",children:[(0,d.jsx)(re,{name:"visual"}),(0,d.jsx)("span",{className:"lantern-row-title",children:P}),(0,d.jsx)("span",{className:"lantern-muted",children:l.replaced}),(0,d.jsxs)("button",{type:"button",className:"lantern-link",onClick:()=>yn(g),children:[l.showNew,(0,d.jsx)(re,{name:"arrow"})]})]});let Z=he?(0,d.jsxs)("button",{type:"button",className:"lantern-action",onClick:ve,disabled:E,title:l.skip,children:[(0,d.jsx)(re,{name:"skip"}),(0,d.jsx)("span",{children:l.skip})]}):null;if(n!=="panel"&&(u==="panel"||V))return(0,d.jsxs)("div",{className:"lantern-row","data-lantern-id":c,"data-state":T,children:[(0,d.jsx)(re,{name:"sidebar"}),(0,d.jsx)("span",{className:"lantern-row-title",children:P}),W&&(0,d.jsx)("span",{className:"lantern-badge","data-state":T,children:W}),(0,d.jsx)("span",{className:"lantern-muted",children:he?l.answerInSidebar:l.shownInSidebar}),(0,d.jsx)("span",{className:"lantern-spacer"}),Z,r!=="preparing"&&(0,d.jsxs)("button",{type:"button",className:"lantern-action",onClick:h,title:l.openSidebar,children:[(0,d.jsx)(re,{name:"sidebar"}),(0,d.jsx)("span",{children:l.openSidebar})]}),e.error&&(0,d.jsx)("div",{className:"lantern-note","data-kind":"error",children:e.error})]});let ee=n!=="panel"&&f.collapsed===!0,xe=e.error!==void 0?(0,d.jsx)("div",{className:"lantern-note","data-kind":"error",children:e.error}):V?(0,d.jsx)(wn,{record:e,sessionId:L,state:T,response:y,onSubmit:m,onSend:C,onError:M,onGlLost:ge},q):I?.html!==void 0||i!==void 0?(0,d.jsx)(nt,{callId:c,mode:n==="panel"?"panel":"inline",html:r==="preparing"?i??"":I?.html??"",streaming:r==="preparing",state:T,response:y,onSubmit:m,onSend:C,onExpand:n==="panel"?void 0:h,onError:M,onWheelHint:X,onGlLost:ge},(r==="preparing"?"stream":"full")+q):(0,d.jsx)("div",{className:"lantern-note",children:l.preparing}),be=(0,d.jsxs)(d.Fragment,{children:[Y&&!A&&(0,d.jsx)("div",{className:"lantern-hint",role:"status",children:l.wheelHint}),A&&(0,d.jsxs)("div",{className:"lantern-paused",children:[(0,d.jsx)("span",{children:l.glLost}),(0,d.jsx)("button",{type:"button",className:"lantern-action lantern-resume",onClick:me,children:l.resume})]})]});return n==="panel"?(0,d.jsxs)("div",{className:"lantern-panel","data-lantern-panel":c,"data-state":T,children:[(he||R||b.length>0)&&(0,d.jsxs)("div",{className:"lantern-panel-bar",children:[W&&(0,d.jsx)("span",{className:"lantern-badge","data-state":T,children:W}),(0,d.jsx)("span",{className:"lantern-spacer"}),Z]}),(0,d.jsx)(Rt,{notice:R,errors:b}),(0,d.jsxs)("div",{className:"lantern-panel-body",children:[xe,be]})]}):(0,d.jsxs)("div",{className:"lantern-card","data-lantern-id":c,"data-state":T,"data-placement":n,children:[(0,d.jsxs)("div",{className:"lantern-head",children:[(0,d.jsx)(re,{name:"visual"}),(0,d.jsx)("span",{className:"lantern-title",children:P}),W&&(0,d.jsx)("span",{className:"lantern-badge","data-state":T,children:W}),(0,d.jsx)("span",{className:"lantern-spacer"}),Z,r!=="preparing"&&(0,d.jsx)("button",{type:"button",className:"lantern-action icon",onClick:h,title:l.openSidebar,"aria-label":l.openSidebar,children:(0,d.jsx)(re,{name:"sidebar"})}),(0,d.jsx)("button",{type:"button",className:"lantern-action icon","data-collapsed":ee?"":void 0,onClick:()=>le(c,{collapsed:!ee}),title:ee?l.expand:l.collapse,"aria-label":ee?l.expand:l.collapse,"aria-expanded":!ee,children:(0,d.jsx)(re,{name:"chevron"})})]}),(0,d.jsxs)("div",{className:"lantern-body",hidden:ee,children:[xe,be]}),(0,d.jsx)(Rt,{notice:R,errors:b})]})}function Rt({notice:e,errors:t}){let n=G();return!e&&t.length===0?null:(0,d.jsxs)("div",{className:"lantern-notes",children:[e&&(0,d.jsx)("div",{className:"lantern-note","data-kind":"error",children:e}),t.map((r,i)=>(0,d.jsxs)("div",{className:"lantern-note","data-kind":"warn",children:[n.scriptError,": ",r]},i))]})}function wn(e){let t=G(),n=e.record.result?.path??e.record.args?.path,[r,i]=(0,S.useState)(void 0),[l,c]=(0,S.useState)(void 0);return(0,S.useEffect)(()=>{if(!n||!e.sessionId)return;let g=!0;return c(void 0),ht(e.sessionId,n).then(f=>{g&&i(f)},f=>{g&&c(f.message)}),()=>{g=!1}},[n,e.sessionId]),l?(0,d.jsxs)("div",{className:"lantern-note","data-kind":"error",children:[t.fileError,": ",l]}):r?(0,d.jsx)(nt,{callId:e.record.callId,mode:"panel",url:r,state:e.state,response:e.response,onSubmit:e.onSubmit,onSend:e.onSend,onError:e.onError,onGlLost:e.onGlLost}):(0,d.jsx)("div",{className:"lantern-note",children:t.loading})}var z=require("react/jsx-runtime"),fe="show_visual",Oe="lanternVisuals";function rt(e){return Array.isArray(e)?e.map(t=>t&&typeof t=="object"&&t.type==="text"?String(t.text??""):"").join(`
`).trim():""}var It={kind:Oe,match:e=>e.type==="turn/start"?{id:String(e.data.turn),role:"start"}:e.type==="tool/call"&&e.data.name===fe?{id:String(e.data.turn),role:"update"}:e.type==="tool/result"?{id:String(e.data.turn),role:"update"}:null,start:(e,t)=>({turn:Number(t.event.data.turn),calls:[]}),update:(e,t)=>{let n=e.state,r=t.event;if(r.type==="tool/call"){let i=String(r.data.callId);return n.calls.some(l=>l.callId===i)?n:{...n,calls:[...n.calls,{callId:i,seq:r.seq,argsRaw:String(r.data.arguments??""),settled:!1,isError:!1}]}}if(r.type==="tool/result"){let i=String(r.data.message?.source?.callId??r.data.message?.toolCallId??""),l=n.calls.findIndex(b=>b.callId===i);if(l<0)return n;let c=r.data.message?.isError===!0,g={...n.calls[l],settled:!0,isError:c,meta:r.data.meta,...c?{errorText:rt(r.data.message?.content)||String(r.data.error?.code??"error")}:{}},f=n.calls.slice();return f[l]=g,{...n,calls:f}}return n},buildLocationData:(e,t,n)=>t!=="turn"||e.state===void 0||e.state.calls.length===0?null:n?.kind==="turn"&&n.turn===e.state.turn&&n.key===Oe&&n.value===e.state.calls?n:{kind:"turn",turn:e.state.turn,key:Oe,value:e.state.calls}};function Ct(e,t){return{sessionId:t,seq:e.seq,args:$e(e.argsRaw),result:e.settled&&!e.isError?qe(e.meta):void 0,error:e.isError?e.errorText??"error":void 0}}var Lt=new Set;function vn(e){if(!e?.has||!e.has("title"))return;let t={};for(let n of["title","html","path","display","replace"])e.has(n)&&(t[n]=e.text(n));return e.has("await_response")&&(t.await_response=e.value?.("await_response")===!0),JSON.stringify(t)}function Mt(e){let{phase:t,block:n,callId:r,sessionId:i}=e,l=t==="start"?n.argsRaw:t==="result"?n.call?.argsRaw??void 0:void 0,c=(0,D.useMemo)(()=>l===void 0&&t==="result"?vn(n.args):void 0,[l,t,n.args]),g=(0,D.useMemo)(()=>$e(l??c),[l,c]),f=t==="preparing"?n.args:void 0,b=f?.has("title")?f.text("title"):"",w=f?.has("html")?f.text("html"):void 0,R=f?.has("path")||f?.has("display")&&f.text("display")==="panel",N=t==="result"&&n.isError===!0,E=N?rt(n.content)||String(n.error?.code??"error"):void 0,H=t==="result"&&!N?qe(n.meta):void 0;(0,D.useEffect)(()=>{we(r,{sessionId:i,...g?{args:g}:{},...H?{result:H}:{},...E?{error:E}:{},...typeof n.seq=="number"?{seq:n.seq}:{}})},[r,i,g,H?.status,H?.response,E]);let Y=(0,D.useRef)(t!=="result");(0,D.useEffect)(()=>{t!=="preparing"&&Y.current&&g?.display==="panel"&&!E&&!Lt.has(r)&&(Lt.add(r),queueMicrotask(()=>Ne(i,r)))},[t,g?.display,E]);let $=ie(()=>ct(r)),A=ie(()=>oe(r)),O=G(),q={...A,callId:r,sessionId:i??A?.sessionId,args:g??A?.args??(t==="preparing"?{title:b,display:R?"panel":"inline",await:!1}:void 0),result:H??A?.result,error:E??A?.error};return $?(0,z.jsxs)("div",{className:"lantern-row lantern-row-quiet","data-tool":fe,children:[(0,z.jsx)("span",{className:"lantern-row-title",children:q.args?.title||O.visual}),(0,z.jsx)("span",{className:"lantern-muted",children:O.shownBelow})]}):t==="result"&&q.args===void 0&&!q.error?(0,z.jsx)("div",{className:"lantern-row lantern-row-quiet","data-tool":fe,children:(0,z.jsx)("span",{className:"lantern-muted",children:rt(n.content)})}):(0,z.jsx)("div",{className:"lantern-tool","data-tool":fe,children:(0,z.jsx)(Me,{record:q,sessionId:i,placement:"tool",phase:t,partialHtml:w})})}function Ot(e){let t=e.turn.data.get(Oe)??[],n=t.filter(r=>r.seq<e.seq&&!r.isError);return(0,D.useEffect)(()=>{for(let r of t)we(r.callId,Ct(r,e.sessionId))},[t,e.sessionId]),n.length===0?null:(0,z.jsx)("div",{className:"lantern-tail",children:n.map(r=>(0,z.jsx)(xn,{item:r,sessionId:e.sessionId},r.callId))})}function xn({item:e,sessionId:t}){(0,D.useEffect)(()=>dt(e.callId),[e.callId]);let n={callId:e.callId,...Ct(e,t)};return n.args===void 0?null:(0,z.jsx)(Me,{record:n,sessionId:t,placement:"tail",phase:e.settled?"result":"replay"})}function Pt(e){let{tab:t}=e.useTabInfo(),n=Ue(t.navigation.address),r=ie(()=>n?oe(n.callId):void 0),i=(0,D.useRef)(null),[l,c]=(0,D.useState)(!1);(0,D.useEffect)(()=>{let b=i.current;if(!b)return;let w=()=>c(b.getClientRects().length>0&&b.offsetWidth>0);w();let R=new ResizeObserver(w);return R.observe(b),()=>R.disconnect()},[]);let g=G(),f;return!n||!r?.args?f=(0,z.jsx)("div",{className:"lantern-empty",children:g.missing}):l&&(f=(0,z.jsx)(Me,{record:r,sessionId:n.sessionId,placement:"panel",phase:r.result?"result":"start"})),(0,z.jsx)("div",{ref:i,className:"lantern-tab",children:f})}function jt(e){let t=Ue(e);return(t?oe(t.callId):void 0)?.args?.title||G().visual}var kn="dsh-lantern",Sn=["slots","uiConversation","sidebarRight","sidebarRightTabs","sessions"];function En(e){let t=e;ft({sidebarRight:t.sidebarRight,sessions:t.sessions}),t.effect(()=>{let n=document.createElement("style");return n.id="dsh-lantern-style",n.textContent=at,document.head.appendChild(n),()=>n.remove()},"dsh-lantern: styles"),t.effect(()=>t.uiConversation.events.register(It),"dsh-lantern: turn data"),t.slots.inject("tool.call.toolview",()=>t.slots.register({name:"tool.call.toolview",key:fe},Mt)),t.slots.inject("conversation.chat.turnTail",()=>t.slots.register({name:"conversation.chat.turnTail",id:"dsh-lantern"},Ot)),t.effect(()=>t.sidebarRightTabs.register({id:_e,kind:Be,patterns:["dsh-resource://lantern-visual/**"],keepMounted:!0,title:jt}),"dsh-lantern: sidebar tab type"),t.effect(()=>t.slots.inject("sidebar.right.pane.tab",()=>t.slots.register({name:"sidebar.right.pane.tab",key:_e},Pt)),"dsh-lantern: sidebar tab body")}

return module.exports;}});
