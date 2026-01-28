---
title: JavaScript SDK
metaTitle: JavaScript SDK | Metaplex Core
description: Metaplex Core JavaScript SDK の完全なリファレンス。Umi セットアップ、アセット作成、転送、バーン、更新、コレクション、プラグイン、データ取得をカバー。
---

**Metaplex Core JavaScript SDK**（`@metaplex-foundation/mpl-core`）は、Solana 上の Core Assets と Collections を操作するための完全な TypeScript/JavaScript インターフェースを提供します。[Umi フレームワーク](/ja/dev-tools/umi)上に構築され、すべての Core 操作に型安全なメソッドを提供します。{% .lead %}

{% callout title="学習内容" %}

この SDK リファレンスでは以下をカバーします:
- Core プラグインを使用した Umi のセットアップ
- Assets の作成、転送、バーン、更新
- Collections とコレクションレベルの操作の管理
- プラグインの追加、更新、削除
- DAS を使用した Assets と Collections の取得
- エラーハンドリングと一般的なパターン

{% /callout %}

## 概要

**Core JavaScript SDK** は、JavaScript/TypeScript アプリケーションから Metaplex Core と対話するための推奨方法です。Core プログラムの命令を型安全な API でラップしています。

- インストール: `npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi`
- ウォレット/RPC 管理には Umi フレームワークが必要
- すべての関数は柔軟な実行のためのトランザクションビルダーを返す
- ブラウザと Node.js 環境の両方をサポート

## 対象外

Rust SDK の使用（[Rust SDK](/ja/smart-contracts/core/sdk/rust)を参照）、Token Metadata 操作、Candy Machine 統合、低レベルの Solana トランザクション構築。

## クイックスタート

**ジャンプ先:** [セットアップ](#umi-setup) · [作成](#create-an-asset) · [転送](#transfer-an-asset) · [バーン](#burn-an-asset) · [更新](#update-an-asset) · [コレクション](#collections) · [プラグイン](#plugins) · [取得](#fetching-assets) · [エラー](#common-errors) · [FAQ](#faq)

1. 依存関係をインストール: `npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi-bundle-defaults`
2. `mplCore()` プラグインで Umi インスタンスを作成
3. トランザクション用の署名者を生成またはロード
4. SDK 関数を呼び出してトランザクションを確認

## 前提条件

- **Node.js 18+** または ES モジュール対応のモダンブラウザ
- RPC と署名者が設定された **Umi フレームワーク**
- トランザクション手数料用の **SOL**（アセットあたり約 0.003 SOL）

{% quick-links %}

{% quick-link title="API リファレンス" target="_blank" icon="JavaScript" href="https://mpl-core.typedoc.metaplex.com/" description="SDK の完全な TypeDoc API ドキュメント。" /%}

{% quick-link title="NPM パッケージ" target="_blank" icon="JavaScript" href="https://www.npmjs.com/package/@metaplex-foundation/mpl-core" description="npmjs.com 上のパッケージとバージョン履歴。" /%}

{% /quick-links %}

## インストール

Core SDK と Umi フレームワークをインストール:

```bash {% title="Terminal" %}
npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi-bundle-defaults
```

メタデータのアップロードには、アップローダープラグインを追加:

```bash {% title="Terminal" %}
npm install @metaplex-foundation/umi-uploader-irys
```

## Umi Setup

Core プラグインで Umi インスタンスを作成・設定:

```ts {% title="setup-umi.ts" %}
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplCore } from '@metaplex-foundation/mpl-core'
import { keypairIdentity } from '@metaplex-foundation/umi'
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'

// RPC エンドポイントで Umi を作成
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplCore())
  .use(keypairIdentity(yourKeypair))
  .use(irysUploader()) // オプション: メタデータアップロード用
```

{% totem %}
{% totem-accordion title="ファイルからキーペアをロード" %}

```ts {% title="load-keypair.ts" %}
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplCore } from '@metaplex-foundation/mpl-core'
import { keypairIdentity } from '@metaplex-foundation/umi'
import { readFileSync } from 'fs'

const secretKey = JSON.parse(
  readFileSync('/path/to/keypair.json', 'utf-8')
)
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secretKey))

const umi = createUmi('https://api.devnet.solana.com')
  .use(mplCore())
  .use(keypairIdentity(keypair))
```

{% /totem-accordion %}

{% totem-accordion title="ブラウザウォレットアダプター" %}

```ts {% title="browser-wallet.ts" %}
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplCore } from '@metaplex-foundation/mpl-core'
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters'

const umi = createUmi('https://api.devnet.solana.com')
  .use(mplCore())
  .use(walletAdapterIdentity(wallet)) // @solana/wallet-adapter-react から
```

{% /totem-accordion %}
{% /totem %}

---

## Assets

### Create an Asset

`create()` を使用して新しい Core Asset をミント:

{% code-tabs-imported from="core/create-asset" frameworks="umi" /%}

### Transfer an Asset

`transfer()` を使用して Asset を別のウォレットに送信:

{% code-tabs-imported from="core/transfer-asset" frameworks="umi" /%}

### Burn an Asset

`burn()` を使用して Asset を永久に破棄しレントを回収:

{% code-tabs-imported from="core/burn-asset" frameworks="umi" /%}

### Update an Asset

`update()` を使用して Asset メタデータを変更:

{% code-tabs-imported from="core/update-asset" frameworks="umi" /%}

---

## Collections

### コレクションの作成

`createCollection()` を使用して Collection アカウントを作成:

{% code-tabs-imported from="core/create-collection" frameworks="umi" /%}

### コレクション内に Asset を作成

`create()` に `collection` パラメータを渡す:

{% code-tabs-imported from="core/create-asset-in-collection" frameworks="umi" /%}

---

## Plugins

プラグインは Assets と Collections に動作を追加します。作成時または後から追加できます。

### 作成時にプラグインを追加

{% code-tabs-imported from="core/create-asset-with-plugins" frameworks="umi" /%}

### 既存の Asset にプラグインを追加

{% code-tabs-imported from="core/add-plugin" frameworks="umi" /%}

### 利用可能なプラグインタイプ

| プラグイン | 型文字列 | 目的 |
|--------|-------------|---------|
| Royalties | `'Royalties'` | クリエイターロイヤリティの強制 |
| Freeze Delegate | `'FreezeDelegate'` | 凍結/解除を許可 |
| Burn Delegate | `'BurnDelegate'` | デリゲートによるバーンを許可 |
| Transfer Delegate | `'TransferDelegate'` | デリゲートによる転送を許可 |
| Update Delegate | `'UpdateDelegate'` | メタデータ更新を許可 |
| Attributes | `'Attributes'` | オンチェーンのキー/バリューデータ |
| Permanent Freeze | `'PermanentFreezeDelegate'` | 永久凍結状態 |
| Permanent Transfer | `'PermanentTransferDelegate'` | 永久転送デリゲート |
| Permanent Burn | `'PermanentBurnDelegate'` | 永久バーンデリゲート |

詳細なプラグインドキュメントは[プラグイン概要](/ja/smart-contracts/core/plugins)を参照。

---

## Fetching Assets

### 単一の Asset を取得

{% code-tabs-imported from="core/fetch-asset" frameworks="umi" /%}

### オーナーで Assets を取得（DAS）

DAS API を使用してインデックス化されたアセットをクエリ:

```ts {% title="fetch-by-owner.ts" %}
import { publicKey } from '@metaplex-foundation/umi'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

// Umi に DAS プラグインを追加
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplCore())
  .use(dasApi())

const owner = publicKey('OwnerAddressHere...')

const assets = await umi.rpc.getAssetsByOwner({
  owner,
  limit: 100,
})

console.log('Assets owned:', assets.items.length)
```

### コレクションで Assets を取得（DAS）

```ts {% title="fetch-by-collection.ts" %}
import { publicKey } from '@metaplex-foundation/umi'

const collectionAddress = publicKey('CollectionAddressHere...')

const assets = await umi.rpc.getAssetsByGroup({
  groupKey: 'collection',
  groupValue: collectionAddress,
  limit: 100,
})

console.log('Collection assets:', assets.items.length)
```

---

## メタデータのアップロード

Umi のアップローダープラグインを使用してメタデータ JSON を保存:

```ts {% title="upload-metadata.ts" %}
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'

const umi = createUmi('https://api.devnet.solana.com')
  .use(mplCore())
  .use(keypairIdentity(yourKeypair))
  .use(irysUploader())

// まず画像をアップロード
const imageFile = await fs.promises.readFile('image.png')
const [imageUri] = await umi.uploader.upload([imageFile])

// メタデータ JSON をアップロード
const uri = await umi.uploader.uploadJson({
  name: 'My NFT',
  description: 'An awesome NFT',
  image: imageUri,
  attributes: [
    { trait_type: 'Background', value: 'Blue' },
    { trait_type: 'Rarity', value: 'Rare' },
  ],
})

console.log('Metadata URI:', uri)
```

---

## トランザクションパターン

### 送信と確認

標準パターンは確認を待つ:

```ts {% title="send-confirm.ts" %}
const result = await create(umi, { asset, name, uri }).sendAndConfirm(umi)
console.log('Signature:', result.signature)
```

### カスタム確認オプション

```ts {% title="custom-confirm.ts" %}
const result = await create(umi, { asset, name, uri }).sendAndConfirm(umi, {
  confirm: { commitment: 'finalized' },
})
```

### 送信せずにトランザクションをビルド

```ts {% title="build-only.ts" %}
const tx = create(umi, { asset, name, uri })
const builtTx = await tx.buildAndSign(umi)
// 後で送信: await umi.rpc.sendTransaction(builtTx)
```

### 複数の命令を結合

```ts {% title="combine-instructions.ts" %}
import { transactionBuilder } from '@metaplex-foundation/umi'

const tx = transactionBuilder()
  .add(create(umi, { asset: asset1, name: 'NFT 1', uri: uri1 }))
  .add(create(umi, { asset: asset2, name: 'NFT 2', uri: uri2 }))

await tx.sendAndConfirm(umi)
```

---

## Common Errors

### `Account does not exist`

アセットまたはコレクションアドレスが存在しません。アドレスが正しいことを確認:

```ts
const asset = await fetchAsset(umi, assetAddress).catch(() => null)
if (!asset) {
  console.log('Asset not found')
}
```

### `Invalid authority`

このアクションを実行する権限がありません。以下を確認:
- Asset を所有している（転送、バーンの場合）
- 更新権限がある（更新の場合）
- 必要なデリゲート権限がある

### `Insufficient funds`

ウォレットにより多くの SOL が必要です。以下で補充:

```bash
solana airdrop 1 <WALLET_ADDRESS> --url devnet
```

### `Asset already exists`

アセットのキーペアが既に使用されています。新しい署名者を生成:

```ts
const assetSigner = generateSigner(umi) // 一意である必要がある
```

### `Plugin not found`

このアセットにプラグインが存在しません。インストールされているプラグインを確認:

```ts
const asset = await fetchAsset(umi, assetAddress)
console.log('Plugins:', Object.keys(asset))
```

---

## 注意事項

- 新しいアセットには常に `generateSigner()` を使用 - キーペアを再利用しない
- `create()` の `asset` パラメータは署名者である必要がある（公開鍵だけではない）
- コレクションレベルのプラグインは同じタイプのアセットレベルのプラグインをオーバーライドする
- すぐに取得するアセットを作成する場合は `commitment: 'finalized'` を使用
- トランザクションビルダーは不変 - 各メソッドは新しいビルダーを返す

---

## クイックリファレンス

### 最小依存関係

```json {% title="package.json" %}
{
  "dependencies": {
    "@metaplex-foundation/mpl-core": "^1.0.0",
    "@metaplex-foundation/umi": "^0.9.0",
    "@metaplex-foundation/umi-bundle-defaults": "^0.9.0"
  }
}
```

### Core 関数

| 関数 | 目的 |
|----------|---------|
| `create()` | 新しい Asset を作成 |
| `createCollection()` | 新しい Collection を作成 |
| `transfer()` | Asset の所有権を転送 |
| `burn()` | Asset を破棄 |
| `update()` | Asset メタデータを更新 |
| `updateCollection()` | Collection メタデータを更新 |
| `addPlugin()` | Asset にプラグインを追加 |
| `addCollectionPlugin()` | Collection にプラグインを追加 |
| `updatePlugin()` | 既存のプラグインを更新 |
| `removePlugin()` | Asset からプラグインを削除 |
| `fetchAsset()` | アドレスで Asset を取得 |
| `fetchCollection()` | アドレスで Collection を取得 |

### プログラム ID

| ネットワーク | アドレス |
|---------|---------|
| Mainnet | `CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d` |
| Devnet | `CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d` |

---

## FAQ

### Core JavaScript SDK とは？

Core JavaScript SDK（`@metaplex-foundation/mpl-core`）は、Solana 上の Metaplex Core NFT と対話するための TypeScript ライブラリです。Assets と Collections の作成、転送、バーン、管理のための型安全な関数を提供します。

### この SDK を使用するには Umi が必要ですか？

はい。Core SDK は Umi フレームワーク上に構築されており、ウォレット接続、RPC 通信、トランザクション構築を処理します。`@metaplex-foundation/mpl-core` と `@metaplex-foundation/umi-bundle-defaults` の両方をインストールしてください。

### ブラウザウォレットを接続するには？

`@metaplex-foundation/umi-signer-wallet-adapters` パッケージをウォレットアダプターと一緒に使用:

```ts
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters'
umi.use(walletAdapterIdentity(wallet))
```

### sendAndConfirm と send の違いは？

`sendAndConfirm()` はトランザクションの確認を待ってから返します。`send()` はブロードキャスト後すぐに返します。ほとんどの場合、トランザクションが成功したことを確認するために `sendAndConfirm()` を使用してください。

### 複数の操作をバッチ処理するには？

`transactionBuilder()` を使用して命令を結合しますが、Solana のトランザクションサイズ制限（約 1232 バイト）に注意してください。大きなバッチの場合は、複数のトランザクションを送信してください。

### この SDK を React/Next.js で使用できますか？

はい。SDK はブラウザと Node.js 環境の両方で動作します。React の場合、`@solana/wallet-adapter-react` のウォレットアダプターを Umi のウォレットアダプターアイデンティティと一緒に使用してください。

### エラーをハンドリングするには？

SDK 呼び出しを try/catch ブロックでラップします。SDK はプログラムエラーコードを含む型付きエラーをスローします:

```ts
try {
  await transfer(umi, { asset, newOwner }).sendAndConfirm(umi)
} catch (error) {
  console.error('Transfer failed:', error.message)
}
```

### 完全な API ドキュメントはどこにありますか？

完全な関数シグネチャと型については [TypeDoc API リファレンス](https://mpl-core.typedoc.metaplex.com/) を参照してください。

---

## 用語集

| 用語 | 定義 |
|------|------|
| **Umi** | ウォレットと RPC 管理を備えた Solana アプリケーション構築用の Metaplex フレームワーク |
| **Asset** | 所有権、メタデータ、プラグインを持つ NFT を表す Core オンチェーンアカウント |
| **Collection** | 関連する Assets をグループ化し、コレクション全体のプラグインを適用できる Core アカウント |
| **Signer** | トランザクションに署名できるキーペア（新しいアカウントの作成に必要） |
| **Plugin** | Assets または Collections に動作を追加するモジュラー拡張 |
| **URI** | 名前、画像、属性を含む JSON ファイルを指すオフチェーンメタデータ URL |
| **DAS** | Digital Asset Standard - RPC プロバイダーからインデックス化された NFT データをクエリするための API |
| **Transaction Builder** | 送信前にトランザクションを構築する不変オブジェクト |
| **Identity** | Umi でトランザクション署名者として設定されたウォレット/キーペア |
| **Commitment** | Solana の確認レベル（processed、confirmed、finalized） |

---

*Metaplex Foundation によって管理 - 最終確認 2026年1月 - @metaplex-foundation/mpl-core 1.x に適用*
