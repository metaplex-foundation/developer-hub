---
title: 常见问题
metaTitle: 常见问题 | Inscription
description: 关于Metaplex Inscriptions的常见问题
---

## Inscriptions的意义是什么？

与普遍认知相反，Inscriptions可以用于的事情远不止让验证者头疼。在链上写入任意数据的能力对Solana程序集成有巨大好处。最初，主要用例将是NFT，提供一种在Solana上存储所有NFT数据的方式。这将启用许多用例，如程序的链上基于特征的门控、一种在不编写自定义程序的情况下存储额外NFT元数据的方式（例如游戏统计块、NFT历史、额外信息等），以及直接在Solana程序中生成动态图像。

## 我在哪里铭刻？

- [Metaplex Inscription UI](https://inscriptions.metaplex.com)是一个无代码参考实现，用于在Solana上铭刻现有NFT。此UI允许创作者查看他们拥有更新权限的所有NFT，并引导他们完成Inscription流程以在Solana上存储NFT JSON和图像。

  {% callout type="note" %}

  由于浏览器钱包的限制，不建议使用UI进行批量铭刻。请改用CLI，以节省数百次交易批准。

  {% /callout %}

- [Inscription CLI](https://github.com/metaplex-foundation/mpl-inscription/tree/main/clients/cli)是一个命令行工具，用于处理NFT的批量铭刻。

## 费用是多少？

Inscription成本基本上归结为账户租金的0.003306 SOL开销加上实际铭刻数据每字节0.00000696 SOL。有几个工具可以更容易地计算此成本：

- [Inscription计算器](https://www.sackerberg.dev/tools/inscriptionCalculator)允许您输入图像和JSON大小以计算总成本。
- Inscription UI包含高级压缩套件，允许您动态调整大小和压缩每个NFT以衡量质量与成本的权衡。
- Inscription CLI包含测量批量铭刻总成本的工具。

## 如何铭刻新NFT？

新NFT可以通过首先通过创建工具铸造（推荐工具是[Truffle](https://truffle.wtf/)和[Sol Tools](https://sol-tools.io/)）来铭刻。铸造后，这些新NFT现在将在Inscription UI和CLI工具中列出。
