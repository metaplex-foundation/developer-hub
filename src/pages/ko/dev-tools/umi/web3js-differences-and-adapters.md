---
title: '@solana/web3.js 차이점과 어댑터'
metaTitle: 'Umi - @solana/web3.js 차이점과 어댑터'
description: 'Metaplex Umi와 Solana web3js를 함께 작동시키기 위한 차이점과 어댑터.'
---

`@solana/web3.js` 라이브러리는 현재 Solana 생태계에서 널리 사용되고 있으며 `PublicKeys`, `Transactions`, `Instructions` 등에 대한 자체 타입을 정의합니다.

`Umi`를 생성할 때 우리는 `@solana/web3.js`에서 정의된 클래스 기반 타입에서 벗어나고 싶었습니다. 안타깝게도 이는 동일하거나 유사한 가져오기 이름을 가지고 있음에도 불구하고 `@solana/web3.js`의 모든 타입이 `Umi`에서 제공하는 타입과 호환되지 않으며 그 반대도 마찬가지임을 의미합니다.

이 문제를 해결하기 위해 `Umi`는 타입을 해당하는 `Web3.js` 상대방과 상호 변환할 수 있는 어댑터 세트를 제공하며, 이들은 [`@metaplex-foundation/umi-web3js-adapters`](https://www.npmjs.com/package/@metaplex-foundation/umi-web3js-adapters) 패키지에서 찾을 수 있습니다.

## 필수 패키지와 가져오기

`umi-web3js-adapters` 패키지에는 Umi와 Web3.js 타입 간에 변환하는 데 필요한 모든 헬퍼 메서드가 포함되어 있습니다.

`@metaplex-foundation/umi` 패키지를 설치할 때 이미 포함되어 있지만, 다음 명령을 사용하여 별도로 설치할 수도 있습니다:

```
npm i @metaplex-foundation/umi-web3js-adapters
```

**액세스할 수 있는 가져오기는 다음과 같습니다:**

```ts
import {
  // 키페어
  fromWeb3JsKeypair, toWeb3JsKeypair,
  // 공개키
  fromWeb3JsPublicKey, toWeb3JsPublicKey,
  // 인스트럭션
  fromWeb3JsInstruction, toWeb3JsInstruction,
  // 레거시 트랜잭션
  fromWeb3JsLegacyTransaction, toWeb3JsLegacyTransaction,
  // 버전 트랜잭션
  fromWeb3JsTransaction, toWeb3JsTransaction,
  // 메시지
  fromWeb3JsMessage, toWeb3JsMessage, toWeb3JsMessageFromInput
} from '@metaplex-foundation/umi-web3js-adapters';
```

## 공개키

공개키 생성은 처음에는 비슷해 보일 수 있지만 패키지 간에 미묘한 차이가 있습니다. **Web3Js**는 대문자 `P`를 사용하고 `new`가 필요한 반면, **Umi** 버전은 소문자 `p`를 사용합니다.

### Umi

```ts
import { publicKey } from '@metaplex-foundation/umi';

// 새로운 Umi 공개키 생성
const umiPublicKey = publicKey("11111111111111111111111111111111");
```

### Web3Js

```ts
import { PublicKey } from '@solana/web3.js';

// 새로운 Web3Js 공개키 생성
const web3jsPublickey = new PublicKey("1111111111111111111111111111111111111111");
```

이제 어댑터를 사용하는 방법을 살펴보겠습니다.

### Web3Js에서 Umi로

```ts
import { PublicKey } from '@solana/web3.js';
import { fromWeb3JsPublicKey } from '@metaplex-foundation/umi-web3js-adapters';

// 새로운 공개키 생성
const web3jsPublickey = new PublicKey("1111111111111111111111111111111111111111");

// UmiWeb3jsAdapters 패키지를 사용하여 변환
const umiPublicKey = fromWeb3JsPublicKey(web3jsPublickey);
```

### Umi에서 Web3Js로

```ts
import { publicKey } from '@metaplex-foundation/umi';
import { toWeb3JsPublicKey } from '@metaplex-foundation/umi-web3js-adapters';

// 새로운 공개키 생성
const umiPublicKey = publicKey("11111111111111111111111111111111");

// UmiWeb3jsAdapters 패키지를 사용하여 변환
const web3jsPublickey = toWeb3JsPublicKey(umiPublicKey);
```

## 키페어

키페어 생성은 Web3Js와 Umi의 차이가 증가하는 부분입니다. **Web3Js**에서는 단순히 `Keypair.generate()`를 사용할 수 있지만, **Umi**에서는 먼저 대부분의 Umi 및 Metaplex 관련 작업에 사용할 Umi 인스턴스를 생성해야 합니다.

### Umi

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { generateSigner, createSignerFromKeypair } from '@metaplex-foundation/umi'

// 새로운 Umi 인스턴스 생성
const umi = createUmi('https://api.devnet.solana.com')

// 새로운 Umi 키페어 생성
const umiKeypair = generateSigner(umi)

// 또는 기존 키페어 사용
const umiKeypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(walletFile));
```

### Web3Js

```ts
import { Keypair } from '@solana/web3.js';

// 새로운 Web3Js 키페어 생성
const web3jsKeypair = Keypair.generate();

// 또는 기존 키페어 사용
const web3jsKeypair = Keypair.fromSecretKey(new Uint8Array(walletFile));
```

이제 어댑터를 사용하는 방법을 살펴보겠습니다.

### Umi에서 Web3Js로

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { generateSigner } from '@metaplex-foundation/umi'
import { toWeb3JsKeypair } from '@metaplex-foundation/umi-web3js-adapters';

// 새로운 Umi 인스턴스 생성
const umi = createUmi('https://api.devnet.solana.com')

// 새로운 키페어 생성
const umiKeypair = generateSigner(umi)

// UmiWeb3jsAdapters 패키지를 사용하여 변환
const web3jsKeypair = toWeb3JsKeypair(umiKeypair);
```

### Web3Js에서 Umi로

```ts
import { Keypair } from '@solana/web3.js';
import { fromWeb3JsKeypair } from '@metaplex-foundation/umi-web3js-adapters';

// 새로운 키페어 생성
const web3jsKeypair = Keypair.generate();

// UmiWeb3jsAdapters 패키지를 사용하여 변환
const umiKeypair = fromWeb3JsKeypair(web3jsKeypair);
```

## 인스트럭션

인스트럭션을 생성할 때 Umi의 주요 차이점은 먼저 Umi 인스턴스를 생성해야 한다는 것입니다(`Keypairs`와 마찬가지로). 또한 `getInstructions()`는 단일 인스트럭션 대신 인스트럭션 배열을 반환합니다.

대부분의 사용 사례에서는 다른 헬퍼와 트랜잭션 빌더를 사용하여 이를 단순화할 수 있으므로 개별 인스트럭션을 처리할 필요가 없습니다.

### Umi

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { transferSol } from '@metaplex-foundation/mpl-toolbox';

// 새로운 Umi 인스턴스 생성
const umi = createUmi('https://api.devnet.solana.com').use(mplCore())

// 새로운 인스트럭션 생성 (코어 NFT 전송과 같은)
// get instructions는 인스트럭션 배열을 제공합니다
const umiInstructions = transferSol(umi, {...TransferParams}).getInstructions();
```

### Web3Js

```ts
import { SystemProgram } from '@solana/web3.js';

// 새로운 인스트럭션 생성 (lamport 전송과 같은)
const web3jsInstruction = SystemProgram.transfer({...TransferParams})
```

이제 어댑터를 사용하는 방법을 살펴보겠습니다.

### Umi에서 Web3Js로

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { transferSol } from '@metaplex-foundation/mpl-toolbox';
import { toWeb3JsInstruction } from '@metaplex-foundation/umi-web3js-adapters';

// 새로운 Umi 인스턴스 생성
const umi = createUmi('https://api.devnet.solana.com').use(mplCore())

// 새로운 인스트럭션 생성 (코어 NFT 전송과 같은)
const umiInstruction = transferSol(umi, {...TransferParams}).getInstructions();

// UmiWeb3jsAdapters 패키지를 사용하여 변환
const web3jsInstruction = umiInstruction.map(toWeb3JsInstruction);
```

### Web3Js에서 Umi로

```ts
import { SystemProgram } from '@solana/web3.js';
import { fromWeb3JsInstruction } from '@metaplex-foundation/umi-web3js-adapters';

// 새로운 Umi 인스턴스 생성
const umi = createUmi('https://api.devnet.solana.com')

// 새로운 인스트럭션 생성 (lamport 전송과 같은)
const web3jsInstruction = SystemProgram.transfer({...TransferParams})

// UmiWeb3jsAdapters 패키지를 사용하여 변환
const umiInstruction = fromWeb3JsInstruction(web3jsInstruction);
```

## 트랜잭션

Solana 런타임은 두 가지 트랜잭션 버전을 지원합니다:

- 레거시 트랜잭션: 추가 혜택이 없는 이전 트랜잭션 형식
- 0 / 버전 트랜잭션: 주소 조회 테이블 지원 추가

**참고**: 버전 트랜잭션의 개념에 익숙하지 않다면 [여기](https://solana.com/en/docs/advanced/versions)에서 자세히 읽어보세요.

`umi`와 `umi-web3js-adapters`에서는 두 트랜잭션 타입 모두에 대한 지원을 추가했습니다!

### Umi

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { transferSol } from '@metaplex-foundation/mpl-toolbox';
// 새로운 Umi 인스턴스 생성
const umi = createUmi('https://api.devnet.solana.com').use(mplCore())

// 새로운 Umi 레거시 트랜잭션 생성
const umiTransaction = transferSol(umi, {...TransferParams}).useLegacyVersion();

// 새로운 Umi 버전 트랜잭션 생성
const umiVersionedTransaction = transferSol(umi, {...TransferParams}).useV0().build(umi)
```

### Web3Js

```ts
import { Transaction, VersionedTransaction, TransactionMessage, Connection, clusterApiUrl, SystemProgram } from '@solana/web3.js';

// 새로운 Web3Js 레거시 트랜잭션 생성
const web3jsTransaction = new Transaction().add(SystemProgram.transfer({...TransferParams}));

// 새로운 Web3Js 버전 트랜잭션 생성
const instructions = [SystemProgram.transfer({...TransferParams})];

const connection = new Connection(clusterApiUrl("devnet"));
const blockhash = await connection.getLatestBlockhash().then(res => res.blockhash);

const messageV0 = new TransactionMessage({
  payerKey: payer.publicKey,
  recentBlockhash: blockhash,
  instructions,
}).compileToV0Message();

const web3jsVersionedTransaction = new VersionedTransaction(messageV0);
```

이제 어댑터를 사용하는 방법을 살펴보겠습니다.

### Umi에서 Web3Js로

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { transferSol } from '@metaplex-foundation/mpl-toolbox';
import { toWeb3JsLegacyTransaction, toWeb3JsTransaction } from '@metaplex-foundation/umi-web3js-adapters';

// 새로운 Umi 인스턴스 생성
const umi = createUmi('https://api.devnet.solana.com').use(mplCore())

// 새로운 레거시 트랜잭션 생성
const umiTransaction = transferSol(umi, {...TransferParams}).useLegacyVersion();

// UmiWeb3jsAdapters 패키지를 사용하여 변환
const web3jsTransaction = toWeb3JsTransaction(umiTransaction);

/// 버전 트랜잭션 ///

// 새로운 버전 트랜잭션 생성
const umiVersionedTransaction = transferSol(umi, {...TransferParams}).useV0().build(umi)

// UmiWeb3jsAdapters 패키지를 사용하여 변환
const web3jsVersionedTransaction = toWeb3JsTransaction(umiVersionedTransaction);
```

### Web3Js에서 Umi로

```ts
import { Transaction, VersionedTransaction, TransactionMessage, Connection, clusterApiUrl, SystemProgram } from '@solana/web3.js';
import { fromWeb3JsLegacyTransaction, fromWeb3JsTransaction } from '@metaplex-foundation/umi-web3js-adapters';

// 새로운 레거시 트랜잭션 생성
const web3jsTransaction = new Transaction().add(SystemProgram.transfer({...TransferParams}));

// UmiWeb3jsAdapters 패키지를 사용하여 변환
const umiTransaction = fromWeb3JsLegacyTransaction(web3jsTransaction);

/// 버전 트랜잭션 ///

// 새로운 버전 트랜잭션 생성
const web3jsVersionedTransaction = new VersionedTransaction(...messageV0Params);

// UmiWeb3jsAdapters 패키지를 사용하여 변환
const umiVersionedTransaction = fromWeb3JsTransaction(web3jsVersionedTransaction);
```

## 메시지

버전 트랜잭션 생성 중에 메시지 생성을 이미 다뤘습니다. 다시 검토해보겠습니다.

### Umi

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { transfer, mplCore } from '@metaplex-foundation/mpl-core'

// 새로운 Umi 인스턴스 생성
const umi = createUmi('https://api.devnet.solana.com').use(mplCore())

// 새로운 Umi 메시지 생성
const blockhash = await umi.rpc.getLatestBlockhash()

const instructions = transfer(umi, {...TransferParams}).getInstructions()

const umiVersionedTransaction = umi.transactions.create({
  version: 0,
  payer: frontEndSigner.publicKey,
  instructions,
  blockhash: blockhash.blockhash,
});

const umiMessage = umiVersionedTransaction.message
```

### Web3Js

```ts
import { TransactionMessage, Connection, clusterApiUrl, SystemProgram } from '@solana/web3.js';

// 새로운 Web3Js 메시지 생성
const connection = new Connection(clusterApiUrl("devnet"));
const minRent = await connection.getMinimumBalanceForRentExemption(0);
const blockhash = await connection.getLatestBlockhash().then(res => res.blockhash);

const instructions = [SystemProgram.transfer({...TransferParams})];

const Web3JsMessage = new TransactionMessage({
  payerKey: payer.publicKey,
  recentBlockhash: blockhash,
  instructions,
}).compileToV0Message();
```

이제 어댑터를 사용하는 방법을 살펴보겠습니다.

### Umi에서 Web3Js로

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { toWeb3JMessage } from '@metaplex-foundation/umi-web3js-adapters';

// 새로운 Umi 인스턴스 생성
const umi = createUmi('https://api.devnet.solana.com').use(mplCore())

// 새로운 버전 트랜잭션 생성
const umiMessage = umi.transactions.create({...createParams}).message;

// UmiWeb3jsAdapters 패키지를 사용하여 변환
const web3jsMessage = toWeb3JMessage(umiMessage);
```

### Web3Js에서 Umi로

```ts
import { TransactionMessage } from '@solana/web3.js';
import { fromWeb3JMessage } from '@metaplex-foundation/umi-web3js-adapters';

// 새로운 버전 트랜잭션 생성
const Web3JsMessage = new TransactionMessage({...createMessageParams}).compileToV0Message();

// UmiWeb3jsAdapters 패키지를 사용하여 변환
const umiMessage = fromWeb3JMessage(Web3JsMessage);
```
