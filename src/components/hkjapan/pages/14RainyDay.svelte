<script lang="ts">
  import { mapPage } from '@src/stores/map';
  import PageText from '../PageText.svelte';

</script>

<div id="container">
  <video src="/video/RainyDay.mp4" autoplay muted loop width="100%" height="100%"></video>
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