<script>
  import Titlebar from '$lib/components/Titlebar.svelte';
  import Explorer from '$lib/components/Explorer.svelte';
  import Editor from '$lib/components/Editor.svelte';
  import Console from '$lib/components/Console.svelte';
  import Inspector from '$lib/components/Inspector.svelte';
</script>

<div class="app">
  <Titlebar />
  <main class="workspace">
    <Explorer />
    <section class="center">
      <Editor />
      <Console />
    </section>
    <Inspector />
  </main>
</div>
