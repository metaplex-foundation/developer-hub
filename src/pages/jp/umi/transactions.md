---
title: トランザクションの送信
metaTitle: トランザクションの送信 | Umi
description: Metaplex UmiとTransaction Buildersを使用したトランザクションの送信
---
トランザクションの管理と送信は、どのSolanaクライアントでも重要な部分です。それらの管理を支援するため、Umiは多くのコンポーネントを提供します：

- トランザクションの作成と（デ）シリアライゼーションに使用できる[TransactionFactoryInterface](https://umi.typedoc.metaplex.com/interfaces/umi.TransactionFactoryInterface.html)。
- トランザクションを簡単に構築できる[TransactionBuilder](https://umi.typedoc.metaplex.com/classes/umi.TransactionBuilder.html)。
- トランザクションの送信、確認、取得に使用できる[RpcInterface](https://umi.typedoc.metaplex.com/interfaces/umi.RpcInterface.html)。[RPCインターフェースについて詳しくはこちらをお読みください](rpc)。

## トランザクションと命令

Umiは、トランザクション、命令、およびその他すべての関連タイプに独自のインターフェースのセットを定義します。以下は、APIドキュメントへのリンクとともに最も重要なものの概要です：

- [Transaction](https://umi.typedoc.metaplex.com/interfaces/umi.Transaction.html): トランザクションは、バージョン管理されたトランザクションメッセージ、必要な署名のリスト、および簡単に署名できるようにメッセージのシリアライズされたバージョンで構成されます。
- [TransactionMessage](https://umi.typedoc.metaplex.com/interfaces/umi.TransactionMessage.html): トランザクションメッセージは、すべての必要な公開キー、公開キーの代わりにインデックスを使用する1つまたは多くのコンパイルされた命令、最近のブロックハッシュ、およびそのバージョンなどの他の属性で構成されます。トランザクションメッセージは以下のバージョンのいずれかを持つことができます：
  - バージョン: "legacy": トランザクションメッセージの最初のSolana反復。
  - バージョン: 0: トランザクションバージョニングを導入する最初のトランザクションメッセージバージョン。また、アドレスルックアップテーブルも導入します。
- [Instruction](https://umi.typedoc.metaplex.com/types/umi.Instruction.html): 命令は、プログラムid、[AccountMeta](https://umi.typedoc.metaplex.com/types/umi.AccountMeta.html)のリスト、およびいくつかのシリアライズされたデータで構成されます。各アカウント`AccountMeta`は、公開キー、トランザクションに署名するかどうかを示すブール値、およびそれが書き込み可能かどうかを示す別のブール値で構成されます。

新しいトランザクションを作成するには、`TransactionFactoryInterface`の`create`メソッドを使用できます。たとえば、以下は単一の命令でバージョン`0`のトランザクションを作成する方法です：

```ts
const transaction = umi.transactions.create({
  version: 0,
  blockhash: (await umi.rpc.getLatestBlockhash()).blockhash,
  instructions: [myInstruction],
  payer: umi.payer.publicKey,
})
```

トランザクションファクトリーインターフェースは、トランザクションとそのメッセージをシリアライズおよびデシリアライズするためにも使用できます。

```ts
const mySerializedTransaction = umi.transactions.serialize(myTransaction)
const myTransaction = umi.transactions.deserialize(mySerializedTransaction)
const mySerializedMessage = umi.transactions.serializeMessage(myMessage)
const myMessage = umi.transactions.deserializeMessage(mySerializedMessage)
```

これらはすべて素晴らしいですが、ブロックチェーンにトランザクションを送信したいたびに毎回構築するのは少し退屈です。幸い、UmiはそれをサポートできるP`TransactionBuilder`を提供します。

## Transaction Builders

トランザクションビルダーは、構築、署名、送信する準備ができるまでトランザクションを段階的に構築するために使用できる不変オブジェクトです。それらは[`WrappedInstruction`](https://umi.typedoc.metaplex.com/types/umi.WrappedInstruction.html)のリストと、構築されたトランザクションを設定するために使用できるさまざまなオプションで構成されます。`WrappedInstruction`は、`instruction`と他の属性の束を含む単純なオブジェクトです。具体的には：

- 命令が最終的にアカウントを作成する場合、それらがチェーン上で取る（アカウントヘッダーを含む）バイト数を教えてくれる`bytesCreatedOnChain`属性。
- そして、トランザクション全体とは対照的に、この特定の命令にどの署名者が必要かを知るための`signers`配列。これにより、後で見るように、情報を失うことなくトランザクションビルダーを2つに分割できます。

`transactionBuilder`関数を使用して新しいトランザクションビルダーを作成し、その`add`メソッドを使用して命令を追加できます。また、`prepend`メソッドを使用してトランザクションの開始時に命令をプッシュすることもできます。

```ts
let builder = transactionBuilder()
  .add(myWrappedInstruction)
  .add(myOtherWrappedInstruction)
  .prepend(myFirstWrappedInstruction)
```

トランザクションビルダーは不変なので、`add`および`prepend`メソッドの結果を常に新しい変数に割り当てるよう注意する必要があります。新しいトランザクションビルダーを返すことでトランザクションビルダーを更新する他のメソッドについても同様です。

```ts
builder = builder.add(myWrappedInstruction)
builder = builder.prepend(myWrappedInstruction)
```

これらのメソッドは、他のトランザクションビルダーも受け入れ、現在のものにマージすることに注意してください。実際には、これはプログラムライブラリが独自のヘルパーメソッドを書く（または[自動生成](kinobi)する）ことができ、エンドユーザーが一緒に構成できるトランザクションビルダーを返すことを意味します。

```ts
import { transferSol, addMemo } from '@metaplex-foundation/mpl-toolbox';
import { createNft } from '@metaplex-foundation/mpl-token-metadata';

let builder = transactionBuilder()
  .add(addMemo(umi, { ... }))
  .add(createNft(umi, { ... }))
  .add(transferSol(umi, { ... }))
```

たとえば、元のビルダーから作成されるトランザクションがブロックチェーンに送信するには大きすぎる場合、トランザクションビルダーを2つに分割することもできます。これを行うには、[`splitByIndex`](https://umi.typedoc.metaplex.com/classes/umi.TransactionBuilder.html#splitByIndex)メソッドまたはより危険な[`unsafeSplitByTransactionSize`](https://umi.typedoc.metaplex.com/classes/umi.TransactionBuilder.html#unsafeSplitByTransactionSize)メソッドを使用できます。後者については、APIリファレンスのコメントを必ずお読みください。

```ts
const [builderA, builderB] = builder.splitByIndex(2)
const splitBuilders = builder.unsafeSplitByTransactionSize(umi)
```

そして、トランザクションビルダーでできることはもっとたくさんあります。詳しく学ぶために[APIリファレンスを読む](https://umi.typedoc.metaplex.com/classes/umi.TransactionBuilder.html)ことをお勧めしますが、トランザクションビルダーを設定できる他のメソッドの簡単な概要を以下に示します。

```ts
// セッター。
builder = builder.setVersion(myTransactionVersion) // トランザクションバージョンを設定。
builder = builder.useLegacyVersion() // トランザクションバージョンを"legacy"に設定。
builder = builder.useV0() // トランザクションバージョンを0に設定（デフォルト）。
builder = builder.empty() // ビルダーからすべての命令を削除しますが、設定は保持。
builder = builder.setItems(myWrappedInstructions) // 指定されたもので WrappedInstructionsを上書き。
builder = builder.setAddressLookupTables(myLuts) // アドレスルックアップテーブルを設定、バージョン0トランザクションのみ。
builder = builder.setFeePayer(myPayer) // カスタム料金支払者を設定。
builder = builder.setBlockhash(myBlockhash) // トランザクションで使用するブロックハッシュを設定。
builder = await builder.setLatestBlockhash(umi) // 最新のブロックハッシュを取得してトランザクションで使用。

// ゲッター。
const transactionSize = builder.getTransactionSize(umi) // 構築されたトランザクションのバイト単位でのサイズを返す。
const isSmallEnough = builder.fitsInOneTransaction(umi) // 構築されたトランザクションが1つのトランザクションに収まるかどうか。
const transactionRequired = builder.minimumTransactionsRequired(umi) // すべての命令を送信するために必要な最小トランザクション数を返す。
const blockhash = builder.getBlockhash() // 設定されている場合は設定されたブロックハッシュを返す。
const feePayer = builder.getFeePayer(umi) // 設定された料金支払者を返すか、設定されていない場合は`umi.payer`を使用。
const instructions = builder.getInstructions(umi) // すべてのアンラップされた命令を返す。
const signers = builder.getSigners(umi) // 料金支払者を含むすべての重複除去された署名者を返す。
const bytes = builder.getBytesCreatedOnChain() // チェーン上で作成されるバイト数の合計を返す。
const solAmount = await builder.getRentCreatedOnChain(umi) // チェーン上で作成されるバイト数の合計を返す。
```

それらのいくつかに`Umi`のインスタンスを渡していることに注意してください。これは、タスクを実行するためにUmiのコアインターフェースのいくつかにアクセスする必要があるためです。

これで、トランザクションビルダーの準備ができました。それを使用してトランザクションを構築、署名、送信する方法を見てみましょう。

## トランザクションの構築と署名

トランザクションを構築する準備ができたら、単に`build`メソッドを使用できます。このメソッドは、署名してブロックチェーンに送信できる`Transaction`オブジェクトを返します。

```ts
const transaction = builder.build(umi)
```

`build`メソッドは、ビルダーでブロックハッシュが設定されていない場合はエラーを投げることに注意してください。最新のブロックハッシュを使用してトランザクションを構築したい場合は、代わりに`buildWithLatestBlockhash`メソッドを使用できます。

```ts
const transaction = await builder.buildWithLatestBlockhash(umi)
```

この時点で、構築されたトランザクションを使用し、`getSigners`メソッドを通してビルダーからすべての重複除去された署名者を取得して署名することができます（詳細については[トランザクションの署名](/jp/umi/public-keys-and-signers#signing-transactions)を参照してください）。しかし、Umiはそれを行ってくれる`buildAndSign`メソッドを提供します。`buildAndSign`を使用する際、最新のブロックハッシュは、それがビルダーで設定されていない場合にのみ使用されます。

```ts
const signedTransaction = await builder.buildAndSign(umi)
```

既に構築されたがまだ署名されていないトランザクションは、配列にプッシュして、`signAllTransactions`を使用して一度にすべてを署名できます。

```ts
const signedTransactions = await signAllTransactions(transactionArray);
```

## トランザクションの送信

署名されたトランザクションができたので、それをブロックチェーンに送信する方法を見てみましょう。

これを行う1つの方法は、次のように`RpcInterface`の`sendTransaction`および`confirmTransaction`メソッドを使用することです。トランザクションを確認する際、確認戦略を提供する必要があります。確認戦略は`blockhash`または`durableNonce`タイプにすることができ、それぞれ異なるパラメーターのセットが必要です。以下は、`blockhash`戦略を使用してトランザクションを送信および確認する方法です。

```ts
const signedTransaction = await builder.buildAndSign(umi)
const signature = await umi.rpc.sendTransaction(signedTransaction)
const confirmResult = await umi.rpc.confirmTransaction(signature, {
  strategy: { type: 'blockhash', ...(await umi.rpc.getLatestBlockhash()) },
})
```

これは非常に一般的なタスクなので、Umiはこれを行うためのトランザクションビルダーでヘルパーメソッドを提供します。そうすることで、上記のコードは以下のように書き直すことができます。

```ts
const confirmResult = await builder.sendAndConfirm(umi)
```

これは`buildAndSign`メソッドを使用してトランザクションを構築および署名し、デフォルトで`blockhash`戦略を使用してトランザクションを送信および確認します。適用可能な場合は、確認戦略にトランザクションブロックハッシュを再利用して追加のHttpリクエストを回避します。とはいえ、次のように確認戦略を明示的に提供するか、オプションを設定することもできます。

```ts
const confirmResult = await builder.sendAndConfirm(umi, {
  // 送信オプション。
  send: {
    skipPreflight: true,
  },

  // 確認オプション。
  confirm: {
    strategy: {
      type: 'durableNonce',
      minContextSlot,
      nonceAccountPubkey,
      nonceValue,
    },
  },
})
```

また、トランザクションビルダーの`send`メソッドを使用して、確認を待たずにトランザクションを送信することもできることに注意してください。

```ts
const signature = await builder.send(umi)
```

## アドレスルックアップテーブルの使用

バージョン0トランザクションから、アドレスルックアップテーブルを使用してトランザクションのサイズを縮小できます。

```ts
const myLut: AddressLookupTableInput = {
  publicKey: publicKey('...') // ルックアップテーブルアカウントのアドレス。
  addresses: [ // ルックアップテーブルに登録されたアドレス。
    publicKey('...'),
    publicKey('...'),
    publicKey('...'),
  ]
}

builder = builder.setAddressLookupTables([myLut]);
```

アドレスルックアップテーブルを作成するには、それらを作成するためのヘルパーを提供する`@metaplex-foundation/mpl-toolbox`パッケージに興味があるかもしれません。

```ts
import { createLut } from '@metaplex-foundation/mpl-toolbox'

// ルックアップテーブルを作成。
const [lutBuilder, lut] = createLut(umi, {
  recentSlot: await umi.rpc.getSlot({ commitment: 'finalized' }),
  addresses: [myAddressA, myAddressB, myAddressC],
})
await lutBuilder.sendAndConfirm(umi)

// 後で、作成されたルックアップテーブルを使用。
myBuilder = myBuilder.setAddressLookupTables([lut])
```

## トランザクション署名形式の変換

### 人間が読める（base58）トランザクション署名を取得

トランザクション送信時に返される`signature`は`Uint8Array`型です。したがって、コピー可能で、たとえばエクスプローラーで開くことができる文字列を取得するには、まずそれをデシリアライズする必要があります：

```ts
import { base58 } from "@metaplex-foundation/umi/serializers";
// 送信されたトランザクション署名を受信する例
const { signature } = await builder.send(umi)

// デシリアライズ
const serializedSignature = base58.deserialize(signature)[0];
console.log(
        `View Transaction on Explorer: https://explorer.solana.com/tx/${serializedSignature}`
      );
```

### 人間が読める（base58）トランザクション署名をUint8Arrayに変換

場合によっては、base58エンコードされたトランザクション署名を持っており、それをUint8Arrayに変換したいことがあります。たとえば、これはエクスプローラーからトランザクション署名をコピーして、umiスクリプトで使用したい場合に発生する可能性があります。

これは`base58.deserialize`メソッドを使用して実行できます。

```ts
import { base58 } from "@metaplex-foundation/umi/serializers";

const signature = "4NJhR8zm3G7hU1uhPZaBiTMBCERh4CWp2cF1x2Ly9yCvenrY6oS9hF2PAGfT26odWvb49BktkWkoBPGoXMYUVqkY";

const transaction: Uint8Array = base58.serialize(signature)
```

## 送信されたトランザクションの取得

今度は、ブロックチェーンに送信されたトランザクションを取得する方法を見てみましょう。

そのために、`RpcInterface`の`getTransaction`メソッドを使用して、取得したいトランザクションの署名を提供できます。

```ts
const transaction = await umi.rpc.getTransaction(signature)
```

これは[`TransactionWithMeta`](https://umi.typedoc.metaplex.com/types/umi.TransactionWithMeta.html)のインスタンスを返します。これは`Transaction`のスーパーセットであり、トランザクションに関する追加情報を提供する追加の`meta`プロパティが含まれます。たとえば、次のように送信されたトランザクションのログにアクセスできます。

```ts
const transaction = await umi.rpc.getTransaction(signature)
const logs: string[] = transaction.meta.logs
```