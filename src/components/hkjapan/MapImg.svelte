<script lang="ts">
  import { mapHovered, updateHover } from '@src/stores/map';
  export let image : MapImage;
</script>

<div class="glass map-img">
  <figure>
    <img src={image.image} alt={image.caption}
      class:hovered={$mapHovered === image.id}
      on:mouseenter={() => updateHover(image.id)}
      on:mouseleave={() => updateHover(null)} />
    
    {#if image.caption}
      <figcaption>
        {image.caption}
      </figcaption>
    {/if}
  </figure>
</div>

<style lang="scss">

  div.glass {
    /* From https://css.glass */
    background: rgba(127, 127, 127, 0.25);
    border-radius: var(--radius-2);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    padding: var(--size-3);

    transition: all 250ms var(--ease-in-out-1);

    &:has(img.hovered) {
      background: rgba(127, 127, 127, 0.5);
    }

    figure {

      width: 100%;
      height: 100%;

      transition: margin 250ms var(--ease-in-out-1);
      &:has(img.hovered) {
        margin: 0 calc(-1 * var(--size-5));
      }

      img {
        border-radius: var(--radius-2);
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
      }
    }
  }

  figcaption {
    width: fit-content;
    text-align: center;
    padding: var(--size-2) var(--size-4);
    border-radius: var(--radius-3);
    margin: var(--size-1) auto;
    background-color: var(--colour-background);
    font-size: var(--font-size-fluid--2);
  }
</style>