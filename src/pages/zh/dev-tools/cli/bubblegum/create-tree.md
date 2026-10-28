---
title: 创建树
metaTitle: 创建默克尔树 | Metaplex CLI
description: 使用 Metaplex CLI 的 mplx bg tree create 命令为压缩 NFT 创建 Bubblegum V2 默克尔树，并介绍 --canopyDepth 0 等树冠深度选项。
keywords:
  - mplx cli
  - bg tree create
  - Bubblegum V2
  - merkle tree
  - canopy depth
  - compressed NFTs
  - cNFT tree
about:
  - Bubblegum V2 Merkle tree creation
  - Metaplex CLI
proficiencyLevel: Beginner
created: '02-23-2026'
updated: '10-28-2026'
---

## 摘要

`mplx bg tree create` 命令创建一棵用于存储压缩 NFT（cNFT）的 [Bubblegum V2](/smart-contracts/bubblegum-v2) [默克尔树](/smart-contracts/bubblegum-v2/concurrent-merkle-trees)。在铸造任何压缩 NFT 之前，您必须先创建一棵树。

- 使用 `--wizard` 交互式创建，或通过 `--maxDepth`、`--maxBufferSize` 和 `--canopyDepth` 直接创建
- `--canopyDepth` 接受任意整数，包括 `0`（无树冠的树）（CLI 0.4.5 及更高版本）
- 当标志组合不在推荐配置中时会显示警告，但仍会创建树
- 树的大小和树冠深度在创建时固定，之后无法更改

{% callout type="note" %}
这将创建一棵 **Bubblegum V2** 树。V2 树与 V1 不兼容，并使用 [Metaplex Core 集合](/smart-contracts/core/collections)。
{% /callout %}

## 基本用法

该命令可以以交互式向导运行，也可以直接传入全部三个树大小标志运行。

### 交互式向导（推荐）

```bash {% title="使用向导创建树" %}
mplx bg tree create --wizard
```

### 直接创建

```bash {% title="使用显式标志创建树" %}
mplx bg tree create --maxDepth 14 --maxBufferSize 64 --canopyDepth 8 --name "my-tree"
```

直接创建需要同时提供 `--maxDepth`、`--maxBufferSize` 和 `--canopyDepth`。缺少其中任何一个时，命令会以 `You must either use --wizard or provide all required flags: --maxDepth, --maxBufferSize, --canopyDepth` 退出。

## 选项

树大小标志不能与 `--wizard` 同时使用。

| 选项 | 描述 |
|--------|-------------|
| `--wizard` | 使用交互式向导创建树 |
| `--maxDepth <value>` | 树的最大深度（决定最大 NFT 数量） |
| `--maxBufferSize <value>` | 并发更改的最大缓冲区大小 |
| `--canopyDepth <value>` | 缓存在链上的树顶层级数。`0` 也有效，会创建无树冠的树 |
| `--public` | 将树设为公开（允许任何人铸造 NFT） |
| `--name <value>` | 便于引用的短名称 |

## 全局标志

这些标志是所有 `mplx` 交易命令共用的，用于控制所使用的配置、签名者和集群。

| 标志 | 描述 |
|------|-------------|
| `-c, --config <value>` | 配置文件路径。默认为 `~/.config/mplx/config.json` |
| `-k, --keypair <value>` | 密钥对文件或 Ledger 路径（例如：`usb://ledger?key=0`） |
| `-p, --payer <value>` | 付款人密钥对文件或 Ledger 路径 |
| `-r, --rpc <value>` | 集群的 RPC URL |
| `--commitment <option>` | 承诺级别：`processed`、`confirmed` 或 `finalized` |
| `--json` | 以 JSON 格式输出 |
| `--log-level <option>` | 日志级别：`debug`、`warn`、`error`、`info` 或 `trace`（默认：`info`） |

## 推荐树配置

CLI 内置七种推荐配置，向导会将它们作为选项提供：

| 最大 NFT | 最大深度 | 缓冲区大小 | 树冠深度 | 每笔交易证明字节数 | 估计成本 |
|----------|-----------|-------------|--------------|--------------------|----------------|
| 16,384 | 14 | 64 | 8 | 192 | ~0.34 SOL |
| 65,536 | 16 | 64 | 10 | 192 | ~0.71 SOL |
| 262,144 | 18 | 64 | 12 | 192 | ~2.10 SOL |
| 1,048,576 | 20 | 1024 | 13 | 224 | ~8.50 SOL |
| 16,777,216 | 24 | 2048 | 15 | 288 | ~26.12 SOL |
| 67,108,864 | 26 | 2048 | 17 | 288 | ~70.82 SOL |
| 1,073,741,824 | 30 | 2048 | 17 | 416 | ~72.65 SOL |

其他标志组合同样会创建树，但 CLI 会先输出 `This configuration is not in our recommended list. Use --wizard to see recommended configurations.`

## 无树冠的树（`--canopyDepth 0`）

传入 `--canopyDepth 0` 会创建一棵不在链上缓存任何证明节点的树。这样树账户最小，租金也最低。代价是每次转移、销毁、委托或更新都必须发送完整证明（`maxDepth` × 32 字节）。这会占用更多交易空间，也更难在同一笔交易中将 Bubblegum 指令与其他程序组合。各树冠深度的成本对比请参阅[默克尔树树冠](/smart-contracts/bubblegum-v2/merkle-tree-canopy)页面。

```bash {% title="创建无树冠的树" %}
mplx bg tree create --maxDepth 14 --maxBufferSize 64 --canopyDepth 0 --name "no-canopy-tree"
```

{% callout type="note" %}
`--canopyDepth 0` 需要 `@metaplex-foundation/cli` 0.4.5 或更高版本。无树冠的树不属于推荐配置，因此 CLI 会在创建前输出 "not in our recommended list" 警告。
{% /callout %}

## 示例

以下是创建树最常用的方式：

1. 使用向导创建树：

```bash {% title="向导" %}
mplx bg tree create --wizard
```

1. 创建用于测试的小树：

```bash {% title="小型测试树" %}
mplx bg tree create --maxDepth 14 --maxBufferSize 64 --canopyDepth 8 --name "test-tree"
```

1. 创建公开树（任何人都可以铸造）：

```bash {% title="公开树" %}
mplx bg tree create --maxDepth 14 --maxBufferSize 64 --canopyDepth 8 --public --name "public-tree"
```

## 创建树的输出

成功运行后会输出树地址、参数和浏览器链接：

```text {% title="输出示例" %}
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

三个参数决定了树的容量、可同时处理的更改数量，以及每笔交易所需的证明数据量：

- **最大深度**：决定 NFT 的最大数量：`2^maxDepth`（深度 14 = 16,384 NFT）
- **最大缓冲区大小**：控制可以同时进行多少次并发修改
- **树冠深度**：在链上存储树的顶部层级，因此每笔交易只需发送 `maxDepth - canopyDepth` 个证明节点。`0` 表示不存储任何层级

## 快速参考

| 项目 | 值 |
|------|-------|
| 命令 | `mplx bg tree create` |
| 必需（直接模式） | `--maxDepth`、`--maxBufferSize`、`--canopyDepth` |
| `--canopyDepth` 最小值 | `0`（CLI 0.4.5+） |
| 树版本 | 仅限 [Bubblegum V2](/smart-contracts/bubblegum-v2)，不支持 Bubblegum V1 |
| 下一步 | [创建压缩 NFT](/dev-tools/cli/bubblegum/create-cnft) |
| 源码 | [GitHub: metaplex-foundation/cli](https://github.com/metaplex-foundation/cli) |

## 注意事项

- 树名称在每个网络中必须唯一（devnet/mainnet）
- 树名称可以包含字母、数字、连字符、下划线和空格（1-50 个字符）
- 租金成本在创建树时一次性支付
- 树创建后无法调整大小，树冠深度也无法更改
- 0.4.5 之前的 CLI 会拒绝 `--canopyDepth 0`；运行 `mplx --version` 检查您的版本
- **警告**：公开树允许任何人铸造 NFT - 请谨慎使用
