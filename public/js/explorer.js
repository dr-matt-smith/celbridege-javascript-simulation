// Render the Explorer file tree from JSON data.
// data: { title, root: { name, type, expanded?, selected?, runnable?, children? } }

export function renderExplorer(data, container) {
  container.replaceChildren();
  const ul = document.createElement('ul');
  ul.className = 'tree';
  ul.id = 'tree';
  ul.appendChild(renderNode(data.root));
  container.appendChild(ul);
  return ul;
}

function renderNode(node) {
  const li = document.createElement('li');
  li.className = 'tree-node';
  const hasChildren = Array.isArray(node.children) && node.children.length > 0;
  const expanded = hasChildren && node.expanded === true;
  if (expanded) li.classList.add('expanded');

  const row = document.createElement('span');
  row.className = 'tree-row';
  if (node.selected) row.classList.add('selected');

  const twisty = document.createElement('span');
  twisty.className = 'twisty';
  const showTwisty = hasChildren || node.type === 'folder';
  twisty.textContent = showTwisty ? (expanded ? '▾' : '▸') : '';
  row.appendChild(twisty);

  const icon = document.createElement('span');
  icon.className = `file-icon ${node.type || ''}`.trim();
  row.appendChild(icon);

  const name = document.createElement('span');
  name.className = 'name';
  name.textContent = node.name;
  row.appendChild(name);

  if (node.runnable) {
    const run = document.createElement('button');
    run.className = 'tree-run-btn';
    run.title = 'Run';
    run.setAttribute('aria-label', `Run ${node.name}`);
    run.innerHTML = '<svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M4 3l9 5-9 5z" fill="currentColor"/></svg>';
    run.addEventListener('click', (e) => e.stopPropagation());
    row.appendChild(run);
  }

  li.appendChild(row);

  if (hasChildren) {
    const children = document.createElement('ul');
    children.className = 'tree-children';
    if (!expanded) children.style.display = 'none';
    for (const child of node.children) {
      children.appendChild(renderNode(child));
    }
    li.appendChild(children);
  }

  return li;
}
