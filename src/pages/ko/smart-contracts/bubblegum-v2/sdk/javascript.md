---
title: JavaScript SDK
metaTitle: JavaScript SDK - Bubblegum V2 - Metaplex
description: Metaplex Bubblegum V2 JavaScript SDK의 완전한 참조 문서. Umi 설정, 트리 생성, 민팅, 전송, 소각, 업데이트, 위임, 동결, 압축 NFT 가져오기를 다룹니다.
created: '01-15-2025'
updated: '02-25-2026'
keywords:
  - mpl-bubblegum JavaScript
  - Bubblegum V2 TypeScript SDK
  - compressed NFT JavaScript
  - cNFT SDK
  - Umi framework
  - mintV2
  - transferV2
  - createTree
  - getAssetWithProof
about:
  - Compressed NFTs
  - JavaScript SDK
  - Umi framework
proficiencyLevel: Beginner
programmingLanguage:
  - JavaScript
  - TypeScript
howToSteps:
  - '@metaplex-foundation/mpl-bubblegum 및 Umi 설치하기'
  - 'mplBubblegum 플러그인을 사용하여 Umi 인스턴스 생성 및 구성하기'
  - 'createTree를 사용하여 Bubblegum 트리 생성하기'
  - 'mintV2를 사용하여 압축 NFT 민팅하기'
faqs:
  - q: Bubblegum V2 JavaScript SDK란 무엇인가요?
    a: Bubblegum V2 JavaScript SDK(@metaplex-foundation/mpl-bubblegum)는 Solana에서 압축 NFT를 생성하고 관리하기 위한 TypeScript 라이브러리입니다. Umi 프레임워크를 기반으로 구축되었으며 DAS API 플러그인이 자동으로 포함됩니다.
  - q: 이 SDK를 사용하려면 특별한 RPC 제공자가 필요한가요?
    a: 예. 압축 NFT를 가져오고 인덱싱하려면 Metaplex DAS API를 지원하는 RPC 제공자가 필요합니다. 표준 Solana RPC 엔드포인트는 DAS를 지원하지 않습니다. 호환 가능한 옵션은 RPC 제공자 페이지를 참조하세요.
  - q: 민팅 후 cNFT의 에셋 ID를 어떻게 가져오나요?
    a: 민트 트랜잭션이 확인된 후 parseLeafFromMintV2Transaction을 사용하세요. 트랜잭션에서 에셋 ID를 포함한 리프 스키마를 추출합니다.
  - q: '"Transaction too large" 오류가 발생하는 이유는 무엇인가요?'
    a: 머클 증명은 트리 깊이에 따라 커집니다. getAssetWithProof에 truncateCanopy true를 전달하거나 주소 조회 테이블이 있는 버전 관리 트랜잭션을 사용하세요.
  - q: 이 SDK를 Bubblegum V1 트리와 함께 사용할 수 있나요?
    a: 아니요. 이 SDK는 LeafSchemaV2를 사용하는 Bubblegum V2를 대상으로 합니다. V1 트리에는 레거시 Bubblegum SDK를 사용하세요.
  - q: getAssetWithProof는 무엇이고 왜 필요한가요?
    a: getAssetWithProof는 DAS API에서 리프 변경 명령에 필요한 모든 파라미터(증명, 루트, 리프 인덱스, 논스, 메타데이터)를 한 번의 호출로 가져오는 헬퍼입니다. 거의 모든 쓰기 명령에 이것이 필요합니다.
---

**Bubblegum V2 JavaScript SDK**(`@metaplex-foundation/mpl-bubblegum`)는 Solana에서 [압축 NFT](/ko/smart-contracts/bubblegum-v2)를 생성하고 관리하기 위한 권장 TypeScript/JavaScript 라이브러리입니다. [Umi 프레임워크](/ko/dev-tools/umi)를 기반으로 구축되었으며, 모든 Bubblegum V2 작업에 대한 타입 안전 함수를 제공하고 [DAS API](/ko/smart-contracts/bubblegum-v2/fetch-cnfts) 플러그인이 자동으로 포함됩니다. {% .lead %}

{% callout title="학습 내용" %}
이 SDK 참조 문서에서 다루는 내용:
- Bubblegum V2 플러그인으로 Umi 설정하기
- cNFT를 저장하기 위한 머클 트리 생성하기
- cNFT 민팅, 전송, 소각, 업데이트
- 위임, 동결, 크리에이터 검증
- DAS API를 사용하여 cNFT 가져오기
- 트랜잭션 크기 제한 및 일반적인 오류 처리
{% /callout %}

## 요약

**Bubblegum V2 JavaScript SDK**는 모든 MPL-Bubblegum V2 프로그램 명령을 타입 안전 API로 래핑하고 cNFT 데이터를 읽기 위한 DAS API 플러그인을 포함합니다.

- 설치: `npm install @metaplex-foundation/mpl-bubblegum @metaplex-foundation/umi-bundle-defaults`
- `.use(mplBubblegum())`을 사용하여 Umi에 등록 — DAS API 플러그인이 자동으로 포함됨
- 쓰기 작업(전송, 소각, 업데이트, 위임, 동결, 검증) 전에 `getAssetWithProof` 사용하기
- Bubblegum V2(MPL-Bubblegum 5.x) 대상 — V1 트리와 호환되지 않음

*Metaplex Foundation이 관리 · February 2026 최종 확인 · MPL-Bubblegum 5.x에 적용 · [GitHub에서 소스 보기](https://github.com/metaplex-foundation/mpl-bubblegum)*

## 빠른 시작

**바로 이동:** [설정](#umi-setup) · [트리 생성](#create-a-bubblegum-tree) · [민팅](#mint-a-compressed-nft) · [전송](#transfer-a-compressed-nft) · [소각](#burn-a-compressed-nft) · [업데이트](#update-a-compressed-nft) · [위임](#delegate-a-compressed-nft) · [컬렉션](#collections) · [동결](#freeze-and-thaw) · [크리에이터 검증](#verify-creators) · [가져오기](#fetching-cnfts) · [오류](#common-errors) · [빠른 참조](#quick-reference)

1. 의존성 설치: `npm install @metaplex-foundation/mpl-bubblegum @metaplex-foundation/umi-bundle-defaults`
2. `.use(mplBubblegum())`으로 Umi 인스턴스 생성하기
3. `createTree`로 Bubblegum 트리 생성하기
4. `mintV2`로 cNFT 민팅하기; 이후 쓰기 작업 전에 `getAssetWithProof` 사용하기

## 설치

```bash {% title="Terminal" %}
npm install @metaplex-foundation/mpl-bubblegum @metaplex-foundation/umi-bundle-defaults
```

{% quick-links %}
{% quick-link title="TypeDoc API 참조" target="_blank" icon="JavaScript" href="https://mpl-bubblegum.typedoc.metaplex.com/" description="SDK의 완전한 생성 API 문서." /%}
{% quick-link title="npm 패키지" target="_blank" icon="JavaScript" href="https://www.npmjs.com/package/@metaplex-foundation/mpl-bubblegum" description="버전 기록이 있는 npmjs.com의 패키지." /%}
{% /quick-links %}

## Umi 설정

`mplBubblegum` 플러그인은 모든 Bubblegum V2 명령과 DAS API 플러그인을 Umi 인스턴스에 등록합니다.

```ts {% title="setup.ts" %}
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplBubblegum } from '@metaplex-foundation/mpl-bubblegum'
import { keypairIdentity } from '@metaplex-foundation/umi'

const umi = createUmi('https://api.devnet.solana.com')
  .use(mplBubblegum())
  .use(keypairIdentity(yourKeypair))
```

{% totem %}
{% totem-accordion title="파일에서 키페어 불러오기" %}
```ts {% title="load-keypair.ts" %}
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplBubblegum } from '@metaplex-foundation/mpl-bubblegum'
import { keypairIdentity } from '@metaplex-foundation/umi'
import { readFileSync } from 'fs'

const secretKey = JSON.parse(readFileSync('/path/to/keypair.json', 'utf-8'))
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secretKey))
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplBubblegum())
  .use(keypairIdentity(keypair))
```
{% /totem-accordion %}
{% totem-accordion title="브라우저 지갑 어댑터" %}
```ts {% title="browser-wallet.ts" %}
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplBubblegum } from '@metaplex-foundation/mpl-bubblegum'
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters'

const umi = createUmi('https://api.devnet.solana.com')
  .use(mplBubblegum())
  .use(walletAdapterIdentity(wallet)) // from @solana/wallet-adapter-react
```
{% /totem-accordion %}
{% /totem %}

## Bubblegum 트리 생성

`createTree`는 새로운 [머클 트리](/ko/smart-contracts/bubblegum-v2/concurrent-merkle-trees)를 온체인에 할당하고 Bubblegum V2 트리로 등록합니다. 트리 파라미터는 영구적이므로 생성 전에 신중하게 선택하세요.

```ts {% title="create-tree.ts" %}
import { createTree } from '@metaplex-foundation/mpl-bubblegum'
import { generateSigner } from '@metaplex-foundation/umi'

const merkleTree = generateSigner(umi)

await createTree(umi, {
  merkleTree,
  maxDepth: 14,        // tree holds 2^14 = 16,384 cNFTs
  maxBufferSize: 64,   // concurrent writes per block
  canopyDepth: 10,     // cached upper nodes (reduces proof size in txs)
  public: false,       // false = only tree creator/delegate can mint
}).sendAndConfirm(umi)

console.log('Tree address:', merkleTree.publicKey)
```

{% callout type="note" %}
`public: false`는 트리 생성자(또는 승인된 트리 위임자)만 트리에서 민팅할 수 있음을 의미합니다. 누구나 민팅할 수 있도록 하려면 `public: true`를 설정하세요. 트리 크기 비용 추정은 [트리 생성](/ko/smart-contracts/bubblegum-v2/create-trees)을 참조하세요.
{% /callout %}

## 압축 NFT 민팅

### 컬렉션 없이 민팅

`mintV2`는 지정된 트리에 새로운 cNFT 리프를 생성합니다.

```ts {% title="mint-cnft.ts" %}
import { mintV2 } from '@metaplex-foundation/mpl-bubblegum'
import { none } from '@metaplex-foundation/umi'

await mintV2(umi, {
  leafOwner: umi.identity.publicKey,
  merkleTree: merkleTree.publicKey,
  metadata: {
    name: 'My Compressed NFT',
    uri: 'https://example.com/my-nft.json',
    sellerFeeBasisPoints: 500, // 5% royalty
    collection: none(),
    creators: [{ address: umi.identity.publicKey, verified: false, share: 100 }],
  },
}).sendAndConfirm(umi)
```

### 컬렉션에 민팅

`coreCollection`을 전달하여 cNFT를 [MPL-Core 컬렉션](/ko/smart-contracts/bubblegum-v2/collections)과 연결합니다. 컬렉션에는 `BubblegumV2` 플러그인이 활성화되어 있어야 합니다.

```ts {% title="mint-to-collection.ts" %}
import { mintV2 } from '@metaplex-foundation/mpl-bubblegum'
import { publicKey } from '@metaplex-foundation/umi'

await mintV2(umi, {
  leafOwner: umi.identity.publicKey,
  merkleTree: merkleTree.publicKey,
  metadata: {
    name: 'My Collection cNFT',
    uri: 'https://example.com/my-nft.json',
    sellerFeeBasisPoints: 500,
    collection: publicKey('YourCollectionAddressHere'),
    creators: [{ address: umi.identity.publicKey, verified: false, share: 100 }],
  },
  coreCollection: publicKey('YourCollectionAddressHere'),
}).sendAndConfirm(umi)
```

### 민팅 후 에셋 ID 가져오기

민트가 확인된 후 `parseLeafFromMintV2Transaction`을 사용하여 리프 스키마(에셋 ID 포함)를 가져옵니다.

```ts {% title="parse-mint.ts" %}
import { mintV2, parseLeafFromMintV2Transaction } from '@metaplex-foundation/mpl-bubblegum'
import { none } from '@metaplex-foundation/umi'

const { signature } = await mintV2(umi, {
  leafOwner: umi.identity.publicKey,
  merkleTree: merkleTree.publicKey,
  metadata: {
    name: 'My Compressed NFT',
    uri: 'https://example.com/my-nft.json',
    sellerFeeBasisPoints: 500,
    collection: none(),
    creators: [],
  },
}).sendAndConfirm(umi)

const leaf = await parseLeafFromMintV2Transaction(umi, signature)
console.log('Asset ID:', leaf.id)
console.log('Leaf index:', leaf.nonce)
```

## 압축 NFT 전송

`transferV2`는 cNFT의 소유권을 새로운 지갑으로 이전합니다. `getAssetWithProof`는 [DAS API](/ko/smart-contracts/bubblegum-v2/fetch-cnfts)에서 필요한 모든 증명 파라미터를 가져옵니다.

```ts {% title="transfer.ts" %}
import { getAssetWithProof, transferV2 } from '@metaplex-foundation/mpl-bubblegum'
import { publicKey } from '@metaplex-foundation/umi'

const assetWithProof = await getAssetWithProof(umi, assetId, { truncateCanopy: true })

await transferV2(umi, {
  ...assetWithProof,
  leafOwner: umi.identity, // current owner as signer
  newLeafOwner: publicKey('NewOwnerAddressHere'),
}).sendAndConfirm(umi)
```

## 압축 NFT 소각

`burnV2`는 cNFT를 영구적으로 소각하고 트리에서 리프를 제거합니다.

```ts {% title="burn.ts" %}
import { getAssetWithProof, burnV2 } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, { truncateCanopy: true })

await burnV2(umi, {
  ...assetWithProof,
  leafOwner: umi.identity, // owner must sign
}).sendAndConfirm(umi)
```

## 압축 NFT 업데이트

`updateMetadataV2`는 cNFT의 메타데이터를 수정합니다. 업데이트 권한은 cNFT가 컬렉션에 속하는지 여부에 따라 다릅니다. 권한 규칙은 [cNFT 업데이트](/ko/smart-contracts/bubblegum-v2/update-cnfts)를 참조하세요.

```ts {% title="update.ts" %}
import {
  getAssetWithProof,
  updateMetadataV2,
  UpdateArgsArgs,
} from '@metaplex-foundation/mpl-bubblegum'
import { some, publicKey } from '@metaplex-foundation/umi'

const assetWithProof = await getAssetWithProof(umi, assetId, { truncateCanopy: true })

const updateArgs: UpdateArgsArgs = {
  name: some('Updated Name'),
  uri: some('https://example.com/updated.json'),
}

await updateMetadataV2(umi, {
  ...assetWithProof,
  leafOwner: assetWithProof.leafOwner,
  currentMetadata: assetWithProof.metadata,
  updateArgs,
  // If cNFT belongs to a collection, pass the collection address:
  coreCollection: publicKey('YourCollectionAddressHere'),
}).sendAndConfirm(umi)
```

## 압축 NFT 위임

[리프 위임자](/ko/smart-contracts/bubblegum-v2/delegate-cnfts)는 소유자를 대신하여 cNFT를 전송, 소각, 동결할 수 있습니다. 위임자는 전송 후 새로운 소유자로 초기화됩니다.

### 위임자 승인

```ts {% title="approve-delegate.ts" %}
import { getAssetWithProof, delegate } from '@metaplex-foundation/mpl-bubblegum'
import { publicKey } from '@metaplex-foundation/umi'

const assetWithProof = await getAssetWithProof(umi, assetId, { truncateCanopy: true })

await delegate(umi, {
  ...assetWithProof,
  leafOwner: umi.identity,
  previousLeafDelegate: umi.identity.publicKey, // current delegate (use owner if none)
  newLeafDelegate: publicKey('DelegateAddressHere'),
}).sendAndConfirm(umi)
```

### 위임자 취소

새로운 위임자를 소유자 자신의 주소로 설정합니다.

```ts {% title="revoke-delegate.ts" %}
import { getAssetWithProof, delegate } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, { truncateCanopy: true })

await delegate(umi, {
  ...assetWithProof,
  leafOwner: umi.identity,
  previousLeafDelegate: currentDelegatePublicKey,
  newLeafDelegate: umi.identity.publicKey, // revoke by delegating to self
}).sendAndConfirm(umi)
```

## 컬렉션

`setCollectionV2`는 cNFT의 MPL-Core 컬렉션을 설정, 변경 또는 제거합니다. 자세한 내용은 [컬렉션 관리](/ko/smart-contracts/bubblegum-v2/collections)를 참조하세요.

### 컬렉션 설정 또는 변경

```ts {% title="set-collection.ts" %}
import {
  getAssetWithProof,
  setCollectionV2,
  MetadataArgsV2Args,
} from '@metaplex-foundation/mpl-bubblegum'
import { unwrapOption, publicKey } from '@metaplex-foundation/umi'

const assetWithProof = await getAssetWithProof(umi, assetId, { truncateCanopy: true })
const collection = unwrapOption(assetWithProof.metadata.collection)

const metadata: MetadataArgsV2Args = {
  ...assetWithProof.metadata,
  collection: collection?.key ?? null,
}

await setCollectionV2(umi, {
  ...assetWithProof,
  metadata,
  newCollectionAuthority: newCollectionUpdateAuthority,
  newCoreCollection: publicKey('NewCollectionAddressHere'),
}).sendAndConfirm(umi)
```

### 컬렉션 제거

```ts {% title="remove-collection.ts" %}
import { getAssetWithProof, setCollectionV2 } from '@metaplex-foundation/mpl-bubblegum'
import { unwrapOption } from '@metaplex-foundation/umi'

const assetWithProof = await getAssetWithProof(umi, assetId, { truncateCanopy: true })
const collection = unwrapOption(assetWithProof.metadata.collection)

await setCollectionV2(umi, {
  ...assetWithProof,
  authority: collectionAuthoritySigner,
  coreCollection: collection!.key,
}).sendAndConfirm(umi)
```

## 동결과 해제

두 가지 동결 메커니즘을 사용할 수 있습니다. 에셋 수준 대 컬렉션 수준 동결의 전체 설명은 [cNFT 동결](/ko/smart-contracts/bubblegum-v2/freeze-cnfts)을 참조하세요.

### cNFT 동결 (리프 위임자)

```ts {% title="freeze.ts" %}
import {
  getAssetWithProof,
  delegateAndFreezeV2,
} from '@metaplex-foundation/mpl-bubblegum'
import { publicKey } from '@metaplex-foundation/umi'

const assetWithProof = await getAssetWithProof(umi, assetId, { truncateCanopy: true })

// Delegates and freezes in one instruction
await delegateAndFreezeV2(umi, {
  ...assetWithProof,
  leafOwner: umi.identity,
  newLeafDelegate: publicKey('FreezeAuthorityAddressHere'),
}).sendAndConfirm(umi)
```

### cNFT 해제

```ts {% title="thaw.ts" %}
import { getAssetWithProof, thawV2 } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, { truncateCanopy: true })

await thawV2(umi, {
  ...assetWithProof,
  leafDelegate: umi.identity, // freeze authority must sign
}).sendAndConfirm(umi)
```

### 소울바운드 cNFT 생성

소울바운드 cNFT는 영구적으로 전송 불가능합니다. 컬렉션에는 `PermanentFreezeDelegate` 플러그인이 활성화되어 있어야 합니다. 설정 세부 정보는 [cNFT 동결](/ko/smart-contracts/bubblegum-v2/freeze-cnfts#create-a-soulbound-c-nft)을 참조하세요.

```ts {% title="soulbound.ts" %}
import { getAssetWithProof, setNonTransferableV2 } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, { truncateCanopy: true })

await setNonTransferableV2(umi, {
  ...assetWithProof,
  // permanent freeze delegate must sign
}).sendAndConfirm(umi)
```

{% callout type="warning" %}
`setNonTransferableV2`는 되돌릴 수 없습니다. 이 호출 후에는 cNFT를 다시 전송 가능하게 만들 수 없습니다.
{% /callout %}

## 크리에이터 검증

`verifyCreatorV2`는 크리에이터 항목에 `verified` 플래그를 설정합니다. 검증되는 크리에이터는 트랜잭션에 서명해야 합니다. 자세한 내용은 [크리에이터 검증](/ko/smart-contracts/bubblegum-v2/verify-creators)을 참조하세요.

### 크리에이터 검증

```ts {% title="verify-creator.ts" %}
import {
  getAssetWithProof,
  verifyCreatorV2,
  MetadataArgsV2Args,
} from '@metaplex-foundation/mpl-bubblegum'
import { unwrapOption, none } from '@metaplex-foundation/umi'

const assetWithProof = await getAssetWithProof(umi, assetId, { truncateCanopy: true })
const collectionOption = unwrapOption(assetWithProof.metadata.collection)

const metadata: MetadataArgsV2Args = {
  name: assetWithProof.metadata.name,
  uri: assetWithProof.metadata.uri,
  sellerFeeBasisPoints: assetWithProof.metadata.sellerFeeBasisPoints,
  collection: collectionOption ? collectionOption.key : none(),
  creators: assetWithProof.metadata.creators,
}

await verifyCreatorV2(umi, {
  ...assetWithProof,
  metadata,
  creator: umi.identity, // the creator being verified must sign
}).sendAndConfirm(umi)
```

### 크리에이터 검증 취소

```ts {% title="unverify-creator.ts" %}
import {
  getAssetWithProof,
  unverifyCreatorV2,
  MetadataArgsV2Args,
} from '@metaplex-foundation/mpl-bubblegum'
import { unwrapOption, none } from '@metaplex-foundation/umi'

const assetWithProof = await getAssetWithProof(umi, assetId, { truncateCanopy: true })

const metadata: MetadataArgsV2Args = {
  name: assetWithProof.metadata.name,
  uri: assetWithProof.metadata.uri,
  sellerFeeBasisPoints: assetWithProof.metadata.sellerFeeBasisPoints,
  collection: unwrapOption(assetWithProof.metadata.collection)?.key ?? none(),
  creators: assetWithProof.metadata.creators,
}

await unverifyCreatorV2(umi, {
  ...assetWithProof,
  metadata,
  creator: umi.identity,
}).sendAndConfirm(umi)
```

## cNFT 가져오기

DAS API 플러그인은 `mplBubblegum()`에 의해 자동으로 등록됩니다. 사용 가능한 메서드의 전체 설명은 [cNFT 가져오기](/ko/smart-contracts/bubblegum-v2/fetch-cnfts)를 참조하세요.

### 단일 cNFT 가져오기

```ts {% title="fetch-asset.ts" %}
import { publicKey } from '@metaplex-foundation/umi'

const asset = await umi.rpc.getAsset(assetId)
console.log('Owner:', asset.ownership.owner)
console.log('Name:', asset.content.metadata.name)
```

### 소유자별 cNFT 가져오기

```ts {% title="fetch-by-owner.ts" %}
import { publicKey } from '@metaplex-foundation/umi'

const result = await umi.rpc.getAssetsByOwner({
  owner: publicKey('OwnerAddressHere'),
})
console.log('cNFTs owned:', result.items.length)
```

### 컬렉션별 cNFT 가져오기

```ts {% title="fetch-by-collection.ts" %}
import { publicKey } from '@metaplex-foundation/umi'

const result = await umi.rpc.getAssetsByGroup({
  groupKey: 'collection',
  groupValue: publicKey('CollectionAddressHere'),
})
console.log('cNFTs in collection:', result.items.length)
```

### 트리와 인덱스에서 리프 에셋 ID 도출

```ts {% title="find-asset-id.ts" %}
import { findLeafAssetIdPda } from '@metaplex-foundation/mpl-bubblegum'

const [assetId] = await findLeafAssetIdPda(umi, {
  merkleTree: merkleTree.publicKey,
  leafIndex: 0,
})
```

## 트랜잭션 패턴

### "Transaction Too Large" 오류 처리

머클 증명은 트리 깊이에 따라 커집니다. `getAssetWithProof`에 `truncateCanopy: true`를 전달하면 [캐노피](/ko/smart-contracts/bubblegum-v2/merkle-tree-canopy)에 캐시된 증명 노드를 자동으로 제거하여 트랜잭션 크기를 줄입니다.

```ts {% title="truncate-canopy.ts" %}
import { getAssetWithProof } from '@metaplex-foundation/mpl-bubblegum'

// truncateCanopy fetches tree config and removes redundant proof nodes
const assetWithProof = await getAssetWithProof(umi, assetId, { truncateCanopy: true })
```

잘린 증명도 트랜잭션 제한을 초과하는 매우 깊은 트리의 경우 [주소 조회 테이블이 있는 버전 관리 트랜잭션](/ko/dev-tools/umi/toolbox/address-lookup-table)을 사용하세요.

### 전송 및 확인

```ts {% title="send-and-confirm.ts" %}
const result = await mintV2(umi, { ... }).sendAndConfirm(umi)
console.log('Signature:', result.signature)
```

### 전송하지 않고 빌드

```ts {% title="build-only.ts" %}
const tx = await mintV2(umi, { ... }).buildAndSign(umi)
// send later: await umi.rpc.sendTransaction(tx)
```

## 일반적인 오류

### `Transaction too large`
머클 증명이 1232바이트 트랜잭션 제한을 초과합니다. `getAssetWithProof`에서 `{ truncateCanopy: true }`를 사용하거나 주소 조회 테이블이 있는 버전 관리 트랜잭션을 구현하세요.

### `Invalid proof`
증명이 오래되었습니다 — 증명을 가져온 후 트리가 수정되었습니다. 항상 쓰기 트랜잭션을 제출하기 직전에 `getAssetWithProof`를 호출하세요.

### `Leaf already exists` / `Invalid leaf`
에셋 ID 또는 리프 인덱스가 올바르지 않습니다. `findLeafAssetIdPda`를 사용하여 에셋 ID를 다시 도출하거나 `getAssetsByOwner`를 통해 다시 가져오세요.

### `InvalidAuthority`
이 명령의 소유자, 위임자 또는 필요한 권한자가 아닙니다. 올바른 서명자가 `leafOwner` 또는 `leafDelegate`로 설정되어 있는지 확인하세요.

### `Tree is full`
머클 트리가 `maxDepth` 용량(`2^maxDepth` 리프)에 도달했습니다. 민팅을 계속하려면 새로운 트리를 생성하세요.

### DAS 가져오기에서 `Account not found`
RPC 제공자가 Metaplex DAS API를 지원하지 않을 수 있습니다. [호환 가능한 RPC 제공자](/ko/rpc-providers)로 전환하세요.

## 참고 사항

- `getAssetWithProof`는 거의 모든 쓰기 명령 전에 필요합니다. 오래된 증명 오류를 피하려면 항상 제출하기 직전에 호출하세요.
- DAS를 통해 가져온 증명은 가져오기와 제출 사이에 트리가 수정되면 오래될 수 있습니다. 고동시성 시나리오에서는 동일한 원자적 흐름에서 가져오기와 제출을 수행해야 합니다.
- `setNonTransferableV2`(소울바운드)는 되돌릴 수 없습니다. 한번 설정하면 전송 가능성을 복원할 방법이 없습니다.
- 위임자 권한은 `transferV2` 후 새로운 소유자로 초기화됩니다. 새로운 소유자는 필요한 경우 다시 위임해야 합니다.
- 이 SDK는 Bubblegum V2(`LeafSchemaV2`)를 대상으로 합니다. Bubblegum V1 트리나 압축 해제 워크플로와는 호환되지 않습니다.
- cNFT와 함께 사용되는 컬렉션에는 `BubblegumV2` 플러그인이 활성화되어 있어야 합니다. 이 플러그인이 없는 표준 MPL-Core 컬렉션은 사용할 수 없습니다.

## 빠른 참조

### Bubblegum V2 함수

| 함수 | 목적 |
|----------|---------|
| `createTree` | 새로운 Bubblegum V2 머클 트리 생성 |
| `mintV2` | 새로운 압축 NFT 민팅 |
| `transferV2` | cNFT 소유권 전송 |
| `burnV2` | cNFT 영구 소각 |
| `updateMetadataV2` | cNFT 메타데이터 업데이트 (이름, URI, 크리에이터, 로열티) |
| `delegate` | 리프 위임자 승인 또는 취소 |
| `setTreeDelegate` | 트리 위임자 승인 또는 취소 |
| `setCollectionV2` | MPL-Core 컬렉션 설정, 변경 또는 제거 |
| `freezeV2` | cNFT 동결 (기존 리프 위임자 필요) |
| `thawV2` | 동결된 cNFT 해제 |
| `delegateAndFreezeV2` | 단일 명령으로 위임 및 동결 |
| `setNonTransferableV2` | cNFT를 영구적으로 소울바운드로 만들기 (되돌릴 수 없음) |
| `verifyCreatorV2` | 크리에이터 항목에 verified 플래그 설정 |
| `unverifyCreatorV2` | 크리에이터 항목에서 verified 플래그 제거 |
| `getAssetWithProof` | 쓰기 명령에 필요한 모든 증명 파라미터 가져오기 |
| `findLeafAssetIdPda` | 트리 주소와 리프 인덱스에서 cNFT 에셋 ID 도출 |
| `parseLeafFromMintV2Transaction` | 민트 트랜잭션에서 리프 스키마 (에셋 ID 포함) 추출 |

### 최소 의존성

```json {% title="package.json" %}
{
  "dependencies": {
    "@metaplex-foundation/mpl-bubblegum": "^5.0.0",
    "@metaplex-foundation/umi": "^1.0.0",
    "@metaplex-foundation/umi-bundle-defaults": "^1.0.0"
  }
}
```

### 프로그램 주소

| 프로그램 | 주소 |
|---------|---------|
| MPL-Bubblegum V2 | `BGUMAp9Gq7iTEuizy4pqaxsTyUCBK68MDfK752saRPUY` |
| SPL Account Compression | `cmtDvXumGCrqC1Age74AVPhSRVXJMd8PJS91L8KbNCK` |
| SPL Noop | `noopb9bkMVfRPU8AsbpTUg8AQkHtKwMYZiFUjNRtMmV` |

### 트리 크기 참조

| 최대 깊이 | 용량 | 예상 비용 |
|-----------|----------|-------------|
| 14 | 16,384 | ~0.34 SOL |
| 17 | 131,072 | ~1.1 SOL |
| 20 | 1,048,576 | ~8.5 SOL |
| 24 | 16,777,216 | ~130 SOL |
| 30 | 1,073,741,824 | ~2,000 SOL |

## 자주 묻는 질문

### Bubblegum V2 JavaScript SDK란 무엇인가요?

Bubblegum V2 JavaScript SDK(`@metaplex-foundation/mpl-bubblegum`)는 Solana에서 [압축 NFT](/ko/smart-contracts/bubblegum-v2)를 생성하고 관리하기 위한 TypeScript 라이브러리입니다. [Umi 프레임워크](/ko/dev-tools/umi)를 기반으로 구축되었으며, 모든 MPL-Bubblegum V2 프로그램 명령에 대한 타입 안전 래퍼를 제공하고 [DAS API](/ko/smart-contracts/bubblegum-v2/fetch-cnfts) 플러그인이 자동으로 포함됩니다.

### 이 SDK를 사용하려면 특별한 RPC 제공자가 필요한가요?

예. 압축 NFT는 cNFT 데이터를 인덱싱하고 가져오려면 Metaplex DAS API를 지원하는 RPC 제공자가 필요합니다. 표준 Solana RPC는 DAS를 지원하지 않습니다. 호환 가능한 옵션(Helius, Triton, Shyft 등)은 [RPC 제공자](/ko/rpc-providers) 페이지를 참조하세요.

### 민팅 후 cNFT의 에셋 ID를 어떻게 가져오나요?

확인된 트랜잭션 서명과 함께 `parseLeafFromMintV2Transaction`을 사용하세요. 민트 트랜잭션을 디코딩하여 `leaf.id`(에셋 ID)와 `leaf.nonce`(리프 인덱스)를 포함한 전체 리프 스키마를 반환합니다.

### "Transaction too large" 오류가 발생하는 이유는 무엇인가요?

머클 증명은 트리 깊이에 따라 커집니다. `getAssetWithProof`에 `{ truncateCanopy: true }`를 전달하면 온체인 캐노피에 캐시된 증명 노드를 자동으로 제거합니다. 매우 깊은 트리에는 [주소 조회 테이블이 있는 버전 관리 트랜잭션](/ko/dev-tools/umi/toolbox/address-lookup-table)을 사용하세요.

### 이 SDK를 Bubblegum V1 트리와 함께 사용할 수 있나요?

아니요. 이 SDK는 `LeafSchemaV2`와 V2 머클 트리를 사용하는 Bubblegum V2를 대상으로 합니다. V1 트리에는 레거시 Bubblegum SDK를 사용하세요. V2 트리와 V1 트리는 교차 호환되지 않습니다.

### `getAssetWithProof`는 무엇이고 왜 필요한가요?

`getAssetWithProof`는 DAS API에서 `getAsset`과 `getAssetProof` 모두를 호출하고 응답을 Bubblegum V2 쓰기 명령이 예상하는 정확한 파라미터 형태로 파싱하는 헬퍼입니다. 거의 모든 변형 명령(전송, 소각, 업데이트, 위임, 동결, 검증)에 이러한 파라미터가 필요합니다. 오래된 증명 오류를 피하려면 항상 제출하기 직전에 호출하세요.

## 용어집

| 용어 | 정의 |
|------|------------|
| **Umi** | Solana 애플리케이션 구축을 위한 Metaplex 프레임워크; 지갑 연결, RPC, 트랜잭션 구축을 처리함 |
| **mplBubblegum** | 모든 Bubblegum V2 명령과 DAS API 플러그인을 등록하는 Umi 플러그인 |
| **cNFT** | 압축 NFT — 전용 계정 대신 온체인 머클 트리의 해시된 리프로 저장됨 |
| **머클 트리** | 해시된 NFT 데이터를 리프로 저장하는 온체인 계정; `createTree`로 생성됨 |
| **리프** | 머클 트리의 단일 cNFT 항목, 리프 인덱스로 식별됨 |
| **증명** | 리프가 트리에 속함을 암호학적으로 검증하는 형제 해시 목록 |
| **캐노피** | 트랜잭션에서 필요한 증명 크기를 줄이기 위해 온체인에 저장된 머클 트리 상위 노드 캐시 |
| **LeafSchemaV2** | id, 소유자, 위임자, 논스, 데이터 해시, 크리에이터 해시, 컬렉션 해시, 에셋 데이터 해시, 플래그를 포함하는 V2 리프 데이터 구조 |
| **getAssetWithProof** | 쓰기 명령에 필요한 모든 DAS API 데이터를 가져오고 파싱하는 SDK 헬퍼 |
| **DAS API** | Digital Asset Standard API — cNFT 데이터 인덱싱 및 가져오기를 위한 RPC 확장 |
| **TreeConfig** | 머클 트리 주소에서 도출되어 Bubblegum 트리 구성을 저장하는 PDA |
| **리프 위임자** | cNFT 소유자가 cNFT를 전송, 소각 또는 동결할 수 있도록 권한을 부여한 계정 |
| **트리 위임자** | 비공개 트리에서 cNFT를 민팅하기 위해 트리 생성자가 권한을 부여한 계정 |
| **소울바운드** | `setNonTransferableV2`를 통해 설정된 영구적으로 전송 불가능한 cNFT — 되돌릴 수 없음 |
