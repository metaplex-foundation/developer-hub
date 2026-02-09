---
title: Updating Metadata
metaTitle: Updating Metadata | Token Metadata
description: Update NFT metadata, URI, name, creators, and other fields on Solana using the Token Metadata UpdateV1 instruction. Covers update authority, mutable vs immutable assets, and delegate updates.
updated: '02-07-2026'
keywords:
  - update NFT metadata
  - UpdateV1 instruction
  - change NFT name
  - update authority
  - mutable metadata
about:
  - updating metadata
  - metadata modification
  - update authority management
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
howToSteps:
  - Ensure you are the update authority or an authorized delegate
  - Prepare the updated metadata fields
  - Call UpdateV1 with the new data
  - Confirm the transaction
howToTools:
  - Umi SDK
  - Kit SDK
  - Rust SDK
faqs:
  - q: Who can update an NFT's metadata?
    a: Only the update authority (or an authorized update delegate) can modify the Metadata account. The update authority is set when the NFT is created.
  - q: Can I make an NFT immutable?
    a: Yes. Set isMutable to false in an update. Once immutable, no further changes to name, URI, symbol, creators, or seller fee basis points can be made.
  - q: What fields can be updated?
    a: Name, symbol, URI, seller fee basis points, creators, collection, uses, rule set, primary sale happened, and isMutable can all be updated via UpdateV1.
  - q: Can I update a Programmable NFT?
    a: Yes. Programmable NFTs support the same update operations as standard NFTs, but the update may be subject to authorization rules defined in the RuleSet.
---

The update authority of an asset can update its **Metadata** account using the **Update** instruction as long as the **Is Mutable** attribute is set to `true`. The **Update** instruction requires the **Update Authority** to sign the transaction and can update the following attributes of the **Metadata** account:

## Updatable Fields

Note that certain delegated authorities can also update the **Metadata** account of assets as discussed in the "[Delegated Authorities](/smart-contracts/token-metadata/delegates)" page.

Below is an explanation of all the individual fields available for update in the `UpdateV1` instruction.

### The Data Object

The object that defines the Name, Symbol, URI, Seller Fee Basis Points and the array of Creators of the asset. Note that the update authority can only add and/or remove unverified creators from the Creators array. The only exception is if the creator is the update authority, in which case the added or removed creators can be verified.

{% dialect-switcher title="Data Object" %}
{% dialect title="JavaScript" id="js" %}

```ts
const data = {
  name: 'New Name',
  symbol: 'New Symbol',
  uri: 'https://newuri.com',
  sellerFeeBasisPoints: 500,
  creators: [],
}
```

{% /dialect %}

{% dialect title="Rust - anchor-spl 0.31.0" id="rust-anchor" %}

```rust
pub struct DataV2 {
    pub name: String,
    pub symbol: String,
    pub uri: String,
    pub seller_fee_basis_points: u16,
    pub creators: Option<Vec<Creator>>,
    pub collection: Option<Collection>,
    pub uses: Option<Uses>,
}
```

{% /dialect %}

{% /dialect-switcher %}

### Primary Sale Happened

Primary Sale Happened: A boolean that indicates whether the asset has been sold before.

{% dialect-switcher title="Primary Sale Happened" %}
{% dialect title="JavaScript" id="js" %}

```ts
primarySaleHappened: true
```

{% /dialect %}

{% dialect title="Rust - anchor-spl 0.31.0" id="rust-anchor" %}

```rust
primary_sale_happened: Option<bool>,
```

{% /dialect %}
{% /dialect-switcher %}

### Is Mutable

A boolean that indicates whether the asset can be updated again. When changing this to false, any future updates will fail.

{% dialect-switcher title="Is Mutable" %}
{% dialect title="JavaScript" id="js" %}

```ts
isMutable: true
```

{% /dialect %}

{% dialect title="Rust - anchor-spl 0.31.0" id="rust-anchor" %}

```rust
is_mutable: Option<bool>,
```

{% /dialect %}
{% /dialect-switcher %}

### Collection

This attribute enables us to set or clear the collection of the asset. Note that when setting a new collection, the verified boolean must be set to false and [verified using another instruction](/smart-contracts/token-metadata/collections).

#### Setting A Collection

{% dialect-switcher title="Setting A Collection" %}
{% dialect title="JavaScript" id="js" %}

```ts
collection: collectionToggle('Set', [
  {
    key: publicKey('11111111111111111111111111111111'),
    verified: false,
  },
])
```

{% /dialect %}

{% dialect title="Rust - anchor-spl 0.31.0" id="rust-anchor" %}

```rust
collection: Some( Collection {
  key: PubKey,
  verified: Boolean,
}),
```

{% /dialect %}
{% /dialect-switcher %}

#### Clearing a Collection

{% dialect-switcher title="Clearing a Collection" %}
{% dialect title="JavaScript" id="js" %}

```ts
collection: collectionToggle("Clear"),
```

{% /dialect %}

{% dialect title="Rust - anchor-spl 0.31.0" id="rust-anchor" %}

```rust
collection: None,
```

{% /dialect %}
{% /dialect-switcher %}

### New Update Authority

A new update authority can be assigned to an Asset by passing in the `newUpdateAuthority` field.

{% dialect-switcher title="New Update Authority" %}
{% dialect title="JavaScript" id="js" %}

```ts
newUpdateAuthority: publicKey('1111111111111111111111111111111')
```

{% /dialect %}

{% dialect title="Rust - anchor-spl 0.31.0" id="rust-anchor" %}

```rust
new_update_authority: Option<PubKey>,
```

{% /dialect %}
{% /dialect-switcher %}

### Programable RuleSets

This attribute enables us to set or clear the rule set of the asset. This is only relevant for [Programmable Non-Fungibles](/smart-contracts/token-metadata/pnfts).

{% dialect-switcher title="Programable RuleSets" %}
{% dialect title="JavaScript" id="js" %}

```ts
ruleSet: publicKey('1111111111111111111111111111111')
```

{% /dialect %}

{% dialect title="Rust - anchor-spl 0.31.0" id="rust-anchor" %}

```rust
// Not available in Rust anchor-spl SDK
```

{% /dialect %}
{% /dialect-switcher %}

Here is how you can use our SDKs to update an asset on Token Metadata.

## Update As Update Authority

### NFT Asset

This example shows you how to update an NFT Asset as the update Authority of the Asset.

{% code-tabs-imported from="token-metadata/update-nft" frameworks="umi,kit,anchor" /%}

### pNFT Asset

This example shows you how to update a Programable NFT (pNFT) Asset as the update Authority of the Asset.

`pNFTs` may require additional accounts to be passed in for the instruction to work. These include: tokenAccount, tokenRecord, authorizationRules, and authorizationRulesProgram.

{% code-tabs-imported from="token-metadata/update-pnft" frameworks="umi,kit,anchor" /%}
