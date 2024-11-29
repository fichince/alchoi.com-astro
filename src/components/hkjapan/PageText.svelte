<script lang="ts">
  import { renderMarkdown } from '@src/markdown';
  import { DateTime } from 'luxon';

  //export let title : string = '';
  


  interface Props {
    //export let body : string = '';
    mapPage: MapPage;
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
    width?: string;
    height?: string;
    relative?: boolean;
  }

  let {
    mapPage,
    top = 'auto',
    bottom = 'auto',
    left = 'auto',
    right = 'auto',
    width = 'max-content',
    height = 'max-content',
    relative = false
  }: Props = $props();

  let formattedDate : string = $state('');
  const { body = '', title = '', date = '' } = mapPage;

  if (date) {
    formattedDate = DateTime.fromJSDate(date).toUTC().toLocaleString(DateTime.DATE_FULL);
  }

  let html = $derived(renderMarkdown(body));
</script>

<article id="text" class="tw-prose"
  class:relative
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

  {#if formattedDate}
    <h2>{formattedDate}</h2>
  {/if}

  {#if body}
    <p>
      {@html html}
    </p>
  {/if}

</article>

<style lang="scss">
  article#text {

    text-wrap: balance;

    &.relative {
      position: relative;
    }
    &:not(.relative) {
      position: absolute;
    }

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

    h1,h2 {
      margin: 0;
      margin-bottom: var(--size-fluid-1);
    }

    transition: transform 750ms var(--ease-squish-5);
    &:hover {
      transform: scale(105%);
    }

  }
</style>