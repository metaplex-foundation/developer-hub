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
faqs:
  - q: 트리 위임자는 무엇을 할 수 있나요?
    a: 트리 위임자는 트리 생성자를 대신하여 트리에서 압축된 NFT를 민팅할 수 있습니다. 이는 비공개 트리에만 해당됩니다.
  - q: 트리 위임을 취소하려면 어떻게 해야 하나요?
    a: newTreeDelegate를 트리 생성자 자신의 공개 키로 설정하여 setTreeDelegate를 사용하세요.
---

## Summary

**트리 위임**을 통해 트리 생성자는 개인 Bubblegum 트리에서 cNFT를 민팅할 다른 계정을 승인할 수 있습니다. 이 페이지에서는 트리 위임 권한의 승인 및 취소에 대해 설명합니다.

- 트리 생성자를 대신하여 cNFT를 민팅할 트리 위임자 승인
- 위임자를 생성자로 다시 설정하여 트리 위임자 취소
- 개인 트리에만 해당됨 (공개 트리는 누구나 민팅 가능)

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

- 트리 위임은 개인 트리에만 해당됩니다. 공개 트리는 누구나 민팅할 수 있습니다.
- 한 번에 하나의 트리 위임자만 활성화될 수 있습니다. 새 위임자를 승인하면 이전 위임자가 대체됩니다.
- 위임자가 설정된 경우에도 트리 생성자는 완전한 권한을 유지합니다.

## Glossary

| 용어 | 정의 |
|------|------|
| **트리 위임자** | 개인 트리에서 cNFT를 민팅하도록 트리 생성자가 승인한 계정 |
| **트리 생성자** | Bubblegum 트리를 생성하고 완전한 관리 권한을 가진 계정 |
| **setTreeDelegate** | 트리 위임자를 승인하거나 취소하는 데 사용되는 명령어 |
