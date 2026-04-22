import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { renderConsole } from '../public/js/console.js';

const dataPath = resolve(__dirname, '../public/data/console/console.json');
const data = JSON.parse(readFileSync(dataPath, 'utf8'));

describe('console.json schema', () => {
  it('has a lines array', () => {
    expect(Array.isArray(data.lines)).toBe(true);
    expect(data.lines.length).toBeGreaterThan(0);
  });

  it('starts with a meta line and ends with a prompt line', () => {
    expect(data.lines[0].kind).toBe('meta');
    expect(data.lines.at(-1).kind).toBe('prompt');
  });
});

describe('renderConsole()', () => {
  let container;
  beforeEach(() => {
    container = document.createElement('div');
  });

  it('renders one .console-line per data line', () => {
    renderConsole(data, container);
    expect(container.querySelectorAll('.console-line').length).toBe(data.lines.length);
  });

  it('applies the kind as a CSS class', () => {
    renderConsole(data, container);
    expect(container.querySelector('.console-line.meta')).not.toBeNull();
    expect(container.querySelector('.console-line.prompt')).not.toBeNull();
  });

  it('renders styled segments as spans', () => {
    renderConsole(data, container);
    const strs = container.querySelectorAll('.console-line .str');
    expect(strs.length).toBeGreaterThanOrEqual(2);
  });

  it('renders a blinking caret on the prompt line', () => {
    renderConsole(data, container);
    expect(container.querySelector('.console-line.prompt .caret')).not.toBeNull();
  });
});
