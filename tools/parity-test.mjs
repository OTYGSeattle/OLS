import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { resolve } from 'node:path';
const exec = promisify(execFile);
const fixture = resolve('fixtures/complete-minimal/manifest.ols.json');
const node = await exec(process.execPath, ['packages/cli/dist/cli.js', 'validate', fixture, '--format', 'json']);
const pythonExecutable = process.platform === 'win32' ? resolve('.venv/Scripts/python.exe') : resolve('.venv/bin/python');
const python = await exec(pythonExecutable, ['-m', 'ols_sdk.cli', 'validate', fixture, '--format', 'json']);
const normalize = (text) => {
  const report = JSON.parse(text);
  return {
    valid: report.valid,
    diagnostics: report.diagnostics.map(({ layer, jsonPointer, code, severity }) => ({ layer, jsonPointer, code, severity })),
    schemaVersions: report.schemaVersions,
    skippedLayers: report.skippedLayers,
  };
};
const left = JSON.stringify(normalize(node.stdout));
const right = JSON.stringify(normalize(python.stdout));
if (left !== right) throw new Error(`SDK parity mismatch\nTypeScript: ${left}\nPython: ${right}`);
console.log('TypeScript and Python reports are equivalent.');
