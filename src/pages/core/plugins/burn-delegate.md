---
title: Burn Delegate
metaTitle: Burn Delegate | Core
description: Learn about the Core Asset Burn Delegate Plugin. The delegate can burn the Asset at any point in time.
---

The Transfer Plugin is a `Owner Managed` plugin that allows the authority of the program to burn the Asset at any given moment.

The Burn Plugin will work in areas such as:

- Gaming scenario where the users NFT get burned based on an event that occurs.

## Works With

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ❌  |

## Arguments

The Burn Plugin doesn't contain any arguments to pass in.

## Adding the Burn Plugin to an Asset

{% dialect-switcher title="Adding a Burn Plugin to an MPL Core Asset" %}
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

## Delegating Burn Authority

The Burn Delegate plugin authority can be delegated to a different address using the `approvePluginAuthority` function. This allows you to change who can burn the Asset.

{% dialect-switcher title="Delegate Burn Authority" %}
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

## Revoking Burn Authority

The burn authority can be revoked using the `revokePluginAuthority` function, returning control to the asset owner.

{% dialect-switcher title="Revoke Burn Authority" %}
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
