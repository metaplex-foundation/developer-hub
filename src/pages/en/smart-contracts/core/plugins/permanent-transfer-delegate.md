---
title: Permanent Transfer Delegate
metaTitle: Permanent Transfer Delegate | Metaplex Core
description: Grant permanent transfer authority that persists across ownership changes. Use for game mechanics, subscription services, and automated asset management.
---

The **Permanent Transfer Delegate Plugin** provides irrevocable transfer authority that persists forever. Unlike regular Transfer Delegate, this authority is never revoked and can transfer Assets repeatedly. {% .lead %}

{% callout title="What You'll Learn" %}

- Create Assets with permanent transfer capability
- Enable collection-wide transfer authority
- Use cases: games, subscriptions, automated systems
- Understand permanent vs regular transfer delegate

{% /callout %}

## Summary

The **Permanent Transfer Delegate** is a permanent plugin that can only be added at creation time. The delegate can transfer the Asset unlimited times without owner approval.

- Can only be added at Asset/Collection creation
- Authority persists forever (never revoked)
- Uses `forceApprove` - can transfer even when frozen
- Collection-level: allows transfer of any Asset in the Collection

## Out of Scope

Regular transfer delegate (see [Transfer Delegate](/smart-contracts/core/plugins/transfer-delegate)), escrowless listings (use regular delegate), and Token Metadata transfer authority.

## Quick Start

**Jump to:** [Create Asset](#creating-a-mpl-core-asset-with-a-permanent-transfer-plugin)

1. Add `PermanentTransferDelegate` plugin at Asset/Collection creation
2. Set the authority to your program or delegate address
3. The delegate can transfer the Asset at any time, unlimited times

{% callout type="note" title="Permanent vs Regular Transfer Delegate" %}

| Feature | Transfer Delegate | Permanent Transfer Delegate |
|---------|-------------------|----------------------------|
| Add after creation | ✅ Yes | ❌ Creation only |
| Authority persists on transfer | ❌ Revokes after 1 transfer | ✅ Persists forever |
| Multiple transfers | ❌ One-time | ✅ Unlimited |
| Can transfer frozen Assets | ❌ No | ✅ Yes (forceApprove) |
| Works with Collections | ❌ No | ✅ Yes |

**Choose [Transfer Delegate](/smart-contracts/core/plugins/transfer-delegate)** for one-time escrowless sales.
**Choose Permanent Transfer Delegate** for games, rentals, or automated systems needing repeated transfers.

{% /callout %}

## Common Use Cases

- **Game mechanics**: Transfer Assets when game events occur (losing battles, trading)
- **Rental returns**: Automatically return rented NFTs to the owner
- **Subscription management**: Transfer tokens when subscriptions end or renew
- **DAO treasury management**: Allow DAOs to manage Asset distribution
- **Automated systems**: Programs that need to move Assets without per-transfer approval

## Works With

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

### Behaviours
- **Asset**: Allows transferring of the Asset using the delegated address.
- **Collection**: Allows transferring of any Asset in the collection using the collection authority. It does not transfer all at once.

## Arguments

| Arg    | Value |
| ------ | ----- |
| frozen | bool  |

## Creating a MPL Core Asset with a Permanent Transfer Plugin

{% dialect-switcher title="Creating a MPL Core Asset with a Permanent Transfer Plugin" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { create } from '@metaplex-foundation/mpl-core'

const assetSigner = generateSigner(umi)
const delegate = publicKey('33333333333333333333333333333')

await create(umi, {
  asset: assetSigner,
  name: 'My Asset',
  uri: 'https://example.com/my-asset.json',
  plugins: [
    {
      type: 'PermanentTransferDelegate',
      authority: { type: 'Address', address: delegate },
    },
  ],
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{
    instructions::CreateV1Builder,
    types::{PermanentBurnDelegate, Plugin, PluginAuthority, PluginAuthorityPair},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn create_asset_with_permanent_burn_delegate_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let payer = Keypair::new();
    let asset = Keypair::new();

    let delegate = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let create_asset_with_burn_transfer_delegate_plugin_ix = CreateV1Builder::new()
        .asset(asset.pubkey())
        .payer(payer.pubkey())
        .name("My Nft".into())
        .uri("https://example.com/my-nft.json".into())
        .plugins(vec![PluginAuthorityPair {
            plugin: Plugin::PermanentBurnDelegate(PermanentBurnDelegate {}),
            authority: Some(PluginAuthority::Address { address: delegate }),
        }])
        .instruction();

    let signers = vec![&asset, &payer];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let create_asset_with_burn_transfer_delegate_plugin_tx = Transaction::new_signed_with_payer(
        &[create_asset_with_burn_transfer_delegate_plugin_ix],
        Some(&payer.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&create_asset_with_burn_transfer_delegate_plugin_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}

## Common Errors

### `Cannot add permanent plugin after creation`

Permanent plugins can only be added at Asset/Collection creation. You cannot add a Permanent Transfer Delegate to an existing Asset.

### `Authority mismatch`

Only the plugin authority can transfer. Verify you're signing with the correct keypair.

## Notes

- **Creation only**: Cannot be added after Asset/Collection exists
- **Force approve**: Can transfer even when frozen
- **Collection behavior**: Can transfer any Asset in the Collection individually
- **Persists forever**: Authority is never revoked
- **Unlimited transfers**: No limit on how many times the delegate can transfer

## FAQ

### What's the difference between Transfer Delegate and Permanent Transfer Delegate?

Regular Transfer Delegate is revoked after one transfer. Permanent Transfer Delegate persists forever and can transfer unlimited times.

### Can Permanent Transfer Delegate transfer frozen Assets?

Yes. Permanent plugins use `forceApprove`, which overrides freeze rejections.

### Can I add this to an existing Asset?

No. Permanent plugins can only be added at Asset creation time. Use regular Transfer Delegate for existing Assets.

### How does Collection-level Permanent Transfer Delegate work?

The delegate can transfer any individual Asset in the Collection, but not all at once. Each transfer is a separate transaction.

## Related Plugins

- [Transfer Delegate](/smart-contracts/core/plugins/transfer-delegate) - One-time transfer authority
- [Permanent Freeze Delegate](/smart-contracts/core/plugins/permanent-freeze-delegate) - Permanent freeze authority
- [Permanent Burn Delegate](/smart-contracts/core/plugins/permanent-burn-delegate) - Permanent burn authority

## Glossary

| Term | Definition |
|------|------------|
| **Permanent Plugin** | Plugin that can only be added at creation and persists forever |
| **forceApprove** | Validation that overrides other plugin rejections |
| **Collection Transfer** | Ability to transfer any Asset in a Collection |

---

*Maintained by Metaplex Foundation · Last verified January 2026 · Applies to @metaplex-foundation/mpl-core*
