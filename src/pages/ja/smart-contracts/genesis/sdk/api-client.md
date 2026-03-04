---
title: API クライアント
metaTitle: API クライアント | Genesis SDK | Metaplex
description: Genesis API クライアントを使用して、Solana 上でトークンローンチの作成と登録を行います。シンプルからフルコントロールまで3つの統合モードを提供します。
created: '02-19-2026'
updated: '02-19-2026'
keywords:
  - Genesis API client
  - token launch SDK
  - createLaunch
  - registerLaunch
  - createAndRegisterLaunch
about:
  - SDK API client
  - Token launch creation
  - Launch registration
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

## 3つの統合モード

SDK はローンチ作成のために、完全自動から完全手動まで3つのモードを提供します。

### イージーモード — `createAndRegisterLaunch`

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

### フルコントロール — `createLaunch` + `registerLaunch`

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

## 設定

### CreateLaunchInput

| フィールド | 型 | 必須 | 説明 |
|-------|------|----------|-------------|
| `wallet` | `PublicKey \| string` | はい | 作成者のウォレット（トランザクションに署名） |
| `token` | `TokenMetadata` | はい | トークンメタデータ |
| `network` | `SvmNetwork` | いいえ | `'solana-mainnet'`（デフォルト）または `'solana-devnet'` |
| `quoteMint` | `QuoteMintInput` | いいえ | `'SOL'`（デフォルト）、`'USDC'`、または生のミントアドレス |
| `launchType` | `LaunchType` | はい | `'project'` |
| `launch` | `ProjectLaunchInput` | はい | ローンチ設定 |

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
| `raiseGoal` | `number` | 最低調達目標（整数単位、例：200 SOL） |
| `raydiumLiquidityBps` | `number` | Raydium LP に使用する調達資金の割合（ベーシスポイント、2000〜10000） |
| `fundsRecipient` | `PublicKey \| string` | ロック解除された調達資金の受取先 |

### LockedAllocation（Streamflow ロックアップ）

オプションのロック付きトークンスケジュールは `launch.lockedAllocations` で追加できます：

| フィールド | 型 | 説明 |
|-------|------|-------------|
| `name` | `string` | ストリーム名、最大64文字（例："Team"、"Advisors"） |
| `recipient` | `PublicKey \| string` | ロックアップの受取先ウォレット |
| `tokenAmount` | `number` | ロックスケジュールの総トークン数 |
| `vestingStartTime` | `Date \| string` | ロック解除スケジュールの開始時刻 |
| `vestingDuration` | `{ value: number, unit: TimeUnit }` | 全ロックアップ期間 |
| `unlockSchedule` | `TimeUnit` | トークンがリリースされる頻度 |
| `cliff` | `object?` | オプションのクリフ（`duration` と `unlockAmount` を含む） |

{% callout type="warning" %}
`vestingStartTime` は**入金期間終了後**（つまり `depositStartTime` + 48時間以降）でなければなりません。入金ウィンドウが閉じる前に開始するロックスケジュールは API によって拒否されます。
{% /callout %}

**TimeUnit の値:** `'SECOND'`、`'MINUTE'`、`'HOUR'`、`'DAY'`、`'WEEK'`、`'TWO_WEEKS'`、`'MONTH'`、`'QUARTER'`、`'YEAR'`

**ロック付きアロケーションの例：**

{% code-tabs-imported from="genesis/api_locked_allocations" frameworks="umi" filename="lockedAllocations" /%}

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
  await createLaunch(umi, input);
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

const createResult = await createLaunch(umi, input);
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
