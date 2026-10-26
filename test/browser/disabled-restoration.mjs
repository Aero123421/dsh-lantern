/** Bounded native-control matrix, actual sandbox runtime with a fixture parent. */
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { join, resolve } from 'node:path'
import { mkdir, writeFile } from 'node:fs/promises'
import { buildDocument } from '../../src/frame/document.ts'

const runtime = process.env.LANTERN_DSH_RUNTIME
if (!runtime) throw new Error('LANTERN_DSH_RUNTIME must contain Playwright')
const require = createRequire(join(resolve(runtime), 'package.json'))
const { chromium } = require('playwright')
const output = resolve(process.env.LANTERN_E2E_OUTPUT || '/tmp/lantern-disabled-evidence')
await mkdir(output, {recursive:true})
const browser = await chromium.launch({headless:true, ...(process.env.LANTERN_CHROMIUM ? {executablePath:process.env.LANTERN_CHROMIUM} : {}), args:['--no-sandbox']})
const page = await browser.newPage({viewport:{width:900,height:900}})
const checks = [], rows = [], errors = []
page.on('pageerror',error=>errors.push(String(error)))
const check = (name,value) => { assert.ok(value,name); checks.push(name) }
const same = (a,b) => JSON.stringify(a) === JSON.stringify(b)
const cases = []
for (const mode of ['attribute','fieldset']) {
  for (const kind of ['checkbox','radio','select-one','select-multiple','text']) cases.push({mode,kind,name:kind+'-'+mode})
}
cases.push({mode:'legend',kind:'checkbox',name:'checkbox-first-legend'})
for(const mode of ['attribute','fieldset']) cases.push({mode,kind:'text',single:true,name:'text-scalar-'+mode})
cases.push({mode:'attribute',kind:'text',single:true,actions:true,name:'action-inputs'})
const semantic = ({disabled,ownDisabled,...value}) => value
const representative = new Set(['checkbox-attribute','text-scalar-attribute','action-inputs'])
function markup({mode,kind,name}) {
  const attrs = mode === 'attribute' ? ' disabled' : ''
  const control = (id,value,disabled) => {
    const identity = `id="${id}" name="features"${disabled ? attrs : ''}`
    if (kind.startsWith('select')) return `<select ${identity}${kind === 'select-multiple' ? ' multiple size="2"' : ''}><option value="${value}" selected>${value}</option>${disabled ? '' : '<option value="changed">Changed selection</option>'}</select>`
    return `<input ${identity} type="${kind}" value="${value}"${kind === 'checkbox' || (kind === 'radio' && disabled) ? ' checked' : ''}>`
  }
  const fixed = control('fixed','fixed',true)
  const optional = control('optional','optional',false)
  const item = cases.find(item=>item.name===name)
  const second = (kind === 'text' && !item.single) || kind === 'radio' ? control('second','second',false) : ''
  const actions = item.actions ? ['button','reset','submit','image'].map(type=>`<input id="action-${type}" type="${type}" name="features" value="Action ${type}"${type==='image' ? ' src="data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2216%22%20height=%2216%22/%3E" alt="Action image" style="width:16px;height:16px;align-self:flex-start"' : ''}>`).join('') : ''
  const fields = mode === 'legend' ? `<fieldset disabled><legend>${optional} Enabled first legend</legend>${fixed} Disabled fieldset member</fieldset>`
    : `${mode === 'fieldset' ? '<fieldset disabled><legend>Fixed configuration</legend>' : '<label>'}${fixed} Fixed disabled value${mode === 'fieldset' ? '</fieldset>' : '</label>'}${actions}<label>${optional} Optional enabled value</label>${second}`
  return `<form data-lt-form class="lt-stack"><h3>${name}</h3>${fields}<button type="submit">Commit values</button></form>`
}
async function mount(html,state='waiting',response=null,scheme='dark') {
  await page.setContent('<main><h2>Disabled restoration matrix · fixture parent</h2><iframe title="Native form controls" style="width:100%;height:600px;border:0" sandbox="allow-scripts allow-forms allow-downloads"></iframe></main>')
  const source = buildDocument(html,{id:'disabled-matrix',bridge:'disabled-matrix',state,response,scheme,mode:'inline',widgetState:null,streaming:false,lang:'en'},'')
  await page.evaluate(source=>{
    window.answer = undefined
    window.addEventListener('message',event=>{
      if (event.data?.type !== 'connect' || event.data?.bridge !== 'disabled-matrix') return
      const port=event.ports[0];window.matrixPort=port
      port.onmessage=event=>{
        const message=event.data
        if(message.type!=='submit')return
        window.answer=JSON.parse(message.json)
        port.postMessage({__lantern:1,type:'state',state:'answered',response:window.answer})
        port.postMessage({__lantern:1,type:'reply',id:message.id,ok:true})
      };port.start()
    },{once:true})
    document.querySelector('iframe').srcdoc=source
  },source)
  const frame=page.frameLocator('iframe')
  await frame.locator('form').waitFor()
  return frame
}
const snapshot = frame => frame.locator('input,select').evaluateAll(controls=>Object.fromEntries(controls.map(control=>[control.id,{
  value:control.value, ...(control.tagName==='SELECT' ? {selected:[...control.selectedOptions].map(option=>option.value)} : ['checkbox','radio'].includes(control.type) ? {checked:control.checked} : {}),
  disabled:control.matches(':disabled'),ownDisabled:control.disabled,
}])))
let failure
try {
  for(const item of cases) {
    const html=markup(item)
    let frame=await mount(html)
    const initial=await snapshot(frame)
    if(representative.has(item.name))await page.screenshot({path:join(output,item.name+'-initial.png'),fullPage:true})
    if(item.kind==='radio')await frame.locator('#optional').check()
    if(item.kind==='text'){await frame.locator('#optional').fill('edited-first');if(!item.single)await frame.locator('#second').fill('edited-second')}
    const before=await snapshot(frame)
    await frame.getByRole('button',{name:'Commit values',exact:true}).click()
    await frame.locator('[data-lt-form-status]').filter({hasText:'Sent.'}).waitFor()
    const answer=await page.evaluate(()=>window.answer)
    const committed=await snapshot(frame)
    if(representative.has(item.name))await page.screenshot({path:join(output,item.name+'-committed.png'),fullPage:true})
    frame=await mount(html,'answered',answer)
    const restored=await snapshot(frame)
    await page.screenshot({path:join(output,item.name+'-restored.png'),fullPage:true})
    const expected=item.kind==='text' ? {features:item.single ? 'edited-first' : ['edited-first','edited-second']} : {features:'optional'}
    await frame.locator('form').evaluate(()=>{window.matrixStateEvents=0;window.lantern.on('state',()=>window.matrixStateEvents++)})
    async function stateAgain(value) {
      const beforeEvents=await frame.locator('form').evaluate(()=>window.matrixStateEvents)
      await page.evaluate(response=>matrixPort.postMessage({__lantern:1,type:'state',state:'answered',response}),value)
      const applied=await frame.locator('form').evaluate(async(_form,{expected,beforeEvents})=>{
        for(let i=0;i<50;i++){if(window.matrixStateEvents>beforeEvents && JSON.stringify(window.lantern.response)===JSON.stringify(expected))return true;await new Promise(resolve=>setTimeout(resolve,10))};return false
      },{expected:value,beforeEvents})
      assert.ok(applied,'repeated state message delivered')
      return snapshot(frame)
    }
    const repeated=await stateAgain(answer)
    const changedAnswer=item.kind==='checkbox' || item.kind==='select-multiple' ? {} : {features:item.kind==='text' ? (item.single ? 'changed-first' : ['changed-first','changed-second']) : item.kind==='radio' ? 'second' : 'changed'}
    const changed=await stateAgain(changedAnswer)
    const changedMatches=item.kind==='text' ? changed.optional.value==='changed-first' && (item.single || changed.second.value==='changed-second')
      : item.kind==='radio' ? !changed.optional.checked && changed.second.checked
      : item.kind==='checkbox' ? !changed.optional.checked : same(changed.optional.selected,item.kind==='select-multiple' ? [] : ['changed'])
    rows.push({case:item.name,initial,before,answer,committed,restored,repeated,changedAnswer,changed,
      wireMatches:same(answer,expected),fixedOnCommit:same(before.fixed,committed.fixed),fixedOnReplay:same(before.fixed,restored.fixed),
      enabledOnReplay:same(semantic(before.optional),semantic(committed.optional)) && same(committed.optional,restored.optional) && committed.optional.disabled && (!committed.second || same(semantic(before.second),semantic(committed.second)) && same(committed.second,restored.second)),
      repeatedSame:same(repeated,restored),changedApplied:changedMatches,fixedOnRepeated:same(before.fixed,changed.fixed),
      actionsPreserved:!item.actions || ['button','reset','submit','image'].every(type=>same(semantic(before['action-'+type]),semantic(changed['action-'+type]))),
    })
    if(item.name==='text-scalar-attribute')await page.screenshot({path:join(output,'text-scalar-repeated-state.png'),fullPage:true})
    if(item.name==='checkbox-attribute') {
      await page.setViewportSize({width:390,height:844})
      frame=await mount(html,'answered',answer,'light');await page.screenshot({path:join(output,'disabled-mobile-light.png'),fullPage:true})
      frame=await mount(html,'answered',answer,'dark');await page.screenshot({path:join(output,'disabled-mobile-dark.png'),fullPage:true})
      await page.setViewportSize({width:900,height:900})
    }
  }
  for(const row of rows) {
    check(row.case+': native FormData excludes disabled values',row.wireMatches)
    check(row.case+': disabled value preserved at settlement',row.fixedOnCommit)
    check(row.case+': disabled value preserved on replay',row.fixedOnReplay)
    check(row.case+': enabled peer restores its committed value and lock',row.enabledOnReplay)
    check(row.case+': repeating the same state preserves the restored form',row.repeatedSame)
    check(row.case+': runtime-locked controls still accept a later state',row.changedApplied)
    check(row.case+': later state keeps original disabled controls unchanged',row.fixedOnRepeated)
  }
  check('action input values are neither restored nor consumed as data positions',rows.find(row=>row.case==='action-inputs').actionsPreserved)
  check('no uncaught browser exceptions',errors.length===0)
  console.log(`${cases.length} cases / ${checks.length} disabled restoration checks passed`)
} catch(error) { failure=String(error); throw error }
finally {
  await writeFile(join(output,'disabled-restoration-checks.json'),JSON.stringify({checks,rows,errors,...failure?{failure}:{},scope:'actual sandbox runtime + fixture parent; native radio group exclusion applies before submission'},null,2))
  await browser.close()
}
