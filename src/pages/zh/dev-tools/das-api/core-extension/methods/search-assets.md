---
title: 搜索 Core 资产
metaTitle: 搜索 Core 资产 | DAS API Core 扩展
description: 根据搜索条件返回 MPL Core 资产列表
---

根据搜索条件返回 Core 资产列表。

## 代码示例

在此示例中应用了两个过滤器：

1. 所有者的公钥
2. 元数据 uri `jsonUri`

这样只返回该钱包拥有的具有给定 URI 的 NFT。

可以在[下方](#参数)找到其他可能的参数。

```js
import { publicKey } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';

const umi = createUmi('<ENDPOINT>').use(dasApi());

const asset = await das.searchAssets(umi, {
    owner: publicKey('AUtnbwWJQfYZjJ5Mc6go9UancufcAuyqUZzR1jSe4esx'),
    jsonUri: 'https://arweave.net/TkklLLQKiO9t9_JPmt-eH_S-VBLMcRjFcgyvIrENBzA',
});

console.log(asset);
```

## 示例响应

```json
[
  {
    publicKey: '8VrqN8b8Y7rqWsUXqUw7dxQw9J5UAoVyb6YDJs1mBCCz',
    header: {
      executable: false,
      owner: 'CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d',
      lamports: [Object],
      rentEpoch: 18446744073709551616n,
      exists: true
    },
    pluginHeader: { key: 3, pluginRegistryOffset: 179n },
    royalties: {
      authority: [Object],
      offset: 138n,
      basisPoints: 500,
      creators: [Array],
      ruleSet: [Object]
    },
    key: 1,
    updateAuthority: {
      type: 'Collection',
      address: 'FgEKkVTSfLQ7a7BFuApypy4KaTLh65oeNRn2jZ6fiBav'
    },
    name: 'Number 1',
    uri: 'https://arweave.net/TkklLLQKiO9t9_JPmt-eH_S-VBLMcRjFcgyvIrENBzA',
    content: {
      '$schema': 'https://schema.metaplex.com/nft1.0.json',
      json_uri: 'https://arweave.net/TkklLLQKiO9t9_JPmt-eH_S-VBLMcRjFcgyvIrENBzA',
      files: [Array],
      metadata: [Object],
      links: [Object]
    },
    owner: 'AUtnbwWJQfYZjJ5Mc6go9UancufcAuyqUZzR1jSe4esx',
    seq: { __option: 'None' }
  }
]
```

## 参数

| 名称                | 必需 | 描述                                |
| ------------------- | :------: | ------------------------------------------ |
| `negate`            |          | 指示是否应反转搜索条件。  |
| `conditionType`     |          | 指示是检索匹配搜索条件的所有（`"all"`）还是任何（`"any"`）资产。  |
| `interface`         |          | 接口值（`["V1_NFT", "V1_PRINT" "LEGACY_NFT", "V2_NFT", "FungibleAsset", "Custom", "Identity", "Executable"]` 之一）。  |
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
| `sortBy`            |          | 排序条件。指定为对象 `{ sortBy: <value>, sortDirection: <value> }`，其中 `sortBy` 是 `["created", "updated", "recentAction", "none"]` 之一，`sortDirection` 是 `["asc", "desc"]` 之一。     |
| `limit`             |          | 要检索的最大资产数量。  |
| `page`              |          | 要检索的"页面"索引。       |
| `before`            |          | 检索指定 ID 之前的资产。   |
| `after`             |          | 检索指定 ID 之后的资产。    |
| `jsonUri`           |          | JSON URI 的值。  |

从技术上讲，该函数接受上述所有参数，因为它们是从标准 DAS 包继承的。但其中一些不建议使用，例如，该包无论如何都会为 MPL Core 过滤 `interface`。
