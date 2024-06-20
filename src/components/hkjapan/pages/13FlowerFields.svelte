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
  <div id="img1">
    <MapImg image={images[0]} />
  </div>

  <div id="img2">
    <MapImg image={images[1]} />
  </div>

  <div id="pagetext">
    <PageText mapPage={$mapPage} relative width="35vw" />
  </div>
</div>

<style lang="scss">
  #container {

    position: relative;
    max-height: 90vh;
    width: 80%;
    gap: var(--size-3);
    margin: 0 auto;
    top: 5vh;

    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;

    #img1 {
      grid-column: 1 / 2;
      grid-row: 1 / 2;
      height: 40vh;
    }

    #img2 {
      grid-column: 1 / 2;
      grid-row: 2 / 3;
      height: 40vh;
    }

    #pagetext { 
      grid-column: 2 / 3;
      grid-row: span 2;
      place-self: center;
    }

  }
</style>