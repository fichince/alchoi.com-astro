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
  <MapImg image={images[1]} />
  <MapImg image={images[2]} />
  <MapImg image={images[3]} />
  <MapImg image={images[4]} />
</div>
<PageText mapPage={$mapPage} 
  bottom="15vh"
  left="8vw"
  width="20vw"
/>

<style lang="scss">
  #container {

    position: relative;
    width: 50vw;
    height: 90vh;
    left: 50vw;

    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    grid-template-rows: minmax(0, 1fr) minmax(0, 1fr);
    gap: var(--size-3);

  }
</style>