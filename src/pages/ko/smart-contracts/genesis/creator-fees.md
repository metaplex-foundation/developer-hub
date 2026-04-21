---
title: Genesis 본딩 커브의 창작자 수수료
metaTitle: Genesis 본딩 커브 창작자 수수료 — 구성 및 청구 | Metaplex
description: Genesis 본딩 커브 런칭에서 창작자 수수료를 구성하고 활성 커브 중 및 Raydium CPMM 풀로 졸업한 후 누적 수수료를 청구하는 방법.
keywords:
  - creator fee
  - bonding curve
  - genesis
  - claimBondingCurveCreatorFeeV2
  - claimRaydiumCreatorFeeV2
  - creatorFeeWallet
  - creatorFeeAccrued
  - Raydium CPMM
  - token launch
  - Solana
about:
  - Creator Fees
  - Bonding Curve
  - Genesis
  - Solana
programmingLanguage:
  - JavaScript
  - TypeScript
proficiencyLevel: Intermediate
created: '04-09-2026'
updated: '04-09-2026'
howToSteps:
  - Set creatorFeeWallet in the launch object when calling createAndRegisterLaunch
  - After launch, monitor creatorFeeAccrued in the bucket account using fetchBondingCurveBucketV2
  - Call claimBondingCurveCreatorFeeV2 to collect accrued fees during the active curve
  - After graduation, call claimRaydiumCreatorFeeV2 to collect fees from the Raydium CPMM pool
howToTools:
  - Node.js
  - Umi framework
  - Genesis SDK
faqs:
  - q: creatorFeeWallet를 설정하지 않으면 기본 창작자 수수료 지갑은 무엇인가요?
    a: 기본값은 런칭 지갑입니다 — createLaunch 호출에 서명한 지갑입니다. 다른 주소로 수수료를 지정하려면 launch 객체에서 creatorFeeWallet을 명시적으로 설정하세요.
  - q: 창작자 수수료는 매 스왑마다 전송되나요?
    a: 아니요. 창작자 수수료는 각 스왑에서 버킷(creatorFeeAccrued)에 누적되지만 즉시 전송되지는 않습니다. 활성 커브 중에는 claimBondingCurveCreatorFeeV2를 호출하고, 졸업 후에는 claimRaydiumCreatorFeeV2를 호출하여 수수료를 수집하세요.
  - q: 누구든지 claimBondingCurveCreatorFeeV2를 호출할 수 있나요?
    a: 네. 3개의 권한 없는 수수료 명령어는 활성 커브와 졸업 후 단계 모두에 걸쳐 있습니다 — collectRaydiumCpmmFeesWithCreatorFeeV2와 claimBondingCurveCreatorFeeV2(활성 커브), 그리고 claimRaydiumCreatorFeeV2(졸업 후). 어떤 지갑도 트리거할 수 있지만 SOL은 항상 구성된 창작자 수수료 지갑으로 전송되며 호출자에게는 전송되지 않습니다.
  - q: 첫 번째 구매는 창작자 수수료를 납부하나요?
    a: 아니요. 첫 번째 구매가 구성되어 있으면 프로토콜 스왑 수수료와 창작자 수수료 모두 초기 구매에서 면제됩니다. 이후 모든 스왑에는 일반 창작자 수수료가 적용됩니다.
  - q: 누적된 창작자 수수료를 확인하는 방법은 무엇인가요?
    a: 활성 커브 중에는 fetchBondingCurveBucketV2를 사용하여 BondingCurveBucketV2에서 creatorFeeAccrued 필드를 읽으세요. 졸업 후에는 fetchRaydiumCpmmBucketV2를 사용하여 RaydiumCpmmBucketV2에서 creatorFeeAccrued를 읽으세요. 누적 창작자 수수료 확인 섹션을 참조하세요.
  - q: 런칭 후 창작자 수수료 지갑을 변경할 수 있나요?
    a: 아니요. 창작자 수수료 지갑은 커브 생성 시 설정되며 커브가 라이브된 후에는 변경할 수 없습니다.
---

창작자 수수료는 [Genesis 본딩 커브](/smart-contracts/genesis/bonding-curve)에서 매수와 매도마다 구성된 지갑에 누적되는 선택적 스왑당 수수료입니다. {% .lead %}

{% callout title="배울 내용" %}
- 런칭 시 창작자 수수료 지갑 구성
- 특정 지갑 또는 에이전트 PDA로 수수료 지정
- 버킷에 누적된 금액 확인
- 활성 커브 중 누적 수수료 청구
- Raydium CPMM 풀에서 졸업 후 수수료 청구
{% /callout %}

## 요약

창작자 수수료는 Genesis 본딩 커브에서 선택적 스왑당 수수료로, 모든 매수와 매도의 SOL 측면에 적용됩니다. 수수료는 버킷 계정(`creatorFeeAccrued`)에 누적되며 즉시 전송되지 않습니다 — 두 가지 권한 없는 명령어를 통해 수집하세요.

- **구성** — 커브 생성 시 `launch` 객체에서 `creatorFeeWallet`을 설정합니다; 생략하면 런칭 지갑이 기본값
- **누적** — `creatorFeeAccrued`가 매 스왑에서 증가합니다; 수수료는 스왑당 전송되지 않습니다
- **활성 커브 청구** — `claimBondingCurveCreatorFeeV2`가 커브가 라이브 중에 누적 수수료를 수집합니다
- **졸업 후 청구** — `claimRaydiumCreatorFeeV2`가 커브 졸업 후 Raydium CPMM 풀에서 수수료를 수집합니다

창작자 수수료가 스왑 가격 책정 및 프로토콜 스왑 수수료와 상호 작용하는 방법은 [운영 이론 — 수수료 구조](/smart-contracts/genesis/bonding-curve-theory#fee-structure)를 참조하세요.

## 빠른 시작

이 섹션에서는 활성 커브와 졸업 후 단계 모두에서 창작자 수수료를 구성하고 청구하는 최소 단계를 설명합니다.

### 빠른 참조

| 명령어 | 사용 시기 | 필요한 계정 | 출력 / 효과 |
|---|---|---|---|
| `createAndRegisterLaunch`(`creatorFeeWallet` 설정) | 커브 생성 시 | 창작자 지갑, 런칭 서명자 | 버킷에 수수료 지갑 구성 |
| `fetchBondingCurveBucketV2`(`creatorFeeAccrued` 읽기) | 활성 커브 중 아무 때나 | 버킷 PDA | 현재 누적 수수료 잔액(lamports) |
| `claimBondingCurveCreatorFeeV2` | 활성 커브 — 누적 수수료 수집 | Genesis 계정, 버킷 PDA, 베이스 민트, 창작자 수수료 지갑 | 누적 SOL이 창작자 지갑으로 전송 |
| `collectRaydiumCpmmFeesWithCreatorFeeV2` | 졸업 후 — LP 수수료 수확 | Genesis 계정, Raydium 풀 PDA, Raydium 버킷 PDA | LP 수수료가 Raydium 풀에서 Genesis 버킷으로 이동 |
| `claimRaydiumCreatorFeeV2` | 졸업 후 — 버킷 잔액 청구 | Genesis 계정, Raydium 버킷 PDA, 베이스/쿼트 민트, 창작자 수수료 지갑 | 버킷 잔액이 창작자 지갑으로 전송 |

**바로 가기:** [런칭 시 구성](#런칭-시-창작자-수수료-구성) · [지갑으로 지정](#특정-지갑으로-창작자-수수료-지정) · [에이전트 PDA](#에이전트-런칭-자동-pda-라우팅) · [첫 번째 구매와 결합](#창작자-수수료와-첫-번째-구매-결합) · [누적 확인](#누적-창작자-수수료-확인) · [커브 중 청구](#활성-커브-중-창작자-수수료-청구) · [졸업 후 청구](#졸업-후-창작자-수수료-청구)

1. `createAndRegisterLaunch`를 호출할 때 `launch` 객체에서 `creatorFeeWallet`을 설정합니다
2. 런칭 후 `bucket.creatorFeeAccrued`를 읽어 누적된 수수료를 모니터링합니다
3. `claimBondingCurveCreatorFeeV2`를 호출하여 커브가 활성 중에 수수료를 수집합니다
4. 졸업 후 `claimRaydiumCreatorFeeV2`를 호출하여 Raydium LP 수수료를 수집합니다

## 사전 요구 사항

Genesis SDK, 구성된 Umi 인스턴스 및 충전된 Solana 지갑이 필요합니다.

- `@metaplex-foundation/genesis` SDK 설치
- 키페어 ID로 구성된 Umi 인스턴스 — [Metaplex API를 통한 본딩 커브 런칭](/smart-contracts/genesis/bonding-curve-launch#umi-설정)을 참조하세요
- 트랜잭션 수수료를 위한 충전된 Solana 지갑

## 런칭 시 창작자 수수료 구성

창작자 수수료는 `createAndRegisterLaunch`(또는 `createLaunch`)에 전달되는 `launch` 객체에서 구성됩니다. `creatorFeeWallet` 필드는 선택 사항입니다 — 생략하면 런칭 지갑이 기본적으로 모든 수수료를 받습니다. 전체 런칭 흐름은 [Metaplex API를 통한 본딩 커브 런칭](/smart-contracts/genesis/bonding-curve-launch)을 참조하세요.

### 특정 지갑으로 창작자 수수료 지정

`creatorFeeWallet`을 설정하여 누적된 수수료를 런칭 지갑 이외의 지갑 주소로 지정합니다.

```typescript {% title="launch-with-creator-fee.ts" showLineNumbers=true %}
import { createAndRegisterLaunch } from '@metaplex-foundation/genesis/api';

const result = await createAndRegisterLaunch(umi, {}, {
  wallet: umi.identity.publicKey,
  launchType: 'bondingCurve',
  token: {
    name: 'My Token',
    symbol: 'MTK',
    image: 'https://gateway.irys.xyz/your-image-id',
  },
  launch: {
    creatorFeeWallet: 'FeeRecipientWalletAddress...',
  },
});
```

{% callout type="note" %}
창작자 수수료 지갑은 커브 생성 시 설정되며 커브가 라이브된 후에는 변경할 수 없습니다.
{% /callout %}

### 에이전트 런칭 — 자동 PDA 라우팅

Metaplex 에이전트를 대신하여 런칭할 때, `creatorFeeWallet`을 수동으로 설정하지 않아도 창작자 수수료가 에이전트의 PDA로 자동 라우팅됩니다. Core execute 래핑 및 `setToken` 연결을 포함한 전체 에이전트 런칭 흐름은 [에이전트 토큰 생성](/agents/create-agent-token)을 참조하세요.

### 창작자 수수료와 첫 번째 구매 결합

창작자 수수료 지갑과 첫 번째 구매를 함께 구성할 수 있습니다. 첫 번째 구매는 항상 수수료가 없습니다 — 초기 구매에는 프로토콜 수수료나 창작자 수수료가 적용되지 않습니다. 이후 모든 스왑에는 일반 창작자 수수료가 적용됩니다.

```typescript {% title="launch-with-fee-and-first-buy.ts" %}
launch: {
  creatorFeeWallet: 'FeeRecipientWalletAddress...',
  firstBuyAmount: 0.5, // 0.5 SOL, 첫 번째 구매자에게 수수료 없음
},
```

## 누적 창작자 수수료 확인

`BondingCurveBucketV2` 계정의 `creatorFeeAccrued` 필드는 마지막 청구 이후 누적된 SOL 합계를 추적합니다. `fetchBondingCurveBucketV2`를 사용하여 읽습니다:

```typescript {% title="check-creator-fees.ts" showLineNumbers=true %}
import {
  findBondingCurveBucketV2Pda,
  fetchBondingCurveBucketV2,
} from '@metaplex-foundation/genesis';
import { isSome, publicKey } from '@metaplex-foundation/umi';

const genesisAccount = publicKey('YOUR_GENESIS_ACCOUNT_PUBKEY');
const baseMint = publicKey('TOKEN_MINT_PUBKEY');

const [bucketPda] = findBondingCurveBucketV2Pda(umi, {
  genesisAccount,
  bucketIndex: 0,
});

const bucket = await fetchBondingCurveBucketV2(umi, bucketPda);
console.log('Creator fees accrued (lamports):', bucket.creatorFeeAccrued);
console.log('Creator fees claimed to date (lamports):', bucket.creatorFeeClaimed);

// 버킷 익스텐션에서 구성된 창작자 수수료 지갑 읽기
const creatorFeeExt = bucket.extensions.creatorFee;
const creatorFeeWallet = isSome(creatorFeeExt) ? creatorFeeExt.value.wallet : null;
console.log('Creator fee wallet:', creatorFeeWallet?.toString() ?? 'none configured');
```

## 활성 커브 중 창작자 수수료 청구

`claimBondingCurveCreatorFeeV2`는 버킷에서 구성된 창작자 수수료 지갑으로 누적된 모든 창작자 수수료를 전송합니다. 커브가 활성 중인 언제든지 호출할 수 있습니다.

```typescript {% title="claim-creator-fees.ts" showLineNumbers=true %}
import { claimBondingCurveCreatorFeeV2 } from '@metaplex-foundation/genesis';
import { isSome } from '@metaplex-foundation/umi';

// 청구 전에 버킷 익스텐션에서 창작자 수수료 지갑을 읽습니다.
const creatorFeeExt = bucket.extensions.creatorFee;
if (!isSome(creatorFeeExt)) throw new Error('No creator fee configured on this bucket');
const creatorFeeWallet = creatorFeeExt.value.wallet;

const result = await claimBondingCurveCreatorFeeV2(umi, {
  genesisAccount,
  bucket: bucketPda,
  baseMint,
  creatorFeeWallet,
}).sendAndConfirm(umi);

console.log('Creator fees claimed:', result.signature);
```

{% callout type="note" %}
`claimBondingCurveCreatorFeeV2`는 권한 없이 호출 가능합니다 — 어떤 지갑도 호출할 수 있지만 SOL은 항상 구성된 창작자 수수료 지갑으로 전송되며 호출자에게는 전송되지 않습니다.
{% /callout %}

## 졸업 후 창작자 수수료 청구

본딩 커브가 [졸업](/smart-contracts/genesis/bonding-curve-theory#phase-3-graduated)한 후, 유동성이 Raydium CPMM 풀로 이전되고 LP 거래 활동에서 창작자 수수료가 계속 누적됩니다. `RaydiumCpmmBucketV2` 계정은 `BondingCurveBucketV2`의 것과 유사한 `creatorFeeAccrued` 및 `creatorFeeClaimed` 필드를 노출합니다. 졸업 후 수수료는 `claimRaydiumCreatorFeeV2`로 수집합니다.

```typescript {% title="claim-raydium-creator-fees.ts" showLineNumbers=true %}
import { claimRaydiumCreatorFeeV2 } from '@metaplex-foundation/genesis';

const result = await claimRaydiumCreatorFeeV2(umi, {
  genesisAccount,
  // ... Raydium 풀 계정
}).sendAndConfirm(umi);
```

{% callout type="note" %}
본딩 커브에 해당하는 것과 마찬가지로, `claimRaydiumCreatorFeeV2`는 권한 없이 호출 가능합니다 — 어떤 지갑도 청구를 트리거할 수 있지만 SOL은 항상 구성된 창작자 수수료 지갑으로 전송됩니다.
{% /callout %}

## 참고 사항

다음 주의사항은 수수료 타이밍, 권한 없는 청구, 2단계 졸업 후 흐름 및 첫 번째 구매 수수료 면제에 대해 설명합니다.

- 창작자 수수료는 각 스왑에서 버킷(`creatorFeeAccrued`)에 누적되며 즉시 전송되지 않습니다 — 수수료를 받으려면 청구 명령어를 명시적으로 호출해야 합니다; `creatorFeeClaimed`는 현재까지 청구된 누적 합계를 추적합니다
- 두 청구 명령어 모두 권한 없이 호출 가능합니다: 어떤 지갑도 트리거할 수 있지만 SOL은 항상 구성된 창작자 수수료 지갑으로 전송됩니다
- `creatorFeeWallet`은 설정하지 않으면 런칭 지갑으로 기본 설정됩니다; 커브가 생성된 후에는 변경할 수 없습니다
- 첫 번째 구매 메커니즘은 지정된 초기 구매에 대해서만 모든 수수료(프로토콜 및 창작자)를 면제합니다; 이후 모든 스왑은 일반 창작자 수수료를 납부합니다
- 창작자 수수료는 방향(매수 또는 매도)에 관계없이 모든 스왑의 SOL 측면에 적용됩니다; 프로토콜 스왑 수수료와 복합적으로 계산되지 않습니다
- 현재 수수료율은 [Genesis 프로토콜 수수료](/smart-contracts/genesis) 페이지를 참조하세요
- 버킷 상태 읽기, 견적 계산, 거래 실행을 위한 스왑 측면 컨텍스트는 [본딩 커브 스왑 통합](/smart-contracts/genesis/bonding-curve-swaps)을 참조하세요

## FAQ

### `creatorFeeWallet`를 설정하지 않으면 기본 창작자 수수료 지갑은 무엇인가요?

기본 창작자 수수료 지갑은 런칭 지갑입니다 — `createLaunch` 호출에 서명한 지갑입니다. 다른 주소로 수수료를 지정하려면 `launch` 객체에서 `creatorFeeWallet`을 명시적으로 설정하세요.

### 창작자 수수료는 매 스왑마다 전송되나요?

아니요. 창작자 수수료는 각 스왑에서 버킷(`creatorFeeAccrued`)에 누적되지만 즉시 전송되지는 않습니다. 활성 커브 중에는 `claimBondingCurveCreatorFeeV2`를 호출하고, 졸업 후에는 `claimRaydiumCreatorFeeV2`를 호출하여 수수료를 수집하세요.

### 누구든지 `claimBondingCurveCreatorFeeV2`를 호출할 수 있나요?

네. 3개의 권한 없는 수수료 명령어는 활성 커브와 졸업 후 단계 모두에 걸쳐 있습니다 — `collectRaydiumCpmmFeesWithCreatorFeeV2`와 `claimBondingCurveCreatorFeeV2`(활성 커브), 그리고 `claimRaydiumCreatorFeeV2`(졸업 후). 어떤 지갑도 트리거할 수 있지만 SOL은 항상 구성된 창작자 수수료 지갑으로 전송되며 호출자에게는 전송되지 않습니다.

### 첫 번째 구매는 창작자 수수료를 납부하나요?

아니요. 첫 번째 구매가 구성되어 있으면 프로토콜 스왑 수수료와 창작자 수수료 모두 초기 구매에서 면제됩니다. 이후 모든 스왑에는 일반 창작자 수수료가 적용됩니다.

### 누적된 창작자 수수료를 확인하는 방법은 무엇인가요?

활성 커브 중에는 `fetchBondingCurveBucketV2`를 사용하여 `BondingCurveBucketV2`에서 `creatorFeeAccrued` 필드를 읽으세요. 졸업 후에는 `fetchRaydiumCpmmBucketV2`를 사용하여 `RaydiumCpmmBucketV2`에서 `creatorFeeAccrued`를 읽으세요. [누적 창작자 수수료 확인](#누적-창작자-수수료-확인)을 참조하세요.

### 런칭 후 창작자 수수료 지갑을 변경할 수 있나요?

아니요. 창작자 수수료 지갑은 커브 생성 시 설정되며 커브가 라이브된 후에는 변경할 수 없습니다.
