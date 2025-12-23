---
title: 属性插件
metaTitle: 属性插件 | Core
description: 属性插件将链上 JSON 存储到资产或集合中，可供链上程序读取。了解如何利用此插件进行游戏和数据存储。
---

属性插件是一个`权限管理`插件，可以在资产中存储键值对数据。

属性插件适用于以下领域：

- 存储资产的链上属性/特征，可供链上程序读取。
- 存储可由游戏/程序修改的生命值和其他统计数据。

## 适用于

|                     |     |
| ------------------- | --- |
| MPL Core 资产      | ✅  |
| MPL Core 集合 | ✅  |

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

{% dialect-switcher title="向 MPL Core 资产添加属性插件" %}
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

{% dialect-switcher title="更新资产上的属性插件" %}
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
