---
title: ボンディングカーブ — インデックス作成とイベント
metaTitle: Genesis ボンディングカーブのインデックス作成とイベント | Metaplex
description: Genesis ボンディングカーブのライフサイクルをインデックスする方法 — GPAによる検出、BondingCurveSwapEventのデコード、イベントからの価格追跡、アカウント識別子。
updated: '04-09-2026'
keywords:
  - bonding curve
  - indexing
  - swap events
  - BondingCurveSwapEvent
  - genesis
  - GPA
  - lifecycle events
  - price tracking
  - Solana
about:
  - Bonding Curve
  - Indexing
  - Swap Events
  - Genesis
proficiencyLevel: Advanced
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: トランザクションからBondingCurveSwapEventをデコードするにはどうすればよいですか？
    a: Genesisプログラム（GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B）上の識別子バイトが255のインナーインストラクションを見つけ、最初のバイトを切り落として、残りのバイトをgetBondingCurveSwapEventSerializer().deserialize()に渡します。イベントにはswapDirection、quoteTokenAmount、baseTokenAmount、fee、creatorFee、スワップ後のリザーブ状態（baseTokenBalance、quoteTokenDepositTotal、virtualSol、virtualTokens）が含まれます。
  - q: isSoldOutとisGraduatedの違いは何ですか？
    a: isSoldOutはバケットのbaseTokenBalanceに対する同期チェックで、すべてのトークンが購入された瞬間にtrueを返します。isGraduatedはRaydium CPMMプールが作成・資金調達されているかどうかを確認する非同期のRPC呼び出しです。売り切れからグラデュエーションまでの間は、isSoldOutがtrueでもisGraduatedがfalseになる期間があります。
---

Genesis ボンディングカーブの完全なライフサイクルをインデックスします — GPAでカーブを検出し、スワップごとのイベントをデコードし、ポーリングなしで価格と状態の変化を追跡します。 {% .lead %}

## Summary

Genesisプログラムは、すべての確認済みスワップで `BondingCurveSwapEvent` インナーインストラクションを発行します。インデクサーはこれとGPAクエリおよびライフサイクルインストラクション追跡を組み合わせて、取引ごとにアカウントをフェッチすることなく完全なカーブ状態を再構築できます。

- **GPA検出** — プログラム全体の `BondingCurveBucketV2` アカウントを検索
- **スワップイベント** — インナーインストラクション上の識別子バイト `255`。方向、金額、手数料、スワップ後のリザーブを含む
- **イベントからの価格** — 追加のRPC呼び出しなしにイベントデータから現在の価格を導出
- **ライフサイクル追跡** — トークン作成からRaydiumグラデュエーションまでの8つの異なるイベント

**プログラムID:** `GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B`

## すべてのボンディングカーブの検出（GPA）

GPAビルダーを使用してプログラム上のすべての `BondingCurveBucketV2` アカウントを取得します — ダッシュボード、アグリゲーター、インデクサーに役立ちます。アカウントフィールドの完全なリファレンスは[高度なインターナル](/smart-contracts/genesis/bonding-curve-internals)を参照してください。

```typescript {% title="discover-all-curves.ts" showLineNumbers=true %}
import { getBondingCurveBucketV2GpaBuilder } from '@metaplex-foundation/genesis';

const allCurves = await getBondingCurveBucketV2GpaBuilder(umi)
  .whereField('discriminator', /* BondingCurveBucketV2 discriminator */)
  .get();

for (const curve of allCurves) {
  console.log('Bucket PDA:         ', curve.publicKey.toString());
  console.log('Base token balance: ', curve.data.baseTokenBalance.toString());
}
```

## スワップイベントのデコード

すべての確認済みスワップは、識別子バイト `255` を持つ `BondingCurveSwapEvent` インナーインストラクションを発行します。トランザクションからデコードして、正確なスワップ後のリザーブ状態、手数料の内訳、方向を取得します。

### BondingCurveSwapEventのフィールド

| フィールド | 型 | 説明 |
|-------|------|-------------|
| `swapDirection` | `SwapDirection` | `SwapDirection.Buy`（SOL入力、トークン出力）または `SwapDirection.Sell`（トークン入力、SOL出力） |
| `quoteTokenAmount` | `bigint` | スワップのSOL金額（購入の入力、売却の総出力）、ラムポート単位 |
| `baseTokenAmount` | `bigint` | スワップのトークン金額（購入の出力、売却の入力） |
| `fee` | `bigint` | 請求されたプロトコル手数料、ラムポート単位 |
| `creatorFee` | `bigint` | 請求されたクリエイター手数料、ラムポート単位（クリエイター手数料未設定の場合は0） |
| `baseTokenBalance` | `bigint` | スワップ後の `baseTokenBalance` |
| `quoteTokenDepositTotal` | `bigint` | スワップ後の `quoteTokenDepositTotal` |
| `virtualSol` | `bigint` | 仮想SOLリザーブ（不変 — アカウントをフェッチせずに価格計算に役立つ） |
| `virtualTokens` | `bigint` | 仮想トークンリザーブ（不変 — 同上） |
| `blockTime` | `bigint` | スワップを含むブロックのUnixタイムスタンプ |

### 確認済みトランザクションからのデコード

```typescript {% title="decode-swap-event.ts" showLineNumbers=true %}
import { getBondingCurveSwapEventSerializer, SwapDirection } from '@metaplex-foundation/genesis';

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

      // 識別子バイトを切り落として、デシリアライズする。
      const [event] = serializer.deserialize(data.slice(1));

      const isBuy = event.swapDirection === SwapDirection.Buy;
      console.log('Direction:            ', isBuy ? 'buy' : 'sell');
      console.log('Quote token amount:   ', event.quoteTokenAmount.toString(), 'lamports');
      console.log('Base token amount:    ', event.baseTokenAmount.toString());
      console.log('Protocol fee:         ', event.fee.toString(), 'lamports');
      console.log('Creator fee:          ', event.creatorFee.toString(), 'lamports');
      console.log('Base balance:         ', event.baseTokenBalance.toString());
      console.log('Quote deposit total:  ', event.quoteTokenDepositTotal.toString());

      return event;
    }
  }

  return null; // このトランザクションにはスワップイベントが見つからなかった。
}
```

## イベントからの現在の価格の追跡

取引ごとにアカウントをフェッチするのではなく、各 `BondingCurveSwapEvent` に含まれるスワップ後のリザーブ状態から現在の価格を導出します：

```typescript {% title="price-from-event.ts" showLineNumbers=true %}
function getPriceFromEvent(event: BondingCurveSwapEvent, bucket: BondingCurveBucketV2) {
  // totalTokens = virtualTokens + スワップ後のbaseTokenBalance（イベントに含まれる）
  const totalTokens = bucket.virtualTokens + event.baseTokenBalance;
  // totalSol = virtualSol + スワップ後のquoteTokenDepositTotal（イベントに含まれる）
  const totalSol = bucket.virtualSol + event.quoteTokenDepositTotal;
  // 価格：SOLあたりのトークン（bigintとしてベーストークン単位あたりのラムポート）
  return totalSol > 0n ? totalTokens / totalSol : 0n;
}
```

{% callout type="note" %}
`virtualSol` と `virtualTokens` はすべての `BondingCurveSwapEvent` に含まれます — イベントから価格を計算するために別途アカウントをフェッチする必要はありません。これらはカーブ作成後は不変です。
{% /callout %}

## ライフサイクルイベント

Genesisプログラムのインストラクションとインナーインストラクションイベントをリスニングして、ボンディングカーブの完全なライフサイクルを追跡します。SDKを使用したスワップトランザクションの実行については、[ボンディングカーブスワップ統合](/smart-contracts/genesis/bonding-curve-swaps)を参照してください。

| イベント | 説明 | 主要フィールド |
|-------|-------------|------------|
| トークン作成 | SPLトークンのミント、genesisアカウントの初期化 | `baseMint`、`genesisAccount` |
| ボンディングカーブ追加 | `BondingCurveBucketV2` アカウントの作成 | `bucketPda`、`baseTokenAllocation`、`virtualSol`、`virtualTokens` |
| ファイナライズ | ローンチ設定のロック、バケットのアクティブ化 | `genesisAccount` |
| ライブ開始 | `swapStartCondition` 充足、取引開始 | `bucketPda`、タイムスタンプ |
| スワップ | 購入または売却の実行 | `BondingCurveSwapEvent`（識別子 `255`） |
| 売り切れ | `baseTokenBalance === 0` | `bucketPda`、`quoteTokenDepositTotal` |
| グラデュエーションクランク | 流動性移行インストラクションの送信 | `bucketPda`、`raydiumCpmmPool` |
| グラデュエーション完了 | Raydium CPMMプールへの資金調達、ボンディングカーブのクローズ | `cpmmPoolPda`、累積SOL |

## アカウント識別子とPDA導出

### 識別子

| アカウント | 識別子 | 説明 |
|---------|---------------|-------------|
| `GenesisAccountV2` | アカウントタイプごとに固有 | マスター調整アカウント |
| `BondingCurveBucketV2` | アカウントタイプごとに固有 | ボンディングカーブAMM状態 |
| `BondingCurveSwapEvent` | `255`（インナーインストラクション） | プログラムが発行するスワップごとのイベント |

### PDAシード

| PDA | シード |
|-----|-------|
| `GenesisAccountV2` | `["genesis_account_v2", baseMint, genesisIndex (u8)]` |
| `BondingCurveBucketV2` | `["bonding_curve_bucket_v2", genesisAccount, bucketIndex (u8)]` |

TypeScriptでは、Genesis SDKの `findGenesisAccountV2Pda` と `findBondingCurveBucketV2Pda` を使ってPDAを導出します。

## Notes

- `virtualSol` と `virtualTokens` はすべての `BondingCurveSwapEvent` に含まれます — イベントから価格を計算するために別途アカウントをフェッチする必要はありません。これらはカーブ作成後は不変です
- `BondingCurveSwapEvent` の識別子は常にバイト `255` です — このリーディングバイトを持つGenesisプログラム上のインナーインストラクションはすべてスワップイベントです
- `isSoldOut` が `true` を返してから `isGraduated` が `true` を返すまでの間、カーブは売り切れてもRaydium CPMMプールはまだ資金調達されていません。`isGraduated` がプールの存在を確認するまでユーザーをRaydiumに誘導しないでください
- `isGraduated` は呼び出しのたびにRPC呼び出しを行います — 毎回のレンダリングで呼び出すのではなく、インデクサーで結果をキャッシュしてください

## FAQ

### BondingCurveSwapEventをデコードするにはどうすればよいですか？

Genesisプログラム（`GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B`）上で、最初のデータバイトが `255` のインナーインストラクションを見つけてください。そのバイトを切り落として残りを `getBondingCurveSwapEventSerializer().deserialize(data.slice(1))` に渡します。返されたオブジェクトには `swapDirection`、`quoteTokenAmount`、`baseTokenAmount`、`fee`、`creatorFee`、スワップ後のリザーブ状態（`baseTokenBalance`、`quoteTokenDepositTotal`、`virtualSol`、`virtualTokens`、`blockTime`）が含まれます。

### isSoldOutとisGraduatedの違いは何ですか？

`isSoldOut` はローカルの同期チェックで、`baseTokenBalance` が `0n` になるとすぐに `true` を返します。`isGraduated` は、Raydium CPMMプールがオンチェーンで作成・資金調達されているかどうかを確認する非同期RPC呼び出しです。売り切れからグラデュエーションまでの間は、`isSoldOut` が `true` でも `isGraduated` が `false` になる期間があります。`isGraduated` がプールの存在を確認するまでユーザーをRaydiumに誘導しないでください。
