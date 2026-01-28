---
title: Master Editionプラグイン
metaTitle: Master Editionプラグイン | Metaplex Core
description: Master Editionプラグインでエディションアセットをコレクションにグループ化します。プリントシリーズや限定版の最大供給量とエディションメタデータを保存します。
---

**Master Editionプラグイン**は、番号付きエディションアセットをコレクションにグループ化します。最大供給量、エディション名、URIを保存して「100部限定」のようなプリントシリーズを作成します。 {% .lead %}

{% callout title="学習内容" %}

- コレクションにMaster Editionを追加する
- 最大供給量とメタデータを設定する
- Editionアセットをグループ化する
- プリントワークフローを理解する

{% /callout %}

## 概要

**Master Edition**プラグインは、[Edition](/ja/smart-contracts/core/plugins/edition)アセットをグループ化するコレクション用の権限管理プラグインです。最大供給量とオプションのエディション固有メタデータを保存します。

- 権限管理（更新権限が制御）
- コレクション専用（アセットには使用不可）
- 値は情報提供目的であり、強制されません
- Candy Machineと使用して自動エディション作成

## 対象外

供給量の強制（Candy Machineガードを使用）、個別のエディション番号（アセットのEditionプラグインを使用）、および自動ミント。

## クイックスタート

**ジャンプ先:** [コレクション作成](#creating-a-collection-with-the-master-edition-plugin) · [プラグイン更新](#update-the-master-edition-plugin)

1. Master Editionプラグインと最大供給量でコレクションを作成
2. Editionプラグインを持つアセットをミント（番号1, 2, 3...）
3. 必要に応じて最大供給量やメタデータを更新

{% callout type="note" title="推奨される使用方法" %}

推奨事項：

- Master Editionプラグインを使用してエディションをグループ化
- Candy MachineとEdition Guardを使用して番号付けを自動処理

{% /callout %}

## 対応

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ❌  |
| MPL Core Collection | ✅  |

## 引数

| 引数      | 値                   | 用途                                                                     |
| --------- | -------------------- | ----------------------------------------------------------------------- |
| maxSupply | Option<number> (u32) | 最大プリント数を示します。オープンエディションを許可するためオプション |
| name      | Option<String>       | エディション名（コレクション名と異なる場合）                             |
| uri       | Option<String>       | エディションのURI（コレクションURIと異なる場合）                         |

これらの値は権限者によっていつでも変更できます。純粋に情報提供目的であり、強制されません。

## Master Editionプラグインを持つコレクションの作成

{% dialect-switcher title="Master EditionプラグインでMPL Coreコレクションを作成" %}
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

## Master Editionプラグインの更新

Master Editionプラグインがミュータブルな場合、他のコレクションプラグインと同様に更新できます：

{% dialect-switcher title="Master Editionプラグインの更新" %}
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
_近日公開_

{% /dialect %}
{% /dialect-switcher %}

## 一般的なエラー

### `Cannot add to Asset`

Master Editionはコレクション専用であり、個別のアセットには使用できません。アセットにはEditionプラグインを使用してください。

### `Authority mismatch`

更新権限のみがMaster Editionプラグインを追加または更新できます。

## 注意事項

- すべての値（maxSupply、name、uri）は情報提供目的のみであり、強制されません
- 実際の供給量制限を強制するにはCandy Machineガードを使用してください
- name/uriはエディション固有のブランディングのためにコレクションメタデータを上書きします
- 権限者によっていつでも更新可能

## クイックリファレンス

### 引数

| 引数 | 型 | 必須 | 説明 |
|----------|------|----------|-------------|
| `maxSupply` | `Option<u32>` | いいえ | 最大エディション数（オープンエディションの場合はnull） |
| `name` | `Option<String>` | いいえ | エディション固有の名前 |
| `uri` | `Option<String>` | いいえ | エディション固有のメタデータURI |

### エディションセットアップパターン

| ステップ | アクション | プラグイン |
|------|--------|--------|
| 1 | コレクション作成 | Master Edition（最大供給量） |
| 2 | アセットミント | Edition（番号1, 2, 3...） |
| 3 | 検証 | エディション番号と供給量を確認 |

## FAQ

### Master Editionは最大供給量を強制しますか？

いいえ。`maxSupply`は情報提供目的のみです。実際にミント時に供給量制限を強制するには、適切なガードを持つCandy Machineを使用してください。

### Master Editionのname/uriとコレクションのname/uriの違いは何ですか？

Master Editionのname/uriは、ベースコレクションとは異なるエディション固有のメタデータを提供できます。例えば、コレクションが「抽象アートシリーズ」で、Master Edition名が「2024年限定プリントラン」という場合があります。

### オープンエディション（無制限供給）を作成できますか？

はい。`maxSupply`を`null`に設定するか、完全に省略してください。これは定義された制限のないオープンエディションを示します。

### Master EditionとEditionプラグインの両方が必要ですか？

適切なプリント追跡のためには、はい。Master Editionはコレクションに適用（グループ化と供給情報）、Editionは各アセットに適用（個別の番号）。連携して機能します。

### 既存のコレクションにMaster Editionを追加できますか？

はい、アセットのEditionプラグインとは異なり、Master Editionは`addCollectionPlugin`を使用して既存のコレクションに追加できます。

## 用語集

| 用語 | 定義 |
|------|------------|
| **Master Edition** | エディションをグループ化し供給量を保存するコレクションプラグイン |
| **Edition** | 個別のエディション番号を保存するアセットプラグイン |
| **Open Edition** | 最大供給量制限のないエディションシリーズ |
| **Provenance** | 出所と所有履歴の記録 |
| **maxSupply** | 最大エディション数（情報提供目的） |

---

*Metaplex Foundation管理 · 2026年1月最終確認 · @metaplex-foundation/mpl-core対応*
