import {sheet,lane,box,store,edge} from './diagram-kit.mjs';
const body=[
 lane(40,120,320,760,'KNOWLEDGE PLANE','Source owner · controlled refresh'),
 lane(400,120,790,760,'APPLICATION TRUST BOUNDARY','Backend enforces identity, retrieval scope, and response checks'),
 lane(1230,120,330,470,'MODEL SERVICE BOUNDARY','Send only approved, necessary context'),
 store(70,190,260,140,'Approved documents',['Policies · procedures','Owner · version · date']),
 box(70,410,260,130,'Ingestion pipeline',['Parse + chunk + source IDs','Quality + permissions'],'data'),
 store(70,680,260,140,'Search index',['Keyword + vector retrieval','Passage text + ACL metadata']),
 box(440,180,250,110,'Business application',['Question + user identity','Receives checked answer']),
 box(810,180,330,110,'Identity & access policy',['Authenticate + user scope','Reject unauthorized requests'],'control'),
 box(440,390,310,130,'Retrieval service',['Permissions + freshness','Search + rerank passages'],'data'),
 box(830,390,310,130,'Context assembler',['Question + cited passages','Bounded context; separate rules']),
 box(1270,390,250,130,'LLM inference',['Generate a draft','Draft + source IDs'],'model'),
 box(440,660,310,130,'Response validator',['Citations + material claims','Flag gaps or conflicts'],'control'),
 box(830,660,310,130,'Cited response',['Answer + source provenance','Limits + unresolved gaps']),
 box(1270,690,250,100,'Knowledge owner',['Review evidence gaps'],'human'),
 edge('M200 330 V404','prepare',215,381,'async'),
 edge('M200 540 V670','refresh index',215,595,'async'),
 edge('M690 235 H802','request',717,220),
 edge('M975 290 V337 H595 V382','authorized scope',725,327),
 edge('M330 750 H380 V455 H432','passages',343,607),
 edge('M750 455 H822','context',756,440),
 edge('M1140 455 H1262','model request',1155,438),
 edge('M1395 520 V590 H595 V652','draft + source IDs',960,579),
 edge('M750 722 H822','checked',759,707),
 edge('M750 765 H780 V845 H1395 V798','insufficient evidence → human escalation',837,834,'control')
].join('');
sheet({title:'01  Governed document retrieval (RAG)',subtitle:'Business question → permission-aware evidence → grounded draft → validation or human escalation',body,footer:'Source owner approves knowledge. Backend enforces access. Citations and validation support review; they do not guarantee truth.',output:'site/diagrams/governed-rag.svg'});
