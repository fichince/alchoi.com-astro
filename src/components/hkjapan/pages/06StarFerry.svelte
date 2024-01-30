<script lang="ts">
  import { mapPage, moveMap } from '@src/stores/map';
  import { onMount } from 'svelte';
  import PageText from '../PageText.svelte';
  import MapImg from '../MapImg.svelte';

  onMount(() => {
    moveMap();
  });

  const { images = [] } = $mapPage;

</script>

<div id="container">
  <div class="map-img">
    <MapImg image={images[0]} />
  </div>
  <div class="map-img">
    <MapImg image={images[1]} />
  </div>
</div>
<PageText mapPage={$mapPage} 
  bottom="15vh"
  left="8vw"
  width="30vw"
/>

<style lang="scss">
  #container {

    position: absolute;
    top: 50%;
    right: 8vw;
    transform: translate(0, -50%);

    display: flex;
    flex-direction: column;
    gap: var(--size-1);

    .map-img {
      height: 45vh;
    }
  }
</style>