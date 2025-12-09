---
title: JavaScript SDK
metaTitle: JavaScript SDK | Genesis
description: Learn how to install and configure the Genesis JavaScript SDK for token launches on Solana.
---

Metaplex provides a JavaScript library for interacting with the Genesis program. Built on the [Umi Framework](/umi), it ships as a lightweight library that can be used in any JavaScript or TypeScript project.

{% quick-links %}

{% quick-link title="API Reference" target="_blank" icon="JavaScript" href="https://mpl-genesis.typedoc.metaplex.com/" description="Genesis JavaScript SDK generated API documentation." /%}

{% quick-link title="NPM Package" target="_blank" icon="JavaScript" href="https://www.npmjs.com/package/@metaplex-foundation/genesis" description="Genesis JavaScript SDK on NPM." /%}

{% quick-link title="GitHub" target="_blank" icon="GitHub" href="https://github.com/metaplex-foundation/mpl-genesis" description="Genesis program and SDK source code." /%}

{% /quick-links %}

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

## Umi Setup

The Genesis SDK is built on top of [Umi](/umi), Metaplex's JavaScript framework for Solana. If you haven't set up Umi yet, check out the [Umi Getting Started](/umi/getting-started) guide.

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

The `genesis()` plugin registers all Genesis instructions and account deserializers with Umi. The `mplTokenMetadata()` plugin is required because Genesis creates tokens with metadata.

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

## Setting Up Signers

Genesis operations require signers for transaction authorization. For backend operations, you'll typically use a keypair loaded from an environment variable.

### Creating a Signer from Secret Key

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

## Error Handling

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

## Transaction Confirmation

```typescript
// Wait for finalized confirmation (most secure)
const result = await initializeV2(umi, { ... })
  .sendAndConfirm(umi, {
    confirm: { commitment: 'finalized' }
  });

console.log('Transaction signature:', result.signature);
```

## Next Steps

With your Umi instance configured with the Genesis Token Launch program, you're ready to start building. Explore the Genesis features:

- **[Launch Pools](/smart-contracts/genesis/launch-pools)** - Token distribution with deposit windows
- **[Presales](/smart-contracts/genesis/presales)** - Pre-deposit collection before trading
- **[Bonding Curves](/smart-contracts/genesis/bonding-curves)** - Immediate trading with automatic price discovery
- **[Raydium Graduation](/smart-contracts/genesis/raydium-graduation)** - Graduate to permanent DEX liquidity
