import { describe, it, expect } from 'vitest';
import { resolveProjectSlug, panelUrl } from '../public/js/project.js';

describe('resolveProjectSlug()', () => {
  it('returns null for the site root', () => {
    expect(resolveProjectSlug('/')).toBeNull();
  });

  it('returns null for unknown paths', () => {
    expect(resolveProjectSlug('/whatever')).toBeNull();
    expect(resolveProjectSlug('')).toBeNull();
  });

  it('detects a known slug at the end of the path', () => {
    expect(resolveProjectSlug('/python1')).toBe('python1');
  });

  it('tolerates a trailing slash', () => {
    expect(resolveProjectSlug('/python1/')).toBe('python1');
  });
});

describe('panelUrl()', () => {
  it('uses <panel>.json when no slug is active', () => {
    expect(panelUrl('explorer', null)).toBe('data/explorer/explorer.json');
    expect(panelUrl('console', null)).toBe('data/console/console.json');
    expect(panelUrl('inspector', null)).toBe('data/inspector/inspector.json');
    expect(panelUrl('document_editor', null)).toBe('data/document_editor/document_editor.json');
  });

  it('uses <slug>.json under the panel folder when slug is active', () => {
    expect(panelUrl('explorer', 'python1')).toBe('data/explorer/python1.json');
    expect(panelUrl('console', 'python1')).toBe('data/console/python1.json');
    expect(panelUrl('inspector', 'python1')).toBe('data/inspector/python1.json');
    expect(panelUrl('document_editor', 'python1')).toBe('data/document_editor/python1.json');
  });
});
