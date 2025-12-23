---
title: 按权限获取资产
metaTitle: 按权限获取资产 | DAS API
description: 根据权限地址返回资产列表
tableOfContents: false
---

根据权限地址返回资产列表。

## 参数

| 名称               | 必需 | 描述                                |
| ------------------ | :------: | ------------------------------------------ |
| `authorityAddress` |    ✅    | 资产权限的地址。|
| `sortBy`           |          | 排序条件。指定为对象 `{ sortBy: <value>, sortDirection: <value> }`，其中 `sortBy` 是 `["created", "updated", "recentAction", "none"]` 之一，`sortDirection` 是 `["asc", "desc"]` 之一     |
| `limit`            |          | 要检索的最大资产数量。  |
| `page`             |          | 要检索的"页面"索引。       |
| `before`           |          | 检索指定 ID 之前的资产。   |
| `after`            |          | 检索指定 ID 之后的资产。    |
| `options`          |          | 显示选项对象。详见[显示选项](/zh/dev-tools/das-api/display-options)。 |

## 测试场

{% apiRenderer method="getAssetsByAuthority" /%}
