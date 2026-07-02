import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { validateDocument, validatePackage } from './index.js';

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

describe('validatePackage', () => {
  it('reports undeclared files and missing files in manifest', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'ols-pkg-'));
    const manifest = {
      $schema: 'https://ols.otyg.org/schema/v1.0/manifest.schema.json',
      ols_version: '1.0.0',
      type: 'manifest',
      package: 'org.openliturgy.test',
      version: '1.0.1',
      title: { en: 'Test package' },
      license: 'Apache-2.0',
      files: ['missing-file.ols.json']
    };
    await writeFile(join(directory, 'manifest.ols.json'), JSON.stringify(manifest));

    const extraFile = {
      $schema: 'https://ols.otyg.org/schema/v1.0/ordo.schema.json',
      ols_version: '1.0.0',
      type: 'ordo',
      id: 'test-ordo',
      sections: ['sec-word']
    };
    await writeFile(join(directory, 'extra.ols.json'), JSON.stringify(extraFile));

    const result = await validatePackage(directory);
    expect(result.valid).toBe(false);
    expect(result.diagnostics.some(d => d.code === 'OLS_MANIFEST_FILE_NOT_FOUND')).toBe(true);
    expect(result.diagnostics.some(d => d.code === 'OLS_MANIFEST_FILE_UNDECLARED')).toBe(true);
  });

  it('reports warning for uppercase entity IDs', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'ols-pkg-'));
    const manifest = {
      $schema: 'https://ols.otyg.org/schema/v1.0/manifest.schema.json',
      ols_version: '1.0.0',
      type: 'manifest',
      package: 'org.openliturgy.test',
      version: '1.0.1',
      title: { en: 'Test package' },
      license: 'Apache-2.0',
      files: ['ordo.ols.json']
    };
    await writeFile(join(directory, 'manifest.ols.json'), JSON.stringify(manifest));

    const ordo = {
      $schema: 'https://ols.otyg.org/schema/v1.0/ordo.schema.json',
      ols_version: '1.0.0',
      type: 'ordo',
      id: 'TEST-ordo-uppercase',
      sections: ['sec-word']
    };
    await writeFile(join(directory, 'ordo.ols.json'), JSON.stringify(ordo));

    const result = await validatePackage(directory);
    expect(result.diagnostics.some(d => d.code === 'OLS_ID_UPPERCASE' && d.severity === 'warning')).toBe(true);
  });
});
