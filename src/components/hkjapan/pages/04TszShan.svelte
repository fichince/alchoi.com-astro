<script lang="ts">
  import { mapPage } from '@src/stores/map';
  import PageText from '../PageText.svelte';
  import MapImg from '../MapImg.svelte';

  const { images = [] } = $mapPage;

</script>

<div id="container">
  <div class="map-img">
    <MapImg image={images[0]} />
  </div>
  <PageText mapPage={$mapPage} width="400px" relative />
  <div class="map-img">
    <MapImg image={images[1]} />
  </div>
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

    .map-img {
      width: 30vw;
    }
  }
</style>