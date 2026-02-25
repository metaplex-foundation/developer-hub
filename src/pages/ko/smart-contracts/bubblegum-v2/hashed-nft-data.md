---
title: NFT 데이터 해싱
metaTitle: NFT 데이터 해싱 - Bubblegum V2
description: Bubblegum에서 NFT 데이터가 해싱되는 방식에 대해 자세히 알아보세요.
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


이전 섹션에서 Bubblegum 머클 트리의 각 리프 노드는 압축된 NFT(cNFT)의 데이터를 해싱하여 얻는다고 설명했습니다. 그러나 이것이 정확히 어떻게 수행되는지 알아보겠습니다. cNFT의 메타데이터부터 시작합니다. Bubblegum V2의 각 cNFT는 민팅 명령어에 대한 인수로 다음 메타데이터 구조와 함께 민팅되며, Bubblegum v1은 대신 MetadataArgs를 사용한다는 점에 유의하세요:

```rust
pub struct MetadataArgsV2 {
    /// 자산의 이름
    pub name: String,
    /// 자산의 심볼
    pub symbol: String,
    /// 자산을 나타내는 JSON을 가리키는 URI
    pub uri: String,
    /// 2차 판매에서 창작자에게 지불되는 로열티 베이시스 포인트 (0-10000)
    pub seller_fee_basis_points: u16,
    /// 불변, 한 번 뒤집히면 이 메타데이터의 모든 판매가 2차 판매로 간주됩니다.
    pub primary_sale_happened: bool,
    /// 데이터 구조가 변경 가능한지 여부, 기본값은 변경 불가능
    pub is_mutable: bool,
    /// 토큰 표준. 현재는 `NonFungible`만 허용됩니다.
    pub token_standard: Option<TokenStandard>,
    /// 창작자 배열
    pub creators: Vec<Creator>,
    /// 컬렉션. V2에서는 단순히 `Pubkey`이며 항상 검증된 것으로 간주됩니다.
    pub collection: Option<Pubkey>,
}
```

cNFT의 메타데이터는 아래 다이어그램에 표시되고 설명된 대로 여러 번 해싱됩니다:

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
{% node label="Collection Hash (V2에서 새로 추가)" /%}
{% node label="Asset Data Hash (V2에서 새로 추가)" /%}
{% node label="Flags (V2에서 새로 추가)" /%}
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

먼저 메타데이터가 keccak-256 해시 함수를 사용하여 해싱됩니다. Keccak-256은 SHA-256보다 훨씬 강력하며 Ethereum과 같은 다른 블록체인뿐만 아니라 Solana에서도 사용됩니다.

메타데이터가 해싱된 다음 `seller_fee_basis_points`와 함께 다시 해싱된다는 점에 주목하세요. 이렇게 하면 마켓플레이스가 전체 `MetadataArgs` 구조체(최대 457바이트 길이가 될 수 있음)를 전달할 필요 없이 판매자 수수료 베이시스 포인트를 검증하기가 더 쉬워집니다. 대신 이미 해싱된 32바이트 배열의 `MetadataArgs`와 `u16`(2바이트) `seller_fee_basis_points`를 전달할 수 있으며, 이를 함께 해싱하여 데이터 해시를 재생성할 수 있습니다.

```rust
/// 메타데이터의 해시를 계산합니다.
///
/// 해시는 메타데이터 바이트의 keccak256 해시로 계산되며,
/// 이는 `seller_fee_basis_points`와 함께 해싱됩니다.
pub fn hash_metadata(metadata: &MetadataArgs) -> Result<[u8; 32]> {
    let hash = keccak::hashv(&[metadata.try_to_vec()?.as_slice()]);
    // 새 데이터 해시 계산.
    Ok(keccak::hashv(&[
        &hash.to_bytes(),
        &metadata.seller_fee_basis_points.to_le_bytes(),
    ])
    .to_bytes())
}
```

다음으로 창작자 배열이 개별적으로 해싱됩니다.

```rust
/// 창작자의 해시를 계산합니다.
///
/// 해시는 창작자 바이트의 keccak256 해시로 계산됩니다.
pub fn hash_creators(creators: &[Creator]) -> [u8; 32] {
    // 창작자 Vec를 바이트 Vec로 변환
    let creator_data = creators
        .iter()
        .map(|c| [c.address.as_ref(), &[c.verified as u8], &[c.share]].concat())
        .collect::<Vec<_>>();
    // 해시 계산
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

이어서 컬렉션 및 자산 데이터 해시가 계산됩니다:

```rust
/// `LeafSchemaV2`에 대한 컬렉션의 해시를 계산합니다(`None`인 경우 기본값 제공).
pub fn hash_collection_option(collection: Option<Pubkey>) -> Result<[u8; 32]> {
    let collection_key = collection.unwrap_or(DEFAULT_COLLECTION);
    Ok(keccak::hashv(&[collection_key.as_ref()]).to_bytes())
}

/// `LeafSchemaV2`에 대한 자산 데이터의 해시를 계산합니다(`None`인 경우 기본값 제공).
pub fn hash_asset_data_option(asset_data: Option<&[u8]>) -> Result<[u8; 32]> {
    let data = asset_data.unwrap_or(b""); // None을 빈 데이터로 처리
    Ok(keccak::hashv(&[data]).to_bytes())
}

```

데이터 해시와 창작자 해시는 리프를 고유하게 식별하는 데 필요한 다른 정보와 함께 리프 스키마에 추가됩니다.

데이터와 창작자 해시의 분리는 `seller_fee_basis_points`와 유사한 이유로 수행됩니다. 마켓플레이스가 창작자 배열을 검증하려는 경우 이미 해싱된 32바이트 배열의 `MetadataArgs`를 창작자 배열과 함께 전달할 수 있습니다. 창작자 배열의 값들을 평가한 다음 `creator_hash`로 해싱하고 다른 기존 정보와 결합하여 리프 스키마로 만들 수 있습니다. Bubblegum V1은 `LeafSchemaV1`을 사용하고 Bubblegum V2는 `LeafSchemaV2`를 사용합니다.

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

데이터, 창작자, 컬렉션 및 자산 데이터 해시 외에도 리프 스키마에는 다음과 같은 다른 항목들이 포함됩니다:

* nonce: 이는 트리의 각 리프에 대해 고유한 "한 번 사용되는 번호" 값입니다. 머클 트리 리프가 고유하도록 보장하는 데 필요합니다. 실제로는 자산 증명과 마찬가지로 오프체인 인덱서에서 검색됩니다.
* id - 이 자산 ID는 고정된 접두사, 머클 트리 Pubkey 및 nonce로부터 파생된 PDA입니다.
* owner - cNFT 소유자의 Pubkey로, 일반적으로 사용자의 지갑입니다.
* delegate - cNFT의 위임자입니다. 기본적으로 이는 사용자의 지갑이지만 `delegate` Bubblegum 명령어로 설정할 수 있습니다.
* flags - 이는 NFT 상태에 대한 추가 정보가 있는 비트마스크입니다. 비트 0은 자산 수준에서의 동결 상태(소유자에 의한)이고 비트 1은 컬렉션 수준에서 영구 위임자에 의한 동결 상태입니다. 둘 다 적절한 권한에 의해 변경될 수 있습니다. 비트 3은 아무도 재설정할 수 없고 소울바운드 자산에 사용되는 일반적인 `nonTransferable` 플래그입니다. 다른 비트들은 향후 사용을 위해 예약되어 있습니다.

머클 트리에 존재하는 32바이트 리프 노드를 생성하기 위해 전체 리프 스키마는 스키마 버전에 따라 다음과 같이 해싱됩니다:

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

리프 변경을 포함하는 Bubblegum 작업(`transfer`, `delegate`, `burn` 등)은 머클 트리 변경을 검증하기 위해 리프 스키마 버전에 따라 `spl-account-compression` 또는 `mpl-account-compression`에 "이전" 및 "이후" 해싱된 리프 노드를 전송합니다.

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
