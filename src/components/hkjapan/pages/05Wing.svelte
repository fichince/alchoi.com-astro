<script lang="ts">
  import { mapPage, moveMap } from '@src/stores/map';
  import { onMount } from 'svelte';
  import PageText from '../PageText.svelte';
  import MapImg from '../MapImg.svelte';

  onMount(() => {
    //moveMap();
  });

  const { images = [] } = $mapPage;

</script>

<div id="container">
  <div id="img1" class="map-img">
    <MapImg image={images[0]} />
  </div>
  <div id="img2" class="map-img">
    <MapImg image={images[1]} />
  </div>

  <div id="text">
    <PageText mapPage={$mapPage} relative />
  </div>

  <div id="img3" class="map-img">
    <MapImg image={images[2]} />
  </div>
  <div id="img4" class="map-img">
    <MapImg image={images[3]} />
  </div>
</div>

<style lang="scss">
  #container {

    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 90vh;
    width: 90vw;

    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr;
    place-items: center;
    place-content: center;

    padding: var(--size-fluid-2);

    #img1 {
      grid-row: 1 / 2;
      grid-column: 1 / 2;
    }

    #img2 {
      grid-row: 1 / 2;
      grid-column: 3 / 4;
    }

    #img3 {
      grid-row: 3 / 4;
      grid-column: 1 / 2;
    }

    #img4 {
      grid-row: 3 / 4;
      grid-column: 3 / 4;
    }

    #text {
      grid-row: 2 / 3;
      grid-column: 2 / 3;
    }

    .map-img {
      height: 35vh;
    }
  }
</style>