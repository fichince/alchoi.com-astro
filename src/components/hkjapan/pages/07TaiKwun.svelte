<script lang="ts">
  import { mapPage, moveMap } from '@src/stores/map';
  import { onMount } from 'svelte';
  import PageText from '../PageText.svelte';
  import MapImg from '../MapImg.svelte';

  onMount(() => {
    moveMap();
  });

  const { images = [] } = $mapPage;

</script>

<div id="container">
  <div id="img1">
    <MapImg image={images[1]} />
  </div>
  <div id="img2" class="map-img">
    <MapImg image={images[0]} />
  </div>

  <div id="pagetext">
    <PageText mapPage={$mapPage} relative />
  </div>

  <div id="img3" class="map-img">
    <MapImg image={images[2]} />
  </div>
</div>

<style lang="scss">
  #container {

    position: relative;
    max-height: 90vh;
    width: 80%;
    margin: 0 auto;
    top: 5vh;

    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr;

    #pagetext {
      place-self: center;
    }

    #img1 {
      grid-row: span 3;
      align-self: stretch;
      height: 100%;
    }

    .map-img {
      max-height: 30vh;
    }

    gap: var(--size-1);
  }
</style>