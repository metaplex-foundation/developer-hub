---
title: 按创建者获取资产
metaTitle: 按创建者获取资产 | DAS API
description: 根据创建者地址返回资产列表
tableOfContents: false
---

根据创建者地址返回资产列表。

{% callout %}
我们建议使用 `onlyVerified: true` 获取数据，以确保资产确实属于该创建者。
{% /callout %}

## 参数

| 名称               | 必需 | 描述                                |
| ------------------ | :------: | ------------------------------------------ |
| `creatorAddress`   |    ✅    | 资产创建者的地址。  |
| `onlyVerified`     |          | 指示是否仅检索已验证的资产。  |
| `sortBy`           |          | 排序条件。指定为对象 `{ sortBy: <value>, sortDirection: <value> }`，其中 `sortBy` 是 `["created", "updated", "recentAction", "id", "none"]` 之一，`sortDirection` 是 `["asc", "desc"]` 之一     |
| `limit`            |          | 要检索的最大资产数量。  |
| `page`             |          | 要检索的"页面"索引。       |
| `before`           |          | 检索指定 ID 之前的资产。   |
| `after`            |          | 检索指定 ID 之后的资产。    |
| `options`          |          | 显示选项对象。详见[显示选项](/zh/dev-tools/das-api/display-options)。 |

## 测试场

{% apiRenderer method="getAssetsByCreator" /%}
