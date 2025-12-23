---
title: 发送交易
metaTitle: 发送交易 | Umi
description: 使用 Metaplex Umi 和交易构建器发送交易
---
管理和发送交易是任何 Solana 客户端的重要组成部分。为了帮助管理它们，Umi 提供了一系列组件：

- [TransactionFactoryInterface](https://umi.typedoc.metaplex.com/interfaces/umi.TransactionFactoryInterface.html)，可用于创建和（反）序列化交易。
- [TransactionBuilder](https://umi.typedoc.metaplex.com/classes/umi.TransactionBuilder.html)，使构建交易变得容易。
- [RpcInterface](https://umi.typedoc.metaplex.com/interfaces/umi.RpcInterface.html)，可用于发送、确认和获取交易。您可以[在此处阅读有关 RPC 接口的更多信息](rpc)。

## 交易和指令

Umi 为交易、指令和所有其他相关类型定义了自己的一组接口。以下是最重要的概述及其 API 文档链接：

- [Transaction](https://umi.typedoc.metaplex.com/interfaces/umi.Transaction.html)：交易由版本化的交易消息、所需签名列表和其消息的序列化版本组成，以便可以轻松签名。
- [TransactionMessage](https://umi.typedoc.metaplex.com/interfaces/umi.TransactionMessage.html)：交易消息由所有必需的公钥、一个或多个使用索引而非公钥的编译指令、最近的区块哈希和其他属性（如其版本）组成。交易消息可以具有以下版本之一：
  - 版本："legacy"：Solana 交易消息的第一个迭代。
  - 版本：0：引入交易版本控制的第一个交易消息版本。它还引入了地址查找表。
- [Instruction](https://umi.typedoc.metaplex.com/types/umi.Instruction.html)：指令由程序 ID、[AccountMeta](https://umi.typedoc.metaplex.com/types/umi.AccountMeta.html) 列表和一些序列化数据组成。每个 `AccountMeta` 由公钥、一个指示其是否将签署交易的布尔值和另一个指示其是否可写的布尔值组成。

要创建新交易，您可以使用 `TransactionFactoryInterface` 的 `create` 方法。例如，以下是如何创建具有单个指令的版本 `0` 交易：

```ts
const transaction = umi.transactions.create({
  version: 0,
  blockhash: (await umi.rpc.getLatestBlockhash()).blockhash,
  instructions: [myInstruction],
  payer: umi.payer.publicKey,
})
```

交易工厂接口还可用于序列化和反序列化交易及其消息。

```ts
const mySerializedTransaction = umi.transactions.serialize(myTransaction)
const myTransaction = umi.transactions.deserialize(mySerializedTransaction)
const mySerializedMessage = umi.transactions.serializeMessage(myMessage)
const myMessage = umi.transactions.deserializeMessage(mySerializedMessage)
```

所有这些都很好，但每次我们想向区块链发送交易时都要构建可能有点繁琐。幸运的是，Umi 提供了一个 `TransactionBuilder` 来帮助解决这个问题。

## 交易构建器

交易构建器是不可变对象，可用于逐步构建交易，直到我们准备好构建、签名和/或发送它们。它们由 [`WrappedInstruction`](https://umi.typedoc.metaplex.com/types/umi.WrappedInstruction.html) 列表和各种可用于配置构建交易的选项组成。`WrappedInstruction` 是一个包含 `instruction` 和一些其他属性的简单对象。具体来说：

- `bytesCreatedOnChain` 属性，如果指令最终创建账户，它会告诉我们它们在链上将占用多少字节（包括账户头）。
- `signers` 数组，以便我们知道此特定指令需要哪些签名者，而不是整个交易。这使我们能够将交易构建器拆分为两个而不会丢失任何信息，正如我们稍后将看到的。

我们可以使用 `transactionBuilder` 函数创建新的交易构建器，并使用其 `add` 方法向其添加指令。您也可以使用 `prepend` 方法在交易开头推送指令。

```ts
let builder = transactionBuilder()
  .add(myWrappedInstruction)
  .add(myOtherWrappedInstruction)
  .prepend(myFirstWrappedInstruction)
```

由于交易构建器是不可变的，我们必须注意始终将 `add` 和 `prepend` 方法的结果分配给新变量。对于任何其他通过返回新构建器来更新交易构建器的方法也是如此。

```ts
builder = builder.add(myWrappedInstruction)
builder = builder.prepend(myWrappedInstruction)
```

请注意，这些方法中的任何一个也接受其他交易构建器，并将它们合并到当前构建器中。在实践中，这意味着程序库可以编写（或[自动生成](kinobi)）自己的返回交易构建器的辅助方法，以便最终用户可以将它们组合在一起。

```ts
import { transferSol, addMemo } from '@metaplex-foundation/mpl-toolbox';
import { createNft } from '@metaplex-foundation/mpl-token-metadata';

let builder = transactionBuilder()
  .add(addMemo(umi, { ... }))
  .add(createNft(umi, { ... }))
  .add(transferSol(umi, { ... }))
```

如果原始构建器创建的交易太大而无法发送到区块链，您也可以将交易构建器拆分为两个。为此，您可以使用 [`splitByIndex`](https://umi.typedoc.metaplex.com/classes/umi.TransactionBuilder.html#splitByIndex) 方法或更危险的 [`unsafeSplitByTransactionSize`](https://umi.typedoc.metaplex.com/classes/umi.TransactionBuilder.html#unsafeSplitByTransactionSize) 方法。请务必阅读后者的 API 参考中的注释。

```ts
const [builderA, builderB] = builder.splitByIndex(2)
const splitBuilders = builder.unsafeSplitByTransactionSize(umi)
```

您可以使用交易构建器做更多事情。请随时[阅读 API 参考](https://umi.typedoc.metaplex.com/classes/umi.TransactionBuilder.html)以了解更多信息，但以下是一些其他可以配置我们交易构建器的方法的快速概述。

```ts
// 设置器。
builder = builder.setVersion(myTransactionVersion) // 设置交易版本。
builder = builder.useLegacyVersion() // 将交易版本设置为"legacy"。
builder = builder.useV0() // 将交易版本设置为 0（默认）。
builder = builder.empty() // 从构建器中删除所有指令但保留配置。
builder = builder.setItems(myWrappedInstructions) // 用给定的指令覆盖包装的指令。
builder = builder.setAddressLookupTables(myLuts) // 设置地址查找表，仅适用于版本 0 交易。
builder = builder.setFeePayer(myPayer) // 设置自定义费用支付者。
builder = builder.setBlockhash(myBlockhash) // 设置用于交易的区块哈希。
builder = await builder.setLatestBlockhash(umi) // 获取最新区块哈希并将其用于交易。

// 获取器。
const transactionSize = builder.getTransactionSize(umi) // 返回构建交易的字节大小。
const isSmallEnough = builder.fitsInOneTransaction(umi) // 构建的交易是否适合一个交易。
const transactionRequired = builder.minimumTransactionsRequired(umi) // 返回发送所有指令所需的最小交易数。
const blockhash = builder.getBlockhash() // 返回配置的区块哈希（如果有）。
const feePayer = builder.getFeePayer(umi) // 返回配置的费用支付者，如果没有配置则使用 `umi.payer`。
const instructions = builder.getInstructions(umi) // 返回所有解包的指令。
const signers = builder.getSigners(umi) // 返回所有去重的签名者，包括费用支付者。
const bytes = builder.getBytesCreatedOnChain() // 返回将在链上创建的总字节数。
const solAmount = await builder.getRentCreatedOnChain(umi) // 返回将在链上创建的总字节数。
```

请注意，我们将 `Umi` 实例传递给其中一些方法。这是因为它们需要访问 Umi 的一些核心接口来执行其任务。

现在我们的交易构建器已准备好，让我们看看如何使用它来构建、签名和发送交易。

## 构建和签名交易

当您准备好构建交易时，您可以简单地使用 `build` 方法。此方法将返回一个 `Transaction` 对象，然后您可以对其签名并发送到区块链。

```ts
const transaction = builder.build(umi)
```

请注意，如果在构建器上未设置区块哈希，`build` 方法将抛出错误。如果您希望使用最新区块哈希构建交易，可以改用 `buildWithLatestBlockhash` 方法。

```ts
const transaction = await builder.buildWithLatestBlockhash(umi)
```

此时，您可以使用构建的交易，并通过 `getSigners` 方法从构建器获取所有去重的签名者来签名它（有关更多详细信息，请参阅[签名交易](/zh/dev-tools/umi/public-keys-and-signers#签署交易)）。但是，Umi 提供了一个 `buildAndSign` 方法可以为您执行此操作。使用 `buildAndSign` 时，仅当构建器上未设置区块哈希时才会使用最新区块哈希。

```ts
const signedTransaction = await builder.buildAndSign(umi)
```

已构建但尚未签名的交易可以推入数组，并使用 `signAllTransactions` 一次性签名。

```ts
const signedTransactions = await signAllTransactions(transactionArray);
```

## 发送交易

现在我们有了签名的交易，让我们看看如何将其发送到区块链。

一种方法是像这样使用 `RpcInterface` 的 `sendTransaction` 和 `confirmTransaction` 方法。确认交易时，我们必须提供一个确认策略，它可以是 `blockhash` 或 `durableNonce` 类型，每种类型需要不同的参数集。以下是我们如何使用 `blockhash` 策略发送和确认交易。

```ts
const signedTransaction = await builder.buildAndSign(umi)
const signature = await umi.rpc.sendTransaction(signedTransaction)
const confirmResult = await umi.rpc.confirmTransaction(signature, {
  strategy: { type: 'blockhash', ...(await umi.rpc.getLatestBlockhash()) },
})
```

由于这是一个非常常见的任务，Umi 在交易构建器上提供了辅助方法来为我们执行此操作。这样，上面的代码可以重写为如下所示。

```ts
const confirmResult = await builder.sendAndConfirm(umi)
```

这将在发送和确认交易之前使用 `buildAndSign` 方法构建和签名交易，默认使用 `blockhash` 策略。它将在适用时重用交易区块哈希用于确认策略，以避免额外的 HTTP 请求。也就是说，您仍然可以像这样显式提供确认策略或设置任何选项。

```ts
const confirmResult = await builder.sendAndConfirm(umi, {
  // 发送选项。
  send: {
    skipPreflight: true,
  },

  // 确认选项。
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

还要注意，您可以通过交易构建器的 `send` 方法发送交易而无需等待确认。

```ts
const signature = await builder.send(umi)
```

或者使用 `sendAndConfirm()` 等待交易最终确定。为此，请添加 `{confirm: {commitment: 'finalized'}}` 作为"options"参数。

```ts
const confirmResult = await builder.sendAndConfirm(umi, {confirm: {commitment: 'finalized'}})
```

## 使用地址查找表

从版本 0 交易开始，您可以使用地址查找表来减少交易大小。

```ts
const myLut: AddressLookupTableInput = {
  publicKey: publicKey('...') // 查找表账户的地址。
  addresses: [ // 查找表中注册的地址。
    publicKey('...'),
    publicKey('...'),
    publicKey('...'),
  ]
}

builder = builder.setAddressLookupTables([myLut]);
```

要创建地址查找表，您可能对提供创建它们的辅助函数的 `@metaplex-foundation/mpl-toolbox` 包感兴趣。

```ts
import { createLut } from '@metaplex-foundation/mpl-toolbox'

// 创建查找表。
const [lutBuilder, lut] = createLut(umi, {
  recentSlot: await umi.rpc.getSlot({ commitment: 'finalized' }),
  addresses: [myAddressA, myAddressB, myAddressC],
})
await lutBuilder.sendAndConfirm(umi)

// 稍后，使用创建的查找表。
myBuilder = myBuilder.setAddressLookupTables([lut])
```

## 转换交易签名格式

### 获取人类可读（base58）交易签名

发送交易时返回的 `signature` 是 `Uint8Array` 类型。因此，要获取可以复制的字符串，例如在浏览器中打开，需要先对其进行反序列化，如下所示：

```ts
import { base58 } from "@metaplex-foundation/umi/serializers";
// 接收已发送交易签名的示例
const { signature } = await builder.send(umi)

// 反序列化它
const serializedSignature = base58.deserialize(signature)[0];
console.log(
        `在浏览器中查看交易：https://explorer.solana.com/tx/${serializedSignature}`
      );
```

### 将人类可读（base58）交易签名转换为 Uint8Array

在某些情况下，您可能有一个 base58 编码的交易签名，并且想要将其转换为 Uint8Array。例如，如果您从浏览器复制了交易签名并想在 umi 脚本中使用它，就会出现这种情况。

这可以使用 `base58.deserialize` 方法完成。

```ts
import { base58 } from "@metaplex-foundation/umi/serializers";

const signature = "4NJhR8zm3G7hU1uhPZaBiTMBCERh4CWp2cF1x2Ly9yCvenrY6oS9hF2PAGfT26odWvb49BktkWkoBPGoXMYUVqkY";

const transaction: Uint8Array = base58.serialize(signature)
```

## 获取已发送的交易

现在让我们看看如何获取已发送到区块链的交易。

为此，我们可以使用 `RpcInterface` 的 `getTransaction` 方法并提供我们要获取的交易的签名。

```ts
const transaction = await umi.rpc.getTransaction(signature)
```

这将返回一个 [`TransactionWithMeta`](https://umi.typedoc.metaplex.com/types/umi.TransactionWithMeta.html) 实例，它是 `Transaction` 的超集，包含一个额外的 `meta` 属性，提供有关交易的附加信息。例如，您可以像这样访问已发送交易的日志。

```ts
const transaction = await umi.rpc.getTransaction(signature)
const logs: string[] = transaction.meta.logs
```
