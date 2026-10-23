import {evaluateScenario} from './simulator-engine.mjs';
const root=document.querySelector('#decision-simulator');
const titles=['Customer','Facts','Suggestion','Decision'];
const situations={ready:{},stale:{stale:true},outage:{outage:true},conflict:{conflict:true},unauthorized:{unauthorized:true}};
let stage=0;
let reached=0;
let review=null;
let situation='ready';
const money=value=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(value);
const getState=()=>evaluateScenario(situations[situation],review);
const stepLimit=state=>!state.evidenceReady?1:!state.canApprove?2:3;
const detail=root.querySelector('#sim-detail');
const next=root.querySelector('#sim-next');
const announcement=root.querySelector('#sim-announcement');
function focusStep(){
  root.querySelector('#sim-step-title').focus({preventScroll:true});
  detail.scrollIntoView({block:'start',behavior:'instant'});
}
function technical(title,body){return `<details class="renewal-technical"><summary>${title}</summary><div>${body}</div></details>`;}
function issueMessage(state){
  const explanations={CRM:['The customer information is too old.','Ask Sales operations to refresh the record.'],Billing:['The invoice system did not respond.','Ask the billing service owner to restore the connection.'],Policy:['Two current policies allow different discounts: 5% and 10%.','Ask the finance policy owner which rule applies.']};
  return `<div class="renewal-alert" role="note"><strong>We need help before AI can suggest a discount.</strong><ul>${state.issues.map(issue=>{const [reason,action]=explanations[issue.source];return `<li>${reason} <span>${action}</span></li>`;}).join('')}</ul><p>The AI waits for reliable information. It does not guess.</p><button type="button" id="sim-fix">Use the corrected example</button></div>`;
}
function render(){
  const state=getState();
  // A previously visited step cannot bypass a new evidence or permission failure.
  stage=Math.min(stage,stepLimit(state));
  reached=Math.min(reached,stepLimit(state));
  root.querySelector('#sim-steps').innerHTML=titles.map((title,i)=>`<li><button type="button" data-stage="${i}" ${i===stage?'aria-current="step"':''} ${i>reached?'disabled':''} aria-label="Step ${i+1}: ${title}"><span aria-hidden="true">${i<stage?'✓':i+1}</span><b>${title}</b></button></li>`).join('');
  const facts=`<ul class="renewal-facts"><li><span class="renewal-fact-icon" aria-hidden="true">${situation==='stale'?'!':'✓'}</span><div><strong>Customer information</strong><p>${situation==='stale'?'45 days old. It needs to be updated before we continue.':'Updated 2 days ago. The contract renews within 30 days.'}</p></div></li><li><span class="renewal-fact-icon" aria-hidden="true">${situation==='outage'?'!':'✓'}</span><div><strong>Overdue payments</strong><p>${situation==='outage'?'We cannot load the invoices, so the balance is unknown.':'$0 in undisputed overdue payments. A separate $2,000 invoice is disputed and needs finance review.'}</p></div></li><li><span class="renewal-fact-icon" aria-hidden="true">${situation==='conflict'?'!':'✓'}</span><div><strong>Discount policy</strong><p>${situation==='conflict'?'Two applicable rules disagree: one allows 5%, the other 10%.':'Up to 10% off is allowed, subject to eligibility and a person’s approval.'}</p></div></li></ul>`;
  const proposal=`<div class="renewal-price"><div><span>Current annual price</span><strong>${money(state.annualValue)}</strong></div><span aria-hidden="true">→</span><div><span>Proposed annual price</span><strong>${money(state.offerValue)}</strong></div></div><p class="renewal-saving">10% discount = ${money(state.discount)} off the annual price.</p>`;
  const pages=[
    `<h3 id="sim-step-title" tabindex="-1">Meet Northstar Manufacturing</h3><p class="renewal-lead">Their contract renews in 30 days. The account manager wants 10% off. AI checks the facts; you make the final decision.</p><div class="renewal-customer"><div><span>Yearly price</span><strong>$120,000</strong></div><div><span>Discount</span><strong>10%</strong></div></div><p class="renewal-takeaway"><strong>Your role:</strong> Check the facts, review the suggestion, and decide. Nothing in this example affects a real customer.</p>`,
    `<h3 id="sim-step-title" tabindex="-1">Does the AI have reliable information?</h3><p class="renewal-lead">Before making a suggestion, it checks three things.</p>${facts}${state.evidenceReady?'<div class="renewal-success"><strong>The facts are ready.</strong> Next, see what AI suggests.</div>':issueMessage(state)}${technical('Why these checks matter',`<p>A missing invoice result is not a zero balance. Old customer records and conflicting policies must be resolved before the agent makes a recommendation.</p><p>The approved measure is <code>undisputed_overdue_usd</code>: customer C-104, USD, past-due invoices, excluding disputed invoices. Each row represents one invoice. Summing every outstanding invoice would answer a different question; joining invoices to their lines can also double-count balances.</p><p>Evidence owners: Sales operations (CRM v18), Contract operations (contract v3), and Finance (invoice view v7; policy P-7). Only this customer’s authorized records are retrieved.</p>`)}`,
    `<h3 id="sim-step-title" tabindex="-1">Here is the AI’s suggestion</h3><p class="renewal-lead">“Propose 10% off the renewal. The policy allows it, and there are no undisputed overdue payments. Ask a person to approve.”</p>${proposal}<ul class="renewal-checks"><li>✓ The calculation is correct.</li><li>✓ The discount is within the policy limit.</li><li>${state.canApprove?'✓ The system has permission to save this proposal.':'! The system does not have permission to save this proposal.'}</li></ul>${state.canApprove?'<div class="renewal-success"><strong>Ready for your review.</strong> The proposal has not been saved.</div>':'<div class="renewal-alert"><strong>This action is blocked.</strong><p>The proposal targets the East business unit, but this account can only save proposals for West. A reviewer cannot override that permission.</p><p>Ask the access owner to resolve it before continuing.</p><button type="button" id="sim-fix">Use the corrected example</button></div>'}${technical('How the suggestion is prepared',`<p>This is a scripted AI draft. A calculation tool checks $120,000 × 10% = $12,000, then $120,000 − $12,000 = $108,000. Separate policy and permission checks run outside the LLM.</p><p><strong>Short-term context:</strong> this renewal question and current tool results. <strong>Long-term memory:</strong> a reviewed preference to contact the customer by email. Remembered balances never replace a fresh billing query.</p><p><strong>Business knowledge:</strong> approved policy P-7 and its scope. The context includes evidence and versions, excludes other customers’ information, and cannot grant new permissions or rewrite system rules.</p>`)}`,
    `<h3 id="sim-step-title" tabindex="-1">${state.review?'Here is what happened':'Would you approve saving this proposal?'}</h3>${state.review?`<div class="renewal-result ${state.recorded?'':'declined'}" tabindex="-1"><span aria-hidden="true">${state.recorded?'✓':'—'}</span><h4>${state.recorded?'Proposal saved in this example':'Proposal declined'}</h4><p>${state.recorded?'You approved the $108,000 renewal proposal. Nothing was sent to the customer, and the contract was not renewed.':'You declined the proposal. Nothing was saved or sent to the customer.'}</p></div><p class="renewal-takeaway"><strong>What you learned:</strong> AI can help prepare a decision. Reliable facts, system permissions, and human review determine whether an action can go ahead.</p>`:`<p class="renewal-lead">You have the final say. Review the amount, then choose an option below.</p>${proposal}<p>Save an internal proposal for <strong>Northstar Manufacturing / West</strong>. This does not send a customer offer or renew the contract.</p><div class="renewal-review"><button type="button" id="sim-approve">Approve this proposal</button><button type="button" id="sim-reject">Decline</button></div>`}${technical('How would we know this helped?',`<p>The $12,000 discount is a concession, not a realized benefit. Track customer acceptance, retention, contribution margin, errors, and reviewer effort against a comparison group.</p><p>Illustrative process estimate: a 30-minute manual review compared with a 12-minute assisted review would free 18 minutes per case, including human review. Actual time saved and full costs must be measured in a pilot.</p>`)}${technical('See the decision record',`<ol><li>Customer C-104 / West; current, authorized evidence checked.</li><li>Metric: $0 undisputed overdue; disputed $2,000 flagged separately.</li><li>Contract v3, CRM v18, invoice view v7, and policy P-7 support a 10% proposal.</li><li>Calculation, eligibility, and write permission passed.</li><li>${state.recorded?'You approved the exact proposal. A simulated backend recheck recorded receipt R-104.':state.review==='rejected'?'You declined; no write occurred.':'No action recorded; waiting for your decision.'}</li></ol>`)}`
  ];
  detail.innerHTML=`<p class="renewal-step-label">STEP ${stage+1} OF 4</p>${situation!=='ready'?`<p class="renewal-situation">Trying: ${root.querySelector('#sim-scenario').selectedOptions[0].textContent}</p>`:''}${pages[stage]}`;
  root.querySelector('#sim-back').hidden=stage===0;
  root.querySelector('#sim-progress').textContent=`${stage+1} of 4`;
  next.hidden=stage===3&&!state.review;
  next.disabled=stage<3&&stage>=stepLimit(state);
  next.textContent=stage===0?'Check the facts →':stage===1?(state.evidenceReady?'See the AI suggestion →':'Waiting for reliable facts'):stage===2?(state.canApprove?'Review the proposal →':'Permission needed to continue'):'Try a different situation →';
  root.querySelectorAll('[data-stage]').forEach(button=>button.addEventListener('click',()=>{const target=Number(button.dataset.stage);if(target<=reached&&target<=stepLimit(getState())){stage=target;render();focusStep();}}));
  root.querySelector('#sim-fix')?.addEventListener('click',()=>{
    situation='ready';review=null;root.querySelector('#sim-scenario').value='ready';
    announcement.textContent='The example is corrected. All required information is current, the rules agree, and the proposal targets West.';
    render();focusStep();
  });
  for(const [id,decision] of [['sim-approve','approved'],['sim-reject','rejected']])root.querySelector(`#${id}`)?.addEventListener('click',()=>{
    if(!getState().canApprove)return;
    review=decision;render();focusStep();
  });
}
next.addEventListener('click',()=>{
  if(stage===3){const scenarios=root.querySelector('#sim-scenarios');scenarios.open=true;scenarios.scrollIntoView({block:'start',behavior:'instant'});root.querySelector('#sim-scenario').focus({preventScroll:true});return;}
  if(stage>=stepLimit(getState()))return;
  stage++;reached=Math.max(reached,stage);render();focusStep();
});
root.querySelector('#sim-back').addEventListener('click',()=>{stage=Math.max(0,stage-1);render();focusStep();});
root.querySelector('#sim-scenario').addEventListener('change',event=>{
  const hadDecision=review!==null;
  situation=event.target.value;review=null;stage=1;reached=1;
  announcement.textContent=hadDecision?'Situation changed. Your previous decision was cleared. Let’s check the facts again.':'Situation changed. Let’s check the facts again.';
  render();focusStep();
});
root.querySelector('#sim-reset').addEventListener('click',()=>{
  situation='ready';review=null;stage=0;reached=0;root.querySelector('#sim-scenario').value='ready';root.querySelector('#sim-scenarios').open=false;
  announcement.textContent='Walkthrough restarted with the original example.';render();focusStep();
});
render();
