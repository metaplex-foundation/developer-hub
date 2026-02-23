---
title: 树列表
metaTitle: 默克尔树列表 | Metaplex CLI
description: 查看所有已保存的 Bubblegum 默克尔树
---

`mplx bg tree list` 命令显示您创建并本地保存的所有默克尔树。

## 基本用法

```bash
mplx bg tree list
```

### 按网络筛选

```bash
mplx bg tree list --network devnet
```

## 选项

| 选项 | 描述 |
|--------|-------------|
| `--network <value>` | 按网络筛选树（mainnet、devnet、testnet、localnet） |

## 全局标志

| 标志 | 描述 |
|------|-------------|
| `-c, --config <value>` | 配置文件路径。默认为 `~/.config/mplx/config.json` |
| `--json` | 以 JSON 格式输出 |

## 示例

1. 列出所有树：

```bash
mplx bg tree list
```

1. 仅列出 devnet 树：

```bash
mplx bg tree list --network devnet
```

1. 仅列出 mainnet 树：

```bash
mplx bg tree list --network mainnet
```

## 输出

```text
Saved Trees:
┌─────────┬────────────────────────────────────────────┬─────────┬───────────┬────────┬────────────┐
│ Name    │ Address                                    │ Network │ Max NFTs  │ Public │ Created    │
├─────────┼────────────────────────────────────────────┼─────────┼───────────┼────────┼────────────┤
│ my-tree │ 9hRvTxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx   │ devnet  │ 16,384    │ No     │ 1/15/2025  │
│ prod    │ 7kPqYxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx   │ mainnet │ 1,048,576 │ No     │ 1/10/2025  │
└─────────┴────────────────────────────────────────────┴─────────┴───────────┴────────┴────────────┘

Total: 2 trees
```

## 使用树名称

保存带有名称的树后，您可以在其他命令中通过名称引用它：

```bash
# 使用树名称
mplx bg nft create my-tree --wizard

# 使用树地址（也可以）
mplx bg nft create 9hRvTxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx --wizard
```

## 注意事项

- 树按网络保存，因此相同的名称可以存在于不同的网络中
- 树数据本地存储在 `~/.config/mplx/trees.json`
- 如果没有找到树，命令会建议使用 `mplx bg tree create --wizard` 创建一棵
