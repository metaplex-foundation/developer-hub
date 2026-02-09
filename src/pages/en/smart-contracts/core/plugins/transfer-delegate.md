---
title: Transfer Delegate Plugin
metaTitle: Transfer Delegate Plugin | Metaplex Core
description: Allow a delegate to transfer Core NFT Assets. Use the Transfer Delegate plugin for escrowless sales, game mechanics, and marketplace listings.
updated: '01-31-2026'
keywords:
  - transfer delegate
  - delegate transfer
  - escrowless sale
  - NFT marketplace
about:
  - Transfer delegation
  - Escrowless mechanics
  - Marketplace integration
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: Why was my transfer authority revoked?
    a: Transfer Delegate authority is automatically revoked after any transfer. This is by design for marketplace safety - the delegate can only transfer once.
  - q: How do I implement escrowless listings?
    a: Seller adds Transfer Delegate with marketplace as authority. When buyer pays, marketplace transfers Asset to buyer. Authority is revoked so seller can't double-list.
  - q: What's the difference between Transfer Delegate and Permanent Transfer Delegate?
    a: Transfer Delegate is revoked after one transfer. Permanent Transfer Delegate persists forever and can only be added at Asset creation.
  - q: Can I transfer a frozen Asset as a delegate?
    a: No. Frozen Assets block all transfers including delegate transfers. Use Permanent Transfer Delegate with a Permanent Freeze Delegate for complex escrow scenarios.
  - q: Does the owner need to approve each transfer?
    a: No. Once the Transfer Delegate is set, the delegate can transfer without owner approval. However, they can only do it once before authority is revoked.
---
The **Transfer Delegate Plugin** allows a designated authority to transfer Core Assets on behalf of the owner. Essential for escrowless marketplace sales, game mechanics, and subscription services. {% .lead %}
{% callout title="What You'll Learn" %}
- Add the Transfer Delegate plugin to an Asset
- Delegate transfer authority to a marketplace or program
- Execute transfers as a delegate
- Authority behavior on transfer
{% /callout %}
## Summary
The **Transfer Delegate** is an Owner Managed plugin that allows a delegate to transfer an Asset. Once delegated, the authority can transfer the Asset to any address without owner approval.
- Enable escrowless marketplace listings
- Authority is **revoked after transfer** (one-time use)
- Use [Permanent Transfer Delegate](/smart-contracts/core/plugins/permanent-transfer-delegate) for persistent authority
- No additional arguments required
## Out of Scope
Permanent transfer authority (see Permanent Transfer Delegate), collection-level transfers, and Token Metadata transfer authority (different system).
## Quick Start
**Jump to:** [Add Plugin](#add-transfer-delegate-plugin-to-an-asset) · [Delegate Authority](#delegate-the-transfer-authority) · [Transfer as Delegate](#transferring-an-asset-as-delegate)
1. Add the Transfer Delegate plugin with the delegate address
2. The delegate can now transfer the Asset once
3. After transfer, the authority is automatically revoked
## Overview
The `Transfer Delegate` Plugin is a `Owner Managed` plugin that allows the authority of the Transfer Delegate Plugin to transfer the Asset at any time.
The Transfer Plugin will work in areas such as:
- Escrowless sale of the Asset: Transfer NFTs directly to buyers without needing an escrow account
- Gaming scenario where the user swaps/loses their asset based on an event: Automatically transfer assets when game events occur
- Subscription services: Transfer NFTs as part of a subscription service
{% callout type="note" title="When to Use Transfer vs Permanent Transfer Delegate" %}
| Use Case | Transfer Delegate | Permanent Transfer Delegate |
|----------|-------------------|----------------------------|
| Marketplace listings | ✅ Best choice | ❌ Too risky |
| One-time transfers | ✅ Best choice | ❌ Overkill |
| Rental returns | ❌ Single use | ✅ Best choice |
| Game asset swaps | ✅ Best choice | ✅ Also works |
| Authority persists on transfer | ❌ Revokes | ✅ Persists |
**Choose Transfer Delegate** for one-time escrowless sales (authority revokes after transfer).
**Choose [Permanent Transfer Delegate](/smart-contracts/core/plugins/permanent-transfer-delegate)** when authority must persist forever.
{% /callout %}
{% callout title="Warning!" %}
The transfer delegate authority is temporary and will be reset upon asset transfer.
{% /callout %}
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
const assetItem = await fetchAsset(umi, assetId);
// Fetch collection if Asset is apart of collection
const collectionItem =
    assetItem.updateAuthority.type == "Collection" &&
    assetItem.updateAuthority.address
      ? await fetchCollection(umi, assetItem.updateAuthority.address)
      : undefined;
// Transfer the Core NFT Asset
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
## Updating Transfer Delegate Authority
Since the Transfer Delegate plugin doesn't contain plugin data to update (it's an empty object `{}`), the main "update" operation is changing the plugin authority. This allows you to delegate transfer permissions to different addresses.
### Changing the Transfer Delegate Authority
You can change who has transfer authority using the `approvePluginAuthority` function:
{% dialect-switcher title="Update Transfer Delegate Authority" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { approvePluginAuthority } from '@metaplex-foundation/mpl-core'
(async () => {
    const assetAddress = publicKey('11111111111111111111111111111111')
    const newDelegate = publicKey('44444444444444444444444444444444')
    // Change the transfer delegate to a new address
    await approvePluginAuthority(umi, {
    asset: assetAddress,
    plugin: { type: 'TransferDelegate' },
    newAuthority: { type: 'Address', address: newDelegate },
    }).sendAndConfirm(umi)
})();
```
{% /dialect %}
{% /dialect-switcher %}
### Revoking Transfer Delegate Authority
The transfer authority can be revoked using the `revokePluginAuthority` function, returning transfer control to the asset owner.
{% dialect-switcher title="Revoke Transfer Delegate Authority" %}
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
## Common Errors
### `Authority mismatch`
Only the transfer delegate authority can transfer the Asset. Verify you're signing with the correct keypair.
### `Asset is frozen`
Frozen Assets cannot be transferred. The freeze authority must thaw the Asset first.
### `Transfer delegate not found`
The Asset doesn't have a Transfer Delegate plugin or authority was already revoked after a previous transfer.
## Notes
- Owner Managed: requires owner signature to add
- Authority is **automatically revoked after transfer**
- Each transfer requires re-delegation by the new owner
- Frozen Assets cannot be transferred by delegates
- Use Permanent Transfer Delegate for persistent authority
## Quick Reference
### Authority Lifecycle
| Event | Authority Status |
|-------|------------------|
| Plugin added | Active |
| Asset transferred | **Revoked** |
| New owner adds plugin | Active (new delegate) |
### Who Can Transfer?
| Authority | Can Transfer? |
|-----------|---------------|
| Asset Owner | Yes (always) |
| Transfer Delegate | Yes (once) |
| Permanent Transfer Delegate | Yes (always) |
| Update Authority | No |
## FAQ
### Why was my transfer authority revoked?
Transfer Delegate authority is automatically revoked after any transfer. This is by design for marketplace safety - the delegate can only transfer once.
### How do I implement escrowless listings?
1. Seller adds Transfer Delegate with marketplace as authority
2. When buyer pays, marketplace transfers Asset to buyer
3. Authority is revoked; seller can't double-list
### What's the difference between Transfer Delegate and Permanent Transfer Delegate?
Transfer Delegate is revoked after one transfer. Permanent Transfer Delegate persists forever and can only be added at Asset creation.
### Can I transfer a frozen Asset as a delegate?
No. Frozen Assets block all transfers including delegate transfers. Use Permanent Transfer Delegate with a Permanent Freeze Delegate for complex escrow scenarios.
### Does the owner need to approve each transfer?
No. Once the Transfer Delegate is set, the delegate can transfer without owner approval. However, they can only do it once before authority is revoked.
## Related Plugins
- [Permanent Transfer Delegate](/smart-contracts/core/plugins/permanent-transfer-delegate) - Irrevocable transfer authority
- [Freeze Delegate](/smart-contracts/core/plugins/freeze-delegate) - Block transfers temporarily
- [Burn Delegate](/smart-contracts/core/plugins/burn-delegate) - Allow delegate to burn Assets
## Glossary
| Term | Definition |
|------|------------|
| **Transfer Delegate** | Owner Managed plugin allowing one-time transfer authority |
| **Owner Managed** | Plugin type requiring owner signature to add |
| **Escrowless** | Selling without transferring to a holding account |
| **Permanent Transfer Delegate** | Irrevocable version added at creation |
