---
title: デシリアライズ
metaTitle: デシリアライズ | Core
description: Metaplex Coreパッケージを使って、アセット/コレクション/プラグインのアカウントをデシリアライズする方法を学びます。
---

Core上のデジタルアセットは、ベースアセットデータとプラグインの両方を含む、ちょうど「1つのオンチェーンアカウント」で構成されています。

つまり、そのデータを読むにはデシリアライズの方法を理解する必要があります。

JavaScriptでは、単一の関数でベースアセットデータとプラグインを同時にデシリアライズできます。Rustでは、不要なコンピュートやスタックオーバーフローを避けるため、ベースアセットと必要なプラグインのみを個別にデシリアライズするのが望ましいです。

## アセットのデシリアライズ

`Asset`アカウントのデシリアライズで得られる情報:

- **Owner**: アセットの所有者
- **Update Authority**: アセットの更新権限、またはコレクションに属している場合はそのコレクションのアドレス
- **Name**: アセット名
- **Uri**: オフチェーンメタデータへのURI

{% dialect-switcher title="Assetのデシリアライズ" %}

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

## コレクションのデシリアライズ

`Collection`アカウントのデシリアライズで得られる情報:

- **Update Authority**: コレクションおよびその内の全アセットに対する更新権限
- **Name**: コレクション名
- **Uri**: コレクションのオフチェーンメタデータへのURI
- **Num Minted**: コレクションでミント済みのアセット数
- **Current size**: 現在コレクションに含まれるアセット数

{% dialect-switcher title="Collectionのデシリアライズ" %}
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

## プラグインのデシリアライズ

前述のとおり、
- **JavaScript**では、アセット全体を1つの変数としてデシリアライズし、その中からプラグインのデータへアクセスできます。
- **Rust**では、アカウントサイズが大きくスタック制限に抵触しないよう、必要なプラグインのみを個別にデシリアライズします。

{% dialect-switcher title="プラグインのデシリアライズ" %}
{% dialect title="JavaScript" id="js" %}

```ts
const assetV1 = await fetchAsset(
  umi,
  publicKey('11111111111111111111111111111111')
)

// Attributesプラグインのデータのみを取り出す例
let attributes_plugin = assetV1.attributes

// Royaltiesプラグインのデータのみを取り出す例
let royalties_plugin = assetV1.royalties
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
// CoreアセットのAccountInfoから、アセット上に保存されたAttributesプラグインをデシリアライズする例
let attributes_plugin =
    fetch_plugin::<BaseAssetV1, Attributes>(&account_info, PluginType::Attributes).unwrap();

// CoreコレクションのAccountInfoから、コレクション上に保存されたRoyaltiesプラグインをデシリアライズする例
let royalties_plugin =
    fetch_plugin::<BaseCollectionV1, Royalties>(&account_info, PluginType::Royalties).unwrap();
```

{% /dialect %}
{% /dialect-switcher %}

