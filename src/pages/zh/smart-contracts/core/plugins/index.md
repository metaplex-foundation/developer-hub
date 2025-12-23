---
title: 插件概述
metaTitle: 资产插件概述 | Core
description: 新的 Metaplex Core 数字资产标准通过插件提供了与您的资产交互的新方式。可以将插件添加到资产中以改变行为或存储数据，进一步增强 Solana 区块链上的 NFT 和数字资产。
---

## 生命周期

在 Core 资产的生命周期中，可以触发多个事件，例如：

- 创建
- 转移
- 更新
- 销毁
- 添加插件
- 授权插件权限
- 移除插件权限

生命周期事件以各种方式影响资产，从创建、钱包之间的转移，一直到资产的销毁。附加在资产级别或集合级别的插件将在这些生命周期事件期间经过验证过程，以`批准`、`拒绝`或`强制批准`事件的执行。

## 什么是插件？

插件就像 NFT 的链上应用程序，可以存储数据或为资产提供额外的功能。

## 插件类型

### 所有者管理的插件

所有者管理的插件是只有在交易中存在资产所有者签名时才能添加到 Core 资产的插件。

所有者管理的插件包括但不限于：

- [转移委托](/zh/smart-contracts/core/plugins/transfer-delegate)（市场、游戏）
- [冻结委托](/zh/smart-contracts/core/plugins/freeze-delegate)（市场、质押、游戏）
- [销毁委托](/zh/smart-contracts/core/plugins/burn-delegate)（游戏）

如果在没有设置权限的情况下将所有者管理的插件添加到资产/集合，它将默认权限类型为`owner`。

当所有者管理的插件被转移时，其权限会自动撤销。

### 权限管理的插件

权限管理的插件是 MPL Core 资产或 Core 集合的权限可以随时添加和更新的插件。

权限管理的插件包括但不限于：

- [版税](/zh/smart-contracts/core/plugins/royalties)
- [更新委托](/zh/smart-contracts/core/plugins/update-delegate)
- [属性](/zh/smart-contracts/core/plugins/attribute)

如果在没有权限参数的情况下将权限管理的插件添加到资产/集合，则插件将默认为`update authority`权限类型。

### 永久插件

**永久插件是只能在创建时添加到 Core 资产的插件。** 如果资产已经存在，则无法添加永久插件。

永久插件包括但不限于：

- [永久转移委托](/zh/smart-contracts/core/plugins/permanent-transfer-delegate)
- [永久冻结委托](/zh/smart-contracts/core/plugins/permanent-freeze-delegate)
- [永久销毁委托](/zh/smart-contracts/core/plugins/permanent-burn-delegate)

如果在没有设置权限的情况下将永久插件添加到资产/集合，它将默认权限类型为`update authority`。

## 集合插件

集合插件是添加在集合级别的插件，可以产生集合范围的效果。这对于版税特别有用，因为您可以将[版税插件](/zh/smart-contracts/core/plugins/royalties)分配给集合资产，该集合中的所有资产现在都将引用该插件。

集合只能访问`永久插件`和`权限管理的插件`。

## 插件优先级

如果 MPL Core 资产和 MPL Core 集合资产都共享相同的插件类型，则资产级别的插件及其数据将优先于集合级别的插件。

这可以以创造性的方式使用，例如为一组资产设置不同级别的版税。

- 集合资产分配了 2% 的版税插件
- 集合中的超稀有 MPL Core 资产分配了 5% 的版税插件

在上述情况下，来自集合的常规 MPL Core 资产销售将保留 2% 的版税，而超稀有 MPL Core 资产将在销售时保留 5% 的版税，因为它有自己的版税插件，优先于集合资产版税插件。

## 插件表

| 插件                                                                   | 所有者管理 | 权限管理 | 永久 |
| ---------------------------------------------------------------------- | ---------- | -------- | ---- |
| [转移委托](/zh/smart-contracts/core/plugins/transfer-delegate)                     | ✅            |                   |           |
| [冻结委托](/zh/smart-contracts/core/plugins/freeze-delegate)                         | ✅            |                   |           |
| [销毁委托](/zh/smart-contracts/core/plugins/burn-delegate)                             | ✅            |                   |           |
| [版税](/zh/smart-contracts/core/plugins/royalties)                                     |               | ✅                |           |
| [更新委托](/zh/smart-contracts/core/plugins/update-delegate)                         |               | ✅                |           |
| [属性](/zh/smart-contracts/core/plugins/attribute)                                     |               | ✅                |           |
| [永久转移委托](/zh/smart-contracts/core/plugins/permanent-transfer-delegate) |               |                   | ✅        |
| [永久冻结委托](/zh/smart-contracts/core/plugins/permanent-freeze-delegate)     |               |                   | ✅        |
| [永久销毁委托](/zh/smart-contracts/core/plugins/permanent-burn-delegate)         |               |                   | ✅        |

## 插件和生命周期事件

MPL Core 中的插件能够影响某些生命周期操作的结果，例如创建、转移、销毁和更新。

每个插件都有能力`拒绝`、`批准`或`强制批准`操作以达到预期结果。

在生命周期事件期间，操作将按照预定义的插件列表逐一检查和验证。
如果插件条件验证通过，生命周期将继续其操作。

如果插件验证失败，则生命周期将被停止并拒绝。

插件验证的规则按以下条件层次结构进行：

- 如果有强制批准，则始终批准
- 否则如果有任何拒绝，则拒绝
- 否则如果有任何批准，则批准
- 否则拒绝

`强制批准`验证仅适用于第一方插件和`永久委托`插件。

### 强制批准

强制批准是检查插件验证时的第一个检查。目前将强制批准验证的插件有：

- **永久转移**
- **永久销毁**
- **永久冻结**

这些插件的操作将优先于其非永久对应插件和其他插件。

#### 示例
如果您的资产在资产级别被冻结插件冻结，同时资产上有**永久销毁**插件，即使资产被冻结，通过**永久销毁**插件调用的销毁程序仍将执行，这是由于永久插件的`forceApprove`特性。

### 创建

{% totem %}

| 插件    | 操作     | 条件 |
| --------- | ---------- | ---------- |
| 版税 | 可以拒绝 | 规则集    |

{% /totem %}

### 更新

{% totem %}
更新目前没有插件条件或验证。
{% /totem %}

### 转移

{% totem %}

| 插件                      | 操作      | 条件  |
| --------------------------- | ----------- | ----------- |
| 版税                   | 可以拒绝  | 规则集     |
| 冻结委托             | 可以拒绝  | isFrozen    |
| 转移委托           | 可以批准 | isAuthority |
| 永久冻结委托   | 可以拒绝  | isFrozen    |
| 永久转移委托 | 可以批准 | isAuthority |

{% /totem %}

### 销毁

{% totem %}

| 插件                    | 操作      | 条件  |
| ------------------------- | ----------- | ----------- |
| 冻结委托           | 可以拒绝  | isFrozen    |
| 销毁委托             | 可以拒绝  | isAuthority |
| 永久冻结委托 | 可以拒绝  | isFrozen    |
| 永久销毁委托   | 可以批准 | isAuthority |

{% /totem %}

### 添加插件

{% totem %}

| 插件          | 操作      | 条件  |
| --------------- | ----------- | ----------- |
| 版税       | 可以拒绝  | 规则集     |
| 更新委托 | 可以批准 | isAuthority |

{% /totem %}

### 移除插件

{% totem %}

| 插件          | 操作      | 条件  |
| --------------- | ----------- | ----------- |
| 版税       | 可以拒绝  | 规则集     |
| 更新委托 | 可以批准 | isAuthority |

{% /totem %}

### 批准插件权限

{% totem %}
批准目前没有插件条件或验证。
{% /totem %}

### 撤销插件权限

{% totem %}
撤销目前没有插件条件或验证。
{% /totem %}
