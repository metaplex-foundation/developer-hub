---
title: Autograph 플러그인
metaTitle: Autograph 플러그인 | Metaplex Core
description: Core NFT 애셋에 서명과 메시지를 추가하는 방법을 알아보세요. 아티스트, 유명인, 커뮤니티 멤버로부터 수집 가능한 사인을 만들 수 있습니다.
---

**Autograph 플러그인**은 누구나 애셋이나 컬렉션에 서명과 메시지를 추가할 수 있게 해줍니다. 아티스트, 유명인, 커뮤니티 멤버의 수집 가능한 사인에 완벽합니다. {% .lead %}

{% callout title="학습 내용" %}

- 애셋과 컬렉션에서 Autograph 활성화하기
- 애셋에 서명 추가하기
- 소유자로서 Autograph 제거하기
- Autograph 권한 이해하기

{% /callout %}

## 요약

**Autograph** 플러그인은 메시지와 함께 서명을 저장하는 소유자 관리 플러그인입니다. 활성화되면 누구나 자신의 서명을 추가할 수 있습니다. 소유자는 모든 Autograph를 제거할 수 있습니다.

- 소유자가 플러그인을 추가 (또는 민트 시 update authority가 추가)
- 누구나 자신의 서명을 추가 가능
- 소유자/위임자만 Autograph 제거 가능
- 서명자는 자신의 서명을 제거할 수 없음
- 애셋은 컬렉션에서 Autograph를 상속

## 범위 외

크리에이터 검증([Verified Creators](/ko/smart-contracts/core/plugins/verified-creators) 사용), 로열티, 자동 서명 검증.

## 빠른 시작

**이동:** [플러그인 추가](#애셋에-autograph-플러그인-추가-코드-예제) · [Autograph 추가](#애셋에-autograph-추가-코드-예제) · [Autograph 제거](#애셋에서-autograph-제거-코드-예제)

1. 소유자가 Autograph 플러그인을 추가하여 서명 활성화
2. 누구나 `updatePlugin`으로 자신의 서명 추가 가능
3. 소유자는 모든 Autograph 제거 가능

{% callout type="note" title="Autograph vs Verified Creators" %}

| 기능 | Autograph | Verified Creators |
|------|-----------|-------------------|
| 서명 가능한 사람 | 누구나 | 등록된 크리에이터만 |
| 활성화 권한 | 소유자 | Update authority |
| 자가 제거 | 불가능 | 자신의 검증 해제 가능 |
| 목적 | 수집 가능한 서명 | 크리에이터십 증명 |
| 최적 용도 | 팬 참여, 이벤트 | 팀 귀속 |

**Autograph**는 수집 가능한 서명(사인된 기념품처럼)에 사용.
**[Verified Creators](/ko/smart-contracts/core/plugins/verified-creators)**는 애셋을 만든 사람을 증명하는 데 사용.

{% /callout %}

## 일반적인 사용 사례

- **유명인 사인**: 아티스트가 이벤트에서 NFT에 서명
- **팬 참여**: 커뮤니티 멤버가 한정판에 서명
- **인증**: 실물 아이템 제작자가 디지털 트윈에 서명
- **이벤트 기념품**: 컨퍼런스 연사가 이벤트 NFT에 서명
- **자선 경매**: 여러 유명인이 자선 NFT에 서명

Autograph를 추가하려면 몇 가지 조건이 충족되어야 합니다:

- Autograph 플러그인이 이미 추가되어 있어야 함
- 서명자는 자신의 주소만 추가 가능
- `updatePlugin` 함수를 사용하여 기존 목록과 함께 추가된 서명을 전달해야 함
- 해당 서명자의 기존 Autograph가 없어야 함

{% callout type="note" %}
소유자가 Autograph 플러그인을 추가하면 누구나 자신의 서명을 추가할 수 있습니다. 소유자는 언제든지 제거할 수 있습니다.
{% /callout %}

## 호환성

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

애셋은 컬렉션에서 Autograph를 상속합니다.

## 인수

`autograph` 플러그인은 `signatures` 배열에 다음 인수가 필요합니다:

| 인수     | 값        |
| ------- | --------- |
| address | publicKey |
| message | string    |

## 애셋에 autograph 플러그인 추가 코드 예제

{% dialect-switcher title="소유자로서 MPL Core 애셋에 Autograph 플러그인 추가" %}
{% dialect title="JavaScript" id="js" %}

```ts
import {
  addPlugin,
} from '@metaplex-foundation/mpl-core'

await addPlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'Autograph',
    signatures: [
      {
        address: umi.identity.publicKey,
        message: 'Your Message',
      },
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## 애셋에 Autograph 추가 코드 예제

{% dialect-switcher title="MPL Core 애셋에 Autograph 추가" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'

const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})

// 추가하려는 새 Autograph
const newAutograph = {
  address: umi.identity.publicKey,
  message: "your message"
}

// 기존 signatures 배열에 새 Autograph 추가
const updatedAutographs = [...asset.autograph.signatures, newAutograph]

await updatePlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'Autograph',
    // 제거하지 않을 모든 Autograph를 포함해야 합니다
    signatures: updatedAutographs,
  },
  authority: umi.identity,
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## 애셋에서 Autograph 제거 코드 예제

{% dialect-switcher title="MPL Core 애셋에서 Autograph 제거" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'

const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})

// 제거하려는 Autograph의 공개키
const publicKeyToRemove = publicKey("abc...")

const autographsToKeep = asset.autograph.signatures.filter(
  (autograph) => autograph.address !== publicKeyToRemove
);

await updatePlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'Autograph',
    // 제거하지 않을 모든 Autograph를 포함해야 합니다
    signatures: autographsToKeep,
  },
  authority: umi.identity, // 애셋의 소유자여야 합니다
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## 컬렉션에 autograph 플러그인 추가 코드 예제

{% dialect-switcher title="컬렉션에 autograph 플러그인 추가" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { addCollectionPlugin } from '@metaplex-foundation/mpl-core'

await addCollectionPlugin(umi, {
  collection: collection.publicKey,
  plugin: {
    type: 'Autograph',
        signatures: [
      {
        address: umi.identity.publicKey,
        message: 'Your Message',
      },
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## 일반적인 오류

### `Plugin not added`

소유자가 먼저 Autograph 플러그인을 추가해야 합니다.

### `Autograph already exists`

이 주소는 이미 이 애셋에 서명했습니다. 각 주소는 하나의 Autograph만 추가할 수 있습니다.

### `Cannot remove own autograph`

서명자는 자신의 서명을 제거할 수 없습니다(소유자 또는 Autograph 위임자이기도 한 경우 제외).

## 참고 사항

- 플러그인이 활성화되면 누구나 자신의 서명을 추가할 수 있음
- 소유자 또는 Autograph 위임자만 Autograph를 제거할 수 있음
- 서명자는 자신의 서명을 제거할 수 없음
- 애셋은 컬렉션에서 Autograph를 상속함
- 각 주소는 애셋당 한 번만 서명 가능

## 빠른 참조

### 권한 매트릭스

| 액션 | 소유자 | 누구나 | 서명자 |
|------|--------|--------|--------|
| 플러그인 추가 | ✅ | ❌ | ❌ |
| 자신의 Autograph 추가 | ✅ | ✅ | ✅ |
| 모든 Autograph 제거 | ✅ | ❌ | ❌ |
| 자신의 Autograph 제거 | ✅ (소유자로서) | ❌ | ❌ |

### Autograph 라이프사이클

| 단계 | 액션 | 누가 |
|------|------|------|
| 1 | Autograph 플러그인 추가 | 소유자 |
| 2 | Autograph 추가 | 누구나 |
| 3 | Autograph 제거 (선택) | 소유자만 |

## FAQ

### Verified Creators와 어떻게 다른가요?

Verified Creators는 크리에이터십 증명용이며 update authority가 관리합니다. Autograph는 누구로부터든 수집 가능한 서명을 받기 위한 것입니다(이벤트에서 사인받는 것처럼).

### 여러 개의 Autograph를 추가할 수 있나요?

아니요. 각 주소는 애셋당 하나의 Autograph만 추가할 수 있습니다. 같은 주소에서 두 번째 Autograph를 추가하려고 하면 실패합니다.

### 내 Autograph를 제거할 수 있나요?

아니요. 소유자 또는 Autograph 위임자만 Autograph를 제거할 수 있습니다. 이는 서명 후 바로 제거하는 것을 방지합니다.

### Autograph를 추가하려면 소유자의 허가가 필요한가요?

아니요. 소유자가 Autograph 플러그인을 활성화하면 누구나 자신의 서명을 추가할 수 있습니다. 소유자는 개별 Autograph를 승인할 필요가 없습니다.

### 애셋이 전송되면 Autograph는 어떻게 되나요?

Autograph는 애셋에 그대로 유지됩니다. 소유권 변경에 관계없이 누가 서명했는지에 대한 영구적인 기록입니다.

## 용어집

| 용어 | 정의 |
|------|------|
| **Autograph** | 애셋에 추가된 선택적 메시지가 포함된 서명 |
| **Autographer** | 자신의 서명을 추가한 주소 |
| **Autograph Delegate** | Autograph를 제거할 권한이 있는 주소 |
| **Signatures Array** | 애셋의 모든 Autograph 목록 |
| **Owner Managed** | 소유자가 추가를 제어하는 플러그인 유형 |

## 관련 플러그인

- [Verified Creators](/ko/smart-contracts/core/plugins/verified-creators) - 크리에이터십 증명 (authority 관리)
- [Attributes](/ko/smart-contracts/core/plugins/attribute) - 온체인 데이터 저장
- [ImmutableMetadata](/ko/smart-contracts/core/plugins/immutableMetadata) - 메타데이터 영구 잠금

---

*Metaplex Foundation 관리 · 최종 확인 2026년 1월 · @metaplex-foundation/mpl-core 적용*
