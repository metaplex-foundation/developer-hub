---
title: Royalties Plugin
metaTitle: Royalties Plugin | Metaplex Core
description: Royalties PluginはCore AssetとCollectionでクリエイターロイヤリティを強制します。ベーシスポイント、クリエイター分配、マーケットプレースコンプライアンスのための許可リスト/拒否リストルールを設定します。
---

**Royalties Plugin**は、Core Assetの二次販売でクリエイターロイヤリティを強制します。ロイヤリティの割合、クリエイター分配、およびAssetを転送できるプログラム（マーケットプレース）の許可または拒否を指定します。 {% .lead %}

{% callout title="学習内容" %}

以下の方法：
- AssetとCollectionにロイヤリティを追加
- ベーシスポイントとクリエイター分配を構成
- マーケットプレース制御のための許可リストと拒否リストを設定
- 作成後にロイヤリティを更新

{% /callout %}

## 概要

**Royalties Plugin**は、Core Assetでロイヤリティを強制する権限管理Pluginです。パーセンテージ（ベーシスポイント）を設定し、複数のクリエイターに分配し、オプションでAssetを転送できるプログラムを制限します。

- ベーシスポイントとしてロイヤリティを設定（500 = 5%）
- 最大5人のクリエイター間でロイヤリティを分配
- 許可リスト/拒否リストを使用してマーケットプレースアクセスを制御
- Assetレベル（個別）またはCollectionレベル（すべてのAsset）で適用

## 対象外

Token Metadataロイヤリティ（別システム）、ロイヤリティの収集/配分（マーケットプレースが処理）、ロイヤリティの法的強制は対象外です。

## クイックスタート

**ジャンプ：** [Assetに追加](#assetにroyalties-pluginを追加するコード例) · [Collectionに追加](#collectionにroyalties-pluginを追加するコード例) · [RuleSet](#rulesets) · [更新](#assetのroyalties-pluginを更新)

1. `@metaplex-foundation/mpl-core`から`addPlugin`をインポート
2. `type: 'Royalties'`、`basisPoints`、`creators`、`ruleSet`で呼び出す
3. マーケットプレースがPluginを読み取り、販売時にロイヤリティを強制

## 動作対象

| アカウントタイプ | サポート |
|--------------|-----------|
| MPL Core Asset | Yes |
| MPL Core Collection | Yes |

AssetとそのCollectionの両方に適用した場合、**AssetレベルのPluginが優先**されます。

## 引数

| 引数 | タイプ | 説明 |
|----------|------|-------------|
| basisPoints | number | ロイヤリティの割合（500 = 5%、1000 = 10%） |
| creators | Creator[] | クリエイターアドレスとそのパーセンテージシェアの配列 |
| ruleSet | RuleSet | プログラム許可リスト、拒否リスト、またはなし |

## Basis Points

ロイヤリティの割合（パーセントの100分の1単位）。

| Basis Points | パーセント |
|--------------|------------|
| 100 | 1% |
| 250 | 2.5% |
| 500 | 5% |
| 1000 | 10% |

例：`basisPoints`が500でAssetが1 SOLで販売された場合、クリエイターは合計0.05 SOLを受け取ります。

## Creators

creators配列は、誰がロイヤリティを受け取り、どのように分配されるかを定義します。最大5人のクリエイターがサポートされます。パーセンテージは合計100になる必要があります。

{% dialect-switcher title="Creators配列" %}
{% dialect title="JavaScript" id="js" %}

```ts {% title="creators-array.ts" %}
import { publicKey } from '@metaplex-foundation/umi'

const creators = [
  { address: publicKey('11111111111111111111111111111111'), percentage: 80 },
  { address: publicKey('22222222222222222222222222222222'), percentage: 20 },
]
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust {% title="creators_array.rs" %}
use mpl_core::types::Creator;
use solana_sdk::pubkey::Pubkey;
use std::str::FromStr;

let creators = vec![
    Creator {
        address: Pubkey::from_str("11111111111111111111111111111111").unwrap(),
        percentage: 80,
    },
    Creator {
        address: Pubkey::from_str("22222222222222222222222222222222").unwrap(),
        percentage: 20,
    },
];
```

{% /dialect %}
{% /dialect-switcher %}

## RuleSets

RuleSetsは、どのプログラムがロイヤリティ付きのAssetを転送できるかを制御します。準拠するマーケットプレースへの転送を制限することで、ロイヤリティを強制するために使用します。

### None（制限なし）

任意のプログラムがAssetを転送できます。ロイヤリティは推奨のみです。

{% dialect-switcher title="RuleSet None" %}
{% dialect title="JavaScript" id="js" %}

```ts {% title="ruleset-none.ts" %}
import { ruleSet } from '@metaplex-foundation/mpl-core'

const rules = ruleSet('None')
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust {% title="ruleset_none.rs" %}
use mpl_core::types::RuleSet;

let rule_set = RuleSet::None;
```

{% /dialect %}
{% /dialect-switcher %}

### 許可リスト（強制に推奨）

リストにあるプログラムのみが転送可能。ロイヤリティ準拠のマーケットプレースに制限するために使用。

{% dialect-switcher title="RuleSet許可リスト" %}
{% dialect title="JavaScript" id="js" %}

```ts {% title="ruleset-allowlist.ts" %}
import { publicKey } from '@metaplex-foundation/umi'
import { ruleSet } from '@metaplex-foundation/mpl-core'

const rules = ruleSet('ProgramAllowList', [
  [
    publicKey('M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K'), // Magic Eden
    publicKey('TSWAPaqyCSx2KABk68Shruf4rp7CxcNi8hAsbdwmHbN'), // Tensor
  ],
])
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust {% title="ruleset_allowlist.rs" %}
use mpl_core::types::RuleSet;
use solana_sdk::pubkey::Pubkey;
use std::str::FromStr;

let rule_set = RuleSet::ProgramAllowList(vec![
    Pubkey::from_str("M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K").unwrap(),
    Pubkey::from_str("TSWAPaqyCSx2KABk68Shruf4rp7CxcNi8hAsbdwmHbN").unwrap(),
]);
```

{% /dialect %}
{% /dialect-switcher %}

### 拒否リスト

リストにあるプログラムを除くすべてのプログラムが転送可能。既知の非準拠マーケットプレースをブロックするために使用。

{% dialect-switcher title="RuleSet拒否リスト" %}
{% dialect title="JavaScript" id="js" %}

```ts {% title="ruleset-denylist.ts" %}
import { publicKey } from '@metaplex-foundation/umi'
import { ruleSet } from '@metaplex-foundation/mpl-core'

const rules = ruleSet('ProgramDenyList', [
  [
    publicKey('BadMarketplace111111111111111111111111111'),
  ],
])
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust {% title="ruleset_denylist.rs" %}
use mpl_core::types::RuleSet;
use solana_sdk::pubkey::Pubkey;
use std::str::FromStr;

let rule_set = RuleSet::ProgramDenyList(vec![
    Pubkey::from_str("BadMarketplace111111111111111111111111111").unwrap(),
]);
```

{% /dialect %}
{% /dialect-switcher %}

## AssetにRoyalties Pluginを追加するコード例

{% dialect-switcher title="Assetにロイヤリティを追加" %}
{% dialect title="JavaScript" id="js" %}

```ts {% title="add-royalties-to-asset.ts" %}
import { publicKey } from '@metaplex-foundation/umi'
import { addPlugin, ruleSet } from '@metaplex-foundation/mpl-core'

const creator1 = publicKey('11111111111111111111111111111111')
const creator2 = publicKey('22222222222222222222222222222222')

await addPlugin(umi, {
  asset: assetAddress,
  plugin: {
    type: 'Royalties',
    basisPoints: 500, // 5%
    creators: [
      { address: creator1, percentage: 80 },
      { address: creator2, percentage: 20 },
    ],
    ruleSet: ruleSet('None'),
  },
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust {% title="add_royalties_to_asset.rs" %}
use mpl_core::{
    instructions::AddPluginV1Builder,
    types::{Creator, Plugin, Royalties, RuleSet},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn add_royalties_to_asset() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let asset = Pubkey::from_str("AssetAddress111111111111111111111111111").unwrap();
    let creator = Pubkey::from_str("CreatorAddress11111111111111111111111111").unwrap();

    let add_plugin_ix = AddPluginV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .plugin(Plugin::Royalties(Royalties {
            basis_points: 500,
            creators: vec![Creator {
                address: creator,
                percentage: 100,
            }],
            rule_set: RuleSet::None,
        }))
        .instruction();

    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let tx = Transaction::new_signed_with_payer(
        &[add_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client.send_and_confirm_transaction(&tx).await.unwrap();
    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}

## CollectionにRoyalties Pluginを追加するコード例

CollectionレベルのロイヤリティはAssetレベルでオーバーライドされない限り、Collection内のすべてのAssetに適用されます。

{% dialect-switcher title="Collectionにロイヤリティを追加" %}
{% dialect title="JavaScript" id="js" %}

```ts {% title="add-royalties-to-collection.ts" %}
import { publicKey } from '@metaplex-foundation/umi'
import { addCollectionPlugin, ruleSet } from '@metaplex-foundation/mpl-core'

const creator1 = publicKey('11111111111111111111111111111111')
const creator2 = publicKey('22222222222222222222222222222222')

await addCollectionPlugin(umi, {
  collection: collectionAddress,
  plugin: {
    type: 'Royalties',
    basisPoints: 500, // 5%
    creators: [
      { address: creator1, percentage: 80 },
      { address: creator2, percentage: 20 },
    ],
    ruleSet: ruleSet('None'),
  },
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust {% title="add_royalties_to_collection.rs" %}
use mpl_core::{
    instructions::AddCollectionPluginV1Builder,
    types::{Creator, Plugin, Royalties, RuleSet},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn add_royalties_to_collection() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let collection = Pubkey::from_str("CollectionAddress111111111111111111111").unwrap();

    let creator1 = Pubkey::from_str("Creator1Address111111111111111111111111").unwrap();
    let creator2 = Pubkey::from_str("Creator2Address111111111111111111111111").unwrap();

    let add_plugin_ix = AddCollectionPluginV1Builder::new()
        .collection(collection)
        .payer(authority.pubkey())
        .plugin(Plugin::Royalties(Royalties {
            basis_points: 500,
            creators: vec![
                Creator { address: creator1, percentage: 80 },
                Creator { address: creator2, percentage: 20 },
            ],
            rule_set: RuleSet::None,
        }))
        .instruction();

    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let tx = Transaction::new_signed_with_payer(
        &[add_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client.send_and_confirm_transaction(&tx).await.unwrap();
    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}

## AssetのRoyalties Pluginを更新

既存のAssetのロイヤリティパーセンテージ、クリエイター、またはルールセットを変更します。

{% dialect-switcher title="AssetのRoyalties Pluginを更新" %}
{% dialect title="JavaScript" id="js" %}

```ts {% title="update-royalties-asset.ts" %}
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, ruleSet } from '@metaplex-foundation/mpl-core'

await updatePlugin(umi, {
  asset: assetAddress,
  plugin: {
    type: 'Royalties',
    basisPoints: 750, // 7.5%に更新
    creators: [
      { address: creator1, percentage: 60 },
      { address: creator2, percentage: 40 },
    ],
    ruleSet: ruleSet('ProgramAllowList', [[marketplace1, marketplace2]]),
  },
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust {% title="update_royalties_asset.rs" %}
use mpl_core::{
    instructions::UpdatePluginV1Builder,
    types::{Creator, Plugin, Royalties, RuleSet},
};

let update_ix = UpdatePluginV1Builder::new()
    .asset(asset)
    .payer(authority.pubkey())
    .plugin(Plugin::Royalties(Royalties {
        basis_points: 750,
        creators: vec![
            Creator { address: creator1, percentage: 60 },
            Creator { address: creator2, percentage: 40 },
        ],
        rule_set: RuleSet::None,
    }))
    .instruction();
```

{% /dialect %}
{% /dialect-switcher %}

## CollectionのRoyalties Pluginを更新

{% dialect-switcher title="CollectionのRoyalties Pluginを更新" %}
{% dialect title="JavaScript" id="js" %}

```ts {% title="update-royalties-collection.ts" %}
import { publicKey } from '@metaplex-foundation/umi'
import { updateCollectionPlugin, ruleSet } from '@metaplex-foundation/mpl-core'

await updateCollectionPlugin(umi, {
  collection: collectionAddress,
  plugin: {
    type: 'Royalties',
    basisPoints: 600, // 6%に更新
    creators: [
      { address: creator1, percentage: 70 },
      { address: creator2, percentage: 30 },
    ],
    ruleSet: ruleSet('None'),
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## 一般的なエラー

### `Creator percentages must sum to 100`

クリエイターのパーセンテージ値が合計100になりません。分配を調整してください。

### `Authority mismatch`

Plugin権限のみがロイヤリティを更新できます。正しいキーペアで署名していることを確認してください。

### `Program not in allowlist`

呼び出しプログラムが許可リストにないため、転送がブロックされました。プログラムを追加するか、拒否リスト/noneルールセットに切り替えてください。

## 注意事項

- AssetレベルのロイヤリティはCollectionレベルのロイヤリティをオーバーライド
- クリエイターのパーセンテージは合計で正確に100になる必要がある
- 厳格な強制には許可リスト、柔軟性には拒否リストを使用
- ロイヤリティの収集/配分はマーケットプレースが処理し、Coreプログラムではない

## クイックリファレンス

### 最小コード

```ts {% title="minimal-royalties.ts" %}
import { addPlugin, ruleSet } from '@metaplex-foundation/mpl-core'

await addPlugin(umi, {
  asset: assetAddress,
  plugin: {
    type: 'Royalties',
    basisPoints: 500,
    creators: [{ address: creatorAddress, percentage: 100 }],
    ruleSet: ruleSet('None'),
  },
}).sendAndConfirm(umi)
```

### Basis Pointsリファレンス

| 希望% | Basis Points |
|-----------|--------------|
| 2.5% | 250 |
| 5% | 500 |
| 7.5% | 750 |
| 10% | 1000 |

## FAQ

### Coreロイヤリティは強制されますか？

はい、許可リストルールセットを使用する場合。許可リストにあるプログラムのみがAssetを転送でき、ロイヤリティが支払われることを保証します。

### CoreロイヤリティとToken Metadataロイヤリティの違いは何ですか？

Coreロイヤリティはルールセットによるオプションの強制機能がAssetに組み込まれています。Token Metadataロイヤリティは推奨であり、マーケットプレースの協力に依存します。

### Collection内のAssetごとに異なるロイヤリティを設定できますか？

はい。個々のAssetにRoyalties Pluginを追加してCollectionレベルの設定をオーバーライドできます。

### マーケットプレースはどのようにロイヤリティを読み取りますか？

マーケットプレースはDASまたはオンチェーンデータを通じてAssetのPluginをクエリします。Royalties Pluginデータにはベーシスポイント、クリエイター、ルールセットが含まれます。

### ルールセットを設定しないとどうなりますか？

`ruleSet('None')`を使用します。任意のプログラムがAssetを転送でき、ロイヤリティは推奨のみです。

### ミント後にロイヤリティを変更できますか？

はい。権限がある場合、`updatePlugin`（Assetの場合）または`updateCollectionPlugin`（Collectionの場合）を使用します。

## 用語集

| 用語 | 定義 |
|------|------------|
| **Basis Points** | ロイヤリティパーセンテージの100分の1単位（500 = 5%） |
| **Creators** | ロイヤリティ支払いを受け取るアドレスの配列 |
| **RuleSet** | どのプログラムが転送できるかを制御する許可リスト/拒否リスト |
| **許可リスト** | リストにあるプログラムのみが転送可能（厳格な強制） |
| **拒否リスト** | リストにあるプログラム以外のすべてのプログラムが転送可能 |
| **権限** | Pluginを更新する権限を持つアカウント |

---

*Metaplex Foundationによって管理 · 最終確認2026年1月 · @metaplex-foundation/mpl-coreに適用*
