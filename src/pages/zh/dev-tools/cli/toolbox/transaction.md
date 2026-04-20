---
# Remember to also update the date in src/components/products/guides/index.js
title: 执行交易
metaTitle: 执行交易 | Metaplex CLI
description: 使用当前钱包签名并发送任意 base64 编码的 Solana 指令。
keywords:
  - mplx CLI
  - execute transaction
  - base64 instruction
  - MPL Core execute
  - Solana
about:
  - Metaplex CLI
  - Solana Transactions
proficiencyLevel: Advanced
created: '04-20-2026'
updated: '04-20-2026'
---

## 摘要

`mplx toolbox transaction` 命令使用当前钱包签名并发送任意 base64 编码的 Solana 指令。

- 通过 `--instruction`（可重复）接受一个或多个 base64 编码的指令。
- 使用 `--stdin` 时会逐行从标准输入读取指令。
- 当激活的是 [asset-signer 钱包](/dev-tools/cli/config/asset-signer-wallets)时，会自动将指令包装在 MPL Core 的 `execute` 调用中。
- `--instruction` 和 `--stdin` 互斥。

## 快速参考

下表总结了该命令的标志和封装行为。

| 项目 | 值 |
|------|-------|
| 命令 | `mplx toolbox transaction --instruction <b64>` |
| 标志 | `-i, --instruction <b64>`（可重复）、`--stdin` |
| 输入 | Base64 编码的 Solana 指令 |
| Asset-signer 钱包 | 指令会被包装在 MPL Core `execute` 中 |
| 互斥 | `--instruction` 和 `--stdin` |

## 基本用法

通过 `--instruction` 传入每条 base64 编码的指令，或通过 stdin 管道传入。

```bash
# Pass one or more instructions via flag
mplx toolbox transaction --instruction <base64>

# Pipe base64 instructions via stdin (one per line)
echo "<base64>" | mplx toolbox transaction --stdin
```

## 标志

该命令完全由标志驱动。

- `-i, --instruction <base64>`：base64 编码的指令。可重复以包含多条指令。
- `--stdin`：从 stdin 读取 base64 指令，每行一条。与 `--instruction` 互斥。

## 示例

这些示例展示了单条指令、批量指令和管道调用。

```bash
mplx toolbox transaction --instruction <base64EncodedInstruction>
mplx toolbox transaction --instruction <ix1> --instruction <ix2>
echo "<base64>" | mplx toolbox transaction --stdin
```

## 输出

成功时，命令将打印签名者、指令数量和交易签名。

```
--------------------------------
  Signer:         <wallet_pubkey>
  Instructions:   <count>
  Signature:      <signature>
--------------------------------
<explorer_url>
```

## 注意事项

- 批次中的每条指令都将使用当前钱包的身份进行签名。
- 如果激活了 [asset-signer 钱包](/dev-tools/cli/config/asset-signer-wallets)，指令将自动包装在 MPL Core 的 `execute` 指令中。
- 此命令是一个兜底通道 — 请尽可能优先使用专用命令。
