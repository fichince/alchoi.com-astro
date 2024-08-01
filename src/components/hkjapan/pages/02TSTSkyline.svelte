<script lang="ts">
  import { mapPage } from '@src/stores/map';
  import PageText from '../PageText.svelte';
  import MapImg from '../MapImg.svelte';

  const { images = [] } = $mapPage;

</script>

<PageText mapPage={$mapPage}
  top="var(--size-8)"
  width="var(--size-15)"
  left="10vw"
/>
<div id="images">
  {#each images as image}
    <MapImg {image} />
  {/each}
</div>

<style lang="scss">
  #images {
    position: absolute;

    bottom: 5vh;
    height: auto;
    left: 10vw;
    width: 80vw;
    margin: 0 auto;
  }
</style>