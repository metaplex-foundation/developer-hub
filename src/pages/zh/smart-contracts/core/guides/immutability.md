---
title: MPL Core 中的不可变性
metaTitle: MPL Core 中的不可变性 | Core 指南
description: 本指南描述 MPL Core 的不同不可变性层
---

## 什么是不可变性？
在数字资产的一般背景下，不可变性通常指代币或 NFT 的元数据。过去，社区要求这一点是为了确保购买的资产在未来无法更改。随着 MPL Core 提供的额外功能，添加额外的不可变性特性可能是有意义的。本指南旨在提供有关这些不同选项的信息，以及如何使用它们来定制数字资产的不可变性以满足项目的需求。

要理解下面的一些区分，熟悉一般的 MPL Core [插件功能](/zh/smart-contracts/core/plugins)可能会有所帮助。

## MPL Core 中的不可变性选项
- **不可变元数据**：[immutableMetadata](/zh/smart-contracts/core/plugins/immutableMetadata) 插件允许使 Asset 或整个集合的名称和 URI 不可更改。
- **禁止添加新插件**：Core 可以使用 [addBlocker](/zh/smart-contracts/core/plugins/addBlocker) 插件禁止创建者向资产添加额外的插件。没有这个插件，更新权限可以添加权限管理的插件，如版税插件。
- **插件级别不可变性**：某些插件可以设置与所有者或更新权限不同的权限。移除此权限后，此特定插件将无法再更改。例如，这在创建者想要向资产所有者保证版税不会在未来更改的情况下很有用。移除权限可以在创建插件时完成，也可以在更新时完成。
- **完全不可变性**：移除资产或集合的更新权限后，任何基于权限的操作都无法再触发。这包括更改元数据或添加基于权限的插件。当追求完全不可变性时，必须确保除了[一般权限](/zh/smart-contracts/core/update#making-a-core-asset-data-immutable)外，插件权限也被移除。
