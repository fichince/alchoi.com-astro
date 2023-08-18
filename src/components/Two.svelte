<script lang="ts">
  import { mapStore } from '@src/stores/map';
  import { onMount } from 'svelte';

  onMount(() => {
    $mapStore.panTo([ 139.70085515273462, 35.675541428602614 ]);
  });
</script>