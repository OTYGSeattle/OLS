import { cp, mkdir, rm } from 'node:fs/promises';
const source = new URL('../packages/schemas/schemas/v1.0/', import.meta.url);
const target = new URL('../python/ols_sdk/_schemas/', import.meta.url);
await rm(target, { recursive: true, force: true });
await mkdir(target, { recursive: true });
await cp(source, target, { recursive: true });
