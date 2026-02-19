---
title: Fetch Deposit State
metaTitle: Genesis - Fetch Deposit State | オンチェーン SDK | Metaplex
description: Genesis JavaScript SDKを使用してブロックチェーンからユーザーのデポジット状態を取得します。デポジット額とクレーム状態を確認できます。
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

Genesis JavaScript SDK を使用してブロックチェーンからユーザーのデポジット状態を直接取得します。デポジット額、クレーム状態、ユーザーがデポジットしたかどうかを確認できます。 {% .lead %}

{% callout type="note" %}
オンチェーンフェッチには [Umi](https://umi.typedoc.metaplex.com/) と [Genesis SDK](/smart-contracts/genesis/sdk/javascript) が必要です。
{% /callout %}

## メソッド

| メソッド | ローンチタイプ | 動作 |
|--------|-------------|----------|
| `fetchLaunchPoolDepositV2` | Launch Pool | 見つからない場合はスロー |
| `safeFetchLaunchPoolDepositV2` | Launch Pool | `null` を返す |
| `fetchPresaleDepositV2` | Presale | 見つからない場合はスロー |
| `safeFetchPresaleDepositV2` | Presale | `null` を返す |

## Launch Pool デポジット

```typescript
import {
  fetchLaunchPoolDepositV2,
  safeFetchLaunchPoolDepositV2,
} from '@metaplex-foundation/genesis';

// Throws if not found
const deposit = await fetchLaunchPoolDepositV2(umi, depositPda);

// Returns null if not found
const maybeDeposit = await safeFetchLaunchPoolDepositV2(umi, depositPda);

if (maybeDeposit) {
  console.log('Amount:', maybeDeposit.amountQuoteToken);
  console.log('Claimed:', maybeDeposit.claimed);
}
```

## Presale デポジット

```typescript
import {
  fetchPresaleDepositV2,
  safeFetchPresaleDepositV2,
} from '@metaplex-foundation/genesis';

// Throws if not found
const deposit = await fetchPresaleDepositV2(umi, depositPda);

// Returns null if not found
const maybeDeposit = await safeFetchPresaleDepositV2(umi, depositPda);

if (maybeDeposit) {
  console.log('Amount deposited:', maybeDeposit.amountQuoteToken);
  console.log('Amount claimed:', maybeDeposit.amountClaimed);
  console.log('Fully claimed:', maybeDeposit.claimed);
}
```

## ユーザーがデポジットしたかの確認

エラーをスローせずにユーザーがデポジット済みかどうかを確認するには、`safeFetch` バリアントを使用します：

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
