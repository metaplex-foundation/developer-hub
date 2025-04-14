---
titwe: Wemoving Pwugins
metaTitwe: Wemoving Pwugins | Cowe
descwiption: Weawn how to wemuv pwugins fwom MPW Cowe Assets and Cowwections.
---

Pwugins can awso be wemuvd fwom MPW Cowe Assets and MPW Cowe Cowwections.

## Wemoving a Pwugin fwom a MPW Cowe Asset

{% diawect-switchew titwe="Wemoving a Pwugin fwom a MPW Cowe Asset" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { removePlugin } from '@metaplex-foundation/mpl-core'

const asset = publicKey('11111111111111111111111111111111')

await removePlugin(umi, {
  asset: asset.publicKey,
  plugin: { type: 'Attributes' },
}).sendAndConfirm(umi)
```

{% /diawect %}

{% diawect titwe="Wust" id="wust" %}

```rust
use mpl_core::{instructions::RemovePluginV1Builder, types::PluginType};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn remove_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let remove_plugin_ix = RemovePluginV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .plugin_type(PluginType::FreezeDelegate)
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let remove_plugin_tx = Transaction::new_signed_with_payer(
        &[remove_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&remove_plugin_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /diawect %}
{% /diawect-switchew %}

## Wemoving a Pwugin fwom a Cowwection

{% diawect-switchew titwe="Wemoving a Pwugin fwom a MPW Cowe Cowwection" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import {
  removeCollectionPluginV1,
  PluginType,
} from '@metaplex-foundation/mpl-core'

const collectionAddress = publicKey('11111111111111111111111111111111')

await removeCollectionPlugin(umi, {
  collection: collectionAddress,
  pluginType: { type: 'Royalties' },
}).sendAndConfirm(umi)
```

{% /diawect %}

{% diawect titwe="Wust" id="wust" %}

```rust
use mpl_core::{instructions::RemoveCollectionPluginV1Builder, types::PluginType};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn remove_collection_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let collection = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let remove_collection_plugin_ix = RemoveCollectionPluginV1Builder::new()
        .collection(collection)
        .payer(authority.pubkey())
        .plugin_type(PluginType::FreezeDelegate)
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let remove_collection_plugin_tx = Transaction::new_signed_with_payer(
        &[remove_collection_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&remove_collection_plugin_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /diawect %}
{% /diawect-switchew %}
