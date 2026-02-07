---
title: MPL Core中的不可变性
metaTitle: MPL Core中的不可变性 | Core指南
description: 本指南描述了MPL Core中的各种不可变性层
updated: '01-31-2026'
keywords:
  - immutable NFT
  - immutability
  - lock metadata
  - permanent NFT
about:
  - Immutability options
  - Metadata protection
  - Plugin immutability
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
---
## 什么是不可变性？
在数字资产的一般语境中，不可变性通常用于指代代币或NFT的元数据。过去，社区要求这一点是为了确保购买的资产将来不会被更改。由于MPL Core提供的附加功能，添加额外的不可变性功能可能是有意义的。本指南旨在提供有关这些各种选项以及如何根据项目需求调整数字资产不可变性的信息。
理解以下区别可能需要熟悉一般的MPL Core[插件功能](/smart-contracts/core/plugins)。
## MPL Core的不可变性选项
- **不可变元数据**：[immutableMetadata](/smart-contracts/core/plugins/immutableMetadata)插件可以使Asset或整个收藏品的名称和URI不可更改。
- **禁止添加新插件**：Core可以使用[addBlocker](/smart-contracts/core/plugins/addBlocker)插件禁止创建者向资产添加额外插件。没有此插件，update authority可以添加royalty插件等Authority管理的插件。
- **插件级不可变性**：某些插件可以设置与所有者或update authority不同的authority。删除此authority将使该特定插件无法更改。例如，当创建者想向资产所有者保证版税将来不会更改时，这很有用。authority的删除可以在插件创建时或更新时进行。
- **完全不可变性**：删除Asset或Collection的update authority将使基于authority的操作无法再触发。这包括元数据更改和基于authority的插件添加。如果目标是完全不可变性，除了[一般authority](/smart-contracts/core/update#making-a-core-asset-data-immutable)之外，还需要确保插件的authority也已删除。
