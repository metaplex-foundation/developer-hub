---
title: JavaScript SDK (Umi)
metaTitle: JavaScript SDK (Umi) | Token Metadata
description: Set up the Metaplex Token Metadata Umi SDK for JavaScript and TypeScript. Install dependencies, configure Umi, create NFTs, and manage digital assets on Solana.
updated: '02-07-2026'
keywords:
  - mpl-token-metadata JavaScript
  - Umi SDK
  - Token Metadata TypeScript
  - Solana NFT SDK
  - create NFT JavaScript
about:
  - JavaScript SDK
  - Umi integration
  - TypeScript development
proficiencyLevel: Beginner
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: What is the Token Metadata Umi SDK?
    a: The Token Metadata Umi SDK (@metaplex-foundation/mpl-token-metadata) is a TypeScript library built on the Umi framework for creating, managing, and interacting with NFTs and fungible tokens on Solana.
  - q: Do I need Umi to use this SDK?
    a: Yes. The SDK is built on the Umi framework, which handles wallet connections, RPC communication, and transaction building. Install both @metaplex-foundation/mpl-token-metadata and @metaplex-foundation/umi-bundle-defaults.
  - q: How do I connect a browser wallet?
    a: Use the @metaplex-foundation/umi-signer-wallet-adapters package with your wallet adapter and call umi.use(walletAdapterIdentity(wallet)).
  - q: What is the difference between the Umi SDK and the Kit SDK?
    a: The Umi SDK uses Metaplex's Umi framework with a plugin-based architecture and fluent API. The Kit SDK uses @solana/kit with a functional API. Both provide the same Token Metadata functionality.
  - q: Can I use this SDK in React or Next.js?
    a: Yes. The SDK works in both browser and Node.js environments. For React, use wallet adapters from @solana/wallet-adapter-react with Umi's wallet adapter identity.
---

The **Umi SDK** (`@metaplex-foundation/mpl-token-metadata`) provides a complete TypeScript/JavaScript interface for interacting with Token Metadata on Solana. Built on the [Umi framework](/dev-tools/umi), it offers a fluent, type-safe API for creating and managing NFTs, fungible tokens, and programmable assets. {% .lead %}

{% callout title="What You'll Learn" %}
- Installing and configuring the Token Metadata Umi SDK
- Setting up Umi with wallet identity
- Creating your first NFT
- Core operations: fetch, update, transfer, burn
- Common errors and troubleshooting
{% /callout %}

## Prerequisites

- **Node.js 18+** or a modern browser with ES modules
- **SOL** for transaction fees (use devnet for testing)

{% quick-links %}
{% quick-link title="API Reference" target="_blank" icon="JavaScript" href="https://mpl-token-metadata-js-docs.vercel.app/" description="Full TypeDoc API documentation for the Umi SDK." /%}
{% quick-link title="NPM Package" target="_blank" icon="JavaScript" href="https://www.npmjs.com/package/@metaplex-foundation/mpl-token-metadata" description="Package on npmjs.com with version history." /%}
{% /quick-links %}

## Installation

Install the Token Metadata SDK and Umi framework:

```bash {% title="Terminal" %}
npm install \
  @metaplex-foundation/umi \
  @metaplex-foundation/umi-bundle-defaults \
  @solana/web3.js@1 \
  @metaplex-foundation/mpl-token-metadata
```

For metadata uploads, add an uploader plugin:

```bash {% title="Terminal" %}
npm install @metaplex-foundation/umi-uploader-irys
```

## Setup

Create and configure an Umi instance with the Token Metadata plugin:

```ts {% title="setup-umi.ts" %}
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';

// Create Umi instance with the Token Metadata plugin
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplTokenMetadata());
```

### Connecting a Wallet

{% totem %}
{% totem-accordion title="Using a Keypair" %}

```ts {% title="keypair-identity.ts" %}
import { keypairIdentity } from '@metaplex-foundation/umi';

// From a secret key array
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secretKey));
umi.use(keypairIdentity(keypair));
```

{% /totem-accordion %}
{% totem-accordion title="Loading a Keypair from File (Node.js)" %}

```ts {% title="load-keypair.ts" %}
import { keypairIdentity } from '@metaplex-foundation/umi';
import { readFileSync } from 'fs';

const secretKey = JSON.parse(
  readFileSync('/path/to/keypair.json', 'utf-8')
);
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secretKey));
umi.use(keypairIdentity(keypair));
```

{% /totem-accordion %}
{% totem-accordion title="Using Wallet Adapter (Browser)" %}

```ts {% title="browser-wallet.ts" %}
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';

// With wallet adapter (React)
umi.use(walletAdapterIdentity(wallet));
```

{% /totem-accordion %}
{% /totem %}

## Quick Start: Create an NFT

```ts {% title="create-nft.ts" %}
import { generateSigner, percentAmount } from '@metaplex-foundation/umi';
import { createNft } from '@metaplex-foundation/mpl-token-metadata';

// Generate a new mint keypair
const mint = generateSigner(umi);

// Create an NFT
await createNft(umi, {
  mint,
  name: 'My NFT',
  uri: 'https://example.com/my-nft.json',
  sellerFeeBasisPoints: percentAmount(5.5),
}).sendAndConfirm(umi);

console.log('NFT created:', mint.publicKey);
```

## Core Operations

### Fetch an Asset

```ts {% title="fetch-asset.ts" %}
import { fetchDigitalAsset } from '@metaplex-foundation/mpl-token-metadata';

const asset = await fetchDigitalAsset(umi, mintAddress);

console.log('Name:', asset.metadata.name);
console.log('URI:', asset.metadata.uri);
console.log('Seller Fee:', asset.metadata.sellerFeeBasisPoints);
```

### Update an Asset

```ts {% title="update-asset.ts" %}
import { updateV1 } from '@metaplex-foundation/mpl-token-metadata';

await updateV1(umi, {
  mint: mintAddress,
  data: { ...asset.metadata, name: 'Updated Name' },
}).sendAndConfirm(umi);
```

### Transfer an Asset

```ts {% title="transfer-asset.ts" %}
import { transferV1 } from '@metaplex-foundation/mpl-token-metadata';

await transferV1(umi, {
  mint: mintAddress,
  destinationOwner: recipientAddress,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi);
```

### Burn an Asset

```ts {% title="burn-asset.ts" %}
import { burnV1 } from '@metaplex-foundation/mpl-token-metadata';

await burnV1(umi, {
  mint: mintAddress,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi);
```

See the [Features](/smart-contracts/token-metadata/mint) section for detailed documentation on each operation.

## Common Errors

### `Account does not exist`

The mint address doesn't exist on-chain. Verify the address is correct and you're connected to the right network (devnet vs mainnet).

### `Invalid authority`

You're not authorized to perform this action. Check that:
- You own the asset (for transfers, burns)
- You're the update authority (for updates)
- You have the required delegate permission

### `Insufficient funds`

Your wallet needs more SOL. Fund it on devnet with:

```bash
solana airdrop 1 <WALLET_ADDRESS> --url devnet
```

## Quick Reference

| Function | Purpose |
|----------|---------|
| `createNft()` | Create a new NFT with Master Edition |
| `createFungible()` | Create a fungible token |
| `createProgrammableNft()` | Create a programmable NFT (pNFT) |
| `fetchDigitalAsset()` | Fetch asset by mint address |
| `updateV1()` | Update asset metadata |
| `transferV1()` | Transfer asset ownership |
| `burnV1()` | Burn an asset |
| `verifyCollectionV1()` | Verify collection membership |
| `verifyCreatorV1()` | Verify creator signature |
| `delegateV1()` | Delegate authority |
| `lockV1()` | Lock an asset |
| `unlockV1()` | Unlock an asset |

### Program ID

| Network | Address |
|---------|---------|
| Mainnet | `metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s` |
| Devnet | `metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s` |

## Next Steps

- [Creating & Minting](/smart-contracts/token-metadata/mint) — Detailed minting guide for all token types
- [Token Standards](/smart-contracts/token-metadata/token-standard) — Understand the different asset types
- [Programmable NFTs](/smart-contracts/token-metadata/pnfts) — Learn about pNFTs and authorization rules
- [Umi Framework](/dev-tools/umi) — Deep dive into the Umi framework
