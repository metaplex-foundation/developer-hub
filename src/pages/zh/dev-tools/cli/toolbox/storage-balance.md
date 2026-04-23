---
# Remember to also update the date in src/components/products/guides/index.js
title: 存储余额
metaTitle: 存储余额 | Metaplex CLI
description: 显示您的存储提供商账户的当前余额。
keywords:
  - mplx CLI
  - storage balance
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

`mplx toolbox storage balance` 命令打印在配置的存储提供商处持有的当前预付余额。

- 从当前激活的存储提供商（例如 Irys）读取余额。
- 不接受任何参数或标志。
- 输出一个 JSON 对象，包含 `basisPoints`（lamports）以及以 SOL 计价的金额。
- 与您的钱包 SOL 余额分开 — 只反映存储信用额度。

## 快速参考

下表总结了该命令的结构和输出格式。

| 项目 | 值 |
|------|-------|
| 命令 | `mplx toolbox storage balance` |
| 参数 | 无 |
| 标志 | 无 |
| 输出格式 | JSON |
| 充值 | [`toolbox storage fund`](/dev-tools/cli/toolbox/storage-fund) |
| 提取 | [`toolbox storage withdraw`](/dev-tools/cli/toolbox/storage-withdraw) |

## 基本用法

不带参数运行该命令。

```bash
mplx toolbox storage balance
```

## 示例

该命令只有一种调用形式。

```bash
mplx toolbox storage balance
```

## 输出

命令以 JSON 形式打印余额，包含 `basisPoints`（lamports）以及以 SOL 计价的金额。

## 注意事项

- 存储余额是在存储提供商（例如 Irys）处持有的预付信用额度。它与您的钱包 SOL 余额是分开的。
- 使用 [`toolbox storage fund`](/dev-tools/cli/toolbox/storage-fund) 充值，或使用 [`toolbox storage withdraw`](/dev-tools/cli/toolbox/storage-withdraw) 提取。
