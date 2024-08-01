<script lang="ts">
  import { mapPage } from '@src/stores/map';
  import PageText from '../PageText.svelte';
  import MapImg from '../MapImg.svelte';

  const { images = [] } = $mapPage;

</script>

<div id="container">
  <masonry-layout gap="5px" cols="4">
    <div class="map-img">
      <MapImg image={images[0]} />
    </div>
    <PageText mapPage={$mapPage} relative width="auto" />
    <div class="map-img">
      <MapImg image={images[1]} />
    </div>
    <div class="map-img">
      <MapImg image={images[2]} />
    </div>
    <div class="map-img">
      <MapImg image={images[3]} />
    </div>
    <div class="map-img">
      <MapImg image={images[4]} />
    </div>
    <div class="map-img">
      <MapImg image={images[6]} />
    </div>
    <div class="map-img">
      <MapImg image={images[5]} />
    </div>
  </masonry-layout>
</div>

<style lang="scss">
  #container {

    position: relative;
    width: 90%;
    margin: 0 auto;
    top: 3vh;

    .map-img {
      flex: auto;
      :global(img) {
        object-fit: cover;
        object-position: top;
        aspect-ratio: 10 / 11;
      }
    }
  }
</style>