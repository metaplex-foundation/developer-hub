---
title: Core와 Token Metadata의 차이점
metaTitle: Core vs Token Metadata | Metaplex Core
description: Metaplex Core와 Token Metadata NFT 표준을 비교합니다. 무엇이 변경되었는지, 무엇이 새로운지, TM에서 Core로 멘탈 모델을 마이그레이션하는 방법을 배웁니다.
updated: '01-31-2026'
keywords:
  - Core vs Token Metadata
  - NFT standard comparison
  - migrate from Token Metadata
  - mpl-core differences
  - NFT migration
about:
  - NFT standards comparison
  - Token Metadata migration
  - Core advantages
proficiencyLevel: Beginner
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: 새 프로젝트에 Core와 Token Metadata 중 어떤 것을 사용해야 하나요?
    a: 모든 새 프로젝트에는 Core를 사용하세요. 더 저렴하고, 간단하며, 기능이 더 좋습니다. NFT용 Token Metadata는 레거시입니다.
  - q: 기존 TM NFT를 Core로 마이그레이션할 수 있나요?
    a: 자동으로는 불가능합니다. Core Asset은 다른 온체인 계정입니다. 마이그레이션하려면 TM NFT를 소각하고 새 Core Asset을 민팅해야 합니다.
  - q: pNFT는 어떻게 되었나요?
    a: Core의 로열티 강제는 허용 목록/거부 목록을 지원하는 Royalties 플러그인을 통해 내장되어 있습니다. 별도의 프로그래머블 변형이 필요 없습니다.
  - q: Associated Token Account가 여전히 필요한가요?
    a: 아니요. Core Asset은 ATA를 사용하지 않습니다. 소유권은 Asset 계정에 직접 저장됩니다.
  - q: Core에서 크리에이터를 검증하려면 어떻게 하나요?
    a: Verified Creators 플러그인을 사용합니다. TM의 creator 배열과 유사하게 작동하지만 옵트인입니다.
---
**Token Metadata**에서 오셨나요? 이 가이드는 Core의 차이점, 왜 더 좋은지, TM 지식을 Core 개념으로 변환하는 방법을 설명합니다. {% .lead %}
{% callout title="주요 차이점" %}

- **단일 계정** vs 3개 이상의 계정 (mint, metadata, token account)
- **80% 저렴한 비용**: 민트당 약 0.0037 SOL vs 0.022 SOL
- 위임자와 동결 권한 대신 **플러그인**
- 컬렉션 수준 작업을 갖춘 **퍼스트 클래스 Collection**
- **Associated Token Account 불필요**
{% /callout %}

## 요약

Core는 Token Metadata의 다중 계정 모델을 단일 계정 설계로 대체합니다. 생성, 동결, 위임, 컬렉션 관리 등 모든 것이 더 간단해졌습니다. 플러그인 시스템은 TM의 분산된 위임자 유형을 통합되고 확장 가능한 아키텍처로 대체합니다.

| 기능 | Token Metadata | Core |
|---------|---------------|------|
| NFT당 계정 수 | 3개 이상 (mint, metadata, ATA) | 1 |
| 민트 비용 | ~0.022 SOL | ~0.0037 SOL |
| 동결 메커니즘 | 위임자 + 동결 권한 | Freeze Delegate 플러그인 |
| 로열티 | 자산별 업데이트 | 유연함: 컬렉션 또는 자산 수준 |
| 온체인 속성 | ❌ | ✅ Attributes 플러그인 |

## 범위 외

pNFT 관련 기능과 대체 가능 토큰 처리 (SPL Token 사용).

## 빠른 시작

**바로가기:** [비용 비교](#difference-overview) · [Collections](#collections) · [Freeze/Lock](#freeze--lock) · [라이프사이클 이벤트](#lifecycle-events-and-plugins)
새로 시작하는 경우 Core를 사용하세요. 마이그레이션하는 경우 주요 멘탈 시프트는:

1. 세 개가 아닌 하나의 계정
2. 위임자가 아닌 플러그인
3. 컬렉션 수준 작업이 네이티브

## 차이점 개요

- **전례 없는 비용 효율성**: Metaplex Core는 사용 가능한 대안 중 가장 낮은 민팅 비용을 제공합니다. 예를 들어, Token Metadata로 0.022 SOL이 드는 NFT를 Core로 0.0037 SOL에 민팅할 수 있습니다.
- **개선된 개발자 경험**: 대부분의 디지털 자산은 전체 대체 가능 토큰 프로그램을 유지하는 데 필요한 데이터를 상속받지만, Core는 NFT에 최적화되어 모든 주요 데이터를 단일 Solana 계정에 저장할 수 있습니다. 이로 인해 개발자의 복잡성이 크게 줄어들고, Solana 전체의 네트워크 성능 향상에도 기여합니다.
- **강화된 컬렉션 관리**: 컬렉션에 대한 퍼스트 클래스 지원으로 개발자와 크리에이터는 로열티와 플러그인과 같은 컬렉션 수준 구성을 쉽게 관리할 수 있으며, 개별 NFT에 대해 고유하게 재정의할 수 있습니다. 이는 단일 트랜잭션으로 수행할 수 있어 컬렉션 관리 비용과 Solana 트랜잭션 수수료를 줄입니다.
- **고급 플러그인 지원**: 내장 스테이킹부터 자산 기반 포인트 시스템까지, Metaplex Core의 플러그인 아키텍처는 광범위한 유틸리티와 커스터마이징의 가능성을 열어줍니다. 플러그인을 통해 개발자는 생성, 전송, 소각과 같은 모든 자산 라이프사이클 이벤트에 후킹하여 커스텀 동작을 추가할 수 있습니다.
- **호환성 및 지원**: Metaplex Developer Platform에서 완전히 지원되며, Core는 SDK 스위트 및 향후 프로그램과 원활하게 통합되어 Metaplex 생태계를 풍부하게 합니다.
- **기본 제공 인덱싱**: Metaplex Digital Asset Standard API (DAS API)를 확장하여, Core 자산은 자동으로 인덱싱되고 모든 Solana NFT에 사용되는 공통 인터페이스를 통해 애플리케이션 개발자에게 제공됩니다. 그러나 독특한 개선 사항으로, Core attribute 플러그인을 통해 개발자는 온체인 데이터를 추가할 수 있으며, 이 데이터도 자동으로 인덱싱됩니다.

## 기술 개요

### 생성

Core Asset을 생성하려면 단일 create 명령어만 필요합니다. Token Metadata에서 필요했던 것처럼 나중에 민팅하고 메타데이터를 첨부할 필요가 없습니다. 이로 인해 복잡성과 트랜잭션 크기가 줄어듭니다.
{% totem %}
{% totem-accordion title="생성" %}
다음 스니펫은 자산 데이터를 이미 업로드했다고 가정합니다.

```js
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'
import { create } from '@metaplex-foundation/mpl-core'
const assetAddress = generateSigner(umi)
const result = createV1(umi, {
  asset: assetAddress,
  name: 'My Nft',
  uri: 'https://example.com/my-nft',
}).sendAndConfirm(umi)
```

{% /totem-accordion %}
{% /totem %}

### Collections

Core Collection에는 여러 새로운 기능이 포함되어 있습니다. Collection은 이제 자체 계정 유형이며 일반 Asset과 구별됩니다. 이는 Token Metadata가 동일한 계정과 상태를 사용하여 NFT와 Collection을 모두 나타내어 둘을 구별하기 어렵게 만들었던 접근 방식에서의 환영할 만한 추가입니다.
Core에서 Collection은 추가 기능을 허용하는 **퍼스트 클래스 자산**입니다. 예를 들어, Core는 Collection에 Royalties Plugin을 추가하여 컬렉션 수준의 로열티 조정을 제공합니다. 개발자와 크리에이터는 이제 각 자산을 개별적으로 업데이트하는 대신 컬렉션의 모든 자산을 한 번에 업데이트할 수 있습니다. 컬렉션의 일부 자산에 다른 로열티 설정이 필요하면 어떻게 할까요? 문제없습니다. 동일한 플러그인을 자산에 추가하면 컬렉션 수준 로열티 플러그인이 재정의됩니다.
TM에서는 불가능했던 컬렉션 기능의 예로 컬렉션 수준 로열티가 있습니다. 로열티나 크리에이터를 변경할 때 각 자산을 업데이트할 필요가 없고 컬렉션에서 정의하면 됩니다. 이는 Collection에 [Royalties Plugin](/ko/smart-contracts/core/plugins/royalties)을 추가하여 수행할 수 있습니다. 일부 자산에 다른 로열티 설정이 필요하면? 동일한 플러그인을 자산에 추가하면 컬렉션 수준 로열티 플러그인이 재정의됩니다.
컬렉션 수준에서 동결도 가능합니다.
컬렉션 생성이나 업데이트와 같은 처리에 대한 자세한 정보는 [Managing Collections](/ko/smart-contracts/core/collections) 페이지에서 확인할 수 있습니다.

### 라이프사이클 이벤트와 플러그인

Asset의 라이프사이클 동안 여러 이벤트가 트리거될 수 있습니다:

- 생성
- 전송
- 업데이트
- 소각
- 플러그인 추가
- 권한 플러그인 승인
- 권한 플러그인 제거
TM에서 이러한 라이프사이클 이벤트는 소유자나 위임자에 의해 실행됩니다. 모든 TM Asset (nfts/pNfts)에는 모든 라이프사이클 이벤트에 대한 함수가 포함되어 있습니다. Core에서 이러한 이벤트는 Asset 또는 Collection 전체 수준에서 [Plugins](/ko/smart-contracts/core/plugins)에 의해 처리됩니다.
Asset 수준 또는 Collection 수준 모두에 첨부된 플러그인은 이러한 라이프사이클 이벤트 동안 검증 프로세스를 거쳐 실행을 `approve`, `reject` 또는 `force approve`합니다.

### Freeze / Lock

TM으로 자산을 동결하려면 일반적으로 먼저 동결 권한을 다른 지갑에 위임한 다음 해당 지갑이 NFT를 동결합니다. Core에서는 두 개의 플러그인 중 하나를 사용해야 합니다: `Freeze Delegate` 또는 `Permanent Freeze Delegate`. 후자는 Asset 생성 시에만 추가할 수 있으며, `Freeze Delegate` 플러그인은 현재 소유자가 트랜잭션에 서명하면 언제든지 [추가](/ko/smart-contracts/core/plugins/adding-plugins)할 수 있습니다.
Core에서는 위임도 더 쉽습니다. Delegate Record 계정을 없애고 위임 권한을 플러그인 자체에 직접 저장하며, Asset 생성 시 또는 `addPluginV1` 함수를 통해 Asset에 플러그인을 추가할 때 할당할 수 있습니다.
자산에 아직 동결 플러그인이 없을 때 소유자가 동결 권한을 다른 계정에 할당하려면 해당 권한으로 플러그인을 추가하고 동결해야 합니다.
다음은 `Freeze Delegate` 플러그인을 Asset에 추가하면서 위임 권한에 할당하는 간단한 예입니다.
{% totem %}
{% totem-accordion title="Freeze 플러그인 추가, 권한 할당 및 동결" %}

```js
await addPlugin(umi, {
  asset: asset.publicKey,
  plugin: createPlugin('FreezeDelegate', { frozen: true }),
  initAuthority: pluginAuthority('Address', { address: delegate.publicKey }),
}).sendAndConfirm(umi)
```

{% /totem-accordion %}
{% /totem %}
추가로 Core에서는 **컬렉션 수준**에서 동결이 가능합니다. 전체 컬렉션을 하나의 트랜잭션으로 동결하거나 해제할 수 있습니다.

### Asset 상태

TM에서는 Asset의 현재 상태(동결, 잠금 또는 전송 가능한 상태인지)를 확인하기 위해 여러 계정을 확인해야 하는 경우가 많습니다. Core에서는 이 상태가 Asset 계정에 저장되지만 Collection 계정의 영향을 받을 수도 있습니다.
작업을 더 쉽게 하기 위해 `@metaplex-foundation/mpl-core` 패키지에 포함된 `canBurn`, `canTransfer`, `canUpdate`와 같은 라이프사이클 헬퍼를 도입했습니다. 이러한 헬퍼는 전달된 주소가 이러한 라이프사이클 이벤트를 실행할 권한이 있는지 알려주는 `boolean` 값을 반환합니다.

```js
const burningAllowed = canBurn(authority, asset, collection)
```

## 빠른 참조

### TM 개념 → Core 동등물

| Token Metadata | Core 동등물 |
|----------------|-----------------|
| Mint 계정 | Asset 계정 |
| Metadata 계정 | Asset 계정 (통합) |
| Associated Token Account | 불필요 |
| 동결 권한 | Freeze Delegate 플러그인 |
| Update authority | Update authority (동일) |
| 위임자 | Transfer/Burn/Update Delegate 플러그인 |
| Collection verified | Collection 멤버십 (자동) |
| Creators 배열 | Verified Creators 플러그인 |
| Uses/utility | 플러그인 (커스텀 로직) |

### 일반적인 작업

| 작업 | Token Metadata | Core |
|-----------|---------------|------|
| NFT 생성 | `createV1()` (다중 계정) | `create()` (단일 계정) |
| 동결 | 위임 후 동결 | Freeze Delegate 플러그인 추가 |
| 메타데이터 업데이트 | `updateV1()` | `update()` |
| 전송 | SPL Token 전송 | `transfer()` |
| 소각 | `burnV1()` | `burn()` |

## FAQ

### 새 프로젝트에 Core와 Token Metadata 중 어떤 것을 사용해야 하나요?

모든 새 프로젝트에는 Core를 사용하세요. 더 저렴하고, 간단하며, 기능이 더 좋습니다. NFT용 Token Metadata는 레거시입니다.

### 기존 TM NFT를 Core로 마이그레이션할 수 있나요?

자동으로는 불가능합니다. Core Asset은 다른 온체인 계정입니다. 마이그레이션하려면 TM NFT를 소각하고 새 Core Asset을 민팅해야 합니다.

### pNFT는 어떻게 되었나요?

Core의 로열티 강제는 허용 목록/거부 목록을 지원하는 Royalties 플러그인을 통해 내장되어 있습니다. 별도의 "프로그래머블" 변형이 필요 없습니다.

### Associated Token Account가 여전히 필요한가요?

아니요. Core Asset은 ATA를 사용하지 않습니다. 소유권은 Asset 계정에 직접 저장됩니다.

### Core에서 크리에이터를 검증하려면 어떻게 하나요?

[Verified Creators 플러그인](/ko/smart-contracts/core/plugins/verified-creators)을 사용합니다. TM의 creator 배열과 유사하게 작동하지만 옵트인입니다.

## 추가 자료

위에서 설명한 기능은 빙산의 일각에 불과합니다. 추가 흥미로운 주제는 다음과 같습니다:

- [컬렉션 관리](/ko/smart-contracts/core/collections)
- [플러그인 개요](/ko/smart-contracts/core/plugins)
- [Attributes Plugin](/ko/smart-contracts/core/plugins/attribute)을 사용한 온체인 데이터 추가
- [Asset 생성](/ko/smart-contracts/core/create-asset)

## 용어집

| 용어 | 정의 |
|------|------------|
| **Token Metadata (TM)** | 다중 계정을 사용하는 레거시 Metaplex NFT 표준 |
| **Core** | 단일 계정 설계의 새로운 Metaplex NFT 표준 |
| **Plugin** | Core Asset에 추가되는 모듈식 기능 |
| **ATA** | Associated Token Account (Core에서는 불필요) |
| **pNFT** | TM의 프로그래머블 NFT (로열티 강제는 Core에 내장) |
