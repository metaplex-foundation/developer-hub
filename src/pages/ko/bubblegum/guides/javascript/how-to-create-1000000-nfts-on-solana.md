---
title: Solana에서 100만 개의 NFT 생성
metaTitle: Solana에서 100만 개의 NFT 생성 | Bubblegum
description: Metaplex Bubblegum 프로그램을 사용하여 Solana에서 100만 개의 cNFT 압축 NFT 컬렉션을 생성하는 방법입니다.
---

## 전제 조건

- 선택한 코드 편집기(Visual Studio Code 권장).
- Node 18.x.x 이상.
- Javascript 및 스크립트 실행에 대한 기본 지식.

## 초기 설정

이 가이드는 단일 파일 스크립트를 기반으로 Javascript를 사용하여 압축 NFT(cNFT) 자산을 생성하는 과정을 안내합니다. 필요에 따라 함수를 수정하고 이동해야 할 수 있습니다.

### 초기화

선택한 패키지 관리자(npm, yarn, pnpm, bun)로 새 프로젝트를 초기화하고(선택 사항) 프롬프트가 표시되면 필요한 세부 정보를 입력하세요.

```bash
npm init
```

### 필수 패키지

이 가이드에 필요한 패키지를 설치합니다.

{% packagesUsed packages=["umi", "umiDefaults", "bubblegum", "tokenMetadata", "@metaplex-foundation/umi-uploader-irys"] type="npm" /%}

```bash
npm i @metaplex-foundation/umi
```

```bash
npm i @metaplex-foundation/umi-bundle-defaults
```

```bash
npm i @metaplex-foundation/mpl-bubblegum
```

```bash
npm i @metaplex-foundation/mpl-token-metadata
```

```bash
npm i @metaplex-foundation/umi-uploader-irys
```

### 가져오기 및 래퍼 함수

여기서 이 특정 가이드에 필요한 모든 가져오기를 정의하고 모든 코드가 실행될 래퍼 함수를 만듭니다.

```ts
import {
  createTree,
  findLeafAssetIdPda,
  getAssetWithProof,
  mintV1,
  mplBubblegum,
  parseLeafFromMintV1Transaction,
} from '@metaplex-foundation/mpl-bubblegum'
import {
  createNft,
  mplTokenMetadata,
} from '@metaplex-foundation/mpl-token-metadata'
import {
  createGenericFile,
  generateSigner,
  percentAmount,
  publicKey,
  sol,
} from '@metaplex-foundation/umi'
import { Network, Wallet, umiInstance } from '../scripts/umi'

import fs from 'fs'
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'

// 래퍼 함수 생성
const createCnft = async () => {
  ///
  ///
  ///  모든 코드가 여기에 들어갑니다
  ///
  ///
}

// 래퍼 함수 실행
createCnft()
```

## Umi 설정

이 예제는 `generatedSigner()`로 Umi를 설정하는 과정을 안내합니다. React로 이 예제를 시도하려면 `React - Umi w/ Wallet Adapter` 가이드를 통해 Umi를 설정해야 합니다. 지갑 설정을 제외하고 이 가이드는 fileStorage 키와 지갑 어댑터를 사용합니다.

### 새 지갑 생성

```ts
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplBubblegum())
  .use(mplTokenMetadata())
  .use(
    irysUploader({
      // mainnet 주소: "https://node1.irys.xyz"
      // devnet 주소: "https://devnet.irys.xyz"
      address: 'https://devnet.irys.xyz',
    })
  )

const signer = generateSigner(umi)

umi.use(signerIdentity(signer))

// 테스트용으로 devnet에서만 SOL을 에어드롭합니다.
console.log('Airdropping 1 SOL to identity')
await umi.rpc.airdrop(umi.identity.publickey, sol(5))
```

### 로컬에서 기존 지갑 사용

```ts
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplBubblegum())
  .use(mplTokenMetadata())
  .use(
    irysUploader({
      // mainnet 주소: "https://node1.irys.xyz"
      // devnet 주소: "https://devnet.irys.xyz"
      address: 'https://devnet.irys.xyz',
    })
  )

// 새 키페어 서명자를 생성합니다.
const signer = generateSigner(umi)

// 상대 경로를 통해 사용하려는 지갑을 로드하려면
// fs를 사용하고 파일 시스템을 탐색해야 합니다.
const walletFile = fs.readFileSync('./keypair.json')

// walletFile을 키페어로 변환합니다.
let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(walletFile))

// 키페어를 umi에 로드합니다.
umi.use(keypairIdentity(keypair))
```

## cNFT 생성

Solana에서 cNFT를 생성하는 것은 상당히 간단하며 실제로 민트 및 읽기 작업을 수행하기 전에 준비해야 할 몇 가지 항목이 필요합니다.

- cNFT 데이터를 저장할 Merkle 트리.
- 생성 중에 데이터를 저장하는 인덱서에서 데이터를 읽을 수 있는 DAS 지원 RPC.

#### Merkle 트리

Merkle 트리는 대부분 cNFT 데이터의 "데이터베이스"로 생각할 수 있습니다. Merkle 트리가 생성되고 cNFT가 가득 찰 때까지 추가될 수 있습니다.

#### DAS RPC

Merkle 트리의 특성상 cNFT 데이터는 Solana 계정에 저장되지 않고 대신 원장 상태에 저장됩니다. 데이터를 효과적으로 읽으려면 cNFT 데이터가 생성/변경될 때 인덱싱하는 인덱서를 사용해야 합니다. DAS 지원 RPC는 DAS 인덱서 서비스를 실행하는 RPC로, 필요에 따라 이 데이터를 RPC 제공자에게 쿼리할 수 있습니다.

DAS를 지원하는 전체 RPC 제공자 목록은 [RPC 제공자 페이지](/rpc-providers#rp-cs-with-das-support)를 방문하세요.

이러한 제공자 중 하나에서 이 가이드를 실행하기 위한 무료 계정을 얻을 수 있습니다. 가입한 후에는 이전 `umi` 생성 중에 RPC 인스턴스를 교체해야 합니다.

```ts
// 아래 위치한 주소를 교체합니다.
const umi = createUmi('https://rpcAddress.com')
```

### 트리 생성

{% callout title="트리 비용" type="warning" %}
이 가이드에서는 약 7.7 SOL의 비용이 필요한 100만 개의 cNFT를 보유하는 Merkle 트리를 생성합니다. Merkle 트리는 닫거나 환불할 수 없으므로 준비가 될 때까지 devnet에서만 이 예제를 시도하세요. 이 코드를 실행하려면 최소 7.7 devnet SOL이 필요합니다. 여러 번의 에어드롭이 필요할 수 있습니다.
{% /callout %}

Solana 블록체인에 압축 NFT(cNFT)를 저장하려면 데이터를 저장할 **Merkle 트리**를 생성해야 합니다. merkle 트리의 크기와 비용은 merkle 트리 생성자가 결정하며 모든 cNFT 저장소는 미리 지불됩니다. 이는 일반적으로 지불자가 NFT 자체를 민트할 때 Solana 블록체인의 필요한 저장 공간 및 계정 생성 비용을 지불하는 Token Metadata의 **지연 민팅** 접근 방식과 다릅니다. bubblegum을 사용하면 필요한 모든 데이터 공간이 트리 생성 시 트리 생성자가 결정하고 지불합니다.

Token Metadata와 비교하여 **merkle 트리**에 대한 몇 가지 고유한 기능이 있습니다:

- Merkle 트리 내의 여러 컬렉션에 cNFT를 민트할 수 있습니다.

Merkle 트리는 컬렉션이 **아닙니다**!

Merkle 트리는 많은 컬렉션의 cNFT를 수용할 수 있어 향후 확장 성장이 예상되는 프로젝트에 매우 강력합니다. Merkle 트리가 100만 개의 cNFT를 보유하고 있고 해당 Merkle 트리에 1만 개의 프로젝트를 출시하고 민트하기로 결정한 경우, 향후 추가 cNFT를 출시할 수 있는 99만 개의 공간이 트리에 남아 있습니다.

```ts
//
// ** Merkle 트리 생성 **
//

const merkleTree = generateSigner(umi)

console.log(
  'Merkle Tree Public Key:',
  merkleTree.publicKey,
  '\nStore this address as you will need it later.'
)

//   다음 매개변수로 트리를 생성합니다.
//   이 트리는 최대 100만 개의 리프/nft 용량으로
//   약 7.7 SOL이 필요합니다. 이 스크립트를 실행하기 전에
//   umi identity 계정에 일부 SOL을 에어드롭해야 할 수 있습니다.

const createTreeTx = await createTree(umi, {
  merkleTree,
  maxDepth: 20,
  maxBufferSize: 64,
  canopyDepth: 14,
})

await createTreeTx.sendAndConfirm(umi)
```

### 컬렉션 NFT 생성

cNFT용 컬렉션은 여전히 Token Metadata 및 Token Metadata에서 민트된 원본 컬렉션 NFT에 의해 유지 및 관리됩니다. cNFT용 컬렉션을 생성하고 여기에 민트하려면 Token Metadata 컬렉션 NFT를 생성해야 합니다.

```ts
//
// ** Token Metadata 컬렉션 NFT 생성 **
//

//
// NFT를 컬렉션에 민트하려면 먼저 컬렉션 NFT를 생성해야 합니다.
// 이 단계는 선택 사항이며 NFT를 컬렉션에 민트하지 않거나
// 이전에 컬렉션 NFT를 생성한 경우 건너뛸 수 있습니다.
//

const collectionSigner = generateSigner(umi)

// 이미지 파일 경로
const collectionImageFile = fs.readFileSync('./collection.png')

const genericCollectionImageFile = createGenericFile(
  collectionImageFile,
  'collection.png'
)

const collectionImageUri = await umi.uploader.upload([
  genericCollectionImageFile,
])

const collectionMetadata = {
  name: 'My cNFT Collection',
  image: collectionImageUri[0],
  externalUrl: 'https://www.example.com',
  properties: {
    files: [
      {
        uri: collectionImageUri[0],
        type: 'image/png',
      },
    ],
  },
}

const collectionMetadataUri = await umi.uploader.uploadJson(collectionMetadata)

await createNft(umi, {
  mint: collectionSigner.publicKey,
  name: 'My cNFT Collection',
  uri: 'https://www.example.com/collection.json',
  isCollection: true,
  sellerFeeBasisPoints: percentAmount(0),
}).sendAndConfirm(umi)
```

### cNFT용 이미지 및 메타데이터 업로드(선택 사항)

cNFT에는 데이터와 이미지가 필요합니다. 이 코드 블록은 이미지를 업로드한 다음 해당 이미지를 `metadata` 객체에 추가하고 최종적으로 해당 객체를 json 파일로 Arweave에 Irys를 통해 업로드하여 cNFT와 함께 사용하는 방법을 보여줍니다.

```ts
//
//   ** NFT에 사용되는 이미지 및 메타데이터 업로드(선택 사항) **
//

//   이미지 및 메타데이터 파일이 이미 업로드된 경우 이 단계를 건너뛰고
//   mintV1 호출에서 업로드된 파일의 uri를 사용할 수 있습니다.

//   이미지 파일 경로
const nftImageFile = fs.readFileSync('./nft.png')

const genericNftImageFile = createGenericFile(nftImageFile, 'nft.png')

const nftImageUri = await umi.uploader.upload([genericNftImageFile])

const nftMetadata = {
  name: 'My cNFT',
  image: nftImageUri[0],
  externalUrl: 'https://www.example.com',
  attributes: [
    {
      trait_type: 'trait1',
      value: 'value1',
    },
    {
      trait_type: 'trait2',
      value: 'value2',
    },
  ],
  properties: {
    files: [
      {
        uri: nftImageUri[0],
        type: 'image/png',
      },
    ],
  },
}

const nftMetadataUri = await umi.uploader.uploadJson(nftMetadata)
```

### Merkle 트리에 cNFT 민트

트리가 이미 모든 cNFT 데이터를 저장할 수 있는 충분한 공간으로 생성되었기 때문에(실제로 100만 개의 cNFT) 트리에 cNFT를 민트하는 데는 Solana 블록체인에서 추가 계정/저장 비용이 들지 않습니다. 여기서 추가 비용은 기본 Solana 트랜잭션 수수료일 뿐이며 cNFT를 대량으로 민트하는 데 매우 효율적입니다.

```ts
//
// ** Merkle 트리에 압축 NFT 민트 **
//

//
// NFT를 컬렉션에 민트하지 않으려면 collection
// 필드를 `none()`으로 설정할 수 있습니다.
//

// 민트되는 cNFT의 소유자입니다.
const newOwner = publicKey('111111111111111111111111111111')

console.log('Minting Compressed NFT to Merkle Tree...')

const { signature } = await mintToCollectionV1(umi, {
  leafOwner: newOwner,
  merkleTree: merkleTree.publicKey,
  collectionMint: collectionSigner.publicKey,
  metadata: {
    name: 'My cNFT',
    uri: nftMetadataUri, // `nftMetadataUri` 또는 이전에 업로드된 uri를 사용합니다.
    sellerFeeBasisPoints: 500, // 5%
    collection: { key: collectionSigner.publicKey, verified: false },
    creators: [
      {
        address: umi.identity.publicKey,
        verified: true,
        share: 100,
      },
    ],
  },
}).sendAndConfirm(umi, { send: { commitment: 'finalized' } })
```

### 새로 민트된 cNFT 가져오기

```ts
//
// ** 자산 가져오기 **
//

//
// 여기서는 민트 트랜잭션의 리프 인덱스를 사용하여 압축 NFT의 자산 ID를 찾은 다음
// 자산 정보를 기록합니다.
//

console.log('Finding Asset ID...')
const leaf = await parseLeafFromMintV1Transaction(umi, signature)
const assetId = findLeafAssetIdPda(umi, {
  merkleTree: merkleTree.publicKey,
  leafIndex: leaf.nonce,
})

console.log('Compressed NFT Asset ID:', assetId.toString())

// DAS가 있는 umi rpc를 사용하여 자산을 가져옵니다.
const asset = await umi.rpc.getAsset(assetId[0])

console.log({ asset })
```

### 100만 개의 cNFT 민트

이제 100만 개의 cNFT를 보유하는 Merkle 트리를 만드는 방법과 해당 트리에 NFT를 민트하는 방법을 이해했으므로 이전의 모든 단계를 수행하고 코드를 조정하여 필요한 데이터를 Arweave에 업로드한 다음 cNFT를 트리에 민트하는 루프를 만들 수 있습니다.

Merkle 트리에 100만 개의 cNFT를 위한 공간이 있으므로 프로젝트 요구 사항에 맞게 자유롭게 루프를 실행하고 트리를 채울 수 있습니다.

다음은 루프 인덱스를 기반으로 cNFT에 저장된 데이터를 증가시키는 주소 배열에 cNFT를 민트하는 예제입니다. 이것은 간단한 예제/개념이며 프로덕션 사용을 위해 수정해야 합니다.

```ts
  const addresses = [
    "11111111111111111111111111111111",
    "22222222222222222222222222222222",
    "33333333333333333333333333333333",
    ...
  ];

  let index = 0;

  for await (const address in addresses) {
    const newOwner = publicKey(address);

    console.log("Minting Compressed NFT to Merkle Tree...");

    const { signature } = await mintV1(umi, {
      leafOwner: newOwner,
      merkleTree: merkleTree.publicKey,
      metadata: {
        name: `My Compressed NFT #${index}`,
        uri: `https://example.com/${index}.json`, //metadataUri 또는 업로드된 메타데이터 파일의 uri를 사용합니다
        sellerFeeBasisPoints: 500, // 5%
        collection: { key: collectionSigner.publicKey, verified: false },
        creators: [
          { address: umi.identity.publicKey, verified: true, share: 100 },
        ],
      },
    }).sendAndConfirm(umi, { send: { commitment: "finalized" } });

    index++;
  }
```

## 전체 코드 예제

```ts
import {
  createTree,
  findLeafAssetIdPda,
  mintToCollectionV1,
  mplBubblegum,
  parseLeafFromMintV1Transaction
} from '@metaplex-foundation/mpl-bubblegum'
import {
  createNft,
  mplTokenMetadata,
} from '@metaplex-foundation/mpl-token-metadata'
import {
  createGenericFile,
  generateSigner,
  keypairIdentity,
  percentAmount,
  publicKey
} from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'
import fs from 'fs'

// 래퍼 함수 생성
const createCnft = async () => {
  //
  // ** Umi 설정 **
  //

  // 이 인스턴스에서는 로컬에 저장된 지갑을 사용합니다. 필요한 경우
  // '새 지갑 생성' 코드로 교체할 수 있지만
  // 새 지갑에 최소 7.7 SOL을 에어드롭/전송해야 합니다.

  const umi = createUmi('https://api.devnet.solana.com')
    .use(mplBubblegum())
    .use(mplTokenMetadata())
    .use(
      irysUploader({
        // mainnet 주소: "https://node1.irys.xyz"
        // devnet 주소: "https://devnet.irys.xyz"
        address: 'https://devnet.irys.xyz',
      })
    )

  // 새 키페어 서명자를 생성합니다.
  const signer = generateSigner(umi)

  // 상대 경로를 통해 사용하려는 지갑을 로드하려면
  // fs를 사용하고 파일 시스템을 탐색해야 합니다.
  const walletFile = fs.readFileSync('./keypair.json')

  // walletFile을 키페어로 변환합니다.
  let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(walletFile))

  // 키페어를 umi에 로드합니다.
  umi.use(keypairIdentity(keypair))

  //
  // ** Merkle 트리 생성 **
  //

  const merkleTree = generateSigner(umi)

  console.log(
    'Merkle Tree Public Key:',
    merkleTree.publicKey,
    '\nStore this address as you will need it later.'
  )

  //   다음 매개변수로 트리를 생성합니다.
  //   이 트리는 최대 100만 개의 리프/nft 용량으로
  //   약 7.7 SOL이 필요합니다. 이 스크립트를 실행하기 전에
  //   umi identity 계정에 일부 SOL을 에어드롭해야 할 수 있습니다.

  console.log('Creating Merkle Tree...')
  const createTreeTx = await createTree(umi, {
    merkleTree,
    maxDepth: 20,
    maxBufferSize: 64,
    canopyDepth: 14,
  })

  await createTreeTx.sendAndConfirm(umi)

  //
  // ** Token Metadata 컬렉션 NFT 생성(선택 사항) **
  //

  //
  // NFT를 컬렉션에 민트하려면 먼저 컬렉션 NFT를 생성해야 합니다.
  // 이 단계는 선택 사항이며 NFT를 컬렉션에 민트하지 않거나
  // 이전에 컬렉션 NFT를 생성한 경우 건너뛸 수 있습니다.
  //

  const collectionSigner = generateSigner(umi)

  // 이미지 파일 경로
  const collectionImageFile = fs.readFileSync('./collection.png')

  const genericCollectionImageFile = createGenericFile(
    collectionImageFile,
    'collection.png'
  )

  const collectionImageUri = await umi.uploader.upload([
    genericCollectionImageFile,
  ])

  const collectionMetadata = {
    name: 'My cNFT Collection',
    image: collectionImageUri[0],
    externalUrl: 'https://www.example.com',
    properties: {
      files: [
        {
          uri: collectionImageUri[0],
          type: 'image/png',
        },
      ],
    },
  }

  console.log('Uploading Collection Metadata...')
  const collectionMetadataUri = await umi.uploader.uploadJson(
    collectionMetadata
  )

  console.log('Creating Collection NFT...')
  await createNft(umi, {
    mint: collectionSigner,
    name: 'My cNFT Collection',
    uri: 'https://www.example.com/collection.json',
    isCollection: true,
    sellerFeeBasisPoints: percentAmount(0),
  }).sendAndConfirm(umi)

  //
  //   ** NFT에 사용되는 이미지 및 메타데이터 업로드(선택 사항) **
  //

  //   이미지 및 메타데이터 파일이 이미 업로드된 경우 이 단계를 건너뛰고
  //   mintV1 호출에서 업로드된 파일의 uri를 사용할 수 있습니다.

  //   이미지 파일 경로
  const nftImageFile = fs.readFileSync('./nft.png')

  const genericNftImageFile = createGenericFile(nftImageFile, 'nft.png')

  const nftImageUri = await umi.uploader.upload([genericNftImageFile])

  const nftMetadata = {
    name: 'My cNFT',
    image: nftImageUri[0],
    externalUrl: 'https://www.example.com',
    attributes: [
      {
        trait_type: 'trait1',
        value: 'value1',
      },
      {
        trait_type: 'trait2',
        value: 'value2',
      },
    ],
    properties: {
      files: [
        {
          uri: nftImageUri[0],
          type: 'image/png',
        },
      ],
    },
  }

  console.log('Uploading cNFT metadata...')
  const nftMetadataUri = await umi.uploader.uploadJson(nftMetadata)

  //
  // ** Merkle 트리에 압축 NFT 민트 **
  //

  //
  // NFT를 컬렉션에 민트하지 않으려면 collection
  // 필드를 `none()`으로 설정할 수 있습니다.
  //

  // 민트되는 cNFT의 소유자입니다.
  const newOwner = publicKey('111111111111111111111111111111')

  console.log('Minting Compressed NFT to Merkle Tree...')

const { signature } = await mintToCollectionV1(umi, {
  leafOwner: newOwner,
  merkleTree: merkleTree.publicKey,
  collectionMint: collectionSigner.publicKey,
  metadata: {
    name: 'My cNFT',
    uri: nftMetadataUri, // `nftMetadataUri` 또는 이전에 업로드된 uri를 사용합니다.
    sellerFeeBasisPoints: 500, // 5%
    collection: { key: collectionSigner.publicKey, verified: false },
    creators: [
      {
        address: umi.identity.publicKey,
        verified: true,
        share: 100,
      },
    ],
  },
}).sendAndConfirm(umi, { send: { commitment: 'finalized' } })

  //
  // ** 자산 가져오기 **
  //

  //
  // 여기서는 민트 트랜잭션의 리프 인덱스를 사용하여 압축 NFT의 자산 ID를 찾은 다음
  // 자산 정보를 기록합니다.
  //

  console.log('Finding Asset ID...')
  const leaf = await parseLeafFromMintV1Transaction(umi, signature)
  const assetId = findLeafAssetIdPda(umi, {
    merkleTree: merkleTree.publicKey,
    leafIndex: leaf.nonce,
  })

  console.log('Compressed NFT Asset ID:', assetId.toString())

  // DAS가 있는 umi rpc를 사용하여 자산을 가져옵니다.
  const asset = await umi.rpc.getAsset(assetId[0])

  console.log({ asset })
};

// 래퍼 함수 실행
createCnft();
```
