---
title: NFTデータのハッシュ化
metaTitle: NFTデータのハッシュ化 - Bubblegum V2
description: BubblegumでNFTデータがどのようにハッシュ化されるかについて詳しく学びます。
created: '2025-01-15'
updated: '2026-02-24'
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

**NFTデータのハッシュ化**では、圧縮NFTメタデータがkeccak-256ハッシュを使用してマークルツリーのリーフに変換される方法を説明します。このページでは、MetadataArgsV2構造、データハッシュ、クリエイターハッシュ、コレクションハッシュ、LeafSchemaV2形式について説明します。

- MetadataArgsV2はseller_fee_basis_pointsとともにハッシュ化されてデータハッシュが作成される
- クリエイター配列は個別にハッシュ化されてクリエイターハッシュになる
- 両方のハッシュはLeafSchemaV2の他のフィールドと結合されて最終的なリーフノードが生成される
- LeafSchemaV2はV1と比較してcollection_hash、asset_data_hash、flagsを追加している

前のセクションで、Bubblegumマークルツリーのリーフノードはそれぞれ圧縮NFT（cNFT）のデータをハッシュ化することで得られると述べました。しかし、これは正確にはどのように行われるのでしょうか？cNFTのメタデータから始めます。Bubblegum V2の各cNFTは、ミント命令への引数として以下のメタデータ構造でミントされることに注意してください。Bubblegum v1は代わりにMetadataArgsを使用します：

```rust
pub struct MetadataArgsV2 {
    /// アセットの名前
    pub name: String,
    /// アセットのシンボル
    pub symbol: String,
    /// アセットを表すJSONを指すURI
    pub uri: String,
    /// 二次販売で作成者に行くロイヤリティベーシスポイント（0-10000）
    pub seller_fee_basis_points: u16,
    /// 不変、一度変更されると、このメタデータのすべての販売は二次とみなされる。
    pub primary_sale_happened: bool,
    /// データ構造が可変かどうか、デフォルトは不変
    pub is_mutable: bool,
    /// トークン標準。現在、`NonFungible`のみが許可されている。
    pub token_standard: Option<TokenStandard>,
    /// 作成者配列
    pub creators: Vec<Creator>,
    /// コレクション。V2では単に`Pubkey`であり、常に検証済みとみなされる。
    pub collection: Option<Pubkey>,
}
```

cNFTのメタデータは、図に示され以下に説明されているように複数回ハッシュ化されます：

{% diagram %}

{% node %}
{% node #metadata label="メタデータ引数" theme="blue" /%}
{% node label="名前" /%}
{% node label="シンボル" /%}
{% node label="URI" /%}
{% node label="販売者手数料ベーシスポイント" /%}
{% node label="主要販売が発生" /%}
{% node label="可変性" /%}
{% node label="トークン標準" /%}
{% node label="コレクション" /%}
{% node label="作成者" /%}
{% /node %}

{% node #seller-fee-basis-points parent="metadata" y="305" label="販売者手数料ベーシスポイント" theme="blue" /%}

{% node #creators parent="metadata" y="370" label="作成者" theme="blue" /%}

{% node parent="metadata" x="300" y="150" %}
{% node #data-hash label="データハッシュ" theme="mint" /%}
{% node theme="transparent" %}
ハッシュ(メタデータ引数, \
販売者手数料ベーシスポイント)
{% /node %}
{% /node %}

{% node parent="creators" x="300" %}
{% node #creator-hash label="クリエイターハッシュ" theme="mint" /%}
{% node theme="transparent" label="ハッシュ(作成者)" /%}
{% /node %}

{% node parent="data-hash" x="250" %}
{% node #leaf-schema label="リーフスキーマ V2" theme="blue" /%}
{% node label="ID" /%}
{% node label="所有者" /%}
{% node label="デリゲート" /%}
{% node label="ノンス" /%}
{% node label="データハッシュ" /%}
{% node label="クリエイターハッシュ" /%}
{% node label="コレクションハッシュ（V2で追加）" /%}
{% node label="アセットデータハッシュ（V2で追加）" /%}
{% node label="フラグ（V2で追加）" /%}
{% /node %}

{% node parent="leaf-schema" x="200" %}
{% node #leaf-node label="リーフノード" theme="mint" /%}
{% node theme="transparent" label="ハッシュ(リーフスキーマ)" /%}
{% /node %}

{% edge from="metadata" to="data-hash" /%}
{% edge from="seller-fee-basis-points" to="data-hash" /%}
{% edge from="creators" to="creator-hash" /%}

{% edge from="data-hash" to="leaf-schema" /%}
{% edge from="creator-hash" to="leaf-schema" /%}

{% edge from="leaf-schema" to="leaf-node" /%}

{% /diagram %}

まず、メタデータはkeccak-256ハッシュ関数を使用してハッシュ化されます。Keccak-256はSHA-256よりもはるかに強力であり、SolanaだけでなくEthereumなどの他のブロックチェーンでも使用されています。

メタデータはまずハッシュ化され、次に`seller_fee_basis_points`と一緒に再度ハッシュ化されることに注意してください。これにより、マーケットプレイスは販売者手数料ベーシスポイントを検証しやすくなります。完全な`MetadataArgs`構造体（最大457バイト）を渡す必要がなく、代わりに既にハッシュ化された32バイトの`MetadataArgs`配列と`u16`（2バイト）の`seller_fee_basis_points`を渡すだけで、それらをハッシュ化してデータハッシュを再現できます。

```rust
/// メタデータのハッシュを計算します。
///
/// ハッシュはメタデータバイトのkeccak256ハッシュとして計算され、
/// 次に`seller_fee_basis_points`でハッシュされます。
pub fn hash_metadata(metadata: &MetadataArgsV2) -> Result<[u8; 32]> {
    let hash = keccak::hashv(&[metadata.try_to_vec()?.as_slice()]);
    // 新しいデータハッシュを計算します。
    Ok(keccak::hashv(&[
        &hash.to_bytes(),
        &metadata.seller_fee_basis_points.to_le_bytes(),
    ])
    .to_bytes())
}
```

次に、クリエイター配列が個別にハッシュ化されます。

```rust
/// クリエイターのハッシュを計算します。
///
/// ハッシュはクリエイターバイトのkeccak256ハッシュとして計算されます。
pub fn hash_creators(creators: &[Creator]) -> [u8; 32] {
    // クリエイターVecをバイトVecに変換します
    let creator_data = creators
        .iter()
        .map(|c| [c.address.as_ref(), &[c.verified as u8], &[c.share]].concat())
        .collect::<Vec<_>>();
    // ハッシュを計算します
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

次にコレクションとアセットデータハッシュが計算されます：

```rust
/// `LeafSchemaV2`用のコレクションのハッシュを計算します（`None`の場合はデフォルトを提供）。
pub fn hash_collection_option(collection: Option<Pubkey>) -> Result<[u8; 32]> {
    let collection_key = collection.unwrap_or(DEFAULT_COLLECTION);
    Ok(keccak::hashv(&[collection_key.as_ref()]).to_bytes())
}

/// `LeafSchemaV2`用のアセットデータのハッシュを計算します（`None`の場合はデフォルトを提供）。
pub fn hash_asset_data_option(asset_data: Option<&[u8]>) -> Result<[u8; 32]> {
    let data = asset_data.unwrap_or(b""); // Noneを空データとして扱います
    Ok(keccak::hashv(&[data]).to_bytes())
}

```

データハッシュとクリエイターハッシュは、リーフを一意に識別するために必要な他の情報とともにリーフスキーマに追加されます。

データハッシュとクリエイターハッシュを分離する理由は、`seller_fee_basis_points`と同様です。マーケットプレイスがクリエイター配列を検証したい場合、クリエイター配列と一緒に既にハッシュ化された32バイトの`MetadataArgs`配列を渡すことができます。クリエイター配列の値を評価し、`creator_hash`にハッシュ化して、リーフスキーマ内の他の既存情報と結合できます。Bubblegum V1は`LeafSchemaV1`を使用し、Bubblegum V2は`LeafSchemaV2`を使用します。

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

データ、クリエイター、コレクション、アセットデータハッシュ以外に、リーフスキーマには以下の項目が含まれています：

* nonce：ツリー上の各リーフに固有の「一度だけ使用される数値」です。マークルツリーのリーフが一意であることを保証するために必要です。実際には、アセットプルーフと同様に、オフチェーンインデクサーから取得されます。
* id - このアセットIDは、固定プレフィックス、マークルツリーの公開鍵、ノンスから派生したPDAです。
* owner - cNFT所有者の公開鍵。通常はユーザーのウォレットです。
* delegate - cNFTのデリゲート。デフォルトではユーザーのウォレットですが、`delegate` Bubblegum命令で設定できます。
* flags - NFTのステータスに関する追加情報を持つビットマスクです。ビット0はアセットレベル（所有者による）の凍結ステータスで、ビット1はコレクションレベルでの永久デリゲートによる凍結ステータスです。どちらも適切な権限によって変更できます。ビット3は、誰もリセットできない一般的な`nonTransferable`フラグで、ソウルバウンドアセットに使用されます。その他のビットは将来の使用のために予約されています。

マークルツリーに存在する32バイトのリーフノードを作成するために、リーフスキーマ全体がスキーマバージョンに応じて以下のようにハッシュ化されます：

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

リーフを変更するBubblegum操作（`transfer`、`delegate`、`burn`など）は、マークルツリーの変更を検証するために、リーフスキーマバージョンに応じて「変更前」と「変更後」のハッシュ化されたリーフノードを`spl-account-compression`または`mpl-account-compression`に送信します。

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
