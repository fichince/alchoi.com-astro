<script lang="ts">
  import { onMount } from 'svelte';
  import { mapStore, mapPage } from '@src/stores/map';
  import PageText from '../PageText.svelte';

  onMount(() => {
    const { map } = $mapPage;

    if (map) {
      const { lat, lon, zoom } = map;
      $mapStore.flyTo({
        center: { lat, lon },
        zoom
      });
    }
  });

  const { body, title } = $mapPage;

</script>

<PageText {title} {body}
  top="60vh" 
  width="var(--size-15)"
  right="var(--size-11)"
/>