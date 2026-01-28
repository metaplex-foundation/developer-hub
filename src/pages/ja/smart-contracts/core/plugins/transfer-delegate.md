---
title: Transfer Delegate Plugin
metaTitle: Transfer Delegate Plugin | Metaplex Core
description: 委任者がCore NFT Assetを転送できるようにします。Transfer Delegateプラグインは、エスクローレス販売、ゲームメカニクス、マーケットプレースリスティングに使用できます。
---

**Transfer Delegate Plugin**は、指定された権限が所有者に代わってCore Assetを転送できるようにします。エスクローレスマーケットプレース販売、ゲームメカニクス、サブスクリプションサービスに不可欠です。 {% .lead %}

{% callout title="学習内容" %}

- AssetにTransfer Delegateプラグインを追加する
- マーケットプレースやプログラムに転送権限を委任する
- 委任者として転送を実行する
- 転送時の権限動作

{% /callout %}

## 概要

**Transfer Delegate**は、委任者がAssetを転送できるようにする所有者管理プラグインです。委任されると、権限は所有者の承認なしにAssetを任意のアドレスに転送できます。

- エスクローレスマーケットプレースリスティングを有効化
- 権限は**転送後に取り消される**（一回限りの使用）
- 永続的な権限には[Permanent Transfer Delegate](/ja/smart-contracts/core/plugins/permanent-transfer-delegate)を使用
- 追加の引数は不要

## 対象外

永久転送権限（Permanent Transfer Delegateを参照）、コレクションレベル転送、Token Metadata転送権限（別システム）。

## クイックスタート

**ジャンプ先:** [プラグイン追加](#assetにtransfer-delegateプラグインを追加) · [権限委任](#transfer権限の委任) · [委任者として転送](#委任者としてのasset転送)

1. 委任者アドレスでTransfer Delegateプラグインを追加
2. 委任者は一度だけAssetを転送可能
3. 転送後、権限は自動的に取り消される

## 概説

`Transfer Delegate`プラグインは、Transfer Delegateプラグインの権限がいつでもAssetを転送できる`所有者管理`プラグインです。

Transferプラグインは以下のような分野で機能します：

- Assetのエスクローレス販売：エスクローアカウントを必要とせずにNFTを購入者に直接転送
- イベントに基づいてユーザーがassetを交換/失うゲームシナリオ：ゲームイベントが発生した時にassetを自動転送
- サブスクリプションサービス：サブスクリプションサービスの一部としてNFTを転送

{% callout type="note" title="Transfer vs Permanent Transfer Delegateの使い分け" %}

| ユースケース | Transfer Delegate | Permanent Transfer Delegate |
|----------|-------------------|----------------------------|
| マーケットプレースリスティング | ✅ 最適 | ❌ リスクが高い |
| 一回限りの転送 | ✅ 最適 | ❌ 過剰 |
| レンタル返却 | ❌ 一回使用 | ✅ 最適 |
| ゲームassetスワップ | ✅ 最適 | ✅ 使用可能 |
| 転送後の権限維持 | ❌ 取り消される | ✅ 維持される |

**Transfer Delegateを選択** - 一回限りのエスクローレス販売（転送後に権限取り消し）。
**[Permanent Transfer Delegate](/ja/smart-contracts/core/plugins/permanent-transfer-delegate)を選択** - 権限が永続する必要がある場合。

{% /callout %}

{% callout title="警告！" %}
transfer delegate権限は一時的であり、asset転送時にリセットされます。
{% /callout %}

## 動作対象

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ❌  |

## 引数

Transferプラグインには渡す引数は含まれていません。

## 関数

### AssetにTransfer Delegateプラグインを追加

`addPlugin`コマンドは、AssetにTransfer Delegateプラグインを追加します。このプラグインにより、委任者がいつでもAssetを転送できるようになります。

{% dialect-switcher title="MPL Core AssetにTransferプラグインを追加" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { addPlugin } from '@metaplex-foundation/mpl-core'

const assetAddress = publicKey('11111111111111111111111111111111')
const delegate = publicKey('22222222222222222222222222222222')

await addPlugin(umi, {
  asset: assetAddress,
  plugin: {
    type: 'TransferDelegate',
    authority: { type: 'Address', address: delegate },
  },
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust CPI" id="rust-cpi" %}
```rust
AddPluginV1CpiBuilder::new(ctx.accounts.mpl_core_program)
    .asset(ctx.accounts.asset)
    .collection(Some(ctx.accounts.collection))
    .authority(Some(ctx.accounts.authority))
    .payer(ctx.accounts.payer)
    .plugin(Plugin::TransferDelegate(TransferDelegate {}))
    .invoke();
```
{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{
    instructions::AddPluginV1Builder,
    types::{Plugin, TransferDelegate},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn add_transfer_delegate_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let add_plugin_ix = AddPluginV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .plugin(Plugin::TransferDelegate(TransferDelegate {}))
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let add_plugin_tx = Transaction::new_signed_with_payer(
        &[add_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&add_plugin_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}

```

{% /dialect %}
{% /dialect-switcher %}

### Transfer権限の委任

`approvePluginAuthority`コマンドは、転送権限を別のアドレスに委任します。これにより、所有権を維持しながら別のアドレスがAssetを転送できるようになります。

{% dialect-switcher title="Transfer権限の委任" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { approvePluginAuthority } from '@metaplex-foundation/mpl-core'

const asset = publicKey("11111111111111111111111111111111");
const collection = publicKey("22222222222222222222222222222222");
const delegateAddress = publicKey("33333333333333333333333333333333");

await approvePluginAuthority(umi, {
  asset: asset,
  collection: collection,
  plugin: { type: "TransferDelegate" },
  newAuthority: { type: "Address", address: delegateAddress },
}).sendAndConfirm(umi);
```

{% /dialect %}

{% dialect title="Rust CPI" id="rust-cpi" %}
```rust
ApprovePluginAuthorityV1CpiBuilder::new(ctx.accounts.mpl_core_program)
    .asset(ctx.accounts.asset)
    .collection(Some(ctx.accounts.collection))
    .authority(Some(ctx.accounts.authority))
    .payer(ctx.accounts.payer)
    .plugin_type(PluginType::TransferDelegate)
    .new_authority(PluginAuthority::Address { address: ctx.accounts.new_authority.key() })
    .invoke()?;
```
{% /dialect %}

{% dialect title="Rust" id="rust" %}
```rust
use mpl_core::{
    instructions::ApprovePluginAuthorityV1Builder,
    types::{PluginAuthority, PluginType},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn approve_plugin_authority() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let new_authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let collection = Pubkey::from_str("2222222222222222222222222222222").unwrap();

    let approve_plugin_authority_ix = ApprovePluginAuthorityV1Builder::new()
        .asset(asset)
        // Assetがコレクションの一部である場合、コレクションを渡す必要があります
        .collection(Some(collection))
        .authority(Some(authority.pubkey()))
        .payer(authority.pubkey())
        .plugin_type(PluginType::TransferDelegate)
        .new_authority(PluginAuthority::Address { address: new_authority.pubkey() })
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let approve_plugin_authority_tx = Transaction::new_signed_with_payer(
        &[approve_plugin_authority_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&approve_plugin_authority_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res);
}
```
{% /dialect %}
{% /dialect-switcher %}

### 委任者としてのAsset転送

`transfer`インストラクションは、transfer delegate権限を使用してAssetを別のアドレスに転送します。

{% dialect-switcher title="MPL Core Assetの転送" %}
{% dialect title="JavaScript" id="js" %}

```ts
import {
  fetchAsset,
  fetchCollection,
  transfer,
} from "@metaplex-foundation/mpl-core";
import { publicKey } from "@metaplex-foundation/umi";

// 転送したいAsset ID
const assetId = publicKey("11111111111111111111111111111111");

// Assetを取得
const assetItem = await fetchAsset(umi, assetId);

// Assetがコレクションの一部である場合、コレクションを取得
const collectionItem =
    assetItem.updateAuthority.type == "Collection" &&
    assetItem.updateAuthority.address
      ? await fetchCollection(umi, assetItem.updateAuthority.address)
      : undefined;

// Core NFT Assetを転送
const { signature } = await transfer(umi, {
    asset: assetItem,
    newOwner: publicKey("22222222222222222222222222222222"),
    collection: collectionItem,
  })
  .sendAndConfirm(umi);
```

{% /dialect %}

{% dialect title="Rust CPI" id="rust-cpi" %}
```rust
TransferV1CpiBuilder::new(&ctx.accounts.mpl_core_program.to_account_info())
    .asset(&ctx.accounts.asset.to_account_info())
    .new_owner(&ctx.accounts.new_owner.to_account_info())
    .payer(&ctx.accounts.payer.to_account_info())
    .authority(Some(&ctx.accounts.delegate_authority.to_account_info()))
    .system_program(&ctx.accounts.system_program.to_account_info())
    .invoke()?;
```

{% /dialect %}
{% /dialect-switcher %}

## Transfer Delegate権限の更新

Transfer Delegateプラグインは更新するプラグインデータを含まないため（空のオブジェクト`{}`）、主な「更新」操作はプラグイン権限の変更です。これにより、異なるアドレスに転送権限を委任できます。

### Transfer Delegate権限の変更

`approvePluginAuthority`関数を使用して転送権限を持つ人を変更できます：

{% dialect-switcher title="Transfer Delegate権限の更新" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { approvePluginAuthority } from '@metaplex-foundation/mpl-core'

(async () => {
    const assetAddress = publicKey('11111111111111111111111111111111')
    const newDelegate = publicKey('44444444444444444444444444444444')

    // transfer delegateを新しいアドレスに変更
    await approvePluginAuthority(umi, {
    asset: assetAddress,
    plugin: { type: 'TransferDelegate' },
    newAuthority: { type: 'Address', address: newDelegate },
    }).sendAndConfirm(umi)
})();
```

{% /dialect %}
{% /dialect-switcher %}

### Transfer Delegate権限の取り消し

転送権限は`revokePluginAuthority`関数を使用して取り消し、asset所有者に転送制御を戻すことができます。

{% dialect-switcher title="Transfer Delegate権限の取り消し" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { revokePluginAuthority } from '@metaplex-foundation/mpl-core'

const assetAddress = publicKey('11111111111111111111111111111111')

await revokePluginAuthority(umi, {
  asset: assetAddress,
  plugin: { type: 'TransferDelegate' },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## 一般的なエラー

### `Authority mismatch`

transfer delegate権限のみがAssetを転送できます。正しいキーペアで署名しているか確認してください。

### `Asset is frozen`

フリーズされたAssetは転送できません。freeze権限が先にAssetを解凍する必要があります。

### `Transfer delegate not found`

AssetにTransfer Delegateプラグインがないか、前回の転送後に権限が既に取り消されています。

## 注意事項

- 所有者管理: 追加には所有者の署名が必要
- 権限は**転送後に自動的に取り消される**
- 各転送は新しい所有者による再委任が必要
- フリーズされたAssetは委任者によって転送できない
- 永続的な権限にはPermanent Transfer Delegateを使用

## クイックリファレンス

### 権限のライフサイクル

| イベント | 権限の状態 |
|-------|------------------|
| プラグイン追加 | アクティブ |
| Asset転送 | **取り消し** |
| 新しい所有者がプラグインを追加 | アクティブ（新しい委任者） |

### 誰が転送できる？

| 権限 | 転送可能？ |
|-----------|---------------|
| Asset所有者 | はい（常に） |
| Transfer Delegate | はい（一回） |
| Permanent Transfer Delegate | はい（常に） |
| Update Authority | いいえ |

## FAQ

### なぜ転送権限が取り消されたのですか？

Transfer Delegate権限は転送後に自動的に取り消されます。これはマーケットプレースの安全性のための設計です - 委任者は一度しか転送できません。

### エスクローレスリスティングの実装方法は？

1. 出品者がマーケットプレースを権限としてTransfer Delegateを追加
2. 購入者が支払った時、マーケットプレースがAssetを購入者に転送
3. 権限が取り消される；出品者は二重リスティングできない

### Transfer DelegateとPermanent Transfer Delegateの違いは？

Transfer Delegateは一回の転送後に取り消されます。Permanent Transfer Delegateは永続し、Asset作成時にのみ追加できます。

### 委任者としてフリーズされたAssetを転送できますか？

いいえ。フリーズされたAssetは委任者による転送を含むすべての転送をブロックします。複雑なエスクローシナリオにはPermanent Transfer DelegateとPermanent Freeze Delegateを使用してください。

### 所有者は各転送を承認する必要がありますか？

いいえ。Transfer Delegateが設定されると、委任者は所有者の承認なしに転送できます。ただし、権限が取り消される前に一度しかできません。

## 関連プラグイン

- [Permanent Transfer Delegate](/ja/smart-contracts/core/plugins/permanent-transfer-delegate) - 取り消し不能な転送権限
- [Freeze Delegate](/ja/smart-contracts/core/plugins/freeze-delegate) - 一時的に転送をブロック
- [Burn Delegate](/ja/smart-contracts/core/plugins/burn-delegate) - 委任者によるAssetバーンを許可

## 用語集

| 用語 | 定義 |
|------|------------|
| **Transfer Delegate** | 一回限りの転送権限を許可する所有者管理プラグイン |
| **所有者管理** | 追加に所有者の署名が必要なプラグインタイプ |
| **エスクローレス** | 保持アカウントに転送せずに販売 |
| **Permanent Transfer Delegate** | 作成時に追加される取り消し不能バージョン |

---

*Metaplex Foundation管理 · 最終確認 2026年1月 · @metaplex-foundation/mpl-coreに適用*
