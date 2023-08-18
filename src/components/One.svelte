<script lang="ts">
  import { mapStore } from '@src/stores/map';
  import { onMount } from 'svelte';

  onMount(() => {
    $mapStore.flyTo([35.65710765530139, 139.7036689679329], 17);
  });
</script>