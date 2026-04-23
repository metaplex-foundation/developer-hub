---
# Remember to also update the date in src/components/products/guides/index.js
title: 创建地址查找表
metaTitle: 创建地址查找表 | Metaplex CLI
description: 创建一个新的 Solana 地址查找表（LUT），可选地包含初始地址。
keywords:
  - mplx CLI
  - Address Lookup Table
  - LUT
  - create LUT
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

`mplx toolbox lut create` 命令创建一个新的 Solana 地址查找表（LUT），并且在提供地址时会在同一笔交易中对其进行扩展。

- 根据权限持有者和一个近期 slot 派生 LUT 地址。
- 接受一个可选的、以逗号分隔的公钥列表作为初始条目。
- 除非传入 `--authority`，否则权限持有者默认为当前身份。
- 成功时返回 LUT 地址和交易签名。

## 快速参考

下表总结了该命令的语法和默认值。

| 项目 | 值 |
|------|-------|
| 命令 | `mplx toolbox lut create [addresses]` |
| 可选参数 | `addresses` — 以逗号分隔的公钥列表 |
| 可选标志 | `--recentSlot <number>`、`--authority <pubkey>` |
| LUT 地址 | 由 `authority` + `recentSlot` 派生的 PDA |
| 后续操作 | [`toolbox lut fetch`](/dev-tools/cli/toolbox/lut-fetch)、[`toolbox lut deactivate`](/dev-tools/cli/toolbox/lut-deactivate)、[`toolbox lut close`](/dev-tools/cli/toolbox/lut-close) |

## 基本用法

不带参数运行该命令以创建空 LUT，或传入以逗号分隔的公钥列表来初始化它。

```bash
# Create an empty LUT
mplx toolbox lut create

# Create a LUT with initial addresses
mplx toolbox lut create "<pubkey1>,<pubkey2>"
```

## 参数

唯一的位置参数是一个可选的、以逗号分隔的公钥列表。

- `addresses` *(可选)*：要包含在 LUT 中的、以逗号分隔的公钥列表。

## 标志

可选标志可覆盖默认的近期 slot 和权限持有者。

- `--recentSlot <number>`：用于派生 LUT PDA 的近期 slot。默认为最新的 slot。
- `--authority <pubkey>`：LUT 的权限持有者公钥。默认为当前身份。

## 示例

这些示例展示了空 LUT、带初始地址的 LUT 以及自定义权限持有者的 LUT 的创建方式。

```bash
mplx toolbox lut create
mplx toolbox lut create "11111111111111111111111111111111,TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
mplx toolbox lut create "11111111111111111111111111111111" --authority <authority-pubkey>
```

## 输出

成功时，命令将打印新的 LUT 地址和交易签名。

```
--------------------------------
Address Lookup Table Created
LUT Address: <lut_address>
Signature: <transaction_signature>
--------------------------------
```

## 注意事项

- LUT 地址是从权限持有者和近期 slot 派生出的 PDA。
- 使用 [`toolbox lut fetch`](/dev-tools/cli/toolbox/lut-fetch) 读取其内容。
- 要移除 LUT，请先使用 [`toolbox lut deactivate`](/dev-tools/cli/toolbox/lut-deactivate) 停用它，然后使用 [`toolbox lut close`](/dev-tools/cli/toolbox/lut-close) 将其关闭。
