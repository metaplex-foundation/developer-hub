---
# Remember to also update the date in src/components/products/guides/index.js
title: 存储充值
metaTitle: 存储充值 | Metaplex CLI
description: 用 SOL 为您的存储提供商账户充值。
keywords:
  - mplx CLI
  - storage fund
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

`mplx toolbox storage fund` 命令将 SOL 存入您的存储提供商账户，以便后续上传具有可用信用额度。

- 将 SOL 从当前 CLI 付款人转账至存储提供商。
- 数量以 SOL 指定（允许小数）。
- 成功时打印新的存储余额。
- 在大规模上传前使用，以避免运行中途出现充值提示。

## 快速参考

下表总结了该命令的输入和相关命令。

| 项目 | 值 |
|------|-------|
| 命令 | `mplx toolbox storage fund <amount>` |
| 必需参数 | `amount` — 要存入的 SOL 数量 |
| 标志 | 无 |
| 提供商 | 当前激活的存储提供商（例如 Irys） |
| 反向操作 | [`toolbox storage withdraw`](/dev-tools/cli/toolbox/storage-withdraw) |

## 基本用法

将要存入的 SOL 数量作为唯一的位置参数传入。

```bash
mplx toolbox storage fund <amount>
```

## 参数

该命令接受一个位置参数来指定数量。

- `amount` *(必需)*：要存入存储账户的 SOL 数量。

## 示例

这些示例展示了小数和整数 SOL 的存入方式。

```bash
mplx toolbox storage fund 0.1
mplx toolbox storage fund 1
```

## 输出

成功时，命令将打印存储账户的新余额。

## 注意事项

- 资金从配置为 CLI 付款人的钱包中转出。
- 使用 [`toolbox storage balance`](/dev-tools/cli/toolbox/storage-balance) 查看当前余额。
- 可以使用 [`toolbox storage withdraw`](/dev-tools/cli/toolbox/storage-withdraw) 取回资金。
