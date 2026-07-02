---
title: 압축된 NFT 업데이트
metaTitle: 압축된 NFT 업데이트 - Bubblegum V2
description: Bubblegum에서 압축된 NFT를 업데이트하는 방법을 알아보세요.
created: '01-15-2025'
updated: '06-19-2026'
keywords:
  - update compressed NFT
  - update cNFT
  - NFT metadata update
  - Bubblegum update
  - updateMetadataV2
about:
  - Compressed NFTs
  - NFT metadata
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: 압축된 NFT의 메타데이터를 업데이트할 수 있는 사람은 누구인가요?
    a: cNFT가 컬렉션에 속한 경우, 컬렉션 권한만 업데이트할 수 있습니다. 컬렉션에 속하지 않은 경우, 트리 권한(트리 생성자 또는 위임자)이 업데이트할 수 있습니다.
  - q: cNFT에서 업데이트할 수 있는 필드는 무엇인가요?
    a: UpdateArgsArgs에 정의된 이름, URI, 판매자 수수료 기준 포인트 및 기타 메타데이터 필드를 업데이트할 수 있습니다. 변경하려는 필드에는 some('newValue')을 사용하세요.
  - q: 업데이트 시 컬렉션을 전달해야 하나요?
    a: 예, cNFT가 컬렉션에 속한 경우. 컬렉션의 공개 키와 함께 coreCollection 매개변수를 전달하세요. 컬렉션 권한이 트랜잭션에 서명해야 합니다.
  - q: 컬렉션에서 로열티를 상속하는 cNFT를 업데이트하려면 어떻게 해야 하나요?
    a: getAssetWithProof의 currentMetadata(온체인 센티널 유지)를 전달하고, 필요할 때 updateArgs.sellerFeeBasisPoints로 명시적인 값을 설정하세요.
---

## Summary

**Updating a compressed NFT** modifies its metadata using the **updateMetadataV2** instruction. This page covers update authority rules for collection-based and tree-based cNFTs.

- Update cNFT metadata (name, URI, creators, royalties) using updateMetadataV2
- Collection authority updates cNFTs that belong to a collection
- Tree authority updates cNFTs that do not belong to a collection
- Changes are reflected in the merkle tree and indexed by DAS API providers
- 리프 검증에는 `getAssetWithProof`의 `currentMetadata` 사용(특히 seller fee가 상속된 경우)

**updateMetadataV2** 명령어는 압축된 NFT의 메타데이터를 수정하는 데 사용할 수 있습니다. 머클 루트가 업데이트되어 데이터의 전파된 해시를 반영하고, [Metaplex DAS API](https://github.com/metaplex-foundation/digital-asset-standard-api)를 준수하는 RPC 제공업체는 cNFT의 인덱스를 업데이트합니다.

메타데이터는 압축된 NFT가 컬렉션의 확인된 항목인지 여부에 따라 두 권한 중 하나에 의해 업데이트될 수 있습니다.

## 업데이트 권한

cNFT는 두 가지 가능한 업데이트 권한을 가집니다: 트리 소유자, 또는 (컬렉션에 속한 경우) 컬렉션 권한.

### 컬렉션 권한

cNFT가 컬렉션에 속한 경우 해당 cNFT의 업데이트 권한은 컬렉션의 권한이 됩니다. cNFT를 업데이트할 때 업데이트 함수에 `coreCollection` 인수를 전달해야 합니다.

권한은 현재 umi 신원에서 추론됩니다. 권한이 현재 umi 신원과 다른 경우 `authority` 인수를 서명자 타입으로 전달하거나 나중에 서명하기 위해 `noopSigner`를 생성해야 합니다.

```js
await updateMetadataV2(umi, {
  ...
  authority: collectionAuthority,
  coreCollection: publicKey("11111111111111111111111111111111"),
}).sendAndConfirm(umi)
```

### 트리 권한

cNFT가 컬렉션에 속하지 않는 경우 cNFT의 업데이트 권한은 cNFT가 속한 트리의 권한이 됩니다. 이 경우 업데이트 함수에서 `coreCollection` 인수를 **생략**합니다.

권한은 현재 umi 신원에서 추론됩니다. 권한이 현재 umi 신원과 다른 경우 `authority` 인수를 서명자 타입으로 전달하거나 나중에 서명하기 위해 `noopSigner`를 생성해야 합니다.

## cNFT 업데이트

{% dialect-switcher title="압축된 NFT 업데이트" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import {
  getAssetWithProof,
  updateMetadataV2,
  UpdateArgsArgs,
} from '@metaplex-foundation/mpl-bubblegum'
import { some } from '@metaplex-foundation/umi'

// 도우미를 사용하여 자산과 증명을 가져옵니다.
const assetWithProof = await getAssetWithProof(umi, assetId, {
  truncateCanopy: true,
})

// 그런 다음 NFT의 메타데이터를 업데이트하는 데 사용할 수 있습니다.
const updateArgs: UpdateArgsArgs = {
  name: some('새 이름'),
  uri: some('https://updated-example.com/my-nft.json'),
}
await updateMetadataV2(umi, {
  ...assetWithProof,
  leafOwner,
  currentMetadata: assetWithProof.currentMetadata ?? assetWithProof.metadata,
  updateArgs,
  // 선택적 매개변수. 권한이 현재 umi 신원과 다른 서명자 타입인 경우
  // 여기에 해당 서명자를 할당합니다.
  authority: <Signer>,
  // 선택적 매개변수. cNFT가 컬렉션에 속한 경우 여기에 전달합니다.
  coreCollection: publicKey("22222222222222222222222222222222"),
}).sendAndConfirm(umi)
```

{% callout type="note" title="metadata가 아닌 currentMetadata 사용" %}
V2 cNFT의 경우 `getAssetWithProof`는 로열티 관련 두 가지 형태를 반환합니다:

- **`metadata`** — 표시용 값. 상속된 로열티의 경우 `sellerFeeBasisPoints`가 해석된 컬렉션 비율을 표시할 수 있습니다.
- **`currentMetadata`** — 리프 해싱 및 업데이트 명령에 사용되는 정규 온체인 메타데이터. 상속된 로열티의 경우 `SELLER_FEE_BASIS_POINTS_INHERIT` 센티널(`65535`)을 유지합니다.

`updateMetadataV2`, `setCollectionV2` 및 기존 리프를 검증하는 다른 쓰기 명령에는 항상 `currentMetadata`를 전달하세요.
{% /callout %}

## 상속된 로열티 {% #inherited-royalties %}

`updateArgs.sellerFeeBasisPoints`를 `some(SELLER_FEE_BASIS_POINTS_INHERIT)`로 설정하면 cNFT를 상속 로열티**로** 전환할 수 있습니다. 컬렉션에는 `Royalties` 플러그인이 있어야 하며 업데이트된 메타데이터의 `creators` 배열은 비어 있어야 합니다.

상속 로열티**에서** 명시적인 비율로 되돌리려면 — 예를 들어 [cNFT를 컬렉션에서 제거하기](/ko/smart-contracts/bubblegum-v2/collections#inherited-royalties) 전에 — 원하는 basis points를 전달하세요:

{% code-tabs-imported from="bubblegum/update-inherit-royalties" frameworks="umi" /%}

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Notes

- The update authority depends on whether the cNFT belongs to a collection. Collection cNFTs use the collection authority; standalone cNFTs use the tree authority.
- You must pass `currentMetadata` from `getAssetWithProof` so the program can verify the current leaf before applying updates. Do not substitute `metadata` when `currentMetadata` is present.
- Use `some()` for fields you want to update and omit fields you want to keep unchanged.
- Inherited seller fees require an empty leaf-level `creators` array and a collection with the `Royalties` plugin.

## FAQ

### 압축된 NFT의 메타데이터를 업데이트할 수 있는 사람은 누구인가요?

cNFT가 컬렉션에 속한 경우 컬렉션 권한만 업데이트할 수 있습니다. 컬렉션에 속하지 않은 경우 트리 권한(트리 생성자 또는 위임자)이 업데이트할 수 있습니다.

### cNFT에서 업데이트할 수 있는 필드는 무엇인가요?

`UpdateArgsArgs`에 정의된 이름, URI, seller fee basis points 및 기타 메타데이터 필드를 업데이트할 수 있습니다. 변경하려는 필드에는 `some('newValue')`를 사용하세요.

### 업데이트 시 컬렉션을 전달해야 하나요?

예, cNFT가 컬렉션에 속한 경우. 컬렉션의 공개 키와 함께 `coreCollection` 매개변수를 전달하세요. 컬렉션 권한이 트랜잭션에 서명해야 합니다.

### 컬렉션에서 로열티를 상속하는 cNFT를 업데이트하려면 어떻게 해야 하나요?

검증을 위해 온체인 센티널을 유지하려면 `getAssetWithProof`에서 `currentMetadata`를 전달하세요. 상속 로열티로 전환하려면 `updateArgs.sellerFeeBasisPoints`에 `some(SELLER_FEE_BASIS_POINTS_INHERIT)`를, 전환하려면 명시적인 숫자를 사용하세요.

## Glossary

| Term | Definition |
|------|------------|
| **updateMetadataV2** | The Bubblegum V2 instruction for modifying compressed NFT metadata |
| **Collection Authority** | The update authority of the MPL-Core collection, authorized to update cNFTs in that collection |
| **Tree Authority** | The tree creator or delegate, authorized to update cNFTs that do not belong to a collection |
| **UpdateArgsArgs** | The TypeScript type defining which metadata fields to update, using Option wrappers |
| **currentMetadata** | The canonical on-chain metadata from `getAssetWithProof`, required for leaf verification on write instructions |
| **SELLER_FEE_BASIS_POINTS_INHERIT** | Sentinel value `65535` indicating royalties are inherited from the MPL-Core collection |
