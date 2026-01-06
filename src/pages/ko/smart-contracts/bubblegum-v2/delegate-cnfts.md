---
title: 압축된 NFT 위임
metaTitle: 압축된 NFT 위임 | Bubblegum V2
description: Bubblegum에서 압축된 NFT를 위임하는 방법을 알아보세요.
---

압축된 NFT의 소유자는 cNFT의 소유권을 유지하면서 다른 계정에 위임할 수 있습니다. {% .lead %}

이를 통해 **위임 권한**이라고도 하는 위임된 계정이 소유자를 대신하여 작업을 수행할 수 있습니다. 이러한 작업은 다음과 같습니다:

- [cNFT 전송](/ko/smart-contracts/bubblegum-v2/transfer-cnfts): 위임 권한은 전송 후 재설정됩니다. 즉, 새 소유자로 설정됩니다.
- [cNFT 소각](/ko/smart-contracts/bubblegum-v2/burn-cnfts).
- [cNFT 동결 및 해동](/ko/smart-contracts/bubblegum-v2/freeze-cnfts).

이러한 각 작업은 위임 권한을 사용하여 수행하는 방법의 예제를 제공합니다. 일반적으로 **리프 소유자** 계정 대신 **리프 위임자** 계정을 서명자로 제공하기만 하면 됩니다.
압축된 NFT에 대한 위임 권한을 승인하고 취소하는 방법을 살펴보겠습니다.

## 위임 권한 승인

위임 권한을 승인하거나 교체하려면 소유자가 **위임** 명령어를 보내야 합니다. 이 명령어는 다음 매개변수를 받아들입니다:

- **리프 소유자**: 서명자로서 압축된 NFT의 현재 소유자. 기본적으로 트랜잭션의 지불자로 설정됩니다.
- **이전 리프 위임자**: 이전 위임 권한(있는 경우). 그렇지 않으면 **리프 소유자**로 설정되어야 합니다.
- **새 리프 위임자**: 승인할 새 위임 권한.

추가로 이 명령어는 Bubblegum 트리의 리프를 교체하므로 압축된 NFT의 무결성을 확인하기 위해 더 많은 매개변수를 제공해야 합니다. 이러한 매개변수는 리프를 변경하는 모든 명령어에 공통이므로 [다음 FAQ](/ko/smart-contracts/bubblegum-v2/faq#replace-leaf-instruction-arguments)에 문서화되어 있습니다. 다행히 Metaplex DAS API를 사용하여 이러한 매개변수를 자동으로 가져오는 도우미 메서드를 사용할 수 있습니다.

{% dialect-switcher title="압축된 NFT 위임" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import { getAssetWithProof, delegate } from '@metaplex-foundation/mpl-bubblegum';

const assetWithProof = await getAssetWithProof(umi, assetId, { truncateCanopy: true });
await delegate(umi, {
  ...assetWithProof,
  leafOwner,
  previousLeafDelegate: leafOwner.publicKey,
  newLeafDelegate: newDelegate,
}).sendAndConfirm(umi);
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 위임 권한 취소

기존 위임 권한을 취소하려면 소유자가 자신을 새 위임 권한으로 설정하기만 하면 됩니다.

{% dialect-switcher title="압축된 NFT의 위임 권한 취소" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import { getAssetWithProof, delegate } from '@metaplex-foundation/mpl-bubblegum';

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
await delegate(umi, {
  ...assetWithProof,
  leafOwner,
  previousLeafDelegate: currentDelegate,
  newLeafDelegate: leafOwner.publicKey,
}).sendAndConfirm(umi);
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}