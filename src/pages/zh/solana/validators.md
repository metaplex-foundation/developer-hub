---
# remember to update dates also in /components/products/guides/index.js
title: 验证者和质押
metaTitle: 验证者和质押 | 指南
description: Solana 验证者和质押机制概述。
created: '04-19-2025'
updated: '04-19-2025'
keywords:
  - Solana validators
  - staking SOL
  - Proof of Stake
  - Solana consensus
  - delegation
about:
  - Solana validators
  - staking
  - Proof of Stake
  - delegation
proficiencyLevel: Beginner
faqs:
  - q: What do Solana validators do?
    a: Validators process transactions, generate new blocks, and validate the blockchain state to ensure accuracy and prevent double-spending. They participate in consensus by staking SOL tokens.
  - q: How do I stake SOL tokens?
    a: You can stake SOL by either running a validator node (direct staking) or delegating your SOL to an existing validator using a compatible wallet like Phantom or Solflare.
  - q: How long does it take for staked SOL to become active?
    a: When you delegate SOL, it takes approximately 2-3 epochs (2-3 days) for your stake to become active and start earning rewards. Deactivation takes the same timeframe.
  - q: What factors should I consider when choosing a validator?
    a: Consider the validator's performance and uptime, commission rate (typically 5-10%), total stake amount, and their contribution to network decentralization.
---
## 概述

验证者负责处理交易、生成新区块以及验证区块链的状态，以确保准确性并防止双重支付。它们通过对其他验证者提出的区块的合法性进行投票来参与共识机制，这有助于维护网络的完整性和安全性。验证者还通过质押他们的 SOL 代币为网络的去中心化做出贡献，这使他们的激励与网络的健康和稳定性保持一致。

验证者经常参与治理决策，提供见解并对影响网络未来的提案进行投票。许多验证者还通过提供教育资源、运行社区节点以及支持增强生态系统的去中心化应用程序（dApps）和工具的开发来为社区做出贡献。

## Solana 的验证者网络

### 权益证明和历史证明

Solana 使用权益证明（PoS）和历史证明（PoH）共识机制的独特组合：

- **权益证明**：验证者必须质押 SOL 代币才能参与共识。质押的数量会影响他们的投票权重和潜在奖励。
- **历史证明**：一种加密时钟，提供事件的历史记录，允许验证者在不需要通信的情况下就事件的时间达成一致。

这种混合方法使 Solana 能够实现高交易吞吐量（最高 65,000 TPS）和低延迟（400 毫秒区块时间）。

### 验证者经济学

验证者通过以下方式获得奖励：

1. **交易费用**：用户支付的交易费用的一部分
2. **通胀奖励**：分配给验证者和委托者的新 SOL 代币
3. **MEV（最大可提取价值）**：通过影响交易顺序可以提取的额外价值

## Solana 上的质押

### 质押机制

在 Solana 上质押可以通过两种主要方式完成：

1. **直接质押（验证者）**：运行验证者节点并质押您自己的 SOL
2. **委托（委托者）**：将您的 SOL 委托给现有验证者，而无需自己运行节点

### 委托流程

将 SOL 委托给验证者：

1. 根据性能、佣金率和可靠性选择验证者
2. 使用兼容的钱包（Phantom、Solflare 等）创建质押账户
3. 将 SOL 委托给您选择的验证者
4. 监控您的质押奖励，这些奖励会自动复投

### 质押激活和停用

- **激活**：当您委托 SOL 时，大约需要 2-3 个 epoch（2-3 天）才能使您的质押变为活跃状态并开始赚取奖励
- **停用**：当您决定取消委托时，大约需要 2-3 个 epoch 才能使您的 SOL 完全流动

### 选择验证者

选择验证者时请考虑以下因素：
- **性能**：正常运行时间和区块生产历史
- **佣金**：验证者保留的奖励百分比（通常为 5-10%）
- **总质押量**：更高的质押可能表明信任，但也会导致中心化
- **去中心化影响**：考虑支持较小的验证者以增强网络去中心化

## 工具和资源

### 质押工具
- [Solana Beach](https://solanabeach.io/validators) - 浏览器和验证者统计数据
- [Validators.app](https://www.validators.app/) - 详细的验证者性能指标
- [Stakeview.app](https://stakeview.app/) - 验证者排名和比较

### 支持质押的钱包
- Phantom
- Solflare
- Ledger
- Math Wallet

## 常用术语

- **Epoch**：Solana 中的一个时间段（大约 2-3 天），在此期间测量验证者性能并分配奖励
- **佣金**：验证者向委托者收取的质押奖励百分比
- **惩罚**：对验证者不当行为的惩罚，目前尚未在 Solana 上实施
- **投票账户**：验证者用于通过对区块投票来参与共识的账户
- **质押账户**：持有委托的 SOL 代币的账户
