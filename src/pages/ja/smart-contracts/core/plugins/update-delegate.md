---
title: Update Delegate Plugin
metaTitle: Update Delegate Plugin | Metaplex Core
description: Core NFT AssetとCollectionのupdate権限を第三者に委任します。所有権を移転せずに他者がメタデータを変更できるようにします。
---

**Update Delegate Plugin**を使用すると、追加のアドレスに更新権限を付与できます。第三者がプライマリupdate権限でなくてもAssetメタデータを変更する必要がある場合に有用です。 {% .lead %}

{% callout title="学習内容" %}

- AssetとCollectionにUpdate Delegateプラグインを追加する
- 追加のアドレスに更新権限を付与する
- 追加の委任者ができることとできないことを理解する
- 委任者リストの更新と管理

{% /callout %}

## 概要

**Update Delegate**は、update権限が他のアドレスに更新権限を付与できる権限管理プラグインです。追加の委任者はほとんどのAssetデータを変更できますが、コア権限設定は変更できません。

- 第三者に更新権限を付与
- 複数の追加委任者を追加可能
- AssetとCollectionの両方で機能
- 委任者はルートupdate権限を変更できない

## 対象外

永久update委任、所有者レベル権限（これは権限管理）、Token Metadata update権限（別システム）。

## クイックスタート

**ジャンプ先:** [Assetに追加](#assetにupdate-delegateプラグインを追加) · [委任者更新](#update-delegateプラグインの更新) · [Collection](#collectionのupdate-delegateプラグインを更新)

1. 委任者アドレスでUpdate Delegateプラグインを追加
2. オプションで追加の委任者を追加
3. 委任者はAssetメタデータを更新できるようになります

{% callout type="note" title="Update Delegateを使用する場面" %}

| シナリオ | ソリューション |
|----------|----------|
| 第三者がメタデータを更新する必要がある | ✅ Update Delegate |
| ゲームプログラムがステータスを変更する必要がある | ✅ Update Delegate（プログラムに委任） |
| 複数のチームメンバーが更新アクセスを必要とする | ✅ 追加委任者 |
| 永久的な取り消し不能更新アクセス | ❌ サポートされていない（マルチシグ権限を使用） |
| 所有者が更新を制御すべき | ❌ デフォルト権限を使用 |

**Update Delegateを使用** - ルート権限を移転せずにプログラムや第三者に更新権限を付与する必要がある場合。

{% /callout %}

## 一般的なユースケース

- **第三者サービス**: プラットフォームがあなたに代わってメタデータを更新できるようにする
- **ゲームプログラム**: ゲームプログラムにAsset属性を変更する権限を付与
- **チームコラボレーション**: キーを共有せずに複数のチームメンバーが更新可能
- **マーケットプレース**: マーケットプレースがリスティング関連メタデータを更新できるようにする
- **動的コンテンツ**: Assetデータを自動更新するサービス

## 動作対象

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

## 引数

|                     |             |
| ------------------- | ----------- |
| additionalDelegates | publickey[] |

### additionalDelegates

追加委任者を使用すると、updateDelegateプラグインに複数の委任者を追加できます。

追加委任者はupdate権限ができるほぼすべてのことができますが、以下は除きます：
- 追加委任者配列の追加または変更（自分自身の削除を除く）
- updateAuthorityプラグインのプラグイン権限の変更
- コレクションのルートupdate権限の変更

## AssetにUpdate Delegateプラグインを追加

{% dialect-switcher title="MPL Core AssetにUpdate Delegateプラグインを追加" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { addPlugin } from '@metaplex-foundation/mpl-core'

const assetAddress = publicKey('11111111111111111111111111111111')
const delegate = publicKey('22222222222222222222222222222222')

await addPlugin(umi, {
  asset: assetAddress,
  plugin: {
    type: 'UpdateDelegate',
    authority: { type: 'Address', address: delegate },
    additionalDelegates: [],
  },
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```ts
use mpl_core::{
    instructions::AddPluginV1Builder,
    types::{Plugin, UpdateDelegate},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn add_update_delegate_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let add_update_delegate_plugin_ix = AddPluginV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .plugin(Plugin::UpdateDelegate(UpdateDelegate {}))
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let add_update_delegate_plugin_tx = Transaction::new_signed_with_payer(
        &[add_update_delegate_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&add_update_delegate_plugin_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}

```

{% /dialect %}
{% /dialect-switcher %}

## Update Delegateプラグインの更新

Update Delegateプラグインは、追加委任者リストの変更やプラグイン権限の変更のために更新できます。

{% dialect-switcher title="AssetのUpdate Delegateプラグインを更新" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin } from '@metaplex-foundation/mpl-core'

const assetAddress = publicKey('11111111111111111111111111111111')
const newDelegate = publicKey('33333333333333333333333333333333')
const existingDelegate = publicKey('22222222222222222222222222222222')

await updatePlugin(umi, {
  asset: assetAddress,
  plugin: {
    type: 'UpdateDelegate',
    additionalDelegates: [existingDelegate, newDelegate], // 委任者を追加または削除
  },
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{
    instructions::UpdatePluginV1Builder,
    types::{Plugin, UpdateDelegate},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn update_update_delegate_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let new_delegate = Pubkey::from_str("33333333333333333333333333333333").unwrap();
    let existing_delegate = Pubkey::from_str("22222222222222222222222222222222").unwrap();

    let update_update_delegate_plugin_ix = UpdatePluginV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .plugin(Plugin::UpdateDelegate(UpdateDelegate {
            additional_delegates: vec![existing_delegate, new_delegate], // 委任者を追加または削除
        }))
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let update_update_delegate_plugin_tx = Transaction::new_signed_with_payer(
        &[update_update_delegate_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&update_update_delegate_plugin_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}

## CollectionのUpdate Delegateプラグインを更新

{% dialect-switcher title="CollectionのUpdate Delegateプラグインを更新" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updateCollectionPlugin } from '@metaplex-foundation/mpl-core'

const collectionAddress = publicKey('11111111111111111111111111111111')
const delegate1 = publicKey('22222222222222222222222222222222')
const delegate2 = publicKey('33333333333333333333333333333333')

await updateCollectionPlugin(umi, {
  collection: collectionAddress,
  plugin: {
    type: 'UpdateDelegate',
    additionalDelegates: [delegate1, delegate2], // 更新された委任者リスト
  },
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{
    instructions::UpdateCollectionPluginV1Builder,
    types::{Plugin, UpdateDelegate},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn update_collection_update_delegate_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let collection = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let delegate1 = Pubkey::from_str("22222222222222222222222222222222").unwrap();
    let delegate2 = Pubkey::from_str("33333333333333333333333333333333").unwrap();

    let update_collection_update_delegate_plugin_ix = UpdateCollectionPluginV1Builder::new()
        .collection(collection)
        .payer(authority.pubkey())
        .plugin(Plugin::UpdateDelegate(UpdateDelegate {
            additional_delegates: vec![delegate1, delegate2], // 更新された委任者リスト
        }))
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let update_collection_update_delegate_plugin_tx = Transaction::new_signed_with_payer(
        &[update_collection_update_delegate_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&update_collection_update_delegate_plugin_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}

## 一般的なエラー

### `Authority mismatch`

update権限（または既存のプラグイン権限）のみがUpdate Delegateプラグインを追加/変更できます。

### `Cannot modify root authority`

追加委任者はルートupdate権限を変更したり、追加委任者リストを変更したりできません（自分自身の削除を除く）。

## 注意事項

- 権限管理: update権限は所有者の署名なしに追加可能
- 追加委任者はほぼ完全な更新権限を持つ
- 委任者はルートupdate権限を変更できない
- 委任者は追加委任者リストを変更できない（自分自身の削除を除く）
- AssetとCollectionの両方で機能

## クイックリファレンス

### 追加委任者の権限

| アクション | 許可？ |
|--------|----------|
| 名前/URI更新 | ✅ |
| プラグイン追加 | ✅ |
| プラグイン更新 | ✅ |
| プラグイン削除 | ✅ |
| ルートupdate権限変更 | ❌ |
| 追加委任者変更 | ❌（自己削除を除く） |
| プラグイン権限変更 | ❌ |

## FAQ

### 追加委任者は何ができますか？

update権限ができるほぼすべてのこと：メタデータ更新、プラグイン追加/削除など。ルートupdate権限の変更、追加委任者リストの変更、Update Delegateプラグイン権限の変更はできません。

### 追加委任者は他の委任者を追加できますか？

いいえ。ルートupdate権限（またはプラグイン権限）のみが追加委任者を追加または削除できます。

### 追加委任者として自分自身を削除する方法は？

追加委任者は`additionalDelegates`配列に自分のアドレスを含めずにプラグインを更新することで、リストから自分自身を削除できます。

### 追加委任者に制限はありますか？

ハード制限はありませんが、委任者が増えるとアカウントサイズとレントが増加します。リストは妥当な範囲に保ってください。

### Update DelegateはCollectionで機能しますか？

はい。CollectionにUpdate Delegateを追加すると、委任者はコレクションメタデータとコレクションレベルプラグインを更新できます。

## 関連プラグイン

- [Attributes](/ja/smart-contracts/core/plugins/attribute) - 委任者が更新できるオンチェーンデータを保存
- [ImmutableMetadata](/ja/smart-contracts/core/plugins/immutableMetadata) - メタデータを変更不可にする（委任者をオーバーライド）
- [AddBlocker](/ja/smart-contracts/core/plugins/addBlocker) - 委任者が新しいプラグインを追加することを防止

## 用語集

| 用語 | 定義 |
|------|------------|
| **Update Delegate** | 更新権限を付与するための権限管理プラグイン |
| **追加委任者** | 更新権限を持つ追加アドレス |
| **権限管理** | update権限によって制御されるプラグインタイプ |
| **ルートUpdate Authority** | Asset/Collectionのプライマリupdate権限 |

---

*Metaplex Foundation管理 · 最終確認 2026年1月 · @metaplex-foundation/mpl-coreに適用*
