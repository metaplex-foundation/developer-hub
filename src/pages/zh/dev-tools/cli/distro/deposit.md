---
title: 存入
metaTitle: 向 MPL-Distro 存入 | Metaplex CLI
description: 使用 mplx distro deposit 将 SPL 代币存入 MPL-Distro 金库。
keywords:
  - mplx distro deposit
  - fund token distribution
  - MPL-Distro CLI
  - Metaplex CLI
about:
  - MPL-Distro
  - Metaplex CLI
  - token distribution
proficiencyLevel: Intermediate
programmingLanguage:
  - Bash
created: '08-27-2026'
updated: '08-27-2026'
howToSteps:
  - 传入 distro create 打印的分发地址
  - 选择 mint decimals 的 --amount 或最小单位的 --basisAmount
  - 在命令输出中确认新的金库总额
howToTools:
  - Metaplex CLI (mplx)
faqs:
  - q: 存入是否必须在领取窗口处于活动状态时进行？
    a: 不必。存款在领取窗口之前、期间和之后都允许。
  - q: --amount 和 --basisAmount 有什么区别？
    a: --amount 是使用 mint decimals 的小数（1.0 为一枚代币）。--basisAmount 是原始最小单位（decimals 为 6 时 1_000_000 为一枚代币）。
---

{% callout title="你将完成的操作" %}
将 SPL 代币从钱包转入 [MPL-Distro](/zh/smart-contracts/mpl-distro) 金库：
- 使用人类可读数量或原始最小单位存入
- 确认分发上的新 `totalAmount`
{% /callout %}

## 摘要

`mplx distro deposit` 命令将代币从当前 identity 的 associated token account 转入分发金库。

- **必需参数**：分发公钥
- **必需标志**：`--amount` 或 `--basisAmount`（互斥）
- **存款不受时间限制**：领取窗口不必处于活动状态

identity 必须持有足够代币。命令会获取 mint decimals 以转换 `--amount`。

**跳转至：** [基本用法](#基本用法) · [选项](#选项) · [示例](#示例) · [输出](#输出) · [常见错误](#常见错误) · [常见问题](#常见问题)

## 基本用法

传入分发地址和一个数量标志。

```bash {% title="存入 1.0 代币" %}
mplx distro deposit <DISTRIBUTION> --amount 1.0
```

```bash {% title="存入 1,000,000 最小单位" %}
mplx distro deposit <DISTRIBUTION> --basisAmount 1000000
```

## 选项

必须恰好设置 `--amount` 或 `--basisAmount` 之一。

| 标志 | 简写 | 说明 | 必需 |
|------|-------|-------------|----------|
| `--amount <number>` | `-a` | 使用 mint decimals 的人类可读数量 | 二者之一 |
| `--basisAmount <integer>` | `-b` | 代币最小单位数量 | 二者之一 |

对于 6 位小数的 mint，`--amount 1.0` 与 `--basisAmount 1000000` 存入相同数量。

## 示例

在 [`distro create`](/zh/dev-tools/cli/distro/create) 之后存入：

```bash {% title="为新分发注资" %}
mplx distro deposit <DISTRIBUTION> --amount 1.0
```

## 输出

成功时，命令打印小数和最小单位数量。

```text {% title="预期输出" %}
Deposited 1 tokens (1000000 basis) to distribution
Distribution: <DISTRIBUTION>
Mint: <TOKEN_MINT>
Amount deposited: 1 tokens (1000000 basis)
New total deposited: 1 tokens (1000000 basis)

Transaction: <SIGNATURE>
```

用此输出查看带 decimals 的总额。在可以获取 mint 时，[`distro fetch`](/zh/dev-tools/cli/distro/fetch) 会打印相同的代币数量。

## 常见错误

这些失败发生在无法为金库注资时。

| 错误 | 原因 | 解决方法 |
|-------|-------|-----|
| Either `--amount` or `--basisAmount` must be provided | 未设置任一数量标志 | 传入两个标志之一 |
| Insufficient balance | identity ATA 代币少于请求数量 | 先铸造或转入代币 |
| You do not have a token account for this mint | 没有此 mint 的 ATA | 先接收或铸造该代币 |
| `InvalidPublicKeyError` | 分发参数不是 base58 公钥 | 传入 `distro create` 打印的 PDA |
| Distribution not found | PDA 或集群错误 | 在同一 RPC 上运行 `distro fetch` |

## 注意事项

deposit 不会检查金库是否覆盖 Merkle 分配总和。

- 在领取开始前至少存入树中每个 `amount` 的总和。见 [注资与回收](/zh/smart-contracts/mpl-distro/funding-and-recovery)。
- 存款在领取窗口之前、期间和之后都允许。
- 用 [`toolbox token create`](/zh/dev-tools/cli/toolbox/token-create) 创建代币 mint，用 [`toolbox token mint`](/zh/dev-tools/cli/toolbox/token-mint) 增加供应（`mint` 数量为原始最小单位）。

## 常见问题

**存入是否必须在领取窗口处于活动状态时进行？**
不必。存款在领取窗口之前、期间和之后都允许。

**--amount 和 --basisAmount 有什么区别？**
`--amount` 是使用 mint decimals 的小数（`1.0` 为一枚代币）。`--basisAmount` 是原始最小单位（decimals 为 6 时 `1000000` 为一枚代币）。
