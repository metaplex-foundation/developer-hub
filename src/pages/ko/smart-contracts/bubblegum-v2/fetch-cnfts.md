---
title: 압축된 NFT 가져오기
metaTitle: 압축된 NFT 가져오기 | Bubblegum V2
description: Bubblegum에서 압축된 NFT를 가져오는 방법을 알아보세요.
---

[개요](/ko/smart-contracts/bubblegum#read-api) 페이지에서 언급했듯이 압축된 NFT는 일반 NFT처럼 온체인 계정 내에 저장되지 않고 대신 이를 생성하고 업데이트한 트랜잭션에 기록됩니다. {% .lead %}

따라서 압축된 NFT의 검색을 용이하게 하기 위해 특별한 인덱서가 생성되었습니다. 이 인덱스된 데이터는 **Metaplex DAS API**라고 하는 Solana RPC 메서드의 확장을 통해 사용할 수 있습니다. 실제로 DAS API를 통해 모든 **디지털 자산**을 가져올 수 있습니다. 이는 압축된 NFT, 일반 NFT, 또는 심지어 대체 가능한 자산일 수 있습니다.

모든 RPC가 DAS API를 지원하지 않기 때문에 압축된 NFT를 작업할 계획이라면 RPC 제공업체를 신중하게 선택해야 합니다. Metaplex DAS API를 지원하는 모든 RPC 목록을 [전용 페이지](/ko/solana/rpcs-and-das)에서 유지 관리하고 있습니다.

이 페이지에서는 Metaplex DAS API를 사용하여 압축된 NFT를 가져오는 방법을 알아보겠습니다.

## Metaplex DAS API SDK 설치

Metaplex DAS API를 지원하는 RPC 제공업체를 선택했다면 압축된 NFT를 가져오기 위해 특별한 RPC 메서드를 보낼 수 있습니다. 하지만 우리 SDK는 도우미 메서드를 제공하여 DAS API를 시작하는 더 편리한 방법을 제공합니다. SDK를 사용하여 Metaplex DAS API를 시작하려면 아래 지침을 따르세요.

{% totem %}

{% dialect-switcher title="Metaplex DAS API 시작하기" %}
{% dialect title="JavaScript" id="js" %}

{% totem-prose %}
Umi를 사용할 때 Metaplex DAS API 플러그인이 `mplBubblegum` 플러그인 내에 자동으로 설치됩니다. 따라서 이미 준비가 되어 있습니다!

전체 `mplBubblegum` 플러그인을 가져오지 _않고_ DAS API 플러그인을 사용하려면 Metaplex DAS API 플러그인을 직접 설치하여 그렇게 할 수 있습니다:

```sh
npm install @metaplex-foundation/digital-asset-standard-api
```

그 후 Umi 인스턴스에 라이브러리를 등록합니다:

```ts
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';

umi.use(dasApi());
```
{% /totem-prose %}
{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

{% totem-prose %}

Metaplex DAS API에서 사용할 수 있는 메서드에 대한 자세한 정보는 [저장소](https://github.com/metaplex-foundation/digital-asset-standard-api)에서 찾을 수 있습니다.

{% /totem-prose %}
{% /totem %}

## 자산 ID {% #asset-ids %}

압축되었든 아니든 NFT를 가져오려면 NFT를 식별하는 고유 ID에 액세스해야 합니다. 이 고유 식별자를 **자산 ID**라고 합니다.

- 일반 NFT의 경우 다른 모든 계정이 해당 주소에서 파생되므로 해당 목적으로 **NFT의 민트 주소**를 사용합니다.
- 압축된 NFT의 경우 **머클 트리의 주소**와 머클 트리에서 압축된 NFT의 **리프 인덱스**에서 파생되는 특별한 **PDA**(프로그램 파생 주소)를 사용합니다. 이 특별한 PDA를 **리프 자산 ID**라고 합니다.

DAS API 메서드가 대량으로 압축된 NFT를 가져올 때(예: 주어진 주소가 소유한 모든 NFT 가져오기) 이를 제공하므로 일반적으로 **리프 자산 ID**를 직접 파생할 필요는 없습니다. 하지만 머클 트리의 주소와 cNFT의 리프 인덱스에 액세스할 수 있다면 SDK를 사용하여 리프 자산 ID를 파생하는 방법은 다음과 같습니다.

{% dialect-switcher title="리프 자산 ID PDA 찾기" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { findLeafAssetIdPda } from '@metaplex-foundation/mpl-bubblegum'

const [assetId, bump] = await findLeafAssetIdPda(umi, {
  merkleTree,
  leafIndex,
})
```

{% /dialect %}
{% /dialect-switcher %}

## 압축된 NFT 가져오기

압축된 NFT를 가져오는 것은 DAS API의 `getAsset` 메서드를 호출하는 것만큼 간단합니다. 이 메서드는 다음 정보를 포함하는 **Rpc Asset** 객체를 반환합니다:

- **Id**: 위에서 논의한 자산 ID.
- **Interface**: 우리가 다루고 있는 자산의 유형을 정의하는 특별한 값. 예: `V1_NFT` 또는 `ProgrammableNFT`.
- **Ownership**: 자산을 누가 소유하는지 알려주는 객체. 설정되었을 수 있는 모든 위임자와 자산이 동결로 표시되었는지 여부를 포함합니다.
- **Mutable**: 자산의 데이터가 업데이트 가능한지 여부를 나타내는 부울.
- **Authorities**: 권한 배열. 각각은 권한이 자산에서 수행할 수 있는 작업을 나타내는 범위 배열을 포함합니다.
- **Content**: 자산의 데이터를 포함하는 객체. 즉, URI와 파싱된 `metadata` 객체를 포함합니다.
- **Royalty**: 자산이 정의한 로열티 모델을 정의하는 객체. 현재 자산의 크리에이터에게 수익의 백분율을 보내는 하나의 로열티 모델만 지원됩니다.
- **Supply**: 인쇄 가능한 자산을 다룰 때 이 객체는 인쇄된 에디션의 현재 및 최대 공급량을 제공합니다.
- **Creators**: 자산의 크리에이터 목록. 각각은 크리에이터가 확인되었는지 여부를 나타내는 `verified` 부울과 크리에이터에게 보내야 하는 로열티 백분율을 나타내는 `share` 숫자를 포함합니다.
- **Grouping**: 자산을 대량으로 인덱싱하고 검색하는 데 도움이 되는 키/값 그룹화 메커니즘 배열. 현재 하나의 그룹화 메커니즘만 지원됩니다 — `collection` — 이를 통해 컬렉션별로 자산을 그룹화할 수 있습니다.
- **Compression**: 압축된 NFT를 다룰 때 이 객체는 Bubblegum 트리의 리프에 대한 다양한 정보를 제공합니다. 예를 들어 리프의 전체 해시를 제공하지만 자산의 진위를 확인하는 데 사용되는 **크리에이터 해시**와 **데이터 해시**와 같은 부분 해시도 제공합니다. 또한 머클 트리 주소, 루트, 시퀀스 등을 제공합니다.

다음은 SDK를 사용하여 주어진 자산 ID에서 자산을 가져오는 방법입니다.

{% dialect-switcher title="압축된 NFT 가져오기" %}
{% dialect title="JavaScript" id="js" %}

```ts
const rpcAsset = await umi.rpc.getAsset(assetId)
```

{% /dialect %}
{% /dialect-switcher %}

## 압축된 NFT의 증명 가져오기

`getAsset` RPC 메서드가 자산에 대한 많은 정보를 반환하지만 자산의 **증명**은 반환하지 않습니다. [개요](/ko/smart-contracts/bubblegum#merkle-trees-leaves-and-proofs) 페이지에서 언급했듯이 압축된 NFT의 증명은 자산의 진위를 확인할 수 있는 해시 목록입니다. 이것 없이는 누구나 주어진 데이터로 트리에 압축된 NFT를 가지고 있다고 가장할 수 있습니다.

따라서 압축된 NFT의 많은 작업(예: 소각, 전송, 업데이트 등)은 이를 수행하기 전에 자산의 증명을 요구합니다. 자산의 증명을 계산하는 것은 가능하지만 누군가가 주어진 트리 내에 존재하는 모든 압축된 NFT의 해시를 알아야 합니다. 이것이 DAS API가 모든 압축된 NFT의 증명도 추적하는 이유입니다.

압축된 NFT의 증명에 액세스하려면 `getAssetProof` RPC 메서드를 사용할 수 있습니다. 이 메서드는 다음 정보를 포함하는 **Rpc Asset Proof** 객체를 반환합니다:

- **Proof**: 약속된 대로 압축된 NFT의 증명.
- **Root**: 자산이 속한 머클 트리의 루트. 제공된 증명을 사용하여 자산을 확인할 때 최종 해시로 이 루트가 나와야 합니다.
- **Node Index**: 트리의 모든 단일 노드를 왼쪽에서 오른쪽으로, 위에서 아래로 세면 머클 트리에서 자산의 인덱스. **리프 인덱스**라고 하는 더 유용한 인덱스는 다음 공식으로 이 값에서 추론할 수 있습니다: `leaf_index = node_index - 2^max_depth` 여기서 `max_depth`는 머클 트리의 최대 깊이입니다. **리프 인덱스**는 트리의 리프만(즉, 가장 낮은 행) 왼쪽에서 오른쪽으로 센 경우 머클 트리에서 자산의 인덱스입니다. 이 인덱스는 많은 명령어에서 요청되며 자산의 **리프 자산 ID**를 파생하는 데 사용됩니다.
- **Leaf**: 압축된 NFT의 전체 해시.
- **Tree ID**: 자산이 속한 머클 트리의 주소.

보시다시피 여기의 일부 정보는 `getAsset` RPC 호출에서 중복되지만 편의를 위해 여기에 제공됩니다. 하지만 자산의 **증명**과 **노드 인덱스**는 이 메서드를 통해서만 가져올 수 있습니다.

다음은 SDK를 사용하여 자산의 증명을 가져오는 방법입니다.

{% dialect-switcher title="압축된 NFT의 증명 가져오기" %}
{% dialect title="JavaScript" id="js" %}

```ts
const rpcAssetProof = await umi.rpc.getAssetProof(assetId)
```

{% /dialect %}
{% /dialect-switcher %}

## 여러 압축된 NFT 가져오기

DAS API를 사용하면 `getAssetsByOwner`와 `getAssetsByGroup` RPC 메서드를 사용하여 한 번에 여러 자산을 가져올 수도 있습니다. 이러한 메서드는 다음 정보를 포함하는 페이지네이션된 **Rpc Asset List** 객체를 반환합니다:

- **Items**: 위에서 설명한 **Rpc Asset** 배열.
- **Total**: 제공된 기준에 따라 사용 가능한 자산의 총 수.
- **Limit**: 페이지에서 검색하는 자산의 최대 수.
- **Page**: 번호 매김 페이지네이션을 사용할 때 현재 있는 페이지를 알려줍니다.
- **Before**와 **After**: 커서 페이지네이션을 사용할 때 현재 어떤 자산 이후 및/또는 이전에 자산을 탐색하고 있는지 알려줍니다. 이러한 커서는 이전 및 다음 페이지로 이동하는 데 사용할 수 있습니다.
- **Errors**: RPC에서 반환된 잠재적 오류 목록.

다음은 SDK를 사용하여 이 두 RPC 메서드를 모두 사용하는 방법입니다.

### 소유자별

{% dialect-switcher title="소유자별로 압축된 NFT 가져오기" %}
{% dialect title="JavaScript" id="js" %}

```ts
const rpcAssetList = await umi.rpc.getAssetsByOwner({ owner })
```

{% /dialect %}
{% /dialect-switcher %}

### 컬렉션별

{% dialect-switcher title="컬렉션별로 압축된 NFT 가져오기" %}
{% dialect title="JavaScript" id="js" %}

```ts
const rpcAssetList = await umi.rpc.getAssetsByGroup({
  groupKey: 'collection',
  groupValue: collectionMint,
})
```

{% /dialect %}
{% /dialect-switcher %}
