<script lang="ts">
  import { onMount } from 'svelte';

  onMount(async () => {

    const res = await fetch('/search-index.json');
    const index = await res.json();

  });
</script>

<div class="search">
  <input type="text" />
</div>

<style lang="scss">
  .search {
    display: flex;
    flex-direction: column;
    align-items: center;

    input {
      width: var(--size-fluid-10);
      font-size: var(--font-size-5);
      border-radius: var(--radius-2);
      padding: var(--size-fluid-1);
      color: var(--primary);
    }
  }
</style>