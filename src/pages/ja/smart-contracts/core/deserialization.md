---
title: デシリアライゼーション
metaTitle: デシリアライゼーション | Core
description: Metaplex Coreパッケージを使用したAssetアカウント、Collectionアカウント、プラグインのデシリアライゼーションについて学びます。
updated: '01-31-2026'
keywords:
  - deserialize asset
  - read asset data
  - account parsing
  - plugin deserialization
about:
  - Account deserialization
  - Data parsing
  - Plugin reading
proficiencyLevel: Advanced
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
---
Core上のデジタルアセットは、ベースアセットデータとプラグインの両方を含む**1つのオンチェーンアカウント**で構成されています。
つまり、そのデータを読み取るには、デシリアライズの方法を学ぶ必要があります。
JavaScriptでは、単一の関数を使用してベースアセットデータとプラグインの両方をデシリアライズできます。Rustでは、不要な計算使用を避け、スタックオーバーフローを防ぐために、ベースアセットと必要なプラグインのみを別々にデシリアライズする必要があります。
## Assetのデシリアライズ
`Asset`アカウントをデシリアライズすると、以下の情報が返されます：
- **Owner**: アセットの所有者
- **Update Authority**: アセットに対する権限、またはコレクションに属している場合はコレクションアドレス
- **Name**: アセット名
- **Uri**: アセットのオフチェーンメタデータへのURI
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
## Collectionのデシリアライズ
`Collection`アカウントをデシリアライズすると、以下の情報が返されます：
- **Update Authority**: コレクションとその中のすべてのアセットに対する権限
- **Name**: コレクション名
- **Uri**: コレクションのオフチェーンメタデータへのURI
- **Num Minted**: コレクション内でミントされたアセットの数
- **Current size**: コレクション内の現在のアセット数
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
前述の通り、
- **Javascript**を使用する場合、アセット全体を単一の変数にデシリアライズできます。このセクションでは、プラグインに関連付けられた特定のデータにアクセスする方法を説明します。
- **Rust**を使用する場合、アカウントのサイズによるスタック違反を避けるために、特定のプラグインデータをデシリアライズする必要があります。
{% dialect-switcher title="プラグインのデシリアライズ" %}
{% dialect title="JavaScript" id="js" %}
```ts
const assetV1 = await fetchAsset(
  umi,
  publicKey('11111111111111111111111111111111')
)
// Attributesプラグインのデシリアライズされたデータのみを保存する例
let attributes_plugin = assetV1.attributes
// Royaltiesプラグインのデシリアライズされたデータのみを保存する例
let royalties_plugin = assetV1.royalties
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust
// Core AssetアカウントのAccountInfoを使用して、アセットに保存されているAttributesプラグインをデシリアライズする例
let attributes_plugin =
    fetch_plugin::<BaseAssetV1, Attributes>(&account_info, PluginType::Attributes).unwrap();
// Core CollectionアカウントのAccountInfoを使用して、アセットに保存されているRoyaltiesプラグインをデシリアライズする例
let royalties_plugin =
    fetch_plugin::<BaseCollectionV1, Royalties>(&account_info, PluginType::Royalties).unwrap();
```
{% /dialect %}
{% /dialect-switcher %}
