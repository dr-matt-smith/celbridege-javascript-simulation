// Render the Console body from JSON data.
// data: { lines: [{ kind: "meta"|"command"|"output"|"prompt", text?, segments? }] }

export function renderConsole(data, container) {
  container.replaceChildren();
  for (const line of data.lines || []) {
    container.appendChild(renderLine(line));
  }
  return container;
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
