---
title: 다른 SVM에서 cNFT와 상호 작용하는 방법
metaTitle: 다른 SVM에서 cNFT와 상호 작용하는 방법 | Bubblegum
description: Solana devnet 및 mainnet-beta 이외의 Solana Virtual Machine(SVM) 환경에서 Metaplex Bubblegum 프로그램을 사용하여 압축 NFT와 상호 작용하는 방법입니다.
---

## 개요

이 가이드는 Solana의 devnet 및 mainnet-beta 이외의 Solana Virtual Machine(SVM) 환경에서 JavaScript를 사용하여 압축 NFT(cNFT) 자산과 상호 작용하기 위한 특정 요구 사항을 자세히 설명합니다. cNFT 생성에 대한 보다 포괄적인 개요는 [Bubblegum으로 Solana에서 100만 개의 NFT 생성](/ko/smart-contracts/bubblegum/guides/javascript/how-to-create-1000000-nfts-on-solana) 가이드를 참조하세요.

### 필수 패키지

이 가이드는 `@metaplex-foundation/mpl-bubblegum`에 대한 특정 베타 npm 패키지를 사용합니다. 다음을 사용하여 설치하세요:

```bash
npm -i @metaplex-foundation/mpl-bubblegum@4.3.1-beta.0
```

### SVM에 연결

SVM의 엔드포인트를 사용하여 umi 인스턴스를 생성해야 합니다.

```ts
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";

const umi = createUmi('<RPC endpoint for the SVM>')
  .use(mplBubblegum())
  .use(mplTokenMetadata())
  ...
```

### 트리 생성

{% callout title="트리 비용" type="warning" %}
트리 크기와 사용 중인 특정 SVM에 따라 달라지는 실제 선불 SOL 비용이 있는 Merkle 트리를 생성합니다. Merkle 트리는 닫거나 환불할 수 없으므로 준비가 될 때까지 devnet에서만 이 예제를 시도하세요.
{% /callout %}

트리 생성은 Solana devnet/mainnet-beta에서 사용되는 것과 동일한 `createTree` 함수를 사용하여 수행할 수 있습니다. 그러나 기본 `logWrapper` 및 `compressionProgram` 값을 재정의해야 합니다. 이것은 다음과 같이 간단하게 수행할 수 있습니다:

```ts
import {
  createTree,
  MPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
  MPL_NOOP_PROGRAM_ID,
} from '@metaplex-foundation/mpl-bubblegum'
import {
  generateSigner,
  publicKey,
} from '@metaplex-foundation/umi';

// SVM에 대한 올바른 `logWrapper` 및
// `compressionProgram`을 지정하여 Merkle 트리를 생성합니다.
const merkleTree = generateSigner(umi);
const createTreeTx = await createTree(umi, {
  merkleTree,
  maxDepth: 3,
  maxBufferSize: 8,
  canopyDepth: 0,
  logWrapper: MPL_NOOP_PROGRAM_ID,
  compressionProgram: MPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
});

await createTreeTx.sendAndConfirm(umi);
```

그러나 이러한 프로그램 ID를 자동으로 확인하는 헬퍼 함수가 제공되었으며, Solana devnet/mainnet-beta 및 Bubblegum이 배포된 다른 SVM에서 작동하므로 이 방법을 권장합니다:

```ts
import {
  getCompressionPrograms,
  createTree,
} from '@metaplex-foundation/mpl-bubblegum'
import {
  generateSigner,
  publicKey,
} from '@metaplex-foundation/umi';

// `getCompressionPrograms` 헬퍼 함수를 사용하여 Merkle 트리를 생성합니다.
const merkleTree = generateSigner(umi);
const createTreeTx = await createTree(umi, {
  merkleTree,
  maxDepth: 3,
  maxBufferSize: 8,
  canopyDepth: 0,
  ...(await getCompressionPrograms(umi)),
});

await createTreeTx.sendAndConfirm(umi);
```

### cNFT 민트 및 전송

다른 SVM에서 Merkle 트리를 생성하는 것과 유사하게 `mintV1` 및 `transfer`와 같은 다른 SDK 함수도 압축 프로그램을 지정해야 합니다. 다시 `getCompressionPrograms` 헬퍼를 사용합니다.

```ts
import {
  fetchMerkleTree,
  getCurrentRoot,
  hashMetadataCreators,
  hashMetadataData,
  transfer,
  getCompressionPrograms,
  createTree,
  MetadataArgsArgs,
  mintV1,
} from '@metaplex-foundation/mpl-bubblegum'
import {
  generateSigner,
  none,
} from '@metaplex-foundation/umi';

// 민트하기 전에 리프 인덱스를 가져옵니다.
const leafIndex = Number(
  (await fetchMerkleTree(umi, merkleTree.publicKey)).tree.activeIndex
);

// 메타데이터를 정의합니다.
const metadata: MetadataArgsArgs = {
  name: 'My NFT',
  uri: 'https://example.com/my-nft.json',
  sellerFeeBasisPoints: 500, // 5%
  collection: none(),
  creators: [],
};

// cNFT를 민트합니다.
const originalOwner = generateSigner(umi);
const mintTxn = await mintV1(umi, {
  leafOwner: originalOwner.publicKey,
  merkleTree: merkleTree.publicKey,
  metadata,
  ...(await getCompressionPrograms(umi)),
}).sendAndConfirm(umi);

// cNFT를 새 소유자에게 전송합니다.
const newOwner = generateSigner(umi);
const merkleTreeAccount = await fetchMerkleTree(umi, merkleTree.publicKey);
const transferTxn = await transfer(umi, {
  leafOwner: originalOwner,
  newLeafOwner: newOwner.publicKey,
  merkleTree: merkleTree.publicKey,
  root: getCurrentRoot(merkleTreeAccount.tree),
  dataHash: hashMetadataData(metadata),
  creatorHash: hashMetadataCreators(metadata.creators),
  nonce: leafIndex,
  index: leafIndex,
  proof: [],
  ...(await getCompressionPrograms(umi)),
}).sendAndConfirm(umi);
```
