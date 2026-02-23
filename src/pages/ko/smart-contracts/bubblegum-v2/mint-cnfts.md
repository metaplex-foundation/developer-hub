---
title: 압축된 NFT 민팅
metaTitle: 압축된 NFT 민팅 | Bubblegum V2
description: Bubblegum V2에서 압축된 NFT를 민팅하는 방법을 알아보세요.
---

[이전 페이지](/ko/smart-contracts/bubblegum-v2/create-trees)에서 압축된 NFT를 민팅하려면 Bubblegum 트리가 필요하다는 것을 보았고, 하나를 만드는 방법을 보았습니다. 이제 주어진 Bubblegum 트리에서 압축된 NFT를 민팅하는 방법을 살펴보겠습니다. {% .lead %}

Bubblegum 프로그램은 다양한 리프 스키마 버전에 대해 여러 민팅 명령어를 제공합니다. Bubblegum V2는 주어진 컬렉션에 또는 컬렉션 없이 압축된 NFT를 민팅하는 데 사용되는 **mintV2**라는 새로운 민팅 명령어를 도입합니다.

## 컬렉션 없이 민팅

Bubblegum 프로그램은 Bubblegum 트리에서 압축된 NFT를 민팅할 수 있는 **mintV2** 명령어를 제공합니다. Bubblegum 트리가 공개된 경우 누구나 이 명령어를 사용할 수 있습니다. 그렇지 않으면 트리 제작자나 트리 위임자만 사용할 수 있습니다.

**mintV2** 명령어의 주요 매개변수는 다음과 같습니다:

- **머클 트리**: 압축된 NFT가 민팅될 머클 트리 주소.
- **트리 제작자 또는 위임자**: Bubblegum 트리에서 민팅할 수 있는 권한 — 이는 트리의 제작자나 위임자가 될 수 있습니다. 이 권한은 트랜잭션에 서명해야 합니다. 공개 트리의 경우 이 매개변수는 모든 권한이 될 수 있지만 여전히 서명자여야 합니다.
- **리프 소유자**: 민팅될 압축된 NFT의 소유자. 기본적으로 트랜잭션의 지불자로 설정됩니다.
- **리프 위임자**: 민팅된 cNFT를 관리할 수 있는 위임 권한 (있는 경우). 그렇지 않으면 리프 소유자로 설정됩니다.
- **컬렉션 권한**: 주어진 컬렉션을 관리할 수 있는 권한.
- **코어 컬렉션**: 압축된 NFT가 추가될 MPL-Core 컬렉션 NFT.
- **메타데이터**: 민팅될 압축된 NFT의 메타데이터. NFT의 **이름**, **URI**, **컬렉션**, **제작자** 등의 정보를 포함합니다. Bubblegum V2에서 메타데이터는 `uses`와 컬렉션의 `verified` 플래그와 같은 불필요한 필드를 제외한 `MetadataArgsV2`를 사용합니다.

{% dialect-switcher title="컬렉션 없이 압축된 NFT 민팅" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { none } from '@metaplex-foundation/umi';
import { mintV2 } from '@metaplex-foundation/mpl-bubblegum';

await mintV2(umi, {
  leafOwner: umi.identity.publicKey,
  merkleTree: merkleTree.publicKey,
  metadata: {
    name: 'My NFT',
    uri: 'https://example.com/my-nft.json',
    sellerFeeBasisPoints: 550, 
    collection: none(),
    creators: [],
  },
}).sendAndConfirm(umi);
```

{% /dialect %}
{% /dialect-switcher %}

## 컬렉션에 민팅

압축된 NFT가 민팅된 _후에_ 컬렉션을 설정하고 확인하는 것이 가능하지만, Bubblegum V2는 압축된 NFT를 주어진 컬렉션에 직접 민팅할 수 있게 합니다. Bubblegum V2는 압축된 NFT를 그룹화하기 위해 MPL-Core 컬렉션을 사용합니다. 동일한 **mintV2** 명령어가 이를 위해 사용됩니다. 위에서 설명한 매개변수 외에도 코어 컬렉션을 전달하고 컬렉션 권한 또는 위임자로 서명해야 합니다:

- **코어 컬렉션**: MPL-Core 컬렉션 NFT를 가리키는 `coreCollection` 매개변수에 전달되는 민트 주소…
- **컬렉션 권한**: 주어진 컬렉션 NFT를 관리할 수 있는 권한. 이는 컬렉션 NFT의 업데이트 권한이나 위임된 컬렉션 권한이 될 수 있습니다. 이 권한은 Bubblegum 트리가 공개되었는지 여부에 관계없이 트랜잭션에 서명해야 합니다.

**메타데이터** 매개변수는 **컬렉션** 공개 키를 포함해야 합니다.

{% dialect-switcher title="컬렉션에 압축된 NFT 민팅" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import { some } from '@metaplex-foundation/umi';
import { mintV2 } from '@metaplex-foundation/mpl-bubblegum';

await mintV2(umi, {
  collectionAuthority: umi.identity,
  leafOwner: umi.identity.publicKey,
  merkleTree: merkleTree.publicKey,
  coreCollection: collectionSigner.publicKey,
  metadata: {
    name: 'My NFT',
    uri: 'https://example.com/my-nft.json',
    sellerFeeBasisPoints: 550, // 5.5%
    collection: some(collectionSigner.publicKey),
    creators: [],
  },
}).sendAndConfirm(umi);
```

{% totem-accordion title="MPL-Core 컬렉션 생성" %}

아직 컬렉션이 없다면 [`@metaplex-foundation/mpl-core` 라이브러리](/ko/smart-contracts/core/collections#collection이란)를 사용하여 하나를 만들 수 있습니다. 컬렉션에 `BubblegumV2` 플러그인도 추가해야 한다는 점을 명심하세요.
npm install @metaplex-foundation/mpl-core
그리고 다음과 같이 컬렉션을 만드세요:

```ts
import { generateSigner } from '@metaplex-foundation/umi';
import { createCollection } from '@metaplex-foundation/mpl-core';

const collectionSigner = generateSigner(umi);
await createCollection(umi, {
    collection: collectionSigner,
    name: "My Collection",
    uri: "https://example.com/my-nft.json",
    plugins: [
      {
        type: "BubblegumV2",
      },
    ],
  }).sendAndConfirm(umi);
```

{% /totem-accordion %}

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

### 민트 트랜잭션에서 자산 ID와 리프 스키마 가져오기 {% #get-leaf-schema-from-mint-transaction %}

`parseLeafFromMintV2Transaction` 도우미를 사용하여 `mintV2` 트랜잭션에서 리프를 검색하고 자산 ID를 결정할 수 있습니다. 이 함수는 트랜잭션을 파싱하므로 `parseLeafFromMintV2Transaction`을 호출하기 전에 트랜잭션이 완료되었는지 확인해야 합니다.

{% callout type="note" title="트랜잭션 완료" %}
`parseLeafFromMintV2Transaction`을 호출하기 전에 트랜잭션이 완료되었는지 확인하세요.
{% /callout %}

{% dialect-switcher title="민트 트랜잭션에서 리프 스키마 가져오기" %}
{% dialect title="JavaScript" id="js" %}

```ts
import {
  mintV2,
  parseLeafFromMintV2Transaction,
} from '@metaplex-foundation/mpl-bubblegum';

const { signature } = await mintV2(umi, {
  // ... 위의 세부사항 참조
}).sendAndConfirm(umi);

const leaf = await parseLeafFromMintV2Transaction(umi, signature);
const assetId = leaf.id;
```

{% /dialect %}
{% /dialect-switcher %}
