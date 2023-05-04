<script lang="ts">
  import take from 'lodash/take';

  import type { Index } from 'lunr';
  import { extractHighlights } from '@src/scripts/search';
  import { getLinkToPost } from '@src/utils';

  export let result : Index.Result | null = null;
  export let post : BlogPost | null = null;
  export let notFound : string | null = null;

  let titleHighlights : Highlight[] = [];
  let bodyHighlights : Highlight[] = [];

  $: {
    const metadata = Object.values(result?.matchData?.metadata ?? {})?.[0] as SearchResultMetadata;
    titleHighlights = extractHighlights(post?.title ?? '', metadata?.title, true);
    bodyHighlights = take([
      ...extractHighlights(post?.description ?? '', metadata?.description),
      ...extractHighlights(post?.content ?? '', metadata?.content),
    ], 3)
  }

  $: title = post?.title ?? '';

  $: url = getLinkToPost(post);
</script>

<div class="result" class:not-found={notFound !== null}>
  <div class="title">
    {#if notFound && notFound.length > 0}
      Nothing found for <mark>{notFound}</mark>
    {:else}
      <a href={url}>
        {#if titleHighlights.length > 0}
          { @const { before, highlight, after } = titleHighlights[0] }
          {before}
          <mark>{highlight}</mark>
          {after}
        {:else}
          {title}
        {/if}
      </a>
    {/if}
  </div>

  {#if bodyHighlights.length > 0}
    <ul class="body">
      {#each bodyHighlights as hl}
      { @const { before, highlight, after } = hl }
      <li>
        ...{before}
        <mark>{highlight}</mark>
        {after}...
      </li>
      {/each}
    </ul>
  {/if}
</div>

<style lang="scss">
  @import "../style/mixins.scss";

  .result {
    margin: var(--size-fluid-2) 0;
    padding-bottom: var(--size-fluid-2);

    &:not(.not-found) {
      border-bottom: 1px solid var(--highlight);
    }

    a {
      text-decoration: underline;
      @include hover-link($subtle: true);
    }

    .title {
      font-family: var(--font-display);
      font-size: var(--font-size-3);
      margin-bottom: var(--size-fluid-1);
    }

    .body {
      list-style-type: disc;
      list-style-position: inside;
      font-size: var(--font-size-2);
    }

    mark {
      background: inherit;
      font-weight: 700;
      font-style: italic;
      color: var(--highlight);
    }
  }

</style>