import { fileURLToPath } from 'node:url';
import { lane, box, store, edge, text, palette, sheet } from './diagram-kit.mjs';

// Regenerate with: node scripts/draw-semantic.mjs
// Each connector runs in the space between services, so the system can be
// explained in order without hiding trust boundaries or exception handling.
const output = fileURLToPath(new URL('../site/diagrams/semantic-database.svg', import.meta.url));
const body = [
  lane(40, 135, 330, 760, 'BUSINESS EXPERIENCE', 'A question with a defined purpose'),
  lane(395, 135, 760, 760, 'GOVERNED AGENT RUNTIME', 'Meaning, access, validation, and human review'),
  lane(1180, 135, 380, 760, 'PROTECTED DATA PRODUCTS', 'Approved interfaces to enterprise data', palette.teal),

  box(65, 235, 280, 110, 'Business user', ['“What is net revenue', 'by region this quarter?”'], 'human'),
  box(65, 445, 280, 130, 'Assistant application', ['Capture business intent', 'Carry user identity', 'Keep request audit trail']),
  box(65, 720, 280, 125, 'Cited business answer', ['Metric definition + period', 'Source + query reference', 'Caveats and review status']),

  box(425, 230, 315, 125, 'Identity + policy', ['User, purpose, permissions', 'Allowed metrics and tables', 'Enforce tenant boundaries'], 'control'),
  box(425, 445, 315, 155, 'LLM query planner', ['Use supplied business context', 'Select approved metrics', 'Produce a structured SQL plan', 'Ask when intent is unclear'], 'model'),
  box(805, 230, 315, 150, 'Semantic catalog', ['Owner-approved definitions', 'Metrics • table grain • joins', 'Units • dates • exclusions', 'Versioned business meaning'], 'data'),
  box(805, 445, 315, 155, 'SQL validator', ['Parse and check schema', 'Allowlist joins and columns', 'Reject writes; cap query cost', 'Apply access policy'], 'control'),
  box(805, 715, 315, 130, 'Result reconciliation', ['Check totals, units, freshness', 'Compare business invariants', 'Flag uncertainty or mismatch'], 'control'),
  box(425, 715, 315, 130, 'Business reviewer', ['Clarify ambiguous meaning', 'Resolve failed checks', 'Record decision and owner'], 'human'),

  store(1230, 435, 300, 190, 'Read-only DB views', ['Approved product interfaces', 'Row / column access rules', 'Quality + freshness contracts', 'Named domain owners']),

  // Main request path: application identity precedes query planning.
  edge('M205 345 V445', '1  Question', 219, 402),
  edge('M345 480 H380 V295 H425', '2  Identity + intent', 387, 407),
  edge('M582 355 V445', '3  Allowed scope', 597, 395),

  // Definitions are retrieved independently from the user request.
  edge('M960 380 V410 H695 V445', '4  Metric context', 792, 399),
  edge('M740 520 H805', '5  SQL', 747, 505),
  edge('M1120 520 H1230', '6  Query', 1129, 505),
  edge('M1380 625 V670 H962 V715', '7  Typed rows + lineage', 1140, 657),

  // Failure handling is a first-class branch, separate from answer delivery.
  edge('M805 770 H740', 'Hold', 750, 755, 'control'),
  edge('M582 715 V600', 'Clarify / approve', 597, 658, 'control'),
  edge('M960 845 V880 H205 V845', '8  Passed checks: answer + evidence', 430, 867),

  // A concrete semantic contract explains why syntactically valid SQL is
  // insufficient. The time basis and row grain change the business answer.
  text(1230, 715, 'SEMANTIC CONTRACT · EXAMPLE', 16, palette.teal, 700),
  text(1230, 748, 'Net revenue', 22, palette.ink, 700),
  text(1230, 780, 'Paid sales − refunds', 18, palette.muted),
  text(1230, 808, 'Grain: one order', 18, palette.muted),
  text(1230, 836, 'Time: completion date', 18, palette.muted),
  text(1230, 864, 'Owner: Finance · versioned', 18, palette.muted),
].join('');

sheet({
  title: 'Governed SQL: business meaning before data access',
  subtitle: 'The LLM plans a query. Shared definitions, access controls, and reconciliation constrain the result.',
  body,
  footer: 'Valid SQL can still answer the wrong business question. Govern definitions, table grain, joins, and source ownership.',
  output,
});
console.log(output);
