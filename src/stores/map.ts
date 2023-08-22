import { readable, writable } from 'svelte/store';
import maplibregl from 'maplibre-gl';

export const mapStore = readable<maplibregl.Map>(undefined, (set) => {
  set(new maplibregl.Map({
    container: 'map',
    style: 'https://tiles-beta.stadiamaps.com/styles/stamen_toner.json',  // Style URL; see our documentation for more options
    center: [ 126.08244133499566, 26.808099925670312 ],
    zoom: 5
  }));
});

export const mapPage = writable<PhotoPage>();
