---
title: 永久冻结委托
metaTitle: 永久冻结插件 | Core
description: 一个强大的插件，允许插件的委托方在任何时间点冻结资产。
---

## 概述

永久冻结委托插件是一个`永久`插件，它将始终存在于添加它的 MPL Core 资产或 MPL Core 集合上。永久插件只能在资产或集合创建时添加。

永久冻结插件适用于以下领域：

- 灵魂绑定代币。

## 适用于

|                     |     |
| ------------------- | --- |
| MPL Core 资产      | ✅  |
| MPL Core 集合 | ✅  |

### 行为
- **资产**：允许委托地址随时冻结和解冻 NFT。
- **集合**：允许集合权限一次性冻结和解冻整个集合。它**不**允许使用此委托冻结集合中的单个资产。

## 参数

| 参数    | 值 |
| ------ | ----- |
| frozen | bool  |

## 创建带有永久冻结插件的资产
以下示例展示如何创建带有永久冻结插件的资产。

{% dialect-switcher title="创建带有永久冻结插件的资产" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { create } from '@metaplex-foundation/mpl-core'

const assetSigner = generateSigner(umi)
const delegate = publicKey('33333333333333333333333333333')

await create(umi, {
  asset: assetSigner,
  name: 'My NFT',
  uri: 'https://example.com/my-asset.json',
  plugins: [
    {
      type: 'PermanentFreezeDelegate',
      frozen: true,
      authority: { type: 'Address', address: delegate },
    },
  ],
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
use std::str::FromStr;
use mpl_core::{
    instructions::CreateV1Builder,
    types::{PermanentFreezeDelegate, Plugin, PluginAuthority, PluginAuthorityPair},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};

pub async fn create_asset_with_permanent_freeze_delegate_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let payer = Keypair::new();
    let asset = Keypair::new();

    let delegate = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let create_asset_with_permanent_freeze_delegate_plugin_ix = CreateV1Builder::new()
        .asset(asset.pubkey())
        .payer(payer.pubkey())
        .name("My Nft".into())
        .uri("https://example.com/my-nft.json".into())
        .plugins(vec![PluginAuthorityPair {
            plugin: Plugin::PermanentFreezeDelegate(PermanentFreezeDelegate { frozen: true }),
            authority: Some(PluginAuthority::Address { address: delegate }),
        }])
        .instruction();

    let signers = vec![&asset, &payer];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let create_asset_with_permanent_freeze_delegate_plugin_tx = Transaction::new_signed_with_payer(
        &[create_asset_with_permanent_freeze_delegate_plugin_ix],
        Some(&payer.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&create_asset_with_permanent_freeze_delegate_plugin_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect %}

{% /dialect-switcher %}

## 更新资产上的永久冻结委托插件
以下示例展示如何更新资产上的永久冻结委托插件。通过将 `frozen` 参数设置为 `true` 或 `false` 来冻结或解冻它。假设签名钱包是插件权限。

{% dialect-switcher title="更新资产上的永久冻结委托插件" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { updatePlugin } from '@metaplex-foundation/mpl-core'

const updateAssetResponse = await updatePlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: "PermanentFreezeDelegate",
    frozen: false,
  },
}).sendAndConfirm(umi);
```

{% /dialect %}
{% /dialect-switcher %}



## 创建带有永久冻结插件的集合
以下示例展示如何创建带有永久冻结插件的集合。

{% dialect-switcher title="创建带有永久冻结插件的集合" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { generateSigner } from '@metaplex-foundation/umi'
import { createCollection } from '@metaplex-foundation/mpl-core'

const collectionSigner = generateSigner(umi)
await createCollection(umi, {
  collection: collectionSigner,
  name: "Frozen Collection",
  uri: "https://example.com/my-collection.json",
  plugins: [
      {
        type: 'PermanentFreezeDelegate',
        frozen: true,
        authority: { type: "UpdateAuthority"}, // 更新权限可以解冻它
      },
    ],
  }).sendAndConfirm(umi);
```

{% /dialect %}
{% /dialect-switcher %}

## 更新带有永久冻结插件的集合
以下示例展示如何更新集合上的永久冻结委托插件。通过将 `frozen` 参数设置为 `true` 或 `false` 来冻结或解冻它。假设签名钱包是插件权限。

{% dialect-switcher title="更新带有永久冻结插件的集合" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { updateCollectionPlugin } from '@metaplex-foundation/mpl-core'

const updateCollectionResponse =  await updateCollectionPlugin(umi, {
  collection: collectionSigner.publicKey,
  plugin: {
      type: "PermanentFreezeDelegate",
      frozen: false,
    },
  }).sendAndConfirm(umi);
```

{% /dialect %}
{% /dialect-switcher %}
