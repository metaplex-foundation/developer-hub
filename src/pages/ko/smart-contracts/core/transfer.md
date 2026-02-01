---
title: Transferring Assets
metaTitle: Transferring Assets | Metaplex Core
description: Learn how to transfer Core NFT Assets between wallets on Solana. Send NFTs to other users, handle collection transfers, and use transfer delegates.
updated: '01-31-2026'
keywords:
  - transfer NFT
  - send NFT
  - NFT ownership
  - mpl-core transfer
  - transfer delegate
about:
  - NFT transfers
  - Ownership change
  - Transfer delegates
proficiencyLevel: Beginner
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
howToSteps:
  - Install SDK with npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi
  - Fetch the Asset to verify ownership and collection membership
  - Call transfer(umi, { asset, newOwner }) with the recipient address
  - Verify with fetchAsset() that ownership changed
howToTools:
  - Node.js
  - Umi framework
  - mpl-core SDK
faqs:
  - q: How do I know if an Asset is in a Collection?
    a: Fetch the Asset and check its updateAuthority. If the type is 'Collection', pass the address as the collection parameter.
  - q: Can I transfer to myself?
    a: Yes. Transferring to your own address is valid and useful for consolidating wallets or testing.
  - q: What happens to the Transfer Delegate after a transfer?
    a: The Transfer Delegate plugin is automatically revoked when the transfer completes. The new owner must assign a new delegate if needed.
  - q: Can I cancel a transfer?
    a: No. Transfers are atomic - once the transaction confirms, ownership has changed. There's no pending state to cancel.
  - q: Can I transfer multiple Assets at once?
    a: Not in a single instruction. You can batch multiple transfer instructions in one transaction, but each Asset requires its own transfer call.
  - q: Does transferring change the update authority?
    a: No. Transfer only changes ownership. The update authority remains the same unless explicitly changed via the update instruction.
---
This guide shows how to **transfer Core Assets** between wallets on Solana using the Metaplex Core SDK. Send NFTs to other users with a single instruction. {% .lead %}
{% callout title="What You'll Learn" %}
- Transfer an Asset to a new owner
- Handle transfers for Assets in Collections
- Use Transfer Delegate for authorized transfers
- Understand transfer authority requirements
{% /callout %}
## Summary
Transfer a Core Asset to a new owner using the `transfer` instruction. Only the current owner (or an authorized Transfer Delegate) can initiate a transfer.
- Call `transfer(umi, { asset, newOwner })` with the recipient's address
- For Collection Assets, include the `collection` parameter
- Transfer Delegates can transfer on behalf of owners
- Transfers are free (only transaction fee applies)
## Out of Scope
Token Metadata transfers (use mpl-token-metadata), batch transfers (loop through Assets), and marketplace sales (use escrow programs).
## Quick Start
**Jump to:** [Basic Transfer](#transferring-a-core-asset) · [Collection Transfer](#transferring-a-core-asset-in-a-collection) · [Delegate Transfer](#what-if-i-am-the-transfer-delegate-of-an-asset)
1. Install: `npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi`
2. Fetch the Asset to verify ownership and collection membership
3. Call `transfer(umi, { asset, newOwner })`
4. Verify with `fetchAsset()` that ownership changed
## Prerequisites
- **Umi** configured with a signer that owns the Asset (or is its Transfer Delegate)
- **Asset address** of the Asset to transfer
- **Recipient address** (public key) of the new owner
The owner of a Core Asset can transfer ownership to another account by using the `transfer` instruction to the MPL Core program.
{% totem %}
{% totem-accordion title="Technical Instruction Details" %}
**Instruction Accounts List**
| Account       | Description                                     |
| ------------- | ----------------------------------------------- |
| asset         | The address of the MPL Core Asset.              |
| collection    | The collection to which the Core Asset belongs. |
| authority     | The owner or delegate of the asset.             |
| payer         | The account paying for the storage fees.        |
| newOwner      | The new owner to which to transfer the asset.   |
| systemProgram | The System Program account.                     |
| logWrapper    | The SPL Noop Program.                           |
Some of the accounts may be abstracted out and/or optional in our sdks for ease of use.
A full detailed look at the on chain instruction it can be viewed on [Github](https://github.com/metaplex-foundation/mpl-core/blob/5a45f7b891f2ca58ad1fc18e0ebdd0556ad59a4b/programs/mpl-core/src/instruction.rs#L139).
{% /totem-accordion %}
{% /totem %}
## Transferring a Core Asset
{% code-tabs-imported from="core/transfer-asset" frameworks="umi" /%}
## Transferring a Core Asset in a Collection
If you are transferring an Asset which has a collection you will need to pass the collection address in.
[How to tell if an asset is in a Collection?]()
{% dialect-switcher title="Transfer an Asset that is part of a Collection" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { transferV1 } from '@metaplex-foundation/mpl-core'
const asset = publicKey('11111111111111111111111111111111')
await transferV1(umi, {
  asset: asset.publicKey,
  newOwner: newOwner.publicKey,
  collection: colleciton.publicKey,
}).sendAndConfirm(umi)
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust
use mpl_core::instructions::TransferV1Builder;
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn transfer_asset_in_collection() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let collection = Pubkey::from_str("22222222222222222222222222222222").unwrap();
    let new_owner = Pubkey::from_str("33333333333333333333333333333333").unwrap();
    let transfer_asset_in_collection_ix = TransferV1Builder::new()
        .asset(asset)
        .collection(Some(collection))
        .payer(authority.pubkey())
        .new_owner(new_owner)
        .instruction();
    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let transfer_asset_in_collection_tx = Transaction::new_signed_with_payer(
        &[transfer_asset_in_collection_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&transfer_asset_in_collection_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```
{% /dialect %}
{% /dialect-switcher %}
## What if I am the Transfer Delegate of an Asset?
If you are the Transfer Delegate of an Asset via the [Transfer Delegate](/smart-contracts/core/plugins/transfer-delegate) plugin then you can call the `transferV1` function as you would if you were the owner of the Asset.
## Common Errors
### `Authority mismatch`
You're not the owner or Transfer Delegate of the Asset. Check ownership:
```ts
const asset = await fetchAsset(umi, assetAddress)
console.log(asset.owner) // Must match your signer
```
### `Asset is frozen`
The Asset has a Freeze Delegate plugin and is currently frozen. The freeze authority must unfreeze it before transfer.
### `Missing collection parameter`
For Assets in a Collection, you must pass the `collection` address. Check if the Asset has a collection:
```ts
const asset = await fetchAsset(umi, assetAddress)
if (asset.updateAuthority.type === 'Collection') {
  console.log('Collection:', asset.updateAuthority.address)
}
```
## Notes
- Transfers are **free** - no rent cost, only the transaction fee (~0.000005 SOL)
- The new owner receives full control of the Asset
- Transfer Delegates are revoked after a successful transfer
- Frozen Assets cannot be transferred until unfrozen
- Always fetch the Asset first to check collection membership
## Quick Reference
### Transfer Parameters
| Parameter | Required | Description |
|-----------|----------|-------------|
| `asset` | Yes | Asset address or fetched object |
| `newOwner` | Yes | Recipient's public key |
| `collection` | If in collection | Collection address |
| `authority` | No | Defaults to signer (use for delegates) |
### Who Can Transfer?
| Authority | Can Transfer? |
|-----------|---------------|
| Asset Owner | Yes |
| Transfer Delegate | Yes (revoked after) |
| Update Authority | No |
| Collection Authority | No |
## FAQ
### How do I know if an Asset is in a Collection?
Fetch the Asset and check its `updateAuthority`:
```ts
const asset = await fetchAsset(umi, assetAddress)
if (asset.updateAuthority.type === 'Collection') {
  // Pass asset.updateAuthority.address as collection parameter
}
```
### Can I transfer to myself?
Yes. Transferring to your own address is valid (useful for consolidating wallets or testing).
### What happens to the Transfer Delegate after a transfer?
The Transfer Delegate plugin is automatically revoked when the transfer completes. The new owner must assign a new delegate if needed.
### Can I cancel a transfer?
No. Transfers are atomic - once the transaction confirms, ownership has changed. There's no pending state to cancel.
### Can I transfer multiple Assets at once?
Not in a single instruction. You can batch multiple transfer instructions in one transaction (up to transaction size limits), but each Asset requires its own transfer call.
### Does transferring change the update authority?
No. Transfer only changes ownership. The update authority remains the same unless explicitly changed via the `update` instruction.
## Glossary
| Term | Definition |
|------|------------|
| **Owner** | The wallet that currently owns the Asset |
| **Transfer Delegate** | An account authorized to transfer on behalf of the owner |
| **Frozen** | An Asset state where transfers are blocked |
| **New Owner** | The recipient wallet receiving the Asset |
| **Collection** | The Collection an Asset belongs to (affects transfer requirements) |
