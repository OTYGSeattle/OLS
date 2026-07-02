export type SupportedValueGroup = {
  definition: string;
  label: string;
  field: string;
  values: readonly string[];
  description: string;
  closed?: boolean;
};

const group = (
  definition: string,
  label: string,
  field: string,
  values: readonly string[],
  description: string,
  closed = true,
): SupportedValueGroup => ({ definition, label, field, values, description, closed });

export const supportedValueGroups = {
  DocumentStatus: group(
    'DocumentStatus',
    'Document status',
    'status',
    ['draft', 'review', 'candidate', 'stable', 'deprecated'],
    'Technical maturity of an OLS document.',
  ),
  AuthorityStatus: group(
    'AuthorityStatus',
    'Authority status',
    'authority.status',
    [
      'draft',
      'needs-review',
      'educational-only',
      'parish-reviewed',
      'diocesan-approved',
      'synodal-approved',
      'historical-only',
      'deprecated',
    ],
    'Ecclesial review and permitted-use status.',
  ),
  SourceType: group(
    'SourceType',
    'Source type',
    'citation.type',
    [
      'printed-book',
      'manuscript',
      'oral-tradition',
      'parish-handout',
      'scholarly-edition',
      'translation',
      'audio-recording',
      'video-recording',
      'web-source',
      'field-notes',
    ],
    'Kind of evidence represented by a citation.',
  ),
  RoleType: group(
    'RoleType',
    'Core role type',
    'role.type',
    ['bishop', 'celebrant', 'concelebrant', 'deacon', 'cantor', 'choir', 'reader', 'congregation'],
    'Core cross-tradition liturgical roles.',
  ),
  TransliterationSystem: group(
    'TransliterationSystem',
    'Transliteration system',
    'transliteration.system',
    ['scholarly-ies', 'bgn-pcgn', 'phonetic-amharic', 'phonetic-english', 'parish-custom', 'custom'],
    'Declared transliteration conventions.',
  ),
  LanguageTag: group(
    'LanguageTag',
    'Recommended language tag',
    'language',
    ['gez-Ethi', 'gez-Latn', 'am-Ethi', 'ti-Ethi', 'om-Latn', 'en', 'ar'],
    'Recommended BCP 47 tags; other valid tags remain allowed.',
    false,
  ),
  UtteranceMode: group(
    'UtteranceMode',
    'Utterance mode',
    'utterance.mode',
    ['spoken', 'chanted', 'sung', 'whispered', 'silent', 'canticle', 'responsive', 'recited'],
    'How an utterance is delivered.',
  ),
  RubricCategory: group(
    'RubricCategory',
    'Rubric category',
    'rubric.category',
    ['action', 'posture', 'movement', 'sound', 'setting', 'instruction', 'permission'],
    'Machine-readable class of liturgical action.',
  ),
  RubricForce: group(
    'RubricForce',
    'Rubric force',
    'rubric.force',
    ['required', 'recommended', 'optional'],
    'Required behavior when executing a rubric.',
  ),
  MutationOperation: group(
    'MutationOperation',
    'Mutation operation',
    'mutation.operation',
    ['fill', 'insertBefore', 'insertAfter', 'replace', 'omit', 'move', 'wrap', 'setAttribute'],
    'Deterministic structural mutation operation.',
  ),
  TimelineTargetType: group(
    'TimelineTargetType',
    'Timeline target type',
    'executionTimeline.type',
    ['section', 'block', 'reading', 'rubric', 'utterance'],
    'Entity kinds that may receive execution timing.',
  ),
  TimelineStatus: group(
    'TimelineStatus',
    'Timeline status',
    'executionTimeline.status',
    ['completed', 'skipped', 'interrupted'],
    'Recorded execution outcome explicitly named by OLS v1.0.',
  ),
  AssetType: group(
    'AssetType',
    'Asset type',
    'asset.type',
    ['audio', 'video', 'image', 'scan', 'pdf', 'notation', 'manuscript-image'],
    'External media kinds supported by asset records.',
  ),
  CalendarCapability: group(
    'CalendarCapability',
    'Calendar capability',
    'calendar.supports',
    ['fixed-feasts', 'movable-feasts', 'fasting-periods', 'lectionary'],
    'Capabilities declared by a calendar definition.',
  ),
  ConformanceLevel: group(
    'ConformanceLevel',
    'Conformance level',
    'conformance.levels[]',
    ['L0', 'L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7'],
    'Versioned capability labels; no hierarchy is implied.',
  ),
  ChangeClass: group(
    'ChangeClass',
    'Change class',
    'change.class',
    ['patch', 'minor', 'major'],
    'Semantic-version impact of a specification change.',
  ),
} as const;

export const supportedValuesBySlug: Record<string, SupportedValueGroup[]> = {
  status: [supportedValueGroups.DocumentStatus],
  authority: [supportedValueGroups.AuthorityStatus],
  source: [supportedValueGroups.SourceType],
  roles: [supportedValueGroups.RoleType],
  localized: [supportedValueGroups.LanguageTag],
  'transliteration-systems': [supportedValueGroups.TransliterationSystem],
  utterances: [supportedValueGroups.UtteranceMode],
  rubrics: [supportedValueGroups.RubricCategory, supportedValueGroups.RubricForce],
  'proper-mutations': [supportedValueGroups.MutationOperation],
  'execution-timeline': [supportedValueGroups.TimelineTargetType, supportedValueGroups.TimelineStatus],
  assets: [supportedValueGroups.AssetType],
  calendar: [supportedValueGroups.CalendarCapability],
  conformance: [supportedValueGroups.ConformanceLevel],
  governance: [supportedValueGroups.ChangeClass],
};

export const schemaDefinitionUrl = (definition: string) => `/schema/v1.0/corpus.schema.json#/$defs/${definition}`;

export const documentSchemasBySlug: Record<string, string[]> = {
  architecture: ['scope'],
  package: ['manifest'],
  localized: ['localized-text'],
  'transliteration-systems': ['transliteration'],
  roles: ['role', 'role-group'],
  authority: ['authority'],
  source: ['citation', 'provenance'],
  people: ['person', 'organization'],
  utterances: ['utterance'],
  readings: ['reading'],
  chant: ['chant'],
  'inline-chant': ['inline-chant'],
  rubrics: ['rubric'],
  blocks: ['block'],
  'verse-lines': ['verse-line-group'],
  sections: ['section', 'ordo'],
  propers: ['proper-slot', 'proper'],
  'proper-mutations': ['mutation'],
  calendar: ['calendar', 'liturgical-day'],
  'deterministic-calendar': ['conflict-rule'],
  service: ['service-instance'],
  'execution-timeline': ['execution-timeline'],
  space: ['sacred-space'],
  'rubric-state': ['rubric-state-transition'],
  assets: ['asset'],
  variants: ['variant'],
  teaching: ['teaching-note'],
  conformance: ['conformance'],
  testing: ['test-fixture'],
};
