---
title: 插件概述
metaTitle: Core 插件概述 | Metaplex Core
description: 了解 Metaplex Core 插件 - 为 NFT Asset 和 Collection 添加版税、冻结、销毁和链上属性等行为的模块化扩展。
updated: '01-31-2026'
keywords:
  - Core plugins
  - NFT plugins
  - plugin system
  - royalties plugin
  - freeze plugin
about:
  - Plugin architecture
  - NFT extensions
  - Lifecycle events
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
faqs:
  - q: Asset 创建后可以添加插件吗？
    a: 可以，Permanent 插件除外。Owner Managed 插件需要所有者签名；Authority Managed 插件需要 update authority 签名。
  - q: Asset 转移时插件会怎样？
    a: Owner Managed 插件（Transfer、Freeze、Burn Delegate）在转移时权限会自动撤销。Authority Managed 和 Permanent 插件会保持不变。
  - q: Asset 可以拥有与其 Collection 相同的插件吗？
    a: 可以。当两者都有相同的插件类型时，Asset 级插件优先于 Collection 级插件。
  - q: 如何删除插件？
    a: 使用 removePlugin 指令。只有插件权限者可以删除它。
  - q: 可以创建自定义插件吗？
    a: 不可以。只支持内置插件。插件系统不能由第三方扩展。
  - q: 插件需要额外的 SOL 吗？
    a: 添加插件会增加账户大小，从而增加租金。大多数插件约需 0.001 SOL，但数据存储插件（如 AppData 或 Attributes）可能根据存储的数据量花费更多。
---
本页解释 **Core 插件系统** - 为 Core Asset 和 Collection 添加行为和数据存储的模块化扩展。插件挂钩到生命周期事件以执行规则或存储链上数据。 {% .lead %}
{% callout title="您将学到" %}
- 什么是插件以及它们如何工作
- 插件类型：Owner Managed、Authority Managed、Permanent
- 插件如何影响生命周期事件（创建、转移、销毁）
- Asset 和 Collection 之间的插件优先级
{% /callout %}
## 摘要
**插件**是为 Core Asset 或 Collection 添加功能的链上扩展。它们可以存储数据（如属性）、执行规则（如版税）或委托权限（如冻结/转移权限）。
- **Owner Managed**：添加需要所有者签名（Transfer、Freeze、Burn Delegate）
- **Authority Managed**：可由 update authority 添加（Royalties、Attributes、Update Delegate）
- **Permanent**：只能在创建时添加（Permanent Transfer/Freeze/Burn Delegate）
## 范围外
创建自定义插件（只支持内置插件）、Token Metadata 插件（不同的系统）和链下插件数据存储。
## 快速开始
**跳转至：** [插件类型](#插件类型) · [插件表](#插件表) · [生命周期事件](#插件和生命周期事件) · [添加插件](/zh/smart-contracts/core/plugins/adding-plugins)
1. 根据用例选择插件（版税、冻结、属性等）
2. 使用 `addPlugin()` 或在 Asset/Collection 创建时添加插件
3. 插件自动挂钩到生命周期事件
4. 通过 DAS 或链上 fetch 查询插件数据
## 生命周期
在 Core Asset 的生命周期中，可以触发多个事件：
- 创建
- 转移
- 更新
- 销毁
- 添加插件
- 批准权限插件
- 移除权限插件
生命周期事件以各种方式影响 Asset，从创建到钱包之间的转移，一直到 Asset 的销毁。附加在 Asset 级别或 Collection 级别的插件将在这些生命周期事件期间经过验证过程，以 `approve`、`reject` 或 `force approve` 事件的执行。
## 什么是插件？
插件就像 NFT 的链上应用程序，可以存储数据或为 Asset 提供额外功能。
## 插件类型
### Owner Managed 插件
Owner Managed 插件是只有在 Asset 所有者的签名存在于交易中时才能添加到 Core Asset 的插件。
Owner Managed 插件包括但不限于：
- [Transfer Delegate](/zh/smart-contracts/core/plugins/transfer-delegate)（市场、游戏）
- [Freeze Delegate](/zh/smart-contracts/core/plugins/freeze-delegate)（市场、质押、游戏）
- [Burn Delegate](/zh/smart-contracts/core/plugins/burn-delegate)（游戏）
如果 Owner Managed 插件在没有设置权限的情况下添加到 Asset/Collection，权限类型将默认为 `owner` 类型。
Owner Managed 插件的权限在转移时会自动撤销。
### Authority Managed 插件
Authority Managed 插件是 MPL Core Asset 或 Core Collection 的权限者可以随时添加和更新的插件。
Authority Managed 插件包括但不限于：
- [Royalties](/zh/smart-contracts/core/plugins/royalties)
- [Update Delegate](/zh/smart-contracts/core/plugins/update-delegate)
- [Attribute](/zh/smart-contracts/core/plugins/attribute)
如果 Authority Managed 插件在没有权限参数的情况下添加到 Asset/Collection，插件将默认为 `update authority` 类型的权限。
### Permanent 插件
**Permanent 插件是只能在创建时添加到 Core Asset 的插件。** 如果 Asset 已经存在，则无法添加 Permanent 插件。
Permanent 插件包括但不限于：
- [Permanent Transfer Delegate](/zh/smart-contracts/core/plugins/permanent-transfer-delegate)
- [Permanent Freeze Delegate](/zh/smart-contracts/core/plugins/permanent-freeze-delegate)
- [Permanent Burn Delegate](/zh/smart-contracts/core/plugins/permanent-burn-delegate)
如果 Permanent 插件在没有设置权限的情况下添加到 Asset/Collection，权限类型将默认为 `update authority` 类型。
## Collection 插件
Collection 插件是在 Collection 级别添加的插件，可以产生收藏范围的效果。这对版税特别有用，因为您可以将 [Royalties 插件](/zh/smart-contracts/core/plugins/royalties) 分配给 Collection Asset，该 Collection 中的所有 Asset 现在都将引用该插件。
Collection 只能访问 `Permanent 插件` 和 `Authority Managed 插件`。
## 插件优先级
如果 MPL Core Asset 和 MPL Core Collection Asset 都共享相同的插件类型，则 Asset 级插件及其数据将优先于 Collection 级插件。
这可以以创造性的方式使用，例如为 Asset 收藏在不同级别设置版税。
- Collection Asset 分配了 2% 的 Royalties 插件
- 收藏中的超级稀有 MPL Core Asset 分配了 5% 的 Royalty 插件
在上述情况下，来自收藏的普通 MPL Core Asset 销售将保留 2% 的版税，而超级稀有 MPL Core Asset 将在销售时保留 5% 的版税，因为它有自己的 Royalties 插件，优先于 Collection Asset Royalties 插件。
## 插件表
| 插件                                                                   | Owner Managed | Authority Managed | Permanent |
| ------------------------------------------------------------------------ | ------------- | ----------------- | --------- |
| [Transfer Delegate](/zh/smart-contracts/core/plugins/transfer-delegate)                     | ✅            |                   |           |
| [Freeze Delegate](/zh/smart-contracts/core/plugins/freeze-delegate)                         | ✅            |                   |           |
| [Burn Delegate](/zh/smart-contracts/core/plugins/burn-delegate)                             | ✅            |                   |           |
| [Royalties](/zh/smart-contracts/core/plugins/royalties)                                     |               | ✅                |           |
| [Update Delegate](/zh/smart-contracts/core/plugins/update-delegate)                         |               | ✅                |           |
| [Attribute](/zh/smart-contracts/core/plugins/attribute)                                     |               | ✅                |           |
| [Permanent Transfer Delegate](/zh/smart-contracts/core/plugins/permanent-transfer-delegate) |               |                   | ✅        |
| [Permanent Freeze Delegate](/zh/smart-contracts/core/plugins/permanent-freeze-delegate)     |               |                   | ✅        |
| [Permanent Burn Delegate](/zh/smart-contracts/core/plugins/permanent-burn-delegate)         |               |                   | ✅        |
## 插件和生命周期事件
MPL Core 中的插件能够影响某些生命周期操作的结果，例如创建、转移、销毁和更新。
每个插件都能够将操作 `reject`、`approve` 或 `force approve` 到期望的结果。
在生命周期事件期间，操作将按顺序检查和验证预定义的插件列表。
如果插件条件得到验证，生命周期通过并继续其操作。
如果插件验证失败，则生命周期将被停止并拒绝。
插件验证的规则遵循以下条件层次结构：
- 如果有 force approve，则始终 approve
- 否则如果有任何 reject，则 reject
- 否则如果有任何 approve，则 approve
- 否则 reject
`force approve` 验证仅在第一方插件和 `Permanent Delegate` 插件上可用。
### Force Approve
Force approve 是检查插件验证时进行的第一个检查。目前会进行 force approve 验证的插件是：
- **Permanent Transfer**
- **Permanent Burn**
- **Permanent Freeze**
这些插件将优先于其非永久对应物和其他插件执行其操作。
#### 示例
如果您有一个在 Asset 级别使用 Freeze Plugin 冻结的 Asset，同时 Asset 上有 **Permanent Burn** 插件，即使 Asset 被冻结，通过 **Permanent Burn** 插件调用的销毁程序仍将执行，因为永久插件的 `forceApprove` 特性。
### 创建
{% totem %}
| 插件    | 操作     | 条件 |
| --------- | ---------- | ---------- |
| Royalties | 可拒绝 | Ruleset    |
{% /totem %}
### 更新
{% totem %}
更新目前没有插件条件或验证。
{% /totem %}
### 转移
{% totem %}
| 插件                      | 操作      | 条件  |
| --------------------------- | ----------- | ----------- |
| Royalties                   | 可拒绝  | Ruleset     |
| Freeze Delegate             | 可拒绝  | isFrozen    |
| Transfer Delegate           | 可批准 | isAuthority |
| Permanent Freeze Delegate   | 可拒绝  | isFrozen    |
| Permanent Transfer Delegate | 可批准 | isAuthority |
{% /totem %}
### 销毁
{% totem %}
| 插件                    | 操作      | 条件  |
| ------------------------- | ----------- | ----------- |
| Freeze Delegate           | 可拒绝  | isFrozen    |
| Burn Delegate             | 可拒绝  | isAuthority |
| Permanent Freeze Delegate | 可拒绝  | isFrozen    |
| Permanent Burn Delegate   | 可批准 | isAuthority |
{% /totem %}
### 添加插件
{% totem %}
| 插件          | 操作      | 条件  |
| --------------- | ----------- | ----------- |
| Royalties       | 可拒绝  | Ruleset     |
| Update Delegate | 可批准 | isAuthority |
{% /totem %}
### 移除插件
{% totem %}
| 插件          | 操作      | 条件  |
| --------------- | ----------- | ----------- |
| Royalties       | 可拒绝  | Ruleset     |
| Update Delegate | 可批准 | isAuthority |
{% /totem %}
### 批准插件权限
{% totem %}
批准目前没有插件条件或验证。
{% /totem %}
### 撤销权限插件
{% totem %}
撤销目前没有插件条件或验证。
{% /totem %}
## 常见用例
| 用例 | 推荐插件 |
|----------|-------------------|
| 强制执行创作者版税 | [Royalties](/zh/smart-contracts/core/plugins/royalties) |
| 无托管质押 | [Freeze Delegate](/zh/smart-contracts/core/plugins/freeze-delegate) |
| 市场列表 | [Freeze Delegate](/zh/smart-contracts/core/plugins/freeze-delegate) + [Transfer Delegate](/zh/smart-contracts/core/plugins/transfer-delegate) |
| 链上游戏统计 | [Attributes](/zh/smart-contracts/core/plugins/attribute) |
| 允许第三方销毁 | [Burn Delegate](/zh/smart-contracts/core/plugins/burn-delegate) |
| 永久质押程序 | [Permanent Freeze Delegate](/zh/smart-contracts/core/plugins/permanent-freeze-delegate) |
## FAQ
### Asset 创建后可以添加插件吗？
可以，Permanent 插件除外。Owner Managed 插件需要所有者签名；Authority Managed 插件需要 update authority 签名。
### Asset 转移时插件会怎样？
Owner Managed 插件（Transfer、Freeze、Burn Delegate）在转移时权限会自动撤销。Authority Managed 和 Permanent 插件会保持不变。
### Asset 可以拥有与其 Collection 相同的插件吗？
可以。当两者都有相同的插件类型时，Asset 级插件优先于 Collection 级插件。
### 如何删除插件？
使用 `removePlugin` 指令。只有插件权限者可以删除它。参见[移除插件](/zh/smart-contracts/core/plugins/removing-plugins)。
### 可以创建自定义插件吗？
不可以。只支持内置插件。插件系统不能由第三方扩展。
### 插件需要额外的 SOL 吗？
添加插件会增加账户大小，从而增加租金。大多数插件约需 0.001 SOL，但数据存储插件（如 AppData 或 Attributes）可能根据存储的数据量花费更多。
## 术语表
| 术语 | 定义 |
|------|------------|
| **Plugin** | 为 Asset/Collection 添加行为或数据的模块化扩展 |
| **Owner Managed** | 需要所有者签名才能添加的插件类型 |
| **Authority Managed** | update authority 可以添加的插件类型 |
| **Permanent** | 只能在创建时添加的插件类型 |
| **Lifecycle Event** | 插件可以验证的操作（创建、转移、销毁） |
| **Force Approve** | 覆盖其他拒绝的 Permanent 插件验证 |
| **Plugin Authority** | 被授权更新或删除插件的账户 |
