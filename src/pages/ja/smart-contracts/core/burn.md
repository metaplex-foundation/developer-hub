---
title: アセットのバーン
metaTitle: アセットのバーン | Metaplex Core
description: SolanaでCore NFTアセットをバーンする方法を学びます。Metaplex Core SDKを使用してアセットを永久に破棄し、レントを回収します。
---

このガイドでは、Metaplex Core SDKを使用してSolana上で**Core Assetをバーン**する方法を説明します。アセットを永久に破棄し、レントデポジットの大部分を回収します。 {% .lead %}

{% callout title="学習内容" %}

- アセットをバーンしてレントを回収する
- コレクション内のアセットのバーンを処理する
- バーンデリゲートの権限を理解する
- バーン後のアカウントの状態を知る

{% /callout %}

## 概要

Core Assetをバーンして永久に破棄し、レントを回収します。所有者（またはバーンデリゲート）のみがアセットをバーンできます。

- `burn(umi, { asset })` を呼び出してアセットを破棄
- レントの大部分（約0.0028 SOL）が支払者に返還される
- アカウント再利用を防ぐため少額（約0.0009 SOL）が残る
- バーンは**永久かつ不可逆**

## 対象外

Token Metadataのバーン（mpl-token-metadataを使用）、圧縮NFTのバーン（Bubblegumを使用）、コレクションのバーン（コレクションには独自のバーンプロセスがあります）。

## クイックスタート

**ジャンプ先:** [アセットのバーン](#コード例) · [コレクション内のバーン](#コレクションの一部であるアセットのバーン)

1. インストール: `npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi`
2. アセットをフェッチして所有権を確認
3. 所有者として `burn(umi, { asset })` を呼び出す
4. レントは自動的にウォレットに返還される

## 前提条件

- アセットを所有する（またはバーンデリゲートである）署名者で設定された**Umi**
- バーンするアセットの**アセットアドレス**
- **コレクションアドレス**（アセットがコレクション内にある場合）

アセットは`burn`命令を使用してバーンできます。これにより、レント免除手数料が所有者に返還されます。アカウントの再オープンを防ぐため、ごくわずかなSOL（0.00089784）のみがアカウントに残ります。

{% totem %}
{% totem-accordion title="技術的な命令の詳細" %}
**命令アカウントリスト**

| アカウント | 説明 |
| ------------- | ----------------------------------------------- |
| asset | MPL Core Assetのアドレス |
| collection | Core Assetが属するコレクション |
| payer | ストレージ料金を支払うアカウント |
| authority | アセットの所有者またはデリゲート |
| systemProgram | System Programアカウント |
| logWrapper | SPL Noop Program |

一部のアカウントは使いやすさのためにSDKで抽象化されている場合があります。
オンチェーン命令の詳細は[Github](https://github.com/metaplex-foundation/mpl-core/blob/5a45f7b891f2ca58ad1fc18e0ebdd0556ad59a4b/programs/mpl-core/src/instruction.rs#L123)で確認できます。
{% /totem-accordion %}
{% /totem %}

## コード例

SDKを使用してCore Assetをバーンする方法を示します。このスニペットは、あなたがアセットの所有者であることを前提としています。

{% code-tabs-imported from="core/burn-asset" frameworks="umi" /%}

## コレクションの一部であるアセットのバーン

コレクションの一部であるCore Assetをバーンする方法を示します。このスニペットは、あなたがアセットの所有者であることを前提としています。

{% dialect-switcher title="コレクションの一部であるアセットのバーン" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { burnV1, fetchAsset } from '@metaplex-foundation/mpl-core'

import { publicKey } from '@metaplex-foundation/umi'
import {
  burn,
  fetchAsset,
  collectionAddress,
  fetchCollection,
} from '@metaplex-foundation/mpl-core'

const assetId = publicKey('11111111111111111111111111111111')
const asset = await fetchAsset(umi, assetId)

const collectionId = collectionAddress(asset)

let collection = undefined

if (collectionId) {
  collection = await fetchCollection(umi, collection)
}

await burn(umi, {
  asset: asset,
  collection: collection,
}).sendAndConfirm(umi)
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::instructions::BurnV1Builder;
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn burn_asset_in_collection() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let collection = Pubkey::from_str("2222222222222222222222222222222").unwrap();

    let burn_asset_in_collection_ix = BurnV1Builder::new()
        .asset(asset)
        .collection(Some(collection))
        .payer(authority.pubkey())
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let burn_asset_in_collection_tx = Transaction::new_signed_with_payer(
        &[burn_asset_in_collection_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&burn_asset_in_collection_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}

## よくあるエラー

### `Authority mismatch`

アセットの所有者またはバーンデリゲートではありません。所有権を確認してください：

```ts
const asset = await fetchAsset(umi, assetAddress)
console.log(asset.owner) // 署名者と一致する必要があります
```

### `Asset is frozen`

アセットにフリーズデリゲートプラグインがあり、現在フリーズされています。バーンする前にフリーズ権限者がアンフリーズする必要があります。

### `Missing collection parameter`

コレクション内のアセットの場合、`collection`アドレスを渡す必要があります。最初にアセットをフェッチしてコレクションを取得してください：

```ts
const asset = await fetchAsset(umi, assetAddress)
const collectionId = collectionAddress(asset)
```

## 注意事項

- バーンは**永久かつ不可逆** - アセットは復元できません
- レントから約0.0028 SOLが返還されますが、約0.0009 SOLがアカウントに残ります
- 残りのSOLはアカウントアドレスの再利用を防ぎます
- バーンデリゲートは所有者に代わってバーンできます（バーンデリゲートプラグイン経由）
- フリーズされたアセットはバーン前にアンフリーズする必要があります

## クイックリファレンス

### バーンパラメータ

| パラメータ | 必須 | 説明 |
|-----------|----------|-------------|
| `asset` | はい | アセットアドレスまたはフェッチしたオブジェクト |
| `collection` | コレクション内の場合 | コレクションアドレス |
| `authority` | いいえ | デフォルトは署名者（デリゲート用） |

### バーンできる権限者

| 権限者 | バーン可能？ |
|-----------|-----------|
| アセット所有者 | はい |
| バーンデリゲート | はい |
| 転送デリゲート | いいえ |
| 更新権限者 | いいえ |

### レント回収

| 項目 | 金額 |
|------|--------|
| 支払者に返還 | 約0.0028 SOL |
| アカウントに残る | 約0.0009 SOL |
| **元のレント合計** | **約0.0029 SOL** |

## FAQ

### アカウントに残った約0.0009 SOLを回収できますか？

いいえ。この少額はアカウントを「バーン済み」としてマークし、新しいアセットにアドレスが再利用されることを防ぐために意図的に残されています。

### バーン後、アセットのメタデータはどうなりますか？

オンチェーンアカウントはクリア（ゼロ化）されます。オフチェーンメタデータ（Arweave/IPFS上）は元のURIでアクセス可能なままですが、それにリンクするオンチェーンレコードはありません。

### バーンデリゲートは所有者の承認なしにバーンできますか？

はい。所有者がプラグインを通じてバーンデリゲートを割り当てると、デリゲートはいつでもアセットをバーンできます。所有者は信頼できるアドレスのみをバーンデリゲートとして割り当てるべきです。

### バーンはコレクションのカウントに影響しますか？

はい。アセットがバーンされると、コレクションの`currentSize`がデクリメントされます。`numMinted`カウンターは変更されません（これは総ミント数を追跡します）。

### 複数のアセットを一度にバーンできますか？

単一の命令ではできません。1つのトランザクションで複数のバーン命令をバッチ処理できます（トランザクションサイズの制限まで）。

## 用語集

| 用語 | 定義 |
|------|------------|
| **バーン** | アセットを永久に破棄し、レントを回収する |
| **バーンデリゲート** | 所有者に代わってバーンする権限を持つアカウント |
| **レント** | Solanaでアカウントを維持するために預けるSOL |
| **フリーズ** | バーンと転送がブロックされるアセットの状態 |
| **コレクション** | アセットが属する可能性のあるグループアカウント |

---

*Metaplex Foundation管理 · 最終確認: 2026年1月 · @metaplex-foundation/mpl-core対応*
