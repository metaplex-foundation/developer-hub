---
title: 读取代理数据
metaTitle: 在 Solana 上读取代理数据 | Metaplex Agent Registry
description: 验证代理注册、在链上读取身份与注册文档，或通过 DAS API 读取已索引的代理字段。
keywords:
  - read agent data
  - agent identity
  - AgentIdentity plugin
  - Asset Signer
  - agent wallet
  - DAS API
  - isAgent
  - agentToken
  - assetSigner
programmingLanguage:
  - JavaScript
  - TypeScript
about:
  - Agent Data
  - DAS API
  - Solana
  - Metaplex
proficiencyLevel: Beginner
created: '02-25-2026'
updated: '07-08-2026'
faqs:
  - q: agentToken 何时会出现在 DAS 响应中？
    a: 仅当代理的 AgentIdentityV2 PDA 已通过 setAgentTokenV1 设置代币 mint 时，响应中才会包含 agentToken 字段。已注册但未关联代币的代理会省略该字段。AgentIdentityV1 PDA 不携带代币 mint，永远不会填充 agentToken。
  - q: assetSigner 与代理钱包是同一个地址吗？
    a: 是的。assetSigner 是 Core Asset Signer PDA——与 SDK 中 findAssetSignerPda 返回的地址相同。DAS 在 MplCoreAsset 行上返回 asset_signer；代理将该 PDA 用作链上钱包。
  - q: 能否用 isAgent 过滤非 Core 资产？
    a: 不能。isAgent、agentToken 和 assetSigner 仅适用于 MplCoreAsset 行。Token Metadata NFT 及其他接口在 DAS 响应中完全省略这些字段。
  - q: 所有 DAS 提供商都支持代理代币字段吗？
    a: 代理代币索引随 Metaplex DAS 索引器（digital-asset-rpc-infrastructure）一起发布。第三方 DAS 提供商必须运行包含 agent registry transformer 和数据库迁移的兼容索引器版本，这些字段才会出现在响应中。
---

在[注册](/agents/register-agent)后读取并验证代理身份——可直接通过 SDK 在链上读取，也可通过已索引的 [DAS API](/dev-tools/das-api) 读取。{% .lead %}

## Summary

使用 Agent Registry SDK 进行直接链上读取（身份 PDA、注册文档、钱包 PDA），或在索引器已解析代理字段时使用 DAS API。

- **链上（SDK）** — 检查注册、检查 `AgentIdentity` 插件、获取 ERC-8004 文档、派生 Asset Signer PDA
- **已索引（DAS）** — 从 [`getAsset`](/dev-tools/das-api/methods/get-asset) 读取 `is_agent`、`asset_signer` 和 `agent_token`；通过 [`searchAssets`](/dev-tools/das-api/methods/search-assets) 发现代理
- **相同钱包地址** — `findAssetSignerPda` 与 DAS 的 `asset_signer` 返回相同的 PDA

## Quick Start

**跳转到：** [检查注册](#check-registration) · [注册文档](#read-the-registration-document) · [代理钱包](#fetch-the-agents-wallet) · [通过 DAS 读取](#read-agent-data-via-das-api)

1. **单个代理，完整详情** — 使用 `safeFetchAgentIdentityV1` 和 `fetchAsset`（见下方 SDK 章节）
2. **单个代理，已索引字段** — 使用 Core 资产地址调用 `getAsset`（见下方 DAS 章节）
3. **发现代理** — 使用 `isAgent: true` 调用 `searchAssets`，或按 `agentToken` / `assetSigner` 过滤

## 检查注册 {#check-registration}

安全获取方法在身份不存在时返回 `null` 而不是抛出异常，这对于检查资产是否已注册很有用：

{% code-tabs-imported from="agents/read_agent_check_registration" frameworks="umi" defaultFramework="umi" /%}

## 从种子获取

您也可以直接从资产的公钥获取身份，无需手动派生 PDA：

{% code-tabs-imported from="agents/read_agent_fetch_from_seeds" frameworks="umi" defaultFramework="umi" /%}

## 验证 AgentIdentity 插件

注册会将 `AgentIdentity` 插件附加到 Core 资产。您可以直接从获取的资产中读取它来检查注册 URI 和生命周期钩子：

{% code-tabs-imported from="agents/read_agent_verify_plugin" frameworks="umi" defaultFramework="umi" /%}

## 读取注册文档 {#read-the-registration-document}

`AgentIdentity` 插件上的 `uri` 指向一个包含代理完整配置文件（名称、描述、服务端点等）的链下 JSON 文档。像其他 URI 一样获取它：

{% code-tabs-imported from="agents/read_agent_registration_document" frameworks="umi" defaultFramework="umi" /%}

该文档遵循 [ERC-8004](https://eips.ethereum.org/EIPS/eip-8004) 代理注册标准。典型示例如下：

```json
{
  "type": "https://eips.ethereum.org/EIPS/eip-8004#registration-v1",
  "name": "An informational agent providing help related to Metaplex protocols and tools.",
  "description": "An autonomous agent that executes DeFi strategies on Solana.",
  "image": "https://arweave.net/agent-avatar-tx-hash",
  "services": [
    {
      "name": "web",
      "endpoint": "https://metaplex.com/agent/<ASSET_PUBKEY>"
    },
    {
      "name": "A2A",
      "endpoint": "https://metaplex.com/agent/<ASSET_PUBKEY>/agent-card.json",
      "version": "0.3.0"
    }
  ],
  "active": true,
  "registrations": [
    {
      "agentId": "<MINT_ADDRESS>",
      "agentRegistry": "solana:101:metaplex"
    }
  ],
  "supportedTrust": ["reputation", "crypto-economic"]
}
```

完整字段参考请参阅[注册代理](/agents/register-agent#agent-registration-document)。

## 获取代理钱包 {#fetch-the-agents-wallet}

每个 Core 资产都有一个称为 **Asset Signer** 的内置钱包——从资产公钥派生的 PDA。不存在私钥，因此无法被盗。钱包可以持有 SOL、代币或任何其他资产。使用 `findAssetSignerPda` 派生地址：

{% code-tabs-imported from="agents/read_agent_fetch_asset_signer" frameworks="umi" defaultFramework="umi" /%}

地址是确定性的，因此任何人都可以从资产的公钥派生它来发送资金或检查余额。只有资产本身才能通过委托的[执行者](/agents/run-an-agent)经由 Core 的 [Execute](/smart-contracts/core/execute-asset-signing) 指令为此钱包签名。

有关账户布局、PDA 派生详情和错误代码，请参阅 [MPL Agent Registry](/smart-contracts/mpl-agent) 智能合约文档。

## 通过 DAS API 读取代理数据 {#read-agent-data-via-das-api}

[DAS API](/dev-tools/das-api) 在 MPL Core 资产上索引代理字段——注册状态、钱包 PDA 和规范代币 mint——因此您无需自行解析 Core 账户即可读取这些字段。

**前提条件：** 一个[支持 DAS 的 RPC 端点](/solana/rpcs-and-das)，以及在 [Umi](/umi) 实例上安装 `@metaplex-foundation/digital-asset-standard-api`。

### DAS 代理响应字段

DAS 从两个链上来源派生代理元数据，并将其作为顶层响应字段返回。

| 字段 | 类型 | 出现于 | 来源 |
|------|------|--------|------|
| `is_agent` | `boolean` | `MplCoreAsset` | 当资产具有 `AgentIdentity` 外部插件时为 `true` |
| `asset_signer` | `string` (pubkey) | 仅 `MplCoreAsset` | 与上方 [`findAssetSignerPda`](#fetch-the-agents-wallet) 相同的 PDA |
| `agent_token` | `string` (pubkey) | 已设置时的 `MplCoreAsset` | `AgentIdentityV2` PDA mint，由 [`setAgentTokenV1`](/dev-tools/cli/agents/set-agent-token) 写入 |

{% callout type="note" %}
只有 **`MplCoreAsset`** 行可以是代理（`is_agent: true`）。集合和组在 DAS 响应中可能包含 `is_agent: false`，但代理注册仅适用于单个 Core 资产。非 Core 资产（Token Metadata NFT、压缩 NFT、同质化代币）会省略全部三个字段。
{% /callout %}

已注册但未关联代币的代理返回 `is_agent: true` 和 `asset_signer`，但省略 `agent_token`：

```json {% title="getAsset response (registered, no token)" %}
{
  "interface": "MplCoreAsset",
  "id": "84jw9dw7hMRJXFvzJXrBzVQpmVWaGUtYT7R6QhNU9qt3",
  "is_agent": true,
  "asset_signer": "6ttUwc5VVmHeVKTddB6XM5vQgBMfw62DThuoiVEufVZq",
  "external_plugins": [
    {
      "type": "AgentIdentity",
      "adapter_config": { "uri": "https://example.com/agent-registration.json" }
    }
  ]
}
```

执行 [`setAgentTokenV1`](/dev-tools/cli/agents/set-agent-token) 后，DAS 会包含 `agent_token`：

```json {% title="getAsset response (registered with token)" %}
{
  "interface": "MplCoreAsset",
  "id": "84jw9dw7hMRJXFvzJXrBzVQpmVWaGUtYT7R6QhNU9qt3",
  "is_agent": true,
  "agent_token": "FakeToken11111111111111111111111111111111111",
  "asset_signer": "6ttUwc5VVmHeVKTddB6XM5vQgBMfw62DThuoiVEufVZq"
}
```

JSON-RPC 响应使用 snake_case（`is_agent`、`agent_token`、`asset_signer`）。`searchAssets` 请求参数使用 camelCase（`isAgent`、`agentToken`、`assetSigner`）；也接受 snake_case 别名。

### 通过 DAS 获取单个代理

当您已知 Core 资产地址时，使用 [`getAsset`](/dev-tools/das-api/methods/get-asset)。

{% code-tabs-imported from="agents/read_agent_das_get" frameworks="umi,curl" defaultFramework="umi" /%}

### 搜索已注册代理

使用 `isAgent: true` 调用 [`searchAssets`](/dev-tools/das-api/methods/search-assets) 以列出已注册代理。结合 `interface: "MplCoreAsset"` 可排除集合和组。

{% code-tabs-imported from="agents/read_agent_das_search" frameworks="umi,curl" defaultFramework="umi" /%}

### 通过代币 Mint 查找代理

代理关联其规范代币后，使用 `agentToken` 过滤即可从 mint 地址解析代理 Core 资产。每个代理最多只能有一个代币——绑定是永久性的。

{% code-tabs-imported from="agents/read_agent_das_lookup_token" frameworks="curl" defaultFramework="curl" /%}

### 通过 Asset Signer 查找代理

`assetSigner` 过滤器可查找 execute PDA 与给定地址匹配的 Core 资产。当您已知代理钱包但不知道资产公钥时使用。

{% code-tabs-imported from="agents/read_agent_das_lookup_signer" frameworks="curl" defaultFramework="curl" /%}

### DAS 索引工作原理

DAS 在摄取期间从两个链上来源填充代理字段。**MPL Core 资产**账户更新会设置 `is_agent`（存在 `AgentIdentity` 插件时）并为 `MplCoreAsset` 行派生 `asset_signer`。**Agent Registry** PDA 更新会在存在 `AgentIdentityV2` mint 时，为现有 `MplCoreAsset` 行设置 `agent_token`。

| 事件 | 更新的字段 | 说明 |
|------|-----------|------|
| Core 资产创建或更新 | `is_agent`、`asset_signer` | 仅适用于 `MplCoreAsset` 行；`is_agent` 反映 `AgentIdentity` 外部插件；每个已索引 Core 资产都会派生 `asset_signer` |
| `AgentIdentityV2` PDA 更新 | `agent_token` | 由 Agent Registry transformer 写入；仅更新现有、未销毁的 `MplCoreAsset` 行 |
| 资产销毁 | — | 后续 Agent Registry 更新会被忽略 |
| 过期 slot 的 PDA 重放 | — | slot 低于 `slot_updated_agent_registry` 的更新会被跳过 |

## Notes

- Asset Signer 是一个 PDA——不存在私钥。它可以从任何来源接收资金，但只有资产本身才能通过 Core 的 [Execute](/smart-contracts/core/execute-asset-signing) 指令签署发出的交易。
- `safeFetchAgentIdentityV1` 对未注册资产返回 `null` 而不是抛出异常，使其可以安全地用于无需 try/catch 的存在性检查。
- `findAssetSignerPda` 与 DAS 的 `asset_signer` 在每个网络上都返回相同的确定性地址。
- 通过 [`setAgentTokenV1`](/dev-tools/cli/agents/set-agent-token) 设置后，`agent_token` 是**永久性**的——没有指令可以清除或重新分配它。
- DAS 的 `asset_signer` 在 **`MplCoreAsset`** 行上返回，不仅限于已注册代理；使用 `is_agent` 区分代理与普通 Core NFT。
- 已注册但未关联代币的代理会省略 `agent_token`——在 [`createAndRegisterLaunch`](/agents/create-agent-token) 或手动 `setAgentTokenV1` 之前属于预期行为。
- Agent Registry 更新永远不会创建新的资产行；Core 资产必须先被索引。
- 提供商支持情况各异——请确认您的 [DAS 提供商](/solana/rpcs-and-das) 运行支持 agent registry 的索引器。

## Quick Reference

| 项目 | 值 |
|------|-----|
| Agent Registry 程序 | `1DREGFgysWYxLnRnKQnwrxnJQeSMk2HmGaC6whw2B2p` |
| MPL Core 程序 | `CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d` |
| Asset Signer 种子 | `['mpl-core-execute', <core_asset_pubkey>]` |
| DAS `isAgent` 过滤器 | `searchAssets` 参数 `isAgent: true \| false` |
| DAS `agentToken` 过滤器 | `searchAssets` 参数 `agentToken: <mint_pubkey>` |
| DAS `assetSigner` 过滤器 | `searchAssets` 参数 `assetSigner: <pda_pubkey>` |
| DAS 响应方法 | `getAsset`、`getAssets`、`searchAssets` |

## FAQ

### `agentToken` 何时会出现在 DAS 响应中？

仅当代理的 `AgentIdentityV2` PDA 已通过 [`setAgentTokenV1`](/dev-tools/cli/agents/set-agent-token) 设置代币 mint 时，响应中才会包含 `agent_token`。已注册但未关联代币的代理会省略该字段。`AgentIdentityV1` PDA 不携带代币 mint，永远不会填充 `agent_token`。

### `assetSigner` 与代理钱包是同一个地址吗？

是的。DAS 的 `asset_signer` 是 Core [Asset Signer](/smart-contracts/core/execute-asset-signing) PDA——与 [`findAssetSignerPda`](#fetch-the-agents-wallet) 返回的地址相同。它在 `MplCoreAsset` 行上返回；对于已注册代理，它充当链上钱包。

### 能否用 `isAgent` 过滤非 Core 资产？

不能。`is_agent`、`agent_token` 和 `asset_signer` 仅适用于 **`MplCoreAsset`**。Token Metadata NFT 及其他资产类型会省略这些字段。

### 所有 DAS 提供商都支持代理代币字段吗？

代理代币索引随 [Metaplex DAS 索引器](https://github.com/metaplex-foundation/digital-asset-rpc-infrastructure) 一起发布。第三方提供商必须运行包含 agent registry transformer 和数据库迁移的兼容索引器版本。

## Glossary

| 术语 | 定义 |
|------|------|
| **`AgentIdentity` 插件** | [注册](/agents/register-agent) 期间设置在 Core 资产上的外部插件；携带链下注册 URI |
| **`is_agent`** | DAS 布尔值，表示 Core 资产具有 `AgentIdentity` 外部插件 |
| **`agent_token`** | 从 `AgentIdentityV2` PDA 索引的规范代币 mint 公钥；通过 [`setAgentTokenV1`](/dev-tools/cli/agents/set-agent-token) 一次性设置 |
| **`asset_signer`** | 充当代理链上钱包的 Core execute PDA；由 `['mpl-core-execute', <asset>]` 派生 |
| **`AgentIdentityV2`** | 存储关联代币 mint 的 Agent Registry PDA；独立于 Core 资产账户更新 |
| **`Agent Registry transformer`** | DAS 摄取处理器，将 Agent Registry PDA 更新中的 `agent_token` 写入现有 Core 资产行 |
