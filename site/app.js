const designs = [
  { name: 'Basic assistant', tag: 'Draft & explain', title: 'A useful first draft, with a person in charge.', description: 'Use for rewriting an email or brainstorming an internal plan when the task does not depend on private or current business facts.', sources: 'User instructions', sourceDetail: 'Task + approved text', context: 'Prompt template', contextDetail: 'Role, limits + desired format', output: 'Draft response', outputDetail: 'Review before use', owner: 'The employee owns the final message.', checks: ['Remove sensitive information before sending it to the model.', 'Require human review for facts, tone, and suitability.', 'Do not treat model memory as a source of current business truth.'], example: 'Draft an onboarding welcome email', evidence: 'Approved onboarding notes supplied by the employee.', answer: 'A draft welcome email that the employee can edit.', failure: 'If required facts are missing, ask for them instead of inventing dates or benefits.', tradeoff: 'Fast and simple, but business knowledge is limited to the context supplied.' },
  { name: 'Document retrieval', tag: 'Answer with evidence', title: 'Connect answers to the documents behind them.', description: 'Retrieval-augmented generation (RAG) selects relevant passages from approved documents and gives them to the LLM with the question.', sources: 'Approved documents', sourceDetail: 'Policies, manuals + contracts', context: 'Permission-aware retrieval', contextDetail: 'Search → relevant passages', output: 'Cited answer', outputDetail: 'Evidence + limitations', owner: 'The knowledge owner approves sources and handles ambiguous policy questions.', checks: ['Enforce document permissions before retrieval and preserve them in the search index.', 'Show source passages, document dates, and citations that support each material claim.', 'Treat retrieved content as data; it cannot override system rules or authorize tools.'], example: 'What is our travel reimbursement policy?', evidence: 'Two approved passages from a fictional travel policy, with dates and source links.', answer: 'A summary tied to those passages, with unresolved exceptions called out.', failure: 'If evidence is missing, outdated, or contradictory, withhold a definitive answer and route to the policy owner.', tradeoff: 'Better grounding, but quality depends on source freshness, retrieval, and permission enforcement.' },
  { name: 'Live business data', tag: 'Understand performance', title: 'Use governed metrics to inform a decision.', description: 'A backend calls approved, read-only business tools. The LLM explains the returned results; the business system calculates the numbers.', sources: 'CRM + data warehouse', sourceDetail: 'Governed metrics + access roles', context: 'Read-only tools', contextDetail: 'Validate query → fetch data', output: 'Decision brief', outputDetail: 'Numbers, assumptions + options', owner: 'The business leader decides; the data owner defines the metrics.', checks: ['Use server-side identity and access controls with a narrow allowlist of tools.', 'Calculate metrics in trusted queries, and show the time window and freshness.', 'Separate observed changes from explanations; verify causes with additional evidence.'], example: 'Why did sales fall last month?', evidence: 'Fictional read-only results for revenue, pipeline, and regional breakdowns.', answer: 'A quantified summary and hypotheses to investigate, with the reporting period shown.', failure: 'If the data tool fails or returns incomplete data, show the gap and avoid a confident diagnosis.', tradeoff: 'Current information, but metric definitions, query validation, and access controls require ongoing ownership.' },
  { name: 'Approval workflow', tag: 'Act with boundaries', title: 'Let AI propose an action. Let controls authorize it.', description: 'AI prepares a structured proposal. Deterministic policy checks and an authorized reviewer decide whether a backend may execute it.', sources: 'Request + business systems', sourceDetail: 'Case record + permitted tools', context: 'Policy + action proposal', contextDetail: 'Validate scope, amount + identity', output: 'Approved execution', outputDetail: 'Human approval → action → log', owner: 'The process owner sets limits; an authorized reviewer approves consequential actions.', checks: ['Use least-privilege tools, explicit action limits, and server-side policy enforcement.', 'Bind approval to the exact action and parameters; recheck policy immediately before execution.', 'Use duplicate prevention, audit logs, timeouts, and a recovery path for partial failures.'], example: 'Propose a customer refund', evidence: 'A fictional order, return record, and approved refund policy.', answer: 'An exact refund proposal for review, followed by execution only after authorization.', failure: 'If eligibility fails or approval is absent, block execution and send the case for manual handling.', tradeoff: 'Can reduce handling time, but actions need stronger controls and operational support than answer generation.' }
];

const diagrams = [
  { summary: 'You supply the task. The LLM drafts. A person checks it before use.', steps: [
    ['Person', 'Sets the task and supplies text', 'human'], ['Input check', 'Remove sensitive information', 'control'], ['Prompt', 'Task + instructions + limits', 'data'],
    ['LLM', 'Generates a draft', 'model'], ['Human review', 'Check facts and edit the draft', 'human'], ['Use the draft', 'Person owns the final message', 'data'] ] },
  { summary: 'Search brings the right evidence to the LLM. The answer must point back to that evidence.', preparation: 'Prepare the knowledge: approved documents → split into passages → searchable index with source dates and permissions. Refresh when documents change.', steps: [
    ['Person', 'Asks a business question', 'human'], ['Access + search', 'Find passages this user may read', 'control'], ['Context package', 'Question + passages + source IDs', 'data'],
    ['LLM', 'Drafts an answer with citations', 'model'], ['Evidence check', 'Verify claims; flag missing support', 'control'], ['Answer or escalate', 'Show sources or ask the owner', 'human'] ] },
  { summary: 'Business systems calculate the numbers. The LLM explains the results. A leader decides what to do.', steps: [
    ['Person', 'Asks about business performance', 'human'], ['Backend tool gate', 'Check identity and allowed query', 'control'], ['CRM / warehouse', 'Read-only query calculates metrics', 'data'],
    ['LLM', 'Explains returned data and limits', 'model'], ['Result check', 'Verify numbers and data freshness', 'control'], ['Business decision', 'Leader reviews evidence and options', 'human'] ] },
  { summary: 'The LLM proposes. Policy and an authorized person approve. Only the backend executes.', steps: [
    ['Request + evidence', 'Case details + approved policy', 'data'], ['LLM proposal', 'Exact action and parameters', 'model'], ['Policy gate', 'Validate eligibility and action limits', 'control'],
    ['Human approval', 'Approve the exact proposed action', 'human'], ['Backend execution', 'Recheck policy; prevent duplicates', 'control'], ['Receipt + audit', 'Record outcome; recover failures', 'data'] ] }
];

function renderDiagram(index) {
  const diagram = diagrams[index];
  const colors = {human: '#fff4df', control: '#e2eee8', data: '#f0f2e9', model: '#17604d'};
  // Follow the top row left-to-right, then the bottom row right-to-left.
  const positions = [[20,35],[320,35],[620,35],[620,220],[320,220],[20,220]];
  const nodes = diagram.steps.map(([title, description, kind], i) => {
    const [x,y] = positions[i];
    const ink = kind === 'model' ? '#ffffff' : '#172a2a';
    return `<g><rect x="${x}" y="${y}" width="260" height="125" rx="10" fill="${colors[kind]}" stroke="#a9bcb0"/><text x="${x+18}" y="${y+28}" fill="${ink}" font-size="14">STEP ${i+1} · ${kind.toUpperCase()}</text><text x="${x+18}" y="${y+59}" fill="${ink}" font-size="20" font-weight="700">${title}</text><text x="${x+18}" y="${y+91}" fill="${ink}" font-size="14">${description}</text></g>`;
  }).join('');
  return `<figure class="architecture"><figcaption><h4>The design at a glance</h4><p>${diagram.summary}</p></figcaption>
    ${diagram.preparation ? `<p class="preparation">${diagram.preparation}</p>` : ''}
    <svg class="architecture-svg" viewBox="0 0 900 370" role="img" aria-labelledby="diagram-title diagram-description" xmlns="http://www.w3.org/2000/svg">
      <title id="diagram-title">${designs[index].name} architecture</title><desc id="diagram-description">${diagram.steps.map(([title,description],i) => `Step ${i+1}: ${title}. ${description}.`).join(' ')}</desc>
      <defs><marker id="flow-head" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8" fill="none" stroke="#17604d" stroke-width="1.5"/></marker></defs>
      <g fill="none" stroke="#17604d" stroke-width="2" marker-end="url(#flow-head)"><path d="M280 98 H312"/><path d="M580 98 H612"/><path d="M750 160 V212"/><path d="M620 283 H588"/><path d="M320 283 H288"/></g>${nodes}
    </svg>
    <ol class="architecture-mobile">${diagram.steps.map(([title,description,kind]) => `<li class="stage-${kind}"><strong>${title}</strong><span>${description}</span></li>`).join('')}</ol>
    <p class="diagram-failure"><strong>If a check fails:</strong> ${designs[index].failure}</p>
    <div class="legend"><span class="legend-data">Data & systems</span><span class="legend-model">LLM</span><span class="legend-control">Checks & controls</span><span class="legend-human">People</span></div>
  </figure>`;
}

const patterns = document.querySelector('#patterns');
const design = document.querySelector('#design');
function render(index) {
  const item = designs[index];
  patterns.querySelectorAll('button').forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
  design.innerHTML = `<div class="design-intro"><p class="eyebrow">${item.tag}</p><h3>${item.title}</h3><p>${item.description}</p></div>
    ${renderDiagram(index)}<div class="details"><section><h4>Checks & balances</h4><ul>${item.checks.map(check => `<li>${check}</li>`).join('')}</ul><p class="owner"><strong>Accountability</strong><br>${item.owner}</p></section>
    <section class="walkthrough"><p class="eyebrow">ILLUSTRATIVE WALKTHROUGH</p><h4>“${item.example}”</h4><dl><dt>Evidence in</dt><dd>${item.evidence}</dd><dt>Result out</dt><dd>${item.answer}</dd><dt>When it goes wrong</dt><dd>${item.failure}</dd></dl></section></div><p class="tradeoff"><strong>The tradeoff</strong> ${item.tradeoff}</p>`;
}
designs.forEach((item, index) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.innerHTML = `<span>0${index + 1}</span>${item.name}`;
  button.addEventListener('click', () => render(index));
  patterns.append(button);
});
render(1);

// Reveal linked lessons and settle section anchors after the dynamic diagram loads.
function revealLinkedTopic() {
  const target = document.getElementById(window.location.hash.slice(1));
  if (!target) return;
  if (target.tagName === 'DETAILS') target.open = true;
  target.scrollIntoView({ block: 'start', behavior: 'instant' });
}
window.addEventListener('hashchange', revealLinkedTopic);
window.addEventListener('load', revealLinkedTopic);
document.querySelectorAll('.guide-nav a').forEach(link => {
  link.addEventListener('click', () => {
    const target = document.getElementById(link.hash.slice(1));
    if (target) target.open = true;
  });
});
