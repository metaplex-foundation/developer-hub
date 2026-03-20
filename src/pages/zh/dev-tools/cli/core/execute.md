---
title: Execute
metaTitle: Execute | Metaplex CLI
description: 使用Metaplex CLI检查MPL Core资产的签名者PDA地址和SOL余额，了解execute如何包装交易。
keywords:
  - mplx cli
  - core execute
  - asset signer PDA
  - MPL Core execute
  - metaplex cli execute
  - PDA wallet
  - execute info
about:
  - MPL Core Execute instruction
  - Asset-signer PDA
  - Metaplex CLI
proficiencyLevel: Intermediate
created: '03-19-2026'
updated: '03-20-2026'
---

## 概述

`mplx core asset execute info`命令显示任意[MPL Core资产](/core)的签名者PDA地址和当前SOL余额。签名者PDA是一个确定性的程序派生地址，可以代表资产持有SOL、代币和拥有其他资产。

- 派生并显示任意Core资产的签名者PDA地址
- 在返回结果之前验证资产在链上是否存在
- 显示PDA的当前SOL余额
- 与[资产签名者钱包](/dev-tools/cli/config/asset-signer-wallets)配合使用以实现完整的PDA钱包功能

## 基本用法

```bash {% title="Get execute info for an asset" %}
mplx core asset execute info <assetId>
```

## 参数

| 参数 | 描述 |
|------|------|
| `ASSET_ID` | 要派生签名者PDA的[MPL Core资产](/core)地址 |

## 全局标志

| 标志 | 描述 |
|------|------|
| `-c, --config <value>` | 配置文件路径。默认为`~/.config/mplx/config.json` |
| `-k, --keypair <value>` | 密钥对文件或Ledger路径（例如：`usb://ledger?key=0`） |
| `-p, --payer <value>` | 付款者密钥对文件或Ledger路径 |
| `-r, --rpc <value>` | 集群的RPC URL |
| `--commitment <option>` | 承诺级别：`processed`、`confirmed`或`finalized` |
| `--json` | 将输出格式化为JSON |
| `--log-level <option>` | 日志级别：`debug`、`warn`、`error`、`info`或`trace`（默认：`info`） |

## 示例

### 显示资产的PDA信息

```bash {% title="Get signer PDA info" %}
mplx core asset execute info 5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa
```

输出：

``` {% title="execute info output" %}
--------------------------------
  Asset:         5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa
  Signer PDA:    7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
  SOL Balance:   0.1 SOL
--------------------------------
```

### 获取结构化JSON输出

```bash {% title="Execute info with JSON output" %}
mplx core asset execute info <assetId> --json
```

返回：

```json {% title="JSON response" %}
{
  "asset": "<assetId>",
  "signerPda": "<pdaAddress>",
  "balance": 0.1
}
```

### 检查后为PDA注资

检查PDA然后为其注资的常见工作流程：

```bash {% title="Inspect and fund the PDA" %}
# 1. 获取PDA地址
mplx core asset execute info <assetId>

# 2. 向PDA发送SOL
mplx toolbox sol transfer 0.1 <signerPdaAddress>

# 3. 确认余额
mplx core asset execute info <assetId>
```

## Execute的工作原理

每个[MPL Core](/core)资产都有一个使用`findAssetSignerPda`从其地址派生的确定性签名者PDA。该PDA可以作为钱包使用——持有SOL、拥有代币，并通过链上`execute`指令签署指令。

典型的工作流程：

1. **派生PDA** — 使用`mplx core asset execute info <assetId>`查找PDA地址
2. **为PDA注资** — 使用`mplx toolbox sol transfer`向PDA地址发送SOL
3. **注册为钱包** — 使用`mplx config wallets add <name> --asset <assetId>`将资产添加为[资产签名者钱包](/dev-tools/cli/config/asset-signer-wallets)
4. **正常使用** — 当资产签名者钱包处于活动状态时，所有CLI命令会自动包装在`execute`指令中

{% callout type="note" %}
`info`是唯一的execute子命令。要以PDA身份执行操作，请将资产注册为[资产签名者钱包](/dev-tools/cli/config/asset-signer-wallets)——所有常规CLI命令将自动以`execute`透明包装。
{% /callout %}

## 快速参考

| 项目 | 值 |
|------|-----|
| 命令 | `mplx core asset execute info` |
| 适用于 | 仅[MPL Core资产](/core) |
| 相关 | [资产签名者钱包](/dev-tools/cli/config/asset-signer-wallets) |
| PDA派生 | `findAssetSignerPda(umi, { asset: assetPubkey })` |
| 源码 | [GitHub — metaplex-foundation/cli](https://github.com/metaplex-foundation/cli) |

## 注意事项

- 签名者PDA是确定性的——相同的资产始终生成相同的PDA地址
- PDA可以持有SOL、SPL代币，甚至拥有其他[MPL Core资产](/core)
- 只有资产所有者（或授权的委托人）才能为给定资产的PDA调用`execute`指令
- 命令在派生PDA之前会验证资产在链上是否存在；不存在的资产将产生错误
- 显示的余额仅为SOL余额——要检查代币余额，请激活[资产签名者钱包](/dev-tools/cli/config/asset-signer-wallets)并使用`mplx toolbox sol balance`
- 这是一个只读命令——不会创建或修改任何链上状态
- 由于Solana CPI约束，某些操作无法包装在`execute`中——参见[CPI限制](/dev-tools/cli/config/asset-signer-wallets#cpi-limitations)
