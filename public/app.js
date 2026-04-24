// Entry point: fetch panel data and hydrate each panel, then wire up interaction.

import { renderExplorer } from './js/explorer.js';
import { renderConsole } from './js/console.js';
import { renderInspector } from './js/inspector.js';
import { renderDocumentEditor } from './js/document_editor.js';
import { resolveProjectSlug, panelUrl } from './js/project.js';

const PROJECT_SLUG = resolveProjectSlug(window.location.pathname);
console.info(`[project] slug="${PROJECT_SLUG ?? 'default'}" path="${window.location.pathname}"`);

const PANELS = [
  {
    name: 'explorer',
    mount: (data) => {
      renderExplorer(data, document.getElementById('explorer-body'));
      setPanelTitle('explorer', data.title);
      if (data.root && data.root.name) setProjectChip(data.root.name);
    },
  },
  {
    name: 'console',
    mount: (data) => {
      renderConsole(data, document.getElementById('console-body'));
      setPanelTitle('console', data.title);
    },
  },
  {
    name: 'inspector',
    mount: (data) => {
      renderInspector(data, document.getElementById('inspector-body'));
      setPanelTitle('inspector', data.title);
    },
  },
  {
    name: 'document_editor',
    mount: (data) => {
      renderDocumentEditor(
        data,
        document.getElementById('editor-tabs'),
        document.getElementById('code-block')
      );
    },
  },
];

function setPanelTitle(panel, title) {
  const el = document.querySelector(`[data-panel-title="${panel}"]`);
  if (el && title) el.textContent = title;
}

function setProjectChip(name) {
  const el = document.getElementById('project-chip-name');
  if (el) el.textContent = name;
}

async function hydrate() {
  await Promise.all(PANELS.map(async (panel) => {
    const url = panelUrl(panel.name, PROJECT_SLUG);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      panel.mount(data);
      console.info(`[panel:${panel.name}] hydrated from ${url}`);
    } catch (err) {
      console.error(`[panel:${panel.name}] failed to load ${url}:`, err);
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
