---
title: ImmutableMetadata 플러그인
metaTitle: ImmutableMetadata 플러그인 | Metaplex Core
description: Core NFT Asset 및 Collection 메타데이터를 영구적으로 불변으로 만듭니다. 이름과 URI를 잠가 향후 변경을 방지합니다.
updated: '01-31-2026'
keywords:
  - immutable metadata
  - lock metadata
  - permanent NFT
  - provenance
about:
  - Metadata immutability
  - Provenance protection
  - Data locking
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: ImmutableMetadata 추가를 취소할 수 있나요?
    a: 아니요. 한번 추가되면 ImmutableMetadata 플러그인은 제거할 수 없습니다. 메타데이터는 영구적으로 잠깁니다. 이는 출처 보장을 위해 의도된 설계입니다.
  - q: 정확히 무엇이 불변이 되나요?
    a: Asset 또는 Collection의 name과 uri 필드입니다. 다른 플러그인 데이터는 영향을 받지 않습니다 - 개별 플러그인의 데이터를 불변으로 만들려면 권한 None을 사용하세요.
  - q: Collection에 이것을 추가하면 기존 Asset들도 영향을 받나요?
    a: 네. ImmutableMetadata가 Collection에 있으면 해당 Collection의 모든 Asset이 불변성을 상속합니다. 메타데이터를 변경할 수 없게 됩니다.
  - q: Asset 생성 시 이것을 추가할 수 있나요?
    a: 네. create() 중에 ImmutableMetadata를 추가하여 처음부터 메타데이터가 잠기도록 할 수 있습니다.
  - q: 왜 불변 메타데이터가 필요한가요?
    a: 불변 메타데이터는 영구적인 출처를 제공합니다 - 수집가들은 NFT의 이름과 관련 메타데이터 URI가 절대 변경될 수 없다는 것을 알게 되어 러그풀을 방지합니다.
---
**ImmutableMetadata 플러그인**은 Asset 또는 Collection의 이름과 URI를 영구적으로 잠급니다. 한번 추가되면 누구도 메타데이터를 변경할 수 없어 영구적인 출처를 보장합니다. {% .lead %}
{% callout title="학습 내용" %}
- Asset 메타데이터를 불변으로 만들기
- Collection 메타데이터를 불변으로 만들기
- Collection에서 Asset으로의 상속 이해
- NFT 출처를 영구적으로 보호
{% /callout %}
## 요약
**ImmutableMetadata** 플러그인은 Asset 또는 Collection의 이름과 URI에 대한 모든 변경을 방지하는 권한 관리 플러그인입니다. 한번 추가되면 이 보호는 영구적입니다.
- 권한 관리 (업데이트 권한만 추가 가능)
- 이름과 URI를 영구적으로 변경 불가능하게 만듦
- 추가 후 제거 불가
- Collection 플러그인은 해당 Collection의 모든 Asset에 영향
## 범위 외
다른 플러그인 데이터를 불변으로 만들기 (해당 플러그인에 권한 `None` 사용), 선택적 필드 불변성, 임시 잠금은 범위 외입니다.
## 빠른 시작
**바로가기:** [Asset에 추가](#asset에-immutablemetadata-플러그인-추가-코드-예제) · [Collection에 추가](#collection에-immutablemetadata-플러그인-추가-코드-예제)
1. 메타데이터(이름, URI)가 최종 확정되었는지 확인
2. 업데이트 권한으로 ImmutableMetadata 플러그인 추가
3. 메타데이터가 이제 영구적으로 잠김
{% callout type="note" title="ImmutableMetadata 사용 시기" %}
| 시나리오 | ImmutableMetadata 사용? |
|----------|------------------------|
| 영구 아트워크가 있는 아트 NFT | ✅ 예 |
| 진화하는 스탯이 있는 게임 아이템 | ❌ 아니요 (속성 업데이트 필요) |
| 러그풀 방지 | ✅ 예 |
| 동적/진화하는 NFT | ❌ 아니요 |
| 인증서/자격증 | ✅ 예 |
**ImmutableMetadata 사용**: 영구성이 중요한 아트, 수집품, 인증서에 사용하세요.
**사용하지 마세요**: 업데이트가 필요한 게임 아이템이나 동적 NFT에는 사용하지 마세요.
{% /callout %}
## 일반적인 사용 사례
- **아트 수집품**: 아트워크와 메타데이터가 절대 변경되지 않음을 보장
- **인증서**: 변경할 수 없는 자격증 발급
- **출처 보호**: 메타데이터 잠금으로 러그풀 방지
- **역사적 기록**: NFT 데이터를 영구적으로 보존
- **브랜드 보증**: 수집가에게 NFT의 정체성이 고정됨을 보장
## 호환성
|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |
## 인수
ImmutableMetadata 플러그인은 인수가 필요하지 않습니다.
## Asset에 immutableMetadata 플러그인 추가 코드 예제
{% dialect-switcher title="MPL Core Asset에 Immutability 플러그인 추가" %}
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
## Collection에 immutableMetadata 플러그인 추가 코드 예제
{% dialect-switcher title="Collection에 immutableMetadata 플러그인 추가" %}
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
업데이트 권한만 ImmutableMetadata 플러그인을 추가할 수 있습니다.
### `Cannot update metadata`
ImmutableMetadata 플러그인이 활성화되어 있습니다. 이름과 URI를 변경할 수 없습니다.
## 참고 사항
- 이 작업은 **영구적이며 되돌릴 수 없습니다**
- 이 플러그인을 추가하기 전에 이름과 URI를 다시 확인하세요
- Collection에 추가하면 해당 Collection의 모든 Asset이 불변이 됩니다
- 플러그인은 인수가 없습니다 - 추가하기만 하면 메타데이터가 잠깁니다
## 빠른 참조
### 영향받는 필드
| 필드 | 잠김 |
|-------|--------|
| `name` | ✅ |
| `uri` | ✅ |
| 기타 메타데이터 | ❌ (다른 방법 사용) |
### 상속 동작
| 추가 위치 | 효과 |
|----------|--------|
| Asset | 해당 Asset의 메타데이터만 잠김 |
| Collection | Collection과 모든 Asset의 메타데이터가 잠김 |
## FAQ
### ImmutableMetadata 추가를 취소할 수 있나요?
아니요. 한번 추가되면 ImmutableMetadata 플러그인은 제거할 수 없습니다. 메타데이터는 영구적으로 잠깁니다. 이는 출처 보장을 위해 의도된 설계입니다.
### 정확히 무엇이 불변이 되나요?
Asset 또는 Collection의 `name`과 `uri` 필드입니다. 다른 플러그인 데이터는 영향을 받지 않습니다 - 개별 플러그인의 데이터를 불변으로 만들려면 권한 `None`을 사용하세요.
### Collection에 이것을 추가하면 기존 Asset들도 영향을 받나요?
네. ImmutableMetadata가 Collection에 있으면 해당 Collection의 모든 Asset이 불변성을 상속합니다. 메타데이터를 변경할 수 없게 됩니다.
### Asset 생성 시 이것을 추가할 수 있나요?
네. `create()` 중에 ImmutableMetadata를 추가하여 처음부터 메타데이터가 잠기도록 할 수 있습니다.
### 왜 불변 메타데이터가 필요한가요?
불변 메타데이터는 영구적인 출처를 제공합니다 - 수집가들은 NFT의 이름과 관련 메타데이터 URI가 절대 변경될 수 없다는 것을 알게 되어 창작자가 아트워크나 설명을 바꾸는 러그풀을 방지합니다.
## 관련 플러그인
- [AddBlocker](/smart-contracts/core/plugins/addBlocker) - 새 플러그인 추가 방지 (ImmutableMetadata와 보완적)
- [Attributes](/smart-contracts/core/plugins/attribute) - 온체인 데이터 (ImmutableMetadata에 의해 잠기지 않음)
- [Royalties](/smart-contracts/core/plugins/royalties) - 불변으로 만들기 전에 로열티 설정
## 용어집
| 용어 | 정의 |
|------|------------|
| **불변** | 변경하거나 수정할 수 없음 |
| **메타데이터** | Asset/Collection과 관련된 이름과 URI |
| **출처** | 진위와 소유권의 검증 가능한 기록 |
| **URI** | 오프체인 JSON 메타데이터 링크 |
| **상속** | Asset이 Collection 수준 플러그인 효과를 자동으로 받음 |
