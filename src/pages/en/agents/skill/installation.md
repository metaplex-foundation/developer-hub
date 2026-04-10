---
title: Installation
metaTitle: Installation | Metaplex Skill
description: Install the Metaplex Skill in Claude Code, Cursor, Copilot, or any AI coding agent.
agentSkill: /agents/skill/installation.md
created: '02-23-2026'
updated: '03-04-2026'
keywords:
  - agent skill installation
  - Claude Code skills
  - Cursor skills
  - Copilot skills
  - npx skills add
about:
  - Agent Skills
  - AI coding agent configuration
proficiencyLevel: Beginner
howToSteps:
  - Run npx skills add metaplex-foundation/skill in your project directory
  - Verify installation by asking your agent to perform a Metaplex operation
howToTools:
  - npx
  - Claude Code
  - Cursor
  - GitHub Copilot
---

Install the Metaplex Skill so your AI coding agent has accurate knowledge of all Metaplex programs, CLI commands, and SDK patterns. {% .lead %}

## Summary

The Metaplex Skill can be installed via the `npx skills` CLI or by manually copying files into your agent's skills directory.

- One-command install via `npx skills add` for any compatible agent
- Manual install supported for Claude Code (project-scoped or global)
- Works with Claude Code, Cursor, Copilot, Windsurf, and other agents
- Verify by asking your agent to perform any Metaplex operation

## Via skills.sh (Recommended)

The fastest way to install. Run this in your project directory:

```bash
npx skills add metaplex-foundation/skill
```

This works with Claude Code, Cursor, Copilot, Windsurf, and any agent that supports the [Agent Skills](https://agentskills.io) format. The command downloads the Skill files into your project so your agent can reference them automatically.

## Claude Code Manual Install

If you prefer not to use `npx skills`, you can copy the Skill files manually.

### Project-Scoped

Copy the Skill files into your project's Claude skills directory:

```bash
mkdir -p .claude/skills/metaplex
```

Then copy the contents of `skills/metaplex/` from the [GitHub repository](https://github.com/metaplex-foundation/skill) into `.claude/skills/metaplex/`.

### Global

To make the Skill available across all your projects:

```bash
mkdir -p ~/.claude/skills/metaplex
```

Then copy the contents of `skills/metaplex/` from the [GitHub repository](https://github.com/metaplex-foundation/skill) into `~/.claude/skills/metaplex/`.

## Verifying Installation

After installation, ask your agent to perform a Metaplex operation. For example:

- *"Launch a token with Genesis"*
- *"Create a Core NFT collection on devnet"*
- *"Mint a compressed NFT to my tree"*

If the Skill is loaded correctly, your agent will reference the correct CLI commands or SDK code without hallucinating flags or APIs.

## Notes

- The `npx skills add` command requires Node.js and npm/npx to be installed
- Manual installation paths differ between project-scoped (`.claude/skills/`) and global (`~/.claude/skills/`) setups
- The Skill files are static references — update by re-running the install command to get the latest version
