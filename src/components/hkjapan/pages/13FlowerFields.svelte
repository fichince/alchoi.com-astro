<script lang="ts">
  import { mapPage } from '@src/stores/map';
  import PageText from '../PageText.svelte';
  import MapImg from '../MapImg.svelte';

  const { images = [] } = $mapPage;

</script>

<div id="images">
  {#each images as image}
    <div class="map-img">
      <MapImg {image} />
    </div>
  {/each}
  <PageText mapPage={$mapPage} relative width="40vw" />
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
        object-fit: cover;
        aspect-ratio: 6 / 5;
      }
    }

  }
</style>