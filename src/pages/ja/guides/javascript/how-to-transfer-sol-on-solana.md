---
title: SolanaでSOLを送信・転送する方法
metaTitle: SolanaでSOLを送信・転送する方法 | ガイド
description: SolanaブロックチェーンでJavaScriptを使用してSOLを送信・転送する方法を学習します。
# remember to update dates also in /components/guides/index.js
created: '06-16-2024'
updated: '06-24-2024'
---

このガイドでは、Metaplex UmiクライアントラッパーとMPL Toolboxパッケージを利用して、Solanaブロックチェーン上であるウォレットから別のウォレットにSOLを転送するJavaScript関数を構築する方法を紹介します。

## 前提条件

- お好みのコードエディタ（Visual Studio Codeを推奨）
- Node 18.x.x以上
- 基本的なJavaScriptの知識

## 初期設定

### 初期化

お好みのパッケージマネージャー（npm、yarn、pnpm、bun）で新しいプロジェクトを初期化し（オプション）、促される際に必要な詳細を入力することから始めます。

```js
npm init
```

### 必要なパッケージ

このガイドに必要なパッケージをインストールします。

{% packagesUsed packages=["umi", "umiDefaults" ,"toolbox"] type="npm" /%}

```js
npm i @metaplex-foundation/umi
```

```js
npm i @metaplex-foundation/umi-bundle-defaults
```

```js
npm i @metaplex-foundation/mpl-toolbox
```

### インポートとラッパー関数

ここで、この特定のガイドに必要なすべてのインポートを定義し、すべてのコードが実行されるラッパー関数を作成します。

```ts
import { mplToolbox, transferSol } from '@metaplex-foundation/mpl-toolbox'
import {
  generateSigner,
  publicKey,
  signerIdentity,
  sol,
} from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { base58 } from '@metaplex-foundation/umi/serializers'

// ラッパー関数の作成
const transfer = async () => {
  ///
  ///
  ///  すべてのコードはここに入ります
  ///
  ///
}

// ラッパー関数を実行
transfer()
```

## Umiのセットアップ

この例では、`generatedSigner()`を使用してUmiをセットアップします。ウォレットや署名者を異なる方法でセットアップしたい場合は、[**Umiへの接続**](/ja/dev-tools/umi/getting-started)ガイドをご確認ください。

### 新しいウォレットの生成

テストに使用する新しいウォレット/秘密鍵を生成したい場合は、`umi`で新しい署名者を生成できます。

```ts
const umi = createUmi("https://api.devnet.solana.com")
  .use(mplToolbox())

// 新しいキーペア署名者を生成
const signer = generateSigner(umi)

// Umiに新しい署名者を使用するよう指示
umi.use(signerIdentity(signer))

// これはテスト用にdevnetでのみSOLをエアドロップします
await umi.rpc.airdrop(umi.identity.publicKey)
```

### ローカルに保存されている既存のウォレットを使用

```ts
import fs from 'fs';

const umi = createUmi("https://api.devnet.solana.com")
  .use(mplToolbox())

// fsを使用してファイルシステムをナビゲートし、
// 相対パスで使用したいウォレットを読み込む必要があります
const walletFile = fs.readFileSync('./keypair.json')

// walletFileをキーペアに変換
let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(walletFile));

// キーペアをumiに読み込み
umi.use(keypairIdentity(keypair));
```

## SOLの転送

`mpl-toolbox`パッケージは、ブロックチェーンで転送を実行するために必要な命令を作成する`transferSol`というヘルパー関数を提供しています。

```ts
// ここでtransferSol()関数を呼び出し、チェーンに送信します

const res = await transferSol(umi, {
  source: umi.identity,
  destination: publicKey('111111111111111111111111111111'),
  amount: sol(1),
}).sendAndConfirm(umi)
```

## 完全なコード例

```ts
import { mplToolbox, transferSol } from '@metaplex-foundation/mpl-toolbox'
import {
  generateSigner,
  publicKey,
  signerIdentity,
  sol,
} from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { base58 } from '@metaplex-foundation/umi/serializers'

const transfer = async () => {
  const umi = createUmi("https://api.devnet.solana.com").use(mplToolbox())

  const signer = generateSigner(umi)

  umi.use(signerIdentity(signer))

  // アイデンティティに1 SOLをエアドロップ
  // 429 too many requestsエラーが発生した場合は、
  // ファイルシステムウォレット方法を使用するかRPCを変更する必要があります
  await umi.rpc.airdrop(umi.identity.publicKey, sol(1))

  //
  // SOLの転送
  //

  const res = await transferSol(umi, {
    source: umi.identity,
    destination: publicKey('111111111111111111111111111111'),
    amount: sol(1),
  }).sendAndConfirm(umi)

  // トランザクションのシグネチャをログ
  console.log(base58.deserialize(res.signature))
}

transfer()
```