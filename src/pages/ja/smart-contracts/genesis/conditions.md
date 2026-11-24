---
title: 条件とトリガー
metaTitle: Genesisの条件、TimeRelativeのタイミング、triggerConditionsV2 | Metaplex
description: TimeAbsolute、TimeRelative、Triggered、Never の各条件を含むGenesisバケット条件の仕組みと、パーミッションレスなクランク triggerConditionsV2 を呼び出すタイミングを解説します。
created: '10-29-2026'
updated: '11-24-2026'
keywords:
  - Genesis conditions
  - TimeRelative
  - TimeAbsolute
  - triggerConditionsV2
  - BucketTimes
  - claim start relative to graduation
  - Genesis crank
  - token launch timing
about:
  - Genesis conditions
  - Launch timing
  - Condition triggering
proficiencyLevel: Advanced
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: TimeRelative条件は自動的にトリガーされますか？
    a: いいえ。TimeAbsolute条件はインストラクションがチェックするたびに自動で更新されますが、TimeRelative条件は、誰かがその条件を持つバケットに対してtriggerConditionsV2を呼び出し、基準バケットを書き込み可能なremaining accountとして渡すまで未トリガーのままです。
  - q: triggerConditionsV2を呼び出せるのは誰ですか？
    a: 任意のウォレットです。triggerConditionsV2は手数料支払者の署名のみを必要とするため、プロジェクトのバックエンド、キーパーボット、またはユーザーのウォレットから実行できます。
  - q: クランクの実行が遅れた場合、TimeRelative条件はどのタイムスタンプを記録しますか？
    a: 条件は、クランクが実行された時刻ではなく、基準時刻にオフセットを加えた値を記録します。triggerConditionsV2の実行が遅れると、条件がオンチェーンで反映されるタイミングは遅れますが、ベスティングや請求の計算はずれません。
  - q: Raydiumプールが作成された時点で請求を開始するにはどうすればよいですか？
    a: 請求開始条件を、Raydium CPMMバケットを基準とし、バケット時刻にBucketTimes.Graduateを指定したTimeRelativeに設定します。グラデュエーション後、依存する各バケットに対して、Raydiumバケットをremaining accountとして渡してtriggerConditionsV2を呼び出してください。
  - q: ファイナライズ後にTimeRelative条件を変更できますか？
    a: いいえ。バケットの条件はfinalizeV2で固定されます。唯一の例外は、postponableStart拡張を持つRaydium CPMMのグラデュエーション開始で、Genesis authorityが設定された上限の範囲内で後ろにずらすことができます。
---

[Genesis](/ja/smart-contracts/genesis)の条件は、入金、請求、グラデュエーションなど、各バケットのフェーズがいつ開始・終了するかを決定します。`triggerConditionsV2` は、自動では解決できない条件を解決するパーミッションレスなクランクです。 {% .lead %}

## 概要 {% #summary %}

Genesisの条件は、バケットに保存される64バイトのタイミングルールで、その時点が経過すると「トリガー済み」になり、プログラムが `triggeredTimestamp` を記録します。

- `TimeAbsolute` は固定のUnixタイムスタンプで発火し、インストラクションがチェックするたびに自動で解決されます
- `TimeRelative` は別のバケットのイベントにオフセットを加えた時点で発火し、解決には `triggerConditionsV2` が必要です
- `Triggered` 条件は、Raydiumプールの作成時など、プログラムによって発火されます
- `triggerConditionsV2` は手数料支払者の署名のみを必要とするため、任意のウォレットから実行できます

**ジャンプ先:** [条件のタイプ](#genesis-condition-types) · [条件スロット](#condition-slots-by-bucket-type) · [TimeRelative](#time-relative-conditions-and-bucket-times) · [triggerConditionsV2](#resolving-conditions-with-trigger-conditions-v2) · [グラデュエーション時の請求](#opening-claims-at-raydium-graduation)

## Genesisの条件のタイプ {% #genesis-condition-types %}

Genesisは6種類の条件タイプをサポートしており、バケットの各スロットはそのうちの一部のみを受け付けます。

| タイプ | SDKヘルパー | 発火するタイミング | 自動解決 |
|------|------------|------------|-----------------|
| `TimeAbsolute` | `createTimeAbsoluteCondition(time)` | クロックが `time` に達したとき | はい。条件をチェックする任意のインストラクションで |
| `TimeRelative` | `createTimeRelativeCondition(bucket, bucketTime, offset)` | 基準バケットのイベント + `offset` が経過したとき | いいえ。`triggerConditionsV2` が必要 |
| `Triggered` | `createTriggeredCondition()` | グラデュエーションやPresaleの完売時など、プログラムが発火させたとき | イベントを引き起こしたインストラクションが発火させる |
| `TriggeredWithExpiry` | `createTriggeredWithExpiryCondition(expiry)` | プログラムによるトリガーまたは `expiryTime` のいずれか早い方 | はい。期限の経過後 |
| `Never` | `createNeverCondition()` | 発火しない | 該当なし |
| `Always` | `{ __kind: 'Always', ... }` を構築 | 常に満たされる | 該当なし。タイムスタンプは記録しない |

すべての条件は `triggeredTimestamp` オプションを持ちます。`None` は条件がまだオンチェーンで解決されていないことを意味し、`Some(t)` は発火した時刻を記録します。

{% callout type="note" %}
条件オブジェクトは手作業で構築せず、SDKヘルパーを使用してください。バリアントごとに `padding` の長さが異なり、長さを誤るとシリアライズに失敗します。
{% /callout %}

## バケットタイプ別の条件スロット {% #condition-slots-by-bucket-type %}

バケット上の各条件フィールドは「スロット」であり、スロットがサポートしない条件タイプはプログラムが `InvalidConditionTypeForSlot` で拒否します。

| スロット | 許可されるタイプ |
|------|---------------|
| 開始スロット（入金開始、Unlockedの請求開始、Raydiumのグラデュエーション開始、ベスティングの請求開始） | `TimeAbsolute`、`TimeRelative`、`Always` |
| Launch PoolとPresaleの `claimStartCondition` | `TimeAbsolute`、`TimeRelative` |
| 終了スロット（入金終了、請求終了） | `TimeAbsolute`、`TimeRelative`、`Never` |
| Presaleの `depositEndCondition` | 終了スロットのタイプに加えて `Triggered` と `TriggeredWithExpiry` |
| ボンディングカーブの `swapEndCondition` | `Triggered` のみ（完売） |
| `ClaimSchedule` の開始とクリフ | `TimeAbsolute`、`TimeRelative`、`Never` |
| Raydium `lpLockSchedule` の開始とクリフ | スケジュールのタイプに加えて `Triggered`（グラデュエーション時に発火） |
| Raydiumの `graduateCondition` | プログラムが管理する `Triggered`。プール作成時に設定される |

Raydium CPMMの `graduateCondition` は引数ではありません。プログラムはバケットの追加時にこれを `Triggered` として作成し、`graduateToRaydiumCpmmV2` の中で発火させます。これにより `BucketTimes.Graduate` を基準として使用できるようになります。

## TimeRelative条件とバケット時刻 {% #time-relative-conditions-and-bucket-times %}

`TimeRelative` 条件は、その時刻が経過すると `referenceBucket.<bucketTime>.triggeredTimestamp + timeOffset` に解決されます。

| フィールド | 型 | 意味 |
|-------|------|---------|
| `bucket` | `PublicKey` | 基準バケット。後から追加するバケットを含め、同じGenesisアカウントの任意のバケットを指定できる |
| `bucketTime` | `BucketTimes` | 基準バケット上のどのイベントを基準にするか |
| `timeOffset` | `bigint`（秒） | 基準イベントからの遅延。「同時」にする場合は `0n` を使用 |

`BucketTimes` の各値は、特定のバケットタイプ上の1つの条件に対応します。

| `BucketTimes` | 基準バケットのタイプ |
|---------------|------------------------|
| `DepositStart`, `DepositEnd` | Launch Pool、Presale |
| `ClaimStart`, `ClaimEnd` | Launch Pool、Presale、Unlocked |
| `SwapStart`, `SwapEnd` | ボンディングカーブ |
| `GraduateStart` | Raydium CPMM（グラデュエーションの `startCondition`） |
| `Graduate` | Raydium CPMM（プール作成時に発火） |

`BucketTimes` の値をこの表にないバケットタイプと組み合わせると、条件の解決時に `InvalidPrimaryBucket` で失敗します。

{% totem %}

```typescript {% title="timeRelativeConditions.ts" %}
import { BucketTimes, createTimeRelativeCondition } from '@metaplex-foundation/genesis'

const DAY = 86_400n

// Opens at the moment the Raydium pool is created
const claimStart = createTimeRelativeCondition(raydiumBucket, BucketTimes.Graduate)

// Opens 90 days after the Raydium pool is created
const cliff = createTimeRelativeCondition(raydiumBucket, BucketTimes.Graduate, 90n * DAY)

// Opens 1 hour after the Launch Pool deposit window closes
const graduationStart = createTimeRelativeCondition(launchPoolBucket, BucketTimes.DepositEnd, 3_600n)
```

{% /totem %}

{% callout type="warning" %}
`TimeRelative` 条件は、その基準イベントがオンチェーンで解決された後にのみ解決できます。基準自体が `TimeRelative` の場合は、先に基準バケットをトリガーし、その後で依存するバケットをトリガーしてください。
{% /callout %}

## triggerConditionsV2による条件の解決 {% #resolving-conditions-with-trigger-conditions-v2 %}

`triggerConditionsV2` は、1つの対象バケットのすべての条件を解決します。これには `claimSchedule` の開始やクリフなどの拡張条件も含まれます。

このインストラクションはまず、remaining accountとして渡された各基準バケットの `TimeAbsolute` 条件を解決し、次に、参照先がそれらのアカウントのいずれかに一致し、かつ時刻が経過している対象バケットの各 `TimeRelative` 条件を解決します。

| プロパティ | 値 |
|----------|-------|
| 署名者 | 手数料支払者のみ（パーミッションレス） |
| 対象 | インストラクションごとに1つのバケット（`bucket` アカウント） |
| Remaining accounts | すべての基準バケットを**書き込み可能**として、任意の順序で |
| 自己参照 | 自身のバケットを参照する条件は、そのバケットを再度渡さなくても解決される |
| 再実行 | 安全。トリガー済みの条件はスキップされる |

{% code-tabs-imported from="genesis/trigger_conditions_after_graduation_v2" frameworks="umi" filename="triggerConditionsV2" /%}

### triggerConditionsV2を呼び出すタイミング {% #when-to-call-trigger-conditions-v2 %}

`triggerConditionsV2` は、基準イベントとオフセットの両方が経過した後、かつその条件に依存するインストラクションの前に呼び出してください。

| 依存するアクション | トリガーするバケット | remaining accountとして渡すもの |
|------------------|---------------------|---------------------------|
| グラデュエーション時のLaunch Poolの請求開始 | Launch Pool | Raydium CPMMバケット |
| グラデュエーション時のUnlockedバケットの請求開始 | Unlockedバケット | Raydium CPMMバケット |
| グラデュエーション時のベスティングの請求ゲート、線形開始、またはクリフ | クレームスケジュールバケット | Raydium CPMMバケット |
| 販売終了を基準とするグラデュエーション開始 | Raydium CPMMバケット | Launch PoolまたはPresaleバケット |
| グラデュエーションを基準とする入金者のベスティング（`claimSchedule` 拡張） | Launch Pool | Raydium CPMMバケット |

各条件は、それぞれの時刻が経過した時点でのみ解決されます。グラデュエーションの90日後にクリフがあるベスティングバケットでは、請求ゲートと線形開始のためにグラデュエーション時に1回、クリフのために90日後にもう1回クランクを実行する必要があります。

{% callout type="note" %}
記録される `triggeredTimestamp` は、クランクが実行された時刻ではなく、常に基準時刻にオフセットを加えた値です。クランクが遅れると請求を開始できるタイミングは遅れますが、ベスト済みのトークン量は変わりません。
{% /callout %}

## Raydiumグラデュエーション時の請求開始 {% #opening-claims-at-raydium-graduation %}

流動性が有効になった時点で請求を開始する標準的なパターンは、Raydium CPMMバケットの `Graduate` 時刻を基準とする `TimeRelative` の請求開始条件です。

1. Raydium CPMMバケットを参照するバケットを追加する前に、`findRaydiumCpmmBucketV2Pda` でそのPDAを導出します。
2. Launch Pool、Unlocked、クレームスケジュールの各バケットの `claimStartCondition` を `createTimeRelativeCondition(raydiumBucket, BucketTimes.Graduate, offset)` に設定します。
3. `graduateToRaydiumCpmmV2` が成功した後、それらの各バケットに対して、Raydiumバケットをremaining accountとして渡して `triggerConditionsV2` を呼び出します。
4. その時点から請求が成功するようになります。

[Launch Poolライフサイクルガイド](/ja/smart-contracts/genesis/launch-pool-lifecycle)ではこのパターンをエンドツーエンドで示しており、[Raydium CPMMグラデュエーション](/ja/smart-contracts/genesis/raydium-cpmm-graduation)ではグラデュエーション自体を解説しています。

{% callout type="warning" %}
グラデュエーションが行われない場合、`Graduate` を参照する条件は解決されません。販売バケットに `TransmitFailure` の[終了動作](/ja/smart-contracts/genesis/end-behaviors#failure-handling-with-transmit-failure)を追加し、販売が失敗した場合にトークンが取り残されるのではなく、依存するバケットが開放または巻き戻されるようにしてください。
{% /callout %}

## よくある条件のエラー {% #common-condition-errors %}

条件のエラーは、スロットでサポートされていない条件タイプ、未解決の参照、または条件が満たされる前に実行されたインストラクションを示します。

| エラー | 原因 | 解決策 |
|-------|-------|------------|
| `InvalidConditionTypeForSlot` | そのスロットでは許可されていない条件タイプ | [スロットの表](#condition-slots-by-bucket-type)にあるタイプを使用する |
| `InvalidPrimaryBucket` | `bucketTime` が基準バケットのタイプに存在しない | `BucketTimes` を基準バケットのタイプに合わせる |
| `UninitializedCondition` | 条件オブジェクトがゼロのまま残されている | SDKヘルパーで条件を構築する |
| `LaunchPoolNotEnded` | 入金終了条件の前に `triggerBehaviorsV2` が実行された | 入金終了時刻まで待つ |
| `GraduationNotStarted` | Raydiumの `startCondition` が解決される前にグラデュエーションが実行された | 開始時刻まで待つか、先に `TimeRelative` の開始条件をトリガーする |

## 注意事項 {% #notes %}

- `TimeRelative` 条件は、そのバケット上の入金、請求、その他のインストラクションによって解決されることはありません。解決できるのは `triggerConditionsV2` のみです。
- `triggerConditionsV2` はインストラクションごとに1つの対象バケットを解決します。収まる場合は、複数の呼び出しを1つのトランザクションにまとめられます。
- `TimeRelative` の請求ゲート、線形開始、またはクリフがあると `updateClaimScheduleBucketV2` は無効になります。更新時にプログラムが参照先のバケットを検証できないためです。[プロジェクトベスティング](/ja/smart-contracts/genesis/project-vesting)を参照してください。
- `Always` は `triggeredTimestamp` を記録しないため、`TimeRelative` 条件の基準や `ClaimSchedule` には使用できません。
- サンプルは、`@metaplex-foundation/genesis@0.44.0` を使用し、デプロイ済みのGenesisプログラムリリース `genesis v0.41.0`（`GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B`）に対してdevnetで実行済みです。ソース：[metaplex-foundation/genesis](https://github.com/metaplex-foundation/genesis)。

## FAQ

### TimeRelative条件は自動的にトリガーされますか？

いいえ。`TimeAbsolute` 条件はインストラクションがチェックするたびに自動で更新されますが、`TimeRelative` 条件は、誰かがその条件を持つバケットに対して `triggerConditionsV2` を呼び出し、基準バケットを書き込み可能なremaining accountとして渡すまで未トリガーのままです。

### triggerConditionsV2を呼び出せるのは誰ですか？

任意のウォレットです。`triggerConditionsV2` は手数料支払者の署名のみを必要とするため、プロジェクトのバックエンド、キーパーボット、またはユーザーのウォレットから実行できます。

### クランクの実行が遅れた場合、TimeRelative条件はどのタイムスタンプを記録しますか？

条件は、クランクが実行された時刻ではなく、基準時刻にオフセットを加えた値を記録します。`triggerConditionsV2` の実行が遅れると、条件がオンチェーンで反映されるタイミングは遅れますが、ベスティングや請求の計算はずれません。

### Raydiumプールが作成された時点で請求を開始するにはどうすればよいですか？

請求開始条件を、Raydium CPMMバケットを基準とし、バケット時刻に `BucketTimes.Graduate` を指定した `TimeRelative` に設定します。グラデュエーション後、依存する各バケットに対して、Raydiumバケットをremaining accountとして渡して `triggerConditionsV2` を呼び出してください。

### ファイナライズ後にTimeRelative条件を変更できますか？

いいえ。バケットの条件は `finalizeV2` で固定されます。唯一の例外は、`postponableStart` 拡張を持つRaydium CPMMのグラデュエーション開始で、Genesis authorityが設定された上限の範囲内で後ろにずらすことができます。

## 用語集 {% #glossary %}

| 用語 | 定義 |
|------|------------|
| **条件（Condition）** | バケットに保存されるタイミングルール。満たされると `triggeredTimestamp` を記録する |
| **スロット（Slot）** | `claimStartCondition` など、バケット上の特定の条件フィールド |
| **基準バケット（Reference bucket）** | `TimeRelative` 条件が基準とするバケット |
| **BucketTimes** | `DepositEnd` や `Graduate` など、基準バケットのイベントを指定する列挙型 |
| **クランク（Crank）** | オンチェーンの状態を進めるために誰でも送信できるパーミッションレスなインストラクション |
| **Graduate時刻（Graduate time）** | `graduateToRaydiumCpmmV2` がRaydiumプールを作成した時点 |
