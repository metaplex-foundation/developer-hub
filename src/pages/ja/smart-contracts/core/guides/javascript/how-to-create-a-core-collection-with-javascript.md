---
title: JavascriptでCore Collectionを作成する方法
metaTitle: JavascriptでCore Collectionを作成する方法 | Coreガイド
description: Metaplex Core JavaScriptパッケージを使用してSolana上でCore Collectionを作成する方法を学びます。
created: '08-21-2024'
updated: '01-31-2026'
keywords:
  - create collection JavaScript
  - NFT collection tutorial
  - mpl-core collection
  - Solana collection
about:
  - Collection creation
  - JavaScript tutorial
  - Umi framework
proficiencyLevel: Beginner
programmingLanguage:
  - JavaScript
  - TypeScript
howToSteps:
  - 新しいNode.jsプロジェクトを設定し依存関係をインストール
  - ウォレットとRPCエンドポイントでUmiを設定
  - コレクション画像とメタデータをアップロード
  - createCollection()を使用してCollectionを作成
  - Collectionが正常に作成されたことを確認
howToTools:
  - Node.js
  - Umiフレームワーク
  - mpl-core SDK
  - IrysまたはIPFS（ストレージ用）
---
このガイドでは、`@metaplex-foundation/mpl-core` Javascript SDKパッケージを使用して、Metaplex Coreオンチェーンプログラムで**Core Collection**を作成する方法を示します。
{% callout title="Coreとは？" %}
**Core**はシングルアカウント設計を使用し、代替ソリューションと比較してミントコストを削減し、Solanaネットワーク負荷を改善します。また、開発者がアセットの動作と機能を変更できる柔軟なプラグインシステムを持っています。
{% /callout %}
始める前に、Collectionsについて説明しましょう：
{% callout title="Collectionsとは？" %}
Collectionsは、同じシリーズやグループに属するAssetsのグループです。Assetsをグループ化するには、まずコレクション名やコレクション画像などのそのコレクションに関連するメタデータを保存することを目的としたCollection Assetを作成する必要があります。Collection Assetはコレクションの表紙として機能し、コレクション全体のプラグインも保存できます。
{% /callout %}
## 前提条件
- お好みのコードエディタ（**Visual Studio Code**を推奨）
- Node **18.x.x**以上。
## 初期設定
このガイドでは、単一ファイルスクリプトに基づいてJavascriptでCore Collectionを作成する方法を教えます。ニーズに合わせて関数を変更・移動する必要があるかもしれません。
### プロジェクトの初期化
お好みのパッケージマネージャー（npm、yarn、pnpm、bun）で新しいプロジェクトを初期化し（オプション）、プロンプトが表示されたら必要な詳細を入力します。
```js
npm init
```
### 必要なパッケージ
このガイドに必要なパッケージをインストールします。
{% packagesUsed packages=["umi", "umiDefaults", "core", "@metaplex-foundation/umi-uploader-irys"] type="npm" /%}
```js
npm i @metaplex-foundation/umi
```
```js
npm i @metaplex-foundation/umi-bundle-defaults
```
```js
npm i @metaplex-foundation/mpl-core
```
```js
npm i @metaplex-foundation/umi-uploader-irys;
```
### インポートとラッパー関数
ここでは、このガイドに必要なすべてのインポートを定義し、すべてのコードを実行するラッパー関数を作成します。
```ts
import {
  createCollection,
  mplCore
} from '@metaplex-foundation/mpl-core'
import {
  createGenericFile,
  generateSigner,
  signerIdentity,
  sol,
} from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'
import { base58 } from '@metaplex-foundation/umi/serializers'
import fs from 'fs'
import path from 'path'
// ラッパー関数を作成
const createCollection = async () => {
  ///
  ///
  ///  すべてのコードはここに記述
  ///
  ///
}
// ラッパー関数を実行
createCollection()
```
## Umiの設定
Umiを設定する際、さまざまなソースからキーペア/ウォレットを使用または生成できます。テスト用に新しいウォレットを作成したり、ファイルシステムから既存のウォレットをインポートしたり、ウェブサイト/dAppを作成する場合は`walletAdapter`を使用できます。
**注意**: この例では`generatedSigner()`でUmiを設定しますが、以下のすべての設定方法を見つけることができます！
{% totem %}
{% totem-accordion title="新しいウォレットで" %}
```ts
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplCore())
  .use(
    irysUploader({
      // メインネットアドレス: "https://node1.irys.xyz"
      // devnetアドレス: "https://devnet.irys.xyz"
      address: 'https://devnet.irys.xyz',
    })
  )
const signer = generateSigner(umi)
umi.use(signerIdentity(signer))
// これはテスト用にdevnetでのみSOLをエアドロップします。
console.log('identityに1 SOLをエアドロップ中')
await umi.rpc.airdrop(umi.identity.publickey)
```
{% /totem-accordion %}
{% totem-accordion title="既存のウォレットで" %}
```ts
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplCore())
    .use(
    irysUploader({
      // メインネットアドレス: "https://node1.irys.xyz"
      // devnetアドレス: "https://devnet.irys.xyz"
      address: 'https://devnet.irys.xyz',
    })
  )
// 新しいキーペアサイナーを生成
const signer = generateSigner(umi)
// fsを使用し、ファイルシステムをナビゲートして
// 相対パスで使用したいウォレットを読み込む必要があります。
const walletFile = fs.readFileSync('./keypair.json')

// walletFileをキーペアに変換
let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(walletFile));
// キーペアをumiに読み込み
umi.use(keypairIdentity(umiSigner));
```
{% /totem-accordion %}
{% totem-accordion title="Wallet Adapterで" %}
```ts
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters'
import { useWallet } from '@solana/wallet-adapter-react'
const wallet = useWallet()
const umi = createUmi('https://api.devnet.solana.com')
.use(mplCore())
// Wallet AdapterをUmiに登録
.use(walletAdapterIdentity(wallet))
```
{% /totem-accordion %}
{% /totem %}
**注意**: `walletAdapter`セクションは、`walletAdapter`がすでにインストールされセットアップされていることを前提として、Umiに接続するために必要なコードのみを提供します。包括的なガイドについては、[こちら](https://github.com/anza-xyz/wallet-adapter/blob/master/APP.md)を参照してください。
## Collectionのメタデータの作成
ウォレットやExplorerでCollectionの認識可能な画像を表示するには、メタデータを保存するURIを作成する必要があります！
### 画像のアップロード
Umiには、`Arweave`、`NftStorage`、`AWS`、`ShdwDrive`などのストレージソリューションにアップロードできるダウンロード可能なストレージプラグインが付属しています。このガイドでは、Arweaveにコンテンツを保存する`irysUploader()`プラグインを使用します。
この例では、Irysを使用してArweaveにアップロードするローカルアプローチを使用します。ブラウザから別のストレージプロバイダーにファイルをアップロードしたい場合は、別のアプローチが必要です。ブラウザシナリオでは`fs`のインポートと使用は機能しません。
```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'
import fs from 'fs'
import path from 'path'
// Umiを作成しIrysを使用するよう指示
const umi = createUmi('https://api.devnet.solana.com')
  .use(irysUploader())
// `fs`を使用して文字列パスでファイルを読み込む
// コンピューティングの観点からパスの概念を理解する必要があります。
const imageFile = fs.readFileSync(
  path.join(__dirname, '..', '/assets/my-image.jpg')
)
// `createGenericFile`を使用してファイルをumiが理解できる`GenericFile`型に変換
// mimeタグタイプを正しく設定しないとArweaveは画像を表示する方法がわかりません。
const umiImageFile = createGenericFile(imageFile, 'my-image.jpeg', {
  tags: [{ name: 'Content-Type', value: 'image/jpeg' }],
})
// ここでIrys経由でArweaveに画像をアップロードし、
// ファイルが配置されているuriアドレスが返されます。
// これをログ出力できますが、uploaderはファイルの配列を受け取るため
// uriの配列も返します。
// 欲しいuriを取得するには配列のインデックス[0]を呼び出します。
const imageUri = await umi.uploader.upload([umiImageFile]).catch((err) => {
  throw new Error(err)
})
console.log(imageUri[0])
```
### メタデータのアップロード
有効で動作する画像URIができたら、コレクションのメタデータの作成を開始できます。
ファンジブルトークンのオフチェーンメタデータの標準は以下の通りです。これはJavascript内のオブジェクト`{}`に記述するか、`metadata.json`ファイルに保存する必要があります。
JavaScriptオブジェクトアプローチを見ていきます。
```ts
const metadata = {
  name: 'My Collection',
  description: 'This is a Collection on Solana',
  image: imageUri[0],
  external_url: 'https://example.com',
  properties: {
    files: [
      {
        uri: imageUri[0],
        type: 'image/jpeg',
      },
    ],
    category: 'image',
  },
}
```
ここのフィールドには以下が含まれます：
| フィールド    | 説明                                                                                                                                                                               |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name          | Collectionの名前。                                                                                                                                                              |
| description   | Collectionの説明。                                                                                                                                                       |
| image         | 以前アップロードした`imageUri`（または画像のオンライン上の場所）に設定されます。                                                                                     |
| animation_url | アップロードした`animation_url`（またはビデオ/glbのオンライン上の場所）に設定されます。                                                                                   |
| external_url  | 選択した外部アドレスにリンクします。通常はプロジェクトのウェブサイトです。                                                                                             |
| properties    | `{uri: string, type: mimeType}`の`[] array`を取る`files`フィールドを含みます。また、`image`、`audio`、`video`、`vfx`、`html`に設定できるカテゴリフィールドも含みます |
メタデータを作成したら、Collectionにアタッチするためのuriを取得するためにJSONファイルとしてアップロードする必要があります。これを行うには、Umiの`uploadJson()`関数を使用します：
```js
// Umiの`uploadJson()`関数を呼び出してIrys経由でArweaveにメタデータをアップロード
const metadataUri = await umi.uploader.uploadJson(metadata).catch((err) => {
  throw new Error(err)
})
```
この関数は、アップロード前にJavaScriptオブジェクトを自動的にJSONに変換します。
これで、エラーがスローされなければ、`metadataUri`にJSONファイルのURIが最終的に保存されているはずです。
### Core Collectionのミント
ここから、`@metaplex-foundation/mpl-core`パッケージの`createCollection`関数を使用してCore NFT Assetを作成できます。
```ts
const collection = generateSigner(umi)
const tx = await createCollection(umi, {
  collection,
  name: 'My Collection',
  uri: metadataUri,
}).sendAndConfirm(umi)
const signature = base58.deserialize(tx.signature)[0]
```
そして、以下のように詳細をログ出力します：
```ts
// 署名とトランザクションとNFTへのリンクをログ出力
console.log('\nCollection Created')
console.log('View Transaction on Solana Explorer')
console.log(`https://explorer.solana.com/tx/${signature}?cluster=devnet`)
console.log('\n')
console.log('View Collection on Metaplex Explorer')
console.log(`https://core.metaplex.com/explorer/${collection.publicKey}?env=devnet`)
```
### 追加アクション
続ける前に、`FreezeDelegate`プラグインや`AppData`外部プラグインなど、プラグインや外部プラグインがすでに含まれたコレクションを作成したい場合はどうすればよいでしょうか？以下にその方法を示します。
`createCollection()`命令は、`plugins`フィールドを通じて通常のプラグインと外部プラグインの両方の追加をサポートしています。特定のプラグインに必要なすべてのフィールドを簡単に追加するだけで、すべてが命令によって処理されます。
以下はその方法の例です：
```typescript
const collection = generateSigner(umi)
const tx = await createCollection(umi, {
  collection: collection,
  name: 'My Collection',
  uri: 'https://example.com/my-collection.json',
  plugins: [
    {
      type: "PermanentFreezeDelegate",
      frozen: true,
      authority: { type: "UpdateAuthority"}
    },
    {
      type: "AppData",
      dataAuthority: { type: "UpdateAuthority"},
      schema: ExternalPluginAdapterSchema.Binary,
    }
  ]
}).sendAndConfirm(umi)
const signature = base58.deserialize(tx.signature)[0]
```
**注意**: 使用するフィールドとプラグインがわからない場合は、[ドキュメント](/smart-contracts/core/plugins)を参照してください！
