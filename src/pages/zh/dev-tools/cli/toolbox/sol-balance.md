---
title: SOL 余额
metaTitle: SOL 余额 | Metaplex CLI
description: 检查钱包地址的 SOL 余额
---

检查钱包地址的 SOL 余额。此命令允许您快速验证网络上任何钱包的 SOL 余额。

## 基本用法

```bash
mplx toolbox sol-balance <address>
```

## 参数

| 参数 | 描述 |
|----------|-------------|
| `address` | 要检查的钱包地址（可选，默认为活动钱包） |

## 示例

### 检查活动钱包余额

```bash
mplx toolbox sol-balance
```

### 检查指定钱包余额

```bash
mplx toolbox sol-balance 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
```

## 输出

命令将以格式化输出显示 SOL 余额：

```
--------------------------------
SOL Balance
--------------------------------
Address: 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
Balance: 1.5 SOL
--------------------------------
```

## 注意事项

- 如果未提供地址，命令将检查活动钱包的余额
- 余额以 SOL 显示（不是 lamports）
- 命令使用活动的 RPC 端点
- 确保您有足够的 SOL 进行交易
- 余额是实时的，反映区块链的当前状态

## 相关命令

- [SOL 转账](/zh/dev-tools/cli/toolbox/sol-transfer) - 在地址之间转账 SOL
- [代币转账](/zh/dev-tools/cli/toolbox/token-transfer) - 转账代币
- [空投](/zh/dev-tools/cli/toolbox/sol-airdrop) - 请求 SOL 空投（仅限 devnet）
