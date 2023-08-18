<script lang="ts">
  import { onMount } from 'svelte';
  import Router, { location, push } from 'svelte-spa-router';
  import One from './One.svelte';
  import Two from './Two.svelte';
  import { map, tileLayer } from 'leaflet';
  import { mapStore } from '@src/stores/map';

  /*
  onMount(() => {

    $mapStore = map('map').setView([51.505, -0.09], 17);

    tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.png', {
      maxZoom: 20,
      attribution:
					'Map tiles by <a href="http://stamen.com">Stamen Design</a>, ' +
					'<a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; ' +
					'Map data {attribution.OpenStreetMap}',
    }).addTo($mapStore);

  });
  */

  function next() {
    const current = parseInt($location.substring(1));
    push(`/${current + 1}`);
  }

  function prev() {
    const current = parseInt($location.substring(1));
    console.log('prev', current, $location);
    push(`/${current - 1}`);
  }

  const routes = {
    '/1': One,
    '/2': Two,
  };

</script>

<div id="map">
</div>
<button id="next" class="button" on:click={next}>Next</button>
<button id="prev" class="button" on:click={prev}>Prev</button>
<div>
<Router {routes} />
</div>

<style lang="scss">
  #map {
    z-index: 0;
    height: 100vh;
    width: 100vw;
    position: absolute;
    top: 0;
    left: 0;

    &.blurred {
      filter: blur(3px);
    }

    &.left {
      top: 0;
      left: 0;
    }
  }

  #next {
    position: absolute;
    right: 15px;
    top: 50%;
    z-index: 99;
  }

  #prev {
    position: absolute;
    left: 15px;
    top: 50%;
    z-index: 99;
  }
</style>