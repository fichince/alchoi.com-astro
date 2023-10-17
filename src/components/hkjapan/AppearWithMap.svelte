<script lang="ts">
  // wrapper component that will appear and disappear 
  // as the map transitions from one place to another...
  // things will only appear when the map stops moving

  import { mapMoving, toggleMapOnly } from '@src/stores/map';
  $: show = !$mapMoving && !$toggleMapOnly;
</script>

<div class:show>
  <slot />
</div>

<style lang="scss">
  div {
    transition: opacity 250ms var(--ease-in-out-1);
    &.show {
      opacity: 1;
    }

    &:not(.show) {
      opacity: 0;
    }
  }
</style>