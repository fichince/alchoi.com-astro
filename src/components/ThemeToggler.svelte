<script lang="ts">
  import { onMount } from 'svelte';
  import { getTheme, toggleTheme } from '@src/scripts/theme';

  let theme : string;

  onMount(() => {
    theme = getTheme();
  });
</script>

<button class="button" on:click={() => theme = toggleTheme()}>
  { theme === 'light' ? 'Go Dark' : 'Go Light' }
</button>
