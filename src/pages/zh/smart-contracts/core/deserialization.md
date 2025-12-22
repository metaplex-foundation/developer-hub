---
title: 反序列化
metaTitle: 反序列化 | Core
description: 了解如何使用 Metaplex Core 包反序列化 Asset 账户、Collection 账户和插件。
---

Core 上的数字资产由**一个链上账户**组成，该账户包含基础资产数据和插件。

这意味着如果我们想读取这些数据，我们需要学习如何反序列化它。

在 Javascript 中，我们可以使用单个函数反序列化基础资产数据和插件。在 Rust 中，我们应该分别反序列化基础资产和仅需要的插件，以避免不必要的计算使用并防止堆栈溢出。

## 反序列化 Assets

反序列化 `Asset` 账户将返回以下信息：

- **Owner**：资产的所有者
- **Update Authority**：资产的权限，如果是集合的一部分则为集合地址
- **Name**：Asset 名称
- **Uri**：指向资产链下元数据的 uri

{% dialect-switcher title="反序列化 Asset" %}

{% dialect title="JavaScript" id="js" %}
```ts
const accountData = await umi.rpc.getAccount(
  publicKey('11111111111111111111111111111111')
)

if (!accountData.exists) throw 'Account does not exist'

const assetV1 = deserializeAssetV1(accountData)

console.log({ assetData })
```
{% /dialect %}

{% dialect title="Rust" id="rust" %}
```rust
let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();

let account = rpc_client.get_account(&asset).await.unwrap();

let asset_v1 = BaseAssetV1::from_bytes(&account.data).unwrap();

println!("assetV1: {:?}", asset_v1);
```
{% /dialect %}

{% dialect title="Anchor" id="anchor" %}
```rust
let asset = ctx.accounts.asset;

let data = asset.try_borrow_data()?;

let asset_v1 = BaseAssetV1::from_bytes(&data.as_ref())?;

println!("assetV1: {:?}", asset_v1);
```
{% /dialect %}

{% /dialect-switcher %}

## 反序列化 Collections

反序列化 `Collection` 账户将返回以下信息：

- **Update Authority**：集合及其内部所有资产的权限
- **Name**：集合名称
- **Uri**：指向集合链下元数据的 uri
- **Num Minted**：集合中铸造的资产数量
- **Current size**：集合中当前的资产数量

{% dialect-switcher title="反序列化 Collection" %}
{% dialect title="JavaScript" id="js" %}

```ts
const accountData = await umi.rpc.getAccount(
  publicKey('11111111111111111111111111111111')
)

if (!accountData.exists) throw 'Account does not exist'

const collectionV1 = deserializeCollectionV1(accountData)

console.log({ assetData })
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

let collection = Pubkey::from_str("11111111111111111111111111111111").unwrap();

let account = rpc_client.get_account(&collection).await.unwrap();

let collection_v1 = CollectionV1::from_bytes(&account.data).unwrap();

println!("collection_V1: {:?}", collection_v1);
```

{% /dialect %}

{% dialect title="Anchor" id="anchor" %}

```rust
let collection = ctx.accounts.collection;

let data = collection.try_borrow_data()?;

let collection_v1 = BaseCollectionV1::from_bytes(&data.as_ref())?;

println!("collection_V1: {:?}", collection_v1);
```

{% /dialect %}

{% /dialect-switcher %}

## 反序列化插件

如前所述：
- 使用 **Javascript**，我们可以将整个资产反序列化为单个变量，在本节中我们将看到如何访问与插件关联的特定数据。
- 使用 **Rust**，我们需要反序列化特定的插件数据，以避免由于账户大小导致的堆栈违规。

{% dialect-switcher title="反序列化插件" %}
{% dialect title="JavaScript" id="js" %}

```ts
const assetV1 = await fetchAsset(
  umi,
  publicKey('11111111111111111111111111111111')
)

// 仅保存 Attributes 插件反序列化数据的示例
let attributes_plugin = assetV1.attributes

// 仅保存 Royalties 插件反序列化数据的示例
let royalties_plugin = assetV1.royalties
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
// 使用 Core Asset 账户的 AccountInfo 反序列化存储在资产上的 Attributes 插件的示例
let attributes_plugin =
    fetch_plugin::<BaseAssetV1, Attributes>(&account_info, PluginType::Attributes).unwrap();

// 使用 Core Collection 账户的 AccountInfo 反序列化存储在资产上的 Royalties 插件的示例
let royalties_plugin =
    fetch_plugin::<BaseCollectionV1, Royalties>(&account_info, PluginType::Royalties).unwrap();
```

{% /dialect %}
{% /dialect-switcher %}
