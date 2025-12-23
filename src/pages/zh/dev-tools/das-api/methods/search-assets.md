---
title: 搜索资产
metaTitle: 搜索资产 | DAS API
description: 根据搜索条件返回资产列表
tableOfContents: false
---

根据搜索条件返回资产列表。

## 参数

| 名称                | 必需 | 描述                                |
| ------------------- | :------: | ------------------------------------------ |
| `negate`            |          | 指示是否应反转搜索条件。  |
| `conditionType`     |          | 指示是检索匹配搜索条件的所有（`"all"`）还是任何（`"any"`）资产。  |
| `interface`         |          | 接口值（`["V1_NFT", "V1_PRINT", "LEGACY_NFT", "V2_NFT", "ProgrammableNFT", "FungibleAsset", "FungibleToken", "Custom", "Identity", "Executable", "MplCoreAsset", "MplCoreCollection", "MplBubblegumV2"]` 之一）。  |
| `ownerAddress`      |          | 所有者的地址。  |
| `ownerType`         |          | 所有权类型 `["single", "token"]`。  |
| `creatorAddress`    |          | 创建者的地址。  |
| `creatorVerified`   |          | 指示创建者是否必须经过验证。  |
| `authorityAddress`  |          | 权限的地址。  |
| `grouping`          |          | 分组 `["key", "value"]` 对。  |
| `delegateAddress`   |          | 委托的地址。  |
| `frozen`            |          | 指示资产是否被冻结。  |
| `supply`            |          | 资产的供应量。  |
| `supplyMint`        |          | 供应铸币的地址。  |
| `compressed`        |          | 指示资产是否被压缩。  |
| `compressible`      |          | 指示资产是否可压缩。  |
| `royaltyTargetType` |          | 版税类型 `["creators", "fanout", "single"]`。  |
| `royaltyTarget`     |          | 版税的目标地址。  |
| `royaltyAmount`     |          | 版税金额。  |
| `burnt`             |          | 指示资产是否已销毁。  |
| `sortBy`            |          | 排序条件。指定为对象 `{ sortBy: <value>, sortDirection: <value> }`，其中 `sortBy` 是 `["created", "updated", "recentAction", "id", "none"]` 之一，`sortDirection` 是 `["asc", "desc"]` 之一。     |
| `limit`             |          | 要检索的最大资产数量。  |
| `page`              |          | 要检索的"页面"索引。       |
| `before`            |          | 检索指定 ID 之前的资产。   |
| `after`             |          | 检索指定 ID 之后的资产。    |
| `jsonUri`           |          | JSON URI 的值。  |
| `options`           |          | 显示选项对象。详见[显示选项](/zh/dev-tools/das-api/display-options)。 |

## 测试场

{% apiRenderer method="searchAssets" /%}
