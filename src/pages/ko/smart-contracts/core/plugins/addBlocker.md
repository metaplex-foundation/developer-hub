---
title: AddBlocker 플러그인
metaTitle: AddBlocker 플러그인 | Metaplex Core
description: Core NFT 애셋 및 컬렉션에 새로운 권한 관리 플러그인이 추가되는 것을 방지합니다. 플러그인 구성을 영구적으로 잠글 수 있습니다.
---

**AddBlocker 플러그인**은 애셋 또는 컬렉션에 새로운 권한 관리 플러그인이 추가되는 것을 방지합니다. 소유자 관리 플러그인은 계속 허용하면서 NFT 구성을 잠글 수 있습니다. {% .lead %}

{% callout title="배울 내용" %}

- 새로운 권한 관리 플러그인 차단
- 여전히 허용되는 플러그인 이해
- 애셋 및 컬렉션에 적용
- 잠금 전 플러그인 구성 계획

{% /callout %}

## 개요

**AddBlocker** 플러그인은 새로운 권한 관리 플러그인 추가를 방지하는 권한 관리 플러그인입니다. 소유자 관리 플러그인(Freeze Delegate, Transfer Delegate 등)은 계속 추가할 수 있습니다.

- 권한 관리형 (업데이트 권한만 추가 가능)
- 새로운 권한 관리 플러그인을 영구적으로 차단
- 소유자 관리 플러그인은 차단되지 않음
- 컬렉션 플러그인은 해당 컬렉션의 모든 애셋에 영향

## 범위 외

소유자 관리 플러그인 차단(항상 허용), 기존 플러그인 제거, 기존 플러그인 업데이트 차단.

## 빠른 시작

**이동:** [애셋에 추가](#애셋에-addblocker-플러그인-추가하기-코드-예제) · [컬렉션에 추가](#컬렉션에-addblocker-플러그인-추가하기-코드-예제)

1. 필요한 모든 권한 관리 플러그인 추가
2. 업데이트 권한으로 AddBlocker 플러그인 추가
3. 새로운 권한 관리 플러그인 추가 불가

{% callout type="note" title="AddBlocker를 사용해야 할 때" %}

| 시나리오 | AddBlocker 사용? |
|----------|-----------------|
| 로열티 변경 불가 보장 | ✅ 예 (먼저 Royalties 추가, 그 다음 AddBlocker) |
| 향후 플러그인 추가 방지 | ✅ 예 |
| 속성 영구 잠금 | ❌ 아니오 (Attributes에서 권한을 `None`으로 사용) |
| 마켓플레이스 리스팅 허용 | ✅ 여전히 작동 (소유자 관리형 허용) |
| 향후 새 플러그인 필요 | ❌ AddBlocker 사용 금지 |

**AddBlocker를 사용**하여 수집가에게 NFT 구성이 최종임을 보장하세요.

{% /callout %}

## 일반적인 사용 사례

- **로열티 보호**: 새 Royalties 플러그인 추가를 차단하여 로열티 변경 방지
- **구성 확정**: 수집가에게 NFT 플러그인이 변경되지 않을 것임을 보장
- **신뢰 구축**: 구매자에게 중요한 설정이 잠겨 있음을 증명
- **컬렉션 표준**: 컬렉션 전체에서 일관된 플러그인 구성 강제

## 호환성

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

## 인수

`AddBlocker` 플러그인은 인수가 필요하지 않습니다.

## 애셋에 addBlocker 플러그인 추가하기 코드 예제

{% dialect-switcher title="MPL Core 애셋에 addBlocker 플러그인 추가하기" %}
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

## 컬렉션에 addBlocker 플러그인 추가하기 코드 예제

{% dialect-switcher title="컬렉션에 addBlocker 플러그인 추가하기" %}
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

업데이트 권한만 AddBlocker 플러그인을 추가할 수 있습니다.

### `Cannot add plugin - AddBlocker active`

AddBlocker 플러그인이 새로운 권한 관리 플러그인을 방지하고 있습니다. 이는 예상된 동작입니다.

## 참고 사항

- AddBlocker를 추가하기 전에 플러그인 구성을 신중하게 계획하세요
- 향후 Metaplex 플러그인 기능은 차단되면 추가할 수 없습니다
- 소유자 관리 플러그인(Freeze, Transfer, Burn Delegates)은 항상 허용됩니다
- 컬렉션에 추가하면 모든 애셋의 플러그인도 차단됩니다

## 빠른 참조

### 차단되는 것

| 플러그인 유형 | 차단 |
|-------------|---------|
| 권한 관리형 | ✅ 차단됨 |
| 소유자 관리형 | ❌ 여전히 허용 |
| 영구형 | ✅ 차단됨 (생성 시 추가 필수) |

### 일반적인 권한 관리 플러그인 (차단됨)

- Royalties
- Attributes
- Verified Creators
- ImmutableMetadata
- AddBlocker (자신)

### 소유자 관리 플러그인 (여전히 허용)

- Freeze Delegate
- Transfer Delegate
- Burn Delegate

## FAQ

### AddBlocker 후에도 Freeze Delegate를 추가할 수 있나요?

예. Freeze Delegate, Transfer Delegate, Burn Delegate와 같은 소유자 관리 플러그인은 AddBlocker가 활성화된 후에도 항상 추가할 수 있습니다.

### AddBlocker를 추가한 후 제거할 수 있나요?

예, 불변으로 만들지 않았다면. 권한자가 플러그인을 제거할 수 있습니다. 그러나 이는 AddBlocker를 사용하는 목적에 어긋납니다.

### 컬렉션에 AddBlocker를 추가하면 개별 애셋에 플러그인을 추가할 수 있나요?

아니오. 컬렉션 수준 AddBlocker는 컬렉션과 모든 애셋 모두에 권한 관리 플러그인 추가를 방지합니다.

### Metaplex가 사용하고 싶은 새 플러그인을 출시하면 어떻게 되나요?

AddBlocker가 활성화되면 향후 출시되는 새로운 권한 관리 플러그인도 추가할 수 없습니다. 그에 따라 계획하세요.

### 왜 AddBlocker를 사용하나요?

NFT의 권한 관리 플러그인 구성이 최종임을 보장하기 위해서입니다. 이는 수집가에게 로열티, 속성 및 기타 중요한 설정이 새 플러그인 추가로 수정될 수 없음을 보장합니다.

## 관련 플러그인

- [ImmutableMetadata](/ko/smart-contracts/core/plugins/immutableMetadata) - 이름과 URI를 영구적으로 잠금
- [Royalties](/ko/smart-contracts/core/plugins/royalties) - AddBlocker 사용 전에 로열티 설정
- [Attributes](/ko/smart-contracts/core/plugins/attribute) - AddBlocker 사용 전에 속성 추가

## 용어집

| 용어 | 정의 |
|------|------------|
| **AddBlocker** | 새로운 권한 관리 플러그인을 방지하는 플러그인 |
| **권한 관리형** | 업데이트 권한에 의해 제어되는 플러그인 |
| **소유자 관리형** | 애셋 소유자에 의해 제어되는 플러그인 |
| **플러그인 구성** | 애셋/컬렉션에 첨부된 플러그인 세트 |
| **상속** | 애셋이 컬렉션 수준 제한을 받는 것 |

---

*Metaplex Foundation 관리 · 2026년 1월 최종 확인 · @metaplex-foundation/mpl-core에 적용*
