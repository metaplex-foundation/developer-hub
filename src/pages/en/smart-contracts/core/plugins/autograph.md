---
title: Autograph Plugin
metaTitle: Autograph Plugin | Metaplex Core
description: Allow anyone to add signatures and messages to Core NFT Assets. Create collectible autographs from creators, artists, or community members.
updated: '01-31-2026'
---
The **Autograph Plugin** allows anyone to add their signature and a message to an Asset or Collection. Perfect for collectible signatures from artists, celebrities, or community members. {% .lead %}
{% callout title="What You'll Learn" %}
- Enable autographs on Assets and Collections
- Add your signature to an Asset
- Remove autographs as the owner
- Understand autograph permissions
{% /callout %}
## Summary
The **Autograph** plugin is an Owner Managed plugin that stores signatures with messages. Once enabled, anyone can add their signature. The owner can remove any autograph.
- Owner adds the plugin (or update authority at mint)
- Anyone can add their own signature
- Only owner/delegate can remove autographs
- Autographers cannot remove their own signature
- Assets inherit autographs from their Collection
## Out of Scope
Creator verification (use [Verified Creators](/smart-contracts/core/plugins/verified-creators)), royalties, and automatic signature validation.
## Quick Start
**Jump to:** [Add Plugin](#adding-the-autograph-plugin-to-an-asset-code-example) · [Add Autograph](#adding-an-autograph-to-an-asset-code-example) · [Remove Autograph](#removing-an-autograph-from-an-asset-code-example)
1. Owner adds the Autograph plugin to enable signatures
2. Anyone can add their signature with `updatePlugin`
3. Owner can remove any autograph
{% callout type="note" title="Autograph vs Verified Creators" %}
| Feature | Autograph | Verified Creators |
|---------|-----------|-------------------|
| Who can sign | Anyone | Only listed creators |
| Permission to enable | Owner | Update authority |
| Self-removal | ❌ Cannot remove own | ✅ Can unverify self |
| Purpose | Collectible signatures | Prove creatorship |
| Best for | Fan engagement, events | Team attribution |
**Use Autograph** for collectible signatures (like autographed memorabilia).
**Use [Verified Creators](/smart-contracts/core/plugins/verified-creators)** for proving who created the Asset.
{% /callout %}
## Common Use Cases
- **Celebrity autographs**: Artists sign NFTs at events
- **Fan engagement**: Community members sign limited edition pieces
- **Authentication**: Real-world item creators sign digital twins
- **Event memorabilia**: Conference speakers sign event NFTs
- **Charity auctions**: Multiple celebrities sign charity NFTs 
To add a autograph some conditions have to be met:
- The autograph plugin must be added already.
- The signer may only add their own address.
- The existing list have to be passed along with the added signature using the `updatePlugin` function.
- There is no existing Autograph by that signer yet.
{% callout type="note" %}
As soon as the autograph plugin has been added by the owner everyone can add their signature. It can again be removed by the owner at any time.
{% /callout %}
## Works With
|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |
Assets inherit Autographs from the Collection.
## Arguments
The `autograph` Plugin requires the following arguments in a `signatures` Array:
| Arg     | Value     |
| ------- | ------    |
| address | publicKey |
| message | string    |
## Adding the autograph Plugin to an Asset code example
{% dialect-switcher title="Adding a autograph Plugin to an MPL Core Asset as the owner" %}
{% dialect title="JavaScript" id="js" %}
```ts
import {
  addPlugin,
} from '@metaplex-foundation/mpl-core'
await addPlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'Autograph',
    signatures: [
      {
        address: umi.identity.publicKey,
        message: 'Your Message',
      },
  },
}).sendAndConfirm(umi)
```
{% /dialect %}
{% /dialect-switcher %}
## Adding an Autograph to an Asset code example
{% dialect-switcher title="Adding a Autograph to an MPL Core Asset" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'
const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})
// The new autograph that you want to add
const newAutograph = {
  address: umi.identity.publicKey,
  message: "your message"
}
// Add the new autograph to the existing signatures array
const updatedAutographs = [...asset.autograph.signatures, newAutograph]
await updatePlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'Autograph',
    // This should contain all autographs that you do not want to remove
    signatures: updatedAutographs,
  },
  authority: umi.identity,
}).sendAndConfirm(umi)
```
{% /dialect %}
{% /dialect-switcher %}
## Removing an Autograph from an Asset code example
{% dialect-switcher title="Removing a Autograph from an MPL Core Asset" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'
const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})
// The Publickey of the autograph that you want to remove 
const publicKeyToRemove = publicKey("abc...")
const autographsToKeep = asset.autograph.signatures.filter(
  (autograph) => autograph.address !== publicKeyToRemove
);
await updatePlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'Autograph',
    // This should contain all Autographs that you do not want to remove
    signatures: autographsToKeep,
  },
  authority: umi.identity, // Should be the owner of the asset
}).sendAndConfirm(umi)
```
{% /dialect %}
{% /dialect-switcher %}
## Adding the autograph Plugin to a Collection code example
{% dialect-switcher title="Add autograph Plugin to Collection" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { addCollectionPlugin } from '@metaplex-foundation/mpl-core'
await addCollectionPlugin(umi, {
  collection: collection.publicKey,
  plugin: {
    type: 'Autograph',
        signatures: [
      {
        address: umi.identity.publicKey,
        message: 'Your Message',
      },
  },
}).sendAndConfirm(umi)
```
{% /dialect %}
{% /dialect-switcher %}
## Common Errors
### `Plugin not added`
The Autograph plugin must be added by the owner before anyone can add autographs.
### `Autograph already exists`
This address has already signed this Asset. Each address can only add one autograph.
### `Cannot remove own autograph`
Autographers cannot remove their own signature (unless they are also the owner or autograph delegate).
## Notes
- Anyone can add their signature once the plugin is enabled
- Only the owner or autograph delegate can remove autographs
- Autographers cannot remove their own signature
- Assets inherit autographs from their Collection
- Each address can only sign once per Asset
## Quick Reference
### Permission Matrix
| Action | Owner | Anyone | Autographer |
|--------|-------|--------|-------------|
| Add plugin | ✅ | ❌ | ❌ |
| Add own autograph | ✅ | ✅ | ✅ |
| Remove any autograph | ✅ | ❌ | ❌ |
| Remove own autograph | ✅ (as owner) | ❌ | ❌ |
### Autograph Lifecycle
| Step | Action | Who |
|------|--------|-----|
| 1 | Add Autograph plugin | Owner |
| 2 | Add autograph | Anyone |
| 3 | Remove autograph (optional) | Owner only |
## FAQ
### How is this different from Verified Creators?
Verified Creators is for proving creatorship and is managed by the update authority. Autograph is for collectible signatures from anyone (like getting an autograph at an event).
### Can someone add multiple autographs?
No. Each address can only add one autograph per Asset. Attempting to add a second autograph from the same address will fail.
### Can I remove my own autograph?
No. Only the owner or autograph delegate can remove autographs. This prevents someone from signing and then immediately removing it.
### Do I need the owner's permission to add an autograph?
No. Once the owner enables the Autograph plugin, anyone can add their signature. The owner doesn't need to approve individual autographs.
### What happens to autographs when an Asset is transferred?
Autographs remain on the Asset. They are permanent records of who signed, regardless of ownership changes.
## Glossary
| Term | Definition |
|------|------------|
| **Autograph** | A signature with optional message added to an Asset |
| **Autographer** | Address that added their signature |
| **Autograph Delegate** | Address with permission to remove autographs |
| **Signatures Array** | List of all autographs on an Asset |
| **Owner Managed** | Plugin type where the owner controls addition |
## Related Plugins
- [Verified Creators](/smart-contracts/core/plugins/verified-creators) - Prove creatorship (authority managed)
- [Attributes](/smart-contracts/core/plugins/attribute) - Store on-chain data
- [ImmutableMetadata](/smart-contracts/core/plugins/immutableMetadata) - Lock metadata permanently
