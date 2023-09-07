<script lang="ts">
  import { renderMarkdown } from '@src/markdown';

  export let title : string = '';
  export let body : string = '';

  export let top : string = 'auto';
  export let bottom : string = 'auto';
  export let left : string = 'auto';
  export let right : string = 'auto';
  export let width : string = 'max-content';
  export let height : string = 'max-content';

  $: html = renderMarkdown(body);
</script>

<article id="text" class="tw-prose" 
  style:--_top={top}
  style:--_bottom={bottom}
  style:--_left={left}
  style:--_right={right}
  style:--_width={width}
  style:--_height={height}
>
  {#if title}
    <h1>{title}</h1>
  {/if}

  {#if body}
    <p>
      {@html html}
    </p>
  {/if}

</article>

<style lang="scss">
  article#text {
    position: absolute;

    // these dimensions are provided by the props of the component
    top: var(--_top);
    bottom: var(--_bottom);
    left: var(--_left);
    right: var(--_right);

    width: var(--_width);
    height: var(--_height);

    background-color: var(--colour-background);
    padding: var(--size-fluid-2);
    border-radius: var(--radius-2);

  }
</style>