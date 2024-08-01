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
  left="12vw"
  width="20vw"
/>

<style lang="scss">
  #container {

    position: absolute;
    bottom: 8%;
    left: 50%;
    transform: translate(-50%, 0);

    display: flex;
    gap: var(--size-3);
    width: 70%;
  }
</style>