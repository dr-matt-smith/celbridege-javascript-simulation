<script>
  import IconButton from './IconButton.svelte';
</script>

<div class="console">
  <div class="panel-header">
    <span class="panel-title">Console</span>
    <div class="header-actions">
      <IconButton title="Collapse" size="small">
        <span class="chev">▲</span>
      </IconButton>
      <IconButton title="Close" size="small">
        <svg viewBox="0 0 16 16" width="10" height="10"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" stroke-width="1.4"/></svg>
      </IconButton>
    </div>
  </div>
  <div class="console-body">
    <div class="console-line meta">Celbridge v0.2.6 - Python v3.13.12</div>
    <div class="console-line">&gt;&gt;&gt; run <span class="str">"03_hello_world/hello_world.py"</span> <span class="str">"Universe"</span></div>
    <div class="console-line">Hello Universe!</div>
    <div class="console-line prompt">&gt;&gt;&gt; <span class="caret"></span></div>
  </div>
</div>

<style>
  .console {
    display: flex;
    flex-direction: column;
    min-height: 0;
    background: var(--bg);
  }
  .panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 4px 8px;
    border-bottom: 1px solid var(--border);
    height: 28px;
    flex: 0 0 auto;
  }
  .panel-title {
    font-size: 12px;
    color: var(--text);
    letter-spacing: 0.2px;
  }
  .header-actions { display: flex; gap: 2px; }
  .chev { font-size: 10px; line-height: 1; }

  .console-body {
    flex: 1;
    overflow: auto;
    padding: 8px 12px;
    font-family: var(--font-mono);
    font-size: 12.5px;
    color: var(--text);
  }
  .console-line { white-space: pre; }
  .console-line.meta { color: var(--text-muted); margin-bottom: 6px; }
  .console-line :global(.str) { color: var(--code-string); }
  .console-line.prompt .caret {
    display: inline-block;
    width: 7px;
    height: 14px;
    vertical-align: -2px;
    background: #222;
    margin-left: 1px;
    animation: blink 1s steps(2, start) infinite;
  }
  @keyframes blink { to { visibility: hidden; } }
</style>
