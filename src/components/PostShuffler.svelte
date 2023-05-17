<script lang="ts">
  import random from 'lodash/random';
  import { slide, fly, blur } from 'svelte/transition';
  import { flip } from 'svelte/animate';

  export let posts : BlogEntrySummary[] = [];

  let selectedPosts : BlogEntrySummary[] = [];
  let currentIndex = -1;
  let currentPost : BlogEntrySummary | null;
  let interval : any;

  function shuffle() {
    const indices = new Set<number>();
    while (indices.size < 5) {
      indices.add(random(0, posts.length - 1));
    }
    selectedPosts = Array.from(indices).map((index) => (posts[index]));

    currentIndex = 0;
    interval = setInterval(() => {
      if (currentIndex < 4) {
        currentIndex = currentIndex + 1;
      } else {
        clearInterval(interval);
      }
    }, 1000);
  }

  $: currentPost = currentIndex >= 0 ? selectedPosts[currentIndex] : null;
</script>

<div>
  <button class="button" on:click={shuffle}>
    Shuffle!
  </button>
  {#key currentPost?.url}
    <div class="shuffler">
      {#if currentPost}
      <span 
        in:fly={{ y: 20, opacity: 100, duration: 50 }}
        out:fly={{ y: -20, opacity: 100, duration: 50 }}>
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
    min-width: 50vw;

    & > span {
      position: absolute;
      top: 0;
      border: 1px solid blue;
    }
  }
</style>