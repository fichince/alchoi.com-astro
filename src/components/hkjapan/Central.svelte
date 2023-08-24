<script lang="ts">
  import { renderMarkdown } from '@src/markdown';
  import { mapStore, mapPage, mapMoving } from '@src/stores/map';
  import { onMount } from 'svelte';
  import maplibregl, { MapMouseEvent } from 'maplibre-gl';

  let show : boolean = false;
  let images : MapImage[] = [];

  onMount(() => {
    const { map } = $mapPage;
    console.log('central map', map);

    if (map) {
      const { lat, lon, zoom } = map;
      $mapStore.flyTo({
        center: { lat, lon },
        zoom
      });
      //$mapStore.zoomTo(zoom);
    }

    console.log('mounting central', $mapPage);

    images = $mapPage.images ?? [];

    /*
    const features = images.map((i) => {
      if (i.location) {

        const { lat, lon } = i.location;
        return {
          type: 'Feature',
          properties: {
            // TODO
          },
          geometry: {
            type: 'Point',
            coordinates: [ lat, lon ]
          }
        }

      } else {
        return null;
      }
    }).filter((x) => x !== null);

    const geojson = {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features
      }
    };

    $mapStore.addSource('central', geojson);

    $mapStore.addLayer({
      id: 'central',
      type: 'symbol',
      source: 'central',
      layout: {
        'icon-image': 'marker'
      }
    });
    */

    /*
    const markers : maplibregl.Marker[] = [];

    images.forEach((i) => {
      if (i.location) {
        const { lat, lon } = i.location;
        const marker = new maplibregl.Marker();

        marker
          .setLngLat({ lat, lon })
          .addTo($mapStore);
        
        markers.push(marker);
      }
    });

    $mapStore.on('mouseenter', (e : MapMouseEvent) => {
      console.log('mouse enter', e);
    });
    */

    return () => {
      //markers.forEach((m) => m.remove());
    };
  });

  const { body } = $mapPage;
  const html = renderMarkdown(body ?? '');

  console.log('here', $mapPage);

  $: show = !$mapMoving;

</script>

<article class:show>
  <div id="central">
    {@html html}
  </div>
  <div id="images">
    {#each images as i}
      <img src={i.image} alt={i.caption} />
    {/each}
  </div>
</article>

<style lang="scss">

  article {
    &.show {
      visibility: visible;
    }
    &:not(.show) {
      visibility: hidden;
    }
  }

  #central {
    position: absolute;
    top: 60vh;

    width: 30vw;
    left: 60vw;

    background-color: var(--colour-background);
    padding: var(--size-fluid-1);
    border-radius: var(--radius-2);
  }

  #images {
    position: absolute;

    left: 15vw;
    top: 0;
    height: 100vh;

    display: flex;
    flex-direction: column;

    justify-content: space-around;
  }

</style>