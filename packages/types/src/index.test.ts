import { describe, expect, it } from 'vitest';
import { diagnosticSchema } from './index.js';

describe('diagnosticSchema', () => {
  it('accepts the stable diagnostic contract', () => {
    expect(diagnosticSchema.parse({ layer: 'parse', source: 'x', jsonPointer: '', code: 'OLS_JSON_PARSE', message: 'bad', severity: 'error' })).toBeTruthy();
  });
});
