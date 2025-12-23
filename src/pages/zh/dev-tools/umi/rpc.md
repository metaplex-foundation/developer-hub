---
title: 连接 RPC
metaTitle: 连接 RPC | Umi
description: 使用 Metaplex Umi 连接 RPC
---
通过 RPC 连接 Solana 区块链是任何去中心化应用程序的重要组成部分。Umi 提供了一个 [RpcInterface](https://umi.typedoc.metaplex.com/interfaces/umi.RpcInterface.html) 来帮助我们实现这一点。

## 配置 RPC 端点

通过默认捆绑包创建新的 Umi 实例时，您必须将 RPC 端点或 `@solana/web3.js` 的 `Connection` 类实例作为第一个参数传递。之后，每次调用 RPC 接口上的方法时都将使用此端点或 `Connection`。

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { Connection } from '@solana/web3.js';

// 传入您的 RPC 端点。
const umi = createUmi("https://api.mainnet-beta.solana.com");

// 或来自 web3.js 的显式 Connection 实例。
const umi = createUmi(new Connection("https://api.mainnet-beta.solana.com"));
```

或者，您可以使用插件提供的方式显式设置或更新 RPC 实现。例如，`web3JsRpc` 插件将设置 RPC 实现以使用 `@solana/web3.js` 库。

```ts
import { web3JsRpc } from '@metaplex-foundation/umi-rpc-web3js';
import { Connection } from '@solana/web3.js';

umi.use(web3JsRpc("https://api.mainnet-beta.solana.com"));
umi.use(web3JsRpc(new Connection("https://api.mainnet-beta.solana.com")));
```

## 获取 RPC 端点和集群

一旦设置了 RPC 实现，您可以通过以下方法访问其端点和集群：

```ts
const endpoint = umi.rpc.getEndpoint();
const cluster = umi.rpc.getCluster();
```

其中 `cluster` 是以下之一：

```ts
type Cluster = "mainnet-beta" | "devnet" | "testnet" | "localnet" | "custom"
```

## 发送交易

以下方法可用于发送、确认和获取交易：

```ts
const signature = await umi.rpc.sendTransaction(myTransaction);
const confirmResult = await umi.rpc.confirmTransaction(signature, { strategy });
const transaction = await umi.rpc.getTransaction(signature);
```

由于交易是 Solana 客户端的重要组成部分，我们在[发送交易](/zh/dev-tools/umi/transactions)文档页面中更详细地讨论它们。

## 模拟交易

您可以在发送交易之前模拟它们，以测试其行为并估算计算单元。Umi 提供了增强的模拟选项：

```ts
// 基本交易模拟
const simulationResult = await umi.rpc.simulateTransaction(myTransaction);

// 使用替换区块哈希进行模拟以获得更大灵活性
const simulationResult = await umi.rpc.simulateTransaction(myTransaction, {
  replaceRecentBlockhash: true
});
```

使用 `replaceRecentBlockhash: true` 时，模拟器仅在模拟请求中将交易的最近区块哈希替换为 RPC 的最新区块哈希。它不会修改您的原始交易或延长其链上有效性。要实际延长有效性，请获取新的区块哈希并重建/重新签名交易，或在发送前设置最新区块哈希。在模拟期间使用 `replaceRecentBlockhash: true` 更方便，可以节省额外的 RPC 调用。

## 获取账户

以下方法可用于获取账户或检查其是否存在：

```ts
const accountExists = await umi.rpc.accountExists(myPublicKey);
const maybeAccount = await umi.rpc.getAccount(myPublicKey);
const maybeAccounts = await umi.rpc.getAccounts(myPublicKeys);
const accounts = await umi.rpc.getProgramAccounts(myProgramId, { filters });
```

由于获取账户是最常见的操作之一，我们在[获取账户](accounts)文档页面中更详细地讨论它。

## 在支持的集群上空投 SOL

如果使用的集群支持空投，您可以使用以下方法将 SOL 发送到账户并确认请求。

```ts
// 向"myPublicKey"发送 1.5 SOL 并等待交易确认。
await umi.rpc.airdrop(myPublicKey, sol(1.5));
```

## 获取账户余额

您可以使用以下方法获取任何账户的 SOL 余额。这将返回一个 `SolAmount` 对象，[如此处所述](helpers#金额)。

```ts
const balance = await umi.rpc.getBalance(myPublicKey);
```

## 获取最新区块哈希

您可以通过以下方法获取最新区块哈希及其过期区块高度：

```ts
const { blockhash, lastValidBlockHeight } = await umi.rpc.getLatestBlockhash();
```

## 获取最新槽位

您可以通过以下方法以数字形式获取最新槽位：

```ts
const recentSlot = await umi.rpc.getSlot();
```

## 获取租金豁免

如果您需要计算账户的存储费用，可以使用 `getRent` 方法并传入账户数据所需的字节数。这将返回租金豁免费用（即存储费用）作为 `SolAmount`。

```ts
const rent = await umi.rpc.getRent(100);
```

请注意，这将自动考虑账户头的大小，因此您只需传入账户数据的字节数。

假设您现在想获取 3 个各有 100 字节数据的账户的租金豁免费用。运行 `umi.rpc.getRent(100 * 3)` 不会提供准确的响应，因为它只会为一个账户添加账户头，而不是三个。这就是为什么 Umi 允许您通过将 `includesHeaderBytes` 选项设置为 `true` 来显式传入账户头大小。

```ts
const rent = await umi.rpc.getRent((ACCOUNT_HEADER_SIZE + 100) * 3, {
  includesHeaderBytes: true
});
```

## 发送自定义 RPC 请求

由于每个 RPC 端点可能提供自己的自定义方法，Umi 允许您通过 `call` 方法向 RPC 发送自定义请求。它将方法名作为第一个参数，将可选的参数数组作为第二个参数。

```ts
const rpcResult = await umi.rpc.call("myCustomMethod", [myFirstParam, mySecondParam]);
```
