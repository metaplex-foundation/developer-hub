---
title: 钱包
metaTitle: 钱包 | Metaplex CLI
description: 管理钱包配置
---

在 CLI 中管理钱包配置。您可以添加、列出、删除和设置不同用途的活动钱包。

## 基本用法

```bash
# 创建新钱包
mplx config wallets new --name <name>

# 添加现有钱包
mplx config wallets add <name> <keypairPath>

# 列出所有钱包
mplx config wallets list

# 删除钱包
mplx config wallets remove <name>

# 设置活动钱包
mplx config wallets set <name>
```

## 命令

### 新钱包

创建一个新钱包并将其添加到您的配置中。

```bash
mplx config wallets new --name <name>
```

#### 参数

| 参数 | 描述 |
|----------|-------------|
| `--name` | 钱包的唯一名称 |

#### 示例

```bash
mplx config wallets new --name dev1
```

### 添加钱包

将现有钱包添加到您的配置中。

```bash
mplx config wallets add <name> <keypairPath>
```

#### 参数

| 参数 | 描述 |
|----------|-------------|
| `name` | 钱包的唯一名称 |
| `keypairPath` | 密钥对文件的路径 |

#### 示例

```bash
mplx config wallets add dev1 ~/.config/solana/devnet/dev1.json
```

### 列出钱包

显示所有已配置的钱包。

```bash
mplx config wallets list
```

#### 输出

```
--------------------------------
Wallets
--------------------------------
Name: dev1
Public Key: 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
Active: true

Name: dev2
Public Key: 9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM
Active: false
--------------------------------
```

### 删除钱包

从您的配置中删除钱包。

```bash
mplx config wallets remove <name>
```

#### 参数

| 参数 | 描述 |
|----------|-------------|
| `name` | 要删除的钱包名称 |

#### 示例

```bash
mplx config wallets remove dev2
```

### 设置活动钱包

为您的配置设置活动钱包。

```bash
mplx config wallets set <name>
```

#### 参数

| 参数 | 描述 |
|----------|-------------|
| `name` | 要设置为活动的钱包名称 |

#### 示例

```bash
mplx config wallets set dev1
```

## 配置文件

钱包存储在 `~/.mplx/config.json` 的配置文件中:

```json
{
  "wallets": {
    "dev1": {
      "publicKey": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
      "keypairPath": "~/.config/solana/devnet/dev1.json",
      "active": true
    },
    "dev2": {
      "publicKey": "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
      "keypairPath": "~/.config/solana/devnet/dev2.json",
      "active": false
    }
  }
}
```

## 注意事项

- 钱包名称区分大小写
- 一次只能有一个钱包处于活动状态
- 活动钱包用于所有交易
- 您可以为不同目的添加多个钱包
- 删除活动钱包将自动将另一个钱包设置为活动(如果可用)
- 保持您的密钥对文件安全,永远不要分享它们

## 相关命令

- [RPC](/zh/dev-tools/cli/config/rpcs) - 管理 RPC 端点
- [浏览器](/zh/dev-tools/cli/config/explorer) - 设置首选区块链浏览器
