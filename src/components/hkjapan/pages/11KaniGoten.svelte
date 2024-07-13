<script lang="ts">
  import { mapPage, moveMap } from '@src/stores/map';
  import { onMount } from 'svelte';
  import PageText from '../PageText.svelte';
  import MapImg from '../MapImg.svelte';

  onMount(() => {
    //moveMap({}, false);
  });

  const { body, title, images = [] } = $mapPage;

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

    //display: grid;
    //grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    //grid-template-rows: minmax(0, 1fr) minmax(0, 1fr);
    //gap: var(--size-3);

  }
</style>