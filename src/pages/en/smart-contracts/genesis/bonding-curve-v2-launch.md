---
title: Launching a Bonding Curve via the Metaplex API
metaTitle: Launch a Bonding Curve Token via the Metaplex API | Genesis
description: How to create, sign, send, and register a bonding curve token launch using the Genesis SDK and the Metaplex API — including creator fees, first buy, agent launches, and error handling.
keywords:
  - bonding curve
  - bonding curve v2
  - genesis
  - token launch
  - createAndRegisterLaunch
  - createLaunch
  - registerLaunch
  - Metaplex API
  - creator fee
  - first buy
  - agent launch
  - Solana
  - Raydium CPMM
about:
  - Bonding Curve
  - Token Launch
  - Genesis
  - Solana
programmingLanguage:
  - JavaScript
  - TypeScript
proficiencyLevel: Intermediate
created: '04-07-2026'
updated: '04-07-2026'
howToSteps:
  - Install the Genesis SDK and configure a Umi instance
  - Call createLaunch with token metadata and launch options
  - Sign and submit the returned transactions with signAndSendLaunchTransactions
  - Register the confirmed launch with registerLaunch so it appears on metaplex.com
howToTools:
  - Node.js
  - Umi framework
  - Genesis SDK
  - Metaplex API
faqs:
  - q: What is the difference between createAndRegisterLaunch and calling createLaunch then registerLaunch separately?
    a: createAndRegisterLaunch is a convenience wrapper that calls createLaunch, signs and sends the transactions, and calls registerLaunch in sequence. Use it when the default Umi signer and sender are sufficient. Use createLaunch + registerLaunch separately when you need custom signing logic, Jito bundles, priority fees, or retry handling between the create and register steps.
  - q: Can I test a bonding curve launch on devnet before going to mainnet?
    a: Yes. Pass network "solana-devnet" in the launch input and point your Umi instance at the devnet RPC endpoint. The API routes the request to devnet infrastructure. Make sure your wallet is funded with devnet SOL before sending transactions.
  - q: What happens if setToken is true on an agent and I later want to change the token?
    a: Setting setToken to true permanently associates the launched token with the agent as its primary token. This action is irreversible — it cannot be undone or reassigned. Only set setToken to true when you are certain this is the correct token for the agent.
  - q: Can I combine a creator fee wallet with a first buy?
    a: Yes. Set both creatorFeeWallet and firstBuyAmount in the launch object. The first buy itself is fee-free — no protocol fee or creator fee is charged on that initial purchase. All subsequent swaps on the curve will charge the creator fee to the configured wallet.
  - q: What image format and hosting does the token metadata require?
    a: The image field must be an Irys URL in the format https://gateway.irys.xyz/<id>. Upload your image to Irys first and use the returned gateway URL. Other hosts or non-Irys URLs will fail API validation.
  - q: Why must registerLaunch be called after the transactions are confirmed onchain?
    a: registerLaunch writes the launch to the Metaplex database so it appears on metaplex.com. It requires the genesis account to exist onchain — if called before the create transactions confirm, it will fail with an API error because the account cannot be verified yet.
---

Use the Genesis SDK and the Metaplex API to create, sign, send, and register a [bonding curve V2](/smart-contracts/genesis/bonding-curve-v2) token launch on Solana. {% .lead %}

{% callout title="What You'll Build" %}
This guide covers:
- Launching a bonding curve token in a single call with `createAndRegisterLaunch`
- Adding creator fees — to a specific wallet or to an agent PDA automatically
- Configuring a fee-free first buy at launch
- Signing and registering the launch manually with `createLaunch` + `registerLaunch`
- Testing on devnet and using a custom API base URL or transaction sender
- Handling typed SDK errors
{% /callout %}

## Summary

`createAndRegisterLaunch` (or its lower-level equivalents) calls `POST /v1/launches/create`, returns unsigned Solana transactions, signs and sends them, then registers the launch so the token appears on [metaplex.com](https://www.metaplex.com).

- **One-liner path** — `createAndRegisterLaunch` handles the full flow in a single awaited call
- **Manual path** — `createLaunch` + `signAndSendLaunchTransactions` + `registerLaunch` for custom signing, bundles, or retry logic
- **Creator fees** — optional per-swap fee earned on the bonding curve and in the post-graduation Raydium pool; configurable per-wallet or derived automatically for agent launches
- **First buy** — optional fee-free initial purchase reserved for the launching wallet or agent PDA at curve creation

## Quick Start

**Jump to:** [Installation](#installation) · [Setup](#umi-setup) · [One-Liner Launch](#launching-a-bonding-curve-one-liner-flow) · [Creator Fees](#creator-fees) · [First Buy](#first-buy) · [Manual Signing](#manual-signing-flow) · [Token Metadata](#token-metadata) · [Devnet](#devnet-testing) · [Errors](#common-errors) · [API Reference](#api-reference)

1. Install the Genesis SDK and configure a Umi instance with your keypair identity
2. Call `createAndRegisterLaunch` with your `token` metadata and a `launch: {}` object
3. Read `result.mintAddress` and `result.launch.link` from the response

For custom signing or retry logic, use [Manual Signing Flow](#manual-signing-flow) instead.

## Prerequisites

- **Node.js 18+** — required for native `BigInt` support
- A Solana wallet keypair funded with SOL for transaction fees and the optional first buy amount
- A Solana RPC endpoint (mainnet-beta or devnet)
- An image pre-uploaded to [Irys](https://irys.xyz) — the token metadata `image` field must be an Irys gateway URL

## Installation

Install the three required packages.

```bash {% title="Terminal" %}
npm install @metaplex-foundation/genesis \
  @metaplex-foundation/umi \
  @metaplex-foundation/umi-bundle-defaults
```

## Umi Setup

Configure a Umi instance with your keypair identity before calling any Genesis API function.

```typescript {% title="setup.ts" showLineNumbers=true %}
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { keypairIdentity } from '@metaplex-foundation/umi';

const umi = createUmi('https://api.mainnet-beta.solana.com');

// Load your keypair — use your preferred key management solution in production.
const keypair = umi.eddsa.createKeypairFromSecretKey(mySecretKeyBytes);
umi.use(keypairIdentity(keypair));
```

{% callout type="note" %}
The Genesis API functions do not require the `genesis()` plugin — they talk to the hosted Metaplex API over HTTP rather than submitting instructions directly. The Umi instance is used only for its signer identity and transaction-sending capability.
{% /callout %}

## Launching a Bonding Curve (One-Liner Flow)

`createAndRegisterLaunch` is the simplest path — it creates the launch, signs and sends all transactions, and registers the token on metaplex.com in one awaited call.

```typescript {% title="launch.ts" showLineNumbers=true %}
import { createAndRegisterLaunch } from '@metaplex-foundation/genesis/api';

const result = await createAndRegisterLaunch(umi, {}, {
  wallet: umi.identity.publicKey,
  launchType: 'bondingCurve',
  token: {
    name: 'My Token',
    symbol: 'MTK',
    image: 'https://gateway.irys.xyz/your-image-id',
  },
  launch: {},
});

console.log('Token launched!');
console.log('Mint address:', result.mintAddress);
console.log('View at:', result.launch.link);
```

All protocol parameters — supply splits, virtual reserves, fund flows, and lock schedules — are set to protocol defaults when `launch: {}` is empty. The sections below show how to add creator fees and a first buy.

## Creator Fees

A creator fee is an optional per-swap fee earned on every buy and sell on the bonding curve, and continues to accrue from trades in the Raydium CPMM pool after graduation.

By default, creator fees go to the launching wallet. For current fee rates, see the [Genesis Protocol Fees](/smart-contracts/genesis) page.

### Redirecting Creator Fees to a Specific Wallet

Set `creatorFeeWallet` to send fees to a wallet other than the launching wallet.

```typescript {% title="launch-with-fee-wallet.ts" showLineNumbers=true %}
const result = await createAndRegisterLaunch(umi, {}, {
  wallet: umi.identity.publicKey,
  launchType: 'bondingCurve',
  token: {
    name: 'My Token',
    symbol: 'MTK',
    image: 'https://gateway.irys.xyz/your-image-id',
  },
  launch: {
    creatorFeeWallet: 'FeeRecipientWalletAddress...',
  },
});
```

{% callout type="note" %}
Launching on behalf of a Metaplex agent? The agent-specific flow — automatic PDA fee routing, Core execute wrapping, and `setToken` association — is covered in [Create an Agent Token](/agents/create-agent-token).
{% /callout %}

For how creator fees interact with swap pricing, see [Bonding Curve V2 — Theory of Operation](/smart-contracts/genesis/bonding-curve-v2#fee-structure).

## First Buy

The first buy reserves the initial swap on the curve for the launching wallet at a specified SOL amount, with all fees waived.

Set `firstBuyAmount` to the SOL amount for the fee-free initial purchase.

```typescript {% title="launch-with-first-buy.ts" showLineNumbers=true %}
const result = await createAndRegisterLaunch(umi, {}, {
  wallet: umi.identity.publicKey,
  launchType: 'bondingCurve',
  token: {
    name: 'My Token',
    symbol: 'MTK',
    image: 'https://gateway.irys.xyz/your-image-id',
  },
  launch: {
    firstBuyAmount: 0.1, // 0.1 SOL
  },
});
```

The API executes the first buy as part of the launch transaction flow — the curve already has the initial purchase applied once the transactions confirm. The buyer defaults to the launching `wallet`, or to the agent PDA when `agent` is provided. Override with `firstBuyWallet` (a `Signer`) to designate a different buyer.

When `firstBuyAmount` is omitted or `0`, no first buy restriction is applied and any wallet can make the first swap.

You can combine a first buy with a creator fee wallet:

```typescript {% title="launch-combined.ts" %}
launch: {
  creatorFeeWallet: 'FeeRecipientWalletAddress...',
  firstBuyAmount: 0.5,
},
```

## Manual Signing Flow

Use `createLaunch` and `registerLaunch` separately when you need control over how transactions are signed and submitted — for example, when using Jito bundles, priority fees, or custom retry logic.

```typescript {% title="manual-launch.ts" showLineNumbers=true %}
import {
  createLaunch,
  registerLaunch,
  signAndSendLaunchTransactions,
} from '@metaplex-foundation/genesis/api';

// Step 1: Call the API to get unsigned transactions.
const createResult = await createLaunch(umi, {}, {
  wallet: umi.identity.publicKey,
  launchType: 'bondingCurve',
  token: {
    name: 'My Token',
    symbol: 'MTK',
    image: 'https://gateway.irys.xyz/your-image-id',
  },
  launch: {
    creatorFeeWallet: 'FeeRecipientWalletAddress...',
  },
});

console.log('Mint address:', createResult.mintAddress);
console.log('Transactions to sign:', createResult.transactions.length);

// Step 2: Sign and send the transactions.
const signatures = await signAndSendLaunchTransactions(umi, createResult);

// Step 3: Register the launch after all transactions are confirmed onchain.
const registered = await registerLaunch(umi, {}, {
  genesisAccount: createResult.genesisAccount,
  createLaunchInput: {
    wallet: umi.identity.publicKey,
    launchType: 'bondingCurve',
    token: {
      name: 'My Token',
      symbol: 'MTK',
      image: 'https://gateway.irys.xyz/your-image-id',
    },
    launch: {
      creatorFeeWallet: 'FeeRecipientWalletAddress...',
    },
  },
});

console.log('Launch live at:', registered.launch.link);
```

{% callout type="note" %}
Call `registerLaunch` only after the create transactions are confirmed onchain. The API verifies that the genesis account exists before registering — calling it too early will return an API error.
{% /callout %}

## Token Metadata

Every launch requires a `token` object with the following fields.

| Field | Required | Constraints |
|-------|----------|-------------|
| `name` | Yes | 1–32 characters |
| `symbol` | Yes | 1–10 characters |
| `image` | Yes | Must be an Irys URL (`https://gateway.irys.xyz/...`) |
| `description` | No | Max 250 characters |
| `externalLinks` | No | Optional `website`, `twitter`, and `telegram` values |

```typescript {% title="token-metadata.ts" %}
token: {
  name: 'My Token',
  symbol: 'MTK',
  image: 'https://gateway.irys.xyz/your-image-id',
  description: 'A token launched on the bonding curve',
  externalLinks: {
    website: 'https://mytoken.com',
    twitter: '@mytoken',
    telegram: '@mytoken',
  },
},
```

## Devnet Testing

Pass `network: 'solana-devnet'` and point the Umi instance at the devnet RPC endpoint to route the launch through devnet infrastructure.

```typescript {% title="devnet-launch.ts" showLineNumbers=true %}
const umi = createUmi('https://api.devnet.solana.com');
umi.use(keypairIdentity(keypair));

const result = await createAndRegisterLaunch(umi, {}, {
  wallet: umi.identity.publicKey,
  launchType: 'bondingCurve',
  network: 'solana-devnet',
  token: {
    name: 'Test Token',
    symbol: 'TEST',
    image: 'https://gateway.irys.xyz/test-image',
  },
  launch: {},
});
```

## Custom API Base URL

The SDK defaults to `https://api.metaplex.com`. Pass `baseUrl` in the config object (the second argument) to target a different environment such as a staging API.

```typescript {% title="custom-base-url.ts" showLineNumbers=true %}
const API_CONFIG = { baseUrl: 'https://your-api-base-url.example.com' };

const result = await createAndRegisterLaunch(umi, API_CONFIG, {
  wallet: umi.identity.publicKey,
  launchType: 'bondingCurve',
  token: {
    name: 'My Token',
    symbol: 'MTK',
    image: 'https://gateway.irys.xyz/your-image-id',
  },
  launch: {},
});
```

The same `API_CONFIG` object is accepted by `createLaunch` and `registerLaunch` in the manual signing flow.

## Custom Transaction Sender

Pass a `txSender` callback in the options (fourth argument) to use your own signing and submission infrastructure.

```typescript {% title="custom-sender.ts" showLineNumbers=true %}
const result = await createAndRegisterLaunch(
  umi,
  {},
  {
    wallet: umi.identity.publicKey,
    launchType: 'bondingCurve',
    token: {
      name: 'My Token',
      symbol: 'MTK',
      image: 'https://gateway.irys.xyz/your-image-id',
    },
    launch: {},
  },
  {
    txSender: async (txs) => {
      const signatures = [];
      for (const tx of txs) {
        const signed = await umi.identity.signTransaction(tx);
        signatures.push(await myCustomSend(signed));
      }
      return signatures;
    },
  }
);
```

## Common Errors

| Error | Type check | Cause | Fix |
|-------|-----------|-------|-----|
| `Validation error on "token.image"` | `isGenesisValidationError` | Image URL is not an Irys gateway URL | Upload the image to Irys and use the `https://gateway.irys.xyz/...` URL |
| `Validation error on "token.name"` | `isGenesisValidationError` | Name exceeds 32 characters or is empty | Shorten the token name to 1–32 characters |
| `Network error` | `isGenesisApiNetworkError` | Cannot reach `https://api.metaplex.com` | Check connectivity or supply a `baseUrl` pointing to an accessible endpoint |
| `API error (4xx)` | `isGenesisApiError` | Invalid input rejected by the API | Read `err.responseBody` for the field-level error detail |
| `API error (5xx)` | `isGenesisApiError` | Metaplex API is unavailable | Retry with exponential back-off; do not re-send already-confirmed transactions |
| `registerLaunch` API error | `isGenesisApiError` | Registered before create transactions confirmed | Wait for all signatures to confirm onchain before calling `registerLaunch` |

Use the typed error guards to distinguish these cases:

```typescript {% title="error-handling.ts" showLineNumbers=true %}
import {
  createLaunch,
  isGenesisApiError,
  isGenesisApiNetworkError,
  isGenesisValidationError,
} from '@metaplex-foundation/genesis/api';

try {
  const result = await createLaunch(umi, {}, input);
} catch (err) {
  if (isGenesisValidationError(err)) {
    console.error(`Validation error on "${err.field}": ${err.message}`);
  } else if (isGenesisApiNetworkError(err)) {
    console.error('Network error:', err.message);
  } else if (isGenesisApiError(err)) {
    console.error(`API error (${err.statusCode}): ${err.message}`);
    console.error('Details:', err.responseBody);
  } else {
    throw err;
  }
}
```

## Notes

- `createAndRegisterLaunch` is atomic from the caller's perspective but internally makes two API calls — a failure after the create transactions confirm but before `registerLaunch` means the token exists onchain but is not yet visible on metaplex.com; call `registerLaunch` manually to complete registration
- The Metaplex API endpoint (`https://api.metaplex.com`) is hosted infrastructure — it constructs and returns unsigned transactions; the caller always holds and controls signing
- Virtual reserves, supply splits, and lock schedules are set by protocol defaults when `launch: {}` is empty; there is no API to override these per-launch
- The `agent.setToken` flag is irreversible — once a token is set as an agent's primary token it cannot be changed or reassigned
- First buy is configured at launch creation and cannot be added after the curve is live; `firstBuyAmount: 0` or omitting the field disables it entirely
- Creator fees on the bonding curve continue to accrue in the Raydium CPMM pool after graduation — the fee configuration carries over automatically

## API Reference

### `createAndRegisterLaunch(umi, config, input, options?)`

Convenience function that orchestrates the full launch flow: create, sign, send, and register.

| Parameter | Type | Description |
|-----------|------|-------------|
| `umi` | `Umi` | Umi instance with identity and RPC configured |
| `config` | `GenesisApiConfig \| null` | Optional API config (`baseUrl`, custom `fetch`) |
| `input` | `CreateBondingCurveLaunchInput` | Launch configuration |
| `options` | `SignAndSendOptions` | Optional `txSender` override |

Returns `Promise<CreateAndRegisterLaunchResult>`:

| Field | Description |
|-------|-------------|
| `signatures` | Transaction signatures |
| `mintAddress` | Created token mint address |
| `genesisAccount` | Genesis account PDA |
| `launch.link` | URL to view the token on metaplex.com |

### `createLaunch(umi, config, input)`

Calls `POST /v1/launches/create` and returns deserialized transactions.

Returns `Promise<CreateLaunchResponse>`:

| Field | Description |
|-------|-------------|
| `transactions` | Array of Umi `Transaction` objects to sign and send |
| `blockhash` | Blockhash for transaction validity |
| `mintAddress` | Created token mint address |
| `genesisAccount` | Genesis account PDA |

### `registerLaunch(umi, config, input)`

Registers a confirmed genesis account on metaplex.com. Call after all create transactions are confirmed onchain.

Returns `Promise<RegisterLaunchResponse>`:

| Field | Description |
|-------|-------------|
| `launch.id` | Launch identifier |
| `launch.link` | URL to view the token |
| `token.mintAddress` | Confirmed mint address |

### Types

```typescript {% title="types.ts" %}
interface CreateBondingCurveLaunchInput {
  wallet: PublicKey | string;
  launchType: 'bondingCurve';
  token: TokenMetadata;
  network?: 'solana-mainnet' | 'solana-devnet';
  quoteMint?: 'SOL';
  agent?: {
    mint: PublicKey | string;   // Core asset (NFT) address
    setToken: boolean;          // set launched token as the agent's primary token
  };
  launch: BondingCurveLaunchInput;
}

interface BondingCurveLaunchInput {
  creatorFeeWallet?: PublicKey | string;
  firstBuyAmount?: number;   // SOL amount (e.g. 0.1 = 0.1 SOL)
  firstBuyWallet?: Signer;
}

interface TokenMetadata {
  name: string;           // max 32 characters
  symbol: string;         // max 10 characters
  image: string;          // must be an Irys URL: https://gateway.irys.xyz/...
  description?: string;   // max 250 characters
  externalLinks?: {
    website?: string;
    twitter?: string;
    telegram?: string;
  };
}

interface GenesisApiConfig {
  baseUrl?: string;
  fetch?: typeof fetch;
}
```

## FAQ

### What is the difference between `createAndRegisterLaunch` and calling `createLaunch` then `registerLaunch` separately?

`createAndRegisterLaunch` is a convenience wrapper that handles the full flow in a single call. Use the lower-level functions separately when you need custom signing logic (e.g. Jito bundles, priority fees) or when you want to inspect or modify the unsigned transactions before submission. See [Manual Signing Flow](#manual-signing-flow).

### Can I test a bonding curve launch on devnet before going to mainnet?

Yes. Pass `network: 'solana-devnet'` in the input and point your Umi instance at `https://api.devnet.solana.com`. The API routes the request to devnet infrastructure. Make sure the wallet is funded with devnet SOL before sending transactions. See [Devnet Testing](#devnet-testing).

### What happens if I set `agent.setToken: true` by mistake?

Setting `setToken: true` permanently associates the launched token with the agent as its primary token — this is irreversible and cannot be undone or reassigned. If you are unsure, omit the `agent` field or set `setToken: false` and handle token association separately.

### Can I combine a creator fee wallet with a first buy?

Yes. Set both `creatorFeeWallet` and `firstBuyAmount` in the `launch` object. The first buy itself is fee-free — no protocol fee or creator fee is charged on that initial purchase. Creator fees apply normally to all subsequent swaps. See [First Buy](#first-buy).

### What image format and hosting does the token metadata require?

The `image` field must be an Irys URL — `https://gateway.irys.xyz/<id>`. Upload your image to Irys first and use the returned gateway URL. Other hosts will fail API validation. The SDK surfaces this as an `isGenesisValidationError` on the `token.image` field.

### Why must `registerLaunch` be called after the transactions confirm onchain?

`registerLaunch` writes the launch record to Metaplex's database and verifies the genesis account exists onchain before registering. Calling it before the create transactions confirm will return an API error because the account is not yet visible. In `createAndRegisterLaunch`, this sequencing is handled automatically.
