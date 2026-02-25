---
title: Bubblegum 概述
metaTitle: Bubblegum V2（压缩 NFT）| Metaplex CLI
description: 使用 Bubblegum V2 程序创建和管理压缩 NFT
---

{% callout type="note" %}
这些 CLI 命令仅适用于 **Bubblegum V2**。Bubblegum V2 使用 [Metaplex Core 集合](/smart-contracts/core/collections)，与 Bubblegum V1 树或 Token Metadata 集合不兼容。
{% /callout %}

Bubblegum 是 Metaplex 的压缩 NFT（cNFT）程序，允许您以传统 NFT 成本的一小部分创建 NFT。通过使用并发默克尔树进行状态压缩，在初始树创建成本之后，压缩 NFT 只需支付交易成本即可铸造。

## 核心概念

### 默克尔树
压缩 NFT 存储在默克尔树中，而不是单独的链上账户中。在铸造任何压缩 NFT 之前，您必须创建一棵树。树的大小决定了：
- 可以存储的最大 NFT 数量
- 预付租金成本（创建树时一次性支付）
- 操作所需的证明大小

### 集合
Bubblegum V2 使用 [Metaplex Core 集合](/smart-contracts/core/collections)（不是 Token Metadata 集合）。首先创建一个 Core 集合：

```bash
mplx core collection create --wizard
```

### RPC 要求

压缩 NFT 操作需要支持 [DAS（Digital Asset Standard）API](/rpc-providers#metaplex-das-api) 的 RPC 端点。标准 Solana RPC 端点不支持 DAS，无法用于获取、更新、转移或销毁压缩 NFT。

请参阅 [RPC 提供商](/rpc-providers) 页面获取支持 DAS 的提供商列表。

## 命令结构

所有 Bubblegum 命令遵循以下模式：

```bash
mplx bg <resource> <command> [options]
```

### 可用命令

**树管理**
- `mplx bg tree create` - 创建新的默克尔树
- `mplx bg tree list` - 列出所有已保存的树

**NFT 操作**
- `mplx bg nft create` - 铸造压缩 NFT
- `mplx bg nft fetch` - 获取 NFT 数据和默克尔证明
- `mplx bg nft update` - 更新 NFT 元数据
- `mplx bg nft transfer` - 将 NFT 转移给新所有者
- `mplx bg nft burn` - 永久销毁 NFT

## 快速开始

1. 配置支持 DAS 的 RPC：

```bash
mplx config rpcs add <name> <url>
```

1. 创建默克尔树：

```bash
mplx bg tree create --wizard
```

1. 创建集合（可选但推荐）：

```bash
mplx core collection create --wizard
```

1. 铸造压缩 NFT：

```bash
mplx bg nft create my-tree --wizard
```

## 权限模型

| 操作 | 所需权限 |
|-----------|-------------------|
| 创建 NFT | 树权限（或如果树是公开的则任何人） |
| 更新 NFT | 树权限或集合更新权限 |
| 转移 NFT | 当前所有者或代理人 |
| 销毁 NFT | 当前所有者或代理人 |

## 下一步

- [创建默克尔树](/dev-tools/cli/bubblegum/create-tree)
- [创建压缩 NFT](/dev-tools/cli/bubblegum/create-cnft)
- [获取压缩 NFT](/dev-tools/cli/bubblegum/fetch-cnft)
