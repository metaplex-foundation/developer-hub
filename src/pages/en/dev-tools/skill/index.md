---
title: Metaplex Skill
metaTitle: Metaplex Skill | Dev Tools
description: An Agent Skill that gives AI coding agents full knowledge of Metaplex programs, CLI commands, and SDK patterns.
keywords:
  - agent skill
  - AI coding agent
  - Claude Code
  - Cursor
  - Copilot
  - Metaplex
  - Solana
  - NFT
about:
  - Agent Skills
  - AI-assisted development
  - Metaplex
proficiencyLevel: Beginner
---

Metaplex Skill is an [Agent Skill](https://agentskills.io) — a knowledge base that gives AI coding agents accurate, up-to-date knowledge of Metaplex programs, CLI commands, and SDK patterns. {% .lead %}

Instead of relying on hallucinated APIs or incorrect flags, your AI agent can reference the Skill to get accurate commands and code on the first try.

{% quick-links %}

{% quick-link title="Installation" icon="InboxArrowDown" href="/dev-tools/skill/installation" description="Install the Skill in Claude Code, Cursor, Copilot, or any agent that supports the Agent Skills format." /%}

{% quick-link title="How It Works" icon="CodeBracketSquare" href="/dev-tools/skill/how-it-works" description="Learn how progressive disclosure keeps context lightweight while providing full coverage." /%}

{% /quick-links %}

## Programs Covered

The Skill covers five Metaplex programs and their full operation sets:

| Program | Purpose | CLI | Umi SDK | Kit SDK |
|---------|---------|-----|---------|---------|
| **[Core](/smart-contracts/core)** | Next-gen NFTs with plugins and royalty enforcement | Yes | Yes | — |
| **[Token Metadata](/smart-contracts/token-metadata)** | Fungible tokens, NFTs, pNFTs, editions | Yes | Yes | Yes |
| **[Bubblegum](/smart-contracts/bubblegum-v2)** | Compressed NFTs via Merkle trees | Yes | Yes | — |
| **[Core Candy Machine](/smart-contracts/core-candy-machine)** | NFT drops with configurable guards | Yes | Yes | — |
| **[Genesis](/smart-contracts/genesis)** | Token launches with fair distribution | Yes | Yes | — |

## Operations Supported

The Skill provides reference material for three approaches to Metaplex development:

- **CLI (`mplx`)** — Direct execution of Metaplex operations from the terminal. Asset creation, uploads, Candy Machine deployment, tree creation, transfers, and more.
- **Umi SDK** — Full programmatic access covering all programs. Fetches by owner/collection/creator, DAS API queries, delegate management, and plugin configuration.
- **Kit SDK** — Token Metadata operations using `@solana/kit` with minimal dependencies.

## Compatible Agents

The Skill works with any AI coding agent that supports the [Agent Skills](https://agentskills.io) format:

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code)
- [Cursor](https://www.cursor.com/)
- [GitHub Copilot](https://github.com/features/copilot)
- [Codex](https://openai.com/index/codex/)
- [Windsurf](https://windsurf.com/)

## Next Steps

- **[Install the Skill](/dev-tools/skill/installation)** to get started
- **[How It Works](/dev-tools/skill/how-it-works)** to understand the architecture
- **[Programs & Operations](/dev-tools/skill/programs-and-operations)** for detailed coverage
