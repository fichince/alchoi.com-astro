<script lang="ts">
  import { createSearchIndex } from '@src/scripts/search';
  import SearchResult from './SearchResult.svelte';
  import { onMount } from 'svelte';
  import { blur } from 'svelte/transition';
  import type { Index } from 'lunr';
  import debounce from 'lodash/debounce';
  import find from 'lodash/find';

  let index : Index;
  let posts : BlogPost[] = [];
  let searchTerm : string = '';
  let searchResults : Index.Result[] = [];

  onMount(async () => {
    const res = await fetch('/search-index.json');
    posts = await res.json();

    index = createSearchIndex(posts);
  });

  const handleChange = debounce((e) => {
    searchTerm = e.target.value;
  }, 500);

  $: {
    if (searchTerm) {
      searchResults = index.search(searchTerm);
    } else {
      searchResults = [];
    }

    console.log('search results', searchResults);
  }

</script>

<div class="search">
  <input type="text" on:input={handleChange} />

  <div class="results">
    {#if searchResults.length > 0}
      {#each searchResults as result, index (result.ref)}
        {@const post = find(posts, { slug: result.ref })}
        {#if post}
          <div in:blur={{ delay: index * 75 }}>
            <SearchResult {post} {result} />
          </div>
        {/if}
      {/each}

    {:else}
      <div in:blur>
        <SearchResult notFound={searchTerm} />
      </div>
    {/if}
  </div>
</div>

<style lang="scss">
  @import "../style/common.scss";
  .search {
    display: flex;
    flex-direction: column;
    align-items: center;

    input {
      width: var(--size-fluid-10);
      font-size: var(--font-size-5);
      border-radius: var(--radius-2);
      padding: var(--size-fluid-1);
      color: var(--primary);
      margin-bottom: var(--size-fluid-3);
      font-family: var(--font-display);
    }

    .results {
      font-family: var(--font-body);
      padding: 0 var(--size-fluid-1);
      width: var(--size-fluid-10);
    }
  }
</style>