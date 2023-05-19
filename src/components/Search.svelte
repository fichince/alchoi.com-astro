<script lang="ts">
  import { createSearchIndex } from '@src/scripts/search';
  import SearchResult from './SearchResult.svelte';
  import { blur } from 'svelte/transition';
  import type { Index } from 'lunr';
  import debounce from 'lodash/debounce';
  import find from 'lodash/find';

  export let posts : SearchIndexEntry[];

  let index : Index;
  let searchTerm : string = '';
  let searchResults : Index.Result[] = [];

  const handleChange = debounce((e) => {
    searchTerm = e.target.value;
  }, 500);

  $: index = createSearchIndex(posts);

  $: {
    if (searchTerm) {
      searchResults = index.search(searchTerm);
    } else {
      searchResults = [];
    }
  }

</script>

<div class="search">
  <input class="form-input" type="text" on:input={handleChange} placeholder="Search..." />

  <div class="results">
    {#if searchResults.length > 0}
      {#each searchResults as result, index (result.ref)}
        {@const post = find(posts, { url: result.ref })}
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
  @import "../style/mixins.scss";
  .search {
    display: flex;
    flex-direction: column;
    align-items: center;

    input {
      width: var(--size-fluid-10);
      margin-bottom: var(--size-fluid-2);
      font-size: var(--font-size-fluid-2);
    }

    .results {
      font-family: var(--font-body);
      padding: 0 var(--size-fluid-1);
      width: var(--size-fluid-10);
    }
  }
</style>
