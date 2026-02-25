---
title: Delegating Trees
metaTitle: Delegating Trees - Bubblegum V2 - Metaplex
description: Learn how to delegate and revoke tree authority on Bubblegum V2 Merkle Trees. Allows a delegate to mint cNFTs on behalf of the tree creator.
created: '01-15-2025'
updated: '02-24-2026'
keywords:
  - delegate tree
  - tree delegation
  - tree authority
  - tree creator
  - set tree delegate
about:
  - Compressed NFTs
  - Tree management
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: What can a tree delegate do?
    a: A tree delegate can mint compressed NFTs from the tree on behalf of the tree creator. This is only relevant for private trees.
  - q: How do I revoke a tree delegate?
    a: Use setTreeDelegate with newTreeDelegate set to the tree creator's own public key.
---

## Summary

**Delegating trees** allows the tree creator to authorize another account to mint cNFTs from a private Bubblegum Tree. This page covers approving and revoking tree delegate authority.

- Approve a tree delegate to mint cNFTs on behalf of the tree creator
- Revoke a tree delegate by setting the delegate back to the creator
- Only relevant for private trees (public trees allow anyone to mint)

Similarly to how the owner of a Compressed NFT can approve a Delegate Authority, the creator of a Bubblegum Tree can also approve another account to perform actions on their behalf. {% .lead %}

Once a Delegate Authority is approved for a Bubblegum Tree, it will be able to [mint Compressed NFTs](/smart-contracts/bubblegum-v2/mint-cnfts) on behalf of the creator. Note that this is only relevant for private trees, since anyone can mint on public trees.

## Approving a Delegate Authority for a Tree

To approve a new Delegate Authority on a Bubblegum Tree, its creator may use the **Set Tree Delegate** instruction, which accepts the following parameters:

- **Merkle Tree**: The address of the Merkle Tree to delegate.
- **Tree Creator**: The creator of the Merkle Tree as a Signer.
- **New Tree Delegate**: The new Delegate Authority to approve.

{% dialect-switcher title="Delegate a Bubblegum Tree" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import { setTreeDelegate } from '@metaplex-foundation/mpl-bubblegum'

await setTreeDelegate(umi, {
  merkleTree,
  treeCreator,
  newTreeDelegate,
}).sendAndConfirm(umi)
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Revoking a Delegate Authority for a Tree

To revoke an existing Delegate Authority, the creator of the tree simply needs to set themselves as the new Delegate Authority.

{% dialect-switcher title="Revoke the Delegate Authority of a Bubblegum Tree" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import { setTreeDelegate } from '@metaplex-foundation/mpl-bubblegum'

await setTreeDelegate(umi, {
  merkleTree,
  treeCreator,
  newTreeDelegate: treeCreator.publicKey,
}).sendAndConfirm(umi)
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}


## Notes

- Tree delegation is only relevant for private trees. Public trees allow anyone to mint.
- Only one tree delegate can be active at a time. Approving a new delegate replaces the previous one.
- The tree creator retains full authority even when a delegate is set.

## FAQ

### What can a tree delegate do?

A tree delegate can mint compressed NFTs from the tree on behalf of the tree creator. This is only relevant for private trees.

### How do I revoke a tree delegate?

Use `setTreeDelegate` with `newTreeDelegate` set to the tree creator's own public key.

## Glossary

| Term | Definition |
|------|------------|
| **Tree Delegate** | An account authorized by the tree creator to mint cNFTs from a private tree |
| **Tree Creator** | The account that created the Bubblegum Tree and has full management authority |
| **setTreeDelegate** | The instruction used to approve or revoke a tree delegate |
