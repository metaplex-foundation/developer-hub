---
title: V0からV1トランザクションへの移行
metaTitle: V0からV1トランザクションへの移行 | Umi
description: コンピュートバジェット、優先料金、ウォレット互換性を含め、Umiのトランザクションビルダーと直接作成するトランザクションをSolana V0トランザクションからV1トランザクションへ移行します。
keywords:
  - Umi transaction v1
  - Solana transaction v1
  - Umi v0 migration
  - TransactionV1Config
  - useV1
  - setTransactionConfig
  - SIMD-0385
about:
  - Umi
  - Solana Transaction V1
  - Transaction Migration
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '09-21-2026'
updated: '09-21-2026'
howToSteps:
  - Umiパッケージをバージョン1.6.0以降、web3.jsをバージョン1.99.0以降にアップグレードする
  - トランザクションビルダーごと、またはアプリケーションのデフォルトとしてV1を選択する
  - Compute Budget命令をTransactionV1Configに置き換える
  - Address Lookup Tablesを必要とするトランザクションはV0のままにする
  - 署名前に、接続されるすべてのウォレットがV1トランザクションをサポートしていることを確認する
howToTools:
  - Umi 1.6.0 or later
  - web3.js 1.99.0 or later
  - Solana RPC
faqs:
  - q: UmiはデフォルトでV1トランザクションを使用しますか？
    a: いいえ。Umi 1.6.0では、後方互換性のためV0がデフォルトのままです。トランザクションビルダーでuseV1を呼び出すか、Umiの作成時にdefaultTransactionVersionを1に設定してください。
  - q: UmiのV1トランザクションでAddress Lookup Tableを使用できますか？
    a: いいえ。V1トランザクションはAddress Lookup Tablesをサポートしません。Address Lookup Tableを必要とするトランザクションはV0のままにしてください。
  - q: V1トランザクションにCompute Budgetプログラム命令を含めることはできますか？
    a: いいえ。UmiはCompute Budget命令を含むV1トランザクションビルダーを拒否します。コンピュートユニット制限、優先料金の合計、ロード済みアカウントデータサイズ制限、またはヒープサイズの設定にはsetTransactionConfigを使用してください。
  - q: V1トランザクションの優先料金はコンピュートユニットあたりの価格ですか？
    a: いいえ。TransactionV1Config.priorityFeeはSolAmountとして指定する優先料金の合計です。マイクロラムポート単位の価格にコンピュートユニット制限を掛け、1,000,000で割り、ラムポート単位に切り上げて変換します。
  - q: すべてのSolanaウォレットがV1トランザクションをサポートしていますか？
    a: いいえ。Umiはウォレットアダプター向けにV1トランザクションをシリアライズできますが、接続されたウォレットがトランザクションバージョン1を受け入れて署名できる必要があります。V1をアプリケーション全体のデフォルトにする前に、ウォレットの対応状況を確認してください。
---

UmiアプリケーションをV0から[V1トランザクション](https://github.com/solana-foundation/solana-improvement-documents/blob/main/proposals/0385-transaction-v1.md)へ移行すると、より大きなトランザクションを使用し、トランザクションメッセージ上でコンピュートバジェットを直接設定できます。 {% .lead %}

{% callout title="移行する内容" %}
このガイドでは、UmiのV0トランザクションビルダーをV1へ移行し、Compute Budget命令を`TransactionV1Config`に置き換え、V1をグローバルに設定し、V0のままにする必要があるトランザクションを特定します。
{% /callout %}

## まとめ

Umi 1.6.0では、`useV1()`、`defaultTransactionVersion: 1`、およびトランザクションを直接作成する際の`version: 1`を通じて、オプトインでV1トランザクションをサポートします。

- V1では、シリアライズ後のトランザクション上限が1,232バイトから4,096バイトに増えます。
- V1では、コンピュート制限と優先料金の合計を`TransactionV1Config`に格納します。
- V1はAddress Lookup TablesとCompute Budget命令をサポートしません。
- Umiのデフォルトは引き続きV0であり、接続されるウォレットがV1に対応している必要があります。

## クイックスタート

トランザクションビルダーでV1を選択し、Compute Budget命令を`setTransactionConfig`に置き換えます。

1. Umiを1.6.0以降、`@solana/web3.js`を1.99.0以降にアップグレードします。
2. トランザクションビルダーに`.useV1()`を追加します。
3. `setComputeUnitLimit`命令と`setComputeUnitPrice`命令を削除します。
4. `.setTransactionConfig({ computeUnitLimit, priorityFee })`を追加します。
5. アプリケーションがサポートするすべてのウォレットでV1の署名をテストします。

**ジャンプ：** [前提条件](#前提条件) · [V0とV1の違い](#v0とv1トランザクションの違い) · [ビルダーの移行](#トランザクションビルダーをv1へ移行する) · [アプリケーションのデフォルト](#v1をアプリケーションのデフォルトに設定する) · [直接作成](#トランザクションの直接作成をv1へ移行する) · [Address Lookup Tables](#address-lookup-tableを使用するトランザクションをv0のままにする) · [一般的なエラー](#v1移行でよくあるエラー) · [FAQ](#faq)

## 前提条件

V1への移行には、互換性のあるUmi、Web3.js、RPC、ウォレットの各バージョンが必要です。

| コンポーネント | 要件 |
|-----------|-------------|
| Umi packages | 1.6.0以降 |
| `@solana/web3.js` | 1.99.0以降 |
| Solana clusters | mainnet-beta、devnet、testnetでV1が有効 |
| Wallet | トランザクションバージョン`1`を受け入れて署名できること |

{% callout type="warning" %}
接続されるすべてのウォレット経路がトランザクションバージョン`1`に対応するまで、V1をグローバルに有効化しないでください。Umiはウォレットアダプター向けにトランザクションをシリアライズしますが、互換性のないウォレットに署名させることはできません。
{% /callout %}

## V0とV1トランザクションの違い

V1ではトランザクションのサイズ上限が増えますが、V0のAddress Lookup TablesやCompute Budget命令はサポートされません。

| 機能 | V0 | V1 |
|------------|----------------|----------------|
| シリアライズ後のサイズ上限 | 1,232バイト | 4,096バイト |
| Address lookup tables | サポートあり | サポートなし |
| コンピュートユニット制限 | Compute Budget命令 | `transactionConfig.computeUnitLimit` |
| 優先料金 | コンピュートユニットあたりのマイクロラムポート | `transactionConfig.priorityFee`内の合計`SolAmount` |
| Umi 1.6.0でのデフォルト | はい | いいえ、オプトインが必要 |
| ビルダーのセレクター | `useV0()` | `useV1()` |

V1は、Address Lookup Tableに依存せず、トランザクションがV0のサイズ上限を超える場合に最も有用です。

## トランザクションビルダーをV1へ移行する

V0トランザクションビルダーは、Compute Budget命令を`useV1()`と`setTransactionConfig()`に置き換えることでV1へ移行できます。

### 移行前のV0トランザクションビルダー

V0トランザクションビルダーでは、コンピュートユニット制限と価格を命令として指定します。

```typescript {% title="transaction-v0.ts" %}
import { transactionBuilder } from '@metaplex-foundation/umi'
import {
  setComputeUnitLimit,
  setComputeUnitPrice,
  transferSol,
} from '@metaplex-foundation/mpl-toolbox'

await transactionBuilder()
  .add(setComputeUnitLimit(umi, { units: 600_000 }))
  .add(setComputeUnitPrice(umi, { microLamports: 1_000 }))
  .add(transferSol(umi, transferArgs))
  .sendAndConfirm(umi)
```

### 移行後のV1トランザクションビルダー

V1トランザクションビルダーでは、コンピュートユニット制限と優先料金の合計をトランザクションメッセージ内に指定します。

```typescript {% title="transaction-v1.ts" %}
import { lamports, transactionBuilder } from '@metaplex-foundation/umi'
import { transferSol } from '@metaplex-foundation/mpl-toolbox'

await transactionBuilder()
  .add(transferSol(umi, transferArgs))
  .useV1()
  .setTransactionConfig({
    computeUnitLimit: 600_000,
    priorityFee: lamports(600),
  })
  .sendAndConfirm(umi)
```

合計料金の`600`ラムポートは、`600,000 × 1,000 ÷ 1,000,000`に相当します。変換結果が整数のラムポートにならない場合は切り上げてください。

{% callout type="note" %}
`setTransactionConfig()`は設定全体を置き換えます。個々のフィールドを指定して繰り返し呼び出すのではなく、カスタムV1設定をすべて同じ呼び出しに含めてください。
{% /callout %}

## V1をアプリケーションのデフォルトに設定する

`defaultTransactionVersion: 1`を設定すると、ビルダーが別のバージョンを明示的に選択しない限り、すべてのトランザクションビルダーがV1を使用します。

```typescript {% title="umi.ts" %}
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'

const umi = createUmi('https://api.mainnet-beta.solana.com', {
  defaultTransactionVersion: 1,
})
```

このオプションは、Metaplexのプログラムライブラリが返すビルダーにも適用されます。`useV0()`を呼び出すビルダーは、引き続きアプリケーションのデフォルトを上書きします。

トランザクションファクトリーを直接インストールするアプリケーションでは、代わりにプラグインを設定できます。

```typescript {% title="umi-with-custom-plugins.ts" %}
import { web3JsTransactionFactory } from '@metaplex-foundation/umi-transaction-factory-web3js'

umi.use(web3JsTransactionFactory({ defaultTransactionVersion: 1 }))
```

## トランザクションの直接作成をV1へ移行する

`umi.transactions.create()`を直接呼び出す場合は、`version: 1`を設定し、ゼロではないランタイム制限を明示的に指定する必要があります。

```typescript {% title="create-transaction-v1.ts" %}
const transaction = umi.transactions.create({
  version: 1,
  blockhash: (await umi.rpc.getLatestBlockhash()).blockhash,
  instructions: [myInstruction],
  payer: umi.payer.publicKey,
  transactionConfig: {
    computeUnitLimit: 200_000,
    loadedAccountsDataSizeLimit: 64 * 1024 * 1024,
  },
})
```

`TransactionBuilder`は、コンピュート制限とロード済みアカウント制限が省略された場合に、従来と同等のデフォルト値を補います。低レベルの`create()`メソッドは補わないため、省略された制限はランタイムによってゼロとして扱われます。

## V1トランザクションの制限を設定する

`TransactionV1Config`は、コンピュート、アカウントデータ、ヒープサイズ、優先料金の合計を制御します。

| フィールド | 意味 | 有効範囲または動作 |
|-------|---------|-------------------------|
| `computeUnitLimit` | コンピュートユニットの最大値 | `0`から`1,400,000`までの整数 |
| `priorityFee` | 優先料金の合計 | 通常は`lamports(...)`で作成する`SolAmount` |
| `loadedAccountsDataSizeLimit` | ロード済みアカウントデータの最大値 | 最大64 MiB |
| `heapSize` | プログラムのヒープフレームサイズ | 32,768から262,144バイトまで（1,024バイト単位） |

これらのフィールドを省略すると、ビルダーは`computeUnitLimit`のデフォルトを`min(200,000 × 命令数, 1,400,000)`、`loadedAccountsDataSizeLimit`のデフォルトを64 MiBに設定します。

## Address Lookup Tableを使用するトランザクションをV0のままにする

[Address Lookup Tables](/dev-tools/umi/toolbox/address-lookup-table)を必要とするトランザクションは、V0のままにする必要があります。

```typescript {% title="transaction-v0-with-lookup-table.ts" %}
const builder = transactionBuilder()
  .add(myInstruction)
  .useV0()
  .setAddressLookupTables([myLookupTable])
```

トランザクションをV1へ強制的に移行するためだけにAddress Lookup Tableを削除しないでください。コンパイル後のアカウントリストとシリアライズ後のサイズを比較し、トランザクションの要件を満たす形式を使用してください。

## カスタムUmi連携を更新する

Umi 1.6.0へアップグレードする際、カスタムトランザクションファクトリーとバージョンを網羅的に処理するコードにはV1サポートを追加する必要があります。

- カスタム`TransactionFactoryInterface`実装に`getDefaultVersion()`を実装します。
- `TransactionVersion`を網羅的に分岐するコードに`1`のケースを追加します。
- V0のバージョンフィールドが必須になったため、直接作成するV0の`TransactionInput`オブジェクトに`version: 0`を追加します。
- トランザクションを読み取る際は`transaction.message.version`を確認します。V1メッセージには`transactionConfig`が含まれます。

UmiのRPC連携は`maxSupportedTransactionVersion: 1`を要求するため、`umi.rpc.getTransaction()`でV1トランザクションを取得できます。

## V1移行でよくあるエラー

Umiは、互換性のないビルダーの組み合わせをトランザクション送信前に拒否します。

| エラー | 原因 | 修正方法 |
|-------|-------|-----|
| `V1 transactions ignore ComputeBudget instructions. Set the compute budget with setTransactionConfig instead.` | V1トランザクションビルダーに`setComputeUnitLimit`、`setComputeUnitPrice`、または別のCompute Budget命令が含まれている | 命令を削除し、`setTransactionConfig()`を使用する |
| `Address lookup tables are not supported by V1 transactions.` | V1トランザクションビルダーに1つ以上のAddress Lookup Tablesが設定されている | ビルダーをV0のままにするか、lookup tableの要件をなくす |
| `Transaction configs are only supported by V1 transactions.` | legacyまたはV0のトランザクションビルダーが`setTransactionConfig()`を呼び出している | `useV1()`を呼び出すか、V0でCompute Budget命令を使用する |
| ウォレットがトランザクションを拒否する、またはデシリアライズできない | ウォレットがトランザクションバージョン`1`をサポートしていない | ウォレットがV1をサポートするまで、そのウォレットのフローをV0のままにする |
| 直接作成したトランザクションがコンピュートバジェット不足で失敗する | `create()`に`computeUnitLimit`が指定されていない | ゼロではない`transactionConfig.computeUnitLimit`を設定する |

## 注意事項

- Umi 1.6.0ではV1はオプトインであり、後方互換性のためデフォルトはV0のままです。
- V1は2026年9月15日のepoch 1035にSolana mainnet-betaで有効化されました。
- 送信とシミュレーションにはbase64エンコーディングが使用され、1,232バイトを超えるV1トランザクションに対応します。
- Umiはシリアライズ前にコンピュートユニット制限とヒープサイズを検証します。
- 実装と互換性の詳細は[metaplex-foundation/umi#216](https://github.com/metaplex-foundation/umi/pull/216)に記載されています。

## FAQ

### UmiはデフォルトでV1トランザクションを使用しますか？

Umi 1.6.0では、後方互換性のためV0がデフォルトのままです。トランザクションビルダーで`useV1()`を呼び出すか、Umiの作成時に`defaultTransactionVersion: 1`を設定してください。

### UmiのV1トランザクションでAddress Lookup Tableを使用できますか？

V1トランザクションはAddress Lookup Tablesをサポートしません。Address Lookup Tableを必要とするトランザクションはV0のままにしてください。

### V1トランザクションにCompute Budgetプログラム命令を含めることはできますか？

UmiはCompute Budget命令を含むV1トランザクションビルダーを拒否します。コンピュートユニット制限、優先料金の合計、ロード済みアカウントデータサイズ制限、またはヒープサイズの設定には`setTransactionConfig()`を使用してください。

### V1トランザクションの優先料金はコンピュートユニットあたりの価格ですか？

`TransactionV1Config.priorityFee`はコンピュートユニットあたりの価格ではなく、`SolAmount`として指定する優先料金の合計です。マイクロラムポート単位の価格にコンピュートユニット制限を掛け、1,000,000で割り、ラムポート単位に切り上げて変換します。

### すべてのSolanaウォレットがV1トランザクションをサポートしていますか？

トランザクションバージョン`1`への対応は、すべてのウォレットで共通ではありません。Umiはウォレットアダプター向けにV1トランザクションをシリアライズできますが、接続されたウォレットがトランザクションを受け入れて署名できる必要があります。
