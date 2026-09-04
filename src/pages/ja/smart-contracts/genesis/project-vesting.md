---
title: プロジェクトベスティング
metaTitle: ClaimScheduleBucketV2 によるプロジェクトトークンベスティング | Genesis | Metaplex
description: Genesis ClaimScheduleBucketV2 でオンチェーンのプロジェクトトークンベスティングスケジュールを作成します。クリフ、定期アンロック、クレーム、一時停止、キャンセル、受取人変更を含みます。
created: '08-24-2026'
updated: '08-24-2026'
keywords:
  - Genesis project vesting
  - ClaimScheduleBucketV2
  - ClaimSchedule
  - token vesting
  - team token vesting
  - token cliff
  - Solana vesting
  - on-chain vesting
about:
  - Genesis project vesting
  - ClaimScheduleBucketV2
  - Token claim schedules
proficiencyLevel: Advanced
programmingLanguage:
  - JavaScript
  - TypeScript
howToSteps:
  - クリフと定期線形アンロックを持つ ClaimSchedule を設定する
  - Genesis アカウントのファイナライズ前に ClaimScheduleBucketV2 を追加する
  - ベスト済みトークンを現在保存されている受取人へクレームする
  - 任意の一時停止、キャンセル、受取人変更ポリシーを設定する
howToTools:
  - Node.js
  - Umi framework
  - Genesis SDK
faqs:
  - q: ClaimScheduleBucketV2 と ClaimSchedule の違いは何ですか？
    a: ClaimScheduleBucketV2 は 1 人の受取人の割り当てとランタイム状態を保持する Genesis のアウトフローバケットです。ClaimSchedule はそのバケット内に保存される再利用可能なクリフと線形アンロックカーブです。
  - q: ベスティング受取人は毎回クレームを送信する必要がありますか？
    a: いいえ。ClaimClaimScheduleV2 は Permissionless ですが、プログラムは常にバケットに保存された受取人へトークンを転送します。バックエンド署名者拡張が設定されている場合、その署名者も各クレームを承認する必要があります。
  - q: ベスティング開始後にプロジェクトはスケジュールを変更できますか？
    a: いいえ。UpdateClaimScheduleBucketV2 はファイナライズ前、クレームゲートまたはいずれかのスケジュール条件が満たされる前、かつクレームが 1 回も行われていないときだけ動作します。TimeRelative のクレームゲート、線形開始、またはクリフも更新を直ちに無効にします。
  - q: ベスティングバケットがキャンセルされたとき、未ベストトークンはどうなりますか？
    a: キャンセルはベスティングを凍結し、ベスト済み量は受取人のために保持します。バケットに ReallocateBaseTokensOnCancel 動作がある場合、誰でもその動作を起動して未ベスト残りを UnlockedBucketV2 へ移せます。
  - q: 1 つの ClaimScheduleBucketV2 で複数の受取人へベストできますか？
    a: いいえ。各バケットの受取人は 1 人です。独立した会計またはポリシー制御が必要な受取人または割り当てごとに ClaimScheduleBucketV2 を作成してください。
---

[Genesis](/ja/smart-contracts/genesis) のプロジェクトベスティングは、`ClaimScheduleBucketV2` を使い、オンチェーンのクリフと定期線形スケジュールに従って 1 つのトークン割り当てを 1 人の受取人へ解放します。 {% .lead %}

{% callout title="構築するもの" %}
このガイドは、10% クリフ、月次線形アンロック、任意の権限者制御を持つ 1 年のプロジェクトトークンベスティング割り当てを作成します。
{% /callout %}

## 概要

`ClaimScheduleBucketV2` は、プロジェクト、チーム、アドバイザー、またはトレジャリーのトークンベスティング向けの第一級 [Genesis](/ja/smart-contracts/genesis) アウトフローバケットです。受取人、割り当て、クレーム履歴、ベスティングカーブ、一時停止状態、ポリシー制御、任意のキャンセル動作をオンチェーンに保存します。

- 1 つのバケットは 1 つのトークン割り当てを 1 人の現在の受取人へベストします
- `ClaimSchedule` は独立したクリフと期間ベースの線形アンロックを組み合わせます
- クレームは Permissionless ですが、常にバケットの受取人へ支払います
- 任意ポリシーで権限者の一時停止、キャンセル、受取人によるキャンセル、受取人変更をサポートします

**ジャンプ先:** [クイックスタート](#クイックスタート) · [ベスティングの仕組み](#クレームスケジュールのベスティングの仕組み) · [ランタイム制御](#プロジェクトベスティングのランタイム制御) · [キャンセル](#キャンセル後の未ベストトークンの再割り当て) · [リファレンス](#クイックリファレンス)

## ClaimScheduleBucketV2 と ClaimSchedule

`ClaimScheduleBucketV2` はプロジェクト割り当てを所有するアカウントであり、`ClaimSchedule` はそのアカウントに埋め込まれた再利用可能なベスティングカーブです。

| 型 | 目的 |
|------|---------|
| `ClaimScheduleBucketV2` | 1 人の受取人、割り当て、クレーム済み量、スケジュール、クレームゲート、一時停止状態、ポリシー、終了動作を保存します |
| `ClaimSchedule` | クリフ量、クリフ条件、線形開始条件、期間、アンロック周期を定義します |
| `ClaimScheduleV2Extensions` | ランタイムポリシーフラグと任意のバックエンドクレーム署名者を保存します |

{% callout type="note" %}
Genesis に `ClaimScheduleBucketV1` はありません。プロジェクトベスティングには `V2` のアカウントと命令名を使ってください。`ClaimSchedule` は他のバケット拡張でも使われるため、スケジュール型だけではプロジェクトベスティングバケットを識別できません。
{% /callout %}

## クイックスタート

クイックスタートは、初期化済みだがまだファイナライズしていない Genesis V2 アカウントに、10% クリフと月次線形アンロックの 1 年ベスティングバケットを追加します。

先に [Genesis セットアップ](/ja/smart-contracts/genesis/getting-started) を完了し、ベーストークン供給からベスティング割り当てを確保してください。すべてのバケット割り当ての合計は Genesis アカウントの総供給量に収まる必要があります。

### プロジェクトベスティングバケットの作成

`addClaimScheduleBucketV2` は Genesis アカウントのファイナライズ前にバケットを作成します。

{% code-tabs-imported from="genesis/add_claim_schedule_bucket_v2" frameworks="umi" filename="addClaimScheduleBucketV2" /%}

他の配布バケットをすべて追加してから、[Genesis セットアップ](/ja/smart-contracts/genesis/getting-started) の通り `finalizeV2` を呼び出します。ファイナライズは不可逆です。

### ベスト済みプロジェクトトークンのクレーム

`claimClaimScheduleV2` は、現在ベスト済みで未クレームのトークンすべてをバケットに保存された受取人へ転送します。

{% code-tabs-imported from="genesis/claim_claim_schedule_v2" frameworks="umi" filename="claimClaimScheduleV2" /%}

支払者は受取人である必要はありません。命令は必要に応じて受取人の [associated token account](/ja/solana/understanding-solana-accounts#associated-token-accounts-atas) を作成し、トークンを支払者へリダイレクトすることはできません。

{% callout type="note" %}
前回のクレーム以降に完全なベスティング周期が経過していないとき、クレームは `NothingToClaim` を返すことがあります。次の周期を待つか、送信前に取得したバケット状態を確認してください。
{% /callout %}

## クレームスケジュールのベスティングの仕組み

クレームスケジュールは、クリフ割り当てを残りの線形割り当てから独立してアンロックします。

| フィールド | 制約 | 効果 |
|-------|------------|--------|
| `startCondition` | `TimeAbsolute`、`TimeRelative`、または `Never` | 線形ベスティングのタイムラインを固定します |
| `duration` | 0 より大きく、10 年以下 | 線形割り当てが完全にベストされる時点を定義します |
| `period` | 0 より大きく `duration` 以下 | 線形ベスティングを離散ステップで進めます |
| `cliffCondition` | `TimeAbsolute`、`TimeRelative`、または `Never` | 線形スケジュールから独立してクリフをアンロックします |
| `cliffAmountBps` | `0` から `10_000` | 割り当ての 0% から 100% をクリフに割り当てます |

割り当て `A` とクリフ basis points `C` に対し、クリフ量は `A × C / 10,000` です。残り `A - cliffAmount` は `duration` にわたる完全な `period` ステップで線形にベストされます。

{% callout type="note" %}
クリフは線形スケジュールを自動的に遅らせません。`startCondition` と `cliffCondition` を意図したタイムスタンプに明示的に設定してください。どちらの条件も他方の前、最中、後に発火し得ます。
{% /callout %}

{% callout type="warning" %}
クリフは `startCondition + duration` より後にしないでください。線形完了後の成功クレームはバケットの終了条件を発火します。それより遅いクリフは凍結された実効時刻を超え、クレーム可能にならなくなります。
{% /callout %}

### クレームゲートとベスティングカーブ

`claimStartCondition` はトークン出金をゲートし、`claimSchedule.startCondition` は線形割り当てがいつ蓄積されるかを制御します。

この分離により、クレームが開く前に蓄積するスケジュールが可能です。たとえば雇用日にベスティングを開始し、`claimStartCondition` でトークン生成イベントまで出金を防げます。

`TimeAbsolute` 条件はクレームがそれらを確認したときに自身を更新します。`TimeRelative` 条件は受動的であり、参照される各バケットを writable remaining account として渡す `triggerConditionsV2` が必要です。

{% code-tabs-imported from="genesis/trigger_claim_schedule_conditions_v2" frameworks="umi" filename="triggerConditionsV2" /%}

参照条件が満たされたあと、クレームまたはベスティング状態の評価の前に、この Permissionless クランクを実行してください。

### 期間ごとの線形アンロック

`period` フィールドは線形割り当てを連続ではなくステップでアンロックします。

365 日の duration と 30 日の period では、線形割り当ては完全な 30 日周期ごとに増えます。端数余りは duration 全体が終わったときにクレーム可能になります。

### 一時停止で調整されるベスティング時間

バケットを一時停止するとベスティング時間が止まり、再開すると実効タイムラインが一時停止合計時間だけずれます。

バケットは `pausedAt` と `totalSecondsPaused` を記録します。一時停止中のキャンセルはスケジュールを `pausedAt` で凍結するため、一時停止中の時間はベスト量を増やしません。

## プロジェクトベスティングのランタイム制御

ランタイム制御はデフォルトで無効であり、バケット作成時にポリシーフラグで有効にする必要があります。

| ポリシーフラグ | 認可された役割 | 命令 | 結果 |
|-------------|-----------------|-------------|--------|
| `pausable` | Genesis 権限者 | `setClaimSchedulePausedStateV2` | ベスティング蓄積を一時停止または再開します |
| `cancelable` | Genesis 権限者 | `cancelClaimScheduleBucketV2` | キャンセル時刻でベスティングを凍結します |
| `cancelableByRecipient` | 受取人 | `cancelClaimScheduleBucketV2` | 受取人がベスティングを凍結できます |
| `transferable` | Genesis 権限者 | `transferRecipientClaimScheduleBucketV2` | ベスティング受取人を変更します |
| `transferableByRecipient` | 受取人 | `transferRecipientClaimScheduleBucketV2` | 現在の受取人が割り当てを移転できます |

{% callout type="warning" %}
プロジェクトのベスティング契約で必要な制御だけを有効にしてください。権限者のキャンセルまたは受取人変更権は、受取人に提供する保証を実質的に変えます。
{% /callout %}

### プロジェクトベスティングの一時停止と再開

`pausable` が作成時に有効なとき、`setClaimSchedulePausedStateV2` はバケットを一時停止または再開します。

{% code-tabs-imported from="genesis/pause_claim_schedule_bucket_v2" frameworks="umi" filename="pauseClaimScheduleBucketV2" /%}

再開するには `paused: false` を設定します。この制御を使えるのは Genesis 権限者だけです。

### プロジェクトベスティングのキャンセル

`cancelClaimScheduleBucketV2` はベスティングを凍結しますが、すでにベストされたトークンは削除しません。

{% code-tabs-imported from="genesis/cancel_claim_schedule_bucket_v2" frameworks="umi" filename="cancelClaimScheduleBucketV2" /%}

受取人はベスト済み残りを引き続きクレームできます。未ベストトークンは、`ReallocateBaseTokensOnCancel` 終了動作が設定されて起動されない限り Genesis の会計に残ります。

### プロジェクトベスティング受取人の変更

`transferRecipientClaimScheduleBucketV2` は今後のすべてのクレームを受け取るウォレットを変更します。

{% code-tabs-imported from="genesis/transfer_claim_schedule_recipient_v2" frameworks="umi" filename="transferClaimScheduleRecipientV2" /%}

認可される署名者は、`transferable` と `transferableByRecipient` のどちらが有効かによって決まります。

## キャンセル後の未ベストトークンの再割り当て

`ReallocateBaseTokensOnCancel` はキャンセルされたバケットの未ベスト残りの 100% を `UnlockedBucketV2` へ移します。

`finalizeV2` を呼ぶ前に動作を設定してください。`addClaimScheduleBucketV2.endBehaviors` または `setClaimScheduleBucketV2Behaviors` で設定します。Genesis プログラムはファイナライズ後の動作設定を拒否します。

{% code-tabs-imported from="genesis/reallocate_claim_schedule_on_cancel_v2" frameworks="umi" filename="reallocateClaimScheduleOnCancelV2" /%}

動作は元の割り当て値ではなくバケット残高を変えます。クレームスケジュールバケットが終了したあとだけ実行でき、各クレームスケジュールバケットのキャンセル再割り当て動作は最大 1 つです。

{% callout type="note" %}
`TimeRelative` の開始またはクリフ条件を使うスケジュールは、キャンセル再割り当てがベスト量を計算する前にそれらの条件がトリガーされている必要があります。先に必要な参照アカウント付きで `triggerConditionsV2` を実行してください。
{% /callout %}

## ローンチ前のプロジェクトベスティング更新

`updateClaimScheduleBucketV2` は、ファイナライズ前かつベスティング開始前に限り、割り当て、スケジュール、またはクレーム開始条件を置き換えできます。

バケットは、トークンが 1 度でもクレームされたあと、`claimStartCondition` が満たされたあと、または線形開始やクリフ条件が満たされたあとに `ClaimScheduleUpdateForbidden` で更新を拒否します。それら 3 つのスロットのいずれかの `TimeRelative` 条件も、更新中に参照バケットを検証できないため直ちに更新を無効にします。ランタイムの一時停止、キャンセル、移転制御は更新命令ではなく専用命令を使います。

## プロジェクトベスティング状態の取得

`fetchClaimScheduleBucketV2` は割り当て、クレーム進捗、実効一時停止状態、ポリシー、終了動作を返します。

{% code-tabs-imported from="genesis/fetch_claim_schedule_bucket_v2" frameworks="umi" filename="fetchClaimScheduleBucketV2" /%}

会計の不変条件は、終了動作が未ベスト残高を再割り当てするまで `baseTokenBalance = baseTokenAllocation - amountClaimed` です。

## ClaimScheduleBucketV2 アカウントフィールド

`ClaimScheduleBucketV2` アカウントは固定ベスティング状態のあとに可変長の終了動作リストを保存します。

| フィールド | 説明 |
|-------|-------------|
| `bucket` | 割り当て、残残高、mint、index、手数料データを含む共有バケットヘッダー |
| `recipient` | ベスト済みトークンクレームをすべて受け取るウォレット |
| `amountClaimed` | 受取人へ転送された累積トークン |
| `claimSchedule` | クリフと期間ベースの線形ベスティングカーブ |
| `claimStartCondition` | クレーム開始前に開く必要がある独立ゲート |
| `claimEndCondition` | キャンセルまたは自然完了で発火するプログラム所有の終了条件 |
| `paused` | ベスティング時間が現在止まっているか |
| `pausedAt` | 現在の一時停止が始まったタイムスタンプ |
| `totalSecondsPaused` | ベスティングから除外された累積一時停止時間 |
| `extensions` | ランタイムポリシーと任意のバックエンド署名者 |
| `endBehaviors` | バケット終了後に利用できる動作 |

## よくあるプロジェクトベスティングエラー

クレームスケジュールエラーは無効なスケジュール設定、無許可の制御、または誤ったライフサイクル段階での操作を識別します。

| エラー | 原因 | 対処 |
|-------|-------|------------|
| `InvalidClaimSchedulePeriod` | `period` が 0 | 正の period を使う |
| `InvalidClaimScheduleDuration` | `duration` が 0 または 10 年超 | 1 秒から 315,360,000 秒の duration を使う |
| `ClaimScheduleDurationTooShort` | `period` が `duration` を超える | period を減らすか duration を増やす |
| `InvalidClaimScheduleCliffAmount` | `cliffAmountBps` が `10_000` を超える | 0 から 10,000 basis points を使う |
| `NothingToClaim` | 新しいクリフまたは完全な線形周期がベストされていない | 次のアンロックを待つかバケット状態を確認する |
| `ClaimScheduleUpdateForbidden` | クレームゲートまたはスケジュールが始まっている、トークンがクレーム済み、または関連条件が `TimeRelative` | 発火前に絶対時刻フィールドを設定する。相対スケジュールは更新できない |
| `ClaimScheduleUnauthorized` | 署名者がその制御を使えない | 有効ポリシーが要求する Genesis 権限者または受取人を使う |
| `ClaimSchedulePolicyDisabled` | 要求された一時停止、キャンセル、または移転ポリシーがオフ | バケット作成時にポリシーを有効にする |
| `InvalidBackendSigner` | 設定されたバックエンド署名者がクレームを承認しなかった | 設定されたバックエンド署名者を含める |
| `ClaimScheduleConditionNotTriggered` | キャンセル再割り当てが未解決の相対条件に依存する | 先に相対スケジュール条件をトリガーする |

## クイックリファレンス

プロジェクトベスティングは Genesis V2 と `@metaplex-foundation/genesis` で利用できます。

| 項目 | 値 |
|------|-------|
| Program | `GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B` |
| Tested SDK | `@metaplex-foundation/genesis@0.41.1` |
| Tested Umi compatibility | `@metaplex-foundation/umi@^1.4.1` |
| Bucket PDA seeds | `"claim_schedule_v2"`、Genesis アカウント、`bucketIndex` を `u8` として |
| Maximum vesting duration | 315,360,000 秒（10 年） |
| Cliff range | 0 から 10,000 basis points |
| Recipients per bucket | 1 |
| Bucket creation fee | 0 |
| Devnet validation | 追加、ファイナライズ、一時停止、移転、クレーム、キャンセル、再割り当ての全フローが 2026-08-24 に合格（[テストアカウント](https://explorer.solana.com/address/3jjvwp9QnUfU2RJGzhJNJZPXH4HT6TrbaUcemku4ZYhT?cluster=devnet)） |
| Source | [metaplex-foundation/genesis](https://github.com/metaplex-foundation/genesis) |

## 注意事項

プロジェクトベスティングには、トークン配布設計に含めるべきライフサイクルと認可の制約があります。

- `finalizeV2` を呼ぶ前に `ClaimScheduleBucketV2` アカウントを追加して設定してください。
- 受取人または独立管理の割り当てごとに 1 つのバケットを作成してください。
- 任意のバックエンド署名者拡張が設定されていない限り、クレームは Permissionless です。
- バックエンド署名者はクレーム認可を追加しますが、現在保存されている受取人からクレームをリダイレクトできません。
- キャンセルはベスト済みトークンを保持します。未ベストトークンの回収には `ReallocateBaseTokensOnCancel` が必要です。
- `Never` スケジュールはトークンを永続的にロックし、主に [ロックされた LP トークン](/ja/smart-contracts/genesis/locked-lp-tokens) に使われます。

## FAQ

### ClaimScheduleBucketV2 と ClaimSchedule の違いは何ですか？

`ClaimScheduleBucketV2` は 1 人の受取人の割り当てとランタイム状態を保持する Genesis のアウトフローバケットです。`ClaimSchedule` はそのバケット内に保存される再利用可能なクリフと線形アンロックカーブです。

### ベスティング受取人は毎回クレームを送信する必要がありますか？

いいえ。`claimClaimScheduleV2` は Permissionless ですが、プログラムは常にバケットに保存された受取人へトークンを転送します。バックエンド署名者拡張が設定されている場合、その署名者も各クレームを承認する必要があります。

### ベスティング開始後にプロジェクトはスケジュールを変更できますか？

いいえ。`updateClaimScheduleBucketV2` はファイナライズ前、クレームゲートまたはいずれかのスケジュール条件が満たされる前、かつクレームが 1 回も行われていないときだけ動作します。`TimeRelative` のクレームゲート、線形開始、またはクリフも更新を直ちに無効にします。

### ベスティングバケットがキャンセルされたとき、未ベストトークンはどうなりますか？

キャンセルはベスティングを凍結し、ベスト済み量は受取人のために保持します。バケットに `ReallocateBaseTokensOnCancel` 動作がある場合、誰でもその動作を起動して未ベスト残りを `UnlockedBucketV2` へ移せます。

### 1 つの ClaimScheduleBucketV2 で複数の受取人へベストできますか？

いいえ。各バケットの受取人は 1 人です。独立した会計またはポリシー制御が必要な受取人または割り当てごとに `ClaimScheduleBucketV2` を作成してください。

## 用語集

プロジェクトベスティングの用語は、バケットアカウント、埋め込みスケジュール、ライフサイクル制御を区別します。

| 用語 | 定義 |
|------|------------|
| **ClaimScheduleBucketV2** | 1 つのベーストークン割り当てを 1 人の受取人へベストする Genesis アウトフローバケット |
| **ClaimSchedule** | 再利用可能なクリフと期間ベースの線形トークンアンロックカーブ |
| **Claim gate** | 出金開始を制御するバケットレベルの `claimStartCondition` |
| **Cliff** | 独立条件が発火したときにアンロックされる総割り当ての割合 |
| **Period** | 線形ベスティングを離散ステップで進める間隔 |
| **Effective time** | バケットの一時停止時間を除いたウォールクロック時間 |
| **Cancellation reallocation** | キャンセルされたバケットの未ベスト残りをロック解除バケットへ移す終了動作 |
