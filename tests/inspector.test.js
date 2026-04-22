import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { renderInspector } from '../public/js/inspector.js';

const dataPath = resolve(__dirname, '../public/data/inspector/inspector.json');
const data = JSON.parse(readFileSync(dataPath, 'utf8'));

describe('inspector.json schema', () => {
  it('has an items array', () => {
    expect(Array.isArray(data.items)).toBe(true);
  });

  it('items have name and icon', () => {
    for (const item of data.items) {
      expect(typeof item.name).toBe('string');
      expect(typeof item.icon).toBe('string');
    }
  });
});

describe('renderInspector()', () => {
  let container;
  beforeEach(() => {
    container = document.createElement('div');
  });

  it('renders one .inspector-row per item', () => {
    renderInspector(data, container);
    expect(container.querySelectorAll('.inspector-row').length).toBe(data.items.length);
  });

  it('renders the icon class and name', () => {
    renderInspector(data, container);
    const first = container.querySelector('.inspector-row');
    expect(first.querySelector('.file-icon').className).toContain(data.items[0].icon);
    expect(first.querySelector('.inspector-name').textContent).toBe(data.items[0].name);
  });

  it('renders an Add button in each row', () => {
    renderInspector(data, container);
    const btns = container.querySelectorAll('.inspector-row .icon-btn');
    expect(btns.length).toBe(data.items.length);
  });
});
