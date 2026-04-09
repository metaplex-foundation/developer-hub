---
title: Core Collectionの作成
metaTitle: Core Collectionの作成 | Metaplex Core
description: mpl-core SDKとUmiを使用してSolana上でCore Collectionを作成する方法 — プラグインありとなしの両方について。
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
  - npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi でmpl-core SDKをインストール
  - URIを取得するためにコレクションメタデータJSONをアップロード
  - createCollection(umi, { collection, name, uri }) を呼び出す
  - Assetを作成する際にcollectionアドレスを渡す
howToTools:
  - Node.js
  - Umi framework
  - mpl-core SDK
---

`createCollection`命令は、名前、メタデータURI、オプションのプラグインを持つ新しい[Core Collection](/smart-contracts/core/collections)アカウントをSolana上に作成します。 {% .lead %}

{% callout title="学習内容" %}
- 名前とURIを使ったシンプルなCollectionの作成
- Royaltiesプラグインを付与したCollectionの作成
- よくある作成エラーの対処法
{% /callout %}

## Summary

`createCollection`は、[Core Asset](/smart-contracts/core/what-is-an-asset)を共有メタデータとプラグインの下にグループ化する新しいCollectionアカウントをデプロイします。

- collectionアドレスとして新しいキーペアが必要です — 既存のアドレスを再利用すると失敗します
- 作成時にオプションの[プラグイン](/smart-contracts/core/plugins)を指定できます
- レントとして約0.0015 SOLが必要です
- デフォルトでPayerが`updateAuthority`になります

## Quick Start

1. インストール：`npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi`
2. コレクションメタデータJSONをアップロードしてURIを取得
3. `createCollection(umi, { collection, name, uri })`を呼び出す
4. Assetを作成する際にcollectionアドレスを渡す

**ジャンプ：** [シンプルなCollection](#シンプルなcollectionの作成) · [プラグインあり](#プラグインを付与したcollectionの作成) · [エラー対処](#よくあるエラー)

## 前提条件

- signerとRPC接続が設定された**Umi** — [JavaScript SDK](/smart-contracts/core/sdk/javascript)を参照
- トランザクション手数料用の**SOL**（Collection1つあたり約0.002 SOL）
- ArweaveまたはIPFSにアップロードされたコレクション画像と名前を含む**メタデータJSON**

## シンプルなCollectionの作成

`createCollection`には`name`、メタデータ`uri`、そしてcollection signerとして新しいキーペアが必要です。

{% code-tabs-imported from="core/create-collection" frameworks="umi" /%}

{% callout type="note" %}
`collection`パラメータは毎回新しいキーペアである必要があります。既存のアカウントアドレスを再利用すると`Collection account already exists`エラーが発生します。
{% /callout %}

## プラグインを付与したCollectionの作成

`createCollection`に`plugins`配列を渡すことで、作成時にプラグインを付与できます。以下の例では[Royaltiesプラグイン](/smart-contracts/core/plugins/royalties)を付与しています。

{% dialect-switcher title="Royaltiesプラグインを付与したCore Collectionの作成" %}
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

## よくあるエラー

### `Collection account already exists`
このネットワークでcollectionキーペアが既に使用されています。毎回新しいsignerを生成してください：
```ts
const collectionSigner = generateSigner(umi) // 一意のキーペアであること
```

### `Insufficient funds`
Payerウォレットに約0.002 SOLが必要です。Devnetでは以下でチャージできます：
```bash
solana airdrop 1 <WALLET_ADDRESS> --url devnet
```

## Notes

- 作成時に追加したプラグインは後から`updateCollectionPlugin`で更新できます — [Collectionの更新](/smart-contracts/core/collections/update)を参照
- `updateAuthority`はデフォルトでPayerになります — 別のアカウントに設定するには明示的に`updateAuthority`を渡してください
- Assetに利用可能なすべてのプラグインはCollectionにも適用できます — [プラグイン概要](/smart-contracts/core/plugins)を参照

## Quick Reference

| 項目 | 値 |
|------|-------|
| Instruction | `CreateCollectionV1` |
| JS関数 | `createCollection` |
| 必須アカウント | `collection`（新しいキーペア）、`payer` |
| オプションアカウント | `updateAuthority`、`systemProgram` |
| 必須引数 | `name`、`uri` |
| オプション引数 | `plugins` |
| レントコスト | 約0.0015 SOL |
| ソース | [GitHub](https://github.com/metaplex-foundation/mpl-core/blob/main/programs/mpl-core/src/instruction.rs#L30) |
