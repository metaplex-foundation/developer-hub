---
title: 外部插件
metaTitle: 外部插件 | Metaplex Core
description: 使用Oracle和AppData插件通过外部程序扩展Core NFT。添加自定义验证逻辑并在资产上存储任意数据。
---

**外部插件**将Core Assets连接到外部程序以实现高级功能。使用Oracle插件实现自定义验证逻辑，使用AppData插件存储第三方应用可以读写的任意数据。 {% .lead %}

{% callout title="学习内容" %}

- 了解外部插件架构（适配器 + 插件）
- 配置生命周期检查（create、transfer、update、burn）
- 设置用于安全数据存储的Data Authority
- 在Oracle和AppData插件之间选择

{% /callout %}

## 概述

外部插件使用外部程序功能扩展Core Assets。它们由两部分组成：附加到资产/集合的**插件适配器**，以及提供数据和验证的**外部插件**（Oracle账户或AppData存储）。

- 权限管理插件（更新权限控制）
- 支持生命周期验证：批准、拒绝或监听
- Data Authority控制谁可以写入插件数据
- 与资产和集合一起工作

## 范围外

内置插件（参见[插件概述](/zh/smart-contracts/core/plugins)）、创建Oracle程序（参见[Oracle指南](/zh/smart-contracts/core/guides/oracle-plugin-example)）和Token Metadata扩展。

## 快速开始

**跳转到：** [Oracle插件](/zh/smart-contracts/core/external-plugins/oracle) · [AppData插件](/zh/smart-contracts/core/external-plugins/app-data) · [添加外部插件](/zh/smart-contracts/core/external-plugins/adding-external-plugins)

1. 选择插件类型：Oracle（验证）或AppData（数据存储）
2. 创建/部署外部账户（Oracle）或配置Data Authority（AppData）
3. 将插件适配器添加到您的资产或集合

## 什么是外部插件？

外部插件是[权限管理的](/zh/smart-contracts/core/plugins#authority-managed-plugins)，由2部分组成：**适配器**和**插件**。**插件适配器**被分配给资产/集合，允许从外部插件传递数据和验证。外部插件为**插件适配器**提供数据和验证。

## 生命周期检查

每个外部插件都具有将生命周期检查分配给生命周期事件的能力，影响正在发生的生命周期事件的行为。可用的生命周期检查有：

- Create
- Transfer
- Update
- Burn

每个生命周期事件可以分配以下检查：

- Can Listen
- Can Reject
- Can Approve

### Can Listen

一种web3类型的webhook，在生命周期事件发生时提醒插件。这对于跟踪数据或基于已发生的事件执行另一个任务很有用。

### Can Reject

插件有能力拒绝生命周期事件的操作。

### Can Approve

插件有能力批准生命周期事件。

## Data Authority

外部插件可能有一个数据区域，项目可以在其中安全地存储该特定插件的数据。

外部插件的Data Authority是唯一允许写入外部插件数据部分的权限。除非更新权限同时也是Data Authority，否则更新权限没有权限。

## 插件

### Oracle插件

Oracle插件旨在简化web 2.0-3.0工作流程。Oracle插件可以访问MPL Core Asset外部的链上Oracle账户，该账户可以拒绝权限设置的生命周期事件的使用。外部Oracle账户也可以随时更新以更改生命周期事件的授权行为，从而实现动态体验。

您可以在[这里](/zh/smart-contracts/core/external-plugins/oracle)阅读更多关于Oracle插件的信息。

### AppData插件

AppData插件在资产上提供安全的分区数据存储。每个AppData插件都有一个Data Authority，独占控制对该数据部分的写入。对于存储用户数据、游戏状态或应用程序特定元数据的第三方应用很有用。

您可以在[这里](/zh/smart-contracts/core/external-plugins/app-data)阅读更多关于AppData插件的信息。

## 外部插件 vs 内置插件

| 功能 | 外部插件 | 内置插件 |
|---------|------------------|------------------|
| 数据存储 | 外部账户或资产内 | 仅资产内 |
| 自定义验证 | ✅ 完全控制 | ❌ 预定义行为 |
| 动态更新 | ✅ 更新外部账户 | ✅ 更新插件 |
| 复杂性 | 较高（外部程序） | 较低（内置） |
| 用例 | 自定义逻辑、第三方应用 | 标准NFT功能 |

## 常见问题

### 什么时候应该使用外部插件vs内置插件？

当您需要自定义验证逻辑（Oracle）或第三方数据存储（AppData）时，使用外部插件。对于冻结、版税或属性等标准NFT功能，使用内置插件。

### 外部插件可以拒绝转移吗？

可以。Oracle插件可以根据外部账户状态拒绝生命周期事件（create、transfer、update、burn）。这使得基于时间的限制、基于价格的规则或任何自定义逻辑成为可能。

### 谁可以写入AppData？

只有Data Authority可以写入AppData插件。这与插件权限分开，为第三方应用程序提供安全的分区存储。

### 我可以在一个资产上拥有多个外部插件吗？

可以。您可以向单个资产添加多个Oracle或AppData插件，每个都有不同的配置和权限。

### 外部插件会被DAS索引吗？

是的。具有JSON或MsgPack模式的AppData会被DAS自动索引以便于查询。

## 术语表

| 术语 | 定义 |
|------|------------|
| **Plugin Adapter** | 附加到资产并连接到外部插件的链上组件 |
| **External Plugin** | 提供功能的外部账户（Oracle）或数据存储（AppData） |
| **Lifecycle Check** | 可以批准、拒绝或监听事件的验证 |
| **Data Authority** | 具有对AppData独占写入权限的地址 |
| **Oracle Account** | 存储验证结果的外部账户 |

## 相关页面

- [Oracle插件](/zh/smart-contracts/core/external-plugins/oracle) - 自定义验证逻辑
- [AppData插件](/zh/smart-contracts/core/external-plugins/app-data) - 第三方数据存储
- [添加外部插件](/zh/smart-contracts/core/external-plugins/adding-external-plugins) - 代码示例
- [内置插件](/zh/smart-contracts/core/plugins) - 标准插件功能

---

*由Metaplex Foundation维护 · 2026年1月最后验证 · 适用于@metaplex-foundation/mpl-core*
