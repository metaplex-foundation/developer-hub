---
title: Permanent Burn Delegate
metaTitle: Permanent Burn Delegate | Metaplex Core
description: フリーズされていてもAssetを破棄できる永久バーン権限を付与します。ゲームメカニクス、サブスクリプション期限切れ、自動アセットライフサイクルに使用します。
---

**Permanent Burn Delegate Plugin**は、永続する取り消し不能なバーン権限を提供します。委任者はAssetがフリーズされていてもバーンできるため、ゲームやサブスクリプションサービスに最適です。 {% .lead %}

{% callout title="学習内容" %}

- 永久バーン機能を持つAssetを作成する
- コレクション全体のバーン権限を有効にする
- フリーズされたAssetをバーン（forceApprove動作）
- ユースケース：ゲーム、サブスクリプション、自動クリーンアップ

{% /callout %}

## 概要

**Permanent Burn Delegate**は、作成時にのみ追加できる永久プラグインです。委任者はAssetがフリーズされていてもいつでもバーンできます。

- Asset/Collection作成時にのみ追加可能
- 権限は永続（取り消されない）
- `forceApprove`を使用 - フリーズされていてもバーン可能
- コレクションレベル: Collection内の任意のAssetをバーン可能

## 対象外

通常のburn delegate（[Burn Delegate](/ja/smart-contracts/core/plugins/burn-delegate)を参照）、条件付きバーン、Token Metadataバーン権限。

## クイックスタート

**ジャンプ先:** [Asset作成](#permanent-burnプラグイン付きでassetを作成)

1. Asset/Collection作成時に`PermanentBurnDelegate`プラグインを追加
2. 権限をプログラムまたは委任者アドレスに設定
3. 委任者はフリーズされていてもいつでもAssetをバーン可能

{% callout type="note" title="Permanent vs 通常のBurn Delegate" %}

| 機能 | Burn Delegate | Permanent Burn Delegate |
|---------|---------------|-------------------------|
| 作成後に追加 | ✅ 可能 | ❌ 作成時のみ |
| 転送後も権限維持 | ❌ 取り消される | ✅ 永続 |
| フリーズされたAssetをバーン | ❌ 不可 | ✅ 可能（forceApprove） |
| Collectionで機能 | ❌ 不可 | ✅ 可能 |
| 緊急破棄 | ❌ 制限あり | ✅ 最適 |

**[Burn Delegate](/ja/smart-contracts/core/plugins/burn-delegate)を選択** - ユーザーが取り消し可能なバーン権限の場合。
**Permanent Burn Delegateを選択** - ゲーム、緊急破棄、自動クリーンアップの場合。

{% /callout %}

## 一般的なユースケース

- **ゲームメカニクス**: アイテムが消費、紛失、またはゲーム内で破壊された時にAssetを破棄
- **サブスクリプション期限切れ**: フリーズされていても期限切れのサブスクリプショントークンを自動バーン
- **緊急破棄**: 状態に関係なく、侵害されたまたは不要なAssetを削除
- **クラフトシステム**: クラフト時に材料NFTをバーン（ロックされていても）
- **期間限定アセット**: 期限切れコンテンツを自動破棄
- **コンプライアンス**: 所有者がフリーズしようとしても規約違反のAssetを削除

## 動作対象

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

### 動作
- **Asset**: 委任されたアドレスを使用してAssetをバーン可能。
- **Collection**: コレクション権限を使用してCollection内の任意のAssetをバーン可能。一度にすべてをバーンするわけではありません。

## 引数

Permanent Burnプラグインには渡す引数は含まれていません。

## Permanent Burnプラグイン付きでAssetを作成

{% dialect-switcher title="Permanent Freezeプラグイン付きでAssetを作成" %}
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
      type: 'PermanentBurnDelegate',
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
use solana_sdk::{signature::Keypair, signer::Signer, transaction::Transaction};

pub async fn create_asset_with_permanent_burn_delegate_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let payer = Keypair::new();
    let asset = Keypair::new();

    let create_asset_with_permanent_burn_delegate_plugin_ix = CreateV1Builder::new()
        .asset(asset.pubkey())
        .payer(payer.pubkey())
        .name("My Nft".into())
        .uri("https://example.com/my-nft.json".into())
        .plugins(vec![PluginAuthorityPair {
            plugin: Plugin::PermanentBurnDelegate(PermanentBurnDelegate {}),
            authority: Some(PluginAuthority::None),
        }])
        .instruction();

    let signers = vec![&asset, &payer];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let create_asset_with_permanent_burn_delegate_plugin_tx = Transaction::new_signed_with_payer(
        &[create_asset_with_permanent_burn_delegate_plugin_ix],
        Some(&payer.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&create_asset_with_permanent_burn_delegate_plugin_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect %}

{% /dialect-switcher %}

## 一般的なエラー

### `Cannot add permanent plugin after creation`

永久プラグインはAsset/Collection作成時にのみ追加できます。既存のAssetにPermanent Burn Delegateを追加することはできません。

### `Authority mismatch`

プラグイン権限のみがバーンできます。正しいキーペアで署名しているか確認してください。

## 注意事項

- **作成時のみ**: Asset/Collectionが存在した後は追加できない
- **Force approve**: フリーズされていてもバーン可能
- **Collection動作**: Collection内の任意のAssetを個別にバーン可能
- **永続**: 権限は取り消されない
- **不可逆**: バーンされたAssetは回復できない

## FAQ

### Burn DelegateとPermanent Burn Delegateの違いは？

通常のBurn Delegateはフリーズされたassetをバーンできず、転送時に取り消されます。Permanent Burn Delegateはフリーズされたassetをバーン可能（forceApprove）で、永続します。

### Permanent Burn Delegateはフリーズされたassetをバーンできますか？

はい。永久プラグインは`forceApprove`を使用し、フリーズ拒否をオーバーライドします。アイテムが破壊可能でなければならないゲームメカニクスに有用です。

### 既存のAssetに追加できますか？

いいえ。永久プラグインはAsset作成時にのみ追加できます。既存のAssetには通常のBurn Delegateを使用してください。

### コレクションレベルのPermanent Burn Delegateの動作は？

委任者はCollection内の任意の個別Assetをバーンできますが、一度にすべてではありません。各バーンは別々のトランザクションです。

### これは安全に使用できますか？

注意して使用してください。委任者は所有者の承認なしにいつでもAssetをバーンできます。信頼できるプログラムまたはアドレスにのみ割り当ててください。

## 関連プラグイン

- [Burn Delegate](/ja/smart-contracts/core/plugins/burn-delegate) - 取り消し可能なバーン権限
- [Permanent Freeze Delegate](/ja/smart-contracts/core/plugins/permanent-freeze-delegate) - 永久freeze権限
- [Permanent Transfer Delegate](/ja/smart-contracts/core/plugins/permanent-transfer-delegate) - 永久転送権限

## 用語集

| 用語 | 定義 |
|------|------------|
| **永久プラグイン** | 作成時にのみ追加でき、永続するプラグイン |
| **forceApprove** | 他のプラグイン拒否をオーバーライドする検証 |
| **Collectionバーン** | Collection内の任意のAssetをバーンする機能 |

---

*Metaplex Foundation管理 · 最終確認 2026年1月 · @metaplex-foundation/mpl-coreに適用*
