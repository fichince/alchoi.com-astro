<script lang="ts">
  import { mapPage, moveMap } from '@src/stores/map';
  import { onMount } from 'svelte';
  import PageText from '../PageText.svelte';
  import MapImg from '../MapImg.svelte';

  onMount(() => {
    moveMap();
  });

  const { body, title, images = [] } = $mapPage;

</script>

<div id="container">
  <MapImg image={images[0]} />
  <MapImg image={images[1]} />
</div>
<PageText {title} {body} 
  bottom="15vh"
  left="8vw"
  width="20vw"
/>

<style lang="scss">
  #container {

    position: absolute;
    top: 50%;
    right: 8vw;
    transform: translate(0, -50%);

    display: flex;
    flex-direction: column;
    gap: var(--size-3);

    :global(.map-img) {
      height: 45vh;
    }
  }
</style>