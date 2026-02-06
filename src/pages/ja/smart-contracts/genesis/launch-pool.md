---
title: Launch Pool
metaTitle: Genesis - Launch Pool | 公平なトークン配布 | Metaplex
description: ユーザーがウィンドウ期間中に入金し、比例配分でトークンを受け取るトークン配布方式。スナイピング対策設計による自然な価格発見メカニズム。
created: '01-15-2025'
updated: '01-31-2026'
keywords:
  - launch pool
  - token distribution
  - fair launch
  - proportional distribution
  - deposit window
  - price discovery
about:
  - Launch pools
  - Price discovery
  - Token distribution
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
howToSteps:
  - トークンを使用して Genesis Account を初期化する
  - 入金ウィンドウ設定を持つ Launch Pool bucket を追加する
  - 集めた資金を受け取る Unlocked bucket を追加する
  - ファイナライズし、ユーザーがウィンドウ期間中に入金できるようにする
howToTools:
  - Node.js
  - Umi framework
  - Genesis SDK
faqs:
  - q: Launch Pool でトークン価格はどのように決まりますか？
    a: 価格は総入金額に基づいて自然に発見されます。最終価格は、入金された SOL の総額を割り当てられたトークン数で割った値になります。入金が多いほど、トークンあたりの暗黙の価格が高くなります。
  - q: ユーザーは入金を引き出せますか？
    a: はい、入金期間中に引き出すことができます。システムの悪用を防ぐため、{% fee product="genesis" config="launchPool" fee="withdraw" /%} の引き出し手数料が適用されます。
  - q: 複数回入金するとどうなりますか？
    a: 同じウォレットからの複数の入金は、単一の入金アカウントに蓄積されます。あなたの合計シェアは、合算された入金額に基づきます。
  - q: ユーザーはいつトークンを請求できますか？
    a: 入金期間が終了し、請求ウィンドウが開いた後（claimStartCondition で定義）に請求できます。End Behavior を処理するために、先に Transition を実行する必要があります。
  - q: Launch Pool と Presale の違いは何ですか？
    a: Launch Pool は入金に基づいて自然に価格を発見し、比例配分で配布します。Presale は事前に固定価格が設定され、上限に達するまで先着順で割り当てられます。
---

**Launch Pool** はトークンローンチのための自然な価格発見メカニズムを提供します。ユーザーはウィンドウ期間中に入金し、総入金額に対する自分のシェアに比例してトークンを受け取ります。スナイピングなし、フロントランニングなし、全員にとって公平な配布です。 {% .lead %}

{% callout title="学べること" %}
このガイドでは以下を説明します：
- Launch Pool の価格設定と配布の仕組み
- 入金ウィンドウと請求ウィンドウの設定方法
- 資金回収のための End Behavior の設定
- ユーザー操作：入金、引き出し、請求
{% /callout %}

## 概要

Launch Pool は定義されたウィンドウ期間中に入金を受け付け、その後トークンを比例配分で配布します。最終的なトークン価格は、総入金額をトークン割り当て量で割って決定されます。

- ユーザーは入金ウィンドウ期間中に SOL を入金します（{% fee product="genesis" config="launchPool" fee="deposit" /%} の手数料が適用）
- 入金期間中は引き出しが可能です（{% fee product="genesis" config="launchPool" fee="withdraw" /%} の手数料）
- トークン配布は入金シェアに比例します
- End Behavior が集められた SOL をトレジャリー bucket にルーティングします

## 対象外

固定価格販売（[Presale](/smart-contracts/genesis/presale) を参照）、入札ベースのオークション（[Uniform Price Auction](/smart-contracts/genesis/uniform-price-auction) を参照）、流動性プール作成（Raydium/Orca を使用）。

## クイックスタート

{% totem %}
{% totem-accordion title="完全なセットアップスクリプトを表示" %}

これは入金ウィンドウと請求ウィンドウを持つ Launch Pool のセットアップ方法を示しています。ユーザー向けアプリの構築については、[ユーザー操作](#ユーザー操作)を参照してください。

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
  NOT_TRIGGERED_TIMESTAMP,
} from '@metaplex-foundation/genesis';
import { generateSigner, publicKey } from '@metaplex-foundation/umi';

async function setupLaunchPool() {
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

  console.log('Launch Pool active!');
  console.log('Token:', baseMint.publicKey);
  console.log('Genesis:', genesisAccount);
}

setupLaunchPool().catch(console.error);
```

{% /totem-accordion %}
{% /totem %}

## 仕組み

1. 特定量のトークンが Launch Pool bucket に割り当てられます
2. ユーザーは入金ウィンドウ期間中に SOL を入金します（手数料付きで引き出し可能）
3. ウィンドウが閉じると、入金シェアに基づいてトークンが比例配分されます

### 価格発見

トークン価格は総入金額から決まります：

```
tokenPrice = totalDeposits / tokenAllocation
userTokens = (userDeposit / totalDeposits) * tokenAllocation
```

**例：** 1,000,000 トークンが割り当てられ、総入金額が 100 SOL の場合 = 1トークンあたり 0.0001 SOL

### ライフサイクル

1. **入金期間** - ユーザーは定義されたウィンドウ期間中に SOL を入金します
2. **Transition** - End Behavior が実行されます（例：集められた SOL を別の bucket に送信）
3. **請求期間** - ユーザーは入金の重みに比例してトークンを請求します

## 手数料

{% protocol-fees program="genesis" config="launchPool" showTitle=false /%}

入金手数料の例：ユーザーが 10 SOL を入金すると、ユーザーの入金アカウントには 9.8 SOL がクレジットされます。

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
`totalSupplyBaseToken` は、すべての bucket 割り当ての合計と等しくなるようにしてください。
{% /callout %}

### 2. Launch Pool Bucket の追加

Launch Pool bucket は入金を収集し、トークンを比例配分で配布します。ここでタイミングを設定します。

{% totem %}

```typescript
import {
  addLaunchPoolBucketV2,
  findLaunchPoolBucketV2Pda,
  findUnlockedBucketV2Pda,
  NOT_TRIGGERED_TIMESTAMP,
} from '@metaplex-foundation/genesis';
import { publicKey } from '@metaplex-foundation/umi';

const [launchPoolBucket] = findLaunchPoolBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 });
const [unlockedBucket] = findUnlockedBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 });

const now = BigInt(Math.floor(Date.now() / 1000));
const depositStart = now;
const depositEnd = now + 86400n; // 24 hours
const claimStart = depositEnd + 1n;
const claimEnd = claimStart + 604800n; // 1 week

await addLaunchPoolBucketV2(umi, {
  genesisAccount,
  baseMint: baseMint.publicKey,
  baseTokenAllocation: TOTAL_SUPPLY,

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

  // Optional: Minimum deposit
  minimumDepositAmount: null, // or { amount: sol(0.1).basisPoints }

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

Unlocked bucket は Transition 後に Launch Pool から SOL を受け取ります。

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

すべての bucket が設定されたら、ファイナライズしてローンチを有効化します。この操作は取り消せません。

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

### SOL のラッピング

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
      amount: sol(10),
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
  depositLaunchPoolV2,
  findLaunchPoolDepositV2Pda,
  fetchLaunchPoolDepositV2,
} from '@metaplex-foundation/genesis';
import { sol } from '@metaplex-foundation/umi';

await depositLaunchPoolV2(umi, {
  genesisAccount,
  bucket: launchPoolBucket,
  baseMint: baseMint.publicKey,
  amountQuoteToken: sol(10).basisPoints,
}).sendAndConfirm(umi);

// Verify
const [depositPda] = findLaunchPoolDepositV2Pda(umi, {
  bucket: launchPoolBucket,
  recipient: umi.identity.publicKey,
});
const deposit = await fetchLaunchPoolDepositV2(umi, depositPda);
console.log('Deposited (after fee):', deposit.amountQuoteToken);
```

{% /totem %}

同じユーザーからの複数の入金は、単一の入金アカウントに蓄積されます。

### 引き出し

ユーザーは入金期間中に引き出すことができます。{% fee product="genesis" config="launchPool" fee="withdraw" /%} の手数料が適用されます。

{% totem %}

```typescript
import { withdrawLaunchPoolV2 } from '@metaplex-foundation/genesis';
import { sol } from '@metaplex-foundation/umi';

await withdrawLaunchPoolV2(umi, {
  genesisAccount,
  bucket: launchPoolBucket,
  baseMint: baseMint.publicKey,
  amountQuoteToken: sol(3).basisPoints,
}).sendAndConfirm(umi);
```

{% /totem %}

ユーザーが残高全額を引き出すと、入金 PDA はクローズされます。

### トークンの請求

入金期間が終了し、請求が開始された後：

{% totem %}

```typescript
import { claimLaunchPoolV2 } from '@metaplex-foundation/genesis';

await claimLaunchPoolV2(umi, {
  genesisAccount,
  bucket: launchPoolBucket,
  baseMint: baseMint.publicKey,
  recipient: umi.identity.publicKey,
}).sendAndConfirm(umi);
```

{% /totem %}

トークン割り当て：`userTokens = (userDeposit / totalDeposits) * bucketTokenAllocation`

## 管理者操作

### Transition の実行

入金が終了した後、Transition を実行して集められた SOL を Unlocked bucket に移動します。

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
  primaryBucket: launchPoolBucket,
  baseMint: baseMint.publicKey,
})
  .addRemainingAccounts([
    { pubkey: unlockedBucket, isSigner: false, isWritable: true },
    { pubkey: publicKey(unlockedBucketQuoteTokenAccount), isSigner: false, isWritable: true },
  ])
  .sendAndConfirm(umi);
```

{% /totem %}

**これが重要な理由：** Transition を行わないと、集められた SOL は Launch Pool bucket にロックされたままになります。ユーザーはトークンを請求できますが、チームは調達した資金にアクセスできません。

## リファレンス

### Time Condition

4つの条件が Launch Pool のタイミングを制御します：

| 条件 | 目的 |
|------|------|
| `depositStartCondition` | 入金の開始タイミング |
| `depositEndCondition` | 入金の終了タイミング |
| `claimStartCondition` | 請求の開始タイミング |
| `claimEndCondition` | 請求の終了タイミング |

`TimeAbsolute` をUnixタイムスタンプと共に使用します：

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

入金期間後に集められた SOL の処理方法を定義します：

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

資金を複数の bucket に分割することもできます：

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

### 状態の取得

**Bucket の状態：**

{% totem %}

```typescript
import { fetchLaunchPoolBucketV2 } from '@metaplex-foundation/genesis';

const bucket = await fetchLaunchPoolBucketV2(umi, launchPoolBucket);
console.log('Total deposits:', bucket.quoteTokenDepositTotal);
console.log('Deposit count:', bucket.depositCount);
console.log('Claim count:', bucket.claimCount);
console.log('Token allocation:', bucket.bucket.baseTokenAllocation);
```

{% /totem %}

**入金の状態：**

{% totem %}

```typescript
import { fetchLaunchPoolDepositV2, safeFetchLaunchPoolDepositV2 } from '@metaplex-foundation/genesis';

const deposit = await fetchLaunchPoolDepositV2(umi, depositPda); // throws if not found
const maybeDeposit = await safeFetchLaunchPoolDepositV2(umi, depositPda); // returns null

if (deposit) {
  console.log('Amount deposited:', deposit.amountQuoteToken);
  console.log('Claimed:', deposit.claimed);
}
```

{% /totem %}

## 注意事項

- {% fee product="genesis" config="launchPool" fee="deposit" /%} のプロトコル手数料が入金と引き出しの両方に適用されます
- 同じユーザーからの複数の入金は1つの入金アカウントに蓄積されます
- ユーザーが残高全額を引き出すと、入金 PDA はクローズされます
- End Behavior を処理するには、入金終了後に Transition を実行する必要があります
- ユーザーは入金するために wSOL（ラップされた SOL）を保持している必要があります

## FAQ

### Launch Pool でトークン価格はどのように決まりますか？
価格は総入金額に基づいて自然に発見されます。最終価格は、入金された SOL の総額を割り当てられたトークン数で割った値になります。入金が多いほど、トークンあたりの暗黙の価格が高くなります。

### ユーザーは入金を引き出せますか？
はい、入金期間中に引き出すことができます。システムの悪用を防ぐため、{% fee product="genesis" config="launchPool" fee="withdraw" /%} の引き出し手数料が適用されます。

### 複数回入金するとどうなりますか？
同じウォレットからの複数の入金は、単一の入金アカウントに蓄積されます。あなたの合計シェアは、合算された入金額に基づきます。

### ユーザーはいつトークンを請求できますか？
入金期間が終了し、請求ウィンドウが開いた後（`claimStartCondition` で定義）に請求できます。End Behavior を処理するために、先に Transition を実行する必要があります。

### Launch Pool と Presale の違いは何ですか？
Launch Pool は入金に基づいて自然に価格を発見し、比例配分で配布します。Presale は事前に固定価格が設定され、先着順で上限まで割り当てられます。

## 用語集

| 用語 | 定義 |
|------|------|
| **Launch Pool** | 入金ベースの配布方式で、終了時に価格が発見される |
| **入金ウィンドウ** | ユーザーが SOL を入金・引き出しできる期間 |
| **請求ウィンドウ** | ユーザーが比例配分されたトークンを請求できる期間 |
| **End Behavior** | 入金期間終了後に実行される自動アクション |
| **Transition** | End Behavior を処理し資金をルーティングするインストラクション |
| **比例配分** | 総入金額に対するユーザーのシェアに基づくトークン割り当て |
| **Quote Token** | ユーザーが入金するトークン（通常は wSOL） |
| **Base Token** | 配布されるトークン |

## 次のステップ

- [Presale](/smart-contracts/genesis/presale) - 固定価格トークン販売
- [Uniform Price Auction](/smart-contracts/genesis/uniform-price-auction) - 入札ベースの割り当て
- [Integration APIs](/smart-contracts/genesis/integration-apis) - API経由でローンチデータを照会
