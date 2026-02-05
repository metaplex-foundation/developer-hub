---
title: Verified Creator Plugin
metaTitle: Verified Creator Plugin | Metaplex Core
description: Core NFT Asset과 Collection에 검증된 창작자 서명을 추가합니다. 로열티 분배에 영향을 주지 않으면서 창작자임을 증명할 수 있습니다.
updated: '01-31-2026'
keywords:
  - verified creator
  - creator signature
  - prove authorship
  - creator verification
about:
  - Creator verification
  - Signature proof
  - Authorship
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: Token Metadata의 creator 배열과 어떻게 다른가요?
    a: Token Metadata에서 creator 배열은 로열티 분배에 사용되었습니다. Core에서 Verified Creators는 순수하게 창작자임을 증명하는 용도로만 사용됩니다 - 로열티 분배에는 Royalties 플러그인을 사용하세요.
  - q: Update authority가 창작자를 검증할 수 있나요?
    a: 아니요. 각 창작자는 트랜잭션에 서명하여 스스로 검증해야 합니다. 이는 진정한 창작자임을 증명합니다.
  - q: 검증된 창작자를 제거할 수 없는 이유는 무엇인가요?
    a: 검증된 창작자를 제거하려면 먼저 스스로 검증을 취소해야 합니다. 이는 검증된 창작자의 무단 제거를 방지합니다.
  - q: Asset이 자동으로 Collection의 verified creators를 상속받나요?
    a: 네. Asset은 Collection에서 creators 배열을 상속받습니다. 개별 Asset도 다른 창작자가 포함된 자체 Verified Creators 플러그인을 가질 수 있습니다.
  - q: 공동 창작자 표시에 이것을 사용할 수 있나요?
    a: 네. 이것은 일반적인 사용 사례입니다 - 여러 창작자가 Asset 또는 Collection 제작에 참여했음을 모두 검증할 수 있습니다.
---
**Verified Creators Plugin**은 Asset 또는 Collection에 검증된 창작자 서명 목록을 저장합니다. 로열티 분배에 영향을 주지 않으면서 공개적으로 창작자임을 증명할 수 있습니다. {% .lead %}
{% callout title="학습 내용" %}
- Asset과 Collection에 verified creators 추가하기
- 창작자 서명 검증하기
- 목록에서 창작자 제거하기
- 검증 워크플로우 이해하기
{% /callout %}
## 요약
**Verified Creators** 플러그인은 검증 상태와 함께 창작자 주소를 저장하는 Authority Managed 플러그인입니다. Token Metadata와 달리, 이 창작자들은 로열티 분배에 사용되지 않습니다(로열티에는 Royalties 플러그인을 사용하세요).
- Update authority가 미검증 창작자를 추가합니다
- 창작자가 서명하여 스스로 검증합니다
- 검증된 창작자는 제거 전에 검증을 취소해야 합니다
- Asset은 Collection에서 creators를 상속받습니다
## 범위 외
로열티 분배([Royalties 플러그인](/ko/smart-contracts/core/plugins/royalties) 사용), Token Metadata creator 배열, 자동 검증은 이 문서의 범위에 포함되지 않습니다.
## 빠른 시작
**바로가기:** [Asset에 추가](#adding-the-autograph-plugin-to-an-asset-code-example) · [창작자 추가](#adding-a-different-creator-to-an-asset-code-example) · [창작자 제거](#removing-a-creator-from-an-asset-code-example)
1. 초기 창작자와 함께 Verified Creators 플러그인 추가
2. 창작자가 `updatePlugin`을 사용하여 스스로 검증
3. 제거하려면: 창작자가 검증 취소 후 update authority가 제거
{% callout type="note" title="Verified Creators vs Autograph" %}
| 기능 | Verified Creators | Autograph |
|---------|-------------------|-----------|
| 추가 가능한 사람 | Update authority만 | 누구나 (활성화 후) |
| 목적 | 창작자임 증명 | 수집용 서명 |
| 검증 | 창작자가 스스로 검증 | 검증 불필요 |
| 제거 | 먼저 검증 취소 필요 | 소유자가 언제든 제거 가능 |
| 로열티에 사용 | 아니요 | 아니요 |
**Verified Creators 사용** - 진정한 창작자임을 증명할 때
**[Autograph](/ko/smart-contracts/core/plugins/autograph) 사용** - 팬/유명인의 수집용 서명을 받을 때
{% /callout %}
## 일반적인 사용 사례
- **팀 표시**: 디자이너, 개발자, 창립자가 각자의 참여를 검증
- **공동 창작자 증명**: 여러 아티스트가 작품의 협업을 검증
- **브랜드 검증**: 공식 브랜드 계정이 파트너십을 검증
- **진위 증명**: 원 창작자가 Asset을 만들었음을 검증
- **이력 기록**: Collection 생성에 참여한 사람을 문서화
`update authority`가 할 수 있는 것:
- 플러그인 추가
- creators 배열에 미검증 창작자 추가
- 미검증 창작자 제거. 검증된 창작자를 제거하려면 먼저 스스로 검증을 취소해야 함
- 스스로 검증
창작자를 검증하려면 update authority가 creators 배열에 추가한 공개 키로 `updatePlugin` 인스트럭션에 서명해야 합니다.
## 호환 대상
|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |
## 인자
`verifiedCreator` Plugin은 `VerifiedCreatorsSignature` 배열에 다음 인자가 필요합니다:
| 인자     | 값     |
| ------- | ------    |
| address | publicKey |
| message | string    |
Asset은 Collection에서 Creators 배열을 상속받습니다.
## Asset에 Verified Creators Plugin 추가 코드 예제
{% dialect-switcher title="MPL Core Asset에 Verified Creators Plugin 추가" %}
{% dialect title="JavaScript" id="js" %}
이 코드는 umi identity가 asset의 update authority라고 가정합니다.
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
## Asset에 다른 창작자 추가 코드 예제
{% dialect-switcher title="MPL Core Asset에 다른 Creator 추가" %}
{% dialect title="JavaScript" id="js" %}
이 코드는 umi identity가 asset의 update authority이며 미검증 Creator를 추가한다고 가정합니다.
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'
const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})
const publicKeyToAdd = publicKey("abc...")
// The new autograph that you want to add
const newCreator = {
  address: publicKeyToAdd,
  verified: false,
}
// Add the new autograph to the existing signatures array
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
미검증 Creator를 추가한 후, 그들은 `updatePlugin` 함수를 다시 사용하여 스스로 검증할 수 있습니다.
이 코드는 umi identity가 Creator라고 가정합니다.
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'
const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})
const publicKeyToVerify = publicKey("abc...")
// The creator that you want to verify
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
## Asset에서 창작자 제거 코드 예제
{% dialect-switcher title="MPL Core Asset에서 Creator 제거" %}
{% dialect title="JavaScript" id="js" %}
update authority만 창작자를 제거할 수 있습니다. 창작자를 제거하려면 `verified:false`이거나 update authority 자신이어야 합니다. 따라서 업데이트는 두 단계로 수행됩니다. update authority와 창작자로 동시에 서명할 수 있다면 두 인스트럭션을 결합하여 하나의 트랜잭션으로 처리할 수 있습니다.
1. `verified:false` 설정
이 코드는 `umi.identity`가 제거하려는 창작자라고 가정합니다
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'
const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})
// The Publickey of the creator that you want to remove
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
  authority: umi.identity, // Should be the creator
}).sendAndConfirm(umi)
```
2. 창작자 제거
이 코드는 `umi.identity`가 update authority라고 가정합니다
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'
const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})
// The Publickey of the creator that you want to remove
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
  authority: umi.identity, // Should be the update authority
}).sendAndConfirm(umi)
```
{% /dialect %}
{% /dialect-switcher %}
## Collection에 Verified Creators Plugin 추가 코드 예제
{% dialect-switcher title="Collection에 Verified Creators Plugin 추가" %}
{% dialect title="JavaScript" id="js" %}
이 코드는 `umi.identity`가 update authority라고 가정합니다
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
update authority만 플러그인을 추가하거나 새 창작자를 추가할 수 있습니다. 창작자 자신만 자신의 서명을 검증할 수 있습니다.
### `Creator already verified`
창작자가 이미 스스로 검증했습니다. 추가 작업이 필요 없습니다.
### `Cannot remove verified creator`
검증된 창작자는 update authority가 제거하기 전에 스스로 검증을 취소해야 합니다.
## 참고 사항
- Verified Creators는 로열티 분배에 사용되지 않습니다 (Royalties 플러그인 사용)
- 창작자는 스스로 검증해야 합니다—update authority가 대신 검증할 수 없습니다
- 창작자는 제거되기 전에 검증을 취소해야 합니다
- Asset은 Collection에서 creators 배열을 상속받습니다
## 빠른 참조
### 검증 워크플로우
| 단계 | 작업 | 수행자 |
|------|--------|-----|
| 1 | 미검증 창작자 추가 | Update Authority |
| 2 | 창작자 검증 | Creator 서명 |
| 3 | 검증 취소 (선택) | Creator 서명 |
| 4 | 제거 (선택) | Update Authority |
### 권한 매트릭스
| 작업 | Update Authority | Creator |
|--------|------------------|---------|
| 플러그인 추가 | ✅ | |
| 미검증 창작자 추가 | ✅ | |
| 창작자 검증 | | ✅ (본인만) |
| 창작자 검증 취소 | | ✅ (본인만) |
| 미검증 창작자 제거 | ✅ | |
## FAQ
### Token Metadata의 creator 배열과 어떻게 다른가요?
Token Metadata에서 creator 배열은 로열티 분배에 사용되었습니다. Core에서 Verified Creators는 순수하게 창작자임을 증명하는 용도로만 사용됩니다 - 로열티 분배에는 Royalties 플러그인을 사용하세요.
### Update authority가 창작자를 검증할 수 있나요?
아니요. 각 창작자는 트랜잭션에 서명하여 스스로 검증해야 합니다. 이는 진정한 창작자임을 증명합니다.
### 검증된 창작자를 제거할 수 없는 이유는 무엇인가요?
검증된 창작자를 제거하려면 먼저 스스로 검증을 취소해야 합니다. 이는 검증된 창작자의 무단 제거를 방지합니다.
### Asset이 자동으로 Collection의 verified creators를 상속받나요?
네. Asset은 Collection에서 creators 배열을 상속받습니다. 개별 Asset도 다른 창작자가 포함된 자체 Verified Creators 플러그인을 가질 수 있습니다.
### 공동 창작자 표시에 이것을 사용할 수 있나요?
네. 이것은 일반적인 사용 사례입니다—여러 창작자(디자이너, 개발자, 아티스트)가 Asset 또는 Collection 제작에 참여했음을 모두 검증할 수 있습니다.
## 용어집
| 용어 | 정의 |
|------|------------|
| **Verified Creator** | 참여를 확인하기 위해 서명한 창작자 |
| **Unverified Creator** | Update authority가 추가했지만 아직 확인되지 않은 창작자 |
| **Verification** | 진정한 창작자임을 증명하기 위한 창작자 서명 |
| **Royalties Plugin** | 로열티 분배를 위한 별도의 플러그인 (이 플러그인과 다름) |
| **Creator Array** | Asset/Collection과 연결된 주소 목록 |
## 관련 플러그인
- [Autograph](/ko/smart-contracts/core/plugins/autograph) - 누구나(팬, 유명인) 남길 수 있는 수집용 서명
- [Royalties](/ko/smart-contracts/core/plugins/royalties) - 로열티 분배 설정 (verified creators와 별도)
- [ImmutableMetadata](/ko/smart-contracts/core/plugins/immutableMetadata) - 메타데이터를 영구적으로 잠금
