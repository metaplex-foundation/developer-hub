---
title: トランザクションのシリアル化、デシリアル化、送信
metaTitle: Umi - トランザクションのシリアル化、デシリアル化、送信
description: Metaplex Umiクライアントを使用して、異なる環境間でトランザクションを移動するためのシリアル化とデシリアル化の方法を学びます。
created: '08-15-2024'
updated: '08-15-2024'
---

**このガイドで説明する内容：**
- トランザクションのシリアル化とデシリアル化
- Noop Signer
- 部分的に署名されたトランザクション
- 異なる環境間でのトランザクション受け渡し

## はじめに

トランザクションは通常、異なる環境間での移動を容易にするためにシリアル化されます。その理由はさまざまです：
- 別々の環境に保存されている異なる権限からの署名が必要な場合があります。
- フロントエンドでトランザクションを作成し、データベースに保存する前にバックエンドで送信・検証したい場合があります。

例えば、NFTを作成する際、NFTをコレクションに認証するために`collectionAuthority`キーペアでトランザクションに署名する必要がある場合があります。キーペアを公開せずに安全に署名するため、まずバックエンドでトランザクションを作成し、安全でない環境でキーペアを公開することなく`collectionAuthority`でトランザクションに部分的に署名し、トランザクションをシリアル化して送信できます。その後、安全にトランザクションをデシリアル化し、`Buyer`ウォレットで署名できます。

**注意**: Candy Machineを使用する場合、`collectionAuthority`署名は不要です

## 初期設定

### 必要なパッケージとインポート

以下のパッケージを使用します：

{% packagesUsed packages=["umi", "umiDefaults", "core"] type="npm" /%}

インストールするには、以下のコマンドを使用してください：

```
npm i @metaplex-foundation/umi 
```

```
npm i @metaplex-foundation/umi-bundle-defaults 
```

```
npm i @metaplex-foundation/mpl-core
```

このガイドで使用するすべてのインポートは以下の通りです。

```ts
import { generateSigner, signerIdentity, createNoopSigner } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { fetchCollection, create, mplCore } from '@metaplex-foundation/mpl-core'
import { base64 } from '@metaplex-foundation/umi/serializers';
```

## Umiのセットアップ

Umiをセットアップする際、さまざまなソースからキーペア/ウォレットを使用または生成できます。テスト用の新しいウォレットを作成、ファイルシステムから既存のウォレットをインポート、またはWebサイト/dAppを作成している場合は`walletAdapter`を使用できます。

{% totem %}

{% totem-accordion title="新しいウォレットを使用" %}

```ts
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplCore())

// 新しいキーペア署名者を生成。
const signer = generateSigner(umi)

// 新しい署名者を使用するようUmiに指示。
umi.use(signerIdentity(signer))
```

{% /totem-accordion %}

{% totem-accordion title="既存のウォレットを使用" %}

```ts
import * as fs from "fs";
import * as path from "path";

const umi = createUmi('https://api.devnet.solana.com')
  .use(mplCore())

// fsを使用してファイルシステムをナビゲートし、
// 相対パスで使用したいウォレットに到達。
const walletFile = fs.readFileSync(
  path.join(__dirname, './keypair.json')
)

// 通常キーペアはUint8Arrayとして保存されるため、
// 使用可能なキーペアに変換する必要があります。
let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(walletFile));

// Umiがこのキーペアを使用する前に、
// それを使ってSignerタイプを生成する必要があります。
const signer = createSignerFromKeypair(umi, keyair);

// 新しい署名者を使用するようUmiに指示。
umi.use(signerIdentity(walletFile))
```

{% /totem-accordion %}

{% totem-accordion title="Wallet Adapterを使用" %}

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

## シリアル化

トランザクションのシリアル化は、トランザクションオブジェクトを一連のバイトまたは文字列に変換し、トランザクションの状態を簡単に転送可能な形式で保存するプロセスです。これにより、HTTPリクエストなどで受け渡すことができます。

シリアル化の例では、以下を行います：
- `NoopSigner`を使用して`Payer`を命令内の`Signer`として追加
- Versioned Transactionを作成し、`collectionAuthority`と`Asset`で署名
- すべての詳細が保持され、フロントエンドで正確に再構築できるようにシリアル化
- リクエストを通じて受け渡すことができるよう、u8ではなく文字列として送信

### Noop Signer

トランザクションに部分的に署名してからシリアル化することは、`NoopSigner`があってこそ可能です。

Umi命令は、ローカルキーペアファイルや`walletAdapter`署名者からよく生成される`Signer`タイプをデフォルトで受け取ることができます。特定の署名者にアクセスできない場合があり、後の時点でその署名者で署名する必要がある場合があります。ここでNoop Signerが活躍します。

**Noop Signer**は公開鍵を受け取り、特別な`Signer`タイプを生成します。これにより、Umiは現在の時点でNoop Signerが存在しなくても、トランザクションに署名しなくても命令を構築できます。

*Noop Signers*で構築された命令とトランザクションは、トランザクションをチェーンに送信する前のある時点で署名されることを期待し、存在しない場合は「署名不足」エラーを引き起こします。

使用方法は以下の通りです：
```ts
createNoopSigner(publickey('11111111111111111111111111111111'))
```

### バイナリデータの代わりに文字列を使用

シリアル化されたトランザクションを環境間で受け渡す前に文字列に変換する決定は、以下に基づいています：
- Base64などの形式は広く認識され、データの破損や誤解釈のリスクなしにHTTP経由で安全に転送できます。
- 文字列の使用は、Web通信の標準的な慣行と一致します。ほとんどのAPIとWebサービスは、JSONまたはその他の文字列ベース形式でデータを期待します

方法は、`@metaplex-foundation/umi/serializers`パッケージに存在する`base64`関数を使用することです。

**注意**: `@metaplex-foundation/umi`パッケージに含まれているため、パッケージをインストールする必要はありません

```ts 
// base64.deserializeを使用してserializedTxを渡す
const serializedTxAsString = base64.deserialize(serializedTx)[0];

// base64.serializeを使用してserializedTxAsStringを渡す
const deserializedTxAsU8 = base64.serialize(serializedTxAsString);
```

### コード例

```ts
// Collection Authority Keypairを使用
const collectionAuthority = generateSigner(umi)
umi.use(signerIdentity(collectionAuthority))

// 後で署名できるnoop signerを作成
const frontendPubkey = publickey('11111111111111111111111111111111')
const frontEndSigner = createNoopSigner(frontendPubkey)

// Asset Keypairを作成
const asset = generateSigner(umi);

// コレクションを取得
const collection = await fetchCollection(umi, publickey(`11111111111111111111111111111111`)); 

// createAssetIxを作成
const createAssetTx = await create(umi, {
  asset: asset,
  collection: collection,
  authority: collectionAuthority,
  payer: frontEndSigner,
  owner: frontendPubkey,
  name: 'My NFT',
  uri: 'https://example.com/my-nft.json',
})
  .useV0()
  .setBlockhash(await umi.rpc.getLatestBlockhash())
  .buildAndSign(umi);

// トランザクションをシリアル化
const serializedCreateAssetTx = umi.transactions.serialize(createAssetTx)

// Uint8Arrayを文字列にエンコードし、フロントエンドにトランザクションを返す
const serializedCreateAssetTxAsString = base64.deserialize(serializedCreateAssetTx)[0];

return serializedCreateAssetTxAsString
```

## デシリアル化

デシリアル化の例では、以下を行います：
- リクエストを通じて受信したトランザクションをUint8Arrayに戻す変換
- 中断した地点から操作できるようにデシリアル化
- 他の環境で`NoopSigner`を通じて使用したため、`Payer`キーペアで署名
- 送信

### コード例

```ts
// 文字列をUint8Arrayにデコードして使用可能にする
const deserializedCreateAssetTxAsU8 = base64.serialize(serializedCreateAssetTxAsString);

// バックエンドから返されたトランザクションをデシリアル化
const deserializedCreateAssetTx = umi.transactions.deserialize(deserializedCreateAssetTxAsU8)

// walletAdapterから取得したキーペアでトランザクションに署名
const signedDeserializedCreateAssetTx = await umi.identity.signTransaction(deserializedCreateAssetTx)

// トランザクションを送信
await umi.rpc.sendTransaction(signedDeserializedCreateAssetTx)
```

## 完全なコード例

当然のことながら、実際の命令の完全に再現可能な例を持つためには、フロントエンド署名者の処理やコレクションの作成などの追加手順を含める必要があります。

すべてが同じでなくても心配ありません。バックエンドとフロントエンドの部分は一貫しています。

```ts
import { generateSigner, createSignerFromKeypair, signerIdentity, sol, createNoopSigner, transactionBuilder } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { base58 } from '@metaplex-foundation/umi/serializers';
import { createCollection, create, fetchCollection } from '@metaplex-foundation/mpl-core'

const umi = createUmi("https://api.devnet.solana.com", "finalized")

const collectionAuthority = generateSigner(umi);
umi.use(signerIdentity(collectionAuthority));

const frontEndSigner = generateSigner(umi);

(async () => {
  
  // ウォレット内にトークンをエアドロップ
  await umi.rpc.airdrop(umi.identity.publicKey, sol(1));
  await umi.rpc.airdrop(frontEndSigner.publicKey, sol(1));

  // コレクションキーペアを生成
  const collectionAddress = generateSigner(umi)
  console.log("\nCollection Address: ", collectionAddress.publicKey.toString())

  // コレクションを生成
  let createCollectionTx = await createCollection(umi, {
    collection: collectionAddress,
    name: 'My Collection',
    uri: 'https://example.com/my-collection.json',
  }).sendAndConfirm(umi)

  const createCollectionSignature = base58.deserialize(createCollectionTx.signature)[0]
  console.log(`\nCollection Created: https://solana.fm/tx/${createCollectionSignature}?cluster=devnet-alpha`);

  // シリアル化
  
  const asset = generateSigner(umi);
  console.log("\nAsset Address: ", asset.publicKey.toString());

  const collection = await fetchCollection(umi, collectionAddress.publicKey); 

  let createAssetIx = await create(umi, {
    asset: asset,
    collection: collection,
    authority: collectionAuthority,
    payer: createNoopSigner(frontEndSigner.publicKey),
    owner: frontEndSigner.publicKey,
    name: 'My NFT',
    uri: 'https://example.com/my-nft.json',
  })
    .useV0()
    .setBlockhash(await umi.rpc.getLatestBlockhash())
    .buildAndSign(umi);


  const serializedCreateAssetTx = umi.transactions.serialize(createAssetTx)
  const serializedCreateAssetTxAsString = base64.deserialize(serializedCreateAssetTx)[0];

  // デシリアル化

  const deserializedCreateAssetTxAsU8 = base64.serialize(serializedCreateAssetTxAsString);
  const deserializedCreateAssetTx = umi.transactions.deserialize(deserializedCreateAssetTxAsU8)
  const signedDeserializedCreateAssetTx = await frontEndSigner.signTransaction(deserializedCreateAssetTx)

  const createAssetSignature = base58.deserialize(await umi.rpc.sendTransaction(signedDeserializedCreateAssetTx))[0]
  console.log(`\nAsset Created: https://solana.fm/tx/${createAssetSignature}}?cluster=devnet-alpha`);
})();
```