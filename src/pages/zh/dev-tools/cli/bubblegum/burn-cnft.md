---
title: 销毁压缩 NFT
metaTitle: 销毁压缩 NFT | Metaplex CLI
description: 永久销毁压缩 NFT
---

`mplx bg nft burn` 命令永久销毁压缩 NFT。此操作**不可逆**。

## 基本用法

```bash
mplx bg nft burn <assetId>
```

## 参数

| 参数 | 描述 |
|----------|-------------|
| `ASSET_ID` | 要销毁的压缩 NFT 资产 ID |

## 全局标志

| 标志 | 描述 |
|------|-------------|
| `-c, --config <value>` | 配置文件路径。默认为 `~/.config/mplx/config.json` |
| `-k, --keypair <value>` | 密钥对文件或 Ledger 路径（例如：`usb://ledger?key=0`） |
| `-r, --rpc <value>` | 集群的 RPC URL |
| `--json` | 以 JSON 格式输出 |

## 示例

1. 销毁压缩 NFT：

```bash
mplx bg nft burn CNFTAssetIdHere
```

1. 以 JSON 输出销毁：

```bash
mplx bg nft burn CNFTAssetIdHere --json
```

## 输出

```text
Fetching asset and proof data... ✓
Verifying ownership... ✓
Burning compressed NFT... ✓
Compressed NFT burned successfully!

--------------------------------
Compressed NFT Burned!

Asset ID: CNFTAssetIdHere
Owner: YourWalletAddressHere
Tree: 9hRvTxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

Signature: 5xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Explorer: https://solscan.io/tx/5xxx...
--------------------------------
```

## 权限要求

要销毁压缩 NFT，您必须是以下之一：
- **当前所有者** - 当前拥有 NFT 的钱包
- **代理人** - 被授予 NFT 权限的钱包

## 注意事项

- **警告**：销毁是永久的且不可逆
- RPC 必须支持 DAS API
- 销毁不会从默克尔树中回收租金
- 树的容量不会释放 - 槽位保持占用状态（标记为已销毁）
- 相关元数据保留在存储中，但不再链接
