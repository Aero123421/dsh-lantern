import { LlmAdapter } from '@deepseek-ai/dsh-llm'
import { appendFileSync } from 'node:fs'
export const name = 'lantern-e2e'
export const inject = ['llm']
const log = process.env.LANTERN_E2E_LOG
if (!log) throw new Error('LANTERN_E2E_LOG is required for the isolated fixture')
const seen = new Map()
const form = `<div class="lt-stack"><h3>どんな説明がよさそうですか？</h3><p class="lt-muted">選択肢と自由入力を組み合わせて、説明の条件を決められます。</p><form data-lt-form data-lt-submit-key="mod-enter" class="lt-stack"><div class="lt-choices"><label class="lt-choice"><strong><input type="radio" name="style" value="visual" checked> 図で直感的に</strong><small>見て、動かしながら理解する</small></label><label class="lt-choice"><strong><input type="radio" name="style" value="math"> 数式も使って</strong><small>仕組みまで詳しく確かめる</small></label></div><label class="lt-field">追加の要望<textarea name="notes" required placeholder="知りたいことを自由に入力してください"></textarea></label><button type="submit" class="primary">この内容で続ける</button></form></div>`
const wave = `<div class="lt-stack"><h3>波が重なると、模様になる</h3><p class="lt-muted">波源の間隔を変えて、打ち消し合う場所を確かめてみましょう。</p><canvas id="wave" width="720" height="310" style="width:100%;height:auto;border-radius:12px"></canvas><label class="lt-field">波源の間隔 <output id="value">180</output><input id="gap" type="range" min="40" max="300" value="180"></label><p class="lt-muted">青緑は谷、桃色は山。暗い筋は変位が小さい場所です。</p><script>const canvas=document.getElementById('wave');const ctx=canvas.getContext('2d');const slider=document.getElementById('gap');const saved=lantern.getState();if(saved&&saved.gap)slider.value=saved.gap;function draw(){const d=Number(slider.value);document.getElementById('value').textContent=d;const img=ctx.createImageData(720,310);for(let y=0;y<310;y++)for(let x=0;x<720;x++){const a=Math.sin(Math.hypot(x-360+d/2,y-155)*.065)+Math.sin(Math.hypot(x-360-d/2,y-155)*.065);const v=Math.abs(a)/2;const i=(y*720+x)*4;img.data[i]=a>0?25+210*v:15;img.data[i+1]=a<0?25+170*v:20;img.data[i+2]=a>0?30+140*v:30+185*v;img.data[i+3]=255;}ctx.putImageData(img,0,0);ctx.fillStyle='white';for(const x of [360-d/2,360+d/2]){ctx.beginPath();ctx.arc(x,155,3,0,7);ctx.fill();}}slider.oninput=()=>{draw();lantern.setState({gap:Number(slider.value)})};draw();</script></div>`
function* text(t,index=0){yield {type:'block-start',index,blockType:'text'};yield {type:'text-delta',index,text:t};yield {type:'block-end',index,block:{type:'text',text:t}}}
class Fixture extends LlmAdapter {
  providerInfo(provider){return {id:provider,name:'Lantern deterministic E2E'}}
  async listModels(provider){return [{provider,id:'lantern-fixture',name:'Lantern E2E (no API)'}]}
  async resolveModel(provider,model){return {provider,id:model,name:'Lantern E2E',context:{contextWindow:131072},defaultMaxTokens:8192}}
  async *stream(options){
    const prompts=options.messages.filter(m=>m.role==='system').map(m=>m.content?.map?.(b=>b.text||'').join('')||'').join('\n')+'\n'+(options.system||'')
    appendFileSync(log,JSON.stringify({session:options.sessionId,automatic:prompts.includes('Use show_visual proactively'),tools:options.tools?.map(t=>t.name),purpose:options.purpose})+'\n')
    if(options.purpose){yield* text('Lantern 検証');yield {type:'finish',reason:{kind:'stop'}};return}
    const key=options.sessionId||'default'; const count=seen.get(key)||0;seen.set(key,count+1)
    if(count===0){
      const user=options.messages.filter(m=>m.role==='user').flatMap(m=>m.content||[]).map(b=>b.text||'').join('\n')
      const isForm=user.includes('FORM')
      yield* text(isForm?'説明をあなたに合わせるため、条件を教えてください。':'2つの波の重なり方は、実際に動かしてみるとよく分かります。')
      const id='lantern-e2e-'+Date.now();const args=JSON.stringify({title:isForm?'説明の条件':'波の干渉',html:isForm?form:wave,await_response:isForm})
      yield {type:'block-start',index:1,blockType:'tool-call'}
      for(let i=0;i<args.length;i+=120){options.signal?.throwIfAborted();yield {type:'tool-call-delta',index:1,id,name:'show_visual',argumentsDelta:args.slice(i,i+120)};await new Promise(r=>setTimeout(r,15))}
      yield {type:'block-end',index:1,block:{type:'tool-call',id,name:'show_visual',arguments:args}}
      yield {type:'finish',reason:{kind:'tool-calls'}}
    }else{
      yield* text('この図や入力は会話の中に残ります。\n\n暗い筋では2つの波が打ち消し合います。波源の間隔を変えると、模様の変化を確かめられます。')
      yield {type:'usage',usage:{inputTokens:100,outputTokens:80}}
      yield {type:'finish',reason:{kind:'stop'}}
    }
  }
}
export function apply(ctx){ctx.llm.registerAdapter(['lantern-fixture'],new Fixture())}
