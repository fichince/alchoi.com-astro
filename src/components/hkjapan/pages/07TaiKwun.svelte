<script lang="ts">
  import { mapPage, moveMap } from '@src/stores/map';
  import { onMount } from 'svelte';
  import PageText from '../PageText.svelte';
  import MapImg from '../MapImg.svelte';

  onMount(() => {
    moveMap({}, true);
  });

  const { images = [] } = $mapPage;

</script>

<div id="container">
  <div id="img1" class="map-img">
    <MapImg image={images[1]} />
  </div>
  <div id="img2" class="map-img">
    <MapImg image={images[0]} />
  </div>

  <PageText mapPage={$mapPage} relative />

  <div id="img3" class="map-img">
    <MapImg image={images[2]} />
  </div>
</div>

<style lang="scss">
  #container {

    position: relative;
    max-height: 80vh;
    width: 80%;
    margin: 0 auto;
    //top: 30%;
    //left: 50%;
    //transform: translate(0, -50%);

    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr;

    #img1 {
      grid-row: 1 / 4;
      height: 100vh;
    }

    .map-img {
      height: 30vh;
    }

    gap: var(--size-3);
  }
</style>