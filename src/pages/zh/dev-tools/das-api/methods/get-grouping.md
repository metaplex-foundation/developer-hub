---
title: 获取分组信息
metaTitle: 获取分组信息 | DAS API
description: 返回分组（键、值）对的分组元数据
tableOfContents: false
---

返回分组（键、值）对的分组元数据，包括分组名称和已索引成员数量。

Token Metadata 和 mpl-core 合集使用 `groupKey: "collection"`。[mpl-core GroupV1](/zh/smart-contracts/core) 账户使用 `groupKey: "group"`，用于将合集、资产和嵌套分组组合在一起。

## 参数

| 名称         | 必需 | 描述                                                                                    |
| ------------ | :------: | ---------------------------------------------------------------------------------------------- |
| `groupKey`   |    ✅    | 分组键（例如 `"collection"` 或 mpl-core 分组的 `"group"`）。                |
| `groupValue` |    ✅    | 分组值（例如合集或 mpl-core 分组地址）。                           |

## 响应

响应包括：

- `group_key` - 查询的分组键
- `group_name` - 可用时的分组显示名称
- `group_size` - 分组中已索引的资产数量

## 测试场

{% apiRenderer method="getGrouping" /%}
