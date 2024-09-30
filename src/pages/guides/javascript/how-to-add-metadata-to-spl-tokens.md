---
title: How to Add Metadata to a Solana Token
metaTitle: How to Add Metadata to a Solana Token | Guides
description: Learn how to add Metadata to an already existing Solana token.
created: '10-01-2024'
updated: '10-01-2024'
---

This guide will take you through adding metadata to an already initialized Solana Token (SPL Token) using the Metaplex Token Metadata protocol.

## Prerequisite

- Code Editor of your choice (recommended Visual Studio Code)
- Node 18.x.x or above.

## Initial Setup

This guide will start by first initializing an SPL token without any metadata and finish of with adding metadata to this initialized token with JavaScript. You might need to modify and move functions around to suite your needs. 

## Initializing

Start by initializing a new empty project using a JS/TS package manager (npm, yarn, pnpm, bun) of your choice.

```bash
npm init -y
```

### Required Packages

Install the required pacakges for this guide.

{% packagesUsed packages=["umi", "umiDefaults" ,"tokenMetadata", "mpl-toolbox"] type="npm" /%}

```bash
npm i @metaplex-foundation/umi
```

```bash
npm i @metaplex-foundation/umi-bundle-defaults
```

```bash
npm i @metaplex-foundation/mpl-token-metadata
```

```bash
npm i @metaplex-foundation/mpl-toolbox
```

### Imports and Wrapper Function

We will list the necessary imports and create two wrappers functions,

1. `createSPLToken` _(Optional, if you do not have an SPL token already)_

2. `addMetadata`

```typescript
import {
	createMetadataAccountV3,
	findMetadataPda,
	mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import { createMint, mplToolbox } from "@metaplex-foundation/mpl-toolbox";
import { generateSigner, signerIdentity, sol } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { base58 } from "@metaplex-foundation/umi/serializers";

/// 
/// instantiate umi 
///

// Create SPL token wrapper function
async function createSPLToken() {
	///
	///
	///  SPL token initialization code will go here
	///
	///
}

// run the function
createSPLToken();

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

This example is going to run through setting up Umi with a `generatedSigner()`. If you wish to set up a wallet or signer differently you can check out the [**Connecting to Umi**](/umi/connecting-to-umi) guide.

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
// the a different rpc other than the free default one supplied.
await umi.rpc.airdrop(umi.identity.publicKey, sol(2));
```

### Use an Existing Wallet Stored Locally

```ts
const umi = createUmi("https://api.devnet.solana.com")
	.use(mplTokenMetadata())
	.use(mplToolbox());

// You will need to us fs and navigate the filesystem to
// load the wallet you wish to use via relative pathing.
const walletFile = const imageFile = fs.readFileSync('./keypair.json')

// Convert your walletFile onto a keypair.
let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(walletFile));

// Load the keypair into umi.
umi.use(keypairIdentity(umiSigner));
```

## Creating the Token

This section is can be skipped if you already have an SPL token initialized, otherwise let's update the `createSPLToken` wrapper function. 

We will use the `createMint` method from `mpl-toolbox` library to initialize an SPL token mint. We will also need to initialize a new keypair for the mint account.

```typescript
// initialize a new keypair for our mint account
const mint = generateSigner(umi);

// Create SPL token wrapper function
async function createSPLToken() {
	let tx = await createMint(umi, {
		mint,
		decimals: 6,
		mintAuthority: umi.identity.publicKey,
		freezeAuthority: null,
	}).sendAndConfirm(umi);

	let txSig = base58.deserialize(tx.signature);

	console.log("token mint address -> ", mint.publicKey);
	console.log(`https://explorer.solana.com/tx/${txSig}?cluster=devnet`);
}
```

Calling the function will initialize a new SPL token, but it won't have any metadata associated with it.

## Adding Metadata

Adding metadata is also as simple as creating the token, we will utilize the `createMetadataAccountV3` method from the `mpl-token-metadata` library.

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
    // derive the metadata account that will store our metadata data onchain
	const metadataAccountAddress = await findMetadataPda(umi, {
		mint: mint.publicKey,
	});

   // add metadata to our already initialized token using `createMetadataAccountV3` 
   // from the token metadata program
	const tx = await createMetadataAccountV3(umi, {
		metadata: metadataAccountAddress,
		mint: mint.publicKey,
		mintAuthority: umi.identity,
		payer: umi.identity,
		updateAuthority: umi.identity,
		data: {
			creators: null,
			name: tokenMetadata.name,
			symbol: tokenMetadata.symbol,
			uri: tokenMetadata.uri,
			sellerFeeBasisPoints: 0,
			collection: null,
			uses: null,
		},
		collectionDetails: null,
		isMutable: true,
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
	createMetadataAccountV3,
	findMetadataPda,
	mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import { createMint, mplToolbox } from "@metaplex-foundation/mpl-toolbox";
import { generateSigner, signerIdentity, sol } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { base58 } from "@metaplex-foundation/umi/serializers";

const umi = createUmi("https://api.devnet.solana.com")
	.use(mplTokenMetadata())
	.use(mplToolbox());

// Generate a new keypair signer.
const signer = generateSigner(umi);

// Tell umi to use the new signer.
umi.use(signerIdentity(signer));

// Airdrop 2 SOL to the identity
// if you end up with a 429 too many requests error, you may have to use
// the a different rpc other than the free default one supplied.
await umi.rpc.airdrop(umi.identity.publicKey, sol(2));

// initialize a new keypair for our mint account
const mint = generateSigner(umi);

// Create SPL token wrapper function
async function createSPLToken() {
	let tx = await createMint(umi, {
		mint,
		decimals: 6,
		mintAuthority: umi.identity.publicKey,
		freezeAuthority: null,
	}).sendAndConfirm(umi);

	let txSig = base58.deserialize(tx.signature);

	console.log("token mint address -> ", mint.publicKey);
	console.log(`https://explorer.solana.com/tx/${txSig}?cluster=devnet`);
}

// run the function
createSPLToken();

// Sample Metadata for our Token
const tokenMetadata = {
	name: "Solana Gold",
	symbol: "GOLDSOL",
	uri: "https://raw.githubusercontent.com/solana-developers/program-examples/new-examples/tokens/tokens/.assets/spl-token.json",
};

// Add metadata to an existing SPL token wrapper function
async function addMetadata() {
    // derive the metadata account that will store our metadata data onchain
	const metadataAccountAddress = await findMetadataPda(umi, {
		mint: mint.publicKey,
	});

	const tx = await createMetadataAccountV3(umi, {
		metadata: metadataAccountAddress,
		mint: mint.publicKey,
		mintAuthority: umi.identity,
		payer: umi.identity,
		updateAuthority: umi.identity,
		data: {
			creators: null,
			name: tokenMetadata.name,
			symbol: tokenMetadata.symbol,
			uri: tokenMetadata.uri,
			sellerFeeBasisPoints: 0,
			collection: null,
			uses: null,
		},
		collectionDetails: null,
		isMutable: true,
	}).sendAndConfirm(umi);

	let txSig = base58.deserialize(tx.signature);
	console.log(`https://explorer.solana.com/tx/${txSig}?cluster=devnet`);
}

// run the function
addMetadata();
```

## What's Next?

This guide helped you to add metadata to a Solana Token, from here you can head over to the [Token Metadata Program](/token-metadata) and check out helper functions that initialize and add metadata to your token in one step, working with non-fungibles and other various ways to interact with the Token Metadata program.
