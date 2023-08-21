<script lang="ts">
  import { onMount } from 'svelte';
  import Router, { push } from 'svelte-spa-router';
  import { wrap } from 'svelte-spa-router/wrap';

  import { mapStore } from '@src/stores/map';
  import maplibregl from 'maplibre-gl';
  import fromPairs from 'lodash/fromPairs';
  import clamp from 'lodash/clamp';

  export let photoPages : PhotoPage[];

  const slugs = photoPages.map((p) => p.slug);
  let currentPage = 0;

  onMount(() => {
    $mapStore = new maplibregl.Map({
      container: 'map',
      style: 'https://tiles-beta.stadiamaps.com/styles/stamen_toner.json',  // Style URL; see our documentation for more options
      center: [ 126.08244133499566, 26.808099925670312 ],
      zoom: 5
    });

    push(`/${slugs[0]}`);
  });

  function next() {
    currentPage = clamp(currentPage + 1, 0, slugs.length - 1);
  }

  function prev() {
    currentPage = clamp(currentPage - 1, 0, slugs.length - 1);
  }

  $: currentPage, push(`/${slugs[currentPage]}`);

  const routes = fromPairs(photoPages.map((page) => {
    return [
      `/${page.slug}`,
      wrap({
        asyncComponent: () => import(`./hkjapan/${page.component}.svelte`)
      })
    ];
  }));

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