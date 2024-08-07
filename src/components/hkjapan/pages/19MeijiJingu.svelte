<script lang="ts">
  import { mapPage } from '@src/stores/map';
  import PageText from '../PageText.svelte';
  import MapImg from '../MapImg.svelte';

  const { images = [] } = $mapPage;

</script>

<div id="images">
  <PageText mapPage={$mapPage} relative width="22vw" />
  {#each images as image, index}
    <div class="map-img" id="map-img-{index}">
      <MapImg {image} />
    </div>
  {/each}
</div>

<style lang="scss">
  #images {
    display: flex;
    gap: var(--size-3);
    width: 85%;
    margin: auto;

    transform: translateY(25vh);

    position: relative;

    .map-img {
      flex: auto;
      :global(img) {
        width: 50vw;
        object-fit: cover;
        aspect-ratio: 5 / 6;
      }
    }

    #map-img-1 {
      :global(img) {
        object-position: bottom;
      }
    }

    #map-img-2 {
      :global(img) {
        object-position: right;
      }
    }


  }
</style>