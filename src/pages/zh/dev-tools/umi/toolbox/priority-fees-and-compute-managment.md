---
title: 优先费和计算管理
metaTitle: 优先费和计算管理 | Toolbox
description: 如何在 Umi 中使用优先费和 Compute Budget 程序。
---

Compute Budget 程序允许我们设置自定义的计算单元限制和价格。您可以在 [Solana 官方文档](https://docs.solana.com/developing/programming-model/runtime#compute-budget)中阅读有关此程序的更多信息。

## 设置计算单元限制

此指令允许您为交易设置自定义的计算单元限制。

```ts
import { transactionBuilder } from '@metaplex-foundation/umi'
import { setComputeUnitLimit } from '@metaplex-foundation/mpl-toolbox'

await transactionBuilder()
  .add(setComputeUnitLimit(umi, { units: 600_000 })) // 设置计算单元限制。
  .add(...) // 此处添加任何指令。
  .sendAndConfirm(umi)
```

## 设置计算单元价格 / 优先费

此指令允许您为交易设置每个计算单元的自定义价格

```ts
import { transactionBuilder } from '@metaplex-foundation/umi'
import { setComputeUnitPrice } from '@metaplex-foundation/mpl-toolbox'

await transactionBuilder()
  .add(setComputeUnitPrice(umi, { microLamports: 1 })) // 以 micro-lamports 为单位设置每个计算单元的价格。
  .add(...) // 此处添加任何指令。
  .sendAndConfirm(umi)
```

{% callout title="如何计算单位和 microLamports 的指南" type="note" %}
为了能够为 `microLamports` 和 `units` 选择适当的数字，创建了一个[小指南](/zh/dev-tools/umi/guides/optimal-transactions-with-compute-units-and-priority-fees)，介绍了可用于计算的不同 RPC 调用。
{% /callout %}
