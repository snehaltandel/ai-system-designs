import { fileURLToPath } from 'node:url';
import { box, edge, lane, palette, sheet, store, text } from './diagram-kit.mjs';

// Keep each trust boundary and arrow explicit. Skills are versioned capabilities
// called by agents; they are not represented as additional autonomous agents.
const output = fileURLToPath(new URL('../site/diagrams/agent-orchestration.svg', import.meta.url));
const body = [
  lane(40, 120, 1520, 235, '01 · Coordination', '', palette.blue),
  lane(40, 375, 1520, 245, '02 · Specialist runtime', '', palette.violet),
  lane(40, 640, 1520, 250, '03 · Decision controls', '', palette.amber),

  box(65, 205, 335, 130, 'Application / identity', [
    'User, purpose + tenant',
    'Policy, risk tier + role',
  ], 'control'),
  box(600, 200, 400, 140, 'Orchestrator', [
    'Owns state + task plan',
    'Budgets, permissions + timeouts',
    'Dispatch, collect + stop',
  ], 'control'),
  box(1200, 205, 330, 130, 'Versioned skill registry', [
    'Typed contracts + test suites',
    'Tools, prompts + procedures',
    'Reusable capability versions',
  ], 'service'),

  box(65, 460, 380, 130, 'Specialist agents', [
    'Data agent · business semantics',
    'Knowledge agent · trusted context',
    'Return evidence with proposals',
  ], 'model'),
  box(560, 460, 360, 130, 'Tool gateway', [
    'Allowlist + schema validation',
    'Least privilege + rate limits',
    'Credentials stay in gateway',
  ], 'control'),
  store(1130, 460, 400, 150, 'Read-only source systems', [
    'Warehouse · documents · CRM',
    'Tenant-scoped, governed views',
  ]),

  box(65, 725, 300, 145, 'Proposal validation', [
    'Evidence + output schema',
    'Policy + deterministic checks',
    'Uncertainty → escalation',
  ], 'control'),
  box(455, 725, 300, 145, 'Human approval', [
    'Exact action + parameters',
    'Identity, expiry + signature',
    'Approve / reject / escalate',
  ], 'human'),
  box(845, 725, 340, 145, 'Execution service', [
    'Recheck policy + approval hash',
    'Idempotency + bounded retries',
    'Reject stale or altered requests',
  ], 'control'),
  box(1260, 725, 270, 145, 'Business systems', [
    'Approved transactions',
    'Receipts + audit log',
  ], 'data'),

  edge('M400 266 H600', 'task + identity', 437, 252),
  edge('M1000 253 H1200', 'resolve version', 1037, 240),
  edge('M1200 298 H1000', 'skill contract', 1044, 285),
  edge('M660 340 V368 H470 V486 H445', 'delegate task', 485, 360),
  edge('M445 505 H520 V385 H800 V340', 'status + evidence', 623, 380),
  edge('M445 524 H560', 'typed call', 465, 511),
  edge('M560 568 H445', 'evidence', 466, 555),
  edge('M920 524 H1130', 'scoped read', 972, 511),
  edge('M1130 568 H920', 'rows / passages', 966, 555),
  edge('M600 302 H555 V345 H50 V697 H215 V725', 'proposed action', 80, 690),
  edge('M365 798 H455', 'review', 382, 784, 'control'),
  edge('M755 798 H845', 'approve', 767, 784, 'control'),
  edge('M1185 798 H1260', 'commit', 1194, 784),

  text(615, 684, 'Every action is bound to its approved parameters; changes require a new decision.', 17, palette.muted),
].join('');

sheet({
  title: 'Extensible agents with controlled business actions',
  subtitle: 'One orchestrator coordinates specialists and reusable skills; evidence, policy and people govern execution.',
  body,
  footer: 'LLM specialists suggest actions. Governed tools and explicit decision controls determine what can execute.',
  output,
});
console.log(output);
