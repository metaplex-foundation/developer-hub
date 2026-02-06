---
title: 크리에이터 검증
metaTitle: 크리에이터 검증 | Bubblegum V2
description: Bubblegum에서 크리에이터를 확인하고 확인 해제하는 방법을 알아보세요.
---

압축된 NFT의 메타데이터에 크리에이터 목록이 설정되어 있는 경우 이러한 크리에이터는 특별한 명령어를 사용하여 cNFT에서 자신을 확인하고 확인 해제할 수 있습니다. {% .lead %}

이러한 명령어는 cNFT의 **Creators** 배열의 해당 항목에서 **Verified** 부울을 토글합니다. 이 부울은 지갑과 마켓플레이스와 같은 앱이 어떤 크리에이터가 진짜이고 어떤 크리에이터가 아닌지 알 수 있게 해주므로 중요합니다.

크리에이터는 민트 트랜잭션에 서명하여 [압축된 NFT를 민팅](/ko/smart-contracts/bubblegum-v2/mint-cnfts)할 때 직접 자신을 확인할 수 있다는 점이 주목할 만합니다. 그렇긴 하지만 이제 크리에이터가 기존 압축된 NFT에서 자신을 확인하거나 확인 해제하는 방법을 살펴보겠습니다.

## 크리에이터 확인

Bubblegum 프로그램은 확인하려는 크리에이터가 서명해야 하는 **verifyCreatorV2** 명령어를 제공합니다. 크리에이터는 이미 압축된 NFT의 **Creators** 배열의 일부여야 합니다. 배열의 일부가 아닌 경우 [`updateMetadataV2`](/ko/smart-contracts/bubblegum-v2/update-cnfts) 명령어를 사용하여 **Creators** 배열에 크리에이터를 먼저 추가하세요.

추가로 이 명령어는 Bubblegum 트리의 리프를 교체하므로 압축된 NFT의 무결성을 확인하기 위해 더 많은 매개변수를 제공해야 합니다. 이러한 매개변수는 리프를 변경하는 모든 명령어에 공통이므로 [다음 FAQ](/ko/smart-contracts/bubblegum-v2/faq#replace-leaf-instruction-arguments)에 문서화되어 있습니다. 다행히 Metaplex DAS API를 사용하여 이러한 매개변수를 자동으로 가져오는 도우미 메서드를 사용할 수 있습니다.

{% dialect-switcher title="압축된 NFT의 크리에이터 확인" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import {
  getAssetWithProof,
  verifyCreatorV2,
  MetadataArgsV2Args
} from '@metaplex-foundation/mpl-bubblegum';
import {
  unwrapOption,
  none,
} from '@metaplex-foundation/umi';

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
const collectionOption = unwrapOption(assetWithProof.metadata.collection);
const metadata: MetadataArgsV2Args = {
  name: assetWithProof.metadata.name,
  uri: assetWithProof.metadata.uri,
  sellerFeeBasisPoints: assetWithProof.metadata.sellerFeeBasisPoints,
  collection: collectionOption
    ? collectionOption.key
    : none(),
  creators: assetWithProof.metadata.creators,
};
await verifyCreatorV2(umi, {
  ...assetWithProof,
  metadata,
  creator: umi.identity, // 또는 umi 신원과 다른 서명자
}).sendAndConfirm(umi);
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 크리에이터 확인 해제

**verifyCreatorV2** 명령어와 마찬가지로 **unverifyCreatorV2** 명령어는 크리에이터가 서명해야 하며 압축된 NFT에서 크리에이터의 확인을 해제합니다.

{% dialect-switcher title="압축된 NFT의 크리에이터 확인 해제" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import {
  getAssetWithProof,
  unverifyCreatorV2,
  MetadataArgsV2Args
} from '@metaplex-foundation/mpl-bubblegum'
import {
  unwrapOption,
  none,
} from '@metaplex-foundation/umi';

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
const metadata: MetadataArgsV2Args = {
  name: assetWithProof.metadata.name,
  uri: assetWithProof.metadata.uri,
  sellerFeeBasisPoints: assetWithProof.metadata.sellerFeeBasisPoints,
  collection: unwrapOption(assetWithProof.metadata.collection)
    ? unwrapOption(assetWithProof.metadata.collection)!.key
    : none(),
  creators: assetWithProof.metadata.creators,
};
await unverifyCreatorV2(umi, {
  ...assetWithProof,
  metadata,
  creator: umi.identity, // 또는 umi 신원과 다른 서명자
}).sendAndConfirm(umi);
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}
