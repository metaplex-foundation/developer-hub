---
title: 读取 Solana 和 SVM 数据
metaTitle: 读取 Solana 和 SVM 数据 | Aura
description: 了解如何使用 Metaplex Aura 读取 Solana 和 SVM 数据。
---

Metaplex Aura 数据网络为开发者提供高效、可靠和准确的链上状态读取访问,适用于 Solana 和其他基于 SVM 的链,如 Eclipse。

索引器和 RPC 提供商在维护数据一致性和性能方面经常面临重大挑战。这是由于几个问题:

- **数据一致性**: Solana 节点经常失去同步,Geyser 插件可能会跳过更新,特别是在节点重新同步期间。这可能导致索引器提供的数据不一致。
- **不断上升的存储成本**: 随着数据量的持续增长,维护和管理索引需要更多存储空间,并增加相关成本。
- **用户体验**: 碎片化的数据可用性可能导致提供商锁定,迫使用户依赖多个 RPC 提供商来访问不同协议上的所有数字资产。

## 开发进展

Aura 及其功能的开发进展可以在我们的 GitHub 仓库中找到 [https://github.com/metaplex-foundation/aura/](https://github.com/metaplex-foundation/aura/)
