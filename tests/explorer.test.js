import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { renderExplorer } from '../public/js/explorer.js';

const dataPath = resolve(__dirname, '../public/data/explorer/explorer.json');
const data = JSON.parse(readFileSync(dataPath, 'utf8'));

describe('explorer.json schema', () => {
  it('has a root folder node', () => {
    expect(data.root).toBeDefined();
    expect(data.root.name).toBe('cb-examples2');
    expect(data.root.type).toBe('folder');
  });

  it('contains the 03_hello_world folder expanded with hello_world.py selected', () => {
    const hw = data.root.children.find(c => c.name === '03_hello_world');
    expect(hw).toBeDefined();
    expect(hw.expanded).toBe(true);
    const selected = hw.children.find(c => c.selected);
    expect(selected?.name).toBe('hello_world.py');
  });
});

describe('renderExplorer()', () => {
  let container;
  beforeEach(() => {
    container = document.createElement('div');
    document.body.replaceChildren(container);
  });

  it('renders a <ul class="tree"> into the container', () => {
    renderExplorer(data, container);
    const tree = container.querySelector('ul.tree');
    expect(tree).not.toBeNull();
  });

  it('renders the selected file with class "selected"', () => {
    renderExplorer(data, container);
    const selected = container.querySelector('.tree-row.selected .name');
    expect(selected?.textContent).toBe('hello_world.py');
  });

  it('shows a twisty for every folder (collapsed or expanded)', () => {
    renderExplorer(data, container);
    // Count folder rows by checking every tree-row whose icon has class "folder"
    const folderRows = container.querySelectorAll('.tree-row .file-icon.folder');
    folderRows.forEach(icon => {
      const twisty = icon.parentElement.querySelector('.twisty');
      expect(twisty.textContent.trim()).toMatch(/^[▸▾]$/);
    });
  });

  it('keeps expanded folders visible (no display:none on their children)', () => {
    renderExplorer(data, container);
    const expandedNodes = container.querySelectorAll('.tree-node.expanded');
    expandedNodes.forEach(n => {
      const kids = n.querySelector(':scope > .tree-children');
      if (kids) expect(kids.style.display).not.toBe('none');
    });
  });

  it('replaces existing content on re-render', () => {
    renderExplorer(data, container);
    renderExplorer(data, container);
    expect(container.querySelectorAll('ul.tree').length).toBe(1);
  });
});
