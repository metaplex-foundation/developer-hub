---
# Remember to also update the date in src/components/products/guides/index.js
title: 租金
metaTitle: 租金 | Metaplex CLI
description: 计算指定大小账户的 Solana 租金成本。
keywords:
  - mplx CLI
  - Solana rent
  - rent exemption
  - account size
  - lamports
about:
  - Metaplex CLI
  - Solana Rent
proficiencyLevel: Beginner
created: '04-20-2026'
updated: '04-20-2026'
---

## 摘要

`mplx toolbox rent` 命令返回指定大小的 Solana 账户所需的免租余额。

- 直接从配置的 RPC 读取当前租金费率。
- 默认以 SOL 输出，使用 `--lamports` 可输出原始 lamports。
- 传入 `--noHeader` 时会排除 128 字节的账户头。
- 只读 — 不发送交易。

## 快速参考

| 项目 | 值 |
|------|-------|
| 命令 | `mplx toolbox rent <bytes>` |
| 必需参数 | `bytes` — 整数字节数 |
| 可选标志 | `--lamports`、`--noHeader` |
| 只读 | 是 — 不发送交易 |
| 常见大小 | SPL mint = 82 字节 · SPL token account = 165 字节 |

## 基本用法

将账户大小（字节）作为唯一的位置参数传入。

```bash
mplx toolbox rent <bytes>
```

## 参数

该命令接受一个整数位置参数。

- `bytes` *(必需)*：账户将占用的字节数。

## 标志

可选标志可调整单位以及是否包含账户头。

- `--noHeader`：在计算租金时忽略 128 字节的账户头。
- `--lamports`：以 lamports 而非 SOL 显示租金成本。

## 示例

这些示例涵盖常见的租金计算场景。

```bash
# Rent for a 165-byte SPL token account
mplx toolbox rent 165

# Rent in lamports
mplx toolbox rent 165 --lamports

# Exclude the 128-byte account header
mplx toolbox rent 165 --noHeader
```

## 输出

默认输出会以 SOL 形式打印给定字节大小对应的免租余额。

```
--------------------------------
    Rent cost for <bytes> bytes is <amount> SOL
--------------------------------
```

## 注意事项

- Solana 账户必须至少持有免租最低余额，否则会被清除。
- 常见大小：SPL token account = `165` 字节，SPL mint = `82` 字节。
