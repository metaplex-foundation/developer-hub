---
title: Solanaトークンにメタデータを追加する方法
metaTitle: Solanaトークンにメタデータを追加する方法 | ガイド
description: 既に存在するSolanaトークンにメタデータを追加する方法を学習します。
created: '10-01-2024'
updated: '10-01-2024'
---

このガイドでは、Metaplex Token Metadataプロトコルを使用して、既に初期化されたSolanaトークン（SPLトークン）にメタデータを追加する手順を説明します。

{% callout %}
代わりに利用可能な[createヘルパー](/ja/smart-contracts/token-metadata/mint#create-helpers)関数を使用してトークンを作成・初期化することを推奨します。これを行う方法については、代わりにこのガイド[`Solanaトークンの作成方法`](/ja/guides/javascript/how-to-create-a-solana-token)をご確認ください。

{% /callout %}

## 前提条件

- お好みのコードエディタ（Visual Studio Codeを推奨）
- Node 18.x.x以上

## 初期設定

このガイドでは、メタデータを追加したい既に初期化されたSPLトークンがあることを前提としています。ニーズに合わせて関数を変更・移動する必要があるかもしれません。

## 初期化

お好みのJS/TSパッケージマネージャー（npm、yarn、pnpm、bun、deno）を使用して新しい空のプロジェクトを初期化することから始めます。

```bash
npm init -y
```

### 必要なパッケージ

このガイドに必要なパッケージをインストールします。

{% packagesUsed packages=["umi", "umiDefaults" ,"tokenMetadata"] type="npm" /%}

```bash
npm i @metaplex-foundation/umi
```

```bash
npm i @metaplex-foundation/umi-bundle-defaults
```

```bash
npm i @metaplex-foundation/mpl-token-metadata
```

### インポートとラッパー関数

必要なインポートとラッパー関数をリストします。

1. `addMetadata`

```typescript
import {
 createV1,
 findMetadataPda,
 mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import { generateSigner, signerIdentity, sol } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { base58 } from "@metaplex-foundation/umi/serializers";

/// 
/// umiのインスタンス化 
///


// 既存のSPLトークンにメタデータを追加するラッパー関数
async function addMetadata() {
 ///
 ///
 ///  ここにコードが入ります
 ///
 ///
}

// 関数を実行
addMetadata();
```

## Umiのセットアップ

この例では、`generatedSigner()`を使用してUmiをセットアップします。ウォレットや署名者を異なる方法で設定したい場合は、[**Umiへの接続**](/ja/dev-tools/umi/getting-started)ガイドをご確認ください。

Umiのインスタンス化コードはコードブロック内外のどちらに置いても構いませんが、コードの重複を減らすため、外側に配置します。

### 新しいウォレットの生成

```ts
const umi = createUmi("https://api.devnet.solana.com")
 .use(mplTokenMetadata())
 .use(mplToolbox());

// 新しいキーペア署名者を生成
const signer = generateSigner(umi);

// umiに新しい署名者を使用するよう指示
umi.use(signerIdentity(signer));

// アイデンティティに2 SOLをエアドロップ
// 429 too many requestsエラーが発生した場合は、
// デフォルトで提供されている無料のRPC以外を使用する必要があります
await umi.rpc.airdrop(umi.identity.publicKey, sol(2));
```

### ローカルに保存されている既存のウォレットを使用

```ts
const umi = createUmi("https://api.devnet.solana.com")
 .use(mplTokenMetadata())
 .use(mplToolbox());

// fsを使用してファイルシステムをナビゲートし、
// 相対パスで使用したいウォレットを読み込む必要があります
const walletFile = fs.readFileSync('./keypair.json')

// walletFileをキーペアに変換
let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(walletFile));

// キーペアをumiに読み込み
umi.use(keypairIdentity(umiSigner));
```

## メタデータの追加

メタデータの追加もSPLトークンの作成と同じく簡単です。`mpl-token-metadata`ライブラリの`createV1`ヘルパーメソッドを利用します。

また、このガイドでは事前にオフチェーンのトークンメタデータが準備されていることを前提としています。名前、オフチェーンURIアドレス、シンボルが必要です。

```json
name: "Solana Gold",
symbol: "GOLDSOL",
uri: "https://raw.githubusercontent.com/solana-developers/program-examples/new-examples/tokens/tokens/.assets/spl-token.json",
```

```typescript
// トークンのサンプルメタデータ
const tokenMetadata = {
 name: "Solana Gold",
 symbol: "GOLDSOL",
 uri: "https://raw.githubusercontent.com/solana-developers/program-examples/new-examples/tokens/tokens/.assets/spl-token.json",
};

// 既存のSPLトークンにメタデータを追加するラッパー関数
async function addMetadata() {
    const mint = publicKey("YOUR_TOKEN_MINT_ADDRESS");

    // メタデータをオンチェーンに保存するメタデータアカウントを導出
 const metadataAccountAddress = await findMetadataPda(umi, {
  mint: mint,
 });

   // `createV1`ヘルパーを使用して既に初期化されたトークンにメタデータを追加
 const tx = await createV1(umi, {
  mint,
  authority: umi.identity,
  payer: umi.identity,
  updateAuthority: umi.identity,
  name: tokenMetadata.name,
  symbol: tokenMetadata.symbol,
  uri: tokenMetadata.uri,
  sellerFeeBasisPoints: percentAmount(5.5), // 5.5%
  tokenStandard: TokenStandard.Fungible,
 }).sendAndConfirm(umi);

 let txSig = base58.deserialize(tx.signature);
 console.log(`https://explorer.solana.com/tx/${txSig}?cluster=devnet`);
}
```

creatorsのようなnullableフィールドは、Non Fungibleと比べてSPLトークンにはそれほど必要でない可能性があるため除外しています。

mintアドレスに注意してください。異なるインスタンスで関数を呼び出す場合は、`generateSigner`が呼び出しごとに新しいキーペアを返すため、`findMetadataPda`関数の`mint`フィールドのアドレスを設定することを確認してください。

## 完全なコード例

```typescript
import {
 createV1,
 findMetadataPda,
 mplTokenMetadata,
 TokenStandard
} from "@metaplex-foundation/mpl-token-metadata";
import { mplToolbox } from "@metaplex-foundation/mpl-toolbox";
import {
  generateSigner,
  percentAmount,
  publicKey,
  signerIdentity,
  sol,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { base58 } from "@metaplex-foundation/umi/serializers";

const umi = createUmi("https://api.devnet.solana.com")
 .use(mplTokenMetadata())
 .use(mplToolbox());

// 新しいキーペア署名者を生成
const signer = generateSigner(umi);

// umiに新しい署名者を使用するよう指示
umi.use(signerIdentity(signer));

// SPLトークンのmintアドレス
const mint = publicKey("YOUR_TOKEN_MINT_ADDRESS");
 

// トークンのサンプルメタデータ
const tokenMetadata = {
 name: "Solana Gold",
 symbol: "GOLDSOL",
 uri: "https://raw.githubusercontent.com/solana-developers/program-examples/new-examples/tokens/tokens/.assets/spl-token.json",
};

// 既存のSPLトークンにメタデータを追加するラッパー関数
async function addMetadata() {
 // アイデンティティに2 SOLをエアドロップ
    // 429 too many requestsエラーが発生した場合は、
    // デフォルトで提供されている無料のRPC以外を使用する必要があります
    await umi.rpc.airdrop(umi.identity.publicKey, sol(2));

    // メタデータをオンチェーンに保存するメタデータアカウントを導出
 const metadataAccountAddress = await findMetadataPda(umi, {
  mint: mint,
 });

 const tx = await createV1(umi, {
  mint,
  authority: umi.identity,
  payer: umi.identity,
  updateAuthority: umi.identity,
  name: tokenMetadata.name,
  symbol: tokenMetadata.symbol,
  uri: tokenMetadata.uri,
  sellerFeeBasisPoints: percentAmount(5.5), // 5.5%
  tokenStandard: TokenStandard.Fungible,
 }).sendAndConfirm(umi);

 let txSig = base58.deserialize(tx.signature);
 console.log(`https://explorer.solana.com/tx/${txSig}?cluster=devnet`);
}

// 関数を実行
addMetadata();
```

## 次のステップ

このガイドでは、Solanaトークンにメタデータを追加する方法を学習しました。ここから[Token Metadataプログラム](/ja/smart-contracts/token-metadata)に進んで、ワンステップでトークンの初期化とメタデータの追加を行うヘルパー関数、Non Fungibleの操作、Token Metadataプログラムとの様々な相互作用方法をチェックできます。
