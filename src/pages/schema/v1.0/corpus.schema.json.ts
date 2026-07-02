import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

export async function GET() {
  const schema = JSON.parse(await readFile(resolve(process.cwd(), 'packages', 'schemas', 'schemas', 'v1.0', 'corpus.schema.json'), 'utf8'));
  return new Response(
    JSON.stringify(schema, null, 2),
    { headers: { 'Content-Type': 'application/schema+json; charset=utf-8' } },
  );
}
