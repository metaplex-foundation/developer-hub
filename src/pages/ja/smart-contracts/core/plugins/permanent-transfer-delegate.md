---
title: Permanent Transfer Delegate
metaTitle: Permanent Transfer Delegate | Metaplex Core
description: 所有権変更後も持続する永久転送権限を付与します。ゲームメカニクス、サブスクリプションサービス、自動アセット管理に使用します。
---

**Permanent Transfer Delegate Plugin**は、永続する取り消し不能な転送権限を提供します。通常のTransfer Delegateとは異なり、この権限は取り消されることがなく、Assetを繰り返し転送できます。 {% .lead %}

{% callout title="学習内容" %}

- 永久転送機能を持つAssetを作成する
- コレクション全体の転送権限を有効にする
- ユースケース：ゲーム、サブスクリプション、自動システム
- permanent vs 通常のtransfer delegateの違いを理解する

{% /callout %}

## 概要

**Permanent Transfer Delegate**は、作成時にのみ追加できる永久プラグインです。委任者は所有者の承認なしに無制限にAssetを転送できます。

- Asset/Collection作成時にのみ追加可能
- 権限は永続（取り消されない）
- `forceApprove`を使用 - フリーズされていても転送可能
- コレクションレベル: Collection内の任意のAssetを転送可能

## 対象外

通常のtransfer delegate（[Transfer Delegate](/ja/smart-contracts/core/plugins/transfer-delegate)を参照）、エスクローレスリスティング（通常の委任者を使用）、Token Metadata転送権限。

## クイックスタート

**ジャンプ先:** [Asset作成](#permanent-transferプラグイン付きでmpl-core-assetを作成)

1. Asset/Collection作成時に`PermanentTransferDelegate`プラグインを追加
2. 権限をプログラムまたは委任者アドレスに設定
3. 委任者はいつでも無制限にAssetを転送可能

{% callout type="note" title="Permanent vs 通常のTransfer Delegate" %}

| 機能 | Transfer Delegate | Permanent Transfer Delegate |
|---------|-------------------|----------------------------|
| 作成後に追加 | ✅ 可能 | ❌ 作成時のみ |
| 転送後も権限維持 | ❌ 1回の転送後に取り消し | ✅ 永続 |
| 複数回転送 | ❌ 一回限り | ✅ 無制限 |
| フリーズされたAssetを転送 | ❌ 不可 | ✅ 可能（forceApprove） |
| Collectionで機能 | ❌ 不可 | ✅ 可能 |

**[Transfer Delegate](/ja/smart-contracts/core/plugins/transfer-delegate)を選択** - 一回限りのエスクローレス販売の場合。
**Permanent Transfer Delegateを選択** - ゲーム、レンタル、繰り返し転送が必要な自動システムの場合。

{% /callout %}

## 一般的なユースケース

- **ゲームメカニクス**: ゲームイベント発生時にAssetを転送（バトル敗北、トレーディング）
- **レンタル返却**: レンタルNFTを自動的にオーナーに返却
- **サブスクリプション管理**: サブスクリプション終了または更新時にトークンを転送
- **DAOトレジャリー管理**: DAOがAsset配布を管理できるようにする
- **自動システム**: 転送ごとの承認なしにAssetを移動する必要があるプログラム

## 動作対象

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

### 動作
- **Asset**: 委任されたアドレスを使用してAssetを転送可能。
- **Collection**: コレクション権限を使用してCollection内の任意のAssetを転送可能。一度にすべてを転送するわけではありません。

## 引数

| 引数   | 値    |
| ------ | ----- |
| frozen | bool  |

## Permanent Transferプラグイン付きでMPL Core Assetを作成

{% dialect-switcher title="Permanent Transferプラグイン付きでMPL Core Assetを作成" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { create } from '@metaplex-foundation/mpl-core'

const assetSigner = generateSigner(umi)
const delegate = publicKey('33333333333333333333333333333')

await create(umi, {
  asset: assetSigner,
  name: 'My Asset',
  uri: 'https://example.com/my-asset.json',
  plugins: [
    {
      type: 'PermanentTransferDelegate',
      authority: { type: 'Address', address: delegate },
    },
  ],
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{
    instructions::CreateV1Builder,
    types::{PermanentBurnDelegate, Plugin, PluginAuthority, PluginAuthorityPair},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn create_asset_with_permanent_burn_delegate_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let payer = Keypair::new();
    let asset = Keypair::new();

    let delegate = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let create_asset_with_burn_transfer_delegate_plugin_ix = CreateV1Builder::new()
        .asset(asset.pubkey())
        .payer(payer.pubkey())
        .name("My Nft".into())
        .uri("https://example.com/my-nft.json".into())
        .plugins(vec![PluginAuthorityPair {
            plugin: Plugin::PermanentBurnDelegate(PermanentBurnDelegate {}),
            authority: Some(PluginAuthority::Address { address: delegate }),
        }])
        .instruction();

    let signers = vec![&asset, &payer];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let create_asset_with_burn_transfer_delegate_plugin_tx = Transaction::new_signed_with_payer(
        &[create_asset_with_burn_transfer_delegate_plugin_ix],
        Some(&payer.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&create_asset_with_burn_transfer_delegate_plugin_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}

## 一般的なエラー

### `Cannot add permanent plugin after creation`

永久プラグインはAsset/Collection作成時にのみ追加できます。既存のAssetにPermanent Transfer Delegateを追加することはできません。

### `Authority mismatch`

プラグイン権限のみが転送できます。正しいキーペアで署名しているか確認してください。

## 注意事項

- **作成時のみ**: Asset/Collectionが存在した後は追加できない
- **Force approve**: フリーズされていても転送可能
- **Collection動作**: Collection内の任意のAssetを個別に転送可能
- **永続**: 権限は取り消されない
- **無制限転送**: 委任者が転送できる回数に制限なし

## FAQ

### Transfer DelegateとPermanent Transfer Delegateの違いは？

通常のTransfer Delegateは一回の転送後に取り消されます。Permanent Transfer Delegateは永続し、無制限に転送できます。

### Permanent Transfer Delegateはフリーズされたassetを転送できますか？

はい。永久プラグインは`forceApprove`を使用し、フリーズ拒否をオーバーライドします。

### 既存のAssetに追加できますか？

いいえ。永久プラグインはAsset作成時にのみ追加できます。既存のAssetには通常のTransfer Delegateを使用してください。

### コレクションレベルのPermanent Transfer Delegateの動作は？

委任者はCollection内の任意の個別Assetを転送できますが、一度にすべてではありません。各転送は別々のトランザクションです。

## 関連プラグイン

- [Transfer Delegate](/ja/smart-contracts/core/plugins/transfer-delegate) - 一回限りの転送権限
- [Permanent Freeze Delegate](/ja/smart-contracts/core/plugins/permanent-freeze-delegate) - 永久freeze権限
- [Permanent Burn Delegate](/ja/smart-contracts/core/plugins/permanent-burn-delegate) - 永久バーン権限

## 用語集

| 用語 | 定義 |
|------|------------|
| **永久プラグイン** | 作成時にのみ追加でき、永続するプラグイン |
| **forceApprove** | 他のプラグイン拒否をオーバーライドする検証 |
| **Collection転送** | Collection内の任意のAssetを転送する機能 |

---

*Metaplex Foundation管理 · 最終確認 2026年1月 · @metaplex-foundation/mpl-coreに適用*
