---
title: Core와 Token Metadata의 차이점
metaTitle: Core와 Token Metadata의 차이점 | Core
description: Solana 블록체인에서 Core와 Token Metadata NFT 프로토콜의 차이점.
---

이 페이지는 먼저 TM과 비교한 Core의 일반적인 개선 사항을 탐색하고, 나중에 TM 함수의 동등한 기능이 Core에서 어떻게 사용될 수 있는지에 대한 더 기술적인 정보를 제공합니다.

## 차이점 개요

- **전례없는 비용 효율성**: Metaplex Core는 사용 가능한 대안과 비교하여 가장 낮은 민팅 비용을 제공합니다. 예를 들어, Token Metadata로 .022 SOL이 드는 NFT를 Core로는 .0037 SOL에 민팅할 수 있습니다.
- **개선된 개발자 경험**: 대부분의 디지털 자산이 전체 대체 가능한 토큰 프로그램을 유지하는 데 필요한 데이터를 상속받는 반면, Core는 NFT에 최적화되어 모든 핵심 데이터를 단일 Solana 계정에 저장할 수 있습니다. 이는 개발자의 복잡성을 극적으로 줄이고 Solana의 네트워크 성능 향상에도 도움이 됩니다.
- **향상된 컬렉션 관리**: 컬렉션에 대한 일급 지원으로, 개발자와 창작자는 로열티 및 플러그인과 같은 컬렉션 수준 구성을 쉽게 관리할 수 있으며, 이는 개별 NFT에 대해 고유하게 재정의될 수 있습니다. 이는 단일 트랜잭션으로 수행될 수 있어 컬렉션 관리 비용과 Solana 트랜잭션 수수료를 줄입니다.
- **고급 플러그인 지원**: 내장 스테이킹부터 자산 기반 포인트 시스템까지, Metaplex Core의 플러그인 아키텍처는 유틸리티와 커스터마이제이션의 방대한 영역을 열어줍니다. 플러그인을 통해 개발자는 생성, 전송, 소각과 같은 자산 생명 주기 이벤트에 후크를 걸어 커스텀 동작을 추가할 수 있습니다.
- **호환성 및 지원**: Metaplex Developer Platform에서 완전히 지원되는 Core는 SDK 제품군과 향후 프로그램과 원활하게 통합되어 Metaplex 생태계를 풍성하게 할 예정입니다.
- **즉시 사용 가능한 인덱싱**: Metaplex Digital Asset Standard API (DAS API)를 확장하여, Core assets는 자동으로 인덱싱되고 모든 Solana NFT에 사용되는 공통 인터페이스를 통해 애플리케이션 개발자가 사용할 수 있습니다. 하지만 독특한 개선 사항은 Core 속성 플러그인을 통해 개발자가 현재 자동으로 인덱싱되는 온체인 데이터를 추가할 수 있다는 것입니다.

## 기술적 개요

### 생성

Core Asset을 생성하려면 단일 생성 명령어만 필요합니다. Token Metadata에서 필요했던 민팅 후 메타데이터 첨부 과정이 필요하지 않습니다. 이는 복잡성과 트랜잭션 크기를 줄입니다.

{% totem %}
{% totem-accordion title="생성" %}
다음 스니펫은 이미 자산 데이터를 업로드했다고 가정합니다.

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

### 컬렉션

Core 컬렉션은 여러 새로운 기능을 포함합니다. 컬렉션은 이제 자체적인 계정 유형이며 일반적인 Assets과 차별화됩니다. 이는 동일한 계정과 상태를 사용하여 NFT와 컬렉션을 모두 나타내던 Token Metadata의 접근 방식에서 온 환영할 만한 추가 기능으로, 두 가지를 구별하기 어렵게 만들었습니다.

Core에서 컬렉션은 추가 기능을 허용하는 **일급 자산**입니다. 예를 들어, Core는 컬렉션에 로열티 플러그인을 추가하여 컬렉션 수준의 로열티 조정을 제공합니다. 개발자와 창작자는 이제 각 자산을 개별적으로 업데이트해야 하는 것이 아니라 컬렉션의 모든 자산을 한 번에 업데이트할 수 있습니다. 하지만 컬렉션의 일부 자산이 다른 로열티 설정을 가져야 한다면 어떻게 될까요? 문제없습니다 - 자산에 동일한 플러그인을 추가하면 컬렉션 수준의 로열티 플러그인이 재정의됩니다.

TM에서는 불가능했던 컬렉션 기능은 예를 들어 컬렉션 수준 로열티입니다 - 로열티나 창작자를 변경할 때 각 자산을 업데이트할 필요가 없이 컬렉션에서 정의하면 됩니다. 이는 컬렉션에 [로열티 플러그인](/ko/smart-contracts/core/plugins/royalties)을 추가하여 수행할 수 있습니다. 일부 자산이 다른 로열티 설정을 가져야 한다면? 자산에 동일한 플러그인을 추가하면 컬렉션 수준 로열티 플러그인이 재정의됩니다.

컬렉션 수준에서도 동결이 가능합니다.

컬렉션 생성이나 업데이트와 같은 컬렉션 처리에 대한 자세한 정보는 [컬렉션 관리](/ko/smart-contracts/core/collections) 페이지에서 찾을 수 있습니다.

### 생명 주기 이벤트와 플러그인

Asset의 생명 주기 동안 다음과 같은 여러 이벤트가 트리거될 수 있습니다:

- 생성
- 전송
- 업데이트
- 소각
- 플러그인 추가
- 권한 플러그인 승인
- 권한 플러그인 제거

TM에서 이러한 생명 주기 이벤트는 소유자나 위임자에 의해 실행됩니다. 모든 TM Assets (nfts/pNfts)는 모든 생명 주기 이벤트에 대한 함수를 포함합니다. Core에서는 이러한 이벤트가 Asset 수준이나 컬렉션 수준에서 [플러그인](/ko/smart-contracts/core/plugins)에 의해 처리됩니다.

Asset 수준이나 컬렉션 수준 모두에 첨부된 플러그인은 이러한 생명 주기 이벤트 동안 검증 프로세스를 거쳐 이벤트 실행을 `승인`, `거부` 또는 `강제 승인`합니다.

### 동결 / 잠금

TM으로 자산을 동결하려면 일반적으로 먼저 동결 권한을 다른 지갑에 위임한 다음, 해당 지갑이 NFT를 동결합니다. Core에서는 두 플러그인 중 하나를 사용해야 합니다: `Freeze Delegate` 또는 `Permanent Freeze Delegate`. 후자는 자산 생성 시에만 추가할 수 있는 반면, `Freeze Delegate` 플러그인은 현재 소유자가 트랜잭션에 서명하는 경우 언제든지 [추가](/ko/smart-contracts/core/plugins/adding-plugins)할 수 있습니다.

Core에서는 위임 기록 계정을 제거하고 위임 권한을 플러그인 자체에 직접 저장하면서 자산 생성 시나 `addPluginV1` 함수를 통해 자산에 플러그인을 추가하는 시점에서 할당할 수 있기 때문에 위임이 더 쉽습니다.

자산에 동결 플러그인이 아직 없을 때 소유자가 다른 계정에 동결 권한을 할당하려면, 해당 권한으로 플러그인을 추가하고 동결해야 합니다.

다음은 자산에 `Freeze Delegate` 플러그인을 추가하면서 위임된 권한에 할당하는 빠른 예시입니다.

{% totem %}
{% totem-accordion title="동결 플러그인 추가, 권한 할당 및 동결" %}

```js
await addPlugin(umi, {
  asset: asset.publicKey,
  plugin: createPlugin('FreezeDelegate', { frozen: true }),
  initAuthority: pluginAuthority('Address', { address: delegate.publicKey }),
}).sendAndConfirm(umi)
```

{% /totem-accordion %}
{% /totem %}

추가적으로 Core에서는 **컬렉션 수준**에서 동결을 수행할 수 있습니다. 전체 컬렉션을 단 하나의 트랜잭션으로 동결하거나 해제할 수 있습니다.

### 자산 상태

TM에서는 자산의 현재 상태와 동결, 잠금 또는 전송 가능한 상태인지 확인하기 위해 여러 계정을 확인해야 하는 경우가 많습니다. Core에서는 이 상태가 자산 계정에 저장되지만 컬렉션 계정의 영향도 받을 수 있습니다.

작업을 더 쉽게 하기 위해 우리는 `@metaplex-foundation/mpl-core` 패키지에 포함된 `canBurn`, `canTransfer`, `canUpdate`와 같은 생명 주기 헬퍼를 도입했습니다. 이러한 헬퍼는 전달된 주소가 이러한 생명 주기 이벤트를 실행할 권한이 있는지 알려주는 `boolean` 값을 반환합니다.

```js
const burningAllowed = canBurn(authority, asset, collection)
```

## 추가 읽기

위에서 설명한 기능들은 빙산의 일각에 불과합니다. 추가로 흥미로운 주제들은 다음과 같습니다:

- 컬렉션 관리
- 플러그인 개요
- [속성 플러그인](/ko/smart-contracts/core/plugins/attribute)을 사용한 온체인 데이터 추가