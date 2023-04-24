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