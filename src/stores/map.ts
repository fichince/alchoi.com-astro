import { writable, derived, get, type Writable } from 'svelte/store';
import maplibregl, { 
  type GeoJSONSourceSpecification, 
  type AnimationOptions 
} from 'maplibre-gl';

export const allMapPages = writable<MapPage[]>();

export const mapStore = derived<Writable<MapPage[]>, maplibregl.Map>(allMapPages, ($allMapPages, set) => {

  console.log('initialize map', $allMapPages);

  if (!$allMapPages) return;

  const m = new maplibregl.Map({
    container: 'map',
    style: 'https://tiles-beta.stadiamaps.com/styles/stamen_toner.json',  // Style URL; see our documentation for more options
    center: [ 125.45601818699798, 31.524967504769826 ],
    zoom: 1,
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
              0.7
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
export const imageExpanded = writable<MapImage | null>();

export const mapMoving = derived(mapStore, ($mapStore, set) => {
  if ($mapStore) {
    $mapStore.on('movestart', () => set(true));
    $mapStore.on('moveend', () => set(false));
  }
}, false);

export const mapIdle = derived(mapStore, ($mapStore, set) => {
  if ($mapStore) {
    $mapStore.on('load', () => set(false));
    $mapStore.on('idle', () => set(true));
  }
}, false);

let prevSlug = '';
const visibleLayer = derived([ mapPage, mapMoving, mapIdle ], ([ $mapPage, $mapMoving, $mapIdle ]) => {
  const slug = $mapPage?.slug;
  //console.log('visibleLayer', prevSlug, slug, $mapIdle, $mapMoving);

  const map = get(mapStore);
  if (!slug || !map) return;

  if ($mapIdle && !$mapMoving) {
    if (prevSlug === slug) {
      //console.log('set visible', slug);
      map.setLayoutProperty(slug, 'visibility', 'visible');
    } else {
      if (prevSlug) {
        map.setLayoutProperty(prevSlug, 'visibility', 'none');
      }
      prevSlug = slug;
    }
  }
});
visibleLayer.subscribe(() => {});

export function updateHover(id : number | null) {
  const hovered = get(mapHovered);
  const map = get(mapStore);
  const page = get(mapPage);

  if (id === null) {

    if (hovered !== null) {
      map.setFeatureState(
        { source: page.slug, id: hovered },
        { hovered: false }
      );
    }
    mapHovered.set(null);

  } else {

    map.setFeatureState(
      { source: page.slug, id },
      { hovered: true }
    );
    mapHovered.set(id);

  }
}

export const mapAboutToMove = writable(false);
export function moveMap(opts : AnimationOptions = {}, jump = false) {
  const { map } = get(mapPage);
  const m = get(mapStore);

  if (map && m) {
    const { lat, lon, zoom } = map;
    const location = {
      center: { lat, lon },
      zoom,
      ...opts,
    };

    if (!jump) {
      m.flyTo(location);
    } else {
      m.jumpTo(location);
    }
  }
  mapAboutToMove.set(false);
}

export const toggleMapOnly = writable(false);
