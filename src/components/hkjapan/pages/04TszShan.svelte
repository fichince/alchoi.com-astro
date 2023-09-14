<script lang="ts">
  import { mapStore, mapPage } from '@src/stores/map';
  import { onMount } from 'svelte';
  import PageText from '../PageText.svelte';
  import AppearWithMap from '../AppearWithMap.svelte';
  import MapImg from '../MapImg.svelte';

  onMount(() => {
    const { map } = $mapPage;

    if (map) {
      const { lat, lon, zoom } = map;
      $mapStore.jumpTo({
        center: { lat, lon },
        zoom
      });
    }
  });

  $: ({ body, title, images = [] } = $mapPage);

</script>

<AppearWithMap>
  <div id="container">
    <MapImg src={images[0].image} caption={images[0].caption}
      id={images[0].id} />
    <PageText {title} {body} />
    <MapImg src={images[1].image} caption={images[1].caption}
      id={images[1].id} />
  </div>
</AppearWithMap>

<style lang="scss">
  #container {

    display: flex;
    justify-content: center;
    gap: var(--size-3);

    position: absolute;
    height: 90vh;
    top: 15vh;

    :global(figure) {
      width: 2px;
    }
  }
</style>