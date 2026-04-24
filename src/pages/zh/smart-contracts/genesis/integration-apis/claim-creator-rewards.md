---
title: 认领创作者奖励
metaTitle: Genesis - 认领创作者奖励 | REST API | Metaplex
description: 通过单次 API 调用，跨钱包的所有 Genesis 联合曲线和 Raydium bucket 认领累积的创作者奖励。返回准备好签名的 Solana 交易。
method: POST
created: '04-23-2026'
updated: '04-23-2026'
keywords:
  - Genesis API
  - claim creator rewards
  - creator fees
  - claimCreatorRewards
  - v1/creator-rewards/claim
  - payer
about:
  - API endpoint
  - Creator rewards
  - Bonding curve fees
  - Raydium CPMM fees
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
  - Bash
---

通过单次调用，跨钱包有资格获得的每个 Genesis 联合曲线和 Raydium CPMM bucket 认领累积的创作者奖励。该端点返回钱包（或指定的 `payer`）必须签名并提交的 base64 编码 Solana 交易列表。{% .lead %}

{% callout type="note" title="可用 SDK 包装器" %}
大多数集成方应使用 Genesis JavaScript SDK 中的 [`claimCreatorRewards`](/smart-contracts/genesis/sdk/api-client#claim-creator-rewards) — 它处理交易反序列化、错误解析，并直接接入 [Umi 身份](/dev-tools/umi/getting-started#connecting-a-wallet)进行签名。仅在无法依赖 SDK 时才直接调用此端点。
{% /callout %}

## Summary

`POST /v1/creator-rewards/claim` 通过一次调用返回认领钱包在所有联合曲线和 Raydium CPMM bucket 上累积的创作者奖励所需的 Solana 交易。

- **聚合** — 一次请求即可跨所有符合条件的 bucket 认领；每个 bucket 返回一个交易
- **签名** — 响应是钱包（或可选的 `payer`）必须签名并提交的 base64 编码的 Solana 交易
- **错误** — 当没有累积时返回 HTTP `400` `"No rewards available to claim"`；调用方必须基于错误分支，而不是空数组
- **SDK 包装器** — [`claimCreatorRewards`](/smart-contracts/genesis/sdk/api-client#claim-creator-rewards) 处理反序列化、类型化错误和 Umi 签名

## 端点

```
POST /v1/creator-rewards/claim
```

| 环境 | 基础 URL |
|-------------|----------|
| Devnet & Mainnet | `https://api.metaplex.com` |

## 请求体

| 字段 | 类型 | 必填 | 说明 |
|-------|------|----------|-------------|
| `wallet` | `string` | 是 | 要认领的创作者费钱包的 base58 编码公钥。这是在 bucket 上设置为 `creatorFeeWallet` 的钱包——若未配置覆盖，则为发行钱包。 |
| `network` | `string` | 否 | `'solana-mainnet'`（默认）或 `'solana-devnet'`。必须与基础 URL 的集群匹配。 |
| `payer` | `string` | 否 | 承担返回交易的交易费和租金的 base58 编码公钥。省略时默认为 `wallet`。 |

### 何时设置 `payer`

当创作者费钱包不持有 SOL 时（例如 agent PDA 或冷钱包），将 `payer` 设置为不同的钱包。`payer` 必须签署返回的交易，因此通常是代表创作者提交认领的钱包。创作者费收件人仍会收到认领的 SOL — `payer` 仅承担费用和租金。

## 请求示例

{% code-tabs-imported from="genesis/api_claim_creator_rewards" frameworks="umi,curl" defaultFramework="umi" /%}

## 成功响应

```json
{
  "data": {
    "transactions": ["<base64 transaction>", "<base64 transaction>"],
    "blockhash": {
      "blockhash": "ERKYmtrmNSKaw3VpnFYAfK3jvWGnd15Nf9kJxZqJ7JHx",
      "lastValidBlockHeight": 445407640
    }
  }
}
```

| 字段 | 类型 | 说明 |
|-------|------|-------------|
| `data.transactions` | `string[]` | base64 编码的 Solana 交易。每个都必须反序列化、由 payer（以及创作者费钱包，如果是单独的签名者）签名并提交。 |
| `data.blockhash.blockhash` | `string` | 构建交易时使用的最近区块哈希。请将其与 `confirmTransaction` 一起使用——不要用新获取的区块哈希替换它。 |
| `data.blockhash.lastValidBlockHeight` | `number` | 区块哈希过期后的槽高度。 |

{% callout type="note" %}
API 为每个被认领的 bucket 返回一个交易——通常是两个（联合曲线加 Raydium）。请按顺序提交；它们的顺序并不重要。
{% /callout %}

## 错误响应

错误以 HTTP 状态 `400` 返回，格式为：

```json
{ "error": { "message": "No rewards available to claim" } }
```

### 已知错误消息

| 消息 | HTTP | 原因 |
|---------|------|-------|
| `No rewards available to claim` | `400` | 钱包在任何 bucket 上都没有累积且未认领的创作者奖励。这是代替空 `transactions` 数组返回的，因此调用方必须将其作为非异常结果处理。 |
| `✖ Invalid wallet address` | `400` | `wallet` 不是有效的 base58 Solana 公钥。 |

{% callout type="warning" title="无奖励是 400，而非空数组" %}
当钱包没有可认领内容时，端点返回 HTTP `400` 和消息 `No rewards available to claim`——它**不会**返回带 `transactions: []` 的 `200`。调用方必须捕获错误（或检查 `response.status` 和 `body.error.message`），并将此情况视为"无事可做"，而非失败。SDK 将其呈现为类型化的 `GenesisApiError`；请参阅[错误处理](/smart-contracts/genesis/creator-fees#处理无奖励情况)。
{% /callout %}

## 注意事项

- 端点在 bucket 级别是幂等的——成功认领后立即再次调用，将返回 `No rewards available to claim`，直到累积新费用为止。
- 返回的交易使用 `data.blockhash` 中的区块哈希。如果确认时间超过 ~60–90 秒，区块哈希将过期，必须重新调用以获取一组新的交易。
- 创作者奖励在每次兑换（联合曲线）和 LP 交易活动（Raydium CPMM）中累积——此端点聚合两者。有关基础累积机制和按 bucket 的获取助手，请参阅 [Genesis 联合曲线创作者费](/smart-contracts/genesis/creator-fees)。
- 创作者费钱包在 bucket 创建时通过 `creatorFeeWallet` 设置，曲线上线后无法更改。

## 推荐：使用 SDK

不要直接调用此端点，而是使用 `@metaplex-foundation/genesis` 中的 [`claimCreatorRewards`](/smart-contracts/genesis/sdk/api-client#claim-creator-rewards)：

{% code-tabs-imported from="genesis/api_claim_creator_rewards" frameworks="umi" filename="claimCreatorRewards" /%}

完整的 SDK 表面请参阅 [API 客户端](/smart-contracts/genesis/sdk/api-client)页面，端到端认领指南请参阅[创作者费](/smart-contracts/genesis/creator-fees)。
