---
title: Autograph 플러그인
metaTitle: Autograph 플러그인 | Metaplex Core
description: 누구나 Core NFT Asset에 서명과 메시지를 추가할 수 있습니다. 크리에이터, 아티스트 또는 커뮤니티 멤버의 수집 가능한 사인을 만들 수 있습니다.
updated: '01-31-2026'
keywords:
  - autograph NFT
  - NFT signature
  - collectible autograph
  - artist signature
about:
  - Digital autographs
  - Signature collection
  - Community interaction
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: Verified Creators와 어떻게 다른가요?
    a: Verified Creators는 창작자임을 증명하기 위한 것으로 업데이트 권한자가 관리합니다. Autograph는 이벤트에서 사인을 받는 것처럼 누구나 할 수 있는 수집 가능한 서명입니다.
  - q: 여러 개의 사인을 추가할 수 있나요?
    a: 아니요. 각 주소는 Asset당 하나의 사인만 추가할 수 있습니다. 같은 주소에서 두 번째 사인을 추가하려고 하면 실패합니다.
  - q: 내 사인을 제거할 수 있나요?
    a: 아니요. 소유자나 autograph 위임자만 사인을 제거할 수 있습니다. 이는 누군가가 서명 후 즉시 제거하는 것을 방지합니다.
  - q: 사인을 추가하려면 소유자의 허가가 필요한가요?
    a: 아니요. 소유자가 Autograph 플러그인을 활성화하면 누구나 서명을 추가할 수 있습니다. 소유자가 개별 사인을 승인할 필요가 없습니다.
  - q: Asset이 전송되면 사인은 어떻게 되나요?
    a: 사인은 Asset에 남아 있습니다. 소유권 변경과 관계없이 누가 서명했는지에 대한 영구적인 기록입니다.
---
**Autograph 플러그인**은 누구나 Asset 또는 Collection에 자신의 서명과 메시지를 추가할 수 있게 합니다. 아티스트, 유명인 또는 커뮤니티 멤버의 수집 가능한 서명에 완벽합니다. {% .lead %}
{% callout title="학습 내용" %}
- Asset과 Collection에서 사인 활성화
- Asset에 서명 추가
- 소유자로서 사인 제거
- 사인 권한 이해
{% /callout %}
## 요약
**Autograph** 플러그인은 메시지와 함께 서명을 저장하는 소유자 관리 플러그인입니다. 활성화되면 누구나 자신의 서명을 추가할 수 있습니다. 소유자는 모든 사인을 제거할 수 있습니다.
- 소유자가 플러그인 추가 (또는 민트 시 업데이트 권한자)
- 누구나 자신의 서명 추가 가능
- 소유자/위임자만 사인 제거 가능
- 서명자는 자신의 서명을 제거할 수 없음
- Asset은 Collection의 사인을 상속
## 범위 외
창작자 검증 ([Verified Creators](/smart-contracts/core/plugins/verified-creators) 사용), 로열티, 자동 서명 검증.
## 빠른 시작
**바로 가기:** [플러그인 추가](#asset에-autograph-플러그인-추가-코드-예제) · [사인 추가](#asset에-autograph-추가-코드-예제) · [사인 제거](#asset에서-autograph-제거-코드-예제)
1. 소유자가 서명을 활성화하기 위해 Autograph 플러그인 추가
2. 누구나 `updatePlugin`으로 자신의 서명 추가 가능
3. 소유자가 모든 사인 제거 가능
{% callout type="note" title="Autograph vs Verified Creators" %}
| 기능 | Autograph | Verified Creators |
|---------|-----------|-------------------|
| 서명할 수 있는 사람 | 누구나 | 등록된 창작자만 |
| 활성화 권한 | 소유자 | 업데이트 권한자 |
| 자기 제거 | ❌ 자기 것 제거 불가 | ✅ 자기 검증 해제 가능 |
| 목적 | 수집 가능한 서명 | 창작자임 증명 |
| 적합한 용도 | 팬 참여, 이벤트 | 팀 귀속 |
**Autograph 사용** 수집 가능한 서명 (사인된 기념품처럼).
**[Verified Creators](/smart-contracts/core/plugins/verified-creators) 사용** Asset을 누가 만들었는지 증명하기 위해.
{% /callout %}
## 일반적인 사용 사례
- **유명인 사인**: 아티스트가 이벤트에서 NFT에 서명
- **팬 참여**: 커뮤니티 멤버가 한정판에 서명
- **인증**: 실물 아이템 제작자가 디지털 트윈에 서명
- **이벤트 기념품**: 컨퍼런스 연사가 이벤트 NFT에 서명
- **자선 경매**: 여러 유명인이 자선 NFT에 서명
사인을 추가하려면 몇 가지 조건이 충족되어야 합니다:
- Autograph 플러그인이 이미 추가되어 있어야 합니다.
- 서명자는 자신의 주소만 추가할 수 있습니다.
- `updatePlugin` 함수를 사용하여 추가된 서명과 함께 기존 목록을 전달해야 합니다.
- 해당 서명자의 기존 Autograph가 아직 없어야 합니다.
{% callout type="note" %}
소유자가 autograph 플러그인을 추가하면 누구나 자신의 서명을 추가할 수 있습니다. 소유자가 언제든지 다시 제거할 수 있습니다.
{% /callout %}
## 호환 대상
|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |
Asset은 Collection에서 Autograph를 상속합니다.
## 인자
`autograph` 플러그인은 `signatures` 배열에 다음 인자가 필요합니다:
| 인자     | 값     |
| ------- | ------    |
| address | publicKey |
| message | string    |
## Asset에 autograph 플러그인 추가 코드 예제
{% dialect-switcher title="소유자로서 MPL Core Asset에 autograph 플러그인 추가" %}
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
## Asset에 Autograph 추가 코드 예제
{% dialect-switcher title="MPL Core Asset에 Autograph 추가" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'
const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})
// The new autograph that you want to add
const newAutograph = {
  address: umi.identity.publicKey,
  message: "your message"
}
// Add the new autograph to the existing signatures array
const updatedAutographs = [...asset.autograph.signatures, newAutograph]
await updatePlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'Autograph',
    // This should contain all autographs that you do not want to remove
    signatures: updatedAutographs,
  },
  authority: umi.identity,
}).sendAndConfirm(umi)
```
{% /dialect %}
{% /dialect-switcher %}
## Asset에서 Autograph 제거 코드 예제
{% dialect-switcher title="MPL Core Asset에서 Autograph 제거" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'
const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})
// The Publickey of the autograph that you want to remove
const publicKeyToRemove = publicKey("abc...")
const autographsToKeep = asset.autograph.signatures.filter(
  (autograph) => autograph.address !== publicKeyToRemove
);
await updatePlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'Autograph',
    // This should contain all Autographs that you do not want to remove
    signatures: autographsToKeep,
  },
  authority: umi.identity, // Should be the owner of the asset
}).sendAndConfirm(umi)
```
{% /dialect %}
{% /dialect-switcher %}
## Collection에 autograph 플러그인 추가 코드 예제
{% dialect-switcher title="Collection에 autograph 플러그인 추가" %}
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
누구나 사인을 추가하기 전에 소유자가 Autograph 플러그인을 추가해야 합니다.
### `Autograph already exists`
이 주소는 이미 이 Asset에 서명했습니다. 각 주소는 하나의 사인만 추가할 수 있습니다.
### `Cannot remove own autograph`
서명자는 자신의 서명을 제거할 수 없습니다 (소유자 또는 autograph 위임자가 아닌 한).
## 참고 사항
- 플러그인이 활성화되면 누구나 서명을 추가할 수 있음
- 소유자 또는 autograph 위임자만 사인을 제거할 수 있음
- 서명자는 자신의 서명을 제거할 수 없음
- Asset은 Collection에서 사인을 상속
- 각 주소는 Asset당 한 번만 서명 가능
## 빠른 참조
### 권한 매트릭스
| 작업 | 소유자 | 누구나 | 서명자 |
|--------|-------|--------|-------------|
| 플러그인 추가 | ✅ | ❌ | ❌ |
| 자기 사인 추가 | ✅ | ✅ | ✅ |
| 모든 사인 제거 | ✅ | ❌ | ❌ |
| 자기 사인 제거 | ✅ (소유자로서) | ❌ | ❌ |
### Autograph 수명 주기
| 단계 | 작업 | 누가 |
|------|--------|-----|
| 1 | Autograph 플러그인 추가 | 소유자 |
| 2 | 사인 추가 | 누구나 |
| 3 | 사인 제거 (선택) | 소유자만 |
## FAQ
### Verified Creators와 어떻게 다른가요?
Verified Creators는 창작자임을 증명하기 위한 것으로 업데이트 권한자가 관리합니다. Autograph는 누구나 할 수 있는 수집 가능한 서명입니다 (이벤트에서 사인을 받는 것처럼).
### 여러 개의 사인을 추가할 수 있나요?
아니요. 각 주소는 Asset당 하나의 사인만 추가할 수 있습니다. 같은 주소에서 두 번째 사인을 추가하려고 하면 실패합니다.
### 내 사인을 제거할 수 있나요?
아니요. 소유자나 autograph 위임자만 사인을 제거할 수 있습니다. 이는 누군가가 서명 후 즉시 제거하는 것을 방지합니다.
### 사인을 추가하려면 소유자의 허가가 필요한가요?
아니요. 소유자가 Autograph 플러그인을 활성화하면 누구나 서명을 추가할 수 있습니다. 소유자가 개별 사인을 승인할 필요가 없습니다.
### Asset이 전송되면 사인은 어떻게 되나요?
사인은 Asset에 남아 있습니다. 소유권 변경과 관계없이 누가 서명했는지에 대한 영구적인 기록입니다.
## 용어집
| 용어 | 정의 |
|------|------------|
| **Autograph** | Asset에 추가된 선택적 메시지가 있는 서명 |
| **서명자** | 자신의 서명을 추가한 주소 |
| **Autograph 위임자** | 사인을 제거할 권한이 있는 주소 |
| **Signatures 배열** | Asset에 있는 모든 사인 목록 |
| **소유자 관리** | 소유자가 추가를 제어하는 플러그인 유형 |
## 관련 플러그인
- [Verified Creators](/smart-contracts/core/plugins/verified-creators) - 창작자임 증명 (권한 관리)
- [Attributes](/smart-contracts/core/plugins/attribute) - 온체인 데이터 저장
- [ImmutableMetadata](/smart-contracts/core/plugins/immutableMetadata) - 메타데이터 영구 잠금
