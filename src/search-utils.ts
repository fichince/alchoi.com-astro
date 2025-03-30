// for working with the OpenSearch search index
// content loaders can use these functions to populate the search index with their content

import { Client } from '@opensearch-project/opensearch';
import type { AstroIntegrationLogger } from 'astro';
import { stripMarkdown } from '@src/markdown';
import mapValues from 'lodash/mapValues';
import { getIndexName } from '@src/integrations/search';
import take from 'lodash/take';

const openSearchClient = new Client({ node: import.meta.env.OPENSEARCH_API });

const FIELDS_TO_CLEAN = ['content', 'description', 'title'];
function declutter(s : string) : string {
  return s.replace(/letterboxd link/, '').replace(/storygraph link/, '').trim();
}

export async function addToIndex(entries: SearchIndexEntry[], logger?: AstroIntegrationLogger) {
  const indexName = getIndexName();
  try {
    const body = entries.reduce((memo, entry) => {
      const { id, ...rest } = entry;
      const command = {
        create: { _id: id }
      };

      const fields = mapValues(rest, (value, key, entry) => {
        if (entry.type === 'quote') return value;

        if (FIELDS_TO_CLEAN.includes(key)) {
          return declutter(stripMarkdown(value));
        }

        return value;
      });

      return [...memo, command, fields];
    }, []);

    const result = await openSearchClient.bulk({
      index: indexName,
      body
    });

    logger?.info(`Successfully saved [${entries.length}] entries to OpenSearch index [${indexName}] in ${result.body.took} ms`);
  } catch (e) {
    logger?.error('Failed to build search index ' + e);
  }
}
