---
title: AddBlocker 플러그인
metaTitle: AddBlocker 플러그인 | Metaplex Core
description: Core Asset과 Collection에 새로운 권한 관리 플러그인이 추가되는 것을 방지합니다. 플러그인 구성을 영구적으로 잠금합니다.
updated: '01-31-2026'
keywords:
  - add blocker
  - lock plugins
  - prevent plugins
  - plugin restriction
about:
  - Plugin restriction
  - Configuration locking
  - Authority management
proficiencyLevel: Advanced
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: AddBlocker 이후에도 Freeze Delegate를 추가할 수 있나요?
    a: 네. Freeze Delegate, Transfer Delegate, Burn Delegate와 같은 소유자 관리 플러그인은 AddBlocker가 활성화된 후에도 항상 추가할 수 있습니다.
  - q: AddBlocker를 추가한 후 제거할 수 있나요?
    a: 네, 불변으로 설정되지 않았다면 가능합니다. 권한자가 플러그인을 제거할 수 있습니다. 그러나 이는 AddBlocker를 사용하는 목적에 어긋납니다.
  - q: Collection에 AddBlocker를 추가하면 개별 Asset에 플러그인을 추가할 수 있나요?
    a: 아니요. Collection 수준의 AddBlocker는 Collection과 모든 Asset 모두에 권한 관리 플러그인 추가를 방지합니다.
  - q: Metaplex가 제가 사용하고 싶은 새 플러그인을 출시하면 어떻게 되나요?
    a: AddBlocker가 활성화되어 있으면 미래에 출시되는 새로운 권한 관리 플러그인도 추가할 수 없습니다. 미리 계획하세요.
  - q: 왜 AddBlocker를 사용해야 하나요?
    a: NFT의 권한 관리 플러그인 구성이 최종적임을 보장하기 위해서입니다. 이는 수집가들에게 로열티, 속성 및 기타 중요한 설정이 수정될 수 없음을 보장합니다.
---
**AddBlocker 플러그인**은 Asset 또는 Collection에 새로운 권한 관리 플러그인이 추가되는 것을 방지합니다. 소유자 관리 플러그인은 여전히 허용하면서 NFT 구성을 잠급니다. {% .lead %}
{% callout title="학습 내용" %}

- 새로운 권한 관리 플러그인 차단
- 어떤 플러그인이 여전히 허용되는지 이해
- Asset과 Collection에 적용
- 잠금 전 플러그인 구성 계획
{% /callout %}

## 요약

**AddBlocker** 플러그인은 새로운 권한 관리 플러그인 추가를 방지하는 권한 관리 플러그인입니다. Freeze Delegate, Transfer Delegate와 같은 소유자 관리 플러그인은 여전히 추가할 수 있습니다.

- 권한 관리 (업데이트 권한자만 추가 가능)
- 새로운 권한 관리 플러그인을 영구적으로 차단
- 소유자 관리 플러그인은 차단되지 않음
- Collection 플러그인은 해당 Collection의 모든 Asset에 영향

## 범위 외

소유자 관리 플러그인 차단 (항상 허용됨), 기존 플러그인 제거, 기존 플러그인 업데이트 차단.

## 빠른 시작

**바로 가기:** [Asset에 추가](#asset에-addblocker-플러그인-추가-코드-예제) · [Collection에 추가](#collection에-addblocker-플러그인-추가-코드-예제)

1. 필요한 모든 권한 관리 플러그인을 먼저 추가
2. 업데이트 권한자로 AddBlocker 플러그인 추가
3. 새로운 권한 관리 플러그인을 추가할 수 없음
{% callout type="note" title="AddBlocker 사용 시기" %}
| 시나리오 | AddBlocker 사용? |
|----------|-----------------|
| 로열티 변경 불가 보장 | ✅ 예 (Royalties를 먼저 추가한 후 AddBlocker) |
| 미래 플러그인 추가 방지 | ✅ 예 |
| 속성 영구 잠금 | ❌ 아니요 (Attributes에 authority `None` 사용) |
| 마켓플레이스 등록 허용 | ✅ 여전히 작동 (소유자 관리 허용) |
| 미래에 새 플러그인 필요 | ❌ AddBlocker 사용하지 않음 |
**AddBlocker 사용**으로 수집가들에게 NFT 구성이 최종적임을 확신시키세요.
{% /callout %}

## 일반적인 사용 사례

- **로열티 보호**: 새로운 Royalties 플러그인 추가를 차단하여 로열티 변경 불가 보장
- **구성 완결성**: 수집가들에게 NFT 플러그인이 변경되지 않음을 보장
- **신뢰 구축**: 구매자들에게 중요한 설정이 잠겨 있음을 증명
- **Collection 표준**: Collection 전체에 일관된 플러그인 구성 적용

## 호환 대상

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

## 인자

`AddBlocker` 플러그인은 인자가 필요하지 않습니다.

## Asset에 addBlocker 플러그인 추가 코드 예제

{% dialect-switcher title="MPL Core Asset에 addBlocker 플러그인 추가" %}
{% dialect title="JavaScript" id="js" %}

```ts
import {
  addPlugin,
} from '@metaplex-foundation/mpl-core'
await addPlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'addBlocker',
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## Collection에 addBlocker 플러그인 추가 코드 예제

{% dialect-switcher title="Collection에 addBlocker 플러그인 추가" %}
{% dialect title="JavaScript" id="js" %}

```ts
import {
  addCollectionPlugin,
} from '@metaplex-foundation/mpl-core'
await addCollectionPlugin(umi, {
  collection: collection.publicKey,
  plugin: {
    type: 'AddBlocker',
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## 일반적인 오류

### `Authority mismatch`

업데이트 권한자만 AddBlocker 플러그인을 추가할 수 있습니다.

### `Cannot add plugin - AddBlocker active`

AddBlocker 플러그인이 새로운 권한 관리 플러그인을 방지하고 있습니다. 이는 예상된 동작입니다.

## 참고 사항

- AddBlocker를 추가하기 전에 플러그인 구성을 신중하게 계획하세요
- 차단되면 미래의 Metaplex 플러그인 기능을 추가할 수 없습니다
- 소유자 관리 플러그인 (Freeze, Transfer, Burn Delegates)은 항상 허용됩니다
- Collection에 추가하면 모든 Asset의 플러그인도 차단됩니다

## 빠른 참조

### 차단되는 항목

| 플러그인 유형 | 차단됨 |
|-------------|---------|
| 권한 관리 | ✅ 차단됨 |
| 소유자 관리 | ❌ 여전히 허용 |
| 영구 | ✅ 차단됨 (생성 시 추가해야 함) |

### 일반적인 권한 관리 플러그인 (차단됨)

- Royalties
- Attributes
- Verified Creators
- ImmutableMetadata
- AddBlocker (자체)

### 소유자 관리 플러그인 (여전히 허용)

- Freeze Delegate
- Transfer Delegate
- Burn Delegate

## FAQ

### AddBlocker 이후에도 Freeze Delegate를 추가할 수 있나요?

네. Freeze Delegate, Transfer Delegate, Burn Delegate와 같은 소유자 관리 플러그인은 AddBlocker가 활성화된 후에도 항상 추가할 수 있습니다.

### AddBlocker를 추가한 후 제거할 수 있나요?

네, 불변으로 설정되지 않았다면 가능합니다. 권한자가 플러그인을 제거할 수 있습니다. 그러나 이는 AddBlocker를 사용하는 목적에 어긋납니다.

### Collection에 AddBlocker를 추가하면 개별 Asset에 플러그인을 추가할 수 있나요?

아니요. Collection 수준의 AddBlocker는 Collection과 모든 Asset 모두에 권한 관리 플러그인 추가를 방지합니다.

### Metaplex가 제가 사용하고 싶은 새 플러그인을 출시하면 어떻게 되나요?

AddBlocker가 활성화되어 있으면 미래에 출시되는 새로운 권한 관리 플러그인도 추가할 수 없습니다. 미리 계획하세요.

### 왜 AddBlocker를 사용해야 하나요?

NFT의 권한 관리 플러그인 구성이 최종적임을 보장하기 위해서입니다. 이는 수집가들에게 로열티, 속성 및 기타 중요한 설정이 새 플러그인 추가로 수정될 수 없음을 보장합니다.

## 관련 플러그인

- [ImmutableMetadata](/smart-contracts/core/plugins/immutableMetadata) - 이름과 URI를 영구적으로 잠금
- [Royalties](/smart-contracts/core/plugins/royalties) - AddBlocker 사용 전 로열티 설정
- [Attributes](/smart-contracts/core/plugins/attribute) - AddBlocker 사용 전 속성 추가

## 용어집

| 용어 | 정의 |
|------|------------|
| **AddBlocker** | 새로운 권한 관리 플러그인을 방지하는 플러그인 |
| **권한 관리** | 업데이트 권한자가 제어하는 플러그인 |
| **소유자 관리** | Asset 소유자가 제어하는 플러그인 |
| **플러그인 구성** | Asset/Collection에 첨부된 플러그인 세트 |
| **상속** | Asset이 Collection 수준의 제한을 받음 |
