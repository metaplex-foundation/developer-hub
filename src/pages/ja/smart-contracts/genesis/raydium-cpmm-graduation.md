---
title: Raydium CPMMグラデュエーション
metaTitle: Genesis Launch PoolをRaydium CPMMにグラデュエーションする | Metaplex
description: Genesis Launch PoolまたはPresaleにRaydium CPMMバケットを追加し、終了動作で資金を供給してRaydium CP-Swapプールへグラデュエーションさせ、ロックされたLPトークンと手数料を管理する方法を解説します。
created: '10-29-2026'
updated: '11-24-2026'
keywords:
  - Raydium CPMM graduation
  - RaydiumCpmmBucketV2
  - graduateToRaydiumCpmmV2
  - addRaydiumCpmmBucketV2
  - Genesis liquidity pool
  - LP lock schedule
  - SendStartPrice
  - Raydium CP-Swap
about:
  - Raydium CPMM graduation
  - Genesis liquidity
  - LP token locking
proficiencyLevel: Advanced
programmingLanguage:
  - JavaScript
  - TypeScript
howToSteps:
  - ファイナライズ前に、開始条件、割り当て、LPロックスケジュールを指定して RaydiumCpmmBucketV2 を追加する
  - 販売バケットの SendQuoteTokenPercentage と SendStartPrice の終了動作を Raydium バケットに向ける
  - 入金期間の終了後に販売バケットで triggerBehaviorsV2 を実行する
  - graduateToRaydiumCpmmV2 を呼び出して Raydium CP-Swap プールを作成する
  - グラデュエーションを基準とする条件をトリガーし、未使用のベーストークンをロールオーバーする
howToTools:
  - Node.js
  - Umi framework
  - Genesis SDK
faqs:
  - q: graduateToRaydiumCpmmV2を呼び出せるのは誰ですか？
    a: 任意のウォレットです。グラデュエーションに必要なのは手数料支払者の署名のみで、RaydiumバケットにbackendSigner拡張がある場合はバックエンド署名者の署名も必要です。バケットの開始条件が満たされ、販売の終了動作によってクォートトークンと開始価格が届いていれば成功します。
  - q: Raydiumプールの開始価格はどのように設定されますか？
    a: SendStartPrice終了動作が、販売の最終価格をRaydiumバケットにコピーします。Launch Poolの場合、価格はLaunch Poolのベース割り当てを入金総額で割った値で、申込超過の場合はソフトキャップで割った値です。
  - q: グラデュエーション後、LPトークンはどうなりますか？
    a: LPトークンはRaydiumバケット署名者PDAが保有します。lpLockScheduleを設定した場合は時間とともにLP claim authorityへアンロックされ、burnLpを設定した場合はグラデュエーション時にバーンされ、どちらも設定しない場合はLP claim authorityがすぐに請求できます。
  - q: Raydiumプールの作成にはどのくらいのコストがかかりますか？
    a: プールの作成には、Raydiumプールのアカウントのレントに加えて、0.15 SOLのRaydiumプール作成手数料がかかります。addRaydiumCpmmBucketV2の支払者が事前に負担するか、deferPoolCreationCostがtrueの場合はグラデュエーションの支払者が負担します。
  - q: ローンチの開始後にグラデュエーションを遅らせることはできますか？
    a: RaydiumバケットにpostponableStart拡張がある場合のみ可能です。その場合、Genesis authorityは、設定された延期回数と遅延の上限の範囲内で、予定されたグラデュエーションの少なくとも30分前にpostponeStartRaydiumCpmmBucketV2を呼び出せます。
---

Raydium CPMMバケットは、[Genesis](/ja/smart-contracts/genesis)の販売収益の一部をRaydium CP-Swapの流動性プールに変換し（このステップをグラデュエーションと呼びます）、得られたLPトークンをロック、バーン、または請求のいずれかのポリシーで保有します。 {% .lead %}

{% callout title="構築するもの" %}
このガイドでは、[Launch Pool](/ja/smart-contracts/genesis/launch-pool)のローンチに `RaydiumCpmmBucketV2` を追加し、調達したSOLの20%をそこに送り、Raydiumプールへグラデュエーションさせ、LPトークンを四半期ごとのアンロックで1年間ロックします。
{% /callout %}

## 概要 {% #summary %}

`RaydiumCpmmBucketV2` は販売バケットからクォートトークンと開始価格を受け取り、`graduateToRaydiumCpmmV2` がその価格で、対応する量のベーストークンとともにRaydium CP-Swapプールを作成します。

- 販売バケットは `SendQuoteTokenPercentage` と `SendStartPrice` の[終了動作](/ja/smart-contracts/genesis/end-behaviors)でグラデュエーションの資金を供給します
- グラデュエーションはバケットの `Graduate` 時刻を発火させるパーミッションレスなクランクで、他のバケットは[`TimeRelative` 条件](/ja/smart-contracts/genesis/conditions)でこの時刻を参照できます
- LPトークンは、スケジュールに従ってロックする、バーンする、または請求可能なままにすることができます
- Genesis V2のRaydium CPMMバケットが対象で、V1の `graduateToRaydiumCpmmV1` フローやRaydium CLMMバケットは対象外です

**ジャンプ先:** [ライフサイクル](#raydium-cpmm-graduation-lifecycle) · [バケットの追加](#adding-a-raydium-cpmm-bucket) · [資金供給](#funding-the-raydium-bucket-from-the-sale) · [グラデュエーション](#graduating-to-a-raydium-cp-swap-pool) · [LPトークン](#managing-raydium-lp-tokens) · [手数料](#collecting-raydium-pool-fees) · [リファレンス](#quick-reference)

## Raydium CPMMグラデュエーションのライフサイクル {% #raydium-cpmm-graduation-lifecycle %}

Raydium CPMMバケットは、`Initialized`、`Funded`、`Graduated`、または失敗の4つの状態を遷移します。

| ステップ | インストラクション | 実行者 | 結果 |
|------|-------------|-----|--------|
| 1. バケットの追加 | `addRaydiumCpmmBucketV2` | Genesis authority。`finalizeV2` の前 | バケットとバケット署名者PDAが作成され、プール作成コストが事前に支払われる |
| 2. バケットへの資金供給 | 販売バケットでの `triggerBehaviorsV2` | 誰でも。入金期間の終了後 | クォートトークンと開始価格が届く |
| 3. 開始条件の解決 | Raydiumバケットでの `triggerConditionsV2` | 誰でも。`TimeRelative` の開始条件の場合のみ必要 | `startCondition` が解決される |
| 4. グラデュエーション | `graduateToRaydiumCpmmV2` | 誰でも。開始条件が満たされた後 | Raydiumプールが作成され、`Graduate` 時刻が記録される |
| 5. フォローアップ | Raydiumバケットでの `triggerBehaviorsV2`、依存するバケットでの `triggerConditionsV2` | 誰でも | 未使用のベーストークンがロールオーバーされ、グラデュエーションを基準とする請求が開始される |

{% callout type="note" %}
グラデュエーションで作成されるのはRaydium CP-Swap（CPMM）プールです。Raydium CLMMグラデュエーションは独自のインストラクションを持つ別の `RaydiumClmmBucketV2` を使用し、このページでは扱いません。
{% /callout %}

## Raydium CPMMバケットの追加 {% #adding-a-raydium-cpmm-bucket %}

`addRaydiumCpmmBucketV2` は `finalizeV2` の前にバケットを作成し、その割り当て、グラデュエーション開始、LPポリシー、終了動作を確定します。

{% code-tabs-imported from="genesis/add_raydium_cpmm_bucket_v2" frameworks="umi" filename="addRaydiumCpmmBucketV2" /%}

### Raydiumバケットの引数 {% #raydium-bucket-arguments %}

| 引数 | 必須 | 説明 |
|----------|----------|-------------|
| `baseTokenAllocation` | はい | プールが受け取れるベーストークンの最大量。販売の割り当て × ここに送る収益の割合に合わせる |
| `startCondition` | はい | グラデュエーションを実行できる最も早い時刻。開始スロット：`TimeAbsolute`、`TimeRelative`、または `Always` |
| `bucketIndex` | いいえ | PDAシード `["raydium_cpmm_v2", genesisAccount, bucketIndex]` のインデックス。デフォルトは `0` |
| `lpLockSchedule` | いいえ | LPトークンを時間とともにアンロックする `ClaimSchedule`。`burnLp` とは併用できない |
| `burnLp` | いいえ | `true` にするとグラデュエーション時にすべてのLPトークンをバーンし、流動性を恒久的にロックする |
| `lpClaimAuthority` | いいえ | LPトークンの請求またはバーンを許可されたウォレット。`null` の場合はGenesis authority |
| `creatorFee` | いいえ | Raydiumのクリエイター手数料の一部を受け取る `{ wallet }`。グラデュエーション時に使用されるAMM設定が変わる |
| `postponableStart` | いいえ | ファイナライズ後にGenesis authorityがグラデュエーションを遅らせられるようにする。`TimeAbsolute` の開始条件、または販売の `DepositEnd` か `SwapEnd` を基準とする `TimeRelative` の開始条件が必要 |
| `backendSigner` | いいえ | グラデュエーションとLPの請求またはバーンに必要な追加の共同署名者。Genesis authorityは後から `setBucketBackendSignerV2` でローテーションまたはクリアできる |
| `deferPoolCreationCost` | いいえ | `false`（デフォルト）はこの支払者からプール作成コストを事前に支払い、`true` はグラデュエーションの支払者に負担させる |
| `endBehaviors` | いいえ | 通常は、未使用のベーストークンをUnlockedバケットに送る `BaseTokenRollover` |

{% callout type="warning" %}
`finalizeV2` の前に、すべてのバケットの割り当ての合計がGenesisの総供給量と一致している必要があります。Raydiumの割り当ては、一部が後でロールオーバーされる可能性があっても、この合計に含まれます。
{% /callout %}

## 販売からのRaydiumバケットへの資金供給 {% #funding-the-raydium-bucket-from-the-sale %}

販売バケットは、2つの終了動作を通じてRaydiumバケットに資金を供給します。両方ともRaydiumバケットを宛先にする必要があり、`SendQuoteTokenPercentage` はクォートトークンを、`SendStartPrice` は価格を供給します。

{% totem %}

```typescript {% title="launchPoolEndBehaviors.ts" %}
endBehaviors: [
  {
    __kind: 'SendQuoteTokenPercentage',
    padding: Array(4).fill(0),
    destinationBucket: raydiumBucket,
    percentageBps: 2_000, // 20% of proceeds become pool liquidity
    processed: false,
  },
  {
    __kind: 'SendStartPrice',
    padding: Array(6).fill(0),
    destinationBucket: raydiumBucket,
    processed: false,
  },
  {
    __kind: 'SendQuoteTokenPercentage',
    padding: Array(4).fill(0),
    destinationBucket: treasuryBucket, // Unlocked bucket
    percentageBps: 8_000,
    processed: false,
  },
]
```

{% /totem %}

販売の入金期間が終了した後は、誰でも販売バケットで `triggerBehaviorsV2` を実行できます。各宛先バケットをそのクォートトークンアカウントとともに渡してください。Raydiumバケットのクォートアカウントは、そのバケット署名者PDAが所有します。

{% code-tabs-imported from="genesis/trigger_launch_pool_graduation_v2" frameworks="umi" filename="triggerBehaviorsV2" /%}

### Raydiumプールの開始価格 {% #raydium-pool-starting-price %}

プールは販売の最終価格で開始します。この価格は、クォートトークンあたりのベーストークン量として `priceNumerator / priceDenominator` で保存されます。

| 販売バケット | 開始価格 |
|-------------|-------------|
| Launch Pool | `baseTokenAllocation / min(quoteTokenDepositTotal, softCap)` |
| Presale | `baseTokenAllocation / allocationQuoteTokenCap` |
| ボンディングカーブ | 完売時点のカーブの現在価格 |

グラデュエーションは、`quoteTokenInSigner × priceNumerator / priceDenominator` のベーストークンをクォートトークンとペアにします。Launch Poolはデフォルトで手数料なしで収益を送付するため、販売の割り当て × ここに送る割合に合わせたRaydiumの割り当ては全量がペアになります。端数や販売バケットの手数料オーバーライドの影響などにより、グラデュエーションで使われなかったベーストークンは、[`BaseTokenRollover`](/ja/smart-contracts/genesis/end-behaviors#recovering-unused-raydium-base-tokens-with-base-token-rollover)が移動するまでGenesisに残ります。

## Raydium CP-Swapプールへのグラデュエーション {% #graduating-to-a-raydium-cp-swap-pool %}

`graduateToRaydiumCpmmV2` は、Raydium CP-Swapプールを作成し、ペアになったトークンを入金し、バケットの `Graduate` 時刻を記録します。

このインストラクションはパーミッションレスです。バケットの `startCondition` が満たされ、バケットがクォートトークンと開始価格を保持していれば、任意のウォレットが支払って実行できます。`deriveRaydiumPDAsV2` は、インストラクションに必要なすべてのRaydiumアカウントを導出します。

{% code-tabs-imported from="genesis/graduate_to_raydium_cpmm_v2" frameworks="umi" filename="graduateToRaydiumCpmmV2" /%}

{% callout type="note" %}
グラデュエーションでは、コンピュートユニットの上限を約400,000に引き上げてください。devnetでは `deriveRaydiumPDAsV2` に `{ env: 'devnet' }` を渡し、バケットに `creatorFee` 拡張がある場合は、対応するAMM設定が使われるよう `{ creatorFee: true }` を渡してください。
{% /callout %}

### グラデュエーションによるオンチェーンの変化 {% #what-graduation-changes-onchain %}

グラデュエーションはRaydiumバケットを更新し、それに依存する条件を発火させます。

- プールステートアカウントはGenesisが導出するPDA（`["raydium_pool_state", raydiumBucket]`）であるため、誰もプール作成をフロントランできません。
- `graduatedBaseTokenAmount` にはプールに投入されたベーストークンが、`lpTokenBalance` には受け取ったLPトークンが記録されます。
- `graduateCondition.triggeredTimestamp` が設定され、`TimeRelative` 条件で `BucketTimes.Graduate` を使用できるようになります。
- `lpLockSchedule` の `Triggered` 開始条件が同じタイムスタンプで発火します。

### グラデュエーション後の請求開始 {% #opening-claims-after-graduation %}

請求が `BucketTimes.Graduate` を参照するバケットは、Raydiumバケットをremaining accountとして渡して各バケットで `triggerConditionsV2` を実行した後にのみ、請求が開始されます。

{% code-tabs-imported from="genesis/trigger_conditions_after_graduation_v2" frameworks="umi" filename="triggerConditionsV2" /%}

パターンの全体については、[条件とトリガー](/ja/smart-contracts/genesis/conditions#opening-claims-at-raydium-graduation)を参照してください。

### グラデュエーションの延期 {% #postponing-graduation %}

`postponeStartRaydiumCpmmBucketV2` を使うと、Genesis authorityはグラデュエーション開始を後ろにずらせます。ただし、バケットが `postponableStart` 付きで作成されている場合に限ります。

| `postponableStart` のフィールド | 意味 |
|--------------------------|---------|
| `maxPostpones` | 延期できる最大回数 |
| `delayBudgetSeconds` | すべての延期を合わせて許可される最大の遅延 |
| `timesPostponed` | `0` を渡す。延期回数はプログラムがカウントする |

{% code-tabs-imported from="genesis/postpone_start_raydium_cpmm_bucket_v2" frameworks="umi" filename="postponeStartRaydiumCpmmBucketV2" /%}

延期は、現在予定されているグラデュエーションの少なくとも30分前に送信する必要があり（`PostponeTooLate`）、予定を後ろにずらすものでなければならず（`PostponeNotLater`）、新しいグラデュエーションを少なくとも24時間後に設定する必要があり（`PostponeTooSoon`）、遅延の上限内に収まる必要があります（`PostponeExceedsMaxDelay`）。バケットがグラデュエーション済みの場合や、その販売が失敗した場合は失敗します。

## RaydiumのLPトークンの管理 {% #managing-raydium-lp-tokens %}

グラデュエーション後、LPトークンはRaydiumバケット署名者PDAが所有するassociated token accountに保管され、バケットのLPポリシーによって、誰がいつ受け取れるかが決まります。

| ポリシー | 設定 | 結果 |
|--------|---------------|--------|
| 時間ロック | `lpLockSchedule` | LPトークンはスケジュールに従ってLP claim authorityへアンロックされる |
| 恒久ロック | 開始とクリフが `Never` の `lpLockSchedule`（`createNeverClaimSchedule()`） | LPトークンは請求できない |
| バーン | `burnLp: true` | すべてのLPトークンがグラデュエーション時にバーンされる |
| 請求可能 | どちらのオプションも設定しない | LP claim authorityがすべてのLPトークンをすぐに請求できる |

{% code-tabs-imported from="genesis/claim_raydium_cpmm_lp_tokens_v2" frameworks="umi" filename="claimRaydiumCpmmLpTokensV2" /%}

`claimRaydiumCpmmLpTokensV2` は、スケジュールでアンロック済みの量を上限として、要求された `amount` を転送します。アンロック済みの量がない場合は `InsufficientUnlockedAmount` で失敗します。このインストラクションはスケジュールの `triggeredTimestamp` の値を読み取るだけです。`Triggered` の開始条件はグラデュエーション時に発火しますが、`TimeAbsolute` または `TimeRelative` のスケジュール条件は、先にRaydiumバケットで `triggerConditionsV2` を実行する必要があります。

LP claim authorityは、ロックスケジュールに関係なく、いつでも `burnRaydiumCpmmLpTokensV2` を呼び出して未請求のLPトークンをバーンすることもできます。オンチェーンでロックを検証する方法は、[ロックされたLPトークン](/ja/smart-contracts/genesis/locked-lp-tokens)で説明しています。

## Raydiumプール手数料の回収 {% #collecting-raydium-pool-fees %}

Genesisが作成したRaydiumプールでは、クリエイター手数料がGenesis Raydium署名者に蓄積され、パーミッションレスな回収インストラクションでそれを送り出します。

| インストラクション | 使用するタイミング | 結果 |
|-------------|-------------|--------|
| `collectRaydiumCpmmFeesV2` | バケットに `creatorFee` 拡張がない | クリエイター手数料はGenesisのセカンダリ手数料ウォレットに送られる |
| `collectRaydiumCpmmFeesWithCreatorFeeV2` | バケットに `creatorFee` 拡張がある | 手数料が分割され、クリエイターの取り分はバケットに積み立てられる |
| `claimRaydiumCreatorFeeV2` | クリエイター手数料付きで回収した後 | 積み立てられたクリエイターの取り分を設定されたウォレットに支払う |

{% code-tabs-imported from="genesis/collect_raydium_cpmm_fees_v2" frameworks="umi" filename="collectRaydiumCpmmFees" /%}

`creatorFee` 拡張がある場合は、`collectRaydiumCpmmFeesWithCreatorFeeV2` で回収してから、`claimRaydiumCreatorFeeV2` でクリエイターに支払います。

{% code-tabs-imported from="genesis/collect_raydium_cpmm_fees_with_creator_fee_v2" frameworks="umi" filename="collectRaydiumCpmmFeesWithCreatorFee" /%}

どちらの回収インストラクションも、手数料が蓄積されていない場合は転送を行わずに成功します。

Launch PoolとPresaleのプールの取引手数料率は、[プロトコル手数料](/ja/smart-contracts/genesis#protocol-fees)に記載されています。

## よくあるRaydium CPMMのエラー {% #common-raydium-cpmm-errors %}

Raydium CPMMのエラーは、誤ったタイミングでのグラデュエーション、資金供給ステップの欠落、または誤った署名者によるLP操作を示します。

| エラー | 原因 | 解決策 |
|-------|-------|------------|
| `GraduationNotStarted` | `startCondition` が満たされていない | 開始時刻まで待つ。`TimeRelative` の開始条件の場合は先に `triggerConditionsV2` を実行する |
| `InvalidAmount` | バケットにクォートトークンまたは開始価格がない | 先に販売バケットで `triggerBehaviorsV2` を実行する |
| `BucketAlreadyGraduated` | プールが既に存在する | 対応は不要。フォローアップのステップに進む |
| `BucketLaunchFailed` | 販売がしきい値に達せず、失敗を伝達した | 代わりにRaydiumバケットの失敗時の動作を実行する |
| `InsufficientFunds` | バケット署名者がプール作成コストを支払えない | `deferPoolCreationCost` が `true` の場合は支払者に資金を入れる |
| `StartPriceAlreadySet` | 2つ目の販売がこのバケットに開始価格を送信した | Raydiumバケットごとに1つの販売バケットを使用する |
| `BurnLpConflictsWithLpLockSchedule` | `burnLp` と `lpLockSchedule` の両方が設定されている | LPポリシーを1つ選ぶ |
| `InsufficientUnlockedAmount` | アンロック済みのLPトークンがまだない | 次のアンロックまで待つ。先にスケジュール条件をトリガーする |
| `InvalidLpClaimAuthority` | LPの請求またはバーンに誤ったウォレットが署名した | LP claim authority（設定されていない場合はGenesis authority）で署名する |
| `MissingBackendSigner` | バケットがバックエンドの共同署名者を必要とする | 設定されたバックエンド署名者を追加する。鍵を紛失した場合は `setBucketBackendSignerV2` でローテーションする |

## クイックリファレンス {% #quick-reference %}

| 項目 | 値 |
|------|-------|
| Genesisプログラム | `GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B` |
| Raydium CP-Swap（mainnet） | `CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C` |
| Raydium CP-Swap（devnet） | `DRaycpLY18LhpbydsBWbVJtxpNv9oXPgjRSfpF2bWpYb` |
| バケットのPDAシード | `"raydium_cpmm_v2"`、Genesisアカウント、`bucketIndex`（`u8`） |
| プールステートのPDAシード | `"raydium_pool_state"`、Raydiumバケット（Genesisプログラム） |
| プール作成コスト | Raydiumアカウントのレント + 0.15 SOLのプール作成手数料 |
| グラデュエーションのコンピュート | 約400,000コンピュートユニット |
| 検証済みSDK | `@metaplex-foundation/genesis@0.44.0` |
| ソース | [metaplex-foundation/genesis](https://github.com/metaplex-foundation/genesis) |

## 注意事項 {% #notes %}

- `graduateToRaydiumCpmmV2`、`triggerBehaviorsV2`、`triggerConditionsV2`、および手数料の回収インストラクションはパーミッションレスです。キーパーまたはバックエンドから実行してください。自動的には何も実行されません。
- グラデュエーションは1回限りです。グラデュエーション済みのRaydiumバケットに送られたクォートトークンは、取り残されるのではなく拒否されます。
- 各Raydiumバケットには、ちょうど1つの販売バケットから、1つの `SendQuoteTokenPercentage` と1つの `SendStartPrice` で資金を供給してください。
- `lpLockSchedule` と `burnLp` は併用できません。
- このページのすべてのサンプルは、実際のRaydium CP-Swapプールへのグラデュエーションを含め、`@metaplex-foundation/genesis@0.44.0` を使用し、デプロイ済みのGenesisリリース `genesis v0.41.0` に対してdevnetで実行済みです。devnetでは `deriveRaydiumPDAsV2` に `{ env: 'devnet' }` を渡してください。デプロイ済みのプログラムはToken-2022のベースミントをサポートしていません。

## FAQ

### graduateToRaydiumCpmmV2を呼び出せるのは誰ですか？

任意のウォレットです。グラデュエーションに必要なのは手数料支払者の署名のみで、Raydiumバケットに `backendSigner` 拡張がある場合はバックエンド署名者の署名も必要です。バケットの開始条件が満たされ、販売の終了動作によってクォートトークンと開始価格が届いていれば成功します。

### Raydiumプールの開始価格はどのように設定されますか？

`SendStartPrice` 終了動作が、販売の最終価格をRaydiumバケットにコピーします。Launch Poolの場合、価格はLaunch Poolのベース割り当てを入金総額で割った値で、申込超過の場合はソフトキャップで割った値です。

### グラデュエーション後、LPトークンはどうなりますか？

LPトークンはRaydiumバケット署名者PDAが保有します。`lpLockSchedule` を設定した場合は時間とともにLP claim authorityへアンロックされ、`burnLp` を設定した場合はグラデュエーション時にバーンされ、どちらも設定しない場合はLP claim authorityがすぐに請求できます。

### Raydiumプールの作成にはどのくらいのコストがかかりますか？

プールの作成には、Raydiumプールのアカウントのレントに加えて、0.15 SOLのRaydiumプール作成手数料がかかります。`addRaydiumCpmmBucketV2` の支払者が事前に負担するか、`deferPoolCreationCost` が `true` の場合はグラデュエーションの支払者が負担します。

### ローンチの開始後にグラデュエーションを遅らせることはできますか？

Raydiumバケットに `postponableStart` 拡張がある場合のみ可能です。その場合、Genesis authorityは、設定された延期回数と遅延の上限の範囲内で、予定されたグラデュエーションの少なくとも30分前に `postponeStartRaydiumCpmmBucketV2` を呼び出せます。
