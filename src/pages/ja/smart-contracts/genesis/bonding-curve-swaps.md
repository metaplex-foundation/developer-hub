---
title: ボンディングカーブ スワップ統合
metaTitle: Genesis ボンディングカーブ スワップ統合 | Metaplex
description: Genesis SDKを使用して、ボンディングカーブの状態の読み取り、スワップ見積もりの取得、売買トランザクションの実行、スリッページの処理、クリエイター手数料の請求を行う方法。
updated: '04-09-2026'
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
  - creator fees
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
  - Bash
cli: /dev-tools/cli/genesis/bonding-curve
proficiencyLevel: Intermediate
howToSteps:
  - Install the Genesis SDK and configure a Umi instance
  - Fetch the BondingCurveBucketV2 account using findBondingCurveBucketV2Pda
  - Check isSwappable to confirm the curve is active
  - Call getSwapResult to get a quote including fees
  - Apply slippage with applySlippage to derive minAmountOut
  - Send the swap with swapBondingCurveV2 and confirm onchain
howToTools:
  - Node.js
  - Umi framework
  - Genesis SDK
faqs:
  - q: isSwappableとisSoldOutの違いは何ですか？
    a: isSwappableは、カーブがアクティブにパブリックトレードを受け付けているとき（開始条件が満たされ、終了条件が発火しておらず、ファーストバイ（設定されている場合）が完了し、トークンが残っている）にtrueを返します。isSoldOutはbaseTokenBalanceがゼロになったときにtrueを返し、取引が終了してグラデュエーションがトリガーされます。
  - q: swapBondingCurveV2を呼び出す前にSOLをラップする必要がありますか？
    a: はい。ボンディングカーブはクォートトークンとしてラップドSOL（wSOL）を使用します。swapBondingCurveV2インストラクションはSOLのラップやアンラップを自動的に行いません。購入の場合は、wSOL ATAを作成し、必要なラムポートを転送してから、スワップを送信する前にsyncNativeを呼び出してください。売却の場合は、スワップ後にwSOL ATAを閉じてネイティブSOLにアンラップしてください。
  - q: getSwapResultは何を返し、手数料はどのように処理されますか？
    a: getSwapResultはamountIn（ユーザーが実際に支払う金額）、fee（プロトコル手数料）、creatorFee（クリエイター手数料、設定されている場合）、amountOut（ユーザーが受け取る金額）を返します。購入の場合、手数料はAMMが実行される前にSOL入力から差し引かれます。売却の場合、手数料はAMM実行後にSOL出力から差し引かれます。ファーストバイ見積もりで手数料を免除するには、4番目の引数としてtrueを渡してください。
  - q: スリッページから保護するにはどうすればよいですか？
    a: applySlippage(quote.amountOut, slippageBps)を使用してminAmountOutScaledを導出し、swapBondingCurveV2にminAmountOutScaledフィールドとして渡してください。オンチェーンプログラムは、実際の出力がこの値を下回った場合にトランザクションを拒否します。一般的な値は、安定した条件では50 bps（0.5%）、ボラティリティの高いローンチでは200 bps（2%）です。
---

Genesis SDKを使用して[ボンディングカーブ](/smart-contracts/genesis/bonding-curve)の状態を読み取り、スワップ見積もりを計算し、売買トランザクションをオンチェーンで実行し、スリッページを処理し、クリエイター手数料を請求します。 {% .lead %}

{% callout title="構築する内容" %}
このガイドでは以下をカバーします：
- `BondingCurveBucketV2` アカウント状態の取得と解釈
- `isSwappable`、`isSoldOut`、`isGraduated` でのライフサイクルステータスの確認
- `getSwapResult` による正確なスワップ見積もりの取得
- `applySlippage` によるユーザーの保護
- `swapBondingCurveV2` での売買トランザクションの構築
- カーブとグラデュエーション後のRaydiumプールからのクリエイター手数料の請求
{% /callout %}

## Summary

ボンディングカーブのスワップはGenesis SDKを使用して `BondingCurveBucketV2` オンチェーンアカウントを操作します — SOLを受け取りトークンを返す（購入）、またはトークンを受け取りSOLを返す（売却）定積AMMです。価格計算の基礎数学については[動作理論](/smart-contracts/genesis/bonding-curve-theory)を参照してください。

- **送信前に見積もりを取得** — `getSwapResult` で正確な手数料調整後の入出力金額を取得する
- **スリッページ保護** — `applySlippage` で `minAmountOutScaled` を導出し、インストラクションに渡す
- **wSOLは手動** — スワップインストラクションはネイティブSOLをラップ・アンラップしない。呼び出し元が自分でwSOL ATAを処理する必要がある
- **プログラムID** — Solanaメインネット上の `GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B`

## クイックスタート

**ジャンプ:** [インストール](#インストール) · [セットアップ](#umiとgenesisプラグインのセットアップ) · [カーブの取得](#ボンディングカーブbucketv2の取得) · [ライフサイクルヘルパー](#ボンディングカーブライフサイクルヘルパー) · [見積もり](#スワップ見積もりの取得) · [スリッページ](#スリッページ保護) · [スワップの実行](#スワップトランザクションの構築) · [クリエイター手数料](/smart-contracts/genesis/creator-fees) · [エラー](#エラーハンドリング) · [APIリファレンス](#apiリファレンス)

1. パッケージをインストールして `genesis()` プラグインでUmiインスタンスを設定する
2. `BondingCurveBucketV2Pda` を導出してアカウントを取得する
3. `isSwappable(bucket)` を確認 — falseの場合は中止する
4. `getSwapResult(bucket, amountIn, SwapDirection.Buy)` で手数料調整済み見積もりを取得する
5. `applySlippage(quote.amountOut, slippageBps)` を適用して `minAmountOutScaled` を取得する
6. wSOLのラッピングを手動で処理してから `swapBondingCurveV2` を送信して確認する

## 前提条件

- **Node.js 18+** — ネイティブBigIntサポートに必要
- **Solanaウォレット** — トランザクション手数料とスワップ入力のためのSOLが入金されている
- SolanaのRPCエンドポイント（mainnet-betaまたはdevnet）
- [Umiフレームワーク](https://github.com/metaplex-foundation/umi)とasync/awaitパターンへの慣れ

## テスト済み構成

| ツール | バージョン |
|------|---------|
| `@metaplex-foundation/genesis` | 1.x |
| `@metaplex-foundation/umi` | 1.x |
| `@metaplex-foundation/umi-bundle-defaults` | 1.x |
| Node.js | 18+ |

## インストール

```bash {% title="Terminal" %}
npm install @metaplex-foundation/genesis \
  @metaplex-foundation/umi \
  @metaplex-foundation/umi-bundle-defaults
```

## UmiとGenesisプラグインのセットアップ

SDK関数を呼び出す前に、Umiインスタンスを設定して `genesis()` プラグインを登録します。

```typescript {% title="setup.ts" showLineNumbers=true %}
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { genesis } from '@metaplex-foundation/genesis';
import { keypairIdentity } from '@metaplex-foundation/umi';
import { readFileSync } from 'fs';

const keypairFile = JSON.parse(readFileSync('/path/to/keypair.json', 'utf-8'));

const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(genesis());

const keypair = umi.eddsa.createKeypairFromSecretKey(Uint8Array.from(keypairFile));
umi.use(keypairIdentity(keypair));
```

## ボンディングカーブBucketV2の取得

すでに知っていることに応じて、3つの検出戦略が利用可能です。

### 既知のGenesisアカウントから取得する

{% code-tabs-imported from="genesis/fetch_bonding_curve_bucket" frameworks="umi,cli" defaultFramework="umi" /%}

### トークンミントから取得する

```typescript {% title="fetch-from-mint.ts" showLineNumbers=true %}
import {
  findGenesisAccountV2Pda,
  findBondingCurveBucketV2Pda,
  fetchBondingCurveBucketV2,
} from '@metaplex-foundation/genesis';
import { publicKey } from '@metaplex-foundation/umi';

const baseMint = publicKey('TOKEN_MINT_PUBKEY');

const [genesisAccount] = findGenesisAccountV2Pda(umi, {
  baseMint,
  genesisIndex: 0,
});

const [bucketPda] = findBondingCurveBucketV2Pda(umi, {
  genesisAccount,
  bucketIndex: 0,
});

const bucket = await fetchBondingCurveBucketV2(umi, bucketPda);
```

## ボンディングカーブBucketV2の状態を読み取る

| フィールド | 型 | 説明 |
|-------|------|-------------|
| `baseTokenBalance` | `bigint` | カーブに残っているトークン。ゼロは売り切れを意味する。 |
| `baseTokenAllocation` | `bigint` | 作成時にこのカーブに割り当てられた総トークン数。 |
| `quoteTokenDepositTotal` | `bigint` | 購入者が入金した実際のSOL（ラムポート）。0から始まる。 |
| `virtualSol` | `bigint` | 初期化時に追加された仮想SOLリザーブ（価格計算のみ）。 |
| `virtualTokens` | `bigint` | 初期化時に追加された仮想トークンリザーブ（価格計算のみ）。 |
| `depositFee` | `number` | すべてのスワップのSOL側に適用されるプロトコル手数料率。 |
| `withdrawFee` | `number` | 売却のSOL出力側に適用されるプロトコル手数料率。 |
| `creatorFeeAccrued` | `bigint` | 最後の請求以降に蓄積したクリエイター手数料（ラムポート）。 |
| `creatorFeeClaimed` | `bigint` | 今日までの累計請求済みクリエイター手数料（ラムポート）。 |
| `swapStartCondition` | `object` | 取引が許可される前に満たされなければならない条件。 |
| `swapEndCondition` | `object` | トリガーされると取引を終了させる条件。 |

{% callout type="note" %}
`virtualSol` と `virtualTokens` は価格計算にのみ存在します — 実際にはオンチェーンにリアルアセットとして入金されません。仮想リザーブが定積カーブをどのように形成するかについては[動作理論](/smart-contracts/genesis/bonding-curve-theory#why-bonding-curves-require-virtual-reserves)を参照してください。
{% /callout %}

## ボンディングカーブライフサイクルヘルパー

5つのヘルパー関数が追加のRPC呼び出しなしにカーブの状態を確認します（`isGraduated` を除く）。

```typescript {% title="lifecycle-helpers.ts" showLineNumbers=true %}
import {
  isSwappable,
  isFirstBuyPending,
  isSoldOut,
  getFillPercentage,
  isGraduated,
} from '@metaplex-foundation/genesis';

const canSwap = isSwappable(bucket);
const firstBuyPending = isFirstBuyPending(bucket);
const soldOut = isSoldOut(bucket);
const fillPercent = getFillPercentage(bucket);
const graduated = await isGraduated(umi, bucket); // 非同期RPC呼び出し
```

| ヘルパー | 非同期 | 戻り値 | 説明 |
|--------|-------|---------|-------------|
| `isSwappable(bucket)` | いいえ | `boolean` | パブリックトレードを受け付けているとき `true` |
| `isFirstBuyPending(bucket)` | いいえ | `boolean` | 指定されたファーストバイがまだ完了していないとき `true` |
| `isSoldOut(bucket)` | いいえ | `boolean` | `baseTokenBalance === 0n` のとき `true` |
| `getFillPercentage(bucket)` | いいえ | `number` | 売却済み割り当ての0〜100パーセント |
| `isGraduated(umi, bucket)` | はい | `boolean` | Raydium CPMMプールがオンチェーンに存在するとき `true` |

## スワップ見積もりの取得

`getSwapResult(bucket, amountIn, swapDirection, isFirstBuy?)` はトランザクションを送信せずに、スワップの正確な手数料調整済み金額を計算します。

`{ amountIn, fee, creatorFee, amountOut }` を返します：
- `amountIn` — 調整後の実際の入力金額
- `fee` — 請求されるプロトコル手数料（ラムポート単位）
- `creatorFee` — 請求されるクリエイター手数料（ラムポート単位、クリエイター手数料未設定の場合は0）
- `amountOut` — 受け取るトークン（購入）またはSOL（売却）

### 購入見積もり（SOLからトークン）

{% code-tabs-imported from="genesis/swap_quote_buy" frameworks="umi,cli" defaultFramework="umi" /%}

### 売却見積もり（トークンからSOL）

{% code-tabs-imported from="genesis/swap_quote_sell" frameworks="umi,cli" defaultFramework="umi" /%}

### ファーストバイ手数料免除

手数料を免除したファーストバイを見積もるには、4番目の引数として `true` を渡します：

```typescript {% title="first-buy-quote.ts" showLineNumbers=true %}
const firstBuyQuote = getSwapResult(bucket, SOL_IN, SwapDirection.Buy, true);
console.log('Fee (waived): ', firstBuyQuote.fee.toString()); // 0n
```

### 現在の価格ヘルパー

```typescript {% title="current-price.ts" showLineNumbers=true %}
import {
  getCurrentPrice,
  getCurrentPriceQuotePerBase,
  getCurrentPriceComponents,
} from '@metaplex-foundation/genesis';

const tokensPerSol = getCurrentPrice(bucket);          // bigint
const lamportsPerToken = getCurrentPriceQuotePerBase(bucket); // bigint
const { baseReserves, quoteReserves } = getCurrentPriceComponents(bucket);
```

## スリッページ保護

`applySlippage(expectedAmountOut, slippageBps)` は期待される出力をスリッページ許容範囲で減らします。結果を `minAmountOutScaled` としてスワップインストラクションに渡します — オンチェーンプログラムは実際の出力がこの値を下回った場合にトランザクションを拒否します。

```typescript {% title="slippage.ts" showLineNumbers=true %}
import { getSwapResult, applySlippage, SwapDirection } from '@metaplex-foundation/genesis';

const quote = getSwapResult(bucket, 1_000_000_000n, SwapDirection.Buy);
const minAmountOutScaled = applySlippage(quote.amountOut, 100); // 1%スリッページ
```

{% callout type="warning" %}
`applySlippage` から導出した `minAmountOutScaled` なしでスワップを送信しないでください。ボンディングカーブの価格はすべての取引で変化します。スリッページ保護なしでは、ユーザーが見積もりより大幅に少ないトークンを受け取る可能性があります。
{% /callout %}

一般的な値：安定した条件では50 bps（0.5%）、ボラティリティの高いローンチ中は200 bps（2%）。

## スワップトランザクションの構築

`swapBondingCurveV2(umi, accounts)` はスワップインストラクションを構築します。呼び出し元はトランザクションの前後でラップドSOL（wSOL）の処理を担当します。

### 購入トランザクション（SOLからトークン）

{% code-tabs-imported from="genesis/swap_buy" frameworks="umi,cli" defaultFramework="umi" /%}

### 売却トランザクション（トークンからSOL）

{% code-tabs-imported from="genesis/swap_sell" frameworks="umi,cli" defaultFramework="umi" /%}

### wSOLラッピングに関する注意

{% callout type="warning" title="wSOLの手動処理が必要" %}
`swapBondingCurveV2` はクォートトークンとしてラップドSOL（wSOL）を使用し、ネイティブSOLを自動的にラップ・アンラップ**しません**。

**購入の場合：** wSOL ATAを作成し、必要なラムポートを転送して、スワップを送信する前に `syncNative` を呼び出してください。

**売却の場合：** スワップが確認された後にwSOL ATAを閉じてネイティブSOLにアンラップしてください。

現在のバージョンでは、クォートトークンとしてwSOLのみが受け入れられます。
{% /callout %}

```typescript {% title="wsol-wrap-unwrap.ts" showLineNumbers=true %}
import {
  findAssociatedTokenPda,
  createAssociatedTokenAccountIdempotentInstruction,
  syncNative,
  closeToken,
} from '@metaplex-foundation/mpl-toolbox';
import { transactionBuilder, sol, publicKey } from '@metaplex-foundation/umi';

const wSOL = publicKey('So11111111111111111111111111111111111111112');
const [wSolAta] = findAssociatedTokenPda(umi, { mint: wSOL, owner: umi.identity.publicKey });

// --- 購入前にSOLをラップする ---
const wrapBuilder = transactionBuilder()
  .add(createAssociatedTokenAccountIdempotentInstruction(umi, {
    mint: wSOL,
    owner: umi.identity.publicKey,
  }))
  .add(syncNative(umi, { account: wSolAta }));

await wrapBuilder.sendAndConfirm(umi);

// --- 売却後にSOLをアンラップする ---
const unwrapBuilder = closeToken(umi, {
  account: wSolAta,
  destination: umi.identity.publicKey,
  authority: umi.identity,
});

await unwrapBuilder.sendAndConfirm(umi);
```

## クリエイター手数料の請求

クリエイター手数料はスワップごとに直接転送されるのではなく、バケット（`creatorFeeAccrued`）に蓄積されます。カーブがアクティブな間はパーミッションレスの `claimBondingCurveCreatorFeeV2` インストラクションで、グラデュエーション後は `claimRaydiumCreatorFeeV2` で回収します。

蓄積残高の確認方法やグラデュエーション後のRaydium LP手数料の処理を含む完全な請求フローについては、[クリエイター手数料](/smart-contracts/genesis/creator-fees)を参照してください。

## エラーハンドリング

| エラー | 原因 | 対処法 |
|-------|-------|------------|
| `BondingCurveInsufficientFunds` | 残りのトークン（購入）またはSOL（売却）が不足している | バケットを再取得して再見積もりする。カーブがほぼ売り切れの可能性がある |
| `InsufficientOutputAmount` | 実際の出力が `minAmountOutScaled` を下回った | `slippageBps` を増やすか、すぐに再試行する |
| `InvalidSwapDirection` | `swapDirection` の値が無効 | `@metaplex-foundation/genesis` インポートから `SwapDirection.Buy` または `SwapDirection.Sell` を渡す |
| `BondingCurveNotStarted` | `swapStartCondition` がまだ満たされていない | `bucket.swapStartCondition` を確認して待つ |
| `BondingCurveEnded` | カーブが売り切れまたはグラデュエーション済み | ユーザーをRaydium CPMMプールに誘導する |

```typescript {% title="error-handling.ts" showLineNumbers=true %}
async function executeBuy(bucket, amountIn: bigint, slippageBps: number) {
  if (!isSwappable(bucket)) {
    if (isSoldOut(bucket)) throw new Error('Token sold out. Trade on Raydium.');
    throw new Error('Curve not yet active. Check the start time.');
  }

  const quote = getSwapResult(bucket, amountIn, SwapDirection.Buy);
  const minAmountOutScaled = applySlippage(quote.amountOut, slippageBps);

  try {
    return await swapBondingCurveV2(umi, {
      amount: quote.amountIn,
      minAmountOutScaled,
      swapDirection: SwapDirection.Buy,
      // ... アカウント
    }).sendAndConfirm(umi);
  } catch (err: any) {
    if (err.message?.includes('InsufficientOutputAmount'))
      throw new Error('Price moved. Try again with higher slippage.');
    if (err.message?.includes('BondingCurveInsufficientFunds'))
      throw new Error('Not enough tokens remaining. Reduce amount.');
    throw err;
  }
}
```

## Notes

- 本番環境ではスワップごとにバケットを再取得してください — 他のユーザーの取引ごとに価格が変わります
- `virtualSol` と `virtualTokens` はカーブ作成後は不変です — キャッシュしてください。リアルリザーブフィールドのみスワップごとに変化します
- `isGraduated` は呼び出しのたびにRPC呼び出しを行います — インデクサーで結果をキャッシュしてください
- `isSoldOut` が `true` を返してから `isGraduated` が `true` を返すまでの間、カーブは売り切れてもRaydiumはまだ資金調達されていません。`isGraduated` がプールの存在を確認するまでユーザーをRaydiumに誘導しないでください
- イベントのデコードとライフサイクルのインデックス作成については[インデックス作成とイベント](/smart-contracts/genesis/bonding-curve-indexing)を参照してください
- すべての手数料金額はラムポート（SOL側）です。現在の手数料率については[プロトコル手数料](/protocol-fees)を参照してください

## APIリファレンス

### 見積もりと価格関数

| 関数 | 非同期 | 戻り値 | 説明 |
|----------|-------|---------|-------------|
| `getSwapResult(bucket, amountIn, swapDirection, isFirstBuy?)` | いいえ | `{ amountIn, fee, creatorFee, amountOut }` | 手数料調整済みスワップ見積もり |
| `getCurrentPrice(bucket)` | いいえ | `bigint` | SOL単位あたりのベーストークン（整数除算） |
| `getCurrentPriceQuotePerBase(bucket)` | いいえ | `bigint` | ベーストークン単位あたりのラムポート（整数除算） |
| `getCurrentPriceComponents(bucket)` | いいえ | `{ baseReserves, quoteReserves }` | bigintとして結合した仮想＋リアルリザーブ |

### ライフサイクル関数

| 関数 | 非同期 | 戻り値 | 説明 |
|----------|-------|---------|-------------|
| `isSwappable(bucket)` | いいえ | `boolean` | パブリックトレードを受け付けているとき `true` |
| `isFirstBuyPending(bucket)` | いいえ | `boolean` | 指定されたファーストバイがまだ完了していないとき `true` |
| `isSoldOut(bucket)` | いいえ | `boolean` | `baseTokenBalance === 0n` のとき `true` |
| `getFillPercentage(bucket)` | いいえ | `number` | 売却済み割り当ての0〜100パーセント |
| `isGraduated(umi, bucket)` | はい | `boolean` | Raydium CPMMプールがオンチェーンに存在するとき `true` |

### スリッページ

| 関数 | 戻り値 | 説明 |
|----------|---------|-------------|
| `applySlippage(amountOut, slippageBps)` | `bigint` | `amountOut` を `slippageBps / 10_000` で減らす |

### スワップインストラクションアカウント

| アカウント | 書き込み可能 | 署名者 | 説明 |
|---------|----------|--------|-------------|
| `genesisAccount` | はい | いいえ | Genesis調整PDA |
| `bucket` | はい | いいえ | `BondingCurveBucketV2` PDA |
| `baseMint` | いいえ | いいえ | SPLトークンミント |
| `quoteMint` | いいえ | いいえ | wSOLミント |
| `baseTokenAccount` | はい | いいえ | ユーザーのベーストークンATA |
| `quoteTokenAccount` | はい | いいえ | ユーザーのwSOL ATA |
| `payer` | はい | はい | トランザクション手数料の支払者 |

### アカウント検出

| 関数 | 戻り値 | 説明 |
|----------|---------|-------------|
| `findBondingCurveBucketV2Pda(umi, { genesisAccount, bucketIndex })` | `[PublicKey, bump]` | バケットPDAを導出する |
| `findGenesisAccountV2Pda(umi, { baseMint, genesisIndex })` | `[PublicKey, bump]` | genesisアカウントPDAを導出する |
| `fetchBondingCurveBucketV2(umi, pda)` | `BondingCurveBucketV2` | アカウントを取得してデシリアライズする |

## FAQ

### isSwappableとisSoldOutの違いは何ですか？

`isSwappable` はカーブがアクティブにパブリックトレードを受け付けているときのみ `true` を返します。`isSoldOut` は `baseTokenBalance` がゼロになった瞬間に `true` を返し、取引が終了してグラデュエーションがトリガーされます。カーブは売り切れでもまだグラデュエーションしていない場合があります。

### swapBondingCurveV2を呼び出す前にSOLをラップする必要がありますか？

はい。ボンディングカーブはクォートトークンとしてwSOLを使用し、`swapBondingCurveV2` はネイティブSOLを自動的にラップ・アンラップしません。[wSOLラッピングに関する注意](#wsol-ラッピングに関する注意)を参照してください。

### getSwapResultは何を返し、手数料はどのように処理されますか？

`getSwapResult` は `{ amountIn, fee, creatorFee, amountOut }` を返します。購入の場合、手数料はAMM公式が実行される前にSOL入力から差し引かれます。売却の場合、手数料はAMM実行後にSOL出力から差し引かれます。ファーストバイ手数料免除のシミュレーション（すべての手数料をゼロにする）には、4番目の引数として `true` を渡してください。

### スリッページから保護するにはどうすればよいですか？

`applySlippage(quote.amountOut, slippageBps)` を呼び出して `minAmountOutScaled` を導出し、`swapBondingCurveV2` に `minAmountOutScaled` フィールドとして渡してください。オンチェーンプログラムは実際の出力がこの値を下回った場合にトランザクションを拒否します。
