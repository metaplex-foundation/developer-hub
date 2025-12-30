---
title: 압축 NFT 압축 해제
metaTitle: 압축 NFT 압축 해제 | Bubblegum
description: Bubblegum에서 압축 NFT를 상환하고 압축 해제하는 방법을 알아봅니다.
---

{% callout type="note" title="v1 기능" %}

Token Metadata NFT로의 압축 해제는 Bubblegum v1에서만 사용할 수 있습니다.

{% /callout %}

압축 NFT의 소유자는 이를 일반 NFT로 압축 해제할 수 있습니다. {% .lead %}

이는 NFT에 대한 민트 계정, 메타데이터 계정 및 마스터 에디션 계정과 같은 온체인 계정이 생성됨을 의미합니다. 이를 통해 NFT는 압축 NFT로는 수행할 수 없는 특정 작업을 수행하고, 압축 NFT를 지원하지 않는 플랫폼과 상호 작용하며, 일반적으로 NFT 생태계와의 상호 운용성을 높일 수 있습니다.

## 압축 해제 프로세스

압축 NFT의 압축 해제는 NFT 소유자가 시작하는 2단계 프로세스입니다.

1. 먼저 소유자는 압축 NFT를 바우처로 **상환**해야 합니다. 이렇게 하면 Bubblegum 트리에서 리프가 제거되고 리프가 한때 트리에 존재했다는 증거 역할을 하는 바우처 계정이 생성됩니다.

2. 그런 다음 소유자는 바우처를 일반 NFT로 **압축 해제**해야 합니다. 이 시점에서 일반 NFT의 모든 계정이 압축 NFT와 동일한 데이터로 생성됩니다. 또는 소유자가 **상환 취소** 명령을 사용하여 프로세스를 되돌릴 수 있으며, 이렇게 하면 Bubblegum 트리에 리프가 복원되고 바우처 계정이 닫힙니다. cNFT가 완전히 압축 해제되면 **상환 취소** 명령을 더 이상 사용할 수 없으므로 프로세스를 되돌릴 수 없습니다.

{% diagram %}

{% node #merkle-tree-wrapper %}
{% node #merkle-tree label="Merkle 트리 계정" theme="blue" /%}
{% node label="소유자: 계정 압축 프로그램" theme="dimmed" /%}
{% /node %}

{% node #tree-config-pda parent="merkle-tree" x="87" y="-60" label="PDA" theme="crimson" /%}

{% node #tree-config parent="tree-config-pda" x="-63" y="-80" %}
{% node label="트리 구성 계정" theme="crimson" /%}
{% node label="소유자: Bubblegum 프로그램" theme="dimmed" /%}
{% /node %}

{% node #voucher-wrapper parent="merkle-tree" x="350" %}
{% node #voucher label="바우처 계정" theme="crimson" /%}
{% node label="소유자: Bubblegum 프로그램" theme="dimmed" /%}
{% /node %}

{% node parent="voucher" x="320" %}
{% node #mint label="민트 계정" theme="blue" /%}
{% node label="소유자: 토큰 프로그램" theme="dimmed" /%}
{% /node %}

{% node #edition-pda parent="mint" x="80" y="-100" label="PDA" theme="crimson" /%}
{% node #metadata-pda parent="mint" x="80" y="-200" label="PDA" theme="crimson" /%}

{% node parent="edition-pda" x="-250" %}
{% node #edition label="마스터 에디션 계정" theme="crimson" /%}
{% node label="소유자: 토큰 메타데이터 프로그램" theme="dimmed" /%}
{% /node %}

{% node parent="metadata-pda" x="-250" %}
{% node #metadata label="메타데이터 계정" theme="crimson" /%}
{% node label="소유자: 토큰 메타데이터 프로그램" theme="dimmed" /%}
{% /node %}

{% edge from="merkle-tree" to="tree-config-pda" path="straight" /%}
{% edge from="tree-config-pda" to="tree-config" path="straight" /%}
{% edge from="merkle-tree" to="voucher" animated=true label="1️⃣  상환" theme="mint" /%}
{% edge from="voucher" to="mint" animated=true label="2️⃣  압축 해제" theme="mint" /%}
{% edge from="voucher-wrapper" to="merkle-tree-wrapper" animated=true label="2️⃣  상환 취소" fromPosition="bottom" toPosition="bottom" theme="red" labelX=175 /%}
{% edge from="mint" to="edition-pda" fromPosition="right" toPosition="right" /%}
{% edge from="mint" to="metadata-pda" fromPosition="right" toPosition="right" /%}
{% edge from="edition-pda" to="edition" path="straight" /%}
{% edge from="metadata-pda" to="metadata" path="straight" /%}

{% /diagram %}

## 압축 NFT 상환

압축 해제 프로세스의 첫 번째 단계를 시작하려면 압축 NFT의 소유자가 **상환** 명령을 보내고 트랜잭션에 서명해야 합니다. 이렇게 하면 다음 압축 해제 프로세스 단계에서 사용할 cNFT에 대한 바우처 계정이 생성됩니다.

이 명령은 Bubblegum 트리에서 리프를 제거합니다. 따라서 제거할 압축 NFT의 무결성을 확인하기 위해 추가 매개변수를 제공해야 합니다. 이러한 매개변수는 리프를 변경하는 모든 명령에 공통적이므로 [다음 FAQ](/ko/smart-contracts/bubblegum-v2/faq#replace-leaf-instruction-arguments)에 문서화되어 있습니다. 다행히도 Metaplex DAS API를 사용하여 이러한 매개변수를 자동으로 가져오는 헬퍼 메서드를 사용할 수 있습니다.

{% dialect-switcher title="압축 NFT 상환" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import { getAssetWithProof, redeem } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId)
await redeem(umi, {
  ...assetWithProof,
  leafOwner: currentLeafOwner,
}).sendAndConfirm(umi)
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 상환된 NFT 압축 해제

압축 해제 프로세스를 완료하려면 cNFT의 소유자가 상환된 바우처 계정을 일반 NFT로 변환하는 **압축 해제** 명령을 보내야 합니다. 다음 매개변수를 제공해야 합니다:

- **민트**: 생성할 NFT의 민트 주소입니다. 이는 압축 NFT의 **자산 ID**, 즉 Merkle 트리 주소와 리프 인덱스에서 파생된 PDA여야 합니다.
- **바우처**: 이전 단계에서 생성된 바우처 계정의 주소입니다. 이 주소도 Merkle 트리 주소와 리프 인덱스에서 파생됩니다.
- **메타데이터**: cNFT의 모든 데이터를 포함하는 메타데이터 객체입니다. 이 속성은 압축 NFT의 데이터와 정확히 일치해야 합니다. 그렇지 않으면 해시가 일치하지 않아 압축 해제가 실패합니다.

여기서도 SDK에서 제공하는 헬퍼 함수를 사용하여 Metaplex DAS API에서 이러한 속성의 대부분을 가져오고 파싱할 수 있습니다.

{% dialect-switcher title="상환된 압축 NFT 압축 해제" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import {
  getAssetWithProof,
  findVoucherPda,
  decompressV1,
} from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId)
await decompressV1(umi, {
  ...assetWithProof,
  leafOwner: currentLeafOwner,
  mint: assetId,
  voucher: findVoucherPda(umi, assetWithProof),
}).sendAndConfirm(umi)
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 상환된 NFT 취소

소유자가 cNFT 압축 해제에 대해 마음이 바뀌면 **상환 취소** 명령을 보내 압축 해제 프로세스를 취소할 수 있습니다. 이렇게 하면 리프가 트리에 다시 추가되고 바우처 계정이 닫힙니다. **압축 해제** 명령과 마찬가지로 **바우처** 주소를 제공해야 하며 Metaplex DAS API를 사용하여 검색할 수 있는 다른 속성도 제공해야 합니다.

{% dialect-switcher title="상환된 압축 NFT의 압축 해제 취소" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import {
  getAssetWithProof,
  findVoucherPda,
  cancelRedeem,
} from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId)
await cancelRedeem(umi, {
  ...assetWithProof,
  leafOwner: currentLeafOwner,
  voucher: findVoucherPda(umi, assetWithProof),
}).sendAndConfirm(umi)
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}
