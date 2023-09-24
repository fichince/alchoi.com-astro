<script lang="ts">
  // component that shows expanded image in a dialog
  import { imageExpanded } from '@src/stores/map';

  $: open = !!$imageExpanded;
</script>

<sl-dialog {open}
  on:sl-hide={() => $imageExpanded = null}>
  
  <img src={$imageExpanded} alt="foo" />
</sl-dialog>

<style lang="scss">
  sl-dialog {
    --width: 100vw;
  }
</style>
