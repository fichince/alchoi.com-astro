/// <reference path="../.astro/types.d.ts" />
/// <reference types="@astrojs/image/client" />

type BlogPost = { 
  slug: string,
  title: string,
  description?: string,
  content: string,
}

type MatchPositions = {
  position: number[][];
}

type SearchResultMetadata = {
  title?: MatchPositions,
  description?: MatchPositions,
  content?: MatchPositions,
}

type Highlight = {
  before?: string,
  highlight?: string,
  after?: string,
};

type BlogCollectionEntry = import('astro:content').CollectionEntry<'blog'>;
type CapsuleCollectionEntry = import('astro:content').CollectionEntry<'capsules'>;

// "enrich" the capsule entries to align with something like a blog entry
type CapsuleEntry = CapsuleCollectionEntry & {
  data: {
    tags: string[],
    date: Date,
  }
};

// combine the two types of blog entries to display in the BlogLayout
type BlogEntry = CollectionEntry<'blog'> | CapsuleEntry;