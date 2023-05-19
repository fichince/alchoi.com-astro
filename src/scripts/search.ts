import type { Index } from 'lunr';
import lunr from 'lunr';
import clamp from 'lodash/clamp';

export function createSearchIndex(posts : SearchIndexEntry[]) : Index {
  const idx : Index = lunr(function() {
    this.ref('url');
    this.field('title');
    this.field('description');
    this.field('content');
    this.metadataWhitelist = ['position'];

    for (let post of posts) {
      this.add(post);
    }
  });

  return idx;
};

const HL_CONTEXT = 15;
export function extractHighlights(src : string, positions? : MatchPositions, includeFull? : boolean) : 
  Highlight[] {

  if (!positions) return [];

  const result = positions.position.map((pos) : Highlight => {
    const [ matchStart, matchLength ] = pos;

    if (!includeFull) {
      const start = clamp(matchStart - HL_CONTEXT, 0, src.length);
      const end = clamp(matchStart + matchLength + HL_CONTEXT, 0, src.length);

      const str = src.substring(start, end);

      const shift = matchStart - HL_CONTEXT;
      const hlStart = shift > 0 ? HL_CONTEXT : HL_CONTEXT + shift;

      const before = str.substring(0, hlStart);
      const highlight = str.substring(hlStart, hlStart + matchLength);
      const after = str.substring(hlStart + matchLength);

      return { before, highlight, after };

    } else {

      const before = src.substring(0, matchStart);
      const highlight = src.substring(matchStart, matchStart + matchLength);
      const after = src.substring(matchStart + matchLength);

      return { before, highlight, after };
    }
  });

  return result;
};