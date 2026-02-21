---
title: Creating an MPL 404 Hybrid Escrow
metaTitle: Creating an MPL 404 Hybrid Escrows | MPL-Hybrid
description: Learn to create the MPL 404 Hybrid Escrow account that makes 404 swaps possible.
---

## Prerequisites

- A MPL Core Collection - [Create a Core Collection guide](/smart-contracts/core/guides/javascript/how-to-create-a-core-collection-with-javascript)
- Core NFT Assets Minted to the Collection - [Create a Core NFT Asset guide](/smart-contracts/core/guides/javascript/how-to-create-a-core-nft-asset-with-javascript)
- An SPL Token created with required token amount. - [Create a Solana Token guide](/guides/javascript/how-to-create-a-solana-token)
- An online storage of sequential metadata JSON files at a consistent gateway/uri.

Initializing the escrow is the essential step that links an NFT collection with a fungible token. Before starting this step, you should have ready a Core collection address, a fungible token mint address, and a range of off-chain metadata URIs using numerically named, sequential files. The need for Base URI string consistency will limit some off-chain metadata options. Note that the authority of the escrow needs to match the authority of the collection to perform metadata updates. Additionally, because the escrow is funded, there is no need to be the token authority which allows collections to be backed by existing memecoins or other fungible assets.

## MPL-Hybrid Escrow Account Structure

The MPL Hybrid Escrow is the heart of the program which stores all information regarding the project.

{% totem %}
{% totem-accordion title="On Chain MPL-404 Escrow Data Structure" %}

The onchain account structure of an MPL-404 Escrow [on GitHub](https://github.com/metaplex-foundation/mpl-hybrid/blob/main/programs/mpl-hybrid/src/state/escrow.rs)

| Name           | Type   | Size | Description                                      |     |
| -------------- | ------ | ---- | ------------------------------------------------ | --- |
| collection     | Pubkey | 32   | The collection account                           |     |
| authority      | Pubkey | 32   | The authority of the Escrow                      |     |
| token          | Pubkey | 32   | The fungible token to be dispensed               |     |
| fee_location   | Pubkey | 32   | The account to send token fees to                |     |
| name           | String | 4    | The NFT name                                     |     |
| uri            | String | 8    | The base uri for the NFT metadata                |     |
| max            | u64    | 8    | The max index of NFTs that append to the uri     |     |
| min            | u64    | 8    | The minimum index of NFTs that append to the uri |     |
| amount         | u64    | 8    | The token cost to swap                           |     |
| fee_amount     | u64    | 8    | The token fee for capturing the NFT              |     |
| sol_fee_amount | u64    | 8    | The sol fee for capturing the NFT                |     |
| count          | u64    | 8    | The total number of swaps                        |     |
| path           | u16    | 1    | The onchain/off-chain metadata update path       |     |
| bump           | u8     | 1    | The escrow bump                                  |     |

{% /totem-accordion %}
{% /totem %}

## Create Escrow

### Args

#### name

The name of your escrow. This data can be used to show the name of your escrow on a UI.

```ts
name: 'My Test Escrow'
```

#### uri

This is the base uri for your metadata pool. This needs to be a static uri which also contains your metadata json files at sequential destination. i.e:

```
https://shdw-drive.genesysgo.net/.../0.json
https://shdw-drive.genesysgo.net/.../1.json
https://shdw-drive.genesysgo.net/.../2.json
```

```ts
uri: 'https://shdw-drive.genesysgo.net/<bucket-id>/'
```

#### escrow

The escrow address is a PDA of the two following seeds `["escrow", collectionAddress]`.

```ts
const collectionAddress = publicKey('11111111111111111111111111111111')

const escrowAddress = umi.eddsa.findPda(MPL_HYBRID_PROGRAM_ID, [
  string({ size: 'variable' }).serialize('escrow'),
  publicKeySerializer().serialize(collectionAddress),
])
```

#### collection

The collection address being used in your MPL Hybrid 404 project.

```ts
collection: publicKey('11111111111111111111111111111111')
```

#### token

The Token mint address that is being used in your MPL Hybrid 404 project.

```ts
token: publicKey('11111111111111111111111111111111')
```

#### feeLocation

The wallet address which will be receiving the fees from the swaps.

```ts
feeLocation: publicKey('11111111111111111111111111111111')
```

#### feeAta

The Token Account of the wallet that will be receiving the tokens.

```ts
feeAta: findAssociatedTokenPda(umi, {
  mint: publicKey('111111111111111111111111111111111'),
  owner: publicKey('22222222222222222222222222222222'),
})
```

#### min and max

The min and max represent the min and max indexes available in your metadata pool.

```
Lowest index: 0.json
...
Highest index: 4999.json
```

This would then translate into the min and max args.

```ts
min: 0,
max: 4999
```

#### fees

There are 3 separate fees that can be set.

```ts
// Amount of tokens to receive when swapping an NFT to tokens.
// This value is in lamports and you will need to take into account
// the number of decimals the token has. If the token has 5 decimals
// and you wish to charge 1 whole token then feeAmount would be `100000`.

amount: swapToTokenValueReceived,
```

```ts
// Fee amount to pay when swapping Tokens to an NFT. This value is
// in lamports and you will need to take into account the number of
// decimals the token has. If the token has 5 decimals and you wish
// to charge 1 whole token then feeAmount would be `100000`.

feeAmount: swapToNftTokenFee,
```

```ts
// Optional fee to pay when swapping from Tokens to NFT.
// This is in lamports so you can use `sol()` to calculate
// the lamports.

solFeeAmount: sol(0.5).basisPoints,
```

#### path

The `path` arg either enables of disables the metadata rerolling function on the mpl-hybrid program.

```ts
// Reroll metadata on swap 0 = true, 1 = false
path: rerollEnabled,
```

#### associatedTokenProgram

The `SPL_ASSOCIATED_TOKEN_PROGRAM_ID` can be pulled from the `mpl-toolbox` package.

```ts
import { SPL_ASSOCIATED_TOKEN_PROGRAM_ID } from @metaplex/mpl-toolbox
```

```ts
// Associated Token Program ID
associatedTokenProgram: SPL_ASSOCIATED_TOKEN_PROGRAM_ID,
```

### Code

```ts
const initTx = await initEscrowV1(umi, {
  // Escrow Name
  name: escrowName,
  // Metadata Pool Base Uri
  uri: baseMetadataPoolUri,
  // Escrow Address based on "escrow" + collection address seeds
  escrow: escrowAddress,
  // Collection Address
  collection: collectionAddress,
  // Token Mint
  token: tokenMint,
  // Fee Wallet
  feeLocation: feeWallet,
  // Fee Token Account
  feeAta: feeTokenAccount,
  // Min index of NFTs in the pool
  min: minAssetIndex,
  // Max index of NFTs in the pool
  max: maxAssetIndex,
  // Amount of fungible token to swap to
  amount: swapToTokenValueReceived,
  // Fee amount to pay when swapping to NFTs
  feeAmount: swapToNftTokenFee,
  // Optional additional fee to pay when swapping to NFTs
  solFeeAmount: sol(0.5).basisPoints,
  // Reroll metadata on swap 0 = true, 1 = false
  path: rerollEnabled,
  // Associated Token Program ID
  associatedTokenProgram: SPL_ASSOCIATED_TOKEN_PROGRAM_ID,
}).sendAndConfirm(umi)
```
