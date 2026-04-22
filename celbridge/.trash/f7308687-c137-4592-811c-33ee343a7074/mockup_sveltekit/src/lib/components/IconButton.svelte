<script>
  let { title = '', variant = '', size = '', onclick, children } = $props();
</script>

<button
  class="icon-btn {variant} {size}"
  {title}
  aria-label={title}
  {onclick}
>
  {@render children?.()}
</button>

<style>
  .icon-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    padding: 0;
    background: transparent;
    border: 1px solid transparent;
    border-radius: 4px;
    color: #4a4a4a;
    cursor: pointer;
  }
  .icon-btn:hover { background: #e7e7e7; }
  .icon-btn.run { color: #2f8f3f; }
  .icon-btn.small { width: 20px; height: 20px; }
  .icon-btn.close:hover { background: #e81123; color: #fff; }
  .icon-btn.right { margin-left: auto; }
</style>
