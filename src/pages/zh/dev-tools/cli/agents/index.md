---
title: 概览
metaTitle: Agent 命令概览 | Metaplex CLI
description: 使用 Metaplex CLI (mplx) 注册和管理链上 Agent 身份的 CLI 命令概览。
keywords:
  - agents CLI
  - mplx agents
  - agent identity
  - agent registration
  - executive delegation
  - Metaplex CLI
  - Solana agents
about:
  - Agent identity registration
  - Executive delegation
  - Metaplex CLI
proficiencyLevel: Intermediate
programmingLanguage:
  - Bash
created: '04-09-2026'
updated: '04-09-2026'
faqs:
  - q: mplx agents 命令是什么？
    a: mplx agents 命令组让你可以在 MPL Core 资产上注册 Agent 身份、将 Genesis 代币与 Agent 关联，并在终端中管理执行委托。
  - q: 什么是执行者配置文件？
    a: 执行者配置文件是一次性链上 PDA，允许钱包接收来自已注册 Agent 的执行委托。注册完成后，执行者可以代表被委托的 Agent 签署交易。
  - q: 注册 Agent 时需要上传到 Irys 吗？
    a: 不需要。默认情况下，register 命令使用 Metaplex Agent API 自动处理存储。只有在使用 --use-ix 标志进行直接链上注册时才需要 Irys。
  - q: Agent 代币设置后可以更改吗？
    a: 不可以。每个身份只能通过 set-agent-token 命令设置一次 Agent 代币，该操作不可撤销。
---

{% callout title="本页涵盖内容" %}
Agent 身份管理的完整 CLI 参考：
- **注册**：在 MPL Core 资产上创建并注册 Agent 身份
- **代币关联**：将 Genesis 代币发行与 Agent 身份关联
- **执行委托**：授权钱包代表已注册 Agent 进行操作
{% /callout %}

## 摘要

`mplx agents` 命令让你可以在 [MPL Core](/core) 资产上注册 Agent 身份、关联 [Genesis](/smart-contracts/genesis) 代币，并在终端中管理执行委托。

- **工具**：带有 `agents` 命令组的 Metaplex CLI（`mplx`）
- **身份**：每个 Agent 身份以从 MPL Core 资产推导的 PDA 形式存储
- **委托**：执行者可被授权代表 Agent 签署交易
- **代币关联**：Genesis 代币可永久关联到 Agent 身份

**跳转至：** [前置条件](#prerequisites) · [通用流程](#general-flow) · [命令参考](#command-reference) · [常见错误](#common-errors) · [FAQ](#faq) · [术语表](#glossary)

## 前置条件

- 已安装 Metaplex CLI 并配置到 `PATH`
- Solana 密钥对文件（如 `~/.config/solana/id.json`）
- 用于支付交易费用的 SOL
- 通过 `mplx config rpcs add` 或 `-r` 参数配置的 RPC 端点

检查配置：

```bash {% title="Check CLI" %}
mplx agents --help
```

## 通用流程

### 注册 Agent 身份

使用 `agents register` 通过单条命令创建 MPL Core 资产并注册 Agent 身份。默认情况下使用 Metaplex Agent API——无需 Irys 上传。

```bash {% title="Register an agent (API mode)" %}
mplx agents register \
  --name "My Agent" \
  --description "An autonomous trading agent" \
  --image "./avatar.png"
```

对于高级工作流（现有资产、自定义文档、交互式向导），使用 `--use-ix` 标志直接发送 `registerIdentityV1` 指令。详见 [注册 Agent](/dev-tools/cli/agents/register)。

### 关联 Genesis 代币

注册 Agent 并创建 Genesis 代币发行后，使用 `set-agent-token` 将它们关联。这将永久把代币与 Agent 身份绑定。

```bash {% title="Link Genesis token to agent" %}
mplx agents set-agent-token <AGENT_ASSET> <GENESIS_ACCOUNT>
```

{% callout type="warning" title="不可撤销" %}
每个 Agent 身份只能有一个代币，且 Agent 代币只能设置一次。此操作不可撤销。
{% /callout %}

### 设置执行委托

执行委托允许钱包代表已注册 Agent 签署交易：

1. **注册**执行者配置文件（每个钱包一次性操作）：
```bash {% title="Register executive profile" %}
mplx agents executive register
```

2. **委托** Agent 给执行者（由资产所有者执行）：
```bash {% title="Delegate execution" %}
mplx agents executive delegate <AGENT_ASSET> --executive <EXECUTIVE_WALLET>
```

3. **撤销**委托（由所有者或执行者执行）：
```bash {% title="Revoke delegation" %}
mplx agents executive revoke <AGENT_ASSET>
```

详见 [执行委托](/dev-tools/cli/agents/executive)。

## 命令参考

| 命令 | 描述 |
|---------|-------------|
| [`agents register`](/dev-tools/cli/agents/register) | 在 MPL Core 资产上注册 Agent 身份 |
| [`agents fetch`](/dev-tools/cli/agents/fetch) | 获取并显示 Agent 身份数据 |
| [`agents set-agent-token`](/dev-tools/cli/agents/set-agent-token) | 将 Genesis 代币关联到已注册 Agent |
| [`agents executive register`](/dev-tools/cli/agents/executive) | 为当前钱包创建执行者配置文件 |
| [`agents executive delegate`](/dev-tools/cli/agents/executive) | 授权执行者代表 Agent 进行操作 |
| [`agents executive revoke`](/dev-tools/cli/agents/executive) | 移除执行委托 |

## 注意事项

- Agent 身份以从 MPL Core 资产推导的 PDA 形式通过 [Agent Registry](/agents) 程序存储
- 默认注册流程使用 Metaplex Agent API——使用 `--use-ix` 进行直接链上注册
- `set-agent-token` 要求钱包处于 asset-signer 模式——详见 [Asset-Signer 钱包](/dev-tools/cli/config/asset-signer-wallets)
- 运行 `mplx agents <command> --help` 查看任意命令的完整标志文档
- 请参阅 [Agent Kit 文档](/agents) 了解概念、架构和 SDK 指南

## 常见错误

| 错误 | 原因 | 解决方法 |
|-------|-------|-----|
| No agent identity found | 资产未注册为 Agent | 先使用 `agents register` 注册资产 |
| Agent token already set | 尝试第二次设置代币 | 每个身份只能设置一次 Agent 代币——此操作不可撤销 |
| Executive profile already exists | 同一钱包第二次调用 `executive register` | 每个钱包只能有一个执行者配置文件——已设置完毕 |
| Not the asset owner | 尝试从非所有者钱包委托 | 只有资产所有者可以委托执行 |
| Delegation not found | 撤销不存在的委托 | 检查 Agent 和执行者地址是否正确 |

## FAQ

**mplx agents 命令是什么？**
`mplx agents` 命令组让你可以在 MPL Core 资产上注册 Agent 身份、将 Genesis 代币关联到 Agent，并在终端中管理执行委托。

**什么是执行者配置文件？**
执行者配置文件是一次性链上 PDA，允许钱包接收来自已注册 Agent 的执行委托。注册完成后，执行者可以代表被委托的 Agent 签署交易。

**注册 Agent 时需要上传到 Irys 吗？**
不需要。默认情况下，`register` 命令使用 Metaplex Agent API 自动处理存储。只有在使用 `--use-ix` 标志进行直接链上注册时才需要 Irys。

**Agent 代币设置后可以更改吗？**
不可以。每个身份只能通过 `set-agent-token` 命令设置一次 Agent 代币，该操作不可撤销。

**API 注册路径和直接 IX 注册路径有什么区别？**
API 路径（默认）通过单次 API 调用完成资产创建和身份注册，无需 Irys 上传。直接 IX 路径（`--use-ix`）直接发送 `registerIdentityV1` 指令，适用于现有资产、自定义文档工作流或交互式向导。

## 术语表

| 术语 | 定义 |
|------|------------|
| **Agent 身份** | 从 MPL Core 资产推导的链上 PDA，存储 Agent 的注册数据、生命周期钩子和代币关联 |
| **执行者配置文件** | 钱包的一次性链上 PDA，接收执行委托的前提条件 |
| **执行委托** | 已注册 Agent 与执行者配置文件之间的按资产链接，允许执行者代表 Agent 签署交易 |
| **Asset Signer PDA** | 从 Core 资产推导的 PDA，充当 Agent 的内置钱包——用于 `set-agent-token` |
| **注册文档** | 包含 Agent 名称、描述、图像、服务和信任模型的 JSON 文档——作为身份 URI 上传存储 |
