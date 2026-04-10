# Metaplex Skill

Use this agent page when the user asks how to give an AI coding agent Metaplex protocol knowledge.

Human page: https://metaplex.com/docs/agents/skill

## Agent Routing

- Use this page for agent skill installation, agent documentation architecture, and Metaplex Skill concepts.
- For protocol implementation tasks, route to the product-specific agent pages, such as /docs/smart-contracts/core/create-asset.md or /docs/smart-contracts/genesis/launch-pool.md.
- For terminal operations, use CLI quick references on the relevant product page.

## Environment Prerequisites

- Installing a Skill requires an AI coding agent/runtime that supports Agent Skills or can read local instruction files.
- `npx skills add metaplex-foundation/skill` requires Node.js and npm/npx.
- If the user only wants to read docs, do not assume local skill installation is available.

## Install

```bash
npx skills add metaplex-foundation/skill
```

Manual installation copies the Skill files from https://github.com/metaplex-foundation/skill into the agent's skill directory.

## Related Pages

- Skill installation: /docs/agents/skill/installation.md
- How it works: /docs/agents/skill/how-it-works.md
- Programs and operations: /docs/agents/skill/programs-and-operations.md
