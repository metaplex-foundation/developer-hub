---
title: Umiヘルパー
metaTitle: Umiヘルパー | Umi
description: Umiに組み込まれたヘルパーの概要
---
コアインターフェースの上に、Umiは、Solanaプログラムでの作業を簡単にするために使用できるヘルパー関数のセットを提供します。

## 金額

`Amount`は、大きな小数点数を定義できる特別なタイプです。これは、数値を可能な限り低い単位（例：lamports）で表現し、その単位の小数点数（例：9）を追跡することで実現されます。これにより、数値のより正確な表現が可能になり、IEEE 754浮動小数点数によって引き起こされるJavaScriptの丸め誤差を回避できます。また、文字列識別子を使用して、操作を実行する際に同じ単位の金額を扱っていることを確認します。以下が`Amount`ジェネリックタイプの定義方法です：

```ts
type AmountIdentifier = 'SOL' | 'USD' | '%' | 'splToken' | string;
type AmountDecimals = number;
type Amount<
  I extends AmountIdentifier = AmountIdentifier,
  D extends AmountDecimals = AmountDecimals
> = {
  /** 小数点を含まないように最低可能単位での金額。 */
  basisPoints: bigint;
  /** 金額の識別子。 */
  identifier: I;
  /** 金額の小数点数。 */
  decimals: D;
};
```

Umiは、SOLやUSDのような特定のケース用にこの`Amount`タイプの特定バージョンも提供します。

```ts
type SolAmount = Amount<'SOL', 9>;
type UsdAmount = Amount<'USD', 2>;
type PercentAmount<D extends AmountDecimals> = Amount<'%', D>;
```

開発者が金額を扱いやすくするために、Umiは金額を作成、フォーマット、および操作するために使用できるヘルパー関数のセットを提供します。

これらすべてのヘルパーについて詳しく学ぶために[APIリファレンスの「Utils — Amounts」セクションをチェック](https://umi.typedoc.metaplex.com/modules/umi.html)したいかもしれませんが、新しい金額タイプを作成するのに役立つ関数の簡単なリストをここに示します。

```ts
// ベーシスポイントから金額を作成。
createAmount(123, 'USD', 2); // -> "USD 1.23"の金額

// 小数点数から金額を作成。
createAmountFromDecimals(1.23, 'USD', 2); // -> "USD 1.23"の金額

// USD金額を作成するヘルパー関数。
usd(1.23) // -> "USD 1.23"の金額

// SOL金額を扱うヘルパー関数。
sol(1.23) // -> "1.23 SOL"の金額
lamports(1_230_000_000) // -> "1.23 SOL"の金額

// パーセント金額を作成するヘルパー関数。
percentAmount(50.42); // -> "50.42%"の金額
percentAmount(50.42, 2); // -> "50.42%"の金額
percentAmount(50.42, 0); // -> "50%"の金額

// トークン金額を作成するヘルパー関数。
tokenAmount(123); // -> "123 Tokens"の金額
tokenAmount(123, 'splToken.BONK'); // -> "123 BONK"の金額
tokenAmount(123.45, 'splToken.BONK', 2); // -> "123.45 BONK"の金額
```

## オプション

Rustでは、オプション値を`Some(T)`または`None`のいずれかになる`Option<T>`列挙として定義します。これは通常、JavaScriptの世界では`T | null`として表現されます。このアプローチの問題は、ネストされたオプションでは機能しないことです。たとえば、Rustの`Option<Option<T>>`はJavaScriptでは`T | null | null`になり、これは`T | null`と等価です。つまり、JavaScriptでは`Some(None)`値やその他のネストされたオプションを表現する方法がありません。

この問題を解決するために、UmiはRustの`Option<T>`タイプと非常によく似た[`Option<T>`ユニオンタイプ](https://umi.typedoc.metaplex.com/types/umi.Option.html)を提供します。以下のように定義されています：

```ts
type Option<T> = Some<T> | None;
type Some<T> = { __option: 'Some'; value: T };
type None = { __option: 'None' };
```

開発者エクスペリエンスを向上させるため、Umiはオプションを作成するための`some`と`none`関数を提供します。オプションのタイプ`T`は、TypeScriptによって推論されるか、明示的に提供されます。

```ts
// 値を持つオプションを作成。
some('Hello World');
some<number | string>(123);

// 空のオプションを作成。
none();
none<number | string>();
```

Umiは、オプションを検証および操作するためのヘルパー関数のセットも提供します。

```ts
// オプションが`Some`または`None`かどうかをチェック。
isSome(some('Hello World')); // -> true
isSome(none()); // -> false
isNone(some('Hello World')); // -> false
isNone(none()); // -> true

// `Some`の場合はオプションの値をアンラップし、そうでなければnullを返す。
// `None`用のカスタムフォールバック値をサポート。
unwrapOption(some('Hello World')) // -> 'Hello World'
unwrapOption(none()) // -> null
unwrapOption(some('Hello World'), () => 'Default'); // -> 'Hello World'
unwrapOption(none(), () => 'Default'); // -> 'Default'

// `unwrapOption`と同じですが、再帰的に（元のオブジェクト/配列を変更せずに）。
// `None`用のカスタムフォールバック値もサポート。
unwrapOptionRecursively({
  a: 'hello',
  b: none<string>(),
  c: [{ c1: some(42) }, { c2: none<number>() }],
}) // -> { a: 'hello', b: null, c: [{ c1: 42 }, { c2: null }] }
```

## 日時

Umiは、秒単位のタイムスタンプを使用して日付と時刻を表現するために使用できる`DateTime`タイプを提供します。これは単純に`bigint`数値として定義され、日時を作成およびフォーマットするためのヘルパー関数のセットを提供します。

```ts
// 新しいDateTimeを作成。
dateTime(1680097346);
dateTime(new Date(Date.now()));
dateTime("2021-12-31T23:59:59.000Z");

// 現在の時刻の新しいDateTimeを作成。
now();

// DateTimeをフォーマット。
formatDateTime(now());
formatDateTime(now(), 'fr-FR', myFormatOptions);
```

## GpaBuilder

`getProgramAccounts` RPCリクエストの準備を支援するため、Umiは[不変の`GpaBuilder`ヘルパークラス](https://umi.typedoc.metaplex.com/classes/umi.GpaBuilder.html)を提供します。これを使用して、フィルターの追加、データのスライス、生のアカウントの取得を行いながら、それらを必要なものにマップできます。以下にいくつかの例を示します。

```ts
// プログラムのすべてのアカウントを取得。
await gpaBuilder(umi, programId).get();

// 500バイトの長さのアカウントの最初の32バイトを取得。
await gpaBuilder(umi, programId)
  .slice(0, 32)
  .whereSize(500)
  .get();

// オフセット32に指定された公開キーを持つアカウントの公開キーを取得。
await gpaBuilder(umi, programId)
  .withoutData()
  .where(32, myPublicKey)
  .getPublicKey();

// アカウントデータの最初の32バイトを公開キーとして取得。
await gpaBuilder(umi, programId)
  .slice(0, 32)
  .getDataAsPublicKey();

// アカウントデータの2番目のバイトを取得し、2倍にする。
await gpaBuilder(umi, programId)
  .slice(1, 1)
  .getAndMap((n) => n * 2);
```

`GpaBuilder`は、`deserializeUsing`メソッドを介して、生のアカウントをデシリアライズされたアカウントにデシリアライズする方法を指示することもできます。デシリアライゼーションコールバックが提供されると、`getDeserialized`メソッドを使用してデシリアライズされたアカウントを取得できます。

```ts
const metadataGpaBuilder = gpaBuilder(umi, programId)
  .deserializeUsing<Metadata>((account) => deserializeMetadata(umi, account));

const accounts: Metadata[] = await metadataGpaBuilder.getDeserialized();
```

さらに、フィルタリングおよびデータスライシングに関する開発者エクスペリエンスを向上させるために、オフセットとともにフィールドのセットを`GpaBuilder`に渡すことができます。これを行うには、`registerFields`メソッドを使用できます。たとえば、バイト16から始まって、次の32バイトが固定サイズ文字列を介して`name`を表し、その後の4バイトが`age`を表すことがわかっているとしましょう。以下は、それらのフィールドを登録する方法です。

```ts
import { gpaBuilder } from '@metaplex-foundation/umi';
import { string, u32 } from '@metaplex-foundation/umi/serializers';

const myGpaBuilderWithFields = gpaBuilder(umi, programId)
  .registerFields<{ name: string; age: number; }>({
    name: [16, string({ size: 32 })],
    age: [48, u32()],
  })
```

フィールドが登録されると、`whereField`および`sliceField`メソッドを使用して、フィールドを使用してデータをフィルタリングおよびスライスできます。使用するオフセットがわかるだけでなく、その値をシリアライズする方法もわかります。

```ts
// 年齢が42のアカウントの名前を取得。
await myGpaBuilderWithFields
  .whereField('age', 42)
  .sliceField('name')
  .get();
```
