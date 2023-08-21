<script lang="ts">
  import { onMount } from 'svelte';
  import Router, { location, push } from 'svelte-spa-router';
  import One from './One.svelte';
  import Two from './Two.svelte';
  import { mapStore } from '@src/stores/map';

  export let content : any[];

  onMount(() => {
    $mapStore = new maplibregl.Map({
      container: 'map',
      style: 'https://tiles-beta.stadiamaps.com/styles/stamen_toner.json',  // Style URL; see our documentation for more options
      center: [ 126.08244133499566, 26.808099925670312 ],
      zoom: 5
    });

  });

  function next() {
    const current = parseInt($location.substring(1));
    push(`/${current + 1}`);
  }

  function prev() {
    const current = parseInt($location.substring(1));
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