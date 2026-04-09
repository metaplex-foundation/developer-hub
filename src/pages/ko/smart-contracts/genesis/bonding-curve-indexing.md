---
title: 본딩 커브 — 인덱싱 및 이벤트
metaTitle: Genesis 본딩 커브 인덱싱 및 이벤트 | Metaplex
description: Genesis 본딩 커브 라이프사이클 인덱싱 방법 — GPA 검색, BondingCurveSwapEvent 디코딩, 이벤트에서 가격 추적, 계정 판별자.
updated: '04-09-2026'
keywords:
  - bonding curve
  - indexing
  - swap events
  - BondingCurveSwapEvent
  - genesis
  - GPA
  - lifecycle events
  - price tracking
  - Solana
about:
  - Bonding Curve
  - Indexing
  - Swap Events
  - Genesis
proficiencyLevel: Advanced
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: 트랜잭션에서 BondingCurveSwapEvent를 어떻게 디코딩하나요?
    a: Genesis 프로그램(GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B)에서 판별자 바이트 255를 가진 내부 명령어를 찾고, 그 첫 번째 바이트를 잘라낸 후 나머지 바이트를 getBondingCurveSwapEventSerializer().deserialize()에 전달하세요. 이벤트에는 swapDirection, quoteTokenAmount, baseTokenAmount, fee, creatorFee, 스왑 후 리저브 상태(baseTokenBalance, quoteTokenDepositTotal, virtualSol, virtualTokens)가 포함됩니다.
  - q: isSoldOut과 isGraduated의 차이는 무엇인가요?
    a: isSoldOut은 버킷의 baseTokenBalance에 대한 동기 확인으로, 모든 토큰이 구매되는 순간 true를 반환합니다. isGraduated는 Raydium CPMM 풀이 생성되고 자금이 조달되었는지 확인하는 비동기 RPC 호출입니다. 소진과 졸업 사이에 isSoldOut이 true이지만 isGraduated가 false인 구간이 있습니다.
---

폴링 없이 GPA 쿼리, 스왑별 이벤트 디코딩, 가격 및 상태 변화 추적을 통해 전체 Genesis 본딩 커브 라이프사이클을 인덱싱합니다. {% .lead %}

## 요약

Genesis 프로그램은 모든 확인된 스왑에서 내부 명령어로 `BondingCurveSwapEvent`를 발생시킵니다. 인덱서는 GPA 쿼리와 라이프사이클 명령어 추적을 결합하여 모든 거래 후 계정을 가져오지 않고도 전체 커브 상태를 재구성할 수 있습니다.

- **GPA 검색** — 프로그램 전체에서 모든 `BondingCurveBucketV2` 계정 검색
- **스왑 이벤트** — 내부 명령어의 판별자 바이트 `255`; 방향, 금액, 수수료, 스왑 후 리저브 포함
- **이벤트에서 가격 계산** — 추가 RPC 호출 없이 이벤트 데이터에서 현재 가격 파생
- **라이프사이클 추적** — 토큰 생성부터 Raydium 졸업까지 여덟 가지 고유 이벤트

**프로그램 ID:** `GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B`

## 모든 본딩 커브 검색 (GPA)

GPA 빌더를 사용하여 프로그램의 모든 `BondingCurveBucketV2` 계정을 가져옵니다 — 대시보드, 애그리게이터, 인덱서에 유용합니다. 전체 계정 필드 참조는 [고급 내부 구조](/smart-contracts/genesis/bonding-curve-internals)를 참조하세요.

```typescript {% title="discover-all-curves.ts" showLineNumbers=true %}
import { getBondingCurveBucketV2GpaBuilder } from '@metaplex-foundation/genesis';

const allCurves = await getBondingCurveBucketV2GpaBuilder(umi)
  .whereField('discriminator', /* BondingCurveBucketV2 discriminator */)
  .get();

for (const curve of allCurves) {
  console.log('Bucket PDA:         ', curve.publicKey.toString());
  console.log('Base token balance: ', curve.data.baseTokenBalance.toString());
}
```

## 스왑 이벤트 디코딩

모든 확인된 스왑은 판별자 바이트 `255`로 `BondingCurveSwapEvent`를 내부 명령어로 발생시킵니다. 트랜잭션에서 디코딩하면 정확한 스왑 후 리저브 상태, 수수료 내역, 방향을 얻을 수 있습니다.

### BondingCurveSwapEvent 필드

| 필드 | 유형 | 설명 |
|------|------|------|
| `swapDirection` | `SwapDirection` | `SwapDirection.Buy` (SOL 입력, 토큰 출력) 또는 `SwapDirection.Sell` (토큰 입력, SOL 출력) |
| `quoteTokenAmount` | `bigint` | 스왑의 SOL 금액 (매수 시 입력, 매도 시 총 출력), lamports 단위 |
| `baseTokenAmount` | `bigint` | 스왑의 토큰 금액 (매수 시 출력, 매도 시 입력) |
| `fee` | `bigint` | 부과된 프로토콜 수수료, lamports 단위 |
| `creatorFee` | `bigint` | 부과된 창작자 수수료, lamports 단위 (창작자 수수료가 구성되지 않은 경우 0) |
| `baseTokenBalance` | `bigint` | 스왑 후 `baseTokenBalance` |
| `quoteTokenDepositTotal` | `bigint` | 스왑 후 `quoteTokenDepositTotal` |
| `virtualSol` | `bigint` | 가상 SOL 리저브 (불변 — 계정 가져오기 없이 가격 계산에 유용) |
| `virtualTokens` | `bigint` | 가상 토큰 리저브 (불변 — 위와 동일) |
| `blockTime` | `bigint` | 스왑이 포함된 블록의 Unix 타임스탬프 |

### 확인된 트랜잭션에서 디코딩

```typescript {% title="decode-swap-event.ts" showLineNumbers=true %}
import { getBondingCurveSwapEventSerializer, SwapDirection } from '@metaplex-foundation/genesis';

const GENESIS_PROGRAM_ID = 'GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B';
const SWAP_EVENT_DISCRIMINATOR = 255;

async function decodeSwapEvent(signature: string) {
  const tx = await umi.rpc.getTransaction(signature, {
    commitment: 'confirmed',
  });

  if (!tx) throw new Error('Transaction not found');

  const serializer = getBondingCurveSwapEventSerializer();

  for (const innerIx of tx.meta?.innerInstructions ?? []) {
    for (const ix of innerIx.instructions) {
      const programId = tx.transaction.message.accountKeys[ix.programIdIndex];

      if (programId.toString() !== GENESIS_PROGRAM_ID) continue;

      const data = ix.data; // Uint8Array
      if (data[0] !== SWAP_EVENT_DISCRIMINATOR) continue;

      // 판별자 바이트를 잘라낸 후 역직렬화합니다.
      const [event] = serializer.deserialize(data.slice(1));

      const isBuy = event.swapDirection === SwapDirection.Buy;
      console.log('Direction:            ', isBuy ? 'buy' : 'sell');
      console.log('Quote token amount:   ', event.quoteTokenAmount.toString(), 'lamports');
      console.log('Base token amount:    ', event.baseTokenAmount.toString());
      console.log('Protocol fee:         ', event.fee.toString(), 'lamports');
      console.log('Creator fee:          ', event.creatorFee.toString(), 'lamports');
      console.log('Base balance:         ', event.baseTokenBalance.toString());
      console.log('Quote deposit total:  ', event.quoteTokenDepositTotal.toString());

      return event;
    }
  }

  return null; // 이 트랜잭션에서 스왑 이벤트를 찾지 못했습니다.
}
```

## 이벤트에서 현재 가격 추적

모든 거래 후 계정을 가져오는 대신, 각 `BondingCurveSwapEvent`에 포함된 스왑 후 리저브 상태에서 현재 가격을 파생합니다:

```typescript {% title="price-from-event.ts" showLineNumbers=true %}
function getPriceFromEvent(event: BondingCurveSwapEvent, bucket: BondingCurveBucketV2) {
  // totalTokens = virtualTokens + 스왑 후 baseTokenBalance (이벤트에 포함)
  const totalTokens = bucket.virtualTokens + event.baseTokenBalance;
  // totalSol = virtualSol + 스왑 후 quoteTokenDepositTotal (이벤트에 포함)
  const totalSol = bucket.virtualSol + event.quoteTokenDepositTotal;
  // 가격: SOL당 토큰 (bigint로 기본 토큰 단위당 lamports)
  return totalSol > 0n ? totalTokens / totalSol : 0n;
}
```

{% callout type="note" %}
`virtualSol`과 `virtualTokens`는 모든 `BondingCurveSwapEvent`에 포함되어 있습니다 — 이벤트에서 가격을 계산하기 위해 별도의 계정 가져오기가 필요하지 않습니다. 커브 생성 후에는 불변입니다.
{% /callout %}

## 라이프사이클 이벤트

Genesis 프로그램 명령어 및 내부 명령어 이벤트를 수신하여 본딩 커브의 전체 라이프사이클을 추적합니다. SDK를 사용하여 스왑 트랜잭션을 실행하는 방법은 [본딩 커브 스왑 통합](/smart-contracts/genesis/bonding-curve-swaps)을 참조하세요.

| 이벤트 | 설명 | 주요 필드 |
|--------|------|-----------|
| 토큰 생성 | SPL 토큰 민팅, genesis 계정 초기화 | `baseMint`, `genesisAccount` |
| 본딩 커브 추가 | `BondingCurveBucketV2` 계정 생성 | `bucketPda`, `baseTokenAllocation`, `virtualSol`, `virtualTokens` |
| 완료 | 런칭 구성 잠금, 버킷 활성화 | `genesisAccount` |
| 라이브 시작 | `swapStartCondition` 충족, 거래 시작 | `bucketPda`, 타임스탬프 |
| 스왑 | 매수 또는 매도 실행 | `BondingCurveSwapEvent` (판별자 `255`) |
| 소진 | `baseTokenBalance === 0` | `bucketPda`, `quoteTokenDepositTotal` |
| 졸업 크랭크 | 유동성 마이그레이션 명령어 제출 | `bucketPda`, `raydiumCpmmPool` |
| 졸업 | Raydium CPMM 풀 자금 조달, 본딩 커브 종료 | `cpmmPoolPda`, 누적 SOL |

## 계정 판별자 및 PDA 파생

### 판별자

| 계정 | 판별자 | 설명 |
|------|--------|------|
| `GenesisAccountV2` | 계정 유형별 고유 | 마스터 조정 계정 |
| `BondingCurveBucketV2` | 계정 유형별 고유 | 본딩 커브 AMM 상태 |
| `BondingCurveSwapEvent` | `255` (내부 명령어) | 프로그램에서 발생하는 스왑별 이벤트 |

### PDA 시드

| PDA | 시드 |
|-----|------|
| `GenesisAccountV2` | `["genesis_account_v2", baseMint, genesisIndex (u8)]` |
| `BondingCurveBucketV2` | `["bonding_curve_bucket_v2", genesisAccount, bucketIndex (u8)]` |

Genesis SDK에서 `findGenesisAccountV2Pda`와 `findBondingCurveBucketV2Pda`를 사용하여 TypeScript에서 PDA를 파생하세요.

## 참고 사항

- `virtualSol`과 `virtualTokens`는 모든 `BondingCurveSwapEvent`에 포함되어 있습니다 — 이벤트에서 가격을 계산하기 위해 별도의 계정 가져오기가 필요하지 않습니다; 커브 생성 후에는 불변입니다
- `BondingCurveSwapEvent` 판별자는 항상 바이트 `255`입니다 — 이 선행 바이트를 가진 Genesis 프로그램의 모든 내부 명령어는 스왑 이벤트입니다
- `isSoldOut`이 `true`를 반환하고 `isGraduated`가 `true`를 반환하기 전 사이에, 커브는 소진되었지만 Raydium CPMM 풀에 아직 자금이 조달되지 않았습니다; `isGraduated`가 풀 존재를 확인할 때까지 사용자를 Raydium으로 리다이렉트하지 마세요
- `isGraduated`는 매번 호출 시 RPC 호출을 수행합니다 — 모든 렌더링에서 호출하는 대신 인덱서에서 결과를 캐시하세요

## FAQ

### BondingCurveSwapEvent를 어떻게 디코딩하나요?
Genesis 프로그램(`GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B`)에서 첫 번째 데이터 바이트가 `255`인 내부 명령어를 찾으세요. 그 바이트를 잘라내고 나머지를 `getBondingCurveSwapEventSerializer().deserialize(data.slice(1))`에 전달하세요. 반환된 객체에는 `swapDirection`, `quoteTokenAmount`, `baseTokenAmount`, `fee`, `creatorFee`, 스왑 후 리저브 상태(`baseTokenBalance`, `quoteTokenDepositTotal`, `virtualSol`, `virtualTokens`, `blockTime`)가 포함됩니다.

### isSoldOut과 isGraduated의 차이는 무엇인가요?
`isSoldOut`은 동기 로컬 확인입니다 — `baseTokenBalance`가 `0n`이 되는 즉시 `true`를 반환합니다. `isGraduated`는 Raydium CPMM 풀이 온체인에서 생성되고 자금이 조달되었는지 확인하는 비동기 RPC 호출입니다. 소진과 졸업 사이에 `isSoldOut`이 `true`이지만 `isGraduated`가 `false`인 구간이 있습니다. `isGraduated`가 풀 존재를 확인할 때까지 사용자를 Raydium으로 리다이렉트하지 마세요.
