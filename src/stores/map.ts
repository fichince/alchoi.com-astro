import { readable, writable, derived } from 'svelte/store';
import maplibregl from 'maplibre-gl';

export const mapStore = readable<maplibregl.Map>(undefined, (set) => {
  const m = new maplibregl.Map({
    container: 'map',
    style: 'https://tiles-beta.stadiamaps.com/styles/stamen_toner.json',  // Style URL; see our documentation for more options
    center: [ 126.08244133499566, 26.808099925670312 ],
    zoom: 2
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

  set(m);
});

export const mapPage = writable<PhotoPage>();

export const mapMoving = derived(mapStore, ($mapStore, set) => {
  $mapStore.on('movestart', () => set(true));
  $mapStore.on('moveend', () => set(false));
}, false);
