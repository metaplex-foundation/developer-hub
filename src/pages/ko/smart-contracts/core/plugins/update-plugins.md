---
title: 플러그인 업데이트
metaTitle: 플러그인 업데이트 | Core
description: updatePlugin 함수를 사용하여 MPL Core 에셋과 컬렉션의 기존 플러그인을 업데이트하는 방법을 알아보세요.
---

MPL Core 에셋과 컬렉션에 추가된 많은 플러그인은 나중에 업데이트할 수 있습니다. `updatePlugin` 함수를 사용하면 속성 변경, 로열티 업데이트, 동결 상태 수정 등 플러그인 데이터를 수정할 수 있습니다.

{% totem %}
{% totem-accordion title="기술 인스트럭션 상세" %}

**인스트럭션 계정 목록**

| 계정          | 설명                                            |
| ------------- | ----------------------------------------------- |
| asset         | MPL Core 에셋의 주소.                           |
| collection    | Core 에셋이 속한 컬렉션.                        |
| payer         | 스토리지 수수료를 지불하는 계정.                |
| authority     | 업데이트 권한이 있는 소유자 또는 위임자.        |
| systemProgram | 시스템 프로그램 계정.                           |
| logWrapper    | SPL Noop 프로그램.                              |

**인스트럭션 인자**

| 인자   | 설명                              |
| ------ | --------------------------------- |
| plugin | 업데이트할 플러그인 타입과 데이터. |

일부 계정/인자는 사용 편의를 위해 SDK에서 추상화되거나 선택사항일 수 있습니다.
자세한 TypeDoc 문서는 다음을 참조하세요:
- [updatePlugin](https://mpl-core.typedoc.metaplex.com/functions/updatePlugin.html)
- [updateCollectionPlugin](https://mpl-core.typedoc.metaplex.com/functions/updateCollectionPlugin.html)

참고: JavaScript SDK에서 updatePlugin은 data 래퍼 없이 플러그인 데이터를 전달받습니다(예: `{ type: 'FreezeDelegate', frozen: true }`). 반면 addPlugin은 data 아래에 데이터를 래핑합니다(예: `{ type: 'FreezeDelegate', data: { frozen: true } }`). 이는 createAsset/createCollection 플러그인 목록에서 사용되는 형태와 동일합니다.

{% /totem-accordion %}
{% /totem %}

## 에셋의 플러그인 업데이트

### 기본 플러그인 업데이트 예제

Attributes 플러그인을 예로 들어 MPL Core 에셋의 플러그인을 업데이트하는 방법입니다:

{% dialect-switcher title="에셋의 플러그인 업데이트" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'

(async () => {
  const assetAddress = publicKey('11111111111111111111111111111111')

  // 현재 에셋을 가져와 기존 플러그인 데이터 확인
  const asset = await fetchAsset(umi, assetAddress, {
    skipDerivePlugins: false,
  })

  // 새 데이터로 Attributes 플러그인 업데이트
  await updatePlugin(umi, {
    asset: assetAddress,
    plugin: {
      type: 'Attributes',
      attributeList: [
        { key: 'level', value: '5' },        // 업데이트된 값
        { key: 'rarity', value: 'legendary' }, // 새 속성
        { key: 'power', value: '150' },      // 새 속성
      ],
    },
  }).sendAndConfirm(umi)
})();
```

{% /dialect %}
{% /dialect-switcher %}

### Royalties 플러그인 업데이트

{% dialect-switcher title="Royalties 플러그인 업데이트" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, ruleSet } from '@metaplex-foundation/mpl-core'

(async () => {
  const assetAddress = publicKey('11111111111111111111111111111111')
  const creator1 = publicKey('22222222222222222222222222222222')
  const creator2 = publicKey('33333333333333333333333333333333')

  await updatePlugin(umi, {
    asset: assetAddress,
    plugin: {
      type: 'Royalties',
      basisPoints: 750, // 500에서 750으로 업데이트 (7.5%)
      creators: [
        { address: creator1, percentage: 70 }, // 업데이트된 분배
        { address: creator2, percentage: 30 },
      ],
      ruleSet: ruleSet('ProgramAllowList', [
        [
          publicKey('44444444444444444444444444444444'),
          publicKey('55555555555555555555555555555555'),
        ],
      ]),
    },
  }).sendAndConfirm(umi)
})();
```

{% /dialect %}
{% /dialect-switcher %}

### 상태 기반 플러그인 업데이트

Freeze Delegate 플러그인처럼 토글 가능한 간단한 상태를 저장하는 플러그인도 있습니다:

{% dialect-switcher title="동결 상태 업데이트" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin } from '@metaplex-foundation/mpl-core'

(async () => {
  const assetAddress = publicKey('11111111111111111111111111111111')

  // 에셋 동결
  await updatePlugin(umi, {
    asset: assetAddress,
    plugin: {
      type: 'FreezeDelegate',
      frozen: true, // true로 설정하여 동결, false로 해제
    },
  }).sendAndConfirm(umi)

  // 나중에 에셋 동결 해제
  await updatePlugin(umi, {
    asset: assetAddress,
    plugin: {
      type: 'FreezeDelegate',
      frozen: false, // 에셋 동결 해제
    },
  }).sendAndConfirm(umi)
})();
```

{% /dialect %}
{% /dialect-switcher %}

## 컬렉션의 플러그인 업데이트

컬렉션 플러그인은 에셋 플러그인과 유사하게 작동하지만 `updateCollectionPlugin` 함수를 사용합니다:

{% dialect-switcher title="컬렉션의 플러그인 업데이트" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updateCollectionPlugin, ruleSet } from '@metaplex-foundation/mpl-core'

(async () => {
  const collectionAddress = publicKey('11111111111111111111111111111111')
  const creator1 = publicKey('22222222222222222222222222222222')
  const creator2 = publicKey('33333333333333333333333333333333')

  // 컬렉션 전체 로열티 업데이트
  await updateCollectionPlugin(umi, {
    collection: collectionAddress,
    plugin: {
      type: 'Royalties',
      basisPoints: 600, // 컬렉션에 6% 로열티
      creators: [
        { address: creator1, percentage: 80 },
        { address: creator2, percentage: 20 },
      ],
      ruleSet: ruleSet('None'),
    },
  }).sendAndConfirm(umi)
})();
```

{% /dialect %}
{% /dialect-switcher %}

## 복잡한 플러그인 데이터 작업

### 플러그인의 목록 관리

Autograph나 Verified Creators 같은 일부 플러그인은 데이터 목록을 유지합니다. 이러한 플러그인을 업데이트할 때는 유지하려는 전체 목록을 전달해야 합니다:

{% dialect-switcher title="목록 기반 플러그인 업데이트" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'

(async () => {
  const assetAddress = publicKey('11111111111111111111111111111111')

  // 먼저 현재 에셋을 가져와 기존 서명 확인
  const asset = await fetchAsset(umi, assetAddress, {
    skipDerivePlugins: false,
  })

  // 기존 서명을 유지하면서 새 서명 추가
  const newAutograph = {
    address: umi.identity.publicKey,
    message: "멋진 NFT! 컬렉터 서명."
  }

  // 기존 서명과 새 서명을 모두 포함
  const updatedAutographs = [...asset.autograph.signatures, newAutograph]

  await updatePlugin(umi, {
    asset: assetAddress,
    plugin: {
      type: 'Autograph',
      signatures: updatedAutographs, // 새 추가를 포함한 전체 목록
    },
    authority: umi.identity,
  }).sendAndConfirm(umi)
})();
```

{% /dialect %}
{% /dialect-switcher %}

### 목록에서 항목 제거

{% dialect-switcher title="플러그인 목록에서 항목 제거" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'

(async () => {
  const assetAddress = publicKey('11111111111111111111111111111111')
  const autographToRemove = publicKey('44444444444444444444444444444444')

  // 현재 에셋 데이터 가져오기
  const asset = await fetchAsset(umi, assetAddress, {
    skipDerivePlugins: false,
  })

  // 제거하려는 서명 필터링
  const filteredAutographs = asset.autograph.signatures.filter(
    (autograph) => autograph.address !== autographToRemove
  )

  await updatePlugin(umi, {
    asset: assetAddress,
    plugin: {
      type: 'Autograph',
      signatures: filteredAutographs, // 제거된 항목 없는 목록
    },
    authority: umi.identity,
  }).sendAndConfirm(umi)
})();
```

{% /dialect %}
{% /dialect-switcher %}

## 권한 요구사항

플러그인마다 업데이트에 필요한 권한이 다릅니다:

- **Authority Managed 플러그인** (Royalties, Attributes, Update Delegate): 에셋 또는 컬렉션의 **authority** 필요
- **Owner Managed 플러그인** (Autograph, Freeze Delegate): 에셋의 **owner** 또는 플러그인의 특정 authority 필요
- **Verified Creators 플러그인**: 크리에이터 추가/제거에는 **update authority** 필요, 단 개별 **크리에이터는 자신을 검증 가능**

## 오류 처리

플러그인 업데이트 시 일반적인 오류:

- **Authority 불일치**: 플러그인 타입에 맞는 올바른 authority로 서명하는지 확인
- **플러그인 없음**: 업데이트하기 전에 에셋/컬렉션에 플러그인이 존재해야 함
- **잘못된 데이터**: 플러그인 데이터가 예상 구조와 제약조건을 준수해야 함
- **컬렉션 불일치**: 에셋이 컬렉션의 일부인 경우 업데이트에 컬렉션을 포함해야 할 수 있음

## 모범 사례

1. **업데이트 전 가져오기**: 항상 현재 에셋/컬렉션 상태를 가져와 기존 플러그인 데이터 확인
2. **기존 데이터 보존**: 목록 기반 플러그인 업데이트 시 유지하려는 기존 데이터 포함
3. **적절한 authority 사용**: 각 플러그인 타입에 맞는 올바른 서명 authority 사용
4. **배치 업데이트**: 여러 플러그인을 업데이트하는 경우 효율성을 위해 작업 배치 고려
5. **데이터 검증**: 업데이트 데이터가 플러그인 요구사항을 충족하는지 확인 (예: 크리에이터 비율 합계가 100%)

## 다음 단계

- 개별 플러그인 문서에서 특정 플러그인 업데이트에 대해 알아보기
- 사용 가능한 모든 플러그인은 [플러그인 개요](/core/plugins) 참조
- [플러그인 추가](/core/plugins/adding-plugins) 및 [플러그인 제거](/core/plugins/removing-plugins) 확인
- 자세한 API 문서는 [MPL Core TypeDoc](https://mpl-core.typedoc.metaplex.com) 방문
