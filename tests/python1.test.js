import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { renderExplorer } from '../public/js/explorer.js';
import { renderConsole } from '../public/js/console.js';
import { renderInspector } from '../public/js/inspector.js';
import { renderDocumentEditor } from '../public/js/document_editor.js';

function load(panel) {
  const p = resolve(__dirname, `../public/data/${panel}/python1.json`);
  return JSON.parse(readFileSync(p, 'utf8'));
}

const explorer = load('explorer');
const consoleData = load('console');
const inspector = load('inspector');
const editor = load('document_editor');

describe('python1 explorer.json', () => {
  it('roots at the python1 project folder', () => {
    expect(explorer.root.name).toBe('python1');
    expect(explorer.root.type).toBe('folder');
    expect(explorer.root.expanded).toBe(true);
  });

  it('has exactly one child: calculator.py (selected, runnable)', () => {
    expect(explorer.root.children).toHaveLength(1);
    const calc = explorer.root.children[0];
    expect(calc.name).toBe('calculator.py');
    expect(calc.selected).toBe(true);
    expect(calc.runnable).toBe(true);
  });

  it('contains no sub-folders and no readme/celbridge files', () => {
    const names = explorer.root.children.map(c => c.name);
    expect(names.some(n => /\.celbridge$/.test(n))).toBe(false);
    expect(names).not.toContain('readme.md');
    expect(explorer.root.children.filter(c => c.type === 'folder')).toHaveLength(0);
  });

  it('renders the python1 tree into the DOM', () => {
    const container = document.createElement('div');
    renderExplorer(explorer, container);
    const selected = container.querySelector('.tree-row.selected .name');
    expect(selected?.textContent).toBe('calculator.py');
  });

  it('renders a green RUN play-triangle button next to calculator.py', () => {
    const container = document.createElement('div');
    renderExplorer(explorer, container);
    const row = [...container.querySelectorAll('.tree-row')]
      .find(r => r.querySelector('.name')?.textContent === 'calculator.py');
    const runBtn = row.querySelector('.tree-run-btn');
    expect(runBtn).not.toBeNull();
    expect(runBtn.querySelector('svg')).not.toBeNull();
  });

  it('does not render a run button on non-runnable nodes (e.g. the project root)', () => {
    const container = document.createElement('div');
    renderExplorer(explorer, container);
    const rootRow = container.querySelector('.tree-row');
    expect(rootRow.querySelector('.tree-run-btn')).toBeNull();
  });
});

describe('python1 document_editor.json', () => {
  it('has a single active calculator.py tab', () => {
    expect(editor.tabs).toHaveLength(1);
    expect(editor.tabs[0].name).toBe('calculator.py');
    expect(editor.tabs[0].active).toBe(true);
  });

  it('renders print(60 / (5 + 15) * 3) in the code block', () => {
    const tabs = document.createElement('div');
    const code = document.createElement('code');
    renderDocumentEditor(editor, tabs, code);
    const text = code.textContent;
    expect(text).toContain('put your code here');
    expect(text).toMatch(/print\(60 \/ \(5 \+ 15\) \* 3\)/);
  });
});

describe('python1 console.json', () => {
  it('prints 9.0 as the program output', () => {
    const output = consoleData.lines.find(l => l.kind === 'output');
    expect(output?.text).toBe('9.0');
  });

  it('invokes the script as simply "calculator.py" (no folder path)', () => {
    const cmd = consoleData.lines.find(l => l.kind === 'command');
    const joined = (cmd.segments || []).map(s => s.text).join('');
    expect(joined).toContain('run "calculator.py"');
    expect(joined).not.toMatch(/\//);
  });

  it('renders a line per entry', () => {
    const container = document.createElement('div');
    renderConsole(consoleData, container);
    expect(container.querySelectorAll('.console-line').length).toBe(consoleData.lines.length);
  });
});

describe('python1 inspector.json — check-task layout', () => {
  it('declares the check-task layout', () => {
    expect(inspector.layout).toBe('check-task');
  });

  it('has Description / Submissions / Theory tabs with Description active', () => {
    const names = inspector.tabs.map(t => t.name);
    expect(names).toEqual(['Description', 'Submissions', 'Theory']);
    expect(inspector.tabs[0].active).toBe(true);
  });

  it('has memory + time limits', () => {
    const labels = inspector.limits.map(l => l.label);
    expect(labels).toContain('Memory limit');
    expect(labels).toContain('Time limit');
  });

  it('has a primary Check action and a Next action', () => {
    const check = inspector.actions.find(a => a.label === 'Check');
    expect(check?.kind).toBe('primary');
    expect(inspector.actions.find(a => a.label === 'Next')).toBeDefined();
  });
});

describe('renderInspector() — check-task', () => {
  let container;
  beforeEach(() => {
    container = document.createElement('div');
    container.className = 'inspector-body';
  });

  it('adds the check-task class so CSS targets it', () => {
    renderInspector(inspector, container);
    expect(container.classList.contains('check-task')).toBe(true);
  });

  it('renders one tab button per tab entry', () => {
    renderInspector(inspector, container);
    expect(container.querySelectorAll('.check-tab').length).toBe(inspector.tabs.length);
    expect(container.querySelector('.check-tab.active').textContent).toBe('Description');
  });

  it('shows the task description text', () => {
    renderInspector(inspector, container);
    const desc = container.querySelector('.check-description');
    expect(desc.textContent).toContain('60 ÷ the sum of 5 and 15, all times 3');
  });

  it('renders the warning with the highlighted token', () => {
    renderInspector(inspector, container);
    const warn = container.querySelector('.check-warning');
    expect(warn.textContent).toContain('Do not use the');
    expect(warn.querySelector('.check-warning-highlight').textContent).toBe('eval');
  });

  it('renders limits as dt/dd pairs', () => {
    renderInspector(inspector, container);
    expect(container.querySelectorAll('.check-limits dt').length).toBe(inspector.limits.length);
    expect(container.querySelectorAll('.check-limits dd').length).toBe(inspector.limits.length);
  });

  it('renders a primary Check button and a secondary Next button', () => {
    renderInspector(inspector, container);
    const primary = container.querySelector('.check-btn.primary');
    expect(primary.textContent).toBe('Check');
    const buttons = [...container.querySelectorAll('.check-btn')].map(b => b.textContent);
    expect(buttons).toContain('Next');
  });

  it('renders the Correct status with meta', () => {
    renderInspector(inspector, container);
    const status = container.querySelector('.check-status.ok');
    expect(status.textContent).toContain('Correct');
    expect(status.querySelector('.check-status-meta').textContent).toBe('A minute ago');
  });

  it('renders the Peek Solution link', () => {
    renderInspector(inspector, container);
    const links = [...container.querySelectorAll('.check-solution-link')].map(a => a.textContent);
    expect(links).toContain('Peek Solution');
  });
});
