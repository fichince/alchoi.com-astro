<script lang="ts">
  import { mapPage, moveMap } from '@src/stores/map';
  import { onMount } from 'svelte';
  import PageText from '../PageText.svelte';
  import MapImg from '../MapImg.svelte';

  onMount(() => {
    moveMap({}, false);
  });

  const { body, title, images = [] } = $mapPage;

</script>

<div id="container">
  <MapImg image={images[0]} />
  <MapImg image={images[1]} />
</div>
<PageText mapPage={$mapPage} 
  bottom="15vh"
  left="8vw"
  width="20vw"
/>

<style lang="scss">
  #container {

    position: absolute;
    top: 30%;
    left: 50%;
    //transform: translate(0, -50%);

    display: flex;
    gap: var(--size-3);

    :global(.map-img) {
      height: 45vh;
    }
  }
</style>