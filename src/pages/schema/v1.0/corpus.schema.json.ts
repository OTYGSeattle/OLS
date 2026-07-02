import { supportedValueGroups } from '../../../data/supported-values';
import { commonDefinitions, entitySchemas } from '../../../data/ols-schemas';

export function GET() {
  const definitions = Object.fromEntries(
    Object.values(supportedValueGroups).map((group) => [
      group.definition,
      {
        type: 'string',
        ...(group.closed === false ? { examples: group.values } : { enum: group.values }),
        description: group.description,
      },
    ]),
  );
  const entities = Object.fromEntries(Object.values(entitySchemas).map((entity) => [entity.title, entity.schema]));

  return new Response(
    JSON.stringify(
      {
        $schema: 'https://json-schema.org/draft/2020-12/schema',
        $id: 'https://ols.otyg.org/schema/v1.0/corpus.schema.json',
        title: 'OpenLiturgy Standard v1.0 corpus schema',
        description: 'OLS v1.0 entity models and supported vocabularies.',
        oneOf: Object.keys(entities).map((name) => ({ $ref: `#/$defs/${name}` })),
        $defs: { ...commonDefinitions, ...definitions, ...entities },
      },
      null,
      2,
    ),
    { headers: { 'Content-Type': 'application/schema+json; charset=utf-8' } },
  );
}
