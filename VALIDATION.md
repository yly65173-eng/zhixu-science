# Validation record

Date: 2026-11-03 (Asia/Shanghai). This records one development session, not a guarantee of future third-party availability.

## Automated checks

- `npm test`: 23 tests, covering known numerical examples, Ksp stoichiometry, common-ion mass action, unsupported salt rejection, multi-step dependencies, missing prerequisites, K versus Ksp, temperature/energy validation, diffusion dimension, half-life, Boolean grouping, terminology boundaries, original-text offsets, evidence scope, DOI deduplication, same-name local files, HTML escaping, protocol provenance and shared-resource scheduling.
- `npm run build`: successful static Vite production build. PDF text extraction and worker are split into separate assets.
- npm dependency audit after upgrading fflate to 0.8.3: 0 known vulnerabilities reported at installation time. Audit data can change.

## Browser checks

- Literature page rendered; concept extraction of the sample question produced five specific concepts. Generic terms entirely contained inside more specific terms were suppressed.
- Real search of those concepts returned 40 candidate records from Europe PMC/Crossref in the observed run. Two Crossref requests failed; the app retained successful results and displayed both failures instead of claiming complete coverage.
- Twelve open-full-text requests were attempted. Body evidence and abstract/title-only evidence were visibly distinguished. Some fetched bodies had no matched concept, which did not promote title matches to body matches.
- Ksp = 1.8e-10 for a 1:1 salt returned s = 1.34164e-5 mol/L and displayed a second route missing mass solubility. Conditions and units were visible.
- DOCX import extracted Chinese procedure text with original extracted line references. PDF import extracted English text with PDF page 1. Minimal PPTX XML test extracted slides in numeric order even when ZIP entries were written in reverse order.
- Procedure analysis preserved lines 3 and 4 as steps and left unprovided principles, phenomena and numerical ranges empty.
- Three groups with user-entered 5/10/3 minute preparation/wait/finish durations produced a feasible 38-minute schedule versus 54 minutes sequentially under the stated assumptions. The time table was exposed for review; no general optimality claim was made.
- Molecular canvas rendered; SN2 play control advanced the slider and switched to pause. Narrow-page layout at a 667 px viewport had matching page/content widths (no horizontal page overflow).

## Limits of verification

- Network requests depend on geography, browser CORS, API service health, permissions and rate limits. Full-text retrieval is a bounded candidate check, not a search of every article body on the internet.
- Office/PDF tests cover synthetic textual fixtures and do not establish perfect parsing of arbitrary class materials. Complex equations, columns, images, tables, notes and scanned documents require review or OCR.
- Relevance is deterministic concept overlap, not a trained semantic ranker or factual verification model.
- Browser checks are manual interaction checks in one environment. No claim of exhaustive cross-browser, accessibility or adversarial-file testing.
