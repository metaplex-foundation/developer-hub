---
title: 联合曲线
metaTitle: 联合曲线 | Metaplex CLI
description: 使用 Metaplex CLI 创建联合曲线代币发行、买卖代币、检查曲线状态并查看联合曲线 bucket。
keywords:
  - genesis bonding curve
  - genesis swap
  - bonding curve
  - mplx genesis swap
  - token swap
  - buy tokens
  - sell tokens
  - Metaplex CLI
about:
  - Genesis bonding curve
  - token swap
  - constant product AMM
  - Metaplex CLI
proficiencyLevel: Intermediate
programmingLanguage:
  - Bash
created: '04-09-2026'
updated: '04-09-2026'
howToSteps:
  - Create a bonding curve launch with genesis launch create --launchType bonding-curve
  - Buy tokens with genesis swap --buyAmount or sell with --sellAmount
  - Use genesis swap --info to check curve status and get price quotes
  - Inspect the bucket with genesis bucket fetch --type bonding-curve
howToTools:
  - Metaplex CLI (mplx)
faqs:
  - q: 联合曲线使用什么定价模型？
    a: 联合曲线使用恒积公式。随着更多代币被购买，价格上涨；随着代币被卖出，价格下降。
  - q: 购买前需要先包装 SOL 吗？
    a: 不需要。使用 SOL 购买时，兑换命令会在需要时自动将 SOL 包装为 WSOL。
  - q: 如何在兑换前检查价格？
    a: 使用 --info 标志显示曲线状态。将 --info 与 --buyAmount 或 --sellAmount 组合使用，可获取报价而不执行兑换。
  - q: 曲线完全填满后会发生什么？
    a: 当所有代币售出后，联合曲线自动毕业到 Raydium CPMM 池。毕业后在 Raydium 上继续交易。
  - q: 可以用手动流程创建联合曲线吗？
    a: 不可以。联合曲线发行只能通过 Genesis API 使用 genesis launch create --launchType bonding-curve 创建。
---

{% callout title="本页涵盖内容" %}
从 CLI 运行完整的联合曲线生命周期：
- 通过 Genesis API 创建联合曲线代币发行
- 在曲线上买卖代币
- 检查曲线状态并获取价格报价
- 查看联合曲线 bucket
{% /callout %}

## 摘要

联合曲线发行创建一个恒积 AMM，交易立即开始——无存款窗口。随着 SOL 流入，价格上涨，当所有代币售出后曲线自动毕业到 Raydium CPMM 池。本页涵盖完整的联合曲线生命周期。

- **创建**：通过 [`genesis launch create --launchType bonding-curve`](/dev-tools/cli/genesis/launch#bonding-curve)（仅限 API，无手动流程）
- **交易**：用 `genesis swap --buyAmount` 购买或用 `--sellAmount` 卖出
- **查询**：用 `genesis swap --info` 检查价格、储备、填充百分比
- **查看**：用 `genesis bucket fetch --type bonding-curve` 查看 bucket 配置
- **毕业**：完全填满时自动毕业到 Raydium CPMM

**跳转至：** [创建联合曲线](#create-a-bonding-curve) · [兑换（买卖）](#swap-buy-and-sell) · [检查曲线状态](#checking-curve-status) · [查看联合曲线 Bucket](#inspect-bonding-curve-bucket) · [完整生命周期示例](#full-lifecycle-example) · [常见错误](#common-errors) · [FAQ](#faq)

## 创建联合曲线

联合曲线发行通过 [Genesis API](/dev-tools/cli/genesis/launch#bonding-curve) 创建。只需 `--name`、`--symbol` 和 `--image`：

```bash {% title="Create a bonding curve launch" %}
mplx genesis launch create --launchType bonding-curve \
  --name "My Token" \
  --symbol "MTK" \
  --image "https://gateway.irys.xyz/abc123"
```

可选配置创作者费、首次购买或关联到 [Agent](/agents)：

```bash {% title="With creator fee and first buy" %}
mplx genesis launch create --launchType bonding-curve \
  --name "My Token" \
  --symbol "MTK" \
  --image "https://gateway.irys.xyz/abc123" \
  --creatorFeeWallet <FEE_WALLET_ADDRESS> \
  --firstBuyAmount 0.1
```

```bash {% title="With agent" %}
mplx genesis launch create --launchType bonding-curve \
  --name "Agent Token" \
  --symbol "AGT" \
  --image "https://gateway.irys.xyz/abc123" \
  --agentMint <AGENT_CORE_ASSET_ADDRESS> \
  --agentSetToken
```

详见 [Launch (API)](/dev-tools/cli/genesis/launch) 了解所有标志。

{% callout type="note" %}
联合曲线只能通过 Genesis API 创建。不存在手动 `bucket add-bonding-curve` 命令。
{% /callout %}

## 兑换（买卖）

`mplx genesis swap` 命令在联合曲线上买入或卖出代币。

```bash {% title="Buy tokens (spend 0.05 SOL)" %}
mplx genesis swap <GENESIS_ACCOUNT> --buyAmount 50000000
```

```bash {% title="Sell tokens" %}
mplx genesis swap <GENESIS_ACCOUNT> --sellAmount 500000000000
```

### 兑换选项

| 标志 | 简写 | 描述 | 是否必填 | 默认值 |
|------|-------|-------------|----------|---------|
| `--buyAmount <string>` | | 要花费的报价代币数量（如 SOL 的 lamports） | 否 | |
| `--sellAmount <string>` | | 要卖出的基础代币数量 | 否 | |
| `--slippage <integer>` | | 滑点容忍度（基点） | 否 | `200`（2%） |
| `--bucketIndex <integer>` | `-b` | 联合曲线 bucket 的索引 | 否 | `0` |
| `--info` | | 显示曲线状态和价格报价而不执行兑换 | 否 | `false` |

{% callout type="note" title="必须提供恰好一个数量" %}
兑换时，提供 `--buyAmount` 或 `--sellAmount` 之一。使用 `--info` 可查看曲线状态而不执行兑换。
{% /callout %}

### 兑换示例

以自定义滑点（1%）购买：

```bash {% title="Buy with 1% slippage" %}
mplx genesis swap <GENESIS_ACCOUNT> --buyAmount 50000000 --slippage 100
```

### 兑换输出

```text {% title="Expected swap output" %}
--------------------------------
  Direction: Buy
  Amount In: 50000000 (quote tokens)
  Amount Out: <base_tokens_received>
  Signature: <transaction_signature>
  Explorer: <explorer_url>
--------------------------------
```

## 检查曲线状态

`--info` 标志显示当前曲线状态而不执行兑换：

```bash {% title="Curve status only" %}
mplx genesis swap <GENESIS_ACCOUNT> --info
```

将 `--info` 与数量组合以获取价格报价：

```bash {% title="Buy quote (how many tokens for 0.1 SOL?)" %}
mplx genesis swap <GENESIS_ACCOUNT> --info --buyAmount 100000000
```

```bash {% title="Sell quote (how much SOL for selling tokens?)" %}
mplx genesis swap <GENESIS_ACCOUNT> --info --sellAmount 1000000000
```

信息输出包括：
- 每个代币的当前价格
- 储备余额（基础代币和报价代币）
- 填充百分比
- 曲线当前是否可兑换
- 含手续费和最低输出的价格报价（提供数量时显示）

## 查看联合曲线 Bucket

带 `--type bonding-curve` 的 [`genesis bucket fetch`](/dev-tools/cli/genesis/manage#fetch-bucket) 命令可获取完整的 bucket 配置：

```bash {% title="Fetch bonding curve bucket" %}
mplx genesis bucket fetch <GENESIS_ACCOUNT> --type bonding-curve
```

或让 CLI 自动检测 bucket 类型：

```bash {% title="Auto-detect bucket type" %}
mplx genesis bucket fetch <GENESIS_ACCOUNT>
```

## 完整生命周期示例

```bash {% title="Complete bonding curve lifecycle" %}
# 1. 创建联合曲线发行
mplx genesis launch create --launchType bonding-curve \
  --name "My Token" --symbol "MTK" \
  --image "https://gateway.irys.xyz/abc123"

# （从输出中复制 GENESIS_ACCOUNT）

# 2. 检查曲线状态
mplx genesis swap <GENESIS_ACCOUNT> --info

# 3. 购买代币（0.1 SOL）
mplx genesis swap <GENESIS_ACCOUNT> --buyAmount 100000000

# 4. 购买后检查价格
mplx genesis swap <GENESIS_ACCOUNT> --info

# 5. 卖出部分代币
mplx genesis swap <GENESIS_ACCOUNT> --sellAmount 500000000000

# 6. 查看 bucket 状态
mplx genesis bucket fetch <GENESIS_ACCOUNT> --type bonding-curve
```

## 常见错误

| 错误 | 原因 | 解决方法 |
|-------|-------|-----|
| Either --buyAmount or --sellAmount is required | 未指定数量且未使用 `--info` | 添加 `--buyAmount`、`--sellAmount` 或 `--info` |
| Cannot specify both --buyAmount and --sellAmount | 同时提供了两个数量 | 每次兑换只能使用一个数量 |
| Curve is not swappable | 曲线未开始或已售罄（已毕业） | 用 `--info` 检查状态——曲线可能已毕业到 Raydium |
| Slippage exceeded | 价格超出容忍范围波动 | 增大 `--slippage` 或以较小金额重试 |
| Insufficient funds | 钱包中 SOL 或代币不足 | 用 `mplx toolbox sol balance` 检查余额 |

## 注意事项

- 所有数量均为基础单位——对于 SOL，1 SOL = 1,000,000,000 lamports
- 以 SOL 作为报价代币购买时，兑换命令自动将 SOL 包装为 WSOL
- 默认滑点 200 bps（2%）可防止报价与执行之间的价格波动
- 联合曲线上始终启用创作者费——默认归发行钱包所有，在交易期间累积在 bucket 中
- 曲线毕业到 Raydium 后，在 Raydium CPMM 池上继续交易

## FAQ

**联合曲线使用什么定价模型？**
联合曲线使用恒积公式。随着更多代币被购买，价格上涨；随着代币被卖出，价格下降。

**购买前需要先包装 SOL 吗？**
不需要。使用 SOL 购买时，兑换命令会在需要时自动将 SOL 包装为 WSOL。

**如何在兑换前检查价格？**
使用 `--info` 标志显示曲线状态。将 `--info` 与 `--buyAmount` 或 `--sellAmount` 组合使用，可获取报价而不执行兑换。

**曲线完全填满后会发生什么？**
当所有代币售出后，联合曲线自动毕业到 Raydium CPMM 池。毕业后在 Raydium 上继续交易。

**可以用手动流程创建联合曲线吗？**
不可以。联合曲线发行只能通过 Genesis API 使用 `genesis launch create --launchType bonding-curve` 创建。

## 术语表

| 术语 | 定义 |
|------|------------|
| **联合曲线（Bonding Curve）** | 基于供应量定价代币的恒积 AMM——买入时价格上涨，卖出时价格下降 |
| **毕业（Graduation）** | 当曲线上所有代币售出时，流动性自动迁移到 Raydium CPMM 池 |
| **报价代币（Quote Token）** | 购买时花费的代币（通常为 SOL）——数量以基础单位（lamports）表示 |
| **基础代币（Base Token）** | 在曲线上发行和交易的代币 |
| **滑点（Slippage）** | 报价与执行之间允许的最大价格偏差，以基点表示 |
| **填充百分比（Fill Percentage）** | 曲线总容量已被填充的比例（100% = 毕业） |
| **创作者费（Creator Fee）** | 每次兑换收取并转给创作者钱包的费用，累积在 bucket 中并在毕业后认领 |
