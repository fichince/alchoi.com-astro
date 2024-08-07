<script lang="ts">
  import { mapPage } from '@src/stores/map';
  import PageText from '../PageText.svelte';
  import MapImg from '../MapImg.svelte';

  const { images = [] } = $mapPage;

</script>

<div id="images">
  <PageText mapPage={$mapPage} relative width="22vw" />
  {#each images as image}
    <div class="map-img">
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
    top: 15vh;

    position: relative;

    .map-img {
      flex: auto;
      :global(img) {
        height: 70vh;
        object-fit: cover;
        aspect-ratio: 6 / 7;
      }
    }

  }
</style>