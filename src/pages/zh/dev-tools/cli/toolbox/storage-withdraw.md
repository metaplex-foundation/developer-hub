---
# Remember to also update the date in src/components/products/guides/index.js
title: 存储提取
metaTitle: 存储提取 | Metaplex CLI
description: 将资金从您的存储提供商账户提取回您的钱包。
keywords:
  - mplx CLI
  - storage withdraw
  - Irys
  - Arweave
  - storage provider
about:
  - Metaplex CLI
  - Storage Providers
proficiencyLevel: Beginner
created: '04-20-2026'
updated: '04-20-2026'
---

## 摘要

`mplx toolbox storage withdraw` 命令将 SOL 从您的存储提供商账户提取回您的钱包。

- 提取指定数量的 SOL，或使用 `--all` 提取全部余额。
- 需要 `amount` 或 `--all` 之一 — 两者不能同时使用。
- 资金返还至配置为 CLI 付款人的钱包。
- 成功时打印新的存储余额。

## 快速参考

| 项目 | 值 |
|------|-------|
| 命令 | `mplx toolbox storage withdraw [amount] [--all]` |
| 可选参数 | `amount` — SOL 数量（若未设置 `--all` 则必需） |
| 可选标志 | `--all` — 提取全部余额 |
| 提供商 | 当前激活的存储提供商（例如 Irys） |
| 反向操作 | [`toolbox storage fund`](/dev-tools/cli/toolbox/storage-fund) |

## 基本用法

传入数量以提取特定金额，或使用 `--all` 清空全部余额。

```bash
# Withdraw a specific amount
mplx toolbox storage withdraw <amount>

# Withdraw all funds
mplx toolbox storage withdraw --all
```

## 参数

在未设置 `--all` 时，唯一的位置参数用于指定数量。

- `amount` *(除非设置 `--all` 否则必需)*：要提取的 SOL 数量。

## 标志

可选标志可清空全部余额。

- `--all`：从存储账户提取全部余额。

## 示例

这些示例展示了固定数量和全部提取两种方式。

```bash
mplx toolbox storage withdraw 0.05
mplx toolbox storage withdraw --all
```

## 输出

成功时，命令将打印存储账户的新余额。

## 注意事项

- 提供数量或 `--all` 之一 — 两者不能同时使用。
- 资金返还至配置为 CLI 付款人的钱包。
- 使用 [`toolbox storage balance`](/dev-tools/cli/toolbox/storage-balance) 查看当前余额。
