---
title: 트랜잭션 메모
metaTitle: 메모 프로그램 | Toolbox
description: Umi와 함께 메모를 사용하는 방법.
---

SPL Memo 프로그램을 사용하면 트랜잭션에 텍스트 노트(즉, 메모)를 첨부할 수 있습니다. 이 프로그램에 대한 자세한 내용은 [Solana의 공식 문서](https://spl.solana.com/memo)에서 확인할 수 있습니다.

## 트랜잭션에 메모 추가

이 인스트럭션을 사용하면 트랜잭션에 메모를 추가할 수 있습니다.

```ts
import { transactionBuilder } from '@metaplex-foundation/umi'
import { addMemo } from '@metaplex-foundation/mpl-toolbox'

await transactionBuilder()
  .add(...) // 여기에 모든 인스트럭션들
  .add(addMemo(umi, { memo: 'Hello world!' })) // 트랜잭션에 메모 추가
  .sendAndConfirm(umi)
```
