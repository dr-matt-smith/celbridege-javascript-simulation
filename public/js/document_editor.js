// Render tabs + code editor from JSON data.
// Default layout: data = { tabs: [{ name, icon, active?, lines: [[ {t?, v} ... ]] }] }
// Knowledge-map layout (v6 /map1 mockup):
//   data = { layout: "knowledge-map", heading, progress: { completed, total, percent },
//            columns: [ [{ name, type }, ...], ... ] }

export function renderDocumentEditor(data, tabsContainer, codeContainer) {
  tabsContainer.classList.remove('km-header');
  codeContainer.classList.remove('km-body');
  if (data && data.layout === 'knowledge-map') {
    renderKnowledgeMap(data, tabsContainer, codeContainer);
    return;
  }
  renderTabs(data.tabs || [], tabsContainer);
  const activeTab = (data.tabs || []).find(t => t.active) || (data.tabs || [])[0];
  if (activeTab) renderCode(activeTab.lines || [], codeContainer);
}

function renderKnowledgeMap(data, tabsContainer, codeContainer) {
  tabsContainer.replaceChildren();
  tabsContainer.classList.add('km-header');

  const heading = document.createElement('div');
  heading.className = 'km-heading';
  heading.textContent = data.heading || 'Introduction to Python';
  tabsContainer.appendChild(heading);

  if (data.progress) {
    const pr = document.createElement('div');
    pr.className = 'km-progress';

    const label = document.createElement('span');
    label.className = 'km-progress-label';
    label.textContent = `${data.progress.completed} / ${data.progress.total} topics completed`;
    pr.appendChild(label);

    const bar = document.createElement('div');
    bar.className = 'km-progress-bar';
    const fill = document.createElement('div');
    fill.className = 'km-progress-fill';
    fill.style.width = `${data.progress.percent}%`;
    const pct = document.createElement('span');
    pct.className = 'km-progress-percent';
    pct.textContent = `${data.progress.percent}%`;
    fill.appendChild(pct);
    bar.appendChild(fill);
    pr.appendChild(bar);

    tabsContainer.appendChild(pr);
  }

  codeContainer.replaceChildren();
  codeContainer.classList.add('km-body');

  const grid = document.createElement('div');
  grid.className = 'km-grid';
  for (const col of data.columns || []) {
    const colEl = document.createElement('div');
    colEl.className = 'km-col';
    for (const card of col) {
      colEl.appendChild(renderKmCard(card));
    }
    grid.appendChild(colEl);
  }
  codeContainer.appendChild(grid);
}

function renderKmCard(card) {
  const el = document.createElement('div');
  el.className = `km-card ${card.type || ''}`.trim();

  const icons = document.createElement('span');
  icons.className = 'km-card-icons';
  for (const kind of card.icons || []) {
    const i = document.createElement('span');
    i.className = `km-card-icon ${kind}`;
    i.textContent = kind === 'theory' ? 'B' : kind === 'coding' ? 'C' : '';
    icons.appendChild(i);
  }
  el.appendChild(icons);

  const name = document.createElement('span');
  name.className = 'km-card-name';
  name.textContent = card.name;
  el.appendChild(name);

  return el;
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
