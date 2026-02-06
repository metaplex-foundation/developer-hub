---
title: Airdrops - How to Mint NFTs to another Wallet
metaTitle: Airdrops - Mint from Candy Machine to a different wallet | Candy Machine
description: A developer guide on how to mint NFTs from a Candy Machine to a different wallet address. Useful for airdrops and similar use cases.
---

This guide explains how to mint NFTs from a Candy Machine to different wallet addresses - a common requirement for airdrops, giveaways, or distributing NFTs to multiple recipients.

## Prerequisites

- Basic understanding of Solana and NFTs
- A funded wallet for transaction fees

**either**

- Sugar CLI (v2.0.0 or higher)

**or**

- Node.js 16.0 or higher
- @metaplex-foundation/mpl-token-metadata
- @metaplex-foundation/mpl-toolbox
- @metaplex-foundation/umi-bundle-defaults
- @metaplex-foundation/mpl-candy-machine

Minting NFTs to another wallet can be particularly useful for airdrops, giveaways, or distributing NFTs to multiple recipients. This guide will walk you through the process of minting NFTs from a Candy Machine to a different wallet address. It is important to note that the person initiating the minting process will bear the minting cost. Therefore, it is often more cost-effective to have the recipient claim the NFT themselves.

{% callout type="note" title="Important Consideration" %}

- Minting to another wallet can be expensive. You might want to consider using a claim mechanic instead, e.g. using [allowlist](/smart-contracts/candy-machine/guards/allow-list) or the [NFT Gate](/smart-contracts/candy-machine/guards/nft-gate) Guard.
- There are different tools available for Candy Machines with or without guards. Minting without guards is generally easier.
{% /callout %}

There are two approaches described in this guide:

1. Mint using [Sugar CLI](#using-sugar-cli). No Coding required!
2. Mint using [Javascript](#using-typescript-and-metaplex-foundation-mpl-candy-machine)

## Using Sugar CLI

The Sugar CLI provides two main commands for minting NFTs to other wallets:

1. `sugar mint` to mint to *one* specific wallet
2. `sugar airdrop` to mint to *multiple* wallets

Prerequisite to allow minting through sugar is to have your Candy Machine created **without guard attached**. To create a Candy Machine with sugar you can follow the first steps of [this](https://developers.metaplex.com/candy-machine/guides/create-an-nft-collection-on-solana-with-candy-machine) Guide. If your Candy Machine has guards attached they can be removed using `sugar guard remove`.

### Single Recipient Minting with `sugar mint`

To mint NFTs to a single recipient wallet, use the `sugar mint` command with these parameters:

- `--receiver <WALLET>`: Specify the recipient's wallet address
- `--number <NUMBER>`: (Optional) Specify how many NFTs to mint to that wallet

**Example**:

To mint 3 NFTs to the wallet `Tes1zkZkXhgTaMFqVgbgvMsVkRJpq4Y6g54SbDBeKVV` one would call:

```sh
sugar mint --receiver Tes1zkZkXhgTaMFqVgbgvMsVkRJpq4Y6g54SbDBeKVV -n 3 --candy-machine 11111111111111111111111111111111
```

### Multiple Recipients with `sugar airdrop`

To mint NFTs to multiple wallets in a single command `sugar airdrop` can be used. It requires a file containing the addresses and the amount of NFTs each wallet should receive. A file like this could for example be created by snapshotting the owners of NFTs in a specific collection and adding their wallets and NFTs they hold into a file in the following format:

```json
{
  "11111111111111111111111111111111": 3,
  "22222222222222222222222222222222": 1
}
```

By default sugar expects this file to be called `airdrop_list.json` but if if you wish to use a file of which has a different file name you can pass the file name in using
`--airdrop-list`.

**Example**:
To execute this airdrop the following command can be used

```sh
sugar airdrop --candy-machine 11111111111111111111111111111111
```

## Using Typescript and `@metaplex-foundation/mpl-candy-machine`

In this section the code Snippets for the mint functions in Javascript are shown. Both examples also include a full code snippet where a Candy Machine is created and afterwards a single NFT is minted to a specific wallet. To implement a full blown airdrop script one needs to implement loops and error handling around the mint function.

When minting to another wallet using Typescript, there are two main approaches depending on whether your Candy Machine uses guards:

### Mint without Guards

For Candy Machines without guards, use `mintFromCandyMachineV2`. This function allows you to directly specify the recipient as the `nftOwner`.

```js
const candyMachineAccount = await fetchCandyMachine(umi, publicKey("CM Address"));

const recipient = publicKey('Tes1zkZkXhgTaMFqVgbgvMsVkRJpq4Y6g54SbDBeKVV')
const nftMint = generateSigner(umi)
const mintTx = await transactionBuilder()
  .add(setComputeUnitLimit(umi, { units: 800_000 }))
  .add(createMintWithAssociatedToken(umi, { mint: nftMint, owner: recipient }))
  .add(
    mintFromCandyMachineV2(umi, {
      candyMachine: candyMachine.publicKey,
      mintAuthority: umi.identity,
      nftOwner: recipient,
      nftMint,
      collectionMint: candyMachineAccount.collectionMint,
      collectionUpdateAuthority: candyMachineAccount.authority,
    })
  )
  .sendAndConfirm(umi, {
    confirm: { commitment: 'finalized' },
  })
```

{% totem %}
{% totem-accordion title="Full Code Example" %}

```js
import {
  addConfigLines,
  createCandyMachineV2,
  fetchCandyMachine,
  mintFromCandyMachineV2,
  mplCandyMachine,
} from "@metaplex-foundation/mpl-candy-machine";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  generateSigner,
  keypairIdentity,
  percentAmount,
  publicKey,
  sol,
  some,
  transactionBuilder,
} from "@metaplex-foundation/umi";
import {
  createNft,
  TokenStandard,
} from "@metaplex-foundation/mpl-token-metadata";
import { base58 } from "@metaplex-foundation/umi-serializers";
import {
  createMintWithAssociatedToken,
  setComputeUnitLimit,
} from "@metaplex-foundation/mpl-toolbox";

/**
 * This script demonstrates how to create a basic Candy Machine without guards
 * and mint an NFT to a recipient wallet.
 */

// Configuration
const RECIPIENT_ADDRESS = "Tes1zkZkXhgTaMFqVgbgvMsVkRJpq4Y6g54SbDBeKVV";
const RPC_ENDPOINT = "https://api.devnet.solana.com";

(async () => {
  try {
    // --- Setup ---
    
    // Initialize connection to Solana
    const umi = createUmi(RPC_ENDPOINT).use(mplCandyMachine());
    const recipient = publicKey(RECIPIENT_ADDRESS);

    // Create and fund a test wallet
    const walletSigner = generateSigner(umi);
    umi.use(keypairIdentity(walletSigner));
    console.log("Funding test wallet with devnet SOL...");
    await umi.rpc.airdrop(walletSigner.publicKey, sol(0.1), {
      commitment: "finalized",
    });

    // --- Create Collection NFT ---
    
    const collectionMint = generateSigner(umi);
    console.log("Creating collection NFT...");
    console.log("Collection Address:", collectionMint.publicKey);

    const createNftTx = await createNft(umi, {
      mint: collectionMint,
      authority: umi.identity,
      name: "My Collection NFT",
      uri: "https://example.com/path/to/some/json/metadata.json",
      sellerFeeBasisPoints: percentAmount(9.99, 2),
      isCollection: true,
      collectionDetails: {
        __kind: 'V1',
        size: 0,
      },
    }).sendAndConfirm(umi, {
      confirm: { commitment: "finalized" },
    });
    console.log("Collection Created:", base58.deserialize(createNftTx.signature)[0]);

    // --- Create Candy Machine ---

    console.log("Creating basic Candy Machine...");
    const candyMachine = generateSigner(umi);
    
    const createCandyMachineV2Tx = await (
      await createCandyMachineV2(umi, {
        candyMachine,
        tokenStandard: TokenStandard.NonFungible,
        collectionMint: collectionMint.publicKey,
        collectionUpdateAuthority: umi.identity,
        itemsAvailable: 2,
        sellerFeeBasisPoints: percentAmount(1.23),
        creators: [
          {
            address: umi.identity.publicKey,
            verified: false,
            percentageShare: 100,
          },
        ],
        configLineSettings: some({
          prefixName: "My NFT #",
          nameLength: 3,
          prefixUri: "https://example.com/",
          uriLength: 29,
          isSequential: false,
        }),
      })
    )
      .add(
        addConfigLines(umi, {
          candyMachine: candyMachine.publicKey,
          index: 0,
          configLines: [
            { name: "1", uri: "https://example.com/nft1.json" },
            { name: "2", uri: "https://example.com/nft2.json" },
          ],
        })
      )
      .sendAndConfirm(umi, { confirm: { commitment: "finalized" } });
      
    console.log("Candy Machine Created:", base58.deserialize(createCandyMachineV2Tx.signature)[0]);

    // --- Mint NFT ---

    console.log("Minting NFT to recipient...");
    
    // Get latest Candy Machine state
    const candyMachineAccount = await fetchCandyMachine(umi, candyMachine.publicKey);

    // Create mint transaction
    const nftMint = generateSigner(umi);
    const mintTx = await transactionBuilder()
      .add(setComputeUnitLimit(umi, { units: 800_000 }))
      .add(
        createMintWithAssociatedToken(umi, { mint: nftMint, owner: recipient })
      )
      .add(
        mintFromCandyMachineV2(umi, {
          candyMachine: candyMachine.publicKey,
          mintAuthority: umi.identity,
          nftOwner: recipient,
          nftMint,
          collectionMint: candyMachineAccount.collectionMint,
          collectionUpdateAuthority: candyMachineAccount.authority,
        })
      )
      .sendAndConfirm(umi, {
        confirm: { commitment: "finalized" },
      });

    console.log("NFT Minted Successfully!");  
    console.log("Mint Transaction:", base58.deserialize(mintTx.signature)[0]);

  } catch (error) {
    console.error("Failed to execute:", error);
  }
})();

```

{% /totem-accordion  %}
{% /totem %}

### Mint with Guards

For Candy Machines with guards `mintV2` can be used. In this case, you'll need to first create the Token Account and Associated Token Account for the recipient using `createMintWithAssociatedToken`. This allows the recipient to receive the NFT without having to sign the transaction.

```js
const candyMachineAccount = await fetchCandyMachine(umi, publicKey("CM Address"));

const recipient = publicKey('Tes1zkZkXhgTaMFqVgbgvMsVkRJpq4Y6g54SbDBeKVV')
const nftMint = generateSigner(umi)
const mintTx = await transactionBuilder()
  .add(setComputeUnitLimit(umi, { units: 800_000 }))
  .add(createMintWithAssociatedToken(umi, { mint: nftMint, owner: recipient }))
  .add(
    mintV2(umi, {
      candyMachine: candyMachineAccount.publicKey,
      nftMint,
      token: findAssociatedTokenPda(umi, {
        mint: nftMint.publicKey,
        owner: recipient,
      }),
      collectionMint: candyMachineAccount.collectionMint,
      collectionUpdateAuthority: candyMachineAccount.authority,
      tokenStandard: TokenStandard.NonFungible,
      mintArgs: {
        mintLimit: some({ // The guards that require mintArgs have to be specified here 
          id: 1,
        }),
      },
    })
  )
  .sendAndConfirm(umi, {
    confirm: { commitment: 'finalized' },
  })
```

{% totem %}
{% totem-accordion title="Full Code Example" %}

```js
import {
  addConfigLines,
  create,
  fetchCandyMachine,
  mintV2,
  mplCandyMachine,
} from "@metaplex-foundation/mpl-candy-machine";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  generateSigner,
  keypairIdentity,
  percentAmount,
  publicKey,
  sol,
  some,
  transactionBuilder,
} from "@metaplex-foundation/umi";
import {
  createNft,
  TokenStandard,
} from "@metaplex-foundation/mpl-token-metadata";
import { base58 } from "@metaplex-foundation/umi-serializers";
import {
  createMintWithAssociatedToken,
  findAssociatedTokenPda,
  setComputeUnitLimit,
} from "@metaplex-foundation/mpl-toolbox";

/**
 * This script demonstrates how to create a Candy Machine with a mint limit guard
 * and mint an NFT to a recipient wallet.
 */

// Configuration
const RECIPIENT_ADDRESS = "Tes1zkZkXhgTaMFqVgbgvMsVkRJpq4Y6g54SbDBeKVV";
const RPC_ENDPOINT = "ENDPOINT";

(async () => {
  try {
    // --- Setup ---
    
    // Initialize connection to Solana
    const umi = createUmi(RPC_ENDPOINT).use(mplCandyMachine());
    const recipient = publicKey(RECIPIENT_ADDRESS);

    // Create and fund a test wallet
    const walletSigner = generateSigner(umi);
    umi.use(keypairIdentity(walletSigner));
    console.log("Funding test wallet with devnet SOL...");
    await umi.rpc.airdrop(walletSigner.publicKey, sol(0.1), {
      commitment: "finalized",
    });

    // --- Create Collection NFT ---
    
    const collectionMint = generateSigner(umi);
    console.log("Creating collection NFT...");
    console.log("Collection Address:", collectionMint.publicKey);

    const createNftTx = await createNft(umi, {
      mint: collectionMint,
      authority: umi.identity,
      name: "My Collection NFT",
      uri: "https://example.com/path/to/some/json/metadata.json",
      sellerFeeBasisPoints: percentAmount(9.99, 2),
      isCollection: true,
      collectionDetails: {
        __kind: 'V1',
        size: 0,
      },
    }).sendAndConfirm(umi, {
      confirm: { commitment: "finalized" },
    });
    console.log("Collection Created:", base58.deserialize(createNftTx.signature)[0]);

    // --- Create Candy Machine ---

    console.log("Creating Candy Machine with mint limit guard...");
    const candyMachine = generateSigner(umi);
    
    const createCandyMachineV2Tx = await (
      await create(umi, {
        candyMachine,
        tokenStandard: TokenStandard.NonFungible,
        collectionMint: collectionMint.publicKey,
        collectionUpdateAuthority: umi.identity,
        itemsAvailable: 2,
        sellerFeeBasisPoints: percentAmount(1.23),
        creators: [
          {
            address: umi.identity.publicKey,
            verified: false,
            percentageShare: 100,
          },
        ],
        guards: {
          mintLimit: some({
            id: 1,
            limit: 2,
          }),
        },
        configLineSettings: some({
          prefixName: "My NFT #",
          nameLength: 3,
          prefixUri: "https://example.com/",
          uriLength: 29,
          isSequential: false,
        }),
      })
    )
      .add(
        addConfigLines(umi, {
          candyMachine: candyMachine.publicKey,
          index: 0,
          configLines: [
            { name: "1", uri: "https://example.com/nft1.json" },
            { name: "2", uri: "https://example.com/nft2.json" },
          ],
        })
      )
      .sendAndConfirm(umi, { confirm: { commitment: "finalized" } });
      
    console.log("Candy Machine Created:", base58.deserialize(createCandyMachineV2Tx.signature)[0]);

    // --- Mint NFT ---

    console.log("Minting NFT to recipient...");
    
    // Get latest Candy Machine state
    const candyMachineAccount = await fetchCandyMachine(umi, candyMachine.publicKey);

    // Create mint transaction
    const nftMint = generateSigner(umi);
    const mintTx = await transactionBuilder()
      .add(setComputeUnitLimit(umi, { units: 800_000 }))
      .add(
        createMintWithAssociatedToken(umi, { mint: nftMint, owner: recipient })
      )
      .add(
        mintV2(umi, {
          candyMachine: candyMachineAccount.publicKey,
          nftMint,
          token: findAssociatedTokenPda(umi, {
            mint: nftMint.publicKey,
            owner: recipient,
          }),
          collectionMint: candyMachineAccount.collectionMint,
          collectionUpdateAuthority: candyMachineAccount.authority,
          tokenStandard: TokenStandard.NonFungible,
          mintArgs: {
            mintLimit: some({
              id: 1,
            }),
          },
        })
      )
      .sendAndConfirm(umi, {
        confirm: { commitment: "finalized" },
      });

    console.log("NFT Minted Successfully!");
    console.log("Mint Transaction:", base58.deserialize(mintTx.signature)[0]);

  } catch (error) {
    console.error("Failed to execute:", error);
  }
})();
```

{% /totem-accordion %}
{% /totem %}
