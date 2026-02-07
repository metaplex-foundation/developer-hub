---
title: How to Add Metadata to a Solana Token
metaTitle: How to Add Metadata to a Solana Token | Guides
description: Learn how to add Metadata to an already existing Solana token.
created: '10-01-2024'
updated: '10-01-2024'
---

This guide will take you through adding metadata to an already initialized Solana Token (SPL Token) using the Metaplex Token Metadata protocol.

{% callout %}
It is recommended to use the available [create helper](https://developers.metaplex.com/token-metadata/mint#create-helpers) functions to create and initialize your token instead of doing so separately. If you are looking on how to do this, check out this guide instead [`How to create a Solana Token`](https://developers.metaplex.com/guides/javascript/how-to-create-a-solana-token).

{% /callout %}

## Prerequisite

- Code Editor of your choice (recommended Visual Studio Code)
- Node 18.x.x or above.

## Initial Setup

This guide assumes that you already have an SPL token initialized for which you'd like to add metadata to. You might need to modify and move functions around to suit your needs.

## Initializing

Start by initializing a new empty project using a JS/TS package manager (npm, yarn, pnpm, bun, deno) of your choice.

```bash
npm init -y
```

### Required Packages

Install the required packages for this guide.

{% packagesUsed packages=["umi", "umiDefaults" ,"tokenMetadata"] type="npm" /%}

```bash
npm i @metaplex-foundation/umi
```

```bash
npm i @metaplex-foundation/umi-bundle-defaults
```

```bash
npm i @metaplex-foundation/mpl-token-metadata
```

### Imports and Wrapper Function

We will list the necessary imports and our wrapper function,

1. `addMetadata`

```typescript
import {
 createV1,
 findMetadataPda,
 mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import { generateSigner, signerIdentity, sol } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { base58 } from "@metaplex-foundation/umi/serializers";

/// 
/// instantiate umi 
///


// Add metadata to an existing SPL token wrapper function
async function addMetadata() {
 ///
 ///
 ///  code will go in here
 ///
 ///
}

// run the function
addMetadata();
```

## Setting up Umi

This example is going to run through setting up Umi with a `generatedSigner()`. If you wish to set up a wallet or signer differently you can check out the [**Connecting to Umi**](/dev-tools/umi/getting-started) guide.

You can place the Umi instantiation code inside or outside the code blocks, but to reduce code duplication, we will keep it outside.

### Generating a New Wallet

```ts
const umi = createUmi("https://api.devnet.solana.com")
 .use(mplTokenMetadata())
 .use(mplToolbox());

// Generate a new keypair signer.
const signer = generateSigner(umi);

// Tell umi to use the new signer.
umi.use(signerIdentity(signer));

// Airdrop 2 SOL to the identity
// if you end up with a 429 too many requests error, you may have to use
// a different rpc other than the free default one supplied.
await umi.rpc.airdrop(umi.identity.publicKey, sol(2));
```

### Use an Existing Wallet Stored Locally

```ts
const umi = createUmi("https://api.devnet.solana.com")
 .use(mplTokenMetadata())
 .use(mplToolbox());

// You will need to use fs and navigate the filesystem to
// load the wallet you wish to use via relative pathing.
const walletFile = fs.readFileSync('./keypair.json')

// Convert your walletFile onto a keypair.
let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(walletFile));

// Load the keypair into umi.
umi.use(keypairIdentity(umiSigner));
```

## Adding Metadata

Adding metadata is also as simple as creating an SPL token. We will utilize the `createV1` helper method from the `mpl-token-metadata` library.

Also note that this guide assumes that you already had your off-chain token metadata prepared beforehand. We will need the name, off-chain uri address and symbol

```json
name: "Solana Gold",
symbol: "GOLDSOL",
uri: "https://raw.githubusercontent.com/solana-developers/program-examples/new-examples/tokens/tokens/.assets/spl-token.json",
```

```typescript
// Sample Metadata for our Token
const tokenMetadata = {
 name: "Solana Gold",
 symbol: "GOLDSOL",
 uri: "https://raw.githubusercontent.com/solana-developers/program-examples/new-examples/tokens/tokens/.assets/spl-token.json",
};

// Add metadata to an existing SPL token wrapper function
async function addMetadata() {
    const mint = publicKey("YOUR_TOKEN_MINT_ADDRESS");

    // derive the metadata account that will store our metadata data onchain
 const metadataAccountAddress = await findMetadataPda(umi, {
  mint: mint,
 });

   // add metadata to our already initialized token using `createV1` helper 
 const tx = await createV1(umi, {
  mint,
  authority: umi.identity,
  payer: umi.identity,
  updateAuthority: umi.identity,
  name: tokenMetadata.name,
  symbol: tokenMetadata.symbol,
  uri: tokenMetadata.uri,
  sellerFeeBasisPoints: percentAmount(5.5), // 5.5%
  tokenStandard: TokenStandard.Fungible,
 }).sendAndConfirm(umi);

 let txSig = base58.deserialize(tx.signature);
 console.log(`https://explorer.solana.com/tx/${txSig}?cluster=devnet`);
}
```

Nullable fields like creators have been left out as they might not be as necessary for SPL tokens compared to Non Fungibles.

Take note of the mint address, If you will call the functions at different instances, make sure to set the address of the `mint` field in the `findMetadataPda` function as `generateSigner` will return a new keypair upon each call.

## Full Code Example

```typescript
import {
 createV1,
 findMetadataPda,
 mplTokenMetadata,
 TokenStandard
} from "@metaplex-foundation/mpl-token-metadata";
import { mplToolbox } from "@metaplex-foundation/mpl-toolbox";
import {
  generateSigner,
  percentAmount,
  publicKey,
  signerIdentity,
  sol,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { base58 } from "@metaplex-foundation/umi/serializers";

const umi = createUmi("https://api.devnet.solana.com")
 .use(mplTokenMetadata())
 .use(mplToolbox());

// Generate a new keypair signer.
const signer = generateSigner(umi);

// Tell umi to use the new signer.
umi.use(signerIdentity(signer));

// your SPL Token mint address
const mint = publicKey("YOUR_TOKEN_MINT_ADDRESS");
 

// Sample Metadata for our Token
const tokenMetadata = {
 name: "Solana Gold",
 symbol: "GOLDSOL",
 uri: "https://raw.githubusercontent.com/solana-developers/program-examples/new-examples/tokens/tokens/.assets/spl-token.json",
};

// Add metadata to an existing SPL token wrapper function
async function addMetadata() {
 // Airdrop 2 SOL to the identity
    // if you end up with a 429 too many requests error, you may have to use
    // a different rpc other than the free default one supplied.
    await umi.rpc.airdrop(umi.identity.publicKey, sol(2));

    // derive the metadata account that will store our metadata data onchain
 const metadataAccountAddress = await findMetadataPda(umi, {
  mint: mint,
 });

 const tx = await createV1(umi, {
  mint,
  authority: umi.identity,
  payer: umi.identity,
  updateAuthority: umi.identity,
  name: tokenMetadata.name,
  symbol: tokenMetadata.symbol,
  uri: tokenMetadata.uri,
  sellerFeeBasisPoints: percentAmount(5.5), // 5.5%
  tokenStandard: TokenStandard.Fungible,
 }).sendAndConfirm(umi);

 let txSig = base58.deserialize(tx.signature);
 console.log(`https://explorer.solana.com/tx/${txSig}?cluster=devnet`);
}

// run the function
addMetadata();
```

## What's Next?

This guide helped you to add metadata to a Solana Token, from here you can head over to the [Token Metadata Program](/smart-contracts/token-metadata) and check out helper functions that initialize and add metadata to your token in one step, working with non-fungibles and other various ways to interact with the Token Metadata program.
