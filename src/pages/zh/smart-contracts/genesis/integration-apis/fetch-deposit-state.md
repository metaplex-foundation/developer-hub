---
title: Fetch Deposit State
metaTitle: Genesis - Fetch Deposit State | 链上 SDK | Metaplex
description: 使用Genesis JavaScript SDK从区块链获取用户存款状态。检查存款金额和领取状态。
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

使用 Genesis JavaScript SDK 直接从区块链获取用户存款状态。检查存款金额、领取状态以及用户是否已存款。 {% .lead %}

{% callout type="note" %}
链上获取需要 [Umi](https://umi.typedoc.metaplex.com/) 和 [Genesis SDK](/smart-contracts/genesis/sdk/javascript)。
{% /callout %}

## 方法

| 方法 | 发行类型 | 行为 |
|--------|-------------|----------|
| `fetchLaunchPoolDepositV2` | Launch Pool | 未找到时抛出异常 |
| `safeFetchLaunchPoolDepositV2` | Launch Pool | 返回 `null` |
| `fetchPresaleDepositV2` | Presale | 未找到时抛出异常 |
| `safeFetchPresaleDepositV2` | Presale | 返回 `null` |

## Launch Pool 存款

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

## Presale 存款

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

## 检查用户是否已存款

使用 `safeFetch` 变体来检查用户是否已存款，而不会抛出错误：

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
