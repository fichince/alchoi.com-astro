<script lang="ts">
  import { mapPage, moveMap } from '@src/stores/map';
  import { onMount } from 'svelte';
  import PageText from '../PageText.svelte';

  onMount(() => {
    //moveMap();
  });

</script>

<PageText mapPage={$mapPage} 
  bottom="15vh"
  right="8vw"
  width="20vw"
/>
