---
title: SOL 转账
description: 向指定地址转账 SOL
---

`mplx toolbox sol transfer` 命令允许您将 SOL 从当前钱包转账到任何 Solana 地址。

## 基本用法

```bash
mplx toolbox sol transfer <amount> <address>
```

## 参数

- `amount`: 要转账的 SOL 数量（必需）
- `address`: 要转账 SOL 的 Solana 地址（必需）

## 示例

### 向地址转账 1 SOL
```bash
mplx toolbox sol transfer 1 5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa
```

## 输出

成功转账后，命令将显示：
```
--------------------------------
    Transferred <amount> SOL to <address>
    Signature: <transactionSignature>
--------------------------------
```

## 注意事项

- 转账金额以 SOL 为单位指定（不是 lamports）
- 目标地址必须是有效的 Solana 公钥
- 该命令需要连接到 Solana 网络（mainnet/devnet/testnet）
- 确保您的钱包中有足够的 SOL 进行转账
- 提供交易签名以供验证
- 一旦在区块链上确认，转账是不可逆的
