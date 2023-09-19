<script lang="ts">
  import { onMount } from 'svelte';
  import Router, { push, location } from 'svelte-spa-router';
  import { wrap } from 'svelte-spa-router/wrap';

  import { mapStore, mapPage, allMapPages } from '@src/stores/map';

  import fromPairs from 'lodash/fromPairs';
  import clamp from 'lodash/clamp';

  import AppearWithMap from './AppearWithMap.svelte';

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
<button id="next" class="nav-button" on:click={next}>&#x2771;</button>
<button id="prev" class="nav-button" on:click={prev}>&#x2770;</button>
<div id="contents">
  <AppearWithMap>
    <Router {routes} />
  </AppearWithMap>
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

  .nav-button {
    position: absolute;
    z-index: 99;
    height: 100%;
    width: var(--size-8);

    --_alpha: 0.8;
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

</style>