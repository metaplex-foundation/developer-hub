---
title: Core Collections
metaTitle: Core Collections 概述 | Metaplex Core
description: Solana 上 Core Collections 的概述 — 如何对 Asset 进行分组、存储共享元数据以及应用合集级别的插件。
updated: '04-08-2026'
keywords:
  - NFT collection
  - Core Collection
  - mpl-core collection
  - group NFTs
  - collection metadata
about:
  - NFT collections
  - Collection management
proficiencyLevel: Beginner
faqs:
  - q: Collection 和 Asset 有什么区别？
    a: Collection 是将 Asset 组合在一起的容器。它有自己的元数据，但无法像 Asset 一样被拥有或转移。Asset 是用户拥有的实际 NFT。
  - q: 可以将现有的 Asset 添加到 Collection 吗？
    a: 可以，使用带有 newCollection 参数的 update 指令。Asset 的 Update Authority 必须有权限将其添加到目标 Collection。
  - q: NFT 需要 Collection 吗？
    a: 不需要。Asset 可以在没有 Collection 的情况下独立存在。但是，Collection 可以实现合集级别的版税设置、更易于发现以及批量操作。
  - q: 可以从 Collection 中移除 Asset 吗？
    a: 可以，使用 update 指令更改 Asset 的合集。需要对 Asset 和 Collection 都拥有相应的权限。
  - q: 删除 Collection 会发生什么？
    a: 包含 Asset 的 Collection 无法删除。请先移除所有 Asset，然后才能关闭 Collection 账户。
---

## Summary

**Core Collection** 是将相关 [Core Asset](/smart-contracts/core/what-is-an-asset) 组织在共享元数据和插件下的 Solana 账户。

- Collection 存储名称、URI 以及应用于所有成员 Asset 的可选插件
- Asset 在创建或更新时通过 `collection` 字段引用其所属 Collection
- 合集级别的插件（例如 [Royalties](/smart-contracts/core/plugins/royalties)）会传播到所有成员 Asset，除非在 Asset 级别进行了覆盖
- 创建 Collection 需要约 0.0015 SOL 的租金

**跳转到任务：** [创建 Collection](/smart-contracts/core/collections/create) · [获取 Collection](/smart-contracts/core/collections/fetch) · [更新 Collection](/smart-contracts/core/collections/update)

## 什么是 Collection？

Core Collection 是属于同一系列或集合的 Asset 组。要将 Asset 组合在一起，首先需要创建一个 Collection 账户，用于存储共享元数据，如合集名称和图片 URI。Collection 账户充当合集的封面，还可以持有合集范围内的插件。

Collection 账户存储和可访问的数据如下：

| 字段 | 描述 |
| --- | --- |
| key | 账户键标识符 |
| updateAuthority | 合集的管理者 |
| name | 合集名称 |
| uri | 合集链下元数据的 URI |
| numMinted | 合集中曾经铸造的 Asset 总数 |
| currentSize | 当前合集中的 Asset 数量 |

{% callout type="note" %}
Core Collection 仅对 Core Asset 进行分组。Token Metadata NFT 请使用 [mpl-token-metadata](https://developers.metaplex.com/token-metadata)，压缩 NFT 请使用 [Bubblegum](/smart-contracts/bubblegum)。
{% /callout %}

## Notes

- Asset 可以在没有 Collection 的情况下独立存在 — Collection 不是必需的
- 合集级别的插件会被成员 Asset 继承，除非 Asset 拥有同类型的自有插件进行覆盖
- `numMinted` 统计合集中曾经创建的所有 Asset 总数，`currentSize` 是实时数量
- 包含 Asset 的 Collection 无法关闭 — 请先移除所有 Asset

## Quick Reference

### 程序 ID

| 网络 | 地址 |
|---------|---------|
| Mainnet | `CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d` |
| Devnet | `CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d` |

### Collection 操作

| 操作 | 页面 | SDK 函数 |
|-----------|------|--------------|
| 创建 Collection | [创建 Collection](/smart-contracts/core/collections/create) | `createCollection` |
| 获取 Collection | [获取 Collection](/smart-contracts/core/collections/fetch) | `fetchCollection` |
| 更新 Collection 元数据 | [更新 Collection](/smart-contracts/core/collections/update) | `updateCollection` |
| 更新 Collection 插件 | [更新 Collection](/smart-contracts/core/collections/update) | `updateCollectionPlugin` |

### 费用明细

| 项目 | 费用 |
|------|------|
| Collection 账户租金 | 约 0.0015 SOL |
| 交易手续费 | 约 0.000005 SOL |
| **合计** | **约 0.002 SOL** |

## FAQ

### Collection 和 Asset 有什么区别？

Collection 是将 Asset 组合在一起的容器。它有自己的元数据（名称、图片），但无法像 Asset 一样被拥有或转移。Asset 是用户拥有的实际 NFT。

### 可以将现有的 Asset 添加到 Collection 吗？

可以，使用带有 `newCollection` 参数的 `update` 指令。Asset 的 Update Authority 必须有权限将其添加到目标 Collection。

### NFT 需要 Collection 吗？

不需要。Asset 可以在没有 Collection 的情况下独立存在。但是，Collection 可以实现合集级别的版税设置、更易于发现以及批量操作。

### 可以从 Collection 中移除 Asset 吗？

可以，使用 `update` 指令更改 Asset 的合集。需要对 Asset 和 Collection 都拥有相应的权限。

### 删除 Collection 会发生什么？

包含 Asset 的 Collection 无法删除。请先移除所有 Asset，然后才能关闭 Collection 账户。

## Glossary

| 术语 | 定义 |
|------|------------|
| **Collection** | 将相关 Asset 组织在共享元数据下的 Core 账户 |
| **Update Authority** | 可以修改 Collection 元数据和插件的账户 |
| **numMinted** | 追踪合集中曾经创建的 Asset 总数的计数器 |
| **currentSize** | 当前合集中的 Asset 数量 |
| **Collection Plugin** | 附加到 Collection 上可能应用于所有成员 Asset 的插件 |
| **URI** | 指向 Collection 链下 JSON 元数据的 URL |
