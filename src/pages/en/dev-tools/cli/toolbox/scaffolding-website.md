---
title: Website Scaffolding
metaTitle: Website Scaffolding | Metaplex CLI
description: Clone a Metaplex website template to start a new frontend project.
---

The `mplx toolbox template website` command clones a Metaplex-maintained website template into the current directory. It's a quick way to bootstrap a Next.js + Tailwind frontend wired up for Metaplex flows.

## Basic Usage

```bash
# Launch an interactive template picker
mplx toolbox template website

# Clone a specific template
mplx toolbox template website --template "<template-key>"
```

## Flags

- `--template <key>` *(optional)*: Template key. If omitted, an interactive picker is shown.

## Available Templates

| Template | Description |
|----------|-------------|
| `standard - nextjs-tailwind` | Next.js + Tailwind starter. |
| `standard - nextjs-tailwind-shadcn` | Next.js + Tailwind + shadcn/ui starter. |
| `404 - nextjs-tailwind-shadcn` | MPL Hybrid 404 UI starter (Next.js + Tailwind + shadcn/ui). |

## Examples

```bash
mplx toolbox template website
mplx toolbox template website --template "standard - nextjs-tailwind"
```

## Notes

- The template is cloned via `git clone` into the current working directory.
- Ensure `git` is installed and available on your `PATH`.
- For on-chain program templates, use [`toolbox template program`](/dev-tools/cli/toolbox/scaffolding-program).
