<script lang="ts">
  import { mapPage, moveMap } from '@src/stores/map';
  import { onMount } from 'svelte';
  import PageText from '../PageText.svelte';
  import MapImg from '../MapImg.svelte';

  onMount(() => {
    moveMap();
  });

  const { body, title, images = [] } = $mapPage;

</script>

<div id="container">
  <div class="map-img">
    <MapImg image={images[0]} />
  </div>
  <PageText {title} {body} width="400px" relative />
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