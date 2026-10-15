---
title: Metaplex x402 支付模式
metaTitle: Metaplex x402 支付模式 - 钱包、Core 资产与委托 Agent | Metaplex
description: 配置 Metaplex x402 的三种支付模式 - 标准 Solana 钱包、Core 资产或 Agent 直接支付，以及无需逐次签名即可支付的委托 Agent。含委托授权、撤销与常见错误。
keywords:
  - x402 payment modes
  - delegated agent payments
  - Core asset payments
  - execution delegation
  - x402 client setup
  - agent wallet USDC
about:
  - Metaplex x402
  - Agent Commerce
  - Solana
  - Metaplex
proficiencyLevel: Intermediate
programmingLanguage:
  - TypeScript
created: '09-08-2026'
updated: '09-08-2026'
howToTools:
  - "@metaplex-foundation/x402"
  - Node.js 20.18+
  - 持有 USDC 的 Solana 钱包、Core 资产或已注册的 Agent
howToSteps:
  - 安装 x402 客户端以及所选 Solana 工具包的对等依赖包。
  - 为支付账户充入 USDC；Core 资产和 Agent 模式还需在签名者 PDA 中准备 SOL。
  - 注册所选模式对应的支付方案，构建支持支付的 fetch。
  - 对于委托 Agent，使用 approveMetaplexCoreExecuteDelegate 一次性批准链上执行委托。
  - 将支持支付的 fetch 传给任意 HTTP 客户端，即可发起付费请求。
faqs:
  - q: 我应该使用 Metaplex x402 的哪种支付模式？
    a: 当应用以自身身份付费时使用标准钱包；当您希望资产在所有者监督下拥有独立预算时使用 Core 资产或 Agent 直接支付；当自主 Agent 必须在无人逐次签名的情况下付费时使用委托 Agent。
  - q: 支付 Metaplex x402 请求需要 SOL 吗？
    a: 只有 Core 资产和 Agent 支付模式需要，此时资产签名者 PDA 需要 SOL 来支付 Core execute 的交易费用。标准钱包支付无需 SOL，因为支付交易的网络费用由服务方的费用支付者承担。
  - q: 委托 Agent 的认证令牌有效期多长？
    a: 授权 JWT 在 24 小时后过期。过期令牌会被丢弃并自动替换，替换只需一次消息签名，无需再次进行链上委托授权。
  - q: 可以同时使用响应式扩展和主动式 fetch 包装器吗？
    a: 不可以。两者是二选一的方案，组合使用会破坏流程。如果您已经在运行 x402Client，或希望可选地回退到直接支付，请使用响应式客户端扩展；如果只针对 Metaplex 端点、希望接线最简单，请使用主动式 fetch 包装器。
  - q: 如何停止委托 Agent 继续付费？
    a: 使用与授权时相同的签名者、资产和 RPC 选项调用 revokeMetaplexCoreExecuteDelegate。委托是一项链上授权，因此撤销会在链上生效，服务端将无法再从该 Agent 的钱包构建支付。
  - q: 可以用 Token-2022 的 USDC 或其他稳定币支付吗？
    a: 不可以。支付来源始终是经典 SPL Token 的关联代币账户，目前不支持 Token-2022 支付铸币。
---

Metaplex x402 支持三种支付模式 — 标准 Solana 钱包、[Core 资产](/zh/smart-contracts/core)或 [Agent](/zh/agents/what-is-an-agent) 直接支付，以及无需逐次签名即可支付的委托 Agent。每种模式产出的东西都相同：一个支持支付的 `fetch`，交给您已经在用的任意 HTTP 客户端即可。{% .lead %}

## 摘要 {% #summary %}

选择支付模式，就是决定由哪个账户的 USDC 支付请求，以及其所有者签名的频率。前两种模式的差异只在于注册哪个支付方案；委托 Agent 还需要一个认证令牌存储，以及客户端扩展或 fetch 包装器之一。一旦拿到 `fetchWithPayment`，之后的请求代码在三种模式下完全一致。

- **标准钱包** — 使用 `ExactSvmScheme` 的原生 x402；所有者对每次支付签名，且无需 SOL
- **Core 资产或 Agent（直接）** — 带 `coreExecute` 目标的 `MetaplexSvmExactScheme`；资金来自资产的签名者 PDA，但所有者仍需对每次支付签名
- **委托 Agent（即时）** — 一次性链上授权让 Mech 可以从 Agent 的钱包批准支付；客户端改用消息签名进行认证
- **可随时撤销** — 委托是一项链上授权，撤销它会在链上停止支付，而不是依赖某种策略

{% callout type="note" title="您将构建的内容" %}
读完本指南，您将得到一个 `fetchWithPayment` 函数，它会为每个请求透明地完成支付，并绑定到您希望从中支出的账户。本页的每个配方产出的都是同一个函数。
{% /callout %}

## 前置条件 {% #prerequisites %}

Metaplex x402 需要一个有资金的 Solana 账户，以及一个能够构建支付交易的签名者。

- Node.js 20.18+ 与 ESM 项目
- 一个 Solana 签名者 — [Solana Kit](https://github.com/anza-xyz/kit) 密钥对签名者或 [Umi](/zh/dev-tools/umi) 签名者
- 支付账户的经典 SPL Token 关联代币账户中持有 USDC
- 对于 Core 资产和 Agent 模式，需要一个由该签名者拥有的 Core 资产，以及其签名者 PDA 中的 SOL
- 对于委托 Agent 模式，需要一个[已注册的 Agent 身份](/zh/agents/register-agent) — [铸造新 Agent](/zh/agents/mint-agent) 或注册现有的 Core 资产

{% callout type="warning" title="切勿在浏览器代码中嵌入私钥" %}
下面的示例从环境变量读取开发用密钥对。在浏览器中请改用钱包适配器签名者 — 发送到客户端的私钥，就等同于已经公开的私钥。
{% /callout %}

## 快速开始 {% #quick-start %}

安装客户端，为支付账户充值，然后注册所选模式的方案。

```sh {% title="安装客户端及其对等依赖" %}
pnpm add @metaplex-foundation/x402 \
  @metaplex-foundation/umi \
  @solana/kit \
  @x402/core \
  @x402/fetch \
  @x402/svm
```

然后添加您计划使用的客户端：

| 客户端 | 安装 |
|-------|------|
| OpenAI SDK | `pnpm add openai` |
| Vercel AI SDK | `pnpm add ai @ai-sdk/openai-compatible` |
| Solana web3.js | `pnpm add @solana/web3.js` |

跳转到对应模式：[标准钱包](#pay-with-a-standard-solana-wallet) · [Core 资产或 Agent](#pay-directly-with-a-core-asset-or-agent) · [委托 Agent](#pay-instantly-with-a-delegated-agent)。

## 各支付模式的资金要求 {% #funding-requirements-by-payment-mode %}

每种模式从不同账户扣取 USDC，只有使用 Core `execute` 的模式才需要 SOL。

| 支付模式 | USDC 来源 | SOL 要求 |
|---------|----------|---------|
| 标准钱包 | 该钱包的 USDC 代币账户 | 无需 — 网络费用由服务方的费用支付者承担 |
| Core 资产或 Agent（直接或委托） | 资产签名者 PDA 的 USDC 代币账户 | 签名者 PDA 需要 SOL 以支付 Core `execute` 费用 |

支付来源始终是经典 SPL Token 的关联代币账户。目前不支持 Token-2022 支付铸币。

## 使用标准 Solana 钱包支付 {% #pay-with-a-standard-solana-wallet %}

要从您直接控制的钱包支付，请注册 `@x402/svm` 的 `ExactSvmScheme`。这是原生 x402 — Metaplex 客户端仅额外提供了端点常量和发现辅助函数。

```ts {% title="标准钱包支付" %}
import { createKeyPairSignerFromBytes, getBase58Encoder } from '@solana/kit';
import { x402Client } from '@x402/core/client';
import { wrapFetchWithPayment } from '@x402/fetch';
import { ExactSvmScheme } from '@x402/svm/exact/client';

const svmSigner = await createKeyPairSignerFromBytes(
  getBase58Encoder().encode(process.env.SVM_PRIVATE_KEY!),
);

const paymentClient = new x402Client();
paymentClient.register('solana:*', new ExactSvmScheme(svmSigner));

const fetchWithPayment = wrapFetchWithPayment(fetch, paymentClient);
```

## 使用 Core 资产或 Agent 直接支付 {% #pay-directly-with-a-core-asset-or-agent %}

若希望在所有者仍对每次支付签名的前提下，由 Core 资产自己的钱包出资，请注册带 `coreExecute` 目标的 `MetaplexSvmExactScheme`。每个 Core 资产都自带钱包 — 即其 [Asset Signer PDA](/zh/smart-contracts/core/execute-asset-signing) — 因此为该钱包充值可以把支出与主钱包隔离，并且在所有权转移时预算会随资产一同转移。

```ts {% title="Core 资产或 Agent 直接支付" %}
import { MetaplexSvmExactScheme } from '@metaplex-foundation/x402';
import { x402Client } from '@x402/core/client';
import { wrapFetchWithPayment } from '@x402/fetch';

const paymentClient = new x402Client();
paymentClient.register(
  'solana:*',
  new MetaplexSvmExactScheme(svmSigner, {
    rpcUrl: svmRpcUrl,
    coreExecute: {
      asset: coreAssetAddress,
    },
  }),
);

const fetchWithPayment = wrapFetchWithPayment(fetch, paymentClient);
```

`svmSigner` 是控制该资产的签名者，`svmRpcUrl` 是用于构建支付交易的 Solana RPC 端点，`coreAssetAddress` 是 Core 资产或 Agent 的地址。

{% callout type="note" title="属于合集的资产需要提供合集地址" %}
当资产属于某个 Core 合集时，请传入 `coreExecute.collection`。完整选项见[方案选项表](/zh/agents/x402/api-reference#metaplexsvmexactscheme-options)。
{% /callout %}

## 使用委托 Agent 即时支付 {% #pay-instantly-with-a-delegated-agent %}

将 Agent 一次性委托给 Mech，服务端便可在无需逐次获得所有者签名的情况下，从 Agent 的钱包批准支付。这是适用于自主 Agent 和高频负载的模式。

该 Agent 必须是由批准签名者所拥有的[已注册 Agent 身份](/zh/agents/register-agent)。委托之后，客户端通过 Sign-In-With-X 消息签名进行认证并获得 24 小时有效的 bearer 令牌，服务端则从 Agent 的钱包构建支付。您始终保有控制权：该委托是一项可随时撤销的链上授权。

### 一次性批准委托 {% #approve-the-delegation-once %}

在批准前先检查当前状态，避免重复运行时再次提交交易。

```ts {% title="一次性委托授权" %}
import {
  approveMetaplexCoreExecuteDelegate,
  fetchMetaplexCoreExecuteDelegateStatus,
} from '@metaplex-foundation/x402';

const status = await fetchMetaplexCoreExecuteDelegateStatus(coreAssetAddress);

if (!status.isDelegated) {
  await approveMetaplexCoreExecuteDelegate(svmSigner, coreAssetAddress, {
    rpcUrl: svmRpcUrl,
  });
}
```

### 选择响应式或主动式集成方式 {% #choose-a-reactive-or-proactive-integration-style %}

响应式与主动式集成是二选一的方案 — 只用其中一种，切勿同时使用。

| 方式 | 认证方法 | 适用场景 |
|------|---------|---------|
| **响应式** | 客户端扩展；首个 `402` 响应驱动认证，并保留服务端的动态支付要求 | 您已经在与其他付费服务一起运行 `x402Client`，或希望可选地回退到直接支付 |
| **主动式** | 直接包装 `fetch`；客户端在请求资源前先完成认证，因此不会出现 `402` 往返 | 只针对 Metaplex 端点、希望接线最简单 |

在下面两段代码中，`solanaSigner` 都是用于认证、支持消息签名的 Solana 签名者；Solana Kit 的密钥对签名者即可。

```ts {% title="响应式委托 Agent 支付" %}
import {
  createMetaplexCoreExecuteDelegateClientExtension,
  InMemoryMetaplexCoreExecuteDelegateAuthTokenStore,
  MetaplexSvmExactScheme,
} from '@metaplex-foundation/x402';
import { x402Client } from '@x402/core/client';
import { wrapFetchWithPayment } from '@x402/fetch';

const authTokenStore = new InMemoryMetaplexCoreExecuteDelegateAuthTokenStore();
const paymentClient = new x402Client();

paymentClient.register(
  'solana:*',
  new MetaplexSvmExactScheme(svmSigner, { rpcUrl: svmRpcUrl }),
);
paymentClient.registerExtension(
  createMetaplexCoreExecuteDelegateClientExtension({
    signer: solanaSigner,
    asset: coreAssetAddress,
    authTokenStore,
  }),
);

const fetchWithPayment = wrapFetchWithPayment(fetch, paymentClient);
```

```ts {% title="主动式委托 Agent 支付" %}
import {
  InMemoryMetaplexCoreExecuteDelegateAuthTokenStore,
  wrapFetchWithMetaplexCoreExecuteDelegate,
} from '@metaplex-foundation/x402';

const authTokenStore = new InMemoryMetaplexCoreExecuteDelegateAuthTokenStore();

const fetchWithPayment = wrapFetchWithMetaplexCoreExecuteDelegate(fetch, {
  signer: solanaSigner,
  asset: coreAssetAddress,
  authTokenStore,
});
```

主动式方式同样需要先完成委托授权，且发往其他源的请求会原样透传。

### 存储认证令牌与处理过期 {% #store-auth-tokens-and-handle-expiry %}

授权 JWT 在 24 小时后过期，客户端会通过消息签名自动替换 — 而不是再次进行链上授权。

- 在 Node.js 中使用 `InMemoryMetaplexCoreExecuteDelegateAuthTokenStore`，在纯浏览器代码中使用 `LocalStorageMetaplexCoreExecuteDelegateAuthTokenStore`
- 若使用其他存储后端，请实现 `MetaplexCoreExecuteDelegateAuthTokenStore` 接口
- 响应式的直接支付回退默认关闭；仅当希望由已注册的支付方案处理委托失败时，才设置 `fallback: true`
- 传入 `onEvent` 可观察认证、缓存和回退行为

{% callout type="warning" title="授权令牌属于持有者凭证" %}
`LocalStorageMetaplexCoreExecuteDelegateAuthTokenStore` 会把 JWT 保存在浏览器可读的存储中，因此一旦你的源发生 XSS，攻击者就能读取它，并在令牌过期或委托被撤销之前用该委托进行支付。除非令牌确实需要在页面刷新后继续存在，否则请使用 `InMemoryMetaplexCoreExecuteDelegateAuthTokenStore`，只为 Agent 钱包保留必要的余额，并在不再需要委托时立即调用 `revokeMetaplexCoreExecuteDelegate`。
{% /callout %}

### 撤销委托 {% #revoke-the-delegation %}

使用与授权时相同的签名者、资产和 RPC 选项调用 `revokeMetaplexCoreExecuteDelegate`。

```ts {% title="撤销委托" %}
import { revokeMetaplexCoreExecuteDelegate } from '@metaplex-foundation/x402';

await revokeMetaplexCoreExecuteDelegate(svmSigner, coreAssetAddress, {
  rpcUrl: svmRpcUrl,
});
```

由于该授权存在于链上，撤销后服务端将无法再从 Agent 的钱包构建支付 — 这并不是服务方选择遵守的一项策略。

## 常见错误 {% #common-errors %}

支付构建失败几乎总能归结为资金、网络不匹配或委托状态三者之一。

| 现象 | 原因 | 解决办法 |
|------|------|---------|
| 支付构建失败 | 支付账户中没有支付铸币对应的 USDC | 为钱包、Core 资产或 Agent 签名者 PDA 充入 USDC |
| Core `execute` 支付失败 | 资产签名者 PDA 中没有用于交易费用的 SOL | 向资产签名者 PDA 转入 SOL |
| 支付因网络不符被拒绝 | `SVM_RPC_URL` 指向的网络与 `402` 响应声明的不一致 | 将 RPC URL 指向 `402` 响应声明的网络 |
| Core 资产的签名被拒绝 | 该资产不受您传入的签名者控制 | 传入拥有该 Core 资产的签名者 |
| 委托支付回退或失败 | 资产不是已注册的 Agent 身份，或从未批准委托 | 确认 `fetchMetaplexCoreExecuteDelegateStatus()` 返回 `isDelegated: true` |
| 认证循环或重复付费 | 同时组合了响应式扩展与主动式包装器 | 只使用其中一种集成方式 |

## 已验证的配置 {% #tested-configuration %}

| 包 | 版本 |
|----|------|
| `@metaplex-foundation/x402` | `0.1.0` |
| Node.js | 20.18+（ESM） |
| 支付铸币 | USDC（经典 SPL Token） |

## 注意事项 {% #notes %}

- `MetaplexSvmExactScheme` 接受 Umi 签名者和 Solana Kit 的部分交易签名者，但不接受 sign-and-send 签名者。Kit 签名者会在内部完成适配。
- 服务、客户端与支付模式的每种组合都有可运行示例，位于 [x402 仓库](https://github.com/metaplex-foundation/x402/tree/main/examples)，可通过 `pnpm example:<name>` 执行。
- 委托 Agent 示例首次运行时可能会提交一笔授权交易。
- 委托赋予 Mech 从 Agent 钱包中转出 USDC 以支付请求的权限。请在签名者 PDA 中只保留运营所需的余额，并在 Agent 闲置时撤销委托。

## 快速参考 {% #quick-reference %}

| 项目 | 值 |
|------|-----|
| 标准钱包方案 | `ExactSvmScheme`（来自 `@x402/svm`） |
| Core 资产与 Agent 方案 | `MetaplexSvmExactScheme` |
| 委托辅助函数 | `fetchMetaplexCoreExecuteDelegateStatus`、`approveMetaplexCoreExecuteDelegate`、`revokeMetaplexCoreExecuteDelegate` |
| 委托传输层 | `createMetaplexCoreExecuteDelegateClientExtension`、`wrapFetchWithMetaplexCoreExecuteDelegate` |
| 认证令牌有效期 | 24 小时 |
| 委托端点 | `/x402/core-execute-delegate/{status,approve,revoke,auth}` |

## FAQ {% #faq %}

关于 Metaplex x402 支付模式的常见问题。

### 我应该使用 Metaplex x402 的哪种支付模式？ {% #which-metaplex-x402-payment-mode-should-i-use %}
当应用以自身身份付费时使用标准钱包；当您希望资产在所有者监督下拥有独立预算时使用 Core 资产或 Agent 直接支付；当自主 Agent 必须在无人逐次签名的情况下付费时使用委托 Agent。

### 支付 Metaplex x402 请求需要 SOL 吗？ {% #do-i-need-sol-to-pay-for-metaplex-x402-requests %}
只有 Core 资产和 Agent 支付模式需要，此时资产签名者 PDA 需要 SOL 来支付 Core `execute` 的交易费用。标准钱包支付无需 SOL，因为支付交易的网络费用由服务方的费用支付者承担。

### 委托 Agent 的认证令牌有效期多长？ {% #how-long-does-a-delegated-agent-auth-token-last %}
授权 JWT 在 24 小时后过期。过期令牌会被丢弃并自动替换，替换只需一次消息签名，无需再次进行链上委托授权。

### 可以同时使用响应式扩展和主动式 fetch 包装器吗？ {% #can-i-use-the-reactive-extension-and-the-proactive-fetch-wrapper-together %}
不可以。两者是二选一的方案，组合使用会破坏流程。如果您已经在运行 `x402Client`，或希望可选地回退到直接支付，请使用响应式客户端扩展；如果只针对 Metaplex 端点、希望接线最简单，请使用主动式 `fetch` 包装器。

### 如何停止委托 Agent 继续付费？ {% #how-do-i-stop-a-delegated-agent-from-paying %}
使用与授权时相同的签名者、资产和 RPC 选项调用 `revokeMetaplexCoreExecuteDelegate`。委托是一项链上授权，因此撤销会在链上生效，服务端将无法再从该 Agent 的钱包构建支付。

### 可以用 Token-2022 的 USDC 或其他稳定币支付吗？ {% #can-i-pay-with-token-2022-usdc-or-another-stablecoin %}
不可以。支付来源始终是经典 SPL Token 的关联代币账户，目前不支持 Token-2022 支付铸币。

---

由 Metaplex Foundation 维护。最后验证日期：2026-09-08。客户端版本：`@metaplex-foundation/x402` `0.1.0`。[在 GitHub 上查看源码](https://github.com/metaplex-foundation/x402)。
