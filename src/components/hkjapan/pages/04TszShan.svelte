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
  <MapImg src={images[0].image} caption={images[0].caption}
    id={images[0].id} />
  <PageText {title} {body} width="400px" relative={true} />
  <MapImg src={images[1].image} caption={images[1].caption}
    id={images[1].id} />
</div>

<style lang="scss">
  #container {

    display: flex;
    justify-content: center;
    align-items: center;
    gap: var(--size-3);
    margin: auto 0;
    
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    :global(.map-img) {
      width: 30vw;
    }
  }
</style>