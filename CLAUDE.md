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

## Important Notes

- Uses pnpm workspaces - always use `pnpm` not `npm`
- Markdoc processes `.md` files in pages directory
- Product configurations control navigation and theming
- Environment variables for Algolia DocSearch and analytics
- Hotjar integration for user analytics
