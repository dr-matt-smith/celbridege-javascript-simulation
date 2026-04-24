# Version 3 — Claude transcript

## Prompt

> implement version 3 — note default project should be the same, but when URL ends `/python1` the version 3 mockup should be viewed

Design doc `design_docs/design_doc1.md` v3 section:

- mockup 1: Python tutorial
- test indicator: `/python1`
- modify the project to mock up a Python **interactive coding test** when the test indicator is appended to the website URL
- use `screenshots/check/to_python.png` as the visual guide

The reference screenshot is a JetBrains-style "check task" view: project tree on the left, source file (`task.sh`) in the center editor, terminal below showing the program output (`54`), and a right-hand panel with `Description / Submissions / Theory` tabs, a task description, a warning ("Do not use the `bc` utility"), memory/time limits, `Check` + `Next` buttons, a `Correct` status, and a "Peek Solution" link.

## Plan

1. Keep the v2 structure intact for the default project (URL `/`).
2. Introduce URL-based project routing: `/python1` is served by the same `index.html` shell, but the client fetches a different JSON variant per panel.
3. File-layout choice: sit new variants next to the existing ones as `public/data/<panel>/python1.json` (no renames, minimal diff to v2 files and tests).
4. Extract a small, testable helper `public/js/project.js` exporting:
    - `resolveProjectSlug(pathname)` — returns `"python1"` for `/python1` (or `/python1/`), otherwise `null`.
    - `panelUrl(panel, slug)` — returns `data/<panel>/<panel>.json` when slug is null, else `data/<panel>/<slug>.json`.
5. Wire `app.js` to compute the slug once at load time, use `panelUrl` per panel, and update the titlebar project chip from `explorer.root.name` so it shows `cb-examples2` on `/` and `python1` on `/python1`.
6. Model the right-hand "check task" UI as a second Inspector layout rather than a brand-new panel, to stay inside the v2 four-panel data-driven pattern:
    - Add `layout: "check-task"` plus `tabs`, `description`, `warning`, `limits`, `actions`, `status`, `solution` fields to the inspector JSON schema.
    - Extend `public/js/inspector.js` to branch on `data.layout`. The old `items` shape is untouched.
    - Add CSS for the new layout in `public/styles.css`.
7. Vitest coverage:
    - `tests/project.test.js` — slug + URL helpers.
    - `tests/python1.test.js` — schema checks for all four python1 JSON files + DOM output of the check-task renderer.
8. Server: add an explicit `/python1` route that serves `index.html` and logs a `ROUTE` line naming the project (the DATA request logger already tags `/data/*` hits, so each request's filename reveals the variant).
9. Save this transcript as `design_docs/version3_claude_transcript.md`.

## What changed

### New files

- `public/js/project.js` — `resolveProjectSlug`, `panelUrl`.
- `public/data/explorer/python1.json`
- `public/data/console/python1.json`
- `public/data/inspector/python1.json`
- `public/data/document_editor/python1.json`
- `tests/project.test.js`
- `tests/python1.test.js`
- `design_docs/version3_claude_transcript.md` (this file)

### Modified files

- `server.js` — added a `PROJECT_ROUTES` map; both `/` and `/python1` serve `public/index.html` and each hit writes a `ROUTE … -> project "<name>"` line to `logs/server.log`.
- `public/index.html` — gave the titlebar project chip span an `id="project-chip-name"` anchor so `app.js` can drive it.
- `public/app.js` — imports the project helpers, logs the resolved slug, fetches each panel from `panelUrl(panel, slug)`, and updates the chip from `explorer.root.name`. Panel title hydration moved into a small `setPanelTitle` helper.
- `public/js/inspector.js` — `renderInspector` now dispatches on `data.layout`: the old path (`items`) is unchanged; `layout: "check-task"` invokes a new `renderCheckTask` that builds tabs, description, warning, limits, action buttons, status row, and solution links.
- `public/styles.css` — added a `.inspector-body.check-task` block plus `.check-tabs`, `.check-description`, `.check-warning`, `.check-limits`, `.check-actions`, `.check-btn`, `.check-status`, `.check-solution` rules. Also made `.inspector-body` scroll when content overflows.
- `design_docs/design_doc1.md` — v3 section (already updated in-session by the user).

## JSON shapes — v3 additions

**`public/data/<panel>/python1.json`** — same schemas as the v2 defaults, with one extension:

**inspector.json `layout: "check-task"` variant**:

```json
{
  "title": "Task",
  "layout": "check-task",
  "tabs":        [{ "name": "Description", "active": true }, { "name": "Submissions" }, { "name": "Theory" }],
  "description": { "text": "..." },
  "warning":     { "prefix": "Do not use the ", "highlight": "eval", "suffix": " function." },
  "limits":      [{ "label": "Memory limit", "value": "256 MB" }, { "label": "Time limit", "value": "5 seconds" }],
  "actions":     [{ "label": "Check", "kind": "primary" }, { "label": "Next", "kind": "secondary" }],
  "status":      { "text": "Correct", "meta": "A minute ago", "kind": "ok" },
  "solution":    { "title": "Correct solution", "links": [{ "label": "Peek Solution", "href": "#" }] }
}
```

The default inspector JSON without a `layout` key continues to render as the old file-icon-and-add-button item list — fully backward compatible.

## Mockup content

- **Problem** (mirrors `to_python.png`, translated to Python): "Write a Python program that will print the result of the following arithmetic expression: 23×3 − 75÷5 ."
- **Warning**: "Do not use the `eval` function." (the Python analogue of the screenshot's "bc utility" warning).
- **Source** — `01_arithmetic/calculator.py`:

  ```python
  # put your code here
  print(23 * 3 - 75 // 5)
  ```

- **Console**: `Celbridge v0.2.6 - Python v3.13.12`, then `>>> run "01_arithmetic/calculator.py"`, then the output `54`, then a blinking `>>>` prompt.
- **Right panel**: `Description / Submissions / Theory` tabs (Description active), the description text, the warning box, the Memory/Time limits list, `Check` (primary) + `Next` buttons, a green-tick `Correct · A minute ago` status, and a `Peek Solution` link under `Correct solution`.

## Test results

```
Test Files  6 passed (6)
     Tests  50 passed (50)
```

Breakdown:

- `project.test.js` — 6 tests: slug resolution (`/`, `/python1`, `/python1/`, unknown paths, empty string) and panel URLs for default and python1.
- `python1.test.js` — 19 tests: python1 JSON schema (explorer root, selected file, active tab, output, inspector tabs/limits/actions) and check-task DOM rendering (tabs, description, warning + highlight, limits dt/dd, primary/secondary buttons, status with meta, Peek Solution link).
- Existing v2 suites (`explorer`, `console`, `inspector`, `document_editor`) — 25 tests, still green and untouched.

## Live-server verification

Started `PORT=3101 node server.js` and issued curl requests:

```
/ -> 200
/python1 -> 200
default explorer -> 200
python1 explorer -> 200
python1 inspector -> 200
python1 console -> 200
python1 doc_editor -> 200
```

`diff <(curl /) <(curl /python1)` returns no differences — both routes serve the same `index.html` shell (confirming the URL-driven variant is selected on the client).

Log entries in `logs/server.log`:

```
[...]      GET / -> 200 (31ms)
[...] ROUTE /python1 -> project "python1"
[...]      GET /python1 -> 200 (4ms)
[...] DATA GET /data/explorer/explorer.json -> 200
[...] DATA GET /data/explorer/python1.json -> 200
[...] DATA GET /data/inspector/python1.json -> 200
[...] DATA GET /data/console/python1.json -> 200
[...] DATA GET /data/document_editor/python1.json -> 200
```

The `ROUTE` line fires on `/python1` hits, and every `DATA` row's filename makes the selected project variant self-evident.

## How to view

```
npm install
npm run dev            # http://localhost:3000/         — default cb-examples2 mockup
                       # http://localhost:3000/python1  — v3 Python check-task mockup
npm test               # runs all 50 Vitest tests
```
