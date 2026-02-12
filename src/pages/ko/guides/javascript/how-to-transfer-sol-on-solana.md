---
# remember to update dates also in /components/guides/index.js
title: Solana에서 SOL을 전송하는 방법
metaTitle: Solana에서 SOL을 전송하는 방법 | 가이드
description: Solana 블록체인에서 javascript를 통해 SOL을 전송하는 방법을 알아보세요.
created: '06-16-2024'
updated: '06-24-2024'
keywords:
  - transfer SOL
  - send SOL
  - Solana SOL transfer
  - Solana transaction
  - Metaplex Umi
about:
  - SOL transfers
  - Metaplex Umi
  - Solana transactions
proficiencyLevel: Beginner
programmingLanguage:
  - TypeScript
howToSteps:
  - Set up a new project and install Umi and mpl-toolbox packages
  - Configure Umi with a signer and RPC connection
  - Use the transferSol function from mpl-toolbox to create a transfer instruction
  - Send and confirm the transaction on the Solana blockchain
howToTools:
  - Metaplex Umi
  - mpl-toolbox
---

이 가이드는 Metaplex Umi 클라이언트 래퍼와 MPL Toolbox 패키지를 활용하여 Solana 블록체인에서 한 지갑에서 다른 지갑으로 SOL을 전송하는 Javascript 함수를 구축하는 방법을 보여줍니다.

## 전제조건

- 선택한 코드 에디터 (Visual Studio Code 권장)
- Node 18.x.x 이상.
- 기본 Javascript 지식

## 초기 설정

### 초기화

선택한 패키지 매니저(npm, yarn, pnpm, bun)로 새 프로젝트를 초기화(선택사항)하고 프롬프트가 나타나면 필요한 세부 정보를 입력하는 것부터 시작하세요.

```js
npm init
```

### 필수 패키지

이 가이드에 필요한 패키지를 설치하세요.

{% packagesUsed packages=["umi", "umiDefaults" ,"toolbox"] type="npm" /%}

```js
npm i @metaplex-foundation/umi
```

```js
npm i @metaplex-foundation/umi-bundle-defaults
```

```js
npm i @metaplex-foundation/mpl-toolbox
```

### 임포트 및 래퍼 함수

여기서 이 특정 가이드에 필요한 모든 임포트를 정의하고 모든 코드가 실행될 래퍼 함수를 생성합니다.

```ts
import { mplToolbox, transferSol } from '@metaplex-foundation/mpl-toolbox'
import {
  generateSigner,
  publicKey,
  signerIdentity,
  sol,
} from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { base58 } from '@metaplex-foundation/umi/serializers'

// 래퍼 함수 생성
const transfer = async () => {
  ///
  ///
  ///  모든 코드가 여기에 들어갑니다
  ///
  ///
}

// 래퍼 함수 실행
transfer()
```

## Umi 설정

이 예시는 `generatedSigner()`로 Umi를 설정하는 과정을 다룹니다. 지갑이나 서명자를 다른 방식으로 설정하려면 [**Connecting to Umi**](/ko/dev-tools/umi/getting-started) 가이드를 확인할 수 있습니다.

### 새 지갑 생성

테스트용으로 새 지갑/개인 키를 생성하려면 `umi`로 새 서명자를 생성할 수 있습니다.

```ts
const umi = createUmi("https://api.devnet.solana.com")
  .use(mplToolbox())

// 새 키페어 서명자를 생성합니다.
const signer = generateSigner(umi)

// Umi에게 새 서명자를 사용하도록 지시합니다.
umi.use(signerIdentity(signer))

// 테스트용으로 데브넷에서만 SOL을 에어드롭합니다.
await umi.rpc.airdrop(umi.identity.publicKey)
```

### 로컬에 저장된 기존 지갑 사용

```ts
import fs from 'fs';

const umi = createUmi("https://api.devnet.solana.com")
  .use(mplToolbox())

// fs를 사용하고 파일시스템을 탐색하여
// 상대 경로를 통해 사용하고자 하는 지갑을 로드해야 합니다.
const walletFile = fs.readFileSync('./keypair.json')

// walletFile을 키페어로 변환합니다.
let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(walletFile));

// 키페어를 umi에 로드합니다.
umi.use(keypairIdentity(keypair));
```

## Sol 전송

`mpl-toolbox` 패키지는 블록체인에서 전송을 실행하는 데 필요한 명령어를 생성하는 `transferSol`이라는 헬퍼 함수를 제공합니다.

```ts
// 여기서 transferSol() 함수를 호출하고 체인에 전송합니다.

const res = await transferSol(umi, {
  source: umi.identity,
  destination: publicKey('111111111111111111111111111111'),
  amount: sol(1),
}).sendAndConfirm(umi)
```

## 전체 코드 예시

```ts
import { mplToolbox, transferSol } from '@metaplex-foundation/mpl-toolbox'
import {
  generateSigner,
  publicKey,
  signerIdentity,
  sol,
} from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { base58 } from '@metaplex-foundation/umi/serializers'

const transfer = async () => {
  const umi = createUmi("https://api.devnet.solana.com").use(mplToolbox())

  const signer = generateSigner(umi)

  umi.use(signerIdentity(signer))

  // 신원에 1 SOL을 에어드롭합니다
  // 429 too many requests 오류가 발생하면
  // 파일시스템 지갑 방법을 사용하거나 rpc를 변경해야 할 수 있습니다.
  await umi.rpc.airdrop(umi.identity.publicKey, sol(1))

  //
  // SOL 전송
  //

  const res = await transferSol(umi, {
    source: umi.identity,
    destination: publicKey('111111111111111111111111111111'),
    amount: sol(1),
  }).sendAndConfirm(umi)

  // 트랜잭션의 서명을 로그합니다
  console.log(base58.deserialize(res.signature))
}

transfer()
```
