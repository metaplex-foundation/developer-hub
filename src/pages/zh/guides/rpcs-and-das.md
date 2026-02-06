---
title: RPC 和 DAS
metaTitle: Solana 区块链上的 RPC 和 DAS | 指南
description: 了解 Solana 区块链上的 RPC 以及 Metaplex 的 DAS 如何帮助在 Solana 上存储和读取数据。
# remember to update dates also in /components/guides/index.js
created: '06-16-2024'
updated: '04-19-2025'
---

## Solana 区块链上 RPC 的作用

远程过程调用（RPC）是 Solana 区块链基础设施的关键部分。它们充当用户（或应用程序）和区块链之间的桥梁，促进交互和数据检索。

#### RPC 的主要作用

1. **促进网络通信**：
RPC 服务器处理来自客户端（用户或应用程序）的请求，并与区块链交互以满足这些请求。它们为外部实体提供了一种标准化的方式来与区块链通信，而无需它们运行完整节点。

2. **提交交易**：
RPC 使客户端能够向 Solana 区块链提交交易。当用户想要在区块链上执行操作时，例如转移代币或调用智能合约，交易会发送到 RPC 服务器，然后服务器将其传播到网络以进行处理并包含在区块中。

3. **检索区块链数据**：
RPC 服务器允许客户端向区块链请求各种类型的数据，包括：

- **账户信息**：有关特定账户的详细信息，例如余额、代币持有量和其他元数据。
- **交易历史**：与账户或特定交易签名相关的历史交易。
- **区块信息**：有关特定区块的详细信息，包括区块高度、区块哈希和区块中包含的交易。
- **程序日志**：访问已执行程序（智能合约）的日志和输出。

1. **监控网络状态**：
RPC 提供端点来检查网络和节点的状态，例如：

- **节点健康**：确定节点是否在线并正常运行。
- **网络延迟**：测量处理请求和接收响应所需的时间。
- **同步状态**：检查节点是否与网络的其余部分同步。

1. **支持开发和调试**：
RPC 端点是在 Solana 上构建的开发者的基本工具。它们提供以下功能：

- **模拟交易**：在将交易提交到网络之前模拟交易以查看其潜在影响。
- **获取程序账户**：检索与特定程序关联的所有账户，这对于管理程序状态很有用。
- **获取日志**：从交易和程序中获取详细日志以调试和优化其应用程序。

### RPC 端点示例

以下是一些常见的 RPC 端点及其功能：

- **getBalance**：检索指定账户的余额。
- **sendTransaction**：向网络提交交易。
- **getTransaction**：使用其签名获取有关特定交易的详细信息。
- **getBlock**：通过其插槽号检索有关特定区块的信息。
- **simulateTransaction**：模拟交易以预测其结果，而无需在链上执行它。

### 使用示例

以下是使用 JavaScript 与 Solana 的 RPC 端点交互的简单示例：

```javascript
const solanaWeb3 = require('@solana/web3.js');

// Connect to the Solana cluster
const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('mainnet-beta'), 'confirmed');

// Fetch the balance of an account
async function getBalance(publicKey) {
  const balance = await connection.getBalance(publicKey);
  console.log(`Balance: ${balance} lamports`);
}

// Send a transaction
async function sendTransaction(transaction, payer) {
  const signature = await solanaWeb3.sendAndConfirmTransaction(connection, transaction, [payer]);
  console.log(`Transaction signature: ${signature}`);
}

// Example public key (a real Solana address format)
const publicKey = new solanaWeb3.PublicKey('7C4jsPZpht42Tw6MjXWF56Q5RQUocjBBmciEjDa8HRtp');

// Get balance
getBalance(publicKey);
```

## Metaplex DAS

Metaplex DAS（数字资产标准）是一个协议或框架，旨在标准化 Solana 区块链上 NFT 和代币的读取层，允许开发者在获取多种不同标准和布局的数字资产时标准化其代码。

### 索引数字资产

通过索引所有数字资产（NFT 和代币），用户可以更快地读取这些资产的数据，因为信息存储在优化的数据库中，而不是直接从区块链获取。

### 同步

DAS 能够在将某些生命周期指令发送到区块链期间同步数据的重新索引。通过监视这些指令，例如创建、更新、销毁和转移，我们可以始终确保 DAS 索引的数据是最新的。

目前，Core、Token Metadata 和 Bubblegum 都由 DAS 索引。

要了解有关 Metaplex DAS 的更多信息，您可以访问以下页面：

- [Metaplex DAS API](/zh/dev-tools/das-api)
- [Metaplex DAS API Github](https://github.com/metaplex-foundation/digital-asset-standard-api)
- [Metaplex Digital Asset RPC Infrastructure Github](https://github.com/metaplex-foundation/digital-asset-rpc-infrastructure)

## RPC 和 DAS 集成

RPC 和 DAS 在 Solana 生态系统中相互补充。虽然标准 RPC 提供对链上数据的直接访问，但 Metaplex DAS 专门为数字资产提供了一个优化的索引层。通过适当地利用这两种服务，开发者可以构建更高效的应用程序，通过 RPC 检索一般区块链数据，同时通过 DAS 访问数字资产信息，从而获得更好的性能和用户体验。
