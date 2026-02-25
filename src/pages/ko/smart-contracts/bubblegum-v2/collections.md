---
title: 컬렉션 관리
metaTitle: 컬렉션 관리 - Bubblegum V2
description: Bubblegum에서 컬렉션을 설정, 확인 및 확인 해제하는 방법을 알아보세요.
created: '01-15-2025'
updated: '02-24-2026'
keywords:
  - NFT collection
  - verify collection
  - cNFT collection
  - MPL-Core collection
  - setCollectionV2
  - BubblegumV2 plugin
about:
  - Compressed NFTs
  - NFT collections
  - MPL-Core
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: 민팅 후 cNFT를 컬렉션에 추가하려면 어떻게 해야 하나요?
    a: newCoreCollection 매개변수와 함께 setCollectionV2 명령을 사용하세요. 컬렉션에는 BubblegumV2 플러그인이 활성화되어 있어야 합니다.
  - q: cNFT의 컬렉션을 변경할 수 있나요?
    a: 예. coreCollection(현재)과 newCoreCollection(새로운) 매개변수 모두와 함께 setCollectionV2를 사용하세요. 두 컬렉션 권한이 모두 서명해야 합니다.
  - q: BubblegumV2 플러그인이란 무엇인가요?
    a: 컬렉션에서 동결/해동, 소울바운드 cNFT, 로열티 강제와 같은 Bubblegum V2 기능을 활성화하는 MPL-Core 컬렉션 플러그인입니다.
---

## Summary

**Managing collections** for compressed NFTs uses the **setCollectionV2** instruction to add, change, or remove MPL-Core collections on existing cNFTs. This page covers setting and removing collections after minting.

- Set an MPL-Core collection on an existing cNFT using setCollectionV2
- Remove a collection from a cNFT
- Change between collections (both authorities must sign)
- Collections must have the BubblegumV2 plugin enabled

cNFT는 민팅 시 또는 나중에 MPL-Core 컬렉션에 추가될 수 있습니다. {% .lead %}

NFT와 관련된 컬렉션의 개념에 익숙하지 않다면, 이는 다른 NFT를 함께 그룹화하는 데 사용할 수 있는 특별한 비압축 NFT입니다. 따라서 **컬렉션**의 데이터는 전체 컬렉션의 이름과 브랜딩을 설명하는 데 사용됩니다. Bubblegum V2부터는 리프 소유자의 상호 작용 없이 위임자가 cNFT를 동결하고 해동할 수 있도록 하는 등 컬렉션 수준에서 추가 기능을 허용합니다. [MPL-Core 컬렉션에 대한 자세한 내용은 여기에서 읽을 수 있습니다](/ko/smart-contracts/core/collections).

[여기에 문서화된](/ko/smart-contracts/bubblegum-v2/mint-cnfts#minting-to-a-collection) **MintV2** 명령어를 사용하여 압축된 NFT를 컬렉션에 직접 민팅하는 것이 가능합니다. 그렇긴 하지만 컬렉션 없이 cNFT를 이미 민팅했다면 해당 cNFT에 컬렉션을 설정하는 방법을 살펴보겠습니다. "verified" 부울이 있는 Metaplex Token Metadata 컬렉션을 사용하는 Bubblegum v1과 달리 Bubblegum V2는 해당 부울이 없는 MPL-Core 컬렉션을 사용합니다.

MPL-Core 컬렉션은 [`BubblegumV2` 플러그인](/ko/smart-contracts/core/plugins/bubblegum)을 포함해야 합니다.

다음 섹션은 단일 단계 트랜잭션에서 cNFT에서 컬렉션을 설정하고 제거하는 방법을 보여줍니다. `coreCollection`과 `newCoreCollection` 매개변수를 추가할 때 단일 명령어에서 두 작업을 모두 수행하는 것도 가능합니다. 두 컬렉션 권한이 동일한 지갑이 아닌 경우 둘 다 서명해야 합니다.

## 압축된 NFT의 컬렉션 설정
**setCollectionV2** 명령어는 cNFT의 컬렉션을 설정하는 데 사용할 수 있습니다. cNFT에서 컬렉션을 제거하거나 cNFT의 컬렉션을 변경하는 데도 사용할 수 있습니다.

{% dialect-switcher title="압축된 NFT의 컬렉션 설정" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import {
  getAssetWithProof,
  setCollectionV2,
  MetadataArgsV2Args
} from '@metaplex-foundation/mpl-bubblegum';
import {
  unwrapOption,
  none,
} from '@metaplex-foundation/umi';

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});

const collection = unwrapOption(assetWithProof.metadata.collection)

const metadata: MetadataArgsV2Args = {
  ...assetWithProof.metadata,
  collection: collection?.key ?? null,
};

const signature = await setCollectionV2(umi, {
  ...assetWithProof,
  newCollectionAuthority: newCollectionUpdateAuthority,
  metadata,
  newCoreCollection: newCoreCollection.publicKey,
}).sendAndConfirm(umi);
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 압축된 NFT의 컬렉션 제거
**setCollectionV2** 명령어는 cNFT에서 컬렉션을 제거하는 데도 사용할 수 있습니다.

{% dialect-switcher title="압축된 NFT의 컬렉션 제거" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import {
  getAssetWithProof,
  setCollectionV2,
  MetadataArgsV2Args
} from '@metaplex-foundation/mpl-bubblegum'
import {
  unwrapOption,
  none,
} from '@metaplex-foundation/umi';

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});

const collection = unwrapOption(assetWithProof.metadata.collection)

const signature = await setCollectionV2(umi, {
  ...assetWithProof,
  authority: collectionAuthoritySigner,
  coreCollection: collection!.key
}).sendAndConfirm(umi);
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Notes

- The MPL-Core collection must have the `BubblegumV2` plugin enabled before cNFTs can be added to it.
- Unlike Bubblegum V1 (which uses Token Metadata collections with a "verified" boolean), V2 uses MPL-Core collections without verification flags.
- When changing between collections, both the old and new collection authorities must sign the transaction.

## FAQ

#

## Glossary

| Term | Definition |
|------|------------|
| **setCollectionV2** | The Bubblegum V2 instruction for setting, changing, or removing the collection of a cNFT |
| **MPL-Core Collection** | A Core standard collection account used to group cNFTs in Bubblegum V2 |
| **BubblegumV2 Plugin** | An MPL-Core plugin that enables V2 features on a collection (freeze, soulbound, royalties) |
| **Collection Authority** | The update authority of the MPL-Core collection |
