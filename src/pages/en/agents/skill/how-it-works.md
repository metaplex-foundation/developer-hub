---
title: How It Works
metaTitle: How It Works | Metaplex Skill
description: Understand the progressive disclosure architecture of the Metaplex Skill.
agentSkill: /agents/skill/how-it-works.md
created: '02-23-2026'
updated: '04-08-2026'
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
| `cli.md` | Agent guidelines, batching rules, JSON output, explorer links |
| `cli-agent.md` | Agent Registry CLI — identity, delegation, revocation, token linking |
| `cli-core.md` | Core NFT and collection CLI commands |
| `cli-token-metadata.md` | Token Metadata NFT/pNFT CLI commands |
| `cli-bubblegum.md` | Compressed NFT (cNFT) CLI commands |
| `cli-candy-machine.md` | Candy Machine setup and deployment CLI commands |
| `cli-genesis.md` | Genesis token launch and bonding curve CLI commands |
| `cli-toolbox.md` | Fungible token CLI commands |
| `cli-config.md` | CLI configuration |
| `cli-initial-setup.md` | CLI setup guide |
| `cli-troubleshooting.md` | CLI error resolution |

### SDK References

These files cover Umi and Kit SDK operations for each program.

| File | Contents |
|------|----------|
| `sdk-umi.md` | Umi SDK setup and common patterns |
| `sdk-agent.md` | Agent Registry operations via Umi — identity, wallets, delegation |
| `sdk-core.md` | Core NFT operations via Umi |
| `sdk-token-metadata.md` | Token Metadata operations via Umi |
| `sdk-bubblegum.md` | Compressed NFT operations via Umi |
| `sdk-genesis.md` | Genesis token launch and bonding curve swap operations via Umi |
| `sdk-genesis-low-level.md` | Advanced Genesis — custom buckets, presale, vesting |
| `sdk-token-metadata-kit.md` | Token Metadata operations via Kit SDK |

### Concepts

These files cover shared knowledge like account structures, program IDs, and metadata formats.

| File | Contents |
|------|----------|
| `concepts.md` | Account structures, PDAs, program IDs |
| `metadata-json.md` | Off-chain metadata JSON format and schema for NFTs and tokens |

## Task Router

The task router in `SKILL.md` maps each task type to the files the agent should read:

| Task Type | Files Loaded |
|-----------|-------------|
| Any CLI operation (agent guidelines, batching, JSON output) | `cli.md` |
| CLI: Agent Registry (identity, delegation, token linking) | `cli.md` + `cli-agent.md` |
| CLI: Core NFTs/Collections | `cli.md` + `cli-core.md` + `metadata-json.md` |
| CLI: Token Metadata NFTs | `cli.md` + `cli-token-metadata.md` + `metadata-json.md` |
| CLI: Compressed NFTs (Bubblegum) | `cli.md` + `cli-bubblegum.md` + `metadata-json.md` |
| CLI: Candy Machine (NFT drops) | `cli.md` + `cli-candy-machine.md` + `metadata-json.md` |
| CLI: Token launch / bonding curve (Genesis) | `cli.md` + `cli-genesis.md` |
| CLI: Execute / asset-signer wallets / agent vault | `cli.md` + `cli-core.md` |
| CLI: Fungible tokens | `cli.md` + `cli-toolbox.md` |
| SDK setup (Umi) | `sdk-umi.md` |
| SDK: Agent Registry (identity, wallets, delegation) | `sdk-umi.md` + `sdk-agent.md` |
| SDK: Core NFTs | `sdk-umi.md` + `sdk-core.md` + `metadata-json.md` |
| SDK: Token Metadata | `sdk-umi.md` + `sdk-token-metadata.md` + `metadata-json.md` |
| SDK: Compressed NFTs (Bubblegum) | `sdk-umi.md` + `sdk-bubblegum.md` + `metadata-json.md` |
| SDK: Candy Machine (minting/guards) | `sdk-umi.md` |
| SDK: Token Metadata with Kit | `sdk-token-metadata-kit.md` + `metadata-json.md` |
| SDK: Token launch + bonding curve swaps (Genesis) | `sdk-umi.md` + `sdk-genesis.md` |
| SDK: Low-level Genesis (custom buckets, presale, vesting) | `sdk-umi.md` + `sdk-genesis-low-level.md` |
| SDK: Execute / asset-signer PDA / agent vault | `sdk-umi.md` + `sdk-core.md` |
| Off-chain metadata JSON format/schema | `metadata-json.md` |
| Account structures, PDAs, concepts | `concepts.md` |
| CLI errors, localnet issues | `cli-troubleshooting.md` |

## Notes

- The Skill is designed for AI coding agents and may not render as human-readable documentation
- Reference files are maintained alongside the [Skill repository](https://github.com/metaplex-foundation/skill) and may update independently of the developer hub
- Agents that do not support the [Agent Skills](https://agentskills.io) format can still use the Skill via manual installation
