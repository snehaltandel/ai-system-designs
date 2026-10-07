const blueprints = [
  {name:'Governed RAG',label:'01 / KNOWLEDGE ASSISTANT',title:'Ground answers in approved business knowledge',file:'governed-rag.svg',purpose:'A component architecture for a document assistant, with separate preparation and request paths.',read:'Start with the business application. Follow the request through identity, retrieval, context assembly, the model service, and response validation. The dashed path prepares and refreshes the search index.',boundary:'The application backend enforces source access. The model service receives only the approved context. Missing or conflicting evidence goes to a knowledge owner.',caption:'Source systems, ingestion, search index, access policy, context assembler, model service, response validator, and human escalation.'},
  {name:'Semantic database',label:'02 / GOVERNED ANALYTICS',title:'Translate business questions into the right data',file:'semantic-database.svg',purpose:'A system design for approved metrics and relational queries, with semantics separated from execution.',read:'Follow the question into the semantic catalog and query planning path, then into the read-only database and result checks. Metric definitions and join rules guide the query.',boundary:'Database permissions and query validation sit outside the LLM. Business correctness is checked against the approved metric, grain, filters, and reporting period.',caption:'User application, semantic definitions, query planning and validation, governed database access, and result reconciliation.'},
  {name:'Retrieval & memory',label:'03 / CONTEXT ARCHITECTURE',title:'Use task state and durable memory without mixing them',file:'retrieval-memory.svg',purpose:'A context architecture showing where current task state, approved knowledge, and long-term memory live.',read:'Trace the read path into context assembly and the model, then follow the controlled write path back to memory. Session state and reusable records remain distinct stores.',boundary:'Identity and scope govern every read and write. Durable memory needs provenance, retention, and correction; current authoritative records take precedence over old memories.',caption:'Scoped retrieval, short-term state, long-term memory, authoritative sources, context assembly, response checks, and memory write controls.'},
  {name:'Agents & approval',label:'04 / CONTROLLED EXECUTION',title:'Delegate work while keeping actions under control',file:'agent-orchestration.svg',purpose:'An orchestration architecture with specialist capabilities, versioned skills, tool boundaries, and a human approval gate.',read:'Start at the orchestrator, which routes bounded tasks to specialist capabilities. Follow proposals through validation, reviewer approval, and authorized execution.',boundary:'Skills and delegation do not grant permissions. The backend checks policy before execution, binds approval to the exact proposal, and records the result.',caption:'Orchestrator, skill registry, specialist agents, tool gateway, policy checks, human approval, execution, and audit records.'}
];
const blueprintButtons = document.querySelector('#blueprint-tabs');
const blueprintPanel = document.querySelector('#blueprint-panel');
const drawingDialog = document.querySelector('#drawing-dialog');
function renderBlueprint(index) {
  const item=blueprints[index];
  blueprintButtons.querySelectorAll('button').forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));
  blueprintPanel.innerHTML=`<div class="blueprint-header"><div><p class="eyebrow">${item.label}</p><h3>${item.title}</h3><p>${item.purpose}</p></div><div class="drawing-actions"><button type="button" id="expand-drawing">Enlarge drawing ↗</button><button type="button" id="fit-overview" aria-pressed="false">Fit full drawing</button><a href="diagrams/${item.file}" download>Download SVG ↓</a></div></div>
    <figure class="blueprint-figure"><div class="blueprint-canvas" tabindex="0" role="region" aria-label="Architecture drawing. Scroll horizontally on smaller screens."><img src="diagrams/${item.file}?v=5" alt="${item.caption}" width="1600" height="1000"></div><figcaption>Component architecture · Arrows show interfaces; dashed boundaries show system responsibility. <span>Scroll to explore the complete drawing on a small screen.</span></figcaption></figure>
    <div class="blueprint-notes"><section><h4>How to read it</h4><p>${item.read}</p></section><section><h4>Where control lives</h4><p>${item.boundary}</p></section></div>`;
  document.querySelector('#fit-overview').addEventListener('click', event=>{
    const fit=document.querySelector('.blueprint-canvas').classList.toggle('fit-overview');
    event.currentTarget.setAttribute('aria-pressed',String(fit));
    event.currentTarget.textContent=fit?'Show readable size':'Fit full drawing';
  });
  document.querySelector('#expand-drawing').addEventListener('click',()=>{
    document.querySelector('#drawing-title').textContent=item.title;
    const expanded=document.querySelector('#expanded-drawing');
    expanded.src=`diagrams/${item.file}?v=5`; expanded.alt=item.caption;
    document.querySelector('#drawing-scale').value='fit';
    expanded.style.width='100%'; expanded.style.minWidth='0';
    drawingDialog.showModal();
  });
}
blueprints.forEach((item,index)=>{
  const button=document.createElement('button');button.type='button';
  button.innerHTML=`<span>0${index+1}</span>${item.name}`;
  button.addEventListener('click',()=>renderBlueprint(index));blueprintButtons.append(button);
});
document.querySelector('#close-drawing').addEventListener('click',()=>drawingDialog.close());
document.querySelector('#drawing-scale').addEventListener('change',event=>{
  const image=document.querySelector('#expanded-drawing');
  image.style.width=event.target.value==='fit'?'100%':`${1600*Number(event.target.value)}px`;
});
renderBlueprint(0);
