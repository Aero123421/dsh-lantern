/** Actual Lantern views/store, synthetic history and local fixture APIs only. */
import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { once } from 'node:events'
import { createRequire } from 'node:module'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from 'esbuild'

const repo=resolve(dirname(fileURLToPath(import.meta.url)),'../..')
if(!process.env.LANTERN_DSH_RUNTIME)throw Error('Set LANTERN_DSH_RUNTIME to the disposable Playwright/ReactDOM runtime')
const require=createRequire(join(resolve(process.env.LANTERN_DSH_RUNTIME),'package.json'))
const localRequire=createRequire(join(repo,'package.json'))
const {chromium}=require('playwright')
const output=resolve(process.env.LANTERN_E2E_OUTPUT || '/tmp/lantern-registry-evidence')
await mkdir(output,{recursive:true})
const bundle=await build({stdin:{resolveDir:repo,loader:'tsx',contents:`
  import React from 'react';import {createRoot}from'react-dom/client';import{flushSync}from'react-dom';
  import{Tail,SidebarTab}from'./src/client/views.tsx';import{getRecord,upsert,markTail,readLocal,replacementOf}from'./src/client/store.ts';
  import{addressOf}from'./src/client/services.ts';import css from'./src/client/style.css';
  document.head.appendChild(Object.assign(document.createElement('style'),{textContent:css}));
  const root=createRoot(document.getElementById('root'));
  function html(id,large=false){
    let padding='';if(large){let seed=2166136261;for(const c of id)seed=Math.imul(seed^c.charCodeAt(0),16777619);const bytes=new Uint8Array(100000);for(let i=0;i<bytes.length;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;bytes[i]=97+(seed>>>24)%26;}padding='<!--'+new TextDecoder().decode(bytes)+'-->';}
    return padding+'<style>label{display:block}label input{display:block;max-width:100%}form{display:grid;gap:.75rem;max-width:32rem}button{justify-self:start}</style><h2>Synthetic '+id+'</h2><form data-lt-form><label>Answer<input name="answer" value=""></label><button type="submit">Submit answer</button></form><label>Scale<input id="scale" type="range" value="7" min="0" max="20"></label><script>const slider=document.getElementById("scale");const saved=lantern.getState();if(saved)slider.value=saved.scale;slider.oninput=()=>lantern.setState({scale:Number(slider.value)});<'+ '/script>';
  }
  function calls(item){return Array.from({length:item.length??1},(_,i)=>({callId:'r'+i,seq:i,argsRaw:JSON.stringify({title:'Synthetic '+item.session,html:html(item.session+'-'+i),await_response:!!item.pending,...i?{replace:'r'+(i-1)}:{}}),settled:!item.pending,isError:false,...item.pending?{}:{meta:{status:'shown'}}}));}
  window.fixture={
    render(items){flushSync(()=>root.render(<>{items.map((item,index)=><section key={item.key??index} style={{minHeight:300}}>{item.panel?<SidebarTab useTabInfo={()=>({tab:{navigation:{address:addressOf(item.session,'r0')}}})}/>:<Tail turn={{turn:1}} seq={100000} sessionId={item.session} useVisuals={()=>calls(item)}/>}</section>)}</>));},
    clear(){flushSync(()=>root.render(null));},
    populate(count){for(let i=0;i<count;i++){const session='bulk-'+i;upsert('bulk',{sessionId:session,args:{title:'Synthetic '+i,html:html(session,true),display:'inline',await:false},result:{status:'shown'}});markTail('bulk',session)();}},
    stats(count){let records=0,htmlChars=0;for(let i=0;i<count;i++){const record=getRecord('bulk','bulk-'+i);if(record){records++;htmlChars+=record.args?.html?.length??0;}}return{visitedSessions:count,retainedRecords:records,retainedHtmlChars:htmlChars};},
    has(session,id='r0'){return !!getRecord(id,session);},readLocal,replacementOf,
  };
`},bundle:true,write:false,format:'iife',jsx:'automatic',loader:{'.css':'text'},alias:{react:dirname(localRequire.resolve('react/package.json')),'react-dom':dirname(require.resolve('react-dom/package.json'))}})
const markup=`<!doctype html><html lang="en"><meta charset="utf-8"><title>Lantern registry lifetime · mock host</title><style>body{font:15px system-ui;margin:24px}main{max-width:900px;margin:auto}section{margin-bottom:24px}.lantern-tab{min-height:300px}#root:empty::after{content:"No mounted visuals"}</style><main><h1>Registry lifetime · synthetic history</h1><div id="root"></div></main><script>${bundle.outputFiles[0].text.replaceAll('</script','<\\/script')}</script></html>`
const server=createServer((_request,response)=>{response.writeHead(200,{'content-type':'text/html; charset=utf-8'});response.end(markup)})
const checks=[],errors=[],diagnostics=[]
let browser,page,cdp,failure,retention,heap
const check=(name,value)=>{assert.ok(value,name);checks.push(name)}
async function capture(name){await page.screenshot({path:join(output,name+'.png'),fullPage:true})}
async function snapshot(name){
  await cdp.send('HeapProfiler.collectGarbage')
  const usage=await cdp.send('Runtime.getHeapUsage')
  if(process.env.LANTERN_HEAP_SNAPSHOTS==='1'){
    const chunks=[];const onChunk=({chunk})=>chunks.push(chunk);cdp.on('HeapProfiler.addHeapSnapshotChunk',onChunk)
    try{await cdp.send('HeapProfiler.takeHeapSnapshot',{reportProgress:false});await writeFile(join(output,name+'.heapsnapshot'),chunks.join(''))}finally{cdp.off('HeapProfiler.addHeapSnapshotChunk',onChunk)}
  }
  return usage
}
try{
  server.listen(0,'127.0.0.1');await once(server,'listening')
  browser=await chromium.launch({headless:true,...process.env.LANTERN_CHROMIUM?{executablePath:process.env.LANTERN_CHROMIUM}:{},args:['--no-sandbox']})
  page=await browser.newPage({viewport:{width:1100,height:950}})
  page.on('pageerror',error=>errors.push(String(error)))
  page.on('console',message=>{if(message.type()==='error')diagnostics.push(message.text())})
  await page.route('**/api/lantern.visual',route=>route.fulfill({json:{ok:true,value:{arguments:JSON.stringify({title:'Synthetic sidebar',html:'<h2>Open sidebar owner</h2>'}),seq:0,meta:{status:'shown'}}}}))
  await page.goto('http://127.0.0.1:'+server.address().port,{waitUntil:'domcontentloaded'})
  cdp=await page.context().newCDPSession(page)
  await page.evaluate(()=>fixture.render([{session:'held'}]))
  await page.locator('.lantern-card').waitFor()
  await page.evaluate(()=>fixture.populate(300))
  const before=await page.evaluate(()=>fixture.stats(300));const beforeHeap=await snapshot('registry-before')
  await capture('registry-bulk-before-idle')
  await page.waitForTimeout(1700)
  const after=await page.evaluate(()=>fixture.stats(300));const afterHeap=await snapshot('registry-after')
  retention={before,after};heap={before:beforeHeap,after:afterHeap,note:'Whole-page Chromium heap usage after explicit GC, not HTML string length or a production DSH heap guarantee.'}
  await capture('registry-bulk-after-idle')
  check('300 inactive synthetic sessions release all registry records and HTML',before.retainedRecords===300 && after.retainedRecords===0 && after.retainedHtmlChars===0)
  check('a mounted session survives bulk idle-session cleanup',await page.evaluate(()=>fixture.has('held')))
  await page.evaluate(()=>fixture.render([{key:'tail',session:'owned'},{key:'sidebar',session:'owned',panel:true}]))
  await page.locator('.lantern-panel iframe').waitFor()
  await capture('registry-same-session-tail-and-sidebar')
  await page.evaluate(()=>fixture.render([{key:'sidebar',session:'owned',panel:true}]))
  await page.waitForTimeout(1700)
  check('removing one view keeps the same-session sidebar and its record',await page.evaluate(()=>fixture.has('owned')) && await page.locator('.lantern-panel iframe').count()===1)
  await capture('registry-sidebar-retains-after-tail-unmount')
  await page.evaluate(()=>fixture.clear());await page.waitForTimeout(1700)
  check('closing the last sidebar owner releases the session',!await page.evaluate(()=>fixture.has('owned')))
  await capture('registry-all-views-unmounted')
  let loadSidebar
  const sidebarReady=new Promise(resolve=>{loadSidebar=resolve})
  await page.route('**/api/lantern.visual',async route=>{
    await sidebarReady
    await route.fulfill({json:{ok:true,value:{arguments:JSON.stringify({title:'Synthetic cold sidebar',html:'<h2>Rehydrated from synthetic history</h2>'}),seq:0,meta:{status:'shown'}}}})
  })
  await page.evaluate(()=>fixture.render([{session:'cold',panel:true}]))
  await page.getByRole('status').waitFor();await capture('registry-sidebar-loading-history')
  loadSidebar()
  await page.locator('.lantern-panel iframe').waitFor();await page.waitForTimeout(1700)
  check('a cold sidebar rehydrates through fetchVisual and owns the loaded session',await page.evaluate(()=>fixture.has('cold')))
  await capture('registry-sidebar-rehydrated-history')
  await page.evaluate(()=>fixture.clear());await page.waitForTimeout(1700)
  check('closing a rehydrated sidebar releases its fetched record',!await page.evaluate(()=>fixture.has('cold')))
  await page.evaluate(()=>fixture.render([{session:'chain',length:22}]))
  await page.waitForFunction(()=>fixture.replacementOf('r0','chain')==='r21')
  await capture('registry-active-replacement-chain')
  await page.evaluate(()=>fixture.clear());await page.waitForTimeout(1700)
  check('idle replacement records expire together',!await page.evaluate(()=>fixture.has('chain','r21')))
  await page.evaluate(()=>fixture.render([{session:'chain',length:22},{session:'fork',length:2}]))
  await page.waitForFunction(()=>fixture.replacementOf('r0','chain')==='r21' && fixture.replacementOf('r0','fork')==='r1')
  check('replayed history restores long replacement chains without crossing fork IDs',await page.locator('iframe[data-scripts="off"]').count()===2)
  await capture('registry-replayed-chain-and-fork-paused')
  await page.evaluate(()=>fixture.render([{session:'pending',pending:true}]))
  await page.locator('.lantern-card[data-state=waiting]').waitFor()
  await capture('registry-pending-before-leave')
  await page.evaluate(()=>fixture.clear());await page.waitForTimeout(1700)
  check('unmounted pending view cache can expire while synthetic host wait remains',!await page.evaluate(()=>fixture.has('pending')))
  await page.evaluate(()=>fixture.render([{session:'pending',pending:true}]))
  await page.locator('.lantern-card[data-state=waiting] iframe[data-scripts=off]').waitFor()
  await capture('registry-pending-restored-paused')
  await page.locator('.lantern-card').getByRole('button',{name:'Run',exact:true}).click()
  const frame=page.locator('.lantern-card').frameLocator('iframe')
  await frame.locator('#scale').focus();await frame.locator('#scale').press('ArrowRight')
  await page.waitForFunction(()=>JSON.parse(fixture.readLocal('r0','pending').state??'{}').scale===8)
  await capture('registry-widget-state-before-leave')
  await page.evaluate(()=>fixture.clear());await page.waitForTimeout(1700)
  await page.evaluate(()=>fixture.render([{session:'pending',pending:true}]))
  await page.locator('.lantern-card iframe[data-scripts=off]').waitFor()
  await page.locator('.lantern-card').getByRole('button',{name:'Run',exact:true}).click()
  const restoredFrame=await (await page.locator('iframe').elementHandle()).contentFrame()
  await restoredFrame.waitForFunction(()=>document.querySelector('#scale')?.value==='8')
  check('recreated scripts restore saved widget state only after explicit Run',await frame.locator('#scale').inputValue()==='8')
  await capture('registry-widget-state-after-eviction')
  await frame.locator('input[name=answer]').fill('Synthetic answer after cache eviction')
  let reply
  const requestSeen=new Promise(resolve=>{reply=resolve})
  let finish
  const responseReady=new Promise(resolve=>{finish=resolve})
  await page.route('**/api/lantern.respond',async route=>{reply();await responseReady;await route.fulfill({json:{ok:true,value:{status:'settled'}}})})
  await frame.getByRole('button',{name:'Submit answer',exact:true}).click();await requestSeen
  await capture('registry-submission-in-flight')
  await page.evaluate(()=>fixture.clear());await page.waitForTimeout(1700)
  check('in-flight answer owns its cache after every view unmounts',await page.evaluate(()=>fixture.has('pending')))
  finish()
  await page.waitForFunction(()=>fixture.readLocal('r0','pending').answer!==undefined)
  await page.waitForTimeout(1700)
  check('settlement releases the idle cache while preserving the committed answer',!await page.evaluate(()=>fixture.has('pending')))
  await page.evaluate(()=>fixture.render([{session:'pending',pending:true}]))
  await page.locator('.lantern-card[data-state=answered] iframe[data-scripts=off]').waitFor()
  await page.locator('.lantern-card').getByRole('button',{name:'Run',exact:true}).click()
  await page.locator('.lantern-card').frameLocator('iframe').locator('input[name=answer]:disabled').waitFor()
  check('recreated card restores its committed form answer',await page.locator('.lantern-card').frameLocator('iframe').locator('input[name=answer]').inputValue()==='Synthetic answer after cache eviction')
  await capture('registry-answered-after-eviction-and-remount')
  await page.setViewportSize({width:390,height:844});await capture('registry-answered-mobile')
  check('no uncaught browser errors',errors.length===0)
  console.log(checks.length+' registry lifetime UI checks passed')
}catch(error){failure=String(error);if(page)await capture('registry-failure').catch(()=>{});throw error}
finally{
  await writeFile(join(output,'registry-checks.json'),JSON.stringify({checks,errors,diagnostics,retention,heap,...failure?{failure}:{},scope:'mock DSH host, real Tail/VisualCard/SidebarTab/store; synthetic data only'},null,2))
  if(browser)await browser.close();await new Promise(resolve=>server.close(resolve))
}
