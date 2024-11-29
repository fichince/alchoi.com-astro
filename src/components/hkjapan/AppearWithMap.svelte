<script lang="ts">
  // wrapper component that will appear and disappear 
  // as the map transitions from one place to another...
  // things will only appear when the map stops moving

  import { mapMoving, toggleMapOnly, mapAboutToMove } from '@src/stores/map';
  import { fade } from 'svelte/transition';
  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();

  let show = $derived(!$mapAboutToMove && !$mapMoving && !$toggleMapOnly);
</script>

{#if show}
<div in:fade={{ duration: 250 }}>
  {@render children?.()}
</div>
{/if}
