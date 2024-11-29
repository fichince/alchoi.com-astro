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
    <PageText mapPage={$mapPage} relative width="auto" />
    <MapImg image={images[1]} onload={imageLoaded} />
    <MapImg image={images[0]} onload={imageLoaded} />
    <MapImg image={images[2]} onload={imageLoaded} />
  </masonry-layout>
</div>

<style lang="scss">
  #container {

    position: relative;
    width: 90%;
    margin: 0 auto;
    top: 20vh;

  }
</style>
