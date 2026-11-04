---
title: 获取Core分组
metaTitle: 获取Core分组 | DAS API Core 扩展
description: 通过 DAS 获取单个 mpl-core GroupV1 账户，并以 Core 类型的 GroupResult 返回。
created: '07-22-2026'
updated: '07-22-2026'
keywords:
  - das getGroup
  - mpl-core-das getGroup
  - GroupV1
about:
  - DAS API
  - MPL Core
  - Core Groups
proficiencyLevel: Intermediate
---

## 概述

`das.getGroup` 按公钥获取一个 [mpl-core GroupV1](/zh/smart-contracts/core/groups)，并返回 [`GroupResult`](/zh/smart-contracts/core/groups#groupv1-账户)。

- 已针对 MPL Core SDK 进行类型化
- 成员向量可能因索引器而为空
- 需要权威的链上 `collections` / `groups` / `assets` / `parentGroups` 时，请优先使用 [`fetchGroupV1`](/zh/smart-contracts/core/groups)

## 代码示例

`das.getGroup` 接收 Umi 实例和 `GroupV1` 地址，并返回单个 Core 类型的分组。

{% code-tabs-imported from="das-api/core-extension/get-group" frameworks="umi" /%}

## 注意事项

- 接口必须是 `MplCoreGroup`，否则辅助函数会抛出错误。
- 要列出分组成员，请使用 [`getAssetsByGroup`](/zh/dev-tools/das-api/core-extension/methods/get-assets-by-group)。
