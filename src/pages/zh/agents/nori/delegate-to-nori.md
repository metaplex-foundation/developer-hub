---
title: 委托给 Nori
metaTitle: 委托给 Nori - 一次性接入 Delegate-Pay 计费 | Metaplex
description: 将 Nori 注册为您 Metaplex Agent 上的执行委托方，使每次 LLM、图像和 RPC 调用都自动从您 Agent 的 PDA 钱包结算。免费接入 — 无需支付手续费的 SOL，也无需 RPC。
keywords:
  - delegate to Nori
  - execution delegation
  - delegate-pay
  - agent onboarding
  - delegateExecutionV1
  - Nori bearer token
  - Metaplex agent billing
about:
  - Nori
  - Execution Delegation
  - Agent Commerce
  - Solana
  - Metaplex
proficiencyLevel: Intermediate
created: '07-08-2026'
updated: '07-08-2026'
programmingLanguage:
  - TypeScript
howToSteps:
  - 获取 Nori 的 Agent 卡片并读取其 serviceExecutiveAddress。
  - 构建一笔仅包含一条指向 Nori 执行者配置文件的 delegateExecutionV1 指令的交易，并以 Nori 作为费用支付方。
  - 使用您 Agent 的执行者密钥对签名，并将交易提交到 Nori 的免费 /v1/delegate/submit 端点。
  - 在 /auth/handshake 用签名后的质询换取 Bearer 令牌。
  - 携带 Bearer 令牌发起付费调用 — 扣费自动从您 Agent 的 PDA 钱包结算。
howToTools:
  - '@metaplex-foundation/mpl-agent-registry'
  - '@metaplex-foundation/umi'
faqs:
  - q: 委托给 Nori 需要花钱吗？
    a: 不需要。Nori 支付委托交易的网络费用（它作为费用支付方共同签署），且接入端点是免费且无需认证的。之后您需要在 Agent 的 PDA 钱包上保留一定的 SOL 工作余额，因为那是按次调用扣费的来源账户。
  - q: 委托授予 Nori 什么权限？
    a: 委托将 Nori 的执行者配置文件注册为您 Agent 资产上的执行委托方，这使 Nori 可以签署将 SOL 从您 Agent 的 PDA 钱包转出的 MPL Core Execute 交易。Nori 用它来结算按次调用的扣费，每笔都附带链上 Memo 收据。PDA 上只保留工作余额，并审计这些收据。
  - q: 如何阻止 Nori 向我的 Agent 扣费？
    a: 撤销您 Agent 资产上的执行委托。下一次扣费尝试会在链上失败，Nori 缓存的委托状态被作废，delegate-pay 轨道硬停止 — 后续调用会收到 HTTP 402 x402 质询，而不是被自动扣费。
  - q: 为什么我已委托，调用却仍返回 HTTP 402？
    a: 402 表示该次调用无法使用 delegate-pay 轨道 — Bearer 令牌缺失或已过期（令牌有效期 15 分钟）、委托已被撤销，或扣费本身失败（通常是 PDA 钱包余额为空）。重新执行握手流程，确认委托记录存在，并检查 PDA 余额。
  - q: 我可以完全不委托就使用 Nori 吗？
    a: 可以。未委托的调用方使用 x402 后备轨道 — 第一次请求返回带支付要求的 HTTP 402，您以 SOL 或 USDC 支付后重试。费用相同，但每次调用都会增加一次支付往返，而 delegate-pay 是内联结算的。
---

委托给 Nori 是一次性的链上设置，它将 Nori 注册为您 Agent 资产上的[执行委托方](/smart-contracts/mpl-agent/tools)。此后，您的 Agent 对 Nori 发起的每次 LLM、图像和 RPC 调用都会自动从 Agent 的 PDA 钱包结算 — 没有支付往返，没有钱包提示，也不需要提供商 API 密钥。接入是免费的：Nori 支付交易费用并提供 blockhash，因此您的 Agent 的密钥对上既不需要 SOL，也不需要自己的 RPC。{% .lead %}

## 概述

授予 Nori 执行委托，会将您的 Agent 从需要两次往返的 [x402 后备轨道](/agents/nori/#nori-支付的运作方式)切换到内联的 delegate-pay（委托支付）轨道。

- **一次性设置** — 一条指向 Nori 执行者配置文件的 `delegateExecutionV1` 指令，由 Nori 免费共同签署并提交
- **按次调用结算** — Nori 通过带 Memo 收据的 MPL Core Execute 交易向您 Agent 的 [Asset Signer PDA](/agents/what-is-an-agent) 扣费，且仅针对[成功的调用](/agents/nori/pricing-and-billing#成功后计费核算)
- **Bearer 令牌认证** — 签名质询/握手流程铸造一个有效期 15 分钟的 Bearer 令牌，将您的调用路由到 delegate-pay 轨道
- **随时可撤销** — 资产所有者可以撤销委托，这会立即[硬停止](#从-nori-撤销委托)自动扣费

{% callout type="warning" title="委托授予计费权限" %}
执行委托方可以签署将资金转出您 Agent 的 PDA 钱包的交易。将 PDA 视为消费账户：保留工作余额，而不是您的金库，并审计每笔扣费附带的 Memo 收据。在让 Nori 成为您 Agent 的唯一服务提供商之前，请参阅[单点故障注意事项](/agents/nori/#nori-作为单点故障)。
{% /callout %}

## 快速开始

1. [获取 Nori 的 Agent 卡片](#步骤-1--发现-nori-的执行者地址)并读取 `serviceExecutiveAddress`
2. [构建委托交易](#步骤-2--构建并提交委托交易)，以您的执行者密钥对作为权限、Nori 作为费用支付方，然后将其提交到 `POST /v1/delegate/submit`
3. [为您 Agent 的 PDA 钱包充值](#为-agent-pda-钱包充值)一定的 SOL 工作余额
4. 通过 `/auth/challenge` + `/auth/handshake` [铸造 Bearer 令牌](#步骤-3--使用-bearer-令牌进行认证)
5. 携带 `Authorization: Bearer <token>` [发起付费调用](#步骤-4--发起付费调用)

## 前提条件

委托需要一个已存在的链上 Agent 身份；委托交易会引用该资产及其身份 PDA。

- 一个[已注册的 Agent](/agents/register-agent) — 带有 `AgentIdentity` 记录的 MPL Core 资产
- 您 Agent 的**执行者密钥对**（您的 Agent 运行时使用的密钥对，通过[运行代理](/agents/run-an-agent)设置）— 它作为权限签署委托
- 已安装 `@metaplex-foundation/mpl-agent-registry` 和 `@metaplex-foundation/umi`
- 委托本身不需要 SOL，也不需要 RPC 端点 — 两者都由 Nori 提供

## 步骤 1 — 发现 Nori 的执行者地址

Nori 的 Agent 卡片公布了您要委托的地址。获取 `/.well-known/agent-card.json` 并读取两个字段：

- `serviceExecutiveAddress` — Nori 的执行者密钥对公钥。您在自己的资产上注册为委托方的，是它的执行者配置文件 PDA。
- `serviceAssetAddress` — Nori 自己的 Agent 资产。您的扣费支付到它的 PDA；您可以据此在链上核验每一笔扣费。

```typescript {% title="fetch-nori-card.ts" %}
const NORI_URL = process.env.NORI_URL; // Nori's base URL

const card = await fetch(`${NORI_URL}/.well-known/agent-card.json`).then((r) =>
  r.json(),
);

const noriExecutive = card.serviceExecutiveAddress; // delegate to this
const noriServiceAsset = card.serviceAssetAddress; // charges are paid here
```

{% callout type="warning" title="将基础 URL 视为受信任的配置" %}
Agent 卡片决定了你将计费权限委托给哪个执行者配置文件。只从由你自己管理配置的 `NORI_URL` 获取 Agent 卡片，并在签署委托前通过带外方式核验 `serviceExecutiveAddress`（例如与 Nori 公开的 Agent 注册信息进行比对）。
{% /callout %}

## 步骤 2 — 构建并提交委托交易

委托交易恰好包含一条 `delegateExecutionV1` 指令：您的执行者密钥对作为权限签名，Nori 的执行者配置文件是委托方，Nori 的密钥对是费用支付方。您离线构建并签名它（Nori 免费的 `GET /v1/solana/blockhash` 端点提供 blockhash），然后将部分签名的交易 POST 到 `POST /v1/delegate/submit`。Nori 验证它，作为费用支付方共同签署，并提交它。

```typescript {% title="delegate-to-nori.ts" %}
import { createNoopSigner, publicKey } from '@metaplex-foundation/umi';
import {
  delegateExecutionV1,
  findAgentIdentityV1Pda,
  findExecutiveProfileV1Pda,
} from '@metaplex-foundation/mpl-agent-registry';

// `umi` is configured with your agent's executive keypair as identity.
const agentAsset = publicKey(process.env.AGENT_ASSET_ADDRESS);

// Nori's executive profile PDA, derived from the agent card address.
const noriProfile = findExecutiveProfileV1Pda(umi, {
  authority: publicKey(noriExecutive),
});
const agentIdentity = findAgentIdentityV1Pda(umi, { asset: agentAsset });

// Free blockhash — no RPC of your own needed.
const { blockhash } = await fetch(`${NORI_URL}/v1/solana/blockhash`).then((r) =>
  r.json(),
);

// Build with Nori as fee payer (a noop signer — Nori co-signs server-side),
// sign with your executive keypair.
const tx = await delegateExecutionV1(umi, {
  agentAsset,
  agentIdentity,
  executiveProfile: noriProfile,
})
  .setFeePayer(createNoopSigner(publicKey(noriExecutive)))
  .setBlockhash(blockhash)
  .buildAndSign(umi);

// Nori validates, co-signs, and submits — free of charge.
const result = await fetch(`${NORI_URL}/v1/delegate/submit`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    transaction: Buffer.from(umi.transactions.serialize(tx)).toString('base64'),
  }),
}).then((r) => r.json());

console.log(result);
// { success: true, signature: '...', agentAsset: '...', authority: '...' }
```

{% callout type="note" title="严格的交易验证" %}
`POST /v1/delegate/submit` 会拒绝任何不是恰好一条 `delegateExecutionV1` 指令（`mpl-agent-tools` 程序上的判别符 1）、不指向 Nori 自己的执行者配置文件、或不以 Nori 作为费用支付方的交易。这种严格的形状要求防止这个免费端点被滥用为交易提交服务。
{% /callout %}

如果您基于 Metaplex Agent 模板构建 Agent，整个步骤已打包为 `delegate-to-nori` 工具 — 一次调用即可，无需手动构建交易。

## 步骤 3 — 使用 Bearer 令牌进行认证

当付费调用携带通过 Sign-In-With-Solana 风格握手铸造的 Bearer 令牌时，它们会被路由到 delegate-pay 轨道。该令牌证明您控制着在 Agent 资产上注册为委托方的执行者密钥对；令牌有效期为 15 分钟，过期后请重新执行握手。

```typescript {% title="nori-handshake.ts" %}
import { base58 } from '@metaplex-foundation/umi/serializers';

// 1. Get a fresh nonce.
const { nonce } = await fetch(`${NORI_URL}/auth/challenge`).then((r) => r.json());

// 2. Sign the handshake envelope with your executive keypair.
const now = Date.now();
const handshake = {
  pubkey: umi.identity.publicKey.toString(),
  agentAsset: agentAsset.toString(),
  audience: NORI_URL,
  nonce,
  issuedAt: new Date(now).toISOString(),
  expiresAt: new Date(now + 60_000).toISOString(),
};
const signature = base58.deserialize(
  await umi.identity.signMessage(
    new TextEncoder().encode(JSON.stringify(handshake)),
  ),
)[0];

// 3. Exchange for a bearer token (valid 15 minutes).
const { token } = await fetch(`${NORI_URL}/auth/handshake`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ handshake, signature }),
}).then((r) => r.json());
```

## 步骤 4 — 发起付费调用

附上 Bearer 令牌后，Nori 会先运行上游调用，再通过一笔 Execute 交易向您 Agent 的 PDA 扣费 — 响应在单次往返中返回，没有 402 质询。同一个请求头适用于所有 `/v1/*` 端点和 `/a2a`。

```typescript {% title="paid-call.ts" %}
const completion = await fetch(`${NORI_URL}/v1/chat/completions`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    model: 'anthropic/claude-sonnet-4-6',
    messages: [{ role: 'user', content: 'Hello from a delegated agent.' }],
  }),
}).then((r) => r.json());
```

某个资产首次发起付费调用时，Nori 会在链上检查自己是否仍是已注册的委托方；该结果缓存 5 分钟，因此后续调用会跳过链上查询。参见[示例 Agent](/agents/nori/example-agents)，其中有消费每项服务的完整 Agent，包括将 OpenAI 兼容 SDK 客户端指向 Nori。

## 为 Agent PDA 钱包充值

扣费从您 Agent 的 Asset Signer PDA 扣取，因此在首次付费调用之前它需要有 SOL 余额。PDA 还必须保持在系统免租金最低余额之上（0 字节账户为 890,880 lamports）— Metaplex Agent 模板在委托时会为其预置 0.002 SOL，以确保低于租金的小额扣费永不失败。从任意钱包向 PDA 转入 SOL 即可；如果余额耗尽，调用会回退为 HTTP 402 质询，直到您充值（参见[硬停止语义](/agents/nori/pricing-and-billing#硬停止语义)）。

## 从 Nori 撤销委托

撤销执行委托是终止开关，并以硬停止的方式生效。当资产所有者撤销 Nori 执行者配置文件对应的 `ExecutionDelegateRecordV1` 时，下一次扣费尝试会在链上失败，Nori 会作废其为您的资产缓存的委托状态，delegate-pay 轨道随即停止 — 此后您的调用会收到 x402 支付质询，而不是被自动扣费。由于委托状态缓存为 5 分钟，撤销后立即发起的调用可能仍会尝试（并失败）一次委托扣费；撤销后没有任何扣费能够落地，因为链会拒绝它。

撤销不会注销您的 Agent，也不会触及其 PDA 余额 — 它只是移除 Nori 对其扣费的权限。您可以稍后通过重复[步骤 2](#步骤-2--构建并提交委托交易)重新委托。

## 常见错误

| 错误 | 原因 | 解决方法 |
|-------|-------|-----|
| `expected { transaction: <base64> }`（400） | `/v1/delegate/submit` 的请求体字段错误 | 发送 `{ "transaction": "<base64-encoded signed tx>" }` |
| 委托提交被拒绝并返回 `errorReason` | 交易形状未通过严格验证 — 存在额外指令、程序错误、执行者配置文件错误或费用支付方错误 | 只构建一条指向 Nori 执行者配置文件、以 Nori 为费用支付方的 `delegateExecutionV1` 指令 |
| 付费调用返回 `401` | Bearer 令牌缺失或已过期（有效期 15 分钟） | 重新执行质询/握手流程 |
| 已委托但付费调用返回 `402` | 委托已被撤销，或扣费失败（通常是 PDA 钱包余额为空） | 确认委托记录存在，且 PDA 余额足以覆盖该次调用 |
| `Neither the asset or any plugins have approved this operation` | 委托被撤销后仍尝试扣费 | 预期的硬停止行为 — 重新委托即可恢复 delegate-pay |
| 扣费时出现 `insufficient funds for rent` | PDA 余额低于免租金最低余额 | 为 PDA 充值（保持在 890,880 lamports 之上并留有工作余额） |

## 注意事项

- 接入端点（`GET /v1/solana/blockhash`、`POST /v1/delegate/submit`）免费且无需认证；其他所有执行实际工作的端点均为付费
- Bearer 令牌按执行者密钥对 + Agent 资产的组合铸造，15 分钟后过期 — 请在您的客户端中内置重新握手逻辑
- 委托状态缓存意味着委托状态的变更（授予或撤销）最多可能需要 5 分钟才会反映到支付轨道上；链上强制执行是即时的
- 委托是按资产进行的：运营多个 Agent 的运营者需为每个资产分别委托
- 适用于 `mpl-agent-tools` 执行委托（`ExecutionDelegateRecordV1`），程序 `TLREGni9ZEyGC3vnPZtqUh95xQ8oPqJSvNjvB7FGK8S`

由 Metaplex Foundation 维护。最后验证日期：2026-07-08。[在 GitHub 上查看源码](https://github.com/metaplex-foundation/agent-plumber)。

## FAQ

关于委托给 Nori 的常见问题。

### 委托给 Nori 需要花钱吗？
不需要。Nori 支付委托交易的网络费用（它作为费用支付方共同签署），且接入端点是免费且无需认证的。之后您需要在 Agent 的 PDA 钱包上保留一定的 SOL 工作余额，因为那是按次调用扣费的来源账户。

### 委托授予 Nori 什么权限？
委托将 Nori 的执行者配置文件注册为您 Agent 资产上的执行委托方，这使 Nori 可以签署将 SOL 从您 Agent 的 PDA 钱包转出的 [MPL Core Execute](/smart-contracts/core/execute-asset-signing) 交易。Nori 用它来结算按次调用的扣费，每笔都附带链上 Memo 收据。PDA 上只保留工作余额，并审计这些收据。

### 如何阻止 Nori 向我的 Agent 扣费？
撤销您 Agent 资产上的执行委托。下一次扣费尝试会在链上失败，Nori 缓存的委托状态被作废，delegate-pay 轨道硬停止 — 后续调用会收到 HTTP 402 x402 质询，而不是被自动扣费。

### 为什么我已委托，调用却仍返回 HTTP 402？
402 表示该次调用无法使用 delegate-pay 轨道 — Bearer 令牌缺失或已过期（令牌有效期 15 分钟）、委托已被撤销，或扣费本身失败（通常是 PDA 钱包余额为空）。重新执行握手流程，确认委托记录存在，并检查 PDA 余额。

### 我可以完全不委托就使用 Nori 吗？
可以。未委托的调用方使用 x402 后备轨道 — 第一次请求返回带支付要求的 HTTP 402，您以 SOL 或 USDC 支付后重试。费用相同，但每次调用都会增加一次支付往返，而 delegate-pay 是内联结算的。
