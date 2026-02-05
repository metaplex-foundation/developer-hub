---
title: MPL Coreでのプリントエディション
metaTitle: プリントエディション | Coreガイド
description: このガイドでは、Metaplex Coreプロトコルでプラグインを組み合わせてエディションを作成する方法を示します。
updated: '01-31-2026'
keywords:
  - print editions
  - NFT editions
  - limited edition
  - master edition
about:
  - Edition creation
  - Print series
  - Edition plugins
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
howToSteps:
  - 供給量追跡のためにMaster Editionプラグインを持つCollectionを作成
  - エディション番号を含むEditionプラグインを持つAssetsを作成
  - オプションでCandy Machine Edition Guardを使用して自動番号付け
  - エディションがMaster Edition Collectionに適切にリンクされていることを確認
howToTools:
  - Node.js
  - Umiフレームワーク
  - mpl-core SDK
---
## はじめに
### エディションとは？
エディションは同じ「マスターエディション」のコピーです。概念を理解するために、物理的な絵画を思い浮かべると役立ちます：マスターエディションは最初の絵画で、エディション（プリントとも呼ばれる）はその絵画のコピーです。
### CoreでのEditions
MPL Core Editionサポートはメインネットリリース後すぐに追加されました。Token Metadata Editionsとは異なり、エディション番号と供給量は強制されず、情報提供のみです。
Coreでエディション概念を実現するために、2つの[プラグイン](/smart-contracts/core/plugins)が使用されます：Collectionの[Master Edition](/smart-contracts/core/plugins/master-edition)とAsset（プリント）の[Edition](/smart-contracts/core/plugins/edition)。階層は次のようになります：
{% diagram %}
{% node %}
{% node #master label="Master Edition" theme="indigo" /%}
{% /node %}
{% node y="50" parent="master" theme="transparent" %}
Master Editionプラグインを持つ
Collection
{% /node %}
{% node x="200" y="-70" parent="master" %}
{% node #asset1 label="Edition" theme="blue" /%}
{% /node %}
{% node y="70" parent="asset1" %}
{% node #asset2 label="Edition" theme="blue" /%}
{% /node %}
{% node y="70" parent="asset2" %}
{% node #asset3 label="Edition" theme="blue" /%}
{% /node %}
{% node y="50" parent="asset3" theme="transparent" %}
Editionプラグインを持つ
Assets
{% /node %}
{% edge from="master" to="asset1" /%}
{% edge from="master" to="asset2" /%}
{% edge from="master" to="asset3" /%}
{% /diagram %}
## Candy Machineを使用したEditionの作成
Editionを作成・販売する最も簡単な方法は、Core Candy Machineを活用することです。
以下のコードは、Master Edition CollectionとEditionをプリントするCandy Machineを作成します。
{% dialect-switcher title="Edition GuardとMaster Edition Collectionを持つCandy Machineの作成" %}
{% dialect title="JavaScript" id="js" %}
まず、必要なすべての関数をインポートし、RPCとWalletでUmiをセットアップします：
```ts
import {
  create,
  mplCandyMachine,
} from "@metaplex-foundation/mpl-core-candy-machine";
import {
    createCollection,
    ruleSet
} from "@metaplex-foundation/mpl-core";
import crypto from "crypto";
import {
  generateSigner,
  keypairIdentity,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
// 選択したRPCエンドポイントを使用
const umi = createUmi("http://127.0.0.1:8899").use(mplCandyMachine());
// あなたのキーペアまたはWallet Adapterを使用
const keypair = generateSigner(umi);
umi.use(keypairIdentity(keypair));
```
このセットアップ後、[Master Editionプラグイン](/smart-contracts/core/plugins/master-edition)を持つCollectionを作成できます。`maxSupply`フィールドはプリントするEditionの数を決定します。プラグインの`name`と`uri`フィールドは、Collection名とuriに加えて使用できます。
使いやすさのために、[Royaltyプラグイン](/smart-contracts/core/plugins/royalties)も追加します。
```ts
const collectionSigner = generateSigner(umi);
await createCollection(umi, {
  collection: collectionSigner,
  name: "Master Edition",
  uri: "https://example.com/master-edition.json",
  plugins: [
    {
      type: "MasterEdition",
        maxSupply: 100,
        // 親コレクションと同じにしたい場合はnameとuriは不要
        name: undefined,
        uri: undefined,
    },
    {
      type: "Royalties",
      basisPoints: 500,
      creators: [{ address: umi.identity.publicKey, percentage: 100 }],
      ruleSet: ruleSet("None"),
    }
    ]
  }).sendAndConfirm(umi);
```
Collectionの作成後、`hiddenSettings`と`edition`ガードを使用してCandy Machineを作成できます。
- `hiddenSettings`は、ミントされたすべてのAssetsに同じ、または類似の名前とメタデータを割り当てるために使用されます。`$ID$`変数を使用すると、ミント時にミントされたAssetのインデックスに置き換えられます。
- `edition`ガードは、Assetsに[Editionプラグイン](/smart-contracts/core/plugins/edition)を追加するために使用されます。Edition番号はミントされたAssetごとに増加し、`editionStartOffset`の番号から始まります。
```ts
// EditionsのNameとオフチェーンメタデータ
const editionData = {
  name: "Edition Name",
  uri: "https://example.com/edition-asset.json",
};
// editionsは使用しないがCandy Machineが必要とする
// ハッシュを作成
const string = JSON.stringify(editionData);
const hash = crypto.createHash("sha256").update(string).digest();
const candyMachine = generateSigner(umi);
const createIx = await create(umi, {
  candyMachine,
  collection: collectionSigner.publicKey,
  collectionUpdateAuthority: umi.identity,
  itemsAvailable: 100,
  hiddenSettings: {
    name: editionData.name,
    uri: editionData.uri,
    hash,
  },
  guards: {
    edition: { editionStartOffset: 0 },
    // ... 追加のGuards
  },
})
await createIx.sendAndConfirm(umi);
```
{% /dialect %}
{% /dialect-switcher %}
これで完了です！
ユーザーはあなたのCandy MachineからEditionをミントできます。
## Core Candy MachineなしでEditionを作成
{% callout type="note" %}
MPL Core EditionsにはCore Candy Machineの使用を強く推奨します。Candy MachineはEditionsの作成と正しい番号付けを処理します。
{% /callout %}
Core Candy MachineなしでEditionを作成するには：
1. [Master Edition](/smart-contracts/core/plugins/master-edition)プラグインを使用してCollectionを作成
{% dialect-switcher title="Master EditionプラグインでMPL Core Collectionを作成" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { generateSigner, publicKey } from '@metaplex-foundation/umi'
import {
  createCollection,
  ruleSet,
} from '@metaplex-foundation/core'
const collectionSigner = generateSigner(umi)
const creator1 = publicKey('11111111111111111111111111111111')
const creator2 = publicKey('22222222222222222222222222222222')
await createCollection(umi, {
  collection: collectionSigner,
  name: "Master Edition",
  uri: "https://example.com/master-edition.json",
  plugins: [
    {
      type: "MasterEdition",
        maxSupply: 100,
        // 親コレクションと同じにしたい場合はnameとuriは不要
        name: undefined,
        uri: undefined,
    },
    {
      type: "Royalties",
      basisPoints: 500,
      creators: [
        { address: creator1, percentage: 50 },
        { address: creator2, percentage: 50 }
      ],
      ruleSet: ruleSet("None"),
    }
    ]
  }).sendAndConfirm(umi);
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
            plugin: Plugin::MasterEdition(MasterEdition {
                max_supply: 100,
                name: "My Master Edition"
                uri: "https://example.com/my-master-edition",
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
2. [Edition](/smart-contracts/core/plugins/edition)プラグインを持つAssetsを作成。プラグイン内の番号を増加させることを忘れないでください。
{% dialect-switcher title="EditionプラグインでMPL Core Assetを作成" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import {
    create,
} from '@metaplex-foundation/mpl-core'
const asset = generateSigner(umi)
const result = create(umi, {
  asset: asset,
  name: 'My Nft',
  uri: 'https://example.com/my-nft',
  collection: collectionSigner.publicKey,
  plugins: [
    {
      type: 'Edition',
      number: 1,
    }
  ],
}).sendAndConfirm(umi)
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust
use std::str::FromStr;
use mpl_core::{
    instructions::CreateV1Builder,
    types::{Creator, Plugin, PluginAuthority, PluginAuthorityPair, Royalties, RuleSet},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
pub async fn create_asset_with_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let payer = Keypair::new();
    let asset = Keypair::new();
    let authority = Keypair::new();
    let creator = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let create_asset_with_plugin_ix = CreateV1Builder::new()
        .asset(asset.pubkey())
        .payer(payer.pubkey())
        .name("My Nft".into())
        .uri("https://example.com/my-nft.json".into())
        .plugins(vec![PluginAuthorityPair {
            plugin: Plugin::Edition(Edition {
                number: 1,
            })
        }])
        .instruction();
    let signers = vec![&asset, &payer];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let create_asset_with_plugin_tx = Transaction::new_signed_with_payer(
        &[create_asset_with_plugin_ix],
        Some(&payer.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&create_asset_with_plugin_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```
{% /dialect %}
{% /dialect-switcher %}
## 関連情報
- [Candy Machineからミント](/core-candy-machine/mint)
- [Master Editionプラグイン](/smart-contracts/core/plugins/master-edition)
- [Editionプラグイン](/smart-contracts/core/plugins/edition)
