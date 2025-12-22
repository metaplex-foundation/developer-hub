---
title: 代币转账
description: 将代币转账到目标地址
---

将代币从您的钱包转账到目标地址。如果目标钱包没有代币账户，将自动创建。

## 基本用法

```bash
mplx toolbox token transfer <mintAddress> <amount> <destination>
```

## 参数

| 参数 | 描述 |
|----------|-------------|
| `mintAddress` | 要转账的代币的铸币地址 |
| `amount` | 要转账的代币数量（以基点为单位） |
| `destination` | 目标钱包地址 |

## 示例

### 向目标地址转账 100 个代币

```bash
mplx toolbox token transfer 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU 10000000000 9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM
```

## 输出

命令将在转账代币时显示进度指示器，并在成功后显示交易签名：

```
--------------------------------
Token Transfer
--------------------------------
⠋ Transferring tokens...
✔ Tokens Transferred Successfully!
--------------------------------
'Tokens Transferred Successfully!'
Signature: 2xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
--------------------------------
```

## 注意事项

- 如果目标地址没有代币账户，命令会自动创建
- 数量以基点指定（1 个代币 = 1,000,000,000 基点）
- 如果创建新代币账户，交易需要 SOL 作为租金豁免
- 转账前确保您的钱包中有足够的代币

## 错误处理

如果转账失败，命令将显示错误消息并抛出异常。常见错误包括：

- 代币余额不足
- 无效的铸币地址
- 无效的目标地址
- 网络错误

## 相关命令

- [创建代币](/zh/dev-tools/cli/toolbox/token-create) - 创建新代币
- [余额检查](/zh/dev-tools/cli/toolbox/sol-balance) - 检查代币余额
- [SOL 转账](/zh/dev-tools/cli/toolbox/sol-transfer) - 在地址之间转账 SOL
