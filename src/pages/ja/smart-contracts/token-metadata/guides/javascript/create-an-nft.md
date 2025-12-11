---
title: SolanaでNFTを作成する方法
metaTitle: SolanaでNFTを作成する方法 | Token Metadata ガイド
description: MetaplexでSolanaブロックチェーンでNFTを作成する方法を学びましょう。
# remember to update dates also in /components/guides/index.js
created: '06-16-2024'
updated: '06-18-2024'
---

これは、Metaplex Token Metadataプロトコルを使用してSolanaブロックチェーンでNFTを作成する方法の初期ガイドです。

## 前提条件

- お好みのコードエディタ（Visual Studio Codeを推奨）
- Node 18.x.x以上

## 初期セットアップ

このガイドでは、単一ファイルスクリプトに基づいたJavaScriptを使用してNFTを作成する方法を説明します。ニーズに合わせて関数を変更および移動する必要があるかもしれません。

### 初期化

お好みのパッケージマネージャー（npm、yarn、pnpm、bun）で新しいプロジェクトを初期化し（オプション）、プロンプトが表示されたら必要な詳細を入力することから始めます。

```js
npm init
```

### 必要なパッケージ

このガイドに必要なパッケージをインストールします。

{% packagesUsed packages=["umi", "umiDefaults" ,"tokenMetadata", "core", "@solana/spl-token"] type="npm" /%}

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
npm i @metaplex-foundation/umi-uploader-irys;
```

### インポートとラッパー関数

ここでは、この特定のガイドに必要なすべてのインポートを定義し、すべてのコードが実行されるラッパー関数を作成します。

```ts
import { createProgrammableNft, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import {
  createGenericFile,
  generateSigner,
  percentAmount,
  signerIdentity,
  sol,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { base58 } from "@metaplex-foundation/umi/serializers";
import fs from "fs";
import path from "path";

// ラッパー関数を作成
const createNft = async () => {
  ///
  ///
  ///  すべてのコードがここに入ります
  ///
  ///
}

// ラッパー関数を実行
createNft()
```

## Umiのセットアップ

この例では、`generatedSigner()`を使用してUmiをセットアップする方法を説明します。この例をReactで試したい場合は、`React - Umi w/ Wallet Adapter`ガイドでUmiをセットアップする必要があります。ウォレットセットアップ以外は、このガイドはfileStorageキーとウォレットアダプターに適用されます。

### 新しいウォレットの生成

```ts
const umi = createUmi("https://devnet-aura.metaplex.com/<YOUR_API_KEY>")
  .use(mplTokenMetadata())
  .use(
    irysUploader({
      // mainnetアドレス: "https://node1.irys.xyz"
      // devnetアドレス: "https://devnet.irys.xyz"
      address: "https://devnet.irys.xyz",
    })
  );

// 新しいキーペア署名者を生成します。
const signer = generateSigner(umi)

// umiに新しい署名者を使用するように指示します。
umi.use(signerIdentity(signer))

// これはテスト用にdevnetでのみSOLをエアドロップします。
await umi.rpc.airdrop(umi.identity.publickey)
```

### 既存のウォレットを使用

```ts
const umi = createUmi("https://devnet-aura.metaplex.com/<YOUR_API_KEY>")
  .use(mplTokenMetadata())
  .use(
    irysUploader({
      // mainnetアドレス: "https://node1.irys.xyz"
      // devnetアドレス: "https://devnet.irys.xyz"
      address: "https://devnet.irys.xyz",
    })
  );

// 新しいキーペア署名者を生成します。
const signer = generateSigner(umi)

// 相対パスを使用して使用したいウォレットを
// ロードするためにfsを使用してファイルシステムを
// ナビゲートする必要があります。
const walletFile = const imageFile = fs.readFileSync(
    path.join(__dirname, './keypair.json')
  )
```

## NFTの作成

### 画像のアップロード

最初にすることは、NFTを表し、認識可能にする画像をアップロードすることです。これはjpeg、png、またはgifの形式にできます。

Umiには、Arweave、NftStorage、AWS、ShdwDriveなどのストレージソリューションにアップロードできるダウンロード可能なストレージプラグインが付属しています。このガイドの始めで、Arweaveブロックチェーンにコンテンツを保存する`irsyUploader()`プラグインをインストールしたので、それを使い続けます。

{% callout title="ローカルスクリプト/Node.js" %}
この例は、ArweaveにアップロードするためにIrysを使用したローカルスクリプト/node.jsアプローチを使用しています。別のストレージプロバイダーにファイルをアップロードしたり、ブラウザからアップロードしたりする場合は、異なるアプローチを取る必要があります。`fs`のインポートと使用は、ブラウザシナリオでは動作しません。
{% /callout %}

```ts
// 文字列パスを介してファイルを読み取るために`fs`を使用します。
// コンピューティング観点からパッシングの概念を理解する必要があります。

const imageFile = fs.readFileSync(
  path.join(__dirname, '..', '/assets/my-image.jpg')
)

// `createGenericFile`を使用して、ファイルをumiが理解できる
// `GenericFile`タイプに変換します。mmiタグタイプを正しく設定していることを
// 確認してください。そうしないと、Arweaveが画像の表示方法を
// 知ることができません。

const umiImageFile = createGenericFile(imageFile, 'my-image.jpeg', {
  tags: [{ name: 'Content-Type', value: 'image/jpeg' }],
})

// ここで、IrysによってArweaveに画像をアップロードし、ファイルが
// 配置されているuriアドレスを取得します。これをログアウトできますが、
// アップローダーはファイルの配列を取ることができるため、uriの配列も返します。
// 欲しいuriを取得するために、配列のインデックス[0]を呼び出すことができます。

const imageUri = await umi.uploader.upload([umiImageFile]).catch((err) => {
  throw new Error(err)
})

console.log(imageUri[0])
```

### メタデータのアップロード

有効で動作する画像URIが得られたら、NFTのメタデータに取り組むことができます。

Fungibleトークンのオフチェーンメタデータの標準は次のとおりです：

```json
{
  "name": "My NFT",
  "description": "This is an NFT on Solana",
  "image": "https://arweave.net/my-image",
  "external_url": "https://example.com/my-nft.json",
  "attributes": [
    {
      "trait_type": "trait1",
      "value": "value1"
    },
    {
      "trait_type": "trait2",
      "value": "value2"
    }
  ],
  "properties": {
    "files": [
      {
        "uri": "https://arweave.net/my-image",
        "type": "image/png"
      }
    ],
    "category": "image"
  }
}
```

ここのフィールドには以下が含まれます

#### name

トークンの名前。

#### symbol

トークンの短縮形。Solanaの短縮形は`SOL`です。

#### description

トークンの説明。

#### image

これは、以前にアップロードしたimageUri（または画像のオンラインの場所）に設定されます。

```js
// IrysによってメタデータをArweaveにアップロードするために、umiのuploadJson関数を呼び出します。

const metadata = {
  "name": "My NFT",
  "description": "This is an NFT on Solana",
  "image": imageUri[0],
  "external_url": "https://example.com/my-nft.json",
  "attributes": [
    {
      "trait_type": "trait1",
      "value": "value1"
    },
    {
      "trait_type": "trait2",
      "value": "value2"
    }
  ],
  "properties": {
    "files": [
      {
        "uri": imageUri[0],
        "type": "image/png"
      }
    ],
    "category": "image"
  }
}

const metadataUri = await umi.uploader.uploadJson(metadata).catch((err) => {
  throw new Error(err)
})
```

すべてが計画通りに進んでいれば、エラーを投げなかった場合、`metadataUri`に保存されたjsonファイルのURIが取得できるはずです。

### NFT vs pNFT

Token Metadataプログラムは、通常のNFTとpNFT（プログラマブル非Fungibleアセット）の2種類のNFTをミントできます。
ここでの2つのタイプのNFTの主な違いは、一つがロイヤルティが強制される（pNFT）で、もう一つはそうでない（NFT）ことです。

#### NFT

- ロイヤルティの強制なし
- 初期セットアップおよび将来の作業がより簡単。

#### pNFT

- 将来の開発に関してより多くのアカウントを扱う。
- ロイヤルティの強制
- 転送を行うプログラムをブロックできるルールセットがあるプログラマブル。

### NFTのミント

ここから、使用したいNFTミント命令のタイプを選択できます。`NFT`または`pNFT`のいずれかです。

#### NFT

```ts
// NFTの署名者を生成します
const nftSigner = generateSigner(umi)

const tx = await createNft(umi, {
  mint: nftSigner,
  sellerFeeBasisPoints: percentAmount(5.5),
  name: 'My NFT',
  uri: metadataUri,
}).sendAndConfirm(umi)

// 最後に、オンチェーンで確認できる署名をデシリアライズできます。
// import { base58 } from "@metaplex-foundation/umi/serializers";

console.log(base58.deserialize(tx.signature)[0])
```

#### pNFT

```ts
// NFTの署名者を生成します
const nftSigner = generateSigner(umi)

// Nftのルールセットを決定します。
// Metaplexルールセット - publicKey("eBJLFYPxJmMGKuFwpDWkzxZeUrad92kZRC5BJLpzyT9")
// 互換性ルールセット - publicKey("AdH2Utn6Fus15ZhtenW4hZBQnvtLgM1YCW2MfVp7pYS5")
const ruleset = null // または上記からpublicKeyを設定

const tx = await createProgrammableNft(umi, {
  mint: nftSigner,
  sellerFeeBasisPoints: percentAmount(5.5),
  name: 'My NFT',
  uri: metadataUri,
  ruleSet: ruleset,
}).sendAndConfirm(umi)

// 最後に、オンチェーンで確認できる署名をデシリアライズできます。
// import { base58 } from "@metaplex-foundation/umi/serializers";

console.log(base58.deserialize(tx.signature)[0])
```

## 完全なコード例

```js
import { createProgrammableNft } from '@metaplex-foundation/mpl-token-metadata'
import {
  createGenericFile,
  generateSigner,
  percentAmount,
  publicKey,
  signerIdentity,
  sol,
} from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { base58 } from '@metaplex-foundation/umi/serializers'
import fs from 'fs'
import path from 'path'

const createNft = async () => {
  //
  // ** Umiのセットアップ **
  //

  const umi = createUmi("https://devnet-aura.metaplex.com/<YOUR_API_KEY>")
    .use(mplTokenMetadata())
  .use(
    irysUploader({
      // mainnetアドレス: "https://node1.irys.xyz"
      // devnetアドレス: "https://devnet.irys.xyz"
      address: "https://devnet.irys.xyz",
    })
  );

  const signer = generateSigner(umi);

  umi.use(signerIdentity(signer));

  // identityに1 SOLをエアドロップ
  // 429 too many requestsエラーが発生した場合、
  // ファイルシステムウォレット方法を使用するか、rpcを変更する必要があるかもしれません。
  console.log("Airdropping 1 SOL to identity");
  await umi.rpc.airdrop(umi.identity.publicKey, sol(1));

  //
  // ** ArweaveにIrysで画像をアップロード **
  //

  // 文字列パスを介してファイルを読み取るために`fs`を使用します。
  // コンピューティング観点からパッシングの概念を理解する必要があります。

  const imageFile = fs.readFileSync(
    path.join(__dirname, "../assets/images/0.png")
  );

  // `createGenericFile`を使用して、ファイルをumiが理解できる
  // `GenericFile`タイプに変換します。mmiタグタイプを正しく設定していることを
  // 確認してください。そうしないと、Arweaveが画像の表示方法を
  // 知ることができません。

  const umiImageFile = createGenericFile(imageFile, "0.png", {
    tags: [{ name: "Content-Type", value: "image/png" }],
  });

  // ここで、IrysによってArweaveに画像をアップロードし、ファイルが
  // 配置されているuriアドレスを取得します。これをログアウトできますが、
  // アップローダーはファイルの配列を取ることができるため、uriの配列も返します。
  // 欲しいuriを取得するために、配列のインデックス[0]を呼び出すことができます。

  console.log("Uploading image...");
  const imageUri = await umi.uploader.upload([umiImageFile]).catch((err) => {
    throw new Error(err);
  });

  //
  // ** ArweaveにIrysでメタデータをアップロード **
  //

  const metadata = {
    name: "My Nft",
    description: "This is an Nft on Solana",
    image: imageUri[0],
    external_url: "https://example.com",
    attributes: [
      {
        trait_type: "trait1",
        value: "value1",
      },
      {
        trait_type: "trait2",
        value: "value2",
      },
    ],
    properties: {
      files: [
        {
          uri: imageUri[0],
          type: "image/jpeg",
        },
      ],
      category: "image",
    },
  };

  // IrysによってメタデータをArweaveにアップロードするために、umiのuploadJson関数を呼び出します。
  console.log("Uploading metadata...");
  const metadataUri = await umi.uploader.uploadJson(metadata).catch((err) => {
    throw new Error(err);
  });

  //
  // ** NFTの作成 **
  //

  // NFTの署名者を生成します
  const nftSigner = generateSigner(umi);

  // Nftのルールセットを決定します。
  // Metaplexルールセット - publicKey("eBJLFYPxJmMGKuFwpDWkzxZeUrad92kZRC5BJLpzyT9")
  // 互換性ルールセット - publicKey("AdH2Utn6Fus15ZhtenW4hZBQnvtLgM1YCW2MfVp7pYS5")
  const ruleset = null // または上記からpublicKeyを設定

  console.log("Creating Nft...");
  const tx = await createProgrammableNft(umi, {
    mint: nftSigner,
    sellerFeeBasisPoints: percentAmount(5.5),
    name: metadata.name,
    uri: metadataUri,
    ruleSet: ruleset,
  }).sendAndConfirm(umi);

  // 最後に、オンチェーンで確認できる署名をデシリアライズできます。
  const signature = base58.deserialize(tx.signature)[0];

  // 署名とトランザクションおよびNFTへのリンクをログアウトします。
  console.log("\npNFT Created")
  console.log("View Transaction on Solana Explorer");
  console.log(`https://explorer.solana.com/tx/${signature}?cluster=devnet`);
  console.log("\n");
  console.log("View NFT on Metaplex Explorer");
  console.log(`https://explorer.solana.com/address/${nftSigner.publicKey}?cluster=devnet`);
}

createNft()
```

## 次に何をしますか？

このガイドは基本的なNFTの作成を手助けしました。ここから[Token Metadataプログラム](/ja/token-metadata)に移動し、コレクションの作成やコレクションへの新しいNFTの追加、およびNFTで実行できる他の様々なインタラクションなどを確認できます。