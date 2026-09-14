---
title: 获取 NFT 版本
metaTitle: 获取 NFT 版本 | DAS API
description: 获取主版 NFT 铸币的所有可打印版本
---

返回主版 NFT 铸币的所有可打印版本，包括版本号、地址和供应信息。

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
- `supply` - 此主版已铸造的版本总数
- `max_supply` - 可铸造的最大版本数量（无限制时为 null）
- `total` - 当前页返回的版本数量。整体铸造数量请使用 `supply`。
- 分页字段：`cursor`、`page`、`limit`、`before`、`after`

如果铸币没有主版账户，RPC 将返回错误。

## 测试场

{% apiRenderer method="getNftEditions" /%}
