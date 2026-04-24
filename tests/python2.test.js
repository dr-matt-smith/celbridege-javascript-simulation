import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { renderExplorer } from '../public/js/explorer.js';
import { renderConsole } from '../public/js/console.js';
import { renderInspector } from '../public/js/inspector.js';
import { renderDocumentEditor } from '../public/js/document_editor.js';
import { resolveProjectSlug, panelUrl } from '../public/js/project.js';

function load(panel) {
  const p = resolve(__dirname, `../public/data/${panel}/python2.json`);
  return JSON.parse(readFileSync(p, 'utf8'));
}

const explorer = load('explorer');
const consoleData = load('console');
const inspector = load('inspector');
const editor = load('document_editor');

describe('project routing knows about python2', () => {
  it('resolves /python2 to the python2 slug', () => {
    expect(resolveProjectSlug('/python2')).toBe('python2');
    expect(resolveProjectSlug('/python2/')).toBe('python2');
  });

  it('panelUrl uses python2.json under each panel folder', () => {
    expect(panelUrl('explorer', 'python2')).toBe('data/explorer/python2.json');
    expect(panelUrl('console', 'python2')).toBe('data/console/python2.json');
    expect(panelUrl('inspector', 'python2')).toBe('data/inspector/python2.json');
    expect(panelUrl('document_editor', 'python2')).toBe('data/document_editor/python2.json');
  });
});

describe('python2 explorer.json', () => {
  it('roots at python2 with a single runnable my_functions.py', () => {
    expect(explorer.root.name).toBe('python2');
    expect(explorer.root.children).toHaveLength(1);
    const f = explorer.root.children[0];
    expect(f.name).toBe('my_functions.py');
    expect(f.selected).toBe(true);
    expect(f.runnable).toBe(true);
  });

  it('renders a green RUN button next to my_functions.py', () => {
    const container = document.createElement('div');
    renderExplorer(explorer, container);
    const row = [...container.querySelectorAll('.tree-row')]
      .find(r => r.querySelector('.name')?.textContent === 'my_functions.py');
    expect(row.querySelector('.tree-run-btn')).not.toBeNull();
  });
});

describe('python2 document_editor.json', () => {
  it('has a single active my_functions.py tab', () => {
    expect(editor.tabs).toHaveLength(1);
    expect(editor.tabs[0].name).toBe('my_functions.py');
    expect(editor.tabs[0].active).toBe(true);
  });

  it('renders the buggy def my_min source in the code block', () => {
    const tabs = document.createElement('div');
    const code = document.createElement('code');
    renderDocumentEditor(editor, tabs, code);
    const text = code.textContent;
    expect(text).toMatch(/def my_min\(\*args\):/);
    expect(text).toMatch(/smallest = 0/);
    expect(text).toMatch(/for item in args:/);
    expect(text).toMatch(/if item < smallest:/);
    expect(text).toMatch(/return smallest/);
  });
});

describe('python2 inspector.json — my_min task (markdown)', () => {
  it('uses the check-task layout with Description/Submissions/Theory tabs', () => {
    expect(inspector.layout).toBe('check-task');
    expect(inspector.tabs.map(t => t.name)).toEqual(['Description', 'Submissions', 'Theory']);
  });

  it('stores the task body as markdown', () => {
    expect(typeof inspector.description.markdown).toBe('string');
    const md = inspector.description.markdown;
    expect(md).toMatch(/my_min/);
    expect(md).toMatch(/smallest number/i);
    expect(md).toMatch(/- there is always at least 1 integer argument/);
    expect(md).toMatch(/- all arguments are integers/);
    expect(md).toMatch(/`my_min\(3, 1, 4, 1, 5\)` RETURNS: `1`/);
    expect(md).toMatch(/`my_min\(7, 2\)` RETURNS: `2`/);
  });
});

describe('renderInspector() — markdown description', () => {
  let container;
  beforeEach(() => {
    container = document.createElement('div');
    container.className = 'inspector-body';
    renderInspector(inspector, container);
  });

  it('wraps the body in <div class="check-description md">', () => {
    expect(container.querySelector('.check-description.md')).not.toBeNull();
  });

  it('renders the opening paragraph with an inline code my_min signature', () => {
    const firstP = container.querySelector('.check-description.md > p');
    expect(firstP.textContent).toMatch(/Write a Python function/);
    expect(firstP.textContent).toMatch(/returns the value of the smallest number/);
    const sig = firstP.querySelector('code');
    expect(sig.textContent).toBe('my_min(<int1>, <int2>, ...)');
  });

  it('renders two <ul> blocks (assumptions then examples)', () => {
    const uls = container.querySelectorAll('.check-description.md ul');
    expect(uls.length).toBe(2);
    const assumptionItems = [...uls[0].querySelectorAll('li')].map(li => li.textContent);
    expect(assumptionItems).toEqual([
      'there is always at least 1 integer argument',
      'all arguments are integers',
    ]);
  });

  it('renders the two sample examples with inline-code call + returns', () => {
    const uls = container.querySelectorAll('.check-description.md ul');
    const examples = uls[1].querySelectorAll('li');
    expect(examples.length).toBe(2);

    const [first, second] = examples;
    const firstCodes = first.querySelectorAll('code');
    expect(firstCodes[0].textContent).toBe('my_min(3, 1, 4, 1, 5)');
    expect(firstCodes[1].textContent).toBe('1');
    expect(first.textContent).toMatch(/RETURNS/);

    const secondCodes = second.querySelectorAll('code');
    expect(secondCodes[0].textContent).toBe('my_min(7, 2)');
    expect(secondCodes[1].textContent).toBe('2');
  });

  it('does not render the removed structured classes', () => {
    expect(container.querySelectorAll('.check-subheading').length).toBe(0);
    expect(container.querySelectorAll('.check-assumptions').length).toBe(0);
    expect(container.querySelectorAll('.check-examples').length).toBe(0);
  });
});

describe('python2 console.json — test-results layout', () => {
  it('declares the test-results layout with Re-run tests and Add my own test actions', () => {
    expect(consoleData.layout).toBe('test-results');
    expect(consoleData.title).toBe('Check against test data');
    const rerun = consoleData.actions.find(a => a.label === 'Re-run tests');
    expect(rerun?.kind).toBe('primary');
    const addOwn = consoleData.actions.find(a => a.label === 'Add my own test');
    expect(addOwn).toBeDefined();
    expect(addOwn.kind).toBe('secondary');
  });

  it('lists the four-column schema', () => {
    expect(consoleData.columns).toEqual(['Call', 'Expected output', 'Actual output', 'Pass/Fail']);
  });

  it('contains two passing and five failing rows', () => {
    const pass = consoleData.rows.filter(r => r.status === 'pass');
    const fail = consoleData.rows.filter(r => r.status === 'fail');
    expect(pass.length).toBe(2);
    expect(fail.length).toBe(5);
  });

  it('matches the exact call/expected/actual/status rows from the spec', () => {
    expect(consoleData.rows).toEqual([
      { call: 'my_min(-1)',            expected: '-1', actual: '-1', status: 'pass' },
      { call: 'my_min(0)',             expected: '0',  actual: '0',  status: 'pass' },
      { call: 'my_min(1)',             expected: '1',  actual: '0',  status: 'fail' },
      { call: 'my_min(1, 2)',          expected: '1',  actual: '0',  status: 'fail' },
      { call: 'my_min(2, 1)',          expected: '1',  actual: '0',  status: 'fail' },
      { call: 'my_min(3, 1, 4, 1, 5)', expected: '1',  actual: '0',  status: 'fail' },
      { call: 'my_min(7, 2)',          expected: '2',  actual: '0',  status: 'fail' },
    ]);
  });

  it('includes the two Task-description sample inputs as failing rows (buggy code → 0)', () => {
    const byCall = Object.fromEntries(consoleData.rows.map(r => [r.call, r]));
    expect(byCall['my_min(3, 1, 4, 1, 5)']).toEqual({
      call: 'my_min(3, 1, 4, 1, 5)', expected: '1', actual: '0', status: 'fail',
    });
    expect(byCall['my_min(7, 2)']).toEqual({
      call: 'my_min(7, 2)', expected: '2', actual: '0', status: 'fail',
    });
  });
});

describe('renderConsole() — test-results', () => {
  let container;
  beforeEach(() => {
    container = document.createElement('div');
    container.className = 'console-body';
  });

  it('adds the test-results class so CSS targets it', () => {
    renderConsole(consoleData, container);
    expect(container.classList.contains('test-results')).toBe(true);
  });

  it('renders a Re-run tests button marked primary', () => {
    renderConsole(consoleData, container);
    const btn = container.querySelector('.test-rerun-btn.primary');
    expect(btn.textContent).toBe('Re-run tests');
  });

  it('renders an "Add my own test" button in the test-actions bar', () => {
    renderConsole(consoleData, container);
    const labels = [...container.querySelectorAll('.test-actions .test-rerun-btn')]
      .map(b => b.textContent);
    expect(labels).toContain('Add my own test');
    const addOwn = [...container.querySelectorAll('.test-rerun-btn')]
      .find(b => b.textContent === 'Add my own test');
    expect(addOwn.classList.contains('secondary')).toBe(true);
    expect(addOwn.classList.contains('primary')).toBe(false);
  });

  it('renders a <thead> with the four spec columns', () => {
    renderConsole(consoleData, container);
    const headers = [...container.querySelectorAll('.test-table thead th')].map(th => th.textContent);
    expect(headers).toEqual(['Call', 'Expected output', 'Actual output', 'Pass/Fail']);
  });

  it('renders one tbody row per test with pass/fail class', () => {
    renderConsole(consoleData, container);
    const rows = container.querySelectorAll('.test-table tbody .test-row');
    expect(rows.length).toBe(consoleData.rows.length);
    expect(container.querySelectorAll('.test-row.pass').length).toBe(2);
    expect(container.querySelectorAll('.test-row.fail').length).toBe(5);
  });

  it('renders a green Pass badge on passing rows and a red Fail badge on failing rows', () => {
    renderConsole(consoleData, container);
    const pass = container.querySelector('.test-row.pass .test-badge');
    expect(pass.classList.contains('pass')).toBe(true);
    expect(pass.textContent.trim()).toMatch(/✓\s*Pass/);

    const fail = container.querySelector('.test-row.fail .test-badge');
    expect(fail.classList.contains('fail')).toBe(true);
    expect(fail.textContent.trim()).toMatch(/✗\s*Fail/);
  });

  it('renders each cell (call, expected, actual) as text', () => {
    renderConsole(consoleData, container);
    const row = container.querySelectorAll('.test-table tbody .test-row')[3]; // my_min(1, 2)
    expect(row.querySelector('.test-call').textContent).toBe('my_min(1, 2)');
    expect(row.querySelector('.test-expected').textContent).toBe('1');
    expect(row.querySelector('.test-actual').textContent).toBe('0');
  });

  it('backward-compat: default (lines) layout is unchanged when layout is absent', () => {
    const container = document.createElement('div');
    container.className = 'console-body';
    renderConsole({ lines: [{ kind: 'meta', text: 'hi' }] }, container);
    expect(container.classList.contains('test-results')).toBe(false);
    expect(container.querySelectorAll('.console-line').length).toBe(1);
  });
});
