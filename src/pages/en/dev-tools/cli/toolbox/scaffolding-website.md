---
# Remember to also update the date in src/components/products/guides/index.js
title: Website Scaffolding
metaTitle: Website Scaffolding | Metaplex CLI
description: Clone a Metaplex website template to start a new frontend project.
keywords:
  - mplx CLI
  - website template
  - scaffolding
  - Next.js
  - Tailwind
  - shadcn
about:
  - Metaplex CLI
  - Website Scaffolding
proficiencyLevel: Beginner
created: '04-20-2026'
updated: '04-20-2026'
---

## Summary

The `mplx toolbox template website` command clones a Metaplex-maintained website template into the current directory.

- Bootstraps a Next.js + Tailwind frontend wired up for Metaplex flows.
- Launches an interactive picker when no template is supplied.
- Selects the template via the `--template` flag, not a positional argument.
- Requires `git` to be available on `PATH`.

## Quick Reference

| Item | Value |
|------|-------|
| Command | `mplx toolbox template website [--template <key>]` |
| Optional flag | `--template <key>` |
| Interactive | Yes — picker shown when `--template` is omitted |
| Requires | `git` on `PATH` |
| Side effect | Clones into the current working directory |

## Available Templates

The available template keys map to Metaplex-maintained repositories.

| Template | Description |
|----------|-------------|
| `standard - nextjs-tailwind` | Next.js + Tailwind starter. |
| `standard - nextjs-tailwind-shadcn` | Next.js + Tailwind + shadcn/ui starter. |
| `404 - nextjs-tailwind-shadcn` | MPL Hybrid 404 UI starter (Next.js + Tailwind + shadcn/ui). |

## Basic Usage

Run the command with no flag to pick interactively, or pass `--template` to clone directly.

```bash
# Launch an interactive template picker
mplx toolbox template website

# Clone a specific template
mplx toolbox template website --template "<template-key>"
```

## Flags

The single optional flag selects the template.

- `--template <key>` *(optional)*: Template key. If omitted, an interactive picker is shown.

## Examples

These examples show both the interactive picker and a direct clone.

```bash
mplx toolbox template website
mplx toolbox template website --template "standard - nextjs-tailwind"
```

## Notes

- The template is cloned via `git clone` into the current working directory.
- Ensure `git` is installed and available on your `PATH`.
- For on-chain program templates, use [`toolbox template program`](/dev-tools/cli/toolbox/scaffolding-program).
