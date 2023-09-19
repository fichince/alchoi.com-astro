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
  right="var(--size-8)"
/>
<div id="images">
  {#each images as i}
    <MapImg src={i.image} caption={i.caption}
      id={i.id} />
  {/each}
</div>

<style lang="scss">
  #images {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: var(--size-3);

    position: absolute;
    width: 35vw;
    left: 15vw;
    height: 100vh;
    top: 0;
  }
</style>