---
title: 创建压缩 NFT
metaTitle: 创建压缩 NFT | Metaplex CLI
description: 在默克尔树中铸造压缩 NFT
---

`mplx bg nft create` 命令在现有的默克尔树中铸造压缩 NFT。如果您还没有默克尔树，请先[创建](/dev-tools/cli/bubblegum/create-tree)一棵。

## 基本用法

### 交互式向导（推荐）

```bash
mplx bg nft create --wizard
```

### 指定特定树

```bash
mplx bg nft create my-tree --wizard
```

### 基于文件创建

```bash
mplx bg nft create my-tree --image ./nft.png --json ./metadata.json
```

### 基于 URI 创建

```bash
mplx bg nft create my-tree --name "My NFT" --uri "https://example.com/metadata.json"
```

## 参数

| 参数 | 描述 |
|----------|-------------|
| `TREE` | 树名称（已保存）或默克尔树地址（向导模式下可选） |

## 选项

| 选项 | 描述 |
|--------|-------------|
| `--wizard` | 使用交互式向导 |
| `--name <value>` | NFT 名称 |
| `--uri <value>` | 现有元数据 URI |
| `--json <value>` | JSON 元数据文件路径（需要 `--image`） |
| `--image <value>` | 图片文件路径 |
| `--description <value>` | NFT 描述 |
| `--attributes <value>` | "trait:value,trait:value" 格式的属性 |
| `--animation <value>` | 动画/视频文件路径 |
| `--project-url <value>` | 外部项目 URL |
| `--symbol <value>` | 链上符号 |
| `--royalties <value>` | 版税百分比（0-100） |
| `--collection <value>` | 集合铸造地址（[Metaplex Core 集合](/smart-contracts/core/collections)） |
| `--owner <value>` | 叶子所有者公钥（默认为付款者） |

## 全局标志

| 标志 | 描述 |
|------|-------------|
| `-c, --config <value>` | 配置文件路径。默认为 `~/.config/mplx/config.json` |
| `-k, --keypair <value>` | 密钥对文件或 Ledger 路径（例如：`usb://ledger?key=0`） |
| `-r, --rpc <value>` | 集群的 RPC URL |
| `--json` | 以 JSON 格式输出 |

## 示例

1. 使用向导创建：

```bash
mplx bg nft create --wizard
```

1. 使用向导指定特定树创建：

```bash
mplx bg nft create my-tree --wizard
```

1. 使用现有元数据 URI 创建：

```bash
mplx bg nft create my-tree --name "My NFT" --uri "https://arweave.net/xxx"
```

1. 使用本地文件创建：

```bash
mplx bg nft create my-tree --image ./artwork.png --json ./metadata.json
```

1. 使用元数据标志创建：

```bash
mplx bg nft create my-tree \
  --name "Cool NFT #1" \
  --image ./nft.png \
  --description "一个非常酷的压缩 NFT" \
  --attributes "Background:Blue,Eyes:Laser,Hat:Crown" \
  --royalties 5
```

1. 在集合中创建：

```bash
mplx bg nft create my-tree \
  --name "Collection Item #1" \
  --image ./nft.png \
  --collection 7kPqYxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## 输出

```text
Uploading image... ✓
Uploading metadata... ✓
Creating compressed NFT... ✓

--------------------------------
Compressed NFT Created!

Tree: my-tree
Owner: YourWalletAddressHere
Asset ID: CNFTAssetIdHere

Signature: 5xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Explorer: https://solscan.io/tx/5xxx...
--------------------------------
```

## 元数据 JSON 格式

使用 `--json` 时，您的元数据文件应遵循以下结构：

```json
{
  "name": "My NFT",
  "symbol": "MNFT",
  "description": "NFT 描述",
  "seller_fee_basis_points": 500,
  "attributes": [
    { "trait_type": "Background", "value": "Blue" },
    { "trait_type": "Rarity", "value": "Rare" }
  ],
  "properties": {
    "files": [
      { "uri": "", "type": "image/png" }
    ]
  }
}
```

`image` 字段将自动填充上传的图片 URI。

## 注意事项

- 树参数可以是已保存的树名称或公钥地址
- 如果树是私有的，您必须是树权限才能铸造
- 如果树是公开的，任何人都可以铸造 NFT
- RPC 必须支持 DAS API
- **仅限 Bubblegum V2** - 这些命令适用于 Bubblegum V2 树，并使用 [Metaplex Core 集合](/smart-contracts/core/collections)（不是 Token Metadata 集合）
- 属性格式：`"trait:value,trait:value"` - 冒号分隔 trait 和 value，逗号分隔对
