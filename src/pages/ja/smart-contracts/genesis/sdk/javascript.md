---
title: JavaScript SDK
metaTitle: JavaScript SDK | Genesis | Metaplex
description: Genesis JavaScript SDKのAPIリファレンス。Solana上でのトークンローンチに必要な関数シグネチャ、パラメータ、型の解説。
created: '01-15-2025'
updated: '03-10-2026'
keywords:
  - Genesis SDK
  - JavaScript SDK
  - TypeScript SDK
  - token launch SDK
  - Umi framework
  - Genesis API reference
about:
  - SDK installation
  - API reference
  - Genesis instructions
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
    a: トークンのミントアドレスを使用してfetchGenesisAccountV2FromSeedsでGenesisAccountV2オンチェーンアカウントを取得します。launchTypeフィールドは0（未初期化）または3（LaunchPoolV1）を返します。GPAビルダーを使用して特定のタイプの全ローンチを照会することもできます。
  - q: トランザクションエラーはどのように処理しますか？
    a: sendAndConfirmの呼び出しをtry/catchブロックで囲みます。一般的なエラーには、残高不足、既に初期化済みのアカウント、時間条件違反などがあります。
---

Genesis JavaScript SDKのAPIリファレンスです。完全なチュートリアルについては、[Launch Pool](/smart-contracts/genesis/launch-pool)または[Presale](/smart-contracts/genesis/presale)を参照してください。 {% .lead %}

{% quick-links %}

{% quick-link title="NPMパッケージ" target="_blank" icon="JavaScript" href="https://www.npmjs.com/package/@metaplex-foundation/genesis" description="@metaplex-foundation/genesis" /%}

{% quick-link title="TypeDoc" target="_blank" icon="JavaScript" href="https://mpl-genesis.typedoc.metaplex.com/" description="自動生成されたAPIドキュメント" /%}

{% /quick-links %}

## インストール

```bash
npm install @metaplex-foundation/genesis @metaplex-foundation/umi \
  @metaplex-foundation/umi-bundle-defaults @metaplex-foundation/mpl-toolbox \
  @metaplex-foundation/mpl-token-metadata
```

## セットアップ

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { genesis } from '@metaplex-foundation/genesis';
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';

const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(genesis())
  .use(mplTokenMetadata());
```

完全な実装例については、[Launch Pool](/smart-contracts/genesis/launch-pool)または[Presale](/smart-contracts/genesis/presale)を参照してください。

---

## インストラクションリファレンス

### コア

| 関数 | 説明 |
|----------|-------------|
| [initializeV2()](#initialize-v2) | Genesis Accountの作成とトークンの発行 |
| [finalizeV2()](#finalize-v2) | 設定のロックとローンチの有効化 |

### バケット

| 関数 | 説明 |
|----------|-------------|
| [addLaunchPoolBucketV2()](#add-launch-pool-bucket-v2) | 比例配分バケットの追加 |
| [addPresaleBucketV2()](#add-presale-bucket-v2) | 固定価格販売バケットの追加 |
| [addUnlockedBucketV2()](#add-unlocked-bucket-v2) | トレジャリー/受取人バケットの追加 |

### Launch Pool操作

| 関数 | 説明 |
|----------|-------------|
| [depositLaunchPoolV2()](#deposit-launch-pool-v2) | Launch PoolにSOLを入金 |
| [withdrawLaunchPoolV2()](#withdraw-launch-pool-v2) | SOLの出金（入金期間中） |
| [claimLaunchPoolV2()](#claim-launch-pool-v2) | トークンの請求（入金期間終了後） |

### Presale操作

| 関数 | 説明 |
|----------|-------------|
| [depositPresaleV2()](#deposit-presale-v2) | PresaleにSOLを入金 |
| [claimPresaleV2()](#claim-presale-v2) | トークンの請求（入金期間終了後） |

### 管理者

| 関数 | 説明 |
|----------|-------------|
| [triggerBehaviorsV2()](#trigger-behaviors-v2) | 終了動作の実行 |
| [revokeV2()](#revoke-v2) | ミントおよびフリーズ権限の永久取り消し |

---

## 関数シグネチャ

### initializeV2

```typescript
await initializeV2(umi, {
  baseMint,           // Signer - new token keypair
  quoteMint,          // PublicKey - deposit token (wSOL)
  fundingMode,        // number - use 0
  totalSupplyBaseToken, // bigint - supply with decimals
  name,               // string - token name
  symbol,             // string - token symbol
  uri,                // string - metadata URI
}).sendAndConfirm(umi);
```

### finalizeV2

```typescript
await finalizeV2(umi, {
  baseMint,           // PublicKey
  genesisAccount,     // PublicKey
}).sendAndConfirm(umi);
```

### addLaunchPoolBucketV2

```typescript
await addLaunchPoolBucketV2(umi, {
  genesisAccount,           // PublicKey
  baseMint,                 // PublicKey
  baseTokenAllocation,      // bigint - tokens for this bucket
  depositStartCondition,    // TimeCondition
  depositEndCondition,      // TimeCondition
  claimStartCondition,      // TimeCondition
  claimEndCondition,        // TimeCondition
  minimumDepositAmount,     // bigint | null
  endBehaviors,             // EndBehavior[]
}).sendAndConfirm(umi);
```

### addPresaleBucketV2

```typescript
await addPresaleBucketV2(umi, {
  genesisAccount,           // PublicKey
  baseMint,                 // PublicKey
  baseTokenAllocation,      // bigint
  allocationQuoteTokenCap,  // bigint - SOL cap (sets price)
  depositStartCondition,    // TimeCondition
  depositEndCondition,      // TimeCondition
  claimStartCondition,      // TimeCondition
  claimEndCondition,        // TimeCondition
  minimumDepositAmount,     // bigint | null
  depositLimit,             // bigint | null - max per user
  endBehaviors,             // EndBehavior[]
}).sendAndConfirm(umi);
```

### addUnlockedBucketV2

```typescript
await addUnlockedBucketV2(umi, {
  genesisAccount,       // PublicKey
  baseMint,             // PublicKey
  baseTokenAllocation,  // bigint - usually 0n
  recipient,            // PublicKey - who can claim
  claimStartCondition,  // TimeCondition
  claimEndCondition,    // TimeCondition
}).sendAndConfirm(umi);
```

### depositLaunchPoolV2

```typescript
await depositLaunchPoolV2(umi, {
  genesisAccount,     // PublicKey
  bucket,             // PublicKey
  baseMint,           // PublicKey
  amountQuoteToken,   // bigint - lamports
}).sendAndConfirm(umi);
```

### depositPresaleV2

```typescript
await depositPresaleV2(umi, {
  genesisAccount,     // PublicKey
  bucket,             // PublicKey
  baseMint,           // PublicKey
  amountQuoteToken,   // bigint - lamports
}).sendAndConfirm(umi);
```

### withdrawLaunchPoolV2

```typescript
await withdrawLaunchPoolV2(umi, {
  genesisAccount,     // PublicKey
  bucket,             // PublicKey
  baseMint,           // PublicKey
  amountQuoteToken,   // bigint - lamports
}).sendAndConfirm(umi);
```

### claimLaunchPoolV2

```typescript
await claimLaunchPoolV2(umi, {
  genesisAccount,     // PublicKey
  bucket,             // PublicKey
  baseMint,           // PublicKey
  recipient,          // PublicKey
}).sendAndConfirm(umi);
```

### claimPresaleV2

```typescript
await claimPresaleV2(umi, {
  genesisAccount,     // PublicKey
  bucket,             // PublicKey
  baseMint,           // PublicKey
  recipient,          // PublicKey
}).sendAndConfirm(umi);
```

### triggerBehaviorsV2

プライマリーbucketに設定された End Behavior を処理し、収集した資金を `endBehaviors` で指定されたデスティネーションbucketに移動します。

```typescript
await triggerBehaviorsV2(umi, {
  genesisAccount,     // PublicKey
  primaryBucket,      // PublicKey
  baseMint,           // PublicKey
})
  .addRemainingAccounts([/* destination bucket + its quote token account */])
  .sendAndConfirm(umi);
```

### revokeV2

ベーストークンのミントおよびフリーズ権限を恒久的に取り消します。

```typescript
await revokeV2(umi, {
  genesisAccount,           // PublicKey
  baseMint,                 // PublicKey
  revokeMintAuthority,      // boolean
  revokeFreezeAuthority,    // boolean
}).sendAndConfirm(umi);
```

---

## PDAヘルパー

| 関数 | シード |
|----------|-------|
| findGenesisAccountV2Pda() | `baseMint`, `genesisIndex` |
| findLaunchPoolBucketV2Pda() | `genesisAccount`, `bucketIndex` |
| findPresaleBucketV2Pda() | `genesisAccount`, `bucketIndex` |
| findUnlockedBucketV2Pda() | `genesisAccount`, `bucketIndex` |
| findLaunchPoolDepositV2Pda() | `bucket`, `recipient` |
| findPresaleDepositV2Pda() | `bucket`, `recipient` |

```typescript
const [genesisAccountPda] = findGenesisAccountV2Pda(umi, { baseMint: mint.publicKey, genesisIndex: 0 });
const [bucketPda] = findLaunchPoolBucketV2Pda(umi, { genesisAccount: genesisAccountPda, bucketIndex: 0 });
const [depositPda] = findLaunchPoolDepositV2Pda(umi, { bucket: bucketPda, recipient: wallet });
```

---

## フェッチ関数

### Genesisアカウント

Genesisアカウントは[ローンチタイプ](#launchtype)を含むトップレベルのローンチ状態を保存します。バックエンドクランクが`setLaunchTypeV2`インストラクションを介して作成後にオンチェーンで`launchType`フィールドを設定するため、クランクが処理するまで値は`Uninitialized`（0）のままの場合があります。

| 関数 | 戻り値 |
|----------|---------|
| fetchGenesisAccountV2() | Genesisアカウントの状態（存在しない場合はエラーをスロー） |
| safeFetchGenesisAccountV2() | Genesisアカウントの状態または`null` |
| fetchGenesisAccountV2FromSeeds() | PDAシード（`baseMint`、`genesisIndex`）で取得 |
| safeFetchGenesisAccountV2FromSeeds() | 上記と同じ、存在しない場合は`null`を返す |
| fetchAllGenesisAccountV2() | 複数のGenesisアカウントを一括取得 |

```typescript
import {
  fetchGenesisAccountV2,
  fetchGenesisAccountV2FromSeeds,
  findGenesisAccountV2Pda,
  LaunchType,
} from '@metaplex-foundation/genesis';

// PDAアドレスで取得
const [genesisAccountPda] = findGenesisAccountV2Pda(umi, {
  baseMint: mintAddress,
  genesisIndex: 0,
});
const account = await fetchGenesisAccountV2(umi, genesisAccountPda);
console.log(account.data.launchType); // 0 = Uninitialized, 3 = LaunchPoolV1

// シードから直接取得
const account2 = await fetchGenesisAccountV2FromSeeds(umi, {
  baseMint: mintAddress,
  genesisIndex: 0,
});

// ローンチタイプの確認
if (account2.data.launchType === LaunchType.LaunchPoolV1) {
  console.log('This is a launch pool');
}
```

**Genesisアカウントのフィールド:** `authority`, `baseMint`, `quoteMint`, `totalSupplyBaseToken`, `totalAllocatedSupplyBaseToken`, `totalProceedsQuoteToken`, `fundingMode`, `launchType`, `bucketCount`, `finalized`

### GPAビルダー — ローンチタイプで照会

`getGenesisAccountV2GpaBuilder()`を使用して、オンチェーンフィールドでフィルタリングされた全Genesisアカウントを照会します。SolanaのバイトレベルフィルターによるgetProgramAccounts RPCメソッドを使用して効率的な検索を行います。

```typescript
import {
  getGenesisAccountV2GpaBuilder,
  LaunchType,
} from '@metaplex-foundation/genesis';

// すべての Launch Pool ローンチを取得
const launchpools = await getGenesisAccountV2GpaBuilder(umi)
  .whereField('launchType', LaunchType.LaunchPoolV1)
  .getDeserialized();

// 複数フィールドでフィルタリング
const finalizedLaunchpools = await getGenesisAccountV2GpaBuilder(umi)
  .whereField('launchType', LaunchType.LaunchPoolV1)
  .whereField('finalized', true)
  .getDeserialized();

for (const account of launchpools) {
  console.log(account.publicKey, account.data.baseMint, account.data.launchType);
}
```

{% callout type="note" %}
`launchType`はローンチ作成後にバックエンドクランクによって遡及的に設定されます。最近作成されたローンチは、クランクが処理するまで`LaunchType.Uninitialized`（0）を表示する場合があります。
{% /callout %}

### バケットと入金

| 関数 | 戻り値 |
|----------|---------|
| fetchLaunchPoolBucketV2() | バケットの状態（存在しない場合はエラーをスロー） |
| safeFetchLaunchPoolBucketV2() | バケットの状態または`null` |
| fetchPresaleBucketV2() | バケットの状態（存在しない場合はエラーをスロー） |
| safeFetchPresaleBucketV2() | バケットの状態または`null` |
| fetchLaunchPoolDepositV2() | 入金の状態（存在しない場合はエラーをスロー） |
| safeFetchLaunchPoolDepositV2() | 入金の状態または`null` |
| fetchPresaleDepositV2() | 入金の状態（存在しない場合はエラーをスロー） |
| safeFetchPresaleDepositV2() | 入金の状態または`null` |

```typescript
const bucket = await fetchLaunchPoolBucketV2(umi, bucketPda);
const deposit = await safeFetchLaunchPoolDepositV2(umi, depositPda); // null if not found
```

**バケットの状態フィールド:** `quoteTokenDepositTotal`, `depositCount`, `claimCount`, `bucket.baseTokenAllocation`

**入金の状態フィールド:** `amountQuoteToken`, `claimed`

---

## 型

### LaunchType

バックエンドクランクが`setLaunchTypeV2`インストラクションを介して遡及的に設定するオンチェーンのローンチカテゴリです。

```typescript
enum LaunchType {
  Uninitialized = 0,   // クランクによってまだ設定されていない
  LaunchPoolV1 = 3,    // Launch Pool（比例配分）
}
```

[Integration APIs](/ja/smart-contracts/genesis/integration-apis)では文字列（`'launchpool'`）として返されますが、オンチェーンSDKでは上記の数値列挙型を使用します。

### GenesisAccountV2

Genesisローンチのトップレベルオンチェーンアカウントです。トークンミントごと、ローンチインデックスごとに1つのアカウントが存在します。

```typescript
{
  key: Key;
  bump: number;
  index: number;                          // Genesisインデックス（通常は0）
  finalized: boolean;                     // finalizeV2()後にtrue
  authority: PublicKey;                    // ローンチ作成者
  baseMint: PublicKey;                     // ローンチされるトークン
  quoteMint: PublicKey;                    // 入金トークン（例：wSOL）
  totalSupplyBaseToken: bigint;            // トークン総供給量
  totalAllocatedSupplyBaseToken: bigint;   // バケットに割り当てられた供給量
  totalProceedsQuoteToken: bigint;         // 収集された総入金額
  fundingMode: number;                     // ファンディングモード（0）
  launchType: number;                      // 0 = 未初期化, 3 = LaunchPoolV1
  bucketCount: number;                     // バケット数
}
```

アカウントサイズ：**136バイト**。PDAシード：`["genesis_v2", baseMint, genesisIndex]`。

### TimeCondition

```typescript
{
  __kind: 'TimeAbsolute',
  padding: Array(47).fill(0),
  time: bigint,                    // Unix timestamp (seconds)
  triggeredTimestamp: null,
}
```

### EndBehavior

```typescript
{
  __kind: 'SendQuoteTokenPercentage',
  padding: Array(4).fill(0),
  destinationBucket: PublicKey,
  percentageBps: number,           // 10000 = 100%
  processed: false,
}
```

---

## 定数

| 定数 | 値 |
|----------|-------|
| `WRAPPED_SOL_MINT` | `So11111111111111111111111111111111111111112` |

---

## よくあるエラー

| エラー | 原因 |
|-------|-------|
| `insufficient funds` | 手数料に必要なSOLが不足 |
| `already initialized` | Genesis Accountが既に存在 |
| `already finalized` | ファイナライズ後は変更不可 |
| `deposit period not active` | 入金期間外 |
| `claim period not active` | 請求期間外 |

---

## FAQ

### Umiとは何ですか？なぜ必要ですか？
UmiはMetaplexのSolana向けJavaScriptフレームワークです。トランザクションの構築、署名者の管理、Metaplexプログラムとのやり取りに一貫したインターフェースを提供します。

### Genesis SDKをブラウザで使用できますか？
はい。SDKはNode.jsとブラウザの両方の環境で動作します。ブラウザでは、キーペアファイルの代わりにウォレットアダプターを使用して署名を行います。

### fetchとsafeFetchの違いは何ですか？
`fetch`はアカウントが存在しない場合にエラーをスローします。`safeFetch`は代わりに`null`を返すため、アカウントの存在確認に便利です。

### トークンのローンチタイプを取得するにはどうすればいいですか？
トークンのミントアドレスを使用して`fetchGenesisAccountV2FromSeeds()`で`GenesisAccountV2`アカウントを取得します。`launchType`フィールドは`0`（未初期化）または`3`（LaunchPoolV1）を返します。特定のタイプの全ローンチを照会するには、[GPAビルダー](#gpaビルダー--ローンチタイプで照会)を使用します。または、[Integration APIs](/ja/smart-contracts/genesis/integration-apis)がREST応答で文字列としてローンチタイプを返します。

### トランザクションエラーはどのように処理しますか？
`sendAndConfirm`の呼び出しを try/catch ブロックで囲みます。エラーメッセージで具体的な失敗理由を確認してください。

---

## 次のステップ

完全な実装チュートリアルについて：

- [はじめに](/smart-contracts/genesis/getting-started) - セットアップと初回ローンチ
- [Launch Pool](/smart-contracts/genesis/launch-pool) - 比例配分
- [Presale](/smart-contracts/genesis/presale) - 固定価格販売
