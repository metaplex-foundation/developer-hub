---
title: 在 Solana 上发行代币
metaTitle: 在 Solana 上发行代币 — Genesis 公平发行指南 | Metaplex
description: 使用 Genesis Launch Pool 在 Solana 上发行 SPL 代币的 TypeScript 分步指南。公平的链上代币分发，价格发现过程透明。
cli: /dev-tools/cli/genesis/launch
---

使用 [Genesis](/zh/smart-contracts/genesis) Launch Pool 在 Solana 上发行 SPL 代币。本指南将带您完成一次公平发行：用户在一个时间窗口内存入 SOL，并按其在总存款中的份额比例获得代币——全部过程在链上透明完成。 {% .lead %}

{% callout type="note" title="无代码选项" %}
不想编写代码？使用 [Metaplex 代币发射台](https://www.metaplex.com) 无需编码即可发行代币。本指南适用于希望构建自己的代币发行体验，或使用 Genesis SDK 在自己网站上托管代币销售的开发者。
{% /callout %}

{% callout type="note" title="其他发行方式" %}
本指南介绍的是 **Launch Pool** 公平发行方式，但 Genesis 还支持以固定价格出售代币的 **[预售](/zh/smart-contracts/genesis/presale)**。请查看 [Genesis 概述](/zh/smart-contracts/genesis)比较各种方式，选择最适合您项目的方法。
{% /callout %}

## 概述

Genesis 是一个 Solana 代币发射台，提供公平的链上代币发行机制。与以固定价格出售代币的中心化代币销售平台不同，Launch Pool 由市场决定代币分发——每位参与者按其存款比例获得代币，从而确保代币生成事件（TGE）公平透明。所有 SPL 代币的创建、募资和分发都在链上完成，没有中间方。

Launch Pool 代币发行分为三个阶段：

1. **设置**（您运行一次）- 创建代币、配置发行并激活
2. **存款期**（用户参与）- 用户在您配置的时间窗口内存入 SOL
3. **发行后**（您和用户）- 推动状态机运转（crank），用户领取代币，您撤销权限

本指南将带您创建**四个独立的脚本**，在不同阶段分别运行：

| 脚本 | 运行时机 | 用途 |
|--------|-------------|---------|
| `launch.ts` | 开始时运行一次 | 创建代币并激活发行 |
| `crank.ts` | 存款结束后 | 触发条件和行为，将 SOL 移至您的解锁桶 |
| `claim.ts` | crank 之后 | 用户运行此脚本领取代币 |
| `revoke.ts` | 发行完成时 | 永久移除铸币/冻结权限 |

## 前提条件

创建新项目并安装依赖：

```bash
mkdir my-token-launch
cd my-token-launch
npm init -y
npm install @metaplex-foundation/genesis @metaplex-foundation/umi @metaplex-foundation/umi-bundle-defaults @metaplex-foundation/mpl-toolbox
```

## 完整的发行脚本

下面是一个完整、可运行的脚本，每个部分都有注释说明其作用。您只需运行此脚本**一次**来设置发行。

{% callout type="warning" title="需要密钥对" %}
您需要在机器上有 Solana 密钥对文件来签署交易。这通常是位于 `~/.config/solana/id.json` 的 Solana CLI 钱包。请更新脚本中的 `walletFile` 路径以指向您的密钥对文件，并确保此钱包有用于支付交易费用的 SOL。
{% /callout %}

创建名为 `launch.ts` 的文件：

{% code-tabs-imported from="genesis/launch_token_launch" frameworks="umi" filename="launch" /%}

运行脚本：

```bash
npx ts-node launch.ts
```

**请保存打印出的地址！** 后续步骤需要用到它们。

## 接下来会发生什么

运行发行脚本后，您的发行就上线了。以下是每个阶段会发生的事情：

### 存款期间

用户通过您的前端或直接使用 SDK 存入 SOL。每次存款：
- 会收取一定费用
- 通过存款 PDA 跟踪
- 可以部分或全部提取（需支付费用）

### 存款结束后

存款期结束后，运行 `triggerBehaviorsV2` 以执行桶上配置的结束行为——在本例中，将收集的 SOL 移至解锁桶。创建名为 `crank.ts` 的文件：

{% code-tabs-imported from="genesis/launch_token_crank" frameworks="umi" filename="crank" /%}

在存款期结束后运行：

```bash
npx ts-node crank.ts
```

### 用户领取代币

crank 完成后，用户即可领取代币。每个用户按其在总存款中的份额比例获得代币：

```
userTokens = (userDeposit / totalDeposits) * totalTokenSupply
```

用户可以通过您的前端领取，也可以使用此脚本（创建 `claim.ts`）：

{% code-tabs-imported from="genesis/launch_token_claim" frameworks="umi" filename="claim" /%}

### 最终化：撤销权限

发行完成后，撤销铸币和冻结权限。这向持有者表明不会再铸造任何额外代币。

{% callout type="warning" %}
**此操作不可逆。** 一旦撤销，您将无法再铸造更多代币或冻结账户。只有在确定发行已完成后才执行此操作。
{% /callout %}

创建 `revoke.ts`：

{% code-tabs-imported from="genesis/launch_token_revoke" frameworks="umi" filename="revoke" /%}

## 后续步骤

- [Genesis 概述](/zh/smart-contracts/genesis) - 了解有关 Solana 代币发射台的更多信息
- [Launch Pool](/zh/smart-contracts/genesis/launch-pool) - 公平发行详细文档
- [预售](/zh/smart-contracts/genesis/presale) - 以固定价格进行代币预售
- [Metaplex API](/zh/api) - 通过 API 查询发行和代币销售数据
