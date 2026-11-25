---
title: 按分组获取Core资产
metaTitle: 按分组获取Core资产 | DAS API Core 扩展
description: 以 Core 类型的资产、合集或嵌套分组列出 mpl-core GroupV1 的成员。
created: '07-22-2026'
updated: '11-04-2026'
keywords:
  - das getAssetsByGroup core
  - mpl-core-das getAssetsByGroup
  - core group members
  - groupKey group
about:
  - DAS API
  - MPL Core
  - Core Groups
proficiencyLevel: Intermediate
---

## 概述

`das.getAssetsByGroup` 列出 [mpl-core GroupV1](/zh/smart-contracts/core/groups) 的成员，并返回 Core 类型的结果。

- 使用 `groupKey: "group"` 调用基础 DAS
- 成员可以是资产、合集或嵌套分组
- 除非设置 `skipDerivePlugins: true`，否则会为资产派生合集插件
- 如果只需要名称和大小，请使用 [`getGrouping`](/zh/dev-tools/das-api/core-extension/methods/get-grouping)

## 代码示例

`das.getAssetsByGroup` 接收 Umi 实例和 `GroupV1` 地址，并以 Core 类型的结果返回分组成员。

将 `<ENDPOINT>` 替换为您的 DAS RPC，将 `<PublicKey>` 替换为 GroupV1 地址。

{% code-tabs-imported from="das-api/core-extension/get-assets-by-group" frameworks="umi" /%}

## 参数

该辅助函数依次接收 Umi 实例和一个选项对象。

| 名称                 | 必需 | 描述 |
| -------------------- | :------: | ----------- |
| `group`              |    ✅    | mpl-core GroupV1 公钥。 |
| `sortBy`             |          | 排序条件 `{ sortBy, sortDirection }`。 |
| `limit`              |          | 要检索的最大项目数。 |
| `page`               |          | 要检索的页面索引。 |
| `before` / `after`   |          | 游标式分页 ID。 |
| `cursor`             |          | 在支持时使用的提供商游标。 |
| `displayOptions`     |          | Core 仅支持 `showCollectionMetadata`。 |
| `skipDerivePlugins`  |          | 跳过资产的合集插件自动派生。 |

## 注意事项

- 这是用于 GroupV1 成员关系的 Core 辅助函数。要通过基础 DAS 进行 Token Metadata / 合集分组，请参阅使用 `groupKey: "collection"` 的 [`getAssetsByGroup`](/zh/dev-tools/das-api/methods/get-assets-by-group)。
- 需要 `@metaplex-foundation/digital-asset-standard-api` ≥ 2.1.1 以及可索引 Core 分组的 RPC。
