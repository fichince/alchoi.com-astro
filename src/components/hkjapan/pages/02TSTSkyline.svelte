<script lang="ts">
  import { mapStore, mapPage, mapMoving, mapIdle, mapHovered, updateHover } from '@src/stores/map';
  import { onMount } from 'svelte';
  import PageText from '../PageText.svelte';

  let images : MapImage[] = [];
  let slug : string;

  onMount(() => {
    const { map } = $mapPage;
    console.log('central map', map);
    slug = $mapPage.slug;

    if (map) {
      const { lat, lon, zoom } = map;
      $mapStore.flyTo({
        center: { lat, lon },
        zoom
      });
      //$mapStore.zoomTo(zoom);
    }

    console.log('mounting central', $mapPage);

    images = $mapPage.images ?? [];

    return () => {
      console.log('unmount', slug);
      $mapStore.setLayoutProperty(slug, 'visibility', 'none');
    }
  });

  const { body, title } = $mapPage;

  $: {
    if (slug && $mapIdle && !$mapMoving) {
      $mapStore.setLayoutProperty(slug, 'visibility', 'visible');
    }
  }

</script>

<PageText {title} {body}
  top="var(--size-8)"
  width="var(--size-15)"
  left="var(--size-8)"
/>
<div id="images">
  {#each images as i}
    <img src={i.image} alt={i.caption} 
      class:hovered={$mapHovered === i.id}
      on:mouseenter={() => updateHover(i.id)}
      on:mouseleave={() => updateHover(null)} />
  {/each}
</div>

<style lang="scss">
  #images {
    position: absolute;

    bottom: 0;
    top: 0;
    height: 100vh;

    img.hovered {
      border: 2px solid red;

    }
  }
</style>