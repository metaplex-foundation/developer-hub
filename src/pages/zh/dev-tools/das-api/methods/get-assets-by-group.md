---
title: 按组获取资产
metaTitle: 按组获取资产 | DAS API
description: 根据组（键、值）对返回资产列表
tableOfContents: false
---

根据组（键、值）对返回资产列表。

Token Metadata 和 mpl-core 合集使用 `groupKey: "collection"`。要获取 [mpl-core GroupV1](/zh/smart-contracts/core) 账户的成员（合集、资产和嵌套分组），请使用 `groupKey: "group"`。

若要在不列出每个资产的情况下获取分组名称和成员数量，请使用 [`getGrouping`](/zh/dev-tools/das-api/methods/get-grouping)。

## 参数

| 名称               | 必需 | 描述                                |
| ------------------ | :------: | ------------------------------------------ |
| `groupKey`         |    ✅    | 组的键（例如 `"collection"` 或 mpl-core 分组的 `"group"`）。  |
| `groupValue`       |    ✅    | 组的值。  |
| `sortBy`           |          | 排序条件。指定为对象 `{ sortBy: <value>, sortDirection: <value> }`，其中 `sortBy` 是 `["created", "updated", "recentAction", "id", "none"]` 之一，`sortDirection` 是 `["asc", "desc"]` 之一     |
| `limit`            |          | 要检索的最大资产数量。  |
| `page`             |          | 要检索的"页面"索引。       |
| `before`           |          | 检索指定 ID 之前的资产。   |
| `after`            |          | 检索指定 ID 之后的资产。    |
| `options`          |          | 显示选项对象。详见[显示选项](/zh/dev-tools/das-api/display-options)。 |

## 测试场

{% apiRenderer method="getAssetsByGroup" /%}
