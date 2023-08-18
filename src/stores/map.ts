import { readable } from 'svelte/store';
import type { Map } from 'leaflet';
import { map, tileLayer } from 'leaflet';

export const mapStore = readable<Map>(undefined, (set) => {
  const m = map('map').setView([29.328274897991527, 126.96134754751623], 5);

  tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.png', {
    maxZoom: 20,
    attribution:
        'Map tiles by <a href="http://stamen.com">Stamen Design</a>, ' +
        '<a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; ' +
        'Map data {attribution.OpenStreetMap}',
  }).addTo(m);

  set(m);
});