---
title: Attribute Plugin
metaTitle: Attribute Plugin | Metaplex Core
description: 在 Core NFT Asset 上存储链上键值数据。使用 Attributes Plugin 存储游戏统计、特征和任何需要链上程序读取的数据。
---

**Attributes Plugin** 直接在 Core Asset 或 Collection 中存储链上的键值对。非常适合游戏统计、特征和任何链上程序需要读取的数据。 {% .lead %}

{% callout title="您将学到" %}

- 向 Asset 和 Collection 添加链上属性
- 存储和更新键值对
- 从链上程序读取属性
- 用例：游戏统计、特征、访问级别

{% /callout %}

## 概要

**Attributes Plugin** 是一个 Authority Managed Plugin，在链上存储键值字符串对。与链下元数据不同，这些属性可被 Solana 程序读取并被 DAS 索引。

- 在链上存储任何字符串键值对
- 可通过 CPI 被链上程序读取
- 被 DAS 自动索引以便快速查询
- 可由更新权限修改

## 不在范围内

链下元数据属性（存储在 URI 的 JSON 中）、复杂数据类型（仅支持字符串）和不可变属性（所有属性都是可变的）。

## 快速开始

**跳转至：** [添加到 Asset](#向资产添加属性插件) · [更新属性](#更新资产上的属性插件)

1. 添加 Attributes Plugin：`addPlugin(umi, { asset, plugin: { type: 'Attributes', attributeList: [...] } })`
2. 每个属性是一个 `{ key: string, value: string }` 对
3. 随时使用 `updatePlugin()` 更新
4. 通过 DAS 或链上获取查询

{% callout type="note" title="链上与链下属性" %}

| 特性 | 链上（此 Plugin） | 链下（JSON 元数据） |
|---------|------------------------|---------------------------|
| 存储位置 | Solana 账户 | Arweave/IPFS |
| 程序可读 | ✅ 是（CPI） | ❌ 否 |
| DAS 索引 | ✅ 是 | ✅ 是 |
| 可变 | ✅ 是 | 取决于存储 |
| 成本 | 租金（可回收） | 上传成本（一次性） |
| 最适合 | 动态数据、游戏统计 | 静态特征、图片 |

**使用链上属性**当程序需要读取数据或数据频繁变化时。
**使用链下元数据**用于静态特征和图片引用。

{% /callout %}

## 常见用例

- **游戏角色统计**：生命值、经验值、等级、职业 - 游戏过程中变化的数据
- **访问控制**：等级、角色、权限 - 程序检查授权的数据
- **动态特征**：基于操作改变特征的进化 NFT
- **质押状态**：跟踪质押状态、已赚取奖励、质押时间
- **成就跟踪**：徽章、里程碑、完成状态
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

属性列表由一个 Array[] 和键值对对象 `{key: "value"}` 字符串值对组成。

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

## 向资产添加属性插件

{% dialect-switcher title="向 MPL Core Asset 添加 Attribute Plugin" %}
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

## 更新资产上的属性插件

{% dialect-switcher title="更新 Asset 上的 Attributes Plugin" %}
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

只有 Plugin 权限（通常是更新权限）可以添加或更新属性。验证您使用正确的密钥对签名。

### `String too long`

属性键和值的大小有限制。请保持简洁。

## 注意事项

- Authority Managed：更新权限可以在没有所有者签名的情况下添加/更新
- 所有值都是字符串 - 根据需要转换数字/布尔值
- 更新会替换整个属性列表（不能部分更新）
- 属性会增加账户大小和租金成本
- DAS 为属性编制索引以便快速查询

## 快速参考

### 最小代码

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
| 游戏角色 | `level`、`health`、`xp`、`class` |
| 访问控制 | `tier`、`access_level`、`role` |
| 特征 | `background`、`eyes`、`rarity` |
| 状态 | `staked`、`listed`、`locked` |

## 常见问题

### 链上属性和链下元数据属性有什么区别？

链上属性（此 Plugin）存储在 Solana 上，可被程序读取。链下属性（在 URI 的 JSON 中）存储在 Arweave/IPFS 上，只能被客户端读取。

### 链上程序可以读取这些属性吗？

可以。使用 CPI 获取 Asset 账户并反序列化 Attributes Plugin 数据。

### 属性被 DAS 索引吗？

是的。DAS 自动索引属性键值对以便快速查询。

### 可以存储数字或布尔值吗？

值只能是字符串。根据需要转换：`{ key: 'level', value: '5' }`、`{ key: 'active', value: 'true' }`。

### 如何更新单个属性？

不能单独更新属性。获取当前列表，修改它，然后用完整的新列表更新。

### 属性的大小限制是多少？

没有硬性限制，但更大的属性列表会增加租金成本。保持数据简洁。

### 所有者可以更新属性吗？

不可以。Attributes Plugin 是 Authority Managed 的，所以只有更新权限可以修改它（不是所有者）。

## 相关 Plugin

- [Update Delegate](/zh/smart-contracts/core/plugins/update-delegate) - 授予他人更新属性的权限
- [ImmutableMetadata](/zh/smart-contracts/core/plugins/immutableMetadata) - 锁定名称/URI（属性仍可变）
- [AddBlocker](/zh/smart-contracts/core/plugins/addBlocker) - 阻止添加新 Plugin

## 术语表

| 术语 | 定义 |
|------|------------|
| **Attributes Plugin** | 存储链上键值对的 Authority Managed Plugin |
| **attributeList** | `{ key, value }` 对象的数组 |
| **Authority Managed** | 由更新权限控制的 Plugin 类型 |
| **链上数据** | 直接存储在 Solana 账户中的数据（可被程序读取） |
| **DAS** | 索引属性的数字资产标准 API |

---

*由 Metaplex Foundation 维护 · 最后验证于 2026 年 1 月 · 适用于 @metaplex-foundation/mpl-core*
