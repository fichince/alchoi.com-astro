<script lang="ts">
  export let image : MapImage;
</script>

<div id="image-container">
  <a href={image.image} data-pswp-width={image.width} data-pswp-height={image.height}>
    <img src={image.image} alt={image.caption} on:load />
  </a>
</div>

<style lang="scss">

  img {
    border-radius: var(--radius-2);
    max-height: 100%;
    width: auto;
    vertical-align: middle;

    transition: transform 750ms var(--ease-squish-5);
    &:hover {
      transform: scale(102%);
    }
  }

  /*
  figcaption {
    width: fit-content;
    text-align: center;
    padding: var(--size-1) var(--size-2);
    border-radius: var(--radius-3);
    margin: var(--size-1) auto;
    background-color: var(--colour-background);
    font-size: var(--font-size-fluid--2);
  }
  */
</style>