<script lang="ts">
  import { mapStore } from '@src/stores/map';
  import { onMount } from 'svelte';

  onMount(() => {
    console.log('mounting intro');
    $mapStore.panTo([ 139.70085515273462, 35.675541428602614 ]);
    $mapStore.zoomTo(15);
  });
</script>