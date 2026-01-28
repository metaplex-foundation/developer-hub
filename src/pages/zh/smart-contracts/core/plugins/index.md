---
title: Plugin 概述
metaTitle: Core Plugin 概述 | Metaplex Core
description: 了解 Metaplex Core Plugin - 为 NFT Asset 和 Collection 添加版税、冻结、销毁和链上属性等行为的模块化扩展。
---

本页介绍 **Core Plugin 系统** - 为 Core Asset 和 Collection 添加行为和数据存储的模块化扩展。Plugin 挂钩到生命周期事件以强制执行规则或存储链上数据。 {% .lead %}

{% callout title="您将学到" %}

- 什么是 Plugin 以及它们如何工作
- Plugin 类型：Owner Managed、Authority Managed、Permanent
- Plugin 如何影响生命周期事件（创建、转移、销毁）
- Asset 和 Collection 之间的 Plugin 优先级

{% /callout %}

## 概要

**Plugin** 是为 Core Asset 或 Collection 添加功能的链上扩展。它们可以存储数据（如属性）、强制执行规则（如版税）或委托权限（如冻结/转移权限）。

- **Owner Managed**：需要所有者签名才能添加（Transfer、Freeze、Burn Delegate）
- **Authority Managed**：可由更新权限添加（Royalties、Attributes、Update Delegate）
- **Permanent**：只能在创建时添加（Permanent Transfer/Freeze/Burn Delegate）

## 不在范围内

创建自定义 Plugin（仅支持内置 Plugin）、Token Metadata Plugin（不同的系统）以及链下 Plugin 数据存储。

## 快速开始

**跳转至：** [Plugin 类型](#插件类型) · [Plugin 表格](#插件表) · [生命周期事件](#插件和生命周期事件) · [添加 Plugin](/zh/smart-contracts/core/plugins/adding-plugins)

1. 根据您的用例选择 Plugin（版税、冻结、属性等）
2. 使用 `addPlugin()` 或在 Asset/Collection 创建时添加 Plugin
3. Plugin 自动挂钩到生命周期事件
4. 通过 DAS 或链上获取查询 Plugin 数据

## 生命周期

在 Core Asset 的生命周期中，可以触发多个事件，例如：

- 创建
- 转移
- 更新
- 销毁
- 添加 Plugin
- 批准权限 Plugin
- 移除权限 Plugin

生命周期事件以各种方式影响 Asset，从创建、钱包之间的转移，一直到 Asset 的销毁。附加在 Asset 级别或 Collection 级别的 Plugin 将在这些生命周期事件期间经过验证过程，以`批准`、`拒绝`或`强制批准`事件的执行。

## 什么是 Plugin？

Plugin 就像 NFT 的链上应用程序，可以存储数据或为 Asset 提供额外的功能。

## 插件类型

### Owner Managed Plugin

Owner Managed Plugin 是只有在交易中存在 Asset 所有者签名时才能添加到 Core Asset 的 Plugin。

Owner Managed Plugin 包括但不限于：

- [Transfer Delegate](/zh/smart-contracts/core/plugins/transfer-delegate)（市场、游戏）
- [Freeze Delegate](/zh/smart-contracts/core/plugins/freeze-delegate)（市场、质押、游戏）
- [Burn Delegate](/zh/smart-contracts/core/plugins/burn-delegate)（游戏）

如果在没有设置权限的情况下将 Owner Managed Plugin 添加到 Asset/Collection，它将默认权限类型为 `owner`。

当 Owner Managed Plugin 被转移时，其权限会自动撤销。

### Authority Managed Plugin

Authority Managed Plugin 是 MPL Core Asset 或 Core Collection 的权限可以随时添加和更新的 Plugin。

Authority Managed Plugin 包括但不限于：

- [Royalties](/zh/smart-contracts/core/plugins/royalties)
- [Update Delegate](/zh/smart-contracts/core/plugins/update-delegate)
- [Attribute](/zh/smart-contracts/core/plugins/attribute)

如果在没有权限参数的情况下将 Authority Managed Plugin 添加到 Asset/Collection，则 Plugin 将默认为 `update authority` 权限类型。

### Permanent Plugin

**Permanent Plugin 是只能在创建 Core Asset 时添加的 Plugin。** 如果 Asset 已经存在，则无法添加 Permanent Plugin。

Permanent Plugin 包括但不限于：

- [Permanent Transfer Delegate](/zh/smart-contracts/core/plugins/permanent-transfer-delegate)
- [Permanent Freeze Delegate](/zh/smart-contracts/core/plugins/permanent-freeze-delegate)
- [Permanent Burn Delegate](/zh/smart-contracts/core/plugins/permanent-burn-delegate)

如果在没有设置权限的情况下将 Permanent Plugin 添加到 Asset/Collection，它将默认权限类型为 `update authority`。

## Collection Plugin

Collection Plugin 是添加在 Collection 级别的 Plugin，可以产生集合范围的效果。这对于版税特别有用，因为您可以将 [Royalties Plugin](/zh/smart-contracts/core/plugins/royalties) 分配给 Collection Asset，该 Collection 中的所有 Asset 现在都将引用该 Plugin。

Collection 只能访问 `Permanent Plugin` 和 `Authority Managed Plugin`。

## Plugin 优先级

如果 MPL Core Asset 和 MPL Core Collection Asset 都共享相同的 Plugin 类型，则 Asset 级别的 Plugin 及其数据将优先于 Collection 级别的 Plugin。

这可以以创造性的方式使用，例如为一组 Asset 设置不同级别的版税。

- Collection Asset 分配了 2% 的 Royalties Plugin
- Collection 中的超稀有 MPL Core Asset 分配了 5% 的 Royalties Plugin

在上述情况下，来自 Collection 的常规 MPL Core Asset 销售将保留 2% 的版税，而超稀有 MPL Core Asset 将在销售时保留 5% 的版税，因为它有自己的 Royalties Plugin，优先于 Collection Asset Royalties Plugin。

## 插件表

| Plugin                                                                   | Owner Managed | Authority Managed | Permanent |
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

MPL Core 中的 Plugin 能够影响某些生命周期操作的结果，例如创建、转移、销毁和更新。

每个 Plugin 都有能力`拒绝`、`批准`或`强制批准`操作以达到预期结果。

在生命周期事件期间，操作将按照预定义的 Plugin 列表逐一检查和验证。
如果 Plugin 条件验证通过，生命周期将继续其操作。

如果 Plugin 验证失败，则生命周期将被停止并拒绝。

Plugin 验证的规则按以下条件层次结构进行：

- 如果有强制批准，则始终批准
- 否则如果有任何拒绝，则拒绝
- 否则如果有任何批准，则批准
- 否则拒绝

`强制批准`验证仅适用于第一方 Plugin 和 `Permanent Delegate` Plugin。

### 强制批准

强制批准是检查 Plugin 验证时的第一个检查。目前将强制批准验证的 Plugin 有：

- **Permanent Transfer**
- **Permanent Burn**
- **Permanent Freeze**

这些 Plugin 的操作将优先于其非永久对应 Plugin 和其他 Plugin。

#### 示例
如果您的 Asset 在 Asset 级别被 Freeze Plugin 冻结，同时 Asset 上有 **Permanent Burn** Plugin，即使 Asset 被冻结，通过 **Permanent Burn** Plugin 调用的销毁程序仍将执行，这是由于永久 Plugin 的 `forceApprove` 特性。

### 创建

{% totem %}

| Plugin    | 操作     | 条件 |
| --------- | ---------- | ---------- |
| Royalties | 可以拒绝 | Ruleset    |

{% /totem %}

### 更新

{% totem %}
更新目前没有 Plugin 条件或验证。
{% /totem %}

### 转移

{% totem %}

| Plugin                      | 操作      | 条件  |
| --------------------------- | ----------- | ----------- |
| Royalties                   | 可以拒绝  | Ruleset     |
| Freeze Delegate             | 可以拒绝  | isFrozen    |
| Transfer Delegate           | 可以批准 | isAuthority |
| Permanent Freeze Delegate   | 可以拒绝  | isFrozen    |
| Permanent Transfer Delegate | 可以批准 | isAuthority |

{% /totem %}

### 销毁

{% totem %}

| Plugin                    | 操作      | 条件  |
| ------------------------- | ----------- | ----------- |
| Freeze Delegate           | 可以拒绝  | isFrozen    |
| Burn Delegate             | 可以拒绝  | isAuthority |
| Permanent Freeze Delegate | 可以拒绝  | isFrozen    |
| Permanent Burn Delegate   | 可以批准 | isAuthority |

{% /totem %}

### 添加 Plugin

{% totem %}

| Plugin          | 操作      | 条件  |
| --------------- | ----------- | ----------- |
| Royalties       | 可以拒绝  | Ruleset     |
| Update Delegate | 可以批准 | isAuthority |

{% /totem %}

### 移除 Plugin

{% totem %}

| Plugin          | 操作      | 条件  |
| --------------- | ----------- | ----------- |
| Royalties       | 可以拒绝  | Ruleset     |
| Update Delegate | 可以批准 | isAuthority |

{% /totem %}

### 批准 Plugin 权限

{% totem %}
批准目前没有 Plugin 条件或验证。
{% /totem %}

### 撤销权限 Plugin

{% totem %}
撤销目前没有 Plugin 条件或验证。
{% /totem %}

## 常见用例

| 用例 | 推荐 Plugin |
|----------|-------------------|
| 强制创作者版税 | [Royalties](/zh/smart-contracts/core/plugins/royalties) |
| 无托管质押 | [Freeze Delegate](/zh/smart-contracts/core/plugins/freeze-delegate) |
| 市场挂单 | [Freeze Delegate](/zh/smart-contracts/core/plugins/freeze-delegate) + [Transfer Delegate](/zh/smart-contracts/core/plugins/transfer-delegate) |
| 链上游戏统计 | [Attributes](/zh/smart-contracts/core/plugins/attribute) |
| 允许第三方销毁 | [Burn Delegate](/zh/smart-contracts/core/plugins/burn-delegate) |
| 永久质押程序 | [Permanent Freeze Delegate](/zh/smart-contracts/core/plugins/permanent-freeze-delegate) |

## 常见问题

### 创建 Asset 后可以添加 Plugin 吗？

可以，除了 Permanent Plugin。Owner Managed Plugin 需要所有者签名；Authority Managed Plugin 需要更新权限签名。

### Asset 转移时 Plugin 会发生什么？

Owner Managed Plugin（Transfer、Freeze、Burn Delegate）的权限会在转移时自动撤销。Authority Managed 和 Permanent Plugin 会保留。

### Asset 可以拥有与其 Collection 相同的 Plugin 吗？

可以。当两者拥有相同的 Plugin 类型时，Asset 级别的 Plugin 优先于 Collection 级别的 Plugin。

### 如何移除 Plugin？

使用 `removePlugin` 指令。只有 Plugin 权限可以移除它。参见[移除 Plugin](/zh/smart-contracts/core/plugins/removing-plugins)。

### 可以创建自定义 Plugin 吗？

不可以。只支持内置 Plugin。Plugin 系统不能由第三方扩展。

### Plugin 需要额外的 SOL 吗？

添加 Plugin 会增加账户大小，从而增加租金。成本很小（根据数据大小约 0.001 SOL 每个 Plugin）。

## 术语表

| 术语 | 定义 |
|------|------------|
| **Plugin** | 为 Asset/Collection 添加行为或数据的模块化扩展 |
| **Owner Managed** | 需要所有者签名才能添加的 Plugin 类型 |
| **Authority Managed** | 更新权限可以添加的 Plugin 类型 |
| **Permanent** | 只能在创建时添加的 Plugin 类型 |
| **生命周期事件** | Plugin 可以验证的操作（创建、转移、销毁） |
| **强制批准** | 覆盖其他拒绝的永久 Plugin 验证 |
| **Plugin 权限** | 被授权更新或移除 Plugin 的账户 |

---

*由 Metaplex Foundation 维护 · 最后验证于 2026 年 1 月 · 适用于 @metaplex-foundation/mpl-core*
