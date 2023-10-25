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
  right="var(--size-10)"
/>
<div id="images">
  {#each images as image}
    <div class="map-img">
      <MapImg {image} />
    </div>
  {/each}
</div>

<style lang="scss">
  #images {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: var(--size-3);

    position: absolute;
    left: 15vw;
    top: 50%;
    transform: translate(0, -50%);

    .map-img {
      height: 45vh;
    }

  }
</style>