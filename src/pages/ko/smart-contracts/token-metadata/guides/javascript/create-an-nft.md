---
title: Solana에서 NFT를 만드는 방법
metaTitle: Solana에서 NFT를 만드는 방법 | Token Metadata 가이드
description: Metaplex로 Solana 블록체인에서 NFT를 만드는 방법을 배우세요.
# /components/guides/index.js의 날짜도 업데이트하는 것을 잊지 마세요
created: '06-16-2024'
updated: '06-18-2024'
---

이것은 Metaplex Token Metadata 프로토콜을 사용하여 Solana 블록체인에서 NFT를 만드는 방법에 대한 초기 가이드입니다.

## 전제조건

- 선택한 코드 에디터 (Visual Studio Code 권장)
- Node 18.x.x 이상.

## 초기 설정

이 가이드는 단일 파일 스크립트를 기반으로 한 Javascript를 사용한 NFT 생성을 다룹니다. 필요에 따라 함수를 수정하고 이동해야 할 수 있습니다.

### 초기화

선택한 패키지 매니저(npm, yarn, pnpm, bun)로 새 프로젝트를 초기화하고(선택사항) 프롬프트가 나타나면 필요한 세부 정보를 입력하여 시작하세요.

```js
npm init
```

### 필수 패키지

이 가이드에 필요한 패키지를 설치하세요.

{% packagesUsed packages=["umi", "umiDefaults" ,"tokenMetadata", "core", "@solana/spl-token"] type="npm" /%}

```js
npm i @metaplex-foundation/umi
```

```js
npm i @metaplex-foundation/umi-bundle-defaults
```

```js
npm i @metaplex-foundation/mpl-token-metadata
```

```js
npm i @metaplex-foundation/umi-uploader-irys;
```

### 임포트와 래퍼 함수

여기서 이 특정 가이드에 필요한 모든 임포트를 정의하고 모든 코드가 실행될 래퍼 함수를 만듭니다.

```ts
import { createProgrammableNft, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import {
  createGenericFile,
  generateSigner,
  percentAmount,
  signerIdentity,
  sol,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { base58 } from "@metaplex-foundation/umi/serializers";
import fs from "fs";
import path from "path";

// 래퍼 함수 생성
const createNft = async () => {
  ///
  ///
  ///  모든 코드가 여기에 들어갑니다
  ///
  ///
}

// 래퍼 함수 실행
createNft()
```

## Umi 설정

이 예제는 `generatedSigner()`로 Umi를 설정하는 과정을 다룹니다. 이 예제를 React와 함께 사용하려면 `React - Umi w/ Wallet Adapter` 가이드를 통해 Umi를 설정해야 합니다. 지갑 설정 외에 이 가이드는 파일 저장소 키와 지갑 어댑터에 대한 것입니다.

### 새 지갑 생성

```ts
const umi = createUmi("https://devnet-aura.metaplex.com/<YOUR_API_KEY>")
  .use(mplTokenMetadata())
  .use(
    irysUploader({
      // 메인넷 주소: "https://node1.irys.xyz"
      // 데브넷 주소: "https://devnet.irys.xyz"
      address: "https://devnet.irys.xyz",
    })
  );

// 새 키페어 서명자 생성.
const signer = generateSigner(umi)

// umi에게 새 서명자를 사용하도록 지시.
umi.use(signerIdentity(signer))

// 이것은 테스트를 위해 데브넷에서만 SOL을 에어드랍합니다.
await umi.rpc.airdrop(umi.identity.publickey)
```

### 기존 지갑 사용

```ts
const umi = createUmi("https://devnet-aura.metaplex.com/<YOUR_API_KEY>")
  .use(mplTokenMetadata())
  .use(
    irysUploader({
      // 메인넷 주소: "https://node1.irys.xyz"
      // 데브넷 주소: "https://devnet.irys.xyz"
      address: "https://devnet.irys.xyz",
    })
  );

// 새 키페어 서명자 생성.
const signer = generateSigner(umi)

// fs를 사용하고 파일시스템을 탐색하여
// 상대 경로를 통해 사용하고자 하는 지갑을 로드해야 합니다.
const walletFile = const imageFile = fs.readFileSync(
    path.join(__dirname, './keypair.json')
  )
```

## NFT 생성

### 이미지 업로드

가장 먼저 해야 할 일은 NFT를 나타내고 인식 가능하게 만드는 이미지를 업로드하는 것입니다. 이는 jpeg, png 또는 gif 형태일 수 있습니다.

Umi는 Arweave, NftStorage, AWS, ShdwDrive와 같은 스토리지 솔루션에 업로드할 수 있는 다운로드 가능한 스토리지 플러그인과 함께 제공됩니다. 이 가이드의 시작 부분에서 Arweave 블록체인에 콘텐츠를 저장하는 `irsyUploader()` 플러그인을 설치했으므로 그것을 계속 사용하겠습니다.

{% callout title="로컬 스크립트/Node.js" %}
이 예제는 Irys를 사용하여 Arweave에 업로드하는 로컬스크립트/node.js 접근법을 사용합니다. 다른 스토리지 공급자에 파일을 업로드하거나 브라우저에서 업로드하려면 다른 접근법을 취해야 합니다. `fs`를 임포트하고 사용하는 것은 브라우저 시나리오에서 작동하지 않습니다.
{% /callout %}

```ts
// 문자열 경로를 통해 파일을 읽기 위해 `fs`를 사용합니다.
// 컴퓨팅 관점에서 경로 지정의 개념을 이해해야 합니다.

const imageFile = fs.readFileSync(
  path.join(__dirname, '..', '/assets/my-image.jpg')
)

// `createGenericFile`을 사용하여 파일을 umi가 이해할 수 있는
// `GenericFile` 타입으로 변환합니다. mimi 태그 타입을 올바르게 설정했는지
// 확인하세요. 그렇지 않으면 Arweave가 이미지를 표시하는 방법을 알 수 없습니다.

const umiImageFile = createGenericFile(imageFile, 'my-image.jpeg', {
  tags: [{ name: 'Content-Type', value: 'image/jpeg' }],
})

// 여기서 Irys를 통해 Arweave에 이미지를 업로드하고 파일이 위치한
// uri 주소를 반환받습니다. 이것을 로그로 출력할 수 있지만
// 업로더가 파일 배열을 취할 수 있으므로 uri 배열도 반환합니다.
// 원하는 uri를 얻기 위해 배열의 인덱스 [0]을 호출할 수 있습니다.

const imageUri = await umi.uploader.upload([umiImageFile]).catch((err) => {
  throw new Error(err)
})

console.log(imageUri[0])
```

### 메타데이터 업로드

유효하고 작동하는 이미지 URI가 있으면 NFT의 메타데이터 작업을 시작할 수 있습니다.

대체 가능 토큰의 오프체인 메타데이터 표준은 다음과 같습니다:

```json
{
  "name": "My NFT",
  "description": "This is an NFT on Solana",
  "image": "https://arweave.net/my-image",
  "external_url": "https://example.com/my-nft.json",
  "attributes": [
    {
      "trait_type": "trait1",
      "value": "value1"
    },
    {
      "trait_type": "trait2",
      "value": "value2"
    }
  ],
  "properties": {
    "files": [
      {
        "uri": "https://arweave.net/my-image",
        "type": "image/png"
      }
    ],
    "category": "image"
  }
}
```

여기의 필드는 다음과 같습니다:

#### name

토큰의 이름.

#### symbol

토큰의 줄임말. Solana의 줄임말은 `SOL`입니다.

#### description

토큰의 설명.

#### image

이것은 이전에 업로드한 imageUri (또는 이미지의 온라인 위치)로 설정됩니다.

```js
// Irys를 통해 Arweave에 메타데이터를 업로드하기 위해 umi의 uploadJson 함수를 호출합니다.


const metadata = {
  "name": "My NFT",
  "description": "This is an NFT on Solana",
  "image": imageUri[0],
  "external_url": "https://example.com/my-nft.json",
  "attributes": [
    {
      "trait_type": "trait1",
      "value": "value1"
    },
    {
      "trait_type": "trait2",
      "value": "value2"
    }
  ],
  "properties": {
    "files": [
      {
        "uri": imageUri[0],
        "type": "image/png"
      }
    ],
    "category": "image"
  }
}

const metadataUri = await umi.uploader.uploadJson(metadata).catch((err) => {
  throw new Error(err)
})
```

이제 모든 것이 예상대로 진행되었다면 오류가 발생하지 않는 한 `metadataUri`에 저장된 json 파일의 URI를 가져야 합니다.

### NFT vs pNFT

Token Metadata 프로그램은 두 종류의 NFT, 즉 일반 NFT와 pNFT(프로그래머블 대체 불가능 자산)를 민팅할 수 있습니다.
여기서 두 종류의 NFT 간의 주요 차이점은 하나는 로열티가 강제되고(pNFT) 다른 하나는 그렇지 않다는 것입니다(NFT).

#### NFT

- 로열티 강제 없음
- 초기 설정과 향후 작업이 더 간단함.

#### pNFT

- 향후 개발 시 더 많은 계정을 다뤄야 함.
- 로열티 강제
- 프로그램이 전송을 차단할 수 있는 규칙 세트가 있는 프로그래머블.

### NFT 민팅

여기서 사용하고자 하는 NFT 민트 명령어 유형, `NFT` 또는 `pNFT`를 선택할 수 있습니다.

#### NFT

```ts
// NFT용 서명자를 생성합니다
const nftSigner = generateSigner(umi)

const tx = await createNft(umi, {
  mint: nftSigner,
  sellerFeeBasisPoints: percentAmount(5.5),
  name: 'My NFT',
  uri: metadataUri,
}).sendAndConfirm(umi)

// 마지막으로 체인에서 확인할 수 있는 서명을 역직렬화할 수 있습니다.
// import { base58 } from "@metaplex-foundation/umi/serializers";

console.log(base58.deserialize(tx.signature)[0])
```

#### pNFT

```ts
// NFT용 서명자를 생성합니다
const nftSigner = generateSigner(umi)

// NFT를 위한 규칙 세트를 결정합니다.
// Metaplex 규칙 세트 - publicKey("eBJLFYPxJmMGKuFwpDWkzxZeUrad92kZRC5BJLpzyT9")
// 호환성 규칙 세트 - publicKey("AdH2Utn6Fus15ZhtenW4hZBQnvtLgM1YCW2MfVp7pYS5")
const ruleset = null // 또는 위에서 publicKey를 설정

const tx = await createProgrammableNft(umi, {
  mint: nftSigner,
  sellerFeeBasisPoints: percentAmount(5.5),
  name: 'My NFT',
  uri: metadataUri,
  ruleSet: ruleset,
}).sendAndConfirm(umi)

// 마지막으로 체인에서 확인할 수 있는 서명을 역직렬화할 수 있습니다.
// import { base58 } from "@metaplex-foundation/umi/serializers";

console.log(base58.deserialize(tx.signature)[0])
```

## 전체 코드 예제

```js
import { createProgrammableNft } from '@metaplex-foundation/mpl-token-metadata'
import {
  createGenericFile,
  generateSigner,
  percentAmount,
  publicKey,
  signerIdentity,
  sol,
} from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { base58 } from '@metaplex-foundation/umi/serializers'
import fs from 'fs'
import path from 'path'

const createNft = async () => {
  //
  // ** Umi 설정 **
  //

  const umi = createUmi("https://devnet-aura.metaplex.com/<YOUR_API_KEY>")
    .use(mplTokenMetadata())
  .use(
    irysUploader({
      // 메인넷 주소: "https://node1.irys.xyz"
      // 데브넷 주소: "https://devnet.irys.xyz"
      address: "https://devnet.irys.xyz",
    })
  );

  const signer = generateSigner(umi);

  umi.use(signerIdentity(signer));

  // identity에 1 SOL 에어드랍
  // 429 요청이 너무 많다는 오류가 발생하면
  // 파일시스템 지갑 방법을 사용하거나 rpc를 변경해야 할 수 있습니다.
  console.log("Airdropping 1 SOL to identity");
  await umi.rpc.airdrop(umi.identity.publicKey, sol(1));

  //
  // ** Arweave에 이미지 업로드 **
  //

  // 문자열 경로를 통해 파일을 읽기 위해 `fs`를 사용합니다.
  // 컴퓨팅 관점에서 경로 지정의 개념을 이해해야 합니다.

  const imageFile = fs.readFileSync(
    path.join(__dirname, "../assets/images/0.png")
  );

  // `createGenericFile`을 사용하여 파일을 umi가 이해할 수 있는
  // `GenericFile` 타입으로 변환합니다. mimi 태그 타입을 올바르게 설정했는지
  // 확인하세요. 그렇지 않으면 Arweave가 이미지를 표시하는 방법을 알 수 없습니다.

  const umiImageFile = createGenericFile(imageFile, "0.png", {
    tags: [{ name: "Content-Type", value: "image/png" }],
  });

  // 여기서 Irys를 통해 Arweave에 이미지를 업로드하고 파일이 위치한
  // uri 주소를 반환받습니다. 이것을 로그로 출력할 수 있지만
  // 업로더가 파일 배열을 취할 수 있으므로 uri 배열도 반환합니다.
  // 원하는 uri를 얻기 위해 배열의 인덱스 [0]을 호출할 수 있습니다.

  console.log("Uploading image...");
  const imageUri = await umi.uploader.upload([umiImageFile]).catch((err) => {
    throw new Error(err);
  });

  //
  // ** Arweave에 메타데이터 업로드 **
  //

  const metadata = {
    name: "My Nft",
    description: "This is an Nft on Solana",
    image: imageUri[0],
    external_url: "https://example.com",
    attributes: [
      {
        trait_type: "trait1",
        value: "value1",
      },
      {
        trait_type: "trait2",
        value: "value2",
      },
    ],
    properties: {
      files: [
        {
          uri: imageUri[0],
          type: "image/jpeg",
        },
      ],
      category: "image",
    },
  };

  // Irys를 통해 Arweave에 메타데이터를 업로드하기 위해 umi의 uploadJson 함수를 호출합니다.
  console.log("Uploading metadata...");
  const metadataUri = await umi.uploader.uploadJson(metadata).catch((err) => {
    throw new Error(err);
  });

  //
  // ** NFT 생성 **
  //

  // NFT용 서명자를 생성합니다
  const nftSigner = generateSigner(umi);

  // NFT를 위한 규칙 세트를 결정합니다.
  // Metaplex 규칙 세트 - publicKey("eBJLFYPxJmMGKuFwpDWkzxZeUrad92kZRC5BJLpzyT9")
  // 호환성 규칙 세트 - publicKey("AdH2Utn6Fus15ZhtenW4hZBQnvtLgM1YCW2MfVp7pYS5")
  const ruleset = null // 또는 위에서 publicKey를 설정

  console.log("Creating Nft...");
  const tx = await createProgrammableNft(umi, {
    mint: nftSigner,
    sellerFeeBasisPoints: percentAmount(5.5),
    name: metadata.name,
    uri: metadataUri,
    ruleSet: ruleset,
  }).sendAndConfirm(umi);

  // 마지막으로 체인에서 확인할 수 있는 서명을 역직렬화할 수 있습니다.
  const signature = base58.deserialize(tx.signature)[0];

  // 서명과 트랜잭션 및 NFT 링크를 로그로 출력합니다.
  console.log("\npNFT Created")
  console.log("View Transaction on Solana Explorer");
  console.log(`https://explorer.solana.com/tx/${signature}?cluster=devnet`);
  console.log("\n");
  console.log("View NFT on Metaplex Explorer");
  console.log(`https://explorer.solana.com/address/${nftSigner.publicKey}?cluster=devnet`);
}

createNft()
```

## 다음 단계는?

이 가이드는 기본 NFT를 생성하는 데 도움이 되었습니다. 여기서부터 [Token Metadata 프로그램](/token-metadata)으로 이동하여 컬렉션 생성하기, 새 NFT를 컬렉션에 추가하기, NFT로 수행할 수 있는 다양한 다른 상호작용과 같은 것들을 확인할 수 있습니다.