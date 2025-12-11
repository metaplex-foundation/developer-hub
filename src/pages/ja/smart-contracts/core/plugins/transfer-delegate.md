---
title: Transfer Delegateプラグイン
metaTitle: Transfer Delegateプラグイン | Core
description: Transfer Delegateプラグインを使用すると、委任者はいつでもアセットを別のアドレスに転送できます。
---

## 概要

`Transfer Delegate`プラグインは、Transfer Delegateプラグインの権限がいつでもアセットを転送できる`所有者管理`プラグインです。

Transferプラグインは以下のような分野で機能します：

- アセットのエスクローレス販売：エスクローアカウントを必要とせずに、NFTを購入者に直接転送
- イベントに基づいてユーザーがアセットを交換/失うゲームシナリオ：ゲームイベントが発生したときにアセットを自動的に転送
- サブスクリプションサービス：サブスクリプションサービスの一部としてNFTを転送

{% callout title="警告！" %}
transfer delegate権限は一時的であり、アセット転送時にリセットされます。
{% /callout %}

## 動作対象

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ❌  |

## 引数

Transferプラグインには渡す引数は含まれていません。

## 関数

### アセットにTransfer Delegateプラグインを追加

`addPlugin`コマンドは、アセットにTransfer Delegateプラグインを追加します。このプラグインにより、委任者がいつでもアセットを転送できるようになります。

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

`approvePluginAuthority`コマンドは、transfer権限を別のアドレスに委任します。これにより、所有権を維持しながら別のアドレスがアセットを転送できるようになります。

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
        // アセットがコレクションの一部である場合、コレクションを渡す必要があります
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

### 委任者としてのアセット転送

`transfer`インストラクションは、transfer delegate権限を使用してアセットを別のアドレスに転送します。

{% dialect-switcher title="MPL Core Assetの転送" %}
{% dialect title="JavaScript" id="js" %}

```ts
import {
  fetchAsset,
  fetchCollection,
  transfer,
} from "@metaplex-foundation/mpl-core";
import { publicKey } from "@metaplex-foundation/umi";

// 転送したいアセットID
const assetId = publicKey("11111111111111111111111111111111");

// アセットを取得
const assetItem = await fetchAsset(umi, assetId);

// アセットがコレクションの一部である場合、コレクションを取得
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

{% /dialect %}`
{% /dialect-switcher %}