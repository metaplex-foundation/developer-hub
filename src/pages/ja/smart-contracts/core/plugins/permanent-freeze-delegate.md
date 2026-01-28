---
title: Permanent Freeze Delegate
metaTitle: Permanent Freeze Delegate | Metaplex Core
description: Permanent Freeze Delegateプラグインでソウルバウンドnftを作成し、Collection全体をフリーズします。永続する取り消し不能なfreeze権限。
---

**Permanent Freeze Delegate Plugin**は、転送後も持続する取り消し不能なfreeze権限を提供します。ソウルバウンドトークン、コレクション全体のフリーズ、永久ロックメカニズムに使用します。 {% .lead %}

{% callout title="学習内容" %}

- 永久フリーズ機能を持つAssetを作成する
- Collection全体を一度にフリーズする
- ソウルバウンド（譲渡不可）トークンを実装する
- permanent vs 通常のfreeze delegateの違いを理解する

{% /callout %}

## 概要

**Permanent Freeze Delegate**は、作成時にのみ追加できる永久プラグインです。通常のFreeze Delegateとは異なり、この権限は永続し、転送後でもフリーズ/解凍が可能です。

- Asset/Collection作成時にのみ追加可能
- 権限は転送後も持続（取り消されない）
- `forceApprove`を使用 - 他のブロックプラグインがあってもフリーズ可能
- コレクションレベルのフリーズはCollection内のすべてのAssetに影響

## 対象外

通常のfreeze delegate（[Freeze Delegate](/ja/smart-contracts/core/plugins/freeze-delegate)を参照）、一時的なフリーズ、Token Metadata freeze権限。

## クイックスタート

**ジャンプ先:** [Asset作成](#permanent-freezeプラグイン付きでassetを作成) · [Collection作成](#permanent-freezeプラグイン付きでcollectionを作成) · [更新（解凍）](#assetのpermanent-freeze-delegateプラグインを更新)

1. Asset/Collection作成時に`PermanentFreezeDelegate`プラグインを追加
2. 即時フリーズには`frozen: true`、後でフリーズするには`false`を設定
3. 委任者は転送後でもいつでもフリーズ/解凍可能

{% callout type="note" title="Permanent vs 通常のFreeze Delegate" %}

| 機能 | Freeze Delegate | Permanent Freeze Delegate |
|---------|-----------------|---------------------------|
| 作成後に追加 | ✅ 可能 | ❌ 作成時のみ |
| 転送後も権限維持 | ❌ 取り消される | ✅ 維持される |
| Collectionで機能 | ❌ 不可 | ✅ 可能 |
| forceApprove | ❌ なし | ✅ あり |
| ソウルバウンドトークン | ❌ 制限あり | ✅ 最適 |

**[Freeze Delegate](/ja/smart-contracts/core/plugins/freeze-delegate)を選択** - 一時的で取り消し可能なフリーズの場合。
**Permanent Freeze Delegateを選択** - 永久的な権限またはコレクション全体のフリーズの場合。

{% /callout %}

## 一般的なユースケース

- **ソウルバウンドトークン**: 譲渡不可の資格証明、実績、メンバーシップを作成
- **コレクション全体のフリーズ**: 1つのプラグインでCollection内のすべてのAssetをフリーズ
- **永久担保**: 所有権変更後も維持される担保としてAssetをロック
- **ゲームアイテムの永続性**: 取引に関係なくロックされたままのアイテム
- **コンプライアンス要件**: 規制上の理由でフリーズされたままにする必要があるAsset

## 動作対象

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

### 動作
- **Asset**: 委任されたアドレスがいつでもNFTをフリーズおよび解凍可能。
- **Collection**: コレクション権限がコレクション全体を一度にフリーズおよび解凍可能。この委任者を使用してコレクション内の単一assetをフリーズすることは**できません**。

## 引数

| 引数   | 値    |
| ------ | ----- |
| frozen | bool  |

## Permanent Freezeプラグイン付きでAssetを作成
以下の例は、Permanent Freezeプラグイン付きでAssetを作成する方法を示しています。

{% dialect-switcher title="Permanent Freezeプラグイン付きでAssetを作成" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { create } from '@metaplex-foundation/mpl-core'

const assetSigner = generateSigner(umi)
const delegate = publicKey('33333333333333333333333333333')

await create(umi, {
  asset: assetSigner,
  name: 'My NFT',
  uri: 'https://example.com/my-asset.json',
  plugins: [
    {
      type: 'PermanentFreezeDelegate',
      frozen: true,
      authority: { type: 'Address', address: delegate },
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
    types::{PermanentFreezeDelegate, Plugin, PluginAuthority, PluginAuthorityPair},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};

pub async fn create_asset_with_permanent_freeze_delegate_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let payer = Keypair::new();
    let asset = Keypair::new();

    let delegate = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let create_asset_with_permanent_freeze_delegate_plugin_ix = CreateV1Builder::new()
        .asset(asset.pubkey())
        .payer(payer.pubkey())
        .name("My Nft".into())
        .uri("https://example.com/my-nft.json".into())
        .plugins(vec![PluginAuthorityPair {
            plugin: Plugin::PermanentFreezeDelegate(PermanentFreezeDelegate { frozen: true }),
            authority: Some(PluginAuthority::Address { address: delegate }),
        }])
        .instruction();

    let signers = vec![&asset, &payer];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let create_asset_with_permanent_freeze_delegate_plugin_tx = Transaction::new_signed_with_payer(
        &[create_asset_with_permanent_freeze_delegate_plugin_ix],
        Some(&payer.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&create_asset_with_permanent_freeze_delegate_plugin_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect %}

{% /dialect-switcher %}

## AssetのPermanent Freeze Delegateプラグインを更新
以下の例は、AssetのPermanent Freeze Delegateプラグインを更新する方法を示しています。`frozen`引数をそれぞれ`true`または`false`に設定してフリーズまたは解凍します。署名ウォレットがプラグイン権限であることを前提としています。

{% dialect-switcher title="AssetのPermanent Freeze Delegateプラグインを更新" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { updatePlugin } from '@metaplex-foundation/mpl-core'

const updateAssetResponse = await updatePlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: "PermanentFreezeDelegate",
    frozen: false,
  },
}).sendAndConfirm(umi);
```

{% /dialect %}
{% /dialect-switcher %}



## Permanent Freezeプラグイン付きでCollectionを作成
以下の例は、Permanent Freezeプラグイン付きでコレクションを作成する方法を示しています。

{% dialect-switcher title="Permanent Freezeプラグイン付きでCollectionを作成" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { generateSigner } from '@metaplex-foundation/umi'
import { createCollection } from '@metaplex-foundation/mpl-core'

const collectionSigner = generateSigner(umi)
await createCollection(umi, {
  collection: collectionSigner,
  name: "Frozen Collection",
  uri: "https://example.com/my-collection.json",
  plugins: [
      {
        type: 'PermanentFreezeDelegate',
        frozen: true,
        authority: { type: "UpdateAuthority"}, // update権限が解凍可能
      },
    ],
  }).sendAndConfirm(umi);
```

{% /dialect %}
{% /dialect-switcher %}

## Permanent Freezeプラグイン付きCollectionを更新
以下の例は、CollectionのPermanent Freeze Delegateプラグインを更新する方法を示しています。`frozen`引数をそれぞれ`true`または`false`に設定してフリーズまたは解凍します。署名ウォレットがプラグイン権限であることを前提としています。

{% dialect-switcher title="Permanent Freezeプラグイン付きCollectionを更新" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { updateCollectionPlugin } from '@metaplex-foundation/mpl-core'

const updateCollectionResponse =  await updateCollectionPlugin(umi, {
  collection: collectionSigner.publicKey,
  plugin: {
      type: "PermanentFreezeDelegate",
      frozen: false,
    },
  }).sendAndConfirm(umi);
```

{% /dialect %}
{% /dialect-switcher %}

## 一般的なエラー

### `Cannot add permanent plugin after creation`

永久プラグインはAsset/Collection作成時にのみ追加できます。既存のAssetにPermanent Freeze Delegateを追加することはできません。

### `Authority mismatch`

プラグイン権限のみがフリーズ/解凍できます。正しいキーペアで署名しているか確認してください。

## 注意事項

- **作成時のみ**: Asset/Collectionが存在した後は追加できない
- **Force approve**: 競合するプラグインがあってもフリーズ可能
- **Collection動作**: すべてのAssetを一度にフリーズ、個別ではない
- **永続**: 転送後も権限は取り消されない
- 権限を`None`に設定し`frozen: true`でソウルバウンドトークンに使用

## FAQ

### ソウルバウンド（譲渡不可）トークンの作成方法は？

`PermanentFreezeDelegate`でAssetを作成し、`frozen: true`に設定し、権限を`None`に設定します。Assetは解凍も転送もできなくなります。

### Freeze DelegateとPermanent Freeze Delegateの違いは？

通常のFreeze Delegate権限は転送時に取り消され、Assetでのみ機能します。Permanent Freeze Delegateは永続し、Collectionで機能し、`forceApprove`を使用します。

### Collection内の個別Assetをフリーズできますか？

いいえ。Permanent Freeze DelegateがCollectionにある場合、フリーズはすべてのAssetに一度に影響します。個別制御にはAssetレベルのPermanent Freeze Delegateを使用してください。

### 永久フリーズされたAssetをバーンできますか？

Permanent Burn Delegateもある場合のみ。通常のBurn Delegateはフリーズされたassetをバーンできませんが、Permanent Burn Delegateは`forceApprove`を使用します。

## 関連プラグイン

- [Freeze Delegate](/ja/smart-contracts/core/plugins/freeze-delegate) - 一時的なロック用の取り消し可能なフリーズ
- [Permanent Transfer Delegate](/ja/smart-contracts/core/plugins/permanent-transfer-delegate) - 永久転送権限
- [Permanent Burn Delegate](/ja/smart-contracts/core/plugins/permanent-burn-delegate) - フリーズされたAssetもバーン

## 用語集

| 用語 | 定義 |
|------|------------|
| **永久プラグイン** | 作成時にのみ追加でき、永続するプラグイン |
| **forceApprove** | 他のプラグイン拒否をオーバーライドする検証 |
| **ソウルバウンド** | ウォレットに永久フリーズされた譲渡不可トークン |
| **Collectionフリーズ** | Collection内のすべてのAssetを一度にフリーズ |

---

*Metaplex Foundation管理 · 最終確認 2026年1月 · @metaplex-foundation/mpl-coreに適用*
