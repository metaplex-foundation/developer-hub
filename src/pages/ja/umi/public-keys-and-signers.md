---
title: 公開キーと署名者
metaTitle: 公開キーと署名者 | Umi
description: Metaplex Umiでの公開キーと署名者
---
このページでは、EdDSAインターフェースによって部分的に可能になったUmiでの公開キーと署名者の管理方法を見ていきます。

[EdDSAインターフェース](https://umi.typedoc.metaplex.com/interfaces/umi.EddsaInterface.html)は、EdDSAアルゴリズムを使用してキーペアの作成、PDAの検索、メッセージの署名/検証に使用されます。このインターフェースを直接使用するか、このインターフェースに委託してより良い開発者エクスペリエンスを提供するヘルパーメソッドを使用できます。

これをユースケースごとに取り組んでみましょう。

{% callout type="note" %}
ウォレットアダプターやファイルシステムウォレットを使用するスニペットをお探しですか？[スタートガイドページ](/ja/umi/getting-started)をチェックしてください！
{% /callout %}

## 公開キー

Umiでは、公開キーは32バイト配列を表すシンプルなbase58 `string`です。与えられた公開キーが検証され有効であることをTypeScriptに伝えるために不透明型を使用します。また、より細かい型安全性を提供するために型パラメーターを使用します。

```ts
// 簡単に言うと：
type PublicKey = string;

// 実際には：
type PublicKey<TAddress extends string = string> = TAddress & { __publicKey: unique symbol };
```

`publicKey`ヘルパーメソッドを使用して、さまざまな入力から新しい有効な公開キーを作成できます。提供された入力が有効な公開キーに変換できない場合、エラーが投げられます。

```ts
// base58文字列から。
publicKey('LorisCg1FTs89a32VSrFskYDgiRbNQzct1WxyZb7nuA');

// 32バイトバッファーから。
publicKey(new Uint8Array(32));

// PublicKeyまたはSignerタイプから。
publicKey(someWallet as PublicKey | Signer);
```

`publicKeyBytes`ヘルパーメソッドを使用して、公開キーを`Uint8Array`に変換することが可能です。

```ts
publicKeyBytes(myPublicKey);
// -> Uint8Array(32)
```

公開キーの管理を支援する追加のヘルパーメソッドも利用可能です。

```ts
// 提供された値が有効な公開キーかどうかをチェック。
isPublicKey(myPublicKey);

// 提供された値が有効な公開キーであることをアサートし、そうでなければ失敗。
assertPublicKey(myPublicKey);

// 公開キーの配列を重複除去。
uniquePublicKeys(myPublicKeys);

// デフォルト公開キーを作成（32バイトのゼロ配列）。
defaultPublicKey();
```

## PDA

PDA（Program-Derived Address）は、プログラムIDと事前定義されたシードの配列から派生した公開キーです。PDAがEdDSA楕円曲線上に存在せず、したがって暗号学的に生成された公開キーと競合しないことを確実にするために、0から255の範囲の`bump`番号が必要です。

Umiでは、PDAは派生した公開キーとバンプ番号で構成されるタプルとして表現されます。公開キーと同様に、不透明型と型パラメーターを使用します。

```ts
// 簡単に言うと：
type Pda = [PublicKey, number];

// 実際には：
export type Pda<
  TAddress extends string = string,
  TBump extends number = number
> = [PublicKey<TAddress>, TBump] & { readonly __pda: unique symbol };
```

新しいPDAを派生するには、EdDSAインターフェースの`findPda`メソッドを使用できます。

```ts
const pda = umi.eddsa.findPda(programId, seeds);
```

各シードは`Uint8Array`としてシリアライズされる必要があります。シリアライザーについて詳しくは[シリアライザーページ](serializers)で学べますが、指定されたミントアドレスのメタデータPDAを見つける方法を示す簡単な例を以下に示します。

```ts
import { publicKey } from '@metaplex-foundation/umi';
import { publicKey as publicKeySerializer, string } from '@metaplex-foundation/umi/serializers';

const tokenMetadataProgramId = publicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');
const metadata = umi.eddsa.findPda(tokenMetadataProgramId, [
  string({ size: 'variable' }).serialize('metadata'),
  publicKeySerializer().serialize(tokenMetadataProgramId),
  publicKeySerializer().serialize(mint),
]);
```

ほとんどの場合、プログラムは特定のPDAを見つけるためのヘルパーメソッドを提供することに注意してください。たとえば、上記のコードスニペットは、[`@metaplex-foundation/mpl-token-metadata`](https://github.com/metaplex-foundation/mpl-token-metadata) [Kinobi](kinobi)生成ライブラリの`findMetadataPda`メソッドを使用して次のように簡略化できます。

```ts
import { findMetadataPda } from '@metaplex-foundation/mpl-token-metadata';

const metadata = findMetadataPda(umi, { mint })
```

PDAの管理を支援する以下のヘルパーメソッドも利用可能です。

```ts
// 提供された値がPdaかどうかをチェック。
isPda(myPda);

// 提供された公開キーがEdDSA楕円曲線上にあるかどうかをチェック。
umi.eddsa.isOnCurve(myPublicKey);
```

## 署名者

署名者は、トランザクションとメッセージに署名できる公開キーです。これにより、トランザクションが必要なアカウントによって署名され、ウォレットがメッセージに署名することでアイデンティティを証明できます。Umiでは、以下のインターフェースで表現されます。

```ts
interface Signer {
  publicKey: PublicKey;
  signMessage(message: Uint8Array): Promise<Uint8Array>;
  signTransaction(transaction: Transaction): Promise<Transaction>;
  signAllTransactions(transactions: Transaction[]): Promise<Transaction[]>;
}
```

`generateSigner`ヘルパーメソッドを使用して、暗号学的に新しい署名者を生成できます。内部的に、このメソッドは次のセクションで説明するEdDSAインターフェースの`generateKeypair`メソッドを使用します。

```ts
const mySigner = generateSigner(umi);
```

署名者を管理するために以下のヘルパー関数も使用できます。

```ts
// 提供された値がSignerかどうかをチェック。
isSigner(mySigner);

// 公開キーによって署名者の配列を重複除去。
uniqueSigners(mySigners);
```

[Umiインターフェースページ](interfaces)で述べたように、`Umi`インターフェースは`Signer`の2つのインスタンスを格納します：アプリを使用する`identity`とトランザクションとストレージ料金を支払う`payer`です。Umiは、これらの属性に新しい署名者をすばやく割り当てるためのプラグインを提供します。この目的のために`signerIdentity`と`signerPayer`プラグインが利用可能です。デフォルトでは、`signerIdentity`メソッドは`payer`属性も更新することに注意してください。なぜなら、ほとんどの場合、identityもpayerだからです。

```ts
umi.use(signerIdentity(mySigner));
// これは以下と同等です：
umi.identity = mySigner;
umi.payer = mySigner;

umi.use(signerIdentity(mySigner, false));
// これは以下と同等です：
umi.identity = mySigner;

umi.use(signerPayer(mySigner));
// これは以下と同等です：
umi.payer = mySigner;
```

新しい署名者を生成し、すぐに`identity`および/または`payer`属性に割り当てるために、`generatedSignerIdentity`と`generatedSignerPayer`プラグインも使用できます。

```ts
umi.use(generatedSignerIdentity());
umi.use(generatedSignerPayer());
```

場合によっては、ライブラリで`Signer`を提供する必要があるが、現在の環境では署名者としてこのウォレットにアクセスできない場合があります。たとえば、これはトランザクションがクライアントで作成されるが、後でプライベートサーバーで署名される場合に発生する可能性があります。そのため、Umiは指定された公開キーから新しい署名者を作成し、署名要求を単純に無視する`createNoopSigner`ヘルパーを提供します。その後、トランザクションがブロックチェーンに送信される前に署名されることを確認するのはあなたの責任です。

```ts
const mySigner = createNoopSigner(myPublicKey);
```

## キーペア

UmiはウォレットからBrandingRequestを要求するために`Signer`インターフェースにのみ依存しますが、秘密キーを明示的に認識する`Keypair`タイプと`KeypairSigner`タイプも定義します。

```ts
type KeypairSigner = Signer & Keypair;
type Keypair = {
  publicKey: PublicKey;
  secretKey: Uint8Array;
};
```

EdDSAインターフェースの`generateKeypair`、`createKeypairFromSeed`、`createKeypairFromSecretKey`メソッドを使用して、新しい`Keypair`オブジェクトを生成できます。

```ts
// 新しいランダムキーペアを生成。
const myKeypair = umi.eddsa.generateKeypair();

// シードを使用してキーペアを復元。
const myKeypair = umi.eddsa.createKeypairFromSeed(mySeed);

// 秘密キーを使用してキーペアを復元。
const myKeypair = umi.eddsa.createKeypairFromSecretKey(mySecretKey);
```

アプリケーション全体でこれらのキーペアを署名者として使用するために、`createSignerFromKeypair`ヘルパーメソッドを使用できます。このメソッドは`KeypairSigner`のインスタンスを返して、必要に応じて秘密キーにアクセスできることを確認します。

```ts
const myKeypair = umi.eddsa.generateKeypair();
const myKeypairSigner = createSignerFromKeypair(umi, myKeypair);
```

上記のコードスニペットは、前のセクションで説明した`generateSigner`ヘルパーメソッドを使用することと同等であることに注意してください。

キーペアを管理するためのヘルパー関数とプラグインも存在します。

```ts
// 提供された署名者がKeypairSignerオブジェクトかどうかをチェック。
isKeypairSigner(mySigner);

// 新しいキーペアをidentityとpayerとして登録。
umi.use(keypairIdentity(myKeypair));

// 新しいキーペアをpayerのみとして登録。
umi.use(keypairPayer(myKeypair));
```

## メッセージの署名

`Signer`オブジェクトとEdDSAインターフェースを一緒に使用して、次のようにメッセージに署名し検証できます。

```ts
const myMessage = utf8.serialize('Hello, world!');
const mySignature = await mySigner.signMessage(myMessage)
const mySignatureIsCorrect = umi.eddsa.verify(myMessage, mySignature, mySigner.publicKey);
```

## トランザクションの署名

`Signer`インスタンスがあれば、トランザクションまたはトランザクションのセットに署名することは、`signTransaction`または`signAllTransactions`メソッドを呼び出すのと同じくらい簡単です。

```ts
const mySignedTransaction = await mySigner.signTransaction(myTransaction);
const mySignedTransactions = await mySigner.signAllTransactions(myTransactions);
```

複数の署名者が同じトランザクションにすべて署名する必要がある場合は、次のように`signTransaction`ヘルパーメソッドを使用できます。

```ts
const mySignedTransaction = await signTransaction(myTransaction, mySigners);
```

さらに進んで、それぞれが1つ以上の署名者によって署名される必要がある複数のトランザクションがある場合、`signAllTransactions`関数がそれを支援できます。署名者が複数のトランザクションに署名する必要がある場合、一度にすべてに対して`signer.signAllTransactions`メソッドを使用することも確認します。

```ts
// この例では、mySigner2は
// signAllTransactionsメソッドを使用して両方のトランザクションに署名します。
const mySignedTransactions = await signAllTransactions([
  { transaction: myFirstTransaction, signers: [mySigner1, mySigner2] },
  { transaction: mySecondTransaction, signers: [mySigner2, mySigner3] }
]);
```

`Signer`を手動で作成し、したがってその`signTransaction`メソッドを実装している場合、`addTransactionSignature`ヘルパー関数を使用してトランザクションに署名を追加したい場合があります。これにより、提供された署名がトランザクションによって必要とされ、トランザクションの`signatures`配列の正しいインデックスにプッシュされることが確認されます。

```ts
const mySignedTransaction = addTransactionSignature(myTransaction, mySignature, myPublicKey);
```