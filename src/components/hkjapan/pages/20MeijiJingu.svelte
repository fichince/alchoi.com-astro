<script lang="ts">
  import { mapPage } from '@src/stores/map';
  import PageText from '../PageText.svelte';
  import MapImg from '../MapImg.svelte';

  const { images = [] } = $mapPage;

</script>

<div id="images">
  {#each images as image, index}
    <div class="map-img" id="map-img-{index}">
      <MapImg {image} />
    </div>
  {/each}
  <PageText mapPage={$mapPage} relative width="35vw" />
</div>

<style lang="scss">
  #images {
    display: flex;
    gap: var(--size-3);
    width: 85%;
    margin: auto;

    transform: translateY(15vh);

    position: relative;

    .map-img {
      flex: auto;
      :global(img) {
        width: 50vw;
        object-fit: cover;
        aspect-ratio: 5 / 7;
      }
    }

    #map-img-0 {
      :global(img) {
        object-position: left;
      }
    }

    #map-img-1 {
      :global(img) {
        object-position: right;
      }
    }


  }
</style>