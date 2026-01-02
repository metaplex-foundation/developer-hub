---
title: 트리 위임
metaTitle: 트리 위임 | Bubblegum
description: Bubblegum에서 Merkle 트리를 위임하는 방법을 알아봅니다.
---

압축 NFT의 소유자가 위임 권한을 승인할 수 있는 것과 마찬가지로, Bubblegum 트리의 생성자도 다른 계정을 승인하여 자신을 대신하여 작업을 수행할 수 있습니다. {% .lead %}

Bubblegum 트리에 대한 위임 권한이 승인되면 생성자를 대신하여 [압축 NFT를 발행](/ko/smart-contracts/bubblegum/mint-cnfts)할 수 있습니다. 공개 트리에서는 누구나 발행할 수 있으므로 이는 비공개 트리에만 관련이 있습니다.

## 트리에 대한 위임 권한 승인

Bubblegum 트리에서 새 위임 권한을 승인하려면 생성자가 다음 매개변수를 허용하는 **트리 위임자 설정** 명령을 사용할 수 있습니다:

- **Merkle 트리**: 위임할 Merkle 트리의 주소입니다.
- **트리 생성자**: Merkle 트리의 생성자(서명자).
- **새 트리 위임자**: 승인할 새 위임 권한입니다.

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

기존 위임 권한을 취소하려면 트리 생성자가 단순히 자신을 새 위임 권한으로 설정하면 됩니다.

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
