---
title: 通过 Metaplex API 发行联合曲线
metaTitle: 通过 Metaplex API 发行联合曲线代币 | Genesis
description: 如何使用 Genesis SDK 和 Metaplex API 创建、签署、发送并注册联合曲线代币发行——包括创作者费、首次购买、Agent 发行及错误处理。
keywords:
  - bonding curve
  - bonding curve v2
  - genesis
  - token launch
  - createAndRegisterLaunch
  - createLaunch
  - registerLaunch
  - Metaplex API
  - creator fee
  - first buy
  - agent launch
  - Solana
  - Raydium CPMM
about:
  - Bonding Curve
  - Token Launch
  - Genesis
  - Solana
programmingLanguage:
  - JavaScript
  - TypeScript
  - Bash
cli: /dev-tools/cli/genesis/launch
proficiencyLevel: Intermediate
created: '04-07-2026'
updated: '04-09-2026'
howToSteps:
  - Install the Genesis SDK and configure a Umi instance
  - Call createLaunch with token metadata and launch options
  - Sign and submit the returned transactions with signAndSendLaunchTransactions
  - Register the confirmed launch with registerLaunch so it appears on metaplex.com
howToTools:
  - Node.js
  - Umi framework
  - Genesis SDK
  - Metaplex API
faqs:
  - q: createAndRegisterLaunch 和分别调用 createLaunch 再 registerLaunch 有什么区别？
    a: createAndRegisterLaunch 是一个便捷封装，依次调用 createLaunch、签名发送交易并调用 registerLaunch。当默认的 Umi 签名者和发送者足够时使用它。当需要自定义签名逻辑、Jito bundles、优先费或在创建与注册步骤之间进行重试处理时，分别使用 createLaunch + registerLaunch。
  - q: 上线前可以在 devnet 上测试联合曲线发行吗？
    a: 可以。在发行输入中传入 network "solana-devnet" 并将 Umi 实例指向 devnet RPC 端点。API 将请求路由到 devnet 基础设施。发送交易前请确保钱包中有 devnet SOL。
  - q: 如果对 Agent 设置了 setToken 为 true 后又想更改代币怎么办？
    a: 将 setToken 设为 true 会永久将已发行代币与 Agent 关联为其主要代币。此操作不可撤销，无法取消或重新分配。只有在确定这是该 Agent 正确代币时才将 setToken 设为 true。
  - q: 可以同时配置创作者费钱包和首次购买吗？
    a: 可以。在 launch 对象中同时设置 creatorFeeWallet 和 firstBuyAmount。首次购买本身免费——不收取协议费或创作者费。之后曲线上的所有兑换都将向配置的钱包收取创作者费。
  - q: 代币元数据需要什么图片格式和托管方式？
    a: image 字段必须是格式为 https://gateway.irys.xyz/<id> 的 Irys URL。先将图片上传到 Irys 并使用返回的网关 URL。其他托管方或非 Irys URL 将无法通过 API 验证。
  - q: 为什么必须在交易链上确认后才能调用 registerLaunch？
    a: registerLaunch 将发行写入 Metaplex 数据库，使其出现在 metaplex.com 上。它需要 genesis 账户在链上存在——如果在创建交易确认前调用，将因账户尚不可验证而返回 API 错误。
---

使用 Genesis SDK 和 Metaplex API 在 Solana 上创建、签署、发送并注册[联合曲线](/smart-contracts/genesis/bonding-curve)代币发行。{% .lead %}

{% callout title="本指南涵盖内容" %}
本指南涵盖：
- 通过 `createAndRegisterLaunch` 单次调用发行联合曲线代币
- 添加创作者费——指定到特定钱包或自动路由到 Agent PDA
- 配置发行时的免费首次购买
- 用 `createLaunch` + `registerLaunch` 手动签名并注册发行
- 在 devnet 上测试以及使用自定义 API 基础 URL 或交易发送器
- 处理带类型的 SDK 错误
{% /callout %}

## 摘要

`createAndRegisterLaunch`（或其底层等价函数）调用 `POST /v1/launches/create`，返回未签名的 Solana 交易，签名并发送后注册发行，使代币出现在 [metaplex.com](https://www.metaplex.com) 上。

- **一键路径** — `createAndRegisterLaunch` 在单次等待调用中处理完整流程
- **手动路径** — `createLaunch` + `signAndSendLaunchTransactions` + `registerLaunch`，用于自定义签名、bundles 或重试逻辑
- **创作者费** — 联合曲线和毕业后 Raydium 池上每次兑换的可选费用；可按钱包配置或为 [Agent 发行](/agents/create-agent-token)自动推导
- **首次购买** — 曲线创建时为发行钱包或 Agent PDA 保留的可选免费初始购买

## 快速开始

**跳转至：** [安装](#installation) · [配置](#umi-setup) · [一键发行](#launching-a-bonding-curve-one-liner-flow) · [创作者费](/smart-contracts/genesis/creator-fees) · [首次购买](#first-buy) · [手动签名](#manual-signing-flow) · [代币元数据](#token-metadata) · [Devnet](#devnet-testing) · [高级](#advanced) · [错误](#common-errors) · [API 参考](#api-reference)

1. 安装 Genesis SDK 并使用密钥对身份配置 Umi 实例
2. 以 `token` 元数据和 `launch: {}` 对象调用 `createAndRegisterLaunch`
3. 从响应中读取 `result.mintAddress` 和 `result.launch.link`

如需自定义签名或重试逻辑，请改用[手动签名流程](#manual-signing-flow)。

## 前置条件

- **Node.js 18+** — 原生 `BigInt` 支持所必需
- 已充值 SOL 的 Solana 钱包密钥对，用于支付交易费用和可选的首次购买金额
- Solana RPC 端点（mainnet-beta 或 devnet）
- 预先上传到 [Irys](https://irys.xyz) 的图片——代币元数据 `image` 字段必须是 Irys 网关 URL

## 安装

安装三个必需的依赖包。

```bash {% title="Terminal" %}
npm install @metaplex-foundation/genesis \
  @metaplex-foundation/umi \
  @metaplex-foundation/umi-bundle-defaults
```

## Umi 配置

调用任何 Genesis API 函数前，使用密钥对身份配置 Umi 实例。

```typescript {% title="setup.ts" showLineNumbers=true %}
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { keypairIdentity } from '@metaplex-foundation/umi';

const umi = createUmi('https://api.mainnet-beta.solana.com');

// Load your keypair — use your preferred key management solution in production.
const keypair = umi.eddsa.createKeypairFromSecretKey(mySecretKeyBytes);
umi.use(keypairIdentity(keypair));
```

{% callout type="note" %}
Genesis API 函数不需要 `genesis()` 插件——它们通过 HTTP 与托管的 Metaplex API 通信，而非直接提交指令。Umi 实例仅用于其签名者身份和交易发送能力。
{% /callout %}

## 发行联合曲线（一键流程）

`createAndRegisterLaunch` 是最简单的路径——在单次等待调用中创建发行、签名发送所有交易并在 metaplex.com 上注册代币。

{% code-tabs-imported from="genesis/api_bonding_curve_launch" frameworks="umi,cli" defaultFramework="umi" /%}

当 `launch: {}` 为空时，所有协议参数——供应分配、虚拟储备、资金流向和锁定计划——均设为协议默认值。以下各节展示如何添加创作者费和首次购买。

## 创作者费

每次兑换的可选费用累积到配置的钱包。在 `launch` 对象中设置 `creatorFeeWallet` 可将费用重定向到特定地址；默认使用发行钱包。

```typescript {% title="launch-with-creator-fee.ts" %}
launch: {
  creatorFeeWallet: 'FeeRecipientWalletAddress...',
},
```

完整配置选项、如何检查累积余额以及认领指令（`claimBondingCurveCreatorFeeV2` / `claimRaydiumCreatorFeeV2`），请参阅[创作者费](/smart-contracts/genesis/creator-fees)。

## 首次购买

首次购买为发行钱包保留曲线上的初始兑换，指定 SOL 金额，所有手续费豁免。

将 `firstBuyAmount` 设置为免费初始购买的 SOL 金额。

{% code-tabs-imported from="genesis/api_bonding_curve_first_buy" frameworks="umi,cli" defaultFramework="umi" /%}

API 在发行交易流程中执行首次购买——交易确认后曲线已应用初始购买。买家默认为发行 `wallet`，或提供 `agent` 时为 Agent PDA。用 `firstBuyWallet`（一个 `Signer`）覆盖以指定不同买家。

省略 `firstBuyAmount` 或设为 `0` 时，不应用首次购买限制，任何钱包均可进行第一次兑换。

可以将首次购买与创作者费钱包组合：

```typescript {% title="launch-combined.ts" %}
launch: {
  creatorFeeWallet: 'FeeRecipientWalletAddress...',
  firstBuyAmount: 0.5,
},
```

## 手动签名流程

当需要控制交易签名和提交方式时，分别使用 `createLaunch` 和 `registerLaunch`——例如使用 Jito bundles、优先费或自定义重试逻辑时。

```typescript {% title="manual-launch.ts" showLineNumbers=true %}
import {
  createLaunch,
  registerLaunch,
  signAndSendLaunchTransactions,
} from '@metaplex-foundation/genesis/api';

// Step 1: Call the API to get unsigned transactions.
const createResult = await createLaunch(umi, {}, {
  wallet: umi.identity.publicKey,
  launchType: 'bondingCurve',
  token: {
    name: 'My Token',
    symbol: 'MTK',
    image: 'https://gateway.irys.xyz/your-image-id',
  },
  launch: {
    creatorFeeWallet: 'FeeRecipientWalletAddress...',
  },
});

console.log('Mint address:', createResult.mintAddress);
console.log('Transactions to sign:', createResult.transactions.length);

// Step 2: Sign and send the transactions.
const signatures = await signAndSendLaunchTransactions(umi, createResult);

// Step 3: Register the launch after all transactions are confirmed onchain.
const registered = await registerLaunch(umi, {}, {
  genesisAccount: createResult.genesisAccount,
  createLaunchInput: {
    wallet: umi.identity.publicKey,
    launchType: 'bondingCurve',
    token: {
      name: 'My Token',
      symbol: 'MTK',
      image: 'https://gateway.irys.xyz/your-image-id',
    },
    launch: {
      creatorFeeWallet: 'FeeRecipientWalletAddress...',
    },
  },
});

console.log('Launch live at:', registered.launch.link);
```

{% callout type="note" %}
仅在创建交易链上确认后调用 `registerLaunch`。API 在注册前验证 genesis 账户存在——过早调用将返回 API 错误。
{% /callout %}

## 代币元数据

每次发行都需要包含以下字段的 `token` 对象。

| 字段 | 是否必填 | 约束 |
|-------|----------|-------------|
| `name` | 是 | 1–32 个字符 |
| `symbol` | 是 | 1–10 个字符 |
| `image` | 是 | 必须是 Irys URL（`https://gateway.irys.xyz/...`） |
| `description` | 否 | 最多 250 个字符 |
| `externalLinks` | 否 | 可选的 `website`、`twitter` 和 `telegram` 值 |

```typescript {% title="token-metadata.ts" %}
token: {
  name: 'My Token',
  symbol: 'MTK',
  image: 'https://gateway.irys.xyz/your-image-id',
  description: 'A token launched on the bonding curve',
  externalLinks: {
    website: 'https://mytoken.com',
    twitter: '@mytoken',
    telegram: '@mytoken',
  },
},
```

## Devnet 测试

传入 `network: 'solana-devnet'` 并将 Umi 实例指向 devnet RPC 端点，将发行路由通过 devnet 基础设施。使用 CLI 时，网络由配置的 RPC 端点决定。

{% code-tabs-imported from="genesis/api_bonding_curve_devnet" frameworks="umi,cli" defaultFramework="umi" /%}

## 高级

### 自定义 API 基础 URL

SDK 默认使用 `https://api.metaplex.com`。在配置对象（第二个参数）中传入 `baseUrl` 以指向不同环境，如暂存 API。

```typescript {% title="custom-base-url.ts" showLineNumbers=true %}
const API_CONFIG = { baseUrl: 'https://your-api-base-url.example.com' };

const result = await createAndRegisterLaunch(umi, API_CONFIG, {
  wallet: umi.identity.publicKey,
  launchType: 'bondingCurve',
  token: {
    name: 'My Token',
    symbol: 'MTK',
    image: 'https://gateway.irys.xyz/your-image-id',
  },
  launch: {},
});
```

手动签名流程中的 `createLaunch` 和 `registerLaunch` 也接受同一 `API_CONFIG` 对象。

### 自定义交易发送器

在选项（第四个参数）中传入 `txSender` 回调以使用自己的签名和提交基础设施。

```typescript {% title="custom-sender.ts" showLineNumbers=true %}
const result = await createAndRegisterLaunch(
  umi,
  {},
  {
    wallet: umi.identity.publicKey,
    launchType: 'bondingCurve',
    token: {
      name: 'My Token',
      symbol: 'MTK',
      image: 'https://gateway.irys.xyz/your-image-id',
    },
    launch: {},
  },
  {
    txSender: async (txs) => {
      const signatures = [];
      for (const tx of txs) {
        const signed = await umi.identity.signTransaction(tx);
        signatures.push(await myCustomSend(signed));
      }
      return signatures;
    },
  }
);
```

## 常见错误

| 错误 | 类型检查 | 原因 | 解决方法 |
|-------|-----------|-------|-----|
| `Validation error on "token.image"` | `isGenesisValidationError` | 图片 URL 不是 Irys 网关 URL | 将图片上传到 Irys 并使用 `https://gateway.irys.xyz/...` URL |
| `Validation error on "token.name"` | `isGenesisValidationError` | 名称超过 32 个字符或为空 | 将代币名称缩短到 1–32 个字符 |
| `Network error` | `isGenesisApiNetworkError` | 无法访问 `https://api.metaplex.com` | 检查连接性或提供指向可访问端点的 `baseUrl` |
| `API error (4xx)` | `isGenesisApiError` | API 拒绝了无效输入 | 读取 `err.responseBody` 查看字段级错误详情 |
| `API error (5xx)` | `isGenesisApiError` | Metaplex API 不可用 | 使用指数退避重试；不要重新发送已确认的交易 |
| `registerLaunch` API 错误 | `isGenesisApiError` | 在创建交易确认前调用注册 | 在调用 `registerLaunch` 前等待所有签名在链上确认 |

使用带类型的错误守卫区分这些情况：

```typescript {% title="error-handling.ts" showLineNumbers=true %}
import {
  createLaunch,
  isGenesisApiError,
  isGenesisApiNetworkError,
  isGenesisValidationError,
} from '@metaplex-foundation/genesis/api';

try {
  const result = await createLaunch(umi, {}, input);
} catch (err) {
  if (isGenesisValidationError(err)) {
    console.error(`Validation error on "${err.field}": ${err.message}`);
  } else if (isGenesisApiNetworkError(err)) {
    console.error('Network error:', err.message);
  } else if (isGenesisApiError(err)) {
    console.error(`API error (${err.statusCode}): ${err.message}`);
    console.error('Details:', err.responseBody);
  } else {
    throw err;
  }
}
```

## 注意事项

- `createAndRegisterLaunch` 从调用方角度是原子的，但内部进行两次 API 调用——创建交易确认后但 `registerLaunch` 之前失败意味着代币在链上存在但在 metaplex.com 上尚不可见；手动调用 `registerLaunch` 完成注册
- Metaplex API 端点（`https://api.metaplex.com`）是托管基础设施——它构建并返回未签名的交易；调用方始终持有并控制签名
- 当 `launch: {}` 为空时，虚拟储备、供应分配和锁定计划由协议默认值设定；不支持按发行覆盖这些参数
- `agent.setToken` 标志不可撤销——一旦代币被设为 Agent 的主要代币，就无法更改或重新分配；详见[创建 Agent 代币](/agents/create-agent-token)了解完整 Agent 发行流程
- 曲线上线后，使用[联合曲线兑换集成](/smart-contracts/genesis/bonding-curve-swaps)指南集成兑换功能
- 首次购买在发行创建时配置，曲线上线后无法添加；`firstBuyAmount: 0` 或省略该字段将完全禁用它
- 创作者费累积在 bucket 中，而非按次转账；通过无需许可的 `claimBondingCurveCreatorFeeV2`（联合曲线）和 `claimRaydiumCreatorFeeV2`（毕业后 Raydium）指令认领

## API 参考

### `createAndRegisterLaunch(umi, config, input, options?)`

编排完整发行流程的便捷函数：创建、签名、发送并注册。

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `umi` | `Umi` | 配置了身份和 RPC 的 Umi 实例 |
| `config` | `GenesisApiConfig \| null` | 可选 API 配置（`baseUrl`、自定义 `fetch`） |
| `input` | `CreateBondingCurveLaunchInput` | 发行配置 |
| `options` | `SignAndSendOptions` | 可选的 `txSender` 覆盖 |
| `registerOptions` | `RegisterOptions` | 转发给 `registerLaunch` 的可选字段（如 `creatorWallet`、`twitterVerificationToken`） |

返回 `Promise<CreateAndRegisterLaunchResult>`：

| 字段 | 描述 |
|-------|-------------|
| `signatures` | 交易签名 |
| `mintAddress` | 创建的代币 mint 地址 |
| `genesisAccount` | Genesis 账户 PDA |
| `launch.link` | 在 metaplex.com 上查看代币的 URL |

### `createLaunch(umi, config, input)`

调用 `POST /v1/launches/create` 并返回反序列化的交易。

返回 `Promise<CreateLaunchResponse>`：

| 字段 | 描述 |
|-------|-------------|
| `transactions` | 待签名和发送的 Umi `Transaction` 对象数组 |
| `blockhash` | 交易有效性的区块哈希 |
| `mintAddress` | 创建的代币 mint 地址 |
| `genesisAccount` | Genesis 账户 PDA |

### `registerLaunch(umi, config, input)`

在 metaplex.com 上注册已确认的 genesis 账户。在所有创建交易链上确认后调用。

返回 `Promise<RegisterLaunchResponse>`：

| 字段 | 描述 |
|-------|-------------|
| `launch.id` | 发行标识符 |
| `launch.link` | 查看代币的 URL |
| `token.mintAddress` | 已确认的 mint 地址 |

### 类型

```typescript {% title="types.ts" %}
interface CreateBondingCurveLaunchInput {
  wallet: PublicKey | string;
  launchType: 'bondingCurve';
  token: TokenMetadata;
  network?: 'solana-mainnet' | 'solana-devnet';
  quoteMint?: 'SOL';
  agent?: {
    mint: PublicKey | string;   // Core asset (NFT) address
    setToken: boolean;          // set launched token as the agent's primary token
  };
  launch: BondingCurveLaunchInput;
}

interface BondingCurveLaunchInput {
  creatorFeeWallet?: PublicKey | string;
  firstBuyAmount?: number;   // SOL amount (e.g. 0.1 = 0.1 SOL)
  firstBuyWallet?: Signer;
}

interface TokenMetadata {
  name: string;           // max 32 characters
  symbol: string;         // max 10 characters
  image: string;          // must be an Irys URL: https://gateway.irys.xyz/...
  description?: string;   // max 250 characters
  externalLinks?: {
    website?: string;
    twitter?: string;
    telegram?: string;
  };
}

interface GenesisApiConfig {
  baseUrl?: string;
  fetch?: typeof fetch;
}
```

## FAQ

### `createAndRegisterLaunch` 和分别调用 `createLaunch` 再 `registerLaunch` 有什么区别？

`createAndRegisterLaunch` 是在单次调用中处理完整流程的便捷封装。当需要自定义签名逻辑（如 Jito bundles、优先费）或在提交前检查或修改未签名交易时，分别使用底层函数。详见[手动签名流程](#manual-signing-flow)。

### 上线前可以在 devnet 上测试联合曲线发行吗？

可以。在输入中传入 `network: 'solana-devnet'` 并将 Umi 实例指向 `https://api.devnet.solana.com`。API 将请求路由到 devnet 基础设施。发送交易前确保钱包有 devnet SOL。详见 [Devnet 测试](#devnet-testing)。

### 如果我错误地将 `agent.setToken: true` 会怎样？

将 `setToken: true` 会永久将已发行代币与 Agent 关联为其主要代币——此操作不可撤销且无法取消或重新分配。如果不确定，省略 `agent` 字段或将 `setToken` 设为 `false`，然后单独处理代币关联。

### 可以同时配置创作者费钱包和首次购买吗？

可以。在 `launch` 对象中同时设置 `creatorFeeWallet` 和 `firstBuyAmount`。首次购买本身免费——不收取协议费或创作者费。之后所有兑换正常收取创作者费。详见[首次购买](#first-buy)。

### 代币元数据需要什么图片格式和托管方式？

`image` 字段必须是 Irys URL——`https://gateway.irys.xyz/<id>`。先将图片上传到 Irys 并使用返回的网关 URL。其他托管方将无法通过 API 验证。SDK 将此报告为 `token.image` 字段上的 `isGenesisValidationError`。

### 为什么必须在交易链上确认后才能调用 `registerLaunch`？

`registerLaunch` 将发行记录写入 Metaplex 数据库，并在注册前验证 genesis 账户在链上存在。在创建交易确认前调用将返回 API 错误，因为账户尚不可见。在 `createAndRegisterLaunch` 中，这种顺序是自动处理的。
