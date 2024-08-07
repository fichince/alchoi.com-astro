<script lang="ts">
  import { mapPage } from '@src/stores/map';
  import PageText from '../PageText.svelte';

</script>

<PageText mapPage={$mapPage} 
  bottom="15vh"
  right="8vw"
  width="20vw"
/>
