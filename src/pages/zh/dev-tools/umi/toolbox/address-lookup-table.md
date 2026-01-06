---
title: 地址查找表
metaTitle: 地址查找表 | Toolbox
description: 如何在 Umi 中使用地址查找表。
---

SPL Address Lookup Table 程序可用于通过在交易中使用自定义查找表（又称 **LUT** 或 **ALT**）来减少交易大小。此程序允许您创建和扩展 LUT。您可以在 [Solana 官方文档](https://docs.solana.com/developing/lookup-tables)中了解有关此程序的更多信息。

## 创建空 LUT

此指令允许您创建一个空的地址查找表（LUT）账户。

```ts
import { createEmptyLut } from '@metaplex-foundation/mpl-toolbox'

const recentSlot = await umi.rpc.getSlot({ commitment: 'finalized' })

await createEmptyLut(umi, {
  recentSlot,
  authority,
}).sendAndConfirm(umi)
```

## 扩展 LUT

此指令使您能够向现有 LUT 账户添加新地址。

```ts
import { findAddressLookupTablePda, extendLut } from '@metaplex-foundation/mpl-toolbox'

// 用于创建 LUT 的授权者和槽位。
const lutAddress = findAddressLookupTablePda(umi, { authority, recentSlot })

await extendLut(umi, {
  authority,
  address: lutAddress, // LUT 的地址。
  addresses: [addressA, addressB], // 要添加到 LUT 的地址。
}).sendAndConfirm(umi)
```

## 创建带地址的 LUT

此辅助方法通过将创建空 LUT 和使用给定地址扩展它组合到单个交易中，简化了创建带有初始地址的 LUT 的过程。

```ts
import { createLut } from '@metaplex-foundation/mpl-toolbox'

const recentSlot = await umi.rpc.getSlot({ commitment: 'finalized' })

await createLut(umi, {
  authority,
  recentSlot,
  addresses: [addressA, addressB],
}).sendAndConfirm(umi)
```

## 为交易构建器创建 LUT

此辅助方法专门用于为给定的交易构建器创建 LUT。

```ts
import { createLutForTransactionBuilder } from '@metaplex-foundation/mpl-toolbox'

// 1. 获取给定交易构建器的 LUT 构建器和 LUT 账户。
const recentSlot = await umi.rpc.getSlot({ commitment: 'finalized' })

const [createLutBuilders, lutAccounts] = createLutForTransactionBuilder(
  umi,
  baseBuilder,
  recentSlot
)

// 2. 创建 LUT。
for (const createLutBuilder of createLutBuilders) {
  await createLutBuilder.sendAndConfirm(umi)
}

// 3. 在基础交易构建器中使用 LUT。
await baseBuilder.setAddressLookupTables(lutAccounts).sendAndConfirm(umi)
```

## 冻结 LUT

此指令允许您冻结 LUT，使其不可变。

```ts
import { findAddressLookupTablePda, freezeLut } from '@metaplex-foundation/mpl-toolbox'

// 用于创建 LUT 的授权者和槽位。
const lutAddress = findAddressLookupTablePda(umi, { authority, recentSlot })

await freezeLut(umi, {
  authority,
  address: lutAddress,
}).sendAndConfirm(umi)
```

## 停用 LUT

此指令将 LUT 置于"停用"期，之后才能关闭它。

**注意**：停用的 LUT 不能在新交易中使用，但仍保留其数据。

```ts
import { findAddressLookupTablePda, deactivateLut } from '@metaplex-foundation/mpl-toolbox'

// 用于创建 LUT 的授权者和槽位。
const lutAddress = findAddressLookupTablePda(umi, { authority, recentSlot })

await deactivateLut(umi, {
  authority,
  address: lutAddress,
}).sendAndConfirm(umi)
```

## 关闭 LUT

此指令在 LUT 账户停用一段时间后永久关闭它。

```ts
import { findAddressLookupTablePda, closeLut } from '@metaplex-foundation/mpl-toolbox'

// 用于创建 LUT 的授权者和槽位。
const lutAddress = findAddressLookupTablePda(umi, { authority, recentSlot })

await closeLut(umi, {
  authority,
  address: lutAddress,
}).sendAndConfirm(umi)
```
