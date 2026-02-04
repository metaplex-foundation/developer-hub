---
title: 为代币添加元数据
metaTitle: 为代币添加元数据 | Metaplex CLI
description: 为没有元数据账户的现有代币添加元数据
---

`mplx toolbox token add-metadata` 命令为没有元数据账户的现有代币添加元数据。这对于通过 `spl-token` CLI 或其他不自动创建 Token Metadata 账户的工具创建的代币非常有用。

## 基本用法

```bash
mplx toolbox token add-metadata <mint> --name "My Token" --symbol "MTK"
```

## 参数

| 参数 | 描述 |
|----------|-------------|
| `MINT` | 代币的铸造地址 |

## 选项

| 选项 | 描述 |
|--------|-------------|
| `--name <value>` | 代币名称（必需） |
| `--symbol <value>` | 代币符号，2-6个字符（必需） |
| `--uri <value>` | 指向元数据 JSON 的 URI（与 --image、--description 互斥） |
| `--description <value>` | 代币描述（上传元数据时使用） |
| `--image <value>` | 代币图片文件路径（上传元数据时使用） |
| `--is-mutable` | 元数据是否可以在以后更新（默认：true） |
| `--no-is-mutable` | 使元数据不可变 |

## 全局标志

| 标志 | 描述 |
|------|-------------|
| `-c, --config <value>` | 配置文件路径。默认为 `~/.config/mplx/config.json` |
| `-k, --keypair <value>` | 密钥对文件或 Ledger 路径（例如：`usb://ledger?key=0`） |
| `-r, --rpc <value>` | 集群的 RPC URL |

## 示例

1. 添加基本元数据：
```bash
mplx toolbox token add-metadata <mintAddress> --name "My Token" --symbol "MTK"
```

2. 使用现有 URI 添加元数据：
```bash
mplx toolbox token add-metadata <mintAddress> --name "My Token" --symbol "MTK" --uri "https://example.com/metadata.json"
```

3. 使用图片和描述添加元数据（将自动上传）：
```bash
mplx toolbox token add-metadata <mintAddress> \
  --name "My Token" \
  --symbol "MTK" \
  --description "一个很棒的代币" \
  --image ./logo.png
```

4. 添加不可变元数据。注意：此操作不可逆！
```bash
mplx toolbox token add-metadata <mintAddress> --name "My Token" --symbol "MTK" --no-is-mutable
```

## 输出

```
--------------------------------

    Add Token Metadata

--------------------------------
Checking for existing metadata... ✓
No existing metadata found
Verifying mint authority... ✓
Mint authority verified
Uploading image... ✓
Uploading metadata JSON... ✓
Creating metadata account... ✓

--------------------------------
Metadata created successfully!

Token Details:
Name: My Token
Symbol: MTK

Mint Address: <mintAddress>
Explorer: https://solscan.io/account/<mintAddress>

Transaction Signature: <signature>
Explorer: https://solscan.io/tx/<signature>
--------------------------------
```

## 要求

- **需要铸造权限**：您必须是代币的铸造权限持有者才能添加元数据
- **无现有元数据**：代币不能已经有元数据账户。使用 `mplx toolbox token update` 修改现有元数据

## 注意事项

- 如果代币已有元数据，命令将显示现有元数据并建议使用 update 命令
- 如果铸造权限已被撤销，则无法添加元数据
- 在不提供 `--uri` 的情况下提供 `--image` 和/或 `--description` 时，CLI 将自动将元数据上传到存储
- `--uri` 标志与 `--image` 和 `--description` 互斥
- 使用 `--no-is-mutable` 标志时请小心，此操作不可逆
