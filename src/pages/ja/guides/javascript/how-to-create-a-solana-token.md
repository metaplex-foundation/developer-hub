---
title: Solanaトークンの作成方法
metaTitle: Solanaトークンの作成方法 | ガイド
description: Metaplexパッケージを使用してSolanaブロックチェーン上でSPLトークン/ミームコインを作成する方法を学習します。
# remember to update dates also in /components/guides/index.js
created: '04-19-2024'
updated: '04-19-2025'
---

このステップバイステップガイドでは、SolanaブロックチェーンでSolanaトークン（SPLトークン）を作成する方法を説明します。Metaplex UmiクライアントラッパーとMpl ToolboxパッケージをJavaScriptで使用できます。これにより、スクリプトやフロントエンドおよびバックエンドフレームワークで使用できる関数を作成できます。

## 前提条件

- お好みのコードエディタ（Visual Studio Codeを推奨）
- Node 18.x.x以上

## 初期設定

npm、yarn、pnpm、bunなどのパッケージマネージャーを使用して新しいプロジェクト（オプション）を作成することから始めます。問い合わせられた際に必要な情報を入力してください。

```js
npm init
```

### 必要なパッケージ

このガイドに必要なパッケージをインストールします。

```js
npm i @metaplex-foundation/umi
```

```js
npm i @metaplex-foundation/umi-bundle-defaults
```

```js
npm i @metaplex-foundation/mpl-token-metadata
```

```js
npm i @metaplex-foundation/umi-uploader-irys
```

```js
npm i @metaplex-foundation/mpl-toolbox
```

### インポートとラッパー関数

このガイドでは、必要なインポートをすべてリストし、コードを実行するためのラッパー関数を作成します。

```ts
import {
  createFungible,
  mplTokenMetadata,
} from '@metaplex-foundation/mpl-token-metadata'
import {
  createTokenIfMissing,
  findAssociatedTokenPda,
  getSplAssociatedTokenProgramId,
  mintTokensTo,
} from '@metaplex-foundation/mpl-toolbox'
import {
  generateSigner,
  percentAmount,
  createGenericFile,
  signerIdentity,
  sol,
} from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'
import { base58 } from '@metaplex-foundation/umi/serializers'
import fs from 'fs'
import path from 'path'

// ラッパー関数の作成
const createAndMintTokens = async () => {
  ///
  ///
  ///  すべてのコードはここに入ります
  ///
  ///
}

// ラッパー関数を実行
createAndMintTokens()
```

## Umiのセットアップ

この例では、`generatedSigner()`を使用してUmiをセットアップします。ウォレットや署名者を異なる方法でセットアップしたい場合は、[**Umiへの接続**](/ja/dev-tools/umi/getting-started)ガイドをご確認ください。

umi変数とコードブロックは`createAndMintTokens()`関数の内外のどちらにでも配置できます。重要なのは、`umi`変数が`createAndMintTokens()`関数自体からアクセス可能であることです。

### 新しいウォレットの生成

```ts
const umi = createUmi("https://api.devnet.solana.com")
  .use(mplCore())
  .use(irysUploader())

// 新しいキーペア署名者を生成
const signer = generateSigner(umi)

// umiに新しい署名者を使用するよう指示
umi.use(signerIdentity(signer))

// アイデンティティに1 SOLをエアドロップ
// 429 too many requestsエラーが発生した場合は、
// デフォルトで提供されている無料のRPC以外を使用する必要があります
await umi.rpc.airdrop(umi.identity.publicKey)
```

### ローカルに保存されている既存のウォレットを使用

```ts
const umi = createUmi("https://api.devnet.solana.com")
  .use(mplTokenMetadata())
  .use(mplToolbox())
  .use(irysUploader())

// fsを使用してファイルシステムをナビゲートし、
// 相対パスで使用したいウォレットを読み込む必要があります
const walletFile = fs.readFileSync('./keypair.json', {encoding: "utf-8"})

// walletFileをキーペアに変換
let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(JSON.parse(walletFile)));

// キーペアをumiに読み込み
umi.use(keypairIdentity(umiSigner));
```

## トークンの作成

### 画像のアップロード

最初に行う必要があるのは、トークンを表現し認識可能にする画像です。これはjpeg、png、またはgifの形式で可能です。

Umiには、Arweave、NftStore、AWS、ShdwDriveにファイルを保存するプラグインがあります。これらのプラグインをダウンロードしてファイルをアップロードできます。このガイドの開始時にirysUploader()プラグインをインストールしており、これはArweaveブロックチェーンにコンテンツを保存するので、それを使用し続けます。

{% callout title="ローカルスクリプト/Node.js" %}
この例では、Irysを使用してArweaveにアップロードするローカルスクリプト/node.jsアプローチを使用しています。異なるストレージプロバイダーにファイルをアップロードしたい場合や、ブラウザからアップロードしたい場合は、異なるアプローチを取る必要があります。ブラウザシナリオでは`fs`をインポートして使用することはできません。
{% /callout %}

```ts
// `fs`を使用して文字列パスでファイルを読み取ります

const imageFile = fs.readFileSync('./image.jpg')

// `createGenericFile`を使用してファイルを
// Umiが理解できる`GenericFile`タイプに変換します。
// mimetagタイプを正しく設定することを確認してください
// そうでないとArweaveが画像を表示する方法を知らなくなります

const umiImageFile = createGenericFile(imageFile, 'image.jpeg', {
  tags: [{ name: 'contentType', value: 'image/jpeg' }],
})

// ここでIrys経由でArweaveに画像をアップロードし、
// ファイルが配置されているURIアドレスが返されます。
// これをログ出力できますが、アップローダーはファイルの配列を受け取るため
// URIの配列も返します。
// 必要なURIを取得するには配列のインデックス[0]を呼び出せます

const imageUri = await umi.uploader.upload([umiImageFile]).catch((err) => {
  throw new Error(err)
})

console.log(imageUri[0])
```

### メタデータのアップロード

有効で動作する画像URIを取得したら、SPLトークンのメタデータの作業を開始できます。

ファンジブルトークンのオフチェーンメタデータの標準は以下のとおりです：

```json
{
  "name": "TOKEN_NAME",
  "symbol": "TOKEN_SYMBOL",
  "description": "TOKEN_DESC",
  "image": "TOKEN_IMAGE_URL"
}
```

ここのフィールドには以下が含まれます：

#### name

トークンの名前。

#### symbol

トークンの略語。SolanaのSOLのようなものです。

#### description

トークンの説明。

#### image

これは、以前にアップロードしたimageUri（または画像のオンライン場所）に設定されます。

```js
// メタデータの例
const metadata = {
  name: 'The Kitten Coin',
  symbol: 'KITTEN',
  description: 'The Kitten Coin is a token created on the Solana blockchain',
  image: imageUri, // 変数を使用するかURIの文字列を貼り付けます
}

// UmiのuploadJson関数を呼び出して、Irys経由でメタデータをArweaveにアップロードします

const metadataUri = await umi.uploader.uploadJson(metadata).catch((err) => {
  throw new Error(err)
})
```

すべてが計画通りに進むと、metadataUri変数にアップロードされたJSONファイルのURIが保存されます。

### トークンの作成

Solanaブロックチェーンで新しいトークンを作成する際、新しいデータに対応するためにいくつかのアカウントを作成する必要があります。

#### Mintアカウントとトークンメタデータの作成

Mintアカウントが小数点以下の桁数、総供給量、ミントおよび凍結権限などのMintの初期ミント詳細を保存する一方で、Token Metadataアカウントは`name`、オフチェーンメタデータ`uri`、トークンの`description`、トークンの`symbol`などのトークンのプロパティを保持します。これらのアカウントが一緒になって、Solana上のSPLトークンのすべての情報を提供します。

以下の`createFungible()`関数は、使用するためのMintアカウントとToken Metadataアカウントの両方を作成します。

関数には、mintアドレスになるキーペアを提供する必要があります。また、JSONファイルから追加のメタデータを提供する必要があります。このメタデータには、トークンの名前とメタデータURIアドレスが含まれます。

```ts
const mintSigner = generateSigner(umi)

const createMintIx = await createFungible(umi, {
  mint: mintSigner,
  name: 'The Kitten Coin',
  uri: metadataUri, // 以前に作成したURIを保存している`metadataUri`変数を使用します
  sellerFeeBasisPoints: percentAmount(0),
  decimals: 9, // トークンに設定したい小数点以下の桁数を設定します
})
```

### トークンのミント

#### トークンアカウント

トークンをすぐにミントする場合、誰かのウォレットにトークンを保存する場所が必要です。これを行うために、ウォレットアドレスとミントアドレスの両方に基づいて数学的にアドレスを生成します。これはAssociated Token Account（ATA）と呼ばれ、時にはトークンアカウントとも呼ばれます。このトークンアカウント（ATA）はウォレットに属し、私たちのトークンを保存してくれます。

#### トークンアカウントの生成

最初に行う必要があるのは、トークンアカウントアドレスが何であるべきかを把握することです。MPL-Toolboxにはまさにそれを行うヘルパー関数があり、存在しない場合はトークンアカウントも作成してくれます。

```ts
const createTokenIx = createTokenIfMissing(umi, {
  mint: mintSigner.publicKey,
  owner: umi.identity.publicKey,
  ataProgram: getSplAssociatedTokenProgramId(umi),
})
```

#### ミントトークントランザクション

トークンアカウントを作成する命令を取得したので、`mintTokenTo()`命令を使用してそのアカウントにトークンをミントできます。

```ts
const mintTokensIx = mintTokensTo(umi, {
  mint: mintSigner.publicKey,
  token: findAssociatedTokenPda(umi, {
    mint: mintSigner.publicKey,
    owner: umi.identity.publicKey,
  }),
  amount: BigInt(1000),
})
```

### トランザクションの送信

複数の方法でトランザクションを送信・配置できますが、この例では命令を一つのアトミックトランザクションにチェーンして、すべてを一度に送信します。ここでいずれかの命令が失敗すると、トランザクション全体が失敗します。

```ts
// .add()で命令をチェーンし、.sendAndConfirm()で送信

const tx = await createFungibleIx
  .add(createTokenIx)
  .add(createTokenAccountIfMissing)
  .add(mintTokensIx)
  .sendAndConfirm(umi)

// 最後に、チェーンで確認できるシグネチャをデシリアライズできます
// import { base58 } from "@metaplex-foundation/umi/serializers";

console.log(base58.deserialize(tx.signature)[0])
```

これでSolanaでトークンを作る方法を知ったので、基本的なプロジェクトアイデアには以下が含まれます：

- solanaトークンクリエーター
- ミームコインジェネレーター

また、JupiterやOrcaなどの分散型取引所でトークンをリストするために流動性プールを作成することも検討できます。

## 完全なコード例

```ts
import {
  createFungible,
  mplTokenMetadata,
} from '@metaplex-foundation/mpl-token-metadata'
import {
  createTokenIfMissing,
  findAssociatedTokenPda,
  getSplAssociatedTokenProgramId,
  mintTokensTo,
} from '@metaplex-foundation/mpl-toolbox'
import {
  generateSigner,
  percentAmount,
  createGenericFile,
  signerIdentity,
  sol,
} from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'
import { base58 } from '@metaplex-foundation/umi/serializers'
import fs from 'fs'
import path from 'path'

const createAndMintTokens = async () => {
  const umi = createUmi("https://api.devnet.solana.com")
    .use(mplTokenMetadata())
    .use(irysUploader())

  const signer = generateSigner(umi)

  umi.use(signerIdentity(signer))

// アイデンティティに1 SOLをエアドロップ
  // 429 too many requestsエラーが発生した場合は、
  // ファイルシステムウォレット方法を使用するか、RPCを変更する必要があります
  console.log("umiアイデンティティに1 SOLをエアドロップ");
  await umi.rpc.airdrop(umi.identity.publicKey, sol(1));

  // `fs`を使用して文字列パスでファイルを読み取ります
  
  const imageFile = fs.readFileSync("./image.jpg");

  // `createGenericFile`を使用してファイルを
  // umiが理解できる`GenericFile`タイプに変換します。
  // mimetagタイプを正しく設定することを確認してください
  // そうでないとArweaveが画像を表示する方法を知らなくなります

  const umiImageFile = createGenericFile(imageFile, "image.png", {
    tags: [{ name: "Content-Type", value: "image/png" }],
  });

  // ここでIrys経由でArweaveに画像をアップロードし、
  // ファイルが配置されているURIアドレスが返されます。
  // これをログ出力できますが、アップローダーはファイルの配列を受け取るため
  // URIの配列も返します。
  // 必要なURIを取得するには配列のインデックス[0]を呼び出せます

  console.log("Irys経由でArweaveに画像をアップロード");
  const imageUri = await umi.uploader.upload([umiImageFile]).catch((err) => {
    throw new Error(err);
  });

  console.log(imageUri[0]);

  // Irys経由でトークンメタデータをArweaveにアップロード

  const metadata = {
    name: "The Kitten Coin",
    symbol: "KITTEN",
    description: "The Kitten Coin is a token created on the Solana blockchain",
    image: imageUri, // 変数を使用するかURIの文字列を貼り付けます
  };

  // UmiのuploadJson関数を呼び出して、Irys経由でメタデータをArweaveにアップロードします

  console.log("Irys経由でメタデータをArweaveにアップロード");
  const metadataUri = await umi.uploader.uploadJson(metadata).catch((err) => {
    throw new Error(err);
  });

  // mintIxの作成

  const mintSigner = generateSigner(umi);

  const createFungibleIx = createFungible(umi, {
    mint: mintSigner,
    name: "The Kitten Coin",
    uri: metadataUri, // 以前に作成したURIを保存している`metadataUri`変数を使用します
    sellerFeeBasisPoints: percentAmount(0),
    decimals: 0, // トークンに設定したい小数点以下の桁数を設定します
  });

  // この命令は、必要に応じて新しいトークンアカウントを作成します。見つかった場合はスキップします

  const createTokenIx = createTokenIfMissing(umi, {
    mint: mintSigner.publicKey,
    owner: umi.identity.publicKey,
    ataProgram: getSplAssociatedTokenProgramId(umi),
  });

  // 最後の命令（必要な場合）は、前のixのトークンアカウントにトークンをミントすることです

  const mintTokensIx = mintTokensTo(umi, {
    mint: mintSigner.publicKey,
    token: findAssociatedTokenPda(umi, {
      mint: mintSigner.publicKey,
      owner: umi.identity.publicKey,
    }),
    amount: BigInt(1000),
  });

  // 最後のステップは、ixをトランザクションでチェーンに送信することです。
  // ここでのIxは省略したり、トランザクションチェーン中に必要に応じて追加できます。
  // 例えば、トークンをミントせずにトークンを作成したい場合は、
  // `createToken` ixのみを送信したい場合があります

  console.log("トランザクションを送信中")
  const tx = await createFungibleIx
    .add(createTokenIx)
    .add(mintTokensIx)
    .sendAndConfirm(umi);

  // 最後に、チェーンで確認できるシグネチャをデシリアライズできます
  const signature = base58.deserialize(tx.signature)[0];

  // シグネチャとトランザクション、NFTへのリンクをログ出力します。
  // エクスプローラリンクはdevnetチェーン用で、クラスターをメインネットに変更できます。
  console.log('\nトランザクション完了')
  console.log('Solana ExplorerでトランザクションをBerlin表示')
  console.log(`https://explorer.solana.com/tx/${signature}?cluster=devnet`)
  console.log('Solana ExplorerでトークンをBerlin表示')
  console.log(`https://explorer.solana.com/address/${mintSigner.publicKey}?cluster=devnet`)
};

createAndMintTokens()
```
