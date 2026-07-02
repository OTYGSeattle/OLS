import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { resolve } from 'node:path';
const exec = promisify(execFile);

const pythonExecutable = process.platform === 'win32' ? resolve('.venv/Scripts/python.exe') : resolve('.venv/bin/python');

const normalize = (text) => {
  const report = JSON.parse(text);
  return {
    valid: report.valid,
    diagnostics: report.diagnostics.map(({ layer, jsonPointer, code, severity }) => ({ layer, jsonPointer, code, severity })),
    schemaVersions: report.schemaVersions,
    skippedLayers: report.skippedLayers,
  };
};

async function compare(label, args) {
  const node = await exec(process.execPath, ['packages/cli/dist/cli.js', ...args]);
  const python = await exec(pythonExecutable, ['-m', 'openliturgy.cli', ...args]);
  const left = JSON.stringify(normalize(node.stdout));
  const right = JSON.stringify(normalize(python.stdout));
  if (left !== right) throw new Error(`SDK parity mismatch (${label})\nTypeScript: ${left}\nPython: ${right}`);
  console.log(`Parity OK: ${label}`);
}

// Package-level validation of the shared corpus package.
await compare('package validation', ['validate', resolve('fixtures/complete-minimal/manifest.ols.json'), '--format', 'json']);
// Self-test suite covers valid/invalid document fixtures, including translation variants.
await compare('self-test fixtures', ['validate', resolve('fixtures/complete-minimal'), '--self-test', '--format', 'json']);

console.log('TypeScript and Python reports are equivalent.');
