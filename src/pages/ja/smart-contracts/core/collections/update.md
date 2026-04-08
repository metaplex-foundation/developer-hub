---
title: Core Collectionの更新
metaTitle: Core Collectionの更新 | Metaplex Core
description: mpl-core SDKを使用してupdateCollectionとupdateCollectionPlugin命令でSolana上のCore Collectionのメタデータとプラグインを更新する方法。
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
  - CollectionのupdateAuthorityをsignerとしてUmiを設定する
  - updateCollectionにcollectionアドレスと新しい名前またはURIを渡して呼び出す
  - updateCollectionPluginを呼び出してcollectionのプラグイン設定を変更する
howToTools:
  - Node.js
  - Umi framework
  - mpl-core SDK
---

`updateCollection`と`updateCollectionPlugin`は既存の[Core Collection](/smart-contracts/core/collections)のメタデータとプラグイン設定を変更します。 {% .lead %}

{% callout title="学習内容" %}
- CollectionのnameまたはURIの更新
- Collectionに付与されたプラグインの更新
{% /callout %}

## Summary

Core Collectionの作成後の更新には2つの命令があります。

- `updateCollection` — collectionの`name`または`uri`を変更する
- `updateCollectionPlugin` — collectionの既存プラグインの設定を変更する
- どちらも`updateAuthority`の署名が必要です
- コレクションレベルのプラグインへの変更はそれを継承するメンバーAssetに伝播します

**ジャンプ：** [メタデータの更新](#collectionメタデータの更新) · [プラグインの更新](#collectionプラグインの更新) · [エラー対処](#よくあるエラー)

## 前提条件

- CollectionのupdateAuthorityをsignerとして設定した**Umi** — この値を取得するには[Collectionの取得](/smart-contracts/core/collections/fetch)を参照
- 更新したいcollectionのアドレス

## Collectionメタデータ更新

`updateCollection`は既存Collectionの`name`および/または`uri`を変更します。変更したいフィールドのみ渡してください。

{% dialect-switcher title="Core Collectionの更新" %}
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

## Collectionプラグイン更新

`updateCollectionPlugin`はCollectionにすでに付与されているプラグインの設定を変更します。以下の例では[Royaltiesプラグイン](/smart-contracts/core/plugins/royalties)のBasis pointsとクリエイター配分を更新しています。

{% dialect-switcher title="Core Collectionプラグインの更新" %}
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

## よくあるエラー

### `Authority mismatch`
CollectionのupdateAuthorityとして署名していません。Collectionを取得して確認してください：
```ts
const collection = await fetchCollection(umi, collectionAddress)
console.log(collection.updateAuthority) // umi.identityと一致する必要があります
```

## Notes

- Collectionにまだ存在しないプラグインを追加するには、`updateCollectionPlugin`ではなく`addCollectionPlugin`を使用してください
- コレクションレベルのプラグインを更新すると、それを継承するすべてのAssetに影響します — 同じタイプの自前プラグインを持つAssetは影響を受けません
- `updateCollection`の`newUpdateAuthority`パラメータで`updateAuthority`を新しいアカウントに移管できます

## Quick Reference

| Instruction | JS関数 | 使用場面 |
|-------------|-------------|-------------|
| `UpdateCollectionV1` | `updateCollection` | `name`または`uri`の変更 |
| `UpdateCollectionPluginV1` | `updateCollectionPlugin` | 既存プラグインの設定変更 |

| アカウント | 必須 | 説明 |
|---------|----------|-------------|
| `collection` | Yes | 更新するCollection |
| `authority` | Yes | `updateAuthority`である必要がある |
| `payer` | Yes | トランザクション手数料の支払い |
| `newUpdateAuthority` | No | 新しいアカウントにUpdate Authorityを移管 |

| ソース | リンク |
|--------|------|
| UpdateCollectionV1 | [GitHub](https://github.com/metaplex-foundation/mpl-core/blob/main/programs/mpl-core/src/instruction.rs#L167) |
| UpdateCollectionPluginV1 | [GitHub](https://github.com/metaplex-foundation/mpl-core/blob/main/programs/mpl-core/src/instruction.rs#L81) |
