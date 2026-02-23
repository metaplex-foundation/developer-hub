---
title: 트리 위임
metaTitle: 트리 위임 - Bubblegum V2
description: Bubblegum에서 머클 트리를 위임하는 방법을 알아보세요.
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
---

## Summary

**Delegating trees** allows the tree creator to authorize another account to mint cNFTs from a private Bubblegum Tree. This page covers approving and revoking tree delegate authority.

- Approve a tree delegate to mint cNFTs on behalf of the tree creator
- Revoke a tree delegate by setting the delegate back to the creator
- Only relevant for private trees (public trees allow anyone to mint)

## Out of Scope


압축된 NFT의 소유자가 위임 권한을 승인할 수 있는 것과 마찬가지로 Bubblegum 트리의 제작자도 다른 계정을 승인하여 대신 작업을 수행할 수 있습니다. {% .lead %}

Bubblegum 트리에 대해 위임 권한이 승인되면 제작자를 대신하여 [압축된 NFT를 민팅](/ko/smart-contracts/bubblegum-v2/mint-cnfts)할 수 있게 됩니다. 이는 개인 트리에서만 관련이 있으며, 공개 트리에서는 누구나 민팅할 수 있습니다.

## 트리에 대한 위임 권한 승인

Bubblegum 트리에서 새로운 위임 권한을 승인하려면 제작자가 **트리 위임 설정** 명령어를 사용할 수 있습니다. 다음 매개변수를 받아들입니다:

- **머클 트리**: 위임할 머클 트리의 주소.
- **트리 제작자**: 서명자로서 머클 트리의 제작자.
- **새 트리 위임자**: 승인할 새 위임 권한.

{% dialect-switcher title="Bubblegum 트리 위임" %}
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

## 트리에 대한 위임 권한 취소

기존 위임 권한을 취소하려면 트리의 제작자가 자신을 새 위임 권한으로 설정하기만 하면 됩니다.

{% dialect-switcher title="Bubblegum 트리의 위임 권한 취소" %}
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

#

## Glossary

| Term | Definition |
|------|------------|
| **Tree Delegate** | An account authorized by the tree creator to mint cNFTs from a private tree |
| **Tree Creator** | The account that created the Bubblegum Tree and has full management authority |
| **setTreeDelegate** | The instruction used to approve or revoke a tree delegate |
