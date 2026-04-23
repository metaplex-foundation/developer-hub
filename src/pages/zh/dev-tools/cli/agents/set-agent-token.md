---
title: Agent 代币
metaTitle: Agent 代币 | Metaplex CLI
description: 使用 Metaplex CLI 为已注册 Agent 创建代币并将其关联到 Agent 身份。
keywords:
  - agent token
  - agents set-agent-token
  - mplx agents set-agent-token
  - genesis launch agent
  - agent bonding curve
  - Metaplex CLI
about:
  - Agent token creation
  - Agent token linking
  - Genesis integration
  - Metaplex CLI
proficiencyLevel: Intermediate
programmingLanguage:
  - Bash
created: '04-09-2026'
updated: '04-09-2026'
howToSteps:
  - Create a token launch linked to the agent using genesis launch create with --agentAsset and --agentSetToken to permanently link the token
  - Or create a launch without --agentSetToken, then link it manually with agents set-agent-token
howToTools:
  - Metaplex CLI (mplx)
faqs:
  - q: Agent 代币设置后可以更改吗？
    a: 不可以。每个 Agent 身份只能有一个代币，且只能设置一次。此操作不可撤销。
  - q: --agentSetToken 和 set-agent-token 有什么区别？
    a: 它们的作用相同。--agentSetToken 在创建发行时一步完成代币关联。set-agent-token 在发行后单独关联，需要 asset-signer 模式。
  - q: 为什么 set-agent-token 需要 asset-signer 模式？
    a: set-agent-token 指令需要 Asset Signer PDA 作为授权方。asset-signer 模式让 CLI 自动推导并使用该 PDA。
---

{% callout title="本页涵盖内容" %}
为已注册 Agent 创建代币并将其关联到 Agent 身份：
- **一步完成**：通过 `--agentAsset` 和 `--agentSetToken` 在创建联合曲线发行时关联 Agent
- **两步完成**：单独创建代币发行，然后用 `agents set-agent-token` 关联
{% /callout %}

## 摘要

Agent 代币是永久关联到已注册 [Agent 身份](/agents) 的 [Genesis](/smart-contracts/genesis) 代币。有两种创建和关联 Agent 代币的方式——发行创建时的一步流程，或手动的两步流程。

- **一步完成**（推荐）：`genesis launch create --agentAsset <ASSET> --agentSetToken`
- **两步完成**：创建发行，然后用 `agents set-agent-token` 关联
- **不可撤销**：每个 Agent 身份只能有一个代币，且只能设置一次

## 快速开始

**跳转至：** [一步完成：创建带 Agent 的发行](#one-step-launch-with-agent) · [两步完成：手动关联](#two-step-manual-linking) · [常见错误](#common-errors) · [FAQ](#faq)

## 一步完成：创建带 Agent 的发行

创建 Agent 代币最简单的方式是在创建发行时传入 `--agentAsset`。这将从 Agent 的 [Asset Signer PDA](/dev-tools/cli/config/asset-signer-wallets) 自动推导创作者费钱包，并可选择在同一交易中关联代币。

```bash {% title="Create bonding curve with agent token" %}
mplx genesis launch create --launchType bonding-curve \
  --name "Agent Token" \
  --symbol "AGT" \
  --image "https://gateway.irys.xyz/abc123" \
  --agentAsset <AGENT_ASSET> \
  --agentSetToken
```

{% callout type="warning" title="--agentSetToken 不可撤销" %}
`--agentSetToken` 将已发行代币永久关联到 Agent。省略此标志可在不关联的情况下发行，之后再用 `agents set-agent-token` 关联。
{% /callout %}

同样适用于 Launchpool 发行：

```bash {% title="Launchpool with agent" %}
mplx genesis launch create \
  --name "Agent Token" \
  --symbol "AGT" \
  --image "https://gateway.irys.xyz/abc123" \
  --agentAsset <AGENT_ASSET> \
  --agentSetToken \
  --tokenAllocation 500000000 \
  --depositStartTime 2025-03-01T00:00:00Z \
  --raiseGoal 250 \
  --raydiumLiquidityBps 5000 \
  --fundsRecipient <WALLET_ADDRESS>
```

详见 [Launch (API) — Agent 发行](/dev-tools/cli/genesis/launch#agent-launches)。

## 两步完成：手动关联

如果在创建代币发行时未使用 `--agentSetToken`，可以之后通过 `agents set-agent-token` 关联。这需要 [asset-signer 钱包模式](/dev-tools/cli/config/asset-signer-wallets)。

### 第一步：配置 Asset-Signer 钱包

```bash {% title="Set up asset-signer wallet" %}
mplx config wallets add --name my-agent --agent <AGENT_ASSET>
mplx config wallets set my-agent
```

### 第二步：关联代币

```bash {% title="Link Genesis token to agent" %}
mplx agents set-agent-token <AGENT_ASSET> <GENESIS_ACCOUNT>
```

{% callout type="warning" title="不可撤销" %}
每个 Agent 身份只能有一个代币，且只能设置一次。执行此命令前请仔细核对两个地址。
{% /callout %}

### 输出

```text {% title="Expected output" %}
--------------------------------
  Agent Asset: <agent_asset_address>
  Genesis Account: <genesis_account_address>
  Signature: <transaction_signature>
  Explorer: <explorer_url>
--------------------------------
```

## 端到端示例

```bash {% title="Register agent and launch token" %}
# 1. 注册新 Agent
mplx agents register --name "My Agent" \
  --description "An autonomous trading agent" \
  --image "./avatar.png"
# 记录输出中的资产地址

# 2. 创建关联到 Agent 的联合曲线代币
mplx genesis launch create --launchType bonding-curve \
  --name "Agent Token" --symbol "AGT" \
  --image "https://gateway.irys.xyz/abc123" \
  --agentAsset <AGENT_ASSET> --agentSetToken

# 3. 验证 Agent 已关联代币
mplx agents fetch <AGENT_ASSET>
```

## 常见错误

| 错误 | 原因 | 解决方法 |
|-------|-------|-----|
| Agent token already set | 尝试第二次设置代币 | 每个 Agent 身份只能有一个代币——此操作不可撤销 |
| Agent is not owned by the connected wallet | API 尚未索引刚注册的 Agent | 等待约 30 秒后重试，或检查 `agents fetch`——发行可能已成功 |
| Not in asset-signer mode | 未配置钱包即运行 `set-agent-token` | 先设置 asset-signer 钱包（参见[前置条件](#step-1-configure-asset-signer-wallet)） |

## 注意事项

- 一步流程（`--agentAsset --agentSetToken`）是推荐方式——在单笔交易中处理所有操作
- 两步流程需要 asset-signer 模式，因为 `set-agent-token` 指令使用 Asset Signer PDA 作为授权方
- 运行 `set-agent-token` 前 Genesis 账户必须已存在
- 使用 `--agentAsset` 时，创作者费钱包将从 Agent 的 Asset Signer PDA 自动推导

## FAQ

**Agent 代币设置后可以更改吗？**
不可以。每个 Agent 身份只能有一个代币，且只能设置一次。此操作不可撤销。

**`--agentSetToken` 和 `set-agent-token` 有什么区别？**
它们的作用相同。`--agentSetToken` 在创建发行时一步完成代币关联。`set-agent-token` 在发行后单独关联，需要 asset-signer 模式。

**为什么 `set-agent-token` 需要 asset-signer 模式？**
`set-agent-token` 指令需要 Asset Signer PDA 作为授权方。asset-signer 模式让 CLI 自动推导并使用该 PDA。
