---
title: 获取资产
metaTitle: 获取资产 | DAS API
description: 返回压缩/标准资产的信息
tableOfContents: false
---

返回压缩/标准资产的信息，包括元数据和所有者。

## 参数

| 名称            | 必需 | 描述                                |
| --------------- | :------: | ------------------------------------------ |
| `id`            |    ✅    | 资产的 ID。                       |
| `options`       |          | 显示选项对象。详见[显示选项](/zh/dev-tools/das-api/display-options)。 |

## 测试场

{% apiRenderer method="getAsset" /%}
