<script lang="ts">
  import { mapPage, moveMap } from '@src/stores/map';
  import { onMount } from 'svelte';
  import PageText from '../PageText.svelte';
  import MapImg from '../MapImg.svelte';

  onMount(() => {
    moveMap();
  });

  $: ({ body, title, images = [] } = $mapPage);

</script>

<div id="container">
  <div id="img1">
    <MapImg src={images[0].image} caption={images[0].caption}
      id={images[0].id} />
  </div>
  <div id="img2">
    <MapImg src={images[1].image} caption={images[1].caption}
      id={images[1].id} />
  </div>

  <div id="text">
    <PageText {title} {body} relative />
  </div>

  <div id="img3">
    <MapImg src={images[2].image} caption={images[2].caption}
      id={images[2].id} />
  </div>
  <div id="img4">
    <MapImg src={images[3].image} caption={images[3].caption}
      id={images[3].id} />
  </div>
</div>

<style lang="scss">
  #container {

    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 100vh;
    width: 90vw;

    display: grid;
    grid-template-columns: 2fr 1fr 2fr;
    grid-template-rows: 2fr 1fr 2fr;
    place-items: center;
    place-content: center;

    gap: var(--size-3);
    margin: auto 0;

    #img1 {
      grid-row: 1 / 2;
      grid-column: 1 / 2;
    }

    #img2 {
      grid-row: 1 / 2;
      grid-column: 3 / 4;
    }

    #img3 {
      grid-row: 3 / 4;
      grid-column: 1 / 2;
    }

    #img4 {
      grid-row: 3 / 4;
      grid-column: 3 / 4;
    }

    #text {
      grid-row: 2 / 3;
      grid-column: 2 / 3;
    }

    :global(.map-img) {
      width: 100%;
    }
  }
</style>