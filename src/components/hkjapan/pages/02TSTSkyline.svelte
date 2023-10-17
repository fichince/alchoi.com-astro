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

<PageText {title} {body}
  top="var(--size-8)"
  width="var(--size-15)"
  left="var(--size-8)"
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
    left: 15vw;
    width: 70vw;
    margin: 0 auto;
  }
</style>