---
# Remember to also update the date in src/components/products/guides/index.js
title: 关闭地址查找表
metaTitle: 关闭地址查找表 | Metaplex CLI
description: 关闭已停用的地址查找表（LUT）并回收其租金。
keywords:
  - mplx CLI
  - Address Lookup Table
  - LUT
  - close LUT
  - reclaim rent
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

`mplx toolbox lut close` 命令关闭先前已停用的地址查找表，并将其租金返还给接收方钱包。

- 永久移除该 LUT 账户及其中存储的每一个地址。
- 要求该 LUT 已停用至少 512 个 slot（主网约 5 分钟）。
- 默认将租金回收到当前身份，或回收到 `--recipient` 指定的地址。
- 只有当前身份（或 `--authority`）与 LUT 的权限持有者匹配时才会成功。

## 快速参考

| 项目 | 值 |
|------|-------|
| 命令 | `mplx toolbox lut close <address>` |
| 必需参数 | `address` — LUT 的公钥 |
| 可选标志 | `--recipient <pubkey>`、`--authority <pubkey>` |
| 前置条件 | 通过 [`toolbox lut deactivate`](/dev-tools/cli/toolbox/lut-deactivate) 停用的 LUT |
| 最小等待时间 | 停用后 512 个 slot |
| 可逆 | 否 |

## 基本用法

将 LUT 地址作为唯一的位置参数传入以关闭已停用的 LUT。

```bash
mplx toolbox lut close <address>
```

## 参数

该命令接受一个位置参数，用于标识要关闭的 LUT。

- `address` *(必需)*：要关闭的 LUT 的公钥。

## 标志

可选标志可覆盖默认的接收方和权限持有者。

- `--recipient <pubkey>`：回收租金的接收方。默认为当前身份。
- `--authority <pubkey>`：LUT 的权限持有者公钥。默认为当前身份。

## 示例

以下示例涵盖常见的关闭场景。

```bash
mplx toolbox lut close <address>
mplx toolbox lut close <address> --recipient <recipient-pubkey>
mplx toolbox lut close <address> --authority <authority-pubkey>
```

## 输出

成功时，命令将打印已关闭的 LUT 地址和交易签名。

```
--------------------------------
Address Lookup Table Closed
LUT Address: <lut_address>
Signature: <transaction_signature>
--------------------------------
```

## 注意事项

- 必须先通过 [`toolbox lut deactivate`](/dev-tools/cli/toolbox/lut-deactivate) 停用该 LUT。
- 停用和关闭之间必须经过至少 512 个 slot（主网约 5 分钟）。
- 关闭不可逆 — LUT 及其包含的地址将被永久移除。
- 只有 LUT 的权限持有者才能关闭它。
