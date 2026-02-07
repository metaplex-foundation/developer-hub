---
title: 转移压缩 NFT
metaTitle: 转移压缩 NFT | Metaplex CLI
description: 将压缩 NFT 转移给新所有者
---

`mplx bg nft transfer` 命令将压缩 NFT 的所有权转移到新的钱包地址。

## 基本用法

```bash
mplx bg nft transfer <assetId> <newOwner>
```

## 参数

| 参数 | 描述 |
|----------|-------------|
| `ASSET_ID` | 要转移的压缩 NFT 资产 ID |
| `NEW_OWNER` | 新所有者的公钥 |

## 全局标志

| 标志 | 描述 |
|------|-------------|
| `-c, --config <value>` | 配置文件路径。默认为 `~/.config/mplx/config.json` |
| `-k, --keypair <value>` | 密钥对文件或 Ledger 路径（例如：`usb://ledger?key=0`） |
| `-r, --rpc <value>` | 集群的 RPC URL |
| `--json` | 以 JSON 格式输出 |

## 示例

转移给新所有者：
```bash
mplx bg nft transfer CNFTAssetIdHere RecipientWalletAddressHere
```


## 输出

```
Fetching asset and proof data... ✓
Verifying ownership... ✓
Executing transfer... ✓
Compressed NFT transferred successfully!

--------------------------------
Compressed NFT Transferred!

Asset ID: CNFTAssetIdHere
From: OriginalOwnerAddressHere
To: NewOwnerAddressHere
Tree: 9hRvTxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

Signature: 5xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Explorer: https://solscan.io/tx/5xxx...
--------------------------------
```

## 权限要求

要转移压缩 NFT，您必须是以下之一：
- **当前所有者** - 当前拥有 NFT 的钱包
- **代理人** - 被授予 NFT 权限的钱包

## 注意事项

- RPC 必须支持 DAS API
- 转移是原子操作 - 要么完全完成，要么完全失败
- 新所有者立即获得完全所有权
- 与传统 NFT 不同，压缩 NFT 转移不会创建新的代币账户
- 资产 ID 在转移后保持不变（只有所有者改变）
