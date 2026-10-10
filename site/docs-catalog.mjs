// One content map drives the sidebar, overview cards, breadcrumbs, and pagination.
export const sections = [
  {id:'learn',title:'LLM basics & reasoning',element:'llm-foundations',description:'Understand tokens, vectors, training, and the limits of model reasoning.',topics:[
    ['tokens-probability','Tokens & probability','llm-tokens-probability'],['embeddings','Embeddings & similarity','llm-embeddings'],['attention','Attention & context','llm-attention'],['transformer-layers','Transformer layers','llm-transformer-layers'],['training','Training & gradient descent','llm-training'],['sampling','Temperature & sampling','llm-sampling'],['reasoning','Reasoning & intermediate steps','llm-reasoning'],['verification','Verification & error','llm-verification'],['reasoning-compute','Reasoning training & compute','llm-reasoning-compute']
  ]},
  {id:'foundations',title:'Business & data foundations',element:'trusted-ai',description:'Prepare reliable sources, business meaning, memory, governance, and evaluations.',topics:[
    ['data','Data foundations','data-foundations'],['semantics','Database semantics','database-semantics'],['memory','Retrieval & memory','retrieval-memory'],['knowledge','Governed business knowledge','knowledge-products'],['human-oversight','Human oversight','human-oversight'],['value','Business value & ROI','business-value'],['capabilities','Agents, tools & skills','agent-extension'],['evaluation','Evaluation & release gates','agent-evaluation']
  ]},
  {id:'designs',title:'System designs',element:'architecture-library',description:'Explore component architectures, interfaces, trust boundaries, and control points.',kind:'blueprint',topics:[
    ['rag','Governed RAG',null,0],['semantic-database','Semantic database access',null,1],['memory','Retrieval & memory architecture',null,2],['agents','Agents & human approval',null,3]
  ]},
  {id:'practice',title:'Use cases & walkthroughs',element:'use-cases',description:'Compare practical patterns, then follow an interactive business decision.',kind:'pattern',topics:[
    ['assistant','Basic assistant',null,0],['retrieval','Document retrieval',null,1],['business-data','Live business data',null,2],['approval','Approval workflow',null,3],['renewal','Renewal decision simulator','decision-simulator']
  ]},
  {id:'operate',title:'Business operating model',element:'operating-model',description:'Define ownership, prove readiness, and monitor outcomes after rollout.',topics:[
    ['decision','Define the decision','define-decision'],['release','Prove it before release','prove-before-release'],['monitor','Observe & intervene','observe-intervene']
  ]}
];
export const pages = sections.flatMap(section=>[
  {path:`/${section.id}`,title:section.title,section,overview:true},
  ...section.topics.map(([id,title,element,index])=>({path:`/${section.id}/${id}`,title,element,index,section}))
]);
const aliases = new Map(sections.map(section=>[section.element,`/${section.id}`]));
for (const page of pages) if(page.element) aliases.set(page.element,page.path);
export function resolvePage(hash) {
  let fragment;
  try { fragment=decodeURIComponent(hash.replace(/^#/,'')); } catch { return null; }
  if(!fragment || fragment==='/') return {path:'/',title:'Documentation home',home:true};
  const path=aliases.get(fragment) || fragment.replace(/\/$/,'');
  return pages.find(page=>page.path===path) || null;
}
export function adjacentPages(page) {
  if(!page?.section) return {};
  const siblings=pages.filter(item=>item.section.id===page.section.id);
  const index=siblings.findIndex(item=>item.path===page.path);
  return {previous:siblings[index-1],next:siblings[index+1]};
}
