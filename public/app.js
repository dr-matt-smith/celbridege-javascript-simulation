// Minimal interactivity for the mockup: tree toggle + tree selection.
// The mockup is cosmetic — no real editing behavior.

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

// Collapse any tree-node that isn't marked .expanded at load.
document.querySelectorAll('.tree-node').forEach(node => {
  if (!node.classList.contains('expanded')) {
    const children = node.querySelector(':scope > .tree-children');
    if (children) children.style.display = 'none';
  }
});

// Panel resizers: drag a handle to change the adjacent panel size.
// Each handle declares its axis, the CSS var it drives, and a direction
// (+1 if dragging right/down grows the target, -1 if it shrinks).
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
