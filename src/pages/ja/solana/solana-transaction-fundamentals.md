---
title: Solanaトランザクションの基礎
metaTitle: Solanaトランザクションの基礎 | トランザクションの仕組み
description: 構造、署名、送信、確認を含むSolanaトランザクションの仕組みを学びます。信頼性の高いアプリケーションを構築するために欠かせない知識です。
# remember to update dates also in /components/products/guides/index.js
created: '02-04-2026'
updated: '09-21-2026'
---

構造から確認まで、Solanaトランザクションの仕組みを包括的に解説します。 {% .lead %}

## このガイドで学ぶこと

- Solanaトランザクションの構造
- トランザクションに署名して送信する方法
- トランザクションの確認とファイナリティ
- バージョン付きトランザクションとlegacyトランザクションの違い
- 一般的なトランザクションエラーとその意味

## 前提条件

- [Solana CLIのインストール](/solana/solana-cli-essentials)
- [Solanaアカウントの理解](/solana/understanding-solana-accounts)

## トランザクションの構造

Solanaトランザクションは複数のコンポーネントで構成されます。

```
┌─────────────────────────────────────────────────────────────┐
│                      Transaction                             │
├─────────────────────────────────────────────────────────────┤
│  Signatures: [sig1, sig2, ...]                              │
│                                                             │
│  Message:                                                   │
│    ├── Header                                               │
│    │     ├── num_required_signatures                        │
│    │     ├── num_readonly_signed_accounts                   │
│    │     └── num_readonly_unsigned_accounts                 │
│    │                                                        │
│    ├── Account Keys: [pubkey1, pubkey2, ...]               │
│    │                                                        │
│    ├── Recent Blockhash                                     │
│    │                                                        │
│    └── Instructions: [                                      │
│          { program_id_index, accounts, data },              │
│          { program_id_index, accounts, data },              │
│        ]                                                    │
└─────────────────────────────────────────────────────────────┘
```

### 主要コンポーネント

| コンポーネント | 説明 |
|-----------|-------------|
| **Signatures** | 必要な署名者によるEd25519署名 |
| **Recent Blockhash** | 最近のブロックハッシュ（約60〜90秒間有効） |
| **Instructions** | 実行する処理 |
| **Account Keys** | トランザクションに関与するすべてのアカウント |

## 命令

命令はトランザクション内で実際に実行される処理です。各命令は次の項目を指定します。

- **Program ID** - 実行するプログラム
- **Accounts** - プログラムが必要とするアカウント
- **Data** - プログラムに渡すシリアライズ済み引数

```
Instruction:
  ├── program_id: 11111111111111111111111111111111  (System Program)
  ├── accounts:
  │     ├── sender    (signer, writable)
  │     └── recipient (not signer, writable)
  └── data: [encoded transfer amount]
```

### 複数の命令

トランザクションには、アトミックに実行される複数の命令を含めることができます。

```javascript
import { transactionBuilder } from '@metaplex-foundation/umi'

// All instructions succeed or all fail (atomic)
const builder = transactionBuilder()
  .add(createAccountInstruction)
  .add(initializeMintInstruction)
  .add(mintTokensInstruction)

await builder.sendAndConfirm(umi)
```

このアトミック性により、いずれかの命令が失敗するとトランザクション全体がロールバックされます。

## Recent Blockhash

すべてのトランザクションには、次の役割を持つ**recent blockhash**が必要です。
- トランザクションが最近作成されたことを証明する
- リプレイ攻撃を防ぐ
- 約60〜90秒後（約150スロット後）に期限切れになる

```javascript
// UMI handles blockhash automatically when sending transactions.
// To fetch it manually:
const { blockhash, lastValidBlockHeight } = await umi.rpc.getLatestBlockhash()
```

{% callout title="ブロックハッシュの期限切れ" type="warning" %}
ブロックハッシュの期限が切れる前にトランザクションが確認されなければ、そのトランザクションは破棄されます。時間のかかる処理では、送信前に新しいブロックハッシュを取得してください。
{% /callout %}

## トランザクションへの署名

トランザクションには、`isSigner`と指定されたすべてのアカウントによる署名が必要です。

```javascript
// UMI signs automatically with the identity signer when sending.
// For additional signers, pass them during the build:
const tx = await myBuilder
  .setBlockhash(await umi.rpc.getLatestBlockhash())
  .buildAndSign(umi)

// For partial signing (multi-sig workflows), you can sign
// and serialize the transaction, then pass it to another party:
import { base64 } from '@metaplex-foundation/umi/serializers'

const serialized = umi.transactions.serialize(tx)
const encoded = base64.deserialize(serialized)[0]
// ... send encoded string to another party for additional signing ...
```

## トランザクションの送信

### 基本的な送信

```javascript
// Send and wait for confirmation (recommended)
const result = await myBuilder.sendAndConfirm(umi)

// Or just send without waiting
const signature = await myBuilder.send(umi)
```

### オプションを指定した送信

```javascript
const result = await myBuilder.sendAndConfirm(umi, {
  send: { skipPreflight: false },
  confirm: { commitment: 'confirmed' },
})
```

## トランザクションの確認

Solanaには、トランザクションのファイナリティを示す複数の**commitment level**があります。

| Commitment | 説明 | ユースケース |
|------------|-------------|----------|
| `processed` | リーダーがトランザクションを受信済み | リアルタイム更新 |
| `confirmed` | スーパーマジョリティによる投票済み | ほとんどのアプリケーション |
| `finalized` | 31ブロック以上経過し、不可逆 | 金融処理 |

### 確認状況を調べる

```javascript
// sendAndConfirm waits for confirmation automatically.
// To check a signature status manually:
const result = await umi.rpc.getSignatureStatuses([signature])
```

### 実際のCommitment指定

```javascript
// For most operations, 'confirmed' is the right default
const result = await myBuilder.sendAndConfirm(umi, {
  confirm: { commitment: 'confirmed' },
})

// For financial operations where you need full finality
const result = await myBuilder.sendAndConfirm(umi, {
  confirm: { commitment: 'finalized' },
})
```

## バージョン付きトランザクション

Solanaは3つのトランザクション形式をサポートしています。

### Legacyトランザクション

Legacyトランザクションは、Address Lookup Tablesを使用しないSolanaの元来のトランザクション形式です。

- 元来の形式
- 最大35アカウント
- より単純な構造

### V0トランザクション

V0トランザクションは、より多くのアカウントを必要とするトランザクション向けにAddress Lookup Tableをサポートします。

- **Address Lookup Tables**（ALT）をサポート
- 最大256アカウントを参照可能
- 複雑なDeFi処理で必要

### V1トランザクション

V1トランザクションではトランザクションのサイズ上限が増え、コンピュート設定がメッセージ内に格納されます。

- 最大4,096バイトのトランザクションをサポート
- コンピュートバジェット設定をトランザクションメッセージ内に格納
- Address Lookup Tablesはサポートしない

```javascript
// Umi uses V0 transactions by default. Opt in to V1 explicitly.
const result = await myBuilder
  .useV1()
  .sendAndConfirm(umi)

// To use legacy transactions instead
const result = await myBuilder
  .useLegacyVersion()
  .sendAndConfirm(umi)

// With Address Lookup Tables
import { createLut } from '@metaplex-foundation/mpl-toolbox'

const [lutBuilder, lut] = createLut(umi, {
  recentSlot: await umi.rpc.getSlot({ commitment: 'finalized' }),
  addresses: [addressA, addressB, addressC],
})
await lutBuilder.sendAndConfirm(umi)

// Address Lookup Tables require V0.
await myBuilder
  .useV0()
  .setAddressLookupTables([lut])
  .sendAndConfirm(umi)
```

{% callout title="トランザクションバージョンの選び方" %}
- ウォレットがトランザクションバージョン`1`をサポートし、トランザクションが1,232バイトを超える場合はV1を使用します。
- トランザクションにAddress Lookup Tableが必要な場合はV0を使用します。
- 互換性のために元来の形式が必要な場合にのみlegacyトランザクションを使用します。

後方互換性のため、UmiのデフォルトはV0です。アプリケーション全体のデフォルトを変更する前に、[V0からV1トランザクションへの移行](/dev-tools/umi/guides/migrate-to-transaction-v1)を参照してください。
{% /callout %}

## トランザクションのサイズ制限

Solanaトランザクションには厳格なサイズ制限があります。

| 制限 | 値 |
|-------|-------|
| LegacyおよびV0トランザクションのサイズ | 1,232バイト |
| V1トランザクションのサイズ | 4,096バイト |
| Address Lookup Tables | V0のみ |
| 命令の最大数 | サイズによる制限 |

### サイズ制限への対処

トランザクションが大きすぎる場合は、次の方法で対処します。

1. **V1を使用する** - Address Lookup Tableが不要な場合、サイズ上限を4,096バイトに増やす
2. **V0でAddress Lookup Tablesを使用する** - アカウント参照を圧縮する
3. **複数のトランザクションに分割する** - 順番に実行する
4. **命令データを最適化する** - シリアライズされるデータを最小化する

## シミュレーション

送信前にトランザクションをシミュレーションしてエラーを検出します。

```javascript
// Build the transaction without sending
const tx = await myBuilder
  .setBlockhash(await umi.rpc.getLatestBlockhash())
  .buildAndSign(umi)

// Simulate it
const simulation = await umi.rpc.simulateTransaction(tx, {
  commitment: 'confirmed',
})
console.log('Simulation result:', simulation)
```

シミュレーションには次の利点があります。
- 料金を支払う前にエラーを検出できる
- コンピュートユニットを見積もれる
- プログラムロジックをデバッグできる

## 一般的なトランザクションエラー

### "Blockhash not found"

**原因**：確認前にブロックハッシュの期限が切れています。

**解決方法**：
1. 新しいブロックハッシュで再試行します（UMIは送信のたびに新しいブロックハッシュを自動取得します）
2. ネットワーク混雑時には、ブロックハッシュに`'finalized'` commitmentを使用します
3. アプリケーションに再試行ロジックを実装します

### "Insufficient funds"

**原因**：アカウントにトランザクション料金とrentを支払うための十分なSOLがありません。

**解決方法**：fee payerに十分な残高があることを確認します。
```bash
solana balance
solana airdrop 1  # On devnet
```

### "Transaction simulation failed"

**原因**：プログラムロジックのエラーです。

**解決方法**：[Solana Explorerの使用](/solana/using-solana-explorers)を参照してExplorerでシミュレーションログを確認するか、送信前にトランザクションをシミュレーションしてエラー出力を調べます。

### "Account not found"

**原因**：トランザクション内のアカウントが存在しません。

**解決方法**：先にアカウントを作成するか、アドレスを確認します。

### "Invalid account owner"

**原因**：アカウントが想定とは異なるプログラムによって所有されています。

**解決方法**：アカウントの所有者が呼び出し先のプログラムと一致することを確認します。

## 実践例：完全なフロー

```javascript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { transferSol } from '@metaplex-foundation/mpl-toolbox'
import { signerIdentity, generateSigner, sol, publicKey } from '@metaplex-foundation/umi'
import { base58 } from '@metaplex-foundation/umi/serializers'

// 1. Create UMI instance
const umi = createUmi('https://api.devnet.solana.com')

// 2. Set up signer (your wallet)
const signer = generateSigner(umi)
umi.use(signerIdentity(signer))

// 3. Build and send the transaction
const result = await transferSol(umi, {
  source: umi.identity,
  destination: publicKey('RecipientAddressHere...'),
  amount: sol(1),
}).sendAndConfirm(umi)

// 4. Get the transaction signature
const signature = base58.deserialize(result.signature)[0]
console.log('Transaction confirmed:', signature)
console.log(`Explorer: https://explorer.solana.com/tx/${signature}?cluster=devnet`)
```

## 次のステップ

- [コンピュートユニットと優先料金](/solana/compute-units-and-priority-fees) - トランザクション実行を最適化する
- [devnetとtestnetの使用](/solana/working-with-devnet-and-testnet) - トランザクションをテストする
- [トランザクションエラーの診断](/solana/general/how-to-diagnose-solana-transaction-errors) - 失敗したトランザクションをデバッグする

## FAQ

### トランザクションを確認できる時間はどのくらいですか？

トランザクションのブロックハッシュは約60〜90秒間（約150スロット）有効です。その時間を過ぎても確認されなかったトランザクションは破棄されます。

### トランザクションをキャンセルできますか？

いいえ。一度送信したトランザクションはキャンセルできません。ただし、まだ確認されていない場合は、durable nonceを使用して同じnonceの新しいトランザクションを送信し、実質的に「置き換える」ことができます。

### "processed"と"confirmed"の違いは何ですか？

"Processed"は、バリデーターがトランザクションを受信したことを意味します。"Confirmed"は、トランザクションを含むブロックに対してスーパーマジョリティ（66%以上）のバリデーターが投票したことを意味します。重要な処理には必ず"confirmed"または"finalized"を使用してください。

### シミュレーションが成功した後にトランザクションが失敗したのはなぜですか？

シミュレーションと実行の間に状態が変化することがあります。別のトランザクションがアカウントを変更した可能性があります。これはNFTのミントなど、競合が発生する状況でよく起こります。
