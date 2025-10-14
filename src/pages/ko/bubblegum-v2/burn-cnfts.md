---
title: 압축된 NFT 소각
metaTitle: 압축된 NFT 소각 | Bubblegum V2
description: Bubblegum에서 압축된 NFT를 소각하는 방법을 알아보세요.
---

**burnV2** 명령어는 압축된 NFT를 소각하여 Bubblegum 트리에서 영구적으로 제거하는 데 사용할 수 있습니다. 이 작업을 승인하려면 현재 소유자나 위임 권한(있는 경우) 중 하나가 트랜잭션에 서명해야 합니다. 명령어는 다음 매개변수를 받아들입니다:

- **리프 소유자**, **리프 위임자**, 또는 **영구 소각 위임자**: 압축된 NFT의 현재 소유자, 위임 권한(있는 경우), 또는 컬렉션의 영구 소각 위임자. 자산이 컬렉션의 일부인 경우 `coreCollection` 매개변수를 전달해야 합니다. 이 중 하나가 트랜잭션에 서명해야 합니다.

이 명령어는 Bubblegum 트리의 리프를 교체하므로 소각하기 전에 압축된 NFT의 무결성을 확인하기 위해 추가 매개변수를 제공해야 합니다. 이러한 매개변수는 리프를 변경하는 모든 명령어에 공통이므로 [다음 FAQ](/kr/bubblegum-v2/faq#replace-leaf-instruction-arguments)에 문서화되어 있습니다. 다행히 Metaplex DAS API를 사용하여 이러한 매개변수를 자동으로 가져오는 도우미 메서드를 사용할 수 있습니다.

{% callout title="트랜잭션 크기" type="note" %}
트랜잭션 크기 오류가 발생하면 `getAssetWithProof`와 함께 `{ truncateCanopy: true }`를 사용하는 것을 고려하세요. 자세한 내용은 [FAQ](/kr/bubblegum-v2/faq#replace-leaf-instruction-arguments)를 참조하세요.
{% /callout %}

{% callout title="컬렉션" type="note" %}
cNFT가 컬렉션의 일부인 경우 `coreCollection` 매개변수를 전달해야 합니다.
{% /callout %}

{% dialect-switcher title="압축된 NFT 소각" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import { getAssetWithProof, burnV2 } from '@metaplex-foundation/mpl-bubblegum';

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
await burnV2(umi, {
  ...assetWithProof,
  leafOwner: currentLeafOwner,
}).sendAndConfirm(umi)
```

{% totem-accordion title="위임자 사용" %}

```ts
import { getAssetWithProof, burnV2 } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
await burnV2(umi, {
  ...assetWithProof,
  leafDelegate: currentLeafDelegate,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% totem-accordion title="영구 소각 위임자 사용" %}

```ts
import { getAssetWithProof, burnV2 } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
await burnV2(umi, {
  ...assetWithProof,
  authority: permanentBurnDelegate, // 영구 소각 위임자의 서명자
  coreCollection: collection.publicKey,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}