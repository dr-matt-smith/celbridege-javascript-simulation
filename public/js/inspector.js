// Render the Inspector panel from JSON data.
// data: { items: [{ name, icon }] }

export function renderInspector(data, container) {
  container.replaceChildren();
  for (const item of data.items || []) {
    container.appendChild(renderItem(item));
  }
  return container;
}

function renderItem(item) {
  const row = document.createElement('div');
  row.className = 'inspector-row';

  const icon = document.createElement('span');
  icon.className = `file-icon ${item.icon || ''}`.trim();
  row.appendChild(icon);

  const name = document.createElement('span');
  name.className = 'inspector-name';
  name.textContent = item.name;
  row.appendChild(name);

  const add = document.createElement('button');
  add.className = 'icon-btn small right';
  add.title = 'Add';
  add.innerHTML = '<svg viewBox="0 0 16 16" width="12" height="12"><path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>';
  row.appendChild(add);

  return row;
}
