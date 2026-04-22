<script>
  import TreeNode from './TreeNode.svelte';
  import IconButton from './IconButton.svelte';
  import { tree } from '$lib/data/tree.js';
</script>

<aside class="panel explorer">
  <div class="panel-header">
    <span class="panel-title">Explorer</span>
    <IconButton title="Close" size="small">
      <svg viewBox="0 0 16 16" width="10" height="10"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" stroke-width="1.4"/></svg>
    </IconButton>
  </div>
  <ul class="tree">
    <TreeNode node={tree} path={tree.name} />
  </ul>
</aside>

<style>
  .panel {
    background: var(--bg);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    min-height: 0;
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
  .tree {
    list-style: none;
    padding: 4px 0;
    margin: 0;
    overflow: auto;
  }
</style>
