<script lang="ts">
  import { onMount } from 'svelte';
  import Router, { push, location } from 'svelte-spa-router';
  import { wrap } from 'svelte-spa-router/wrap';

  import { 
    mapStore, 
    mapPage, 
    allMapPages, 
    toggleMapOnly,
    moveMap,
    mapAboutToMove
  } from '@src/stores/map';

  import fromPairs from 'lodash/fromPairs';

  import AppearWithMap from './AppearWithMap.svelte';
  import ImageDialog from './ImageDialog.svelte';

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

    moveMap();

    return unsubscribe;
  });

  function safePage(n : number) {
    // at the end, loop back to the beginning
    if (n === slugs.length) return 0;
    if (n === -1) return 0;

    return n;
  }

  function next() {
    $mapAboutToMove = true;
    currentPage = safePage(currentPage + 1);
  }

  function prev() {
    $mapAboutToMove = true;
    currentPage = safePage(currentPage - 1);
  }

  $: currentPage, push(`/${slugs[currentPage]}`);
  $: currentPage, $mapPage = mapPages[currentPage];

  mapPage.subscribe((page) => {
    if (page) {
      moveMap();
    }
  });

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
<button id="next" class="nav-button" on:click={next}>&#x2771;</button>
<button id="prev" class="nav-button" on:click={prev}>&#x2770;</button>

<div id="toggle">
  <input type="checkbox" id="map-only" bind:checked={$toggleMapOnly} />
  <label for="map-only">View map</label>
</div>

<div id="contents">
  <AppearWithMap>
    <Router {routes} />
  </AppearWithMap>
</div>

<ImageDialog />

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

  .nav-button {
    position: absolute;
    z-index: 99;
    height: 100%;
    width: var(--size-7);
    color: var(--colour-foreground);

    --_alpha: 0.7;
    --_font-size: var(--font-size-6);
    &:hover {
      --_alpha: 1.0;
      --_font-size: var(--font-size-8);
    }

    transition: all 200ms var(--ease-in-out-1);
    background: hsl(var(--colour-bg-h) var(--colour-bg-s) var(--colour-bg-l) / var(--_alpha));
    font-size: var(--_font-size);

    &#next {
      right: 0;
    }

    &#prev {
      left: 0;
    }
  }

  #toggle {
    position: absolute;
    top: var(--size-1);
    right: var(--size-9);

    background: var(--colour-accent);
    padding: var(--size-2);
    border-radius: var(--radius-1);

    font-size: var(--font-size-0);

    display: flex;
    align-items: center;
    gap: var(--size-2);
    z-index: 99;
  }

</style>