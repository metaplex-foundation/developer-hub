---
title: 概述
metaTitle: 概述 | 固定价格销售
description: 从主版 NFT 销售印刷品
---

{% callout type="warning" %}

请注意,该程序已被标记为已弃用,不再由 Metaplex 基金会团队积极维护。不保证新功能、安全修复和向后兼容性。请谨慎使用。

{% /callout %}

# 简介

Metaplex 的固定价格销售程序是一个 Solana 程序,供品牌创建可以分发给大量受众的会员 NFT。这种 NFT 可用于在未来日期控制对某些事物(游戏、活动、发布等)的访问。
如其名称所示,该程序中的所有 NFT 都以固定价格出售,通过从单个主版 NFT 铸造[印刷版](/token-metadata/print)来实现。因此,所有 NFT 将具有相同的元数据(除了版本号)。

固定价格销售程序还支持按集合控制。因此,创作者可以按集合 NFT 控制销售,这意味着只有链上集合的持有者才能购买 NFT。您还可以拥有销售的多个阶段:受控和不受控。例如,您可以创建总持续时间为 5 小时的市场,其中前 3 小时受控,因此只有持有者可以购买 NFT。

🔗 **有用的链接:**

- [GitHub 仓库](https://github.com/metaplex-foundation/metaplex-program-library/tree/master/fixed-price-sale)
- [自动生成的 API](https://www.npmjs.com/package/@metaplex-foundation/mpl-fixed-price-sale)
- [Rust Crate](https://crates.io/crates/mpl-fixed-price-sale)
