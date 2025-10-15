---
title: 압축 NFT 소각
metaTitle: 압축 NFT 소각 | Bubblegum
description: Bubblegum에서 압축 NFT를 소각하는 방법을 알아봅니다.
---

**소각** 명령을 사용하여 압축 NFT를 소각하고 Bubblegum 트리에서 영구적으로 제거할 수 있습니다. 이 작업을 승인하려면 현재 소유자 또는 위임 권한(있는 경우)이 트랜잭션에 서명해야 합니다. 명령은 다음 매개변수를 허용합니다:

- **리프 소유자** 및 **리프 위임자**: 압축 NFT의 현재 소유자와 위임 권한(있는 경우)입니다. 이 중 하나가 트랜잭션에 서명해야 합니다.

이 명령은 Bubblegum 트리의 리프를 교체하므로 소각하기 전에 압축 NFT의 무결성을 확인하기 위해 추가 매개변수를 제공해야 합니다. 이러한 매개변수는 리프를 변경하는 모든 명령에 공통적이므로 [다음 FAQ](/bubblegum/faq#replace-leaf-instruction-arguments)에 문서화되어 있습니다. 다행히도 Metaplex DAS API를 사용하여 이러한 매개변수를 자동으로 가져오는 헬퍼 메서드를 사용할 수 있습니다.

{% callout title="트랜잭션 크기" type="note" %}
트랜잭션 크기 오류가 발생하면 `getAssetWithProof`와 함께 `{ truncateCanopy: true }`를 사용하는 것을 고려하세요. 자세한 내용은 [FAQ](/bubblegum/faq#replace-leaf-instruction-arguments)를 참조하세요.
{% /callout %}

{% dialect-switcher title="압축 NFT 소각" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import { getAssetWithProof, burn } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
await burn(umi, {
  ...assetWithProof,
  leafOwner: currentLeafOwner,
}).sendAndConfirm(umi)
```

{% totem-accordion title="위임자 사용" %}

```ts
import { getAssetWithProof, burn } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
await burn(umi, {
  ...assetWithProof,
  leafDelegate: currentLeafDelegate,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}
