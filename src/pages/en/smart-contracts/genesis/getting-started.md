---
title: Getting Started
metaTitle: Genesis - Getting Started
description: Learn how to install and set up the Genesis SDK for token launches on Solana.
---

# Getting Started

This guide walks you through installing the Genesis SDK and setting up your first token launch. By the end, you'll have a working Genesis Account ready to accept bucket configurations.

## Prerequisites

Before you begin, make sure you have:
- Node.js 16+ installed
- A Solana wallet with SOL for transaction fees
- Basic familiarity with TypeScript and Solana development

## Installation

Install the Genesis SDK along with the required Metaplex and Solana dependencies:

```bash
npm install \
  @metaplex-foundation/genesis \
  @metaplex-foundation/umi \
  @metaplex-foundation/umi-bundle-defaults \
  @metaplex-foundation/mpl-toolbox \
  @metaplex-foundation/mpl-token-metadata
```

### Package Overview

| Package | Purpose |
|---------|---------|
| `@metaplex-foundation/genesis` | Core Genesis SDK with all instructions and helpers |
| `@metaplex-foundation/umi` | Metaplex's Solana framework for building transactions |
| `@metaplex-foundation/umi-bundle-defaults` | Default Umi plugins and configuration |
| `@metaplex-foundation/mpl-toolbox` | Utilities for working with SPL tokens |
| `@metaplex-foundation/mpl-token-metadata` | Token metadata program integration |

## Setting Up Umi

The Genesis SDK is built on top of [Umi](https://developers.metaplex.com/umi), Metaplex's JavaScript framework for Solana. Umi provides a consistent interface for building and sending transactions.

### Basic Configuration

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { genesis } from '@metaplex-foundation/genesis';
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';

// Create and configure Umi instance
const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(genesis())
  .use(mplTokenMetadata());
```

The `genesis()` plugin registers all Genesis instructions and account deserializers with Umi. The `mplTokenMetadata()` plugin is needed because Genesis creates tokens with metadata.

### Setting Up Your Signer

For backend operations, you'll need to configure a signer. Here's a helper function to create a signer from a secret key stored in an environment variable:

```typescript
import {
  createSignerFromKeypair,
  signerIdentity,
  type Signer,
  type Umi,
} from '@metaplex-foundation/umi';

// Helper to create a signer from a JSON-encoded secret key
const createSignerFromSecretKeyString = (
  umi: Umi,
  secretKeyString: string
): Signer => {
  const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
  const keypair = umi.eddsa.createKeypairFromSecretKey(secretKey);
  return createSignerFromKeypair(umi, keypair);
};

// Load your backend signer from environment
const backendSigner = createSignerFromSecretKeyString(
  umi,
  process.env.BACKEND_KEYPAIR!
);

// Set as the default identity for transactions
umi.use(signerIdentity(backendSigner));
```

{% callout type="warning" %}
**Security Note**: Never commit keypairs to version control. Use environment variables, AWS KMS, GCP Secret Manager, or hardware wallets for production deployments.
{% /callout %}

### Complete Setup Example

Here's a complete setup with all the imports you'll need:

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import {
  createSignerFromKeypair,
  generateSigner,
  signerIdentity,
  publicKey,
  type Signer,
  type Umi,
} from '@metaplex-foundation/umi';
import {
  genesis,
  initializeV2,
  addVaultBucketV2,
  addConstantProductBondingCurveBucketV2,
  addRaydiumCpmmBucketV2,
  finalizeV2,
  findGenesisAccountV2Pda,
} from '@metaplex-foundation/genesis';
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';

// Initialize Umi
const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(genesis())
  .use(mplTokenMetadata());

// Set up backend signer
const createSignerFromSecretKeyString = (umi: Umi, secretKeyString: string): Signer => {
  const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
  const keypair = umi.eddsa.createKeypairFromSecretKey(secretKey);
  return createSignerFromKeypair(umi, keypair);
};

const backendSigner = createSignerFromSecretKeyString(umi, process.env.BACKEND_KEYPAIR!);
umi.use(signerIdentity(backendSigner));

console.log('Umi configured with backend signer:', backendSigner.publicKey);
```

## Initialize a Genesis Account

The Genesis Account is the foundation of your token launch. When you initialize it, you're creating a new SPL token and the master account that will coordinate all distribution buckets.

### Basic Initialization

```typescript
import {
  findGenesisAccountV2Pda,
  initializeV2,
} from '@metaplex-foundation/genesis';
import { generateSigner, publicKey } from '@metaplex-foundation/umi';

// Generate a new mint keypair for your token
const baseMint = generateSigner(umi);

// wSOL is the standard quote token
const WSOL_MINT = publicKey('So11111111111111111111111111111111111111112');

// Derive the Genesis Account PDA
const [genesisAccount] = findGenesisAccountV2Pda(umi, {
  baseMint: baseMint.publicKey,
  genesisIndex: 0,  // Use 0 for your first campaign
});

// Initialize the Genesis Account
await initializeV2(umi, {
  baseMint,
  quoteMint: WSOL_MINT,
  fundingMode: 0,  // Standard funding mode
  totalSupplyBaseToken: 1_000_000_000_000_000n,  // 1 million tokens (with 9 decimals)
  name: 'My Token',
  symbol: 'MTK',
  uri: 'https://example.com/metadata.json',
}).sendAndConfirm(umi);

console.log('Genesis Account created:', genesisAccount);
console.log('Token Mint:', baseMint.publicKey);
```

### Understanding the Parameters

| Parameter | Description |
|-----------|-------------|
| `baseMint` | A new keypair that will become your token's mint address |
| `quoteMint` | The token users pay with (usually wSOL) |
| `fundingMode` | Set to `0` for standard mode |
| `totalSupplyBaseToken` | Total tokens to mint (including decimals) |
| `name` | Token name for metadata |
| `symbol` | Token symbol for metadata |
| `uri` | URL pointing to your token's JSON metadata |

### Token Supply Calculation

When specifying `totalSupplyBaseToken`, remember to account for decimals. SPL tokens typically use 9 decimals:

```typescript
// Examples:
const ONE_TOKEN = 1_000_000_000n;           // 1 token with 9 decimals
const ONE_MILLION = 1_000_000_000_000_000n; // 1,000,000 tokens
const ONE_BILLION = 1_000_000_000_000_000_000n; // 1,000,000,000 tokens
```

{% callout type="note" %}
**Important**: The `totalSupplyBaseToken` should equal the sum of all bucket allocations you plan to add. If you allocate 500M tokens to the bonding curve and 500M to Raydium, your total supply should be 1B tokens.
{% /callout %}

## Add Your Buckets

After initialization, add the buckets that define how your tokens will be distributed. See the dedicated guides for each bucket type:

- [Vault Deposits](/smart-contracts/genesis/vault-deposits) - For presale/pre-deposit functionality
- [Bonding Curves](/smart-contracts/genesis/bonding-curves) - For automated price discovery
- [Raydium Graduation](/smart-contracts/genesis/raydium-graduation) - For DEX liquidity

## Finalize the Genesis Account

Once all buckets are configured, finalize the Genesis Account to lock the configuration:

```typescript
import { finalizeV2 } from '@metaplex-foundation/genesis';

await finalizeV2(umi, {
  baseMint: baseMint.publicKey,
}).sendAndConfirm(umi);

console.log('Genesis Account finalized!');
```

### What Finalization Does

After finalization:
- ✅ No more buckets can be added
- ✅ Deposits, swaps, and trading work normally
- ✅ `transitionV2` and graduation become available
- ❌ You cannot modify the bucket configuration

{% callout type="warning" %}
**Finalization is irreversible.** Make sure all your buckets are properly configured before finalizing. Double-check time conditions, allocations, and end behaviors.
{% /callout %}

## Revoke Authorities (Optional)

After your token launch is complete, you may want to make the token fully decentralized by revoking mint and freeze authorities:

```typescript
import { revokeV2 } from '@metaplex-foundation/genesis';

await revokeV2(umi, {
  baseMint: baseMint.publicKey,
  revokeMintAuthority: true,    // No more tokens can ever be minted
  revokeFreezeAuthority: true,  // Token accounts can never be frozen
}).sendAndConfirm(umi);

console.log('Authorities revoked - token is now fully decentralized');
```

{% callout type="warning" %}
**This is irreversible!** Once you revoke mint authority, no more tokens can ever be created. Once you revoke freeze authority, you lose the ability to freeze token accounts. Only do this when you're absolutely certain the TGE is complete.
{% /callout %}

## Common Patterns

### Development vs Production

```typescript
// Development: Use devnet
const umi = createUmi('https://api.devnet.solana.com')
  .use(genesis())
  .use(mplTokenMetadata());

// Production: Use mainnet with a reliable RPC
const umi = createUmi('https://your-rpc-provider.com')
  .use(genesis())
  .use(mplTokenMetadata());
```

### Error Handling

```typescript
try {
  await initializeV2(umi, { ... }).sendAndConfirm(umi);
  console.log('Success!');
} catch (error) {
  if (error.message.includes('insufficient funds')) {
    console.error('Not enough SOL for transaction fees');
  } else if (error.message.includes('already initialized')) {
    console.error('Genesis Account already exists');
  } else {
    console.error('Transaction failed:', error);
  }
}
```

### Transaction Confirmation

```typescript
// Wait for finalized confirmation (most secure)
const result = await initializeV2(umi, { ... })
  .sendAndConfirm(umi, {
    confirm: { commitment: 'finalized' }
  });

console.log('Transaction signature:', result.signature);
```

## Next Steps

Now that you have a Genesis Account, configure your distribution mechanism:

1. **[Vault Deposits](/smart-contracts/genesis/vault-deposits)** - If you want to collect pre-deposits before trading
2. **[Bonding Curves](/smart-contracts/genesis/bonding-curves)** - To set up automated price discovery
3. **[Raydium Graduation](/smart-contracts/genesis/raydium-graduation)** - To configure DEX integration
