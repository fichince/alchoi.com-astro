<script lang="ts">
  import { run } from 'svelte/legacy';

  import { mapPage } from '@src/stores/map';
  import PageText from '../PageText.svelte';
  import MapImg from '../MapImg.svelte';
  import type { MasonryLayout } from '@appnest/masonry-layout';

  const { images = [] } = $mapPage;

  let imageCount = $state(images.length);
  let masonryElement : MasonryLayout = $state();

  function imageLoaded(e : any) {
    imageCount--;
  }

  run(() => {
    if (imageCount === 0) {
      masonryElement.layout();
    }
  });

</script>

<div id="container">
  <masonry-layout gap="5px" cols="4" bind:this={masonryElement}>
    <div class="map-img">
      <MapImg image={images[0]} on:load={imageLoaded} />
    </div>
    <PageText mapPage={$mapPage} relative width="auto" />
    <div class="map-img">
      <MapImg image={images[1]} on:load={imageLoaded} />
    </div>
    <div class="map-img">
      <MapImg image={images[2]} on:load={imageLoaded} />
    </div>
    <div class="map-img">
      <MapImg image={images[3]} on:load={imageLoaded} />
    </div>
    <div class="map-img">
      <MapImg image={images[4]} on:load={imageLoaded} />
    </div>
    <div class="map-img">
      <MapImg image={images[6]} on:load={imageLoaded} />
    </div>
    <div class="map-img">
      <MapImg image={images[5]} on:load={imageLoaded} />
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