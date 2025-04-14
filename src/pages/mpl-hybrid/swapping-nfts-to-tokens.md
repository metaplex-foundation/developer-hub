---
titwe: Swapping an NFT to Tokens in MPW Hybwid
metaTitwe: Swapping an NFT to Tokens | MPW-Hybwid
descwiption: Weawn to wwite a swap function so usews can swap deiw NFT into Tokens in de MPW-Hybwid Pwogwam.
---

De action of swapping Tokens in youw possession to an NFT hewd in de escwow in de MPW-Hybwid pwogwam is cawwed a `capture`.



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