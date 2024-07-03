import type { APIRoute } from 'astro';
import { readFile, readdir } from 'node:fs/promises';
import * as path from 'node:path';
import MiniSearch from 'minisearch';

export const prerender = false;

const loadFile = async (file : string) : Promise<any> => {
  if (import.meta.env.DEV) {
    const f = await readFile(`./.search/${file}`, 'utf8');
    return f;
  } else {
    const filename = path.join(process.cwd(), `vercel/path0/.vercel/output/static/${file}`);
    console.log('file', filename);
    const f = await readFile(filename, 'utf8');
    return f;
  }
}

export const GET : APIRoute = async ({ url }) => {
  const q = url.searchParams.get('q');

  if (!q || q.trim().length === 0) {
    return new Response(null, { status: 400 });
  }

  console.log('got request', q);
  console.log('is prod', import.meta.env.PROD);

  /*
  const searchEntries = await loadFile('search-entries.json');
  const index = Fuse.parseIndex(searchIndex);
  const opts = {
    includeScore: true,
    includeMatches: true,
    ignoreLocation: true,
    minMatchCharLength: q.length - 1,
  };
  const fuse = new Fuse(searchEntries, opts, index);
  */

  const searchIndex = await loadFile('search-index.json');
  const opts = {
    fields: ['title', 'description', 'content'],
    boost: {
      title: 2,
      description: 1.5,
      content: 1,
    },
  };
  const miniSearch = MiniSearch.loadJSON(searchIndex, opts);

  /*
  const results = fuse.search(q).map((result) => {
    const { item: { title, description, url } } = result as any;
    const { score } = result;

    const matches = result.matches?.map((m) => {
      const { indices, value, key } = m;

      const snippets = indices.map(([ start, end ]) => {
        return value?.substring(start, end + 1);
      });

      return { key, snippets };
    });

    return { title, description, url, score, matches };

  });
  */
  const results = miniSearch.search(q, {
    fuzzy: 0.2
  });

  return Response.json(results);
};
