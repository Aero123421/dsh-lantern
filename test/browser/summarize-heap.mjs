/** Inspect only the synthetic snapshots produced by the local browser suites. */
import {readFile,writeFile}from'node:fs/promises'
import{dirname,join}from'node:path'

for(const path of process.argv.slice(2)){
  const data=JSON.parse(await readFile(path,'utf8'))
  const meta=data.snapshot.meta,nf=meta.node_fields,ef=meta.edge_fields
  const nt=meta.node_types[nf.indexOf('type')],et=meta.edge_types[ef.indexOf('type')]
  const nodes=data.nodes,edges=data.edges,strings=data.strings,n=nf.length,e=ef.length
  const objects=new Map();let edge=0
  for(let i=0;i<nodes.length;i+=n){
    const count=nodes[i+nf.indexOf('edge_count')]
    if(nt[nodes[i+nf.indexOf('type')]]==='object'){
      const props=new Map()
      for(let j=0;j<count;j++){
        const k=edge+j*e
        if(et[edges[k+ef.indexOf('type')]]==='property')props.set(strings[edges[k+ef.indexOf('name_or_index')]],edges[k+ef.indexOf('to_node')])
      }
      objects.set(i,props)
    }
    edge+=count*e
  }
  const value=i=>strings[nodes[i+nf.indexOf('name')]]
  const records=[]
  for(const[i,p]of objects){
    const args=objects.get(p.get('args'))
    if(!p.has('callId')||!p.has('sessionId')||!args?.has('html')||!args.has('await'))continue
    records.push({nodeId:nodes[i+nf.indexOf('id')],callId:value(p.get('callId')),sessionId:value(p.get('sessionId'))})
  }
  let dsh
  try{dsh=JSON.parse(await readFile(join(dirname(path),'dsh-registry-heap.json'),'utf8'))}catch{}
  const summary={snapshot:path,definition:'objects matching callId/sessionId/args.html/args.await, not a plugin-only byte measurement',records,
    bulkRecords:records.filter(r=>r.callId==='bulk'&&r.sessionId.startsWith('bulk-')).length,
    ...dsh?{activeCallIds:dsh.active,inactiveCallIds:dsh.inactive,inactiveRecords:records.filter(r=>dsh.inactive.includes(r.callId))}:{}}
  await writeFile(path+'.summary.json',JSON.stringify(summary,null,2))
  console.log(JSON.stringify({snapshot:path,matchingObjects:records.length,bulkRecords:summary.bulkRecords,inactiveRecords:summary.inactiveRecords?.length}))
}
