<script lang="ts">
  import random from 'lodash/random';
  import { fly } from 'svelte/transition';
  import { quadOut } from 'svelte/easing';
  import { DateTime } from 'luxon';

  const NUM_ITEMS = 10;

  export let posts : BlogEntrySummary[] = [];

  let selectedPosts : BlogEntrySummary[] = [];
  let currentIndex = -1;
  let currentPost : BlogEntrySummary | null;
  let duration : number;
  let timer : any;

  function shuffle() {
    if (timer) clearTimeout(timer);

    const indices = new Set<number>();
    while (indices.size < NUM_ITEMS) {
      indices.add(random(0, posts.length - 1));
    }
    selectedPosts = Array.from(indices).map((index) => (posts[index]));

    currentIndex = 0;
  }

  function increment() {
    if (currentIndex < NUM_ITEMS - 1) {
      currentIndex = currentIndex + 1;
    }
  }

  function getDuration(index : number) {
    const duration = quadOut((index + 1) / NUM_ITEMS) * 300;
    return duration;
  }

  $: currentPost = currentIndex >= 0 ? selectedPosts[currentIndex] : null;
  $: {
    if (currentIndex >= 0) {
      duration = getDuration(currentIndex);
      timer = setTimeout(increment, duration);
    }
  }

  $: dateString = 
      DateTime.fromJSDate(currentPost?.date)
              .toUTC()
              .toLocaleString(DateTime.DATE_MED);

  $: isFinal = currentIndex === NUM_ITEMS - 1;
</script>

<div class="shuffler-container">
  <button class="button" on:click={shuffle}>
    Shuffle!
  </button>
    <div class="shuffler">
      {#key currentPost?.url}
      <span 
        class="shuffle-item"
        in:fly={{ y: '3em', opacity: 100, duration }}
        out:fly={{ y: '-3em', opacity: 100, duration }}>
        {#if (!isFinal)}
          <span class="title">
            {currentPost?.title ?? ''}
          </span>
        {:else}
          <div class="blog-link">
            <a href={currentPost?.url}>
              <span class="title is-final">
                {currentPost?.title}
              </span>
            </a>
            <time>{dateString}</time>
          </div>
        {/if}
      </span>
      {/key}
    </div>
</div>

<style lang="scss">
  @import "../style/mixins.scss";

  .shuffler-container {
    padding: var(--size-2);
    position: relative;

    display: flex;
    flex-direction: column;
    align-items: center;

    font-family: var(--font-display);

    button {
      font-size: var(--font-size-fluid-1);
      margin-bottom: var(--size-fluid-2);
    }

    .shuffler {
      font-size: var(--font-size-fluid-1);

      position: relative;
      overflow: hidden;
      min-height: 5em;
      width: 100%;

      span.shuffle-item {
        width: 100%;
        position: absolute;
        top: 0;
        text-align: center;

        .title:not(.is-final) {
          // keep it to a single line until it settles on the last item
          display: inline-block;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: clip;
        }

        .blog-link {
          display: flex;
          flex-direction: column;
          align-items: center;

          a {
            text-decoration: underline;
            @include hover-link($subtle: true);
          }

          time {
            margin-top: var(--size-fluid-1);
            font-size: var(--font-size-2);
          }
        }

      }
    }
  }
</style>