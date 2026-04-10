# Metaplex Agents: Register Agent

Use this agent page when the user wants to attach an agent identity to an existing MPL Core asset.

Human page: https://metaplex.com/docs/agents/register-agent

## Agent Routing

- Default to SDK or API instructions when the user is building an app, backend, script, or integration.
- Use CLI commands when the user asks for terminal commands, manual setup, debugging, one-off execution, or verification.
- If both apply, use SDK or API first and include the CLI quick reference as an operational fallback.

## Environment Prerequisites

- For SDK or API operations, Umi must be installed, configured with an RPC endpoint, and configured with a signer wallet before sending transactions.
- For CLI operations, the Metaplex CLI must be installed and configured with an RPC endpoint and wallet/keypair before running state-changing commands.
- If the user only needs code examples or conceptual guidance, do not assume live wallet access is available.

## When To Use

- The user already has an MPL Core asset and wants to bind an agent identity to it.
- The user wants the `registerIdentityV1` instruction.
- The user needs to provide an ERC-8004-style registration document URI.

## SDK Function

```ts
import { registerIdentityV1 } from '@metaplex-foundation/mpl-agent-registry'

await registerIdentityV1(umi, {
  asset: assetPublicKey,
  collection: collectionPublicKey,
  agentRegistrationUri: 'https://example.com/agent-registration.json',
}).sendAndConfirm(umi)
```

Registration is one-time per asset. Use this path when a Core asset already exists; use `/docs/agents/mint-agent.md` when the user wants the API to create the Core asset and agent identity together.

## Registration Document

The registration document is an ERC-8004-style JSON document. Required fields are `type`, `name`, `description`, and `image`. Optional fields include `services`, `active`, `registrations`, and `supportedTrust`.

Common service types are `web`, `A2A`, `MCP`, `OASF`, `DID`, `email`, and custom service names. Supported trust models include `reputation`, `crypto-economic`, and `tee-attestation`.

```json
{
  "type": "AI Agent",
  "name": "Example Agent",
  "description": "Autonomous agent description",
  "image": "https://example.com/agent.png",
  "services": [
    { "type": "MCP", "endpoint": "https://example.com/mcp" }
  ],
  "supportedTrust": ["reputation", "crypto-economic"]
}
```

## CLI Quick Reference

```bash
# Default API mode creates a Core asset and registers identity.
mplx agents register --name <NAME> --description <DESCRIPTION> --image <PATH_OR_URI>

# Direct instruction mode on an existing Core asset.
mplx agents register <ASSET_ADDRESS> --use-ix --from-file ./agent-doc.json

# Direct instruction mode with a new Core asset.
mplx agents register --new --use-ix --name <NAME> --description <DESCRIPTION> --image <PATH_OR_URI>

# Interactive mode.
mplx agents register --new --wizard
```

Full CLI docs: /docs/dev-tools/cli/agents/register

## Notes

- CLI `--wizard`, `--from-file`, and inline `--name` registration modes are mutually exclusive.
- In API mode, the CLI detects the network from the configured RPC endpoint.
- If a follow-up Genesis API call says the agent is not owned by the connected wallet immediately after registration, the on-chain registration may still have succeeded. Check `mplx agents fetch <ASSET_ADDRESS>` and wait about 30 seconds before retrying the launch.

## Related Pages

- Mint an agent in one API flow: /docs/agents/mint-agent.md
- Read agent data: /docs/agents/run-agent.md
- Create a Core asset first: /docs/smart-contracts/core/create-asset.md
