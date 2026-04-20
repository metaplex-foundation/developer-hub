---
# Remember to also update the date in src/components/products/guides/index.js
title: 停用地址查找表
metaTitle: 停用地址查找表 | Metaplex CLI
description: 停用地址查找表（LUT），作为关闭它之前的第一步。
keywords:
  - mplx CLI
  - Address Lookup Table
  - LUT
  - deactivate LUT
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

`mplx toolbox lut deactivate` 命令停用地址查找表，使其之后可以被关闭并回收租金。

- 阻止向该 LUT 添加新地址。
- 是 `toolbox lut close` 回收租金之前的必需步骤。
- 需要等待约 512 个 slot（主网约 5 分钟）后才能关闭。
- 只有 LUT 的权限持有者才能停用该表。

## 快速参考

| 项目 | 值 |
|------|-------|
| 命令 | `mplx toolbox lut deactivate <address>` |
| 必需参数 | `address` — LUT 的公钥 |
| 可选标志 | `--authority <pubkey>` |
| 冷却时间 | 关闭 LUT 前需等待 512 个 slot |
| 下一步 | [`toolbox lut close`](/dev-tools/cli/toolbox/lut-close) |

## 基本用法

将 LUT 地址作为唯一的位置参数传入以停用该 LUT。

```bash
mplx toolbox lut deactivate <address>
```

## 参数

该命令接受一个位置参数，用于标识 LUT。

- `address` *(必需)*：要停用的 LUT 的公钥。

## 标志

可选标志可覆盖默认的权限持有者。

- `--authority <pubkey>`：LUT 的权限持有者公钥。默认为当前身份。

## 示例

这些示例展示了默认和自定义权限持有者的停用流程。

```bash
mplx toolbox lut deactivate <address>
mplx toolbox lut deactivate <address> --authority <authority-pubkey>
```

## 输出

成功时，命令将打印已停用的 LUT 地址和交易签名。

```
--------------------------------
Address Lookup Table Deactivated
LUT Address: <lut_address>
Signature: <transaction_signature>
--------------------------------
```

## 注意事项

- 停用后将阻止再向其中添加任何地址。
- 停用后必须等待约 512 个 slot（主网约 5 分钟）才能关闭该 LUT。
- 只有 LUT 的权限持有者才能将其停用。
- 等待期过后，使用 [`toolbox lut close`](/dev-tools/cli/toolbox/lut-close) 关闭 LUT。
