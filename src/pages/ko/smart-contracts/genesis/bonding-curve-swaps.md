---
title: 본딩 커브 스왑 통합
metaTitle: Genesis 본딩 커브 스왑 통합 | Metaplex
description: Genesis SDK를 사용하여 본딩 커브 상태 읽기, 스왑 견적 계산, 매수 및 매도 트랜잭션 실행, 슬리피지 처리, 창작자 수수료 청구하는 방법을 설명합니다.
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
  - creator fees
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
  - Bash
cli: /dev-tools/cli/genesis/bonding-curve
proficiencyLevel: Intermediate
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
    a: isSwappable은 커브가 공개 거래를 활발히 수락하고 있을 때 true를 반환합니다 — 시작 조건이 충족되고, 종료 조건이 아직 발동되지 않았으며, 첫 번째 구매(설정된 경우)가 완료되었고, 토큰이 남아 있을 때입니다. isSoldOut은 baseTokenBalance가 0이 되는 순간 true를 반환하며, 거래가 종료되고 졸업 처리가 시작됩니다.
  - q: swapBondingCurveV2를 호출하기 전에 SOL을 래핑해야 하나요?
    a: 네. 본딩 커브는 래핑된 SOL(wSOL)을 견적 토큰으로 사용합니다. swapBondingCurveV2 명령어는 SOL을 자동으로 래핑하거나 언래핑하지 않습니다. 매수의 경우, wSOL ATA를 생성하고 네이티브 SOL을 전송한 후 스왑 전에 syncNative를 호출하세요. 매도의 경우, 스왑 후 wSOL ATA를 닫아 네이티브 SOL로 다시 언래핑하세요.
  - q: getSwapResult는 무엇을 반환하며 수수료를 어떻게 처리하나요?
    a: getSwapResult는 amountIn(사용자가 실제로 지불하는 금액), fee(프로토콜 수수료), creatorFee(창작자 수수료, 구성된 경우), amountOut(사용자가 받는 금액)을 반환합니다. 매수의 경우, AMM이 실행되기 전에 SOL 입력에서 수수료가 공제됩니다. 매도의 경우, AMM이 실행된 후 SOL 출력에서 수수료가 공제됩니다. 첫 번째 구매 수수료 면제 견적을 위해 네 번째 인수로 true를 전달하세요.
  - q: 슬리피지로부터 어떻게 보호하나요?
    a: applySlippage(quote.amountOut, slippageBps)를 사용하여 minAmountOutScaled 값을 계산한 후 swapBondingCurveV2에 전달하세요. 온체인 프로그램은 실제 출력이 이 값 미만으로 떨어지면 트랜잭션을 거부합니다. 일반적인 값은 안정적인 조건에서 50 bps(0.5%), 변동성이 높은 런칭에서 200 bps(2%)입니다.
---

Genesis SDK를 사용하여 [본딩 커브](/smart-contracts/genesis/bonding-curve) 상태를 읽고, 스왑 견적을 계산하고, 온체인에서 매수 및 매도 트랜잭션을 실행하고, 슬리피지를 처리하고, 창작자 수수료를 청구합니다. {% .lead %}

{% callout title="빌드할 내용" %}
이 가이드는 다음을 다룹니다:
- `BondingCurveBucketV2` 계정 상태 가져오기 및 해석
- `isSwappable`, `isSoldOut`, `isGraduated`를 사용한 라이프사이클 상태 확인
- `getSwapResult`를 사용한 정확한 스왑 견적 계산
- `applySlippage`로 사용자 보호
- `swapBondingCurveV2`를 사용한 매수 및 매도 트랜잭션 구성
- 커브 및 졸업 후 Raydium 풀에서 창작자 수수료 청구
{% /callout %}

## 요약

본딩 커브 스왑은 Genesis SDK를 사용하여 `BondingCurveBucketV2` 온체인 계정과 상호작용합니다 — SOL을 받아 토큰을 반환하거나(매수), 토큰을 받아 SOL을 반환하는(매도) 상수 곱 AMM입니다. 기본 가격 산정 수학에 대해서는 [운영 이론](/smart-contracts/genesis/bonding-curve-theory)을 참조하세요.

- **전송 전 견적 계산** — `getSwapResult`를 호출하여 수수료가 조정된 정확한 입출력 금액을 확인하세요
- **슬리피지 보호** — `applySlippage`로 `minAmountOutScaled`를 계산하여 명령어에 전달하세요
- **wSOL은 수동 처리** — 스왑 명령어는 네이티브 SOL을 자동으로 래핑하거나 언래핑하지 않으므로, 호출자가 wSOL ATA를 직접 처리해야 합니다
- **프로그램 ID** — Solana 메인넷의 `GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B`

## 빠른 시작

**바로 가기:** [설치](#설치) · [설정](#umi-및-genesis-플러그인-설정) · [커브 가져오기](#본딩-커브-bucketv2-가져오기) · [라이프사이클 헬퍼](#본딩-커브-라이프사이클-헬퍼) · [견적](#스왑-견적-계산) · [슬리피지](#슬리피지-보호) · [스왑 실행](#스왑-트랜잭션-구성) · [창작자 수수료](/smart-contracts/genesis/creator-fees) · [오류](#오류-처리) · [API 참조](#api-참조)

1. 패키지를 설치하고 `genesis()` 플러그인으로 Umi 인스턴스를 구성하세요
2. `BondingCurveBucketV2Pda`를 파생하고 계정을 가져오세요
3. `isSwappable(bucket)`을 확인하세요 — false이면 중단하세요
4. `getSwapResult(bucket, amountIn, SwapDirection.Buy)`를 호출하여 수수료 조정 견적을 구하세요
5. `applySlippage(quote.amountOut, slippageBps)`를 적용하여 `minAmountOutScaled`를 계산하세요
6. wSOL 래핑을 수동으로 처리한 후 `swapBondingCurveV2`를 전송하고 확인하세요

## 사전 요구 사항

- **Node.js 18+** — 네이티브 BigInt 지원에 필요합니다
- SOL로 자금이 충전된 **Solana 지갑** (트랜잭션 수수료 및 스왑 입력용)
- Solana RPC 엔드포인트 (메인넷-베타 또는 데브넷)
- [Umi 프레임워크](https://github.com/metaplex-foundation/umi) 및 async/await 패턴에 대한 이해

## 테스트된 구성

| 도구 | 버전 |
|------|------|
| `@metaplex-foundation/genesis` | 1.x |
| `@metaplex-foundation/umi` | 1.x |
| `@metaplex-foundation/umi-bundle-defaults` | 1.x |
| Node.js | 18+ |

## 설치

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

const keypairFile = JSON.parse(readFileSync('/path/to/keypair.json', 'utf-8'));

const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(genesis());

const keypair = umi.eddsa.createKeypairFromSecretKey(Uint8Array.from(keypairFile));
umi.use(keypairIdentity(keypair));
```

## 본딩 커브 BucketV2 가져오기

이미 알고 있는 정보에 따라 세 가지 검색 전략을 사용할 수 있습니다.

### 알려진 Genesis 계정에서 가져오기

{% code-tabs-imported from="genesis/fetch_bonding_curve_bucket" frameworks="umi,cli" defaultFramework="umi" /%}

### 토큰 민트에서 가져오기

```typescript {% title="fetch-from-mint.ts" showLineNumbers=true %}
import {
  findGenesisAccountV2Pda,
  findBondingCurveBucketV2Pda,
  fetchBondingCurveBucketV2,
} from '@metaplex-foundation/genesis';
import { publicKey } from '@metaplex-foundation/umi';

const baseMint = publicKey('TOKEN_MINT_PUBKEY');

const [genesisAccount] = findGenesisAccountV2Pda(umi, {
  baseMint,
  genesisIndex: 0,
});

const [bucketPda] = findBondingCurveBucketV2Pda(umi, {
  genesisAccount,
  bucketIndex: 0,
});

const bucket = await fetchBondingCurveBucketV2(umi, bucketPda);
```

## 본딩 커브 BucketV2 상태 읽기

| 필드 | 유형 | 설명 |
|------|------|------|
| `baseTokenBalance` | `bigint` | 커브에 남아 있는 토큰. 0이면 소진됨. |
| `baseTokenAllocation` | `bigint` | 생성 시 이 커브에 할당된 총 토큰. |
| `quoteTokenDepositTotal` | `bigint` | 구매자가 예치한 실제 SOL (lamports). 0에서 시작. |
| `virtualSol` | `bigint` | 초기화 시 추가된 가상 SOL 리저브 (가격 책정 전용). |
| `virtualTokens` | `bigint` | 초기화 시 추가된 가상 토큰 리저브 (가격 책정 전용). |
| `depositFee` | `number` | 모든 스왑의 SOL 측에 적용되는 프로토콜 수수료율. |
| `withdrawFee` | `number` | 매도의 SOL 출력 측에 적용되는 프로토콜 수수료율. |
| `creatorFeeAccrued` | `bigint` | 마지막 청구 이후 누적된 창작자 수수료 (lamports). |
| `creatorFeeClaimed` | `bigint` | 현재까지 청구된 누적 창작자 수수료 (lamports). |
| `swapStartCondition` | `object` | 거래가 허용되기 전에 충족되어야 하는 조건. |
| `swapEndCondition` | `object` | 발동 시 거래를 종료하는 조건. |

{% callout type="note" %}
`virtualSol`과 `virtualTokens`는 가격 산정 수학에만 존재합니다 — 실제 자산으로 온체인에 예치되지 않습니다. 가상 리저브가 상수 곱 커브를 형성하는 방법은 [운영 이론](/smart-contracts/genesis/bonding-curve-theory#why-bonding-curves-require-virtual-reserves)을 참조하세요.
{% /callout %}

## 본딩 커브 라이프사이클 헬퍼

다섯 가지 헬퍼 함수는 추가 RPC 호출 없이 커브 상태를 검사합니다 (`isGraduated` 제외).

```typescript {% title="lifecycle-helpers.ts" showLineNumbers=true %}
import {
  isSwappable,
  isFirstBuyPending,
  isSoldOut,
  getFillPercentage,
  isGraduated,
} from '@metaplex-foundation/genesis';

const canSwap = isSwappable(bucket);
const firstBuyPending = isFirstBuyPending(bucket);
const soldOut = isSoldOut(bucket);
const fillPercent = getFillPercentage(bucket);
const graduated = await isGraduated(umi, bucket); // 비동기 RPC 호출
```

| 헬퍼 | 비동기 | 반환값 | 설명 |
|------|--------|--------|------|
| `isSwappable(bucket)` | 아니오 | `boolean` | 공개 거래를 수락 중일 때 `true` |
| `isFirstBuyPending(bucket)` | 아니오 | `boolean` | 지정된 첫 번째 구매가 아직 완료되지 않았을 때 `true` |
| `isSoldOut(bucket)` | 아니오 | `boolean` | `baseTokenBalance === 0n`일 때 `true` |
| `getFillPercentage(bucket)` | 아니오 | `number` | 판매된 할당량의 0–100 백분율 |
| `isGraduated(umi, bucket)` | 예 | `boolean` | Raydium CPMM 풀이 온체인에 존재할 때 `true` |

## 스왑 견적 계산

`getSwapResult(bucket, amountIn, swapDirection, isFirstBuy?)`는 트랜잭션 전송 없이 스왑에 대한 정확한 수수료 조정 금액을 계산합니다.

반환값 `{ amountIn, fee, creatorFee, amountOut }`:
- `amountIn` — 조정 후 실제 입력 금액
- `fee` — 부과된 프로토콜 수수료, lamports 단위
- `creatorFee` — 부과된 창작자 수수료, lamports 단위 (창작자 수수료가 구성되지 않은 경우 0)
- `amountOut` — 받는 토큰(매수) 또는 받는 SOL(매도)

### 매수 견적 (SOL → 토큰)

{% code-tabs-imported from="genesis/swap_quote_buy" frameworks="umi,cli" defaultFramework="umi" /%}

### 매도 견적 (토큰 → SOL)

{% code-tabs-imported from="genesis/swap_quote_sell" frameworks="umi,cli" defaultFramework="umi" /%}

### 첫 번째 구매 수수료 면제

수수료가 면제된 첫 번째 구매를 견적하려면 네 번째 인수로 `true`를 전달하세요:

```typescript {% title="first-buy-quote.ts" showLineNumbers=true %}
const firstBuyQuote = getSwapResult(bucket, SOL_IN, SwapDirection.Buy, true);
console.log('Fee (waived): ', firstBuyQuote.fee.toString()); // 0n
```

### 현재 가격 헬퍼

```typescript {% title="current-price.ts" showLineNumbers=true %}
import {
  getCurrentPrice,
  getCurrentPriceQuotePerBase,
  getCurrentPriceComponents,
} from '@metaplex-foundation/genesis';

const tokensPerSol = getCurrentPrice(bucket);          // bigint
const lamportsPerToken = getCurrentPriceQuotePerBase(bucket); // bigint
const { baseReserves, quoteReserves } = getCurrentPriceComponents(bucket);
```

## 슬리피지 보호

`applySlippage(expectedAmountOut, slippageBps)`는 슬리피지 허용 오차만큼 예상 출력을 줄입니다. 결과를 `minAmountOutScaled`로 스왑 명령어에 전달하세요 — 실제 출력이 이 값 미만으로 떨어지면 온체인 프로그램이 트랜잭션을 거부합니다.

```typescript {% title="slippage.ts" showLineNumbers=true %}
import { getSwapResult, applySlippage, SwapDirection } from '@metaplex-foundation/genesis';

const quote = getSwapResult(bucket, 1_000_000_000n, SwapDirection.Buy);
const minAmountOutScaled = applySlippage(quote.amountOut, 100); // 1% 슬리피지
```

{% callout type="warning" %}
`applySlippage`에서 계산된 `minAmountOutScaled` 없이 스왑을 전송하지 마세요. 본딩 커브 가격은 모든 거래마다 변동합니다. 슬리피지 보호 없이는 사용자가 견적보다 훨씬 적은 토큰을 받을 수 있습니다.
{% /callout %}

일반적인 값: 안정적인 조건에서 50 bps (0.5%), 변동성이 높은 런칭에서 200 bps (2%).

## 스왑 트랜잭션 구성

`swapBondingCurveV2(umi, accounts)`는 스왑 명령어를 빌드합니다. 호출자는 트랜잭션 전후로 래핑된 SOL(wSOL)을 처리할 책임이 있습니다.

### 매수 트랜잭션 (SOL → 토큰)

{% code-tabs-imported from="genesis/swap_buy" frameworks="umi,cli" defaultFramework="umi" /%}

### 매도 트랜잭션 (토큰 → SOL)

{% code-tabs-imported from="genesis/swap_sell" frameworks="umi,cli" defaultFramework="umi" /%}

### wSOL 래핑 참고 사항

{% callout type="warning" title="수동 wSOL 처리 필요" %}
`swapBondingCurveV2`는 래핑된 SOL(wSOL)을 견적 토큰으로 사용하며 네이티브 SOL을 **자동으로** 래핑하거나 언래핑하지 않습니다.

**매수의 경우:** wSOL ATA를 생성하고, 필요한 lamports를 전송한 후 스왑 전에 `syncNative`를 호출하세요.

**매도의 경우:** 스왑이 확인된 후 wSOL ATA를 닫아 네이티브 SOL로 다시 언래핑하세요.

현재 버전에서는 wSOL만 견적 토큰으로 허용됩니다.
{% /callout %}

```typescript {% title="wsol-wrap-unwrap.ts" showLineNumbers=true %}
import {
  findAssociatedTokenPda,
  createAssociatedTokenAccountIdempotentInstruction,
  syncNative,
  closeToken,
} from '@metaplex-foundation/mpl-toolbox';
import { transactionBuilder, sol, publicKey } from '@metaplex-foundation/umi';

const wSOL = publicKey('So11111111111111111111111111111111111111112');
const [wSolAta] = findAssociatedTokenPda(umi, { mint: wSOL, owner: umi.identity.publicKey });

// --- 매수 전 SOL 래핑 ---
const wrapBuilder = transactionBuilder()
  .add(createAssociatedTokenAccountIdempotentInstruction(umi, {
    mint: wSOL,
    owner: umi.identity.publicKey,
  }))
  .add(syncNative(umi, { account: wSolAta }));

await wrapBuilder.sendAndConfirm(umi);

// --- 매도 후 SOL 언래핑 ---
const unwrapBuilder = closeToken(umi, {
  account: wSolAta,
  destination: umi.identity.publicKey,
  authority: umi.identity,
});

await unwrapBuilder.sendAndConfirm(umi);
```

## 창작자 수수료 청구

창작자 수수료는 스왑에서 직접 전송되지 않고 버킷(`creatorFeeAccrued`)에 누적됩니다. 권한 없는 `claimBondingCurveCreatorFeeV2` 명령어로 커브가 활성 중에 수집하고, 졸업 후에는 `claimRaydiumCreatorFeeV2`로 수집합니다.

누적 잔액 확인 방법과 졸업 후 Raydium LP 수수료 처리를 포함한 전체 청구 흐름은 [창작자 수수료](/smart-contracts/genesis/creator-fees)를 참조하세요.

## 오류 처리

| 오류 | 원인 | 해결 방법 |
|------|------|-----------|
| `BondingCurveInsufficientFunds` | 커브에 토큰(매수) 또는 SOL(매도)이 부족함 | 버킷을 다시 가져와 재견적; 커브가 거의 소진 상태일 수 있습니다 |
| `InsufficientOutputAmount` | 실제 출력이 `minAmountOutScaled` 미만으로 떨어짐 | `slippageBps`를 높이거나 즉시 재시도하세요 |
| `InvalidSwapDirection` | `swapDirection` 값이 유효하지 않음 | `@metaplex-foundation/genesis` 임포트에서 `SwapDirection.Buy` 또는 `SwapDirection.Sell`을 전달하세요 |
| `BondingCurveNotStarted` | `swapStartCondition`이 아직 충족되지 않음 | `bucket.swapStartCondition`을 확인하고 대기하세요 |
| `BondingCurveEnded` | 커브가 소진되거나 졸업됨 | 사용자를 Raydium CPMM 풀로 안내하세요 |

```typescript {% title="error-handling.ts" showLineNumbers=true %}
async function executeBuy(bucket, amountIn: bigint, slippageBps: number) {
  if (!isSwappable(bucket)) {
    if (isSoldOut(bucket)) throw new Error('Token sold out. Trade on Raydium.');
    throw new Error('Curve not yet active. Check the start time.');
  }

  const quote = getSwapResult(bucket, amountIn, SwapDirection.Buy);
  const minAmountOutScaled = applySlippage(quote.amountOut, slippageBps);

  try {
    return await swapBondingCurveV2(umi, {
      amount: quote.amountIn,
      minAmountOutScaled,
      swapDirection: SwapDirection.Buy,
      // ... accounts
    }).sendAndConfirm(umi);
  } catch (err: any) {
    if (err.message?.includes('InsufficientOutputAmount'))
      throw new Error('Price moved. Try again with higher slippage.');
    if (err.message?.includes('BondingCurveInsufficientFunds'))
      throw new Error('Not enough tokens remaining. Reduce amount.');
    throw err;
  }
}
```

## 참고 사항

- 프로덕션에서는 매 스왑 전에 버킷을 다시 가져오세요 — 가격은 모든 사용자의 거래마다 변동합니다
- `virtualSol`과 `virtualTokens`는 커브 생성 시 설정되며 불변입니다 — 이들을 캐시하세요; 실제 리저브 필드만 스왑당 변경됩니다
- `isGraduated`는 매번 호출 시 RPC 호출을 수행합니다 — 인덱서에서 결과를 캐시하세요
- `isSoldOut`이 `true`를 반환하고 `isGraduated`가 `true`를 반환하기 전 사이에, 커브는 소진되었지만 Raydium에 아직 자금이 조달되지 않았습니다; `isGraduated`가 확인될 때까지 사용자를 Raydium으로 안내하지 마세요
- 이벤트 디코딩 및 라이프사이클 인덱싱에 대해서는 [인덱싱 및 이벤트](/smart-contracts/genesis/bonding-curve-indexing)를 참조하세요
- 모든 수수료 금액은 lamports(SOL 측) 단위입니다; 현재 수수료율은 [프로토콜 수수료](/protocol-fees)를 참조하세요

## API 참조

### 견적 및 가격 함수

| 함수 | 비동기 | 반환값 | 설명 |
|------|--------|--------|------|
| `getSwapResult(bucket, amountIn, swapDirection, isFirstBuy?)` | 아니오 | `{ amountIn, fee, creatorFee, amountOut }` | 수수료 조정 스왑 견적 |
| `getCurrentPrice(bucket)` | 아니오 | `bigint` | SOL 단위당 기본 토큰 수 (정수 나눗셈) |
| `getCurrentPriceQuotePerBase(bucket)` | 아니오 | `bigint` | 기본 토큰 단위당 lamports (정수 나눗셈) |
| `getCurrentPriceComponents(bucket)` | 아니오 | `{ baseReserves, quoteReserves }` | bigint로 결합된 가상 + 실제 리저브 |

### 라이프사이클 함수

| 함수 | 비동기 | 반환값 | 설명 |
|------|--------|--------|------|
| `isSwappable(bucket)` | 아니오 | `boolean` | 공개 거래를 수락 중일 때 `true` |
| `isFirstBuyPending(bucket)` | 아니오 | `boolean` | 지정된 첫 번째 구매가 아직 완료되지 않았을 때 `true` |
| `isSoldOut(bucket)` | 아니오 | `boolean` | `baseTokenBalance === 0n`일 때 `true` |
| `getFillPercentage(bucket)` | 아니오 | `number` | 판매된 할당량의 0–100 백분율 |
| `isGraduated(umi, bucket)` | 예 | `boolean` | Raydium CPMM 풀이 온체인에 존재할 때 `true` |

### 슬리피지

| 함수 | 반환값 | 설명 |
|------|--------|------|
| `applySlippage(amountOut, slippageBps)` | `bigint` | `amountOut`을 `slippageBps / 10_000`만큼 감소 |

### 스왑 명령어 계정

| 계정 | 쓰기 가능 | 서명자 | 설명 |
|------|-----------|--------|------|
| `genesisAccount` | 예 | 아니오 | Genesis 조정 PDA |
| `bucket` | 예 | 아니오 | `BondingCurveBucketV2` PDA |
| `baseMint` | 아니오 | 아니오 | SPL 토큰 민트 |
| `quoteMint` | 아니오 | 아니오 | wSOL 민트 |
| `baseTokenAccount` | 예 | 아니오 | 사용자의 기본 토큰 ATA |
| `quoteTokenAccount` | 예 | 아니오 | 사용자의 wSOL ATA |
| `payer` | 예 | 예 | 트랜잭션 수수료 납부자 |

### 계정 검색

| 함수 | 반환값 | 설명 |
|------|--------|------|
| `findBondingCurveBucketV2Pda(umi, { genesisAccount, bucketIndex })` | `[PublicKey, bump]` | 버킷 PDA 파생 |
| `findGenesisAccountV2Pda(umi, { baseMint, genesisIndex })` | `[PublicKey, bump]` | genesis 계정 PDA 파생 |
| `fetchBondingCurveBucketV2(umi, pda)` | `BondingCurveBucketV2` | 계정 가져오기 및 역직렬화 |

## FAQ

### isSwappable과 isSoldOut의 차이는 무엇인가요?
`isSwappable`은 커브가 공개 거래를 활발히 수락하고 있을 때만 `true`를 반환합니다. `isSoldOut`은 `baseTokenBalance`가 0에 도달하는 순간 `true`를 반환하며, 거래가 종료되고 졸업이 시작됩니다. 커브는 소진되었지만 아직 졸업하지 않은 상태일 수 있습니다.

### swapBondingCurveV2를 호출하기 전에 SOL을 래핑해야 하나요?
네. 본딩 커브는 wSOL을 견적 토큰으로 사용하며 `swapBondingCurveV2`는 네이티브 SOL을 자동으로 래핑하거나 언래핑하지 않습니다. [wSOL 래핑 참고 사항](#wsol-래핑-참고-사항)을 참조하세요.

### getSwapResult는 무엇을 반환하며 수수료를 어떻게 처리하나요?
`getSwapResult`는 `{ amountIn, fee, creatorFee, amountOut }`을 반환합니다. 매수의 경우, AMM 공식이 실행되기 전에 SOL 입력에서 수수료가 공제됩니다. 매도의 경우, AMM 공식이 실행된 후 SOL 출력에서 수수료가 공제됩니다. 첫 번째 구매 수수료 면제를 시뮬레이션하려면 네 번째 인수로 `true`를 전달하세요.

### 슬리피지로부터 어떻게 보호하나요?
`applySlippage(quote.amountOut, slippageBps)`를 호출하여 `minAmountOutScaled`를 계산한 후 `swapBondingCurveV2`에 전달하세요. 온체인 프로그램은 실제 출력이 이 값 미만으로 떨어지면 트랜잭션을 거부합니다.
