// Render the Console body from JSON data.
// Default layout ("lines"): data = { lines: [{ kind, text?, segments? }] }
// Test-results layout:
//   data = { layout: "test-results", columns: [..], rows: [{call, expected, actual, status: "pass"|"fail"}],
//            actions: [{ label, kind }] }

export function renderConsole(data, container) {
  container.replaceChildren();
  container.classList.remove('test-results');
  if (data && data.layout === 'test-results') {
    container.classList.add('test-results');
    renderTestResults(data, container);
    return container;
  }
  for (const line of data.lines || []) {
    container.appendChild(renderLine(line));
  }
  return container;
}

function renderTestResults(data, container) {
  if (Array.isArray(data.actions) && data.actions.length) {
    const bar = document.createElement('div');
    bar.className = 'test-actions';
    for (const action of data.actions) {
      const btn = document.createElement('button');
      btn.className = `test-rerun-btn ${action.kind || ''}`.trim();
      btn.textContent = action.label;
      bar.appendChild(btn);
    }
    container.appendChild(bar);
  }

  const table = document.createElement('table');
  table.className = 'test-table';

  if (Array.isArray(data.columns) && data.columns.length) {
    const thead = document.createElement('thead');
    const tr = document.createElement('tr');
    for (const col of data.columns) {
      const th = document.createElement('th');
      th.textContent = col;
      tr.appendChild(th);
    }
    thead.appendChild(tr);
    table.appendChild(thead);
  }

  const tbody = document.createElement('tbody');
  for (const row of data.rows || []) {
    const tr = document.createElement('tr');
    tr.className = `test-row ${row.status || ''}`.trim();

    const mk = (cls, text) => {
      const td = document.createElement('td');
      td.className = cls;
      td.textContent = text;
      return td;
    };
    tr.append(
      mk('test-call', row.call),
      mk('test-expected', row.expected),
      mk('test-actual', row.actual),
    );

    const statusTd = document.createElement('td');
    statusTd.className = 'test-status';
    const badge = document.createElement('span');
    badge.className = `test-badge ${row.status || ''}`.trim();
    const mark = document.createElement('span');
    mark.className = 'test-badge-mark';
    mark.textContent = row.status === 'pass' ? '✓' : '✗';
    const label = document.createElement('span');
    label.className = 'test-badge-label';
    label.textContent = row.status === 'pass' ? 'Pass' : 'Fail';
    badge.append(mark, ' ', label);
    statusTd.appendChild(badge);
    tr.appendChild(statusTd);

    tbody.appendChild(tr);
  }
  table.appendChild(tbody);
  container.appendChild(table);
}

function renderLine(line) {
  const el = document.createElement('div');
  el.className = 'console-line';
  if (line.kind) el.classList.add(line.kind);

  if (line.kind === 'prompt') {
    el.append(line.text ?? '>>> ');
    const caret = document.createElement('span');
    caret.className = 'caret';
    el.appendChild(caret);
    return el;
  }

  if (Array.isArray(line.segments)) {
    for (const seg of line.segments) {
      if (seg.style) {
        const span = document.createElement('span');
        span.className = seg.style;
        span.textContent = seg.text;
        el.appendChild(span);
      } else {
        el.append(seg.text);
      }
    }
    return el;
  }

  el.textContent = line.text ?? '';
  return el;
}
