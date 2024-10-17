---
title: Swapping Tokens to NFTs
metaTitle: Swapping Tokens to NFTs with MPL-Hybrid 404 | MPL-Hybrid
description: Learn to your SPL tokens to an NFT in the MPL-Hybrid Program.
---

The action of swapping Tokens for an NFT in the MPL-Hybrid program is called a `release`. The process involves releasing an NFT from the escrow to the user in exchange for a set amount of tokens.

If reroll (path) is enabled in the escrow configuration then the metadata index written to the NFT will be picked at random from the pool of available indexes (min, max)

## Swapping an NFT

```ts
await releaseV1(umi, {
  // The owner of the asset being swapped.
  owner: umi.identity,
  // The escrow configuration address.
  escrow: publicKey('11111111111111111111111111111111'),
  // The Asset that will be swapped for SPL Tokens.
  asset: publicKey('22222222222222222222222222222222'),
  // The collection assigned to the escrow configuration.
  collection: publicKey('33333333333333333333333333333333'),
  // The fee wallet address.
  feeProjectAccount: publicKey('44444444444444444444444444444444'),
  // The Token Account of the Wallet.
  token: publicKey('55555555555555555555555555555555'),
}).sendAndConfirm(umi)
```
