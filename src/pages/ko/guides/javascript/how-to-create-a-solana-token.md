---
title: Solana 토큰을 생성하는 방법
metaTitle: Solana 토큰을 생성하는 방법 | 가이드
description: Metaplex 패키지를 사용하여 Solana 블록체인에서 SPL 토큰/밈 코인을 생성하는 방법을 알아보세요.
# remember to update dates also in /components/guides/index.js
created: '04-19-2024'
updated: '04-19-2025'
---

이 단계별 가이드는 Solana 블록체인에서 Solana 토큰(SPL 토큰)을 생성하는 데 도움을 줄 것입니다. Metaplex Umi 클라이언트 래퍼와 Mpl Toolbox 패키지를 Javascript와 함께 사용할 수 있습니다. 이를 통해 스크립트뿐만 아니라 프론트엔드 및 백엔드 프레임워크에서도 사용할 수 있는 함수를 생성할 수 있습니다.

## 전제조건

- 선택한 코드 에디터 (Visual Studio Code 권장)
- Node 18.x.x 이상.

## 초기 설정

npm, yarn, pnpm, bun과 같은 패키지 매니저를 사용하여 새 프로젝트를 생성(선택사항)하는 것부터 시작하세요. 질문을 받으면 필요한 정보를 입력하세요.

```js
npm init
```

### 필수 패키지

이 가이드에 필요한 패키지를 설치하세요.

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
npm i @metaplex-foundation/umi-uploader-irys
```

```js
npm i @metaplex-foundation/mpl-toolbox
```

### 임포트 및 래퍼 함수

이 가이드에서는 모든 필요한 임포트를 나열하고 코드가 실행될 래퍼 함수를 생성할 것입니다.

```ts
import {
  createFungible,
  mplTokenMetadata,
} from '@metaplex-foundation/mpl-token-metadata'
import {
  createTokenIfMissing,
  findAssociatedTokenPda,
  getSplAssociatedTokenProgramId,
  mintTokensTo,
} from '@metaplex-foundation/mpl-toolbox'
import {
  generateSigner,
  percentAmount,
  createGenericFile,
  signerIdentity,
  sol,
} from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'
import { base58 } from '@metaplex-foundation/umi/serializers'
import fs from 'fs'
import path from 'path'

// 래퍼 함수 생성
const createAndMintTokens = async () => {
  ///
  ///
  ///  모든 코드가 여기에 들어갑니다
  ///
  ///
}

// 래퍼 함수 실행
createAndMintTokens()
```

## Umi 설정

이 예시는 `generatedSigner()`로 Umi를 설정하는 과정을 다룹니다. 지갑이나 서명자를 다른 방식으로 설정하려면 [**Connecting to Umi**](/ko/dev-tools/umi/getting-started) 가이드를 확인할 수 있습니다.

umi 변수와 코드 블록을 `createAndMintTokens()` 함수 내부나 외부에 배치할 수 있습니다. 중요한 것은 `umi` 변수가 `createAndMintTokens()` 함수 자체에서 접근 가능하다는 것입니다.

### 새 지갑 생성

```ts
const umi = createUmi("https://devnet-aura.metaplex.com/<YOUR_API_KEY>")
  .use(mplCore())
  .use(irysUploader())

// 새 키페어 서명자를 생성합니다.
const signer = generateSigner(umi)

// umi에게 새 서명자를 사용하도록 지시합니다.
umi.use(signerIdentity(signer))

// 신원에 1 SOL을 에어드롭합니다
// 429 too many requests 오류가 발생하면
// 제공된 기본 무료 rpc 대신 다른 rpc를 사용해야 할 수 있습니다.
await umi.rpc.airdrop(umi.identity.publicKey)
```

### 로컬에 저장된 기존 지갑 사용

```ts
const umi = createUmi("https://devnet-aura.metaplex.com/<YOUR_API_KEY>")
  .use(mplTokenMetadata())
  .use(mplToolbox())
  .use(irysUploader())

// fs를 사용하고 파일시스템을 탐색하여
// 상대 경로를 통해 사용하고자 하는 지갑을 로드해야 합니다.
const walletFile = fs.readFileSync('./keypair.json', {encoding: "utf-8"})

// walletFile을 키페어로 변환합니다.
let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(JSON.parse(walletFile)));

// 키페어를 umi에 로드합니다.
umi.use(keypairIdentity(umiSigner));
```

## 토큰 생성

### 이미지 업로드

먼저 해야 할 일은 토큰을 나타내고 인식 가능하게 만드는 이미지를 업로드하는 것입니다. 이는 jpeg, png 또는 gif 형태일 수 있습니다.

Umi는 Arweave, NftStore, AWS, ShdwDrive에 파일을 저장하는 플러그인을 가지고 있습니다. 이러한 플러그인을 다운로드하여 파일을 업로드할 수 있습니다. 이 가이드의 시작 부분에서 Arweave 블록체인에 콘텐츠를 저장하는 irysUploader() 플러그인을 설치했으므로 이를 계속 사용하겠습니다.

{% callout title="로컬 스크립트/Node.js" %}
이 예시는 Irys를 사용하여 Arweave에 업로드하는 로컬 스크립트/node.js 접근 방식을 사용합니다. 다른 저장소 제공업체에 파일을 업로드하거나 브라우저에서 업로드하려면 다른 접근 방식을 취해야 합니다. `fs`를 임포트하고 사용하는 것은 브라우저 시나리오에서 작동하지 않습니다.
{% /callout %}

```ts
// `fs`를 사용하여 문자열 경로를 통해 파일을 읽습니다.

const imageFile = fs.readFileSync('./image.jpg')

// `createGenericFile`을 사용하여 파일을 Umi가 이해할 수 있는
// `GenericFile` 타입으로 변환합니다. mimetag 타입을 올바르게 설정해야
// Arweave가 이미지를 올바르게 표시할 수 있습니다.

const umiImageFile = createGenericFile(imageFile, 'image.jpeg', {
  tags: [{ name: 'contentType', value: 'image/jpeg' }],
})

// 여기서 Irys를 통해 Arweave에 이미지를 업로드하고
// 파일이 위치한 uri 주소를 반환받습니다. 이를 로그로 출력할 수 있지만
// 업로더가 파일 배열을 받을 수 있으므로 uri 배열도 반환합니다.
// 원하는 uri를 얻으려면 배열에서 인덱스 [0]을 호출할 수 있습니다.

const imageUri = await umi.uploader.upload([umiImageFile]).catch((err) => {
  throw new Error(err)
})

console.log(imageUri[0])
```

### 메타데이터 업로드

유효하고 작동하는 이미지 URI가 있으면 SPL 토큰의 메타데이터 작업을 시작할 수 있습니다.

펀지블 토큰의 오프체인 메타데이터 표준은 다음과 같습니다

```json
{
  "name": "TOKEN_NAME",
  "symbol": "TOKEN_SYMBOL",
  "description": "TOKEN_DESC",
  "image": "TOKEN_IMAGE_URL"
}
```

여기의 필드들은 다음을 포함합니다

#### name

토큰의 이름입니다.

#### symbol

토큰의 줄임말입니다. Solana의 줄임말이 SOL인 것처럼.

#### description

토큰의 설명입니다.

#### image

이전에 업로드한 imageUri(또는 이미지의 온라인 위치)로 설정됩니다.

```js
// 예시 메타데이터
const metadata = {
  name: 'The Kitten Coin',
  symbol: 'KITTEN',
  description: 'The Kitten Coin is a token created on the Solana blockchain',
  image: imageUri, // 변수를 사용하거나 uri 문자열을 붙여넣습니다.
}

// Umi의 `uploadJson` 함수를 호출하여 Irys를 통해 메타데이터를 Arweave에 업로드합니다.

const metadataUri = await umi.uploader.uploadJson(metadata).catch((err) => {
  throw new Error(err)
})
```

모든 것이 계획대로 진행되면 metadataUri 변수는 업로드된 JSON 파일의 URI를 저장해야 합니다.

### 토큰 생성

Solana 블록체인에서 새 토큰을 생성할 때 새 데이터를 수용하기 위해 몇 개의 계정을 생성해야 합니다.

#### 민트 계정 및 토큰 메타데이터 생성

민트 계정은 소수점 자릿수, 총 공급량, 민트 및 동결 권한과 같은 민트의 초기 민팅 세부 정보를 저장하는 반면, 토큰 메타데이터 계정은 토큰의 `name`, 오프체인 메타데이터 `uri`, 토큰의 `description`, 토큰의 `symbol`과 같은 토큰의 속성을 보유합니다. 이러한 계정들이 함께 Solana의 SPL 토큰에 대한 모든 정보를 제공합니다.

아래의 `createFungible()` 함수는 사용을 위해 민트 계정과 토큰 메타데이터 계정을 모두 생성합니다.

민트 주소가 될 키페어를 함수에 제공해야 합니다. 또한 JSON 파일의 추가 메타데이터를 제공해야 합니다. 이 메타데이터에는 토큰의 이름과 메타데이터 URI 주소가 포함됩니다.

```ts
const mintSigner = generateSigner(umi)

const createMintIx = await createFungible(umi, {
  mint: mintSigner,
  name: 'The Kitten Coin',
  uri: metadataUri, // 앞서 생성한 uri를 저장하고 있는 `metadataUri` 변수를 사용합니다.
  sellerFeeBasisPoints: percentAmount(0),
  decimals: 9, // 토큰이 가질 소수점 자릿수를 설정합니다.
})
```

### 토큰 민팅

#### 토큰 계정

토큰을 바로 민팅하는 경우 누군가의 지갑에 토큰을 저장할 장소가 필요합니다. 이를 위해 지갑과 민트 주소를 기반으로 수학적으로 주소를 생성하는데, 이를 연관 토큰 계정(ATA) 또는 때로는 단순히 토큰 계정이라고 합니다. 이 토큰 계정(ATA)은 지갑에 속하며 토큰을 저장합니다.

#### 토큰 계정 생성.

먼저 해야 할 일은 토큰 계정 주소가 무엇인지 파악하는 것입니다. MPL-Toolbox에는 존재하지 않는 경우 토큰 계정을 생성하면서 이를 수행하는 헬퍼 함수가 있습니다.

```ts
const createTokenIx = createTokenIfMissing(umi, {
  mint: mintSigner.publicKey,
  owner: umi.identity.publicKey,
  ataProgram: getSplAssociatedTokenProgramId(umi),
})
```

#### 민트 토큰 트랜잭션

이제 토큰 계정을 생성하는 명령어가 있으므로 `mintTokenTo()` 명령어로 해당 계정에 토큰을 민팅할 수 있습니다.

```ts
const mintTokensIx = mintTokensTo(umi, {
  mint: mintSigner.publicKey,
  token: findAssociatedTokenPda(umi, {
    mint: mintSigner.publicKey,
    owner: umi.identity.publicKey,
  }),
  amount: BigInt(1000),
})
```

### 트랜잭션 전송

여러 방법으로 트랜잭션을 전송하고 배열할 수 있지만 이 예시에서는 명령어들을 하나의 원자적 트랜잭션으로 연결하여 모든 것을 한 번에 전송할 것입니다. 여기서 명령어 중 하나라도 실패하면 전체 트랜잭션이 실패합니다.

```ts
// .add()로 명령어들을 연결한 다음 .sendAndConfirm()으로 전송

const tx = await createFungibleIx
  .add(createTokenIx)
  .add(createTokenAccountIfMissing)
  .add(mintTokensIx)
  .sendAndConfirm(umi)

// 마지막으로 온체인에서 확인할 수 있는 서명을 역직렬화할 수 있습니다.
// import { base58 } from "@metaplex-foundation/umi/serializers";

console.log(base58.deserialize(tx.signature)[0])
```

이제 Solana에서 토큰을 만드는 방법을 알았으므로, 몇 가지 기본 프로젝트 아이디어는 다음과 같습니다:

- solana 토큰 생성기
- 밈 코인 생성기

이제 Jupiter와 Orca와 같은 탈중앙화 거래소에 토큰을 상장하기 위한 유동성 풀 생성도 고려할 수 있습니다.

## 전체 코드 예시

```ts
import {
  createFungible,
  mplTokenMetadata,
} from '@metaplex-foundation/mpl-token-metadata'
import {
  createTokenIfMissing,
  findAssociatedTokenPda,
  getSplAssociatedTokenProgramId,
  mintTokensTo,
} from '@metaplex-foundation/mpl-toolbox'
import {
  generateSigner,
  percentAmount,
  createGenericFile,
  signerIdentity,
  sol,
} from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'
import { base58 } from '@metaplex-foundation/umi/serializers'
import fs from 'fs'
import path from 'path'

const createAndMintTokens = async () => {
  const umi = createUmi("https://devnet-aura.metaplex.com/<YOUR_API_KEY>")
    .use(mplTokenMetadata())
    .use(irysUploader())

  const signer = generateSigner(umi)

  umi.use(signerIdentity(signer))

// 신원에 1 SOL을 에어드롭합니다
  // 429 too many requests 오류가 발생하면
  // 파일시스템 지갑 방법을 사용하거나 rpc를 변경해야 할 수 있습니다.
  console.log("umi 신원에 1 SOL 에어드롭");
  await umi.rpc.airdrop(umi.identity.publicKey, sol(1));

  // `fs`를 사용하여 문자열 경로를 통해 파일을 읽습니다.

  const imageFile = fs.readFileSync("./image.jpg");

  // `createGenericFile`을 사용하여 파일을 umi가 이해할 수 있는
  // `GenericFile` 타입으로 변환합니다. mimetag 타입을 올바르게 설정해야
  // Arweave가 이미지를 올바르게 표시할 수 있습니다.

  const umiImageFile = createGenericFile(imageFile, "image.png", {
    tags: [{ name: "Content-Type", value: "image/png" }],
  });

  // 여기서 Irys를 통해 Arweave에 이미지를 업로드하고
  // 파일이 위치한 uri 주소를 반환받습니다. 이를 로그로 출력할 수 있지만
  // 업로더가 파일 배열을 받을 수 있으므로 uri 배열도 반환합니다.
  // 원하는 uri를 얻으려면 배열에서 인덱스 [0]을 호출할 수 있습니다.

  console.log("Irys를 통해 Arweave에 이미지 업로드");
  const imageUri = await umi.uploader.upload([umiImageFile]).catch((err) => {
    throw new Error(err);
  });

  console.log(imageUri[0]);

  // Irys를 통해 토큰 메타데이터를 Arweave에 업로드

  const metadata = {
    name: "The Kitten Coin",
    symbol: "KITTEN",
    description: "The Kitten Coin is a token created on the Solana blockchain",
    image: imageUri, // 변수를 사용하거나 uri 문자열을 붙여넣습니다.
  };

  // umi의 uploadJson 함수를 호출하여 Irys를 통해 메타데이터를 Arweave에 업로드합니다.

  console.log("Irys를 통해 Arweave에 메타데이터 업로드");
  const metadataUri = await umi.uploader.uploadJson(metadata).catch((err) => {
    throw new Error(err);
  });

  // mintIx 생성

  const mintSigner = generateSigner(umi);

  const createFungibleIx = createFungible(umi, {
    mint: mintSigner,
    name: "The Kitten Coin",
    uri: metadataUri, // 앞서 생성한 uri를 저장하고 있는 `metadataUri` 변수를 사용합니다.
    sellerFeeBasisPoints: percentAmount(0),
    decimals: 0, // 토큰이 가질 소수점 자릿수를 설정합니다.
  });

  // 이 명령어는 필요한 경우 새 토큰 계정을 생성하고, 찾으면 건너뜁니다.

  const createTokenIx = createTokenIfMissing(umi, {
    mint: mintSigner.publicKey,
    owner: umi.identity.publicKey,
    ataProgram: getSplAssociatedTokenProgramId(umi),
  });

  // 최종 명령어는 (필요한 경우) 이전 ix의 토큰 계정에 토큰을 민팅하는 것입니다.

  const mintTokensIx = mintTokensTo(umi, {
    mint: mintSigner.publicKey,
    token: findAssociatedTokenPda(umi, {
      mint: mintSigner.publicKey,
      owner: umi.identity.publicKey,
    }),
    amount: BigInt(1000),
  });

  // 마지막 단계는 ix들을 트랜잭션으로 체인에 전송하는 것입니다.
  // 여기서 ix들은 트랜잭션 체인 중에 필요에 따라 생략하고 추가할 수 있습니다.
  // 예를 들어 토큰을 민팅하지 않고 토큰만 생성하려면
  // `createToken` ix만 제출하면 됩니다.

  console.log("트랜잭션 전송")
  const tx = await createFungibleIx
    .add(createTokenIx)
    .add(mintTokensIx)
    .sendAndConfirm(umi);

  // 마지막으로 온체인에서 확인할 수 있는 서명을 역직렬화할 수 있습니다.
  const signature = base58.deserialize(tx.signature)[0];

  // 서명과 트랜잭션 및 NFT에 대한 링크를 로그로 출력합니다.
  // 탐색기 링크는 데브넷 체인용이며, 클러스터를 메인넷으로 변경할 수 있습니다.
  console.log('\n트랜잭션 완료')
  console.log('Solana Explorer에서 트랜잭션 보기')
  console.log(`https://explorer.solana.com/tx/${signature}?cluster=devnet`)
  console.log('Solana Explorer에서 토큰 보기')
  console.log(`https://explorer.solana.com/address/${mintSigner.publicKey}?cluster=devnet`)
};

createAndMintTokens()
```