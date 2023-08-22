<script lang="ts">
  import { mapStore, mapPage } from '@src/stores/map';
  import { onMount } from 'svelte';

  onMount(() => {
    const { map } = $mapPage;
    console.log('central map', map);

    if (map) {
      const { lat, lon, zoom } = map;
      $mapStore.flyTo({
        center: { lat, lon },
        zoom
      });
      //$mapStore.zoomTo(zoom);
    }

    console.log('mounting central');
  });

  console.log('here', $mapPage);
</script>