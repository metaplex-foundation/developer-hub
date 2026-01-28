---
title: コレクションの管理
metaTitle: Core Collections | Metaplex Core
description: Solana上でCore Collectionsを作成・管理する方法を学びます。NFT Assetをグループ化し、コレクションレベルのロイヤリティを設定し、コレクションメタデータを管理します。
---

このガイドでは、Metaplex Core SDKを使用してSolana上で**Core Collectionsを作成・管理**する方法を説明します。Collectionsは関連するAssetを共有アイデンティティの下にグループ化し、コレクションレベルのメタデータとプラグインを持ちます。 {% .lead %}

{% callout title="学習内容" %}

- 名前、URI、オプションのプラグインを持つCollectionを作成する
- 作成時にAssetをCollectionに追加する
- Collectionメタデータを取得・更新する
- コレクションレベルのプラグイン（ロイヤリティなど）を管理する

{% /callout %}

## 概要

**Collection**は関連するAssetをグループ化するCoreアカウントです。コレクションメタデータ（名前、画像、説明）を保存し、コレクション内のすべてのAssetに適用されるプラグインを保持できます。

- Collectionsは関連するAssetグループの「表紙」として機能します
- Assetは`collection`フィールドを通じてCollectionを参照します
- Collectionプラグイン（Royaltiesなど）はすべてのメンバーAssetに適用できます
- Collectionの作成には約0.0015 SOLかかります

## 対象外

Token Metadata Collections（mpl-token-metadataを使用）、圧縮NFTコレクション（Bubblegumを使用）、既存コレクションのCoreへの移行。

## クイックスタート

**移動先：** [Collectionの作成](#シンプルなコレクションの作成) · [プラグイン付き](#プラグイン付きコレクションの作成) · [取得](#コレクションの取得) · [更新](#コレクションの更新)

1. インストール: `npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi`
2. コレクションメタデータJSONをアップロードしてURIを取得
3. `createCollection(umi, { collection, name, uri })`を呼び出す
4. Asset作成時にコレクションアドレスを渡す

## 前提条件

- **Umi** - signerとRPC接続が設定済み
- **SOL** - トランザクション手数料用（コレクションあたり約0.002 SOL）
- **メタデータJSON** - コレクション画像付きでArweave/IPFSにアップロード済み

## コレクションとは？

Collectionsは、同じシリーズまたはグループに属するAssetのグループです。Assetをグループ化するには、まずコレクション名やコレクション画像など、そのコレクションに関連するメタデータを格納するCollection Assetを作成する必要があります。Collection Assetはコレクションの表紙として機能し、コレクション全体のプラグインも格納できます。

Collection Assetから保存およびアクセス可能なデータは以下のとおりです：

| アカウント      | 説明                                    |
| --------------- | -------------------------------------- |
| key             | アカウントキー識別子                      |
| updateAuthority | 新しいAssetの権限                        |
| name            | コレクション名                           |
| uri             | コレクションのオフチェーンメタデータへのURI |
| num minted      | コレクションでミントされたAsset数          |
| current size    | 現在コレクションにあるAsset数              |

## コレクションの作成

Core Collectionを作成するには、以下のように`CreateCollection`インストラクションを使用できます：

{% totem %}
{% totem-accordion title="技術的インストラクション詳細 - CreateCollectionV1" %}

**インストラクションアカウントリスト**

| アカウント      | 説明                                          |
| --------------- | -------------------------------------------- |
| collection      | Core Assetが属するCollection                   |
| updateAuthority | 新しいAssetの権限                              |
| payer           | ストレージ手数料を支払うアカウント              |
| systemProgram   | System Programアカウント                       |

**インストラクション引数**

| 引数    | 説明                                          |
| ------- | -------------------------------------------- |
| name    | Core Assetが属するCollection                   |
| uri     | 新しいAssetの権限                              |
| plugins | Collectionに持たせたいプラグイン                |

一部のアカウントと引数は、使いやすさのためにSDKで抽象化されるか、オプションである場合があります。
オンチェーンインストラクションの詳細な説明は[Github](https://github.com/metaplex-foundation/mpl-core/blob/5a45f7b891f2ca58ad1fc18e0ebdd0556ad59a4b/programs/mpl-core/src/instruction.rs#L30)で見ることができます。

{% /totem-accordion %}
{% /totem %}

### シンプルなコレクションの作成

以下のスニペットは、プラグインや特別な機能のないシンプルなCollectionを作成します。

{% code-tabs-imported from="core/create-collection" frameworks="umi" /%}

### プラグイン付きコレクションの作成

以下のスニペットは、[Royaltiesプラグイン](/ja/smart-contracts/core/plugins/royalties)が付加されたCollectionを作成します。[こちら](/ja/smart-contracts/core/plugins)で説明されているように、追加のプラグインをアタッチできます。

{% dialect-switcher title="プラグイン付きMPL Core Collectionの作成" %}
{% dialect title="JavaScript" id="js" %}

```ts
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
        {
          address: creator1,
          percentage: 20,
        },
        {
          address: creator2,
          percentage: 80,
        },
      ],
      ruleSet: ruleSet('None'), // 互換性ルールセット
    },
  ],
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
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

## コレクションの取得

Collectionを取得するには、以下の関数を使用できます：

{% dialect-switcher title="Collectionの取得" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { fetchCollectionV1 } from '@metaplex-foundation/mpl-core'
import { publicKey } from '@metaplex-foundation/umi'

const collectionId = publicKey('11111111111111111111111111111111')

const collection = await fetchCollection(umi, collectionId)

console.log(collection)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
use std::str::FromStr;
use mpl_core::Collection;
use solana_client::nonblocking::rpc_client;
use solana_sdk::pubkey::Pubkey;

pub async fn fetch_collection() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let collection_id = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let rpc_data = rpc_client.get_account_data(&collection_id).await.unwrap();

    let collection = Collection::from_bytes(&rpc_data).unwrap();

    print!("{:?}", collection)
}
```

{% /dialect %}
{% /dialect-switcher %}

## コレクションの更新

Core Collectionのデータを更新するには、`UpdateCollection`インストラクションを使用します。例えば、このインストラクションを使用してCollectionの名前を変更できます。

{% totem %}
{% totem-accordion title="技術的インストラクション詳細 - UpdateCollectionV1" %}

**インストラクションアカウントリスト**

| アカウント         | 説明                                          |
| ------------------ | -------------------------------------------- |
| collection         | Core Assetが属するCollection                   |
| payer              | ストレージ手数料を支払うアカウント              |
| authority          | 新しいAssetの権限                              |
| newUpdateAuthority | Collectionの新しい更新権限                     |
| systemProgram      | System Programアカウント                       |
| logWrapper         | SPL Noopプログラム                             |

**インストラクション引数**

| 引数 | 説明                            |
| ---- | -------------------------------- |
| name | MPL Core Assetの名前             |
| uri  | オフチェーンJSONメタデータURI     |

一部のアカウントと引数は、使いやすさのためにSDKで抽象化されるか、オプションである場合があります。
オンチェーンインストラクションの詳細な説明は[Github](https://github.com/metaplex-foundation/mpl-core/blob/5a45f7b891f2ca58ad1fc18e0ebdd0556ad59a4b/programs/mpl-core/src/instruction.rs#L167C4-L167C23)で見ることができます。

{% /totem-accordion %}
{% /totem %}

{% seperator h="6" /%}

{% dialect-switcher title="Collectionの更新" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updateCollection } from '@metaplex-foundation/mpl-core'

const collectionAddress = publicKey('1111111111111111111111111111111')

await updateCollection(umi, {
  collection: collectionAddress,
  name: 'my-nft',
  uri: 'https://exmaple.com/new-uri',
}).sendAndConfirm(umi)
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
use std::str::FromStr;

use mpl_core::instructions::UpdateCollectionV1Builder;
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};

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

## コレクションプラグインの更新

Core Collectionに付加されているプラグインの動作を変更したい場合は、`updateCollectionPlugin`インストラクションを使用できます。

{% totem %}
{% totem-accordion title="技術的インストラクション詳細 - UpdateCollectionPluginV1" %}

**インストラクションアカウントリスト**

| アカウント      | 説明                                          |
| ------------- | -------------------------------------------- |
| collection    | Core Assetが属するCollection                   |
| payer         | ストレージ手数料を支払うアカウント              |
| authority     | 新しいAssetの権限                              |
| systemProgram | System Programアカウント                       |
| logWrapper    | SPL Noopプログラム                             |

**インストラクション引数**

| 引数   | 説明                        |
| ------ | --------------------------- |
| plugin | 更新したいプラグイン         |

一部のアカウントは、使いやすさのためにSDKで抽象化されるか、オプションである場合があります。
オンチェーンインストラクションの詳細な説明は[Github](https://github.com/metaplex-foundation/mpl-core/blob/5a45f7b891f2ca58ad1fc18e0ebdd0556ad59a4b/programs/mpl-core/src/instruction.rs#L81)で見ることができます。

{% /totem-accordion %}
{% /totem %}

{% seperator h="6" /%}

{% dialect-switcher title="Collectionプラグインの更新" %}
{% dialect title="JavaScript" id="js" %}

```ts
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

```rust
use std::str::FromStr;
use mpl_core::{
    instructions::UpdateCollectionPluginV1Builder,
    types::{Creator, Plugin, Royalties, RuleSet},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};

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

### `Collection account already exists`

Collectionキーペアが既に使用されています。新しいsignerを生成してください：

```ts
const collectionSigner = generateSigner(umi) // 一意である必要があります
```

### `Authority mismatch`

Collectionの更新権限がありません。Collectionの`updateAuthority`フィールドがsignerと一致しているか確認してください。

### `Insufficient funds`

支払いウォレットに約0.002 SOLが必要です。以下でチャージしてください：

```bash
solana airdrop 1 <WALLET_ADDRESS> --url devnet
```

## 注意事項

- 作成時の`collection`パラメータは**新しいキーペア**である必要があります
- Collectionプラグインは、Assetレベルでオーバーライドされない限りAssetに継承されます
- 作成後にCollection状態を確認するには`fetchCollection`を使用してください
- `numMinted`カウンターは作成されたAssetの総数を追跡します（現在のサイズではありません）

## クイックリファレンス

### Program ID

| ネットワーク | アドレス |
|---------|---------|
| Mainnet | `CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d` |
| Devnet | `CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d` |

### 最小コード

```ts {% title="minimal-collection.ts" %}
import { generateSigner } from '@metaplex-foundation/umi'
import { createCollection } from '@metaplex-foundation/mpl-core'

const collection = generateSigner(umi)
await createCollection(umi, { collection, name: 'My Collection', uri: 'https://...' }).sendAndConfirm(umi)
```

### コスト内訳

| 項目 | コスト |
|------|------|
| Collectionアカウントレント | 約0.0015 SOL |
| トランザクション手数料 | 約0.000005 SOL |
| **合計** | **約0.002 SOL** |

## FAQ

### CollectionとAssetの違いは何ですか？

CollectionはAssetをグループ化するコンテナです。独自のメタデータ（名前、画像）を持ちますが、Assetのように所有したり転送したりすることはできません。Assetはユーザーが所有する実際のNFTです。

### 既存のAssetをCollectionに追加できますか？

はい、`newCollection`パラメータを使用して`update`インストラクションを使用します。Assetの更新権限には、ターゲットCollectionに追加する権限が必要です。

### NFTにはCollectionが必要ですか？

いいえ。Assetは単独でCollectionなしで存在できます。ただし、Collectionsはコレクションレベルのロイヤリティ、より簡単な発見可能性、バッチ操作を可能にします。

### AssetをCollectionから削除できますか？

はい、`update`インストラクションを使用してAssetのCollectionを変更します。AssetとCollection両方に適切な権限が必要です。

### Collectionを削除するとどうなりますか？

CollectionsはAssetを含んでいる間は削除できません。まずすべてのAssetを削除してから、Collectionアカウントを閉じることができます。

## 用語集

| 用語 | 定義 |
|------|------------|
| **Collection** | 関連するAssetを共有メタデータの下にグループ化するCoreアカウント |
| **Update Authority** | Collectionのメタデータとプラグインを変更できるアカウント |
| **numMinted** | Collectionで作成されたAssetの総数を追跡するカウンター |
| **currentSize** | 現在Collection内にあるAssetの数 |
| **Collection Plugin** | Collectionに付加されたプラグイン（例：Royalties） |
| **URI** | Collectionのオフチェーンメタデータを指すURL |

---

*Metaplex Foundationによって管理 · 最終確認日 2026年1月 · @metaplex-foundation/mpl-coreに適用*
