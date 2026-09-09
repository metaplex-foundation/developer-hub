---
title: Metaplex x402 - 按请求付费的 AI 与 Solana RPC
metaTitle: Metaplex x402 - 面向 Agent 的按请求付费 AI 推理与 Solana RPC | Metaplex
description: Metaplex x402 通过 HTTP 提供 LLM 推理、图像生成和 Solana RPC，无需 API 密钥和账户。每个请求都会从钱包、Core 资产或已委托的 Agent 中以 USDC 自动完成支付。
keywords:
  - Metaplex x402
  - x402 payments
  - pay per request API
  - agent payments
  - OpenAI compatible API
  - Solana RPC
  - USDC micropayments
  - Mech agent
about:
  - Metaplex x402
  - Agent Commerce
  - Solana
  - Metaplex
proficiencyLevel: Beginner
created: '09-08-2026'
updated: '09-08-2026'
faqs:
  - q: 什么是 Metaplex x402？
    a: Metaplex x402 是一个按请求付费的 HTTP API，销售 LLM 推理、图像生成和 Solana RPC 访问。无需 API 密钥、账户或订阅 — 每个请求都通过 x402 协议在 Solana 上以 USDC 结算。x402 将 HTTP 的 402 Payment Required 状态转变为机器可支付的流程。
  - q: 使用 Metaplex x402 需要 API 密钥或账户吗？
    a: 不需要。支付即认证。您只需要一个持有 USDC 的 Solana 钱包、Core 资产或已注册的 Agent。OpenAI SDK 要求 apiKey 为非空值，因此示例传入字符串 'x402'，网关会忽略该值。
  - q: 什么是 Mech？
    a: Mech 是运营 x402 服务的链上 Metaplex Agent。支付以 USDC 结算到 Mech 的 Core 钱包 — 即其资产签名者 PDA。Mech 是一个向您的 Agent 或钱包销售服务的 Agent，地址为 MECHjj31U1hBapoVeJtZo5U5WGRd2293JEwRErvPTuF。
  - q: Nori 服务 Agent 的文档怎么了？
    a: Nori 页面描述的是一个从未公开发布、目前也不再维护的早期原型。取代它并实际上线的服务是 Metaplex x402。Nori 这个名称现在指的是 metaplex.com/nori 上的 Metaplex AI 副驾驶，那是一个与付费推理和 RPC 无关的独立产品。
  - q: Metaplex x402 是以 SOL 还是 USDC 计费？
    a: USDC。支付来自经典 SPL Token 的关联代币账户，不支持 Token-2022 支付铸币。Core 资产和 Agent 支付模式还需要在资产签名者 PDA 中保留少量 SOL，用于支付 Core execute 的交易费用。
  - q: Metaplex x402 的服务端是开源的吗？
    a: 客户端是开源的。TypeScript 客户端、示例和协议类型以 Apache-2.0 发布在 github.com/metaplex-foundation/x402。运行托管服务的服务端目前未公开。
  - q: 一次请求的费用是多少？
    a: 推理定价与上游提供商的 token 费率一致，并适用每次请求 $0.001 的最低金额。RPC 调用按请求计费，起价 $0.00001，较重的方法费率更高。GET /x402/pricing 返回最新费率，可免费调用。
---

Metaplex x402 是面向 LLM 推理、图像生成和 Solana RPC 的按请求付费 HTTP API — 无需 API 密钥、账户或订阅。只需准备一个持有 USDC 的 Solana 钱包、[Core 资产](/smart-contracts/core)或[已注册的 Agent](/agents/register-agent)，每个请求都会在发出时以 USDC 自动完成支付。{% .lead %}

## 摘要 {% #summary %}

Metaplex x402 将 HTTP 的 `402 Payment Required` 状态转变为机器可支付的流程：您的应用照常调用端点，服务端返回带有支付要求的 `402`，客户端对一笔 USDC 支付签名并重试，服务端在 Solana 上结算后返回响应。该服务由链上 Metaplex Agent [Mech](#mech-the-agent-that-operates-metaplex-x402) 运营。

- **三项服务** — OpenAI 兼容的聊天补全、OpenAI 兼容的图像生成，以及支持 [DAS](/solana/rpcs-and-das) 透传的 Solana JSON-RPC
- **三种支付模式** — 标准钱包、Core 资产或 Agent 直接支付，以及无需逐次签名即可支付的[委托 Agent](/agents/x402/payment-modes#pay-instantly-with-a-delegated-agent)
- **USDC 结算** — 支付来自经典 SPL Token 的关联代币账户，不支持 Token-2022 支付铸币
- **开源客户端** — [`@metaplex-foundation/x402`](https://github.com/metaplex-foundation/x402) 采用 Apache-2.0 许可，附带 12 个可运行示例；托管服务端未公开

{% callout type="note" title="Metaplex x402 与 Nori 这个名称" %}
Metaplex x402 取代了此前在这里以“Nori”为名记录的早期服务 Agent 原型。该原型从未公开发布，目前也不再维护；其 SOL 计价的计费方式、`/a2a` 接口和 Agent 卡片在本服务中并不存在。**[Nori](https://www.metaplex.com/nori) 现在是 Metaplex AI 副驾驶** — 一个与付费推理和 RPC 无关的独立产品。
{% /callout %}

## Metaplex x402 提供的服务 {% #services-metaplex-x402-provides %}

Metaplex x402 在单一基础 URL `https://api.metaplex.com/x402` 下提供三项付费服务和两个免费的发现端点。

| 服务 | 端点 | 支付 | 上游 |
|------|------|------|------|
| 聊天补全 | `POST /x402/chat/completions` | 付费 | Anthropic 和 OpenAI 模型，以 `<provider>/<model>` 形式指定 |
| 图像生成 | `POST /x402/images/generations` | 付费 | OpenAI `gpt-image-1.5` 和 `gpt-image-2` |
| Solana RPC 与 DAS | `POST /x402/rpc` | 付费 | Solana JSON-RPC，仅限 HTTP |
| 模型发现 | `GET /x402/models` | 免费 | 可用的模型 ID |
| 价格发现 | `GET /x402/pricing` | 免费 | Token 费率、请求最低金额、RPC 方法价格 |

聊天和图像端点使用标准的 OpenAI 传输格式，因此任何 OpenAI 兼容客户端只需修改 `baseURL` 并提供支持支付的 `fetch` 即可工作。请求与响应的完整细节见 [API 参考](/agents/x402/api-reference)。

## Mech：运营 Metaplex x402 的 Agent {% #mech-the-agent-that-operates-metaplex-x402 %}

Mech 是销售 x402 服务的链上 Metaplex Agent，USDC 支付会结算到 Mech 的 Core 钱包。Mech 本身也是一个拥有 [Asset Signer PDA 钱包](/smart-contracts/core/execute-asset-signing)的[已注册 Agent](/agents/what-is-an-agent) — 即一个 Agent 向您的 Agent 销售服务，这正是[Agent 商业](/agents/agent-commerce)模式端到端运转的样子。

| 属性 | 值 |
|------|-----|
| Agent 地址 | `MECHjj31U1hBapoVeJtZo5U5WGRd2293JEwRErvPTuF` |
| 公开页面 | [metaplex.com/agents/MECHjj…](https://www.metaplex.com/agents/MECHjj31U1hBapoVeJtZo5U5WGRd2293JEwRErvPTuF) |
| 结算资产 | USDC |

## 快速开始 {% #quick-start %}

安装客户端，并用支持支付的 `fetch` 将 OpenAI SDK 指向 Metaplex x402。本示例使用标准钱包支付；三种模式的完整说明见[支付模式指南](/agents/x402/payment-modes)。

```sh {% title="安装客户端及其对等依赖" %}
pnpm add @metaplex-foundation/x402 \
  @metaplex-foundation/umi \
  @solana/kit \
  @x402/core \
  @x402/fetch \
  @x402/svm \
  openai
```

```ts {% title="使用标准钱包完成付费聊天补全" %}
import { METAPLEX_X402_BASE_URL } from '@metaplex-foundation/x402';
import { createKeyPairSignerFromBytes, getBase58Encoder } from '@solana/kit';
import { x402Client } from '@x402/core/client';
import { wrapFetchWithPayment } from '@x402/fetch';
import { ExactSvmScheme } from '@x402/svm/exact/client';
import OpenAI from 'openai';

// A Solana signer whose token account holds USDC.
const svmSigner = await createKeyPairSignerFromBytes(
  getBase58Encoder().encode(process.env.SVM_PRIVATE_KEY!),
);

const paymentClient = new x402Client();
paymentClient.register('solana:*', new ExactSvmScheme(svmSigner));

const openai = new OpenAI({
  // The OpenAI SDK requires a value, but this gateway authenticates by payment.
  apiKey: 'x402',
  baseURL: METAPLEX_X402_BASE_URL,
  fetch: wrapFetchWithPayment(fetch, paymentClient),
});

const completion = await openai.chat.completions.create({
  model: 'openai/gpt-5.4-mini',
  messages: [{ role: 'user', content: 'Say hi in one word.' }],
});
```

支付在被包装的 `fetch` 内部完成；您的代码只会看到最终的 API 响应。

## 支付模式一览 {% #payment-modes-at-a-glance %}

Metaplex x402 支持三种支付方式，区别在于 USDC 的来源以及所有者签名的频率。

| 模式 | 资金来源 | 所有者签名 | 适用场景 |
|------|---------|-----------|---------|
| **标准钱包** | 您钱包的 USDC 代币账户 | 每次支付 | 应用和脚本以自身身份付费 |
| **Core 资产或 Agent（直接）** | 资产签名者 PDA 的代币账户 | 每次支付 | 在所有者监督下让资产拥有独立预算 |
| **委托 Agent（即时）** | Agent 签名者 PDA 的代币账户 | 仅在委托时一次 | 无人监督即可付费的自主 Agent |

委托是一项可随时撤销的链上授权。各模式的设置、代码和撤销流程见[支付模式指南](/agents/x402/payment-modes)。

## Metaplex x402 如何为请求定价 {% #how-metaplex-x402-prices-requests %}

Metaplex x402 按上游提供商的 token 费率为推理定价，按请求为 RPC 定价，并在 `GET /x402/pricing` 免费公开最新价目表。

- **聊天补全** — 按每百万 token 计价，输入、缓存输入和输出各有独立费率，并适用每次请求 `$0.001` 的最低金额
- **图像生成** — 按输入文本、输入图像、输出图像和输出文本四类，每百万 token 计价，同样适用 `$0.001` 的最低金额
- **Solana RPC** — 默认每次请求 `$0.00001`，`getSignaturesForAddress` 等较重的方法费率更高，为 `$0.0001`

{% callout type="note" title="以线上端点为准的价目表" %}
文档中列出的费率只是快照。线上服务的 `GET /x402/pricing` 才是实际生效的价目表，调用它无需支付也无需签名者，SDK 中通过 `getPricing()` 提供。
{% /callout %}

## 注意事项 {% #notes %}

- 支付以 USDC 从经典 SPL Token 的关联代币账户结算。目前不支持 Token-2022 支付铸币。
- Core 资产和 Agent 支付模式需要在资产签名者 PDA 中保留少量 SOL，用于支付 Core `execute` 的交易费用。标准钱包支付无需 SOL — 网络费用由服务方的费用支付者承担。
- x402 的 RPC 端点仅支持 HTTP 请求。不支持 WebSocket 连接和订阅。
- 托管服务端不是开源的。客户端、示例和协议类型以 Apache-2.0 发布。
- 使用本服务即表示同意 [Metaplex.com 使用条款](https://www.metaplex.com/terms-of-use)和[隐私政策](https://www.metaplex.com/privacy)。

## 快速参考 {% #quick-reference %}

| 项目 | 值 |
|------|-----|
| API 基础 URL | `https://api.metaplex.com/x402` |
| RPC URL | `https://api.metaplex.com/x402/rpc` |
| JS 客户端 | `@metaplex-foundation/x402`（`0.1.0`） |
| 运行时 | Node.js 20.18+、ESM |
| 结算资产 | USDC（经典 SPL Token） |
| 运营 Agent | `MECHjj31U1hBapoVeJtZo5U5WGRd2293JEwRErvPTuF` |
| 源代码 | [GitHub](https://github.com/metaplex-foundation/x402)（Apache-2.0） |

## FAQ {% #faq %}

关于 Metaplex x402 的常见问题。

### 什么是 Metaplex x402？ {% #what-is-metaplex-x402 %}
Metaplex x402 是一个按请求付费的 HTTP API，销售 LLM 推理、图像生成和 Solana RPC 访问。无需 API 密钥、账户或订阅 — 每个请求都通过 [x402 协议](https://www.x402.org)在 Solana 上以 USDC 结算。x402 将 HTTP 的 `402 Payment Required` 状态转变为机器可支付的流程。

### 使用 Metaplex x402 需要 API 密钥或账户吗？ {% #do-i-need-an-api-key-or-an-account-to-use-metaplex-x402 %}
不需要。支付即认证。您只需要一个持有 USDC 的 Solana 钱包、Core 资产或已注册的 Agent。OpenAI SDK 要求 `apiKey` 为非空值，因此示例传入字符串 `'x402'`，网关会忽略该值。

### 什么是 Mech？ {% #what-is-mech %}
Mech 是运营 x402 服务的链上 Metaplex Agent。支付以 USDC 结算到 Mech 的 Core 钱包 — 即其 Asset Signer PDA。Mech 是一个向您的 Agent 或钱包销售服务的 Agent，地址为 `MECHjj31U1hBapoVeJtZo5U5WGRd2293JEwRErvPTuF`。

### Nori 服务 Agent 的文档怎么了？ {% #what-happened-to-the-nori-service-agent-documentation %}
Nori 页面描述的是一个从未公开发布、目前也不再维护的早期原型。取代它并实际上线的服务是 Metaplex x402。**Nori** 这个名称现在指的是 [Metaplex AI 副驾驶](https://www.metaplex.com/nori)，那是一个与付费推理和 RPC 无关的独立产品。

### Metaplex x402 是以 SOL 还是 USDC 计费？ {% #does-metaplex-x402-charge-in-sol-or-usdc %}
USDC。支付来自经典 SPL Token 的关联代币账户，不支持 Token-2022 支付铸币。Core 资产和 Agent 支付模式还需要在资产签名者 PDA 中保留少量 SOL，用于支付 Core `execute` 的交易费用。

### Metaplex x402 的服务端是开源的吗？ {% #is-the-metaplex-x402-server-open-source %}
客户端是开源的。TypeScript 客户端、示例和协议类型以 Apache-2.0 发布在 [github.com/metaplex-foundation/x402](https://github.com/metaplex-foundation/x402)。运行托管服务的服务端目前未公开。

### 一次请求的费用是多少？ {% #how-much-does-a-request-cost %}
推理定价与上游提供商的 token 费率一致，并适用每次请求 `$0.001` 的最低金额。RPC 调用按请求计费，起价 `$0.00001`，较重的方法费率更高。`GET /x402/pricing` 返回最新费率，可免费调用。

## 术语表 {% #glossary %}

Metaplex x402 文档中使用的术语。

| 术语 | 定义 |
|------|------|
| **x402** | 一个开放协议，利用 HTTP 的 `402 Payment Required` 状态，让稳定币小额支付成为 API 请求/响应循环的一部分 |
| **Metaplex x402** | 位于 `https://api.metaplex.com/x402` 的 Metaplex 托管 x402 服务，销售推理、图像生成和 Solana RPC |
| **Mech** | 运营 Metaplex x402 并接收 USDC 支付的链上 Metaplex Agent |
| **Asset Signer PDA** | 由 `["mpl-core-execute", asset]` 派生的 MPL Core PDA — Core 资产的链上钱包，通过 Core 的 [Execute 生命周期钩子](/smart-contracts/core/execute-asset-signing)控制 |
| **支付模式** | 由哪个账户出资以及其所有者签名的频率 — 标准钱包、Core 资产或 Agent 直接支付、委托 Agent |
| **执行委托** | 一项可撤销的链上授权（`ExecutionDelegateRecordV1`），让 Mech 无需逐次获得所有者签名即可从已注册 Agent 的钱包中批准支付 |
| **Facilitator** | x402 中的组件，在返回资源前验证并在链上结算已提交的支付 |
| **DAS** | [Digital Asset Standard](/solana/rpcs-and-das) 读取 API，可通过 x402 的 RPC 端点透传使用 |

---

由 Metaplex Foundation 维护。最后验证日期：2026-09-08。客户端版本：`@metaplex-foundation/x402` `0.1.0`。[在 GitHub 上查看源码](https://github.com/metaplex-foundation/x402)。
