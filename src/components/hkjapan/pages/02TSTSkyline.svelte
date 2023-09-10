<script lang="ts">
  import { mapStore, mapPage, mapMoving, mapIdle } from '@src/stores/map';
  import { onMount } from 'svelte';
  import PageText from '../PageText.svelte';
  import AppearWithMap from '../AppearWithMap.svelte';
  import MapImg from '../MapImg.svelte';

  onMount(() => {
    const { map } = $mapPage;

    if (map) {
      const { lat, lon, zoom } = map;
      $mapStore.flyTo({
        center: { lat, lon },
        zoom
      });
    }
  });

  $: ({ body, title, images = [] } = $mapPage);

</script>

<AppearWithMap>
  <PageText {title} {body}
    top="var(--size-8)"
    width="var(--size-15)"
    left="var(--size-8)"
  />
  <div id="images">
    {#each images as i}
      <MapImg src={i.image} caption={i.caption}
        id={i.id} />
    {/each}
  </div>
</AppearWithMap>

<style lang="scss">
  #images {
    position: absolute;

    bottom: 5vh;
    height: auto;
    left: 15vw;
    width: 70vw;
    margin: 0 auto;
  }
</style>