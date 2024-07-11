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
    <img src={images[1].image} alt={images[2].caption} />
    <PageText mapPage={$mapPage} relative width="auto" />
    <img src={images[2].image} alt={images[2].caption} />
    <img src={images[3].image} alt={images[2].caption} />
    <img src={images[4].image} alt={images[2].caption} />
  </masonry-layout>
</div>

<style lang="scss">
  #container {

    position: relative;
    width: 90%;
    margin: 0 auto;
    top: 5vh;

    //display: grid;
    //grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    //grid-template-rows: minmax(0, 1fr) minmax(0, 1fr);
    //gap: var(--size-3);

  }
</style>