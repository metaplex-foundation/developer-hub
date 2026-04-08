---
title: Metaplex Skill
metaTitle: Metaplex Skill | Agents
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
  - agent registry
  - bonding curve
  - Genesis
about:
  - Agent Skills
  - AI-assisted development
  - Metaplex
proficiencyLevel: Beginner
created: '02-23-2026'
updated: '04-08-2026'
---

Metaplex Skill is an [Agent Skill](https://agentskills.io) — a knowledge base that gives AI coding agents accurate, up-to-date knowledge of Metaplex programs, CLI commands, and SDK patterns. {% .lead %}

## Summary

The Metaplex Skill gives AI coding agents accurate knowledge of all Metaplex programs, CLI commands, and SDK patterns.

- Covers six programs: Agent Registry, Genesis, Core, Token Metadata, Bubblegum, and Candy Machine
- Supports CLI, Umi SDK, and Kit SDK approaches
- Works with Claude Code, Cursor, Copilot, Codex, Windsurf, and other compatible agents
- Uses progressive disclosure to minimize token usage while providing full coverage

Instead of relying on hallucinated APIs or incorrect flags, your AI agent can reference the Skill to get accurate commands and code on the first try.

{% quick-links %}

{% quick-link title="Installation" icon="InboxArrowDown" href="/agents/skill/installation" description="Install the Skill in Claude Code, Cursor, Copilot, or any agent that supports the Agent Skills format." /%}

{% quick-link title="How It Works" icon="CodeBracketSquare" href="/agents/skill/how-it-works" description="Learn how progressive disclosure keeps context lightweight while providing full coverage." /%}

{% /quick-links %}

## Programs Covered

The Skill covers six Metaplex programs and their full operation sets:

| Program | Purpose | CLI | Umi SDK | Kit SDK |
|---------|---------|-----|---------|---------|
| **[Agent Registry](/agents)** | On-chain agent identity, wallets, and execution delegation | Yes | Yes | — |
| **[Genesis](/smart-contracts/genesis)** | Token launches via launchpool or bonding curve with Raydium graduation | Yes | Yes | — |
| **[Core](/smart-contracts/core)** | Next-gen NFTs with plugins and royalty enforcement | Yes | Yes | — |
| **[Token Metadata](/smart-contracts/token-metadata)** | Fungible tokens, NFTs, pNFTs, editions | Yes | Yes | Yes |
| **[Bubblegum](/smart-contracts/bubblegum-v2)** | Compressed NFTs via Merkle trees | Yes | Yes | — |
| **[Core Candy Machine](/smart-contracts/core-candy-machine)** | NFT drops with configurable guards | Yes | Yes | — |

## Operations Supported

The Skill provides reference material for three approaches to Metaplex development:

- **CLI (`mplx`)** — Direct execution of Metaplex operations from the terminal. Agent registration (`mplx agents`), token launches and bonding curve creation (`mplx genesis`), asset creation, uploads, Candy Machine deployment, tree creation, transfers, and more.
- **Umi SDK** — Full programmatic access covering all programs. Agent identity and delegation, Genesis launches and bonding curve swaps, fetches by owner/collection/creator, DAS API queries, delegate management, and plugin configuration.
- **Kit SDK** — Token Metadata operations using `@solana/kit` with minimal dependencies.

## Compatible Agents

The Skill works with any AI coding agent that supports the [Agent Skills](https://agentskills.io) format:

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code)
- [Cursor](https://www.cursor.com/)
- [GitHub Copilot](https://github.com/features/copilot)
- [Codex](https://openai.com/index/codex/)
- [Windsurf](https://windsurf.com/)

## Next Steps

- **[Install the Skill](/agents/skill/installation)** to get started
- **[How It Works](/agents/skill/how-it-works)** to understand the architecture
- **[Programs & Operations](/agents/skill/programs-and-operations)** for detailed coverage

## Notes

- The Skill requires an AI coding agent that supports the [Agent Skills](https://agentskills.io) format
- Skill files are static references bundled into your project — re-run the install command to update
- The `npx skills add` command requires Node.js and npm/npx
