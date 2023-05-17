<script lang="ts">
  import random from 'lodash/random';
  import { fly } from 'svelte/transition';
  import { quadOut } from 'svelte/easing';

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
</script>

<div>
  <button class="button" on:click={shuffle}>
    Shuffle!
  </button>
  {#key currentPost?.url}
    <div class="shuffler">
      {#if currentPost}
      <span 
        in:fly={{ y: 20, opacity: 100, duration }}
        out:fly={{ y: -20, opacity: 100, duration }}>
        <a href={currentPost?.url}>
          {currentPost?.title}
        </a>
      </span>
      {/if}
    </div>
  {/key}
</div>

<style lang="scss">
  .shuffler {
    position: absolute;
    overflow: hidden;
    border: 1px solid red;
    min-height: 200px;
    width: 100%;

    & > span {
      position: absolute;
      top: 0;
      border: 1px solid blue;
    }
  }
</style>