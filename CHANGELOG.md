# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog, and this project follows semantic versioning when tagged for GitHub releases.

## [Unreleased]

## [1.1.0] - 2026-07-02

### Added

- Translation Variants: support for multiple translation variants of the same text within a single language, with provenance, labels, and default selection rules.
- New `data-model/translation-variants` specification article documenting schema pattern, variant object fields, resolution rules, and SDK implementation guide.
- Full JSON Schema definition for `LocalizedText` including `TranslationVariantsMap` and `TranslationVariant` types.
- Eight formal validation rules (`OLS_VARIANT_*`) with error/warning/info severities for translation variant integrity.
- Five Utterance validation rules (`OLS_UTT_*`) for structural correctness.
- Seven test fixtures (valid and invalid) for translation variant validation.
- Conformance level requirements (L0–L5) for translation variant support.
- Cross-reference callout in `LocalizedText` article linking to the new variants documentation.
- Distinction callout in Scholarly Variants article clarifying manuscript variants vs. translation variants.
- Updated complete corpus example to demonstrate translation variants with provenance.

## [1.0.1] - 2026-07-01

### Added

- Added canonical checked-in OLS v1.0 schemas, shared conformance fixtures, TypeScript `@openliturgy/*` workspaces, and the Python `openliturgy` distribution.
- Added offline package loading, reference resolution, six-layer validation, stable diagnostics, self-test runners, matching `ols` CLIs, schema refresh caches, and cross-language parity checks.
- Added multi-platform SDK CI, manually triggered npm/PyPI release dry-run workflows, and the tag-triggered automated production release workflow.

### Fixed

- Fixed Node 24 compatibility by making the `esbuild` override global, preventing peer dependency mismatch on Linux runners.
- Upgraded CI Node.js version targets and release dry-run workflows from Node 20 to 22/24 to support Astro 6 requirements.
- Configured `.gitattributes` to enforce `LF` line endings for all JSON files, resolving schema check failures on Windows CI runners.

### Changed

- Reserved `type` for OLS entity identity and introduced `kind` for domain subtypes.
- Changed public schema routes to serve canonical checked-in artifacts rather than dynamic schema objects.

- Added a complete Schema.org JSON-LD graph at `/schema.json` and page-specific structured data for every public landing page, category, and specification article.
- Set `https://ols.otyg.org` as the canonical domain and added a visible footer link that opens the OLS JSON Schema in a new tab.
- Corrected repository links from `OTYGSeattle/OSL` to `OTYGSeattle/OLS`.
- Prevented the development server from requesting the production-only Pagefind module, eliminating the disallowed MIME-type browser error.
- Added visible supported-value lists to relevant specification articles and generated an OLS v1.0 JSON Schema vocabulary endpoint with direct definition links.
- Added standalone Draft 2020-12 JSON Schema validators for 35 modeled OLS entities, including localized text, utterances, readings, rubrics, blocks, sections, roles, citations, calendars, and service instances.
- Expanded all OLS specification articles with practical usage guidance, connected JSON samples, validation notes, edge cases, and a complete minimal corpus walkthrough.
- Fixed scripture citation labels that displayed Markdown emphasis markers as literal text.
- Migrated OpenLiturgy Standard (OLS) v1.0 single-page specification from `base.html` into a full documentation repository using Astro, React, and Tailwind CSS.
- Split the specification into 40 structured MDX articles, organized into 3 parent categories and 9 sub-categories.
- Integrated theme-specific custom MDX components (like Callouts, Badges, QuoteBlocks, and Tables) for richer specification aesthetics.
- Updated site settings and configured Pagefind static search for OpenLiturgy.

## [1.0.0] - 2026-06-19

### Added

- First stable Compass template release for product docs, support centers, and internal knowledge bases.
- Astro 6 and Tailwind CSS 4 project setup with MDX content collections.
- Parent landing pages, nested sub-category pages, article pages, breadcrumbs, and previous/next article navigation.
- Pagefind-powered static search for the homepage and docs sidebar.
- Reusable MDX docs components for callouts, badges, cards, card grids, buttons, tabs, code tabs, file trees, tables, accordions, steps, checklists, and quotes.
- Article frontmatter for descriptions, tags, lifecycle status, authors, edit links, hero images, redirects, related links, search visibility, ordering, and update dates.
- Locally hosted Geist fonts, light/dark mode, favicons, Open Graph image support, RSS feed generation, and sitemap generation.
- Browser enhancements for article table of contents, code-copy controls, image lightbox behavior, keyboard-friendly search, and accessible search result state.
