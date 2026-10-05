---
title: ボンディングカーブ — プロトコルパラメーター
metaTitle: Genesis ボンディングカーブ プロトコルパラメーター | Metaplex
description: Genesis ボンディングカーブの具体的なプロトコルパラメーター — トークン供給のデフォルト値、仮想準備金、手数料スケジュール、卒業目標。
created: '08-03-2026'
updated: '08-05-2026'
keywords:
  - bonding curve
  - protocol parameters
  - virtual reserves
  - fee schedule
  - graduation
  - genesis
  - Metaplex
  - token supply
  - program ID
about:
  - Bonding Curve
  - Genesis
  - Protocol Parameters
proficiencyLevel: Intermediate
faqs:
  - q: Genesis ボンディングカーブトークンの開始価格はいくらですか？
    a: 開始価格（SOL あたりのトークン数）= (virtualTokens / 10^decimals) / (virtualSol / 10^9)。virtualTokens は生単位、virtualSol はラムポート建てのため、SOL あたりのトークン数として価格を示す前に両方を換算する必要があります。プロトコルのデフォルト値では、曲線がいつ開始されても固定の開始価格になります。
  - q: 曲線が卒業するまでにどれだけの SOL が調達されますか？
    a: 卒業時に蓄積される実際のラムポートは (k / virtualTokens) − virtualSol に等しくなります。ここで k = virtualSol × (virtualTokens + baseTokenAllocation) です。SOL で表すには 10^9 で割ります。実際には、これはプロトコルパラメーター表に記載されている卒業目標 SOL と等しくなります。
  - q: クリエイターは仮想準備金やトークン供給を変更できますか？
    a: いいえ。仮想準備金、トークン供給、小数点桁数はプロトコルのデフォルト値で設定されており、API を通じてローンチごとに上書きすることはできません。
  - q: クリエイター手数料は 0.50% のプロトコル手数料に含まれますか？
    a: いいえ。クリエイター手数料は別個で加算されます。両方とも各スワップのグロス SOL 額に対して独立して計算され、複合しません。スワップあたりの最大合計手数料はプロトコル手数料 + クリエイター手数料です。
  - q: ボンディングカーブの手数料は卒業後も適用されますか？
    a: いいえ。卒業後、取引は Raydium CPMM プールに移行します。代わりに卒業後の取引手数料スケジュール — 0.40% のプロトコル手数料、0.60% のクリエイター収益、0.21% の LP 手数料、0.04% の Raydium 手数料 — が適用されます。
---

Genesis ボンディングカーブの具体的なプロトコルパラメーター — Metaplex API を通じて作成されるすべてのローンチを定義する固定値です。 {% .lead %}

## Summary

すべての Genesis ボンディングカーブローンチは、同じプロトコルレベルのパラメーターを共有します。これらの値は Metaplex API によって設定され、ローンチごとに上書きすることはできません。

- **固定の供給量と小数点桁数** — すべての曲線は小数点以下6桁の 1,000,000,000 トークンで開始
- **不変の仮想準備金** — `virtualSol` と `virtualTokens` は曲線作成時に設定され、最初の取引から卒業までの価格軌道全体を定義
- **2段階の手数料構造** — すべてのスワップに 0.50% のプロトコル手数料とオプションのクリエイター手数料。卒業後の Raydium CPMM プールには別の手数料スケジュールが適用
- **自動卒業** — `baseTokenBalance` がゼロに達すると発動。手動のトリガーは不要

これらのパラメーターを使用する AMM 価格モデルについては[動作理論](/smart-contracts/genesis/bonding-curve-theory)を、生のスワップ式については[高度な内部構造](/smart-contracts/genesis/bonding-curve-internals)をご参照ください。

## プロトコルパラメーター

すべての Genesis ボンディングカーブローンチは、以下の固定プロトコル値で作成されます。

| パラメーター | 値 | 備考 |
|-----------|-------|-------|
| **プログラム ID** | `GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B` | Solana メインネット |
| **トークン供給量** | 1,000,000,000 | 小数点適用前の生単位 |
| **小数点桁数** | 6 | SPL トークンの小数点桁数 |
| **トークン供給量（小数点適用後）** | 1,000,000,000,000,000 | `supply × 10^decimals` |
| **`virtualSol`** | [TBD] lamports | 仮想 SOL 準備金 — 開始価格を設定 |
| **`virtualTokens`** | [TBD] 生単位 | 仮想トークン準備金 — `virtualSol` とペアリング |
| **卒業目標** | [TBD] SOL | 完全売り切り時に蓄積される実際の SOL |
| **`baseTokenAllocation`** | 1,000,000,000,000,000 | すべてのトークンが曲線に割り当てられる |

{% callout type="note" %}
`virtualSol` と `virtualTokens` は曲線作成後は不変です。プログラムが発行するすべてのイベントには両方の値が含まれるため、オフチェーンでの価格計算に別途アカウントフェッチは必要ありません。[インデックスとイベント](/smart-contracts/genesis/bonding-curve-indexing)をご参照ください。
{% /callout %}

## 手数料スケジュール

トークンのライフサイクルには 2 つの異なる手数料スケジュールが適用されます。ボンディングカーブがアクティブな間のスケジュールと、Raydium への卒業後のスケジュールです。

### ボンディングカーブ（アクティブフェーズ）

手数料はすべてのスワップの **SOL 側**に適用されます。両方の手数料はグロス SOL 額に対して独立して計算され、複合しません。正味の SOL 入出金額 = グロス − プロトコル手数料 − クリエイター手数料。

| 手数料 | 料率 | 受取先 |
|-----|------|-----------|
| **プロトコル手数料** | 0.50% | Metaplex の手数料ウォレット — スワップごとに転送 |
| **クリエイター手数料** | 0.60%（最大） | 設定された `creatorFeeWallet` — バケットに累積し、`claimBondingCurveCreatorFeeV2` で請求 |

{% callout type="note" %}
クリエイター手数料はオプションです。`creatorFeeWallet` が設定されていない場合、クリエイター手数料は請求されません。設定されている場合、0.60% がプロトコル定義の最大値です。ファーストバイメカニズムが使用される場合、最初の買いは両方の手数料が免除されます。[クリエイター手数料](/smart-contracts/genesis/creator-fees)をご参照ください。
{% /callout %}

### 卒業後（Raydium CPMM プール） {% #post-graduation-raydium-cpmm-pool %}

曲線の卒業後、取引は Raydium CPMM プールに移行します。別の手数料スケジュールが適用されます：

| 手数料 | 料率 | 受取先 |
|-----|------|-----------|
| **プロトコル手数料** | 0.40% | Metaplex |
| **クリエイター収益** | 0.60% | クリエイター手数料ウォレット — `claimRaydiumCreatorFeeV2` で請求 |
| **LP 手数料** | 0.21% | 流動性プロバイダー |
| **Raydium 手数料** | 0.04% | Raydium プロトコル |

## 価格と卒業の計算

プロトコルのデフォルト値では、以下の値は曲線作成時に完全に決定されます。

### 開始価格

開始価格は仮想準備金の比率であり、オンチェーン単位（生トークン単位とラムポート）から人間向けの単位（トークンと SOL）に換算したものです。

```
startingPrice (tokens per SOL) = (virtualTokens / 10^decimals) / (virtualSol / 10^9)
```

`virtualTokens` は生単位、`virtualSol` はラムポートで保存されているため、SOL あたりのトークン数として価格を示す前に、それぞれ `10^decimals`（プロトコルのデフォルトでは 10^6）と `10^9` で割ります。これは、（実際の SOL がプールに入る前の）一番最初のスワップで買い手が目にする価格です。

### 卒業時の時価総額

卒業時には `baseTokenBalance = 0` となり、すべての実際のトークンが売却済みです。蓄積された実際の SOL は卒業目標と等しくなります。卒業時の完全希薄化時価総額：

```
graduationLamports = (k / virtualTokens) − virtualSol
  where k = virtualSol × (virtualTokens + baseTokenAllocation)
graduationSOL = graduationLamports / 10^9

priceAtGraduation (lamports per raw unit) = k / virtualTokens^2
fdvAtGraduation (SOL) = totalSupply (raw units) × priceAtGraduation / 10^9
```

### コンスタントプロダクト不変式

不変式 `k` は曲線作成時に固定され、曲線がアクティブな間は変化しません。

```
k = virtualSol × (virtualTokens + baseTokenAllocation)
```

`k` は曲線のライフサイクル全体を通じて一定です（スワップごとに切り上げ）。

## Notes

- 仮想準備金はすべての `BondingCurveSwapEvent` に含まれます — オフチェーンでの価格計算にバケットアカウントを取得する別途 RPC 呼び出しは不要です
- プロトコル手数料率と仮想準備金の値は Metaplex が設定し、`createAndRegisterLaunch` API を通じてローンチごとに上書きすることはできません
- 卒業は `baseTokenBalance` を使い切るスワップで自動的に発動します — 最後のトークンをクリアするトランザクションが同時に Raydium への移行もトリガーします
- クリエイター手数料は `creatorFeeAccrued` に累積されます（スワップごとには転送されません）。`creatorFeeClaimed` は累計請求額を追跡し、両方とも `claimBondingCurveCreatorFeeV2` の呼び出しごとに累積に対して相対的にリセットされます

## Quick Reference

| 項目 | 値 |
|------|-------|
| プログラム ID | `GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B` |
| デフォルト供給量 | `1,000,000,000`（10億トークン、小数点以下6桁） |
| `baseTokenAllocation` | `1,000,000,000,000,000` |
| プロトコルスワップ手数料 | `0.50%` |
| クリエイター手数料（最大） | `0.60%` |
| 卒業後プロトコル手数料 | `0.40%` |
| 卒業後 LP 手数料 | `0.21%` |
| 卒業後 Raydium 手数料 | `0.04%` |
| `virtualSol` | `[TBD]` |
| `virtualTokens` | `[TBD]` |
| 卒業目標 | `[TBD] SOL` |
| JS SDK | `@metaplex-foundation/genesis` |
| ソース | [GitHub](https://github.com/metaplex-foundation/mpl-genesis) |

## FAQ

### Genesis ボンディングカーブトークンの開始価格はいくらですか？

SOL あたりのトークン数での開始価格 = `(virtualTokens / 10^decimals) / (virtualSol / 10^9)`。`virtualTokens` は生単位、`virtualSol` はラムポート建てのため、価格を示す前に両方を換算します。これは完全にプロトコルのデフォルト値によって決まります — クリエイターがカスタムの開始価格を設定することはできません。

### 曲線が卒業するまでにどれだけの SOL が調達されますか？

売り切り時に蓄積される実際の SOL は、上記のプロトコルパラメーター表に記載されている卒業目標と等しくなります。これはコンスタントプロダクト式から直接導かれます：`graduationLamports = (k / virtualTokens) − virtualSol`（SOL で表すには `10^9` で割ります）。

### クリエイターは仮想準備金やトークン供給を変更できますか？

いいえ。`virtualSol`、`virtualTokens`、トークン供給量、小数点桁数は Metaplex API が設定するプロトコルのデフォルト値です。ローンチごとにこれらを上書きする API パラメーターはありません。

### クリエイター手数料は 0.50% のプロトコル手数料に含まれますか？

いいえ。プロトコル手数料（0.50%）とクリエイター手数料（最大 0.60%）は独立しています。両方ともスワップのグロス SOL 額に対して計算され、別々に差し引かれます。複合しません。

### ボンディングカーブの手数料は卒業後も適用されますか？

いいえ。卒業後、ボンディングカーブアカウントは閉鎖され、取引は Raydium CPMM プールに移行します。卒業後の取引手数料スケジュールが適用されます — 上記の[卒業後の手数料スケジュール](#post-graduation-raydium-cpmm-pool)の表をご参照ください。
