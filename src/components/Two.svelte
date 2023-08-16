<script lang="ts">
  import { mapStore } from '@src/stores/map';
  import { onMount } from 'svelte';

  onMount(() => {
    $mapStore.flyTo([ 35.675541428602614, 139.70085515273462 ], 17);
  });
</script>