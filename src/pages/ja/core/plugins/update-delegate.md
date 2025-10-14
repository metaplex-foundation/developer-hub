---
title: Update Delegateプラグイン
metaTitle: Update Delegateプラグイン | Core
description: Core NFTアセットやコレクションに、追加のアップデート権限を委任する方法を学びます。
updated: "06-19-2024"
---

Update Delegateは「権限管理型（Authority Managed）」プラグインで、MPL Coreアセットの権限者が、アセットへアップデートデリゲートを割り当てられるようにします。

Update Delegateプラグインの用途:

- MPL Coreアセット全体の更新/編集を、第三者に委任したい場合

## 対応状況

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

## 引数

| 名称                | 型          |
| ------------------- | ----------- |
| additionalDelegates | publickey[] |

### additionalDelegates

`additionalDelegates`により、updateDelegateプラグインへ複数のデリゲートを追加できます。

追加デリゲートが可能な操作（制限）:
- `additionalDelegates`配列の追加・変更（自分自身の削除を除く）は不可
- updateAuthorityプラグインの権限タイプ変更は不可
- コレクションのルートアップデート権限の変更は不可

## アセットへUpdate Delegateプラグインを追加

{% dialect-switcher title="MPL CoreアセットへUpdate Delegateプラグインを追加" %}
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

