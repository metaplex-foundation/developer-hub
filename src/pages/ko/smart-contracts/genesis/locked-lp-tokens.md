---
title: Locked LP Tokens
metaTitle: 졸업 시 LP 토큰 잠금 | Genesis Bonding Curve | Metaplex
description: Genesis 본딩 커브가 졸업하면 Raydium CPMM 풀의 LP 토큰은 베스팅이 never로 설정된 Genesis 버킷에 프로그램 잠금됩니다. 온체인에서 잠금을 검증하는 방법을 알아보세요.
created: '04-22-2026'
updated: '04-22-2026'
keywords:
  - locked LP tokens
  - LP token lock
  - graduation
  - bonding curve graduation
  - Raydium CPMM
  - program locked
  - program locked liquidity
  - Genesis
  - LP burn
  - liquidity lock
about:
  - LP token locking
  - Bonding curve graduation
  - Raydium CPMM liquidity
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: 졸업 중에 LP 토큰은 소각되나요, 잠기나요?
    a: LP 토큰은 소각되지 않고 프로그램 잠금됩니다. Genesis 버킷 서명자 PDA가 소유한 연관 토큰 계정으로 전송됩니다. 버킷의 lpLockSchedule은 startCondition과 cliffCondition이 모두 Never로 설정되어 있어 어떤 지갑도 청구할 수 없습니다.
  - q: 잠긴 LP 토큰을 누군가 인출할 수 있나요?
    a: 아니요. RaydiumCpmmBucketV2 계정의 lpLockSchedule은 startCondition과 cliffCondition이 모두 Never로 설정되어 있습니다. 이를 해제할 수 있는 명령어나 권한은 없습니다.
  - q: LP 토큰이 온체인에서 잠겨 있는지 어떻게 확인할 수 있나요?
    a: Genesis SDK를 사용하여 RaydiumCpmmBucketV2 계정을 가져오고 extensions.lpLockSchedule의 startCondition.__kind와 cliffCondition.__kind가 모두 Never로 설정되어 있는지 확인하세요. lpTokenBalance 필드는 보유 중인 LP 토큰의 정확한 수를 보여줍니다.
  - q: LP 토큰을 소각하는 것과 프로그램 잠금하는 것의 차이점은 무엇인가요?
    a: 소각은 SPL token burn 명령어를 통해 토큰을 파괴하여 유통에서 영구적으로 제거합니다. 프로그램 잠금은 베스팅을 never로 설정한 PDA로 토큰을 전송합니다 — 토큰은 온체인에 존재하며 검증 가능하지만 어떤 지갑도 인출할 수 없습니다. 두 접근 방식 모두 유동성을 영구적으로 만듭니다.
---

[본딩 커브 졸업](/ko/smart-contracts/genesis/bonding-curve#lifecycle) 중에 생성된 LP 토큰은 Genesis 소유 버킷에 프로그램 잠금됩니다. 어떤 지갑도 인출할 수 없습니다. {% .lead %}

## 요약

Genesis 본딩 커브가 매진되어 [Raydium CPMM](/ko/smart-contracts/genesis/bonding-curve-theory#phase-3-graduated) 풀로 졸업하면 결과로 생성된 LP 토큰은 Genesis 프로그램이 소유한 PDA로 전송됩니다. 이 버킷의 베스팅 스케줄은 `Never`로 설정되어 토큰에 접근할 수 없게 됩니다.

- **LP 토큰은 소각되지 않습니다** — 베스팅이 never로 설정된 Genesis 버킷 서명자 PDA로 전송됩니다
- **프로그램 잠금** — `lpLockSchedule.startCondition`과 `cliffCondition`이 모두 `Never`이므로 어떤 명령어나 권한도 해제할 수 없습니다
- **온체인에서 검증 가능** — `RaydiumCpmmBucketV2` 계정을 가져와서 잠금 스케줄과 토큰 잔액을 확인할 수 있습니다
- **자동으로 발생** — 잠금은 졸업 프로세스의 일부로 발생하며 수동 단계는 필요 없습니다

## LP 토큰 잠금 작동 방식

졸업 중에 LP 토큰은 **버킷 서명자 PDA**(개인 키가 없는 프로그램 파생 주소)가 소유한 ATA에 입금됩니다. `RaydiumCpmmBucketV2` 계정은 `lpLockSchedule.startCondition`과 `cliffCondition`을 모두 `{ __kind: 'Never' }`로 설정하여 인출을 방지합니다.

{% callout type="note" %}
일부 플랫폼은 이를 LP 토큰 "소각"이라고 부릅니다. Genesis에서는 LP 토큰이 소각 주소로 전송되지 않으며 검증 가능한 온체인 계정에 남아 있습니다. **프로그램 잠금**이라는 용어가 더 정확합니다. 토큰이 존재하고 감사 가능하지만 어떤 지갑도 접근할 수 없기 때문입니다.
{% /callout %}

### 졸업 흐름

1. 본딩 커브가 매진됩니다(`baseTokenBalance`가 0에 도달)
2. 졸업이 자동으로 시작됩니다 — 누적된 SOL과 토큰이 Raydium CPMM 풀로 마이그레이션됩니다
3. Raydium이 LP 토큰을 Genesis 프로그램에 반환합니다
4. LP 토큰이 버킷 서명자의 ATA에 입금됩니다
5. `lpLockSchedule.startCondition`과 `cliffCondition`이 `Never`로 설정됩니다 — LP 토큰이 프로그램 잠금됩니다

## LP 토큰 잠금 검증

`RaydiumCpmmBucketV2` 계정을 가져오고 `lpLockSchedule` 확장을 검사하여 LP 토큰이 잠겨 있는지 확인합니다.

### 계정 파생

LP 토큰 잠금을 구성하는 세 가지 계정:

| 계정 | 설명 | 파생 방법 |
|---------|-------------|---------------|
| **Raydium Bucket PDA** | 졸업 상태와 잠금 설정을 저장하는 `RaydiumCpmmBucketV2` 계정 | `findRaydiumCpmmBucketV2Pda(umi, { genesisAccount, bucketIndex })` |
| **Bucket Signer PDA** | LP 토큰 ATA를 소유하는 PDA — 개인 키 없음 | `findRaydiumBucketSignerPda(umi, { bucket })` |
| **Bucket Signer ATA** | 잠긴 LP 토큰을 보유하는 연관 토큰 계정 | 버킷 서명자 + LP 민트를 사용한 표준 ATA 파생 |

### 잠금 가져오기 및 확인

```typescript {% title="verify-lp-lock.ts" showLineNumbers=true %}
import {
  genesis,
  findRaydiumCpmmBucketV2Pda,
  fetchRaydiumCpmmBucketV2,
  findRaydiumBucketSignerPda,
  findLpMintPda,
  RAYDIUM_CP_SWAP_PROGRAM_ID_MAINNET,
} from '@metaplex-foundation/genesis';
import { publicKey } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { findAssociatedTokenPda } from '@metaplex-foundation/mpl-toolbox';

const umi = createUmi('https://api.mainnet-beta.solana.com').use(genesis());

const genesisAccount = publicKey('YOUR_GENESIS_ACCOUNT_PUBKEY');

// 1. Derive the Raydium bucket PDA
const [raydiumBucketPda] = findRaydiumCpmmBucketV2Pda(umi, {
  genesisAccount,
  bucketIndex: 0,
});

// 2. Fetch the bucket account
const raydiumBucket = await fetchRaydiumCpmmBucketV2(umi, raydiumBucketPda);

// 3. Check the LP lock schedule
const lpLockSchedule = raydiumBucket.extensions.lpLockSchedule;

if (lpLockSchedule.__option === 'Some') {
  const schedule = lpLockSchedule.value;
  console.log('LP lock start condition:', schedule.startCondition.__kind);
  console.log('LP lock cliff condition:', schedule.cliffCondition.__kind);
  // Expected output: both "Never"
}

console.log('LP token balance:', raydiumBucket.lpTokenBalance);

// 4. Derive the bucket signer PDA
const [bucketSignerPda] = findRaydiumBucketSignerPda(umi, {
  bucket: raydiumBucketPda,
});

console.log('Bucket signer (LP token owner):', bucketSignerPda);

// 5. Derive the LP mint from the pool state
const [lpMint] = findLpMintPda(umi, RAYDIUM_CP_SWAP_PROGRAM_ID_MAINNET, raydiumBucket.poolState);

// 6. Derive the bucket signer's ATA for the LP mint
const [bucketSignerAta] = findAssociatedTokenPda(umi, {
  mint: lpMint,
  owner: bucketSignerPda,
});

console.log('LP mint:', lpMint);
console.log('Bucket signer ATA (holds LP tokens):', bucketSignerAta);
```

### 예상 출력

LP 토큰이 프로그램 잠금되어 있을 때 출력은 다음을 확인합니다:

```
LP lock start condition: Never
LP lock cliff condition: Never
LP token balance: 123456789
Bucket signer (LP token owner): <PDA address>
LP mint: <LP mint address>
Bucket signer ATA (holds LP tokens): <ATA address>
```

`startCondition.__kind` 값이 `Never`라는 것은 베스팅이 시작되지 않음을 확인하고, `cliffCondition`의 `Never`는 클리프 해제가 없음을 확인합니다. 함께 LP 토큰을 인출할 수 없음을 증명합니다.

## RaydiumCpmmBucketV2 계정 필드

LP 토큰 잠금과 관련된 `RaydiumCpmmBucketV2` 계정의 주요 필드:

| 필드 | 타입 | 설명 |
|-------|------|-------------|
| `lpTokenBalance` | `bigint` | 버킷 서명자의 ATA에 보유된 LP 토큰 수 |
| `lpClaimAuthority` | `Option<PublicKey>` | LP 토큰을 청구할 수 있는 권한 — 권한이 설정되지 않은 경우 `None` |
| `lpTokensClaimed` | `bigint` | 누적 청구된 LP 토큰(완전히 잠긴 경우 0) |
| `bucketSigner` | `PublicKey` | LP 토큰을 보유하는 ATA를 소유하는 PDA |
| `extensions.lpLockSchedule` | `Option<ClaimSchedule>` | LP 토큰의 베스팅 스케줄 — `startCondition`이 `Never`로 설정됨 |
| `poolState` | `PublicKey` | Raydium CPMM 풀 상태 계정 주소(LP 민트가 아님 — LP 민트를 얻으려면 풀 상태를 읽으세요) |

### ClaimSchedule 필드

`lpLockSchedule` 확장은 다음 필드를 가진 `ClaimSchedule`입니다:

| 필드 | 타입 | 설명 |
|-------|------|-------------|
| `startCondition` | `Condition` | 청구가 시작될 수 있는 시점 — 프로그램 잠금의 경우 `{ __kind: 'Never' }` |
| `duration` | `bigint` | 베스팅 기간(초)(시작이 `Never`인 경우 무관) |
| `period` | `bigint` | 베스팅 기간 간격(시작이 `Never`인 경우 무관) |
| `cliffCondition` | `Condition` | 베스팅의 클리프 조건 — LP 잠금의 경우에도 `{ __kind: 'Never' }` |
| `cliffAmountBps` | `number` | 클리프 해제 비율(베이시스 포인트)(시작이 `Never`인 경우 무관) |

{% callout type="note" %}
`duration`, `period`, `cliffAmountBps` 필드는 `ClaimSchedule` 구조체에 존재하지만 `startCondition`과 `cliffCondition`이 모두 `Never`인 경우 기능적으로 무관합니다. 베스팅이나 클리프 해제 모두 시작될 수 없습니다.
{% /callout %}


## FAQ

### 졸업 중에 LP 토큰은 소각되나요, 잠기나요?

LP 토큰은 소각되지 않고 프로그램 잠금됩니다. Genesis 버킷 서명자 PDA가 소유한 [연관 토큰 계정](/ko/solana/understanding-solana-accounts#associated-token-accounts-atas)으로 전송됩니다. 버킷의 `lpLockSchedule`은 `startCondition`과 `cliffCondition`이 모두 `Never`로 설정되어 있어 어떤 지갑도 청구할 수 없습니다.

### 잠긴 LP 토큰을 누군가 인출할 수 있나요?

아니요. `RaydiumCpmmBucketV2` 계정의 `lpLockSchedule`은 `startCondition`과 `cliffCondition`이 모두 `Never`로 설정되어 있습니다. 이를 해제할 수 있는 명령어나 권한은 없습니다.

### LP 토큰이 온체인에서 잠겨 있는지 어떻게 확인할 수 있나요?

Genesis SDK를 사용하여 `RaydiumCpmmBucketV2` 계정을 가져오고 `extensions.lpLockSchedule`의 `startCondition.__kind`와 `cliffCondition.__kind`가 모두 `Never`로 설정되어 있는지 확인하세요. `lpTokenBalance` 필드는 보유 중인 LP 토큰의 정확한 수를 보여줍니다. 전체 코드 예제는 [LP 토큰 잠금 검증](#lp-토큰-잠금-검증)을 참조하세요.

### LP 토큰을 소각하는 것과 프로그램 잠금하는 것의 차이점은 무엇인가요?

소각은 SPL token burn 명령어를 통해 토큰을 파괴하여 유통에서 영구적으로 제거합니다. 프로그램 잠금은 베스팅을 `Never`로 설정한 PDA로 토큰을 전송합니다 — 토큰은 온체인에 존재하며 검증 가능하지만 어떤 지갑도 인출할 수 없습니다. 두 접근 방식 모두 유동성을 영구적으로 만듭니다.

## 용어집

| 용어 | 정의 |
|------|------------|
| **Graduation** | 본딩 커브가 매진될 때 트리거되는 자동 프로세스 — 누적된 SOL과 토큰을 Raydium CPMM 풀로 마이그레이션 |
| **LP Token** | Raydium CPMM 풀의 지분을 나타내는 유동성 공급자 토큰 |
| **Program-Locked** | 인출 경로가 없는 PDA 소유 계정에 보유된 토큰 — 접근 불가능하지만 온체인에서 검증 가능 |
| **Bucket Signer PDA** | LP 토큰을 보유하는 ATA를 소유하는 프로그램 파생 주소; 개인 키 없음 |
| **ClaimSchedule** | 시작 조건, 기간, 간격, 클리프를 가진 베스팅 구성 — Raydium 버킷에서 LP 토큰 해제 규칙을 정의하는 데 사용 |
| **Condition: Never** | 절대 충족될 수 없는 조건 변형 — `lpLockSchedule`의 `startCondition`과 `cliffCondition` 모두로 사용되어 LP 토큰 청구를 방지 |
| **RaydiumCpmmBucketV2** | Raydium 풀 참조, LP 토큰 잔액, 잠금 스케줄을 포함한 졸업 후 상태를 저장하는 Genesis 계정 |
