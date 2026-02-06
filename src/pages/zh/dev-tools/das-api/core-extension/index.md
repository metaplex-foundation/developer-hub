---
title: Core DAS API 扩展
metaTitle: 方法 | Core DAS API 扩展
description: 用于 MPL Core 的数字资产标准 API 扩展
---

除了通用 DAS SDK 之外，还为 [MPL Core](/zh/smart-contracts/core) 创建了一个扩展，可以直接返回正确的类型以便进一步与 MPL Core SDK 一起使用。它还自动派生资产中从集合继承的插件，并提供 [DAS 到 Core 类型转换](/zh/dev-tools/das-api/core-extension/convert-das-asset-to-core)的功能。

## 获取数据

Core DAS API 扩展支持以下方法：

- [`getAsset`](/zh/dev-tools/das-api/core-extension/methods/get-asset): 返回压缩/标准资产的信息，包括元数据和所有者。
- [`getCollection`](/zh/dev-tools/das-api/core-extension/methods/get-collection): 返回压缩资产的默克尔树证明信息。
- [`getAssetsByAuthority`](/zh/dev-tools/das-api/core-extension/methods/get-assets-by-authority): 根据权限地址返回资产列表。
- [`getAssetsByCollection`](/zh/dev-tools/das-api/core-extension/methods/get-assets-by-collection): 根据组（键、值）对返回资产列表。例如，这可用于获取集合中的所有资产。
- [`getAssetsByOwner`](/zh/dev-tools/das-api/core-extension/methods/get-assets-by-owner): 根据所有者地址返回资产列表。
- [`searchAssets`](/zh/dev-tools/das-api/core-extension/methods/search-assets): 根据搜索条件返回资产列表。
- [`searchCollections`](/zh/dev-tools/das-api/core-extension/methods/search-collections): 根据搜索条件返回集合列表。

## 类型转换

此外，它还提供将常规 DAS Asset 类型转换为 Core Assets 和 Core Collections 的函数：

- [`dasAssetsToCoreAssets`](/zh/dev-tools/das-api/core-extension/convert-das-asset-to-core#convert-to-asset-example): 将 DAS Asset 转换为 Core Asset 类型
- [`dasAssetsToCoreCollection`](/zh/dev-tools/das-api/core-extension/convert-das-asset-to-core#convert-to-asset-example): 将 DAS Asset 转换为 Core Collection 类型

## 插件派生

此库将自动派生资产中从集合继承的插件。在 [Core 插件页面](/zh/smart-contracts/core/plugins)上阅读更多关于一般插件继承和优先级的信息。

如果您想停用派生或手动实现它，[插件派生页面](/zh/dev-tools/das-api/core-extension/plugin-derivation)应该会有所帮助。
