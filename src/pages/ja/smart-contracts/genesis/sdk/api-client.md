---
title: API クライアント
metaTitle: API クライアント | Genesis SDK | Metaplex
description: Genesis API クライアントを使用して、Solana 上でトークンローンチの作成と登録を行います。シンプルからフルコントロールまで3つの統合モードを提供します。
created: '02-19-2026'
updated: '10-12-2026'
keywords:
  - Genesis API client
  - token launch SDK
  - createLaunch
  - registerLaunch
  - createAndRegisterLaunch
  - claimCreatorRewards
  - creator rewards
about:
  - SDK API client
  - Token launch creation
  - Launch registration
  - Creator rewards claiming
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
---

Genesis API クライアントは、トークンローンチの作成と登録のための高レベルな関数を提供します。Umi 上に構築されたシンプルなインターフェースを通じて、トランザクションの構築、署名、オンチェーン登録を処理します。 {% .lead %}

{% callout type="note" %}
Genesis プログラムの全機能セットは [metaplex.com](https://www.metaplex.com) ではまだサポートされていないため、プログラムによるローンチの作成には SDK の使用を推奨します。API を通じて作成されたメインネットのローンチは、登録後に metaplex.com に表示されます。
{% /callout %}

## インストール

```bash
npm install @metaplex-foundation/genesis @metaplex-foundation/umi \
  @metaplex-foundation/umi-bundle-defaults
```

## セットアップ

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { genesis } from '@metaplex-foundation/genesis';
import { keypairIdentity } from '@metaplex-foundation/umi';

const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(genesis());

// For server-side or scripts, load a keypair
umi.use(keypairIdentity(myKeypair));
```

## 関数の概要 {% #function-overview %}

| 関数 | 目的 |
|----------|---------|
| [`createAndRegisterLaunch`](#easy-mode-create-and-register-launch) | 1回の呼び出しでトークンをローンチ — 作成、署名、送信、登録 |
| [`createLaunch`](#full-control-create-launch-register-launch) | カスタム署名フロー向けに未署名のローンチトランザクションを構築 |
| [`registerLaunch`](#full-control-create-launch-register-launch) | 作成トランザクションがオンチェーンで確認された後にローンチを登録 |
| [`claimCreatorRewards`](#claim-creator-rewards) | ウォレットのすべてのバケットで発生したクリエイター報酬を請求 |

## 3つの統合モード

SDK はローンチ作成のために、完全自動から完全手動まで3つのモードを提供します。

### イージーモード — `createAndRegisterLaunch` {% #easy-mode-create-and-register-launch %}

最もシンプルなアプローチです。1回の関数呼び出しですべてを処理します：オンチェーンアカウントの作成、Umi を介したトランザクションの署名と送信、そしてローンチの登録を行います。

{% code-tabs-imported from="genesis/api_easy_mode" frameworks="umi" filename="createAndRegisterLaunch" /%}

**戻り値 `CreateAndRegisterLaunchResult`：**

| フィールド | 型 | 説明 |
|-------|------|-------------|
| `signatures` | `Uint8Array[]` | トランザクション署名 |
| `mintAddress` | `string` | 作成されたトークンミントアドレス |
| `genesisAccount` | `string` | Genesis アカウント PDA アドレス |
| `launch.id` | `string` | ローンチ ID |
| `launch.link` | `string` | ローンチページ URL |
| `token.id` | `string` | トークン ID |
| `token.mintAddress` | `string` | トークンミントアドレス |

### ミディアムモード — カスタムトランザクション送信

マルチシグウォレットやカスタムリトライロジックなどのシナリオに対応するため、`createAndRegisterLaunch` にカスタム `txSender` コールバックを指定して使用します。

{% code-tabs-imported from="genesis/api_custom_sender" frameworks="umi" filename="customTxSender" /%}

`txSender` コールバックは未署名トランザクションの配列を受け取り、署名の配列を返す必要があります。コールバック完了後、SDK が登録処理を行います。

### フルコントロール — `createLaunch` + `registerLaunch` {% #full-control-create-launch-register-launch %}

トランザクションライフサイクルを完全に制御するモードです。`createLaunch` を呼び出して未署名トランザクションを取得し、署名と送信を自分で行った後、`registerLaunch` を呼び出します。

{% code-tabs-imported from="genesis/api_full_control" frameworks="umi" filename="fullControl" /%}

**`createLaunch` の戻り値 `CreateLaunchResponse`：**

| フィールド | 型 | 説明 |
|-------|------|-------------|
| `transactions` | `Transaction[]` | 署名して送信する未署名の Umi トランザクション |
| `blockhash` | `BlockhashWithExpiryBlockHeight` | トランザクション確認用のブロックハッシュ |
| `mintAddress` | `string` | 作成されたトークンミントアドレス |
| `genesisAccount` | `string` | Genesis アカウント PDA アドレス |

**`registerLaunch` の戻り値 `RegisterLaunchResponse`：**

| フィールド | 型 | 説明 |
|-------|------|-------------|
| `existing` | `boolean?` | ローンチが既に登録されている場合は `true` |
| `launch.id` | `string` | ローンチ ID |
| `launch.link` | `string` | ローンチページ URL |
| `token.id` | `string` | トークン ID |
| `token.mintAddress` | `string` | トークンミントアドレス |

{% callout type="warning" %}
`registerLaunch` を呼び出す前に、トランザクションがオンチェーンで確認されている必要があります。登録エンドポイントは、Genesis アカウントが存在し、期待される設定と一致することを検証します。
{% /callout %}

---

## クリエイター報酬の請求 {% #claim-creator-rewards %}

`claimCreatorRewards` は `POST /v1/creator-rewards/claim` を呼び出し、請求可能なすべてのボンディングカーブおよび Raydium バケット向けの Base64 エンコード済み請求トランザクションを、Umi の `Transaction` にデシリアライズして返します。各トランザクションに Umi の identity で署名して送信してください。クリエイター手数料の設定、蓄積の確認、バケットごとの低レベル命令を含む請求フロー全体については、[Genesis ボンディングカーブのクリエイター手数料](/ja/smart-contracts/genesis/creator-fees)を参照してください。

{% code-tabs-imported from="genesis/api_claim_creator_rewards" frameworks="umi" filename="claimCreatorRewards" /%}

### ClaimCreatorRewardsInput

| フィールド | 型 | 必須 | 説明 |
|-------|------|----------|-------------|
| `wallet` | `PublicKey \| string` | はい | 請求対象のクリエイター手数料ウォレット。 |
| `network` | `SvmNetwork` | いいえ | `'solana-mainnet'`（デフォルト）または `'solana-devnet'`。API のベース URL（`https://api.metaplex.com`）と一致している必要があります |
| `payer` | `PublicKey \| string` | いいえ | 返されるトランザクションの手数料とレントを負担するウォレット。デフォルトは `wallet`。クリエイター手数料ウォレットが SOL を保有していない場合（例：エージェント PDA）に使用します。payer は返されたトランザクションに署名する必要があり、請求された SOL は引き続きクリエイター手数料ウォレットが受け取ります。 |

### ClaimCreatorRewardsResponse

| フィールド | 型 | 説明 |
|-------|------|-------------|
| `transactions` | `Transaction[]` | デシリアライズ済みの Umi トランザクション。請求するバケットごとに1つ。payer の identity で各トランザクションに署名して送信してください。 |
| `blockhash` | `BlockhashWithExpiryBlockHeight` | トランザクションの構築に使用されたブロックハッシュ。確認にはこれを使用してください。新たに取得したブロックハッシュで代用しないでください。 |

{% callout type="warning" title="報酬なしは空配列ではなく型付きエラーです" %}
ウォレットに請求できるものがない場合、API は HTTP `400` と `{"error":{"message":"No rewards available to claim"}}` を返し、SDK は `GenesisApiError` をスローします。呼び出し側はエラーをキャッチし、`err.message`（または `err.statusCode === 400`）で分岐する必要があります。`result.transactions.length === 0` には依存できません。[報酬なしのケースの処理](/ja/smart-contracts/genesis/creator-fees#handling-the-no-rewards-case)を参照してください。
{% /callout %}

{% code-tabs-imported from="genesis/api_claim_creator_rewards_errors" frameworks="umi" filename="errorHandling" /%}

---

## 設定

### CreateLaunchInput

| フィールド | 型 | 必須 | 説明 |
|-------|------|----------|-------------|
| `wallet` | `PublicKey \| string` | はい | 作成者のウォレット（トランザクションに署名） |
| `token` | `TokenMetadata` | はい | トークンメタデータ |
| `network` | `SvmNetwork` | いいえ | `'solana-mainnet'`（デフォルト）または `'solana-devnet'` |
| `quoteMint` | `QuoteMintInput` | いいえ | `'SOL'`（デフォルト）または `'USDC'` |
| `launchType` | `CreateLaunchType` | はい | `'launchpool'` — 基盤ローンチメカニズム |
| `launch` | `LaunchpoolLaunchInput` | はい | ローンチ設定 |

### TokenMetadata

| フィールド | 型 | 必須 | 説明 |
|-------|------|----------|-------------|
| `name` | `string` | はい | トークン名、1〜32文字 |
| `symbol` | `string` | はい | トークンシンボル、1〜10文字 |
| `image` | `string` | はい | 画像 URL（有効な HTTPS URL） |
| `description` | `string` | いいえ | 最大250文字 |
| `externalLinks` | `ExternalLinks` | いいえ | ウェブサイト、Twitter、Telegram のリンク |

### ExternalLinks

| フィールド | 型 | 説明 |
|-------|------|-------------|
| `website` | `string?` | ウェブサイト URL |
| `twitter` | `string?` | Twitter/X ハンドル（`@mytoken`）またはフル URL |
| `telegram` | `string?` | Telegram ハンドルまたはフル URL |

### LaunchpoolConfig

| フィールド | 型 | 説明 |
|-------|------|-------------|
| `tokenAllocation` | `number` | 販売するトークン数（総供給量10億の一部） |
| `depositStartTime` | `Date \| string` | 入金期間の開始時刻（48時間継続） |
| `raiseGoal` | `number` | 最低調達目標（整数単位、例：250 SOL）。最低 250 SOL または 5,000 USDC |
| `raydiumLiquidityBps` | `number` | Raydium LP に使用する調達資金の割合（ベーシスポイント、2000〜10000） |
| `fundsRecipient` | `PublicKey \| string` | ロック解除された調達資金の受取先 |
| `softCap` | `number?` | 調達するクォートトークンの任意の上限（整数単位）。これを超える入金は按分で返金されます。0 より大きい必要があります。上限なしの場合は省略 |

### ClaimScheduleAllocation（ベスティングロック）

`ClaimScheduleAllocation` は、トークン供給量の一部に対する Genesis ネイティブのベスティングロックを定義し、`launch.claimScheduleAllocations` で渡します。各アロケーションはオンチェーンの `ClaimScheduleBucketV2` になります。トークンはオプションのクリフを持つ線形カーブに沿って累積され、SDK は以下の人間が読みやすいスケジュールをオンチェーンの秒数とベーシスポイントの値に変換します。

| フィールド | 型 | 必須 | 説明 |
|-------|------|----------|-------------|
| `name` | `string` | はい | ロック名、最大64文字（例："Team"、"Advisors"） |
| `recipient` | `PublicKey \| string` | はい | ベスティング済みトークンを請求できるウォレット |
| `tokenAmount` | `number` | はい | ベスティングスケジュールの総トークン数 |
| `vestingStartTime` | `Date \| string` | はい | 線形ベスティングカーブの累積開始時刻 |
| `vestingDuration` | `{ value: number, unit: TimeUnit }` | はい | 線形ベスティング期間の長さ |
| `unlockSchedule` | `TimeUnit` | はい | トークンがアンロックされる頻度 |
| `cliff` | `{ duration, unlockAmount? }` | いいえ | オプションのクリフ。`duration` は `vestingStartTime` からの期間、`unlockAmount` はトークン数、または比例配分を表す `'linear'`（デフォルト） |
| `cancelable` | `boolean` | いいえ | ローンチ作成者がロックをキャンセルできます。デフォルトは `false` |
| `cancelableByRecipient` | `boolean` | いいえ | 受取人がロックをキャンセルできます。デフォルトは `false` |
| `transferable` | `boolean` | いいえ | ローンチ作成者がロックを移転できます。デフォルトは `false` |
| `transferableByRecipient` | `boolean` | いいえ | 受取人がロックを移転できます。デフォルトは `false` |
| `pausable` | `boolean` | いいえ | Genesis の権限者がベスティングを一時停止・再開できます。デフォルトは `false` |

{% callout type="note" %}
ローンチプールでは、`vestingStartTime` がそれより前でトークンがすでに累積していても、ローンチがグラデュエートするまでベスティング済みトークンを**請求**できません。解決後のクリフ分は 0 より大きくなければなりません。
{% /callout %}

{% callout type="warning" title="lockedAllocations は非推奨です" %}
`launch.lockedAllocations`（旧 Streamflow ロックアップ）は非推奨です。SDK は引き続きこれを受け付け、各エントリをクレームスケジュールにマッピングするため、既存の連携はそのままコンパイルできます。新規の連携では `claimScheduleAllocations` を使用してください。移行時には、`cancelableBySender` を `cancelable` に、`transferableBySender` を `transferable` に名前変更してください。
{% /callout %}

**TimeUnit の値:** `'SECOND'`、`'MINUTE'`、`'HOUR'`、`'DAY'`、`'WEEK'`、`'TWO_WEEKS'`、`'MONTH'`、`'QUARTER'`、`'YEAR'`

**ベスティングロックの例：**

{% code-tabs-imported from="genesis/api_locked_allocations" frameworks="umi" filename="claimScheduleAllocations" /%}

### SignAndSendOptions

`createAndRegisterLaunch` のオプション（`RpcSendTransactionOptions` を拡張）：

| フィールド | 型 | デフォルト | 説明 |
|-------|------|---------|-------------|
| `txSender` | `(txs: Transaction[]) => Promise<Uint8Array[]>` | — | カスタムトランザクション送信コールバック |
| `commitment` | `string` | `'confirmed'` | 確認のコミットメントレベル |
| `preflightCommitment` | `string` | `'confirmed'` | プリフライトのコミットメントレベル |
| `skipPreflight` | `boolean` | `false` | プリフライトチェックをスキップ |

---

## エラーハンドリング

SDK は型ガード関数を備えた3種類のエラー型を提供します。

### GenesisApiError

API が成功以外のレスポンスを返した場合にスローされます。

```typescript
import { isGenesisApiError } from '@metaplex-foundation/genesis';

try {
  await createLaunch(umi, {}, input);
} catch (err) {
  if (isGenesisApiError(err)) {
    console.error('API error:', err.statusCode, err.responseBody);
  }
}
```

| プロパティ | 型 | 説明 |
|----------|------|-------------|
| `statusCode` | `number` | HTTP ステータスコード |
| `responseBody` | `unknown` | API からの完全なレスポンスボディ |

### GenesisApiNetworkError

fetch 呼び出しが失敗した場合（ネットワーク障害、DNS エラーなど）にスローされます。

```typescript
import { isGenesisApiNetworkError } from '@metaplex-foundation/genesis';

if (isGenesisApiNetworkError(err)) {
  console.error('Network error:', err.cause.message);
}
```

| プロパティ | 型 | 説明 |
|----------|------|-------------|
| `cause` | `Error` | 基となる fetch エラー |

### GenesisValidationError

API 呼び出し前に入力バリデーションが失敗した場合にスローされます。

```typescript
import { isGenesisValidationError } from '@metaplex-foundation/genesis';

if (isGenesisValidationError(err)) {
  console.error(`Validation failed on field "${err.field}":`, err.message);
}
```

| プロパティ | 型 | 説明 |
|----------|------|-------------|
| `field` | `string` | バリデーションに失敗した入力フィールド |

### 包括的なエラーハンドリング

{% code-tabs-imported from="genesis/api_error_handling" frameworks="umi" filename="errorHandling" /%}

---

## バリデーションルール

SDK は API に送信する前に入力を検証します：

| ルール | 制約 |
|------|-----------|
| トークン名 | 1〜32文字 |
| トークンシンボル | 1〜10文字 |
| トークン画像 | 有効な HTTPS URL |
| トークン説明 | 最大250文字 |
| トークンアロケーション | 0より大きい値 |
| 調達目標 | 0より大きい値 |
| Raydium 流動性 BPS | 2000〜10000（20%〜100%） |
| 総供給量 | 10億トークンで固定 |
| ロック付きアロケーション名 | 最大64文字 |

{% callout type="note" %}
総供給量は常に10億トークンです。SDK はローンチプール、Raydium LP、およびロック付きアロケーションを差し引いた残りとして、作成者のアロケーションを自動的に計算します。
{% /callout %}

---

## ヘルパー関数

### signAndSendLaunchTransactions

デフォルトの署名・送信動作をスタンドアロン関数として使用する場合（リトライや部分フローに便利）：

```typescript
import {
  createLaunch,
  signAndSendLaunchTransactions,
} from '@metaplex-foundation/genesis';

const createResult = await createLaunch(umi, {}, input);
const signatures = await signAndSendLaunchTransactions(umi, createResult, {
  commitment: 'confirmed',
});
```

トランザクションは順番に署名・送信されます — 各トランザクションは次のものが送信される前に確認されます。

### buildCreateLaunchPayload

入力を検証し、生の API ペイロードを構築します。高度なユースケース向けにエクスポートされています：

```typescript
import { buildCreateLaunchPayload } from '@metaplex-foundation/genesis';

const payload = buildCreateLaunchPayload(input);
// Use payload with your own HTTP client
```
