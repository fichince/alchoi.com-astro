/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

type SearchIndexEntry = {
  id: string;
  title: string;
  url: string;
  type: 'blog' | 'quote';
  content?: string;
  description?: string;
  author?: string;
  quote?: string;
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

type MapImage = {
  id: number,
  image: string,
  width: number,
  height: number,
  caption?: string,
  location?: {
    lat: number,
    lon: number,
  }
};

type MapPage = {
  slug: string,
  component: string,
  body?: string,
  date?: Date,
  title?: string,
  map?: {
    lat: number,
    lon: number,
    zoom: number,
  },
  images?: Array<MapImage>,
};

interface Window {
  htmx: any;
}
