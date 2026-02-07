---
title: 트랜잭션 전송
metaTitle: 트랜잭션 전송 | Umi
description: Metaplex Umi와 Transaction Builder를 사용하여 트랜잭션 전송하기
---
트랜잭션을 관리하고 전송하는 것은 모든 Solana 클라이언트의 중요한 부분입니다. 이를 관리하는 데 도움이 되도록 Umi는 다양한 구성 요소를 제공합니다:

- 트랜잭션을 생성하고 (역)직렬화하는 데 사용할 수 있는 [TransactionFactoryInterface](https://umi.typedoc.metaplex.com/interfaces/umi.TransactionFactoryInterface.html)
- 트랜잭션을 쉽게 구축할 수 있게 해주는 [TransactionBuilder](https://umi.typedoc.metaplex.com/classes/umi.TransactionBuilder.html)
- 트랜잭션을 전송, 확인 및 가져오는 데 사용할 수 있는 [RpcInterface](https://umi.typedoc.metaplex.com/interfaces/umi.RpcInterface.html). [RPC 인터페이스에 대한 자세한 내용은 여기에서 읽을 수 있습니다](rpc).

## 트랜잭션과 인스트럭션

Umi는 트랜잭션, 인스트럭션 및 기타 모든 관련 타입에 대한 자체 인터페이스 세트를 정의합니다. 다음은 API 문서에 대한 링크와 함께 가장 중요한 것들의 간단한 개요입니다:

- [Transaction](https://umi.typedoc.metaplex.com/interfaces/umi.Transaction.html): 트랜잭션은 버전이 있는 트랜잭션 메시지, 필요한 서명 목록, 그리고 쉽게 서명할 수 있도록 메시지의 직렬화된 버전으로 구성됩니다.
- [TransactionMessage](https://umi.typedoc.metaplex.com/interfaces/umi.TransactionMessage.html): 트랜잭션 메시지는 모든 필요한 공개 키, 공개 키 대신 인덱스를 사용하는 하나 이상의 컴파일된 인스트럭션, 최신 블록해시 및 버전과 같은 기타 속성으로 구성됩니다. 트랜잭션 메시지는 다음 버전 중 하나를 가질 수 있습니다:
  - Version: "legacy": 트랜잭션 메시지의 첫 번째 Solana 반복
  - Version: 0: 트랜잭션 버전 관리를 도입하는 첫 번째 트랜잭션 메시지 버전. 주소 조회 테이블도 도입합니다.
- [Instruction](https://umi.typedoc.metaplex.com/types/umi.Instruction.html): 인스트럭션은 프로그램 ID, [AccountMeta](https://umi.typedoc.metaplex.com/types/umi.AccountMeta.html) 목록, 그리고 일부 직렬화된 데이터로 구성됩니다. 각 계정 `AccountMeta`는 공개 키, 트랜잭션에 서명할지 여부를 나타내는 불린, 그리고 쓰기 가능한지 여부를 나타내는 다른 불린으로 구성됩니다.

새 트랜잭션을 생성하려면 `TransactionFactoryInterface`의 `create` 메서드를 사용할 수 있습니다. 예를 들어, 단일 인스트럭션으로 버전 `0` 트랜잭션을 생성하는 방법은 다음과 같습니다:

```ts
const transaction = umi.transactions.create({
  version: 0,
  blockhash: (await umi.rpc.getLatestBlockhash()).blockhash,
  instructions: [myInstruction],
  payer: umi.payer.publicKey,
})
```

트랜잭션 팩토리 인터페이스는 트랜잭션과 메시지를 직렬화하고 역직렬화하는 데도 사용할 수 있습니다.

```ts
const mySerializedTransaction = umi.transactions.serialize(myTransaction)
const myTransaction = umi.transactions.deserialize(mySerializedTransaction)
const mySerializedMessage = umi.transactions.serializeMessage(myMessage)
const myMessage = umi.transactions.deserializeMessage(mySerializedMessage)
```

이 모든 것이 좋지만 블록체인에 트랜잭션을 보낼 때마다 매번 구축하기에는 다소 번거로울 수 있습니다. 다행히 Umi는 이를 도울 수 있는 `TransactionBuilder`를 제공합니다.

## 트랜잭션 빌더

트랜잭션 빌더는 빌드, 서명 및/또는 전송할 준비가 될 때까지 점진적으로 트랜잭션을 빌드하는 데 사용할 수 있는 불변 객체입니다. [`WrappedInstruction`](https://umi.typedoc.metaplex.com/types/umi.WrappedInstruction.html) 목록과 빌드된 트랜잭션을 구성하는 데 사용할 수 있는 다양한 옵션으로 구성됩니다. `WrappedInstruction`은 `instruction`과 다른 여러 속성을 포함하는 간단한 객체입니다. 구체적으로:

- 인스트럭션이 결국 계정을 생성하는 경우 온체인에서 차지할 바이트 수(계정 헤더 포함)를 알려주는 `bytesCreatedOnChain` 속성
- 전체 트랜잭션과 대조적으로 이 특정 인스트럭션에 필요한 서명자를 알 수 있도록 하는 `signers` 배열. 이를 통해 나중에 볼 수 있듯이 정보 손실 없이 트랜잭션 빌더를 두 개로 분할할 수 있습니다.

`transactionBuilder` 함수를 사용하여 새로운 트랜잭션 빌더를 생성하고 `add` 메서드를 사용하여 인스트럭션을 추가할 수 있습니다. 트랜잭션 시작 부분에 인스트럭션을 푸시하려면 `prepend` 메서드를 사용할 수도 있습니다.

```ts
let builder = transactionBuilder()
  .add(myWrappedInstruction)
  .add(myOtherWrappedInstruction)
  .prepend(myFirstWrappedInstruction)
```

트랜잭션 빌더는 불변이므로 `add`와 `prepend` 메서드의 결과를 항상 새 변수에 할당해야 합니다. 새로운 트랜잭션 빌더를 반환하여 트랜잭션 빌더를 업데이트하는 다른 메서드에도 동일하게 적용됩니다.

```ts
builder = builder.add(myWrappedInstruction)
builder = builder.prepend(myWrappedInstruction)
```

이러한 메서드 중 하나도 다른 트랜잭션 빌더를 허용하고 이를 현재 빌더에 병합한다는 점에 주목하세요. 실제로 이는 프로그램 라이브러리가 최종 사용자가 함께 구성할 수 있도록 트랜잭션 빌더를 반환하는 자체 헬퍼 메서드를 작성(또는 [자동 생성](kinobi))할 수 있음을 의미합니다.

```ts
import { transferSol, addMemo } from '@metaplex-foundation/mpl-toolbox';
import { createNft } from '@metaplex-foundation/mpl-token-metadata';

let builder = transactionBuilder()
  .add(addMemo(umi, { ... }))
  .add(createNft(umi, { ... }))
  .add(transferSol(umi, { ... }))
```

예를 들어 원래 빌더에서 생성될 트랜잭션이 블록체인에 전송하기에는 너무 큰 경우 트랜잭션 빌더를 둘로 분할할 수도 있습니다. 이렇게 하려면 [`splitByIndex`](https://umi.typedoc.metaplex.com/classes/umi.TransactionBuilder.html#splitByIndex) 메서드나 더 위험한 [`unsafeSplitByTransactionSize`](https://umi.typedoc.metaplex.com/classes/umi.TransactionBuilder.html#unsafeSplitByTransactionSize) 메서드를 사용할 수 있습니다. 후자의 API 참조에 있는 주석을 반드시 읽으시기 바랍니다.

```ts
const [builderA, builderB] = builder.splitByIndex(2)
const splitBuilders = builder.unsafeSplitByTransactionSize(umi)
```

트랜잭션 빌더로 할 수 있는 일은 훨씬 더 많습니다. 자세한 내용은 [API 참조를 읽어보시기](https://umi.typedoc.metaplex.com/classes/umi.TransactionBuilder.html) 바랍니다. 다음은 트랜잭션 빌더를 구성할 수 있는 다른 메서드들의 간단한 개요입니다.

```ts
// 설정자
builder = builder.setVersion(myTransactionVersion) // 트랜잭션 버전 설정
builder = builder.useLegacyVersion() // 트랜잭션 버전을 "legacy"로 설정
builder = builder.useV0() // 트랜잭션 버전을 0으로 설정 (기본값)
builder = builder.empty() // 빌더에서 모든 인스트럭션을 제거하지만 구성은 유지
builder = builder.setItems(myWrappedInstructions) // 래핑된 인스트럭션을 주어진 것들로 덮어쓰기
builder = builder.setAddressLookupTables(myLuts) // 주소 조회 테이블 설정, 버전 0 트랜잭션에만 해당
builder = builder.setFeePayer(myPayer) // 사용자 정의 수수료 지불자 설정
builder = builder.setBlockhash(myBlockhash) // 트랜잭션에 사용할 블록해시 설정
builder = await builder.setLatestBlockhash(umi) // 최신 블록해시를 가져와서 트랜잭션에 사용

// 획득자
const transactionSize = builder.getTransactionSize(umi) // 빌드된 트랜잭션의 바이트 크기 반환
const isSmallEnough = builder.fitsInOneTransaction(umi) // 빌드된 트랜잭션이 하나의 트랜잭션에 맞는지 여부
const transactionRequired = builder.minimumTransactionsRequired(umi) // 모든 인스트럭션을 전송하는 데 필요한 최소 트랜잭션 수 반환
const blockhash = builder.getBlockhash() // 구성된 블록해시 반환 (있는 경우)
const feePayer = builder.getFeePayer(umi) // 구성된 수수료 지불자 반환 또는 구성되지 않은 경우 `umi.payer` 사용
const instructions = builder.getInstructions(umi) // 모든 언래핑된 인스트럭션 반환
const signers = builder.getSigners(umi) // 수수료 지불자를 포함한 모든 중복 제거된 서명자 반환
const bytes = builder.getBytesCreatedOnChain() // 온체인에서 생성될 총 바이트 수 반환
const solAmount = await builder.getRentCreatedOnChain(umi) // 온체인에서 생성될 총 바이트 수 반환
```

일부에 `Umi` 인스턴스를 전달하고 있다는 점에 주목하세요. 이는 작업을 수행하기 위해 Umi의 핵심 인터페이스에 액세스해야 하기 때문입니다.

이제 트랜잭션 빌더가 준비되었으니 이를 사용하여 트랜잭션을 빌드, 서명 및 전송하는 방법을 살펴보겠습니다.

## 트랜잭션 빌드 및 서명

트랜잭션을 빌드할 준비가 되면 `build` 메서드를 사용하면 됩니다. 이 메서드는 서명하고 블록체인에 전송할 수 있는 `Transaction` 객체를 반환합니다.

```ts
const transaction = builder.build(umi)
```

`build` 메서드는 빌더에 블록해시가 설정되지 않은 경우 오류를 발생시킵니다. 최신 블록해시를 사용하여 트랜잭션을 빌드하려면 대신 `buildWithLatestBlockhash` 메서드를 사용할 수 있습니다.

```ts
const transaction = await builder.buildWithLatestBlockhash(umi)
```

이 시점에서 빌드된 트랜잭션을 사용하고 `getSigners` 메서드를 통해 빌더에서 모든 중복 제거된 서명자를 가져와서 서명할 수 있습니다(자세한 내용은 [트랜잭션 서명](/ko/dev-tools/umi/public-keys-and-signers#signing-transactions) 참조). 그러나 Umi는 이를 대신 수행할 수 있는 `buildAndSign` 메서드를 제공합니다. `buildAndSign`을 사용할 때 빌더에 설정되지 않은 경우에만 최신 블록해시가 사용됩니다.

```ts
const signedTransaction = await builder.buildAndSign(umi)
```

이미 빌드되었지만 아직 서명되지 않은 트랜잭션을 배열에 푸시하고 `signAllTransactions`를 사용하여 한 번에 모두 서명할 수 있습니다.

```ts
const signedTransactions = await signAllTransactions(transactionArray);
```

## 트랜잭션 전송

이제 서명된 트랜잭션이 있으니 블록체인에 전송하는 방법을 살펴보겠습니다.

한 가지 방법은 다음과 같이 `RpcInterface`의 `sendTransaction`과 `confirmTransaction` 메서드를 사용하는 것입니다. 트랜잭션을 확인할 때 `blockhash` 또는 `durableNonce` 타입일 수 있는 확인 전략을 제공해야 하며, 각각 다른 매개변수 세트가 필요합니다. `blockhash` 전략을 사용하여 트랜잭션을 전송하고 확인하는 방법은 다음과 같습니다.

```ts
const signedTransaction = await builder.buildAndSign(umi)
const signature = await umi.rpc.sendTransaction(signedTransaction)
const confirmResult = await umi.rpc.confirmTransaction(signature, {
  strategy: { type: 'blockhash', ...(await umi.rpc.getLatestBlockhash()) },
})
```

이는 매우 일반적인 작업이므로 Umi는 트랜잭션 빌더에 이를 위한 헬퍼 메서드를 제공합니다. 이렇게 하면 위의 코드를 다음과 같이 다시 작성할 수 있습니다.

```ts
const confirmResult = await builder.sendAndConfirm(umi)
```

이는 기본적으로 `blockhash` 전략을 사용하여 트랜잭션을 전송하고 확인하기 전에 `buildAndSign` 메서드를 사용하여 트랜잭션을 빌드하고 서명합니다. 적용 가능한 경우 추가 Http 요청을 피하기 위해 확인 전략에 트랜잭션 블록해시를 재사용합니다. 그렇다고 해서 여전히 다음과 같이 확인 전략을 명시적으로 제공하거나 옵션을 설정할 수 있습니다.

```ts
const confirmResult = await builder.sendAndConfirm(umi, {
  // 전송 옵션
  send: {
    skipPreflight: true,
  },

  // 확인 옵션
  confirm: {
    strategy: {
      type: 'durableNonce',
      minContextSlot,
      nonceAccountPubkey,
      nonceValue,
    },
  },
})
```

또한 트랜잭션 빌더의 `send` 메서드를 통해 확인을 기다리지 않고 트랜잭션을 전송할 수 있다는 점에도 주목하세요.

```ts
const signature = await builder.send(umi)
```

## 주소 조회 테이블 사용

버전 0 트랜잭션부터 주소 조회 테이블을 사용하여 트랜잭션 크기를 줄일 수 있습니다.

```ts
const myLut: AddressLookupTableInput = {
  publicKey: publicKey('...') // 조회 테이블 계정의 주소
  addresses: [ // 조회 테이블에 등록된 주소들
    publicKey('...'),
    publicKey('...'),
    publicKey('...'),
  ]
}

builder = builder.setAddressLookupTables([myLut]);
```

주소 조회 테이블을 생성하려면 이를 생성하는 헬퍼를 제공하는 `@metaplex-foundation/mpl-toolbox` 패키지에 관심이 있을 수 있습니다.

```ts
import { createLut } from '@metaplex-foundation/mpl-toolbox'

// 조회 테이블 생성
const [lutBuilder, lut] = createLut(umi, {
  recentSlot: await umi.rpc.getSlot({ commitment: 'finalized' }),
  addresses: [myAddressA, myAddressB, myAddressC],
})
await lutBuilder.sendAndConfirm(umi)

// 나중에 생성된 조회 테이블 사용
myBuilder = myBuilder.setAddressLookupTables([lut])
```

## 트랜잭션 서명 형식 변환

### 사람이 읽을 수 있는 (base58) 트랜잭션 서명 얻기

트랜잭션을 전송할 때 반환되는 `signature`는 `Uint8Array` 타입입니다. 따라서 복사할 수 있고 예를 들어 탐색기에서 열 수 있는 문자열을 얻으려면 먼저 다음과 같이 역직렬화해야 합니다:

```ts
import { base58 } from "@metaplex-foundation/umi/serializers";
// 전송된 트랜잭션 서명을 받는 예시
const { signature } = await builder.send(umi)

// 역직렬화
const serializedSignature = base58.deserialize(signature)[0];
console.log(
        `View Transaction on Explorer: https://explorer.solana.com/tx/${serializedSignature}`
      );
```

### 사람이 읽을 수 있는 (base58) 트랜잭션 서명을 Uint8Array로 변환

경우에 따라 base58로 인코딩된 트랜잭션 서명을 가지고 있고 이를 Uint8Array로 변환하고 싶을 수 있습니다. 예를 들어 탐색기에서 트랜잭션 서명을 복사했고 umi 스크립트에서 사용하고 싶은 경우일 수 있습니다.

이는 `base58.deserialize` 메서드를 사용하여 수행할 수 있습니다.

```ts
import { base58 } from "@metaplex-foundation/umi/serializers";

const signature = "4NJhR8zm3G7hU1uhPZaBiTMBCERh4CWp2cF1x2Ly9yCvenrY6oS9hF2PAGfT26odWvb49BktkWkoBPGoXMYUVqkY";

const transaction: Uint8Array = base58.serialize(signature)
```

## 전송된 트랜잭션 가져오기

이제 블록체인에 전송된 트랜잭션을 가져오는 방법을 살펴보겠습니다.

이를 위해 `RpcInterface`의 `getTransaction` 메서드를 사용하고 가져오고 싶은 트랜잭션의 서명을 제공할 수 있습니다.

```ts
const transaction = await umi.rpc.getTransaction(signature)
```

이는 `Transaction`의 상위 집합이고 트랜잭션에 대한 추가 정보를 제공하는 추가 `meta` 속성을 포함하는 [`TransactionWithMeta`](https://umi.typedoc.metaplex.com/types/umi.TransactionWithMeta.html) 인스턴스를 반환합니다. 예를 들어, 다음과 같이 전송된 트랜잭션의 로그에 액세스할 수 있습니다.

```ts
const transaction = await umi.rpc.getTransaction(signature)
const logs: string[] = transaction.meta.logs
```
