---
title: How It Works
metaTitle: How It Works | Metaplex Skill
description: Understand the progressive disclosure architecture of the Metaplex Skill.
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

The Metaplex Skill uses **progressive disclosure** to give AI agents exactly the context they need — nothing more, nothing less. This keeps token usage low while providing comprehensive coverage of all Metaplex programs.

## Architecture

The Skill has two layers:

1. **`SKILL.md`** — A lightweight router file (~100 lines) that the agent reads first. It contains a high-level overview of all programs, a tool selection guide, and a task router table that maps tasks to specific reference files.

2. **Reference files** — 13 detailed files covering CLI setup, program-specific CLI commands, SDK patterns, and conceptual foundations. The agent only reads the files relevant to the current task.

## How Agents Use It

When you ask your agent to perform a Metaplex task:

1. The agent reads `SKILL.md` and identifies the task type
2. The task router table directs the agent to the relevant reference file(s)
3. The agent reads only those files and executes the task with accurate commands and code

For example, if you ask *"Create a Core NFT on devnet"*, the agent reads `SKILL.md`, identifies this as a CLI Core task, then reads `cli.md` (shared setup) and `cli-core.md` (Core-specific commands).

## Reference Files

The Skill includes 13 reference files organized by approach and program:

### CLI References

| File | Contents |
|------|----------|
| `cli.md` | Shared CLI setup, configuration, toolbox commands |
| `cli-core.md` | Core NFT and collection CLI commands |
| `cli-token-metadata.md` | Token Metadata NFT/pNFT CLI commands |
| `cli-bubblegum.md` | Compressed NFT (cNFT) CLI commands |
| `cli-candy-machine.md` | Candy Machine setup and deployment CLI commands |
| `cli-genesis.md` | Genesis token launch CLI commands |

### SDK References

| File | Contents |
|------|----------|
| `sdk-umi.md` | Umi SDK setup and common patterns |
| `sdk-core.md` | Core NFT operations via Umi |
| `sdk-token-metadata.md` | Token Metadata operations via Umi |
| `sdk-bubblegum.md` | Compressed NFT operations via Umi |
| `sdk-genesis.md` | Genesis token launch operations via Umi |
| `sdk-token-metadata-kit.md` | Token Metadata operations via Kit SDK |

### Concepts

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
| SDK: Token Metadata with Kit | `sdk-token-metadata-kit.md` |
| SDK: Token launch (Genesis) | `sdk-umi.md` + `sdk-genesis.md` |
| Account structures, PDAs, concepts | `concepts.md` |
