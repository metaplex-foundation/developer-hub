---
title: Getting Started
metaTitle: Getting Started | Umi
description: A Javascript Framework for Solana.
---

## Umi Installation

To use Umi to build applications, you'll need to install Umi and the external plugins you want to use. Alternatively, you can install the default bundle that includes a set of plugins that's suitable for most use cases. 

**Note**: for now the default bundle relies on web3.js for some of the interfaces so we have to install it as well.

### Required Packages

{% packagesUsed packages=["umi", "umiDefaults", "@solana/web3.js"] type="npm" /%}

To install them, use the following commands:

```
npm i @metaplex-foundation/umi 
```

```
npm i @metaplex-foundation/umi-bundle-defaults 
```

```
npm i @metaplex-foundation/@solana/web3.js
```

### For library authors

Library authors that want to use Umi's interfaces to drastically reduce their dependencies only need to install the main Umi library. It is highly recommended to install it as a peer dependency to ensure the end-user does not end up with multiple versions of the Umi library.

```
npm i @metaplex-foundation/umi --save-peer
```

You can then use Umi's `Context` object or a subset of it to inject any interface you need in your functions.

{% totem %}

{% totem-accordion title="Example" %}

```ts
import type { Context, PublicKey } from '@metaplex-foundation/umi';
import { u32 } from '@metaplex-foundation/umi/serializers';

export async function myFunction(
  context: Pick<Context, 'rpc'>, // <-- Inject the interfaces you need.
  publicKey: PublicKey
): number {
  const rawAccount = await context.rpc.getAccount(publicKey);
  if (!rawAccount.exists) return 0;
  return u32().deserialize(rawAccount.data)[0];
}
```

{% /totem-accordion %}

{% /totem %}

### For testing

Also note that Umi comes with a testing bundle that can help both end-users and library authors to test their code. For instance, it includes a `MockStorage` implementation used for both the `UploaderInterface` and the `DownloaderInterface` so you can reliably test your code without having to rely on a real storage provider.

```
npm i @metaplex-foundation/umi
```

```
npm i @metaplex-foundation/umi-bundle-tests
```

## Umi Basics

In this section, we'll cover the essential steps to get started with Umi:
- [Creating Umi and Connecting to an RPC](/umi/getting-started#connecting-to-an-rpc)
- [Connecting a Wallet](/umi/getting-started#connecting-a-wallet)
- [Registering Programs and Clients](/umi/getting-started#registering-programs-and-clients)

### Connecting to an RPC

Solana has different clusters (e.g., Mainnet-beta, Devnet, Testnet, ...) that serve various purposes, each with dedicated API nodes to handle RPC requests.

Connecting Umi to a cluster of choice is is as simple as creating an umi instance since the RPC endpoint is passed as the first argument. If you're connecting to `Mainnet`, it's recommended to use a dedicated RPC endpoint from a Solana RPC provider instead of the public endpoint (https://api.mainnet-beta.solana.com) due to its limitations.

To create a Umi instance, import the `createUmi` function and provide your RPC endpoint. Optionally, you can also specify the commitment level as the second argument.

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'

const umi = createUmi('<RPC-Endpoint>', '<Commitment-Level>')
```

Here are all the public endpoints for the different clusters:

{% totem %}

{% totem-accordion title="Mainnet-beta" %}

```ts
const umi = createUmi('https://api.mainnet-beta.solana.com')
```

{% /totem-accordion %}

{% totem-accordion title="Devnet" %}

```ts
const umi = createUmi('https://api.devnet.solana.com')
```

{% /totem-accordion %}

{% totem-accordion title="Testnet" %}

```ts
const umi = createUmi('https://api.testnet.solana.com')
```

{% /totem-accordion %}

{% totem-accordion title="Localnet" %}

```ts
const umi = createUmi('http://127.0.0.1:8899')
```

{% /totem-accordion %}

{% /totem %}

### Connecting a Wallet

When setting up Umi, you'll need to use or generate a wallet in order to send transactions. To do so, you can create a new wallet for testing, import an existing wallet from the filesystem, or use a walletAdapter for web-based dApps.

{% totem %}

{% totem-accordion title="With a New Wallet" %}

```ts
import { generateSigner, signerIdentity } from '@metaplex-foundation/umi'

const umi = createUmi('https://api.devnet.solana.com')

// Generate a new keypair signer.
const signer = generateSigner(umi)

// Tell Umi to use the new signer.
umi.use(signerIdentity(signer))
```

{% /totem-accordion %}

{% totem-accordion title="With an Existing Wallet" %}

```ts
import { generateSigner, createSignerFromKeypair } from '@metaplex-foundation/umi'

const umi = createUmi('https://api.devnet.solana.com')

// Use fs to navigate the filesystem till you reach
// the wallet you wish to use via relative pathing.
const walletFile = fs.readFileSync(
  path.join(__dirname, './keypair.json')
)

// Usually Keypairs are saved as Uint8Array, so you  
// need to transform it into a usable keypair.  
let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(walletFile));

// Before Umi can use this Keypair you need to generate 
// a Signer type with it.  
const signer = createSignerFromKeypair(umi, keypair);

// Tell Umi to use the new signer.
umi.use(signerIdentity(walletFile))
```

{% /totem-accordion %}

{% totem-accordion title="With the Wallet Adapter" %}

```ts
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters'
import { useWallet } from '@solana/wallet-adapter-react'

const wallet = useWallet()

const umi = createUmi('https://api.devnet.solana.com')

// Register Wallet Adapter to Umi
umi.use(walletAdapterIdentity(wallet))
```

{% /totem-accordion %}

{% /totem %}

**Note**: The `Umi` interface stores two instances of `Signer`: The `identity` using the app and the `payer` paying for transaction and storage fees. By default, the `signerIdentity` method will also update the `payer` attribute since, in most cases, the identity is also the payer. 

If you want to learn more, go to the [Umi Context Interfaces Paragraph](/umi/interfaces#the-context-interface) 

### Registering Programs and Clients

In some cases, Umi requires you to specify the programs or clients you want to use (e.g, when minting a Core Asset, you'll need to tell Umi to use the `Core` program). You can do this by calling the `.use()` method on your Umi instance and passing in the client.

Here’s how to register the `mpl-token-metadata` client with Umi:

```ts
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'

const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(mplTokenMetadata())
```

**Note**: You can also chain `.use()` calls to register multiple clients like this:

```ts
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { mplCandyMachine } from '@metaplex-foundation/mpl-candy-machine'

const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(mplTokenMetadata())
  .use(mplCandyMachine())
```
