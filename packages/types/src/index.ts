import { z } from 'zod';

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };
export type ValidationLayer = 'parse' | 'schema-selection' | 'structural' | 'consistency' | 'references' | 'semantic';
export type Severity = 'error' | 'warning' | 'info';

export interface OlsDocument {
  $schema: string;
  ols_version: string;
  type: string;
  kind?: string;
  id?: string;
  status?: string;
  [key: string]: JsonValue | undefined;
}

export interface Diagnostic {
  layer: ValidationLayer;
  source: string;
  entityId?: string;
  jsonPointer: string;
  code: string;
  message: string;
  severity: Severity;
  details?: Record<string, JsonValue>;
}

export interface ValidationReport {
  valid: boolean;
  diagnostics: Diagnostic[];
  filesChecked: string[];
  schemaVersions: string[];
  skippedLayers: ValidationLayer[];
}

export interface LoadedDocument<T extends OlsDocument = OlsDocument> {
  source: string;
  rawText: string;
  raw: JsonValue;
  data?: T;
}

export const diagnosticSchema = z.object({
  layer: z.enum(['parse', 'schema-selection', 'structural', 'consistency', 'references', 'semantic']),
  source: z.string(), entityId: z.string().optional(), jsonPointer: z.string(), code: z.string(),
  message: z.string(), severity: z.enum(['error', 'warning', 'info']), details: z.record(z.unknown()).optional(),
});

export const documentSchema = z.object({
  $schema: z.string().url(), ols_version: z.string(), type: z.string(), kind: z.string().optional(), id: z.string().optional(),
}).passthrough();

export const validationReportSchema = z.object({
  valid: z.boolean(), diagnostics: z.array(diagnosticSchema), filesChecked: z.array(z.string()),
  schemaVersions: z.array(z.string()), skippedLayers: z.array(diagnosticSchema.shape.layer),
});
