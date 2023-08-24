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

  const { body } = $mapPage;
  const html = renderMarkdown(body ?? '');

  $: show = !$mapMoving;

</script>

<div id="intro" class:show>
  {@html html}
</div>

<style lang="scss">
  #intro {
    position: absolute;
    top: 60vh;

    width: 30vw;
    left: 60vw;

    background-color: var(--colour-background);
    padding: var(--size-fluid-1);
    border-radius: var(--radius-2);

    &.show {
      visibility: visible;
    }
    &:not(.show) {
      visibility: hidden;
    }
  }

</style>