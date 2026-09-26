---
title: 创建发行
metaTitle: Metaplex API - 创建发行 | REST API | Metaplex
description: 为新的 Genesis 代币发行构建链上交易。返回可供签名和发送的未签名交易。
method: POST
created: '02-19-2026'
updated: '09-26-2026'
keywords:
  - Genesis API
  - create launch
  - token launch
  - launch transactions
about:
  - API endpoint
  - Launch creation
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
---

为新的 Genesis 代币发行构建链上交易。返回未签名交易，需在调用[注册发行](/zh/api/register)之前完成签名和发送。{% .lead %}

{% callout type="warning" title="建议使用 SDK" %}
大多数集成方应使用 SDK 中的 [`createAndRegisterLaunch`](/zh/smart-contracts/genesis/sdk/api-client)，它在一次调用中处理创建交易、签名、发送和注册发行的全部流程。只有在需要不依赖 SDK 直接进行 HTTP 访问时才需要使用此端点。
{% /callout %}

{% callout type="note" %}
我们建议使用 Create API（或 SDK）以编程方式构建发行，因为 [metaplex.com](https://www.metaplex.com) 尚未支持 Genesis 程序的全部功能。通过 API 创建的主网发行在[注册](/zh/api/register)后将显示在 metaplex.com 上。
{% /callout %}

## 端点

```
POST /v1/launches/create
```

## 请求体

| 字段 | 类型 | 必填 | 描述 |
|-------|------|----------|-------------|
| `wallet` | `string` | 是 | 创建者钱包公钥 |
| `launch` | `object` | 是 | 完整发行配置（见下文） |
| `agent` | `object` | 否 | 代表已注册的[智能体](/zh/agents)发行（见[智能体发行](#agent-launches)） |

请求体还接受 `includeBackendSigner`、`derivedSignerPublicKey`、`nonce` 和 `buildAllTxs`。这些字段用于 [metaplex.com](https://www.metaplex.com) 自身的签名流程；直接调用 API 时请勿设置。

### 发行配置

`launch` 对象描述完整的代币和发行设置：

| 字段 | 类型 | 必填 | 描述 |
|-------|------|----------|-------------|
| `name` | `string` | 是 | 代币名称，1–32 个字符 |
| `symbol` | `string` | 是 | 代币符号，1–10 个字符 |
| `image` | `string` | 是 | 代币图片 URL（Irys 网关） |
| `description` | `string` | 否 | 代币描述，最多 250 个字符 |
| `decimals` | `number` | 否 | 代币精度，1–9（默认为 6）。新代币的 `launchpool` 必须为 6，已有代币必须与链上铸造账户一致 |
| `supply` | `number` | 否 | 代币总供应量（默认为 1,000,000,000） |
| `network` | `string` | 否 | `'solana-mainnet'`（默认）或 `'solana-devnet'` |
| `quoteMint` | `string` | 否 | 报价代币铸造地址（默认为 wrapped SOL） |
| `type` | `string` | 是 | 发行类型（见[发行类型](#launch-types)） |
| `finalize` | `boolean` | 否 | 是否最终确认发行（默认为 `true`） |
| `allocations` | `array` | 是 | 分配配置数组 |
| `externalLinks` | `object` | 否 | 网站、Twitter、Telegram 链接 |
| `publicKey` | `string` | 是 | 创建者的钱包公钥（必须与顶级 `wallet` 字段一致） |
| `useExistingToken` | `boolean` | 否 | 发行已有的 SPL 代币，而不是铸造新代币（见[已有代币](#existing-tokens)） |
| `mintAddress` | `string` | 否 | 已有代币的铸造地址。`useExistingToken` 为 `true` 时必填 |
| `isMutable` | `boolean` | 否 | 代币元数据是否保持可变（默认为 `true`） |

对于新代币，各分配的供应量之和必须恰好等于 `supply`。`supply` 不是默认值 1,000,000,000 的新代币会返回 `403`，除非你的账户已启用自定义供应量。

### 发行类型 {% #launch-types %}

| `type` | 描述 |
|--------|-------------|
| `launchpool` | 按比例分配池。分配：一个 `launchpoolV2`，以及任意数量的 `unlockedV2` 和 `claimScheduleV2` |
| `presale` | 固定价格预售。分配（按顺序）：`presaleV2`、`unlockedV2`，然后是任意数量的 `claimScheduleV2` |
| `bondingCurve` | 联合曲线发行。分配：一个 `bondingCurveV2`。固定为 1,000,000,000 供应量、6 位精度和 SOL 报价 |

Schema 还定义了 `auction` 和 `custom`。`auction` 是尚未实现的占位类型，`custom` 会被公共 API 以 `400` 拒绝。

### 分配类型 {% #allocation-types %}

`allocations` 数组中的每个分配都有一个 `type` 字段、`name`、`supply`，以及一个以相同类型名为键的配置对象：

- **`launchpoolV2`** — 按比例分配池
- **`presaleV2`** — 固定价格预售
- **`bondingCurveV2`** — 联合曲线销售
- **`unlockedV2`** — 向接收方分配解锁代币
- **`claimScheduleV2`** — 按归属计划释放给接收方的代币，可选悬崖期

Raydium 流动性作为销售分配上的资金流配置，而不是单独的分配：`RaydiumLP` 资金流创建 Raydium CPMM 池，`RaydiumClmmLP` 资金流创建 Raydium CLMM（集中流动性）头寸。除非你的账户已启用，CLMM 发行会返回 `403`。

{% callout type="warning" title="Streamflow 分配已停用" %}
之前的 `lockedV2`（Streamflow）分配类型已不再被接受。锁仓和归属分配请使用 `claimScheduleV2`。
{% /callout %}

### 已有代币 {% #existing-tokens %}

要发行你已铸造的代币，请设置 `useExistingToken: true` 并传入代币的 `mintAddress`。`decimals` 必须与链上铸造账户一致。与新代币不同，分配可以只覆盖部分供应量：总和必须大于 0 且不超过 `supply`，其余部分保留在创建者钱包中。除非你的账户已启用，已有代币发行会返回 `403`，且不适用于 `bondingCurve` 类型。

### 智能体发行 {% #agent-launches %}

传入 `agent` 以已注册的[智能体](/zh/agents)作为创建者进行发行：

| 字段 | 类型 | 必填 | 描述 |
|-------|------|----------|-------------|
| `agent.mint` | `string` | 是 | 智能体的 Core 资产地址。必须由 `wallet` 持有 |
| `agent.setToken` | `boolean` | 是 | 是否将发行的代币设为智能体的代币 |

智能体的资产签名者钱包将成为发行创建者。请向[注册发行](/zh/api/register)传入相同的 `agent.mint`。

{% callout type="note" %}
SDK 的 `buildCreateLaunchPayload` 函数负责将简化的 `CreateLaunchInput` 转换为此完整载荷格式。请参阅 [API 客户端](/zh/smart-contracts/genesis/sdk/api-client)文档。
{% /callout %}

## 请求示例 — Launch Pool 类型

```bash
curl -X POST https://api.metaplex.com/v1/launches/create \
  -H "Content-Type: application/json" \
  -d '{
    "wallet": "YourWalletPublicKey...",
    "launch": {
      "name": "My Token",
      "symbol": "MTK",
      "image": "https://gateway.irys.xyz/...",
      "decimals": 6,
      "supply": 1000000000,
      "network": "solana-devnet",
      "quoteMint": "So11111111111111111111111111111111111111112",
      "type": "launchpool",
      "finalize": true,
      "publicKey": "YourWalletPublicKey...",
      "allocations": [...]
    }
  }'
```

## 成功响应

```json
{
  "success": true,
  "transactions": [
    "base64-encoded-transaction-1...",
    "base64-encoded-transaction-2..."
  ],
  "blockhash": {
    "blockhash": "...",
    "lastValidBlockHeight": 123456789
  },
  "mintAddress": "MintPublicKey...",
  "genesisAccount": "GenesisAccountPDA..."
}
```

| 字段 | 类型 | 描述 |
|-------|------|-------------|
| `success` | `boolean` | 成功时为 `true` |
| `transactions` | `string[]` | Base64 编码的序列化交易 |
| `blockhash` | `object` | 用于交易确认的区块哈希 |
| `mintAddress` | `string` | 代币铸造公钥 |
| `genesisAccount` | `string` | Genesis 账户 PDA 公钥 |

## 错误响应

```json
{
  "success": false,
  "error": "Validation failed",
  "details": [...]
}
```

| 字段 | 类型 | 描述 |
|-------|------|-------------|
| `success` | `boolean` | 错误时为 `false` |
| `error` | `string` | 错误信息 |
| `details` | `array?` | 验证错误详情（适用时） |

## 错误码

| 状态码 | 描述 |
|------|-------------|
| `400` | 无效输入或验证失败 |
| `500` | 内部服务器错误 |

## 推荐：使用 SDK

我们建议使用 [`createAndRegisterLaunch`](/zh/smart-contracts/genesis/sdk/api-client) 而非直接调用此端点，该函数在一次调用中处理整个流程——创建交易、签名、发送和注册：

{% code-tabs-imported from="genesis/api_easy_mode" frameworks="umi" filename="createAndRegisterLaunch" /%}

请参阅 [API 客户端](/zh/smart-contracts/genesis/sdk/api-client)获取完整的 SDK 文档，包括全部三种集成模式。
