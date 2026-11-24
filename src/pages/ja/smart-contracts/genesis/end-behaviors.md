---
title: 終了動作
metaTitle: Genesisの終了動作とtriggerBehaviorsV2 | Metaplex
description: Genesisの終了動作（SendQuoteTokenPercentage、SendStartPrice、BaseTokenRollover、TransmitFailure、再割り当て）のリファレンスと、パーミッションレスなクランク triggerBehaviorsV2 を実行するタイミングを解説します。
created: '10-29-2026'
updated: '11-24-2026'
keywords:
  - Genesis end behaviors
  - triggerBehaviorsV2
  - SendQuoteTokenPercentage
  - SendStartPrice
  - BaseTokenRollover
  - TransmitFailure
  - ReallocateBaseTokensOnFailure
  - token launch proceeds routing
about:
  - Genesis end behaviors
  - Launch proceeds routing
  - Launch failure handling
proficiencyLevel: Advanced
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: Genesisの終了動作とは何ですか？
    a: 終了動作は、バケットに保存されるアクションで、ソースバケットの終了後にトークンやデータを別のバケットに移動します。たとえば、販売の収益をトレジャリーやRaydiumグラデュエーションバケットに送信します。動作は、誰かがtriggerBehaviorsV2を呼び出したときに実行されます。
  - q: triggerBehaviorsV2を呼び出せるのは誰ですか？
    a: 任意のウォレットです。triggerBehaviorsV2は手数料支払者の署名のみを必要とします。プログラムが各動作を処理済みとしてマークするため、各動作は最大1回しか実行されません。
  - q: Launch Poolが最小しきい値に達しなかった場合、終了動作はどうなりますか？
    a: Launch Poolは失敗モードに入ります。ReallocateBaseTokensOnFailureとTransmitFailureの動作のみが実行されるため、入金されたSOLは入金者への返金のためにバケットに残ります。
  - q: ファイナライズ後に終了動作を変更できますか？
    a: いいえ。動作は、バケットの追加時、またはfinalizeV2の前に対応するset*BucketV2Behaviorsインストラクションで設定してください。ファイナライズ後の動作の変更はプログラムに拒否されます。
  - q: Raydiumグラデュエーション後にベーストークンが残るのはなぜですか？
    a: グラデュエーションは、開始価格でクォートトークンと釣り合うのに必要な分のベーストークンのみを移動します。Raydiumバケットの割り当ての残りは、Raydiumバケット上のBaseTokenRollover動作が別のバケットに移動するまでGenesisに残ります。
---

[Genesis](/ja/smart-contracts/genesis)の終了動作は、販売の収益をトレジャリーやRaydiumプールに送るなど、バケットに保存されるフェーズ終了後のアクションです。`triggerBehaviorsV2` は、それらを実行するパーミッションレスなクランクです。 {% .lead %}

## 概要 {% #summary %}

終了動作は、ソースバケットが終了した後に、クォートトークン、ベーストークン、価格、または失敗フラグをソースバケットから宛先バケットに移動します。

- 6種類の動作タイプで、収益の送付、グラデュエーションの価格設定、残余トークン、失敗時の処理をカバーします
- 動作は `finalizeV2` の前に設定し、その後は変更できません
- `triggerBehaviorsV2` は1つのソースバケットの未処理の動作をすべて実行し、手数料支払者のみを必要とします
- 最小しきい値に達しなかった販売は、失敗時の動作のみを実行します

**ジャンプ先:** [動作のタイプ](#genesis-end-behavior-types) · [設定](#configuring-end-behaviors) · [triggerBehaviorsV2](#running-end-behaviors-with-trigger-behaviors-v2) · [グラデュエーションへの送付](#routing-proceeds-to-raydium-graduation) · [失敗時の処理](#failure-handling-with-transmit-failure)

## Genesisの終了動作のタイプ {% #genesis-end-behavior-types %}

Genesisには6種類の終了動作タイプがあり、それぞれ特定のソースバケットタイプでのみ許可されます。

| 動作 | 内容 | 許可されるソースバケット |
|----------|--------------|------------------------|
| `SendQuoteTokenPercentage` | 集めたクォートトークン（SOLなど）の `percentageBps` を宛先に送信する | Launch Pool、Presale、ボンディングカーブ |
| `SendStartPrice` | 販売の最終価格をプールの開始価格としてRaydiumバケットに書き込む | Launch Pool、Presale、ボンディングカーブ |
| `BaseTokenRollover` | 残りのベーストークンの `percentageBps` を宛先に送信する | Presale、Raydium CPMM、Raydium CLMM |
| `ReallocateBaseTokensOnFailure` | 失敗モードのみ：残りのベーストークンの `percentageBps` を宛先に送信する | Launch Pool、Presale、Raydium CPMM、Raydium CLMM |
| `TransmitFailure` | 失敗モードのみ：後続のバケットを失敗としてマークする | Launch Pool、Presale |
| `ReallocateBaseTokensOnCancel` | キャンセルまたは完了したベスティングバケットの未ベストの残りを宛先に送信する | クレームスケジュール |

サポートされていないソースバケット上の動作は、プログラムが `BehaviorNotSupportedForBucketType` で拒否します。

### 動作オブジェクトの形状 {% #behavior-object-shapes %}

各動作は、固定長の `padding` を持つタグ付きオブジェクトです。設定時には `processed: false` を渡してください。

{% totem %}

```typescript {% title="endBehaviors.ts" %}
const endBehaviors = [
  { __kind: 'SendQuoteTokenPercentage', padding: Array(4).fill(0), destinationBucket, percentageBps: 8_000, processed: false },
  { __kind: 'SendStartPrice', padding: Array(6).fill(0), destinationBucket, processed: false },
  { __kind: 'BaseTokenRollover', padding: Array(4).fill(0), destinationBucket, percentageBps: 10_000, processed: false },
  { __kind: 'ReallocateBaseTokensOnFailure', padding: Array(4).fill(0), destinationBucket, percentageBps: 10_000, processed: false },
  { __kind: 'TransmitFailure', padding: Array(6).fill(0), destinationBucket, processed: false },
  { __kind: 'ReallocateBaseTokensOnCancel', padding: Array(6).fill(0), destinationBucket, processed: false },
]
```

{% /totem %}

`percentageBps` はベーシスポイントを使用し、`10_000` が100%です。各 `SendQuoteTokenPercentage` は販売の総収益（入金額。ソフトキャップが設定されている場合はソフトキャップが上限）から計算され、各 `BaseTokenRollover` は同じスナップショット残高から計算されます。そのため、`2_000` と `8_000` の2つの動作は、同じ金額の20%と80%を送信します。

## 終了動作の設定 {% #configuring-end-behaviors %}

終了動作は、対応する `set*BucketV2Behaviors` インストラクションでソースバケットに設定します。Raydium CPMMバケットとクレームスケジュールバケットでは、`add*BucketV2` インストラクションでも設定できます。いずれも `finalizeV2` の前に行う必要があります。

| ソースバケット | 作成時の設定 | ファイナライズ前の置き換え |
|---------------|-----------------|-------------------------|
| Launch Pool | `addLaunchPoolBucketV2Base` の後に `setLaunchPoolBucketV2Behaviors` | `setLaunchPoolBucketV2Behaviors` |
| Presale | `addPresaleBucketV2Base` の後に `setPresaleBucketV2Behaviors` | `setPresaleBucketV2Behaviors` |
| Raydium CPMM | `addRaydiumCpmmBucketV2({ endBehaviors })` | `setRaydiumCpmmBucketV2Behaviors` |
| クレームスケジュール | `addClaimScheduleBucketV2({ endBehaviors })` | `setClaimScheduleBucketV2Behaviors` |

一括版の `addLaunchPoolBucketV2` と `addPresaleBucketV2` インストラクションはSolanaのトランザクションサイズ上限である1,232バイトを超えるため、Launch PoolバケットとPresaleバケットはそれぞれの `Base` インストラクションで作成します。宛先には、まだ作成されていないバケットも指定できます。先にPDAを導出しておけば（たとえば `findRaydiumCpmmBucketV2Pda` や `findUnlockedBucketV2Pda` で）、バケット同士を任意の順序で参照できます。

{% callout type="warning" %}
動作は `finalizeV2` の後は変更できません。ファイナライズの前に、すべての宛先アドレスと割合を確認してください。
{% /callout %}

## triggerBehaviorsV2による終了動作の実行 {% #running-end-behaviors-with-trigger-behaviors-v2 %}

`triggerBehaviorsV2` は、1つのソースバケット（`primaryBucket`）の未処理の動作をすべて実行し、二重に実行されないよう各動作を処理済みとしてマークします。

| プロパティ | 値 |
|----------|-------|
| 署名者 | 手数料支払者のみ（パーミッションレス） |
| ソース | インストラクションごとに1つのバケット（`primaryBucket`） |
| Remaining accounts | 異なる宛先ごとに `(destination bucket, destination quote token account)` のペアを1組ずつ。すべて書き込み可能 |
| 再実行 | 安全。処理済みの動作はスキップされる |

宛先のクォートトークンアカウントは、クォートミントの[associated token account](/ja/solana/understanding-solana-accounts#associated-token-accounts-atas)です。所有者は宛先バケット自体ですが、Raydiumバケットの場合はRaydiumバケット署名者PDA（`findRaydiumBucketSignerPda`）が所有します。

{% code-tabs-imported from="genesis/trigger_launch_pool_graduation_v2" frameworks="umi" filename="triggerBehaviorsV2" /%}

### 各ソースバケットが動作を実行できるタイミング {% #when-each-source-bucket-can-run-behaviors %}

各ソースバケットタイプは、終了した後にのみ `triggerBehaviorsV2` を受け付けます。

| ソースバケット | 実行可能になる条件 | 早すぎる場合のエラー |
|---------------|------------|--------------------|
| Launch Pool | `depositEndCondition` が満たされている | `LaunchPoolNotEnded` |
| Presale | `depositEndCondition` が満たされている | `PresaleBucketNotEnded` |
| ボンディングカーブ | `swapEndCondition` が満たされている（完売） | `BondingCurveNotEnded` |
| Raydium CPMM | プールがグラデュエーションした、またはバケットが失敗としてマークされた | `InvalidBucketState` |
| クレームスケジュール | `claimEndCondition` が満たされている（キャンセル、ベスティング完了、または失敗の伝達） | `ClaimScheduleBucketNotEnded` |

{% callout type="note" %}
チームが収益を請求する前に、販売バケットで `triggerBehaviorsV2` を実行してください。調達したSOLは `SendQuoteTokenPercentage` 動作が実行されるまで販売バケットに残りますが、入金者はその間もベーストークンを請求できます。
{% /callout %}

## Raydiumグラデュエーションへの収益の送付 {% #routing-proceeds-to-raydium-graduation %}

Raydium CPMMバケットには、それを宛先とする `SendQuoteTokenPercentage` 動作と `SendStartPrice` 動作がちょうど1つずつ必要で、どちらも同じソースバケットからのものでなければなりません。

`SendQuoteTokenPercentage` はプールのクォート側を供給し、`SendStartPrice` はベース側の量を決める比率を供給します。Launch Poolの場合、開始価格は `baseTokenAllocation / quoteTokenDepositTotal` であり、申込超過の場合は入金総額の代わりにソフトキャップの金額が使われます。

グラデュエーション時にプールに投入されるベーストークンは `quoteTokenInSigner × priceNumerator / priceDenominator` です。ここで `quoteTokenInSigner` は、Raydiumバケットが実際に受け取ったクォートの量です。Raydiumバケットの `baseTokenAllocation` は、Launch Poolの割り当てにプールへ送る割合を掛けた量にしてください。収益の20%をプールに送る場合は、Launch Pool割り当ての20%を使用します。Launch Poolはデフォルトで手数料なしで収益を送付するため（ローンチ手数料はクリエイターが収益を請求する際に課されます。[プロトコル手数料](/ja/smart-contracts/genesis#protocol-fees)を参照）、グラデュエーションでは割り当て全体がペアになります。それでも、端数や販売バケットの手数料オーバーライドによってベーストークンが取り残されないよう、`BaseTokenRollover` 動作を追加してください。

{% callout type="warning" %}
2つの販売バケットを同じRaydiumバケットに向けないでください。`SendStartPrice` は宛先ごとに1回しか書き込めず、グラデュエーションにはクォートトークンと価格について一貫した単一のソースが必要です。
{% /callout %}

### BaseTokenRolloverによる未使用のRaydiumベーストークンの回収 {% #recovering-unused-raydium-base-tokens-with-base-token-rollover %}

Raydiumバケットの割り当てのうちグラデュエーションで使われなかったベーストークンは、Raydiumバケット上の `BaseTokenRollover` 動作が移動するまでGenesisに残ります。

Raydiumバケットの作成時にこの動作を追加し、グラデュエーション後に、Raydiumバケットを `primaryBucket` として `triggerBehaviorsV2` を実行してください。

{% code-tabs-imported from="genesis/rollover_raydium_cpmm_base_tokens_v2" frameworks="umi" filename="baseTokenRollover" /%}

## TransmitFailureによる失敗時の処理 {% #failure-handling-with-transmit-failure %}

`minimumQuoteTokenThreshold` を持つLaunch PoolまたはPresaleは、入金総額がしきい値を下回って終了すると失敗モードに入り、失敗時の動作のみが実行されます。

失敗モードでは、入金者が `refundLaunchPoolV2` を呼び出せるよう、クォートトークンは販売バケットに残ります。下流の処理はすべて、2つの失敗時の動作が担います。

| 動作 | 宛先への効果 |
|----------|---------------------------|
| `ReallocateBaseTokensOnFailure` | 売れ残ったベーストークンを販売バケットから宛先（通常はUnlockedバケット）に移動する |
| `TransmitFailure` → Raydium CPMM | Raydiumバケットを失敗としてマークする。グラデュエーションは閉じられ（`BucketLaunchFailed`）、Raydiumバケット自身の `ReallocateBaseTokensOnFailure` を実行できるようになる |
| `TransmitFailure` → クレームスケジュール | ベスティングバケットを失敗として終了させ、その `ReallocateBaseTokensOnCancel` が残高全体を返却する。既に終了しているスケジュールは変更されない |
| `TransmitFailure` → Unlocked | 請求開始条件を無視して、Unlockedバケットの請求を即座に開始する |

{% code-tabs-imported from="genesis/launch_pool_failure_handling_v2" frameworks="umi" filename="launchPoolFailureHandling" /%}

{% callout type="note" %}
後からロールオーバーや失敗時のクレジットを受け取るUnlockedバケットでは、`claimEndCondition` に `createNeverCondition()` を使用してください。請求期間が閉じた後にクレジットされたベーストークンは、二度と請求できません。
{% /callout %}

## よくある終了動作のエラー {% #common-end-behavior-errors %}

終了動作のエラーは、サポートされていない動作、remaining accountsのリストの不一致、またはまだ終了していないソースバケットを示します。

| エラー | 原因 | 解決策 |
|-------|-------|------------|
| `BehaviorNotSupportedForBucketType` | そのソースバケットでは許可されていない動作 | [動作の表](#genesis-end-behavior-types)にあるソースを使用する |
| `InvalidRemainingAccountsLength` | remaining accountsが `(bucket, quote token account)` のペアになっていない | 宛先ごとにちょうど1組のペアを渡す |
| `InvalidSecondaryBucket` | remaining accountが有効な宛先バケットではない | 動作に設定された宛先バケットのPDAを渡す |
| `InvalidAtaDerivation` | 宛先のクォートトークンアカウントが正規のATAではない | 正しい所有者を指定して `findAssociatedTokenPda` で導出する |
| `LaunchPoolNotEnded` | Launch Poolの入金期間がまだ開いている | `depositEndCondition` まで待つ |
| `StartPriceAlreadySet` | 2つ目の `SendStartPrice` が同じRaydiumバケットを宛先にしている | Raydiumバケットごとに1つの販売バケットを使用する |

## 注意事項 {% #notes %}

- `SendQuoteTokenPercentage`、`BaseTokenRollover`、`ReallocateBaseTokensOnCancel` はトークン残高のみを移動します。`ReallocateBaseTokensOnFailure` は割り当ても移動し、ソースバケットの `baseTokenAllocation` から差し引いて宛先に加算します。
- 収益を分割する場合など、1つのバケットに宛先の異なる同じタイプの動作を複数設定できます。ただし例外が2つあります。Raydiumバケットは `SendQuoteTokenPercentage` と `SendStartPrice` をちょうど1つずつしか受け付けず、クレームスケジュールバケットは `ReallocateBaseTokensOnCancel` を最大1つまでしか持てません。
- クォートミントがラップドSOLの場合、Unlockedバケットの請求によってそのクォートトークンアカウントは閉じられます。再びそのアカウントにクォートトークンを送る動作を実行する前に、ATAを作成し直してください。
- 販売バケットから収益が出る際に適用される手数料は、[プロトコル手数料](/ja/smart-contracts/genesis#protocol-fees)に記載されています。
- サンプルは、`@metaplex-foundation/genesis@0.44.0` を使用し、デプロイ済みのGenesisプログラムリリース `genesis v0.41.0`（`GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B`）に対してdevnetで実行済みです。ソース：[metaplex-foundation/genesis](https://github.com/metaplex-foundation/genesis)。

## FAQ

### Genesisの終了動作とは何ですか？

終了動作は、バケットに保存されるアクションで、ソースバケットの終了後にトークンやデータを別のバケットに移動します。たとえば、販売の収益をトレジャリーやRaydiumグラデュエーションバケットに送信します。動作は、誰かが `triggerBehaviorsV2` を呼び出したときに実行されます。

### triggerBehaviorsV2を呼び出せるのは誰ですか？

任意のウォレットです。`triggerBehaviorsV2` は手数料支払者の署名のみを必要とします。プログラムが各動作を処理済みとしてマークするため、各動作は最大1回しか実行されません。

### Launch Poolが最小しきい値に達しなかった場合、終了動作はどうなりますか？

Launch Poolは失敗モードに入ります。`ReallocateBaseTokensOnFailure` と `TransmitFailure` の動作のみが実行されるため、入金されたSOLは入金者への返金のためにバケットに残ります。

### ファイナライズ後に終了動作を変更できますか？

いいえ。動作は、バケットの追加時、または `finalizeV2` の前に対応する `set*BucketV2Behaviors` インストラクションで設定してください。ファイナライズ後の動作の変更はプログラムに拒否されます。

### Raydiumグラデュエーション後にベーストークンが残るのはなぜですか？

グラデュエーションは、開始価格でクォートトークンと釣り合うのに必要な分のベーストークンのみを移動します。Raydiumバケットの割り当ての残りは、Raydiumバケット上の `BaseTokenRollover` 動作が別のバケットに移動するまでGenesisに残ります。

## 用語集 {% #glossary %}

| 用語 | 定義 |
|------|------------|
| **終了動作（End behavior）** | ソースバケットに保存され、バケットの終了後に実行されるアクション |
| **ソースバケット（Source bucket）** | 動作が実行されるバケット。`primaryBucket` として渡す |
| **宛先バケット（Destination bucket）** | トークン、価格、または失敗フラグを受け取るバケット |
| **失敗モード（Failure mode）** | `minimumQuoteTokenThreshold` を下回って終了した販売の状態 |
| **開始価格（Start price）** | Raydiumバケットがプールの規模を決めるのに使う `priceNumerator / priceDenominator` の比率 |
| **処理済みフラグ（Processed flag）** | 動作が二重に実行されるのを防ぐ、動作ごとのマーカー |
