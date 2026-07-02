# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog, and this project follows semantic versioning when tagged for GitHub releases.

## [Unreleased]

### Added

- Added a complete Schema.org JSON-LD graph at `/schema.json` and page-specific structured data for every public landing page, category, and specification article.
- Set `https://ols.otyg.org` as the canonical domain and added a visible footer link that opens the OLS JSON Schema in a new tab.
- Corrected repository links from `OTYGSeattle/OSL` to `OTYGSeattle/OLS`.
- Prevented the development server from requesting the production-only Pagefind module, eliminating the disallowed MIME-type browser error.
- Added visible supported-value lists to relevant specification articles and generated an OLS v1.0 JSON Schema vocabulary endpoint with direct definition links.
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
