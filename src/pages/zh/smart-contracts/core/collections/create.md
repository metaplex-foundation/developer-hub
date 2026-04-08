---
title: 创建 Core Collection
metaTitle: 创建 Core Collection | Metaplex Core
description: 如何使用 mpl-core SDK 和 Umi 在 Solana 上创建 Core Collection — 包括有插件和无插件的情况。
updated: '04-08-2026'
keywords:
  - create collection
  - Core Collection
  - mpl-core
  - createCollection
  - collection plugins
about:
  - Creating NFT collections
  - Core Collections
proficiencyLevel: Beginner
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
howToSteps:
  - 使用 npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi 安装 mpl-core SDK
  - 上传合集元数据 JSON 以获取 URI
  - 调用 createCollection(umi, { collection, name, uri })
  - 创建 Asset 时传入 collection 地址
howToTools:
  - Node.js
  - Umi framework
  - mpl-core SDK
---

`createCollection` 指令在 Solana 上创建一个带有名称、元数据 URI 和可选插件的新 [Core Collection](/smart-contracts/core/collections) 账户。 {% .lead %}

{% callout title="学习内容" %}
- 使用名称和 URI 创建简单的 Collection
- 创建附带 Royalties 插件的 Collection
- 处理常见的创建错误
{% /callout %}

## Summary

`createCollection` 部署一个新的 Collection 账户，将 [Core Asset](/smart-contracts/core/what-is-an-asset) 组织在共享元数据和插件下。

- 需要一个新的密钥对作为 collection 地址 — 重用现有地址会失败
- 创建时可以指定可选的[插件](/smart-contracts/core/plugins)
- 需要约 0.0015 SOL 作为租金
- 默认情况下付款方成为 `updateAuthority`

## Quick Start

1. 安装：`npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi`
2. 上传合集元数据 JSON 以获取 URI
3. 调用 `createCollection(umi, { collection, name, uri })`
4. 创建 Asset 时传入 collection 地址

**跳转至：** [简单 Collection](#创建简单的-collection) · [带插件](#创建带插件的-collection) · [错误处理](#常见错误)

## 前提条件

- 已配置签名者和 RPC 连接的 **Umi** — 参见 [JavaScript SDK](/smart-contracts/core/sdk/javascript)
- 用于交易费用的 **SOL**（每个 Collection 约 0.002 SOL）
- 已上传到 Arweave 或 IPFS 的包含合集图片和名称的**元数据 JSON**

## 创建简单的 Collection

`createCollection` 需要 `name`、元数据 `uri` 以及作为 collection 签名者的新密钥对。

{% code-tabs-imported from="core/create-collection" frameworks="umi" /%}

{% callout type="note" %}
`collection` 参数每次必须是新的密钥对。重用现有账户地址会导致 `Collection account already exists` 错误。
{% /callout %}

## 创建带插件的 Collection

向 `createCollection` 传入 `plugins` 数组以在创建时附加插件。以下示例附加了 [Royalties 插件](/smart-contracts/core/plugins/royalties)。

{% dialect-switcher title="创建带 Royalties 插件的 Core Collection" %}
{% dialect title="JavaScript" id="js" %}
```ts {% title="create-collection-with-royalties.ts" %}
import { generateSigner, publicKey } from '@metaplex-foundation/umi'
import { createCollection, ruleSet } from '@metaplex-foundation/mpl-core'

const collectionSigner = generateSigner(umi)
const creator1 = publicKey('11111111111111111111111111111111')
const creator2 = publicKey('22222222222222222222222222222222')

await createCollection(umi, {
  collection: collectionSigner,
  name: 'My NFT',
  uri: 'https://example.com/my-nft.json',
  plugins: [
    {
      type: 'Royalties',
      basisPoints: 500,
      creators: [
        { address: creator1, percentage: 20 },
        { address: creator2, percentage: 80 },
      ],
      ruleSet: ruleSet('None'),
    },
  ],
}).sendAndConfirm(umi)
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust {% title="create_collection_with_royalties.rs" %}
use mpl_core::{
    instructions::CreateCollectionV1Builder,
    types::{Creator, Plugin, PluginAuthority, PluginAuthorityPair, Royalties, RuleSet},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn create_collection_with_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let payer = Keypair::new();
    let collection = Keypair::new();
    let creator = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let create_collection_ix = CreateCollectionV1Builder::new()
        .collection(collection.pubkey())
        .payer(payer.pubkey())
        .name("My Nft".into())
        .uri("https://example.com/my-nft.json".into())
        .plugins(vec![PluginAuthorityPair {
            plugin: Plugin::Royalties(Royalties {
                basis_points: 500,
                creators: vec![Creator {
                    address: creator,
                    percentage: 100,
                }],
                rule_set: RuleSet::None,
            }),
            authority: Some(PluginAuthority::None),
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

## 常见错误

### `Collection account already exists`
该 collection 密钥对已在此网络上使用过。每次生成新的签名者：
```ts
const collectionSigner = generateSigner(umi) // 必须是唯一的密钥对
```

### `Insufficient funds`
付款方钱包需要约 0.002 SOL。在开发网上充值：
```bash
solana airdrop 1 <WALLET_ADDRESS> --url devnet
```

## Notes

- 创建时添加的插件可以在之后使用 `updateCollectionPlugin` 更新 — 参见[更新 Collection](/smart-contracts/core/collections/update)
- `updateAuthority` 默认为付款方 — 传入显式的 `updateAuthority` 来设置不同的账户
- 所有可用于 Asset 的插件也可以应用于 Collection — 参见[插件概述](/smart-contracts/core/plugins)

## Quick Reference

| 项目 | 值 |
|------|-------|
| Instruction | `CreateCollectionV1` |
| JS 函数 | `createCollection` |
| 必填账户 | `collection`（新密钥对）、`payer` |
| 可选账户 | `updateAuthority`、`systemProgram` |
| 必填参数 | `name`、`uri` |
| 可选参数 | `plugins` |
| 租金费用 | 约 0.0015 SOL |
| 源码 | [GitHub](https://github.com/metaplex-foundation/mpl-core/blob/main/programs/mpl-core/src/instruction.rs#L30) |
