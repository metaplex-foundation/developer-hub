# Metaplex Skill: How It Works

Use this agent page when the user asks how the Metaplex Skill routes AI agents to the right references.

Human page: https://metaplex.com/docs/agents/skill/how-it-works

## Agent Routing

- Read `SKILL.md` first as the lightweight router.
- Load only the reference files needed for the current task.
- For Agent Registry tasks, use `cli-agent.md` for terminal workflows and `sdk-agent.md` for Umi SDK workflows.
- For Genesis token launch tasks, use `cli-genesis.md` or `sdk-genesis.md`.
- For Core NFT and Asset Signer tasks, use `cli-core.md` or `sdk-core.md`.

## Architecture

- `SKILL.md`: high-level tool selection and task router.
- CLI references: command syntax, setup expectations, operational notes.
- SDK references: package setup, Umi plugins, function names, account/PDA details, error helpers.
- Concepts references: shared account structures, PDAs, program IDs, and metadata JSON formats.

## Agent Registry Reference Map

- CLI agent identity, delegation, revocation, and token linking: `references/cli-agent.md`.
- SDK agent identity, minting, reading, delegation, and token linking: `references/sdk-agent.md`.
- Core asset creation and Asset Signer execution: `references/cli-core.md` or `references/sdk-core.md`.
- Agent token launch and bonding curve integration: `references/cli-genesis.md` or `references/sdk-genesis.md`.

## Progressive Disclosure Rule

Do not load every reference up front. Select the smallest useful set:

- Terminal one-off: CLI setup reference plus the relevant program CLI reference.
- App/backend/script: Umi setup reference plus the relevant program SDK reference.
- Metadata question: metadata reference plus the relevant program reference.
- Account/PDA question: concepts reference plus the relevant program reference.

## Related Pages

- Skill overview: /docs/agents/skill.md
- Installation: /docs/agents/skill/installation.md
- Programs and operations: /docs/agents/skill/programs-and-operations.md
