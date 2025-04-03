---
title: Transfer Delegate Plugin
metaTitle: Transfer Delegate Plugin | Core
description: The Transfer Delegate plugin allows the delegate to transfer the Asset to another address at any point in time.
---

## Overview

The `Transfer Delegate` Plugin is a `Owner Managed` plugin that allows the authority of the Transfer Delegate Plugin to transfer the Asset at any time.

The Transfer Plugin will work in areas such as:

- Escrowless sale of the Asset: Transfer NFTs directly to buyers without needing an escrow account
- Gaming scenario where the user swaps/loses their asset based on an event: Automatically transfer assets when game events occur
- Rental marketplaces: Transfer NFTs to renters for a specified period
- Automated trading: Execute trades based on predefined conditions
- Subscription services: Transfer NFTs as part of a subscription service

## Works With

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ❌  |

## Arguments

The Transfer Plugin doesn't contain any arguments to pass in.

## Functions

### Add Transfer Delegate Plugin to an Asset

The `addPlugin` command adds the Transfer Delegate Plugin to an Asset. This plugin allows a delegate to transfer the Asset at any time.

{% dialect-switcher title="Adding a Transfer Plugin to an MPL Core Asset" %}
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

### Delegate the Transfer Authority

The `approvePluginAuthority` command delegates the transfer authority to a different address. This allows another address to transfer the Asset while maintaining ownership.

{% dialect-switcher title="Delegate the Transfer Authority" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { approvePluginAuthority } from '@metaplex-foundation/mpl-core'

const asset = publicKey('11111111111111111111111111111111')
const delegateAddress = publicKey('22222222222222222222222222222222')

await approvePluginAuthority(umi, {
  asset: asset.publicKey,
  plugin: { type: 'TransferDelegate' },
  newAuthority: { type: 'Address', address: delegateAddress },
}).sendAndConfirm(umi)
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
        // If the Asset is part of a collection, the collection must be passed in
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

### Transferring an Asset As Delegate

The `transfer` instruction transfers an Asset to another address using the transfer delegate authority.

{% dialect-switcher title="Transfer an MPL Core Asset" %}
{% dialect title="JavaScript" id="js" %}

```ts
import {
  fetchAsset,
  fetchCollection,
  transfer,
} from "@metaplex-foundation/mpl-core";
import { publicKey } from "@metaplex-foundation/umi";

// Asset ID you wish to transfer
const assetId = publicKey("11111111111111111111111111111111");

// Fetch the Asset
const assetItem = await fetchAssetV1(umi, assetId);

// Fetch collection if Asset is apart of collection
const collectionItem =
    assetItem.updateAuthority.type == "Collection" &&
    assetItem.updateAuthority.address
      ? await fetchCollection(umi, assetItem.updateAuthority.address)
      : undefined;

// Transfer the Core NFT Asset
const { signature } = await transfer(umi, {
    asset: assetItem,
    newOwner: publicKey(""),
    collection: collectionItem,
  })
  .sendAndConfirm(umi);
```

{% /dialect %}

{% dialect title="Rust CPI" id="rust-cpi" %}
```rust
TransferV1CpiBuilder::new(&ctx.accounts.core_program.to_account_info())
    .asset(&ctx.accounts.asset.to_account_info())
    .new_owner(&ctx.accounts.new_owner.to_account_info())
    .payer(&ctx.accounts.payer.to_account_info())
    .authority(Some(&ctx.accounts.delegate_authority.to_account_info()))
    .system_program(&ctx.accounts.system_program.to_account_info())
    .invoke()?;
```
{% /dialect %}

{% dialect title="Rust" id="rust" %}
```rust
use mpl_core::instructions::TransferV1Builder;
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn transfer_asset() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let delegate_authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let new_owner = Pubkey::from_str("22222222222222222222222222222222").unwrap();

    let transfer_asset_ix = TransferV1Builder::new()
        .asset(asset)
        .payer(delegate_authority.pubkey())
        .authority(Some(delegate_authority.pubkey()))
        .new_owner(new_owner)
        .instruction();

    let signers = vec![&delegate_authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let transfer_asset_tx = Transaction::new_signed_with_payer(
        &[transfer_asset_ix],
        Some(&delegate_authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&transfer_asset_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```
{% /dialect %}
{% /dialect-switcher %}
