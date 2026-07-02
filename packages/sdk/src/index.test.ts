import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { validateDocument } from './index.js';

describe('validateDocument', () => {
  it('reports malformed JSON at layer one', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'ols-'));
    const source = join(directory, 'bad.json');
    await writeFile(source, '{');
    const result = await validateDocument(source);
    expect(result.valid).toBe(false);
    expect(result.diagnostics[0]?.code).toBe('OLS_JSON_PARSE');
  });
});
