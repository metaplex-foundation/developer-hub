---
title: Permanent Burn Delegate
metaTitle: Permanent Burn Delegate | Metaplex Core
description: Grant permanent burn authority that can destroy Assets even when frozen. Use for game mechanics, subscription expirations, and automated asset lifecycle.
updated: '01-31-2026'
keywords:
  - permanent burn
  - irrevocable burn
  - subscription expiry
  - automated burn
about:
  - Permanent delegation
  - Asset lifecycle
  - Automated destruction
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: What's the difference between Burn Delegate and Permanent Burn Delegate?
    a: Regular Burn Delegate cannot burn frozen Assets and is revoked on transfer. Permanent Burn Delegate can burn frozen Assets (forceApprove) and persists forever.
  - q: Can Permanent Burn Delegate burn frozen Assets?
    a: Yes. Permanent plugins use forceApprove, which overrides freeze rejections. This is useful for game mechanics where items must be destroyable.
  - q: Can I add this to an existing Asset?
    a: No. Permanent plugins can only be added at Asset creation time. Use regular Burn Delegate for existing Assets.
  - q: How does Collection-level Permanent Burn Delegate work?
    a: The delegate can burn any individual Asset in the Collection, but not all at once. Each burn is a separate transaction.
  - q: Is this safe to use?
    a: Use with caution. The delegate can burn Assets at any time without owner approval. Only assign to trusted programs or addresses.
---
The **Permanent Burn Delegate Plugin** provides irrevocable burn authority that persists forever. The delegate can burn Assets even when frozen, making it ideal for games and subscription services. {% .lead %}
{% callout title="What You'll Learn" %}

- Create Assets with permanent burn capability
- Enable collection-wide burn authority
- Burn frozen Assets (`forceApprove` behavior)
- Use cases: games, subscriptions, automated cleanup
{% /callout %}

## Summary

The **Permanent Burn Delegate** is a permanent plugin that can only be added at creation time. The delegate can burn the Asset at any time, even when the Asset is frozen.

- Can only be added at Asset/Collection creation
- Authority persists forever (never revoked)
- Uses `forceApprove` - can burn even when frozen
- Collection-level: allows burning any Asset in the Collection

## Out of Scope

Regular burn delegate (see [Burn Delegate](/smart-contracts/core/plugins/burn-delegate)), conditional burns, and Token Metadata burn authority.

## Quick Start

**Jump to:** [Create Asset](#creating-an-asset-with-a-permanent-burn-plugin)

1. Add `PermanentBurnDelegate` plugin at Asset/Collection creation
2. Set the authority to your program or delegate address
3. The delegate can burn the Asset at any time, even if frozen
{% callout type="note" title="Permanent vs Regular Burn Delegate" %}
| Feature | Burn Delegate | Permanent Burn Delegate |
|---------|---------------|-------------------------|
| Add after creation | ✅ Yes | ❌ Creation only |
| Authority persists on transfer | ❌ Revokes | ✅ Persists forever |
| Can burn frozen Assets | ❌ No | ✅ Yes (forceApprove) |
| Works with Collections | ❌ No | ✅ Yes |
| Emergency destruction | ❌ Limited | ✅ Best choice |
**Choose [Burn Delegate](/smart-contracts/core/plugins/burn-delegate)** for user-revocable burn permissions.
**Choose Permanent Burn Delegate** for games, emergency destruction, or automated cleanup.
{% /callout %}

## Common Use Cases

- **Game mechanics**: Destroy Assets when items are consumed, lost, or destroyed in-game
- **Subscription expiration**: Auto-burn expired subscription tokens even if frozen
- **Emergency destruction**: Remove compromised or unwanted Assets regardless of state
- **Crafting systems**: Burn ingredient NFTs when crafting (even if locked)
- **Time-limited assets**: Automatically destroy expired content
- **Compliance**: Remove Assets that violate terms, even if owner tries to freeze them

## Works With

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

### Behaviours

- **Asset**: Allows burning of the Asset using the delegated address.
- **Collection**: Allows burning of any Asset in the collection using the collection authority. It does not burn all at once.

## Arguments

The Permanent Burn Plugin doesn't contain any arguments to pass in.

## Creating an Asset with a Permanent Burn Plugin

{% dialect-switcher title="Creating an Asset with a Permanent Freeze plugin" %}
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
      type: 'PermanentBurnDelegate',
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
use solana_sdk::{signature::Keypair, signer::Signer, transaction::Transaction};
pub async fn create_asset_with_permanent_burn_delegate_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let payer = Keypair::new();
    let asset = Keypair::new();
    let create_asset_with_permanent_burn_delegate_plugin_ix = CreateV1Builder::new()
        .asset(asset.pubkey())
        .payer(payer.pubkey())
        .name("My Nft".into())
        .uri("https://example.com/my-nft.json".into())
        .plugins(vec![PluginAuthorityPair {
            plugin: Plugin::PermanentBurnDelegate(PermanentBurnDelegate {}),
            authority: Some(PluginAuthority::None),
        }])
        .instruction();
    let signers = vec![&asset, &payer];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let create_asset_with_permanent_burn_delegate_plugin_tx = Transaction::new_signed_with_payer(
        &[create_asset_with_permanent_burn_delegate_plugin_ix],
        Some(&payer.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&create_asset_with_permanent_burn_delegate_plugin_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}

## Common Errors

### `Cannot add permanent plugin after creation`

Permanent plugins can only be added at Asset/Collection creation. You cannot add a Permanent Burn Delegate to an existing Asset.

### `Authority mismatch`

Only the plugin authority can burn. Verify you're signing with the correct keypair.

## Notes

- **On creation only**: Cannot be added after Asset/Collection exists
- **Force approve**: Can burn even when frozen
- **Collection behavior**: Can burn any Asset in the Collection individually
- **Persists forever**: Authority is never revoked
- **Irreversible**: Burned Assets cannot be recovered

## FAQ

### What's the difference between Burn Delegate and Permanent Burn Delegate?

Regular Burn Delegate cannot burn frozen Assets and is revoked on transfer. Permanent Burn Delegate can burn frozen Assets (forceApprove) and persists forever.

### Can Permanent Burn Delegate burn frozen Assets?

Yes. Permanent plugins use `forceApprove`, which overrides freeze rejections. This is useful for game mechanics where items must be destroyable.

### Can I add this to an existing Asset?

No. Permanent plugins can only be added at Asset creation time. Use regular Burn Delegate for existing Assets.

### How does Collection-level Permanent Burn Delegate work?

The delegate can burn any individual Asset in the Collection, but not all at once. Each burn is a separate transaction.

### Is this safe to use?

Use with caution. The delegate can burn Assets at any time without owner approval. Only assign to trusted programs or addresses.

## Related Plugins

- [Burn Delegate](/smart-contracts/core/plugins/burn-delegate) - Revocable burn authority
- [Permanent Freeze Delegate](/smart-contracts/core/plugins/permanent-freeze-delegate) - Permanent freeze authority
- [Permanent Transfer Delegate](/smart-contracts/core/plugins/permanent-transfer-delegate) - Permanent transfer authority

## Glossary

| Term | Definition |
|------|------------|
| **Permanent Plugin** | Plugin that can only be added at creation and persists forever |
| **forceApprove** | Validation that overrides other plugin rejections |
| **Collection Burn** | Ability to burn any Asset in a Collection |
