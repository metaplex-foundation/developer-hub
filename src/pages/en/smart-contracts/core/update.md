---
title: Updating Assets
metaTitle: Updating Assets | Metaplex Core
description: Learn how to update Core NFT Asset metadata on Solana. Change name, URI, collection membership, and make assets immutable using the Metaplex Core SDK.
updated: '04-17-2026'
keywords:
  - update NFT
  - change metadata
  - NFT metadata
  - mpl-core update
  - immutable NFT
  - add to collection
  - remove from collection
  - change collection
about:
  - NFT metadata
  - Update authority
  - Asset immutability
proficiencyLevel: Beginner
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
cli: /dev-tools/cli/core/update-asset
howToSteps:
  - Install SDK with npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi
  - Fetch the Asset to get current state
  - Call update(umi, { asset, name, uri }) with new values
  - Verify changes with fetchAsset()
howToTools:
  - Node.js
  - Umi framework
  - mpl-core SDK
faqs:
  - q: Can I undo making an Asset immutable?
    a: No. Setting the update authority to None is permanent. The Asset's name, URI, and collection membership are frozen forever.
  - q: How do I update only the name without changing the URI?
    a: Pass only the fields you want to change. Omit uri to keep the current value.
  - q: What's the difference between updating and transferring?
    a: Update changes the Asset's metadata (name, URI). Transfer changes ownership. They're separate operations with different authority requirements.
  - q: Can a delegate update an Asset?
    a: Yes, if they have been assigned as an Update Delegate via the Update Delegate plugin.
  - q: Does updating cost SOL?
    a: Updates are free unless the new data is larger than the current account size. The transaction fee (~0.000005 SOL) still applies.
  - q: Can I add a standalone Asset to a Collection after creation?
    a: Yes. Use the update instruction with newCollection and set newUpdateAuthority to the Collection type. You need authority on both the Asset and the target Collection.
  - q: Can I remove an Asset from a Collection?
    a: Yes. Use the update instruction and set newUpdateAuthority to an Address type (your wallet). This detaches the Asset and makes it standalone again.
---
This guide shows how to **update Core Asset metadata** on Solana using the Metaplex Core SDK. Modify the name, URI, or collection membership of Assets you control. {% .lead %}
{% callout title="What You'll Learn" %}
- Update Asset name and metadata URI
- Add a standalone Asset to a Collection
- Move an Asset between Collections or remove it from a Collection
- Make an Asset immutable (permanent)
{% /callout %}
## Summary
Update a Core Asset's metadata using the `update` instruction. Only the update authority (or an authorized delegate) can modify an Asset.
- Change `name` and `uri` to update metadata
- Use `newCollection` and `newUpdateAuthority` to add, move, or remove Assets from Collections
- Set `updateAuthority` to `None` to make immutable
- Updates are free (no rent cost) unless changing account size
## Out of Scope
Updating Token Metadata NFTs (use mpl-token-metadata), plugin modifications (see [Plugins](/smart-contracts/core/plugins)), and ownership transfers (see [Transferring Assets](/smart-contracts/core/transfer)).
## Quick Start
**Jump to:** [Update Asset](#updating-a-core-asset) · [Add to Collection](#add-an-asset-to-a-collection) · [Change Collection](#change-the-collection-of-a-core-asset) · [Remove from Collection](#remove-an-asset-from-a-collection) · [Make Immutable](#making-a-core-asset-data-immutable)
1. Install: `npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi`
2. Fetch the Asset to get current state
3. Call `update(umi, { asset, name, uri })` with new values
4. Verify changes with `fetchAsset()`
## Prerequisites
- **Umi** configured with a signer that is the Asset's update authority
- **Asset address** of the Asset to update
- **New metadata** uploaded to Arweave/IPFS (if changing URI)
The update authority or delegate of a Core Asset has the ability to change some of the Asset's data.
{% totem %}
{% totem-accordion title="Technical Instruction Details" %}
**Instruction Accounts List**
| Account            | Description                                     |
| ------------------ | ----------------------------------------------- |
| asset              | The address of the MPL Core Asset.              |
| collection         | The collection to which the Core Asset belongs. |
| payer              | The account paying for the storage fees.        |
| authority          | The owner or delegate of the asset.             |
| newUpdateAuthority | The new update authority of the asset.          |
| systemProgram      | The System Program account.                     |
| logWrapper         | The SPL Noop Program.                           |
**Instruction Arguments**
| Args    | Description                      |
| ------- | -------------------------------- |
| newName | The new name of your Core Asset. |
| newUri  | The new off-chain metadata URI.  |
Some of the accounts/args may be abstracted out and/or optional in our sdks for ease of use.
A full detailed look at the on chain instruction it can be viewed here. [Github](https://github.com/metaplex-foundation/mpl-core/blob/5a45f7b891f2ca58ad1fc18e0ebdd0556ad59a4b/clients/rust/src/generated/instructions/update_v1.rs#L126)
{% /totem-accordion %}
{% /totem %}
## Updating a Core Asset
Here is how you can use our SDKs to update an MPL Core Asset.
{% code-tabs-imported from="core/update-asset" frameworks="umi" /%}
## Add an Asset to a Collection

The `update` instruction can add a standalone Asset to a [Collection](/smart-contracts/core/collections) by setting `newCollection` to the target Collection address and `newUpdateAuthority` to the `Collection` type. The caller must be the update authority of both the Asset and the target Collection.

{% code-tabs-imported from="core/add-to-collection" frameworks="umi,cli" /%}

{% callout type="note" %}
You can also add an Asset to a Collection using the [Metaplex CLI](/dev-tools/cli/core/update-asset#add-an-asset-to-a-collection): `mplx core collection add <collectionId> <assetId>`
{% /callout %}

## Change the Collection of a Core Asset
The `update` instruction can move an Asset from one Collection to another.
{% code-tabs-imported from="core/change-collection" frameworks="umi,cli" /%}
## Remove an Asset from a Collection

The `update` instruction can remove an Asset from its current [Collection](/smart-contracts/core/collections) by changing the `newUpdateAuthority` from `Collection` to `Address`. This makes the Asset standalone again, with your wallet as its direct update authority.

{% code-tabs-imported from="core/remove-from-collection" frameworks="umi,cli" /%}

{% callout type="note" %}
After removal, the Asset's update authority becomes the address you specified (typically your wallet). The Asset is no longer subject to any collection-level plugins.
{% /callout %}

{% callout type="note" %}
You can also manage collection membership using the [Metaplex CLI](/dev-tools/cli/core/update-asset#manage-collection-membership): `mplx core asset update <assetId> --remove-collection`
{% /callout %}

## Making a Core Asset Data Immutable
Here is how you can use our SDKs to make a Core Asset fully immutable. Be aware that there are different levels of immutability described in the [immutability Guide](/smart-contracts/core/guides/immutability).
{% callout type="warning" title="Important" %}
This is a destructive action and will remove the ability to update the asset.
It will also remove the asset from any collections it was in. To make collection assets immutable you will need to change the update authority of the collection.
{% /callout %}
{% dialect-switcher title="Make a Core Asset Immutable" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { update, fetchAsset } from '@metaplex-foundation/mpl-core'
const assetId = publicKey('11111111111111111111111111111111')
const asset = await fetchAsset(umi, asset)
await update(umi, {
  asset: asset,
  newUpdateAuthority: updateAuthority('None'),
}).sendAndConfirm(umi)
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust
use mpl_core::{instructions::UpdateV1Builder, types::UpdateAuthority};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn update_asset_data_to_immutable() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let update_asset_ix = UpdateV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .new_update_authority(UpdateAuthority::None)
        .instruction();
    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let update_asset_tx = Transaction::new_signed_with_payer(
        &[update_asset_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&update_asset_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```
{% /dialect %}
{% /dialect-switcher %}
## Common Errors
### `Authority mismatch`
You're not the update authority of the Asset. Check:
```ts
const asset = await fetchAsset(umi, assetAddress)
console.log(asset.updateAuthority) // Must match your signer
```
### `Collection authority required`
When changing Collections, you need authority on both the Asset and the target Collection.
### `Asset is immutable`
The Asset's update authority is set to `None`. This cannot be reversed.
## Notes
- Fetch the Asset before updating to ensure you have the current state
- Only the update authority (or delegate) can update an Asset
- Making an Asset immutable is **permanent and irreversible**
- Adding, moving, or removing Collection membership changes which plugins (royalties, etc.) apply to the Asset
- Removing an Asset from a Collection changes its update authority from the Collection to a wallet address
- Adding an Asset to a Collection changes its update authority from a wallet address to the Collection
- Updates don't change the Asset's owner
## Quick Reference
### Update Parameters
| Parameter | Description |
|-----------|-------------|
| `asset` | The Asset to update (address or fetched object) |
| `name` | New name for the Asset |
| `uri` | New metadata URI |
| `newCollection` | Target Collection address |
| `newUpdateAuthority` | New authority (or `None` for immutable) |
### Authority Types
| Type | Description |
|------|-------------|
| `Address` | A specific public key |
| `Collection` | The Collection's update authority |
| `None` | Immutable - no updates allowed |
## FAQ
### Can I undo making an Asset immutable?
No. Setting the update authority to `None` is permanent. The Asset's name, URI, and collection membership are frozen forever. Only do this when you're certain.
### How do I update only the name without changing the URI?
Pass only the fields you want to change. Omit `uri` to keep the current value:
```ts
await update(umi, { asset, name: 'New Name' }).sendAndConfirm(umi)
```
### What's the difference between updating and transferring?
Update changes the Asset's metadata (name, URI). Transfer changes ownership. They're separate operations with different authority requirements.
### Can a delegate update an Asset?
Yes, if they have been assigned as an Update Delegate via the [Update Delegate plugin](/smart-contracts/core/plugins/update-delegate).
### Does updating cost SOL?
Updates are free unless the new data is larger than the current account size (rare). The transaction fee (~0.000005 SOL) still applies.
### Can I add a standalone Asset to a Collection after creation?
Yes. Use the `update` instruction with `newCollection` and set `newUpdateAuthority` to the `Collection` type. You need authority on both the Asset and the target Collection. See [Add an Asset to a Collection](#add-an-asset-to-a-collection).
### Can I remove an Asset from a Collection?
Yes. Use the `update` instruction and set `newUpdateAuthority` to `updateAuthority('Address', [yourWallet])`. This detaches the Asset from the Collection and makes it standalone again. See [Remove an Asset from a Collection](#remove-an-asset-from-a-collection).
## Glossary
| Term | Definition |
|------|------------|
| **Update Authority** | The account authorized to modify an Asset's metadata |
| **Immutable** | An Asset that cannot be updated (update authority is None) |
| **URI** | The URL pointing to off-chain metadata JSON |
| **Delegate** | An account granted specific permissions via a plugin |
| **Collection Membership** | The Collection an Asset belongs to |
