---
title: Royalties Plugin
metaTitle: Royalties Plugin | Metaplex Core
description: Royalties PluginはCore AssetおよびCollectionにクリエイターロイヤリティを強制します。Basis Point、クリエイター分配、マーケットプレイスコンプライアンスのためのAllowlist/Denylistルールを設定できます。
updated: '01-31-2026'
keywords:
  - NFT royalties
  - creator royalties
  - royalties plugin
  - basis points
  - marketplace royalties
about:
  - Royalty enforcement
  - Creator payments
  - Marketplace rules
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
faqs:
  - q: Coreのロイヤリティは強制されますか？
    a: はい、Allowlist RuleSetを使用する場合に強制されます。Allowlistに含まれるプログラムのみがAssetを転送でき、ロイヤリティの支払いが保証されます。
  - q: CoreのロイヤリティとToken Metadataのロイヤリティの違いは何ですか？
    a: CoreのロイヤリティはAssetまたはCollectionレベルでRoyalties Pluginが必要で、RuleSetによるオプションの強制があります。標準のToken Metadata NFTロイヤリティは推奨事項であり、マーケットプレイスの協力に依存します。pNFT（プログラマブルNFT）もCoreと同様のRuleSetベースの強制をサポートしています。
  - q: Collection内のAssetごとに異なるロイヤリティを設定できますか？
    a: はい。個別のAssetにRoyalties Pluginを追加することで、Collectionレベルの設定を上書きできます。
  - q: マーケットプレイスはどのようにロイヤリティを読み取りますか？
    a: マーケットプレイスはDASまたはオンチェーンデータを通じてAssetのPluginを照会します。Royalties Pluginのデータには、Basis Point、クリエイター、RuleSetが含まれます。
  - q: RuleSetを設定しない場合はどうなりますか？
    a: ruleSet('None')を使用してください。任意のプログラムがAssetを転送でき、ロイヤリティは推奨事項のみとなります。
  - q: ミント後にロイヤリティを変更できますか？
    a: はい。Authorityがあれば、AssetにはupdatePluginを、CollectionにはupdateCollectionPluginを使用できます。
---
**Royalties Plugin**は、Core Assetの二次販売においてクリエイターロイヤリティを強制します。ロイヤリティの割合、クリエイター分配、およびどのプログラム（マーケットプレイス）がAssetの転送を許可または拒否されるかを指定します。 {% .lead %}
{% callout title="学習内容" %}
以下の方法を学びます：
- AssetとCollectionにロイヤリティを追加する
- Basis Pointとクリエイター分配を設定する
- マーケットプレイス制御のためのAllowlistとDenylistを設定する
- 作成後にロイヤリティを更新する
{% /callout %}
## 概要
**Royalties Plugin**は、Core Assetにロイヤリティを強制するAuthority管理のPluginです。割合（Basis Point）を設定し、複数のクリエイターに分配し、オプションでどのプログラムがAssetを転送できるかを制限できます。
- Basis Pointでロイヤリティを設定（500 = 5%）
- 最大5人のクリエイター間でロイヤリティを分配
- Allowlist/Denylistを使用してマーケットプレイスアクセスを制御
- Assetレベル（個別）またはCollectionレベル（全Asset）に適用
## 範囲外
Token Metadataロイヤリティ（異なるシステム）、ロイヤリティの収集/分配（マーケットプレイスが処理）、およびロイヤリティの法的強制。
## クイックスタート
**ジャンプ先:** [Assetに追加](#assetへのroyalties-pluginの追加コード例) · [Collectionに追加](#collectionへのroyalties-pluginの追加コード例) · [RuleSets](#rulesets) · [更新](#assetのroyalties-pluginの更新)
1. `@metaplex-foundation/mpl-core`から`addPlugin`をインポート
2. `type: 'Royalties'`、`basisPoints`、`creators`、`ruleSet`を指定して呼び出し
3. マーケットプレイスがPluginを読み取り、販売時にロイヤリティを強制
## 対応アカウントタイプ
| アカウントタイプ | サポート |
|--------------|-----------|
| MPL Core Asset | はい |
| MPL Core Collection | はい |
AssetとそのCollectionの両方に適用された場合、**Assetレベルのpluginが優先**されます。
## 引数
| 引数 | 型 | 説明 |
|----------|------|-------------|
| basisPoints | number | ロイヤリティの割合（500 = 5%、1000 = 10%） |
| creators | Creator[] | クリエイターのアドレスと割合のシェアの配列 |
| ruleSet | RuleSet | プログラムのAllowlist、Denylist、またはなし |
## Basis Points
ロイヤリティの割合を100分の1パーセントで表します。
| Basis Points | パーセンテージ |
|--------------|------------|
| 100 | 1% |
| 250 | 2.5% |
| 500 | 5% |
| 1000 | 10% |
例：`basisPoints`が500で、Assetが1 SOLで売却された場合、クリエイターは合計0.05 SOLを受け取ります。
## Creators
Creators配列は、誰がロイヤリティを受け取り、どのように分配されるかを定義します。最大5人のクリエイターがサポートされています。パーセンテージの合計は100である必要があります。
{% dialect-switcher title="Creators Array" %}
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
RuleSetsは、ロイヤリティ付きのAssetをどのプログラムが転送できるかを制御します。準拠したマーケットプレイスへの転送を制限することで、ロイヤリティを強制するために使用します。
### None（制限なし）
任意のプログラムがAssetを転送できます。ロイヤリティは推奨事項のみです。
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
### Allowlist（強制に推奨）
リストにあるプログラムのみが転送できます。ロイヤリティ準拠のマーケットプレイスに制限するために使用します。
{% dialect-switcher title="RuleSet Allowlist" %}
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
### Denylist
リストにあるプログラム以外のすべてのプログラムが転送できます。既知の非準拠マーケットプレイスをブロックするために使用します。
{% dialect-switcher title="RuleSet DenyList" %}
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
## AssetへのRoyalties Pluginの追加（コード例）
{% dialect-switcher title="Add Royalties Plugin to Asset" %}
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
## CollectionへのRoyalties Pluginの追加（コード例）
CollectionレベルのロイヤリティはCollection内のすべてのAssetに適用されますが、Assetレベルで上書きされない限りです。
{% dialect-switcher title="Add Royalties Plugin to Collection" %}
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
## AssetのRoyalties Pluginの更新
既存のAssetのロイヤリティ割合、クリエイター、またはRuleSetを変更します。
{% dialect-switcher title="Update Royalties Plugin on Asset" %}
{% dialect title="JavaScript" id="js" %}
```ts {% title="update-royalties-asset.ts" %}
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, ruleSet } from '@metaplex-foundation/mpl-core'
await updatePlugin(umi, {
  asset: assetAddress,
  plugin: {
    type: 'Royalties',
    basisPoints: 750, // Updated to 7.5%
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
## CollectionのRoyalties Pluginの更新
{% dialect-switcher title="Update Royalties Plugin on Collection" %}
{% dialect title="JavaScript" id="js" %}
```ts {% title="update-royalties-collection.ts" %}
import { publicKey } from '@metaplex-foundation/umi'
import { updateCollectionPlugin, ruleSet } from '@metaplex-foundation/mpl-core'
await updateCollectionPlugin(umi, {
  collection: collectionAddress,
  plugin: {
    type: 'Royalties',
    basisPoints: 600, // Updated to 6%
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
## よくあるエラー
### `Creator percentages must sum to 100`
クリエイターのパーセンテージ値が合計100になっていません。分配を調整してください。
### `Authority mismatch`
PluginのAuthorityのみがロイヤリティを更新できます。正しいキーペアで署名していることを確認してください。
### `Program not in allowlist`
呼び出しプログラムがAllowlistにないため、転送がブロックされました。プログラムを追加するか、Denylist/None RuleSetに切り替えてください。
## 注意事項
- AssetレベルのロイヤリティはCollectionレベルのロイヤリティを上書きします
- クリエイターのパーセンテージは正確に合計100である必要があります
- 厳格な強制にはAllowlistを、柔軟性にはDenylistを使用
- ロイヤリティの収集/分配はCoreプログラムではなく、マーケットプレイスが処理します
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
### Coreのロイヤリティは強制されますか？
はい、Allowlist RuleSetを使用する場合に強制されます。Allowlistに含まれるプログラムのみがAssetを転送でき、ロイヤリティの支払いが保証されます。
### CoreのロイヤリティとToken Metadataのロイヤリティの違いは何ですか？
CoreのロイヤリティはAssetまたはCollectionレベルでRoyalties Pluginが必要で、RuleSetによるオプションの強制があります。標準のToken Metadata NFTロイヤリティは推奨事項であり、マーケットプレイスの協力に依存します。pNFT（プログラマブルNFT）もCoreと同様のRuleSetベースの強制をサポートしています。
### Collection内のAssetごとに異なるロイヤリティを設定できますか？
はい。個別のAssetにRoyalties Pluginを追加することで、Collectionレベルの設定を上書きできます。
### マーケットプレイスはどのようにロイヤリティを読み取りますか？
マーケットプレイスはDASまたはオンチェーンデータを通じてAssetのPluginを照会します。Royalties Pluginのデータには、Basis Point、クリエイター、RuleSetが含まれます。
### RuleSetを設定しない場合はどうなりますか？
`ruleSet('None')`を使用してください。任意のプログラムがAssetを転送でき、ロイヤリティは推奨事項のみとなります。
### ミント後にロイヤリティを変更できますか？
はい。Authorityがあれば、`updatePlugin`（Asset用）または`updateCollectionPlugin`（Collection用）を使用できます。
## 用語集
| 用語 | 定義 |
|------|------------|
| **Basis Points** | ロイヤリティの割合を100分の1で表したもの（500 = 5%） |
| **Creators** | ロイヤリティの支払いを受け取るアドレスの配列 |
| **RuleSet** | どのプログラムが転送できるかを制御するAllowlist/Denylist |
| **Allowlist** | リストにあるプログラムのみが転送可能（厳格な強制） |
| **Denylist** | リストにあるプログラム以外のすべてが転送可能 |
| **Authority** | Pluginを更新する権限を持つアカウント |
