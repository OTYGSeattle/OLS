import { getCollection } from 'astro:content';
import { buildFullStructuredData } from '../data/structured-data';

export async function GET() {
  const docs = await getCollection('docs');
  const schema = buildFullStructuredData(docs);

  return new Response(JSON.stringify(schema, null, 2), {
    headers: {
      'Content-Type': 'application/ld+json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
