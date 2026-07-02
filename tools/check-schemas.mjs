import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const directory = new URL('../packages/schemas/schemas/v1.0/', import.meta.url);
const provenance = JSON.parse(await readFile(new URL('../packages/schemas/provenance.json', import.meta.url), 'utf8'));
const files = (await readdir(directory)).filter((name) => name.endsWith('.schema.json')).sort();
if (files.length < 35) throw new Error(`Expected at least 35 schemas, found ${files.length}`);
const ids = new Set();
for (const file of files) {
  const body = await readFile(new URL(file, directory), 'utf8');
  const schema = JSON.parse(body);
  if (schema.$schema !== 'https://json-schema.org/draft/2020-12/schema') throw new Error(`${file}: wrong dialect`);
  if (!schema.$id || ids.has(schema.$id)) throw new Error(`${file}: missing or duplicate $id`);
  ids.add(schema.$id);
  const digest = createHash('sha256').update(body).digest('hex');
  if (provenance[file]?.sha256 !== digest) throw new Error(`${file}: provenance digest is stale`);
}
console.log(`Validated ${files.length} canonical OLS schemas.`);
