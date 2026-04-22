<script>
  import IconButton from './IconButton.svelte';
  import FileIcon from './FileIcon.svelte';
</script>

<aside class="panel inspector">
  <div class="panel-header">
    <span class="panel-title">Inspector</span>
    <IconButton title="Close" size="small">
      <svg viewBox="0 0 16 16" width="10" height="10"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" stroke-width="1.4"/></svg>
    </IconButton>
  </div>
  <div class="inspector-body">
    <div class="inspector-row">
      <FileIcon type="py" />
      <span class="inspector-name">hello_world.py</span>
      <IconButton title="Add" size="small" variant="right">
        <svg viewBox="0 0 16 16" width="12" height="12"><path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
      </IconButton>
    </div>
  </div>
</aside>

<style>
  .panel {
    background: var(--bg);
    display: flex;
    flex-direction: column;
    min-height: 0;
    border-left: 1px solid var(--border);
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
  .inspector-body { padding: 6px 8px; }
  .inspector-row {
    display: flex;
    align-items: center;
    gap: 6px;
    height: var(--row-h);
    padding: 0 4px;
  }
  .inspector-name { font-size: 12.5px; }
</style>
