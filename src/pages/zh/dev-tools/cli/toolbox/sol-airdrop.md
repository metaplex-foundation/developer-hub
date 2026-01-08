---
title: SOL 空投
metaTitle: SOL 空投 | Metaplex CLI
description: 向指定地址空投 SOL
---

`mplx toolbox sol airdrop` 命令允许您向指定地址空投 SOL。这对于测试和开发目的非常有用。

## 基本用法

### 空投到当前钱包
```bash
mplx toolbox sol airdrop <amount>
```

### 空投到指定地址
```bash
mplx toolbox sol airdrop <amount> <address>
```

## 参数

- `amount`: 要空投的 SOL 数量（必需）
- `address`: 要空投 SOL 的地址（可选，默认为当前钱包）

## 示例

### 向当前钱包空投 1 SOL
```bash
mplx toolbox sol airdrop 1
```

### 向指定地址空投 2 SOL
```bash
mplx toolbox sol airdrop 2 5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa
```

## 输出

成功空投后，命令将显示：
```
--------------------------------
    Airdropped <amount> SOL to <address>
--------------------------------
```

## 注意事项

- 此命令主要用于测试和开发目的
- 空投数量以 SOL 为单位指定（不是 lamports）
- 如果未提供地址，SOL 将空投到当前钱包地址
- 该命令需要连接到开发网络（devnet/testnet）
- 确保您的钱包中有足够的 SOL 进行空投操作
