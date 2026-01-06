---
title: 公钥和签名者
metaTitle: 公钥和签名者 | Umi
description: Metaplex Umi 中的公钥和签名者
---
在本页中，我们将了解如何在 Umi 中管理公钥和签名者，这部分功能由 EdDSA 接口提供支持。

[EdDSA 接口](https://umi.typedoc.metaplex.com/interfaces/umi.EddsaInterface.html)用于使用 EdDSA 算法创建密钥对、查找 PDA 和签署/验证消息。我们可以直接使用此接口和/或使用委托给此接口的辅助方法，以提供更好的开发者体验。

让我们按用例来逐一了解。

{% callout type="note" %}
正在寻找使用 Wallet Adapter 或文件系统钱包的代码片段？请查看[快速入门页面](/zh/dev-tools/umi/getting-started)！
{% /callout %}

## 公钥

在 Umi 中，公钥是一个简单的 base58 `string`，表示 32 字节数组。我们使用不透明类型来告诉 TypeScript 给定的公钥已经过验证且有效。我们还使用类型参数来提供更细粒度的类型安全。

```ts
// 简短版本：
type PublicKey = string;

// 实际版本：
type PublicKey<TAddress extends string = string> = TAddress & { __publicKey: unique symbol };
```

我们可以使用 `publicKey` 辅助方法从各种输入创建新的有效公钥。如果提供的输入无法转换为有效的公钥，将抛出错误。

```ts
// 从 base58 字符串。
publicKey('LorisCg1FTs89a32VSrFskYDgiRbNQzct1WxyZb7nuA');

// 从 32 字节缓冲区。
publicKey(new Uint8Array(32));

// 从 PublicKey 或 Signer 类型。
publicKey(someWallet as PublicKey | Signer);
```

可以使用 `publicKeyBytes` 辅助方法将公钥转换为 `Uint8Array`。

```ts
publicKeyBytes(myPublicKey);
// -> Uint8Array(32)
```

还有其他辅助方法可用于帮助管理公钥。

```ts
// 检查提供的值是否为有效公钥。
isPublicKey(myPublicKey);

// 断言提供的值是有效公钥，否则失败。
assertPublicKey(myPublicKey);

// 对公钥数组去重。
uniquePublicKeys(myPublicKeys);

// 创建默认公钥，即 32 字节的零数组。
defaultPublicKey();
```

## PDA

PDA（程序派生地址）是从程序 ID 和预定义种子数组派生的公钥。需要一个范围从 0 到 255 的 `bump` 数字，以确保 PDA 不在 EdDSA 椭圆曲线上，因此不会与加密生成的公钥冲突。

在 Umi 中，PDA 表示为由派生公钥和 bump 数字组成的元组。与公钥类似，它使用不透明类型和类型参数。

```ts
// 简短版本：
type Pda = [PublicKey, number];

// 实际版本：
export type Pda<
  TAddress extends string = string,
  TBump extends number = number
> = [PublicKey<TAddress>, TBump] & { readonly __pda: unique symbol };
```

要派生新的 PDA，我们可以使用 EdDSA 接口的 `findPda` 方法。

```ts
const pda = umi.eddsa.findPda(programId, seeds);
```

每个种子必须序列化为 `Uint8Array`。您可以在[序列化器页面](serializers)了解更多关于序列化器的信息，但这里有一个快速示例，展示如何查找给定铸币地址的元数据 PDA。

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

请注意，在大多数情况下，程序会提供辅助方法来查找特定的 PDA。例如，使用 [`@metaplex-foundation/mpl-token-metadata`](https://github.com/metaplex-foundation/mpl-token-metadata) [Kinobi](kinobi) 生成库的 `findMetadataPda` 方法，上面的代码片段可以简化为以下内容。

```ts
import { findMetadataPda } from '@metaplex-foundation/mpl-token-metadata';

const metadata = findMetadataPda(umi, { mint })
```

以下辅助方法也可用于帮助管理 PDA。

```ts
// 检查提供的值是否为 Pda。
isPda(myPda);

// 检查提供的公钥是否在 EdDSA 椭圆曲线上。
umi.eddsa.isOnCurve(myPublicKey);
```

## 签名者

签名者是可以签署交易和消息的公钥。这使交易能够由所需账户签署，钱包可以通过签署消息来证明其身份。在 Umi 中，它由以下接口表示。

```ts
interface Signer {
  publicKey: PublicKey;
  signMessage(message: Uint8Array): Promise<Uint8Array>;
  signTransaction(transaction: Transaction): Promise<Transaction>;
  signAllTransactions(transactions: Transaction[]): Promise<Transaction[]>;
}
```

您可以使用 `generateSigner` 辅助方法以加密方式生成新签名者。在底层，此方法使用 EdDSA 接口的 `generateKeypair` 方法，如下一节所述。

```ts
const mySigner = generateSigner(umi);
```

以下辅助函数也可用于管理签名者。

```ts
// 检查提供的值是否为 Signer。
isSigner(mySigner);

// 按公钥对签名者数组去重。
uniqueSigners(mySigners);
```

如 [Umi 接口页面](interfaces)所述，`Umi` 接口存储两个 `Signer` 实例：使用应用程序的 `identity` 和支付交易和存储费用的 `payer`。Umi 提供插件来快速将新签名者分配给这些属性。`signerIdentity` 和 `signerPayer` 插件可用于此目的。请注意，默认情况下，`signerIdentity` 方法也会更新 `payer` 属性，因为在大多数情况下，identity 也是 payer。

```ts
umi.use(signerIdentity(mySigner));
// 等同于：
umi.identity = mySigner;
umi.payer = mySigner;

umi.use(signerIdentity(mySigner, false));
// 等同于：
umi.identity = mySigner;

umi.use(signerPayer(mySigner));
// 等同于：
umi.payer = mySigner;
```

您还可以使用 `generatedSignerIdentity` 和 `generatedSignerPayer` 插件来生成新签名者并立即将其分配给 `identity` 和/或 `payer` 属性。

```ts
umi.use(generatedSignerIdentity());
umi.use(generatedSignerPayer());
```

在某些情况下，库可能需要提供 `Signer`，但当前环境无法访问此钱包作为签名者。例如，如果交易是在客户端创建的，但稍后将在私有服务器上签署，就会发生这种情况。这就是为什么 Umi 提供了 `createNoopSigner` 辅助函数，它从给定的公钥创建新签名者，并简单地忽略任何签名请求。然后，您有责任确保在将交易发送到区块链之前对其进行签名。

```ts
const mySigner = createNoopSigner(myPublicKey);
```

## 密钥对

虽然 Umi 只依赖 `Signer` 接口来从钱包请求签名，但它还定义了 `Keypair` 类型和 `KeypairSigner` 类型，它们明确知道其私钥。

```ts
type KeypairSigner = Signer & Keypair;
type Keypair = {
  publicKey: PublicKey;
  secretKey: Uint8Array;
};
```

EdDSA 接口的 `generateKeypair`、`createKeypairFromSeed` 和 `createKeypairFromSecretKey` 方法可用于生成新的 `Keypair` 对象。

```ts
// 生成新的随机密钥对。
const myKeypair = umi.eddsa.generateKeypair();

// 使用种子恢复密钥对。
const myKeypair = umi.eddsa.createKeypairFromSeed(mySeed);

// 使用私钥恢复密钥对。
const myKeypair = umi.eddsa.createKeypairFromSecretKey(mySecretKey);
```

为了在整个应用程序中将这些密钥对用作签名者，您可以使用 `createSignerFromKeypair` 辅助方法。此方法将返回 `KeypairSigner` 实例，以确保我们在需要时可以访问私钥。

```ts
const myKeypair = umi.eddsa.generateKeypair();
const myKeypairSigner = createSignerFromKeypair(umi, myKeypair);
```

请注意，上面的代码片段等同于使用上一节中描述的 `generateSigner` 辅助方法。

辅助函数和插件也存在于管理密钥对。

```ts
// 检查提供的签名者是否为 KeypairSigner 对象。
isKeypairSigner(mySigner);

// 将新密钥对注册为 identity 和 payer。
umi.use(keypairIdentity(myKeypair));

// 仅将新密钥对注册为 payer。
umi.use(keypairPayer(myKeypair));
```

## 签署消息

`Signer` 对象和 EdDSA 接口可以一起用于签署和验证消息，如下所示。

```ts
const myMessage = utf8.serialize('Hello, world!');
const mySignature = await mySigner.signMessage(myMessage)
const mySignatureIsCorrect = umi.eddsa.verify(myMessage, mySignature, mySigner.publicKey);
```

## 签署交易

一旦我们有了 `Signer` 实例，签署交易或一组交易就像调用 `signTransaction` 或 `signAllTransactions` 方法一样简单。

```ts
const mySignedTransaction = await mySigner.signTransaction(myTransaction);
const mySignedTransactions = await mySigner.signAllTransactions(myTransactions);
```

如果您需要多个签名者都签署同一交易，可以使用 `signTransaction` 辅助方法，如下所示。

```ts
const mySignedTransaction = await signTransaction(myTransaction, mySigners);
```

更进一步，如果您有多个交易，每个交易都需要由一个或多个签名者签署，`signAllTransactions` 函数可以帮助您。如果签名者需要签署多个交易，它甚至会确保使用 `signer.signAllTransactions` 方法一次性签署所有交易。

```ts
// 在此示例中，mySigner2 将使用 signAllTransactions 方法
// 签署两个交易。
const mySignedTransactions = await signAllTransactions([
  { transaction: myFirstTransaction, signers: [mySigner1, mySigner2] },
  { transaction: mySecondTransaction, signers: [mySigner2, mySigner3] }
]);
```

如果您手动创建 `Signer` 并因此实现其 `signTransaction` 方法，您可能需要使用 `addTransactionSignature` 辅助函数将签名添加到交易中。这将确保提供的签名是交易所需的，并推送到交易的 `signatures` 数组的正确索引处。

```ts
const mySignedTransaction = addTransactionSignature(myTransaction, mySignature, myPublicKey);
```
