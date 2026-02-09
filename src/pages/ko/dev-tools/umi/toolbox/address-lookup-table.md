---
title: 주소 조회 테이블
metaTitle: 주소 조회 테이블 | Toolbox
description: Umi와 함께 주소 조회 테이블을 사용하는 방법.
---

SPL Address Lookup Table 프로그램은 트랜잭션에서 사용하기 전에 사용자 정의 조회 테이블(**LUT** 또는 **ALT**라고도 함)을 생성하여 트랜잭션 크기를 줄이는 데 사용할 수 있습니다. 이 프로그램을 사용하면 LUT를 생성하고 확장할 수 있습니다. 이 프로그램에 대한 자세한 내용은 [Solana의 공식 문서](https://docs.solana.com/developing/lookup-tables)에서 확인할 수 있습니다.

## 빈 LUT 생성

이 인스트럭션을 사용하면 빈 주소 조회 테이블(LUT) 계정을 생성할 수 있습니다.

```ts
import { createEmptyLut } from '@metaplex-foundation/mpl-toolbox'

const recentSlot = await umi.rpc.getSlot({ commitment: 'finalized' })

await createEmptyLut(umi, {
  recentSlot,
  authority,
}).sendAndConfirm(umi)
```

## LUT 확장

이 인스트럭션을 사용하면 기존 LUT 계정에 새 주소를 추가할 수 있습니다.

```ts
import { findAddressLookupTablePda, extendLut } from '@metaplex-foundation/mpl-toolbox'

// LUT를 생성하는 데 사용된 권한과 슬롯
const lutAddress = findAddressLookupTablePda(umi, { authority, recentSlot })

await extendLut(umi, {
  authority,
  address: lutAddress, // LUT의 주소
  addresses: [addressA, addressB], // LUT에 추가할 주소들
}).sendAndConfirm(umi)
```

## 주소를 포함한 LUT 생성

이 헬퍼 메서드는 빈 LUT 생성과 주어진 주소로 확장하는 것을 단일 트랜잭션으로 결합하여 초기 주소로 LUT를 생성하는 프로세스를 단순화합니다.

```ts
import { createLut } from '@metaplex-foundation/mpl-toolbox'

const recentSlot = await umi.rpc.getSlot({ commitment: 'finalized' })

await createLut(umi, {
  authority,
  recentSlot,
  addresses: [addressA, addressB],
}).sendAndConfirm(umi)
```

## 트랜잭션 빌더용 LUT 생성

이 헬퍼 메서드는 주어진 트랜잭션 빌더를 위해 특별히 LUT를 생성하도록 설계되었습니다.

```ts
import { createLutForTransactionBuilder } from '@metaplex-foundation/mpl-toolbox'

// 1. 주어진 트랜잭션 빌더를 위한 LUT 빌더와 LUT 계정을 가져옵니다.
const recentSlot = await umi.rpc.getSlot({ commitment: 'finalized' })

const [createLutBuilders, lutAccounts] = createLutForTransactionBuilder(
  umi,
  baseBuilder,
  recentSlot
)

// 2. LUT들을 생성합니다.
for (const createLutBuilder of createLutBuilders) {
  await createLutBuilder.sendAndConfirm(umi)
}

// 3. 기본 트랜잭션 빌더에서 LUT들을 사용합니다.
await baseBuilder.setAddressLookupTables(lutAccounts).sendAndConfirm(umi)
```

## LUT 동결

이 인스트럭션을 사용하면 LUT를 동결하여 불변으로 만들 수 있습니다.

```ts
import { findAddressLookupTablePda, freezeLut } from '@metaplex-foundation/mpl-toolbox'

// LUT를 생성하는 데 사용된 권한과 슬롯
const lutAddress = findAddressLookupTablePda(umi, { authority, recentSlot })

await freezeLut(umi, {
  authority,
  address: lutAddress,
}).sendAndConfirm(umi)
```

## LUT 비활성화

이 인스트럭션은 LUT를 닫기 전에 "비활성화" 기간에 둡니다.

**참고**: LUT를 비활성화하면 새로운 트랜잭션에서 사용할 수 없지만 여전히 데이터를 유지합니다.

```ts
import { findAddressLookupTablePda, deactivateLut } from '@metaplex-foundation/mpl-toolbox'

// LUT를 생성하는 데 사용된 권한과 슬롯
const lutAddress = findAddressLookupTablePda(umi, { authority, recentSlot })

await deactivateLut(umi, {
  authority,
  address: lutAddress,
}).sendAndConfirm(umi)
```

## LUT 닫기

이 인스트럭션은 일정 기간 동안 비활성화된 후 LUT 계정을 영구적으로 닫습니다.

```ts
import { findAddressLookupTablePda, closeLut } from '@metaplex-foundation/mpl-toolbox'

// LUT를 생성하는 데 사용된 권한과 슬롯
const lutAddress = findAddressLookupTablePda(umi, { authority, recentSlot })

await closeLut(umi, {
  authority,
  address: lutAddress,
}).sendAndConfirm(umi)
```
