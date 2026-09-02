---
title: 注资与回收
metaTitle: 为 MPL-Distro 代币分发注资并回收
description: 存入分发代币、为领取收据补贴注资，并回收未使用的 MPL-Distro 余额。
keywords:
  - fund MPL-Distro
  - withdraw unclaimed tokens
  - claim receipt subsidy
  - token distribution vault
about:
  - MPL-Distro
  - Distribution Funding
  - Fund Recovery
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '08-25-2026'
updated: '08-26-2026'
howToSteps:
  - 计算并存入完整代币分配。
  - 可选地为收据租金补贴向分发 PDA 注资。
  - 在领取期间监控代币和 SOL 余额。
  - 在活动窗口外回收未使用的代币和补贴 SOL。
howToTools:
  - MPL-Distro JavaScript SDK 0.4.x
  - Umi
faqs:
  - q: 领取处于活动状态时，权限方可以提取代币吗？
    a: 不可以。代币提取从开始时间戳到结束时间戳（含两端）都会被拒绝。
  - q: subsidizeReceipts 报销哪些费用？
    a: 它只报销领取收据租金，不包括协议费、交易费或接收方代币账户租金。
  - q: 领取开始后还可以再存入代币吗？
    a: 可以。存款不受时间限制，因此权限方可以补充资金不足的金库。
  - q: 国库钱包能否在没有分发权限方的情况下存款？
    a: 不可以。即使由单独的存款人提供代币，当前权限方也必须签署 deposit。
---

[MPL-Distro](/zh/smart-contracts/mpl-distro) 将分发金库中的代币资金与领取收据租金的可选 SOL 资金分开。 {% .lead %}

## 摘要

权限方将 SPL 代币存入分发的 associated token account，并在启用收据补贴时可以向分发 PDA 存入 SOL。

- 存入足够的代币基本单位以覆盖每笔 Merkle 分配。
- 为每次预期成功领取预算一次领取收据租金。
- 同时监控记录的 `totalAmount` 和实际金库代币余额。
- 仅在分发非活动时提取未领取代币和未使用的补贴 SOL。

## 快速开始

MPL-Distro 注资与回收遵循四个运营步骤。

1. 将所有分配量求和，并存入那么多代币基本单位。
2. 启用收据补贴时，将预期收据租金预算转入分发 PDA。
3. 监控实际金库余额、分发 SOL 和领取合计。
4. 窗口结束后，提取未领取代币和未使用的补贴 SOL。

## 存入分发代币

`deposit` 指令将代币从存款人账户转入分发 PDA 的规范 associated token account。即使由不同钱包提供代币，当前分发权限方也必须签署每一笔存款。

{% code-tabs-imported from="mpl-distro/fund_distribution" frameworks="umi" filename="fundDistribution" /%}

SDK 将 `depositor`、`payer` 和 `authority` 默认为 Umi 支付方，并推导两个 associated token account。当另一个钱包拥有源代币时，传入单独的存款人签名者，并仍传入当前分发权限方。

{% code-tabs-imported from="mpl-distro/deposit_from_separate_wallet" frameworks="umi" filename="depositFromSeparateWallet" /%}

程序在每次存款后增加 `totalAmount`。它不会将该值与 Merkle 根提交的分配之和比较。

## 计算代币存款

所需代币存款是以 mint 基本单位表示的所有分配量之和。

{% code-tabs-imported from="mpl-distro/calculate_deposit" frameworks="umi" filename="calculateDeposit" /%}

仅当权限方接受稍后必须回收超额部分时，才存入有意的缓冲。当记录余额低于其分配时，有效证明会以 `InsufficientFunds` 失败；如果实际金库余额更低，SPL 转账也可能失败。

## 为领取收据补贴注资

收据补贴让分发 PDA 能够向交易支付方报销创建每张领取收据所用的租金。

在 `createDistribution` 期间启用 `subsidizeReceipts`，通过 RPC 计算租金，并将 SOL 直接转入分发 PDA。

{% code-tabs-imported from="mpl-distro/fund_receipt_subsidy" frameworks="umi" filename="fundReceiptSubsidy" /%}

{% callout title="补贴预算边界" type="warning" %}
分发必须保留其自身的 rent-exempt 最低额。当剩余 SOL 无法同时覆盖分发租金和一次收据报销时，领取会以 `InsufficientFundsToSubsidizeReceipts` 失败。
{% /callout %}

## MPL-Distro 注资快速参考

领取成本分为固定协议费、Solana 交易成本和账户租金。

| 成本 | 默认支付方 | 收据补贴是否覆盖 |
|---|---|---|
| 协议费（{% fee product="mpl-distro" config="claim" fee="protocolFee" /%}） | 领取交易支付方 | 否 |
| 交易费 | 领取交易支付方 | 否 |
| 领取收据租金 | 领取交易支付方 | 是（启用且已注资时） |
| 接收方 ATA 租金 | 领取交易支付方 | 否 |

## 回收未领取代币

分发权限方在开始时间之前或结束时间之后用 `withdraw` 回收未领取或超额代币。

{% code-tabs-imported from="mpl-distro/recover_funds" frameworks="umi" filename="recoverFunds" /%}

活动区间是包含性的。当 `startTime <= clusterTime <= endTime` 时提取会被拒绝。

## 回收未使用的补贴 SOL

仅当补贴已启用且分发非活动时，权限方才用 `withdrawSubsidy` 回收未使用的收据补贴。

`withdrawSubsidy` 在转出请求的 lamport 金额的同时保留分发账户的 rent-exempt 最低额。请根据当前账户余额确定安全金额，而不是假设每次预期领取都已发生。

## 监控分发余额

生产系统应比较程序账本与实际 SPL 和 SOL 账户余额。

| 值 | 来源 | 含义 |
|---|---|---|
| `distribution.totalAmount` | 分发账户 | 程序记录的存款减去提取；领取不会递减它 |
| Vault token amount | 分发 associated token account | 实际可转移的代币 |
| Distribution lamports | 分发 PDA 账户 | 租金储备加上可选的未使用收据补贴 |
| `claimCount` | 分发账户 | 记录的成功领取次数 |
| `claimAmount` | 分发账户 | 记录的已领取代币基本单位之和 |

代币提取账本使用 saturating subtraction，因此集成方不应假设 `totalAmount` 永远不会与 SPL 金库余额偏离。

## 注意事项

资金操作需要权限方控制和显式余额监控。

- 只有当前分发权限方可以授权存款。
- 存款允许在领取窗口之前、期间和之后进行。
- 代币和补贴提取在整个活动窗口期间被阻止。
- 任何人都可以直接向分发 PDA 转 SOL，但只有权限方可以通过程序提取补贴。
- 领取收据目前无法关闭，因此收据租金保持已分配。

## 常见问题

### 领取处于活动状态时，权限方可以提取代币吗？

不可以。代币提取从开始时间戳到结束时间戳（含两端）都会被拒绝。

### subsidizeReceipts 报销哪些费用？

它只报销领取收据租金，不包括协议费、交易费或接收方代币账户租金。

### 领取开始后还可以再存入代币吗？

可以。存款不受时间限制，因此权限方可以补充资金不足的金库。

### 国库钱包能否在没有分发权限方的情况下存款？

不可以。即使由单独的存款人提供代币，当前权限方也必须签署 `deposit`。
