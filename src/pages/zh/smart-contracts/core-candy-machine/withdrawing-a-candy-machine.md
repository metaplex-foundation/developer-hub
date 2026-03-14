---
title: 提取 Core Candy Machine
metaTitle: 提取 Core Candy Machine | Core Candy Machine
description: 如何提取并永久删除 Core Candy Machine 以收回 Solana 上的链上存储租金。
keywords:
  - core candy machine
  - withdraw candy machine
  - delete candy machine
  - deleteCandyMachine
  - reclaim rent
  - Solana rent
  - candy machine cleanup
  - mpl-core-candy-machine
  - on-chain storage
about:
  - Withdrawing and deleting a Core Candy Machine
  - Reclaiming Solana rent from Candy Machine accounts
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '03-10-2026'
updated: '03-10-2026'
---

## 概述

`deleteCandyMachine` 指令从 Solana 区块链永久删除 [Core Candy Machine](/zh/smart-contracts/core-candy-machine)，并将所有存储的免租 SOL 返还给权限钱包。 {% .lead %}

- 删除 Candy Machine 账户数据并将全部租金押金收回给权限方
- 此操作不可逆——提取后 Candy Machine 无法恢复或复原
- 只有 Candy Machine 权限方可以执行此指令

## 提取 Core Candy Machine 账户

`deleteCandyMachine` 函数关闭链上 Candy Machine 账户，擦除所有存储数据（配置行、设置、物品条目），并将免租 SOL 余额转回权限钱包。

{% callout %}
此操作是不可逆的，因此只有在 100% 完成铸造过程时才提取您的 Core Candy Machine。您的 Core Candy Machine 无法恢复或复原。
{% /callout %}

{% dialect-switcher title="提取 Core Candy Machine" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { deleteCandyMachine } from '@metaplex-foundation/mpl-core-candy-machine'
import { publicKey } from '@metaplex-foundation/umi'

const candyMachineId = '11111111111111111111111111111111'

await deleteCandyMachine(umi, {
  candyMachine: publicKey(candyMachineId),
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## 注意事项

- 此操作不可逆。一旦提取，Candy Machine 账户及其所有数据将从区块链上永久删除。
- 提取会收回创建 Candy Machine 时分配的全部免租 SOL 押金。配置行更多的大型集合将返还更多 SOL。
- 仅在所有铸造活动完成且不再需要 Candy Machine 用于任何目的后才进行提取。
- 调用者必须是 Candy Machine 权限方；其他钱包无法执行删除指令。
- 如果 Candy Guard 与 Candy Machine 关联，必须单独处理——删除 Candy Machine 不会自动关闭 Candy Guard 账户。

