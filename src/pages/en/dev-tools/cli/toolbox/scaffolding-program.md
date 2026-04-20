---
# Remember to also update the date in src/components/products/guides/index.js
title: Program Scaffolding
metaTitle: Program Scaffolding | Metaplex CLI
description: Clone a Metaplex program template to start a new on-chain program project.
keywords:
  - mplx CLI
  - program template
  - scaffolding
  - Solana program
  - Shank
about:
  - Metaplex CLI
  - Program Scaffolding
proficiencyLevel: Beginner
created: '04-20-2026'
updated: '04-20-2026'
---

## Summary

The `mplx toolbox template program` command clones a Metaplex-maintained program template into the current directory.

- Bootstraps a new Solana program project with Metaplex conventions pre-configured.
- Launches an interactive picker when no template key is supplied.
- Requires `git` to be available on `PATH`.
- For frontend templates, see [`toolbox template website`](/dev-tools/cli/toolbox/scaffolding-website).

## Quick Reference

| Item | Value |
|------|-------|
| Command | `mplx toolbox template program [template]` |
| Optional arg | `template` — one of: `shank` |
| Interactive | Yes — picker shown when arg is omitted |
| Requires | `git` on `PATH` |
| Side effect | Clones into the current working directory |

## Available Templates

The available template keys map to Metaplex-maintained repositories.

| Template | Description |
|----------|-------------|
| `shank` | Solana program template 2.0 using Shank for IDL generation. |

## Basic Usage

Run the command with no argument to pick interactively, or pass a template key to clone directly.

```bash
# Launch an interactive template picker
mplx toolbox template program

# Clone a specific template
mplx toolbox template program <template>
```

## Arguments

The single optional positional argument selects the template.

- `template` *(optional)*: Template key. If omitted, an interactive picker is shown.

## Examples

These examples show both the interactive picker and a direct clone.

```bash
mplx toolbox template program
mplx toolbox template program shank
```

## Notes

- The template is cloned via `git clone` into the current working directory.
- Ensure `git` is installed and available on your `PATH`.
- For website/frontend templates, use [`toolbox template website`](/dev-tools/cli/toolbox/scaffolding-website).
