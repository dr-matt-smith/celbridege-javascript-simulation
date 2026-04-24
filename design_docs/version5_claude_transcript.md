# Version 5 — Claude transcript

## Prompt

> implement version 5

Design-doc v5 section (mockup 2: Python with tests, `/python2`):

- add a second project mockup at `/python2`
- **Task prompt**: "Write a Python function `my_min(<int1>, <int2>, ...)` that accepts a variable number of integer arguments, and returns the value of the smallest number." Safe assumptions: at least 1 integer argument; all arguments are integers. Samples: `my_min(3, 1, 4, 1, 5)` → 1, `my_min(7, 2)` → 2.
- **Replace the terminal** with a "Check against test data" panel: a table of `Call | Expected output | Actual output | Pass/Fail` plus a "Re-run tests" button. Rows mirror the spec (three pass, two fail).
- **Editor** shows `my_functions.py` with a buggy `def my_min(*args)` that initialises `smallest = 0` (which is why `my_min(1, 2)` and `my_min(2, 1)` both incorrectly return `0`).

## Plan

1. Reuse the v3 routing machinery — add `'python2'` to the `KNOWN_SLUGS` list in `public/js/project.js` and a `/python2` entry in `PROJECT_ROUTES` in `server.js`. No new client logic needed; `panelUrl` + the `app.js` hydrate loop already handle it.
2. Four new data files under `public/data/<panel>/python2.json`:
    - `explorer/python2.json` — single `my_functions.py` child under `python2`, selected + runnable (same v4 shape).
    - `inspector/python2.json` — `layout: "check-task"` with extended `description` fields.
    - `document_editor/python2.json` — the buggy `def my_min` source.
    - `console/python2.json` — new `layout: "test-results"` shape.
3. Extend the inspector check-task renderer with three new optional fields on `description`:
    - `assumptions_heading` — rendered as a `.check-subheading`.
    - `assumptions: string[]` — rendered as `<ul class="check-assumptions">`.
    - `examples_heading` + `examples: [{call, returns}]` — rendered as `<ul class="check-examples">` with `<code>` call and `<code>` returns plus a "RETURNS:" arrow span.
    All three fields are optional; python1's existing description keeps rendering exactly as before.
4. Add a new `layout: "test-results"` branch to `renderConsole`:
    - Optional `actions[]` row at top (renders `Re-run tests` as `.test-rerun-btn.primary`).
    - A `<table class="test-table">` with a `<thead>` from `columns[]` and a `<tbody>` from `rows[]`.
    - Each row gets `test-row pass` or `test-row fail`; the Pass/Fail cell holds a `.test-badge` with a tick or cross and the word.
    - Before rendering, `container.classList.remove('test-results')` + add it again so re-renders are idempotent.
    - When `layout` is absent, fall through to the existing line renderer (backward-compat for v2/v3/v4 data).
5. Add CSS:
    - `.check-subheading`, `.check-assumptions`, `.check-examples`, `.check-example-call/arrow/returns` for the inspector extension.
    - `.console-body.test-results`, `.test-actions`, `.test-rerun-btn(.primary)`, `.test-table`, `.test-row.pass/fail` (light green / light red), `.test-badge.pass/fail` for the console table layout.
6. Vitest coverage in `tests/python2.test.js`:
    - project routing knows about `python2` (slug + panel URLs).
    - explorer JSON shape + run-button DOM.
    - document_editor JSON + rendered source matches the def/for/if/return skeleton.
    - inspector JSON: task text mentions my_min/smallest, two assumptions match exactly, both examples present.
    - inspector renderer: `.check-assumptions` items, `.check-examples` items with call/arrow/returns, subheadings present.
    - console JSON: layout, title, Re-run tests action, exact column + row list, 3 pass / 2 fail count.
    - console renderer: `.test-results` class applied, Re-run button, thead + tbody + badges + cell contents.
    - backward-compat: console with no layout still renders classic `.console-line` entries.
7. Tick the v5 items in `design_doc1.md` and save this transcript.
8. Run full suite + live-server curl smoke.

## What changed

### New files

- `public/data/explorer/python2.json`
- `public/data/console/python2.json`
- `public/data/inspector/python2.json`
- `public/data/document_editor/python2.json`
- `tests/python2.test.js`
- `design_docs/version5_claude_transcript.md` (this file)

### Modified files

- `public/js/project.js` — `KNOWN_SLUGS` now `['python1', 'python2']`.
- `server.js` — added `/python2` route.
- `public/js/inspector.js` — `renderCheckTask` gained optional `assumptions_heading`, `assumptions[]`, `examples_heading`, `examples[]` rendering; the existing `description.text` path is untouched.
- `public/js/console.js` — `renderConsole` dispatches on `data.layout === 'test-results'` and calls a new `renderTestResults(data, container)`; default (lines) path unchanged.
- `public/styles.css` — new rules for the subheading/assumptions/examples block, and the test-results table + badges.
- `design_docs/design_doc1.md` — v5 checklist items ticked.

## JSON shapes added

**inspector.json** — extended `check-task` (`description` gains optional fields):

```json
"description": {
  "text": "Write a Python function my_min(<int1>, <int2>, ...) that accepts a variable number of integer arguments, and returns the value of the smallest number.",
  "assumptions_heading": "You can safely assume:",
  "assumptions": ["there is always at least 1 integer argument", "all arguments are integers"],
  "examples_heading": "Sample input / output:",
  "examples": [
    { "call": "my_min(3, 1, 4, 1, 5)", "returns": "1" },
    { "call": "my_min(7, 2)",          "returns": "2" }
  ]
}
```

**console.json** — new `test-results` layout:

```json
{
  "title":   "Check against test data",
  "layout":  "test-results",
  "actions": [{ "label": "Re-run tests", "kind": "primary" }],
  "columns": ["Call", "Expected output", "Actual output", "Pass/Fail"],
  "rows": [
    { "call": "my_min(-1)",   "expected": "-1", "actual": "-1", "status": "pass" },
    { "call": "my_min(0)",    "expected": "0",  "actual": "0",  "status": "pass" },
    { "call": "my_min(1)",    "expected": "1",  "actual": "1",  "status": "pass" },
    { "call": "my_min(1, 2)", "expected": "1",  "actual": "0",  "status": "fail" },
    { "call": "my_min(2, 1)", "expected": "1",  "actual": "0",  "status": "fail" }
  ]
}
```

## Mockup content at a glance

- **Explorer**: `python2 > my_functions.py` (selected, green RUN triangle).
- **Editor** — `my_functions.py`:

  ```python
  def my_min(*args):
      smallest = 0

      for item in args:
          if item < smallest:
              smallest = item

      return smallest
  ```

- **Console (bottom) — "Check against test data"**: primary-blue `Re-run tests` button, then the 4-column table, green rows for the three passes and red rows for the two fails with a coloured `✓ Pass` / `✗ Fail` badge in the final cell.
- **Inspector (right) — "Task"**: Description/Submissions/Theory tabs with Description active, the problem statement, a bullet list under "You can safely assume:", and a mono-font list of `my_min(...) RETURNS: …` examples under "Sample input / output:".

## Test results

```
Test Files  7 passed (7)
     Tests  78 passed (78)
```

Breakdown:

- `python2.test.js` — 24 tests (routing, explorer, editor, inspector schema + renderer, console schema + renderer + backward-compat).
- `python1.test.js` — 23 tests, unchanged and green.
- `project.test.js` — 6 tests, green; python2 slug handled by the updated helper is additionally re-exercised from python2 suite.
- v2 panel suites (`explorer`, `console`, `inspector`, `document_editor`) — untouched.

## Live-server verification

`PORT=3103 node server.js`, then:

```
/           -> 200
/python1    -> 200
/python2    -> 200
/data/explorer/python2.json       -> 200
/data/console/python2.json        -> 200
/data/inspector/python2.json      -> 200
/data/document_editor/python2.json -> 200
```

`diff <(curl /python1) <(curl /python2)` returns no differences — same `index.html` shell, variant picked on the client via `resolveProjectSlug`.

`logs/server.log`:

```
ROUTE /python2 -> project "python2"
     GET /python2 -> 200
DATA GET /data/explorer/python2.json -> 200
DATA GET /data/console/python2.json -> 200
DATA GET /data/inspector/python2.json -> 200
DATA GET /data/document_editor/python2.json -> 200
```

## How to view

```
npm install
npm run dev            # http://localhost:3000/          — default cb-examples2
                       # http://localhost:3000/python1   — v4 python1 (calculator)
                       # http://localhost:3000/python2   — v5 python2 (my_min with tests)
npm test               # 78 tests pass
```
