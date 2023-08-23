<script lang="ts">
  import { renderMarkdown } from '@src/markdown';
  import { mapStore, mapPage, mapMoving } from '@src/stores/map';
  import { onMount } from 'svelte';

  let show : boolean = false;

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

  const { body } = $mapPage;
  const html = renderMarkdown(body ?? '');

  console.log('here', $mapPage);

  $: show = !$mapMoving;

  $: ({ images } = $mapPage);

  $: console.log('images', images);
</script>

<div id="central" class:show>
  {@html html}
</div>
<div id="images" class:show>
  <img src={images?.[0].image} />
  <img src={images?.[1].image} />
</div>

<style lang="scss">
  #central {
    position: absolute;
    top: 60vh;

    width: 30vw;
    left: 60vw;

    background-color: var(--colour-background);
    padding: var(--size-fluid-1);
    border-radius: var(--radius-2);

    &.show {
      visibility: visible;
    }
    &:not(.show) {
      visibility: hidden;
    }
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