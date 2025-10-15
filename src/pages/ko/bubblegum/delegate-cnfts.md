---
title: 압축 NFT 위임
metaTitle: 압축 NFT 위임 - Bubblegum
description: Bubblegum에서 압축 NFT를 위임하는 방법을 알아봅니다.
---

압축 NFT의 소유자는 cNFT의 소유권을 유지하면서 다른 계정에 위임할 수 있습니다. {% .lead %}

이를 통해 위임된 계정(**위임 권한**이라고도 함)이 소유자를 대신하여 작업을 수행할 수 있습니다. 이러한 작업은 다음과 같습니다:

- [cNFT 전송](/bubblegum/transfer-cnfts). 전송 후 위임 권한은 재설정됩니다(즉, 새 소유자로 설정됨).
- [cNFT 소각](/bubblegum/burn-cnfts).

이러한 각 작업은 위임 권한을 사용하여 수행하는 방법에 대한 예제를 제공하지만, 일반적으로 **리프 소유자** 계정을 서명자로 전달하는 대신 **리프 위임자** 계정을 서명자로 제공하는 것입니다.

압축 NFT에 대한 위임 권한을 승인하고 취소하는 방법을 살펴보겠습니다.

## 위임 권한 승인

위임 권한을 승인하거나 교체하려면 소유자가 **위임** 명령을 보내야 합니다. 이 명령은 다음 매개변수를 허용합니다:

- **리프 소유자**: 압축 NFT의 현재 소유자(서명자).
- **이전 리프 위임자**: 이전 위임 권한(있는 경우). 그렇지 않으면 **리프 소유자**로 설정해야 합니다.
- **새 리프 위임자**: 승인할 새 위임 권한입니다.

또한 이 명령은 결국 Bubblegum 트리의 리프를 교체하므로 압축 NFT의 무결성을 확인하기 위해 더 많은 매개변수를 제공해야 합니다. 이러한 매개변수는 리프를 변경하는 모든 명령에 공통적이므로 [다음 FAQ](/bubblegum/faq#replace-leaf-instruction-arguments)에 문서화되어 있습니다. 다행히도 Metaplex DAS API를 사용하여 이러한 매개변수를 자동으로 가져오는 헬퍼 메서드를 사용할 수 있습니다.

{% dialect-switcher title="압축 NFT 위임" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import { getAssetWithProof, delegate } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
await delegate(umi, {
  ...assetWithProof,
  leafOwner,
  previousLeafDelegate: leafOwner.publicKey,
  newLeafDelegate: newDelegate,
}).sendAndConfirm(umi)
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 위임 권한 취소

기존 위임 권한을 취소하려면 소유자가 단순히 자신을 새 위임 권한으로 설정하면 됩니다.

{% dialect-switcher title="압축 NFT의 위임 권한 취소" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import { getAssetWithProof, delegate } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
await delegate(umi, {
  ...assetWithProof,
  leafOwner,
  previousLeafDelegate: currentDelegate,
  newLeafDelegate: leafOwner.publicKey,
}).sendAndConfirm(umi)
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}
