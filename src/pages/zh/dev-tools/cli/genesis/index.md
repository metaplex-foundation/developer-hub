---
title: 概述
metaTitle: Genesis 概述 | Metaplex CLI
description: 使用 Metaplex CLI (mplx) 的 Genesis CLI 命令概述，用于发行代币。
keywords:
  - Genesis CLI
  - token launch CLI
  - mplx genesis
  - Solana token launch
  - Metaplex CLI
about:
  - Genesis token launches
  - Metaplex CLI
  - token distribution
  - launch pools
proficiencyLevel: Intermediate
programmingLanguage:
  - Bash
faqs:
  - q: What is the mplx genesis command?
    a: mplx genesis 命令组允许您从终端运行完整的 Genesis 代币发行——包括创建账户、配置 bucket、存入、领取和撤销权限。
  - q: What are the different bucket types in Genesis?
    a: Genesis 有三种 bucket 类型——Launch Pool（基于存款的按比例分配）、Presale（固定价格代币销售）和 unlocked（团队/金库分配，可直接领取）。
  - q: Do I need to wrap SOL before depositing?
    a: 是的。如果使用 SOL 作为报价代币，请先使用 mplx toolbox sol wrap 进行包装，然后再存入任何 bucket。
  - q: Can I undo finalization?
    a: 不能。Finalize 操作是不可逆的。一旦 finalize，就不能再添加 bucket，配置将被锁定。
  - q: How are token amounts specified?
    a: 所有金额均以基本单位表示。使用 9 位小数时，1,000,000 个代币 = 1000000000000000 基本单位。存入金额使用报价代币基本单位（SOL 的 lamports）。
---

{% callout title="本文涵盖内容" %}
Genesis 代币发行的完整 CLI 参考：
- **API 流程**：通过 Genesis API 使用单个命令创建和注册发行
- **手动流程**：创建 Genesis 账户、配置 bucket、存入、领取和撤销
{% /callout %}

## 概要

`mplx genesis` 命令允许您从终端运行完整的 Genesis 代币发行——包括创建账户、配置 bucket、存入、领取和撤销权限。

- **工具**：Metaplex CLI (`mplx`) 的 `genesis` 命令组
- **Bucket 类型**：Launch Pool（按比例）、Presale（固定价格）、unlocked（金库）
- **报价代币（手动流程）**：默认为 Wrapped SOL，支持任何 SPL 代币铸造地址
- **报价代币（API 流程）**：目前仅支持 SOL 或 USDC
- **不可逆操作**：`finalize` 和 `revoke` 无法撤销

## 不在范围内

Genesis 智能合约内部原理、SDK/TypeScript 集成、前端开发、代币经济设计、发行后流动性池设置。

**跳转到：** [前置条件](#prerequisites) · [一般流程](#general-flow) · [命令参考](#command-reference) · [常见错误](#common-errors) · [常见问题](#faq) · [术语表](#glossary)

*由 Metaplex Foundation 维护 · 最后验证于 2026 年 2 月 · 需要 Metaplex CLI (mplx)*

## 前置条件

- 已安装 Metaplex CLI 并添加到 `PATH`
- 一个 Solana 密钥对文件（例如 `~/.config/solana/id.json`）
- 用于交易费用的 SOL
- 通过 `mplx config rpc add` 配置的 RPC 端点或使用 `-r` 传递

检查您的设置：

```bash {% title="检查 CLI" %}
mplx genesis --help
```

## 一般流程

使用 Genesis CLI 发行代币有两种方式：

### API 流程（推荐）

使用 `genesis launch create` 进行一体化流程，该命令调用 Genesis API，构建并签名交易，并在 Metaplex 平台上注册您的发行——全部在一个命令中完成。通过 API 创建的发行与 [metaplex.com](https://metaplex.com) 兼容，将在平台上显示公共发行页面。

```bash {% title="一键发行" %}
mplx genesis launch create \
  --name "My Token" --symbol "MTK" \
  --image "https://gateway.irys.xyz/abc123" \
  --tokenAllocation 500000000 \
  --depositStartTime 2025-03-01T00:00:00Z \
  --raiseGoal 200 --raydiumLiquidityBps 5000 \
  --fundsRecipient <WALLET_ADDRESS>
```

详见 [Launch (API)](/dev-tools/cli/genesis/launch)。

### 手动流程

如需完全控制每个步骤：

1. **创建** — `genesis create` 设置 Genesis 账户和代币铸造。
2. **添加 Bucket** — 添加一个或多个 bucket 来定义代币分配方式。使用 `bucket add-launch-pool` 进行按比例分配，`bucket add-presale` 进行固定价格销售，或 `bucket add-unlocked` 进行团队/金库分配。
3. **Finalize** — `genesis finalize` 锁定配置。此步骤后不能再添加 bucket。
4. **存入** — 用户在存款窗口期间使用 `genesis deposit` 或 `genesis presale deposit` 将报价代币（例如 Wrapped SOL）存入 bucket。
5. **提取**（可选） — 用户可以在存款期间使用 `genesis withdraw` 从 Launch Pool 提取。
6. **转换**（可选） — 如果 Launch Pool 有结束行为，在存款关闭后调用 `genesis transition` 将收集的代币转发到目标 bucket。
7. **领取** — 领取期开放后，用户使用 `genesis claim` 或 `genesis presale claim` 领取基础代币。金库钱包使用 `genesis claim-unlocked`。
8. **撤销**（可选） — `genesis revoke` 永久撤销代币的铸造和/或冻结权限。

如果您使用了手动流程并希望获得公共发行页面，请使用 `genesis launch register` 在 Metaplex 平台上注册您的 Genesis 账户。

您可以随时使用 `genesis fetch` 和 `genesis bucket fetch` 检查发行状态。

## 命令参考

| 命令 | 描述 |
|---------|-------------|
| `genesis launch create` | 通过 Genesis API 创建并注册发行（一体化） |
| `genesis launch register` | 在 Metaplex 平台上注册现有的 Genesis 账户 |
| `genesis create` | 创建新的 Genesis 账户和代币 |
| `genesis finalize` | 锁定配置并激活发行 |
| `genesis fetch` | 获取 Genesis 账户详情 |
| `genesis revoke` | 撤销铸造/冻结权限 |
| `genesis bucket add-launch-pool` | 添加 Launch Pool bucket |
| `genesis bucket add-presale` | 添加 Presale bucket |
| `genesis bucket add-unlocked` | 添加 unlocked（金库）bucket |
| `genesis bucket fetch` | 按类型获取 bucket 详情 |
| `genesis deposit` | 存入 Launch Pool |
| `genesis withdraw` | 从 Launch Pool 提取 |
| `genesis transition` | 在存款期结束后执行结束行为 |
| `genesis claim` | 从 Launch Pool 领取代币 |
| `genesis claim-unlocked` | 从 unlocked bucket 领取 |
| `genesis presale deposit` | 存入 Presale bucket |
| `genesis presale claim` | 从 Presale bucket 领取代币 |

## 注意事项

- `totalSupply` 和 `allocation` 以基本单位表示——使用 9 位小数时，`1000000000000000` = 1,000,000 个代币
- 存入和提取金额以报价代币基本单位表示（SOL 的 lamports，其中 1 SOL = 1,000,000,000 lamports）
- 如果使用 SOL 作为报价代币，请先使用 `mplx toolbox sol wrap <amount>` 进行包装
- Finalize 是不可逆的——在运行 `genesis finalize` 之前请仔细检查所有 bucket 配置
- 运行 `mplx genesis <command> --help` 可查看任何命令的完整参数文档
- 参阅 [Genesis 文档](/smart-contracts/genesis) 了解概念、生命周期详情和 SDK 指南

## 常见错误

| 错误 | 原因 | 修复方法 |
|-------|-------|-----|
| Account not found | Genesis 地址错误或网络错误 | 验证地址并使用 `mplx config rpc list` 检查您的 RPC 端点 |
| Genesis already finalized | 在 `finalize` 之后尝试添加 bucket | Finalize 是不可逆的——如果配置有误，请创建新的 Genesis 账户 |
| Allocation exceeds total supply | bucket 分配总和超过 `totalSupply` | 减少分配量，使其总和不超过 `totalSupply` |
| Deposit period not active | 在存款窗口外存入 | 使用 `genesis bucket fetch` 检查时间戳——存款仅在 `depositStart` 和 `depositEnd` 之间有效 |
| Claim period not active | 在领取窗口开放前领取 | 等待 `claimStart` 时间戳之后 |
| Insufficient funds | 钱包中 SOL 或报价代币不足 | 为钱包充值，如需要请使用 `mplx toolbox sol wrap` 包装 SOL |
| No wrapped SOL | 存入未包装的 SOL | 先包装 SOL：`mplx toolbox sol wrap <amount>` |

## 常见问题

**mplx genesis 命令是什么？**
`mplx genesis` 命令组允许您从终端运行完整的 Genesis 代币发行——包括创建账户、配置 bucket、存入、领取和撤销权限。

**Genesis 中有哪些不同的 bucket 类型？**
Genesis 有三种 bucket 类型：**Launch Pool**（基于存款的按比例分配）、**Presale**（固定价格代币销售）和 **unlocked**（团队/金库分配，可直接领取）。

**存入前需要包装 SOL 吗？**
是的。如果使用 SOL 作为报价代币，请先使用 `mplx toolbox sol wrap <amount>` 进行包装，然后再存入任何 bucket。

**可以撤销 finalize 吗？**
不能。Finalize 是不可逆的。一旦 finalize，就不能再添加 bucket，配置将被锁定。在运行 `genesis finalize` 之前请仔细检查所有内容。

**代币金额如何指定？**
所有金额均以基本单位表示。使用 9 位小数时，1,000,000 个代币 = `1000000000000000` 基本单位。存入金额使用报价代币基本单位（SOL 的 lamports，其中 1 SOL = 1,000,000,000 lamports）。

**同一类型可以有多个 bucket 吗？**
可以。使用 `--bucketIndex` 参数为同一类型的每个 bucket 指定不同的索引。

## 术语表

| 术语 | 定义 |
|------|------------|
| **Genesis Account** | 管理整个代币发行的 PDA——持有配置、bucket 引用和铸造权限 |
| **Bucket** | Genesis 发行中的分配通道，定义代币的一部分如何分配和分发 |
| **Launch Pool** | 在窗口期内收集存款并按比例向存款人分配代币的 bucket 类型 |
| **Presale** | 以 `quoteCap / allocation` 确定的固定价格出售代币的 bucket 类型 |
| **Unlocked Bucket** | 用于团队/金库的 bucket 类型——指定接收者可以直接领取代币或转发的报价代币 |
| **Quote Token** | 用户存入的代币（通常为 Wrapped SOL），用于交换基础代币 |
| **Base Token** | 正在发行并分配给存款人的代币 |
| **Base Units** | 代币的最小面额——使用 9 位小数时，1 个代币 = 1,000,000,000 基本单位 |
| **End Behavior** | 在存款期结束后将收集的报价代币从 Launch Pool 转发到目标 bucket 的规则 |
| **Finalize** | 锁定 Genesis 配置并激活发行的不可逆操作 |
| **Claim Schedule** | 控制领取期开放后代币如何随时间释放的归属规则 |
| **Allocation** | 分配给特定 bucket 的基础代币数量，以基本单位指定 |
