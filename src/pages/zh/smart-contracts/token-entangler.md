---
title: 代币纠缠器
metaTitle: 代币纠缠器 | 开发者中心
description: Metaplex 已弃用的代币纠缠器程序文档。
---

# 概述

{% callout type="warning" %}

请注意,该程序已被标记为已弃用,不再由 Metaplex 基金会团队积极维护。不保证新功能、安全修复和向后兼容性。请谨慎使用。

{% /callout %}

## 简介

Metaplex 的代币纠缠器程序直接来自量子力学!它使您能够将两个 NFT 纠缠在一起,并使其一次只能有一个存在于外部(并且始终可以与纠缠的 NFT 交换)。这可能对通过用新的非地毯拉集替换所有地毯拉的 NFT 来**"去除地毯拉"**项目很有用。这也是代币纠缠器创建的原因:在 Degen Ape Academy 的错误铸造后帮助 Exiled Apes 社区。您可以在流亡猿网站上找到更多关于背景故事的信息。

该程序背后的想法是,最初铸造的具有损坏元数据的 NFT 可以交换为包含正确元数据的新 NFT。它也可以用于去除项目的地毯拉或更有创意的用例。

这些交换可以随时来回进行,即使当前不在托管中的 NFT 被出售给不同的钱包,新钱包也将能够再次将其交换回来。

## 机会

代币纠缠器程序非常简单。它接受 NFT A 并返回已在代币纠缠器创建时分配给 NFT A 的 NFT B。尽管如此,还是有一些机会可能对您有兴趣:

- **来回交换**: 如果用户将 NFT A 交换为 NFT B,他们始终可以再次反转该交换。
- **交换费用**: 您可以引入交换费用,该费用在每次交换代币时支付或每个 NFT 对仅支付一次。
- **SPL 代币费用**: 交换费用可以用 SPL 代币或 SOL 支付。

## 它是如何工作的

面向用户的过程很简单。他们用 NFT A 和(如果配置了 SOL 或 SPL 代币)向代币纠缠器支付,并接收纠缠的铸造 B:

![显示一般代币纠缠器过程的图像。它显示了一个钱包和代币纠缠器程序作为一个框。这些框用两个箭头连接。一个从钱包到纠缠器,注释为"NFT A + SOL",另一个从纠缠器到钱包,注释为"NFT B"](https://github.com/metaplex-foundation/docs/blob/main/static/assets/programs/token-entangler/Token-Entangler-Overview-Process.png?raw=true)

这是一个非常简化的图片,仅显示面向用户的过程。此图像中未显示其他账户等。

## 创建您自己的!

从一般角度来看,从开始到结束如下所示:

1. 铸造新代币
2. 纠缠旧的和新的 NFT
3. 托管面向客户的网站。有一个[示例 UI 实现](https://github.com/metaplex-foundation/token-entangler-ui)
4. 让您的用户交换他们的 NFT!

## 更多信息

有关代币纠缠器程序的更多一般信息可以在文档中找到:

- 入门
- 账户
- 指令
- CLI
- 常见问题
- 更新日志

如果您想使用代币纠缠器,您可以使用例如

- [JS CLI](https://github.com/metaplex-foundation/deprecated-clis/blob/main/src/token-entangler-cli.ts)
- [代币纠缠器 UI](https://github.com/metaplex-foundation/token-entangler-ui)

如果您想查看代币纠缠器代码,也可以随时查看 [GitHub 仓库](https://github.com/metaplex-foundation/metaplex-program-library/tree/master/token-entangler/)。
