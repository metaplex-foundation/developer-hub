---
title: 执行委托
metaTitle: 执行委托 | Metaplex CLI
description: 使用 Metaplex CLI 注册执行者配置文件并管理 Agent 的执行委托。
keywords:
  - agents executive
  - executive delegation
  - mplx agents executive
  - execution delegate
  - agent execution
  - Metaplex CLI
about:
  - Executive profile registration
  - Execution delegation
  - Metaplex CLI
proficiencyLevel: Intermediate
programmingLanguage:
  - Bash
created: '04-09-2026'
updated: '04-09-2026'
howToSteps:
  - Register an executive profile with mplx agents executive register
  - Delegate an agent to the executive with mplx agents executive delegate
  - Optionally revoke a delegation with mplx agents executive revoke
howToTools:
  - Metaplex CLI (mplx)
faqs:
  - q: 什么是执行者配置文件？
    a: 钱包的一次性链上 PDA，使该钱包能够接收来自已注册 Agent 的执行委托。
  - q: 一个钱包可以有多个执行者配置文件吗？
    a: 不可以。每个钱包只能有一个执行者配置文件。注册是一次性操作。
  - q: 谁可以撤销委托？
    a: 资产所有者或执行者授权方均可撤销委托。
---

{% callout title="本页涵盖内容" %}
管理已注册 Agent 的执行委托：
- 注册执行者配置文件（每个钱包一次性操作）
- 将 Agent 执行委托给执行者钱包
- 不再需要时撤销委托
{% /callout %}

## 摘要

`mplx agents executive` 命令管理执行委托——授权钱包代表已注册 [Agent](/agents) 签署交易。执行者必须先一次性注册配置文件，然后 [MPL Core](/core) 资产所有者才能将执行权委托给他们。

- **注册**：每个钱包一次性创建执行者配置文件
- **委托**：将已注册 Agent 关联到执行者（仅所有者可操作）
- **撤销**：移除委托（所有者或执行者均可撤销）

**跳转至：** [注册执行者配置文件](#register-executive-profile) · [委托执行](#delegate-execution) · [撤销委托](#revoke-delegation) · [常见错误](#common-errors) · [FAQ](#faq)

## 注册执行者配置文件

`agents executive register` 命令为当前钱包创建一次性链上执行者配置文件 PDA。在任何 Agent 被[委托](/dev-tools/cli/agents/executive#delegate-execution)给此钱包之前，必须先有此配置文件。

```bash {% title="Register executive profile" %}
mplx agents executive register
```

无需任何标志或参数——配置文件从当前签名者的钱包推导。

### 输出

```text {% title="Expected output" %}
--------------------------------
  Executive Profile: <profile_pda_address>
  Authority: <wallet_address>
  Signature: <transaction_signature>
  Explorer: <explorer_url>
--------------------------------
```

## 委托执行

`agents executive delegate` 命令将已注册 Agent 关联到执行者配置文件，允许执行者代表 Agent 签署交易。只有资产所有者才能委托执行。

```bash {% title="Delegate execution" %}
mplx agents executive delegate <AGENT_MINT> --executive <EXECUTIVE_WALLET>
```

### 选项

| 标志 | 描述 | 是否必填 |
|------|-------------|----------|
| `--executive <string>` | 执行者的钱包地址（配置文件 PDA 自动推导） | 是 |

{% callout type="note" %}
执行者必须已通过 `mplx agents executive register` 注册了配置文件，才能接受委托。
{% /callout %}

### 输出

```text {% title="Expected output" %}
--------------------------------
  Agent Mint: <agent_mint_address>
  Executive Profile: <profile_pda_address>
  Signature: <transaction_signature>
  Explorer: <explorer_url>
--------------------------------
```

## 撤销委托

`agents executive revoke` 命令移除执行委托，关闭委托记录并退还租金。资产所有者或执行者授权方均可撤销。

```bash {% title="Revoke delegation (as owner)" %}
mplx agents executive revoke <AGENT_MINT> --executive <EXECUTIVE_WALLET>
```

```bash {% title="Revoke own delegation (as executive)" %}
mplx agents executive revoke <AGENT_MINT>
```

### 选项

| 标志 | 描述 | 是否必填 | 默认值 |
|------|-------------|----------|---------|
| `--executive <string>` | 执行者的钱包地址 | 否 | 当前签名者 |
| `--destination <string>` | 接收退还租金的钱包 | 否 | 当前签名者 |

### 输出

```text {% title="Expected output" %}
--------------------------------
  Agent Mint: <agent_mint_address>
  Executive Wallet: <executive_wallet_address>
  Signature: <transaction_signature>
  Explorer: <explorer_url>
--------------------------------
```

## 常见错误

| 错误 | 原因 | 解决方法 |
|-------|-------|-----|
| Executive profile already exists | 第二次调用 `register` | 每个钱包只能有一个配置文件——已注册完毕 |
| Not the asset owner | 尝试从非所有者钱包委托 | 只有资产所有者才能委托执行 |
| Executive profile not found | 委托到未注册的钱包 | 执行者必须先运行 `agents executive register` |
| Delegation not found | 撤销不存在的委托 | 验证 Agent 资产和执行者地址 |

## 注意事项

- 执行者配置文件每个钱包只能有一个——重复注册将失败
- 每个委托是针对单个资产的：一个执行者可被委托多个 Agent，但每个都需要单独调用 `delegate`
- 不带 `--executive` 撤销时，命令默认使用当前签名者（执行者撤销自身委托时）
- 关闭委托记录退还的租金将发送到 `--destination` 钱包（默认为签名者）

## FAQ

**什么是执行者配置文件？**
钱包的一次性链上 PDA，使该钱包能够接收来自已注册 Agent 的执行委托。

**一个钱包可以有多个执行者配置文件吗？**
不可以。每个钱包只能有一个执行者配置文件。注册是一次性操作。

**谁可以撤销委托？**
资产所有者或执行者授权方均可撤销委托。执行者撤销时，可以省略 `--executive`（默认为当前签名者）。
