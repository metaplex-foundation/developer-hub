---
title: Solana에서 SPL 토큰을 전송하는 방법
metaTitle: Solana에서 SPL 토큰을 전송하는 방법 | 가이드
description: Metaplex 패키지를 사용하여 Solana 블록체인에서 javascript를 통해 SPL 토큰을 전송하는 방법을 알아보세요.
# remember to update dates also in /components/guides/index.js
created: '06-16-2024'
updated: '06-24-2024'
---

이 가이드는 Metaplex Umi 클라이언트 래퍼와 MPL Toolbox 패키지를 활용하여 Solana 블록체인에서 SPL 토큰을 전송하는 Javascript 함수를 구축하는 방법을 보여줍니다.

이 가이드를 위해서는 전송할 SPL 토큰이 지갑에 있어야 하므로, 지갑에 없는 경우 누군가에게 전송받거나 다른 [SPL 토큰 생성 가이드](/ko/guides/javascript/how-to-create-an-spl-token-on-solana)를 따라야 합니다.

## 전제조건

- 선택한 코드 에디터 (Visual Studio Code 권장)
- Node 18.x.x 이상.

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
import {
  findAssociatedTokenPda,
  mplToolbox,
  transferTokens,
} from '@metaplex-foundation/mpl-toolbox'
import { keypairIdentity, publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { base58 } from '@metaplex-foundation/umi/serializers'
import fs from 'fs'
import path from 'path'

const transferSplTokens = async () => {
  const umi = createUmi("https://api.devnet.solana.com").use(mplToolbox())

  // 전송하려는 SPL 토큰이 있는 지갑을 가져옵니다
  const walletFile = fs.readFileSync('./keypair.json')

  // walletFile을 키페어로 변환합니다.
  let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(walletFile))

  // 키페어를 umi에 로드합니다.
  umi.use(keypairIdentity(keypair))

//
  // 주요 계정들
  //

  // 전송하려는 토큰의 주소입니다.
  const splToken = publicKey("111111111111111111111111111111");

  // 토큰을 전송받을 지갑의 주소입니다.
  const destinationWallet = publicKey("22222222222222222222222222222222");

  // 전송자 지갑에서 SPL 토큰의 연관 토큰 계정을 찾습니다.
  const sourceTokenAccount = findAssociatedTokenPda(umi, {
    mint: splToken,
    owner: umi.identity.publicKey,
  });

  // 수신자 지갑에서 SPL 토큰의 연관 토큰 계정을 찾습니다.
  const destinationTokenAccount = findAssociatedTokenPda(umi, {
    mint: splToken,
    owner: destinationWallet,
  });

  //
  // SPL 토큰 전송
  //

  const res = await transferTokens(umi, {
    source: sourceTokenAccount,
    destination: destinationTokenAccount,
    amount: 10000, // 전송할 토큰 양
  }).sendAndConfirm(umi);

  // 마지막으로 온체인에서 확인할 수 있는 서명을 역직렬화할 수 있습니다.
  const signature = base58.deserialize(res.signature)[0];

  // 서명과 트랜잭션 및 NFT에 대한 링크를 로그로 출력합니다.
  console.log("\n전송 완료")
  console.log("SolanaFM에서 트랜잭션 보기");
  console.log(`https://solana.fm/tx/${signature}?cluster=devnet-alpha`);
}

transferSplTokens()
```