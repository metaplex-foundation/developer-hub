---
title: Metaplex x402 API 参考
metaTitle: Metaplex x402 API 参考 - 端点、定价与客户端导出 | Metaplex
description: Metaplex x402 API 的完整参考 - 基础 URL，聊天补全、图像生成与 Solana RPC 端点，免费发现端点，委托路由，支付质询字段，最新定价，以及客户端导出的辅助函数与选项。
keywords:
  - Metaplex x402 API
  - x402 endpoints
  - x402 pricing
  - OpenAI compatible endpoint
  - Solana RPC endpoint
  - MetaplexSvmExactScheme
  - payment required header
about:
  - Metaplex x402
  - API Reference
  - Solana
  - Metaplex
proficiencyLevel: Intermediate
programmingLanguage:
  - TypeScript
created: '09-08-2026'
updated: '09-08-2026'
---

Metaplex x402 API 部署在 `https://api.metaplex.com/x402`，提供三项付费服务、两个免费发现端点和四条 Agent 委托路由。本页是端点、定价和客户端导出的参考；构建付费端点所需的支持支付 `fetch` 的方法见[支付模式指南](/zh/agents/x402/payment-modes)。{% .lead %}

## 摘要 {% #summary %}

每个付费端点都会对未付费请求返回 HTTP `402`，并附带 `PAYMENT-REQUIRED` 头，精确说明需要支付什么，客户端随后携带支付证明重试。标准钱包模式，以及 Core 资产或 Agent 直接支付的模式，都会在本地为每笔支付签名；而委托 Agent 则通过一次消息签名完成认证，由服务从 Agent 钱包构建支付。发现端点无需支付也无需签名者。

- **基础 URL** — API 为 `https://api.metaplex.com/x402`，Solana JSON-RPC 为 `https://api.metaplex.com/x402/rpc`
- **传输格式** — 聊天与图像使用标准 OpenAI 请求/响应体，RPC 使用标准 Solana JSON-RPC
- **结算** — Solana 主网上的 USDC，x402 协议版本 2，`exact` 方案
- **客户端版本** — `@metaplex-foundation/x402` `0.1.0`，Node.js 20.18+，仅 ESM

## 基础 URL 与常量 {% #base-urls-and-constants %}

客户端导出了两个基础 URL，因此应用无需硬编码。

| 常量 | 值 |
|------|-----|
| `METAPLEX_X402_BASE_URL` | `https://api.metaplex.com/x402` |
| `METAPLEX_X402_RPC_URL` | `https://api.metaplex.com/x402/rpc` |

## 端点 {% #endpoints %}

付费端点需要支持支付的 `fetch`，免费端点则不需要。

| 方法 | 路径 | 支付 | 说明 |
|------|------|------|------|
| `GET` | `/x402/models` | 免费 | 可用的模型 ID |
| `GET` | `/x402/pricing` | 免费 | 模型费率、请求最低金额、RPC 方法价格、法律条款 URL |
| `POST` | `/x402/chat/completions` | 付费 | OpenAI 兼容的聊天补全 |
| `POST` | `/x402/images/generations` | 付费 | OpenAI 兼容的图像生成 |
| `POST` | `/x402/rpc` | 付费 | Solana JSON-RPC 与 [DAS](/zh/solana/rpcs-and-das)，仅限 HTTP |
| `GET` | `/x402/core-execute-delegate/status` | 免费 | Core 资产的委托状态 |
| `POST` | `/x402/core-execute-delegate/approve` | 免费 | 批准执行委托 |
| `POST` | `/x402/core-execute-delegate/revoke` | 免费 | 撤销执行委托 |
| `POST` | `/x402/core-execute-delegate/auth` | 免费 | 用 Sign-In-With-X 签名换取 24 小时有效的 bearer 令牌 |

委托路由已由[客户端导出](#client-exports)中列出的 SDK 辅助函数封装；请调用这些函数，而不要直接调用路由。

## 发现端点 {% #discovery-endpoints %}

发现端点可免费调用，并通过客户端辅助函数返回带类型的数据。

```ts {% title="无需支付即可读取模型与定价" %}
import { getModels, getPricing } from '@metaplex-foundation/x402';

// Available model IDs, e.g. 'openai/gpt-5.4-mini'.
const models = await getModels();

// Per-model token rates, request minimums, RPC method prices, and legal URLs.
const pricing = await getPricing();
```

`GET /x402/models` 返回 OpenAI 格式的模型列表：

```json {% title="GET /x402/models 响应（节选）" %}
{
  "object": "list",
  "data": [
    { "id": "anthropic/claude-opus-4.8", "object": "model", "created": 0, "owned_by": "anthropic" },
    { "id": "openai/gpt-5.4-mini", "object": "model", "created": 0, "owned_by": "openai" }
  ]
}
```

## 聊天补全端点 {% #chat-completions-endpoint %}

`POST /x402/chat/completions` 接受并返回标准的 OpenAI 聊天补全请求体，模型以 `<provider>/<model>` 形式指定。

```ts {% title="通过 OpenAI SDK 进行聊天补全" %}
import { METAPLEX_X402_BASE_URL } from '@metaplex-foundation/x402';
import OpenAI from 'openai';

const openai = new OpenAI({
  // The OpenAI SDK requires a value, but this gateway authenticates by payment.
  apiKey: 'x402',
  baseURL: METAPLEX_X402_BASE_URL,
  fetch: fetchWithPayment,
});

const completion = await openai.chat.completions.create({
  model: 'openai/gpt-5.4-mini',
  messages: [{ role: 'user', content: 'Say hi in one word.' }],
});
```

Vercel AI SDK 通过其 OpenAI 兼容提供商访问同一端点：

```ts {% title="通过 Vercel AI SDK 进行聊天补全" %}
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { METAPLEX_X402_BASE_URL } from '@metaplex-foundation/x402';
import { generateText } from 'ai';

const metaplex = createOpenAICompatible({
  name: 'metaplex-x402',
  apiKey: 'x402',
  baseURL: METAPLEX_X402_BASE_URL,
  fetch: fetchWithPayment,
});

const { text } = await generateText({
  model: metaplex.chatModel('openai/gpt-5.4-mini'),
  prompt: 'Say hi in one word.',
});
```

## 图像生成端点 {% #image-generation-endpoint %}

`POST /x402/images/generations` 接受标准的 OpenAI 图像生成请求体。

```ts {% title="通过 OpenAI SDK 生成图像" %}
const image = await openai.images.generate({
  model: 'openai/gpt-image-1.5',
  prompt: 'A yellow square.',
  size: '1024x1024',
});
```

```ts {% title="通过 Vercel AI SDK 生成图像" %}
import { generateImage } from 'ai';

const { image } = await generateImage({
  model: metaplex.imageModel('openai/gpt-image-1.5'),
  prompt: 'A yellow square.',
  size: '1024x1024',
});
```

## Solana RPC 端点 {% #solana-rpc-endpoint %}

`POST /x402/rpc` 接受标准的 Solana JSON-RPC 请求并透传 [DAS](/zh/solana/rpcs-and-das) 方法，每个请求单独定价与支付。

```ts {% title="通过 Solana Kit 使用 Solana RPC" %}
import { createSolanaRpcFromTransport, type RpcTransport } from '@solana/kit';
import { METAPLEX_X402_RPC_URL } from '@metaplex-foundation/x402';

const rpcTransport: RpcTransport = async ({ payload, signal }) => {
  const response = await fetchWithPayment(METAPLEX_X402_RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: signal ?? null,
  });

  return response.json();
};

const rpc = createSolanaRpcFromTransport(rpcTransport);
const slot = await rpc.getSlot().send();
```

```ts {% title="通过 web3.js 使用 Solana RPC" %}
import { METAPLEX_X402_RPC_URL } from '@metaplex-foundation/x402';
import { Connection } from '@solana/web3.js';

const connection = new Connection(METAPLEX_X402_RPC_URL, {
  fetch: fetchWithPayment,
});
const slot = await connection.getSlot();
```

{% callout type="warning" title="x402 的 RPC 端点仅支持 HTTP" %}
不支持 WebSocket 连接和订阅。`accountSubscribe`、`logsSubscribe` 等订阅方法请使用常规 RPC 提供商。
{% /callout %}

## 支付质询字段 {% #payment-challenge-fields %}

对付费端点发起未付费请求会返回 HTTP `402`，并附带 base64 编码的 `PAYMENT-REQUIRED` 头。使用 `@metaplex-foundation/x402` 构建的客户端会自动解析该头；下列字段供调试以及非 JavaScript 客户端参考。

| 字段 | 示例值 | 含义 |
|------|-------|------|
| `x402Version` | `2` | 协议版本 |
| `accepts[].scheme` | `exact` | 支付方案 |
| `accepts[].network` | `solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp` | Solana 主网的 CAIP-2 网络标识符 |
| `accepts[].asset` | `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v` | USDC 铸币地址 |
| `accepts[].amount` | `1000` | 以该资产最小单位计的金额 — `1000` 即 `$0.001` |
| `accepts[].payTo` | `9AYgwvWMhZuir6rZoto13jrU1oZA1XxRDhqPznxyomHv` | 收款账户 |
| `accepts[].maxTimeoutSeconds` | `300` | 必须提交支付的时间窗口 |
| `accepts[].extra.quoteId` | UUID | 标识本次支付对应的报价 |
| `accepts[].extra.usage` | OpenAI usage 对象 | 报价所依据的实测 token 用量 |
| `accepts[].extra.memo` | `metaplex:x402:chat.completions` | 随结算一并写入的 Memo |
| `accepts[].extra.feePayer` | 公钥 | 承担支付交易网络费用的账户 |
| `extensions["metaplex-core-execute-delegate"]` | 对象 | 委托认证信息 — `sign-in-with-x`、bearer 令牌、令牌端点，以及用于指明付款资产的 `X-METAPLEX-CORE-ASSET` 头 |

{% callout type="note" title="报价基于实测用量计算" %}
推理请求的 `402` 质询会携带 `quoteId` 和已填充的 `usage` 对象，因此金额反映的是该请求实际消耗的 token，而非估算值。响应头 `PAYMENT-REQUIRED` 和 `PAYMENT-RESPONSE` 均已通过 CORS 暴露。
{% /callout %}

## 聊天补全定价 {% #chat-completion-pricing %}

聊天模型按每百万 token 计价，输入、缓存输入和输出各有独立费率，并适用每次请求 `$0.001` 的最低金额。以下费率读取自 2026-09-08 的 `GET /x402/pricing`。

| 模型 | 输入 | 缓存输入 | 输出 |
|------|------|---------|------|
| `anthropic/claude-opus-4.8` | $5.00 | $0.50 | $25.00 |
| `anthropic/claude-opus-4.7` | $5.00 | $0.50 | $25.00 |
| `anthropic/claude-opus-4.6` | $5.00 | $0.50 | $25.00 |
| `anthropic/claude-opus-4.5` | $5.00 | $0.50 | $25.00 |
| `anthropic/claude-sonnet-4.6` | $3.00 | $0.30 | $15.00 |
| `anthropic/claude-sonnet-4.5` | $3.00 | $0.30 | $15.00 |
| `anthropic/claude-haiku-4.5` | $1.00 | $0.10 | $5.00 |
| `openai/gpt-5.5` | $5.00 | $0.50 | $30.00 |
| `openai/gpt-5.4` | $2.50 | $0.25 | $15.00 |
| `openai/gpt-5.4-mini` | $0.75 | $0.075 | $4.50 |
| `openai/gpt-5.4-nano` | $0.20 | $0.02 | $1.25 |

当输入 token 超过 272,000 时，`openai/gpt-5.5` 和 `openai/gpt-5.4` 适用更高的长上下文费率 — `gpt-5.5` 为输入 $10.00、输出 $45.00，`gpt-5.4` 为输入 $5.00、输出 $22.50。

## 图像生成定价 {% #image-generation-pricing %}

图像模型按四个类别以每百万 token 计价，同样适用每次请求 `$0.001` 的最低金额。

| 模型 | 输入文本 | 输入图像 | 输出图像 | 输出文本 |
|------|---------|---------|---------|---------|
| `openai/gpt-image-1.5` | $5.00 | $8.00 | $32.00 | $10.00 |
| `openai/gpt-image-2` | $5.00 | $8.00 | $30.00 | $10.00 |

## Solana RPC 定价 {% #solana-rpc-pricing %}

RPC 调用默认每次请求 `$0.00001`，较重的方法费率更高。

| 方法 | 每次请求价格 |
|------|------------|
| 默认（未列出的所有方法） | $0.00001 |
| `getBlockTime` | $0.00001 |
| `getTransaction` | $0.00002 |
| `getBlocks` | $0.00002 |
| `getBlocksWithLimit` | $0.00002 |
| `getConfirmedTransaction` | $0.00002 |
| `getBlock` | $0.00005 |
| `getConfirmedBlock` | $0.00005 |
| `getSignaturesForAddress` | $0.00010 |

## `MetaplexSvmExactScheme` 选项 {% #metaplexsvmexactscheme-options %}

`MetaplexSvmExactScheme` 是用于 Core 资产和 Agent 支付的支付方案。

| 选项 | 是否必填 | 说明 |
|------|---------|------|
| `rpcUrl` | 是 | 用于构建支付交易的 RPC 端点 |
| `coreExecute.asset` | Core 资产支付时必填 | 由其签名者 PDA 出资的 Core 资产或 Agent |
| `coreExecute.collection` | 资产属于合集时必填 | 该资产所属的 Core 合集 |
| `coreExecute.executionDelegateRecord` | 否 | 进阶：覆盖执行委托记录 |
| `commitment` | 否 | 获取区块哈希时的 commitment，默认 `confirmed` |
| `computeUnitLimit` | 否 | Core `execute` 支付默认 200,000，其他情况为 20,000 |

该方案接受 Umi 签名者和 Solana Kit 的部分交易签名者，但不接受 sign-and-send 签名者。Kit 签名者会在内部完成适配。

## 客户端导出 {% #client-exports %}

`@metaplex-foundation/x402` 将其公开 API 集中在包根目录。

| 类别 | 导出 |
|------|------|
| 支付 | `MetaplexSvmExactScheme`、`MetaplexSvmSigner`、`kitPartialTransactionSignerToUmiSigner` |
| Agent 委托 | `fetchMetaplexCoreExecuteDelegateStatus`、`approveMetaplexCoreExecuteDelegate`、`revokeMetaplexCoreExecuteDelegate`、`authorizeMetaplexCoreExecuteDelegate` |
| Agent 支付传输层 | `createMetaplexCoreExecuteDelegateClientExtension`、`wrapFetchWithMetaplexCoreExecuteDelegate` 以及各令牌存储实现 |
| 发现 | `getModels`、`getPricing`、`METAPLEX_X402_BASE_URL`、`METAPLEX_X402_RPC_URL` |

选项与结果类型、协议常量以及委托路由的 schema 同样从包根目录导出。

## 环境变量 {% #environment-variables %}

[x402 仓库](https://github.com/metaplex-foundation/x402/tree/main/examples)中的可运行示例会读取以下变量。

| 变量 | 是否必填 | 说明 |
|------|---------|------|
| `SVM_PRIVATE_KEY` | 是 | Base58 编码的 64 字节开发用密钥对 |
| `CORE_ASSET_ADDRESS` | Core 资产与 Agent 示例 | 由该密钥对拥有的 Metaplex Core 资产 |
| `SVM_RPC_URL` | 否 | x402 SVM 方案使用的自定义 Solana RPC URL |
| `METAPLEX_X402_BASE_URL` | 否 | API 基础 URL，默认 `https://api.metaplex.com/x402` |
| `METAPLEX_X402_RPC_URL` | 否 | RPC URL，默认 `https://api.metaplex.com/x402/rpc` |
| `METAPLEX_API_BASE_URL` | 否 | 本地开发用的 API 根地址覆盖，例如 `http://localhost:3000/api` |

## 注意事项 {% #notes %}

- 本参考中的价格是 2026-09-08 读取的快照。线上服务的 `GET /x402/pricing` 才是实际生效的价目表，且可免费调用。
- 支付以 USDC 从经典 SPL Token 的关联代币账户结算。目前不支持 Token-2022 支付铸币。
- Core 资产和 Agent 支付模式需要在资产签名者 PDA 中保留 SOL 以支付 Core `execute` 费用；标准钱包支付则不需要。
- 托管服务端不是开源的。客户端、示例和协议类型以 Apache-2.0 发布。
- 使用本 API 即表示同意 [Metaplex.com 使用条款](https://www.metaplex.com/terms-of-use)和[隐私政策](https://www.metaplex.com/privacy)。

## 快速参考 {% #quick-reference %}

| 项目 | 值 |
|------|-----|
| API 基础 URL | `https://api.metaplex.com/x402` |
| RPC URL | `https://api.metaplex.com/x402/rpc` |
| JS 客户端 | `@metaplex-foundation/x402`（`0.1.0`） |
| 运行时 | Node.js 20.18+、ESM |
| 协议 | x402 版本 2，`exact` 方案 |
| 网络 | `solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp`（Solana 主网） |
| 支付铸币 | `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`（USDC） |
| 运营 Agent | `MECHjj31U1hBapoVeJtZo5U5WGRd2293JEwRErvPTuF` |
| 源代码 | [GitHub](https://github.com/metaplex-foundation/x402)（Apache-2.0） |

---

由 Metaplex Foundation 维护。最后验证日期：2026-09-08。客户端版本：`@metaplex-foundation/x402` `0.1.0`。[在 GitHub 上查看源码](https://github.com/metaplex-foundation/x402)。
