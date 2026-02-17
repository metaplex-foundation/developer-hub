---
title: FAQ
metaTitle: FAQ | Bubblegum V2
description: Bubblegum에 대한 자주 묻는 질문.
---

## Bubblegum V2란 무엇인가요?

Bubblegum V2는 여러 개선 사항과 새로운 기능을 도입하는 Bubblegum 프로그램의 새로운 반복입니다.
이는 알려진 Bubblegum 프로그램의 일부이지만 명령어와 데이터 구조가 다릅니다.
Bubblegum V2를 사용하면 cNFT가 Metaplex Token Metadata 컬렉션 대신 MPL-Core 컬렉션을 사용하여 그룹화됩니다. 또한 동결, 해동, 소울바운드 NFT와 같은 새로운 기능과 다음과 같은 추가 기능을 도입합니다:
- **동결 및 해동 기능**: 프로젝트 제작자는 이제 cNFT를 동결하고 해동할 수 있어 특정 이벤트 중 전송을 방지하거나 베스팅 메커니즘을 구현하는 등 다양한 사용 사례를 위해 자산을 더 잘 제어할 수 있습니다.
- **MPL-Core 컬렉션 통합**: Bubblegum V2 NFT는 이제 토큰 메타데이터 컬렉션에 제한되지 않고 MPL-Core 컬렉션에 추가될 수 있어 더 넓은 Metaplex 생태계와의 유연성과 통합을 제공합니다.
- **로열티 강제**: Bubblegum V2는 [MPL-Core](/smart-contracts/core) 컬렉션을 사용하므로 `ProgramDenyList`를 사용하여 cNFT에 로열티를 강제할 수 있습니다.
- **소울바운드 NFT**: cNFT는 이제 소울바운드(양도 불가능)로 만들 수 있어 소유자의 지갑에 영구적으로 바인딩됩니다. 이는 자격증명, 참석 증명, 신원 확인 등에 완벽합니다. 컬렉션에서 `PermanentFreezeDelegate` 플러그인이 활성화되어야 합니다.
- **영구 전송 허용**: 컬렉션에서 `PermanentTransferDelegate` 플러그인이 활성화된 경우 영구 전송 위임자는 리프 소유자의 상호 작용 없이 cNFT를 새 소유자에게 전송할 수 있습니다.

## 전송, 위임, 소각 등과 같은 작업에 필요한 인수를 어떻게 찾나요? {% #replace-leaf-instruction-arguments %}

전송, 위임, 소각 등과 같이 Bubblegum 트리에서 리프를 교체하는 명령어를 사용할 때마다 프로그램은 현재 리프가 유효하고 업데이트될 수 있음을 확인하는 데 사용되는 많은 매개변수가 필요합니다. 압축된 NFT의 데이터가 온체인 계정 내에서 사용할 수 없기 때문에 **증명**, **리프 인덱스**, **넌스** 등과 같은 추가 매개변수가 프로그램이 조각들을 채우는 데 필요합니다.

모든 정보는 `getAsset`과 `getAssetProof` RPC 메서드를 모두 사용하여 **Metaplex DAS API**에서 검색할 수 있습니다. 하지만 이러한 메서드의 RPC 응답과 명령어에서 예상하는 매개변수는 정확히 같지 않으며 하나에서 다른 것으로 파싱하는 것은 간단하지 않습니다.

다행히 우리 SDK는 아래 코드 예제에서 볼 수 있듯이 모든 무거운 작업을 수행하는 도우미 메서드를 제공합니다. 압축된 NFT의 자산 ID를 받아들이고 소각, 전송, 업데이트 등과 같이 리프를 교체하는 명령어에 직접 주입할 수 있는 매개변수 묶음을 반환합니다.

그렇긴 하지만, 파싱을 직접 해야 한다면 명령어에서 예상하는 매개변수와 Metaplex DAS API에서 검색하는 방법에 대한 간단한 분석은 다음과 같습니다. 여기서는 `getAsset`과 `getAssetProof` RPC 메서드의 결과가 각각 `rpcAsset`과 `rpcAssetProof` 변수를 통해 액세스 가능하다고 가정합니다.

- **리프 소유자**: `rpcAsset.ownership.owner`를 통해 액세스 가능.
- **리프 위임자**: `rpcAsset.ownership.delegate`를 통해 액세스 가능하며 null일 때 `rpcAsset.ownership.owner`로 기본 설정되어야 합니다.
- **머클 트리**: `rpcAsset.compression.tree` 또는 `rpcAssetProof.tree_id`를 통해 액세스 가능.
- **루트**: `rpcAssetProof.root`를 통해 액세스 가능.
- **데이터 해시**: `rpcAsset.compression.data_hash`를 통해 액세스 가능.
- **크리에이터 해시**: `rpcAsset.compression.creator_hash`를 통해 액세스 가능.
- **넌스**: `rpcAsset.compression.leaf_id`를 통해 액세스 가능.
- **인덱스**: `rpcAssetProof.node_index - 2^max_depth`를 통해 액세스 가능. 여기서 `max_depth`는 트리의 최대 깊이이며 `rpcAssetProof.proof` 배열의 길이에서 추론할 수 있습니다.
- **증명**: `rpcAssetProof.proof`를 통해 액세스 가능.
- **메타데이터**: 현재 `rpcAsset` 응답의 다양한 필드에서 재구성되어야 합니다.

{% dialect-switcher title="리프를 교체하는 명령어를 위한 매개변수 가져오기" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

Bubblegum Umi 라이브러리는 위의 설명에 맞는 `getAssetWithProof` 도우미 메서드를 제공합니다. 다음은 `transfer` 명령어를 사용하는 예제입니다. 이 경우 `leafOwner` 매개변수가 서명자여야 하고 `assetWithProof`가 소유자를 공개 키로 제공하므로 `leafOwner` 매개변수를 재정의합니다.

캐노피 크기에 따라 `getAssetWithProof` 도우미의 `truncateCanopy: true` 매개변수를 사용하는 것이 합리적일 수 있습니다. 트리 구성을 가져와 필요하지 않은 증명을 자릅니다. 트랜잭션 크기가 너무 커지면 도움이 됩니다.

```ts
import { getAssetWithProof, transfer } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, 
// {  truncateCanopy: true } // 증명을 가지치기하는 선택사항 
);
await transferV2(umi, {
  ...assetWithProof,
  leafOwner: leafOwnerA, // 서명자로서.
  newLeafOwner: leafOwnerB.publicKey,
}).sendAndConfirm(umi);

await transferV2(umi, {
  ...assetWithProof,
  leafOwner: leafOwnerA, // 서명자로서.
  newLeafOwner: leafOwnerB.publicKey,
}).sendAndConfirm(umi)
```

{% totem-accordion title="도우미 함수 없이 매개변수 가져오기" %}

완성도를 위해 제공된 도우미 함수를 사용하지 않고 동일한 결과를 얻는 방법은 다음과 같습니다.

```ts
import { publicKeyBytes } from '@metaplex-foundation/umi'
import { transfer } from '@metaplex-foundation/mpl-bubblegum'

const rpcAsset = await umi.rpc.getAsset(assetId)
const rpcAssetProof = await umi.rpc.getAssetProof(assetId)

await transfer(umi, {
  leafOwner: leafOwnerA,
  newLeafOwner: leafOwnerB.publicKey,
  merkleTree: rpcAssetProof.tree_id,
  root: publicKeyBytes(rpcAssetProof.root),
  dataHash: publicKeyBytes(rpcAsset.compression.data_hash),
  creatorHash: publicKeyBytes(rpcAsset.compression.creator_hash),
  nonce: rpcAsset.compression.leaf_id,
  index: rpcAssetProof.node_index - 2 ** rpcAssetProof.proof.length,
  proof: rpcAssetProof.proof,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## "트랜잭션이 너무 큽니다" 오류를 해결하는 방법 {% #transaction-size %}

전송이나 소각과 같은 리프 교체 작업을 수행할 때 "트랜잭션이 너무 큽니다" 오류가 발생할 수 있습니다. 이를 해결하려면 다음 솔루션을 고려하세요:

1. `truncateCanopy` 옵션 사용:
   `getAssetWithProof` 함수에 `{ truncateCanopy: true }`를 전달하세요:

   ```ts
   const assetWithProof = await getAssetWithProof(umi, assetId, 
    { truncateCanopy: true }
   );
   ```

   이 옵션은 머클 트리 구성을 검색하고 캐노피를 기반으로 불필요한 증명을 제거하여 `assetWithProof`를 최적화합니다. 추가 RPC 호출이 추가되지만 트랜잭션 크기를 크게 줄입니다.

2. 버전화된 트랜잭션과 주소 조회 테이블 활용:
   다른 접근 방식은 [버전화된 트랜잭션과 주소 조회 테이블](https://metaplex.com/docs/umi/toolbox/address-lookup-table)을 구현하는 것입니다. 이 방법은 트랜잭션 크기를 더 효과적으로 관리하는 데 도움이 될 수 있습니다.

이러한 기술을 적용하면 트랜잭션 크기 제한을 극복하고 작업을 성공적으로 실행할 수 있습니다.
