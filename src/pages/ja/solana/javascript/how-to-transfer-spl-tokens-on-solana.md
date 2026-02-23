---
# remember to update dates also in /components/products/guides/index.js
title: SolanaでSPLトークンを送信・転送する方法
metaTitle: SolanaでSPLトークンを送信・転送する方法 | ガイド
description: MetaplexパッケージでSolanaブロックチェーン上でJavaScriptを使用してSPLトークンを送信・転送する方法を学習します。
created: '06-16-2024'
updated: '06-24-2024'
keywords:
  - transfer SPL tokens
  - send SPL tokens
  - Solana token transfer
  - Associated Token Account
  - Metaplex Umi
about:
  - SPL token transfers
  - Associated Token Accounts
  - Metaplex Umi
proficiencyLevel: Intermediate
programmingLanguage:
  - TypeScript
howToSteps:
  - Set up a new project and install Umi and mpl-toolbox packages
  - Configure Umi with a wallet that holds SPL tokens
  - Find the Associated Token Accounts for sender and receiver
  - Use the transferTokens function to create a transfer instruction
  - Send and confirm the transaction on the Solana blockchain
howToTools:
  - Metaplex Umi
  - mpl-toolbox
---

このガイドでは、Metaplex UmiクライアントラッパーとMPL Toolboxパッケージを利用してSolanaブロックチェーン上でSPLトークンを送信・転送するJavaScript関数を構築する方法を紹介します。

このガイドでは、転送するためのSPLトークンがウォレット内にある必要があります。ウォレット内にない場合は、誰かに転送してもらうか、他の[SPLトークン作成ガイド](/ja/guides/javascript/how-to-create-an-spl-token-on-solana)に従う必要があります。

## 前提条件

- お好みのコードエディタ（Visual Studio Codeを推奨）
- Node 18.x.x以上

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
import {
  findAssociatedTokenPda,
  mplToolbox,
  transferTokens,
} from '@metaplex-foundation/mpl-toolbox'
import { keypairIdentity, publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { base58 } from '@metaplex-foundation/umi/serializers'
import fs from 'fs'
import path from 'path'

const transferSplTokens = async () => {
  const umi = createUmi("https://api.devnet.solana.com").use(mplToolbox())

  // 転送したいSPLトークンを持つウォレットをインポート
  const walletFile = fs.readFileSync('./keypair.json')

  // walletFileをキーペアに変換
  let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(walletFile))

  // キーペアをumiに読み込み
  umi.use(keypairIdentity(keypair))

//
  // 主要アカウント
  //

  // 転送したいトークンのアドレス
  const splToken = publicKey("111111111111111111111111111111");

  // トークンを転送したいウォレットのアドレス
  const destinationWallet = publicKey("22222222222222222222222222222222");

  // 送信者のウォレットのSPLトークンに関連するトークンアカウントを見つける
  const sourceTokenAccount = findAssociatedTokenPda(umi, {
    mint: splToken,
    owner: umi.identity.publicKey,
  });

  // 受信者のウォレットのSPLトークンに関連するトークンアカウントを見つける
  const destinationTokenAccount = findAssociatedTokenPda(umi, {
    mint: splToken,
    owner: destinationWallet,
  });

  //
  // SPLトークンの転送
  //

  const res = await transferTokens(umi, {
    source: sourceTokenAccount,
    destination: destinationTokenAccount,
    amount: 10000, // 転送するトークンの数量
  }).sendAndConfirm(umi);

  // 最後に、チェーンで確認できるシグネチャをデシリアライズできます
  const signature = base58.deserialize(res.signature)[0];

  // シグネチャとトランザクション、NFTへのリンクをログ出力
  console.log("\n転送完了")
  console.log("SolanaFMでトランザクションを表示");
  console.log(`https://solana.fm/tx/${signature}?cluster=devnet-alpha`);
}

transferSplTokens()
```
