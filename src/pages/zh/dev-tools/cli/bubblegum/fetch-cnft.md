---
title: 获取压缩 NFT
metaTitle: 获取压缩 NFT | Metaplex CLI
description: 检索压缩 NFT 数据和默克尔证明
---

`mplx bg nft fetch` 命令使用 DAS（Digital Asset Standard）API 检索压缩 NFT 的资产数据和默克尔证明。

## 基本用法

```bash
mplx bg nft fetch <assetId>
```

### 下载到文件

```bash
mplx bg nft fetch <assetId> --download --output ./nfts
```

### 仅获取证明

```bash
mplx bg nft fetch <assetId> --proof-only
```

## 参数

| 参数 | 描述 |
|----------|-------------|
| `ASSET_ID` | 压缩 NFT 资产 ID（叶子资产 ID） |

## 选项

| 选项 | 描述 |
|--------|-------------|
| `--download` | 将资产数据和证明下载到文件 |
| `--output <value>` | 下载文件的目录路径（需要 `--download`） |
| `--proof-only` | 仅获取和显示默克尔证明 |

## 全局标志

| 标志 | 描述 |
|------|-------------|
| `-c, --config <value>` | 配置文件路径。默认为 `~/.config/mplx/config.json` |
| `-r, --rpc <value>` | 集群的 RPC URL |
| `--json` | 以 JSON 格式输出 |

## 示例

1. 获取并显示 NFT 信息：

```bash
mplx bg nft fetch CNFTAssetIdHere
```

1. 将资产数据下载到文件：

```bash
mplx bg nft fetch CNFTAssetIdHere --download
```

1. 下载到指定目录：

```bash
mplx bg nft fetch CNFTAssetIdHere --download --output ./nft-data
```

1. 仅获取默克尔证明：

```bash
mplx bg nft fetch CNFTAssetIdHere --proof-only
```

1. 以 JSON 格式输出：

```bash
mplx bg nft fetch CNFTAssetIdHere --json
```

## 输出

```text
--------------------------------
Compressed NFT Details

Asset ID: CNFTAssetIdHere
Name: My Compressed NFT
Symbol: CNFT
Description: A beautiful compressed NFT

Compressed: true
Tree: 9hRvTxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Leaf ID: 42
Owner: OwnerWalletAddressHere
Collection: CollectionAddressHere

Metadata URI: https://arweave.net/xxx
Image: https://arweave.net/yyy

Mutable: true
Burnt: false

Merkle Proof:
  Root: RootHashHere
  Node Index: 42
  Proof Length: 6 nodes
  Tree ID: 9hRvTxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

Royalty:
  Basis Points: 500 (5%)
  Primary Sale: No

Creators:
  CreatorAddress1 (100%) ✓

--------------------------------
```

## 下载的文件

使用 `--download` 时，会创建两个文件：

- `<assetId>-asset.json` - 包含元数据、所有权、压缩信息的完整资产数据
- `<assetId>-proof.json` - 写入操作（转移、销毁、更新）所需的默克尔证明

## 注意事项

- RPC 必须支持 DAS API
- 标准 Solana RPC 端点会显示 "Asset not found or RPC does not support DAS API" 错误
- 默克尔证明对于转移、销毁和更新操作至关重要
- `--json` 标志输出机器可读的 JSON，用于脚本编写
