---
title: 获取 Core Candy Machine
metaTitle: 获取 Core Candy Machine | Core Candy Machine
description: 如何使用 mpl-core-candy-machine SDK 从 Solana 区块链获取 Core Candy Machine 账户的链上数据。
keywords:
  - core candy machine
  - fetch candy machine
  - fetchCandyMachine
  - Solana blockchain
  - on-chain data
  - candy machine account
  - mpl-core-candy-machine
  - UMI SDK
  - candy machine items
  - safeFetchCandyGuard
about:
  - Fetching Core Candy Machine account data
  - Reading on-chain Candy Machine state with UMI
proficiencyLevel: Beginner
programmingLanguage:
  - JavaScript
  - TypeScript
created: '03-10-2026'
updated: '03-10-2026'
---

## 概述

`fetchCandyMachine` 函数检索 [Core Candy Machine](/zh/smart-contracts/core-candy-machine) 的完整链上账户数据，包括其配置、权限和已加载的物品。 {% .lead %}

- 返回完整的 Candy Machine 账户状态，包括物品数量、已铸造数量和所有已加载的配置行条目
- 仅需要 Candy Machine 公钥和配置了 `mplCoreCandyMachine` 插件的 [UMI](/zh/dev-tools/umi) 实例
- 守卫配置存储在单独的账户中，必须使用 `safeFetchCandyGuard` 独立获取

## 获取 Core Candy Machine 账户数据

`fetchCandyMachine` 函数从 Solana 区块链读取完整的 Candy Machine 账户，并将其反序列化为包含所有配置字段、已加载物品和当前铸造进度的类型化对象。

{% dialect-switcher title="获取 Core Candy Machine" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { fetchCandyMachine, mplCandyMachine as mplCoreCandyMachine } from "@metaplex-foundation/mpl-core-candy-machine";
import { publicKey } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";

const mainnet = "https://api.mainnet-beta.solana.com"
const devnet = "https://api.devnet.solana.com"

const umi = createUmi(mainnet)
.use(mplCoreCandyMachine())

const candyMachineId = "11111111111111111111111111111111"

const candyMachine = await fetchCandyMachine( umi, publicKey(candyMachineId));

console.log({ candyMachine });
```

{% /dialect %}
{% /dialect-switcher %}

## 注意事项

- 返回的对象包含已加载配置行物品的完整列表、物品数量、已铸造数量和所有 Candy Machine 设置。
- 守卫配置存储在单独的 Candy Guard 账户中。使用 `safeFetchCandyGuard` 获取给定 Candy Machine 的守卫设置。
- 将占位符公钥（`11111111111111111111111111111111`）替换为您实际的 Candy Machine 地址。
- 在主网使用时，考虑使用专用 RPC 提供商而不是公共 `api.mainnet-beta.solana.com` 端点，以避免速率限制。

