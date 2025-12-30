---
title: 압축 NFT 전송
metaTitle: 압축 NFT 전송 | Bubblegum
description: Bubblegum에서 압축 NFT를 전송하는 방법을 알아봅니다.
---

**전송** 명령을 사용하여 압축 NFT를 한 소유자에서 다른 소유자로 전송할 수 있습니다. 전송을 승인하려면 현재 소유자 또는 위임 권한(있는 경우)이 트랜잭션에 서명해야 합니다. 명령은 다음 매개변수를 허용합니다:

- **리프 소유자** 및 **리프 위임자**: 압축 NFT의 현재 소유자와 위임 권한(있는 경우)입니다. 이 중 하나가 트랜잭션에 서명해야 합니다.
- **새 리프 소유자**: 압축 NFT의 새 소유자 주소입니다.

이 명령은 압축 NFT를 업데이트하므로 Bubblegum 트리의 리프를 교체합니다. 따라서 압축 NFT의 무결성을 확인하기 위해 추가 매개변수를 제공해야 합니다. 이러한 매개변수는 리프를 변경하는 모든 명령에 공통적이므로 [다음 FAQ](/ko/smart-contracts/bubblegum-v2/faq#replace-leaf-instruction-arguments)에 문서화되어 있습니다. 다행히도 Metaplex DAS API를 사용하여 이러한 매개변수를 자동으로 가져오는 헬퍼 메서드를 사용할 수 있습니다.

{% callout title="트랜잭션 크기" type="note" %}
트랜잭션 크기 오류가 발생하면 `getAssetWithProof`와 함께 `{ truncateCanopy: true }`를 사용하는 것을 고려하세요. 자세한 내용은 [FAQ](/ko/smart-contracts/bubblegum-v2/faq#replace-leaf-instruction-arguments)를 참조하세요.
{% /callout %}

{% dialect-switcher title="압축 NFT 전송" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import { getAssetWithProof, transfer } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
await transfer(umi, {
  ...assetWithProof,
  leafOwner: currentLeafOwner,
  newLeafOwner: newLeafOwner.publicKey,
}).sendAndConfirm(umi)
```

{% totem-accordion title="위임자 사용" %}

```ts
import { getAssetWithProof, transfer } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
await transfer(umi, {
  ...assetWithProof,
  leafDelegate: currentLeafDelegate,
  newLeafOwner: newLeafOwner.publicKey,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}
