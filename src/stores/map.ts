import { writable } from 'svelte/store';
import type { Map } from 'leaflet';

export const mapStore = writable<Map>();