---
title: Nori 示例 Agent
metaTitle: Nori 示例 Agent - 推理、图像生成与 RPC 消费方 | Metaplex
description: 消费 Nori 各项服务的可运行 Agent 示例 - 使用 chat.completion 的 OpenAI 兼容推理 Agent、使用 image.generation 的艺术创作 Agent、使用 solana.rpc 及 DAS 的投资组合分析器，以及原生 A2A JSON-RPC 调用方。
keywords:
  - Nori examples
  - example agents
  - OpenAI-compatible agent
  - chat.completion
  - image.generation
  - solana.rpc
  - DAS API
  - A2A message/send
  - agent template
about:
  - Nori
  - Autonomous Agents
  - Agent Commerce
  - Solana
  - Metaplex
proficiencyLevel: Intermediate
created: '07-08-2026'
updated: '07-08-2026'
programmingLanguage:
  - TypeScript
faqs:
  - q: 哪些 SDK 可以配合 Nori 的推理服务使用？
    a: 任何 OpenAI 兼容客户端都可以 — 通过 createOpenAICompatible 的 Vercel AI SDK、使用自定义 baseURL 的官方 OpenAI SDK，或接受 OpenAI 兼容提供商的 Agent 框架（如 Mastra）。将客户端指向 NORI_URL/v1，并将 Bearer 令牌附加为 Authorization 请求头。
  - q: 我的 Agent 可以通过 Nori 使用 getAssetsByOwner 之类的 DAS 方法吗？
    a: 可以。solana.rpc 服务是对具备 DAS 能力的上游提供商的透明 JSON-RPC 透传，因此 DAS 方法（getAsset、getAssetsByOwner 等）的用法与标准 Solana RPC 方法完全相同 — 同一个端点，同样的按次调用价格。
  - q: 这些示例不委托也能运行吗？
    a: 可以，通过 x402 后备轨道 — 每个首次调用会返回带支付要求的 HTTP 402，而不是直接执行。示例假设已完成委托，因为委托消除了支付往返；一次性设置参见委托给 Nori。
  - q: 我可以通过 chat.completion 请求哪些模型？
    a: 费率卡上的任何模型，以 <provider>/<model> 形式指定 — 例如 anthropic/claude-sonnet-4-6、openai/gpt-5.4 或 google/gemini-2.5-flash。GET /v1/models 列出实时目录，GET /rate-card 载有每 token 价格。
---

这些示例展示了一个消费方 Agent 使用 Nori 的三项服务 — LLM 推理、图像生成和 Solana RPC — 以及供 Agent 间调用方使用的原生 A2A 信封。每个示例都假设一次性的[委托设置](/agents/nori/delegate-to-nori)已经完成且手头有 Bearer `token`；相同的请求在未委托的情况下也能通过 x402 后备轨道运行，只是会增加一次支付往返。{% .lead %}

## 概述

每个示例都是一次完整的 Nori 付费调用 — 任何地方都不需要提供商 API 密钥。

- **推理 Agent** — 将 OpenAI 兼容客户端指向 `NORI_URL/v1`，运行带工具调用的 `chat.completion`
- **艺术创作 Agent** — 通过 `image.generation`（gpt-image-1）生成图像
- **投资组合分析器** — 通过 `solana.rpc` 读取余额和代币持仓，包括 DAS 方法
- **A2A 调用方** — 通过 JSON-RPC `message/send` 调用相同的技能，用于 Agent 间集成

## 使用 chat.completion 的推理 Agent

将 OpenAI 兼容客户端指向 `NORI_URL/v1`，Agent 的 LLM 大脑就可以完全运行在 Nori 上。模型以 `<provider>/<model>` 形式指定，并路由到上游的 Anthropic、OpenAI 或 Google；三家提供商都支持工具调用（`tools`、`tool_choice`、`tool_calls`），因此完整的 Agent 循环无需修改即可运行。

```typescript {% title="inference-agent.ts" %}
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { generateText, tool } from 'ai';
import { z } from 'zod';

const nori = createOpenAICompatible({
  name: 'nori',
  baseURL: `${NORI_URL}/v1`,
  headers: { Authorization: `Bearer ${token}` }, // from /auth/handshake
});

const { text } = await generateText({
  model: nori('anthropic/claude-sonnet-4-6'),
  tools: {
    getSolPrice: tool({
      description: 'Get the current SOL price in USD',
      inputSchema: z.object({}),
      execute: async () => fetchSolPrice(),
    }),
  },
  prompt: 'Is SOL above $200 right now? Answer in one sentence.',
});
```

每次 `generateText` 调用都是一次计量的 `chat.completion` — 按实际的输入/输出 token 数量、以所选模型的[费率卡](/agents/nori/pricing-and-billing)价格计费，从 Agent 的 PDA 结算。切换模型（或在[服务中断期间](/agents/nori/#nori-作为单点故障)回退到非 Nori 提供商）只需改一行代码，因为线格式是规范的 OpenAI 格式。

## 使用 image.generation 的艺术创作 Agent

需要艺术作品的 Agent — NFT 图像、头像、面向其用户的生成内容 — 以标准的 OpenAI 图像请求形状调用 `POST /v1/images/generations`。Nori 路由到上游的 gpt-image-1，并按每张图像收取固定价格。

```typescript {% title="artwork-agent.ts" %}
const response = await fetch(`${NORI_URL}/v1/images/generations`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    model: 'openai/gpt-image-1',
    prompt: 'Pixel-art portrait of a sea-otter plumber holding a wrench',
    n: 1,
    size: '1024x1024',
  }),
}).then((r) => r.json());

const imageB64 = response.data[0].b64_json;
```

典型的后续步骤是上传图像并将其铸造为 [MPL Core](/smart-contracts/core) 资产 — 生成步骤和铸造步骤相互独立，只有生成会产生 Nori 扣费。

## 使用 solana.rpc 的投资组合分析器

链上数据 Agent 通过同一条计费管道获得 RPC 和 DAS 访问。`POST /v1/solana/rpc` 是对具备 DAS 能力的上游的透明 JSON-RPC 透传，因此标准方法（`getBalance`）和 DAS 方法（`getAsset`、`getAssetsByOwner`）共享同一个端点和同样的按次调用价格。这个投资组合分析器实现了“收集 → 补充 → 总结”工作流中的收集步骤：

```typescript {% title="portfolio-analyzer.ts" %}
async function noriRpc(method: string, params: unknown[]) {
  const res = await fetch(`${NORI_URL}/v1/solana/rpc`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  }).then((r) => r.json());
  return res.result;
}

// Gather: SOL balance + all token holdings for a wallet.
const owner = '11111111111111111111111111111112'; // wallet under analysis
const balance = await noriRpc('getBalance', [owner]);

// DAS method — same endpoint, same per-call price.
const assets = await noriRpc('getAssetsByOwner', [
  { ownerAddress: owner, page: 1, limit: 100 },
]);

// Enrich/summarize: feed the holdings to the inference agent above
// for a natural-language portfolio breakdown.
```

由于每次调用都单独计量（固定的按次调用价格），循环式 Agent — 按间隔轮询的价格监视器、遍历分页持仓的分析器 — 应当有意识地为调用做预算：PDA 余额就是支出上限，钱包为空会[硬停止](/agents/nori/pricing-and-billing#硬停止语义)服务。

## 使用 A2A message/send 的 Agent 间调用方

在协议层集成（而非通过 OpenAI SDK）的 Agent，通过 `POST /a2a` 上的 JSON-RPC 2.0 调用相同的技能，并从 [Agent 卡片](/agents/nori/#nori-提供的服务)发现它们。技能输入与 HTTP 接口逐字节相同 — OpenAI 请求体只是作为 DataPart 装在 `message/send` 信封里传输：

```typescript {% title="a2a-caller.ts" %}
const task = await fetch(`${NORI_URL}/a2a`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'message/send',
    params: {
      requestId: crypto.randomUUID(),
      message: {
        parts: [
          {
            kind: 'data',
            data: {
              skill: 'chat.completion',
              input: {
                model: 'anthropic/claude-sonnet-4-6',
                messages: [{ role: 'user', content: 'Hello from another agent.' }],
              },
            },
          },
        ],
      },
    },
  }),
}).then((r) => r.json());
```

`message/send` 同步返回一个已完成的任务；`tasks/get` 按 ID 获取之前的任务。将 `skill` 换为 `image.generation` 或 `solana.rpc`，输入形状与其 HTTP 对应端点相同。

{% callout type="note" title="v1 不提供流式传输" %}
`message/sendStream` 在 Agent 卡片上有声明，但在 v1 中返回 501，且 `/v1/chat/completions` 是非流式的。请围绕完整响应来设计 Agent 循环。
{% /callout %}

## 快速参考

| 示例 | 服务 | 端点 | 计费方式 |
|---------|---------|----------|-----------|
| 推理 Agent | `chat.completion` | `POST /v1/chat/completions` | 按输入/输出 token、按模型计费 |
| 艺术创作 Agent | `image.generation` | `POST /v1/images/generations` | 按图像计费 |
| 投资组合分析器 | `solana.rpc` | `POST /v1/solana/rpc` | 按调用计费（包括 DAS 方法） |
| A2A 调用方 | 任意技能 | `POST /a2a`（`message/send`） | 与底层技能相同 |

## 注意事项

- 所有示例都假设已有 `NORI_URL`（Nori 的基础 URL）和 `token`（来自[握手流程](/agents/nori/delegate-to-nori#步骤-3--使用-bearer-令牌进行认证)的 Bearer 令牌）；令牌 15 分钟后过期，因此长时间运行的 Agent 需要重新握手
- 没有 Bearer 令牌时，相同的请求通过 x402 轨道运行：首次调用会收到带支付要求的 HTTP 402，付款后重试
- 如果您更愿意从一个可运行的 Agent 开始，Metaplex Agent 模板已将这些模式打包为现成的 Mastra 工具（`chat-completion`、`generate-image`、`solana-rpc-call`、`delegate-to-nori`）
- 成功后计费适用于每个示例：失败的上游调用不产生任何费用 — 参见[定价与计费](/agents/nori/pricing-and-billing#成功后计费核算)

由 Metaplex Foundation 维护。最后验证日期：2026-07-08。[在 GitHub 上查看源码](https://github.com/metaplex-foundation/agent-plumber)。

## FAQ

关于基于 Nori 服务进行构建的常见问题。

### 哪些 SDK 可以配合 Nori 的推理服务使用？
任何 OpenAI 兼容客户端都可以 — 通过 `createOpenAICompatible` 的 Vercel AI SDK、使用自定义 `baseURL` 的官方 OpenAI SDK，或接受 OpenAI 兼容提供商的 Agent 框架（如 Mastra）。将客户端指向 `NORI_URL/v1`，并将 Bearer 令牌附加为 `Authorization` 请求头。

### 我的 Agent 可以通过 Nori 使用 getAssetsByOwner 之类的 DAS 方法吗？
可以。`solana.rpc` 服务是对具备 DAS 能力的上游提供商的透明 JSON-RPC 透传，因此 DAS 方法（`getAsset`、`getAssetsByOwner` 等）的用法与标准 Solana RPC 方法完全相同 — 同一个端点，同样的按次调用价格。

### 这些示例不委托也能运行吗？
可以，通过 x402 后备轨道 — 每个首次调用会返回带支付要求的 HTTP 402，而不是直接执行。示例假设已完成委托，因为委托消除了支付往返；一次性设置参见[委托给 Nori](/agents/nori/delegate-to-nori)。

### 我可以通过 chat.completion 请求哪些模型？
费率卡上的任何模型，以 `<provider>/<model>` 形式指定 — 例如 `anthropic/claude-sonnet-4-6`、`openai/gpt-5.4` 或 `google/gemini-2.5-flash`。`GET /v1/models` 列出实时目录，[`GET /rate-card`](/agents/nori/pricing-and-billing) 载有每 token 价格。
