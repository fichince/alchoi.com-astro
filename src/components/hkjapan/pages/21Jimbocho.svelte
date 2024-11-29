<script lang="ts">

  import { mapPage } from '@src/stores/map';
  import PageText from '../PageText.svelte';
  import MapImg from '../MapImg.svelte';
  import type { MasonryLayout } from '@appnest/masonry-layout';

  const { images = [] } = $mapPage;

  let imageCount = $state(images.length);
  let masonryElement : MasonryLayout | undefined = $state();

  function imageLoaded() {
    imageCount--;
  }

  $effect(() => {
    if (imageCount === 0) {
      masonryElement?.layout();
    }
  });

</script>

<div id="container">
  <masonry-layout gap="5px" cols="4" bind:this={masonryElement}>
    <div class="map-img">
      <MapImg image={images[0]} onload={imageLoaded} />
    </div>
    <div class="map-img">
      <MapImg image={images[1]} onload={imageLoaded} />
    </div>
    <div class="map-img">
      <MapImg image={images[2]} onload={imageLoaded} />
    </div>
    <div class="map-img">
      <MapImg image={images[3]} onload={imageLoaded} />
    </div>
    <PageText mapPage={$mapPage} relative width="auto" />
    <div class="map-img">
      <MapImg image={images[4]} onload={imageLoaded} />
    </div>
    <div class="map-img">
      <MapImg image={images[5]} onload={imageLoaded} />
    </div>
    <div class="map-img">
      <MapImg image={images[6]} onload={imageLoaded} />
    </div>
  </masonry-layout>
</div>

<style lang="scss">
  #container {

    position: relative;
    width: 90%;
    margin: 0 auto;
    top: 5vh;

    .map-img {
      flex: auto;
      :global(img) {
        object-fit: cover;
        object-position: top;
        aspect-ratio: 1 / 1;
      }
    }
  }
</style>
