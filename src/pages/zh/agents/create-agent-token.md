---
title: 创建代理代币
metaTitle: 使用 Metaplex Genesis 创建代理代币 | Metaplex Agents
description: 如何使用 Genesis SDK 代表 Metaplex 代理发行本金曲线代币——包括自动创作者费用路由、首次购买、devnet 测试和错误处理。
keywords:
  - agent token
  - token launch
  - Genesis
  - bonding curve
  - agent wallet
  - Solana agents
  - Metaplex
  - createAndRegisterLaunch
  - creator fee
  - first buy
about:
  - Agent Tokens
  - Genesis
  - Bonding Curve
  - Solana
programmingLanguage:
  - JavaScript
  - TypeScript
proficiencyLevel: Intermediate
created: '04-05-2026'
updated: '04-07-2026'
howToSteps:
  - Register your agent on Solana to get its Core asset address
  - Install the Genesis SDK and configure a Umi instance
  - Call createAndRegisterLaunch with the agent field and your token metadata
  - Read mintAddress and launch.link from the result
howToTools:
  - Node.js
  - Umi framework
  - Genesis SDK
  - Metaplex API
faqs:
  - q: 什么是代理代币？
    a: 代理代币是使用 Metaplex Genesis 协议从代理的链上钱包发行的代币。将 agent 字段传入 createAndRegisterLaunch 时，SDK 会自动将创作者费用路由至代理的 Core asset 签名者 PDA，并将发行交易包装在 Core execute 指令中，以便代理在链上执行。
  - q: 发行代理代币时，创作者费用会流向哪里？
    a: 创作者费用会自动路由至代理的 Core asset 签名者 PDA（由种子 ['mpl-core-execute', <agent_mint>] 派生）。无需手动设置 creatorFeeWallet，传入 agent 字段即可。通过明确设置 launch.creatorFeeWallet 仍可覆盖默认的费用钱包。
  - q: setToken 可以撤销吗？
    a: 不可以。将 setToken 设置为 true 会将已发行的代币永久关联为代理的主要代币。交易确认后，此操作无法撤销或重新分配。只有在确定要将该代币永久关联到代理时，才应将 setToken 设为 true。
  - q: 能否先在 devnet 上测试代理代币发行？
    a: 可以。在发行输入中传入 network 'solana-devnet'，并将 Umi 实例指向 devnet RPC。API 会将请求路由到 devnet 基础设施。在发送交易前，请先向代理钱包充入 devnet SOL。
  - q: 代理发行时能否同时使用首次购买和创作者费用？
    a: 可以。在 launch 对象中与 agent 字段一同设置 firstBuyAmount。首次购买本身免收费用——不收取协议费或创作者费用。当提供 agent 时，首次购买者默认为代理 PDA。
---

使用 [Genesis](/smart-contracts/genesis) 协议和 Metaplex API 从代理的链上钱包发行代币。 {% .lead %}

{% callout title="本指南将完成的内容" %}
完成本指南后，您将能够：
- 代表 Metaplex 代理发行本金曲线代币
- 将创作者费用自动路由至代理的链上钱包
- 可选地为代理预留首次兑换的免费名额
{% /callout %}

## 概述

带 `agent` 字段的 `createAndRegisterLaunch` 会创建新代币，将创作者费用路由至代理的 [Core](/core) asset PDA，并将发行交易包装在 Core execute 指令中，以便代理在链上执行。

- **单次调用** — `createAndRegisterLaunch` 按序处理创建、签名、发送和注册
- **自动费用路由** — 创作者费用直接发往代理 PDA，无需手动设置钱包地址
- **不可撤销的代币关联** — `setToken: true` 将代币永久绑定至代理
- **适用于** `@metaplex-foundation/genesis` 1.x · 最后验证：2026 年 4 月

## 快速开始

**跳转至：** [安装](#installation) · [Umi 配置](#umi-setup) · [发行](#launching-an-agent-token) · [首次购买](#first-buy) · [代币元数据](#token-metadata) · [Devnet](#devnet-testing) · [错误处理](#error-handling)

1. [在 Solana 上注册您的代理](/agents/register-agent)以获取其 Core asset 地址
2. 安装 Genesis SDK 并使用您的密钥对配置 Umi 实例
3. 使用 `agent: { mint: agentAssetAddress, setToken: true }` 调用 `createAndRegisterLaunch`
4. 从响应中读取 `result.mintAddress` 和 `result.launch.link`

## 前提条件

- 已[注册的 Metaplex 代理](/agents/register-agent) — 需要其 Core asset 地址
- **Node.js 18 及以上** — 需要原生 `BigInt` 支持
- 充有 SOL 的 Solana 钱包密钥对，用于支付交易费用及首次购买金额
- Solana RPC 端点（mainnet-beta 或 devnet）
- 已上传至 [Irys](https://irys.xyz) 的代币图片 — `image` 字段必须为 Irys 网关 URL

## 安装 {#installation}

```bash {% title="Terminal" %}
npm install @metaplex-foundation/genesis \
  @metaplex-foundation/umi \
  @metaplex-foundation/umi-bundle-defaults
```

## Umi 配置 {#umi-setup}

在调用任何 Genesis 函数之前，使用密钥对身份配置 Umi 实例。

```typescript {% title="setup.ts" showLineNumbers=true %}
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { keypairIdentity } from '@metaplex-foundation/umi';

const umi = createUmi('https://api.mainnet-beta.solana.com');

// 加载您的密钥对——在生产环境中请使用您首选的密钥管理方案。
const keypair = umi.eddsa.createKeypairFromSecretKey(mySecretKeyBytes);
umi.use(keypairIdentity(keypair));
```

{% callout type="note" %}
Genesis API 函数通过 HTTP 与托管的 Metaplex API 通信，而非直接提交指令。Umi 实例仅用于签名者身份和交易发送能力——不需要 `genesis()` 插件。
{% /callout %}

## 发行代理代币 {#launching-an-agent-token}

将包含代理 [Core](/core) asset 地址的 `agent` 字段传入 `createAndRegisterLaunch`。SDK 会自动：

- 将创作者费用钱包设置为代理的 Core asset 签名者 PDA（由 `['mpl-core-execute', <agent_mint>]` 派生）
- 将发行交易包装在 Core execute 指令中，以便代理在链上执行

```typescript {% title="agent-launch.ts" showLineNumbers=true %}
import { createAndRegisterLaunch } from '@metaplex-foundation/genesis/api';

const result = await createAndRegisterLaunch(umi, {}, {
  wallet: umi.identity.publicKey,
  agent: {
    mint: agentAssetAddress,  // 已注册代理的 Core asset 地址
    setToken: true,           // 将此代币永久关联至代理
  },
  launchType: 'bondingCurve',
  token: {
    name: 'Agent Token',
    symbol: 'AGT',
    image: 'https://gateway.irys.xyz/your-image-id',
  },
  launch: {},
});

console.log('代币已发行！');
console.log('铸造地址：', result.mintAddress);
console.log('查看链接：', result.launch.link);
```

{% callout type="warning" %}
`setToken: true` 会将已发行的代币作为代理的主要代币永久关联。**此操作不可撤销。** 交易确认后，无法撤销或重新分配。只有在确定这是正确代币时才设置 `setToken: true`。
{% /callout %}

当 `launch: {}` 为空时，供应分配、虚拟储备和锁定计划等所有协议参数均设置为协议默认值。

有关本金曲线定价、费用和毕业机制的完整说明，请参阅[本金曲线 V2 — 运作原理](/smart-contracts/genesis/bonding-curve-v2)。

## 首次购买 {#first-buy}

首次购买以指定 SOL 金额为代理 PDA 预留曲线上的初始兑换名额，且免收所有费用。

将 `firstBuyAmount` 设置为免费初始购买的 SOL 金额。提供 `agent` 时，首次购买者默认为代理 PDA。

```typescript {% title="agent-launch-with-first-buy.ts" showLineNumbers=true %}
const result = await createAndRegisterLaunch(umi, {}, {
  wallet: umi.identity.publicKey,
  agent: {
    mint: agentAssetAddress,
    setToken: true,
  },
  launchType: 'bondingCurve',
  token: {
    name: 'Agent Token',
    symbol: 'AGT',
    image: 'https://gateway.irys.xyz/your-image-id',
  },
  launch: {
    firstBuyAmount: 0.1, // 0.1 SOL，免收费用
  },
});
```

首次购买作为发行交易流程的一部分执行——交易确认后，曲线上已应用初始购买。省略 `firstBuyAmount` 或设为 `0` 时，不执行首次购买，任何钱包均可进行第一次兑换。

## 代币元数据 {#token-metadata}

每次发行都需要包含以下字段的 `token` 对象。

| 字段 | 必填 | 约束条件 |
|------|------|----------|
| `name` | 是 | 1–32 个字符 |
| `symbol` | 是 | 1–10 个字符 |
| `image` | 是 | 必须为 Irys URL（`https://gateway.irys.xyz/...`） |
| `description` | 否 | 最多 250 个字符 |
| `externalLinks` | 否 | 可选的 `website`、`twitter` 和 `telegram` URL |

```typescript {% title="token-metadata.ts" %}
token: {
  name: 'Agent Token',
  symbol: 'AGT',
  image: 'https://gateway.irys.xyz/your-image-id',
  description: 'The official token of my agent',
  externalLinks: {
    website: 'https://myagent.com',
    twitter: '@myagent',
  },
},
```

`image` 字段必须指向 Irys 网关 URL。请先将图片上传至 [Irys](https://irys.xyz)，然后使用返回的 `https://gateway.irys.xyz/<id>` URL。其他托管服务将无法通过 API 验证。

## Devnet 测试 {#devnet-testing}

传入 `network: 'solana-devnet'` 并将 Umi 实例指向 devnet RPC 端点，即可将发行请求路由至 devnet 基础设施。

```typescript {% title="devnet-agent-launch.ts" showLineNumbers=true %}
const umi = createUmi('https://api.devnet.solana.com');
umi.use(keypairIdentity(keypair));

const result = await createAndRegisterLaunch(umi, {}, {
  wallet: umi.identity.publicKey,
  agent: {
    mint: agentAssetAddress,
    setToken: false, // 测试时使用 false，避免在 devnet 上误锁定
  },
  launchType: 'bondingCurve',
  network: 'solana-devnet',
  token: {
    name: 'Test Token',
    symbol: 'TEST',
    image: 'https://gateway.irys.xyz/test-image',
  },
  launch: {},
});
```

## 错误处理 {#error-handling}

SDK 为不同故障模式提供了类型化错误。

| 错误类型 | 守卫函数 | 原因 |
|---------|---------|------|
| 验证错误 | `isGenesisValidationError` | 输入无效（如非 Irys 图片 URL、名称过长） |
| 网络错误 | `isGenesisApiNetworkError` | 无法访问 `https://api.metaplex.com` |
| API 错误 (4xx) | `isGenesisApiError` | 请求被 API 拒绝；检查 `err.responseBody` |
| API 错误 (5xx) | `isGenesisApiError` | Metaplex API 不可用；使用退避策略重试 |

```typescript {% title="error-handling.ts" showLineNumbers=true %}
import {
  createAndRegisterLaunch,
  isGenesisApiError,
  isGenesisApiNetworkError,
  isGenesisValidationError,
} from '@metaplex-foundation/genesis/api';

try {
  const result = await createAndRegisterLaunch(umi, {}, input);
} catch (err) {
  if (isGenesisValidationError(err)) {
    console.error(`"${err.field}" 验证错误：${err.message}`);
  } else if (isGenesisApiNetworkError(err)) {
    console.error('网络错误：', err.message);
  } else if (isGenesisApiError(err)) {
    console.error(`API 错误 (${err.statusCode})：${err.message}`);
    console.error('详细信息：', err.responseBody);
  } else {
    throw err;
  }
}
```

## 注意事项

- `createAndRegisterLaunch` 内部进行两次 API 调用——若 create 交易已确认但 `registerLaunch` 失败，代币会存在于链上，但在 metaplex.com 上不可见；此时请使用 `createLaunch` + `registerLaunch` 配合[手动签名流程](/smart-contracts/genesis/bonding-curve-v2-launch#manual-signing-flow)分开处理
- 通过明确设置 `launch.creatorFeeWallet` 可覆盖创作者费用钱包，该设置优先于代理 PDA
- 首次购买在发行创建时配置，曲线上线后无法追加
- 创作者费用累积在桶中，而非按次兑换转账；通过免权限的 `claimBondingCurveCreatorFeeV2`（本金曲线）和 `claimRaydiumCreatorFeeV2`（毕业后 Raydium）指令领取——参见[兑换集成指南](/smart-contracts/genesis/bonding-curve-v2-swaps#claiming-creator-fees)
- Metaplex API 构建并返回未签名的交易；签名密钥始终由调用方持有

## 常见问题

### 什么是代理代币？

代理代币是使用 [Genesis](/smart-contracts/genesis) 协议从代理的链上钱包发行的代币。将 `agent` 字段传入 `createAndRegisterLaunch`，SDK 会自动将创作者费用路由至代理的 [Core](/core) asset 签名者 PDA，并将发行交易包装在 Core execute 指令中，以便代理在链上执行。

### 发行代理代币时，创作者费用会流向哪里？

创作者费用会自动路由至代理的 Core asset 签名者 PDA（由种子 `['mpl-core-execute', <agent_mint>]` 派生）。无需手动设置 `creatorFeeWallet`，传入 `agent` 字段即可。通过明确设置 `launch.creatorFeeWallet` 仍可覆盖默认费用钱包。

### `setToken` 可以撤销吗？

不可以。将 `setToken: true` 设置后，已发行的代币会作为代理的主要代币永久关联。交易确认后，无法撤销或重新分配。若不确定，请将 `setToken: false` 并单独处理代币关联。

### 能否先在 devnet 上测试代理代币发行？

可以。在发行输入中传入 `network: 'solana-devnet'`，并将 Umi 实例指向 `https://api.devnet.solana.com`。在发送交易前，请先向代理钱包充入 devnet SOL。

### 代理发行时能否同时使用首次购买和创作者费用？

可以。在 `launch` 对象中与 `agent` 字段一同设置 `firstBuyAmount`。首次购买本身免收费用——不收取协议费或创作者费用。创作者费用正常适用于曲线上此后的所有兑换。
