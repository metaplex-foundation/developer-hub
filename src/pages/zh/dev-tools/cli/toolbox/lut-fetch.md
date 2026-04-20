---
# Remember to also update the date in src/components/products/guides/index.js
title: 获取地址查找表
metaTitle: 获取地址查找表 | Metaplex CLI
description: 获取并显示 Solana 地址查找表（LUT）的内容。
keywords:
  - mplx CLI
  - Address Lookup Table
  - LUT
  - fetch LUT
  - Solana
about:
  - Metaplex CLI
  - Address Lookup Tables
  - Solana
proficiencyLevel: Intermediate
created: '04-20-2026'
updated: '04-20-2026'
---

## 摘要

`mplx toolbox lut fetch` 命令从网络读取地址查找表，并打印其权限持有者和包含的地址。

- 解析 LUT 账户并列出其中的每一个地址。
- 打印权限持有者，或对于被冻结的 LUT 显示 `None`。
- 在详细模式下额外显示停用 slot 和最后扩展 slot。
- 通过 `--json` 支持机器可读的 JSON 输出。

## 快速参考

| 项目 | 值 |
|------|-------|
| 命令 | `mplx toolbox lut fetch <address>` |
| 必需参数 | `address` — LUT 的公钥 |
| 可选标志 | `--verbose`、`--json` |
| 只读 | 是 — 不发送交易 |

## 基本用法

将 LUT 地址作为唯一的位置参数传入以获取该 LUT。

```bash
mplx toolbox lut fetch <address>
```

## 参数

该命令接受一个位置参数，用于标识 LUT。

- `address` *(必需)*：要获取的 LUT 的公钥。

## 标志

可选标志可扩展输出。

- `--verbose`：显示额外详情（停用 slot、最后扩展 slot）。
- `--json`：输出结构化 JSON，而非格式化文本。

## 示例

这些示例展示了默认、详细和 JSON 输出模式。

```bash
mplx toolbox lut fetch <address>
mplx toolbox lut fetch <address> --verbose
mplx toolbox lut fetch <address> --json
```

## 输出

默认输出会列出权限持有者、地址总数以及表中每一个地址。

```
--------------------------------
Address Lookup Table Details
LUT Address: <lut_address>
Authority: <authority_pubkey>
Total Addresses: <count>

Addresses in Table:
    1. <address1>
    2. <address2>
--------------------------------
```

## 注意事项

- `deactivationSlot` 为 `0` 表示该 LUT 仍处于激活状态。
- 使用 [`toolbox lut create`](/dev-tools/cli/toolbox/lut-create) 创建 LUT。
