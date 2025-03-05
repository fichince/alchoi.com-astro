import type { AstroIntegration, AstroIntegrationLogger } from 'astro';
import { Client } from '@opensearch-project/opensearch';

import 'dotenv/config';

export function getIndexName() {
  return `alchoi-blog-${import.meta.env.DEV || process.env.VERCEL_ENV === 'preview' ? 'development' : 'production'}`;
}

async function clearIndex(logger: AstroIntegrationLogger, client: Client) {

  try {

    const indexName = getIndexName();
    logger.info(`Clearing search index ${indexName}`);

    const { body: exists } = await client.indices.exists({ index: indexName });
    if (exists) {
      await client.indices.delete({ index: indexName });
    }

  } catch (e) {
    logger.error('Failed to clear search index ' + e);
  }
}


export default function search(): AstroIntegration {

  const client = new Client({
    node: process.env.OPENSEARCH_API
  });

  return {
    name: 'search',
    hooks: {
      'astro:config:setup': async ({ logger }) => {
        await clearIndex(logger, client);
      },
    },
  };
}
