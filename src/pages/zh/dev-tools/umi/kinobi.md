---
title: 通过 Kinobi 生成 Umi 客户端
metaTitle: 通过 Kinobi 生成 Umi 客户端 | Umi
description: 通过 Kinobi 生成 Umi 客户端
---
Umi 框架为在 JavaScript 中构建 Solana 客户端提供了基础。当程序提供与 Umi 兼容的库时，它变得更加强大，因为它允许最终用户只需将他们的 Umi 实例插入到这些库提供的任何辅助函数中。为了简化和自动化创建与 Umi 兼容库的过程，Umi 提供了一个强大的代码生成器，称为 Kinobi。

[Kinobi](https://github.com/metaplex-foundation/kinobi) 引入了 Solana 客户端的语言无关表示，可以由一个或多个程序组成。它通过使用可被 `Visitor` 类访问的节点树来实现这一点。访问者可用于更新树的任何方面，允许开发者根据需要定制客户端。一旦树符合开发者的需求，就可以使用特定语言的访问者来为目标语言或框架生成代码。

好消息是 Kinobi 附带了一个 `RenderJavaScriptVisitor`，可以为我们生成与 Umi 兼容的库。

以下是如何使用 Kinobi 和 Umi 为 Solana 程序创建 JavaScript 客户端的快速概述。请注意，[您可能对这个逐步讲解此图表的帖子感兴趣](https://twitter.com/lorismatic/status/1637890024992833536)。

![](https://pbs.twimg.com/media/Frr0StQaIAAc16a?format=jpg&name=4096x4096)

## Kinobi 入门

您可能想查看 [Kinobi 文档](https://github.com/metaplex-foundation/kinobi)以了解更多详细信息，但以下是如何开始使用 Kinobi 的快速概述。

首先，您需要安装 Kinobi：

```sh
npm install @metaplex-foundation/kinobi
```

然后，您需要创建一个 JavaScript 文件——例如 `kinobi.js`——来创建和渲染 Kinobi 树。这是通过创建一个 `Kinobi` 实例并向其传递 IDL 文件路径数组来完成的。您可能想查看 [Shank JS 库](https://github.com/metaplex-foundation/shank-js)来生成您的 IDL 文件。然后，您可以使用访问者来更新树，并通过 `RenderJavaScriptVisitor` 将其渲染为与 Umi 兼容的库。以下是一个示例。

```ts
import { createFromIdls, RenderJavaScriptVisitor } from "@metaplex-foundation/kinobi";

// 实例化 Kinobi。
const kinobi = createFromIdls([
  path.join(__dirname, "idls", "my_idl.json"),
  path.join(__dirname, "idls", "my_other_idl.json"),
]);

// 使用访问者更新 Kinobi 树...

// 渲染 JavaScript。
const jsDir = path.join(__dirname, "clients", "js", "src", "generated");
kinobi.accept(new RenderJavaScriptVisitor(jsDir));
```

现在，您只需要像这样使用 Node.js 运行此文件。

```sh
node ./kinobi.js
```

首次生成 JS 客户端时，请确保根据需要准备好库。您至少需要创建其 `package.json` 文件、安装其依赖项，并提供一个导入生成文件夹的顶级 `index.ts` 文件。

## Kinobi 生成客户端的功能

现在我们知道如何通过 Kinobi 生成与 Umi 兼容的库，让我们看看它们能做什么。

### 类型和序列化器

Kinobi 生成的库为程序上定义的每个类型、账户和指令提供序列化器。它还导出创建序列化器所需的两个 TypeScript 类型——即其 `From` 和 `To` 类型参数。它会将 `From` 类型后缀加上 `Args` 以区分两者。例如，如果您的 IDL 中定义了一个 `MyType` 类型，您可以使用以下代码来序列化和反序列化它。

```ts
const serializer: Serializer<MyTypeArgs, MyType> = getMyTypeSerializer();
serializer.serialize(myType);
serializer.deserialize(myBuffer);
```

对于指令，类型名称后缀为 `InstructionData`，对于账户，后缀为 `AccountData`。这允许无后缀的账户名称用作 `Account<T>` 类型。例如，如果您的程序上有一个 `Token` 账户和一个 `Transfer` 指令，您将获得以下类型和序列化器。

```ts
// 对于账户。
type Token = Account<TokenAccountData>;
type TokenAccountData = {...};
type TokenAccountDataArgs = {...};
const tokenDataSerializer = getTokenAccountDataSerializer();

// 对于指令。
type TransferInstructionData = {...};
type TransferInstructionDataArgs = {...};
const transferDataSerializer = getTransferInstructionDataSerializer();
```

### 数据枚举辅助函数

如果生成的类型被识别为[数据枚举](serializers#数据枚举)，将创建额外的辅助方法来帮助改善开发者体验。例如，假设您有以下生成的数据枚举类型。

```ts
type Message =
  | { __kind: 'Quit' } // 空变体。
  | { __kind: 'Write'; fields: [string] } // 元组变体。
  | { __kind: 'Move'; x: number; y: number }; // 结构体变体。
```

然后，除了生成类型和 `getMessageSerializer` 函数外，它还会生成一个 `message` 和 `isMessage` 函数，可分别用于创建新的数据枚举和检查其变体的类型。

```ts
message('Quit'); // -> { __kind: 'Quit' }
message('Write', ['Hi']); // -> { __kind: 'Write', fields: ['Hi'] }
message('Move', { x: 5, y: 6 }); // -> { __kind: 'Move', x: 5, y: 6 }
isMessage('Quit', message('Quit')); // -> true
isMessage('Write', message('Quit')); // -> false
```

### 账户辅助函数

Kinobi 还将为账户提供额外的辅助方法，为我们提供一种获取和反序列化它们的简单方法。假设账户名称是 `Metadata`，以下是可用的额外辅助方法。

```ts
// 将原始账户反序列化为已解析的账户。
deserializeMetadata(rawAccount); // -> Metadata

// 通过公钥获取并反序列化账户。
await fetchMetadata(umi, publicKey); // -> Metadata 或失败
await safeFetchMetadata(umi, publicKey); // -> Metadata 或 null

// 通过公钥获取所有已反序列化的账户。
await fetchAllMetadata(umi, publicKeys); // -> Metadata[]，如果任何账户缺失则失败
await safeFetchAllMetadata(umi, publicKeys) // -> Metadata[]，过滤掉缺失的账户

// 为账户创建 getProgramAccount 构建器。
await getMetadataGpaBuilder()
  .whereField('updateAuthority', updateAuthority)
  .selectField('mint')
  .getDataAsPublicKeys() // -> PublicKey[]

// 获取账户数据的字节大小（如果它有固定大小）。
getMetadataSize() // -> number

// 从账户的种子查找 PDA 地址。
findMetadataPda(umi, seeds) // -> Pda
```

您可能想查看 [`GpaBuilder` 的文档](helpers#gpabuilder)以了解更多它们能做什么。

### 交易构建器

每个生成的指令还有自己的函数，可用于创建包含该指令的交易构建器。例如，如果您有一个 `Transfer` 指令，它会生成一个返回 `TransactionBuilder` 的 `transfer` 函数。

```ts
await transfer(umi, { from, to, amount }).sendAndConfirm();
```

因为交易构建器可以组合在一起，这允许我们像这样轻松创建包含多个指令的交易。

```ts
await transfer(umi, { from, to: destinationA, amount })
  .add(transfer(umi, { from, to: destinationB, amount }))
  .add(transfer(umi, { from, to: destinationC, amount }))
  .sendAndConfirm();
```

### 错误和程序

Kinobi 还会为客户端中定义的每个程序生成一个返回 `Program` 类型的函数，以及一些访问它们的辅助函数。例如，假设您的客户端定义了一个 `MplTokenMetadata` 程序，则会生成以下辅助函数。

```ts
// 程序的公钥作为常量变量。
MPL_TOKEN_METADATA_PROGRAM_ID; // -> PublicKey

// 创建可以注册到程序仓库的程序对象。
createMplTokenMetadataProgram(); // -> Program

// 从程序仓库获取程序对象。
getMplTokenMetadataProgram(umi); // -> Program

// 从程序仓库获取程序的公钥。
getMplTokenMetadataProgramId(umi); // -> PublicKey
```

请注意，Kinobi 不会为您的客户端自动生成 Umi 插件，允许您根据需要进行自定义。这意味着您需要自己创建插件，并至少注册客户端定义的程序。以下是使用 `MplTokenMetadata` 程序的示例。

```ts
export const mplTokenMetadata = (): UmiPlugin => ({
  install(umi) {
    umi.programs.add(createMplTokenMetadataProgram(), false);
  },
});
```

此外，每个程序为其可能抛出的每个错误生成一个自定义 `ProgramError`。例如，如果您的程序定义了一个 `UpdateAuthorityIncorrect` 错误，它会生成以下类。

```ts
export class UpdateAuthorityIncorrectError extends ProgramError {
  readonly name: string = 'UpdateAuthorityIncorrect';

  readonly code: number = 0x7; // 7

  constructor(program: Program, cause?: Error) {
    super('Update Authority given does not match', program, cause);
  }
}
```

每个生成的错误也会注册在 `codeToErrorMap` 和 `nameToErrorMap` 中，允许库提供两个辅助方法，可以从名称或代码查找任何错误类。

```ts
getMplTokenMetadataErrorFromCode(0x7, program); // -> UpdateAuthorityIncorrectError
getMplTokenMetadataErrorFromName('UpdateAuthorityIncorrect', program); // -> UpdateAuthorityIncorrectError
```

请注意，这些方法被 `createMplTokenMetadataProgram` 函数用于填充 `Program` 对象的 `getErrorFromCode` 和 `getErrorFromName` 函数。
