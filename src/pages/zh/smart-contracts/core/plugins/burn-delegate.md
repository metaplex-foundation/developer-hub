---
title: 销毁委托
metaTitle: 销毁委托 | Core
description: 了解 Core 资产销毁委托插件。委托方可以在任何时间点销毁资产。
---

转移插件是一个`所有者管理`插件，允许程序的权限在任何给定时刻销毁资产。

销毁插件适用于以下领域：

- 根据发生的事件销毁用户 NFT 的游戏场景。

## 适用于

|                     |     |
| ------------------- | --- |
| MPL Core 资产      | ✅  |
| MPL Core 集合 | ❌  |

## 参数

销毁插件不包含任何需要传入的参数。

## 向资产添加销毁插件

{% dialect-switcher title="向 MPL Core 资产添加销毁插件" %}
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

## 委托销毁权限

销毁委托插件权限可以使用 `approvePluginAuthority` 函数委托给不同的地址。这允许您更改谁可以销毁资产。

{% dialect-switcher title="委托销毁权限" %}
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

## 撤销销毁权限

可以使用 `revokePluginAuthority` 函数撤销销毁权限，将控制权返还给资产所有者。

{% dialect-switcher title="撤销销毁权限" %}
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
