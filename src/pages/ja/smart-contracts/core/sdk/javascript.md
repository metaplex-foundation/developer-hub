---
title: JavaScript SDK
metaTitle: JavaScript SDK | Metaplex Core
description: Metaplex Core JavaScript SDKの完全リファレンス。Umiのセットアップ、Assetの作成、転送、バーン、更新、Collection、プラグイン、データの取得について解説します。
updated: '01-31-2026'
keywords:
  - mpl-core JavaScript
  - Core TypeScript SDK
  - Umi framework
  - NFT JavaScript
  - Solana NFT SDK
about:
  - JavaScript SDK
  - Umi integration
  - TypeScript development
proficiencyLevel: Beginner
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: Core JavaScript SDKとは何ですか？
    a: Core JavaScript SDK（@metaplex-foundation/mpl-core）は、Solana上のMetaplex Core NFTを操作するためのTypeScriptライブラリです。Asset と Collection の作成、転送、バーン、管理のための型安全な関数を提供します。
  - q: このSDKを使用するにはUmiが必要ですか？
    a: はい。Core SDKはUmiフレームワーク上に構築されており、ウォレット接続、RPC通信、トランザクション構築を処理します。@metaplex-foundation/mpl-coreと@metaplex-foundation/umi-bundle-defaultsの両方をインストールしてください。
  - q: ブラウザウォレットを接続するにはどうすればよいですか？
    a: '@metaplex-foundation/umi-signer-wallet-adaptersパッケージをウォレットアダプターと一緒に使用し、umi.use(walletAdapterIdentity(wallet))を呼び出します。'
  - q: sendAndConfirmとsendの違いは何ですか？
    a: sendAndConfirm()はトランザクションの確認を待ってから返します。send()はブロードキャスト後すぐに返します。ほとんどの場合はsendAndConfirm()を使用してください。
  - q: 複数の操作をバッチ処理するにはどうすればよいですか？
    a: transactionBuilder()を使用して命令を組み合わせますが、Solanaのトランザクションサイズ制限（約1232バイト）に注意してください。大きなバッチの場合は、複数のトランザクションを送信してください。
  - q: このSDKはReact/Next.jsで使用できますか？
    a: はい。SDKはブラウザとNode.js環境の両方で動作します。Reactの場合は、@solana/wallet-adapter-reactのウォレットアダプターをUmiのウォレットアダプターアイデンティティと一緒に使用してください。
---
**Metaplex Core JavaScript SDK**（`@metaplex-foundation/mpl-core`）は、Solana上のCore Asset と Collection を操作するための完全なTypeScript/JavaScriptインターフェースを提供します。[Umiフレームワーク](/dev-tools/umi)上に構築されており、すべてのCore操作に対して型安全なメソッドを提供します。 {% .lead %}
{% callout title="学べること" %}
このSDKリファレンスでは以下を扱います：
- Coreプラグインを使用したUmiのセットアップ
- Assetの作成、転送、バーン、更新
- Collectionとコレクションレベルの操作の管理
- プラグインの追加、更新、削除
- DASを使用したAssetとCollectionの取得
- エラー処理と一般的なパターン
{% /callout %}
## 概要
**Core JavaScript SDK**は、JavaScript/TypeScriptアプリケーションからMetaplex Coreを操作するための推奨方法です。Coreプログラムの命令を型安全なAPIでラップしています。
- インストール：`npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi`
- ウォレット/RPC管理にUmiフレームワークが必要
- すべての関数は柔軟な実行のためにトランザクションビルダーを返す
- ブラウザとNode.js環境の両方をサポート
## 範囲外
Rust SDKの使用（[Rust SDK](/ja/smart-contracts/core/sdk/rust)を参照）、Token Metadata操作、Candy Machine統合、低レベルSolanaトランザクション構築。
## クイックスタート
**ジャンプ：** [セットアップ](#umiセットアップ) · [作成](#assetの作成) · [転送](#assetの転送) · [バーン](#assetのバーン) · [更新](#assetの更新) · [Collection](#collection) · [プラグイン](#プラグイン) · [取得](#assetの取得) · [エラー](#一般的なエラー) · [FAQ](#faq)
1. 依存関係をインストール：`npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi-bundle-defaults`
2. `mplCore()`プラグインでUmiインスタンスを作成
3. トランザクション用のsignerを生成またはロード
4. SDK関数を呼び出してトランザクションを確認
## 前提条件
- **Node.js 18+**またはESモジュール対応のモダンブラウザ
- RPCとsignerを設定した**Umiフレームワーク**
- トランザクション手数料用の**SOL**（Assetあたり約0.003 SOL）
{% quick-links %}
{% quick-link title="APIリファレンス" target="_blank" icon="JavaScript" href="https://mpl-core.typedoc.metaplex.com/" description="SDKの完全なTypeDoc APIドキュメント。" /%}
{% quick-link title="NPMパッケージ" target="_blank" icon="JavaScript" href="https://www.npmjs.com/package/@metaplex-foundation/mpl-core" description="npmjs.comのパッケージとバージョン履歴。" /%}
{% /quick-links %}
## インストール
Core SDKとUmiフレームワークをインストール：
```bash {% title="Terminal" %}
npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi-bundle-defaults
```
メタデータアップロード用にアップローダープラグインを追加：
```bash {% title="Terminal" %}
npm install @metaplex-foundation/umi-uploader-irys
```
## Umiセットアップ
Coreプラグインを使用してUmiインスタンスを作成・設定：
```ts {% title="setup-umi.ts" %}
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplCore } from '@metaplex-foundation/mpl-core'
import { keypairIdentity } from '@metaplex-foundation/umi'
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'
// RPCエンドポイントでUmiを作成
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplCore())
  .use(keypairIdentity(yourKeypair))
  .use(irysUploader()) // オプション：メタデータアップロード用
```
{% totem %}
{% totem-accordion title="ファイルからKeypairをロード" %}
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
  .use(walletAdapterIdentity(wallet)) // @solana/wallet-adapter-reactから
```
{% /totem-accordion %}
{% /totem %}
## Asset
### Assetの作成
`create()`を使用して新しいCore Assetをミント：
{% code-tabs-imported from="core/create-asset" frameworks="umi" /%}
### Assetの転送
`transfer()`を使用してAssetを別のウォレットに送信：
{% code-tabs-imported from="core/transfer-asset" frameworks="umi" /%}
### Assetのバーン
`burn()`を使用してAssetを永久に破棄しrentを回収：
{% code-tabs-imported from="core/burn-asset" frameworks="umi" /%}
### Assetの更新
`update()`を使用してAssetのメタデータを変更：
{% code-tabs-imported from="core/update-asset" frameworks="umi" /%}
## Collection
### Collectionの作成
`createCollection()`を使用してCollectionアカウントを作成：
{% code-tabs-imported from="core/create-collection" frameworks="umi" /%}
### Collection内にAssetを作成
`create()`に`collection`パラメータを渡す：
{% code-tabs-imported from="core/create-asset-in-collection" frameworks="umi" /%}
## プラグイン
プラグインはAssetとCollectionに動作を追加します。作成時または後から追加できます。
### 作成時にプラグインを追加
{% code-tabs-imported from="core/create-asset-with-plugins" frameworks="umi" /%}
### 既存のAssetにプラグインを追加
{% code-tabs-imported from="core/add-plugin" frameworks="umi" /%}
### 一般的なプラグインタイプ
| プラグイン | タイプ文字列 | 目的 |
|--------|-------------|---------|
| Royalties | `'Royalties'` | クリエイターロイヤリティの強制 |
| Freeze Delegate | `'FreezeDelegate'` | 凍結/解凍を許可 |
| Burn Delegate | `'BurnDelegate'` | 委任者によるバーンを許可 |
| Transfer Delegate | `'TransferDelegate'` | 委任者による転送を許可 |
| Update Delegate | `'UpdateDelegate'` | メタデータ更新を許可 |
| Attributes | `'Attributes'` | オンチェーンのキー/バリューデータ |
| Permanent Freeze | `'PermanentFreezeDelegate'` | 永久凍結状態 |
| Permanent Transfer | `'PermanentTransferDelegate'` | 永久転送委任 |
| Permanent Burn | `'PermanentBurnDelegate'` | 永久バーン委任 |
詳細なプラグインドキュメントは[プラグイン概要](/ja/smart-contracts/core/plugins)を参照してください。
## Assetの取得
### 単一Assetの取得
{% code-tabs-imported from="core/fetch-asset" frameworks="umi" /%}
### オーナーによるAsset取得（DAS）
DAS APIを使用してインデックス化されたAssetをクエリ：
```ts {% title="fetch-by-owner.ts" %}
import { publicKey } from '@metaplex-foundation/umi'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'
// UmiにDASプラグインを追加
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplCore())
  .use(dasApi())
const owner = publicKey('OwnerAddressHere...')
const assets = await umi.rpc.getAssetsByOwner({
  owner,
  limit: 100,
})
console.log('所有Asset数:', assets.items.length)
```
### CollectionによるAsset取得（DAS）
```ts {% title="fetch-by-collection.ts" %}
import { publicKey } from '@metaplex-foundation/umi'
const collectionAddress = publicKey('CollectionAddressHere...')
const assets = await umi.rpc.getAssetsByGroup({
  groupKey: 'collection',
  groupValue: collectionAddress,
  limit: 100,
})
console.log('CollectionのAsset数:', assets.items.length)
```
## メタデータのアップロード
UmiのアップローダープラグインでメタデータJSONを保存：
```ts {% title="upload-metadata.ts" %}
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplCore())
  .use(keypairIdentity(yourKeypair))
  .use(irysUploader())
// まず画像をアップロード
const imageFile = await fs.promises.readFile('image.png')
const [imageUri] = await umi.uploader.upload([imageFile])
// メタデータJSONをアップロード
const uri = await umi.uploader.uploadJson({
  name: 'My NFT',
  description: 'An awesome NFT',
  image: imageUri,
  attributes: [
    { trait_type: 'Background', value: 'Blue' },
    { trait_type: 'Rarity', value: 'Rare' },
  ],
})
console.log('メタデータURI:', uri)
```
## トランザクションパターン
### 送信と確認
標準パターンは確認を待機：
```ts {% title="send-confirm.ts" %}
const result = await create(umi, { asset, name, uri }).sendAndConfirm(umi)
console.log('署名:', result.signature)
```
### カスタム確認オプション
```ts {% title="custom-confirm.ts" %}
const result = await create(umi, { asset, name, uri }).sendAndConfirm(umi, {
  confirm: { commitment: 'finalized' },
})
```
### 送信せずにトランザクションを構築
```ts {% title="build-only.ts" %}
const tx = create(umi, { asset, name, uri })
const builtTx = await tx.buildAndSign(umi)
// 後で送信: await umi.rpc.sendTransaction(builtTx)
```
### 複数の命令を組み合わせ
```ts {% title="combine-instructions.ts" %}
import { transactionBuilder } from '@metaplex-foundation/umi'
const tx = transactionBuilder()
  .add(create(umi, { asset: asset1, name: 'NFT 1', uri: uri1 }))
  .add(create(umi, { asset: asset2, name: 'NFT 2', uri: uri2 }))
await tx.sendAndConfirm(umi)
```
## 一般的なエラー
### `Account does not exist`
Assetまたはcollectionアドレスが存在しません。アドレスが正しいか確認：
```ts
const asset = await fetchAsset(umi, assetAddress).catch(() => null)
if (!asset) {
  console.log('Assetが見つかりません')
}
```
### `Invalid authority`
このアクションを実行する権限がありません。以下を確認：
- Assetを所有している（転送、バーンの場合）
- update authorityである（更新の場合）
- 必要な委任権限を持っている
### `Insufficient funds`
ウォレットにSOLが不足しています。以下で補充：
```bash
solana airdrop 1 <WALLET_ADDRESS> --url devnet
```
### `Asset already exists`
Asset keypairはすでに使用されています。新しいsignerを生成：
```ts
const assetSigner = generateSigner(umi) // 一意である必要がある
```
### `Plugin not found`
このAssetにプラグインが存在しません。インストール済みプラグインを確認：
```ts
const asset = await fetchAsset(umi, assetAddress)
console.log('プラグイン:', Object.keys(asset))
```
## 注意事項
- 新しいAssetには常に新しいkeypairを使用 - keypairを再利用しないでください
- `create()`の`asset`パラメータは公開鍵だけでなくsignerである必要がある
- Collectionレベルのプラグインは同じタイプのAssetレベルプラグインを上書きする
- 作成後すぐに取得するAssetには`commitment: 'finalized'`を使用
- トランザクションビルダーは不変 - 各メソッドは新しいビルダーを返す
## クイックリファレンス
### 最小限の依存関係
```json {% title="package.json" %}
{
  "dependencies": {
    "@metaplex-foundation/mpl-core": "^1.0.0",
    "@metaplex-foundation/umi": "^0.9.0",
    "@metaplex-foundation/umi-bundle-defaults": "^0.9.0"
  }
}
```
### コア関数
| 関数 | 目的 |
|----------|---------|
| `create()` | 新しいAssetを作成 |
| `createCollection()` | 新しいCollectionを作成 |
| `transfer()` | Assetの所有権を転送 |
| `burn()` | Assetを破棄 |
| `update()` | Assetのメタデータを更新 |
| `updateCollection()` | Collectionのメタデータを更新 |
| `addPlugin()` | Assetにプラグインを追加 |
| `addCollectionPlugin()` | Collectionにプラグインを追加 |
| `updatePlugin()` | 既存のプラグインを更新 |
| `removePlugin()` | Assetからプラグインを削除 |
| `fetchAsset()` | アドレスでAssetを取得 |
| `fetchCollection()` | アドレスでCollectionを取得 |
### プログラムID
| ネットワーク | アドレス |
|---------|---------|
| Mainnet | `CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d` |
| Devnet | `CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d` |
## FAQ
### Core JavaScript SDKとは何ですか？
Core JavaScript SDK（`@metaplex-foundation/mpl-core`）は、Solana上のMetaplex Core NFTを操作するためのTypeScriptライブラリです。AssetとCollectionの作成、転送、バーン、管理のための型安全な関数を提供します。
### このSDKを使用するにはUmiが必要ですか？
はい。Core SDKはUmiフレームワーク上に構築されており、ウォレット接続、RPC通信、トランザクション構築を処理します。`@metaplex-foundation/mpl-core`と`@metaplex-foundation/umi-bundle-defaults`の両方をインストールしてください。
### ブラウザウォレットを接続するにはどうすればよいですか？
`@metaplex-foundation/umi-signer-wallet-adapters`パッケージをウォレットアダプターと一緒に使用：
```ts
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters'
umi.use(walletAdapterIdentity(wallet))
```
### sendAndConfirmとsendの違いは何ですか？
`sendAndConfirm()`はトランザクションの確認を待ってから返します。`send()`はブロードキャスト後すぐに返します。トランザクションの成功を確認するために、ほとんどの場合は`sendAndConfirm()`を使用してください。
### 複数の操作をバッチ処理するにはどうすればよいですか？
`transactionBuilder()`を使用して命令を組み合わせますが、Solanaのトランザクションサイズ制限（約1232バイト）に注意してください。大きなバッチの場合は、複数のトランザクションを送信してください。
### このSDKはReact/Next.jsで使用できますか？
はい。SDKはブラウザとNode.js環境の両方で動作します。Reactの場合は、`@solana/wallet-adapter-react`のウォレットアダプターをUmiのウォレットアダプターアイデンティティと一緒に使用してください。
### エラーの処理方法は？
SDK呼び出しをtry/catchブロックでラップします。SDKはプログラムエラーコードを含む型付きエラーをスローします：
```ts
try {
  await transfer(umi, { asset, newOwner }).sendAndConfirm(umi)
} catch (error) {
  console.error('転送失敗:', error.message)
}
```
### 完全なAPIドキュメントはどこで見つけられますか？
完全な関数シグネチャと型については、[TypeDoc APIリファレンス](https://mpl-core.typedoc.metaplex.com/)を参照してください。
## 用語集
| 用語 | 定義 |
|------|------------|
| **Umi** | ウォレットとRPC管理を備えたSolanaアプリケーション構築のためのMetaplexフレームワーク |
| **Asset** | 所有権、メタデータ、プラグインを持つNFTを表すCoreのオンチェーンアカウント |
| **Collection** | 関連するAssetをグループ化し、コレクション全体のプラグインを適用できるCoreアカウント |
| **Signer** | トランザクションに署名できるキーペア（新しいアカウントの作成に必要） |
| **Plugin** | AssetまたはCollectionに動作を追加するモジュール式拡張機能 |
| **URI** | 名前、画像、属性を含むJSONファイルを指すオフチェーンメタデータURL |
| **DAS** | Digital Asset Standard - RPCプロバイダーからインデックス化されたNFTデータをクエリするためのAPI |
| **Transaction Builder** | 送信前にトランザクションを構築する不変オブジェクト |
| **Identity** | Umiでトランザクション署名者として設定されたウォレット/キーペア |
| **Commitment** | Solanaの確認レベル（processed、confirmed、finalized） |
