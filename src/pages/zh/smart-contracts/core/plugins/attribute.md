---
title: Attribute 插件
metaTitle: Attribute 插件 | Metaplex Core
description: 在 Core NFT Asset 上存储链上键值数据。使用 Attributes 插件存储游戏统计数据、特征以及任何需要被链上程序读取的数据。
updated: '01-31-2026'
keywords:
  - on-chain attributes
  - NFT traits
  - game stats
  - key-value storage
  - DAS indexed
about:
  - On-chain data storage
  - NFT attributes
  - Program-readable data
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
faqs:
  - q: 链上属性和链下元数据属性有什么区别？
    a: 链上属性存储在 Solana 上，可被程序读取。URI 中 JSON 里的链下属性存储在 Arweave/IPFS 上，只能被客户端读取。
  - q: 链上程序能读取这些属性吗？
    a: 可以。使用 CPI 获取 Asset 账户并反序列化 Attributes 插件数据。
  - q: 属性会被 DAS 索引吗？
    a: 是的。DAS 会自动索引属性键值对以便快速查询。
  - q: 可以存储数字或布尔值吗？
    a: 值只能是字符串。根据需要进行转换，例如 level = '5' 或 active = 'true'。
  - q: 如何更新单个属性？
    a: 不能单独更新属性。需要获取当前列表，修改后用完整的新列表进行更新。
  - q: 属性的大小限制是多少？
    a: 没有硬性限制，但较大的属性列表会增加租金成本。请保持数据简洁。
  - q: 所有者可以更新属性吗？
    a: 不可以。Attributes 插件是权限管理的，所以只有更新权限者可以修改它。
---
**Attributes 插件**在 Core Asset 或 Collection 中直接在链上存储键值对。非常适合游戏统计数据、特征以及链上程序需要读取的任何数据。{% .lead %}
{% callout title="学习内容" %}
- 向 Asset 和 Collection 添加链上属性
- 存储和更新键值对
- 从链上程序读取属性
- 用例：游戏统计数据、特征、访问级别
{% /callout %}
## 摘要
**Attributes 插件**是一个权限管理插件，在链上存储键值字符串对。与链下元数据不同，这些属性可被 Solana 程序读取并被 DAS 索引。
- 在链上存储任何字符串键值对
- 可通过 CPI 被链上程序读取
- 自动被 DAS 索引以便快速查询
- 可由更新权限者修改
## 范围外
链下元数据属性（存储在 URI 的 JSON 中）、复杂数据类型（仅支持字符串）以及不可变属性（所有属性都可修改）。
## 快速开始
**跳转至：** [添加到 Asset](#向-asset-添加-attributes-插件) · [更新属性](#更新-asset-上的-attributes-插件)
1. 添加 Attributes 插件：`addPlugin(umi, { asset, plugin: { type: 'Attributes', attributeList: [...] } })`
2. 每个属性是一个 `{ key: string, value: string }` 对
3. 随时使用 `updatePlugin()` 更新
4. 通过 DAS 查询或在链上获取
{% callout type="note" title="链上 vs 链下属性" %}
| 特性 | 链上（此插件） | 链下（JSON 元数据） |
|---------|------------------------|---------------------------|
| 存储位置 | Solana 账户 | Arweave/IPFS |
| 可被程序读取 | ✅ 是（CPI） | ❌ 否 |
| 被 DAS 索引 | ✅ 是 | ✅ 是 |
| 可修改 | ✅ 是 | 取决于存储 |
| 成本 | 租金（可回收） | 上传成本（一次性） |
| 最适合 | 动态数据、游戏统计 | 静态特征、图片 |
**使用链上属性**当程序需要读取数据或数据经常变化时。
**使用链下元数据**用于静态特征和图片引用。
{% /callout %}
## 常见用例
- **游戏角色统计**：生命值、经验值、等级、职业 - 游戏过程中变化的数据
- **访问控制**：等级、角色、权限 - 程序用于授权检查的数据
- **动态特征**：基于操作变化特征的进化 NFT
- **质押状态**：跟踪质押状态、已赚取的奖励、质押时间
- **成就追踪**：徽章、里程碑、完成状态
- **租赁/借贷**：跟踪租赁期限、借用者信息、归还日期
## 适用于
|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |
## 参数
| 参数           | 值                               |
| ------------- | ----------------------------------- |
| attributeList | Array<{key: string, value: string}> |
### AttributeList
属性列表由 Array[] 组成，然后是键值对 `{key: "value"}` 字符串值对的对象。
{% dialect-switcher title="AttributeList" %}
{% dialect title="JavaScript" id="js" %}
```ts
const attributeList = [
  { key: 'key0', value: 'value0' },
  { key: 'key1', value: 'value1' },
]
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust
use mpl_core::types::{Attributes, Attribute}
let attributes = Attributes {
    attribute_list: vec![
        Attribute {
            key: "color".to_string(),
            value: "blue".to_string(),
        },
        Attribute {
            key: "access_type".to_string(),
            value: "prestige".to_string(),
        },
    ],
}
```
{% /dialect %}
{% /dialect-switcher %}
## 向 Asset 添加 Attributes 插件
{% dialect-switcher title="向 MPL Core Asset 添加 Attribute 插件" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { addPlugin } from '@metaplex-foundation/mpl-core'
const asset = publicKey('11111111111111111111111111111111')
await addPlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'Attributes',
    attributeList: [
      { key: 'key0', value: 'value0' },
      { key: 'key1', value: 'value1' },
    ],
  },
}).sendAndConfirm(umi)
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust
use mpl_core::{
    instructions::AddPluginV1Builder,
    types::{Attribute, Attributes, Plugin},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn add_attributes_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let add_attribute_plugin_ix = AddPluginV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .plugin(Plugin::Attributes(Attributes {
            attribute_list: vec![
                Attribute {
                    key: "color".to_string(),
                    value: "blue".to_string(),
                },
                Attribute {
                    key: "access_type".to_string(),
                    value: "prestige".to_string(),
                },
            ],
        }))
        .instruction();
    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let add_attribute_plugin_tx = Transaction::new_signed_with_payer(
        &[add_attribute_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&add_attribute_plugin_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```
{% /dialect %}
{% /dialect-switcher %}
## 更新 Asset 上的 Attributes 插件
{% dialect-switcher title="更新 Asset 上的 Attributes 插件" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin } from '@metaplex-foundation/mpl-core'
const assetAddress = publicKey('11111111111111111111111111111111')
await updatePlugin(umi, {
  asset: assetAddress,
  plugin: {
    type: 'Attributes',
    attributeList: [
      { key: 'key0', value: 'value0' },
      { key: 'key1', value: 'value1' },
    ],
  },
}).sendAndConfirm(umi)
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```ts
use mpl_core::{
    instructions::UpdatePluginV1Builder,
    types::{Attribute, Attributes, Plugin},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn update_attributes_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let update_attributes_plugin_ix = UpdatePluginV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .plugin(Plugin::Attributes(Attributes {
            attribute_list: vec![
                Attribute {
                    key: "color".to_string(),
                    value: "new value".to_string(),
                },
                Attribute {
                    key: "access_type".to_string(),
                    value: "new value".to_string(),
                },
                Attribute {
                    key: "additional_attribute".to_string(),
                    value: "additional_value".to_string(),
                },
            ],
        }))
        .instruction();
    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let update_attributes_plugin_tx = Transaction::new_signed_with_payer(
        &[update_attributes_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&update_attributes_plugin_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```
{% /dialect %}
{% /dialect-switcher %}
## 常见错误
### `Authority mismatch`
只有插件权限者（通常是更新权限者）可以添加或更新属性。验证您是否使用正确的密钥对签名。
### `String too long`
属性键和值的大小有限制。请保持简洁。
## 注意事项
- 权限管理：更新权限者无需所有者签名即可添加/更新
- 所有值都是字符串 - 根据需要转换数字/布尔值
- 更新会替换整个属性列表（不支持部分更新）
- 属性会增加账户大小和租金成本
- DAS 索引属性以便快速查询
## 快速参考
### 最少代码
```ts {% title="minimal-attributes.ts" %}
import { addPlugin } from '@metaplex-foundation/mpl-core'
await addPlugin(umi, {
  asset: assetAddress,
  plugin: {
    type: 'Attributes',
    attributeList: [
      { key: 'level', value: '5' },
      { key: 'class', value: 'warrior' },
    ],
  },
}).sendAndConfirm(umi)
```
### 常见属性模式
| 用例 | 示例键 |
|----------|--------------|
| 游戏角色 | `level`, `health`, `xp`, `class` |
| 访问控制 | `tier`, `access_level`, `role` |
| 特征 | `background`, `eyes`, `rarity` |
| 状态 | `staked`, `listed`, `locked` |
## 常见问题
### 链上属性和链下元数据属性有什么区别？
链上属性（此插件）存储在 Solana 上，可被程序读取。链下属性（URI 中的 JSON）存储在 Arweave/IPFS 上，只能被客户端读取。
### 链上程序能读取这些属性吗？
可以。使用 CPI 获取 Asset 账户并反序列化 Attributes 插件数据。
### 属性会被 DAS 索引吗？
是的。DAS 会自动索引属性键值对以便快速查询。
### 可以存储数字或布尔值吗？
值只能是字符串。根据需要进行转换：`{ key: 'level', value: '5' }`，`{ key: 'active', value: 'true' }`。
### 如何更新单个属性？
不能单独更新属性。需要获取当前列表，修改后用完整的新列表进行更新。
### 属性的大小限制是多少？
没有硬性限制，但较大的属性列表会增加租金成本。请保持数据简洁。
### 所有者可以更新属性吗？
不可以。Attributes 插件是权限管理的，所以只有更新权限者可以修改它（不是所有者）。
## 相关插件
- [Update Delegate](/smart-contracts/core/plugins/update-delegate) - 授予他人更新属性的权限
- [ImmutableMetadata](/smart-contracts/core/plugins/immutableMetadata) - 锁定名称/URI（属性仍可修改）
- [AddBlocker](/smart-contracts/core/plugins/addBlocker) - 防止添加新插件
## 术语表
| 术语 | 定义 |
|------|------------|
| **Attributes 插件** | 存储链上键值对的权限管理插件 |
| **attributeList** | `{ key, value }` 对象的数组 |
| **权限管理** | 由更新权限者控制的插件类型 |
| **链上数据** | 直接存储在 Solana 账户中的数据（可被程序读取） |
| **DAS** | 索引属性的 Digital Asset Standard API |
