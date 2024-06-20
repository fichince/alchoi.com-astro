<script lang="ts">
  import { mapPage, moveMap } from '@src/stores/map';
  import { onMount } from 'svelte';
  import PageText from '../PageText.svelte';
  import MapImg from '../MapImg.svelte';

  onMount(() => {
    //moveMap({}, false);
  });

  const { body, title, images = [] } = $mapPage;

</script>

<div id="container">
  <video src="/video/RainyDay.mp4" autoplay muted loop width="100%" height="100%" />
</div>
<PageText mapPage={$mapPage} 
  bottom="15vh"
  left="8vw"
  width="20vw"
/>

<style lang="scss">
  #container {

    position: absolute;
    height: 100vh;
    width: 100vw;
    //transform: translate(0, -50%);

  }
</style>