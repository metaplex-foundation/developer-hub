---
title: 主版本插件
metaTitle: 主版本插件 | Core
description: 了解 MPL Core 主版本插件。
---

主版本插件是一个`权限管理`插件，与 Core 集合一起使用来分组[版本](/zh/smart-contracts/core/plugins/edition)、提供来源证明并存储最大版本供应量。与版本插件一起，这些版本可以与 [Metaplex Token Metadata 中的版本概念](/token-metadata/print)相比较。

主版本插件适用于以下领域：

- 版本分组
- 提供来源证明

{% callout type="note" title="预期用途" %}

我们建议

- 使用主版本插件对版本进行分组
- 使用带有版本守卫的 Candy Machine 自动处理编号。

{% /callout %}

## 适用于

|                     |     |
| ------------------- | --- |
| MPL Core 资产      | ❌  |
| MPL Core 集合 | ✅  |

## 参数

| 参数       | 值                | 用途                                                                         |
| --------- | -------------------- | ------------------------------------------------------------------------------- |
| maxSupply | Option<number> (u32) | 指示将存在的最大印刷品数量。可选以允许开放版本 |
| name      | Option<String>       | 版本的名称（如果与集合名称不同）                      |
| uri       | Option<String>       | 版本的 URI（如果与集合 URI 不同）                       |

这些值可以由权限随时更改。它们纯粹是信息性的，不会被强制执行。

## 使用主版本插件创建集合

{% dialect-switcher title="使用主版本插件创建 MPL Core 集合" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { generateSigner, publicKey } from '@metaplex-foundation/umi'
import { createCollection } from '@metaplex-foundation/core'

const collectionSigner = generateSigner(umi)

await createCollection(umi, {
  collection: collectionSigner,
  name: 'My NFT',
  uri: 'https://example.com/my-nft.json',
  plugins: [
    {
      type: 'MasterEdition',
      maxSupply: 100,
      name: 'My Master Edition',
      uri: 'https://example.com/my-master-edition.json',
    },
  ],
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{
    instructions::CreateCollectionV1Builder,
    types::{Creator, Plugin, PluginAuthority, PluginAuthorityPair},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn create_collection_with_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let payer = Keypair::new();
    let collection = Keypair::new();

    let create_collection_ix = CreateCollectionV1Builder::new()
        .collection(collection.pubkey())
        .payer(payer.pubkey())
        .name("My Collection".into())
        .uri("https://example.com/my-collection.json".into())
        .plugins(vec![PluginAuthorityPair {
            plugin: Plugin::MasterEdition(MasterEdition {
                max_supply: 100,
                name: "My Master Edition"
                uri: "https://example.com/my-master-edition.json",
            }),
            authority: Some(PluginAuthority::UpdateAuthority),
        }])
        .instruction();

    let signers = vec![&collection, &payer];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let create_collection_tx = Transaction::new_signed_with_payer(
        &[create_collection_ix],
        Some(&payer.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&create_collection_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect %}

{% /dialect-switcher %}

## 更新主版本插件

如果主版本插件是可变的，它可以像其他集合插件一样更新：

{% dialect-switcher title="更新主版本插件" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePluginV1, createPlugin } from '@metaplex-foundation/mpl-core'

const asset = publicKey('11111111111111111111111111111111')

await updatePlugin(umi, {
  asset: asset,
  plugin: {
    type: 'MasterEdition',
    maxSupply: 110,
    name: 'My Master Edition',
    uri: 'https://example.com/my-master-edition',
  },
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}
_即将推出_

{% /dialect %}
{% /dialect-switcher %}
