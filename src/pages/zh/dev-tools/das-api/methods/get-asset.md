---
title: 获取资产
metaTitle: 获取资产 | DAS API
description: 返回压缩/标准资产的信息
tableOfContents: false
---

返回压缩/标准资产的信息，包括元数据和所有者。

对于从 MPL-Core 集合继承卖家费用的 Bubblegum V2 cNFT，集合解析后的展示值位于 `royalty.basis_points` / `creators`，叶子值位于 `royalty.basis_points_raw` / `creators_raw`（同时 `royalty.sfbp_inherited: true`）。请参阅[读取继承版税](/zh/smart-contracts/bubblegum-v2/reading-inherited-royalties)。

## 参数

| 名称            | 必需 | 描述                                |
| --------------- | :------: | ------------------------------------------ |
| `id`            |    ✅    | 资产的 ID。                       |
| `options`       |          | 显示选项对象。详见[显示选项](/zh/dev-tools/das-api/display-options)。 |

## 测试场

{% apiRenderer method="getAsset" /%}
