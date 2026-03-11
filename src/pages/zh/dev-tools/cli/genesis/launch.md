---
title: Launch (API)
metaTitle: Launch 命令 | Metaplex CLI
description: 使用 Metaplex CLI (mplx) 通过 Genesis API 创建和注册代币发行。
keywords:
  - Genesis launch
  - token launch CLI
  - mplx genesis launch
  - Genesis API
  - Metaplex CLI
about:
  - Genesis API token launches
  - one-command token launch
  - launch registration
proficiencyLevel: Intermediate
programmingLanguage:
  - Bash
faqs:
  - q: genesis launch create 和手动流程有什么区别？
    a: genesis launch create 命令是一体化流程，调用 Genesis API 构建交易、签署并发送，以及在 Metaplex 平台上注册发行——全部在一个命令中完成。手动流程需要单独执行 create、bucket、finalize 和 register 步骤。
  - q: 什么时候应该使用 genesis launch register？
    a: 当您已经使用底层 CLI 命令（genesis create、bucket add-launch-pool 等）创建了 Genesis 账户，并希望在 Metaplex 平台上注册以获取公开发行页面时，请使用 genesis launch register。
  - q: launch 命令使用哪个网络？
    a: 网络会从您配置的 RPC 端点自动检测。您可以使用 --network 标志（solana-mainnet 或 solana-devnet）覆盖。
---

{% callout title="您将执行的操作" %}
使用 Genesis API 通过单个命令创建和注册代币发行：
- 使用 `genesis launch create` 创建完整的代币发行
- 使用 `genesis launch register` 注册现有的 Genesis 账户
{% /callout %}

## 摘要

`genesis launch` 命令提供了使用 Genesis API 发行代币的简化方式。无需手动创建 Genesis 账户、添加 bucket、finalize 和单独注册，API 会处理完整流程。

- **`genesis launch create`**：一体化命令——通过 API 构建交易、签署并发送，以及注册发行
- **`genesis launch register`**：在 Metaplex 平台上注册现有的 Genesis 账户以获取公开发行页面
- **metaplex.com 兼容**：通过 API 创建或注册的发行会在 [metaplex.com](https://metaplex.com) 上显示公开发行页面
- **总供应量**：目前固定为 1,000,000,000 个代币
- **存款期**：目前为 48 小时

## 超出范围

手动 Genesis 账户创建、单独 bucket 配置、Presale 设置、前端开发。

**跳转至：** [Launch Create](#launch-create) · [Launch Register](#launch-register) · [锁定分配](#locked-allocations) · [常见错误](#common-errors) · [常见问题](#faq)

## Launch Create

`mplx genesis launch create` 命令通过 Genesis API 创建新的代币发行。它处理整个流程：

1. 调用 Genesis API 构建链上交易
2. 签署并发送到网络
3. 在 Metaplex 平台上注册发行

```bash {% title="Create a token launch" %}
mplx genesis launch create \
  --name "My Token" \
  --symbol "MTK" \
  --image "https://gateway.irys.xyz/abc123" \
  --tokenAllocation 500000000 \
  --depositStartTime 2025-03-01T00:00:00Z \
  --raiseGoal 200 \
  --raydiumLiquidityBps 5000 \
  --fundsRecipient <WALLET_ADDRESS>
```

### 必需标志

| 标志 | 描述 |
|------|-------------|
| `--name <string>` | 代币名称（1–32 个字符） |
| `--symbol <string>` | 代币符号（1–10 个字符） |
| `--image <string>` | 代币图片 URL（目前必须以 `https://gateway.irys.xyz/` 开头） |
| `--tokenAllocation <integer>` | Launch Pool 代币分配额（10 亿总供应量的一部分） |
| `--depositStartTime <string>` | 存款开始时间（ISO 日期字符串或 Unix 时间戳） |
| `--raiseGoal <integer>` | 募资目标（整数单位，例如 200 表示 200 SOL） |
| `--raydiumLiquidityBps <integer>` | Raydium 流动性（基点，2000–10000，即 20%–100%） |
| `--fundsRecipient <string>` | 资金接收钱包地址 |

### 可选标志

| 标志 | 描述 | 默认值 |
|------|-------------|---------|
| `--description <string>` | 代币描述（最多 250 个字符） | — |
| `--website <string>` | 项目网站 URL | — |
| `--twitter <string>` | 项目 Twitter URL | — |
| `--telegram <string>` | 项目 Telegram URL | — |
| `--lockedAllocations <path>` | 锁定分配配置的 JSON 文件路径 | — |
| `--quoteMint <string>` | 报价 mint（目前支持 `SOL` 或 `USDC`） | `SOL` |
| `--network <string>` | 网络覆盖：`solana-mainnet` 或 `solana-devnet` | 自动检测 |
| `--apiUrl <string>` | Genesis API 基础 URL | `https://api.metaplex.com` |

### 示例

1. 使用 SOL 的基本发行：
```bash {% title="Basic launch" %}
mplx genesis launch create \
  --name "My Token" \
  --symbol "MTK" \
  --image "https://gateway.irys.xyz/abc123" \
  --tokenAllocation 500000000 \
  --depositStartTime 2025-03-01T00:00:00Z \
  --raiseGoal 200 \
  --raydiumLiquidityBps 5000 \
  --fundsRecipient <WALLET_ADDRESS>
```

2. 使用 USDC 作为报价 mint：
```bash {% title="Launch with USDC" %}
mplx genesis launch create \
  --name "My Token" \
  --symbol "MTK" \
  --image "https://gateway.irys.xyz/abc123" \
  --tokenAllocation 500000000 \
  --depositStartTime 1709251200 \
  --raiseGoal 200 \
  --raydiumLiquidityBps 5000 \
  --fundsRecipient <WALLET_ADDRESS> \
  --quoteMint USDC
```

3. 带元数据和锁定分配：
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
  --raiseGoal 200 \
  --raydiumLiquidityBps 5000 \
  --fundsRecipient <WALLET_ADDRESS> \
  --lockedAllocations allocations.json
```

### 输出

成功后，命令会打印：
- **Genesis Account** 地址
- 新代币的 **Mint Address**
- Metaplex 平台上的 **Launch ID** 和 **Launch Link**
- **Token ID**
- 带有浏览器链接的交易签名

## Launch Register

`mplx genesis launch register` 命令在 Metaplex 平台上注册现有的 Genesis 账户。当您使用底层 CLI 命令（`genesis create`、`bucket add-launch-pool` 等）创建了 Genesis 账户并希望获取公开发行页面时使用此命令。

```bash {% title="Register a genesis account" %}
mplx genesis launch register <GENESIS_ACCOUNT> --launchConfig launch.json
```

### 参数

| 参数 | 描述 | 必需 |
|----------|-------------|----------|
| `genesisAccount` | 要注册的 Genesis 账户地址 | 是 |

### 标志

| 标志 | 描述 | 必需 | 默认值 |
|------|-------------|----------|---------|
| `--launchConfig <path>` | 发行配置 JSON 文件路径 | 是 | — |
| `--network <string>` | 网络覆盖：`solana-mainnet` 或 `solana-devnet` | 否 | 自动检测 |
| `--apiUrl <string>` | Genesis API 基础 URL | 否 | `https://api.metaplex.com` |

### Launch Config 格式

Launch config JSON 文件使用与 `launch create` 输入相同的格式：

```json {% title="launch.json" %}
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
  "launchType": "project",
  "launch": {
    "launchpool": {
      "tokenAllocation": 500000000,
      "depositStartTime": "2025-03-01T00:00:00Z",
      "raiseGoal": 200,
      "raydiumLiquidityBps": 5000,
      "fundsRecipient": "<WALLET_ADDRESS>"
    }
  },
  "quoteMint": "SOL"
}
```

### 示例

1. 使用默认网络检测注册：
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

成功后，命令会打印：
- Metaplex 平台上的 **Launch ID** 和 **Launch Link**
- **Token ID** 和 **Mint Address**

如果账户已注册，命令会报告该情况并显示现有的发行详情。

## 锁定分配

锁定分配允许您预留一部分代币供应量并设置归属计划。通过 `--lockedAllocations` 提供 JSON 数组文件。

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
|-------|------|-------------|
| `name` | string | 此分配的名称 |
| `recipient` | string | 接收者的钱包地址 |
| `tokenAmount` | number | 要分配的代币数量 |
| `vestingStartTime` | string | 归属开始的 ISO 日期字符串 |
| `vestingDuration` | object | 持续时间，包含 `value`（数字）和 `unit` |
| `unlockSchedule` | string | 代币解锁频率 |
| `cliff` | object | 可选的 cliff 期，包含 `duration` 和 `unlockAmount` |

### 有效时间单位

`SECOND`、`MINUTE`、`HOUR`、`DAY`、`WEEK`、`TWO_WEEKS`、`MONTH`、`QUARTER`、`YEAR`

## 常见错误

| 错误 | 原因 | 修复方法 |
|-------|-------|-----|
| API request failed | 网络问题或输入无效 | 检查错误响应详情——命令会在验证错误时显示 API 响应体 |
| Locked allocations file not found | 文件路径错误 | 验证分配 JSON 文件的路径 |
| Must contain a JSON array | 分配文件不是数组 | 确保 JSON 文件包含数组 `[...]`，而不是对象 |
| raydiumLiquidityBps out of range | 值超出 2000–10000 范围 | 使用 2000（20%）到 10000（100%）之间的值 |
| Launch config missing required fields | register 的配置不完整 | 确保您的 launch config JSON 包含 `token`、`launch` 和 `launchType: "project"` |

## 常见问题

**`genesis launch create` 和手动流程有什么区别？**
`genesis launch create` 命令是一体化流程，调用 Genesis API 构建交易、签署并发送，以及在 Metaplex 平台上注册发行——全部在一个命令中完成。手动流程需要单独执行 `create`、`bucket add-launch-pool`、`finalize` 和 register 步骤。

**什么时候应该使用 `genesis launch register`？**
当您已经使用底层 CLI 命令（`genesis create`、`bucket add-launch-pool` 等）创建了 Genesis 账户，并希望在 Metaplex 平台上注册以获取公开发行页面时使用。

**launch 命令使用哪个网络？**
网络会从您配置的 RPC 端点自动检测。您可以使用 `--network` 标志（`solana-mainnet` 或 `solana-devnet`）覆盖。

**可以使用自定义报价 mint 吗？**
API 目前支持 `SOL`（默认）和 `USDC`。传入 `--quoteMint USDC` 即可使用 USDC。

**代币总供应量是多少？**
使用 API 流程时，总供应量目前固定为 1,000,000,000 个代币。
