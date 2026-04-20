---
title: 获取 Agent
metaTitle: 获取 Agent | Metaplex CLI
description: 使用 Metaplex CLI 获取并显示已注册 MPL Core 资产的 Agent 身份数据。
keywords:
  - agents fetch
  - mplx agents fetch
  - agent identity
  - agent data
  - Metaplex CLI
about:
  - Agent identity lookup
  - Metaplex CLI
proficiencyLevel: Intermediate
programmingLanguage:
  - Bash
created: '04-09-2026'
updated: '04-09-2026'
howToSteps:
  - Run mplx agents fetch with the Core asset address
  - Review the identity PDA, wallet PDA, registration URI, and lifecycle hooks
howToTools:
  - Metaplex CLI (mplx)
---

{% callout title="本页涵盖内容" %}
获取并检查已注册 Agent 的链上身份数据：
- 查看 Agent 身份 PDA 和 Asset Signer 钱包
- 检查注册 URI 和生命周期钩子
- 验证资产是否已注册 Agent 身份
{% /callout %}

## 摘要

`mplx agents fetch` 命令读取 [MPL Core](/core) 资产的链上 [Agent 身份](/agents) PDA，并显示注册信息、生命周期钩子以及 Agent 的内置钱包（[Asset Signer PDA](/dev-tools/cli/config/asset-signer-wallets)）。

- **输入**：MPL Core 资产地址（来自 [`agents register`](/dev-tools/cli/agents/register)）
- **输出**：身份 PDA、钱包 PDA、注册 URI、生命周期钩子
- **无必填标志**：只需资产地址；`--json` 为可选项

**跳转至：** [快速参考](#quick-reference) · [用法](#usage) · [输出](#output) · [注意事项](#notes)

## 快速参考

| 项目 | 值 |
|------|-------|
| **命令** | `mplx agents fetch <AGENT_MINT>` |
| **必填参数** | `ASSET_ADDRESS` — 要查询的 MPL Core 资产 |
| **可选标志** | `--json` — 机器可读输出 |

## 用法

```bash {% title="Fetch agent identity" %}
mplx agents fetch <AGENT_MINT>
```

## 输出

```text {% title="Expected output (registered agent)" %}
{
  registered: true,
  agentMint: '<agent_mint_address>',
  owner: '<owner_address>',
  identityPda: '<identity_pda_address>',
  agentWallet: '<asset_signer_pda_address>',
  registrationUri: 'https://...',
  lifecycleChecks: { ... }
}
```

如果资产没有已注册的 Agent 身份：

```text {% title="Expected output (not registered)" %}
No agent identity found for this asset. The asset may not be registered.
```

## 注意事项

- `wallet` 字段是 Asset Signer PDA——Agent 的内置钱包，用于签署交易和持有资金
- `registrationUri` 指向注册时上传的 JSON 文档，包含 Agent 的名称、描述、服务和信任模型
- 使用 `--json` 获取机器可读输出
