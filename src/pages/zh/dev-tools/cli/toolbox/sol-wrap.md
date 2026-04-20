---
# Remember to also update the date in src/components/products/guides/index.js
title: 包装 SOL
metaTitle: 包装 SOL | Metaplex CLI
description: 将原生 SOL 包装为 wSOL（包装 SOL）代币。
keywords:
  - mplx CLI
  - wrap SOL
  - wSOL
  - wrapped SOL
  - Solana
about:
  - Metaplex CLI
  - Wrapped SOL
proficiencyLevel: Beginner
created: '04-20-2026'
updated: '04-20-2026'
---

## 摘要

`mplx toolbox sol wrap` 命令通过将 SOL 转账到原生 mint 关联代币账户并同步余额，来将原生 SOL 包装为 wSOL。

- 如果 wSOL 关联代币账户尚不存在，则创建它。
- 将指定数量添加到当前身份的 wSOL 余额。
- 数量必须是以 SOL 表示的正数（允许小数）。
- [`toolbox sol unwrap`](/dev-tools/cli/toolbox/sol-unwrap) 的反向操作。

## 快速参考

| 项目 | 值 |
|------|-------|
| 命令 | `mplx toolbox sol wrap <amount>` |
| 必需参数 | `amount` — SOL 数量（例如 `1`、`0.5`） |
| 标志 | 无 |
| 原生 mint | `So11111111111111111111111111111111111111112` |
| 反向操作 | [`toolbox sol unwrap`](/dev-tools/cli/toolbox/sol-unwrap) |

## 基本用法

将要包装的 SOL 数量作为唯一的位置参数传入。

```bash
mplx toolbox sol wrap <amount>
```

## 参数

该命令接受一个位置参数来指定数量。

- `amount` *(必需)*：要包装的 SOL 数量（例如 `1` 或 `0.5`）。必须大于 `0`。

## 示例

这些示例展示了整数和小数数量。

```bash
mplx toolbox sol wrap 1
mplx toolbox sol wrap 0.5
```

## 输出

成功时，命令将打印包装数量、wSOL 代币账户和交易签名。

```
--------------------------------
    Wrapped <amount> SOL to wSOL
    Token Account: <associated_token_account>
    Signature: <transaction_signature>
    Explorer: <explorer_url>
--------------------------------
```

## 注意事项

- 如果 wSOL 关联代币账户尚不存在，将在同一笔交易中创建它。
- 原生 mint 地址为 `So11111111111111111111111111111111111111112`。
- 使用 [`toolbox sol unwrap`](/dev-tools/cli/toolbox/sol-unwrap) 进行解包。
