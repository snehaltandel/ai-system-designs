import {sections,pages,resolvePage,adjacentPages} from './docs-catalog.mjs';
const sidebar=document.querySelector('#docs-sidebar');
const tree=document.querySelector('#docs-tree');
const search=document.querySelector('#docs-search');
const menu=document.querySelector('#docs-menu');
const content=document.querySelector('#docs-content');
const mobile=window.matchMedia('(max-width: 900px)');
let page;
let searchExpansion;
const topSections=[...content.querySelectorAll(':scope > section')];
const topicDetails=[...document.querySelectorAll('.topic-grid > details,.guide-topics > details')];
const heading=document.querySelector('#docs-page-heading');
const breadcrumbs=document.querySelector('#docs-breadcrumbs');
const pagination=document.querySelector('#docs-pagination');
const home=document.querySelector('#docs-home');
const escapeText=value=>value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const link=(item)=>`<a href="#${item.path}">${item.title}</a>`;
function setNavigation(open,returnFocus=false){
  sidebar.hidden=!open;
  content.inert=open && mobile.matches;
  document.body.classList.toggle('docs-nav-closed',!open);
  document.body.classList.toggle('docs-mobile-open',open && mobile.matches);
  menu.setAttribute('aria-expanded',String(open));
  document.querySelector('#docs-backdrop').hidden=!(open && mobile.matches);
  if(returnFocus) menu.focus();
}
function cards(section) {
  return `<div class="docs-topic-cards">${pages.filter(item=>item.section.id===section.id && !item.overview).map(item=>{
    const element=item.element && document.getElementById(item.element);
    const excerpt=element?.querySelector('.topic-body > p,.guide-body > p')?.textContent || element?.querySelector(':scope > p')?.textContent;
    return `<a href="#${item.path}"><span>${item.index!==undefined?(section.kind==='blueprint'?'REFERENCE DESIGN':'USE CASE'):item.element==='decision-simulator'?'INTERACTIVE WALKTHROUGH':'GUIDE'}</span><h3>${item.title}</h3>${excerpt?`<p>${escapeText(excerpt)}</p>`:''}<b aria-hidden="true">Read topic →</b></a>`;
  }).join('')}</div>`;
}
function buildNavigation(){
  tree.innerHTML=sections.map(section=>`<details data-section="${section.id}"><summary>${section.title}<span>${section.topics.length}</span></summary><ul><li>${link({path:`/${section.id}`,title:'Section overview'})}</li>${pages.filter(item=>item.section.id===section.id&&!item.overview).map(item=>`<li>${link(item)}</li>`).join('')}</ul></details>`).join('');
  home.innerHTML=`<div class="docs-welcome"><p class="eyebrow">DOCUMENTATION HOME</p><h1>AI system design,<br>from concept to business.</h1><p>Understand how LLMs work, connect them to reliable business sources, and put checks around decisions and actions.</p><div class="docs-start"><a href="#/learn/tokens-probability">Start with LLM basics →</a><a href="#/designs">Explore system designs →</a></div></div><h2>Explore the documentation</h2><div class="docs-home-cards">${sections.map((section,i)=>`<a href="#/${section.id}"><span>0${i+1} / ${section.topics.length} TOPICS</span><h3>${section.title}</h3><p>${section.description}</p><b aria-hidden="true">Explore section →</b></a>`).join('')}</div><aside class="docs-reading-path"><h2>A suggested reading path</h2><p>Begin with LLM basics, establish the business and data foundations, then choose a system design. Try the renewal simulator and use the operating model to plan a controlled pilot.</p></aside>`;
  for(const section of sections){
    const overview=document.createElement('div');overview.className='docs-section-overview';overview.dataset.overview=section.id;
    overview.innerHTML=`<p class="docs-section-intro">${section.description}</p><h2>Topics in this section</h2>${cards(section)}`;
    const container=document.getElementById(section.element);
    const supporting=[...container.querySelectorAll(':scope > .foundation-intro,:scope > .library-intro,:scope > .foundation-map,:scope > .engine-flow,:scope > .principle,:scope > .reading')];
    if(supporting.length){
      const notes=document.createElement('details');notes.className='docs-overview-notes';
      const summary=document.createElement('summary');summary.textContent='Overview notes & further reading';notes.append(summary);
      supporting.forEach(item=>notes.append(item));overview.append(notes);
    }
    container.prepend(overview);
  }
}
function filterNavigation(){
  const query=search.value.trim().toLowerCase();
  if(query && !searchExpansion) searchExpansion=[...tree.querySelectorAll('details')].map(item=>item.open);
  let count=0;
  tree.querySelectorAll('details').forEach((branch,index)=>{
    const section=sections[index];let matches=0;
    branch.querySelectorAll('li').forEach(row=>{
      const match=!query || `${section.title} ${row.textContent}`.toLowerCase().includes(query);
      row.hidden=!match;
      if(match){matches++;if(row.querySelector('a').hash!==`#/${section.id}`)count++;}
    });
    branch.hidden=matches===0;
    if(query)branch.open=matches>0;
    else if(searchExpansion)branch.open=searchExpansion[index];
  });
  if(!query)searchExpansion=undefined;
  document.querySelector('#docs-search-status').textContent=query?`${count} matching topic${count===1?'':'s'}${count===0?'. Try another term.':''}`:'';
}
function route(focus=false){
  const old=page;
  page=resolvePage(location.hash);
  if(search.value){search.value='';filterNavigation();}
  topicDetails.forEach(item=>{item.hidden=true;item.open=false;});
  topSections.forEach(section=>{section.hidden=true;section.classList.remove('docs-topic-view','docs-overview-view');});
  document.querySelectorAll('.docs-section-overview').forEach(item=>item.hidden=true);
  home.hidden=true;heading.hidden=false;breadcrumbs.hidden=false;pagination.hidden=true;
  if(!page){
    heading.innerHTML='<p class="eyebrow">PAGE NOT FOUND</p><h1>This topic could not be found.</h1><p>Use the sidebar to choose a topic, or return to the <a href="#/">documentation home</a>.</p>';
    breadcrumbs.innerHTML='<ol><li><a href="#/">Documentation home</a></li><li aria-current="page">Page not found</li></ol>';
    document.title='Page not found — AI System Designs';
  }else if(page.home){
    home.hidden=false;heading.hidden=true;
    breadcrumbs.innerHTML='<ol><li aria-current="page">Documentation home</li></ol>';
    document.title='AI System Designs — Documentation home';
  }else{
    const section=page.section;
    const parent=document.getElementById(section.element);
    const selected=page.element && document.getElementById(page.element);
    const visible=page.element==='decision-simulator'?selected:parent;
    visible.hidden=false;
    visible.classList.add(page.overview?'docs-overview-view':'docs-topic-view');
    heading.innerHTML=`<p class="eyebrow">${page.overview?'SECTION OVERVIEW':section.title}</p><h1>${page.title}</h1>`;
    breadcrumbs.innerHTML=`<ol><li><a href="#/">Documentation home</a></li>${page.overview?`<li aria-current="page">${section.title}</li>`:`<li><a href="#/${section.id}">${section.title}</a></li><li aria-current="page">${page.title}</li>`}</ol>`;
    if(page.overview)parent.querySelector('.docs-section-overview').hidden=false;
    else if(selected?.tagName==='DETAILS'){selected.hidden=false;selected.open=true;}
    else if(section.kind==='blueprint')window.AISystemDesigns.selectBlueprint(page.index);
    else if(section.kind==='pattern' && page.index!==undefined)window.AISystemDesigns.selectPattern(page.index);
    if(section.id==='operate')parent.querySelectorAll('.operations > article').forEach(item=>item.hidden=page.overview||item!==selected);
    const {previous,next}=adjacentPages(page);
    pagination.innerHTML=`${previous?`<a href="#${previous.path}"><small>← Previous</small><strong>${previous.title}</strong></a>`:'<span></span>'}${next?`<a href="#${next.path}"><small>Next →</small><strong>${next.title}</strong></a>`:`<a href="#/"><small>Back to root</small><strong>Documentation home →</strong></a>`}`;
    pagination.hidden=false;
    document.title=`${page.title} — AI System Designs`;
  }
  tree.querySelectorAll('a').forEach(anchor=>{
    const active=page && anchor.hash===`#${page.path}`;
    if(active)anchor.setAttribute('aria-current','page');else anchor.removeAttribute('aria-current');
  });
  document.querySelector('.docs-home-link').toggleAttribute('aria-current',Boolean(page?.home));
  if(page?.home)document.querySelector('.docs-home-link').setAttribute('aria-current','page');
  if(page?.section)tree.querySelector(`[data-section="${page.section.id}"]`).open=true;
  if(!sidebar.hidden)tree.querySelector('[aria-current="page"]')?.scrollIntoView({block:'nearest',behavior:'instant'});
  if(mobile.matches)setNavigation(false);
  if(focus && old?.path!==page?.path)content.focus({preventScroll:true});
  window.scrollTo({top:0,behavior:'instant'});
}
buildNavigation();
document.body.classList.add('docs-ready');
setNavigation(!mobile.matches);
route();
document.querySelector('.docs-skip').addEventListener('click',event=>{event.preventDefault();content.focus();});
menu.addEventListener('click',()=>{const open=sidebar.hidden;setNavigation(open);if(open&&mobile.matches)search.focus();});
document.querySelector('#docs-close').addEventListener('click',()=>setNavigation(false,true));
document.querySelector('#docs-backdrop').addEventListener('click',()=>setNavigation(false,true));
search.addEventListener('input',filterNavigation);
document.addEventListener('click',event=>{
  const anchor=event.target.closest('a[href^="#"]');
  if(anchor?.hash===location.hash && resolvePage(anchor.hash)){
    if(mobile.matches)setNavigation(false);
    content.focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});
  }
});
window.addEventListener('hashchange',()=>route(true));
mobile.addEventListener('change',()=>setNavigation(!mobile.matches));
document.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&mobile.matches&&!sidebar.hidden){setNavigation(false,true);return;}
  // Keep keyboard focus within the navigation drawer while it is open.
  if(event.key==='Tab'&&mobile.matches&&!sidebar.hidden){
    const focusables=[...sidebar.querySelectorAll('a,button,input,summary')].filter(item=>item.getClientRects().length);
    const first=focusables[0],last=focusables.at(-1);
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  }
});
