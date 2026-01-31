---
title: Freeze Delegate
metaTitle: Freeze Delegate Plugin | Metaplex Core
description: Learn how to freeze Core NFT Assets to block transfers and burns. Use the Freeze Delegate plugin for escrowless staking, marketplace listings, and game item locking.
updated: '01-31-2026'
---
The **Freeze Delegate Plugin** allows you to freeze Core Assets, blocking transfers and burns while the asset remains in the owner's wallet. Perfect for escrowless staking, marketplace listings, and game mechanics. {% .lead %}
{% callout title="What You'll Learn" %}
- Add the Freeze Delegate plugin to an Asset
- Freeze and thaw Assets
- Delegate freeze authority to another address
- Use cases: staking, listings, game locking
{% /callout %}
## Summary
The **Freeze Delegate** is an Owner Managed plugin that freezes Assets in place. When frozen, the Asset cannot be transferred or burned until thawed by the freeze authority.
- Freeze Assets without transferring to escrow
- Delegate freeze authority to a program or other wallet
- Authority is revoked on transfer (for non-permanent version)
- Use [Permanent Freeze Delegate](/smart-contracts/core/plugins/permanent-freeze-delegate) for irrevocable freezing
## Out of Scope
Collection-level freezing (use Asset-level only), permanent freezing (see Permanent Freeze Delegate), and Token Metadata freeze authority (different system).
## Quick Start
**Jump to:** [Add Plugin](#add-freeze-delegate-plugin-to-an-asset) · [Delegate Authority](#delegate-the-freeze-authority) · [Freeze](#freezing-an-asset) · [Thaw](#thawing-a-frozen-asset)
1. Add the Freeze Delegate plugin: `addPlugin(umi, { asset, plugin: { type: 'FreezeDelegate', data: { frozen: true } } })`
2. The Asset is now frozen and cannot be transferred
3. Thaw when ready: update the plugin with `frozen: false`
4. Authority is revoked on transfer
{% callout type="note" title="When to Use Freeze vs Permanent Freeze" %}
| Use Case | Freeze Delegate | Permanent Freeze Delegate |
|----------|-----------------|---------------------------|
| Marketplace listings | ✅ Best choice | ❌ Overkill |
| Escrowless staking | ✅ Best choice | ✅ Also works |
| Soulbound tokens | ❌ Revokes on transfer | ✅ Best choice |
| Collection-wide freeze | ❌ Assets only | ✅ Supports Collections |
| Rental protocols | ✅ Best choice | ✅ Also works |
**Choose Freeze Delegate** when authority should reset on ownership change.
**Choose [Permanent Freeze Delegate](/smart-contracts/core/plugins/permanent-freeze-delegate)** when authority must persist forever.
{% /callout %}
## Common Use Cases
- **Escrowless staking**: Freeze NFTs while staked without transferring to escrow
- **Marketplace listings**: Lock NFTs for sale without escrow accounts
- **Game item locking**: Temporarily lock items during gameplay
- **Rental protocols**: Lock NFTs while rented out
- **Governance**: Lock tokens during voting periods
- **Collateral**: Lock NFTs used as lending collateral
- **Tournaments**: Lock NFTs during competition participation
## Works With
|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ❌  |
For collection-level freezing, use [Permanent Freeze Delegate](/smart-contracts/core/plugins/permanent-freeze-delegate) instead.
## Arguments
| Arg    | Value |
| ------ | ----- |
| frozen | bool  |
## Functions
### Add Freeze Delegate Plugin to an Asset
The `addPlugin` command adds the Freeze Delegate Plugin to an Asset. This plugin allows the Asset to be frozen, preventing transfers and burns.
{% dialect-switcher title="Adding a Freeze Plugin to an MPL Core Asset" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { addPlugin } from '@metaplex-foundation/mpl-core'
const assetAddress = publicKey('11111111111111111111111111111111')
await addPlugin(umi, {
  asset: assetAddress,
  plugin: { type: 'FreezeDelegate', data: { frozen: true } },
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
    .plugin(Plugin::FreezeDelegate(FreezeDelegate { frozen: false }))
    .invoke();
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust
use mpl_core::{
    instructions::AddPluginV1Builder,
    types::{FreezeDelegate, Plugin},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn add_freeze_delegate_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let add_freeze_delegate_plugin_ix = AddPluginV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .plugin(Plugin::FreezeDelegate(FreezeDelegate {frozen: true}))
        .instruction();
    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let add_freeze_delegate_plugin_ix_tx = Transaction::new_signed_with_payer(
        &[add_freeze_delegate_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&add_freeze_delegate_plugin_ix_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```
{% /dialect %}
{% /dialect-switcher %}
### Delegate the Freeze Authority
The `approvePluginAuthority` command delegates the freeze authority to a different address. This allows another address to freeze and thaw the Asset while maintaining ownership.
{% dialect-switcher title="Delegate the Freeze Authority" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { approvePluginAuthority } from '@metaplex-foundation/mpl-core'
const asset = publicKey('11111111111111111111111111111111')
const delegateAddress = publicKey('22222222222222222222222222222222')
await approvePluginAuthority(umi, {
  asset: asset.publicKey,
  plugin: { type: 'FreezeDelegate' },
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
    .plugin_type(PluginType::FreezeDelegate)
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
    let approve_plugin_authority_plugin_ix = ApprovePluginAuthorityV1Builder::new()
        .asset(asset)
        // If the Asset is part of a collection, the collection must be passed in
        .collection(Some(collection))
        .authority(Some(authority.pubkey()))
        .payer(authority.pubkey())
        .plugin_type(PluginType::FreezeDelegate)
        .new_authority(PluginAuthority::Address { address: new_authority.pubkey() })
        .instruction();
    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let update_attributes_plugin_tx = Transaction::new_signed_with_payer(
        &[approve_plugin_authority_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&update_attributes_plugin_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res);
}
```
{% /dialect %}
{% /dialect-switcher %}
## Updating the Freeze Delegate Plugin
The Freeze Delegate Plugin can be updated to change the frozen state of the asset. This is the same as using the [Freezing an Asset](#freezing-an-asset) and [Thawing a Frozen Asset](#thawing-a-frozen-asset) functions shown below.
### Freezing an Asset
The `freezeAsset` command freezes an Asset, preventing it from being transferred or burned. This is useful for escrowless staking or marketplace listings.
{% dialect-switcher title="Freeze an MPL Core Asset" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { freezeAsset, fetchAsset } from '@metaplex-foundation/mpl-core'
const assetAddress = publicKey('11111111111111111111111111111111')
const assetAccount = await fetchAsset(umi, assetAddress)
const delegateSigner = generateSigner(umi)
await freezeAsset(umi, {
    asset: assetAccount,
    delegate: delegateSigner.publicKey,
    authority: delegateSigner,
  }).sendAndConfirm(umi)
```
{% /dialect %}
{% dialect title="Rust CPI" id="rust-cpi" %}
```rust
UpdatePluginV1CpiBuilder::new(&ctx.accounts.core_program.to_account_info())
    .asset(&ctx.accounts.asset.to_account_info())
    .collection(Some(&ctx.accounts.collection.to_account_info()))
    .payer(&ctx.accounts.payer.to_account_info())
    .authority(Some(&ctx.accounts.update_authority.to_account_info()))
    .system_program(&ctx.accounts.system_program.to_account_info())
    // Set the FreezeDelegate plugin to `frozen: true`
    .plugin(Plugin::FreezeDelegate(FreezeDelegate { frozen: true }))
    .invoke()?;
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust
use mpl_core::{
    instructions::UpdatePluginV1Builder,
    types::{FreezeDelegate, Plugin},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn update_freeze_delegate_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let collection = Pubkey::from_str("22222222222222222222222222222222").unwrap();
    let update_freeze_delegate_plugin_ix = UpdatePluginV1Builder::new()
        .asset(asset)
        // Pass in Collection if Asset is part of collection
        .collection(Some(collection))
        .payer(authority.pubkey())
        // Set the FreezeDelegate plugin to `frozen: true`
        .plugin(Plugin::FreezeDelegate(FreezeDelegate { frozen: true }))
        .instruction();
    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let update_freeze_delegate_plugin_tx = Transaction::new_signed_with_payer(
        &[update_freeze_delegate_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&update_freeze_delegate_plugin_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res);
}
```
{% /dialect %}
{% /dialect-switcher %}
### Thawing a Frozen Asset
The `thawAsset` command unfreezes a frozen Asset, restoring its ability to be transferred and burned.
{% dialect-switcher title="Thaw an MPL Core Asset" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { thawAsset, fetchAsset } from '@metaplex-foundation/mpl-core'
const assetAddress = publicKey('11111111111111111111111111111111')
const assetAccount = await fetchAsset(umi, assetAddress)
const delegateSigner = generateSigner(umi)
await thawAsset(umi, {
  asset: assetAccount,
  delegate: delegateSigner,
}).sendAndConfirm(umi)
```
{% /dialect %}
{% dialect title="Rust CPI" id="rust-cpi" %}
```rust
UpdatePluginV1CpiBuilder::new(&ctx.accounts.core_program.to_account_info())
    .asset(&ctx.accounts.asset.to_account_info())
    .collection(Some(&ctx.accounts.collection.to_account_info()))
    .payer(&ctx.accounts.payer.to_account_info())
    .authority(Some(&ctx.accounts.update_authority.to_account_info()))
    .system_program(&ctx.accounts.system_program.to_account_info())
    // Set the FreezeDelegate plugin to `frozen: false`
    .plugin(Plugin::FreezeDelegate(FreezeDelegate { frozen: false }))
    .invoke()?;
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust
use mpl_core::{
    instructions::UpdatePluginV1Builder,
    types::{FreezeDelegate, Plugin},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn thaw_freeze_delegate_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let collection = Pubkey::from_str("22222222222222222222222222222222").unwrap();
    let thaw_freeze_delegate_plugin_ix = UpdatePluginV1Builder::new()
        .asset(asset)
        // Pass in Collection if Asset is part of collection
        .collection(Some(collection))
        .payer(authority.pubkey())
        // Set the FreezeDelegate plugin to `frozen: false`
        .plugin(Plugin::FreezeDelegate(FreezeDelegate { frozen: false }))
        .instruction();
    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let thaw_freeze_delegate_plugin_tx = Transaction::new_signed_with_payer(
        &[thaw_freeze_delegate_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&thaw_freeze_delegate_plugin_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res);
}
```
{% /dialect %}
{% /dialect-switcher %}
## Common Errors
### `Asset is frozen`
You tried to transfer or burn a frozen Asset. The freeze authority must thaw it first.
### `Authority mismatch`
Only the freeze delegate authority can freeze/thaw the Asset. Check who has the plugin authority.
### `Plugin not found`
The Asset doesn't have a Freeze Delegate plugin. Add it first with `addPlugin`.
## Notes
- Owner Managed: requires owner signature to add
- Authority is automatically revoked when the Asset transfers
- Frozen Assets can still be updated (metadata changes allowed)
- Use Permanent Freeze Delegate if you need the authority to persist after transfer
- Freezing is immediate - no confirmation period
## Quick Reference
### Freeze States
| State | Can Transfer | Can Burn | Can Update |
|-------|--------------|----------|------------|
| Unfrozen | Yes | Yes | Yes |
| Frozen | No | No | Yes |
### Authority Behavior
| Event | Authority Result |
|-------|------------------|
| Asset transfers | Authority revoked |
| Plugin removed | Authority gone |
| Thaw | Authority retained |
## FAQ
### Can I freeze an Asset I don't own?
No. The Freeze Delegate is Owner Managed, so only the owner can add it. After adding, you can delegate authority to another address.
### What's the difference between Freeze Delegate and Permanent Freeze Delegate?
Freeze Delegate authority is revoked on transfer. Permanent Freeze Delegate authority persists forever and can only be added at creation time.
### Can a frozen Asset be burned?
No. Frozen Assets block both transfers and burns. Thaw the Asset first if you want to burn it.
### Can I freeze an entire Collection at once?
Not with the regular Freeze Delegate (Assets only). Use [Permanent Freeze Delegate](/smart-contracts/core/plugins/permanent-freeze-delegate) on the Collection instead - it supports collection-level freezing and will freeze all Assets in that Collection at once. Note that Permanent Freeze Delegate can only be added at Collection creation time.
### Does freezing affect metadata updates?
No. The Asset owner or update authority can still update metadata (name, URI) while frozen. Only transfers and burns are blocked.
### How do I implement escrowless staking?
1. Add Freeze Delegate plugin with your staking program as authority
2. When user stakes: freeze the Asset
3. When user unstakes: thaw the Asset
4. The NFT never leaves the user's wallet
## Related Plugins
- [Permanent Freeze Delegate](/smart-contracts/core/plugins/permanent-freeze-delegate) - Irrevocable freeze authority, supports Collections
- [Transfer Delegate](/smart-contracts/core/plugins/transfer-delegate) - Allow delegate to transfer Assets
- [Burn Delegate](/smart-contracts/core/plugins/burn-delegate) - Allow delegate to burn Assets
## Glossary
| Term | Definition |
|------|------------|
| **Freeze Delegate** | Owner Managed plugin that blocks transfers and burns |
| **Frozen** | Asset state where transfers and burns are blocked |
| **Thaw** | Unfreezing an Asset to allow transfers again |
| **Delegate Authority** | The account authorized to freeze/thaw the Asset |
| **Escrowless** | Staking/listing without transferring to a holding account |
| **Owner Managed** | Plugin type requiring owner signature to add |
