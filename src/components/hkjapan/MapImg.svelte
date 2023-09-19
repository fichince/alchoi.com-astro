<script lang="ts">
  import { mapHovered, updateHover } from '@src/stores/map';

  export let id : number;
  export let src : string;
  export let caption : string = '';
</script>

<div class="glass map-img">
  <figure>
    <img {src} alt={caption}
      class:hovered={$mapHovered === id}
      on:mouseenter={() => updateHover(id)}
      on:mouseleave={() => updateHover(null)} />
    
    {#if caption}
      <figcaption>
        {caption}
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

      transition: margin 250ms var(--ease-in-out-1);
      &:has(img.hovered) {
        margin: 0 calc(-1 * var(--size-5));
      }

      img {
        border-radius: var(--radius-2);
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