---
title: Update Delegateプラグイン
metaTitle: Update Delegateプラグイン | Metaplex Core
description: Core NFT AssetsとCollectionsに対してサードパーティに更新権限をデリゲートします。所有権を移転せずに他の人がメタデータを変更できるようにします。
updated: '01-31-2026'
keywords:
  - update delegate
  - delegate update authority
  - metadata permissions
  - third-party updates
about:
  - Update delegation
  - Metadata permissions
  - Authority management
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: 追加デリゲートは何ができますか？
    a: Update authorityができることのほとんど（メタデータの更新、プラグインの追加/削除など）ができます。ルートupdate authorityの変更、追加デリゲートリストの変更、Update Delegateプラグインauthorityの変更はできません。
  - q: 追加デリゲートはより多くのデリゲートを追加できますか？
    a: いいえ。ルートupdate authority（またはプラグインauthority）のみが追加デリゲートを追加または削除できます。
  - q: 追加デリゲートとして自分を削除するにはどうすればよいですか？
    a: 追加デリゲートは、additionalDelegates配列に自分のアドレスを含めずにプラグインを更新することで、リストから自分を削除できます。
  - q: 追加デリゲートに制限はありますか？
    a: ハードリミットはありませんが、デリゲートが増えるとアカウントサイズとレントが増加します。リストを適切な数に保ってください。
  - q: Update DelegateはCollectionsで機能しますか？
    a: はい。CollectionにUpdate Delegateを追加すると、デリゲートがCollectionメタデータとCollectionレベルのプラグインを更新できます。
---
**Update Delegateプラグイン**は、追加のアドレスに更新権限を付与できます。サードパーティがプライマリupdate authorityでなくてもAssetメタデータを変更する必要がある場合に便利です。 {% .lead %}
{% callout title="学べること" %}

- AssetsとCollectionsにUpdate Delegateプラグインを追加
- 追加のアドレスに更新権限を付与
- 追加デリゲートができることとできないことを理解
- デリゲートリストの更新と管理
{% /callout %}

## 概要

**Update Delegate**は、update authorityが他のアドレスに更新権限を付与できるAuthority Managedプラグインです。追加デリゲートはほとんどのAssetデータを変更できますが、コアauthority設定は変更できません。

- サードパーティに更新権限を付与
- 複数の追加デリゲートを追加
- AssetsとCollectionsの両方で動作
- デリゲートはルートupdate authorityを変更不可

## 対象外

永続的な更新デリゲーション、オーナーレベルの権限（これはauthority managed）、Token Metadata update authority（別のシステム）。

## クイックスタート

**ジャンプ先:** [Assetに追加](#assetへのupdate-delegateプラグインの追加) · [デリゲートを更新](#update-delegateプラグインの更新) · [Collection](#collectionのupdate-delegateプラグインの更新)

1. デリゲートアドレスでUpdate Delegateプラグインを追加
2. オプションで追加デリゲートを追加
3. デリゲートがAssetメタデータを更新可能に
{% callout type="note" title="Update Delegateを使用するタイミング" %}
| シナリオ | 解決策 |
|----------|----------|
| サードパーティがメタデータを更新する必要がある | ✅ Update Delegate |
| ゲームプログラムがステータスを変更する必要がある | ✅ Update Delegate（プログラムにデリゲート） |
| 複数のチームメンバーが更新アクセスを必要とする | ✅ 追加デリゲート |
| 永続的な取り消し不可能な更新アクセス | ❌ サポートされていない（マルチシグauthorityを使用） |
| オーナーが更新を制御すべき | ❌ デフォルトauthorityを使用 |
**Update Delegateを使用**するのは、ルートauthorityを移転せずにプログラムやサードパーティに更新権限を付与する必要がある場合です。
{% /callout %}

## 一般的なユースケース

- **サードパーティサービス**: プラットフォームがあなたに代わってメタデータを更新できるようにする
- **ゲームプログラム**: ゲームプログラムにAsset属性を変更する権限を付与
- **チームコラボレーション**: 複数のチームメンバーがキーを共有せずに更新可能
- **マーケットプレイス**: マーケットプレイスがリスティング関連のメタデータを更新できるようにする
- **動的コンテンツ**: Assetデータを自動更新するサービス

## 対応

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

## 引数

|                     |             |
| ------------------- | ----------- |
| additionalDelegates | publickey[] |

### additionalDelegates

追加デリゲートにより、updateDelegateプラグインに複数のデリゲートを追加できます。
追加デリゲートは、update authorityができることをすべてできますが、以下を除きます：

- 追加デリゲート配列の追加または変更（自分を削除する以外）
- updateAuthorityプラグインのプラグインauthorityの変更
- Collectionのルートupdate authorityの変更

## AssetへのUpdate Delegateプラグインの追加

{% dialect-switcher title="MPL Core AssetへのUpdate Delegateプラグインの追加" %}
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

Update Delegateプラグインは、追加デリゲートのリストを変更したり、プラグインauthorityを変更したりするために更新できます。
{% dialect-switcher title="AssetのUpdate Delegateプラグインの更新" %}
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
    additionalDelegates: [existingDelegate, newDelegate], // デリゲートを追加または削除
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
            additional_delegates: vec![existing_delegate, new_delegate], // デリゲートを追加または削除
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

## CollectionのUpdate Delegateプラグインの更新

{% dialect-switcher title="CollectionのUpdate Delegateプラグインの更新" %}
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
    additionalDelegates: [delegate1, delegate2], // 更新されたデリゲートリスト
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
            additional_delegates: vec![delegate1, delegate2], // 更新されたデリゲートリスト
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

Update authority（または既存のプラグインauthority）のみがUpdate Delegateプラグインを追加/変更できます。

### `Cannot modify root authority`

追加デリゲートはルートupdate authorityの変更や追加デリゲートリストの変更（自分を削除する以外）はできません。

## 注意事項

- Authority Managed: update authorityはオーナーの署名なしで追加可能
- 追加デリゲートはほぼ完全な更新権限を持つ
- デリゲートはルートupdate authorityを変更不可
- デリゲートは追加デリゲートリストを変更不可（自分を削除する以外）
- AssetsとCollectionsの両方で動作

## クイックリファレンス

### 追加デリゲートの権限

| アクション | 許可？ |
|--------|----------|
| 名前/URIの更新 | ✅ |
| プラグインの追加 | ✅ |
| プラグインの更新 | ✅ |
| プラグインの削除 | ✅ |
| ルートupdate authorityの変更 | ❌ |
| 追加デリゲートの変更 | ❌（自己削除を除く） |
| プラグインauthorityの変更 | ❌ |

## FAQ

### 追加デリゲートは何ができますか？

Update authorityができることのほとんど（メタデータの更新、プラグインの追加/削除など）ができます。ルートupdate authorityの変更、追加デリゲートリストの変更、Update Delegateプラグインauthorityの変更はできません。

### 追加デリゲートはより多くのデリゲートを追加できますか？

いいえ。ルートupdate authority（またはプラグインauthority）のみが追加デリゲートを追加または削除できます。

### 追加デリゲートとして自分を削除するにはどうすればよいですか？

追加デリゲートは、`additionalDelegates`配列に自分のアドレスを含めずにプラグインを更新することで、リストから自分を削除できます。

### 追加デリゲートに制限はありますか？

ハードリミットはありませんが、デリゲートが増えるとアカウントサイズとレントが増加します。リストを適切な数に保ってください。

### Update DelegateはCollectionsで機能しますか？

はい。CollectionにUpdate Delegateを追加すると、デリゲートがCollectionメタデータとCollectionレベルのプラグインを更新できます。

## 関連プラグイン

- [Attributes](/smart-contracts/core/plugins/attribute) - デリゲートが更新できるオンチェーンデータを保存
- [ImmutableMetadata](/smart-contracts/core/plugins/immutableMetadata) - メタデータを変更不可にする（デリゲートを上書き）
- [AddBlocker](/smart-contracts/core/plugins/addBlocker) - デリゲートが新しいプラグインを追加するのを防止

## 用語集

| 用語 | 定義 |
|------|------------|
| **Update Delegate** | 更新権限を付与するAuthority Managedプラグイン |
| **追加デリゲート** | 更新権限を持つ追加アドレス |
| **Authority Managed** | Update authorityによって制御されるプラグインタイプ |
| **ルートUpdate Authority** | Asset/Collectionのプライマリupdate authority |
