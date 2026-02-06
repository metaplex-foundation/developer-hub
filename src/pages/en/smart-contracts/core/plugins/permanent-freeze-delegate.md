---
title: Permanent Freeze Delegate
metaTitle: Permanent Freeze Delegate | Metaplex Core
description: Create soulbound NFTs and freeze entire Collections with the Permanent Freeze Delegate plugin. Irrevocable freeze authority that persists forever.
updated: '01-31-2026'
keywords:
  - soulbound NFT
  - permanent freeze
  - non-transferable NFT
  - collection freeze
about:
  - Soulbound tokens
  - Permanent plugins
  - Collection freezing
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: How do I create a soulbound (non-transferable) token?
    a: Create the Asset with PermanentFreezeDelegate, set frozen to true, and set authority to None. The Asset can never be unfrozen or transferred.
  - q: What's the difference between Freeze Delegate and Permanent Freeze Delegate?
    a: Regular Freeze Delegate authority is revoked on transfer and only works on Assets. Permanent Freeze Delegate persists forever, works on Collections, and uses forceApprove.
  - q: Can I freeze individual Assets in a Collection?
    a: No. When Permanent Freeze Delegate is on a Collection, freezing affects all Assets at once. Use Asset-level Permanent Freeze Delegate for individual control.
  - q: Can a permanently frozen Asset be burned?
    a: Only if there's also a Permanent Burn Delegate. Regular Burn Delegate cannot burn frozen Assets, but Permanent Burn Delegate uses forceApprove.
---
The **Permanent Freeze Delegate Plugin** provides irrevocable freeze authority that persists across transfers. Use it for soulbound tokens, collection-wide freezing, and permanent lock mechanisms. {% .lead %}
{% callout title="What You'll Learn" %}

- Create Assets with permanent freeze capability
- Freeze entire Collections at once
- Implement soulbound (non-transferable) tokens
- Understand permanent vs regular freeze delegate
{% /callout %}

## Summary

The **Permanent Freeze Delegate** is a permanent plugin that can only be added at creation time. Unlike the regular Freeze Delegate, this authority persists forever and can freeze/thaw even after transfers.

- Can only be added at Asset/Collection creation
- Authority persists across transfers (never revoked)
- Uses `forceApprove` - can freeze even with other blocking plugins
- Collection-level freezing affects all Assets in the Collection

## Out of Scope

Regular freeze delegate (see [Freeze Delegate](/smart-contracts/core/plugins/freeze-delegate)), temporary freezing, and Token Metadata freeze authority.

## Quick Start

**Jump to:** [Create Asset](#creating-an-asset-with-a-permanent-freeze-plugin) · [Create Collection](#creating-a-collection-with-a-permanent-freeze-plugin) · [Update (Thaw)](#updating-the-permanent-freeze-delegate-plugin-on-an-asset)

1. Add `PermanentFreezeDelegate` plugin at Asset/Collection creation
2. Set `frozen: true` for immediate freeze, or `false` to freeze later
3. The delegate can freeze/thaw at any time, even after transfers
{% callout type="note" title="Permanent vs Regular Freeze Delegate" %}
| Feature | Freeze Delegate | Permanent Freeze Delegate |
|---------|-----------------|---------------------------|
| Add after creation | ✅ Yes | ❌ Creation only |
| Authority persists on transfer | ❌ Revokes | ✅ Persists |
| Works with Collections | ❌ No | ✅ Yes |
| forceApprove | ❌ No | ✅ Yes |
| Soulbound tokens | ❌ Limited | ✅ Best choice |
**Choose [Freeze Delegate](/smart-contracts/core/plugins/freeze-delegate)** for temporary, revocable freezing.
**Choose Permanent Freeze Delegate** for permanent authority or collection-wide freezing.
{% /callout %}

## Common Use Cases

- **Soulbound tokens**: Create non-transferable credentials, achievements, or memberships
- **Collection-wide freeze**: Freeze all Assets in a Collection with one plugin
- **Permanent collateral**: Lock Assets as collateral that survives ownership changes
- **Game item permanence**: Items that stay locked regardless of trades
- **Compliance requirements**: Assets that must remain frozen for regulatory reasons

## Works With

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

### Behaviours

- **Asset**: Allows the delegated address to freeze and thaw the NFT at any time.
- **Collection**: Allows the collection authority to freeze and thaw the whole collection at once. It does **not** allow to freeze a single asset in the collection using this delegate.

## Arguments

| Arg    | Value |
| ------ | ----- |
| frozen | bool  |

## Creating an Asset with a Permanent Freeze plugin

The following example shows how to create an Asset with a Permanent Freeze plugin.
{% dialect-switcher title="Creating an Asset with a Permanent Freeze plugin" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { create } from '@metaplex-foundation/mpl-core'
const assetSigner = generateSigner(umi)
const delegate = publicKey('33333333333333333333333333333')
await create(umi, {
  asset: assetSigner,
  name: 'My NFT',
  uri: 'https://example.com/my-asset.json',
  plugins: [
    {
      type: 'PermanentFreezeDelegate',
      frozen: true,
      authority: { type: 'Address', address: delegate },
    },
  ],
}).sendAndConfirm(umi)
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
use std::str::FromStr;
use mpl_core::{
    instructions::CreateV1Builder,
    types::{PermanentFreezeDelegate, Plugin, PluginAuthority, PluginAuthorityPair},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
pub async fn create_asset_with_permanent_freeze_delegate_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let payer = Keypair::new();
    let asset = Keypair::new();
    let delegate = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let create_asset_with_permanent_freeze_delegate_plugin_ix = CreateV1Builder::new()
        .asset(asset.pubkey())
        .payer(payer.pubkey())
        .name("My Nft".into())
        .uri("https://example.com/my-nft.json".into())
        .plugins(vec![PluginAuthorityPair {
            plugin: Plugin::PermanentFreezeDelegate(PermanentFreezeDelegate { frozen: true }),
            authority: Some(PluginAuthority::Address { address: delegate }),
        }])
        .instruction();
    let signers = vec![&asset, &payer];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let create_asset_with_permanent_freeze_delegate_plugin_tx = Transaction::new_signed_with_payer(
        &[create_asset_with_permanent_freeze_delegate_plugin_ix],
        Some(&payer.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&create_asset_with_permanent_freeze_delegate_plugin_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}

## Updating the Permanent Freeze Delegate plugin on an Asset

The following example shows how to update the Permanent Freeze Delegate plugin on an Asset. Freeze or unfreeze it by setting the `frozen` argument to `true` or `false` respectively. It assumes that the signing wallet is the plugin authority.
{% dialect-switcher title="Updating the Permanent Freeze Delegate plugin on an Asset" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { updatePlugin } from '@metaplex-foundation/mpl-core'
const updateAssetResponse = await updatePlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: "PermanentFreezeDelegate",
    frozen: false,
  },
}).sendAndConfirm(umi);
```

{% /dialect %}
{% /dialect-switcher %}

## Creating a Collection with a Permanent Freeze plugin

The following example shows how to create a collection with a Permanent Freeze plugin.
{% dialect-switcher title="Creating a Collection with a Permanent Freeze plugin" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { generateSigner } from '@metaplex-foundation/umi'
import { createCollection } from '@metaplex-foundation/mpl-core'
const collectionSigner = generateSigner(umi)
await createCollection(umi, {
  collection: collectionSigner,
  name: "Frozen Collection",
  uri: "https://example.com/my-collection.json",
  plugins: [
      {
        type: 'PermanentFreezeDelegate',
        frozen: true,
        authority: { type: "UpdateAuthority"}, // The update authority can unfreeze it
      },
    ],
  }).sendAndConfirm(umi);
```

{% /dialect %}
{% /dialect-switcher %}

## Updating a Collection with a Permanent Freeze plugin

The following example shows how to update the Permanent Freeze Delegate plugin on a Collection. Freeze or unfreeze it by setting the `frozen` argument to `true` or `false` respectively. It assumes that the signing wallet is the plugin authority.
{% dialect-switcher title="Updating a Collection with a Permanent Freeze plugin" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { updateCollectionPlugin } from '@metaplex-foundation/mpl-core'
const updateCollectionResponse =  await updateCollectionPlugin(umi, {
  collection: collectionSigner.publicKey,
  plugin: {
      type: "PermanentFreezeDelegate",
      frozen: false,
    },
  }).sendAndConfirm(umi);
```

{% /dialect %}
{% /dialect-switcher %}

## Common Errors

### `Cannot add permanent plugin after creation`

Permanent plugins can only be added at Asset/Collection creation. You cannot add a Permanent Freeze Delegate to an existing Asset.

### `Authority mismatch`

Only the plugin authority can freeze/thaw. Verify you're signing with the correct keypair.

## Notes

- **On creation only**: Cannot be added after Asset/Collection exists
- **Force approve**: Can freeze even with conflicting plugins
- **Collection behavior**: Freezes all Assets at once, not individually
- **Persists forever**: Authority is never revoked, even after transfers
- Use for soulbound tokens by setting `frozen: true` with authority `None`

## FAQ

### How do I create a soulbound (non-transferable) token?

Create the Asset with `PermanentFreezeDelegate`, set `frozen: true`, and set authority to `None`. The Asset can never be unfrozen or transferred.

### What's the difference between Freeze Delegate and Permanent Freeze Delegate?

Regular Freeze Delegate authority is revoked on transfer and only works on Assets. Permanent Freeze Delegate persists forever, works on Collections, and uses `forceApprove`.

### Can I freeze individual Assets in a Collection?

No. When Permanent Freeze Delegate is on a Collection, freezing affects all Assets at once. Use Asset-level Permanent Freeze Delegate for individual control.

### Can a permanently frozen Asset be burned?

Only if there's also a Permanent Burn Delegate. Regular Burn Delegate cannot burn frozen Assets, but Permanent Burn Delegate uses `forceApprove`.

## Related Plugins

- [Freeze Delegate](/smart-contracts/core/plugins/freeze-delegate) - Revocable freeze for temporary locking
- [Permanent Transfer Delegate](/smart-contracts/core/plugins/permanent-transfer-delegate) - Permanent transfer authority
- [Permanent Burn Delegate](/smart-contracts/core/plugins/permanent-burn-delegate) - Burn even frozen Assets

## Glossary

| Term | Definition |
|------|------------|
| **Permanent Plugin** | Plugin that can only be added at creation and persists forever |
| **forceApprove** | Validation that overrides other plugin rejections |
| **Soulbound** | Non-transferable token permanently frozen to a wallet |
| **Collection Freeze** | Freezing all Assets in a Collection at once |
