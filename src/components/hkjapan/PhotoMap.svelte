<script lang="ts">
  import { onMount } from 'svelte';
  import Router, { push, location } from 'svelte-spa-router';
  import { wrap } from 'svelte-spa-router/wrap';

  import { mapStore, mapPage, allMapPages } from '@src/stores/map';
  import fromPairs from 'lodash/fromPairs';
  import clamp from 'lodash/clamp';

  export let mapPages : MapPage[];

  const slugs = mapPages.map((p) => p.slug);
  let currentPage = 0;

  onMount(() => {

    $allMapPages = mapPages;

    // subscribe to initialize the map object, no action needed when it changes
    const unsubscribe = mapStore.subscribe(() => {});

    // initialize the current page depending on the URL
    if ($location === '/') {
      push(`/${slugs[0]}`);
    } else {
      const i = slugs.findIndex((value) => value === $location.substring(1));
      if (i > -1) currentPage = i;
    }

    return unsubscribe;
  });

  function safePage(n : number) {
    return clamp(n, 0, slugs.length - 1);
  }

  function next() {
    currentPage = safePage(currentPage + 1);
  }

  function prev() {
    currentPage = safePage(currentPage - 1);
  }

  $: currentPage, push(`/${slugs[currentPage]}`);
  $: currentPage, $mapPage = mapPages[currentPage];

  const routes = fromPairs(mapPages.map((page) => {
    return [
      `/${page.slug}`,
      wrap({
        asyncComponent: () => import(`./pages/${page.component}.svelte`)
      })
    ];
  }));

</script>

<div id="map">
</div>
<button id="next" class="button" on:click={next}>Next</button>
<button id="prev" class="button" on:click={prev}>Prev</button>
<div id="contents">
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
  }

  #contents {
    font-family: var(--font-body);
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