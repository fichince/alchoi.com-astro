<script lang="ts">
  import { mapPage, moveMap } from '@src/stores/map';
  import { onMount } from 'svelte';
  import PageText from '../PageText.svelte';
  import MapImg from '../MapImg.svelte';

  onMount(() => {
    //moveMap();
  });

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
  left="var(--size-10)"
/>

<style lang="scss">
  #images {
    position: absolute;

    top: 5vh;
    height: auto;
    left: 10vw;
    width: 80vw;
    margin: 0 auto;
  }
</style>