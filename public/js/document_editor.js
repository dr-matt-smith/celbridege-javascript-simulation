// Render tabs + code editor from JSON data.
// data: { tabs: [{ name, icon, active?, lines: [[ {t?, v} ... ]] }] }

export function renderDocumentEditor(data, tabsContainer, codeContainer) {
  renderTabs(data.tabs || [], tabsContainer);
  const activeTab = (data.tabs || []).find(t => t.active) || (data.tabs || [])[0];
  if (activeTab) renderCode(activeTab.lines || [], codeContainer);
}

function renderTabs(tabs, container) {
  container.replaceChildren();
  for (const tab of tabs) {
    const el = document.createElement('div');
    el.className = 'tab' + (tab.active ? ' active' : '');

    const icon = document.createElement('span');
    icon.className = `file-icon ${tab.icon || ''}`.trim();
    el.appendChild(icon);

    const name = document.createElement('span');
    name.className = 'tab-name';
    name.textContent = tab.name;
    el.appendChild(name);

    const close = document.createElement('button');
    close.className = 'tab-close';
    close.setAttribute('aria-label', 'Close tab');
    close.textContent = '×';
    el.appendChild(close);

    container.appendChild(el);
  }

  const spacer = document.createElement('div');
  spacer.className = 'tabs-spacer';
  container.appendChild(spacer);

  const splitBtn = document.createElement('button');
  splitBtn.className = 'icon-btn small';
  splitBtn.title = 'Split';
  splitBtn.innerHTML = '<svg viewBox="0 0 16 16" width="12" height="12"><rect x="2" y="2" width="5" height="12" stroke="currentColor" fill="none" stroke-width="1.2"/><rect x="9" y="2" width="5" height="12" stroke="currentColor" fill="none" stroke-width="1.2"/></svg>';
  container.appendChild(splitBtn);
}

function renderCode(lines, container) {
  container.replaceChildren();
  lines.forEach((tokens, i) => {
    const ln = document.createElement('span');
    ln.className = 'ln';
    ln.textContent = String(i + 1);
    container.appendChild(ln);

    for (const tok of tokens) {
      if (tok.t) {
        const span = document.createElement('span');
        span.className = `tok ${tok.t}`;
        span.textContent = tok.v;
        container.appendChild(span);
      } else {
        container.append(tok.v);
      }
    }
    container.append('\n');
  });
}
