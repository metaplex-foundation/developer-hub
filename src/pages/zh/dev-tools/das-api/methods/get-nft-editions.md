---
title: 获取 NFT 版本
metaTitle: 获取 NFT 版本 | DAS API
description: 获取主版 NFT 铸币的所有可打印版本
---

返回主版 NFT 铸币的所有可打印版本——包括版本号、地址和供应信息。您也可以传入版本地址来检索相应的主版及其同级版本。

## 参数

| 名称          | 必需 | 描述                                        |
| ------------- | :------: | -------------------------------------------------- |
| `mintAddress` |    ✅    | 主版 NFT 的铸币地址。       |
| `cursor`      |         | 分页游标。                             |
| `page`        |         | 分页页码。                        |
| `limit`       |         | 返回的最大版本数量。              |
| `before`      |         | 返回此游标之前的版本。                |
| `after`       |         | 返回此游标之后的版本。                 |

## 响应

响应包括：

- `editions` - 版本对象数组，包含：
  - `edition_address` - [版本账户](/zh/smart-contracts/token-metadata#printing-editions)的地址
  - `edition_number` - 版本号（1、2、3 等）
  - `mint_address` - 版本的铸币地址
- `master_edition_address` - 主版账户的地址
- `supply` - 当前已铸造的版本数量
- `max_supply` - 可铸造的最大版本数量（无限制时为 null）


## 测试场

{% apiRenderer method="getNftEditions" noUmi=true /%}
