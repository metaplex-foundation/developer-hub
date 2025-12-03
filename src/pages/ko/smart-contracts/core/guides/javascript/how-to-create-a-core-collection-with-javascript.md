---
title: JavaScript로 Core 컬렉션 생성하는 방법
metaTitle: JavaScript로 Core 컬렉션 생성하는 방법 | Core 가이드
description: Metaplex Core JavaScript 패키지로 Solana에서 Core 컬렉션을 생성하는 방법을 학습합니다.
# remember to update dates also in /components/guides/index.js
created: '08-21-2024'
updated: '08-21-2024'
---

이 가이드는 Metaplex Core 온체인 프로그램을 사용하여 **Core 컬렉션**을 생성하기 위한 `@metaplex-foundation/mpl-core` JavaScript SDK 패키지의 사용법을 보여줍니다.

{% callout title="Core란 무엇인가?" %}

**Core**는 단일 계정 디자인을 사용하여 민팅 비용을 줄이고 대안에 비해 Solana 네트워크 부하를 개선합니다. 또한 개발자가 자산의 동작과 기능을 수정할 수 있게 해주는 유연한 플러그인 시스템을 가지고 있습니다.

{% /callout %}

하지만 시작하기 전에 컬렉션에 대해 이야기해보겠습니다:

{% callout title="컬렉션이란 무엇인가?" %}

컬렉션은 함께 속하고, 같은 시리즈나 그룹의 일부인 자산들의 그룹입니다. 자산들을 그룹화하려면 먼저 컬렉션 이름과 컬렉션 이미지와 같은 해당 컬렉션과 관련된 메타데이터를 저장하는 목적의 컬렉션 자산을 생성해야 합니다. 컬렉션 자산은 컬렉션의 앞표지 역할을 하며 컬렉션 전체 플러그인도 저장할 수 있습니다.

{% /callout %}

## 전제 조건

- 선택한 코드 에디터 (**Visual Studio Code** 권장)
- Node **18.x.x** 이상.

## 초기 설정

이 가이드는 단일 파일 스크립트를 기반으로 JavaScript를 사용하여 Core 컬렉션을 생성하는 방법을 가르쳐 줍니다. 필요에 맞게 함수를 수정하고 이동해야 할 수도 있습니다.

### 프로젝트 초기화

선택한 패키지 매니저(npm, yarn, pnpm, bun)로 새 프로젝트를 초기화하는 것부터 시작하고(선택사항) 프롬프트가 나타날 때 필요한 세부사항을 입력합니다.

```js
npm init
```

### 필요한 패키지

이 가이드에 필요한 패키지를 설치합니다.

{% packagesUsed packages=["umi", "umiDefaults", "core", "@metaplex-foundation/umi-uploader-irys"] type="npm" /%}

```js
npm i @metaplex-foundation/umi
```

```js
npm i @metaplex-foundation/umi-bundle-defaults
```

```js
npm i @metaplex-foundation/mpl-core
```

```js
npm i @metaplex-foundation/umi-uploader-irys;
```

### 임포트 및 래퍼 함수

여기서는 이 특정 가이드에 필요한 모든 임포트를 정의하고 모든 코드가 실행될 래퍼 함수를 생성합니다.

```ts
import {
  createCollection,
  mplCore
} from '@metaplex-foundation/mpl-core'
import {
  createGenericFile,
  generateSigner,
  signerIdentity,
  sol,
} from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'
import { base58 } from '@metaplex-foundation/umi/serializers'
import fs from 'fs'
import path from 'path'

// 래퍼 함수 생성
const createCollection = async () => {
  ///
  ///
  ///  모든 코드가 여기에 들어갑니다
  ///
  ///
}

// 래퍼 함수 실행
createCollection()
```

## Umi 설정

Umi를 설정할 때 다양한 소스에서 키페어/지갑을 사용하거나 생성할 수 있습니다. 테스트용 새 지갑을 생성하거나, 파일시스템에서 기존 지갑을 가져오거나, 웹사이트/dApp을 만드는 경우 `walletAdapter`를 사용할 수 있습니다.

**참고**: 이 예제에서는 `generatedSigner()`로 Umi를 설정하지만 아래에서 모든 가능한 설정을 찾을 수 있습니다!

{% totem %}

{% totem-accordion title="새 지갑으로" %}

```ts
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplCore())
  .use(
    irysUploader({
      // mainnet address: "https://node1.irys.xyz"
      // devnet address: "https://devnet.irys.xyz"
      address: 'https://devnet.irys.xyz',
    })
  )

const signer = generateSigner(umi)

umi.use(signerIdentity(signer))

// 이것은 테스트용으로만 devnet에서 SOL을 에어드롭합니다.
console.log('Airdropping 1 SOL to identity')
await umi.rpc.airdrop(umi.identity.publickey)
```

{% /totem-accordion %}

{% totem-accordion title="기존 지갑으로" %}

```ts
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplCore())
    .use(
    irysUploader({
      // mainnet address: "https://node1.irys.xyz"
      // devnet address: "https://devnet.irys.xyz"
      address: 'https://devnet.irys.xyz',
    })
  )

// 새 키페어 서명자 생성.
const signer = generateSigner(umi)

// fs를 사용하고 파일시스템을 탐색하여
// 상대 경로를 통해 사용할 지갑을 로드해야 합니다.
const walletFile = fs.readFileSync('./keypair.json')


// walletFile을 키페어로 변환.
let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(walletFile));

// 키페어를 umi에 로드.
umi.use(keypairIdentity(umiSigner));
```

{% /totem-accordion %}

{% totem-accordion title="Wallet Adapter로" %}

```ts
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters'
import { useWallet } from '@solana/wallet-adapter-react'

const wallet = useWallet()

const umi = createUmi('https://api.devnet.solana.com')
.use(mplCore())
// Wallet Adapter를 Umi에 등록
.use(walletAdapterIdentity(wallet))
```

{% /totem-accordion %}

{% /totem %}

**참고**: `walletAdapter` 섹션은 이미 `walletAdapter`를 설치하고 설정했다고 가정하고 Umi에 연결하는 데 필요한 코드만 제공합니다. 포괄적인 가이드는 [이것](https://github.com/anza-xyz/wallet-adapter/blob/master/APP.md)을 참조하세요.

## 컬렉션 메타데이터 생성

지갑이나 Explorer에서 컬렉션의 인식 가능한 이미지를 표시하려면 메타데이터를 저장할 수 있는 URI를 생성해야 합니다!

### 이미지 업로드

Umi는 `Arweave`, `NftStorage`, `AWS`, `ShdwDrive`와 같은 저장소 솔루션에 업로드할 수 있는 다운로드 가능한 저장소 플러그인과 함께 제공됩니다. 이 가이드에서는 Arweave에 콘텐츠를 저장하는 `irysUploader()` 플러그인을 사용할 것입니다.

이 예제에서는 Irys를 사용하여 Arweave에 업로드하는 로컬 접근 방식을 사용할 것입니다. 다른 저장소 제공업체에 파일을 업로드하거나 브라우저에서 업로드하려면 다른 접근 방식을 취해야 합니다. `fs`를 가져와서 사용하는 것은 브라우저 시나리오에서는 작동하지 않습니다.

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'
import fs from 'fs'
import path from 'path'

// Umi를 생성하고 Irys를 사용하도록 지시
const umi = createUmi('https://api.devnet.solana.com')
  .use(irysUploader())

// `fs`를 사용하여 문자열 경로를 통해 파일을 읽습니다.
// 컴퓨팅 관점에서 경로 개념을 이해해야 합니다.
const imageFile = fs.readFileSync(
  path.join(__dirname, '..', '/assets/my-image.jpg')
)

// `createGenericFile`을 사용하여 파일을 umi가 이해할 수 있는
// `GenericFile` 타입으로 변환합니다. 올바른 미미 태그 타입을 설정해야
// 하며 그렇지 않으면 Arweave가 이미지를 표시하는 방법을 알 수 없습니다.
const umiImageFile = createGenericFile(imageFile, 'my-image.jpeg', {
  tags: [{ name: 'Content-Type', value: 'image/jpeg' }],
})

// 여기서 Irys를 통해 이미지를 Arweave에 업로드하고 파일이
// 위치한 uri 주소를 반환받습니다. 이것을 로그아웃할 수 있지만
// 업로더가 파일 배열을 받을 수 있으므로 uri 배열도 반환합니다.
// 원하는 uri를 얻으려면 배열에서 인덱스 [0]을 호출할 수 있습니다.
const imageUri = await umi.uploader.upload([umiImageFile]).catch((err) => {
  throw new Error(err)
})

console.log(imageUri[0])
```

### 메타데이터 업로드

유효하고 작동하는 이미지 URI가 있으면 컬렉션의 메타데이터 작업을 시작할 수 있습니다.

대체 가능한 토큰의 오프체인 메타데이터 표준은 다음과 같습니다. 이것을 채우고 JavaScript 없이 객체 `{}`에 쓰거나 `metadata.json` 파일에 저장해야 합니다.
JavaScript 객체 접근 방식을 살펴보겠습니다.

```ts
const metadata = {
  name: 'My Collection',
  description: 'This is a Collection on Solana',
  image: imageUri[0],
  external_url: 'https://example.com',
  properties: {
    files: [
      {
        uri: imageUri[0],
        type: 'image/jpeg',
      },
    ],
    category: 'image',
  },
}
```

여기의 필드들은 다음을 포함합니다:

| 필드          | 설명                                                                                                                                                                                      |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name          | 컬렉션의 이름.                                                                                                                                                                              |
| description   | 컬렉션의 설명.                                                                                                                                                                               |
| image         | 이전에 업로드한 `imageUri`(또는 이미지의 온라인 위치)로 설정됩니다.                                                                                                                           |
| animation_url | 업로드한 `animation_ulr`(또는 비디오/glb의 온라인 위치)로 설정됩니다.                                                                                                                        |
| external_url  | 선택한 외부 주소에 링크됩니다. 일반적으로 프로젝트 웹사이트입니다.                                                                                                                           |
| image         | 이전에 업로드한 `imageUri`(또는 이미지의 온라인 위치)로 설정됩니다.                                                                                                                           |
| properties    | `{uri: string, type: mimeType}`의 `[] 배열`을 받는 `files` 필드를 포함합니다. 또한 `image`, `audio`, `video`, `vfx`, `html`로 설정할 수 있는 category 필드도 포함합니다.                   |

메타데이터를 생성한 후 컬렉션에 첨부할 URI를 얻기 위해 JSON 파일로 업로드해야 합니다. 이를 위해 Umi의 `uploadJson()` 함수를 사용합니다:

```js
// Umi의 `uploadJson()` 함수를 호출하여 Irys를 통해 메타데이터를 Arweave에 업로드합니다.
const metadataUri = await umi.uploader.uploadJson(metadata).catch((err) => {
  throw new Error(err)
})
```

이 함수는 업로드하기 전에 JavaScript 객체를 JSON으로 자동 변환합니다.

이제 오류가 발생하지 않았다면 마침내 `metadataUri`에 저장된 JSON 파일의 URI를 가져야 합니다.

### Core 컬렉션 민팅

여기서부터 `@metaplex-foundation/mpl-core` 패키지의 `createCollection` 함수를 사용하여 Core NFT 자산을 생성할 수 있습니다.

```ts
const collection = generateSigner(umi)

const tx = await createCollection(umi, {
  collection,
  name: 'My Collection',
  uri: metadataUri,
}).sendAndConfirm(umi)

const signature = base58.deserialize(tx.signature)[0]
```

그리고 다음과 같이 세부사항을 로그아웃합니다:

```ts
// 서명과 트랜잭션 및 NFT 링크를 로그아웃합니다.
console.log('\nCollection Created')
console.log('View Transaction on Solana Explorer')
console.log(`https://explorer.solana.com/tx/${signature}?cluster=devnet`)
console.log('\n')
console.log('View Collection on Metaplex Explorer')
console.log(`https://core.metaplex.com/explorer/${collection.publicKey}?env=devnet`)
```

### 추가 작업

계속하기 전에, `FreezeDelegate` 플러그인이나 `AppData` 외부 플러그인과 같은 플러그인 및/또는 외부 플러그인이 이미 포함된 컬렉션을 생성하려면 어떻게 해야 할까요? 다음과 같이 할 수 있습니다.

`createCollection()` 인스트럭션은 `plugins` 필드를 통해 일반 및 외부 플러그인 추가를 지원합니다. 따라서 특정 플러그인에 필요한 모든 필드를 쉽게 추가할 수 있으며 모든 것이 인스트럭션에 의해 처리됩니다.

다음은 수행 방법의 예입니다:

```typescript
const collection = generateSigner(umi)

const tx = await createCollection(umi, {
  collection: collection,
  name: 'My Collection',
  uri: 'https://example.com/my-collection.json',
  plugins: [
    {
      type: "PermanentFreezeDelegate",
      frozen: true,
      authority: { type: "UpdateAuthority"}
    },
    {
      type: "AppData",
      dataAuthority: { type: "UpdateAuthority"},
      schema: ExternalPluginAdapterSchema.Binary,
    }
  ]
}).sendAndConfirm(umi)

const signature = base58.deserialize(tx.signature)[0]
```

**참고**: 사용할 필드와 플러그인이 확실하지 않다면 [문서](/core/plugins)를 참조하세요!

## 전체 코드 예제

```ts
import {
  createCollection,
  mplCore,
} from '@metaplex-foundation/mpl-core'
import {
  createGenericFile,
  generateSigner,
  signerIdentity,
  sol,
} from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { base58 } from '@metaplex-foundation/umi/serializers'
import fs from 'fs'
import path from 'path'

const createCollection = async () => {
  //
  // ** Umi 설정 **
  //

  const umi = createUmi('https://api.devnet.solana.com')
    .use(mplCore())
    .use(irysUploader({address: 'https://devnet.irys.xyz'}))

  const signer = generateSigner(umi)

  umi.use(signerIdentity(signer))


  console.log('Airdropping 1 SOL to identity')
  await umi.rpc.airdrop(umi.identity.publicKey, sol(1))

  //
  // ** Arweave에 이미지 업로드 **
  //

  const imageFile = fs.readFileSync(
    path.join(__dirname, '..', '/assets/my-image.jpg')
  )

  const umiImageFile = createGenericFile(imageFile, 'my-image.jpeg', {
    tags: [{ name: 'Content-Type', value: 'image/jpeg' }],
  })

  const imageUri = await umi.uploader.upload([umiImageFile]).catch((err) => {
    throw new Error(err)
  })

  console.log('imageUri: ' + imageUri[0])

  //
  // ** Arweave에 메타데이터 업로드 **
  //

  const metadata = {
    name: 'My Collection',
    description: 'This is a Collection on Solana',
    image: imageUri[0],
    external_url: 'https://example.com',
    properties: {
      files: [
        {
          uri: imageUri[0],
          type: 'image/jpeg',
        },
      ],
      category: 'image',
    },
  }

  console.log('Uploading Metadata...')
  const metadataUri = await umi.uploader.uploadJson(metadata).catch((err) => {
    throw new Error(err)
  })

  //
  // ** 컬렉션 생성 **
  //

  const collection = generateSigner(umi)

  console.log('Creating Collection...')
  const tx = await createCollection(umi, {
    collection,
    name: 'My Collection',
    uri: metadataUri,
  }).sendAndConfirm(umi)

  const signature = base58.deserialize(tx.signature)[0]

  console.log('\Collection Created')
  console.log('View Transaction on Solana Explorer')
  console.log(`https://explorer.solana.com/tx/${signature}?cluster=devnet`)
  console.log('\n')
  console.log('View NFT on Metaplex Explorer')
  console.log(`https://core.metaplex.com/explorer/${nftSigner.publicKey}?env=devnet`)
}

createCollection()
```