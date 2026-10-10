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

## Documentation navigation

The site now opens on a documentation home and shows one section overview or topic at a time. A nested, expandable sidebar groups the 29 existing topics into:

1. **LLM basics & reasoning** — 9 lessons.
2. **Business & data foundations** — 8 guides.
3. **System designs** — 4 component architectures.
4. **Use cases & walkthroughs** — 4 patterns and the renewal simulator.
5. **Business operating model** — 3 practices.

Breadcrumbs, a fixed documentation-home link, topic filtering, and previous/next links support navigation. The sidebar has its own scroll area and becomes a keyboard-accessible drawer on mobile. The top-left brand always returns to the documentation root. Existing section and foundation-topic anchors remain supported.

Topic URLs use hash routes, for example `#/learn/attention` and `#/designs/rag`, so direct links work on GitHub Pages without server rewrites. The existing content and interactive components are retained. Topic filtering searches titles and section names, not article bodies.

### Adding content in future iterations

- `site/docs-catalog.mjs` is the content map: section, title, topic order, route, and content anchor. It drives the navigation, overview cards, breadcrumbs, and pagination.
- `site/index.html` holds the lesson and operating-model content; add a unique content anchor for each new topic.
- `site/docs.js` manages topic visibility, legacy links, filtering, and the mobile drawer.
- `site/docs.css` styles the documentation shell.
- Run `node --test tests/*.test.mjs` after navigation or simulator changes, and check new routes in desktop and mobile browsers.

Keep new topic proposals in the content plan until scoped. Add them to the public sidebar when their content is ready rather than creating empty pages.
