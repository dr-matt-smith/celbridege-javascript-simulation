// Tiny markdown subset. Supports paragraphs (blank-line separated), unordered
// lists (`- ` / `* `), fenced code blocks (``` optional-lang), and inline code
// (`…`). Everything else is treated as literal text. XSS-safe by construction:
// the renderer only uses createElement + textContent / Node.append(string).

export function parseMarkdown(src) {
  const lines = String(src ?? '').replace(/\r\n/g, '\n').split('\n');
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === '') { i++; continue; }

    if (/^```/.test(line)) {
      const lang = line.replace(/^```\s*/, '').trim();
      const codeLines = [];
      i++;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) {
        codeLines.push(lines[i]);
        i++;
      }
      if (i < lines.length) i++; // consume closing fence
      blocks.push({ type: 'code_block', text: codeLines.join('\n'), lang });
      continue;
    }

    if (/^\s*[-*]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        const content = lines[i].replace(/^\s*[-*]\s+/, '');
        items.push(parseInlines(content));
        i++;
      }
      blocks.push({ type: 'list', items });
      continue;
    }

    const paraLines = [];
    while (
      i < lines.length
      && lines[i].trim() !== ''
      && !/^\s*[-*]\s+/.test(lines[i])
      && !/^```/.test(lines[i])
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    blocks.push({ type: 'paragraph', inlines: parseInlines(paraLines.join(' ')) });
  }

  return blocks;
}

export function parseInlines(text) {
  const out = [];
  const re = /`([^`]+)`/g;
  let last = 0;
  let m;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push({ type: 'text', value: text.slice(last, m.index) });
    out.push({ type: 'code', value: m[1] });
    last = re.lastIndex;
  }
  if (last < text.length) out.push({ type: 'text', value: text.slice(last) });
  return out;
}

export function renderMarkdownInto(src, container) {
  for (const block of parseMarkdown(src)) {
    container.appendChild(renderBlock(block));
  }
}

function renderBlock(block) {
  if (block.type === 'list') {
    const ul = document.createElement('ul');
    for (const item of block.items) {
      const li = document.createElement('li');
      renderInlines(item, li);
      ul.appendChild(li);
    }
    return ul;
  }
  if (block.type === 'code_block') {
    const pre = document.createElement('pre');
    const code = document.createElement('code');
    if (block.lang) code.className = `lang-${block.lang}`;
    code.textContent = block.text;
    pre.appendChild(code);
    return pre;
  }
  const p = document.createElement('p');
  renderInlines(block.inlines, p);
  return p;
}

function renderInlines(inlines, parent) {
  for (const inline of inlines) {
    if (inline.type === 'code') {
      const code = document.createElement('code');
      code.textContent = inline.value;
      parent.appendChild(code);
    } else {
      parent.append(inline.value);
    }
  }
}
