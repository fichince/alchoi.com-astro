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
<masonry-layout gap="5px">
  <img src={images[0].image} alt={images[0].caption} />
  <img src={images[1].image} alt={images[1].caption} />
  <img src={images[2].image} alt={images[2].caption} />
  <PageText mapPage={$mapPage} relative width="auto" />
</masonry-layout>
</div>

<style lang="scss">
  #container {

    position: relative;
    width: 90%;
    margin: 0 auto;
    top: 5vh;

    display: flex;
    justify-content: center;

  }
</style>