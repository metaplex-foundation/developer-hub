---
title: Hashing NFT Data
metaTitle: Bubblegum - Hashing NFT Data
description: Learn more about how NFT data is hashed on Bubblegum
---

In previous sections we stated that each leaf node in a Bubblegum Merkle tree is obtained by hashing the data of the compressed NFT (cNFT).  But how exactly is this done?  We start with the metadata for the cNFT.  Each cNFT is minted with the following metadata structure as an argument to the minting instruction:

```rust
pub struct MetadataArgs {
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
    /// nonce for easy calculation of editions, if present
    pub edition_nonce: Option<u8>,
    /// Since we cannot easily change Metadata, we add the new DataV2 fields here at the end.
    pub token_standard: Option<TokenStandard>,
    /// Collection
    pub collection: Option<Collection>,
    /// Uses
    pub uses: Option<Uses>,
    /// Which token program version (currently only `TokenProgramVersion::Original`` is supported).
    pub token_program_version: TokenProgramVersion,
    /// The array of creators of the cNFT.
    pub creators: Vec<Creator>,
}
```

First the metadata is hashed, using the keccak-256 hash function.  Keccak-256 is much stronger than SHA-256, and is used in Solana as well as other blockchains such as Ethereum.

Note that the metadata is hashed, and then hashed again with the `seller_fee_basis_points`.  This makes it easier for marketplaces to validate seller fee basis points, because they do not have to pass a full `MetadataArgs` struct around (which can be up to 457 bytes in length).  Instead, they can pass a 32-byte array of already-hashed `MetadataArgs`, and the `u16` `seller_fee_basis_points`, and by hashing them together they can recreate the data hash.

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

The data hash and creator hash are added to a leaf schema along with other information needed to uniquely identify the leaf.  The separation of data and creator hashes is done for a similar reason as `seller_fee_basis_points` - if a marketplace wants to validate a creator array, it can pass around a 32-byte array of already-hashed `MetadataArgs` along with the creator array.  The values in the creator array can be evaluated, and then hashed into the `creator_hash` and combined with the other existing information into the leaf schema.

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
}
```

To create the leaf node that exists on the Merkle tree, the entire leaf schema is hashed as follows:

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
        };
        hashed_leaf
    }
}
```

Bubblegum operations that involve changing a leaf (`transfer`, `delegate`, `burn`, etc.) will send a "before" and "after" hashed leaf node to spl-account-compression in order to validate the Merkle tree change.
