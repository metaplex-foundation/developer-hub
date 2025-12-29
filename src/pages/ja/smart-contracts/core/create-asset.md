---
title: アセットの作成
metaTitle: アセットの作成 | Core
description: Metaplex Coreパッケージを使用してCore NFTアセットを作成する方法を学びます。
---

[Core概要](/ja/smart-contracts/core)で説明されているように、Core上のデジタルアセットは、正確に1つのオンチェーンアカウントとトークンを説明するオフチェーンデータで構成されています。このページでは、これらのアセットをミントするプロセスを説明します。 {% .lead %}

## 作成プロセス

1. **オフチェーンデータのアップロード。** まず、オフチェーンデータが準備できていることを確認する必要があります。これは、アセットを説明するJSONファイルをどこかに保存する必要があることを意味します。そのJSONファイルがどこに保存されているかは重要ではありませんが、**URI**経由でアクセス可能である必要があります。オフチェーンメタデータは、[従来のtoken metadata標準](/token-metadata/token-standard#the-non-fungible-standard)と同様に見えることができます。
2. **オンチェーンAssetアカウントの作成。** 次に、アセットのデータを保持するオンチェーンAssetアカウントを作成する必要があります。

具体的なコード例を提供しながら、これらのステップをより詳しく掘り下げてみましょう。

## オフチェーンデータのアップロード

オフチェーンデータをアップロードするには、任意のストレージサービス（Arweave、IPFS、AWSなど）を使用するか、自分のサーバーに保存することができます。これらのいくつかをユーザーにとってより簡単にするために、`Umi`には`Irys（Arweaveにアップロード）`や`nftStorage（IPFSにアップロード）`などの専用プラグインがあります。プラグインが選択されると、これによりユーザーはデータをアップロードするための統一されたインターフェースが提供されます。

{% dialect-switcher title="アセットとJSONデータのアップロード" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
const [imageUri] = await umi.uploader.upload([imageFile])
const uri = await umi.uploader.uploadJson({
  name: 'My NFT',
  description: 'This is my NFT',
  image: imageUri,
  // ...
})
```

{% totem-accordion title="アップローダーの選択" %}

Umiを使用してお好みのアップローダーを選択するには、アップローダーが提供するプラグインをインストールするだけです。

例えば、Irysプラグインをインストールする方法は次のとおりです：

```ts
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'

umi.use(irysUploader())
```

{% /totem-accordion %}

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

これで**URI**が用意できたので、次のステップに進むことができます。

## アセットの作成

アセットを作成するには`createV1`インストラクションを使用します。`createV1`インストラクションは、アセットの基本メタデータの設定に加えて、アセットをコレクションに追加したり、[後で](#プラグイン付きアセットの作成)説明されるプラグインの割り当てなどを含みます。

以下は簡単な例です：

{% totem %}
{% totem-accordion title="技術的インストラクション詳細" %}
**インストラクションアカウントリスト**

| アカウント      | 説明                                          |
| ------------- | -------------------------------------------- |
| asset         | MPL Core Assetのアドレス                      |
| collection    | Core Assetが属するコレクション                  |
| authority     | 新しいアセットの権限                            |
| payer         | ストレージ手数料を支払うアカウント                |
| new owner     | アセットを受け取る所有者                        |
| systemProgram | システムプログラムアカウント                     |
| logWrapper    | SPL Noopプログラム                           |

**インストラクション引数**

| 引数        | 説明                                                    |
| --------- | ------------------------------------------------------ |
| dataState | データがアカウント状態または台帳状態に格納されるかどうか        |
| name      | MPL Core Assetの名前                                    |
| uri       | オフチェーンJSONメタデータURI                             |
| plugins   | アセットに持たせたいプラグイン                             |

一部のアカウント/引数は、使いやすさのためにSDKで抽象化されるか、オプションである場合があります。
オンチェーンインストラクションの詳細な説明は[Github](https://github.com/metaplex-foundation/mpl-core/blob/5a45f7b891f2ca58ad1fc18e0ebdd0556ad59a4b/programs/mpl-core/src/instruction.rs#L18)で見ることができます

{% /totem-accordion %}
{% /totem %}

{% seperator h="6" /%}

{% dialect-switcher title="アセットの作成" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { generateSigner, publicKey } from '@metaplex-foundation/umi'
import { create } from '@metaplex-foundation/mpl-core'

const assetSigner = generateSigner(umi)

const result = await create(umi, {
  asset: assetSigner,
  name: 'My Asset',
  uri: 'https://example.com/my-asset.json',
  //owner: publicKey('11111111111111111111111111111111'), //別のウォレットにミントするためのオプション
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::instructions::CreateV1Builder;
use solana_client::nonblocking::rpc_client;
use solana_sdk::{signature::Keypair, signer::Signer, transaction::Transaction};


pub async fn create_asset() {

    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let payer = Keypair::new();
    let asset = Keypair::new();

    let create_asset_ix = CreateV1Builder::new()
        .asset(asset.pubkey())
        .payer(payer.pubkey())
        .name("My Nft".into())
        .uri("https://example.com/my-nft.json".into())
        .instruction();

    let signers = vec![&asset, &payer];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let create_asset_tx = Transaction::new_signed_with_payer(
        &[create_asset_ix],
        Some(&payer.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client.send_and_confirm_transaction(&create_asset_tx).await.unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect %}

{% dialect title="Rust (CPI)" id="rust-cpi" %}

```rust
let create_ix = CreateV1CpiBuilder::new()
        .asset(input.asset.pubkey())
        .collection(input.collection)
        .authority(input.authority)
        .payer(payer)
        .owner(input.owner)
        .update_authority(input.update_authority)
        .system_program(system_program::ID)
        .data_state(input.data_state.unwrap_or(DataState::AccountState))
        .name(input.name.unwrap_or(DEFAULT_ASSET_NAME.to_owned()))
        .uri(input.uri.unwrap_or(DEFAULT_ASSET_URI.to_owned()))
        .plugins(input.plugins)
        .invoke();
```

{% /dialect %}
{% /dialect-switcher %}

## コレクション内でのアセット作成

MPL Core Assetは、MPL Core Collectionが既に存在する場合、コレクションに直接作成できます。Collection Assetを作成するには[こちら](/ja/smart-contracts/core/collections)をご覧ください。

{% dialect-switcher title="コレクション内でのアセット作成" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { generateSigner, publicKey } from '@metaplex-foundation/umi'
import {
  createCollection,
  create,
  fetchCollection,
} from '@metaplex-foundation/mpl-core'

const collectionSigner = generateSigner(umi)

// コレクションの作成
// 単一のスクリプトでこれを行う場合、
// sleep関数またはcommitment levelを'finalized'にして
// フェッチする前にコレクションが完全に書き込まれるようにする必要があります。
await createCollection(umi, {
  collection: collectionSigner,
  name: 'My Collection',
  uri: 'https://example.com/my-collection.json',
}).sendAndConfirm(umi)

// コレクションをフェッチ
const collection = await fetchCollection(umi, collectionSigner.publicKey)


// assetSignerを生成してアセットを作成
const assetSigner = generateSigner(umi)

await create(umi, {
  asset: assetSigner,
  collection: collection,
  name: 'My Asset',
  uri: 'https://example.com/my-asset.json',
  //owner: publicKey('11111111111111111111111111111111'), //別のウォレットにミントするためのオプション
}).sendAndConfirm(umi)
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::instructions::{CreateCollectionV1Builder, CreateV1Builder};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{signature::Keypair, signer::Signer, transaction::Transaction};

pub async fn create_asset_with_collection() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let signer = Keypair::new(); // ここでkeypairをロードします。

    let collection = Keypair::new();

    let create_collection_ix = CreateCollectionV1Builder::new()
        .collection(collection.pubkey())
        .payer(signer.pubkey())
        .name("My Collection".into())
        .uri("https://example.com/my-collection.json".into())
        .instruction();

    let signers = vec![&collection, &signer];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let create_collection_tx = Transaction::new_signed_with_payer(
        &[create_collection_ix],
        Some(&signer.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&create_collection_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res);

    let asset = Keypair::new();

    let create_asset_ix = CreateV1Builder::new()
        .asset(asset.pubkey())
        .collection(Some(collection.pubkey()))
        .payer(signer.pubkey())
        .name("My Nft".into())
        .uri("https://example.com/my-nft.json".into())
        .instruction();

    let signers = vec![&asset, &signer];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let create_asset_tx = Transaction::new_signed_with_payer(
        &[create_asset_ix],
        Some(&signer.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&create_asset_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect %}

{% dialect title="Rust (CPI)" id="rust-cpi" %}

```rust
let create_ix = CreateV1CpiBuilder::new(input.program)
    .asset(input.asset.pubkey())
    .collection(Some(input.collection))
    .authority(Some(input.authority))
    .payer(input.payer)
    .owner(Some(input.owner))
    .update_authority(Some(input.update_authority))
    .system_program(system_program::ID)
    .data_state(input.data_state.unwrap_or(DataState::AccountState))
    .name(input.name)
    .uri(input.uri)
    .plugins(input.plugins)
    .invoke();
```

{% /dialect %}

{% /dialect-switcher %}

## プラグイン付きアセットの作成

MPL Core Assetは、コレクションレベルとアセットレベルの両方でプラグインの使用をサポートしています。プラグイン付きのCore Assetを作成するには、作成時に`plugins`配列引数にプラグインタイプとそのパラメータを渡します。以下の例では、`Freeze`プラグインでミントを作成します。

{% dialect-switcher title="プラグイン付きアセットの作成" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { generateSigner } from '@metaplex-foundation/umi'
import { create, ruleSet } from '@metaplex-foundation/mpl-core'

const creator1 = publicKey('11111111111111111111111111111111')
const creator2 = publicKey('22222222222222222222222222222222')

const assetSigner = generateSigner(umi)

await create(umi, {
  asset: assetSigner,
  name: 'My Asset',
  uri: 'https://example.com/my-asset.json',
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

    let creator = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let create_asset_with_plugin_ix = CreateV1Builder::new()
        .asset(asset.pubkey())
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

プラグインのリストには以下が含まれますが、これらに限定されません：

- [Burn Delegate](/ja/smart-contracts/core/plugins/burn-delegate)
- [Freeze Delegate](/ja/smart-contracts/core/plugins/freeze-delegate)  
- [Royalties](/ja/smart-contracts/core/plugins/royalties)
- [Transfer Delegate](/ja/smart-contracts/core/plugins/transfer-delegate)
- [Update Delegate](/ja/smart-contracts/core/plugins/update-delegate)