---
title: 更新 Core Collection
metaTitle: 更新 Core Collection | Metaplex Core
description: 如何使用 mpl-core SDK 的 updateCollection 和 updateCollectionPlugin 指令更新 Solana 上 Core Collection 的元数据和插件。
updated: '04-08-2026'
keywords:
  - update collection
  - updateCollection
  - updateCollectionPlugin
  - Core Collection
  - mpl-core
about:
  - Updating Core Collections
  - Collection plugin management
proficiencyLevel: Beginner
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
howToSteps:
  - 使用合集的 updateAuthority 作为签名者配置 Umi
  - 调用 updateCollection 传入 collection 地址和新的名称或 URI
  - 调用 updateCollectionPlugin 更改 collection 上的插件行为
howToTools:
  - Node.js
  - Umi framework
  - mpl-core SDK
---

`updateCollection` 和 `updateCollectionPlugin` 修改现有 [Core Collection](/smart-contracts/core/collections) 的元数据和插件配置。 {% .lead %}

{% callout title="学习内容" %}
- 更新 Collection 的名称或 URI
- 更新附加到 Collection 上的插件
{% /callout %}

## Summary

创建后对 Core Collection 进行更新有两条指令。

- `updateCollection` — 更改合集的 `name` 或 `uri`
- `updateCollectionPlugin` — 修改合集上现有插件的配置
- 两者都需要 `updateAuthority` 签名
- 合集级别插件的变更会传播到继承它们的成员 Asset

**跳转至：** [更新元数据](#更新合集元数据) · [更新插件](#更新合集插件) · [错误处理](#常见错误)

## 前提条件

- 以合集的 `updateAuthority` 作为签名者配置的 **Umi** — 参见[获取 Collection](/smart-contracts/core/collections/fetch) 来检索该值
- 要更新的 collection 地址

## 更新合集元数据

`updateCollection` 更改现有 Collection 的 `name` 和/或 `uri`。只传入需要更改的字段。

{% dialect-switcher title="更新 Core Collection" %}
{% dialect title="JavaScript" id="js" %}
```ts {% title="update-collection.ts" %}
import { publicKey } from '@metaplex-foundation/umi'
import { updateCollection } from '@metaplex-foundation/mpl-core'

const collectionAddress = publicKey('1111111111111111111111111111111')

await updateCollection(umi, {
  collection: collectionAddress,
  name: 'My Updated Collection',
  uri: 'https://example.com/new-uri.json',
}).sendAndConfirm(umi)
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust {% title="update_collection.rs" %}
use mpl_core::instructions::UpdateCollectionV1Builder;
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn update_collection() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let authority = Keypair::new();
    let collection = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let update_collection_ix = UpdateCollectionV1Builder::new()
        .collection(collection)
        .payer(authority.pubkey())
        .new_name("My Collection".into())
        .new_uri("https://example.com/my-collection.json".into())
        .instruction();

    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let update_collection_tx = Transaction::new_signed_with_payer(
        &[update_collection_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&update_collection_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```
{% /dialect %}
{% /dialect-switcher %}

## 更新合集插件

`updateCollectionPlugin` 更改已附加到 Collection 上的插件配置。以下示例更新了 [Royalties 插件](/smart-contracts/core/plugins/royalties)的基点和创作者分成。

{% dialect-switcher title="更新 Core Collection 插件" %}
{% dialect title="JavaScript" id="js" %}
```ts {% title="update-collection-plugin.ts" %}
import { publicKey } from '@metaplex-foundation/umi'
import { updateCollectionPlugin, ruleSet } from '@metaplex-foundation/mpl-core'

const collectionAddress = publicKey('1111111111111111111111111111111')
const newCreator = publicKey('5555555555555555555555555555555')

await updateCollectionPlugin(umi, {
  collection: collectionAddress,
  plugin: {
    type: 'Royalties',
    basisPoints: 400,
    creators: [{ address: newCreator, percentage: 100 }],
    ruleSet: ruleSet('None'),
  },
}).sendAndConfirm(umi)
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust {% title="update_collection_plugin.rs" %}
use mpl_core::{
    instructions::UpdateCollectionPluginV1Builder,
    types::{Creator, Plugin, Royalties, RuleSet},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn update_collection_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let authority = Keypair::new();
    let collection = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let new_creator = Pubkey::from_str("22222222222222222222222222222222").unwrap();

    let update_collection_plugin_ix = UpdateCollectionPluginV1Builder::new()
        .collection(collection)
        .payer(authority.pubkey())
        .plugin(Plugin::Royalties(Royalties {
            basis_points: 500,
            creators: vec![Creator {
                address: new_creator,
                percentage: 100,
            }],
            rule_set: RuleSet::None,
        }))
        .instruction();

    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let update_collection_plugin_tx = Transaction::new_signed_with_payer(
        &[update_collection_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&update_collection_plugin_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```
{% /dialect %}
{% /dialect-switcher %}

## 常见错误

### `Authority mismatch`
您没有使用合集的 `updateAuthority` 进行签名。获取合集来检查：
```ts
const collection = await fetchCollection(umi, collectionAddress)
console.log(collection.updateAuthority) // 必须与 umi.identity 匹配
```

## Notes

- 要添加合集上尚不存在的插件，请使用 `addCollectionPlugin` 而非 `updateCollectionPlugin`
- 更新合集级别的插件会影响继承它的所有 Asset — 拥有同类型自有插件的 Asset 不受影响
- 通过 `updateCollection` 的 `newUpdateAuthority` 参数可将 `updateAuthority` 转移给新账户

## Quick Reference

| Instruction | JS 函数 | 使用场景 |
|-------------|-------------|-------------|
| `UpdateCollectionV1` | `updateCollection` | 更改 `name` 或 `uri` |
| `UpdateCollectionPluginV1` | `updateCollectionPlugin` | 修改现有插件配置 |

| 账户 | 必填 | 说明 |
|---------|----------|-------------|
| `collection` | 是 | 要更新的 Collection |
| `authority` | 是 | 必须是 `updateAuthority` |
| `payer` | 是 | 支付交易费用 |
| `newUpdateAuthority` | 否 | 将 Update Authority 转移给新账户 |

| 源码 | 链接 |
|--------|------|
| UpdateCollectionV1 | [GitHub](https://github.com/metaplex-foundation/mpl-core/blob/main/programs/mpl-core/src/instruction.rs#L167) |
| UpdateCollectionPluginV1 | [GitHub](https://github.com/metaplex-foundation/mpl-core/blob/main/programs/mpl-core/src/instruction.rs#L81) |
