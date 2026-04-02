---
title: 본딩 커브 V2 스왑 통합
metaTitle: Genesis 본딩 커브 V2 스왑 통합 | Metaplex
description: Genesis SDK를 사용하여 본딩 커브 상태 읽기, 스왑 견적 계산, 매수 및 매도 트랜잭션 실행, 슬리피지 처리, 스왑 이벤트 디코딩, 라이프사이클 이벤트 인덱싱하는 방법을 설명합니다.
keywords:
  - bonding curve
  - swap
  - genesis
  - SOL
  - token launch
  - getSwapResult
  - swapBondingCurveV2
  - isSwappable
  - slippage
  - swap events
  - indexing
  - Raydium CPMM
  - graduation
about:
  - Bonding Curve
  - Token Swap
  - Genesis
  - Solana
programmingLanguage:
  - JavaScript
  - TypeScript
proficiencyLevel: Intermediate
created: '03-30-2026'
updated: '03-30-2026'
howToSteps:
  - Genesis SDK를 설치하고 Umi 인스턴스를 구성합니다
  - findBondingCurveBucketV2Pda를 사용하여 BondingCurveBucketV2 계정을 가져옵니다
  - isSwappable을 확인하여 커브가 활성 상태인지 검증합니다
  - getSwapResult를 호출하여 수수료가 포함된 견적을 가져옵니다
  - applySlippage로 슬리피지를 적용하여 minAmountOut을 계산합니다
  - swapBondingCurveV2로 스왑을 전송하고 온체인에서 확인합니다
howToTools:
  - Node.js
  - Umi framework
  - Genesis SDK
faqs:
  - q: isSwappable과 isSoldOut의 차이는 무엇인가요?
    a: isSwappable은 커브가 공개 거래를 활발히 수락하고 있을 때 true를 반환합니다 — 시작 조건이 충족되고, 종료 조건이 아직 발동되지 않았으며, 첫 번째 구매(설정된 경우)가 완료되었고, 토큰이 남아 있을 때입니다. isSoldOut은 baseTokenBalance가 0이 되는 순간 true를 반환하며, 거래가 종료되고 졸업 처리가 시작됩니다. 커브는 소진되었지만 아직 졸업하지 않은 상태일 수 있습니다.
  - q: swapBondingCurveV2를 호출하기 전에 SOL을 래핑해야 하나요?
    a: 네. 본딩 커브는 래핑된 SOL(wSOL)을 견적 토큰으로 사용합니다. swapBondingCurveV2 명령어는 SOL을 자동으로 래핑하거나 언래핑하지 않습니다. 매수의 경우, wSOL ATA를 생성하고 네이티브 SOL을 전송한 후 스왑 전에 syncNative를 호출하세요. 매도의 경우, 스왑 후 wSOL ATA를 닫아 네이티브 SOL로 다시 언래핑하세요.
  - q: getSwapResult는 무엇을 반환하며 수수료를 어떻게 처리하나요?
    a: getSwapResult는 amountIn(사용자가 실제로 지불하는 금액), fee(부과된 총 수수료), amountOut(사용자가 받는 금액)을 반환합니다. 매수의 경우, AMM이 실행되기 전에 SOL 입력에서 수수료가 공제됩니다. 매도의 경우, AMM이 실행된 후 SOL 출력에서 수수료가 공제됩니다. 첫 번째 구매 수수료 면제 견적을 위해 네 번째 인수로 true를 전달하세요.
  - q: 슬리피지로부터 어떻게 보호하나요?
    a: applySlippage(quote.amountOut, slippageBps)를 사용하여 minAmountOut을 계산한 후 swapBondingCurveV2에 전달하세요. 온체인 프로그램은 실제 출력이 minAmountOut 미만으로 떨어지면 트랜잭션을 거부합니다. 일반적인 값은 안정적인 조건에서 50 bps(0.5%), 변동성이 높은 런칭에서 200 bps(2%)입니다.
  - q: isSoldOut과 isGraduated의 차이는 무엇인가요?
    a: isSoldOut은 버킷의 baseTokenBalance에 대한 동기 확인으로, 모든 토큰이 구매되는 즉시 true를 반환합니다. isGraduated는 Raydium CPMM 풀이 생성되고 자금이 조달되었는지 확인하는 비동기 RPC 호출입니다. 소진과 졸업 사이에 isSoldOut이 true이지만 isGraduated가 false인 구간이 있습니다.
  - q: 트랜잭션에서 BondingCurveSwapEvent를 어떻게 디코딩하나요?
    a: Genesis 프로그램(GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B)에서 판별자 바이트 255를 가진 내부 명령어를 찾고, 그 첫 번째 바이트를 잘라낸 후 나머지 바이트를 getBondingCurveSwapEventSerializer().deserialize()에 전달하세요. 이벤트에는 방향, 금액, 수수료, 스왑 후 예비 상태가 포함됩니다.
---

Genesis SDK를 사용하여 [본딩 커브 V2](/smart-contracts/genesis/bonding-curve-v2) 상태를 읽고, 스왑 견적을 계산하고, 온체인에서 매수 및 매도 트랜잭션을 실행하고, 슬리피지를 처리하고, 스왑 이벤트를 디코딩하고, 본딩 커브 런칭의 전체 라이프사이클을 인덱싱하세요. {% .lead %}

{% callout title="빌드할 내용" %}
이 가이드는 다음을 다룹니다:
- `BondingCurveBucketV2` 계정 상태 가져오기 및 해석
- `isSwappable`, `isSoldOut`, `isGraduated`를 사용한 라이프사이클 상태 확인
- `getSwapResult`를 사용한 정확한 스왑 견적 계산
- `applySlippage`로 사용자 보호
- `swapBondingCurveV2`를 사용한 매수 및 매도 트랜잭션 구성
- 확인된 트랜잭션에서 `BondingCurveSwapEvent` 디코딩
- 온체인 라이프사이클 이벤트 인덱싱
{% /callout %}

## 요약

본딩 커브 V2 스왑은 Genesis SDK를 사용하여 `BondingCurveBucketV2` 온체인 계정과 상호작용합니다 — SOL을 받아 토큰을 반환하거나(매수), 토큰을 받아 SOL을 반환하는(매도) 상수 곱 AMM입니다. 기본 가격 산정 수학에 대해서는 [본딩 커브 V2 — 작동 원리](/smart-contracts/genesis/bonding-curve-v2)를 참조하세요.

- **전송 전 견적 계산** — `getSwapResult`를 호출하여 수수료가 조정된 정확한 입출력 금액을 확인하세요
- **슬리피지 보호** — `applySlippage`로 `minAmountOut`을 계산하여 명령어에 전달하세요
- **wSOL은 수동 처리** — 스왑 명령어는 네이티브 SOL을 자동으로 래핑하거나 언래핑하지 않으므로, 호출자가 wSOL [관련 토큰 계정(ATA)](https://spl.solana.com/associated-token-account)을 직접 처리해야 합니다
- **프로그램 ID** — Solana 메인넷의 `GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B`

*Metaplex Foundation 관리 · 2026년 3월 마지막 검증 · `@metaplex-foundation/genesis` 1.x 적용*

## 빠른 시작

**이동:** [설치](#installation) · [설정](#umi-and-genesis-plugin-setup) · [커브 가져오기](#fetching-a-bonding-curve-bucketv2) · [라이프사이클 헬퍼](#bonding-curve-lifecycle-helpers) · [견적](#getting-a-swap-quote) · [슬리피지](#slippage-protection) · [스왑 실행](#constructing-swap-transactions) · [이벤트](#reading-swap-events) · [인덱싱](#indexing-lifecycle-events) · [오류](#error-handling) · [API 참조](#api-reference)

1. 패키지를 설치하고 `genesis()` 플러그인으로 Umi 인스턴스를 구성하세요
2. `BondingCurveBucketV2Pda`를 유도하고 계정을 가져오세요
3. `isSwappable(bucket)`을 확인하세요 — false이면 중단하세요
4. `getSwapResult(bucket, amountIn, 'buy')`를 호출하여 수수료 조정 견적을 구하세요
5. `applySlippage(quote.amountOut, slippageBps)`를 적용하여 `minAmountOut`을 계산하세요
6. wSOL 래핑을 수동으로 처리한 후 `swapBondingCurveV2`를 전송하고 확인하세요

## 사전 요구 사항

- **Node.js 18+** — 네이티브 BigInt 지원에 필요
- SOL로 자금이 충전된 **Solana 지갑** (트랜잭션 수수료 및 스왑 입력용)
- Solana RPC 엔드포인트 (메인넷-베타 또는 데브넷)
- [Umi 프레임워크](https://github.com/metaplex-foundation/umi) 및 async/await 패턴에 대한 이해

## 테스트된 구성

| 도구 | 버전 |
|------|---------|
| `@metaplex-foundation/genesis` | 1.x |
| `@metaplex-foundation/umi` | 1.x |
| `@metaplex-foundation/umi-bundle-defaults` | 1.x |
| Node.js | 18+ |

## 설치

단일 명령으로 필요한 세 가지 패키지를 설치하세요.

```bash {% title="Terminal" %}
npm install @metaplex-foundation/genesis \
  @metaplex-foundation/umi \
  @metaplex-foundation/umi-bundle-defaults
```

## Umi 및 Genesis 플러그인 설정

SDK 함수를 호출하기 전에 Umi 인스턴스를 구성하고 `genesis()` 플러그인을 등록하세요.

```typescript {% title="setup.ts" showLineNumbers=true %}
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { genesis } from '@metaplex-foundation/genesis';
import { keypairIdentity } from '@metaplex-foundation/umi';
import { readFileSync } from 'fs';

// Load your wallet keypair from a local file.
const keypairFile = JSON.parse(readFileSync('/path/to/keypair.json', 'utf-8'));

const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(genesis());

const keypair = umi.eddsa.createKeypairFromSecretKey(Uint8Array.from(keypairFile));
umi.use(keypairIdentity(keypair));
```

## 본딩 커브 BucketV2 가져오기

이미 알고 있는 정보에 따라 세 가지 검색 전략을 사용할 수 있습니다.

### 알려진 Genesis 계정에서 가져오기

본딩 커브를 직접 생성했고 genesis 계정 주소를 이미 알고 있는 경우 사용하세요.

```typescript {% title="fetch-from-genesis.ts" showLineNumbers=true %}
import {
  findBondingCurveBucketV2Pda,
  fetchBondingCurveBucketV2,
} from '@metaplex-foundation/genesis';
import { publicKey } from '@metaplex-foundation/umi';

const genesisAccount = publicKey('YOUR_GENESIS_ACCOUNT_PUBKEY');

// Derive the bonding curve PDA (bucket index 0 for the primary curve).
const [bucketPda] = findBondingCurveBucketV2Pda(umi, {
  genesisAccount,
  bucketIndex: 0,
});

const bucket = await fetchBondingCurveBucketV2(umi, bucketPda);
```

### 토큰 민트에서 가져오기

토큰 민트 주소만 있는 경우 사용하세요 — 사용자 입력이나 API에서 민트를 받는 통합에서 일반적입니다.

```typescript {% title="fetch-from-mint.ts" showLineNumbers=true %}
import {
  findGenesisAccountV2Pda,
  findBondingCurveBucketV2Pda,
  fetchBondingCurveBucketV2,
} from '@metaplex-foundation/genesis';
import { publicKey } from '@metaplex-foundation/umi';

const baseMint = publicKey('TOKEN_MINT_PUBKEY');

// Step 1: derive the genesis account from the mint.
const [genesisAccount] = findGenesisAccountV2Pda(umi, {
  baseMint,
  genesisIndex: 0,
});

// Step 2: derive the bonding curve bucket from the genesis account.
const [bucketPda] = findBondingCurveBucketV2Pda(umi, {
  genesisAccount,
  bucketIndex: 0,
});

const bucket = await fetchBondingCurveBucketV2(umi, bucketPda);
```

### 모든 본딩 커브 검색 (GPA)

GPA 빌더를 사용하여 프로그램의 모든 `BondingCurveBucketV2` 계정을 조회하세요 — 인덱서와 대시보드에 유용합니다.

```typescript {% title="discover-all-curves.ts" showLineNumbers=true %}
import { getBondingCurveBucketV2GpaBuilder } from '@metaplex-foundation/genesis';

const allCurves = await getBondingCurveBucketV2GpaBuilder(umi)
  .whereField('discriminator', /* BondingCurveBucketV2 discriminator */)
  .get();

for (const curve of allCurves) {
  console.log('Bucket PDA:', curve.publicKey.toString());
  console.log('Base token balance:', curve.data.baseTokenBalance.toString());
}
```

## 본딩 커브 BucketV2 상태 읽기

`BondingCurveBucketV2` 계정에는 견적 계산, 라이프사이클 상태 확인, 시장 데이터 표시에 필요한 모든 필드가 포함되어 있습니다.

| 필드 | 타입 | 설명 |
|-------|------|-------------|
| `baseTokenBalance` | `bigint` | 커브에 남은 토큰. 0은 소진됨을 의미합니다. |
| `baseTokenAllocation` | `bigint` | 생성 시 이 커브에 할당된 총 토큰. |
| `quoteTokenDepositTotal` | `bigint` | 매수자가 실제 입금한 SOL (lamports). 0부터 시작. |
| `virtualSol` | `bigint` | 초기화 시 추가된 가상 SOL 예비금 (가격 산정 전용). |
| `virtualTokens` | `bigint` | 초기화 시 추가된 가상 토큰 예비금 (가격 산정 전용). |
| `depositFee` | `number` | 모든 스왑의 SOL 측에 적용되는 프로토콜 수수료율. |
| `withdrawFee` | `number` | 모든 스왑의 SOL 측에 적용되는 창작자 수수료율. |
| `swapStartCondition` | `object` | 거래가 허용되기 전에 충족되어야 하는 조건. |
| `swapEndCondition` | `object` | 발동 시 거래를 종료하는 조건. |

{% callout type="note" %}
`virtualSol`과 `virtualTokens`는 가격 산정 수학에만 존재합니다 — 실제 자산으로 온체인에 입금되지 않습니다. 가상 예비금이 상수 곱 커브를 형성하는 방법은 [본딩 커브 V2 — 작동 원리](/smart-contracts/genesis/bonding-curve-v2#why-bonding-curves-require-virtual-reserves)를 참조하세요.
{% /callout %}

현재 프로토콜 수수료율은 [프로토콜 수수료](/protocol-fees) 페이지를 참조하세요.

## 본딩 커브 라이프사이클 헬퍼

Genesis SDK의 다섯 가지 헬퍼 함수는 추가 RPC 호출 없이 커브 상태를 검사합니다 (`isGraduated` 제외).

### isSwappable

`isSwappable(bucket)`은 커브가 공개 스왑을 활발히 수락하고 있을 때 `true`를 반환합니다 — 시작 조건이 충족되고, 종료 조건이 발동되지 않았으며, 첫 번째 구매(설정된 경우)가 완료되었고, 토큰이 남아 있습니다. **견적 계산이나 스왑 전송 전에 항상 이를 확인하세요.**

```typescript {% title="lifecycle-helpers.ts" showLineNumbers=true %}
import {
  isSwappable,
  isFirstBuyPending,
  isSoldOut,
  getFillPercentage,
  isGraduated,
} from '@metaplex-foundation/genesis';

// Returns true only when the curve actively accepts public swaps.
const canSwap = isSwappable(bucket);

// Returns true when a first-buy is configured but not yet executed.
// While true, only the designated buyer can trade.
const firstBuyPending = isFirstBuyPending(bucket);

// Returns true when baseTokenBalance === 0.
// This triggers graduation processing.
const soldOut = isSoldOut(bucket);

// Returns a number 0–100 representing how much of the allocation has been sold.
const fillPercent = getFillPercentage(bucket);
console.log(`Curve is ${fillPercent.toFixed(1)}% filled`);

// Async — makes an RPC call to check if the Raydium CPMM pool exists onchain.
const graduated = await isGraduated(umi, bucket);
```

### 라이프사이클 헬퍼 빠른 참조

| 헬퍼 | 비동기 | 반환값 | 설명 |
|--------|-------|---------|-------------|
| `isSwappable(bucket)` | 아니오 | `boolean` | 공개 거래를 수락 중일 때 `true` |
| `isFirstBuyPending(bucket)` | 아니오 | `boolean` | 지정된 첫 번째 구매가 아직 완료되지 않았을 때 `true` |
| `isSoldOut(bucket)` | 아니오 | `boolean` | `baseTokenBalance === 0n`일 때 `true` |
| `getFillPercentage(bucket)` | 아니오 | `number` | 판매된 할당량의 0–100 백분율 |
| `isGraduated(umi, bucket)` | 예 | `boolean` | Raydium CPMM 풀이 온체인에 존재할 때 `true` |

## 스왑 견적 계산

`getSwapResult(bucket, amountIn, direction, isFirstBuy?)`는 트랜잭션 전송 없이 스왑에 대한 정확한 수수료 조정 금액을 계산합니다.

이 함수는 다음을 반환합니다:
- `amountIn` — 조정 후 실제 입력 금액
- `fee` — 부과된 총 수수료 (프로토콜 + 창작자), 매수는 lamports, 매도는 기본 토큰
- `amountOut` — 받는 토큰(매수) 또는 받는 SOL(매도)

### 매수 견적 (SOL → 토큰)

```typescript {% title="buy-quote.ts" showLineNumbers=true %}
import { getSwapResult } from '@metaplex-foundation/genesis';

const SOL_IN = 1_000_000_000n; // 1 SOL in lamports

const buyQuote = getSwapResult(bucket, SOL_IN, 'buy');

console.log('SOL input:    ', buyQuote.amountIn.toString(), 'lamports');
console.log('Total fee:    ', buyQuote.fee.toString(), 'lamports');
console.log('Tokens out:   ', buyQuote.amountOut.toString());
```

### 매도 견적 (토큰 → SOL)

```typescript {% title="sell-quote.ts" showLineNumbers=true %}
import { getSwapResult } from '@metaplex-foundation/genesis';

const TOKENS_IN = 500_000_000_000n; // 500 tokens (9 decimals)

const sellQuote = getSwapResult(bucket, TOKENS_IN, 'sell');

console.log('Tokens input: ', sellQuote.amountIn.toString());
console.log('Total fee:    ', sellQuote.fee.toString(), 'lamports');
console.log('SOL out:      ', sellQuote.amountOut.toString(), 'lamports');
```

### 첫 번째 구매 수수료 면제

지정된 구매자가 일회성 수수료 면제 구매를 실행하는 온체인 동작을 반영하여, 수수료가 면제된 첫 번째 구매를 견적하려면 네 번째 인수로 `true`를 전달하세요.

```typescript {% title="first-buy-quote.ts" showLineNumbers=true %}
import { getSwapResult } from '@metaplex-foundation/genesis';

const SOL_IN = 2_000_000_000n; // 2 SOL in lamports

// Pass `true` to simulate zero-fee first buy.
const firstBuyQuote = getSwapResult(bucket, SOL_IN, 'buy', true);

console.log('Fee (waived): ', firstBuyQuote.fee.toString()); // 0n
console.log('Tokens out:   ', firstBuyQuote.amountOut.toString());
```

### 현재 가격 헬퍼

세 가지 헬퍼는 전체 스왑 견적을 계산하지 않고 현재 가격을 노출합니다.

```typescript {% title="current-price.ts" showLineNumbers=true %}
import {
  getCurrentPrice,
  getCurrentPriceQuotePerBase,
  getCurrentPriceComponents,
} from '@metaplex-foundation/genesis';

// Price as tokens per SOL (tokens you receive for 1 SOL).
const tokensPerSol = getCurrentPrice(bucket);

// Price as SOL per token (lamports you pay for 1 base unit).
const lamportsPerToken = getCurrentPriceQuotePerBase(bucket);

// Low-level components: effective totalSol, totalTokens, and k invariant.
const { totalSol, totalTokens, k } = getCurrentPriceComponents(bucket);
```

## 슬리피지 보호

`applySlippage(expectedAmountOut, slippageBps)`는 슬리피지 허용 오차만큼 예상 출력을 줄여 `minAmountOut`을 계산합니다. 스왑 명령어에 `minAmountOut`을 전달하면 — 실제 출력이 이 임계값 미만으로 떨어질 경우 온체인 프로그램이 트랜잭션을 거부합니다.

```typescript {% title="slippage.ts" showLineNumbers=true %}
import { getSwapResult, applySlippage } from '@metaplex-foundation/genesis';

const SOL_IN = 1_000_000_000n; // 1 SOL

const quote = getSwapResult(bucket, SOL_IN, 'buy');

// 100 bps = 1.0% slippage tolerance.
// Use 50 bps (0.5%) for stable conditions; 200 bps (2%) for volatile launches.
const SLIPPAGE_BPS = 100;

const minAmountOut = applySlippage(quote.amountOut, SLIPPAGE_BPS);

console.log('Expected out: ', quote.amountOut.toString());
console.log('Min accepted: ', minAmountOut.toString());
```

{% callout type="warning" %}
`applySlippage`에서 계산된 `minAmountOut` 없이 스왑을 전송하지 마세요. 본딩 커브 가격은 거래마다 변동합니다. 슬리피지 보호 없이는 사용자의 견적과 확인 사이에 다른 거래가 체결되면 견적보다 훨씬 적은 토큰을 받을 수 있습니다.
{% /callout %}

## 스왑 트랜잭션 구성

`swapBondingCurveV2(umi, accounts)`는 스왑 명령어를 빌드합니다. 호출자는 트랜잭션 전후로 래핑된 SOL(wSOL)을 처리할 책임이 있습니다 — 아래 [wSOL 래핑 참고 사항](#wsol-wrapping-note)을 참조하세요.

### 매수 트랜잭션 (SOL → 토큰)

```typescript {% title="swap-buy.ts" showLineNumbers=true %}
import {
  getSwapResult,
  applySlippage,
  swapBondingCurveV2,
  findBondingCurveBucketV2Pda,
} from '@metaplex-foundation/genesis';
import {
  findAssociatedTokenPda,
  createAssociatedTokenAccountInstruction,
} from '@metaplex-foundation/mpl-toolbox';
import { publicKey, sol, transactionBuilder } from '@metaplex-foundation/umi';

const genesisAccount = publicKey('YOUR_GENESIS_ACCOUNT_PUBKEY');
const baseMint = publicKey('TOKEN_MINT_PUBKEY');
const quoteMint = publicKey('So11111111111111111111111111111111111111112'); // wSOL

const [bucketPda] = findBondingCurveBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 });
const bucket = await fetchBondingCurveBucketV2(umi, bucketPda);

if (!isSwappable(bucket)) {
  throw new Error('Curve is not currently accepting swaps');
}

const SOL_IN = 1_000_000_000n; // 1 SOL in lamports
const quote = getSwapResult(bucket, SOL_IN, 'buy');
const minAmountOut = applySlippage(quote.amountOut, 100); // 1% slippage

// Derive the user's token ATAs.
const [userBaseTokenAccount] = findAssociatedTokenPda(umi, {
  mint: baseMint,
  owner: umi.identity.publicKey,
});
const [userQuoteTokenAccount] = findAssociatedTokenPda(umi, {
  mint: quoteMint,
  owner: umi.identity.publicKey,
});

// NOTE: You must fund the wSOL ATA with SOL_IN lamports before this call.
// See the wSOL Wrapping Note section below.
const tx = swapBondingCurveV2(umi, {
  genesisAccount,
  bucketPda,
  baseMint,
  quoteMint,
  userBaseTokenAccount,
  userQuoteTokenAccount,
  amountIn: quote.amountIn,
  minAmountOut,
  direction: 'buy',
});

const result = await tx.sendAndConfirm(umi);
console.log('Buy confirmed:', result.signature);
```

### 매도 트랜잭션 (토큰 → SOL)

```typescript {% title="swap-sell.ts" showLineNumbers=true %}
import {
  getSwapResult,
  applySlippage,
  swapBondingCurveV2,
  fetchBondingCurveBucketV2,
  findBondingCurveBucketV2Pda,
  isSwappable,
} from '@metaplex-foundation/genesis';
import { findAssociatedTokenPda } from '@metaplex-foundation/mpl-toolbox';
import { publicKey } from '@metaplex-foundation/umi';

const genesisAccount = publicKey('YOUR_GENESIS_ACCOUNT_PUBKEY');
const baseMint = publicKey('TOKEN_MINT_PUBKEY');
const quoteMint = publicKey('So11111111111111111111111111111111111111112'); // wSOL

const [bucketPda] = findBondingCurveBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 });
const bucket = await fetchBondingCurveBucketV2(umi, bucketPda);

if (!isSwappable(bucket)) {
  throw new Error('Curve is not currently accepting swaps');
}

const TOKENS_IN = 500_000_000_000n; // 500 tokens (9 decimals)
const quote = getSwapResult(bucket, TOKENS_IN, 'sell');
const minAmountOut = applySlippage(quote.amountOut, 100); // 1% slippage

const [userBaseTokenAccount] = findAssociatedTokenPda(umi, {
  mint: baseMint,
  owner: umi.identity.publicKey,
});
const [userQuoteTokenAccount] = findAssociatedTokenPda(umi, {
  mint: quoteMint,
  owner: umi.identity.publicKey,
});

const tx = swapBondingCurveV2(umi, {
  genesisAccount,
  bucketPda,
  baseMint,
  quoteMint,
  userBaseTokenAccount,
  userQuoteTokenAccount,
  amountIn: quote.amountIn,
  minAmountOut,
  direction: 'sell',
});

const result = await tx.sendAndConfirm(umi);
// NOTE: After a sell, close the wSOL ATA to unwrap back to native SOL.
// See the wSOL Wrapping Note section below.
console.log('Sell confirmed:', result.signature);
```

### wSOL 래핑 참고 사항

{% callout type="warning" title="수동 wSOL 처리 필요" %}
`swapBondingCurveV2` 명령어는 래핑된 SOL(wSOL)을 견적 토큰으로 사용합니다. 네이티브 SOL을 **자동으로** 래핑하거나 언래핑하지 않습니다.

**매수의 경우:** 스왑 전송 전에 wSOL [관련 토큰 계정(ATA)](https://spl.solana.com/associated-token-account)을 생성하고, 필요한 lamports를 입금한 후 `syncNative`를 호출하여 계정 잔액을 동기화하세요.

**매도의 경우:** 스왑이 확인된 후 `closeAccount`로 wSOL ATA를 닫아 사용자 지갑의 네이티브 SOL로 wSOL을 언래핑하세요.

USDC는 견적 토큰으로 아직 지원되지 않습니다. 현재 버전에서는 wSOL만 견적 토큰으로 허용됩니다.
{% /callout %}

```typescript {% title="wsol-wrap-unwrap.ts" showLineNumbers=true %}
import {
  findAssociatedTokenPda,
  createAssociatedTokenAccountIdempotentInstruction,
  syncNative,
  closeToken,
} from '@metaplex-foundation/mpl-toolbox';
import { transactionBuilder, sol } from '@metaplex-foundation/umi';
import { NATIVE_MINT } from '@solana/spl-token';
import { publicKey } from '@metaplex-foundation/umi';

const wSOL = publicKey('So11111111111111111111111111111111111111112');
const [wSolAta] = findAssociatedTokenPda(umi, {
  mint: wSOL,
  owner: umi.identity.publicKey,
});

// --- Wrap SOL before a buy ---
const SOL_AMOUNT = sol(1); // 1 SOL

const wrapBuilder = transactionBuilder()
  .add(createAssociatedTokenAccountIdempotentInstruction(umi, {
    mint: wSOL,
    owner: umi.identity.publicKey,
  }))
  // Transfer native SOL into the wSOL ATA.
  .add({
    instruction: {
      programId: publicKey('11111111111111111111111111111111'), // System Program
      keys: [
        { pubkey: umi.identity.publicKey, isSigner: true, isWritable: true },
        { pubkey: wSolAta, isSigner: false, isWritable: true },
      ],
      data: /* SystemProgram.transfer encode */ new Uint8Array(),
    },
    signers: [umi.identity],
    bytesCreatedOnChain: 0,
  })
  // Sync the ATA balance to reflect the deposited lamports.
  .add(syncNative(umi, { account: wSolAta }));

await wrapBuilder.sendAndConfirm(umi);

// --- Unwrap SOL after a sell ---
const unwrapBuilder = closeToken(umi, {
  account: wSolAta,
  destination: umi.identity.publicKey,
  authority: umi.identity,
});

await unwrapBuilder.sendAndConfirm(umi);
```

{% callout type="note" %}
프로덕션에서는 래핑에 `@solana/spl-token` 헬퍼 `createWrappedNativeAccount`를 사용하거나, 래핑, 스왑, 언래핑을 원자적으로 처리하는 단일 트랜잭션을 사용하여 라운드트립을 최소화하는 것을 권장합니다.
{% /callout %}

## 스왑 이벤트 읽기

모든 확인된 스왑은 판별자 바이트 `255`를 가진 내부 명령어로 `BondingCurveSwapEvent`를 발행합니다. 트랜잭션에서 이를 디코딩하면 정확한 스왑 후 예비 상태, 수수료 내역, 방향을 확인할 수 있습니다.

### BondingCurveSwapEvent 필드

| 필드 | 타입 | 설명 |
|-------|------|-------------|
| `direction` | `'buy' \| 'sell'` | 거래 방향 |
| `amountIn` | `bigint` | 실제 입력 금액 (매수는 lamports, 매도는 기본 토큰) |
| `amountOut` | `bigint` | 받은 출력 금액 |
| `fee` | `bigint` | lamports로 부과된 총 수수료 |
| `baseTokenBalanceAfter` | `bigint` | 스왑 후 `baseTokenBalance` |
| `quoteTokenDepositTotalAfter` | `bigint` | 스왑 후 `quoteTokenDepositTotal` |

### 확인된 트랜잭션에서 스왑 이벤트 디코딩

```typescript {% title="decode-swap-event.ts" showLineNumbers=true %}
import {
  getBondingCurveSwapEventSerializer,
} from '@metaplex-foundation/genesis';
import { publicKey } from '@metaplex-foundation/umi';

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

      // Slice off the discriminator byte, then deserialize.
      const eventBytes = data.slice(1);
      const [event] = serializer.deserialize(eventBytes);

      console.log('Direction:            ', event.direction);
      console.log('Amount in:            ', event.amountIn.toString());
      console.log('Amount out:           ', event.amountOut.toString());
      console.log('Fee:                  ', event.fee.toString());
      console.log('Base balance after:   ', event.baseTokenBalanceAfter.toString());
      console.log('Quote deposit after:  ', event.quoteTokenDepositTotalAfter.toString());

      return event;
    }
  }

  return null; // No swap event found in this transaction.
}
```

## 라이프사이클 이벤트 인덱싱

인덱서는 Genesis 프로그램 명령어와 내부 명령어 이벤트를 수신하여 본딩 커브의 전체 라이프사이클을 추적할 수 있습니다.

**프로그램 ID:** `GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B`

### 라이프사이클 이벤트

| 이벤트 | 설명 | 주요 필드 |
|-------|-------------|------------|
| Token Created | SPL 토큰 발행, genesis 계정 초기화 | `baseMint`, `genesisAccount` |
| Bonding Curve Added | `BondingCurveBucketV2` 계정 생성 | `bucketPda`, `baseTokenAllocation`, `virtualSol`, `virtualTokens` |
| Finalized | 런칭 구성 잠금, 버킷 활성화 | `genesisAccount` |
| Goes Live | `swapStartCondition` 충족, 거래 개시 | `bucketPda`, timestamp |
| Swap | 매수 또는 매도 실행 | `BondingCurveSwapEvent` (판별자 255) |
| Sold Out | `baseTokenBalance === 0` | `bucketPda`, `quoteTokenDepositTotal` |
| Graduation Crank | 유동성 마이그레이션 명령어 제출 | `bucketPda`, `raydiumCpmmPool` |
| Graduated | Raydium CPMM 풀 자금 조달, 본딩 커브 종료 | `cpmmPoolPda`, 누적 SOL |

### 이벤트에서 현재 가격 추적

거래 후 매번 계정을 가져오는 대신 각 `BondingCurveSwapEvent`에 포함된 스왑 후 예비 상태에서 현재 가격을 계산하세요:

```typescript {% title="price-from-event.ts" showLineNumbers=true %}
function getPriceFromEvent(event: BondingCurveSwapEvent, bucket: BondingCurveBucketV2) {
  // totalTokens = virtualTokens + baseTokenBalance after swap
  const totalTokens = bucket.virtualTokens + event.baseTokenBalanceAfter;
  // totalSol = virtualSol + quoteTokenDepositTotal after swap
  const totalSol = bucket.virtualSol + event.quoteTokenDepositTotalAfter;
  // Price: tokens per SOL (how many tokens you receive for 1 SOL)
  return Number(totalTokens) / Number(totalSol);
}
```

### 계정 판별자

| 계정 | 판별자 | 설명 |
|---------|---------------|-------------|
| `GenesisAccountV2` | 계정 타입별 고유 | 마스터 조정 계정 |
| `BondingCurveBucketV2` | 계정 타입별 고유 | 본딩 커브 AMM 상태 |
| `BondingCurveSwapEvent` | `255` (내부 명령어) | 프로그램이 스왑마다 발행하는 이벤트 |

### PDA 유도

| PDA | 시드 |
|-----|-------|
| `GenesisAccountV2` | `["genesis_account_v2", baseMint, genesisIndex (u8)]` |
| `BondingCurveBucketV2` | `["bonding_curve_bucket_v2", genesisAccount, bucketIndex (u8)]` |

Genesis SDK의 `findGenesisAccountV2Pda` 및 `findBondingCurveBucketV2Pda` 함수를 사용하여 TypeScript에서 PDA를 유도하세요.

## 오류 처리

온체인 프로그램은 타입이 지정된 오류를 발행합니다. 오류 코드 또는 메시지로 이를 처리하고 사용자에게 명확한 피드백을 제공하세요.

| 오류 | 원인 | 해결 방법 |
|-------|-------|------------|
| `BondingCurveInsufficientFunds` | 커브에 요청을 이행할 토큰(매수) 또는 SOL(매도)이 부족함 | 버킷을 다시 가져와 재견적; 커브가 거의 소진 상태일 수 있음 |
| `InsufficientOutputAmount` | 실제 출력이 `minAmountOut` 미만으로 떨어짐 (슬리피지 초과) | `slippageBps`를 높이거나 즉시 재시도 |
| `InvalidSwapDirection` | `direction` 필드가 제공된 명령어 계정과 일치하지 않음 | `direction` 인수가 전달된 토큰 계정과 일치하는지 확인 |
| `BondingCurveNotStarted` | `swapStartCondition`이 아직 충족되지 않음 | `bucket.swapStartCondition`을 확인하고 커브가 활성화될 때까지 대기 |
| `BondingCurveEnded` | `swapEndCondition`이 발동됨 — 커브가 소진 또는 졸업됨 | 커브가 종료됨; 사용자를 Raydium CPMM 풀로 안내 |

```typescript {% title="error-handling.ts" showLineNumbers=true %}
import { isSwappable, isSoldOut, getSwapResult, applySlippage, swapBondingCurveV2 } from '@metaplex-foundation/genesis';

async function executeBuy(bucket, amountIn: bigint, slippageBps: number) {
  if (!isSwappable(bucket)) {
    if (isSoldOut(bucket)) {
      throw new Error('This token has sold out. Trade on Raydium.');
    }
    throw new Error('Curve is not yet active. Check the start time.');
  }

  const quote = getSwapResult(bucket, amountIn, 'buy');
  const minAmountOut = applySlippage(quote.amountOut, slippageBps);

  try {
    const result = await swapBondingCurveV2(umi, {
      // ... accounts
      amountIn: quote.amountIn,
      minAmountOut,
      direction: 'buy',
    }).sendAndConfirm(umi);

    return result.signature;
  } catch (err: any) {
    if (err.message?.includes('InsufficientOutputAmount')) {
      throw new Error('Price moved too fast. Try again with higher slippage.');
    }
    if (err.message?.includes('BondingCurveInsufficientFunds')) {
      throw new Error('Not enough tokens remaining. Re-fetch and reduce amount.');
    }
    throw err;
  }
}
```

## 참고 사항

- `virtualSol`과 `virtualTokens`는 커브 생성 시 설정되며 불변입니다 — 이들이 가격 커브 형태를 영구적으로 정의합니다
- 모든 수수료 금액은 lamports(SOL 측) 단위입니다; 현재 요율은 [프로토콜 수수료](/protocol-fees)를 참조하세요
- USDC는 견적 토큰으로 아직 지원되지 않으며, 현재 버전에서는 wSOL만 허용됩니다
- `isGraduated`는 호출마다 RPC 호출을 수행합니다 — 매 렌더링마다 호출하지 말고 인덱서에서 결과를 캐시하세요
- `BondingCurveSwapEvent` 판별자는 항상 바이트 `255`입니다 — 이 선행 바이트를 가진 Genesis 프로그램의 모든 내부 명령어는 스왑 이벤트입니다
- `isSoldOut`이 `true`를 반환하고 `isGraduated`가 `true`를 반환하는 사이에 커브는 소진되었지만 Raydium CPMM 풀에 자금이 조달되지 않은 상태입니다; `isGraduated`가 확인될 때까지 사용자를 Raydium으로 안내하지 마세요
- 프로덕션에서는 매 스왑 전에 버킷을 다시 가져오세요 — 가격은 모든 사용자의 거래마다 변동합니다
- 본딩 커브 V2는 고정 입금 기간과 일괄 가격 발견을 사용하는 [런치 풀](/smart-contracts/genesis/launch-pool) 및 [프리세일](/smart-contracts/genesis/presale) 런칭 유형과 구별됩니다

## API 참조

### 견적 및 가격 함수

| 함수 | 비동기 | 반환값 | 설명 |
|----------|-------|---------|-------------|
| `getSwapResult(bucket, amountIn, direction, isFirstBuy?)` | 아니오 | `{ amountIn, fee, amountOut }` | 수수료 조정 스왑 견적 |
| `getCurrentPrice(bucket)` | 아니오 | `number` | 현재 예비 상태에서 SOL당 토큰 수 |
| `getCurrentPriceQuotePerBase(bucket)` | 아니오 | `number` | 기본 토큰 단위당 lamports |
| `getCurrentPriceComponents(bucket)` | 아니오 | `{ totalSol, totalTokens, k }` | 원시 AMM 예비 구성 요소 |

### 라이프사이클 함수

| 함수 | 비동기 | 반환값 | 설명 |
|----------|-------|---------|-------------|
| `isSwappable(bucket)` | 아니오 | `boolean` | 공개 거래를 수락 중일 때 `true` |
| `isFirstBuyPending(bucket)` | 아니오 | `boolean` | 지정된 첫 번째 구매가 아직 완료되지 않았을 때 `true` |
| `isSoldOut(bucket)` | 아니오 | `boolean` | `baseTokenBalance === 0n`일 때 `true` |
| `getFillPercentage(bucket)` | 아니오 | `number` | 판매된 할당량의 0–100 백분율 |
| `isGraduated(umi, bucket)` | 예 | `boolean` | Raydium CPMM 풀이 온체인에 존재할 때 `true` |

### 슬리피지

| 함수 | 반환값 | 설명 |
|----------|---------|-------------|
| `applySlippage(amountOut, slippageBps)` | `bigint` | `amountOut`을 `slippageBps / 10_000`만큼 감소 |

### 스왑 명령어 — 필수 계정

| 계정 | 쓰기 가능 | 서명자 | 설명 |
|---------|----------|--------|-------------|
| `genesisAccount` | 예 | 아니오 | Genesis 조정 PDA |
| `bucketPda` | 예 | 아니오 | `BondingCurveBucketV2` PDA |
| `baseMint` | 아니오 | 아니오 | SPL 토큰 민트 |
| `quoteMint` | 아니오 | 아니오 | wSOL 민트 |
| `userBaseTokenAccount` | 예 | 아니오 | 사용자의 기본 토큰 ATA |
| `userQuoteTokenAccount` | 예 | 아니오 | 사용자의 wSOL ATA |
| `payer` | 예 | 예 | 트랜잭션 수수료 납부자 |

### 스왑 명령어 — 선택적 계정

| 계정 | 설명 |
|---------|-------------|
| `feeQuoteTokenAccount` | 프로토콜 수수료 목적지 (wSOL ATA) |
| `creatorFeeQuoteTokenAccount` | 창작자 수수료 목적지 (wSOL ATA) |
| `firstBuyerAccount` | 지정된 첫 번째 구매 지갑에만 필요 |

### 계정 검색

| 함수 | 반환값 | 설명 |
|----------|---------|-------------|
| `findBondingCurveBucketV2Pda(umi, { genesisAccount, bucketIndex })` | `[PublicKey, bump]` | 버킷 PDA 유도 |
| `findGenesisAccountV2Pda(umi, { baseMint, genesisIndex })` | `[PublicKey, bump]` | genesis 계정 PDA 유도 |
| `fetchBondingCurveBucketV2(umi, pda)` | `BondingCurveBucketV2` | 계정 가져오기 및 역직렬화 |
| `getBondingCurveBucketV2GpaBuilder(umi)` | GPA 빌더 | 모든 본딩 커브 계정 쿼리 |

## FAQ

### isSwappable과 isSoldOut의 차이는 무엇인가요?

`isSwappable`은 커브가 공개 거래를 활발히 수락하고 있을 때만 `true`를 반환합니다 — 시작 조건이 충족되고, 종료 조건이 발동되지 않았으며, 첫 번째 구매(설정된 경우)가 완료되었고, 토큰이 남아 있습니다. `isSoldOut`은 `baseTokenBalance`가 0에 도달하는 즉시 `true`를 반환하며, 거래가 종료되고 졸업이 시작됩니다. 커브는 소진되었지만 아직 졸업하지 않은 상태일 수 있습니다 — 이 구간에서는 어떤 함수도 스왑을 허용하지 않습니다.

### swapBondingCurveV2를 호출하기 전에 SOL을 래핑해야 하나요?

네. 본딩 커브는 wSOL을 견적 토큰으로 사용하며 `swapBondingCurveV2`는 네이티브 SOL을 자동으로 래핑하거나 언래핑하지 않습니다. 매수의 경우, wSOL [관련 토큰 계정(ATA)](https://spl.solana.com/associated-token-account)을 생성하고, 필요한 lamports를 입금한 후 스왑 전송 전에 `syncNative`를 호출하세요. 매도의 경우, 확인 후 wSOL ATA를 닫아 네이티브 SOL로 다시 변환하세요.

### getSwapResult는 무엇을 반환하며 수수료를 어떻게 처리하나요?

`getSwapResult`는 `{ amountIn, fee, amountOut }`을 반환합니다. 매수의 경우, AMM 공식이 실행되기 전에 SOL 입력에서 수수료가 공제됩니다 — 사용자는 `amountIn` 전체를 지불하고 AMM은 `amountIn − fee`를 받습니다. 매도의 경우, AMM 공식이 실행된 후 SOL 출력에서 수수료가 공제됩니다 — 사용자는 수수료를 제한 `amountOut`을 받습니다. 첫 번째 구매 수수료 면제를 시뮬레이션하려면 네 번째 인수로 `true`를 전달하세요.

### 슬리피지로부터 어떻게 보호하나요?

`applySlippage(quote.amountOut, slippageBps)`를 호출하여 `minAmountOut`을 계산한 후 `swapBondingCurveV2`에 전달하세요. 온체인 프로그램은 실제 출력이 `minAmountOut` 미만으로 떨어지면 트랜잭션을 거부합니다. 일반적인 값: 안정적인 조건에서 50 bps(0.5%), 변동성이 높은 런칭에서 200 bps(2%).

### isSoldOut과 isGraduated의 차이는 무엇인가요?

`isSoldOut`은 동기식 로컬 확인입니다 — `baseTokenBalance`가 `0n`이 되는 즉시 `true`를 반환합니다. `isGraduated`는 Raydium CPMM 풀이 온체인에서 생성되고 자금이 조달되었는지 확인하는 비동기 RPC 호출입니다. 소진과 졸업 사이에 `isSoldOut`이 `true`이지만 `isGraduated`가 `false`인 구간이 있습니다. `isGraduated`가 풀의 존재를 확인할 때까지 사용자를 Raydium으로 안내하지 마세요.

### 트랜잭션에서 BondingCurveSwapEvent를 어떻게 디코딩하나요?

Genesis 프로그램(`GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B`)에서 첫 번째 데이터 바이트가 `255`인 내부 명령어를 찾으세요. 해당 바이트를 잘라내고 나머지를 `getBondingCurveSwapEventSerializer().deserialize(data.slice(1))`에 전달하세요. 반환된 객체에는 방향, 금액, 수수료, 가격 인덱스를 업데이트하는 데 필요한 스왑 후 예비 상태가 포함됩니다.
