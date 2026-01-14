---
title: 获取资产列表
metaTitle: 获取资产列表 | DAS API
description: 返回多个压缩/标准资产的信息
tableOfContents: false
---

返回多个压缩/标准资产的信息，包括其元数据和所有者。

## 参数

| 名称  | 必需 | 描述            |
| ----- | :------: | ---------------------- |
| `ids` |    ✅    | 资产 ID 数组。 |
| `options` |          | 显示选项对象。详见[显示选项](/zh/dev-tools/das-api/display-options)。 |

## 测试场

{% apiRenderer method="getAssets" /%}
