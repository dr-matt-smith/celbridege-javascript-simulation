import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { renderExplorer } from '../public/js/explorer.js';
import { renderConsole } from '../public/js/console.js';
import { renderInspector } from '../public/js/inspector.js';
import { renderDocumentEditor } from '../public/js/document_editor.js';
import { resolveProjectSlug, panelUrl } from '../public/js/project.js';

function load(panel) {
  const p = resolve(__dirname, `../public/data/${panel}/map1.json`);
  return JSON.parse(readFileSync(p, 'utf8'));
}

const explorer = load('explorer');
const consoleData = load('console');
const inspector = load('inspector');
const editor = load('document_editor');

describe('project routing knows about map1', () => {
  it('resolves /map1 to the map1 slug', () => {
    expect(resolveProjectSlug('/map1')).toBe('map1');
    expect(resolveProjectSlug('/map1/')).toBe('map1');
  });

  it('panelUrl uses map1.json under each panel folder', () => {
    expect(panelUrl('explorer', 'map1')).toBe('data/explorer/map1.json');
    expect(panelUrl('console', 'map1')).toBe('data/console/map1.json');
    expect(panelUrl('inspector', 'map1')).toBe('data/inspector/map1.json');
    expect(panelUrl('document_editor', 'map1')).toBe('data/document_editor/map1.json');
  });
});

describe('map1 explorer.json — Knowledge map tree', () => {
  it('uses Knowledge map as the panel title', () => {
    expect(explorer.title).toBe('Knowledge map');
  });

  it('roots at Python, expanded', () => {
    expect(explorer.root.name).toBe('Python');
    expect(explorer.root.type).toBe('folder');
    expect(explorer.root.expanded).toBe(true);
  });

  it('has the expected top-level categories', () => {
    const names = explorer.root.children.map(c => c.name);
    expect(names).toEqual([
      'Basics',
      'Code quality',
      'Working with data',
      'Control flow',
      'Additional instruments',
    ]);
  });

  it('marks Simple programs as the selected node with 3 / 6 meta', () => {
    const basics = explorer.root.children.find(c => c.name === 'Basics');
    const simple = basics.children.find(c => c.name === 'Simple programs');
    expect(simple.selected).toBe(true);
    expect(simple.meta).toBe('3 / 6');
  });

  it('renders the 3 / 6 meta badge into the DOM', () => {
    const container = document.createElement('div');
    renderExplorer(explorer, container);
    const row = [...container.querySelectorAll('.tree-row')]
      .find(r => r.querySelector('.name')?.textContent === 'Simple programs');
    expect(row).toBeTruthy();
    expect(row.querySelector('.tree-meta')?.textContent).toBe('3 / 6');
    expect(row.classList.contains('selected')).toBe(true);
  });

  it('does not render a meta badge on siblings without meta', () => {
    const container = document.createElement('div');
    renderExplorer(explorer, container);
    const row = [...container.querySelectorAll('.tree-row')]
      .find(r => r.querySelector('.name')?.textContent === 'Modules and packages');
    expect(row.querySelector('.tree-meta')).toBeNull();
  });
});

describe('map1 document_editor.json — knowledge-map layout', () => {
  it('declares the knowledge-map layout and Introduction to Python heading', () => {
    expect(editor.layout).toBe('knowledge-map');
    expect(editor.heading).toBe('Introduction to Python');
  });

  it('carries 13 / 20 topics completed (65%) progress', () => {
    expect(editor.progress).toEqual({ completed: 13, total: 20, percent: 65 });
  });

  it('organises concept cards into three columns', () => {
    expect(Array.isArray(editor.columns)).toBe(true);
    expect(editor.columns).toHaveLength(3);
  });

  it('lists the expected Python concepts across the grid', () => {
    const names = editor.columns.flat().map(c => c.name);
    expect(names).toEqual([
      'Program with numbers',
      'Basic data types',
      'Comparisons',
      'Math functions',
      "Taking user's input",
      'Declaring functions',
      'String formatting',
      'Class vs instance',
      'Program execution',
      'Errors',
      'Working with strings: basic methods',
    ]);
  });
});

describe('renderDocumentEditor() — knowledge-map layout', () => {
  let tabs, code;
  beforeEach(() => {
    tabs = document.createElement('div');
    tabs.className = 'tabs';
    code = document.createElement('code');
    renderDocumentEditor(editor, tabs, code);
  });

  it('turns the tabs bar into a km-header with heading + progress', () => {
    expect(tabs.classList.contains('km-header')).toBe(true);
    expect(tabs.querySelector('.km-heading')?.textContent).toBe('Introduction to Python');
    expect(tabs.querySelector('.km-progress-label')?.textContent).toBe('13 / 20 topics completed');
    expect(tabs.querySelector('.km-progress-percent')?.textContent).toBe('65%');
  });

  it('sets the progress fill width to 65%', () => {
    const fill = tabs.querySelector('.km-progress-fill');
    expect(fill.style.width).toBe('65%');
  });

  it('renders the concept grid with three columns in the code body', () => {
    expect(code.classList.contains('km-body')).toBe(true);
    const cols = code.querySelectorAll('.km-grid > .km-col');
    expect(cols.length).toBe(3);
  });

  it('renders one card per concept with a name label', () => {
    const cards = code.querySelectorAll('.km-card');
    expect(cards.length).toBe(11);
    const cardNames = [...cards].map(c => c.querySelector('.km-card-name').textContent);
    expect(cardNames).toContain('Program with numbers');
    expect(cardNames).toContain('Working with strings: basic methods');
  });

  it('renders both coding and theory icons on each card', () => {
    const card = code.querySelector('.km-card');
    expect(card.querySelector('.km-card-icon.coding')).not.toBeNull();
    expect(card.querySelector('.km-card-icon.theory')).not.toBeNull();
  });

  it('clears km classes when switching back to the default layout', () => {
    const plain = {
      tabs: [{
        name: 'foo.py', active: true,
        lines: [[{ v: 'print("hi")' }]],
      }],
    };
    renderDocumentEditor(plain, tabs, code);
    expect(tabs.classList.contains('km-header')).toBe(false);
    expect(code.classList.contains('km-body')).toBe(false);
  });
});

describe('map1 inspector.json — Learning / About the course', () => {
  it('uses the learning layout with Learning as the panel title', () => {
    expect(inspector.title).toBe('Learning');
    expect(inspector.layout).toBe('learning');
  });

  it('includes the course crumb and About the course heading', () => {
    expect(inspector.crumb).toMatch(/Python 101/);
    expect(inspector.crumb).toMatch(/Introduction to Python Programming/);
    expect(inspector.heading).toBe('About the course');
  });

  it('has a single active Description tab', () => {
    expect(inspector.tabs).toEqual([{ name: 'Description', active: true }]);
  });

  it('stores the course overview as markdown mentioning Python and key topics', () => {
    expect(typeof inspector.description.markdown).toBe('string');
    const md = inspector.description.markdown;
    expect(md).toMatch(/Introduction to Python/);
    expect(md).toMatch(/little to no programming experience/);
    expect(md).toMatch(/variables, conditions, and loops/);
  });

  it('exposes the Next: Getting to know you button label', () => {
    expect(inspector.nextButton.label).toBe('Next: Getting to know you');
  });
});

describe('renderInspector() — learning layout', () => {
  let container;
  beforeEach(() => {
    container = document.createElement('div');
    container.className = 'inspector-body';
    renderInspector(inspector, container);
  });

  it('tags the body with the learning class', () => {
    expect(container.classList.contains('learning')).toBe(true);
    expect(container.classList.contains('check-task')).toBe(false);
  });

  it('renders the course crumb line', () => {
    const crumb = container.querySelector('.learning-crumb');
    expect(crumb?.textContent).toMatch(/Python 101/);
  });

  it('renders the About the course heading', () => {
    const h = container.querySelector('.learning-heading');
    expect(h?.textContent).toBe('About the course');
  });

  it('renders the active Description tab', () => {
    const tab = container.querySelector('.learning-tab.active');
    expect(tab?.textContent).toBe('Description');
  });

  it('renders the overview paragraphs inside a markdown wrapper', () => {
    const wrap = container.querySelector('.learning-description.md');
    expect(wrap).not.toBeNull();
    const paragraphs = wrap.querySelectorAll('p');
    expect(paragraphs.length).toBeGreaterThanOrEqual(3);
    expect(wrap.textContent).toMatch(/Introduction to Python/);
  });

  it('renders the Next: Getting to know you call-to-action button', () => {
    const btn = container.querySelector('.learning-next-btn');
    expect(btn?.textContent).toBe('Next: Getting to know you');
  });

  it('switches back cleanly to the default items layout', () => {
    const plain = { items: [{ name: 'thing', icon: 'py' }] };
    renderInspector(plain, container);
    expect(container.classList.contains('learning')).toBe(false);
    expect(container.querySelector('.inspector-row')).not.toBeNull();
  });
});

describe('map1 console.json — simple lines layout', () => {
  it('keeps the default lines layout (no test-results)', () => {
    expect(consoleData.layout).toBeUndefined();
    expect(Array.isArray(consoleData.lines)).toBe(true);
  });

  it('renders a meta line in the console body', () => {
    const container = document.createElement('div');
    container.className = 'console-body';
    renderConsole(consoleData, container);
    expect(container.classList.contains('test-results')).toBe(false);
    expect(container.querySelectorAll('.console-line').length).toBeGreaterThan(0);
  });
});
