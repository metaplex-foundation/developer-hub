---
title: シリアライザー
metaTitle: シリアライザー | Umi
description: Metaplex Umiのシリアライザーとデシリアライザー
---
ブロックチェーンにデータを送信する際も読み込む際も、シリアライゼーションはプロセスの重要な部分です。シリアライゼーションのロジックはプログラムによって異なることがあり、Borshシリアライゼーションがsolanaプログラムで最も人気のある選択肢ですが、唯一の選択肢ではありません。

Umiは、独自のシリアライザーを構築できる柔軟で拡張可能なシリアライゼーションフレームワークを提供することでこれを支援します。具体的には、以下が含まれます：
- `From`を`Uint8Array`にシリアライズし、`Uint8Array`を`To`（デフォルトは`From`）にデシリアライズできるオブジェクトを表すジェネリック`Serializer<From, To = From>`タイプ。
- シリアライザーを新しいシリアライザーにマップおよび変換するシリアライザーヘルパーの束。
- 最後に、文字列エンコーダー、数値シリアライザー、データ構造などの一般的なタイプをシリアライズするために使用できる組み込みシリアライザーのセット。これらのプリミティブを使用して、より複雑なシリアライザーを構築できます。

すべての仕組みを見てみましょう。

## シリアライザー定義

`Serializer`タイプは、Umiのシリアライゼーションフレームワークの中心的な部分です。タイプ`T`の`Serializer`インスタンスがあれば、`T`のインスタンスをシリアライズおよびデシリアライズするために必要なすべてが揃っているはずです。たとえば、`Serializer<{ name: string, age: number }>`インスタンスを使用して、`{ name: string, age: number }`のインスタンスをシリアライズおよびデシリアライズできます。

場合によっては、シリアライズしたいデータが、デシリアライズ時に取得するデータよりもわずかに緩い場合があります。この理由により、`Serializer<From, To>`タイプは、`From`を拡張し、デフォルトで`From`となる2番目のタイプパラメーター`To`を許可します。前の例を使用すると、`age`属性がオプションで、提供されない場合は`42`にデフォルト設定されることを想像してください。その場合、`{ name: string, age?: number }`を`Uint8Array`にシリアライズするが、`Uint8Array`を`{ name: string, age: number }`にデシリアライズする`Serializer<{ name: string, age?: number }, { name: string, age: number }>`インスタンスを定義できます。

以下が`Serializer`タイプの定義方法です。

```ts
type Serializer<From, To extends From = From> = {
  /** シリアライザーの説明。 */
  description: string;
  /** シリアライズされた値の固定サイズ（バイト単位）、または可変の場合は`null`。 */
  fixedSize: number | null;
  /** シリアライズされた値が取ることができる最大サイズ（バイト単位）、または可変の場合は`null`。 */
  maxSize: number | null;
  /** 値をバイトにシリアライズする関数。 */
  serialize: (value: From) => Uint8Array;
  /**
   * バイトから値をデシリアライズする関数。
   * デシリアライズされた値と読み取られたバイト数を返します。
   */
  deserialize: (buffer: Uint8Array, offset?: number) => [To, number];
};
```

驚くべきことではない`serialize`および`deserialize`関数に加えて、`Serializer`タイプには`description`、`fixedSize`、`maxSize`も含まれます。
- `description`は、シリアライザーを説明する簡単な人間が読める文字列です。
- `fixedSize`属性は、固定サイズシリアライザーを扱っている場合にのみ、シリアライズされた値のサイズをバイト単位で示します。たとえば、`u32`シリアライザーは常に`4`バイトの`fixedSize`を持ちます。
- `maxSize`属性は、取ることができる最大サイズに境界がある可変サイズシリアライザーを扱っている場合に役立ちます。たとえば、borsh `Option<PublicKey>`シリアライザーは、サイズ`1`または`33`のいずれかになることができ、したがって`33`バイトの`maxSize`を持ちます。

## シリアライザーの使用

Umiフレームワークにバンドルされている`@metaplex-foundation/umi/serializers`サブモジュールから`Serializer`タイプとシリアライザー関連のすべてをインポートできます。また、フレームワークの残りの部分なしで使用したい場合は、スタンドアロンの`@metaplex-foundation/umi-serializers`ライブラリとしてインポートすることもできます。

```ts
// Umiにバンドル。
import { Serializer } from '@metaplex-foundation/umi/serializers';

// スタンドアロンライブラリとして。
import { Serializer } from '@metaplex-foundation/umi-serializers';
```

インポートしたら、Umiが提供するすべての組み込みシリアライザーとヘルパーを使用できます。以下のセクションでそれぞれを詳しく見ていきますが、今のところ、それらがどのように機能するかを見るための簡単な例を見てみましょう。`name`属性（`string`タイプ）、`publicKey`属性（`PublicKey`タイプ）、`numbers`属性（`number[]`タイプ、各数値は`u32`整数）を含むさまざまな属性を持つ`MyObject`タイプがあったとしましょう。以下は、そのためのシリアライザーを作成する方法です。

```ts
import { PublicKey } from '@metaplex-foundation/umi';
import { Serializer, struct, string, publicKey, array, u32 } from '@metaplex-foundation/umi/serializers';

type MyObject = {
  name: string;
  publicKey: PublicKey;
  numbers: number[];
};

const mySerializer: Serializer<MyObject> = struct([
  ['name', string()],
  ['publicKey', publicKey()],
  ['numbers', array(u32())],
]);
```

提供された各シリアライザーは独自の引数を定義しますが（たとえば、`array`関数は最初の引数としてアイテムシリアライザーを必要とします）、そのほとんどは最後にオプションの`options`引数を持ち、シリアライザーの動作を調整するために使用できます。`options`引数内の属性はシリアライザーによって異なる場合がありますが、それらはすべて1つの共通属性を共有します：`description`。これを使用して、作成されたシリアライザーの特定の説明を提供できます。省略された場合、十分な説明が作成されることに注意してください。

```ts
import { string } from '@metaplex-foundation/umi/serializers';

string().description; // -> 'string(utf8; u32(le))'.
string({ description: 'My custom string description' });
```

## シリアライザーヘルパー

シリアライザーをインポートして使用する方法がわかったところで、Umiがそれらを変換するために提供するヘルパーメソッドのいくつかを見てみましょう。

### シリアライザーのマッピング

`mapSerializer`を使用すると、`B`を`A`に変換し、`A`を`B`に戻す2つの関数を提供することで、`Serializer<A>`を`Serializer<B>`に変換できます。

たとえば、文字列の長さを格納することで、文字列シリアライザーを数値シリアライザーに変換したいとします。以下は、`mapSerializer`関数を使用してそれを行う方法です。

```ts
const serializerA: Serializer<string> = ...;
const serializerB: Serializer<number> = mapSerializer(
  serializerA,
  (value: number): string => 'x'.repeat(value), // 指定された長さのモック文字列を作成。
  (value: string): number => value.length, // 文字列の長さを取得。
);
```

`mapSerializer`は、異なる`From`および`To`タイプを持つシリアライザーを変換するためにも使用できます。以下は上記の例と似ていますが、異なる`To`タイプです。

```ts
const serializerA: Serializer<string | null, string> = ...;
const serializerB: Serializer<number | null, number> = mapSerializer(
  serializerA,
  (value: number | null): string | null => value === null ? null : 'x'.repeat(value),
  (value: string): number => value.length,
);
```

`To`タイプを変更せずに、シリアライザーの`From`タイプのみを変換することに興味がある場合は、代わりに1つの関数のみで`mapSerializer`関数を使用できることに注意してください。以下は、`Serializer<{ name: string, age: number }>`インスタンスを緩めて、シリアライズ時のみ`age`属性をオプションにする方法です。

```ts
type Person = { name: string, age: number };
type PersonWithOptionalAge = { name: string, age?: number };

const serializerA: Serializer<Person> = ...;
const serializerB: Serializer<PersonWithOptionalAge, Person> = mapSerializer(
  serializerA,
  (value: PersonWithOptionalAge): Person => ({
    name: value.name,
    age: value.age ?? 42,
  }),
);
```

シリアライザーのマッピングは、組み込みシリアライザーに依存しながら複雑なユースケースを構築するのに役立つ非常に強力な技術です。

### シリアライザーの固定

`fixSerializer`関数は、固定サイズをバイト単位で要求することで、可変サイズシリアライザーを固定サイズシリアライザーに変換できる別のヘルパーです。必要に応じて`Uint8Array`バッファーを要求されたサイズにパディングまたは切り詰めることでこれを行います。返されるシリアライザーは、元のシリアライザーと同じ`From`および`To`タイプを持ちます。

```ts
const myFixedSerializer = fixSerializer(myVariableSerializer, 42);
```

### シリアライザーの逆転

`reverseSerializer`関数を使用すると、固定サイズシリアライザーのバイトを逆転させることができます。この関数のアプリケーションはあまり頻繁ではありませんが、たとえばエンディアンネスを扱う際に役立つことがあります。ここでも、返されるシリアライザーは元のシリアライザーと同じ`From`および`To`タイプを持ちます。

```ts
const myReversedSerializer = reverseSerializer(mySerializer);
```

### バイトヘルパー

バイトを操作するための低レベルヘルパーメソッドも提供されることは注目に値します。これらはシリアライザーを返しませんが、カスタムシリアライザーを構築する際に役立つことがあります。

```ts
// 複数のUint8Arrayバッファーを1つにマージ。
mergeBytes([new Uint8Array([1, 2]), new Uint8Array([3, 4])]); // -> Uint8Array([1, 2, 3, 4])

// Uint8Arrayバッファーを指定されたサイズにパディング。
padBytes(new Uint8Array([1, 2]), 4); // -> Uint8Array([1, 2, 0, 0])
padBytes(new Uint8Array([1, 2, 3, 4]), 2); // -> Uint8Array([1, 2, 3, 4])

// Uint8Arrayバッファーを指定されたサイズにパディングおよび切り詰め。
fixBytes(new Uint8Array([1, 2]), 4); // -> Uint8Array([1, 2, 0, 0])
fixBytes(new Uint8Array([1, 2, 3, 4]), 2); // -> Uint8Array([1, 2])
```

## 組み込みシリアライザー

それでは、Umiに付属するさまざまなシリアライザーを見てみましょう。これらの各プリミティブは、前のセクションで見たように、より複雑なシリアライザーを構築するために使用できます。

### 数値

Umiには12の数値シリアライザーが付属しています：5つの符号なし整数、5つの符号付き整数、2つの浮動小数点数。これらは異なるサイズの数値をシリアライズおよびデシリアライズするために使用できます。数値のサイズが32ビットより大きい場合、JavaScriptのネイティブ`number`タイプは`2^53 - 1`より大きな数値をサポートしないため、返されるシリアライザーは`Serializer<number>`ではなく`Serializer<number | bigint, bigint>`になります。

```ts
// 符号なし整数。
u8(); // -> Serializer<number>
u16(); // -> Serializer<number>
u32(); // -> Serializer<number>
u64(); // -> Serializer<number | bigint, bigint>
u128(); // -> Serializer<number | bigint, bigint>

// 符号付き整数。
i8(); // -> Serializer<number>
i16(); // -> Serializer<number>
i32(); // -> Serializer<number>
i64(); // -> Serializer<number | bigint, bigint>
i128(); // -> Serializer<number | bigint, bigint>

// 浮動小数点数。
f32(); // -> Serializer<number>
f64(); // -> Serializer<number>
```

1バイトのみを使用する`u8`および`i8`シリアライザーを除き、他のすべての数値シリアライザーはデフォルトでリトルエンディアンで表現され、異なるエンディアンネスを使用するように設定できます。これは、シリアライザーに`endian`オプションを渡すことで行えます。

```ts
u64(); // リトルエンディアン。
u64({ endian: Endian.Little }); // リトルエンディアン。
u64({ endian: Endian.Big }); // ビッグエンディアン。
```

数値シリアライザーは他のシリアライザーでしばしば再利用されるため、Umiは`number`および`bigint`タイプの両方を含む以下の`NumberSerializer`タイプを定義することに注意してください。

```ts
type NumberSerializer =
  | Serializer<number>
  | Serializer<number | bigint, bigint>;
```

### ブール値

`bool`シリアライザーを使用して`Serializer<boolean>`を作成できます。デフォルトでは、ブール値を格納するために`u8`数値を使用しますが、これは`size`オプションに`NumberSerializer`を渡すことで変更できます。

```ts
bool(); // -> u8を使用。
bool({ size: u32() }); // -> u32を使用。
bool({ size: u32({ endian: Endian.Big }) }); // -> ビッグエンディアンu32を使用。
```

### 文字列エンコーディング

Umiには、異なる形式で文字列をシリアライズおよびデシリアライズするために使用できる以下の文字列シリアライザーが付属しています：`utf8`、`base10`、`base16`、`base58`、`base64`。

```ts
utf8.serialize('Hello World!');
base10.serialize('42');
base16.serialize('ff002a');
base58.serialize('LorisCg1FTs89a32VSrFskYDgiRbNQzct1WxyZb7nuA');
base64.serialize('SGVsbG8gV29ybGQhCg==');
```

また、指定されたアルファベットに対して新しい文字列シリアライザーを作成できる`baseX`関数も付属しています。たとえば、以下は`base58`シリアライザーの実装方法です。

```ts
const base58: Serializer<string> = baseX(
  '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
);
```

### 文字列

`string`シリアライザーは、さまざまなエンコーディングとサイズ戦略を使用して文字列をシリアライズするために使用できる`Serializer<string>`を返します。以下のオプションが含まれます：
- `encoding`: 文字列をシリアライズおよびデシリアライズする際に使用するエンコーディングを表す`Serializer<string>`。デフォルトは組み込みの`utf8`シリアライザーです。なぜ`Serializer<string>`を渡して`Serializer<string>`を作成する必要があるのかと疑問に思うかもしれませんが、これは`encoding`シリアライザーの目的が、文字列のサイズを格納するなどの他のことを心配せずに、テキストをバイト配列との間で変換することだけだからです。これにより、他のすべてのオプションを活用しながら、任意のエンコーディングを接続できます。
- `size`: 指定されたバッファーで文字列がどこまで続くかを知るためには、そのサイズをバイト単位で知る必要があります。そのために、以下のサイズ戦略のいずれかを使用できます：
  - `NumberSerializer`: 数値シリアライザーが渡されると、文字列のサイズを格納および復元するためのプレフィックスとして使用されます。デフォルトでは、サイズはリトルエンディアンの`u32`プレフィックスを使用して格納されます（これはborshシリアライゼーションのデフォルト動作です）。
  - `number`: バイトサイズは明示的に数値として提供することもできます。これにより、サイズプレフィックスを使用せず、常に同じバイト数を使用して文字列を格納する固定サイズシリアライザーが作成されます。
  - `"variable"`: サイズとして文字列`"variable"`が渡されると、デシリアライズ時にバッファー内の残りのすべてのバイトを使用する可変サイズシリアライザーが作成されます。シリアライズ時には、シリアライズされた文字列のサイズを格納せずに、単に`encoding`シリアライザーの結果を返します。

```ts
// 参考用の異なるエンコーディングを使用したシリアライズされた値。
utf8.serialize('Hi'); // -> 0x4869
base58.serialize('Hi'); // -> 0x03c9

// デフォルト動作：utf8エンコーディングとu32（リトルエンディアン）サイズ。
string().serialize('Hi'); // -> 0x020000004869

// カスタムエンコーディング：base58。
string({ encoding: base58 }).serialize('Hi'); // -> 0x0200000003c9

// カスタムサイズ：u16（ビッグエンディアン）サイズ。
string({ size: u16({ endian: Endian.Big }) }).serialize('Hi'); // -> 0x00024869

// カスタムサイズ：5バイト。
string({ size: 5 }).serialize('Hi'); // -> 0x4869000000

// カスタムサイズ：可変。
string({ size: 'variable' }).serialize('Hi'); // -> 0x4869
```

### バイト

`bytes`シリアライザーは、`Uint8Array`を...`Uint8Array`にデシリアライズする`Serializer<Uint8Array>`を返します。これは少し無用に思えるかもしれませんが、他のシリアライザーに構成される際に役立つことがあります。たとえば、特定のフィールドがシリアライズされずに残されるべきことを示すために、`struct`シリアライザーで使用できます。

`string`関数と非常に似て、`bytes`関数には、バイト配列のサイズがどのように格納および復元されるかを設定する`size`オプションが含まれます。ここでのデフォルトサイズが`"variable"`戦略であることを除いて、`string`関数と同じサイズ戦略がサポートされています。要約すると：
- `NumberSerializer`: バイト配列のサイズを格納および復元するためにプレフィックス数値シリアライザーを使用します。
- `number`: バイト配列を格納するために固定サイズを使用します。
- `"variable"`: シリアライズ時にバッファーをそのまま渡し、デシリアライズ時にバッファーの残りを返します。デフォルト動作。

```ts
// デフォルト動作：可変サイズ。
bytes().serialize(new Uint8Array([42])); // -> 0x2a

// カスタムサイズ：u16（リトルエンディアン）サイズ。
bytes({ size: u16() }).serialize(new Uint8Array([42])); // -> 0x01002a

// カスタムサイズ：5バイト。
bytes({ size: 5 }).serialize(new Uint8Array([42])); // -> 0x2a00000000
```

### 公開キー

`publicKey`シリアライザーは、公開キーをシリアライズおよびデシリアライズするために使用できる`Serializer<PublicKey>`を返します。以下は、同じ公開キーをシリアライズおよびデシリアライズする例です。`publicKey`関数はメイン`@metaplex-foundation/umi`パッケージからもエクスポートされ、さまざまな入力から公開キーを作成できることに注意してください。したがって、競合を避けるためにインポートをエイリアスする必要がある場合があります。

```ts
import { publicKey } from '@metaplex-foundation/umi';
import { publicKey as publicKeySerializer } from '@metaplex-foundation/umi/serializers';

const myPublicKey = publicKey('...');
const buffer = publicKeySerializer().serialize(myPublicKey);
const [myDeserializedPublicKey, offset] = publicKeySerializer().deserialize(buffer);
myPublicKey === myDeserializedPublicKey; // -> true
```

### 単位

`unit`シリアライザーは、`undefined`を空の`Uint8Array`にシリアライズし、デシリアライズ時にバイトを消費せずに`undefined`を返す`Serializer<void>`を返します。これは他のシリアライザーによって内部的に使用できるより低レベルのシリアライザーです。たとえば、これが`dataEnum`シリアライザーが内部的に空のバリアントを記述する方法です。

```ts
unit().serialize(undefined); // -> new Uint8Array([])
unit().deserialize(new Uint8Array([42])); // -> [undefined, 0]
```

### 配列、セット、マップ

Umiは、リストとマップをシリアライズするための3つの関数を提供します：
- `array`: アイテムの配列をシリアライズします。引数として`Serializer<T>`を受け取り、`Serializer<T[]>`を返します。
- `set`: 一意のアイテムのセットをシリアライズします。引数として`Serializer<T>`を受け取り、`Serializer<Set<T>>`を返します。
- `map`: キー値ペアのマップをシリアライズします。キー用の`Serializer<K>`と値用の`Serializer<V>`を引数として受け取り、`Serializer<Map<K, V>>`を返します。

3つの関数はすべて、配列、セット、マップの長さがどのように格納および復元されるかを設定する同じ`size`オプションを受け取ります。これは`string`および`bytes`シリアライザーの動作と非常に似ています。サポートされている戦略は以下の通りです：
- `NumberSerializer`: コンテンツの前にそのサイズを付けた数値シリアライザーを使用します。デフォルトでは、サイズはリトルエンディアンの`u32`プレフィックスを使用して格納されます。
- `number`: 固定数のアイテムを持つ配列、セット、マップシリアライザーを返します。
- `"remainder"`: バッファーの残りをアイテムの固定サイズで割ることによってアイテム数を推定する配列、セット、マップシリアライザーを返します。たとえば、バッファーに64バイトが残っており、配列の各アイテムが16バイトの長さの場合、配列は4つのアイテムでデシリアライズされます。このオプションは固定サイズアイテムにのみ使用可能であることに注意してください。マップの場合、キーシリアライザーと値シリアライザーの両方が固定サイズである必要があります。

```ts
// 配列。
array(u8()) // u32サイズプレフィックス付きのu8アイテムの配列。
array(u8(), { size: 5 }) // 5つのu8アイテムの配列。
array(u8(), { size: 'remainder' }) // 可変サイズのu8アイテムの配列。

// セット。
set(u8()) // u32サイズプレフィックス付きのu8アイテムのセット。
set(u8(), { size: 5 }) // 5つのu8アイテムのセット。
set(u8(), { size: 'remainder' }) // 可変サイズのu8アイテムのセット。

// マップ。
map(u8(), u8()) // u32サイズプレフィックス付きの(u8, u8)エントリのマップ。
map(u8(), u8(), { size: 5 }) // 5つの(u8, u8)エントリのマップ。
map(u8(), u8(), { size: 'remainder' }) // 可変サイズの(u8, u8)エントリのマップ。
```

### オプションとヌル許容値

Umiは、オプション値をシリアライズするための2つの関数を提供します：
- `nullable`: nullになる可能性のある値をシリアライズします。引数として`Serializer<T>`を受け取り、`Serializer<Nullable<T>>`を返します。ここで`Nullable<T>`は`T | null`のタイプエイリアスです。
- `option`: `Option`インスタンスをシリアライズします（[ドキュメントを参照](helpers#options)）。引数として`Serializer<T>`を受け取り、`Serializer<OptionOrNullable<T>, Option<T>>`を返します。これは、デシリアライズされた値は常に`Option`タイプでラップされますが、シリアライズされた値は`Option<T>`または`Nullable<T>`のいずれかになることを意味します。

両方の関数は、値が存在するかどうかを示すブール値を前に付けることでオプション値をシリアライズします。プレフィックスブール値が`false`の場合、値は`null`（ヌル許容値の場合）または`None`（オプションの場合）であり、実際の値のデシリアライズをスキップできます。そうでない場合、値は提供されたシリアライザーを使用してデシリアライズされ、返されます。

両方とも、作成されたシリアライザーの動作を設定するための同じオプションを提供します：
- `prefix`: ブールプレフィックスをシリアライズおよびデシリアライズするために使用する`NumberSerializer`。デフォルトでは、リトルエンディアンの`u8`プレフィックスを使用します。
- `fixed`: これが`true`の場合、値が空の場合のシリアライゼーションロジックを変更することで固定サイズシリアライザーを返します。この場合、シリアライズされた値はゼロでパディングされ、空の値と満たされた値が同じバイト数を使用してシリアライズされます。これはアイテムシリアライザーが固定サイズの場合にのみ機能することに注意してください。

```ts
// オプション。
option(publicKey()) // u8プレフィックス付きのOption<PublicKey>。
option(publicKey(), { prefix: u16() }) // u16プレフィックス付きのOption<PublicKey>。
option(publicKey(), { fixed: true }) // 固定サイズのOption<PublicKey>。

// ヌル許容値。
nullable(publicKey()) // u8プレフィックス付きのNullable<PublicKey>。
nullable(publicKey(), { prefix: u16() }) // u16プレフィックス付きのNullable<PublicKey>。
nullable(publicKey(), { fixed: true }) // 固定サイズのNullable<PublicKey>。
```

### 構造体

`struct`シリアライザーは、ジェネリック型`T`のJavaScriptオブジェクトをシリアライズおよびデシリアライズできます。

最初の引数で各フィールドの名前とシリアライザーを配列として渡す必要があります。この`fields`配列は、各フィールドがタプルであり、最初の項目がフィールドの名前、2番目の項目がフィールドのシリアライザーとなるように構成されています。フィールドの順序は重要です。なぜなら、フィールドがシリアライズおよびデシリアライズされる順序を決定するからです。以下に例を示します。

```ts
type Person = {
  name: string;
  age: number;
}

struct<Person>([
  ['name', string()],
  ['age', u32()],
]);
```

`struct`関数は、一部のフィールドが異なる`From`および`To`タイプパラメーターを持つ場合に備えて、2番目のタイプパラメーター`U`も受け取ります。これにより、`Serializer<T, U>`タイプのシリアライザーを作成できます。

たとえば、以下は`Person`タイプの`age`フィールドにデフォルト値を提供する構造体シリアライザーを作成する方法です。

```ts
type Person = { name: string; age: number; }
type PersonArgs = { name: string; age?: number; }

const ageOr42 = mapSerializer(
  u32(),
  (age: number | undefined): number => age ?? 42,
);

struct<PersonArgs, Person>([
  ['name', string()],
  ['age', ageOr42],
]);
```

### タプル

Umiは、タプルをシリアライズおよびデシリアライズするために使用できる`tuple`シリアライザーを提供します。タプルはJavaScriptではネイティブではありませんが、各アイテムが独自の定義されたタイプを持つ配列を使用してTypeScriptで表現できます。たとえば、Rustの`(String, u8)`タプルはTypeScriptでは`[string, number]`として表現できます。

`tuple`関数は、最初の引数として、タプルのアイテムと同じ順序で一致するシリアライザーの配列を受け取ります。以下にいくつかの例を示します。

```ts
tuple([bool()]); // Serializer<[bool]>
tuple([string(), u8()]); // Serializer<[string, number]>
tuple([publicKey(), u64()]); // Serializer<[PublicKey, number | bigint], [PublicKey, bigint]>
```

### スカラー列挙

`scalarEnum`関数は、バリアントの値（またはインデックス）を`u8`数値として格納することで、スカラー列挙のシリアライザーを作成するために使用できます。

最初の引数として列挙コンストラクターが必要です。たとえば、列挙が`enum Direction { Left }`として定義されている場合、コンストラクター`Direction`を最初の引数として渡す必要があります。作成されたシリアライザーは、列挙のバリアント、その値、またはその名前を入力として受け取ります。以下に例を示します。

```ts
enum Direction { Left, Right, Up, Down };

const directionSerializer = scalarEnum(Direction); // Serializer<Direction>
directionSerializer.serialize(Direction.Left); // -> 0x00
directionSerializer.serialize(Direction.Right); // -> 0x01
directionSerializer.serialize('Left'); // -> 0x00
directionSerializer.serialize('Right'); // -> 0x01
directionSerializer.serialize(0); // -> 0x00
directionSerializer.serialize(1); // -> 0x01

// デシリアライズされた値は常に列挙のインスタンスです。
directionSerializer.deserialize(new Uint8Array([1])); // -> [Direction.Right, 1]
```

シリアライズされた値はデフォルトで`u8`数値シリアライザーを使用して格納されますが、`size`オプションとしてカスタム`NumberSerializer`を提供してその動作を変更できます。

```ts
scalarEnum(Direction, { size: u32() }).serialize(Direction.Right); // -> 0x01000000
```

文字列列挙（例：`enum Direction { Left = 'LEFT' }`）で`scalarEnum`関数を使用する場合、テキスト値は無視され、バリアントのインデックスのみが使用されることに注意してください。

```ts
enum Direction { Left = 'LEFT', Right = 'RIGHT', Up = 'UP', Down = 'DOWN' };

const directionSerializer = scalarEnum(Direction); // Serializer<Direction>
directionSerializer.serialize(Direction.Left); // -> 0x00
directionSerializer.serialize('Left'); // -> 0x00

// 列挙文字列値を入力として使用できることに注意してください。
directionSerializer.serialize('LEFT'); // -> 0x00
```

### データ列挙

Rustでは、列挙は強力なデータ型であり、そのバリアントは以下のいずれかになることができます：
- 空のバリアント — 例：`enum Message { Quit }`。
- タプルバリアント — 例：`enum Message { Write(String) }`。
- 構造体バリアント — 例：`enum Message { Move { x: i32, y: i32 } }`。

JavaScriptにはそのような強力な列挙はありませんが、各オブジェクトが特定のフィールドによって区別されるオブジェクトの共用体を使用して、TypeScriptでそれらをエミュレートできます。これをデータ列挙と呼びます。

Umiでは、`__kind`フィールドを使用してデータ列挙の異なるバリアントを区別します。さらに、すべてのバリアントがオブジェクトであるため、`fields`プロパティを使用してタプルバリアントの配列をラップします。以下に例を示します。

```ts
type Message = 
  | { __kind: 'Quit' } // 空のバリアント。
  | { __kind: 'Write'; fields: [string] } // タプルバリアント。
  | { __kind: 'Move'; x: number; y: number }; // 構造体バリアント。
```

`dataEnum`関数は、データ列挙のシリアライザーを作成できます。最初の引数として各バリアントの名前とシリアライザーが必要です。`struct`シリアライザーと同様に、これらはバリアントタプルの配列として定義され、最初の項目はバリアントの名前、2番目の項目はバリアントのシリアライザーです。空のバリアントはシリアライズするデータがないため、単に`unit`シリアライザーを使用します。以下は前の例のデータ列挙シリアライザーを作成する方法です。

```ts
const messageSerializer = dataEnum<Message>([
  // 空のバリアント。
  ['Quit', unit()],
  // タプルバリアント。
  ['Write', struct<{ fields: [string] }>([
    ['fields', tuple([string()])]
  ])],
  // 構造体バリアント。
  ['Move', struct<{ x: number; y: number }>([
    ['x', i32()],
    ['y', i32()]
  ])],
]);
```

このシリアライゼーションはRust列挙のborshシリアライゼーションと互換性があることに注意してください。まず、バリアントのインデックスを格納するためにリトルエンディアンで`u32`数値を使用します。選択されたバリアントが空のバリアントの場合、そこで停止します。そうでない場合、バリアントのシリアライザーを使用してそのデータをシリアライズします。

```ts
messageSerializer.serialize({ __kind: 'Quit' }); // -> 0x00000000
messageSerializer.serialize({ __kind: 'Write', fields: ['Hi'] }); // -> 0x01000000020000004869
messageSerializer.serialize({ __kind: 'Move', x: 5, y: 6 }); // -> 0x020000000500000006000000
```

`dataEnum`関数は、上記のデフォルトの`u32`の代わりに、バリアントインデックス用のカスタム数値シリアライザーを選択できる`prefix`オプションも受け取ります。以下は`u32`の代わりに`u8`を使用する例です。

```ts
const messageSerializer = dataEnum<Message>([...], {
  prefix: u8()
});

messageSerializer.serialize({ __kind: 'Quit' }); // -> 0x00
messageSerializer.serialize({ __kind: 'Write', fields: ['Hi'] }); // -> 0x01020000004869
messageSerializer.serialize({ __kind: 'Move', x: 5, y: 6 }); // -> 0x020500000006000000
```

データ列挙を扱う際は、Rustの列挙処理方法により近い感じになるように開発者エクスペリエンスを向上させるヘルパーメソッドを提供したい場合があることに注意してください。これは[Kinobi](kinobi)が生成されたJavaScriptクライアントにすぐに提供するものです。

```ts
// ヘルパーメソッドの例。
message('Quit'); // -> { __kind: 'Quit' }
message('Write', ['Hi']); // -> { __kind: 'Write', fields: ['Hi'] }
message('Move', { x: 5, y: 6 }); // -> { __kind: 'Move', x: 5, y: 6 }
isMessage('Quit', message('Quit')); // -> true
isMessage('Write', message('Quit')); // -> false
```

### ビット配列

`bitArray`シリアライザーは、各ブール値が単一ビットで表現されるようにブール値の配列をシリアライズおよびデシリアライズするために使用できます。シリアライザーのサイズ（バイト単位）と、ビットの順序を逆にするために使用できるオプションの`backward`フラグが必要です。

```ts
const booleans = [true, false, true, false, true, false, true, false];
bitArray(1).serialize(booleans); // -> Uint8Array.from([0b10101010]);
bitArray(1).deserialize(Uint8Array.from([0b10101010])); // -> [booleans, 1];
```