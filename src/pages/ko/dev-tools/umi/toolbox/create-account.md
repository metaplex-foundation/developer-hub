---
title: 계정 생성
metaTitle: 계정 생성 | Toolbox
description: Umi로 계정을 생성하는 방법.
---

다음 인스트럭션은 System Program과 MPL System Extras Program의 일부입니다. System Program에 대한 자세한 내용은 [Solana의 공식 문서](https://docs.solanalabs.com/runtime/programs#system-program)에서 확인할 수 있습니다.

## 계정 생성

이 인스트럭션을 사용하면 Solana에서 새로운 초기화되지 않은 계정을 생성할 수 있습니다. 계정의 크기와 소유할 프로그램을 지정할 수 있습니다.

```ts
import { generateSigner } from '@metaplex-foundation/umi'
import { createAccount } from '@metaplex-foundation/mpl-toolbox'

const newAccount = generateSigner(umi)
const space = 42

await createAccount(umi, {
  newAccount,
  payer: umi.payer
  lamports: await umi.rpc.getRent(space),
  space,
  programId: umi.programs.get('myProgramName').publicKey,
}).sendAndConfirm(umi)
```

## 임대료가 포함된 계정 생성

이 인스트럭션을 사용하면 임대료 면제를 수동으로 가져올 필요 없이 새 계정을 생성할 수 있습니다. 프로그램 내의 `Rent` sysvar를 활용하여 제공된 `space` 속성을 기반으로 임대료 면제를 계산한 다음 계산된 임대료로 계정을 생성하기 위해 SPL System 프로그램에 CPI(Cross-Program Invocation) 호출을 수행합니다.

**장점**: 이 인스트럭션을 사용하면 클라이언트가 RPC 노드에서 임대료 면제를 가져오기 위한 추가 HTTP 요청이 필요하지 않아 프로세스가 간소화됩니다.

**제한사항**: 이 인스트럭션은 CPI 호출을 포함하므로 생성할 수 있는 최대 계정 크기는 SPL System 프로그램을 직접 사용할 때의 10MB와 비교하여 10KB로 제한됩니다.

```ts
import { generateSigner } from '@metaplex-foundation/umi'
import { createAccountWithRent } from '@metaplex-foundation/mpl-toolbox'

const newAccount = generateSigner(umi)
const space = 42

await createAccountWithRent(umi, {
  newAccount,
  payer: umi.payer,
  space,
  programId: umi.programs.get('myProgramName').publicKey,
}).sendAndConfirm(umi)
```