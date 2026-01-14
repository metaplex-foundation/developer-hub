---
title: 常见问题 - Token Metadata 账户大小缩减
metaTitle: Token Metadata 账户大小缩减 | Token Metadata 指南
description: 了解 TM 账户大小缩减的影响。
---

2024 年 10 月 10 日，Metaplex Token Metadata (TM) 程序更改已部署到主网，该更改减少了所有新创建的 metadata 账户的大小。随后在 10 月 25 日，Metaplex 引入了新的 Resize 指令，使现有的 metadata 账户能够调整大小。如果您的产品从 TM 获取任何元数据，此更改可能会影响您。

## "调整大小"资产是什么意思？

调整 NFT 大小可以释放之前在不完全关闭（即销毁）Token Metadata (TM) 账户的情况下无法访问的多余 SOL。

调整大小不会影响您 NFT 的功能，它们只是经过优化以释放 Solana 网络上的空间。

但是，如开发者常见问题中所述，使用 2023 年 8 月和 10 月之前的 SDK 版本的程序将需要更新以处理较小的 Token Metadata 账户。

## 有多少 NFT 账户已调整大小，我可以领取多少 SOL？

截至 2025 年 8 月 15 日，所有 TM NFT metadata 账户都已调整大小。

在最终优化时尚未调整大小的 TM NFT 持有者可以在 [resize.metaplex.com](https://resize.metaplex.com) 领取其 NFT 存储账户归属的 100% 多余 SOL。可领取金额包括：每个 Master Edition 0.0023 多余 SOL，每个 Edition 0.0019 多余 SOL。

## 调整大小有什么好处？

此更新减少了 metadata 账户大小，降低了数据存储成本，同时使 Solana 更轻量、更具成本效益。

优化总共节省了 7,380 MB 的 Solana 网络空间，从而提高了验证器性能，惠及所有 Solana 用户和质押者。

这是使每个 Solana 用户和网络所依赖的验证器基础设施受益的重要一步。

## 我可以在哪里用我的 NFT 领取多余的 SOL？

您可以使用我们在 [resize.metaplex.com](https://resize.metaplex.com) 的免费 UI 领取归属于您 NFT 存储账户的多余 SOL。根据 Metaplex DAO 批准的 MTP-004，领取多余 SOL 的截止日期延长至至少 2027 年 2 月 13 日。这将 NFT 持有者从优化中领取多余 SOL 的总时间延长至至少 28 个月。

## 开发者常见问题

### 谁受到更改的影响？

每个基于我们 Rust SDK 并从 TM 账户反序列化数据且使用非常旧的 SDK 版本的程序和工具都可能受到影响。具体版本可以在[下面](#受影响的-sdk-版本有哪些)找到。

### 大小减少了多少？

账户大小减少如下表所示。

| 账户              | 大小（字节） | 新大小（字节） |
| ----------------- | ------------ | -------------- |
| Metadata          | 679          | 607            |
| Master Edition v1 | 282          | 20             |
| Master Edition v2 | 282          | 20             |
| Edition           | 241          | 42             |

### 受影响的 SDK 版本有哪些？

* **Javascript**：JS SDK（@metaplex-foundation/js 和基于 Umi 的 SDK）不受影响
* **Rust**：Rust SDK 从 v2.0.0 开始兼容（自 2023 年 8 月起可用）
* **Anchor**：Anchor 0.29 及以上版本兼容新大小（自 2023 年 10 月起可用）

### 如何使您的程序兼容？

如果您使用的 SDK 版本比上面列出的更旧，并且正在反序列化 Token Metadata 数据，建议更新使用的包以确保兼容性。

### 我可以在哪里找到帮助和更多信息？

如果阅读完此常见问题后仍有不清楚的地方，请随时加入我们的 [Discord](https://discord.gg/metaplex) 并提出您的问题！
