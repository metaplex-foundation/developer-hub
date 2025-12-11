---
title: 우선순위 수수료 및 컴퓨트 관리
metaTitle: 우선순위 수수료 및 컴퓨트 관리 | Toolbox
description: Umi와 함께 우선순위 수수료 및 컴퓨트 예산 프로그램을 사용하는 방법.
---

컴퓨트 예산 프로그램을 사용하면 사용자 정의 컴퓨트 유닛 제한과 가격을 설정할 수 있습니다. 이 프로그램에 대한 자세한 내용은 [Solana의 공식 문서](https://docs.solana.com/developing/programming-model/runtime#compute-budget)에서 확인할 수 있습니다.

## 컴퓨트 유닛 제한 설정

이 인스트럭션을 사용하면 트랜잭션에 대한 사용자 정의 컴퓨트 유닛 제한을 설정할 수 있습니다.

```ts
import { transactionBuilder } from '@metaplex-foundation/umi'
import { setComputeUnitLimit } from '@metaplex-foundation/mpl-toolbox'

await transactionBuilder()
  .add(setComputeUnitLimit(umi, { units: 600_000 })) // 컴퓨트 유닛 제한 설정
  .add(...) // 여기에 모든 인스트럭션들
  .sendAndConfirm(umi)
```

## 컴퓨트 유닛 가격 / 우선순위 수수료 설정

이 인스트럭션을 사용하면 트랜잭션에 대한 컴퓨트 유닛당 사용자 정의 가격을 설정할 수 있습니다.

```ts
import { transactionBuilder } from '@metaplex-foundation/umi'
import { setComputeUnitPrice } from '@metaplex-foundation/mpl-toolbox'

await transactionBuilder()
  .add(setComputeUnitPrice(umi, { microLamports: 1 })) // 마이크로 람포트 단위로 컴퓨트 유닛당 가격 설정
  .add(...) // 여기에 모든 인스트럭션들
  .sendAndConfirm(umi)
```

{% callout title="유닛과 마이크로람포트 계산 방법 가이드" type="note" %}
`microLamports`와 `units`에 대한 적절한 숫자를 선택할 수 있도록 계산에 사용할 수 있는 다양한 RPC 호출을 안내하는 [간단한 가이드](/umi/guides/optimal-transactions-with-compute-units-and-priority-fees)가 작성되었습니다.
{% /callout %}