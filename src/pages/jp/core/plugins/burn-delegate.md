---
title: Burn Delegate
metaTitle: Burn Delegate | Core
description: Core Asset Burn Delegateプラグインについて学びます。委任者はいつでもアセットをバーンできます。
---

Transferプラグインは、プログラムの権限がいつでもアセットをバーンできる`所有者管理`プラグインです。

Burnプラグインは以下のような分野で機能します：

- 発生するイベントに基づいてユーザーのNFTがバーンされるゲームシナリオ

## 動作対象

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ❌  |

## 引数

Burnプラグインには渡す引数は含まれていません。

## アセットにBurnプラグインを追加

{% dialect-switcher title="MPL Core AssetにBurnプラグインを追加" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { addPlugin } from '@metaplex-foundation/mpl-core'

const asset = publicKey('11111111111111111111111111111111')

await addPlugin(umi, {
  asset: asset,
  plugin: { type: 'BurnDelegate' },
}).sendAndConfirm(umi)
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