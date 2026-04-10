# Metaplex Skill: Installation

Use this agent page when the user wants to install the Metaplex Skill in an AI coding agent.

Human page: https://metaplex.com/docs/agents/skill/installation

## Agent Routing

- Use the one-command install when the user has Node.js and npm/npx available.
- Use manual installation only when the target agent does not support the installer or the user asks for manual setup.
- If the user asks for protocol implementation help after installing, route to the product-specific `.md` page.

## Install

```bash
npx skills add metaplex-foundation/skill
```

This requires Node.js and npm/npx.

## Manual Claude Code Install

Project-scoped:

```bash
mkdir -p .claude/skills/metaplex
```

Global:

```bash
mkdir -p ~/.claude/skills/metaplex
```

Then copy the contents of `skills/metaplex/` from https://github.com/metaplex-foundation/skill into the chosen `metaplex` skill directory.

## Verify

Ask the agent for a concrete Metaplex task, such as:

- Launch a token with Genesis.
- Create a Core NFT collection on devnet.
- Mint a compressed NFT to a Merkle tree.

If the Skill is loaded, the agent should route to the relevant CLI or SDK reference instead of guessing flags or APIs.

## Related Pages

- Skill overview: /docs/agents/skill.md
- How it works: /docs/agents/skill/how-it-works.md
- Programs and operations: /docs/agents/skill/programs-and-operations.md
