---
title: Launch Pool
metaTitle: Genesis Launch Pool | 솔라나 공정한 출시 & 토큰 배포 | Metaplex
description: 솔라나에서의 공정한 토큰 출시 배포. 사용자가 SOL을 예치하고 SPL 토큰을 비례적으로 받습니다 — 기존 중앙화 토큰 판매의 온체인 크라우드세일 대안으로 유기적인 가격 발견을 제공합니다.
created: '01-15-2025'
updated: '09-18-2026'
keywords:
  - launch pool
  - token distribution
  - fair launch
  - fair launch crypto
  - proportional distribution
  - deposit window
  - price discovery
  - token launchpad
  - crowdsale
  - token sale alternative
  - SPL token launch
  - on-chain token launch
  - soft cap
  - oversubscription
  - pro-rata refund
  - minimum quote token threshold
about:
  - Launch pools
  - Price discovery
  - Token distribution
  - Soft caps
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
howToSteps:
  - 토큰으로 Genesis Account를 초기화합니다
  - 예치 기간이 설정된 Launch Pool bucket을 추가합니다
  - 수집된 자금을 받을 Unlocked bucket을 추가합니다
  - 최종화하고 사용자가 기간 동안 예치할 수 있도록 합니다
howToTools:
  - Node.js
  - Umi framework
  - Genesis SDK
faqs:
  - q: Launch Pool에서 토큰 가격은 어떻게 결정되나요?
    a: 가격은 총 예치금을 기반으로 유기적으로 발견됩니다. 최종 가격은 총 예치된 SOL을 할당된 토큰으로 나눈 값입니다. 예치금이 많을수록 토큰당 암묵적 가격이 높아집니다.
  - q: 사용자가 예치금을 출금할 수 있나요?
    a: 네, 사용자는 예치 기간 동안 출금할 수 있습니다. 시스템 악용을 방지하기 위해 {% fee product="genesis" config="launchPool" fee="withdraw" /%} 출금 수수료가 적용됩니다.
  - q: 여러 번 예치하면 어떻게 되나요?
    a: 같은 지갑에서의 여러 예치금은 단일 예치 계정에 누적됩니다. 총 지분은 합산된 예치금을 기준으로 합니다.
  - q: 사용자는 언제 토큰을 청구할 수 있나요?
    a: 예치 기간이 끝나고 청구 기간이 열린 후(claimStartCondition으로 정의됨)에 가능합니다. End behavior를 처리하기 위해 먼저 triggerBehaviorsV2가 실행되어야 합니다.
  - q: Launch Pool과 Presale의 차이점은 무엇인가요?
    a: Launch Pool은 비례 배분과 함께 예치금을 기반으로 유기적으로 가격을 발견합니다. Presale은 미리 정해진 고정 가격으로 상한까지 선착순 할당합니다.
  - q: Launch Pool 소프트 캡이란 무엇인가요?
    a: 소프트 캡은 Launch Pool이 보유하는 quote 토큰의 상한이며 softCap 확장으로 설정합니다. 상한을 초과하는 예치금도 계속 받아들여지고 런칭은 그대로 성공하며, 초과분은 예치 기간이 끝난 후 비례적으로 환불됩니다.
  - q: 소프트 캡과 최소 quote 토큰 임계값(minimum quote token threshold)의 차이점은 무엇인가요?
    a: 소프트 캡은 모금액의 상한이며 런칭을 실패시키지 않습니다. 최소 quote 토큰 임계값은 하한으로, 총 예치금이 이에 미달하면 런칭이 실패하고 모든 예치자가 전액 환불을 받을 수 있습니다. 두 확장은 별개이며 함께 사용할 수 있습니다.
  - q: Launch Pool이 초과 청약되면 예치자가 받는 토큰이 줄어드나요?
    a: 아니요. 전체 base 토큰 할당량은 모든 예치금에 비례하여 그대로 배분됩니다. 초과 청약 시에는 토큰 할당량을 줄이는 대신 초과 quote 토큰을 환불하므로, 실효 가격은 softCap을 baseTokenAllocation으로 나눈 값으로 제한됩니다.
  - q: 소프트 캡이 Raydium 졸업 시작 가격을 변경하나요?
    a: 네. Launch Pool이 초과 청약된 경우 졸업 시작 가격은 원시 예치 총액이 아닌 상한이 적용된 수익금에서 산출되므로, SendQuoteTokenPercentage가 실제로 전달하는 금액과 일치합니다.
---

**Launch Pool**은 솔라나에서 공정한 토큰 출시를 위한 유기적인 가격 발견을 제공합니다. 기존 중앙화 토큰 판매와는 다른 온체인 토큰 배포 메커니즘으로 — 사용자는 일정 기간 동안 SOL을 예치하고 총 예치금에서의 지분에 비례하여 SPL 토큰을 받습니다. 스나이핑 없음, 프론트러닝 없음, 모두에게 공정한 배분. {% .lead %}

{% callout title="학습 내용" %}
이 가이드에서 다루는 내용:
- Launch Pool 가격 책정 및 배분 작동 방식
- 예치 및 청구 기간 설정
- 자금 수집을 위한 End behavior 구성
- 사용자 작업: 예치, 출금, 청구
{% /callout %}

## 요약

Launch Pool은 정해진 기간 동안 예치금을 받은 후 토큰을 비례적으로 배분하는 크라우드세일 스타일의 토큰 출시 메커니즘입니다. 최종 토큰 가격은 총 예치금을 토큰 할당량으로 나누어 결정되며, 토큰 생성 이벤트(TGE)를 위한 투명한 온체인 가격 발견을 가능하게 합니다.

- 사용자는 예치 기간 동안 SOL을 예치합니다 ({% fee product="genesis" config="launchPool" fee="deposit" /%} 수수료 적용)
- 예치 기간 동안 출금 가능 ({% fee product="genesis" config="launchPool" fee="withdraw" /%} 수수료)
- 토큰 배분은 예치 지분에 비례
- 선택적 [소프트 캡](#launch-pool-soft-cap)이 런칭이 보유하는 금액을 제한하고 초과분을 비례적으로 환불
- End behavior가 수집된 SOL을 Treasury bucket으로 라우팅

{% callout type="note" %}
Launch Pool은 예치금으로부터 가격을 발견합니다. 미리 정해진 고정 가격이 필요하면 [Presale](/ko/smart-contracts/genesis/presale)을, 입찰 기반 청산이 필요하면 [Uniform Price Auction](/ko/smart-contracts/genesis/uniform-price-auction)을 사용하세요. 유동성 풀 생성은 Launch Pool bucket이 아니라 Raydium 졸업 bucket이 처리합니다.
{% /callout %}

## 빠른 시작

{% totem %}
{% totem-accordion title="전체 설정 스크립트 보기" %}

Launch Pool을 예치 및 청구 기간과 함께 설정하는 방법을 보여줍니다. 사용자용 앱을 구축하려면 [사용자 작업](#사용자-작업)을 참조하세요.

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplToolbox } from '@metaplex-foundation/mpl-toolbox';
import {
  genesis,
  initializeV2,
  findGenesisAccountV2Pda,
  addLaunchPoolBucketV2,
  findLaunchPoolBucketV2Pda,
  addUnlockedBucketV2,
  findUnlockedBucketV2Pda,
  finalizeV2,
} from '@metaplex-foundation/genesis';
import { generateSigner, publicKey } from '@metaplex-foundation/umi';

async function setupLaunchPool() {
  const umi = createUmi('https://api.mainnet-beta.solana.com')
    .use(mplToolbox())
    .use(genesis());

  // umi.use(keypairIdentity(yourKeypair));

  const baseMint = generateSigner(umi);
  const TOTAL_SUPPLY = 1_000_000_000_000_000n; // 1 million tokens (9 decimals)

  // 1. Initialize
  const [genesisAccount] = findGenesisAccountV2Pda(umi, {
    baseMint: baseMint.publicKey,
    genesisIndex: 0,
  });

  await initializeV2(umi, {
    baseMint,
    fundingMode: 0,
    totalSupplyBaseToken: TOTAL_SUPPLY,
    name: 'My Token',
    symbol: 'MTK',
    uri: 'https://example.com/metadata.json',
  }).sendAndConfirm(umi);

  // 2. Define timing
  const now = BigInt(Math.floor(Date.now() / 1000));
  const depositStart = now + 60n;
  const depositEnd = now + 86400n; // 24 hours
  const claimStart = depositEnd + 1n;
  const claimEnd = claimStart + 604800n; // 1 week

  // 3. Derive bucket PDAs
  const [launchPoolBucket] = findLaunchPoolBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 });
  const [unlockedBucket] = findUnlockedBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 });

  // 4. Add Launch Pool bucket
  await addLaunchPoolBucketV2(umi, {
    genesisAccount,
    baseMint: baseMint.publicKey,
    baseTokenAllocation: TOTAL_SUPPLY,
    depositStartCondition: {
      __kind: 'TimeAbsolute',
      padding: Array(47).fill(0),
      time: depositStart,
      triggeredTimestamp: null,
    },
    depositEndCondition: {
      __kind: 'TimeAbsolute',
      padding: Array(47).fill(0),
      time: depositEnd,
      triggeredTimestamp: null,
    },
    claimStartCondition: {
      __kind: 'TimeAbsolute',
      padding: Array(47).fill(0),
      time: claimStart,
      triggeredTimestamp: null,
    },
    claimEndCondition: {
      __kind: 'TimeAbsolute',
      padding: Array(47).fill(0),
      time: claimEnd,
      triggeredTimestamp: null,
    },
    minimumDepositAmount: null,
    endBehaviors: [
      {
        __kind: 'SendQuoteTokenPercentage',
        padding: Array(4).fill(0),
        destinationBucket: publicKey(unlockedBucket),
        percentageBps: 10000, // 100%
        processed: false,
      },
    ],
  }).sendAndConfirm(umi);

  // 5. Add Unlocked bucket (receives SOL after transition)
  await addUnlockedBucketV2(umi, {
    genesisAccount,
    baseMint: baseMint.publicKey,
    baseTokenAllocation: 0n,
    recipient: umi.identity.publicKey,
    claimStartCondition: {
      __kind: 'TimeAbsolute',
      padding: Array(47).fill(0),
      time: claimStart,
      triggeredTimestamp: null,
    },
    claimEndCondition: {
      __kind: 'TimeAbsolute',
      padding: Array(47).fill(0),
      time: claimEnd,
      triggeredTimestamp: null,
    },
  }).sendAndConfirm(umi);

  // 6. Finalize
  await finalizeV2(umi, {
    baseMint: baseMint.publicKey,
    genesisAccount,
  }).sendAndConfirm(umi);

  console.log('Launch Pool active!');
  console.log('Token:', baseMint.publicKey);
  console.log('Genesis:', genesisAccount);
}

setupLaunchPool().catch(console.error);
```

{% /totem-accordion %}
{% /totem %}

## 작동 방식

1. 특정 수량의 토큰이 Launch Pool bucket에 할당됩니다
2. 사용자는 예치 기간 동안 SOL을 예치합니다 (수수료와 함께 출금 가능)
3. 기간이 종료되면 예치 지분에 따라 토큰이 비례적으로 배분됩니다

### 가격 발견

토큰 가격은 총 예치금에서 도출됩니다:

```
tokenPrice = totalDeposits / tokenAllocation
userTokens = (userDeposit / totalDeposits) * tokenAllocation
```

**예시:** 1,000,000 토큰 할당, 총 100 SOL 예치 = 토큰당 0.0001 SOL

가격 발견은 기본적으로 상한이 없습니다 — 풀이 많이 청약될수록 암묵적 가격이 높아집니다. [소프트 캡](#launch-pool-soft-cap)을 설정하면 가격에 상한을 둘 수 있습니다.

### 라이프사이클

1. **예치 기간** - 사용자가 정해진 기간 동안 SOL을 예치
2. **`triggerBehaviorsV2`** - End behavior 실행 (예: 수집된 SOL을 다른 bucket으로 전송)
3. **청구 기간** - 사용자가 예치 비중에 비례한 토큰을 청구
4. **환불 기간** (조건부) - [소프트 캡](#launch-pool-soft-cap)을 초과했거나 [최소 quote 토큰 임계값](#soft-cap-and-minimum-quote-token-threshold-together)에 미달한 경우, 예치자가 `refundLaunchPoolV2`를 호출

## Launch Pool 소프트 캡 {% #launch-pool-soft-cap %}

**소프트 캡**은 Launch Pool이 보유하는 quote 토큰의 상한이며, `addLaunchPoolBucketV2`의 `softCap` 확장으로 설정합니다. 상한을 초과하는 예치금도 예치 기간 동안 계속 받아들여지고 런칭은 성공하며, 초과분 quote 토큰은 예치 기간이 끝나면 비례적으로 환불됩니다.

소프트 캡이 없으면 가격 발견에 상한이 없습니다. 모든 예치금이 보유되고 청약이 늘어날수록 암묵적 토큰 가격이 상승합니다. 소프트 캡은 런칭이 모금하는 최대 금액을 고정하므로, 예치금이 얼마나 초과하든 실효 가격은 `softCap / baseTokenAllocation`입니다.

| 속성 | 소프트 캡이 설정된 경우의 동작 |
|----------|------------------------------------------|
| 상한을 초과하는 예치금 | 예치 기간 동안 받아들여짐 — 상한에서 예치가 거부되지 않음 |
| 런칭 결과 | 성공 — 소프트 캡은 상한일 뿐 실패 조건이 아님 |
| Base 토큰 배분 | 전체 `baseTokenAllocation`이 모든 예치금에 비례하여 배분됨 |
| 초과 quote 토큰 | 예치 기간 종료 후 `refundLaunchPoolV2`를 통해 비례적으로 환불됨 |
| End behavior가 보는 수익금 | 소프트 캡으로 제한되어 `SendQuoteTokenPercentage`가 전달하는 금액은 최대 `softCap` |
| Raydium 졸업 시작 가격 | 원시 예치 총액이 아닌 상한이 적용된 수익금에서 산출 |

{% callout type="note" %}
소프트 캡은 모금액의 상한이지 하한이 아닙니다. 하한은 별개의 확장인 `minimumQuoteTokenThreshold`입니다 — [소프트 캡과 최소 quote 토큰 임계값 함께 사용하기](#soft-cap-and-minimum-quote-token-threshold-together)를 참조하세요.
{% /callout %}

### Launch Pool Bucket에 소프트 캡 설정하기 {% #configuring-a-soft-cap-on-a-launch-pool-bucket %}

bucket을 추가할 때 `addLaunchPoolBucketV2`에 `softCap` 값을 전달합니다. 금액은 quote 토큰의 최소 단위(wSOL의 경우 lamports)로 표시합니다.

{% totem %}

```typescript {% title="Add a Launch Pool bucket with a 100 SOL soft cap" %}
import { sol } from '@metaplex-foundation/umi';

await addLaunchPoolBucketV2(umi, {
  genesisAccount,
  baseMint: baseMint.publicKey,
  baseTokenAllocation: TOTAL_SUPPLY,
  // ...time conditions and end behaviors...

  // Floor: the launch fails below this and everyone can take a full refund.
  minimumQuoteTokenThreshold: { amount: sol(10).basisPoints },

  // Ceiling: the launch keeps at most this much; the rest is refunded pro-rata.
  softCap: { amount: sol(100).basisPoints },
}).sendAndConfirm(umi);
```

{% /totem %}

{% callout type="warning" %}
`softCap`은 `@metaplex-foundation/genesis` 0.42.0의 `addLaunchPoolBucketV2`에서 **필수** 인수입니다. 다른 Launch Pool 확장과 달리 기본값이 없으므로, 상한을 원하지 않을 때는 `softCap: null`을 명시적으로 전달하세요.
{% /callout %}

소프트 캡은 확장을 설정할 때와 `finalizeV2` 시점에 다시 검증됩니다:

| 규칙 | 위반 시 오류 |
|------|-------------------|
| `softCap.amount`는 0보다 커야 함 | `InvalidSoftCap` (221) |
| `softCap.amount`는 `minimumQuoteTokenThreshold.amount` 이상이어야 함 | `SoftCapBelowThreshold` (222) |
| 확장은 `finalizeV2` 전에만 추가하거나 제거할 수 있음 | 계정이 이미 최종화되었다는 이유로 거부됨 |

소프트 캡은 `LaunchPoolV2ExtensionType`의 `SoftCap` 멤버와 함께 `addLaunchPoolBucketV2Extensions` 및 `removeLaunchPoolBucketV2Extensions`를 사용하여 기존 bucket에도 설정하거나 해제할 수 있지만, Genesis Account가 최종화되기 전에만 가능합니다.

### 초과 청약과 비례 환불 계산 {% #oversubscription-and-pro-rata-refund-math %}

`quoteTokenDepositTotal`이 `softCap.amount`보다 엄격히 클 때 Launch Pool은 **초과 청약**된 상태입니다. 이때 각 예치금은 상한에 포함되는 *충당(filled)* 부분과 환불 가능한 *초과(excess)* 부분으로 나뉩니다:

{% totem %}

```text {% title="Per-depositor split in an oversubscribed Launch Pool" %}
filled_i = ceil(deposit_i * softCap / totalDeposits)
excess_i = deposit_i - filled_i
tokens_i = (weighted_i / weightedQuoteTokenTotal) * baseTokenAllocation
```

{% /totem %}

`filled`는 **올림** 처리되어 모든 충당 부분의 합이 항상 소프트 캡 이상이 됩니다. 이렇게 하면 환불과 졸업 중 어느 쪽을 먼저 크랭크하더라도 상한이 적용된 졸업 전송에 대해 bucket의 지급 능력이 유지됩니다. 각 예치자의 반올림은 1 최소 단위 미만이므로 bucket에 남는 먼지(dust)는 총 최대 `depositCount - 1` 최소 단위입니다.

토큰 배분은 상한의 영향을 받지 않습니다. 초과분을 환불해도 예치자의 가중 기여도는 제거되지 않으므로, 모든 예치자는 여전히 **전체** 예치금에 비례하여 토큰을 받습니다.

**계산 예시** — 1,000,000 토큰 할당, 100 SOL 소프트 캡, 150 SOL 예치:

| 예치자 | 예치금 | 충당 (보유) | 환불 | 받는 토큰 |
|-----------|-----------|---------------|----------|-----------------|
| Alice | 50 SOL | ~33.33 SOL | ~16.67 SOL | 333,333 (1/3) |
| Bob | 100 SOL | ~66.67 SOL | ~33.33 SOL | 666,667 (2/3) |
| **합계** | **150 SOL** | **100 SOL** | **50 SOL** | **1,000,000** |

실효 가격은 상한이 없는 예치 총액이 의미했을 토큰당 0.00015 SOL이 아니라 토큰당 0.0001 SOL(100 SOL / 1,000,000)입니다. 온체인 값은 `filled`를 올림한 lamports 단위로 계산되므로 실제 수치는 위의 반올림된 SOL 금액과 몇 lamports 차이가 납니다.

### refundLaunchPoolV2로 초과 예치금 환불하기 {% #refunding-excess-deposits-with-refund-launch-pool-v2 %}

`refundLaunchPoolV2`는 초과 청약된 예치 기간이 끝난 후 예치자의 초과 quote 토큰을 반환합니다. amount 인수는 없으며, 프로그램이 예치금, 소프트 캡, bucket의 예치 총액으로부터 환불 가능 금액을 계산합니다.

{% code-tabs-imported from="genesis/refund_launch_pool_v2" frameworks="umi" filename="refundLaunchPool" /%}

환불 경로의 주요 특성:

- **크랭크는 누구나 실행할 수 있습니다.** `payer`만 서명하면 됩니다. 예치자도 서명하면 비어 있는 base 토큰 계정이 닫힙니다.
- 환불에는 **수수료와 페널티가 없습니다.** 예치 및 출금 페널티 스케줄은 환불에 영향을 주지 않습니다.
- **청구 순서는 상관없습니다.** 초과분 환불은 `claimLaunchPoolV2` 전후 어느 쪽에서도 가능하며, 두 순서 모두 동일한 최종 상태로 수렴합니다.
- **예치금당 환불은 한 번입니다.** 두 번째 호출은 `DepositAlreadyRefunded`를 반환합니다.
- **환불은 예치 기간이 끝난 후에만 가능합니다.** 더 일찍 호출하면 `LaunchPoolNotEnded`를 반환합니다.
- **환불은 하한 미달 또는 상한 초과 시에만 가능합니다.** 둘 다 해당하지 않으면 `LaunchPoolThresholdMet`를 반환합니다.

### 소프트 캡과 최소 quote 토큰 임계값 함께 사용하기 {% #soft-cap-and-minimum-quote-token-threshold-together %}

`softCap`과 `minimumQuoteTokenThreshold`는 Launch Pool을 서로 반대 방향에서 제한하는 독립적인 확장이며, `refundLaunchPoolV2`가 둘 다 처리합니다. 하한에 미달하면 그것이 우선하며 환불은 전액 환불입니다.

| 구성 | 하한 미만 예치 | 하한과 상한 사이 예치 | 상한 초과 예치 |
|---------------|--------------------------|--------------------------------|------------------------|
| 둘 다 미설정 | 런칭 성공, 환불 없음 | 런칭 성공, 환불 없음 | 런칭 성공, 환불 없음 |
| 하한만 설정 | 런칭 실패, 전액 환불 | 런칭 성공, 환불 없음 | 런칭 성공, 환불 없음 |
| 상한만 설정 | 런칭 성공, 환불 없음 | 런칭 성공, 환불 없음 | 런칭 성공, 초과분 비례 환불 |
| 하한과 상한 모두 설정 | 런칭 실패, 전액 환불 | 런칭 성공, 환불 없음 | 런칭 성공, 초과분 비례 환불 |

{% callout type="note" %}
전액 환불은 예치자의 가중 기여도를 bucket에서 제거하며 청구 이후에는 할 수 없습니다 — 하한 미달이라면 애초에 청구가 불가능했기 때문입니다. 초과분 환불은 가중 기여도를 그대로 두므로 비례 청구 공식이 올바르게 유지됩니다.
{% /callout %}

## 수수료

{% protocol-fees program="genesis" config="launchPool" showTitle=false /%}

예치 시 {% fee product="genesis" config="launchPool" fee="deposit" /%} 사용자 예치 수수료를 제외한 금액만 예치 계정 잔액에 반영됩니다.

## 설정 가이드

### 사전 요구 사항

{% totem %}

```bash
npm install @metaplex-foundation/genesis @metaplex-foundation/umi @metaplex-foundation/umi-bundle-defaults @metaplex-foundation/mpl-toolbox
```

{% /totem %}

### 1. Genesis Account 초기화

Genesis Account는 토큰을 생성하고 모든 배포 bucket을 조정합니다.

{% code-tabs-imported from="genesis/initialize_v2" frameworks="umi" filename="initializeV2" /%}

{% callout type="note" %}
`totalSupplyBaseToken`은 모든 bucket 할당량의 합과 같아야 합니다.
{% /callout %}

### 2. Launch Pool Bucket 추가

Launch Pool bucket은 예치금을 수집하고 토큰을 비례적으로 배분합니다. 여기서 타이밍을 구성합니다.

{% code-tabs-imported from="genesis/add_launch_pool_bucket_v2" frameworks="umi" filename="addLaunchPoolBucket" /%}

### 3. Unlocked Bucket 추가

Unlocked bucket은 `triggerBehaviorsV2` 실행 후 Launch Pool에서 SOL을 받습니다.

{% code-tabs-imported from="genesis/add_unlocked_bucket_v2" frameworks="umi" filename="addUnlockedBucket" /%}

### 4. 최종화

모든 bucket이 구성되면 최종화하여 출시를 활성화합니다. 이 작업은 되돌릴 수 없습니다.

{% code-tabs-imported from="genesis/finalize_v2" frameworks="umi" filename="finalize" /%}

## 사용자 작업

### SOL 래핑

사용자는 예치하기 전에 SOL을 wSOL로 래핑해야 합니다.

{% code-tabs-imported from="genesis/wrap_sol" frameworks="umi" filename="wrapSol" /%}

### 예치

{% code-tabs-imported from="genesis/deposit_launch_pool_v2" frameworks="umi" filename="depositLaunchPool" /%}

같은 사용자의 여러 예치금은 단일 예치 계정에 누적됩니다.

### 출금

사용자는 예치 기간 동안 출금할 수 있습니다. {% fee product="genesis" config="launchPool" fee="withdraw" /%} 수수료가 적용됩니다.

{% code-tabs-imported from="genesis/withdraw_launch_pool_v2" frameworks="umi" filename="withdrawLaunchPool" /%}

사용자가 전체 잔액을 출금하면 예치 PDA가 닫힙니다.

### 토큰 청구

예치 기간이 종료되고 청구가 열린 후:

{% code-tabs-imported from="genesis/claim_launch_pool_v2" frameworks="umi" filename="claimLaunchPool" /%}

토큰 할당: `userTokens = (userDeposit / totalDeposits) * bucketTokenAllocation`

### 예치금 환불 {% #refunding-a-deposit %}

환불은 두 가지 경우에 가능합니다. 런칭이 `minimumQuoteTokenThreshold`에 미달한 경우(전액 환불) 또는 `softCap`을 초과한 경우(초과분만 환불)입니다. 두 경우 모두 같은 명령어를 사용합니다 — [refundLaunchPoolV2로 초과 예치금 환불하기](#refunding-excess-deposits-with-refund-launch-pool-v2)를 참조하세요.

## 관리자 작업

### `triggerBehaviorsV2` 실행

예치가 종료된 후 `triggerBehaviorsV2`를 실행하여 수집된 SOL을 Unlocked bucket으로 이동합니다.

{% code-tabs-imported from="genesis/trigger_launch_pool_v2" frameworks="umi" filename="triggerBehaviors" /%}

**이것이 중요한 이유:** `triggerBehaviorsV2`를 실행하지 않으면 수집된 SOL이 Launch Pool bucket에 잠겨 있습니다. 사용자는 여전히 토큰을 청구할 수 있지만, 팀은 모금된 자금에 접근할 수 없습니다.

## 레퍼런스

### 시간 조건

네 가지 조건이 Launch Pool 타이밍을 제어합니다:

| 조건 | 목적 |
|-----------|---------|
| `depositStartCondition` | 예치 시작 시점 |
| `depositEndCondition` | 예치 종료 시점 |
| `claimStartCondition` | 청구 시작 시점 |
| `claimEndCondition` | 청구 종료 시점 |

Unix 타임스탬프와 함께 `TimeAbsolute`을 사용합니다:

{% totem %}

```typescript
const condition = {
  __kind: 'TimeAbsolute',
  padding: Array(47).fill(0),
  time: BigInt(Math.floor(Date.now() / 1000) + 3600), // 1 hour from now
  triggeredTimestamp: null,
};
```

{% /totem %}

### End Behavior

예치 기간 후 수집된 SOL에 어떤 일이 발생하는지 정의합니다:

{% totem %}

```typescript
endBehaviors: [
  {
    __kind: 'SendQuoteTokenPercentage',
    padding: Array(4).fill(0),
    destinationBucket: publicKey(unlockedBucket),
    percentageBps: 10000, // 100% = 10000 basis points
    processed: false,
  },
]
```

{% /totem %}

여러 bucket에 자금을 분할할 수 있습니다:

{% totem %}

```typescript
endBehaviors: [
  {
    __kind: 'SendQuoteTokenPercentage',
    padding: Array(4).fill(0),
    destinationBucket: publicKey(treasuryBucket),
    percentageBps: 2000, // 20%
    processed: false,
  },
  {
    __kind: 'SendQuoteTokenPercentage',
    padding: Array(4).fill(0),
    destinationBucket: publicKey(liquidityBucket),
    percentageBps: 8000, // 80%
    processed: false,
  },
]
```

{% /totem %}

### Launch Pool 확장 {% #launch-pool-extensions %}

확장은 Launch Pool bucket에 구성하는 선택적 가드입니다. 모두 `addLaunchPoolBucketV2`로 설정하거나, `finalizeV2` 전에 `addLaunchPoolBucketV2Extensions` 및 `removeLaunchPoolBucketV2Extensions`로 개별적으로 추가하고 제거할 수 있습니다.

| 확장 | 타입 | 목적 |
|-----------|------|---------|
| `softCap` | `{ amount: bigint }` | 보유하는 quote 토큰의 상한; 초과분은 비례 환불 |
| `minimumQuoteTokenThreshold` | `{ amount: bigint }` | 이 값 미만이면 런칭이 실패하고 전액 환불이 열리는 하한 |
| `minimumDepositAmount` | `{ amount: bigint }` | 예치당 최소 quote 토큰 |
| `depositLimit` | `{ limit: bigint }` | 계정당 최대 quote 토큰 |
| `allowlist` | `Allowlist` | 허용 목록에 있는 지갑으로 예치를 제한 |
| `claimSchedule` | `ClaimSchedule` | 청구된 base 토큰을 시간에 따라 베스팅 |
| `bonusSchedule` | `LinearBpsScheduleV2` | 시간 가중 예치 보너스 |
| `depositPenalty` | `LinearBpsScheduleV2` | 시간 가중 예치 페널티 |
| `withdrawPenalty` | `LinearBpsScheduleV2` | 시간 가중 출금 페널티 |
| `backendSigner` | `BackendSigner` | 사용자 작업에 백엔드 공동 서명자를 요구 |

### 일반 오류 {% #common-errors %}

아래 오류는 잘못된 소프트 캡 구성과, `refundLaunchPoolV2`가 환불 요청을 거부하는 Launch Pool 상태를 다룹니다.

| 오류 | 코드 | 원인 |
|-------|------|-------|
| `InvalidSoftCap` | 221 | `softCap.amount`가 0입니다 — `0`으로 설정하지 말고 확장을 생략하세요 |
| `SoftCapBelowThreshold` | 222 | `softCap.amount`가 `minimumQuoteTokenThreshold.amount`보다 작습니다 |
| `LaunchPoolNotEnded` | — | 예치 기간이 닫히기 전에 `refundLaunchPoolV2`를 호출했습니다 |
| `LaunchPoolThresholdMet` | 173 | 하한을 충족했고 상한을 초과하지 않았는데 환불을 요청했습니다 |
| `DepositAlreadyRefunded` | — | 같은 예치금에 대해 `refundLaunchPoolV2`를 두 번 호출했습니다 |
| `DepositAlreadyClaimed` | — | 예치자가 이미 토큰을 청구한 후 전액 환불을 요청했습니다 |

### 상태 조회

**Bucket 상태:**

{% totem %}

```typescript
import { fetchLaunchPoolBucketV2 } from '@metaplex-foundation/genesis';

const bucket = await fetchLaunchPoolBucketV2(umi, launchPoolBucket);
console.log('Total deposits:', bucket.quoteTokenDepositTotal);
console.log('Deposit count:', bucket.depositCount);
console.log('Claim count:', bucket.claimCount);
console.log('Token allocation:', bucket.bucket.baseTokenAllocation);

// Soft cap state (Option<SoftCap>)
console.log('Soft cap:', bucket.extensions.softCap);
console.log('Floor:', bucket.extensions.minimumQuoteTokenThreshold);
```

{% /totem %}

**예치 상태:**

{% totem %}

```typescript
import { fetchLaunchPoolDepositV2, safeFetchLaunchPoolDepositV2 } from '@metaplex-foundation/genesis';

const deposit = await fetchLaunchPoolDepositV2(umi, depositPda); // throws if not found
const maybeDeposit = await safeFetchLaunchPoolDepositV2(umi, depositPda); // returns null

if (deposit) {
  console.log('Amount deposited:', deposit.amountQuoteToken);
  console.log('Claimed:', deposit.claimed);
  console.log('Refunded:', deposit.refunded);
}
```

{% /totem %}

## 참고 사항

- Launch Pool 사용자 예치·출금 수수료는 위 [수수료](#수수료)를 참고하세요.
- 같은 사용자의 여러 예치금은 하나의 예치 계정에 누적됩니다
- 사용자가 전체 잔액을 출금하면 예치 PDA가 닫힙니다
- End behavior를 처리하려면 예치 종료 후 `triggerBehaviorsV2`가 실행되어야 합니다
- 사용자는 예치하려면 wSOL (래핑된 SOL)이 있어야 합니다
- `softCap`은 `@metaplex-foundation/genesis` 0.42.0의 `addLaunchPoolBucketV2`에서 필수 인수입니다 — 상한을 원하지 않으면 `softCap: null`을 전달하세요
- `softCap`을 포함한 Launch Pool 확장은 `finalizeV2` 전에만 추가하거나 제거할 수 있습니다
- 소프트 캡은 Genesis 프로그램과 JavaScript SDK에서 지원됩니다. [`mplx` CLI](/ko/dev-tools/cli/genesis/launch-pool)는 아직 소프트 캡 플래그를 제공하지 않습니다
- 초과 청약된 Launch Pool은 각 예치자의 충당 부분이 올림되기 때문에 bucket에 최대 `depositCount - 1` 최소 단위의 반올림 먼지가 남습니다
- `quoteTokenDepositTotal`과 `depositCount`는 환불 후에도 이력 기록으로 보존되며, `refundCount`는 처리된 환불 수를 추적합니다

## FAQ

### Launch Pool에서 토큰 가격은 어떻게 결정되나요?
가격은 총 예치금을 기반으로 유기적으로 발견됩니다. 최종 가격은 총 예치된 SOL을 할당된 토큰으로 나눈 값입니다. 예치금이 많을수록 토큰당 암묵적 가격이 높아집니다.

### 사용자가 예치금을 출금할 수 있나요?
네, 사용자는 예치 기간 동안 출금할 수 있습니다. 시스템 악용을 방지하기 위해 {% fee product="genesis" config="launchPool" fee="withdraw" /%} 출금 수수료가 적용됩니다.

### 여러 번 예치하면 어떻게 되나요?
같은 지갑에서의 여러 예치금은 단일 예치 계정에 누적됩니다. 총 지분은 합산된 예치금을 기준으로 합니다.

### 사용자는 언제 토큰을 청구할 수 있나요?
예치 기간이 끝나고 청구 기간이 열린 후(`claimStartCondition`으로 정의됨)에 가능합니다. End behavior를 처리하기 위해 먼저 `triggerBehaviorsV2`가 실행되어야 합니다.

### Launch Pool과 Presale의 차이점은 무엇인가요?
Launch Pool은 비례 배분과 함께 예치금을 기반으로 유기적으로 가격을 발견합니다. Presale은 미리 정해진 고정 가격으로 상한까지 선착순 할당합니다.

### Launch Pool 소프트 캡이란 무엇인가요?
소프트 캡은 Launch Pool이 보유하는 quote 토큰의 상한이며 `softCap` 확장으로 설정합니다. 상한을 초과하는 예치금도 계속 받아들여지고 런칭은 그대로 성공하며, 초과분은 예치 기간이 끝난 후 비례적으로 환불됩니다.

### 소프트 캡과 최소 quote 토큰 임계값(minimum quote token threshold)의 차이점은 무엇인가요?
소프트 캡은 모금액의 상한이며 런칭을 실패시키지 않습니다. `minimumQuoteTokenThreshold`는 하한으로, 총 예치금이 이에 미달하면 런칭이 실패하고 모든 예치자가 전액 환불을 받을 수 있습니다. 두 확장은 별개이며 함께 사용할 수 있습니다.

### Launch Pool이 초과 청약되면 예치자가 받는 토큰이 줄어드나요?
아니요. 전체 base 토큰 할당량은 모든 예치금에 비례하여 그대로 배분됩니다. 초과 청약 시에는 토큰 할당량을 줄이는 대신 초과 quote 토큰을 환불하므로, 실효 가격은 `softCap / baseTokenAllocation`으로 제한됩니다.

### 소프트 캡이 Raydium 졸업 시작 가격을 변경하나요?
네. Launch Pool이 초과 청약된 경우 졸업 시작 가격은 원시 예치 총액이 아닌 상한이 적용된 수익금에서 산출되므로, `SendQuoteTokenPercentage`가 실제로 전달하는 금액과 일치합니다.

## 용어집

| 용어 | 정의 |
|------|------------|
| **Launch Pool** | 종료 시 가격이 발견되는 예치 기반 배포 |
| **Deposit Window** | 사용자가 SOL을 예치하고 출금할 수 있는 기간 |
| **Claim Window** | 사용자가 비례 토큰을 청구할 수 있는 기간 |
| **End Behavior** | 예치 기간 종료 후 실행되는 자동 작업 |
| **`triggerBehaviorsV2`** | End behavior를 처리하고 자금을 라우팅하는 명령어 |
| **Proportional Distribution** | 총 예치금에서의 사용자 지분에 따른 토큰 할당 |
| **Quote Token** | 사용자가 예치하는 토큰 (일반적으로 wSOL) |
| **Base Token** | 배포되는 토큰 |
| **Soft Cap** | Launch Pool이 보유하는 quote 토큰의 상한; 초과분은 비례 환불 |
| **Minimum Quote Token Threshold** | 이 값 미만이면 Launch Pool이 실패하고 전액 환불이 열리는 하한 |
| **Oversubscription** | 총 예치금이 설정된 소프트 캡을 초과하는 상태 |
| **Filled Portion** | 소프트 캡에 포함되어 런칭이 보유하는 예치금의 일부 |
| **Excess Refund** | 토큰 할당량은 유지한 채 소프트 캡을 초과한 예치금 부분을 반환하는 것 |

## 다음 단계

- [Presale](/ko/smart-contracts/genesis/presale) - 고정 가격 토큰 판매
- [Uniform Price Auction](/ko/smart-contracts/genesis/uniform-price-auction) - 입찰 기반 토큰 오퍼링
- [토큰 출시하기](/ko/tokens/launch-token) - 엔드투엔드 토큰 출시 가이드
- [Metaplex API](/ko/api) - API를 통한 런치 및 토큰 세일 데이터 조회
