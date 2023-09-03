<script lang="ts">
  import { onMount } from 'svelte';
  import { mapStore, mapPage, mapMoving } from '@src/stores/map';
  import { renderMarkdown } from '@src/markdown';

  let show : boolean = false;

  onMount(() => {
    const { map } = $mapPage;

    if (map) {
      const { lat, lon, zoom } = map;
      $mapStore.flyTo({
        center: { lat, lon },
        zoom
      });
    }
  });

  const { body, title } = $mapPage;
  const html = renderMarkdown(body ?? '');

  $: show = !$mapMoving;

</script>

<div id="intro" class:show class="tw-prose">
  <h1>{title}</h1>
  <p>
  {@html html}
  </p>
</div>

<style lang="scss">
  #intro {
    position: absolute;
    top: 60vh;

    width: var(--size-15);
    right: var(--size-11);

    background-color: var(--colour-background);
    padding: var(--size-fluid-2);
    border-radius: var(--radius-2);

    &.show {
      visibility: visible;
    }
    &:not(.show) {
      visibility: hidden;
    }
  }

</style>