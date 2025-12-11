---
title: SOL 전송
metaTitle: SOL 전송 | Toolbox
description: Umi로 SOL을 전송하는 방법.
---

다음 인스트럭션들은 System Program과 MPL System Extras Program의 일부입니다. System Program에 대한 자세한 내용은 [Solana의 공식 문서](https://docs.solanalabs.com/runtime/programs#system-program)에서 확인할 수 있습니다.

## SOL 전송

이 인스트럭션을 사용하면 한 계정에서 다른 계정으로 SOL을 전송할 수 있습니다. 전송할 SOL의 양을 **람포트** 단위(SOL의 1/1,000,000)로 지정해야 합니다.

```ts
import { sol, publicKey } from '@metaplex-foundation/umi'
import { transferSol } from '@metaplex-foundation/mpl-toolbox'

const destination = publicKey(`11111111111111111111111`)

await transferSol(umi, {
  source: umi.identity,
  destination,
  amount: sol(1.3),
}).sendAndConfirm(umi)
```

## 모든 SOL 전송

이 인스트럭션은 SPL System 프로그램의 **SOL 전송** 인스트럭션과 유사하지만 소스 계정에서 대상 계정으로 모든 SOL을 전송한다는 점이 다릅니다.

이는 여전히 계정을 사용하여 트랜잭션 비용을 지불하면서 계정의 모든 람포트를 빼내고 싶을 때 특히 유용합니다. 이 인스트럭션 없이는 계정 잔액을 수동으로 가져온 다음 예상 트랜잭션 수수료를 빼야 하는데, 특히 우선순위 수수료를 다룰 때 어려울 수 있는 과정입니다.

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { transferAllSol } from '@metaplex-foundation/mpl-toolbox'

const destination = publicKey(`11111111111111111111111`)

await transferAllSol(umi, {
  source: umi.identity,
  destination,
}).sendAndConfirm(umi)
```