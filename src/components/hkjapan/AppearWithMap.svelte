<script lang="ts">
  // wrapper component that will appear and disappear 
  // as the map transitions from one place to another...
  // things will only appear when the map stops moving

  import { mapMoving, toggleMapOnly, mapAboutToMove } from '@src/stores/map';
  import { fade } from 'svelte/transition';

  $: show = !$mapAboutToMove && !$mapMoving && !$toggleMapOnly;
</script>

{#if show}
<div in:fade={{ duration: 250 }}>
  <slot />
</div>
{/if}
