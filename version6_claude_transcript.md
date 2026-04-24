# Version 6 — /map1 knowledge-map mockup

Date: 2026-04-24

## Prompt

> implement version 6 (see design_docs/design_doc1.md)

Design-doc requirements (verbatim excerpt):

```
Version 6
---------
mockup 2: knowledege map
test indicator: /map1

- modify the project to mock up a map of concepts for a programming tutorial system
- make the middle panel show the concept map of Python programming concepts
  - use this screenshot as a guide: /screenshots/jetbrains/knowledge_map2.png
- make the right hand panel, a top level "Learning" panel
  - with a brief overview about an introductory Python programing course
  - use this screenshot as a guide: /screenshots/jetbrains/about_course.png
```

Project conventions carried over from earlier versions:

- Create Vitests for each feature
- Add logging (to `/logs`) so features can be confirmed working
- Save a transcript to `version6_claude_transcript.md`

## What was built

A new URL-triggered mockup `/map1` that re-skins the app shell into a
knowledge-map / course-overview view:

- **Left panel (Explorer)** — "Knowledge map" tree: `Python → Basics → Simple programs (3 / 6)`, plus `Code quality`, `Working with data`, `Control flow`, `Additional instruments → Coding environments`.
- **Middle panel (Document editor)** — concept grid with the "Introduction to Python" heading and a `13 / 20 topics completed` progress pill at 65%. Grid of 11 concept cards over 3 columns (`Program with numbers`, `Basic data types`, …, `Working with strings: basic methods`).
- **Right panel (Inspector)** — "Learning" panel showing the `Course: Python 101 - Introduction to Python Programming` crumb, an "About the course" heading, active `Description` tab, the course overview paragraphs, a `Done ✓` status, and a primary `Next: Getting to know you` button.
- **Console** — simple one-line meta message (no test table for this mockup).

## Files added

- `public/data/explorer/map1.json` — Knowledge-map tree data.
- `public/data/document_editor/map1.json` — knowledge-map grid data.
- `public/data/inspector/map1.json` — Learning / about-the-course data.
- `public/data/console/map1.json` — minimal console data for /map1.
- `tests/map1.test.js` — 32 Vitest cases covering routing, explorer tree + meta badge, knowledge-map grid + progress, learning layout renderer, and console fallback.

## Files modified

- `public/js/project.js` — added `map1` to `KNOWN_SLUGS`.
- `public/js/explorer.js` — optional `meta` field rendered as a `.tree-meta` pill (e.g. `3 / 6`).
- `public/js/document_editor.js` — dispatched on `layout: "knowledge-map"` to a new `renderKnowledgeMap` that fills the tabs strip with a heading + progress bar and the code body with a 3-column `.km-grid`.
- `public/js/inspector.js` — dispatched on `layout: "learning"` to a new `renderLearning` (crumb, heading, tabs, markdown description, status, next button).
- `public/styles.css` — new rules for `.tree-meta`, `.tabs.km-header`, `.km-heading`, `.km-progress*`, `.km-grid`, `.km-col`, `.km-card*`, and the `.inspector-body.learning` stack.
- `server.js` — added `/map1` → project "map1" route.

## Verification

- `npm test` → 9 files, 130 tests, all passing (32 of them new for `map1.test.js`).
- `curl http://localhost:3000/map1` → HTTP 200; each `data/<panel>/map1.json` returns 200.
- `logs/server.log` captures the `ROUTE /map1` hit and every `DATA GET /data/.../map1.json` load.

## Notes / trade-offs

- Added an optional `meta` field to explorer nodes instead of overloading `name`. Kept the renderer backward-compatible — existing data with no `meta` still renders unchanged, as the existing explorer tests confirm.
- Re-used the existing tiny markdown renderer for the Learning panel description, so the content stays constrained to paragraphs / lists / inline code (no bold or headings). Avoided growing the markdown grammar for a single copy change.
- Kept the middle panel wired through the existing `tabsContainer` + `codeContainer` split: the knowledge-map layout repurposes the tabs strip as a header and toggles classes (`km-header`, `km-body`) so CSS can flip modes cleanly. `renderDocumentEditor` removes those classes when the layout reverts, which is covered by a test.
- The console for `/map1` was kept as a minimal lines layout — the design doc didn't call for a console treatment on this mockup.
