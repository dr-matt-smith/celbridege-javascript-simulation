<script>
  import IconButton from './IconButton.svelte';
  import FileIcon from './FileIcon.svelte';
</script>

<div class="editor-area">
  <div class="tabs">
    <div class="tab active">
      <FileIcon type="py" />
      <span class="tab-name">hello_world.py</span>
      <button class="tab-close" aria-label="Close tab">×</button>
    </div>
    <div class="tabs-spacer"></div>
    <IconButton title="Split" size="small">
      <svg viewBox="0 0 16 16" width="12" height="12"><rect x="2" y="2" width="5" height="12" stroke="currentColor" fill="none" stroke-width="1.2"/><rect x="9" y="2" width="5" height="12" stroke="currentColor" fill="none" stroke-width="1.2"/></svg>
    </IconButton>
  </div>

  <div class="editor">
    <pre class="code"><code><span class="ln">1</span><span class="tok kw">import</span> <span class="tok mod">sys</span>
<span class="ln">2</span>
<span class="ln">3</span><span class="tok kw">def</span> <span class="tok fn">main</span>():
<span class="ln">4</span>
<span class="ln">5</span>    <span class="tok com"># Check if script was called with a name argument</span>
<span class="ln">6</span>    <span class="tok kw">if</span> <span class="tok fn">len</span>(<span class="tok mod">sys</span>.argv) &gt; <span class="tok num">1</span>:
<span class="ln">7</span>
<span class="ln">8</span>        <span class="tok com"># Say hello to the named person</span>
<span class="ln">9</span>        name = <span class="tok mod">sys</span>.argv[<span class="tok num">1</span>]
<span class="ln">10</span>        <span class="tok fn">print</span>(<span class="tok str">f"Hello {'{'}name{'}'}!"</span>)
<span class="ln">11</span>    <span class="tok kw">else</span>:
<span class="ln">12</span>
<span class="ln">13</span>        <span class="tok com"># Default to "Hello world!"</span>
<span class="ln">14</span>        <span class="tok fn">print</span>(<span class="tok str">"Hello world!"</span>)
<span class="ln">15</span>
<span class="ln">16</span>
<span class="ln">17</span><span class="tok kw">if</span> __name__ == <span class="tok str">"__main__"</span>:
<span class="ln">18</span>    <span class="tok fn">main</span>()
<span class="ln">19</span></code></pre>
  </div>
</div>

<style>
  .editor-area {
    display: flex;
    flex-direction: column;
    min-height: 0;
    border-bottom: 1px solid var(--border);
  }
  .tabs {
    display: flex;
    align-items: stretch;
    background: var(--bg-alt);
    border-bottom: 1px solid var(--border);
    height: 30px;
    flex: 0 0 auto;
  }
  .tab {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 0 10px;
    border-right: 1px solid var(--border);
    background: var(--bg-alt);
    color: var(--text-muted);
    cursor: pointer;
  }
  .tab.active {
    background: var(--bg);
    color: var(--text);
    border-top: 2px solid var(--accent);
    margin-top: -1px;
  }
  .tab-name { font-size: 12px; }
  .tab-close {
    width: 16px;
    height: 16px;
    border: none;
    background: transparent;
    color: var(--text-muted);
    cursor: pointer;
    border-radius: 3px;
    font-size: 14px;
    line-height: 14px;
  }
  .tab-close:hover { background: #e7e7e7; }
  .tabs-spacer { flex: 1; }

  .editor {
    flex: 1;
    overflow: auto;
    background: var(--bg);
    padding: 4px 0;
  }
  .code {
    margin: 0;
    padding: 0;
    font-family: var(--font-mono);
    font-size: 13px;
    line-height: 1.5;
    tab-size: 4;
    color: var(--text);
  }
  .code code { display: block; white-space: pre; padding-left: 8px; }
  .ln {
    display: inline-block;
    width: 36px;
    margin-right: 10px;
    text-align: right;
    color: var(--text-faint);
    user-select: none;
  }
  .tok.kw  { color: var(--code-keyword); font-weight: 600; }
  .tok.fn  { color: var(--code-function); }
  .tok.str { color: var(--code-string); }
  .tok.com { color: var(--code-comment); font-style: italic; }
  .tok.mod { color: var(--code-module); }
  .tok.num { color: var(--code-number); }
</style>
