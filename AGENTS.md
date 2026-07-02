# Agent Notes

This repository expects small maintenance docs updates alongside product or content changes.

## Repository Structure

This repo has **two coupled parts** that must be kept in sync:

1. **Astro documentation site** (root) — the OpenLiturgy Standard (OLS) specification, authored as MDX.
   - `src/content/docs/**` — 40+ spec articles grouped into categories (see `src/data/docs.ts`).
   - `src/components/docs/` — reusable MDX components (register new ones in `mdx-components.ts`).
   - Schema JSON lives in `packages/schemas` and is surfaced by the site.

2. **Multi-language SDKs** — reference validators for OLS packages. **When the spec (schemas, validation rules, or data model) changes, the SDKs usually change too.**
   - `packages/types` (`@openliturgy/types`) — shared TypeScript types / Zod schemas.
   - `packages/schemas` (`@openliturgy/schemas`) — canonical checked-in JSON Schemas.
   - `packages/sdk` (`@openliturgy/sdk`) — TS loader, resolver, and six-layer validator (`src/index.ts`).
   - `packages/cli` (`@openliturgy/cli`) — the `ols` CLI wrapping the SDK.
   - `python/openliturgy` — the Python SDK (`validation.py`, `models.py`, `schemas.py`), mirrors the TS SDK.
   - `fixtures/complete-minimal/` — shared fixtures used by tests and the parity check.
   - `tools/parity-test.mjs` — **cross-language parity gate**: runs the TS CLI and Python CLI against the
     same fixture and asserts byte-for-byte identical diagnostics. **Any new validation rule must be
     implemented identically in BOTH `packages/sdk/src/index.ts` and `python/openliturgy/validation.py`**
     (same `code`, `severity`, `layer`, and `jsonPointer`), or `npm run test:parity` fails.

## SDK & Release Versioning

- The four `packages/*` workspaces are versioned in lock-step (all at the same `x.y.z`) and cross-reference
  each other with **exact** versions (e.g. `@openliturgy/cli` depends on `@openliturgy/sdk` at `1.1.0`, sdk on
  types/schemas). The Python package (`python/pyproject.toml`) tracks the same version.
- **A version bump touches many files.** For a minor bump you must update, together:
  - root `package.json` + `package-lock.json`
  - every `packages/*/package.json` `version` AND their internal `@openliturgy/*` dependency pins
  - the matching workspace entries in `package-lock.json` (root object, `node_modules/@openliturgy/*` links,
    and the `packages/*` entries)
  - `python/pyproject.toml`
- After editing versions, run `npm install --package-lock-only` to resync the lock file. If you leave the
  lock file stale, **`npm ci` fails** with `Missing: @openliturgy/<pkg>@<old> from lock file`.
- CI (`.github/workflows/sdk-ci.yml`) runs `npm ci`, `npm run check`, workspace tests, `python -m pytest`,
  and the parity gate on every push — all must pass.

## Default Change Checklist

When making a meaningful change, review these files before finishing:

- `CHANGELOG.md` for user-visible additions, changes, or fixes
- `package.json` and `package-lock.json` to keep the package version in sync with the latest released section in `CHANGELOG.md`
- `README.md` when setup, usage, included features, or reusable components changed
- `CONTRIBUTING.md` when contributor workflow or expectations changed

## Docs-Specific Reminders

- If you add a reusable MDX component, register it in `src/components/docs/mdx-components.ts`.
- If you change search behavior, verify both `npm run check` and the relevant docs article such as `src/content/docs/compass-docs/how-search-works/how-search-works.mdx`.
- If you add or rename starter content, check whether homepage suggestions and category ordering still make sense.

## Before Wrapping Up

- Run `npm run check`.
- Update documentation files that are now inaccurate because of the change.
- Mention any docs files intentionally left unchanged when summarizing work.
