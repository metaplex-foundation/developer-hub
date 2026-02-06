---
title: AppDataプラグイン
metaTitle: AppDataプラグイン | Metaplex Core
description: AppDataプラグインでCore NFTに任意のデータを保存します。サードパーティアプリ、ゲーム状態、またはカスタムメタデータ用の安全でパーティション化されたストレージを作成します。
updated: '01-31-2026'
keywords:
  - AppData plugin
  - NFT data storage
  - game state
  - on-chain storage
about:
  - Data storage
  - Third-party integration
  - Custom metadata
proficiencyLevel: Advanced
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
faqs:
  - q: AppDataとAttributesプラグインの違いは何ですか？
    a: Attributesはupdate authorityによって制御されるキー値文字列を保存します。AppDataは別のData Authorityによって制御される任意のデータを保存するため、サードパーティアプリケーションに最適です。
  - q: 1つのAssetに複数のAppDataプラグインを持てますか？
    a: はい。各AppDataプラグインは異なるData Authorityを持つことができ、複数のサードパーティアプリが同じAssetにデータを保存できます。
  - q: 既存のAppDataをどのように更新しますか？
    a: 新しいデータでwriteData()を呼び出します。これにより既存のデータが完全に置き換えられます - 部分的な更新はありません。
  - q: AppDataはDASでインデックスされますか？
    a: はい。JSONとMsgPackスキーマは自動的にデシリアライズされ、インデックスされます。Binaryはbase64として保存されます。
  - q: LinkedAppDataとは何ですか？
    a: LinkedAppDataはCollectionに追加され、各Assetに個別にAppDataを追加することなく、Data AuthorityがそのCollection内の任意のAssetに書き込むことができます。
---
**AppDataプラグイン**は、Core Assetsに安全でパーティション化されたデータストレージを提供します。サードパーティアプリケーションは、Data Authorityによって制御される排他的な書き込みアクセスで任意のデータ（JSON、MsgPack、またはbinary）を保存および読み取ることができます。 {% .lead %}
{% callout title="学べること" %}

- AssetsとCollectionsにAppDataを追加
- 安全な書き込みのためのData Authoritiesの設定
- データスキーマの選択（JSON、MsgPack、Binary）
- オンチェーンとオフチェーンからのデータの読み書き
{% /callout %}

## 概要

**AppData**プラグインは、制御された書き込みアクセスでAssetsに任意のデータを保存します。Data Authorityのみがプラグインのデータセクションに書き込むことができ、安全なサードパーティ統合を可能にします。

- JSON、MsgPack、またはBinaryデータを保存
- Data Authorityが排他的な書き込み権限を持つ
- DASによって自動的にインデックス（JSON/MsgPack）
- コレクション全体の書き込み用LinkedAppDataバリアント

## 対象外

Oracle検証（[Oracleプラグイン](/smart-contracts/core/external-plugins/oracle)を参照）、オンチェーン属性（[Attributesプラグイン](/smart-contracts/core/plugins/attribute)を参照）、およびオフチェーンメタデータストレージ。

## クイックスタート

**ジャンプ先:** [Assetに追加](#assetへのappdataプラグインの追加) · [データの書き込み](#appdataプラグインへのデータの書き込み) · [データの読み取り](#appdataプラグインからのデータの読み取り)

1. Data Authorityアドレスを持つAppDataプラグインを追加
2. スキーマを選択：JSON、MsgPack、またはBinary
3. `writeData()`を使用してデータを書き込み（Data Authorityとして署名が必要）
4. DASまたは直接アカウントフェッチでデータを読み取り

## AppDataプラグインとは？

`AppData`外部プラグインは、`dataAuthority`が書き込むことができる任意のデータを保存および含みます。これは`ExternalRegistryRecord`に保存される全体的なプラグインauthorityとは異なり、authority を更新/取り消したり、プラグインの他のメタデータを変更したりすることはできないことに注意してください。
`AppData`は、特定のauthorityのみが変更および書き込むことができるAssetのパーティションデータ領域のようなものと考えてください。
これは、サードパーティのサイト/アプリが製品/アプリ内で特定の機能を実行するために必要なデータを保存するのに役立ちます。

## 対応

|                       |     |
| --------------------- | --- |
| MPL Core Asset        | ✅  |
| MPL Core Collection\* | ✅  |
\* MPL Core Collectionsは`LinkedAppData`プラグインでも動作できます。

## LinkedAppDataプラグインとは？

`LinkedAppData`プラグインはCollections用に構築されています。コレクションに単一のプラグインアダプターを追加することで、コレクション内の任意のAssetに書き込むことができます。

## 引数

| 引数           | 値                       |
| ------------- | --------------------------- |
| dataAuthority | PluginAuthority             |
| schema        | ExternalPluginAdapterSchema |

### dataAuthority

{% dialect-switcher title="AttributeList" %}
{% dialect title="JavaScript" id="js" %}

```ts
const dataAuthority = {
  type: 'Address',
  address: publicKey('11111111111111111111111111111111'),
}
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::types::{PluginAuthority}
let data_authority = Some(PluginAuthority::Address {address: authority.key()}),
```

{% /dialect %}
{% /dialect-switcher %}

### schema

スキーマは`AppData`プラグイン内に保存されるデータのタイプを決定します。すべてのスキーマはDASによってインデックスされます。

| 引数               | DASサポート | 保存形式 |
| ----------------- | ------------- | --------- |
| Binary（生データ） | ✅            | base64    |
| Json              | ✅            | json      |
| MsgPack           | ✅            | json      |
データのインデックス時に`JSON`または`MsgPack`スキーマの読み取りにエラーがあった場合、binaryとして保存されます。
{% dialect-switcher title="`AppData`プラグインへのデータの書き込み" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { ExternalPluginAdapterSchema } from '@metaplex-foundation/mpl-core'
// Binary、Json、またはMsgPackから選択
const schema = ExternalPluginAdapterSchema.Json
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
// Binary、Json、またはMsgPackから選択
let schema = ExternalPluginAdapterSchema::Json
```

{% /dialect %}
{% /dialect-switcher %}

## AssetへのAppDataプラグインの追加

{% dialect-switcher title="MPL Core AssetへのAttributeプラグインの追加" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { addPlugin, ExternalPluginAdapterSchema } from '@metaplex-foundation/mpl-core'
const assetSigner = generateSigner(umi);
const dataAuthority = publicKey('11111111111111111111111111111111')
await create(umi, {
  asset: asset.publicKey,
  name: "My Asset",
  uri: "https://example.com/my-assets.json"
  plugins: [
        {
            type: 'AppData',
            dataAuthority,
            schema: ExternalPluginAdapterSchema.Json,
        },
    ],
}).sendAndConfirm(umi)
// または、既存のAssetにプラグインを追加することもできます
await addPlugin(umi, {
  asset,
  plugin: {
        type: 'AppData',
        dataAuthority,
        schema: ExternalPluginAdapterSchema.Json,
    },
})
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{
    instructions::AddExternalPluginAdapterV1Builder,
    types::{Attribute, Attributes, Plugin,
    ExternalPluginAdapterInitInfo, AppDataInitInfo,
    PluginAuthority},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn add_app_data_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let add_external_plugin_app_data_ix = AddExternalPluginAdapterV1Builder::new()
        .asset(asset)
        .payer(authority.publicKey())
        .init_info(ExternalPluginAdapterInitInfo::AppData(AppDataInitInfo {
            init_plugin_authority: Some(PluginAuthority::UpdateAuthority),
            data_authority: PluginAuthority::Address {address: app_data_authority.key()},
            schema: None,
        }))
        .instruction();
    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let add_data_plugin_tx = Transaction::new_signed_with_payer(
        &[add_external_plugin_app_data_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&add_data_plugin_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}

## AppDataプラグインへのデータの書き込み

dataAuthorityアドレスのみが`AppData`プラグインにデータを書き込むことができます。
`AppData`プラグインにデータを書き込むには、以下の引数を取る`writeData()`ヘルパーを使用します。

| 引数       | 値                                     |
| --------- | ----------------------------------------- |
| key       | { type: string, dataAuthority: publicKey} |
| authority | signer                                    |
| data      | 保存したい形式のデータ      |
| asset     | publicKey                                 |

### JSONのシリアライズ

{% dialect-switcher title="JSONのシリアライズ" %}
{% dialect title="JavaScript" id="js" %}

```ts
const json = {
  timeStamp: Date.now(),
  message: 'Hello, World!',
}
const data = new TextEncoder().encode(JSON.stringify(json))
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
// これは`serde`と`serde_json`クレートを使用します。
let struct_data = MyData {
    timestamp: 1234567890,
    message: "Hello World".to_string(),
};
let data = serde_json::to_vec(&struct_data).unwrap();
```

{% /dialect %}
{% /dialect-switcher %}

### MsgPackのシリアライズ

{% dialect-switcher title="MsgPackのシリアライズ" %}
{% dialect title="JavaScript" id="js" %}

```ts
// この実装はシリアライゼーションに`msgpack-lite`を使用します
const json = {
  timeStamp: Date.now(),
  message: 'Hello, World!',
}
const data = msgpack.encode(json)
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
// これは`serde`と`rmp-serde`クレートを使用します。
let data = MyData {
    timestamp: 1234567890,
    message: "Hello World".to_string(),
};
let data = rmp_serde::to_vec(&data).unwrap();
```

{% /dialect %}
{% /dialect-switcher %}

### Binaryのシリアライズ

Binaryは任意のデータを保存できるため、データのシリアライズとデシリアライズの方法を決定するのはあなた次第です。
{% dialect-switcher title="Binaryのシリアライズ" %}
{% dialect title="JavaScript" id="js" %}

```ts
// 以下の例は、`true`または`false`と見なされるバイトを作成するだけです。
const data = new Uint8Array([1, 0, 0, 1, 0])
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
// この例は、`bincode`でRust構造体をシリアライズする方法を示しています。
let data = MyData {
    timestamp: 1234567890,
    message: "Hello World".to_string(),
};
let data = bincode::serialize(&data).unwrap();
```

{% /dialect %}
{% /dialect-switcher %}

### データの書き込み

{% dialect-switcher title="MPL Core AssetへのAttributeプラグインの追加" %}
{% dialect title="JavaScript" id="js" %}

```ts
await writeData(umi, {
  key: {
    type: 'AppData',
    dataAuthority,
  },
  authority: dataAuthoritySigner,
  data: data,
  asset: asset.publicKey,
}).sendAndConfirm(umi)
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
/// ### Accounts:
///
///   0. `[writable]` asset
///   1. `[writable, optional]` collection
///   2. `[writable, signer]` payer
///   3. `[signer, optional]` authority
///   4. `[optional]` buffer
///   5. `[]` system_program
///   6. `[optional]` log_wrapper
// データ（Binary、Json、MsgPack）を保存用にバイトに変換する必要があります。
// これは選択したスキーマに応じていくつかの方法で実現できます。
let write_to_app_data_plugin_ix = WriteExternalPluginAdapterDataV1CpiBuilder::new()
    .asset(asset)
    .collection(collection)
    .payer(payer)
    .authority(authority)
    .buffer(None)
    .system_program(system_program)
    .log_wrapper(None)
    .key(ExternalPluginAdapterKey::AppData(PluginAuthority::Address {address: plugin_authority.key()}))
    .data(data)
    .instruction()
```

{% /dialect %}
{% /dialect-switcher %}

## AppDataプラグインからのデータの読み取り

データは、アカウントデータをプルするオンチェーンプログラムと外部ソースの両方で読み取ることができます。

### 生データのフェッチ

`AppData`プラグインに保存されているデータをデシリアライズする最初のステップは、生データをフェッチし、シリアライゼーション前にデータが保存される形式を指示するスキーマフィールドを確認することです。
{% dialect-switcher title="`AppData`生データのフェッチ" %}
{% dialect title="JavaScript" id="js" %}

```ts
const assetId = publicKey('11111111111111111111111111111111')
const dataAuthority = publicKey('33333333333333333333333333333333')
const asset = await fetchAsset(umi, assetId)
let appDataPlugin = asset.appDatas?.filter(
  (appData) => (appData.authority.address = dataAuthority)
)
let data
let schema
// 指定されたauthorityを持つ`AppData`プラグインが存在するか確認
if (appDataPlugin && appDataPlugin.length > 0) {
  // プラグインデータを`data`に保存
  data = appDataPlugin[0].data
  // プラグインスキーマを`schema`に保存
  schema = appDataPlugin[0].schema
}
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
let plugin_authority = ctx.accounts.authority.key();
let asset = BaseAssetV1::from_bytes(&data).unwrap();
// プラグインのAuthorityに基づいて`AppData`プラグインをフェッチします。
let plugin_key = ExternalPluginAdapterKey::AppData(PluginAuthority::Address {
    address: plugin_authority });
let app_data_plugin = fetch_external_plugin_adapter::<BaseAssetV1, AppData>(
        &account_info,
        Some(&base_asset),
        &plugin_key,
    )
    .unwrap();
let (data_offset, data_length) =
        fetch_external_plugin_adapter_data_info(&account_info, Some(&asset), &plugin_key)
            .unwrap();
// account_infoからapp_dataデータを取得
let data = account_info.data.borrow()[data_offset..data_offset + data_length].to_vec();
```

{% /dialect %}
{% /dialect-switcher %}

### デシリアライゼーション

データを取得したら、`AppData`プラグインにデータを書き込むために選択したスキーマに応じてデータをデシリアライズする必要があります。

#### JSONスキーマのデシリアライズ

{% dialect-switcher title="JSONのデシリアライズ" %}
{% dialect title="JavaScript" id="js" %}

```ts
// JS SDKにより、MsgPackスキーマのデシリアライゼーションは自動で行われ、
// デシリアライズされたデータは上記の生データの場所でアクセスできます。
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
// `JSON`スキーマには`serde`と`serde_json`クレートを使用する必要があります。
// 構造体の`derive`マクロに`Serialize`と`Deserialize`を追加する必要があります。
#[derive(Debug, Serialize, Deserialize)]
pub struct MyData {
    pub timestamp: u64,
    pub message: String,
}
let my_data: MyData = serde_json::from_slice(&data).unwrap();
println!("{:?}", my_data);
```

{% /dialect %}
{% /dialect-switcher %}

#### MsgPackスキーマのデシリアライズ

{% dialect-switcher title="MsgPackのデシリアライズ" %}
{% dialect title="JavaScript" id="js" %}

```ts
// JS SDKにより、MsgPackスキーマのデシリアライゼーションは自動で行われ、
// デシリアライズされたデータは上記の生データの場所でアクセスできます。
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
// `MsgPack`スキーマには`serde`と`rmp_serde`クレートを使用する必要があります。
// 構造体の`derive`マクロに`Serialize`と`Deserialize`を追加する必要があります。
#[derive(Debug, Serialize, Deserialize)]
pub struct MyData {
    pub timestamp: u64,
    pub message: String,
}
let my_data: MyData = rmp_serde::decode::from_slice(&data).unwrap();
println!("{:?}", my_data);
```

{% /dialect %}
{% /dialect-switcher %}

#### Binaryスキーマのデシリアライズ

**Binary**スキーマは任意のデータであるため、デシリアライゼーションは使用したシリアライゼーションに依存します。
{% dialect-switcher title="Binaryのデシリアライズ" %}
{% dialect title="JavaScript" id="js" %}

```js
// バイナリデータは任意であるため、アプリ/ウェブサイトが理解できる
// 使用可能な形式にデータを解析するための独自のデシリアライザを含める必要があります。
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
#[derive(Debug, Serialize, Deserialize)]
pub struct MyData {
    pub timestamp: u64,
    pub message: String,
}
// 以下の例では、`bincode`クレートを使用して
// 構造体にデシリアライズする方法を見ていきます。
let my_data: MyData = bincode::deserialize(&data).unwrap();
println!("{:?}", my_data);
```

{% /dialect %}
{% /dialect-switcher %}

## 一般的なエラー

### `Authority mismatch`

Data Authorityのみがデータを書き込めます。正しいキーペアで署名していることを確認してください。

### `Data too large`

データがアカウントサイズの制限を超えています。データを圧縮するか、複数のプラグインに分割することを検討してください。

### `Invalid schema`

データが宣言されたスキーマと一致しません。JSONが有効であるか、MsgPackが正しくエンコードされていることを確認してください。

## 注意事項

- Data Authorityはプラグインauthorityとは別
- DASインデックスにはJSONまたはMsgPackを選択
- カスタムシリアライゼーション形式にはBinaryスキーマ
- LinkedAppDataはCollection内の任意のAssetへの書き込みを許可

## クイックリファレンス

### スキーマ比較

| スキーマ | DASインデックス | 最適な用途 |
|--------|-------------|----------|
| JSON | ✅ JSONとして | 人間が読みやすい、Webアプリ |
| MsgPack | ✅ JSONとして | コンパクト、型付きデータ |
| Binary | ✅ base64として | カスタム形式、最大効率 |

### AppData vs Attributesプラグイン

| 機能 | AppData | Attributes |
|---------|---------|------------|
| 書き込み権限 | Data Authorityのみ | Update Authority |
| データ形式 | 任意（JSON、MsgPack、Binary） | キー値文字列 |
| サードパーティフレンドリー | ✅ はい | ❌ update authorityが必要 |
| DASインデックス | ✅ はい | ✅ はい |

## FAQ

### AppDataとAttributesプラグインの違いは何ですか？

Attributesはupdate authorityによって制御されるキー値文字列を保存します。AppDataは別のData Authorityによって制御される任意のデータを保存するため、サードパーティアプリケーションに最適です。

### 1つのAssetに複数のAppDataプラグインを持てますか？

はい。各AppDataプラグインは異なるData Authorityを持つことができ、複数のサードパーティアプリが同じAssetにデータを保存できます。

### 既存のAppDataをどのように更新しますか？

新しいデータで`writeData()`を呼び出します。これにより既存のデータが完全に置き換えられます—部分的な更新はありません。

### AppDataはDASでインデックスされますか？

はい。JSONとMsgPackスキーマは自動的にデシリアライズされ、インデックスされます。Binaryはbase64として保存されます。

### LinkedAppDataとは何ですか？

LinkedAppDataはCollectionに追加され、各Assetに個別にAppDataを追加することなく、Data AuthorityがそのCollection内の任意のAssetに書き込むことができます。

## 用語集

| 用語 | 定義 |
|------|------------|
| **AppData** | Assetsに任意のデータを保存するための外部プラグイン |
| **Data Authority** | 排他的な書き込み権限を持つアドレス |
| **LinkedAppData** | 任意のAssetへの書き込み用のコレクションレベルバリアント |
| **Schema** | データ形式：JSON、MsgPack、またはBinary |
| **writeData()** | AppDataプラグインにデータを書き込む関数 |

## 関連ページ

- [外部プラグイン概要](/smart-contracts/core/external-plugins/overview) - 外部プラグインの理解
- [Oracleプラグイン](/smart-contracts/core/external-plugins/oracle) - データストレージではなく検証
- [Attributesプラグイン](/smart-contracts/core/plugins/attribute) - 組み込みのキー値ストレージ
- [オンチェーンチケッティングガイド](/smart-contracts/core/guides/onchain-ticketing-with-appdata) - AppDataの例
