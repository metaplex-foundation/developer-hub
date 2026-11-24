---
title: JavaScript SDK
metaTitle: JavaScript SDK | Genesis | Metaplex
description: Genesis JavaScript SDKのAPIリファレンス。Solana上でのトークンローンチに必要な関数シグネチャ、条件と終了動作の型、Raydium CPMMグラデュエーションのインストラクション、エラーコードを解説します。
created: '01-15-2025'
updated: '11-24-2026'
keywords:
  - Genesis SDK
  - JavaScript SDK
  - TypeScript SDK
  - token launch SDK
  - Umi framework
  - Genesis API reference
  - refundLaunchPoolV2
  - soft cap
  - triggerConditionsV2
  - triggerBehaviorsV2
  - graduateToRaydiumCpmmV2
  - addRaydiumCpmmBucketV2
  - TimeRelative condition
  - EndBehavior
about:
  - SDK installation
  - API reference
  - Genesis instructions
  - Raydium CPMM graduation
  - Genesis conditions and end behaviors
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: Umiとは何ですか？なぜ必要ですか？
    a: UmiはMetaplexのSolana向けJavaScriptフレームワークです。トランザクションの構築、署名者の管理、Metaplexプログラムとのやり取りに一貫したインターフェースを提供します。
  - q: Genesis SDKをブラウザで使用できますか？
    a: はい。SDKはNode.jsとブラウザの両方の環境で動作します。ブラウザでは、キーペアファイルの代わりにウォレットアダプターを使用して署名を行います。
  - q: fetchとsafeFetchの違いは何ですか？
    a: fetchはアカウントが存在しない場合にエラーをスローします。safeFetchは代わりにnullを返すため、エラーハンドリングなしでアカウントの存在確認に便利です。
  - q: トークンのローンチタイプを取得するにはどうすればいいですか？
    a: トークンのミントアドレスを使用してfetchGenesisAccountV2FromSeedsでGenesisAccountV2オンチェーンアカウントを取得します。launchTypeフィールドは0（Uninitialized）または3（LaunchPoolV1）を返します。GPAビルダーを使用して特定のタイプの全ローンチを照会することもできます。
  - q: どのGenesisインストラクションを任意のウォレットから呼び出せますか？
    a: triggerConditionsV2、triggerBehaviorsV2、graduateToRaydiumCpmmV2、collectRaydiumCpmmFeesV2、collectRaydiumCpmmFeesWithCreatorFeeV2、claimRaydiumCreatorFeeV2、claimUnlockedV2、claimClaimScheduleV2は手数料支払者の署名のみを必要とします。資金は常にバケットに保存されたアドレスに送られます。バケットにバックエンド署名者の拡張がある場合は、その署名者もグラデュエーションと請求に共同署名する必要があります。
  - q: Raydiumグラデュエーション後も請求が失敗するのはなぜですか？
    a: RaydiumバケットのGraduate時刻を基準とするTimeRelativeの請求条件は、グラデュエーションでも請求自体でも解決されません。依存する各バケットに対してtriggerConditionsV2を呼び出し、Raydium CPMMバケットを書き込み可能なremaining accountとして渡してください。
  - q: トランザクションエラーはどのように処理しますか？
    a: sendAndConfirmの呼び出しをtry/catchブロックで囲み、エラー名をよくあるエラーの表と照合します。よくあるエラーには、残高不足、ファイナライズ済みのアカウント、未トリガーの条件、開始前のグラデュエーションなどがあります。
---

Genesis JavaScript SDK（`@metaplex-foundation/genesis`）のAPIリファレンスです。完全なチュートリアルについては、[Launch Pool](/ja/smart-contracts/genesis/launch-pool)または[Presale](/ja/smart-contracts/genesis/presale)を参照してください。 {% .lead %}

## 概要 {% #summary %}

Genesis JavaScript SDKは、Genesisプログラムのすべてのインストラクションを Umi ビルダーとして公開し、Solana上でトークンローンチを構築するためのPDAヘルパー、アカウントフェッチャー、条件ヘルパーも提供します。

- インストラクションビルダーは、バケットのセットアップ、入金と請求、Raydium CPMMグラデュエーション、LPトークンとプール手数料、Unlockedバケット、クレームスケジュールをカバーします
- `triggerConditionsV2` と `triggerBehaviorsV2` は、条件を解決し終了動作を実行するパーミッションレスなクランクです
- 条件（`TimeAbsolute`、`TimeRelative`、`Triggered`、`TriggeredWithExpiry`、`Never`、`Always`）と終了動作（6種類）は、正確なオブジェクト形状とともに以下で説明します
- `@metaplex-foundation/genesis` 0.44.0 および Genesis プログラム `GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B` で検証済みです。すべてのサンプルはdevnetで実行済みです

**ジャンプ先:** [インストラクション](#instructions-reference) · [Raydium CPMM](#raydium-cpmm-graduation-signatures) · [条件と動作](#condition-and-behavior-signatures) · [TimeCondition](#time-condition) · [EndBehavior](#end-behavior) · [エラー](#common-errors)

{% quick-links %}

{% quick-link title="NPMパッケージ" target="_blank" icon="JavaScript" href="https://www.npmjs.com/package/@metaplex-foundation/genesis" description="@metaplex-foundation/genesis" /%}

{% quick-link title="TypeDoc" target="_blank" icon="JavaScript" href="https://mpl-genesis.typedoc.metaplex.com/" description="自動生成されたAPIドキュメント" /%}

{% /quick-links %}

## インストール {% #installation %}

Genesis SDKは、UmiおよびMetaplex toolboxパッケージとともにnpmからインストールします。

```bash
npm install @metaplex-foundation/genesis @metaplex-foundation/umi \
  @metaplex-foundation/umi-bundle-defaults @metaplex-foundation/mpl-toolbox
```

## セットアップ {% #setup %}

SDKは `.use(genesis())` でUmiプラグインとして登録します。あわせて `.use(mplToolbox())` も登録してください。これにより、Genesisのインストラクションがトークンアカウントを解決する際に使用するSPL TokenプログラムとAssociated Tokenプログラムが登録されます。

```typescript {% title="setup.ts" %}
import { genesis } from '@metaplex-foundation/genesis'
import { mplToolbox } from '@metaplex-foundation/mpl-toolbox'
import { keypairIdentity } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'

const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(mplToolbox())
  .use(genesis())

umi.use(keypairIdentity(yourKeypair))
```

{% callout type="warning" %}
`mplToolbox()` がない場合、トークンアカウントを導出するインストラクションは送信前に `ProgramNotRecognizedError: The provided program name [splAssociatedToken] is not recognized` で失敗します。
{% /callout %}

このページのサンプルはmainnetのRPCを使用しています。devnetでは `https://api.devnet.solana.com` を使用し、`deriveRaydiumPDAsV2` に `{ env: 'devnet' }` を渡してください。指定しない場合、mainnetのRaydiumアカウントが導出されます。すべてのサンプルはdevnetで実行済みです。完全な実装ガイドについては、[Launch Pool](/ja/smart-contracts/genesis/launch-pool)または[Presale](/ja/smart-contracts/genesis/presale)を参照してください。

---

## インストラクションリファレンス {% #instructions-reference %}

以下の表は、Genesisの各インストラクションビルダーを領域ごとに、署名が必要なアカウントとともに一覧にしたものです。「支払者のみ」はそのインストラクションがパーミッションレスであることを意味します。任意のウォレットが送信でき、資金は常にバケットに保存されたアドレスに移動します。

### コアインストラクション {% #core-instructions %}

| 関数 | 説明 | 署名者 |
|----------|-------------|---------|
| [initializeV2()](#initialize-v2) | Genesis Accountの作成とトークンの発行 | Authority、ベースミント |
| [finalizeV2()](#finalize-v2) | 設定のロックとローンチの有効化 | Authority |

### バケット作成インストラクション {% #bucket-creation-instructions %}

| 関数 | 説明 | 署名者 |
|----------|-------------|---------|
| [addLaunchPoolBucketV2Base()](#add-launch-pool-bucket-v2) | 比例配分バケットの追加（その後に拡張と動作を設定） | Authority |
| [addPresaleBucketV2Base()](#add-presale-bucket-v2) | 固定価格販売バケットの追加（その後に拡張と動作を設定） | Authority |
| [addUnlockedBucketV2()](#add-unlocked-bucket-v2) | トレジャリー/受取人バケットの追加 | Authority |
| [addRaydiumCpmmBucketV2()](#add-raydium-cpmm-bucket-v2) | Raydium CPMMグラデュエーションバケットの追加 | Authority |
| [addClaimScheduleBucketV2()](#add-claim-schedule-bucket-v2) | クレームスケジュール付きベスティングバケットの追加 | Authority |

### Launch Poolインストラクション {% #launch-pool-instructions %}

| 関数 | 説明 | 署名者 |
|----------|-------------|---------|
| [depositLaunchPoolV2()](#deposit-launch-pool-v2) | Launch PoolにSOLを入金 | 入金者 |
| [withdrawLaunchPoolV2()](#withdraw-launch-pool-v2) | SOLの出金（入金期間中） | 入金者 |
| [claimLaunchPoolV2()](#claim-launch-pool-v2) | トークンの請求（入金期間終了後） | 支払者のみ |
| [refundLaunchPoolV2()](#refund-launch-pool-v2) | 入金の返金（しきい値未達またはソフトキャップ超過時） | 支払者のみ |

### Presaleインストラクション {% #presale-instructions %}

| 関数 | 説明 | 署名者 |
|----------|-------------|---------|
| [depositPresaleV2()](#deposit-presale-v2) | PresaleにSOLを入金 | 入金者 |
| [claimPresaleV2()](#claim-presale-v2) | トークンの請求（入金期間終了後） | 支払者のみ |

### Unlockedバケットインストラクション {% #unlocked-bucket-instructions %}

| 関数 | 説明 | 署名者 |
|----------|-------------|---------|
| [claimUnlockedV2()](#claim-unlocked-v2) | バケットのベーストークン残高とクォートトークン残高を受取人に送信 | 支払者のみ |

### クレームスケジュールインストラクション {% #claim-schedule-instructions %}

| 関数 | 説明 | 署名者 |
|----------|-------------|---------|
| [claimClaimScheduleV2()](#claim-claim-schedule-v2) | ベスト済みトークンをバケットの受取人に送信 | 支払者のみ |
| [setClaimSchedulePausedStateV2()](#claim-schedule-runtime-controls) | ベスティングの一時停止または再開 | Authority |
| [cancelClaimScheduleBucketV2()](#claim-schedule-runtime-controls) | ベスティングの恒久的な停止 | Authorityまたは受取人 |
| [transferRecipientClaimScheduleBucketV2()](#claim-schedule-runtime-controls) | ベスティング受取人の変更 | Authorityまたは受取人 |

### Raydium CPMMグラデュエーションインストラクション {% #raydium-cpmm-graduation-instructions %}

| 関数 | 説明 | 署名者 |
|----------|-------------|---------|
| [graduateToRaydiumCpmmV2()](#graduate-to-raydium-cpmm-v2) | バケットのクォートトークンとベーストークンからRaydium CPMMプールを作成 | 支払者のみ（設定されている場合はバックエンド署名者も） |
| [postponeStartRaydiumCpmmBucketV2()](#postpone-start-raydium-cpmm-bucket-v2) | 延期可能なグラデュエーション開始を後ろにずらす | Authority |
| [claimRaydiumCpmmLpTokensV2()](#claim-raydium-cpmm-lp-tokens-v2) | アンロック済みLPトークンの請求 | LP claim authority |
| [burnRaydiumCpmmLpTokensV2()](#burn-raydium-cpmm-lp-tokens-v2) | 未請求LPトークンのバーン | LP claim authority |
| [collectRaydiumCpmmFeesV2()](#collect-raydium-cpmm-fees-v2) | Raydiumのクリエイター手数料をGenesis手数料ウォレットに回収 | 支払者のみ |
| [collectRaydiumCpmmFeesWithCreatorFeeV2()](#collect-raydium-cpmm-fees-with-creator-fee-v2) | クリエイター手数料を回収し、ローンチ作成者の取り分を積み立て | 支払者のみ |
| [claimRaydiumCreatorFeeV2()](#claim-raydium-creator-fee-v2) | 積み立てられたクリエイター手数料をクリエイターウォレットに支払い | 支払者のみ |

### 条件と動作のインストラクション {% #condition-and-behavior-instructions %}

| 関数 | 説明 | 署名者 |
|----------|-------------|---------|
| [triggerConditionsV2()](#trigger-conditions-v2) | 1つのバケットのすべての条件を解決 | 支払者のみ |
| [triggerBehaviorsV2()](#trigger-behaviors-v2) | バケットの終了動作を実行 | 支払者のみ |
| [set*BucketV2Behaviors()](#set-bucket-v2-behaviors) | ファイナライズ前にバケットの終了動作を置き換え | Authority |

### 管理者インストラクション {% #admin-instructions %}

| 関数 | 説明 | 署名者 |
|----------|-------------|---------|
| [revokeV2()](#revoke-v2) | ミント権限および/またはフリーズ権限の永久取り消し | Authority |
| [setBucketBackendSignerV2()](#set-bucket-backend-signer-v2) | バケットのバックエンド署名者の設定、ローテーション、クリア | Authority |

---

## 関数シグネチャ {% #function-signatures %}

以下の各インストラクションには、引数にコメントを付けた完全なサンプルを掲載しています。トークンアカウント、トークンプログラム、バケット署名者PDAなど、記載されていないアカウントはSDKが導出します。すべてのサンプルはdevnet上のGenesisプログラムに対して実行済みです。

### initializeV2

`initializeV2` はGenesisアカウントを作成し、トークンの総供給量をそのアカウントにミントします。

{% code-tabs-imported from="genesis/initialize_v2" frameworks="umi" filename="initializeV2" /%}

### finalizeV2

`finalizeV2` はローンチ設定をロックして有効化します。ローンチのすべてのバケットを読み取り専用のremaining accountとして渡す必要があり、その数はGenesisアカウントの `bucketCount` と一致しなければなりません。

{% code-tabs-imported from="genesis/finalize_v2" frameworks="umi" filename="finalizeV2" /%}

バケットアカウントを渡さずに呼び出すと `MissingFinalizeBucketAccounts` で失敗します。また、バケットの割り当ての合計が総供給量に一致しない場合、ファイナライズは `TotalSupplyNotFullyAllocated` で失敗します。

### addLaunchPoolBucketV2

Launch Poolバケットは `addLaunchPoolBucketV2Base` で作成し、任意のガードを `addLaunchPoolBucketV2Extensions` で追加し、終了動作を `setLaunchPoolBucketV2Behaviors` で設定します。

{% code-tabs-imported from="genesis/add_launch_pool_bucket_v2" frameworks="umi" filename="addLaunchPoolBucket" /%}

{% callout type="warning" %}
一括版の `addLaunchPoolBucketV2` インストラクションは使用しないでください。オプションと終了動作1つを含めるとシリアライズ後に約1,566バイトとなり、Solanaのトランザクション上限である1,232バイトを超えるため、送信は `base64 encoded data too large` で失敗します。
{% /callout %}

`addLaunchPoolBucketV2Extensions` が受け付ける拡張は、`MinimumDepositAmount`、`MinimumQuoteTokenThreshold`、`SoftCap`、`DepositLimit`、`Allowlist`、`ClaimSchedule`、`BackendSigner`、`DepositPenalty`、`WithdrawPenalty`、`BonusSchedule` です。ソフトキャップは0より大きく（`InvalidSoftCap`）、最小しきい値以上である（`SoftCapBelowThreshold`）必要があります。動作については [Launch Pool のソフトキャップ](/ja/smart-contracts/genesis/launch-pool#launch-pool-soft-cap)を参照してください。

### addPresaleBucketV2

Presaleバケットは `addPresaleBucketV2Base` で作成し、割り当て、価格を決めるクォートトークン上限、タイミングを設定します。終了動作は `setPresaleBucketV2Behaviors` で設定します。

{% code-tabs-imported from="genesis/add_presale_bucket_v2" frameworks="umi" filename="addPresaleBucket" /%}

一括版の `addPresaleBucketV2` インストラクションは、実際のアカウントを渡すとトランザクションサイズの上限をわずかに超えます。入金上限、クールダウン、許可リスト、最低調達額は `addPresaleBucketV2Extensions` で追加します。

### addUnlockedBucketV2

Unlockedバケットは、チームのトレジャリーなど単一の受取人のためにトークンを保持します。ベーストークンは自身の割り当てと、ロールオーバーまたは再割り当ての動作から受け取り、クォートトークンは `SendQuoteTokenPercentage` 動作から受け取ります。

{% code-tabs-imported from="genesis/add_unlocked_bucket_v2" frameworks="umi" filename="addUnlockedBucket" /%}

### addRaydiumCpmmBucketV2

Raydium CPMMバケットはベーストークンを確保し、終了動作を通じて販売収益を受け取ったうえで、グラデュエーション時にRaydium CP-Swapプールを作成します。LPロックの仕組みについては [Locked LP Tokens](/ja/smart-contracts/genesis/locked-lp-tokens) を参照してください。

{% code-tabs-imported from="genesis/add_raydium_cpmm_bucket_v2" frameworks="umi" filename="addRaydiumCpmmBucket" /%}

バケットの `graduateCondition` は引数ではありません。プログラムはこれを `Triggered` 条件として作成し、`graduateToRaydiumCpmmV2` の中で発火させます。これにより、他のバケットは `BucketTimes.Graduate` を `TimeRelative` の基準として利用できるようになります。

{% callout type="note" %}
Raydium CPMMバケットは、ちょうど1つの `SendQuoteTokenPercentage` 動作とちょうど1つの `SendStartPrice` 動作の宛先でなければならず、両方とも同じ販売バケットからのものである必要があります。そうでない場合、`finalizeV2` はローンチを拒否します（`MissingRaydiumGraduationSource`、`DuplicateRaydiumGraduationSource`、`RaydiumGraduationSourceMismatch`）。`burnLp: true` は `lpLockSchedule` と併用できません（`BurnLpConflictsWithLpLockSchedule`）。
{% /callout %}

`postponableStart` の形状は `{ maxPostpones: number, timesPostponed: 0, padding: Array(2).fill(0), delayBudgetSeconds: number }` で、`TimeAbsolute` の開始条件、または販売の `DepositEnd` か `SwapEnd` を基準とする `TimeRelative` の開始条件が必要です。販売バケットがRaydiumバケットの作成前にその終了動作で宛先として指定できるよう、`findRaydiumCpmmBucketV2Pda` で事前にバケットのPDAを導出しておきます。

### addClaimScheduleBucketV2

クレームスケジュールバケットは、ベーストークンを1人の受取人に時間をかけてベスティングします。ベスティングの計算とランタイム制御については [Project Vesting](/ja/smart-contracts/genesis/project-vesting) を参照してください。

{% code-tabs-imported from="genesis/add_claim_schedule_bucket_v2" frameworks="umi" filename="addClaimScheduleBucket" /%}

`ClaimSchedule` の形状は `{ startCondition, duration, period, cliffCondition, cliffAmountBps, reserved: Array(126).fill(0) }` です。絶対時刻の場合は `createClaimSchedule({ startTime, endTime, cliffTime, cliffAmountBps, period })` で構築し、ベスティングをグラデュエーションに連動させる場合は `createTimeRelativeCondition` による開始条件とクリフ条件を使って構築します。クリフと線形スケジュールは独立しており、`Never` のクリフと `cliffAmountBps: 0` を組み合わせると線形のみのベスティングになります。

### depositLaunchPoolV2

`depositLaunchPoolV2` は、入金ウィンドウ中にラップドSOLをLaunch Poolに入金します。[SOL のラッピング](/ja/smart-contracts/genesis/launch-pool#wrapping-sol)に示すとおり、先にSOLをラップしてください。

{% code-tabs-imported from="genesis/deposit_launch_pool_v2" frameworks="umi" filename="depositLaunchPool" /%}

### depositPresaleV2

`depositPresaleV2` は、入金ウィンドウ中にラップドSOLをPresaleに入金します。

{% code-tabs-imported from="genesis/deposit_presale_v2" frameworks="umi" filename="depositPresale" /%}

### withdrawLaunchPoolV2

`withdrawLaunchPoolV2` は、入金ウィンドウが開いている間にLaunch Poolの入金の一部を引き出します。

{% code-tabs-imported from="genesis/withdraw_launch_pool_v2" frameworks="umi" filename="withdrawLaunchPool" /%}

### claimLaunchPoolV2

`claimLaunchPoolV2` は、請求ウィンドウが開くと、Launch Poolの割り当てのうち入金者の取り分を送信します。

{% code-tabs-imported from="genesis/claim_launch_pool_v2" frameworks="umi" filename="claimLaunchPool" /%}

### refundLaunchPoolV2

`refundLaunchPoolV2` は、入金ウィンドウが閉じた後に Launch Pool の入金を返金します。金額はプログラムが導出します。`minimumQuoteTokenThreshold` に届かなかった場合は入金全額が返金され、`softCap` を超過した場合は入金者のトークン割り当てを維持したまま超過分のみが返金されます。

{% code-tabs-imported from="genesis/refund_launch_pool_v2" frameworks="umi" filename="refundLaunchPool" /%}

署名が必要なのは `payer` のみのため、入金者に代わって誰でも返金をクランクできます。入金ウィンドウが閉じる前に呼び出すと `LaunchPoolNotEnded`、下限に達し上限も超過していない状態で呼び出すと `LaunchPoolThresholdMet`、2 回呼び出すと `DepositAlreadyRefunded` を返します。

### claimPresaleV2

`claimPresaleV2` は、請求ウィンドウが開くと、Presaleの入金者にトークンを送信します。

{% code-tabs-imported from="genesis/claim_presale_v2" frameworks="umi" filename="claimPresale" /%}

### claimUnlockedV2

`claimUnlockedV2` は、Unlockedバケットの現在のベーストークン残高とクォートトークン残高の全額を、バケットに保存された受取人に送信します。クォート側からはプロトコルの請求手数料が差し引かれます。

{% code-tabs-imported from="genesis/claim_unlocked_v2" frameworks="umi" filename="claimUnlocked" /%}

請求は繰り返し実行できます。前回の請求後に、ロールオーバーや再割り当ての動作によってベーストークンが追加される場合があるためです。残高がない状態で請求すると `UnlockedBucketAlreadyClaimed` を返し、バケットの受取人と異なる受取人を指定すると `RecipientMismatch` を返します。バケットにバックエンド署名者がある場合は、`backendSigner` として渡してください。

### claimClaimScheduleV2

`claimClaimScheduleV2` は、現時点でベスト済みかつ未請求のトークンをすべて、バケットに保存された受取人に転送します。

{% code-tabs-imported from="genesis/claim_claim_schedule_v2" frameworks="umi" filename="claimClaimSchedule" /%}

クレームゲート、線形開始、またはクリフが `TimeRelative` の場合は、先にクレームスケジュールバケットに対して [triggerConditionsV2](#trigger-conditions-v2) を呼び出してください。ベスト済みのトークンがない状態で請求すると `NothingToClaim` を返します。

### クレームスケジュールのランタイム制御 {% #claim-schedule-runtime-controls %}

クレームスケジュールのランタイム制御は、ファイナライズ後にベスティングバケットを一時停止、キャンセル、または受取人変更するためのもので、いずれも作成時に対応するポリシーフラグが設定されている場合にのみ機能します。

`setClaimSchedulePausedStateV2` はベスティングを一時停止または再開し、`pausable: true` が必要です。Genesisのauthorityが署名します。

{% code-tabs-imported from="genesis/pause_claim_schedule_bucket_v2" frameworks="umi" filename="setClaimSchedulePausedState" /%}

`transferRecipientClaimScheduleBucketV2` は受取人を変更し、`transferable`（authority）または `transferableByRecipient`（受取人）が必要です。

{% code-tabs-imported from="genesis/transfer_claim_schedule_recipient_v2" frameworks="umi" filename="transferRecipientClaimScheduleBucket" /%}

`cancelClaimScheduleBucketV2` はベスティングを恒久的に停止し、`cancelable`（authority）または `cancelableByRecipient`（受取人）が必要です。

{% code-tabs-imported from="genesis/cancel_claim_schedule_bucket_v2" frameworks="umi" filename="cancelClaimScheduleBucket" /%}

ポリシーが無効な場合は `ClaimSchedulePolicyDisabled` を返し、ポリシーで許可されていない署名者の場合は `ClaimScheduleUnauthorized` を返します。キャンセル後は、`triggerBehaviorsV2` で実行される `ReallocateBaseTokensOnCancel` 動作が未ベストの残りを移動します。

### revokeV2

`revokeV2` は、ベーストークンのミント権限、フリーズ権限、またはその両方を恒久的に取り消します。

{% code-tabs-imported from="genesis/revoke_v2" frameworks="umi" filename="revoke" /%}

### setBucketBackendSignerV2

`setBucketBackendSignerV2` は、バックエンド署名者に対応する任意のV2バケットで、バックエンド署名者の拡張を設定、ローテーション、またはクリアします。バックエンドの鍵を紛失した場合、その鍵で制御されるすべてのアクション（ユーザーの請求を含む）がブロックされたままになるため、これが復旧手段となります。

{% code-tabs-imported from="genesis/set_bucket_backend_signer_v2" frameworks="umi" filename="setBucketBackendSigner" /%}

既存のバックエンド署名者のローテーションやクリアは、`finalizeV2` の前後どちらでも行えます。バックエンド署名者を持ったことのないバケットに新たに追加できるのは、ファイナライズ前のみです。バックエンド署名者には、Genesis authorityが選んだ任意の鍵を使用できます。

---

## Raydium CPMMグラデュエーションのシグネチャ {% #raydium-cpmm-graduation-signatures %}

Raydium CPMMグラデュエーションのインストラクションは、Raydium CPMMバケットからRaydium CP-Swapプールを作成し、その後LPトークンとプール手数料を管理します。これらのインストラクションが受け取るRaydiumアカウントはすべて `deriveRaydiumPDAsV2(umi, baseMint, raydiumBucket, options)` で導出します。

### deriveRaydiumPDAsV2

`deriveRaydiumPDAsV2` は、Raydium CPMMバケットに対応するRaydiumプールのアカウントを返します。プールステートはGenesisが導出するPDAであるため、グラデュエーション前に誰かがプールを作成することはできません。

| オプション | 型 | デフォルト | 意味 |
|--------|------|---------|---------|
| `quoteMint` | `PublicKey` | wSOL | クォートトークンのミント |
| `env` | `'mainnet' \| 'devnet'` | `'mainnet'` | Raydium CP-Swapプログラム、AMM設定、プール手数料の受取先を選択 |
| `creatorFee` | `boolean` | `false` | クリエイター手数料用AMM設定を選択。バケットに `creatorFee` 拡張がある場合は必須 |
| `ammConfig` | `PublicKey` | — | AMM設定の明示的な上書き |

戻り値には `poolState`、`ammConfig`、`poolAuthority`、`lpMint`、`baseVault`、`quoteVault`、`createPoolFee`、`observationState`、`raydiumProgram`、`raydiumSigner`、`permission`、`creatorFeeShare`、`token0Mint`、`token1Mint`、`isProjectMintToken0` が含まれます。拡張なしでクリエイター手数料用AMM設定を使う場合、または拡張があるのにクリエイター手数料用AMM設定を使わない場合、グラデュエーションは `InvalidCreatorFeeConfig` で失敗します。

### graduateToRaydiumCpmmV2

`graduateToRaydiumCpmmV2` はRaydiumプールを作成し、バケットのクォートトークンと、販売の開始価格に見合うベーストークンを預け入れ、バケットの `graduateCondition` を発火させます。

{% code-tabs-imported from="genesis/graduate_to_raydium_cpmm_v2" frameworks="umi" filename="graduateToRaydiumCpmm" /%}

グラデュエーションはパーミッションレスです。署名するのは手数料支払者のみで、バケットにバックエンド署名者の拡張がある場合はその署名者も署名します。インストラクションは次の3点を順に確認します。

| チェック | エラー |
|-------|-------|
| バケットがまだグラデュエーションしていない | `BucketAlreadyGraduated` |
| 資金源の販売が失敗していない（`TransmitFailure` を受け取っていない） | `BucketLaunchFailed` |
| バケットの `startCondition` が満たされている | `GraduationNotStarted` |

グラデュエーションの前に、販売バケットに対して `triggerBehaviorsV2` を実行し、Raydiumバケットがクォートトークンと開始価格を受け取った状態にしておきます。これらがない場合、グラデュエーションは `InvalidAmount` で失敗します。`startCondition` が `TimeRelative` の場合は、先に販売バケットをremaining accountとして渡し、Raydiumバケットに対して `triggerConditionsV2` を実行してください。

{% callout type="warning" %}
グラデュエーションは他のバケットの請求を開始しません。`BucketTimes.Graduate` を基準とする `TimeRelative` のLaunch Pool、Unlocked、クレームスケジュールの各条件は、誰かがRaydiumバケットを書き込み可能なremaining accountとして渡してそのバケットに対して [triggerConditionsV2](#trigger-conditions-v2) を呼び出すまで、未トリガーのままです。
{% /callout %}

### postponeStartRaydiumCpmmBucketV2

`postponeStartRaydiumCpmmBucketV2` はグラデュエーションの開始を後ろにずらします。`postponableStart` 拡張付きで作成されたバケットでのみ機能します。

{% code-tabs-imported from="genesis/postpone_start_raydium_cpmm_bucket_v2" frameworks="umi" filename="postponeStartRaydiumCpmmBucket" /%}

`newStartValue` は、`TimeAbsolute` の開始条件では新しいUnix時刻、`TimeRelative` の開始条件では販売終了からの新しいオフセット（秒）です。`TimeRelative` の場合は販売バケットを `sourceBucket` として渡す必要もあります。延期は `maxPostpones` と `delayBudgetSeconds` によって制限され、予定されたグラデュエーションの少なくとも30分前に行う必要があり、開始を少なくとも24時間先に移動する必要があります。違反した場合は `PostponeLimitReached`、`PostponeNotLater`、`PostponeExceedsMaxDelay`、`PostponeTooLate`、`PostponeTooSoon`、または `BucketNotPostponable` を返します。

### claimRaydiumCpmmLpTokensV2

`claimRaydiumCpmmLpTokensV2` は、`lpLockSchedule` でベスト済みの量を上限として、アンロック済みのLPトークンをバケット署名者から宛先トークンアカウントに転送します。

{% code-tabs-imported from="genesis/claim_raydium_cpmm_lp_tokens_v2" frameworks="umi" filename="claimRaydiumCpmmLpTokens" /%}

グラデュエーション前に請求すると `NoLpTokensToClaim`、署名者が誤っている場合は `InvalidLpClaimAuthority`、まだアンロックされたLPトークンがない状態で請求すると `InsufficientUnlockedAmount` を返します。アンロック済み残高を超える `amount` はエラーにならず、その残高まで切り詰められます。`TimeRelative` 条件を持つ `lpLockSchedule` では、請求の前にRaydiumバケットに対して [triggerConditionsV2](#trigger-conditions-v2) を呼び出す必要があります。

### burnRaydiumCpmmLpTokensV2

`burnRaydiumCpmmLpTokensV2` は、バケット署名者が保持する未請求のLPトークンをバーンし、プール流動性のその持分を恒久的にロックします。

{% code-tabs-imported from="genesis/burn_raydium_cpmm_lp_tokens_v2" frameworks="umi" filename="burnRaydiumCpmmLpTokens" /%}

バーンは価値を放棄するだけなので、`lpLockSchedule` を無視します。バケットは `lpTokenBalance`（グラデュエーション時に受け取った量）、`lpTokensClaimed`、`lpTokensBurned` を個別に記録します。代わりにグラデュエーション時にすべてのLPトークンをバーンするには、`burnLp: true` でバケットを作成します。

### collectRaydiumCpmmFeesV2

`collectRaydiumCpmmFeesV2` は、`creatorFee` 拡張なしで作成されたプールについて、プールに蓄積されたRaydiumのクリエイター手数料を回収し、クォート側をGenesisのセカンダリ手数料ウォレットに送信します。

{% code-tabs-imported from="genesis/collect_raydium_cpmm_fees_v2" frameworks="umi" filename="collectRaydiumCpmmFees" /%}

手数料が蓄積されていない場合、インストラクションは転送を行わずに成功します。クリエイター手数料用AMM設定のプールでは `InvalidRaydiumAmmConfig` を返すため、そのようなプールには `collectRaydiumCpmmFeesWithCreatorFeeV2` を使用してください。

### collectRaydiumCpmmFeesWithCreatorFeeV2

`collectRaydiumCpmmFeesWithCreatorFeeV2` は、バケットに `creatorFee` 拡張があるプールからクリエイター手数料を回収し、ローンチ作成者の取り分をバケットに積み立て、残りをGenesisのセカンダリ手数料ウォレットに送信します。サンプルでは、続けて `claimRaydiumCreatorFeeV2` で作成者に支払います。

{% code-tabs-imported from="genesis/collect_raydium_cpmm_fees_with_creator_fee_v2" frameworks="umi" filename="collectRaydiumCpmmFeesWithCreatorFee" /%}

### claimRaydiumCreatorFeeV2

`claimRaydiumCreatorFeeV2` は、積み立てられた未請求のクリエイター手数料を、Raydiumバケットからその `creatorFee` 拡張に保存されたウォレットに支払います。エンドツーエンドのフローについては [Creator Fees](/ja/smart-contracts/genesis/creator-fees) を参照してください。

{% code-tabs-imported from="genesis/claim_raydium_creator_fee_v2" frameworks="umi" filename="claimRaydiumCreatorFee" /%}

クォートミントがwSOLの場合、手数料はアンラップされてネイティブSOLとして支払われます。未請求の手数料がない場合、インストラクションは転送を行わずに成功します。拡張と異なるウォレットを指定すると `InvalidCreatorFeeWallet` を返します。

---

## 条件と動作のシグネチャ {% #condition-and-behavior-signatures %}

条件と動作のインストラクションは、ローンチをフェーズ間で進めます。`triggerConditionsV2` はタイミングを解決し、`triggerBehaviorsV2` はバケット間で資金を移動し、`set*BucketV2Behaviors` ファミリーはファイナライズ前に動作を設定します。

### triggerConditionsV2

`triggerConditionsV2` は、1つの対象バケットのすべての条件を解決します。これには `claimSchedule` の開始とクリフ、Raydiumの `lpLockSchedule` などの拡張条件も含まれます。パーミッションレスであり、手数料支払者の署名のみを必要とします。

{% code-tabs-imported from="genesis/trigger_conditions_after_graduation_v2" frameworks="umi" filename="triggerConditions" /%}

| プロパティ | 値 |
|----------|-------|
| 署名者 | 手数料支払者のみ |
| 対象 | インストラクションごとに1つのバケット |
| Remaining accounts | 参照されるすべてのバケットを**書き込み可能**として、任意の順序で |
| 自己参照 | 対象バケットを再度渡さなくても解決される |
| 再実行 | 安全。トリガー済みの条件はスキップされ、期限を迎えた条件がない呼び出しは変更なしで成功する |

インストラクションはまず、各remaining accountのバケットの `TimeAbsolute` 条件を解決し、次に、参照先がそれらに含まれ、かつ時刻が経過している対象バケットの各 `TimeRelative` 条件を解決します。記録される `triggeredTimestamp` は基準時刻にオフセットを加えた値であり、クランクが実行された時刻ではありません。

{% callout type="note" %}
`TimeRelative` 条件は、入金、請求、グラデュエーションによって遅延的に解決されることはありません。`graduateToRaydiumCpmmV2` の後、依存する各バケット（Launch Pool、Unlocked、クレームスケジュール）に対して、Raydium CPMMバケットを書き込み可能なremaining accountとして渡して `triggerConditionsV2` を1回ずつ呼び出してください。グラデュエーションから90日後のクリフには、その90日が経過した後にもう一度呼び出す必要があります。
{% /callout %}

### triggerBehaviorsV2

`triggerBehaviorsV2` は、1つのソースバケット（`primaryBucket`）の未処理の終了動作をすべて実行し、二重に実行されないよう各動作を処理済みとしてマークします。パーミッションレスであり、手数料支払者の署名のみを必要とします。

{% code-tabs-imported from="genesis/trigger_launch_pool_graduation_v2" frameworks="umi" filename="triggerBehaviors" /%}

remaining accountsは、宛先ごとに `(destination bucket, destination quote token account)` のペアを1組ずつ渡し、すべて書き込み可能にします。宛先のクォートトークンアカウントは、宛先バケットのクォートミントのATAです。宛先がRaydium CPMMの場合、そのATAはバケット自体ではなく、`findRaydiumBucketSignerPda(umi, { bucket })` で得られるバケット署名者PDAが所有します。remaining accountsの数が奇数の場合は `InvalidRemainingAccountsLength` を返します。

| ソースバケット | 実行可能になる条件 | 早すぎる場合のエラー |
|---------------|------------|--------------------|
| Launch Pool | `depositEndCondition` が満たされている | `LaunchPoolNotEnded` |
| Presale | `depositEndCondition` が満たされている | `PresaleBucketNotEnded` |
| Raydium CPMM | プールがグラデュエーションした、またはバケットが失敗としてマークされた | `InvalidBucketState` |
| クレームスケジュール | ベスティングがキャンセル、完了、または失敗した | `ClaimScheduleBucketNotEnded` |

### set*BucketV2Behaviors

`set*BucketV2Behaviors` インストラクションは、既存バケットの `endBehaviors` リスト全体を置き換えます。Genesis authorityが必要で、`finalizeV2` の後は `GenesisAccountFinalized` で失敗します。

{% code-tabs-imported from="genesis/set_launch_pool_bucket_v2_behaviors" frameworks="umi" filename="setLaunchPoolBucketBehaviors" /%}

| 関数 | バケットタイプ | 許可される動作 |
|----------|-------------|-------------------|
| `setLaunchPoolBucketV2Behaviors` | Launch Pool | `SendQuoteTokenPercentage`、`SendStartPrice`、`ReallocateBaseTokensOnFailure`、`TransmitFailure` |
| `setPresaleBucketV2Behaviors` | Presale | Launch Poolのセットに加えて `BaseTokenRollover` |
| `setRaydiumCpmmBucketV2Behaviors` | Raydium CPMM | `BaseTokenRollover`、`ReallocateBaseTokensOnFailure` |
| `setClaimScheduleBucketV2Behaviors` | クレームスケジュール | `ReallocateBaseTokensOnCancel`（最大1つ） |
| `setUnlockedBucketV2Behaviors` | Unlocked | なし。空のリストのみ受け付けられる |

同じシグネチャが `setBondingCurveBucketV2Behaviors`、`setVaultBucketV2Behaviors`、`setRaydiumClmmBucketV2Behaviors` にも適用されます。サポートされていない動作は `BehaviorNotSupportedForBucketType` を返し、`SendQuoteTokenPercentage`、`BaseTokenRollover`、または `ReallocateBaseTokensOnFailure` の合計が10,000 bpsを超えると `BehaviorPercentageOverflow` を返します。

---

## PDAヘルパー {% #pda-helpers %}

PDAヘルパーはシードからGenesisアカウントのアドレスを導出するため、バケットは作成前の相手を参照できます。

| 関数 | シード |
|----------|-------|
| findGenesisAccountV2Pda() | `baseMint`, `genesisIndex` |
| findLaunchPoolBucketV2Pda() | `genesisAccount`, `bucketIndex` |
| findPresaleBucketV2Pda() | `genesisAccount`, `bucketIndex` |
| findUnlockedBucketV2Pda() | `genesisAccount`, `bucketIndex` |
| findRaydiumCpmmBucketV2Pda() | `genesisAccount`, `bucketIndex` |
| findClaimScheduleBucketV2Pda() | `genesisAccount`, `bucketIndex` |
| findRaydiumBucketSignerPda() | `bucket`（Raydium CPMMバケット） |
| findRaydiumSignerPda() | なし（プログラムごとに1つ） |
| findLaunchPoolDepositV2Pda() | `bucket`, `recipient` |
| findPresaleDepositV2Pda() | `bucket`, `recipient` |

```typescript
const [genesisAccountPda] = findGenesisAccountV2Pda(umi, { baseMint: mint.publicKey, genesisIndex: 0 });
const [bucketPda] = findLaunchPoolBucketV2Pda(umi, { genesisAccount: genesisAccountPda, bucketIndex: 0 });
const [depositPda] = findLaunchPoolDepositV2Pda(umi, { bucket: bucketPda, recipient: wallet });
const [raydiumBucketPda] = findRaydiumCpmmBucketV2Pda(umi, { genesisAccount: genesisAccountPda, bucketIndex: 0 });
```

バケットインデックスはバケットタイプごとに数えられるため、最初のLaunch Poolと最初のRaydium CPMMバケットはどちらも `bucketIndex: 0` を使用します。

---

## フェッチ関数 {% #fetch-functions %}

フェッチ関数はGenesisアカウントをデシリアライズします。すべてのアカウントタイプに、`fetch*`（存在しない場合はスロー）、`safeFetch*`（`null` を返す）、`fetchAll*` のバリアントがあります。

### Genesisアカウント {% #genesis-account %}

Genesisアカウントは[ローンチタイプ](#launch-type)を含むトップレベルのローンチ状態を保存します。バックエンドクランクが`setLaunchTypeV2`インストラクションを介して作成後にオンチェーンで`launchType`フィールドを設定するため、クランクが処理するまで値は`Uninitialized`（0）のままの場合があります。

| 関数 | 戻り値 |
|----------|---------|
| fetchGenesisAccountV2() | Genesisアカウントの状態（存在しない場合はエラーをスロー） |
| safeFetchGenesisAccountV2() | Genesisアカウントの状態または`null` |
| fetchGenesisAccountV2FromSeeds() | PDAシード（`baseMint`、`genesisIndex`）で取得 |
| safeFetchGenesisAccountV2FromSeeds() | 上記と同じ、存在しない場合は`null`を返す |
| fetchAllGenesisAccountV2() | 複数のGenesisアカウントを一括取得 |

{% code-tabs-imported from="genesis/fetch_genesis_account_v2" frameworks="umi" filename="fetchGenesisAccount" /%}

**Genesisアカウントのフィールド:** `authority`, `baseMint`, `quoteMint`, `totalSupplyBaseToken`, `totalAllocatedSupplyBaseToken`, `totalProceedsQuoteToken`, `fundingMode`, `launchType`, `bucketCount`, `finalized`

### GPAビルダー — ローンチタイプで照会 {% #gpa-builder-query-by-launch-type %}

`getGenesisAccountV2GpaBuilder()`を使用して、オンチェーンフィールドでフィルタリングされた全Genesisアカウントを照会します。バイトレベルフィルターを用いたSolanaの `getProgramAccounts` RPCメソッドを使用するため、RPCエンドポイントがGenesisプログラムに対する `getProgramAccounts` を許可している必要があります。

{% code-tabs-imported from="genesis/query_genesis_accounts_by_launch_type" frameworks="umi" filename="queryByLaunchType" /%}

{% callout type="note" %}
`launchType`はローンチ作成後にバックエンドクランクによって遡及的に設定されます。最近作成されたローンチは、クランクが処理するまで`LaunchType.Uninitialized`（0）を表示する場合があります。
{% /callout %}

### バケットと入金 {% #buckets-and-deposits %}

| 関数 | 戻り値 |
|----------|---------|
| fetchLaunchPoolBucketV2() | バケットの状態（存在しない場合はエラーをスロー） |
| safeFetchLaunchPoolBucketV2() | バケットの状態または`null` |
| fetchPresaleBucketV2() | バケットの状態（存在しない場合はエラーをスロー） |
| safeFetchPresaleBucketV2() | バケットの状態または`null` |
| fetchUnlockedBucketV2() | Unlockedバケットの状態 |
| fetchRaydiumCpmmBucketV2() | Raydium CPMMバケットの状態 |
| fetchClaimScheduleBucketV2() | クレームスケジュールバケットの状態 |
| fetchLaunchPoolDepositV2() | 入金の状態（存在しない場合はエラーをスロー） |
| safeFetchLaunchPoolDepositV2() | 入金の状態または`null` |
| fetchPresaleDepositV2() | 入金の状態（存在しない場合はエラーをスロー） |
| safeFetchPresaleDepositV2() | 入金の状態または`null` |

{% code-tabs-imported from="genesis/fetch_launch_pool_bucket_and_deposit_v2" frameworks="umi" filename="fetchLaunchPoolState" /%}

**バケットの状態フィールド:** `quoteTokenDepositTotal`, `weightedQuoteTokenTotal`, `depositCount`, `claimCount`, `refundCount`, `bucket.baseTokenAllocation`, `extensions`

**入金の状態フィールド:** `amountQuoteToken`, `weightedQuoteToken`, `claimed`, `refunded`

---

## 型 {% #types %}

以下の型は、Genesisのインストラクション全体で使われる引数とアカウントの形状です。すべての型は `@metaplex-foundation/genesis` からエクスポートされています。

### LaunchPoolV2Extensions

Launch Pool バケットの任意のガードで、`bucket.extensions` から読み取ります。すべてのフィールドは Umi の `Option` であるため、値を読み取る前に `unwrapOption()` を使用するか `.__option` を確認してください。

```typescript
{
  backendSigner: Option<BackendSigner>;
  depositPenalty: Option<LinearBpsScheduleV2>;
  withdrawPenalty: Option<LinearBpsScheduleV2>;
  bonusSchedule: Option<LinearBpsScheduleV2>;
  depositLimit: Option<DepositLimit>;                             // { limit: bigint }
  allowlist: Option<Allowlist>;
  claimSchedule: Option<ClaimSchedule>;
  minimumDepositAmount: Option<MinimumDepositAmount>;             // { amount: bigint }
  minimumQuoteTokenThreshold: Option<MinimumQuoteTokenThreshold>; // { amount: bigint } - floor
  softCap: Option<SoftCap>;                                       // { amount: bigint } - ceiling
}
```

拡張は `addLaunchPoolBucketV2Extensions()` と `removeLaunchPoolBucketV2Extensions()` で個別に追加・削除でき、`LaunchPoolV2ExtensionType` でフィールドを選択します。どちらも Genesis Account がファイナライズされた後は拒否されます。

### LaunchType

バックエンドクランクが`setLaunchTypeV2`インストラクションを介して遡及的に設定するオンチェーンのローンチタイプです。ローンチタイプは、ローンチに使用された基盤となる仕組みを表します。

```typescript
enum LaunchType {
  Uninitialized = 0,   // Not yet set by the crank
  LaunchPoolV1 = 3,    // Launch pool (proportional distribution)
}
```

[Metaplex API](/ja/api)では文字列（`'launchpool'`）として返されますが、オンチェーンSDKでは上記の数値列挙型を使用します。

### GenesisAccountV2

Genesisローンチのトップレベルオンチェーンアカウントです。トークンミントごと、ローンチインデックスごとに1つのアカウントが存在します。

```typescript
{
  key: Key;
  bump: number;
  index: number;                          // Genesis index (usually 0)
  finalized: boolean;                     // true after finalizeV2()
  authority: PublicKey;                    // Launch creator
  baseMint: PublicKey;                     // Token being launched
  quoteMint: PublicKey;                    // Deposit token (e.g., wSOL)
  totalSupplyBaseToken: bigint;            // Total token supply
  totalAllocatedSupplyBaseToken: bigint;   // Supply allocated to buckets
  totalProceedsQuoteToken: bigint;         // Total deposits collected
  fundingMode: number;                     // Funding mode (0)
  launchType: number;                      // 0 = Uninitialized, 3 = LaunchPoolV1
  bucketCount: number;                     // Number of buckets
}
```

アカウントサイズ：**136バイト**。PDAシード：`["genesis_v2", baseMint, genesisIndex]`。

### TimeCondition

`TimeCondition`（SDKの型は `ConditionArgs`）は、満たされた時点で `triggeredTimestamp` を記録する64バイトのタイミングルールです。バリアントごとに `padding` の長さが異なるため、条件は手作業ではなくSDKヘルパーで構築してください。

| バリアント | SDKヘルパー | 満たされる条件 | 自動解決 | `padding` |
|---------|------------|----------|-----------------|-----------|
| `TimeAbsolute` | `createTimeAbsoluteCondition(time)` | クロックが `time` に達する | はい。インストラクションがチェックするたびに | 47 |
| `TimeRelative` | `createTimeRelativeCondition(bucket, bucketTime, timeOffset?)` | 基準バケットのイベント + `timeOffset` が経過する | いいえ。`triggerConditionsV2` 経由のみ | 14 |
| `Triggered` | `createTriggeredCondition()` | プログラムが発火させる（グラデュエーション、ボンディングカーブの完売、Presaleの完売） | イベントを引き起こしたインストラクションが発火させる | 55 |
| `TriggeredWithExpiry` | `createTriggeredWithExpiryCondition(expiryTime)` | プログラムによるトリガーまたは `expiryTime` のいずれか早い方 | はい。`expiryTime` の経過後 | 47 |
| `Never` | `createNeverCondition()` | 満たされない | 該当なし | 55 |
| `Always` | なし。手作業で構築 | 常に満たされる | 該当なし。タイムスタンプは記録しない | 55 |

```typescript {% title="conditions.ts" %}
import {
  BucketTimes,
  createNeverCondition,
  createTimeAbsoluteCondition,
  createTimeRelativeCondition,
  createTriggeredCondition,
  createTriggeredWithExpiryCondition,
} from '@metaplex-foundation/genesis';

// TimeAbsolute: { __kind, padding: Array(47), time, triggeredTimestamp: null }
const depositStart = createTimeAbsoluteCondition(1767225600n);

// TimeRelative: { __kind, bucketTime, padding: Array(14), timeOffset, bucket, triggeredTimestamp: null }
const claimStart = createTimeRelativeCondition(raydiumBucket, BucketTimes.Graduate, 0n);

// Triggered: { __kind, padding: Array(55), triggeredTimestamp: null }
const lpLockStart = createTriggeredCondition();

// TriggeredWithExpiry: { __kind, padding: Array(47), expiryTime, triggeredTimestamp: null }
const presaleEnd = createTriggeredWithExpiryCondition(1767830400n);

// Never: { __kind, padding: Array(55), triggeredTimestamp: null }
const lockedForever = createNeverCondition();

// Always (no helper)
const always = { __kind: 'Always', padding: Array(55).fill(0), triggeredTimestamp: null };
```

#### TimeRelativeのバケット時刻 {% #time-relative-bucket-times %}

`TimeRelative` 条件は、`BucketTimes` 列挙型で選択した基準バケット上の1つのイベントを基準にします。

| `BucketTimes` | 基準バケットのタイプ |
|---------------|------------------------|
| `DepositStart`, `DepositEnd` | Launch Pool、Presale |
| `ClaimStart`, `ClaimEnd` | Launch Pool、Presale、Unlocked |
| `SwapStart`, `SwapEnd` | ボンディングカーブ |
| `GraduateStart` | Raydium CPMM（その `startCondition`） |
| `Graduate` | Raydium CPMM（プール作成時に発火） |

`BucketTimes` には、ロックバケット用の `LockStart` と `LockEnd` も定義されています。基準バケットのタイプに存在しない `bucketTime` を指定すると、条件の解決時に `InvalidPrimaryBucket` を返します。

#### 条件スロット {% #condition-slots %}

バケットの各条件フィールドは一部のバリアントのみを受け付け、それ以外はプログラムが `InvalidConditionTypeForSlot` で拒否します。

| スロット | 許可されるバリアント |
|------|------------------|
| 入金開始、Unlockedの請求開始、Raydiumの `startCondition`、クレームスケジュールの `claimStartCondition` | `TimeAbsolute`、`TimeRelative`、`Always` |
| Launch PoolとPresaleの `claimStartCondition` | `TimeAbsolute`、`TimeRelative` |
| 入金終了、請求終了 | `TimeAbsolute`、`TimeRelative`、`Never` |
| Presaleの `depositEndCondition` | 終了スロットのバリアントに加えて `Triggered` と `TriggeredWithExpiry` |
| `ClaimSchedule` の開始とクリフ | `TimeAbsolute`、`TimeRelative`、`Never` |
| Raydium `lpLockSchedule` の開始とクリフ | `ClaimSchedule` のバリアントに加えて `Triggered`（グラデュエーション時に発火） |

### EndBehavior

`EndBehavior`（SDKの型は `BehaviorArgs`）は、ソースバケットに保存されるアクションで、ソースの終了後にクォートトークン、ベーストークン、価格、または失敗フラグを宛先バケットに移動します。常に `processed: false` を渡してください。処理済みの動作を渡すと `BehaviorAlreadyProcessed` を返します。

| バリアント | 宛先への効果 | 許可されるソースバケット | `padding` |
|---------|---------------------------|------------------------|-----------|
| `SendQuoteTokenPercentage` | ソースのクォート収益の `percentageBps` を送信 | Launch Pool、Presale、ボンディングカーブ | 4 |
| `SendStartPrice` | 販売の最終価格をRaydiumプールの開始価格として書き込む | Launch Pool、Presale、ボンディングカーブ | 6 |
| `BaseTokenRollover` | 残りのベーストークンの `percentageBps` を送信 | Presale、Raydium CPMM、Raydium CLMM | 4 |
| `ReallocateBaseTokensOnFailure` | 失敗時のみ：残りのベーストークンの `percentageBps` を送信 | Launch Pool、Presale、Raydium CPMM、Raydium CLMM | 4 |
| `TransmitFailure` | 失敗時のみ：宛先を失敗としてマーク | Launch Pool、Presale | 6 |
| `ReallocateBaseTokensOnCancel` | キャンセルまたは完了したベスティングバケットの未ベストの残りを送信 | クレームスケジュール | 6 |

```typescript {% title="endBehaviors.ts" %}
const endBehaviors = [
  { __kind: 'SendQuoteTokenPercentage', padding: Array(4).fill(0), destinationBucket, percentageBps: 8_000, processed: false },
  { __kind: 'SendStartPrice', padding: Array(6).fill(0), destinationBucket, processed: false },
  { __kind: 'BaseTokenRollover', padding: Array(4).fill(0), destinationBucket, percentageBps: 10_000, processed: false },
  { __kind: 'ReallocateBaseTokensOnFailure', padding: Array(4).fill(0), destinationBucket, percentageBps: 10_000, processed: false },
  { __kind: 'TransmitFailure', padding: Array(6).fill(0), destinationBucket, processed: false },
  { __kind: 'ReallocateBaseTokensOnCancel', padding: Array(6).fill(0), destinationBucket, processed: false },
];
```

`percentageBps` はベーシスポイントを使用し、`10_000` が100%です。入金が `minimumQuoteTokenThreshold` を下回って終了したLaunch PoolまたはPresaleは、失敗時の動作（`ReallocateBaseTokensOnFailure`、`TransmitFailure`）のみを実行し、そのクォートトークンは返金のためにバケットに残ります。Raydium CPMMバケットを宛先とする `TransmitFailure` は、そのバケットのグラデュエーションソースからのものでなければなりません（`TransmitFailureSourceMismatch`）。

### Raydium CPMM拡張タイプ {% #raydium-cpmm-extension-types %}

`RaydiumCpmmV2ExtensionType` は、`addRaydiumCpmmBucketV2Extensions()` と `removeRaydiumCpmmBucketV2Extensions()` でRaydium CPMMバケットの拡張を選択します。これらはファイナライズ後は拒否されます。

```typescript
enum RaydiumCpmmV2ExtensionType {
  BackendSigner,     // { signer: PublicKey }
  LpLockSchedule,    // ClaimSchedule
  CreatorFee,        // { wallet: PublicKey }
  PostponableStart,  // PostponableStart
  LpClaimAuthority,  // PublicKey
  BurnLp,            // burn all LP at graduation
}
```

---

## 定数 {% #constants %}

プログラムと、Genesisが受け付けるRaydiumアカウントの定数が `@metaplex-foundation/genesis` からエクスポートされています。

| 定数 | 値 |
|----------|-------|
| `GENESIS_PROGRAM_ID` | `GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B` |
| `WRAPPED_SOL_MINT` | `So11111111111111111111111111111111111111112` |
| `RAYDIUM_CP_SWAP_PROGRAM_ID_MAINNET` | `CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C` |
| `RAYDIUM_CP_SWAP_PROGRAM_ID_DEVNET` | `DRaycpLY18LhpbydsBWbVJtxpNv9oXPgjRSfpF2bWpYb` |
| `RAYDIUM_AMM_CONFIG_MAINNET` | `Bq9YmSkZ6f13L4rPsx9MxSXuyPfKCBbvrbvarKti1LdG` |
| `RAYDIUM_AMM_CONFIG_CREATOR_FEE_MAINNET` | `CRRS5ieQmBrZjWhcj99JuGrT5tyuWDaGAXLXLFjbAtjQ` |

---

## よくあるエラー {% #common-errors %}

Genesisプログラムのエラーは、トランザクションログとSDKがスローする `ProgramError` に、名前（と数値コード）で表示されます。

### 一般的なエラー {% #general-errors %}

| エラー | 原因 |
|-------|-------|
| `insufficient funds` | 手数料に必要なSOLが不足 |
| `already initialized` | Genesis Accountが既に存在 |
| `GenesisAccountFinalized` (43) | `finalizeV2()` の後にバケット、拡張、または動作を変更しようとした |
| `MissingFinalizeBucketAccounts` (183) | すべてのバケットを読み取り専用のremaining accountとして渡さずに `finalizeV2()` を送信した |
| `TotalSupplyNotFullyAllocated` (187) | `finalizeV2()` 時点でバケットの割り当ての合計が総供給量に一致しない |
| `base64 encoded data too large` | トランザクションが1,232バイトを超えている（例：一括版の `addLaunchPoolBucketV2`）。`Base` インストラクションと拡張・動作の設定を組み合わせて使用してください |
| `ProgramNotRecognizedError` (`splAssociatedToken`) | `.use(mplToolbox())` なしでUmiをセットアップした |
| `deposit period not active` | 入金期間外 |
| `ClaimNotStarted` (22) | 請求開始条件が満たされていない、または `TimeRelative` の請求開始がまだトリガーされていない |
| `InvalidSoftCap` (221) | 金額が0の `SoftCap` 拡張。上限を設けない場合は拡張を省略してください |
| `SoftCapBelowThreshold` (222) | `softCap.amount` が `minimumQuoteTokenThreshold.amount` を下回っています |
| `LaunchPoolNotEnded` (25) | 入金ウィンドウが閉じる前に `refundLaunchPoolV2()` または `triggerBehaviorsV2()` が呼び出された |
| `LaunchPoolThresholdMet` (173) | 下限に達し、ソフトキャップも超過していない状態で返金がリクエストされた |
| `DepositAlreadyRefunded` (177) | 同じ入金に対して `refundLaunchPoolV2()` が 2 回呼び出された |
| `RecipientMismatch` (39) | 請求の `recipient` がバケットに保存された受取人と異なる |
| `UnlockedBucketAlreadyClaimed` (51) | ベーストークンもクォートトークンも残っていない状態で `claimUnlockedV2()` を実行した |
| `NothingToClaim` (233) | ベスト済みのトークンがない状態で `claimClaimScheduleV2()` を実行した |
| `MissingBackendSigner` (145) / `InvalidBackendSigner` (69) | バケットにバックエンド署名者の拡張があるが、その署名者が共同署名していない。鍵を紛失した場合は `setBucketBackendSignerV2` でローテーションしてください |

### 条件のエラー {% #condition-errors %}

| エラー | 原因 |
|-------|-------|
| `InvalidConditionTypeForSlot` (204) | そのスロットでは許可されていない条件バリアント。[条件スロット](#condition-slots)を参照してください |
| `InvalidPrimaryBucket` (149) | `TimeRelative` の `bucketTime` が基準バケットのタイプに存在しない |
| `UninitializedCondition` (203) | 条件がゼロのまま残されている。SDKヘルパーで構築してください |
| `InvalidConditionExpiry` (232) | `TriggeredWithExpiry` の `expiryTime` が0または範囲外 |
| `ClaimScheduleConditionNotTriggered` (241) | キャンセル後の回収処理を実行する前に、クレームスケジュールの `TimeRelative` 条件をトリガーする必要がある |

### グラデュエーションと動作のエラー {% #graduation-and-behavior-errors %}

| エラー | 原因 |
|-------|-------|
| `GraduationNotStarted` (189) | Raydiumバケットの `startCondition` が満たされていない。先に `TimeRelative` の開始条件をトリガーしてください |
| `BucketLaunchFailed` (262) | Raydiumバケットの資金源である販売が失敗した（`TransmitFailure` を受け取った） |
| `BucketAlreadyGraduated` (188) | グラデュエーション後に `graduateToRaydiumCpmmV2()` または延期を呼び出した |
| `InvalidRaydiumAmmConfig` (202) | AMM設定が承認済みのRaydium設定ではない、または手数料回収インストラクションに対して誤った設定 |
| `InvalidCreatorFeeConfig` (216) | `creatorFee` 拡張とクリエイター手数料用AMM設定が一致しない |
| `InvalidPoolStatePda` (219) | `poolState` が `deriveRaydiumPDAsV2` で導出されていない |
| `NoLpTokensToClaim` (200) | グラデュエーション前のLP請求またはバーン |
| `InvalidLpClaimAuthority` (201) | LP請求またはバーンにLP claim authorityが署名していない |
| `InsufficientUnlockedAmount` (199) | アンロック済みのLPトークンがない状態でLPを請求した |
| `BurnLpConflictsWithLpLockSchedule` (263) | `burnLp: true` が `lpLockSchedule` と併用されている |
| `MissingRaydiumGraduationSource` (270) | Raydiumバケットが、ちょうど1つの `SendQuoteTokenPercentage` と1つの `SendStartPrice` の宛先になっていない |
| `DuplicateRaydiumGraduationSource` (271) | 複数の販売バケットが同じRaydiumバケットを宛先にしている |
| `RaydiumGraduationSourceMismatch` (272) | クォートトークンと開始価格が異なるソースバケットから来ている |
| `StartPriceAlreadySet` (273) | `SendStartPrice` が既に宛先の価格を書き込んでいる |
| `BehaviorNotSupportedForBucketType` (175) | そのソースバケットのタイプでは許可されていない動作バリアント |
| `BehaviorPercentageOverflow` (168) | `SendQuoteTokenPercentage`、`BaseTokenRollover`、または `ReallocateBaseTokensOnFailure` の合計が10,000 bpsを超えている |
| `ClaimScheduleMultipleCancelBehaviors` (240) | クレームスケジュールバケットに `ReallocateBaseTokensOnCancel` が複数ある |
| `BehaviorAlreadyProcessed` (247) | 動作が `processed: true` で書き込まれた |
| `InvalidRemainingAccountsLength` (198) | `triggerBehaviorsV2` のremaining accountsが（バケット、クォートトークンアカウント）のペアになっていない |
| `InvalidBucketState` (46) | グラデュエーションも失敗もしていないRaydiumバケットに対する `triggerBehaviorsV2` |
| `PostponeLimitReached` (225) – `BucketNotPostponable` (231) | ポリシーの制限外での `postponeStartRaydiumCpmmBucketV2` |

---

## 注意事項 {% #notes %}

- `TimeRelative` 条件は `triggerConditionsV2` によってのみ解決されます。グラデュエーションはRaydiumバケット自身の `graduateCondition` を発火させますが、それを参照する他のバケットの条件には影響しません。
- `triggerConditionsV2`、`triggerBehaviorsV2`、`graduateToRaydiumCpmmV2` は `assert_signer(payer)` のみを行うため、プロジェクトのバックエンド、キーパーボット、または任意のユーザーウォレットがローンチのライフサイクルを実行できます。Raydiumバケットにバックエンド署名者の拡張がある場合、グラデュエーションにはその署名者も必要です。
- 終了動作、条件、拡張は `finalizeV2` で固定されますが、例外が2つあります。`postponeStartRaydiumCpmmBucketV2` は `postponableStart` 付きで作成されたバケットのグラデュエーション開始を後ろにずらし、`setBucketBackendSignerV2` は既存のバックエンド署名者をローテーションまたはクリアします。
- Launch PoolバケットとPresaleバケットは、`add*BucketV2Base` インストラクションで作成した後、`add*BucketV2Extensions` と `set*BucketV2Behaviors` で設定してください。一括版の `addLaunchPoolBucketV2` と `addPresaleBucketV2` インストラクションは、Solanaのトランザクション上限である1,232バイトを超えます。
- このページのすべてのサンプルは、タイミングウィンドウを短縮し金額を縮小したうえで、devnet上のGenesisプログラムに対して実行済みです。devnetでは `deriveRaydiumPDAsV2` に `{ env: 'devnet' }` を渡してください。
- Raydium CLMMグラデュエーション（`addRaydiumClmmBucketV2`、`graduateToRaydiumClmmV2`）はSDKに存在しますが、このページでは説明していません。
- `@metaplex-foundation/genesis` 0.44.0 およびデプロイ済みのGenesisプログラムリリース `genesis v0.41.0`（コミット `86eb6121`）で検証済みです。デプロイ済みのプログラムはToken-2022のベースミントをサポートしていません。ソース：[metaplex-foundation/genesis](https://github.com/metaplex-foundation/genesis)。Metaplex Foundationが管理しています。最終検証日：2026-11-24。

---

## クイックリファレンス {% #quick-reference %}

| 項目 | 値 |
|------|-------|
| プログラム | `GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B` |
| JS SDK | `@metaplex-foundation/genesis`（0.44.0で検証済み） |
| フレームワーク | Umi（`@metaplex-foundation/umi`） |
| Raydium CP-Swap（mainnet） | `CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C` |
| パーミッションレスなクランク | `triggerConditionsV2`、`triggerBehaviorsV2`、`graduateToRaydiumCpmmV2` |
| ソース | [GitHub](https://github.com/metaplex-foundation/genesis) |

---

## FAQ

### Umiとは何ですか？なぜ必要ですか？
UmiはMetaplexのSolana向けJavaScriptフレームワークです。トランザクションの構築、署名者の管理、Metaplexプログラムとのやり取りに一貫したインターフェースを提供します。

### Genesis SDKをブラウザで使用できますか？
はい。SDKはNode.jsとブラウザの両方の環境で動作します。ブラウザでは、キーペアファイルの代わりにウォレットアダプターを使用して署名を行います。

### fetchとsafeFetchの違いは何ですか？
`fetch`はアカウントが存在しない場合にエラーをスローします。`safeFetch`は代わりに`null`を返すため、アカウントの存在確認に便利です。

### トークンのローンチタイプを取得するにはどうすればいいですか？
トークンのミントアドレスを使用して`fetchGenesisAccountV2FromSeeds()`で`GenesisAccountV2`アカウントを取得します。`launchType`フィールドは`0`（Uninitialized）または`3`（LaunchPoolV1）を返します。特定のタイプの全ローンチを照会するには、[GPAビルダー](#gpa-builder-query-by-launch-type)を使用します。または、[Metaplex API](/ja/api)がREST応答で文字列としてローンチタイプを返します。

### どのGenesisインストラクションを任意のウォレットから呼び出せますか？
`triggerConditionsV2`、`triggerBehaviorsV2`、`graduateToRaydiumCpmmV2`、`collectRaydiumCpmmFeesV2`、`collectRaydiumCpmmFeesWithCreatorFeeV2`、`claimRaydiumCreatorFeeV2`、`claimUnlockedV2`、`claimClaimScheduleV2` は手数料支払者の署名のみを必要とします。資金は常にバケットに保存されたアドレスに送られます。バケットにバックエンド署名者の拡張がある場合は、その署名者もグラデュエーションと請求に共同署名する必要があります。

### Raydiumグラデュエーション後も請求が失敗するのはなぜですか？
Raydiumバケットの `Graduate` 時刻を基準とする `TimeRelative` の請求条件は、グラデュエーションでも請求自体でも解決されません。依存する各バケットに対して [triggerConditionsV2](#trigger-conditions-v2) を呼び出し、Raydium CPMMバケットを書き込み可能なremaining accountとして渡してください。

### トランザクションエラーはどのように処理しますか？
`sendAndConfirm`の呼び出しを try/catch ブロックで囲み、エラー名を[よくあるエラー](#common-errors)の表と照合します。よくあるエラーには、残高不足、ファイナライズ済みのアカウント、未トリガーの条件、開始前のグラデュエーションなどがあります。

---

## 次のステップ {% #next-steps %}

完全な実装チュートリアルについて：

- [はじめに](/ja/smart-contracts/genesis/getting-started) - セットアップと初回ローンチ
- [Launch Pool](/ja/smart-contracts/genesis/launch-pool) - 比例配分
- [Presale](/ja/smart-contracts/genesis/presale) - 固定価格販売
- [Project Vesting](/ja/smart-contracts/genesis/project-vesting) - クレームスケジュールバケット
- [Locked LP Tokens](/ja/smart-contracts/genesis/locked-lp-tokens) - Raydium LPロックの検証
- [Creator Fees](/ja/smart-contracts/genesis/creator-fees) - クリエイター手数料の回収と請求
