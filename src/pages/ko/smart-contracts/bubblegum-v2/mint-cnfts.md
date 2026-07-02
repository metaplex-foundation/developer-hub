---
title: 압축된 NFT 민팅
metaTitle: 압축된 NFT 민팅 - Bubblegum V2
description: Bubblegum V2에서 압축된 NFT를 민팅하는 방법을 알아보세요.
created: '01-15-2025'
updated: '06-19-2026'
keywords:
  - mint compressed NFT
  - mint cNFT
  - NFT minting
  - Bubblegum mint
  - collection mint
  - mintV2
  - MPL-Core collection
about:
  - Compressed NFTs
  - NFT minting
  - Solana transactions
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: 압축된 NFT를 컬렉션에 민팅하려면 어떻게 해야 하나요?
    a: coreCollection 매개변수를 MPL-Core 컬렉션 주소로 설정하여 mintV2 명령을 사용하세요. 컬렉션에는 BubblegumV2 플러그인이 활성화되어 있어야 합니다.
  - q: 민팅 후 자산 ID를 얻으려면 어떻게 해야 하나요?
    a: 트랜잭션이 완료된 후 parseLeafFromMintV2Transaction 헬퍼를 사용하세요. 자산 ID를 포함한 리프 스키마를 반환합니다.
  - q: 누구나 내 트리에서 민팅할 수 있나요?
    a: 트리가 공개로 설정된 경우에만 가능합니다. 비공개 트리의 경우 트리 생성자 또는 트리 위임자만 민팅할 수 있습니다.
  - q: 민팅에 필요한 메타데이터 필드는 무엇인가요?
    a: MetadataArgsV2에는 name, uri, sellerFeeBasisPoints, collection(또는 none), 그리고 creators 배열이 필요합니다.
  - q: cNFT가 MPL-Core 컬렉션에서 로열티를 상속할 수 있나요?
    a: 예. Royalties 플러그인이 있는 컬렉션에 민팅할 때 sellerFeeBasisPoints를 생략하거나(또는 SELLER_FEE_BASIS_POINTS_INHERIT 센티널을 전달) 할 수 있습니다. 리프에는 65535(0xffff)가 저장되고 표시 시 컬렉션에서 로열티가 해석됩니다.
---

## Summary

**Minting compressed NFTs** adds new cNFTs to a Bubblegum Tree using the **mintV2** instruction. This page covers minting with and without MPL-Core collections, and retrieving the asset ID from mint transactions.

- Mint cNFTs to a Bubblegum Tree using the mintV2 instruction
- Mint directly into an MPL-Core collection with the BubblegumV2 plugin
- Retrieve the asset ID and leaf schema from the mint transaction
- Configure metadata including name, URI, creators, and royalties
- MPL-Core 컬렉션의 Royalties 플러그인에서 seller fee basis points 상속

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

## 컬렉션에서 로열티 상속

MPL-Core 컬렉션에 민팅할 때 컬렉션의 로열티 비율을 모든 cNFT에 복사하는 대신 리프에 **센티널** seller fee basis points 값(`65535`, `SELLER_FEE_BASIS_POINTS_INHERIT` / `0xffff`로 내보냄)을 저장할 수 있습니다. 마켓플레이스와 인덱서는 표시 시 컬렉션의 [Royalties 플러그인](/ko/smart-contracts/core/plugins/royalties)에서 실효 로열티를 해석하고, 온체인 리프는 해싱을 위해 센티널을 유지합니다.

JavaScript SDK의 `mintV2` 헬퍼는 `coreCollection`이 제공되고 `metadata.sellerFeeBasisPoints`가 생략되면 이 동작을 기본값으로 사용합니다.

**요구 사항:**

- MPL-Core 컬렉션에는 `BubblegumV2`와 `Royalties` 플러그인이 모두 있어야 합니다.
- 상속된 seller fee를 사용할 때 `metadata.creators`는 **빈 배열**이어야 합니다. 크리에이터 분배는 리프 수준 크리에이터가 아니라 컬렉션의 Royalties 플러그인에서 가져옵니다.
- 상속된 seller fee는 컬렉션 내 cNFT에만 유효합니다. 컬렉션 없는 민팅은 `0`에서 `10000` 사이의 명시적인 값을 사용해야 합니다.

{% code-tabs-imported from="bubblegum/mint-inherit-royalties" frameworks="umi" /%}

단일 민트에 대해 컬렉션 기본값을 재정의하려면 명시적인 `sellerFeeBasisPoints`를 전달할 수 있습니다.

{% callout type="note" title="컬렉션 제거" %}
상속된 seller fee를 사용하는 cNFT는 seller fee가 명시적인 값으로 업데이트될 때까지 컬렉션에서 제거할 수 없습니다. [컬렉션 관리](/ko/smart-contracts/bubblegum-v2/collections#inherited-royalties) 및 [압축 NFT 업데이트](/ko/smart-contracts/bubblegum-v2/update-cnfts#inherited-royalties)를 참조하세요.
{% /callout %}

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

## Notes

- The Bubblegum Tree must be created before minting. See [Creating Trees](/smart-contracts/bubblegum-v2/create-trees).
- For collection mints, the MPL-Core collection must have the `BubblegumV2` plugin enabled.
- 컬렉션에서 로열티를 상속하려면 컬렉션에 `Royalties` 플러그인도 있어야 하며 리프의 `creators` 배열은 비어 있어야 합니다.
- The collection authority must sign the transaction when minting to a collection, regardless of whether the tree is public or private.
- Use `parseLeafFromMintV2Transaction` only after the transaction is **finalized**, not just confirmed.

## FAQ

### 컬렉션에 압축 NFT를 민팅하려면 어떻게 해야 하나요?

MPL-Core 컬렉션 주소로 `coreCollection` 매개변수를 설정하고 `collectionAuthority` 서명자를 제공하여 `mintV2` 명령을 사용하세요. 컬렉션에는 `BubblegumV2` 플러그인이 활성화되어 있어야 합니다.

### 민팅 후 자산 ID를 가져오려면 어떻게 해야 하나요?

트랜잭션이 완료된 후 `parseLeafFromMintV2Transaction` 헬퍼를 사용하세요. 트랜잭션을 파싱하고 `leaf.id`를 통해 자산 ID를 포함한 리프 스키마를 반환합니다.

### 누구나 내 트리에서 민팅할 수 있나요?

트리가 `public: true`로 생성된 경우에만 가능합니다. 비공개 트리의 경우 트리 생성자 또는 트리 위임자만 cNFT를 민팅할 수 있습니다.

### 민팅에 필요한 메타데이터 필드는 무엇인가요?

`MetadataArgsV2` 구조체에는 다음이 필요합니다: `name`(문자열), `uri`(JSON 메타데이터를 가리키는 문자열), `sellerFeeBasisPoints`(0-10000, 또는 컬렉션에 민팅하여 Royalties 플러그인에서 상속할 경우 생략), `collection`(공개 키 또는 none), `creators`(크리에이터 객체 배열. 로열티를 상속할 때는 비어 있어야 함).

### cNFT가 MPL-Core 컬렉션에서 로열티를 상속할 수 있나요?

예. `coreCollection`으로 민팅할 때 `metadata.sellerFeeBasisPoints`를 생략하고 `metadata.creators`를 비워 두세요. SDK는 리프에 `SELLER_FEE_BASIS_POINTS_INHERIT`(`65535`)를 저장합니다. 컬렉션에는 `Royalties` 플러그인이 있어야 합니다. [컬렉션에서 로열티 상속](#inheriting-royalties-from-the-collection)을 참조하세요.

## Glossary

| Term | Definition |
|------|------------|
| **mintV2** | The Bubblegum V2 instruction for minting compressed NFTs, replacing the V1 mint instructions |
| **MetadataArgsV2** | The metadata structure passed to mintV2, containing name, URI, royalties, collection, and creators |
| **SELLER_FEE_BASIS_POINTS_INHERIT** | Sentinel value `65535` (`0xffff`) stored on-chain to indicate royalties are inherited from the MPL-Core collection |
| **Collection Authority** | The signer authorized to manage the MPL-Core collection — required when minting to a collection |
| **BubblegumV2 Plugin** | An MPL-Core collection plugin that enables Bubblegum V2 features (freeze, soulbound, royalties) |
| **Asset ID** | A PDA derived from the merkle tree address and leaf index, uniquely identifying a compressed NFT |
| **Leaf Schema** | The data structure stored as a leaf in the merkle tree, containing the cNFT's hashed metadata and ownership info |
