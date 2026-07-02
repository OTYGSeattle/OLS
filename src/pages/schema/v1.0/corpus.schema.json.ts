import { supportedValueGroups } from '../../../data/supported-values';

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

  return new Response(
    JSON.stringify(
      {
        $schema: 'https://json-schema.org/draft/2020-12/schema',
        $id: 'https://ols.otyg.org/schema/v1.0/corpus.schema.json',
        title: 'OpenLiturgy Standard v1.0 supported vocabularies',
        description: 'Normative closed vocabularies and documented open recommendations used by OLS v1.0.',
        $defs: definitions,
      },
      null,
      2,
    ),
    { headers: { 'Content-Type': 'application/schema+json; charset=utf-8' } },
  );
}
