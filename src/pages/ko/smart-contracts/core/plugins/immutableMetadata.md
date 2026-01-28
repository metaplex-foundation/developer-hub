---
title: ImmutableMetadata 플러그인
metaTitle: ImmutableMetadata 플러그인 | Metaplex Core
description: Core NFT 애셋 및 컬렉션의 메타데이터를 영구적으로 불변으로 만듭니다. 향후 변경을 방지하기 위해 name과 URI를 잠급니다.
---

**ImmutableMetadata 플러그인**은 애셋 또는 컬렉션의 name과 URI를 영구적으로 잠급니다. 추가되면 누구도 메타데이터를 변경할 수 없어 영구적인 출처를 보장합니다. {% .lead %}

{% callout title="학습 내용" %}

- 애셋 메타데이터를 불변으로 만들기
- 컬렉션 메타데이터를 불변으로 만들기
- 컬렉션에서 애셋으로의 상속 이해하기
- NFT 출처를 영구적으로 보호하기

{% /callout %}

## 요약

**ImmutableMetadata** 플러그인은 애셋 또는 컬렉션의 name과 URI 변경을 방지하는 권한 관리 플러그인입니다. 추가되면 이 보호는 영구적입니다.

- 권한 관리형 (update authority만 추가 가능)
- name과 URI를 영구적으로 변경 불가능하게 함
- 추가 후 제거 불가
- 컬렉션 플러그인은 해당 컬렉션의 모든 애셋에 영향

## 범위 외

다른 플러그인 데이터를 불변으로 만들기(해당 플러그인에 권한 `None` 사용), 선택적 필드 불변성, 임시 잠금.

## 빠른 시작

**이동:** [애셋에 추가](#애셋에-immutablemetadata-플러그인-추가-코드-예시) · [컬렉션에 추가](#컬렉션에-immutablemetadata-플러그인-추가-코드-예시)

1. 메타데이터(name, URI)가 최종 확정되었는지 확인
2. update authority로 ImmutableMetadata 플러그인 추가
3. 메타데이터가 영구적으로 잠김

{% callout type="note" title="ImmutableMetadata를 사용해야 할 때" %}

| 시나리오 | ImmutableMetadata 사용? |
|----------|------------------------|
| 영구 아트워크가 있는 아트 NFT | ✅ 예 |
| 진화하는 스탯이 있는 게임 아이템 | ❌ 아니요 (속성 업데이트 필요) |
| 러그풀 방지 | ✅ 예 |
| 다이나믹/진화하는 NFT | ❌ 아니요 |
| 인증서/자격증명 | ✅ 예 |

**ImmutableMetadata 사용**: 영속성이 중요한 아트, 수집품, 인증서에.
**사용하지 않음**: 업데이트가 필요한 게임 아이템이나 다이나믹 NFT에.

{% /callout %}

## 일반적인 사용 사례

- **아트 수집품**: 아트워크와 메타데이터가 절대 변경되지 않음을 보장
- **인증서**: 변경할 수 없는 자격증명 발급
- **출처 보호**: 메타데이터를 잠가 러그풀 방지
- **역사적 기록**: NFT 데이터를 영구적으로 보존
- **브랜드 보증**: NFT의 정체성이 고정되었음을 수집가에게 보장

## 호환성

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

## 인수

ImmutableMetadata 플러그인은 인수가 필요하지 않습니다.

## 애셋에 immutableMetadata 플러그인 추가 코드 예시

{% dialect-switcher title="MPL Core 애셋에 Immutability 플러그인 추가" %}
{% dialect title="JavaScript" id="js" %}

```ts
import {
  addPlugin,
} from '@metaplex-foundation/mpl-core'

await addPlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'ImmutableMetadata',
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## 컬렉션에 immutableMetadata 플러그인 추가 코드 예시

{% dialect-switcher title="컬렉션에 immutableMetadata 플러그인 추가" %}
{% dialect title="JavaScript" id="js" %}

```ts
import {
  addCollectionPlugin,
} from '@metaplex-foundation/mpl-core'

await addCollectionPlugin(umi, {
  collection: collection.publicKey,
  plugin: {
    type: 'ImmutableMetadata',
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## 일반적인 오류

### `Authority mismatch`

update authority만 ImmutableMetadata 플러그인을 추가할 수 있습니다.

### `Cannot update metadata`

ImmutableMetadata 플러그인이 활성화되어 있습니다. name과 URI를 변경할 수 없습니다.

## 참고 사항

- 이 작업은 **영구적이며 되돌릴 수 없습니다**
- 이 플러그인을 추가하기 전에 name과 URI를 다시 확인하세요
- 컬렉션에 추가하면 해당 컬렉션의 모든 애셋이 불변이 됩니다
- 플러그인에 인수가 없습니다 — 추가하면 메타데이터가 잠깁니다

## 빠른 참조

### 영향받는 필드

| 필드 | 잠김 |
|------|------|
| `name` | ✅ |
| `uri` | ✅ |
| 기타 메타데이터 | ❌ (다른 방법 사용) |

### 상속 동작

| 추가 대상 | 효과 |
|----------|------|
| 애셋 | 해당 애셋의 메타데이터만 잠김 |
| 컬렉션 | 컬렉션과 모든 애셋의 메타데이터 잠김 |

## FAQ

### ImmutableMetadata 추가를 취소할 수 있나요?

아니요. 추가되면 ImmutableMetadata 플러그인을 제거할 수 없습니다. 메타데이터는 영구적으로 잠깁니다. 이것은 출처 보장을 위한 설계입니다.

### 정확히 무엇이 불변이 되나요?

애셋 또는 컬렉션의 `name`과 `uri` 필드입니다. 다른 플러그인 데이터는 영향받지 않습니다 — 개별 플러그인의 데이터를 불변으로 만들려면 해당 플러그인에 권한 `None`을 사용하세요.

### 컬렉션에 이것을 추가하면 기존 애셋이 영향을 받나요?

예. ImmutableMetadata가 컬렉션에 있으면 해당 컬렉션의 모든 애셋이 불변성을 상속합니다. 그들의 메타데이터는 변경할 수 없습니다.

### 애셋 생성 시 이것을 추가할 수 있나요?

예. `create()` 중에 ImmutableMetadata를 추가하여 메타데이터가 처음부터 잠기도록 할 수 있습니다.

### 왜 불변 메타데이터를 원하나요?

불변 메타데이터는 영구적인 출처를 제공합니다 — 수집가는 NFT의 이름과 관련 메타데이터 URI가 절대 변경되지 않을 것임을 알고, 크리에이터가 아트워크나 설명을 바꾸는 러그풀을 방지합니다.

## 관련 플러그인

- [AddBlocker](/ko/smart-contracts/core/plugins/addBlocker) - 새 플러그인 추가 방지 (ImmutableMetadata와 보완적)
- [Attributes](/ko/smart-contracts/core/plugins/attribute) - 온체인 데이터 (ImmutableMetadata로 잠기지 않음)
- [Royalties](/ko/smart-contracts/core/plugins/royalties) - 불변으로 만들기 전에 로열티 설정

## 용어집

| 용어 | 정의 |
|------|------|
| **Immutable** | 변경하거나 수정할 수 없음 |
| **Metadata** | 애셋/컬렉션과 연결된 name과 URI |
| **Provenance** | 진정성과 소유권의 검증 가능한 기록 |
| **URI** | 오프체인 JSON 메타데이터 링크 |
| **Inheritance** | 애셋이 자동으로 컬렉션 레벨 플러그인 효과를 얻음 |

---

*Metaplex Foundation 관리 · 최종 확인 2026년 1월 · @metaplex-foundation/mpl-core 적용*
