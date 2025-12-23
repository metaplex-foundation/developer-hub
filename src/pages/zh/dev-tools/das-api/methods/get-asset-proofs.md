---
title: 获取资产证明列表
metaTitle: 获取资产证明列表 | DAS API
description: 返回多个压缩资产的默克尔树证明信息
tableOfContents: false
---

返回多个压缩资产的默克尔树证明信息。此方法通过检索默克尔证明来验证压缩 NFT 的真实性。

## 参数

| 名称            | 必需 | 描述                                |
| --------------- | :------: | ------------------------------------------ |
| `ids`           |    ✅    | 要获取证明的资产 ID 数组。   |

## 测试场

{% apiRenderer method="getAssetProofs" /%}
