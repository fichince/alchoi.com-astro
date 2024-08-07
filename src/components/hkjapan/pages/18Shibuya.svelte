<script lang="ts">
  import { mapPage } from '@src/stores/map';
  import PageText from '../PageText.svelte';
  import MapImg from '../MapImg.svelte';

  const { images = [] } = $mapPage;

</script>

<div id="container">
  <MapImg image={images[0]} />
</div>
<PageText mapPage={$mapPage} 
  top="15vh"
  right="8vw"
  width="20vw"
/>

<style lang="scss">
  #container {

    position: absolute;
    bottom: 15vh;
    left: 10vw;
    height: 75vh;
    //transform: translate(0, -50%);

    display: flex;
    gap: var(--size-3);

  }
</style>