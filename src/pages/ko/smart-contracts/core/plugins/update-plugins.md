---
title: 플러그인 업데이트
metaTitle: 플러그인 업데이트 | Core
description: updatePlugin 함수를 사용하여 MPL Core Asset 및 Collection의 기존 플러그인을 업데이트하는 방법을 알아보세요.
updated: '01-31-2026'
keywords:
  - update plugin
  - modify plugin
  - plugin data
  - updatePlugin
about:
  - Plugin modification
  - Data updates
  - Plugin management
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
---
MPL Core Asset 및 Collection의 많은 플러그인은 추가된 후에 업데이트할 수 있습니다. `updatePlugin` 함수를 사용하면 속성 변경, 로열티 업데이트, 동결 상태 수정 등 플러그인 데이터를 수정할 수 있습니다.
{% totem %}
{% totem-accordion title="기술적 명령어 세부사항" %}
**명령어 계정 목록**
| 계정          | 설명                                            |
| ------------- | ----------------------------------------------- |
| asset         | MPL Core Asset의 주소.                          |
| collection    | Core Asset이 속한 Collection.                   |
| payer         | 스토리지 비용을 지불하는 계정.                  |
| authority     | 업데이트 권한이 있는 소유자 또는 위임자.        |
| systemProgram | System Program 계정.                            |
| logWrapper    | SPL Noop Program.                               |
**명령어 인수**
| 인수   | 설명                                   |
| ------ | -------------------------------------- |
| plugin | 업데이트할 플러그인 유형과 데이터.     |
일부 계정/인수는 사용 편의를 위해 SDK에서 추상화되거나 선택 사항일 수 있습니다.
자세한 TypeDoc 문서는 다음을 참조하세요:
- [updatePlugin](https://mpl-core.typedoc.metaplex.com/functions/updatePlugin.html)
- [updateCollectionPlugin](https://mpl-core.typedoc.metaplex.com/functions/updateCollectionPlugin.html)
참고: JavaScript SDK에서 updatePlugin은 data 래퍼 없이 플러그인 데이터를 기대합니다 (예: `{ type: 'FreezeDelegate', frozen: true }`). 반면, addPlugin은 데이터를 `data` 아래에 래핑합니다 (예: `{ type: 'FreezeDelegate', data: { frozen: true } }`). 이는 createAsset/createCollection 플러그인 목록에서 사용되는 형태를 반영합니다.
{% /totem-accordion %}
{% /totem %}
## Asset에서 플러그인 업데이트
### 기본 플러그인 업데이트 예제
다음은 Attributes 플러그인을 예로 들어 MPL Core Asset의 플러그인을 업데이트하는 방법입니다:
{% dialect-switcher title="Asset에서 플러그인 업데이트" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'
(async () => {
  const assetAddress = publicKey('11111111111111111111111111111111')
  // 기존 플러그인 데이터를 보기 위해 현재 Asset 가져오기
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
Freeze Delegate 플러그인과 같이 일부 플러그인은 토글할 수 있는 간단한 상태를 저장합니다:
{% dialect-switcher title="동결 상태 업데이트" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin } from '@metaplex-foundation/mpl-core'
(async () => {
  const assetAddress = publicKey('11111111111111111111111111111111')
  // Asset 동결
  await updatePlugin(umi, {
    asset: assetAddress,
    plugin: {
      type: 'FreezeDelegate',
      frozen: true, // 동결하려면 true, 해제하려면 false로 설정
    },
  }).sendAndConfirm(umi)
  // 나중에 Asset 동결 해제
  await updatePlugin(umi, {
    asset: assetAddress,
    plugin: {
      type: 'FreezeDelegate',
      frozen: false, // Asset 동결 해제
    },
  }).sendAndConfirm(umi)
})();
```
{% /dialect %}
{% /dialect-switcher %}
## Collection에서 플러그인 업데이트
Collection 플러그인은 Asset 플러그인과 유사하게 작동하지만 `updateCollectionPlugin` 함수를 사용합니다:
{% dialect-switcher title="Collection에서 플러그인 업데이트" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updateCollectionPlugin, ruleSet } from '@metaplex-foundation/mpl-core'
(async () => {
  const collectionAddress = publicKey('11111111111111111111111111111111')
  const creator1 = publicKey('22222222222222222222222222222222')
  const creator2 = publicKey('33333333333333333333333333333333')
  // Collection 전체 로열티 업데이트
  await updateCollectionPlugin(umi, {
    collection: collectionAddress,
    plugin: {
      type: 'Royalties',
      basisPoints: 600, // Collection의 6% 로열티
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
## 복잡한 플러그인 데이터 다루기
### 플러그인의 목록 관리
Autograph 및 Verified Creators와 같은 일부 플러그인은 데이터 목록을 유지합니다. 이러한 플러그인을 업데이트할 때는 유지하려는 전체 목록을 전달해야 합니다:
{% dialect-switcher title="목록 기반 플러그인 업데이트" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'
(async () => {
  const assetAddress = publicKey('11111111111111111111111111111111')
  // 먼저 기존 사인을 보기 위해 현재 Asset 가져오기
  const asset = await fetchAsset(umi, assetAddress, {
    skipDerivePlugins: false,
  })
  // 기존 것을 유지하면서 새 사인 추가
  const newAutograph = {
    address: umi.identity.publicKey,
    message: "멋진 NFT! 수집가가 서명함."
  }
  // 모든 기존 사인과 새 것을 포함
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
  // 현재 Asset 데이터 가져오기
  const asset = await fetchAsset(umi, assetAddress, {
    skipDerivePlugins: false,
  })
  // 제거하려는 사인 필터링
  const filteredAutographs = asset.autograph.signatures.filter(
    (autograph) => autograph.address !== autographToRemove
  )
  await updatePlugin(umi, {
    asset: assetAddress,
    plugin: {
      type: 'Autograph',
      signatures: filteredAutographs, // 제거된 항목이 없는 목록
    },
    authority: umi.identity,
  }).sendAndConfirm(umi)
})();
```
{% /dialect %}
{% /dialect-switcher %}
## 권한 요구사항
플러그인마다 업데이트에 필요한 권한이 다릅니다:
- **권한 관리 플러그인** (Royalties, Attributes, Update Delegate): Asset 또는 Collection의 **권한** 필요
- **소유자 관리 플러그인** (Autograph, Freeze Delegate): Asset의 **소유자** 또는 플러그인의 특정 권한 필요
- **Verified Creators 플러그인**: 창작자 추가/제거에는 **업데이트 권한** 필요, 하지만 개별 **창작자는 자신을 검증 가능**
## 오류 처리
플러그인 업데이트 시 일반적인 오류:
- **Authority mismatch**: 플러그인 유형에 맞는 올바른 권한으로 서명하고 있는지 확인
- **Plugin not found**: 업데이트하기 전에 Asset/Collection에 플러그인이 존재해야 함
- **Invalid data**: 플러그인 데이터는 예상 구조와 제약 조건을 준수해야 함
- **Collection mismatch**: Asset이 Collection의 일부인 경우 업데이트에 Collection을 포함해야 할 수 있음
## 모범 사례
1. **업데이트 전 가져오기**: 항상 현재 Asset/Collection 상태를 가져와 기존 플러그인 데이터 확인
2. **기존 데이터 보존**: 목록 기반 플러그인을 업데이트할 때 유지하려는 기존 데이터 포함
3. **적절한 권한 사용**: 각 플러그인 유형에 맞는 올바른 서명 권한 사용
4. **배치 업데이트**: 여러 플러그인을 업데이트하는 경우 효율성을 위해 작업을 배치로 처리 고려
5. **데이터 검증**: 업데이트 데이터가 플러그인의 요구사항을 충족하는지 확인 (예: 창작자 비율 합계가 100%)
## 다음 단계
- 개별 플러그인 문서에서 특정 플러그인 업데이트에 대해 알아보기
- [플러그인 개요](/smart-contracts/core/plugins)에서 사용 가능한 모든 플러그인 탐색
- [플러그인 추가](/smart-contracts/core/plugins/adding-plugins) 및 [플러그인 제거](/smart-contracts/core/plugins/removing-plugins) 확인
- [MPL Core TypeDoc](https://mpl-core.typedoc.metaplex.com)에서 자세한 API 문서 방문
