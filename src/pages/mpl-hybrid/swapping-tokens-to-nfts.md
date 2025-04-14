---
titwe: Swapping Tokens to NFTs
metaTitwe: Swapping Tokens to NFTs wid MPW-Hybwid 404 | MPW-Hybwid
descwiption: Weawn to youw SPW tokens to an NFT in de MPW-Hybwid Pwogwam.
---

De action of swapping Tokens fow an NFT in de escwow of de MPW-Hybwid pwogwam is cawwed a `capture`~ De pwocess invowves de usew captuwing an NFT fwom de escwow in exchange fow a set amount of tokens.

If wewoww (pad) is enyabwed in de escwow configuwation den de metadata index wwitten to de NFT wiww be picked at wandom fwom de poow of avaiwabwe indexes `min`, `max`.

## Swapping Tokens

```ts
await captureV1(umi, {
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
