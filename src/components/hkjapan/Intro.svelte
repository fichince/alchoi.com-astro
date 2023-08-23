<script lang="ts">
  import { onMount } from 'svelte';
  import { mapStore, mapPage } from '@src/stores/map';
  import { renderMarkdown } from '@src/markdown';

  onMount(() => {
    const { map } = $mapPage;
    console.log('intro map', map);

    if (map) {
      const { lat, lon, zoom } = map;
      $mapStore.flyTo({
        center: { lat, lon },
        zoom
      });
      //$mapStore.zoomTo(zoom);
    }
  });

  console.log('here', $mapPage);

  const { body } = $mapPage;
  const html = renderMarkdown(body ?? '');

</script>

<div id="intro">
  {@html html}
</div>

<style lang="scss">
  #intro {
    position: absolute;
    z-index: 10;
  }
</style>