<script lang="ts">
  import { mapHovered, imageExpanded, updateHover } from '@src/stores/map';
  export let image : MapImage;

  function updateExpanded() {
    if ($imageExpanded === image) {
      $imageExpanded = null;
    } else {
      $imageExpanded = image;
    }
  }

  console.log('image', image);

</script>

  <figure>
    <img src={image.image} alt={image.caption}
      class:hovered={$mapHovered === image.id}
      on:mouseenter={() => updateHover(image.id)}
      on:mouseleave={() => updateHover(null)} 
      on:click={updateExpanded}
      on:keydown={() => {}}
    />
    
    {#if image.caption}
      <figcaption>
        {image.caption}
      </figcaption>
    {/if}
  </figure>

<style lang="scss">

  div.glass {
    position: relative;
    height: fit-content;
    //width: 100%;
    //height: 100%;

    /* From https://css.glass */
    background: rgba(127, 127, 127, 0.25);
    border-radius: var(--radius-2);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    padding: var(--size-2);

    transition: all 250ms var(--ease-in-out-1);

    &:has(img.hovered) {
      background: rgba(127, 127, 127, 0.5);
    }

  }
    figure {

      cursor: pointer;

      width: 100%;
      height: 100%;

      transition: transform 750ms var(--ease-squish-5);
      &:has(img.hovered) {
        transform: scale(105%);
      }

      img {
        border-radius: var(--radius-2);
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;

        margin: auto auto;
      }
    }

  figcaption {
    width: fit-content;
    text-align: center;
    padding: var(--size-1) var(--size-2);
    border-radius: var(--radius-3);
    margin: var(--size-1) auto;
    background-color: var(--colour-background);
    font-size: var(--font-size-fluid--2);
  }
</style>