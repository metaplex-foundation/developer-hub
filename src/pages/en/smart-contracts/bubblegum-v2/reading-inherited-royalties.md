---
title: Reading Inherited Royalties
metaTitle: Reading Inherited Royalties - Bubblegum V2 - Metaplex
description: How wallets, marketplaces, indexers, and other clients should read DAS getAsset responses for Bubblegum V2 cNFTs that inherit seller fees from an MPL-Core collection.
created: '07-16-2026'
updated: '07-16-2026'
keywords:
  - inherited royalties
  - seller fee basis points
  - DAS API
  - getAsset
  - basis_points_inherited
  - creators_inherited
  - Bubblegum V2
about:
  - Compressed NFTs
  - DAS API
  - Royalties
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: Why does royalty.basis_points show 65535?
    a: That is the on-chain inherit sentinel. Use royalty.basis_points_inherited for the collection rate shown to users.
  - q: Why is creators empty on an inherited cNFT?
    a: Leaf creators must be empty when SFBP is inherited. Use creators_inherited for collection royalty payees.
  - q: Do I need to change anything for non-inherited cNFTs?
    a: No. When inheritance is not used, the *_inherited fields are omitted and the main royalty and creators fields behave as before.
---

## Summary

Bubblegum V2 can store seller fees as an **inherit sentinel** (`65535`) on the leaf and resolve the effective rate from the MPL-Core collection's Royalties plugin. DAS keeps leaf values on the main fields (for hashing) and adds `*_inherited` fields for display.

- Use **leaf fields** for proofs, hashing, and write instructions
- Use **`*_inherited` fields** for royalty UI and payout display
- Non-inherited assets are unchanged — `*_inherited` is omitted

This page is for **any client that reads** `getAsset` / DAS responses — wallets, marketplaces, indexers, analytics, and apps. For minting and updating inherited cNFTs, see [Minting](/smart-contracts/bubblegum-v2/mint-cnfts#inheriting-royalties-from-the-collection) and [Updating](/smart-contracts/bubblegum-v2/update-cnfts#inherited-royalties).

## When it applies

A cNFT is using inherited royalties when:

- It is a Bubblegum V2 asset in an MPL-Core collection with the `Royalties` plugin, and
- The leaf seller fee is the inherit sentinel `65535` (`0xffff`)

DAS signals this by setting `royalty.basis_points` to `65535` and populating the inherited fields when the collection royalty can be resolved.

## Field map

| Use case | Fields |
|----------|--------|
| Hashing, merkle proofs, write instructions | `royalty.basis_points`, `royalty.percent`, `creators` |
| Display rate / royalty UI | `royalty.basis_points_inherited`, `royalty.percent_inherited` |
| Display payees / payout splits | `creators_inherited` |

### Leaf (canonical / hashing)

```json
"royalty": {
  "royalty_model": "creators",
  "target": null,
  "percent": 6.5535,
  "basis_points": 65535,
  "basis_points_inherited": 750,
  "percent_inherited": 0.075,
  "primary_sale_happened": false,
  "locked": false
},
"creators": [],
"creators_inherited": [
  {
    "address": "CJkzXwVwqiaSvMuRb3obrZHdrPFjCMBJBDrjspn72tDv",
    "share": 100,
    "verified": true
  }
]
```

- `basis_points: 65535` is **not** a 655.35% royalty — it is the on-chain sentinel used in the leaf data hash.
- `creators: []` is expected for inherited SFBP. Do not treat an empty creators array as “no royalty payees” when inherited fields are present.

### Display (collection-resolved)

| Field | Example | Meaning |
|-------|---------|---------|
| `royalty.basis_points_inherited` | `750` | Collection rate in basis points (7.5%) |
| `royalty.percent_inherited` | `0.075` | Same rate as a fraction |
| `creators_inherited` | `[{ address, share, verified }]` | Collection Royalties plugin creators |

If the collection cannot be resolved, `*_inherited` may be omitted while `basis_points` remains `65535`.

## Detection and display helpers

```ts
const INHERIT = 0xffff // 65535

function isInheritedRoyalty(royalty: {
  basis_points: number
  basis_points_inherited?: number | null
}): boolean {
  return (
    royalty.basis_points === INHERIT ||
    royalty.basis_points_inherited != null
  )
}

function displayBasisPoints(royalty: {
  basis_points: number
  basis_points_inherited?: number | null
}): number {
  return royalty.basis_points_inherited ?? royalty.basis_points
}

function displayCreators(asset: {
  creators: Array<{ address: string; share: number; verified: boolean }>
  creators_inherited?: Array<{
    address: string
    share: number
    verified: boolean
  }> | null
}) {
  return asset.creators_inherited ?? asset.creators
}
```

With `@metaplex-foundation/digital-asset-standard-api`:

```ts
import {
  SELLER_FEE_BASIS_POINTS_INHERIT,
  isInheritedSfbpRoyalty,
  getResolvedSellerFeeBasisPoints,
} from '@metaplex-foundation/digital-asset-standard-api'

const royalty = asset.royalty
if (isInheritedSfbpRoyalty(royalty)) {
  const rate = getResolvedSellerFeeBasisPoints(royalty) // e.g. 750
  const payees = asset.creators_inherited ?? asset.creators
}
```

## What not to do

- Do **not** show `65535` or `6.5535%` as the user-facing royalty rate.
- Do **not** assume empty `creators` means no royalty recipients when inheritance is in use.
- Do **not** use `basis_points_inherited` or `creators_inherited` when recomputing leaf hashes or building Bubblegum write instructions — those need leaf `basis_points` and leaf `creators`.

## Bubblegum SDK note

`getAssetWithProof` builds `metadata` from **leaf** DAS fields so write instructions hash correctly. For UI rates after `getAssetWithProof`, read `rpcAsset.royalty.basis_points_inherited` and `rpcAsset.creators_inherited`. See the [JavaScript SDK](/smart-contracts/bubblegum-v2/sdk/javascript#getassetwithproof-and-inherited-royalties).

## Related

- [Fetching Compressed NFTs](/smart-contracts/bubblegum-v2/fetch-cnfts)
- [Minting — Inheriting royalties](/smart-contracts/bubblegum-v2/mint-cnfts#inheriting-royalties-from-the-collection)
- [Updating cNFTs — Inherited royalties](/smart-contracts/bubblegum-v2/update-cnfts#inherited-royalties)
- [Hashing NFT Data](/smart-contracts/bubblegum-v2/hashed-nft-data)
- [DAS getAsset](/dev-tools/das-api/methods/get-asset)
- [FAQ — Inherited royalties](/smart-contracts/bubblegum-v2/faq#inherited-royalties)
