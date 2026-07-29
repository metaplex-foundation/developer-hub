---
title: Nori 定价与计费
metaTitle: Nori 定价与计费 - 费率卡、成功后计费、硬停止 | Metaplex
description: Nori 如何为服务调用定价和计费 - 发布在 GET /rate-card 的费率卡、扣费时的美元到 SOL 转换、成功后计费核算、价格变更通知政策，以及取消委托和钱包余额耗尽时的硬停止语义。
keywords:
  - Nori rate card
  - Nori pricing
  - charge-on-success
  - price-change notice
  - hard stop
  - wallet empty
  - undelegate
  - agent billing
  - pay-per-call
about:
  - Nori
  - Agent Commerce
  - Solana
  - Metaplex
proficiencyLevel: Intermediate
created: '07-08-2026'
updated: '07-08-2026'
faqs:
  - q: 如果 Nori 调用失败，我会被扣费吗？
    a: 不会。Nori 先运行上游调用，只在成功时扣费。失败的上游调用返回错误且不扣费。在 x402 轨道上，结果只计算一次并被缓存，因此付费重试返回的是缓存结果，永远不会重新运行或重复计费。
  - q: Nori 如何将美元价格转换为 SOL？
    a: 费率卡以美元计价。在扣费时，Nori 使用来自 Jupiter 价格 API 的实时 SOL/USD 现货价格（缓存 30 秒）重新计算 SOL 金额。因此实际扣除的 lamports 跟随调用时刻的市场汇率。
  - q: Nori 在价格变更前会提前多久通知？
    a: 费率卡带有一个包含 notice_period_days（默认 7）的政策块。涨价在提交时其 effective_at 时间戳至少要在通知期之后，且 effective_at 之前的扣费继续按先前发布的价格执行。变更历史可在政策的 notice_url 查看。
  - q: 我的 Agent 钱包里的 SOL 用完了会怎样？
    a: 硬停止。当 PDA 无法覆盖一笔扣费时，delegate-pay 扣费失败，该调用回退为 HTTP 402 x402 质询 — 服务不会以赊账方式提供。一旦您为 PDA 充值，调用即可恢复。
  - q: 如果我在使用过程中取消对 Nori 的委托会怎样？
    a: 下一次扣费尝试会在链上失败，Nori 作废其缓存的委托状态，delegate-pay 轨道硬停止。后续调用会收到 x402 支付质询。撤销之后不会有任何扣费，因为链会拒绝该 Execute 交易。
  - q: 我在哪里可以核验 Nori 向我的 Agent 扣了多少费？
    a: 每笔扣费都是一笔从您 Agent 的 PDA 到 Nori 服务 PDA 的 SOL 转账，并附带一条携带结构化收据的 Memo 指令。您 Agent 的链上交易历史就是完整的、可独立审计的计费记录。
---

Nori 依据一份公开发布、带版本号的费率卡以美元为每次调用定价，在扣费时刻转换为 SOL，且只在成功时计费 — 失败的上游调用永不扣费。价格变更遵循通知期政策，当调用方取消委托或其钱包无法覆盖一笔扣费时，计费会立即硬停止。{% .lead %}

## 概述

Nori 的计费模型被设计为可从外部审计：公开的价格、链上收据、没有服务就没有扣费。

- **费率卡** — `GET /rate-card` 提供完整的美元价目表，包括版本号、`effective_at`、加价系数和价格变更政策
- **成功后计费（charge-on-success）** — 先运行上游调用；失败返回错误且不扣费，x402 的付费重试返回缓存结果而非重新运行调用
- **价格变更通知** — 涨价提交时其 `effective_at` 至少在 `notice_period_days`（默认 7）之后；此前的扣费维持先前发布的价格
- **硬停止（hard stop）** — 取消委托和钱包余额耗尽都会立即停止 delegate-pay 计费；调用回退为 x402 质询，而不是累积债务

## Nori 费率卡

`GET /rate-card` 是规范的、机器可读的价目表 — 请始终查询它，而不要依赖文档中的任何快照。它提供完整的价目表及政策元数据，缓存 5 分钟：

```json {% title="GET /rate-card（节选）" %}
{
  "version": 1,
  "effective_at": "2026-05-21T00:00:00.000Z",
  "policy": {
    "notice_period_days": 7,
    "notice_url": "https://github.com/metaplex-foundation/agent-plumber/blob/main/packages/shared/src/pricebook.json",
    "description": "Price changes are announced by editing this file..."
  },
  "markup_factor": 1.25,
  "llm": {
    "anthropic/claude-sonnet-4-6": {
      "inputPerMillion": 3.0,
      "outputPerMillion": 15.0,
      "cachedInputPerMillion": 0.3
    }
  },
  "image": { "openai/gpt-image-1": { "perImage": 0.04 } },
  "rpc": { "default": { "perCall": 0.0001 } }
}
```

### 费率卡字段结构

| 字段 | 含义 |
|-------|---------|
| `version` | 单调递增的卡片版本号；每次价格变更时递增 |
| `effective_at` | 此卡片价格生效的 ISO 时间戳 |
| `policy.notice_period_days` | 提交一次涨价与其 `effective_at` 之间的最少天数（默认 7） |
| `policy.notice_url` | 卡片（及其变更历史）的发布位置 |
| `markup_factor` | 在扣费时对批发美元价格统一施加的零售加价系数（1.25×） |
| `llm.<provider/model>` | 每百万输入 / 输出 / 缓存输入 token 的批发美元价格 |
| `image.<provider/model>` | 每张生成图像的批发美元价格 |
| `rpc.default` | 每次 RPC 或 DAS 调用的批发美元价格 |

列出的价格是**批发价**；实际扣费金额为 `批发价 × markup_factor`。`GET /v1/models` 从同一数据源为 OpenAI-SDK 客户端枚举可用的 LLM 模型 ID。

### 单笔扣费如何定价

每项服务根据费率卡计算出美元成本，然后在扣费时转换为 SOL。

1. 服务处理器返回结果加 `costUsd` — `chat.completion` 按 token 数 × 每百万价格计算，`image.generation` 按每张图像计算，`solana.rpc` 按每次调用计算
2. 对批发成本施加加价系数（1.25×）
3. 美元金额使用来自 Jupiter 价格 API 的实时 SOL/USD 现货价格（30 秒缓存）转换为 lamports
4. 扣费以一笔从您 Agent 的 PDA 到 Nori 服务 PDA 的 SOL 转账落地，并附带 Memo 收据

{% callout type="note" title="每笔扣费都附带链上收据" %}
每笔扣费交易上的 Memo 指令编码了一份结构化收据（服务、请求和成本详情）。您的 Agent 与 Nori 服务 PDA 之间的交易历史就是一份完整的、可独立审计的计费记录 — 无需信任 Nori 的链下账目。
{% /callout %}

## 成功后计费核算

Nori 永远不会为未成功提供的调用扣费。在两条支付轨道上，顺序都是先上游、后扣费：

- **Delegate-pay 轨道** — Nori 运行上游调用（LLM、图像、RPC）；如果成功，Nori 向 PDA 扣费并返回结果。如果上游调用失败，调用方收到错误响应且不扣费。
- **x402 轨道** — 第一次请求（付款前）会运行上游调用，并以支付质询为键缓存结果。402 响应报出的正是已计算完成的结果的准确成本。当调用方付款并重试时，Nori 返回**缓存的**结果 — 上游调用永远不会重新运行，因此永远不会重复计费，报价即结算价。

值得注意的是相反方向的失败情形：在 delegate-pay 轨道上，如果上游调用成功但扣费本身失败（委托被撤销、钱包为空），调用方可能免费获得那一次结果，随后该轨道[硬停止](#硬停止语义)。Nori 承担这一次调用的损失，而不是预先扣押资金。

## 价格变更通知政策

价格变更通过费率卡本身提前公布 — 在 delegate-pay 轨道上不存在悄然涨价。政策嵌入在卡片的 `policy` 块中：

1. 价格变更通过提交一张 `version` 递增且 `effective_at` 在未来的新卡片来发布
2. 对于涨价，`effective_at` 必须至少在提交后 `notice_period_days`（默认 **7 天**）之后
3. `effective_at` 之前的扣费继续按先前发布的价格执行
4. 完整的变更历史公开在 `policy.notice_url`

接受是在委托时隐式完成的：通过委托，Agent 即接受已发布的卡片及其通知政策。如果某项已发布的变更不可接受，请在 `effective_at` 之前[撤销委托](/agents/nori/delegate-to-nori#从-nori-撤销委托) — 撤销是立即硬停止的，因此不会有任何按您未接受的价格执行的扣费落地。

要以编程方式监控变更，可轮询 `GET /rate-card`（缓存 5 分钟），并在 `version` 递增或 `effective_at` 变动时告警。

## 硬停止语义

有两种情况会立即停止 delegate-pay 计费，且是由机制而非政策保证的：链会拒绝扣费，因此不可能累积债务。

### 取消委托时的硬停止

撤销执行委托会在链的层面终止 Nori 的扣费权限。下一次扣费尝试会以 `Neither the asset or any plugins have approved this operation` 失败，Nori 清除该资产的委托状态缓存，后续调用落入 x402 轨道 — 调用方收到 HTTP 402 支付质询，而不是被自动扣费。由于委托状态最多缓存 5 分钟，撤销后紧接着的一次进行中调用可能仍会尝试（并失败）一次委托扣费；强制停止的是链上检查，因此撤销之后不可能有任何扣费。

### 钱包余额耗尽时的硬停止

当 Agent 的 PDA 无法覆盖一笔扣费时，委托扣费失败，该调用不会以赊账方式提供。调用方会收到 x402 质询（HTTP 402），可以直接为该次调用付款，或为 PDA 充值以恢复 delegate-pay。Nori 不提供任何信用额度 — 资金不足的 Agent 会降级为按次付费加质询的模式，而不会累积债务。

{% callout type="note" title="保持 PDA 高于免租金下限" %}
PDA 需要保持在系统免租金最低余额（890,880 lamports）之上，从它转出的交易才能成功。工作余额的预算公式为：`预期调用数 × 典型扣费金额 + 免租金下限`。Agent 模板正是出于这个原因为新委托预置 0.002 SOL。
{% /callout %}

在运维上，将这两种硬停止都视为您 Agent 中的监控信号：先前走 delegate-pay 的调用突然从 200 响应变为 402 质询，意味着委托已不存在或钱包已空。

## 快速参考

| 项目 | 值 |
|------|-------|
| 费率卡端点 | `GET /rate-card`（5 分钟缓存） |
| 模型目录 | `GET /v1/models` |
| 计价方式 | 美元定价，以 SOL 结算（Jupiter 现货价，30 秒缓存） |
| 加价 | 批发价的 1.25×，统一适用 |
| 通知期 | 7 天（`policy.notice_period_days`） |
| 计费规则 | 成功后计费；x402 重试返回缓存结果 |
| 取消委托 | 立即硬停止 → 回退到 x402 |
| 钱包余额耗尽 | 立即硬停止 → x402 质询，直到充值 |
| 收据 | 每笔扣费交易上的 Memo 指令 |

## 注意事项

- [源代码仓库](https://github.com/metaplex-foundation/agent-plumber)中捆绑的价目表是发布时公开标价的快照；线上实例的 `GET /rate-card` 才是有效的价目表
- 费率卡上的价格是批发价 — 乘以 `markup_factor` 才是实际扣费金额
- 同一次调用实际扣除的 lamports 会随扣费时刻的 SOL/USD 汇率变化；卡片固定的是美元金额
- 硬停止适用于 delegate-pay 轨道；x402 轨道本质上是按次预付的，不存在等价的失败模式
- 将 Nori 作为参考实现进行分叉的运营者直接编辑 `packages/shared/src/pricebook.json`，并应遵守同样的 `effective_at` 通知纪律

由 Metaplex Foundation 维护。最后验证日期：2026-07-08。[在 GitHub 上查看源码](https://github.com/metaplex-foundation/agent-plumber)。

## FAQ

关于 Nori 定价与计费的常见问题。

### 如果 Nori 调用失败，我会被扣费吗？
不会。Nori 先运行上游调用，只在成功时扣费。失败的上游调用返回错误且不扣费。在 x402 轨道上，结果只计算一次并被缓存，因此付费重试返回的是缓存结果，永远不会重新运行或重复计费。

### Nori 如何将美元价格转换为 SOL？
费率卡以美元计价。在扣费时，Nori 使用来自 Jupiter 价格 API 的实时 SOL/USD 现货价格（缓存 30 秒）重新计算 SOL 金额。因此实际扣除的 lamports 跟随调用时刻的市场汇率。

### Nori 在价格变更前会提前多久通知？
费率卡带有一个包含 `notice_period_days`（默认 7）的 `policy` 块。涨价在提交时其 `effective_at` 时间戳至少要在通知期之后，且 `effective_at` 之前的扣费继续按先前发布的价格执行。变更历史可在政策的 `notice_url` 查看。

### 我的 Agent 钱包里的 SOL 用完了会怎样？
硬停止。当 PDA 无法覆盖一笔扣费时，delegate-pay 扣费失败，该调用回退为 HTTP 402 x402 质询 — 服务不会以赊账方式提供。一旦您为 PDA 充值，调用即可恢复。

### 如果我在使用过程中取消对 Nori 的委托会怎样？
下一次扣费尝试会在链上失败，Nori 作废其缓存的委托状态，delegate-pay 轨道硬停止。后续调用会收到 x402 支付质询。撤销之后不会有任何扣费，因为链会拒绝该 Execute 交易。

### 我在哪里可以核验 Nori 向我的 Agent 扣了多少费？
每笔扣费都是一笔从您 Agent 的 PDA 到 Nori 服务 PDA 的 SOL 转账，并附带一条携带结构化收据的 Memo 指令。您 Agent 的链上交易历史就是完整的、可独立审计的计费记录。
