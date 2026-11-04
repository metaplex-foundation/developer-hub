---
title: 搜索Core分组
metaTitle: 搜索Core分组 | DAS API Core 扩展
description: 通过 DAS 搜索 mpl-core GroupV1 账户，并返回 Core 类型的 GroupResult 值。
created: '07-22-2026'
updated: '07-22-2026'
keywords:
  - das searchGroups
  - mpl-core-das searchGroups
  - GroupV1 search
about:
  - DAS API
  - MPL Core
  - Core Groups
proficiencyLevel: Intermediate
---

## 概述

`das.searchGroups` 在 DAS 中搜索 [`MplCoreGroup`](/zh/smart-contracts/core/groups) 接口，并返回 [`GroupResult`](/zh/smart-contracts/core/groups#groupv1-账户) 值。

- 仅筛选 Core 分组
- 在适用时接受与 Core 资产搜索相同的搜索过滤器（例如 authority）
- 要按地址获取单个分组，请优先使用 [`getGroup`](/zh/dev-tools/das-api/core-extension/methods/get-group)
- 要按更新权限列出，请使用 [`getGroupsByUpdateAuthority`](#by-update-authority)

## 代码示例

`das.searchGroups` 接收 Umi 实例和过滤器对象，并返回匹配的 Core 类型分组。

{% code-tabs-imported from="das-api/core-extension/search-groups" frameworks="umi" /%}

## 按更新权限 {% #by-update-authority %}

`das.getGroupsByUpdateAuthority` 列出指定更新权限的 Core 分组，并返回 `GroupResult` 值。与 [`getAssetsByGroup`](/zh/dev-tools/das-api/core-extension/methods/get-assets-by-group) 搭配使用可列出每个分组的成员。

{% code-tabs-imported from="das-api/core-extension/get-groups-by-update-authority" frameworks="umi" /%}

## 注意事项

- 需要支持 `MplCoreGroup` 索引的 DAS 客户端 ≥ 2.1.0。
- 结果中的成员向量可能为空。要获取完整的链上成员关系，请使用 [`fetchGroupV1`](/zh/smart-contracts/core/groups)。
