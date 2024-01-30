<script lang="ts">
  import { onMount } from 'svelte';
  import { mapPage, moveMap } from '@src/stores/map';
  import PageText from '../PageText.svelte';

  onMount(() => {
    moveMap();
  });

</script>

<PageText mapPage={$mapPage}
  top="60vh" 
  width="var(--size-15)"
  right="var(--size-11)"
/>