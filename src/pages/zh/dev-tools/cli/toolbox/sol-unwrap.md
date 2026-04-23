---
# Remember to also update the date in src/components/products/guides/index.js
title: 解包 SOL
metaTitle: 解包 SOL | Metaplex CLI
description: 将所有 wSOL（包装 SOL）代币解包回原生 SOL。
keywords:
  - mplx CLI
  - wSOL
  - wrapped SOL
  - unwrap SOL
  - Solana
about:
  - Metaplex CLI
  - Wrapped SOL
proficiencyLevel: Beginner
created: '04-20-2026'
updated: '04-20-2026'
---

## 摘要

`mplx toolbox sol unwrap` 命令通过关闭关联的代币账户来解包全部 wSOL 余额，并将 SOL 返还给所有者。

- 关闭 wSOL 关联代币账户，并将全部 SOL 返还给当前身份。
- 不接受任何参数或标志。
- 要么全部解包要么完全不解包 — 不支持部分解包。
- 如果当前钱包不存在 wSOL 代币账户，则会失败。

## 快速参考

下表总结了该命令的结构和关键常量。

| 项目 | 值 |
|------|-------|
| 命令 | `mplx toolbox sol unwrap` |
| 参数 | 无 |
| 标志 | 无 |
| 原生 mint | `So11111111111111111111111111111111111111112` |
| 反向操作 | [`toolbox sol wrap`](/dev-tools/cli/toolbox/sol-wrap) |

## 基本用法

不带参数运行该命令，即可解包当前钱包的全部 wSOL 余额。

```bash
mplx toolbox sol unwrap
```

## 示例

该命令只有一种调用形式。

```bash
mplx toolbox sol unwrap
```

## 输出

成功时，命令将打印解包数量、已关闭的代币账户和交易签名。

```
--------------------------------
    Unwrapped <amount> SOL
    Token Account Closed: <associated_token_account>
    Signature: <transaction_signature>
    Explorer: <explorer_url>
--------------------------------
```

## 注意事项

- 解包是全有或全无的操作 — 整个 wSOL 余额都会被转换回 SOL，并且代币账户会被关闭。
- 如果当前钱包不存在 wSOL 代币账户，则会失败。
- 使用 [`toolbox sol wrap`](/dev-tools/cli/toolbox/sol-wrap) 进行包装。
