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