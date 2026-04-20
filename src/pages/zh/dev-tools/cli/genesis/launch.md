---
title: Launch (API)
metaTitle: Launch 命令 | Metaplex CLI
description: 使用 Metaplex CLI (mplx) 通过 Genesis API 创建和注册代币发行 — launchpool 和 bonding curve，支持可选的 agent 集成。
keywords:
  - Genesis launch
  - token launch CLI
  - mplx genesis launch
  - Genesis API
  - Metaplex CLI
  - bonding curve
  - agent token
about:
  - Genesis API token launches
  - one-command token launch
  - launch registration
  - bonding curve launch
  - agent token launch
proficiencyLevel: Intermediate
programmingLanguage:
  - Bash
faqs:
  - q: genesis launch create 与手动流程有什么区别？
    a: genesis launch create 命令是一个一体化流程，它调用 Genesis API 构建交易、签名并发送，然后在 Metaplex 平台上注册发行——全部在一条命令中完成。手动流程需要分别执行 create、bucket、finalize 和 register 步骤。
  - q: 什么时候应该使用 genesis launch register？
    a: 当你已经使用底层 CLI 命令（genesis create、bucket add-launch-pool 等）创建了 genesis 账户，并希望在 Metaplex 平台上注册以获取公开发行页面时，使用 genesis launch register。
  - q: launch 命令使用哪个网络？
    a: 网络会根据你配置的 RPC 端点自动检测。你可以使用 --network 标志覆盖（solana-mainnet 或 solana-devnet）。
  - q: launchpool 和 bonding-curve 有什么区别？
    a: Launchpool 有 48 小时的存款窗口，用户存入 SOL 并按比例获得代币。Bonding curve 立即开始交易，使用恒定乘积 AMM——价格随着 SOL 流入而上升，当所有代币售出时，曲线自动迁移到 Raydium CPMM。
  - q: 我可以将 agent 链接到代币发行吗？
    a: 可以。传入 --agentMint 和 agent 的 Core 资产地址。这会自动从 agent 的 PDA 派生创建者费用钱包。添加 --agentSetToken 可永久将代币链接到 agent（不可逆）。
---

{% callout title="你将完成的操作" %}
使用 Genesis API 在单条命令中创建和注册代币发行：
- 创建 **launchpool**（48 小时存款窗口，按比例分配）
- 创建 **bonding curve**（即时交易，自动迁移到 Raydium）
- 可选通过 `--agentMint` 将发行链接到 [agent](/zh/agents/mint-agent)
- 使用 `genesis launch register` 注册现有的 genesis 账户
{% /callout %}

## 概述

`genesis launch` 命令提供了一种使用 Genesis API 发行代币的简化方式。无需手动创建 genesis 账户、添加 bucket、finalize 和分别注册，API 会处理整个流程。

- **`genesis launch create`**：一体化命令——通过 API 构建交易、签名并发送，然后注册发行
- **`genesis launch register`**：在 Metaplex 平台上注册现有的 genesis 账户以获取公开发行页面
- **两种发行类型**：`launchpool`（默认，48 小时存款，可配置分配）和 `bonding-curve`（即时 bonding curve，无存款窗口）
- **Agent 支持**：通过 `--agentMint` 和可选的 `--agentSetToken` 将发行链接到已注册的 agent
- **兼容 metaplex.com**：通过 API 创建或注册的发行会显示在 [metaplex.com](https://metaplex.com) 上，并带有公开发行页面
- **总供应量**：目前固定为 1,000,000,000 个代币

**跳转至：** [Launch Create](#launch-create) · [Bonding Curve](#bonding-curve) · [Agent 发行](#agent-launches) · [Launch Register](#launch-register) · [锁定分配](#locked-allocations) · [常见错误](#common-errors) · [常见问题](#faq)

## Launch Create

`mplx genesis launch create` 命令通过 Genesis API 创建新的代币发行。它处理整个流程：

1. 调用 Genesis API 构建链上交易
2. 签名并发送到网络
3. 在 Metaplex 平台上注册发行

有两种可用的发行类型：

- **`launchpool`**（默认）：48 小时存款窗口，按比例分配代币，可配置分配方案。需要 `--tokenAllocation`、`--depositStartTime`、`--raiseGoal`、`--raydiumLiquidityBps` 和 `--fundsRecipient`。
- **`bonding-curve`**：即时 bonding curve（恒定乘积 AMM）。交易立即开始——无存款窗口。当所有代币售出时自动迁移到 Raydium CPMM。仅需 `--name`、`--symbol` 和 `--image`。

### Launchpool 示例

```bash {% title="Create a launchpool launch" %}
mplx genesis launch create \
  --name "My Token" \
  --symbol "MTK" \
  --image "https://gateway.irys.xyz/abc123" \
  --tokenAllocation 500000000 \
  --depositStartTime 2025-03-01T00:00:00Z \
  --raiseGoal 250 \
  --raydiumLiquidityBps 5000 \
  --fundsRecipient <WALLET_ADDRESS>
```

### 所有标志

| 标志 | 描述 | 必填 | 默认值 |
|------|------|------|--------|
| `--launchType <string>` | `launchpool` 或 `bonding-curve` | 否 | `launchpool` |
| `--name <string>` | 代币名称（1–32 个字符） | 是 | — |
| `--symbol <string>` | 代币符号（1–10 个字符） | 是 | — |
| `--image <string>` | 代币图片 URL（必须以 `https://gateway.irys.xyz/` 开头） | 是 | — |
| `--tokenAllocation <integer>` | Launch pool 代币分配（总供应量 10 亿的一部分） | 仅 Launchpool | — |
| `--depositStartTime <string>` | 存款开始时间（ISO 日期字符串或 unix 时间戳） | 仅 Launchpool | — |
| `--raiseGoal <integer>` | 募集目标（整数单位，例如 250 = 250 SOL） | 仅 Launchpool | — |
| `--raydiumLiquidityBps <integer>` | Raydium 流动性（基点，2000–10000，即 20%–100%） | 仅 Launchpool | — |
| `--fundsRecipient <string>` | 接收已募集资金的未锁定部分的钱包 | 仅 Launchpool | — |
| `--creatorFeeWallet <string>` | 接收创建者费用的钱包（始终启用，费用在交易期间累积，毕业后领取） | 否（仅 bonding-curve） | 发起钱包 |
| `--firstBuyAmount <number>` | 发行时免费首次购买的 SOL 金额 | 否（仅 bonding-curve） | — |
| `--agentMint <string>` | Agent 的 Core 资产地址——自动从 agent PDA 派生创建者费用钱包 | 否 | — |
| `--agentSetToken` | 永久将发行的代币链接到 agent（**不可逆**）。需要 `--agentMint` | 否 | `false` |
| `--description <string>` | 代币描述（最多 250 个字符） | 否 | — |
| `--website <string>` | 项目网站 URL | 否 | — |
| `--twitter <string>` | 项目 Twitter URL | 否 | — |
| `--telegram <string>` | 项目 Telegram URL | 否 | — |
| `--lockedAllocations <path>` | 锁定分配配置 JSON 文件路径（仅 launchpool） | 否 | — |
| `--quoteMint <string>` | 报价代币（`SOL` 或 `USDC`） | 否 | `SOL` |
| `--network <string>` | 网络覆盖：`solana-mainnet` 或 `solana-devnet` | 否 | 自动检测 |
| `--apiUrl <string>` | Genesis API 基础 URL | 否 | `https://api.metaplex.com` |

### Launchpool 示例

1. 使用 SOL 的基本发行：
```bash {% title="Basic launch" %}
mplx genesis launch create \
  --name "My Token" \
  --symbol "MTK" \
  --image "https://gateway.irys.xyz/abc123" \
  --tokenAllocation 500000000 \
  --depositStartTime 2025-03-01T00:00:00Z \
  --raiseGoal 250 \
  --raydiumLiquidityBps 5000 \
  --fundsRecipient <WALLET_ADDRESS>
```

2. 使用 USDC 作为报价代币：
```bash {% title="Launch with USDC" %}
mplx genesis launch create \
  --name "My Token" \
  --symbol "MTK" \
  --image "https://gateway.irys.xyz/abc123" \
  --tokenAllocation 500000000 \
  --depositStartTime 1709251200 \
  --raiseGoal 5000 \
  --raydiumLiquidityBps 5000 \
  --fundsRecipient <WALLET_ADDRESS> \
  --quoteMint USDC
```

3. 包含元数据和锁定分配：
```bash {% title="Full launch with metadata and allocations" %}
mplx genesis launch create \
  --name "My Token" \
  --symbol "MTK" \
  --image "https://gateway.irys.xyz/abc123" \
  --description "A community token for builders" \
  --website "https://example.com" \
  --twitter "https://x.com/myproject" \
  --telegram "https://t.me/myproject" \
  --tokenAllocation 500000000 \
  --depositStartTime 2025-03-01T00:00:00Z \
  --raiseGoal 250 \
  --raydiumLiquidityBps 5000 \
  --fundsRecipient <WALLET_ADDRESS> \
  --lockedAllocations allocations.json
```

## Bonding Curve

Bonding curve 发行创建一个恒定乘积 AMM，交易立即开始。价格随着 SOL 流入曲线而上升。当所有代币售出时，曲线自动迁移到 Raydium CPMM 池。

```bash {% title="Basic bonding curve launch" %}
mplx genesis launch create --launchType bonding-curve \
  --name "My Token" \
  --symbol "MTK" \
  --image "https://gateway.irys.xyz/abc123"
```

仅需 `--name`、`--symbol` 和 `--image`——所有协议参数使用默认值。

{% callout type="note" %}
Bonding curve 发行始终启用创建者费用——默认为发起钱包。费用在交易期间在 bucket 中累积，必须在曲线迁移到 Raydium 后单独领取。
{% /callout %}

### 带创建者费用

将部分交易费用导向特定钱包：

```bash {% title="Bonding curve with creator fee" %}
mplx genesis launch create --launchType bonding-curve \
  --name "My Token" \
  --symbol "MTK" \
  --image "https://gateway.irys.xyz/abc123" \
  --creatorFeeWallet <FEE_WALLET_ADDRESS>
```

### 带首次购买

为发起钱包保留免费的首次购买：

```bash {% title="Bonding curve with first buy" %}
mplx genesis launch create --launchType bonding-curve \
  --name "My Token" \
  --symbol "MTK" \
  --image "https://gateway.irys.xyz/abc123" \
  --firstBuyAmount 0.1
```

首次购买金额以 SOL 为单位（例如 `0.1` = 0.1 SOL）。首次购买不收取协议费或创建者费用。

## Agent 发行

通过传入 `--agentMint` 将代币发行链接到已注册的 [agent](/zh/agents/mint-agent)。这适用于 launchpool 和 bonding curve 两种发行类型。

当提供 `--agentMint` 时：
- **创建者费用钱包**自动从 agent 的 Core 资产签名者 PDA 派生
- 对于 bonding curve，**首次购买的买家**默认为 agent PDA（如果设置了 `--firstBuyAmount`）

```bash {% title="Bonding curve with agent" %}
mplx genesis launch create --launchType bonding-curve \
  --name "Agent Token" \
  --symbol "AGT" \
  --image "https://gateway.irys.xyz/abc123" \
  --agentMint <AGENT_MINT> \
  --agentSetToken
```

{% callout title="agentSetToken 不可逆" type="warning" %}
`--agentSetToken` 会永久将发行的代币链接到 agent。此操作无法撤销。省略此标志可在不链接的情况下发行，之后可使用 `mplx agents set-agent-token` 进行链接。
{% /callout %}

### 端到端流程：注册 Agent + 发行代币

```bash {% title="Register agent then launch token" %}
# 1. 注册新的 agent
mplx agents register --name "My Agent" \
  --description "An autonomous trading agent" \
  --image "./avatar.png"
# 记下输出中的资产地址（例如 7BQj...）

# 2. 发行链接到 agent 的 bonding curve 代币
mplx genesis launch create --launchType bonding-curve \
  --name "Agent Token" --symbol "AGT" \
  --image "https://gateway.irys.xyz/abc123" \
  --agentMint <AGENT_MINT> --agentSetToken

# 3.（可选）验证 agent 已链接代币
mplx agents fetch <AGENT_MINT>
```

{% callout title="RPC 传播延迟" type="note" %}
如果步骤 2 报错"Agent is not owned by the connected wallet"，说明 API 后端尚未索引到新注册的 agent。链上代币创建可能已经成功——请使用 `mplx agents fetch <AGENT_MINT>` 检查。如果 agent 已显示代币已设置，则仅平台注册失败；请使用 `mplx genesis launch register` 完成注册。在脚本中执行这两个步骤时，建议在 agent 注册和发行命令之间添加约 30 秒的延迟。
{% /callout %}

### 输出

命令成功时会打印：
- **Genesis Account** 地址
- 新代币的 **Mint Address**
- Metaplex 平台上的 **Launch ID** 和 **Launch Link**
- **Token ID**
- 交易签名及浏览器链接

## Launch Register

`mplx genesis launch register` 命令在 Metaplex 平台上注册现有的 genesis 账户。当你使用底层 CLI 命令（`genesis create`、`bucket add-launch-pool` 等）创建了 genesis 账户并希望获取公开发行页面时使用此命令。

```bash {% title="Register a genesis account" %}
mplx genesis launch register <GENESIS_ACCOUNT> --launchConfig launch.json
```

### 参数

| 参数 | 描述 | 必填 |
|------|------|------|
| `genesisAccount` | 要注册的 Genesis 账户地址 | 是 |

### 标志

| 标志 | 描述 | 必填 | 默认值 |
|------|------|------|--------|
| `--launchConfig <path>` | 包含发行配置的 JSON 文件路径 | 是 | — |
| `--network <string>` | 网络覆盖：`solana-mainnet` 或 `solana-devnet` | 否 | 自动检测 |
| `--apiUrl <string>` | Genesis API 基础 URL | 否 | `https://api.metaplex.com` |

### Launch 配置格式

Launch 配置 JSON 文件使用与 `launch create` 输入相同的格式。

**Launchpool 配置：**

```json {% title="launch-launchpool.json" %}
{
  "wallet": "<WALLET_ADDRESS>",
  "token": {
    "name": "My Token",
    "symbol": "MTK",
    "image": "https://gateway.irys.xyz/abc123",
    "description": "Optional description",
    "externalLinks": {
      "website": "https://example.com",
      "twitter": "https://x.com/myproject"
    }
  },
  "launchType": "launchpool",
  "launch": {
    "launchpool": {
      "tokenAllocation": 500000000,
      "depositStartTime": "2025-03-01T00:00:00Z",
      "raiseGoal": 250,
      "raydiumLiquidityBps": 5000,
      "fundsRecipient": "<WALLET_ADDRESS>"
    }
  },
  "quoteMint": "SOL"
}
```

**Bonding curve 配置：**

```json {% title="launch-bonding-curve.json" %}
{
  "wallet": "<WALLET_ADDRESS>",
  "token": {
    "name": "My Token",
    "symbol": "MTK",
    "image": "https://gateway.irys.xyz/abc123"
  },
  "launchType": "bondingCurve",
  "launch": {
    "creatorFeeWallet": "<FEE_WALLET_ADDRESS>",
    "firstBuyAmount": 0.1
  },
  "quoteMint": "SOL"
}
```

**带 agent 的 bonding curve 配置：**

```json {% title="launch-agent.json" %}
{
  "wallet": "<WALLET_ADDRESS>",
  "token": {
    "name": "Agent Token",
    "symbol": "AGT",
    "image": "https://gateway.irys.xyz/abc123"
  },
  "launchType": "bondingCurve",
  "agent": {
    "mint": "<AGENT_MINT>",
    "setToken": true
  },
  "launch": {},
  "quoteMint": "SOL"
}
```

### 示例

1. 使用默认网络检测进行注册：
```bash {% title="Register launch" %}
mplx genesis launch register <GENESIS_ACCOUNT> --launchConfig launch.json
```

2. 在 devnet 上注册：
```bash {% title="Register on devnet" %}
mplx genesis launch register <GENESIS_ACCOUNT> \
  --launchConfig launch.json \
  --network solana-devnet
```

### 输出

命令成功时会打印：
- Metaplex 平台上的 **Launch ID** 和 **Launch Link**
- **Token ID** 和 **Mint Address**

如果账户已经注册过，命令会报告此情况并显示现有的发行详情。

## 锁定分配

锁定分配允许你保留一部分代币供应量并设置归属计划。通过 `--lockedAllocations` 提供一个 JSON 数组文件。

```json {% title="allocations.json" %}
[
  {
    "name": "Team",
    "recipient": "<WALLET_ADDRESS>",
    "tokenAmount": 200000000,
    "vestingStartTime": "2025-04-01T00:00:00Z",
    "vestingDuration": { "value": 1, "unit": "YEAR" },
    "unlockSchedule": "MONTH",
    "cliff": {
      "duration": { "value": 3, "unit": "MONTH" },
      "unlockAmount": 50000000
    }
  }
]
```

### 字段

| 字段 | 类型 | 描述 |
|------|------|------|
| `name` | string | 此分配的名称 |
| `recipient` | string | 接收者的钱包地址 |
| `tokenAmount` | number | 分配的代币数量 |
| `vestingStartTime` | string | 归属开始时间的 ISO 日期字符串 |
| `vestingDuration` | object | 持续时间，包含 `value`（数字）和 `unit` |
| `unlockSchedule` | string | 代币解锁频率 |
| `cliff` | object | 可选的锁定期，包含 `duration` 和 `unlockAmount` |

### 有效时间单位

`SECOND`、`MINUTE`、`HOUR`、`DAY`、`WEEK`、`TWO_WEEKS`、`MONTH`、`QUARTER`、`YEAR`

## 常见错误

| 错误 | 原因 | 修复方法 |
|------|------|----------|
| API request failed | 网络问题或无效输入 | 检查错误响应详情——命令会在验证错误时显示 API 响应体 |
| Agent is not owned by the connected wallet | API 后端尚未索引到新注册的 agent | 等待约 30 秒后重试，或检查 `mplx agents fetch`——即使注册失败，链上发行可能已经成功 |
| Agent already has a different agent token set | 此 agent 之前的发行已使用了 `--agentSetToken` | Agent 代币链接是不可逆的且只能执行一次。不使用 `--agentSetToken` 发行，或使用不同的 agent |
| Locked allocations file not found | 文件路径错误 | 验证分配 JSON 文件的路径 |
| Must contain a JSON array | 分配文件不是数组 | 确保 JSON 文件包含数组 `[...]`，而非对象 |
| raydiumLiquidityBps out of range | 值超出 2000–10000 范围 | 使用 2000（20%）到 10000（100%）之间的值 |
| Launch config missing required fields | register 的配置不完整 | 确保你的发行配置 JSON 包含 `token`、`launch` 和有效的 `launchType` |

## 常见问题

**`genesis launch create` 与手动流程有什么区别？**
`genesis launch create` 命令是一个一体化流程，它调用 Genesis API 构建交易、签名并发送，然后在 Metaplex 平台上注册发行——全部在一条命令中完成。手动流程需要分别执行 `create`、`bucket add-launch-pool`、`finalize` 和 register 步骤。

**launchpool 和 bonding-curve 有什么区别？**
Launchpool 有 48 小时的存款窗口，用户存入 SOL 并按比例获得代币。Bonding curve 立即开始交易，使用恒定乘积 AMM——价格随着 SOL 流入而上升，当所有代币售出时，曲线自动迁移到 Raydium CPMM。

**我可以将 agent 链接到代币发行吗？**
可以。传入 `--agentMint` 和 agent 的 Core 资产地址。这会自动从 agent 的 PDA 派生创建者费用钱包。添加 `--agentSetToken` 可永久将代币链接到 agent（不可逆）。适用于 launchpool 和 bonding curve 两种类型。

**什么时候应该使用 `genesis launch register`？**
当你已经使用底层 CLI 命令（`genesis create`、`bucket add-launch-pool` 等）创建了 genesis 账户，并希望在 Metaplex 平台上注册以获取公开发行页面时使用。

**launch 命令使用哪个网络？**
网络会根据你配置的 RPC 端点自动检测。你可以使用 `--network` 标志覆盖（`solana-mainnet` 或 `solana-devnet`）。

**可以使用自定义的报价代币吗？**
API 目前支持 `SOL`（默认）和 `USDC`。传入 `--quoteMint USDC` 可使用 USDC。

**代币总供应量是多少？**
使用 API 流程时，总供应量目前固定为 1,000,000,000 个代币。
