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

## 代理字段（`MplCoreAsset`）

响应数组中的每个项目使用与 [`getAsset`](/zh/dev-tools/das-api/methods/get-asset#agent-fields-mplcoreasset) 相同的资产结构。`MplCoreAsset` 行可能包含 `is_agent`、`asset_signer` 和 `agent_token`。

字段定义和示例请参阅[读取代理数据](/zh/agents/read-agent-data#read-agent-data-via-das-api)。

## 测试场

{% apiRenderer method="getAssets" /%}
