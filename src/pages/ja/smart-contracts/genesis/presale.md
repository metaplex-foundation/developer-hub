---
title: Presale
metaTitle: Genesis - Presale | 固定価格トークン販売 | Metaplex
description: ユーザーが SOL を入金し、事前に決められたレートでトークンを受け取る固定価格トークン販売。価格を事前に設定し、制御された配布を実現します。
created: '01-15-2025'
updated: '01-31-2026'
keywords:
  - presale
  - fixed price sale
  - token presale
  - ICO
  - token sale
  - fixed pricing
about:
  - Presale mechanics
  - Fixed pricing
  - Token sales
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
howToSteps:
  - トークン割り当てで Genesis Account を初期化する
  - 価格と上限を設定した Presale bucket を追加する
  - 収集した資金用の Unlocked bucket を追加する
  - ファイナライズして Presale を入金可能にする
howToTools:
  - Node.js
  - Umi framework
  - Genesis SDK
faqs:
  - q: Presale でのトークン価格はどのように計算されますか？
    a: 価格は SOL 上限をトークン割り当てで割った値です。1,000,000 トークンで 100 SOL の上限の場合、価格は 1 トークンあたり 0.0001 SOL になります。
  - q: SOL の上限に達しなかった場合はどうなりますか？
    a: ユーザーは入金額に比例してトークンを受け取ります。100 SOL の上限に対して 50 SOL しか入金されなかった場合、入金者は割り当てトークンの 50% を受け取ります。
  - q: ユーザーごとの入金上限を設定できますか？
    a: はい。minimumDepositAmount でトランザクションごとの最低額を、depositLimit でユーザーごとの最大入金総額を設定できます。
  - q: Presale と Launch Pool の違いは何ですか？
    a: Presale はトークン割り当てと SOL 上限で決定される固定価格です。Launch Pool は入金総額に基づいて価格が自然に決定されます。
  - q: Presale と Launch Pool のどちらを使うべきですか？
    a: 予測可能な価格設定が必要で、調達額を正確に把握したい場合は Presale を使用してください。自然な価格発見には Launch Pool を使用してください。
---

**Presale** は固定価格でのトークン配布を提供します。割り当てと SOL 上限に基づいてトークン価格を事前に設定します。ユーザーは受け取る量を正確に把握でき、あなたは調達額を正確に把握できます。 {% .lead %}

{% callout title="学習内容" %}
このガイドでは以下を説明します：
- Presale の価格設定の仕組み（割り当て + 上限 = 価格）
- 入金ウィンドウと請求期間の設定
- 入金上限とクールダウンの設定
- ユーザー操作：SOL のラップ、入金、請求
{% /callout %}

## 概要

Presale は事前に決められた価格でトークンを販売します。価格は設定したトークン割り当てと SOL 上限から計算されます。

- 固定価格 = SOL 上限 / トークン割り当て
- ユーザーは入金ウィンドウ中に SOL を入金（{% fee product="genesis" config="presale" fee="deposit" /%} の手数料が適用）
- SOL 上限まで先着順
- オプション：最低/最大入金上限、クールダウン、バックエンド認証

## 対象外

自然な価格発見（[Launch Pool](/smart-contracts/genesis/launch-pool) を参照）、入札ベースのオークション（[Uniform Price Auction](/smart-contracts/genesis/uniform-price-auction) を参照）、およびべスティングスケジュールは本ガイドの対象外です。

## 仕組み

1. SOL 上限で固定価格を決定し、Presale にトークンを割り当てる
2. ユーザーが入金ウィンドウ中に固定レートで SOL を入金する
3. 入金期間終了後、Transition を実行して資金を移動する
4. ユーザーが入金額に基づいてトークンを請求する

### 価格計算

トークン価格は割り当てトークン数と SOL 上限の比率で決まります：

```
price = allocationQuoteTokenCap / baseTokenAllocation
tokens = deposit / price
```

例えば、1,000,000 トークンを 100 SOL の上限で割り当てた場合：
- 価格 = 100 SOL / 1,000,000 トークン = 1 トークンあたり 0.0001 SOL
- 10 SOL の入金で 100,000 トークンを受け取る

### 手数料

{% protocol-fees program="genesis" config="presale" showTitle=false /%}

## クイックスタート

{% totem %}
{% totem-accordion title="完全なセットアップスクリプトを表示" %}

開始日と終了日を設定した Presale のセットアップ方法を示します。最低入金額、最大入金額、またはバックエンド署名者を追加することもできます。ユーザー向けアプリを構築するには、[ユーザー操作](#user-operations)を参照してください。

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplToolbox } from '@metaplex-foundation/mpl-toolbox';
import {
  genesis,
  initializeV2,
  findGenesisAccountV2Pda,
  addPresaleBucketV2,
  findPresaleBucketV2Pda,
  addUnlockedBucketV2,
  findUnlockedBucketV2Pda,
  finalizeV2,
  NOT_TRIGGERED_TIMESTAMP,
} from '@metaplex-foundation/genesis';
import { generateSigner, publicKey, sol } from '@metaplex-foundation/umi';

async function setupPresale() {
  const umi = createUmi('https://api.mainnet-beta.solana.com')
    .use(mplToolbox())
    .use(genesis());

  // umi.use(keypairIdentity(yourKeypair));

  const baseMint = generateSigner(umi);
  const backendSigner = generateSigner(umi);
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
  const depositEnd = now + 86400n;
  const claimStart = depositEnd + 1n;
  const claimEnd = claimStart + 604800n;

  // 3. Derive bucket PDAs
  const [presaleBucket] = findPresaleBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 });
  const [unlockedBucket] = findUnlockedBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 });

  // 4. Add Presale bucket
  await addPresaleBucketV2(umi, {
    genesisAccount,
    baseMint: baseMint.publicKey,
    baseTokenAllocation: TOTAL_SUPPLY,
    allocationQuoteTokenCap: sol(100).basisPoints, // 100 SOL cap
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
    minimumDepositAmount: null,
    endBehaviors: [
      {
        __kind: 'SendQuoteTokenPercentage',
        padding: Array(4).fill(0),
        destinationBucket: publicKey(unlockedBucket),
        percentageBps: 10000,
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

  // 6. Finalize
  await finalizeV2(umi, {
    baseMint: baseMint.publicKey,
    genesisAccount,
  }).sendAndConfirm(umi);

  console.log('Presale active!');
  console.log('Token:', baseMint.publicKey);
  console.log('Genesis:', genesisAccount);
}

setupPresale().catch(console.error);
```

{% /totem-accordion %}
{% /totem %}

## セットアップガイド

### 前提条件

{% totem %}

```bash
npm install @metaplex-foundation/genesis @metaplex-foundation/umi @metaplex-foundation/umi-bundle-defaults @metaplex-foundation/mpl-toolbox
```

{% /totem %}

### 1. Genesis Account の初期化

Genesis Account はトークンを作成し、すべての配布 bucket を調整します。

{% totem %}

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplToolbox } from '@metaplex-foundation/mpl-toolbox';
import {
  genesis,
  initializeV2,
  findGenesisAccountV2Pda,
} from '@metaplex-foundation/genesis';
import { generateSigner, keypairIdentity } from '@metaplex-foundation/umi';

const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(mplToolbox())
  .use(genesis());

// umi.use(keypairIdentity(yourKeypair));

const baseMint = generateSigner(umi);
const TOTAL_SUPPLY = 1_000_000_000_000_000n; // 1 million tokens (9 decimals)

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
```

{% /totem %}

{% callout type="note" %}
`totalSupplyBaseToken` はすべての bucket 割り当ての合計と一致する必要があります。
{% /callout %}

### 2. Presale Bucket の追加

Presale bucket は入金を収集し、トークンを配布します。タイミングとオプションの上限をここで設定します。

{% totem %}

```typescript
import {
  addPresaleBucketV2,
  findPresaleBucketV2Pda,
  findUnlockedBucketV2Pda,
  NOT_TRIGGERED_TIMESTAMP,
} from '@metaplex-foundation/genesis';
import { publicKey, sol } from '@metaplex-foundation/umi';

const [presaleBucket] = findPresaleBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 });
const [unlockedBucket] = findUnlockedBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 });

const now = BigInt(Math.floor(Date.now() / 1000));
const depositStart = now;
const depositEnd = now + 86400n; // 24 hours
const claimStart = depositEnd + 1n;
const claimEnd = claimStart + 604800n; // 1 week

await addPresaleBucketV2(umi, {
  genesisAccount,
  baseMint: baseMint.publicKey,
  baseTokenAllocation: TOTAL_SUPPLY,
  allocationQuoteTokenCap: 100_000_000_000n, // 100 SOL cap (sets price)

  // Timing
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

  // Optional: Deposit limits
  minimumDepositAmount: null, // or { amount: sol(0.1).basisPoints }
  depositLimit: null, // or { limit: sol(10).basisPoints }

  // Where collected SOL goes after transition
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
```

{% /totem %}

### 3. Unlocked Bucket の追加

Unlocked bucket は Transition 後に Presale から SOL を受け取ります。

{% totem %}

```typescript
import { addUnlockedBucketV2 } from '@metaplex-foundation/genesis';
import { generateSigner } from '@metaplex-foundation/umi';

const backendSigner = generateSigner(umi);

await addUnlockedBucketV2(umi, {
  genesisAccount,
  baseMint: baseMint.publicKey,
  baseTokenAllocation: 0n,
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

{% /totem %}

### 4. ファイナライズ

すべての bucket が設定されたら、ファイナライズして Presale を有効化します。この操作は元に戻せません。

{% totem %}

```typescript
import { finalizeV2 } from '@metaplex-foundation/genesis';

await finalizeV2(umi, {
  baseMint: baseMint.publicKey,
  genesisAccount,
}).sendAndConfirm(umi);
```

{% /totem %}

## ユーザー操作

### SOL のラップ

ユーザーは入金前に SOL を wSOL にラップする必要があります。

{% totem %}

```typescript
import {
  findAssociatedTokenPda,
  createTokenIfMissing,
  transferSol,
  syncNative,
} from '@metaplex-foundation/mpl-toolbox';
import { WRAPPED_SOL_MINT } from '@metaplex-foundation/genesis';
import { publicKey, sol } from '@metaplex-foundation/umi';

const userWsolAccount = findAssociatedTokenPda(umi, {
  owner: umi.identity.publicKey,
  mint: WRAPPED_SOL_MINT,
});

await createTokenIfMissing(umi, {
  mint: WRAPPED_SOL_MINT,
  owner: umi.identity.publicKey,
  token: userWsolAccount,
})
  .add(
    transferSol(umi, {
      destination: publicKey(userWsolAccount),
      amount: sol(1),
    })
  )
  .add(syncNative(umi, { account: userWsolAccount }))
  .sendAndConfirm(umi);
```

{% /totem %}

### 入金

{% totem %}

```typescript
import {
  depositPresaleV2,
  findPresaleDepositV2Pda,
  fetchPresaleDepositV2,
} from '@metaplex-foundation/genesis';
import { sol } from '@metaplex-foundation/umi';

await depositPresaleV2(umi, {
  genesisAccount,
  bucket: presaleBucket,
  baseMint: baseMint.publicKey,
  amountQuoteToken: sol(1).basisPoints,
}).sendAndConfirm(umi);

// Verify
const [depositPda] = findPresaleDepositV2Pda(umi, {
  bucket: presaleBucket,
  recipient: umi.identity.publicKey,
});
const deposit = await fetchPresaleDepositV2(umi, depositPda);
console.log('Deposited (after fee):', deposit.amountQuoteToken);
```

{% /totem %}

同じユーザーからの複数回の入金は、1 つの入金アカウントに累積されます。

### トークンの請求

入金期間が終了し、請求が開始された後：

{% totem %}

```typescript
import { claimPresaleV2 } from '@metaplex-foundation/genesis';

await claimPresaleV2(umi, {
  genesisAccount,
  bucket: presaleBucket,
  baseMint: baseMint.publicKey,
  recipient: umi.identity.publicKey,
}).sendAndConfirm(umi);
```

{% /totem %}

トークン割り当て：`userTokens = (userDeposit / allocationQuoteTokenCap) * baseTokenAllocation`

## 管理者操作

### Transition の実行

入金が締め切られた後、Transition を実行して収集した SOL を Unlocked bucket に移動します。

{% totem %}

```typescript
import { transitionV2, WRAPPED_SOL_MINT } from '@metaplex-foundation/genesis';
import { findAssociatedTokenPda } from '@metaplex-foundation/mpl-toolbox';
import { publicKey } from '@metaplex-foundation/umi';

const unlockedBucketQuoteTokenAccount = findAssociatedTokenPda(umi, {
  owner: unlockedBucket,
  mint: WRAPPED_SOL_MINT,
});

await transitionV2(umi, {
  genesisAccount,
  primaryBucket: presaleBucket,
  baseMint: baseMint.publicKey,
})
  .addRemainingAccounts([
    { pubkey: unlockedBucket, isSigner: false, isWritable: true },
    { pubkey: publicKey(unlockedBucketQuoteTokenAccount), isSigner: false, isWritable: true },
  ])
  .sendAndConfirm(umi);
```

{% /totem %}

**これが重要な理由：** Transition を実行しないと、収集した SOL は Presale bucket にロックされたままになります。ユーザーはトークンを請求できますが、チームは調達した資金にアクセスできません。

## リファレンス

### 設定オプション

これらのオプションは Presale bucket の作成時に設定します：

| オプション | 説明 | 例 |
|--------|-------------|---------|
| `minimumDepositAmount` | トランザクションごとの最低入金額 | `{ amount: sol(0.1).basisPoints }` |
| `depositLimit` | ユーザーごとの最大入金総額 | `{ limit: sol(10).basisPoints }` |
| `depositCooldown` | 入金間の待機時間 | `{ seconds: 60n }` |
| `perCooldownDepositLimit` | クールダウン期間ごとの最大入金額 | `{ amount: sol(1).basisPoints }` |
| `backendSigner` | バックエンド認証の要求 | `{ signer: publicKey }` |

### Time Condition

4 つの条件で Presale のタイミングを制御します：

| 条件 | 目的 |
|-----------|---------|
| `depositStartCondition` | 入金が開始されるタイミング |
| `depositEndCondition` | 入金が締め切られるタイミング |
| `claimStartCondition` | 請求が開始されるタイミング |
| `claimEndCondition` | 請求が締め切られるタイミング |

Unix タイムスタンプで `TimeAbsolute` を使用します：

{% totem %}

```typescript
import { NOT_TRIGGERED_TIMESTAMP } from '@metaplex-foundation/genesis';

const condition = {
  __kind: 'TimeAbsolute',
  padding: Array(47).fill(0),
  time: BigInt(Math.floor(Date.now() / 1000) + 3600), // 1 hour from now
  triggeredTimestamp: NOT_TRIGGERED_TIMESTAMP,
};
```

{% /totem %}

### End Behavior

入金期間後に収集した SOL の処理方法を定義します：

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

### 状態の取得

**Bucket の状態：**

{% totem %}

```typescript
import { fetchPresaleBucketV2 } from '@metaplex-foundation/genesis';

const bucket = await fetchPresaleBucketV2(umi, presaleBucket);
console.log('Total deposits:', bucket.quoteTokenDepositTotal);
console.log('Deposit count:', bucket.depositCount);
console.log('Token allocation:', bucket.bucket.baseTokenAllocation);
console.log('SOL cap:', bucket.allocationQuoteTokenCap);
```

{% /totem %}

**入金の状態：**

{% totem %}

```typescript
import { fetchPresaleDepositV2, safeFetchPresaleDepositV2 } from '@metaplex-foundation/genesis';

const deposit = await fetchPresaleDepositV2(umi, depositPda); // throws if not found
const maybeDeposit = await safeFetchPresaleDepositV2(umi, depositPda); // returns null

if (deposit) {
  console.log('Amount deposited:', deposit.amountQuoteToken);
  console.log('Amount claimed:', deposit.amountClaimed);
  console.log('Fully claimed:', deposit.claimed);
}
```

{% /totem %}

## 注意事項

- 入金には {% fee product="genesis" config="presale" fee="deposit" /%} のプロトコル手数料が適用されます
- ユーザーは入金前に SOL を wSOL にラップする必要があります
- 同じユーザーからの複数回の入金は 1 つの入金アカウントに累積されます
- チームが資金にアクセスするには、入金締め切り後に Transition を実行する必要があります
- ファイナライズは永続的です。`finalizeV2` を呼び出す前にすべての設定を十分に確認してください

## FAQ

### Presale でのトークン価格はどのように計算されますか？
価格は SOL 上限をトークン割り当てで割った値です。1,000,000 トークンで 100 SOL の上限の場合、価格は 1 トークンあたり 0.0001 SOL になります。

### SOL の上限に達しなかった場合はどうなりますか？
ユーザーは入金額に比例してトークンを受け取ります。100 SOL の上限に対して 50 SOL しか入金されなかった場合、入金者は割り当てトークンの 50% を受け取ります。

### ユーザーごとの入金上限を設定できますか？
はい。`minimumDepositAmount` でトランザクションごとの最低額を、`depositLimit` でユーザーごとの最大入金総額を設定できます。

### Presale と Launch Pool の違いは何ですか？
Presale はトークン割り当てと SOL 上限で決定される固定価格です。Launch Pool は入金総額に基づいて価格が自然に決定されます。

### Presale と Launch Pool のどちらを使うべきですか？
予測可能な価格設定が必要で、調達額を正確に把握したい場合は Presale を使用してください。自然な価格発見には Launch Pool を使用してください。

## 用語集

| 用語 | 定義 |
|------|------------|
| **Presale** | 事前に決められたレートでの固定価格トークン販売 |
| **SOL Cap** | Presale が受け入れる最大 SOL 額（価格を決定） |
| **Token Allocation** | Presale で利用可能なトークン数 |
| **Deposit Limit** | ユーザーごとに許可される最大入金総額 |
| **Minimum Deposit** | 入金トランザクションごとに必要な最低額 |
| **Cooldown** | ユーザーが入金間に待機する必要がある時間 |
| **End Behavior** | 入金期間終了後の自動アクション |
| **Transition** | End Behavior を処理するインストラクション |

## 次のステップ

- [Launch Pool](/smart-contracts/genesis/launch-pool) - 自然な価格発見
- [Uniform Price Auction](/smart-contracts/genesis/uniform-price-auction) - 入札ベースの割り当て
- [Getting Started](/smart-contracts/genesis/getting-started) - Genesis の基礎
