---
title: '@solana/web3.js の違いとアダプター'
metaTitle: 'Umi - @solana/web3.js の違いとアダプター'
description: 'Metaplex UmiをSolana web3jsと連携させるための違いとアダプター。'
---

`@solana/web3.js`ライブラリは現在Solanaエコシステムで広く使用されており、`Publickey`、`Transaction`、`Instruction`などの独自の型を定義しています。

`Umi`を作成する際、`@solana/web3.js`で定義されているクラスベースの型から離れたいと考えました。残念ながら、これは同じまたは類似のインポート名を持っているにもかかわらず、`@solana/web3.js`のすべての型が`Umi`で提供される型と互換性があるわけではなく、その逆も同様であることを意味します。

この問題を解決するため、`Umi`は型を`Web3.js`の対応型との間で解析できるアダプターのセットを提供しており、これらは[`@metaplex-foundation/umi-web3js-adapters`](https://www.npmjs.com/package/@metaplex-foundation/umi-web3js-adapters)パッケージで見つけることができます。

## 必要なパッケージとインポート

`umi-web3js-adapters`パッケージには、Umiと Web3.js型の間で変換するために必要なすべてのヘルパーメソッドが含まれています。

`@metaplex-foundation/umi`パッケージをインストールするときに既に含まれていますが、以下のコマンドを使用して個別にインストールすることもできます：

```
npm i @metaplex-foundation/umi-web3js-adapters
```

**アクセスできるインポートは以下の通りです：**

```ts
import { 
  // キーペア
  fromWeb3JsKeypair, toWeb3JsKeypair,
  // 公開キー
  fromWeb3JsPublicKey, toWeb3JsPublicKey,
  // 命令
  fromWeb3JsInstruction, toWeb3JsInstruction,
  // レガシートランザクション
  fromWeb3JsLegacyTransaction, toWeb3JsLegacyTransaction,
  // バージョン付きトランザクション
  fromWeb3JsTransaction, toWeb3JsTransaction, 
  // メッセージ
  fromWeb3JsMessage, toWeb3JsMessage, toWeb3JsMessageFromInput
} from '@metaplex-foundation/umi-web3js-adapters';
```

## 公開キー

公開キーの生成は一見似ているように見えるかもしれませんが、パッケージ間には微妙な違いがあります。**Web3Js**は大文字の`P`を使用し、`new`が必要ですが、**Umi**版は小文字の`p`を使用します。

### Umi
```ts
import { publicKey } from '@metaplex-foundation/umi';

// 新しいUmi公開キーを生成
const umiPublicKey = publicKey("11111111111111111111111111111111");
```

### Web3Js
```ts
import { PublicKey } from '@solana/web3.js';

// 新しいWeb3Js公開キーを生成
const web3jsPublickey = new PublicKey("1111111111111111111111111111111111111111");
```

次に、アダプターの使用方法を見てみましょう。

### Web3JsからUmiへ
```ts
import { PublicKey } from '@solana/web3.js';
import { fromWeb3JsPublicKey } from '@metaplex-foundation/umi-web3js-adapters';

// 新しい公開キーを生成
const web3jsPublickey = new PublicKey("1111111111111111111111111111111111111111");

// UmiWeb3jsAdaptersパッケージを使用して変換
const umiPublicKey = fromWeb3JsPublicKey(web3jsPublickey);
```

### UmiからWeb3Jsへ
```ts
import { publicKey } from '@metaplex-foundation/umi';
import { toWeb3JsPublicKey } from '@metaplex-foundation/umi-web3js-adapters';

// 新しい公開キーを生成
const umiPublicKey = publicKey("11111111111111111111111111111111");

// UmiWeb3jsAdaptersパッケージを使用して変換
const web3jsPublickey = toWeb3JsPublicKey(umiPublicKey);
```

## キーペア

キーペアの生成は、Web3JsとUmiの違いが大きくなる部分です。**Web3Js**では単純に`Keypair.generate()`を使用できますが、**Umi**では最初にUmiインスタンスを作成する必要があり、これはUmiやMetaplex関連の操作のほとんどで使用します。

### Umi
```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { generateSigner, createSignerFromKeypair } from '@metaplex-foundation/umi'

// 新しいUmiインスタンスを生成
const umi = createUmi('https://api.devnet.solana.com')

// 新しいUmiキーペアを生成
const umiKeypair = generateSigner(umi)

// または既存のものを使用
const umiKeypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(walletFile));
```

### Web3Js
```ts
import { Keypair } from '@solana/web3.js';

// 新しいWeb3Jsキーペアを生成
const web3jsKeypair = Keypair.generate();

// または既存のものを使用
const web3jsKeypair = Keypair.fromSecretKey(new Uint8Array(walletFile));
```

次に、アダプターの使用方法を見てみましょう。

### UmiからWeb3Jsへ
```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { generateSigner } from '@metaplex-foundation/umi'
import { toWeb3JsKeypair } from '@metaplex-foundation/umi-web3js-adapters';

// 新しいUmiインスタンスを生成
const umi = createUmi('https://api.devnet.solana.com')

// 新しいキーペアを生成
const umiKeypair = generateSigner(umi)

// UmiWeb3jsAdaptersパッケージを使用して変換
const web3jsKeypair = toWeb3JsKeypair(umiKeypair);
```

### Web3JsからUmiへ
```ts
import { Keypair } from '@solana/web3.js';
import { fromWeb3JsKeypair } from '@metaplex-foundation/umi-web3js-adapters';

// 新しいキーペアを生成
const web3jsKeypair = Keypair.generate();

// UmiWeb3jsAdaptersパッケージを使用して変換
const umiKeypair = fromWeb3JsKeypair(web3jsKeypair);
```

## 命令

命令を作成する際のUmiとの主な違いは、（`Keypair`と同様に）最初にUmiインスタンスを作成する必要があることです。さらに、`getInstructions()`は単一の命令ではなく命令の配列を返します。

ほとんどのユースケースでは、個別の命令を処理する必要はありません。これは他のヘルパーやトランザクションビルダーを使用して簡略化できるからです。

### Umi
```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { transferSol } from '@metaplex-foundation/mpl-toolbox';

// 新しいUmiインスタンスを生成
const umi = createUmi('https://api.devnet.solana.com').use(mplCore())

// 新しい命令を作成（コアNFT転送など）
// get instructionsは命令の配列を提供します
const umiInstructions = transferSol(umi, {...TransferParams}).getInstructions();
```

### Web3Js
```ts
import { SystemProgram } from '@solana/web3.js';

// 新しい命令を作成（ラムポート転送など）
const web3jsInstruction = SystemProgram.transfer({...TransferParams})
```

次に、アダプターの使用方法を見てみましょう。

### UmiからWeb3Jsへ
```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { transferSol } from '@metaplex-foundation/mpl-toolbox';
import { toWeb3JsInstruction } from '@metaplex-foundation/umi-web3js-adapters';

// 新しいUmiインスタンスを生成
const umi = createUmi('https://api.devnet.solana.com').use(mplCore())

// 新しい命令を作成（コアNFT転送など）
const umiInstruction = transferSol(umi, {...TransferParams}).getInstructions();

// UmiWeb3jsAdaptersパッケージを使用して変換
const web3jsInstruction = umiInstruction.map(toWeb3JsInstruction);
```

### Web3JsからUmiへ
```ts
import { SystemProgram } from '@solana/web3.js';
import { fromWeb3JsInstruction } from '@metaplex-foundation/umi-web3js-adapters';

// 新しいUmiインスタンスを生成
const umi = createUmi('https://api.devnet.solana.com')

// 新しい命令を作成（ラムポート転送など）
const web3jsInstruction = SystemProgram.transfer({...TransferParams})

// UmiWeb3jsAdaptersパッケージを使用して変換
const umiInstruction = fromWeb3JsInstruction(web3jsInstruction);
```

## トランザクション

Solanaランタイムは2つのトランザクションバージョンをサポートしています：
- レガシートランザクション：追加の利点のない古いトランザクション形式
- 0 / バージョン付きトランザクション：アドレスルックアップテーブルのサポートを追加

**注意**：バージョン付きトランザクションの概念に馴染みがない場合は、[こちら](https://solana.com/en/docs/advanced/versions)で詳しく読んでください。

`umi`と`umi-web3js-adapters`では両方のトランザクションタイプのサポートを追加しました！

### Umi
```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { transferSol } from '@metaplex-foundation/mpl-toolbox';
// 新しいUmiインスタンスを生成
const umi = createUmi('https://api.devnet.solana.com').use(mplCore())

// 新しいUmiレガシートランザクションを作成
const umiTransaction = transferSol(umi, {...TransferParams}).useLegacyVersion();

// 新しいUmiバージョン付きトランザクションを作成
const umiVersionedTransaction = transferSol(umi, {...TransferParams}).useV0().build(umi)
```

### Web3Js
```ts
import { Transaction, VersionedTransaction, TransactionMessage, Connection, clusterApiUrl, SystemProgram } from '@solana/web3.js';

// 新しいWeb3Jsレガシートランザクションを作成
const web3jsTransaction = new Transaction().add(SystemProgram.transfer({...TransferParams}));

// 新しいWeb3Jsバージョン付きトランザクションを作成
const instructions = [SystemProgram.transfer({...TransferParams})];

const connection = new Connection(clusterApiUrl("devnet"));
const blockhash = await connection.getLatestBlockhash().then(res => res.blockhash);

const messageV0 = new TransactionMessage({
  payerKey: payer.publicKey,
  recentBlockhash: blockhash,
  instructions,
}).compileToV0Message();

const web3jsVersionedTransaction = new VersionedTransaction(messageV0);
```

次に、アダプターの使用方法を見てみましょう。

### UmiからWeb3Jsへ
```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { transferSol } from '@metaplex-foundation/mpl-toolbox';
import { toWeb3JsLegacyTransaction, toWeb3JsTransaction } from '@metaplex-foundation/umi-web3js-adapters';

// 新しいUmiインスタンスを生成
const umi = createUmi('https://api.devnet.solana.com').use(mplCore())

// 新しいレガシートランザクションを作成
const umiTransaction = transferSol(umi, {...TransferParams}).useLegacyVersion();

// UmiWeb3jsAdaptersパッケージを使用して変換
const web3jsTransaction = toWeb3JsTransaction(umiTransaction);

/// バージョン付きトランザクション ///

// 新しいバージョン付きトランザクションを作成
const umiVersionedTransaction = transferSol(umi, {...TransferParams}).useV0().build(umi)

// UmiWeb3jsAdaptersパッケージを使用して変換
const web3jsVersionedTransaction = toWeb3JsTransaction(umiVersionedTransaction);
```

### Web3JsからUmiへ
```ts
import { Transaction, VersionedTransaction, TransactionMessage, Connection, clusterApiUrl, SystemProgram } from '@solana/web3.js';
import { fromWeb3JsLegacyTransaction, fromWeb3JsTransaction } from '@metaplex-foundation/umi-web3js-adapters';

// 新しいレガシートランザクションを作成
const web3jsTransaction = new Transaction().add(SystemProgram.transfer({...TransferParams}));

// UmiWeb3jsAdaptersパッケージを使用して変換
const umiTransaction = fromWeb3JsLegacyTransaction(web3jsTransaction);

/// バージョン付きトランザクション ///

// 新しいバージョン付きトランザクションを作成
const web3jsVersionedTransaction = new VersionedTransaction(...messageV0Params);

// UmiWeb3jsAdaptersパッケージを使用して変換
const umiVersionedTransaction = fromWeb3JsTransaction(web3jsVersionedTransaction);
```

## メッセージ

バージョン付きトランザクション作成時にメッセージの作成について既にカバーしました。再度確認してみましょう。

### Umi
```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { transfer, mplCore } from '@metaplex-foundation/mpl-core'

// 新しいUmiインスタンスを生成
const umi = createUmi('https://api.devnet.solana.com').use(mplCore())

// 新しいUmiメッセージを作成
const blockhash = await umi.rpc.getLatestBlockhash()

const instructions = transfer(umi, {...TransferParams}).getInstructions()

const umiVersionedTransaction = umi.transactions.create({
  version: 0,
  payer: frontEndSigner.publicKey,
  instructions,
  blockhash: blockhash.blockhash,
});

const umiMessage = umiVersionedTransaction.message
```

### Web3Js
```ts
import { TransactionMessage, Connection, clusterApiUrl, SystemProgram } from '@solana/web3.js';

// 新しいWeb3Jsメッセージを作成
const connection = new Connection(clusterApiUrl("devnet"));
const minRent = await connection.getMinimumBalanceForRentExemption(0);
const blockhash = await connection.getLatestBlockhash().then(res => res.blockhash);

const instructions = [SystemProgram.transfer({...TransferParams})];

const Web3JsMessage = new TransactionMessage({
  payerKey: payer.publicKey,
  recentBlockhash: blockhash,
  instructions,
}).compileToV0Message();
```

次に、アダプターの使用方法を見てみましょう。

### UmiからWeb3Jsへ
```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { toWeb3JMessage } from '@metaplex-foundation/umi-web3js-adapters';

// 新しいUmiインスタンスを生成
const umi = createUmi('https://api.devnet.solana.com').use(mplCore())

// 新しいバージョン付きトランザクションを作成
const umiMessage = umi.transactions.create({...createParams}).message;

// UmiWeb3jsAdaptersパッケージを使用して変換
const web3jsMessage = toWeb3JMessage(umiMessage);
```

### Web3JsからUmiへ
```ts
import { TransactionMessage } from '@solana/web3.js';
import { fromWeb3JMessage } from '@metaplex-foundation/umi-web3js-adapters';

// 新しいバージョン付きトランザクションを作成
const Web3JsMessage = new TransactionMessage({...createMessageParams}).compileToV0Message();

// UmiWeb3jsAdaptersパッケージを使用して変換
const umiMessage = fromWeb3JMessage(Web3JsMessage);
```
