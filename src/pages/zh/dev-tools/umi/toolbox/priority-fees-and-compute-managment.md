---
title: 优先费与计算管理
metaTitle: 优先费与计算管理 | Toolbox
description: 为 Umi V1 和 V0 交易配置计算单元上限和优先费。
keywords:
  - Umi priority fees
  - Umi compute units
  - TransactionV1Config
  - Compute Budget Program
about:
  - Umi
  - Solana Transaction Fees
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '09-04-2024'
updated: '09-21-2026'
---

## 总结

使用 `setTransactionConfig()` 配置 V1 交易的计算单元和优先费。

- V1 使用 `computeUnitLimit` 和优先费总额 `priorityFee`。
- Umi V1 交易构建器会拒绝 Compute Budget 程序指令。
- V0 使用 `setComputeUnitLimit` 和 `setComputeUnitPrice`。
- 对于以每个计算单元的 micro-lamport 数量表示的优先费估算值，必须先转换为总 lamport 数，才能用于 V1。

Umi V1 交易将计算上限和优先费总额存储在交易消息中，而 V0 交易使用 Compute Budget 程序指令。

## 配置 V1 计算单元和优先费

V1 交易使用 `setTransactionConfig()` 配置计算单元上限和优先费总额。

```ts {% title="V1 compute configuration" %}
import { lamports, transactionBuilder } from '@metaplex-foundation/umi'

await transactionBuilder()
  .add(myInstruction)
  .useV1()
  .setTransactionConfig({
    computeUnitLimit: 600_000,
    priorityFee: lamports(600),
  })
  .sendAndConfirm(umi)
```

`priorityFee` 是费用总额，而不是每个计算单元的价格。当单价为 1,000 micro-lamport、上限为 600,000 个计算单元时，总额为 `600,000 × 1,000 ÷ 1,000,000 = 600` lamport。

{% callout type="warning" %}
请勿向 V1 交易构建器添加 `setComputeUnitLimit` 或 `setComputeUnitPrice` 指令。Umi 会拒绝 V1 交易中的 Compute Budget 指令。
{% /callout %}

## 配置 V0 计算单元和优先费

V0 交易继续使用 `@metaplex-foundation/mpl-toolbox` 中的 Compute Budget 程序指令。

```ts {% title="V0 compute configuration" %}
import { transactionBuilder } from '@metaplex-foundation/umi'
import {
  setComputeUnitLimit,
  setComputeUnitPrice,
} from '@metaplex-foundation/mpl-toolbox'

await transactionBuilder()
  .add(setComputeUnitLimit(umi, { units: 600_000 }))
  .add(setComputeUnitPrice(umi, { microLamports: 1_000 }))
  .add(myInstruction)
  .useV0()
  .sendAndConfirm(umi)
```

当交易需要 [Address Lookup Table](/dev-tools/umi/toolbox/address-lookup-table)，或连接的钱包不支持 V1 交易时，请使用 V0。

## 注意事项

- 使用 `useV1()` 和 `setTransactionConfig()` 需要 Umi 1.6.0 或更高版本。
- V1 计算单元上限不能超过 1,400,000。
- 请参阅[优化交易落地](/dev-tools/umi/guides/optimal-transactions-with-compute-units-and-priority-fees)，了解如何估算计算单元和费用。
- 请参阅[从 V0 迁移到 V1 交易](/dev-tools/umi/guides/migrate-to-transaction-v1)，了解所有兼容性要求。
