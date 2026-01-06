---
title: 概述
metaTitle: 概述 | Fusion
description: 提供使用Fusion实现可组合NFT的高级概述。
---

Fusion是由Trifle程序驱动的NFT可组合性功能。 {% .lead %}

{% callout %}
请注意，某些Fusion（Trifle）指令将需要协议费用。请查看[协议费用](/zh/protocol-fees)页面以获取最新信息。
{% /callout %}

Trifle程序构建于Token Metadata的托管扩展之上。它使用创作者拥有的托管（Creator Owned Escrow，简称COE），以Trifle PDA作为COE的创建者和管理者。其目的是为NFT所有权添加链上跟踪和可组合性。此外，围绕代币所有权指定规则和效果的能力允许创作者实现复杂的所有权模型。

🔗 **有用链接：**

- [Token Metadata托管](https://github.com/metaplex-foundation/mpl-token-metadata/tree/main/programs/token-metadata/program/src/processor/escrow)
- [Fusion程序](https://github.com/metaplex-foundation/mpl-trifle/tree/master/programs/trifle)

让我们通过查看Trifle程序提供的账户和指令来更详细地了解它。

## 账户

### 托管约束模型

约束模型是一组限制和要求，可以评估是否允许传入和传出Trifle账户。在转移时，合约将检查约束模型以确定需要对正在转入或转出TOE的代币执行哪些检查。一个约束模型可以服务于许多不同的NFT及其Trifle账户。

约束模型可以被视为一组约束，定义为槽位。每个槽位由槽位名称、约束类型（无/集合/代币集）和槽位中允许的代币数量组成。约束以`HashMap`形式存储，键为槽位名称，值为约束类型和代币限制。

### Trifle

Trifle账户用于跟踪COE在链上拥有的代币。它还链接到正在使用的约束模型。Trifle账户以内部HashMap管理代币，反映约束模型的槽位语义。

## 指令

### 创建托管约束模型账户

创建可用于Trifle账户的约束模型。

### 创建Trifle账户

创建用于NFT的Trifle账户。创建时必须传入一个强制性的约束模型账户，供Trifle账户进行检查。

### 转入

将代币转入由Trifle账户管理的创作者拥有托管。虽然可以对COE进行标准的spl-token转账，但使用此指令是Trifle账户管理和跟踪所拥有代币的唯一方法。此指令还会对约束模型执行检查，以验证正在转入的代币是否有效。

### 转出

将代币从由Trifle账户管理的创作者拥有托管转出。此指令还会对约束模型执行检查，以验证正在转出的代币是否允许被移除。

### 向托管约束模型添加无约束

在约束模型中创建无约束。此时定义槽位名称和槽位中允许的代币数量。

### 向托管约束模型添加集合约束

在约束模型中创建集合约束。此时定义槽位名称、允许的集合和槽位中允许的代币数量。

### 向托管约束模型添加代币约束

在约束模型中创建代币约束。此时定义槽位名称、允许的代币和槽位中允许的代币数量。

### 从托管约束模型移除约束

通过指定槽位名称从约束模型中移除约束。
