---
title: ボンディングカーブ — 高度なインターナル
metaTitle: Genesis ボンディングカーブの高度なインターナル | Metaplex
description: Genesis ボンディングカーブの深層リファレンス — スワップ価格公式、逆算、リザーブ枯渇クランプ、BondingCurveBucketV2アカウント構造、拡張機能。
updated: '04-09-2026'
keywords:
  - bonding curve
  - constant product AMM
  - swap formula
  - virtual reserves
  - reserve exhaustion
  - BondingCurveBucketV2
  - genesis
  - Metaplex
about:
  - Bonding Curve
  - Constant Product AMM
  - Genesis
proficiencyLevel: Advanced
---

Genesis ボンディングカーブのスワップ価格公式、リザーブ枯渇処理、`BondingCurveBucketV2` オンチェーンアカウント構造のリファレンスです。 {% .lead %}

## Summary

このページは、Genesis ボンディングカーブ上でスワップエンジン、価格ツール、またはプロトコルツールを構築するインテグレーターのための実装レベルの詳細を説明します。SDKを使用したスワップトランザクションの実行については、[ボンディングカーブスワップ統合](/smart-contracts/genesis/bonding-curve-swaps)を参照してください。プログラムが発行するイベントのインデックス作成については、[インデックス作成とイベント](/smart-contracts/genesis/bonding-curve-indexing)を参照してください。

- **スワップ公式** — 正確な `ceil(k / x)` 購入および売却計算
- **逆算** — 希望する出力に対して必要な入力を計算
- **リザーブ枯渇** — 供給量がゼロに近いときのシステムのクランプと再計算方法
- **`BondingCurveBucketV2`** — オンチェーンアカウントの完全なフィールドリファレンス

概念モデル、手数料構造、ライフサイクルの概要については、[動作理論](/smart-contracts/genesis/bonding-curve-theory)を参照してください。

## スワップ価格公式

すべてのスワップ計算は結合リザーブを使用します：

```
totalSol    = virtualSol + realSol
totalTokens = virtualTokens + realTokens
k           = totalSol × totalTokens
```

### 購入（SOL入力、トークン出力）

```
inputReserve     = totalSol
outputReserve    = totalTokens

newInputReserve  = inputReserve + amountIn
newOutputReserve = ceil(k / newInputReserve)
tokensOut        = outputReserve - newOutputReserve
```

### 売却（トークン入力、SOL出力）

```
inputReserve     = totalTokens
outputReserve    = totalSol

newInputReserve  = inputReserve + amountIn
newOutputReserve = ceil(k / newInputReserve)
solOut           = outputReserve - newOutputReserve
```

### 切り上げ除算

切り上げ除算（`ceil(k / x)`）はすべてのスワップ計算で使用されます。これにより定積不変条件が決して侵されないことが保証されます：

```
newInputReserve × (outputReserve − outputAmount) ≥ k
```

プールは取引によってのみ価値を得ることができ、失うことはありません。丸め誤差はプールに有利に蓄積されます。

## 逆算：希望する出力に対して必要な入力

枯渇時のリザーブのクランプ処理で内部的に使用されます — 特定の出力を生成するために必要な正確な入力を計算します：

```
newOutputReserve = outputReserve - desiredAmountOut
newInputReserve  = ceil(k / newOutputReserve)
requiredAmountIn = newInputReserve - inputReserve
```

これはユーザーが希望するトークン量を指定し、UIが正確なSOLコストを表示する必要があるUXフローにも役立ちます。

## リザーブ枯渇とクランプ

スワップがカーブの利用可能な出力を超えると、システムは出力をクランプして入力を再計算します — トランザクションは失敗しません。

### 購入のクランプ（トークン供給枯渇）

`tokensOut > baseTokenBalance` の場合：

1. 出力は `baseTokenBalance` に制限される
2. 必要なSOL入力は逆算公式で再計算される
3. 購入者は実際に利用可能なトークン分のみ支払う
4. この最後の購入はグラデュエーションもトリガーする

### 売却のクランプ（SOL供給枯渇）

バケットに総出力と手数料の両方をカバーするSOLが不足している場合：

1. システムは利用可能なSOL残高から逆算する
2. 手数料は利用可能な金額で再計算される
3. 売り手は手数料差し引き後の残りを受け取る
4. 逆算公式でマッチするよう必要なトークン入力が再計算される

## BondingCurveBucketV2アカウント構造

`BondingCurveBucketV2` アカウントにはすべてのボンディングカーブ状態が保存されます。完全なTypeScript型定義については[Genesis JavaScript SDK](/smart-contracts/genesis/sdk/javascript)を参照してください。

### コアリザーブフィールド

| フィールド | 型 | 説明 |
|-------|------|-------------|
| `baseTokenBalance` | `bigint` | カーブに残っているトークン。ゼロは売り切れを意味する。 |
| `baseTokenAllocation` | `bigint` | 作成時に割り当てられた総トークン数。 |
| `quoteTokenDepositTotal` | `bigint` | 購入者が入金した実際のSOL（ラムポート）。0から始まる。 |
| `virtualSol` | `bigint` | 仮想SOLリザーブ（価格計算のみ、実際には入金されない）。 |
| `virtualTokens` | `bigint` | 仮想トークンリザーブ（価格計算のみ、実際には入金されない）。 |

### 手数料設定フィールド

| フィールド | 型 | 説明 |
|-------|------|-------------|
| `depositFee` | `number` | 購入のSOL入力側のプロトコル手数料率。 |
| `withdrawFee` | `number` | 売却のSOL出力側のプロトコル手数料率。 |
| `creatorFeeAccrued` | `bigint` | 蓄積されたクリエイター手数料の合計（未請求）。 |
| `creatorFeeClaimed` | `bigint` | 累計の請求済みクリエイター手数料。 |

### スワップ条件フィールド

| フィールド | 型 | 説明 |
|-------|------|-------------|
| `swapStartCondition` | `object` | 取引が許可される前に満たされなければならない条件。 |
| `swapEndCondition` | `object` | トリガーされると取引を終了させる条件。 |

### BondingCurveBucketV2拡張機能

バケットには独立して設定可能なオプション機能を持つ拡張機能ブロックが含まれています：

| 拡張機能 | 説明 |
|-----------|-------------|
| **ファーストバイ（First Buy）** | 手数料無料の初回購入のための購入者とSOL金額を指定する。最初の購入が完了すると消費される。 |
| **クリエイター手数料（Creator Fee）** | 宛先ウォレットアドレスと手数料率を持つオプションのクリエイター手数料。手数料はスワップごとに転送されるのではなく、バケットに蓄積される（`creatorFeeAccrued`）。プロトコル手数料とは独立して計算され、複合しない。ファーストバイでは両方が免除される。設定と請求については[クリエイター手数料](/smart-contracts/genesis/creator-fees)を参照。 |

## Notes

- `virtualSol` と `virtualTokens` はカーブ作成時に設定され、不変です — 価格カーブの形状を永続的に定義します
- すべてのスワップ計算で `ceil(k / x)` 除算が使用され、プールが価値を失わないことを保証します。丸め誤差はプールに有利に蓄積されます
- グラデュエーションはトークンの完全枯渇時に自動的に発動されます — 別途のインストラクションやクランクは不要です
- `BondingCurveBucketV2` 識別子はアカウントタイプごとに固有です。`BondingCurveSwapEvent` 識別子は常にバイト `255` です

## クイックリファレンス

| 公式 | 式 |
|---------|-----------|
| 結合SOLリザーブ | `totalSol = virtualSol + realSol` |
| 結合トークンリザーブ | `totalTokens = virtualTokens + realTokens` |
| 定積 | `k = totalSol × totalTokens` |
| 現在の価格（トークン/SOL） | `totalTokens / totalSol` |
| 購入出力 | `outputReserve − ceil(k / (inputReserve + amountIn))` |
| 売却出力 | `outputReserve − ceil(k / (inputReserve + amountIn))` |
| 希望する出力に必要な入力 | `ceil(k / (outputReserve − desiredOut)) − inputReserve` |
