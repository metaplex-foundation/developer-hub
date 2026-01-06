---
title: 哈希NFT数据
metaTitle: 哈希NFT数据 | Bubblegum V2
description: 了解更多关于Bubblegum上NFT数据如何被哈希的信息。
---

在前面的章节中，我们说过Bubblegum默克尔树中的每个叶节点是通过哈希压缩NFT（cNFT）的数据获得的。但这究竟是如何做到的呢？我们从cNFT的元数据开始。Bubblegum V2的每个cNFT在铸造指令中使用以下元数据结构作为参数，注意Bubblegum v1使用的是MetadataArgs：

```rust
pub struct MetadataArgsV2 {
    /// 资产名称
    pub name: String,
    /// 资产符号
    pub symbol: String,
    /// 指向代表资产的JSON的URI
    pub uri: String,
    /// 二级销售中给予创作者的版税基点（0-10000）
    pub seller_fee_basis_points: u16,
    /// 不可变，一旦翻转，此元数据的所有销售都被视为二级销售
    pub primary_sale_happened: bool,
    /// 数据结构是否可变，默认不可变
    pub is_mutable: bool,
    /// 代币标准。目前只允许`NonFungible`
    pub token_standard: Option<TokenStandard>,
    /// 创作者数组
    pub creators: Vec<Creator>,
    /// 集合。注意在V2中它只是一个`Pubkey`，始终被视为已验证
    pub collection: Option<Pubkey>,
}
```

cNFT的元数据被多次哈希，如图表所示并在下面描述：

{% diagram %}

{% node %}
{% node #metadata label="元数据参数" theme="blue" /%}
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
{% node #data-hash label="数据哈希" theme="mint" /%}
{% node theme="transparent" %}
Hash(Metadata Args, \
Seller Fee Basis Points)
{% /node %}
{% /node %}

{% node parent="creators" x="300" %}
{% node #creator-hash label="创作者哈希" theme="mint" /%}
{% node theme="transparent" label="Hash(Creators)" /%}
{% /node %}

{% node parent="data-hash" x="250" %}
{% node #leaf-schema label="叶子模式 V2" theme="blue" /%}
{% node label="ID" /%}
{% node label="Owner" /%}
{% node label="Delegate" /%}
{% node label="Nonce" /%}
{% node label="Data Hash" /%}
{% node label="Creator Hash" /%}
{% node label="Collection Hash（V2新增）" /%}
{% node label="Asset Data Hash（V2新增）" /%}
{% node label="Flags（V2新增）" /%}
{% /node %}

{% node parent="leaf-schema" x="200" %}
{% node #leaf-node label="叶节点" theme="mint" /%}
{% node theme="transparent" label="Hash(叶子模式)" /%}
{% /node %}

{% edge from="metadata" to="data-hash" /%}
{% edge from="seller-fee-basis-points" to="data-hash" /%}
{% edge from="creators" to="creator-hash" /%}

{% edge from="data-hash" to="leaf-schema" /%}
{% edge from="creator-hash" to="leaf-schema" /%}

{% edge from="leaf-schema" to="leaf-node" /%}

{% /diagram %}

首先，使用keccak-256哈希函数对元数据进行哈希。Keccak-256比SHA-256强得多，在Solana以及以太坊等其他区块链中使用。

请注意，元数据被哈希后，再与`seller_fee_basis_points`一起再次哈希。这使得市场更容易验证卖方费用基点，因为它们不必传递完整的`MetadataArgs`结构（可能长达457字节）。相反，它们可以传递一个32字节的已哈希`MetadataArgs`数组和`u16`（2字节）的`seller_fee_basis_points`，通过将它们哈希在一起，可以重新创建数据哈希。

```rust
/// 计算元数据的哈希值。
///
/// 哈希计算为元数据字节的keccak256哈希，
/// 然后与`seller_fee_basis_points`一起哈希。
pub fn hash_metadata(metadata: &MetadataArgs) -> Result<[u8; 32]> {
    let hash = keccak::hashv(&[metadata.try_to_vec()?.as_slice()]);
    // 计算新的数据哈希。
    Ok(keccak::hashv(&[
        &hash.to_bytes(),
        &metadata.seller_fee_basis_points.to_le_bytes(),
    ])
    .to_bytes())
}
```

接下来，创作者数组单独进行哈希。

```rust
/// 计算创作者的哈希值。
///
/// 哈希计算为创作者字节的keccak256哈希。
pub fn hash_creators(creators: &[Creator]) -> [u8; 32] {
    // 将创作者Vec转换为字节Vec
    let creator_data = creators
        .iter()
        .map(|c| [c.address.as_ref(), &[c.verified as u8], &[c.share]].concat())
        .collect::<Vec<_>>();
    // 计算哈希
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

然后是集合和资产数据哈希：

```rust
/// 为`LeafSchemaV2`计算集合的哈希（如果为`None`则提供默认值）。
pub fn hash_collection_option(collection: Option<Pubkey>) -> Result<[u8; 32]> {
    let collection_key = collection.unwrap_or(DEFAULT_COLLECTION);
    Ok(keccak::hashv(&[collection_key.as_ref()]).to_bytes())
}

/// 为`LeafSchemaV2`计算资产数据的哈希（如果为`None`则提供默认值）。
pub fn hash_asset_data_option(asset_data: Option<&[u8]>) -> Result<[u8; 32]> {
    let data = asset_data.unwrap_or(b""); // 将None视为空数据
    Ok(keccak::hashv(&[data]).to_bytes())
}

```

数据哈希和创作者哈希与唯一标识叶子所需的其他信息一起添加到叶子模式中。

数据和创作者哈希的分离是出于与`seller_fee_basis_points`类似的原因——如果市场想要验证创作者数组，它可以传递一个32字节的已哈希`MetadataArgs`数组以及创作者数组。创作者数组中的值可以被评估，然后哈希成`creator_hash`并与其他现有信息组合到叶子模式中。Bubblegum V1使用`LeafSchemaV1`，而Bubblegum V2使用`LeafSchemaV2`。

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

除了数据、创作者、集合和资产数据哈希外，叶子模式还包含以下其他项：

* nonce：这是一个"一次性使用数字"值，对树上的每个叶子都是唯一的。它需要确保默克尔树叶子是唯一的。实际上，它是从链下索引器检索的，类似于资产证明。
* id - 此资产ID是从固定前缀、默克尔树Pubkey和nonce派生的PDA。
* owner - cNFT所有者的Pubkey，通常是用户的钱包。
* delegate - cNFT的委托人。默认情况下这是用户的钱包，但可以通过`delegate` Bubblegum指令设置。
* flags - 这是一个位掩码，包含关于NFT状态的附加信息。位0是资产级别的冻结状态（由所有者），位1是集合级别的永久委托人冻结状态。两者都可以由正确的权限更改。位3是通用的`nonTransferable`标志，任何人都不能重置，用于灵魂绑定资产。其他位保留供将来使用。

要创建存在于默克尔树上的32字节叶节点，整个叶子模式按如下方式进行哈希，取决于模式版本：

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

涉及更改叶子的Bubblegum操作（`transfer`、`delegate`、`burn`等）将向`spl-account-compression`或`mpl-account-compression`发送"之前"和"之后"的哈希叶节点，具体取决于叶子模式版本以验证默克尔树更改。
