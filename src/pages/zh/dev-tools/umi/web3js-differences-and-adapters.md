---
title: '@solana/web3.js 差异和适配器'
metaTitle: 'Umi - @solana/web3.js 差异和适配器'
description: '使 Metaplex Umi 与 Solana web3js 配合工作的差异和适配器。'
---

`@solana/web3.js` 库目前在 Solana 生态系统中广泛使用，并为 `Publickeys`、`Transactions`、`Instructions` 等定义了自己的类型。

在创建 `Umi` 时，我们希望摆脱 `@solana/web3.js` 中定义的基于类的类型。不幸的是，这意味着虽然具有相同或相似的导入名称，但 `@solana/web3.js` 的所有类型并不都与 `Umi` 提供的类型兼容，反之亦然。

为了解决这个问题，`Umi` 提供了一组适配器，允许将类型与其 `Web3.js` 对应物相互解析，它们可以在 [`@metaplex-foundation/umi-web3js-adapters`](https://www.npmjs.com/package/@metaplex-foundation/umi-web3js-adapters) 包中找到。

## 必需的包和导入

`umi-web3js-adapters` 包包含在 Umi 和 Web3.js 类型之间转换所需的所有辅助方法。

虽然在安装 `@metaplex-foundation/umi` 包时已经包含了它，但您也可以使用以下命令单独安装：

```
npm i @metaplex-foundation/umi-web3js-adapters
```

**以下是您可以访问的导入：**

```ts
import {
  // 密钥对
  fromWeb3JsKeypair, toWeb3JsKeypair,
  // 公钥
  fromWeb3JsPublicKey, toWeb3JsPublicKey,
  // 指令
  fromWeb3JsInstruction, toWeb3JsInstruction,
  // 旧版交易
  fromWeb3JsLegacyTransaction, toWeb3JsLegacyTransaction,
  // 版本化交易
  fromWeb3JsTransaction, toWeb3JsTransaction,
  // 消息
  fromWeb3JsMessage, toWeb3JsMessage, toWeb3JsMessageFromInput
} from '@metaplex-foundation/umi-web3js-adapters';
```

## 公钥

生成公钥乍一看可能很相似，但包之间存在一些细微差异。**Web3Js** 使用大写 `P` 并需要 `new`，而 **Umi** 版本使用小写 `p`。

### Umi
```ts
import { publicKey } from '@metaplex-foundation/umi';

// 生成新的 Umi 公钥
const umiPublicKey = publicKey("11111111111111111111111111111111");
```

### Web3Js
```ts
import { PublicKey } from '@solana/web3.js';

// 生成新的 Web3Js 公钥
const web3jsPublickey = new PublicKey("1111111111111111111111111111111111111111");
```

接下来，让我们看看如何使用适配器。

### 从 Web3Js 到 Umi
```ts
import { PublicKey } from '@solana/web3.js';
import { fromWeb3JsPublicKey } from '@metaplex-foundation/umi-web3js-adapters';

// 生成新的公钥
const web3jsPublickey = new PublicKey("1111111111111111111111111111111111111111");

// 使用 UmiWeb3jsAdapters 包进行转换
const umiPublicKey = fromWeb3JsPublicKey(web3jsPublickey);
```

### 从 Umi 到 Web3Js
```ts
import { publicKey } from '@metaplex-foundation/umi';
import { toWeb3JsPublicKey } from '@metaplex-foundation/umi-web3js-adapters';

// 生成新的公钥
const umiPublicKey = publicKey("11111111111111111111111111111111");

// 使用 UmiWeb3jsAdapters 包进行转换
const web3jsPublickey = toWeb3JsPublicKey(umiPublicKey);
```

## 密钥对

生成密钥对是 Web3Js 和 Umi 差异增加的地方。使用 **Web3Js**，您可以简单地使用 `Keypair.generate()`，但是在 **Umi** 中，您首先需要创建一个 Umi 实例，您将在大多数 Umi 和 Metaplex 相关操作中使用它。

### Umi
```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { generateSigner, createSignerFromKeypair } from '@metaplex-foundation/umi'

// 生成新的 Umi 实例
const umi = createUmi('https://api.devnet.solana.com')

// 生成新的 Umi 密钥对
const umiKeypair = generateSigner(umi)

// 或使用现有的
const umiKeypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(walletFile));
```

### Web3Js
```ts
import { Keypair } from '@solana/web3.js';

// 生成新的 Web3Js 密钥对
const web3jsKeypair = Keypair.generate();

// 或使用现有的
const web3jsKeypair = Keypair.fromSecretKey(new Uint8Array(walletFile));
```

接下来，让我们看看如何使用适配器。

### 从 Umi 到 Web3Js
```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { generateSigner } from '@metaplex-foundation/umi'
import { toWeb3JsKeypair } from '@metaplex-foundation/umi-web3js-adapters';

// 生成新的 Umi 实例
const umi = createUmi('https://api.devnet.solana.com')

// 生成新的密钥对
const umiKeypair = generateSigner(umi)

// 使用 UmiWeb3jsAdapters 包进行转换
const web3jsKeypair = toWeb3JsKeypair(umiKeypair);
```

### 从 Web3Js 到 Umi
```ts
import { Keypair } from '@solana/web3.js';
import { fromWeb3JsKeypair } from '@metaplex-foundation/umi-web3js-adapters';

// 生成新的密钥对
const web3jsKeypair = Keypair.generate();

// 使用 UmiWeb3jsAdapters 包进行转换
const umiKeypair = fromWeb3JsKeypair(web3jsKeypair);
```

## 指令

创建指令时，与 Umi 的关键区别在于您必须首先创建一个 Umi 实例（与 `Keypairs` 一样）。此外，`getInstructions()` 返回指令数组而不是单个指令。

对于大多数用例，处理单个指令无论如何都不是必需的，因为这可以使用其他辅助函数和交易构建器简化。

### Umi
```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { transferSol } from '@metaplex-foundation/mpl-toolbox';

// 生成新的 Umi 实例
const umi = createUmi('https://api.devnet.solana.com').use(mplCore())

// 创建新指令（如 core nft 转移）
// get instructions 将给您一个指令数组
const umiInstructions = transferSol(umi, {...TransferParams}).getInstructions();
```

### Web3Js
```ts
import { SystemProgram } from '@solana/web3.js';

// 创建新指令（如 lamport 转移）
const web3jsInstruction = SystemProgram.transfer({...TransferParams})
```

接下来，让我们看看如何使用适配器。

### 从 Umi 到 Web3Js
```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { transferSol } from '@metaplex-foundation/mpl-toolbox';
import { toWeb3JsInstruction } from '@metaplex-foundation/umi-web3js-adapters';

// 生成新的 Umi 实例
const umi = createUmi('https://api.devnet.solana.com').use(mplCore())

// 创建新指令（如 core nft 转移）
const umiInstruction = transferSol(umi, {...TransferParams}).getInstructions();

// 使用 UmiWeb3jsAdapters 包进行转换
const web3jsInstruction = umiInstruction.map(toWeb3JsInstruction);
```

### 从 Web3Js 到 Umi
```ts
import { SystemProgram } from '@solana/web3.js';
import { fromWeb3JsInstruction } from '@metaplex-foundation/umi-web3js-adapters';

// 生成新的 Umi 实例
const umi = createUmi('https://api.devnet.solana.com')

// 创建新指令（如 lamport 转移）
const web3jsInstruction = SystemProgram.transfer({...TransferParams})

// 使用 UmiWeb3jsAdapters 包进行转换
const umiInstruction = fromWeb3JsInstruction(web3jsInstruction);
```

## 交易

Solana 运行时支持两种交易版本：
- 旧版交易：较旧的交易格式，没有额外优势
- 0 / 版本化交易：添加了对地址查找表的支持

**注意**：如果您不熟悉版本化交易的概念，请在[此处](https://solana.com/en/docs/advanced/versions)阅读更多信息

对于 `umi` 和 `umi-web3js-adapters`，我们添加了对两种交易类型的支持！

### Umi
```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { transferSol } from '@metaplex-foundation/mpl-toolbox';
// 生成新的 Umi 实例
const umi = createUmi('https://api.devnet.solana.com').use(mplCore())

// 创建新的 Umi 旧版交易
const umiTransaction = transferSol(umi, {...TransferParams}).useLegacyVersion();

// 创建新的 Umi 版本化交易
const umiVersionedTransaction = transferSol(umi, {...TransferParams}).useV0().build(umi)
```

### Web3Js
```ts
import { Transaction, VersionedTransaction, TransactionMessage, Connection, clusterApiUrl, SystemProgram } from '@solana/web3.js';

// 创建新的 Web3Js 旧版交易
const web3jsTransaction = new Transaction().add(SystemProgram.transfer({...TransferParams}));

// 创建新的 Web3Js 版本化交易
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

接下来，让我们看看如何使用适配器。

### 从 Umi 到 Web3Js
```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { transferSol } from '@metaplex-foundation/mpl-toolbox';
import { toWeb3JsLegacyTransaction, toWeb3JsTransaction } from '@metaplex-foundation/umi-web3js-adapters';

// 生成新的 Umi 实例
const umi = createUmi('https://api.devnet.solana.com').use(mplCore())

// 创建新的旧版交易
const umiTransaction = transferSol(umi, {...TransferParams}).useLegacyVersion();

// 使用 UmiWeb3jsAdapters 包进行转换
const web3jsTransaction = toWeb3JsTransaction(umiTransaction);

/// 版本化交易 ///

// 创建新的版本化交易
const umiVersionedTransaction = transferSol(umi, {...TransferParams}).useV0().build(umi)

// 使用 UmiWeb3jsAdapters 包进行转换
const web3jsVersionedTransaction = toWeb3JsTransaction(umiVersionedTransaction);
```

### 从 Web3Js 到 Umi
```ts
import { Transaction, VersionedTransaction, TransactionMessage, Connection, clusterApiUrl, SystemProgram } from '@solana/web3.js';
import { fromWeb3JsLegacyTransaction, fromWeb3JsTransaction } from '@metaplex-foundation/umi-web3js-adapters';

// 创建新的旧版交易
const web3jsTransaction = new Transaction().add(SystemProgram.transfer({...TransferParams}));

// 使用 UmiWeb3jsAdapters 包进行转换
const umiTransaction = fromWeb3JsLegacyTransaction(web3jsTransaction);

/// 版本化交易 ///

// 创建新的版本化交易
const web3jsVersionedTransaction = new VersionedTransaction(...messageV0Params);

// 使用 UmiWeb3jsAdapters 包进行转换
const umiVersionedTransaction = fromWeb3JsTransaction(web3jsVersionedTransaction);
```

## 消息

我们已经在版本化交易创建期间涵盖了创建消息。让我们再次回顾一下。

### Umi
```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { transfer, mplCore } from '@metaplex-foundation/mpl-core'

// 生成新的 Umi 实例
const umi = createUmi('https://api.devnet.solana.com').use(mplCore())

// 创建新的 Umi 消息
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

// 创建新的 Web3Js 消息
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

接下来，让我们看看如何使用适配器。

### 从 Umi 到 Web3Js
```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { toWeb3JMessage } from '@metaplex-foundation/umi-web3js-adapters';

// 生成新的 Umi 实例
const umi = createUmi('https://api.devnet.solana.com').use(mplCore())

// 创建新的版本化交易
const umiMessage = umi.transactions.create({...createParams}).message;

// 使用 UmiWeb3jsAdapters 包进行转换
const web3jsMessage = toWeb3JMessage(umiMessage);
```

### 从 Web3Js 到 Umi
```ts
import { TransactionMessage } from '@solana/web3.js';
import { fromWeb3JMessage } from '@metaplex-foundation/umi-web3js-adapters';

// 创建新的版本化交易
const Web3JsMessage = new TransactionMessage({...createMessageParams}).compileToV0Message();

// 使用 UmiWeb3jsAdapters 包进行转换
const umiMessage = fromWeb3JMessage(Web3JsMessage);
```
