---
title: 获取分组信息（Core 扩展）
metaTitle: 获取分组信息 | DAS API Core 扩展
description: 返回合集或 mpl-core GroupV1 的分组名称和已索引成员数量。
created: '07-22-2026'
updated: '07-22-2026'
keywords:
  - das getGrouping core extension
  - mpl-core-das getGrouping
  - group size
about:
  - DAS API
  - MPL Core
  - Core Groups
proficiencyLevel: Intermediate
---

## 概述

`das.getGrouping` 返回分组键值对的摘要元数据，而不列出所有成员。

- 返回 `group_key`、`group_name` 和 `group_size`
- 合集使用 `groupKey: "collection"`，[GroupV1](/zh/smart-contracts/core/groups) 使用 `groupKey: "group"`
- 要列出成员，请使用 [`getAssetsByGroup`](/zh/dev-tools/das-api/core-extension/methods/get-assets-by-group)（Core）或[基础 DAS 方法](/zh/dev-tools/das-api/methods/get-grouping)

## 代码示例

`das.getGrouping` 接收 Umi 实例和 `GroupV1` 地址，返回分组名称和大小，而不列出成员。

{% code-tabs-imported from="das-api/core-extension/get-grouping" frameworks="umi" /%}

## 参数

该辅助函数依次接收 Umi 实例和一个选项对象。

| 名称         | 必需 | 描述 |
| ------------ | :------: | ----------- |
| `groupKey`   |    ✅    | `"collection"` 或 `"group"`。 |
| `groupValue` |    ✅    | 合集或 GroupV1 地址（字符串或公钥）。 |

## 注意事项

- `group_size` 反映索引器记录的数据，不一定等于当前的链上向量长度。
- 需要 DAS 客户端 ≥ 2.1.0 以及支持 `getGrouping` 的 RPC。
