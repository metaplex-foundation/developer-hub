---
title: Swapping an NFT to Tokens in MPL Hybrid
metaTitle: Swapping an NFT to Tokens | MPL-Hybrid
description: Learn to write a swap function so users can swap their NFT into Tokens in the MPL-Hybrid Program.
---

The action of swapping Tokens in your possession to an NFT held in the escrow in the MPL-Hybrid program is called a `capture`.



## Swapping an NFT

```ts
await releaseV1(umi, {
    // The owner of the asset being swapped.
    owner: umi.identity,
    // The escrow configuration address.
    escrow: publicKey("11111111111111111111111111111111"),
    // The Asset that will be swapped for SPL Tokens.
    asset: publicKey("22222222222222222222222222222222"),
    // The collection assigned to the escrow configuration.
    collection: publicKey("33333333333333333333333333333333"),
    // The fee wallet address.
    feeProjectAccount: publicKey("44444444444444444444444444444444"),
    // The Token Account of the Wallet.
    token: publicKey("55555555555555555555555555555555"),
  }).sendAndConfirm(umi);
```