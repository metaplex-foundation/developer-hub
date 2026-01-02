---
title: 크리에이터 검증
metaTitle: 크리에이터 검증 | Bubblegum
description: Bubblegum에서 크리에이터를 검증 및 검증 취소하는 방법을 알아봅니다.
---

압축 NFT의 메타데이터에 크리에이터 목록이 설정되어 있는 경우, 이러한 크리에이터는 특수 명령을 사용하여 cNFT에서 자신을 검증하고 검증 취소할 수 있습니다. {% .lead %}

이러한 명령은 cNFT의 **크리에이터** 배열의 적절한 항목에서 **검증됨** 부울을 토글합니다. 이 부울은 지갑 및 마켓플레이스와 같은 앱이 어떤 크리에이터가 진짜이고 어떤 크리에이터가 아닌지 알 수 있게 하므로 중요합니다.

크리에이터는 민트 트랜잭션에 서명하여 [압축 NFT를 발행](/ko/smart-contracts/bubblegum/mint-cnfts)할 때 직접 자신을 검증할 수 있다는 점은 주목할 가치가 있습니다. 그러나 이제 크리에이터가 기존 압축 NFT에서 자신을 검증하거나 검증 취소하는 방법을 살펴보겠습니다.

## 크리에이터 검증

Bubblegum 프로그램은 검증하려는 크리에이터가 서명해야 하는 **크리에이터 검증** 명령을 제공합니다.

또한 이 명령은 결국 Bubblegum 트리의 리프를 교체하므로 압축 NFT의 무결성을 확인하기 위해 더 많은 매개변수를 제공해야 합니다. 이러한 매개변수는 리프를 변경하는 모든 명령에 공통적이므로 [다음 FAQ](/ko/smart-contracts/bubblegum-v2/faq#replace-leaf-instruction-arguments)에 문서화되어 있습니다. 다행히도 Metaplex DAS API를 사용하여 이러한 매개변수를 자동으로 가져오는 헬퍼 메서드를 사용할 수 있습니다.

{% dialect-switcher title="압축 NFT의 크리에이터 검증" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import {
  getAssetWithProof,
  verifyCreator,
} from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
await verifyCreator(umi, { ...assetWithProof, creator }).sendAndConfirm(umi)
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 크리에이터 검증 취소

**크리에이터 검증** 명령과 마찬가지로 **크리에이터 검증 취소** 명령은 크리에이터가 서명해야 하며 압축 NFT에서 검증을 취소합니다.

{% dialect-switcher title="압축 NFT의 크리에이터 검증 취소" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import {
  getAssetWithProof,
  unverifyCreator,
} from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
await unverifyCreator(umi, { ...assetWithProof, creator }).sendAndConfirm(umi)
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}
