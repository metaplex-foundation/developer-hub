---
title: Fetch Deposit State
metaTitle: Genesis - Fetch Deposit State | 온체인 SDK | Metaplex
description: Genesis JavaScript SDK를 사용하여 블록체인에서 사용자 예치 상태를 조회합니다. 예치 금액과 클레임 상태를 확인할 수 있습니다.
method: CHAIN
created: '01-15-2025'
updated: '01-31-2026'
keywords:
  - Genesis SDK
  - deposit state
  - on-chain fetching
  - user deposits
  - claim status
about:
  - On-chain data
  - Deposit state
  - SDK methods
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
---

Genesis JavaScript SDK를 사용하여 블록체인에서 직접 사용자 예치 상태를 조회합니다. 예치 금액, 클레임 상태, 사용자가 예치했는지 여부를 확인할 수 있습니다. {% .lead %}

{% callout type="note" %}
온체인 조회에는 [Umi](https://umi.typedoc.metaplex.com/)와 [Genesis SDK](/smart-contracts/genesis/sdk/javascript)가 필요합니다.
{% /callout %}

## 메서드

| 메서드 | 런치 유형 | 동작 |
|--------|-------------|----------|
| `fetchLaunchPoolDepositV2` | Launch Pool | 찾을 수 없으면 예외 발생 |
| `safeFetchLaunchPoolDepositV2` | Launch Pool | `null` 반환 |
| `fetchPresaleDepositV2` | Presale | 찾을 수 없으면 예외 발생 |
| `safeFetchPresaleDepositV2` | Presale | `null` 반환 |

## Launch Pool 예치

```typescript
import {
  fetchLaunchPoolDepositV2,
  safeFetchLaunchPoolDepositV2,
} from '@metaplex-foundation/genesis';

// Throws if not found
const deposit = await fetchLaunchPoolDepositV2(umi, depositPda);

// Returns null if not found
const maybeDeposit = await safeFetchLaunchPoolDepositV2(umi, depositPda);

if (deposit) {
  console.log('Amount:', deposit.amountQuoteToken);
  console.log('Claimed:', deposit.claimed);
}
```

## Presale 예치

```typescript
import {
  fetchPresaleDepositV2,
  safeFetchPresaleDepositV2,
} from '@metaplex-foundation/genesis';

// Throws if not found
const deposit = await fetchPresaleDepositV2(umi, depositPda);

// Returns null if not found
const maybeDeposit = await safeFetchPresaleDepositV2(umi, depositPda);

if (deposit) {
  console.log('Amount deposited:', deposit.amountQuoteToken);
  console.log('Amount claimed:', deposit.amountClaimed);
  console.log('Fully claimed:', deposit.claimed);
}
```

## 사용자가 예치했는지 확인

`safeFetch` 변형을 사용하면 오류를 발생시키지 않고 사용자의 예치 여부를 확인할 수 있습니다:

```typescript
import {
  safeFetchLaunchPoolDepositV2,
  safeFetchPresaleDepositV2,
  findLaunchPoolDepositV2Pda,
  findPresaleDepositV2Pda,
} from '@metaplex-foundation/genesis';

// Launch Pool
const [lpDepositPda] = findLaunchPoolDepositV2Pda(umi, {
  bucket: launchPoolBucket,
  recipient: userPublicKey,
});
const lpDeposit = await safeFetchLaunchPoolDepositV2(umi, lpDepositPda);
const hasLpDeposit = lpDeposit !== null;

// Presale
const [psDepositPda] = findPresaleDepositV2Pda(umi, {
  bucket: presaleBucket,
  recipient: userPublicKey,
});
const psDeposit = await safeFetchPresaleDepositV2(umi, psDepositPda);
const hasPsDeposit = psDeposit !== null;
```
