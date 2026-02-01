---
title: Burning Assets
metaTitle: Burning Assets | Metaplex Core
description: Learn how to burn Core NFT Assets on Solana. Permanently destroy Assets and recover rent using the Metaplex Core SDK.
created: '06-15-2024'
updated: '01-31-2026'
keywords:
  - burn NFT
  - destroy asset
  - recover rent
  - Solana NFT
  - mpl-core burn
about:
  - NFT burning
  - Rent recovery
  - Asset destruction
proficiencyLevel: Beginner
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
howToSteps:
  - Install the SDK with npm install @metaplex-foundation/mpl-core
  - Fetch the Asset to verify ownership
  - Call burn(umi, { asset }) as the owner
  - Rent is automatically returned to your wallet
howToTools:
  - Node.js
  - Umi framework
  - mpl-core SDK
faqs:
  - q: Can I recover the ~0.0009 SOL left in the account?
    a: No. This small amount is intentionally left to mark the account as burned and prevent address reuse.
  - q: What happens to the Asset's metadata after burning?
    a: The on-chain account is cleared. Off-chain metadata on Arweave/IPFS remains accessible but has no on-chain link.
  - q: Can a Burn Delegate burn without owner approval?
    a: Yes. Once assigned, a Burn Delegate can burn the Asset at any time. Only assign trusted addresses.
  - q: Does burning affect the Collection's count?
    a: Yes. The Collection's currentSize decrements. The numMinted counter stays unchanged.
  - q: Can I burn multiple Assets at once?
    a: Not in a single instruction. You can batch multiple burn instructions in one transaction up to size limits.
---
This guide shows how to **burn Core Assets** on Solana using the Metaplex Core SDK. Permanently destroy Assets and recover most of the rent deposit. {% .lead %}
{% callout title="What You'll Learn" %}
- Burn an Asset and recover rent
- Handle burning for Assets in Collections
- Understand Burn Delegate permissions
- Know what happens to the account after burning
{% /callout %}
## Summary
Burn a Core Asset to permanently destroy it and recover rent. Only the owner (or Burn Delegate) can burn an Asset.
- Call `burn(umi, { asset })` to destroy the Asset
- Most rent (~0.0028 SOL) is returned to the payer
- A small amount (~0.0009 SOL) remains to prevent account reuse
- Burning is **permanent and irreversible**
## Out of Scope
Token Metadata burning (use mpl-token-metadata), compressed NFT burning (use Bubblegum), and Collection burning (Collections have their own burn process).
## Quick Start
**Jump to:** [Burn Asset](#code-example) · [Burn in Collection](#burning-an-asset-that-is-part-of-a-collection)
1. Install: `npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi`
2. Fetch the Asset to verify ownership
3. Call `burn(umi, { asset })` as the owner
4. Rent is automatically returned to your wallet
## Prerequisites
- **Umi** configured with a signer that owns the Asset (or is its Burn Delegate)
- **Asset address** of the Asset to burn
- **Collection address** (if the Asset is in a Collection)
Assets can be burnt using the `burn` instruction. This will return the rent-exempt fees to the owner. Only a very small amount of SOL (0.00089784) will stay in the account to prevent it from being reopened.
{% totem %}
{% totem-accordion title="Technical Instruction Details" %}
**Instruction Accounts List**
| Account       | Description                                     |
| ------------- | ----------------------------------------------- |
| asset         | The address of the MPL Core Asset.              |
| collection    | The collection to which the Core Asset belongs. |
| payer         | The account paying for the storage fees.        |
| authority     | The owner or delegate of the asset.             |
| systemProgram | The System Program account.                     |
| logWrapper    | The SPL Noop Program.                           |
Some of the accounts may be abstracted out and/or optional in our sdks for ease of use.
A full detailed look at the on chain instruction it can be viewed on [Github](https://github.com/metaplex-foundation/mpl-core/blob/5a45f7b891f2ca58ad1fc18e0ebdd0556ad59a4b/programs/mpl-core/src/instruction.rs#L123).
{% /totem-accordion %}
{% /totem %}
## Code Example
Here is how you can use our SDKs to burn a Core asset. The snippet assumes that you are the owner of the asset.
{% code-tabs-imported from="core/burn-asset" frameworks="umi" /%}
## Burning an Asset that is part of a Collection
Here is how you can use our SDKs to burn a Core asset that is part of a collection. The snippet assumes that you are the owner of the asset.
{% dialect-switcher title="Burning an Asset that is part of a collection" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import {
  burn,
  fetchAsset,
  collectionAddress,
  fetchCollection,
} from '@metaplex-foundation/mpl-core'

const assetId = publicKey('11111111111111111111111111111111')
const asset = await fetchAsset(umi, assetId)
const collectionId = collectionAddress(asset)

let collection = undefined
if (collectionId) {
  collection = await fetchCollection(umi, collectionId)
}

await burn(umi, {
  asset,
  collection,
}).sendAndConfirm(umi)
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust
use mpl_core::instructions::BurnV1Builder;
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn burn_asset_in_collection() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let collection = Pubkey::from_str("2222222222222222222222222222222").unwrap();
    let burn_asset_in_collection_ix = BurnV1Builder::new()
        .asset(asset)
        .collection(Some(collection))
        .payer(authority.pubkey())
        .instruction();
    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let burn_asset_in_collection_tx = Transaction::new_signed_with_payer(
        &[burn_asset_in_collection_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&burn_asset_in_collection_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```
{% /dialect %}
{% /dialect-switcher %}
## Common Errors
### `Authority mismatch`
You're not the owner or Burn Delegate of the Asset. Check ownership:
```ts
const asset = await fetchAsset(umi, assetAddress)
console.log(asset.owner) // Must match your signer
```
### `Asset is frozen`
The Asset has a Freeze Delegate plugin and is currently frozen. The freeze authority must unfreeze it before burning.
### `Missing collection parameter`
For Assets in a Collection, you must pass the `collection` address. Fetch the Asset first to get the collection:
```ts
const asset = await fetchAsset(umi, assetAddress)
const collectionId = collectionAddress(asset)
```
## Notes
- Burning is **permanent and irreversible** - the Asset cannot be recovered
- ~0.0028 SOL is returned from rent, but ~0.0009 SOL stays in the account
- The remaining SOL prevents the account address from being reused
- Burn Delegates can burn on behalf of owners (via the Burn Delegate plugin)
- Frozen Assets must be unfrozen before burning
## Quick Reference
### Burn Parameters
| Parameter | Required | Description |
|-----------|----------|-------------|
| `asset` | Yes | Asset address or fetched object |
| `collection` | If in collection | Collection address |
| `authority` | No | Defaults to signer (use for delegates) |
### Who Can Burn?
| Authority | Can Burn? |
|-----------|-----------|
| Asset Owner | Yes |
| Burn Delegate | Yes |
| Transfer Delegate | No |
| Update Authority | No |
### Rent Recovery
| Item | Amount |
|------|--------|
| Returned to payer | ~0.0028 SOL |
| Remaining in account | ~0.0009 SOL |
| **Total original rent** | **~0.0029 SOL** |
## FAQ
### Can I recover the ~0.0009 SOL left in the account?
No. This small amount is intentionally left to mark the account as "burned" and prevent its address from being reused for a new Asset.
### What happens to the Asset's metadata after burning?
The on-chain account is cleared (zeroed out). The off-chain metadata (on Arweave/IPFS) remains accessible via the original URI, but there's no on-chain record linking to it.
### Can a Burn Delegate burn without the owner's approval?
Yes. Once an owner assigns a Burn Delegate via the plugin, the delegate can burn the Asset at any time. Owners should only assign trusted addresses as Burn Delegates.
### Does burning affect the Collection's count?
Yes. The Collection's `currentSize` is decremented when an Asset is burned. The `numMinted` counter remains unchanged (it tracks total ever minted).
### Can I burn multiple Assets at once?
Not in a single instruction. You can batch multiple burn instructions in one transaction (up to transaction size limits).
## Glossary
| Term | Definition |
|------|------------|
| **Burn** | Permanently destroy an Asset and recover rent |
| **Burn Delegate** | An account authorized to burn on behalf of the owner |
| **Rent** | SOL deposited to keep an account alive on Solana |
| **Frozen** | An Asset state where burns and transfers are blocked |
| **Collection** | A group account that the Asset may belong to |
