import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { renderDocumentEditor } from '../public/js/document_editor.js';

const dataPath = resolve(__dirname, '../public/data/document_editor/document_editor.json');
const data = JSON.parse(readFileSync(dataPath, 'utf8'));

describe('document_editor.json schema', () => {
  it('has a tabs array with at least one active tab', () => {
    expect(Array.isArray(data.tabs)).toBe(true);
    expect(data.tabs.some(t => t.active)).toBe(true);
  });

  it('each tab has a lines array of token arrays', () => {
    for (const tab of data.tabs) {
      expect(Array.isArray(tab.lines)).toBe(true);
      for (const line of tab.lines) {
        expect(Array.isArray(line)).toBe(true);
      }
    }
  });
});

describe('renderDocumentEditor()', () => {
  let tabs, code;
  beforeEach(() => {
    tabs = document.createElement('div');
    code = document.createElement('code');
  });

  it('renders one .tab per tab plus a spacer and split button', () => {
    renderDocumentEditor(data, tabs, code);
    expect(tabs.querySelectorAll('.tab').length).toBe(data.tabs.length);
    expect(tabs.querySelector('.tabs-spacer')).not.toBeNull();
  });

  it('marks the active tab', () => {
    renderDocumentEditor(data, tabs, code);
    const activeIdx = data.tabs.findIndex(t => t.active);
    const active = tabs.querySelectorAll('.tab')[activeIdx];
    expect(active.classList.contains('active')).toBe(true);
  });

  it('renders a line number for every line', () => {
    renderDocumentEditor(data, tabs, code);
    const activeTab = data.tabs.find(t => t.active);
    const lns = code.querySelectorAll('.ln');
    expect(lns.length).toBe(activeTab.lines.length);
    expect(lns[0].textContent).toBe('1');
  });

  it('renders syntax tokens with tok.<type> classes', () => {
    renderDocumentEditor(data, tabs, code);
    expect(code.querySelector('.tok.kw')).not.toBeNull();
    expect(code.querySelector('.tok.fn')).not.toBeNull();
    expect(code.querySelector('.tok.str')).not.toBeNull();
    expect(code.querySelector('.tok.com')).not.toBeNull();
  });

  it('outputs the imported sys module as text', () => {
    renderDocumentEditor(data, tabs, code);
    expect(code.textContent).toContain('import');
    expect(code.textContent).toContain('sys');
    expect(code.textContent).toContain('Hello world!');
  });
});
