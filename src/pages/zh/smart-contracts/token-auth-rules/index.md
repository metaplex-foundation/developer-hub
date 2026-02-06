---
title: 概述
metaTitle: 概述 | Token Auth Rules
description: 提供NFT权限的高级概述。
---
Token Authorization Rules（又称Token Auth Rules）是一个高级元编程工具，用于评估在SPL代币上发生的指令的权限。该程序本身可用于创建和更新规则集，规则集是代表特定条件的规则集合。

## 介绍

当执行代币操作时，可以使用指令详情（例如代币转移的目标地址）调用该程序，这些详情将根据规则集进行验证。如果规则评估为无效，指令将失败，整个交易将被回滚。这使得可以构建将代币操作与Token Auth Rules程序耦合的完整交易，因此如果关联规则集中的规则被违反，任何交易以及其中包含的代币操作都将被回滚。

## 功能

[创建或更新规则集](/zh/smart-contracts/token-auth-rules/create-or-update) - 用于初始化和更新规则集内容的指令。

[规则集缓冲区](/zh/smart-contracts/token-auth-rules/buffers) - 如何处理大型规则集。

[验证规则集](/zh/smart-contracts/token-auth-rules/validate) - 如何验证规则集。

## 规则类型

授权规则是实现`validate()`方法的`Rule`枚举的变体。

有**原始规则**和由一个或多个原始规则组合创建的**组合规则**。

**原始规则**存储评估所需的任何账户或数据，在运行时将根据传入`validate()`函数的账户和定义明确的`Payload`产生true或false输出。

**组合规则**根据任何或所有原始规则是否返回true来返回true或false。组合规则然后可以组合成实现更复杂布尔逻辑的更高级组合规则。由于`Rule`枚举的递归定义，在顶级组合规则上调用`validate()`将从顶部开始，并在每个级别进行验证，直到组成的原始规则。

## 操作

规则集建立在`HashMap`数据结构之上，旨在为可与代币一起使用的不同指令类型（例如转移、委托、销毁等）存储各种规则集。Token Auth Rules使用术语**操作**来表示这些各种指令，**操作**用作`HashMap`数据结构中的键。每个**操作**可以有一组不同的关联规则。

### 场景

**场景**是**操作**的可选补充，用于处理可以调用指令的更具体情况。从数据格式的角度来看，**操作**和**场景**的组合只是由冒号分隔的两个字符串`<操作>:<场景>`。例如，Token Metadata使用授权类型作为从Token Metadata调用Token Auth Rules的**场景**。转移**操作**可以由代币的所有者或委托人在代币上触发，规则集管理者可能希望这些不同的场景由不同的规则管理。为了处理这个特定用例，可以使用**场景**来管理区别。前面示例中使用的两个`HashMap`键将是`Transfer:Owner`和`Transfer:Delegate`。

请参阅[命名空间](/zh/smart-contracts/token-auth-rules/primitive-rules/namespace)了解如何在多个场景中管理相同的规则。

## 负载

Token Auth Rules程序依赖于从请求规则集评估的程序接收的负载数据。`Payload`的底层数据结构是`HashMap`，`Payload`字段表示为`HashMap`键。大多数规则存储预定义的`Payload`字段，以便在验证时可以执行查找。

有关如何使用`Payload`的更多详情，请参阅[验证](/zh/smart-contracts/token-auth-rules/validate)指令。

## 资源

- [Token Auth Rule GitHub仓库](https://github.com/metaplex-foundation/mpl-token-auth-rules)
- [JS客户端的TypeScript参考](https://mpl-token-auth-rules.typedoc.metaplex.com/)
