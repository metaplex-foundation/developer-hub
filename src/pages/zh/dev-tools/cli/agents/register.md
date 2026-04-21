---
title: 注册 Agent
metaTitle: 注册 Agent | Metaplex CLI
description: 使用 Metaplex CLI 在 MPL Core 资产上注册 Agent 身份。
keywords:
  - agents register
  - agent identity
  - mplx agents register
  - agent registration
  - Metaplex CLI
about:
  - Agent identity registration
  - MPL Core assets
  - Metaplex CLI
proficiencyLevel: Intermediate
programmingLanguage:
  - Bash
created: '04-09-2026'
updated: '04-09-2026'
howToSteps:
  - Run mplx agents register with --name, --description, and --image to register via the API
  - Optionally use --use-ix for direct on-chain registration or --wizard for interactive mode
  - Save the Asset address from the output for subsequent commands
howToTools:
  - Metaplex CLI (mplx)
faqs:
  - q: mplx agents register 做什么？
    a: 它创建一个 MPL Core 资产并在其上注册 Agent 身份。身份以从资产地址推导的 PDA 形式存储。
  - q: API 注册和直接 IX 注册有什么区别？
    a: API 路径（默认）通过单次 API 调用完成资产创建和身份注册，无需 Irys 上传。直接 IX 路径（--use-ix）直接发送 registerIdentityV1 指令，适用于现有资产、自定义文档或向导模式。
  - q: 我可以在现有 Core 资产上注册 Agent 吗？
    a: 可以。将资产地址作为第一个参数传入并使用 --use-ix。该资产必须尚未注册 Agent 身份。
---

{% callout title="本页涵盖内容" %}
在 MPL Core 资产上注册 Agent 身份：
- 创建带有 Agent 身份的新 Core 资产（或在现有资产上注册）
- 配置 Agent 名称、描述、图像、服务和信任模型
- 选择 API 模式（默认）或直接链上注册
{% /callout %}

## 摘要

`mplx agents register` 命令创建一个 [MPL Core](/core) 资产并在其上注册 [Agent 身份](/agents)。默认使用 Metaplex Agent API 进行单步流程，无需 Irys 上传。

- **默认模式**：API——通过单次调用完成资产创建和身份注册
- **直接 IX 模式**：`--use-ix`——直接发送链上 `registerIdentityV1`（适用于现有资产、向导或自定义文档）
- **输出**：资产地址，用于所有后续 Agent 命令（如 [`agents fetch`](/dev-tools/cli/agents/fetch)、[`set-agent-token`](/dev-tools/cli/agents/set-agent-token)）

**跳转至：** [基本用法](#basic-usage) · [选项](#options) · [注册工作流](#registration-workflows) · [示例](#examples) · [输出](#output) · [常见错误](#common-errors) · [FAQ](#faq)

## 基本用法

默认 API 模式仅需最少的必填标志即可注册 Agent：

```bash {% title="Register an agent (API mode)" %}
mplx agents register \
  --name "My Agent" \
  --description "An autonomous trading agent" \
  --image "./avatar.png"
```

## 选项

| 标志 | 简写 | 描述 | 是否必填 | 默认值 |
|------|-------|-------------|----------|---------|
| `--name <string>` | | Agent 名称 | 是（除非使用 `--wizard` 或 `--from-file`） | |
| `--description <string>` | | Agent 描述 | 否 | |
| `--image <string>` | | Agent 图像文件路径（上传）或现有 URI | 否 | |
| `--use-ix` | | 直接发送 `registerIdentityV1` 指令而非使用 API | 否 | `false` |
| `--new` | | 创建新 Core 资产并注册（仅与 `--use-ix` 配合使用） | 否 | `false` |
| `--owner <string>` | | 新资产的所有者公钥（仅与 `--new` 配合使用） | 否 | 签名者 |
| `--collection <string>` | | 资产所属的 Collection 地址 | 否 | |
| `--wizard` | | 交互式向导构建注册文档（隐含 `--use-ix`） | 否 | |
| `--from-file <path>` | | 待上传的本地 Agent 注册 JSON 文件路径（隐含 `--use-ix`） | 否 | |
| `--active` | | 在注册文档中将 Agent 设为活跃状态 | 否 | `true` |
| `--services <json>` | | 服务端点（JSON 数组） | 否 | |
| `--supported-trust <json>` | | 支持的信任模型（JSON 数组） | 否 | |
| `--save-document <path>` | | 将生成的文档 JSON 保存到本地文件 | 否 | |

{% callout type="note" title="互斥标志" %}
`--wizard`、`--from-file` 和 `--name` 互斥——只能使用其中一个来指定注册文档来源。
{% /callout %}

## 注册工作流

### API 模式（默认）

最简单的路径——通过单次 API 调用创建 Core 资产并注册身份。无需 Irys 上传或 `--use-ix` 标志。

```bash {% title="API registration" %}
mplx agents register \
  --name "My Agent" \
  --description "An autonomous trading agent" \
  --image "./avatar.png"
```

### 直接 IX 创建新资产

`--new` 和 `--use-ix` 标志创建新 Core 资产并直接发送 `registerIdentityV1` 指令。注册文档上传至 Irys。

```bash {% title="Direct IX — new asset" %}
mplx agents register --new --use-ix \
  --name "My Agent" \
  --description "An AI agent" \
  --image "./avatar.png"
```

### 直接 IX 使用现有资产

将资产地址作为第一个参数传入，可在现有 Core 资产上注册身份。

```bash {% title="Direct IX — existing asset" %}
mplx agents register <AGENT_ASSET> --use-ix \
  --from-file "./agent-doc.json"
```

### 交互式向导

`--wizard` 标志提供逐步引导的注册流程，并自动启用 `--use-ix`。

```bash {% title="Wizard mode" %}
mplx agents register --new --wizard
```

## 示例

注册时配置服务端点：

```bash {% title="With MCP service endpoint" %}
mplx agents register \
  --name "My Agent" \
  --description "An AI agent with MCP" \
  --image "./avatar.png" \
  --services '[{"name":"MCP","endpoint":"https://myagent.com/mcp"}]'
```

注册时配置信任模型：

```bash {% title="With trust models" %}
mplx agents register \
  --name "My Agent" \
  --description "A trusted agent" \
  --image "./avatar.png" \
  --supported-trust '["reputation","tee-attestation"]'
```

仅将注册文档保存到本地文件，不执行注册：

```bash {% title="Save document to file" %}
mplx agents register \
  --name "My Agent" \
  --description "An AI agent" \
  --save-document "./my-agent-doc.json"
```

## 输出

```text {% title="Expected output" %}
--------------------------------
  Agent Asset: <agent_asset_address>
  Signature: <transaction_signature>
  Explorer: <explorer_url>
--------------------------------
```

保存 `Asset` 地址——后续在 `agents fetch`、`agents set-agent-token` 和 `agents executive delegate` 中会用到。

## 常见错误

| 错误 | 原因 | 解决方法 |
|-------|-------|-----|
| Provide --wizard, --from-file, or --name | 未指定文档来源 | 添加 `--name`、`--wizard` 或 `--from-file` 之一 |
| --services must be a valid JSON array | `--services` 中 JSON 格式不正确 | 使用格式 `'[{"name":"MCP","endpoint":"https://..."}]'` |
| --supported-trust must be a valid JSON array | JSON 格式不正确 | 使用格式 `'["reputation","tee-attestation"]'` |
| API does not support localnet | 在本地验证器上运行 | 本地网络注册请使用 `--use-ix` |
| Validation error on field | API 拒绝了某个字段值 | 检查错误信息中的字段名称并更正值 |

## 注意事项

- API 路径不需要 Irys——API 自动处理文档存储
- 直接 IX 路径（`--use-ix`）在发送链上指令前将文档上传到 Irys
- `--wizard` 和 `--from-file` 均隐含 `--use-ix`——始终使用直接链上路径
- 当 `--use-ix` 与 `--name`、`--from-file` 或 `--wizard` 配合使用时，文档上传至 Irys，URI 存储在链上
- `--services` 和 `--supported-trust` 需要 `--name`——不能与 `--wizard` 或 `--from-file` 配合使用

## FAQ

**mplx agents register 做什么？**
它创建一个 MPL Core 资产并在其上注册 Agent 身份。身份以从资产地址推导的 PDA 形式存储。

**API 注册和直接 IX 注册有什么区别？**
API 路径（默认）通过单次 API 调用完成资产创建和身份注册，无需 Irys 上传。直接 IX 路径（`--use-ix`）直接发送 `registerIdentityV1` 指令，适用于现有资产、自定义文档或向导模式。

**我可以在现有 Core 资产上注册 Agent 吗？**
可以。将资产地址作为第一个参数传入并使用 `--use-ix`。该资产必须尚未注册 Agent 身份。
