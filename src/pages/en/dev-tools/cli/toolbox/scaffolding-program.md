---
title: Program Scaffolding
metaTitle: Program Scaffolding | Metaplex CLI
description: Clone a Metaplex program template to start a new on-chain program project.
---

The `mplx toolbox template program` command clones a Metaplex-maintained program template into the current directory. It's a quick way to bootstrap a new Solana program project with Metaplex conventions pre-configured.

## Basic Usage

```bash
# Launch an interactive template picker
mplx toolbox template program

# Clone a specific template
mplx toolbox template program <template>
```

## Arguments

- `template` *(optional)*: Template key. If omitted, an interactive picker is shown.

## Available Templates

| Template | Description |
|----------|-------------|
| `shank` | Solana program template 2.0 using Shank for IDL generation. |

## Examples

```bash
mplx toolbox template program
mplx toolbox template program shank
```

## Notes

- The template is cloned via `git clone` into the current working directory.
- Ensure `git` is installed and available on your `PATH`.
- For website/frontend templates, use [`toolbox template website`](/dev-tools/cli/toolbox/scaffolding-website).
