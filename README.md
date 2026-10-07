# AI System Designs

A simple, interactive field guide for business leaders: how sources connect to LLMs, how AI supports decisions, and where checks and accountability belong.

## Architecture examples

- Basic assistant: supplied context and human-reviewed drafts.
- Document retrieval: permission-aware search and cited answers.
- Live business data: governed metrics through read-only backend tools.
- Approval workflow: structured proposals, policy enforcement, human approval, and audited execution.

All examples are fictional educational walkthroughs. The site does not call an LLM or connect to business systems. A production integration would need a separately secured backend; never put API credentials in browser code.

## Run locally

From this repository, run `python3 -m http.server 8000 --directory site`, then open http://localhost:8000.

## Publish

GitHub Pages uses the included Actions workflow to publish only `site/` when `main` changes. In repository Settings → Pages, choose **GitHub Actions** as the source. See [GitHub's workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## Edit

- `site/app.js`: architecture explanations, controls, and fictional walkthroughs.
- `site/index.html`: introduction and operating model.
- `site/styles.css`: responsive layout and visual design.

No build step or package installation is required. Google Fonts is optional; system sans-serif fonts provide a fallback.

## LLM math and reasoning

Nine expandable lessons cover conditional probability, embeddings, attention, Transformer layers, training loss, temperature, intermediate computation, independent verification, and reasoning training. Each includes readable math, an example, and a business implication, with links to foundational research.

## Data and agent foundations

The foundations guide connects eight topics: data quality and ownership, relational database semantics, scoped retrieval and memory, governed knowledge products, proactive human oversight, measurable business value, extensible skills and agents, and layered evaluations. It includes an example of join fan-out, a reviewed memory lifecycle, a fictional value calculation, and an evaluation matrix.

## Architecture drawing library

Four professional vector drawings show governed document retrieval, semantic relational access, retrieval with memory, and extensible agents with human approval. The gallery supports enlarged viewing and SVG download. All drawings show service and store boundaries, directional interfaces, and explicit control points.

SVG sources are in `site/diagrams/`. Edit the corresponding `scripts/draw-*.mjs` generator and run it with Node from the repository root to regenerate. No rendering dependency is needed for SVG generation.

## Interactive renewal decision simulator

The **Follow a business decision** lab walks through scoped source retrieval, invoice semantics, short- and long-term context, independent validation, human review, and outcome measurement. Four combinable switches demonstrate stale CRM data, conflicting policies, a billing outage, and an unauthorized cross-unit write. Each change resets review. Approval records only a simulated proposal, never a renewal or customer offer.

- `site/simulator.js`: stage rendering and interactions.
- `site/simulator-engine.mjs`: fictional policy checks and outcomes.
- `site/simulator.css`: responsive lab layout and highlighted component map.
- `node --test tests/simulator.test.mjs`: acceptance checks across all 16 switch combinations.

All policies, timings, sources, and recommendations are teaching examples. The simulator has no external API dependencies or live model calls.
