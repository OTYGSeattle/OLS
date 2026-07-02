import { readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const schemaDirectory = resolve(process.cwd(), 'packages', 'schemas', 'schemas', 'v1.0');
const listSchemas = async () => (await readdir(schemaDirectory)).filter((name) => name.endsWith('.schema.json')).sort();
const loadSchema = async (name: string) => JSON.parse(await readFile(resolve(schemaDirectory, `${name}.schema.json`), 'utf8'));

export async function getStaticPaths() {
  return (await listSchemas())
    .filter((filename) => filename !== 'corpus.schema.json')
    .map((filename) => ({ params: { name: filename.replace('.schema.json', '') } }));
}

export async function GET({ params }: { params: { name?: string } }) {
  const schema = params.name ? await loadSchema(params.name) : undefined;
  return schema
    ? new Response(JSON.stringify(schema, null, 2), {
        headers: { 'Content-Type': 'application/schema+json; charset=utf-8' },
      })
    : new Response('Schema not found', { status: 404 });
}
