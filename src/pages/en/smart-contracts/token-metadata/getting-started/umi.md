---
title: Getting Started with Umi SDK
metaTitle: Umi SDK | Token Metadata
description: Get started with NFTs using the Metaplex Token Metadata Umi SDK.
---

The **Umi SDK** (`@metaplex-foundation/mpl-token-metadata`) is built on Metaplex's Umi framework and provides a fluent API for interacting with Token Metadata. {% .lead %}

## Installation

```sh
npm install \
  @metaplex-foundation/umi \
  @metaplex-foundation/umi-bundle-defaults \
  @solana/web3.js@1 \
  @metaplex-foundation/mpl-token-metadata
```

## Setup

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';

// Create Umi instance with the Token Metadata plugin
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplTokenMetadata());
```

### Connecting a Wallet

{% totem %}
{% totem-accordion title="Using a Keypair" %}

```ts
import { keypairIdentity } from '@metaplex-foundation/umi';

// From a secret key array
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secretKey));
umi.use(keypairIdentity(keypair));
```

{% /totem-accordion %}
{% totem-accordion title="Using Wallet Adapter" %}

```ts
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';

// With wallet adapter (React)
umi.use(walletAdapterIdentity(wallet));
```

{% /totem-accordion %}
{% /totem %}

## Creating an NFT

```ts
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

## Fetching an NFT

```ts
import { fetchDigitalAsset } from '@metaplex-foundation/mpl-token-metadata';

const asset = await fetchDigitalAsset(umi, mintAddress);

console.log('Name:', asset.metadata.name);
console.log('URI:', asset.metadata.uri);
console.log('Seller Fee:', asset.metadata.sellerFeeBasisPoints);
```

## Helpful Links

- [Umi Framework Documentation](https://github.com/metaplex-foundation/umi)
- [GitHub Repository](https://github.com/metaplex-foundation/mpl-token-metadata)
- [NPM Package](https://www.npmjs.com/package/@metaplex-foundation/mpl-token-metadata)
- [API References](https://mpl-token-metadata.typedoc.metaplex.com/)
