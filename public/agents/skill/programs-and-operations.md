# Metaplex Skill: Programs And Operations

Use this agent page when the user asks which Metaplex program, CLI command group, or SDK package to use for a task.

Human page: https://metaplex.com/docs/agents/skill/programs-and-operations

## Tool Preference

- Prefer SDK/API when the user is building an app, backend, automation, or reusable integration.
- Prefer CLI when the user wants a terminal command, manual setup, debugging, or one-off verification.
- For coding agents such as OpenClaw, use the same preference: SDK/API for code generation, CLI for operational tasks.

## Programs

- Agent Registry: on-chain agent identity, agent wallets, executive delegation, and Genesis token linking.
- Genesis: token launch pools, bonding curves, first buy, creator fees, swaps, and Raydium graduation.
- Core: modern NFTs and collections with plugins, lifecycle hooks, and Asset Signer execution.
- Token Metadata: legacy NFTs, pNFTs, editions, and fungible token metadata.
- Bubblegum: compressed NFTs using Merkle trees and DAS-enabled RPC.
- Candy Machine: NFT drop setup and minting guards.

## Agent Registry

- CLI group: `mplx agents`.
- SDK package: `@metaplex-foundation/mpl-agent-registry`.
- Main tasks: `register`, `fetch`, `executive register`, `executive delegate`, `executive revoke`, `set-agent-token`.
- SDK functions include `mintAndSubmitAgent`, `mintAgent`, `registerIdentityV1`, `safeFetchAgentIdentityV2`, `setAgentTokenV1`, `registerExecutiveV1`, `delegateExecutionV1`, and `revokeExecutionV1`.

## Genesis

- CLI group: `mplx genesis`.
- SDK package: `@metaplex-foundation/genesis`.
- Use for launchpool or bonding curve token launches.
- Use `createAndRegisterLaunch()` for app/backend integrations.
- Use `mplx genesis launch create --agentMint --agentSetToken` when launching and linking an agent token from the CLI.

## Core

- CLI group: `mplx core`.
- SDK package: `@metaplex-foundation/mpl-core`.
- Use for Core asset and collection creation, update, transfer, burn, plugins, and Asset Signer execution.
- Agent Registry builds on Core because each agent is a Core asset with an Asset Signer PDA.

## Notes

- Bubblegum compressed NFT reads require a DAS-enabled RPC endpoint.
- Candy Machine CLI handles setup/configuration/item insertion; minting requires the SDK.
- Kit SDK support is limited to Token Metadata.
- Setting an agent token is irreversible and requires asset-signer authority for the agent asset.

## Related Pages

- Agent Registry overview: /docs/agents/index.md
- Genesis overview: /docs/smart-contracts/genesis/index.md
- Core create asset: /docs/smart-contracts/core/create-asset.md
