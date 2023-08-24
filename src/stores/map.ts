import { writable, derived, get, Writable } from 'svelte/store';
import maplibregl, { GeoJSONSourceSpecification } from 'maplibre-gl';

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
              id: i.id,
              type: 'Feature',
              properties: {
                id: i.id,
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

        const geojson : GeoJSONSourceSpecification = {
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
          },
          paint: {
            'icon-opacity': [
              'case',
              ['boolean', ['feature-state', 'hovered'], false],
              1,
              0.5
            ]
          }
        });

        // hide the markers by default, until the page is activated
        m.setLayoutProperty(page.slug, 'visibility', 'none');

        m.on('mousemove', page.slug, (e) => {
          if (e.features) {
            const id = e.features[0].properties.id;
            mapHovered.set(id);

            m.setFeatureState(
              { source: page.slug, id }, 
              { hovered: true }
            );
          }
        });

        m.on('mouseleave', page.slug, () => {
          const id = get(mapHovered);
          if (id !== null) {
            m.setFeatureState(
              { source: page.slug, id },
              { hovered: false }
            );
          }
          mapHovered.set(null);
        });

      });
    });
  });


  set(m);
});

export const mapPage = writable<MapPage>();

export const mapHovered = writable<number | null>();

export const mapMoving = derived(mapStore, ($mapStore, set) => {
  $mapStore.on('movestart', () => set(true));
  $mapStore.on('moveend', () => set(false));
}, false);

export const mapIdle = derived(mapStore, ($mapStore, set) => {
  $mapStore.on('load', () => set(false));
  $mapStore.on('render', () => set(false));
  $mapStore.on('idle', () => set(true));
}, false);
