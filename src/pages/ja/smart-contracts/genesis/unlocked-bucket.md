---
title: Unlockedバケット
metaTitle: GenesisのUnlockedバケット — トレジャリーとベスティングなしの割り当て | Metaplex
description: Genesis UnlockedBucketV2を使って調達したSOLを受け取り、ベスティングのないトークン割り当てを保持し、請求期間の開始後にclaimUnlockedV2で請求する方法を解説します。
created: '10-29-2026'
updated: '11-24-2026'
keywords:
  - Genesis unlocked bucket
  - UnlockedBucketV2
  - claimUnlockedV2
  - addUnlockedBucketV2
  - launch treasury
  - raised SOL withdrawal
  - team token allocation
about:
  - Genesis unlocked buckets
  - Treasury allocations
  - Token claims
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
howToSteps:
  - ファイナライズ前に、受取人、割り当て、請求期間を指定して UnlockedBucketV2 を追加する
  - 販売バケットの SendQuoteTokenPercentage 終了動作を Unlocked バケットに向ける
  - 入金期間の終了後に triggerBehaviorsV2 を実行して調達した SOL を移動する
  - 請求期間が開始したら claimUnlockedV2 を呼び出す
howToTools:
  - Node.js
  - Umi framework
  - Genesis SDK
faqs:
  - q: GenesisのUnlockedバケットとは何ですか？
    a: UnlockedBucketV2は、請求期間が開始すると、ベーストークンとクォートトークンの残高全体を1人の受取人に支払うアウトフローバケットです。入金もベスティングもありません。
  - q: クレームスケジュールバケットではなくUnlockedバケットを使うべきなのはどのような場合ですか？
    a: トレジャリー用の調達SOLやマーケットメイカーへの割り当てなど、受取人が一度に全額を受け取るべき資金にはUnlockedバケットを使用します。時間をかけてアンロックする必要があるチームや投資家のトークンにはClaimScheduleBucketV2を使用します。
  - q: claimUnlockedV2には受取人の署名が必要ですか？
    a: いいえ。任意の支払者がclaimUnlockedV2を送信できますが、トークンは常にバケットに保存された受取人に送られます。SDKは受取人のデフォルトを支払者にするため、受取人を明示的に渡してください。
  - q: Unlockedバケットから複数回請求できますか？
    a: はい。各請求はその時点の残高を一括で送るため、請求期間が開いている間は、後からロールオーバーや再割り当ての動作でクレジットされた分も再度請求できます。
  - q: Unlockedバケットから調達したSOLを請求する際に手数料はかかりますか？
    a: 請求時に、バケットの請求手数料がクォートトークンから差し引かれます。現在の料率は、Genesisの概要ページのプロトコル手数料に記載されています。
---

`UnlockedBucketV2` は、請求期間が開始するとすぐに、ベーストークンと調達したクォートトークンを含む残高全体を1人の受取人に支払う[Genesis](/ja/smart-contracts/genesis)のバケットです。 {% .lead %}

## 概要 {% #summary %}

Unlockedバケットは、任意のベーストークン割り当てを保持し、調達したSOLなどのクォートトークンを終了動作によって受け取り、請求期間中は誰でも両方の残高を受取人へ一括で送ることができます。

- 1つのバケットにつき受取人は1人で、ベスティングカーブはありません
- 販売の収益、ロールオーバーされたRaydiumのトークン、失敗した販売から再割り当てされたトークンの一般的な宛先です
- `claimUnlockedV2` はパーミッションレスで繰り返し実行できますが、常に保存された受取人に支払います
- トークンをベスティングする必要がある場合は、代わりに[クレームスケジュールバケット](/ja/smart-contracts/genesis/project-vesting)を使用してください

**ジャンプ先:** [使用する場面](#when-to-use-an-unlocked-bucket) · [追加](#adding-an-unlocked-bucket) · [資金供給](#funding-an-unlocked-bucket) · [請求](#claiming-from-an-unlocked-bucket) · [エラー](#common-unlocked-bucket-errors)

## Unlockedバケットを使用する場面 {% #when-to-use-an-unlocked-bucket %}

Unlockedバケットは、受取人が時間をかけてではなく、ある一時点で全額を受け取るべきあらゆる割り当てに適しています。

| ユースケース | バケット | 理由 |
|----------|--------|-----|
| プロジェクトのトレジャリー用の調達SOL | `UnlockedBucketV2` | `SendQuoteTokenPercentage` の収益を受け取り、1回の請求で支払う |
| マーケットメイカーや取引所の在庫 | `UnlockedBucketV2` | クリフなしで上場時にトークンが必要 |
| 未使用のRaydiumベーストークンの宛先 | `UnlockedBucketV2` | グラデュエーション後に `BaseTokenRollover` のクレジットを受け取る |
| 失敗した販売の売れ残りトークンの宛先 | `UnlockedBucketV2` | `ReallocateBaseTokensOnFailure` のクレジットを受け取る |
| チーム、アドバイザー、投資家のトークン | [`ClaimScheduleBucketV2`](/ja/smart-contracts/genesis/project-vesting) | クリフと線形アンロックが必要 |
| Launch Poolでの入金者のベスティング | Launch Poolの `claimSchedule` 拡張 | 各入金者自身のトークンをベスティングする |

## Unlockedバケットの追加 {% #adding-an-unlocked-bucket %}

`addUnlockedBucketV2` は、`finalizeV2` の前に、受取人、ベーストークン割り当て、請求期間を指定してバケットを作成します。

{% code-tabs-imported from="genesis/add_unlocked_treasury_bucket_v2" frameworks="umi" filename="addUnlockedBucket" /%}

| 引数 | 説明 |
|----------|-------------|
| `recipient` | すべての請求を受け取るウォレット |
| `baseTokenAllocation` | 総供給量から確保するベーストークン。クォートトークンのみを受け取るバケットでは `0n` |
| `claimStartCondition` | 請求が開始するタイミング。開始スロット：`TimeAbsolute`、`TimeRelative`、または `Always` |
| `claimEndCondition` | 請求が終了するタイミング。`TimeAbsolute`、`TimeRelative`、または `Never` |
| `backendSigner` | すべての請求で必要となる任意の共同署名者。Genesis authorityは後から `setBucketBackendSignerV2` でローテーションまたはクリアできる |
| `bucketIndex` | PDAシード `["unlocked_v2", genesisAccount, bucketIndex]`。デフォルトは `0` |

{% callout type="warning" %}
`BaseTokenRollover` や失敗時の再割り当てを受け取るUnlockedバケットでは、請求終了に `createNeverCondition()` を使用してください。請求期間が閉じた後にクレジットされたトークンは、二度と請求できません。
{% /callout %}

`updateUnlockedBucketV2` を使うと、`finalizeV2` の前であれば割り当てと請求条件を変更できます。Unlockedバケットは自身の終了動作を実行することはなく、常に宛先となります。

## Unlockedバケットへの資金供給 {% #funding-an-unlocked-bucket %}

Unlockedバケットは自身のベーストークン割り当てから始まり、それ以外のすべてを他のバケットの[終了動作](/ja/smart-contracts/genesis/end-behaviors)から受け取ります。

| クレジット | ソースバケットの動作 | 一般的なタイミング |
|--------|------------------------|----------------|
| 調達したクォートトークン | Launch Pool、Presale、またはボンディングカーブ上の `SendQuoteTokenPercentage` | 入金期間の終了後 |
| 未使用のRaydiumベーストークン | Raydium CPMMバケット上の `BaseTokenRollover` | グラデュエーション後 |
| 失敗時の売れ残りベーストークン | 販売バケットまたはRaydiumバケット上の `ReallocateBaseTokensOnFailure` | 販売の失敗後 |
| 未ベストのトークン | クレームスケジュールバケット上の `ReallocateBaseTokensOnCancel` | キャンセル後 |

Unlockedバケットとそのクォートトークンアカウントを、remaining accountのペアとして `triggerBehaviorsV2` に渡してください。クォートトークンアカウントは、バケットが所有するクォートミントの[associated token account](/ja/solana/understanding-solana-accounts#associated-token-accounts-atas)です。

{% code-tabs-imported from="genesis/trigger_launch_pool_graduation_v2" frameworks="umi" filename="triggerBehaviorsV2" /%}

## Unlockedバケットからの請求 {% #claiming-from-an-unlocked-bucket %}

`claimUnlockedV2` は、バケットのベーストークン残高全体と、請求手数料を差し引いたクォートトークン残高を、保存された受取人に一括で送ります。

{% code-tabs-imported from="genesis/claim_unlocked_v2" frameworks="umi" filename="claimUnlockedV2" /%}

| ルール | 詳細 |
|------|--------|
| 署名者 | 任意の手数料支払者。受取人の署名は不要 |
| 送信先 | 常に保存された `recipient`。一致しない場合は `RecipientMismatch` で失敗する |
| SDKのデフォルト | `recipient` のデフォルトは支払者のため、クランクが請求する場合は明示的に渡す |
| 期間 | 請求開始条件が満たされ、請求終了条件が満たされていないこと |
| 繰り返しの請求 | 新たに送る残高があればいつでも可能 |
| バックエンド署名者 | 設定されている場合は共同署名が必要 |

{% callout type="note" %}
請求する前に、販売バケットで `triggerBehaviorsV2` を実行してください。それまでは調達したSOLは販売バケットにあるため、請求ではベーストークンのみが支払われます。
{% /callout %}

### Raydiumグラデュエーション時の請求 {% #claiming-at-raydium-graduation %}

`BucketTimes.Graduate` を参照する `TimeRelative` の請求開始条件は、Raydiumバケットをremaining accountとして渡してUnlockedバケットで `triggerConditionsV2` を実行した後にのみ開始されます。[条件とトリガー](/ja/smart-contracts/genesis/conditions#opening-claims-at-raydium-graduation)を参照してください。

### 販売失敗後の請求 {% #claiming-after-a-failed-sale %}

Unlockedバケットを宛先とする `TransmitFailure` 動作を持つ販売が失敗すると、請求開始条件を無視して、すぐに請求が開始されます。請求終了条件は引き続き適用されます。

## よくあるUnlockedバケットのエラー {% #common-unlocked-bucket-errors %}

Unlockedバケットのエラーは、期間外の請求、誤った受取人、または送るべき残高が残っていないバケットを示します。

| エラー | 原因 | 解決策 |
|-------|-------|------------|
| `RecipientMismatch` | `recipient` がバケットに保存された受取人と異なる | バケットを取得して `bucket.recipient` を渡す |
| `UnlockedBucketAlreadyClaimed` | ベースとクォートの残高がどちらもゼロ | 新しいクレジットを待つ。何も残っていない場合もある |
| `InvalidBackendSigner` | 設定されたバックエンド署名者が共同署名していない | バックエンド署名者を追加する。鍵を紛失した場合は `setBucketBackendSignerV2` でローテーションする |
| `ClaimNotStarted` | 請求開始条件が満たされていない | 待つ。`TimeRelative` の開始条件の場合は先に `triggerConditionsV2` を実行する |
| `UnlockedBucketClaimEnded` | 請求終了条件が経過している | 後からクレジットを受け取るバケットでは `Never` の請求終了を使用する |

## 注意事項 {% #notes %}

- クォートミントがラップドSOLの場合、請求によってバケットのクォートトークンアカウントは閉じられます。再びバケットにクォートトークンを送る動作を実行する前に、ATAを作成し直してください。
- どの販売からの `TransmitFailure` でもバケットは開放されるため、バケットが待機しているグラデュエーションの販売からのみ設定してください。
- 請求手数料は[プロトコル手数料](/ja/smart-contracts/genesis#protocol-fees)に記載されています。
- サンプルは、`@metaplex-foundation/genesis@0.44.0` を使用し、デプロイ済みのGenesisプログラムリリース `genesis v0.41.0`（`GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B`）に対してdevnetで実行済みです。ソース：[metaplex-foundation/genesis](https://github.com/metaplex-foundation/genesis)。

## FAQ

### GenesisのUnlockedバケットとは何ですか？

`UnlockedBucketV2` は、請求期間が開始すると、ベーストークンとクォートトークンの残高全体を1人の受取人に支払うアウトフローバケットです。入金もベスティングもありません。

### クレームスケジュールバケットではなくUnlockedバケットを使うべきなのはどのような場合ですか？

トレジャリー用の調達SOLやマーケットメイカーへの割り当てなど、受取人が一度に全額を受け取るべき資金にはUnlockedバケットを使用します。時間をかけてアンロックする必要があるチームや投資家のトークンには `ClaimScheduleBucketV2` を使用します。

### claimUnlockedV2には受取人の署名が必要ですか？

いいえ。任意の支払者が `claimUnlockedV2` を送信できますが、トークンは常にバケットに保存された受取人に送られます。SDKは受取人のデフォルトを支払者にするため、受取人を明示的に渡してください。

### Unlockedバケットから複数回請求できますか？

はい。各請求はその時点の残高を一括で送るため、請求期間が開いている間は、後からロールオーバーや再割り当ての動作でクレジットされた分も再度請求できます。

### Unlockedバケットから調達したSOLを請求する際に手数料はかかりますか？

請求時に、バケットの請求手数料がクォートトークンから差し引かれます。現在の料率は、Genesisの概要ページの[プロトコル手数料](/ja/smart-contracts/genesis#protocol-fees)に記載されています。

## 用語集 {% #glossary %}

| 用語 | 定義 |
|------|------------|
| **UnlockedBucketV2** | 請求期間中に残高全体を1人の受取人に支払うGenesisのアウトフローバケット |
| **受取人（Recipient）** | バケットに保存され、すべての請求を受け取るウォレット |
| **請求期間（Claim window）** | 請求開始条件と請求終了条件の間の期間 |
| **スイープ（Sweep）** | バケットのその時点の残高全体を転送する請求 |
| **クォートトークン（Quote tokens）** | 入金者が支払いに使うトークン。通常はラップドSOL |
