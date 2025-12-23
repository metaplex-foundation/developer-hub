---
title: 获取代币账户
metaTitle: 获取代币账户 | DAS API
description: 按所有者或铸币获取代币账户列表
tableOfContents: false
---

返回按所有者地址、铸币地址或两者过滤的代币账户列表。用于查找与钱包关联的所有代币账户或持有特定代币的所有账户。

## 参数

| 名称           | 必需 | 描述                                          |
| -------------- | :------: | ---------------------------------------------------- |
| `ownerAddress` |    （仅在未提供 `mintAddress` 时必需）    | 按所有者地址过滤。                             |
| `mintAddress`  |    （仅在未提供 `ownerAddress` 时必需）    | 按铸币地址过滤。                              |
| `cursor`       |         | 分页游标。                               |
| `page`         |         | 分页页码。                          |
| `limit`        |         | 返回的最大代币账户数量。          |
| `before`       |         | 返回此游标之前的账户。                  |
| `after`        |         | 返回此游标之后的账户。                   |
| `options`      |         | 额外的[显示选项](/zh/dev-tools/das-api/display-options)。              |

## 响应

响应包括：

- `token_accounts` - 代币账户对象数组，包含：
  - `address` - 代币账户地址
  - `amount` - 账户中的代币余额
  - `mint` - 代币的铸币地址
  - `owner` - 账户的所有者地址
  - `delegate` - 委托地址（如果有）
  - `delegated_amount` - 委托给委托人的数量
  - `frozen` - 账户是否被冻结
  - `close_authority` - 关闭权限地址（如果有）
  - `extensions` - 代币扩展数据
- `errors` - 处理过程中遇到的任何错误数组
- 分页字段：`cursor`、`page`、`limit`、`before`、`after`、`total`

## 测试场

{% apiRenderer method="getTokenAccounts" noUmi=true /%}
