---
title: Verified Creator 플러그인
metaTitle: Verified Creator 플러그인 | Metaplex Core
description: Core NFT 자산 및 컬렉션에 검증된 크리에이터 서명을 추가합니다. 로열티 배분에 영향을 주지 않고 크리에이터십을 증명합니다.
---

**Verified Creators 플러그인**은 자산 또는 컬렉션에 검증된 크리에이터 서명 목록을 저장합니다. 로열티 배분에 영향을 주지 않고 공개적으로 크리에이터십을 증명합니다. {% .lead %}

{% callout title="학습 내용" %}

- 자산 및 컬렉션에 검증된 크리에이터 추가
- 크리에이터 서명 검증
- 목록에서 크리에이터 제거
- 검증 워크플로우 이해

{% /callout %}

## 요약

**Verified Creators** 플러그인은 검증 상태와 함께 크리에이터 주소를 저장하는 권한 관리 플러그인입니다. Token Metadata와 달리 이러한 크리에이터는 로열티 배분에 사용되지 않습니다(이를 위해서는 Royalties 플러그인 사용).

- 업데이트 권한이 검증되지 않은 크리에이터 추가
- 크리에이터가 서명하여 자체 검증
- 검증된 크리에이터는 제거 전 검증 해제 필요
- 자산은 컬렉션에서 크리에이터 상속

## 범위 외

로열티 배분([Royalties 플러그인](/ko/smart-contracts/core/plugins/royalties) 사용), Token Metadata 크리에이터 배열, 자동 검증.

## 빠른 시작

**바로가기:** [자산에 추가](#adding-the-autograph-plugin-to-an-asset-code-example) · [크리에이터 추가](#adding-a-different-creator-to-an-asset-code-example) · [크리에이터 제거](#removing-a-creator-from-an-asset-code-example)

1. 초기 크리에이터와 함께 Verified Creators 플러그인 추가
2. 크리에이터가 `updatePlugin`을 사용하여 자체 검증
3. 제거하려면: 크리에이터가 검증 해제, 그런 다음 업데이트 권한이 제거

{% callout type="note" title="Verified Creators vs Autograph" %}

| 기능 | Verified Creators | Autograph |
|---------|-------------------|-----------|
| 추가할 수 있는 사람 | 업데이트 권한만 | 누구나(활성화 후) |
| 목적 | 크리에이터십 증명 | 수집용 서명 |
| 검증 | 크리에이터가 자체 검증 | 검증 불필요 |
| 제거 | 먼저 검증 해제 필요 | 소유자가 언제든 제거 가능 |
| 로열티에 사용 | ❌ 아니오 | ❌ 아니오 |

**Verified Creators 사용** - 진정한 크리에이터십을 증명하기 위해.
**[Autograph](/ko/smart-contracts/core/plugins/autograph) 사용** - 팬/유명인의 수집용 서명을 위해.

{% /callout %}

## 일반적인 사용 사례

- **팀 귀속**: 디자이너, 개발자, 창립자가 각각 참여를 검증
- **공동 크리에이터 증명**: 여러 아티스트가 작품 협업을 검증
- **브랜드 검증**: 공식 브랜드 계정이 파트너십을 검증
- **진정성 증명**: 원본 크리에이터가 자산 생성을 검증
- **역사적 기록**: 컬렉션 생성에 참여한 사람 문서화

`업데이트 권한`이 할 수 있는 것:
- 플러그인 추가
- 크리에이터 배열에 검증되지 않은 크리에이터 추가
- 검증되지 않은 크리에이터 제거 가능. 검증된 크리에이터를 제거하려면 먼저 자체 검증 해제 필요
- 자체 검증 가능

크리에이터를 검증하려면 업데이트 권한에 의해 크리에이터 배열에 추가된 공개 키가 `updatePlugin` 명령에 서명해야 합니다.

## 지원 대상

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

## 인수

`verifiedCreator` 플러그인은 `VerifiedCreatorsSignature` 배열에서 다음 인수가 필요합니다:

| 인수    | 값        |
| ------- | --------- |
| address | publicKey |
| message | string    |

자산은 컬렉션에서 Creators 배열을 상속받습니다.

## 자산에 Autograph 플러그인 추가 코드 예시

{% dialect-switcher title="MPL Core 자산에 Verified Creators 플러그인 추가" %}
{% dialect title="JavaScript" id="js" %}

이 스니펫은 umi identity가 자산의 업데이트 권한이라고 가정합니다.

```ts
import {
  addPlugin,
} from '@metaplex-foundation/mpl-core'

await addPlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'VerifiedCreators',
    signatures: [
      {
        address: umi.identity.publicKey,
        verified: true,
      },
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## 자산에 다른 크리에이터 추가 코드 예시

{% dialect-switcher title="MPL Core 자산에 다른 크리에이터 추가" %}
{% dialect title="JavaScript" id="js" %}

이 스니펫은 umi identity가 검증되지 않은 크리에이터를 추가하기 위한 자산의 업데이트 권한이라고 가정합니다.

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'


const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})

const publicKeyToAdd = publicKey("abc...")

// 추가하려는 새 Autograph
const newCreator = {
  address: publicKeyToAdd,
  verified: false,
}

// 기존 signatures 배열에 새 Autograph 추가
const updatedCreators = [...asset.verifiedCreators.signatures, newCreator]

await updatePlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'VerifiedCreators',
    signatures: updatedCreators,
  },
  authority: umi.identity,
}).sendAndConfirm(umi)
```

검증되지 않은 크리에이터를 추가한 후 `updatePlugin` 함수를 다시 사용하여 자체 검증할 수 있습니다.
이 스니펫은 umi identity가 크리에이터라고 가정합니다.

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'


const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})

const publicKeyToVerify = publicKey("abc...")

// 검증하려는 크리에이터
const updatedCreators = asset.verifiedCreators.signatures.map(creator => {
  if (creator.address === publicKeyToVerify) {
    return { ...creator, verified: true };
  }
  return creator;
});


await updatePlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'VerifiedCreators',
    signatures: updatedCreators,
  },
  authority: umi.identity,
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## 자산에서 크리에이터 제거 코드 예시

{% dialect-switcher title="MPL Core 자산에서 크리에이터 제거" %}
{% dialect title="JavaScript" id="js" %}

업데이트 권한만 크리에이터를 제거할 수 있습니다. 크리에이터를 제거하려면 `verified:false`이거나 업데이트 권한 자체여야 합니다. 따라서 업데이트는 두 단계로 수행됩니다. 업데이트 권한과 크리에이터로 동시에 서명할 수 있다면 두 명령을 결합하여 하나의 트랜잭션에서 수행할 수 있습니다.

1. `verified:false` 설정
이 스니펫은 `umi.identity`가 제거하려는 크리에이터라고 가정합니다

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'

const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})

// 제거하려는 크리에이터의 공개키
const publicKeyToRemove = publicKey("abc...")

const modifiedCreators = signatures.map(signature =>
  signature.address === creator.publicKey
    ? { ...signature, verified: false }
    : signature
);

await updatePlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'VerifiedCreators',
    signatures: modifiedCreators,
  },
  authority: umi.identity, // 크리에이터여야 합니다
}).sendAndConfirm(umi)
```

2. 크리에이터 제거
이 스니펫은 `umi.identity`가 업데이트 권한이라고 가정합니다

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'

const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})

// 제거하려는 크리에이터의 공개키
const publicKeyToRemove = publicKey("abc...")


const creatorsToKeep = asset.verifiedCreators.signatures.filter(
  (creator) => creator.address !== publicKeyToRemove
);

await updatePlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'VerifiedCreators',
    signatures: creatorsToKeep,
  },
  authority: umi.identity, // 업데이트 권한이어야 합니다
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## 컬렉션에 Verified Creators 플러그인 추가 코드 예시

{% dialect-switcher title="컬렉션에 Verified Creators 플러그인 추가" %}
{% dialect title="JavaScript" id="js" %}
이 스니펫은 `umi.identity`가 업데이트 권한이라고 가정합니다

```ts
import { addCollectionPlugin } from '@metaplex-foundation/mpl-core'

await addCollectionPlugin(umi, {
  collection: collection.publicKey,
  plugin: {
    type: 'VerifiedCreators',
        signatures: [
      {
        address: umi.identity.publicKey,
        verified: true,
      },
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## 일반적인 오류

### `Authority mismatch`

업데이트 권한만 플러그인을 추가하거나 새 크리에이터를 추가할 수 있습니다. 크리에이터 자신만 자신의 서명을 검증할 수 있습니다.

### `Creator already verified`

크리에이터가 이미 자체 검증되었습니다. 조치가 필요 없습니다.

### `Cannot remove verified creator`

검증된 크리에이터는 업데이트 권한이 제거하기 전에 자체 검증 해제가 필요합니다.

## 참고 사항

- Verified Creators는 로열티 배분에 사용되지 않음(Royalties 플러그인 사용)
- 크리에이터는 자체 검증 필요—업데이트 권한이 대신 검증 불가
- 크리에이터는 제거 전 검증 해제 필요
- 자산은 컬렉션에서 크리에이터 배열 상속

## 빠른 참조

### 검증 워크플로우

| 단계 | 액션 | 실행자 |
|------|--------|-----|
| 1 | 검증되지 않은 크리에이터 추가 | 업데이트 권한 |
| 2 | 크리에이터 검증 | 크리에이터 서명 |
| 3 | 검증 해제(선택) | 크리에이터 서명 |
| 4 | 제거(선택) | 업데이트 권한 |

### 권한 매트릭스

| 액션 | 업데이트 권한 | 크리에이터 |
|--------|------------------|---------|
| 플러그인 추가 | ✅ | ❌ |
| 검증되지 않은 크리에이터 추가 | ✅ | ❌ |
| 크리에이터 검증 | ❌ | ✅ (자신만) |
| 크리에이터 검증 해제 | ❌ | ✅ (자신만) |
| 검증되지 않은 크리에이터 제거 | ✅ | ❌ |

## FAQ

### Token Metadata 크리에이터 배열과 어떻게 다른가요?

Token Metadata에서 크리에이터 배열은 로열티 배분에 사용되었습니다. Core에서 Verified Creators는 순수하게 크리에이터십 증명용입니다—로열티 배분에는 Royalties 플러그인을 사용하세요.

### 업데이트 권한이 크리에이터를 검증할 수 있나요?

아니요. 각 크리에이터는 트랜잭션에 서명하여 자체 검증해야 합니다. 이것은 진정한 크리에이터십 증명을 보장합니다.

### 검증된 크리에이터를 제거할 수 없는 이유는?

검증된 크리에이터를 제거하려면 먼저 자체 검증 해제가 필요합니다. 이것은 검증된 크리에이터의 무단 제거를 방지합니다.

### 자산이 자동으로 컬렉션의 검증된 크리에이터를 받나요?

예. 자산은 컬렉션에서 크리에이터 배열을 상속받습니다. 개별 자산도 다른 크리에이터를 가진 자체 Verified Creators 플러그인을 가질 수 있습니다.

### 공동 크리에이터 귀속에 사용할 수 있나요?

예. 이것은 일반적인 사용 사례입니다—여러 크리에이터(디자이너, 개발자, 아티스트)가 모두 자산 또는 컬렉션 생성에 참여를 검증할 수 있습니다.

## 용어집

| 용어 | 정의 |
|------|------------|
| **Verified Creator** | 서명하여 참여를 확인한 크리에이터 |
| **Unverified Creator** | 업데이트 권한에 의해 추가되었지만 아직 확인되지 않은 크리에이터 |
| **Verification** | 진정한 크리에이터십을 증명하기 위한 크리에이터 서명 |
| **Royalties Plugin** | 로열티 배분을 위한 별도 플러그인(이 플러그인 아님) |
| **Creator Array** | 자산/컬렉션과 연관된 주소 목록 |

## 관련 플러그인

- [Autograph](/ko/smart-contracts/core/plugins/autograph) - 누구나(팬, 유명인)의 수집용 서명
- [Royalties](/ko/smart-contracts/core/plugins/royalties) - 로열티 배분 설정(검증된 크리에이터와 별개)
- [ImmutableMetadata](/ko/smart-contracts/core/plugins/immutableMetadata) - 메타데이터 영구 잠금

---

*Metaplex Foundation 관리 · 2026년 1월 최종 확인 · @metaplex-foundation/mpl-core 적용*
