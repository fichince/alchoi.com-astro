<script lang="ts">
  import { mapPage } from '@src/stores/map';
  import PageText from '../PageText.svelte';
</script>

<PageText mapPage={$mapPage}
  bottom="10vh" 
  width="var(--size-15)"
  right="var(--size-11)"
/>