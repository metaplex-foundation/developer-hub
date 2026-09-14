---
title: 提取
metaTitle: 从 MPL-Distro 提取 | Metaplex CLI
description: 在领取窗口非活动时，使用 mplx distro withdraw 提取未领取的 MPL-Distro 代币。
keywords:
  - mplx distro withdraw
  - recover unclaimed tokens
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
  - 确认分发处于 Not Started 或 Ended
  - 以分发权限方传入 --amount 或 --basisAmount
  - 可选设置 --recipient 将代币发送到另一个钱包
howToTools:
  - Metaplex CLI (mplx)
faqs:
  - q: distro withdraw 何时成功？
    a: 权限方可在 startTime 之前或 endTime 之后提取。领取窗口处于活动状态时，程序会拒绝提取。
  - q: 谁可以提取？
    a: 仅分发权限方。CLI identity 必须与链上权限方匹配。
---

{% callout title="你将完成的操作" %}
从金库回收 [MPL-Distro](/zh/smart-contracts/mpl-distro) 代币：
- 在领取窗口非活动时以分发权限方提取
- 将代币发送给权限方或 `--recipient`
{% /callout %}

## 摘要

`mplx distro withdraw` 命令将未领取代币从分发金库转到接收方 associated token account。

- **必需参数**：分发公钥
- **必需标志**：`--amount` 或 `--basisAmount`（互斥）
- **签名者**：链上分发权限方
- **窗口**：仅当集群时间早于 `startTime` 或晚于 `endTime` 时成功

可用余额为 `totalAmount - claimAmount`。见 [注资与回收](/zh/smart-contracts/mpl-distro/funding-and-recovery)。

**跳转至：** [基本用法](#基本用法) · [选项](#选项) · [示例](#示例) · [输出](#输出) · [常见错误](#常见错误) · [常见问题](#常见问题)

## 基本用法

提取到权限方钱包，或传入 `--recipient`。

```bash {% title="向权限方提取 0.5 代币" %}
mplx distro withdraw <DISTRIBUTION> --amount 0.5
```

```bash {% title="将最小单位提取到另一个钱包" %}
mplx distro withdraw <DISTRIBUTION> \
  --basisAmount 500000 \
  --recipient <WALLET>
```

## 选项

恰好需要一个数量标志。`--recipient` 默认为权限方。

| 标志 | 简写 | 说明 | 必需 |
|------|-------|-------------|----------|
| `--amount <number>` | `-a` | 使用 mint decimals 的人类可读数量 | 二者之一 |
| `--basisAmount <integer>` | `-b` | 代币最小单位数量 | 二者之一 |
| `--recipient <string>` | `-r` | 目标钱包（默认为权限方） | No |

对于 6 位小数的 mint，`--amount 0.5` 与 `--basisAmount 500000` 提取相同数量。

## 示例

窗口结束后回收剩余：

```bash {% title="回收剩余金库代币" %}
mplx distro withdraw <DISTRIBUTION> --amount 0.5
```

## 输出

成功时，命令打印提取数量和剩余可提取余额。

```text {% title="预期输出" %}
Withdrew 0.5 tokens (500000 basis) from distribution
Distribution: <DISTRIBUTION>
Mint: <TOKEN_MINT>
Amount withdrawn: 0.5 tokens (500000 basis)
Recipient: <WALLET>
Remaining available for withdrawal: 0.5 tokens (500000 basis)

Transaction: <SIGNATURE>
```

## 常见错误

这些失败发生在无法清空金库时。

| 错误 | 原因 | 解决方法 |
|-------|-------|-----|
| Only the distribution authority can withdraw | CLI identity 不是权限方 | 切换到权限方密钥对 |
| Insufficient available balance for withdrawal | 数量超过 `totalAmount - claimAmount` | 降低数量 |
| Distribution does not have a token account | 尚未存入 | 先存款，或跳过提取 |
| Withdrawal rejected during the active window | `startTime <= now <= endTime` | 等到开始之前或结束之后 |
| `InvalidPublicKeyError` | 分发参数不是 base58 公钥 | 传入 `distro create` 打印的 PDA |

CLI 不会预先检查时间窗口；程序返回拒绝。

## 注意事项

withdraw 回收的是代币，不是未使用的收据租金补贴。

- CLI 没有 `withdrawSubsidy` 命令。用 [JavaScript SDK](/zh/smart-contracts/mpl-distro/sdk/javascript) 回收补贴 SOL。
- 若需在领取开始前测试提取，请用未来的 `startTime` 创建分发。
- 已领取的代币无法提取。

## 常见问题

**distro withdraw 何时成功？**
权限方可在 `startTime` 之前或 `endTime` 之后提取。领取窗口处于活动状态时，程序会拒绝提取。

**谁可以提取？**
仅分发权限方。CLI identity 必须与链上权限方匹配。
