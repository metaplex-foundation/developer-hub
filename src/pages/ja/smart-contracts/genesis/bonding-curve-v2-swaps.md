---
title: ボンディングカーブ V2 スワップ統合
metaTitle: Genesis ボンディングカーブ V2 スワップ統合 | Metaplex
description: Genesis SDK を使用して、ボンディングカーブの状態の読み取り、スワップ見積もりの取得、売買トランザクションの実行、スリッページの処理、スワップイベントのデコード、ライフサイクルイベントのインデックス作成を行う方法。
keywords:
  - bonding curve
  - swap
  - genesis
  - SOL
  - token launch
  - getSwapResult
  - swapBondingCurveV2
  - isSwappable
  - slippage
  - swap events
  - indexing
  - Raydium CPMM
  - graduation
about:
  - Bonding Curve
  - Token Swap
  - Genesis
  - Solana
programmingLanguage:
  - JavaScript
  - TypeScript
proficiencyLevel: Intermediate
created: '03-30-2026'
updated: '03-30-2026'
howToSteps:
  - Genesis SDK をインストールして Umi インスタンスを設定する
  - findBondingCurveBucketV2Pda を使用して BondingCurveBucketV2 アカウントを取得する
  - isSwappable を確認してカーブがアクティブであることを確認する
  - getSwapResult を呼び出して手数料込みの見積もりを取得する
  - applySlippage を使用して minAmountOut を導出する
  - swapBondingCurveV2 でスワップを送信してオンチェーンで確認する
howToTools:
  - Node.js
  - Umi framework
  - Genesis SDK
faqs:
  - q: isSwappable と isSoldOut の違いは何ですか？
    a: isSwappable は、カーブがアクティブにトレードを受け付けているとき（開始条件が満たされ、終了条件が発火しておらず、最初の購入（設定されている場合）が完了し、トークンが残っている）に true を返します。isSoldOut は baseTokenBalance がゼロになったときに true を返し、取引が終了してグラデュエーションがトリガーされます。カーブは売り切れでもまだグラデュエートしていない場合があります。
  - q: swapBondingCurveV2 を呼び出す前に SOL をラップする必要がありますか？
    a: はい。ボンディングカーブはクォートトークンとしてラップド SOL（wSOL）を使用します。swapBondingCurveV2 命令は SOL のラップやアンラップを自動的に行いません。購入の場合は、wSOL ATA を作成し、ネイティブ SOL を転送してから、スワップを送信する前に syncNative を呼び出してください。売却の場合は、スワップ後に wSOL ATA を閉じてネイティブ SOL にアンラップしてください。
  - q: getSwapResult は何を返し、手数料はどのように処理されますか？
    a: getSwapResult は amountIn（ユーザーが実際に支払う金額）、fee（請求される合計手数料）、amountOut（ユーザーが受け取る金額）を返します。購入の場合、手数料は AMM が実行される前に SOL 入力から差し引かれます。売却の場合、手数料は AMM 実行後に SOL 出力から差し引かれます。最初の購入見積もりで手数料を免除するには、4番目の引数として true を渡してください。
  - q: スリッページから保護するにはどうすればよいですか？
    a: applySlippage(quote.amountOut, slippageBps) を使用して minAmountOut を導出し、swapBondingCurveV2 に渡してください。オンチェーンプログラムは、実際の出力が minAmountOut を下回った場合にトランザクションを拒否します。一般的な値は、安定した条件では 50 bps（0.5%）、ボラティリティの高いローンチでは 200 bps（2%）です。
  - q: isSoldOut と isGraduated の違いは何ですか？
    a: isSoldOut はバケットの baseTokenBalance に対する同期チェックで、すべてのトークンが購入された瞬間に true を返します。isGraduated は Raydium CPMM プールが作成・資金供給されているかどうかを確認する非同期 RPC 呼び出しです。売り切れからグラデュエーションまでの間、isSoldOut が true でも isGraduated が false の状態が存在します。
  - q: トランザクションから BondingCurveSwapEvent をデコードするにはどうすればよいですか？
    a: Genesis プログラム（GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B）上で、識別子バイト 255 を持つ内部命令を見つけ、その最初のバイトを取り除いて、残りのバイトを getBondingCurveSwapEventSerializer().deserialize() に渡してください。イベントには方向、金額、手数料、スワップ後のリザーブ状態が含まれます。
---

Genesis SDK を使用して、[ボンディングカーブ V2](/smart-contracts/genesis/bonding-curve-v2) の状態を読み取り、スワップ見積もりを計算し、売買トランザクションをオンチェーンで実行し、スリッページを処理し、スワップイベントをデコードし、ボンディングカーブローンチのライフサイクル全体をインデックス化できます。 {% .lead %}

{% callout title="What You'll Build" %}
このガイドが扱う内容:
- `BondingCurveBucketV2` アカウント状態の取得と解釈
- `isSwappable`、`isSoldOut`、`isGraduated` によるライフサイクル状態の確認
- `getSwapResult` による正確なスワップ見積もりの取得
- `applySlippage` によるユーザー保護
- `swapBondingCurveV2` を使った売買トランザクションの構築
- 確認済みトランザクションからの `BondingCurveSwapEvent` のデコード
- オンチェーンのライフサイクルイベントのインデックス作成
{% /callout %}

## Summary

ボンディングカーブ V2 スワップは Genesis SDK を使用して、`BondingCurveBucketV2` オンチェーンアカウントと連携します。これは SOL を受け取ってトークンを返す（購入）か、トークンを受け取って SOL を返す（売却）定積 AMM です。基盤となる価格計算については、[ボンディングカーブ V2 — 動作原理](/smart-contracts/genesis/bonding-curve-v2) を参照してください。

- **送信前に見積もりを取得** — `getSwapResult` を呼び出して、手数料調整済みの正確な入出力金額を取得する
- **スリッページ保護** — `applySlippage` で `minAmountOut` を導出し、命令に渡す
- **wSOL は手動** — スワップ命令はネイティブ SOL のラップ・アンラップを行わない。呼び出し元が wSOL [associated token account (ATA)](https://spl.solana.com/associated-token-account) を処理する必要がある
- **プログラム ID** — Solana メインネット上の `GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B`

*Metaplex Foundation が管理 · 最終確認: 2026年3月 · `@metaplex-foundation/genesis` 1.x に適用*

## Quick Start

**ジャンプ:** [インストール](#installation) · [セットアップ](#umi-and-genesis-plugin-setup) · [カーブ取得](#fetching-a-bonding-curve-bucketv2) · [ライフサイクルヘルパー](#bonding-curve-lifecycle-helpers) · [見積もり](#getting-a-swap-quote) · [スリッページ](#slippage-protection) · [スワップ実行](#constructing-swap-transactions) · [イベント](#reading-swap-events) · [インデックス作成](#indexing-lifecycle-events) · [エラー](#error-handling) · [API リファレンス](#api-reference)

1. パッケージをインストールし、`genesis()` プラグインで Umi インスタンスを設定する
2. `BondingCurveBucketV2Pda` を導出してアカウントを取得する
3. `isSwappable(bucket)` を確認し、false の場合は中止する
4. `getSwapResult(bucket, amountIn, 'buy')` で手数料調整済みの見積もりを取得する
5. `applySlippage(quote.amountOut, slippageBps)` で `minAmountOut` を取得する
6. wSOL ラッピングを手動で処理し、`swapBondingCurveV2` を送信して確認する

## Prerequisites

- **Node.js 18+** — ネイティブ BigInt サポートに必要
- SOL で資金供給された **Solana ウォレット**（トランザクション手数料とスワップ入力用）
- Solana RPC エンドポイント（メインネット-beta またはデブネット）
- [Umi フレームワーク](https://github.com/metaplex-foundation/umi) と async/await パターンへの習熟

## Tested Configuration

| ツール | バージョン |
|------|---------|
| `@metaplex-foundation/genesis` | 1.x |
| `@metaplex-foundation/umi` | 1.x |
| `@metaplex-foundation/umi-bundle-defaults` | 1.x |
| Node.js | 18+ |

## Installation

1つのコマンドで3つの必要パッケージをインストールします。

```bash {% title="Terminal" %}
npm install @metaplex-foundation/genesis \
  @metaplex-foundation/umi \
  @metaplex-foundation/umi-bundle-defaults
```

## Umi and Genesis Plugin Setup

SDK 関数を呼び出す前に、Umi インスタンスを設定して `genesis()` プラグインを登録してください。

```typescript {% title="setup.ts" showLineNumbers=true %}
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { genesis } from '@metaplex-foundation/genesis';
import { keypairIdentity } from '@metaplex-foundation/umi';
import { readFileSync } from 'fs';

// Load your wallet keypair from a local file.
const keypairFile = JSON.parse(readFileSync('/path/to/keypair.json', 'utf-8'));

const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(genesis());

const keypair = umi.eddsa.createKeypairFromSecretKey(Uint8Array.from(keypairFile));
umi.use(keypairIdentity(keypair));
```

## Fetching a Bonding Curve BucketV2

既に知っている情報に応じて、3つの検索方法が利用できます。

### 既知の Genesis アカウントから取得する

ボンディングカーブを作成済みで、genesis アカウントのアドレスがすでにわかっている場合に使用します。

```typescript {% title="fetch-from-genesis.ts" showLineNumbers=true %}
import {
  findBondingCurveBucketV2Pda,
  fetchBondingCurveBucketV2,
} from '@metaplex-foundation/genesis';
import { publicKey } from '@metaplex-foundation/umi';

const genesisAccount = publicKey('YOUR_GENESIS_ACCOUNT_PUBKEY');

// Derive the bonding curve PDA (bucket index 0 for the primary curve).
const [bucketPda] = findBondingCurveBucketV2Pda(umi, {
  genesisAccount,
  bucketIndex: 0,
});

const bucket = await fetchBondingCurveBucketV2(umi, bucketPda);
```

### トークンミントから取得する

トークンミントアドレスしかない場合に使用します。ユーザー入力や API からミントを受け取る統合では一般的な方法です。

```typescript {% title="fetch-from-mint.ts" showLineNumbers=true %}
import {
  findGenesisAccountV2Pda,
  findBondingCurveBucketV2Pda,
  fetchBondingCurveBucketV2,
} from '@metaplex-foundation/genesis';
import { publicKey } from '@metaplex-foundation/umi';

const baseMint = publicKey('TOKEN_MINT_PUBKEY');

// Step 1: derive the genesis account from the mint.
const [genesisAccount] = findGenesisAccountV2Pda(umi, {
  baseMint,
  genesisIndex: 0,
});

// Step 2: derive the bonding curve bucket from the genesis account.
const [bucketPda] = findBondingCurveBucketV2Pda(umi, {
  genesisAccount,
  bucketIndex: 0,
});

const bucket = await fetchBondingCurveBucketV2(umi, bucketPda);
```

### 全ボンディングカーブを検索する（GPA）

GPA ビルダーを使用してプログラム上のすべての `BondingCurveBucketV2` アカウントを取得します。インデクサーやダッシュボードに有用です。

```typescript {% title="discover-all-curves.ts" showLineNumbers=true %}
import { getBondingCurveBucketV2GpaBuilder } from '@metaplex-foundation/genesis';

const allCurves = await getBondingCurveBucketV2GpaBuilder(umi)
  .whereField('discriminator', /* BondingCurveBucketV2 discriminator */)
  .get();

for (const curve of allCurves) {
  console.log('Bucket PDA:', curve.publicKey.toString());
  console.log('Base token balance:', curve.data.baseTokenBalance.toString());
}
```

## Reading Bonding Curve BucketV2 State

`BondingCurveBucketV2` アカウントには、見積もりの計算、ライフサイクル状態の確認、市場データの表示に必要なすべてのフィールドが含まれています。

| フィールド | 型 | 説明 |
|-------|------|-------------|
| `baseTokenBalance` | `bigint` | カーブに残っているトークン数。ゼロは売り切れを意味する。 |
| `baseTokenAllocation` | `bigint` | 作成時にこのカーブに割り当てられたトークンの総数。 |
| `quoteTokenDepositTotal` | `bigint` | 購入者が入金した実際の SOL（ランポート）。0 から開始。 |
| `virtualSol` | `bigint` | 初期化時に追加された仮想 SOL リザーブ（価格計算専用）。 |
| `virtualTokens` | `bigint` | 初期化時に追加された仮想トークンリザーブ（価格計算専用）。 |
| `depositFee` | `number` | 各スワップの SOL 側に適用されるプロトコル手数料率。 |
| `withdrawFee` | `number` | 売りの SOL 出力側に適用されるプロトコル手数料率。 |
| `swapStartCondition` | `object` | 取引を許可する前に満たす必要がある条件。 |
| `swapEndCondition` | `object` | トリガーされると取引を終了させる条件。 |

{% callout type="note" %}
`virtualSol` と `virtualTokens` は価格計算の中にのみ存在し、実際の資産としてオンチェーンに入金されることはありません。仮想リザーブが定積カーブをどのように形成するかについては、[ボンディングカーブ V2 — 動作原理](/smart-contracts/genesis/bonding-curve-v2#why-bonding-curves-require-virtual-reserves) を参照してください。
{% /callout %}

現在のプロトコル手数料率については、[プロトコル手数料](/protocol-fees) ページを参照してください。

## Bonding Curve Lifecycle Helpers

Genesis SDK の 5つのヘルパー関数は、追加の RPC 呼び出しなしにカーブの状態を検査します（`isGraduated` を除く）。

### isSwappable

`isSwappable(bucket)` は、カーブがアクティブにパブリックスワップを受け付けているとき（開始条件が満たされ、終了条件が発火しておらず、最初の購入（設定されている場合）が完了し、トークンが残っている）に `true` を返します。**見積もりを取得したりスワップを送信する前に必ず確認してください。**

```typescript {% title="lifecycle-helpers.ts" showLineNumbers=true %}
import {
  isSwappable,
  isFirstBuyPending,
  isSoldOut,
  getFillPercentage,
  isGraduated,
} from '@metaplex-foundation/genesis';

// Returns true only when the curve actively accepts public swaps.
const canSwap = isSwappable(bucket);

// Returns true when a first-buy is configured but not yet executed.
// While true, only the designated buyer can trade.
const firstBuyPending = isFirstBuyPending(bucket);

// Returns true when baseTokenBalance === 0.
// This triggers graduation processing.
const soldOut = isSoldOut(bucket);

// Returns a number 0–100 representing how much of the allocation has been sold.
const fillPercent = getFillPercentage(bucket);
console.log(`Curve is ${fillPercent.toFixed(1)}% filled`);

// Async — makes an RPC call to check if the Raydium CPMM pool exists onchain.
const graduated = await isGraduated(umi, bucket);
```

### ライフサイクルヘルパー クイックリファレンス

| ヘルパー | 非同期 | 戻り値 | 説明 |
|--------|-------|---------|-------------|
| `isSwappable(bucket)` | いいえ | `boolean` | パブリックトレードを受け付けているとき `true` |
| `isFirstBuyPending(bucket)` | いいえ | `boolean` | 指定の最初の購入がまだ完了していないとき `true` |
| `isSoldOut(bucket)` | いいえ | `boolean` | `baseTokenBalance === 0n` のとき `true` |
| `getFillPercentage(bucket)` | いいえ | `number` | 割り当てのうち売却済みの割合（0〜100） |
| `isGraduated(umi, bucket)` | はい | `boolean` | Raydium CPMM プールがオンチェーンに存在するとき `true` |

## Getting a Swap Quote

`getSwapResult(bucket, amountIn, direction, isFirstBuy?)` は、トランザクションを送信することなく、スワップの手数料調整済みの正確な金額を計算します。

この関数は以下を返します:
- `amountIn` — 調整後の実際の入力金額
- `fee` — 請求される合計手数料（プロトコル + クリエイター）。購入の場合はランポート、売却の場合はベーストークン
- `amountOut` — 受け取るトークン数（購入）または受け取る SOL（売却）

### 購入見積もり（SOL からトークン）

```typescript {% title="buy-quote.ts" showLineNumbers=true %}
import { getSwapResult } from '@metaplex-foundation/genesis';

const SOL_IN = 1_000_000_000n; // 1 SOL in lamports

const buyQuote = getSwapResult(bucket, SOL_IN, 'buy');

console.log('SOL input:    ', buyQuote.amountIn.toString(), 'lamports');
console.log('Total fee:    ', buyQuote.fee.toString(), 'lamports');
console.log('Tokens out:   ', buyQuote.amountOut.toString());
```

### 売却見積もり（トークンから SOL）

```typescript {% title="sell-quote.ts" showLineNumbers=true %}
import { getSwapResult } from '@metaplex-foundation/genesis';

const TOKENS_IN = 500_000_000_000n; // 500 tokens (9 decimals)

const sellQuote = getSwapResult(bucket, TOKENS_IN, 'sell');

console.log('Tokens input: ', sellQuote.amountIn.toString());
console.log('Total fee:    ', sellQuote.fee.toString(), 'lamports');
console.log('SOL out:      ', sellQuote.amountOut.toString(), 'lamports');
```

### 最初の購入手数料免除

指定の購入者がワンタイム手数料無料の購入を実行する際のオンチェーンの動作に合わせて、最初の購入を手数料なしで見積もるには 4番目の引数として `true` を渡します。

```typescript {% title="first-buy-quote.ts" showLineNumbers=true %}
import { getSwapResult } from '@metaplex-foundation/genesis';

const SOL_IN = 2_000_000_000n; // 2 SOL in lamports

// Pass `true` to simulate zero-fee first buy.
const firstBuyQuote = getSwapResult(bucket, SOL_IN, 'buy', true);

console.log('Fee (waived): ', firstBuyQuote.fee.toString()); // 0n
console.log('Tokens out:   ', firstBuyQuote.amountOut.toString());
```

### 現在価格ヘルパー

完全なスワップ見積もりを計算せずに現在の価格を取得する 3つのヘルパーがあります。

```typescript {% title="current-price.ts" showLineNumbers=true %}
import {
  getCurrentPrice,
  getCurrentPriceQuotePerBase,
  getCurrentPriceComponents,
} from '@metaplex-foundation/genesis';

// Price as tokens per SOL (tokens you receive for 1 SOL).
const tokensPerSol = getCurrentPrice(bucket);

// Price as SOL per token (lamports you pay for 1 base unit).
const lamportsPerToken = getCurrentPriceQuotePerBase(bucket);

// Low-level components: effective totalSol, totalTokens, and k invariant.
const { totalSol, totalTokens, k } = getCurrentPriceComponents(bucket);
```

## Slippage Protection

`applySlippage(expectedAmountOut, slippageBps)` は、期待される出力をスリッページ許容度で減らすことで `minAmountOut` を導出します。`minAmountOut` をスワップ命令に渡してください。実際の出力がこのしきい値を下回った場合、オンチェーンプログラムはトランザクションを拒否します。

```typescript {% title="slippage.ts" showLineNumbers=true %}
import { getSwapResult, applySlippage } from '@metaplex-foundation/genesis';

const SOL_IN = 1_000_000_000n; // 1 SOL

const quote = getSwapResult(bucket, SOL_IN, 'buy');

// 100 bps = 1.0% slippage tolerance.
// Use 50 bps (0.5%) for stable conditions; 200 bps (2%) for volatile launches.
const SLIPPAGE_BPS = 100;

const minAmountOut = applySlippage(quote.amountOut, SLIPPAGE_BPS);

console.log('Expected out: ', quote.amountOut.toString());
console.log('Min accepted: ', minAmountOut.toString());
```

{% callout type="warning" %}
`applySlippage` で導出した `minAmountOut` なしにスワップを送信しないでください。ボンディングカーブの価格はトレードごとに変動します。スリッページ保護なしでは、見積もりから確認までの間に別のトレードが実行された場合、ユーザーは見積もりよりもはるかに少ないトークンを受け取る可能性があります。
{% /callout %}

## Constructing Swap Transactions

`swapBondingCurveV2(umi, accounts)` はスワップ命令を構築します。呼び出し元はトランザクションの前後でラップド SOL（wSOL）の処理を担当します。詳細については、下記の [wSOL ラッピングに関する注意](#wsol-wrapping-note) を参照してください。

### 購入トランザクション（SOL からトークン）

```typescript {% title="swap-buy.ts" showLineNumbers=true %}
import {
  getSwapResult,
  applySlippage,
  swapBondingCurveV2,
  findBondingCurveBucketV2Pda,
} from '@metaplex-foundation/genesis';
import {
  findAssociatedTokenPda,
  createAssociatedTokenAccountInstruction,
} from '@metaplex-foundation/mpl-toolbox';
import { publicKey, sol, transactionBuilder } from '@metaplex-foundation/umi';

const genesisAccount = publicKey('YOUR_GENESIS_ACCOUNT_PUBKEY');
const baseMint = publicKey('TOKEN_MINT_PUBKEY');
const quoteMint = publicKey('So11111111111111111111111111111111111111112'); // wSOL

const [bucketPda] = findBondingCurveBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 });
const bucket = await fetchBondingCurveBucketV2(umi, bucketPda);

if (!isSwappable(bucket)) {
  throw new Error('Curve is not currently accepting swaps');
}

const SOL_IN = 1_000_000_000n; // 1 SOL in lamports
const quote = getSwapResult(bucket, SOL_IN, 'buy');
const minAmountOut = applySlippage(quote.amountOut, 100); // 1% slippage

// Derive the user's token ATAs.
const [userBaseTokenAccount] = findAssociatedTokenPda(umi, {
  mint: baseMint,
  owner: umi.identity.publicKey,
});
const [userQuoteTokenAccount] = findAssociatedTokenPda(umi, {
  mint: quoteMint,
  owner: umi.identity.publicKey,
});

// NOTE: You must fund the wSOL ATA with SOL_IN lamports before this call.
// See the wSOL Wrapping Note section below.
const tx = swapBondingCurveV2(umi, {
  genesisAccount,
  bucketPda,
  baseMint,
  quoteMint,
  userBaseTokenAccount,
  userQuoteTokenAccount,
  amountIn: quote.amountIn,
  minAmountOut,
  direction: 'buy',
});

const result = await tx.sendAndConfirm(umi);
console.log('Buy confirmed:', result.signature);
```

### 売却トランザクション（トークンから SOL）

```typescript {% title="swap-sell.ts" showLineNumbers=true %}
import {
  getSwapResult,
  applySlippage,
  swapBondingCurveV2,
  fetchBondingCurveBucketV2,
  findBondingCurveBucketV2Pda,
  isSwappable,
} from '@metaplex-foundation/genesis';
import { findAssociatedTokenPda } from '@metaplex-foundation/mpl-toolbox';
import { publicKey } from '@metaplex-foundation/umi';

const genesisAccount = publicKey('YOUR_GENESIS_ACCOUNT_PUBKEY');
const baseMint = publicKey('TOKEN_MINT_PUBKEY');
const quoteMint = publicKey('So11111111111111111111111111111111111111112'); // wSOL

const [bucketPda] = findBondingCurveBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 });
const bucket = await fetchBondingCurveBucketV2(umi, bucketPda);

if (!isSwappable(bucket)) {
  throw new Error('Curve is not currently accepting swaps');
}

const TOKENS_IN = 500_000_000_000n; // 500 tokens (9 decimals)
const quote = getSwapResult(bucket, TOKENS_IN, 'sell');
const minAmountOut = applySlippage(quote.amountOut, 100); // 1% slippage

const [userBaseTokenAccount] = findAssociatedTokenPda(umi, {
  mint: baseMint,
  owner: umi.identity.publicKey,
});
const [userQuoteTokenAccount] = findAssociatedTokenPda(umi, {
  mint: quoteMint,
  owner: umi.identity.publicKey,
});

const tx = swapBondingCurveV2(umi, {
  genesisAccount,
  bucketPda,
  baseMint,
  quoteMint,
  userBaseTokenAccount,
  userQuoteTokenAccount,
  amountIn: quote.amountIn,
  minAmountOut,
  direction: 'sell',
});

const result = await tx.sendAndConfirm(umi);
// NOTE: After a sell, close the wSOL ATA to unwrap back to native SOL.
// See the wSOL Wrapping Note section below.
console.log('Sell confirmed:', result.signature);
```

### wSOL Wrapping Note

{% callout type="warning" title="Manual wSOL handling required" %}
`swapBondingCurveV2` 命令はクォートトークンとしてラップド SOL（wSOL）を使用します。ネイティブ SOL のラップやアンラップは**自動的に行われません**。

**購入の場合:** スワップを送信する前に、wSOL [associated token account (ATA)](https://spl.solana.com/associated-token-account) を作成し、必要なランポートを転送し、`syncNative` を呼び出してアカウント残高を同期してください。

**売却の場合:** スワップが確認された後、`closeAccount` で wSOL ATA を閉じて、wSOL をユーザーのウォレット内のネイティブ SOL にアンラップしてください。

現バージョンでは USDC はクォートトークンとして未対応です。クォートトークンとして受け付けられるのは wSOL のみです。
{% /callout %}

```typescript {% title="wsol-wrap-unwrap.ts" showLineNumbers=true %}
import {
  findAssociatedTokenPda,
  createAssociatedTokenAccountIdempotentInstruction,
  syncNative,
  closeToken,
} from '@metaplex-foundation/mpl-toolbox';
import { transactionBuilder, sol } from '@metaplex-foundation/umi';
import { NATIVE_MINT } from '@solana/spl-token';
import { publicKey } from '@metaplex-foundation/umi';

const wSOL = publicKey('So11111111111111111111111111111111111111112');
const [wSolAta] = findAssociatedTokenPda(umi, {
  mint: wSOL,
  owner: umi.identity.publicKey,
});

// --- Wrap SOL before a buy ---
const SOL_AMOUNT = sol(1); // 1 SOL

const wrapBuilder = transactionBuilder()
  .add(createAssociatedTokenAccountIdempotentInstruction(umi, {
    mint: wSOL,
    owner: umi.identity.publicKey,
  }))
  // Transfer native SOL into the wSOL ATA.
  .add({
    instruction: {
      programId: publicKey('11111111111111111111111111111111'), // System Program
      keys: [
        { pubkey: umi.identity.publicKey, isSigner: true, isWritable: true },
        { pubkey: wSolAta, isSigner: false, isWritable: true },
      ],
      data: /* SystemProgram.transfer encode */ new Uint8Array(),
    },
    signers: [umi.identity],
    bytesCreatedOnChain: 0,
  })
  // Sync the ATA balance to reflect the deposited lamports.
  .add(syncNative(umi, { account: wSolAta }));

await wrapBuilder.sendAndConfirm(umi);

// --- Unwrap SOL after a sell ---
const unwrapBuilder = closeToken(umi, {
  account: wSolAta,
  destination: umi.identity.publicKey,
  authority: umi.identity,
});

await unwrapBuilder.sendAndConfirm(umi);
```

{% callout type="note" %}
本番環境では、ラッピングに `@solana/spl-token` のヘルパー `createWrappedNativeAccount` を使用するか、ラッピング・スワップ・アンラッピングを1つのトランザクションでアトミックに行い、ラウンドトリップを最小化することを推奨します。
{% /callout %}

## Reading Swap Events

確認済みのすべてのスワップは、識別子バイト `255` を持つ内部命令として `BondingCurveSwapEvent` を発行します。トランザクションからデコードすることで、スワップ後の正確なリザーブ状態、手数料の内訳、方向を取得できます。

### BondingCurveSwapEvent フィールド

| フィールド | 型 | 説明 |
|-------|------|-------------|
| `direction` | `'buy' \| 'sell'` | 取引の方向 |
| `amountIn` | `bigint` | 実際の入力金額（購入の場合はランポート、売却の場合はベーストークン） |
| `amountOut` | `bigint` | 受け取った出力金額 |
| `fee` | `bigint` | ランポートで請求された合計手数料 |
| `baseTokenBalanceAfter` | `bigint` | スワップ後の `baseTokenBalance` |
| `quoteTokenDepositTotalAfter` | `bigint` | スワップ後の `quoteTokenDepositTotal` |

### 確認済みトランザクションからスワップイベントをデコードする

```typescript {% title="decode-swap-event.ts" showLineNumbers=true %}
import {
  getBondingCurveSwapEventSerializer,
} from '@metaplex-foundation/genesis';
import { publicKey } from '@metaplex-foundation/umi';

const GENESIS_PROGRAM_ID = 'GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B';
const SWAP_EVENT_DISCRIMINATOR = 255;

async function decodeSwapEvent(signature: string) {
  const tx = await umi.rpc.getTransaction(signature, {
    commitment: 'confirmed',
  });

  if (!tx) throw new Error('Transaction not found');

  const serializer = getBondingCurveSwapEventSerializer();

  for (const innerIx of tx.meta?.innerInstructions ?? []) {
    for (const ix of innerIx.instructions) {
      const programId = tx.transaction.message.accountKeys[ix.programIdIndex];

      if (programId.toString() !== GENESIS_PROGRAM_ID) continue;

      const data = ix.data; // Uint8Array
      if (data[0] !== SWAP_EVENT_DISCRIMINATOR) continue;

      // Slice off the discriminator byte, then deserialize.
      const eventBytes = data.slice(1);
      const [event] = serializer.deserialize(eventBytes);

      console.log('Direction:            ', event.direction);
      console.log('Amount in:            ', event.amountIn.toString());
      console.log('Amount out:           ', event.amountOut.toString());
      console.log('Fee:                  ', event.fee.toString());
      console.log('Base balance after:   ', event.baseTokenBalanceAfter.toString());
      console.log('Quote deposit after:  ', event.quoteTokenDepositTotalAfter.toString());

      return event;
    }
  }

  return null; // No swap event found in this transaction.
}
```

## Indexing Lifecycle Events

インデクサーは Genesis プログラムの命令と内部命令イベントをリッスンすることで、ボンディングカーブのライフサイクル全体を追跡できます。

**プログラム ID:** `GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B`

### ライフサイクルイベント

| イベント | 説明 | 主要フィールド |
|-------|-------------|------------|
| Token Created | SPL トークンのミント、genesis アカウントの初期化 | `baseMint`, `genesisAccount` |
| Bonding Curve Added | `BondingCurveBucketV2` アカウントの作成 | `bucketPda`, `baseTokenAllocation`, `virtualSol`, `virtualTokens` |
| Finalized | ローンチ設定のロック、バケットのアクティブ化 | `genesisAccount` |
| Goes Live | `swapStartCondition` が満たされ、取引開始 | `bucketPda`, タイムスタンプ |
| Swap | 購入または売却の実行 | `BondingCurveSwapEvent`（識別子 255） |
| Sold Out | `baseTokenBalance === 0` | `bucketPda`, `quoteTokenDepositTotal` |
| Graduation Crank | 流動性移行命令の提出 | `bucketPda`, `raydiumCpmmPool` |
| Graduated | Raydium CPMM プールへの資金供給、ボンディングカーブのクローズ | `cpmmPoolPda`, 蓄積 SOL |

### イベントから現在価格を追跡する

トレードごとにアカウントを取得するのではなく、各 `BondingCurveSwapEvent` に含まれるスワップ後のリザーブ状態から現在価格を導出してください:

```typescript {% title="price-from-event.ts" showLineNumbers=true %}
function getPriceFromEvent(event: BondingCurveSwapEvent, bucket: BondingCurveBucketV2) {
  // totalTokens = virtualTokens + baseTokenBalance after swap
  const totalTokens = bucket.virtualTokens + event.baseTokenBalanceAfter;
  // totalSol = virtualSol + quoteTokenDepositTotal after swap
  const totalSol = bucket.virtualSol + event.quoteTokenDepositTotalAfter;
  // Price: tokens per SOL (how many tokens you receive for 1 SOL)
  return Number(totalTokens) / Number(totalSol);
}
```

### アカウント識別子

| アカウント | 識別子 | 説明 |
|---------|---------------|-------------|
| `GenesisAccountV2` | アカウント型ごとに固有 | マスター調整アカウント |
| `BondingCurveBucketV2` | アカウント型ごとに固有 | ボンディングカーブ AMM の状態 |
| `BondingCurveSwapEvent` | `255`（内部命令） | プログラムが発行するスワップごとのイベント |

### PDA 導出

| PDA | シード |
|-----|-------|
| `GenesisAccountV2` | `["genesis_account_v2", baseMint, genesisIndex (u8)]` |
| `BondingCurveBucketV2` | `["bonding_curve_bucket_v2", genesisAccount, bucketIndex (u8)]` |

TypeScript での PDA 導出には、Genesis SDK の `findGenesisAccountV2Pda` 関数と `findBondingCurveBucketV2Pda` 関数を使用してください。

## Error Handling

オンチェーンプログラムは型付きエラーを発行します。エラーコードまたはメッセージでキャッチし、ユーザーにわかりやすいフィードバックを表示してください。

| エラー | 原因 | 解決策 |
|-------|-------|------------|
| `BondingCurveInsufficientFunds` | カーブがリクエストを満たすのに十分なトークン（購入）または SOL（売却）を保有していない | バケットを再取得して再見積もりを行う。カーブがほぼ売り切れの可能性がある |
| `InsufficientOutputAmount` | 実際の出力が `minAmountOut` を下回った（スリッページ超過） | `slippageBps` を増やすか、すぐに再試行する |
| `InvalidSwapDirection` | `direction` フィールドが提供された命令アカウントと一致しない | `direction` 引数が渡されたトークンアカウントと一致することを確認する |
| `BondingCurveNotStarted` | `swapStartCondition` がまだ満たされていない | `bucket.swapStartCondition` を確認してカーブがライブになるまで待機する |
| `BondingCurveEnded` | `swapEndCondition` がトリガーされた — カーブが売り切れまたはグラデュエート済み | カーブはクローズされています。ユーザーを Raydium CPMM プールに誘導してください |

```typescript {% title="error-handling.ts" showLineNumbers=true %}
import { isSwappable, isSoldOut, getSwapResult, applySlippage, swapBondingCurveV2 } from '@metaplex-foundation/genesis';

async function executeBuy(bucket, amountIn: bigint, slippageBps: number) {
  if (!isSwappable(bucket)) {
    if (isSoldOut(bucket)) {
      throw new Error('This token has sold out. Trade on Raydium.');
    }
    throw new Error('Curve is not yet active. Check the start time.');
  }

  const quote = getSwapResult(bucket, amountIn, 'buy');
  const minAmountOut = applySlippage(quote.amountOut, slippageBps);

  try {
    const result = await swapBondingCurveV2(umi, {
      // ... accounts
      amountIn: quote.amountIn,
      minAmountOut,
      direction: 'buy',
    }).sendAndConfirm(umi);

    return result.signature;
  } catch (err: any) {
    if (err.message?.includes('InsufficientOutputAmount')) {
      throw new Error('Price moved too fast. Try again with higher slippage.');
    }
    if (err.message?.includes('BondingCurveInsufficientFunds')) {
      throw new Error('Not enough tokens remaining. Re-fetch and reduce amount.');
    }
    throw err;
  }
}
```

## Notes

- `virtualSol` と `virtualTokens` はカーブ作成時に設定され、不変です。これらは価格カーブの形状を永続的に定義します
- すべての手数料金額はランポート（SOL 側）です。現在のレート値については [プロトコル手数料](/protocol-fees) を参照してください
- USDC はクォートトークンとして未対応です。現バージョンでは wSOL のみが受け付けられます
- `isGraduated` は呼び出しのたびに RPC 呼び出しを行います。レンダリングのたびに呼び出すのではなく、インデクサーで結果をキャッシュしてください
- `BondingCurveSwapEvent` の識別子は常にバイト `255` です。Genesis プログラム上のこの先頭バイトを持つ内部命令はすべてスワップイベントです
- `isSoldOut` が `true` を返してから `isGraduated` が `true` を返すまでの間、カーブは売り切れですが Raydium CPMM プールにはまだ資金が供給されていません。`isGraduated` が確認されるまでユーザーを Raydium に誘導しないでください
- 本番環境では各スワップ前にバケットを再取得してください。価格はすべてのユーザーのトレードごとに変動します
- ボンディングカーブ V2 は [ローンチプール](/smart-contracts/genesis/launch-pool) および [プレセール](/smart-contracts/genesis/presale) ローンチ種別とは異なります。それらは固定の入金ウィンドウとバッチ価格決定を使用します

## API Reference

### 見積もりと価格関数

| 関数 | 非同期 | 戻り値 | 説明 |
|----------|-------|---------|-------------|
| `getSwapResult(bucket, amountIn, direction, isFirstBuy?)` | いいえ | `{ amountIn, fee, amountOut }` | 手数料調整済みスワップ見積もり |
| `getCurrentPrice(bucket)` | いいえ | `number` | 現在のリザーブ状態における SOL あたりのトークン数 |
| `getCurrentPriceQuotePerBase(bucket)` | いいえ | `number` | ベーストークン単位あたりのランポート |
| `getCurrentPriceComponents(bucket)` | いいえ | `{ totalSol, totalTokens, k }` | 生の AMM リザーブコンポーネント |

### ライフサイクル関数

| 関数 | 非同期 | 戻り値 | 説明 |
|----------|-------|---------|-------------|
| `isSwappable(bucket)` | いいえ | `boolean` | パブリックトレードを受け付けているとき `true` |
| `isFirstBuyPending(bucket)` | いいえ | `boolean` | 指定の最初の購入がまだ完了していないとき `true` |
| `isSoldOut(bucket)` | いいえ | `boolean` | `baseTokenBalance === 0n` のとき `true` |
| `getFillPercentage(bucket)` | いいえ | `number` | 割り当てのうち売却済みの割合（0〜100） |
| `isGraduated(umi, bucket)` | はい | `boolean` | Raydium CPMM プールがオンチェーンに存在するとき `true` |

### スリッページ

| 関数 | 戻り値 | 説明 |
|----------|---------|-------------|
| `applySlippage(amountOut, slippageBps)` | `bigint` | `amountOut` を `slippageBps / 10_000` で減らす |

### スワップ命令 — 必須アカウント

| アカウント | 書き込み可 | 署名者 | 説明 |
|---------|----------|--------|-------------|
| `genesisAccount` | はい | いいえ | Genesis 調整 PDA |
| `bucketPda` | はい | いいえ | `BondingCurveBucketV2` PDA |
| `baseMint` | いいえ | いいえ | SPL トークンミント |
| `quoteMint` | いいえ | いいえ | wSOL ミント |
| `userBaseTokenAccount` | はい | いいえ | ユーザーのベーストークン ATA |
| `userQuoteTokenAccount` | はい | いいえ | ユーザーの wSOL ATA |
| `payer` | はい | はい | トランザクション手数料の支払者 |

### スワップ命令 — オプションアカウント

| アカウント | 説明 |
|---------|-------------|
| `feeQuoteTokenAccount` | プロトコル手数料の送金先（wSOL ATA） |
| `creatorFeeQuoteTokenAccount` | クリエイター手数料が累積されるバケットの wSOL ATA；`CreatorFee`エクステンションが設定されている場合に自動解決される |
| `firstBuyerAccount` | 指定の最初の購入ウォレットの場合のみ必要 |

### アカウント検索

| 関数 | 戻り値 | 説明 |
|----------|---------|-------------|
| `findBondingCurveBucketV2Pda(umi, { genesisAccount, bucketIndex })` | `[PublicKey, bump]` | バケット PDA を導出する |
| `findGenesisAccountV2Pda(umi, { baseMint, genesisIndex })` | `[PublicKey, bump]` | genesis アカウント PDA を導出する |
| `fetchBondingCurveBucketV2(umi, pda)` | `BondingCurveBucketV2` | アカウントを取得してデシリアライズする |
| `getBondingCurveBucketV2GpaBuilder(umi)` | GPA ビルダー | 全ボンディングカーブアカウントを照会する |

## FAQ

### isSwappable と isSoldOut の違いは何ですか？

`isSwappable` は、カーブがアクティブにパブリックトレードを受け付けているとき（開始条件が満たされ、終了条件が発火しておらず、最初の購入（設定されている場合）が完了し、トークンが残っている）にのみ `true` を返します。`isSoldOut` は `baseTokenBalance` がゼロになった瞬間に `true` を返し、取引が終了してグラデュエーションがトリガーされます。カーブは売り切れでもまだグラデュエートしていない場合があります。このウィンドウ中はどちらの関数もスワップを許可しません。

### swapBondingCurveV2 を呼び出す前に SOL をラップする必要がありますか？

はい。ボンディングカーブはクォートトークンとして wSOL を使用しており、`swapBondingCurveV2` はネイティブ SOL のラップやアンラップを自動的に行いません。購入の場合は、wSOL [associated token account (ATA)](https://spl.solana.com/associated-token-account) を作成し、必要なランポートを入金し、スワップを送信する前に `syncNative` を呼び出してください。売却の場合は、確認後に wSOL ATA を閉じてネイティブ SOL に戻してください。

### getSwapResult は何を返し、手数料はどのように処理されますか？

`getSwapResult` は `{ amountIn, fee, amountOut }` を返します。購入の場合、手数料は AMM の計算式が実行される前に SOL 入力から差し引かれます。ユーザーは合計 `amountIn` を支払い、AMM は `amountIn − fee` を受け取ります。売却の場合、手数料は AMM の計算式実行後に SOL 出力から差し引かれます。ユーザーは手数料差し引き後の `amountOut` を受け取ります。最初の購入手数料免除をシミュレートするには、4番目の引数として `true` を渡してください。

### スリッページから保護するにはどうすればよいですか？

`applySlippage(quote.amountOut, slippageBps)` を呼び出して `minAmountOut` を導出し、`swapBondingCurveV2` に渡してください。実際の出力が `minAmountOut` を下回った場合、オンチェーンプログラムはトランザクションを拒否します。一般的な値: 安定した条件では 50 bps（0.5%）、ボラティリティの高いローンチ時は 200 bps（2%）。

### isSoldOut と isGraduated の違いは何ですか？

`isSoldOut` は同期のローカルチェックで、`baseTokenBalance` が `0n` になった瞬間に `true` を返します。`isGraduated` は Raydium CPMM プールが作成・資金供給されているかどうかをオンチェーンで確認する非同期 RPC 呼び出しです。売り切れからグラデュエーションまでの間、`isSoldOut` が `true` でも `isGraduated` が `false` の状態が存在します。`isGraduated` がプールの存在を確認するまで、ユーザーを Raydium にリダイレクトしないでください。

### トランザクションから BondingCurveSwapEvent をデコードするにはどうすればよいですか？

Genesis プログラム（`GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B`）上で最初のデータバイトが `255` の内部命令を見つけてください。そのバイトを取り除いて残りを `getBondingCurveSwapEventSerializer().deserialize(data.slice(1))` に渡してください。返されるオブジェクトには、方向、金額、手数料、価格インデックスの更新に必要なスワップ後のリザーブ状態が含まれています。
