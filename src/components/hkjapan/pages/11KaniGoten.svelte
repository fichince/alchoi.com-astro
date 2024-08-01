<script lang="ts">
  import { mapPage } from '@src/stores/map';
  import PageText from '../PageText.svelte';
  import MapImg from '../MapImg.svelte';

  const { images = [] } = $mapPage;
</script>

<div id="container">
  <masonry-layout gap="5px" cols="4">
    <PageText mapPage={$mapPage} relative width="auto" />
    <MapImg image={images[1]} />
    <MapImg image={images[0]} />
    <MapImg image={images[2]} />
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