---
title: Burn Delegate
metaTitle: Burn Delegate Plugin | Metaplex Core
description: 委任者がCore NFT Assetをバーンできるようにします。Burn Delegateプラグインは、ゲームメカニクス、サブスクリプション期限切れ、自動アセット破棄に使用できます。
---

**Burn Delegate Plugin**は、指定された権限が所有者に代わってCore Assetをバーンできるようにします。ゲームメカニクス、サブスクリプションサービス、自動アセットライフサイクル管理に有用です。 {% .lead %}

{% callout title="学習内容" %}

- AssetにBurn Delegateプラグインを追加する
- バーン権限を別のアドレスに委任する
- バーン権限を取り消す
- ユースケース：ゲーム、サブスクリプション、自動バーン

{% /callout %}

## 概要

**Burn Delegate**は、委任者がAssetをバーンできるようにする所有者管理プラグインです。追加されると、委任者は所有者の承認なしにいつでもAssetをバーンできます。

- プログラムまたはウォレットにバーン権限を委任
- Asset転送時に権限が取り消される
- 取り消し不能なバーン権限には[Permanent Burn Delegate](/ja/smart-contracts/core/plugins/permanent-burn-delegate)を使用
- 追加の引数は不要

## 対象外

Collectionバーン（別プロセス）、永久バーン権限（Permanent Burn Delegateを参照）、Token Metadataバーン権限（別システム）。

## クイックスタート

**ジャンプ先:** [プラグイン追加](#assetにburnプラグインを追加) · [権限委任](#バーン権限の委任) · [取り消し](#バーン権限の取り消し)

1. Burn Delegateプラグインを追加: `addPlugin(umi, { asset, plugin: { type: 'BurnDelegate' } })`
2. オプションで別のアドレスに委任
3. 委任者はいつでもAssetをバーンできるようになります

{% callout type="note" title="Burn vs Permanent Burn Delegateの使い分け" %}

| ユースケース | Burn Delegate | Permanent Burn Delegate |
|----------|---------------|-------------------------|
| ゲームアイテム破壊 | ✅ 最適 | ✅ 使用可能 |
| サブスクリプション期限切れ | ✅ 最適 | ❌ 永続的すぎる |
| フリーズされたAssetのバーン | ❌ バーン不可 | ✅ 強制バーン可能 |
| 転送後の権限維持 | ❌ 取り消される | ✅ 維持される |
| 緊急バーン機能 | ❌ 制限あり | ✅ 最適 |

**Burn Delegateを選択** - 所有権変更時にバーン権限をリセットすべき場合。
**[Permanent Burn Delegate](/ja/smart-contracts/core/plugins/permanent-burn-delegate)を選択** - 権限が永続する必要がある場合。

{% /callout %}

## 一般的なユースケース

- **ゲームメカニクス**: アイテムが消費、破壊、またはゲーム内で失われた時にNFTをバーン
- **サブスクリプションサービス**: 期限切れのサブスクリプショントークンを自動バーン
- **クラフトシステム**: 新しいアイテムをクラフトする時に材料NFTをバーン
- **実績引き換え**: 報酬と引き換えた時に実績トークンをバーン
- **イベントチケット**: イベントチェックイン後にチケットをバーン
- **期間限定アセット**: 有効期限後にアセットをバーン

## 動作対象

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ❌  |

## 引数

Burnプラグインには渡す引数は含まれていません。

## AssetにBurnプラグインを追加

{% dialect-switcher title="MPL Core AssetにBurnプラグインを追加" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { addPlugin } from '@metaplex-foundation/mpl-core'

(async () => {
    const asset = publicKey('11111111111111111111111111111111')

    await addPlugin(umi, {
    asset: asset,
    plugin: { type: 'BurnDelegate' },
    }).sendAndConfirm(umi)
})();
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```ts
use mpl_core::{
    instructions::AddPluginV1Builder,
    types::{BurnDelegate, Plugin},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn add_burn_delegate_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let add_burn_delegate_plugin_ix = AddPluginV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .plugin(Plugin::BurnDelegate(BurnDelegate {}))
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let add_burn_delegate_plugin_ix_tx = Transaction::new_signed_with_payer(
        &[add_burn_delegate_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&add_burn_delegate_plugin_ix_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}

## バーン権限の委任

Burn Delegateプラグイン権限は`approvePluginAuthority`関数を使用して別のアドレスに委任できます。これにより、誰がAssetをバーンできるかを変更できます。

{% dialect-switcher title="バーン権限の委任" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { approvePluginAuthority } from '@metaplex-foundation/mpl-core'

(async () => {
    const assetAddress = publicKey('11111111111111111111111111111111')
    const newDelegate = publicKey('22222222222222222222222222222222')

    await approvePluginAuthority(umi, {
    asset: assetAddress,
    plugin: { type: 'BurnDelegate' },
    newAuthority: { type: 'Address', address: newDelegate },
    }).sendAndConfirm(umi)
})();
```

{% /dialect %}

{% /dialect-switcher %}

## バーン権限の取り消し

バーン権限は`revokePluginAuthority`関数を使用して取り消し、アセット所有者に制御を戻すことができます。

{% dialect-switcher title="バーン権限の取り消し" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { revokePluginAuthority } from '@metaplex-foundation/mpl-core'

(async () => {
    const assetAddress = publicKey('11111111111111111111111111111111')

    await revokePluginAuthority(umi, {
    asset: assetAddress,
    plugin: { type: 'BurnDelegate' },
    }).sendAndConfirm(umi)
})();
```

{% /dialect %}
{% /dialect-switcher %}

## 一般的なエラー

### `Authority mismatch`

burn delegate権限のみがAssetをバーンできます。正しいキーペアで署名しているか確認してください。

### `Asset is frozen`

フリーズされたAssetはバーンできません。freeze権限が先にAssetを解凍する必要があります。

## 注意事項

- 所有者管理: 追加には所有者の署名が必要
- Asset転送時に権限は自動的に取り消されます
- フリーズされたAssetはバーンできません
- 転送後も権限が維持される必要がある場合はPermanent Burn Delegateを使用
- バーンは即時かつ不可逆

## クイックリファレンス

### 誰がバーンできる？

| 権限 | バーン可能？ |
|-----------|-----------|
| Asset所有者 | はい（常に） |
| Burn Delegate | はい |
| Permanent Burn Delegate | はい（force approve） |
| Update Authority | いいえ |

## FAQ

### Burn DelegateとPermanent Burn Delegateの違いは？

Burn Delegate権限は転送時に取り消されます。Permanent Burn Delegate権限は永続し、`forceApprove`を使用するため、Assetがフリーズされていてもバーンできます。

### Burn Delegateがいても所有者はバーンできますか？

はい。所有者は委任者に関係なく常に自分のAssetをバーンできます。

### Burn Delegateはフリーズされたassetで機能しますか？

いいえ。通常のBurn Delegateはフリーズされたassetをバーンできません。フリーズされたAssetをバーンする必要がある場合はPermanent Burn Delegateを使用してください。

### Burn Delegateはいつ取り消されますか？

Assetが新しい所有者に転送された時。新しい所有者は新しいBurn Delegateを追加する必要があります。

## 関連プラグイン

- [Permanent Burn Delegate](/ja/smart-contracts/core/plugins/permanent-burn-delegate) - forceApproveによる取り消し不能なバーン権限
- [Freeze Delegate](/ja/smart-contracts/core/plugins/freeze-delegate) - 一時的に転送とバーンをブロック
- [Transfer Delegate](/ja/smart-contracts/core/plugins/transfer-delegate) - 委任者によるAsset転送を許可

## 用語集

| 用語 | 定義 |
|------|------------|
| **Burn Delegate** | 委任者がAssetをバーンできるようにする所有者管理プラグイン |
| **所有者管理** | 追加に所有者の署名が必要なプラグインタイプ |
| **取り消し** | 委任者のバーン権限を削除すること |
| **Permanent Burn Delegate** | 転送後も維持される取り消し不能バージョン |
| **forceApprove** | フリーズ制限をオーバーライドする永久プラグインの機能 |

---

*Metaplex Foundation管理 · 最終確認 2026年1月 · @metaplex-foundation/mpl-coreに適用*
