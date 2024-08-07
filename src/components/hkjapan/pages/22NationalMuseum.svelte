<script lang="ts">
  import { mapPage } from '@src/stores/map';
  import PageText from '../PageText.svelte';
  import MapImg from '../MapImg.svelte';

  const { images = [] } = $mapPage;

</script>

<div id="images">
  <div class="map-img">
    <MapImg image={images[0]} />
  </div>
  <PageText mapPage={$mapPage} relative width="35vw" />
  <div class="map-img">
    <MapImg image={images[1]} />
  </div>
  <div class="map-img">
    <MapImg image={images[2]} />
  </div>
</div>

<style lang="scss">
  #images {
    display: flex;
    gap: var(--size-3);
    width: 85%;
    margin: auto;

    transform: translateY(20vh);

    position: relative;

    .map-img {
      flex: auto;
      :global(img) {
        width: 50vw;
        object-fit: cover;
        aspect-ratio: 5 / 6;
      }
    }


  }
</style>