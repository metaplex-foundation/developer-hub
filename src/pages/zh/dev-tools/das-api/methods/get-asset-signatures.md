---
title: 获取资产签名
metaTitle: 获取资产签名 | DAS API
description: 返回压缩资产的交易签名
tableOfContents: false
---

返回与压缩资产关联的交易签名。您可以通过资产 ID 或通过树和叶子索引来识别资产。

## 参数

| 名称            | 必需 | 描述                                |
| --------------- | :------: | ------------------------------------------ |
| `assetId`       |    ✅（或 tree + leafIndex）   | 资产的 ID。                       |
| `tree`          |    ✅（或 assetId）    | 对应叶子的树。        |
| `leafIndex`     |    ✅（或 assetId）    | 资产的叶子索引。               |
| `limit`         |          | 要检索的最大签名数量。 |
| `page`          |          | 要检索的"页面"索引。        |
| `before`        |          | 检索指定签名之前的签名。 |
| `after`         |          | 检索指定签名之后的签名。 |
| `cursor`        |          | 签名的游标。               |
| `sortDirection` |          | 排序方向。可以是 "asc" 或 "desc"。 |

## 测试场

{% apiRenderer method="getAssetSignatures" /%}
