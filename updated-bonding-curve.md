# Launching a Bonding Curve via the Metaplex API

This guide covers creating a bonding curve token launch using the Genesis SDK
and the Metaplex API. For a deeper understanding of how bonding curves work
under the hood — pricing, fees, and graduation — see the
*Bonding Curve V2 — Theory of Operation*.

## Overview

A bonding curve launch creates a new token with an automated market where the
price rises as people buy and falls as they sell, following a constant product
curve. Once all tokens on the curve have been purchased, the curve graduates
and liquidity migrates into a Raydium CPMM pool for ongoing trading.

After a successful launch, the token is tradable on
[metaplex.com](https://www.metaplex.com).

The simplest way to launch is through the hosted **Metaplex API** at
`https://api.metaplex.com`. The flow is:

1. Call the API with your token metadata and wallet address
2. The API returns unsigned Solana transactions that set up the on-chain state
3. You sign and submit the transactions
4. Register the launch so it appears on metaplex.com

The SDK wraps this into two levels of abstraction:
- **`createAndRegisterLaunch`** — convenience function that handles the full
  flow (create, sign, send, register) in one call
- **`createLaunch`** + **`registerLaunch`** — separate steps for more control
  over transaction signing and submission

## Installation

```bash
npm install @metaplex-foundation/genesis \
  @metaplex-foundation/umi \
  @metaplex-foundation/umi-bundle-defaults
```

## Setup

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { keypairIdentity } from '@metaplex-foundation/umi';

const umi = createUmi('https://api.mainnet-beta.solana.com');

// Load your keypair (the launching wallet)
// In production, use your preferred key management solution
const keypair = umi.eddsa.createKeypairFromSecretKey(mySecretKeyBytes);
umi.use(keypairIdentity(keypair));
```

## Quick Start: Launch a Bonding Curve (one-liner)

The simplest path — create, sign, send, and register in a single call:

```typescript
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

All protocol parameters — supply splits, virtual reserves, fund flows, and
lock schedules — are set to protocol defaults automatically. The `launch: {}`
object is intentionally minimal; the sections below show how to add optional
features like creator fees and first buy.

## Creator Fees

A creator fee is charged on every swap (buy and sell) on the bonding curve, and
continues to earn fees from trades in the Raydium liquidity pool after
graduation. By default the fee goes to the launching wallet. You can redirect
it to a different wallet explicitly, or let the SDK derive the recipient
automatically when launching on behalf of a Metaplex agent.

For current fee rates, see the
[Metaplex Protocol Fees](https://www.metaplex.com/docs/protocol-fees) page.

### Option A: Redirect to a Specific Wallet

Use `creatorFeeWallet` to send creator fees to a wallet other than the
launching wallet:

```typescript
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

### Option B: Agent Launch (Automatic Creator Fee Wallet)

When launching on behalf of a Metaplex agent, pass the `agent` field on the
top-level input. The SDK automatically derives the agent's Core asset signer
PDA and uses it as the creator fee wallet — you don't need to set
`creatorFeeWallet` manually:

```typescript
const result = await createAndRegisterLaunch(umi, {}, {
  wallet: umi.identity.publicKey,
  agent: {
    mint: agentAssetAddress,  // Core asset (NFT) address of the agent
    setToken: true,           // whether to set the launched token on the agent
  },
  launchType: 'bondingCurve',
  token: {
    name: 'Agent Token',
    symbol: 'AGT',
    image: 'https://gateway.irys.xyz/your-image-id',
  },
  launch: {},
});
```

When `agent` is provided:
- The creator fee wallet is automatically set to the agent's Core asset signer
  PDA (derived from `['mpl-core-execute', <agent_mint>]`)
- The first buy buyer (if `firstBuyAmount` is set) also defaults to the agent PDA
- The launch transactions are wrapped in Core execute instructions for the
  agent to execute
- If `setToken` is `true`, the launched token is set as the agent's **primary
  token**. **This can only be done once per agent and is irreversible.** Only
  set this to `true` when you are certain this is the token you want
  permanently associated with the agent.

You can still override the creator fee wallet explicitly via
`launch.creatorFeeWallet`, which takes precedence over the agent PDA. If
neither `agent` nor `creatorFeeWallet` is provided, the creator fee wallet
defaults to the launching wallet.

For details on how creator fees interact with swaps and the first buy, see the
*Bonding Curve V2 — Theory of Operation* document.

## First Buy

The bonding curve supports an optional **first buy** that reserves the very
first swap for the launching wallet at a specified amount. This is useful for
seeding initial liquidity or ensuring the creator gets tokens at the starting
price. The first buy is fee-free — no protocol fee or creator fee is charged.

Set `firstBuyAmount` to the SOL amount for the mandatory first purchase:

```typescript
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

When `firstBuyAmount` is set, the API executes the first buy as part of the
launch flow — the curve will already have the initial purchase applied once the
launch transactions are confirmed. The first buy buyer defaults to the
launching wallet (`wallet`), or to the agent PDA when an `agent` is provided.
You can override this with `firstBuyWallet` (a `Signer`). When
`firstBuyAmount` is omitted or set to `0`, no first buy restriction is applied
and anyone can make the first swap.

You can combine first buy with creator fees:

```typescript
launch: {
  creatorFeeWallet: 'FeeRecipientWalletAddress...',
  firstBuyAmount: 0.5, // 0.5 SOL
},
```

## Step-by-Step: Manual Signing

For more control over how transactions are signed and submitted, use
`createLaunch` and `registerLaunch` separately:

```typescript
import {
  createLaunch,
  registerLaunch,
  signAndSendLaunchTransactions,
} from '@metaplex-foundation/genesis/api';

// Step 1: Call the API to get unsigned transactions
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

// Step 2: Sign and send the transactions
const signatures = await signAndSendLaunchTransactions(umi, createResult);

// Step 3: Register the launch so it appears on metaplex.com
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

## Token Metadata

Every launch requires token metadata:

| Field | Required | Constraints |
|-------|----------|-------------|
| `name` | Yes | 1–32 characters |
| `symbol` | Yes | 1–10 characters |
| `image` | Yes | Must be an Irys URL (`https://gateway.irys.xyz/...`) |
| `description` | No | Max 250 characters |
| `externalLinks` | No | Optional `website`, `twitter`, and `telegram` URLs |

```typescript
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

## Using Devnet

Pass `network: 'solana-devnet'` and point your Umi instance at the devnet RPC:

```typescript
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

The SDK defaults to `https://api.metaplex.com`. To target a different
environment (e.g. a staging API), pass `baseUrl` in the config
object (the second argument). This works with both `createLaunch` and
`createAndRegisterLaunch`:

```typescript
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

The same config object is also accepted by `createLaunch` and `registerLaunch`
when using the step-by-step flow.

## Custom Transaction Sender

If you have your own transaction-sending infrastructure (e.g. Jito bundles,
priority fees, or retry logic):

```typescript
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
      // Your custom signing and sending logic
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

## Error Handling

The SDK provides typed errors for different failure modes:

```typescript
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
    // Client-side validation failed (e.g. empty token name)
    console.error(`Validation error on "${err.field}": ${err.message}`);
  } else if (isGenesisApiNetworkError(err)) {
    // Network issue reaching the API
    console.error('Network error:', err.message);
  } else if (isGenesisApiError(err)) {
    // API returned an error response
    console.error(`API error (${err.statusCode}): ${err.message}`);
    console.error('Details:', err.responseBody);
  } else {
    throw err;
  }
}
```

## API Reference

### `createAndRegisterLaunch(umi, config, input, options?)`

Convenience function that orchestrates the full launch flow: create, sign,
send, and register.

| Parameter | Type | Description |
|-----------|------|-------------|
| `umi` | `Umi` | Umi instance with identity and RPC configured |
| `config` | `GenesisApiConfig \| null` | Optional API config (base URL, custom fetch) |
| `input` | `CreateLaunchInput` | Launch configuration |
| `options` | `SignAndSendOptions` | Optional signing/sending overrides |

Returns `Promise<CreateAndRegisterLaunchResult>`:
- `signatures` — transaction signatures
- `mintAddress` — the created token's mint address
- `genesisAccount` — the genesis account PDA
- `launch.link` — URL to view the token on metaplex.com

### `createLaunch(umi, config, input)`

Calls `POST /v1/launches/create` and returns deserialized transactions.

Returns `Promise<CreateLaunchResponse>`:
- `transactions` — array of Umi `Transaction` objects to sign and send
- `blockhash` — blockhash for transaction validity
- `mintAddress` — the created token's mint address
- `genesisAccount` — the genesis account PDA

### `registerLaunch(umi, config, input)`

Registers a launched genesis account so it appears on metaplex.com. Call this
after all create transactions have been confirmed on-chain.

Returns `Promise<RegisterLaunchResponse>`:
- `launch.id` — launch identifier
- `launch.link` — URL to view the token
- `token.mintAddress` — confirmed mint address

### Types

```typescript
interface CreateBondingCurveLaunchInput {
  wallet: PublicKey | string;
  launchType: 'bondingCurve';
  token: TokenMetadata;
  network?: 'solana-mainnet' | 'solana-devnet';
  quoteMint?: 'SOL';
  agent?: {
    mint: PublicKey | string;   // Core asset (NFT) address
    setToken: boolean;          // set launched token on the agent
  };
  launch: BondingCurveLaunchInput;
}

interface BondingCurveLaunchInput {
  creatorFeeWallet?: PublicKey | string;
  firstBuyAmount?: number;   // SOL amount (e.g. 0.1 means 0.1 SOL)
  firstBuyWallet?: Signer;
}

interface TokenMetadata {
  name: string;
  symbol: string;
  image: string;
  description?: string;
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