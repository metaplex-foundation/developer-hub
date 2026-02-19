---
title: Fetch Deposit State
metaTitle: Genesis - Fetch Deposit State | On-Chain SDK | Metaplex
description: Fetch user deposit state from the blockchain using the Genesis JavaScript SDK. Check deposit amounts and claim status.
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

Fetch user deposit state directly from the blockchain using the Genesis JavaScript SDK. Check deposit amounts, claim status, and whether a user has deposited. {% .lead %}

{% callout type="note" %}
On-chain fetching requires [Umi](https://umi.typedoc.metaplex.com/) and the [Genesis SDK](/smart-contracts/genesis/sdk/javascript).
{% /callout %}

## Methods

| Method | Launch Type | Behavior |
|--------|-------------|----------|
| `fetchLaunchPoolDepositV2` | Launch Pool | Throws if not found |
| `safeFetchLaunchPoolDepositV2` | Launch Pool | Returns `null` if not found |
| `fetchPresaleDepositV2` | Presale | Throws if not found |
| `safeFetchPresaleDepositV2` | Presale | Returns `null` if not found |

## Launch Pool Deposits

```typescript
import {
  fetchLaunchPoolDepositV2,
  safeFetchLaunchPoolDepositV2,
} from '@metaplex-foundation/genesis';

// Throws if not found — use when you expect the deposit to exist
const deposit = await fetchLaunchPoolDepositV2(umi, depositPda);
console.log('Amount:', deposit.amountQuoteToken);
console.log('Claimed:', deposit.claimed);

// Returns null if not found — use for optional lookups
const maybeDeposit = await safeFetchLaunchPoolDepositV2(umi, depositPda);
if (maybeDeposit) {
  console.log('Amount:', maybeDeposit.amountQuoteToken);
}
```

## Presale Deposits

```typescript
import {
  fetchPresaleDepositV2,
  safeFetchPresaleDepositV2,
} from '@metaplex-foundation/genesis';

// Throws if not found — use when you expect the deposit to exist
const deposit = await fetchPresaleDepositV2(umi, depositPda);
console.log('Amount deposited:', deposit.amountQuoteToken);
console.log('Amount claimed:', deposit.amountClaimed);
console.log('Fully claimed:', deposit.claimed);

// Returns null if not found — use for optional lookups
const maybeDeposit = await safeFetchPresaleDepositV2(umi, depositPda);
if (maybeDeposit) {
  console.log('Amount deposited:', maybeDeposit.amountQuoteToken);
}
```

## Checking if a User Has Deposited

Use the `safeFetch` variants to check if a user has deposited without throwing an error:

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
