---
title: 创建树
metaTitle: 创建默克尔树 | Metaplex CLI
description: 为压缩 NFT 创建默克尔树
---

`mplx bg tree create` 命令创建一棵用于存储压缩 NFT 的默克尔树。在铸造任何压缩 NFT 之前，您必须创建一棵树。

{% callout type="note" %}
这将创建一棵 **Bubblegum V2** 树。V2 树与 V1 不兼容，并使用 [Metaplex Core 集合](/smart-contracts/core/collections)。
{% /callout %}

## 基本用法

### 交互式向导（推荐）
```bash
mplx bg tree create --wizard
```

### 直接创建
```bash
mplx bg tree create --maxDepth 14 --maxBufferSize 64 --canopyDepth 8 --name "my-tree"
```

## 选项

| 选项 | 描述 |
|--------|-------------|
| `--wizard` | 使用交互式向导创建树 |
| `--maxDepth <value>` | 树的最大深度（决定最大 NFT 数量） |
| `--maxBufferSize <value>` | 并发更改的最大缓冲区大小 |
| `--canopyDepth <value>` | 用于验证优化的树冠深度 |
| `--public` | 将树设为公开（允许任何人铸造 NFT） |
| `--name <value>` | 便于引用的短名称 |

## 全局标志

| 标志 | 描述 |
|------|-------------|
| `-c, --config <value>` | 配置文件路径。默认为 `~/.config/mplx/config.json` |
| `-k, --keypair <value>` | 密钥对文件或 Ledger 路径（例如：`usb://ledger?key=0`） |
| `-r, --rpc <value>` | 集群的 RPC URL |
| `--json` | 以 JSON 格式输出 |

## 树配置

CLI 提供针对不同集合大小优化的推荐配置：

| 最大 NFT | 最大深度 | 缓冲区大小 | 树冠深度 | 估计成本 |
|----------|-----------|-------------|--------------|----------------|
| 16,384 | 14 | 64 | 8 | ~0.34 SOL |
| 65,536 | 16 | 64 | 10 | ~0.71 SOL |
| 262,144 | 18 | 64 | 12 | ~2.10 SOL |
| 1,048,576 | 20 | 1024 | 13 | ~8.50 SOL |
| 16,777,216 | 24 | 2048 | 15 | ~26.12 SOL |

## 示例

1. 使用向导创建树：
```bash
mplx bg tree create --wizard
```

2. 创建用于测试的小树：
```bash
mplx bg tree create --maxDepth 14 --maxBufferSize 64 --canopyDepth 8 --name "test-tree"
```

3. 创建公开树（任何人都可以铸造）：
```bash
mplx bg tree create --maxDepth 14 --maxBufferSize 64 --canopyDepth 8 --public --name "public-tree"
```

## 输出

```
--------------------------------
Tree Created Successfully!

Tree Name: my-collection-tree
Tree Address: 9hRvTxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Max Depth: 14
Max Buffer Size: 64
Canopy Depth: 8
Public Tree: No
Max NFTs: 16,384

Transaction: 5xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Explorer: https://solscan.io/tx/5xxx...
Tree Explorer: https://solscan.io/account/9hRv...
--------------------------------
```

## 理解树参数

- **最大深度**：决定 NFT 的最大数量：`2^maxDepth`（深度 14 = 16,384 NFT）
- **最大缓冲区大小**：控制可以同时进行多少次并发修改
- **树冠深度**：在链上存储部分证明，减少交易大小

## 注意事项

- 树名称在每个网络中必须唯一（devnet/mainnet）
- 树名称可以包含字母、数字、连字符、下划线和空格（1-50 个字符）
- 租金成本在创建树时一次性支付
- 树创建后无法调整大小
- **警告**：公开树允许任何人铸造 NFT - 请谨慎使用
