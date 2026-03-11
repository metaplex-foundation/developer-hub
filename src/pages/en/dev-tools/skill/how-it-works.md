---
title: How It Works
metaTitle: How It Works | Metaplex Skill
description: Understand the progressive disclosure architecture of the Metaplex Skill.
created: '02-23-2026'
updated: '03-04-2026'
keywords:
  - progressive disclosure
  - agent skill architecture
  - task router
  - SKILL.md
  - reference files
about:
  - Progressive disclosure
  - Agent Skill architecture
  - Context management
proficiencyLevel: Intermediate
---

The Metaplex Skill uses **progressive disclosure** to give AI agents exactly the context they need — nothing more, nothing less. This keeps token usage low while providing comprehensive coverage of all Metaplex programs. {% .lead %}

## Summary

The Metaplex Skill uses a two-layer progressive disclosure architecture to provide AI agents with accurate Metaplex knowledge while minimizing token usage.

- A lightweight router file (`SKILL.md`) maps tasks to specific reference files
- Agents only read the files relevant to the current task
- Reference files cover CLI commands, SDK patterns, and conceptual foundations
- The architecture keeps context small while covering all Metaplex programs

## Architecture

The Skill has two layers:

1. **`SKILL.md`** — A lightweight router file that the agent reads first. It contains a high-level overview of all programs, a tool selection guide, and a task router table that maps tasks to specific reference files.

2. **Reference files** — Detailed files covering CLI setup, program-specific CLI commands, SDK patterns, and conceptual foundations. The agent only reads the files relevant to the current task.

## How Agents Use the Metaplex Skill

When you ask your agent to perform a Metaplex task:

1. The agent reads `SKILL.md` and identifies the task type
2. The task router table directs the agent to the relevant reference file(s)
3. The agent reads only those files and executes the task with accurate commands and code

For example, if you ask *"Create a Core NFT on devnet"*, the agent reads `SKILL.md`, identifies this as a CLI Core task, then reads `cli.md` (shared setup) and `cli-core.md` (Core-specific commands).

## Reference Files

The Skill includes reference files organized by approach and program:

### CLI References

These files cover `mplx` CLI commands for each program.

| File | Contents |
|------|----------|
| `cli.md` | Shared CLI setup, configuration, toolbox commands |
| `cli-core.md` | Core NFT and collection CLI commands |
| `cli-token-metadata.md` | Token Metadata NFT/pNFT CLI commands |
| `cli-bubblegum.md` | Compressed NFT (cNFT) CLI commands |
| `cli-candy-machine.md` | Candy Machine setup and deployment CLI commands |
| `cli-genesis.md` | Genesis token launch CLI commands |

### SDK References

These files cover Umi and Kit SDK operations for each program.

| File | Contents |
|------|----------|
| `sdk-umi.md` | Umi SDK setup and common patterns |
| `sdk-core.md` | Core NFT operations via Umi |
| `sdk-token-metadata.md` | Token Metadata operations via Umi |
| `sdk-bubblegum.md` | Compressed NFT operations via Umi |
| `sdk-genesis.md` | Genesis token launch operations via Umi |
| `sdk-token-metadata-kit.md` | Token Metadata operations via Kit SDK |

### Concepts

These files cover shared knowledge like account structures and program IDs.

| File | Contents |
|------|----------|
| `concepts.md` | Account structures, PDAs, program IDs |

## Task Router

The task router in `SKILL.md` maps each task type to the files the agent should read:

| Task Type | Files Loaded |
|-----------|-------------|
| Any CLI operation (shared setup) | `cli.md` |
| CLI: Core NFTs/Collections | `cli.md` + `cli-core.md` |
| CLI: Token Metadata NFTs | `cli.md` + `cli-token-metadata.md` |
| CLI: Compressed NFTs (Bubblegum) | `cli.md` + `cli-bubblegum.md` |
| CLI: Candy Machine (NFT drops) | `cli.md` + `cli-candy-machine.md` |
| CLI: Token launch (Genesis) | `cli.md` + `cli-genesis.md` |
| CLI: Fungible tokens | `cli.md` (toolbox section) |
| SDK setup (Umi) | `sdk-umi.md` |
| SDK: Core NFTs | `sdk-umi.md` + `sdk-core.md` |
| SDK: Token Metadata | `sdk-umi.md` + `sdk-token-metadata.md` |
| SDK: Compressed NFTs (Bubblegum) | `sdk-umi.md` + `sdk-bubblegum.md` |
| SDK: Candy Machine (minting/guards) | `sdk-umi.md` |
| SDK: Token Metadata with Kit | `sdk-token-metadata-kit.md` |
| SDK: Token launch (Genesis) | `sdk-umi.md` + `sdk-genesis.md` |
| Account structures, PDAs, concepts | `concepts.md` |

## Notes

- The Skill is designed for AI coding agents and may not render as human-readable documentation
- Reference files are maintained alongside the [Skill repository](https://github.com/metaplex-foundation/skill) and may update independently of the developer hub
- Agents that do not support the [Agent Skills](https://agentskills.io) format can still use the Skill via manual installation
