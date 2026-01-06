---
title: 컬렉션 검증
metaTitle: 컬렉션 검증 | Bubblegum
description: Bubblegum에서 컬렉션을 설정, 검증 및 검증 취소하는 방법을 알아봅니다.
---

압축 NFT에 컬렉션이 설정될 때마다 컬렉션의 업데이트 권한 또는 승인된 컬렉션 위임자가 cNFT에서 해당 컬렉션을 검증 및/또는 검증 취소할 수 있습니다. {% .lead %}

기술적으로 이는 cNFT의 **컬렉션** 객체에서 **검증됨** 부울을 토글하여 컬렉션 권한이 이 압축 NFT가 컬렉션의 일부라는 것을 승인했음을 누구에게나 알립니다.

NFT와 관련된 컬렉션 개념에 익숙하지 않은 경우, 컬렉션은 다른 NFT를 그룹화하는 데 사용할 수 있는 특수 비압축 NFT입니다. 따라서 **컬렉션 NFT**의 데이터는 전체 컬렉션의 이름과 브랜딩을 설명하는 데 사용됩니다. [여기에서 Metaplex 검증된 컬렉션에 대해 자세히 알아볼 수 있습니다](/ko/smart-contracts/token-metadata/collections).

[여기에 문서화된](/ko/smart-contracts/bubblegum/mint-cnfts#minting-to-a-collection) **컬렉션에 민트 V1** 명령을 사용하여 압축 NFT를 컬렉션에 직접 발행할 수 있습니다. 그러나 컬렉션 없이 cNFT를 이미 발행한 경우, 해당 cNFT에서 컬렉션을 검증, 검증 취소 및 설정하는 방법을 살펴보겠습니다.

## 컬렉션 검증

Bubblegum 프로그램의 **컬렉션 검증** 명령을 사용하여 압축 NFT의 **검증됨** 부울을 `true`로 설정할 수 있습니다. 이것이 작동하려면 **컬렉션** 객체가 이미 cNFT에 설정되어 있어야 합니다(예: 발행 시).

명령은 다음 매개변수를 허용합니다:

- **컬렉션 민트**: 컬렉션 NFT의 민트 계정입니다.
- **컬렉션 권한**: 컬렉션 NFT의 업데이트 권한 또는 승인된 컬렉션 위임자(서명자). 컬렉션 권한이 위임 권한인 경우 프로그램은 새로운 통합 **메타데이터 위임자** 시스템과 레거시 **컬렉션 권한 레코드** 계정을 모두 지원합니다. 적절한 PDA를 **컬렉션 권한 레코드 PDA** 매개변수에 전달하기만 하면 됩니다.

또한 이 명령은 결국 Bubblegum 트리의 리프를 교체하므로 압축 NFT의 무결성을 확인하기 위해 더 많은 매개변수를 제공해야 합니다. 이러한 매개변수는 리프를 변경하는 모든 명령에 공통적이므로 [다음 FAQ](/ko/smart-contracts/bubblegum-v2/faq#replace-leaf-instruction-arguments)에 문서화되어 있습니다. 다행히도 Metaplex DAS API를 사용하여 이러한 매개변수를 자동으로 가져오는 헬퍼 메서드를 사용할 수 있습니다.

{% dialect-switcher title="압축 NFT의 컬렉션 검증" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import {
  getAssetWithProof,
  verifyCollection,
} from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
await verifyCollection(umi, {
  ...assetWithProof,
  collectionMint,
  collectionAuthority,
}).sendAndConfirm(umi)
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 컬렉션 설정 및 검증

**컬렉션** 객체가 아직 압축 NFT에 설정되지 않은 경우 **컬렉션 설정 및 검증** 명령을 사용하여 설정하고 동시에 검증할 수 있습니다. 이 명령은 **컬렉션 검증** 명령과 동일한 매개변수를 허용하지만 컬렉션 권한과 다른 경우 **트리 생성자 또는 위임자** 속성을 서명자로 전달해야 합니다.

{% dialect-switcher title="압축 NFT의 컬렉션 설정 및 검증" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import {
  getAssetWithProof,
  setAndVerifyCollection,
} from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
await setAndVerifyCollection(umi, {
  ...assetWithProof,
  treeCreatorOrDelegate,
  collectionMint,
  collectionAuthority,
}).sendAndConfirm(umi)
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 컬렉션 검증 취소

컬렉션의 업데이트 권한은 **컬렉션 검증 취소** 명령을 사용하여 압축 NFT의 컬렉션을 검증 취소할 수도 있습니다. 이 명령을 보내려면 cNFT의 **컬렉션** 객체가 이미 설정되고 검증되어 있어야 합니다. **컬렉션 검증 취소** 명령에 필요한 속성은 **컬렉션 검증** 명령에 필요한 속성과 동일합니다.

{% dialect-switcher title="압축 NFT의 컬렉션 검증 취소" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import {
  getAssetWithProof,
  unverifyCollection,
} from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
await unverifyCollection(umi, {
  ...assetWithProof,
  collectionMint,
  collectionAuthority,
}).sendAndConfirm(umi)
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}
