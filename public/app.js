// Entry point: fetch panel data and hydrate each panel, then wire up interaction.

import { renderExplorer } from './js/explorer.js';
import { renderConsole } from './js/console.js';
import { renderInspector } from './js/inspector.js';
import { renderDocumentEditor } from './js/document_editor.js';

const PANELS = [
  {
    name: 'explorer',
    url: 'data/explorer/explorer.json',
    mount: (data) => {
      const body = document.getElementById('explorer-body');
      renderExplorer(data, body);
      const titleEl = document.querySelector('[data-panel-title="explorer"]');
      if (titleEl && data.title) titleEl.textContent = data.title;
    },
  },
  {
    name: 'console',
    url: 'data/console/console.json',
    mount: (data) => {
      renderConsole(data, document.getElementById('console-body'));
      const titleEl = document.querySelector('[data-panel-title="console"]');
      if (titleEl && data.title) titleEl.textContent = data.title;
    },
  },
  {
    name: 'inspector',
    url: 'data/inspector/inspector.json',
    mount: (data) => {
      renderInspector(data, document.getElementById('inspector-body'));
      const titleEl = document.querySelector('[data-panel-title="inspector"]');
      if (titleEl && data.title) titleEl.textContent = data.title;
    },
  },
  {
    name: 'document_editor',
    url: 'data/document_editor/document_editor.json',
    mount: (data) => {
      renderDocumentEditor(
        data,
        document.getElementById('editor-tabs'),
        document.getElementById('code-block')
      );
    },
  },
];

async function hydrate() {
  await Promise.all(PANELS.map(async (panel) => {
    try {
      const res = await fetch(panel.url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      panel.mount(data);
      console.info(`[panel:${panel.name}] hydrated from ${panel.url}`);
    } catch (err) {
      console.error(`[panel:${panel.name}] failed to load ${panel.url}:`, err);
    }
  }));

  wireTreeInteraction();
  wireResizers();
}

function wireTreeInteraction() {
  document.addEventListener('click', (e) => {
    const twisty = e.target.closest('.twisty');
    if (twisty && twisty.textContent.trim()) {
      const node = twisty.closest('.tree-node');
      if (node) {
        node.classList.toggle('expanded');
        const children = node.querySelector(':scope > .tree-children');
        if (children) children.style.display = node.classList.contains('expanded') ? '' : 'none';
        twisty.textContent = node.classList.contains('expanded') ? '▾' : '▸';
        e.stopPropagation();
        return;
      }
    }

    const row = e.target.closest('.tree-row');
    if (row) {
      document.querySelectorAll('.tree-row.selected').forEach(el => el.classList.remove('selected'));
      row.classList.add('selected');
    }
  });
}

function wireResizers() {
  document.querySelectorAll('.resizer').forEach(handle => {
    handle.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      const axis = handle.dataset.axis;
      const varName = handle.dataset.var;
      const dir = parseFloat(handle.dataset.direction) || 1;
      const min = parseFloat(handle.dataset.min) || 0;
      const max = parseFloat(handle.dataset.max) || Infinity;
      const root = document.documentElement;
      const startPos = axis === 'x' ? e.clientX : e.clientY;
      const startVal = parseFloat(getComputedStyle(root).getPropertyValue(varName)) || 0;

      handle.setPointerCapture(e.pointerId);
      handle.classList.add('dragging');
      document.body.classList.add('resizing', axis === 'x' ? 'resizing-col' : 'resizing-row');

      function onMove(ev) {
        const pos = axis === 'x' ? ev.clientX : ev.clientY;
        const delta = (pos - startPos) * dir;
        const next = Math.max(min, Math.min(max, startVal + delta));
        root.style.setProperty(varName, `${next}px`);
      }

      function onUp(ev) {
        handle.releasePointerCapture(ev.pointerId);
        handle.removeEventListener('pointermove', onMove);
        handle.removeEventListener('pointerup', onUp);
        handle.removeEventListener('pointercancel', onUp);
        handle.classList.remove('dragging');
        document.body.classList.remove('resizing', 'resizing-col', 'resizing-row');
      }

      handle.addEventListener('pointermove', onMove);
      handle.addEventListener('pointerup', onUp);
      handle.addEventListener('pointercancel', onUp);
    });
  });
}

hydrate();
