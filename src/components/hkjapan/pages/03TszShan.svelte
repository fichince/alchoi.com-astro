<script lang="ts">
  import { mapPage, moveMap } from '@src/stores/map';
  import { onMount } from 'svelte';
  import PageText from '../PageText.svelte';
  import MapImg from '../MapImg.svelte';

  onMount(() => {
    //moveMap();
  });

  const { images = [] } = $mapPage;

</script>

<div id="images">
  {#each images as image}
    <div class="map-img">
      <MapImg {image} />
    </div>
  {/each}
  <PageText mapPage={$mapPage} relative />
</div>

<style lang="scss">
  #images {
    display: flex;
    gap: var(--size-3);
    width: 75%;
    margin: auto;

    transform: translateY(30vh);

    position: relative;

    .map-img {
      flex: auto;
      :global(img) {
        width: 50vw;
        object-fit: cover;
        aspect-ratio: 8 / 5;
      }
    }

  }
</style>