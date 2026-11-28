---
title: SDKによるLaunch Poolのライフサイクル
metaTitle: Raydiumグラデュエーションを含むGenesis Launch Poolの完全なライフサイクル | Metaplex
description: JavaScript SDKでGenesis Launch Poolを運用するエンドツーエンドのガイド。バケット、Raydium CPMMグラデュエーション、グラデュエーションを基準とする請求、チームのベスティング、トレジャリー、オペレーターのクランク、販売ページを扱います。
created: '10-29-2026'
updated: '11-25-2026'
keywords:
  - Genesis launch pool lifecycle
  - token launch SDK
  - Raydium graduation
  - triggerBehaviorsV2
  - triggerConditionsV2
  - launch crank
  - token sale page
  - claim after graduation
about:
  - Genesis Launch Pool
  - Raydium CPMM graduation
  - Launch operations
proficiencyLevel: Advanced
programmingLanguage:
  - JavaScript
  - TypeScript
howToSteps:
  - Genesis アカウントを初期化し、Launch Pool、Raydium CPMM、Unlocked、クレームスケジュールの各バケットを追加する
  - 終了動作とグラデュエーションを基準とする請求条件を設定し、ファイナライズする
  - 入金期間中にバケットと入金の状態を読み取る販売ページを提供する
  - クランクを実行して、動作のトリガー、Raydium へのグラデュエーション、トークンのロールオーバー、請求条件のトリガーを行う
  - 入金者、トレジャリー、チームに請求させ、LP トークンと手数料を管理する
howToTools:
  - Node.js
  - Umi framework
  - Genesis SDK
faqs:
  - q: SDKで構築したローンチでは、自分でクランクを実行する必要がありますか？
    a: はい。SDKで直接作成したローンチでは、自分でクランクを実行する前提で計画してください。クランクの各ステップ（triggerBehaviorsV2、graduateToRaydiumCpmmV2、triggerConditionsV2）はパーミッションレスで、資金のある手数料支払者のみを必要とします。
  - q: 入金期間の終了後に誰もクランクを実行しないとどうなりますか？
    a: 何も動きません。調達したSOLはLaunch Poolに残り、Raydiumプールは作成されず、グラデュエーションを基準とする請求は開始されません。入金者の資金は安全なままですが、誰かがクランクのトランザクションを送信するまでローンチは停止します。
  - q: 入金期間の終了後、ユーザーはどのくらいで請求できますか？
    a: クランクが3つのステップ（Launch PoolでのtriggerBehaviorsV2、graduateToRaydiumCpmmV2、Launch PoolでのtriggerConditionsV2）を実行した時点で請求できます。1分ごとにポーリングするクランクであれば、通常はグラデュエーション開始時刻から数分以内に完了します。
  - q: バケットの割り当ての合計は総供給量と一致する必要がありますか？
    a: はい。finalizeV2は、すべてのバケットのbaseTokenAllocationの合計がGenesisアカウントの総供給量と等しいことを要求します。
  - q: 入金者のトークンを、請求時にアンロックするのではなくベスティングさせることはできますか？
    a: はい。Launch PoolバケットにclaimSchedule拡張を追加してください。その開始条件とクリフ条件も、RaydiumのGraduate時刻を基準とするTimeRelativeにできます。
---

このガイドでは、JavaScript SDKを使って[Genesis](/ja/smart-contracts/genesis)の[Launch Pool](/ja/smart-contracts/genesis/launch-pool)を一通り実行します。バケットのセットアップから、Raydiumグラデュエーション、グラデュエーションを基準とする請求、チームのベスティング、そして各フェーズを進めるオペレーターのクランクまでを扱います。 {% .lead %}

{% callout title="構築するもの" %}
供給量の60%を3日間のLaunch Poolで販売し、調達したSOLの20%をRaydium CPMMプールに、80%をトレジャリーに送り、プールが稼働した時点ですべての請求を開始し、グラデュエーション後1年間チームのトークンをベスティングするローンチです。
{% /callout %}

{% callout title="ノーコードオプション" %}
コードを書かずにトークンをローンチするには、[Metaplexトークンローンチパッド](https://www.metaplex.com)を使用してください。Raydium流動性とベスティングを備えたローンチプールをコードから1回の呼び出しで作成するには、[Genesis APIクライアント](/ja/smart-contracts/genesis/sdk/api-client)の`createAndRegisterLaunch`を使用します。このガイドは、すべてのバケットと設定を完全に制御する必要があるローンチ向けです。
{% /callout %}

## 概要 {% #summary %}

SDKによる完全なローンチは、`finalizeV2` の前に相互に接続された4種類のバケットと、入金期間の終了後にパーミッションレスなトランザクションを送信するクランクで構成されます。

- Launch Poolがトークンを販売し、Raydium CPMMが流動性を作成し、Unlockedがトレジャリーを保持し、クレームスケジュールがチームのトークンをベスティングします
- すべての請求は、Raydiumの `Graduate` 時刻を基準とする `TimeRelative` 条件を使用します
- クランクは `triggerBehaviorsV2`、`graduateToRaydiumCpmmV2`、`triggerConditionsV2` を実行します。自動的には何も実行されません
- `@metaplex-foundation/genesis@0.44.0` を使用し、デプロイ済みのGenesisリリース `genesis v0.41.0` に対してdevnetでエンドツーエンドに実行済みです

## このガイドを使うべきケース {% #when-to-use-this-guide %}

MetaplexローンチパッドやAPIでは提供されない設定がローンチに必要な場合に、このガイドを使用してください。それ以外の場合は、[Metaplexトークンローンチパッド](https://www.metaplex.com)または[Genesis APIクライアント](/ja/smart-contracts/genesis/sdk/api-client)で、はるかに少ないコードで同等のローンチプールを作成できます。

| | Metaplexローンチパッド / Genesis APIクライアント | このガイド（Genesis SDK） |
|---|---|---|
| セットアップ | フォーム、または`createAndRegisterLaunch`の1回の呼び出し | 自分で構築・送信する約8件のトランザクション |
| metaplex.comへの掲載 | あり。ローンチは`registerLaunch`で登録されます | なし。ローンチはMetaplex APIに登録されません |
| 供給量と小数点以下桁数 | 新しいトークンはデフォルトで10億トークン、小数点以下6桁 | 任意の供給量と桁数 |
| Raydium流動性 | 調達資金の20〜100%。LPトークンは1年間ロックされ、四半期ごとにアンロック | 任意の割合、開始条件、LPポリシー |
| バケット | Launch Pool、Unlockedバケット、任意のクレームスケジュール | Genesisバケットと終了動作の任意の組み合わせ |
| 入金終了後 | Metaplexがクランクを実行します：終了動作、Raydiumへのグラデュエーション、請求条件 | 終了動作、グラデュエーション、請求を実行するクランクを自分で運用します |

## クイックスタート {% #quick-start %}

ローンチは4つのステップで行い、各ステップはコードを含むセクションにリンクしています。

1. [ローンチを設定して最終化する](#step-1-configure-and-finalize-the-launch)：トークンを初期化し、終了動作とグラデュエーションを基準とする条件を持つ4つのバケットを追加してから、最終化します。
2. [セールページを構築する](#step-2-build-the-sale-page)：入金期間中、バケットと入金の状態を読み取り、フェーズ、合計、ウォレットのポジションを表示します。
3. [ローンチクランクを実行する](#step-3-run-the-launch-crank)：入金終了後、終了動作を実行し、Raydiumへグラデュエーションし、未使用トークンをロールオーバーし、請求を開始します。すべてのトランザクションは[ランブック](#operator-crank-runbook)に記載されています。
4. [請求してローンチを完了する](#step-4-claims-and-post-launch-operations)：入金者、トレジャリー、チームが請求し、authorityがミント権限とフリーズ権限を取り消します。

**ジャンプ先:** [アーキテクチャ](#launch-architecture) · [セットアップ](#step-1-configure-and-finalize-the-launch) · [販売ページ](#step-2-build-the-sale-page) · [クランク](#step-3-run-the-launch-crank) · [ランブック](#operator-crank-runbook) · [請求](#step-4-claims-and-post-launch-operations)

## 前提条件 {% #prerequisites %}

- Node.js 18以上と、パッケージ `@metaplex-foundation/genesis`、`@metaplex-foundation/umi`、`@metaplex-foundation/umi-bundle-defaults`、`@metaplex-foundation/mpl-toolbox`
- セットアップ用の資金のあるauthorityウォレットと、資金のあるクランク用ウォレット（同じウォレットでも可）
- [Genesisのセットアップ](/ja/smart-contracts/genesis/getting-started)に関する知識

| ツール | 検証済みバージョン |
|------|----------------|
| `@metaplex-foundation/genesis` | 0.44.0 |
| `@metaplex-foundation/mpl-toolbox` | 0.12.x |
| `@metaplex-foundation/umi` | 1.x |
| Genesisプログラム | `GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B` |

## ローンチのアーキテクチャ {% #launch-architecture %}

このローンチでは、割り当ての合計が総供給量1,000,000トークンになる4つのバケットを使用します。

| バケット | タイプ | 割り当て | 受け取るもの | 請求開始 |
|--------|------|------------|----------|-------------|
| Launch Pool | `LaunchPoolBucketV2` | 600,000 | SOLの入金 | Graduate時刻 |
| Raydium CPMM | `RaydiumCpmmBucketV2` | 120,000 | SOLの20% + 開始価格 | —（プールの流動性） |
| トレジャリー | `UnlockedBucketV2` | 80,000 | SOLの80% + 未使用のRaydiumトークン | Graduate時刻 |
| チームのベスティング | `ClaimScheduleBucketV2` | 200,000 | — | Graduate時刻。+90日で10%のクリフ、1年間の月次アンロック |

```
Launch Pool ──SendQuoteTokenPercentage 20% + SendStartPrice──▶ Raydium CPMM ──graduate──▶ Raydium pool
     │                                                              │
     └──SendQuoteTokenPercentage 80%──▶ Treasury ◀──BaseTokenRollover┘

Claim starts (Launch Pool, Treasury, Team) = TimeRelative(Raydium CPMM, Graduate, offset)
```

*図：Launch Poolの終了動作は、調達したSOLの20%と開始価格をRaydium CPMMバケットに、80%をトレジャリーのUnlockedバケットに送ります。グラデュエーション後、Raydiumバケットは未使用のベーストークンをトレジャリーにロールオーバーし、すべての請求開始条件はRaydiumのGraduate時刻を参照します。*

Raydiumの割り当ては、プールに送る収益の割合に合わせて、Launch Poolの割り当て × 20%になっています。サイズの計算については[Raydium CPMMグラデュエーション](/ja/smart-contracts/genesis/raydium-cpmm-graduation#raydium-pool-starting-price)を参照してください。

## ステップ1：ローンチの設定とファイナライズ {% #step-1-configure-and-finalize-the-launch %}

セットアップスクリプトは、トークンを初期化し、バケット同士が参照し合えるよう先に4つのバケットのアドレスをすべて導出し、バケットを追加し、すべてのバケットをremaining accountとして渡してファイナライズします。

{% code-tabs-imported from="genesis/launch_pool_lifecycle_setup" frameworks="umi" filename="setupLaunch" /%}

### セットアップスクリプトにおける主要な設定の選択 {% #key-configuration-choices-in-the-setup-script %}

以下の各選択は、ローンチを安全にクランクでき、すべての割り当てを請求可能な状態に保つためのものです。

| 選択 | 理由 |
|--------|--------|
| すべての `add*` 呼び出しの前にPDAを導出する | バケットは、動作や条件の中で後から追加されるバケットを参照する |
| 3つのバケットで `claimStartCondition: atGraduation()` | 流動性が存在する前には誰も請求や売却ができない |
| Raydiumの `startCondition` = 入金終了 | 動作がSOLと価格を届けたらすぐにグラデュエーションを実行できる |
| `Triggered` のLPロック開始 | 追加のクランクなしで、ロックの時計がちょうどグラデュエーション時に始まる |
| トレジャリーの `claimEndCondition: Never` | グラデュエーション後に届くロールオーバーのトークンも請求可能なままになる |
| Raydiumバケット上の `BaseTokenRollover` | 端数など、グラデュエーションでペアにならなかったベーストークンを回収する |

{% callout type="warning" %}
`finalizeV2` は元に戻せません。実行後は、バケットの割り当て、条件、終了動作を変更できなくなります。事前にすべてのアドレス、割合、タイムスタンプを確認してください。できればdevnetでライフサイクル全体を実行して確認するのが理想です。
{% /callout %}

失敗する可能性のあるローンチでは、Launch Poolに `minimumQuoteTokenThreshold` を追加し、あわせて `ReallocateBaseTokensOnFailure` と `TransmitFailure` の動作を設定してください。これにより、失敗した販売ではトークンが返却され、グラデュエーションを基準とするバケットのブロックが解除されます。[失敗時の処理](/ja/smart-contracts/genesis/end-behaviors#failure-handling-with-transmit-failure)を参照してください。

## ステップ2：販売ページの構築 {% #step-2-build-the-sale-page %}

販売ページは、Launch Pool、Raydium、入金の各アカウントを読み取り、現在のフェーズ、合計額、接続されたウォレットのポジションを表示します。

{% code-tabs-imported from="genesis/launch_pool_sale_page_state" frameworks="umi" filename="salePageState" /%}

| 販売ページのアクション | インストラクション | ドキュメント |
|------------------|-------------|------|
| 入金前にSOLをラップする | `wrapSol` ヘルパー | [SOLのラッピング](/ja/smart-contracts/genesis/launch-pool#wrapping-sol) |
| 入金 | `depositLaunchPoolV2` | [入金](/ja/smart-contracts/genesis/launch-pool#depositing) |
| 期間中の引き出し | `withdrawLaunchPoolV2` | [引き出し](/ja/smart-contracts/genesis/launch-pool#withdrawing) |
| トークンの請求 | `claimLaunchPoolV2` | [トークンの請求](/ja/smart-contracts/genesis/launch-pool#claiming-tokens) |
| 申込超過または失敗時の返金 | `refundLaunchPoolV2` | [返金](/ja/smart-contracts/genesis/launch-pool#refunding-a-deposit) |

任意のLaunch Pool拡張で、誰が入金できるか、入金者がどのようにトークンを受け取るかを制御できます。ゲート付きの販売には `allowlist`、サーバーによる共同署名を必須にする（たとえばKYC後）には `backendSigner`、ウォレットごとの上限と下限には `depositLimit` と `minimumDepositAmount`、入金者のトークンをベスティングするには `claimSchedule` を使用します。[Launch Pool拡張](/ja/smart-contracts/genesis/launch-pool#launch-pool-extensions)を参照してください。

{% callout type="note" %}
「請求クランク待ち」を独立したフェーズとして表示してください。グラデュエーションから `triggerConditionsV2` の呼び出しまでの間、プールはRaydium上で稼働していますが `claimLaunchPoolV2` はまだ失敗するため、そうしないとユーザーはバグだと受け取ってしまいます。
{% /callout %}

## ステップ3：ローンチのクランクの実行 {% #step-3-run-the-launch-crank %}

クランクは、オンチェーンの状態を確認して次のパーミッションレスなトランザクションを送信する冪等なスクリプトであり、すべてのステップが完了するまでタイマーで実行できます。

{% code-tabs-imported from="genesis/launch_pool_lifecycle_crank" frameworks="umi" filename="crank" /%}

サーバー、スケジュールされたジョブ、またはキーパーボットから1分ごとに実行してください。資金のある任意のウォレットが支払えるため、Genesis authorityの鍵は不要です。クランクは、バケットのいずれかの条件が期限を迎えた場合にのみそのバケットに `triggerConditionsV2` を送信するため、チームのクリフまでの90日間は1分ごとに手数料を支払うことなく待機します。

## オペレーターのクランクのランブック {% #operator-crank-runbook %}

ランブックには、`finalizeV2` の後にローンチが必要とするすべてのトランザクションを、順番に、スキップした場合に何が起きるかとともに記載しています。

| # | タイミング | インストラクション | 署名者 | スキップした場合 |
|---|------|-------------|--------|-----------|
| 1 | `depositEnd` の後 | Launch Poolでの `triggerBehaviorsV2`（Raydiumとトレジャリーのペアを渡す） | 任意の支払者 | SOLも価格もRaydiumに届かず、グラデュエーションは `InvalidAmount` で失敗する。トレジャリーにSOLが入らない |
| 2 | ステップ1とRaydiumの `startCondition` の後 | `graduateToRaydiumCpmmV2` | 任意の支払者（設定されている場合はバックエンド署名者も） | プールが作成されず、グラデュエーションを基準とするすべての請求が閉じたままになる |
| 3 | ステップ2の後 | Raydiumバケットでの `triggerBehaviorsV2`（トレジャリーのペアを渡す） | 任意の支払者 | 未使用のRaydiumベーストークンがGenesisにロックされたままになる |
| 4 | ステップ2の後 | Launch Pool、トレジャリー、チームの各バケットでの `triggerConditionsV2`（それぞれRaydiumバケットをremaining accountとして渡す） | 任意の支払者 | プールが稼働していても**請求が開始されない** |
| 5 | Graduate + 90日 | チームのバケットで再度 `triggerConditionsV2` | 任意の支払者 | チームのクリフがロックされたままになる |
| 6 | 継続的 | `collectRaydiumCpmmFeesV2` または `collectRaydiumCpmmFeesWithCreatorFeeV2` | 任意の支払者 | Raydiumのクリエイター手数料が回収されずに蓄積する |

{% callout type="warning" %}
ステップ4は、チームが最も見落としやすいステップです。グラデュエーションが `Graduate` 時刻を記録するのはRaydiumバケットのみであり、`TimeRelative` 条件を持つ各バケットは個別にトリガーする必要があります。[条件とトリガー](/ja/smart-contracts/genesis/conditions#when-to-call-trigger-conditions-v2)を参照してください。
{% /callout %}

## ステップ4：請求とローンチ後の運用 {% #step-4-claims-and-post-launch-operations %}

クランクが完了したら、各当事者がそれぞれのインストラクションで請求し、Genesis authorityが残りの管理操作を行います。

| 実行者 | アクション | インストラクション | ドキュメント |
|-----|--------|-------------|------|
| 入金者 | 購入したトークンを請求する | `claimLaunchPoolV2` | [Launch Pool](/ja/smart-contracts/genesis/launch-pool#claiming-tokens) |
| トレジャリー | SOLの80%、ベース割り当て、ロールオーバー分を請求する | `claimUnlockedV2` | [Unlockedバケット](/ja/smart-contracts/genesis/unlocked-bucket#claiming-from-an-unlocked-bucket) |
| チーム | ベスト済みのトークンを請求する | `claimClaimScheduleV2` | [プロジェクトベスティング](/ja/smart-contracts/genesis/project-vesting#claim-vested-project-tokens) |
| LP claim authority | 四半期ごとにアンロック済みのLPトークンを請求する | `claimRaydiumCpmmLpTokensV2` | [RaydiumのLPトークン](/ja/smart-contracts/genesis/raydium-cpmm-graduation#managing-raydium-lp-tokens) |
| Genesis authority | ミント権限とフリーズ権限を取り消す | `revokeV2` | [JavaScript SDK](/ja/smart-contracts/genesis/sdk/javascript#revoke-v2) |

## よくあるライフサイクルのエラー {% #common-lifecycle-errors %}

ライフサイクルのエラーは通常、クランクのステップが順序どおりに実行されなかったか、バケットの設定の合計が合っていないことを意味します。

| エラー | 原因 | 解決策 |
|-------|-------|------------|
| `LaunchPoolNotEnded` | `depositEnd` の前に動作がトリガーされた | 入金期間が終了するまで待つ |
| グラデュエーション時の `InvalidAmount` | Launch Poolの動作がまだ実行されていない | 先にランブックのステップ1を実行する |
| `GraduationNotStarted` | Raydiumの `startCondition` が満たされていない | 待つか、`TimeRelative` の開始条件をトリガーする |
| `ClaimNotStarted` | グラデュエーション後に `triggerConditionsV2` が実行されていない | ランブックのステップ4を実行する |
| `RecipientMismatch` | 保存された受取人を指定せずに `claimUnlockedV2` を送信した | `recipient: bucket.recipient` を渡す |
| `TotalSupplyNotFullyAllocated` | バケットの割り当ての合計が総供給量と一致しない | `finalizeV2` の前に割り当てを計算し直す |
| `MissingFinalizeBucketAccounts` | `finalizeV2` にすべてのバケットがremaining accountとして渡されていない | すべてのバケットPDAを読み取り専用で渡す |

## 注意事項 {% #notes %}

- SDKで直接作成したローンチのクランクを、Metaplexのインフラストラクチャに頼らないでください。自分でクランクを実行し、監視してください。
- クランクのインストラクションはすべて冪等です。トランザクションが重複したり同時に実行されたりしても、失敗するか何も行わないだけで、資金が二重に移動することはありません。
- Launch Poolはデフォルトで手数料なしで収益をRaydiumとトレジャリーに送付し、トレジャリーが請求する際に請求手数料を支払います。[プロトコル手数料](/ja/smart-contracts/genesis#protocol-fees)を参照してください。
- このガイドはRaydium CPMMを対象としています。Raydium CLMMグラデュエーションは、異なるバケットとインストラクションを使用します。
- セットアップ、販売ページ、クランクのサンプルは、入金期間を短縮したうえで、`@metaplex-foundation/genesis@0.44.0` を使用し、デプロイ済みのGenesisリリース `genesis v0.41.0` に対してdevnetでエンドツーエンドに実行済みです。devnetでは `deriveRaydiumPDAsV2` に `{ env: 'devnet' }` を渡してください。デプロイ済みのプログラムはToken-2022のベースミントをサポートしていません。ソース：[metaplex-foundation/genesis](https://github.com/metaplex-foundation/genesis)。

## FAQ

### SDKで構築したローンチでは、自分でクランクを実行する必要がありますか？

はい。SDKで直接作成したローンチでは、自分でクランクを実行する前提で計画してください。クランクの各ステップ（`triggerBehaviorsV2`、`graduateToRaydiumCpmmV2`、`triggerConditionsV2`）はパーミッションレスで、資金のある手数料支払者のみを必要とします。

### 入金期間の終了後に誰もクランクを実行しないとどうなりますか？

何も動きません。調達したSOLはLaunch Poolに残り、Raydiumプールは作成されず、グラデュエーションを基準とする請求は開始されません。入金者の資金は安全なままですが、誰かがクランクのトランザクションを送信するまでローンチは停止します。

### 入金期間の終了後、ユーザーはどのくらいで請求できますか？

クランクが3つのステップ（Launch Poolでの `triggerBehaviorsV2`、`graduateToRaydiumCpmmV2`、Launch Poolでの `triggerConditionsV2`）を実行した時点で請求できます。1分ごとにポーリングするクランクであれば、通常はグラデュエーション開始時刻から数分以内に完了します。

### バケットの割り当ての合計は総供給量と一致する必要がありますか？

はい。`finalizeV2` は、すべてのバケットの `baseTokenAllocation` の合計がGenesisアカウントの総供給量と等しいことを要求します。

### 入金者のトークンを、請求時にアンロックするのではなくベスティングさせることはできますか？

はい。Launch Poolバケットに `claimSchedule` 拡張を追加してください。その開始条件とクリフ条件も、Raydiumの `Graduate` 時刻を基準とする `TimeRelative` にできます。

## 次のステップ {% #next-steps %}

- [条件とトリガー](/ja/smart-contracts/genesis/conditions) - `TimeRelative`条件と`triggerConditionsV2`の仕組み
- [終了動作](/ja/smart-contracts/genesis/end-behaviors) - 収益のルーティング、ロールオーバー、失敗時の処理
- [Raydium CPMMへのグラデュエーション](/ja/smart-contracts/genesis/raydium-cpmm-graduation) - グラデュエーションバケット、LPトークン、手数料
- [Genesis APIクライアント](/ja/smart-contracts/genesis/sdk/api-client) - 1回の呼び出しでローンチプールを作成し、metaplex.comに掲載する
