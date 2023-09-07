<script lang="ts">
  import { mapStore, mapPage, mapMoving, mapIdle, mapHovered, updateHover } from '@src/stores/map';
  import { onMount } from 'svelte';
  import PageText from '../PageText.svelte';
  import AppearWithMap from '../AppearWithMap.svelte';

  let images : MapImage[] = [];

  // TODO there's something ugly about this...
  let slug : string;

  onMount(() => {
    const { map } = $mapPage;
    slug = $mapPage.slug;

    if (map) {
      const { lat, lon, zoom } = map;
      $mapStore.flyTo({
        center: { lat, lon },
        zoom
      });
    }

    images = $mapPage.images ?? [];

    return () => {
      $mapStore.setLayoutProperty(slug, 'visibility', 'none');
    }
  });

  const { body, title } = $mapPage;

  $: {
    if (slug && $mapIdle && !$mapMoving) {
      $mapStore.setLayoutProperty(slug, 'visibility', 'visible');
    }
  }

</script>

<AppearWithMap>
  <PageText {title} {body}
    top="var(--size-8)"
    width="var(--size-15)"
    left="var(--size-8)"
  />
  <div id="images">
    {#each images as i}
      <img src={i.image} alt={i.caption} 
        class:hovered={$mapHovered === i.id}
        on:mouseenter={() => updateHover(i.id)}
        on:mouseleave={() => updateHover(null)} />
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

    img.hovered {
      border: 2px solid red;

    }
  }
</style>