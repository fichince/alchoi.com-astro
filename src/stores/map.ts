import { readable, writable, derived, Writable } from 'svelte/store';
import maplibregl from 'maplibre-gl';

export const allMapPages = writable<MapPage[]>();

export const mapStore = derived<Writable<MapPage[]>, maplibregl.Map>(allMapPages, ($allMapPages, set) => {

  console.log('initialize map', $allMapPages);

  const m = new maplibregl.Map({
    container: 'map',
    style: 'https://tiles-beta.stadiamaps.com/styles/stamen_toner.json',  // Style URL; see our documentation for more options
    center: [ 126.08244133499566, 26.808099925670312 ],
    zoom: 2,
  });

  // disable interactions
  // TODO - maybe use limits and bounds to have a little bit of interactivity?
  m.scrollZoom.disable();
  m.boxZoom.disable();
  m.dragRotate.disable();
  m.dragPan.disable();
  m.keyboard.disable();
  m.doubleClickZoom.disable();
  m.touchZoomRotate.disable();

  m.on('load', () => {
    m.loadImage('/images/position.png', (error, image) => {
      if (error) {
        console.log('Failed to load image', error);
        return;
      }

      if (image) {
        console.log('adding image', image);
        m.addImage('marker', image);
      }

      // every map page might have a set of markers, 
      // each on its own layer so we can display each set at a time

      $allMapPages.forEach((page) => {

        const images = page.images ?? [];

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
                coordinates: [ lon, lat ]
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

        console.log('geojson', geojson);

        m.addSource(page.slug, geojson);

        m.addLayer({
          id: page.slug,
          type: 'symbol',
          source: page.slug,
          layout: {
            'icon-image': 'marker'
          }
        });
      });
    });
  });

  set(m);
});

export const mapPage = writable<MapPage>();

export const mapMoving = derived(mapStore, ($mapStore, set) => {
  $mapStore.on('movestart', () => set(true));
  $mapStore.on('moveend', () => set(false));
}, false);
