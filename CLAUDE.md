# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the Metaplex Developer Hub - a Next.js documentation website built with Markdoc for rendering documentation. The site serves as the central hub for all Metaplex-related documentation including Core, Candy Machine, UMI, Token Metadata, and other MPL products.

## Development Commands

```bash
# Install dependencies
pnpm install

# Development server
pnpm run dev

# Build for production
pnpm run build

# Start production server
pnpm start

# Lint code
pnpm run lint

# Generate sitemap
pnpm run sitemap
```

## Architecture

### Core Stack
- **Next.js 13.4.7** - React framework with file-based routing
- **Markdoc** - Documentation-focused content management
- **Tailwind CSS** - Utility-first CSS framework
- **pnpm** - Package manager

### Key Directories

- `src/pages/` - Next.js pages and markdown documentation files
- `src/components/` - Reusable React components
- `src/components/products/` - Product-specific components and configurations
- `src/shared/` - Shared utilities and hooks
- `markdoc/` - Markdoc configuration for custom nodes and tags
- `public/` - Static assets

### Product Configuration System

Each product (Core, Candy Machine, UMI, etc.) has its own configuration in `src/components/products/[product]/index.js` that defines:
- Navigation structure
- Hero components
- Section organization
- GitHub links
- Styling themes

Products are registered in `src/components/products/index.js` and sorted alphabetically.

### Documentation Structure

Documentation follows a consistent pattern:
- **Documentation section** - Main docs (index page)
- **Guides section** - Tutorials and how-tos
- **References section** - API documentation (often external links)

### Page System

Pages use a custom `usePage` hook that processes:
- Meta titles and descriptions
- Navigation state
- Active sections
- Table of contents
- Product-specific theming

### Styling and Theming

- Uses CSS custom properties for accent colors
- Product-specific accent classes (e.g., `accent-green` for Core)
- Dark mode support via Tailwind CSS classes
- Custom typography plugin for documentation content

### Content Management

- Markdown files in `src/pages/` are automatically processed
- Markdoc provides custom components for code blocks, tables, and more
- Custom fence component for syntax highlighting with Prism
- Support for multiple programming languages

### Middleware

URL redirects are handled in `src/middleware.js` for:
- Legacy URL compatibility
- Product reorganization
- API endpoint redirects

## Development Workflow

1. Product documentation lives in `src/pages/[product]/`
2. Add new products by creating configuration in `src/components/products/`
3. Custom components go in `src/components/`
4. Shared utilities in `src/shared/`
5. Static assets in `public/`

## Code Examples

The `src/examples/` directory contains code examples used in the documentation.

**Important:** The `index.js` files in example directories are auto-generated. Do not edit them directly.

- Edit the source files (`kit.js`, `umi.js`, etc.) instead
- Run `node scripts/build-examples.js` to regenerate all `index.js` files
- The script parses `[IMPORTS]`, `[SETUP]`, `[MAIN]`, `[OUTPUT]` sections from source files

## Localisation Workflow

Documentation exists in four locales: `en`, `ja`, `ko`, `zh`. All locales must be kept in sync — the same pages must exist in every locale directory.

**Editing order:**
1. Always edit `/en` files first. The English pages are the source of truth.
2. Once `/en` edits are complete, ask the user before creating or updating the locale files (`/ja`, `/ko`, `/zh`).
3. Unless a request explicitly targets a specific locale, always derive locale content from the current `/en` version.

**Parity rules:**
- Every page that exists in `/en` must exist in all other locale directories with the same filename.
- If a new page is added to `/en`, a corresponding page must be created in `/ja`, `/ko`, and `/zh` (after user confirmation).
- Locale pages must mirror the structure, sections, code examples, frontmatter fields, and Markdoc components of the `/en` page.
- **What to translate:** page body prose, `title`, `metaTitle`, `description`, and `faqs` Q&A content. JSON-LD FAQ schema (the `faqs` frontmatter) must be in the same language as the page — Google requires structured data to match the visible content language.
- **Keep in English:** `keywords`, `about`, `programmingLanguage`, `proficiencyLevel`, code examples, Markdoc component names, and date fields (`created`, `updated`).

## Content Quality Standard (GEO/LLM)

**At the start of any session involving documentation creation or editing, you MUST read the rubric once:**

```
/Users/tony/Developer/Metaplex/developer-hub/GEO-LLM-EVALUATION-RUBRIC.md
```

Read it once — it stays in context for the entire session. Do not re-read it for every file. Evaluate each finished page against it before considering the work complete. Target a score of 90%+ of applicable points for the page type.

**Page type matters.** The rubric defines four page types — Tutorial/Guide, Concept/Architecture, Reference (API/CLI/SDK), and Overview/Index — each with different crucial dimensions and optional (N/A) sections. Not every section belongs on every page. Check the Page Type Matrix in the rubric to determine what applies before adding sections.

Requirements that apply to **all** page types regardless:
- `## Summary` block (1-2 declarative sentences + 3-4 bullets) at the top
- First sentence under every H2/H3 is a direct declarative answer (BLUF)
- Headers are context-independent — no pronouns or shorthand (safe for RAG chunking)
- First mention of key terms links to their canonical concept pages
- Inline callouts for constraints; do **not** create `## Out of Scope` sections
- `## Notes` section for caveats and compatibility notes
- Frontmatter must include: `title`, `metaTitle`, `description`, `keywords`, `about`, `proficiencyLevel`, `created`, `updated`

Requirements that are **conditional on page type**:
- `## FAQ` — Tutorial and Concept pages; not required on pure Reference pages
- `## Glossary` — Concept and Overview pages; not required on Tutorial or Reference pages
- Quick Start + jump links — Tutorial/Guide pages
- Quick Reference table — Reference, How-To, and Overview pages
- `faqs` frontmatter field — only when a FAQ section is present

## Important Notes

- Uses pnpm workspaces - always use `pnpm` not `npm`
- Markdoc processes `.md` files in pages directory
- Product configurations control navigation and theming
- Environment variables for Algolia DocSearch and analytics
- Hotjar integration for user analytics
