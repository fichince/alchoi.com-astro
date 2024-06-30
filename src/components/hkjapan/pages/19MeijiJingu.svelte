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
  <div>
    <MapImg image={images[0]} />
  </div>

  <div>
    <MapImg image={images[1]} />
  </div>

  <div>
    <MapImg image={images[2]} />
  </div>

  <div id="pagetext">
    <PageText mapPage={$mapPage} 
      width="auto"
      relative />
  </div>
</div>

<style lang="scss">
  #container {

    position: absolute;
    top: 5vh;
    left: 50%;
    transform: translate(-50%, 0);
    height: 90vh;
    width: auto;

    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    grid-template-rows: minmax(0, 1fr) minmax(0, 1fr);

    gap: var(--size-3);

    place-items: center;
  }
</style>