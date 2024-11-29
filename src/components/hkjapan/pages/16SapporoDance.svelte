<script lang="ts">
  import { mapPage } from '@src/stores/map';
  import PageText from '../PageText.svelte';
</script>


<PageText mapPage={$mapPage} 
  top="50%"
  right="8vw"
  width="30vw"
/>
<div id="container">
  <video src="/video/SapporoDancing.mp4" autoplay controls muted loop width="100%" height="100%"></video>
</div>

<style lang="scss">
  #container {

    position: absolute;
    height: 50vh;

    top: 50%;
    left: 5%;
    transform: translate(0, -50%);

    display: flex;
  }
</style>