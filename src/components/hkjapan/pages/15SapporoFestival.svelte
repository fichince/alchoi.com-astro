<script lang="ts">
  import { mapPage } from '@src/stores/map';
  import PageText from '../PageText.svelte';

</script>

<div id="container">
  <video src="/video/SapporoFestival.mp4" autoplay controls muted loop width="100%" height="100%"></video>
</div>
<PageText mapPage={$mapPage} 
  top="50%"
  left="8vw"
  width="30vw"
/>

<style lang="scss">
  #container {

    position: absolute;
    height: 50vh;

    top: 50%;
    right: 5%;
    transform: translate(0, -50%);

    display: flex;
  }
</style>