---
title: Verified Creator Plugin
metaTitle: Verified Creator Plugin | Metaplex Core
description: Add verified creator signatures to Core NFT Assets and Collections. Prove creatorship without affecting royalty distribution.
updated: '01-31-2026'
keywords:
  - verified creator
  - creator signature
  - prove authorship
  - creator verification
about:
  - Creator verification
  - Signature proof
  - Authorship
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: How is this different from the Token Metadata creator array?
    a: In Token Metadata, the creator array was used for royalty distribution. In Core, Verified Creators is purely for proof of creatorship - use the Royalties plugin for royalty distribution.
  - q: Can the update authority verify a creator?
    a: No. Each creator must verify themselves by signing the transaction. This ensures authentic proof of creatorship.
  - q: Why can't I remove a verified creator?
    a: To remove a verified creator, they must first unverify themselves. This prevents unauthorized removal of verified creators.
  - q: Do Assets automatically get the Collection's verified creators?
    a: Yes. Assets inherit the creators array from their Collection. Individual Assets can also have their own Verified Creators plugin with different creators.
  - q: Can I use this for co-creator attribution?
    a: Yes. This is a common use case - multiple creators can all verify their involvement in creating an Asset or Collection.
---
The **Verified Creators Plugin** stores a list of verified creator signatures on Assets or Collections. Prove creatorship publicly without affecting royalty distribution. {% .lead %}
{% callout title="What You'll Learn" %}

- Add verified creators to Assets and Collections
- Verify creator signatures
- Remove creators from the list
- Understand the verification workflow
{% /callout %}

## Summary

The **Verified Creators** plugin is an Authority Managed plugin that stores creator addresses with verification status. Unlike Token Metadata, these creators are NOT used for royalty distribution (use the Royalties plugin for that).

- Update authority adds unverified creators
- Creators verify themselves by signing
- Verified creators must unverify before removal
- Assets inherit creators from their Collection

## Out of Scope

Royalty distribution (use [Royalties plugin](/smart-contracts/core/plugins/royalties)), Token Metadata creator arrays, and automatic verification.

## Quick Start

**Jump to:** [Add to Asset](#adding-the-autograph-plugin-to-an-asset-code-example) · [Add Creator](#adding-a-different-creator-to-an-asset-code-example) · [Remove Creator](#removing-a-creator-from-an-asset-code-example)

1. Add the Verified Creators plugin with initial creators
2. Creators verify themselves using `updatePlugin`
3. To remove: creator unverifies, then update authority removes
{% callout type="note" title="Verified Creators vs Autograph" %}
| Feature | Verified Creators | Autograph |
|---------|-------------------|-----------|
| Who can add | Update authority only | Anyone (after enabled) |
| Purpose | Prove creatorship | Collectible signatures |
| Verification | Creators verify themselves | No verification needed |
| Removal | Must unverify first | Owner can remove anytime |
| Used for royalties | ❌ No | ❌ No |
**Use Verified Creators** for proving authentic creatorship.
**Use [Autograph](/smart-contracts/core/plugins/autograph)** for collectible signatures from fans/celebrities.
{% /callout %}

## Common Use Cases

- **Team attribution**: Designer, developer, and founder each verify their involvement
- **Co-creator proof**: Multiple artists verify collaboration on a piece
- **Brand verification**: Official brand accounts verify partnership
- **Authenticity proof**: Original creator verifies they created the Asset
- **Historical record**: Document who was involved in creating a Collection
The `update authority` can:
- Add the plugin.
- Add unverified creators to the creators array.
- Can remove unverified creators. To remove verified creators they must unverify themselves first.
- Can verify themselves.
To verify a creator the `updatePlugin` instruction has to be signed by the public key that was added by the update authority to the creators array.

## Works With

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

## Arguments

The `verifiedCreator` Plugin requires the following arguments in a `VerifiedCreatorsSignature` Array:

| Arg     | Value     |
| ------- | ------    |
| address | publicKey |
| message | string    |
Assets inherit the Creators array from the Collection.

## Adding the autograph Plugin to an Asset code example

{% dialect-switcher title="Adding a verified Creators Plugin to an MPL Core Asset" %}
{% dialect title="JavaScript" id="js" %}
This snippet assumes that the umi identity is the update authority of the asset.

```ts
import {
  addPlugin,
} from '@metaplex-foundation/mpl-core'
await addPlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'VerifiedCreators',
    signatures: [
      {
        address: umi.identity.publicKey,
        verified: true,
      },
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## Adding a different Creator to an Asset code example

{% dialect-switcher title="Adding a different Creator to an MPL Core Asset" %}
{% dialect title="JavaScript" id="js" %}
This snippet assumes that the umi identity is the update authority of the asset to add a unverified Creator.

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'
const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})
const publicKeyToAdd = publicKey("abc...")
// The new autograph that you want to add
const newCreator = {
  address: publicKeyToAdd,
  verified: false,
}
// Add the new autograph to the existing signatures array
const updatedCreators = [...asset.verifiedCreators.signatures, newCreator]
await updatePlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'VerifiedCreators',
    signatures: updatedCreators,
  },
  authority: umi.identity,
}).sendAndConfirm(umi)
```

After adding the unverified Creator they can verify themselves using the `updatePlugin` function again.
This snippet assumes that the umi identity is the Creator.

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'
const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})
const publicKeyToVerify = publicKey("abc...")
// The creator that you want to verify
const updatedCreators = asset.verifiedCreators.signatures.map(creator => {
  if (creator.address === publicKeyToVerify) {
    return { ...creator, verified: true };
  }
  return creator;
});
await updatePlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'VerifiedCreators',
    signatures: updatedCreators,
  },
  authority: umi.identity,
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## Removing a Creator from an Asset code example

{% dialect-switcher title="Removing a Creator from an MPL Core Asset" %}
{% dialect title="JavaScript" id="js" %}
Only the update authority can remove creators. To remove the creator it has to be `verified:false` or the update authority itself. Therefore the update will be done in two steps. If you are able to sign with the update authority and the creator at the same time this could be done in one transaction combining both instructions.

1. Set `verified:false`
This snippet assumes that `umi.identity` is the creator that you want to remove

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'
const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})
// The Publickey of the creator that you want to remove 
const publicKeyToRemove = publicKey("abc...")
const modifiedCreators = signatures.map(signature => 
  signature.address === creator.publicKey 
    ? { ...signature, verified: false } 
    : signature
);
await updatePlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'VerifiedCreators',
    signatures: modifiedCreators,
  },
  authority: umi.identity, // Should be the creator
}).sendAndConfirm(umi)
```
1. remove the creator
This snippet assumes that `umi.identity` is the update authority

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'
const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})
// The Publickey of the creator that you want to remove 
const publicKeyToRemove = publicKey("abc...")
const creatorsToKeep = asset.verifiedCreators.signatures.filter(
  (creator) => creator.address !== publicKeyToRemove
);
await updatePlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'VerifiedCreators',
    signatures: creatorsToKeep,
  },
  authority: umi.identity, // Should be the update authority
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## Adding the verified Creators Plugin to a Collection code example

{% dialect-switcher title="Add verified Creators Plugin to Collection" %}
{% dialect title="JavaScript" id="js" %}
This snippet assumes that the `umi.identity` is the update authority

```ts
import { addCollectionPlugin } from '@metaplex-foundation/mpl-core'
await addCollectionPlugin(umi, {
  collection: collection.publicKey,
  plugin: {
    type: 'VerifiedCreators',
        signatures: [
      {
        address: umi.identity.publicKey,
        verified: true,
      },
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## Common Errors

### `Authority mismatch`

Only the update authority can add the plugin or add new creators. Only the creator themselves can verify their own signature.

### `Creator already verified`

The creator has already verified themselves. No action needed.

### `Cannot remove verified creator`

A verified creator must unverify themselves before the update authority can remove them.

## Notes

- Verified Creators are NOT used for royalty distribution (use Royalties plugin)
- Creators must verify themselves—update authority cannot verify on their behalf
- A creator must unverify before they can be removed
- Assets inherit the creators array from their Collection

## Quick Reference

### Verification Workflow

| Step | Action | Who |
|------|--------|-----|
| 1 | Add unverified creator | Update Authority |
| 2 | Verify creator | Creator signs |
| 3 | Unverify (optional) | Creator signs |
| 4 | Remove (optional) | Update Authority |

### Permission Matrix

| Action | Update Authority | Creator |
|--------|------------------|---------|
| Add plugin | ✅ | ❌ |
| Add unverified creator | ✅ | ❌ |
| Verify creator | ❌ | ✅ (self only) |
| Unverify creator | ❌ | ✅ (self only) |
| Remove unverified creator | ✅ | ❌ |

## FAQ

### How is this different from the Token Metadata creator array?

In Token Metadata, the creator array was used for royalty distribution. In Core, Verified Creators is purely for proof of creatorship - use the Royalties plugin for royalty distribution.

### Can the update authority verify a creator?

No. Each creator must verify themselves by signing the transaction. This ensures authentic proof of creatorship.

### Why can't I remove a verified creator?

To remove a verified creator, they must first unverify themselves. This prevents unauthorized removal of verified creators.

### Do Assets automatically get the Collection's verified creators?

Yes. Assets inherit the creators array from their Collection. Individual Assets can also have their own Verified Creators plugin with different creators.

### Can I use this for co-creator attribution?

Yes. This is a common use case—multiple creators (designer, developer, artist) can all verify their involvement in creating an Asset or Collection.

## Glossary

| Term | Definition |
|------|------------|
| **Verified Creator** | Creator who has signed to confirm their involvement |
| **Unverified Creator** | Creator added by update authority but not yet confirmed |
| **Verification** | Creator signing to prove authentic creatorship |
| **Royalties Plugin** | Separate plugin for royalty distribution (not this one) |
| **Creator Array** | List of addresses associated with an Asset/Collection |

## Related Plugins

- [Autograph](/smart-contracts/core/plugins/autograph) - Collectible signatures from anyone (fans, celebrities)
- [Royalties](/smart-contracts/core/plugins/royalties) - Set royalty distribution (separate from verified creators)
- [ImmutableMetadata](/smart-contracts/core/plugins/immutableMetadata) - Lock metadata permanently
