import { describe, it, expect } from 'vitest';
import { parseMarkdown, parseInlines, renderMarkdownInto } from '../public/js/markdown.js';

describe('parseMarkdown() — blocks', () => {
  it('returns [] for empty / whitespace input', () => {
    expect(parseMarkdown('')).toEqual([]);
    expect(parseMarkdown('   \n\n  ')).toEqual([]);
    expect(parseMarkdown(null)).toEqual([]);
    expect(parseMarkdown(undefined)).toEqual([]);
  });

  it('produces one paragraph for a single line of text', () => {
    const blocks = parseMarkdown('hello world');
    expect(blocks).toHaveLength(1);
    expect(blocks[0].type).toBe('paragraph');
    expect(blocks[0].inlines).toEqual([{ type: 'text', value: 'hello world' }]);
  });

  it('splits blank-line-separated text into multiple paragraphs', () => {
    const blocks = parseMarkdown('one\n\ntwo\n\nthree');
    expect(blocks.map(b => b.type)).toEqual(['paragraph', 'paragraph', 'paragraph']);
    expect(blocks[0].inlines[0].value).toBe('one');
    expect(blocks[2].inlines[0].value).toBe('three');
  });

  it('joins consecutive non-blank lines into one paragraph (with a space)', () => {
    const blocks = parseMarkdown('line one\nline two');
    expect(blocks).toHaveLength(1);
    expect(blocks[0].inlines[0].value).toBe('line one line two');
  });

  it('parses a `-` bullet list', () => {
    const blocks = parseMarkdown('- a\n- b\n- c');
    expect(blocks).toHaveLength(1);
    expect(blocks[0].type).toBe('list');
    expect(blocks[0].items).toHaveLength(3);
    expect(blocks[0].items[0][0].value).toBe('a');
  });

  it('parses a `*` bullet list', () => {
    const blocks = parseMarkdown('* x\n* y');
    expect(blocks[0].type).toBe('list');
    expect(blocks[0].items.map(item => item[0].value)).toEqual(['x', 'y']);
  });

  it('separates paragraph + list + paragraph', () => {
    const blocks = parseMarkdown('intro\n\n- a\n- b\n\ntail');
    expect(blocks.map(b => b.type)).toEqual(['paragraph', 'list', 'paragraph']);
    expect(blocks[2].inlines[0].value).toBe('tail');
  });

  it('parses a fenced code block and preserves line breaks', () => {
    const blocks = parseMarkdown('```\nline1\nline2\n```');
    expect(blocks).toHaveLength(1);
    expect(blocks[0].type).toBe('code_block');
    expect(blocks[0].text).toBe('line1\nline2');
    expect(blocks[0].lang).toBe('');
  });

  it('captures the language tag on a fenced code block', () => {
    const blocks = parseMarkdown('```python\nprint(1)\n```');
    expect(blocks[0].lang).toBe('python');
    expect(blocks[0].text).toBe('print(1)');
  });
});

describe('parseInlines() — inline code', () => {
  it('returns a single text node for plain text', () => {
    expect(parseInlines('just text')).toEqual([{ type: 'text', value: 'just text' }]);
  });

  it('turns `foo` into a code inline', () => {
    const inlines = parseInlines('call `foo` here');
    expect(inlines).toEqual([
      { type: 'text', value: 'call ' },
      { type: 'code', value: 'foo' },
      { type: 'text', value: ' here' },
    ]);
  });

  it('handles multiple inline code spans', () => {
    const inlines = parseInlines('`a` + `b` = `c`');
    const codes = inlines.filter(n => n.type === 'code').map(n => n.value);
    expect(codes).toEqual(['a', 'b', 'c']);
  });
});

describe('renderMarkdownInto() — DOM output', () => {
  it('renders a paragraph as <p>', () => {
    const div = document.createElement('div');
    renderMarkdownInto('hello', div);
    expect(div.querySelectorAll('p').length).toBe(1);
    expect(div.textContent).toBe('hello');
  });

  it('renders bullet list as <ul><li>…</li></ul>', () => {
    const div = document.createElement('div');
    renderMarkdownInto('- one\n- two', div);
    const lis = div.querySelectorAll('ul li');
    expect(lis.length).toBe(2);
    expect(lis[0].textContent).toBe('one');
    expect(lis[1].textContent).toBe('two');
  });

  it('renders inline code as <code>', () => {
    const div = document.createElement('div');
    renderMarkdownInto('use `x` here', div);
    const code = div.querySelector('p code');
    expect(code.textContent).toBe('x');
  });

  it('renders a fenced code block as <pre><code class="lang-…">', () => {
    const div = document.createElement('div');
    renderMarkdownInto('```python\nprint(1)\n```', div);
    const code = div.querySelector('pre code');
    expect(code.textContent).toBe('print(1)');
    expect(code.className).toBe('lang-python');
  });

  it('does NOT interpret HTML — tags are rendered as literal text (XSS-safe)', () => {
    const div = document.createElement('div');
    renderMarkdownInto('hello <script>alert(1)</script>', div);
    expect(div.querySelectorAll('script').length).toBe(0);
    expect(div.textContent).toContain('<script>alert(1)</script>');
  });

  it('preserves angle-bracket placeholders like <int1>', () => {
    const div = document.createElement('div');
    renderMarkdownInto('my_min(<int1>, <int2>, ...)', div);
    expect(div.textContent).toBe('my_min(<int1>, <int2>, ...)');
  });
});
