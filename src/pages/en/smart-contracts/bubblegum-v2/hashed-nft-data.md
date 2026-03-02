---
title: Hashing NFT Data
metaTitle: Hashing NFT Data - Bubblegum V2 - Metaplex
description: Learn how compressed NFT data is hashed into merkle tree leaves in Bubblegum V2. Covers MetadataArgsV2, data hash, creator hash, collection hash, and LeafSchemaV2.
created: '01-15-2025'
updated: '02-24-2026'
keywords:
  - hashed NFT data
  - merkle leaf
  - data hash
  - creator hash
  - leaf schema
  - LeafSchemaV2
  - keccak-256
about:
  - Compressed NFTs
  - Merkle trees
  - Cryptographic hashing
proficiencyLevel: Advanced
programmingLanguage:
  - Rust
---

## Summary

**Hashing NFT data** explains how compressed NFT metadata is transformed into merkle tree leaves using keccak-256 hashing. This page covers the MetadataArgsV2 structure, data hash, creator hash, collection hash, and the LeafSchemaV2 format.

- MetadataArgsV2 is hashed with seller_fee_basis_points to create the data hash
- Creator array is hashed separately into a creator hash
- Both hashes are combined with other fields in LeafSchemaV2 to produce the final leaf node
- LeafSchemaV2 adds collection_hash, asset_data_hash, and flags compared to V1

In previous sections we stated that each leaf node in a Bubblegum Merkle tree is obtained by hashing the data of the compressed NFT (cNFT).  But how exactly is this done?  We start with the metadata for the cNFT.  Each cNFT of Bubblegum V2 is minted with the following metadata structure as an argument to the minting instruction, note that Bubblegum v1 uses MetadataArgs instead:

```rust
pub struct MetadataArgsV2 {
    /// The name of the asset
    pub name: String,
    /// The symbol for the asset
    pub symbol: String,
    /// URI pointing to JSON representing the asset
    pub uri: String,
    /// Royalty basis points that goes to creators in secondary sales (0-10000)
    pub seller_fee_basis_points: u16,
    /// Immutable, once flipped, all sales of this metadata are considered secondary.
    pub primary_sale_happened: bool,
    /// Whether or not the data struct is mutable, default is not
    pub is_mutable: bool,
    /// Token standard.  Currently only `NonFungible` is allowed.
    pub token_standard: Option<TokenStandard>,
    /// Creator array
    pub creators: Vec<Creator>,
    /// Collection.  Note in V2 its just a `Pubkey` and is always considered verified.
    pub collection: Option<Pubkey>,
}
```

The cNFT's metadata is hashed multiple times as shown in the diagram and described below:

{% diagram %}

{% node %}
{% node #metadata label="Metadata Args" theme="blue" /%}
{% node label="Name" /%}
{% node label="Symbol" /%}
{% node label="URI" /%}
{% node label="Seller Fee Basis Points" /%}
{% node label="Primary Sale Happened" /%}
{% node label="Is Mutable" /%}
{% node label="Token Standard" /%}
{% node label="Collection" /%}
{% node label="Creators" /%}
{% /node %}

{% node #seller-fee-basis-points parent="metadata" y="305" label="Seller Fee Basis Points" theme="blue" /%}

{% node #creators parent="metadata" y="370" label="Creators" theme="blue" /%}

{% node parent="metadata" x="300" y="150" %}
{% node #data-hash label="Data Hash" theme="mint" /%}
{% node theme="transparent" %}
Hash(Metadata Args, \
Seller Fee Basis Points)
{% /node %}
{% /node %}

{% node parent="creators" x="300" %}
{% node #creator-hash label="Creator Hash" theme="mint" /%}
{% node theme="transparent" label="Hash(Creators)" /%}
{% /node %}

{% node parent="data-hash" x="250" %}
{% node #leaf-schema label="Leaf Schema V2" theme="blue" /%}
{% node label="ID" /%}
{% node label="Owner" /%}
{% node label="Delegate" /%}
{% node label="Nonce" /%}
{% node label="Data Hash" /%}
{% node label="Creator Hash" /%}
{% node label="Collection Hash (new with V2)" /%}
{% node label="Asset Data Hash (new with V2)" /%}
{% node label="Flags (new with V2)" /%}
{% /node %}

{% node parent="leaf-schema" x="200" %}
{% node #leaf-node label="Leaf Node" theme="mint" /%}
{% node theme="transparent" label="Hash(Leaf Schema)" /%}
{% /node %}

{% edge from="metadata" to="data-hash" /%}
{% edge from="seller-fee-basis-points" to="data-hash" /%}
{% edge from="creators" to="creator-hash" /%}

{% edge from="data-hash" to="leaf-schema" /%}
{% edge from="creator-hash" to="leaf-schema" /%}

{% edge from="leaf-schema" to="leaf-node" /%}

{% /diagram %}

First the metadata is hashed, using the keccak-256 hash function.  Keccak-256 is much stronger than SHA-256, and is used in Solana as well as other blockchains such as Ethereum.

Note that the metadata is hashed, and then hashed again with the `seller_fee_basis_points`.  This makes it easier for marketplaces to validate seller fee basis points, because they do not have to pass a full `MetadataArgs` struct around (which can be up to 457 bytes in length).  Instead, they can pass a 32-byte array of already-hashed `MetadataArgs`, and the `u16` (2 bytes) `seller_fee_basis_points`, and by hashing them together they can recreate the data hash.

```rust
/// Computes the hash of the metadata.
///
/// The hash is computed as the keccak256 hash of the metadata bytes, which is
/// then hashed with the `seller_fee_basis_points`.
pub fn hash_metadata(metadata: &MetadataArgs) -> Result<[u8; 32]> {
    let hash = keccak::hashv(&[metadata.try_to_vec()?.as_slice()]);
    // Calculate new data hash.
    Ok(keccak::hashv(&[
        &hash.to_bytes(),
        &metadata.seller_fee_basis_points.to_le_bytes(),
    ])
    .to_bytes())
}
```

Next, the creator array is hashed individually.

```rust
/// Computes the hash of the creators.
///
/// The hash is computed as the keccak256 hash of the creators bytes.
pub fn hash_creators(creators: &[Creator]) -> [u8; 32] {
    // convert creator Vec to bytes Vec
    let creator_data = creators
        .iter()
        .map(|c| [c.address.as_ref(), &[c.verified as u8], &[c.share]].concat())
        .collect::<Vec<_>>();
    // computes the hash
    keccak::hashv(
        creator_data
            .iter()
            .map(|c| c.as_slice())
            .collect::<Vec<&[u8]>>()
            .as_ref(),
    )
    .to_bytes()
}
```

Followed by the collection and asset data hash:

```rust
/// Computes the hash of the collection (or if `None` provides default) for `LeafSchemaV2`.
pub fn hash_collection_option(collection: Option<Pubkey>) -> Result<[u8; 32]> {
    let collection_key = collection.unwrap_or(DEFAULT_COLLECTION);
    Ok(keccak::hashv(&[collection_key.as_ref()]).to_bytes())
}

/// Computes the hash of the asset data (or if `None` provides default) for `LeafSchemaV2`.
pub fn hash_asset_data_option(asset_data: Option<&[u8]>) -> Result<[u8; 32]> {
    let data = asset_data.unwrap_or(b""); // Treat None as empty data
    Ok(keccak::hashv(&[data]).to_bytes())
}

```

The data hash and creator hash are added to a leaf schema along with other information needed to uniquely identify the leaf.

The separation of data and creator hashes is done for a similar reason as `seller_fee_basis_points` - if a marketplace wants to validate a creator array, it can pass around a 32-byte array of already-hashed `MetadataArgs` along with the creator array.  The values in the creator array can be evaluated, and then hashed into the `creator_hash` and combined with the other existing information into the leaf schema. Bubblegum V1 uses `LeafSchemaV1` while Bubblegum V2 uses `LeafSchemaV2`.

```rust
#[derive(BorshSerialize, BorshDeserialize, PartialEq, Eq, Debug, Clone)]
pub enum LeafSchema {
    V1 {
        id: Pubkey,
        owner: Pubkey,
        delegate: Pubkey,
        nonce: u64,
        data_hash: [u8; 32],
        creator_hash: [u8; 32],
    },
    V2 {
        id: Pubkey,
        owner: Pubkey,
        delegate: Pubkey,
        nonce: u64,
        data_hash: [u8; 32],
        creator_hash: [u8; 32],
        collection_hash: [u8; 32],
        asset_data_hash: [u8; 32],
        flags: u8,
    },
}
```

Other than data, creator, collection and asset data hashes, the leaf schema contains the following other items:

* nonce: This is a "number used once" value that is unique for each leaf on the tree.  It is needed to ensure Merkle tree leaves are unique.  In practice it retrieved from off-chain indexers, similar to asset proofs.
* id - This asset ID is a PDA derived from a fixed prefix, the Merkle tree Pubkey, and the nonce.
* owner - The Pubkey of the cNFT owner, typically a user's wallet.
* delegate - The delegate for the cNFT.  By default this is the user's wallet, but can be set by the `delegate` Bubblegum instruction.
* flags - This is a bitmask with addition information about the nfts status. Bit 0 is the frozen status on asset level (by owner) and bit 1 is the frozen status by the permanent delegate on collection level. Both of them can be changed by the correct authority. Bit 3 is a general `nonTransferable` flag that can be reset by nobody and is used for soulbound assets. The other bits are reserved for future use.

To create the 32-byte leaf node that exists on the Merkle tree, the entire leaf schema is hashed as follows, depending on the Schema version:

```rust
impl LeafSchema {
    pub fn to_node(&self) -> Node {
        let hashed_leaf = match self {
            LeafSchema::V1 {
                id,
                owner,
                delegate,
                nonce,
                data_hash,
                creator_hash,
            } => keccak::hashv(&[
                &[self.version().to_bytes()],
                id.as_ref(),
                owner.as_ref(),
                delegate.as_ref(),
                nonce.to_le_bytes().as_ref(),
                data_hash.as_ref(),
                creator_hash.as_ref(),
            ])
            .to_bytes(),
            LeafSchema::V2 {
                id,
                owner,
                delegate,
                nonce,
                data_hash,
                creator_hash,
                collection_hash,
                asset_data_hash,
                flags,
            } => keccak::hashv(&[
                &[self.version().to_bytes()],
                id.as_ref(),
                owner.as_ref(),
                delegate.as_ref(),
                nonce.to_le_bytes().as_ref(),
                data_hash.as_ref(),
                creator_hash.as_ref(),
                collection_hash.as_ref(),
                asset_data_hash.as_ref(),
                &[*flags],
            ])
            .to_bytes(),
        };
        hashed_leaf
    }
}
```

Bubblegum operations that involve changing a leaf (`transfer`, `delegate`, `burn`, etc.) will send a "before" and "after" hashed leaf node to `spl-account-compression` or `mpl-account-compression` depending on the leaf schema version to validate the Merkle tree change.


## Notes

- Bubblegum uses **keccak-256** (not SHA-256) for all hashing operations, consistent with Solana and Ethereum.
- The separation of data hash and creator hash allows marketplaces to validate royalty information without reconstructing the full metadata struct.
- LeafSchemaV2 flags use a bitmask: bit 0 = owner-level freeze, bit 1 = permanent delegate freeze, bit 3 = non-transferable (soulbound).
- V1 and V2 leaf schemas are not interchangeable — V2 trees require LeafSchemaV2 leaves.

## Glossary

| Term | Definition |
|------|------------|
| **MetadataArgsV2** | The Rust struct containing cNFT metadata (name, symbol, URI, royalties, creators, collection) |
| **Data Hash** | keccak-256 hash of the metadata combined with seller_fee_basis_points |
| **Creator Hash** | keccak-256 hash of the creator array (address, verified flag, share for each creator) |
| **Collection Hash** | keccak-256 hash of the collection public key (new in V2) |
| **Asset Data Hash** | keccak-256 hash of additional asset data (new in V2) |
| **LeafSchemaV2** | The V2 leaf structure containing id, owner, delegate, nonce, data hash, creator hash, collection hash, asset data hash, and flags |
| **Flags** | A bitmask byte in LeafSchemaV2 encoding freeze status and non-transferable status |
| **keccak-256** | The cryptographic hash function used by Bubblegum for all leaf computations |
