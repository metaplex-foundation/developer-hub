---
title: AppData 插件
metaTitle: AppData 插件 | Metaplex Core
description: 使用 AppData 插件在 Core NFT 上存储任意数据。为第三方应用、游戏状态或自定义元数据创建安全的分区存储。
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
  - q: AppData 和 Attributes 插件有什么区别？
    a: Attributes 存储由更新权限控制的键值字符串。AppData 存储由单独的数据权限控制的任意数据，非常适合第三方应用程序。
  - q: 我可以在一个 Asset 上有多个 AppData 插件吗？
    a: 可以。每个 AppData 插件可以有不同的数据权限，允许多个第三方应用在同一个 Asset 上存储数据。
  - q: 如何更新现有的 AppData？
    a: 使用新数据调用 writeData()。这会完全替换现有数据——没有部分更新。
  - q: AppData 会被 DAS 索引吗？
    a: 会。JSON 和 MsgPack 模式会自动反序列化并索引。Binary 存储为 base64。
  - q: 什么是 LinkedAppData？
    a: LinkedAppData 添加到 Collection 上，允许数据权限写入该 Collection 中的任何 Asset，而无需为每个 Asset 单独添加 AppData。
---
**AppData 插件**在 Core Asset 上提供安全的分区数据存储。第三方应用程序可以存储和读取任意数据（JSON、MsgPack 或 binary），由数据权限控制独占写入访问。{% .lead %}
{% callout title="您将学到" %}
- 向 Asset 和 Collection 添加 AppData
- 配置数据权限以安全写入
- 选择数据模式（JSON、MsgPack、Binary）
- 从链上和链下读写数据
{% /callout %}
## 概要
**AppData** 插件在 Asset 上存储任意数据，具有受控的写入访问。只有数据权限可以写入插件的数据部分，实现安全的第三方集成。
- 存储 JSON、MsgPack 或 Binary 数据
- 数据权限具有独占写入权限
- 由 DAS 自动索引（JSON/MsgPack）
- LinkedAppData 变体用于集合范围的写入
## 超出范围
Oracle 验证（参见 [Oracle 插件](/smart-contracts/core/external-plugins/oracle)）、链上属性（参见 [Attributes 插件](/smart-contracts/core/plugins/attribute)）和链下元数据存储。
## 快速开始
**跳转至：** [添加到 Asset](#adding-the-appdata-plugin-to-an-asset) · [写入数据](#writing-data-to-the-appdata-plugin) · [读取数据](#reading-data-from-the-appdata-plugin)
1. 添加带有数据权限地址的 AppData 插件
2. 选择模式：JSON、MsgPack 或 Binary
3. 使用 `writeData()` 写入数据（必须以数据权限签名）
4. 通过 DAS 或直接账户获取读取数据
## 什么是 AppData 插件？
`AppData` 外部插件存储和包含可以由 `dataAuthority` 写入的任意数据。请注意，这与存储在 `ExternalRegistryRecord` 中的整体插件权限不同，因为它不能更新/撤销权限或更改插件的其他元数据。
可以将 `AppData` 视为 Asset 的一个分区数据区域，只有特定的权限可以更改和写入。
这对于第三方网站/应用程序存储执行其产品/应用程序中某些功能所需的数据非常有用。
## 适用范围
|                       |     |
| --------------------- | --- |
| MPL Core Asset        | ✅  |
| MPL Core Collection\* | ✅  |
\* MPL Core Collection 也可以使用 `LinkedAppData` 插件。
## 什么是 LinkedAppData 插件？
`LinkedAppData` 插件专为 Collection 构建。它允许您在 collection 上添加单个插件适配器，这将允许您写入 collection 中的任何 Asset。
## 参数
| 参数          | 值                          |
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
schema 决定了存储在 `AppData` 插件中的数据类型。所有 schema 都将被 DAS 索引。
| 参数              | DAS 支持 | 存储为   |
| ----------------- | -------- | -------- |
| Binary (原始数据) | ✅       | base64   |
| Json              | ✅       | json     |
| MsgPack           | ✅       | json     |
在索引数据时，如果读取 `JSON` 或 `MsgPack` schema 时出错，则会保存为 binary。
{% dialect-switcher title="向 AppData 插件写入数据" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { ExternalPluginAdapterSchema } from '@metaplex-foundation/mpl-core'
// 从 Binary、Json 或 MsgPack 中选择
const schema = ExternalPluginAdapterSchema.Json
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust
// 从 Binary、Json 或 MsgPack 中选择
let schema = ExternalPluginAdapterSchema::Json
```
{% /dialect %}
{% /dialect-switcher %}
## 向 Asset 添加 AppData 插件
{% dialect-switcher title="向 MPL Core Asset 添加 Attribute 插件" %}
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
// 或者您可以将插件添加到现有的 Asset
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
## 向 AppData 插件写入数据
只有 dataAuthority 地址可以向 `AppData` 插件写入数据。
要向 `AppData` 插件写入数据，我们将使用 `writeData()` 辅助函数，它接受以下参数。
| 参数      | 值                                        |
| --------- | ----------------------------------------- |
| key       | { type: string, dataAuthority: publicKey} |
| authority | signer                                    |
| data      | 您希望存储的格式的数据                    |
| asset     | publicKey                                 |
### 序列化 JSON
{% dialect-switcher title="序列化 JSON" %}
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
// 这使用 `serde` 和 `serde_json` crate。
let struct_data = MyData {
    timestamp: 1234567890,
    message: "Hello World".to_string(),
};
let data = serde_json::to_vec(&struct_data).unwrap();
```
{% /dialect %}
{% /dialect-switcher %}
### 序列化 MsgPack
{% dialect-switcher title="序列化 MsgPack" %}
{% dialect title="JavaScript" id="js" %}
```ts
// 此实现使用 `msgpack-lite` 进行序列化
const json = {
  timeStamp: Date.now(),
  message: 'Hello, World!',
}
const data = msgpack.encode(json)
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust
// 这使用 `serde` 和 `rmp-serde` crate。
let data = MyData {
    timestamp: 1234567890,
    message: "Hello World".to_string(),
};
let data = rmp_serde::to_vec(&data).unwrap();
```
{% /dialect %}
{% /dialect-switcher %}
### 序列化 Binary
由于 binary 可以存储任意数据，因此如何序列化和反序列化数据由您决定。
{% dialect-switcher title="序列化 Binary" %}
{% dialect title="JavaScript" id="js" %}
```ts
// 下面的示例只是创建被视为 `true` 或 `false` 的字节。
const data = new Uint8Array([1, 0, 0, 1, 0])
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust
// 此示例展示如何使用 `bincode` 序列化 Rust 结构体。
let data = MyData {
    timestamp: 1234567890,
    message: "Hello World".to_string(),
};
let data = bincode::serialize(&data).unwrap();
```
{% /dialect %}
{% /dialect-switcher %}
### 写入数据
{% dialect-switcher title="向 MPL Core Asset 添加 Attribute 插件" %}
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
/// ### 账户:
///
///   0. `[writable]` asset
///   1. `[writable, optional]` collection
///   2. `[writable, signer]` payer
///   3. `[signer, optional]` authority
///   4. `[optional]` buffer
///   5. `[]` system_program
///   6. `[optional]` log_wrapper
// 您需要将数据（Binary、Json、MsgPack）转换为字节以进行存储。
// 根据您选择的 schema，可以通过几种方式实现。
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
## 从 AppData 插件读取数据
数据可以从链上程序和提取账户数据的外部来源读取。
### 获取原始数据
反序列化存储在 `AppData` 插件中的数据的第一步是获取原始数据并检查 schema 字段，该字段指示数据在序列化之前的存储格式。
{% dialect-switcher title="获取 AppData 原始数据" %}
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
// 检查具有给定权限的 `AppData` 插件是否存在
if (appDataPlugin && appDataPlugin.length > 0) {
  // 将插件数据保存到 `data`
  data = appDataPlugin[0].data
  // 将插件 schema 保存到 `schema`
  schema = appDataPlugin[0].schema
}
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust
let plugin_authority = ctx.accounts.authority.key();
let asset = BaseAssetV1::from_bytes(&data).unwrap();
// 根据插件的权限获取 `AppData` 插件。
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
// 从 account_info 获取 app_data 数据
let data = account_info.data.borrow()[data_offset..data_offset + data_length].to_vec();
```
{% /dialect %}
{% /dialect-switcher %}
### 反序列化
现在您有了数据，您需要根据您选择用于向 `AppData` 插件写入数据的 schema 来反序列化数据。
#### 反序列化 JSON Schema
{% dialect-switcher title="反序列化 JSON" %}
{% dialect title="JavaScript" id="js" %}
```ts
// 由于 JS SDK，MsgPack schema 的反序列化是自动的，反序列化的
// 数据可以在上面的 RAW 位置示例中访问。
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust
// 对于 `JSON` schema，您需要使用 `serde` 和 `serde_json` crate。
// 您需要在结构体的 `derive` 宏中添加 `Serialize` 和 `Deserialize`。
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
#### 反序列化 MsgPack Schema
{% dialect-switcher title="反序列化 MsgPack" %}
{% dialect title="JavaScript" id="js" %}
```ts
// 由于 JS SDK，MsgPack schema 的反序列化是自动的，反序列化的
// 数据可以在上面的 RAW 位置示例中访问。
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust
// 对于 `MsgPack` schema，您需要使用 `serde` 和 `rmp_serde` crate。
// 您需要在结构体的 `derive` 宏中添加 `Serialize` 和 `Deserialize`。
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
#### 反序列化 Binary Schema
因为 **Binary** schema 是任意数据，所以反序列化取决于您使用的序列化方式。
{% dialect-switcher title="反序列化 Binary" %}
{% dialect title="JavaScript" id="js" %}
```js
// 由于 binary 数据是任意的，您需要包含自己的反序列化器来
// 将数据解析为您的应用/网站可以理解的可用格式。
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust
#[derive(Debug, Serialize, Deserialize)]
pub struct MyData {
    pub timestamp: u64,
    pub message: String,
}
// 在下面的示例中，我们将看看使用 `bincode` crate
// 反序列化到结构体。
let my_data: MyData = bincode::deserialize(&data).unwrap();
println!("{:?}", my_data);
```
{% /dialect %}
{% /dialect-switcher %}
## 常见错误
### `Authority mismatch`
只有数据权限可以写入数据。请验证您使用的是正确的密钥对进行签名。
### `Data too large`
数据超出账户大小限制。考虑压缩或将数据拆分到多个插件中。
### `Invalid schema`
数据与声明的 schema 不匹配。确保 JSON 有效或 MsgPack 正确编码。
## 注意事项
- 数据权限与插件权限是分开的
- 选择 JSON 或 MsgPack 以进行 DAS 索引
- Binary schema 用于自定义序列化格式
- LinkedAppData 允许写入 Collection 中的任何 Asset
## 快速参考
### Schema 比较
| Schema | DAS 索引 | 最适合 |
|--------|----------|--------|
| JSON | ✅ 作为 JSON | 人类可读，Web 应用 |
| MsgPack | ✅ 作为 JSON | 紧凑，类型化数据 |
| Binary | ✅ 作为 base64 | 自定义格式，最大效率 |
### AppData 与 Attributes 插件对比
| 特性 | AppData | Attributes |
|------|---------|------------|
| 写入权限 | 仅数据权限 | 更新权限 |
| 数据格式 | 任意（JSON、MsgPack、Binary） | 键值字符串 |
| 第三方友好 | ✅ 是 | ❌ 需要更新权限 |
| DAS 索引 | ✅ 是 | ✅ 是 |
## 常见问题
### AppData 和 Attributes 插件有什么区别？
Attributes 存储由更新权限控制的键值字符串。AppData 存储由单独的数据权限控制的任意数据，非常适合第三方应用程序。
### 我可以在一个 Asset 上有多个 AppData 插件吗？
可以。每个 AppData 插件可以有不同的数据权限，允许多个第三方应用在同一个 Asset 上存储数据。
### 如何更新现有的 AppData？
使用新数据调用 `writeData()`。这会完全替换现有数据——没有部分更新。
### AppData 会被 DAS 索引吗？
会。JSON 和 MsgPack schema 会自动反序列化并索引。Binary 存储为 base64。
### 什么是 LinkedAppData？
LinkedAppData 添加到 Collection 上，允许数据权限写入该 Collection 中的任何 Asset，而无需为每个 Asset 单独添加 AppData。
## 术语表
| 术语 | 定义 |
|------|------|
| **AppData** | 用于在 Asset 上存储任意数据的外部插件 |
| **Data Authority** | 具有独占写入权限的地址 |
| **LinkedAppData** | 用于写入任何 Asset 的 Collection 级变体 |
| **Schema** | 数据格式：JSON、MsgPack 或 Binary |
| **writeData()** | 向 AppData 插件写入数据的函数 |
## 相关页面
- [外部插件概述](/smart-contracts/core/external-plugins/overview) - 了解外部插件
- [Oracle 插件](/smart-contracts/core/external-plugins/oracle) - 验证而非数据存储
- [Attributes 插件](/smart-contracts/core/plugins/attribute) - 内置键值存储
- [链上票务指南](/smart-contracts/core/guides/onchain-ticketing-with-appdata) - AppData 示例
