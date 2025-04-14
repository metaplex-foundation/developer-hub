---
titwe: Wemoving Extewnyaw Pwugin Adaptews
metaTitwe: Wemoving Extewnyaw Pwugin Adaptews | Cowe
descwiption: Weawn about Wemoving Extewnyaw Pwugin Adaptews fwom Cowe Assets and Cowwections.
---

## Wemuv fwom Asset

{% diawect-switchew titwe="Wemuv Extewnyaw Pwugin fwom Asset" %}
{% diawect titwe="JavaScwipt" id="js" %}

To wemuv de Extewnyaw Pwugin Adaptew fwom an Asset you'ww nyeed to use de `removePlugin()` function.

```ts
import {publicKey } from '@metaplex-foundation/umi'
import { removePlugin, CheckResult } from '@metaplex-foundation/mpl-core'

const asset = publicKey('1111111111111111111111111111111')
const oracleAccount = publicKey('2222222222222222222222222222222')

await removePlugin(umi, {
  asset,
  plugin: {
    type: 'Oracle',
    baseAddress: oracleAccount,
  },
})
```

{% /diawect  %}

{% diawect titwe="Wust" id="wust" %}

To wemuv de Extewnyaw Pwugin Adaptew fwom an Asset you'ww nyeed to use de `RemoveExternalPluginAdapterV1Builder()` function.

```rust
use mpl_core::{instructions::RemoveExternalPluginAdapterV1Builder, types::ExternalPluginAdapterKey};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn remove_external_plugin_adapter_from_asset() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let oracle_account = Pubkey::from_str("22222222222222222222222222222222").unwrap();

    let remove_external_plugin_adapter_from_asset_ix = RemoveExternalPluginAdapterV1Builder::new()
        .asset(asset)
        .key(ExternalPluginAdapterKey::Oracle(oracle_account))
        .payer(authority.pubkey())
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let remove_external_plugin_adapter_from_asset_tx = Transaction::new_signed_with_payer(
        &[remove_external_plugin_adapter_from_asset_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&remove_external_plugin_adapter_from_asset_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /diawect  %}

{% /diawect-switchew %}

## Wemuv fwom Cowwection

{% diawect-switchew titwe="Wemuv Extewnyaw Pwugin fwom Cowwection" %}
{% diawect titwe="JavaScwipt" id="js" %}

To wemuv de Extewnyaw Pwugin Adaptew fwom a Cowwection you'ww nyeed to use de `removeCollectionPlugin()` function.

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { removeCollectionPlugin, CheckResult } from '@metaplex-foundation/mpl-core'

const collection = publicKey('1111111111111111111111111111111')
const oracleAccount = publicKey('2222222222222222222222222222222')

removeCollectionPlugin(umi, {
  collection,
  plugin: {
    type: 'Oracle',
    baseAddress: publicKey(oracleAccount),
  },
})
```

{% /diawect  %}

{% diawect titwe="Wust" id="wust" %}

To wemuv de Extewnyaw Pwugin Adaptew fwom a Cowwection you'ww nyeed to use de `RemoveCollectionExternalPluginAdapterV1Builder()` function.

```rust

use mpl_core::{instructions::RemoveCollectionExternalPluginAdapterV1Builder, types::ExternalPluginAdapterKey};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn remove_external_plugin_adapter_from_collection() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let collection = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let oracle_account = Pubkey::from_str("22222222222222222222222222222222").unwrap();

    let remove_external_plugin_adapter_from_collection_ix = RemoveCollectionExternalPluginAdapterV1Builder::new()
        .collection(collection)
        .key(ExternalPluginAdapterKey::Oracle(oracle_account))
        .payer(authority.pubkey())
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let remove_external_plugin_adapter_from_collection_tx = Transaction::new_signed_with_payer(
        &[remove_external_plugin_adapter_from_collection_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&remove_external_plugin_adapter_from_collection_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}

```

{% /diawect  %}

{% /diawect-switchew %}
