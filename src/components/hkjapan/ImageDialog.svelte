<script lang="ts">
  // component that shows expanded image in a dialog
  import { imageExpanded } from '@src/stores/map';
  import { onDestroy } from 'svelte';

  let dialog : any;

  const unsubscribe = imageExpanded.subscribe((value) => {
    if (value !== null) {
      dialog?.show();
    } else {
      dialog?.hide();
    }
  });

  onDestroy(unsubscribe);
</script>

<sl-dialog bind:this={dialog}
  on:sl-hide={() => $imageExpanded = null}>
  
  <img src={$imageExpanded} alt="foo" />
</sl-dialog>

<style lang="scss">
  sl-dialog {
    --width: 100vw;
  }
</style>
