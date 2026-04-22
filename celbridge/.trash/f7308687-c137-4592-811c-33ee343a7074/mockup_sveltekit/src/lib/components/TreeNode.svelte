<script>
  import { untrack } from 'svelte';
  import Self from './TreeNode.svelte';
  import FileIcon from './FileIcon.svelte';
  import { selectedPath } from '$lib/stores.js';

  let { node, path } = $props();
  let expanded = $state(untrack(() => node.expanded ?? false));

  const isFolder = $derived(Array.isArray(node.children));

  function handleClick() {
    if (isFolder) {
      expanded = !expanded;
    } else {
      selectedPath.set(path);
    }
  }
</script>

<li class="tree-node">
  <span
    class="tree-row"
    class:selected={$selectedPath === path}
    onclick={handleClick}
    role="button"
    tabindex="0"
    onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(); } }}
  >
    <span class="twisty">{isFolder ? (expanded ? '▾' : '▸') : ''}</span>
    <FileIcon type={node.type} />
    <span class="name">{node.name}</span>
  </span>

  {#if isFolder && expanded}
    <ul class="tree-children">
      {#each node.children as child (child.name)}
        <Self node={child} path={`${path}/${child.name}`} />
      {/each}
    </ul>
  {/if}
</li>

<style>
  .tree-node { list-style: none; }
  .tree-children {
    list-style: none;
    padding: 0 0 0 14px;
    margin: 0;
  }
  .tree-row {
    display: flex;
    align-items: center;
    gap: 4px;
    height: var(--row-h);
    padding: 0 8px 0 4px;
    cursor: pointer;
    white-space: nowrap;
  }
  .tree-row:hover { background: #eef2f7; }
  .tree-row.selected { background: var(--bg-selected); }
  .twisty {
    display: inline-block;
    width: 12px;
    color: var(--text-muted);
    font-size: 10px;
    text-align: center;
  }
  .name { color: var(--text); }
</style>
