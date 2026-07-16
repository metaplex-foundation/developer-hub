---
title: 获取分组信息
metaTitle: 获取分组信息 | DAS API
description: 返回分组（键、值）对的分组元数据，包括分组名称和已索引分组成员数量。
created: '07-02-2026'
updated: '07-06-2026'
keywords:
  - das api getGrouping
  - get grouping metadata
  - group key group value
  - mpl-core groups
  - collection metadata
about:
  - DAS API
  - Group metadata
  - mpl-core GroupV1
proficiencyLevel: Beginner
tableOfContents: false
---

## 概述

`getGrouping` DAS API 方法返回分组（键、值）对的元数据，不会列出每个成员。

- 返回所查询分组的 `group_key`、`group_name` 和 `group_size`
- Token Metadata 和 mpl-core 合集使用 `groupKey: "collection"`
- [mpl-core GroupV1](/zh/smart-contracts/core) 账户使用 `groupKey: "group"`，用于将合集、资产和嵌套分组组合在一起
- 要列出各个成员，请使用 [`getAssetsByGroup`](/zh/dev-tools/das-api/methods/get-assets-by-group)

## 参数

| 名称         | 必需 | 描述                                                                                    |
| ------------ | :------: | ---------------------------------------------------------------------------------------------- |
| `groupKey`   |    ✅    | 分组键（例如 `"collection"` 或 mpl-core 分组的 `"group"`）。                |
| `groupValue` |    ✅    | 分组值（例如合集或 mpl-core 分组地址）。                           |

## 响应

响应包括：

- `group_key` - 查询的分组键
- `group_name` - 可用时的分组显示名称
- `group_size` - 分组中已索引的分组成员数量

## 测试场

{% apiRenderer method="getGrouping" /%}

## Notes

- `getGrouping` 仅返回摘要元数据 — 要分页浏览分组成员，请使用 [`getAssetsByGroup`](/zh/dev-tools/das-api/methods/get-assets-by-group)
- `group_size` 表示 DAS 为给定 `groupKey`/`groupValue` 对索引的分组成员数量
- 对于 mpl-core GroupV1 分组，已索引成员可能包括合集、资产和嵌套分组，具体取决于索引器记录的内容
