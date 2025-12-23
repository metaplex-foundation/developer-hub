---
title: Launch Pool
metaTitle: Genesis - Launch Pool
description: ユーザーが期間中に預金し、比例的にトークンを受け取るトークン配布方式。
---

Launch Poolは、自然な価格発見と限定的なスナイピングやフロントランニングのために設計されたトークンローンチメカニズムです。ユーザーは指定された期間中に預金し、期間終了時に総預金額に対する自分のシェアに比例してトークンを受け取ります。

仕組み：

1. 特定数量のトークンがLaunch Poolコントラクトに割り当てられます。Launch Poolは設定された期間中オープンしています。
2. Launch Poolがオープンしている間、ユーザーはSOLを預金または出金できます（出金手数料が適用されます）。
3. Launch Pool終了時、各ユーザーの総預金額に対するシェアに基づいてトークンが配布されます。

## 概要

Launch Poolのライフサイクル：

1. **預金期間** - ユーザーが定められた期間中にSOLを預金
2. **トランジション** - 終了動作を実行（例：収集されたSOLを別のバケットに送信）
3. **請求期間** - ユーザーが預金比重に比例してトークンを請求

## 手数料

- **ユーザー預金手数料**：預金額の2%
- **ユーザー出金手数料**：出金額の2%
- **グラデュエーション手数料**：預金期間終了時の総預金額の5%

預金手数料の例：10 SOLの預金で9.8 SOLがユーザーの預金アカウントに計上されます。

## Launch Poolのセットアップ

このガイドは、すでにGenesisアカウントを初期化していることを前提としています。初期化手順は[はじめに](/smart-contracts/genesis/getting-started)を参照してください。

### 1. Launch Poolバケットの追加

```typescript
import {
  addLaunchPoolBucketV2,
  findLaunchPoolBucketV2Pda,
  findUnlockedBucketV2Pda,
  NOT_TRIGGERED_TIMESTAMP,
} from '@metaplex-foundation/genesis';
import { publicKey } from '@metaplex-foundation/umi';

// バケットPDAを導出
const [launchPoolBucket] = findLaunchPoolBucketV2Pda(umi, {
  genesisAccount,
  bucketIndex: 0,
});

// オプション：ローンチ後にクォートトークンを受け取るアンロックバケット
const [unlockedBucket] = findUnlockedBucketV2Pda(umi, {
  genesisAccount,
  bucketIndex: 0,
});

// タイミングを定義
const now = BigInt(Math.floor(Date.now() / 1000));
const depositStart = now;
const depositEnd = now + 86400n; // 24時間
const claimStart = depositEnd + 1n;
const claimEnd = claimStart + 604800n; // 1週間の請求期間

// デフォルトスケジュール（ペナルティ/ボーナスなし）
const defaultSchedule = {
  slopeBps: 0n,
  interceptBps: 0n,
  maxBps: 0n,
  startTime: 0n,
  endTime: 0n,
};

await addLaunchPoolBucketV2(umi, {
  genesisAccount,
  baseMint: baseMint.publicKey,
  baseTokenAllocation: 1_000_000_000_000n, // このバケット用のトークン
  depositStartCondition: {
    __kind: 'TimeAbsolute',
    padding: Array(47).fill(0),
    time: depositStart,
    triggeredTimestamp: NOT_TRIGGERED_TIMESTAMP,
  },
  depositEndCondition: {
    __kind: 'TimeAbsolute',
    padding: Array(47).fill(0),
    time: depositEnd,
    triggeredTimestamp: NOT_TRIGGERED_TIMESTAMP,
  },
  claimStartCondition: {
    __kind: 'TimeAbsolute',
    padding: Array(47).fill(0),
    time: claimStart,
    triggeredTimestamp: NOT_TRIGGERED_TIMESTAMP,
  },
  claimEndCondition: {
    __kind: 'TimeAbsolute',
    padding: Array(47).fill(0),
    time: claimEnd,
    triggeredTimestamp: NOT_TRIGGERED_TIMESTAMP,
  },
  depositPenalty: defaultSchedule,
  withdrawPenalty: defaultSchedule,
  bonusSchedule: defaultSchedule,
  minimumDepositAmount: null,
  // 預金終了後、収集されたSOLの100%をアンロックバケットに送信
  endBehaviors: [
    {
      __kind: 'SendQuoteTokenPercentage',
      padding: Array(4).fill(0),
      destinationBucket: publicKey(unlockedBucket),
      percentageBps: 10000, // ベーシスポイントで100%
      processed: false,
    },
  ],
}).sendAndConfirm(umi);
```

### 2. アンロックバケットの追加（オプション）

Launch Poolが`SendQuoteTokenPercentage`を使用して収集されたSOLを転送する場合、送信先バケットが必要です：

```typescript
import { addUnlockedBucketV2 } from '@metaplex-foundation/genesis';

await addUnlockedBucketV2(umi, {
  genesisAccount,
  baseMint: baseMint.publicKey,
  baseTokenAllocation: 0n, // ベーストークンなし、クォートトークンのみ受け取る
  recipient: umi.identity.publicKey,
  claimStartCondition: {
    __kind: 'TimeAbsolute',
    padding: Array(47).fill(0),
    time: claimStart,
    triggeredTimestamp: NOT_TRIGGERED_TIMESTAMP,
  },
  claimEndCondition: {
    __kind: 'TimeAbsolute',
    padding: Array(47).fill(0),
    time: claimEnd,
    triggeredTimestamp: NOT_TRIGGERED_TIMESTAMP,
  },
  backendSigner: { signer: backendSigner.publicKey },
}).sendAndConfirm(umi);
```

### 3. Genesisアカウントの確定

すべてのバケットが設定されたら、ローンチ構成を確定します：

```typescript
import { finalizeV2 } from '@metaplex-foundation/genesis';

await finalizeV2(umi, {
  baseMint: baseMint.publicKey,
  genesisAccount,
}).sendAndConfirm(umi);
```

## ユーザー操作

### 預金

ユーザーは預金期間中にwSOLを預金します。預金には2%の手数料が適用されます。

```typescript
import {
  depositLaunchPoolV2,
  findLaunchPoolDepositV2Pda,
} from '@metaplex-foundation/genesis';

const depositAmount = 10_000_000_000n; // ランポート単位で10 SOL

await depositLaunchPoolV2(umi, {
  genesisAccount,
  bucket: launchPoolBucket,
  baseMint: baseMint.publicKey,
  amountQuoteToken: depositAmount,
}).sendAndConfirm(umi);

// 預金を確認
const [depositPda] = findLaunchPoolDepositV2Pda(umi, {
  bucket: launchPoolBucket,
  recipient: umi.identity.publicKey,
});

const deposit = await fetchLaunchPoolDepositV2(umi, depositPda);
console.log('預金額（2%手数料後）:', deposit.amountQuoteToken);
```

同じユーザーからの複数の預金は単一の預金アカウントに累積されます。

### 出金

ユーザーは預金期間中に出金できます。出金には2%の手数料が適用されます。

```typescript
import { withdrawLaunchPoolV2 } from '@metaplex-foundation/genesis';

// 部分出金
await withdrawLaunchPoolV2(umi, {
  genesisAccount,
  bucket: launchPoolBucket,
  baseMint: baseMint.publicKey,
  amountQuoteToken: 3_000_000_000n, // 3 SOL
}).sendAndConfirm(umi);
```

ユーザーが全残高を出金すると、預金PDAはクローズされます。

### トークン請求

預金期間終了後、請求が開始されると、ユーザーは預金比重に比例してトークンを請求します：

```typescript
import { claimLaunchPoolV2 } from '@metaplex-foundation/genesis';

await claimLaunchPoolV2(umi, {
  genesisAccount,
  bucket: launchPoolBucket,
  baseMint: baseMint.publicKey,
  recipient: umi.identity.publicKey,
}).sendAndConfirm(umi);
```

トークン割り当て式：
```
userTokens = (userDeposit / totalDeposits) * bucketTokenAllocation
```

## トランジションの実行

預金期間終了後、トランジションを実行して終了動作を処理します：

```typescript
import { transitionV2, WRAPPED_SOL_MINT } from '@metaplex-foundation/genesis';
import { findAssociatedTokenPda } from '@metaplex-foundation/mpl-toolbox';

// 送信先バケットのクォートトークンアカウントを取得
const unlockedBucketQuoteTokenAccount = findAssociatedTokenPda(umi, {
  owner: unlockedBucket,
  mint: WRAPPED_SOL_MINT,
});

await transitionV2(umi, {
  genesisAccount,
  primaryBucket: launchPoolBucket,
  baseMint: baseMint.publicKey,
})
  .addRemainingAccounts([
    {
      pubkey: unlockedBucket,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: publicKey(unlockedBucketQuoteTokenAccount),
      isSigner: false,
      isWritable: true,
    },
  ])
  .sendAndConfirm(umi);
```

## 終了動作

終了動作は、預金期間後に収集されたクォートトークンに何が起こるかを定義します：

### SendQuoteTokenPercentage

収集されたSOLの一定割合を別のバケットに送信：

```typescript
endBehaviors: [
  {
    __kind: 'SendQuoteTokenPercentage',
    padding: Array(4).fill(0),
    destinationBucket: publicKey(unlockedBucket),
    percentageBps: 10000, // 100% = 10000 bps
    processed: false,
  },
]
```

複数のバケットに資金を分割できます：

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

## 時間条件

Launch Poolのタイミングは4つの条件で制御されます：

| 条件 | 説明 |
|-----------|-------------|
| `depositStartCondition` | ユーザーが預金を開始できるタイミング |
| `depositEndCondition` | 預金が終了するタイミング |
| `claimStartCondition` | ユーザーがトークン請求を開始できるタイミング |
| `claimEndCondition` | 請求が終了するタイミング |

特定のタイムスタンプには`TimeAbsolute`を使用：

```typescript
{
  __kind: 'TimeAbsolute',
  padding: Array(47).fill(0),
  time: BigInt(Math.floor(Date.now() / 1000) + 3600), // 今から1時間後
  triggeredTimestamp: NOT_TRIGGERED_TIMESTAMP,
}
```

## 状態の取得

### バケット状態

```typescript
import { fetchLaunchPoolBucketV2 } from '@metaplex-foundation/genesis';

const bucket = await fetchLaunchPoolBucketV2(umi, launchPoolBucket);

console.log('総預金額:', bucket.quoteTokenDepositTotal);
console.log('預金回数:', bucket.depositCount);
console.log('請求回数:', bucket.claimCount);
console.log('トークン割り当て:', bucket.bucket.baseTokenAllocation);
```

### 預金状態

```typescript
import {
  fetchLaunchPoolDepositV2,
  safeFetchLaunchPoolDepositV2,
} from '@metaplex-foundation/genesis';

// 見つからない場合はエラーをスロー
const deposit = await fetchLaunchPoolDepositV2(umi, depositPda);

// 見つからない場合はnullを返す
const maybeDeposit = await safeFetchLaunchPoolDepositV2(umi, depositPda);

if (deposit) {
  console.log('金額:', deposit.amountQuoteToken);
  console.log('請求済み:', deposit.claimed);
}
```

## 次のステップ

- [Priced Sale](/smart-contracts/genesis/priced-sale) - 取引前の事前預金収集
- [アグリゲーションAPI](/smart-contracts/genesis/aggregation) - APIを通じたローンチデータの照会
- [Launch Pool](https://github.com/metaplex-foundation/genesis/tree/main/clients/js/examples/launch-pool) - GitHubのサンプル実装
