<script>
  let { type = 'folder' } = $props();
</script>

<span class="file-icon {type}" aria-hidden="true"></span>

<style>
  .file-icon {
    display: inline-block;
    width: 14px;
    height: 14px;
    flex-shrink: 0;
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
  }
  .file-icon.folder {
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M1.5 4a1 1 0 0 1 1-1h3l1.2 1.5h6.8a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H2.5a1 1 0 0 1-1-1z' fill='%23dcb67a' stroke='%23a88a5a' stroke-width='0.6'/></svg>");
  }
  .file-icon.py {
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><circle cx='8' cy='8' r='6' fill='%232f8f3f'/><text x='8' y='11' text-anchor='middle' font-size='7' fill='white' font-family='sans-serif' font-weight='700'>py</text></svg>");
  }
  .file-icon.md {
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><rect x='2' y='3' width='12' height='10' rx='1' fill='%23519aba'/><text x='8' y='11' text-anchor='middle' font-size='6' fill='white' font-family='sans-serif' font-weight='700'>md</text></svg>");
  }
  .file-icon.project {
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><rect x='2' y='2' width='12' height='12' rx='2' fill='%237c5cff'/><path d='M5 5h6v2H5zM5 8h6v2H5z' fill='white'/></svg>");
  }
</style>
