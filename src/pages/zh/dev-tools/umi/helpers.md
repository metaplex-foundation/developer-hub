---
title: Umi 辅助函数
metaTitle: Umi 辅助函数 | Umi
description: Umi 内置辅助函数概述
---
除了核心接口外，Umi 还提供了一组辅助函数，可用于更轻松地使用 Solana 程序。

## 金额

`Amount` 是一种特殊类型，允许我们定义大精度十进制数。它通过以最小可能单位（例如 lamports）表示数字，然后跟踪该单位的小数位数（例如 9）来实现。这允许更准确地表示数字，并避免由 IEEE 754 浮点数引起的 JavaScript 舍入错误。它还使用字符串标识符来确保在执行操作时我们处理的是相同单位的金额。以下是 `Amount` 泛型类型的定义：

```ts
type AmountIdentifier = 'SOL' | 'USD' | '%' | 'splToken' | string;
type AmountDecimals = number;
type Amount<
  I extends AmountIdentifier = AmountIdentifier,
  D extends AmountDecimals = AmountDecimals
> = {
  /** 以最小可能单位表示的金额，不包含小数。 */
  basisPoints: bigint;
  /** 金额的标识符。 */
  identifier: I;
  /** 金额的小数位数。 */
  decimals: D;
};
```

Umi 还为特定情况提供了此 `Amount` 类型的特定版本，如 SOL、微 SOL 和 USD。

```ts
type SolAmount = Amount<'SOL', 9>;
type MicroSolAmount = Amount<'uSOL', 15>;
type UsdAmount = Amount<'USD', 2>;
type PercentAmount<D extends AmountDecimals> = Amount<'%', D>;
```

为了让开发者更容易处理金额，Umi 提供了一组辅助函数，可用于创建、格式化和对金额执行操作。

您可能想[查看 API 参考的"Utils — Amounts"部分](https://umi.typedoc.metaplex.com/modules/umi.html)以了解有关所有这些辅助函数的更多信息，但以下是可以帮助创建新金额类型的函数快速列表。

```ts
// 从基点创建金额。
createAmount(123, 'USD', 2); // -> "USD 1.23"的金额

// 从十进制数创建金额。
createAmountFromDecimals(1.23, 'USD', 2); // -> "USD 1.23"的金额

// 创建 USD 金额的辅助函数。
usd(1.23) // -> "USD 1.23"的金额

// 处理 SOL 金额的辅助函数。
sol(1.23) // -> "1.23 SOL"的金额
lamports(1_230_000_000) // -> "1.23 SOL"的金额

// 创建百分比金额的辅助函数。
percentAmount(50.42); // -> "50.42%"的金额
percentAmount(50.42, 2); // -> "50.42%"的金额
percentAmount(50.42, 0); // -> "50%"的金额

// 创建代币金额的辅助函数。
tokenAmount(123); // -> "123 Tokens"的金额
tokenAmount(123, 'splToken.BONK'); // -> "123 BONK"的金额
tokenAmount(123.45, 'splToken.BONK', 2); // -> "123.45 BONK"的金额
```

## 选项

在 Rust 中，我们将可选值定义为 `Option<T>` 枚举，它可以是 `Some(T)` 或 `None`。这在 JavaScript 世界中通常表示为 `T | null`。这种方法的问题是它不适用于嵌套选项。例如，Rust 中的 `Option<Option<T>>` 在 JavaScript 中将变成 `T | null | null`，这等同于 `T | null`。这意味着我们无法在 JavaScript 中表示 `Some(None)` 值或任何其他嵌套选项。

为了解决这个问题，Umi 提供了一个 [`Option<T>` 联合类型](https://umi.typedoc.metaplex.com/types/umi.Option.html)，其工作方式与 Rust 的 `Option<T>` 类型非常相似。它定义如下：

```ts
type Option<T> = Some<T> | None;
type Some<T> = { __option: 'Some'; value: T };
type None = { __option: 'None' };
```

为了改善开发者体验，Umi 提供了 `some` 和 `none` 函数来创建选项。选项的类型 `T` 可以由 TypeScript 推断或显式提供。

```ts
// 创建带值的选项。
some('Hello World');
some<number | string>(123);

// 创建空选项。
none();
none<number | string>();
```

Umi 还提供了一组辅助函数来验证和操作选项。

```ts
// 检查选项是 `Some` 还是 `None`。
isSome(some('Hello World')); // -> true
isSome(none()); // -> false
isNone(some('Hello World')); // -> false
isNone(none()); // -> true

// 如果选项是 `Some` 则解包其值，否则返回 null。
// 支持为 `None` 自定义回退值。
unwrapOption(some('Hello World')) // -> 'Hello World'
unwrapOption(none()) // -> null
unwrapOption(some('Hello World'), () => 'Default'); // -> 'Hello World'
unwrapOption(none(), () => 'Default'); // -> 'Default'

// 与 `unwrapOption` 相同，但递归操作（不修改原始对象/数组）。
// 也支持为 `None` 自定义回退值。
unwrapOptionRecursively({
  a: 'hello',
  b: none<string>(),
  c: [{ c1: some(42) }, { c2: none<number>() }],
}) // -> { a: 'hello', b: null, c: [{ c1: 42 }, { c2: null }] }
```

## 日期时间

Umi 提供了一个 `DateTime` 类型，可用于使用以秒为单位的时间戳表示日期和时间。它简单地定义为 `bigint` 数字，并提供一组辅助函数来创建和格式化日期时间。

```ts
// 创建新的 DateTime。
dateTime(1680097346);
dateTime(new Date(Date.now()));
dateTime("2021-12-31T23:59:59.000Z");

// 为当前时间创建新的 DateTime。
now();

// 格式化 DateTime。
formatDateTime(now());
formatDateTime(now(), 'fr-FR', myFormatOptions);
```

## GpaBuilder

为了帮助准备 `getProgramAccounts` RPC 请求，Umi 提供了[一个不可变的 `GpaBuilder` 辅助类](https://umi.typedoc.metaplex.com/classes/umi.GpaBuilder.html)。它可用于添加过滤器、切片数据和获取原始账户，同时将它们映射到我们想要的任何内容。以下是一些示例。

```ts
// 获取程序的所有账户。
await gpaBuilder(umi, programId).get();

// 获取 500 字节长账户的前 32 字节。
await gpaBuilder(umi, programId)
  .slice(0, 32)
  .whereSize(500)
  .get();

// 获取在偏移量 32 处具有给定公钥的账户的公钥。
await gpaBuilder(umi, programId)
  .withoutData()
  .where(32, myPublicKey)
  .getPublicKey();

// 将账户数据的前 32 字节作为公钥获取。
await gpaBuilder(umi, programId)
  .slice(0, 32)
  .getDataAsPublicKey();

// 获取账户数据的第二个字节并乘以 2。
await gpaBuilder(umi, programId)
  .slice(1, 1)
  .getAndMap((n) => n * 2);
```

`GpaBuilder` 还可以通过 `deserializeUsing` 方法告知如何将原始账户反序列化为已反序列化的账户。一旦提供了反序列化回调，就可以使用 `getDeserialized` 方法获取已反序列化的账户。

```ts
const metadataGpaBuilder = gpaBuilder(umi, programId)
  .deserializeUsing<Metadata>((account) => deserializeMetadata(umi, account));

const accounts: Metadata[] = await metadataGpaBuilder.getDeserialized();
```

此外，我们可以将一组带有偏移量的字段传递给 `GpaBuilder`，以改善围绕过滤和切片数据的开发者体验。为此，我们可以使用 `registerFields` 方法。例如，假设我们知道从字节 16 开始，接下来的 32 字节通过固定大小字符串表示 `name`，之后的 4 字节表示 `age`。以下是我们如何注册这些字段。

```ts
import { gpaBuilder } from '@metaplex-foundation/umi';
import { string, u32 } from '@metaplex-foundation/umi/serializers';

const myGpaBuilderWithFields = gpaBuilder(umi, programId)
  .registerFields<{ name: string; age: number; }>({
    name: [16, string({ size: 32 })],
    age: [48, u32()],
  })
```

一旦字段被注册，我们可以使用 `whereField` 和 `sliceField` 方法使用字段来过滤和切片数据。它不仅知道使用哪个偏移量，还知道如何序列化其值。

```ts
// 获取 age 为 42 的账户的 name。
await myGpaBuilderWithFields
  .whereField('age', 42)
  .sliceField('name')
  .get();
```
