import { buildEntitySchema, entitySchemas } from '../../../data/ols-schemas';

export function getStaticPaths() {
  return Object.keys(entitySchemas).map((name) => ({ params: { name } }));
}

export function GET({ params }: { params: { name?: string } }) {
  const schema = params.name ? buildEntitySchema(params.name) : undefined;
  return schema
    ? new Response(JSON.stringify(schema, null, 2), {
        headers: { 'Content-Type': 'application/schema+json; charset=utf-8' },
      })
    : new Response('Schema not found', { status: 404 });
}
