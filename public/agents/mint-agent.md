# Metaplex Agents: Mint Agent

Use this agent page when the user wants to create a new agent in one API-backed flow.

Human page: https://metaplex.com/docs/agents/mint-agent

## Agent Routing

- Default to SDK or API instructions when the user is building an app, backend, script, or integration.
- Use CLI commands when the user asks for terminal commands, manual setup, debugging, one-off execution, or verification.
- If both apply, use SDK or API first and include the CLI quick reference as an operational fallback.

## Environment Prerequisites

- For SDK or API operations, Umi must be installed, configured with an RPC endpoint, and configured with a signer wallet before sending transactions.
- For CLI operations, the Metaplex CLI must be installed and configured with an RPC endpoint and wallet/keypair before running state-changing commands.
- If the user only needs code examples or conceptual guidance, do not assume live wallet access is available.

## When To Use

- The user wants to create a new Core asset and register the agent identity in one transaction.
- The user wants to use the Metaplex hosted Agent API.
- The user does not already have a Core asset to register.

## SDK/API Functions

- `mintAndSubmitAgent()` calls the Metaplex API, signs the returned transaction with Umi, and submits it.
- `mintAgent()` returns the unsigned transaction for manual signing or custom transaction sending.
- Pass API config as the second argument when needed: `{ baseUrl, fetch }`.
- Use `isAgentApiError`, `isAgentApiNetworkError`, and `isAgentValidationError` to classify API or validation failures.

## Required Inputs

- `wallet`: wallet public key.
- `name`: agent name.
- `uri`: public Core asset metadata JSON URI.
- `agentMetadata`: off-chain agent metadata stored by the Metaplex API.
- `network`: optional network such as `solana-mainnet` or `solana-devnet`.

## SDK Example

```ts
import pkg from '@metaplex-foundation/mpl-agent-registry'

const { mintAndSubmitAgent } = pkg

const { signature, assetAddress } = await mintAndSubmitAgent(
  umi,
  {},
  {
    wallet: umi.identity.publicKey,
    name: 'Example Agent',
    uri: 'https://example.com/core-asset.json',
    agentMetadata: {
      type: 'AI Agent',
      name: 'Example Agent',
      description: 'Agent registration metadata',
      image: 'https://example.com/agent.png',
      services: [
        { type: 'MCP', endpoint: 'https://example.com/mcp' },
      ],
      supportedTrust: ['reputation'],
    },
    network: 'solana-devnet',
  }
)
```

Supported API networks: `solana-mainnet`, `solana-devnet`, `localnet`, `eclipse-mainnet`, `sonic-mainnet`, `sonic-devnet`, `fogo-mainnet`, and `fogo-testnet`.

## CLI Quick Reference

```bash
mplx agents register \
  --name <NAME> \
  --description <DESCRIPTION> \
  --image <PATH_OR_URI> \
  --services '[{"name":"MCP","endpoint":"https://example.com/mcp"}]' \
  --supported-trust '["reputation","crypto-economic"]'
```

Full CLI docs: /docs/dev-tools/cli/agents/register

## Related Pages

- Register an existing Core asset: /docs/agents/register-agent.md
- Read agent data: /docs/agents/run-agent.md
- Create an agent token: /docs/agents/create-agent-token.md
