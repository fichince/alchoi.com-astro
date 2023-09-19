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
    <PageText {title} {body} width="400px" relative={true} />
    <MapImg src={images[1].image} caption={images[1].caption}
      id={images[1].id} />
  </div>
</AppearWithMap>

<style lang="scss">
  #container {

    display: flex;
    justify-content: center;
    align-items: center;
    gap: var(--size-3);
    margin: auto 0;
    
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    :global(.map-img) {
      width: 30vw;
    }
  }
</style>