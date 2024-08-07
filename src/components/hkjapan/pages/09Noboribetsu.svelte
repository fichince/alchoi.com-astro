<script lang="ts">
  import { mapPage } from '@src/stores/map';
  import PageText from '../PageText.svelte';
  import MapImg from '../MapImg.svelte';

  const { images = [] } = $mapPage;

</script>

<div id="images">
  {#each images as image}
    <MapImg {image} />
  {/each}
</div>
<PageText mapPage={$mapPage}
  bottom="var(--size-10)"
  width="var(--size-15)"
  left="10vw"
/>

<style lang="scss">
  #images {
    position: absolute;

    top: 8vh;
    height: auto;
    left: 10vw;
    width: 80vw;
    margin: 0 auto;
  }
</style>