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
