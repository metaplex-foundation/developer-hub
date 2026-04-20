---
# Remember to also update the date in src/components/products/guides/index.js
title: 铸造代币
metaTitle: 铸造代币 | Metaplex CLI
description: 从已有的 SPL mint 中向接收方钱包铸造额外的代币。
keywords:
  - mplx CLI
  - mint tokens
  - SPL token
  - mint authority
  - Solana
about:
  - Metaplex CLI
  - SPL Token
proficiencyLevel: Beginner
created: '04-20-2026'
updated: '04-20-2026'
programmingLanguage:
  - Bash
---

## 摘要

`mplx toolbox token mint` 命令向接收方钱包铸造现有 SPL 代币的额外单位。

- 要求当前身份持有指定 mint 的铸造权限。
- 如果接收方的关联代币账户不存在，则会即时创建。
- 除非传入 `--recipient`，否则接收方默认为当前身份。
- 数量以原始代币单位表示 — 除以 `10^decimals` 才能得到显示单位。

## 快速参考

| 项目 | 值 |
|------|-------|
| 命令 | `mplx toolbox token mint <mint> <amount>` |
| 必需参数 | `mint`、`amount`（整数且大于 0） |
| 可选标志 | `--recipient <pubkey>` |
| 数量单位 | 原始代币单位（非显示单位） |
| 相关命令 | [`toolbox token create`](/dev-tools/cli/toolbox/token-create) |

## 基本用法

将 mint 地址和数量作为位置参数传入。

```bash
mplx toolbox token mint <mint> <amount>
```

## 参数

该命令接受两个位置参数。

- `mint` *(必需)*：代币的 mint 地址。
- `amount` *(必需)*：要铸造的代币数量。必须大于 `0`。

## 标志

可选标志可覆盖默认的接收方。

- `--recipient <pubkey>`：将接收所铸造代币的钱包。默认为当前身份。

## 示例

这些示例展示了向当前身份铸造和向特定接收方铸造。

```bash
mplx toolbox token mint 7EYnhQoR9YM3c7UoaKRoA4q6YQ2Jx4VvQqKjB5x8XqWs 1000
mplx toolbox token mint 7EYnhQoR9YM3c7UoaKRoA4q6YQ2Jx4VvQqKjB5x8XqWs 1000 --recipient 9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM
```

## 输出

成功时，命令将打印 mint 地址、接收方、铸造数量和交易签名。

```
--------------------------------
Tokens minted successfully!

Mint Details:
Mint Address: <mint>
Recipient: <recipient>
Amount Minted: <amount>

Transaction Signature: <signature>
Explorer: <explorer_url>
--------------------------------
```

## 注意事项

- `amount` 以原始代币单位表示。除以 `10^decimals` 可得到显示单位。
- 如果接收方的关联代币账户不存在，将会即时创建。
- 您必须持有该 mint 的铸造权限 — 否则交易将失败。
- 使用 [`toolbox token create`](/dev-tools/cli/toolbox/token-create) 创建新的代币。
