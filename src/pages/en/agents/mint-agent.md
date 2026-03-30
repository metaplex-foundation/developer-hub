---
title: Mint an Agent
metaTitle: Mint an Agent on Solana | Metaplex Agent API
description: Mint an agent using the Metaplex Agent API — create an MPL Core asset and register its identity in a single API call.
keywords:
  - mint agent
  - Agent API
  - mintAgent
  - mintAndSubmitAgent
  - MPL Core
  - agent registration
programmingLanguage:
  - JavaScript
  - TypeScript
about:
  - Agent Minting
  - Solana
  - Metaplex
proficiencyLevel: Beginner
created: '03-30-2026'
updated: '03-30-2026'
---

Mint an agent using the Metaplex Agent API — create an [MPL Core](/smart-contracts/core) asset and register its identity in a single API call. {% .lead %}

## Summary

The Metaplex Agent API provides a streamlined way to mint agents without manually creating a Core asset and registering identity separately. One API call returns an unsigned transaction that creates the asset and registers the identity on-chain.

- **Single API call** — `mintAgent` returns an unsigned transaction; `mintAndSubmitAgent` signs and sends it in one step
- **Creates a Core asset** with the provided name and metadata URI
- **Registers identity** with the agent metadata (services, trust mechanisms, registrations)
- **Multi-network** — supports Solana mainnet/devnet, Eclipse, Sonic, and Fogo networks
- **Requires** the `@metaplex-foundation/mpl-agent-registry` SDK

## Quick Start

1. [Install the SDK](#install-the-sdk) — Add the agent registry package
2. [Mint with mintAndSubmitAgent](#mint-and-submit-in-one-call) — Fastest path to a registered agent
3. [Mint with mintAgent](#mint-with-a-separate-signing-step) — For custom signing flows
4. [Agent Metadata](#agent-metadata) �� Structure of the on-chain metadata payload

## What You'll Learn

This guide shows you how to:

- Mint an agent with a single function call using the Metaplex API
- Configure agent metadata including services and trust mechanisms
- Handle errors from the API
- Target different SVM networks

## Install the SDK

```shell
npm install @metaplex-foundation/mpl-agent-registry @metaplex-foundation/umi-bundle-defaults
```

## Mint and Submit in One Call

The `mintAndSubmitAgent` function calls the API, signs the returned transaction, and sends it to the network:

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mintAndSubmitAgent } from '@metaplex-foundation/mpl-agent-registry';

const umi = createUmi('https://api.mainnet-beta.solana.com');

const result = await mintAndSubmitAgent(umi, {}, {
  wallet: umi.identity.publicKey,
  name: 'My AI Agent',
  uri: 'https://example.com/agent-metadata.json',
  agentMetadata: {
    type: 'agent',
    name: 'My AI Agent',
    description: 'An autonomous agent that executes DeFi strategies on Solana.',
    services: [
      { name: 'web', endpoint: 'https://myagent.ai' },
      { name: 'A2A', endpoint: 'https://myagent.ai/agent-card.json' },
    ],
    registrations: [],
    supportedTrust: ['reputation'],
  },
});

console.log('Agent minted! Asset:', result.assetAddress);
console.log('Signature:', result.signature);
```

### Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `wallet` | Yes | The agent owner's wallet public key (signs the transaction) |
| `name` | Yes | Display name for the Core asset |
| `uri` | Yes | Metadata URI for the Core asset |
| `agentMetadata` | Yes | On-chain agent metadata (see [Agent Metadata](#agent-metadata)) |
| `network` | No | Target network (defaults to `solana-mainnet`) |

### Return Value

| Field | Type | Description |
|-------|------|-------------|
| `signature` | `Uint8Array` | The transaction signature |
| `assetAddress` | `string` | The Core asset address of the minted agent |

## Mint with a Separate Signing Step

The `mintAgent` function returns an unsigned transaction for custom signing flows — useful when you need to add additional signers or use a hardware wallet:

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mintAgent, signAndSendAgentTransaction } from '@metaplex-foundation/mpl-agent-registry';

const umi = createUmi('https://api.mainnet-beta.solana.com');

// Step 1: Get the unsigned transaction from the API
const mintResult = await mintAgent(umi, {}, {
  wallet: umi.identity.publicKey,
  name: 'My AI Agent',
  uri: 'https://example.com/agent-metadata.json',
  agentMetadata: {
    type: 'agent',
    name: 'My AI Agent',
    description: 'An autonomous agent.',
    services: [],
    registrations: [],
    supportedTrust: [],
  },
});

console.log('Asset address:', mintResult.assetAddress);

// Step 2: Sign and send
const signature = await signAndSendAgentTransaction(umi, mintResult);
```

### mintAgent Return Value

| Field | Type | Description |
|-------|------|-------------|
| `transaction` | `Transaction` | Deserialized Umi transaction ready to be signed |
| `blockhash` | `BlockhashWithExpiryBlockHeight` | Blockhash for transaction validity |
| `assetAddress` | `string` | The Core asset address |

## Agent Metadata

The `agentMetadata` object describes the agent's capabilities and is stored as part of the on-chain registration:

```typescript
interface AgentMetadata {
  type: string;              // e.g., 'agent'
  name: string;              // Display name
  description: string;       // What the agent does
  services: AgentService[];  // Service endpoints
  registrations: AgentRegistration[];  // External registry links
  supportedTrust: string[];  // Trust mechanisms
}

interface AgentService {
  name: string;      // Service type: 'web', 'A2A', 'MCP', etc.
  endpoint: string;  // Service URL
}

interface AgentRegistration {
  agentId: string;       // Agent identifier
  agentRegistry: string; // Registry identifier
}
```

See [Register an Agent — Agent Registration Document](/agents/register-agent#agent-registration-document) for the full field reference.

## API Configuration

Pass an `AgentApiConfig` object as the second argument to customize the API endpoint or fetch implementation:

| Option | Default | Description |
|--------|---------|-------------|
| `baseUrl` | `https://api.metaplex.com` | Base URL of the Metaplex API |
| `fetch` | `globalThis.fetch` | Custom fetch implementation (useful for Node.js or testing) |

```typescript
const result = await mintAndSubmitAgent(
  umi,
  { baseUrl: 'https://api.metaplex.com' },
  input
);
```

## Supported Networks

The `network` parameter controls which SVM network the agent is minted on:

| Network ID | Description |
|------------|-------------|
| `solana-mainnet` | Solana Mainnet (default) |
| `solana-devnet` | Solana Devnet |
| `localnet` | Local validator |
| `eclipse-mainnet` | Eclipse Mainnet |
| `sonic-mainnet` | Sonic Mainnet |
| `sonic-devnet` | Sonic Devnet |
| `fogo-mainnet` | Fogo Mainnet |
| `fogo-testnet` | Fogo Testnet |

## Error Handling

The API client throws typed errors you can catch and inspect:

| Error Type | Description |
|------------|-------------|
| `AgentApiError` | HTTP response error — includes `statusCode` and `responseBody` |
| `AgentApiNetworkError` | Network connectivity issue — includes the underlying `cause` |
| `AgentValidationError` | Client-side validation failure — includes the `field` that failed |

```typescript
import {
  isAgentApiError,
  isAgentApiNetworkError,
} from '@metaplex-foundation/mpl-agent-registry';

try {
  const result = await mintAndSubmitAgent(umi, {}, input);
} catch (err) {
  if (isAgentApiError(err)) {
    console.error('API error:', err.statusCode, err.responseBody);
  } else if (isAgentApiNetworkError(err)) {
    console.error('Network error:', err.cause.message);
  }
}
```

## Notes

- The Metaplex API creates the Core asset and registers the identity in a single transaction. You do not need to call `registerIdentityV1` separately.
- The `uri` parameter points to the Core asset's metadata (name, image, etc.), while `agentMetadata` contains the agent-specific registration data (services, trust mechanisms).
- Transactions returned by `mintAgent` include a blockhash and must be signed and submitted before the blockhash expires (roughly 60–90 seconds).
- For manual registration without the API, see [Register an Agent](/agents/register-agent).
