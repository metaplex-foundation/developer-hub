---
title: AppData プラグイン
metaTitle: AppData プラグイン | Metaplex Core
description: AppData プラグインで Core NFT に任意のデータを保存します。サードパーティアプリ、ゲームステート、カスタムメタデータ用の安全なパーティション化されたストレージを作成できます。
---

**AppData プラグイン**は、Core Assets に安全でパーティション化されたデータストレージを提供します。サードパーティアプリケーションは、データ権限によって制御される排他的な書き込みアクセスで、任意のデータ（JSON、MsgPack、またはバイナリ）を保存および読み取ることができます。{% .lead %}

{% callout title="学習内容" %}

- Assets と Collections に AppData を追加する
- 安全な書き込みのためにデータ権限を設定する
- データスキーマを選択する（JSON、MsgPack、Binary）
- オンチェーンおよびオフチェーンからデータを読み書きする

{% /callout %}

## 概要

**AppData** プラグインは、制御された書き込みアクセスで Assets に任意のデータを保存します。データ権限のみがプラグインのデータセクションに書き込みでき、安全なサードパーティ統合を可能にします。

- JSON、MsgPack、またはバイナリデータを保存
- データ権限が排他的な書き込み権限を持つ
- DAS によって自動的にインデックス化される（JSON/MsgPack）
- コレクション全体への書き込み用の LinkedAppData バリアント

## 対象外

Oracle 検証（[Oracle プラグイン](/ja/smart-contracts/core/external-plugins/oracle)を参照）、オンチェーン属性（[Attributes プラグイン](/ja/smart-contracts/core/plugins/attribute)を参照）、オフチェーンメタデータストレージ。

## クイックスタート

**ジャンプ先:** [Asset に追加](#adding-the-appdata-plugin-to-an-asset) · [データを書き込む](#writing-data-to-the-appdata-plugin) · [データを読み取る](#reading-data-from-the-appdata-plugin)

1. データ権限アドレスで AppData プラグインを追加
2. スキーマを選択: JSON、MsgPack、または Binary
3. `writeData()` でデータを書き込む（データ権限として署名が必要）
4. DAS または直接アカウントフェッチでデータを読み取る

## AppData プラグインとは？

`AppData` 外部プラグインは、`dataAuthority` によって書き込み可能な任意のデータを保存します。これは `ExternalRegistryRecord` に保存される全体的なプラグイン権限とは異なり、権限の更新/取り消しやプラグインの他のメタデータの変更はできません。

`AppData` は、特定の権限のみが変更・書き込みできる、Asset のパーティション化されたデータ領域と考えてください。

これはサードパーティのサイト/アプリが、製品/アプリ内の特定の機能を実行するために必要なデータを保存するのに便利です。

## 対応状況

|                       |     |
| --------------------- | --- |
| MPL Core Asset        | ✅  |
| MPL Core Collection\* | ✅  |

\* MPL Core Collections は `LinkedAppData` プラグインも使用できます。

## LinkedAppData プラグインとは？

`LinkedAppData` プラグインは Collections 用に構築されています。コレクションに単一のプラグインアダプターを追加することで、コレクション内の任意の Asset に書き込みできます。

## 引数

| 引数          | 値                          |
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

スキーマは `AppData` プラグインに保存されるデータのタイプを決定します。すべてのスキーマは DAS でインデックス化されます。

| 引数              | DAS 対応 | 保存形式 |
| ----------------- | -------- | -------- |
| Binary (Raw Data) | ✅       | base64   |
| Json              | ✅       | json     |
| MsgPack           | ✅       | json     |

インデックス化時に `JSON` または `MsgPack` スキーマの読み取りでエラーが発生した場合、バイナリとして保存されます。

{% dialect-switcher title="`AppData` プラグインへのデータ書き込み" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { ExternalPluginAdapterSchema } from '@metaplex-foundation/mpl-core'

// Binary、Json、MsgPack から選択
const schema = ExternalPluginAdapterSchema.Json
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
// Binary、Json、MsgPack から選択
let schema = ExternalPluginAdapterSchema::Json

```

{% /dialect %}

{% /dialect-switcher %}

## Adding the AppData Plugin to an Asset

{% dialect-switcher title="MPL Core Asset への Attribute プラグイン追加" %}
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

// または既存の Asset にプラグインを追加

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

## Writing Data to the AppData Plugin

dataAuthority アドレスのみが `AppData` プラグインにデータを書き込めます。

`AppData` プラグインにデータを書き込むには、以下の引数を取る `writeData()` ヘルパーを使用します。

| 引数      | 値                                        |
| --------- | ----------------------------------------- |
| key       | { type: string, dataAuthority: publicKey} |
| authority | signer                                    |
| data      | 保存したい形式のデータ                    |
| asset     | publicKey                                 |

### JSON のシリアライズ

{% dialect-switcher title="JSON のシリアライズ" %}
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
// `serde` と `serde_json` クレートを使用します。


let struct_data = MyData {
    timestamp: 1234567890,
    message: "Hello World".to_string(),
};

let data = serde_json::to_vec(&struct_data).unwrap();
```

{% /dialect %}

{% /dialect-switcher %}

### MsgPack のシリアライズ

{% dialect-switcher title="MsgPack のシリアライズ" %}
{% dialect title="JavaScript" id="js" %}

```ts
// この実装は `msgpack-lite` をシリアライズに使用します

const json = {
  timeStamp: Date.now(),
  message: 'Hello, World!',
}

const data = msgpack.encode(json)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
// `serde` と `rmp-serde` クレートを使用します。

let data = MyData {
    timestamp: 1234567890,
    message: "Hello World".to_string(),
};

let data = rmp_serde::to_vec(&data).unwrap();
```

{% /dialect %}

{% /dialect-switcher %}

### Binary のシリアライズ

バイナリは任意のデータを保存できるため、データのシリアライズとデシリアライズ方法はあなた次第です。

{% dialect-switcher title="Binary のシリアライズ" %}
{% dialect title="JavaScript" id="js" %}

```ts
// 以下の例は `true` または `false` とみなされるバイトを作成するだけです。
const data = new Uint8Array([1, 0, 0, 1, 0])
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
// この例は `bincode` で Rust 構造体をシリアライズする方法を示しています。

let data = MyData {
    timestamp: 1234567890,
    message: "Hello World".to_string(),
};

let data = bincode::serialize(&data).unwrap();
```

{% /dialect %}

{% /dialect-switcher %}

### データの書き込み

{% dialect-switcher title="MPL Core Asset への Attribute プラグイン追加" %}
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
/// ### アカウント:
///
///   0. `[writable]` asset
///   1. `[writable, optional]` collection
///   2. `[writable, signer]` payer
///   3. `[signer, optional]` authority
///   4. `[optional]` buffer
///   5. `[]` system_program
///   6. `[optional]` log_wrapper

// 保存のためにデータ（Binary、Json、MsgPack）をバイトに変換する必要があります。
// 選択したスキーマに応じていくつかの方法で実現できます。

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

## Reading Data from the AppData Plugin

データはオンチェーンプログラムとアカウントデータを取得する外部ソースの両方から読み取れます。

### 生データの取得

`AppData` プラグインに保存されたデータをデシリアライズする最初のステップは、生データを取得し、シリアライズ前のデータ保存形式を示すスキーマフィールドを確認することです。

{% dialect-switcher title="`AppData` 生データの取得" %}
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

// 指定された権限を持つ `AppData` プラグインが存在するかチェック
if (appDataPlugin && appDataPlugin.length > 0) {
  // プラグインデータを `data` に保存
  data = appDataPlugin[0].data

  // プラグインスキーマを `schema` に保存
  schema = appDataPlugin[0].schema
}
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
let plugin_authority = ctx.accounts.authority.key();

let asset = BaseAssetV1::from_bytes(&data).unwrap();

// プラグインの権限に基づいて `AppData` プラグインを取得します。
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

// account_info から app_data データを取得
let data = account_info.data.borrow()[data_offset..data_offset + data_length].to_vec();

```

{% /dialect %}

{% /dialect-switcher %}

### デシリアライズ

データを取得したら、`AppData` プラグインへの書き込み時に選択したスキーマに応じてデータをデシリアライズする必要があります。

#### JSON スキーマのデシリアライズ

{% dialect-switcher title="JSON のデシリアライズ" %}
{% dialect title="JavaScript" id="js" %}

```ts
// JS SDK により、MsgPack スキーマのデシリアライズは自動で、デシリアライズされた
// データは上記の RAW ロケーション例でアクセスできます。
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
// `JSON` スキーマには `serde` と `serde_json` クレートを使用する必要があります。

// 構造体の `derive` マクロに `Serialize` と `Deserialize` を追加する必要があります。
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

#### MsgPack スキーマのデシリアライズ



{% dialect-switcher title="MsgPack のデシリアライズ" %}
{% dialect title="JavaScript" id="js" %}

```ts
// JS SDK により、MsgPack スキーマのデシリアライズは自動で、デシリアライズされた
// データは上記の RAW ロケーション例でアクセスできます。
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
// `MsgPack` スキーマには `serde` と `rmp_serde` クレートを使用する必要があります。

// 構造体の `derive` マクロに `Serialize` と `Deserialize` を追加する必要があります。
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

#### Binary スキーマのデシリアライズ

**Binary** スキーマは任意のデータなので、デシリアライズは使用したシリアライズに依存します。

{% dialect-switcher title="Binary のデシリアライズ" %}
{% dialect title="JavaScript" id="js" %}
```js
// バイナリデータは任意なので、アプリ/ウェブサイトが理解できる使用可能な形式に
// データをパースするための独自のデシリアライザーを含める必要があります。
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
#[derive(Debug, Serialize, Deserialize)]
pub struct MyData {
    pub timestamp: u64,
    pub message: String,
}

// 以下の例では、`bincode` クレートを使用して
// 構造体にデシリアライズする方法を見ていきます。
let my_data: MyData = bincode::deserialize(&data).unwrap();
println!("{:?}", my_data);
```

{% /dialect %}

{% /dialect-switcher %}

## よくあるエラー

### `Authority mismatch`

データを書き込めるのはデータ権限のみです。正しいキーペアで署名していることを確認してください。

### `Data too large`

データがアカウントサイズ制限を超えています。データを圧縮するか、複数のプラグインに分割することを検討してください。

### `Invalid schema`

データが宣言されたスキーマと一致しません。JSON が有効か、MsgPack が正しくエンコードされていることを確認してください。

## 注意事項

- データ権限はプラグイン権限とは別
- DAS インデックス化には JSON または MsgPack を選択
- カスタムシリアライズ形式には Binary スキーマ
- LinkedAppData はコレクション内の任意の Asset への書き込みを可能にする

## クイックリファレンス

### スキーマ比較

| スキーマ | DAS インデックス化 | 最適な用途 |
|----------|-------------------|-----------|
| JSON | ✅ JSON として | 人間が読める、Web アプリ |
| MsgPack | ✅ JSON として | コンパクト、型付きデータ |
| Binary | ✅ base64 として | カスタム形式、最大効率 |

### AppData vs Attributes プラグイン

| 機能 | AppData | Attributes |
|------|---------|------------|
| 書き込み権限 | データ権限のみ | 更新権限 |
| データ形式 | 任意（JSON、MsgPack、Binary） | キーバリュー文字列 |
| サードパーティ対応 | ✅ はい | ❌ 更新権限が必要 |
| DAS インデックス化 | ✅ はい | ✅ はい |

## FAQ

### AppData と Attributes プラグインの違いは？

Attributes は更新権限によって制御されるキーバリュー文字列を保存します。AppData は別のデータ権限によって制御される任意のデータを保存し、サードパーティアプリケーションに最適です。

### 1つの Asset に複数の AppData プラグインを持てますか？

はい。各 AppData プラグインは異なるデータ権限を持つことができ、複数のサードパーティアプリが同じ Asset にデータを保存できます。

### 既存の AppData を更新するには？

新しいデータで `writeData()` を呼び出します。これは既存のデータを完全に置き換えます - 部分的な更新はありません。

### AppData は DAS でインデックス化されますか？

はい。JSON と MsgPack スキーマは自動的にデシリアライズされてインデックス化されます。Binary は base64 として保存されます。

### LinkedAppData とは？

LinkedAppData は Collection に追加され、データ権限が各 Asset に AppData を追加せずにその Collection 内の任意の Asset に書き込むことができます。

## 用語集

| 用語 | 定義 |
|------|------|
| **AppData** | Assets に任意のデータを保存するための外部プラグイン |
| **データ権限** | 排他的な書き込み権限を持つアドレス |
| **LinkedAppData** | 任意の Asset への書き込み用のコレクションレベルのバリアント |
| **スキーマ** | データ形式: JSON、MsgPack、または Binary |
| **writeData()** | AppData プラグインにデータを書き込む関数 |

## 関連ページ

- [外部プラグイン概要](/ja/smart-contracts/core/external-plugins/overview) - 外部プラグインの理解
- [Oracle プラグイン](/ja/smart-contracts/core/external-plugins/oracle) - データストレージの代わりに検証
- [Attributes プラグイン](/ja/smart-contracts/core/plugins/attribute) - ビルトインのキーバリューストレージ
- [オンチェーンチケッティングガイド](/ja/smart-contracts/core/guides/onchain-ticketing-with-appdata) - AppData の例

---

*Metaplex Foundation によって管理 - 最終確認 2026年1月 - @metaplex-foundation/mpl-core に適用*
