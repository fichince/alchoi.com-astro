/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

type SearchIndexEntry = { 
  url: string,
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

// combine the two types of blog entries to display in the BlogLayout
type BlogEntry = BlogCollectionEntry | CapsuleCollectionEntry;

type BlogEntrySummary = { 
  title: string,
  url: string,
  date: Date,
};