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

## 代理字段（`MplCoreAsset`） {#agent-fields-mplcoreasset}

`MplCoreAsset` 响应可能包含从[代理注册表](/zh/smart-contracts/mpl-agent)索引的代理专用字段。非 Core 接口会省略这些字段。集合和分组可能包含 `is_agent: false`，但只有单个 Core 资产可以是代理。

| 字段 | 类型 | 描述 |
|-------|------|-------------|
| `is_agent` | `boolean` | 当资产具有 `AgentIdentity` 外部插件时为 `true` |
| `asset_signer` | `string` | Core Asset Signer PDA — 每个 `MplCoreAsset` 都会返回；当 `is_agent` 为 `true` 时作为代理钱包 |
| `agent_token` | `string` | 来自 `AgentIdentityV2` PDA 的规范代币铸币；在调用 [`setAgentTokenV1`](/zh/dev-tools/cli/agents/set-agent-token) 之前省略 |

示例和索引行为请参阅[读取代理数据](/zh/agents/read-agent-data#read-agent-data-via-das-api)。

## 测试场

{% apiRenderer method="getAsset" /%}
