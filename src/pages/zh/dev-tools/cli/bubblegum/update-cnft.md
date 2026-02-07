---
title: 更新压缩 NFT
metaTitle: 更新压缩 NFT | Metaplex CLI
description: 更新压缩 NFT 的元数据
---

`mplx bg nft update` 命令更新压缩 NFT 的链下元数据。您可以更新单个字段，也可以使用交互式编辑器修改完整的元数据 JSON。

## 基本用法

### 更新单个字段
```bash
mplx bg nft update <assetId> --name "New Name"
```

### 更新多个字段
```bash
mplx bg nft update <assetId> --name "New Name" --description "New Description" --image ./new-image.png
```

### 交互式编辑器
```bash
mplx bg nft update <assetId> --editor
```

## 参数

| 参数 | 描述 |
|----------|-------------|
| `ASSET_ID` | 要更新的压缩 NFT 资产 ID |

## 选项

| 选项 | 描述 |
|--------|-------------|
| `--name <value>` | NFT 的新名称 |
| `--symbol <value>` | NFT 的新符号 |
| `--description <value>` | NFT 的新描述 |
| `--image <value>` | 新图片文件路径 |
| `--uri <value>` | 新元数据 URI（更新字段的替代方法） |
| `-e, --editor` | 在默认编辑器中打开元数据 JSON |

## 全局标志

| 标志 | 描述 |
|------|-------------|
| `-c, --config <value>` | 配置文件路径。默认为 `~/.config/mplx/config.json` |
| `-k, --keypair <value>` | 密钥对文件或 Ledger 路径（例如：`usb://ledger?key=0`） |
| `-r, --rpc <value>` | 集群的 RPC URL |
| `--json` | 以 JSON 格式输出 |

## 示例

1. 更新名称：
```bash
mplx bg nft update CNFTAssetIdHere --name "Updated NFT Name"
```

2. 更新名称和描述：
```bash
mplx bg nft update CNFTAssetIdHere \
  --name "New Name" \
  --description "此 NFT 已更新"
```

3. 使用新图片更新：
```bash
mplx bg nft update CNFTAssetIdHere \
  --name "Refreshed NFT" \
  --image ./new-artwork.png
```

4. 替换整个元数据 URI：
```bash
mplx bg nft update CNFTAssetIdHere --uri "https://arweave.net/xxx"
```

5. 使用交互式编辑器：
```bash
mplx bg nft update CNFTAssetIdHere --editor
```

## 输出

```
--------------------------------

  Compressed NFT Update

--------------------------------
Fetching asset and proof data... ✓
Uploading Image... ✓
Uploading JSON file... ✓
Updating compressed NFT... ✓

--------------------------------
  Compressed NFT: Updated NFT Name
  Asset ID: CNFTAssetIdHere
  Signature: 5xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  Explorer: https://solscan.io/tx/5xxx...
--------------------------------
```

## 权限要求

要更新压缩 NFT，您必须是以下之一：
- **树权限** - 如果 NFT 不在集合中
- **集合更新权限** - 如果 NFT 属于 [Metaplex Core 集合](/smart-contracts/core/collections)

**注意**：NFT 的所有者无法更新它 - 这与传统 NFT 不同。

## 注意事项

- RPC 必须支持 DAS API
- 如果更新字段（不是 URI），会获取现有元数据并与您的更改合并
- 如果元数据获取失败，您必须提供所有字段以创建新元数据
- `--uri` 标志与 `--image`、`--description` 和 `--editor` 互斥
- `--editor` 标志与所有其他更新标志互斥
- 编辑器使用 `$EDITOR` 环境变量，或默认使用 nano/notepad
