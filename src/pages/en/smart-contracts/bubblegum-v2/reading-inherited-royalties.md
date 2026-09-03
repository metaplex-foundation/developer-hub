---
title: Reading Inherited Royalties
metaTitle: Reading Inherited Royalties - Bubblegum V2 - Metaplex
description: How wallets, marketplaces, indexers, and other clients should read DAS getAsset responses for Bubblegum V2 cNFTs that inherit seller fees from an MPL-Core collection.
created: '07-16-2026'
updated: '08-06-2026'
keywords:
  - inherited royalties
  - seller fee basis points
  - DAS API
  - getAsset
  - basis_points_raw
  - creators_raw
  - inherited
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
  - q: Why does royalty.basis_points_raw show 65535?
    a: That is the on-chain inherit sentinel used for leaf hashing. royalty.basis_points already holds the collection rate for display.
  - q: Why is creators_raw empty on an inherited cNFT?
    a: Leaf creators must be empty when SFBP is inherited. Use creators for collection royalty payees.
  - q: Do I need to change anything for non-inherited cNFTs?
    a: No. When inheritance is not used, the _raw fields and inherited are omitted and the main royalty and creators fields behave as before.
---

## Summary

Bubblegum V2 can store seller fees as an **inherit sentinel** (`65535`) on the leaf and resolve the effective rate from the MPL-Core collection's Royalties plugin. DAS puts **collection-resolved values on the main fields** (for display) and exposes leaf values on `_raw` fields (for hashing).

- Use **main fields** (`royalty.basis_points`, `creators`) for royalty UI and payout display
- Use **`_raw` fields** (`royalty.basis_points_raw`, `creators_raw`) for proofs, hashing, and write instructions
- Non-inherited assets are unchanged — `_raw` / `inherited` are omitted

This page is for **any client that reads** `getAsset` / DAS responses — wallets, marketplaces, indexers, analytics, and apps. For minting and updating inherited cNFTs, see [Minting](/smart-contracts/bubblegum-v2/mint-cnfts#inheriting-royalties-from-the-collection) and [Updating](/smart-contracts/bubblegum-v2/update-cnfts#inherited-royalties).

## When it applies

A cNFT is using inherited royalties when:

- It is a Bubblegum V2 asset in an MPL-Core collection with the `Royalties` plugin, and
- The leaf seller fee is the inherit sentinel `65535` (`0xffff`)

DAS signals this with `royalty.inherited: true` and `royalty.basis_points_raw: 65535` when the collection royalty can be resolved onto the main fields.

## Field map

| Use case | Fields |
|----------|--------|
| Display rate / royalty UI | `royalty.basis_points`, `royalty.percent` |
| Display payees / payout splits | `creators` |
| Hashing, merkle proofs, write instructions | `royalty.basis_points_raw`, `creators_raw` |
| Detect inherit mode | `royalty.inherited` (or `basis_points_raw === 65535`) |

### Example DAS response (inherited)

```json
"royalty": {
  "royalty_model": "creators",
  "target": null,
  "percent": 0.075,
  "basis_points": 750,
  "basis_points_raw": 65535,
  "inherited": true,
  "primary_sale_happened": false,
  "locked": false
},
"creators": [
  {
    "address": "CJkzXwVwqiaSvMuRb3obrZHdrPFjCMBJBDrjspn72tDv",
    "share": 100,
    "verified": true
  }
],
"creators_raw": []
```

- `basis_points: 750` is the collection rate to show users (7.5%).
- `basis_points_raw: 65535` is the on-chain sentinel used in the leaf data hash — **not** a 655.35% royalty.
- `creators` are collection Royalties plugin payees; `creators_raw: []` is the leaf creators array for hashing.

If the collection cannot be resolved, `basis_points` may fall back while `basis_points_raw` remains `65535`.

## Detection and display helpers

```ts
const INHERIT = 0xffff // 65535

function isInheritedRoyalty(royalty: {
  basis_points: number
  basis_points_raw?: number | null
  inherited?: boolean | null
}): boolean {
  return (
    royalty.inherited === true ||
    royalty.basis_points_raw === INHERIT
  )
}

function leafBasisPoints(royalty: {
  basis_points: number
  basis_points_raw?: number | null
  inherited?: boolean | null
}): number {
  if (royalty.basis_points_raw != null) return royalty.basis_points_raw
  if (royalty.inherited) return INHERIT
  return royalty.basis_points
}

function leafCreators(asset: {
  creators: Array<{ address: string; share: number; verified: boolean }>
  creators_raw?: Array<{
    address: string
    share: number
    verified: boolean
  }> | null
}) {
  return asset.creators_raw ?? asset.creators
}
```

With `@metaplex-foundation/digital-asset-standard-api`:

```ts
import {
  SELLER_FEE_BASIS_POINTS_INHERIT,
  isInheritedSfbpRoyalty,
  getRawSellerFeeBasisPoints,
  getResolvedSellerFeeBasisPoints,
} from '@metaplex-foundation/digital-asset-standard-api'

const royalty = asset.royalty
if (isInheritedSfbpRoyalty(royalty)) {
  const rate = getResolvedSellerFeeBasisPoints(royalty) // e.g. 750 (display)
  const leaf = getRawSellerFeeBasisPoints(royalty) // 65535
  const payees = asset.creators // collection payees
  const leafCreators = asset.creators_raw ?? []
}
```

## What not to do

- Do **not** show `65535` or `6.5535%` as the user-facing royalty rate — that value lives on `basis_points_raw`.
- Do **not** assume empty `creators_raw` means no royalty recipients; display payees are on `creators`.
- Do **not** use main `basis_points` / `creators` when recomputing leaf hashes or building Bubblegum write instructions — use `basis_points_raw` and `creators_raw`.

{% callout type="warning" title="Outdated DAS / marketplaces" %}
Inherited royalties require a DAS indexer that resolves collection rates onto the main fields. On an **outdated** DAS endpoint, `getAsset` still returns the leaf as-is: `royalty.basis_points` ≈ `65535`, `creators: []`, and no `basis_points_raw` / `inherited` / `creators_raw`.

Marketplaces that only read those DAS asset fields for payouts may treat the asset as having **no royalty recipients** (or an invalid rate) and **pay creators nothing**. Prefer marketplaces that:

- Use an upgraded DAS that returns `inherited` / `_raw` and collection-resolved `creators` / `basis_points`, or
- Read the MPL-Core collection **Royalties** plugin directly for payouts

Royalty *enforcement* (who may transfer) is separate: configure the collection Royalties plugin `ruleSet` (`ProgramAllowList` / `ProgramDenyList`). Bubblegum does not escrow royalty payments on transfer.
{% /callout %}

## Bubblegum SDK note

`getAssetWithProof` keeps **reading compatible**: `metadata` mirrors DAS main fields (`basis_points`, `creators`), so `metadata.sellerFeeBasisPoints` is the resolved collection rate when inherited. `currentMetadata` is leaf-canonical for writes (sentinel when inherited). Optional siblings `sellerFeeBasisPointsRaw` / `creatorsRaw` and `inherited` mirror DAS `_raw` / inherit detection. Spread `...assetWithProof` into write instructions — use `currentMetadata` for leaf args, not display `metadata`. See the [JavaScript SDK](/smart-contracts/bubblegum-v2/sdk/javascript#getassetwithproof-and-inherited-royalties).

## Related

- [Fetching Compressed NFTs](/smart-contracts/bubblegum-v2/fetch-cnfts)
- [Minting — Inheriting royalties](/smart-contracts/bubblegum-v2/mint-cnfts#inheriting-royalties-from-the-collection)
- [Updating cNFTs — Inherited royalties](/smart-contracts/bubblegum-v2/update-cnfts#inherited-royalties)
- [Hashing NFT Data](/smart-contracts/bubblegum-v2/hashed-nft-data)
- [DAS getAsset](/dev-tools/das-api/methods/get-asset)
- [FAQ — Inherited royalties](/smart-contracts/bubblegum-v2/faq#inherited-royalties)
