// Render the Inspector panel from JSON data.
// Default layout ("items"):    data = { items: [{ name, icon }] }
// Check-task layout ("check-task"):
//   data = { layout: "check-task", tabs, description, warning, limits, actions, status, solution }
//   description may be a string, { markdown: "..." }, or legacy { text: "..." } — all rendered as markdown.
// Learning layout ("learning") — v6 /map1 About the course:
//   data = { layout: "learning", crumb?, heading, tabs, description: { markdown },
//            status?, nextButton: { label } }

import { renderMarkdownInto } from './markdown.js';

export function renderInspector(data, container) {
  container.replaceChildren();
  container.classList.remove('check-task', 'learning');
  if (data && data.layout === 'check-task') {
    renderCheckTask(data, container);
    return container;
  }
  if (data && data.layout === 'learning') {
    renderLearning(data, container);
    return container;
  }
  for (const item of data.items || []) {
    container.appendChild(renderItem(item));
  }
  return container;
}

function renderLearning(data, container) {
  container.classList.add('learning');

  if (data.crumb) {
    const c = document.createElement('div');
    c.className = 'learning-crumb';
    c.textContent = data.crumb;
    container.appendChild(c);
  }

  if (data.heading) {
    const h = document.createElement('h2');
    h.className = 'learning-heading';
    h.textContent = data.heading;
    container.appendChild(h);
  }

  if (Array.isArray(data.tabs) && data.tabs.length) {
    const tabBar = document.createElement('div');
    tabBar.className = 'learning-tabs';
    for (const tab of data.tabs) {
      const el = document.createElement('button');
      el.className = 'learning-tab' + (tab.active ? ' active' : '');
      el.textContent = tab.name;
      tabBar.appendChild(el);
    }
    container.appendChild(tabBar);
  }

  const md = markdownSource(data.description);
  if (md) {
    const wrap = document.createElement('div');
    wrap.className = 'learning-description md';
    renderMarkdownInto(md, wrap);
    container.appendChild(wrap);
  }

  if (data.status) {
    const s = document.createElement('div');
    s.className = `learning-status ${data.status.kind || ''}`.trim();
    const mark = document.createElement('span');
    mark.className = 'learning-status-mark';
    mark.textContent = '✓';
    const txt = document.createElement('span');
    txt.className = 'learning-status-text';
    txt.textContent = data.status.text;
    s.append(mark, txt);
    container.appendChild(s);
  }

  if (data.nextButton) {
    const bar = document.createElement('div');
    bar.className = 'learning-actions';
    const btn = document.createElement('button');
    btn.className = 'learning-next-btn';
    btn.textContent = data.nextButton.label;
    bar.appendChild(btn);
    container.appendChild(bar);
  }
}

function renderCheckTask(data, container) {
  container.classList.add('check-task');

  if (Array.isArray(data.tabs) && data.tabs.length) {
    const tabBar = document.createElement('div');
    tabBar.className = 'check-tabs';
    for (const tab of data.tabs) {
      const el = document.createElement('button');
      el.className = 'check-tab' + (tab.active ? ' active' : '');
      el.textContent = tab.name;
      tabBar.appendChild(el);
    }
    container.appendChild(tabBar);
  }

  const md = markdownSource(data.description);
  if (md) {
    const wrap = document.createElement('div');
    wrap.className = 'check-description md';
    renderMarkdownInto(md, wrap);
    container.appendChild(wrap);
  }

  if (data.warning) {
    const w = document.createElement('div');
    w.className = 'check-warning';
    if (data.warning.prefix) w.append(data.warning.prefix);
    if (data.warning.highlight) {
      const code = document.createElement('code');
      code.className = 'check-warning-highlight';
      code.textContent = data.warning.highlight;
      w.appendChild(code);
    }
    if (data.warning.suffix) w.append(data.warning.suffix);
    container.appendChild(w);
  }

  if (Array.isArray(data.limits) && data.limits.length) {
    const dl = document.createElement('dl');
    dl.className = 'check-limits';
    for (const lim of data.limits) {
      const dt = document.createElement('dt');
      dt.textContent = lim.label;
      const dd = document.createElement('dd');
      dd.textContent = lim.value;
      dl.append(dt, dd);
    }
    container.appendChild(dl);
  }

  if (Array.isArray(data.actions) && data.actions.length) {
    const bar = document.createElement('div');
    bar.className = 'check-actions';
    for (const action of data.actions) {
      const btn = document.createElement('button');
      btn.className = `check-btn ${action.kind || ''}`.trim();
      btn.textContent = action.label;
      bar.appendChild(btn);
    }
    container.appendChild(bar);
  }

  if (data.status) {
    const s = document.createElement('div');
    s.className = `check-status ${data.status.kind || ''}`.trim();
    const mark = document.createElement('span');
    mark.className = 'check-status-mark';
    mark.textContent = '✓';
    s.appendChild(mark);
    const txt = document.createElement('span');
    txt.className = 'check-status-text';
    txt.textContent = data.status.text;
    s.appendChild(txt);
    if (data.status.meta) {
      const meta = document.createElement('span');
      meta.className = 'check-status-meta';
      meta.textContent = data.status.meta;
      s.appendChild(meta);
    }
    container.appendChild(s);
  }

  if (data.solution) {
    const wrap = document.createElement('div');
    wrap.className = 'check-solution';
    if (data.solution.title) {
      const h = document.createElement('h4');
      h.className = 'check-solution-title';
      h.textContent = data.solution.title;
      wrap.appendChild(h);
    }
    for (const link of data.solution.links || []) {
      const a = document.createElement('a');
      a.className = 'check-solution-link';
      a.href = link.href || '#';
      a.textContent = link.label;
      wrap.appendChild(a);
    }
    container.appendChild(wrap);
  }
}

function markdownSource(desc) {
  if (!desc) return '';
  if (typeof desc === 'string') return desc;
  return desc.markdown || desc.text || '';
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
