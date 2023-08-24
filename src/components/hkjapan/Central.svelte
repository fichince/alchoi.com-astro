<script lang="ts">
  import { renderMarkdown } from '@src/markdown';
  import { mapStore, mapPage, mapMoving, mapIdle } from '@src/stores/map';
  import { onMount } from 'svelte';

  let show : boolean = false;
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

  const { body } = $mapPage;
  const html = renderMarkdown(body ?? '');

  $: show = !$mapMoving;

  $: {
    if ($mapIdle && !$mapMoving) {
      $mapStore.setLayoutProperty(slug, 'visibility', 'visible');
    }
  }

</script>

<article class:show>
  <div id="central">
    {@html html}
  </div>
  <div id="images">
    {#each images as i}
      <img src={i.image} alt={i.caption} />
    {/each}
  </div>
</article>

<style lang="scss">

  article {
    &.show {
      visibility: visible;
    }
    &:not(.show) {
      visibility: hidden;
    }
  }

  #central {
    position: absolute;
    top: 60vh;

    width: 30vw;
    left: 60vw;

    background-color: var(--colour-background);
    padding: var(--size-fluid-1);
    border-radius: var(--radius-2);
  }

  #images {
    position: absolute;

    left: 15vw;
    top: 0;
    height: 100vh;

    display: flex;
    flex-direction: column;

    justify-content: space-around;
  }

</style>