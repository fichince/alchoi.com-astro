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
    {#if currentPost}
    <div 
      in:fly={{ y: 5, opacity: 100, duration: 1000 }}
      out:fly={{ y: -5, opacity: 100, duration: 1000 }}>
      <a href={currentPost?.url}>
        {currentPost?.title}
      </a>
    </div>
    {/if}
  {/key}
</div>