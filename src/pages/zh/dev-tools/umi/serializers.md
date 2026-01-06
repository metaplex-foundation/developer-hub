---
title: 序列化器
metaTitle: 序列化器 | Umi
description: Metaplex Umi 中的序列化器和反序列化器
---
无论我们是向区块链发送数据还是从中读取数据，序列化都是过程中的重要组成部分。序列化逻辑可能因程序而异，虽然 Borsh 序列化是 Solana 程序最流行的选择，但它并不是唯一的选择。

Umi 通过提供灵活且可扩展的序列化框架来帮助解决这个问题，该框架允许您构建自己的序列化器。具体来说，它包括：
- 一个泛型 `Serializer<From, To = From>` 类型，表示可以将 `From` 序列化为 `Uint8Array` 并将 `Uint8Array` 反序列化为 `To`（默认为 `From`）的对象。
- 一组序列化器辅助函数，用于映射和转换序列化器为新的序列化器。
- 最后但同样重要的是，一组内置序列化器，可用于序列化常见类型，包括字符串编码器、数字序列化器、数据结构等。这些基元可用于构建更复杂的序列化器。

让我们看看这一切是如何工作的。

## 序列化器定义

`Serializer` 类型是 Umi 序列化框架的核心部分。通过类型 `T` 的 `Serializer` 实例，您应该拥有序列化和反序列化 `T` 实例所需的一切。例如，`Serializer<{ name: string, age: number }>` 实例可用于序列化和反序列化 `{ name: string, age: number }` 的实例。

在某些情况下，我们要序列化的数据可能比反序列化时获得的数据更宽松。因此，`Serializer<From, To>` 类型允许第二个类型参数 `To`，它扩展 `From` 并默认为 `From`。使用我们之前的示例，假设 `age` 属性是可选的，未提供时将默认为 `42`。在这种情况下，我们可以定义一个 `Serializer<{ name: string, age?: number }, { name: string, age: number }>` 实例，它将 `{ name: string, age?: number }` 序列化为 `Uint8Array`，但将 `Uint8Array` 反序列化为 `{ name: string, age: number }`。

以下是 `Serializer` 类型的定义。

```ts
type Serializer<From, To extends From = From> = {
  /** 序列化器的描述。 */
  description: string;
  /** 序列化值的固定大小（以字节为单位），如果可变则为 `null`。 */
  fixedSize: number | null;
  /** 序列化值可以占用的最大大小（以字节为单位），如果可变则为 `null`。 */
  maxSize: number | null;
  /** 将值序列化为字节的函数。 */
  serialize: (value: From) => Uint8Array;
  /**
   * 从字节反序列化值的函数。
   * 它返回反序列化的值和读取的字节数。
   */
  deserialize: (buffer: Uint8Array, offset?: number) => [To, number];
};
```

除了不令人意外的 `serialize` 和 `deserialize` 函数外，`Serializer` 类型还包括 `description`、`fixedSize` 和 `maxSize`。
- `description` 是一个快速的人类可读字符串，描述序列化器。
- `fixedSize` 属性在且仅在我们处理固定大小序列化器时给出序列化值的字节大小。例如，`u32` 序列化器的 `fixedSize` 始终为 `4` 字节。
- `maxSize` 属性在处理具有最大大小边界的可变大小序列化器时很有帮助。例如，borsh `Option<PublicKey>` 序列化器的大小可以是 `1` 或 `33`，因此其 `maxSize` 为 `33` 字节。

## 使用序列化器

您可以从 Umi 框架捆绑的 `@metaplex-foundation/umi/serializers` 子模块导入 `Serializer` 类型和所有与序列化器相关的内容。如果您想在没有框架其余部分的情况下使用它，也可以将其作为独立的 `@metaplex-foundation/umi-serializers` 库导入。

```ts
// 与 Umi 捆绑。
import { Serializer } from '@metaplex-foundation/umi/serializers';

// 作为独立库。
import { Serializer } from '@metaplex-foundation/umi-serializers';
```

导入后，您可以使用 Umi 提供的所有内置序列化器和辅助函数。我们将在以下部分中深入了解它们，但现在，让我们看一个快速示例来了解它们是如何工作的。假设我们有一个 `MyObject` 类型，包含各种属性，包括 `string` 类型的 `name` 属性、`PublicKey` 类型的 `publicKey` 属性和 `number[]` 类型的 `numbers` 属性，其中每个数字都是 `u32` 整数。以下是我们如何为它创建序列化器。

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

每个提供的序列化器都定义了自己的参数——例如，`array` 函数需要项序列化器作为第一个参数——但大多数都有一个可选的 `options` 参数在末尾，可用于调整序列化器的行为。`options` 参数中的属性可能因序列化器而异，但它们都共享一个共同属性：`description`。这可用于提供创建的序列化器的特定描述。请注意，如果省略，将为您创建一个足够好的描述。

```ts
import { string } from '@metaplex-foundation/umi/serializers';

string().description; // -> 'string(utf8; u32(le))'。
string({ description: 'My custom string description' });
```

## 序列化器辅助函数

现在我们知道如何导入和使用序列化器了，让我们看看 Umi 提供的一些辅助方法来转换它们。

### 映射序列化器

`mapSerializer` 可用于通过提供两个函数将 `Serializer<A>` 转换为 `Serializer<B>`，这两个函数将 `B` 转换为 `A` 和将 `A` 转换回 `B`。

例如，假设我们想通过存储字符串的长度将字符串序列化器转换为数字序列化器。以下是我们如何使用 `mapSerializer` 函数来实现。

```ts
const serializerA: Serializer<string> = ...;
const serializerB: Serializer<number> = mapSerializer(
  serializerA,
  (value: number): string => 'x'.repeat(value), // 创建给定长度的模拟字符串。
  (value: string): number => value.length, // 获取字符串的长度。
);
```

`mapSerializer` 还可用于转换具有不同 `From` 和 `To` 类型的序列化器。以下是与上面类似的示例，但具有不同的 `To` 类型。

```ts
const serializerA: Serializer<string | null, string> = ...;
const serializerB: Serializer<number | null, number> = mapSerializer(
  serializerA,
  (value: number | null): string | null => value === null ? null : 'x'.repeat(value),
  (value: string): number => value.length,
);
```

请注意，如果我们只想转换序列化器的 `From` 类型而不改变其 `To` 类型，我们可以只使用一个函数来使用 `mapSerializer` 函数。以下是我们如何放宽 `Serializer<{ name: string, age: number }>` 实例以使 `age` 属性仅在序列化时可选。

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

映射序列化器是一种非常强大的技术，可以帮助构建复杂的用例，同时仍然依赖内置序列化器。

### 固定序列化器

`fixSerializer` 函数是另一个辅助函数，可以通过请求固定的字节大小将任何可变大小序列化器转换为固定大小序列化器。它通过在必要时填充或截断 `Uint8Array` 缓冲区到请求的大小来实现。返回的序列化器将具有与原始序列化器相同的 `From` 和 `To` 类型。

```ts
const myFixedSerializer = fixSerializer(myVariableSerializer, 42);
```

### 反转序列化器

`reverseSerializer` 函数可用于反转固定大小序列化器的字节。此函数的应用不太频繁，但在处理字节序时可能很有用。同样，返回的序列化器将具有与原始序列化器相同的 `From` 和 `To` 类型。

```ts
const myReversedSerializer = reverseSerializer(mySerializer);
```

### 字节辅助函数

值得注意的是，还提供了一些低级辅助方法来操作字节。这些不返回序列化器，但在构建自定义序列化器时很有用。

```ts
// 将多个 Uint8Array 缓冲区合并为一个。
mergeBytes([new Uint8Array([1, 2]), new Uint8Array([3, 4])]); // -> Uint8Array([1, 2, 3, 4])

// 将 Uint8Array 缓冲区填充到给定大小。
padBytes(new Uint8Array([1, 2]), 4); // -> Uint8Array([1, 2, 0, 0])
padBytes(new Uint8Array([1, 2, 3, 4]), 2); // -> Uint8Array([1, 2, 3, 4])

// 将 Uint8Array 缓冲区填充和截断到给定大小。
fixBytes(new Uint8Array([1, 2]), 4); // -> Uint8Array([1, 2, 0, 0])
fixBytes(new Uint8Array([1, 2, 3, 4]), 2); // -> Uint8Array([1, 2])
```

## 内置序列化器

现在让我们看看 Umi 附带的各种序列化器。这些基元中的每一个都可用于构建更复杂的序列化器，正如我们在上一节中看到的那样。

### 数字

Umi 附带 12 个数字序列化器：5 个无符号整数、5 个有符号整数和 2 个浮点数。这些可用于序列化和反序列化不同大小的数字。当数字大小大于 32 位时，返回的序列化器是 `Serializer<number | bigint, bigint>` 而不是 `Serializer<number>`，因为 JavaScript 的原生 `number` 类型不支持大于 `2^53 - 1` 的数字。

```ts
// 无符号整数。
u8(); // -> Serializer<number>
u16(); // -> Serializer<number>
u32(); // -> Serializer<number>
u64(); // -> Serializer<number | bigint, bigint>
u128(); // -> Serializer<number | bigint, bigint>

// 有符号整数。
i8(); // -> Serializer<number>
i16(); // -> Serializer<number>
i32(); // -> Serializer<number>
i64(); // -> Serializer<number | bigint, bigint>
i128(); // -> Serializer<number | bigint, bigint>

// 浮点数。
f32(); // -> Serializer<number>
f64(); // -> Serializer<number>
```

除了仅使用一个字节的 `u8` 和 `i8` 序列化器外，所有其他数字序列化器默认以小端表示，可以配置为使用不同的字节序。这可以通过将 `endian` 选项传递给序列化器来完成。

```ts
u64(); // 小端。
u64({ endian: Endian.Little }); // 小端。
u64({ endian: Endian.Big }); // 大端。
```

请注意，由于数字序列化器经常在其他序列化器中重用，Umi 定义了以下 `NumberSerializer` 类型以包含 `number` 和 `bigint` 类型。

```ts
type NumberSerializer =
  | Serializer<number>
  | Serializer<number | bigint, bigint>;
```

### 布尔值

`bool` 序列化器可用于创建 `Serializer<boolean>`。默认情况下，它使用 `u8` 数字来存储布尔值，但可以通过将 `NumberSerializer` 传递给 `size` 选项来更改。

```ts
bool(); // -> 使用 u8。
bool({ size: u32() }); // -> 使用 u32。
bool({ size: u32({ endian: Endian.Big }) }); // -> 使用大端 u32。
```

### 字符串编码

Umi 附带以下字符串序列化器，可用于以不同格式序列化和反序列化字符串：`utf8`、`base10`、`base16`、`base58` 和 `base64`。

```ts
utf8.serialize('Hello World!');
base10.serialize('42');
base16.serialize('ff002a');
base58.serialize('LorisCg1FTs89a32VSrFskYDgiRbNQzct1WxyZb7nuA');
base64.serialize('SGVsbG8gV29ybGQhCg==');
```

它还附带一个 `baseX` 函数，可以为任何给定的字母表创建新的字符串序列化器。例如，这是 `base58` 序列化器的实现方式。

```ts
const base58: Serializer<string> = baseX(
  '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
);
```

### 字符串

`string` 序列化器返回一个 `Serializer<string>`，可用于使用各种编码和大小策略序列化字符串。它包含以下选项：
- `encoding`：一个 `Serializer<string>`，表示序列化和反序列化字符串时使用的编码。它默认为内置的 `utf8` 序列化器。您可能想知道，为什么我们需要传递一个 `Serializer<string>` 来创建一个 `Serializer<string>`？这是因为 `encoding` 序列化器的目的只是将一些文本转换为字节数组或从字节数组转换，而不用担心其他任何事情，如存储字符串的大小。这允许我们插入任何我们想要的编码，同时能够利用此 `string` 函数提供的所有其他选项。
- `size`：为了知道字符串在给定缓冲区中延伸多长，我们需要知道其字节大小。为此，可以使用以下大小策略之一：
  - `NumberSerializer`：当传递数字序列化器时，它将用作前缀来存储和恢复字符串的大小。默认情况下，大小使用小端的 `u32` 前缀存储——这是 borsh 序列化的默认行为。
  - `number`：字节大小也可以显式提供为数字。这将创建一个固定大小的序列化器，它不使用任何大小前缀，并且始终使用相同的字节数来存储字符串。
  - `"variable"`：当字符串 `"variable"` 作为大小传递时，它将创建一个可变大小序列化器，在反序列化时简单地使用缓冲区中的所有剩余字节。序列化时，它将简单地返回 `encoding` 序列化器的结果，而不存储序列化字符串的大小。

```ts
// 使用不同编码的序列化值供参考。
utf8.serialize('Hi'); // -> 0x4869
base58.serialize('Hi'); // -> 0x03c9

// 默认行为：utf8 编码和 u32（小端）大小。
string().serialize('Hi'); // -> 0x020000004869

// 自定义编码：base58。
string({ encoding: base58 }).serialize('Hi'); // -> 0x0200000003c9

// 自定义大小：u16（大端）大小。
string({ size: u16({ endian: Endian.Big }) }).serialize('Hi'); // -> 0x00024869

// 自定义大小：5 字节。
string({ size: 5 }).serialize('Hi'); // -> 0x4869000000

// 自定义大小：可变。
string({ size: 'variable' }).serialize('Hi'); // -> 0x4869
```

### 字节

`bytes` 序列化器返回一个 `Serializer<Uint8Array>`，它将 `Uint8Array` 反序列化为... `Uint8Array`。虽然这看起来有点无用，但在组合到其他序列化器中时可能很有用。例如，您可以在 `struct` 序列化器中使用它来表示特定字段应保持未序列化状态。

与 `string` 函数非常相似，`bytes` 函数包含一个 `size` 选项，用于配置如何存储和恢复字节数组的大小。支持与 `string` 函数相同的大小策略，只是这里的默认大小是 `"variable"` 策略。总结：
- `NumberSerializer`：使用前缀数字序列化器来存储和恢复字节数组的大小。
- `number`：使用固定大小来存储字节数组。
- `"variable"`：序列化时按原样传递缓冲区，反序列化时返回缓冲区的剩余部分。默认行为。

```ts
// 默认行为：可变大小。
bytes().serialize(new Uint8Array([42])); // -> 0x2a

// 自定义大小：u16（小端）大小。
bytes({ size: u16() }).serialize(new Uint8Array([42])); // -> 0x01002a

// 自定义大小：5 字节。
bytes({ size: 5 }).serialize(new Uint8Array([42])); // -> 0x2a00000000
```

### 公钥

`publicKey` 序列化器返回一个 `Serializer<PublicKey>`，可用于序列化和反序列化公钥。以下是序列化和反序列化同一公钥的示例。请注意，`publicKey` 函数也由主 `@metaplex-foundation/umi` 包导出，允许我们从各种输入创建公钥。因此，您可能需要为导入起别名以避免冲突。

```ts
import { publicKey } from '@metaplex-foundation/umi';
import { publicKey as publicKeySerializer } from '@metaplex-foundation/umi/serializers';

const myPublicKey = publicKey('...');
const buffer = publicKeySerializer().serialize(myPublicKey);
const [myDeserializedPublicKey, offset] = publicKeySerializer().deserialize(buffer);
myPublicKey === myDeserializedPublicKey; // -> true
```

### 单位

`unit` 序列化器返回一个 `Serializer<void>`，它将 `undefined` 序列化为空的 `Uint8Array`，并在反序列化时返回 `undefined` 而不消耗任何字节。这是一个更低级的序列化器，可以被其他序列化器在内部使用。例如，这就是 `dataEnum` 序列化器在内部描述空变体的方式。

```ts
unit().serialize(undefined); // -> new Uint8Array([])
unit().deserialize(new Uint8Array([42])); // -> [undefined, 0]
```

### 数组、集合和映射

Umi 提供三个函数来序列化列表和映射：
- `array`：序列化项目数组。它接受一个 `Serializer<T>` 作为参数并返回一个 `Serializer<T[]>`。
- `set`：序列化唯一项目的集合。它接受一个 `Serializer<T>` 作为参数并返回一个 `Serializer<Set<T>>`。
- `map`：序列化键值对的映射。它接受一个 `Serializer<K>` 用于键和一个 `Serializer<V>` 用于值作为参数，并返回一个 `Serializer<Map<K, V>>`。

所有三个函数都接受相同的 `size` 选项，用于配置如何存储和恢复数组、集合或映射的长度。这与 `string` 和 `bytes` 序列化器的工作方式非常相似。以下是支持的策略：
- `NumberSerializer`：使用数字序列化器在内容前加上其大小的前缀。默认情况下，大小使用小端的 `u32` 前缀存储。
- `number`：返回具有固定项目数的数组、集合或映射序列化器。
- `"remainder"`：返回通过将缓冲区的其余部分除以其项的固定大小来推断项目数的数组、集合或映射序列化器。例如，如果缓冲区剩余 64 字节，数组的每个项目是 16 字节长，则数组将被反序列化为 4 个项目。请注意，此选项仅适用于固定大小的项目。对于映射，键序列化器和值序列化器都必须具有固定大小。

```ts
// 数组。
array(u8()) // 具有 u32 大小前缀的 u8 项目数组。
array(u8(), { size: 5 }) // 5 个 u8 项目的数组。
array(u8(), { size: 'remainder' }) // 可变大小的 u8 项目数组。

// 集合。
set(u8()) // 具有 u32 大小前缀的 u8 项目集合。
set(u8(), { size: 5 }) // 5 个 u8 项目的集合。
set(u8(), { size: 'remainder' }) // 可变大小的 u8 项目集合。

// 映射。
map(u8(), u8()) // 具有 u32 大小前缀的 (u8, u8) 条目映射。
map(u8(), u8(), { size: 5 }) // 5 个 (u8, u8) 条目的映射。
map(u8(), u8(), { size: 'remainder' }) // 可变大小的 (u8, u8) 条目映射。
```

### 选项和可空值

Umi 提供两个函数来序列化可选值：
- `nullable`：序列化可以为 null 的值。它接受一个 `Serializer<T>` 作为参数并返回一个 `Serializer<Nullable<T>>`，其中 `Nullable<T>` 是 `T | null` 的类型别名。
- `option`：序列化 `Option` 实例（[参见文档](helpers#选项)）。它接受一个 `Serializer<T>` 作为参数并返回一个 `Serializer<OptionOrNullable<T>, Option<T>>`。这意味着反序列化的值将始终包装在 `Option` 类型中，但序列化的值可以是 `Option<T>` 或 `Nullable<T>`。

两个函数都通过在可选值前加上一个布尔值来序列化它们，该布尔值指示值是否存在。如果前缀布尔值为 `false`，则值为 `null`（对于可空值）或 `None`（对于选项），我们可以跳过反序列化实际值。否则，使用提供的序列化器反序列化值并返回。

它们都提供相同的选项来配置创建的序列化器的行为：
- `prefix`：用于序列化和反序列化布尔前缀的 `NumberSerializer`。默认情况下，它使用小端的 `u8` 前缀。
- `fixed`：当此值为 `true` 时，它通过在值为空时更改序列化逻辑来返回固定大小的序列化器。在这种情况下，序列化的值将用零填充，以便空值和填充值使用相同的字节数进行序列化。请注意，这仅在项序列化器是固定大小时有效。

```ts
// 选项。
option(publicKey()) // 带有 u8 前缀的 Option<PublicKey>。
option(publicKey(), { prefix: u16() }) // 带有 u16 前缀的 Option<PublicKey>。
option(publicKey(), { fixed: true }) // 固定大小的 Option<PublicKey>。

// 可空值。
nullable(publicKey()) // 带有 u8 前缀的 Nullable<PublicKey>。
nullable(publicKey(), { prefix: u16() }) // 带有 u16 前缀的 Nullable<PublicKey>。
nullable(publicKey(), { fixed: true }) // 固定大小的 Nullable<PublicKey>。
```

### 结构体

`struct` 序列化器允许我们序列化和反序列化泛型类型 `T` 的 JavaScript 对象。

它要求每个字段的名称和序列化器作为数组在第一个参数中传递。此 `fields` 数组的结构是每个字段都是一个元组，其中第一个项是字段的名称，第二个项是字段的序列化器。字段的顺序很重要，因为它决定了字段序列化和反序列化的顺序。以下是一个示例。

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

`struct` 函数还接受第二个类型参数 `U`，以防某些字段具有不同的 `From` 和 `To` 类型参数。这允许我们创建 `Serializer<T, U>` 类型的序列化器。

例如，这是我们如何创建一个为 `Person` 类型的 `age` 字段提供默认值的结构体序列化器。

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

### 元组

Umi 提供了一个 `tuple` 序列化器，可用于序列化和反序列化元组。虽然元组在 JavaScript 中不是原生的，但它们可以在 TypeScript 中使用数组表示，使得每个项目都有自己定义的类型。例如，Rust 中的 `(String, u8)` 元组可以在 TypeScript 中表示为 `[string, number]`。

`tuple` 函数接受一个序列化器数组作为其第一个参数，该数组应按相同顺序匹配元组的项。以下是一些示例。

```ts
tuple([bool()]); // Serializer<[bool]>
tuple([string(), u8()]); // Serializer<[string, number]>
tuple([publicKey(), u64()]); // Serializer<[PublicKey, number | bigint], [PublicKey, bigint]>
```

### 标量枚举

`scalarEnum` 函数可用于通过将变体的值（或索引）存储为 `u8` 数字来为标量枚举创建序列化器。

它需要枚举构造函数作为其第一个参数。例如，如果枚举定义为 `enum Direction { Left }`，则构造函数 `Direction` 应作为第一个参数传递。创建的序列化器将接受枚举的任何变体作为输入，以及其值或名称。以下是一个示例。

```ts
enum Direction { Left, Right, Up, Down };

const directionSerializer = scalarEnum(Direction); // Serializer<Direction>
directionSerializer.serialize(Direction.Left); // -> 0x00
directionSerializer.serialize(Direction.Right); // -> 0x01
directionSerializer.serialize('Left'); // -> 0x00
directionSerializer.serialize('Right'); // -> 0x01
directionSerializer.serialize(0); // -> 0x00
directionSerializer.serialize(1); // -> 0x01

// 反序列化的值始终是枚举的实例。
directionSerializer.deserialize(new Uint8Array([1])); // -> [Direction.Right, 1]
```

虽然序列化的值默认使用 `u8` 数字序列化器存储，但可以提供自定义的 `NumberSerializer` 作为 `size` 选项来更改该行为。

```ts
scalarEnum(Direction, { size: u32() }).serialize(Direction.Right); // -> 0x01000000
```

请注意，如果您将 `scalarEnum` 函数与字符串枚举一起使用——例如 `enum Direction { Left = 'LEFT' }`——它将忽略文本值，只使用变体的索引。

```ts
enum Direction { Left = 'LEFT', Right = 'RIGHT', Up = 'UP', Down = 'DOWN' };

const directionSerializer = scalarEnum(Direction); // Serializer<Direction>
directionSerializer.serialize(Direction.Left); // -> 0x00
directionSerializer.serialize('Left'); // -> 0x00

// 请注意，枚举字符串值可以用作输入。
directionSerializer.serialize('LEFT'); // -> 0x00
```

### 数据枚举

在 Rust 中，枚举是强大的数据类型，其变体可以是以下之一：
- 空变体——例如 `enum Message { Quit }`。
- 元组变体——例如 `enum Message { Write(String) }`。
- 结构体变体——例如 `enum Message { Move { x: i32, y: i32 } }`。

虽然我们在 JavaScript 中没有如此强大的枚举，但我们可以在 TypeScript 中使用对象联合来模拟它们，使得每个对象都通过特定字段区分。我们称之为数据枚举。

在 Umi 中，我们使用 `__kind` 字段来区分数据枚举的不同变体。此外，由于所有变体都是对象，我们使用 `fields` 属性来包装元组变体的数组。以下是一个示例。

```ts
type Message =
  | { __kind: 'Quit' } // 空变体。
  | { __kind: 'Write'; fields: [string] } // 元组变体。
  | { __kind: 'Move'; x: number; y: number }; // 结构体变体。
```

`dataEnum` 函数允许我们为数据枚举创建序列化器。它要求每个变体的名称和序列化器作为第一个参数。与 `struct` 序列化器类似，这些被定义为变体元组的数组，其中第一个项是变体的名称，第二个项是变体的序列化器。由于空变体没有要序列化的数据，它们只需使用 `unit` 序列化器。以下是我们如何为前面的示例创建数据枚举序列化器。

```ts
const messageSerializer = dataEnum<Message>([
  // 空变体。
  ['Quit', unit()],
  // 元组变体。
  ['Write', struct<{ fields: [string] }>([
    ['fields', tuple([string()])]
  ])],
  // 结构体变体。
  ['Move', struct<{ x: number; y: number }>([
    ['x', i32()],
    ['y', i32()]
  ])],
]);
```

请注意，此序列化与 Rust 枚举的 borsh 序列化兼容。首先，它使用小端的 `u32` 数字来存储变体的索引。如果选择的变体是空变体，它就停在那里。否则，它使用变体的序列化器来序列化其数据。

```ts
messageSerializer.serialize({ __kind: 'Quit' }); // -> 0x00000000
messageSerializer.serialize({ __kind: 'Write', fields: ['Hi'] }); // -> 0x01000000020000004869
messageSerializer.serialize({ __kind: 'Move', x: 5, y: 6 }); // -> 0x020000000500000006000000
```

`dataEnum` 函数还接受一个 `prefix` 选项，允许我们为变体索引选择自定义数字序列化器——而不是上面提到的默认 `u32`。以下是使用 `u8` 而不是 `u32` 的示例。

```ts
const messageSerializer = dataEnum<Message>([...], {
  prefix: u8()
});

messageSerializer.serialize({ __kind: 'Quit' }); // -> 0x00
messageSerializer.serialize({ __kind: 'Write', fields: ['Hi'] }); // -> 0x01020000004869
messageSerializer.serialize({ __kind: 'Move', x: 5, y: 6 }); // -> 0x020500000006000000
```

请注意，在处理数据枚举时，您可能希望提供一些辅助方法来改善开发者体验，使其感觉更接近 Rust 处理枚举的方式。这是 [Kinobi](kinobi) 为生成的 JavaScript 客户端开箱即用提供的功能。

```ts
// 辅助方法示例。
message('Quit'); // -> { __kind: 'Quit' }
message('Write', ['Hi']); // -> { __kind: 'Write', fields: ['Hi'] }
message('Move', { x: 5, y: 6 }); // -> { __kind: 'Move', x: 5, y: 6 }
isMessage('Quit', message('Quit')); // -> true
isMessage('Write', message('Quit')); // -> false
```

### 位数组

`bitArray` 序列化器可用于序列化和反序列化布尔数组，使得每个布尔值由单个位表示。它需要序列化器的 `size`（以字节为单位）和一个可选的 `backward` 标志，可用于反转位的顺序。

```ts
const booleans = [true, false, true, false, true, false, true, false];
bitArray(1).serialize(booleans); // -> Uint8Array.from([0b10101010]);
bitArray(1).deserialize(Uint8Array.from([0b10101010])); // -> [booleans, 1];
```
