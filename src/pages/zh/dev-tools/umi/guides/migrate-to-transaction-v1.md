---
title: 从 V0 迁移到 V1 交易
metaTitle: 从 V0 迁移到 V1 交易 | Umi
description: 将 Umi 交易构建器和直接创建交易的方式从 Solana V0 交易迁移到 V1 交易，包括计算预算、优先费和钱包兼容性。
keywords:
  - Umi transaction v1
  - Solana transaction v1
  - Umi v0 migration
  - TransactionV1Config
  - useV1
  - setTransactionConfig
  - SIMD-0385
about:
  - Umi
  - Solana Transaction V1
  - Transaction Migration
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '09-21-2026'
updated: '09-21-2026'
howToSteps:
  - 将 Umi 软件包升级到 1.6.0 或更高版本，并将 web3.js 升级到 1.99.0 或更高版本
  - 为单个交易构建器选择 V1，或将 V1 设为应用默认版本
  - 使用 TransactionV1Config 取代 Compute Budget 指令
  - 将需要 Address Lookup Tables 的交易保留在 V0
  - 在签名前确认每个已连接的钱包都支持 V1 交易
howToTools:
  - Umi 1.6.0 or later
  - web3.js 1.99.0 or later
  - Solana RPC
faqs:
  - q: Umi 默认使用 V1 交易吗？
    a: 不会。为了向后兼容，Umi 1.6.0 仍以 V0 为默认版本。请在交易构建器上调用 useV1，或在创建 Umi 时将 defaultTransactionVersion 设置为 1。
  - q: Umi V1 交易可以使用地址查找表吗？
    a: 不可以。V1 交易不支持地址查找表。任何需要地址查找表的交易都应继续使用 V0。
  - q: V1 交易可以包含 Compute Budget 程序指令吗？
    a: 不可以。Umi 会拒绝包含 Compute Budget 指令的 V1 交易构建器。请使用 setTransactionConfig 设置计算单元上限、优先费总额、已加载账户数据大小上限或堆大小。
  - q: V1 交易优先费是按每个计算单元计价吗？
    a: 不是。TransactionV1Config.priorityFee 是以 SolAmount 表示的优先费总额。将 micro-lamport 单价乘以计算单元上限，再除以 1,000,000，并向上取整为 lamport。
  - q: 所有 Solana 钱包都支持 V1 交易吗？
    a: 不是。Umi 可以为钱包适配器序列化 V1 交易，但连接的钱包必须接受并签署版本为 1 的交易。在将 V1 设为应用级默认版本前，请先检查钱包支持情况。
---

将 Umi 应用从 V0 迁移到 [V1 交易](https://github.com/solana-foundation/solana-improvement-documents/blob/main/proposals/0385-transaction-v1.md)，以使用更大的交易，并直接在交易消息中配置计算预算。 {% .lead %}

{% callout title="您将迁移的内容" %}
本指南将 Umi V0 交易构建器转换为 V1，用 `TransactionV1Config` 取代 Compute Budget 指令，在全局配置 V1，并识别必须保留在 V0 上的交易。
{% /callout %}

## 总结

Umi 1.6.0 通过 `useV1()`、`defaultTransactionVersion: 1` 和直接交易输入中的 `version: 1` 提供可选的 V1 交易支持。

- V1 将序列化交易大小上限从 1,232 字节提高到 4,096 字节。
- V1 在 `TransactionV1Config` 中存储计算上限和优先费总额。
- V1 不支持 Address Lookup Tables 或 Compute Budget 指令。
- Umi 仍默认使用 V0，且连接的钱包必须支持 V1。

## 快速开始

在交易构建器上选择 V1，并使用 `setTransactionConfig` 取代 Compute Budget 指令。

1. 升级到 Umi 1.6.0 或更高版本，并升级到 `@solana/web3.js` 1.99.0 或更高版本。
2. 向交易构建器添加 `.useV1()`。
3. 移除 `setComputeUnitLimit` 和 `setComputeUnitPrice` 指令。
4. 添加 `.setTransactionConfig({ computeUnitLimit, priorityFee })`。
5. 使用应用支持的每一种钱包测试 V1 签名。

**跳转到：** [先决条件](#先决条件) · [V0 与 V1 的差异](#v0-与-v1-交易的差异) · [构建器迁移](#将交易构建器迁移到-v1) · [应用默认版本](#将-v1-设为应用默认版本) · [直接创建](#将直接创建交易迁移到-v1) · [Address Lookup Tables](#将使用-address-lookup-table-的交易保留在-v0) · [常见错误](#常见的-v1-迁移错误) · [常见问题](#常见问题)

## 先决条件

迁移到 V1 需要兼容的 Umi、Web3.js、RPC 和钱包版本。

| 组件 | 要求 |
|-----------|-------------|
| Umi 软件包 | 1.6.0 或更高版本 |
| `@solana/web3.js` | 1.99.0 或更高版本 |
| Solana 集群 | V1 已在 mainnet-beta、devnet 和 testnet 上启用 |
| 钱包 | 必须接受并签署版本为 `1` 的交易 |

{% callout type="warning" %}
在每条已连接钱包的流程都支持交易版本 `1` 之前，请勿在全局启用 V1。Umi 可以为钱包适配器序列化交易，但无法让不兼容的钱包签署该交易。
{% /callout %}

## V0 与 V1 交易的差异

V1 提高了交易大小上限，但不支持 V0 的 Address Lookup Tables 或 Compute Budget 指令。

| 功能 | V0 | V1 |
|------------|----------------|----------------|
| 序列化大小上限 | 1,232 字节 | 4,096 字节 |
| 地址查找表 | 支持 | 不支持 |
| 计算单元上限 | Compute Budget 指令 | `transactionConfig.computeUnitLimit` |
| 优先费 | 每个计算单元的 micro-lamport 数量 | `transactionConfig.priorityFee` 中的 `SolAmount` 总额 |
| Umi 1.6.0 中的默认版本 | 是 | 否，必须主动选择 |
| 构建器选择器 | `useV0()` | `useV1()` |

当交易超过 V0 大小上限但不依赖 Address Lookup Table 时，V1 最为实用。

## 将交易构建器迁移到 V1

要将 V0 交易构建器迁移到 V1，需要用 `useV1()` 和 `setTransactionConfig()` 取代 Compute Budget 指令。

### 迁移前的 V0 交易构建器

V0 交易构建器通过指令表达计算单元上限和价格。

```typescript {% title="transaction-v0.ts" %}
import { transactionBuilder } from '@metaplex-foundation/umi'
import {
  setComputeUnitLimit,
  setComputeUnitPrice,
  transferSol,
} from '@metaplex-foundation/mpl-toolbox'

await transactionBuilder()
  .add(setComputeUnitLimit(umi, { units: 600_000 }))
  .add(setComputeUnitPrice(umi, { microLamports: 1_000 }))
  .add(transferSol(umi, transferArgs))
  .sendAndConfirm(umi)
```

### 迁移后的 V1 交易构建器

V1 交易构建器在交易消息中表达计算单元上限和优先费总额。

```typescript {% title="transaction-v1.ts" %}
import { lamports, transactionBuilder } from '@metaplex-foundation/umi'
import { transferSol } from '@metaplex-foundation/mpl-toolbox'

await transactionBuilder()
  .add(transferSol(umi, transferArgs))
  .useV1()
  .setTransactionConfig({
    computeUnitLimit: 600_000,
    priorityFee: lamports(600),
  })
  .sendAndConfirm(umi)
```

优先费总额 `600` lamport 等于 `600,000 × 1,000 ÷ 1,000,000`。如果转换结果不是整数 lamport，请向上取整。

{% callout type="note" %}
`setTransactionConfig()` 会替换完整配置。请在同一次调用中包含所有自定义 V1 设置，而不要重复调用来分别设置各字段。
{% /callout %}

## 将 V1 设为应用默认版本

设置 `defaultTransactionVersion: 1` 后，除非构建器明确选择其他版本，否则所有交易构建器都将使用 V1。

```typescript {% title="umi.ts" %}
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'

const umi = createUmi('https://api.mainnet-beta.solana.com', {
  defaultTransactionVersion: 1,
})
```

此选项也会影响 Metaplex 程序库返回的构建器。调用 `useV0()` 的构建器仍会覆盖应用默认版本。

直接安装交易工厂的应用可以改为配置插件：

```typescript {% title="umi-with-custom-plugins.ts" %}
import { web3JsTransactionFactory } from '@metaplex-foundation/umi-transaction-factory-web3js'

umi.use(web3JsTransactionFactory({ defaultTransactionVersion: 1 }))
```

## 将直接创建交易迁移到 V1

直接调用 `umi.transactions.create()` 时，必须设置 `version: 1`，并提供明确的非零运行时上限。

```typescript {% title="create-transaction-v1.ts" %}
const transaction = umi.transactions.create({
  version: 1,
  blockhash: (await umi.rpc.getLatestBlockhash()).blockhash,
  instructions: [myInstruction],
  payer: umi.payer.publicKey,
  transactionConfig: {
    computeUnitLimit: 200_000,
    loadedAccountsDataSizeLimit: 64 * 1024 * 1024,
  },
})
```

对于省略的计算上限和已加载账户数据上限，`TransactionBuilder` 会提供与旧版等效的默认值。低级 `create()` 方法不会提供默认值；运行时会将省略的上限视为零。

## 配置 V1 交易上限

`TransactionV1Config` 控制计算量、账户数据、堆大小和优先费总额。

| 字段 | 含义 | 有效范围或行为 |
|-------|---------|-------------------------|
| `computeUnitLimit` | 最大计算单元数 | `0` 到 `1,400,000` 之间的整数 |
| `priorityFee` | 优先费总额 | `SolAmount`，通常使用 `lamports(...)` 创建 |
| `loadedAccountsDataSizeLimit` | 已加载账户数据的最大大小 | 最大 64 MiB |
| `heapSize` | 程序堆帧大小 | 32,768 到 262,144 字节，增量为 1,024 字节 |

省略这些字段时，构建器默认将 `computeUnitLimit` 设为 `min(200,000 × 指令数量, 1,400,000)`，并将 `loadedAccountsDataSizeLimit` 设为 64 MiB。

## 将使用 Address Lookup Table 的交易保留在 V0

需要 [Address Lookup Tables](/dev-tools/umi/toolbox/address-lookup-table) 的交易必须保留在 V0。

```typescript {% title="transaction-v0-with-lookup-table.ts" %}
const builder = transactionBuilder()
  .add(myInstruction)
  .useV0()
  .setAddressLookupTables([myLookupTable])
```

请勿仅为强制交易使用 V1 而移除 Address Lookup Table。应比较编译后的账户列表和序列化大小，然后使用满足交易要求的格式。

## 更新自定义 Umi 集成

升级到 Umi 1.6.0 时，自定义交易工厂和穷举式版本处理必须添加 V1 支持。

- 在自定义 `TransactionFactoryInterface` 实现上实现 `getDefaultVersion()`。
- 对穷举切换 `TransactionVersion` 的代码添加 `1` 分支。
- 对直接创建的 V0 `TransactionInput` 对象添加 `version: 0`，因为现在必须提供 V0 版本字段。
- 读取交易时检查 `transaction.message.version`；V1 消息包含 `transactionConfig`。

Umi 的 RPC 集成会请求 `maxSupportedTransactionVersion: 1`，因此 `umi.rpc.getTransaction()` 可以获取 V1 交易。

## 常见的 V1 迁移错误

Umi 会在发送交易前拒绝不兼容的构建器组合。

| 错误 | 原因 | 修复方法 |
|-------|-------|-----|
| `V1 transactions ignore ComputeBudget instructions. Set the compute budget with setTransactionConfig instead.` | V1 交易构建器包含 `setComputeUnitLimit`、`setComputeUnitPrice` 或其他 Compute Budget 指令 | 移除该指令并使用 `setTransactionConfig()` |
| `Address lookup tables are not supported by V1 transactions.` | V1 交易构建器包含一个或多个 Address Lookup Tables | 将构建器保留在 V0，或移除对查找表的需求 |
| `Transaction configs are only supported by V1 transactions.` | 旧版或 V0 交易构建器调用 `setTransactionConfig()` | 调用 `useV1()`，或在 V0 上使用 Compute Budget 指令 |
| 钱包拒绝交易或无法反序列化交易 | 钱包不支持交易版本 `1` | 在钱包添加 V1 支持前，使该钱包流程继续使用 V0 |
| 直接创建交易后因计算预算不足而失败 | `create()` 未收到 `computeUnitLimit` | 设置非零的 `transactionConfig.computeUnitLimit` |

## 注意事项

- 在 Umi 1.6.0 中，V1 为可选版本；为了向后兼容，默认版本仍为 V0。
- V1 于 2026 年 9 月 15 日在 Solana mainnet-beta 的 epoch 1035 中启用。
- 发送和模拟使用 base64 编码，支持大于 1,232 字节的 V1 交易。
- Umi 会在序列化前验证计算单元上限和堆大小。
- 实现与兼容性详情记录在 [metaplex-foundation/umi#216](https://github.com/metaplex-foundation/umi/pull/216) 中。

## 常见问题

### Umi 默认使用 V1 交易吗？

为了向后兼容，Umi 1.6.0 仍以 V0 为默认版本。请在交易构建器上调用 `useV1()`，或在创建 Umi 时设置 `defaultTransactionVersion: 1`。

### Umi V1 交易可以使用 Address Lookup Table 吗？

V1 交易不支持 Address Lookup Tables。任何需要 Address Lookup Table 的交易都应继续使用 V0。

### V1 交易可以包含 Compute Budget 程序指令吗？

Umi 会拒绝包含 Compute Budget 指令的 V1 交易构建器。请使用 `setTransactionConfig()` 设置计算单元上限、优先费总额、已加载账户数据大小上限或堆大小。

### V1 交易优先费是按每个计算单元计价吗？

`TransactionV1Config.priorityFee` 是以 `SolAmount` 表示的优先费总额，而不是每个计算单元的价格。将 micro-lamport 单价乘以计算单元上限，再除以 1,000,000，并向上取整为 lamport。

### 所有 Solana 钱包都支持 V1 交易吗？

交易版本 `1` 尚未得到所有钱包的支持。Umi 可以为钱包适配器序列化 V1 交易，但连接的钱包必须接受并签署该交易。
