<script lang="ts">
  import { mapPage } from '@src/stores/map';
  import PageText from '../PageText.svelte';
  import MapImg from '../MapImg.svelte';
  import type { MasonryLayout } from '@appnest/masonry-layout';

  const { images = [] } = $mapPage;

  let imageCount = images.length;
  let masonryElement : MasonryLayout;

  function imageLoaded(e : any) {
    imageCount--;
  }

  $: {
    if (imageCount === 0) {
      masonryElement.layout();
    }
  }
</script>

<div id="container">
  <masonry-layout gap="5px" cols="4" bind:this={masonryElement}>
    <PageText mapPage={$mapPage} relative width="auto" />
    <MapImg image={images[1]} on:load={imageLoaded} />
    <MapImg image={images[0]} on:load={imageLoaded} />
    <MapImg image={images[2]} on:load={imageLoaded} />
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