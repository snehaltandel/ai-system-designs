import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { box, edge, lane, palette, sheet, store, text } from './diagram-kit.mjs';

// Keep the authored diagram reproducible, readable and independent of the cwd.
const output = fileURLToPath(new URL('../site/diagrams/retrieval-memory.svg', import.meta.url));
mkdirSync(fileURLToPath(new URL('../site/diagrams/', import.meta.url)), { recursive: true });

const boundaries = [
  lane(40, 120, 1520, 250, 'Governed knowledge and memory',
    'Scope every memory read. Memory is input data; it does not change the model’s weights.', palette.teal),
  lane(40, 395, 1095, 490, 'Trusted application runtime',
    'Enforce access, assemble relevant context, and check the answer.'),
  lane(1205, 395, 355, 265, 'External model provider',
    'Contract + retention policy', palette.violet),
  lane(1205, 685, 355, 200, 'Memory governance',
    'Control every durable write', palette.amber),
].join('');

// Draw connectors before components so all endpoints terminate cleanly.
const connections = [
  edge('M212 620 V715', 'Identity + task', 225, 676),
  edge('M355 785 H410 V580 H450', 'Allowed scope', 422, 664, 'control'),
  edge('M592 345 V490', 'Approved sources', 604, 474),
  edge('M948 345 V490', 'Task state', 827, 474),
  edge('M1378 345 V385 H1120 V475 H1040 V490', 'Reviewed memory', 1160, 379),
  edge('M735 555 H805', 'Facts', 749, 541),
  edge('M1090 530 H1235', 'Bounded context', 1097, 515),
  edge('M1235 595 H1165 V755 H1090', 'Candidate answer', 1140, 678),
  edge('M948 845 V865 H55 V555 H70', 'Checked answer · or human escalation', 445, 858),
  edge('M1090 810 H1235', 'Memory proposal', 1098, 796, 'control'),
  edge('M1520 810 H1545 V385 H1455 V345', '', 0, 0, 'async'),
  `<g transform="translate(1556 731) rotate(-90)">${text(0, 0, 'Approved write', 17, palette.teal)}</g>`,
].join('');

const components = [
  store(450, 220, 285, 125, 'Knowledge index', [
    'Owned business knowledge',
    'ACLs, lineage, freshness',
  ]),
  store(805, 220, 285, 125, 'Short-term task state', [
    'Progress + tool results',
    'Expires with the session',
  ]),
  store(1235, 220, 285, 125, 'Long-term memory', [
    'Approved reusable facts',
    'Tenant / user scoped',
  ]),
  box(70, 490, 285, 130, 'Business application', [
    'User question + goal',
    'Owns the current task',
  ]),
  box(70, 715, 285, 130, 'Identity & policy', [
    'Row / document access',
    'Purpose + memory scope',
  ], 'control'),
  box(450, 490, 285, 130, 'Scoped retrieval', [
    'Filter by permissions',
    'Find relevant evidence',
  ]),
  box(805, 490, 285, 130, 'Context assembler', [
    'Rank + fit token budget',
    'Facts before memory',
  ]),
  box(1235, 490, 285, 130, 'LLM inference', [
    'Task + selected context',
    'Generates a candidate',
  ], 'model'),
  box(805, 715, 285, 130, 'Answer validation', [
    'Citations + task checks',
    'Abstain / route to human',
  ], 'control'),
  box(1235, 760, 285, 100, 'Memory write review', [
    'Approval + consent',
    'Provenance + expiry',
  ], 'human'),
].join('');

sheet({
  title: 'Retrieval and memory architecture',
  subtitle: 'Give the model the right evidence, preserve useful experience, and govern what survives beyond a task.',
  body: boundaries + connections + components,
  footer: 'Design rule: authoritative sources win conflicts. Keep transient task state separate from reviewed, revocable long-term memory.',
  output,
});
console.log(output);
