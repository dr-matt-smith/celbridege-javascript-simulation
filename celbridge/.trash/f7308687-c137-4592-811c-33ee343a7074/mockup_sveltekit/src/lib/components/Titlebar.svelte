<script>
  import IconButton from './IconButton.svelte';
</script>

<header class="titlebar">
  <div class="titlebar-left">
    <IconButton title="Menu">
      <svg viewBox="0 0 16 16" width="16" height="16"><path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linecap="round"/></svg>
    </IconButton>
    <IconButton title="Search">
      <svg viewBox="0 0 16 16" width="16" height="16"><circle cx="7" cy="7" r="4.5" stroke="currentColor" stroke-width="1.4" fill="none"/><path d="M10.5 10.5l3 3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
    </IconButton>
    <div class="project-chip">
      <svg viewBox="0 0 16 16" width="14" height="14"><path d="M1.5 3.5a1 1 0 0 1 1-1h3.3l1.2 1.5h6.5a1 1 0 0 1 1 1V12a1 1 0 0 1-1 1H2.5a1 1 0 0 1-1-1z" stroke="currentColor" stroke-width="1.2" fill="none"/></svg>
      <span>cb-examples2</span>
    </div>
    <IconButton title="Run" variant="run">
      <svg viewBox="0 0 16 16" width="14" height="14"><path d="M4 3l9 5-9 5z" fill="currentColor"/></svg>
    </IconButton>
  </div>

  <div class="titlebar-right">
    <IconButton title="Layout">
      <svg viewBox="0 0 16 16" width="16" height="16"><rect x="2" y="2" width="5" height="12" stroke="currentColor" fill="none" stroke-width="1.2"/><rect x="9" y="2" width="5" height="5" stroke="currentColor" fill="none" stroke-width="1.2"/><rect x="9" y="9" width="5" height="5" stroke="currentColor" fill="none" stroke-width="1.2"/></svg>
    </IconButton>
    <IconButton title="Explorer">
      <svg viewBox="0 0 16 16" width="16" height="16"><rect x="2" y="2" width="4" height="12" stroke="currentColor" fill="none" stroke-width="1.2"/><rect x="6" y="2" width="8" height="12" stroke="currentColor" fill="none" stroke-width="1.2"/></svg>
    </IconButton>
    <IconButton title="Inspector">
      <svg viewBox="0 0 16 16" width="16" height="16"><rect x="2" y="2" width="8" height="12" stroke="currentColor" fill="none" stroke-width="1.2"/><rect x="10" y="2" width="4" height="12" stroke="currentColor" fill="none" stroke-width="1.2"/></svg>
    </IconButton>
    <IconButton title="Console">
      <svg viewBox="0 0 16 16" width="16" height="16"><rect x="2" y="2" width="12" height="8" stroke="currentColor" fill="none" stroke-width="1.2"/><rect x="2" y="10" width="12" height="4" stroke="currentColor" fill="none" stroke-width="1.2"/></svg>
    </IconButton>
    <IconButton title="Settings">
      <svg viewBox="0 0 16 16" width="16" height="16"><circle cx="8" cy="8" r="2" stroke="currentColor" stroke-width="1.2" fill="none"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.5 1.5M11.5 11.5L13 13M3 13l1.5-1.5M11.5 4.5L13 3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
    </IconButton>
    <IconButton title="Close" variant="close">
      <svg viewBox="0 0 16 16" width="12" height="12"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" stroke-width="1.4"/></svg>
    </IconButton>
  </div>
</header>

<style>
  .titlebar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 6px;
    background: var(--bg-titlebar);
    border-bottom: 1px solid var(--border);
    user-select: none;
  }
  .titlebar-left, .titlebar-right {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .project-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 3px 10px;
    margin: 0 4px;
    border: 1px solid var(--border);
    border-radius: 4px;
    background: var(--bg);
    color: var(--text);
    font-size: 12px;
  }
</style>
